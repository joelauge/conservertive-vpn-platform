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
  const [additionalSponsorships, setAdditionalSponsorships] = useState(0);
  const [selectedApplicants, setSelectedApplicants] = useState<string[]>([]);
  const [availableApplicants, setAvailableApplicants] = useState<any[]>([]);
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

  const basePrice = 9.99;
  const sponsorshipPrice = 9.99;

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
    // Fetch available applicants when reaching the pricing step
    if (currentStep === 2) {
      fetchAvailableApplicants();
    }
  }, [currentStep]);

  const fetchAvailableApplicants = async () => {
    try {
      const response = await fetch('/api/sponsorship-requests/available/applicants?limit=20');
      if (response.ok) {
        const applicants = await response.json();
        setAvailableApplicants(applicants);
      }
    } catch (error) {
      console.error('Failed to fetch applicants:', error);
    }
  };

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

  const handlePlanSelect = () => {
    setSelectedPlan('base');
    setError(null);
  };

  const handleAdditionalSponsorshipsChange = (count: number) => {
    setAdditionalSponsorships(count);
    // Clear selected applicants if count is reduced
    if (count < selectedApplicants.length) {
      setSelectedApplicants(selectedApplicants.slice(0, count));
    }
  };

  const handleApplicantSelect = (applicantId: string, isSelected: boolean) => {
    if (isSelected) {
      if (selectedApplicants.length < additionalSponsorships) {
        setSelectedApplicants([...selectedApplicants, applicantId]);
      }
    } else {
      setSelectedApplicants(selectedApplicants.filter(id => id !== applicantId));
    }
  };

  const getTotalPrice = () => {
    return basePrice + (additionalSponsorships * sponsorshipPrice);
  };

  const getCountryName = (countryCode: string) => {
    const countryNames: { [key: string]: string } = {
      'CN': 'China', 'IR': 'Iran', 'RU': 'Russia', 'CU': 'Cuba', 'KP': 'North Korea',
      'BY': 'Belarus', 'UZ': 'Uzbekistan', 'TM': 'Turkmenistan', 'VE': 'Venezuela',
      'ET': 'Ethiopia', 'EG': 'Egypt', 'TR': 'Turkey', 'PK': 'Pakistan', 'BD': 'Bangladesh',
      'VN': 'Vietnam', 'TH': 'Thailand', 'MY': 'Malaysia', 'ID': 'Indonesia', 'PH': 'Philippines',
      'MM': 'Myanmar', 'LK': 'Sri Lanka', 'NP': 'Nepal', 'AF': 'Afghanistan', 'IQ': 'Iraq',
      'SY': 'Syria', 'LB': 'Lebanon', 'JO': 'Jordan', 'SA': 'Saudi Arabia', 'AE': 'UAE',
      'KW': 'Kuwait', 'QA': 'Qatar', 'BH': 'Bahrain', 'OM': 'Oman', 'YE': 'Yemen'
    };
    return countryNames[countryCode] || countryCode;
  };

  const formatTimeSince = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes}m ago`;
    } else if (minutes < 1440) {
      const hours = Math.floor(minutes / 60);
      return `${hours}h ago`;
    } else {
      const days = Math.floor(minutes / 1440);
      return `${days}d ago`;
    }
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
                Your $9.99 subscription automatically sponsors one person in a censored country. 
                You can choose who to sponsor or let us pick someone who needs help.
              </p>
            </div>
            
            <div className="max-w-4xl mx-auto">
              {/* Base Plan */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-8 mb-8"
              >
                <div className="text-center">
                  <h3 className="text-3xl font-semibold text-white mb-4">ConSERVERtive VPN</h3>
                  <div className="text-5xl font-bold text-white mb-4">
                    ${basePrice}<span className="text-xl text-gray-400">/month</span>
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
                      You can choose who to sponsor below, or we'll pick someone who needs help.
                    </p>
                  </div>
                  
                  <button 
                    onClick={handlePlanSelect}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 px-8 rounded-lg font-semibold transition-all transform hover:scale-105 text-lg"
                  >
                    Select Base Plan
                  </button>
                </div>
              </motion.div>

              {/* Additional Sponsorships */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 mb-8"
              >
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-semibold text-white mb-4">Add More Sponsorships</h3>
                  <p className="text-gray-300 mb-6">
                    Each additional sponsorship costs ${sponsorshipPrice} and helps another person access the free internet.
                  </p>
                  
                  <div className="flex items-center justify-center space-x-4 mb-6">
                    <button
                      onClick={() => handleAdditionalSponsorshipsChange(Math.max(0, additionalSponsorships - 1))}
                      className="w-12 h-12 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg flex items-center justify-center text-white font-bold text-xl transition-all"
                    >
                      -
                    </button>
                    <span className="text-3xl font-bold text-white min-w-[3rem] text-center">
                      {additionalSponsorships}
                    </span>
                    <button
                      onClick={() => handleAdditionalSponsorshipsChange(additionalSponsorships + 1)}
                      className="w-12 h-12 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg flex items-center justify-center text-white font-bold text-xl transition-all"
                    >
                      +
                    </button>
                  </div>
                  
                  {additionalSponsorships > 0 && (
                    <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4 mb-6">
                      <p className="text-blue-400 font-semibold">
                        +{additionalSponsorships} additional sponsorship{additionalSponsorships > 1 ? 's' : ''} = ${(additionalSponsorships * sponsorshipPrice).toFixed(2)}
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Applicant Selection */}
              {additionalSponsorships > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8"
                >
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-semibold text-white mb-4">Choose Who to Sponsor</h3>
                    <p className="text-gray-300 mb-6">
                      Select specific people to sponsor, or leave it to us to pick those most in need.
                    </p>
                  </div>
                  
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    {availableApplicants.slice(0, 6).map((applicant) => (
                      <div
                        key={applicant.id}
                        className={`bg-white/10 border rounded-lg p-4 cursor-pointer transition-all ${
                          selectedApplicants.includes(applicant.id)
                            ? 'border-blue-400 bg-blue-500/20'
                            : 'border-white/20 hover:border-white/40'
                        }`}
                        onClick={() => handleApplicantSelect(applicant.id, !selectedApplicants.includes(applicant.id))}
                      >
                        <div className="flex items-center space-x-3 mb-3">
                          <img
                            src={applicant.profilePicture || `https://ui-avatars.com/api/?name=${applicant.firstName}+${applicant.lastName}&background=random&color=fff&size=40`}
                            alt={`${applicant.firstName} ${applicant.lastName}`}
                            className="w-10 h-10 rounded-full"
                          />
                          <div>
                            <div className="text-white font-semibold">
                              {applicant.firstName} {applicant.lastName.charAt(0)}.
                            </div>
                            <div className="text-gray-400 text-sm">
                              {getCountryName(applicant.country)}
                            </div>
                          </div>
                        </div>
                        <div className="text-gray-300 text-sm mb-2">
                          {formatTimeSince(applicant.minutesSinceApplication)}
                        </div>
                        <div className={`text-xs px-2 py-1 rounded-full inline-block ${
                          applicant.urgency === 'high' ? 'bg-red-500/20 text-red-400' :
                          applicant.urgency === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-green-500/20 text-green-400'
                        }`}>
                          {applicant.urgency} priority
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {selectedApplicants.length < additionalSponsorships && (
                    <div className="text-center">
                      <p className="text-gray-400 mb-4">
                        You've selected {selectedApplicants.length} of {additionalSponsorships} sponsorships.
                        We'll pick the remaining {additionalSponsorships - selectedApplicants.length} for you.
                      </p>
                    </div>
                  )}
                </motion.div>
              )}

              {/* Total Price */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-xl p-8 mt-8"
              >
                <div className="text-center">
                  <h3 className="text-2xl font-semibold text-white mb-4">Total Monthly Cost</h3>
                  <div className="text-5xl font-bold text-white mb-4">
                    ${getTotalPrice().toFixed(2)}<span className="text-xl text-gray-400">/month</span>
                  </div>
                  <p className="text-gray-300 mb-6">
                    Your subscription will sponsor {1 + additionalSponsorships} person{(1 + additionalSponsorships) > 1 ? 's' : ''} in censored countries
                  </p>
                  
                  <button
                    onClick={() => setTimeout(() => setCurrentStep(3), 500)}
                    className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white py-4 px-8 rounded-lg font-semibold transition-all transform hover:scale-105 text-lg"
                  >
                    Continue to Payment
                  </button>
                </div>
              </motion.div>
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
                planId="base-plan"
                planName="ConSERVERtive VPN + Sponsorships"
                price={getTotalPrice()}
                additionalSponsorships={additionalSponsorships}
                selectedApplicants={selectedApplicants}
                onSuccess={() => {
                  setPaymentSuccess(true);
                  setTimeout(() => setCurrentStep(4), 1000);
                }}
                onError={(error) => {
                  console.error('Payment error:', error);
                  setError('Payment failed. Please try again.');
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
