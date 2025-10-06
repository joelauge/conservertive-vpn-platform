# ConSERVERtive VPN - Infrastructure Documentation

## 📋 Overview

This document provides a comprehensive mapping of the ConSERVERtive VPN infrastructure, current deployments, and architectural patterns. It serves as the definitive guide for development, maintenance, and future expansion.

**Last Updated**: October 4, 2025  
**Status**: Production Active  
**Version**: 1.0.0

---

## 🏗️ Current Architecture

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        ConSERVERtive VPN                        │
├─────────────────────────────────────────────────────────────────┤
│  Frontend (Vercel)          │  Backend (GCP)    │  VPN Servers   │
│  ┌─────────────────────┐    │  ┌─────────────┐  │  ┌──────────┐  │
│  │ conservertive.co    │    │  │ API Server  │  │  │ Iowa VPN │  │
│  │ Next.js + React     │◄───┤  │ NestJS      │◄──┤  │ Server   │  │
│  │ Tailwind CSS        │    │  │ TypeScript  │  │  │ GCP      │  │
│  │ Clerk Auth          │    │  │ PostgreSQL  │  │  │ 34.56... │  │
│  └─────────────────────┘    │  │ Redis       │  │  └──────────┘  │
│                             │  │ Stripe      │  │                │
│                             │  └─────────────┘  │                │
│                             │  34.66.19.167     │                │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🌐 Frontend Infrastructure

### **Platform**: Vercel
- **Domain**: `https://conservertive.co`
- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS
- **Authentication**: Clerk integration
- **Deployment**: Automatic via GitHub

### **Key Features**
- ✅ Professional VPN service landing page
- ✅ Pricing tiers with sponsorship model
- ✅ Multi-protocol VPN information
- ✅ Impact tracking and user stories
- ✅ Responsive design (mobile-first)

### **API Integration**
- **Proxy Functions**: Vercel serverless functions proxy to GCP backend
- **CORS Configuration**: Properly configured for cross-origin requests
- **Real-time Data**: Live data from backend APIs

### **File Structure**
```
apps/frontend/
├── src/
│   ├── app/                 # Next.js App Router pages
│   ├── components/          # React components
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions
│   ├── styles/             # Global styles
│   └── types/              # TypeScript definitions
├── public/                 # Static assets
├── api/                   # Vercel serverless functions
│   ├── health.js          # Health check proxy
│   ├── status.js          # Status proxy
│   └── vpn-servers.js     # VPN servers proxy
└── package.json
```

---

## 🔧 Backend Infrastructure

### **Platform**: Google Cloud Platform
- **Server IP**: `34.66.19.167:3001`
- **Domain**: `api.conservertive.co`
- **Framework**: NestJS with TypeScript
- **Runtime**: Node.js 18+

### **Database Layer**
- **Primary Database**: PostgreSQL
- **Cache Layer**: Redis
- **ORM**: TypeORM
- **Migrations**: Automated schema management

### **Authentication & Security**
- **JWT**: Token-based authentication
- **Passport.js**: Authentication strategies
- **RBAC**: Role-based access control
- **Helmet**: Security headers
- **Rate Limiting**: Request throttling

### **Payment Processing**
- **Stripe Integration**: Subscription management
- **Webhooks**: Real-time payment events
- **Coupon System**: Sponsored user discounts
- **Refund Processing**: Automated refunds

### **API Endpoints**

#### **Health & Status**
- `GET /health` - Backend health check
- `GET /api/v1/status` - Service status and uptime
- `GET /api/v1/vpn/servers` - VPN server list and status

#### **User Management**
- `GET /api/v1/users/profile` - User profile management
- `POST /api/v1/auth/login` - User authentication
- `POST /api/v1/auth/register` - User registration

#### **VPN Services**
- `GET /api/v1/vpn/servers` - Available VPN servers
- `POST /api/v1/vpn/config` - Generate client configurations
- `GET /api/v1/vpn/protocols` - Supported protocols

