# ConSERVERtive VPN - Server Configuration Guide

## 📋 Overview

This document provides detailed configuration information for ConSERVERtive VPN servers, including protocol setup, security hardening, and management procedures.

**Current Active Server**: `34.56.241.36` (Iowa, USA)  
**Server ID**: `gcp-us-central1`  
**Last Updated**: October 4, 2025

---

## 🖥️ Server Specifications

### **Current Deployment**
- **Platform**: Google Cloud Compute Engine
- **Instance Type**: e2-medium (2 vCPUs, 4GB RAM)
- **OS**: Ubuntu 22.04 LTS
- **Storage**: 100GB SSD
- **Network**: 1Gbps bandwidth
- **Location**: Iowa, USA (us-central1)

### **Server Status**
- **Status**: ✅ Active
- **Load**: Low
- **Uptime**: 66+ hours continuous
- **Health**: Responding to ping (47-51ms)

---

## 🔒 VPN Protocol Configurations

### **1. OpenVPN Configuration**

#### **Server Configuration**
```bash
# /etc/openvpn/server.conf
port 1194
proto udp
dev tun

# Certificate and Key Files
ca ca.crt
cert server.crt
key server.key
dh dh2048.pem

# Network Configuration
server 10.8.0.0 255.255.255.0
ifconfig-pool-persist ipp.txt

# Client Configuration
client-config-dir ccd
client-to-client

# Security Settings
cipher AES-256-GCM
auth SHA256
tls-auth ta.key 0

# Compression
comp-lzo

# Logging
log-append /var/log/openvpn.log
status /var/log/openvpn-status.log
verb 3

# Security Hardening
tls-version-min 1.2
tls-cipher TLS-ECDHE-RSA-WITH-AES-256-GCM-SHA384
```

#### **Client Configuration Template**
```bash
# Generated client config
client
dev tun
proto udp
remote 34.56.241.36 1194
resolv-retry infinite
nobind
persist-key
persist-tun
cipher AES-256-GCM
auth SHA256
tls-auth ta.key 1
comp-lzo
verb 3

# Certificate and Key (embedded)
<ca>
-----BEGIN CERTIFICATE-----
[CA Certificate]
-----END CERTIFICATE-----
</ca>

<cert>
-----BEGIN CERTIFICATE-----
[Client Certificate]
-----END CERTIFICATE-----
</cert>

<key>
-----BEGIN PRIVATE KEY-----
[Client Private Key]
-----END PRIVATE KEY-----
</key>

<tls-auth>
-----BEGIN OpenVPN Static key V1-----
[TLS Auth Key]
-----END OpenVPN Static key V1-----
</tls-auth>
```

### **2. WireGuard Configuration**

#### **Server Configuration**
```bash
# /etc/wireguard/wg0.conf
[Interface]
PrivateKey = [Server Private Key]
Address = 10.7.0.1/24
ListenPort = 51820
PostUp = iptables -A FORWARD -i %i -j ACCEPT; iptables -A FORWARD -o %i -j ACCEPT; iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
PostDown = iptables -D FORWARD -i %i -j ACCEPT; iptables -D FORWARD -o %i -j ACCEPT; iptables -t nat -D POSTROUTING -o eth0 -j MASQUERADE

# Client Configuration
[Peer]
PublicKey = [Client Public Key]
AllowedIPs = 10.7.0.2/32
```

#### **Client Configuration Template**
```bash
# Generated client config
[Interface]
PrivateKey = [Client Private Key]
Address = 10.7.0.2/24
DNS = 1.1.1.1, 1.0.0.1

[Peer]
PublicKey = [Server Public Key]
Endpoint = 34.56.241.36:51820
AllowedIPs = 0.0.0.0/0
PersistentKeepalive = 25
```

### **3. IKEv2/IPSec Configuration**

#### **Server Configuration**
```bash
# /etc/ipsec.conf
config setup
    charondebug="ike 1, knl 1, cfg 0"
    uniqueids=no

conn ikev2-vpn
    auto=add
    compress=no
    type=tunnel
    keyexchange=ikev2
    fragmentation=yes
    forceencaps=yes
    dpdaction=clear
    dpddelay=300s
    dpdtimeout=300s
    ike=aes256-sha256-modp2048!
    esp=aes256-sha256!
    left=%any
    leftid=34.56.241.36
    leftcert=server.crt
    leftsendcert=always
    leftsubnet=0.0.0.0/0
    right=%any
    rightid=%any
    rightauth=eap-mschapv2
    rightsourceip=10.6.0.0/24
    rightdns=1.1.1.1,1.0.0.1
    rightsendcert=never
    eap_identity=%identity
```

#### **Client Configuration Template**
```bash
# Generated client config
conn ikev2-vpn
    right=34.56.241.36
    rightid=34.56.241.36
    rightsubnet=0.0.0.0/0
    rightauth=eap-mschapv2
    eap_identity=username
    auto=start
```

---

## 🔧 Server Management

### **Service Management Commands**

