#!/usr/bin/env tsx

/**
 * Abraham-Only Lore Sync to Registry
 * Focused sync for Abraham's comprehensive lore data
 */

import { abrahamLore } from '@/data/agent-lore/abraham-lore';

async function syncAbrahamLore() {
  console.log('🏛️ Abraham Lore Sync to Registry');
  console.log('=' .repeat(50));
  
  const registryUrl = process.env.REGISTRY_BASE_URL || 'http://localhost:3000/api/v1';
  const jwtToken = process.env.JWT_TOKEN;
  const abrahamAgentId = 'cmevs8l2j0004it1nmsroq66p'; // Abraham's agent ID from Registry
  
  if (!jwtToken) {
    console.log('❌ JWT_TOKEN environment variable required');
    process.exit(1);
  }

  console.log(`Registry URL: ${registryUrl}`);
  console.log(`Abraham Agent ID: ${abrahamAgentId}`);
  
  // Test Registry health
  try {
    const healthResponse = await fetch(`${registryUrl}/lore/schema`);
    if (healthResponse.ok) {
      console.log('✅ Registry lore system operational');
    } else {
      console.log('❌ Registry lore system not available');
      process.exit(1);
    }
  } catch (error) {
    console.log('❌ Registry connection failed:', error.message);
    process.exit(1);
  }

  // Create Abraham lore payload
  const lorePayload = {
    agentId: abrahamAgentId,
    version: '1.0.0',
    identity: abrahamLore.identity,
    origin: abrahamLore.origin,
    philosophy: abrahamLore.philosophy,
    expertise: abrahamLore.expertise,
    voice: abrahamLore.voice,
    culture: abrahamLore.culture,
    personality: abrahamLore.personality,
    relationships: abrahamLore.relationships,
    currentContext: abrahamLore.currentContext,
    conversationFramework: abrahamLore.conversationFramework,
    knowledge: abrahamLore.knowledge,
    timeline: abrahamLore.timeline,
    artisticPractice: abrahamLore.artisticPractice
  };

  console.log('\n🔄 Abraham Lore Payload:');
  console.log(`   - Identity: ${abrahamLore.identity.fullName} (${abrahamLore.identity.archetype})`);
  console.log(`   - Sacred Creation Focus: ${abrahamLore.philosophy.coreBeliefs[0]}`);
  console.log(`   - Payload Size: ${JSON.stringify(lorePayload).length} bytes`);
  
  // Validate payload structure
  console.log('\n🔍 Payload Structure Check:');
  const requiredSections = ['identity', 'origin', 'philosophy', 'expertise', 'voice', 'culture', 'personality', 'relationships', 'currentContext', 'conversationFramework', 'knowledge', 'timeline'];
  
  for (const section of requiredSections) {
    const hasSection = lorePayload[section] && typeof lorePayload[section] === 'object';
    console.log(`   ${hasSection ? '✅' : '❌'} ${section}: ${hasSection ? 'Present' : 'Missing'}`);
  }

  // Sync Abraham's lore
  console.log('\n🔐 Syncing Abraham to Registry...');
  
  try {
    const response = await fetch(
      `${registryUrl}/agents/${abrahamAgentId}/lore`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwtToken}`
        },
        body: JSON.stringify(lorePayload)
      }
    );

    console.log(`Response Status: ${response.status}`);
    
    if (response.ok) {
      const responseData = await response.json();
      console.log('\n🎉 SUCCESS! Abraham lore synced to Registry!');
      console.log('📊 Response Data:');
      console.log(`   - Agent ID: ${responseData.agentId}`);
      console.log(`   - Operation: ${responseData.operation}`);
      console.log(`   - Version: ${responseData.lore?.version}`);
      console.log(`   - Updated: ${responseData.lore?.updatedAt}`);
      
      // Verify sync by fetching back
      console.log('\n🔍 Verifying sync...');
      const verifyResponse = await fetch(`${registryUrl}/agents/${abrahamAgentId}/lore`);
      if (verifyResponse.ok) {
        const verifyData = await verifyResponse.json();
        console.log('✅ Verification successful - Abraham lore retrieved from Registry');
        console.log(`   - Identity: ${verifyData.lore.identity.fullName}`);
        console.log(`   - Philosophy: ${verifyData.lore.philosophy.coreBeliefs.length} core beliefs`);
      }
      
      console.log('\n🏛️ ABRAHAM IS NOW THE REGISTRY SOURCE OF TRUTH');
      process.exit(0);
      
    } else {
      const errorText = await response.text();
      console.log('\n❌ Sync failed:');
      console.log(`   Status: ${response.status}`);
      console.log(`   Error: ${errorText}`);
      
      // Try to parse validation errors
      try {
        const errorData = JSON.parse(errorText);
        if (errorData.details) {
          console.log('\n📋 Validation Details:');
          console.log(JSON.stringify(errorData.details, null, 2));
        }
      } catch (e) {
        // Not JSON, just show raw error
      }
      
      process.exit(1);
    }
    
  } catch (error) {
    console.log('\n💥 Network error:', error.message);
    process.exit(1);
  }
}

// CLI execution
if (require.main === module) {
  syncAbrahamLore()
    .catch((error) => {
      console.error('\n💥 Abraham sync failed:', error);
      process.exit(1);
    });
}

export { syncAbrahamLore };