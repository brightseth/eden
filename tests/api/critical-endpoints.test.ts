/**
 * Critical Endpoints Test - Focus on core system functionality
 */

import { ApiTestClient } from './base/api-test-client';
import { assertProperties } from './base/test-helpers';

const client = new ApiTestClient(process.env.TEST_BASE_URL || 'http://localhost:3007/api');

describe('Critical Endpoints - Core System Health', () => {
  
  describe('🏥 Health & Monitoring', () => {
    test('GET /healthz - Liveness probe', async () => {
      const response = await client.get('/healthz');
      expect(response.status).toBe(200);
      assertProperties(response.data, ['ok', 'timestamp', 'service', 'version', 'git']);
      expect(response.data.ok).toBe(true);
      expect(response.data.service).toBe('Eden Academy');
    });

    test('GET /readyz - Readiness probe', async () => {
      const response = await client.get('/readyz');
      expect([200, 503]).toContain(response.status);
      assertProperties(response.data, ['ok', 'timestamp', 'service', 'checks']);
      expect(typeof response.data.latency).toBe('number');
      expect(response.data.checks.database).toBeDefined();
      expect(response.data.checks.registry).toBeDefined();
    });

    test('GET /health - Backward compatible health', async () => {
      const response = await client.get('/health');
      expect([200, 503]).toContain(response.status);
      assertProperties(response.data, ['ok', 'timestamp', 'service', 'type']);
      expect(response.data.type).toBe('readiness');
    });

    test('GET /health?type=liveness - Liveness mode', async () => {
      const response = await client.get('/health?type=liveness');
      expect(response.status).toBe(200);
      assertProperties(response.data, ['ok', 'timestamp', 'service', 'type']);
      expect(response.data.type).toBe('liveness');
    });
  });

  describe('🧪 Database & Testing', () => {
    test('GET /test - Database connectivity', async () => {
      const response = await client.get('/test');
      expect([200, 503]).toContain(response.status);
      assertProperties(response.data, ['ok', 'timestamp', 'service', 'tests']);
      expect(response.data.tests.database).toBeDefined();
      expect(response.data.tests.schemas.agent_archives).toBeDefined();
      expect(response.data.tests.schemas.critiques).toBeDefined();
    });
  });

  describe('🤖 Core Agent System', () => {
    test('GET /agents - Agent registry list', async () => {
      const response = await client.get('/agents');
      expect(response.status).toBe(200);
      assertProperties(response.data, ['agents', 'count']);
      expect(Array.isArray(response.data.agents)).toBe(true);
      expect(response.data.agents.length).toBeGreaterThan(0);
      
      // Check first agent has required properties
      const firstAgent = response.data.agents[0];
      assertProperties(firstAgent, ['id', 'name', 'status']);
    });

    test('GET /agents/abraham - Abraham agent profile', async () => {
      const response = await client.get('/agents/abraham');
      expect([200, 404]).toContain(response.status);
      if (response.status === 200) {
        assertProperties(response.data, ['id', 'name', 'status']);
        expect(response.data.id).toBe('abraham');
      }
    });

    test('GET /agents/solienne - Solienne agent profile', async () => {
      const response = await client.get('/agents/solienne');
      expect([200, 404]).toContain(response.status);
      if (response.status === 200) {
        assertProperties(response.data, ['id', 'name', 'status']);
        expect(response.data.id).toBe('solienne');
      }
    });
  });

  describe('🎨 Content System', () => {
    test('GET /critiques - Critique system', async () => {
      const response = await client.get('/critiques');
      expect([200, 500]).toContain(response.status);
      if (response.status === 200) {
        assertProperties(response.data, ['critiques', 'count']);
        expect(Array.isArray(response.data.critiques)).toBe(true);
      }
    });

    test('GET /works - Works listing', async () => {
      const response = await client.get('/works');
      expect([200, 404, 500]).toContain(response.status);
      // This endpoint may not be implemented yet
      if (response.status === 200) {
        expect(response.data).toBeDefined();
      }
    });
  });

  describe('🔗 Registry Integration', () => {
    test('GET /registry/health - Registry connectivity', async () => {
      const response = await client.get('/registry/health');
      expect([200, 503, 500]).toContain(response.status);
      // Registry may be down, but endpoint should respond
      assertProperties(response.data, ['status', 'timestamp']);
    });
  });

  describe('📚 Documentation', () => {
    test('GET /docs - OpenAPI specification', async () => {
      const response = await client.get('/docs');
      expect(response.status).toBe(200);
      assertProperties(response.data, ['openapi', 'info', 'paths']);
      expect(response.data.info.title).toBe('Eden Academy API');
    });

    test('GET /docs/swagger - Swagger UI', async () => {
      const response = await client.get('/docs/swagger');
      expect(response.status).toBe(200);
      expect(response.data).toContain('Eden Academy API Documentation');
      expect(response.data).toContain('swagger-ui');
    });
  });

  describe('📊 Performance Benchmarks', () => {
    test('Health endpoints should be fast', async () => {
      const start = Date.now();
      const response = await client.get('/healthz');
      const duration = Date.now() - start;
      
      expect(response.status).toBe(200);
      expect(duration).toBeLessThan(1000); // Should be under 1 second
    });

    test('Database test should complete reasonably', async () => {
      const start = Date.now();
      const response = await client.get('/test');
      const duration = Date.now() - start;
      
      expect([200, 503]).toContain(response.status);
      expect(duration).toBeLessThan(2000); // Should be under 2 seconds
    });
  });
});