#!/bin/bash

# Railway Deployment Script for ConSERVERtive VPN Service
# This script deploys both VPN servers and backend API to Railway

set -e

echo "🚀 Starting ConSERVERtive Railway deployment..."

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not found. Installing..."
    npm install -g @railway/cli
fi

echo "✅ Railway CLI ready"

# Check if user is logged in
if ! railway whoami &> /dev/null; then
    echo "🔐 Please login to Railway first:"
    echo "   railway login"
    echo ""
    echo "Then run this script again."
    exit 1
fi

echo "✅ Railway authentication confirmed"

# Deploy VPN Server
echo "🌐 Deploying VPN Server to Railway..."
cd apps/infrastructure/docker

# Initialize Railway project for VPN server
railway init --name conservertive-vpn-server

# Set environment variables
railway variables --set VPN_SERVER_NAME="conservertive-vpn-server" --set VPN_SERVER_REGION="us-east-1" --set VPN_SERVER_PROTOCOLS="openvpn,wireguard,ikev2" --set NODE_ENV="production"

# Deploy VPN server
railway up

echo "✅ VPN Server deployed to Railway"

# Get VPN server URL
VPN_URL=$(railway domain)
echo "🌐 VPN Server URL: $VPN_URL"

# Deploy Backend API
echo "🔧 Deploying Backend API to Railway..."
cd ../../backend

# Initialize Railway project for backend
railway init --name conservertive-backend-api

# Add PostgreSQL database
railway add postgresql

# Add Redis database
railway add redis

# Set environment variables
railway variables --set NODE_ENV="production" --set PORT="3001" --set JWT_SECRET="$(openssl rand -base64 32)" --set STRIPE_SECRET_KEY="$STRIPE_SECRET_KEY" --set STRIPE_PUBLISHABLE_KEY="$STRIPE_PUBLISHABLE_KEY"

# Deploy backend API
railway up

echo "✅ Backend API deployed to Railway"

# Get backend API URL
API_URL=$(railway domain)
echo "🔧 Backend API URL: $API_URL"

echo ""
echo "🎉 ConSERVERtive Railway deployment complete!"
echo ""
echo "📊 Deployment Summary:"
echo "   VPN Server: $VPN_URL"
echo "   Backend API: $API_URL"
echo ""
echo "📋 Next Steps:"
echo "   1. Configure domain routing:"
echo "      - vpn.conservertive.co → $VPN_URL"
echo "      - api.conservertive.co → $API_URL"
echo "   2. Test VPN connection: curl $VPN_URL/health"
echo "   3. Test API: curl $API_URL/health"
echo "   4. Update frontend to use $API_URL"
echo ""
echo "💰 Cost: $0/month (covered by Railway $5 credit)"
