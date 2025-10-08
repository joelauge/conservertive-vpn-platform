import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import axios from 'axios';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const response = await axios.get(
      `${BACKEND_URL}/vpn/credentials`,
      {
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json',
        },
      }
    );

    return NextResponse.json(response.data, { status: response.status });
  } catch (error: any) {
    console.error('API Error:', error.response?.data || error.message);
    return NextResponse.json(
      { error: error.response?.data?.message || 'Internal server error' },
      { status: error.response?.status || 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const response = await axios.post(
      `${BACKEND_URL}/vpn/credentials/generate`,
      {},
      {
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json',
        },
      }
    );

    return NextResponse.json(response.data, { status: response.status });
  } catch (error: any) {
    console.error('API Error:', error.response?.data || error.message);
    return NextResponse.json(
      { error: error.response?.data?.message || 'Internal server error' },
      { status: error.response?.status || 500 }
    );
  }
}
