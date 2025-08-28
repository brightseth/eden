#!/usr/bin/env tsx

/**
 * Direct Lore Sync to Registry
 * Uses the new dedicated lore endpoints created by Registry-Guardian
 */

import { abrahamLore } from '@/data/agent-lore/abraham-lore';
import { solienneLore } from '@/data/agent-lore/solienne-lore';
import { citizenLore } from '@/data/agent-lore/citizen-lore';

interface LoreSyncResult {
  agent: string;
  agentId: string;
  status: 'success' | 'failed' | 'skipped';
  message: string;
  fieldsCount: number;
  timestamp: Date;
}

class DirectLoreSync {
  private registryUrl: string;
  private results: LoreSyncResult[] = [];
  
  // Known agent IDs from Registry
  private agentIds = {
    'abraham': 'cmeq19hrx0001jpvyljrq6yz3',
    'solienne': 'cmeq19hrx0002jpvyljrq6yz3', 
    'citizen': 'cmeq19hrx0007jpvyljrq6yz3'
  };

  constructor() {
    this.registryUrl = process.env.REGISTRY_BASE_URL || 'http://localhost:3000/api/v1';
  }

  async syncAllLoreData(): Promise<LoreSyncResult[]> {
    console.log('🏛️ Direct Lore Sync to Registry');
    console.log('=' .repeat(60));
    console.log(`Registry URL: ${this.registryUrl}`);
    console.log('Using dedicated /agents/{id}/lore endpoints');

    // Test registry connectivity first
    console.log('\n🔗 Testing Registry health...');
    try {
      const healthResponse = await fetch(`${this.registryUrl}/lore/schema`);
      if (healthResponse.ok) {
        console.log('   ✅ Registry lore system is operational');
      } else {
        console.log('   ❌ Registry lore system not available');
        return [];
      }
    } catch (error) {
      console.log(`   ❌ Registry connection failed: ${error instanceof Error ? error.message : 'Unknown'}`);
      return [];
    }

    // Sync each agent's lore data
    const loreMappings = {
      'abraham': abrahamLore,
      'solienne': solienneLore,
      'citizen': citizenLore
    };

    for (const [handle, loreData] of Object.entries(loreMappings)) {
      await this.syncSingleAgent(handle, loreData);
      await this.sleep(1000); // Brief pause between requests
    }

    this.generateSyncReport();
    return this.results;
  }

