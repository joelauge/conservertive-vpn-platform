"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VpnModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const vpn_controller_1 = require("./vpn.controller");
const vpn_protocol_service_1 = require("./vpn-protocol.service");
const vpn_service_1 = require("./vpn.service");
let VpnModule = class VpnModule {
};
exports.VpnModule = VpnModule;
exports.VpnModule = VpnModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [config_1.ConfigModule],
        controllers: [vpn_controller_1.VpnController],
        providers: [vpn_protocol_service_1.VpnProtocolService, vpn_service_1.VpnService],
        exports: [vpn_protocol_service_1.VpnProtocolService, vpn_service_1.VpnService],
    })
], VpnModule);
//# sourceMappingURL=vpn.module.js.map