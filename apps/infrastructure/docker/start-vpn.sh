#!/bin/bash

echo "🚀 Starting ConSERVERtive VPN Server..."

# Start VPN API in background
echo "📡 Starting VPN Management API..."
node vpn-api.js &

# Wait for API to start
sleep 5

# Check if API is running
if curl -f http://localhost:8080/health > /dev/null 2>&1; then
    echo "✅ VPN Management API is running"
else
    echo "❌ VPN Management API failed to start"
    exit 1
fi

# Keep the container running
echo "🔄 VPN Server is ready. Keeping container alive..."
tail -f /dev/null


