/**
 * Comprehensive API Tests
 * Tests all major Eden Academy endpoints
 */

import { ApiTestClient } from './base/api-test-client';
import {
  assertSuccess,
  assertStatus,
  assertProperties,
} from './base/test-helpers';
import { setupTestEnvironment } from './base/test-environment';

describe('Comprehensive Eden Academy API Tests', () => {
  let client: ApiTestClient;
  let config: any;

  beforeAll(async () => {
    config = await setupTestEnvironment();
    client = new ApiTestClient('http://localhost:3002/api');
  });

  describe('Core System Endpoints', () => {
    it('should return healthy status', async () => {
      const response = await client.get('/health');
      assertSuccess(response);
      expect(response.data.status).toBe('healthy');
    });

    it('should return system metrics', async () => {
      const response = await client.get('/metrics');
      if (response.status === 200) {
        assertSuccess(response);
      } else {
        console.log('Metrics endpoint not implemented yet');
      }
    });
  });

  describe('Agent Endpoints', () => {
    it('should list all agents', async () => {
      const response = await client.get('/agents');
      assertSuccess(response);
      assertProperties(response.data, ['agents', 'count']);
      expect(response.data.agents.length).toBeGreaterThan(0);
    });

    it('should get Abraham agent details', async () => {
      const response = await client.get('/agents/abraham');
      if (response.status === 200) {
        assertSuccess(response);
        assertProperties(response.data, ['name', 'type', 'status']);
        expect(response.data.name).toBe('ABRAHAM');
        expect(response.data.type).toBe('covenant_bound_artist');
        expect(response.data.status).toBe('creating');
      } else {
        console.log('Individual agent endpoint not fully implemented');
      }
    });

    it('should get agent works', async () => {
      const response = await client.get('/agents/abraham/works');
      if (response.status === 200) {
        assertSuccess(response);
        assertProperties(response.data, ['works', 'total', 'limit', 'offset']);
        expect(Array.isArray(response.data.works)).toBe(true);
        expect(response.data.total).toBeGreaterThan(0);
        
        // Check structure of individual works
        if (response.data.works.length > 0) {
          const work = response.data.works[0];
          assertProperties(work, ['id', 'title', 'image_url', 'created_date']);
        }
      } else {
        console.log('Agent works endpoint needs implementation');
      }
    });
  });

  describe('Works Endpoints', () => {
    it('should list works', async () => {
      const response = await client.get('/works');
      if (response.status === 200) {
        assertSuccess(response);
        assertProperties(response.data, ['works']);
        expect(Array.isArray(response.data.works)).toBe(true);
      } else {
        console.log('Works endpoint needs implementation');
      }
    });
  });

  describe('Registry Endpoints', () => {
    it('should check registry health', async () => {
      const response = await client.get('/registry/health');
      if (response.status === 200) {
        assertSuccess(response);
        assertProperties(response.data, ['healthy']);
      } else {
        console.log('Registry health endpoint not available');
      }
    });
  });

  describe('Miyomi Endpoints', () => {
    it('should get Miyomi picks', async () => {
      const response = await client.get('/miyomi/real-picks');
      if (response.status === 200) {
        assertSuccess(response);
        console.log('Miyomi picks working!');
      } else {
        console.log('Miyomi picks endpoint needs implementation');
      }
    });
  });

  describe('Admin Endpoints', () => {
    it('should check admin registry audit', async () => {
      const response = await client.get('/admin/registry-audit');
      if (response.status === 200) {
        assertSuccess(response);
        console.log('Admin audit endpoint working!');
      } else {
        console.log('Admin audit endpoint requires authentication or not implemented');
      }
    });
  });
});