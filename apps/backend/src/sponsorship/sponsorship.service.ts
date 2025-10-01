import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sponsorship } from './entities/sponsorship.entity';
import { SponsorshipRequest } from './entities/sponsorship-request.entity';
import { User } from '../user/entities/user.entity';
import { StripeService } from '../billing/stripe.service';

export interface CreateSponsorshipRequestDto {
  userId: string;
  country: string;
  reason: string;
  urgency: 'low' | 'medium' | 'high';
  ipAddress?: string;
  userAgent?: string;
}

export interface CreateSponsorshipDto {
  sponsorUserId: string;
  sponsoredUserId: string;
  sponsorshipRequestId: string;
  stripeSubscriptionId: string;
  amount: number;
  currency: string;
  duration: number; // months
}

export interface SponsorshipMatchDto {
  sponsorUserId: string;
  sponsoredUserId: string;
  matchScore: number;
  reasons: string[];
}

@Injectable()
export class SponsorshipService {
  private readonly logger = new Logger(SponsorshipService.name);

  constructor(
    @InjectRepository(Sponsorship)
    private sponsorshipRepository: Repository<Sponsorship>,
    @InjectRepository(SponsorshipRequest)
    private sponsorshipRequestRepository: Repository<SponsorshipRequest>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private stripeService: StripeService,
  ) {}

  async createSponsorshipRequest(dto: CreateSponsorshipRequestDto): Promise<SponsorshipRequest> {
    this.logger.log(`Creating sponsorship request for user: ${dto.userId}`);
    
    const request = this.sponsorshipRequestRepository.create({
      userId: dto.userId,
      country: dto.country,
      reason: dto.reason,
      urgency: dto.urgency,
      ipAddress: dto.ipAddress,
      userAgent: dto.userAgent,
      status: 'pending',
      createdAt: new Date(),
    });

    const savedRequest = await this.sponsorshipRequestRepository.save(request);
    
    // Try to find a match immediately
    await this.findAndCreateMatch(savedRequest.id);
    
    return savedRequest;
  }

  async findAndCreateMatch(requestId: string): Promise<SponsorshipMatchDto | null> {
    this.logger.log(`Finding match for sponsorship request: ${requestId}`);
    
    const request = await this.sponsorshipRequestRepository.findOne({
      where: { id: requestId },
      relations: ['user'],
    });

    if (!request || request.status !== 'pending') {
      return null;
    }

    // Find potential sponsors
    const potentialSponsors = await this.findPotentialSponsors(request);
    
    if (potentialSponsors.length === 0) {
      this.logger.log(`No potential sponsors found for request: ${requestId}`);
      return null;
    }

    // Select the best match
    const bestMatch = this.selectBestMatch(request, potentialSponsors);
    
    if (bestMatch) {
      await this.createSponsorship({
        sponsorUserId: bestMatch.sponsorUserId,
        sponsoredUserId: request.userId,
        sponsorshipRequestId: requestId,
        stripeSubscriptionId: '', // Will be set when subscription is created
        amount: 999, // $9.99 in cents
        currency: 'usd',
        duration: 1, // 1 month initially
      });
    }

    return bestMatch;
  }

  private async findPotentialSponsors(request: SponsorshipRequest): Promise<User[]> {
    // Find users who have active subscriptions and are willing to sponsor
    const sponsors = await this.userRepository
      .createQueryBuilder('user')
      .leftJoin('user.subscriptions', 'subscription')
      .where('subscription.status = :status', { status: 'active' })
      .andWhere('user.sponsorshipEnabled = :enabled', { enabled: true })
      .andWhere('user.sponsorshipCount < user.maxSponsorships')
      .andWhere(
        '(user.country != :country OR (user.country = :country AND :country = :canada))',
        { 
          country: request.country,
          canada: 'CA' // Allow Canadian-to-Canadian sponsorship
        }
      )
      .orderBy('user.sponsorshipCount', 'ASC')
      .limit(10)
      .getMany();

    return sponsors;
  }

