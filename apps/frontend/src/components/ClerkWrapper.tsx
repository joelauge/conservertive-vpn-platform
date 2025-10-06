'use client';

import { ReactNode } from 'react';

// Conditionally import Clerk components
let useUser: any = null;
let SignInButton: any = null;
let SignUpButton: any = null;

try {
  const clerk = require('@clerk/nextjs');
  useUser = clerk.useUser;
  SignInButton = clerk.SignInButton;
  SignUpButton = clerk.SignUpButton;
} catch (error) {
  // Clerk not available or not configured
  console.log('Clerk not available:', error.message);
}

interface ClerkWrapperProps {
  children: (props: {
    user: any;
    isLoaded: boolean;
    isClerkConfigured: boolean;
    SignInButton: any;
    SignUpButton: any;
  }) => ReactNode;
}

export default function ClerkWrapper({ children }: ClerkWrapperProps) {
  // Check if Clerk is properly configured
  const isClerkConfigured = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && 
    !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.includes('YOUR_CLERK_PUBLISHABLE_KEY_HERE');

  // Only use Clerk hooks if Clerk is properly configured and available
  let user = null;
  let isLoaded = true;

  if (isClerkConfigured && useUser) {
    try {
      const clerkUser = useUser();
      user = clerkUser.user;
      isLoaded = clerkUser.isLoaded;
    } catch (error) {
      console.log('Error using Clerk hook:', error.message);
      user = null;
      isLoaded = true;
    }
  }

  return (
    <>
      {children({
        user,
        isLoaded,
        isClerkConfigured,
        SignInButton,
        SignUpButton,
      })}
    </>
  );
}


