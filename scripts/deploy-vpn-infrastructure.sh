#!/bin/bash

# ConSERVERtive VPN Infrastructure Deployment Script
# This script deploys VPN servers using Terraform

set -e

echo "🚀 ConSERVERtive VPN Infrastructure Deployment"
echo "=============================================="

# Check if we're in the right directory
if [ ! -f "main.tf" ]; then
    echo "❌ Error: main.tf not found. Please run this script from the terraform directory."
    exit 1
fi

# Check if terraform is installed
if ! command -v terraform &> /dev/null; then
    echo "❌ Error: Terraform is not installed. Please install it first."
    exit 1
fi

# Check if AWS CLI is configured
if ! aws sts get-caller-identity &> /dev/null; then
    echo "❌ Error: AWS CLI is not configured. Please run 'aws configure' first."
    exit 1
fi

echo "✅ Prerequisites check passed"
echo ""

# Initialize Terraform
echo "🔄 Initializing Terraform..."
terraform init

# Plan the deployment
echo "📋 Planning deployment..."
terraform plan

# Ask for confirmation
echo ""
read -p "🤔 Do you want to proceed with the deployment? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Deployment cancelled."
    exit 1
fi

# Apply the deployment
echo "🚀 Deploying VPN infrastructure..."
terraform apply -auto-approve

# Get the outputs
echo ""
echo "📊 Deployment completed! Here are the details:"
echo "=============================================="
terraform output

echo ""
echo "🎉 ConSERVERtive VPN Infrastructure deployed successfully!"
echo ""
echo "📋 Next steps:"
echo "   1. SSH into the VPN server: ssh -i ~/.ssh/id_rsa ubuntu@<PUBLIC_IP>"
echo "   2. Check VPN API status: curl http://<PUBLIC_IP>:8080/health"
echo "   3. Configure VPN protocols (OpenVPN, WireGuard, IKEv2)"
echo "   4. Test VPN connections"
echo ""
echo "🔗 Useful commands:"
echo "   • View logs: ssh -i ~/.ssh/id_rsa ubuntu@<PUBLIC_IP> 'sudo journalctl -u conservertive-vpn-api -f'"
echo "   • Check service status: ssh -i ~/.ssh/id_rsa ubuntu@<PUBLIC_IP> 'sudo systemctl status conservertive-vpn-api'"
echo "   • Restart service: ssh -i ~/.ssh/id_rsa ubuntu@<PUBLIC_IP> 'sudo systemctl restart conservertive-vpn-api'"
echo ""
echo "🌐 VPN Server Management API:"
echo "   • Health check: http://<PUBLIC_IP>:8080/health"
echo "   • Server status: http://<PUBLIC_IP>:8080/status"
echo ""
echo "🔧 To destroy the infrastructure later:"
echo "   terraform destroy"