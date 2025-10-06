# Environment Configuration Guide

This project uses different environment files for local development and production deployment.

## Environment File Structure

### Frontend (`apps/frontend/`)

- **`.env.local`** - Local development environment (TEST keys)
- **`.env`** - Production environment (LIVE keys)
- **`.env.example`** - Template showing required variables

### Backend (`apps/backend/`)

- **`.env.local`** - Local development environment (TEST keys)
- **`.env`** - Production environment (LIVE keys)

## Local Development Setup

1. **Copy the example file:**
   ```bash
   cp apps/frontend/.env.example apps/frontend/.env.local
   cp apps/backend/.env.example apps/backend/.env.local
   ```

2. **Update with your TEST keys:**
   - Get Clerk TEST keys from: https://dashboard.clerk.com/
   - Get Stripe TEST keys from: https://dashboard.stripe.com/

3. **Start development servers:**
   ```bash
   # Frontend (uses .env.local automatically)
   cd apps/frontend && npm run dev
   
   # Backend (uses .env.local automatically)
   cd apps/backend && npm run start:dev
   ```

## Production Deployment

1. **Update production environment files:**
   - **`.env`** files should contain LIVE keys
   - Update database URLs to production PostgreSQL
   - Update API URLs to production domains

2. **Deploy with production environment:**
   ```bash
   # Frontend deployment (uses .env)
   cd apps/frontend && npm run build && npm start
   
   # Backend deployment (uses .env)
   cd apps/backend && npm run build && npm start
   ```

## Key Differences

| Environment | Clerk Keys | Stripe Keys | Database | API URL |
|-------------|------------|-------------|----------|---------|
| **Local** | `pk_test_...` / `sk_test_...` | `pk_test_...` / `sk_test_...` | SQLite | `http://localhost:3001` |
| **Production** | `pk_live_...` / `sk_live_...` | `pk_live_...` / `sk_live_...` | PostgreSQL | `https://api.conservertive.co` |

## Important Notes

- **Never commit `.env` or `.env.local` files** to version control
- **Always use TEST keys for local development** to avoid charges
- **LIVE keys should only be used in production** environments
- **Next.js automatically loads `.env.local`** for local development
- **Next.js automatically loads `.env`** for production builds

## Troubleshooting

### Clerk Errors
- **"Production Keys are only allowed for domain"** - You're using LIVE keys locally
- **Solution:** Switch to TEST keys in `.env.local`

### Stripe Errors
- **"Invalid API key"** - Wrong key type for environment
- **Solution:** Use TEST keys locally, LIVE keys in production

### API Connection Issues
- **"Failed to connect to localhost"** - Backend not running
- **Solution:** Start backend server with `npm run start:dev`
