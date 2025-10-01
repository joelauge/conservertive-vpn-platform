import { Controller, Get, Post, Body, Param, Query, Logger } from '@nestjs/common';
import { BillingService, CreateCustomerDto, CreateProductDto, CreatePriceDto, CreateSubscriptionDto, CreatePaymentLinkDto } from './billing.service';

@Controller('billing')
export class BillingController {
  private readonly logger = new Logger(BillingController.name);

  constructor(private billingService: BillingService) {}

  // Customer management
  @Post('customers')
  async createCustomer(@Body() createCustomerDto: CreateCustomerDto) {
    this.logger.log('Creating customer via API');
    return await this.billingService.createCustomer(createCustomerDto);
  }

  @Get('customers')
  async listCustomers(@Query('limit') limit?: number, @Query('email') email?: string) {
    this.logger.log('Listing customers via API');
    return await this.billingService.listCustomers(limit, email);
  }

  // Product management
  @Post('products')
  async createProduct(@Body() createProductDto: CreateProductDto) {
    this.logger.log('Creating product via API');
    return await this.billingService.createProduct(createProductDto);
  }

  @Get('products')
  async listProducts(@Query('limit') limit?: number) {
    this.logger.log('Listing products via API');
    return await this.billingService.listProducts(limit);
  }

  // Price management
  @Post('prices')
  async createPrice(@Body() createPriceDto: CreatePriceDto) {
    this.logger.log('Creating price via API');
    return await this.billingService.createPrice(createPriceDto);
  }

  @Get('prices')
  async listPrices(@Query('productId') productId?: string, @Query('limit') limit?: number) {
    this.logger.log('Listing prices via API');
    return await this.billingService.listPrices(productId, limit);
  }

  // Subscription management
  @Post('subscriptions')
  async createSubscription(@Body() createSubscriptionDto: CreateSubscriptionDto) {
    this.logger.log('Creating subscription via API');
    return await this.billingService.createSubscription(createSubscriptionDto);
  }

  @Get('subscriptions')
  async listSubscriptions(
    @Query('customerId') customerId?: string,
    @Query('priceId') priceId?: string,
    @Query('status') status?: string,
    @Query('limit') limit?: number
  ) {
    this.logger.log('Listing subscriptions via API');
    return await this.billingService.listSubscriptions(customerId, priceId, status, limit);
  }

  @Post('subscriptions/:id/cancel')
  async cancelSubscription(@Param('id') subscriptionId: string) {
    this.logger.log(`Cancelling subscription ${subscriptionId} via API`);
    return await this.billingService.cancelSubscription(subscriptionId);
  }

  @Post('subscriptions/:id/update')
  async updateSubscription(
    @Param('id') subscriptionId: string,
    @Body() updateData: { items: any[]; prorationBehavior?: string }
  ) {
    this.logger.log(`Updating subscription ${subscriptionId} via API`);
    return await this.billingService.updateSubscription(
      subscriptionId,
      updateData.items,
      updateData.prorationBehavior
    );
  }

  // Payment links
  @Post('payment-links')
  async createPaymentLink(@Body() createPaymentLinkDto: CreatePaymentLinkDto) {
    this.logger.log('Creating payment link via API');
    return await this.billingService.createPaymentLink(createPaymentLinkDto);
  }

  // Invoice management
  @Post('invoices')
  async createInvoice(
    @Body() invoiceData: { customerId: string; daysUntilDue?: number }
  ) {
    this.logger.log('Creating invoice via API');
    return await this.billingService.createInvoice(invoiceData.customerId, invoiceData.daysUntilDue);
  }

  @Post('invoice-items')
  async createInvoiceItem(
    @Body() itemData: { customerId: string; priceId: string; invoiceId: string }
  ) {
    this.logger.log('Creating invoice item via API');
    return await this.billingService.createInvoiceItem(
      itemData.customerId,
      itemData.priceId,
      itemData.invoiceId
    );
  }

  @Post('invoices/:id/finalize')
  async finalizeInvoice(@Param('id') invoiceId: string) {
    this.logger.log(`Finalizing invoice ${invoiceId} via API`);
    return await this.billingService.finalizeInvoice(invoiceId);
  }

  // Payment intents
  @Get('payment-intents')
  async listPaymentIntents(@Query('customerId') customerId?: string, @Query('limit') limit?: number) {
    this.logger.log('Listing payment intents via API');
    return await this.billingService.listPaymentIntents(customerId, limit);
  }

  // Refunds
  @Post('refunds')
  async createRefund(
    @Body() refundData: { paymentIntentId: string; amount?: number; reason?: 'duplicate' | 'fraudulent' | 'requested_by_customer' }
  ) {
    this.logger.log('Creating refund via API');
    return await this.billingService.createRefund(
      refundData.paymentIntentId,
      refundData.amount,
      refundData.reason
    );
  }

  // Balance
  @Get('balance')
  async getBalance() {
    this.logger.log('Retrieving balance via API');
    return await this.billingService.getBalance();
  }

  // Coupons
  @Get('coupons')
  async listCoupons(@Query('limit') limit?: number) {
    this.logger.log('Listing coupons via API');
    return await this.billingService.listCoupons(limit);
  }

  @Post('coupons')
  async createCoupon(
    @Body() couponData: {
      name: string;
      percentOff?: number;
      amountOff?: number;
      currency?: string;
      duration?: string;
      durationInMonths?: number;
    }
  ) {
    this.logger.log('Creating coupon via API');
    return await this.billingService.createCoupon(
      couponData.name,
      couponData.percentOff,
      couponData.amountOff,
      couponData.currency,
      couponData.duration,
      couponData.durationInMonths
    );
  }

  // Disputes
  @Get('disputes')
  async listDisputes(
    @Query('chargeId') chargeId?: string,
    @Query('paymentIntentId') paymentIntentId?: string,
    @Query('limit') limit?: number
  ) {
    this.logger.log('Listing disputes via API');
    return await this.billingService.listDisputes(chargeId, paymentIntentId, limit);
  }

  @Post('disputes/:id/update')
  async updateDispute(
    @Param('id') disputeId: string,
    @Body() disputeData: { evidence?: Record<string, string>; submit?: boolean }
  ) {
    this.logger.log(`Updating dispute ${disputeId} via API`);
    return await this.billingService.updateDispute(
      disputeId,
      disputeData.evidence,
      disputeData.submit
    );
  }

  // ConSERVERtive-specific endpoints
  @Post('vpn-subscriptions')
  async createVpnSubscription(
    @Body() subscriptionData: { customerId: string; planType: 'basic' | 'premium' | 'enterprise' }
  ) {
    this.logger.log('Creating VPN subscription via API');
    return await this.billingService.createVpnSubscription(
      subscriptionData.customerId,
      subscriptionData.planType
    );
  }

  @Post('sponsorship-coupons')
  async createSponsorshipCoupon(
    @Body() couponData: { sponsorCustomerId: string }
  ) {
    this.logger.log('Creating sponsorship coupon via API');
    return await this.billingService.createSponsorshipCoupon(couponData.sponsorCustomerId);
  }

  @Post('sponsorship-payments')
  async processSponsorshipPayment(
    @Body() paymentData: { sponsorCustomerId: string; sponsoredCustomerId: string }
  ) {
    this.logger.log('Processing sponsorship payment via API');
    return await this.billingService.processSponsorshipPayment(
      paymentData.sponsorCustomerId,
      paymentData.sponsoredCustomerId
    );
  }
}
