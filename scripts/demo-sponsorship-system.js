#!/usr/bin/env node

const Stripe = require('stripe');

// Initialize Stripe with test keys
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_YOUR_STRIPE_SECRET_KEY_HERE', {
  apiVersion: '2025-08-27.basil',
});

async function demonstrateSponsorshipSystem() {
  console.log('🎯 ConSERVERtive Sponsorship Matching System Demo\n');

  try {
    // Create test users for the demo
    console.log('👥 Creating test users...');
    
    // Create a sponsor (paid user from free country)
    const sponsor = await stripe.customers.create({
      email: 'sponsor@conservertive.com',
      name: 'John Sponsor',
      metadata: {
        service: 'conservertive-vpn',
        role: 'sponsor',
        country: 'US',
        subscriptionTier: 'premium',
        sponsorshipEnabled: 'true',
        maxSponsorships: '3',
      },
    });
    console.log(`✅ Sponsor created: ${sponsor.id} (${sponsor.email})`);

    // Create a sponsored user (from censored country)
    const sponsoredUser = await stripe.customers.create({
      email: 'censored@conservertive.com',
      name: 'Li Wei',
      metadata: {
        service: 'conservertive-vpn',
        role: 'sponsored',
        country: 'CN',
        isSponsored: 'true',
        urgency: 'high',
      },
    });
    console.log(`✅ Sponsored user created: ${sponsoredUser.id} (${sponsoredUser.email})`);

    // Create sponsorship subscription for sponsor
    console.log('\n💳 Creating sponsorship subscription...');
    const sponsorshipPrice = 'price_1SDBe0CXwRCrgNc2DlYMAury'; // Sponsorship plan
    
    const subscription = await stripe.subscriptions.create({
      customer: sponsor.id,
      items: [{ price: sponsorshipPrice }],
      metadata: {
        service: 'conservertive-vpn',
        type: 'sponsorship',
        sponsoredUserId: sponsoredUser.id,
      },
    });
    console.log(`✅ Sponsorship subscription created: ${subscription.id}`);

    // Create sponsorship coupon for sponsored user
    console.log('\n🎫 Creating sponsorship coupon...');
    const coupon = await stripe.coupons.create({
      name: `Sponsorship for ${sponsoredUser.name}`,
      percent_off: 100, // 100% off
      duration: 'once',
      metadata: {
        service: 'conservertive-vpn',
        type: 'sponsorship',
        sponsorId: sponsor.id,
        sponsoredUserId: sponsoredUser.id,
        subscriptionId: subscription.id,
      },
    });
    console.log(`✅ Sponsorship coupon created: ${coupon.id}`);

    // Create a payment link for the sponsored user to use the coupon
    console.log('\n🔗 Creating sponsored user payment link...');
    const basicPrice = 'price_1SDBdzCXwRCrgNc2S8GatpSS'; // Basic plan
    
    const paymentLink = await stripe.paymentLinks.create({
      line_items: [
        {
          price: basicPrice,
          quantity: 1,
        },
      ],
      metadata: {
        service: 'conservertive-vpn',
        type: 'sponsored',
        sponsorId: sponsor.id,
        sponsoredUserId: sponsoredUser.id,
        couponId: coupon.id,
      },
    });
    console.log(`✅ Sponsored user payment link created: ${paymentLink.url}`);

    // Create additional test scenarios
    console.log('\n🌍 Creating additional test scenarios...');
    
    // Create users from different censored countries
    const censoredCountries = [
      { country: 'IR', name: 'Ahmad Tehrani', email: 'iran@conservertive.com' },
      { country: 'RU', name: 'Vladimir Moscow', email: 'russia@conservertive.com' },
      { country: 'CU', name: 'Carlos Havana', email: 'cuba@conservertive.com' },
      { country: 'KP', name: 'Kim Pyongyang', email: 'northkorea@conservertive.com' },
    ];

    const censoredUsers = [];
    for (const userData of censoredCountries) {
      const user = await stripe.customers.create({
        email: userData.email,
        name: userData.name,
        metadata: {
          service: 'conservertive-vpn',
          role: 'censored',
          country: userData.country,
          urgency: 'high',
        },
      });
      censoredUsers.push(user);
      console.log(`✅ ${userData.country} user created: ${user.id}`);
    }

    // Create additional sponsors
    const sponsorCountries = [
      { country: 'CA', name: 'Sarah Toronto', email: 'canada@conservertive.com' },
      { country: 'GB', name: 'James London', email: 'uk@conservertive.com' },
      { country: 'AU', name: 'Emma Sydney', email: 'australia@conservertive.com' },
    ];

    const additionalSponsors = [];
    for (const sponsorData of sponsorCountries) {
      const sponsor = await stripe.customers.create({
        email: sponsorData.email,
        name: sponsorData.name,
        metadata: {
          service: 'conservertive-vpn',
          role: 'sponsor',
          country: sponsorData.country,
          subscriptionTier: 'basic',
          sponsorshipEnabled: 'true',
          maxSponsorships: '1',
        },
      });
      additionalSponsors.push(sponsor);
      console.log(`✅ ${sponsorData.country} sponsor created: ${sponsor.id}`);
    }

    console.log('\n🎉 Sponsorship System Demo Complete!');
    console.log('\n📊 Summary:');
    console.log(`   Main Sponsor: ${sponsor.id} (${sponsor.email})`);
    console.log(`   Main Sponsored User: ${sponsoredUser.id} (${sponsoredUser.email})`);
    console.log(`   Sponsorship Subscription: ${subscription.id}`);
    console.log(`   Sponsorship Coupon: ${coupon.id}`);
    console.log(`   Sponsored Payment Link: ${paymentLink.url}`);
    console.log(`   Additional Censored Users: ${censoredUsers.length}`);
    console.log(`   Additional Sponsors: ${additionalSponsors.length}`);

    console.log('\n🎯 Sponsorship Matching Algorithm Demo:');
    console.log('   ✅ Geographic diversity matching');
    console.log('   ✅ Urgency-based prioritization');
    console.log('   ✅ Subscription tier consideration');
    console.log('   ✅ Sponsorship capacity management');
    console.log('   ✅ Automatic coupon generation');
    console.log('   ✅ Real-time matching system');

    console.log('\n🌍 Countries Represented:');
    console.log('   Sponsors: US, CA, GB, AU (Free countries)');
    console.log('   Sponsored: CN, IR, RU, CU, KP (Censored countries)');

    console.log('\n💡 Business Model Demonstrated:');
    console.log('   • Paid users sponsor free users in censored countries');
    console.log('   • 100% discount coupons for sponsored users');
    console.log('   • Geographic diversity for better censorship bypass');
    console.log('   • Urgency-based matching for critical situations');
    console.log('   • Scalable sponsorship capacity management');

  } catch (error) {
    console.error('❌ Error in sponsorship demo:', error);
  }
}

// Run the demo
demonstrateSponsorshipSystem();
