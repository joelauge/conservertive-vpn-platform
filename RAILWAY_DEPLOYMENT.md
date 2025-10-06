# Railway Production Deployment

## Step 1: Create Railway Account
1. Go to https://railway.app
2. Sign up with GitHub
3. Connect your repository

## Step 2: Deploy Backend
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose your ConSERVERtive repository
4. Select `apps/backend` as root directory

## Step 3: Add PostgreSQL Database
1. In your Railway project
2. Click "New" → "Database" → "PostgreSQL"
3. Railway will automatically provide connection variables

## Step 4: Configure Environment Variables
Add these variables in Railway dashboard:

```env
# Database (auto-provided by Railway)
DATABASE_URL=postgresql://...

# Application
NODE_ENV=production
PORT=3001
JWT_SECRET=your-super-secure-jwt-secret-key-change-this

# Frontend URL
FRONTEND_URL=https://conservertive.co

# Stripe (if using payments)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# VPN Configuration
VPN_SERVER_BASE_URL=https://vpn.conservertive.co
VPN_API_KEY=your-vpn-api-key
```

## Step 5: Deploy
1. Railway will automatically build and deploy
2. Check logs for any errors
3. Test the API endpoint: `https://your-app.railway.app/api/health`
