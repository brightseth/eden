/**
 * Registry Format Standardization Test
 * Verify that Registry client handles all response formats consistently
 */

import { ApiTestClient } from './base/api-test-client';
import { assertProperties } from './base/test-helpers';

const client = new ApiTestClient(process.env.TEST_BASE_URL || 'http://localhost:3000/api');

describe('Registry Format Standardization', () => {
  
  describe('🏗️ Agent Endpoints', () => {
    test('GET /agents - Should handle agents list format', async () => {
      const response = await client.get('/agents');
      expect(response.status).toBe(200);
      assertProperties(response.data, ['agents', 'count']);
      expect(Array.isArray(response.data.agents)).toBe(true);
      expect(response.data.agents.length).toBeGreaterThan(0);
      
      console.log('✅ Agents format:', {
        count: response.data.count,
        firstAgentKeys: Object.keys(response.data.agents[0])
      });
    });

    test('GET /agents/abraham - Should handle individual agent format', async () => {
      const response = await client.get('/agents/abraham');
      expect([200, 404]).toContain(response.status);
      
      if (response.status === 200) {
        expect(typeof response.data).toBe('object');
        expect(response.data).not.toBeNull();
        
        // Should have agent-like properties
        const hasAgentProperties = ['name', 'status', 'type'].some(prop => prop in response.data);
        expect(hasAgentProperties).toBe(true);
        
        console.log('✅ Individual agent format:', {
          responseKeys: Object.keys(response.data),
          hasName: 'name' in response.data,
          hasStatus: 'status' in response.data
        });
      } else {
        console.log('ℹ️ Agent Abraham not available (expected in fallback mode)');
      }
    });

    test('GET /agents/solienne - Should handle different agent formats consistently', async () => {
      const response = await client.get('/agents/solienne');
      expect([200, 404]).toContain(response.status);
      
      if (response.status === 200) {
        expect(typeof response.data).toBe('object');
        expect(response.data).not.toBeNull();
        
        console.log('✅ Solienne agent format:', {
          responseKeys: Object.keys(response.data),
          dataType: typeof response.data
        });
      }
    });
  });

  describe('🔗 Registry Health & Fallback', () => {
    test('GET /registry/health - Registry status check', async () => {
      const response = await client.get('/registry/health');
      expect([200, 503]).toContain(response.status);
      assertProperties(response.data, ['status', 'timestamp']);
      
      console.log('✅ Registry health format:', {
        status: response.data.status,
        connected: response.data.registry?.connected,
        responseKeys: Object.keys(response.data)
      });
    });
  });

  describe('🧪 Format Handling Edge Cases', () => {
    test('All agent endpoints return consistent data types', async () => {
      // Test multiple agent endpoints for format consistency
      const agents = ['abraham', 'solienne', 'miyomi'];
      const results = [];

      for (const agent of agents) {
        try {
          const response = await client.get(`/agents/${agent}`);
          if (response.status === 200) {
            results.push({
              agent,
              dataType: typeof response.data,
              isArray: Array.isArray(response.data),
              keys: Object.keys(response.data).slice(0, 5), // First 5 keys
              hasWrappedData: 'data' in response.data
            });
          }
        } catch (error) {
          results.push({
            agent,
            error: error instanceof Error ? error.message : 'Unknown error'
          });
        }
      }

      console.log('📊 Agent format consistency:', results);
      
      // All successful responses should be objects
      results.filter(r => !r.error).forEach(result => {
        expect(result.dataType).toBe('object');
        expect(result.isArray).toBe(false);
      });
    });

    test('Registry client handles both wrapped and unwrapped responses', async () => {
      // This test documents the current behavior
      // Registry format standardization should handle:
      // 1. Direct responses: { id: "agent1", name: "..." }
      // 2. Wrapped responses: { data: { id: "agent1", name: "..." } }
      // 3. Collection responses: { agents: [...] }
      
      const response = await client.get('/agents');
      expect(response.status).toBe(200);
      
      // Should not be wrapped in extra 'data' layer at API level
      expect('data' in response.data).toBe(false);
      expect('agents' in response.data).toBe(true);
      
      console.log('✅ Format standardization working: API returns expected structure');
    });
  });

  describe('📈 Performance with Format Handling', () => {
    test('Format standardization should not significantly impact performance', async () => {
      const start = Date.now();
      const response = await client.get('/agents');
      const duration = Date.now() - start;
      
      expect(response.status).toBe(200);
      expect(duration).toBeLessThan(2000); // Should be under 2 seconds
      
      console.log('⚡ Performance impact:', { 
        duration: `${duration}ms`,
        agentCount: response.data.count
      });
    });
  });
});