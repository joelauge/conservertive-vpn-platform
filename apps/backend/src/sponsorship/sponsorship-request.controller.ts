import { Controller, Post, Get, Body, Query, Param, Patch } from '@nestjs/common';
import { SponsorshipRequestService } from './sponsorship-request.service';
import { CreateSponsorshipRequestDto } from './dto/create-sponsorship-request.dto';
import { UpdateSponsorshipRequestDto } from './dto/update-sponsorship-request.dto';

@Controller('sponsorship-requests')
export class SponsorshipRequestController {
  constructor(private readonly sponsorshipRequestService: SponsorshipRequestService) {}

  @Post()
  async create(@Body() createSponsorshipRequestDto: CreateSponsorshipRequestDto) {
    return this.sponsorshipRequestService.create(createSponsorshipRequestDto);
  }

  @Get()
  async findAll(
    @Query('status') status?: string,
    @Query('country') country?: string,
    @Query('urgency') urgency?: string,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number
  ) {
    return this.sponsorshipRequestService.findAll({
      status,
      country,
      urgency,
      limit: limit ? parseInt(limit.toString()) : undefined,
      offset: offset ? parseInt(offset.toString()) : undefined
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.sponsorshipRequestService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateSponsorshipRequestDto: UpdateSponsorshipRequestDto
  ) {
    return this.sponsorshipRequestService.update(id, updateSponsorshipRequestDto);
  }

  @Get('available/applicants')
  async getAvailableApplicants(@Query('limit') limit?: number) {
    return this.sponsorshipRequestService.getAvailableApplicants(
      limit ? parseInt(limit.toString()) : 10
    );
  }
}
