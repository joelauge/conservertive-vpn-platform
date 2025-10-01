#!/bin/bash

# ConSERVERtive VPN Server - Docker Deployment Script
# This script deploys a local VPN server using Docker

set -e

echo "🚀 ConSERVERtive VPN Server - Docker Deployment"
echo "=============================================="

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Error: Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Error: Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "✅ Docker and Docker Compose are installed"
echo ""

# Navigate to the Docker directory
cd apps/infrastructure/docker

# Build the VPN server image
echo "🔨 Building ConSERVERtive VPN Server image..."
docker-compose build conservertive-vpn-server

# Start the VPN server
echo "🚀 Starting ConSERVERtive VPN Server..."
docker-compose up -d conservertive-vpn-server

# Wait for the server to start
echo "⏳ Waiting for VPN server to start..."
sleep 10

# Check if the server is running
if docker-compose ps conservertive-vpn-server | grep -q "Up"; then
    echo "✅ ConSERVERtive VPN Server is running!"
else
    echo "❌ Failed to start VPN server"
    docker-compose logs conservertive-vpn-server
    exit 1
fi

# Get server details
SERVER_IP=$(docker inspect conservertive-vpn-dev | grep -o '"IPAddress":"[^"]*"' | head -1 | cut -d'"' -f4)
CONTAINER_ID=$(docker ps -q -f name=conservertive-vpn-dev)

echo ""
echo "📊 Deployment Complete!"
echo "======================"
echo "Container ID: $CONTAINER_ID"
echo "Server IP: $SERVER_IP"
echo ""

echo "🌐 VPN Server Details:"
echo "   • OpenVPN: Port 1194 UDP"
echo "   • WireGuard: Port 51820 UDP"
echo "   • IKEv2/IPSec: Ports 500, 4500 UDP"
echo "   • Management API: Port 8080 TCP"
echo ""

echo "📊 Management API Endpoints:"
echo "   • Health Check: http://localhost:8080/health"
echo "   • Server Status: http://localhost:8080/status"
echo "   • Protocols: http://localhost:8080/protocols"
echo "   • Statistics: http://localhost:8080/stats"
echo ""

echo "🔧 Useful Commands:"
echo "   • View logs: docker-compose logs -f conservertive-vpn-server"
echo "   • Stop server: docker-compose down"
echo "   • Restart server: docker-compose restart conservertive-vpn-server"
echo "   • Access container: docker exec -it conservertive-vpn-dev bash"
echo ""

echo "🧪 Test the VPN Server:"
echo "   • Test API: curl http://localhost:8080/health"
echo "   • Test protocols: curl http://localhost:8080/protocols"
echo "   • Generate config: curl -X POST http://localhost:8080/clients/test-user/config -H 'Content-Type: application/json' -d '{\"serverId\":\"conservertive-dev-local\",\"protocol\":\"openvpn\"}'"
echo ""

echo "🎉 ConSERVERtive VPN Server deployed successfully!"
echo ""
echo "📋 Next Steps:"
echo "   1. Test VPN connections using the generated configurations"
echo "   2. Configure VPN clients (OpenVPN, WireGuard, IKEv2)"
echo "   3. Test actual VPN traffic routing"
echo "   4. Deploy to production infrastructure when ready"
echo ""

# Test the API
echo "🧪 Testing VPN Management API..."
if curl -s http://localhost:8080/health > /dev/null; then
    echo "✅ VPN Management API is responding"
    echo "📊 Server Status:"
    curl -s http://localhost:8080/status | jq '.' 2>/dev/null || curl -s http://localhost:8080/status
else
    echo "⚠️  VPN Management API is not responding yet. It may take a few more seconds to start."
fi

echo ""
echo "🎯 ConSERVERtive VPN Server is ready for testing!"
