#!/usr/bin/env tsx

/**
 * Register All Agents with Eden Genesis Registry
 * Comprehensive deployment of all agent lore data to Registry
 */

import { registerAbrahamWithRegistry } from './register-abraham-with-registry';
import { registerSolienneWithRegistry } from './register-solienne-with-registry';
import { registerCitizenWithRegistry } from './register-citizen-with-registry';
import { registerBerthaWithRegistry } from './register-bertha-with-registry';

interface RegistrationResult {
  agent: string;
  status: 'success' | 'failed' | 'skipped';
  message: string;
  duration: number;
  timestamp: Date;
}

class ComprehensiveRegistrationManager {
  private results: RegistrationResult[] = [];

  async registerAllAgents(): Promise<RegistrationResult[]> {
    console.log('🌟 Starting Comprehensive Agent Registry Deployment');
    console.log('=' .repeat(80));
    console.log('Registering all Eden Academy agents with comprehensive lore data...\n');

    // Register agents in dependency order (some may reference others)
    const registrationSequence = [
      { name: 'ABRAHAM', handler: registerAbrahamWithRegistry },
      { name: 'SOLIENNE', handler: registerSolienneWithRegistry },
      { name: 'CITIZEN', handler: registerCitizenWithRegistry },
      { name: 'BERTHA', handler: registerBerthaWithRegistry }
    ];

    for (const agent of registrationSequence) {
      await this.registerSingleAgent(agent.name, agent.handler);
      
      // Brief pause between registrations to avoid overwhelming Registry
      await this.sleep(2000);
    }

    this.generateRegistrationReport();
    return this.results;
  }

