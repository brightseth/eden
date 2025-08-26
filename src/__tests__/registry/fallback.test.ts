/**
 * Registry Fallback and Degradation Tests
 * Tests graceful degradation when Registry is unavailable
 * Validates fallback behavior and error handling
 */

import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { registryClient } from '@/lib/registry/client';
import { registryHealthMonitor } from '@/lib/registry/health-monitor';
import { featureFlags } from '@/config/flags';

// Mock server for simulating Registry failures
class MockFailureServer {
  private originalFetch: typeof global.fetch;
  private failureMode: 'timeout' | 'server-error' | 'network-error' | 'partial-failure' | 'none' = 'none';
  private failureCount = 0;
  private maxFailures = 0;

  constructor() {
    this.originalFetch = global.fetch;
  }

  setFailureMode(mode: typeof this.failureMode, maxFailures = Infinity) {
    this.failureMode = mode;
    this.failureCount = 0;
    this.maxFailures = maxFailures;
    
    global.fetch = jest.fn().mockImplementation(async (url, options) => {
      if (this.failureCount < this.maxFailures && this.failureMode !== 'none') {
        this.failureCount++;
        
        switch (this.failureMode) {
          case 'timeout':
            return new Promise(() => {}); // Never resolves (timeout)
          
          case 'server-error':
            return {
              ok: false,
              status: 500,
              statusText: 'Internal Server Error',
              json: async () => ({ error: 'Internal Server Error', message: 'Registry temporarily unavailable' })
            };
          
          case 'network-error':
            throw new Error('Network connection failed');
          
          case 'partial-failure':
            if (this.failureCount % 2 === 0) {
              throw new Error('Intermittent network failure');
            }
            break;
        }
      }
      
      // Success case or after max failures
      return this.originalFetch.call(global, url, options);
    });
  }

  restore() {
    global.fetch = this.originalFetch;
    this.failureMode = 'none';
    this.failureCount = 0;
  }
}

