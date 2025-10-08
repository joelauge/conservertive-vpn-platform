import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3001';

// Mock data for when backend is not available
const mockApplicants = [
  {
    id: 'mock-1',
    firstName: 'Ahmad',
    lastName: 'Hassan',
    country: 'IR',
    urgency: 'high',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    daysSinceApplication: 2,
    minutesSinceApplication: 2880,
    profilePicture: 'https://ui-avatars.com/api/?name=Ahmad+Hassan&background=random&color=fff&size=128',
    reason: 'I need access to social media platforms and news websites that are blocked in Iran.'
  },
  {
    id: 'mock-2',
    firstName: 'Wei',
    lastName: 'Chen',
    country: 'CN',
    urgency: 'medium',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    daysSinceApplication: 1,
    minutesSinceApplication: 1440,
    profilePicture: 'https://ui-avatars.com/api/?name=Wei+Chen&background=random&color=fff&size=128',
    reason: 'I need to access educational resources and research papers that are restricted in China.'
  },
  {
    id: 'mock-3',
    firstName: 'Dmitri',
    lastName: 'Petrov',
    country: 'RU',
    urgency: 'high',
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    daysSinceApplication: 0,
    minutesSinceApplication: 180,
    profilePicture: 'https://ui-avatars.com/api/?name=Dmitri+Petrov&background=random&color=fff&size=128',
    reason: 'I need to access independent news sources and communicate with family abroad.'
  },
  {
    id: 'mock-4',
    firstName: 'Maria',
    lastName: 'Rodriguez',
    country: 'CU',
    urgency: 'medium',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    daysSinceApplication: 5,
    minutesSinceApplication: 7200,
    profilePicture: 'https://ui-avatars.com/api/?name=Maria+Rodriguez&background=random&color=fff&size=128',
    reason: 'I need to access educational content and communicate with family members who live abroad.'
  },
  {
    id: 'mock-5',
    firstName: 'Kim',
    lastName: 'Jong',
    country: 'KP',
    urgency: 'high',
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
    daysSinceApplication: 0,
    minutesSinceApplication: 60,
    profilePicture: 'https://ui-avatars.com/api/?name=Kim+Jong&background=random&color=fff&size=128',
    reason: 'I need access to educational resources and information about the outside world.'
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') || '10';
    
    const response = await fetch(`${BACKEND_URL}/sponsorship-requests/available/applicants?limit=${limit}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      return NextResponse.json(data);
    } else {
      // If backend is not available, return mock data
      console.log('Backend not available, returning mock data');
      return NextResponse.json(mockApplicants.slice(0, parseInt(limit)));
    }
  } catch (error) {
    console.error('Error fetching available applicants:', error);
    // Return mock data as fallback
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    return NextResponse.json(mockApplicants.slice(0, limit));
  }
}
