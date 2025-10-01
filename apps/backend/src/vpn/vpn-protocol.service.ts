import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

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

@Injectable()
export class VpnProtocolService {
  private readonly logger = new Logger(VpnProtocolService.name);

  constructor(private readonly configService: ConfigService) {}

  // OpenVPN Protocol Implementation
  async setupOpenVpnServer(serverConfig: VpnServerConfig): Promise<void> {
    this.logger.log(`Setting up OpenVPN server for ${serverConfig.name}`);

    try {
      // Install OpenVPN
      await execAsync('apt-get update && apt-get install -y openvpn easy-rsa');

      // Create CA and certificates
      await this.generateOpenVpnCertificates(serverConfig);

      // Create server configuration
      await this.createOpenVpnServerConfig(serverConfig);

      // Start OpenVPN service
      await execAsync('systemctl enable openvpn@server');
      await execAsync('systemctl start openvpn@server');

      this.logger.log(`OpenVPN server setup completed for ${serverConfig.name}`);
    } catch (error) {
      this.logger.error(`Failed to setup OpenVPN server: ${error.message}`);
      throw error;
    }
  }

  private async generateOpenVpnCertificates(serverConfig: VpnServerConfig): Promise<void> {
    const caDir = '/etc/openvpn/easy-rsa';
    
    // Initialize PKI
    await execAsync(`cd ${caDir} && ./easyrsa init-pki`);
    
    // Build CA
    await execAsync(`cd ${caDir} && echo "ConSERVERtive CA" | ./easyrsa build-ca nopass`);
    
    // Generate server certificate
    await execAsync(`cd ${caDir} && echo "yes" | ./easyrsa gen-req ${serverConfig.name} nopass`);
    await execAsync(`cd ${caDir} && echo "yes" | ./easyrsa sign-req server ${serverConfig.name}`);
    
    // Generate Diffie-Hellman parameters
    await execAsync(`cd ${caDir} && ./easyrsa gen-dh`);
    
    // Generate TLS auth key
    await execAsync(`openvpn --genkey --secret ${caDir}/ta.key`);
    
    this.logger.log(`OpenVPN certificates generated for ${serverConfig.name}`);
  }

  private async createOpenVpnServerConfig(serverConfig: VpnServerConfig): Promise<void> {
    const config = `
# ConSERVERtive OpenVPN Server Configuration
port 1194
proto udp
dev tun

# Certificate and key files
ca /etc/openvpn/easy-rsa/pki/ca.crt
cert /etc/openvpn/easy-rsa/pki/issued/${serverConfig.name}.crt
key /etc/openvpn/easy-rsa/pki/private/${serverConfig.name}.key
dh /etc/openvpn/easy-rsa/pki/dh.pem
tls-auth /etc/openvpn/easy-rsa/ta.key 0

# Network configuration
server 10.8.0.0 255.255.255.0
ifconfig-pool-persist /var/log/openvpn/ipp.txt

# Push routes to client
push "redirect-gateway def1 bypass-dhcp"
push "dhcp-option DNS 8.8.8.8"
push "dhcp-option DNS 8.8.4.4"

# Security settings
cipher AES-256-GCM
auth SHA256
tls-version-min 1.2
tls-cipher TLS-ECDHE-RSA-WITH-AES-256-GCM-SHA384

# Connection settings
keepalive 10 120
comp-lzo
user nobody
group nogroup
persist-key
persist-tun

# Logging
status /var/log/openvpn/openvpn-status.log
log-append /var/log/openvpn/openvpn.log
verb 3

# ConSERVERtive specific settings
explicit-exit-notify 1
remote-cert-tls client
verify-client-cert require
`;

    await execAsync(`echo '${config}' > /etc/openvpn/server.conf`);
    this.logger.log(`OpenVPN server configuration created for ${serverConfig.name}`);
  }

