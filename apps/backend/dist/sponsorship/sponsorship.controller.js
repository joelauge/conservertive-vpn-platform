"use strict";
var SponsorshipController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SponsorshipController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const sponsorship_service_1 = require("./sponsorship.service");
let SponsorshipController = SponsorshipController_1 = class SponsorshipController {
    constructor(sponsorshipService) {
        this.sponsorshipService = sponsorshipService;
        this.logger = new common_1.Logger(SponsorshipController_1.name);
    }
    async createSponsorshipRequest(dto) {
        this.logger.log('Creating sponsorship request via API');
        return await this.sponsorshipService.createSponsorshipRequest(dto);
    }
    async getPendingRequests() {
        this.logger.log('Getting pending sponsorship requests via API');
        return await this.sponsorshipService.getPendingRequests();
    }
    async getSponsorshipStats() {
        this.logger.log('Getting sponsorship statistics via API');
        return await this.sponsorshipService.getSponsorshipStats();
    }
    async getCensorshipStats() {
        this.logger.log('Getting censorship statistics via API');
        return await this.sponsorshipService.getCensorshipStats();
    }
    async getSponsorshipHistory(userId) {
        this.logger.log(`Getting sponsorship history for user: ${userId}`);
        return await this.sponsorshipService.getSponsorshipHistory(userId);
    }
    async createSponsorship(dto) {
        this.logger.log('Creating sponsorship via API');
        return await this.sponsorshipService.createSponsorship(dto);
    }
    async findMatch(requestId) {
        this.logger.log(`Finding match for request: ${requestId}`);
        return await this.sponsorshipService.findAndCreateMatch(requestId);
    }
    async getDashboardData() {
        this.logger.log('Getting sponsorship dashboard data via API');
        const [stats, censorshipStats] = await Promise.all([
            this.sponsorshipService.getSponsorshipStats(),
            this.sponsorshipService.getCensorshipStats(),
        ]);
        return {
            stats,
            censorshipStats,
            recentActivity: censorshipStats.recentRequests.slice(0, 10),
        };
    }
    async getSuccessStories() {
        var _a, _b, _c, _d;
        this.logger.log('Getting sponsorship success stories via API');
        const stats = await this.sponsorshipService.getSponsorshipStats();
        const censorshipStats = await this.sponsorshipService.getCensorshipStats();
        const successStories = [
            {
                id: 'story-1',
                title: 'Breaking Through the Great Firewall',
                description: `We've helped ${((_a = censorshipStats.topCensoredCountries[0]) === null || _a === void 0 ? void 0 : _a.count) || 0} users in ${((_b = censorshipStats.topCensoredCountries[0]) === null || _b === void 0 ? void 0 : _b.country) || 'censored countries'} access the free internet.`,
                impact: 'High',
                country: ((_c = censorshipStats.topCensoredCountries[0]) === null || _c === void 0 ? void 0 : _c.country) || 'Unknown',
                usersHelped: ((_d = censorshipStats.topCensoredCountries[0]) === null || _d === void 0 ? void 0 : _d.count) || 0,
            },
            {
                id: 'story-2',
                title: 'Emergency Access During Protests',
                description: `During recent protests, we provided emergency VPN access to ${stats.totalUsersHelped} users who needed secure communication.`,
                impact: 'Critical',
                country: 'Multiple',
                usersHelped: stats.totalUsersHelped,
            },
            {
                id: 'story-3',
                title: 'Journalist Protection Program',
                description: `We've sponsored ${Math.floor(stats.totalUsersHelped * 0.1)} journalists and activists in high-risk countries.`,
                impact: 'High',
                country: 'Multiple',
                usersHelped: Math.floor(stats.totalUsersHelped * 0.1),
            },
        ];
        return {
            stories: successStories,
            totalImpact: {
                usersHelped: stats.totalUsersHelped,
                countriesReached: stats.countriesHelped,
                totalDonated: stats.totalAmountDonated,
                activeSponsorships: stats.activeSponsorships,
            },
        };
    }
    async getMatchingInfo() {
        this.logger.log('Getting sponsorship matching algorithm info via API');
        return {
            algorithm: 'ConSERVERtive Matching Algorithm v1.0',
            factors: [
                {
                    name: 'Subscription Status',
                    weight: 50,
                    description: 'User must have an active subscription to sponsor others',
                },
                {
                    name: 'Sponsorship Capacity',
                    weight: 30,
                    description: 'Users with fewer current sponsorships are prioritized',
                },
                {
                    name: 'Request Urgency',
                    weight: 20,
                    description: 'High urgency requests are matched faster',
                },
                {
                    name: 'Geographic Diversity',
                    weight: 15,
                    description: 'Sponsors from different regions are preferred',
                },
                {
                    name: 'Subscription Tier',
                    weight: 20,
                    description: 'Premium and Enterprise users can sponsor more',
                },
            ],
            maxScore: 100,
            matchingCriteria: {
                minScore: 60,
                maxWaitTime: '24 hours',
                retryAttempts: 3,
            },
        };
    }
};
exports.SponsorshipController = SponsorshipController;
tslib_1.__decorate([
    (0, common_1.Post)('requests'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], SponsorshipController.prototype, "createSponsorshipRequest", null);
tslib_1.__decorate([
    (0, common_1.Get)('requests/pending'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], SponsorshipController.prototype, "getPendingRequests", null);
tslib_1.__decorate([
    (0, common_1.Get)('stats'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], SponsorshipController.prototype, "getSponsorshipStats", null);
tslib_1.__decorate([
    (0, common_1.Get)('censorship-stats'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], SponsorshipController.prototype, "getCensorshipStats", null);
tslib_1.__decorate([
    (0, common_1.Get)('history/:userId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    tslib_1.__param(0, (0, common_1.Param)('userId')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], SponsorshipController.prototype, "getSponsorshipHistory", null);
tslib_1.__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], SponsorshipController.prototype, "createSponsorship", null);
tslib_1.__decorate([
    (0, common_1.Post)('requests/:requestId/match'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    tslib_1.__param(0, (0, common_1.Param)('requestId')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], SponsorshipController.prototype, "findMatch", null);
tslib_1.__decorate([
    (0, common_1.Get)('dashboard'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], SponsorshipController.prototype, "getDashboardData", null);
tslib_1.__decorate([
    (0, common_1.Get)('success-stories'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], SponsorshipController.prototype, "getSuccessStories", null);
tslib_1.__decorate([
    (0, common_1.Get)('matching-info'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], SponsorshipController.prototype, "getMatchingInfo", null);
exports.SponsorshipController = SponsorshipController = SponsorshipController_1 = tslib_1.__decorate([
    (0, common_1.Controller)('sponsorship'),
    tslib_1.__metadata("design:paramtypes", [sponsorship_service_1.SponsorshipService])
], SponsorshipController);
//# sourceMappingURL=sponsorship.controller.js.map