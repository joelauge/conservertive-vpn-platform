# ConSERVERtive VPN - API Documentation

## 📋 Overview

This document provides comprehensive API documentation for the ConSERVERtive VPN backend services. All endpoints are currently deployed and active on Google Cloud Platform.

**Base URL**: `http://34.66.19.167:3001`  
**Domain**: `api.conservertive.co`  
**Version**: 1.0.0  
**Last Updated**: October 4, 2025

---

## 🔐 Authentication

### **JWT Token Authentication**
All protected endpoints require a valid JWT token in the Authorization header.

```http
Authorization: Bearer <jwt_token>
```

### **Token Format**
```json
{
  "sub": "user_id",
  "email": "user@example.com",
  "role": "user|admin|sponsor",
  "iat": 1696434567,
  "exp": 1696520967
}
```

---

## 🏥 Health & Status Endpoints

### **GET /health**
Returns the overall health status of the backend API.

**Request:**
```http
GET /health
```

**Response:**
```json
{
  "status": "healthy",
  "message": "ConSERVERtive Backend API is running!",
  "timestamp": "2025-10-04T15:44:29.818Z",
  "server_ip": "34.66.19.167",
  "domain": "api.conservertive.co",
  "version": "1.0.0",
  "endpoints": [
    "/health",
    "/api/v1/status",
    "/api/v1/vpn/servers",
    "/api/v1/users/profile"
  ]
}
```

**Status Codes:**
- `200 OK` - Service is healthy
- `503 Service Unavailable` - Service is down

---

### **GET /api/v1/status**
Returns detailed service status and uptime information.

**Request:**
```http
GET /api/v1/status
```

**Response:**
```json
{
  "service": "ConSERVERtive VPN Backend",
  "status": "operational",
  "domain": "api.conservertive.co",
  "endpoints": [
    "/health",
    "/api/v1/status",
    "/api/v1/vpn/servers",
    "/api/v1/users/profile"
  ],
  "uptime": 240522.199346162,
  "timestamp": "2025-10-04T15:44:33.026Z"
}
```

**Status Codes:**
- `200 OK` - Service is operational
- `503 Service Unavailable` - Service issues detected

---

## 🔒 VPN Server Endpoints

### **GET /api/v1/vpn/servers**
Returns a list of available VPN servers with their status and capabilities.

**Request:**
```http
GET /api/v1/vpn/servers
```

**Response:**
```json
{
  "servers": [
    {
      "id": "gcp-us-central1",
      "name": "US Central VPN Server",
      "location": "Iowa, USA",
      "ip": "34.56.241.36",
      "status": "active",
      "protocols": ["OpenVPN", "WireGuard", "IKEv2"],
      "load": "low",
      "endpoint": "api.conservertive.co"
    }
  ],
  "total": 1,
  "timestamp": "2025-10-04T15:44:31.234Z"
}
```

**Status Codes:**
- `200 OK` - Servers retrieved successfully
- `500 Internal Server Error` - Server list unavailable

---

### **POST /api/v1/vpn/config**
Generates VPN client configuration for a specific user and server.

**Request:**
```http
POST /api/v1/vpn/config
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "serverId": "gcp-us-central1",
  "protocol": "openvpn|wireguard|ikev2",
  "userId": "user_123"
}
```

**Response:**
```json
{
  "success": true,
  "config": {
    "protocol": "openvpn",
    "serverId": "gcp-us-central1",
    "serverIp": "34.56.241.36",
    "port": 1194,
    "configData": "client\nremote 34.56.241.36 1194\n...",
    "expiresAt": "2025-11-04T15:44:33.026Z"
  },
  "timestamp": "2025-10-04T15:44:33.026Z"
}
```

**Status Codes:**
- `200 OK` - Configuration generated successfully
- `400 Bad Request` - Invalid request parameters
- `401 Unauthorized` - Invalid or missing token
- `404 Not Found` - Server not found
- `500 Internal Server Error` - Configuration generation failed

---

### **GET /api/v1/vpn/protocols**
Returns information about supported VPN protocols.

**Request:**
```http
GET /api/v1/vpn/protocols
```