  // WireGuard Protocol Implementation
  async setupWireGuardServer(serverConfig: VpnServerConfig): Promise<void> {
    this.logger.log(`Setting up WireGuard server for ${serverConfig.name}`);

    try {
      // Install WireGuard
      await execAsync('apt-get update && apt-get install -y wireguard');

      // Generate server keys
      const serverKeys = await this.generateWireGuardKeys();

      // Create server configuration
      await this.createWireGuardServerConfig(serverConfig, serverKeys);

      // Enable IP forwarding
      await execAsync('echo "net.ipv4.ip_forward = 1" >> /etc/sysctl.conf');
      await execAsync('sysctl -p');

      // Start WireGuard service
      await execAsync('systemctl enable wg-quick@wg0');
      await execAsync('systemctl start wg-quick@wg0');

      this.logger.log(`WireGuard server setup completed for ${serverConfig.name}`);
    } catch (error) {
      this.logger.error(`Failed to setup WireGuard server: ${error.message}`);
      throw error;
    }
  }

  private async generateWireGuardKeys(): Promise<{ privateKey: string; publicKey: string }> {
    const privateKey = (await execAsync('wg genkey')).stdout.trim();
    const publicKey = (await execAsync(`echo "${privateKey}" | wg pubkey`)).stdout.trim();
    
    return { privateKey, publicKey };
  }

  private async createWireGuardServerConfig(serverConfig: VpnServerConfig, serverKeys: any): Promise<void> {
    const config = `
# ConSERVERtive WireGuard Server Configuration
[Interface]
PrivateKey = ${serverKeys.privateKey}
Address = 10.7.0.1/24
ListenPort = 51820
PostUp = iptables -A FORWARD -i %i -j ACCEPT; iptables -A FORWARD -o %i -j ACCEPT; iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
PostDown = iptables -D FORWARD -i %i -j ACCEPT; iptables -D FORWARD -o %i -j ACCEPT; iptables -t nat -D POSTROUTING -o eth0 -j MASQUERADE

# ConSERVERtive specific settings
# Client configurations will be added dynamically
`;

    await execAsync(`echo '${config}' > /etc/wireguard/wg0.conf`);
    this.logger.log(`WireGuard server configuration created for ${serverConfig.name}`);
  }

  // IKEv2/IPSec Protocol Implementation
  async setupIkev2Server(serverConfig: VpnServerConfig): Promise<void> {
    this.logger.log(`Setting up IKEv2/IPSec server for ${serverConfig.name}`);

    try {
      // Install strongSwan
      await execAsync('apt-get update && apt-get install -y strongswan strongswan-pki');

      // Generate CA and certificates
      await this.generateIkev2Certificates(serverConfig);

      // Create server configuration
      await this.createIkev2ServerConfig(serverConfig);

      // Configure IPsec
      await this.configureIpsec(serverConfig);

      // Start strongSwan service
      await execAsync('systemctl enable strongswan');
      await execAsync('systemctl start strongswan');

      this.logger.log(`IKEv2/IPSec server setup completed for ${serverConfig.name}`);
    } catch (error) {
      this.logger.error(`Failed to setup IKEv2/IPSec server: ${error.message}`);
      throw error;
    }
  }

  private async generateIkev2Certificates(serverConfig: VpnServerConfig): Promise<void> {
    const caDir = '/etc/ipsec.d';
    
    // Generate CA private key
    await execAsync(`ipsec pki --gen --type rsa --size 4096 --outform pem > ${caDir}/private/ca-key.pem`);
    
    // Generate CA certificate
    await execAsync(`ipsec pki --self --ca --lifetime 3652 --in ${caDir}/private/ca-key.pem --dn "C=US, O=ConSERVERtive, CN=ConSERVERtive CA" --outform pem > ${caDir}/cacerts/ca-cert.pem`);
    
    // Generate server private key
    await execAsync(`ipsec pki --gen --type rsa --size 4096 --outform pem > ${caDir}/private/server-key.pem`);
    
    // Generate server certificate
    await execAsync(`ipsec pki --pub --in ${caDir}/private/server-key.pem --type rsa | ipsec pki --issue --lifetime 1825 --cacert ${caDir}/cacerts/ca-cert.pem --cakey ${caDir}/private/ca-key.pem --dn "C=US, O=ConSERVERtive, CN=${serverConfig.publicIp}" --san ${serverConfig.publicIp} --flag serverAuth --flag ikeIntermediate --outform pem > ${caDir}/certs/server-cert.pem`);
    
    this.logger.log(`IKEv2 certificates generated for ${serverConfig.name}`);
  }

