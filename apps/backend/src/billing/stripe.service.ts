import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private readonly logger = new Logger(StripeService.name);
  private stripe: Stripe;

  constructor(private configService: ConfigService) {
    const stripeSecretKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    
    if (!stripeSecretKey) {
      throw new Error('STRIPE_SECRET_KEY is not configured');
    }

    this.stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2025-08-27.basil',
    });

    this.logger.log('Stripe service initialized');
  }

  async createCustomer(email: string, name: string, metadata?: Record<string, string>) {
    try {
      const customer = await this.stripe.customers.create({
        email,
        name,
        metadata: {
          ...metadata,
          service: 'conservertive-vpn',
        },
      });

      this.logger.log(`Created Stripe customer: ${customer.id}`);
      return customer;
    } catch (error) {
      this.logger.error('Failed to create Stripe customer', error);
      throw error;
    }
  }

  async createProduct(name: string, description: string) {
    try {
      const product = await this.stripe.products.create({
        name,
        description,
        metadata: {
          service: 'conservertive-vpn',
        },
      });

      this.logger.log(`Created Stripe product: ${product.id}`);
      return product;
    } catch (error) {
      this.logger.error('Failed to create Stripe product', error);
      throw error;
    }
  }

  async createPrice(productId: string, unitAmount: number, currency: string = 'usd', interval?: 'month' | 'year') {
    try {
      const priceData: Stripe.PriceCreateParams = {
        product: productId,
        unit_amount: unitAmount,
        currency,
        metadata: {
          service: 'conservertive-vpn',
        },
      };

      if (interval) {
        priceData.recurring = { interval };
      }

      const price = await this.stripe.prices.create(priceData);

      this.logger.log(`Created Stripe price: ${price.id}`);
      return price;
    } catch (error) {
      this.logger.error('Failed to create Stripe price', error);
      throw error;
    }
  }

  async createSubscription(customerId: string, priceId: string, metadata?: Record<string, string>) {
    try {
      const subscription = await this.stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: priceId }],
        metadata: {
          ...metadata,
          service: 'conservertive-vpn',
        },
        expand: ['latest_invoice.payment_intent'],
      });

      this.logger.log(`Created Stripe subscription: ${subscription.id}`);
      return subscription;
    } catch (error) {
      this.logger.error('Failed to create Stripe subscription', error);
      throw error;
    }
  }

  async createPaymentLink(priceId: string, quantity: number = 1, redirectUrl?: string) {
    try {
      const paymentLink = await this.stripe.paymentLinks.create({
        line_items: [
          {
            price: priceId,
            quantity,
          },
        ],
        metadata: {
          service: 'conservertive-vpn',
        },
        ...(redirectUrl && { after_completion: { type: 'redirect', redirect: { url: redirectUrl } } }),
      });

      this.logger.log(`Created Stripe payment link: ${paymentLink.id}`);
      return paymentLink;
    } catch (error) {
      this.logger.error('Failed to create Stripe payment link', error);
      throw error;
    }
  }

  async createInvoice(customerId: string, daysUntilDue: number = 30) {
    try {
      const invoice = await this.stripe.invoices.create({
        customer: customerId,
        days_until_due: daysUntilDue,
        metadata: {
          service: 'conservertive-vpn',
        },
      });

      this.logger.log(`Created Stripe invoice: ${invoice.id}`);
      return invoice;
    } catch (error) {
      this.logger.error('Failed to create Stripe invoice', error);
      throw error;
    }
  }

  async createInvoiceItem(customerId: string, priceId: string, invoiceId: string) {
    try {
      const invoiceItem = await this.stripe.invoiceItems.create({
        customer: customerId,
        invoice: invoiceId,
        amount: 1000, // Default amount in cents
        currency: 'usd',
        description: 'VPN Service',
      });

      this.logger.log(`Created Stripe invoice item: ${invoiceItem.id}`);
      return invoiceItem;
    } catch (error) {
      this.logger.error('Failed to create Stripe invoice item', error);
      throw error;
    }
  }

  async finalizeInvoice(invoiceId: string) {
    try {
      const invoice = await this.stripe.invoices.finalizeInvoice(invoiceId);
      this.logger.log(`Finalized Stripe invoice: ${invoice.id}`);
      return invoice;
    } catch (error) {
      this.logger.error('Failed to finalize Stripe invoice', error);
      throw error;
    }
  }

  async createRefund(paymentIntentId: string, amount?: number, reason?: 'duplicate' | 'fraudulent' | 'requested_by_customer') {
    try {
      const refund = await this.stripe.refunds.create({
        payment_intent: paymentIntentId,
        ...(amount && { amount }),
        ...(reason && { reason }),
      });

      this.logger.log(`Created Stripe refund: ${refund.id}`);
      return refund;
    } catch (error) {
      this.logger.error('Failed to create Stripe refund', error);
      throw error;
    }
  }

  async getBalance() {
    try {
      const balance = await this.stripe.balance.retrieve();
      this.logger.log('Retrieved Stripe balance');
      return balance;
    } catch (error) {
      this.logger.error('Failed to retrieve Stripe balance', error);
      throw error;
    }
  }

  async listCustomers(limit: number = 10, email?: string) {
    try {
      const params: Stripe.CustomerListParams = {
        limit,
        ...(email && { email }),
      };

      const customers = await this.stripe.customers.list(params);
      this.logger.log(`Retrieved ${customers.data.length} Stripe customers`);
      return customers;
    } catch (error) {
      this.logger.error('Failed to list Stripe customers', error);
      throw error;
    }
  }

  async listProducts(limit: number = 10) {
    try {
      const products = await this.stripe.products.list({ limit });
      this.logger.log(`Retrieved ${products.data.length} Stripe products`);
      return products;
    } catch (error) {
      this.logger.error('Failed to list Stripe products', error);
      throw error;
    }
  }

  async listPrices(productId?: string, limit: number = 10) {
    try {
      const params: Stripe.PriceListParams = {
        limit,
        ...(productId && { product: productId }),
      };

      const prices = await this.stripe.prices.list(params);
      this.logger.log(`Retrieved ${prices.data.length} Stripe prices`);
      return prices;
    } catch (error) {
      this.logger.error('Failed to list Stripe prices', error);
      throw error;
    }
  }

  async listPaymentIntents(customerId?: string, limit: number = 10) {
    try {
      const params: Stripe.PaymentIntentListParams = {
        limit,
        ...(customerId && { customer: customerId }),
      };

      const paymentIntents = await this.stripe.paymentIntents.list(params);
      this.logger.log(`Retrieved ${paymentIntents.data.length} Stripe payment intents`);
      return paymentIntents;
    } catch (error) {
      this.logger.error('Failed to list Stripe payment intents', error);
      throw error;
    }
  }

  async listSubscriptions(customerId?: string, priceId?: string, status?: string, limit: number = 10) {
    try {
      const params: Stripe.SubscriptionListParams = {
        limit,
        ...(customerId && { customer: customerId }),
        ...(priceId && { price: priceId }),
        ...(status && { status: status as any }),
      };

      const subscriptions = await this.stripe.subscriptions.list(params);
      this.logger.log(`Retrieved ${subscriptions.data.length} Stripe subscriptions`);
      return subscriptions;
    } catch (error) {
      this.logger.error('Failed to list Stripe subscriptions', error);
      throw error;
    }
  }

  async cancelSubscription(subscriptionId: string) {
    try {
      const subscription = await this.stripe.subscriptions.cancel(subscriptionId);
      this.logger.log(`Cancelled Stripe subscription: ${subscription.id}`);
      return subscription;
    } catch (error) {
      this.logger.error('Failed to cancel Stripe subscription', error);
      throw error;
    }
  }

  async updateSubscription(subscriptionId: string, items: Stripe.SubscriptionUpdateParams.Item[], prorationBehavior?: string) {
    try {
      const subscription = await this.stripe.subscriptions.update(subscriptionId, {
        items,
        proration_behavior: prorationBehavior as any,
      });

      this.logger.log(`Updated Stripe subscription: ${subscription.id}`);
      return subscription;
    } catch (error) {
      this.logger.error('Failed to update Stripe subscription', error);
      throw error;
    }
  }

  async listCoupons(limit: number = 10) {
    try {
      const coupons = await this.stripe.coupons.list({ limit });
      this.logger.log(`Retrieved ${coupons.data.length} Stripe coupons`);
      return coupons;
    } catch (error) {
      this.logger.error('Failed to list Stripe coupons', error);
      throw error;
    }
  }

  async createCoupon(name: string, percentOff?: number, amountOff?: number, currency?: string, duration?: string, durationInMonths?: number) {
    try {
      const couponData: Stripe.CouponCreateParams = {
        name,
        metadata: {
          service: 'conservertive-vpn',
        },
      };

      if (percentOff) {
        couponData.percent_off = percentOff;
      } else if (amountOff) {
        couponData.amount_off = amountOff;
        couponData.currency = currency || 'usd';
      }

      if (duration) {
        couponData.duration = duration as any;
        if (duration === 'repeating' && durationInMonths) {
          couponData.duration_in_months = durationInMonths;
        }
      }

      const coupon = await this.stripe.coupons.create(couponData);
      this.logger.log(`Created Stripe coupon: ${coupon.id}`);
      return coupon;
    } catch (error) {
      this.logger.error('Failed to create Stripe coupon', error);
      throw error;
    }
  }

  async listDisputes(chargeId?: string, paymentIntentId?: string, limit: number = 10) {
    try {
      const params: Stripe.DisputeListParams = {
        limit,
        ...(chargeId && { charge: chargeId }),
        ...(paymentIntentId && { payment_intent: paymentIntentId }),
      };

      const disputes = await this.stripe.disputes.list(params);
      this.logger.log(`Retrieved ${disputes.data.length} Stripe disputes`);
      return disputes;
    } catch (error) {
      this.logger.error('Failed to list Stripe disputes', error);
      throw error;
    }
  }

  async updateDispute(disputeId: string, evidence?: Record<string, string>, submit?: boolean) {
    try {
      const dispute = await this.stripe.disputes.update(disputeId, {
        ...(evidence && { evidence }),
        ...(submit !== undefined && { submit }),
      });

      this.logger.log(`Updated Stripe dispute: ${dispute.id}`);
      return dispute;
    } catch (error) {
      this.logger.error('Failed to update Stripe dispute', error);
      throw error;
    }
  }
}
