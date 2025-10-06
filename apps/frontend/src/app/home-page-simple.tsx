'use client';

import { useState } from 'react';

export default function HomePage() {
  const [isConnected, setIsConnected] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-6">
          ConSERVERtive VPN - Test Page
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          This is a simplified test page to verify the server is working.
        </p>
        <div className="bg-white/10 backdrop-blur-sm border-white/20 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold text-white mb-4">Status</h2>
          <p className="text-gray-300">
            Server is running: ✅<br/>
            Clerk integration: Pending<br/>
            VPN protocols: Ready
          </p>
        </div>
      </div>
    </div>
  );
}


