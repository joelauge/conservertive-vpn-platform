import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  
  // Get the backend URL from environment
  const backendUrl = process.env.BACKEND_URL || 'http://34.66.19.167:3001';
  
  // Forward the request to the backend
  try {
    const response = await fetch(`${backendUrl}/vpn/credentials/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': req.headers.authorization || '',
      },
    });

    const data = await response.json();
    
    res.status(response.status).json(data);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