**Response:**
```json
{
  "protocols": [
    {
      "name": "OpenVPN",
      "port": 1194,
      "encryption": "AES-256-GCM",
      "authentication": "RSA-4096",
      "description": "Battle-tested security with universal compatibility"
    },
    {
      "name": "WireGuard",
      "port": 51820,
      "encryption": "ChaCha20-Poly1305",
      "authentication": "Curve25519",
      "description": "Modern, fast protocol with minimal overhead"
    },
    {
      "name": "IKEv2",
      "port": 500,
      "encryption": "AES-256",
      "authentication": "RSA-4096",
      "description": "Enterprise-grade with auto-reconnection"
    }
  ],
  "timestamp": "2025-10-04T15:44:33.026Z"
}
```

---

## 👤 User Management Endpoints

### **GET /api/v1/users/profile**
Returns the current user's profile information.

**Request:**
```http
GET /api/v1/users/profile
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "role": "user",
    "subscription": {
      "plan": "premium",
      "status": "active",
      "expiresAt": "2025-11-04T15:44:33.026Z"
    },
    "sponsorship": {
      "sponsoredUsers": 1,
      "totalImpact": 1
    },
    "createdAt": "2025-09-04T15:44:33.026Z",
    "lastLogin": "2025-10-04T15:44:33.026Z"
  },
  "timestamp": "2025-10-04T15:44:33.026Z"
}
```

**Status Codes:**
- `200 OK` - Profile retrieved successfully
- `401 Unauthorized` - Invalid or missing token
- `404 Not Found` - User not found

---

### **POST /api/v1/auth/login**
Authenticates a user and returns a JWT token.

**Request:**
```http
POST /api/v1/auth/login
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "secure_password"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_123",
    "email": "user@example.com",
    "role": "user"
  },
  "expiresIn": 86400,
  "timestamp": "2025-10-04T15:44:33.026Z"
}
```

**Status Codes:**
- `200 OK` - Login successful
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Invalid credentials
- `429 Too Many Requests` - Rate limit exceeded

---

### **POST /api/v1/auth/register**
Registers a new user account.

**Request:**
```http
POST /api/v1/auth/register
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "newuser@example.com",
  "password": "secure_password",
  "confirmPassword": "secure_password",
  "plan": "basic|premium|enterprise|sponsor"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": "user_456",
    "email": "newuser@example.com",
    "role": "user",
    "plan": "basic"
  },
  "timestamp": "2025-10-04T15:44:33.026Z"
}
```

**Status Codes:**
- `201 Created` - User registered successfully
- `400 Bad Request` - Invalid request data
- `409 Conflict` - Email already exists
- `429 Too Many Requests` - Rate limit exceeded

---

## 💳 Billing & Subscription Endpoints

### **POST /api/v1/billing/subscribe**
Creates a new subscription for a user.

**Request:**
```http
POST /api/v1/billing/subscribe
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "plan": "premium",
  "paymentMethodId": "pm_1234567890",
  "billingCycle": "monthly"
}
```

**Response:**
```json
{
  "success": true,
  "subscription": {
    "id": "sub_1234567890",
    "plan": "premium",
    "status": "active",
    "currentPeriodStart": "2025-10-04T15:44:33.026Z",
    "currentPeriodEnd": "2025-11-04T15:44:33.026Z",
    "amount": 1999,
    "currency": "usd"
  },
  "sponsorship": {
    "sponsoredUser": {
      "id": "sponsored_123",
      "location": "Iran",
      "status": "active"
    }
  },
  "timestamp": "2025-10-04T15:44:33.026Z"
}
```

**Status Codes:**
- `200 OK` - Subscription created successfully
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Invalid or missing token
- `402 Payment Required` - Payment failed

---

### **GET /api/v1/billing/invoices**
Returns the user's billing history and invoices.

**Request:**
```http
GET /api/v1/billing/invoices
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "invoices": [
    {
      "id": "in_1234567890",
      "amount": 1999,
      "currency": "usd",
      "status": "paid",
      "createdAt": "2025-10-04T15:44:33.026Z",
      "dueDate": "2025-10-04T15:44:33.026Z",
      "description": "Premium VPN Subscription - October 2025"
    }
  ],
  "total": 1,
  "timestamp": "2025-10-04T15:44:33.026Z"
}
```

**Status Codes:**
- `200 OK` - Invoices retrieved successfully
- `401 Unauthorized` - Invalid or missing token

