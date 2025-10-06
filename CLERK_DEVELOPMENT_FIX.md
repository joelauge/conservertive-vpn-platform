# 🚨 URGENT: Clerk Development Setup Required

## The Problem
Your current Clerk app (`pk_test_Y2xlcmsuY29uc2VydmVydGl2ZS5jbyQ`) is configured for production domains only and doesn't allow localhost redirects.

## The Solution: Create a New Development App

### Step 1: Create New Clerk App
1. **Go to**: https://dashboard.clerk.com/
2. **Click**: "Add application" (or the + button)
3. **Fill in**:
   - **Application name**: `ConSERVERtive VPN - Development`
   - **Application URL**: `http://localhost:3000`
   - **Sign-in URL**: `/sign-in`
   - **Sign-up URL**: `/sign-up`
   - **After sign-in URL**: `/dashboard`
   - **After sign-up URL**: `/dashboard`

### Step 2: Get New Keys
1. **Go to**: "API Keys" in your new app
2. **Copy**:
   - Publishable key (starts with `pk_test_`)
   - Secret key (starts with `sk_test_`)

### Step 3: Update Environment
Run this command and paste your new keys:
```bash
./scripts/setup-clerk-dev.sh
```

### Step 4: Restart Server
```bash
cd apps/frontend && npm run dev
```

## Alternative: Quick Fix Script

If you want to manually update your current app instead:

1. Go to your existing Clerk app
2. Go to "Paths" → "Allowed redirect URLs"
3. Add these URLs:
   - `http://localhost:3000`
   - `http://127.0.0.1:3000`
   - `http://localhost:3000/`
   - `http://127.0.0.1:3000/`

## Current Status
- ❌ Current app doesn't allow localhost redirects
- ✅ Environment is properly configured for TEST keys
- ✅ Frontend server is running
- 🔄 Need to either update existing app or create new one
