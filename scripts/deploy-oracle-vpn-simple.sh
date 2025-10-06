#!/bin/bash

# Oracle Cloud VPN Server Deployment Script
# This script deploys ConSERVERtive VPN servers to Oracle Cloud Infrastructure

set -e

echo "🚀 Starting ConSERVERtive VPN deployment to Oracle Cloud..."

# Configuration - Using specific IDs for your Oracle Cloud account
COMPARTMENT_ID="ocid1.tenancy.oc1..aaaaaaaa6mhrxbgt2u5jlkjilc64nmnn7yodqub3ykcgm77ai5re2yguateq"
REGION="ca-toronto-1"
INSTANCE_NAME="conservertive-vpn-server"
SHAPE="VM.Standard.A1.Flex"  # ARM-based, always free
OCPU_COUNT=1
MEMORY_GB=6
BOOT_VOLUME_SIZE=50

# Specific IDs for your Oracle Cloud account
IMAGE_ID="ocid1.image.oc1.ca-toronto-1.aaaaaaaawyd2sofjl3aeicvd6mn373y52dgeu2n3xjk6ipevzjowpxvvtxeq"
AVAILABILITY_DOMAIN="iXUG:CA-TORONTO-1-AD-1"
SUBNET_ID="ocid1.subnet.oc1.ca-toronto-1.aaaaaaaa524dugoa2moksze3ap2afcyfz47jpdsgsmjwzlalgbb7qpf52qva"
VCN_ID="ocid1.vcn.oc1.ca-toronto-1.amaaaaaa5kwfcnaayt5ghsbnsd7r6irobxo4epdtvm6rm5f4xnmam7qx6nmq"

# Check if OCI CLI is configured
if ! oci iam user list >/dev/null 2>&1; then
    echo "❌ OCI CLI not configured. Please run 'oci setup config' first."
    exit 1
fi

echo "✅ OCI CLI configured successfully"

# Create SSH key pair if it doesn't exist
if [ ! -f ~/.ssh/conservertive-oracle-key ]; then
    echo "🔑 Generating SSH key pair..."
    ssh-keygen -t rsa -b 2048 -f ~/.ssh/conservertive-oracle-key -N ""
    chmod 600 ~/.ssh/conservertive-oracle-key
    chmod 644 ~/.ssh/conservertive-oracle-key.pub
fi

# Get the public key
PUBLIC_KEY=$(cat ~/.ssh/conservertive-oracle-key.pub)

echo "📦 Using Image ID: $IMAGE_ID"
echo "🌐 Using Subnet ID: $SUBNET_ID"

# Create instance
echo "🖥️  Creating compute instance..."
INSTANCE_ID=$(oci compute instance launch \
    --compartment-id $COMPARTMENT_ID \
    --availability-domain $AVAILABILITY_DOMAIN \
    --display-name $INSTANCE_NAME \
    --image-id $IMAGE_ID \
    --shape $SHAPE \
    --shape-config '{"ocpus":'$OCPU_COUNT',"memoryInGBs":'$MEMORY_GB'}' \
    --subnet-id $SUBNET_ID \
    --ssh-authorized-keys-file ~/.ssh/conservertive-oracle-key.pub \
    --assign-public-ip true \
    --query 'data.id' \
    --raw-output)

echo "✅ Instance created: $INSTANCE_ID"

# Wait for instance to be running
echo "⏳ Waiting for instance to be running..."
oci compute instance wait --instance-id $INSTANCE_ID --wait-for-state RUNNING

# Get public IP
PUBLIC_IP=$(oci compute instance list-vnics --instance-id $INSTANCE_ID --query 'data[0]."public-ip"' --raw-output)

echo "🌐 Public IP: $PUBLIC_IP"

# Configure security list for VPN ports
echo "🔒 Configuring security list..."
SECURITY_LIST_ID=$(oci network vcn get --vcn-id $VCN_ID --query 'data."default-security-list-id"' --raw-output)

# Add VPN port rules
echo "🔓 Adding VPN port rules to security list..."
oci network security-list update \
    --security-list-id $SECURITY_LIST_ID \
    --ingress-security-rules '[
        {"source":"0.0.0.0/0","protocol":"6","tcpOptions":{"destinationPortRange":{"min":22,"max":22}}},
        {"source":"0.0.0.0/0","protocol":"17","udpOptions":{"destinationPortRange":{"min":1194,"max":1194}}},
        {"source":"0.0.0.0/0","protocol":"17","udpOptions":{"destinationPortRange":{"min":51820,"max":51820}}},
        {"source":"0.0.0.0/0","protocol":"17","udpOptions":{"destinationPortRange":{"min":500,"max":500}}},
        {"source":"0.0.0.0/0","protocol":"17","udpOptions":{"destinationPortRange":{"min":4500,"max":4500}}},
        {"source":"0.0.0.0/0","protocol":"6","tcpOptions":{"destinationPortRange":{"min":8080,"max":8080}}}
    ]' \
    --force

echo "✅ Security list updated"

# Wait for SSH to be available
echo "⏳ Waiting for SSH to be available..."
sleep 30

# Deploy VPN server
echo "🚀 Deploying VPN server..."
ssh -i ~/.ssh/conservertive-oracle-key -o StrictHostKeyChecking=no opc@$PUBLIC_IP << 'EOF'
    # Update system
    sudo apt update && sudo apt upgrade -y
    
    # Install Docker
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker opc
    
    # Install Git
    sudo apt install -y git
    
    # Clone repository
    git clone https://github.com/joelauge/conservertive-vpn-platform.git
    cd conservertive-vpn-platform/apps/infrastructure/docker
    
    # Start VPN server
    sudo docker-compose up -d
    
    # Wait for services to start
    sleep 30
    
    # Test VPN API
    curl http://localhost:8080/health
EOF

echo "🎉 VPN server deployed successfully!"
echo "📊 Instance Details:"
echo "   Instance ID: $INSTANCE_ID"
echo "   Public IP: $PUBLIC_IP"
echo "   SSH Key: ~/.ssh/conservertive-oracle-key"
echo "   Management API: http://$PUBLIC_IP:8080"
echo ""
echo "🔗 Connect to your VPN server:"
echo "   ssh -i ~/.ssh/conservertive-oracle-key opc@$PUBLIC_IP"
echo ""
echo "📋 Next steps:"
echo "   1. Test VPN connection: curl http://$PUBLIC_IP:8080/health"
echo "   2. Deploy backend API to Railway"
echo "   3. Configure domain routing"


