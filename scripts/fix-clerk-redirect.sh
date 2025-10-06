#!/bin/bash

# Clerk Development Setup Script
echo "🔐 Setting up Clerk Development Environment for ConSERVERtive VPN"
echo "============================================================="

echo ""
echo "📋 To fix the redirect URL error, you have two options:"
echo ""
echo "Option 1: Update existing Clerk app (Recommended)"
echo "1. Go to https://dashboard.clerk.com/"
echo "2. Select your application"
echo "3. Go to 'Paths' in the sidebar"
echo "4. Add these URLs to 'Allowed redirect URLs':"
echo "   - http://localhost:3000"
echo "   - http://localhost:3000/"
echo "   - http://localhost:3000/sign-in"
echo "   - http://localhost:3000/sign-up"
echo "   - http://localhost:3000/dashboard"
echo ""
echo "Option 2: Create a separate development app"
echo "1. Go to https://dashboard.clerk.com/"
echo "2. Click 'Add application'"
echo "3. Name it 'ConSERVERtive VPN - Development'"
echo "4. Use 'http://localhost:3000' as the application URL"
echo "5. Copy the TEST keys to your .env.local file"
echo ""

# Check current environment
if [ -f "apps/frontend/.env.local" ]; then
    echo "Current environment configuration:"
    echo "================================="
    grep "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY" apps/frontend/.env.local | head -1
    grep "CLERK_SECRET_KEY" apps/frontend/.env.local | head -1
    echo ""
fi

echo "🔧 Quick Fix Commands:"
echo "====================="
echo "1. Update Clerk dashboard with localhost URLs (see above)"
echo "2. Restart your development server:"
echo "   cd apps/frontend && npm run dev"
echo ""
echo "3. Or create new development app and update keys:"
echo "   ./scripts/setup-clerk-dev.sh"
