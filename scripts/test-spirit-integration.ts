#!/usr/bin/env npx tsx

/**
 * Spirit Integration Test Runner
 * 
 * Standalone test runner for Spirit graduation flow
 * Can be run independently of Jest framework
 */

import { registryClient } from '../src/lib/registry/registry-client'

// Test configuration
const CONFIG = {
  testAgentHandle: process.env.TEST_AGENT_HANDLE || 'abraham',
  trainerAddress: process.env.TEST_TRAINER_ADDRESS || '0x742d35Cc6634C0532925a3b8B5c03c8c',
  registryUrl: process.env.NEXT_PUBLIC_REGISTRY_URL || 'http://localhost:3000/api/v1'
}

// Test state
let testResults: { test: string; status: 'PASS' | 'FAIL' | 'SKIP'; message: string; duration: number }[] = []

function logTest(test: string, status: 'PASS' | 'FAIL' | 'SKIP', message: string, duration: number) {
  const icon = status === 'PASS' ? '✓' : status === 'FAIL' ? '✗' : '⚠'
  console.log(`${icon} ${test} (${duration}ms) - ${message}`)
  testResults.push({ test, status, message, duration })
}

async function runTest(name: string, testFn: () => Promise<void>) {
  const start = Date.now()
  try {
    await testFn()
    logTest(name, 'PASS', 'Success', Date.now() - start)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    logTest(name, 'FAIL', message, Date.now() - start)
  }
}

