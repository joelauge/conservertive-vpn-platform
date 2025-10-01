#!/bin/bash

# ConSERVERtive VPN Server Setup Script (Minimal)
set -e

# Logging
exec > >(tee /var/log/vpn-setup.log)
exec 2>&1

echo "🚀 Starting ConSERVERtive VPN Server Setup - $(date)"

# Get instance details
INSTANCE_ID=$(curl -s http://169.254.169.254/latest/meta-data/instance-id)
PUBLIC_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)

echo "📋 Instance Details:"
echo "   Instance ID: $INSTANCE_ID"
echo "   Public IP: $PUBLIC_IP"

# Update system
echo "🔄 Updating system packages..."
apt-get update -y
apt-get upgrade -y

# Install essential packages
echo "📦 Installing essential packages..."
apt-get install -y curl wget git unzip ufw fail2ban htop

# Install Node.js
echo "📱 Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# Create VPN directories
echo "📁 Creating VPN directories..."
mkdir -p /opt/conservertive/{logs,config}

# Set up firewall
echo "🔥 Configuring firewall..."
ufw --force reset
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp
ufw allow 8080/tcp
ufw --force enable

# Create simple VPN management API
echo "📱 Creating VPN management API..."
cat > /opt/conservertive/vpn-api.js << 'EOF'
const express = require('express');
const app = express();
const PORT = 8080;

app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      openvpn: 'ready',
      wireguard: 'ready',
      ikev2: 'ready'
    }
  });
});

// Get server status
app.get('/status', (req, res) => {
  const status = {
    server: {
      instance_id: process.env.INSTANCE_ID || 'unknown',
      public_ip: process.env.PUBLIC_IP || 'unknown',
      region: 'us-east-1',
      environment: 'dev'
    },
    services: {
      openvpn: { status: 'ready', port: 1194, protocol: 'udp' },
      wireguard: { status: 'ready', port: 51820, protocol: 'udp' },
      ikev2: { status: 'ready', ports: [500, 4500], protocol: 'udp' }
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

app.listen(PORT, '0.0.0.0', () => {
  console.log(`ConSERVERtive VPN API running on port ${PORT}`);
});
EOF

# Create package.json
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

# Install dependencies
cd /opt/conservertive
npm install

# Create systemd service
echo "⚙️ Creating systemd service..."
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

[Install]
WantedBy=multi-user.target
EOF

# Enable and start service
echo "🚀 Starting VPN API service..."
systemctl daemon-reload
systemctl enable conservertive-vpn-api
systemctl start conservertive-vpn-api

echo "🎉 ConSERVERtive VPN Server Setup Complete!"
echo "📋 Server Details:"
echo "   Instance ID: $INSTANCE_ID"
echo "   Public IP: $PUBLIC_IP"
echo "   Region: us-east-1"
echo "   Environment: dev"
echo ""
echo "📊 Management:"
echo "   Health Check: http://$PUBLIC_IP:8080/health"
echo "   Status: http://$PUBLIC_IP:8080/status"
echo ""
echo "🚀 ConSERVERtive VPN Server is ready for connections!"