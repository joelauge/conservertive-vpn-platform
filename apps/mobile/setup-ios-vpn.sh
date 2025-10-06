#!/bin/bash

echo "🔐 Setting up ConSERVERtive VPN iOS App with Native VPN Integration"

# Navigate to mobile app directory
cd apps/mobile

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Install iOS dependencies
echo "🍎 Installing iOS dependencies..."
cd ios
pod install
cd ..

# Create iOS build
echo "🏗️ Building iOS app..."
npx react-native run-ios --simulator="iPhone 15 Pro"

echo "✅ iOS app setup complete!"
echo ""
echo "📱 To test the real VPN functionality:"
echo "1. Open the app on your iOS device"
echo "2. Tap 'Connect VPN'"
echo "3. iOS will prompt you to install the VPN configuration"
echo "4. Accept the configuration"
echo "5. The VPN icon should appear in your status bar!"
echo ""
echo "🔐 The app now uses Apple's Network Extension framework for real VPN connections."





