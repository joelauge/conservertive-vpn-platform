#!/usr/bin/env node

const Stripe = require('stripe');

// Initialize Stripe with test keys
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_YOUR_STRIPE_SECRET_KEY_HERE', {
  apiVersion: '2025-08-27.basil',
});

// Sponsorship Matching Algorithm Demo
function demonstrateMatchingAlgorithm() {
  console.log('🎯 ConSERVERtive Sponsorship Matching Algorithm Demo\n');

  // Sample data for demonstration
  const sponsorshipRequests = [
    {
      id: 'req-1',
      userId: 'user-1',
      country: 'CN',
      reason: 'Journalist needs secure communication',
      urgency: 'high',
      ipAddress: '1.2.3.4',
    },
    {
      id: 'req-2',
      userId: 'user-2',
      country: 'IR',
      reason: 'Student needs access to educational resources',
      urgency: 'medium',
      ipAddress: '5.6.7.8',
    },
    {
      id: 'req-3',
      userId: 'user-3',
      country: 'RU',
      reason: 'Activist needs secure communication',
      urgency: 'high',
      ipAddress: '9.10.11.12',
    },
    {
      id: 'req-4',
      userId: 'user-4',
      country: 'CA',
      reason: 'Citizen needs access to free internet',
      urgency: 'high',
      ipAddress: '13.14.15.16',
    },
  ];

  const potentialSponsors = [
    {
      id: 'sponsor-1',
      country: 'US',
      subscriptionTier: 'premium',
      sponsorshipCount: 0,
      maxSponsorships: 3,
      sponsorshipEnabled: true,
    },
    {
      id: 'sponsor-2',
      country: 'GB',
      subscriptionTier: 'basic',
      sponsorshipCount: 1,
      maxSponsorships: 2,
      sponsorshipEnabled: true,
    },
    {
      id: 'sponsor-3',
      country: 'AU',
      subscriptionTier: 'enterprise',
      sponsorshipCount: 0,
      maxSponsorships: 5,
      sponsorshipEnabled: true,
    },
    {
      id: 'sponsor-4',
      country: 'CA',
      subscriptionTier: 'premium',
      sponsorshipCount: 0,
      maxSponsorships: 2,
      sponsorshipEnabled: true,
    },
  ];

  console.log('📋 Sponsorship Requests:');
  sponsorshipRequests.forEach((req, index) => {
    console.log(`   ${index + 1}. ${req.country} - ${req.reason} (${req.urgency} urgency)`);
  });

  console.log('\n👥 Potential Sponsors:');
  potentialSponsors.forEach((sponsor, index) => {
    console.log(`   ${index + 1}. ${sponsor.country} - ${sponsor.subscriptionTier} (${sponsor.sponsorshipCount}/${sponsor.maxSponsorships} sponsorships)`);
  });

  console.log('\n🔄 Running Matching Algorithm...\n');

  // Matching algorithm implementation
  function calculateMatchScore(request, sponsor) {
    let score = 0;

    // Base score for having sponsorship enabled
    if (!sponsor.sponsorshipEnabled) return 0;
    score += 50;

    // Bonus for fewer current sponsorships (more available capacity)
    const capacityRatio = 1 - (sponsor.sponsorshipCount / sponsor.maxSponsorships);
    score += capacityRatio * 30;

    // Bonus for urgency
    switch (request.urgency) {
      case 'high':
        score += 20;
        break;
      case 'medium':
        score += 10;
        break;
      case 'low':
        score += 5;
        break;
    }

    // Bonus for geographic diversity (sponsor from different region)
    if (isDifferentRegion(request.country, sponsor.country)) {
      score += 15;
    }

    // Special bonus for Canadian-to-Canadian sponsorship
    if (request.country === 'CA' && sponsor.country === 'CA') {
      score += 25; // Extra bonus for Canadian solidarity
    }

    // Bonus for sponsor's subscription tier
    switch (sponsor.subscriptionTier) {
      case 'premium':
        score += 10;
        break;
      case 'enterprise':
        score += 20;
        break;
    }

    return Math.min(score, 100); // Cap at 100
  }

  function isDifferentRegion(country1, country2) {
    const regions = {
      'north-america': ['US', 'MX'],
      'europe': ['GB', 'DE', 'FR', 'IT', 'ES', 'NL', 'SE', 'NO', 'DK'],
      'asia': ['CN', 'JP', 'KR', 'IN', 'SG', 'HK', 'TW'],
      'middle-east': ['AE', 'SA', 'IL', 'TR', 'IR'],
      'africa': ['ZA', 'NG', 'EG', 'KE'],
      'oceania': ['AU', 'NZ'],
      'south-america': ['BR', 'AR', 'CL', 'CO', 'PE'],
      'eastern-europe': ['RU', 'UA', 'BY', 'KZ'],
      'censored-north-america': ['CA'], // Canada moved to censored
    };

    const region1 = Object.keys(regions).find(region => 
      regions[region].includes(country1.toUpperCase())
    );
    const region2 = Object.keys(regions).find(region => 
      regions[region].includes(country2.toUpperCase())
    );

    return region1 !== region2;
  }

  function getMatchReasons(request, sponsor) {
    const reasons = [];

    if (sponsor.subscriptionTier === 'enterprise') {
      reasons.push('Enterprise subscriber with high sponsorship capacity');
    } else if (sponsor.subscriptionTier === 'premium') {
      reasons.push('Premium subscriber with sponsorship benefits');
    }

    if (sponsor.sponsorshipCount < sponsor.maxSponsorships) {
      reasons.push('Available sponsorship capacity');
    }

    if (isDifferentRegion(request.country, sponsor.country)) {
      reasons.push('Geographic diversity for better censorship bypass');
    }

    // Special reason for Canadian-to-Canadian sponsorship
    if (request.country === 'CA' && sponsor.country === 'CA') {
      reasons.push('Canadian solidarity - supporting fellow citizens');
    }

    if (request.urgency === 'high') {
      reasons.push('High urgency request prioritized');
    }

    return reasons;
  }

  // Run matching for each request
  const matches = [];
  
  for (const request of sponsorshipRequests) {
    console.log(`🔍 Matching request: ${request.country} - ${request.reason}`);
    
    let bestMatch = null;
    let highestScore = 0;

    for (const sponsor of potentialSponsors) {
      const score = calculateMatchScore(request, sponsor);
      
      if (score > highestScore && score >= 60) { // Minimum score threshold
        highestScore = score;
        bestMatch = {
          request,
          sponsor,
          score,
          reasons: getMatchReasons(request, sponsor),
        };
      }
    }

    if (bestMatch) {
      matches.push(bestMatch);
      console.log(`   ✅ MATCHED with ${bestMatch.sponsor.country} (Score: ${bestMatch.score}/100)`);
      console.log(`      Reasons: ${bestMatch.reasons.join(', ')}`);
      
      // Update sponsor's sponsorship count
      bestMatch.sponsor.sponsorshipCount++;
    } else {
      console.log(`   ❌ No suitable match found`);
    }
    console.log('');
  }

  console.log('📊 Matching Results Summary:');
  console.log(`   Total Requests: ${sponsorshipRequests.length}`);
  console.log(`   Successful Matches: ${matches.length}`);
  console.log(`   Success Rate: ${Math.round((matches.length / sponsorshipRequests.length) * 100)}%`);

  console.log('\n🎯 Matched Sponsorships:');
  matches.forEach((match, index) => {
    console.log(`   ${index + 1}. ${match.request.country} → ${match.sponsor.country}`);
    console.log(`      Score: ${match.score}/100`);
    console.log(`      Reason: ${match.request.reason}`);
    console.log(`      Sponsor: ${match.sponsor.subscriptionTier} tier`);
  });

  console.log('\n🌍 Geographic Distribution:');
  const countryStats = {};
  matches.forEach(match => {
    countryStats[match.request.country] = (countryStats[match.request.country] || 0) + 1;
  });
  
  Object.entries(countryStats).forEach(([country, count]) => {
    console.log(`   ${country}: ${count} sponsorship${count > 1 ? 's' : ''}`);
  });

  console.log('\n💡 Algorithm Features Demonstrated:');
  console.log('   ✅ Geographic diversity matching');
  console.log('   ✅ Urgency-based prioritization');
  console.log('   ✅ Subscription tier consideration');
  console.log('   ✅ Sponsorship capacity management');
  console.log('   ✅ Dynamic scoring system');
  console.log('   ✅ Real-time matching updates');
  console.log('   ✅ Canadian solidarity bonus');

  return matches;
}

// Run the demo
const matches = demonstrateMatchingAlgorithm();

console.log('\n🎉 Sponsorship Matching System Demo Complete!');
console.log('\n🚀 Next Steps:');
console.log('   1. Integrate with Stripe for payment processing');
console.log('   2. Create automatic coupon generation');
console.log('   3. Set up real-time notifications');
console.log('   4. Implement sponsorship tracking dashboard');
console.log('   5. Add machine learning for better matching');
