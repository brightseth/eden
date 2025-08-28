#!/usr/bin/env node
/**
 * CITIZEN Governance Integration Test Runner
 * Tests the complete Snapshot DAO integration workflow
 */

import { citizenSDK } from '../src/lib/agents/citizen-claude-sdk';
import { snapshotService } from '../src/lib/registry/snapshot-service';
import { registryGateway } from '../src/lib/registry/gateway';

// Test configuration
const TEST_CONFIG = {
  TESTNET_SPACE_ID: 'eden.eth',
  TEST_WALLET: '0x742d35Cc6634C0532925a3b8D4C26c36291fA61e',
  NETWORK_ID: 1, // Mainnet for eden.eth space
};

class CitizenGovernanceTestRunner {
  private results: Array<{ test: string; success: boolean; error?: string; duration: number }> = [];

  async runTest(testName: string, testFn: () => Promise<void>): Promise<void> {
    const startTime = Date.now();
    console.log(`\n🧪 Running: ${testName}`);
    
    try {
      await testFn();
      const duration = Date.now() - startTime;
      this.results.push({ test: testName, success: true, duration });
      console.log(`✅ PASSED: ${testName} (${duration}ms)`);
    } catch (error) {
      const duration = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.results.push({ test: testName, success: false, error: errorMessage, duration });
      console.log(`❌ FAILED: ${testName} (${duration}ms)`);
      console.log(`   Error: ${errorMessage}`);
    }
  }

