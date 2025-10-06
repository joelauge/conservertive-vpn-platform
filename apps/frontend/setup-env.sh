#!/bin/bash

# ConSERVERtive VPN - Environment Setup Script
# This script creates a .env.local file with placeholder values

echo "🚀 Setting up ConSERVERtive VPN environment..."

# Check if .env.local already exists
if [ -f ".env.local" ]; then
    echo "⚠️  .env.local already exists. Backing up to .env.local.backup"
    cp .env.local .env.local.backup
fi

# Create .env.local with placeholder values
cat > .env.local << 'EOF'
# ConSERVERtive VPN - Local Environment Configuration
# Update these values with your actual keys

# Clerk Authentication (Required for user accounts)
# Get these from: https://dashboard.clerk.com/
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_publishable_key_here
CLERK_SECRET_KEY=sk_test_your_clerk_secret_key_here

# Stripe Payment Processing (Required for subscriptions)
# Get these from: https://dashboard.stripe.com/
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001
# For production: NEXT_PUBLIC_API_URL=https://api.conservertive.co

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
# For production: NEXT_PUBLIC_APP_URL=https://conservertive.co
EOF

echo "✅ Created .env.local with placeholder values"
echo ""
echo "📝 Next steps:"
echo "1. Get Clerk keys from: https://dashboard.clerk.com/"
echo "2. Get Stripe keys from: https://dashboard.stripe.com/"
echo "3. Update the values in .env.local with your actual keys"
echo "4. Restart your development server"
echo ""
echo "🔧 For demo mode, you can use the placeholder values and click 'Continue Without Payment (Demo)'"
