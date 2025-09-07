#!/usr/bin/env node

// Test script to verify SOLIENNE's Eden API integration
// Run with: node scripts/test-solienne-eden-api.js

const EDEN_API_KEY = 'db10962875d98d2a2dafa8599a89c850766f39647095c002';
const SOLIENNE_USER_ID = '67f8af96f2cc4291ee840cc5';
const EDEN_BASE_URL = 'https://api.eden.art';

async function testSolienneAPI() {
  console.log('🎨 Testing SOLIENNE Eden API Integration\n');
  console.log('Configuration:');
  console.log(`- API Key: ${EDEN_API_KEY.substring(0, 10)}...`);
  console.log(`- User ID: ${SOLIENNE_USER_ID}`);
  console.log(`- Base URL: ${EDEN_BASE_URL}\n`);

  try {
    // Test 1: Fetch SOLIENNE's creations
    console.log('📡 Fetching SOLIENNE\'s creations...');
    const creationsUrl = `${EDEN_BASE_URL}/v2/agents/${SOLIENNE_USER_ID}/creations?limit=10`;
    
    const response = await fetch(creationsUrl, {
      headers: {
        'Authorization': `Bearer ${EDEN_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    console.log(`Response Status: ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API Error:', errorText);
      
      // Try alternative endpoints
      console.log('\n🔄 Trying alternative endpoint structure...');
      await tryAlternativeEndpoints();
      return;
    }

    const data = await response.json();
    console.log('\n✅ Successfully connected to Eden API!');
    
    // Display creation data
    const creations = data.docs || data.creations || [];
    console.log(`\n📊 Found ${creations.length} creations:`);
    
    creations.slice(0, 5).forEach((creation, index) => {
      console.log(`\n${index + 1}. Creation: ${creation.name || creation.publicName || 'Untitled'}`);
      console.log(`   ID: ${creation._id || creation.id}`);
      console.log(`   Type: ${creation.tool || creation.generator || 'Unknown'}`);
      console.log(`   Status: ${creation.status || 'Unknown'}`);
      console.log(`   Created: ${creation.createdAt || creation.created_at || 'Unknown'}`);
      if (creation.url || creation.uri) {
        console.log(`   URL: ${creation.url || creation.uri}`);
      }
    });

    // Test 2: Check if we can access user profile
    console.log('\n📡 Fetching SOLIENNE\'s profile...');
    await testUserProfile();

  } catch (error) {
    console.error('\n❌ Error testing Eden API:', error);
    console.error('Stack:', error.stack);
  }
}

async function tryAlternativeEndpoints() {
  const alternatives = [
    `/v2/users/${SOLIENNE_USER_ID}/creations`,
    `/agents/${SOLIENNE_USER_ID}/creations`,
    `/users/${SOLIENNE_USER_ID}/creations`,
    `/v1/agents/${SOLIENNE_USER_ID}/creations`,
  ];

  for (const endpoint of alternatives) {
    console.log(`\nTrying: ${EDEN_BASE_URL}${endpoint}`);
    try {
      const response = await fetch(`${EDEN_BASE_URL}${endpoint}?limit=5`, {
        headers: {
          'Authorization': `Bearer ${EDEN_API_KEY}`,
          'Content-Type': 'application/json',
        },
      });
      
      console.log(`Response: ${response.status}`);
      if (response.ok) {
        const data = await response.json();
        console.log('✅ This endpoint works!');
        console.log('Sample response:', JSON.stringify(data, null, 2).substring(0, 500));
        return;
      }
    } catch (err) {
      console.log(`Failed: ${err.message}`);
    }
  }
}

async function testUserProfile() {
  try {
    const profileUrl = `${EDEN_BASE_URL}/v2/users/${SOLIENNE_USER_ID}`;
    const response = await fetch(profileUrl, {
      headers: {
        'Authorization': `Bearer ${EDEN_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const profile = await response.json();
      console.log('✅ Profile found:');
      console.log(`   Username: ${profile.username || 'Unknown'}`);
      console.log(`   Name: ${profile.name || 'Unknown'}`);
      console.log(`   Bio: ${profile.bio || 'No bio'}`);
    } else {
      console.log(`❌ Could not fetch profile: ${response.status}`);
    }
  } catch (error) {
    console.log('❌ Profile fetch error:', error.message);
  }
}

// Run the test
testSolienneAPI();