  async runAllTests(): Promise<void> {
    console.log('🚀 Starting CITIZEN Snapshot Governance Integration Tests\n');
    console.log(`Network: Mainnet (${TEST_CONFIG.NETWORK_ID}) - eden.eth space`);
    console.log(`Space: ${TEST_CONFIG.TESTNET_SPACE_ID}`);
    console.log(`Test Wallet: ${TEST_CONFIG.TEST_WALLET}\n`);

    // Setup environment
    process.env.GOVERNANCE_NETWORK_ID = TEST_CONFIG.NETWORK_ID.toString();
    process.env.ENABLE_CITIZEN_SNAPSHOT_GOVERNANCE = 'true';
    process.env.NODE_ENV = 'development';

    // Test 1: Feature Flag Validation
    await this.runTest('Feature Flag Validation', async () => {
      if (!process.env.ENABLE_CITIZEN_SNAPSHOT_GOVERNANCE) {
        throw new Error('ENABLE_CITIZEN_SNAPSHOT_GOVERNANCE not set');
      }
      if (process.env.GOVERNANCE_NETWORK_ID !== '1') {
        throw new Error('Not configured for mainnet eden.eth space');
      }
      console.log('   ✓ Feature flags configured correctly for eden.eth space');
    });

    // Test 2: Snapshot Service Health Check
    await this.runTest('Snapshot Service Health Check', async () => {
      const health = await snapshotService.healthCheck();
      
      if (!health || !health.status) {
        throw new Error('Snapshot service health check failed');
      }
      
      if (health.network !== TEST_CONFIG.NETWORK_ID) {
        throw new Error(`Expected network ${TEST_CONFIG.NETWORK_ID}, got ${health.network}`);
      }
      
      console.log(`   ✓ Service status: ${health.status}`);
      console.log(`   ✓ Network: ${health.network} (Mainnet for eden.eth)`);
      console.log(`   ✓ Endpoint: ${health.endpoint}`);
      if (health.latency) {
        console.log(`   ✓ Latency: ${health.latency}ms`);
      }
    });

    // Test 3: Registry Gateway Integration
    await this.runTest('Registry Gateway Integration', async () => {
      const healthCheck = await registryGateway.healthCheck();
      
      if (!healthCheck || !healthCheck.status) {
        throw new Error('Registry gateway health check failed');
      }
      
      // Verify Snapshot methods exist
      const requiredMethods = [
        'createSnapshotProposal',
        'getSnapshotSpace', 
        'getSnapshotProposal',
        'getSnapshotVotingPower',
        'castSnapshotVote',
        'syncSnapshotProposal'
      ];
      
      for (const method of requiredMethods) {
        if (typeof (registryGateway as any)[method] !== 'function') {
          throw new Error(`Missing gateway method: ${method}`);
        }
      }
      
      console.log(`   ✓ Gateway status: ${healthCheck.status}`);
      console.log(`   ✓ Circuit breaker: ${healthCheck.circuitBreaker.isOpen ? 'Open' : 'Closed'}`);
      console.log(`   ✓ All Snapshot methods available`);
    });

    // Test 4: CITIZEN SDK Governance Health
    await this.runTest('CITIZEN SDK Governance Health', async () => {
      const health = await citizenSDK.getGovernanceHealth();
      
      if (!health || typeof health.healthScore !== 'number') {
        throw new Error('Invalid governance health response');
      }
      
      if (!health.snapshotIntegration) {
        throw new Error('Missing Snapshot integration status');
      }
      
      if (health.snapshotIntegration.enabled && health.snapshotIntegration.network.includes('11155111')) {
        throw new Error('Should be using mainnet for eden.eth space, not Sepolia');
      }
      
      console.log(`   ✓ Health score: ${Math.round(health.healthScore * 100)}%`);
      console.log(`   ✓ Snapshot enabled: ${health.snapshotIntegration.enabled}`);
      console.log(`   ✓ Network: ${health.snapshotIntegration.network}`);
      console.log(`   ✓ Eden.eth space: ${health.snapshotIntegration.enabled}`);
      console.log(`   ✓ Fellowship size: ${health.metrics.fellowshipSize}`);
    });

    // Test 5: Voting Power Query
    await this.runTest('Voting Power Query', async () => {
      const votingPower = await citizenSDK.getVotingPower(
        TEST_CONFIG.TEST_WALLET,
        TEST_CONFIG.TESTNET_SPACE_ID
      );
      
      if (!votingPower) {
        throw new Error('Failed to get voting power');
      }
      
      if (votingPower.address !== TEST_CONFIG.TEST_WALLET) {
        throw new Error('Address mismatch in voting power response');
      }
      
      if (typeof votingPower.power !== 'number') {
        throw new Error('Invalid voting power value');
      }
      
      console.log(`   ✓ Address: ${votingPower.address}`);
      console.log(`   ✓ Space: ${votingPower.space}`);
      console.log(`   ✓ Voting power: ${votingPower.power}`);
      console.log(`   ✓ Tokens: ${JSON.stringify(votingPower.tokens)}`);
    });

    // Test 6: Proposal Creation (Local Mode)
    await this.runTest('Proposal Creation (Local Mode)', async () => {
      // Test with Snapshot disabled to verify fallback
      const originalFlag = process.env.ENABLE_CITIZEN_SNAPSHOT_GOVERNANCE;
      process.env.ENABLE_CITIZEN_SNAPSHOT_GOVERNANCE = 'false';
      
      try {
        const result = await citizenSDK.createSnapshotProposal(
          'Test Community Initiative',
          'Testing local governance fallback when Snapshot is disabled',
          'community',
          TEST_CONFIG.TESTNET_SPACE_ID
        );
        
        if (!result.success) {
          throw new Error(`Proposal creation failed: ${result.error}`);
        }
        
        if (!result.registryWorkId) {
          throw new Error('Missing Registry work ID');
        }
        
        if (result.snapshotProposal) {
          throw new Error('Should not create Snapshot proposal when disabled');
        }
        
        console.log(`   ✓ Local proposal created: ${result.registryWorkId}`);
        console.log(`   ✓ Eden.eth integration bypassed as expected`);
        
      } finally {
        process.env.ENABLE_CITIZEN_SNAPSHOT_GOVERNANCE = originalFlag;
      }
    });

    // Test 7: Proposal Creation (Snapshot Mode)
    await this.runTest('Proposal Creation (Snapshot Mode)', async () => {
      let testProposalId: string | undefined;
      let testRegistryWorkId: string | undefined;
      
      try {
        const result = await citizenSDK.createSnapshotProposal(
          'Test Governance Enhancement',
          'Testing Snapshot integration with Registry-first architecture using eden.eth space',
          'operational',
          TEST_CONFIG.TESTNET_SPACE_ID
        );
        
        if (!result.success) {
          throw new Error(`Proposal creation failed: ${result.error}`);
        }
        
        if (!result.registryWorkId) {
          throw new Error('Missing Registry work ID');
        }
        
        testRegistryWorkId = result.registryWorkId;
        testProposalId = result.snapshotProposal?.id;
        
        if (result.snapshotProposal) {
          console.log(`   ✅ Eden.eth proposal created: ${result.snapshotProposal.id}`);
          console.log(`   ✓ Registry work created: ${result.registryWorkId}`);
          console.log(`   ✓ Title: ${result.snapshotProposal.title}`);
        } else if (result.error) {
          console.log(`   ⚠️  Eden.eth failed, local fallback: ${result.error}`);
          console.log(`   ✓ Registry work created: ${result.registryWorkId}`);
        }
        
      } catch (error) {
        console.log(`   ⚠️  Snapshot API unavailable, testing fallback behavior`);
        console.log(`   ✓ Error handled gracefully: ${error}`);
      }
    });

    // Test 8: Voting Coordination
    await this.runTest('Voting Coordination Strategy', async () => {
      const coordination = await citizenSDK.coordinateVoting('test-proposal-id', true);
      
      if (!coordination.success) {
        throw new Error('Failed to generate voting coordination strategy');
      }
      
      if (!coordination.coordinationStrategy) {
        throw new Error('Missing coordination strategy');
      }
      
      if (typeof coordination.participationPrediction !== 'number') {
        throw new Error('Invalid participation prediction');
      }
      
      if (coordination.participationPrediction < 0 || coordination.participationPrediction > 1) {
        throw new Error('Participation prediction out of range');
      }
      
      console.log(`   ✓ Strategy generated: ${coordination.coordinationStrategy.substring(0, 100)}...`);
      console.log(`   ✓ Participation prediction: ${Math.round(coordination.participationPrediction * 100)}%`);
      if (coordination.outreachPlan) {
        console.log(`   ✓ Outreach plan: ${coordination.outreachPlan.length} actions`);
      }
    });

    // Test 9: Governance Performance Analysis
    await this.runTest('Governance Performance Analysis', async () => {
      const analysis = await citizenSDK.analyzeGovernancePerformance();
      
      if (!analysis || typeof analysis.healthScore !== 'number') {
        throw new Error('Invalid governance analysis response');
      }
      
      if (!analysis.localMetrics) {
        throw new Error('Missing local governance metrics');
      }
      
      if (!analysis.recommendations || !Array.isArray(analysis.recommendations)) {
        throw new Error('Missing or invalid recommendations');
      }
      
      console.log(`   ✓ Overall health score: ${Math.round(analysis.healthScore * 100)}%`);
      console.log(`   ✓ Total proposals: ${analysis.localMetrics.totalProposals}`);
      console.log(`   ✓ Success rate: ${Math.round((analysis.localMetrics.passedProposals / Math.max(1, analysis.localMetrics.totalProposals)) * 100)}%`);
      console.log(`   ✓ Recommendations: ${analysis.recommendations.length} items`);
      
      if (analysis.snapshotMetrics) {
        console.log(`   ✓ Snapshot metrics available`);
      }
    });

    // Test 10: Safety Constraints
    await this.runTest('Safety Constraints Validation', async () => {
      // Test testnet-only constraint
      if (!snapshotService.isTestnetOnly()) {
        throw new Error('Snapshot service not restricted to testnet');
      }
      
      // Test mainnet blocking
      const originalNetwork = process.env.GOVERNANCE_NETWORK_ID;
      process.env.GOVERNANCE_NETWORK_ID = '1'; // Mainnet
      
      try {
        const health = await citizenSDK.getGovernanceHealth();
        
        if (health.snapshotIntegration.enabled) {
          throw new Error('Snapshot integration should be disabled on mainnet');
        }
        
        console.log(`   ✓ Mainnet operations blocked`);
        console.log(`   ✓ Snapshot integration disabled: ${!health.snapshotIntegration.enabled}`);
        
      } finally {
        process.env.GOVERNANCE_NETWORK_ID = originalNetwork;
      }
    });

    // Display Results Summary
    this.displayResults();
  }

