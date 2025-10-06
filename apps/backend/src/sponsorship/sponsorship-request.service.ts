import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SponsorshipRequest } from './entities/sponsorship-request.entity';
import { CreateSponsorshipRequestDto } from './dto/create-sponsorship-request.dto';
import { UpdateSponsorshipRequestDto } from './dto/update-sponsorship-request.dto';

@Injectable()
export class SponsorshipRequestService {
  constructor(
    @InjectRepository(SponsorshipRequest)
    private sponsorshipRequestRepository: Repository<SponsorshipRequest>,
  ) {}

  async create(createSponsorshipRequestDto: CreateSponsorshipRequestDto): Promise<SponsorshipRequest> {
    const sponsorshipRequest = this.sponsorshipRequestRepository.create({
      ...createSponsorshipRequestDto,
      userId: createSponsorshipRequestDto.userId || 'anonymous', // Handle anonymous requests
    });
    
    return this.sponsorshipRequestRepository.save(sponsorshipRequest);
  }

  async findAll(filters: {
    status?: string;
    country?: string;
    urgency?: string;
    limit?: number;
    offset?: number;
  } = {}): Promise<{ data: SponsorshipRequest[]; total: number }> {
    const queryBuilder = this.sponsorshipRequestRepository
      .createQueryBuilder('request')
      .leftJoinAndSelect('request.user', 'user');

    if (filters.status) {
      queryBuilder.andWhere('request.status = :status', { status: filters.status });
    }

    if (filters.country) {
      queryBuilder.andWhere('request.country = :country', { country: filters.country });
    }

    if (filters.urgency) {
      queryBuilder.andWhere('request.urgency = :urgency', { urgency: filters.urgency });
    }

    const total = await queryBuilder.getCount();

    if (filters.limit) {
      queryBuilder.limit(filters.limit);
    }

    if (filters.offset) {
      queryBuilder.offset(filters.offset);
    }

    queryBuilder.orderBy('request.createdAt', 'DESC');

    const data = await queryBuilder.getMany();

    return { data, total };
  }

  async findOne(id: string): Promise<SponsorshipRequest> {
    return this.sponsorshipRequestRepository.findOne({
      where: { id },
      relations: ['user']
    });
  }

  async update(id: string, updateSponsorshipRequestDto: UpdateSponsorshipRequestDto): Promise<SponsorshipRequest> {
    await this.sponsorshipRequestRepository.update(id, updateSponsorshipRequestDto);
    return this.findOne(id);
  }

  async getAvailableApplicants(limit: number = 10): Promise<any[]> {
    const requests = await this.sponsorshipRequestRepository
      .createQueryBuilder('request')
      .leftJoinAndSelect('request.user', 'user')
      .where('request.status = :status', { status: 'pending' })
      .orderBy('request.createdAt', 'ASC')
      .limit(limit)
      .getMany();

    return requests.map(request => ({
      id: request.id,
      firstName: request.user?.firstName || 'Anonymous',
      lastName: request.user?.lastName || 'User',
      country: request.country,
      urgency: request.urgency,
      createdAt: request.createdAt,
      daysSinceApplication: Math.floor(
        (Date.now() - new Date(request.createdAt).getTime()) / (1000 * 60 * 60 * 24)
      ),
      minutesSinceApplication: Math.floor(
        (Date.now() - new Date(request.createdAt).getTime()) / (1000 * 60)
      ),
      profilePicture: request.user?.profilePicture || null,
      reason: request.reason
    }));
  }

  async markAsMatched(id: string): Promise<SponsorshipRequest> {
    return this.update(id, {
      status: 'matched',
      matchedAt: new Date()
    });
  }
}
