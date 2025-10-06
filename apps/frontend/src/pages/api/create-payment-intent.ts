import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { getAuth } from '@clerk/nextjs/server';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { userId } = getAuth(req);
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { planId, email } = req.body;

  if (!planId || !email) {
    return res.status(400).json({ message: 'Missing planId or email' });
  }

  try {
    const token = req.headers.authorization;
    const backendRes = await axios.post(`${process.env.BACKEND_URL || 'http://34.66.19.167:3001'}/api/v1/billing/create-payment-intent`, {
      planId,
      email,
      userId,
    }, {
      headers: { Authorization: token },
    });

    res.status(backendRes.status).json(backendRes.data);
  } catch (error: any) {
    console.error('Error creating payment intent:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({ message: error.response?.data?.message || 'Internal server error' });
  }
}