#### **Billing & Subscriptions**
- `POST /api/v1/billing/subscribe` - Create subscription
- `GET /api/v1/billing/invoices` - User invoices
- `POST /api/v1/billing/cancel` - Cancel subscription

### **File Structure**
```
apps/backend/
├── src/
│   ├── auth/               # Authentication module
│   ├── user/               # User management
│   ├── billing/            # Payment processing
│   ├── vpn/                # VPN services
│   ├── analytics/          # Usage analytics
│   ├── sponsorship/        # Sponsorship system
│   ├── database/           # Database configuration
│   └── main.ts             # Application entry point
├── dist/                   # Compiled JavaScript
├── test/                   # Test files
└── package.json
```

---

## 🔒 VPN Server Infrastructure

### **Current Deployment**
- **Server IP**: `34.56.241.36`
- **Location**: Iowa, USA (US Central)
- **Platform**: Google Cloud Compute Engine
- **OS**: Ubuntu 22.04 LTS
- **Server ID**: `gcp-us-central1`

### **Supported Protocols**
1. **OpenVPN** (Port 1194 UDP)
   - AES-256-GCM encryption
   - RSA-4096 authentication
   - Perfect Forward Secrecy

2. **WireGuard** (Port 51820 UDP)
   - ChaCha20-Poly1305 encryption
   - Modern cryptography
   - Minimal overhead

3. **IKEv2/IPSec** (Ports 500, 4500 UDP)
   - Enterprise-grade security
   - Auto-reconnection
   - NAT traversal

### **Server Management**
- **Management API**: Port 8080 (currently not responding)
- **Health Monitoring**: Integrated with backend API
- **Load Status**: Currently "low"
- **Certificate Management**: Automated CA and server certificates

### **Security Configuration**
- **Firewall**: UFW with VPN-specific rules
- **IP Forwarding**: Kernel-level forwarding enabled
- **Fail2ban**: Intrusion prevention
- **SSL/TLS**: Encrypted management interface

---

## 🔄 Data Flow Architecture

### **User Request Flow**
```
1. User visits conservertive.co
2. Frontend loads (Vercel CDN)
3. User interacts with UI
4. Frontend makes API call to Vercel function
5. Vercel function proxies to GCP backend (34.66.19.167:3001)
6. Backend processes request with PostgreSQL/Redis
7. Response flows back through proxy to frontend
8. Frontend updates UI
```

### **VPN Connection Flow**
```
1. User requests VPN configuration
2. Frontend → Vercel API → GCP Backend
3. Backend generates protocol-specific config
4. Config includes VPN server details (34.56.241.36)
5. User downloads config file
6. VPN client connects to server
7. Traffic encrypted and routed through server
```

### **Payment Processing Flow**
```
1. User selects subscription plan
2. Frontend → Stripe Checkout
3. Stripe processes payment
4. Stripe webhook → GCP Backend
5. Backend updates user subscription
6. Sponsorship matching algorithm runs
7. Free user account created
8. Confirmation sent to both users
```

---

## 🛠️ Development Workflow

### **Local Development Setup**
```bash
# Clone repository
git clone <repository-url>
cd ConSERVERtive

# Install dependencies
npm install

# Start development servers
npm run dev

# Access applications
# Frontend: http://localhost:3000
# Backend: http://localhost:3001
```

### **Environment Configuration**
```bash
# Backend (.env)
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_NAME=conservative_vpn

REDIS_HOST=localhost
REDIS_PORT=6379

JWT_SECRET=your-super-secret-jwt-key
STRIPE_SECRET_KEY=sk_test_your_stripe_key
CLOUDFLARE_API_TOKEN=your-cloudflare-token
```

### **Deployment Process**
1. **Code Changes**: Push to GitHub
2. **Frontend**: Automatic deployment via Vercel
3. **Backend**: Manual deployment to GCP
4. **VPN Servers**: Terraform/Ansible automation

