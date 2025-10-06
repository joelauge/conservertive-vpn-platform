import { SponsorshipService, CreateSponsorshipRequestDto, CreateSponsorshipDto } from './sponsorship.service';
export declare class SponsorshipController {
    private sponsorshipService;
    private readonly logger;
    constructor(sponsorshipService: SponsorshipService);
    createSponsorshipRequest(dto: CreateSponsorshipRequestDto): Promise<import("./entities/sponsorship-request.entity").SponsorshipRequest>;
    getPendingRequests(): Promise<import("./entities/sponsorship-request.entity").SponsorshipRequest[]>;
    getSponsorshipStats(): Promise<{
        totalSponsorships: number;
        activeSponsorships: number;
        totalUsersHelped: number;
        countriesHelped: number;
        totalAmountDonated: number;
    }>;
    getCensorshipStats(): Promise<{
        topCensoredCountries: Array<{
            country: string;
            count: number;
        }>;
        urgencyBreakdown: Array<{
            urgency: string;
            count: number;
        }>;
        recentRequests: import("./entities/sponsorship-request.entity").SponsorshipRequest[];
    }>;
    getSponsorshipHistory(userId: string): Promise<{
        asSponsor: import("./entities/sponsorship.entity").Sponsorship[];
        asSponsored: import("./entities/sponsorship.entity").Sponsorship[];
    }>;
    createSponsorship(dto: CreateSponsorshipDto): Promise<import("./entities/sponsorship.entity").Sponsorship>;
    findMatch(requestId: string): Promise<import("./sponsorship.service").SponsorshipMatchDto>;
    getDashboardData(): Promise<{
        stats: {
            totalSponsorships: number;
            activeSponsorships: number;
            totalUsersHelped: number;
            countriesHelped: number;
            totalAmountDonated: number;
        };
        censorshipStats: {
            topCensoredCountries: Array<{
                country: string;
                count: number;
            }>;
            urgencyBreakdown: Array<{
                urgency: string;
                count: number;
            }>;
            recentRequests: import("./entities/sponsorship-request.entity").SponsorshipRequest[];
        };
        recentActivity: import("./entities/sponsorship-request.entity").SponsorshipRequest[];
    }>;
    getSuccessStories(): Promise<{
        stories: {
            id: string;
            title: string;
            description: string;
            impact: string;
            country: string;
            usersHelped: number;
        }[];
        totalImpact: {
            usersHelped: number;
            countriesReached: number;
            totalDonated: number;
            activeSponsorships: number;
        };
    }>;
    getMatchingInfo(): Promise<{
        algorithm: string;
        factors: {
            name: string;
            weight: number;
            description: string;
        }[];
        maxScore: number;
        matchingCriteria: {
            minScore: number;
            maxWaitTime: string;
            retryAttempts: number;
        };
    }>;
}
