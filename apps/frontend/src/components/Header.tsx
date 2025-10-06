'use client';

import { useUser, SignOutButton } from '@clerk/nextjs';
import { usePathname } from 'next/navigation';

interface HeaderProps {
  className?: string;
}

export default function Header({ className = '' }: HeaderProps) {
  const { user, isLoaded } = useUser();
  const pathname = usePathname();

  // Check if Clerk is properly configured
  const isClerkConfigured = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && 
    !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.includes('YOUR_CLERK_PUBLISHABLE_KEY_HERE');

  // Check if we're on the dashboard page
  const isOnDashboard = pathname === '/dashboard';

  return (
    <nav className={`relative px-6 py-4 z-10 ${className}`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <a href="/">
            <img 
              src="/conservertive_logo_light_500px.png" 
              alt="ConSERVERtive VPN" 
              className="h-10 w-auto"
            />
          </a>
        </div>
        <div className="hidden md:flex items-center space-x-8">
          <a href="/#features" className="text-gray-300 hover:text-white transition-colors text-base font-medium">Features</a>
          <a href="/#pricing" className="text-gray-300 hover:text-white transition-colors text-base font-medium">Pricing</a>
          <a href="/#impact" className="text-gray-300 hover:text-white transition-colors text-base font-medium">Impact</a>
          <a href="/our-why" className="text-gray-300 hover:text-white transition-colors text-base font-medium">Our Why</a>
          {!isClerkConfigured ? (
            <button 
              className="btn-primary"
              onClick={() => alert('Please configure Clerk authentication keys in .env.local')}
            >
              Get Started
            </button>
          ) : isLoaded && user ? (
            isOnDashboard ? (
              <SignOutButton>
                <button className="btn-primary">
                  Log-out
                </button>
              </SignOutButton>
            ) : (
              <a href="/dashboard" className="btn-primary">
                Dashboard
              </a>
            )
          ) : (
            <a href="/onboarding" className="btn-primary">
              Get Started
            </a>
          )}
        </div>
      </div>
    </nav>
  );
}
