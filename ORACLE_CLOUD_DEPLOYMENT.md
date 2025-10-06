# Oracle Cloud Always Free Deployment Guide

## Oracle Cloud Always Free Resources
- **2 ARM-based VMs** (1/8 OCPU, 1GB RAM each)
- **2 AMD-based VMs** (1/8 OCPU, 1GB RAM each)  
- **100GB block storage**
- **10TB data transfer/month**
- **No time limits** (truly always free)

## Step 1: Create Oracle Cloud Account
1. Go to https://cloud.oracle.com/
2. Sign up for Always Free tier
3. Verify your account (credit card required but not charged)

## Step 2: Create Compute Instance
1. **Navigate to**: Compute → Instances
2. **Create Instance**:
   - Name: `conservertive-vpn-server`
   - Image: Ubuntu 22.04 LTS
   - Shape: VM.Standard.A1.Flex (ARM-based, always free)
   - OCPU: 1
   - Memory: 6GB
   - Boot volume: 50GB

## Step 3: Configure Security Lists
1. **Navigate to**: Networking → Virtual Cloud Networks
2. **Edit Security List**:
   - Add ingress rule: Source 0.0.0.0/0, Port 22 (SSH)
   - Add ingress rule: Source 0.0.0.0/0, Port 1194 (OpenVPN)
   - Add ingress rule: Source 0.0.0.0/0, Port 51820 (WireGuard)
   - Add ingress rule: Source 0.0.0.0/0, Port 500 (IKEv2)
   - Add ingress rule: Source 0.0.0.0/0, Port 4500 (IKEv2)
   - Add ingress rule: Source 0.0.0.0/0, Port 8080 (Management API)

## Step 4: Deploy VPN Server
```bash
# SSH into your instance
ssh opc@your-instance-public-ip

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker opc

# Clone repository
git clone https://github.com/joelauge/conservertive-vpn-platform.git
cd conservertive-vpn-platform/apps/infrastructure/docker

# Deploy VPN server
docker-compose up -d

# Check status
curl http://localhost:8080/health
```

## Step 5: Deploy Backend API to Railway
1. **Connect GitHub** to Railway
2. **Deploy** from your repository
3. **Add PostgreSQL** database
4. **Set environment variables**:
   - `DATABASE_URL`
   - `REDIS_URL`
   - `JWT_SECRET`
   - `STRIPE_SECRET_KEY`

## Step 6: Configure Domain
1. **Add subdomain**: `api.conservertive.co`
2. **Point to Railway** deployment
3. **SSL certificate** automatically provisioned

## Cost: $0/month (Always Free)
- Oracle Cloud: Always free
- Railway: $5 credit covers small API
- Vercel: Free tier for frontend
- Total: $0/month
