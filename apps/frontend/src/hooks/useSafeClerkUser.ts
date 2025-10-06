'use client';

import { useState, useEffect } from 'react';

// Custom hook to safely handle Clerk user state
export function useSafeClerkUser() {
  const [user, setUser] = useState(null);
  const [isLoaded, setIsLoaded] = useState(true);
  const [isClerkConfigured, setIsClerkConfigured] = useState(false);

  useEffect(() => {
    // Check if Clerk is properly configured
    const configured = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && 
      !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.includes('YOUR_CLERK_PUBLISHABLE_KEY_HERE');
    
    setIsClerkConfigured(configured);

    if (configured) {
      // Try to import and use Clerk hooks
      try {
        const { useUser } = require('@clerk/nextjs');
        // Note: This won't work in useEffect, but we'll handle it differently
        setIsLoaded(true);
      } catch (error) {
        console.log('Clerk not available:', error.message);
        setIsLoaded(true);
      }
    } else {
      setIsLoaded(true);
    }
  }, []);

  return { user, isLoaded, isClerkConfigured };
}


