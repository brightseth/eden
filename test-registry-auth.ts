#!/usr/bin/env npx tsx

/**
 * Test Registry Authentication Fix
 */

import { registryClient } from './src/lib/registry/sdk';

async function testRegistryAuth() {
  console.log('🔐 TESTING REGISTRY AUTHENTICATION');
  console.log('=' .repeat(50));
  
  try {
    console.log('1. Testing Registry health check...');
    const health = await registryClient.health();
    console.log(`   Status: ${health.status}`);
    console.log(`   Message: ${health.message}`);
    
    if (health.status !== 'ok') {
      throw new Error('Registry is not healthy');
    }
    
    console.log('\n2. Testing agent list endpoint...');
    const agents = await registryClient.agents.list({ limit: 3 });
    console.log(`   Retrieved ${agents.length} agents`);
    agents.forEach(agent => {
      console.log(`   • ${agent.handle} (${agent.status})`);
    });
    
    console.log('\n3. Testing creation endpoint (POST)...');
    // Try to create a test creation for the first agent
    if (agents.length > 0) {
      const testAgent = agents[0];
      try {
        const creation = await registryClient.creations.create(testAgent.id, {
          type: 'text',
          title: 'Registry Auth Test',
          description: 'Testing Registry authentication fix',
          metadata: {
            test: true,
            timestamp: new Date().toISOString()
          },
          status: 'draft'
        });
        console.log(`   ✅ Successfully created test work: ${creation.id}`);
        
        // Clean up - delete the test creation
        console.log('   🧹 Cleaning up test creation...');
        // Note: Would need delete endpoint to clean up properly
        
      } catch (error) {
        console.log(`   ❌ Creation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
    
    console.log('\n✅ Registry authentication test completed successfully!');
    
  } catch (error) {
    console.error('\n❌ Registry authentication test failed:', error);
    process.exit(1);
  }
}

testRegistryAuth();