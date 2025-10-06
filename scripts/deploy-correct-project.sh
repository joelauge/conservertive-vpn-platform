#!/bin/bash

# ConSERVERtive Frontend - Correct Project Deployment Script
echo "🚀 Deploying ConSERVERtive Frontend to Correct Vercel Project"
echo "============================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if we're in the frontend directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: Not in the frontend directory${NC}"
    echo "Please run this script from apps/frontend/"
    exit 1
fi

echo -e "${BLUE}📋 Steps to deploy to the correct project:${NC}"
echo ""
echo "1. First, let's unlink from the current project:"
echo "   vercel unlink"
echo ""
echo "2. Then link to the correct project:"
echo "   vercel link --project conservertive-frontend"
echo ""
echo "3. Finally, deploy:"
echo "   vercel --prod"
echo ""

# Check if .vercel directory exists
if [ -d ".vercel" ]; then
    echo -e "${YELLOW}⚠️  Found existing .vercel directory${NC}"
    echo "This might be linked to the wrong project."
    echo ""
    echo "To fix this, run these commands:"
    echo "1. rm -rf .vercel"
    echo "2. vercel link --project conservertive-frontend"
    echo "3. vercel --prod"
else
    echo -e "${GREEN}✅ No existing .vercel directory found${NC}"
    echo "You can proceed with linking to the correct project."
fi

echo ""
echo -e "${BLUE}🔧 Alternative: Manual Vercel Dashboard Method${NC}"
echo "1. Go to https://vercel.com/dashboard"
echo "2. Find your 'conservertive-frontend' project"
echo "3. Go to Settings → Git"
echo "4. Make sure it's connected to the correct repository"
echo "5. Set the Root Directory to 'apps/frontend'"
echo "6. Redeploy from the dashboard"
echo ""
echo -e "${GREEN}🎯 This should deploy to the correct project!${NC}"
