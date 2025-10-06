# ConSERVERtive VPN - Troubleshooting Guide

## 📋 Overview

This guide provides comprehensive troubleshooting procedures for the ConSERVERtive VPN infrastructure. It covers common issues, diagnostic procedures, and resolution steps for all components.

**Last Updated**: October 4, 2025  
**Version**: 1.0.0

---

## 🚨 Emergency Response

### **Critical Issues (P1)**
- Complete service outage
- Security breach
- Data loss
- Payment processing failure

**Response Time**: Immediate (within 15 minutes)

### **High Priority Issues (P2)**
- Partial service degradation
- VPN connection failures
- API errors
- Performance issues

**Response Time**: Within 1 hour

### **Medium Priority Issues (P3)**
- Minor functionality issues
- UI/UX problems
- Non-critical errors

**Response Time**: Within 4 hours

---

## 🔧 Backend API Troubleshooting

### **Service Not Responding**

#### **Symptoms**
- API endpoints return 500/503 errors
- Health check fails
- Frontend cannot connect to backend

#### **Diagnostic Steps**
```bash
# Check service status
sudo systemctl status conservertive-backend

# Check if port is listening
sudo netstat -tlnp | grep :3001

# Check system resources
htop
df -h
free -h

# Check logs
sudo journalctl -u conservertive-backend -f
```

#### **Resolution Steps**
```bash
# Restart service
sudo systemctl restart conservertive-backend

# If restart fails, check configuration
sudo systemctl status conservertive-backend -l

# Check environment variables
sudo systemctl show conservertive-backend --property=Environment

# Verify application files
ls -la /home/ubuntu/conservertive-vpn-platform/apps/backend/dist/
```

### **Database Connection Issues**

#### **Symptoms**
- Database connection errors in logs
- API returns database-related errors
- User authentication fails

#### **Diagnostic Steps**
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Check database connectivity
psql -h localhost -U postgres -d conservative_vpn -c "SELECT 1;"

# Check Redis status
sudo systemctl status redis-server

# Test Redis connectivity
redis-cli ping
```

#### **Resolution Steps**
```bash
# Restart PostgreSQL
sudo systemctl restart postgresql

# Restart Redis
sudo systemctl restart redis-server

# Check database logs
sudo tail -f /var/log/postgresql/postgresql-14-main.log

# Verify database exists
sudo -u postgres psql -c "\l"
```

### **Authentication Issues**

#### **Symptoms**
- JWT token validation fails
- Users cannot login
- Authorization errors

#### **Diagnostic Steps**
```bash
# Check JWT secret configuration
echo $JWT_SECRET

# Test token generation
node -e "const jwt = require('jsonwebtoken'); console.log(jwt.sign({test: 'data'}, process.env.JWT_SECRET));"

# Check authentication logs
sudo journalctl -u conservertive-backend | grep -i auth
```

#### **Resolution Steps**
```bash
# Verify JWT secret is set
sudo systemctl edit conservertive-backend
# Add: Environment=JWT_SECRET=your-secret-key

# Restart service
sudo systemctl restart conservertive-backend

# Test authentication endpoint
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'
```

---

## 🔒 VPN Server Troubleshooting

### **OpenVPN Connection Issues**

#### **Symptoms**
- Clients cannot connect to OpenVPN server
- Connection drops frequently
- Slow connection speeds

#### **Diagnostic Steps**
```bash
# Check OpenVPN service status
sudo systemctl status openvpn@server

# Check OpenVPN logs
sudo tail -f /var/log/openvpn.log

# Check OpenVPN status
sudo cat /var/log/openvpn-status.log

# Verify certificates
openssl x509 -in /etc/openvpn/server.crt -text -noout

# Check firewall rules
sudo ufw status verbose
```

#### **Resolution Steps**
```bash
# Restart OpenVPN service
sudo systemctl restart openvpn@server

# Check configuration syntax
sudo openvpn --config /etc/openvpn/server.conf --test-crypto

# Verify port is open
sudo netstat -ulnp | grep :1194

# Check IP forwarding
cat /proc/sys/net/ipv4/ip_forward
```

### **WireGuard Connection Issues**

#### **Symptoms**
- WireGuard clients cannot connect
- Handshake failures
- No internet access through VPN

#### **Diagnostic Steps**
```bash
# Check WireGuard service status
sudo systemctl status wg-quick@wg0

