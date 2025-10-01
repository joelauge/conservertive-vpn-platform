#!/bin/bash

# ConSERVERtive Cloudflare Development Setup Script
echo "🌐 Setting up Cloudflare development tools for ConSERVERtive VPN..."

# Check if cloudflared is installed
if command -v cloudflared &> /dev/null; then
    echo "✅ cloudflared is installed: $(cloudflared --version)"
else
    echo "❌ cloudflared not found. Installing via Homebrew..."
    brew install cloudflare/cloudflare/cloudflared
fi

# Check if wrangler is available via npx
if npx wrangler --version &> /dev/null; then
    echo "✅ wrangler is available via npx: $(npx wrangler --version)"
else
    echo "⚠️  wrangler requires Node.js 20+. Current version: $(node --version)"
    echo "📝 To use wrangler, please:"
    echo "   1. Install Node.js 20+ using: volta install node@20"
    echo "   2. Or use nvm: nvm install 20 && nvm use 20"
    echo "   3. Then run: npx wrangler --version"
fi

echo ""
echo "🚀 Cloudflare development tools setup complete!"
echo ""
echo "📋 Available commands:"
echo "   • cloudflared tunnel login    - Authenticate with Cloudflare"
echo "   • cloudflared tunnel create   - Create a new tunnel"
echo "   • cloudflared tunnel run      - Run a tunnel"
echo "   • npx wrangler login          - Authenticate Wrangler (requires Node 20+)"
echo "   • npx wrangler whoami         - Check authentication"
echo ""
echo "🔗 Next steps:"
echo "   1. Authenticate with Cloudflare: cloudflared tunnel login"
echo "   2. Create a tunnel for ConSERVERtive: cloudflared tunnel create conservertive-dev"
echo "   3. Configure tunnel routing in Cloudflare dashboard"
echo "   4. Start development tunnel: cloudflared tunnel run conservertive-dev"