  private async createIkev2ServerConfig(serverConfig: VpnServerConfig): Promise<void> {
    const config = `
# ConSERVERtive IKEv2/IPSec Configuration
config setup
    charondebug="ike 1, knl 1, cfg 0"
    uniqueids=no

conn ikev2-vpn
    auto=add
    compress=no
    type=tunnel
    keyexchange=ikev2
    fragmentation=yes
    forceencaps=yes
    dpdaction=clear
    dpddelay=300s
    dpdtimeout=300s
    ike=aes256-sha256-modp2048,aes128-sha1-modp2048!
    esp=aes256-sha256,aes128-sha1!
    left=%any
    leftid=${serverConfig.publicIp}
    leftcert=server-cert.pem
    leftsendcert=always
    leftsubnet=0.0.0.0/0
    right=%any
    rightid=%any
    rightauth=eap-mschapv2
    rightsourceip=10.10.10.0/24
    rightdns=8.8.8.8,8.8.4.4
    rightsendcert=never
    eap_identity=%identity
`;

    await execAsync(`echo '${config}' > /etc/ipsec.conf`);
    this.logger.log(`IKEv2 server configuration created for ${serverConfig.name}`);
  }

  private async configureIpsec(serverConfig: VpnServerConfig): Promise<void> {
    const secrets = `
# ConSERVERtive IKEv2/IPSec Secrets
: RSA server-key.pem
`;

    await execAsync(`echo '${secrets}' > /etc/ipsec.secrets`);
    
    // Set proper permissions
    await execAsync('chmod 600 /etc/ipsec.secrets');
    await execAsync('chmod 600 /etc/ipsec.d/private/*');
    
    this.logger.log(`IPsec configuration completed for ${serverConfig.name}`);
  }

  // Client Configuration Generation
  async generateClientConfig(userId: string, serverId: string, protocol: string): Promise<string> {
    this.logger.log(`Generating ${protocol} client config for user ${userId}`);

    switch (protocol) {
      case 'openvpn':
        return await this.generateOpenVpnClientConfig(userId, serverId);
      case 'wireguard':
        return await this.generateWireGuardClientConfig(userId, serverId);
      case 'ikev2':
        return await this.generateIkev2ClientConfig(userId, serverId);
      default:
        throw new Error(`Unsupported protocol: ${protocol}`);
    }
  }

  private async generateOpenVpnClientConfig(userId: string, serverId: string): Promise<string> {
    // Generate client certificate
    await execAsync(`cd /etc/openvpn/easy-rsa && echo "yes" | ./easyrsa gen-req client-${userId} nopass`);
    await execAsync(`cd /etc/openvpn/easy-rsa && echo "yes" | ./easyrsa sign-req client client-${userId}`);

    // Get server public IP (this would come from database in production)
    const serverIp = 'YOUR_SERVER_IP'; // Replace with actual server IP

    const clientConfig = `
# ConSERVERtive OpenVPN Client Configuration
client
dev tun
proto udp
remote ${serverIp} 1194
resolv-retry infinite
nobind
persist-key
persist-tun
remote-cert-tls server
cipher AES-256-GCM
auth SHA256
comp-lzo
verb 3

<ca>
# CA certificate would be embedded here
</ca>

<cert>
# Client certificate would be embedded here
</cert>

<key>
# Client private key would be embedded here
</key>

<tls-auth>
# TLS auth key would be embedded here
</tls-auth>
`;

    return clientConfig;
  }

