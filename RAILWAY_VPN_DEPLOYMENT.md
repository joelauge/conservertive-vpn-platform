# Railway VPN Server Deployment Guide

## Why Railway for VPN Servers?
- **$5/month credit** covers small VPN servers
- **Docker support** - perfect for our VPN container
- **Global deployment** - multiple regions available
- **Automatic SSL** certificates
- **Custom domains** support

## Step 1: Install Railway CLI
```bash
npm install -g @railway/cli
```

## Step 2: Login to Railway
```bash
railway login
```

## Step 3: Create New Project
```bash
railway init conservertive-vpn-servers
```

## Step 4: Deploy VPN Server
```bash
# Navigate to VPN server directory
cd apps/infrastructure/docker

# Deploy to Railway
railway up
```

## Step 5: Configure Environment Variables
In Railway dashboard, set:
- `VPN_SERVER_NAME`: conservertive-vpn-server
- `VPN_SERVER_REGION`: us-east-1
- `VPN_SERVER_PROTOCOLS`: openvpn,wireguard,ikev2

## Step 6: Get Deployment URL
Railway will provide a URL like: `https://conservertive-vpn-servers-production.up.railway.app`

## Step 7: Configure Domain
- Add subdomain: `vpn.conservertive.co`
- Point to Railway deployment URL

## Cost: $0/month (covered by $5 credit)
- Railway: $5 credit covers small VPN server
- Total: $0/month

## Benefits over Oracle Cloud:
- ✅ **Immediate availability** (no capacity issues)
- ✅ **Easier deployment** (Docker-based)
- ✅ **Better monitoring** (Railway dashboard)
- ✅ **Automatic scaling** (if needed)
- ✅ **SSL certificates** (automatic)


