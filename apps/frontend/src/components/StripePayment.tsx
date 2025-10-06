'use client';

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { motion } from 'framer-motion';
import { createSetupIntent, createSubscription } from '../lib/stripe-actions';
import { 
  CreditCardIcon, 
  ShieldCheckIcon, 
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

// Safely initialize Stripe with error handling
const getStripePublishableKey = () => {
  const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  if (!key || key.includes('your_stripe_publishable_key_here')) {
    return null;
  }
  return key;
};

const stripePublishableKey = getStripePublishableKey();
const stripePromise = stripePublishableKey ? loadStripe(stripePublishableKey) : null;

interface PaymentFormProps {
  planId: string;
  planName: string;
  price: number;
  additionalSponsorships?: number;
  selectedApplicants?: string[];
  onSuccess: () => void;
  onError: (error: string) => void;
}

function PaymentForm({ planId, planName, price, additionalSponsorships = 0, selectedApplicants = [], onSuccess, onError }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setError(null);

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      setError('Card element not found');
      setIsProcessing(false);
      return;
    }

    try {
      // Create setup intent using server action
      const result = await createSetupIntent(planId);

      if (!result.success) {
        throw new Error(result.error);
      }

      const { clientSecret } = result;

      // Confirm setup intent to save payment method
      const { error: stripeError, setupIntent } = await stripe.confirmCardSetup(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (stripeError) {
        throw new Error(stripeError.message);
      }

      if (setupIntent.status === 'succeeded') {
        // Create subscription with the saved payment method
        const subscriptionResult = await createSubscription(planId, setupIntent.id);
        
        if (!subscriptionResult.success) {
          throw new Error(subscriptionResult.error);
        }
        
        console.log('Subscription created:', subscriptionResult.subscriptionId);
        onSuccess();
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Payment failed';
      setError(errorMessage);
      onError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white/10 backdrop-blur-sm border-white/20 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Payment Details</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Card Information
            </label>
            <div className="bg-white/5 border border-white/20 rounded-lg p-4">
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: '16px',
                      color: '#ffffff',
                      '::placeholder': {
                        color: '#9ca3af',
                      },
                    },
                    invalid: {
                      color: '#ef4444',
                    },
                  },
                }}
              />
            </div>
          </div>
          
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 flex items-center"
            >
              <ExclamationTriangleIcon className="w-5 h-5 text-red-400 mr-3" />
              <span className="text-red-400">{error}</span>
            </motion.div>
          )}
          
          <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4 flex items-center">
            <ShieldCheckIcon className="w-5 h-5 text-blue-400 mr-3" />
            <span className="text-blue-400 text-sm">
              Your payment is secured with 256-bit SSL encryption
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-sm border-white/20 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Order Summary</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-300">{planName}</span>
            <span className="text-white font-semibold">$9.99/month</span>
          </div>
          {additionalSponsorships > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-300">Additional Sponsorships ({additionalSponsorships})</span>
              <span className="text-white font-semibold">${(additionalSponsorships * 9.99).toFixed(2)}/month</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-gray-300">Tax</span>
            <span className="text-white">$0.00</span>
          </div>
          <div className="border-t border-white/20 pt-3">
            <div className="flex justify-between">
              <span className="text-white font-semibold">Total</span>
              <span className="text-white font-semibold text-xl">${price.toFixed(2)}/month</span>
            </div>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 px-6 rounded-lg font-semibold transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        {isProcessing ? 'Setting Up Subscription...' : `Subscribe for $${price}/month`}
      </button>
    </form>
  );
}

interface StripePaymentProps {
  planId: string;
  planName: string;
  price: number;
  additionalSponsorships?: number;
  selectedApplicants?: string[];
  onSuccess: () => void;
  onError: (error: string) => void;
}

export default function StripePayment({ planId, planName, price, additionalSponsorships = 0, selectedApplicants = [], onSuccess, onError }: StripePaymentProps) {
  // Check if Stripe is configured
  if (!stripePublishableKey) {
    return (
      <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <ExclamationTriangleIcon className="w-6 h-6 text-yellow-400 mr-3" />
          <h3 className="text-lg font-semibold text-yellow-400">Stripe Not Configured</h3>
        </div>
        <p className="text-yellow-300 mb-4">
          Stripe payment processing is not configured. Please set up your Stripe keys in .env.local
        </p>
        <div className="bg-white/10 backdrop-blur-sm border-white/20 rounded-xl p-4 mb-4">
          <h4 className="text-white font-semibold mb-2">Order Summary</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-300">{planName} Plan</span>
              <span className="text-white font-semibold">${price}/month</span>
            </div>
            <div className="border-t border-white/20 pt-2">
              <div className="flex justify-between">
                <span className="text-white font-semibold">Total</span>
                <span className="text-white font-semibold text-xl">${price}/month</span>
              </div>
            </div>
          </div>
        </div>
        <button
          onClick={() => onSuccess()}
          className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white py-4 px-6 rounded-lg font-semibold transition-all transform hover:scale-105"
        >
          Continue Without Payment (Demo)
        </button>
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise}>
      <PaymentForm
        planId={planId}
        planName={planName}
        price={price}
        additionalSponsorships={additionalSponsorships}
        selectedApplicants={selectedApplicants}
        onSuccess={onSuccess}
        onError={onError}
      />
    </Elements>
  );
}
