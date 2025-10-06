'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser, useClerk } from '@clerk/nextjs';
import { useSearchParams } from 'next/navigation';
import { 
  CheckCircleIcon, 
  ArrowRightIcon, 
  ShieldCheckIcon,
  HeartIcon,
  GlobeAltIcon,
  CreditCardIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import ParallaxStars from '../../components/ParallaxStars';
import StripePayment from '../../components/StripePayment';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  completed: boolean;
}

function OnboardingContent() {
  const { user, isLoaded } = useUser();
  const { openSignUp } = useClerk();
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const steps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to ConSERVERtive',
      description: 'Let\'s get you set up to fight for internet freedom',
      icon: ShieldCheckIcon,
      completed: currentStep > 0
    },
    {
      id: 'account',
      title: 'Create Your Account',
      description: 'Secure authentication with enterprise-grade security',
      icon: CheckCircleIcon,
      completed: !!user
    },
    {
      id: 'plan',
      title: 'Choose Your Impact',
      description: 'Select a plan that matches your commitment to freedom',
      icon: HeartIcon,
      completed: !!selectedPlan
    },
    {
      id: 'payment',
      title: 'Secure Payment',
      description: 'Complete your subscription with encrypted payment',
      icon: CreditCardIcon,
      completed: paymentSuccess
    },
    {
      id: 'success',
      title: 'You\'re All Set!',
      description: 'Welcome to the fight for internet freedom',
      icon: SparklesIcon,
      completed: false
    }
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
      id: 'enterprise',
      name: 'Enterprise',
      price: 49.99,
      description: 'Maximum impact',
      features: ['Everything in Premium', 'Dedicated servers', 'Priority support', 'Sponsor 5 free users'],
      sponsorCount: 5,
      popular: false
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

  useEffect(() => {
    // Handle URL parameters for step navigation
    if (searchParams) {
      const stepParam = searchParams.get('step');
      if (stepParam) {
        const stepNumber = parseInt(stepParam, 10);
        if (stepNumber >= 0 && stepNumber < steps.length) {
          setCurrentStep(stepNumber);
        }
      }
    }
  }, [searchParams]);

  useEffect(() => {
    // Handle user authentication state
    if (isLoaded) {
      if (user && currentStep === 1) {
        setCurrentStep(2);
        setError(null);
      } else if (!user && currentStep > 1) {
        // If user is not authenticated but we're past step 1, redirect to step 1
        setCurrentStep(1);
      }
    }
  }, [user, isLoaded, currentStep]);

  const handleSignUp = async () => {
    setIsSigningUp(true);
    setError(null);
    try {
      await openSignUp({
        afterSignUpUrl: '/onboarding?step=2'
      });
    } catch (error) {
      console.error('Sign up error:', error);
      setError('Failed to open sign-up form. Please try again.');
    } finally {
      setIsSigningUp(false);
    }
  };

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
    setTimeout(() => setCurrentStep(3), 500);
  };

  const handlePayment = async () => {
    if (!selectedPlan || !user) return;
    
    setIsProcessingPayment(true);
    
    try {
      // The StripePayment component will handle the actual payment
      // This is just for the UI flow
      setPaymentSuccess(true);
      setTimeout(() => setCurrentStep(4), 1000);
    } catch (error) {
      console.error('Payment error:', error);
    } finally {
      setIsProcessingPayment(false);
    }
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
            className="text-center"
          >
            <div className="w-96 h-48 mx-auto mb-8 flex items-center justify-center">
              <img 
                src="/conservertive_logo_light_500px_vpntag.png" 
                alt="ConSERVERtive VPN" 
                className="w-full h-full object-contain"
              />
            </div>

            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              You're about to join thousands of users fighting for internet freedom worldwide. 
              Every subscription helps someone in a censored country access the free internet.
            </p>
            <div className="flex items-center justify-center space-x-8 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">50+</div>
                <div className="text-gray-400">Countries</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">100K+</div>
                <div className="text-gray-400">Users Protected</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">99.9%</div>
                <div className="text-gray-400">Uptime</div>
              </div>
            </div>
            <button
              onClick={() => setCurrentStep(1)}
              className="btn-primary text-lg px-8 py-4 flex items-center justify-center mx-auto block"
            >
              Let's Get Started
              <ArrowRightIcon className="w-5 h-5 ml-2 flex-shrink-0" />
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
            className="text-center"
          >
            <div className="w-24 h-24 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-8">
              <CheckCircleIcon className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">
              Create Your Account
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Secure authentication powered by Clerk. Your data is protected with enterprise-grade security.
            </p>
            <div className="bg-white/10 backdrop-blur-sm border-white/20 rounded-xl p-8 max-w-md mx-auto mb-8">
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
            {error && (
              <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 mb-6 max-w-md mx-auto">
                <p className="text-red-400 text-center">{error}</p>
              </div>
            )}
            
            {/* Check if Clerk is configured */}
            {!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || 
             process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.includes('YOUR_CLERK_PUBLISHABLE_KEY_HERE') ? (
              <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4 mb-6 max-w-md mx-auto">
                <p className="text-yellow-400 text-center mb-4">
                  Clerk authentication is not configured. Please set up your Clerk keys in .env.local
                </p>
                <button
                  onClick={() => setCurrentStep(2)}
                  className="btn-primary text-lg px-8 py-4 flex items-center justify-center mx-auto block"
                >
                  Continue Without Auth (Demo)
                  <ArrowRightIcon className="w-5 h-5 ml-2 flex-shrink-0" />
                </button>
              </div>
            ) : (
              <button
                onClick={handleSignUp}
                disabled={isSigningUp}
                className="btn-primary text-lg px-8 py-4 disabled:opacity-50 flex items-center justify-center mx-auto block"
              >
                {isSigningUp ? 'Creating Account...' : 'Create Account'}
                <ArrowRightIcon className="w-5 h-5 ml-2 flex-shrink-0" />
              </button>
            )}
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            key="plan"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="text-center mb-8">
              <div className="w-24 h-24 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-8">
                <HeartIcon className="w-12 h-12 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-white mb-4">
                Choose Your Impact
              </h1>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Every paid subscription sponsors a free user in a censored country. 
                Your payment fights for internet freedom.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {plans.map((plan, index) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`bg-white/10 backdrop-blur-sm border-white/20 rounded-xl p-6 relative cursor-pointer transition-all duration-300 ${
                    selectedPlan === plan.id 
                      ? 'ring-2 ring-blue-400 scale-105' 
                      : 'hover:scale-105'
                  } ${plan.popular ? 'border-blue-400/50' : 'border-white/20'}`}
                  onClick={() => handlePlanSelect(plan.id)}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                        Most Popular
                      </span>
                    </div>
                  )}
                  
                  <div className="text-center">
                    <h3 className="text-2xl font-semibold text-white mb-2">{plan.name}</h3>
                    <div className="text-4xl font-bold text-white mb-2">
                      ${plan.price}<span className="text-lg text-gray-400">/month</span>
                    </div>
                    <p className="text-gray-400 mb-6">{plan.description}</p>
                    
                    <ul className="text-gray-300 space-y-3 mb-6 text-left">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-center">
                          <CheckCircleIcon className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                          <span className={feature.includes('Sponsor') ? 'text-green-400 font-semibold' : ''}>
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                    
                    {plan.sponsorCount > 0 && (
                      <div className="bg-green-500/30 border border-green-500/50 rounded-lg p-4 mb-6 backdrop-blur-sm">
                        <div className="flex items-center justify-center text-green-400">
                          <HeartIcon className="w-5 h-5 mr-2" />
                          <span className="font-semibold">
                            You'll sponsor {plan.sponsorCount} free user{plan.sponsorCount > 1 ? 's' : ''}
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
            className="text-center"
          >
            <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
              <CreditCardIcon className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">
              Secure Payment
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Complete your subscription with encrypted payment processing powered by Stripe.
            </p>
            
            <div className="max-w-md mx-auto">
              <StripePayment
                planId={selectedPlan || 'basic'}
                planName={plans.find(p => p.id === selectedPlan)?.name || 'Unknown Plan'}
                price={plans.find(p => p.id === selectedPlan)?.price || 0}
                onSuccess={() => {
                  setPaymentSuccess(true);
                  setTimeout(() => setCurrentStep(4), 1000);
                }}
                onError={(error) => {
                  console.error('Payment error:', error);
                  // Handle error - could show a toast or error message
                }}
              />
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-72 h-72 mx-auto mb-8 flex items-center justify-center"
            >
              <img 
                src="/conservertive_logo_light_500px_vpntag.png" 
                alt="ConSERVERtive VPN" 
                className="w-full h-full object-contain"
              />
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-4xl font-bold text-white mb-4"
            >
              Welcome! 🎉
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto"
            >
              You're now part of the global fight for internet freedom. 
              Your subscription is active and you can start protecting your connection immediately.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-white/10 backdrop-blur-sm border-white/20 rounded-xl p-8 max-w-md mx-auto mb-8"
            >
              <h3 className="text-lg font-semibold text-white mb-4">What's Next?</h3>
              <ul className="text-gray-300 space-y-3 text-left">
                <li className="flex items-center">
                  <CheckCircleIcon className="w-5 h-5 text-green-400 mr-3" />
                  Generate your VPN credentials
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="w-5 h-5 text-green-400 mr-3" />
                  Download our mobile app
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="w-5 h-5 text-green-400 mr-3" />
                  Track your impact on the dashboard
                </li>
                <li className="flex items-center">
                  <CheckCircleIcon className="w-5 h-5 text-green-400 mr-3" />
                  Connect to global servers
                </li>
              </ul>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <a
                href="/dashboard"
                className="btn-primary text-lg px-8 py-4 flex items-center justify-center"
              >
                Go to Dashboard
                <ArrowRightIcon className="w-5 h-5 ml-2 flex-shrink-0" />
              </a>
              <a
                href="/mobile-app"
                className="btn-secondary text-lg px-8 py-4 flex items-center justify-center"
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
      
      {/* Progress Bar */}
      <div className="relative z-10 px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step.completed 
                    ? 'bg-green-500' 
                    : index === currentStep 
                      ? 'bg-blue-500' 
                      : 'bg-gray-600'
                }`}>
                  {step.completed ? (
                    <CheckCircleIcon className="w-6 h-6 text-white" />
                  ) : (
                    <span className="text-white font-semibold">{index + 1}</span>
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-1 mx-2 ${
                    step.completed ? 'bg-green-500' : 'bg-gray-600'
                  }`} />
                )}
              </div>
            ))}
          </div>
          
          <div className="text-center mb-4">
            <h2 className="text-2xl font-semibold text-white">
              {steps[currentStep]?.title}
            </h2>
            <p className="text-gray-400">
              Step {currentStep + 1} of {steps.length}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 px-6 pb-20">
        <div className="max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            {renderStep()}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default function OnboardingWizard() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    }>
      <OnboardingContent />
    </Suspense>
  );
}
