#!/usr/bin/env npx tsx

/**
 * Test Registry with Direct API Key
 */

import { RegistryClient } from './src/lib/registry/sdk';

async function testRegistryDirect() {
  console.log('🔐 TESTING REGISTRY WITH DIRECT API KEY');
  console.log('=' .repeat(50));
  
  // Try different API keys
  const apiKeys = [
    'eden-academy-client',
    'registry-upload-key-v1',
  ];
  
  for (const apiKey of apiKeys) {
    console.log(`\nTesting with API Key: ${apiKey}`);
    console.log('-'.repeat(30));
    
    try {
      // Create client with specific API key
      const client = new RegistryClient({
        headers: {
          'X-API-Key': apiKey
        }
      });
      
      console.log('1. Testing health check...');
      const health = await client.health();
      console.log(`   Status: ${health.status}`);
      
      if (health.status === 'ok') {
        console.log('2. Testing agent list...');
        const agents = await client.agents.list({ limit: 1 });
        console.log(`   Retrieved ${agents.length} agents`);
        
        if (agents.length > 0) {
          console.log('3. Testing creation...');
          const testAgent = agents[0];
          try {
            const creation = await client.creations.create(testAgent.id, {
              type: 'text',
              title: `Test Creation - ${apiKey}`,
              description: 'Testing Registry creation with different API keys',
              metadata: {
                test: true,
                apiKey: apiKey,
                timestamp: new Date().toISOString()
              },
              status: 'draft'
            });
            console.log(`   ✅ SUCCESS! Created: ${creation.id}`);
            break; // Exit on first success
          } catch (error) {
            console.log(`   ❌ Creation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
          }
        }
      }
      
    } catch (error) {
      console.log(`   ❌ Failed with ${apiKey}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

testRegistryDirect();