# Manual Railway Deployment Steps

## 🚀 Step-by-Step Railway Deployment

Since Railway CLI requires interactive mode for linking projects, here's the manual deployment process:

---

## Step 1: Deploy VPN Server

### 1.1 Navigate to VPN Server Directory
```bash
cd apps/infrastructure/docker
```

### 1.2 Link to VPN Server Project
```bash
railway link
# Select: Fan.si's Projects
# Select: conservertive-vpn-server
```

### 1.3 Set Environment Variables
```bash
railway variables --set VPN_SERVER_NAME="conservertive-vpn-server"
railway variables --set VPN_SERVER_REGION="us-east-1"
railway variables --set VPN_SERVER_PROTOCOLS="openvpn,wireguard,ikev2"
railway variables --set NODE_ENV="production"
```

### 1.4 Deploy VPN Server
```bash
railway up
```

### 1.5 Get VPN Server URL
```bash
railway domain
```

---

## Step 2: Deploy Backend API

### 2.1 Navigate to Backend Directory
```bash
cd ../../backend
```

### 2.2 Create Backend Project
```bash
railway init --name conservertive-backend-api
```

### 2.3 Link to Backend Project
```bash
railway link
# Select: Fan.si's Projects
# Select: conservertive-backend-api
```

### 2.4 Add Databases
```bash
railway add postgresql
railway add redis
```

### 2.5 Set Environment Variables
```bash
railway variables --set NODE_ENV="production"
railway variables --set PORT="3001"
railway variables --set JWT_SECRET="your-jwt-secret-here"
railway variables --set STRIPE_SECRET_KEY="sk_test_your_stripe_secret_key"
railway variables --set STRIPE_PUBLISHABLE_KEY="pk_test_your_stripe_publishable_key"
```

### 2.6 Deploy Backend API
```bash
railway up
```

### 2.7 Get Backend API URL
```bash
railway domain
```

---

## Step 3: Configure Custom Domains

### 3.1 VPN Server Domain
1. Go to Railway Dashboard
2. Select `conservertive-vpn-server` project
3. Go to Settings → Domains
4. Add custom domain: `vpn.conservertive.co`

### 3.2 Backend API Domain
1. Go to Railway Dashboard
2. Select `conservertive-backend-api` project
3. Go to Settings → Domains
4. Add custom domain: `api.conservertive.co`

---

## Step 4: Update DNS Records

### In GoDaddy DNS Manager:
1. Add CNAME record: `vpn` → `conservertive-vpn-server-production.up.railway.app`
2. Add CNAME record: `api` → `conservertive-backend-api-production.up.railway.app`

---

## Step 5: Test Deployments

```bash
# Test VPN server
curl https://vpn.conservertive.co/health

# Test backend API
curl https://api.conservertive.co/health
```

---

## 🎯 Expected Results

- **VPN Server**: `https://vpn.conservertive.co`
- **Backend API**: `https://api.conservertive.co`
- **Frontend**: `https://conservertive.co` (already deployed)

---

## 💰 Cost: $0/month
- Railway $5 credit covers VPN servers + backend + databases
- Vercel free tier covers frontend
- **Total: $0/month**


