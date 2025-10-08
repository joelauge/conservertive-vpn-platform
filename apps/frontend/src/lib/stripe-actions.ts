'use server';

import { auth } from '@clerk/nextjs/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-09-30.clover',
});

export async function createSetupIntent(planId: string) {
  try {
    // Use Clerk's auth() function for proper authentication
    const { userId } = await auth();
    
    if (!userId) {
      return { 
        success: false, 
        error: 'Unauthorized - Please sign in' 
      };
    }

    console.log('Creating setup intent for user:', userId);

    if (!planId) {
      return { 
        success: false, 
        error: 'Missing planId' 
      };
    }

    // Get user from Clerk
    const userResponse = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
      headers: {
        'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}`,
      },
    });

    if (!userResponse.ok) {
      throw new Error('Failed to fetch user from Clerk');
    }

    const user = await userResponse.json();
    const email = user.email_addresses[0]?.email_address;
    const name = `${user.first_name || ''} ${user.last_name || ''}`.trim() || email;

    // Create or get Stripe customer
    let customer;
    const existingCustomers = await stripe.customers.list({
      email: email,
      limit: 1,
    });

    if (existingCustomers.data.length > 0) {
      customer = existingCustomers.data[0];
    } else {
      customer = await stripe.customers.create({
        email: email,
        name: name,
        metadata: {
          clerkUserId: userId,
          planId: planId,
        },
      });
    }

    // Create setup intent to collect payment method
    const setupIntent = await stripe.setupIntents.create({
      customer: customer.id,
      payment_method_types: ['card'],
      usage: 'off_session', // For future payments
      metadata: {
        clerkUserId: userId,
        planId: planId,
      },
    });

    return { 
      success: true, 
      clientSecret: setupIntent.client_secret,
      customerId: customer.id 
    };
  } catch (error) {
    console.error('Error creating setup intent:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Internal server error' 
    };
  }
}

export async function createSubscription(planId: string, setupIntentId: string) {
  try {
    // Use Clerk's auth() function for proper authentication
    const { userId } = await auth();
    
    if (!userId) {
      return { 
        success: false, 
        error: 'Unauthorized - Please sign in' 
      };
    }

    console.log('Creating subscription for user:', userId);

    if (!planId || !setupIntentId) {
      return { 
        success: false, 
        error: 'Missing planId or setupIntentId' 
      };
    }

    // Verify setup intent
    const setupIntent = await stripe.setupIntents.retrieve(setupIntentId);

    if (setupIntent.status !== 'succeeded') {
      return { 
        success: false, 
        error: 'Payment method not saved successfully' 
      };
    }

    // Get customer
    const customer = await stripe.customers.retrieve(setupIntent.customer as string);

    // Create product and price for the subscription
    const product = await stripe.products.create({
      name: getPlanName(planId),
      description: getPlanDescription(planId),
    });

    const price = await stripe.prices.create({
      currency: 'usd',
      product: product.id,
      unit_amount: getPlanPrice(planId) * 100,
      recurring: {
        interval: 'month',
      },
    });

    // Create subscription with the saved payment method
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{
        price: price.id,
      }],
      default_payment_method: setupIntent.payment_method as string,
      metadata: {
        clerkUserId: userId,
        planId: planId,
        setupIntentId: setupIntentId,
      },
    });

    return {
      success: true,
      subscriptionId: subscription.id,
      message: 'Subscription created successfully',
    };
  } catch (error) {
    console.error('Error creating subscription:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error'
    };
  }
}

function getPlanName(planId: string): string {
  const plans = {
    basic: 'ConSERVERtive Basic',
    premium: 'ConSERVERtive Premium',
    enterprise: 'ConSERVERtive Enterprise',
    sponsor: 'ConSERVERtive Sponsor',
    base: 'ConSERVERtive Base Plan',
  };
  return plans[planId as keyof typeof plans] || 'ConSERVERtive Plan';
}

function getPlanDescription(planId: string): string {
  const descriptions = {
    basic: 'Essential VPN protection with military-grade encryption',
    premium: 'Advanced protection with threat monitoring and sponsorship',
    enterprise: 'Maximum impact with dedicated servers and priority support',
    sponsor: 'Direct sponsorship to help users in censored countries',
    base: 'Base VPN protection with automatic sponsorship',
  };
  return descriptions[planId as keyof typeof descriptions] || 'VPN protection and internet freedom';
}

function getPlanPrice(planId: string): number {
  const prices = {
    basic: 9.99,
    premium: 19.99,
    enterprise: 49.99,
    sponsor: 9.99,
    base: 9.99,
  };
  return prices[planId as keyof typeof prices] || 9.99;
}