# ConSERVERtive VPN - Deployment Procedures

## 📋 Overview

This document provides step-by-step procedures for deploying, updating, and maintaining the ConSERVERtive VPN infrastructure. All procedures are tested and validated for the current production environment.

**Current Environment**: Google Cloud Platform  
**Last Updated**: October 4, 2025  
**Version**: 1.0.0

---

## 🚀 Initial Deployment

### **Prerequisites**
- Google Cloud Platform account with billing enabled
- Domain name (conservertive.co) with DNS management access
- GitHub repository access
- Stripe account for payment processing
- Cloudflare account for CDN and security

### **Step 1: Google Cloud Setup**

#### **1.1 Create Project**
```bash
# Create new GCP project
gcloud projects create conservertive-vpn --name="ConSERVERtive VPN"

# Set project as default
gcloud config set project conservertive-vpn

# Enable required APIs
gcloud services enable compute.googleapis.com
gcloud services enable sqladmin.googleapis.com
gcloud services enable redis.googleapis.com
```

#### **1.2 Configure Authentication**
```bash
# Create service account
gcloud iam service-accounts create conservertive-deploy \
    --display-name="ConSERVERtive Deployment Account"

# Grant necessary permissions
gcloud projects add-iam-policy-binding conservertive-vpn \
    --member="serviceAccount:conservertive-deploy@conservertive-vpn.iam.gserviceaccount.com" \
    --role="roles/compute.admin"

# Create and download key
gcloud iam service-accounts keys create ~/conservertive-key.json \
    --iam-account=conservertive-deploy@conservertive-vpn.iam.gserviceaccount.com
```

### **Step 2: Backend API Deployment**

#### **2.1 Create Compute Engine Instance**
```bash
# Create VM instance
gcloud compute instances create conservertive-backend \
    --zone=us-central1-a \
    --machine-type=e2-medium \
    --image-family=ubuntu-2204-lts \
    --image-project=ubuntu-os-cloud \
    --boot-disk-size=100GB \
    --boot-disk-type=pd-ssd \
    --tags=http-server,https-server \
    --metadata-from-file startup-script=backend-setup.sh
```

#### **2.2 Configure Firewall Rules**
```bash
# Allow HTTP/HTTPS traffic
gcloud compute firewall-rules create allow-http-https \
    --allow tcp:80,tcp:443,tcp:3001 \
    --source-ranges 0.0.0.0/0 \
    --target-tags http-server,https-server
```

#### **2.3 Deploy Backend Application**
```bash
# SSH into instance
gcloud compute ssh conservertive-backend --zone=us-central1-a

# Install Node.js and dependencies
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone repository
git clone https://github.com/joelauge/conservertive-vpn-platform.git
cd conservertive-vpn-platform/apps/backend

# Install dependencies
npm install

# Build application
npm run build

# Set up environment variables
sudo tee /etc/environment << EOF
NODE_ENV=production
PORT=3001
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=secure_password
DB_NAME=conservative_vpn
REDIS_HOST=localhost
REDIS_PORT=6379
JWT_SECRET=your-super-secure-jwt-secret
STRIPE_SECRET_KEY=sk_live_your_stripe_key
EOF

# Create systemd service
sudo tee /etc/systemd/system/conservertive-backend.service << EOF
[Unit]
Description=ConSERVERtive Backend API
After=network.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/home/ubuntu/conservertive-vpn-platform/apps/backend
ExecStart=/usr/bin/node dist/main.js
Restart=always
RestartSec=10
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOF

# Start service
sudo systemctl daemon-reload
sudo systemctl enable conservertive-backend
sudo systemctl start conservertive-backend
```

### **Step 3: VPN Server Deployment**

