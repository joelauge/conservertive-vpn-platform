import { NextApiRequest, NextApiResponse } from 'next';
import { getAuth } from '@clerk/nextjs/server';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  
  const { userId } = getAuth(req);
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const backendUrl = process.env.BACKEND_URL || 'http://34.66.19.167:3001';
    
    const response = await axios.get(
      `${backendUrl}/vpn/credentials`,
      {
        headers: {
          'Authorization': req.headers.authorization || `Bearer ${userId}`,
          'Content-Type': 'application/json',
        },
      }
    );

    res.status(response.status).json(response.data);
  } catch (error: any) {
    console.error('API Error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: error.response?.data?.message || 'Internal server error'
    });
  }
}
