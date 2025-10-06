#!/bin/bash

# Quick Clerk Development App Setup
echo "🔐 Creating a new Clerk Development App for ConSERVERtive VPN"
echo "============================================================"

echo ""
echo "📋 Follow these steps to create a development-only Clerk app:"
echo ""
echo "1. Go to https://dashboard.clerk.com/"
echo "2. Click 'Add application' (or the + button)"
echo "3. Fill in the details:"
echo "   - Application name: 'ConSERVERtive VPN - Development'"
echo "   - Application URL: 'http://localhost:3000'"
echo "   - Sign-in URL: '/sign-in'"
echo "   - Sign-up URL: '/sign-up'"
echo "   - After sign-in URL: '/dashboard'"
echo "   - After sign-up URL: '/dashboard'"
echo ""
echo "4. Once created, go to 'API Keys' and copy:"
echo "   - Publishable key (starts with pk_test_)"
echo "   - Secret key (starts with sk_test_)"
echo ""
echo "5. Run this command to update your environment:"
echo "   ./scripts/setup-clerk-dev.sh"
echo ""
echo "6. Restart your development server:"
echo "   cd apps/frontend && npm run dev"
echo ""

# Check if we can extract the domain from the current key
CURRENT_KEY=$(grep "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY" apps/frontend/.env.local | cut -d'=' -f2)
if [[ $CURRENT_KEY == pk_test_* ]]; then
    echo "🔍 Current key analysis:"
    echo "   Key: $CURRENT_KEY"
    echo "   This appears to be a TEST key, which is correct for development"
    echo "   However, the app might be configured for production domains"
    echo ""
    echo "💡 Recommendation: Create a new development app as shown above"
    echo "   This will ensure localhost:3000 is properly configured"
fi
