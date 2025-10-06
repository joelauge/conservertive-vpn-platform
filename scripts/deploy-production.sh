#!/bin/bash

# ConSERVERtive Production Deployment Script
echo "🚀 Deploying ConSERVERtive VPN to Production"
echo "============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "apps/frontend/package.json" ]; then
    echo -e "${RED}❌ Error: Not in the project root directory${NC}"
    echo "Please run this script from the ConSERVERtive project root"
    exit 1
fi

# Check if production environment is configured
if [ ! -f "apps/frontend/.env" ]; then
    echo -e "${RED}❌ Error: Production environment file not found${NC}"
    echo "Please ensure apps/frontend/.env exists with LIVE keys"
    exit 1
fi

echo -e "${BLUE}📋 Pre-deployment checks:${NC}"
echo "✅ Project structure verified"
echo "✅ Production environment file exists"

# Check if LIVE keys are configured
if grep -q "pk_live_" apps/frontend/.env; then
    echo "✅ LIVE Clerk keys detected"
else
    echo -e "${RED}❌ No LIVE Clerk keys found in .env${NC}"
    echo "Please update apps/frontend/.env with production keys"
    exit 1
fi

if grep -q "pk_live_" apps/frontend/.env; then
    echo "✅ LIVE Stripe keys detected"
else
    echo -e "${RED}❌ No LIVE Stripe keys found in .env${NC}"
    echo "Please update apps/frontend/.env with production keys"
    exit 1
fi

echo ""
echo -e "${YELLOW}🔧 Building frontend for production...${NC}"
cd apps/frontend

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the application
echo "🏗️ Building application..."
npm run build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Build successful!${NC}"
else
    echo -e "${RED}❌ Build failed!${NC}"
    exit 1
fi

echo ""
echo -e "${YELLOW}🚀 Deploying to Vercel...${NC}"

# Deploy to Vercel
vercel --prod

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}🎉 Deployment successful!${NC}"
    echo "============================================="
    echo -e "${BLUE}Your ConSERVERtive VPN is now live!${NC}"
    echo ""
    echo "📋 Next steps:"
    echo "1. Check your Vercel dashboard for the deployment URL"
    echo "2. Configure your custom domain (conservertive.co) in Vercel"
    echo "3. Update DNS records to point to Vercel"
    echo "4. Test the application thoroughly"
    echo ""
    echo "🔗 Important URLs to verify:"
    echo "- Authentication (Clerk): Should work with LIVE keys"
    echo "- Payment processing (Stripe): Should work with LIVE keys"
    echo "- Sponsorship system: Should be fully functional"
    echo ""
    echo -e "${GREEN}🚀 ConSERVERtive VPN is now live in production!${NC}"
else
    echo -e "${RED}❌ Deployment failed!${NC}"
    echo "Check the error messages above and try again"
    exit 1
fi
