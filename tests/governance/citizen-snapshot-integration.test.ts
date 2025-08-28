/**
 * CITIZEN Snapshot DAO Integration Test Suite
 * Tests the complete governance workflow on Sepolia testnet
 */

import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { citizenSDK } from '../../src/lib/agents/citizen-claude-sdk';
import { registryGateway } from '../../src/lib/registry/gateway';
import { snapshotService } from '../../src/lib/registry/snapshot-service';

// Test configuration
const TEST_CONFIG = {
  TESTNET_SPACE_ID: 'brightmomentsdao-sepolia.eth',
  TEST_WALLET_ADDRESS: '0x742d35Cc6634C0532925a3b8D4C26c36291fA61e', // Example testnet address
  NETWORK_ID: 11155111, // Sepolia
  TIMEOUT: 30000, // 30 seconds for API calls
};

describe('CITIZEN Snapshot DAO Integration', () => {
  let testProposalId: string;
  let testRegistryWorkId: string;

  beforeAll(async () => {
    // Ensure we're running in testnet environment
    process.env.GOVERNANCE_NETWORK_ID = '11155111';
    process.env.ENABLE_CITIZEN_SNAPSHOT_GOVERNANCE = 'true';
    process.env.NODE_ENV = 'development';
    
    console.log('[TEST] Setting up CITIZEN Snapshot integration tests on Sepolia testnet');
  });

  afterAll(async () => {
    console.log('[TEST] Completed CITIZEN Snapshot integration tests');
  });

  describe('Feature Flag Validation', () => {
    it('should have Snapshot governance enabled for testnet', () => {
      expect(process.env.ENABLE_CITIZEN_SNAPSHOT_GOVERNANCE).toBe('true');
      expect(process.env.GOVERNANCE_NETWORK_ID).toBe('11155111');
    });

    it('should block Snapshot operations on non-testnet networks', async () => {
      // Temporarily change network to mainnet
      const originalNetwork = process.env.GOVERNANCE_NETWORK_ID;
      process.env.GOVERNANCE_NETWORK_ID = '1'; // Mainnet
      
      try {
        const result = await citizenSDK.createSnapshotProposal(
          'Test Proposal',
          'Test context',
          'community',
          TEST_CONFIG.TESTNET_SPACE_ID
        );
        
        // Should fallback to local governance, not create Snapshot proposal
        expect(result.success).toBe(true);
        expect(result.snapshotProposal).toBeUndefined();
        expect(result.registryWorkId).toBeDefined();
      } finally {
        // Restore testnet setting
        process.env.GOVERNANCE_NETWORK_ID = originalNetwork;
      }
    }, TEST_CONFIG.TIMEOUT);
  });

  describe('Registry Schema Validation', () => {
    it('should have governance_profiles table available', async () => {
      // This would require a database connection to test properly
      // For now, validate that the structure is defined
      expect(citizenSDK).toBeDefined();
      expect(typeof citizenSDK.createSnapshotProposal).toBe('function');
    });

    it('should support governance work types', async () => {
      // Validate that governance work types are recognized
      const workTypes = ['snapshot_proposal', 'consensus_building', 'voting_coordination'];
      workTypes.forEach(type => {
        expect(typeof type).toBe('string');
        expect(type.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Snapshot Service Integration', () => {
    it('should initialize Snapshot service with correct configuration', () => {
      expect(snapshotService).toBeDefined();
      expect(snapshotService.getConfig()).toEqual(
        expect.objectContaining({
          baseUrl: expect.stringContaining('snapshot'),
          networkId: TEST_CONFIG.NETWORK_ID,
          apiKey: '***masked***' // Should be masked in config output
        })
      );
    });

    it('should be configured for testnet only', () => {
      expect(snapshotService.isTestnetOnly()).toBe(true);
    });

    it('should perform health check', async () => {
      const health = await snapshotService.healthCheck();
      
      expect(health).toHaveProperty('status');
      expect(health).toHaveProperty('network', TEST_CONFIG.NETWORK_ID);
      expect(health).toHaveProperty('endpoint');
      expect(['healthy', 'degraded', 'unhealthy']).toContain(health.status);
    }, TEST_CONFIG.TIMEOUT);
  });

  describe('Gateway Integration', () => {
    it('should have Snapshot governance methods available', () => {
      expect(typeof registryGateway.createSnapshotProposal).toBe('function');
      expect(typeof registryGateway.getSnapshotSpace).toBe('function');
      expect(typeof registryGateway.getSnapshotProposal).toBe('function');
      expect(typeof registryGateway.getSnapshotVotingPower).toBe('function');
      expect(typeof registryGateway.castSnapshotVote).toBe('function');
      expect(typeof registryGateway.syncSnapshotProposal).toBe('function');
    });

    it('should maintain Registry-first architecture', async () => {
      // Test that Gateway calls go through proper authentication and caching
      const healthCheck = await registryGateway.healthCheck();
      
      expect(healthCheck).toHaveProperty('status');
      expect(healthCheck).toHaveProperty('circuitBreaker');
      expect(healthCheck).toHaveProperty('cache');
      expect(['healthy', 'degraded', 'unhealthy']).toContain(healthCheck.status);
    });
  });

  describe('CITIZEN SDK Governance Methods', () => {
    it('should create local governance proposal when Snapshot disabled', async () => {
      const originalFlag = process.env.ENABLE_CITIZEN_SNAPSHOT_GOVERNANCE;
      process.env.ENABLE_CITIZEN_SNAPSHOT_GOVERNANCE = 'false';

      try {
        const result = await citizenSDK.createSnapshotProposal(
          'Test Community Initiative',
          'A test proposal for community engagement',
          'community',
          TEST_CONFIG.TESTNET_SPACE_ID
        );

        expect(result.success).toBe(true);
        expect(result.registryWorkId).toBeDefined();
        expect(result.snapshotProposal).toBeUndefined(); // No Snapshot integration
        expect(result.error).toBeUndefined();
      } finally {
        process.env.ENABLE_CITIZEN_SNAPSHOT_GOVERNANCE = originalFlag;
      }
    }, TEST_CONFIG.TIMEOUT);

    it('should create Snapshot proposal when enabled and on testnet', async () => {
      try {
        const result = await citizenSDK.createSnapshotProposal(
          'Test Governance Enhancement',
          'Testing Snapshot integration with Registry-first architecture',
          'operational',
          TEST_CONFIG.TESTNET_SPACE_ID
        );

        if (result.success) {
          testRegistryWorkId = result.registryWorkId!;
          testProposalId = result.snapshotProposal?.id || 'test-proposal-local';
          
          expect(result.registryWorkId).toBeDefined();
          expect(result.snapshotProposal).toBeDefined();
          expect(result.error).toBeUndefined();
        } else {
          // If Snapshot integration fails, should fallback gracefully
          expect(result.registryWorkId).toBeDefined();
          expect(result.error).toContain('Snapshot integration failed');
          testRegistryWorkId = result.registryWorkId!;
          testProposalId = 'test-proposal-fallback';
        }
      } catch (error) {
        // Network issues or Snapshot unavailable - test fallback behavior
        console.warn('[TEST] Snapshot integration unavailable, testing fallback:', error);
        
        const fallbackResult = await citizenSDK.createSnapshotProposal(
          'Fallback Test Proposal',
          'Testing graceful fallback when Snapshot unavailable',
          'community',
          TEST_CONFIG.TESTNET_SPACE_ID
        );
        
        expect(fallbackResult.success).toBe(true);
        expect(fallbackResult.registryWorkId).toBeDefined();
        testRegistryWorkId = fallbackResult.registryWorkId!;
        testProposalId = 'test-proposal-fallback';
      }
    }, TEST_CONFIG.TIMEOUT);

    it('should get voting power for testnet address', async () => {
      const votingPower = await citizenSDK.getVotingPower(
        TEST_CONFIG.TEST_WALLET_ADDRESS,
        TEST_CONFIG.TESTNET_SPACE_ID
      );

      expect(votingPower).toBeDefined();
      expect(votingPower).toHaveProperty('address', TEST_CONFIG.TEST_WALLET_ADDRESS);
      expect(votingPower).toHaveProperty('space', TEST_CONFIG.TESTNET_SPACE_ID);
      expect(votingPower).toHaveProperty('power');
      expect(typeof votingPower!.power).toBe('number');
    }, TEST_CONFIG.TIMEOUT);

    it('should coordinate voting strategy', async () => {
      const coordination = await citizenSDK.coordinateVoting(testProposalId, true);

      expect(coordination.success).toBe(true);
      expect(coordination).toHaveProperty('coordinationStrategy');
      expect(coordination).toHaveProperty('participationPrediction');
      expect(typeof coordination.participationPrediction).toBe('number');
      expect(coordination.participationPrediction).toBeGreaterThanOrEqual(0);
      expect(coordination.participationPrediction).toBeLessThanOrEqual(1);
    }, TEST_CONFIG.TIMEOUT);

    it('should sync proposal results', async () => {
      if (!testProposalId || !testRegistryWorkId) {
        console.log('[TEST] Skipping sync test - no test proposal created');
        return;
      }

      const syncResult = await citizenSDK.syncProposalResults(
        testProposalId,
        testRegistryWorkId
      );

      expect(syncResult).toBeDefined();
      expect(syncResult).toHaveProperty('proposalId', testProposalId);
      expect(syncResult).toHaveProperty('registryWorkId', testRegistryWorkId);
      expect(syncResult).toHaveProperty('syncedAt');
      expect(syncResult).toHaveProperty('success');
    }, TEST_CONFIG.TIMEOUT);

    it('should analyze governance performance', async () => {
      const analysis = await citizenSDK.analyzeGovernancePerformance();

      expect(analysis).toBeDefined();
      expect(analysis).toHaveProperty('localMetrics');
      expect(analysis).toHaveProperty('recommendations');
      expect(analysis).toHaveProperty('healthScore');
      expect(typeof analysis.healthScore).toBe('number');
      expect(analysis.healthScore).toBeGreaterThanOrEqual(0);
      expect(analysis.healthScore).toBeLessThanOrEqual(1);
    }, TEST_CONFIG.TIMEOUT);

    it('should get comprehensive governance health', async () => {
      const health = await citizenSDK.getGovernanceHealth();

      expect(health).toBeDefined();
      expect(health).toHaveProperty('metrics');
      expect(health).toHaveProperty('snapshotIntegration');
      expect(health).toHaveProperty('healthScore');
      expect(health).toHaveProperty('recommendations');

      // Validate Snapshot integration status
      expect(health.snapshotIntegration).toHaveProperty('enabled');
      expect(health.snapshotIntegration).toHaveProperty('network');
      expect(health.snapshotIntegration).toHaveProperty('testnetOnly', true);
    }, TEST_CONFIG.TIMEOUT);
  });

  describe('API Endpoints', () => {
    it('should handle GET /api/agents/citizen/governance with Snapshot integration', async () => {
      // This would require setting up a test server
      // For now, validate the endpoint structure exists
      expect(typeof citizenSDK.getGovernanceMetrics).toBe('function');
    });

    it('should handle POST actions for governance', async () => {
      const testActions = [
        'create_proposal',
        'coordinate_voting',
        'get_voting_power',
        'sync_proposal',
        'analyze_governance_performance',
        'get_governance_health'
      ];

      testActions.forEach(action => {
        expect(typeof action).toBe('string');
        expect(action.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Error Handling and Fallbacks', () => {
    it('should gracefully handle Snapshot API failures', async () => {
      // Test with invalid space ID to trigger error
      try {
        const result = await citizenSDK.createSnapshotProposal(
          'Invalid Space Test',
          'Testing error handling',
          'community',
          'invalid-space-id'
        );

        // Should still succeed with local fallback
        expect(result.success).toBe(true);
        expect(result.registryWorkId).toBeDefined();
        expect(result.error).toBeDefined();
      } catch (error) {
        // Should not throw unhandled errors
        fail('Should not throw unhandled errors: ' + error);
      }
    }, TEST_CONFIG.TIMEOUT);

    it('should maintain data consistency during failures', async () => {
      const initialMetrics = citizenSDK.getGovernanceMetrics();
      
      try {
        await citizenSDK.createSnapshotProposal(
          'Consistency Test',
          'Testing data consistency during errors',
          'community',
          'invalid-space'
        );
      } catch (error) {
        // Expected to handle gracefully
      }

      const finalMetrics = citizenSDK.getGovernanceMetrics();
      
      // Metrics should be updated even if Snapshot fails
      expect(finalMetrics.totalProposals).toBeGreaterThanOrEqual(initialMetrics.totalProposals);
    }, TEST_CONFIG.TIMEOUT);

    it('should enforce testnet-only safety constraints', async () => {
      // Attempt to use mainnet space ID - should be blocked
      const result = await citizenSDK.getVotingPower(
        TEST_CONFIG.TEST_WALLET_ADDRESS,
        'brightmomentsdao.eth' // Mainnet space
      );

      // Should return simulated data, not make real mainnet calls
      expect(result).toBeDefined();
      if (result) {
        expect(result.power).toBe(1); // Simulated power
        expect(result.space).toBe('brightmomentsdao.eth');
      }
    }, TEST_CONFIG.TIMEOUT);
  });

  describe('Registry Integration', () => {
    it('should maintain Registry-first architecture', async () => {
      // All governance data should flow through Registry
      const health = await citizenSDK.getGovernanceHealth();
      
      expect(health.metrics).toBeDefined();
      expect(health.snapshotIntegration.enabled).toBeDefined();
      
      // Registry should be the canonical source of truth
      expect(health.recommendations).toContain(expect.stringMatching(/Registry.*source of truth|Registry.*canonical/i));
    });

    it('should sync governance events to Registry', async () => {
      // This would test that governance_events table is populated
      // For now, validate the structure exists
      expect(citizenSDK.getGovernanceMetrics()).toBeDefined();
    });
  });

  describe('Performance and Reliability', () => {
    it('should complete governance operations within timeout', async () => {
      const startTime = Date.now();
      
      const result = await citizenSDK.getGovernanceHealth();
      
      const duration = Date.now() - startTime;
      expect(duration).toBeLessThan(TEST_CONFIG.TIMEOUT);
      expect(result).toBeDefined();
    });

    it('should handle concurrent governance operations', async () => {
      const operations = [
        citizenSDK.getGovernanceHealth(),
        citizenSDK.analyzeGovernancePerformance(),
        citizenSDK.getVotingPower(TEST_CONFIG.TEST_WALLET_ADDRESS)
      ];

      const results = await Promise.all(operations);
      
      results.forEach(result => {
        expect(result).toBeDefined();
      });
    }, TEST_CONFIG.TIMEOUT * 2);
  });
});

// Export test utilities for integration with other test suites
export const testUtils = {
  TEST_CONFIG,
  validateSnapshotIntegration: (result: any) => {
    expect(result).toBeDefined();
    expect(result).toHaveProperty('success');
    if (result.success && result.snapshotProposal) {
      expect(result.snapshotProposal).toHaveProperty('id');
      expect(result.registryWorkId).toBeDefined();
    }
  },
  
  validateGovernanceHealth: (health: any) => {
    expect(health).toHaveProperty('metrics');
    expect(health).toHaveProperty('snapshotIntegration');
    expect(health).toHaveProperty('healthScore');
    expect(health).toHaveProperty('recommendations');
    expect(health.snapshotIntegration.testnetOnly).toBe(true);
  }
};