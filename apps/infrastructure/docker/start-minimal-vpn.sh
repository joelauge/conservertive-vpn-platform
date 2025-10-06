#!/bin/bash

# Minimal VPN Server Startup Script
echo "🚀 Starting Minimal ConSERVERtive VPN Server..."

# Start OpenVPN server in background
openvpn --config /etc/openvpn/server/openvpn-server.conf --daemon

# Start simple health check server
cat > /tmp/health-server.js << 'EOF'
const http = require('http');
const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      vpn: 'running'
    }));
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});
server.listen(8080, '0.0.0.0', () => {
  console.log('Health server running on port 8080');
});
EOF

# Start health server
node /tmp/health-server.js &

# Keep container running
tail -f /dev/null