#### **3.1 Create VPN Server Instance**
```bash
# Create VPN server instance
gcloud compute instances create conservertive-vpn-server \
    --zone=us-central1-a \
    --machine-type=e2-medium \
    --image-family=ubuntu-2204-lts \
    --image-project=ubuntu-os-cloud \
    --boot-disk-size=100GB \
    --boot-disk-type=pd-ssd \
    --tags=vpn-server \
    --metadata-from-file startup-script=vpn-server-setup.sh
```

#### **3.2 Configure VPN Firewall Rules**
```bash
# Allow VPN traffic
gcloud compute firewall-rules create allow-vpn-traffic \
    --allow udp:1194,udp:51820,udp:500,udp:4500,tcp:8080 \
    --source-ranges 0.0.0.0/0 \
    --target-tags vpn-server
```

#### **3.3 Deploy VPN Services**
```bash
# SSH into VPN server
gcloud compute ssh conservertive-vpn-server --zone=us-central1-a

# Install VPN packages
sudo apt update
sudo apt install -y openvpn wireguard strongswan ufw fail2ban

# Configure OpenVPN
sudo mkdir -p /etc/openvpn
sudo cp /usr/share/doc/openvpn/examples/sample-config-files/server.conf /etc/openvpn/server.conf

# Edit OpenVPN configuration
sudo tee /etc/openvpn/server.conf << EOF
port 1194
proto udp
dev tun
ca ca.crt
cert server.crt
key server.key
dh dh2048.pem
server 10.8.0.0 255.255.255.0
ifconfig-pool-persist ipp.txt
push "redirect-gateway def1 bypass-dhcp"
push "dhcp-option DNS 1.1.1.1"
push "dhcp-option DNS 1.0.0.1"
keepalive 10 120
cipher AES-256-GCM
auth SHA256
comp-lzo
user nobody
group nogroup
persist-key
persist-tun
status /var/log/openvpn-status.log
log-append /var/log/openvpn.log
verb 3
explicit-exit-notify 1
EOF

# Generate certificates
cd /etc/openvpn
sudo openssl req -new -x509 -keyout ca.key -out ca.crt -days 3650 -subj "/CN=ConSERVERtive VPN CA"
sudo openssl req -new -keyout server.key -out server.csr -subj "/CN=conservertive-vpn-server"
sudo openssl x509 -req -in server.csr -CA ca.crt -CAkey ca.key -out server.crt -days 3650
sudo openssl dhparam -out dh2048.pem 2048
sudo openvpn --genkey --secret ta.key

# Configure WireGuard
sudo mkdir -p /etc/wireguard
sudo wg genkey | sudo tee /etc/wireguard/server_private_key | sudo wg pubkey | sudo tee /etc/wireguard/server_public_key

sudo tee /etc/wireguard/wg0.conf << EOF
[Interface]
PrivateKey = $(sudo cat /etc/wireguard/server_private_key)
Address = 10.7.0.1/24
ListenPort = 51820
PostUp = iptables -A FORWARD -i %i -j ACCEPT; iptables -A FORWARD -o %i -j ACCEPT; iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
PostDown = iptables -D FORWARD -i %i -j ACCEPT; iptables -D FORWARD -o %i -j ACCEPT; iptables -t nat -D POSTROUTING -o eth0 -j MASQUERADE
EOF

# Configure firewall
sudo ufw enable
sudo ufw allow 22/tcp
sudo ufw allow 1194/udp
sudo ufw allow 51820/udp
sudo ufw allow 500/udp
sudo ufw allow 4500/udp
sudo ufw allow 8080/tcp

# Enable IP forwarding
echo 'net.ipv4.ip_forward = 1' | sudo tee -a /etc/sysctl.conf
sudo sysctl -p

# Start services
sudo systemctl enable openvpn@server
sudo systemctl start openvpn@server
sudo systemctl enable wg-quick@wg0
sudo systemctl start wg-quick@wg0
```

### **Step 4: Frontend Deployment (Vercel)**

#### **4.1 Connect Repository**
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import GitHub repository
4. Select `apps/frontend` as root directory

