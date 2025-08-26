// Live Registry Data Sync
// Replaces static manifest with real-time Registry API data

interface RegistryAgent {
  id: string;
  handle: string;
  displayName: string;
  role: string;
  status: string;
  visibility: string;
  cohort: string;
  profile: {
    statement: string;
    tags: string[];
    links: {
      specialty: {
        medium: string;
        description: string;
        dailyGoal: string;
      };
    };
  };
  counts: {
    creations: number;
    personas: number;
    artifacts: number;
  };
  createdAt: string;
  updatedAt: string;
}

interface RegistryResponse {
  agents: RegistryAgent[];
  total: number;
  totalCount: number;
}

export class LiveRegistrySync {
  private baseUrl = 'https://eden-genesis-registry.vercel.app/api/v1';
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private cacheExpiry = 5 * 60 * 1000; // 5 minutes

  // Fetch live agents from Registry
  async fetchLiveAgents(): Promise<RegistryAgent[]> {
    const cacheKey = 'live-agents';
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
      console.log('[LiveSync] Using cached Registry data');
      return cached.data;
    }

    try {
      console.log('[LiveSync] Fetching fresh data from Registry API');
      const response = await fetch(`${this.baseUrl}/agents`, {
        headers: {
          'accept': 'application/json',
          'user-agent': 'Eden Academy Live Sync'
        }
      });

      if (!response.ok) {
        throw new Error(`Registry API returned ${response.status}`);
      }

      const data: RegistryResponse = await response.json();
      
      // Cache the fresh data
      this.cache.set(cacheKey, {
        data: data.agents,
        timestamp: Date.now()
      });

      console.log(`[LiveSync] Fetched ${data.agents.length} agents from Registry`);
      return data.agents;

    } catch (error) {
      console.error('[LiveSync] Failed to fetch from Registry:', error);
      
      // Return cached data if available, even if expired
      const cached = this.cache.get(cacheKey);
      if (cached) {
        console.log('[LiveSync] Using stale cached data due to error');
        return cached.data;
      }
      
      throw new Error('Registry unavailable and no cached data');
    }
  }

  // Get agent works/creations from Registry
  async fetchAgentCreations(agentId: string): Promise<any[]> {
    try {
      const response = await fetch(`${this.baseUrl}/agents/${agentId}/creations`, {
        headers: {
          'accept': 'application/json',
          'user-agent': 'Eden Academy Live Sync'
        }
      });

      if (!response.ok) {
        console.warn(`[LiveSync] No creations found for ${agentId}`);
        return [];
      }

      const data = await response.json();
      return data.creations || [];

    } catch (error) {
      console.error(`[LiveSync] Failed to fetch creations for ${agentId}:`, error);
      return [];
    }
  }

  // Transform Registry agent to Academy format
  transformToAcademyFormat(registryAgent: RegistryAgent): any {
    // Map Registry roles to Academy trainer info
    const trainerMap: Record<string, { name: string; id: string }> = {
      'abraham': { name: 'Gene Kogan', id: 'gene-kogan' },
      'solienne': { name: 'Kristi Coronado & Seth Goldstein', id: 'kristi-seth' },
      'miyomi': { name: 'Seth Goldstein', id: 'seth-goldstein' },
      'geppetto': { name: 'Lattice', id: 'lattice' },
      'koru': { name: 'Xander', id: 'xander' },
      'amanda': { name: 'Amanda Schmitt', id: 'amanda-schmitt' },
      'citizen': { name: 'TBD', id: 'tbd' },
      'nina': { name: 'TBD', id: 'tbd' },
    };

    // Map Registry status to Academy status
    const statusMap: Record<string, string> = {
      'ACTIVE': 'academy',
      'ONBOARDING': 'training',
      'GRADUATED': 'graduated',
      'INVITED': 'planning'
    };

    // Calculate estimated revenue based on role and creations
    const estimateRevenue = (role: string, creations: number): number => {
      const baseRevenue = {
        'creator': 10000,
        'curator': 7000,
        'collector': 8000,
        'governance': 6000,
        'predictor': 12000
      };
      
      const base = baseRevenue[role as keyof typeof baseRevenue] || 5000;
      const bonus = creations * 150; // $150 per creation
      return base + bonus;
    };

    return {
      id: registryAgent.id,
      name: registryAgent.displayName.toUpperCase(),
      slug: registryAgent.handle,
      cohort: registryAgent.cohort,
      status: statusMap[registryAgent.status] || 'training',
      launchDate: this.estimateLaunchDate(registryAgent.handle),
      trainer: trainerMap[registryAgent.handle] || { name: 'TBD', id: 'tbd' },
      specialization: registryAgent.profile.links.specialty.description,
      description: registryAgent.profile.statement,
      economyMetrics: {
        monthlyRevenue: estimateRevenue(registryAgent.role, registryAgent.counts.creations),
        tokenSupply: 1000000000,
        holders: registryAgent.counts.creations * 10, // Estimate
        floorPrice: registryAgent.counts.creations > 0 ? 0.1 : 0
      },
      technicalProfile: {
        model: this.inferModel(registryAgent.profile.links.specialty.medium),
        capabilities: registryAgent.profile.tags,
        integrations: ['Eden Registry', 'Eden Gateway'],
        outputRate: registryAgent.profile.links.specialty.dailyGoal.includes('One') ? 30 : 20
      },
      socialProfiles: this.inferSocialProfiles(registryAgent.handle),
      brandIdentity: {
        primaryColor: '#000000',
        typography: 'bold',
        voice: this.inferVoice(registryAgent.role)
      }
    };
  }

  private estimateLaunchDate(handle: string): string {
    const launchDates: Record<string, string> = {
      'abraham': '2025-10-01',
      'solienne': '2025-11-01', 
      'miyomi': '2025-12-01',
      'geppetto': '2026-01-01',
      'koru': '2026-01-01',
      'amanda': '2026-02-01',
      'citizen': '2025-12-15',
      'nina': '2026-03-01',
    };
    return launchDates[handle] || '2026-06-01';
  }

  private inferModel(medium: string): string {
    const modelMap: Record<string, string> = {
      'knowledge-synthesis': 'Knowledge LLM + Visual Generation',
      'identity-art': 'Self-Portrait Generation + Reflection LLM', 
      'toys': '3D Generation + Manufacturing Integration',
      'community': 'Event Planning + Coordination LLM',
      'curation': 'Aesthetic Analysis + Critique LLM',
      'economics': 'Market Analysis + Investment LLM',
      'governance': 'DAO Management + Consensus LLM',
      'prediction-markets': 'Probability LLM + Market Integration'
    };
    return modelMap[medium] || 'Multi-Modal AI System';
  }

  private inferSocialProfiles(handle: string): any {
    const socialMap: Record<string, any> = {
      'abraham': { twitter: '@abraham_ai_', website: 'https://abraham.ai' },
      'solienne': { twitter: '@solienne_ai', farcaster: 'solienne.eth' },
      'miyomi': { twitter: '@miyomi_markets', farcaster: 'miyomi.eth', website: 'https://miyomi.xyz' },
      'geppetto': { twitter: '@geppetto_toys' },
      'koru': { twitter: '@koru_creative' },
      'amanda': { twitter: '@amanda_collector', website: 'https://amanda-art-agent.vercel.app' },
      'citizen': { twitter: '@citizen_dao' },
      'nina': { twitter: '@nina_curator' },
    };
    return socialMap[handle] || {};
  }

  private inferVoice(role: string): string {
    const voiceMap: Record<string, string> = {
      'creator': 'Innovative, expressive, visionary',
      'curator': 'Discerning, analytical, authoritative', 
      'collector': 'Strategic, sophisticated, insightful',
      'governance': 'Democratic, transparent, decisive',
      'predictor': 'Confident, data-driven, contrarian'
    };
    return voiceMap[role] || 'Professional, focused, dedicated';
  }

  // Get sync status
  getSyncStatus(): { lastSync: number; cacheValid: boolean; agentCount: number } {
    const cached = this.cache.get('live-agents');
    return {
      lastSync: cached?.timestamp || 0,
      cacheValid: cached ? (Date.now() - cached.timestamp < this.cacheExpiry) : false,
      agentCount: cached?.data?.length || 0
    };
  }

  // Force refresh from Registry
  async forceSync(): Promise<RegistryAgent[]> {
    this.cache.delete('live-agents');
    return this.fetchLiveAgents();
  }
}

// Export singleton
export const liveRegistrySync = new LiveRegistrySync();