# Check WireGuard interface
sudo wg show

# Check WireGuard logs
sudo journalctl -u wg-quick@wg0 -f

# Verify configuration
sudo wg-quick up wg0 --dry-run
```

#### **Resolution Steps**
```bash
# Restart WireGuard service
sudo systemctl restart wg-quick@wg0

# Check interface status
sudo wg show

# Verify iptables rules
sudo iptables -L -n -v

# Check IP forwarding
echo 1 | sudo tee /proc/sys/net/ipv4/ip_forward
```

### **IKEv2 Connection Issues**

#### **Symptoms**
- IKEv2 clients cannot establish connection
- Certificate validation errors
- NAT traversal failures

#### **Diagnostic Steps**
```bash
# Check StrongSwan status
sudo systemctl status strongswan

# Check IPsec status
sudo ipsec status

# Check IPsec logs
sudo journalctl -u strongswan -f

# Verify certificates
sudo ipsec rereadsecrets
```

#### **Resolution Steps**
```bash
# Restart StrongSwan service
sudo systemctl restart strongswan

# Reload IPsec configuration
sudo ipsec reload

# Check IPsec connections
sudo ipsec statusall
```

---

## 🌐 Frontend Troubleshooting

### **Website Not Loading**

#### **Symptoms**
- Website returns 404/500 errors
- Slow loading times
- SSL certificate errors

#### **Diagnostic Steps**
```bash
# Check Vercel deployment status
# Visit: https://vercel.com/dashboard

# Test website directly
curl -I https://conservertive.co

# Check DNS resolution
nslookup conservertive.co
dig conservertive.co

# Test SSL certificate
openssl s_client -connect conservertive.co:443 -servername conservertive.co
```

#### **Resolution Steps**
```bash
# Redeploy frontend
git push origin main

# Check Vercel logs
# Visit: https://vercel.com/dashboard -> Project -> Functions

# Verify environment variables
# Check Vercel dashboard for correct env vars

# Clear CDN cache
# Use Vercel dashboard to purge cache
```

### **API Integration Issues**

#### **Symptoms**
- Frontend cannot connect to backend API
- CORS errors in browser console
- Proxy function failures

#### **Diagnostic Steps**
```bash
# Test API proxy functions
curl https://conservertive.co/api/health
curl https://conservertive.co/api/vpn-servers

# Check browser console for errors
# Open Developer Tools -> Console

# Test direct API access
curl http://34.66.19.167:3001/health
```

#### **Resolution Steps**
```bash
# Check Vercel function logs
# Visit Vercel dashboard -> Functions

# Verify API proxy configuration
# Check apps/frontend/api/*.js files

# Test backend API directly
curl http://34.66.19.167:3001/api/v1/status
```

---

## 💳 Payment Processing Troubleshooting

### **Stripe Integration Issues**

#### **Symptoms**
- Payment processing fails
- Webhook delivery failures
- Subscription creation errors

#### **Diagnostic Steps**
```bash
# Check Stripe webhook logs
# Visit: https://dashboard.stripe.com/webhooks

# Test Stripe API connectivity
curl -u sk_test_your_key: https://api.stripe.com/v1/charges

# Check backend logs for Stripe errors
sudo journalctl -u conservertive-backend | grep -i stripe
```

#### **Resolution Steps**
```bash
# Verify Stripe keys
echo $STRIPE_SECRET_KEY
echo $STRIPE_WEBHOOK_SECRET

# Test webhook endpoint
curl -X POST http://localhost:3001/api/v1/billing/webhook \
  -H "Content-Type: application/json" \
  -d '{"type":"payment_intent.succeeded"}'

# Check Stripe dashboard for failed events
```

### **Subscription Management Issues**

#### **Symptoms**
- Users cannot create subscriptions
- Subscription status not updating
- Billing errors

#### **Diagnostic Steps**
```bash
# Check subscription creation logs
sudo journalctl -u conservertive-backend | grep -i subscription

# Verify database subscription records
sudo -u postgres psql -d conservative_vpn -c "SELECT * FROM subscriptions;"

# Test subscription API
curl -X POST http://localhost:3001/api/v1/billing/subscribe \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"plan":"premium","paymentMethodId":"pm_test"}'
```

#### **Resolution Steps**
```bash
# Restart backend service
sudo systemctl restart conservertive-backend

