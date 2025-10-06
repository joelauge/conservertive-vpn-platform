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
export declare class BillingService {
    private stripeService;
    private readonly logger;
    constructor(stripeService: StripeService);
    createCustomer(data: CreateCustomerDto): Promise<import("stripe").Stripe.Response<import("stripe").Stripe.Customer>>;
    createProduct(data: CreateProductDto): Promise<import("stripe").Stripe.Response<import("stripe").Stripe.Product>>;
    createPrice(data: CreatePriceDto): Promise<import("stripe").Stripe.Response<import("stripe").Stripe.Price>>;
    createSubscription(data: CreateSubscriptionDto): Promise<import("stripe").Stripe.Response<import("stripe").Stripe.Subscription>>;
    createPaymentLink(data: CreatePaymentLinkDto): Promise<import("stripe").Stripe.Response<import("stripe").Stripe.PaymentLink>>;
    createInvoice(customerId: string, daysUntilDue?: number): Promise<import("stripe").Stripe.Response<import("stripe").Stripe.Invoice>>;
    createInvoiceItem(customerId: string, priceId: string, invoiceId: string): Promise<import("stripe").Stripe.Response<import("stripe").Stripe.InvoiceItem>>;
    finalizeInvoice(invoiceId: string): Promise<import("stripe").Stripe.Response<import("stripe").Stripe.Invoice>>;
    createRefund(paymentIntentId: string, amount?: number, reason?: 'duplicate' | 'fraudulent' | 'requested_by_customer'): Promise<import("stripe").Stripe.Response<import("stripe").Stripe.Refund>>;
    getBalance(): Promise<import("stripe").Stripe.Response<import("stripe").Stripe.Balance>>;
    listCustomers(limit?: number, email?: string): Promise<import("stripe").Stripe.Response<import("stripe").Stripe.ApiList<import("stripe").Stripe.Customer>>>;
    listProducts(limit?: number): Promise<import("stripe").Stripe.Response<import("stripe").Stripe.ApiList<import("stripe").Stripe.Product>>>;
    listPrices(productId?: string, limit?: number): Promise<import("stripe").Stripe.Response<import("stripe").Stripe.ApiList<import("stripe").Stripe.Price>>>;
    listPaymentIntents(customerId?: string, limit?: number): Promise<import("stripe").Stripe.Response<import("stripe").Stripe.ApiList<import("stripe").Stripe.PaymentIntent>>>;
    listSubscriptions(customerId?: string, priceId?: string, status?: string, limit?: number): Promise<import("stripe").Stripe.Response<import("stripe").Stripe.ApiList<import("stripe").Stripe.Subscription>>>;
    cancelSubscription(subscriptionId: string): Promise<import("stripe").Stripe.Response<import("stripe").Stripe.Subscription>>;
    updateSubscription(subscriptionId: string, items: any[], prorationBehavior?: string): Promise<import("stripe").Stripe.Response<import("stripe").Stripe.Subscription>>;
    listCoupons(limit?: number): Promise<import("stripe").Stripe.Response<import("stripe").Stripe.ApiList<import("stripe").Stripe.Coupon>>>;
    createCoupon(name: string, percentOff?: number, amountOff?: number, currency?: string, duration?: string, durationInMonths?: number): Promise<import("stripe").Stripe.Response<import("stripe").Stripe.Coupon>>;
    listDisputes(chargeId?: string, paymentIntentId?: string, limit?: number): Promise<import("stripe").Stripe.Response<import("stripe").Stripe.ApiList<import("stripe").Stripe.Dispute>>>;
    updateDispute(disputeId: string, evidence?: Record<string, string>, submit?: boolean): Promise<import("stripe").Stripe.Response<import("stripe").Stripe.Dispute>>;
    createVpnSubscription(customerId: string, planType: 'basic' | 'premium' | 'enterprise'): Promise<import("stripe").Stripe.Response<import("stripe").Stripe.Subscription>>;
    createSponsorshipCoupon(sponsorCustomerId: string): Promise<import("stripe").Stripe.Response<import("stripe").Stripe.Coupon>>;
    processSponsorshipPayment(sponsorCustomerId: string, sponsoredCustomerId: string): Promise<import("stripe").Stripe.Response<import("stripe").Stripe.Invoice>>;
}
