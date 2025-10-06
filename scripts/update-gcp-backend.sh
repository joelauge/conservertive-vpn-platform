#!/bin/bash

# ConSERVERtive VPN - GCP Backend Update Script
# This script updates the backend on the GCP VM with the latest code

set -e

echo "🚀 Updating ConSERVERtive GCP Backend..."

# Configuration
GCP_INSTANCE="conservertive-backend-api"
GCP_ZONE="us-central1-a"
REPO_PATH="conservertive-vpn-platform"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo "📡 Connecting to GCP instance..."

# Execute commands on GCP instance
gcloud compute ssh ${GCP_INSTANCE} --zone=${GCP_ZONE} --command="
    set -e
    
    echo '📥 Cloning repository from GitHub...'
    if [ ! -d ${REPO_PATH} ]; then
        git clone https://github.com/joelauge/conservertive-vpn-platform.git
    else
        echo '📥 Pulling latest code from GitHub...'
        cd ${REPO_PATH}
        git pull origin main
    fi
    
    echo '🔄 Checking Node.js version...'
    if ! command -v node &> /dev/null || ! node --version | grep -q "v18"; then
        echo '🔄 Installing Node.js 18...'
        curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
        sudo apt-get install -y nodejs
    else
        echo '✅ Node.js 18 already installed'
    fi
    
    echo '📦 Installing dependencies...'
    cd /home/jauge/${REPO_PATH}/apps/backend
    npm install
    
    echo '🔨 Building application...'
    npm run build
    
    echo '🔄 Stopping existing backend...'
    sudo pkill -f 'node server.js' || true
    sleep 2
    
    echo '🔄 Starting backend service...'
    cd /home/jauge/${REPO_PATH}/apps/backend
    nohup node dist/main.prod.js > backend.log 2>&1 &
    
    echo '✅ Backend updated successfully!'
    
    echo '🏥 Checking service health...'
    sleep 5
    ps aux | grep 'node dist/main.prod.js' | grep -v grep
"

echo ""
echo -e "${GREEN}✅ GCP Backend update complete!${NC}"
echo ""
echo "🌐 Backend URL: http://34.66.19.167:3001"
echo "🏥 Health check: http://34.66.19.167:3001/health"
echo ""
echo "To verify the update:"
echo "  curl http://34.66.19.167:3001/health"

