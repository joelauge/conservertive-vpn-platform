# VPN Server Infrastructure Setup

## Option 1: Oracle Cloud (Recommended - Free Tier)
1. Sign up for Oracle Cloud Free Tier
2. Create VM instances in multiple regions
3. Install OpenVPN/WireGuard servers
4. Configure load balancing

## Option 2: AWS EC2
1. Launch EC2 instances
2. Use VPN marketplace AMIs
3. Configure security groups
4. Set up auto-scaling

## Option 3: DigitalOcean Droplets
1. Create droplets in multiple regions
2. Install VPN software
3. Configure monitoring
4. Set up backups

## VPN Server Configuration
```bash
# Install OpenVPN
sudo apt update
sudo apt install openvpn easy-rsa

# Install WireGuard
sudo apt install wireguard

# Configure firewall
sudo ufw allow 1194/udp  # OpenVPN
sudo ufw allow 51820/udp # WireGuard
sudo ufw allow 500/udp   # IKEv2
sudo ufw allow 4500/udp  # IKEv2 NAT-T
```

## Server Management Script
```bash
#!/bin/bash
# vpn-server-setup.sh

# Update system
apt update && apt upgrade -y

# Install VPN software
apt install -y openvpn wireguard iptables-persistent

# Configure firewall
ufw allow ssh
ufw allow 1194/udp
ufw allow 51820/udp
ufw allow 500/udp
ufw allow 4500/udp
ufw --force enable

# Enable IP forwarding
echo 'net.ipv4.ip_forward = 1' >> /etc/sysctl.conf
sysctl -p

# Start services
systemctl enable openvpn
systemctl enable wg-quick@wg0
systemctl start openvpn
systemctl start wg-quick@wg0
```
