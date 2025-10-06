'use client';

import { useState, useEffect } from 'react';
import { useUser, useAuth } from '@clerk/nextjs';
import { motion } from 'framer-motion';
import {
  ShieldCheckIcon,
  GlobeAltIcon,
  HeartIcon,
  ArrowDownTrayIcon,
  PowerIcon,
  KeyIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import ParallaxStars from '../../components/ParallaxStars';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

interface VpnCredentials {
  username: string;
  password: string;
  serverId: string;
  expiresAt: string;
  isExpired: boolean;
}

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const [vpnCredentials, setVpnCredentials] = useState<VpnCredentials | null>(null);
  const [hasCredentials, setHasCredentials] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchVpnCredentials();
    }
  }, [user]);

  const fetchVpnCredentials = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      
      const response = await fetch('/api/vpn/credentials', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setHasCredentials(data.hasCredentials);
        if (data.hasCredentials) {
          setVpnCredentials(data.credentials);
        }
      } else {
        setError('Failed to fetch VPN credentials');
      }
    } catch (err) {
      setError('Error fetching VPN credentials');
    } finally {
      setLoading(false);
    }
  };

  const generateCredentials = async () => {
    try {
      setLoading(true);
      
      console.log('User:', user);
      console.log('getToken function:', getToken);
      
      // Use the getToken function from useAuth hook
      const token = await getToken();
      
      console.log('User token:', token);
      
      if (!token) {
        throw new Error('No authentication token available');
      }
      
      const response = await fetch('/api/vpn/credentials/generate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (response.ok) {
        const data = await response.json();
        console.log('Response data:', data);
        setVpnCredentials(data.credentials);
        setHasCredentials(true);
        setError(null);
      } else {
        const errorData = await response.text();
        console.error('Error response:', errorData);
        setError(`Failed to generate VPN credentials: ${response.status}`);
      }
    } catch (err) {
      console.error('Error generating VPN credentials:', err);
      setError(`Error generating VPN credentials: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const refreshCredentials = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      
      const response = await fetch('/api/vpn/credentials/refresh', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setVpnCredentials(data.credentials);
        setError(null);
      } else {
        setError('Failed to refresh VPN credentials');
      }
    } catch (err) {
      setError('Error refreshing VPN credentials');
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <div className="text-white text-xl">Please sign in to access your dashboard.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <ParallaxStars />
      
      {/* Header */}
      <Header />
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Welcome back, {user.firstName}!
          </h1>
          <p className="text-xl text-gray-300">
            Manage your VPN connection and fight censorship worldwide
          </p>
        </motion.div>

        {/* VPN Credentials Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="card bg-white/10 backdrop-blur-sm border-white/20 mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <KeyIcon className="h-8 w-8 text-blue-400" />
              <h2 className="text-2xl font-bold text-white">VPN Credentials</h2>
            </div>
            {vpnCredentials?.isExpired && (
              <div className="flex items-center space-x-2 text-red-400">
                <ExclamationTriangleIcon className="h-5 w-5" />
                <span className="text-sm">Expired</span>
              </div>
            )}
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="text-white">Loading VPN credentials...</div>
            </div>
          ) : hasCredentials && vpnCredentials ? (
            <div className="space-y-6">
              {/* Credentials Display */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-black/20 rounded-lg p-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    VPN Username
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={vpnCredentials.username}
                      readOnly
                      className="flex-1 bg-gray-800 text-white px-3 py-2 rounded border border-gray-600"
                    />
                    <button
                      onClick={() => navigator.clipboard.writeText(vpnCredentials.username)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm"
                    >
                      Copy
                    </button>
                  </div>
                </div>

                <div className="bg-black/20 rounded-lg p-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    VPN Password
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="password"
                      value={vpnCredentials.password}
                      readOnly
                      className="flex-1 bg-gray-800 text-white px-3 py-2 rounded border border-gray-600"
                    />
                    <button
                      onClick={() => navigator.clipboard.writeText(vpnCredentials.password)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              </div>

              {/* Expiration Info */}
              <div className="flex items-center space-x-2 text-gray-300">
                <ClockIcon className="h-5 w-5" />
                <span className="text-sm">
                  Expires: {new Date(vpnCredentials.expiresAt).toLocaleDateString()}
                </span>
                {vpnCredentials.isExpired && (
                  <span className="text-red-400 text-sm ml-2">(Expired - Refresh needed)</span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <button
                  onClick={refreshCredentials}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors flex items-center space-x-2"
                >
                  <ArrowDownTrayIcon className="h-4 w-4" />
                  <span>Refresh Credentials</span>
                </button>
                
                <button
                  onClick={() => {
                    const text = `VPN Username: ${vpnCredentials.username}\nVPN Password: ${vpnCredentials.password}\n\nUse these credentials in your ConSERVERtive VPN mobile app or desktop client.`;
                    navigator.clipboard.writeText(text);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors flex items-center space-x-2"
                >
                  <CheckCircleIcon className="h-4 w-4" />
                  <span>Copy All</span>
                </button>
              </div>

              {/* Mobile App Instructions */}
              <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white mb-2">📱 Mobile App Instructions</h3>
                <ol className="text-gray-300 text-sm space-y-1">
                  <li>1. Open the ConSERVERtive VPN mobile app</li>
                  <li>2. Tap "Connect VPN"</li>
                  <li>3. When prompted for password, enter: <code className="bg-gray-800 px-1 rounded">{vpnCredentials.password}</code></li>
                  <li>4. Tap "OK" to connect</li>
                </ol>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-gray-300 mb-4">
                No VPN credentials found. Generate credentials to start using VPN.
              </div>
              <button
                onClick={generateCredentials}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2 mx-auto"
              >
                <KeyIcon className="h-5 w-5" />
                <span>Generate VPN Credentials</span>
              </button>
            </div>
          )}

          {error && (
            <div className="mt-4 bg-red-900/20 border border-red-500/30 rounded-lg p-4">
              <div className="flex items-center space-x-2 text-red-400">
                <ExclamationTriangleIcon className="h-5 w-5" />
                <span>{error}</span>
              </div>
            </div>
          )}
        </motion.div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="card bg-white/10 backdrop-blur-sm border-white/20 text-center"
          >
            <ShieldCheckIcon className="h-12 w-12 text-green-400 mx-auto mb-4" />
            <div className="text-3xl font-bold text-white mb-2">Military-Grade</div>
            <div className="text-gray-300">Encryption</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="card bg-white/10 backdrop-blur-sm border-white/20 text-center"
          >
            <GlobeAltIcon className="h-12 w-12 text-blue-400 mx-auto mb-4" />
            <div className="text-3xl font-bold text-white mb-2">50+</div>
            <div className="text-gray-300">Countries</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="card bg-white/10 backdrop-blur-sm border-white/20 text-center"
          >
            <HeartIcon className="h-12 w-12 text-blue-400 mx-auto mb-4" />
            <div className="text-3xl font-bold text-white mb-2">1</div>
            <div className="text-gray-300">Users Sponsored</div>
          </motion.div>
        </div>

        {/* VPN Connection Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="card bg-white/10 backdrop-blur-sm border-white/20 mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-3 h-3 bg-red-400 rounded-full"></div>
              <div>
                <div className="text-white font-semibold">Disconnected</div>
                <div className="text-gray-300">Use your credentials above to connect</div>
              </div>
            </div>
            <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors flex items-center space-x-2">
              <PowerIcon className="h-4 w-4" />
              <span>Connect</span>
            </button>
          </div>
        </motion.div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}