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
    duration: number;
}
export interface SponsorshipMatchDto {
    sponsorUserId: string;
    sponsoredUserId: string;
    matchScore: number;
    reasons: string[];
}
export declare class SponsorshipService {
    private sponsorshipRepository;
    private sponsorshipRequestRepository;
    private userRepository;
    private stripeService;
    private readonly logger;
    constructor(sponsorshipRepository: Repository<Sponsorship>, sponsorshipRequestRepository: Repository<SponsorshipRequest>, userRepository: Repository<User>, stripeService: StripeService);
    createSponsorshipRequest(dto: CreateSponsorshipRequestDto): Promise<SponsorshipRequest>;
    findAndCreateMatch(requestId: string): Promise<SponsorshipMatchDto | null>;
    private findPotentialSponsors;
    private selectBestMatch;
    private calculateMatchScore;
    private isDifferentRegion;
    private getMatchReasons;
    createSponsorship(dto: CreateSponsorshipDto): Promise<Sponsorship>;
    getSponsorshipStats(): Promise<{
        totalSponsorships: number;
        activeSponsorships: number;
        totalUsersHelped: number;
        countriesHelped: number;
        totalAmountDonated: number;
    }>;
    getSponsorshipHistory(userId: string): Promise<{
        asSponsor: Sponsorship[];
        asSponsored: Sponsorship[];
    }>;
    getPendingRequests(): Promise<SponsorshipRequest[]>;
    getCensorshipStats(): Promise<{
        topCensoredCountries: Array<{
            country: string;
            count: number;
        }>;
        urgencyBreakdown: Array<{
            urgency: string;
            count: number;
        }>;
        recentRequests: SponsorshipRequest[];
    }>;
}
