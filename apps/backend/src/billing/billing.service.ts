import { Injectable, Logger } from '@nestjs/common';
import { StripeService } from './stripe.service';

export interface CreateCustomerDto {
  email: string;
  name: string;
  metadata?: Record<string, string>;
}

export interface CreateProductDto {
  name: string;
  description: string;
}

export interface CreatePriceDto {
  productId: string;
  unitAmount: number;
  currency?: string;
  interval?: 'month' | 'year';
}

export interface CreateSubscriptionDto {
  customerId: string;
  priceId: string;
  metadata?: Record<string, string>;
}

export interface CreatePaymentLinkDto {
  priceId: string;
  quantity?: number;
  redirectUrl?: string;
}

@Injectable()
export class BillingService {
  private readonly logger = new Logger(BillingService.name);

  constructor(private stripeService: StripeService) {}

  async createCustomer(data: CreateCustomerDto) {
    this.logger.log(`Creating customer: ${data.email}`);
    return await this.stripeService.createCustomer(data.email, data.name, data.metadata);
  }

  async createProduct(data: CreateProductDto) {
    this.logger.log(`Creating product: ${data.name}`);
    return await this.stripeService.createProduct(data.name, data.description);
  }

  async createPrice(data: CreatePriceDto) {
    this.logger.log(`Creating price for product: ${data.productId}`);
    return await this.stripeService.createPrice(
      data.productId,
      data.unitAmount,
      data.currency,
      data.interval
    );
  }

  async createSubscription(data: CreateSubscriptionDto) {
    this.logger.log(`Creating subscription for customer: ${data.customerId}`);
    return await this.stripeService.createSubscription(
      data.customerId,
      data.priceId,
      data.metadata
    );
  }

  async createPaymentLink(data: CreatePaymentLinkDto) {
    this.logger.log(`Creating payment link for price: ${data.priceId}`);
    return await this.stripeService.createPaymentLink(
      data.priceId,
      data.quantity,
      data.redirectUrl
    );
  }

  async createInvoice(customerId: string, daysUntilDue?: number) {
    this.logger.log(`Creating invoice for customer: ${customerId}`);
    return await this.stripeService.createInvoice(customerId, daysUntilDue);
  }

  async createInvoiceItem(customerId: string, priceId: string, invoiceId: string) {
    this.logger.log(`Creating invoice item for customer: ${customerId}`);
    return await this.stripeService.createInvoiceItem(customerId, priceId, invoiceId);
  }

  async finalizeInvoice(invoiceId: string) {
    this.logger.log(`Finalizing invoice: ${invoiceId}`);
    return await this.stripeService.finalizeInvoice(invoiceId);
  }

  async createRefund(paymentIntentId: string, amount?: number, reason?: 'duplicate' | 'fraudulent' | 'requested_by_customer') {
    this.logger.log(`Creating refund for payment intent: ${paymentIntentId}`);
    return await this.stripeService.createRefund(paymentIntentId, amount, reason);
  }

  async getBalance() {
    this.logger.log('Retrieving balance');
    return await this.stripeService.getBalance();
  }

  async listCustomers(limit?: number, email?: string) {
    this.logger.log('Listing customers');
    return await this.stripeService.listCustomers(limit, email);
  }

  async listProducts(limit?: number) {
    this.logger.log('Listing products');
    return await this.stripeService.listProducts(limit);
  }

  async listPrices(productId?: string, limit?: number) {
    this.logger.log('Listing prices');
    return await this.stripeService.listPrices(productId, limit);
  }

  async listPaymentIntents(customerId?: string, limit?: number) {
    this.logger.log('Listing payment intents');
    return await this.stripeService.listPaymentIntents(customerId, limit);
  }

  async listSubscriptions(customerId?: string, priceId?: string, status?: string, limit?: number) {
    this.logger.log('Listing subscriptions');
    return await this.stripeService.listSubscriptions(customerId, priceId, status, limit);
  }

  async cancelSubscription(subscriptionId: string) {
    this.logger.log(`Cancelling subscription: ${subscriptionId}`);
    return await this.stripeService.cancelSubscription(subscriptionId);
  }

  async updateSubscription(subscriptionId: string, items: any[], prorationBehavior?: string) {
    this.logger.log(`Updating subscription: ${subscriptionId}`);
    return await this.stripeService.updateSubscription(subscriptionId, items, prorationBehavior);
  }

  async listCoupons(limit?: number) {
    this.logger.log('Listing coupons');
    return await this.stripeService.listCoupons(limit);
  }

  async createCoupon(name: string, percentOff?: number, amountOff?: number, currency?: string, duration?: string, durationInMonths?: number) {
    this.logger.log(`Creating coupon: ${name}`);
    return await this.stripeService.createCoupon(name, percentOff, amountOff, currency, duration, durationInMonths);
  }

  async listDisputes(chargeId?: string, paymentIntentId?: string, limit?: number) {
    this.logger.log('Listing disputes');
    return await this.stripeService.listDisputes(chargeId, paymentIntentId, limit);
  }

  async updateDispute(disputeId: string, evidence?: Record<string, string>, submit?: boolean) {
    this.logger.log(`Updating dispute: ${disputeId}`);
    return await this.stripeService.updateDispute(disputeId, evidence, submit);
  }

  // ConSERVERtive-specific business logic
  async createVpnSubscription(customerId: string, planType: 'basic' | 'premium' | 'enterprise') {
    this.logger.log(`Creating VPN subscription for customer: ${customerId}, plan: ${planType}`);
    
    const planConfig = {
      basic: { priceId: 'price_basic_monthly', metadata: { plan: 'basic', features: 'standard' } },
      premium: { priceId: 'price_premium_monthly', metadata: { plan: 'premium', features: 'advanced' } },
      enterprise: { priceId: 'price_enterprise_monthly', metadata: { plan: 'enterprise', features: 'all' } },
    };

    const config = planConfig[planType];
    return await this.stripeService.createSubscription(customerId, config.priceId, config.metadata);
  }

  async createSponsorshipCoupon(sponsorCustomerId: string) {
    this.logger.log(`Creating sponsorship coupon for customer: ${sponsorCustomerId}`);
    
    // Create a 100% discount coupon for sponsored users
    return await this.stripeService.createCoupon(
      `sponsorship-${sponsorCustomerId}`,
      100, // 100% off
      undefined,
      'usd',
      'once' // One-time use
    );
  }

  async processSponsorshipPayment(sponsorCustomerId: string, sponsoredCustomerId: string) {
    this.logger.log(`Processing sponsorship payment from ${sponsorCustomerId} for ${sponsoredCustomerId}`);
    
    // Create sponsorship invoice
    const invoice = await this.stripeService.createInvoice(sponsorCustomerId, 0);
    
    // Add sponsorship item to invoice
    await this.stripeService.createInvoiceItem(
      sponsorCustomerId,
      'price_sponsorship', // Special sponsorship price
      invoice.id
    );
    
    // Finalize and pay invoice
    const finalizedInvoice = await this.stripeService.finalizeInvoice(invoice.id);
    
    return finalizedInvoice;
  }
}