  private selectBestMatch(request: SponsorshipRequest, sponsors: User[]): SponsorshipMatchDto | null {
    if (sponsors.length === 0) return null;

    let bestMatch: SponsorshipMatchDto | null = null;
    let highestScore = 0;

    for (const sponsor of sponsors) {
      const score = this.calculateMatchScore(request, sponsor);
      
      if (score > highestScore) {
        highestScore = score;
        bestMatch = {
          sponsorUserId: sponsor.id,
          sponsoredUserId: request.userId,
          matchScore: score,
          reasons: this.getMatchReasons(request, sponsor),
        };
      }
    }

    return bestMatch;
  }

  private calculateMatchScore(request: SponsorshipRequest, sponsor: User): number {
    let score = 0;

    // Base score for having an active subscription
    score += 50;

    // Bonus for fewer current sponsorships (more available capacity)
    const capacityRatio = 1 - (sponsor.sponsorshipCount / sponsor.maxSponsorships);
    score += capacityRatio * 30;

    // Bonus for urgency
    switch (request.urgency) {
      case 'high':
        score += 20;
        break;
      case 'medium':
        score += 10;
        break;
      case 'low':
        score += 5;
        break;
    }

    // Bonus for geographic diversity (sponsor from different region)
    if (this.isDifferentRegion(request.country, sponsor.country)) {
      score += 15;
    }

    // Special bonus for Canadian-to-Canadian sponsorship
    if (request.country === 'CA' && sponsor.country === 'CA') {
      score += 25; // Extra bonus for Canadian solidarity
    }

    // Bonus for sponsor's subscription tier
    if (sponsor.subscriptionTier === 'premium') {
      score += 10;
    } else if (sponsor.subscriptionTier === 'enterprise') {
      score += 20;
    }

    return Math.min(score, 100); // Cap at 100
  }

  private isDifferentRegion(country1: string, country2: string): boolean {
    const regions = {
      'north-america': ['US', 'MX'],
      'europe': ['GB', 'DE', 'FR', 'IT', 'ES', 'NL', 'SE', 'NO', 'DK'],
      'asia': ['CN', 'JP', 'KR', 'IN', 'SG', 'HK', 'TW'],
      'middle-east': ['AE', 'SA', 'IL', 'TR'],
      'africa': ['ZA', 'NG', 'EG', 'KE'],
      'oceania': ['AU', 'NZ'],
      'south-america': ['BR', 'AR', 'CL', 'CO', 'PE'],
      'censored-north-america': ['CA'], // Canada moved to censored
    };

    const region1 = Object.keys(regions).find(region => 
      regions[region].includes(country1.toUpperCase())
    );
    const region2 = Object.keys(regions).find(region => 
      regions[region].includes(country2.toUpperCase())
    );

    return region1 !== region2;
  }

  private getMatchReasons(request: SponsorshipRequest, sponsor: User): string[] {
    const reasons: string[] = [];

    if (sponsor.subscriptionTier === 'enterprise') {
      reasons.push('Enterprise subscriber with high sponsorship capacity');
    } else if (sponsor.subscriptionTier === 'premium') {
      reasons.push('Premium subscriber with sponsorship benefits');
    }

    if (sponsor.sponsorshipCount < sponsor.maxSponsorships) {
      reasons.push('Available sponsorship capacity');
    }

    if (this.isDifferentRegion(request.country, sponsor.country)) {
      reasons.push('Geographic diversity for better censorship bypass');
    }

    // Special reason for Canadian-to-Canadian sponsorship
    if (request.country === 'CA' && sponsor.country === 'CA') {
      reasons.push('Canadian solidarity - supporting fellow citizens');
    }

    if (request.urgency === 'high') {
      reasons.push('High urgency request prioritized');
    }

    return reasons;
  }

