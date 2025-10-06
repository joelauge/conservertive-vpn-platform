"use strict";
var VpnController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.VpnController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const vpn_protocol_service_1 = require("./vpn-protocol.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
let VpnController = VpnController_1 = class VpnController {
    constructor(vpnProtocolService) {
        this.vpnProtocolService = vpnProtocolService;
        this.logger = new common_1.Logger(VpnController_1.name);
    }
    async getServers() {
        this.logger.log('Getting all VPN servers');
        const servers = [
            {
                id: 'us-east-1',
                name: 'US East Server',
                country: 'US',
                region: 'north-america',
                publicIp: '54.123.45.67',
                privateIp: '10.0.1.100',
                protocols: [
                    { name: 'openvpn', port: 1194, status: 'active', config: {} },
                    { name: 'wireguard', port: 51820, status: 'active', config: {} },
                    { name: 'ikev2', port: 500, status: 'active', config: {} },
                ],
                status: 'active',
                load: 0.3,
                maxConnections: 1000,
                currentConnections: 300,
            },
            {
                id: 'eu-west-1',
                name: 'EU West Server',
                country: 'GB',
                region: 'europe',
                publicIp: '52.123.45.67',
                privateIp: '10.0.2.100',
                protocols: [
                    { name: 'openvpn', port: 1194, status: 'active', config: {} },
                    { name: 'wireguard', port: 51820, status: 'active', config: {} },
                    { name: 'ikev2', port: 500, status: 'active', config: {} },
                ],
                status: 'active',
                load: 0.5,
                maxConnections: 1000,
                currentConnections: 500,
            },
        ];
        return servers;
    }
    async getServer(serverId) {
        this.logger.log(`Getting VPN server: ${serverId}`);
        const server = {
            id: serverId,
            name: `${serverId} Server`,
            country: 'US',
            region: 'north-america',
            publicIp: '54.123.45.67',
            privateIp: '10.0.1.100',
            protocols: [
                { name: 'openvpn', port: 1194, status: 'active', config: {} },
                { name: 'wireguard', port: 51820, status: 'active', config: {} },
                { name: 'ikev2', port: 500, status: 'active', config: {} },
            ],
            status: 'active',
            load: 0.3,
            maxConnections: 1000,
            currentConnections: 300,
        };
        return server;
    }
    async getServerStatus(serverId) {
        this.logger.log(`Getting server status for: ${serverId}`);
        return await this.vpnProtocolService.getServerStatus(serverId);
    }
    async setupServer(serverId, protocols) {
        this.logger.log(`Setting up VPN server: ${serverId} with protocols: ${protocols.protocols.join(', ')}`);
        const serverConfig = {
            id: serverId,
            name: `${serverId} Server`,
            country: 'US',
            region: 'north-america',
            publicIp: '54.123.45.67',
            privateIp: '10.0.1.100',
            protocols: [],
            status: 'active',
            load: 0,
            maxConnections: 1000,
            currentConnections: 0,
        };
        const setupPromises = protocols.protocols.map(async (protocol) => {
            switch (protocol) {
                case 'openvpn':
                    await this.vpnProtocolService.setupOpenVpnServer(serverConfig);
                    break;
                case 'wireguard':
                    await this.vpnProtocolService.setupWireGuardServer(serverConfig);
                    break;
                case 'ikev2':
                    await this.vpnProtocolService.setupIkev2Server(serverConfig);
                    break;
                default:
                    throw new Error(`Unsupported protocol: ${protocol}`);
            }
        });
        await Promise.all(setupPromises);
        return {
            message: `VPN server ${serverId} setup completed successfully`,
            protocols: protocols.protocols,
        };
    }
    async generateClientConfig(userId, configRequest) {
        this.logger.log(`Generating ${configRequest.protocol} config for user: ${userId}`);
        const config = await this.vpnProtocolService.generateClientConfig(userId, configRequest.serverId, configRequest.protocol);
        return {
            config,
            protocol: configRequest.protocol,
            serverId: configRequest.serverId,
        };
    }
    async getConnections() {
        this.logger.log('Getting active VPN connections');
        const connections = [
            {
                id: 'conn-1',
                userId: 'user-1',
                serverId: 'us-east-1',
                protocol: 'openvpn',
                connectedAt: new Date(Date.now() - 3600000),
                bytesTransferred: 1024000,
                ipAddress: '10.8.0.2',
            },
            {
                id: 'conn-2',
                userId: 'user-2',
                serverId: 'eu-west-1',
                protocol: 'wireguard',
                connectedAt: new Date(Date.now() - 7200000),
                bytesTransferred: 2048000,
                ipAddress: '10.7.0.3',
            },
        ];
        return connections;
    }
    async getConnection(connectionId) {
        this.logger.log(`Getting VPN connection: ${connectionId}`);
        const connection = {
            id: connectionId,
            userId: 'user-1',
            serverId: 'us-east-1',
            protocol: 'openvpn',
            connectedAt: new Date(Date.now() - 3600000),
            bytesTransferred: 1024000,
            ipAddress: '10.8.0.2',
        };
        return connection;
    }
    async getProtocols() {
        this.logger.log('Getting supported VPN protocols');
        return {
            protocols: [
                {
                    name: 'openvpn',
                    description: 'OpenVPN - Industry standard VPN protocol with high compatibility',
                    ports: [1194],
                },
                {
                    name: 'wireguard',
                    description: 'WireGuard - Modern, fast VPN protocol with minimal attack surface',
                    ports: [51820],
                },
                {
                    name: 'ikev2',
                    description: 'IKEv2/IPSec - Enterprise-grade protocol with native mobile support',
                    ports: [500, 4500],
                },
            ],
        };
    }
    async getStats() {
        this.logger.log('Getting VPN service statistics');
        return {
            totalServers: 2,
            activeServers: 2,
            totalConnections: 800,
            activeConnections: 800,
            protocols: {
                openvpn: { connections: 400, servers: 2 },
                wireguard: { connections: 300, servers: 2 },
                ikev2: { connections: 100, servers: 2 },
            },
            regions: {
                'north-america': { servers: 1, connections: 400 },
                'europe': { servers: 1, connections: 400 },
            },
            uptime: '99.9%',
            averageLatency: 45,
        };
    }
    async restartServer(serverId) {
        this.logger.log(`Restarting VPN server: ${serverId}`);
        return {
            message: `VPN server ${serverId} restart initiated`,
        };
    }
    async maintenanceMode(serverId, maintenance) {
        this.logger.log(`Setting maintenance mode for server ${serverId}: ${maintenance.enabled}`);
        return {
            message: `Server ${serverId} maintenance mode ${maintenance.enabled ? 'activated' : 'deactivated'}`,
            maintenance: maintenance.enabled,
        };
    }
};
exports.VpnController = VpnController;
tslib_1.__decorate([
    (0, common_1.Get)('servers'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all VPN servers' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of VPN servers' }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], VpnController.prototype, "getServers", null);
tslib_1.__decorate([
    (0, common_1.Get)('servers/:serverId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get VPN server by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'VPN server details' }),
    tslib_1.__param(0, (0, common_1.Param)('serverId')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], VpnController.prototype, "getServer", null);
tslib_1.__decorate([
    (0, common_1.Get)('servers/:serverId/status'),
    (0, swagger_1.ApiOperation)({ summary: 'Get VPN server status' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Server status and metrics' }),
    tslib_1.__param(0, (0, common_1.Param)('serverId')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], VpnController.prototype, "getServerStatus", null);
tslib_1.__decorate([
    (0, common_1.Post)('servers/:serverId/setup'),
    (0, roles_decorator_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Setup VPN server protocols' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Server setup completed' }),
    tslib_1.__param(0, (0, common_1.Param)('serverId')),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], VpnController.prototype, "setupServer", null);
tslib_1.__decorate([
    (0, common_1.Post)('clients/:userId/config'),
    (0, swagger_1.ApiOperation)({ summary: 'Generate VPN client configuration' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Client configuration generated' }),
    tslib_1.__param(0, (0, common_1.Param)('userId')),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], VpnController.prototype, "generateClientConfig", null);
tslib_1.__decorate([
    (0, common_1.Get)('connections'),
    (0, swagger_1.ApiOperation)({ summary: 'Get active VPN connections' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of active connections' }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], VpnController.prototype, "getConnections", null);
tslib_1.__decorate([
    (0, common_1.Get)('connections/:connectionId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get VPN connection by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Connection details' }),
    tslib_1.__param(0, (0, common_1.Param)('connectionId')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], VpnController.prototype, "getConnection", null);
tslib_1.__decorate([
    (0, common_1.Get)('protocols'),
    (0, swagger_1.ApiOperation)({ summary: 'Get supported VPN protocols' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'List of supported protocols' }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], VpnController.prototype, "getProtocols", null);
tslib_1.__decorate([
    (0, common_1.Get)('stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Get VPN service statistics' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Service statistics' }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], VpnController.prototype, "getStats", null);
tslib_1.__decorate([
    (0, common_1.Post)('servers/:serverId/restart'),
    (0, roles_decorator_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Restart VPN server' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Server restart initiated' }),
    tslib_1.__param(0, (0, common_1.Param)('serverId')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], VpnController.prototype, "restartServer", null);
tslib_1.__decorate([
    (0, common_1.Post)('servers/:serverId/maintenance'),
    (0, roles_decorator_1.Roles)('admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Put VPN server in maintenance mode' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Server maintenance mode activated' }),
    tslib_1.__param(0, (0, common_1.Param)('serverId')),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], VpnController.prototype, "maintenanceMode", null);
exports.VpnController = VpnController = VpnController_1 = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('vpn'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('vpn'),
    tslib_1.__metadata("design:paramtypes", [vpn_protocol_service_1.VpnProtocolService])
], VpnController);
//# sourceMappingURL=vpn.controller.js.map