#### **4.2 Configure Environment Variables**
```bash
# In Vercel dashboard, add environment variables:
NEXT_PUBLIC_API_URL=https://api.conservertive.co
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_your_clerk_key
CLERK_SECRET_KEY=sk_live_your_clerk_secret
```

#### **4.3 Deploy**
```bash
# Vercel will automatically deploy on push to main branch
git push origin main
```

### **Step 5: DNS Configuration**

#### **5.1 Configure Domain Records**
```bash
# Add DNS records in your domain provider:
# A record: api.conservertive.co -> 34.66.19.167
# A record: vpn.conservertive.co -> 34.56.241.36
# CNAME record: www.conservertive.co -> conservertive.co
```

#### **5.2 SSL Certificate Setup**
```bash
# Install Certbot
sudo apt install certbot

# Generate SSL certificate for API
sudo certbot certonly --standalone -d api.conservertive.co

# Generate SSL certificate for VPN server
sudo certbot certonly --standalone -d vpn.conservertive.co

# Set up auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

---

## 🔄 Update Procedures

### **Backend API Updates**

#### **Step 1: Prepare Update**
```bash
# SSH into backend server
gcloud compute ssh conservertive-backend --zone=us-central1-a

# Create backup
sudo systemctl stop conservertive-backend
sudo cp -r /home/ubuntu/conservertive-vpn-platform /home/ubuntu/conservertive-vpn-platform.backup.$(date +%Y%m%d)
```

#### **Step 2: Deploy Update**
```bash
# Pull latest changes
cd /home/ubuntu/conservertive-vpn-platform
git pull origin main

# Install new dependencies
cd apps/backend
npm install

# Build application
npm run build

# Run database migrations (if any)
npm run migration:run
```

#### **Step 3: Restart Services**
```bash
# Start updated service
sudo systemctl start conservertive-backend

# Verify service is running
sudo systemctl status conservertive-backend

# Check logs
sudo journalctl -u conservertive-backend -f
```

#### **Step 4: Health Check**
```bash
# Test API endpoints
curl http://localhost:3001/health
curl http://localhost:3001/api/v1/status
curl http://localhost:3001/api/v1/vpn/servers
```

### **VPN Server Updates**

#### **Step 1: Prepare Update**
```bash
# SSH into VPN server
gcloud compute ssh conservertive-vpn-server --zone=us-central1-a

# Create backup
sudo cp -r /etc/openvpn /etc/openvpn.backup.$(date +%Y%m%d)
sudo cp -r /etc/wireguard /etc/wireguard.backup.$(date +%Y%m%d)
```

#### **Step 2: Deploy Update**
```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Update VPN configurations (if needed)
# Edit configuration files as required

# Restart services
sudo systemctl restart openvpn@server
sudo systemctl restart wg-quick@wg0
```

#### **Step 3: Verify Services**
```bash
# Check service status
sudo systemctl status openvpn@server
sudo systemctl status wg-quick@wg0

# Test connectivity
ping -c 3 34.56.241.36

# Check logs
sudo tail -f /var/log/openvpn.log
sudo wg show
```

### **Frontend Updates**

#### **Automatic Deployment**
```bash
# Frontend updates are automatic via Vercel
# Simply push to main branch:
git add .
git commit -m "Update frontend"
git push origin main

# Vercel will automatically:
# 1. Build the application
# 2. Run tests
# 3. Deploy to production
# 4. Update DNS if needed
```

---

## 🔧 Maintenance Procedures

### **Daily Maintenance**

#### **Health Checks**
```bash
# Backend API health
curl -s http://34.66.19.167:3001/health | jq '.status'

# VPN server connectivity
ping -c 3 34.56.241.36

# Frontend availability
curl -s https://conservertive.co | grep -o '<title>.*</title>'
```

#### **Log Monitoring**
```bash
# Backend logs
sudo journalctl -u conservertive-backend --since "1 day ago" | grep ERROR

