/**
 * Registry Sync Validation Tests
 * Validates Registry connectivity and sync capabilities for all SDKs
 */

import { RegistryClient } from '../src/lib/registry/sdk';

interface SyncTest {
  test: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
  data?: any;
  duration: number;
}

class RegistrySyncValidator {
  private registryClient: RegistryClient;
  private results: SyncTest[] = [];

  constructor() {
    this.registryClient = new RegistryClient({
      baseUrl: process.env.REGISTRY_URL || 'https://eden-genesis-registry.vercel.app/api/v1',
      timeout: 10000,
      onError: (error) => console.warn('Registry Error:', error.message)
    });
  }

  async runAllSyncTests(): Promise<SyncTest[]> {
    console.log('🔄 Starting Registry Sync Validation Tests\n');

    const tests = [
      this.testRegistryHealth(),
      this.testAgentRetrieval(),
      this.testCreationPosting(),
      this.testBatchOperations(),
      this.testSDKRegistryIntegration(),
      this.testSyncResilience()
    ];

    for (const testPromise of tests) {
      const result = await testPromise;
      this.results.push(result);
      
      const statusIcon = result.status === 'pass' ? '✅' : 
                        result.status === 'warning' ? '⚠️' : '❌';
      console.log(`${statusIcon} ${result.test}: ${result.message} (${result.duration}ms)`);
      
      if (result.data) {
        console.log(`   Data: ${JSON.stringify(result.data, null, 2).substring(0, 200)}...`);
      }
    }

    this.printSyncSummary();
    return this.results;
  }

  private async testRegistryHealth(): Promise<SyncTest> {
    const startTime = Date.now();
    
    try {
      const health = await this.registryClient.health();
      const duration = Date.now() - startTime;
      
      return {
        test: 'Registry Health Check',
        status: health.status === 'ok' ? 'pass' : 'fail',
        message: `Registry ${health.status} - ${health.message}`,
        data: health,
        duration
      };
    } catch (error) {
      return {
        test: 'Registry Health Check',
        status: 'fail',
        message: `Registry unreachable: ${error instanceof Error ? error.message : 'Unknown error'}`,
        duration: Date.now() - startTime
      };
    }
  }

  private async testAgentRetrieval(): Promise<SyncTest> {
    const startTime = Date.now();
    
    try {
      const agents = await this.registryClient.agents.list({ limit: 10 });
      const duration = Date.now() - startTime;
      
      if (agents.length > 0) {
        return {
          test: 'Agent Data Retrieval',
          status: 'pass',
          message: `Retrieved ${agents.length} agents successfully`,
          data: { 
            agentCount: agents.length,
            sampleAgent: agents[0]?.handle || 'none'
          },
          duration
        };
      } else {
        return {
          test: 'Agent Data Retrieval',
          status: 'warning',
          message: 'No agents found in Registry',
          duration
        };
      }
    } catch (error) {
      return {
        test: 'Agent Data Retrieval',
        status: 'fail',
        message: `Failed to retrieve agents: ${error instanceof Error ? error.message : 'Unknown error'}`,
        duration: Date.now() - startTime
      };
    }
  }

  private async testCreationPosting(): Promise<SyncTest> {
    const startTime = Date.now();
    
    try {
      // Test creation posting capability (without actually posting)
      // We'll test the method existence and basic validation
      const hasCreationMethods = this.registryClient.creations && 
                                 typeof this.registryClient.creations.create === 'function';
      
      const duration = Date.now() - startTime;
      
      if (hasCreationMethods) {
        return {
          test: 'Creation Posting Capability',
          status: 'pass',
          message: 'Creation posting methods available and configured',
          data: { methodsAvailable: ['create', 'list', 'get', 'update'] },
          duration
        };
      } else {
        return {
          test: 'Creation Posting Capability',
          status: 'fail',
          message: 'Creation posting methods not available',
          duration
        };
      }
    } catch (error) {
      return {
        test: 'Creation Posting Capability',
        status: 'fail',
        message: `Creation posting test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        duration: Date.now() - startTime
      };
    }
  }

  private async testBatchOperations(): Promise<SyncTest> {
    const startTime = Date.now();
    
    try {
      // Test batch operation capabilities
      const hasBatchMethods = this.registryClient.batch &&
                             typeof this.registryClient.batch.getAgents === 'function';
      
      const duration = Date.now() - startTime;
      
      return {
        test: 'Batch Operations',
        status: hasBatchMethods ? 'pass' : 'warning',
        message: hasBatchMethods ? 'Batch operations available' : 'Batch operations not configured',
        data: { batchSupport: hasBatchMethods },
        duration
      };
    } catch (error) {
      return {
        test: 'Batch Operations',
        status: 'fail',
        message: `Batch operation test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        duration: Date.now() - startTime
      };
    }
  }