---

### **POST /api/v1/billing/cancel**
Cancels the user's active subscription.

**Request:**
```http
POST /api/v1/billing/cancel
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "reason": "no_longer_needed",
  "feedback": "Optional feedback about cancellation"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Subscription cancelled successfully",
  "subscription": {
    "id": "sub_1234567890",
    "status": "cancelled",
    "cancelledAt": "2025-10-04T15:44:33.026Z",
    "endsAt": "2025-11-04T15:44:33.026Z"
  },
  "timestamp": "2025-10-04T15:44:33.026Z"
}
```

**Status Codes:**
- `200 OK` - Subscription cancelled successfully
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Invalid or missing token
- `404 Not Found` - No active subscription found

---

## 🤝 Sponsorship Endpoints

### **GET /api/v1/sponsorship/matches**
Returns information about sponsored users and matching algorithm.

**Request:**
```http
GET /api/v1/sponsorship/matches
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "sponsoredUsers": [
    {
      "id": "sponsored_123",
      "location": "Iran",
      "urgency": "high",
      "status": "active",
      "matchedAt": "2025-10-04T15:44:33.026Z",
      "impact": {
        "connections": 156,
        "dataTransferred": "2.3GB",
        "lastActive": "2025-10-04T15:44:33.026Z"
      }
    }
  ],
  "totalImpact": {
    "usersSponsored": 1,
    "totalConnections": 156,
    "totalDataTransferred": "2.3GB",
    "countriesReached": 1
  },
  "timestamp": "2025-10-04T15:44:33.026Z"
}
```

**Status Codes:**
- `200 OK` - Sponsorship data retrieved successfully
- `401 Unauthorized` - Invalid or missing token

---

### **POST /api/v1/sponsorship/create**
Creates a new sponsorship for a user in a censored country.

**Request:**
```http
POST /api/v1/sponsorship/create
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "sponsorUserId": "user_123",
  "targetCountry": "Iran",
  "urgency": "high|medium|low",
  "duration": "monthly|yearly"
}
```

**Response:**
```json
{
  "success": true,
  "sponsorship": {
    "id": "sponsorship_123",
    "sponsorUserId": "user_123",
    "sponsoredUserId": "sponsored_456",
    "targetCountry": "Iran",
    "urgency": "high",
    "status": "active",
    "createdAt": "2025-10-04T15:44:33.026Z",
    "expiresAt": "2025-11-04T15:44:33.026Z"
  },
  "sponsoredUser": {
    "id": "sponsored_456",
    "location": "Iran",
    "status": "active",
    "vpnAccess": true
  },
  "timestamp": "2025-10-04T15:44:33.026Z"
}
```

**Status Codes:**
- `201 Created` - Sponsorship created successfully
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Invalid or missing token
- `402 Payment Required` - Payment required for sponsorship

---

## 📊 Analytics Endpoints

### **GET /api/v1/analytics/usage**
Returns user's VPN usage statistics.

**Request:**
```http
GET /api/v1/analytics/usage
Authorization: Bearer <jwt_token>
```

**Query Parameters:**
- `period`: `day|week|month|year` (default: month)
- `startDate`: ISO 8601 date string
- `endDate`: ISO 8601 date string

**Response:**
```json
{
  "usage": {
    "totalConnections": 156,
    "totalDataTransferred": "2.3GB",
    "averageSessionDuration": "45 minutes",
    "mostUsedServer": "gcp-us-central1",
    "mostUsedProtocol": "WireGuard",
    "peakUsageTime": "19:00-21:00"
  },
  "period": {
    "start": "2025-09-04T15:44:33.026Z",
    "end": "2025-10-04T15:44:33.026Z",
    "type": "month"
  },
  "timestamp": "2025-10-04T15:44:33.026Z"
}
```

**Status Codes:**
- `200 OK` - Usage data retrieved successfully
- `400 Bad Request` - Invalid query parameters
- `401 Unauthorized` - Invalid or missing token

---

## 🔧 Admin Endpoints

### **GET /api/v1/admin/servers**
Returns all VPN servers with detailed status (Admin only).

**Request:**
```http
GET /api/v1/admin/servers
Authorization: Bearer <admin_jwt_token>
```

