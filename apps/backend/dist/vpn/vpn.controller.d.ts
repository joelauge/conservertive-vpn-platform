import { VpnProtocolService, VpnServerConfig, VpnConnection } from './vpn-protocol.service';
export declare class VpnController {
    private readonly vpnProtocolService;
    private readonly logger;
    constructor(vpnProtocolService: VpnProtocolService);
    getServers(): Promise<VpnServerConfig[]>;
    getServer(serverId: string): Promise<VpnServerConfig>;
    getServerStatus(serverId: string): Promise<any>;
    setupServer(serverId: string, protocols: {
        protocols: string[];
    }): Promise<{
        message: string;
        protocols: string[];
    }>;
    generateClientConfig(userId: string, configRequest: {
        serverId: string;
        protocol: string;
    }): Promise<{
        config: string;
        protocol: string;
        serverId: string;
    }>;
    getConnections(): Promise<VpnConnection[]>;
    getConnection(connectionId: string): Promise<VpnConnection>;
    getProtocols(): Promise<{
        protocols: Array<{
            name: string;
            description: string;
            ports: number[];
        }>;
    }>;
    getStats(): Promise<any>;
    restartServer(serverId: string): Promise<{
        message: string;
    }>;
    maintenanceMode(serverId: string, maintenance: {
        enabled: boolean;
        reason?: string;
    }): Promise<{
        message: string;
        maintenance: boolean;
    }>;
}
