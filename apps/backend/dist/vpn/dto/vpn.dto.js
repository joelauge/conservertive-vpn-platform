"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VpnStatsDto = exports.VpnServerDto = exports.VpnConnectionDto = exports.ServerSelectionDto = exports.MaintenanceModeDto = exports.SetupServerDto = exports.GenerateClientConfigDto = exports.UpdateVpnServerDto = exports.CreateVpnServerDto = void 0;
const tslib_1 = require("tslib");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateVpnServerDto {
}
exports.CreateVpnServerDto = CreateVpnServerDto;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Server name' }),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], CreateVpnServerDto.prototype, "name", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Server country code' }),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], CreateVpnServerDto.prototype, "country", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Server region' }),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], CreateVpnServerDto.prototype, "region", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Server public IP address' }),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], CreateVpnServerDto.prototype, "publicIp", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Server private IP address' }),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], CreateVpnServerDto.prototype, "privateIp", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Supported VPN protocols', enum: ['openvpn', 'wireguard', 'ikev2'] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsEnum)(['openvpn', 'wireguard', 'ikev2'], { each: true }),
    tslib_1.__metadata("design:type", Array)
], CreateVpnServerDto.prototype, "protocols", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Maximum concurrent connections' }),
    (0, class_validator_1.IsNumber)(),
    tslib_1.__metadata("design:type", Number)
], CreateVpnServerDto.prototype, "maxConnections", void 0);
class UpdateVpnServerDto {
}
exports.UpdateVpnServerDto = UpdateVpnServerDto;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Server name', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], UpdateVpnServerDto.prototype, "name", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Server status', enum: ['active', 'inactive', 'maintenance'], required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['active', 'inactive', 'maintenance']),
    tslib_1.__metadata("design:type", String)
], UpdateVpnServerDto.prototype, "status", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Maximum concurrent connections', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    tslib_1.__metadata("design:type", Number)
], UpdateVpnServerDto.prototype, "maxConnections", void 0);
class GenerateClientConfigDto {
}
exports.GenerateClientConfigDto = GenerateClientConfigDto;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Target server ID' }),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], GenerateClientConfigDto.prototype, "serverId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ description: 'VPN protocol', enum: ['openvpn', 'wireguard', 'ikev2'] }),
    (0, class_validator_1.IsEnum)(['openvpn', 'wireguard', 'ikev2']),
    tslib_1.__metadata("design:type", String)
], GenerateClientConfigDto.prototype, "protocol", void 0);
class SetupServerDto {
}
exports.SetupServerDto = SetupServerDto;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ description: 'VPN protocols to setup', enum: ['openvpn', 'wireguard', 'ikev2'] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsEnum)(['openvpn', 'wireguard', 'ikev2'], { each: true }),
    tslib_1.__metadata("design:type", Array)
], SetupServerDto.prototype, "protocols", void 0);
class MaintenanceModeDto {
}
exports.MaintenanceModeDto = MaintenanceModeDto;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Enable maintenance mode' }),
    (0, class_validator_1.IsBoolean)(),
    tslib_1.__metadata("design:type", Boolean)
], MaintenanceModeDto.prototype, "enabled", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Maintenance reason', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], MaintenanceModeDto.prototype, "reason", void 0);
class ServerSelectionDto {
}
exports.ServerSelectionDto = ServerSelectionDto;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Preferred country code', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    tslib_1.__metadata("design:type", String)
], ServerSelectionDto.prototype, "preferredCountry", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Preferred protocol', enum: ['openvpn', 'wireguard', 'ikev2'], required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(['openvpn', 'wireguard', 'ikev2']),
    tslib_1.__metadata("design:type", String)
], ServerSelectionDto.prototype, "preferredProtocol", void 0);
class VpnConnectionDto {
}
exports.VpnConnectionDto = VpnConnectionDto;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Connection ID' }),
    tslib_1.__metadata("design:type", String)
], VpnConnectionDto.prototype, "id", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User ID' }),
    tslib_1.__metadata("design:type", String)
], VpnConnectionDto.prototype, "userId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Server ID' }),
    tslib_1.__metadata("design:type", String)
], VpnConnectionDto.prototype, "serverId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ description: 'VPN protocol' }),
    tslib_1.__metadata("design:type", String)
], VpnConnectionDto.prototype, "protocol", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Connection timestamp' }),
    tslib_1.__metadata("design:type", Date)
], VpnConnectionDto.prototype, "connectedAt", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Disconnection timestamp', required: false }),
    tslib_1.__metadata("design:type", Date)
], VpnConnectionDto.prototype, "disconnectedAt", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Bytes transferred' }),
    tslib_1.__metadata("design:type", Number)
], VpnConnectionDto.prototype, "bytesTransferred", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Client IP address' }),
    tslib_1.__metadata("design:type", String)
], VpnConnectionDto.prototype, "ipAddress", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Connection status' }),
    tslib_1.__metadata("design:type", String)
], VpnConnectionDto.prototype, "status", void 0);
class VpnServerDto {
}
exports.VpnServerDto = VpnServerDto;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Server ID' }),
    tslib_1.__metadata("design:type", String)
], VpnServerDto.prototype, "id", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Server name' }),
    tslib_1.__metadata("design:type", String)
], VpnServerDto.prototype, "name", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Server country' }),
    tslib_1.__metadata("design:type", String)
], VpnServerDto.prototype, "country", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Server region' }),
    tslib_1.__metadata("design:type", String)
], VpnServerDto.prototype, "region", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Server public IP' }),
    tslib_1.__metadata("design:type", String)
], VpnServerDto.prototype, "publicIp", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Server private IP' }),
    tslib_1.__metadata("design:type", String)
], VpnServerDto.prototype, "privateIp", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Supported protocols' }),
    tslib_1.__metadata("design:type", Array)
], VpnServerDto.prototype, "protocols", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Server status' }),
    tslib_1.__metadata("design:type", String)
], VpnServerDto.prototype, "status", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Current load percentage' }),
    tslib_1.__metadata("design:type", Number)
], VpnServerDto.prototype, "load", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Maximum connections' }),
    tslib_1.__metadata("design:type", Number)
], VpnServerDto.prototype, "maxConnections", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Current connections' }),
    tslib_1.__metadata("design:type", Number)
], VpnServerDto.prototype, "currentConnections", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Creation timestamp' }),
    tslib_1.__metadata("design:type", Date)
], VpnServerDto.prototype, "createdAt", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Last update timestamp' }),
    tslib_1.__metadata("design:type", Date)
], VpnServerDto.prototype, "updatedAt", void 0);
class VpnStatsDto {
}
exports.VpnStatsDto = VpnStatsDto;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total number of servers' }),
    tslib_1.__metadata("design:type", Number)
], VpnStatsDto.prototype, "totalServers", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Number of active servers' }),
    tslib_1.__metadata("design:type", Number)
], VpnStatsDto.prototype, "activeServers", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total connections' }),
    tslib_1.__metadata("design:type", Number)
], VpnStatsDto.prototype, "totalConnections", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Active connections' }),
    tslib_1.__metadata("design:type", Number)
], VpnStatsDto.prototype, "activeConnections", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Connections by protocol' }),
    tslib_1.__metadata("design:type", Object)
], VpnStatsDto.prototype, "protocols", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Connections by region' }),
    tslib_1.__metadata("design:type", Object)
], VpnStatsDto.prototype, "regions", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Service uptime percentage' }),
    tslib_1.__metadata("design:type", String)
], VpnStatsDto.prototype, "uptime", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Average latency in milliseconds' }),
    tslib_1.__metadata("design:type", Number)
], VpnStatsDto.prototype, "averageLatency", void 0);
//# sourceMappingURL=vpn.dto.js.map