  private async syncSingleAgent(handle: string, loreData: any): Promise<void> {
    const agentId = this.agentIds[handle as keyof typeof this.agentIds];
    
    console.log(`\n${'='.repeat(50)}`);
    console.log(`🔄 Syncing ${handle.toUpperCase()} lore data...`);
    console.log(`   Agent ID: ${agentId}`);
    console.log(`${'='.repeat(50)}`);

    if (!agentId) {
      this.results.push({
        agent: handle,
        agentId: 'unknown',
        status: 'skipped',
        message: `No agent ID found for ${handle}`,
        fieldsCount: 0,
        timestamp: new Date()
      });
      console.log(`   ❌ No agent ID mapping for ${handle}`);
      return;
    }

    // Create comprehensive lore payload
    const lorePayload = {
      agentId,
      version: '1.0.0',
      identity: loreData.identity,
      origin: loreData.origin,
      philosophy: loreData.philosophy,
      expertise: loreData.expertise,
      voice: loreData.voice,
      culture: loreData.culture,
      personality: loreData.personality,
      relationships: loreData.relationships,
      currentContext: loreData.currentContext,
      conversationFramework: loreData.conversationFramework,
      knowledge: loreData.knowledge,
      timeline: loreData.timeline,
      artisticPractice: loreData.artisticPractice || undefined
    };

    const fieldsCount = this.countFields(lorePayload);
    
    console.log(`   📝 Payload prepared:`);
    console.log(`      - Fields: ${fieldsCount}`);
    console.log(`      - Identity: ${loreData.identity.fullName} (${loreData.identity.archetype})`);
    console.log(`      - Core Beliefs: ${loreData.philosophy.coreBeliefs.length}`);
    console.log(`      - Specializations: ${loreData.expertise.specializations.length}`);

    // Use JWT Bearer token authentication
    const jwtToken = process.env.JWT_TOKEN;
    if (!jwtToken) {
      console.log('   ❌ No JWT_TOKEN environment variable provided');
      this.results.push({
        agent: handle,
        agentId,
        status: 'failed',
        message: 'JWT_TOKEN environment variable required',
        fieldsCount: 0,
        timestamp: new Date()
      });
      return;
    }

    console.log(`\n   🔐 Using JWT Bearer token authentication...`);
    
    try {
      const response = await fetch(
        `${this.registryUrl}/agents/${agentId}/lore`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwtToken}`
          },
          body: JSON.stringify(lorePayload)
        }
      );

      if (response.ok) {
        const responseData = await response.json();
        
        this.results.push({
          agent: handle,
          agentId,
          status: 'success',
          message: 'Lore data synced successfully with JWT authentication',
          fieldsCount,
          timestamp: new Date()
        });

        console.log(`   ✅ SUCCESS! Lore synced to Registry`);
        console.log(`      - Status: ${response.status}`);
        console.log(`      - Fields synced: ${fieldsCount}`);
        return;
        
      } else {
        const errorText = await response.text();
        console.log(`   ❌ JWT authentication failed: ${response.status} - ${errorText}`);
      }
      
    } catch (error) {
      console.log(`   ❌ Network error: ${error instanceof Error ? error.message : 'Unknown'}`);
    }

    // If we get here, sync failed
    this.results.push({
      agent: handle,
      agentId,
      status: 'failed',
      message: 'JWT authentication failed',
      fieldsCount: 0,
      timestamp: new Date()
    });

    console.log(`   💥 JWT authentication failed for ${handle.toUpperCase()}`);
  }

  private countFields(obj: any): number {
    let count = 0;
    
    function countDeep(item: any, depth = 0): void {
      if (depth > 10) return; // Prevent infinite recursion
      
      if (Array.isArray(item)) {
        count += item.length;
        item.forEach(i => countDeep(i, depth + 1));
      } else if (item && typeof item === 'object') {
        for (const key in item) {
          if (item.hasOwnProperty(key)) {
            count += 1;
            countDeep(item[key], depth + 1);
          }
        }
      } else {
        count += 1;
      }
    }

    countDeep(obj);
    return count;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private generateSyncReport(): void {
    const successful = this.results.filter(r => r.status === 'success');
    const failed = this.results.filter(r => r.status === 'failed');
    const skipped = this.results.filter(r => r.status === 'skipped');
    const totalFields = this.results.reduce((sum, r) => sum + r.fieldsCount, 0);

    console.log('\n' + '='.repeat(60));
    console.log('🏛️ DIRECT LORE SYNC REPORT');
    console.log('='.repeat(60));
    
    console.log(`📊 SUMMARY:`);
    console.log(`   Total Agents: ${this.results.length}`);
    console.log(`   ✅ Successfully Synced: ${successful.length}`);
    console.log(`   ❌ Failed Syncs: ${failed.length}`);
    console.log(`   ⏭️ Skipped: ${skipped.length}`);
    console.log(`   📝 Total Fields Synced: ${totalFields}`);

    if (successful.length > 0) {
      console.log(`\n🎉 SUCCESSFUL SYNCS:`);
      successful.forEach(result => {
        console.log(`   ✅ ${result.agent.toUpperCase()}: ${result.fieldsCount} fields synced`);
        console.log(`      Agent ID: ${result.agentId}`);
        console.log(`      Method: ${result.message}`);
      });
    }

    if (failed.length > 0) {
      console.log(`\n💥 FAILED SYNCS:`);
      failed.forEach(result => {
        console.log(`   ❌ ${result.agent.toUpperCase()}: ${result.message}`);
      });
    }

    if (skipped.length > 0) {
      console.log(`\n⏭️ SKIPPED SYNCS:`);
      skipped.forEach(result => {
        console.log(`   ⏭️ ${result.agent.toUpperCase()}: ${result.message}`);
      });
    }

    console.log(`\n🎯 REGISTRY STATUS:`);
    if (successful.length === this.results.length) {
      console.log(`   🟢 ALL LORE DATA SUCCESSFULLY SYNCED TO REGISTRY`);
      console.log(`   🏛️ Registry is now the authoritative source for agent lore`);
      console.log(`   📡 Academy can fetch comprehensive lore from Registry endpoints`);
    } else if (successful.length > 0) {
      console.log(`   🟡 PARTIAL SYNC SUCCESS`);
      console.log(`   ⚠️  Some agents need authentication configuration`);
    } else {
      console.log(`   🔴 SYNC FAILED`);
      console.log(`   🚨 Authentication or endpoint configuration needed`);
    }

    console.log(`\n📋 NEXT STEPS:`);
    if (successful.length > 0) {
      console.log(`   1. ✅ Test lore retrieval: GET ${this.registryUrl}/agents/{id}/lore`);
      console.log(`   2. 🔄 Update Academy lore manager to use Registry as primary source`);
      console.log(`   3. 🎯 Verify enhanced conversations use Registry lore data`);
      console.log(`   4. 📊 Monitor Registry lore API performance`);
    } else {
      console.log(`   1. 🔐 Configure proper authentication for Registry write operations`);
      console.log(`   2. 🛠️ Check Registry-Guardian authentication requirements`);
      console.log(`   3. 🔄 Retry sync once authentication is configured`);
    }

    console.log('='.repeat(60));
  }
}

// Main execution
async function runDirectLoreSync(): Promise<LoreSyncResult[]> {
  const syncer = new DirectLoreSync();
  return await syncer.syncAllLoreData();
}

// CLI execution
if (require.main === module) {
  runDirectLoreSync()
    .then((results) => {
      const successful = results.filter(r => r.status === 'success').length;
      const total = results.length;
      
      if (successful === total && total > 0) {
        console.log('\n🎉 All lore data successfully synced to Registry!');
        process.exit(0);
      } else if (successful > 0) {
        console.log(`\n⚠️  ${successful}/${total} agents synced. Check authentication for failed syncs.`);
        process.exit(1);
      } else {
        console.log(`\n❌ No lore data was synced. Check Registry authentication and connectivity.`);
        process.exit(1);
      }
    })
    .catch((error) => {
      console.error('\n💥 Direct lore sync failed:', error);
      process.exit(1);
    });
}

export { runDirectLoreSync, DirectLoreSync };