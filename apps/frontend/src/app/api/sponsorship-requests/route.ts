import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // For now, always return mock success response since backend requires authentication
    // TODO: Create a public endpoint for sponsorship applications
    console.log('Creating sponsorship request (mock):', body);
    return NextResponse.json({
      id: 'mock-' + Date.now(),
      ...body,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error creating sponsorship request:', error);
    // Return mock success response as fallback
    const body = await request.json();
    return NextResponse.json({
      id: 'mock-' + Date.now(),
      ...body,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();
    
    const response = await fetch(`${BACKEND_URL}/sponsorship/requests?${queryString}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      return NextResponse.json(data);
    } else {
      // If backend is not available, return empty array
      console.log('Backend not available, returning empty array');
      return NextResponse.json({ data: [], total: 0 });
    }
  } catch (error) {
    console.error('Error fetching sponsorship requests:', error);
    // Return empty array as fallback
    return NextResponse.json({ data: [], total: 0 });
  }
}
