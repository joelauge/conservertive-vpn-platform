"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sponsorship = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../user/entities/user.entity");
let Sponsorship = class Sponsorship {
};
exports.Sponsorship = Sponsorship;
tslib_1.__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    tslib_1.__metadata("design:type", String)
], Sponsorship.prototype, "id", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", String)
], Sponsorship.prototype, "sponsorUserId", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", String)
], Sponsorship.prototype, "sponsoredUserId", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", String)
], Sponsorship.prototype, "sponsorshipRequestId", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], Sponsorship.prototype, "stripeSubscriptionId", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], Sponsorship.prototype, "stripeCouponId", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('int'),
    tslib_1.__metadata("design:type", Number)
], Sponsorship.prototype, "amount", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ default: 'usd' }),
    tslib_1.__metadata("design:type", String)
], Sponsorship.prototype, "currency", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('int'),
    tslib_1.__metadata("design:type", Number)
], Sponsorship.prototype, "duration", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ['active', 'expired', 'cancelled', 'completed'],
        default: 'active',
    }),
    tslib_1.__metadata("design:type", String)
], Sponsorship.prototype, "status", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", Date)
], Sponsorship.prototype, "startDate", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", Date)
], Sponsorship.prototype, "endDate", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    tslib_1.__metadata("design:type", Date)
], Sponsorship.prototype, "cancelledAt", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], Sponsorship.prototype, "cancellationReason", void 0);
tslib_1.__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    tslib_1.__metadata("design:type", Date)
], Sponsorship.prototype, "createdAt", void 0);
tslib_1.__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    tslib_1.__metadata("design:type", Date)
], Sponsorship.prototype, "updatedAt", void 0);
tslib_1.__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'sponsorUserId' }),
    tslib_1.__metadata("design:type", user_entity_1.User)
], Sponsorship.prototype, "sponsorUser", void 0);
tslib_1.__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'sponsoredUserId' }),
    tslib_1.__metadata("design:type", user_entity_1.User)
], Sponsorship.prototype, "sponsoredUser", void 0);
exports.Sponsorship = Sponsorship = tslib_1.__decorate([
    (0, typeorm_1.Entity)('sponsorships')
], Sponsorship);
//# sourceMappingURL=sponsorship.entity.js.map