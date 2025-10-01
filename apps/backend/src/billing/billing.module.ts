import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { StripeService } from './stripe.service';
import { BillingController } from './billing.controller';
import { BillingService } from './billing.service';

@Module({
  imports: [ConfigModule],
  providers: [StripeService, BillingService],
  controllers: [BillingController],
  exports: [StripeService, BillingService],
})
export class BillingModule {}
