import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VpnProtocolService, VpnServerConfig, VpnConnection } from './vpn-protocol.service';

export interface VpnServer {
  id: string;
  name: string;
  country: string;
  region: string;
  publicIp: string;
  privateIp: string;
  protocols: string[];
  status: 'active' | 'inactive' | 'maintenance';
  load: number;
  maxConnections: number;
  currentConnections: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface VpnUserConnection {
  id: string;
  userId: string;
  serverId: string;
  protocol: string;
  connectedAt: Date;
  disconnectedAt?: Date;
  bytesTransferred: number;
  ipAddress: string;
  status: 'connected' | 'disconnected';
}

@Injectable()
export class VpnService {
  private readonly logger = new Logger(VpnService.name);

  constructor(
    private readonly vpnProtocolService: VpnProtocolService,
  ) {}

  // Server Management
  async getAllServers(): Promise<VpnServer[]> {
    this.logger.log('Getting all VPN servers');

    // In production, this would fetch from database
    const servers: VpnServer[] = [
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

  async getServerById(serverId: string): Promise<VpnServer | null> {
    this.logger.log(`Getting VPN server: ${serverId}`);

    const servers = await this.getAllServers();
    return servers.find(server => server.id === serverId) || null;
  }

  async getServersByRegion(region: string): Promise<VpnServer[]> {
    this.logger.log(`Getting VPN servers for region: ${region}`);

    const servers = await this.getAllServers();
    return servers.filter(server => server.region === region);
  }

  async getServersByCountry(country: string): Promise<VpnServer[]> {
    this.logger.log(`Getting VPN servers for country: ${country}`);

    const servers = await this.getAllServers();
    return servers.filter(server => server.country === country);
  }

  // Connection Management
  async getUserConnections(userId: string): Promise<VpnUserConnection[]> {
    this.logger.log(`Getting connections for user: ${userId}`);

    // In production, this would fetch from database
    const connections: VpnUserConnection[] = [
      {
        id: 'conn-1',
        userId,
        serverId: 'us-east-1',
        protocol: 'openvpn',
        connectedAt: new Date(Date.now() - 3600000), // 1 hour ago
        bytesTransferred: 1024000,
        ipAddress: '10.8.0.2',
        status: 'connected',
      },
    ];

    return connections;
  }

  async getActiveConnections(): Promise<VpnUserConnection[]> {
    this.logger.log('Getting all active connections');

    // In production, this would fetch from database
    const connections: VpnUserConnection[] = [
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

  // Server Selection Algorithm
  async selectBestServer(userId: string, preferredCountry?: string, preferredProtocol?: string): Promise<VpnServer | null> {
    this.logger.log(`Selecting best server for user: ${userId}`);

    const servers = await this.getAllServers();
    const activeServers = servers.filter(server => server.status === 'active');

    if (activeServers.length === 0) {
      return null;
    }

    // Filter by preferred country if specified
    let candidateServers = activeServers;
    if (preferredCountry) {
      candidateServers = activeServers.filter(server => server.country === preferredCountry);
    }

    // If no servers in preferred country, use all active servers
    if (candidateServers.length === 0) {
      candidateServers = activeServers;
    }

    // Filter by preferred protocol if specified
    if (preferredProtocol) {
      candidateServers = candidateServers.filter(server => 
        server.protocols.includes(preferredProtocol)
      );
    }

    // If no servers support preferred protocol, use all candidate servers
    if (candidateServers.length === 0) {
      candidateServers = activeServers;
    }

    // Select server with lowest load
    const bestServer = candidateServers.reduce((best, current) => {
      return current.load < best.load ? current : best;
    });

    this.logger.log(`Selected server: ${bestServer.name} (load: ${bestServer.load})`);
    return bestServer;
  }

  // Protocol-specific server selection
  async selectServerForProtocol(protocol: string, userId: string): Promise<VpnServer | null> {
    this.logger.log(`Selecting ${protocol} server for user: ${userId}`);

    const servers = await this.getAllServers();
    const protocolServers = servers.filter(server => 
      server.status === 'active' && server.protocols.includes(protocol)
    );

    if (protocolServers.length === 0) {
      return null;
    }

    // Select server with lowest load for the protocol
    const bestServer = protocolServers.reduce((best, current) => {
      return current.load < best.load ? current : best;
    });

    return bestServer;
  }

  // Connection Statistics
  async getConnectionStats(): Promise<any> {
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

    // Calculate connections by region
    servers.forEach(server => {
      const regionConnections = connections.filter(c => c.serverId === server.id).length;
      stats.connectionsByRegion[server.region] = (stats.connectionsByRegion[server.region] || 0) + regionConnections;
    });

    return stats;
  }

  // Server Health Check
  async checkServerHealth(serverId: string): Promise<any> {
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
    } catch (error) {
      this.logger.error(`Health check failed for server ${serverId}: ${error.message}`);
      return {
        serverId,
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error.message,
      };
    }
  }

  // Global Health Check
  async checkGlobalHealth(): Promise<any> {
    this.logger.log('Performing global health check');

    const servers = await this.getAllServers();
    const healthChecks = await Promise.all(
      servers.map(server => this.checkServerHealth(server.id))
    );

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

  // User VPN Configuration
  async generateUserVpnConfig(userId: string, protocol: string, serverId?: string): Promise<any> {
    this.logger.log(`Generating ${protocol} config for user: ${userId}`);

    // Select best server if not specified
    let targetServerId = serverId;
    if (!targetServerId) {
      const bestServer = await this.selectServerForProtocol(protocol, userId);
      if (!bestServer) {
        throw new Error(`No available servers for protocol: ${protocol}`);
      }
      targetServerId = bestServer.id;
    }

    // Generate client configuration
    const config = await this.vpnProtocolService.generateClientConfig(userId, targetServerId, protocol);

    return {
      userId,
      protocol,
      serverId: targetServerId,
      config,
      generatedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
    };
  }

  // Server Load Balancing
  async balanceServerLoad(): Promise<any> {
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
}
