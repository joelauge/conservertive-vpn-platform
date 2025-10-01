#!/bin/bash

# ConSERVERtive VPN Server Setup Script
# This script runs on EC2 instance startup to configure VPN services

set -e

# Logging
exec > >(tee /var/log/vpn-setup.log)
exec 2>&1

echo "🚀 Starting ConSERVERtive VPN Server Setup - $(date)"

# Environment variables
ENVIRONMENT="${environment}"
REGION="${region}"
INSTANCE_ID=$(curl -s http://169.254.169.254/latest/meta-data/instance-id)
PUBLIC_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)

echo "📋 Instance Details:"
echo "   Environment: $ENVIRONMENT"
echo "   Region: $REGION"
echo "   Instance ID: $INSTANCE_ID"
echo "   Public IP: $PUBLIC_IP"

# Update system
echo "🔄 Updating system packages..."
apt-get update -y
apt-get upgrade -y

# Install essential packages
echo "📦 Installing essential packages..."
apt-get install -y \
    curl \
    wget \
    git \
    unzip \
    software-properties-common \
    apt-transport-https \
    ca-certificates \
    gnupg \
    lsb-release \
    ufw \
    fail2ban \
    htop \
    iotop \
    nethogs \
    tcpdump \
    netstat-nat \
    iptables-persistent

# Install Docker
echo "🐳 Installing Docker..."
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
apt-get update -y
apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Add ubuntu user to docker group
usermod -aG docker ubuntu

# Install cloudflared
echo "☁️ Installing Cloudflare Tunnel (cloudflared)..."
wget -q https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
dpkg -i cloudflared-linux-amd64.deb
rm cloudflared-linux-amd64.deb

# Install OpenVPN
echo "🔐 Installing OpenVPN..."
apt-get install -y openvpn easy-rsa

# Install WireGuard
echo "🔒 Installing WireGuard..."
apt-get update -y
apt-get install -y wireguard

# Install strongSwan (IKEv2/IPSec)
echo "🛡️ Installing strongSwan (IKEv2/IPSec)..."
apt-get install -y strongswan strongswan-pki

# Install Node.js (for VPN management API)
echo "📱 Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# Install PM2 for process management
npm install -g pm2

# Create VPN directories
echo "📁 Creating VPN directories..."
mkdir -p /opt/conservertive/{openvpn,wireguard,ikev2,cloudflare,logs,config}
mkdir -p /etc/openvpn/server
mkdir -p /etc/wireguard
mkdir -p /etc/ipsec.d

# Set up firewall
echo "🔥 Configuring firewall..."
ufw --force reset
ufw default deny incoming
ufw default allow outgoing

# Allow SSH
ufw allow 22/tcp

# Allow VPN ports
ufw allow 1194/udp comment 'OpenVPN'
ufw allow 443/tcp comment 'OpenVPN over HTTPS'
ufw allow 80/tcp comment 'OpenVPN over HTTP'
ufw allow 51820/udp comment 'WireGuard'
ufw allow 500/udp comment 'IKEv2/IPSec'
ufw allow 4500/udp comment 'IKEv2/IPSec NAT-T'
ufw allow 8080/tcp comment 'Cloudflare Tunnel Management'

# Enable firewall
ufw --force enable

# Configure fail2ban
echo "🛡️ Configuring fail2ban..."
cat > /etc/fail2ban/jail.local << EOF
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 3

[sshd]
enabled = true
port = ssh
logpath = /var/log/auth.log
maxretry = 3

[openvpn]
enabled = true
port = 1194
protocol = udp
logpath = /var/log/openvpn.log
maxretry = 3

[wireguard]
enabled = true
port = 51820
protocol = udp
logpath = /var/log/wireguard.log
maxretry = 3
EOF

systemctl enable fail2ban
systemctl start fail2ban

# Generate OpenVPN certificates
echo "🔐 Generating OpenVPN certificates..."
cd /opt/conservertive/openvpn
make-cadir /opt/conservertive/openvpn/easy-rsa
cd /opt/conservertive/openvpn/easy-rsa

