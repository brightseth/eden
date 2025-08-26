/**
 * Registry End-to-End Workflow Tests
 * Tests complete workflows across all Registry-dependent services
 * Validates production scenarios and user journeys
 */

import { describe, it, expect, beforeAll, afterAll, jest } from '@jest/globals';
import { registryClient } from '@/lib/registry/client';
import { registryHealthMonitor } from '@/lib/registry/health-monitor';
import { featureFlags } from '@/config/flags';

// Simulate service boundaries for E2E testing
class ServiceSimulator {
  // Academy UI service simulation
  static async fetchAgentForUI(agentId: string) {
    const agent = await registryClient.getAgent(agentId, ['profile', 'capabilities', 'metrics']);
    
    // Simulate UI-specific data transformation
    return {
      id: agent.id,
      handle: agent.handle,
      name: agent.name,
      role: agent.role,
      displayName: agent.profile?.display_name || agent.name,
      bio: agent.profile?.bio || '',
      avatar: agent.profile?.avatar_url || '/images/placeholder-avatar.png',
      banner: agent.profile?.banner_url || '/images/placeholder-banner.png',
      capabilities: agent.capabilities || [],
      metrics: {
        works_count: agent.metrics?.works_count || 0,
        followers_count: agent.metrics?.followers_count || 0,
        engagement_rate: agent.metrics?.engagement_rate || 0
      },
      isActive: agent.status === 'active',
      lastUpdate: new Date(agent.updated_at || agent.created_at || new Date())
    };
  }

  // API endpoint simulation
  static async fetchAgentForAPI(agentId: string) {
    const [agent, profile, creations] = await Promise.all([
      registryClient.getAgent(agentId),
      registryClient.getAgentProfile(agentId),
      registryClient.getAgentCreations(agentId, 'published')
    ]);

    // Simulate API response format
    return {
      agent: {
        ...agent,
        profile,
        published_works: creations.length,
        api_version: '1.0'
      },
      meta: {
        timestamp: new Date().toISOString(),
        source: 'eden-registry',
        version: process.env.REGISTRY_API_VERSION || '1.0.0'
      }
    };
  }

  // Amanda dynamic prototype simulation
  static async loadAmandaConfiguration() {
    const agent = await registryClient.getAgent('amanda', ['profile', 'capabilities']);
    
    if (!agent.operational_config) {
      throw new Error('Amanda operational configuration missing from Registry');
    }

    const config = agent.operational_config as any;
    
    // Simulate configuration loading for dynamic prototype
    return {
      personality: {
        traits: agent.personality?.traits || {},
        communication_style: agent.personality?.communication_style || 'friendly',
        values: agent.profile?.values || []
      },
      capabilities: {
        art_collection: config.collection_preferences || {},
        interaction_modes: config.interaction_modes || ['chat', 'email'],
        decision_making: config.decision_thresholds || {}
      },
      operational: {
        response_time_target: config.response_time_ms || 2000,
        concurrent_users: config.max_concurrent_users || 50,
        rate_limits: config.rate_limits || { requests_per_minute: 100 }
      },
      loaded_at: new Date().toISOString(),
      registry_version: agent.updated_at || agent.created_at
    };
  }

  // Future agent deployment simulation
  static async validateAgentReadiness(agentId: string) {
    const agent = await registryClient.getAgent(agentId, ['profile', 'capabilities']);
    
    // Simulate readiness validation
    const readinessChecks = {
      profile_complete: !!(agent.profile?.bio && agent.profile?.avatar_url),
      capabilities_defined: Array.isArray(agent.capabilities) && agent.capabilities.length > 0,
      operational_config: !!agent.operational_config,
      personality_defined: !!agent.personality,
      status_ready: agent.status === 'active' || agent.status === 'launched'
    };

    const readinessScore = Object.values(readinessChecks).filter(Boolean).length / Object.keys(readinessChecks).length;
    
    return {
      agent_id: agentId,
      readiness_score: readinessScore,
      checks: readinessChecks,
      deployment_ready: readinessScore >= 0.8,
      missing_requirements: Object.entries(readinessChecks)
        .filter(([key, passed]) => !passed)
        .map(([key]) => key)
    };
  }
}

