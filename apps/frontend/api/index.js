// Comprehensive API proxy for all backend routes
export default async function handler(req, res) {
  const backendUrl = 'http://34.66.19.167:3001';
  
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  try {
    // Determine the backend endpoint based on the request
    let backendEndpoint = '';
    
    if (req.url === '/health' || req.url === '/') {
      backendEndpoint = '/health';
    } else if (req.url === '/api/v1/status') {
      backendEndpoint = '/api/v1/status';
    } else if (req.url === '/api/v1/vpn/servers') {
      backendEndpoint = '/api/v1/vpn/servers';
    } else if (req.url === '/api/v1/users/profile') {
      backendEndpoint = '/api/v1/users/profile';
    } else {
      // Default to health check for unknown routes
      backendEndpoint = '/health';
    }
    
    const response = await fetch(`${backendUrl}${backendEndpoint}`);
    const data = await response.json();
    
    res.status(200).json({
      ...data,
      proxy: 'vercel',
      domain: 'api.conservertive.co',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      error: 'Backend API unavailable',
      message: error.message,
      proxy: 'vercel',
      timestamp: new Date().toISOString()
    });
  }
}