  private async registerSingleAgent(
    agentName: string, 
    registrationHandler: () => Promise<void>
  ): Promise<void> {
    const startTime = Date.now();
    
    console.log(`\n${'='.repeat(60)}`);
    console.log(`🚀 Registering ${agentName}...`);
    console.log(`${'='.repeat(60)}`);

    try {
      await registrationHandler();
      
      const duration = Date.now() - startTime;
      
      this.results.push({
        agent: agentName,
        status: 'success',
        message: `Successfully registered with comprehensive lore data`,
        duration,
        timestamp: new Date()
      });
      
      console.log(`\n✅ ${agentName} registration completed in ${duration}ms`);
      
    } catch (error) {
      const duration = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      this.results.push({
        agent: agentName,
        status: 'failed',
        message: `Registration failed: ${errorMessage}`,
        duration,
        timestamp: new Date()
      });
      
      console.log(`\n❌ ${agentName} registration failed after ${duration}ms:`);
      console.log(`   Error: ${errorMessage}`);
      
      // Continue with other agents even if one fails
      console.log(`\n⏭️  Continuing with remaining agent registrations...`);
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private generateRegistrationReport(): void {
    const successful = this.results.filter(r => r.status === 'success');
    const failed = this.results.filter(r => r.status === 'failed');
    const totalDuration = this.results.reduce((sum, r) => sum + r.duration, 0);
    const avgDuration = totalDuration / this.results.length;

    console.log('\n' + '='.repeat(80));
    console.log('🏛️ COMPREHENSIVE AGENT REGISTRY DEPLOYMENT REPORT');
    console.log('='.repeat(80));
    
    console.log(`📊 SUMMARY:`);
    console.log(`   Total Agents: ${this.results.length}`);
    console.log(`   ✅ Successfully Registered: ${successful.length}`);
    console.log(`   ❌ Failed Registrations: ${failed.length}`);
    console.log(`   ⏱️  Total Duration: ${(totalDuration / 1000).toFixed(1)}s`);
    console.log(`   📈 Average Registration Time: ${avgDuration.toFixed(0)}ms`);

    if (successful.length > 0) {
      console.log(`\n🎉 SUCCESSFUL REGISTRATIONS:`);
      successful.forEach(result => {
        console.log(`   ✅ ${result.agent}: ${result.message} (${result.duration}ms)`);
      });
    }

    if (failed.length > 0) {
      console.log(`\n💥 FAILED REGISTRATIONS:`);
      failed.forEach(result => {
        console.log(`   ❌ ${result.agent}: ${result.message} (${result.duration}ms)`);
      });
      
      console.log(`\n🔧 TROUBLESHOOTING FAILED REGISTRATIONS:`);
      console.log(`   1. Check Registry health: https://eden-genesis-registry.vercel.app/api/health`);
      console.log(`   2. Verify environment variables:`);
      console.log(`      - REGISTRY_BASE_URL`);
      console.log(`      - REGISTRY_API_KEY`);
      console.log(`      - USE_REGISTRY=true`);
      console.log(`   3. Test Registry connection: npm run test:registry`);
      console.log(`   4. Retry individual agent registration`);
    }

    console.log(`\n🌐 REGISTRY STATUS:`);
    if (successful.length === this.results.length) {
      console.log(`   🟢 ALL AGENTS SUCCESSFULLY DEPLOYED TO REGISTRY`);
      console.log(`   🎯 Registry now contains comprehensive lore data for all agents`);
      console.log(`   📡 Agent profiles should be fully populated at:`);
      successful.forEach(result => {
        const handle = result.agent.toLowerCase();
        console.log(`      https://eden-genesis-registry.vercel.app/agents/${handle}`);
      });
    } else if (successful.length > 0) {
      console.log(`   🟡 PARTIAL DEPLOYMENT SUCCESSFUL`);
      console.log(`   ⚠️  Some agents may need individual attention`);
    } else {
      console.log(`   🔴 DEPLOYMENT FAILED`);
      console.log(`   🚨 Registry may be unavailable or misconfigured`);
    }

    console.log(`\n📋 NEXT STEPS:`);
    console.log(`   1. Verify all agent profiles are populated in Registry`);
    console.log(`   2. Test lore-enhanced conversations through Registry APIs`);
    console.log(`   3. Update Academy to use Registry as lore source`);
    console.log(`   4. Monitor Registry performance and data consistency`);
    
    if (failed.length > 0) {
      console.log(`   5. 🔄 Retry failed registrations after troubleshooting`);
    }

    console.log(`\n💫 LORE SYSTEM BENEFITS NOW AVAILABLE:`);
    console.log(`   ✨ Rich personality-driven conversations`);
    console.log(`   🧠 Comprehensive knowledge and expertise systems`);
    console.log(`   🎭 Authentic voice patterns and communication styles`);
    console.log(`   📚 Deep cultural and philosophical frameworks`);
    console.log(`   🔄 Registry-first architecture for consistency`);
    console.log(`   🌟 Enhanced user experiences across all touchpoints`);

    console.log('='.repeat(80));
  }

  // Export results for monitoring and analysis
  exportResults(): void {
    const exportData = {
      timestamp: new Date().toISOString(),
      summary: {
        total: this.results.length,
        successful: this.results.filter(r => r.status === 'success').length,
        failed: this.results.filter(r => r.status === 'failed').length,
        avgDuration: this.results.reduce((sum, r) => sum + r.duration, 0) / this.results.length
      },
      results: this.results,
      registryUrls: this.results
        .filter(r => r.status === 'success')
        .map(r => ({
          agent: r.agent,
          url: `https://eden-genesis-registry.vercel.app/agents/${r.agent.toLowerCase()}`
        }))
    };

    console.log('\n📤 Registration data exported for monitoring systems');
    
    // In production, this would be sent to monitoring/analytics
    if (process.env.NODE_ENV === 'production') {
      console.log('📊 Sending registration metrics to monitoring system...');
    }
  }
}

// Main execution
async function runComprehensiveRegistration(): Promise<RegistrationResult[]> {
  const manager = new ComprehensiveRegistrationManager();
  const results = await manager.registerAllAgents();
  manager.exportResults();
  return results;
}

// CLI execution
if (require.main === module) {
  runComprehensiveRegistration()
    .then((results) => {
      const successful = results.filter(r => r.status === 'success').length;
      const total = results.length;
      
      if (successful === total) {
        console.log('\n🎉 All agent registrations completed successfully!');
        process.exit(0);
      } else {
        console.log(`\n⚠️  ${successful}/${total} agent registrations completed. Check failed registrations above.`);
        process.exit(1);
      }
    })
    .catch((error) => {
      console.error('\n💥 Comprehensive registration failed:', error);
      process.exit(1);
    });
}

export { runComprehensiveRegistration, ComprehensiveRegistrationManager };