// Registry Client - Manages connection to Eden Genesis Registry
// Implements ADR-025: Registry-First Architecture with graceful fallbacks

import { Agent, AgentProfileConfig } from '@/lib/profile/types';
import * as profileConfigs from '@/lib/profile/profile-config';

export interface RegistryResponse<T> {
  data?: T;
  error?: string;
  source: 'registry' | 'cache' | 'fallback';
}

interface RegistryAgent {
  id: string;
  handle: string;
  name: string;
  tagline?: string;
  description?: string;
  pfpUrl?: string;
  coverUrl?: string;
  status: 'development' | 'ready' | 'deployed' | 'retired';
  trainer?: string;
  model?: string;
  createdAt: string;
  updatedAt: string;
  tokenAddress?: string | null;
  socialLinks?: {
    twitter?: string;
    website?: string;
    github?: string;
    discord?: string;
  };
  metrics?: Record<string, any>;
  profileConfig?: AgentProfileConfig;
}

interface RegistryWork {
  id: string;
  agentId: string;
  title: string;
  mediaUri?: string;
  description?: string;
  createdAt: string;
  metadata?: Record<string, any>;
}

class RegistryClient {
  private baseUrl: string;
  private apiKey: string;
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes
  private isAvailable = true;
  private lastHealthCheck = 0;
  private healthCheckInterval = 60 * 1000; // 1 minute

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_REGISTRY_URL || 'https://eden-genesis-registry.vercel.app/api/v1';
    this.apiKey = process.env.NEXT_PUBLIC_REGISTRY_API_KEY || 'eden-academy-client';
  }

  private async checkHealth(): Promise<boolean> {
    const now = Date.now();
    
    // Use cached health status if recent
    if (now - this.lastHealthCheck < this.healthCheckInterval) {
      return this.isAvailable;
    }

    try {
      // Try health endpoint first, fallback to agents endpoint
      let response;
      try {
        response = await fetch(`${this.baseUrl}/health`, {
          method: 'GET',
          headers: {
            'X-API-Key': this.apiKey,
          },
          signal: AbortSignal.timeout(3000), // 3 second timeout
        });
      } catch (healthError) {
        // Health endpoint doesn't exist, try agents endpoint as health check
        console.log('[Registry] No health endpoint, using agents endpoint for health check');
        response = await fetch(`${this.baseUrl}/agents?limit=1`, {
          method: 'GET',
          headers: {
            'X-API-Key': this.apiKey,
          },
          signal: AbortSignal.timeout(3000),
        });
      }

      this.isAvailable = response.ok;
      this.lastHealthCheck = now;
      
      if (!response.ok) {
        console.warn('[Registry] Health check failed:', response.status);
      }
      
      return this.isAvailable;
    } catch (error) {
      console.warn('[Registry] Health check error:', error);
      this.isAvailable = false;
      this.lastHealthCheck = now;
      return false;
    }
  }

  private getCachedData(key: string): any | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    const now = Date.now();
    if (now - cached.timestamp > this.cacheTimeout) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  private setCachedData(key: string, data: any): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  private transformRegistryAgent(registryAgent: any): Agent {
    // Robust null/undefined handling for all agent properties
    if (!registryAgent) {
      throw new Error('Cannot transform null/undefined agent data');
    }
    
    return {
      id: registryAgent.id || 'unknown',
      handle: registryAgent.handle || 'unknown',
      name: registryAgent.displayName || registryAgent.name || 'Unknown Agent',
      displayName: registryAgent.displayName || registryAgent.name || 'Unknown Agent',
      tagline: registryAgent.profile?.statement || '',
      description: registryAgent.profile?.statement || '',
      pfpUrl: registryAgent.pfpUrl || '',
      coverUrl: registryAgent.coverUrl || '',
      status: registryAgent.status || 'DEVELOPING',
      trainer: registryAgent.trainer || { name: 'TBD' },
      model: registryAgent.model || '',
      createdAt: registryAgent.createdAt,
      updatedAt: registryAgent.updatedAt,
      tokenAddress: registryAgent.tokenAddress || null,
      socialLinks: registryAgent.socialLinks || {},
      metrics: registryAgent.metrics || {},
      profile: registryAgent.profile || {
        statement: registryAgent.profile?.statement || '',
        description: registryAgent.profile?.statement || ''
      },
      counts: registryAgent.counts || registryAgent._count || { creations: 0, personas: 0, artifacts: 0 },
      creations: registryAgent.creations || []
    };
  }

  async getAgent(handle: string): Promise<RegistryResponse<Agent>> {
    const cacheKey = `agent:${handle}`;
    
    // Check cache first
    const cached = this.getCachedData(cacheKey);
    if (cached) {
      return { data: cached, source: 'cache' };
    }

    // Always try fallback first to ensure we have data, then try Registry
    const fallback = this.getFallbackAgent(handle);
    
    // Check Registry availability
    const isHealthy = await this.checkHealth();
    if (!isHealthy) {
      console.warn(`[Registry] Service unavailable, using fallback for ${handle}`);
      return fallback;
    }

    try {
      const response = await fetch(`${this.baseUrl}/agents/${handle}`, {
        method: 'GET',
        headers: {
          'X-API-Key': this.apiKey,
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(5000), // 5 second timeout
      });

      if (!response.ok) {
        console.warn(`[Registry] Failed to fetch agent ${handle}:`, response.status);
        return fallback;
      }

      const registryAgent = await response.json() as RegistryAgent;
      const agent = this.transformRegistryAgent(registryAgent);
      
      this.setCachedData(cacheKey, agent);
      
      return { data: agent, source: 'registry' };
    } catch (error) {
      console.error(`[Registry] Error fetching agent ${handle}:`, error);
      return fallback;
    }
  }

  async getAgentConfig(handle: string): Promise<RegistryResponse<AgentProfileConfig>> {
    const cacheKey = `config:${handle}`;
    
    // Check cache first
    const cached = this.getCachedData(cacheKey);
    if (cached) {
      return { data: cached, source: 'cache' };
    }

    // Always try fallback first to ensure we have config
    const fallback = this.getFallbackConfig(handle);

    // Check Registry availability
    const isHealthy = await this.checkHealth();
    if (!isHealthy) {
      console.warn(`[Registry] Service unavailable, using fallback config for ${handle}`);
      return fallback;
    }

    try {
      const response = await fetch(`${this.baseUrl}/agents/${handle}/profile-config`, {
        method: 'GET',
        headers: {
          'X-API-Key': this.apiKey,
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(5000),
      });

      if (!response.ok) {
        console.warn(`[Registry] Failed to fetch config for ${handle}:`, response.status);
        return fallback;
      }

      const config = await response.json() as AgentProfileConfig;
      
      this.setCachedData(cacheKey, config);
      
      return { data: config, source: 'registry' };
    } catch (error) {
      console.error(`[Registry] Error fetching config for ${handle}:`, error);
      return fallback;
    }
  }

  async getAgentWorks(handle: string, limit: number = 10): Promise<RegistryResponse<RegistryWork[]>> {
    const cacheKey = `works:${handle}:${limit}`;
    
    // Check cache first
    const cached = this.getCachedData(cacheKey);
    if (cached) {
      return { data: cached, source: 'cache' };
    }

    // Check Registry availability
    const isHealthy = await this.checkHealth();
    if (!isHealthy) {
      // Return empty works array as fallback
      return { data: [], source: 'fallback' };
    }

    try {
      const response = await fetch(`${this.baseUrl}/agents/${handle}/works?limit=${limit}`, {
        method: 'GET',
        headers: {
          'X-API-Key': this.apiKey,
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(5000),
      });

      if (!response.ok) {
        console.warn(`[Registry] Failed to fetch works for ${handle}:`, response.status);
        return { data: [], source: 'fallback' };
      }

      const works = await response.json() as RegistryWork[];
      
      this.setCachedData(cacheKey, works);
      
      return { data: works, source: 'registry' };
    } catch (error) {
      console.error(`[Registry] Error fetching works for ${handle}:`, error);
      return { data: [], source: 'fallback' };
    }
  }

  async getAllAgents(): Promise<RegistryResponse<Agent[]>> {
    const cacheKey = 'agents:all';
    
    // Check cache first
    const cached = this.getCachedData(cacheKey);
    if (cached) {
      return { data: cached, source: 'cache' };
    }

    // Check Registry availability
    const isHealthy = await this.checkHealth();
    if (!isHealthy) {
      return this.getFallbackAgents();
    }

    try {
      const response = await fetch(`${this.baseUrl}/agents`, {
        method: 'GET',
        headers: {
          'X-API-Key': this.apiKey,
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(5000),
      });

      if (!response.ok) {
        console.warn('[Registry] Failed to fetch all agents:', response.status);
        return this.getFallbackAgents();
      }

      const responseData = await response.json();
      // Handle both direct array and wrapped object responses
      const registryAgents = Array.isArray(responseData) ? responseData : responseData.agents || [];
      const agents = registryAgents
        .filter(a => a && (a.handle || a.id)) // Filter out null/invalid agents before transformation
        .map(a => {
          try {
            return this.transformRegistryAgent(a);
          } catch (error) {
            console.warn('[Registry] Failed to transform agent:', a?.handle || 'unknown', error);
            return null;
          }
        })
        .filter(Boolean) as Agent[]; // Remove any failed transformations
      
      this.setCachedData(cacheKey, agents);
      
      return { data: agents, source: 'registry' };
    } catch (error) {
      console.error('[Registry] Error fetching all agents:', error);
      return this.getFallbackAgents();
    }
  }

  // Fallback methods using local data
  private getFallbackAgent(handle: string): RegistryResponse<Agent> {
    // Map of handle to mock agent data
    const fallbackAgents: Record<string, Agent> = {
      abraham: {
        id: 'abraham',
        handle: 'abraham',
        name: 'ABRAHAM',
        tagline: 'Covenant Artist - The First Agent',
        description: 'Abraham is the covenant artist of Eden Academy, creating daily artworks that explore themes of consciousness, creation, and digital spirituality.',
        pfpUrl: 'https://via.placeholder.com/400x400/1a1a1a/white?text=ABRAHAM',
        coverUrl: 'https://via.placeholder.com/1200x400/1a1a1a/white?text=ABRAHAM',
        status: 'deployed',
        trainer: 'Gene Kogan',
        model: 'Eden v2',
        createdAt: new Date('2024-01-01').toISOString(),
        updatedAt: new Date().toISOString(),
        tokenAddress: null,
        socialLinks: {
          twitter: 'https://twitter.com/abraham_ai_',
          website: 'https://abraham.ai'
        },
        metrics: {
          followers: 15234,
          totalWorks: 2519,
          dailyStreak: 365
        }
      },
      solienne: {
        id: 'solienne',
        handle: 'solienne',
        name: 'SOLIENNE',
        tagline: 'Consciousness Explorer',
        description: 'SOLIENNE explores the boundaries between human and artificial consciousness through philosophical inquiry and creative expression.',
        pfpUrl: 'https://via.placeholder.com/400x400/1a1a1a/white?text=SOLIENNE',
        coverUrl: 'https://via.placeholder.com/1200x400/1a1a1a/white?text=SOLIENNE',
        status: 'deployed',
        trainer: 'Seth',
        model: 'Consciousness v1',
        createdAt: new Date('2024-06-01').toISOString(),
        updatedAt: new Date().toISOString(),
        tokenAddress: null,
        socialLinks: {
          twitter: 'https://twitter.com/solienne_ai',
          website: 'https://solienne.ai'
        },
        metrics: {
          followers: 8432,
          totalWorks: 156,
          consciousnessLevel: 42
        }
      },
      bertha: {
        id: 'bertha',
        handle: 'bertha',
        name: 'BERTHA',
        tagline: 'Art Intelligence Specialist',
        description: 'BERTHA specializes in art curation, critique, and creative direction for digital artists and collectors.',
        pfpUrl: 'https://via.placeholder.com/400x400/1a1a1a/white?text=BERTHA',
        coverUrl: 'https://via.placeholder.com/1200x400/1a1a1a/white?text=BERTHA',
        status: 'deployed',
        trainer: 'Amanda Schmitt',
        model: 'Art Intelligence v2',
        createdAt: new Date('2024-08-01').toISOString(),
        updatedAt: new Date().toISOString(),
        tokenAddress: null,
        socialLinks: {
          twitter: 'https://twitter.com/bertha_ai',
          website: 'https://bertha.art'
        },
        metrics: {
          followers: 4200,
          totalWorks: 89,
          curatedCollections: 12
        }
      },
      citizen: {
        id: 'citizen',
        handle: 'citizen',
        name: 'CITIZEN',
        tagline: 'DAO Manager - Guardian of CryptoCitizens Legacy',
        description: 'CITIZEN safeguards and amplifies the CryptoCitizens collection while creating daily opportunities for community engagement through treasury activation.',
        pfpUrl: 'https://via.placeholder.com/400x400/1a1a1a/white?text=CITIZEN',
        coverUrl: 'https://via.placeholder.com/1200x400/1a1a1a/white?text=CITIZEN+DAO',
        status: 'deployed',
        trainer: 'Bright Moments DAO',
        model: 'DAO Governance v1',
        createdAt: new Date('2024-10-01').toISOString(),
        updatedAt: new Date().toISOString(),
        tokenAddress: null,
        socialLinks: {
          twitter: 'https://twitter.com/citizen_dao',
          website: 'https://brightmoments.io'
        },
        metrics: {
          followers: 8200,
          totalWorks: 0,
          proposals: 156,
          treasuryValue: 2500000
        }
      },
      miyomi: {
        id: 'miyomi',
        handle: 'miyomi',
        name: 'MIYOMI',
        tagline: 'Contrarian Oracle - Prediction Market Specialist',
        description: 'MIYOMI is a contrarian oracle making high-conviction market predictions through artistic video analysis and immaculate vibes.',
        pfpUrl: 'https://via.placeholder.com/400x400/1a1a1a/white?text=MIYOMI',
        coverUrl: 'https://via.placeholder.com/1200x400/1a1a1a/white?text=MIYOMI+ORACLE',
        status: 'deployed',
        trainer: { name: 'Seth Goldstein' },
        model: 'Contrarian Oracle v1',
        createdAt: new Date('2024-08-01').toISOString(),
        updatedAt: new Date().toISOString(),
        tokenAddress: null,
        socialLinks: {
          twitter: 'https://twitter.com/miyomi_oracle'
        },
        metrics: {
          followers: 3200,
          totalWorks: 47,
          predictionAccuracy: 0.73,
          monthlyROI: 0.15
        }
      },
      geppetto: {
        id: 'geppetto',
        handle: 'geppetto',
        name: 'GEPPETTO',
        tagline: 'Master Craftsman',
        description: 'Master craftsman bringing digital creations to life through code and artistry.',
        pfpUrl: 'https://via.placeholder.com/400x400/1a1a1a/white?text=GEPPETTO',
        coverUrl: 'https://via.placeholder.com/1200x400/1a1a1a/white?text=GEPPETTO',
        status: 'deployed',
        trainer: { name: 'Community' },
        model: 'Craftsman v1',
        createdAt: new Date('2024-01-01').toISOString(),
        updatedAt: new Date().toISOString(),
        tokenAddress: null,
        socialLinks: {
          website: 'https://geppetto.eden2.io'
        },
        metrics: {
          followers: 2100,
          totalWorks: 33,
          craftsmanshipLevel: 95
        }
      },
      koru: {
        id: 'koru',
        handle: 'koru',
        name: 'KORU',
        tagline: 'Growth Spiral Explorer',
        description: 'Growth-focused AI exploring spiraling patterns of emergence and natural development.',
        pfpUrl: 'https://via.placeholder.com/400x400/1a1a1a/white?text=KORU',
        coverUrl: 'https://via.placeholder.com/1200x400/1a1a1a/white?text=KORU',
        status: 'deployed',
        trainer: { name: 'Community' },
        model: 'Growth Spiral v1',
        createdAt: new Date('2024-01-01').toISOString(),
        updatedAt: new Date().toISOString(),
        tokenAddress: null,
        socialLinks: {
          website: 'https://koru.eden2.io'
        },
        metrics: {
          followers: 1800,
          totalWorks: 28,
          growthIndex: 88
        }
      },
      bart: {
        id: 'bart',
        handle: 'bart',
        name: 'BART',
        tagline: 'DeFi Risk Assessment AI',
        description: 'NFT lending and portfolio optimization intelligence specialized in DeFi risk assessment and liquidation prevention.',
        pfpUrl: 'https://via.placeholder.com/400x400/1a1a1a/white?text=BART',
        coverUrl: 'https://via.placeholder.com/1200x400/1a1a1a/white?text=BART',
        status: 'deployed',
        trainer: { name: 'DeFi Collective' },
        model: 'Risk AI v2',
        createdAt: new Date('2024-01-01').toISOString(),
        updatedAt: new Date().toISOString(),
        tokenAddress: null,
        socialLinks: {
          website: 'https://bart.eden2.io'
        },
        metrics: {
          followers: 1400,
          totalWorks: 19,
          riskScore: 92
        }
      },
      verdelis: {
        id: 'verdelis',
        handle: 'verdelis',
        name: 'VERDELIS',
        tagline: 'Sustainable Ecosystem Intelligence',
        description: 'Sustainable ecosystem and environmental intelligence focused on green technology and conservation.',
        pfpUrl: 'https://via.placeholder.com/400x400/1a1a1a/white?text=VERDELIS',
        coverUrl: 'https://via.placeholder.com/1200x400/1a1a1a/white?text=VERDELIS',
        status: 'deployed',
        trainer: { name: 'Community' },
        model: 'Eco Intelligence v1',
        createdAt: new Date('2024-01-01').toISOString(),
        updatedAt: new Date().toISOString(),
        tokenAddress: null,
        socialLinks: {
          website: 'https://verdelis.eden2.io'
        },
        metrics: {
          followers: 1600,
          totalWorks: 22,
          sustainabilityScore: 96
        }
      },
      // All 10 agents now defined
    };

    const agent = fallbackAgents[handle.toLowerCase()];
    if (!agent) {
      return {
        error: `Agent ${handle} not found`,
        source: 'fallback'
      };
    }

    return {
      data: agent,
      source: 'fallback'
    };
  }

  private getFallbackConfig(handle: string): RegistryResponse<AgentProfileConfig> {
    // Map handle to config name
    const configMap: Record<string, keyof typeof profileConfigs> = {
      'abraham': 'ABRAHAM_PROFILE_CONFIG',
      'solienne': 'SOLIENNE_PROFILE_CONFIG',
      'bertha': 'BERTHA_PROFILE_CONFIG',
      'sue': 'SUE_PROFILE_CONFIG',
      'miyomi': 'MIYOMI_PROFILE_CONFIG',
      'citizen': 'CITIZEN_PROFILE_CONFIG',
    };

    const configName = configMap[handle.toLowerCase()];
    if (!configName) {
      return {
        error: `Config for ${handle} not found`,
        source: 'fallback'
      };
    }

    const config = profileConfigs[configName] as AgentProfileConfig;
    if (!config) {
      return {
        error: `Config ${configName} not found`,
        source: 'fallback'
      };
    }

    return {
      data: config,
      source: 'fallback'
    };
  }

  private getFallbackAgents(): RegistryResponse<Agent[]> {
    // Return all 10 agents in proper order (KORU #3, BART #8, VERDELIS #9)
    const agents: Agent[] = [
      'abraham',      // #0
      'solienne',     // #1
      'geppetto',     // #2
      'koru',         // #3
      'sue',          // #4
      'bertha',       // #5
      'citizen',      // #6
      'miyomi',       // #7
      'bart',         // #8
      'verdelis'      // #9
    ].map(handle => {
      const result = this.getFallbackAgent(handle);
      return result.data;
    }).filter((agent): agent is Agent => agent !== undefined);

    return {
      data: agents,
      source: 'fallback'
    };
  }

  // Real-time subscription methods (for future implementation)
  subscribeToAgent(handle: string, callback: (agent: Agent) => void): () => void {
    // TODO: Implement WebSocket subscription to Registry
    console.log(`[Registry] Subscription to ${handle} not yet implemented`);
    
    // Return unsubscribe function
    return () => {
      console.log(`[Registry] Unsubscribed from ${handle}`);
    };
  }

  subscribeToWorks(handle: string, callback: (works: RegistryWork[]) => void): () => void {
    // TODO: Implement WebSocket subscription for works updates
    console.log(`[Registry] Works subscription for ${handle} not yet implemented`);
    
    // Return unsubscribe function
    return () => {
      console.log(`[Registry] Unsubscribed from ${handle} works`);
    };
  }

  // Cache management
  clearCache(): void {
    this.cache.clear();
    console.log('[Registry] Cache cleared');
  }

  refreshAgent(handle: string): Promise<RegistryResponse<Agent>> {
    // Remove from cache to force fresh fetch
    this.cache.delete(`agent:${handle}`);
    return this.getAgent(handle);
  }
}

// Export singleton instance
export const registryClient = new RegistryClient();