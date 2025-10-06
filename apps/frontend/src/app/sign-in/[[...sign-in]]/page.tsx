'use client';

import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center px-6">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <img 
            src="/conservertive_logo_light_500px.png" 
            alt="ConSERVERtive VPN" 
            className="h-16 w-auto mx-auto mb-4"
          />
          <h1 className="text-3xl font-semibold text-white mb-2">Welcome Back</h1>
          <p className="text-gray-300">Sign in to your ConSERVERtive VPN account</p>
        </div>
        <SignIn 
          appearance={{
            elements: {
              formButtonPrimary: 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white',
              card: 'bg-white/10 backdrop-blur-sm border-white/20',
              headerTitle: 'text-white',
              headerSubtitle: 'text-gray-300',
              socialButtonsBlockButton: 'bg-white/10 border-white/20 text-white hover:bg-white/20',
              formFieldInput: 'bg-white/10 border-white/20 text-white',
              formFieldLabel: 'text-gray-300',
              footerActionLink: 'text-blue-400 hover:text-blue-300',
              identityPreviewText: 'text-gray-300',
              formResendCodeLink: 'text-blue-400 hover:text-blue-300',
            }
          }}
        />
      </div>
    </div>
  );
}
