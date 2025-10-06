# Railway Deployment Guide for ConSERVERtive VPN

## 🚀 Complete Railway Infrastructure Setup

### What We're Deploying:
1. **VPN Servers** (OpenVPN, WireGuard, IKEv2)
2. **Backend API** (NestJS with Stripe integration)
3. **Databases** (PostgreSQL + Redis)
4. **Custom Domains** (vpn.conservertive.co, api.conservertive.co)

### Cost: $0/month (covered by Railway $5 credit)

---

## Step 1: Login to Railway

```bash
railway login
```

**Follow the browser authentication process.**

---

## Step 2: Deploy VPN Server

```bash
# Navigate to VPN server directory
cd apps/infrastructure/docker

# Create Railway project
railway init conservertive-vpn-server

# Set environment variables
railway variables set \
    VPN_SERVER_NAME="conservertive-vpn-server" \
    VPN_SERVER_REGION="us-east-1" \
    VPN_SERVER_PROTOCOLS="openvpn,wireguard,ikev2" \
    NODE_ENV="production"

# Deploy VPN server
railway up
```

**Note the VPN server URL** (e.g., `https://conservertive-vpn-server-production.up.railway.app`)

---

## Step 3: Deploy Backend API

```bash
# Navigate to backend directory
cd ../../backend

# Create Railway project
railway init conservertive-backend-api

# Add PostgreSQL database
railway add postgresql

# Add Redis database
railway add redis

# Set environment variables
railway variables set \
    NODE_ENV="production" \
    PORT="3001" \
    JWT_SECRET="your-jwt-secret-here" \
    STRIPE_SECRET_KEY="sk_test_your_stripe_secret_key" \
    STRIPE_PUBLISHABLE_KEY="pk_test_your_stripe_publishable_key"

# Deploy backend API
railway up
```

**Note the backend API URL** (e.g., `https://conservertive-backend-api-production.up.railway.app`)

---

## Step 4: Configure Custom Domains

### In Railway Dashboard:

1. **VPN Server Domain:**
   - Go to VPN server project
   - Click "Settings" → "Domains"
   - Add custom domain: `vpn.conservertive.co`
   - Point to Railway deployment URL

2. **Backend API Domain:**
   - Go to backend API project
   - Click "Settings" → "Domains"
   - Add custom domain: `api.conservertive.co`
   - Point to Railway deployment URL

### In GoDaddy DNS:

1. **Add CNAME records:**
   - `vpn` → `conservertive-vpn-server-production.up.railway.app`
   - `api` → `conservertive-backend-api-production.up.railway.app`

---

## Step 5: Test Deployments

```bash
# Test VPN server
curl https://vpn.conservertive.co/health

# Test backend API
curl https://api.conservertive.co/health

# Test VPN protocols
curl https://vpn.conservertive.co/protocols
```

---

## Step 6: Update Frontend Configuration

Update `apps/frontend/next.config.js`:

```javascript
module.exports = {
  env: {
    NEXT_PUBLIC_API_URL: 'https://api.conservertive.co',
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://api.conservertive.co/api/:path*',
      },
    ];
  },
};
```

---

## 🎯 Final Architecture

```
Frontend (Vercel):     https://conservertive.co
Backend API (Railway): https://api.conservertive.co
VPN Servers (Railway): https://vpn.conservertive.co
Database (Railway):    PostgreSQL + Redis
```

---

## 💰 Cost Breakdown

- **Railway**: $5/month credit (covers VPN servers + backend + databases)
- **Vercel**: Free tier (covers frontend)
- **Total**: $0/month

---

## 🔧 Management

### Railway Dashboard:
- Monitor deployments
- View logs
- Manage environment variables
- Scale resources
- View metrics

### Commands:
```bash
# View logs
railway logs

# Scale services
railway scale

# Update deployments
railway up

# View status
railway status
```

---

## 🚀 Benefits of Railway

✅ **Immediate deployment** (no capacity issues)
✅ **Docker support** (perfect for VPN containers)
✅ **Automatic SSL** certificates
✅ **Built-in databases** (PostgreSQL, Redis)
✅ **Custom domains** support
✅ **Global CDN** (fast worldwide)
✅ **Easy scaling** (if needed)
✅ **Monitoring dashboard** (built-in)
✅ **GitHub integration** (automatic deployments)

---

## 📋 Next Steps After Deployment

1. **Test VPN connections** from different locations
2. **Configure Stripe webhooks** for payment processing
3. **Set up monitoring** and alerting
4. **Implement backup** strategies
5. **Add more VPN servers** in different regions
6. **Optimize performance** based on usage


