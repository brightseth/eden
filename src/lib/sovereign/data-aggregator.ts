// Sovereign Data Aggregator v2.0
// Intelligent data collection and merging from Registry, Manifest, Practice, and Works layers

import { registryClient } from '@/lib/registry/client';
import { EDEN_AGENTS } from '@/data/eden-agents-manifest';
import { worksService } from '@/data/works-registry';
import { normalizeStatus } from '@/lib/registry/adapters';
import type { SovereignAgentConfig } from '@/types/agent-sovereign';
import type { DailyPracticeEntry } from '@/lib/validation/schemas';

export class SovereignDataAggregator {
  
  // ============================================
  // Main Aggregation Method
  // ============================================
  
  async aggregateAgentData(agentIdOrHandle: string): Promise<SovereignAgentConfig> {
    console.log(`🔍 Aggregating data for agent: ${agentIdOrHandle}`);
    
    try {
      // Parallel data fetching for optimal performance
      const [
        registryData,
        manifestData,
        practiceData,
        worksData,
        socialData
      ] = await Promise.allSettled([
        this.fetchRegistryData(agentIdOrHandle),
        this.fetchManifestData(agentIdOrHandle),
        this.fetchPracticeData(agentIdOrHandle),
        this.fetchWorksData(agentIdOrHandle),
        this.fetchSocialData(agentIdOrHandle)
      ]);

      // Extract successful results and handle failures gracefully
      const registry = this.extractResult(registryData, 'Registry');
      const manifest = this.extractResult(manifestData, 'Manifest');
      const practice = this.extractResult(practiceData, 'Practice');
      const works = this.extractResult(worksData, 'Works');
      const social = this.extractResult(socialData, 'Social');

      // Intelligent merging of data sources
      const config = this.mergeDataSources({
        registry,
        manifest,
        practice,
        works,
        social
      });

      console.log(`✅ Successfully aggregated data for ${config.core.displayName}`);
      return config;

    } catch (error) {
      console.error(`❌ Failed to aggregate data for ${agentIdOrHandle}:`, error);
      
      // Fallback to manifest-only configuration
      console.log(`🔄 Falling back to manifest data only...`);
      return this.createFallbackConfig(agentIdOrHandle);
    }
  }

  // ============================================
  // Data Source Fetchers
  // ============================================

  private async fetchRegistryData(agentIdOrHandle: string) {
    try {
      // Attempt to fetch from live Registry API
      const agent = await registryClient.getAgent(agentIdOrHandle);
      const creations = await registryClient.getAgentCreations(agentIdOrHandle);
      
      return {
        core: {
          id: agent.id,
          handle: agent.handle,
          displayName: agent.displayName,
          status: agent.status,
          createdAt: agent.createdAt || new Date().toISOString(),
          updatedAt: agent.updatedAt || new Date().toISOString()
        },
        creations: creations || [],
        profile: agent.profile
      };
    } catch (error) {
      console.warn(`⚠️  Registry data unavailable for ${agentIdOrHandle}:`, error.message);
      return null;
    }
  }

  private async fetchManifestData(agentIdOrHandle: string) {
    try {
      // Fetch from local manifest data
      const agent = EDEN_AGENTS.find(a => 
        a.id === agentIdOrHandle || 
        a.handle === agentIdOrHandle ||
        a.name.toLowerCase() === agentIdOrHandle.toLowerCase()
      );

      if (!agent) {
        throw new Error(`Agent not found in manifest: ${agentIdOrHandle}`);
      }

      return {
        trainer: agent.trainer,
        launchDate: agent.launchDate,
        specialization: agent.specialization,
        description: agent.description,
        economyMetrics: agent.economyMetrics,
        technicalProfile: agent.technicalProfile,
        brandIdentity: agent.brandIdentity,
        socialProfiles: agent.socialProfiles,
        prototypeLinks: agent.prototypeLinks || []
      };
    } catch (error) {
      console.warn(`⚠️  Manifest data unavailable for ${agentIdOrHandle}:`, error.message);
      return null;
    }
  }