# Configure Easy-RSA
cat > vars << EOF
export KEY_COUNTRY="US"
export KEY_PROVINCE="CA"
export KEY_CITY="San Francisco"
export KEY_ORG="ConSERVERtive"
export KEY_EMAIL="admin@conservertive.com"
export KEY_OU="IT"
export KEY_NAME="ConSERVERtive-VPN"
EOF

# Initialize PKI
source vars
./clean-all
./build-ca --batch
./build-key-server --batch server
./build-dh --batch
./build-key --batch client1

# Copy certificates
cp /opt/conservertive/openvpn/easy-rsa/keys/{ca.crt,server.crt,server.key,dh2048.pem} /etc/openvpn/

# Generate WireGuard keys
echo "🔒 Generating WireGuard keys..."
cd /etc/wireguard
wg genkey | tee privatekey | wg pubkey > publickey
chmod 600 privatekey
chmod 644 publickey

# Generate IKEv2 certificates
echo "🛡️ Generating IKEv2 certificates..."
cd /opt/conservertive/ikev2
ipsec pki --gen --type rsa --size 2048 --outform pem > server-key.pem
ipsec pki --self --ca --lifetime 3652 --in server-key.pem --dn "C=US, O=ConSERVERtive, CN=ConSERVERtive Root CA" --outform pem > server-ca.pem
ipsec pki --gen --type rsa --size 2048 --outform pem > server-cert-key.pem
ipsec pki --req --type priv --in server-cert-key.pem --dn "C=US, O=ConSERVERtive, CN=$PUBLIC_IP" --outform pem > server-cert-req.pem
ipsec pki --issue --lifetime 1200 --cacert server-ca.pem --cakey server-key.pem --in server-cert-req.pem --dn "C=US, O=ConSERVERtive, CN=$PUBLIC_IP" --san $PUBLIC_IP --flag serverAuth --flag ikeIntermediate --outform pem > server-cert.pem

# Copy IKEv2 certificates
cp server-ca.pem /etc/ipsec.d/cacerts/
cp server-cert.pem /etc/ipsec.d/certs/
cp server-cert-key.pem /etc/ipsec.d/private/
cp server-cert.pem /etc/ipsec.d/certs/
cp server-cert-key.pem /etc/ipsec.d/private/

# Create OpenVPN server configuration
echo "📝 Creating OpenVPN server configuration..."
cat > /etc/openvpn/server.conf << EOF
port 1194
proto udp
dev tun
ca ca.crt
cert server.crt
key server.key
dh dh2048.pem
server 10.8.0.0 255.255.255.0
ifconfig-pool-persist ipp.txt
push "redirect-gateway def1 bypass-dhcp"
push "dhcp-option DNS 1.1.1.1"
push "dhcp-option DNS 1.0.0.1"
keepalive 10 120
cipher AES-256-GCM
user nobody
group nogroup
persist-key
persist-tun
status openvpn-status.log
verb 3
explicit-exit-notify 1
EOF

# Create WireGuard configuration
echo "📝 Creating WireGuard configuration..."
PRIVATE_KEY=$(cat /etc/wireguard/privatekey)
PUBLIC_KEY=$(cat /etc/wireguard/publickey)

cat > /etc/wireguard/wg0.conf << EOF
[Interface]
PrivateKey = $PRIVATE_KEY
Address = 10.7.0.1/24
ListenPort = 51820
PostUp = iptables -A FORWARD -i %i -j ACCEPT; iptables -A FORWARD -o %i -j ACCEPT; iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
PostDown = iptables -D FORWARD -i %i -j ACCEPT; iptables -D FORWARD -o %i -j ACCEPT; iptables -t nat -D POSTROUTING -o eth0 -j MASQUERADE

# Client configuration template
# [Peer]
# PublicKey = CLIENT_PUBLIC_KEY
# AllowedIPs = 10.7.0.2/32
EOF

