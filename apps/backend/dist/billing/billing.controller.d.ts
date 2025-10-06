import { BillingService, CreateCustomerDto, CreateProductDto, CreatePriceDto, CreateSubscriptionDto, CreatePaymentLinkDto } from './billing.service';
export declare class BillingController {
    private billingService;
    private readonly logger;
    constructor(billingService: BillingService);
    createCustomer(createCustomerDto: CreateCustomerDto): Promise<import("stripe").Stripe.Response<import("stripe").Stripe.Customer>>;
    listCustomers(limit?: number, email?: string): Promise<import("stripe").Stripe.Response<import("stripe").Stripe.ApiList<import("stripe").Stripe.Customer>>>;
    createProduct(createProductDto: CreateProductDto): Promise<import("stripe").Stripe.Response<import("stripe").Stripe.Product>>;
    listProducts(limit?: number): Promise<import("stripe").Stripe.Response<import("stripe").Stripe.ApiList<import("stripe").Stripe.Product>>>;
    createPrice(createPriceDto: CreatePriceDto): Promise<import("stripe").Stripe.Response<import("stripe").Stripe.Price>>;
    listPrices(productId?: string, limit?: number): Promise<import("stripe").Stripe.Response<import("stripe").Stripe.ApiList<import("stripe").Stripe.Price>>>;
    createSubscription(createSubscriptionDto: CreateSubscriptionDto): Promise<import("stripe").Stripe.Response<import("stripe").Stripe.Subscription>>;
    listSubscriptions(customerId?: string, priceId?: string, status?: string, limit?: number): Promise<import("stripe").Stripe.Response<import("stripe").Stripe.ApiList<import("stripe").Stripe.Subscription>>>;
    cancelSubscription(subscriptionId: string): Promise<import("stripe").Stripe.Response<import("stripe").Stripe.Subscription>>;
    updateSubscription(subscriptionId: string, updateData: {
        items: any[];
        prorationBehavior?: string;
    }): Promise<import("stripe").Stripe.Response<import("stripe").Stripe.Subscription>>;
    createPaymentLink(createPaymentLinkDto: CreatePaymentLinkDto): Promise<import("stripe").Stripe.Response<import("stripe").Stripe.PaymentLink>>;
    createInvoice(invoiceData: {
        customerId: string;
        daysUntilDue?: number;
    }): Promise<import("stripe").Stripe.Response<import("stripe").Stripe.Invoice>>;
    createInvoiceItem(itemData: {
        customerId: string;
        priceId: string;
        invoiceId: string;
    }): Promise<import("stripe").Stripe.Response<import("stripe").Stripe.InvoiceItem>>;
    finalizeInvoice(invoiceId: string): Promise<import("stripe").Stripe.Response<import("stripe").Stripe.Invoice>>;
    listPaymentIntents(customerId?: string, limit?: number): Promise<import("stripe").Stripe.Response<import("stripe").Stripe.ApiList<import("stripe").Stripe.PaymentIntent>>>;
    createRefund(refundData: {
        paymentIntentId: string;
        amount?: number;
        reason?: 'duplicate' | 'fraudulent' | 'requested_by_customer';
    }): Promise<import("stripe").Stripe.Response<import("stripe").Stripe.Refund>>;
    getBalance(): Promise<import("stripe").Stripe.Response<import("stripe").Stripe.Balance>>;
    listCoupons(limit?: number): Promise<import("stripe").Stripe.Response<import("stripe").Stripe.ApiList<import("stripe").Stripe.Coupon>>>;
    createCoupon(couponData: {
        name: string;
        percentOff?: number;
        amountOff?: number;
        currency?: string;
        duration?: string;
        durationInMonths?: number;
    }): Promise<import("stripe").Stripe.Response<import("stripe").Stripe.Coupon>>;
    listDisputes(chargeId?: string, paymentIntentId?: string, limit?: number): Promise<import("stripe").Stripe.Response<import("stripe").Stripe.ApiList<import("stripe").Stripe.Dispute>>>;
    updateDispute(disputeId: string, disputeData: {
        evidence?: Record<string, string>;
        submit?: boolean;
    }): Promise<import("stripe").Stripe.Response<import("stripe").Stripe.Dispute>>;
    createVpnSubscription(subscriptionData: {
        customerId: string;
        planType: 'basic' | 'premium' | 'enterprise';
    }): Promise<import("stripe").Stripe.Response<import("stripe").Stripe.Subscription>>;
    createSponsorshipCoupon(couponData: {
        sponsorCustomerId: string;
    }): Promise<import("stripe").Stripe.Response<import("stripe").Stripe.Coupon>>;
    processSponsorshipPayment(paymentData: {
        sponsorCustomerId: string;
        sponsoredCustomerId: string;
    }): Promise<import("stripe").Stripe.Response<import("stripe").Stripe.Invoice>>;
}
