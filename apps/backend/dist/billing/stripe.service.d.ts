import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
export declare class StripeService {
    private configService;
    private readonly logger;
    private stripe;
    constructor(configService: ConfigService);
    createCustomer(email: string, name: string, metadata?: Record<string, string>): Promise<Stripe.Response<Stripe.Customer>>;
    createProduct(name: string, description: string): Promise<Stripe.Response<Stripe.Product>>;
    createPrice(productId: string, unitAmount: number, currency?: string, interval?: 'month' | 'year'): Promise<Stripe.Response<Stripe.Price>>;
    createSubscription(customerId: string, priceId: string, metadata?: Record<string, string>): Promise<Stripe.Response<Stripe.Subscription>>;
    createPaymentLink(priceId: string, quantity?: number, redirectUrl?: string): Promise<Stripe.Response<Stripe.PaymentLink>>;
    createInvoice(customerId: string, daysUntilDue?: number): Promise<Stripe.Response<Stripe.Invoice>>;
    createInvoiceItem(customerId: string, priceId: string, invoiceId: string): Promise<Stripe.Response<Stripe.InvoiceItem>>;
    finalizeInvoice(invoiceId: string): Promise<Stripe.Response<Stripe.Invoice>>;
    createRefund(paymentIntentId: string, amount?: number, reason?: 'duplicate' | 'fraudulent' | 'requested_by_customer'): Promise<Stripe.Response<Stripe.Refund>>;
    getBalance(): Promise<Stripe.Response<Stripe.Balance>>;
    listCustomers(limit?: number, email?: string): Promise<Stripe.Response<Stripe.ApiList<Stripe.Customer>>>;
    listProducts(limit?: number): Promise<Stripe.Response<Stripe.ApiList<Stripe.Product>>>;
    listPrices(productId?: string, limit?: number): Promise<Stripe.Response<Stripe.ApiList<Stripe.Price>>>;
    listPaymentIntents(customerId?: string, limit?: number): Promise<Stripe.Response<Stripe.ApiList<Stripe.PaymentIntent>>>;
    listSubscriptions(customerId?: string, priceId?: string, status?: string, limit?: number): Promise<Stripe.Response<Stripe.ApiList<Stripe.Subscription>>>;
    cancelSubscription(subscriptionId: string): Promise<Stripe.Response<Stripe.Subscription>>;
    updateSubscription(subscriptionId: string, items: Stripe.SubscriptionUpdateParams.Item[], prorationBehavior?: string): Promise<Stripe.Response<Stripe.Subscription>>;
    listCoupons(limit?: number): Promise<Stripe.Response<Stripe.ApiList<Stripe.Coupon>>>;
    createCoupon(name: string, percentOff?: number, amountOff?: number, currency?: string, duration?: string, durationInMonths?: number): Promise<Stripe.Response<Stripe.Coupon>>;
    listDisputes(chargeId?: string, paymentIntentId?: string, limit?: number): Promise<Stripe.Response<Stripe.ApiList<Stripe.Dispute>>>;
    updateDispute(disputeId: string, evidence?: Record<string, string>, submit?: boolean): Promise<Stripe.Response<Stripe.Dispute>>;
}
