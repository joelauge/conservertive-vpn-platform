"use strict";
var BillingController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillingController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const billing_service_1 = require("./billing.service");
let BillingController = BillingController_1 = class BillingController {
    constructor(billingService) {
        this.billingService = billingService;
        this.logger = new common_1.Logger(BillingController_1.name);
    }
    async createCustomer(createCustomerDto) {
        this.logger.log('Creating customer via API');
        return await this.billingService.createCustomer(createCustomerDto);
    }
    async listCustomers(limit, email) {
        this.logger.log('Listing customers via API');
        return await this.billingService.listCustomers(limit, email);
    }
    async createProduct(createProductDto) {
        this.logger.log('Creating product via API');
        return await this.billingService.createProduct(createProductDto);
    }
    async listProducts(limit) {
        this.logger.log('Listing products via API');
        return await this.billingService.listProducts(limit);
    }
    async createPrice(createPriceDto) {
        this.logger.log('Creating price via API');
        return await this.billingService.createPrice(createPriceDto);
    }
    async listPrices(productId, limit) {
        this.logger.log('Listing prices via API');
        return await this.billingService.listPrices(productId, limit);
    }
    async createSubscription(createSubscriptionDto) {
        this.logger.log('Creating subscription via API');
        return await this.billingService.createSubscription(createSubscriptionDto);
    }
    async listSubscriptions(customerId, priceId, status, limit) {
        this.logger.log('Listing subscriptions via API');
        return await this.billingService.listSubscriptions(customerId, priceId, status, limit);
    }
    async cancelSubscription(subscriptionId) {
        this.logger.log(`Cancelling subscription ${subscriptionId} via API`);
        return await this.billingService.cancelSubscription(subscriptionId);
    }
    async updateSubscription(subscriptionId, updateData) {
        this.logger.log(`Updating subscription ${subscriptionId} via API`);
        return await this.billingService.updateSubscription(subscriptionId, updateData.items, updateData.prorationBehavior);
    }
    async createPaymentLink(createPaymentLinkDto) {
        this.logger.log('Creating payment link via API');
        return await this.billingService.createPaymentLink(createPaymentLinkDto);
    }
    async createInvoice(invoiceData) {
        this.logger.log('Creating invoice via API');
        return await this.billingService.createInvoice(invoiceData.customerId, invoiceData.daysUntilDue);
    }
    async createInvoiceItem(itemData) {
        this.logger.log('Creating invoice item via API');
        return await this.billingService.createInvoiceItem(itemData.customerId, itemData.priceId, itemData.invoiceId);
    }
    async finalizeInvoice(invoiceId) {
        this.logger.log(`Finalizing invoice ${invoiceId} via API`);
        return await this.billingService.finalizeInvoice(invoiceId);
    }
    async listPaymentIntents(customerId, limit) {
        this.logger.log('Listing payment intents via API');
        return await this.billingService.listPaymentIntents(customerId, limit);
    }
    async createRefund(refundData) {
        this.logger.log('Creating refund via API');
        return await this.billingService.createRefund(refundData.paymentIntentId, refundData.amount, refundData.reason);
    }
    async getBalance() {
        this.logger.log('Retrieving balance via API');
        return await this.billingService.getBalance();
    }
    async listCoupons(limit) {
        this.logger.log('Listing coupons via API');
        return await this.billingService.listCoupons(limit);
    }
    async createCoupon(couponData) {
        this.logger.log('Creating coupon via API');
        return await this.billingService.createCoupon(couponData.name, couponData.percentOff, couponData.amountOff, couponData.currency, couponData.duration, couponData.durationInMonths);
    }
    async listDisputes(chargeId, paymentIntentId, limit) {
        this.logger.log('Listing disputes via API');
        return await this.billingService.listDisputes(chargeId, paymentIntentId, limit);
    }
    async updateDispute(disputeId, disputeData) {
        this.logger.log(`Updating dispute ${disputeId} via API`);
        return await this.billingService.updateDispute(disputeId, disputeData.evidence, disputeData.submit);
    }
    async createVpnSubscription(subscriptionData) {
        this.logger.log('Creating VPN subscription via API');
        return await this.billingService.createVpnSubscription(subscriptionData.customerId, subscriptionData.planType);
    }
    async createSponsorshipCoupon(couponData) {
        this.logger.log('Creating sponsorship coupon via API');
        return await this.billingService.createSponsorshipCoupon(couponData.sponsorCustomerId);
    }
    async processSponsorshipPayment(paymentData) {
        this.logger.log('Processing sponsorship payment via API');
        return await this.billingService.processSponsorshipPayment(paymentData.sponsorCustomerId, paymentData.sponsoredCustomerId);
    }
};
exports.BillingController = BillingController;
tslib_1.__decorate([
    (0, common_1.Post)('customers'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], BillingController.prototype, "createCustomer", null);
tslib_1.__decorate([
    (0, common_1.Get)('customers'),
    tslib_1.__param(0, (0, common_1.Query)('limit')),
    tslib_1.__param(1, (0, common_1.Query)('email')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, String]),
    tslib_1.__metadata("design:returntype", Promise)
], BillingController.prototype, "listCustomers", null);
tslib_1.__decorate([
    (0, common_1.Post)('products'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], BillingController.prototype, "createProduct", null);
tslib_1.__decorate([
    (0, common_1.Get)('products'),
    tslib_1.__param(0, (0, common_1.Query)('limit')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number]),
    tslib_1.__metadata("design:returntype", Promise)
], BillingController.prototype, "listProducts", null);
tslib_1.__decorate([
    (0, common_1.Post)('prices'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], BillingController.prototype, "createPrice", null);
tslib_1.__decorate([
    (0, common_1.Get)('prices'),
    tslib_1.__param(0, (0, common_1.Query)('productId')),
    tslib_1.__param(1, (0, common_1.Query)('limit')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Number]),
    tslib_1.__metadata("design:returntype", Promise)
], BillingController.prototype, "listPrices", null);
tslib_1.__decorate([
    (0, common_1.Post)('subscriptions'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], BillingController.prototype, "createSubscription", null);
tslib_1.__decorate([
    (0, common_1.Get)('subscriptions'),
    tslib_1.__param(0, (0, common_1.Query)('customerId')),
    tslib_1.__param(1, (0, common_1.Query)('priceId')),
    tslib_1.__param(2, (0, common_1.Query)('status')),
    tslib_1.__param(3, (0, common_1.Query)('limit')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String, String, Number]),
    tslib_1.__metadata("design:returntype", Promise)
], BillingController.prototype, "listSubscriptions", null);
tslib_1.__decorate([
    (0, common_1.Post)('subscriptions/:id/cancel'),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], BillingController.prototype, "cancelSubscription", null);
