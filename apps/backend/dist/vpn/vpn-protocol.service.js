"use strict";
var VpnProtocolService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.VpnProtocolService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const child_process_1 = require("child_process");
const util_1 = require("util");
const execAsync = (0, util_1.promisify)(child_process_1.exec);
let VpnProtocolService = VpnProtocolService_1 = class VpnProtocolService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(VpnProtocolService_1.name);
    }
    async setupOpenVpnServer(serverConfig) {
        this.logger.log(`Setting up OpenVPN server for ${serverConfig.name}`);
        try {
            await execAsync('apt-get update && apt-get install -y openvpn easy-rsa');
            await this.generateOpenVpnCertificates(serverConfig);
            await this.createOpenVpnServerConfig(serverConfig);
            await execAsync('systemctl enable openvpn@server');
            await execAsync('systemctl start openvpn@server');
            this.logger.log(`OpenVPN server setup completed for ${serverConfig.name}`);
        }
        catch (error) {
            this.logger.error(`Failed to setup OpenVPN server: ${error.message}`);
            throw error;
        }
    }
    async generateOpenVpnCertificates(serverConfig) {
        const caDir = '/etc/openvpn/easy-rsa';
        await execAsync(`cd ${caDir} && ./easyrsa init-pki`);
        await execAsync(`cd ${caDir} && echo "ConSERVERtive CA" | ./easyrsa build-ca nopass`);
        await execAsync(`cd ${caDir} && echo "yes" | ./easyrsa gen-req ${serverConfig.name} nopass`);
        await execAsync(`cd ${caDir} && echo "yes" | ./easyrsa sign-req server ${serverConfig.name}`);
        await execAsync(`cd ${caDir} && ./easyrsa gen-dh`);
        await execAsync(`openvpn --genkey --secret ${caDir}/ta.key`);
        this.logger.log(`OpenVPN certificates generated for ${serverConfig.name}`);
    }
    async createOpenVpnServerConfig(serverConfig) {
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
    async setupWireGuardServer(serverConfig) {
        this.logger.log(`Setting up WireGuard server for ${serverConfig.name}`);
        try {
            await execAsync('apt-get update && apt-get install -y wireguard');
            const serverKeys = await this.generateWireGuardKeys();
            await this.createWireGuardServerConfig(serverConfig, serverKeys);
            await execAsync('echo "net.ipv4.ip_forward = 1" >> /etc/sysctl.conf');
            await execAsync('sysctl -p');
            await execAsync('systemctl enable wg-quick@wg0');
            await execAsync('systemctl start wg-quick@wg0');
            this.logger.log(`WireGuard server setup completed for ${serverConfig.name}`);
        }
        catch (error) {
            this.logger.error(`Failed to setup WireGuard server: ${error.message}`);
            throw error;
        }
    }
    async generateWireGuardKeys() {
        const privateKey = (await execAsync('wg genkey')).stdout.trim();
        const publicKey = (await execAsync(`echo "${privateKey}" | wg pubkey`)).stdout.trim();
        return { privateKey, publicKey };
    }
    async createWireGuardServerConfig(serverConfig, serverKeys) {
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
    async setupIkev2Server(serverConfig) {
        this.logger.log(`Setting up IKEv2/IPSec server for ${serverConfig.name}`);
        try {
            await execAsync('apt-get update && apt-get install -y strongswan strongswan-pki');
            await this.generateIkev2Certificates(serverConfig);
            await this.createIkev2ServerConfig(serverConfig);
            await this.configureIpsec(serverConfig);
            await execAsync('systemctl enable strongswan');
            await execAsync('systemctl start strongswan');
            this.logger.log(`IKEv2/IPSec server setup completed for ${serverConfig.name}`);
        }
        catch (error) {
            this.logger.error(`Failed to setup IKEv2/IPSec server: ${error.message}`);
            throw error;
        }
    }
    async generateIkev2Certificates(serverConfig) {
        const caDir = '/etc/ipsec.d';
        await execAsync(`ipsec pki --gen --type rsa --size 4096 --outform pem > ${caDir}/private/ca-key.pem`);
        await execAsync(`ipsec pki --self --ca --lifetime 3652 --in ${caDir}/private/ca-key.pem --dn "C=US, O=ConSERVERtive, CN=ConSERVERtive CA" --outform pem > ${caDir}/cacerts/ca-cert.pem`);
        await execAsync(`ipsec pki --gen --type rsa --size 4096 --outform pem > ${caDir}/private/server-key.pem`);
        await execAsync(`ipsec pki --pub --in ${caDir}/private/server-key.pem --type rsa | ipsec pki --issue --lifetime 1825 --cacert ${caDir}/cacerts/ca-cert.pem --cakey ${caDir}/private/ca-key.pem --dn "C=US, O=ConSERVERtive, CN=${serverConfig.publicIp}" --san ${serverConfig.publicIp} --flag serverAuth --flag ikeIntermediate --outform pem > ${caDir}/certs/server-cert.pem`);
        this.logger.log(`IKEv2 certificates generated for ${serverConfig.name}`);
    }
    async createIkev2ServerConfig(serverConfig) {
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
    async configureIpsec(serverConfig) {
        const secrets = `
# ConSERVERtive IKEv2/IPSec Secrets
: RSA server-key.pem
`;
        await execAsync(`echo '${secrets}' > /etc/ipsec.secrets`);
        await execAsync('chmod 600 /etc/ipsec.secrets');
        await execAsync('chmod 600 /etc/ipsec.d/private/*');
        this.logger.log(`IPsec configuration completed for ${serverConfig.name}`);
    }
    async generateClientConfig(userId, serverId, protocol) {
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
    async generateOpenVpnClientConfig(userId, serverId) {
        await execAsync(`cd /etc/openvpn/easy-rsa && echo "yes" | ./easyrsa gen-req client-${userId} nopass`);
        await execAsync(`cd /etc/openvpn/easy-rsa && echo "yes" | ./easyrsa sign-req client client-${userId}`);
        const serverIp = 'YOUR_SERVER_IP';
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
    async generateWireGuardClientConfig(userId, serverId) {
        const clientKeys = await this.generateWireGuardKeys();
        const serverPublicKey = 'YOUR_SERVER_PUBLIC_KEY';
        const serverIp = 'YOUR_SERVER_IP';
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
    async generateIkev2ClientConfig(userId, serverId) {
        await execAsync(`ipsec pki --gen --type rsa --size 4096 --outform pem > /etc/ipsec.d/private/client-${userId}-key.pem`);
        await execAsync(`ipsec pki --pub --in /etc/ipsec.d/private/client-${userId}-key.pem --type rsa | ipsec pki --issue --lifetime 1825 --cacert /etc/ipsec.d/cacerts/ca-cert.pem --cakey /etc/ipsec.d/private/ca-key.pem --dn "C=US, O=ConSERVERtive, CN=client-${userId}" --outform pem > /etc/ipsec.d/certs/client-${userId}-cert.pem`);
        const serverIp = 'YOUR_SERVER_IP';
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
    async getServerStatus(serverId) {
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
        }
        catch (error) {
            this.logger.error(`Failed to get server status: ${error.message}`);
            throw error;
        }
    }
    async getOpenVpnStatus() {
        try {
            const status = await execAsync('systemctl is-active openvpn@server');
            const connections = await execAsync('cat /var/log/openvpn/openvpn-status.log 2>/dev/null || echo "No connections"');
            return {
                status: status.stdout.trim(),
                connections: connections.stdout.trim(),
            };
        }
        catch (error) {
            return { status: 'inactive', error: error.message };
        }
    }
    async getWireGuardStatus() {
        try {
            const status = await execAsync('systemctl is-active wg-quick@wg0');
            const connections = await execAsync('wg show 2>/dev/null || echo "No connections"');
            return {
                status: status.stdout.trim(),
                connections: connections.stdout.trim(),
            };
        }
        catch (error) {
            return { status: 'inactive', error: error.message };
        }
    }
    async getIkev2Status() {
        try {
            const status = await execAsync('systemctl is-active strongswan');
            const connections = await execAsync('ipsec status 2>/dev/null || echo "No connections"');
            return {
                status: status.stdout.trim(),
                connections: connections.stdout.trim(),
            };
        }
        catch (error) {
            return { status: 'inactive', error: error.message };
        }
    }
};
exports.VpnProtocolService = VpnProtocolService;
exports.VpnProtocolService = VpnProtocolService = VpnProtocolService_1 = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [config_1.ConfigService])
], VpnProtocolService);
//# sourceMappingURL=vpn-protocol.service.js.map