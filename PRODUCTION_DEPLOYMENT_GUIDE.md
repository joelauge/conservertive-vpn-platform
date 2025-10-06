# ConSERVERtive VPN - Production Deployment Guide

This guide will help you deploy ConSERVERtive VPN to production using Railway (backend) and Vercel (frontend).

## Prerequisites

- Railway CLI installed (`npm install -g @railway/cli`)
- Vercel CLI installed (`npm install -g vercel`)
- Production Stripe keys configured
- Production Clerk keys configured

## Backend Deployment (Railway)

### 1. Login to Railway
```bash
cd apps/backend
railway login
```

### 2. Create New Project
```bash
railway new
# Choose a project name like "conservertive-backend"
```

### 3. Add PostgreSQL Database
```bash
railway add postgresql
```

### 4. Set Environment Variables
In the Railway dashboard, add these environment variables:

**Required Variables:**
- `NODE_ENV=production`
- `STRIPE_SECRET_KEY=sk_live_your_live_stripe_secret_key`
- `JWT_SECRET=your-super-secret-jwt-key-change-this-in-production`
- `FRONTEND_URL=https://conservertive.co`
- `BACKEND_URL=https://your-railway-app-url.railway.app`

**Database Variables (Auto-provided by Railway):**
- `DB_HOST` (auto-provided)
- `DB_PORT` (auto-provided)
- `DB_USERNAME` (auto-provided)
- `DB_PASSWORD` (auto-provided)
- `DB_NAME` (auto-provided)

### 5. Deploy Backend
```bash
railway up
```

### 6. Get Backend URL
After deployment, Railway will provide a URL like:
`https://conservertive-backend-production.railway.app`

**Important:** Update your `BACKEND_URL` environment variable in Railway with this URL.

## Frontend Deployment (Vercel)

### 1. Login to Vercel
```bash
cd apps/frontend
vercel login
```

### 2. Deploy Frontend
```bash
vercel --prod
```

### 3. Set Environment Variables
In the Vercel dashboard, add these environment variables:

**Required Variables:**
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_your_live_clerk_publishable_key`
- `CLERK_SECRET_KEY=sk_live_your_live_clerk_secret_key`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_live_stripe_publishable_key`
- `STRIPE_SECRET_KEY=sk_live_your_live_stripe_secret_key`
- `BACKEND_URL=https://your-railway-app-url.railway.app`
- `NEXT_PUBLIC_BACKEND_URL=https://your-railway-app-url.railway.app`

### 4. Configure Custom Domain
In Vercel dashboard:
1. Go to your project settings
2. Navigate to "Domains"
3. Add your custom domain: `conservertive.co`
4. Configure DNS records as instructed by Vercel

## Post-Deployment Configuration

### 1. Update Clerk Configuration
In your Clerk dashboard:
1. Go to "Domains & URLs"
2. Add your production domain: `https://conservertive.co`
3. Update redirect URLs for sign-in/sign-up

### 2. Update Stripe Configuration
In your Stripe dashboard:
1. Go to "Webhooks"
2. Add webhook endpoint: `https://your-railway-app-url.railway.app/api/billing/webhook`
3. Select events: `payment_intent.succeeded`, `customer.subscription.created`, etc.

### 3. Database Migrations
Run database migrations on Railway:
```bash
railway run npm run migration:run
```

## Testing Production Deployment

### 1. Test Backend Health
```bash
curl https://your-railway-app-url.railway.app/health
```

### 2. Test Frontend
Visit your production URL and test:
- [ ] Homepage loads
- [ ] Sign up flow works
- [ ] Payment processing works
- [ ] Dashboard loads
- [ ] VPN credentials generation works

### 3. Test Complete Flow
1. Sign up for a new account
2. Complete onboarding and payment
3. Generate VPN credentials
4. Test mobile app connection

## Monitoring & Maintenance

### 1. Railway Monitoring
- Monitor logs in Railway dashboard
- Set up alerts for errors
- Monitor database performance

### 2. Vercel Monitoring
- Monitor deployments in Vercel dashboard
- Check analytics for performance
- Monitor function execution times

### 3. Database Backups
Railway automatically handles PostgreSQL backups, but consider:
- Setting up additional backup strategies
- Monitoring database size and performance

## Security Checklist

- [ ] All environment variables are set correctly
- [ ] CORS is configured for production domains only
- [ ] Rate limiting is enabled
- [ ] Security headers are configured
- [ ] HTTPS is enforced
- [ ] Database connections are secure
- [ ] API keys are not exposed in client-side code

## Troubleshooting

### Common Issues:

1. **CORS Errors**: Ensure `FRONTEND_URL` is set correctly in Railway
2. **Database Connection**: Check database credentials in Railway
3. **Stripe Webhooks**: Verify webhook URL and events
4. **Clerk Authentication**: Check domain configuration

### Logs:
- Railway logs: `railway logs`
- Vercel logs: Available in dashboard

## Next Steps

After successful deployment:
1. Set up monitoring and alerting
2. Configure CDN for static assets
3. Set up automated backups
4. Plan for scaling as user base grows
5. Consider implementing additional security measures

## Support

For deployment issues:
- Railway documentation: https://docs.railway.app/
- Vercel documentation: https://vercel.com/docs
- Stripe documentation: https://stripe.com/docs
- Clerk documentation: https://clerk.com/docs
