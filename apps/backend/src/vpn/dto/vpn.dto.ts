import { IsString, IsOptional, IsArray, IsEnum, IsNumber, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVpnServerDto {
  @ApiProperty({ description: 'Server name' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Server country code' })
  @IsString()
  country: string;

  @ApiProperty({ description: 'Server region' })
  @IsString()
  region: string;

  @ApiProperty({ description: 'Server public IP address' })
  @IsString()
  publicIp: string;

  @ApiProperty({ description: 'Server private IP address' })
  @IsString()
  privateIp: string;

  @ApiProperty({ description: 'Supported VPN protocols', enum: ['openvpn', 'wireguard', 'ikev2'] })
  @IsArray()
  @IsEnum(['openvpn', 'wireguard', 'ikev2'], { each: true })
  protocols: string[];

  @ApiProperty({ description: 'Maximum concurrent connections' })
  @IsNumber()
  maxConnections: number;
}

export class UpdateVpnServerDto {
  @ApiProperty({ description: 'Server name', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: 'Server status', enum: ['active', 'inactive', 'maintenance'], required: false })
  @IsOptional()
  @IsEnum(['active', 'inactive', 'maintenance'])
  status?: string;

  @ApiProperty({ description: 'Maximum concurrent connections', required: false })
  @IsOptional()
  @IsNumber()
  maxConnections?: number;
}

export class GenerateClientConfigDto {
  @ApiProperty({ description: 'Target server ID' })
  @IsString()
  serverId: string;

  @ApiProperty({ description: 'VPN protocol', enum: ['openvpn', 'wireguard', 'ikev2'] })
  @IsEnum(['openvpn', 'wireguard', 'ikev2'])
  protocol: string;
}

export class SetupServerDto {
  @ApiProperty({ description: 'VPN protocols to setup', enum: ['openvpn', 'wireguard', 'ikev2'] })
  @IsArray()
  @IsEnum(['openvpn', 'wireguard', 'ikev2'], { each: true })
  protocols: string[];
}

export class MaintenanceModeDto {
  @ApiProperty({ description: 'Enable maintenance mode' })
  @IsBoolean()
  enabled: boolean;

  @ApiProperty({ description: 'Maintenance reason', required: false })
  @IsOptional()
  @IsString()
  reason?: string;
}

export class ServerSelectionDto {
  @ApiProperty({ description: 'Preferred country code', required: false })
  @IsOptional()
  @IsString()
  preferredCountry?: string;

  @ApiProperty({ description: 'Preferred protocol', enum: ['openvpn', 'wireguard', 'ikev2'], required: false })
  @IsOptional()
  @IsEnum(['openvpn', 'wireguard', 'ikev2'])
  preferredProtocol?: string;
}

export class VpnConnectionDto {
  @ApiProperty({ description: 'Connection ID' })
  id: string;

  @ApiProperty({ description: 'User ID' })
  userId: string;

  @ApiProperty({ description: 'Server ID' })
  serverId: string;

  @ApiProperty({ description: 'VPN protocol' })
  protocol: string;

  @ApiProperty({ description: 'Connection timestamp' })
  connectedAt: Date;

  @ApiProperty({ description: 'Disconnection timestamp', required: false })
  disconnectedAt?: Date;

  @ApiProperty({ description: 'Bytes transferred' })
  bytesTransferred: number;

  @ApiProperty({ description: 'Client IP address' })
  ipAddress: string;

  @ApiProperty({ description: 'Connection status' })
  status: string;
}

export class VpnServerDto {
  @ApiProperty({ description: 'Server ID' })
  id: string;

  @ApiProperty({ description: 'Server name' })
  name: string;

  @ApiProperty({ description: 'Server country' })
  country: string;

  @ApiProperty({ description: 'Server region' })
  region: string;

  @ApiProperty({ description: 'Server public IP' })
  publicIp: string;

  @ApiProperty({ description: 'Server private IP' })
  privateIp: string;

  @ApiProperty({ description: 'Supported protocols' })
  protocols: string[];

  @ApiProperty({ description: 'Server status' })
  status: string;

  @ApiProperty({ description: 'Current load percentage' })
  load: number;

  @ApiProperty({ description: 'Maximum connections' })
  maxConnections: number;

  @ApiProperty({ description: 'Current connections' })
  currentConnections: number;

  @ApiProperty({ description: 'Creation timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updatedAt: Date;
}

export class VpnStatsDto {
  @ApiProperty({ description: 'Total number of servers' })
  totalServers: number;

  @ApiProperty({ description: 'Number of active servers' })
  activeServers: number;

  @ApiProperty({ description: 'Total connections' })
  totalConnections: number;

  @ApiProperty({ description: 'Active connections' })
  activeConnections: number;

  @ApiProperty({ description: 'Connections by protocol' })
  protocols: {
    openvpn: { connections: number; servers: number };
    wireguard: { connections: number; servers: number };
    ikev2: { connections: number; servers: number };
  };

  @ApiProperty({ description: 'Connections by region' })
  regions: Record<string, { servers: number; connections: number }>;

  @ApiProperty({ description: 'Service uptime percentage' })
  uptime: string;

  @ApiProperty({ description: 'Average latency in milliseconds' })
  averageLatency: number;
}
