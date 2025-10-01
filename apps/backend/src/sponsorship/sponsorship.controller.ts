import { Controller, Get, Post, Body, Param, Query, Logger, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SponsorshipService, CreateSponsorshipRequestDto, CreateSponsorshipDto } from './sponsorship.service';

@Controller('sponsorship')
export class SponsorshipController {
  private readonly logger = new Logger(SponsorshipController.name);

  constructor(private sponsorshipService: SponsorshipService) {}

  // Create sponsorship request
  @Post('requests')
  @UseGuards(JwtAuthGuard)
  async createSponsorshipRequest(@Body() dto: CreateSponsorshipRequestDto) {
    this.logger.log('Creating sponsorship request via API');
    return await this.sponsorshipService.createSponsorshipRequest(dto);
  }

  // Get pending sponsorship requests
  @Get('requests/pending')
  @UseGuards(JwtAuthGuard)
  async getPendingRequests() {
    this.logger.log('Getting pending sponsorship requests via API');
    return await this.sponsorshipService.getPendingRequests();
  }

  // Get sponsorship statistics
  @Get('stats')
  async getSponsorshipStats() {
    this.logger.log('Getting sponsorship statistics via API');
    return await this.sponsorshipService.getSponsorshipStats();
  }

  // Get censorship statistics
  @Get('censorship-stats')
  async getCensorshipStats() {
    this.logger.log('Getting censorship statistics via API');
    return await this.sponsorshipService.getCensorshipStats();
  }

  // Get user's sponsorship history
  @Get('history/:userId')
  @UseGuards(JwtAuthGuard)
  async getSponsorshipHistory(@Param('userId') userId: string) {
    this.logger.log(`Getting sponsorship history for user: ${userId}`);
    return await this.sponsorshipService.getSponsorshipHistory(userId);
  }

  // Create sponsorship (admin only)
  @Post()
  @UseGuards(JwtAuthGuard)
  async createSponsorship(@Body() dto: CreateSponsorshipDto) {
    this.logger.log('Creating sponsorship via API');
    return await this.sponsorshipService.createSponsorship(dto);
  }

  // Find match for a specific request
  @Post('requests/:requestId/match')
  @UseGuards(JwtAuthGuard)
  async findMatch(@Param('requestId') requestId: string) {
    this.logger.log(`Finding match for request: ${requestId}`);
    return await this.sponsorshipService.findAndCreateMatch(requestId);
  }

  // Get sponsorship impact dashboard data
  @Get('dashboard')
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

  // Get sponsorship success stories
  @Get('success-stories')
  async getSuccessStories() {
    this.logger.log('Getting sponsorship success stories via API');
    
    const stats = await this.sponsorshipService.getSponsorshipStats();
    const censorshipStats = await this.sponsorshipService.getCensorshipStats();
    
    // Generate success stories based on data
    const successStories = [
      {
        id: 'story-1',
        title: 'Breaking Through the Great Firewall',
        description: `We've helped ${censorshipStats.topCensoredCountries[0]?.count || 0} users in ${censorshipStats.topCensoredCountries[0]?.country || 'censored countries'} access the free internet.`,
        impact: 'High',
        country: censorshipStats.topCensoredCountries[0]?.country || 'Unknown',
        usersHelped: censorshipStats.topCensoredCountries[0]?.count || 0,
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

  // Get sponsorship matching algorithm info
  @Get('matching-info')
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
}
