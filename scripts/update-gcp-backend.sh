#!/bin/bash

# ConSERVERtive VPN - GCP Backend Update Script
# This script updates the backend on the GCP VM with the latest code

set -e

echo "🚀 Updating ConSERVERtive GCP Backend..."

# Configuration
GCP_INSTANCE="conservertive-backend"
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
    
    echo '📥 Pulling latest code from GitHub...'
    cd ${REPO_PATH}
    git pull origin main
    
    echo '📦 Installing dependencies...'
    cd apps/backend
    npm install
    
    echo '🔨 Building application...'
    npm run build
    
    echo '🔄 Restarting backend service...'
    sudo systemctl restart conservertive-backend
    
    echo '✅ Backend updated successfully!'
    
    echo '🏥 Checking service health...'
    sleep 5
    sudo systemctl status conservertive-backend --no-pager
"

echo ""
echo -e "${GREEN}✅ GCP Backend update complete!${NC}"
echo ""
echo "🌐 Backend URL: http://34.66.19.167:3001"
echo "🏥 Health check: http://34.66.19.167:3001/health"
echo ""
echo "To verify the update:"
echo "  curl http://34.66.19.167:3001/health"

