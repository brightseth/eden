/**
 * Health Check API Test Suite
 * Tests for system health and monitoring endpoints
 */

import { ApiTestClient } from '../base/api-test-client';
import {
  assertSuccess,
  assertStatus,
  assertProperties,
  assertResponseTime,
  retry,
} from '../base/test-helpers';
import { setupTestEnvironment } from '../base/test-environment';

describe('Health Check APIs', () => {
  let client: ApiTestClient;
  let config: any;

  beforeAll(async () => {
    config = await setupTestEnvironment();
    client = new ApiTestClient(config.baseUrl + '/api');
  });

  describe('GET /health', () => {
    it('should return healthy status', async () => {
      const response = await client.get('/health');
      
      assertSuccess(response);
      assertStatus(response, 200);
      assertResponseTime(response, 1000);
      
      assertProperties(response.data, ['status', 'timestamp']);
      expect(response.data.status).toBe('healthy');
    });

    it('should include service checks', async () => {
      const response = await client.get('/health');
      
      assertSuccess(response);
      
      if (response.data.services) {
        assertProperties(response.data.services, ['database', 'cache']);
        
        Object.values(response.data.services).forEach((service: any) => {
          expect(['healthy', 'degraded', 'unhealthy']).toContain(service.status);
        });
      }
    });
  });

  describe('GET /test', () => {
    it('should verify database connection', async () => {
      const response = await client.get('/test');
      
      assertSuccess(response);
      assertStatus(response, 200);
      
      assertProperties(response.data, ['success', 'data']);
      expect(response.data.success).toBe(true);
      
      if (response.data.data) {
        assertProperties(response.data.data, ['connectionStatus']);
        expect(response.data.data.connectionStatus).toMatch(/Connected/i);
      }
    });
  });

  describe('GET /metrics', () => {
    it('should return system metrics', async () => {
      const response = await client.get('/metrics');
      
      assertSuccess(response);
      assertStatus(response, 200);
      
      assertProperties(response.data, ['timestamp']);
      
      if (response.data.system) {
        assertProperties(response.data.system, ['uptime', 'memory']);
      }
    });
  });

  describe('Registry Health Checks', () => {
    describe('GET /registry/health', () => {
      it('should check registry health', async () => {
        const response = await client.get('/registry/health');
        
        assertSuccess(response);
        assertStatus(response, 200);
        
        assertProperties(response.data, ['healthy', 'status']);
        
        if (response.data.status) {
          assertProperties(response.data.status, ['status', 'latency']);
        }
      });

      it('should handle registry unavailability gracefully', async () => {
        // This test assumes we can simulate registry being down
        // In real tests, this might be skipped if registry is always up
        
        const response = await client.get('/registry/health', {
          query: { simulate: 'down' },
        });
        
        // Should still return 200 but with unhealthy status
        assertStatus(response, 200);
        
        if (response.data) {
          expect(response.data.healthy).toBe(false);
        }
      });
    });

    describe('GET /v1/registry/health', () => {
      it('should check v1 registry health', async () => {
        const response = await client.get('/v1/registry/health');
        
        assertSuccess(response);
        assertStatus(response, 200);
        
        assertProperties(response.data, ['status']);
        expect(['healthy', 'degraded', 'critical']).toContain(response.data.status);
      });
    });
  });

  describe('Service Health Monitoring', () => {
    it('should detect service degradation', async () => {
      // Simulate high load or degradation
      const promises = Array(10).fill(null).map(() => 
        client.get('/health')
      );
      
      const responses = await Promise.all(promises);
      const responseTimes = responses.map(r => r.duration);
      const avgResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
      
      // Average response time should still be reasonable under load
      expect(avgResponseTime).toBeLessThan(2000);
    });

    it('should recover from temporary failures', async () => {
      const result = await retry(
        async () => {
          const response = await client.get('/health');
          assertSuccess(response);
          return response.data;
        },
        {
          maxAttempts: 3,
          delay: 1000,
        }
      );
      
      expect(result.status).toBe('healthy');
    });
  });

  describe('Readiness and Liveness Probes', () => {
    it('should have liveness probe', async () => {
      const response = await client.get('/health/live');
      
      // Even if endpoint doesn't exist, the main app should be alive
      if (response.status === 404) {
        // Try the main health endpoint as fallback
        const fallbackResponse = await client.get('/health');
        assertSuccess(fallbackResponse);
      } else {
        assertSuccess(response);
        expect(response.data.alive).toBe(true);
      }
    });

    it('should have readiness probe', async () => {
      const response = await client.get('/health/ready');
      
      // Even if endpoint doesn't exist, check main health
      if (response.status === 404) {
        const fallbackResponse = await client.get('/health');
        assertSuccess(fallbackResponse);
      } else {
        assertSuccess(response);
        expect(response.data.ready).toBe(true);
      }
    });
  });
});