import { ConfigService } from '@nestjs/config';
export interface VpnServerConfig {
    id: string;
    name: string;
    country: string;
    region: string;
    publicIp: string;
    privateIp: string;
    protocols: VpnProtocol[];
    status: 'active' | 'inactive' | 'maintenance';
    load: number;
    maxConnections: number;
    currentConnections: number;
}
export interface VpnProtocol {
    name: 'openvpn' | 'wireguard' | 'ikev2';
    port: number;
    status: 'active' | 'inactive';
    config: any;
}
export interface VpnConnection {
    id: string;
    userId: string;
    serverId: string;
    protocol: string;
    connectedAt: Date;
    disconnectedAt?: Date;
    bytesTransferred: number;
    ipAddress: string;
}
export declare class VpnProtocolService {
    private readonly configService;
    private readonly logger;
    constructor(configService: ConfigService);
    setupOpenVpnServer(serverConfig: VpnServerConfig): Promise<void>;
    private generateOpenVpnCertificates;
    private createOpenVpnServerConfig;
    setupWireGuardServer(serverConfig: VpnServerConfig): Promise<void>;
    private generateWireGuardKeys;
    private createWireGuardServerConfig;
    setupIkev2Server(serverConfig: VpnServerConfig): Promise<void>;
    private generateIkev2Certificates;
    private createIkev2ServerConfig;
    private configureIpsec;
    generateClientConfig(userId: string, serverId: string, protocol: string): Promise<string>;
    private generateOpenVpnClientConfig;
    private generateWireGuardClientConfig;
    private generateIkev2ClientConfig;
    getServerStatus(serverId: string): Promise<any>;
    private getOpenVpnStatus;
    private getWireGuardStatus;
    private getIkev2Status;
}
