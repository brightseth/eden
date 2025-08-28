#!/usr/bin/env tsx

/**
 * Update Registry Agent Profiles with Comprehensive Lore Data
 * Uses Registry SDK's agents.update method to populate existing agents with rich lore
 */

import { registryClient } from '@/lib/registry/sdk';
import { abrahamLore } from '@/data/agent-lore/abraham-lore';
import { solienneLore } from '@/data/agent-lore/solienne-lore';
import { citizenLore } from '@/data/agent-lore/citizen-lore';

interface RegistryUpdateResult {
  agent: string;
  status: 'success' | 'failed' | 'not_found';
  message: string;
  fieldsUpdated: number;
  timestamp: Date;
}

class RegistryProfileUpdater {
  private results: RegistryUpdateResult[] = [];

  async updateAllAgentProfiles(): Promise<RegistryUpdateResult[]> {
    console.log('🏛️ Updating Registry Agent Profiles with Comprehensive Lore');
    console.log('=' .repeat(70));

    // First, let's test Registry connectivity
    console.log('🔗 Testing Registry connectivity...');
    
    try {
      const health = await registryClient.health();
      console.log(`   ✅ Registry Status: ${health.status} - ${health.message}`);
    } catch (error) {
      console.log(`   ❌ Registry connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return [];
    }

    // Get current agents to understand their IDs
    console.log('\n📋 Fetching current Registry agents...');
    
    let currentAgents;
    try {
      currentAgents = await registryClient.agents.list();
      console.log(`   ✅ Found ${currentAgents.length} agents in Registry`);
      currentAgents.forEach(agent => {
        console.log(`      - ${agent.handle}: ${agent.displayName} (${agent.role})`);
      });
    } catch (error) {
      console.log(`   ❌ Failed to fetch agents: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return [];
    }

    // Update each agent with lore data
    const agentLoreMap = {
      'abraham': abrahamLore,
      'solienne': solienneLore,
      'citizen': citizenLore
    };

    for (const [handle, lore] of Object.entries(agentLoreMap)) {
      await this.updateSingleAgent(handle, lore, currentAgents);
      
      // Brief pause between updates
      await this.sleep(1000);
    }

    this.generateUpdateReport();
    return this.results;
  }

  private async updateSingleAgent(
    handle: string, 
    lore: any, 
    currentAgents: any[]
  ): Promise<void> {
    console.log(`\n${'='.repeat(50)}`);
    console.log(`🔄 Updating ${handle.toUpperCase()} profile...`);
    console.log(`${'='.repeat(50)}`);

    // Find the agent in Registry
    const existingAgent = currentAgents.find(a => a.handle.toLowerCase() === handle.toLowerCase());
    
    if (!existingAgent) {
      this.results.push({
        agent: handle,
        status: 'not_found',
        message: `Agent with handle '${handle}' not found in Registry`,
        fieldsUpdated: 0,
        timestamp: new Date()
      });
      console.log(`   ❌ Agent '${handle}' not found in Registry`);
      return;
    }

    console.log(`   ✅ Found agent: ${existingAgent.id} (${existingAgent.displayName})`);

    try {
      // Create extended profile data that preserves existing structure
      // but adds comprehensive lore in appropriate fields
      const updatedProfile = {
        ...existingAgent.profile,
        statement: lore.identity.essence,
        tags: [
          ...lore.expertise.specializations.slice(0, 5), // Add key specializations as tags
          lore.identity.archetype
        ],
        links: {
          ...existingAgent.profile.links,
          specialty: {
            medium: lore.artisticPractice?.medium?.[0] || lore.expertise.primaryDomain,
            description: lore.philosophy.coreBeliefs[0] || lore.identity.essence,
            dailyGoal: lore.currentContext.currentFocus
          }
        },
        // Add comprehensive lore data as extended fields (if Registry supports it)
        lore: {
          version: '1.0.0',
          lastUpdated: new Date().toISOString(),
          identity: lore.identity,
          personality: {
            traits: lore.personality.traits,
            voice: {
              tone: lore.voice.tone,
              conversationStyle: lore.voice.conversationStyle,
              signatureInsights: lore.conversationFramework.signatureInsights.slice(0, 3)
            }
          },
          expertise: {
            primaryDomain: lore.expertise.primaryDomain,
            specializations: lore.expertise.specializations,
            uniqueInsights: lore.expertise.uniqueInsights.slice(0, 5)
          },
          philosophy: {
            coreBeliefs: lore.philosophy.coreBeliefs,
            methodology: lore.philosophy.methodology
          },
          conversationFramework: {
            welcomeMessages: lore.conversationFramework.welcomeMessages,
            commonTopics: Object.keys(lore.conversationFramework.commonTopics).reduce((acc, key) => {
              acc[key] = {
                approach: lore.conversationFramework.commonTopics[key].approach,
                sampleResponses: lore.conversationFramework.commonTopics[key].sampleResponses.slice(0, 2)
              };
              return acc;
            }, {} as any)
          },
          currentContext: {
            currentFocus: lore.currentContext.currentFocus,
            activeProjects: lore.currentContext.activeProjects.slice(0, 5),
            challenges: lore.currentContext.challenges?.slice(0, 3)
          }
        }
      };

      console.log(`   📝 Updating profile with comprehensive lore data...`);
      console.log(`      - Identity: ${lore.identity.fullName} (${lore.identity.archetype})`);
      console.log(`      - Specializations: ${lore.expertise.specializations.length}`);
      console.log(`      - Core Beliefs: ${lore.philosophy.coreBeliefs.length}`);
      console.log(`      - Conversation Topics: ${Object.keys(lore.conversationFramework.commonTopics).length}`);

      // Perform the Registry update
      const updatedAgent = await registryClient.agents.update(existingAgent.id, {
        profile: updatedProfile
      });

      const fieldsUpdated = this.countUpdatedFields(updatedProfile);

      this.results.push({
        agent: handle,
        status: 'success',
        message: `Profile updated with comprehensive lore data`,
        fieldsUpdated,
        timestamp: new Date()
      });

      console.log(`   ✅ Successfully updated ${handle.toUpperCase()} profile!`);
      console.log(`      - Fields updated: ${fieldsUpdated}`);
      console.log(`      - Registry ID: ${updatedAgent.id}`);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      this.results.push({
        agent: handle,
        status: 'failed',
        message: `Profile update failed: ${errorMessage}`,
        fieldsUpdated: 0,
        timestamp: new Date()
      });

      console.log(`   ❌ Failed to update ${handle.toUpperCase()} profile:`);
      console.log(`      Error: ${errorMessage}`);
    }
  }

  private countUpdatedFields(profile: any): number {
    let count = 0;
    
    function countFields(obj: any, depth = 0): void {
      if (depth > 5) return; // Prevent infinite recursion
      
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          const value = obj[key];
          if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            countFields(value, depth + 1);
          } else if (Array.isArray(value)) {
            count += value.length;
          } else {
            count += 1;
          }
        }
      }
    }

    countFields(profile);
    return count;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private generateUpdateReport(): void {
    const successful = this.results.filter(r => r.status === 'success');
    const failed = this.results.filter(r => r.status === 'failed');
    const notFound = this.results.filter(r => r.status === 'not_found');
    const totalFields = this.results.reduce((sum, r) => sum + r.fieldsUpdated, 0);

    console.log('\n' + '='.repeat(70));
    console.log('🏛️ REGISTRY PROFILE UPDATE REPORT');
    console.log('='.repeat(70));
    
    console.log(`📊 SUMMARY:`);
    console.log(`   Total Agents: ${this.results.length}`);
    console.log(`   ✅ Successfully Updated: ${successful.length}`);
    console.log(`   ❌ Failed Updates: ${failed.length}`);
    console.log(`   🔍 Not Found: ${notFound.length}`);
    console.log(`   📝 Total Fields Updated: ${totalFields}`);
    console.log(`   📈 Average Fields per Agent: ${this.results.length > 0 ? (totalFields / successful.length).toFixed(0) : 0}`);

    if (successful.length > 0) {
      console.log(`\n🎉 SUCCESSFUL UPDATES:`);
      successful.forEach(result => {
        console.log(`   ✅ ${result.agent}: ${result.fieldsUpdated} fields updated`);
        console.log(`      URL: https://eden-genesis-registry.vercel.app/agents/${result.agent}`);
      });
    }

    if (failed.length > 0) {
      console.log(`\n💥 FAILED UPDATES:`);
      failed.forEach(result => {
        console.log(`   ❌ ${result.agent}: ${result.message}`);
      });
    }

    if (notFound.length > 0) {
      console.log(`\n🔍 AGENTS NOT FOUND:`);
      notFound.forEach(result => {
        console.log(`   ❓ ${result.agent}: ${result.message}`);
      });
    }

    console.log(`\n🌐 REGISTRY STATUS:`);
    if (successful.length === this.results.length) {
      console.log(`   🟢 ALL AGENTS SUCCESSFULLY UPDATED IN REGISTRY`);
      console.log(`   🎯 Agent profiles now populated with comprehensive lore data`);
      console.log(`   📡 Registry URLs should show rich personality information`);
    } else if (successful.length > 0) {
      console.log(`   🟡 PARTIAL UPDATE SUCCESS`);
      console.log(`   ⚠️  Some agents may need individual attention`);
    } else {
      console.log(`   🔴 UPDATE FAILED`);
      console.log(`   🚨 Registry may not support profile extensions or agents not found`);
    }

    console.log(`\n📋 NEXT STEPS:`);
    console.log(`   1. Verify agent profiles are populated: https://eden-genesis-registry.vercel.app/agents/abraham`);
    console.log(`   2. Test lore-enhanced conversations through Registry APIs`);
    console.log(`   3. Update Academy lore manager to prefer Registry data`);
    console.log(`   4. Monitor Registry performance and data consistency`);
    
    if (failed.length > 0 || notFound.length > 0) {
      console.log(`   5. 🔄 Investigate failed updates and retry if needed`);
    }

    console.log(`\n💫 ENHANCED REGISTRY BENEFITS:`);
    console.log(`   ✨ Rich agent personalities now stored centrally`);
    console.log(`   🧠 Comprehensive knowledge systems in Registry`);
    console.log(`   🎭 Authentic conversation patterns preserved`);
    console.log(`   📚 Cultural and philosophical frameworks accessible`);
    console.log(`   🌟 Single source of truth for all agent data`);

    console.log('='.repeat(70));
  }
}

// Main execution
async function runRegistryProfileUpdate(): Promise<RegistryUpdateResult[]> {
  const updater = new RegistryProfileUpdater();
  return await updater.updateAllAgentProfiles();
}

// CLI execution
if (require.main === module) {
  runRegistryProfileUpdate()
    .then((results) => {
      const successful = results.filter(r => r.status === 'success').length;
      const total = results.length;
      
      if (successful === total && total > 0) {
        console.log('\n🎉 All Registry agent profiles updated successfully!');
        process.exit(0);
      } else if (successful > 0) {
        console.log(`\n⚠️  ${successful}/${total} agent profiles updated. Check failed updates above.`);
        process.exit(1);
      } else {
        console.log(`\n❌ No agent profiles were updated. Check connectivity and permissions.`);
        process.exit(1);
      }
    })
    .catch((error) => {
      console.error('\n💥 Registry profile update failed:', error);
      process.exit(1);
    });
}

export { runRegistryProfileUpdate, RegistryProfileUpdater };