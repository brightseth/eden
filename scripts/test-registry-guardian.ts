#!/usr/bin/env npx tsx
// Test script for Registry Guardian improvements
// Run with: npx tsx scripts/test-registry-guardian.ts

import { registryGateway } from '../src/lib/registry/gateway';
import { registryMonitor, getConsistencyReport } from '../src/lib/registry/monitor';
import { dataAdapter } from '../src/lib/registry/adapter';

async function testRegistryGuardian() {
  console.log('🛡️  Registry Guardian Test Suite\n');
  console.log('=' .repeat(50));
  
  // Test 1: Gateway Health Check
  console.log('\n📊 Test 1: Gateway Health Check');
  try {
    const health = await registryGateway.healthCheck();
    console.log('Gateway Status:', health.status);
    console.log('Circuit Breaker:', health.circuitBreaker);
    console.log('Cache Size:', health.cacheSize);
  } catch (error) {
    console.error('❌ Gateway health check failed:', error);
  }

  // Test 2: Schema Consistency
  console.log('\n📊 Test 2: Schema Consistency');
  const useRegistry = process.env.USE_REGISTRY === 'true';
  console.log('Registry Mode:', useRegistry ? 'ENABLED' : 'DISABLED (Legacy Mode)');
  console.log('Registry URL:', process.env.REGISTRY_BASE_URL || 'Using default');
  
  // Test 3: Data Flow Test
  console.log('\n📊 Test 3: Data Flow Test');
  try {
    if (useRegistry) {
      // Test Gateway pattern
      console.log('Testing Gateway → Registry flow...');
      const agents = await registryGateway.getAgents({ cohort: 'genesis' });
      console.log(`✓ Fetched ${agents.length} agents via Gateway`);
      
      if (agents.length > 0) {
        const testAgent = agents[0];
        console.log(`✓ Sample agent: ${testAgent.handle} (${testAgent.status})`);
        
        // Validate enum consistency
        const validStatuses = ['INVITED', 'APPLYING', 'ONBOARDING', 'ACTIVE', 'GRADUATED', 'ARCHIVED'];
        if (validStatuses.includes(testAgent.status)) {
          console.log('✓ Agent status enum is valid (uppercase)');
        } else {
          console.log(`⚠️  Invalid status enum: ${testAgent.status}`);
        }
      }
    } else {
      console.log('Testing Adapter → Legacy DB flow...');
      const agents = await dataAdapter.getAgents({ cohort: 'genesis' });
      console.log(`✓ Fetched ${agents.length} agents via Legacy adapter`);
    }
  } catch (error) {
    console.error('❌ Data flow test failed:', error);
  }

  // Test 4: Circuit Breaker Test (simulated)
  console.log('\n📊 Test 4: Circuit Breaker Simulation');
  console.log('Simulating Registry failures...');
  
  // Save original URL
  const originalUrl = process.env.REGISTRY_BASE_URL;
  
  // Set invalid URL to trigger failures
  process.env.REGISTRY_BASE_URL = 'http://invalid-registry-url.local';
  
  for (let i = 0; i < 3; i++) {
    try {
      await registryGateway.getAgents();
    } catch (error) {
      console.log(`  Attempt ${i + 1}: Expected failure triggered`);
    }
  }
  
  // Check circuit breaker state
  const healthAfterFailures = await registryGateway.healthCheck();
  console.log('Circuit Breaker State:', healthAfterFailures.circuitBreaker);
  
  // Restore original URL
  process.env.REGISTRY_BASE_URL = originalUrl;
  
  // Test 5: Consistency Report
  console.log('\n📊 Test 5: Full Consistency Report');
  console.log('-'.repeat(50));
  
  // Enable monitoring for this test
  process.env.ENABLE_REGISTRY_MONITOR = 'true';
  
  const report = await getConsistencyReport();
  console.log(report);
  
  // Test 6: Cache Performance
  console.log('\n📊 Test 6: Cache Performance');
  console.log('Testing cache effectiveness...');
  
  // Clear cache first
  registryGateway.clearCache();
  console.log('✓ Cache cleared');
  
  // First call - cache miss
  const start1 = Date.now();
  await registryGateway.getAgents({ cohort: 'genesis' });
  const time1 = Date.now() - start1;
  console.log(`  First call (cache miss): ${time1}ms`);
  
  // Second call - cache hit
  const start2 = Date.now();
  await registryGateway.getAgents({ cohort: 'genesis' });
  const time2 = Date.now() - start2;
  console.log(`  Second call (cache hit): ${time2}ms`);
  
  if (time2 < time1 / 2) {
    console.log('✓ Cache is working effectively');
  } else {
    console.log('⚠️  Cache performance not optimal');
  }
  
  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('🛡️  Registry Guardian Test Complete');
  console.log('='.repeat(50));
  
  // Get final metrics
  const metrics = registryMonitor.getMetrics();
  console.log('\nFinal Metrics:', metrics);
}

// Run tests
testRegistryGuardian().catch(console.error);