**Response:**
```json
{
  "servers": [
    {
      "id": "gcp-us-central1",
      "name": "US Central VPN Server",
      "location": "Iowa, USA",
      "ip": "34.56.241.36",
      "status": "active",
      "load": "low",
      "connections": 45,
      "maxConnections": 1000,
      "uptime": 240522.199346162,
      "lastHealthCheck": "2025-10-04T15:44:33.026Z",
      "protocols": ["OpenVPN", "WireGuard", "IKEv2"],
      "performance": {
        "cpuUsage": 15.5,
        "memoryUsage": 45.2,
        "networkUsage": 125.8
      }
    }
  ],
  "total": 1,
  "timestamp": "2025-10-04T15:44:33.026Z"
}
```

**Status Codes:**
- `200 OK` - Server data retrieved successfully
- `401 Unauthorized` - Invalid or missing token
- `403 Forbidden` - Insufficient permissions

---

## 🚨 Error Responses

### **Standard Error Format**
All error responses follow this format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": "Additional error details if available"
  },
  "timestamp": "2025-10-04T15:44:33.026Z"
}
```

### **Common Error Codes**
- `INVALID_TOKEN` - JWT token is invalid or expired
- `INSUFFICIENT_PERMISSIONS` - User lacks required permissions
- `VALIDATION_ERROR` - Request data validation failed
- `SERVER_NOT_FOUND` - VPN server not found
- `SUBSCRIPTION_REQUIRED` - Active subscription required
- `RATE_LIMIT_EXCEEDED` - Too many requests
- `PAYMENT_FAILED` - Payment processing failed
- `INTERNAL_ERROR` - Internal server error

---

## 🔄 Rate Limiting

### **Rate Limits**
- **Authentication endpoints**: 5 requests per minute
- **General API endpoints**: 100 requests per minute
- **VPN configuration**: 10 requests per minute
- **Admin endpoints**: 50 requests per minute

### **Rate Limit Headers**
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1696520967
```

---

## 🔐 Security Considerations

### **HTTPS Only**
All API endpoints must be accessed over HTTPS in production.

### **CORS Policy**
- **Allowed Origins**: `https://conservertive.co`, `https://www.conservertive.co`
- **Allowed Methods**: `GET`, `POST`, `PUT`, `DELETE`, `OPTIONS`
- **Allowed Headers**: `Content-Type`, `Authorization`

### **Input Validation**
- All input data is validated using class-validator
- SQL injection prevention through parameterized queries
- XSS prevention through input sanitization

---

## 📚 SDK Examples

### **JavaScript/TypeScript**
```typescript
class ConSERVERtiveAPI {
  private baseUrl = 'https://api.conservertive.co';
  private token: string;

  async getServers() {
    const response = await fetch(`${this.baseUrl}/api/v1/vpn/servers`);
    return response.json();
  }

  async generateConfig(serverId: string, protocol: string) {
    const response = await fetch(`${this.baseUrl}/api/v1/vpn/config`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`
      },
      body: JSON.stringify({ serverId, protocol })
    });
    return response.json();
  }
}
```

### **Python**
```python
import requests

class ConSERVERtiveAPI:
    def __init__(self, token):
        self.base_url = 'https://api.conservertive.co'
        self.headers = {'Authorization': f'Bearer {token}'}
    
    def get_servers(self):
        response = requests.get(f'{self.base_url}/api/v1/vpn/servers')
        return response.json()
    
    def generate_config(self, server_id, protocol):
        data = {'serverId': server_id, 'protocol': protocol}
        response = requests.post(
            f'{self.base_url}/api/v1/vpn/config',
            json=data,
            headers=self.headers
        )
        return response.json()
```

---

## 📞 Support

### **API Support**
- **Documentation**: This document
- **Status Page**: `https://conservertive.co/status`
- **Support Email**: `api-support@conservertive.co`

### **Troubleshooting**
1. Check the `/health` endpoint for service status
2. Verify your JWT token is valid and not expired
3. Ensure you're using HTTPS for all requests
4. Check rate limits if receiving 429 errors

---

**This API documentation is maintained alongside the codebase. Please report any discrepancies or missing information.**

*Last Updated: October 4, 2025*  
*API Version: 1.0.0*