  private async generateWireGuardClientConfig(userId: string, serverId: string): Promise<string> {
    // Generate client keys
    const clientKeys = await this.generateWireGuardKeys();
    
    // Get server public key and IP (this would come from database in production)
    const serverPublicKey = 'YOUR_SERVER_PUBLIC_KEY'; // Replace with actual server public key
    const serverIp = 'YOUR_SERVER_IP'; // Replace with actual server IP

    const clientConfig = `
# ConSERVERtive WireGuard Client Configuration
[Interface]
PrivateKey = ${clientKeys.privateKey}
Address = 10.7.0.2/24
DNS = 8.8.8.8, 8.8.4.4

[Peer]
PublicKey = ${serverPublicKey}
Endpoint = ${serverIp}:51820
AllowedIPs = 0.0.0.0/0
PersistentKeepalive = 25
`;

    return clientConfig;
  }

  private async generateIkev2ClientConfig(userId: string, serverId: string): Promise<string> {
    // Generate client certificate
    await execAsync(`ipsec pki --gen --type rsa --size 4096 --outform pem > /etc/ipsec.d/private/client-${userId}-key.pem`);
    await execAsync(`ipsec pki --pub --in /etc/ipsec.d/private/client-${userId}-key.pem --type rsa | ipsec pki --issue --lifetime 1825 --cacert /etc/ipsec.d/cacerts/ca-cert.pem --cakey /etc/ipsec.d/private/ca-key.pem --dn "C=US, O=ConSERVERtive, CN=client-${userId}" --outform pem > /etc/ipsec.d/certs/client-${userId}-cert.pem`);

    // Get server IP (this would come from database in production)
    const serverIp = 'YOUR_SERVER_IP'; // Replace with actual server IP

    const clientConfig = `
# ConSERVERtive IKEv2 Client Configuration
# Server: ${serverIp}
# Username: client-${userId}
# Password: [Generated password]
# Certificate: client-${userId}-cert.pem
# Private Key: client-${userId}-key.pem
# CA Certificate: ca-cert.pem

# Connection settings:
# - Protocol: IKEv2
# - Server: ${serverIp}
# - Port: 500, 4500
# - Authentication: Certificate + Username/Password
`;

    return clientConfig;
  }

  // Server Management
  async getServerStatus(serverId: string): Promise<any> {
    this.logger.log(`Getting server status for ${serverId}`);

    try {
      const status = {
        serverId,
        timestamp: new Date().toISOString(),
        protocols: {
          openvpn: await this.getOpenVpnStatus(),
          wireguard: await this.getWireGuardStatus(),
          ikev2: await this.getIkev2Status(),
        },
        system: {
          uptime: (await execAsync('uptime')).stdout.trim(),
          memory: (await execAsync('free -h')).stdout.trim(),
          disk: (await execAsync('df -h')).stdout.trim(),
        },
      };

      return status;
    } catch (error) {
      this.logger.error(`Failed to get server status: ${error.message}`);
      throw error;
    }
  }

  private async getOpenVpnStatus(): Promise<any> {
    try {
      const status = await execAsync('systemctl is-active openvpn@server');
      const connections = await execAsync('cat /var/log/openvpn/openvpn-status.log 2>/dev/null || echo "No connections"');
      
      return {
        status: status.stdout.trim(),
        connections: connections.stdout.trim(),
      };
    } catch (error) {
      return { status: 'inactive', error: error.message };
    }
  }

  private async getWireGuardStatus(): Promise<any> {
    try {
      const status = await execAsync('systemctl is-active wg-quick@wg0');
      const connections = await execAsync('wg show 2>/dev/null || echo "No connections"');
      
      return {
        status: status.stdout.trim(),
        connections: connections.stdout.trim(),
      };
    } catch (error) {
      return { status: 'inactive', error: error.message };
    }
  }

  private async getIkev2Status(): Promise<any> {
    try {
      const status = await execAsync('systemctl is-active strongswan');
      const connections = await execAsync('ipsec status 2>/dev/null || echo "No connections"');
      
      return {
        status: status.stdout.trim(),
        connections: connections.stdout.trim(),
      };
    } catch (error) {
      return { status: 'inactive', error: error.message };
    }
  }
}
