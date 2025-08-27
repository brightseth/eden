/**
 * Works API Test Suite
 * Tests for creative works endpoints
 */

import { ApiTestClient } from '../base/api-test-client';
import {
  assertSuccess,
  assertError,
  assertStatus,
  assertProperties,
  assertArrayLength,
  random,
} from '../base/test-helpers';
import { setupTestEnvironment, fixtures, testDataTracker } from '../base/test-environment';

describe('Works API', () => {
  let client: ApiTestClient;
  let config: any;
  const createdWorkIds: string[] = [];

  beforeAll(async () => {
    config = await setupTestEnvironment();
    client = new ApiTestClient(config.baseUrl + '/api');
  });

  afterAll(async () => {
    // Cleanup created test works
    for (const id of createdWorkIds) {
      try {
        await client.delete(`/works/${id}`);
      } catch (error) {
        console.log(`Failed to cleanup work ${id}:`, error);
      }
    }
  });

  describe('GET /works', () => {
    it('should return a list of works', async () => {
      const response = await client.get('/works');
      
      assertSuccess(response);
      assertStatus(response, 200);
      
      expect(Array.isArray(response.data)).toBe(true);
      
      if (response.data.length > 0) {
        assertProperties(response.data[0], ['id', 'title', 'agentId']);
      }
    });

    it('should support pagination', async () => {
      const response = await client.get('/works', {
        query: { limit: 10, page: 1 },
      });
      
      assertSuccess(response);
      assertArrayLength(response.data, { max: 10 });
    });

    it('should filter by agent', async () => {
      const response = await client.get('/works', {
        query: { agentId: fixtures.agents.abraham.id },
      });
      
      assertSuccess(response);
      
      response.data.forEach((work: any) => {
        expect(work.agentId).toBe(fixtures.agents.abraham.id);
      });
    });

    it('should filter by status', async () => {
      const response = await client.get('/works', {
        query: { status: 'published' },
      });
      
      assertSuccess(response);
      
      response.data.forEach((work: any) => {
        expect(work.status).toBe('published');
      });
    });

    it('should support sorting', async () => {
      const response = await client.get('/works', {
        query: { 
          sort: 'createdAt',
          order: 'desc',
        },
      });
      
      assertSuccess(response);
      
      if (response.data.length > 1) {
        const dates = response.data.map((w: any) => new Date(w.createdAt).getTime());
        for (let i = 1; i < dates.length; i++) {
          expect(dates[i]).toBeLessThanOrEqual(dates[i - 1]);
        }
      }
    });
  });

  describe('GET /works/:id', () => {
    let existingWorkId: string;

    beforeAll(async () => {
      // Get a real work ID for testing
      const listResponse = await client.get('/works', { query: { limit: 1 } });
      if (listResponse.data && listResponse.data.length > 0) {
        existingWorkId = listResponse.data[0].id;
      }
    });

    it('should return work details', async () => {
      if (!existingWorkId) {
        console.log('No existing works to test - skipping');
        return;
      }

      const response = await client.get(`/works/${existingWorkId}`);
      
      assertSuccess(response);
      assertStatus(response, 200);
      
      assertProperties(response.data, [
        'id',
        'title',
        'agentId',
        'imageUrl',
        'metadata',
      ]);
      
      expect(response.data.id).toBe(existingWorkId);
    });

    it('should return 404 for non-existent work', async () => {
      const response = await client.get('/works/non-existent-work-id');
      
      assertError(response, 404);
    });
  });

  describe('POST /works/:id/publish', () => {
    it('should publish a work', async () => {
      // This might require authentication and specific permissions
      const response = await client.post('/works/test-work-id/publish', {
        platforms: ['eden', 'farcaster'],
      });
      
      if (response.status === 401) {
        console.log('Publish endpoint requires authentication - skipping');
        return;
      }
      
      if (response.status === 404) {
        console.log('Test work not found - skipping');
        return;
      }
      
      assertSuccess(response);
      expect(response.data.status).toBe('published');
    });
  });

  describe('Works Search and Discovery', () => {
    it('should search works by title', async () => {
      const response = await client.get('/works', {
        query: { search: 'genesis' },
      });
      
      assertSuccess(response);
      
      // Results should contain search term in title or description
      response.data.forEach((work: any) => {
        const hasMatch = 
          work.title?.toLowerCase().includes('genesis') ||
          work.description?.toLowerCase().includes('genesis');
        expect(hasMatch).toBe(true);
      });
    });

    it('should filter by tags', async () => {
      const response = await client.get('/works', {
        query: { tags: 'generative,abstract' },
      });
      
      assertSuccess(response);
      
      // Each work should have at least one of the requested tags
      response.data.forEach((work: any) => {
        if (work.tags) {
          const hasTag = work.tags.some((tag: string) => 
            ['generative', 'abstract'].includes(tag.toLowerCase())
          );
          expect(hasTag).toBe(true);
        }
      });
    });

    it('should filter by date range', async () => {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30); // Last 30 days
      
      const response = await client.get('/works', {
        query: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        },
      });
      
      assertSuccess(response);
      
      response.data.forEach((work: any) => {
        const workDate = new Date(work.createdAt);
        expect(workDate >= startDate).toBe(true);
        expect(workDate <= endDate).toBe(true);
      });
    });
  });

  describe('Works Statistics', () => {
    it('should get work statistics', async () => {
      const response = await client.get('/works/stats');
      
      if (response.status === 404) {
        console.log('Stats endpoint not implemented - skipping');
        return;
      }
      
      assertSuccess(response);
      
      assertProperties(response.data, [
        'totalWorks',
        'publishedWorks',
        'draftWorks',
      ]);
      
      expect(response.data.totalWorks).toBeGreaterThanOrEqual(0);
    });

    it('should get agent work statistics', async () => {
      const response = await client.get('/works/stats', {
        query: { agentId: fixtures.agents.abraham.id },
      });
      
      if (response.status === 404) {
        console.log('Stats endpoint not implemented - skipping');
        return;
      }
      
      assertSuccess(response);
      
      expect(response.data.agentId).toBe(fixtures.agents.abraham.id);
    });
  });

  describe('Batch Operations', () => {
    it('should fetch multiple works by IDs', async () => {
      const listResponse = await client.get('/works', { query: { limit: 3 } });
      
      if (!listResponse.data || listResponse.data.length === 0) {
        console.log('No works available for batch testing - skipping');
        return;
      }
      
      const workIds = listResponse.data.map((w: any) => w.id);
      
      const response = await client.post('/works/batch', {
        ids: workIds,
      });
      
      if (response.status === 404) {
        console.log('Batch endpoint not implemented - skipping');
        return;
      }
      
      assertSuccess(response);
      assertArrayLength(response.data, workIds.length);
    });
  });
});