#### **OpenVPN**
```bash
# Start/Stop/Restart OpenVPN
sudo systemctl start openvpn@server
sudo systemctl stop openvpn@server
sudo systemctl restart openvpn@server

# Check status
sudo systemctl status openvpn@server

# View logs
sudo tail -f /var/log/openvpn.log
sudo tail -f /var/log/openvpn-status.log
```

#### **WireGuard**
```bash
# Start/Stop/Restart WireGuard
sudo systemctl start wg-quick@wg0
sudo systemctl stop wg-quick@wg0
sudo systemctl restart wg-quick@wg0

# Check status
sudo systemctl status wg-quick@wg0

# View interface status
sudo wg show
```

#### **IKEv2/IPSec**
```bash
# Start/Stop/Restart IPsec
sudo systemctl start strongswan
sudo systemctl stop strongswan
sudo systemctl restart strongswan

# Check status
sudo systemctl status strongswan

# View connections
sudo ipsec status
```

### **Certificate Management**

#### **Certificate Authority (CA)**
```bash
# Generate CA certificate
openssl req -new -x509 -keyout ca.key -out ca.crt -days 3650 -subj "/CN=ConSERVERtive VPN CA"

# Generate server certificate
openssl req -new -keyout server.key -out server.csr -subj "/CN=conservertive-vpn-server"
openssl x509 -req -in server.csr -CA ca.crt -CAkey ca.key -out server.crt -days 3650
```

#### **Client Certificate Generation**
```bash
# Generate client certificate
openssl req -new -keyout client.key -out client.csr -subj "/CN=client-username"
openssl x509 -req -in client.csr -CA ca.crt -CAkey ca.key -out client.crt -days 3650

# Generate TLS auth key
openvpn --genkey --secret ta.key
```

#### **WireGuard Key Generation**
```bash
# Generate server keys
wg genkey | tee server_private_key | wg pubkey > server_public_key

# Generate client keys
wg genkey | tee client_private_key | wg pubkey > client_public_key
```

---

## 🛡️ Security Hardening

### **Firewall Configuration (UFW)**
```bash
# Enable UFW
sudo ufw enable

# Allow SSH
sudo ufw allow 22/tcp

# Allow VPN ports
sudo ufw allow 1194/udp  # OpenVPN
sudo ufw allow 51820/udp # WireGuard
sudo ufw allow 500/udp   # IKEv2
sudo ufw allow 4500/udp # IKEv2

# Allow management API
sudo ufw allow 8080/tcp

# Default policies
sudo ufw default deny incoming
sudo ufw default allow outgoing
```

### **IP Forwarding**
```bash
# Enable IP forwarding
echo 'net.ipv4.ip_forward = 1' >> /etc/sysctl.conf
sysctl -p

# Verify forwarding is enabled
cat /proc/sys/net/ipv4/ip_forward
```

### **Fail2ban Configuration**
```bash
# Install fail2ban
sudo apt install fail2ban

# Configure for OpenVPN
sudo tee /etc/fail2ban/jail.local << EOF
[openvpn]
enabled = true
port = 1194
protocol = udp
filter = openvpn
logpath = /var/log/openvpn.log
maxretry = 3
bantime = 3600
EOF

# Start fail2ban
sudo systemctl start fail2ban
sudo systemctl enable fail2ban
```

### **System Hardening**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install security updates
sudo apt install unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades

# Disable root login
sudo sed -i 's/PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
sudo systemctl restart ssh

# Set up automatic security updates
sudo apt install unattended-upgrades
```

---

## 📊 Monitoring & Logging

### **Health Check Endpoints**
```bash
# Management API endpoint (currently not responding)
curl http://localhost:8080/health

# OpenVPN status
sudo cat /var/log/openvpn-status.log

# WireGuard status
sudo wg show

# IPsec status
sudo ipsec status
```

### **Log Monitoring**
```bash
# OpenVPN logs
sudo tail -f /var/log/openvpn.log

# System logs
sudo journalctl -u openvpn@server -f
sudo journalctl -u wg-quick@wg0 -f
sudo journalctl -u strongswan -f

# Authentication logs
sudo tail -f /var/log/auth.log
```

### **Performance Monitoring**
```bash
# Network usage
iftop -i eth0

# Connection count
ss -tuln | grep -E ':(1194|51820|500|4500)'

# System resources
htop
df -h
free -h
```

---

## 🔄 Backup & Recovery

### **Configuration Backup**
```bash
# Backup VPN configurations
sudo tar -czf vpn-config-backup-$(date +%Y%m%d).tar.gz \
    /etc/openvpn/ \
    /etc/wireguard/ \
    /etc/ipsec.conf \
    /etc/ipsec.d/ \
    /etc/ufw/

# Backup certificates
sudo tar -czf vpn-certs-backup-$(date +%Y%m%d).tar.gz \
    /etc/openvpn/ca.crt \
    /etc/openvpn/server.crt \
    /etc/openvpn/server.key \
    /etc/openvpn/dh2048.pem \
    /etc/openvpn/ta.key