describe('Registry Fallback and Degradation Tests', () => {
  const mockServer = new MockFailureServer();
  const TEST_AGENT_ID = 'amanda';
  const TIMEOUT_MS = 15000;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.USE_REGISTRY = 'true';
    featureFlags.setFlag('ENABLE_REGISTRY_SYNC', true);
    mockServer.restore();
  });

  afterEach(() => {
    mockServer.restore();
    registryHealthMonitor.stopMonitoring();
  });

  describe('Network Failure Handling', () => {
    it('should handle network connection failures gracefully', async () => {
      mockServer.setFailureMode('network-error');
      
      try {
        await registryClient.getAgent(TEST_AGENT_ID);
        fail('Should have thrown network error');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toContain('Network connection failed');
      }
    }, TIMEOUT_MS);

    it('should retry on network failures up to max retries', async () => {
      mockServer.setFailureMode('network-error', 2); // Fail first 2 requests
      
      // Should succeed on 3rd attempt (after 2 retries)
      const agent = await registryClient.getAgent(TEST_AGENT_ID);
      expect(agent).toBeDefined();
      expect(agent.id).toBe(TEST_AGENT_ID);
    }, TIMEOUT_MS);

    it('should fail after maximum retry attempts', async () => {
      mockServer.setFailureMode('network-error', 10); // More failures than max retries
      
      try {
        await registryClient.getAgent(TEST_AGENT_ID);
        fail('Should have thrown error after max retries');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toContain('Network connection failed');
      }
    }, TIMEOUT_MS);

    it('should handle timeout scenarios appropriately', async () => {
      mockServer.setFailureMode('timeout');
      
      try {
        await registryClient.getAgent(TEST_AGENT_ID);
        fail('Should have timed out');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toContain('timeout');
      }
    }, TIMEOUT_MS);
  });

  describe('Server Error Handling', () => {
    it('should handle 500 server errors gracefully', async () => {
      mockServer.setFailureMode('server-error');
      
      try {
        await registryClient.getAgent(TEST_AGENT_ID);
        fail('Should have thrown server error');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toContain('Registry temporarily unavailable');
      }
    }, TIMEOUT_MS);

    it('should retry on server errors', async () => {
      mockServer.setFailureMode('server-error', 2); // Server error for first 2 requests
      
      // Should succeed after retries
      const agent = await registryClient.getAgent(TEST_AGENT_ID);
      expect(agent).toBeDefined();
      expect(agent.id).toBe(TEST_AGENT_ID);
    }, TIMEOUT_MS);

    it('should provide appropriate error messages for different HTTP status codes', async () => {
      // Mock 404 response
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        json: async () => ({ error: 'Not Found', message: 'Agent not found' })
      });
      
      try {
        await registryClient.getAgent('non-existent-agent');
        fail('Should have thrown 404 error');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toContain('Agent not found');
      }
      
      mockServer.restore();
    }, TIMEOUT_MS);
  });

  describe('Partial Failure Recovery', () => {
    it('should handle intermittent failures', async () => {
      mockServer.setFailureMode('partial-failure', 3);
      
      // Make multiple requests - some should succeed despite intermittent failures
      const promises = Array.from({ length: 5 }, () => 
        registryClient.getAgent(TEST_AGENT_ID).catch(e => e)
      );
      
      const results = await Promise.allSettled(promises);
      const successes = results.filter(r => r.status === 'fulfilled');
      
      // At least some requests should succeed
      expect(successes.length).toBeGreaterThan(0);
    }, TIMEOUT_MS);

    it('should maintain service availability during Registry degradation', async () => {
      // Start health monitoring
      registryHealthMonitor.startMonitoring(500);
      
      // Simulate degraded Registry
      mockServer.setFailureMode('server-error', 3);
      
      // Wait for health monitor to detect issues
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const status = registryHealthMonitor.getStatus();
      expect(status.status).toMatch(/degraded|critical/);
      expect(status.consecutiveFailures).toBeGreaterThan(0);
      
      // Service should still attempt to function
      try {
        await registryClient.getAgent(TEST_AGENT_ID);
      } catch (error) {
        // Error is expected, but should be handled gracefully
        expect(error).toBeInstanceOf(Error);
      }
    }, 10000);
  });

  describe('Feature Flag Fallback Behavior', () => {
    it('should disable Registry access when ENABLE_REGISTRY_SYNC is false', async () => {
      featureFlags.setFlag('ENABLE_REGISTRY_SYNC', false);
      process.env.USE_REGISTRY = 'false';
      
      try {
        await registryClient.getAgent(TEST_AGENT_ID);
        fail('Should have thrown error when Registry is disabled');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toContain('Registry is not enabled');
      }
    }, TIMEOUT_MS);

    it('should handle feature flag transitions during operation', async () => {
      // Start with Registry enabled
      featureFlags.setFlag('ENABLE_REGISTRY_SYNC', true);
      
      const agent1 = await registryClient.getAgent(TEST_AGENT_ID);
      expect(agent1).toBeDefined();
      
      // Disable Registry mid-operation
      featureFlags.setFlag('ENABLE_REGISTRY_SYNC', false);
      process.env.USE_REGISTRY = 'false';
      
      try {
        await registryClient.getAgent(TEST_AGENT_ID);
        fail('Should have been disabled');
      } catch (error) {
        expect((error as Error).message).toContain('Registry is not enabled');
      }
      
      // Re-enable Registry
      featureFlags.setFlag('ENABLE_REGISTRY_SYNC', true);
      process.env.USE_REGISTRY = 'true';
      
      const agent2 = await registryClient.getAgent(TEST_AGENT_ID);
      expect(agent2).toBeDefined();
    }, TIMEOUT_MS);
  });

  describe('Health Monitor Fallback Logic', () => {
    it('should track consecutive failures and adjust status accordingly', async () => {
      registryHealthMonitor.startMonitoring(100); // Fast monitoring for testing
      
      mockServer.setFailureMode('network-error');
      
      // Wait for multiple health check failures
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const status = registryHealthMonitor.getStatus();
      expect(status.consecutiveFailures).toBeGreaterThan(2);
      expect(status.status).toMatch(/degraded|critical/);
      
      // Restore Registry
      mockServer.restore();
      
      // Wait for recovery
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const recoveredStatus = registryHealthMonitor.getStatus();
      expect(recoveredStatus.consecutiveFailures).toBe(0);
      expect(recoveredStatus.status).toBe('healthy');
    }, 5000);

    it('should provide fallback health metrics during failures', async () => {
      mockServer.setFailureMode('timeout');
      
      const healthResult = await registryHealthMonitor.performHealthCheck();
      
      expect(healthResult.success).toBe(false);
      expect(healthResult.error).toBeDefined();
      expect(healthResult.latency).toBeGreaterThan(0);
    }, TIMEOUT_MS);

    it('should enforce Registry requirement when health is critical', async () => {
      // Force critical status
      mockServer.setFailureMode('network-error');
      
      // Perform multiple failed checks to reach critical threshold
      for (let i = 0; i < 6; i++) {
        await registryHealthMonitor.performHealthCheck().catch(() => {});
      }
      
      const status = registryHealthMonitor.getStatus();
      expect(status.status).toBe('critical');
      
      // Should throw when enforcing requirement
      expect(() => {
        registryHealthMonitor.enforceRegistryRequirement();
      }).toThrow();
    }, TIMEOUT_MS);
  });

  describe('Data Consistency During Failures', () => {
    it('should maintain data integrity during partial failures', async () => {
      // Start a complex operation
      const agentsPromise = registryClient.getAgents();
      
      // Introduce failure mid-operation
      setTimeout(() => {
        mockServer.setFailureMode('server-error', 1);
      }, 100);
      
      try {
        const agents = await agentsPromise;
        // If successful, data should be complete and valid
        expect(Array.isArray(agents)).toBe(true);
        agents.forEach(agent => {
          expect(agent.id).toBeDefined();
          expect(agent.handle).toBeDefined();
          expect(agent.name).toBeDefined();
        });
      } catch (error) {
        // If failed, should fail cleanly without partial data
        expect(error).toBeInstanceOf(Error);
      }
    }, TIMEOUT_MS);

    it('should prevent data corruption during Registry unavailability', async () => {
      mockServer.setFailureMode('network-error');
      
      // Multiple concurrent requests during failure
      const promises = Array.from({ length: 3 }, () => 
        registryClient.getAgent(TEST_AGENT_ID).catch(e => e)
      );
      
      const results = await Promise.allSettled(promises);
      
      // All should fail consistently (no partial success that could corrupt state)
      results.forEach(result => {
        if (result.status === 'fulfilled') {
          // If any succeeded, should have complete valid data
          const agent = result.value;
          expect(agent.id).toBeDefined();
          expect(agent.handle).toBeDefined();
        } else {
          // If failed, should have proper error
          expect(result.reason).toBeInstanceOf(Error);
        }
      });
    }, TIMEOUT_MS);
  });

  describe('Recovery and Resilience', () => {
    it('should recover automatically when Registry comes back online', async () => {
      // Start with Registry failure
      mockServer.setFailureMode('network-error');
      
      try {
        await registryClient.getAgent(TEST_AGENT_ID);
        fail('Should have failed initially');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
      
      // Restore Registry
      mockServer.restore();
      
      // Should work immediately after restoration
      const agent = await registryClient.getAgent(TEST_AGENT_ID);
      expect(agent).toBeDefined();
      expect(agent.id).toBe(TEST_AGENT_ID);
    }, TIMEOUT_MS);

    it('should handle Registry performance degradation gracefully', async () => {
      // Mock slow responses
      global.fetch = jest.fn().mockImplementation(async (url, options) => {
        // Add 2-second delay to simulate slow Registry
        await new Promise(resolve => setTimeout(resolve, 2000));
        return mockServer.originalFetch.call(global, url, options);
      });
      
      const startTime = Date.now();
      const agent = await registryClient.getAgent(TEST_AGENT_ID);
      const endTime = Date.now();
      
      expect(agent).toBeDefined();
      expect(endTime - startTime).toBeGreaterThan(1000); // Should reflect the delay
      expect(endTime - startTime).toBeLessThan(15000); // But not timeout
      
      mockServer.restore();
    }, 20000);

    it('should provide meaningful error context for debugging', async () => {
      mockServer.setFailureMode('server-error');
      
      try {
        await registryClient.getAgent(TEST_AGENT_ID);
        fail('Should have thrown error');
      } catch (error) {
        const errorMessage = (error as Error).message;
        
        // Error should contain useful debugging information
        expect(errorMessage.length).toBeGreaterThan(10);
        expect(errorMessage).toMatch(/Registry|500|unavailable/i);
      }
    }, TIMEOUT_MS);
  });

  describe('Concurrent Request Handling During Failures', () => {
    it('should handle concurrent requests failing gracefully', async () => {
      mockServer.setFailureMode('network-error');
      
      const concurrentRequests = 10;
      const promises = Array.from({ length: concurrentRequests }, () => 
        registryClient.getAgent(TEST_AGENT_ID).catch(e => e)
      );
      
      const results = await Promise.allSettled(promises);
      
      // All should handle the failure consistently
      results.forEach(result => {
        expect(result.status).toBe('rejected');
      });
    }, TIMEOUT_MS);

    it('should maintain performance during partial failures', async () => {
      mockServer.setFailureMode('partial-failure', 5);
      
      const startTime = Date.now();
      const promises = Array.from({ length: 10 }, () => 
        registryClient.getAgent(TEST_AGENT_ID).catch(e => null)
      );
      
      const results = await Promise.all(promises);
      const endTime = Date.now();
      
      const successCount = results.filter(r => r !== null).length;
      const totalTime = endTime - startTime;
      
      // Some requests should succeed
      expect(successCount).toBeGreaterThan(0);
      
      // Total time should be reasonable despite failures
      expect(totalTime).toBeLessThan(30000); // Less than 30 seconds
    }, 35000);
  });
});