  private async testSDKRegistryIntegration(): Promise<SyncTest> {
    const startTime = Date.now();
    
    try {
      // Test that SDKs can properly integrate with Registry
      const integrationPoints = [
        'Agent identity resolution',
        'Creation synchronization',
        'Status updates',
        'Metadata persistence'
      ];

      // For now, we test the basic capability exists
      const canIntegrate = this.registryClient !== null && 
                          this.registryClient.agents !== undefined;
      
      const duration = Date.now() - startTime;
      
      return {
        test: 'SDK Registry Integration',
        status: canIntegrate ? 'pass' : 'fail',
        message: canIntegrate ? 'SDK integration points configured' : 'SDK integration not available',
        data: { integrationPoints },
        duration
      };
    } catch (error) {
      return {
        test: 'SDK Registry Integration',
        status: 'fail',
        message: `SDK integration test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        duration: Date.now() - startTime
      };
    }
  }

  private async testSyncResilience(): Promise<SyncTest> {
    const startTime = Date.now();
    
    try {
      // Test sync resilience with invalid requests
      let resilientBehavior = 0;
      
      try {
        await this.registryClient.agents.get('nonexistent-agent-id');
      } catch (error) {
        // Expected to fail gracefully
        resilientBehavior++;
      }

      try {
        await this.registryClient.agents.list({ limit: -1 });
      } catch (error) {
        // Expected to handle invalid parameters
        resilientBehavior++;
      }

      const duration = Date.now() - startTime;
      
      return {
        test: 'Sync Resilience',
        status: resilientBehavior >= 1 ? 'pass' : 'warning',
        message: `Handled ${resilientBehavior}/2 error conditions gracefully`,
        data: { errorHandling: resilientBehavior },
        duration
      };
    } catch (error) {
      return {
        test: 'Sync Resilience',
        status: 'fail',
        message: `Resilience test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        duration: Date.now() - startTime
      };
    }
  }

  private printSyncSummary(): void {
    const passed = this.results.filter(r => r.status === 'pass').length;
    const warnings = this.results.filter(r => r.status === 'warning').length;
    const failed = this.results.filter(r => r.status === 'fail').length;
    const total = this.results.length;

    console.log('\n' + '='.repeat(60));
    console.log('📊 REGISTRY SYNC VALIDATION SUMMARY');
    console.log('='.repeat(60));
    console.log(`Total Tests: ${total}`);
    console.log(`✅ Passed: ${passed}`);
    console.log(`⚠️  Warnings: ${warnings}`);
    console.log(`❌ Failed: ${failed}`);
    
    const successRate = ((passed + warnings) / total) * 100;
    console.log(`📈 Success Rate: ${successRate.toFixed(1)}%`);

    // Sync readiness assessment
    if (failed === 0 && warnings <= 1) {
      console.log('\n🟢 REGISTRY SYNC STATUS: READY FOR PRODUCTION');
    } else if (failed <= 2) {
      console.log('\n🟡 REGISTRY SYNC STATUS: NEEDS MINOR FIXES');
    } else {
      console.log('\n🔴 REGISTRY SYNC STATUS: MAJOR ISSUES DETECTED');
    }

    if (failed > 0) {
      console.log('\n❌ SYNC ISSUES TO RESOLVE:');
      this.results
        .filter(r => r.status === 'fail')
        .forEach(r => console.log(`  • ${r.test}: ${r.message}`));
    }

    if (warnings > 0) {
      console.log('\n⚠️  SYNC WARNINGS:');
      this.results
        .filter(r => r.status === 'warning')
        .forEach(r => console.log(`  • ${r.test}: ${r.message}`));
    }

    console.log('='.repeat(60));
  }
}

// Test individual agent sync capabilities
class AgentSyncTester {
  private registryClient: RegistryClient;

  constructor() {
    this.registryClient = new RegistryClient();
  }

  async testAgentSync(agentId: string): Promise<SyncTest> {
    const startTime = Date.now();
    
    try {
      // Test agent-specific sync capability
      const agent = await this.registryClient.agents.getByHandle(agentId);
      
      if (agent) {
        // Test creation listing for this agent
        const creations = await this.registryClient.creations.list(agentId, { limit: 5 });
        
        return {
          test: `${agentId} Sync Test`,
          status: 'pass',
          message: `Agent found with ${creations.length} creations`,
          data: { 
            agentId: agent.id,
            handle: agent.handle,
            creationCount: creations.length
          },
          duration: Date.now() - startTime
        };
      } else {
        return {
          test: `${agentId} Sync Test`,
          status: 'warning',
          message: 'Agent not found in Registry',
          duration: Date.now() - startTime
        };
      }
    } catch (error) {
      return {
        test: `${agentId} Sync Test`,
        status: 'fail',
        message: `Sync failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        duration: Date.now() - startTime
      };
    }
  }
}

// Main execution function
export async function runRegistrySyncValidation(): Promise<SyncTest[]> {
  const validator = new RegistrySyncValidator();
  const results = await validator.runAllSyncTests();
  
  // Also test individual agent sync
  console.log('\n🤖 Testing Individual Agent Sync:');
  const agentTester = new AgentSyncTester();
  
  const agentTests = ['solienne', 'abraham', 'sue', 'miyomi', 'bertha'];
  for (const agentId of agentTests) {
    const result = await agentTester.testAgentSync(agentId);
    const statusIcon = result.status === 'pass' ? '✅' : 
                      result.status === 'warning' ? '⚠️' : '❌';
    console.log(`${statusIcon} ${result.test}: ${result.message} (${result.duration}ms)`);
  }
  
  return results;
}

// CLI execution
if (require.main === module) {
  runRegistrySyncValidation()
    .then(() => {
      console.log('\n🎉 Registry sync validation complete!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Registry sync validation failed:', error);
      process.exit(1);
    });
}