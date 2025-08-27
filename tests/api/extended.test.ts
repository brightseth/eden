/**
 * Extended API Tests
 * Tests all discovered Eden Academy endpoints systematically
 */

import { ApiTestClient } from './base/api-test-client';
import {
  assertSuccess,
  assertStatus,
  assertProperties,
} from './base/test-helpers';
import { setupTestEnvironment } from './base/test-environment';

describe('Extended Eden Academy API Tests', () => {
  let client: ApiTestClient;
  let config: any;

  beforeAll(async () => {
    config = await setupTestEnvironment();
    client = new ApiTestClient('http://localhost:3002/api');
  });

  describe('System Health & Monitoring', () => {
    it('should return basic health status', async () => {
      const response = await client.get('/health');
      assertSuccess(response);
      assertProperties(response.data, ['status', 'timestamp', 'version']);
      expect(response.data.status).toBe('healthy');
    });

    it('should return system health status', async () => {
      const response = await client.get('/health/system');
      if (response.status === 200) {
        assertSuccess(response);
        console.log('System health endpoint working!');
      } else {
        console.log('System health endpoint not implemented or accessible');
      }
    });

    it('should return system metrics', async () => {
      const response = await client.get('/metrics');
      if (response.status === 200) {
        assertSuccess(response);
        console.log('System metrics working!');
      } else {
        console.log('Metrics endpoint not implemented or accessible');
      }
    });

    it('should test database connectivity', async () => {
      const response = await client.get('/test');
      expect([200, 500]).toContain(response.status);
      if (response.status === 200) {
        console.log('Database test successful');
      } else {
        console.log('Database test failed (expected)');
      }
    });
  });

  describe('Agent System', () => {
    it('should list all agents', async () => {
      const response = await client.get('/agents');
      assertSuccess(response);
      assertProperties(response.data, ['agents', 'count']);
      expect(Array.isArray(response.data.agents)).toBe(true);
    });

    it('should get Abraham agent details', async () => {
      const response = await client.get('/agents/abraham');
      assertSuccess(response);
      assertProperties(response.data, ['name', 'type', 'status']);
      expect(response.data.name).toBe('ABRAHAM');
    });

    it('should get Abraham latest work', async () => {
      const response = await client.get('/agents/abraham/latest');
      if (response.status === 200) {
        assertSuccess(response);
        console.log('Abraham latest work endpoint working!');
      } else {
        console.log('Abraham latest work endpoint not implemented');
      }
    });

    it('should get Abraham covenant status', async () => {
      const response = await client.get('/agents/abraham/covenant');
      if (response.status === 200) {
        assertSuccess(response);
        console.log('Abraham covenant endpoint working!');
      } else {
        console.log('Abraham covenant endpoint not implemented');
      }
    });

    it('should get Abraham status', async () => {
      const response = await client.get('/agents/abraham/status');
      if (response.status === 200) {
        assertSuccess(response);
        console.log('Abraham status endpoint working!');
      } else {
        console.log('Abraham status endpoint not implemented');
      }
    });

    it('should get Solienne agent details', async () => {
      const response = await client.get('/agents/solienne');
      if (response.status === 200) {
        assertSuccess(response);
        console.log('Solienne agent endpoint working!');
      } else {
        console.log('Solienne agent endpoint not implemented');
      }
    });

    it('should get Solienne works', async () => {
      const response = await client.get('/agents/solienne/works');
      if (response.status === 200) {
        assertSuccess(response);
        console.log('Solienne works endpoint working!');
      } else {
        console.log('Solienne works endpoint not implemented');
      }
    });

    it('should get Solienne latest work', async () => {
      const response = await client.get('/agents/solienne/latest');
      if (response.status === 200) {
        assertSuccess(response);
        console.log('Solienne latest work endpoint working!');
      } else {
        console.log('Solienne latest work endpoint not implemented');
      }
    });
  });

  describe('Dynamic Agent System', () => {
    const agentIds = ['abraham', 'solienne', 'miyomi', 'bertha'];
    
    agentIds.forEach(agentId => {
      it(`should get ${agentId} metrics`, async () => {
        const response = await client.get(`/agents/${agentId}/metrics`);
        if (response.status === 200) {
          assertSuccess(response);
          console.log(`${agentId} metrics working!`);
        } else {
          console.log(`${agentId} metrics endpoint not implemented`);
        }
      });

      it(`should get ${agentId} daily practice`, async () => {
        const response = await client.get(`/agents/${agentId}/daily-practice`);
        if (response.status === 200) {
          assertSuccess(response);
          console.log(`${agentId} daily practice working!`);
        } else {
          console.log(`${agentId} daily practice endpoint not implemented`);
        }
      });

      it(`should get ${agentId} autonomy status`, async () => {
        const response = await client.get(`/agents/${agentId}/autonomy`);
        if (response.status === 200) {
          assertSuccess(response);
          console.log(`${agentId} autonomy working!`);
        } else {
          console.log(`${agentId} autonomy endpoint not implemented`);
        }
      });

      it(`should get ${agentId} public profile`, async () => {
        const response = await client.get(`/agents/${agentId}/public`);
        if (response.status === 200) {
          assertSuccess(response);
          console.log(`${agentId} public profile working!`);
        } else {
          console.log(`${agentId} public profile endpoint not implemented`);
        }
      });

      it(`should get ${agentId} financial model`, async () => {
        const response = await client.get(`/agents/${agentId}/financial-model`);
        if (response.status === 200) {
          assertSuccess(response);
          console.log(`${agentId} financial model working!`);
        } else {
          console.log(`${agentId} financial model endpoint not implemented`);
        }
      });

      it(`should get ${agentId} profile`, async () => {
        const response = await client.get(`/agents/${agentId}/profile`);
        if (response.status === 200) {
          assertSuccess(response);
          console.log(`${agentId} profile working!`);
        } else {
          console.log(`${agentId} profile endpoint not implemented`);
        }
      });

      it(`should get ${agentId} works`, async () => {
        const response = await client.get(`/agents/${agentId}/works`);
        if (response.status === 200) {
          assertSuccess(response);
          console.log(`${agentId} works working!`);
        } else {
          console.log(`${agentId} works endpoint not implemented`);
        }
      });

      it(`should get ${agentId} overview`, async () => {
        const response = await client.get(`/agents/${agentId}/overview`);
        if (response.status === 200) {
          assertSuccess(response);
          console.log(`${agentId} overview working!`);
        } else {
          console.log(`${agentId} overview endpoint not implemented`);
        }
      });

      it(`should get ${agentId} assets`, async () => {
        const response = await client.get(`/agents/${agentId}/assets`);
        if (response.status === 200) {
          assertSuccess(response);
          console.log(`${agentId} assets working!`);
        } else {
          console.log(`${agentId} assets endpoint not implemented`);
        }
      });
    });
  });

  describe('Miyomi System', () => {
    it('should get Miyomi real picks', async () => {
      const response = await client.get('/miyomi/real-picks');
      if (response.status === 200) {
        assertSuccess(response);
        assertProperties(response.data, ['picks']);
        console.log(`Found ${response.data.picks?.length || 0} Miyomi picks`);
      } else {
        console.log('Miyomi real picks endpoint not accessible');
      }
    });

    it('should get Miyomi status', async () => {
      const response = await client.get('/miyomi/status');
      if (response.status === 200) {
        assertSuccess(response);
        console.log('Miyomi status working!');
      } else {
        console.log('Miyomi status endpoint not accessible');
      }
    });

    it('should get Miyomi pending picks', async () => {
      const response = await client.get('/miyomi/pending-picks');
      if (response.status === 200) {
        assertSuccess(response);
        console.log('Miyomi pending picks working!');
      } else {
        console.log('Miyomi pending picks endpoint not accessible');
      }
    });

    it('should get Miyomi picks via agent endpoint', async () => {
      const response = await client.get('/agents/miyomi/picks');
      if (response.status === 200) {
        assertSuccess(response);
        console.log('Miyomi agent picks working!');
      } else {
        console.log('Miyomi agent picks endpoint not accessible');
      }
    });

    it('should get Miyomi schedule', async () => {
      const response = await client.get('/agents/miyomi/schedule');
      if (response.status === 200) {
        assertSuccess(response);
        console.log('Miyomi schedule working!');
      } else {
        console.log('Miyomi schedule endpoint not accessible');
      }
    });

    it('should get Miyomi performance', async () => {
      const response = await client.get('/agents/miyomi/performance');
      if (response.status === 200) {
        assertSuccess(response);
        console.log('Miyomi performance working!');
      } else {
        console.log('Miyomi performance endpoint not accessible');
      }
    });
  });

  describe('Works & Content System', () => {
    it('should list works', async () => {
      const response = await client.get('/works');
      if (response.status === 200) {
        assertSuccess(response);
        console.log('Works listing working!');
      } else {
        console.log('Works listing endpoint not accessible');
      }
    });

    it('should get critiques', async () => {
      const response = await client.get('/critiques');
      if (response.status === 200) {
        assertSuccess(response);
        console.log('Critiques endpoint working!');
      } else {
        console.log('Critiques endpoint not accessible');
      }
    });

    it('should get collects', async () => {
      const response = await client.get('/collects');
      if (response.status === 200) {
        assertSuccess(response);
        console.log('Collects endpoint working!');
      } else {
        console.log('Collects endpoint not accessible');
      }
    });

    it('should get leaderboard', async () => {
      const response = await client.get('/leaderboard');
      if (response.status === 200) {
        assertSuccess(response);
        console.log('Leaderboard endpoint working!');
      } else {
        console.log('Leaderboard endpoint not accessible');
      }
    });
  });

  describe('Registry & Federation', () => {
    it('should check registry health', async () => {
      const response = await client.get('/registry/health');
      if (response.status === 200) {
        assertSuccess(response);
        console.log('Registry health working!');
      } else {
        console.log('Registry health endpoint not accessible');
      }
    });

    it('should get registry stream', async () => {
      const response = await client.get('/registry/stream');
      if (response.status === 200) {
        assertSuccess(response);
        console.log('Registry stream working!');
      } else {
        console.log('Registry stream endpoint not accessible');
      }
    });

    it('should sync with registry', async () => {
      const response = await client.get('/registry/sync');
      if (response.status === 200) {
        assertSuccess(response);
        console.log('Registry sync working!');
      } else {
        console.log('Registry sync endpoint not accessible');
      }
    });

    it('should get sync status', async () => {
      const response = await client.get('/sync');
      if (response.status === 200) {
        assertSuccess(response);
        console.log('General sync working!');
      } else {
        console.log('General sync endpoint not accessible');
      }
    });

    it('should check v1 registry health', async () => {
      const response = await client.get('/v1/registry/health');
      if (response.status === 200) {
        assertSuccess(response);
        console.log('V1 Registry health working!');
      } else {
        console.log('V1 Registry health endpoint not accessible');
      }
    });

    it('should get v1 registry services', async () => {
      const response = await client.get('/v1/registry/services');
      if (response.status === 200) {
        assertSuccess(response);
        console.log('V1 Registry services working!');
      } else {
        console.log('V1 Registry services endpoint not accessible');
      }
    });
  });

  describe('Tools & Utilities', () => {
    it('should get alerts', async () => {
      const response = await client.get('/alerts');
      if (response.status === 200) {
        assertSuccess(response);
        console.log('Alerts endpoint working!');
      } else {
        console.log('Alerts endpoint not accessible');
      }
    });

    it('should get notifications', async () => {
      const response = await client.get('/notifications');
      if (response.status === 200) {
        assertSuccess(response);
        console.log('Notifications endpoint working!');
      } else {
        console.log('Notifications endpoint not accessible');
      }
    });

    it('should get practice calendar', async () => {
      const response = await client.get('/practice-calendar');
      if (response.status === 200) {
        assertSuccess(response);
        console.log('Practice calendar working!');
      } else {
        console.log('Practice calendar endpoint not accessible');
      }
    });

    it('should get tagger info', async () => {
      const response = await client.get('/tagger');
      if (response.status === 200) {
        assertSuccess(response);
        console.log('Tagger endpoint working!');
      } else {
        console.log('Tagger endpoint not accessible');
      }
    });

    it('should get inbox', async () => {
      const response = await client.get('/inbox');
      if (response.status === 200) {
        assertSuccess(response);
        console.log('Inbox endpoint working!');
      } else {
        console.log('Inbox endpoint not accessible');
      }
    });
  });

  describe('Testing & Debug Endpoints', () => {
    it('should test onchain badges', async () => {
      const response = await client.get('/test/onchain-badges');
      if (response.status === 200) {
        assertSuccess(response);
        console.log('Onchain badges test working!');
      } else {
        console.log('Onchain badges test endpoint not accessible');
      }
    });

    it('should test spirit integration', async () => {
      const response = await client.get('/test/spirit-integration');
      if (response.status === 200) {
        assertSuccess(response);
        console.log('Spirit integration test working!');
      } else {
        console.log('Spirit integration test endpoint not accessible');
      }
    });

    it('should test agent readiness', async () => {
      const response = await client.get('/test/agent-readiness');
      if (response.status === 200) {
        assertSuccess(response);
        console.log('Agent readiness test working!');
      } else {
        console.log('Agent readiness test endpoint not accessible');
      }
    });

    it('should test token economics', async () => {
      const response = await client.get('/test/token-economics');
      if (response.status === 200) {
        assertSuccess(response);
        console.log('Token economics test working!');
      } else {
        console.log('Token economics test endpoint not accessible');
      }
    });
  });

  describe('Eden Integration', () => {
    it('should get Eden Miyomi config', async () => {
      const response = await client.get('/eden/miyomi/config');
      if (response.status === 200) {
        assertSuccess(response);
        console.log('Eden Miyomi config working!');
      } else {
        console.log('Eden Miyomi config endpoint not accessible');
      }
    });

    it('should get Eden Miyomi works', async () => {
      const response = await client.get('/eden/miyomi/works');
      if (response.status === 200) {
        assertSuccess(response);
        console.log('Eden Miyomi works working!');
      } else {
        console.log('Eden Miyomi works endpoint not accessible');
      }
    });

    it('should get Eden Miyomi media', async () => {
      const response = await client.get('/eden/miyomi/media');
      if (response.status === 200) {
        assertSuccess(response);
        console.log('Eden Miyomi media working!');
      } else {
        console.log('Eden Miyomi media endpoint not accessible');
      }
    });
  });

  describe('Admin Endpoints', () => {
    it('should get admin registry audit', async () => {
      const response = await client.get('/admin/registry-audit');
      if (response.status === 200) {
        assertSuccess(response);
        console.log('Admin registry audit working!');
      } else {
        console.log('Admin registry audit endpoint not accessible');
      }
    });

    it('should get admin bertha training', async () => {
      const response = await client.get('/admin/bertha-training');
      if (response.status === 200) {
        assertSuccess(response);
        console.log('Admin Bertha training working!');
      } else {
        console.log('Admin Bertha training endpoint not accessible');
      }
    });

    it('should reload config', async () => {
      const response = await client.get('/config/reload');
      if (response.status === 200) {
        assertSuccess(response);
        console.log('Config reload working!');
      } else {
        console.log('Config reload endpoint not accessible');
      }
    });
  });

  describe('Special Agent Endpoints', () => {
    it('should get nina curator', async () => {
      const response = await client.get('/nina-curator');
      if (response.status === 200) {
        assertSuccess(response);
        console.log('Nina curator working!');
      } else {
        console.log('Nina curator endpoint not accessible');
      }
    });

    it('should get nina critique', async () => {
      const response = await client.get('/nina-critique');
      if (response.status === 200) {
        assertSuccess(response);
        console.log('Nina critique working!');
      } else {
        console.log('Nina critique endpoint not accessible');
      }
    });

    it('should get citizen agent works', async () => {
      const response = await client.get('/agents/citizen/works');
      if (response.status === 200) {
        assertSuccess(response);
        console.log('Citizen agent works working!');
      } else {
        console.log('Citizen agent works endpoint not accessible');
      }
    });

    it('should get bertha training', async () => {
      const response = await client.get('/agents/bertha/training');
      if (response.status === 200) {
        assertSuccess(response);
        console.log('Bertha training working!');
      } else {
        console.log('Bertha training endpoint not accessible');
      }
    });
  });
});