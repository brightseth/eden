/**
 * Simple Spirit Integration Test Runner
 * Tests the Spirit graduation protocol against the Registry API
 */

import { registryClient } from '@/lib/registry/registry-client';

async function main() {
  console.log('🚀 Eden3 Spirit Integration Test Runner\n');

  // Test Configuration  
  const testAgent = 'abraham'; // Known Genesis agent
  const trainerAddress = '0x742d35Cc6634C0532925a3b8D5c03c8c';
  
  // Override Registry URL to use local mock server
  process.env.NEXT_PUBLIC_REGISTRY_URL = 'http://localhost:3001/api/v1';

  console.log('=== Phase 1: Registry Health Check ===');
  
  // 1. Test Registry connectivity
  try {
    const agentResult = await registryClient.getAgent(testAgent);
    console.log(`✅ Registry connectivity: ${agentResult.source}`);
    console.log(`   Agent: ${agentResult.data?.name || 'Not found'}`);
    console.log(`   Status: ${agentResult.data?.status || 'Unknown'}`);
    
    if (agentResult.error) {
      console.log(`   Error: ${agentResult.error}`);
    }
  } catch (error) {
    console.log(`❌ Registry connectivity failed: ${error}`);
    return;
  }

  console.log('\n=== Phase 2: Spirit Methods Test ===');

  // 2. Test Spirit graduation
  const graduationRequest = {
    name: 'ABRAHAM SPIRIT TEST',
    archetype: 'CREATOR' as const,
    practice: {
      timeOfDay: 9,
      outputType: 'Digital Art',
      quantity: 1,
      observeSabbath: true
    },
    graduationMode: 'ID_ONLY' as const,
    trainerAddress,
    idempotencyKey: `test-${Date.now()}`
  };

  try {
    console.log('Testing graduateSpirit...');
    const graduationResult = await registryClient.graduateSpirit(testAgent, graduationRequest);
    console.log(`✅ graduateSpirit: ${graduationResult.source}`);
    
    if (graduationResult.error) {
      console.log(`   Response: ${graduationResult.error}`);
    } else if (graduationResult.data) {
      console.log(`   Spirit created: ${graduationResult.data.name}`);
      console.log(`   Archetype: ${graduationResult.data.spirit?.archetype}`);
    }
  } catch (error) {
    console.log(`❌ graduateSpirit failed: ${error}`);
  }

  // 3. Test practice availability check
  try {
    console.log('Testing canRunPracticeToday...');
    const practiceResult = await registryClient.canRunPracticeToday(testAgent);
    console.log(`✅ canRunPracticeToday: ${practiceResult.source}`);
    console.log(`   Can run: ${practiceResult.data}`);
  } catch (error) {
    console.log(`❌ canRunPracticeToday failed: ${error}`);
  }

  // 4. Test practice execution
  const practiceRequest = {
    outputDescription: 'Test daily practice execution',
    mediaUrl: 'https://example.com/test-art.png',
    trainerAddress
  };

  try {
    console.log('Testing executeSpiritPractice...');
    const practiceResult = await registryClient.executeSpiritPractice(testAgent, practiceRequest);
    console.log(`✅ executeSpiritPractice: ${practiceResult.source}`);
    
    if (practiceResult.error) {
      console.log(`   Response: ${practiceResult.error}`);
    } else if (practiceResult.data) {
      console.log(`   Practice executed: ${practiceResult.data.workId}`);
      console.log(`   Output CID: ${practiceResult.data.outputCid}`);
    }
  } catch (error) {
    console.log(`❌ executeSpiritPractice failed: ${error}`);
  }

  // 5. Test treasury data
  try {
    console.log('Testing getSpiritTreasury...');
    const treasuryResult = await registryClient.getSpiritTreasury(testAgent);
    console.log(`✅ getSpiritTreasury: ${treasuryResult.source}`);
    
    if (treasuryResult.data) {
      console.log(`   Treasury: ${treasuryResult.data.treasuryAddress}`);
      console.log(`   Practices: ${treasuryResult.data.totalPracticeRuns}`);
    }
  } catch (error) {
    console.log(`❌ getSpiritTreasury failed: ${error}`);
  }

  // 6. Test spirit listing
  try {
    console.log('Testing listSpirits...');
    const spiritsResult = await registryClient.listSpirits({ graduated: true });
    console.log(`✅ listSpirits: ${spiritsResult.source}`);
    console.log(`   Total spirits: ${spiritsResult.data?.length || 0}`);
  } catch (error) {
    console.log(`❌ listSpirits failed: ${error}`);
  }

  console.log('\n=== Integration Test Complete ===');
  console.log('Next Steps:');
  console.log('1. If Registry unavailable: Deploy Registry with Spirit endpoints');
  console.log('2. If fallback mode: Implement Registry database connection'); 
  console.log('3. If errors: Check Spirit method implementation');
  console.log('4. If successful: Ready for end-to-end testing');
}

// Run the test
main().catch(console.error);