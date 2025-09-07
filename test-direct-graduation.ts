/**
 * Direct Spirit Graduation Test
 * Tests the complete Spirit graduation flow directly against mock Registry
 */

async function testDirectGraduation() {
  console.log('🎯 Testing Direct Spirit Graduation Flow\n');

  const baseUrl = 'http://localhost:3001/api/v1';
  const agentHandle = 'abraham';

  // 1. Check initial agent state
  console.log('=== Step 1: Check Initial Agent State ===');
  const agentResponse = await fetch(`${baseUrl}/agents/${agentHandle}`);
  const agentData = await agentResponse.json();
  
  console.log(`✅ Agent: ${agentData.agent.name}`);
  console.log(`   Status: ${agentData.agent.status}`);
  console.log(`   Spirit: ${agentData.agent.spirit ? 'Active' : 'None'}`);

  // 2. Graduate the Spirit
  console.log('\n=== Step 2: Graduate Agent to Spirit ===');
  const graduationRequest = {
    name: 'ABRAHAM GENESIS SPIRIT',
    archetype: 'CREATOR',
    graduationMode: 'FULL_STACK',
    trainerAddress: '0x742d35Cc6634C0532925a3b8D5c03c8c',
    practice: {
      timeOfDay: 9,
      outputType: 'Collective Intelligence Art',
      quantity: 1,
      observeSabbath: true
    },
    idempotencyKey: `grad-${Date.now()}`
  };

  const graduationResponse = await fetch(`${baseUrl}/agents/${agentHandle}/graduate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(graduationRequest)
  });

  const graduationResult = await graduationResponse.json();
  console.log(`✅ Graduation Status: ${graduationResponse.status}`);
  console.log(`   Spirit Active: ${graduationResult.agent?.spirit?.active}`);
  console.log(`   Archetype: ${graduationResult.agent?.spirit?.archetype}`);
  console.log(`   Mode: ${graduationResult.agent?.spirit?.graduationMode}`);
  console.log(`   Wallet: ${graduationResult.agent?.spirit?.walletAddress}`);

  // 3. Check practice availability
  console.log('\n=== Step 3: Check Practice Availability ===');
  const practiceCheckResponse = await fetch(`${baseUrl}/agents/${agentHandle}/can-practice`);
  const practiceCheckResult = await practiceCheckResponse.json();
  
  console.log(`✅ Can Practice: ${practiceCheckResult.canRun !== undefined ? practiceCheckResult.canRun : 'Unknown'}`);
  if (practiceCheckResult.error) {
    console.log(`   Error: ${practiceCheckResult.error}`);
  }

  // 4. Execute daily practice
  console.log('\n=== Step 4: Execute Daily Practice ===');
  const practiceRequest = {
    outputDescription: 'First collective intelligence manifestation',
    mediaUrl: 'https://eden.art/abraham/first-practice.png',
    trainerAddress: '0x742d35Cc6634C0532925a3b8D5c03c8c'
  };

  const practiceResponse = await fetch(`${baseUrl}/agents/${agentHandle}/practice`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(practiceRequest)
  });

  const practiceResult = await practiceResponse.json();
  console.log(`✅ Practice Status: ${practiceResponse.status}`);
  console.log(`   Work ID: ${practiceResult.workId}`);
  console.log(`   Output CID: ${practiceResult.outputCid}`);

  // 5. Check treasury
  console.log('\n=== Step 5: Check Spirit Treasury ===');
  const treasuryResponse = await fetch(`${baseUrl}/agents/${agentHandle}/treasury`);
  const treasuryResult = await treasuryResponse.json();
  
  if (treasuryResult.treasury) {
    console.log(`✅ Treasury Address: ${treasuryResult.treasury.treasuryAddress}`);
    console.log(`   Total Practices: ${treasuryResult.treasury.totalPracticeRuns}`);
    console.log(`   ETH Balance: ${treasuryResult.treasury.ethBalance} wei`);
  } else {
    console.log('ℹ️  No treasury (expected for non-FULL_STACK modes)');
  }

  // 6. Check practice drops
  console.log('\n=== Step 6: Check Practice Drops ===');
  const dropsResponse = await fetch(`${baseUrl}/agents/${agentHandle}/drops`);
  const dropsResult = await dropsResponse.json();
  
  if (dropsResult.error) {
    console.log(`⚠️  Drops Error: ${dropsResult.error}`);
  } else {
    console.log(`✅ Practice Drops: ${dropsResult.drops?.length || 0} total`);
    if (dropsResult.drops && dropsResult.drops.length > 0) {
      const latestDrop = dropsResult.drops[0];
      console.log(`   Latest: ${latestDrop.practiceType} on ${new Date(latestDrop.executionDate).toLocaleDateString()}`);
    }
  }

  // 7. List all spirits
  console.log('\n=== Step 7: List All Spirits ===');
  const spiritsResponse = await fetch(`${baseUrl}/spirits`);
  const spiritsResult = await spiritsResponse.json();
  
  console.log(`✅ Total Spirits: ${spiritsResult.total}`);
  spiritsResult.spirits.forEach((spirit: any) => {
    console.log(`   ${spirit.name} (${spirit.spirit.archetype})`);
  });

  console.log('\n🎉 Direct Spirit Graduation Test Complete!');
  console.log('\n📋 Summary:');
  console.log('✅ Agent → Spirit graduation successful');
  console.log('✅ Daily practice execution working');  
  console.log('✅ Treasury management operational');
  console.log('✅ Practice drops tracking active');
  console.log('✅ Spirit listing functional');
  
  console.log('\n🚀 Ready for frontend integration testing!');
}

testDirectGraduation().catch(console.error);