# ConSERVERtive VPN - Cloudflare Development Configuration

## Overview
This configuration sets up Cloudflare Tunnel and Zero Trust for ConSERVERtive VPN development.

## Prerequisites
- Cloudflare account
- cloudflared CLI installed
- Node.js 20+ for Wrangler (optional)

## Development Setup

### 1. Authenticate with Cloudflare
```bash
cloudflared tunnel login
```

### 2. Create Development Tunnel
```bash
cloudflared tunnel create conservertive-dev
```

### 3. Configure Tunnel Routing
Create a configuration file at `~/.cloudflared/config.yml`:

```yaml
tunnel: conservertive-dev
credentials-file: /Users/jauge/.cloudflared/[tunnel-id].json

ingress:
  # Backend API
  - hostname: api.conservertive-dev.com
    service: http://localhost:3001
    originRequest:
      httpHostHeader: api.conservertive-dev.com
  
  # Frontend Application
  - hostname: app.conservertive-dev.com
    service: http://localhost:3000
    originRequest:
      httpHostHeader: app.conservertive-dev.com
  
  # VPN Server Management (for development)
  - hostname: vpn.conservertive-dev.com
    service: http://localhost:8080
    originRequest:
      httpHostHeader: vpn.conservertive-dev.com
  
  # Catch-all rule
  - service: http_status:404
```

### 4. DNS Configuration
Add DNS records in Cloudflare dashboard:
- `api.conservertive-dev.com` → CNAME → `[tunnel-id].cfargotunnel.com`
- `app.conservertive-dev.com` → CNAME → `[tunnel-id].cfargotunnel.com`
- `vpn.conservertive-dev.com` → CNAME → `[tunnel-id].cfargotunnel.com`

### 5. Start Development Tunnel
```bash
cloudflared tunnel run conservertive-dev
```

## Production Configuration

### Zero Trust Setup
1. Enable Cloudflare Zero Trust
2. Configure Access policies for admin users
3. Set up device enrollment for VPN clients
4. Configure WARP client integration

### Tunnel Security
1. Enable mTLS for tunnel authentication
2. Configure IP allowlists
3. Set up rate limiting
4. Enable DDoS protection

## VPN Server Integration

### Cloudflare Tunnel on VPN Servers
Each VPN server will run cloudflared to:
1. Secure ingress traffic
2. Provide DDoS protection
3. Enable Zero Trust access
4. Integrate with WARP client

### Configuration Template
```yaml
# VPN Server Tunnel Config
tunnel: conservertive-vpn-[region]
credentials-file: /etc/cloudflared/[tunnel-id].json

ingress:
  # OpenVPN Server
  - hostname: openvpn-[region].conservertive.com
    service: tcp://localhost:1194
    originRequest:
      proxyType: tcp
  
  # WireGuard Server
  - hostname: wireguard-[region].conservertive.com
    service: udp://localhost:51820
    originRequest:
      proxyType: udp
  
  # IKEv2 Server
  - hostname: ikev2-[region].conservertive.com
    service: udp://localhost:500
    originRequest:
      proxyType: udp
  
  # Management Interface
  - hostname: manage-[region].conservertive.com
    service: http://localhost:8080
    originRequest:
      httpHostHeader: manage-[region].conservertive.com
```

## Development Commands

### Start Development Environment
```bash
# Terminal 1: Start backend
npm run nx serve backend

# Terminal 2: Start frontend
npm run nx serve frontend

# Terminal 3: Start Cloudflare tunnel
cloudflared tunnel run conservertive-dev
```

### Test VPN Server (Development)
```bash
# Start VPN server simulation
npm run nx serve vpn-server

# Start VPN server tunnel
cloudflared tunnel run conservertive-vpn-dev
```

## Security Features

### Zero Trust Access
- Device enrollment required
- Multi-factor authentication
- Location-based access policies
- Time-based access controls

### Tunnel Security
- mTLS authentication
- IP allowlists
- Rate limiting
- DDoS protection

### VPN Client Integration
- WARP client integration
- Automatic tunnel selection
- Failover between regions
- Performance optimization

## Monitoring and Analytics

### Cloudflare Analytics
- Tunnel performance metrics
- Traffic analysis
- Security event monitoring
- DDoS attack detection

### Custom Metrics
- VPN connection statistics
- User activity tracking
- Server performance monitoring
- Sponsorship impact metrics

## Next Steps

1. **Authenticate with Cloudflare**: `cloudflared tunnel login`
2. **Create development tunnel**: `cloudflared tunnel create conservertive-dev`
3. **Configure DNS records** in Cloudflare dashboard
4. **Start development tunnel**: `cloudflared tunnel run conservertive-dev`
5. **Test backend/frontend** through tunnel URLs
6. **Set up Zero Trust** policies for admin access
7. **Configure VPN server** tunnels for production

## Troubleshooting

### Common Issues
- **Tunnel not connecting**: Check credentials file path
- **DNS not resolving**: Verify CNAME records
- **Service not accessible**: Check local service is running
- **Authentication failed**: Re-run `cloudflared tunnel login`

### Debug Commands
```bash
# Check tunnel status
cloudflared tunnel list

# View tunnel logs
cloudflared tunnel run conservertive-dev --loglevel debug

# Test tunnel connectivity
cloudflared tunnel ingress validate
```
