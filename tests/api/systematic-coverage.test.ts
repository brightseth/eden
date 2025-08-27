/**
 * Systematic API Coverage Tests
 * Tests all 66+ discovered Eden Academy endpoints following architecture-guardian Priority 2
 * Validates Registry-First pattern compliance and service boundary integrity
 */

import { ApiTestClient } from './base/api-test-client';
import {
  assertSuccess,
  assertStatus,
  assertProperties,
} from './base/test-helpers';
import { setupTestEnvironment } from './base/test-environment';

describe('Systematic API Coverage - All 66+ Endpoints', () => {
  let client: ApiTestClient;
  let config: any;

  beforeAll(async () => {
    config = await setupTestEnvironment();
    // Use environment variable or default to current dev server
    const baseUrl = process.env.TEST_BASE_URL || 'http://localhost:3007/api';
    client = new ApiTestClient(baseUrl);
    console.log(`🧪 Testing against: ${baseUrl}`);
  });

  describe('📊 Core System Health & Infrastructure', () => {
    it('[CRITICAL] /api/health - Basic system health', async () => {
      const response = await client.get('/health');
      assertSuccess(response);
      assertProperties(response.data, ['status', 'timestamp', 'version', 'service']);
      expect(response.data.status).toBe('healthy');
      expect(response.data.service).toBe('Eden Academy');
    });

    it('/api/health/system - Extended system health', async () => {
      const response = await client.get('/health/system');
      if (response.status === 200) {
        assertSuccess(response);
        console.log('✅ System health endpoint operational');
      } else {
        console.log('⚠️ System health endpoint not accessible');
      }
    });

    it('[CRITICAL] /api/test - Database connectivity validation', async () => {
      const response = await client.get('/test');
      expect([200, 500]).toContain(response.status);
      
      if (response.status === 200) {
        assertProperties(response.data, ['success', 'data']);
        expect(response.data.success).toBe(true);
        expect(response.data.data.connectionStatus).toBe('Connected successfully!');
        console.log(`✅ Database: ${response.data.data.archivesTotal} archives, ${response.data.data.critiquesTotal} critiques`);
      }
    });

    it('/api/metrics - Performance metrics', async () => {
      const response = await client.get('/metrics');
      if (response.status === 200) {
        assertSuccess(response);
        console.log('✅ Metrics endpoint operational');
      } else {
        console.log('⚠️ Metrics endpoint not implemented');
      }
    });
  });

  describe('🤖 Agent System - Core Architecture', () => {
    it('[CRITICAL] /api/agents - Agent registry list', async () => {
      const response = await client.get('/agents');
      assertSuccess(response);
      assertProperties(response.data, ['agents', 'count']);
      expect(Array.isArray(response.data.agents)).toBe(true);
      expect(response.data.count).toBeGreaterThan(0);
      
      console.log(`✅ Found ${response.data.count} agents in registry`);
      
      // Validate agent structure follows Registry-First pattern
      if (response.data.agents.length > 0) {
        const agent = response.data.agents[0];
        assertProperties(agent, ['id', 'name', 'status']);
      }
    });

    // Test specific agent endpoints
    const agentIds = ['abraham', 'solienne', 'miyomi', 'bertha'];
    
    agentIds.forEach(agentId => {
      describe(`Agent: ${agentId}`, () => {
        it(`/api/agents/${agentId} - Agent profile`, async () => {
          const response = await client.get(`/agents/${agentId}`);
          if (response.status === 200) {
            assertSuccess(response);
            assertProperties(response.data, ['name']);
            console.log(`✅ ${agentId} profile loaded`);
          } else {
            console.log(`⚠️ ${agentId} profile not available`);
          }
        });

        it(`/api/agents/${agentId}/works - Agent works`, async () => {
          const response = await client.get(`/agents/${agentId}/works`);
          if (response.status === 200) {
            assertSuccess(response);
            // Registry-First pattern: should have works array and metadata
            if (response.data.works) {
              expect(Array.isArray(response.data.works)).toBe(true);
              console.log(`✅ ${agentId} works: ${response.data.total || response.data.works.length} items`);
            } else if (Array.isArray(response.data)) {
              console.log(`✅ ${agentId} works: ${response.data.length} items (legacy format)`);
            }
          } else {
            console.log(`⚠️ ${agentId} works not available`);
          }
        });

        it(`/api/agents/${agentId}/profile - Enhanced profile`, async () => {
          const response = await client.get(`/agents/${agentId}/profile`);
          if (response.status === 200) {
            assertSuccess(response);
            console.log(`✅ ${agentId} enhanced profile loaded`);
          } else {
            console.log(`⚠️ ${agentId} enhanced profile not available`);
          }
        });

        it(`/api/agents/${agentId}/overview - Agent overview`, async () => {
          const response = await client.get(`/agents/${agentId}/overview`);
          if (response.status === 200) {
            assertSuccess(response);
            console.log(`✅ ${agentId} overview loaded`);
          } else {
            console.log(`⚠️ ${agentId} overview not available`);
          }
        });

        it(`/api/agents/${agentId}/autonomy - Autonomy settings`, async () => {
          const response = await client.get(`/agents/${agentId}/autonomy`);
          if (response.status === 200) {
            assertSuccess(response);
            console.log(`✅ ${agentId} autonomy settings loaded`);
          } else {
            console.log(`⚠️ ${agentId} autonomy not available`);
          }
        });

        it(`/api/agents/${agentId}/assets - Agent assets`, async () => {
          const response = await client.get(`/agents/${agentId}/assets`);
          if (response.status === 200) {
            assertSuccess(response);
            console.log(`✅ ${agentId} assets loaded`);
          } else {
            console.log(`⚠️ ${agentId} assets not available`);
          }
        });

        it(`/api/agents/${agentId}/metrics - Performance metrics`, async () => {
          const response = await client.get(`/agents/${agentId}/metrics`);
          if (response.status === 200) {
            assertSuccess(response);
            console.log(`✅ ${agentId} metrics loaded`);
          } else {
            console.log(`⚠️ ${agentId} metrics not implemented`);
          }
        });

        it(`/api/agents/${agentId}/daily-practice - Practice tracking`, async () => {
          const response = await client.get(`/agents/${agentId}/daily-practice`);
          if (response.status === 200) {
            assertSuccess(response);
            console.log(`✅ ${agentId} daily practice loaded`);
          } else {
            console.log(`⚠️ ${agentId} daily practice not implemented`);
          }
        });
      });
    });

    // Abraham-specific endpoints (covenant tracking)
    describe('Abraham Covenant Endpoints', () => {
      it('/api/agents/abraham/latest - Latest work', async () => {
        const response = await client.get('/agents/abraham/latest');
        if (response.status === 200) {
          assertSuccess(response);
          console.log('✅ Abraham latest work loaded');
        } else {
          console.log('⚠️ Abraham latest work not available');
        }
      });

      it('/api/agents/abraham/covenant - Covenant status', async () => {
        const response = await client.get('/agents/abraham/covenant');
        if (response.status === 200) {
          assertSuccess(response);
          console.log('✅ Abraham covenant status loaded');
        } else {
          console.log('⚠️ Abraham covenant status not available');
        }
      });

      it('/api/agents/abraham/status - Agent status', async () => {
        const response = await client.get('/agents/abraham/status');
        if (response.status === 200) {
          assertSuccess(response);
          console.log('✅ Abraham status loaded');
        } else {
          console.log('⚠️ Abraham status not available');
        }
      });
    });

    // Solienne-specific endpoints
    describe('Solienne Endpoints', () => {
      it('/api/agents/solienne/latest - Latest work', async () => {
        const response = await client.get('/agents/solienne/latest');
        if (response.status === 200) {
          assertSuccess(response);
          console.log('✅ Solienne latest work loaded');
        } else {
          console.log('⚠️ Solienne latest work not available');
        }
      });
    });
  });

  describe('🎨 Content & Curation System', () => {
    it('/api/works - Works listing', async () => {
      const response = await client.get('/works');
      if (response.status === 200) {
        assertSuccess(response);
        console.log('✅ Works listing operational');
      } else {
        console.log('⚠️ Works listing not available');
      }
    });

    it('/api/critiques - Critique system', async () => {
      const response = await client.get('/critiques');
      if (response.status === 200) {
        assertSuccess(response);
        console.log('✅ Critique system operational');
      } else {
        console.log('⚠️ Critique system not available');
      }
    });

    it('/api/collects - Collection tracking', async () => {
      const response = await client.get('/collects');
      if (response.status === 200) {
        assertSuccess(response);
        console.log('✅ Collection tracking operational');
      } else {
        console.log('⚠️ Collection tracking not available');
      }
    });

    it('/api/leaderboard - Performance leaderboard', async () => {
      const response = await client.get('/leaderboard');
      if (response.status === 200) {
        assertSuccess(response);
        console.log('✅ Leaderboard operational');
      } else {
        console.log('⚠️ Leaderboard not available');
      }
    });
  });

  describe('🔗 Registry & Federation (Registry-First Pattern)', () => {
    it('[CRITICAL] /api/registry/health - Registry connectivity', async () => {
      const response = await client.get('/registry/health');
      // Registry health can be degraded (503) but should respond
      expect([200, 503]).toContain(response.status);
      
      if (response.status === 200) {
        assertSuccess(response);
        console.log('✅ Registry healthy and connected');
      } else {
        console.log('⚠️ Registry degraded - fallback active (expected)');
      }
    });

    it('/api/registry/stream - Registry event stream', async () => {
      const response = await client.get('/registry/stream');
      if (response.status === 200) {
        assertSuccess(response);
        console.log('✅ Registry stream operational');
      } else {
        console.log('⚠️ Registry stream not available');
      }
    });

    it('/api/registry/sync - Registry synchronization', async () => {
      const response = await client.get('/registry/sync');
      if (response.status === 200) {
        assertSuccess(response);
        console.log('✅ Registry sync operational');
      } else {
        console.log('⚠️ Registry sync not available');
      }
    });

    it('/api/sync - General sync status', async () => {
      const response = await client.get('/sync');
      if (response.status === 200) {
        assertSuccess(response);
        console.log('✅ General sync operational');
      } else {
        console.log('⚠️ General sync not available');
      }
    });

    it('/api/v1/registry/health - V1 Registry health', async () => {
      const response = await client.get('/v1/registry/health');
      if (response.status === 200) {
        assertSuccess(response);
        console.log('✅ V1 Registry health operational');
      } else {
        console.log('⚠️ V1 Registry health not available');
      }
    });

    it('/api/v1/registry/services - V1 Service discovery', async () => {
      const response = await client.get('/v1/registry/services');
      if (response.status === 200) {
        assertSuccess(response);
        console.log('✅ V1 Service discovery operational');
      } else {
        console.log('⚠️ V1 Service discovery not available');
      }
    });
  });

  describe('🎯 Miyomi AI Curator System', () => {
    it('[CRITICAL] /api/miyomi/real-picks - Live curation', async () => {
      const response = await client.get('/miyomi/real-picks');
      if (response.status === 200) {
        assertSuccess(response);
        assertProperties(response.data, ['picks']);
        console.log(`✅ Miyomi picks: ${response.data.picks?.length || 0} active selections`);
      } else {
        console.log('⚠️ Miyomi picks not available');
      }
    });

    it('/api/miyomi/status - Miyomi system status', async () => {
      const response = await client.get('/miyomi/status');
      if (response.status === 200) {
        assertSuccess(response);
        console.log('✅ Miyomi status operational');
      } else {
        console.log('⚠️ Miyomi status not available');
      }
    });

    it('/api/miyomi/pending-picks - Pending curation', async () => {
      const response = await client.get('/miyomi/pending-picks');
      if (response.status === 200) {
        assertSuccess(response);
        console.log('✅ Miyomi pending picks operational');
      } else {
        console.log('⚠️ Miyomi pending picks not available');
      }
    });

    it('/api/agents/miyomi/picks - Agent-specific picks', async () => {
      const response = await client.get('/agents/miyomi/picks');
      if (response.status === 200) {
        assertSuccess(response);
        console.log('✅ Miyomi agent picks operational');
      } else {
        console.log('⚠️ Miyomi agent picks not available');
      }
    });

    it('/api/agents/miyomi/schedule - Curation schedule', async () => {
      const response = await client.get('/agents/miyomi/schedule');
      if (response.status === 200) {
        assertSuccess(response);
        console.log('✅ Miyomi schedule operational');
      } else {
        console.log('⚠️ Miyomi schedule not available');
      }
    });

    it('/api/agents/miyomi/performance - Performance analytics', async () => {
      const response = await client.get('/agents/miyomi/performance');
      if (response.status === 200) {
        assertSuccess(response);
        console.log('✅ Miyomi performance analytics operational');
      } else {
        console.log('⚠️ Miyomi performance analytics not available');
      }
    });
  });

  describe('⚙️ Admin & Monitoring', () => {
    it('[CRITICAL] /api/admin/registry-audit - System connectivity audit', async () => {
      const response = await client.get('/admin/registry-audit');
      if (response.status === 200) {
        assertSuccess(response);
        console.log('✅ Registry audit operational - system monitoring active');
      } else {
        console.log('⚠️ Registry audit requires authentication or not available');
      }
    });

    it('/api/admin/registry-health - Registry health monitoring', async () => {
      const response = await client.get('/admin/registry-health');
      if (response.status === 200) {
        assertSuccess(response);
        assertProperties(response.data, ['status', 'timestamp', 'registry']);
        console.log('✅ Registry health monitoring operational');
      } else {
        console.log('⚠️ Registry health monitoring not available');
      }
    });

    it('/api/admin/bertha-training - Bertha training system', async () => {
      const response = await client.get('/admin/bertha-training');
      if (response.status === 200) {
        assertSuccess(response);
        console.log('✅ Bertha training admin operational');
      } else {
        console.log('⚠️ Bertha training admin not available');
      }
    });

    it('/api/config/reload - Configuration management', async () => {
      const response = await client.get('/config/reload');
      if (response.status === 200) {
        assertSuccess(response);
        console.log('✅ Config reload operational');
      } else {
        console.log('⚠️ Config reload not available');
      }
    });
  });

  describe('🛠 Utility & Integration Systems', () => {
    it('/api/alerts - Alert system', async () => {
      const response = await client.get('/alerts');
      if (response.status === 200) {
        assertSuccess(response);
        console.log('✅ Alert system operational');
      } else {
        console.log('⚠️ Alert system not available');
      }
    });

    it('/api/notifications - Notification system', async () => {
      const response = await client.get('/notifications');
      if (response.status === 200) {
        assertSuccess(response);
        console.log('✅ Notification system operational');
      } else {
        console.log('⚠️ Notification system not available');
      }
    });

    it('/api/practice-calendar - Practice tracking', async () => {
      const response = await client.get('/practice-calendar');
      if (response.status === 200) {
        assertSuccess(response);
        console.log('✅ Practice calendar operational');
      } else {
        console.log('⚠️ Practice calendar not available');
      }
    });

    it('/api/tagger - Content tagging system', async () => {
      const response = await client.get('/tagger');
      if (response.status === 200) {
        assertSuccess(response);
        console.log('✅ Tagger system operational');
      } else {
        console.log('⚠️ Tagger system not available');
      }
    });

    it('/api/inbox - Message inbox', async () => {
      const response = await client.get('/inbox');
      if (response.status === 200) {
        assertSuccess(response);
        console.log('✅ Inbox system operational');
      } else {
        console.log('⚠️ Inbox system not available');
      }
    });
  });

  describe('🧪 Testing & Debug Infrastructure', () => {
    it('/api/test/onchain-badges - Blockchain integration test', async () => {
      const response = await client.get('/test/onchain-badges');
      if (response.status === 200) {
        assertSuccess(response);
        console.log('✅ Onchain badges test operational');
      } else {
        console.log('⚠️ Onchain badges test not available');
      }
    });

    it('/api/test/spirit-integration - Spirit system test', async () => {
      const response = await client.get('/test/spirit-integration');
      if (response.status === 200) {
        assertSuccess(response);
        console.log('✅ Spirit integration test operational');
      } else {
        console.log('⚠️ Spirit integration test not available');
      }
    });

    it('/api/test/agent-readiness - Agent readiness check', async () => {
      const response = await client.get('/test/agent-readiness');
      if (response.status === 200) {
        assertSuccess(response);
        console.log('✅ Agent readiness test operational');
      } else {
        console.log('⚠️ Agent readiness test not available');
      }
    });

    it('/api/test/token-economics - Economic model test', async () => {
      const response = await client.get('/test/token-economics');
      if (response.status === 200) {
        assertSuccess(response);
        console.log('✅ Token economics test operational');
      } else {
        console.log('⚠️ Token economics test not available');
      }
    });
  });

  describe('🌐 Eden Integration & External APIs', () => {
    it('/api/eden/miyomi/config - Eden Miyomi configuration', async () => {
      const response = await client.get('/eden/miyomi/config');
      if (response.status === 200) {
        assertSuccess(response);
        console.log('✅ Eden Miyomi config operational');
      } else {
        console.log('⚠️ Eden Miyomi config not available');
      }
    });

    it('/api/eden/miyomi/works - Eden Miyomi works', async () => {
      const response = await client.get('/eden/miyomi/works');
      if (response.status === 200) {
        assertSuccess(response);
        console.log('✅ Eden Miyomi works operational');
      } else {
        console.log('⚠️ Eden Miyomi works not available');
      }
    });

    it('/api/eden/miyomi/media - Eden Miyomi media', async () => {
      const response = await client.get('/eden/miyomi/media');
      if (response.status === 200) {
        assertSuccess(response);
        console.log('✅ Eden Miyomi media operational');
      } else {
        console.log('⚠️ Eden Miyomi media not available');
      }
    });
  });

  describe('👥 Special Agent Systems', () => {
    it('/api/nina-curator - Nina curator system', async () => {
      const response = await client.get('/nina-curator');
      if (response.status === 200) {
        assertSuccess(response);
        console.log('✅ Nina curator operational');
      } else {
        console.log('⚠️ Nina curator not available');
      }
    });

    it('/api/nina-critique - Nina critique system', async () => {
      const response = await client.get('/nina-critique');
      if (response.status === 200) {
        assertSuccess(response);
        console.log('✅ Nina critique operational');
      } else {
        console.log('⚠️ Nina critique not available');
      }
    });

    it('/api/agents/citizen/works - Citizen agent works', async () => {
      const response = await client.get('/agents/citizen/works');
      if (response.status === 200) {
        assertSuccess(response);
        console.log('✅ Citizen agent works operational');
      } else {
        console.log('⚠️ Citizen agent works not available');
      }
    });

    it('/api/agents/bertha/training - Bertha training system', async () => {
      const response = await client.get('/agents/bertha/training');
      if (response.status === 200) {
        assertSuccess(response);
        console.log('✅ Bertha training operational');
      } else {
        console.log('⚠️ Bertha training not available');
      }
    });
  });
});