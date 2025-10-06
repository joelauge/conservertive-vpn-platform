"use strict";
var SponsorshipService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SponsorshipService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const sponsorship_entity_1 = require("./entities/sponsorship.entity");
const sponsorship_request_entity_1 = require("./entities/sponsorship-request.entity");
const user_entity_1 = require("../user/entities/user.entity");
const stripe_service_1 = require("../billing/stripe.service");
let SponsorshipService = SponsorshipService_1 = class SponsorshipService {
    constructor(sponsorshipRepository, sponsorshipRequestRepository, userRepository, stripeService) {
        this.sponsorshipRepository = sponsorshipRepository;
        this.sponsorshipRequestRepository = sponsorshipRequestRepository;
        this.userRepository = userRepository;
        this.stripeService = stripeService;
        this.logger = new common_1.Logger(SponsorshipService_1.name);
    }
    async createSponsorshipRequest(dto) {
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
        await this.findAndCreateMatch(savedRequest.id);
        return savedRequest;
    }
    async findAndCreateMatch(requestId) {
        this.logger.log(`Finding match for sponsorship request: ${requestId}`);
        const request = await this.sponsorshipRequestRepository.findOne({
            where: { id: requestId },
            relations: ['user'],
        });
        if (!request || request.status !== 'pending') {
            return null;
        }
        const potentialSponsors = await this.findPotentialSponsors(request);
        if (potentialSponsors.length === 0) {
            this.logger.log(`No potential sponsors found for request: ${requestId}`);
            return null;
        }
        const bestMatch = this.selectBestMatch(request, potentialSponsors);
        if (bestMatch) {
            await this.createSponsorship({
                sponsorUserId: bestMatch.sponsorUserId,
                sponsoredUserId: request.userId,
                sponsorshipRequestId: requestId,
                stripeSubscriptionId: '',
                amount: 999,
                currency: 'usd',
                duration: 1,
            });
        }
        return bestMatch;
    }
    async findPotentialSponsors(request) {
        const sponsors = await this.userRepository
            .createQueryBuilder('user')
            .leftJoin('user.subscriptions', 'subscription')
            .where('subscription.status = :status', { status: 'active' })
            .andWhere('user.sponsorshipEnabled = :enabled', { enabled: true })
            .andWhere('user.sponsorshipCount < user.maxSponsorships')
            .andWhere('(user.country != :country OR (user.country = :country AND :country = :canada))', {
            country: request.country,
            canada: 'CA'
        })
            .orderBy('user.sponsorshipCount', 'ASC')
            .limit(10)
            .getMany();
        return sponsors;
    }
    selectBestMatch(request, sponsors) {
        if (sponsors.length === 0)
            return null;
        let bestMatch = null;
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
    calculateMatchScore(request, sponsor) {
        let score = 0;
        score += 50;
        const capacityRatio = 1 - (sponsor.sponsorshipCount / sponsor.maxSponsorships);
        score += capacityRatio * 30;
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
        if (this.isDifferentRegion(request.country, sponsor.country)) {
            score += 15;
        }
        if (request.country === 'CA' && sponsor.country === 'CA') {
            score += 25;
        }
        if (sponsor.subscriptionTier === 'premium') {
            score += 10;
        }
        else if (sponsor.subscriptionTier === 'enterprise') {
            score += 20;
        }
        return Math.min(score, 100);
    }
    isDifferentRegion(country1, country2) {
        const regions = {
            'north-america': ['US', 'MX'],
            'europe': ['GB', 'DE', 'FR', 'IT', 'ES', 'NL', 'SE', 'NO', 'DK'],
            'asia': ['CN', 'JP', 'KR', 'IN', 'SG', 'HK', 'TW'],
            'middle-east': ['AE', 'SA', 'IL', 'TR'],
            'africa': ['ZA', 'NG', 'EG', 'KE'],
            'oceania': ['AU', 'NZ'],
            'south-america': ['BR', 'AR', 'CL', 'CO', 'PE'],
            'censored-north-america': ['CA'],
        };
        const region1 = Object.keys(regions).find(region => regions[region].includes(country1.toUpperCase()));
        const region2 = Object.keys(regions).find(region => regions[region].includes(country2.toUpperCase()));
        return region1 !== region2;
    }
    getMatchReasons(request, sponsor) {
        const reasons = [];
        if (sponsor.subscriptionTier === 'enterprise') {
            reasons.push('Enterprise subscriber with high sponsorship capacity');
        }
        else if (sponsor.subscriptionTier === 'premium') {
            reasons.push('Premium subscriber with sponsorship benefits');
        }
        if (sponsor.sponsorshipCount < sponsor.maxSponsorships) {
            reasons.push('Available sponsorship capacity');
        }
        if (this.isDifferentRegion(request.country, sponsor.country)) {
            reasons.push('Geographic diversity for better censorship bypass');
        }
        if (request.country === 'CA' && sponsor.country === 'CA') {
            reasons.push('Canadian solidarity - supporting fellow citizens');
        }
        if (request.urgency === 'high') {
            reasons.push('High urgency request prioritized');
        }
        return reasons;
    }
    async createSponsorship(dto) {
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
            endDate: new Date(Date.now() + dto.duration * 30 * 24 * 60 * 60 * 1000),
            createdAt: new Date(),
        });
        const savedSponsorship = await this.sponsorshipRepository.save(sponsorship);
        await this.sponsorshipRequestRepository.update(dto.sponsorshipRequestId, {
            status: 'matched',
            matchedAt: new Date(),
        });
        const coupon = await this.stripeService.createCoupon(`sponsorship-${savedSponsorship.id}`, 100, undefined, 'usd', 'once');
        await this.sponsorshipRepository.update(savedSponsorship.id, {
            stripeCouponId: coupon.id,
        });
        await this.userRepository.update(dto.sponsorUserId, {
            sponsorshipCount: () => 'sponsorshipCount + 1',
        });
        this.logger.log(`Sponsorship created successfully: ${savedSponsorship.id}`);
        return savedSponsorship;
    }
    async getSponsorshipStats() {
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
    async getSponsorshipHistory(userId) {
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
    async getPendingRequests() {
        return await this.sponsorshipRequestRepository.find({
            where: { status: 'pending' },
            relations: ['user'],
            order: {
                urgency: 'DESC',
                createdAt: 'ASC'
            },
        });
    }
    async getCensorshipStats() {
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
};
exports.SponsorshipService = SponsorshipService;
exports.SponsorshipService = SponsorshipService = SponsorshipService_1 = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, typeorm_1.InjectRepository)(sponsorship_entity_1.Sponsorship)),
    tslib_1.__param(1, (0, typeorm_1.InjectRepository)(sponsorship_request_entity_1.SponsorshipRequest)),
    tslib_1.__param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        stripe_service_1.StripeService])
], SponsorshipService);
//# sourceMappingURL=sponsorship.service.js.map