'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser, useClerk } from '@clerk/nextjs';
import { 
  CheckCircleIcon, 
  ArrowRightIcon, 
  ShieldCheckIcon,
  HeartIcon,
  GlobeAltIcon,
  CreditCardIcon,
  SparklesIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import ParallaxStars from '../../components/ParallaxStars';

export default function MobileSignupFlow() {
  const { user, isLoaded } = useUser();
  const { openSignUp } = useClerk();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const steps = [
    { id: 'welcome', title: 'Welcome', icon: ShieldCheckIcon },
    { id: 'account', title: 'Account', icon: CheckCircleIcon },
    { id: 'plan', title: 'Plan', icon: HeartIcon },
    { id: 'payment', title: 'Payment', icon: CreditCardIcon },
    { id: 'success', title: 'Success', icon: SparklesIcon },
  ];

  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      price: 9.99,
      description: 'Essential VPN protection',
      features: ['Military-grade encryption', '50+ global servers', 'No-logs policy', '24/7 support'],
      sponsorCount: 0,
      popular: false
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 19.99,
      description: 'Advanced protection + sponsorship',
      features: ['Everything in Basic', 'Advanced threat protection', 'Dark web monitoring', 'Sponsor 1 free user'],
      sponsorCount: 1,
      popular: true
    },
    {
      id: 'sponsor',
      name: 'Sponsor',
      price: 9.99,
      description: 'Direct sponsorship',
      features: ['Sponsor 1 free user', 'Impact tracking', 'Monthly reports', 'Community recognition'],
      sponsorCount: 1,
      popular: false
    }
  ];

  const handleSignUp = async () => {
    setIsSigningUp(true);
    try {
      await openSignUp({
        afterSignUpUrl: '/onboarding?step=2'
      });
    } catch (error) {
      console.error('Sign up error:', error);
    } finally {
      setIsSigningUp(false);
    }
  };

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
    setTimeout(() => setCurrentStep(3), 500);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center px-6"
          >
            <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShieldCheckIcon className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">
              Welcome to ConSERVERtive VPN
            </h1>
            <p className="text-lg text-gray-300 mb-6">
              Join thousands fighting for internet freedom worldwide. 
              Every subscription helps someone in a censored country.
            </p>
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">50+</div>
                <div className="text-gray-400 text-sm">Countries</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">100K+</div>
                <div className="text-gray-400 text-sm">Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">99.9%</div>
                <div className="text-gray-400 text-sm">Uptime</div>
              </div>
            </div>
            <button
              onClick={() => setCurrentStep(1)}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 px-6 rounded-lg font-semibold transition-all transform hover:scale-105"
            >
              Let's Get Started
              <ArrowRightIcon className="w-5 h-5 ml-2 inline" />
            </button>
          </motion.div>
        );

      case 1:
        return (
          <motion.div
            key="account"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center px-6"
          >
            <div className="w-20 h-20 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircleIcon className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">
              Create Your Account
            </h1>
            <p className="text-lg text-gray-300 mb-6">
              Secure authentication powered by Clerk. Your data is protected with enterprise-grade security.
            </p>
            <div className="bg-white/10 backdrop-blur-sm border-white/20 rounded-xl p-6 mb-6">
              <h3 className="text-lg font-semibold text-white mb-4">What you get:</h3>
              <ul className="text-gray-300 space-y-2 text-left">
                <li className="flex items-center">
                  <CheckCircleIcon className="w-5 h-5 text-green-400 mr-3" />
                  Secure account management
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="w-5 h-5 text-green-400 mr-3" />
                  VPN credentials generation
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="w-5 h-5 text-green-400 mr-3" />
                  Impact tracking dashboard
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="w-5 h-5 text-green-400 mr-3" />
                  Subscription management
                </li>
              </ul>
            </div>
            <button
              onClick={handleSignUp}
              disabled={isSigningUp}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 px-6 rounded-lg font-semibold transition-all transform hover:scale-105 disabled:opacity-50"
            >
              {isSigningUp ? 'Creating Account...' : 'Create Account'}
              <ArrowRightIcon className="w-5 h-5 ml-2 inline" />
            </button>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            key="plan"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="px-6"
          >
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <HeartIcon className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-4">
                Choose Your Impact
              </h1>
              <p className="text-lg text-gray-300">
                Every paid subscription sponsors a free user in a censored country.
              </p>
            </div>
            
            <div className="space-y-4">
              {plans.map((plan, index) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`bg-white/10 backdrop-blur-sm border-white/20 rounded-xl p-6 cursor-pointer transition-all duration-300 ${
                    selectedPlan === plan.id 
                      ? 'ring-2 ring-blue-400 scale-105' 
                      : 'hover:scale-105'
                  } ${plan.popular ? 'border-blue-400/50' : ''}`}
                  onClick={() => handlePlanSelect(plan.id)}
                >
                  {plan.popular && (
                    <div className="text-center mb-4">
                      <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                        Most Popular
                      </span>
                    </div>
                  )}
                  
                  <div className="text-center">
                    <h3 className="text-xl font-semibold text-white mb-2">{plan.name}</h3>
                    <div className="text-3xl font-bold text-white mb-2">
                      ${plan.price}<span className="text-lg text-gray-400">/month</span>
                    </div>
                    <p className="text-gray-400 mb-4">{plan.description}</p>
                    
                    <ul className="text-gray-300 space-y-2 text-left mb-4">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-center text-sm">
                          <CheckCircleIcon className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
                          <span className={feature.includes('Sponsor') ? 'text-green-400 font-semibold' : ''}>
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                    
                    {plan.sponsorCount > 0 && (
                      <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-3 mb-4">
                        <div className="flex items-center justify-center text-green-400">
                          <HeartIcon className="w-4 h-4 mr-2" />
                          <span className="text-sm font-semibold">
                            Sponsoring {plan.sponsorCount} free user{plan.sponsorCount > 1 ? 's' : ''}
                          </span>
                        </div>
                      </div>
                    )}
                    
                    <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-6 rounded-lg font-semibold transition-all transform hover:scale-105">
                      Select Plan
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            key="payment"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center px-6"
          >
            <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CreditCardIcon className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">
              Secure Payment
            </h1>
            <p className="text-lg text-gray-300 mb-6">
              Complete your subscription with encrypted payment processing.
            </p>
            
            <div className="bg-white/10 backdrop-blur-sm border-white/20 rounded-xl p-6 mb-6">
              <h3 className="text-lg font-semibold text-white mb-4">Order Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-300">
                    {plans.find(p => p.id === selectedPlan)?.name} Plan
                  </span>
                  <span className="text-white font-semibold">
                    ${plans.find(p => p.id === selectedPlan)?.price}/month
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Tax</span>
                  <span className="text-white">$0.00</span>
                </div>
                <div className="border-t border-white/20 pt-3">
                  <div className="flex justify-between">
                    <span className="text-white font-semibold">Total</span>
                    <span className="text-white font-semibold text-xl">
                      ${plans.find(p => p.id === selectedPlan)?.price}/month
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-center text-blue-400">
                <ShieldCheckIcon className="w-5 h-5 mr-2" />
                <span className="text-sm">
                  Your payment is secured with 256-bit SSL encryption
                </span>
              </div>
            </div>
            
            <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 px-6 rounded-lg font-semibold transition-all transform hover:scale-105">
              Complete Payment
              <ArrowRightIcon className="w-5 h-5 ml-2 inline" />
            </button>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="text-center px-6"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-24 h-24 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <SparklesIcon className="w-12 h-12 text-white" />
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-3xl font-bold text-white mb-4"
            >
              Welcome to ConSERVERtive VPN! 🎉
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-lg text-gray-300 mb-6"
            >
              You're now part of the global fight for internet freedom. 
              Your subscription is active and you can start protecting your connection immediately.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="space-y-4"
            >
              <a
                href="/dashboard"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 px-6 rounded-lg font-semibold transition-all transform hover:scale-105 block"
              >
                Go to Dashboard
                <ArrowRightIcon className="w-5 h-5 ml-2 inline" />
              </a>
              <a
                href="/mobile-app"
                className="w-full bg-white/10 hover:bg-white/20 text-white py-4 px-6 rounded-lg font-semibold transition-all transform hover:scale-105 block"
              >
                Download Mobile App
              </a>
            </motion.div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen relative">
      <ParallaxStars />
      
      {/* Mobile Navigation */}
      <nav className="relative px-4 py-4 z-10">
        <div className="flex items-center justify-between">
          <img 
            src="/conservertive_logo_light_500px.png" 
            alt="ConSERVERtive VPN" 
            className="h-8 w-auto"
          />
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-white"
          >
            {isMobileMenuOpen ? (
              <XMarkIcon className="w-6 h-6" />
            ) : (
              <Bars3Icon className="w-6 h-6" />
            )}
          </button>
        </div>
        
        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 bg-white/10 backdrop-blur-sm border-white/20 rounded-lg p-4"
            >
              <div className="space-y-3">
                <a href="#features" className="block text-gray-300 hover:text-white">Features</a>
                <a href="#pricing" className="block text-gray-300 hover:text-white">Pricing</a>
                <a href="#impact" className="block text-gray-300 hover:text-white">Impact</a>
                <a href="/our-why" className="block text-gray-300 hover:text-white">Our Why</a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Progress Indicator */}
      <div className="relative z-10 px-4 py-4">
        <div className="flex items-center justify-center space-x-2">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                index <= currentStep ? 'bg-blue-500' : 'bg-gray-600'
              }`}>
                {index < currentStep ? (
                  <CheckCircleIcon className="w-5 h-5 text-white" />
                ) : (
                  <span className="text-white text-sm font-semibold">{index + 1}</span>
                )}
              </div>
              {index < steps.length - 1 && (
                <div className={`w-8 h-1 mx-1 ${
                  index < currentStep ? 'bg-blue-500' : 'bg-gray-600'
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className="text-center mt-2">
          <p className="text-gray-400 text-sm">
            Step {currentStep + 1} of {steps.length}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 pb-20">
        <AnimatePresence mode="wait">
          {renderStep()}
        </AnimatePresence>
      </div>
    </div>
  );
}
