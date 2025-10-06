'use client';

import { motion } from 'framer-motion';
import { 
  CheckCircleIcon, 
  SparklesIcon, 
  ArrowRightIcon,
  HeartIcon,
  GlobeAltIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import ParallaxStars from '../components/ParallaxStars';

interface PaymentSuccessProps {
  planName: string;
  planPrice: number;
  sponsorCount: number;
}

export default function PaymentSuccess({ planName, planPrice, sponsorCount }: PaymentSuccessProps) {
  return (
    <div className="min-h-screen relative">
      <ParallaxStars />
      
      <div className="relative z-10 px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Success Animation */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-32 h-32 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-8"
          >
            <SparklesIcon className="w-16 h-16 text-white" />
          </motion.div>
          
          {/* Success Message */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-5xl font-bold text-white mb-6"
          >
            Payment Successful! 🎉
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto"
          >
            Welcome to ConSERVERtive VPN! Your subscription is now active and you're helping fight for internet freedom worldwide.
          </motion.p>

          {/* Subscription Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-white/10 backdrop-blur-sm border-white/20 rounded-xl p-8 max-w-md mx-auto mb-8"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Subscription Details</h3>
            <div className="space-y-3 text-left">
              <div className="flex justify-between">
                <span className="text-gray-300">Plan</span>
                <span className="text-white font-semibold">{planName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Price</span>
                <span className="text-white font-semibold">${planPrice}/month</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Status</span>
                <span className="text-green-400 font-semibold">Active</span>
              </div>
              {sponsorCount > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-300">Impact</span>
                  <span className="text-green-400 font-semibold">
                    Sponsoring {sponsorCount} free user{sponsorCount > 1 ? 's' : ''}
                  </span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Impact Message */}
          {sponsorCount > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
              className="bg-green-500/20 border border-green-500/30 rounded-xl p-6 max-w-md mx-auto mb-8"
            >
              <div className="flex items-center justify-center text-green-400 mb-4">
                <HeartIcon className="w-6 h-6 mr-2" />
                <span className="text-lg font-semibold">You're Making a Difference!</span>
              </div>
              <p className="text-green-300 text-sm">
                Your subscription is now sponsoring {sponsorCount} free user{sponsorCount > 1 ? 's' : ''} in censored countries. 
                They can now access the free internet thanks to you!
              </p>
            </motion.div>
          )}

          {/* Next Steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="bg-white/10 backdrop-blur-sm border-white/20 rounded-xl p-8 max-w-2xl mx-auto mb-8"
          >
            <h3 className="text-lg font-semibold text-white mb-6">What's Next?</h3>
            <div className="grid md:grid-cols-2 gap-6 text-left">
              <div className="space-y-4">
                <div className="flex items-start">
                  <CheckCircleIcon className="w-6 h-6 text-green-400 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-white font-semibold mb-1">Generate VPN Credentials</h4>
                    <p className="text-gray-400 text-sm">Create your personal VPN username and password</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircleIcon className="w-6 h-6 text-green-400 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-white font-semibold mb-1">Download Mobile App</h4>
                    <p className="text-gray-400 text-sm">Get the ConSERVERtive VPN app for iOS and Android</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start">
                  <CheckCircleIcon className="w-6 h-6 text-green-400 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-white font-semibold mb-1">Track Your Impact</h4>
                    <p className="text-gray-400 text-sm">Monitor your sponsorship impact on the dashboard</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircleIcon className="w-6 h-6 text-green-400 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-white font-semibold mb-1">Connect to Servers</h4>
                    <p className="text-gray-400 text-sm">Access 50+ global VPN servers worldwide</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <a
              href="/dashboard"
              className="btn-primary text-lg px-8 py-4"
            >
              Go to Dashboard
              <ArrowRightIcon className="w-5 h-5 ml-2" />
            </a>
            <a
              href="/mobile-app"
              className="btn-secondary text-lg px-8 py-4"
            >
              Download Mobile App
            </a>
          </motion.div>

          {/* Security Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6 }}
            className="mt-12 flex items-center justify-center text-gray-400"
          >
            <ShieldCheckIcon className="w-5 h-5 mr-2" />
            <span className="text-sm">Your payment is secured with 256-bit SSL encryption</span>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
