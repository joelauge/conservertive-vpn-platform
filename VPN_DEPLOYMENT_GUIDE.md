# ConSERVERtive VPN Service - Docker Deployment

## Quick Start Deployment

### Option 1: Deploy to DigitalOcean (Recommended for MVP)

1. **Create DigitalOcean Droplet**:
   - Choose Ubuntu 22.04 LTS
   - Minimum 2GB RAM, 1 CPU
   - Add SSH key

2. **Deploy VPN Server**:
   ```bash
   # SSH into your droplet
   ssh root@your-droplet-ip
   
   # Install Docker
   curl -fsSL https://get.docker.com -o get-docker.sh
   sh get-docker.sh
   
   # Clone the repository
   git clone https://github.com/joelauge/conservertive-vpn-platform.git
   cd conservertive-vpn-platform
   
   # Deploy VPN server
   cd apps/infrastructure/docker
   docker-compose up -d
   ```

3. **Configure Firewall**:
   ```bash
   # Allow VPN ports
   ufw allow 1194/udp  # OpenVPN
   ufw allow 51820/udp # WireGuard
   ufw allow 500/udp  # IKEv2
   ufw allow 4500/udp # IKEv2
   ufw allow 8080/tcp # Management API
   ```

### Option 2: Deploy to AWS EC2

1. **Launch EC2 Instance**:
   - Choose Ubuntu 22.04 LTS AMI
   - Instance type: t3.medium or larger
   - Configure security group to allow VPN ports

2. **Deploy using Terraform**:
   ```bash
   cd apps/infrastructure/terraform
   terraform init
   terraform plan
   terraform apply
   ```

### Option 3: Deploy to Google Cloud

1. **Create Compute Engine Instance**:
   - Choose Ubuntu 22.04 LTS
   - Machine type: e2-medium or larger
   - Allow HTTP/HTTPS traffic

2. **Deploy VPN Server**:
   ```bash
   # SSH into instance
   gcloud compute ssh your-instance-name --zone=your-zone
   
   # Follow Docker deployment steps above
   ```

## Production Considerations

### Security
- Use strong SSH keys
- Enable firewall (UFW)
- Regular security updates
- Monitor logs

### Performance
- Use SSD storage
- Adequate RAM (2GB+)
- Monitor CPU usage
- Load balancing for multiple servers

### Monitoring
- Set up health checks
- Monitor VPN connections
- Log analysis
- Alert system

## Testing VPN Connection

1. **Check server status**:
   ```bash
   curl http://your-server-ip:8080/health
   ```

2. **Download client config**:
   ```bash
   curl http://your-server-ip:8080/clients/user123/config/openvpn
   ```

3. **Test connection**:
   - Use OpenVPN client
   - Import configuration file
   - Connect and verify IP change
