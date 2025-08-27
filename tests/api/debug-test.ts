/**
 * Debug test to investigate API client issues
 */

import { ApiTestClient } from './base/api-test-client';

async function debugTest() {
  const client = new ApiTestClient('http://localhost:3007/api');
  
  console.log('🔍 Debugging API client...\n');
  
  try {
    // Test health endpoint with detailed logging
    console.log('1. Testing health endpoint...');
    console.log('Base URL:', client.getBaseUrl());
    console.log('Request URL:', client.getBaseUrl() + '/health');
    
    // Test URL construction manually
    const testUrl = new URL('/health', 'http://localhost:3002/api');
    console.log('Manual URL construction:', testUrl.toString());
    
    const healthResponse = await client.get('/health');
    
    console.log('Response details:');
    console.log('- Status:', healthResponse.status);
    console.log('- OK:', healthResponse.ok);
    console.log('- Content-Type:', healthResponse.headers.get('content-type'));
    console.log('- Data type:', typeof healthResponse.data);
    console.log('- Data:', healthResponse.data);
    console.log('- Error:', healthResponse.error);
    console.log('');
    
    // Test direct fetch for comparison
    console.log('2. Testing direct fetch...');
    const directResponse = await fetch('http://localhost:3007/api/health');
    const directData = await directResponse.json();
    
    console.log('Direct fetch:');
    console.log('- Status:', directResponse.status);
    console.log('- Content-Type:', directResponse.headers.get('content-type'));
    console.log('- Data:', directData);
    
  } catch (error) {
    console.error('❌ Debug test failed:', error);
  }
}

debugTest();