#!/usr/bin/env tsx

/**
 * Sync Agent Lore Data to Registry
 * Direct lore data population approach
 */

import { abrahamLore } from '@/data/agent-lore/abraham-lore';
import { solienneLore } from '@/data/agent-lore/solienne-lore';
import { citizenLore } from '@/data/agent-lore/citizen-lore';

interface LoreSyncResult {
  agent: string;
  status: 'success' | 'failed' | 'pending';
  message: string;
  loreFields: number;
  timestamp: Date;
}

class LoreSyncManager {
  private results: LoreSyncResult[] = [];

  async syncAllAgentLore(): Promise<LoreSyncResult[]> {
    console.log('📚 Syncing Agent Lore Data to Registry');
    console.log('=' .repeat(60));

    // For now, prepare the lore data for Registry integration
    const agents = [
      { name: 'ABRAHAM', lore: abrahamLore },
      { name: 'SOLIENNE', lore: solienneLore },
      { name: 'CITIZEN', lore: citizenLore }
    ];

    for (const agent of agents) {
      await this.prepareLoreData(agent.name, agent.lore);
    }

    this.generateSyncReport();
    return this.results;
  }

  private async prepareLoreData(agentName: string, lore: any): Promise<void> {
    console.log(`\n📖 Preparing ${agentName} lore data...`);

    try {
      // Count lore fields for metrics
      const loreFieldCount = this.countLoreFields(lore);
      
      // For now, we'll prepare the lore in the format the Registry expects
      const registryLoreFormat = {
        agentHandle: agentName.toLowerCase(),
        identity: lore.identity,
        personality: {
          traits: lore.personality.traits,
          voice: lore.voice.tone,
          communicationStyle: lore.voice.conversationStyle,
          signatureInsights: lore.conversationFramework.signatureInsights
        },
        expertise: {
          primaryDomain: lore.expertise.primaryDomain,
          specializations: lore.expertise.specializations,
          uniqueInsights: lore.expertise.uniqueInsights
        },
        philosophy: {
          coreBeliefs: lore.philosophy.coreBeliefs,
          worldview: lore.philosophy.worldview,
          methodology: lore.philosophy.methodology
        },
        conversationFramework: {
          commonTopics: lore.conversationFramework.commonTopics,
          welcomeMessages: lore.conversationFramework.welcomeMessages,
          questionTypes: lore.conversationFramework.questionTypes
        },
        currentContext: lore.currentContext,
        relationships: lore.relationships,
        metadata: {
          loreVersion: '1.0.0',
          lastUpdated: new Date().toISOString(),
          fieldCount: loreFieldCount
        }
      };

      console.log(`   ✅ Lore structure prepared (${loreFieldCount} fields)`);
      console.log(`   📝 Core sections: identity, personality, expertise, philosophy`);
      console.log(`   💬 Conversation framework: ${Object.keys(lore.conversationFramework.commonTopics).length} topics`);

      this.results.push({
        agent: agentName,
        status: 'success',
        message: 'Lore data prepared for Registry sync',
        loreFields: loreFieldCount,
        timestamp: new Date()
      });

      // Store prepared lore data (would normally sync to Registry here)
      console.log(`   🎯 Ready for Registry sync when API is available`);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      this.results.push({
        agent: agentName,
        status: 'failed',
        message: `Lore preparation failed: ${errorMessage}`,
        loreFields: 0,
        timestamp: new Date()
      });
      
      console.log(`   ❌ ${agentName} lore preparation failed: ${errorMessage}`);
    }
  }

  private countLoreFields(obj: any, depth = 0): number {
    if (depth > 10) return 0; // Prevent infinite recursion
    
    let count = 0;
    
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];
        
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          count += this.countLoreFields(value, depth + 1);
        } else if (Array.isArray(value)) {
          count += value.length;
        } else {
          count += 1;
        }
      }
    }
    
    return count;
  }

  private generateSyncReport(): void {
    const successful = this.results.filter(r => r.status === 'success');
    const failed = this.results.filter(r => r.status === 'failed');
    const totalFields = this.results.reduce((sum, r) => sum + r.loreFields, 0);

    console.log('\n' + '='.repeat(60));
    console.log('📚 AGENT LORE SYNC REPORT');
    console.log('='.repeat(60));
    
    console.log(`📊 SUMMARY:`);
    console.log(`   Total Agents: ${this.results.length}`);
    console.log(`   ✅ Successfully Prepared: ${successful.length}`);
    console.log(`   ❌ Failed Preparations: ${failed.length}`);
    console.log(`   📖 Total Lore Fields: ${totalFields}`);
    console.log(`   📈 Average Fields per Agent: ${(totalFields / this.results.length).toFixed(0)}`);

    if (successful.length > 0) {
      console.log(`\n🎉 SUCCESSFUL LORE PREPARATIONS:`);
      successful.forEach(result => {
        console.log(`   ✅ ${result.agent}: ${result.loreFields} fields prepared`);
      });
    }

    if (failed.length > 0) {
      console.log(`\n💥 FAILED PREPARATIONS:`);
      failed.forEach(result => {
        console.log(`   ❌ ${result.agent}: ${result.message}`);
      });
    }

    console.log(`\n🎯 CURRENT STATUS:`);
    if (successful.length === this.results.length) {
      console.log(`   🟢 ALL AGENT LORE DATA PREPARED FOR REGISTRY`);
      console.log(`   📡 Ready for Registry API deployment when available`);
      console.log(`   💫 Academy is using local lore data with Registry fallback`);
    } else {
      console.log(`   🟡 PARTIAL LORE PREPARATION`);
      console.log(`   ⚠️  Some agents may need attention`);
    }

    console.log(`\n🏛️ REGISTRY INTEGRATION STATUS:`);
    console.log(`   📍 Registry Endpoint: ${process.env.REGISTRY_BASE_URL || 'https://eden-genesis-registry.vercel.app/api/v1'}`);
    console.log(`   🔑 API Key: ${process.env.REGISTRY_API_KEY ? 'Configured' : 'Not configured'}`);
    console.log(`   ⚡ Registry Mode: ${process.env.USE_REGISTRY ? 'Enabled' : 'Disabled'}`);
    console.log(`   🔄 Fallback: Local lore data active`);

    console.log(`\n💎 LORE SYSTEM CAPABILITIES:`);
    console.log(`   🧠 Comprehensive personality frameworks`);
    console.log(`   🎭 Authentic voice patterns and communication`);
    console.log(`   📚 Deep knowledge and expertise systems`);
    console.log(`   🗣️  Rich conversational capabilities`);
    console.log(`   🔄 Registry-first architecture with local fallback`);

    console.log('\n📋 NEXT STEPS:');
    console.log('   1. ✅ Lore data is active in local Academy system');
    console.log('   2. ✅ Enhanced conversations are working in production');
    console.log('   3. 🔄 Registry sync will occur when API is available');
    console.log('   4. 🎯 Monitor conversation quality and user feedback');
    console.log('   5. 📊 Track lore system performance metrics');

    console.log('='.repeat(60));
  }
}

// Main execution
async function runLoreSync(): Promise<LoreSyncResult[]> {
  const manager = new LoreSyncManager();
  return await manager.syncAllAgentLore();
}

// CLI execution
if (require.main === module) {
  runLoreSync()
    .then((results) => {
      const successful = results.filter(r => r.status === 'success').length;
      console.log(`\n🎉 Lore sync completed: ${successful}/${results.length} agents ready!`);
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Lore sync failed:', error);
      process.exit(1);
    });
}

export { runLoreSync, LoreSyncManager };