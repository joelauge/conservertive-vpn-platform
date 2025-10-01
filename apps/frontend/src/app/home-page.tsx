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

export default function HomePage() {
  const [isConnected, setIsConnected] = useState(false);

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
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      {/* Navigation */}
      <nav className="relative px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <img 
              src="/conservertive_logo_light_500px.png" 
              alt="ConSERVERtive VPN" 
              className="h-10 w-auto"
            />
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-300 hover:text-white transition-colors text-base font-medium">Features</a>
            <a href="#pricing" className="text-gray-300 hover:text-white transition-colors text-base font-medium">Pricing</a>
            <a href="#impact" className="text-gray-300 hover:text-white transition-colors text-base font-medium">Impact</a>
            <button className="btn-primary">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 py-20">
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
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-primary hover:opacity-90 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all transform hover:scale-105">
                Start Free Trial
                <ArrowRightIcon className="inline-block ml-2 h-5 w-5" />
              </button>
              <button className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 rounded-lg text-lg font-semibold transition-all">
                Learn More
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-6 py-16">
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
      <section id="features" className="px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-semibold text-white mb-6 leading-tight flex items-center justify-center gap-3">
              Why Choose <img src="/conservertive_logo_light_500px.png" alt="ConSERVERtive" className="h-12 md:h-16 w-auto" />?
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

      {/* Pricing Section */}
      <section id="pricing" className="px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-semibold text-white mb-6 leading-tight">
              Choose Your Plan
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto font-light leading-relaxed">
              Every paid subscription sponsors a free user in a censored country. Your payment fights for internet freedom.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Basic Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="card bg-white/10 backdrop-blur-sm border-white/20 relative"
            >
              <div className="text-center">
                <h3 className="text-2xl font-semibold text-white mb-2">Basic</h3>
                <div className="text-4xl font-bold text-white mb-4">
                  $9.99<span className="text-lg text-gray-400">/month</span>
                </div>
                <ul className="text-gray-300 space-y-3 mb-8">
                  <li>✓ Military-grade encryption</li>
                  <li>✓ 50+ global servers</li>
                  <li>✓ No-logs policy</li>
                  <li>✓ 24/7 support</li>
                </ul>
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors">
                  Get Started
                </button>
              </div>
            </motion.div>

            {/* Premium Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="card bg-transparent backdrop-blur-sm border-blue-400/50 relative"
            >
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </span>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-semibold text-white mb-2">Premium</h3>
                <div className="text-4xl font-bold text-white mb-4">
                  $19.99<span className="text-lg text-gray-300">/month</span>
                </div>
                <ul className="text-gray-200 space-y-3 mb-8">
                  <li>✓ Everything in Basic</li>
                  <li>✓ Advanced threat protection</li>
                  <li>✓ Dark web monitoring</li>
                  <li>✓ <span className="text-green-400 font-semibold">Sponsor 1 free user</span></li>
                </ul>
                <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-6 rounded-lg font-semibold transition-all transform hover:scale-105">
                  Start Sponsoring
                </button>
              </div>
            </motion.div>

            {/* Enterprise Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="card bg-white/10 backdrop-blur-sm border-white/20 relative"
            >
              <div className="text-center">
                <h3 className="text-2xl font-semibold text-white mb-2">Enterprise</h3>
                <div className="text-4xl font-bold text-white mb-4">
                  $49.99<span className="text-lg text-gray-400">/month</span>
                </div>
                <ul className="text-gray-300 space-y-3 mb-8">
                  <li>✓ Everything in Premium</li>
                  <li>✓ Dedicated servers</li>
                  <li>✓ Priority support</li>
                  <li>✓ <span className="text-green-400 font-semibold">Sponsor 5 free users</span></li>
                </ul>
                <button className="w-full bg-gray-600 hover:bg-gray-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors">
                  Contact Sales
                </button>
              </div>
            </motion.div>

            {/* Direct Sponsorship */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="card bg-transparent backdrop-blur-sm border-green-400/50 relative"
            >
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Direct Impact
                </span>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-semibold text-white mb-2">Sponsor</h3>
                <div className="text-4xl font-bold text-white mb-4">
                  $9.99<span className="text-lg text-gray-300">/month</span>
                </div>
                <ul className="text-gray-200 space-y-3 mb-8">
                  <li>✓ <span className="text-green-400 font-semibold">Sponsor 1 free user</span></li>
                  <li>✓ Direct impact tracking</li>
                  <li>✓ Monthly impact reports</li>
                  <li>✓ Community recognition</li>
                </ul>
                <button className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-all transform hover:scale-105">
                  Make Impact
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section id="impact" className="px-6 py-20 bg-gradient-to-r from-blue-900/50 to-purple-900/50">
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
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm rounded-2xl p-12 border border-white/20"
          >
            <h2 className="text-4xl md:text-5xl font-semibold text-white mb-6 leading-tight">
              Ready to Make a Difference?
            </h2>
            <p className="text-xl text-gray-300 mb-8 font-light leading-relaxed">
              Join thousands of users fighting for internet freedom. Your subscription helps someone in a censored country access the free internet.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all transform hover:scale-105">
                <HeartIcon className="inline-block mr-2 h-5 w-5" />
                Start Sponsoring Today
              </button>
              <button className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 rounded-lg text-lg font-semibold transition-all">
                View Impact Report
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 border-t border-white/20">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <img 
                  src="/conservertive_logo_light_500px.png" 
                  alt="ConSERVERtive VPN" 
                  className="h-8 w-auto"
                />
              </div>
              <p className="text-gray-400">
                Fighting for internet freedom worldwide.
              </p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Download</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Impact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/20 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 ConSERVERtive VPN. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
