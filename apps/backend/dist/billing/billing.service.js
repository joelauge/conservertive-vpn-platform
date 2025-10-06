"use strict";
var BillingService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillingService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const stripe_service_1 = require("./stripe.service");
let BillingService = BillingService_1 = class BillingService {
    constructor(stripeService) {
        this.stripeService = stripeService;
        this.logger = new common_1.Logger(BillingService_1.name);
    }
    async createCustomer(data) {
        this.logger.log(`Creating customer: ${data.email}`);
        return await this.stripeService.createCustomer(data.email, data.name, data.metadata);
    }
    async createProduct(data) {
        this.logger.log(`Creating product: ${data.name}`);
        return await this.stripeService.createProduct(data.name, data.description);
    }
    async createPrice(data) {
        this.logger.log(`Creating price for product: ${data.productId}`);
        return await this.stripeService.createPrice(data.productId, data.unitAmount, data.currency, data.interval);
    }
    async createSubscription(data) {
        this.logger.log(`Creating subscription for customer: ${data.customerId}`);
        return await this.stripeService.createSubscription(data.customerId, data.priceId, data.metadata);
    }
    async createPaymentLink(data) {
        this.logger.log(`Creating payment link for price: ${data.priceId}`);
        return await this.stripeService.createPaymentLink(data.priceId, data.quantity, data.redirectUrl);
    }
    async createInvoice(customerId, daysUntilDue) {
        this.logger.log(`Creating invoice for customer: ${customerId}`);
        return await this.stripeService.createInvoice(customerId, daysUntilDue);
    }
    async createInvoiceItem(customerId, priceId, invoiceId) {
        this.logger.log(`Creating invoice item for customer: ${customerId}`);
        return await this.stripeService.createInvoiceItem(customerId, priceId, invoiceId);
    }
    async finalizeInvoice(invoiceId) {
        this.logger.log(`Finalizing invoice: ${invoiceId}`);
        return await this.stripeService.finalizeInvoice(invoiceId);
    }
    async createRefund(paymentIntentId, amount, reason) {
        this.logger.log(`Creating refund for payment intent: ${paymentIntentId}`);
        return await this.stripeService.createRefund(paymentIntentId, amount, reason);
    }
    async getBalance() {
        this.logger.log('Retrieving balance');
        return await this.stripeService.getBalance();
    }
    async listCustomers(limit, email) {
        this.logger.log('Listing customers');
        return await this.stripeService.listCustomers(limit, email);
    }
    async listProducts(limit) {
        this.logger.log('Listing products');
        return await this.stripeService.listProducts(limit);
    }
    async listPrices(productId, limit) {
        this.logger.log('Listing prices');
        return await this.stripeService.listPrices(productId, limit);
    }
    async listPaymentIntents(customerId, limit) {
        this.logger.log('Listing payment intents');
        return await this.stripeService.listPaymentIntents(customerId, limit);
    }
    async listSubscriptions(customerId, priceId, status, limit) {
        this.logger.log('Listing subscriptions');
        return await this.stripeService.listSubscriptions(customerId, priceId, status, limit);
    }
    async cancelSubscription(subscriptionId) {
        this.logger.log(`Cancelling subscription: ${subscriptionId}`);
        return await this.stripeService.cancelSubscription(subscriptionId);
    }
    async updateSubscription(subscriptionId, items, prorationBehavior) {
        this.logger.log(`Updating subscription: ${subscriptionId}`);
        return await this.stripeService.updateSubscription(subscriptionId, items, prorationBehavior);
    }
    async listCoupons(limit) {
        this.logger.log('Listing coupons');
        return await this.stripeService.listCoupons(limit);
    }
    async createCoupon(name, percentOff, amountOff, currency, duration, durationInMonths) {
        this.logger.log(`Creating coupon: ${name}`);
        return await this.stripeService.createCoupon(name, percentOff, amountOff, currency, duration, durationInMonths);
    }
    async listDisputes(chargeId, paymentIntentId, limit) {
        this.logger.log('Listing disputes');
        return await this.stripeService.listDisputes(chargeId, paymentIntentId, limit);
    }
    async updateDispute(disputeId, evidence, submit) {
        this.logger.log(`Updating dispute: ${disputeId}`);
        return await this.stripeService.updateDispute(disputeId, evidence, submit);
    }
    async createVpnSubscription(customerId, planType) {
        this.logger.log(`Creating VPN subscription for customer: ${customerId}, plan: ${planType}`);
        const planConfig = {
            basic: { priceId: 'price_basic_monthly', metadata: { plan: 'basic', features: 'standard' } },
            premium: { priceId: 'price_premium_monthly', metadata: { plan: 'premium', features: 'advanced' } },
            enterprise: { priceId: 'price_enterprise_monthly', metadata: { plan: 'enterprise', features: 'all' } },
        };
        const config = planConfig[planType];
        return await this.stripeService.createSubscription(customerId, config.priceId, config.metadata);
    }
    async createSponsorshipCoupon(sponsorCustomerId) {
        this.logger.log(`Creating sponsorship coupon for customer: ${sponsorCustomerId}`);
        return await this.stripeService.createCoupon(`sponsorship-${sponsorCustomerId}`, 100, undefined, 'usd', 'once');
    }
    async processSponsorshipPayment(sponsorCustomerId, sponsoredCustomerId) {
        this.logger.log(`Processing sponsorship payment from ${sponsorCustomerId} for ${sponsoredCustomerId}`);
        const invoice = await this.stripeService.createInvoice(sponsorCustomerId, 0);
        await this.stripeService.createInvoiceItem(sponsorCustomerId, 'price_sponsorship', invoice.id);
        const finalizedInvoice = await this.stripeService.finalizeInvoice(invoice.id);
        return finalizedInvoice;
    }
};
exports.BillingService = BillingService;
exports.BillingService = BillingService = BillingService_1 = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [stripe_service_1.StripeService])
], BillingService);
//# sourceMappingURL=billing.service.js.map