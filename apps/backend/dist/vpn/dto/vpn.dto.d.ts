export declare class CreateVpnServerDto {
    name: string;
    country: string;
    region: string;
    publicIp: string;
    privateIp: string;
    protocols: string[];
    maxConnections: number;
}
export declare class UpdateVpnServerDto {
    name?: string;
    status?: string;
    maxConnections?: number;
}
export declare class GenerateClientConfigDto {
    serverId: string;
    protocol: string;
}
export declare class SetupServerDto {
    protocols: string[];
}
export declare class MaintenanceModeDto {
    enabled: boolean;
    reason?: string;
}
export declare class ServerSelectionDto {
    preferredCountry?: string;
    preferredProtocol?: string;
}
export declare class VpnConnectionDto {
    id: string;
    userId: string;
    serverId: string;
    protocol: string;
    connectedAt: Date;
    disconnectedAt?: Date;
    bytesTransferred: number;
    ipAddress: string;
    status: string;
}
export declare class VpnServerDto {
    id: string;
    name: string;
    country: string;
    region: string;
    publicIp: string;
    privateIp: string;
    protocols: string[];
    status: string;
    load: number;
    maxConnections: number;
    currentConnections: number;
    createdAt: Date;
    updatedAt: Date;
}
export declare class VpnStatsDto {
    totalServers: number;
    activeServers: number;
    totalConnections: number;
    activeConnections: number;
    protocols: {
        openvpn: {
            connections: number;
            servers: number;
        };
        wireguard: {
            connections: number;
            servers: number;
        };
        ikev2: {
            connections: number;
            servers: number;
        };
    };
    regions: Record<string, {
        servers: number;
        connections: number;
    }>;
    uptime: string;
    averageLatency: number;
}
