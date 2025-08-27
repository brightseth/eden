// Quick test of BERTHA endpoints
const BASE_URL = 'http://localhost:3000';

async function testBerthaEndpoints() {
  console.log('🧪 Testing BERTHA endpoints...\n');
  
  // Test 1: Basic status
  try {
    console.log('1. Testing GET /api/agents/bertha');
    const response = await fetch(`${BASE_URL}/api/agents/bertha`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Status:', data.status);
      console.log('   Version:', data.version);
      console.log('   Capabilities:', data.capabilities.length);
    } else {
      console.log('❌ Failed:', response.status, response.statusText);
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
  
  console.log('');
  
  // Test 2: Evaluation endpoint
  try {
    console.log('2. Testing POST /api/agents/bertha/evaluate');
    const testArtwork = {
      artwork: {
        title: 'Genesis Block #1',
        artist: 'Digital Pioneer',
        currentPrice: 2.5,
        currency: 'ETH',
        platform: 'SuperRare'
      },
      signals: {
        technical: 0.8,
        cultural: 0.6,
        market: 0.7,
        aesthetic: 0.75
      },
      metadata: {
        medium: 'Generative Art',
        created: '2024-08-27',
        provenance: ['Artist wallet', 'Gallery verification']
      }
    };
    
    const response = await fetch(`${BASE_URL}/api/agents/bertha/evaluate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testArtwork)
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Decision:', data.decision.action);
      console.log('   Confidence:', Math.round(data.decision.confidence * 100) + '%');
      console.log('   Urgency:', data.decision.urgency);
      console.log('   Archetypes tested:', data.archetypes.length);
    } else {
      console.log('❌ Failed:', response.status, response.statusText);
      const errorData = await response.text();
      console.log('   Error:', errorData);
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
  
  console.log('');
  
  // Test 3: Portfolio analysis
  try {
    console.log('3. Testing POST /api/agents/bertha/portfolio');
    const testPortfolio = {
      holdings: [
        { id: '1', title: 'CryptoPunk #1234', value: 50, category: 'PFP', platform: 'OpenSea' },
        { id: '2', title: 'Art Blocks #5678', value: 15, category: 'Generative', platform: 'ArtBlocks' },
        { id: '3', title: 'Digital Landscape', value: 8, category: 'Photography', platform: 'SuperRare' }
      ],
      totalValue: 73,
      cashAvailable: 10
    };
    
    const response = await fetch(`${BASE_URL}/api/agents/bertha/portfolio`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testPortfolio)
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Health Grade:', data.analysis.healthGrade);
      console.log('   Overall Health:', Math.round(data.analysis.overallHealth * 100) + '%');
      console.log('   Recommendations:', data.recommendations.immediate.length);
      console.log('   Rebalance needed:', data.rebalancing.needed);
    } else {
      console.log('❌ Failed:', response.status, response.statusText);
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
  
  console.log('');
  
  // Test 4: Status endpoint
  try {
    console.log('4. Testing GET /api/agents/bertha/status');
    const response = await fetch(`${BASE_URL}/api/agents/bertha/status`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Agent Status:', data.status);
      console.log('   Uptime:', data.uptime);
      console.log('   Training Status:', data.training.status);
      console.log('   Archetypes Loaded:', data.training.archetypesLoaded);
    } else {
      console.log('❌ Failed:', response.status, response.statusText);
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
  
  console.log('\n🎉 BERTHA endpoint testing complete!');
}

// Run the tests
testBerthaEndpoints().catch(console.error);