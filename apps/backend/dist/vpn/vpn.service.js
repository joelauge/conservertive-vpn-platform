"use strict";
var VpnService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.VpnService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const vpn_protocol_service_1 = require("./vpn-protocol.service");
let VpnService = VpnService_1 = class VpnService {
    constructor(vpnProtocolService) {
        this.vpnProtocolService = vpnProtocolService;
        this.logger = new common_1.Logger(VpnService_1.name);
    }
    async getAllServers() {
        this.logger.log('Getting all VPN servers');
        const servers = [
            {
                id: 'us-east-1',
                name: 'US East Server',
                country: 'US',
                region: 'north-america',
                publicIp: '54.123.45.67',
                privateIp: '10.0.1.100',
                protocols: ['openvpn', 'wireguard', 'ikev2'],
                status: 'active',
                load: 0.3,
                maxConnections: 1000,
                currentConnections: 300,
                createdAt: new Date('2024-01-01'),
                updatedAt: new Date(),
            },
            {
                id: 'eu-west-1',
                name: 'EU West Server',
                country: 'GB',
                region: 'europe',
                publicIp: '52.123.45.67',
                privateIp: '10.0.2.100',
                protocols: ['openvpn', 'wireguard', 'ikev2'],
                status: 'active',
                load: 0.5,
                maxConnections: 1000,
                currentConnections: 500,
                createdAt: new Date('2024-01-01'),
                updatedAt: new Date(),
            },
            {
                id: 'ap-southeast-1',
                name: 'Asia Pacific Server',
                country: 'SG',
                region: 'asia',
                publicIp: '13.123.45.67',
                privateIp: '10.0.3.100',
                protocols: ['openvpn', 'wireguard', 'ikev2'],
                status: 'active',
                load: 0.2,
                maxConnections: 1000,
                currentConnections: 200,
                createdAt: new Date('2024-01-01'),
                updatedAt: new Date(),
            },
        ];
        return servers;
    }
    async getServerById(serverId) {
        this.logger.log(`Getting VPN server: ${serverId}`);
        const servers = await this.getAllServers();
        return servers.find(server => server.id === serverId) || null;
    }
    async getServersByRegion(region) {
        this.logger.log(`Getting VPN servers for region: ${region}`);
        const servers = await this.getAllServers();
        return servers.filter(server => server.region === region);
    }
    async getServersByCountry(country) {
        this.logger.log(`Getting VPN servers for country: ${country}`);
        const servers = await this.getAllServers();
        return servers.filter(server => server.country === country);
    }
    async getUserConnections(userId) {
        this.logger.log(`Getting connections for user: ${userId}`);
        const connections = [
            {
                id: 'conn-1',
                userId,
                serverId: 'us-east-1',
                protocol: 'openvpn',
                connectedAt: new Date(Date.now() - 3600000),
                bytesTransferred: 1024000,
                ipAddress: '10.8.0.2',
                status: 'connected',
            },
        ];
        return connections;
    }
    async getActiveConnections() {
        this.logger.log('Getting all active connections');
        const connections = [
            {
                id: 'conn-1',
                userId: 'user-1',
                serverId: 'us-east-1',
                protocol: 'openvpn',
                connectedAt: new Date(Date.now() - 3600000),
                bytesTransferred: 1024000,
                ipAddress: '10.8.0.2',
                status: 'connected',
            },
            {
                id: 'conn-2',
                userId: 'user-2',
                serverId: 'eu-west-1',
                protocol: 'wireguard',
                connectedAt: new Date(Date.now() - 7200000),
                bytesTransferred: 2048000,
                ipAddress: '10.7.0.3',
                status: 'connected',
            },
        ];
        return connections;
    }
    async selectBestServer(userId, preferredCountry, preferredProtocol) {
        this.logger.log(`Selecting best server for user: ${userId}`);
        const servers = await this.getAllServers();
        const activeServers = servers.filter(server => server.status === 'active');
        if (activeServers.length === 0) {
            return null;
        }
        let candidateServers = activeServers;
        if (preferredCountry) {
            candidateServers = activeServers.filter(server => server.country === preferredCountry);
        }
        if (candidateServers.length === 0) {
            candidateServers = activeServers;
        }
        if (preferredProtocol) {
            candidateServers = candidateServers.filter(server => server.protocols.includes(preferredProtocol));
        }
        if (candidateServers.length === 0) {
            candidateServers = activeServers;
        }
        const bestServer = candidateServers.reduce((best, current) => {
            return current.load < best.load ? current : best;
        });
        this.logger.log(`Selected server: ${bestServer.name} (load: ${bestServer.load})`);
        return bestServer;
    }
    async selectServerForProtocol(protocol, userId) {
        this.logger.log(`Selecting ${protocol} server for user: ${userId}`);
        const servers = await this.getAllServers();
        const protocolServers = servers.filter(server => server.status === 'active' && server.protocols.includes(protocol));
        if (protocolServers.length === 0) {
            return null;
        }
        const bestServer = protocolServers.reduce((best, current) => {
            return current.load < best.load ? current : best;
        });
        return bestServer;
    }
    async getConnectionStats() {
        this.logger.log('Getting connection statistics');
        const servers = await this.getAllServers();
        const connections = await this.getActiveConnections();
        const stats = {
            totalServers: servers.length,
            activeServers: servers.filter(s => s.status === 'active').length,
            totalConnections: connections.length,
            connectionsByProtocol: {
                openvpn: connections.filter(c => c.protocol === 'openvpn').length,
                wireguard: connections.filter(c => c.protocol === 'wireguard').length,
                ikev2: connections.filter(c => c.protocol === 'ikev2').length,
            },
            connectionsByRegion: {},
            averageLoad: servers.reduce((sum, s) => sum + s.load, 0) / servers.length,
            totalBandwidth: connections.reduce((sum, c) => sum + c.bytesTransferred, 0),
        };
        servers.forEach(server => {
            const regionConnections = connections.filter(c => c.serverId === server.id).length;
            stats.connectionsByRegion[server.region] = (stats.connectionsByRegion[server.region] || 0) + regionConnections;
        });
        return stats;
    }
    async checkServerHealth(serverId) {
        this.logger.log(`Checking health for server: ${serverId}`);
        try {
            const server = await this.getServerById(serverId);
            if (!server) {
                return { status: 'not_found', message: 'Server not found' };
            }
            const serverStatus = await this.vpnProtocolService.getServerStatus(serverId);
            return {
                serverId,
                status: 'healthy',
                timestamp: new Date().toISOString(),
                server: {
                    name: server.name,
                    country: server.country,
                    region: server.region,
                    load: server.load,
                    connections: server.currentConnections,
                },
                protocols: serverStatus.protocols,
                system: serverStatus.system,
            };
        }
        catch (error) {
            this.logger.error(`Health check failed for server ${serverId}: ${error.message}`);
            return {
                serverId,
                status: 'unhealthy',
                timestamp: new Date().toISOString(),
                error: error.message,
            };
        }
    }
    async checkGlobalHealth() {
        this.logger.log('Performing global health check');
        const servers = await this.getAllServers();
        const healthChecks = await Promise.all(servers.map(server => this.checkServerHealth(server.id)));
        const healthyServers = healthChecks.filter(check => check.status === 'healthy').length;
        const totalServers = servers.length;
        return {
            globalStatus: healthyServers === totalServers ? 'healthy' : 'degraded',
            timestamp: new Date().toISOString(),
            servers: {
                total: totalServers,
                healthy: healthyServers,
                unhealthy: totalServers - healthyServers,
            },
            healthChecks,
        };
    }
    async generateUserVpnConfig(userId, protocol, serverId) {
        this.logger.log(`Generating ${protocol} config for user: ${userId}`);
        let targetServerId = serverId;
        if (!targetServerId) {
            const bestServer = await this.selectServerForProtocol(protocol, userId);
            if (!bestServer) {
                throw new Error(`No available servers for protocol: ${protocol}`);
            }
            targetServerId = bestServer.id;
        }
        const config = await this.vpnProtocolService.generateClientConfig(userId, targetServerId, protocol);
        return {
            userId,
            protocol,
            serverId: targetServerId,
            config,
            generatedAt: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        };
    }
    async balanceServerLoad() {
        this.logger.log('Performing server load balancing');
        const servers = await this.getAllServers();
        const connections = await this.getActiveConnections();
        const loadBalancingResults = servers.map(server => {
            const serverConnections = connections.filter(c => c.serverId === server.id);
            const currentLoad = serverConnections.length / server.maxConnections;
            return {
                serverId: server.id,
                name: server.name,
                currentLoad,
                connections: serverConnections.length,
                maxConnections: server.maxConnections,
                recommendation: currentLoad > 0.8 ? 'scale_up' : currentLoad < 0.2 ? 'scale_down' : 'maintain',
            };
        });
        return {
            timestamp: new Date().toISOString(),
            loadBalancingResults,
            recommendations: loadBalancingResults.filter(r => r.recommendation !== 'maintain'),
        };
    }
};
exports.VpnService = VpnService;
exports.VpnService = VpnService = VpnService_1 = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [vpn_protocol_service_1.VpnProtocolService])
], VpnService);
//# sourceMappingURL=vpn.service.js.map