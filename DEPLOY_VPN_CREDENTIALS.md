# Deploy Real VPN Credentials to Production

This guide will help you deploy the full VPN credentials system to your GCP backend.

## ⚡️ Quick Deploy (Recommended)

### Step 1: Commit and Push Changes

```bash
cd /Users/jauge/Development/ConSERVERtive

# Add all changes
git add .

# Commit with descriptive message
git commit -m "feat: Add VPN credentials generation system

- Add VPN credentials service with secure username/password generation
- Add credentials controller with REST API endpoints
- Update frontend to use real credentials endpoints
- Remove mock credentials

This enables users to generate unique, secure VPN credentials"

# Push to main branch
git push origin main
```

### Step 2: Update GCP Backend

```bash
# Run the deployment script
./scripts/update-gcp-backend.sh
```

This script will:
1. SSH into your GCP VM
2. Pull the latest code
3. Install dependencies  
4. Build the application
5. Restart the backend service

### Step 3: Deploy Updated Frontend

```bash
cd /Users/jauge/Development/ConSERVERtive
vercel --prod --archive=tgz
```

### Step 4: Test the System

Visit your production dashboard and try generating VPN credentials:
1. Go to https://your-vercel-url.vercel.app/dashboard
2. Click "Generate VPN Credentials"
3. You should see real credentials with format: `adjective_animal_12345678`

---

## 🔍 Manual Deploy (If Script Fails)

### Step 1: Commit and Push

```bash
git add .
git commit -m "feat: Add VPN credentials system"
git push origin main
```

### Step 2: SSH into GCP VM

```bash
gcloud compute ssh conservertive-backend --zone=us-central1-a
```

### Step 3: Update Backend on VM

```bash
# Navigate to repository
cd conservertive-vpn-platform

# Pull latest code
git pull origin main

# Navigate to backend
cd apps/backend

# Install dependencies (if needed)
npm install

# Build application
npm run build

# Restart service
sudo systemctl restart conservertive-backend

# Check status
sudo systemctl status conservertive-backend

# Exit SSH
exit
```

### Step 4: Verify Backend

```bash
# Test health endpoint
curl http://34.66.19.167:3001/health

# Test VPN credentials endpoint (requires auth)
curl http://34.66.19.167:3001/vpn/credentials
```

### Step 5: Deploy Frontend

```bash
cd /Users/jauge/Development/ConSERVERtive
vercel --prod --archive=tgz
```

---

## 🧪 Testing the VPN Credentials System

### Test 1: Generate Credentials

```bash
# From your dashboard, click "Generate VPN Credentials"
# Expected output:
{
  "username": "swift_eagle_a3f7c921",
  "password": "XyZ...base64...==",
  "serverId": "gcp-us-central1",
  "expiresAt": "2025-11-05T..."
}
```

### Test 2: Retrieve Credentials

```bash
# Refresh the dashboard
# Credentials should persist and display correctly
```

### Test 3: Refresh Credentials

```bash
# Click "Refresh Credentials"
# New username and password should be generated
```

---

## 🔧 Troubleshooting

### Issue: "Cannot GET /vpn/credentials"

**Solution**: The backend hasn't been updated yet.
```bash
# Re-run the update script
./scripts/update-gcp-backend.sh
```

### Issue: "Internal server error"

**Solution**: Check backend logs
```bash
gcloud compute ssh conservertive-backend --zone=us-central1-a
sudo journalctl -u conservertive-backend -f
```

### Issue: Database connection errors

**Solution**: Ensure the User entity has VPN credential fields
```bash
# Check if migration ran
# On GCP VM:
cd /home/ubuntu/conservertive-vpn-platform/apps/backend
npm run migration:run
```

---

## 📊 System Architecture

### VPN Credentials Flow:

1. **User clicks "Generate Credentials"**
   - Frontend sends POST to `/api/vpn/credentials/generate`
   - Frontend API proxies to backend at `http://34.66.19.167:3001/vpn/credentials/generate`

2. **Backend generates credentials**
   - Creates memorable username: `adjective_animal_12345678`
   - Generates secure base64 password
   - Assigns best available VPN server
   - Sets 30-day expiration
   - Saves to database

3. **User receives credentials**
   - Username: For VPN client configuration
   - Password: Secure random string
   - Server IP: `34.56.241.36`
   - Expires in 30 days

### Database Schema:

```sql
-- User entity has these fields:
vpnUsername: string (nullable)
vpnPassword: string (nullable)
vpnServerId: string (nullable)
vpnConfigGeneratedAt: timestamp (nullable)
vpnConfigExpiresAt: timestamp (nullable)
```

---

## ✅ Verification Checklist

- [ ] Code committed and pushed to GitHub
- [ ] GCP backend updated and restarted
- [ ] Backend health check passes
- [ ] Frontend deployed to Vercel
- [ ] Can generate VPN credentials from dashboard
- [ ] Credentials persist across page refreshes
- [ ] Can refresh credentials
- [ ] Credentials show correct expiration date

---

## 🎯 Next Steps

After successful deployment:
1. Test the mobile app connection with real credentials
2. Set up automatic credential rotation
3. Add credential expiration reminders
4. Implement credential revocation on subscription cancellation

