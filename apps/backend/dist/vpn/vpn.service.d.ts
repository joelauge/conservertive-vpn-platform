import { VpnProtocolService } from './vpn-protocol.service';
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
export declare class VpnService {
    private readonly vpnProtocolService;
    private readonly logger;
    constructor(vpnProtocolService: VpnProtocolService);
    getAllServers(): Promise<VpnServer[]>;
    getServerById(serverId: string): Promise<VpnServer | null>;
    getServersByRegion(region: string): Promise<VpnServer[]>;
    getServersByCountry(country: string): Promise<VpnServer[]>;
    getUserConnections(userId: string): Promise<VpnUserConnection[]>;
    getActiveConnections(): Promise<VpnUserConnection[]>;
    selectBestServer(userId: string, preferredCountry?: string, preferredProtocol?: string): Promise<VpnServer | null>;
    selectServerForProtocol(protocol: string, userId: string): Promise<VpnServer | null>;
    getConnectionStats(): Promise<any>;
    checkServerHealth(serverId: string): Promise<any>;
    checkGlobalHealth(): Promise<any>;
    generateUserVpnConfig(userId: string, protocol: string, serverId?: string): Promise<any>;
    balanceServerLoad(): Promise<any>;
}
