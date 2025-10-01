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
      instance_id: 'conservertive-dev-local',
      public_ip: 'localhost',
      region: 'local',
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

// Get supported protocols
app.get('/protocols', (req, res) => {
  res.json({
    protocols: [
      {
        name: 'openvpn',
        description: 'OpenVPN - Industry standard VPN protocol with high compatibility',
        ports: [1194],
        status: 'ready'
      },
      {
        name: 'wireguard',
        description: 'WireGuard - Modern, fast VPN protocol with minimal attack surface',
        ports: [51820],
        status: 'ready'
      },
      {
        name: 'ikev2',
        description: 'IKEv2/IPSec - Enterprise-grade protocol with native mobile support',
        ports: [500, 4500],
        status: 'ready'
      }
    ]
  });
});

// Generate client configuration
app.post('/clients/:userId/config', (req, res) => {
  const { userId } = req.params;
  const { serverId, protocol } = req.body;

  let config = '';
  let configType = '';

  switch (protocol) {
    case 'openvpn':
      config = `# ConSERVERtive OpenVPN Client Configuration
client
dev tun
proto udp
remote localhost 1194
resolv-retry infinite
nobind
persist-key
persist-tun
remote-cert-tls server
cipher AES-256-GCM
auth SHA256
comp-lzo
verb 3

# Note: In production, certificates would be embedded here
# <ca>...</ca>
# <cert>...</cert>
# <key>...</key>
# <tls-auth>...</tls-auth>
`;
      configType = 'openvpn.conf';
      break;

    case 'wireguard':
      config = `# ConSERVERtive WireGuard Client Configuration
[Interface]
PrivateKey = [CLIENT_PRIVATE_KEY]
Address = 10.7.0.2/24
DNS = 8.8.8.8, 8.8.4.4

[Peer]
PublicKey = [SERVER_PUBLIC_KEY]
Endpoint = localhost:51820
AllowedIPs = 0.0.0.0/0
PersistentKeepalive = 25
`;
      configType = 'wg0.conf';
      break;

    case 'ikev2':
      config = `# ConSERVERtive IKEv2 Client Configuration
# Server: localhost
# Username: client-${userId}
# Password: [Generated password]
# Certificate: client-${userId}-cert.pem
# Private Key: client-${userId}-key.pem
# CA Certificate: ca-cert.pem

# Connection settings:
# - Protocol: IKEv2
# - Server: localhost
# - Port: 500, 4500
# - Authentication: Certificate + Username/Password
`;
      configType = 'ikev2-config.txt';
      break;

    default:
      return res.status(400).json({ error: 'Unsupported protocol' });
  }

  res.json({
    userId,
    protocol,
    serverId: serverId || 'conservertive-dev-local',
    config,
    configType,
    generatedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
  });
});

// Get server statistics
app.get('/stats', (req, res) => {
  res.json({
    totalServers: 1,
    activeServers: 1,
    totalConnections: 0,
    activeConnections: 0,
    protocols: {
      openvpn: { connections: 0, servers: 1 },
      wireguard: { connections: 0, servers: 1 },
      ikev2: { connections: 0, servers: 1 }
    },
    regions: {
      'local': { servers: 1, connections: 0 }
    },
    uptime: '100%',
    averageLatency: 1
  });
});

// Get active connections
app.get('/connections', (req, res) => {
  res.json([]);
});

// Server management endpoints
app.post('/servers/:serverId/setup', (req, res) => {
  const { serverId } = req.params;
  const { protocols } = req.body;

  res.json({
    message: `VPN server ${serverId} setup completed successfully`,
    protocols: protocols || ['openvpn', 'wireguard', 'ikev2'],
    timestamp: new Date().toISOString()
  });
});

app.post('/servers/:serverId/restart', (req, res) => {
  const { serverId } = req.params;

  res.json({
    message: `VPN server ${serverId} restart initiated`,
    timestamp: new Date().toISOString()
  });
});

app.post('/servers/:serverId/maintenance', (req, res) => {
  const { serverId } = req.params;
  const { enabled, reason } = req.body;

  res.json({
    message: `Server ${serverId} maintenance mode ${enabled ? 'activated' : 'deactivated'}`,
    maintenance: enabled,
    reason: reason || 'No reason provided',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 ConSERVERtive VPN Management API running on port ${PORT}`);
  console.log(`📊 Health Check: http://localhost:${PORT}/health`);
  console.log(`📈 Status: http://localhost:${PORT}/status`);
  console.log(`🔧 Protocols: http://localhost:${PORT}/protocols`);
  console.log(`📊 Stats: http://localhost:${PORT}/stats`);
});