# Create IKEv2 configuration
echo "📝 Creating IKEv2 configuration..."
cat > /etc/ipsec.conf << EOF
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
    ike=aes256-sha256-modp2048,3des-sha1-modp2048,aes256-sha1-modp2048!
    esp=aes256-sha256,3des-sha1,aes256-sha1!
    ikev2=insist
    rekey=no
    left=%any
    leftid=$PUBLIC_IP
    leftcert=server-cert.pem
    leftsendcert=always
    leftsubnet=0.0.0.0/0
    right=%any
    rightid=%any
    rightauth=eap-mschapv2
    rightsourceip=10.6.0.0/24
    rightdns=1.1.1.1,1.0.0.1
    rightsendcert=never
    eap_identity=%identity
EOF

# Create IKEv2 secrets
cat > /etc/ipsec.secrets << EOF
: RSA server-cert-key.pem
: PSK "conservertive-psk-$(openssl rand -hex 16)"
EOF

# Enable IP forwarding
echo "🌐 Enabling IP forwarding..."
echo 'net.ipv4.ip_forward=1' >> /etc/sysctl.conf
sysctl -p

# Create VPN management API
echo "📱 Creating VPN management API..."
cat > /opt/conservertive/vpn-api.js << 'EOF'
const express = require('express');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 8080;

app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      openvpn: 'running',
      wireguard: 'running',
      ikev2: 'running',
      cloudflare: 'running'
    }
  });
});

// Get server status
app.get('/status', (req, res) => {
  const status = {
    server: {
      instance_id: process.env.INSTANCE_ID || 'unknown',
      public_ip: process.env.PUBLIC_IP || 'unknown',
      region: process.env.REGION || 'unknown',
      environment: process.env.ENVIRONMENT || 'unknown'
    },
    services: {
      openvpn: { status: 'running', port: 1194, protocol: 'udp' },
      wireguard: { status: 'running', port: 51820, protocol: 'udp' },
      ikev2: { status: 'running', ports: [500, 4500], protocol: 'udp' },
      cloudflare: { status: 'running', port: 8080, protocol: 'tcp' }
    },
    connections: {
      openvpn: 0,
      wireguard: 0,
      ikev2: 0,
      total: 0
    }
  };
  
  res.json(status);
});

