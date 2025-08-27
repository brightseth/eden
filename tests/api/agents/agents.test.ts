/**
 * Agents API Test Suite
 * Tests for agent-related endpoints
 */

import { ApiTestClient } from '../base/api-test-client';
import {
  assertSuccess,
  assertError,
  assertStatus,
  assertProperties,
  assertArrayLength,
  assertResponseTime,
} from '../base/test-helpers';
import { setupTestEnvironment, fixtures } from '../base/test-environment';

describe('Agents API', () => {
  let client: ApiTestClient;
  let config: any;

  beforeAll(async () => {
    config = await setupTestEnvironment();
    client = new ApiTestClient(config.baseUrl + '/api');
  });

  describe('GET /agents', () => {
    it('should return a list of agents', async () => {
      const response = await client.get('/agents');
      
      assertSuccess(response);
      assertStatus(response, 200);
      assertResponseTime(response, 2000);
      
      expect(Array.isArray(response.data)).toBe(true);
      assertArrayLength(response.data, { min: 1 });
    });

    it('should support pagination', async () => {
      const response = await client.get('/agents', {
        query: { limit: 5, offset: 0 },
      });
      
      assertSuccess(response);
      assertArrayLength(response.data, { max: 5 });
    });

    it('should support filtering by role', async () => {
      const response = await client.get('/agents', {
        query: { role: 'generative-artist' },
      });
      
      assertSuccess(response);
      response.data.forEach((agent: any) => {
        expect(agent.role).toBe('generative-artist');
      });
    });
  });

  describe('GET /agents/:id', () => {
    it('should return agent details', async () => {
      const response = await client.get(`/agents/${fixtures.agents.abraham.id}`);
      
      assertSuccess(response);
      assertStatus(response, 200);
      assertProperties(response.data, ['id', 'handle', 'name', 'role']);
      
      expect(response.data.id).toBe(fixtures.agents.abraham.id);
      expect(response.data.handle).toBe(fixtures.agents.abraham.handle);
    });

    it('should return 404 for non-existent agent', async () => {
      const response = await client.get('/agents/non-existent-agent');
      
      assertError(response, 404);
    });
  });

  describe('GET /agents/:id/works', () => {
    it('should return agent works', async () => {
      const response = await client.get(`/agents/${fixtures.agents.abraham.id}/works`);
      
      assertSuccess(response);
      assertStatus(response, 200);
      
      expect(Array.isArray(response.data)).toBe(true);
      
      if (response.data.length > 0) {
        assertProperties(response.data[0], ['id', 'title', 'agentId']);
      }
    });

    it('should support pagination', async () => {
      const response = await client.get(`/agents/${fixtures.agents.abraham.id}/works`, {
        query: { limit: 10, page: 1 },
      });
      
      assertSuccess(response);
      assertArrayLength(response.data, { max: 10 });
    });
  });

  describe('GET /agents/:id/metrics', () => {
    it('should return agent metrics', async () => {
      const response = await client.get(`/agents/${fixtures.agents.abraham.id}/metrics`);
      
      assertSuccess(response);
      assertStatus(response, 200);
      
      assertProperties(response.data, ['seven_day', 'fourteen_day', 'readiness']);
      
      if (response.data.seven_day) {
        assertProperties(response.data.seven_day, ['totalWorks', 'avgQuality']);
      }
    });
  });

  describe('GET /agents/:id/profile', () => {
    it('should return agent profile', async () => {
      const response = await client.get(`/agents/${fixtures.agents.abraham.id}/profile`);
      
      assertSuccess(response);
      assertStatus(response, 200);
      
      assertProperties(response.data, [
        'id',
        'handle',
        'name',
        'bio',
        'avatar',
        'socials',
      ]);
    });
  });

  describe('GET /agents/:id/financial-model', () => {
    it('should return agent financial model', async () => {
      const response = await client.get(`/agents/${fixtures.agents.abraham.id}/financial-model`);
      
      assertSuccess(response);
      assertStatus(response, 200);
      
      assertProperties(response.data, ['revenueShares', 'stakeholders']);
      
      if (response.data.revenueShares) {
        assertProperties(response.data.revenueShares, ['creator', 'platform', 'agent']);
      }
    });
  });

  describe('GET /agents/:id/daily-practice', () => {
    it('should return agent daily practice entries', async () => {
      const response = await client.get(`/agents/${fixtures.agents.abraham.id}/daily-practice`);
      
      assertSuccess(response);
      assertStatus(response, 200);
      
      assertProperties(response.data, ['entries']);
      expect(Array.isArray(response.data.entries)).toBe(true);
      
      if (response.data.entries.length > 0) {
        assertProperties(response.data.entries[0], ['date', 'activities']);
      }
    });

    it('should support date range filtering', async () => {
      const endDate = new Date();
      const startDate = new Date(endDate);
      startDate.setDate(startDate.getDate() - 7);
      
      const response = await client.get(`/agents/${fixtures.agents.abraham.id}/daily-practice`, {
        query: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        },
      });
      
      assertSuccess(response);
      
      response.data.entries.forEach((entry: any) => {
        const entryDate = new Date(entry.date);
        expect(entryDate >= startDate).toBe(true);
        expect(entryDate <= endDate).toBe(true);
      });
    });
  });

  describe('POST /agents/:id/follow', () => {
    it('should follow an agent', async () => {
      const response = await client.post(`/agents/${fixtures.agents.solienne.id}/follow`, {
        userId: 'test-user-id',
      });
      
      // This might require authentication
      if (response.status === 401) {
        console.log('Follow endpoint requires authentication - skipping');
        return;
      }
      
      assertSuccess(response);
      assertStatus(response, 200);
      
      expect(response.data.following).toBe(true);
    });
  });

  describe('Agent Special Endpoints', () => {
    describe('Abraham-specific endpoints', () => {
      it('should get Abraham latest work', async () => {
        const response = await client.get('/agents/abraham/latest');
        
        assertSuccess(response);
        assertProperties(response.data, ['id', 'title', 'imageUrl']);
      });

      it('should get Abraham covenant status', async () => {
        const response = await client.get('/agents/abraham/covenant');
        
        assertSuccess(response);
        assertProperties(response.data, ['isActive', 'totalMembers']);
      });
    });

    describe('Solienne-specific endpoints', () => {
      it('should get Solienne latest generation', async () => {
        const response = await client.get('/agents/solienne/latest');
        
        assertSuccess(response);
        assertProperties(response.data, ['id', 'title', 'imageUrl']);
      });

      it('should get Solienne works', async () => {
        const response = await client.get('/agents/solienne/works');
        
        assertSuccess(response);
        expect(Array.isArray(response.data)).toBe(true);
      });
    });

    describe('Miyomi-specific endpoints', () => {
      it('should get Miyomi picks', async () => {
        const response = await client.get('/agents/miyomi/picks');
        
        assertSuccess(response);
        expect(Array.isArray(response.data.picks || response.data)).toBe(true);
      });

      it('should get Miyomi performance', async () => {
        const response = await client.get('/agents/miyomi/performance');
        
        assertSuccess(response);
        assertProperties(response.data, ['accuracy', 'totalPicks']);
      });
    });
  });
});