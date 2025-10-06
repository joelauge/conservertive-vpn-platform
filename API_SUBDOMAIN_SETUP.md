# API Subdomain Configuration Guide

## 🌐 Setting up api.conservertive.co

### Current Infrastructure
- **Backend API**: `34.66.19.167:3001` (Google Cloud)
- **Domain**: `conservertive.co` (GoDaddy)
- **Target**: `api.conservertive.co` → Backend API

### Step 1: GoDaddy DNS Configuration

1. **Log into GoDaddy**:
   - Go to [GoDaddy.com](https://godaddy.com)
   - Sign in to your account
   - Navigate to "My Products" → "Domains"

2. **Access DNS Management**:
   - Find `conservertive.co` in your domain list
   - Click "DNS" or "Manage DNS"

3. **Add A Record for API Subdomain**:
   - Click "Add" or "+" to create a new record
   - **Type**: A
   - **Name**: `api`
   - **Value**: `34.66.19.167`
   - **TTL**: 600 (10 minutes) or 3600 (1 hour)
   - Click "Save"

### Step 2: Verify DNS Propagation

After adding the DNS record, it may take 5-60 minutes to propagate globally.

**Test Commands**:
```bash
# Check DNS resolution
nslookup api.conservertive.co

# Test API endpoint
curl -s http://api.conservertive.co:3001/health

# Test with HTTPS (if SSL is configured)
curl -s https://api.conservertive.co:3001/health
```

### Step 3: SSL Certificate Setup (Optional but Recommended)

For HTTPS support on the API subdomain, we have several options:

#### Option A: Let's Encrypt (Free SSL)
```bash
# SSH into the backend server
ssh -i .ssh/ssh-key-2025-10-01.key ubuntu@34.66.19.167

# Install Certbot
sudo apt update
sudo apt install -y certbot

# Get SSL certificate
sudo certbot certonly --standalone -d api.conservertive.co

# Configure Nginx reverse proxy (optional)
sudo apt install -y nginx
```

#### Option B: Cloudflare (Recommended)
1. Add `conservertive.co` to Cloudflare
2. Configure DNS records through Cloudflare
3. Enable SSL/TLS encryption
4. Set up page rules for API subdomain

### Step 4: Update Backend Configuration

Once DNS is configured, update the backend to handle the new domain:

```bash
# SSH into backend server
ssh -i .ssh/ssh-key-2025-10-01.key ubuntu@34.66.19.167

# Update server.js to handle CORS for the new domain
cd /home/ubuntu/conservertive-backend
```

### Expected Results

After configuration:
- ✅ `api.conservertive.co` resolves to `34.66.19.167`
- ✅ API endpoints accessible via subdomain
- ✅ Professional API URL structure
- ✅ SSL/HTTPS support (if configured)

### API Endpoints Structure

```
https://api.conservertive.co:3001/health
https://api.conservertive.co:3001/api/v1/status
https://api.conservertive.co:3001/api/v1/vpn/servers
https://api.conservertive.co:3001/api/v1/users/profile
```

### Troubleshooting

**If DNS doesn't resolve**:
1. Check GoDaddy DNS settings
2. Wait for propagation (up to 24 hours)
3. Use `dig api.conservertive.co` to check different DNS servers

**If API doesn't respond**:
1. Check backend server status: `curl http://34.66.19.167:3001/health`
2. Verify firewall rules allow port 3001
3. Check server logs: `ssh ubuntu@34.66.19.167 "tail -f /home/ubuntu/conservertive-backend/backend.log"`

### Next Steps

1. Configure DNS A record in GoDaddy
2. Test DNS resolution
3. Set up SSL certificate (optional)
4. Update frontend to use new API URL
5. Test end-to-end functionality


