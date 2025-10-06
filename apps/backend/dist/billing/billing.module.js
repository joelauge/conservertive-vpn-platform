"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillingModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const stripe_service_1 = require("./stripe.service");
const billing_controller_1 = require("./billing.controller");
const billing_service_1 = require("./billing.service");
let BillingModule = class BillingModule {
};
exports.BillingModule = BillingModule;
exports.BillingModule = BillingModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [config_1.ConfigModule],
        providers: [stripe_service_1.StripeService, billing_service_1.BillingService],
        controllers: [billing_controller_1.BillingController],
        exports: [stripe_service_1.StripeService, billing_service_1.BillingService],
    })
], BillingModule);
//# sourceMappingURL=billing.module.js.map