  private async fetchPracticeData(agentIdOrHandle: string) {
    try {
      // Attempt to fetch from Academy practice API
      const response = await fetch(`/api/agents/${agentIdOrHandle}/daily-practice?limit=30`);
      
      if (!response.ok) {
        throw new Error(`Practice API returned ${response.status}`);
      }

      const data = await response.json();
      return {
        entries: data.entries || [],
        metrics: data.metrics || null
      };
    } catch (error) {
      console.warn(`⚠️  Practice data unavailable for ${agentIdOrHandle}:`, error.message);
      return null;
    }
  }

  private async fetchWorksData(agentIdOrHandle: string) {
    try {
      // Use unified works service (handles Registry + fallback)
      const works = await worksService.getAgentWorks(agentIdOrHandle);
      
      // Calculate works metrics
      const totalViews = works.reduce((sum, work) => sum + work.metrics.views, 0);
      const totalRevenue = works.reduce((sum, work) => sum + work.metrics.revenue, 0);
      const avgEngagement = works.length > 0 ? 
        works.reduce((sum, work) => sum + (work.metrics.likes / Math.max(work.metrics.views, 1)), 0) / works.length : 0;

      return {
        works: works,
        totalCount: works.length,
        featured: works.slice(0, 6), // Top 6 for featured display
        recentWorks: works.slice(0, 12), // Recent 12 for galleries
        types: [...new Set(works.map(w => w.type))],
        metrics: {
          totalViews,
          totalRevenue,
          avgEngagement
        }
      };
    } catch (error) {
      console.warn(`⚠️  Works data unavailable for ${agentIdOrHandle}:`, error.message);
      return null;
    }
  }

  private async fetchSocialData(agentIdOrHandle: string) {
    try {
      // For now, return basic social data from manifest
      // In the future, could integrate with Twitter/Farcaster APIs
      const agent = EDEN_AGENTS.find(a => 
        a.id === agentIdOrHandle || a.handle === agentIdOrHandle
      );

      if (!agent?.socialProfiles) {
        throw new Error('No social profiles found');
      }

      return {
        twitter: agent.socialProfiles.twitter,
        farcaster: agent.socialProfiles.farcaster,
        website: agent.socialProfiles.website,
        // Mock social metrics (could be replaced with real API calls)
        followers: Math.floor(Math.random() * 5000) + 500,
        following: Math.floor(Math.random() * 1000) + 100,
        engagementRate: Math.random() * 0.15 + 0.02,
        communityHealth: 'growing' as const
      };
    } catch (error) {
      console.warn(`⚠️  Social data unavailable for ${agentIdOrHandle}:`, error.message);
      return null;
    }
  }

  // ============================================
  // Data Processing & Merging
  // ============================================

  private extractResult<T>(
    result: PromiseSettledResult<T>, 
    source: string
  ): T | null {
    if (result.status === 'fulfilled') {
      console.log(`✅ ${source} data loaded successfully`);
      return result.value;
    } else {
      console.warn(`⚠️  ${source} data failed:`, result.reason?.message);
      return null;
    }
  }

