#!/bin/bash

# ConSERVERtive VPN Server Deployment Script
# This script deploys VPN servers to AWS using Terraform

set -e

echo "🚀 Starting ConSERVERtive VPN Server Deployment..."

# Check if AWS CLI is configured
if ! aws sts get-caller-identity > /dev/null 2>&1; then
    echo "❌ AWS CLI not configured. Please run 'aws configure' first."
    exit 1
fi

# Check if Terraform is installed
if ! command -v terraform &> /dev/null; then
    echo "❌ Terraform not installed. Please install Terraform first."
    exit 1
fi

# Navigate to terraform directory
cd "$(dirname "$0")/apps/infrastructure/terraform"

echo "📋 Initializing Terraform..."
terraform init

echo "🔍 Planning deployment..."
terraform plan -var-file="terraform.tfvars"

echo "⚠️  WARNING: This will create AWS resources and may incur costs."
echo "Do you want to continue? (y/N)"
read -r response

if [[ "$response" =~ ^[Yy]$ ]]; then
    echo "🚀 Deploying VPN servers..."
    terraform apply -var-file="terraform.tfvars" -auto-approve
    
    echo "✅ VPN servers deployed successfully!"
    echo "📊 Server details:"
    terraform output
    
    echo ""
    echo "🔧 Next steps:"
    echo "1. SSH into the servers to verify VPN services are running"
    echo "2. Test VPN connections from client devices"
    echo "3. Configure load balancer if needed"
    echo "4. Set up monitoring and logging"
    
else
    echo "❌ Deployment cancelled."
    exit 1
fi
