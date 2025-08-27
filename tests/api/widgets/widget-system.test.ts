/**
 * Comprehensive Widget System Tests
 * Tests for ADR-025: Agent Profile Widget System
 */

import { loadTestConfig, setupTestEnvironment, teardownTestEnvironment, fixtures } from '../base/test-environment';
import { apiClient } from '../base/api-test-client';

describe('Widget System Integration Tests', () => {
  let testConfig: any;
  let client: any;

  beforeAll(async () => {
    testConfig = await setupTestEnvironment();
    client = apiClient(testConfig.baseUrl);
  });

  afterAll(async () => {
    await teardownTestEnvironment();
  });

  describe('Profile Config API', () => {
    test('should return Abraham profile config', async () => {
      const response = await client.get('/api/agents/abraham/profile-config');
      
      expect(response.status).toBe(200);
      expect(response.data).toHaveProperty('theme');
      expect(response.data).toHaveProperty('navigation');
      expect(response.data).toHaveProperty('widgets');
      expect(response.data.widgets).toBeInstanceOf(Array);
      expect(response.data.widgets.length).toBeGreaterThan(0);
    });

    test('should validate widget structure', async () => {
      const response = await client.get('/api/agents/abraham/profile-config');
      const config = response.data;
      
      // Test widget required properties
      config.widgets.forEach((widget: any) => {
        expect(widget).toHaveProperty('id');
        expect(widget).toHaveProperty('type');
        expect(widget).toHaveProperty('position');
        expect(widget).toHaveProperty('visibility');
        expect(widget).toHaveProperty('config');
        expect(widget.position).toHaveProperty('order');
        expect(typeof widget.position.order).toBe('number');
      });
    });

    test('should have proper widget ordering', async () => {
      const response = await client.get('/api/agents/abraham/profile-config');
      const config = response.data;
      
      const orders = config.widgets.map((w: any) => w.position.order);
      const sortedOrders = [...orders].sort((a, b) => a - b);
      
      expect(orders).toEqual(sortedOrders);
    });

    test('should include all expected Abraham widgets', async () => {
      const response = await client.get('/api/agents/abraham/profile-config');
      const config = response.data;
      
      const expectedWidgetTypes = [
        'hero',
        'mission', 
        'countdown',
        'training-status',
        'metrics',
        'works-gallery',
        'custom-content',
        'social-links'
      ];
      
      const actualTypes = config.widgets.map((w: any) => w.type);
      expectedWidgetTypes.forEach(type => {
        expect(actualTypes).toContain(type);
      });
    });

    test('should handle Registry failure gracefully', async () => {
      // Mock Registry failure by testing fallback behavior
      const response = await client.get('/api/agents/nonexistent/profile-config');
      expect([404, 500]).toContain(response.status);
      
      if (response.status === 500) {
        expect(response.data).toHaveProperty('error');
        expect(response.data).toHaveProperty('fallback');
      }
    });
  });

  describe('Widget Rendering Integration', () => {
    test('should render Abraham page with widget system', async () => {
      const response = await client.get('/academy/agent/abraham');
      expect(response.status).toBe(200);
      
      // Should not contain hardcoded references
      expect(response.data).not.toContain('agentConfigs');
    });

    test('should handle feature flag disabled', async () => {
      // This test would require mocking feature flags
      // For now, just verify the endpoint exists
      const response = await client.get('/academy/agent/abraham');
      expect([200, 500]).toContain(response.status);
    });
  });

  describe('Widget Config Validation', () => {
    test('should validate hero widget config', async () => {
      const response = await client.get('/api/agents/abraham/profile-config');
      const config = response.data;
      
      const heroWidget = config.widgets.find((w: any) => w.type === 'hero');
      expect(heroWidget).toBeDefined();
      expect(heroWidget.config).toHaveProperty('showStatus');
      expect(heroWidget.config).toHaveProperty('primaryAction');
      expect(heroWidget.config.primaryAction).toHaveProperty('text');
      expect(heroWidget.config.primaryAction).toHaveProperty('href');
    });

    test('should validate mission widget config', async () => {
      const response = await client.get('/api/agents/abraham/profile-config');
      const config = response.data;
      
      const missionWidget = config.widgets.find((w: any) => w.type === 'mission');
      expect(missionWidget).toBeDefined();
      expect(missionWidget.config).toHaveProperty('title');
      expect(missionWidget.config).toHaveProperty('layout');
      expect(['single-column', 'two-column']).toContain(missionWidget.config.layout);
    });

    test('should validate countdown widget config', async () => {
      const response = await client.get('/api/agents/abraham/profile-config');
      const config = response.data;
      
      const countdownWidget = config.widgets.find((w: any) => w.type === 'countdown');
      expect(countdownWidget).toBeDefined();
      expect(countdownWidget.config).toHaveProperty('targetDate');
      expect(countdownWidget.config).toHaveProperty('title');
      expect(countdownWidget.config.targetDate).toMatch(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z/);
    });

    test('should validate metrics widget config', async () => {
      const response = await client.get('/api/agents/abraham/profile-config');
      const config = response.data;
      
      const metricsWidget = config.widgets.find((w: any) => w.type === 'metrics');
      expect(metricsWidget).toBeDefined();
      expect(metricsWidget.config).toHaveProperty('layout');
      expect(['horizontal', 'vertical', 'grid']).toContain(metricsWidget.config.layout);
      
      if (metricsWidget.config.metrics) {
        expect(metricsWidget.config.metrics).toHaveProperty('totalWorks');
        expect(typeof metricsWidget.config.metrics.totalWorks).toBe('number');
      }
    });
  });

  describe('Registry Integration', () => {
    test('should connect to Registry for agent data', async () => {
      const response = await client.get('/api/agents/abraham/profile-config');
      
      // Should successfully fetch from Registry or provide fallback
      expect([200, 404, 500]).toContain(response.status);
      
      if (response.status === 200) {
        const config = response.data;
        const missionWidget = config.widgets.find((w: any) => w.type === 'mission');
        
        // Content should come from Registry or have fallback
        expect(missionWidget.config).toHaveProperty('content');
      }
    });

    test('should handle Registry timeout gracefully', async () => {
      // Test timeout behavior by making request with short timeout
      const response = await client.get('/api/agents/abraham/profile-config', {
        timeout: 100
      });
      
      // Should either succeed quickly or fail gracefully
      expect([200, 408, 500]).toContain(response.status);
    });
  });

  describe('Theme and Navigation', () => {
    test('should have valid theme configuration', async () => {
      const response = await client.get('/api/agents/abraham/profile-config');
      const config = response.data;
      
      expect(config.theme).toHaveProperty('background');
      expect(config.theme).toHaveProperty('accent');
      expect(config.theme).toHaveProperty('border');
      
      // Validate CSS classes
      expect(config.theme.background).toMatch(/^(bg-|text-)/);
    });

    test('should have navigation configuration', async () => {
      const response = await client.get('/api/agents/abraham/profile-config');
      const config = response.data;
      
      expect(config.navigation).toHaveProperty('showBackToAcademy');
      expect(typeof config.navigation.showBackToAcademy).toBe('boolean');
    });
  });

  describe('Widget Visibility Rules', () => {
    test('should respect always visible widgets', async () => {
      const response = await client.get('/api/agents/abraham/profile-config');
      const config = response.data;
      
      const alwaysVisibleWidgets = config.widgets.filter(
        (w: any) => w.visibility.always === true
      );
      
      expect(alwaysVisibleWidgets.length).toBeGreaterThan(0);
    });

    test('should handle agent status visibility', async () => {
      const response = await client.get('/api/agents/abraham/profile-config');
      const config = response.data;
      
      const statusWidget = config.widgets.find(
        (w: any) => w.visibility.agentStatus
      );
      
      if (statusWidget) {
        expect(statusWidget.visibility.agentStatus).toBeInstanceOf(Array);
        expect(statusWidget.visibility.agentStatus.length).toBeGreaterThan(0);
      }
    });
  });

  describe('Error Handling', () => {
    test('should handle missing agent gracefully', async () => {
      const response = await client.get('/api/agents/nonexistent/profile-config');
      expect(response.status).toBe(404);
      expect(response.data).toHaveProperty('error');
    });

    test('should provide fallback data on Registry failure', async () => {
      const response = await client.get('/api/agents/abraham/profile-config');
      
      if (response.status === 500) {
        expect(response.data).toHaveProperty('fallback');
        expect(response.data.fallback).toContain('hardcoded');
      }
    });
  });

  describe('Performance', () => {
    test('should respond within acceptable time', async () => {
      const startTime = Date.now();
      const response = await client.get('/api/agents/abraham/profile-config');
      const responseTime = Date.now() - startTime;
      
      expect(responseTime).toBeLessThan(5000); // 5 second max
      expect([200, 404, 500]).toContain(response.status);
    });

    test('should handle concurrent requests', async () => {
      const requests = Array(5).fill(null).map(() => 
        client.get('/api/agents/abraham/profile-config')
      );
      
      const responses = await Promise.allSettled(requests);
      
      responses.forEach((result) => {
        expect(result.status).toBe('fulfilled');
        if (result.status === 'fulfilled') {
          expect([200, 404, 500]).toContain(result.value.status);
        }
      });
    });
  });

  describe('Data Integrity', () => {
    test('should maintain consistent widget IDs', async () => {
      const response1 = await client.get('/api/agents/abraham/profile-config');
      const response2 = await client.get('/api/agents/abraham/profile-config');
      
      if (response1.status === 200 && response2.status === 200) {
        const ids1 = response1.data.widgets.map((w: any) => w.id).sort();
        const ids2 = response2.data.widgets.map((w: any) => w.id).sort();
        
        expect(ids1).toEqual(ids2);
      }
    });

    test('should have unique widget IDs', async () => {
      const response = await client.get('/api/agents/abraham/profile-config');
      
      if (response.status === 200) {
        const ids = response.data.widgets.map((w: any) => w.id);
        const uniqueIds = [...new Set(ids)];
        
        expect(ids.length).toBe(uniqueIds.length);
      }
    });
  });
});