  private mergeDataSources(sources: {
    registry: any;
    manifest: any;
    practice: any;
    works: any;
    social: any;
  }): SovereignAgentConfig {
    const { registry, manifest, practice, works, social } = sources;

    // Core identity (Registry takes precedence, fallback to manifest)
    const core = registry?.core || {
      id: manifest?.id || manifest?.handle || 'unknown',
      handle: manifest?.handle || 'unknown', 
      displayName: manifest?.name || 'Unknown Agent',
      status: manifest?.status === 'academy' ? 'academy' : normalizeStatus(manifest?.status ?? 'ACTIVE') as any,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Manifest layer (technical and economic profile)
    const manifestLayer = {
      trainer: manifest?.trainer,
      launchDate: manifest?.launchDate,
      specialization: manifest?.specialization,
      description: manifest?.description,
      monthlyRevenue: manifest?.economyMetrics?.monthlyRevenue || 0,
      holders: manifest?.economyMetrics?.holders || 0,
      floorPrice: manifest?.economyMetrics?.floorPrice,
      outputRate: manifest?.technicalProfile?.outputRate || 0,
      model: manifest?.technicalProfile?.model,
      capabilities: manifest?.technicalProfile?.capabilities || [],
      integrations: manifest?.technicalProfile?.integrations || []
    };

    // Brand identity layer
    const brand = {
      voice: manifest?.brandIdentity?.voice || 'Authentic AI agent voice',
      aestheticStyle: manifest?.brandIdentity?.aestheticStyle,
      culturalContext: manifest?.brandIdentity?.culturalContext,
      colorScheme: 'default' as const,
      primaryColor: undefined,
      accentColor: undefined,
      typography: 'helvetica' as const
    };

    // Daily practice layer (with smart defaults)
    const practiceMetrics = practice?.metrics || {
      creations_count: 0,
      published_count: 0,
      views: 0,
      reactions: 0,
      collects: 0
    };

    const practiceFinancial = {
      cost_usdc: 0,
      revenue_usdc: 0,
      profit_margin: 0
    };

    const dailyPractice = {
      type: this.inferPracticeType(manifest?.specialization) as any,
      frequency: 'daily' as const,
      title: `${core.displayName} Daily Practice`,
      description: manifest?.specialization || 'Autonomous AI agent practice',
      metrics: practiceMetrics,
      financial: practiceFinancial,
      operations: {
        theme: undefined,
        note: undefined,
        blockers: []
      },
      graduationCriteria: {
        published_streak_met: practiceMetrics.published_count >= 12,
        profitable_week_met: practiceFinancial.revenue_usdc > practiceFinancial.cost_usdc,
        no_blockers_met: true,
        min_collects_met: practiceMetrics.collects >= 5,
        can_graduate: false
      }
    };

    // Works layer
    const worksLayer = works || {
      works: [],
      totalCount: 0,
      featured: [],
      recentWorks: [],
      types: ['image'] as const,
      metrics: { totalViews: 0, totalRevenue: 0, avgEngagement: 0 }
    };

    // Social layer
    const socialLayer = social || {
      twitter: manifest?.socialProfiles?.twitter,
      farcaster: manifest?.socialProfiles?.farcaster,
      website: manifest?.socialProfiles?.website,
      followers: 0,
      following: 0,
      engagementRate: 0,
      communityHealth: 'stable' as const
    };

    // Create complete configuration
    return {
      core,
      manifest: manifestLayer,
      brand,
      dailyPractice,
      works: {
        types: worksLayer.types,
        totalCount: worksLayer.totalCount,
        featured: worksLayer.featured,
        collections: undefined,
        recentWorks: worksLayer.recentWorks,
        publishingChannels: {
          chainTx: manifest?.prototypeLinks?.find(p => p.type === 'interface')?.url,
          farcasterCastId: undefined,
          shopifySku: undefined
        },
        metrics: worksLayer.metrics
      },
      social: socialLayer,
      prototypes: manifest?.prototypeLinks || [],
      intelligence: {
        layoutRecommendation: 'timeline',
        componentRecommendations: [],
        themeRecommendation: {} as any,
        contentStrategy: '',
        audienceAnalysis: {
          primaryAudience: 'AI enthusiasts and early adopters',
          contentPreferences: ['innovative content', 'AI insights'],
          engagementPatterns: ['curiosity-driven', 'technology-focused']
        }
      }
    };
  }

  private inferPracticeType(specialization?: string): string {
    if (!specialization) return 'generation';
    
    const lower = specialization.toLowerCase();
    if (lower.includes('market') || lower.includes('prediction') || lower.includes('oracle')) return 'prediction';
    if (lower.includes('governance') || lower.includes('dao') || lower.includes('community')) return 'governance';
    if (lower.includes('analysis') || lower.includes('intelligence') || lower.includes('research')) return 'analysis';
    if (lower.includes('curator') || lower.includes('collection')) return 'curation';
    if (lower.includes('synthesis') || lower.includes('knowledge')) return 'synthesis';
    if (lower.includes('trading') || lower.includes('financial')) return 'trading';
    if (lower.includes('writing') || lower.includes('poet')) return 'writing';
    
    return 'generation'; // Default
  }

  private createFallbackConfig(agentIdOrHandle: string): SovereignAgentConfig {
    // Create minimal configuration from manifest data only
    const agent = EDEN_AGENTS.find(a => 
      a.id === agentIdOrHandle || 
      a.handle === agentIdOrHandle
    );

    if (!agent) {
      throw new Error(`Cannot create fallback config: Agent ${agentIdOrHandle} not found in manifest`);
    }

    return {
      core: {
        id: agent.id,
        handle: agent.handle,
        displayName: agent.name,
        status: agent.status === 'academy' ? 'academy' : normalizeStatus(agent.status) as any,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      manifest: {
        trainer: agent.trainer,
        launchDate: agent.launchDate,
        specialization: agent.specialization,
        description: agent.description,
        monthlyRevenue: agent.economyMetrics?.monthlyRevenue || 0,
        holders: agent.economyMetrics?.holders || 0,
        floorPrice: agent.economyMetrics?.floorPrice,
        outputRate: agent.technicalProfile?.outputRate || 0,
        model: agent.technicalProfile?.model,
        capabilities: agent.technicalProfile?.capabilities || [],
        integrations: agent.technicalProfile?.integrations || []
      },
      brand: {
        voice: agent.brandIdentity?.voice || 'Authentic AI agent voice',
        colorScheme: 'default',
        typography: 'helvetica'
      },
      dailyPractice: {
        type: this.inferPracticeType(agent.specialization) as any,
        frequency: 'daily',
        title: `${agent.name} Daily Practice`,
        description: agent.specialization || 'AI agent practice',
        metrics: {
          creations_count: 0,
          published_count: 0,
          views: 0,
          reactions: 0,
          collects: 0
        },
        financial: {
          cost_usdc: 0,
          revenue_usdc: 0,
          profit_margin: 0
        },
        operations: {
          blockers: []
        },
        graduationCriteria: {
          published_streak_met: false,
          profitable_week_met: false,
          no_blockers_met: true,
          min_collects_met: false,
          can_graduate: false
        }
      },
      works: {
        types: ['image'],
        totalCount: 0,
        featured: [],
        recentWorks: [],
        publishingChannels: {},
        metrics: {
          totalViews: 0,
          totalRevenue: 0,
          avgEngagement: 0
        }
      },
      social: {
        twitter: agent.socialProfiles?.twitter,
        farcaster: agent.socialProfiles?.farcaster,
        website: agent.socialProfiles?.website,
        followers: 0,
        following: 0,
        engagementRate: 0,
        communityHealth: 'stable'
      },
      prototypes: agent.prototypeLinks || [],
      intelligence: {
        layoutRecommendation: 'timeline',
        componentRecommendations: [],
        themeRecommendation: {} as any,
        contentStrategy: agent.specialization || 'AI agent content',
        audienceAnalysis: {
          primaryAudience: 'AI enthusiasts',
          contentPreferences: ['AI content'],
          engagementPatterns: ['technology-focused']
        }
      }
    };
  }

  // ============================================
  // Utility Methods
  // ============================================

  async validateDataSources(): Promise<{ [source: string]: boolean }> {
    const results = await Promise.allSettled([
      this.testRegistryConnection(),
      this.testManifestData(),
      this.testPracticeAPI(),
      this.testWorksService()
    ]);

    return {
      registry: results[0].status === 'fulfilled',
      manifest: results[1].status === 'fulfilled',
      practice: results[2].status === 'fulfilled',
      works: results[3].status === 'fulfilled'
    };
  }

  private async testRegistryConnection() {
    // Test if Registry is accessible
    return registryClient.getAgent('abraham');
  }

  private async testManifestData() {
    // Test if manifest data is available
    return EDEN_AGENTS.length > 0;
  }

  private async testPracticeAPI() {
    // Test if practice API is accessible
    const response = await fetch('/api/agents/abraham/daily-practice?limit=1');
    return response.ok;
  }

  private async testWorksService() {
    // Test if works service is functional
    return worksService.getAgentWorks('abraham');
  }
}

// Export singleton instance
export const sovereignDataAggregator = new SovereignDataAggregator();

// Helper functions for external use
export async function aggregateAgentData(agentIdOrHandle: string) {
  return sovereignDataAggregator.aggregateAgentData(agentIdOrHandle);
}

export async function validateAllDataSources() {
  return sovereignDataAggregator.validateDataSources();
}