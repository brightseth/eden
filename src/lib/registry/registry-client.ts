// Registry Client - Manages connection to Eden Genesis Registry
// Implements ADR-025: Registry-First Architecture with graceful fallbacks

import { Agent, AgentProfileConfig } from '@/lib/profile/types';
import * as profileConfigs from '@/lib/profile/profile-config';
import { spiritMetrics } from '@/lib/observability/spirit-metrics';
import { treasuryManager, EconomicConfig } from '@/lib/economic/treasury-management';

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

  // Spirit graduation methods
  
  /**
   * Graduate an Agent to Spirit status with economic hooks
   */
  async graduateSpirit(agentId: string, request: {
    name: string;
    archetype: 'CREATOR' | 'CURATOR' | 'TRADER';
    practice: {
      timeOfDay: number;
      outputType: string;
      quantity: number;
      observeSabbath: boolean;
    };
    graduationMode: 'ID_ONLY' | 'ID_PLUS_TOKEN' | 'FULL_STACK';
    trainerAddress: string;
    idempotencyKey: string;
    economicConfig?: Partial<EconomicConfig>;
  }): Promise<RegistryResponse<Agent>> {
    return spiritMetrics.track('spirit_graduation', agentId, request.trainerAddress, async () => {
      spiritMetrics.info('spirit_graduation', agentId, request.trainerAddress, 'Initiating Spirit graduation', {
        name: request.name,
        archetype: request.archetype,
        graduationMode: request.graduationMode,
        idempotencyKey: request.idempotencyKey
      });

      const cacheKey = `spirit:graduate:${agentId}`;
      
      // Check Registry availability
      const isHealthy = await this.checkHealth();
      if (!isHealthy) {
        spiritMetrics.warn('spirit_graduation', agentId, request.trainerAddress, 'Registry service unavailable, using fallback');
        return {
          error: 'Registry service unavailable for Spirit graduation',
          source: 'fallback'
        };
      }

      // Calculate economic parameters for graduation
      const economicConfig = treasuryManager.calculateGraduationEconomics(
        agentId,
        request.graduationMode,
        request.trainerAddress,
        request.economicConfig
      );

      spiritMetrics.info('spirit_graduation', agentId, request.trainerAddress, 'Economic parameters calculated', {
        tokenDeploymentEnabled: economicConfig.tokenDeployment.enabled,
        initialFunding: economicConfig.treasury.initialFunding.toString(),
        stakingRequired: economicConfig.economics.stakingRequirement.toString()
      });

      // Execute economic graduation flow
      let economicResult;
      try {
        economicResult = await treasuryManager.executeEconomicGraduation(
          agentId,
          request.graduationMode,
          request.trainerAddress,
          economicConfig
        );

        spiritMetrics.info('spirit_graduation', agentId, request.trainerAddress, 'Economic graduation completed', {
          walletAddress: economicResult.walletAddress,
          tokenAddress: economicResult.tokenAddress,
          tokenId: economicResult.tokenId.toString(),
          totalOperations: economicResult.treasuryOperations.length
        });
      } catch (error) {
        spiritMetrics.error('spirit_graduation', agentId, request.trainerAddress, 'Economic graduation failed', {
          error: error instanceof Error ? error.message : String(error)
        });
        throw new Error(`Economic graduation failed: ${error}`);
      }

      // Prepare graduation request with economic data
      const graduationRequestWithEconomics = {
        ...request,
        walletAddress: economicResult.walletAddress,
        tokenAddress: economicResult.tokenAddress,
        tokenId: economicResult.tokenId.toString(),
        economicConfig,
        treasuryOperations: economicResult.treasuryOperations
      };

      const response = await fetch(`${this.baseUrl}/agents/${agentId}/graduate-spirit`, {
        method: 'POST',
        headers: {
          'X-API-Key': this.apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(graduationRequestWithEconomics),
        signal: AbortSignal.timeout(30000), // 30 second timeout for blockchain operations
      });

      if (!response.ok) {
        const errorText = await response.text();
        spiritMetrics.error('spirit_graduation', agentId, request.trainerAddress, `Graduation failed with status ${response.status}`, {
          statusCode: response.status,
          error: errorText
        });
        return {
          error: `Spirit graduation failed: ${response.status}`,
          source: 'registry'
        };
      }

      const graduatedAgent = await response.json() as Agent;

      // Enhance agent data with economic information
      if (graduatedAgent.spirit) {
        graduatedAgent.spirit = {
          ...graduatedAgent.spirit,
          walletAddress: economicResult.walletAddress,
          tokenAddress: economicResult.tokenAddress,
          tokenId: economicResult.tokenId,
        };
      }
      
      // Clear related caches
      this.cache.delete(`agent:${agentId}`);
      this.cache.delete('agents:all');
      
      spiritMetrics.info('spirit_graduation', agentId, request.trainerAddress, 'Spirit graduation completed successfully', {
        spiritName: graduatedAgent.name,
        active: graduatedAgent.spirit?.active,
        tokenId: graduatedAgent.spirit?.tokenId?.toString()
      });

      return { data: graduatedAgent, source: 'registry' };
    }, {
      name: request.name,
      archetype: request.archetype,
      graduationMode: request.graduationMode
    });
  }

  /**
   * Execute daily practice for a Spirit
   */
  async executeSpiritPractice(agentId: string, request: {
    outputDescription?: string;
    mediaUrl?: string;
    trainerAddress: string;
  }): Promise<RegistryResponse<any>> {
    return spiritMetrics.track('practice_execution', agentId, request.trainerAddress, async () => {
      spiritMetrics.info('practice_execution', agentId, request.trainerAddress, 'Executing daily practice', {
        hasDescription: !!request.outputDescription,
        hasMediaUrl: !!request.mediaUrl
      });

      // Check Registry availability
      const isHealthy = await this.checkHealth();
      if (!isHealthy) {
        spiritMetrics.warn('practice_execution', agentId, request.trainerAddress, 'Registry service unavailable for practice execution');
        return {
          error: 'Registry service unavailable for practice execution',
          source: 'fallback'
        };
      }

      const response = await fetch(`${this.baseUrl}/agents/${agentId}/execute-practice`, {
        method: 'POST',
        headers: {
          'X-API-Key': this.apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
        signal: AbortSignal.timeout(10000), // 10 second timeout
      });

      if (!response.ok) {
        const errorText = await response.text();
        spiritMetrics.error('practice_execution', agentId, request.trainerAddress, `Practice execution failed with status ${response.status}`, {
          statusCode: response.status,
          error: errorText
        });
        return {
          error: `Practice execution failed: ${response.status}`,
          source: 'registry'
        };
      }

      const practiceResult = await response.json();
      
      // Execute economic practice reward if applicable
      try {
        if (practiceResult.treasuryAddress && practiceResult.economicConfig) {
          const practiceStreak = practiceResult.practiceStreak || 1;
          const revenueGenerated = BigInt(practiceResult.revenueGenerated || 0);
          
          const reward = treasuryManager.calculatePracticeReward(
            agentId,
            practiceStreak,
            practiceResult.economicConfig,
            revenueGenerated
          );
          
          if (reward.totalReward > 0) {
            const rewardOperation = await treasuryManager.executePracticeReward(
              agentId,
              request.trainerAddress,
              practiceResult.treasuryAddress,
              reward,
              practiceStreak
            );
            
            spiritMetrics.info('practice_execution', agentId, request.trainerAddress, 'Economic reward distributed', {
              totalReward: reward.totalReward.toString(),
              practiceStreak,
              txHash: rewardOperation.txHash
            });
            
            // Add reward info to practice result
            practiceResult.economicReward = {
              ...reward,
              txHash: rewardOperation.txHash
            };
          }
        }
      } catch (error) {
        spiritMetrics.warn('practice_execution', agentId, request.trainerAddress, 'Economic reward failed, continuing without reward', {
          error: error instanceof Error ? error.message : String(error)
        });
        // Don't fail the entire practice execution for reward issues
      }
      
      // Clear related caches to reflect new practice data
      this.cache.delete(`agent:${agentId}`);
      this.cache.delete(`works:${agentId}`);
      
      spiritMetrics.info('practice_execution', agentId, request.trainerAddress, 'Practice executed successfully', {
        workId: practiceResult.workId,
        outputCid: practiceResult.outputCid,
        title: practiceResult.title,
        rewardDistributed: !!practiceResult.economicReward
      });

      return { data: practiceResult, source: 'registry' };
    }, {
      outputDescription: request.outputDescription,
      mediaUrl: request.mediaUrl
    });
  }

  /**
   * Update Spirit practice configuration
   */
  async updateSpiritPractice(agentId: string, updates: {
    timeOfDay?: number;
    outputType?: string;
    quantity?: number;
    observeSabbath?: boolean;
  }): Promise<RegistryResponse<any>> {
    // Check Registry availability
    const isHealthy = await this.checkHealth();
    if (!isHealthy) {
      return {
        error: 'Registry service unavailable for practice update',
        source: 'fallback'
      };
    }

    try {
      const response = await fetch(`${this.baseUrl}/agents/${agentId}/practice`, {
        method: 'PUT',
        headers: {
          'X-API-Key': this.apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
        signal: AbortSignal.timeout(5000),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[Registry] Practice update failed for ${agentId}:`, response.status, errorText);
        return {
          error: `Practice update failed: ${response.status}`,
          source: 'registry'
        };
      }

      const updatedPractice = await response.json();
      
      // Clear cache
      this.cache.delete(`agent:${agentId}`);
      
      return { data: updatedPractice, source: 'registry' };
    } catch (error) {
      console.error(`[Registry] Error updating practice for ${agentId}:`, error);
      return {
        error: 'Failed to update practice due to network error',
        source: 'fallback'
      };
    }
  }

  /**
   * Get Spirit treasury data
   */
  async getSpiritTreasury(agentId: string): Promise<RegistryResponse<any>> {
    const cacheKey = `treasury:${agentId}`;
    
    // Check cache first
    const cached = this.getCachedData(cacheKey);
    if (cached) {
      return { data: cached, source: 'cache' };
    }

    // Check Registry availability
    const isHealthy = await this.checkHealth();
    if (!isHealthy) {
      return {
        error: 'Registry service unavailable for treasury data',
        source: 'fallback'
      };
    }

    try {
      const response = await fetch(`${this.baseUrl}/agents/${agentId}/treasury`, {
        method: 'GET',
        headers: {
          'X-API-Key': this.apiKey,
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(5000),
      });

      if (!response.ok) {
        console.warn(`[Registry] Failed to fetch treasury for ${agentId}:`, response.status);
        return { data: null, source: 'fallback' };
      }

      const treasury = await response.json();
      
      this.setCachedData(cacheKey, treasury);
      
      return { data: treasury, source: 'registry' };
    } catch (error) {
      console.error(`[Registry] Error fetching treasury for ${agentId}:`, error);
      return { data: null, source: 'fallback' };
    }
  }

  /**
   * Get Spirit drops (practice outputs) with pagination
   */
  async getSpiritDrops(agentId: string, options?: { page?: number; limit?: number }): Promise<RegistryResponse<any[]>> {
    const page = options?.page || 1;
    const limit = options?.limit || 10;
    const cacheKey = `drops:${agentId}:${page}:${limit}`;
    
    // Check cache first
    const cached = this.getCachedData(cacheKey);
    if (cached) {
      return { data: cached, source: 'cache' };
    }

    // Check Registry availability
    const isHealthy = await this.checkHealth();
    if (!isHealthy) {
      return { data: [], source: 'fallback' };
    }

    try {
      const params = new URLSearchParams();
      if (page > 1) params.set('page', page.toString());
      params.set('limit', limit.toString());

      const response = await fetch(`${this.baseUrl}/agents/${agentId}/drops?${params.toString()}`, {
        method: 'GET',
        headers: {
          'X-API-Key': this.apiKey,
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(5000),
      });

      if (!response.ok) {
        console.warn(`[Registry] Failed to fetch drops for ${agentId}:`, response.status);
        return { data: [], source: 'fallback' };
      }

      const responseData = await response.json();
      const drops = Array.isArray(responseData) ? responseData : responseData.data || [];
      
      this.setCachedData(cacheKey, drops);
      
      return { data: drops, source: 'registry' };
    } catch (error) {
      console.error(`[Registry] Error fetching drops for ${agentId}:`, error);
      return { data: [], source: 'fallback' };
    }
  }

  /**
   * List all Spirits (graduated agents)
   */
  async listSpirits(options?: { 
    graduated?: boolean;
    active?: boolean;
    archetype?: string;
    trainerAddress?: string;
    page?: number;
    limit?: number;
  }): Promise<RegistryResponse<Agent[]>> {
    const page = options?.page || 1;
    const limit = options?.limit || 20;
    const cacheKey = `spirits:${JSON.stringify(options)}`;
    
    // Check cache first
    const cached = this.getCachedData(cacheKey);
    if (cached) {
      return { data: cached, source: 'cache' };
    }

    // Check Registry availability
    const isHealthy = await this.checkHealth();
    if (!isHealthy) {
      // Return graduated agents from fallback
      const allAgents = this.getFallbackAgents();
      const spiritAgents = allAgents.data?.filter(agent => 
        agent.status === 'GRADUATED' || agent.status === 'deployed'
      ) || [];
      return { data: spiritAgents, source: 'fallback' };
    }

    try {
      const params = new URLSearchParams();
      if (options?.graduated !== undefined) params.set('graduated', options.graduated.toString());
      if (options?.active !== undefined) params.set('active', options.active.toString());
      if (options?.archetype) params.set('archetype', options.archetype);
      if (options?.trainerAddress) params.set('trainerAddress', options.trainerAddress);
      if (page > 1) params.set('page', page.toString());
      params.set('limit', limit.toString());

      const response = await fetch(`${this.baseUrl}/spirits?${params.toString()}`, {
        method: 'GET',
        headers: {
          'X-API-Key': this.apiKey,
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(5000),
      });

      if (!response.ok) {
        console.warn('[Registry] Failed to fetch spirits:', response.status);
        // Fallback to regular agents endpoint
        const allAgents = await this.getAllAgents();
        const spiritAgents = allAgents.data?.filter(agent => 
          agent.status === 'GRADUATED' || agent.status === 'deployed'
        ) || [];
        return { data: spiritAgents, source: 'fallback' };
      }

      const responseData = await response.json();
      const spirits = Array.isArray(responseData) ? responseData : responseData.data || [];
      
      // Transform registry agents to local Agent format
      const transformedSpirits = spirits
        .filter(s => s && (s.handle || s.id))
        .map(s => {
          try {
            return this.transformRegistryAgent(s);
          } catch (error) {
            console.warn('[Registry] Failed to transform spirit:', s?.handle || 'unknown', error);
            return null;
          }
        })
        .filter(Boolean) as Agent[];
      
      this.setCachedData(cacheKey, transformedSpirits);
      
      return { data: transformedSpirits, source: 'registry' };
    } catch (error) {
      console.error('[Registry] Error fetching spirits:', error);
      // Fallback to regular agents
      const allAgents = this.getFallbackAgents();
      const spiritAgents = allAgents.data?.filter(agent => 
        agent.status === 'GRADUATED' || agent.status === 'deployed'
      ) || [];
      return { data: spiritAgents, source: 'fallback' };
    }
  }

  /**
   * Check if agent can run practice today
   */
  async canRunPracticeToday(agentId: string): Promise<RegistryResponse<boolean>> {
    // Check Registry availability
    const isHealthy = await this.checkHealth();
    if (!isHealthy) {
      return {
        error: 'Registry service unavailable for practice check',
        source: 'fallback'
      };
    }

    try {
      const response = await fetch(`${this.baseUrl}/agents/${agentId}/can-practice`, {
        method: 'GET',
        headers: {
          'X-API-Key': this.apiKey,
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(5000),
      });

      if (!response.ok) {
        console.warn(`[Registry] Failed to check practice availability for ${agentId}:`, response.status);
        return { data: false, source: 'fallback' };
      }

      const result = await response.json();
      
      return { data: result.canRun || false, source: 'registry' };
    } catch (error) {
      console.error(`[Registry] Error checking practice availability for ${agentId}:`, error);
      return { data: false, source: 'fallback' };
    }
  }
}

// Export singleton instance
export const registryClient = new RegistryClient();