#!/usr/bin/env node

const http = require('http');

// Test the sponsorship system endpoints
async function testSponsorshipSystem() {
  console.log('🧪 Testing ConSERVERtive Sponsorship System\n');

  const baseUrl = 'http://localhost:3001';
  
  const endpoints = [
    '/api/sponsorship/stats',
    '/api/sponsorship/matching-info',
    '/api/sponsorship/censorship-stats',
    '/api/sponsorship/success-stories',
    '/api/sponsorship/dashboard',
    '/api/sponsorship/requests/pending',
  ];

  console.log('🔍 Testing Sponsorship API Endpoints...\n');

  for (const endpoint of endpoints) {
    try {
      console.log(`Testing: ${endpoint}`);
      
      const response = await makeRequest(`${baseUrl}${endpoint}`);
      
      if (response.statusCode === 200) {
        console.log(`✅ ${endpoint} - OK`);
        try {
          const data = JSON.parse(response.body);
          console.log(`   Response: ${JSON.stringify(data, null, 2).substring(0, 200)}...`);
        } catch (e) {
          console.log(`   Response: ${response.body.substring(0, 200)}...`);
        }
      } else {
        console.log(`❌ ${endpoint} - Status: ${response.statusCode}`);
        console.log(`   Error: ${response.body.substring(0, 200)}...`);
      }
    } catch (error) {
      console.log(`❌ ${endpoint} - Error: ${error.message}`);
    }
    console.log('');
  }

  console.log('🎯 Testing Sponsorship Matching Algorithm...\n');
  
  // Test creating a sponsorship request
  const testRequest = {
    userId: 'test-user-123',
    country: 'CN',
    reason: 'Journalist needs secure communication',
    urgency: 'high',
    ipAddress: '1.2.3.4',
    userAgent: 'Test Agent'
  };

  try {
    console.log('Creating test sponsorship request...');
    const response = await makeRequest(`${baseUrl}/api/sponsorship/requests`, 'POST', testRequest);
    
    if (response.statusCode === 201 || response.statusCode === 200) {
      console.log('✅ Sponsorship request created successfully');
      const data = JSON.parse(response.body);
      console.log(`   Request ID: ${data.id}`);
      console.log(`   Status: ${data.status}`);
    } else {
      console.log(`❌ Failed to create sponsorship request - Status: ${response.statusCode}`);
      console.log(`   Error: ${response.body}`);
    }
  } catch (error) {
    console.log(`❌ Error creating sponsorship request: ${error.message}`);
  }

  console.log('\n🎉 Sponsorship System Test Complete!');
}

function makeRequest(url, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = http.request(url, options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: body,
        });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

// Check if backend is running first
async function checkBackendHealth() {
  try {
    const response = await makeRequest('http://localhost:3001/health');
    if (response.statusCode === 200) {
      console.log('✅ Backend is running and healthy');
      return true;
    } else {
      console.log(`❌ Backend health check failed - Status: ${response.statusCode}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Backend is not running - Error: ${error.message}`);
    console.log('💡 Please start the backend with: node dist/apps/backend/src/main.js');
    return false;
  }
}

// Main execution
async function main() {
  console.log('🚀 ConSERVERtive Sponsorship System Test Suite\n');
  
  const isHealthy = await checkBackendHealth();
  
  if (isHealthy) {
    await testSponsorshipSystem();
  } else {
    console.log('\n🔧 Backend Setup Instructions:');
    console.log('1. Start PostgreSQL and Redis: docker-compose up postgres redis -d');
    console.log('2. Start the backend: node dist/apps/backend/src/main.js');
    console.log('3. Run this test again: node scripts/test-sponsorship-system.js');
  }
}

main().catch(console.error);