  async createSponsorship(dto: CreateSponsorshipDto): Promise<Sponsorship> {
    this.logger.log(`Creating sponsorship between ${dto.sponsorUserId} and ${dto.sponsoredUserId}`);
    
    const sponsorship = this.sponsorshipRepository.create({
      sponsorUserId: dto.sponsorUserId,
      sponsoredUserId: dto.sponsoredUserId,
      sponsorshipRequestId: dto.sponsorshipRequestId,
      stripeSubscriptionId: dto.stripeSubscriptionId,
      amount: dto.amount,
      currency: dto.currency,
      duration: dto.duration,
      status: 'active',
      startDate: new Date(),
      endDate: new Date(Date.now() + dto.duration * 30 * 24 * 60 * 60 * 1000), // months to milliseconds
      createdAt: new Date(),
    });

    const savedSponsorship = await this.sponsorshipRepository.save(sponsorship);
    
    // Update sponsorship request status
    await this.sponsorshipRequestRepository.update(dto.sponsorshipRequestId, {
      status: 'matched',
      matchedAt: new Date(),
    });

    // Create Stripe coupon for sponsored user
    const coupon = await this.stripeService.createCoupon(
      `sponsorship-${savedSponsorship.id}`,
      100, // 100% off
      undefined,
      'usd',
      'once'
    );

    // Update sponsorship with coupon ID
    await this.sponsorshipRepository.update(savedSponsorship.id, {
      stripeCouponId: coupon.id,
    });

    // Update sponsor's sponsorship count
    await this.userRepository.update(dto.sponsorUserId, {
      sponsorshipCount: () => 'sponsorshipCount + 1',
    });

    this.logger.log(`Sponsorship created successfully: ${savedSponsorship.id}`);
    return savedSponsorship;
  }

  async getSponsorshipStats(): Promise<{
    totalSponsorships: number;
    activeSponsorships: number;
    totalUsersHelped: number;
    countriesHelped: number;
    totalAmountDonated: number;
  }> {
    const totalSponsorships = await this.sponsorshipRepository.count();
    const activeSponsorships = await this.sponsorshipRepository.count({
      where: { status: 'active' },
    });

    const uniqueUsersHelped = await this.sponsorshipRepository
      .createQueryBuilder('sponsorship')
      .select('COUNT(DISTINCT sponsorship.sponsoredUserId)', 'count')
      .getRawOne();

    const uniqueCountries = await this.sponsorshipRequestRepository
      .createQueryBuilder('request')
      .select('COUNT(DISTINCT request.country)', 'count')
      .where('request.status = :status', { status: 'matched' })
      .getRawOne();

    const totalAmount = await this.sponsorshipRepository
      .createQueryBuilder('sponsorship')
      .select('SUM(sponsorship.amount)', 'total')
      .getRawOne();

    return {
      totalSponsorships,
      activeSponsorships,
      totalUsersHelped: parseInt(uniqueUsersHelped.count) || 0,
      countriesHelped: parseInt(uniqueCountries.count) || 0,
      totalAmountDonated: parseInt(totalAmount.total) || 0,
    };
  }

  async getSponsorshipHistory(userId: string): Promise<{
    asSponsor: Sponsorship[];
    asSponsored: Sponsorship[];
  }> {
    const asSponsor = await this.sponsorshipRepository.find({
      where: { sponsorUserId: userId },
      relations: ['sponsoredUser'],
      order: { createdAt: 'DESC' },
    });

    const asSponsored = await this.sponsorshipRepository.find({
      where: { sponsoredUserId: userId },
      relations: ['sponsorUser'],
      order: { createdAt: 'DESC' },
    });

    return { asSponsor, asSponsored };
  }

  async getPendingRequests(): Promise<SponsorshipRequest[]> {
    return await this.sponsorshipRequestRepository.find({
      where: { status: 'pending' },
      relations: ['user'],
      order: { 
        urgency: 'DESC',
        createdAt: 'ASC' 
      },
    });
  }

  async getCensorshipStats(): Promise<{
    topCensoredCountries: Array<{ country: string; count: number }>;
    urgencyBreakdown: Array<{ urgency: string; count: number }>;
    recentRequests: SponsorshipRequest[];
  }> {
    const topCensoredCountries = await this.sponsorshipRequestRepository
      .createQueryBuilder('request')
      .select('request.country', 'country')
      .addSelect('COUNT(*)', 'count')
      .groupBy('request.country')
      .orderBy('count', 'DESC')
      .limit(10)
      .getRawMany();

    const urgencyBreakdown = await this.sponsorshipRequestRepository
      .createQueryBuilder('request')
      .select('request.urgency', 'urgency')
      .addSelect('COUNT(*)', 'count')
      .groupBy('request.urgency')
      .getRawMany();

    const recentRequests = await this.sponsorshipRequestRepository.find({
      order: { createdAt: 'DESC' },
      take: 20,
      relations: ['user'],
    });

    return {
      topCensoredCountries,
      urgencyBreakdown,
      recentRequests,
    };
  }
}