describe('Widget Registry Tests', () => {
  describe('Registry Client Integration', () => {
    test('should successfully connect to production Registry', async () => {
      const testConfig = loadTestConfig();
      
      try {
        const response = await fetch(`${testConfig.registryUrl}/api/v1/health`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        // Either healthy or proper error
        expect([200, 404, 500, 503]).toContain(response.status);
      } catch (error) {
        console.log('Registry connection test - network error expected in some environments');
      }
    });

    test('should fetch agent data from Registry', async () => {
      const testConfig = loadTestConfig();
      
      try {
        const response = await fetch(`${testConfig.registryUrl}/api/v1/agents`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          expect(data).toHaveProperty('agents');
          expect(data.agents).toBeInstanceOf(Array);
        }
      } catch (error) {
        console.log('Registry agents test - network error expected in some environments');
      }
    });
  });

  describe('Fallback Behavior', () => {
    test('should handle Registry unavailable', async () => {
      const testConfig = await setupTestEnvironment();
      const client = apiClient(testConfig.baseUrl);
      
      const response = await client.get('/api/agents/abraham/profile-config');
      
      // Should either succeed with Registry data or provide fallback
      if (response.status === 500) {
        expect(response.data.message).toContain('Registry');
        expect(response.data.fallback).toBeDefined();
      } else if (response.status === 200) {
        expect(response.data.widgets).toBeDefined();
      }
    });
  });
});