'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheckIcon,
  GlobeAltIcon,
  HeartIcon,
  ArrowRightIcon,
  CheckCircleIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import ParallaxStars from '../components/ParallaxStars';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useUser, SignInButton, SignUpButton } from '@clerk/nextjs';

export default function HomePage() {
  const [isConnected, setIsConnected] = useState(false);
  const { user, isLoaded } = useUser();

  // Check if Clerk is properly configured
  const isClerkConfigured = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && 
    !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.includes('YOUR_CLERK_PUBLISHABLE_KEY_HERE') &&
    !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.includes('pk_test_your_clerk_publishable_key_here');

  const features = [
    {
      icon: ShieldCheckIcon,
      title: 'Military-Grade Encryption',
      description: 'AES-256 encryption protects your data from prying eyes',
    },
    {
      icon: GlobeAltIcon,
      title: 'Global Server Network',
      description: '50+ servers worldwide for optimal speed and reliability',
    },
    {
      icon: HeartIcon,
      title: 'Fight Censorship',
      description: 'Help users in censored countries access the free internet',
    },
  ];

  const stats = [
    { label: 'Countries Served', value: '50+' },
    { label: 'Users Protected', value: '100K+' },
    { label: 'Uptime', value: '99.9%' },
    { label: 'Censorship Bypassed', value: '95%' },
  ];

  return (
    <div className="min-h-screen relative">
      <ParallaxStars />
      
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="relative px-6 py-20 z-10">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-semibold text-white mb-6 leading-tight">
              Fight for
              <span className="text-gradient font-light">
                {' '}Internet Freedom
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto font-light leading-relaxed">
              ConSERVERtive VPN provides secure, private internet access while combating censorship worldwide. 
              Every paid account sponsors a free user in a censored country.
            </p>
            
            {/* Hero Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mb-12 flex justify-center"
            >
              <img 
                src="/CS_Apps.png" 
                alt="ConSERVERtive Apps" 
                className="max-w-full h-auto rounded-lg"
                style={{ maxHeight: '600px' }}
              />
            </motion.div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!isClerkConfigured ? (
                <button 
                  className="bg-gradient-primary hover:opacity-90 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all transform hover:scale-105"
                  onClick={() => alert('Please configure Clerk authentication keys in .env.local')}
                >
                  Start Free Trial
                  <ArrowRightIcon className="inline-block ml-2 h-5 w-5" />
                </button>
              ) : isLoaded && user ? (
                <a 
                  href="/dashboard"
                  className="bg-gradient-primary hover:opacity-90 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all transform hover:scale-105"
                >
                  Go to Dashboard
                  <ArrowRightIcon className="inline-block ml-2 h-5 w-5" />
                </a>
              ) : (
                <SignUpButton mode="modal">
                  <button className="bg-gradient-primary hover:opacity-90 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all transform hover:scale-105">
                    Start Free Trial
                    <ArrowRightIcon className="inline-block ml-2 h-5 w-5" />
                  </button>
                </SignUpButton>
              )}
              <button className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 rounded-lg text-lg font-semibold transition-all">
                Learn More
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-6 py-16 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-semibold text-white mb-2 tracking-tight">
                  {stat.value}
                </div>
                <div className="text-gray-400 font-light">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-6 py-20 relative z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
                <h2 className="text-4xl md:text-5xl font-semibold text-white mb-6 leading-tight flex flex-col md:flex-row items-center justify-center gap-3">
                  <span className="flex flex-col md:flex-row items-center gap-3">
                    <span>Why Choose</span>
                    <img src="/conservertive_logo_light_500px.png" alt="ConSERVERtive" className="h-12 md:h-16 w-auto" />
                    <span>?</span>
                  </span>
                </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto font-light leading-relaxed">
              We're not just another VPN. We're a movement for internet freedom.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="card bg-white/10 backdrop-blur-sm border-white/20"
              >
                <feature.icon className="h-12 w-12 text-blue-400 mb-4" />
                <h3 className="text-2xl font-semibold text-white mb-4 leading-tight">{feature.title}</h3>
                <p className="text-gray-300 font-light leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

       {/* VPN Protocols Section */}
       <section className="px-6 py-20 bg-gradient-to-r from-gray-800/30 to-gray-900/30 relative z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-semibold text-white mb-6 leading-tight">
              Enterprise-Grade VPN Protocols
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto font-light leading-relaxed">
              Choose from three cutting-edge protocols, each optimized for different use cases and security requirements.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* OpenVPN */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="card bg-white/10 backdrop-blur-sm border-white/20"
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShieldCheckIcon className="h-8 w-8 text-blue-400" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-2">OpenVPN</h3>
                <span className="text-sm text-blue-400 font-semibold">Port 1194</span>
              </div>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-white font-semibold">Battle-Tested Security</h4>
                    <p className="text-gray-300 text-sm">20+ years of proven reliability in enterprise environments</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-white font-semibold">Universal Compatibility</h4>
                    <p className="text-gray-300 text-sm">Works on all devices and operating systems</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-white font-semibold">AES-256 Encryption</h4>
                    <p className="text-gray-300 text-sm">Military-grade encryption with perfect forward secrecy</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* WireGuard */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="card bg-white/10 backdrop-blur-sm border-white/20"
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <StarIcon className="h-8 w-8 text-purple-400" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-2">WireGuard</h3>
                <span className="text-sm text-purple-400 font-semibold">Port 51820</span>
              </div>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-white font-semibold">Lightning Fast</h4>
                    <p className="text-gray-300 text-sm">Next-generation protocol with minimal overhead</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-white font-semibold">Modern Cryptography</h4>
                    <p className="text-gray-300 text-sm">ChaCha20 encryption with Poly1305 authentication</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-white font-semibold">Mobile Optimized</h4>
                    <p className="text-gray-300 text-sm">Seamless reconnection and battery efficiency</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* IKEv2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="card bg-white/10 backdrop-blur-sm border-white/20"
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <GlobeAltIcon className="h-8 w-8 text-green-400" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-2">IKEv2</h3>
                <span className="text-sm text-green-400 font-semibold">Ports 500 & 4500</span>
              </div>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-white font-semibold">Auto-Reconnect</h4>
                    <p className="text-gray-300 text-sm">Instant reconnection when switching networks</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-white font-semibold">NAT Traversal</h4>
                    <p className="text-gray-300 text-sm">Works behind restrictive firewalls and NATs</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircleIcon className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-white font-semibold">Enterprise Standard</h4>
                    <p className="text-gray-300 text-sm">Used by Fortune 500 companies worldwide</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Enterprise Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-16 text-center"
          >
            <h3 className="text-3xl font-semibold text-white mb-8">Enterprise-Grade Infrastructure</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <ShieldCheckIcon className="h-6 w-6 text-blue-400" />
                </div>
                <h4 className="text-white font-semibold mb-2">Zero-Logs Policy</h4>
                <p className="text-gray-300 text-sm">Independently audited no-logs policy</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircleIcon className="h-6 w-6 text-green-400" />
                </div>
                <h4 className="text-white font-semibold mb-2">99.9% Uptime</h4>
                <p className="text-gray-300 text-sm">Redundant infrastructure guarantees reliability</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <StarIcon className="h-6 w-6 text-purple-400" />
                </div>
                <h4 className="text-white font-semibold mb-2">24/7 Support</h4>
                <p className="text-gray-300 text-sm">Expert technical support around the clock</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <GlobeAltIcon className="h-6 w-6 text-orange-400" />
                </div>
                <h4 className="text-white font-semibold mb-2">Global Network</h4>
                <p className="text-gray-300 text-sm">High-speed servers in 50+ countries</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

        {/* Pricing Section */}
        <section id="pricing" className="px-6 py-20 relative z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-semibold text-white mb-6 leading-tight">
              Choose Your Impact
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto font-light leading-relaxed">
              Your $9.99 subscription automatically sponsors one person in a censored country. 
              You can choose who to sponsor or let us pick someone who needs help.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            {/* Base Plan - Main Focus */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-8 mb-8"
            >
              <div className="text-center">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
                <h3 className="text-3xl font-semibold text-white mb-4">ConSERVERtive VPN</h3>
                <div className="text-5xl font-bold text-white mb-4">
                  $9.99<span className="text-xl text-gray-400">/month</span>
                </div>
                <p className="text-gray-300 mb-6 text-lg">
                  Essential VPN protection + automatic sponsorship
                </p>
                
                <ul className="text-gray-300 space-y-3 mb-8 text-left max-w-md mx-auto">
                  <li className="flex items-center">
                    <CheckCircleIcon className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                    Military-grade encryption
                  </li>
                  <li className="flex items-center">
                    <CheckCircleIcon className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                    50+ global servers
                  </li>
                  <li className="flex items-center">
                    <CheckCircleIcon className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                    No-logs policy
                  </li>
                  <li className="flex items-center">
                    <CheckCircleIcon className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                    24/7 support
                  </li>
                  <li className="flex items-center">
                    <CheckCircleIcon className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                    <span className="text-green-400 font-semibold">Sponsor 1 person automatically</span>
                  </li>
                </ul>
                
                <div className="bg-green-500/30 border border-green-500/50 rounded-lg p-6 mb-8 backdrop-blur-sm">
                  <div className="flex items-center justify-center text-green-400 mb-4">
                    <HeartIcon className="w-6 h-6 mr-3" />
                    <span className="text-lg font-semibold">Your Impact</span>
                  </div>
                  <p className="text-gray-300">
                    Your subscription automatically pays for someone in a censored country to access the free internet. 
                    You can choose who to sponsor or we'll pick someone who needs help.
                  </p>
                </div>
                
                {!isClerkConfigured ? (
                  <button 
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 px-8 rounded-lg font-semibold transition-all transform hover:scale-105 text-lg"
                    onClick={() => alert('Please configure Clerk authentication keys in .env.local')}
                  >
                    Get Started
                  </button>
                ) : (
                  <a href="/onboarding" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 px-8 rounded-lg font-semibold transition-all transform hover:scale-105 text-lg block text-center">
                    Get Started
                  </a>
                )}
              </div>
            </motion.div>

            {/* Additional Sponsorship Options */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 mb-8"
            >
              <div className="text-center mb-6">
                <h3 className="text-2xl font-semibold text-white mb-4">Add More Sponsorships</h3>
                <p className="text-gray-300 mb-6">
                  Each additional sponsorship costs $9.99 and helps another person access the free internet.
                </p>
                
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6">
                    <h4 className="text-xl font-semibold text-white mb-2">+1 Sponsorship</h4>
                    <div className="text-3xl font-bold text-white mb-4">$9.99<span className="text-lg text-gray-400">/month</span></div>
                    <p className="text-gray-300 text-sm">Help one more person access the free internet</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6">
                    <h4 className="text-xl font-semibold text-white mb-2">+3 Sponsorships</h4>
                    <div className="text-3xl font-bold text-white mb-4">$29.97<span className="text-lg text-gray-400">/month</span></div>
                    <p className="text-gray-300 text-sm">Help three more people access the free internet</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6">
                    <h4 className="text-xl font-semibold text-white mb-2">+5 Sponsorships</h4>
                    <div className="text-3xl font-bold text-white mb-4">$49.95<span className="text-lg text-gray-400">/month</span></div>
                    <p className="text-gray-300 text-sm">Help five more people access the free internet</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Total Monthly Cost Display */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="bg-gradient-to-r from-gray-700/20 to-gray-800/20 backdrop-blur-sm rounded-xl p-8 border border-white/20"
            >
              <div className="text-center">
                <h3 className="text-2xl font-semibold text-white mb-4">Total Monthly Cost</h3>
                <div className="text-4xl font-bold text-white mb-2">
                  $9.99<span className="text-lg text-gray-400">/month</span>
                </div>
                <p className="text-gray-300">
                  Base VPN subscription + automatic sponsorship
                </p>
                <div className="mt-4 text-green-400 font-semibold">
                  ✓ Automatically sponsors 1 person in a censored country
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

        {/* Impact Section */}
        <section id="impact" className="px-6 py-20 bg-gradient-to-r from-gray-800/50 to-gray-900/50 relative z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-semibold text-white mb-6 leading-tight">
              Our Impact
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto font-light leading-relaxed">
              See how ConSERVERtive VPN is making a real difference in the fight for internet freedom.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {/* Impact Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-center"
            >
              <div className="text-5xl font-bold text-green-400 mb-4">1,247</div>
              <div className="text-xl text-white font-semibold mb-2">Users Sponsored</div>
              <div className="text-gray-300">Free VPN access provided to users in censored countries</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center"
            >
              <div className="text-5xl font-bold text-blue-400 mb-4">47</div>
              <div className="text-xl text-white font-semibold mb-2">Countries Reached</div>
              <div className="text-gray-300">Censored countries where we've provided free access</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-center"
            >
              <div className="text-5xl font-bold text-purple-400 mb-4">98.7%</div>
              <div className="text-xl text-white font-semibold mb-2">Success Rate</div>
              <div className="text-gray-300">Successful censorship bypass rate</div>
            </motion.div>
          </div>

          {/* Success Stories */}
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="card bg-white/10 backdrop-blur-sm border-white/20"
            >
              <div className="flex items-start space-x-4">
                <img 
                  src="/ahmed-avatar.png" 
                  alt="Ahmed from Iran" 
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Ahmed from Iran</h3>
                  <p className="text-gray-300 leading-relaxed">
                    "Thanks to ConSERVERtive VPN, I can access educational resources and connect with the global community. 
                    The sponsorship program gave me hope when I had none."
                  </p>
                  <div className="text-green-400 text-sm mt-2">Sponsored by Premium user</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="card bg-white/10 backdrop-blur-sm border-white/20"
            >
              <div className="flex items-start space-x-4">
                <img 
                  src="/maria-avatar.png" 
                  alt="Maria from Venezuela" 
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Maria from Venezuela</h3>
                  <p className="text-gray-300 leading-relaxed">
                    "I can now access news from around the world and communicate with my family abroad. 
                    ConSERVERtive VPN's sponsorship program changed my life."
                  </p>
                  <div className="text-green-400 text-sm mt-2">Sponsored by Direct sponsor</div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-center mt-16"
          >
            <h3 className="text-3xl font-semibold text-white mb-4">
              Be Part of the Solution
            </h3>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Every subscription directly sponsors a user in a censored country. Your payment becomes their freedom.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all transform hover:scale-105">
                Start Sponsoring Today
              </button>
              <button className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 rounded-lg text-lg font-semibold transition-all">
                View Impact Report
              </button>
            </div>
          </motion.div>
        </div>
      </section>

        {/* CTA Section */}
        <section className="px-6 py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-gradient-to-r from-gray-700/20 to-gray-800/20 backdrop-blur-sm rounded-2xl p-12 border border-white/20"
          >
            <h2 className="text-4xl md:text-5xl font-semibold text-white mb-6 leading-tight">
              Ready to Make a Difference?
            </h2>
            <p className="text-xl text-gray-300 mb-8 font-light leading-relaxed">
              Join thousands of users fighting for internet freedom. Your subscription helps someone in a censored country access the free internet.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!isClerkConfigured ? (
                <button 
                  className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all transform hover:scale-105"
                  onClick={() => alert('Please configure Clerk authentication keys in .env.local')}
                >
                  <HeartIcon className="inline-block mr-2 h-5 w-5" />
                  Start Sponsoring Today
                </button>
              ) : (
                <SignUpButton mode="modal">
                  <button className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all transform hover:scale-105">
                    <HeartIcon className="inline-block mr-2 h-5 w-5" />
                    Start Sponsoring Today
                  </button>
                </SignUpButton>
              )}
              <button className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 rounded-lg text-lg font-semibold transition-all">
                View Impact Report
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
