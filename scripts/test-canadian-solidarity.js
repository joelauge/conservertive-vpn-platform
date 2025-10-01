#!/usr/bin/env node

// Test Canadian-to-Canadian Sponsorship
function testCanadianSolidarity() {
  console.log('🇨🇦 Testing Canadian-to-Canadian Sponsorship\n');

  // Sample data for Canadian solidarity test
  const canadianRequests = [
    {
      id: 'req-ca-1',
      userId: 'user-ca-1',
      country: 'CA',
      reason: 'Canadian journalist needs secure communication',
      urgency: 'high',
      ipAddress: '1.2.3.4',
    },
    {
      id: 'req-ca-2',
      userId: 'user-ca-2',
      country: 'CA',
      reason: 'Canadian student needs access to educational resources',
      urgency: 'medium',
      ipAddress: '5.6.7.8',
    },
  ];

  const canadianSponsors = [
    {
      id: 'sponsor-ca-1',
      country: 'CA',
      subscriptionTier: 'premium',
      sponsorshipCount: 0,
      maxSponsorships: 2,
      sponsorshipEnabled: true,
    },
    {
      id: 'sponsor-ca-2',
      country: 'CA',
      subscriptionTier: 'enterprise',
      sponsorshipCount: 0,
      maxSponsorships: 3,
      sponsorshipEnabled: true,
    },
  ];

  const internationalSponsors = [
    {
      id: 'sponsor-us-1',
      country: 'US',
      subscriptionTier: 'premium',
      sponsorshipCount: 0,
      maxSponsorships: 3,
      sponsorshipEnabled: true,
    },
    {
      id: 'sponsor-gb-1',
      country: 'GB',
      subscriptionTier: 'basic',
      sponsorshipCount: 1,
      maxSponsorships: 2,
      sponsorshipEnabled: true,
    },
  ];

  console.log('📋 Canadian Sponsorship Requests:');
  canadianRequests.forEach((req, index) => {
    console.log(`   ${index + 1}. ${req.country} - ${req.reason} (${req.urgency} urgency)`);
  });

  console.log('\n👥 Canadian Sponsors:');
  canadianSponsors.forEach((sponsor, index) => {
    console.log(`   ${index + 1}. ${sponsor.country} - ${sponsor.subscriptionTier} (${sponsor.sponsorshipCount}/${sponsor.maxSponsorships} sponsorships)`);
  });

  console.log('\n🌍 International Sponsors:');
  internationalSponsors.forEach((sponsor, index) => {
    console.log(`   ${index + 1}. ${sponsor.country} - ${sponsor.subscriptionTier} (${sponsor.sponsorshipCount}/${sponsor.maxSponsorships} sponsorships)`);
  });

  console.log('\n🔄 Running Canadian Solidarity Matching...\n');

  // Canadian solidarity algorithm
  function calculateCanadianScore(request, sponsor) {
    let score = 0;

    // Base score for having sponsorship enabled
    if (!sponsor.sponsorshipEnabled) return 0;
    score += 50;

    // Bonus for fewer current sponsorships
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

    // MAJOR BONUS for Canadian-to-Canadian sponsorship
    if (request.country === 'CA' && sponsor.country === 'CA') {
      score += 25; // Canadian solidarity bonus
      console.log(`   🇨🇦 Canadian solidarity bonus: +25 points`);
    }

    // Bonus for subscription tier
    switch (sponsor.subscriptionTier) {
      case 'premium':
        score += 10;
        break;
      case 'enterprise':
        score += 20;
        break;
    }

    return Math.min(score, 100);
  }

  function getCanadianReasons(request, sponsor) {
    const reasons = [];

    if (sponsor.subscriptionTier === 'enterprise') {
      reasons.push('Enterprise subscriber with high sponsorship capacity');
    } else if (sponsor.subscriptionTier === 'premium') {
      reasons.push('Premium subscriber with sponsorship benefits');
    }

    if (sponsor.sponsorshipCount < sponsor.maxSponsorships) {
      reasons.push('Available sponsorship capacity');
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

  // Test matching for Canadian requests
  const allSponsors = [...canadianSponsors, ...internationalSponsors];
  const matches = [];

  for (const request of canadianRequests) {
    console.log(`🔍 Matching Canadian request: ${request.reason}`);
    
    let bestMatch = null;
    let highestScore = 0;

    for (const sponsor of allSponsors) {
      const score = calculateCanadianScore(request, sponsor);
      
      if (score > highestScore && score >= 60) {
        highestScore = score;
        bestMatch = {
          request,
          sponsor,
          score,
          reasons: getCanadianReasons(request, sponsor),
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

  console.log('📊 Canadian Solidarity Results:');
  console.log(`   Total Canadian Requests: ${canadianRequests.length}`);
  console.log(`   Successful Matches: ${matches.length}`);
  console.log(`   Success Rate: ${Math.round((matches.length / canadianRequests.length) * 100)}%`);

  console.log('\n🇨🇦 Canadian-to-Canadian Matches:');
  const canadianMatches = matches.filter(match => 
    match.request.country === 'CA' && match.sponsor.country === 'CA'
  );
  
  if (canadianMatches.length > 0) {
    canadianMatches.forEach((match, index) => {
      console.log(`   ${index + 1}. ${match.request.country} → ${match.sponsor.country}`);
      console.log(`      Score: ${match.score}/100`);
      console.log(`      Reason: ${match.request.reason}`);
      console.log(`      Sponsor: ${match.sponsor.subscriptionTier} tier`);
      console.log(`      Solidarity: Canadian supporting Canadian`);
    });
  } else {
    console.log('   No Canadian-to-Canadian matches found');
  }

  console.log('\n🌍 International Matches for Canadians:');
  const internationalMatches = matches.filter(match => 
    match.request.country === 'CA' && match.sponsor.country !== 'CA'
  );
  
  if (internationalMatches.length > 0) {
    internationalMatches.forEach((match, index) => {
      console.log(`   ${index + 1}. ${match.request.country} → ${match.sponsor.country}`);
      console.log(`      Score: ${match.score}/100`);
      console.log(`      Reason: ${match.request.reason}`);
      console.log(`      Sponsor: ${match.sponsor.subscriptionTier} tier`);
    });
  } else {
    console.log('   No international matches found');
  }

  console.log('\n💡 Canadian Solidarity Features:');
  console.log('   ✅ Canadian-to-Canadian sponsorship enabled');
  console.log('   ✅ Canadian solidarity bonus (+25 points)');
  console.log('   ✅ Premium Canadian sponsors prioritized');
  console.log('   ✅ High urgency Canadian requests prioritized');
  console.log('   ✅ Fallback to international sponsors if needed');

  return matches;
}

// Run the Canadian solidarity test
const canadianMatches = testCanadianSolidarity();

console.log('\n🎉 Canadian Solidarity Test Complete!');
console.log('\n🇨🇦 Key Benefits:');
console.log('   • Canadians can sponsor other Canadians');
console.log('   • Canadian solidarity bonus encourages local support');
console.log('   • Fallback to international sponsors ensures coverage');
console.log('   • High urgency requests get priority');
console.log('   • Premium Canadian subscribers can sponsor more users');
