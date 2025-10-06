# Production VPN Infrastructure Enhancement

## Current State
- ✅ Multi-protocol VPN servers running
- ✅ OpenVPN, WireGuard, IKEv2 support
- ✅ Docker-based deployment
- ✅ Management API operational

## Production Enhancements

### 1. Load Balancing & High Availability
```yaml
# docker-compose.prod.yml
version: '3.8'
services:
  nginx-lb:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - vpn-server-1
      - vpn-server-2
      - vpn-server-3

  vpn-server-1:
    image: conservertive-vpn-server
    environment:
      - SERVER_ID=us-east-1
      - REGION=us-east
      - CAPACITY=1000
    deploy:
      replicas: 1
      resources:
        limits:
          memory: 2G
          cpus: '1'

  vpn-server-2:
    image: conservertive-vpn-server
    environment:
      - SERVER_ID=eu-west-1
      - REGION=eu-west
      - CAPACITY=1000
    deploy:
      replicas: 1

  vpn-server-3:
    image: conservertive-vpn-server
    environment:
      - SERVER_ID=ap-southeast-1
      - REGION=ap-southeast
      - CAPACITY=1000
    deploy:
      replicas: 1
```

### 2. Nginx Load Balancer Configuration
```nginx
# nginx.conf
upstream vpn_servers {
    least_conn;
    server vpn-server-1:8080 max_fails=3 fail_timeout=30s;
    server vpn-server-2:8080 max_fails=3 fail_timeout=30s;
    server vpn-server-3:8080 max_fails=3 fail_timeout=30s;
}

server {
    listen 80;
    listen 443 ssl http2;
    
    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;
    
    location / {
        proxy_pass http://vpn_servers;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Health check
        proxy_next_upstream error timeout invalid_header http_500 http_502 http_503 http_504;
    }
    
    # Health check endpoint
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}
```

### 3. Auto-Scaling Configuration
```yaml
# kubernetes-hpa.yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: vpn-server-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: vpn-server
  minReplicas: 3
  maxReplicas: 20
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
```

### 4. Geographic Load Balancing
```typescript
// VPN server selection algorithm
@Injectable()
export class VpnServerSelectionService {
  async selectOptimalServer(userLocation: string, protocol: string): Promise<VpnServer> {
    const servers = await this.getAllServers();
    
    // Filter by protocol support
    const protocolServers = servers.filter(s => 
      s.protocols.includes(protocol) && s.status === 'active'
    );
    
    // Calculate latency and load
    const scoredServers = await Promise.all(
      protocolServers.map(async (server) => {
        const latency = await this.measureLatency(server, userLocation);
        const loadScore = server.currentConnections / server.maxConnections;
        
        return {
          ...server,
          score: this.calculateScore(latency, loadScore, userLocation),
        };
      })
    );
    
    // Return best server
    return scoredServers.sort((a, b) => b.score - a.score)[0];
  }
  
  private calculateScore(latency: number, load: number, userLocation: string): number {
    // Weighted scoring algorithm
    const latencyWeight = 0.4;
    const loadWeight = 0.3;
    const proximityWeight = 0.3;
    
    const latencyScore = Math.max(0, 100 - latency);
    const loadScore = Math.max(0, 100 - (load * 100));
    const proximityScore = this.calculateProximityScore(userLocation);
    
    return (latencyScore * latencyWeight) + 
           (loadScore * loadWeight) + 
           (proximityScore * proximityWeight);
  }
}
```

### 5. Monitoring & Alerting
```typescript
// VPN server monitoring
@Injectable()
export class VpnMonitoringService {
  private readonly logger = new Logger(VpnMonitoringService.name);
  
  @Cron('*/30 * * * * *')
  async monitorServers() {
    const servers = await this.getAllServers();
    
    for (const server of servers) {
      const health = await this.checkServerHealth(server);
      
      if (!health.isHealthy) {
        await this.sendAlert({
          type: 'server_down',
          server: server.id,
          region: server.region,
          error: health.error,
          timestamp: new Date(),
        });
      }
      
      // Check capacity
      if (server.currentConnections > server.maxConnections * 0.9) {
        await this.sendAlert({
          type: 'high_capacity',
          server: server.id,
          currentConnections: server.currentConnections,
          maxConnections: server.maxConnections,
          utilization: (server.currentConnections / server.maxConnections) * 100,
        });
      }
    }
  }
  
  private async checkServerHealth(server: VpnServer): Promise<HealthCheck> {
    try {
      const response = await fetch(`https://${server.hostname}/health`, {
        timeout: 5000,
      });
      
      return {
        isHealthy: response.ok,
        responseTime: response.headers.get('x-response-time'),
        error: response.ok ? null : `HTTP ${response.status}`,
      };
    } catch (error) {
      return {
        isHealthy: false,
        error: error.message,
      };
    }
  }
}
```

### 6. Security Hardening
```bash
#!/bin/bash
# vpn-server-hardening.sh

