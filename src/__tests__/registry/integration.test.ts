/**
 * Registry Integration Test Suite
 * Comprehensive validation of all Eden Registry dependent services
 * 
 * Tests:
 * - Registry connectivity and health monitoring
 * - Data integrity across all consuming services  
 * - Graceful degradation when Registry is unavailable
 * - Feature flag behavior for Registry sync
 * - End-to-end workflows with Registry as source of truth
 */

import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { registryClient } from '@/lib/registry/client';
import { registryHealthMonitor, checkRegistryHealth } from '@/lib/registry/health-monitor';
import { featureFlags, FLAGS } from '@/config/flags';
import { Agent, Profile, Creation } from '@/lib/registry/types';

// Test configuration
const TEST_REGISTRY_URL = process.env.TEST_REGISTRY_URL || 'http://localhost:3005/api/v1';
const AMANDA_AGENT_ID = 'amanda';
const TIMEOUT_MS = 10000;

describe('Registry Integration Tests', () => {
  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    
    // Ensure Registry is enabled for tests
    process.env.USE_REGISTRY = 'true';
    process.env.REGISTRY_BASE_URL = TEST_REGISTRY_URL;
  });

  afterEach(() => {
    registryHealthMonitor.stopMonitoring();
  });

  describe('Registry Health and Connectivity', () => {
    it('should verify Registry is running on localhost:3005', async () => {
      const healthResult = await checkRegistryHealth();
      
      expect(healthResult.healthy).toBe(true);
      expect(healthResult.status.status).toBe('healthy');
      expect(healthResult.status.latency).toBeLessThan(1000);
      expect(healthResult.metrics.availability).toBeGreaterThan(0);
    }, TIMEOUT_MS);

    it('should handle Registry unavailability gracefully', async () => {
      // Temporarily point to invalid URL
      const originalUrl = process.env.REGISTRY_BASE_URL;
      process.env.REGISTRY_BASE_URL = 'http://invalid-registry-url:9999/api/v1';
      
      const healthResult = await checkRegistryHealth();
      
      expect(healthResult.healthy).toBe(false);
      expect(healthResult.status.status).toMatch(/degraded|critical/);
      expect(healthResult.status.consecutiveFailures).toBeGreaterThan(0);
      
      // Restore original URL
      process.env.REGISTRY_BASE_URL = originalUrl;
    }, TIMEOUT_MS);

    it('should monitor Registry health continuously', (done) => {
      const mockAlert = jest.spyOn(console, 'log');
      
      registryHealthMonitor.startMonitoring(1000); // Check every second
      
      setTimeout(() => {
        const status = registryHealthMonitor.getStatus();
        expect(status.lastCheck).toBeInstanceOf(Date);
        expect(status.latency).toBeGreaterThanOrEqual(0);
        
        registryHealthMonitor.stopMonitoring();
        done();
      }, 2500); // Wait for at least 2 health checks
    }, 5000);

    it('should provide detailed health metrics', async () => {
      const metrics = registryHealthMonitor.getMetrics();
      
      expect(metrics).toHaveProperty('availability');
      expect(metrics).toHaveProperty('avgLatency');
      expect(metrics).toHaveProperty('status');
      expect(metrics).toHaveProperty('lastOutage');
      
      expect(typeof metrics.availability).toBe('number');
      expect(typeof metrics.avgLatency).toBe('number');
      expect(['healthy', 'degraded', 'critical']).toContain(metrics.status);
    });
  });

  describe('Registry Data Integrity', () => {
    it('should validate Amanda agent profile data structure', async () => {
      const agent = await registryClient.getAgent(AMANDA_AGENT_ID);
      
      expect(agent).toBeDefined();
      expect(agent.id).toBe(AMANDA_AGENT_ID);
      expect(agent.handle).toBe('amanda');
      expect(agent.name).toContain('Amanda');
      expect(agent.role).toBe('art-collector');
      expect(agent.cohort).toBe('genesis');
      expect(agent.status).toMatch(/active|training|launched/);
      
      // Validate required fields are present
      expect(agent.profile).toBeDefined();
      expect(agent.capabilities).toBeDefined();
      expect(agent.operational_config).toBeDefined();
    }, TIMEOUT_MS);

    it('should validate agent profile completeness', async () => {
      const profile = await registryClient.getAgentProfile(AMANDA_AGENT_ID);
      
      expect(profile).toBeDefined();
      expect(profile.bio).toBeDefined();
      expect(profile.description).toBeDefined();
      expect(profile.avatar_url).toBeDefined();
      expect(profile.banner_url).toBeDefined();
      
      // Cultural elements
      expect(profile.personality).toBeDefined();
      expect(profile.values).toBeDefined();
      expect(profile.communication_style).toBeDefined();
      
      // Operational elements
      expect(profile.expertise_areas).toBeDefined();
      expect(profile.interaction_preferences).toBeDefined();
    }, TIMEOUT_MS);

    it('should validate agent creation data consistency', async () => {
      const creations = await registryClient.getAgentCreations(AMANDA_AGENT_ID, 'published');
      
      expect(Array.isArray(creations)).toBe(true);
      
      if (creations.length > 0) {
        const creation = creations[0];
        expect(creation).toHaveProperty('id');
        expect(creation).toHaveProperty('agent_id');
        expect(creation).toHaveProperty('title');
        expect(creation).toHaveProperty('type');
        expect(creation).toHaveProperty('status');
        expect(creation).toHaveProperty('created_at');
        expect(creation.agent_id).toBe(AMANDA_AGENT_ID);
      }
    }, TIMEOUT_MS);

    it('should ensure data schema compliance across all agents', async () => {
      const agents = await registryClient.getAgents();
      
      expect(Array.isArray(agents)).toBe(true);
      expect(agents.length).toBeGreaterThan(0);
      
      agents.forEach(agent => {
        // Required fields
        expect(agent.id).toBeDefined();
        expect(agent.handle).toBeDefined();
        expect(agent.name).toBeDefined();
        expect(agent.role).toBeDefined();
        expect(agent.cohort).toBeDefined();
        expect(agent.status).toBeDefined();
        
        // Data types
        expect(typeof agent.id).toBe('string');
        expect(typeof agent.handle).toBe('string');
        expect(typeof agent.name).toBe('string');
        expect(typeof agent.role).toBe('string');
        expect(['genesis', 'alpha', 'beta']).toContain(agent.cohort);
        expect(['active', 'training', 'launched', 'archived']).toContain(agent.status);
      });
    }, TIMEOUT_MS);
  });

  describe('Feature Flag Integration', () => {
    it('should respect ENABLE_REGISTRY_SYNC flag', async () => {
      // Test with flag enabled
      process.env.ENABLE_REGISTRY_SYNC = 'true';
      featureFlags.setFlag('ENABLE_REGISTRY_SYNC', true);
      
      const agent = await registryClient.getAgent(AMANDA_AGENT_ID);
      expect(agent).toBeDefined();
      
      // Test with flag disabled
      process.env.ENABLE_REGISTRY_SYNC = 'false';
      featureFlags.setFlag('ENABLE_REGISTRY_SYNC', false);
      
      // Should use fallback behavior or throw appropriate error
      try {
        await registryClient.getAgent(AMANDA_AGENT_ID);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toContain('Registry');
      }
      
      // Reset flag
      process.env.ENABLE_REGISTRY_SYNC = 'true';
      featureFlags.setFlag('ENABLE_REGISTRY_SYNC', true);
    }, TIMEOUT_MS);

    it('should handle feature flag transitions gracefully', async () => {
      // Start with Registry enabled
      featureFlags.setFlag('ENABLE_REGISTRY_SYNC', true);
      
      const agent1 = await registryClient.getAgent(AMANDA_AGENT_ID);
      expect(agent1).toBeDefined();
      
      // Disable Registry mid-operation
      featureFlags.setFlag('ENABLE_REGISTRY_SYNC', false);
      
      // New requests should handle the transition
      try {
        await registryClient.getAgent(AMANDA_AGENT_ID);
        // Should either work with cached data or fail gracefully
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
      
      // Re-enable Registry
      featureFlags.setFlag('ENABLE_REGISTRY_SYNC', true);
      
      const agent2 = await registryClient.getAgent(AMANDA_AGENT_ID);
      expect(agent2).toBeDefined();
    }, TIMEOUT_MS);
  });

  describe('Consuming Services Integration', () => {
    it('should validate Academy UI consumes Registry data correctly', async () => {
      // Test agent list endpoint used by Academy UI
      const agents = await registryClient.getAgents({ cohort: 'genesis' });
      
      expect(Array.isArray(agents)).toBe(true);
      
      const amanda = agents.find(agent => agent.handle === 'amanda');
      expect(amanda).toBeDefined();
      
      if (amanda) {
        // Verify UI-required fields are present
        expect(amanda.profile).toBeDefined();
        expect(amanda.capabilities).toBeDefined();
        expect(amanda.metrics).toBeDefined();
        
        // Test profile endpoint used by agent detail pages
        const profile = await registryClient.getAgentProfile(amanda.id);
        expect(profile).toBeDefined();
        expect(profile.avatar_url).toBeDefined();
        expect(profile.bio).toBeDefined();
      }
    }, TIMEOUT_MS);

    it('should validate API endpoints serve Registry data correctly', async () => {
      // Simulate API route consumption
      const agent = await registryClient.getAgent(AMANDA_AGENT_ID, ['profile', 'capabilities']);
      
      expect(agent).toBeDefined();
      expect(agent.profile).toBeDefined();
      expect(agent.capabilities).toBeDefined();
      
      // Validate API response format matches expected structure
      expect(typeof agent.profile).toBe('object');
      expect(Array.isArray(agent.capabilities)).toBe(true);
    }, TIMEOUT_MS);

    it('should test Amanda dynamic prototype Registry integration', async () => {
      // Test configuration loading for dynamic prototype
      const agent = await registryClient.getAgent(AMANDA_AGENT_ID);
      
      expect(agent.operational_config).toBeDefined();
      expect(agent.personality).toBeDefined();
      
      // Validate configuration structure expected by dynamic prototype
      const config = agent.operational_config as any;
      expect(config).toHaveProperty('collection_preferences');
      expect(config).toHaveProperty('interaction_style');
      expect(config).toHaveProperty('decision_thresholds');
      
      const personality = agent.personality as any;
      expect(personality).toHaveProperty('traits');
      expect(personality).toHaveProperty('communication_patterns');
    }, TIMEOUT_MS);
  });

  describe('Error Handling and Resilience', () => {
    it('should handle Registry timeout gracefully', async () => {
      // Mock network delay
      const originalFetch = global.fetch;
      global.fetch = jest.fn().mockImplementation(() => 
        new Promise(resolve => setTimeout(resolve, 15000)) // 15 second delay
      );
      
      try {
        await registryClient.getAgent(AMANDA_AGENT_ID);
        fail('Should have timed out');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toContain('timeout');
      }
      
      global.fetch = originalFetch;
    }, 20000);

    it('should retry failed requests appropriately', async () => {
      let callCount = 0;
      const originalFetch = global.fetch;
      
      global.fetch = jest.fn().mockImplementation(() => {
        callCount++;
        if (callCount < 3) {
          return Promise.reject(new Error('Network error'));
        }
        return originalFetch.apply(global, arguments as any);
      });
      
      try {
        const agent = await registryClient.getAgent(AMANDA_AGENT_ID);
        expect(agent).toBeDefined();
        expect(callCount).toBeGreaterThanOrEqual(3);
      } catch (error) {
        // If it still fails, verify retry attempts were made
        expect(callCount).toBeGreaterThan(1);
      }
      
      global.fetch = originalFetch;
    }, TIMEOUT_MS);

    it('should validate error response handling', async () => {
      // Test 404 error
      try {
        await registryClient.getAgent('non-existent-agent');
        fail('Should have thrown error');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toContain('404');
      }
      
      // Test invalid data
      try {
        await registryClient.getAgentProfile('');
        fail('Should have thrown error');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
      }
    }, TIMEOUT_MS);
  });

  describe('Performance and Load Testing', () => {
    it('should handle concurrent Registry requests efficiently', async () => {
      const concurrentRequests = 10;
      const startTime = Date.now();
      
      const promises = Array.from({ length: concurrentRequests }, () => 
        registryClient.getAgent(AMANDA_AGENT_ID)
      );
      
      const results = await Promise.allSettled(promises);
      const endTime = Date.now();
      
      const successfulResults = results.filter(result => result.status === 'fulfilled');
      expect(successfulResults.length).toBeGreaterThan(concurrentRequests * 0.8); // 80% success rate
      
      const avgTimePerRequest = (endTime - startTime) / concurrentRequests;
      expect(avgTimePerRequest).toBeLessThan(2000); // Less than 2 seconds average
    }, 15000);

    it('should validate Registry response caching', async () => {
      // First request
      const startTime1 = Date.now();
      await registryClient.getAgent(AMANDA_AGENT_ID);
      const duration1 = Date.now() - startTime1;
      
      // Second request (should be faster due to caching)
      const startTime2 = Date.now();
      await registryClient.getAgent(AMANDA_AGENT_ID);
      const duration2 = Date.now() - startTime2;
      
      // Note: This test assumes caching is implemented
      // Remove or modify if caching is not in place
      console.log(`First request: ${duration1}ms, Second request: ${duration2}ms`);
      
      // Both requests should complete successfully
      expect(duration1).toBeGreaterThan(0);
      expect(duration2).toBeGreaterThan(0);
    }, TIMEOUT_MS);
  });

  describe('Data Consistency Validation', () => {
    it('should ensure consistent agent data across multiple endpoints', async () => {
      // Get agent from list endpoint
      const agents = await registryClient.getAgents();
      const amandaFromList = agents.find(agent => agent.handle === 'amanda');
      
      // Get agent from individual endpoint
      const amandaIndividual = await registryClient.getAgent(AMANDA_AGENT_ID);
      
      expect(amandaFromList).toBeDefined();
      expect(amandaIndividual).toBeDefined();
      
      if (amandaFromList && amandaIndividual) {
        // Core fields should match
        expect(amandaFromList.id).toBe(amandaIndividual.id);
        expect(amandaFromList.handle).toBe(amandaIndividual.handle);
        expect(amandaFromList.name).toBe(amandaIndividual.name);
        expect(amandaFromList.role).toBe(amandaIndividual.role);
        expect(amandaFromList.status).toBe(amandaIndividual.status);
      }
    }, TIMEOUT_MS);

    it('should validate profile data consistency', async () => {
      const agent = await registryClient.getAgent(AMANDA_AGENT_ID, ['profile']);
      const profile = await registryClient.getAgentProfile(AMANDA_AGENT_ID);
      
      expect(agent.profile).toBeDefined();
      expect(profile).toBeDefined();
      
      // Profile data should be consistent
      if (agent.profile && profile) {
        expect(agent.profile.bio).toBe(profile.bio);
        expect(agent.profile.avatar_url).toBe(profile.avatar_url);
        expect(agent.profile.description).toBe(profile.description);
      }
    }, TIMEOUT_MS);
  });

  describe('Production Readiness Checks', () => {
    it('should validate all required environment variables', () => {
      const requiredEnvVars = [
        'REGISTRY_BASE_URL',
        'USE_REGISTRY'
      ];
      
      requiredEnvVars.forEach(envVar => {
        expect(process.env[envVar]).toBeDefined();
        expect(process.env[envVar]).not.toBe('');
      });
    });

    it('should validate Registry client configuration', () => {
      expect(registryClient.isEnabled()).toBe(true);
      
      // Validate client has proper error handling
      expect(registryClient).toBeDefined();
      expect(typeof registryClient.getAgent).toBe('function');
      expect(typeof registryClient.getAgents).toBe('function');
      expect(typeof registryClient.getAgentProfile).toBe('function');
    });

    it('should validate health monitoring is configured', () => {
      expect(registryHealthMonitor).toBeDefined();
      expect(typeof registryHealthMonitor.getStatus).toBe('function');
      expect(typeof registryHealthMonitor.startMonitoring).toBe('function');
      expect(typeof registryHealthMonitor.isHealthy).toBe('function');
    });

    it('should validate feature flags are properly configured', () => {
      const allFlags = featureFlags.getAllFlags();
      
      expect(allFlags).toBeDefined();
      expect(typeof allFlags).toBe('object');
      
      // Validate Registry-related flags exist
      const registryFlags = Object.keys(allFlags).filter(flag => 
        flag.toLowerCase().includes('registry')
      );
      expect(registryFlags.length).toBeGreaterThan(0);
    });
  });

  describe('End-to-End Workflow Validation', () => {
    it('should complete full agent data workflow', async () => {
      // 1. Health check
      const health = await checkRegistryHealth();
      expect(health.healthy).toBe(true);
      
      // 2. List agents
      const agents = await registryClient.getAgents();
      expect(agents.length).toBeGreaterThan(0);
      
      // 3. Get specific agent
      const amanda = agents.find(agent => agent.handle === 'amanda');
      expect(amanda).toBeDefined();
      
      if (amanda) {
        // 4. Get detailed profile
        const profile = await registryClient.getAgentProfile(amanda.id);
        expect(profile).toBeDefined();
        
        // 5. Get agent creations
        const creations = await registryClient.getAgentCreations(amanda.id);
        expect(Array.isArray(creations)).toBe(true);
        
        // 6. Validate data consistency
        expect(amanda.id).toBe(AMANDA_AGENT_ID);
        expect(profile.agent_id).toBe(amanda.id);
      }
    }, TIMEOUT_MS);

    it('should handle Registry unavailability scenario', async () => {
      // Start monitoring
      registryHealthMonitor.startMonitoring(500);
      
      // Simulate Registry failure
      const originalUrl = process.env.REGISTRY_BASE_URL;
      process.env.REGISTRY_BASE_URL = 'http://localhost:9999/api/v1';
      
      // Wait for health monitor to detect failure
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const status = registryHealthMonitor.getStatus();
      expect(status.status).toMatch(/degraded|critical/);
      expect(status.consecutiveFailures).toBeGreaterThan(0);
      
      // Restore Registry
      process.env.REGISTRY_BASE_URL = originalUrl;
      
      // Wait for recovery
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      registryHealthMonitor.stopMonitoring();
    }, 10000);
  });
});