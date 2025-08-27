#!/usr/bin/env npx tsx

/**
 * Test Registry API Endpoints
 */

async function testRegistryEndpoints() {
  console.log('🔍 EXPLORING REGISTRY API ENDPOINTS');
  console.log('=' .repeat(50));
  
  const baseUrl = 'https://eden-genesis-registry.vercel.app/api/v1';
  const apiKey = 'eden-academy-client';
  
  const endpoints = [
    { method: 'GET', path: '/agents', name: 'List Agents' },
    { method: 'GET', path: '/agents/abraham', name: 'Get Abraham Agent' },
    { method: 'GET', path: '/agents/abraham/creations', name: 'Get Abraham Creations' },
    { method: 'GET', path: '/health', name: 'Health Check' },
    { method: 'GET', path: '/', name: 'Root Endpoint' },
  ];
  
  for (const endpoint of endpoints) {
    try {
      console.log(`\n${endpoint.method} ${endpoint.path} (${endpoint.name})`);
      
      const response = await fetch(`${baseUrl}${endpoint.path}`, {
        method: endpoint.method,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-API-Key': apiKey,
        }
      });
      
      console.log(`   Status: ${response.status} ${response.statusText}`);
      
      if (response.ok) {
        const data = await response.text();
        const preview = data.substring(0, 200);
        console.log(`   Response: ${preview}${data.length > 200 ? '...' : ''}`);
        
        // Try to parse as JSON
        try {
          const json = JSON.parse(data);
          if (Array.isArray(json)) {
            console.log(`   Type: Array with ${json.length} items`);
          } else if (typeof json === 'object') {
            console.log(`   Type: Object with keys: ${Object.keys(json).join(', ')}`);
          }
        } catch (e) {
          console.log(`   Type: Non-JSON response`);
        }
      } else {
        const errorText = await response.text();
        console.log(`   Error: ${errorText.substring(0, 100)}`);
      }
      
    } catch (error) {
      console.log(`   ❌ Request failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  
  // Test POST to a creation endpoint
  console.log(`\nTesting POST creation...`);
  try {
    const response = await fetch(`${baseUrl}/agents/abraham/creations`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-API-Key': apiKey,
      },
      body: JSON.stringify({
        type: 'test',
        title: 'Registry Test',
        description: 'Testing creation',
        metadata: { test: true },
        status: 'draft'
      })
    });
    
    console.log(`   POST Status: ${response.status} ${response.statusText}`);
    const responseText = await response.text();
    console.log(`   POST Response: ${responseText.substring(0, 200)}`);
    
  } catch (error) {
    console.log(`   ❌ POST failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

testRegistryEndpoints();