# Manual GCP Backend Deployment Guide

Since the automated script is having SSH connectivity issues, here's how to manually deploy the VPN credentials functionality to your GCP backend:

## Prerequisites
- Access to your GCP instance: `conservertive-backend-api`
- The code has been pushed to GitHub (✅ Done)

## Manual Deployment Steps

### 1. Connect to GCP Instance
```bash
gcloud compute ssh conservertive-backend-api --zone=us-central1-a
```

### 2. Navigate to Project Directory
```bash
cd /home/jauge/conservertive-vpn-platform
```

### 3. Pull Latest Code
```bash
git pull origin main
```

### 4. Navigate to Backend Directory
```bash
cd apps/backend
```

### 5. Install Dependencies
```bash
npm install
```

### 6. Build Application
```bash
npm run build
```

### 7. Stop Existing Backend
```bash
sudo pkill -f 'node server.js'
```

### 8. Start New Backend
```bash
nohup node dist/main.prod.js > backend.log 2>&1 &
```

### 9. Verify Deployment
```bash
# Check if process is running
ps aux | grep 'node dist/main.prod.js'

# Check logs
tail -f backend.log

# Test health endpoint
curl http://localhost:3001/api/health
```

## Expected Results

After deployment, you should have:
- ✅ VPN credentials endpoints: `/api/v1/vpn/credentials`
- ✅ Generate credentials: `POST /api/v1/vpn/credentials/generate`
- ✅ Refresh credentials: `POST /api/v1/vpn/credentials/refresh`
- ✅ Revoke credentials: `DELETE /api/v1/vpn/credentials`

## Testing the Deployment

Once deployed, test the VPN credentials functionality:

1. **Health Check**: `curl http://34.66.19.167:3001/api/health`
2. **VPN Credentials**: `curl http://34.66.19.167:3001/api/v1/vpn/credentials` (requires auth)
3. **Frontend Integration**: Test the dashboard VPN credentials section

## Troubleshooting

If you encounter issues:

1. **Check Node.js Version**: Should be v18+
2. **Check Dependencies**: Run `npm install` if needed
3. **Check Build**: Run `npm run build` if needed
4. **Check Logs**: `tail -f backend.log`
5. **Check Process**: `ps aux | grep node`

## Next Steps

After successful deployment:
1. Test VPN credentials generation in the frontend dashboard
2. Verify real credentials are generated (not mock)
3. Test the complete user flow: signup → payment → VPN credentials → mobile app connection