# Check Stripe dashboard for failed payments
# Visit: https://dashboard.stripe.com/payments

# Verify webhook configuration
# Check Stripe dashboard -> Webhooks
```

---

## 🔐 Security Troubleshooting

### **Authentication Failures**

#### **Symptoms**
- Multiple failed login attempts
- JWT token validation errors
- Unauthorized access attempts

#### **Diagnostic Steps**
```bash
# Check authentication logs
sudo tail -f /var/log/auth.log

# Check fail2ban status
sudo fail2ban-client status

# Check firewall logs
sudo ufw status verbose

# Check backend authentication logs
sudo journalctl -u conservertive-backend | grep -i auth
```

#### **Resolution Steps**
```bash
# Block suspicious IPs
sudo ufw deny from <suspicious_ip>

# Add to fail2ban
sudo fail2ban-client set openvpn banip <suspicious_ip>

# Check for brute force attempts
sudo grep "Failed password" /var/log/auth.log | tail -20
```

### **Certificate Issues**

#### **Symptoms**
- SSL certificate errors
- Certificate expiration warnings
- HTTPS connection failures

#### **Diagnostic Steps**
```bash
# Check certificate expiration
sudo certbot certificates

# Test SSL certificate
openssl s_client -connect api.conservertive.co:443 -servername api.conservertive.co

# Check certificate files
ls -la /etc/letsencrypt/live/api.conservertive.co/
```

#### **Resolution Steps**
```bash
# Renew certificates
sudo certbot renew

# Restart services
sudo systemctl restart nginx
sudo systemctl restart openvpn@server

# Check certificate installation
sudo certbot certificates
```

---

## 📊 Performance Troubleshooting

### **Slow Response Times**

#### **Symptoms**
- API responses > 1 second
- Slow VPN connections
- High server load

#### **Diagnostic Steps**
```bash
# Check system resources
htop
df -h
free -h

# Check network usage
iftop -i eth0

# Check database performance
sudo -u postgres psql -d conservative_vpn -c "SELECT * FROM pg_stat_activity;"

# Check Redis performance
redis-cli info stats
```

#### **Resolution Steps**
```bash
# Restart services
sudo systemctl restart conservertive-backend
sudo systemctl restart postgresql
sudo systemctl restart redis-server

# Clear Redis cache
redis-cli flushall

# Check for memory leaks
sudo journalctl -u conservertive-backend | grep -i memory
```

### **High Server Load**

#### **Symptoms**
- CPU usage > 80%
- Memory usage > 90%
- Slow system response

#### **Diagnostic Steps**
```bash
# Check system load
uptime
top
htop

# Check process usage
ps aux --sort=-%cpu | head -10
ps aux --sort=-%mem | head -10

# Check disk I/O
iostat -x 1 5
```

#### **Resolution Steps**
```bash
# Kill high CPU processes
sudo kill -9 <pid>

# Restart services
sudo systemctl restart conservertive-backend

# Check for runaway processes
sudo journalctl -u conservertive-backend | grep -i error
```

---

## 🔄 Network Troubleshooting

### **DNS Issues**

#### **Symptoms**
- Domain name resolution failures
- Website not accessible by domain
- SSL certificate errors

#### **Diagnostic Steps**
```bash
# Test DNS resolution
nslookup conservertive.co
dig conservertive.co
dig api.conservertive.co

# Check DNS propagation
# Visit: https://dnschecker.org/

# Test from different locations
# Use online DNS testing tools
```

#### **Resolution Steps**
```bash
# Update DNS records
# Check domain provider DNS settings

# Clear DNS cache
sudo systemctl flush-dns

# Test with different DNS servers
echo "nameserver 8.8.8.8" | sudo tee /etc/resolv.conf
```

### **Firewall Issues**

#### **Symptoms**
- Ports not accessible
- Connection timeouts
- Service not reachable

#### **Diagnostic Steps**
```bash
# Check firewall status
sudo ufw status verbose

# Check iptables rules
sudo iptables -L -n -v

# Test port accessibility
telnet 34.66.19.167 3001
telnet 34.56.241.36 1194

# Check Google Cloud firewall rules
gcloud compute firewall-rules list
```

#### **Resolution Steps**
```bash
# Allow required ports
sudo ufw allow 3001/tcp
sudo ufw allow 1194/udp

