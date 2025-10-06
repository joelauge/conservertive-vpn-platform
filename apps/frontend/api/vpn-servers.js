// Vercel serverless function to proxy VPN servers API calls
export default async function handler(req, res) {
  const backendUrl = 'http://34.66.19.167:3001';
  
  try {
    const response = await fetch(`${backendUrl}/api/v1/vpn/servers`);
    const data = await response.json();
    
    // Add CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    res.status(200).json({
      ...data,
      proxy: 'vercel',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      error: 'Backend API unavailable',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
}