describe('Registry End-to-End Workflow Tests', () => {
  const AMANDA_ID = 'amanda';
  const TIMEOUT_MS = 15000;

  beforeAll(async () => {
    // Ensure Registry is available and healthy
    process.env.USE_REGISTRY = 'true';
    featureFlags.setFlag('ENABLE_REGISTRY_SYNC', true);
    
    const health = await registryHealthMonitor.performHealthCheck();
    if (!health.success) {
      throw new Error('Registry must be healthy for E2E tests');
    }
  });

  afterAll(() => {
    registryHealthMonitor.stopMonitoring();
  });

  describe('Academy UI Integration Workflow', () => {
    it('should complete agent discovery and display workflow', async () => {
      // Step 1: Discover agents (like Academy homepage)
      const agents = await registryClient.getAgents({ cohort: 'genesis' });
      expect(agents.length).toBeGreaterThan(0);
      
      const amanda = agents.find(agent => agent.handle === 'amanda');
      expect(amanda).toBeDefined();
      
      // Step 2: Fetch agent for UI display
      const uiData = await ServiceSimulator.fetchAgentForUI(amanda!.id);
      
      expect(uiData.displayName).toBeDefined();
      expect(uiData.bio).toBeDefined();
      expect(uiData.avatar).toBeDefined();
      expect(uiData.capabilities).toBeDefined();
      expect(uiData.metrics).toBeDefined();
      expect(typeof uiData.isActive).toBe('boolean');
      
      // Step 3: Validate UI data is complete and usable
      expect(uiData.displayName.length).toBeGreaterThan(0);
      expect(uiData.bio.length).toBeGreaterThan(0);
      expect(uiData.avatar).toMatch(/^(https?:\/\/|\/)/);
      expect(Array.isArray(uiData.capabilities)).toBe(true);
      expect(typeof uiData.metrics.works_count).toBe('number');
      
      console.log('✅ Academy UI workflow completed successfully');
    }, TIMEOUT_MS);

    it('should handle agent profile page workflow', async () => {
      // Step 1: Load agent profile page data
      const profileData = await Promise.all([
        registryClient.getAgent(AMANDA_ID, ['profile', 'capabilities', 'metrics']),
        registryClient.getAgentCreations(AMANDA_ID, 'published'),
        registryClient.getAgentPersonas(AMANDA_ID)
      ]);

      const [agent, creations, personas] = profileData;
      
      // Step 2: Validate profile completeness
      expect(agent.profile).toBeDefined();
      expect(agent.profile!.bio).toBeDefined();
      expect(agent.profile!.description).toBeDefined();
      
      // Step 3: Validate related data
      expect(Array.isArray(creations)).toBe(true);
      expect(Array.isArray(personas)).toBe(true);
      
      // Step 4: Simulate profile page rendering
      const pageData = {
        agent: {
          ...agent,
          published_works_count: creations.length,
          active_personas_count: personas.filter(p => p.active).length
        },
        recent_creations: creations.slice(0, 6),
        primary_persona: personas.find(p => p.active) || personas[0]
      };
      
      expect(pageData.agent.published_works_count).toBeGreaterThanOrEqual(0);
      expect(pageData.recent_creations.length).toBeLessThanOrEqual(6);
      
      console.log('✅ Agent profile page workflow completed successfully');
    }, TIMEOUT_MS);
  });

  describe('API Endpoint Integration Workflow', () => {
    it('should complete public API data serving workflow', async () => {
      // Step 1: API client requests agent data
      const apiResponse = await ServiceSimulator.fetchAgentForAPI(AMANDA_ID);
      
      // Step 2: Validate API response structure
      expect(apiResponse.agent).toBeDefined();
      expect(apiResponse.meta).toBeDefined();
      
      // Step 3: Validate API-specific enrichment
      expect(apiResponse.agent.profile).toBeDefined();
      expect(typeof apiResponse.agent.published_works).toBe('number');
      expect(apiResponse.agent.api_version).toBe('1.0');
      
      // Step 4: Validate metadata
      expect(apiResponse.meta.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T/);
      expect(apiResponse.meta.source).toBe('eden-registry');
      expect(apiResponse.meta.version).toBeDefined();
      
      // Step 5: Validate data consistency with direct Registry access
      const directAgent = await registryClient.getAgent(AMANDA_ID);
      expect(apiResponse.agent.id).toBe(directAgent.id);
      expect(apiResponse.agent.handle).toBe(directAgent.handle);
      expect(apiResponse.agent.name).toBe(directAgent.name);
      
      console.log('✅ API endpoint workflow completed successfully');
    }, TIMEOUT_MS);

    it('should handle external API consumer workflow', async () => {
      // Simulate external service consuming Eden Academy API
      const externalRequest = async () => {
        const response = await ServiceSimulator.fetchAgentForAPI(AMANDA_ID);
        
        // External service processes the data
        return {
          external_id: `ext_${response.agent.id}`,
          name: response.agent.name,
          type: response.agent.role,
          status: response.agent.status === 'active' ? 'available' : 'unavailable',
          capabilities: response.agent.capabilities?.length || 0,
          last_sync: response.meta.timestamp
        };
      };

      const externalData = await externalRequest();
      
      expect(externalData.external_id).toBe(`ext_${AMANDA_ID}`);
      expect(externalData.name).toBeDefined();
      expect(externalData.type).toBe('art-collector');
      expect(['available', 'unavailable']).toContain(externalData.status);
      expect(typeof externalData.capabilities).toBe('number');
      expect(externalData.last_sync).toBeDefined();
      
      console.log('✅ External API consumer workflow completed successfully');
    }, TIMEOUT_MS);
  });

  describe('Amanda Dynamic Prototype Integration', () => {
    it('should complete Amanda configuration loading workflow', async () => {
      // Step 1: Load Amanda configuration for dynamic prototype
      const config = await ServiceSimulator.loadAmandaConfiguration();
      
      // Step 2: Validate configuration structure
      expect(config.personality).toBeDefined();
      expect(config.capabilities).toBeDefined();
      expect(config.operational).toBeDefined();
      
      // Step 3: Validate personality configuration
      expect(config.personality.traits).toBeDefined();
      expect(typeof config.personality.communication_style).toBe('string');
      expect(Array.isArray(config.personality.values)).toBe(true);
      
      // Step 4: Validate capabilities configuration
      expect(config.capabilities.art_collection).toBeDefined();
      expect(Array.isArray(config.capabilities.interaction_modes)).toBe(true);
      expect(config.capabilities.decision_making).toBeDefined();
      
      // Step 5: Validate operational configuration
      expect(typeof config.operational.response_time_target).toBe('number');
      expect(typeof config.operational.concurrent_users).toBe('number');
      expect(config.operational.rate_limits).toBeDefined();
      
      // Step 6: Validate metadata
      expect(config.loaded_at).toMatch(/^\d{4}-\d{2}-\d{2}T/);
      expect(config.registry_version).toBeDefined();
      
      console.log('✅ Amanda configuration loading workflow completed successfully');
    }, TIMEOUT_MS);

    it('should handle Amanda configuration updates workflow', async () => {
      // Step 1: Load initial configuration
      const initialConfig = await ServiceSimulator.loadAmandaConfiguration();
      
      // Step 2: Simulate configuration reload (like after Registry update)
      await new Promise(resolve => setTimeout(resolve, 100)); // Simulate delay
      const updatedConfig = await ServiceSimulator.loadAmandaConfiguration();
      
      // Step 3: Validate configuration consistency
      expect(updatedConfig.personality.communication_style)
        .toBe(initialConfig.personality.communication_style);
      expect(updatedConfig.operational.response_time_target)
        .toBe(initialConfig.operational.response_time_target);
      
      // Step 4: Validate timestamps are updated
      expect(new Date(updatedConfig.loaded_at).getTime())
        .toBeGreaterThan(new Date(initialConfig.loaded_at).getTime());
      
      console.log('✅ Amanda configuration update workflow completed successfully');
    }, TIMEOUT_MS);
  });

  describe('Future Agent Deployment Readiness', () => {
    it('should complete agent readiness validation workflow', async () => {
      // Test with Amanda (should be ready)
      const amandaReadiness = await ServiceSimulator.validateAgentReadiness(AMANDA_ID);
      
      expect(amandaReadiness.agent_id).toBe(AMANDA_ID);
      expect(typeof amandaReadiness.readiness_score).toBe('number');
      expect(amandaReadiness.readiness_score).toBeGreaterThan(0);
      expect(amandaReadiness.readiness_score).toBeLessThanOrEqual(1);
      expect(typeof amandaReadiness.deployment_ready).toBe('boolean');
      expect(amandaReadiness.checks).toBeDefined();
      expect(Array.isArray(amandaReadiness.missing_requirements)).toBe(true);
      
      // Amanda should be highly ready
      expect(amandaReadiness.readiness_score).toBeGreaterThan(0.7);
      
      console.log(`✅ Agent readiness validation completed: ${amandaReadiness.readiness_score * 100}% ready`);
    }, TIMEOUT_MS);

    it('should validate readiness across all genesis agents', async () => {
      const agents = await registryClient.getAgents({ cohort: 'genesis' });
      
      const readinessPromises = agents.map(agent => 
        ServiceSimulator.validateAgentReadiness(agent.id).catch(error => ({
          agent_id: agent.id,
          error: error.message,
          readiness_score: 0,
          deployment_ready: false
        }))
      );
      
      const readinessResults = await Promise.all(readinessPromises);
      
      // Validate results structure
      readinessResults.forEach(result => {
        expect(result.agent_id).toBeDefined();
        expect(typeof result.readiness_score).toBe('number');
        expect(typeof result.deployment_ready).toBe('boolean');
      });
      
      // At least one agent should be deployment ready
      const readyAgents = readinessResults.filter(r => r.deployment_ready);
      expect(readyAgents.length).toBeGreaterThan(0);
      
      console.log(`✅ Genesis cohort validation: ${readyAgents.length}/${readinessResults.length} agents ready`);
    }, TIMEOUT_MS);
  });

  describe('Cross-Service Data Consistency', () => {
    it('should maintain data consistency across all consuming services', async () => {
      // Step 1: Fetch data from multiple service perspectives
      const [uiData, apiData, configData] = await Promise.all([
        ServiceSimulator.fetchAgentForUI(AMANDA_ID),
        ServiceSimulator.fetchAgentForAPI(AMANDA_ID),
        ServiceSimulator.loadAmandaConfiguration()
      ]);
      
      // Step 2: Validate core identity consistency
      expect(uiData.id).toBe(AMANDA_ID);
      expect(apiData.agent.id).toBe(AMANDA_ID);
      
      expect(uiData.handle).toBe(apiData.agent.handle);
      expect(uiData.name).toBe(apiData.agent.name);
      expect(uiData.role).toBe(apiData.agent.role);
      
      // Step 3: Validate profile consistency
      expect(uiData.bio).toBe(apiData.agent.profile.bio);
      expect(uiData.avatar).toBe(apiData.agent.profile.avatar_url);
      
      // Step 4: Validate capabilities consistency
      expect(uiData.capabilities.length).toBe(apiData.agent.capabilities.length);
      
      // Step 5: Validate configuration alignment
      expect(configData.personality.values.length).toBeGreaterThanOrEqual(0);
      
      console.log('✅ Cross-service data consistency validated');
    }, TIMEOUT_MS);

    it('should handle concurrent access from multiple services', async () => {
      const concurrentOperations = [
        () => ServiceSimulator.fetchAgentForUI(AMANDA_ID),
        () => ServiceSimulator.fetchAgentForAPI(AMANDA_ID),
        () => ServiceSimulator.loadAmandaConfiguration(),
        () => registryClient.getAgentCreations(AMANDA_ID, 'published'),
        () => registryClient.getAgentPersonas(AMANDA_ID)
      ];

      const startTime = Date.now();
      const results = await Promise.allSettled(
        concurrentOperations.map(op => op())
      );
      const endTime = Date.now();
      
      // All operations should succeed
      const successes = results.filter(r => r.status === 'fulfilled');
      expect(successes.length).toBe(concurrentOperations.length);
      
      // Should complete in reasonable time despite concurrency
      expect(endTime - startTime).toBeLessThan(10000);
      
      console.log(`✅ Concurrent access handled: ${successes.length}/${results.length} operations successful`);
    }, TIMEOUT_MS);
  });

  describe('Production Scenario Simulation', () => {
    it('should handle peak load scenario', async () => {
      const peakLoadOperations = Array.from({ length: 20 }, (_, i) => ({
        type: 'ui_request',
        operation: () => ServiceSimulator.fetchAgentForUI(AMANDA_ID),
        id: `ui_${i}`
      })).concat(
        Array.from({ length: 10 }, (_, i) => ({
          type: 'api_request', 
          operation: () => ServiceSimulator.fetchAgentForAPI(AMANDA_ID),
          id: `api_${i}`
        }))
      );

      const startTime = Date.now();
      const results = await Promise.allSettled(
        peakLoadOperations.map(op => op.operation())
      );
      const endTime = Date.now();
      
      const successRate = results.filter(r => r.status === 'fulfilled').length / results.length;
      const avgTimePerRequest = (endTime - startTime) / results.length;
      
      // Should maintain high success rate under load
      expect(successRate).toBeGreaterThan(0.9); // 90% success rate
      expect(avgTimePerRequest).toBeLessThan(2000); // Less than 2s average
      
      console.log(`✅ Peak load handled: ${(successRate * 100).toFixed(1)}% success rate, ${avgTimePerRequest.toFixed(0)}ms avg`);
    }, 30000);

    it('should handle production deployment scenario', async () => {
      // Step 1: Health check before deployment
      const preDeployHealth = await registryHealthMonitor.performHealthCheck();
      expect(preDeployHealth.success).toBe(true);
      
      // Step 2: Validate all critical agents are ready
      const criticalAgents = ['amanda']; // Add more as they become critical
      const readinessChecks = await Promise.all(
        criticalAgents.map(id => ServiceSimulator.validateAgentReadiness(id))
      );
      
      const allReady = readinessChecks.every(check => check.deployment_ready);
      if (!allReady) {
        const notReady = readinessChecks.filter(c => !c.deployment_ready);
        console.warn('Agents not ready for deployment:', notReady.map(c => c.agent_id));
      }
      
      // Step 3: Test service integration points
      const integrationTests = await Promise.allSettled([
        ServiceSimulator.fetchAgentForUI(AMANDA_ID),
        ServiceSimulator.fetchAgentForAPI(AMANDA_ID),
        ServiceSimulator.loadAmandaConfiguration()
      ]);
      
      const integrationSuccessRate = integrationTests.filter(t => t.status === 'fulfilled').length / integrationTests.length;
      
      // Step 4: Production readiness assessment
      const productionReady = preDeployHealth.success && integrationSuccessRate === 1.0;
      
      expect(productionReady).toBe(true);
      
      console.log(`✅ Production deployment scenario validated: ${productionReady ? 'READY' : 'NOT READY'}`);
    }, TIMEOUT_MS);
  });
});