---

## 📊 Monitoring & Health Checks

### **Current Monitoring**
- **Backend Health**: `http://34.66.19.167:3001/health`
- **Service Status**: `http://34.66.19.167:3001/api/v1/status`
- **VPN Servers**: `http://34.66.19.167:3001/api/v1/vpn/servers`
- **Frontend**: `https://conservertive.co`

### **Health Check Responses**
```json
// Backend Health
{
  "status": "healthy",
  "message": "ConSERVERtive Backend API is running!",
  "timestamp": "2025-10-04T15:44:29.818Z",
  "server_ip": "34.66.19.167",
  "domain": "api.conservertive.co",
  "version": "1.0.0"
}

// VPN Servers
{
  "servers": [{
    "id": "gcp-us-central1",
    "name": "US Central VPN Server",
    "location": "Iowa, USA",
    "ip": "34.56.241.36",
    "status": "active",
    "protocols": ["OpenVPN", "WireGuard", "IKEv2"],
    "load": "low"
  }]
}
```

---

## 🚨 Known Issues & Limitations

### **Current Issues**
1. **VPN Management API**: Port 8080 not responding on VPN server
2. **Single Server**: Only one VPN server active (planned for 50+)
3. **No Load Balancing**: Single point of failure
4. **Missing Clients**: Desktop/mobile apps not deployed

### **Infrastructure Limitations**
- **Geographic Coverage**: Limited to US Central region
- **Redundancy**: No failover mechanisms
- **Scaling**: Manual server deployment process
- **Monitoring**: Basic health checks only

---

## 🎯 Future Development Rules

### **Infrastructure Expansion Rules**
1. **Server Deployment**: Use Terraform for all new servers
2. **Geographic Distribution**: Deploy in multiple regions
3. **Load Balancing**: Implement before adding users
4. **Monitoring**: Set up comprehensive alerting

### **Code Development Rules**
1. **API First**: Design APIs before frontend features
2. **Type Safety**: Use TypeScript everywhere
3. **Testing**: Write tests for all new features
4. **Documentation**: Update this doc with changes

### **Security Rules**
1. **Encryption**: AES-256 minimum for all data
2. **Authentication**: JWT tokens with proper expiration
3. **Input Validation**: Validate all user inputs
4. **Audit Logging**: Log all security-relevant events

### **Deployment Rules**
1. **Staging First**: Test in staging before production
2. **Rollback Plan**: Always have rollback procedures
3. **Health Checks**: Verify all services after deployment
4. **Monitoring**: Set up alerts for critical metrics

---

## 📚 Additional Resources

### **Configuration Files**
- `apps/infrastructure/terraform/` - Infrastructure as Code
- `apps/infrastructure/docker/` - Container configurations
- `apps/infrastructure/ansible/` - Server automation
- `apps/infrastructure/cloudflare/` - DNS and security

### **Documentation Files**
- `README.md` - Project overview
- `DEPLOYMENT.md` - Deployment guide
- `API_DOCUMENTATION.md` - API reference
- `SECURITY.md` - Security policies

### **Monitoring Tools**
- **Uptime**: Backend API uptime tracking
- **Performance**: Response time monitoring
- **Errors**: Application error tracking
- **Security**: Intrusion detection

---

## 🔄 Maintenance Schedule

### **Daily Tasks**
- Check backend API health
- Monitor VPN server status
- Review error logs
- Verify payment processing

### **Weekly Tasks**
- Update server certificates
- Review security logs
- Performance optimization
- User feedback analysis

### **Monthly Tasks**
- Security audit
- Performance review
- Infrastructure scaling
- Documentation updates

---

**This documentation is the single source of truth for ConSERVERtive VPN infrastructure. All development work should reference and update this document accordingly.**

*Last Updated: October 4, 2025*
*Next Review: November 4, 2025*

