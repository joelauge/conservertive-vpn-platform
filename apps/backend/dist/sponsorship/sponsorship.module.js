"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SponsorshipModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const sponsorship_service_1 = require("./sponsorship.service");
const sponsorship_controller_1 = require("./sponsorship.controller");
const sponsorship_entity_1 = require("./entities/sponsorship.entity");
const sponsorship_request_entity_1 = require("./entities/sponsorship-request.entity");
const user_entity_1 = require("../user/entities/user.entity");
const billing_module_1 = require("../billing/billing.module");
let SponsorshipModule = class SponsorshipModule {
};
exports.SponsorshipModule = SponsorshipModule;
exports.SponsorshipModule = SponsorshipModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([sponsorship_entity_1.Sponsorship, sponsorship_request_entity_1.SponsorshipRequest, user_entity_1.User]),
            billing_module_1.BillingModule,
        ],
        providers: [sponsorship_service_1.SponsorshipService],
        controllers: [sponsorship_controller_1.SponsorshipController],
        exports: [sponsorship_service_1.SponsorshipService],
    })
], SponsorshipModule);
//# sourceMappingURL=sponsorship.module.js.map