# Update system
apt update && apt upgrade -y

# Install security tools
apt install -y fail2ban ufw unattended-upgrades

# Configure firewall
ufw default deny incoming
ufw default allow outgoing
ufw allow ssh
ufw allow 1194/udp  # OpenVPN
ufw allow 51820/udp # WireGuard
ufw allow 500/udp   # IKEv2
ufw allow 4500/udp  # IKEv2 NAT-T
ufw allow 8080/tcp  # Management API
ufw --force enable

# Configure fail2ban
cat > /etc/fail2ban/jail.local << EOF
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 3

[sshd]
enabled = true
port = ssh
logpath = /var/log/auth.log

[nginx-http-auth]
enabled = true
port = http,https
logpath = /var/log/nginx/error.log
EOF

systemctl enable fail2ban
systemctl start fail2ban

# Configure automatic updates
cat > /etc/apt/apt.conf.d/50unattended-upgrades << EOF
Unattended-Upgrade::Allowed-Origins {
    "\${distro_id}:\${distro_codename}-security";
    "\${distro_id}ESMApps:\${distro_codename}-apps-security";
    "\${distro_id}ESM:\${distro_codename}-infra-security";
};
Unattended-Upgrade::AutoFixInterruptedDpkg "true";
Unattended-Upgrade::MinimalSteps "true";
Unattended-Upgrade::Remove-Unused-Dependencies "true";
Unattended-Upgrade::Automatic-Reboot "false";
EOF

systemctl enable unattended-upgrades
systemctl start unattended-upgrades

# Set up log rotation
cat > /etc/logrotate.d/vpn-server << EOF
/var/log/vpn-server/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 vpn vpn
    postrotate
        systemctl reload vpn-server
    endscript
}
EOF

# Configure system limits
cat >> /etc/security/limits.conf << EOF
* soft nofile 65536
* hard nofile 65536
* soft nproc 32768
* hard nproc 32768
EOF

# Enable IP forwarding
echo 'net.ipv4.ip_forward = 1' >> /etc/sysctl.conf
echo 'net.ipv6.conf.all.forwarding = 1' >> /etc/sysctl.conf
sysctl -p

echo "VPN server hardening completed!"
```

### 7. Backup & Disaster Recovery
```bash
#!/bin/bash
# vpn-backup.sh

BACKUP_DIR="/backups/vpn-servers"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup VPN configurations
tar -czf $BACKUP_DIR/vpn-configs_$DATE.tar.gz \
    /etc/openvpn \
    /etc/wireguard \
    /etc/ipsec.d \
    /etc/strongswan

# Backup certificates
tar -czf $BACKUP_DIR/certificates_$DATE.tar.gz \
    /etc/ssl/certs \
    /etc/ssl/private

# Backup database (if local)
if [ -f /var/lib/postgresql/data/PG_VERSION ]; then
    pg_dumpall > $BACKUP_DIR/postgres_$DATE.sql
fi

# Upload to cloud storage
gsutil cp $BACKUP_DIR/*_$DATE.* gs://conservertive-vpn-backups/

# Cleanup old backups (keep 30 days)
find $BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete
find $BACKUP_DIR -name "*.sql" -mtime +30 -delete

echo "Backup completed: $DATE"
```

## Production Deployment Commands

### 1. Deploy VPN Infrastructure
```bash
# Deploy to Google Cloud
gcloud compute instances create vpn-server-1 \
    --image-family=ubuntu-2204-lts \
    --image-project=ubuntu-os-cloud \
    --machine-type=e2-standard-2 \
    --zone=us-central1-a \
    --tags=vpn-server \
    --metadata-from-file startup-script=startup-script.sh

# Deploy load balancer
gcloud compute forwarding-rules create vpn-lb \
    --global \
    --target-http-proxy=vpn-proxy \
    --ports=80,443

# Configure SSL certificate
gcloud compute ssl-certificates create vpn-ssl-cert \
    --domains=vpn.conservertive.co \
    --global
```

### 2. Monitor Deployment
```bash
# Check server status
curl https://vpn.conservertive.co/health

# Check load balancer
curl https://vpn.conservertive.co/status

# Test VPN protocols
curl https://vpn.conservertive.co/protocols
```

## Performance Targets
- **Server Uptime**: > 99.9%
- **Connection Latency**: < 50ms (same region)
- **Throughput**: > 1Gbps per server
- **Concurrent Connections**: 1000+ per server
- **Failover Time**: < 30 seconds
- **Certificate Validity**: Auto-renewal
