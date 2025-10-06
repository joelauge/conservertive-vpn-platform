#!/bin/bash

# Clerk Production Keys Setup Script
echo "🔐 Setting up Clerk Production Keys for ConSERVERtive VPN"
echo "=================================================="

# Check if .env.local exists
if [ ! -f "apps/frontend/.env.local" ]; then
    echo "❌ Environment file not found. Creating..."
    touch apps/frontend/.env.local
fi

echo ""
echo "📋 Please provide your Clerk production keys:"
echo ""

# Get production publishable key
read -p "🔑 Enter your Clerk Production Publishable Key (pk_live_...): " CLERK_PUBLISHABLE_KEY

# Get production secret key
read -p "🔐 Enter your Clerk Production Secret Key (sk_live_...): " CLERK_SECRET_KEY

# Validate keys
if [[ $CLERK_PUBLISHABLE_KEY != pk_live_* ]]; then
    echo "❌ Invalid publishable key format. Should start with 'pk_live_'"
    exit 1
fi

if [[ $CLERK_SECRET_KEY != sk_live_* ]]; then
    echo "❌ Invalid secret key format. Should start with 'sk_live_'"
    exit 1
fi

# Create environment file
cat > apps/frontend/.env.local << EOF
# Clerk Authentication - PRODUCTION KEYS
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=$CLERK_PUBLISHABLE_KEY
CLERK_SECRET_KEY=$CLERK_SECRET_KEY

# Clerk URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
EOF

echo ""
echo "✅ Production keys configured successfully!"
echo ""
echo "📝 Next steps:"
echo "1. Update Vercel environment variables with these keys"
echo "2. Configure Clerk domains for conservertive.co"
echo "3. Test the authentication flow"
echo "4. Deploy to production"
echo ""
echo "🚀 Ready to deploy with production authentication!"


