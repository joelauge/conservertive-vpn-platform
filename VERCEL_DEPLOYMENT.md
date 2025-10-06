# Frontend Production Deployment

## Step 1: Vercel Deployment
1. Go to https://vercel.com
2. Sign up with GitHub
3. Import your ConSERVERtive repository
4. Set root directory to `apps/frontend`

## Step 2: Environment Variables
Add these in Vercel dashboard:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_Y2xlcmsuY29uc2VydmVrtive.co$
CLERK_SECRET_KEY=sk_live_your_clerk_secret_key

# Backend API
NEXT_PUBLIC_API_URL=https://your-backend.railway.app
BACKEND_URL=https://your-backend.railway.app

# App Configuration
NEXT_PUBLIC_APP_URL=https://conservertive.co
```

## Step 3: Domain Configuration
1. In Vercel dashboard, go to "Domains"
2. Add your custom domain: `conservertive.co`
3. Configure DNS records as instructed
4. Enable SSL certificate

## Step 4: Build Configuration
Vercel will automatically detect Next.js and build the app.
No additional configuration needed.