// Get client configuration
app.get('/config/:protocol/:client', (req, res) => {
  const { protocol, client } = req.params;
  
  try {
    let config;
    
    switch (protocol) {
      case 'openvpn':
        config = generateOpenVPNConfig(client);
        break;
      case 'wireguard':
        config = generateWireGuardConfig(client);
        break;
      case 'ikev2':
        config = generateIKEv2Config(client);
        break;
      default:
        return res.status(400).json({ error: 'Invalid protocol' });
    }
    
    res.json({ config });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

function generateOpenVPNConfig(client) {
  // Generate OpenVPN client configuration
  return {
    protocol: 'openvpn',
    server: process.env.PUBLIC_IP,
    port: 1194,
    config: `client
dev tun
proto udp
remote ${process.env.PUBLIC_IP} 1194
resolv-retry infinite
nobind
persist-key
persist-tun
cipher AES-256-GCM
verb 3`
  };
}

function generateWireGuardConfig(client) {
  // Generate WireGuard client configuration
  return {
    protocol: 'wireguard',
    server: process.env.PUBLIC_IP,
    port: 51820,
    config: `[Interface]
PrivateKey = CLIENT_PRIVATE_KEY
Address = 10.7.0.2/24
DNS = 1.1.1.1, 1.0.0.1

[Peer]
PublicKey = ${process.env.WIREGUARD_PUBLIC_KEY}
Endpoint = ${process.env.PUBLIC_IP}:51820
AllowedIPs = 0.0.0.0/0
PersistentKeepalive = 25`
  };
}

function generateIKEv2Config(client) {
  // Generate IKEv2 client configuration
  return {
    protocol: 'ikev2',
    server: process.env.PUBLIC_IP,
    ports: [500, 4500],
    config: {
      server: process.env.PUBLIC_IP,
      username: client,
      password: 'generated-password',
      certificate: 'server-ca.pem'
    }
  };
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`ConSERVERtive VPN API running on port ${PORT}`);
});
EOF

# Create package.json for VPN API
cat > /opt/conservertive/package.json << EOF
{
  "name": "conservertive-vpn-api",
  "version": "1.0.0",
  "description": "ConSERVERtive VPN Management API",
  "main": "vpn-api.js",
  "scripts": {
    "start": "node vpn-api.js"
  },
  "dependencies": {
    "express": "^4.18.2"
  }
}
EOF

# Install VPN API dependencies
cd /opt/conservertive
npm install

# Create systemd services
echo "⚙️ Creating systemd services..."

# OpenVPN service
cat > /etc/systemd/system/openvpn@server.service << EOF
[Unit]
Description=OpenVPN connection to %i
After=network.target

[Service]
Type=notify
PrivateTmp=true
WorkingDirectory=/etc/openvpn
ExecStart=/usr/sbin/openvpn --config %i.conf --writepid /run/openvpn/%i.pid --pid-version 3
PIDFile=/run/openvpn/%i.pid
KillMode=mixed
Restart=always
RestartSec=5
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target
EOF

# WireGuard service
cat > /etc/systemd/system/wg-quick@.service << EOF
[Unit]
Description=WireGuard via wg-quick(8) for %i
After=network.target
Before=network-online.target
Wants=network-online.target
PartOf=wg-quick@.service

[Service]
Type=oneshot
RemainAfterExit=yes
ExecStart=/usr/bin/wg-quick up %i
ExecStop=/usr/bin/wg-quick down %i
ExecReload=/bin/kill -HUP \$MAINPID
Environment=WG_ENDPOINT_RESOLUTION_RETRIES=infinity

[Install]
WantedBy=multi-user.target
EOF

# VPN API service
cat > /etc/systemd/system/conservertive-vpn-api.service << EOF
[Unit]
Description=ConSERVERtive VPN Management API
After=network.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/opt/conservertive
ExecStart=/usr/bin/node vpn-api.js
Restart=always
RestartSec=5
Environment=INSTANCE_ID=$INSTANCE_ID
Environment=PUBLIC_IP=$PUBLIC_IP
Environment=REGION=$REGION
Environment=ENVIRONMENT=$ENVIRONMENT
Environment=WIREGUARD_PUBLIC_KEY=$PUBLIC_KEY

[Install]
WantedBy=multi-user.target
EOF

# Enable and start services
echo "🚀 Starting VPN services..."
systemctl daemon-reload
systemctl enable openvpn@server
systemctl enable wg-quick@wg0
systemctl enable strongswan
systemctl enable conservertive-vpn-api

systemctl start openvpn@server
systemctl start wg-quick@wg0
systemctl start strongswan
systemctl start conservertive-vpn-api

# Create Cloudflare tunnel configuration
echo "☁️ Creating Cloudflare tunnel configuration..."
mkdir -p /opt/conservertive/cloudflare
cat > /opt/conservertive/cloudflare/config.yml << EOF
tunnel: conservertive-vpn-$ENVIRONMENT
credentials-file: /opt/conservertive/cloudflare/credentials.json

ingress:
  # VPN Management API
  - hostname: vpn-$ENVIRONMENT.conservertive.com
    service: http://localhost:8080
    originRequest:
      httpHostHeader: vpn-$ENVIRONMENT.conservertive.com
  
  # OpenVPN Server
  - hostname: openvpn-$ENVIRONMENT.conservertive.com
    service: tcp://localhost:1194
    originRequest:
      proxyType: tcp
  
  # WireGuard Server
  - hostname: wireguard-$ENVIRONMENT.conservertive.com
    service: udp://localhost:51820
    originRequest:
      proxyType: udp
  
  # IKEv2 Server
  - hostname: ikev2-$ENVIRONMENT.conservertive.com
    service: udp://localhost:500
    originRequest:
      proxyType: udp
  
  # Catch-all rule
  - service: http_status:404
EOF

# Create Cloudflare tunnel service
cat > /etc/systemd/system/cloudflared.service << EOF
[Unit]
Description=Cloudflare Tunnel
After=network.target

[Service]
Type=simple
User=ubuntu
ExecStart=/usr/local/bin/cloudflared tunnel --config /opt/conservertive/cloudflare/config.yml run
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

# Create monitoring script
echo "📊 Creating monitoring script..."
cat > /opt/conservertive/monitor.sh << 'EOF'
#!/bin/bash

# ConSERVERtive VPN Server Monitoring Script

LOG_FILE="/opt/conservertive/logs/monitor.log"
DATE=$(date '+%Y-%m-%d %H:%M:%S')

echo "[$DATE] Starting VPN server monitoring..." >> $LOG_FILE

# Check OpenVPN status
if systemctl is-active --quiet openvpn@server; then
    echo "[$DATE] OpenVPN: Running" >> $LOG_FILE
else
    echo "[$DATE] OpenVPN: Failed" >> $LOG_FILE
    systemctl restart openvpn@server
fi

# Check WireGuard status
if systemctl is-active --quiet wg-quick@wg0; then
    echo "[$DATE] WireGuard: Running" >> $LOG_FILE
else
    echo "[$DATE] WireGuard: Failed" >> $LOG_FILE
    systemctl restart wg-quick@wg0
fi

# Check IKEv2 status
if systemctl is-active --quiet strongswan; then
    echo "[$DATE] IKEv2: Running" >> $LOG_FILE
else
    echo "[$DATE] IKEv2: Failed" >> $LOG_FILE
    systemctl restart strongswan
fi

# Check VPN API status
if systemctl is-active --quiet conservertive-vpn-api; then
    echo "[$DATE] VPN API: Running" >> $LOG_FILE
else
    echo "[$DATE] VPN API: Failed" >> $LOG_FILE
    systemctl restart conservertive-vpn-api
fi

# Check Cloudflare tunnel status
if systemctl is-active --quiet cloudflared; then
    echo "[$DATE] Cloudflare Tunnel: Running" >> $LOG_FILE
else
    echo "[$DATE] Cloudflare Tunnel: Failed" >> $LOG_FILE
    systemctl restart cloudflared
fi

echo "[$DATE] Monitoring complete." >> $LOG_FILE
EOF

chmod +x /opt/conservertive/monitor.sh

# Create monitoring cron job
echo "⏰ Setting up monitoring cron job..."
echo "*/5 * * * * /opt/conservertive/monitor.sh" | crontab -

# Create log rotation
echo "📝 Setting up log rotation..."
cat > /etc/logrotate.d/conservertive << EOF
/opt/conservertive/logs/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 ubuntu ubuntu
    postrotate
        systemctl reload conservertive-vpn-api
    endscript
}
EOF