# VPN server logs
sudo tail -n 100 /var/log/openvpn.log | grep ERROR
sudo tail -n 100 /var/log/auth.log | grep "Failed password"
```

### **Weekly Maintenance**

#### **System Updates**
```bash
# Backend server
gcloud compute ssh conservertive-backend --zone=us-central1-a
sudo apt update && sudo apt upgrade -y
sudo systemctl restart conservertive-backend

# VPN server
gcloud compute ssh conservertive-vpn-server --zone=us-central1-a
sudo apt update && sudo apt upgrade -y
sudo systemctl restart openvpn@server
sudo systemctl restart wg-quick@wg0
```

#### **Certificate Monitoring**
```bash
# Check certificate expiration
sudo certbot certificates

# Renew if needed
sudo certbot renew --dry-run
```

### **Monthly Maintenance**

#### **Security Audit**
```bash
# Check for security updates
sudo apt list --upgradable | grep -i security

# Review fail2ban status
sudo fail2ban-client status

# Check firewall rules
sudo ufw status verbose
```

#### **Performance Review**
```bash
# Check system resources
htop
df -h
free -h

# Check network usage
iftop -i eth0

# Review connection counts
ss -tuln | grep -E ':(1194|51820|500|4500)'
```

---

## 🚨 Emergency Procedures

### **Service Outage Response**

#### **Step 1: Assess Situation**
```bash
# Check service status
curl -s http://34.66.19.167:3001/health
ping -c 3 34.56.241.36
curl -s https://conservertive.co

# Check system resources
gcloud compute instances list
```

#### **Step 2: Immediate Response**
```bash
# Restart backend service
gcloud compute ssh conservertive-backend --zone=us-central1-a
sudo systemctl restart conservertive-backend

# Restart VPN services
gcloud compute ssh conservertive-vpn-server --zone=us-central1-a
sudo systemctl restart openvpn@server
sudo systemctl restart wg-quick@wg0
```

#### **Step 3: Rollback if Needed**
```bash
# Rollback backend
sudo systemctl stop conservertive-backend
sudo rm -rf /home/ubuntu/conservertive-vpn-platform
sudo mv /home/ubuntu/conservertive-vpn-platform.backup.YYYYMMDD /home/ubuntu/conservertive-vpn-platform
sudo systemctl start conservertive-backend
```

### **Security Incident Response**

#### **Step 1: Contain Threat**
```bash
# Block suspicious IPs
sudo ufw deny from <suspicious_ip>

# Check fail2ban
sudo fail2ban-client status
sudo fail2ban-client set openvpn banip <suspicious_ip>
```

#### **Step 2: Investigate**
```bash
# Check authentication logs
sudo tail -f /var/log/auth.log

# Check VPN logs
sudo tail -f /var/log/openvpn.log

# Check system logs
sudo journalctl -u conservertive-backend -f
```

#### **Step 3: Remediate**
```bash
# Update passwords
# Rotate certificates
# Apply security patches
# Review firewall rules
```

---

## 📊 Monitoring & Alerting

### **Health Check Scripts**

#### **Backend Health Check**
```bash
#!/bin/bash
# backend-health-check.sh

API_URL="http://34.66.19.167:3001/health"
RESPONSE=$(curl -s $API_URL)
STATUS=$(echo $RESPONSE | jq -r '.status')

if [ "$STATUS" != "healthy" ]; then
    echo "Backend API is not healthy: $RESPONSE"
    # Send alert notification
    exit 1
fi

echo "Backend API is healthy"
exit 0
```

#### **VPN Server Health Check**
```bash
#!/bin/bash
# vpn-health-check.sh

VPN_IP="34.56.241.36"
PING_RESULT=$(ping -c 3 $VPN_IP | grep "packet loss" | awk '{print $6}' | sed 's/%//')

if [ "$PING_RESULT" -gt 0 ]; then
    echo "VPN server is not responding: $PING_RESULT% packet loss"
    # Send alert notification
    exit 1
fi

