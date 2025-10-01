#!/usr/bin/env node

const Stripe = require('stripe');

// Initialize Stripe with test keys
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_YOUR_STRIPE_SECRET_KEY_HERE', {
  apiVersion: '2025-08-27.basil',
});

async function setupConSERVERtiveProducts() {
  console.log('🚀 Setting up ConSERVERtive VPN products in Stripe...\n');

  try {
    // Create VPN service product
    console.log('📦 Creating VPN service product...');
    const product = await stripe.products.create({
      name: 'ConSERVERtive VPN Service',
      description: 'Secure VPN service for combating censorship worldwide',
      metadata: {
        service: 'conservertive-vpn',
        category: 'vpn-service',
      },
    });
    console.log(`✅ Product created: ${product.id}`);

    // Create pricing tiers
    console.log('\n💰 Creating pricing tiers...');
    
    // Basic Plan - $9.99/month
    const basicPrice = await stripe.prices.create({
      product: product.id,
      unit_amount: 999, // $9.99 in cents
      currency: 'usd',
      recurring: { interval: 'month' },
      metadata: {
        plan: 'basic',
        features: 'standard-vpn',
      },
    });
    console.log(`✅ Basic plan price created: ${basicPrice.id} - $9.99/month`);

    // Premium Plan - $19.99/month
    const premiumPrice = await stripe.prices.create({
      product: product.id,
      unit_amount: 1999, // $19.99 in cents
      currency: 'usd',
      recurring: { interval: 'month' },
      metadata: {
        plan: 'premium',
        features: 'advanced-vpn',
      },
    });
    console.log(`✅ Premium plan price created: ${premiumPrice.id} - $19.99/month`);

    // Enterprise Plan - $49.99/month
    const enterprisePrice = await stripe.prices.create({
      product: product.id,
      unit_amount: 4999, // $49.99 in cents
      currency: 'usd',
      recurring: { interval: 'month' },
      metadata: {
        plan: 'enterprise',
        features: 'all-features',
      },
    });
    console.log(`✅ Enterprise plan price created: ${enterprisePrice.id} - $49.99/month`);

    // Sponsorship Plan - $9.99/month (sponsors a free user)
    const sponsorshipPrice = await stripe.prices.create({
      product: product.id,
      unit_amount: 999, // $9.99 in cents
      currency: 'usd',
      recurring: { interval: 'month' },
      metadata: {
        plan: 'sponsorship',
        features: 'sponsor-free-user',
      },
    });
    console.log(`✅ Sponsorship plan price created: ${sponsorshipPrice.id} - $9.99/month`);

    // Create a test customer
    console.log('\n👤 Creating test customer...');
    const customer = await stripe.customers.create({
      email: 'test@conservertive.com',
      name: 'Test User',
      metadata: {
        service: 'conservertive-vpn',
        test: 'true',
      },
    });
    console.log(`✅ Test customer created: ${customer.id}`);

    // Create a payment link for testing
    console.log('\n🔗 Creating payment link...');
    const paymentLink = await stripe.paymentLinks.create({
      line_items: [
        {
          price: basicPrice.id,
          quantity: 1,
        },
      ],
      metadata: {
        service: 'conservertive-vpn',
        test: 'true',
      },
    });
    console.log(`✅ Payment link created: ${paymentLink.url}`);

    // Create a sponsorship coupon
    console.log('\n🎫 Creating sponsorship coupon...');
    const coupon = await stripe.coupons.create({
      name: 'Free VPN Sponsorship',
      percent_off: 100, // 100% off
      duration: 'once',
      metadata: {
        service: 'conservertive-vpn',
        type: 'sponsorship',
      },
    });
    console.log(`✅ Sponsorship coupon created: ${coupon.id}`);

    console.log('\n🎉 ConSERVERtive VPN Stripe setup complete!');
    console.log('\n📋 Summary:');
    console.log(`   Product ID: ${product.id}`);
    console.log(`   Basic Plan: ${basicPrice.id} - $9.99/month`);
    console.log(`   Premium Plan: ${premiumPrice.id} - $19.99/month`);
    console.log(`   Enterprise Plan: ${enterprisePrice.id} - $49.99/month`);
    console.log(`   Sponsorship Plan: ${sponsorshipPrice.id} - $9.99/month`);
    console.log(`   Test Customer: ${customer.id}`);
    console.log(`   Payment Link: ${paymentLink.url}`);
    console.log(`   Sponsorship Coupon: ${coupon.id}`);

  } catch (error) {
    console.error('❌ Error setting up Stripe products:', error);
  }
}

// Run the setup
setupConSERVERtiveProducts();
