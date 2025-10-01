# ConSERVERtive VPN - Deployment Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm 9+
- Docker and Docker Compose
- PostgreSQL 15+
- Redis 7+
- Cloudflare account with API token

### 1. Clone and Setup
```bash
git clone <repository-url>
cd ConSERVERtive
cp env.example .env
# Edit .env with your configuration
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Environment
```bash
# Start all services with Docker Compose
docker-compose up -d

# Or start individual services
npm run dev:backend
npm run dev:frontend
```

### 4. Access Applications
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- API Documentation: http://localhost:3001/api/docs
- Database: localhost:5432
- Redis: localhost:6379

## 🏗️ Architecture Overview

### Monorepo Structure
```
ConSERVERtive/
├── apps/
│   ├── backend/          # NestJS microservices
│   ├── frontend/         # Next.js web application
│   ├── mobile/           # React Native mobile app
│   └── infrastructure/   # Terraform & Ansible configs
├── libs/
│   ├── shared/           # Shared utilities
│   ├── types/            # TypeScript definitions
│   └── utils/            # Common functions
└── packages/
    ├── config/           # Configuration packages
    └── eslint-config/    # Shared linting rules
```

### Backend Microservices
- **Auth Service**: JWT authentication, user management
- **User Service**: Profile management, account lifecycle
- **Billing Service**: Subscription management, payments
- **Analytics Service**: Usage tracking, reporting
- **VPN Service**: VPN orchestration, server management

### Frontend Applications
- **Web App**: React/Next.js dashboard and landing page
- **Mobile App**: React Native for iOS/Android
- **Admin Dashboard**: Management interface

## 🔧 Configuration

### Environment Variables
Copy `env.example` to `.env` and configure:

```bash
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_NAME=conservative_vpn

# Cloudflare
CLOUDFLARE_API_TOKEN=your-token
CLOUDFLARE_ACCOUNT_ID=your-account-id

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=24h
```

### Cloudflare Setup
1. Create Cloudflare account
2. Add domain to Cloudflare
3. Generate API token with appropriate permissions
4. Create tunnel and configure ingress rules

### Database Setup
```bash
# Create database
createdb conservative_vpn

# Run migrations
npm run migration:run
```

## 🌍 VPN Server Deployment

### Infrastructure as Code
```bash
cd apps/infrastructure/terraform
terraform init
terraform plan
terraform apply
```

### Server Configuration
```bash
cd apps/infrastructure/ansible
ansible-playbook -i inventory vpn-server-setup.yml
```

### Supported Protocols
- **OpenVPN**: Port 1194 (UDP)
- **WireGuard**: Port 51820 (UDP)
- **IKEv2**: Port 500 (UDP)

## 🔒 Security Features

### Encryption
- AES-256-GCM encryption
- Perfect Forward Secrecy
- Certificate pinning

### Anti-Censorship
- Obfuscated servers for restricted regions
- Stealth protocols
- Dynamic server rotation
- Custom DNS servers

### Compliance
- No-logs policy (audited)
- GDPR compliant
- SOC 2 Type II
- PCI DSS compliant

## 📊 Monitoring & Analytics

### Health Checks
- Server uptime monitoring
- Connection speed tests
- Security incident tracking

### User Analytics
- Privacy-preserving usage metrics
- Performance analytics
- Geographic distribution

## 🚀 Production Deployment

### Kubernetes Deployment
```bash
# Apply Kubernetes manifests
kubectl apply -f apps/infrastructure/kubernetes/

# Deploy with Helm
helm install conservative ./helm/chart
```

### CI/CD Pipeline
- Automated testing on PRs
- Docker image building
- Security scanning
- Automated deployments

### Scaling
- Horizontal pod autoscaling
- Database read replicas
- CDN integration
- Load balancing

## 🛠️ Development

### Code Quality
- ESLint + Prettier
- TypeScript strict mode
- Husky pre-commit hooks
- Automated testing

### Testing
```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage
npm run test:coverage
```

### Linting
```bash
# Check linting
npm run lint

# Fix linting issues
npm run lint:fix
```

## 📱 Mobile Development

### React Native Setup
```bash
cd apps/mobile
npm install
npx react-native run-ios
npx react-native run-android
```

### VPN Client Integration
- Native VPN protocols
- Kill switch functionality
- Split tunneling
- DNS leak protection

## 🌐 Domain Hosting Service

### Features
- Anonymous domain registration
- Secure hosting with VPN protection
- CDN integration
- SSL certificate management
- DDoS protection

### Implementation
- Cloudflare R2 for storage
- Cloudflare Workers for edge computing
- Custom DNS management
- Automated SSL provisioning

## 💰 Sponsorship System

### 1:1 Matching Model
- Paying customers sponsor free users
- Geographic distribution tracking
- Impact reporting
- Transparent matching process

### Implementation
- User verification system
- Geographic detection
- Automated matching algorithm
- Impact dashboard

## 🔍 Troubleshooting

### Common Issues
1. **Database Connection**: Check PostgreSQL service
2. **Redis Connection**: Verify Redis is running
3. **Cloudflare Tunnel**: Check tunnel configuration
4. **VPN Connectivity**: Verify server status

### Logs
```bash
# Backend logs
docker-compose logs backend

# VPN server logs
tail -f /var/log/openvpn.log
```

### Support
- Documentation: `/docs`
- Issues: GitHub Issues
- Community: Discord/Slack
- Enterprise: support@conservative-vpn.com

## 📈 Performance Optimization

### Backend
- Database query optimization
- Redis caching
- Connection pooling
- API rate limiting

### Frontend
- Code splitting
- Image optimization
- CDN integration
- Service worker caching

### Infrastructure
- Server load balancing
- Geographic distribution
- Auto-scaling
- Monitoring and alerting

---

**ConSERVERtive VPN** - Fighting for internet freedom worldwide! 🌍🔒