# Check Google Cloud firewall
gcloud compute firewall-rules create allow-backend-api \
    --allow tcp:3001 \
    --source-ranges 0.0.0.0/0 \
    --target-tags http-server
```

---

## 📋 Diagnostic Commands

### **System Health Check**
```bash
#!/bin/bash
# system-health-check.sh

echo "=== System Health Check ==="
echo "Date: $(date)"
echo "Uptime: $(uptime)"
echo ""

echo "=== CPU Usage ==="
top -bn1 | grep "Cpu(s)"

echo "=== Memory Usage ==="
free -h

echo "=== Disk Usage ==="
df -h

echo "=== Network Interfaces ==="
ip addr show

echo "=== Active Connections ==="
ss -tuln | grep -E ':(3001|1194|51820|500|4500)'

echo "=== Service Status ==="
systemctl is-active conservertive-backend
systemctl is-active openvpn@server
systemctl is-active wg-quick@wg0
systemctl is-active strongswan
```

### **API Health Check**
```bash
#!/bin/bash
# api-health-check.sh

API_URL="http://localhost:3001"
ENDPOINTS=("/health" "/api/v1/status" "/api/v1/vpn/servers")

echo "=== API Health Check ==="
for endpoint in "${ENDPOINTS[@]}"; do
    echo "Testing: $API_URL$endpoint"
    response=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL$endpoint")
    if [ "$response" = "200" ]; then
        echo "✅ $endpoint - OK"
    else
        echo "❌ $endpoint - FAILED ($response)"
    fi
done
```

### **VPN Health Check**
```bash
#!/bin/bash
# vpn-health-check.sh

echo "=== VPN Health Check ==="

echo "OpenVPN Status:"
systemctl is-active openvpn@server
if [ $? -eq 0 ]; then
    echo "✅ OpenVPN - Running"
    echo "Connections: $(cat /var/log/openvpn-status.log | grep CLIENT_LIST | wc -l)"
else
    echo "❌ OpenVPN - Not Running"
fi

echo ""
echo "WireGuard Status:"
systemctl is-active wg-quick@wg0
if [ $? -eq 0 ]; then
    echo "✅ WireGuard - Running"
    echo "Peers: $(wg show | grep peer | wc -l)"
else
    echo "❌ WireGuard - Not Running"
fi

echo ""
echo "IKEv2 Status:"
systemctl is-active strongswan
if [ $? -eq 0 ]; then
    echo "✅ IKEv2 - Running"
    echo "Connections: $(ipsec status | grep -c "ESTABLISHED")"
else
    echo "❌ IKEv2 - Not Running"
fi
```

---

## 📞 Escalation Procedures

### **Level 1 Support**
- Basic troubleshooting
- Service restarts
- Log analysis
- Documentation review

### **Level 2 Support**
- Advanced diagnostics
- Configuration changes
- Performance optimization
- Security incident response

### **Level 3 Support**
- Architecture changes
- Major system modifications
- Security breach response
- Disaster recovery

### **Emergency Contacts**
- **Technical Lead**: [Contact Information]
- **DevOps Engineer**: [Contact Information]
- **Security Team**: [Contact Information]
- **On-call Engineer**: [Contact Information]

---

## 📚 Additional Resources

### **Documentation**
- [Infrastructure Documentation](./INFRASTRUCTURE_DOCUMENTATION.md)
- [API Documentation](./API_DOCUMENTATION.md)
- [VPN Server Configuration](./VPN_SERVER_CONFIGURATION.md)
- [Deployment Procedures](./DEPLOYMENT_PROCEDURES.md)

### **External Resources**
- [Google Cloud Documentation](https://cloud.google.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Stripe Documentation](https://stripe.com/docs)
- [OpenVPN Documentation](https://openvpn.net/community-resources/)

### **Monitoring Tools**
- **System Monitoring**: htop, iotop, nethogs
- **Network Monitoring**: iftop, netstat, ss
- **Log Analysis**: journalctl, grep, awk
- **Performance**: top, vmstat, iostat

---

**This troubleshooting guide should be consulted for all technical issues. If an issue is not covered, escalate to Level 2 support with detailed diagnostic information.**

*Last Updated: October 4, 2025*  
*Version: 1.0.0*
