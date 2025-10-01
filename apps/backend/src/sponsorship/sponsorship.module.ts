import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SponsorshipService } from './sponsorship.service';
import { SponsorshipController } from './sponsorship.controller';
import { Sponsorship } from './entities/sponsorship.entity';
import { SponsorshipRequest } from './entities/sponsorship-request.entity';
import { User } from '../user/entities/user.entity';
import { BillingModule } from '../billing/billing.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Sponsorship, SponsorshipRequest, User]),
    BillingModule,
  ],
  providers: [SponsorshipService],
  controllers: [SponsorshipController],
  exports: [SponsorshipService],
})
export class SponsorshipModule {}