```

### **Recovery Procedures**
```bash
# Restore configurations
sudo tar -xzf vpn-config-backup-YYYYMMDD.tar.gz -C /

# Restore certificates
sudo tar -xzf vpn-certs-backup-YYYYMMDD.tar.gz -C /

# Restart services
sudo systemctl restart openvpn@server
sudo systemctl restart wg-quick@wg0
sudo systemctl restart strongswan
```

---

## 🚀 Deployment Automation

### **Terraform Configuration**
```hcl
# VPN Server Instance
resource "google_compute_instance" "vpn_server" {
  name         = "conservertive-vpn-server"
  machine_type = "e2-medium"
  zone         = "us-central1-a"

  boot_disk {
    initialize_params {
      image = "ubuntu-2204-lts"
      size  = 100
    }
  }

  network_interface {
    network = "default"
    access_config {}
  }

  metadata = {
    ssh-keys = "ubuntu:${file("~/.ssh/id_rsa.pub")}"
  }

  metadata_startup_script = file("${path.module}/vpn-server-setup.sh")
}
```

### **Ansible Playbook**
```yaml
# vpn-server-setup.yml
- hosts: vpn_servers
  become: yes
  tasks:
    - name: Update system packages
      apt:
        update: yes
        upgrade: yes

    - name: Install VPN packages
      apt:
        name:
          - openvpn
          - wireguard
          - strongswan
          - ufw
          - fail2ban

    - name: Configure firewall
      ufw:
        rule: allow
        port: "{{ item }}"
        proto: udp
      loop:
        - 1194  # OpenVPN
        - 51820 # WireGuard
        - 500   # IKEv2
        - 4500  # IKEv2

    - name: Enable IP forwarding
      sysctl:
        name: net.ipv4.ip_forward
        value: '1'
        state: present

    - name: Start VPN services
      systemd:
        name: "{{ item }}"
        state: started
        enabled: yes
      loop:
        - openvpn@server
        - wg-quick@wg0
        - strongswan
```

---

## 🔧 Troubleshooting

### **Common Issues**

#### **OpenVPN Connection Issues**
```bash
# Check server status
sudo systemctl status openvpn@server

# Check logs
sudo tail -f /var/log/openvpn.log

# Verify certificates
openssl x509 -in /etc/openvpn/server.crt -text -noout

# Test configuration
sudo openvpn --config /etc/openvpn/server.conf --test-crypto
```

#### **WireGuard Connection Issues**
```bash
# Check interface status
sudo wg show

# Check systemd service
sudo systemctl status wg-quick@wg0

# Test configuration
sudo wg-quick up wg0 --dry-run
```

#### **IKEv2 Connection Issues**
```bash
# Check IPsec status
sudo ipsec status

# Check logs
sudo journalctl -u strongswan -f

# Test configuration
sudo ipsec rereadsecrets
sudo ipsec reload
```

### **Performance Issues**
```bash
# Check system resources
htop
df -h
free -h

# Check network usage
iftop -i eth0

# Check connection count
ss -tuln | grep -E ':(1194|51820|500|4500)'
```

### **Security Issues**
```bash
# Check fail2ban status
sudo fail2ban-client status

# Check firewall status
sudo ufw status verbose

# Check authentication logs
sudo tail -f /var/log/auth.log
```

---

## 📈 Scaling & Optimization

### **Performance Tuning**
```bash
# Increase file descriptor limits
echo "* soft nofile 65536" >> /etc/security/limits.conf
echo "* hard nofile 65536" >> /etc/security/limits.conf

# Optimize network settings
echo "net.core.rmem_max = 16777216" >> /etc/sysctl.conf
echo "net.core.wmem_max = 16777216" >> /etc/sysctl.conf
echo "net.ipv4.tcp_rmem = 4096 87380 16777216" >> /etc/sysctl.conf
echo "net.ipv4.tcp_wmem = 4096 65536 16777216" >> /etc/sysctl.conf

# Apply changes
sysctl -p
```

### **Load Balancing**
```bash
# Multiple OpenVPN instances
sudo cp /etc/openvpn/server.conf /etc/openvpn/server2.conf
sudo sed -i 's/port 1194/port 1195/' /etc/openvpn/server2.conf
sudo systemctl start openvpn@server2
sudo systemctl enable openvpn@server2
```

---

## 🔐 Security Best Practices

### **Regular Maintenance**
1. **Weekly**: Update system packages
2. **Monthly**: Rotate certificates
3. **Quarterly**: Security audit
4. **Annually**: Full system review

### **Monitoring Checklist**
- [ ] Service status checks
- [ ] Log file monitoring
- [ ] Resource usage monitoring
- [ ] Security event monitoring
- [ ] Certificate expiration monitoring

### **Backup Checklist**
- [ ] Configuration files
- [ ] Certificate files
- [ ] User databases
- [ ] Log files
- [ ] System state

---

**This configuration guide is maintained alongside the server infrastructure. All changes should be tested in staging before production deployment.**

*Last Updated: October 4, 2025*  
*Server Version: 1.0.0*