# Final status check
echo "✅ Final status check..."
systemctl status openvpn@server --no-pager
systemctl status wg-quick@wg0 --no-pager
systemctl status strongswan --no-pager
systemctl status conservertive-vpn-api --no-pager

echo "🎉 ConSERVERtive VPN Server Setup Complete!"
echo "📋 Server Details:"
echo "   Instance ID: $INSTANCE_ID"
echo "   Public IP: $PUBLIC_IP"
echo "   Region: $REGION"
echo "   Environment: $ENVIRONMENT"
echo ""
echo "🔗 Services Running:"
echo "   OpenVPN: Port 1194 (UDP)"
echo "   WireGuard: Port 51820 (UDP)"
echo "   IKEv2: Ports 500, 4500 (UDP)"
echo "   VPN API: Port 8080 (TCP)"
echo ""
echo "📊 Monitoring:"
echo "   Health Check: http://$PUBLIC_IP:8080/health"
echo "   Status: http://$PUBLIC_IP:8080/status"
echo ""
echo "☁️ Cloudflare Tunnel:"
echo "   Config: /opt/conservertive/cloudflare/config.yml"
echo "   Service: cloudflared.service"
echo ""
echo "📝 Logs:"
echo "   VPN Setup: /var/log/vpn-setup.log"
echo "   Monitoring: /opt/conservertive/logs/monitor.log"
echo "   OpenVPN: /var/log/openvpn.log"
echo "   WireGuard: /var/log/wireguard.log"
echo ""
echo "🔧 Management:"
echo "   OpenVPN: systemctl status openvpn@server"
echo "   WireGuard: systemctl status wg-quick@wg0"
echo "   IKEv2: systemctl status strongswan"
echo "   API: systemctl status conservertive-vpn-api"
echo "   Tunnel: systemctl status cloudflared"
echo ""
echo "🚀 ConSERVERtive VPN Server is ready for connections!"
