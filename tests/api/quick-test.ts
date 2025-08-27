/**
 * Quick test to verify API endpoints are working
 */

import { ApiTestClient } from './base/api-test-client';

async function quickTest() {
  const client = new ApiTestClient('http://localhost:3002/api');
  
  console.log('🧪 Running quick API test...\n');
  
  try {
    // Test health endpoint
    console.log('Testing /health endpoint...');
    console.log('Full URL:', client.getBaseUrl() + '/health');
    const healthResponse = await client.get('/health');
    console.log(`Status: ${healthResponse.status}`);
    console.log('Data:', JSON.stringify(healthResponse.data, null, 2));
    
    if (healthResponse.status === 200) {
      console.log('✅ Health endpoint working\n');
    } else {
      console.log('❌ Health endpoint failed\n');
    }
    
    // Test agents endpoint  
    console.log('Testing /agents endpoint...');
    const agentsResponse = await client.get('/agents');
    console.log(`Status: ${agentsResponse.status}`);
    if (agentsResponse.data?.agents) {
      console.log(`Found ${agentsResponse.data.agents.length} agents`);
    }
    console.log('✅ Agents endpoint working\n');
    
    // Test works endpoint
    console.log('Testing /works endpoint...');
    const worksResponse = await client.get('/works');
    console.log(`Status: ${worksResponse.status}`);
    if (worksResponse.data?.works) {
      console.log(`Found ${worksResponse.data.works.length} works`);
    }
    console.log('✅ Works endpoint working\n');
    
    console.log('🎉 All tested endpoints are working!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

quickTest();