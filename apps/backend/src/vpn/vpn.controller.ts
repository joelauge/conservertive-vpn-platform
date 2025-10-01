import { Controller, Get, Post, Body, Param, Query, Logger, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { VpnProtocolService, VpnServerConfig, VpnConnection } from './vpn-protocol.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('vpn')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('vpn')
export class VpnController {
  private readonly logger = new Logger(VpnController.name);

  constructor(private readonly vpnProtocolService: VpnProtocolService) {}

  @Get('servers')
  @ApiOperation({ summary: 'Get all VPN servers' })
  @ApiResponse({ status: 200, description: 'List of VPN servers' })
  async getServers(): Promise<VpnServerConfig[]> {
    this.logger.log('Getting all VPN servers');
    
    // In production, this would fetch from database
    const servers: VpnServerConfig[] = [
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

  @Get('servers/:serverId')
  @ApiOperation({ summary: 'Get VPN server by ID' })
  @ApiResponse({ status: 200, description: 'VPN server details' })
  async getServer(@Param('serverId') serverId: string): Promise<VpnServerConfig> {
    this.logger.log(`Getting VPN server: ${serverId}`);
    
    // In production, this would fetch from database
    const server: VpnServerConfig = {
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

  @Get('servers/:serverId/status')
  @ApiOperation({ summary: 'Get VPN server status' })
  @ApiResponse({ status: 200, description: 'Server status and metrics' })
  async getServerStatus(@Param('serverId') serverId: string): Promise<any> {
    this.logger.log(`Getting server status for: ${serverId}`);
    return await this.vpnProtocolService.getServerStatus(serverId);
  }

  @Post('servers/:serverId/setup')
  @Roles('admin')
  @ApiOperation({ summary: 'Setup VPN server protocols' })
  @ApiResponse({ status: 200, description: 'Server setup completed' })
  async setupServer(
    @Param('serverId') serverId: string,
    @Body() protocols: { protocols: string[] }
  ): Promise<{ message: string; protocols: string[] }> {
    this.logger.log(`Setting up VPN server: ${serverId} with protocols: ${protocols.protocols.join(', ')}`);

    const serverConfig: VpnServerConfig = {
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

  @Post('clients/:userId/config')
  @ApiOperation({ summary: 'Generate VPN client configuration' })
  @ApiResponse({ status: 200, description: 'Client configuration generated' })
  async generateClientConfig(
    @Param('userId') userId: string,
    @Body() configRequest: { serverId: string; protocol: string }
  ): Promise<{ config: string; protocol: string; serverId: string }> {
    this.logger.log(`Generating ${configRequest.protocol} config for user: ${userId}`);

    const config = await this.vpnProtocolService.generateClientConfig(
      userId,
      configRequest.serverId,
      configRequest.protocol
    );

    return {
      config,
      protocol: configRequest.protocol,
      serverId: configRequest.serverId,
    };
  }

  @Get('connections')
  @ApiOperation({ summary: 'Get active VPN connections' })
  @ApiResponse({ status: 200, description: 'List of active connections' })
  async getConnections(): Promise<VpnConnection[]> {
    this.logger.log('Getting active VPN connections');
    
    // In production, this would fetch from database
    const connections: VpnConnection[] = [
      {
        id: 'conn-1',
        userId: 'user-1',
        serverId: 'us-east-1',
        protocol: 'openvpn',
        connectedAt: new Date(Date.now() - 3600000), // 1 hour ago
        bytesTransferred: 1024000,
        ipAddress: '10.8.0.2',
      },
      {
        id: 'conn-2',
        userId: 'user-2',
        serverId: 'eu-west-1',
        protocol: 'wireguard',
        connectedAt: new Date(Date.now() - 7200000), // 2 hours ago
        bytesTransferred: 2048000,
        ipAddress: '10.7.0.3',
      },
    ];

    return connections;
  }

  @Get('connections/:connectionId')
  @ApiOperation({ summary: 'Get VPN connection by ID' })
  @ApiResponse({ status: 200, description: 'Connection details' })
  async getConnection(@Param('connectionId') connectionId: string): Promise<VpnConnection> {
    this.logger.log(`Getting VPN connection: ${connectionId}`);
    
    // In production, this would fetch from database
    const connection: VpnConnection = {
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

  @Get('protocols')
  @ApiOperation({ summary: 'Get supported VPN protocols' })
  @ApiResponse({ status: 200, description: 'List of supported protocols' })
  async getProtocols(): Promise<{ protocols: Array<{ name: string; description: string; ports: number[] }> }> {
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

  @Get('stats')
  @ApiOperation({ summary: 'Get VPN service statistics' })
  @ApiResponse({ status: 200, description: 'Service statistics' })
  async getStats(): Promise<any> {
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

  @Post('servers/:serverId/restart')
  @Roles('admin')
  @ApiOperation({ summary: 'Restart VPN server' })
  @ApiResponse({ status: 200, description: 'Server restart initiated' })
  async restartServer(@Param('serverId') serverId: string): Promise<{ message: string }> {
    this.logger.log(`Restarting VPN server: ${serverId}`);

    // In production, this would trigger server restart via API or SSH
    return {
      message: `VPN server ${serverId} restart initiated`,
    };
  }

  @Post('servers/:serverId/maintenance')
  @Roles('admin')
  @ApiOperation({ summary: 'Put VPN server in maintenance mode' })
  @ApiResponse({ status: 200, description: 'Server maintenance mode activated' })
  async maintenanceMode(
    @Param('serverId') serverId: string,
    @Body() maintenance: { enabled: boolean; reason?: string }
  ): Promise<{ message: string; maintenance: boolean }> {
    this.logger.log(`Setting maintenance mode for server ${serverId}: ${maintenance.enabled}`);

    return {
      message: `Server ${serverId} maintenance mode ${maintenance.enabled ? 'activated' : 'deactivated'}`,
      maintenance: maintenance.enabled,
    };
  }
}