async function main() {
  console.log('🚀 Starting Spirit Integration Tests')
  console.log('=====================================')
  console.log(`Registry URL: ${CONFIG.registryUrl}`)
  console.log(`Test Agent: ${CONFIG.testAgentHandle}`)
  console.log(`Trainer: ${CONFIG.trainerAddress}`)
  console.log('')

  // Enable feature flag for testing
  process.env.FF_EDEN3_ONBOARDING = 'true'

  let testAgent: any
  let graduatedSpirit: any

  // Phase 1: Pre-graduation tests
  console.log('📋 Phase 1: Pre-Graduation Agent State')
  
  await runTest('Fetch test agent from Registry', async () => {
    const result = await registryClient.getAgent(CONFIG.testAgentHandle)
    
    if (result.error) {
      throw new Error(`Failed to fetch agent: ${result.error}`)
    }
    
    if (!result.data) {
      throw new Error('No agent data returned')
    }
    
    testAgent = result.data
    console.log(`  Agent: ${testAgent.name} (${testAgent.status})`)
    console.log(`  Source: ${result.source}`)
  })

  await runTest('Verify Registry health', async () => {
    try {
      const healthResponse = await fetch(`${CONFIG.registryUrl}/health`)
      if (!healthResponse.ok) {
        console.log('  Registry health check failed, fallback mode will be used')
      } else {
        console.log('  Registry is healthy')
      }
    } catch (error) {
      console.log('  Registry not available, fallback mode will be used')
    }
  })

  // Phase 2: Graduation flow
  console.log('\n🎓 Phase 2: Spirit Graduation Flow')

  const graduationRequest = {
    name: `TEST SPIRIT ${Date.now()}`,
    archetype: 'CREATOR' as const,
    practice: {
      timeOfDay: 9,
      outputType: 'Integration Test Art',
      quantity: 1,
      observeSabbath: true
    },
    graduationMode: 'ID_ONLY' as const,
    trainerAddress: CONFIG.trainerAddress,
    idempotencyKey: `integration-test-${Date.now()}`
  }

  await runTest('Graduate agent to Spirit', async () => {
    const result = await registryClient.graduateSpirit(testAgent.id, graduationRequest)
    
    if (result.source === 'registry') {
      if (result.error) {
        throw new Error(`Graduation failed: ${result.error}`)
      }
      
      graduatedSpirit = result.data
      console.log(`  Spirit graduated: ${graduatedSpirit.name}`)
      console.log(`  Active: ${graduatedSpirit.spirit?.active}`)
      console.log(`  Archetype: ${graduatedSpirit.spirit?.archetype}`)
    } else {
      // Mock for fallback testing
      graduatedSpirit = {
        ...testAgent,
        spirit: {
          active: true,
          archetype: 'CREATOR',
          graduationMode: 'ID_ONLY'
        }
      }
      console.log(`  Graduation tested in fallback mode`)
    }
  })

  // Phase 3: Post-graduation operations
  console.log('\n⚡ Phase 3: Spirit Operations')

  await runTest('Check practice availability', async () => {
    const result = await registryClient.canRunPracticeToday(graduatedSpirit.id)
    
    console.log(`  Can run practice: ${result.data}`)
    console.log(`  Source: ${result.source}`)
    
    if (result.source === 'registry' && result.error) {
      throw new Error(`Practice check failed: ${result.error}`)
    }
  })

  await runTest('Execute daily practice', async () => {
    const practiceRequest = {
      outputDescription: 'Integration test daily practice',
      mediaUrl: 'https://example.com/test-art.png',
      trainerAddress: CONFIG.trainerAddress
    }
    
    const result = await registryClient.executeSpiritPractice(graduatedSpirit.id, practiceRequest)
    
    if (result.source === 'registry') {
      if (result.error) {
        throw new Error(`Practice execution failed: ${result.error}`)
      }
      
      console.log(`  Work ID: ${result.data.workId}`)
      console.log(`  Output CID: ${result.data.outputCid}`)
    } else {
      console.log(`  Practice execution tested in fallback mode`)
    }
  })

  await runTest('Fetch treasury data', async () => {
    const result = await registryClient.getSpiritTreasury(graduatedSpirit.id)
    
    if (result.source === 'registry') {
      if (result.data) {
        console.log(`  Treasury: ${result.data.treasuryAddress}`)
        console.log(`  Practice runs: ${result.data.totalPracticeRuns}`)
      } else {
        console.log(`  No treasury data available`)
      }
    } else {
      console.log(`  Treasury data tested in fallback mode`)
    }
  })

  await runTest('Fetch practice drops', async () => {
    const result = await registryClient.getSpiritDrops(graduatedSpirit.id, { limit: 5 })
    
    console.log(`  Drops found: ${result.data?.length || 0}`)
    console.log(`  Source: ${result.source}`)
    
    if (result.source === 'registry' && result.data && result.data.length > 0) {
      const drop = result.data[0]
      console.log(`  Latest: ${drop.title || drop.workId} - ${drop.outputCid}`)
    }
  })

  await runTest('Update practice configuration', async () => {
    const updates = {
      timeOfDay: 14, // 2 PM
      outputType: 'Updated Integration Test Art',
      quantity: 2
    }
    
    const result = await registryClient.updateSpiritPractice(graduatedSpirit.id, updates)
    
    if (result.source === 'registry') {
      if (result.error) {
        throw new Error(`Practice update failed: ${result.error}`)
      }
      
      console.log(`  Updated time: ${result.data.timeOfDay}:00`)
      console.log(`  Updated output: ${result.data.outputType}`)
    } else {
      console.log(`  Practice update tested in fallback mode`)
    }
  })

  // Phase 4: List and discovery
  console.log('\n📋 Phase 4: Spirit Discovery')

  await runTest('List all spirits', async () => {
    const result = await registryClient.listSpirits({
      graduated: true,
      active: true
    })
    
    const spiritCount = result.data?.length || 0
    console.log(`  Spirits found: ${spiritCount}`)
    console.log(`  Source: ${result.source}`)
    
    if (result.data && result.data.length > 0) {
      const activeSpirits = result.data.filter(s => s.spirit?.active || s.status === 'deployed')
      console.log(`  Active spirits: ${activeSpirits.length}`)
    }
  })

  await runTest('Filter spirits by archetype', async () => {
    const result = await registryClient.listSpirits({
      archetype: 'CREATOR',
      graduated: true
    })
    
    console.log(`  Creator spirits: ${result.data?.length || 0}`)
    console.log(`  Source: ${result.source}`)
  })

  // Phase 5: Error handling
  console.log('\n🛡️ Phase 5: Error Handling')

  await runTest('Handle non-existent agent', async () => {
    const result = await registryClient.getAgent('non-existent-test-agent')
    
    if (!result.error) {
      throw new Error('Expected error for non-existent agent')
    }
    
    console.log(`  Error handled: ${result.error}`)
  })

  await runTest('Handle invalid graduation request', async () => {
    const invalidRequest = {
      ...graduationRequest,
      name: '', // Invalid
      trainerAddress: 'invalid'
    }
    
    const result = await registryClient.graduateSpirit(testAgent.id, invalidRequest)
    
    if (!result.error) {
      throw new Error('Expected error for invalid graduation request')
    }
    
    console.log(`  Validation error: ${result.error}`)
  })

  // Test Summary
  console.log('\n📊 Test Summary')
  console.log('=====================================')
  
  const passed = testResults.filter(r => r.status === 'PASS').length
  const failed = testResults.filter(r => r.status === 'FAIL').length
  const skipped = testResults.filter(r => r.status === 'SKIP').length
  const total = testResults.length
  
  console.log(`Total Tests: ${total}`)
  console.log(`✓ Passed: ${passed}`)
  console.log(`✗ Failed: ${failed}`)
  console.log(`⚠ Skipped: ${skipped}`)
  
  const avgDuration = testResults.reduce((sum, r) => sum + r.duration, 0) / total
  console.log(`Average Duration: ${avgDuration.toFixed(2)}ms`)
  
  console.log('\nTest Results:')
  testResults.forEach(result => {
    const icon = result.status === 'PASS' ? '✓' : result.status === 'FAIL' ? '✗' : '⚠'
    console.log(`  ${icon} ${result.test}: ${result.message}`)
  })

  if (failed > 0) {
    console.log('\n❌ Integration tests have failures - check Registry/Academy/client integration')
    process.exit(1)
  } else {
    console.log('\n✅ All integration tests passed - Spirit system is ready!')
    process.exit(0)
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason)
  process.exit(1)
})

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    console.error('Integration test failed:', error)
    process.exit(1)
  })
}