tslib_1.__decorate([
    (0, common_1.Post)('subscriptions/:id/update'),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], BillingController.prototype, "updateSubscription", null);
tslib_1.__decorate([
    (0, common_1.Post)('payment-links'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], BillingController.prototype, "createPaymentLink", null);
tslib_1.__decorate([
    (0, common_1.Post)('invoices'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], BillingController.prototype, "createInvoice", null);
tslib_1.__decorate([
    (0, common_1.Post)('invoice-items'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], BillingController.prototype, "createInvoiceItem", null);
tslib_1.__decorate([
    (0, common_1.Post)('invoices/:id/finalize'),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], BillingController.prototype, "finalizeInvoice", null);
tslib_1.__decorate([
    (0, common_1.Get)('payment-intents'),
    tslib_1.__param(0, (0, common_1.Query)('customerId')),
    tslib_1.__param(1, (0, common_1.Query)('limit')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Number]),
    tslib_1.__metadata("design:returntype", Promise)
], BillingController.prototype, "listPaymentIntents", null);
tslib_1.__decorate([
    (0, common_1.Post)('refunds'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], BillingController.prototype, "createRefund", null);
tslib_1.__decorate([
    (0, common_1.Get)('balance'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], BillingController.prototype, "getBalance", null);
tslib_1.__decorate([
    (0, common_1.Get)('coupons'),
    tslib_1.__param(0, (0, common_1.Query)('limit')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number]),
    tslib_1.__metadata("design:returntype", Promise)
], BillingController.prototype, "listCoupons", null);
tslib_1.__decorate([
    (0, common_1.Post)('coupons'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], BillingController.prototype, "createCoupon", null);
tslib_1.__decorate([
    (0, common_1.Get)('disputes'),
    tslib_1.__param(0, (0, common_1.Query)('chargeId')),
    tslib_1.__param(1, (0, common_1.Query)('paymentIntentId')),
    tslib_1.__param(2, (0, common_1.Query)('limit')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String, Number]),
    tslib_1.__metadata("design:returntype", Promise)
], BillingController.prototype, "listDisputes", null);
tslib_1.__decorate([
    (0, common_1.Post)('disputes/:id/update'),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], BillingController.prototype, "updateDispute", null);
tslib_1.__decorate([
    (0, common_1.Post)('vpn-subscriptions'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], BillingController.prototype, "createVpnSubscription", null);
tslib_1.__decorate([
    (0, common_1.Post)('sponsorship-coupons'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], BillingController.prototype, "createSponsorshipCoupon", null);
tslib_1.__decorate([
    (0, common_1.Post)('sponsorship-payments'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], BillingController.prototype, "processSponsorshipPayment", null);
exports.BillingController = BillingController = BillingController_1 = tslib_1.__decorate([
    (0, common_1.Controller)('billing'),
    tslib_1.__metadata("design:paramtypes", [billing_service_1.BillingService])
], BillingController);
//# sourceMappingURL=billing.controller.js.map