"use strict";
var StripeService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StripeService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const stripe_1 = tslib_1.__importDefault(require("stripe"));
let StripeService = StripeService_1 = class StripeService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(StripeService_1.name);
        const stripeSecretKey = this.configService.get('STRIPE_SECRET_KEY');
        if (!stripeSecretKey) {
            throw new Error('STRIPE_SECRET_KEY is not configured');
        }
        this.stripe = new stripe_1.default(stripeSecretKey, {
            apiVersion: '2025-08-27.basil',
        });
        this.logger.log('Stripe service initialized');
    }
    async createCustomer(email, name, metadata) {
        try {
            const customer = await this.stripe.customers.create({
                email,
                name,
                metadata: Object.assign(Object.assign({}, metadata), { service: 'conservertive-vpn' }),
            });
            this.logger.log(`Created Stripe customer: ${customer.id}`);
            return customer;
        }
        catch (error) {
            this.logger.error('Failed to create Stripe customer', error);
            throw error;
        }
    }
    async createProduct(name, description) {
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
        }
        catch (error) {
            this.logger.error('Failed to create Stripe product', error);
            throw error;
        }
    }
    async createPrice(productId, unitAmount, currency = 'usd', interval) {
        try {
            const priceData = {
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
        }
        catch (error) {
            this.logger.error('Failed to create Stripe price', error);
            throw error;
        }
    }
    async createSubscription(customerId, priceId, metadata) {
        try {
            const subscription = await this.stripe.subscriptions.create({
                customer: customerId,
                items: [{ price: priceId }],
                metadata: Object.assign(Object.assign({}, metadata), { service: 'conservertive-vpn' }),
                expand: ['latest_invoice.payment_intent'],
            });
            this.logger.log(`Created Stripe subscription: ${subscription.id}`);
            return subscription;
        }
        catch (error) {
            this.logger.error('Failed to create Stripe subscription', error);
            throw error;
        }
    }
    async createPaymentLink(priceId, quantity = 1, redirectUrl) {
        try {
            const paymentLink = await this.stripe.paymentLinks.create(Object.assign({ line_items: [
                    {
                        price: priceId,
                        quantity,
                    },
                ], metadata: {
                    service: 'conservertive-vpn',
                } }, (redirectUrl && { after_completion: { type: 'redirect', redirect: { url: redirectUrl } } })));
            this.logger.log(`Created Stripe payment link: ${paymentLink.id}`);
            return paymentLink;
        }
        catch (error) {
            this.logger.error('Failed to create Stripe payment link', error);
            throw error;
        }
    }
    async createInvoice(customerId, daysUntilDue = 30) {
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
        }
        catch (error) {
            this.logger.error('Failed to create Stripe invoice', error);
            throw error;
        }
    }
    async createInvoiceItem(customerId, priceId, invoiceId) {
        try {
            const invoiceItem = await this.stripe.invoiceItems.create({
                customer: customerId,
                invoice: invoiceId,
                amount: 1000,
                currency: 'usd',
                description: 'VPN Service',
            });
            this.logger.log(`Created Stripe invoice item: ${invoiceItem.id}`);
            return invoiceItem;
        }
        catch (error) {
            this.logger.error('Failed to create Stripe invoice item', error);
            throw error;
        }
    }
    async finalizeInvoice(invoiceId) {
        try {
            const invoice = await this.stripe.invoices.finalizeInvoice(invoiceId);
            this.logger.log(`Finalized Stripe invoice: ${invoice.id}`);
            return invoice;
        }
        catch (error) {
            this.logger.error('Failed to finalize Stripe invoice', error);
            throw error;
        }
    }
    async createRefund(paymentIntentId, amount, reason) {
        try {
            const refund = await this.stripe.refunds.create(Object.assign(Object.assign({ payment_intent: paymentIntentId }, (amount && { amount })), (reason && { reason })));
            this.logger.log(`Created Stripe refund: ${refund.id}`);
            return refund;
        }
        catch (error) {
            this.logger.error('Failed to create Stripe refund', error);
            throw error;
        }
    }
    async getBalance() {
        try {
            const balance = await this.stripe.balance.retrieve();
            this.logger.log('Retrieved Stripe balance');
            return balance;
        }
        catch (error) {
            this.logger.error('Failed to retrieve Stripe balance', error);
            throw error;
        }
    }
    async listCustomers(limit = 10, email) {
        try {
            const params = Object.assign({ limit }, (email && { email }));
            const customers = await this.stripe.customers.list(params);
            this.logger.log(`Retrieved ${customers.data.length} Stripe customers`);
            return customers;
        }
        catch (error) {
            this.logger.error('Failed to list Stripe customers', error);
            throw error;
        }
    }
    async listProducts(limit = 10) {
        try {
            const products = await this.stripe.products.list({ limit });
            this.logger.log(`Retrieved ${products.data.length} Stripe products`);
            return products;
        }
        catch (error) {
            this.logger.error('Failed to list Stripe products', error);
            throw error;
        }
    }
    async listPrices(productId, limit = 10) {
        try {
            const params = Object.assign({ limit }, (productId && { product: productId }));
            const prices = await this.stripe.prices.list(params);
            this.logger.log(`Retrieved ${prices.data.length} Stripe prices`);
            return prices;
        }
        catch (error) {
            this.logger.error('Failed to list Stripe prices', error);
            throw error;
        }
    }
    async listPaymentIntents(customerId, limit = 10) {
        try {
            const params = Object.assign({ limit }, (customerId && { customer: customerId }));
            const paymentIntents = await this.stripe.paymentIntents.list(params);
            this.logger.log(`Retrieved ${paymentIntents.data.length} Stripe payment intents`);
            return paymentIntents;
        }
        catch (error) {
            this.logger.error('Failed to list Stripe payment intents', error);
            throw error;
        }
    }
    async listSubscriptions(customerId, priceId, status, limit = 10) {
        try {
            const params = Object.assign(Object.assign(Object.assign({ limit }, (customerId && { customer: customerId })), (priceId && { price: priceId })), (status && { status: status }));
            const subscriptions = await this.stripe.subscriptions.list(params);
            this.logger.log(`Retrieved ${subscriptions.data.length} Stripe subscriptions`);
            return subscriptions;
        }
        catch (error) {
            this.logger.error('Failed to list Stripe subscriptions', error);
            throw error;
        }
    }
    async cancelSubscription(subscriptionId) {
        try {
            const subscription = await this.stripe.subscriptions.cancel(subscriptionId);
            this.logger.log(`Cancelled Stripe subscription: ${subscription.id}`);
            return subscription;
        }
        catch (error) {
            this.logger.error('Failed to cancel Stripe subscription', error);
            throw error;
        }
    }
    async updateSubscription(subscriptionId, items, prorationBehavior) {
        try {
            const subscription = await this.stripe.subscriptions.update(subscriptionId, {
                items,
                proration_behavior: prorationBehavior,
            });
            this.logger.log(`Updated Stripe subscription: ${subscription.id}`);
            return subscription;
        }
        catch (error) {
            this.logger.error('Failed to update Stripe subscription', error);
            throw error;
        }
    }
    async listCoupons(limit = 10) {
        try {
            const coupons = await this.stripe.coupons.list({ limit });
            this.logger.log(`Retrieved ${coupons.data.length} Stripe coupons`);
            return coupons;
        }
        catch (error) {
            this.logger.error('Failed to list Stripe coupons', error);
            throw error;
        }
    }
    async createCoupon(name, percentOff, amountOff, currency, duration, durationInMonths) {
        try {
            const couponData = {
                name,
                metadata: {
                    service: 'conservertive-vpn',
                },
            };
            if (percentOff) {
                couponData.percent_off = percentOff;
            }
            else if (amountOff) {
                couponData.amount_off = amountOff;
                couponData.currency = currency || 'usd';
            }
            if (duration) {
                couponData.duration = duration;
                if (duration === 'repeating' && durationInMonths) {
                    couponData.duration_in_months = durationInMonths;
                }
            }
            const coupon = await this.stripe.coupons.create(couponData);
            this.logger.log(`Created Stripe coupon: ${coupon.id}`);
            return coupon;
        }
        catch (error) {
            this.logger.error('Failed to create Stripe coupon', error);
            throw error;
        }
    }
    async listDisputes(chargeId, paymentIntentId, limit = 10) {
        try {
            const params = Object.assign(Object.assign({ limit }, (chargeId && { charge: chargeId })), (paymentIntentId && { payment_intent: paymentIntentId }));
            const disputes = await this.stripe.disputes.list(params);
            this.logger.log(`Retrieved ${disputes.data.length} Stripe disputes`);
            return disputes;
        }
        catch (error) {
            this.logger.error('Failed to list Stripe disputes', error);
            throw error;
        }
    }
    async updateDispute(disputeId, evidence, submit) {
        try {
            const dispute = await this.stripe.disputes.update(disputeId, Object.assign(Object.assign({}, (evidence && { evidence })), (submit !== undefined && { submit })));
            this.logger.log(`Updated Stripe dispute: ${dispute.id}`);
            return dispute;
        }
        catch (error) {
            this.logger.error('Failed to update Stripe dispute', error);
            throw error;
        }
    }
};
exports.StripeService = StripeService;
exports.StripeService = StripeService = StripeService_1 = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [config_1.ConfigService])
], StripeService);
//# sourceMappingURL=stripe.service.js.map