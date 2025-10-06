#!/bin/bash

# Minimal VPN Server Deployment for Oracle Cloud
echo "🚀 Deploying Minimal ConSERVERtive VPN Server to Oracle Cloud..."

# Set variables
VPN_IP="40.233.89.162"
SSH_KEY=".ssh/ssh-key-2025-10-01.key"

echo "📡 Connecting to Oracle Cloud instance: $VPN_IP"

# Test SSH connection
ssh -i $SSH_KEY -o ConnectTimeout=10 opc@$VPN_IP "echo 'SSH connection successful'"

if [ $? -eq 0 ]; then
    echo "✅ SSH connection successful"
    
    # Install minimal Docker setup
    echo "📦 Installing Docker..."
    ssh -i $SSH_KEY opc@$VPN_IP "
        sudo yum install -y docker git nodejs npm
        sudo systemctl start docker
        sudo systemctl enable docker
        sudo usermod -a -G docker opc
    "
    
    # Clone repository
    echo "📥 Cloning VPN server code..."
    ssh -i $SSH_KEY opc@$VPN_IP "
        git clone https://github.com/joelauge/conservertive-vpn.git
        cd conservertive-vpn/apps/infrastructure/docker
    "
    
    # Build and start minimal VPN server
    echo "🔨 Building minimal VPN server..."
    ssh -i $SSH_KEY opc@$VPN_IP "
        cd conservertive-vpn/apps/infrastructure/docker
        sudo docker-compose -f docker-compose.minimal.yml up -d
    "
    
    # Check status
    echo "📊 Checking VPN server status..."
    ssh -i $SSH_KEY opc@$VPN_IP "
        sudo docker ps
        curl -f http://localhost:8080/health
    "
    
    echo "🎉 Minimal VPN server deployed successfully!"
    echo "🌐 VPN Server IP: $VPN_IP"
    echo "🔗 Health Check: http://$VPN_IP:8080/health"
    
else
    echo "❌ SSH connection failed"
    exit 1
fi
