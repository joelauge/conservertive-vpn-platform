"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SponsorshipRequest = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../user/entities/user.entity");
let SponsorshipRequest = class SponsorshipRequest {
};
exports.SponsorshipRequest = SponsorshipRequest;
tslib_1.__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    tslib_1.__metadata("design:type", String)
], SponsorshipRequest.prototype, "id", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", String)
], SponsorshipRequest.prototype, "userId", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)(),
    tslib_1.__metadata("design:type", String)
], SponsorshipRequest.prototype, "country", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)('text'),
    tslib_1.__metadata("design:type", String)
], SponsorshipRequest.prototype, "reason", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ['low', 'medium', 'high'],
        default: 'medium',
    }),
    tslib_1.__metadata("design:type", String)
], SponsorshipRequest.prototype, "urgency", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], SponsorshipRequest.prototype, "ipAddress", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    tslib_1.__metadata("design:type", String)
], SponsorshipRequest.prototype, "userAgent", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ['pending', 'matched', 'expired', 'cancelled'],
        default: 'pending',
    }),
    tslib_1.__metadata("design:type", String)
], SponsorshipRequest.prototype, "status", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    tslib_1.__metadata("design:type", Date)
], SponsorshipRequest.prototype, "matchedAt", void 0);
tslib_1.__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    tslib_1.__metadata("design:type", Date)
], SponsorshipRequest.prototype, "createdAt", void 0);
tslib_1.__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    tslib_1.__metadata("design:type", Date)
], SponsorshipRequest.prototype, "updatedAt", void 0);
tslib_1.__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    tslib_1.__metadata("design:type", user_entity_1.User)
], SponsorshipRequest.prototype, "user", void 0);
exports.SponsorshipRequest = SponsorshipRequest = tslib_1.__decorate([
    (0, typeorm_1.Entity)('sponsorship_requests')
], SponsorshipRequest);
//# sourceMappingURL=sponsorship-request.entity.js.map