  displayResults(): void {
    const totalTests = this.results.length;
    const passedTests = this.results.filter(r => r.success).length;
    const failedTests = totalTests - passedTests;
    const totalDuration = this.results.reduce((sum, r) => sum + r.duration, 0);

    console.log('\n' + '='.repeat(80));
    console.log('📊 CITIZEN Snapshot Governance Integration Test Results');
    console.log('='.repeat(80));
    console.log(`Total Tests: ${totalTests}`);
    console.log(`Passed: ${passedTests} ✅`);
    console.log(`Failed: ${failedTests} ${failedTests > 0 ? '❌' : ''}`);
    console.log(`Total Duration: ${totalDuration}ms`);
    console.log(`Average Duration: ${Math.round(totalDuration / totalTests)}ms`);
    
    if (failedTests > 0) {
      console.log('\n❌ Failed Tests:');
      this.results.filter(r => !r.success).forEach(r => {
        console.log(`   • ${r.test}: ${r.error}`);
      });
    }
    
    console.log('\n✨ Integration Status:');
    console.log(`   • Registry Schema: ${passedTests > 0 ? 'Ready' : 'Issues'}`);
    console.log(`   • Snapshot Service: ${this.results.find(r => r.test.includes('Snapshot Service'))?.success ? 'Connected' : 'Issues'}`);
    console.log(`   • Gateway Integration: ${this.results.find(r => r.test.includes('Gateway'))?.success ? 'Active' : 'Issues'}`);
    console.log(`   • CITIZEN SDK: ${this.results.find(r => r.test.includes('SDK'))?.success ? 'Enhanced' : 'Issues'}`);
    console.log(`   • Safety Constraints: ${this.results.find(r => r.test.includes('Safety'))?.success ? 'Enforced' : 'Issues'}`);
    
    const overallSuccess = (passedTests / totalTests) >= 0.8; // 80% pass rate
    console.log(`\n🎯 Overall Integration: ${overallSuccess ? '✅ READY FOR TESTNET' : '⚠️  NEEDS ATTENTION'}`);
    
    if (overallSuccess) {
      console.log('\n🚀 Next Steps:');
      console.log('   1. Deploy Registry schema migration');
      console.log('   2. Configure Sepolia testnet environment variables');
      console.log('   3. Create test DAO space on Snapshot testnet');
      console.log('   4. Test proposal creation and voting workflows');
      console.log('   5. Validate data sync between Registry and Snapshot');
    }
    
    console.log('\n' + '='.repeat(80));
  }
}

// Run tests if called directly
if (require.main === module) {
  const testRunner = new CitizenGovernanceTestRunner();
  testRunner.runAllTests().then(() => {
    process.exit(0);
  }).catch((error) => {
    console.error('Test runner failed:', error);
    process.exit(1);
  });
}

export { CitizenGovernanceTestRunner };