echo "VPN server is responding"
exit 0
```

### **Automated Monitoring**
```bash
# Set up cron jobs for health checks
crontab -e

# Add these lines:
# */5 * * * * /path/to/backend-health-check.sh
# */5 * * * * /path/to/vpn-health-check.sh
# 0 2 * * * /path/to/backup-script.sh
```

---

## 🔐 Security Procedures

### **Certificate Management**

#### **Certificate Renewal**
```bash
# Check certificate expiration
sudo certbot certificates

# Renew certificates
sudo certbot renew

# Restart services to use new certificates
sudo systemctl restart nginx
sudo systemctl restart openvpn@server
```

#### **Key Rotation**
```bash
# Generate new server keys
sudo wg genkey | sudo tee /etc/wireguard/server_private_key.new | sudo wg pubkey | sudo tee /etc/wireguard/server_public_key.new

# Update configuration
sudo cp /etc/wireguard/server_private_key.new /etc/wireguard/server_private_key
sudo cp /etc/wireguard/server_public_key.new /etc/wireguard/server_public_key

# Restart WireGuard
sudo systemctl restart wg-quick@wg0
```

### **Access Control**

#### **SSH Key Management**
```bash
# Add new SSH key
echo "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAAB..." >> ~/.ssh/authorized_keys

# Remove old SSH key
sed -i '/old-key-fingerprint/d' ~/.ssh/authorized_keys

# Restart SSH service
sudo systemctl restart ssh
```

---

## 📈 Scaling Procedures

### **Horizontal Scaling**

#### **Add New VPN Server**
```bash
# Create new VPN server instance
gcloud compute instances create conservertive-vpn-server-2 \
    --zone=us-central1-b \
    --machine-type=e2-medium \
    --image-family=ubuntu-2204-lts \
    --image-project=ubuntu-os-cloud \
    --boot-disk-size=100GB \
    --boot-disk-type=pd-ssd \
    --tags=vpn-server

# Apply same VPN configuration as primary server
# Update load balancer configuration
# Update DNS records
```

#### **Add New Backend Instance**
```bash
# Create new backend instance
gcloud compute instances create conservertive-backend-2 \
    --zone=us-central1-b \
    --machine-type=e2-medium \
    --image-family=ubuntu-2204-lts \
    --image-project=ubuntu-os-cloud \
    --boot-disk-size=100GB \
    --boot-disk-type=pd-ssd \
    --tags=http-server,https-server

# Deploy backend application
# Configure load balancer
# Update DNS records
```

### **Vertical Scaling**

#### **Upgrade Instance Type**
```bash
# Stop instance
gcloud compute instances stop conservertive-backend --zone=us-central1-a

# Change machine type
gcloud compute instances set-machine-type conservertive-backend \
    --machine-type=e2-standard-4 \
    --zone=us-central1-a

# Start instance
gcloud compute instances start conservertive-backend --zone=us-central1-a
```

---

## 📋 Deployment Checklist

### **Pre-Deployment**
- [ ] Review change log and requirements
- [ ] Test changes in staging environment
- [ ] Create backup of current system
- [ ] Notify team of maintenance window
- [ ] Prepare rollback plan

### **During Deployment**
- [ ] Deploy backend changes
- [ ] Deploy VPN server changes
- [ ] Deploy frontend changes
- [ ] Update DNS records
- [ ] Verify SSL certificates

### **Post-Deployment**
- [ ] Run health checks
- [ ] Test all endpoints
- [ ] Monitor logs for errors
- [ ] Verify user functionality
- [ ] Update documentation

### **Rollback Checklist**
- [ ] Stop new services
- [ ] Restore previous version
- [ ] Restart services
- [ ] Verify functionality
- [ ] Update DNS if needed

---

**These deployment procedures are mandatory for all production changes. Any deviations must be approved by the technical lead and documented with justification.**

*Last Updated: October 4, 2025*  
*Version: 1.0.0*
