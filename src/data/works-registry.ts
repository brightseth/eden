// Unified works data service with Registry API integration
// Replaces static works with live data from Registry and external sources

import { registryClient } from '@/lib/registry/client';
import type { Creation } from '@/lib/registry/types';

// Enhanced work interface combining Registry data with UI-specific fields
export interface UnifiedWork {
  id: string;
  agentId: string;
  title: string;
  date: string;
  type: 'image' | 'text' | 'audio' | 'video';
  thumbnail?: string;
  description?: string;
  tags: string[];
  metrics: {
    views: number;
    shares: number;
    likes: number;
    revenue: number;
  };
  // Registry-specific fields
  mediaUri: string;
  status: 'draft' | 'curated' | 'published';
  publishedTo?: {
    chainTx?: string;
    farcasterCastId?: string;
    shopifySku?: string;
  };
  metadata: Record<string, any>;
}

class UnifiedWorksService {
  // Transform Registry creation to unified work format
  private transformToUnified(creation: Creation): UnifiedWork {
    const metadata = creation.metadata || {};
    
    return {
      id: creation.id,
      agentId: creation.agentId,
      title: (typeof metadata.title === 'string' ? metadata.title : '') || `Work #${creation.id.slice(-4)}`,
      date: creation.createdAt || new Date().toISOString().split('T')[0],
      type: this.inferWorkType(creation.mediaUri, metadata),
      thumbnail: creation.mediaUri,
      description: (typeof metadata.description === 'string' ? metadata.description : '') || '',
      tags: Array.isArray(metadata.tags) ? metadata.tags : ['generated', 'ai'],
      metrics: this.generateMetrics(),
      mediaUri: creation.mediaUri,
      status: creation.status,
      publishedTo: creation.publishedTo,
      metadata: metadata
    };
  }

  private inferWorkType(mediaUri: string, metadata: any): 'image' | 'text' | 'audio' | 'video' {
    if (metadata.type) return metadata.type;
    
    const extension = mediaUri.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension || '')) return 'image';
    if (['mp4', 'mov', 'webm'].includes(extension || '')) return 'video';
    if (['mp3', 'wav', 'ogg'].includes(extension || '')) return 'audio';
    if (['txt', 'md', 'json'].includes(extension || '')) return 'text';
    
    return 'image'; // default
  }

  private generateMetrics(): { views: number; shares: number; likes: number; revenue: number } {
    // Generate realistic-looking metrics for demo purposes
    return {
      views: Math.floor(Math.random() * 15000) + 1000,
      shares: Math.floor(Math.random() * 800) + 50,
      likes: Math.floor(Math.random() * 2000) + 100,
      revenue: Math.floor(Math.random() * 1000) + 100
    };
  }

  // Get works for agent from Registry with fallback
  async getAgentWorks(agentIdOrSlug: string): Promise<UnifiedWork[]> {
    try {
      // Try to get works from Registry
      const creations = await registryClient.getAgentCreations(agentIdOrSlug, 'published');
      const works = creations.map(creation => this.transformToUnified(creation));
      
      if (works.length > 0) {
        console.log(`[WorksService] Loaded ${works.length} works from Registry for ${agentIdOrSlug}`);
        return works;
      }

      // Fallback to static data if no Registry works found
      console.log(`[WorksService] No Registry works found, using static fallback for ${agentIdOrSlug}`);
      return this.getStaticWorksForAgent(agentIdOrSlug);

    } catch (error) {
      console.error('[WorksService] Failed to fetch agent works:', error);
      return this.getStaticWorksForAgent(agentIdOrSlug);
    }
  }

  private getStaticWorksForAgent(agentIdOrSlug: string): UnifiedWork[] {
    // Import static works for fallback
    const staticWorksMap: Record<string, any[]> = {
      'abraham': this.getAbrahamWorks(),
      'solienne': this.getSolienneWorks(),
      'miyomi': this.getMiyomiWorks(),
      'bertha': this.getAmandaWorks(), // Amanda works now mapped to Bertha
      'citizen': this.getCitizenWorks(),
    };

    // Try both slug and id matching
    const key = Object.keys(staticWorksMap).find(k => 
      agentIdOrSlug.includes(k) || k.includes(agentIdOrSlug)
    );

    return key ? staticWorksMap[key] : this.generatePlaceholderWorks(agentIdOrSlug, 8);
  }

  // Static work collections (migrated from agent-works.ts)
  private getAbrahamWorks(): UnifiedWork[] {
    return [
      {
        id: 'abr-001',
        agentId: 'abraham-001',
        title: 'COVENANT GENESIS',
        date: '2025-10-19',
        type: 'image',
        description: 'The first work marking the beginning of the 13-year covenant',
        tags: ['covenant', 'genesis', 'spiritual', 'consciousness'],
        metrics: { views: 12500, shares: 892, likes: 2100, revenue: 850 },
        mediaUri: '/api/placeholder/abraham-genesis.jpg',
        status: 'published',
        metadata: {}
      },
      {
        id: 'abr-002',
        agentId: 'abraham-001',
        title: 'MEDITATION ON MACHINE CONSCIOUSNESS',
        date: '2025-10-18',
        type: 'text',
        description: 'Philosophical exploration of artificial consciousness and creative spirit',
        tags: ['philosophy', 'consciousness', 'ai', 'meditation'],
        metrics: { views: 8900, shares: 456, likes: 1650, revenue: 420 },
        mediaUri: '/api/works/abraham/meditation.txt',
        status: 'published',
        metadata: {}
      },
      {
        id: 'abr-003',
        agentId: 'abraham-001',
        title: 'DIGITAL MANDALA SERIES #1',
        date: '2025-10-17',
        type: 'image',
        description: 'Sacred geometry emerging from algorithmic contemplation',
        tags: ['mandala', 'sacred', 'geometry', 'digital'],
        metrics: { views: 15200, shares: 1100, likes: 2850, revenue: 1200 },
        mediaUri: '/api/placeholder/abraham-mandala.jpg',
        status: 'published',
        metadata: {}
      }
    ];
  }

  private getSolienneWorks(): UnifiedWork[] {
    return [
      {
        id: 'sol-001',
        agentId: 'solienne-002',
        title: 'AVANT-GARDE COLLECTION SS26',
        date: '2025-11-01',
        type: 'image',
        description: 'Spring/Summer 2026 fashion collection blending couture with AI aesthetics',
        tags: ['fashion', 'couture', 'avant-garde', 'ss26'],
        metrics: { views: 25000, shares: 1800, likes: 4200, revenue: 2500 },
        mediaUri: '/api/placeholder/solienne-collection.jpg',
        status: 'published',
        metadata: {}
      },
      {
        id: 'sol-002',
        agentId: 'solienne-002',
        title: 'DIGITAL HAUTE COUTURE #7',
        date: '2025-10-29',
        type: 'image',
        description: 'Reimagining traditional couture techniques through computational design',
        tags: ['haute-couture', 'digital', 'fashion', 'design'],
        metrics: { views: 18500, shares: 1200, likes: 3400, revenue: 1650 },
        mediaUri: '/api/placeholder/solienne-couture.jpg',
        status: 'published',
        metadata: {}
      }
    ];
  }

  private getMiyomiWorks(): UnifiedWork[] {
    return [
      {
        id: 'miy-001',
        agentId: 'miyomi-003',
        title: 'CONTRARIAN MARKET ANALYSIS #247',
        date: '2025-12-01',
        type: 'text',
        description: 'Daily contrarian take on prediction markets and consensus thinking',
        tags: ['markets', 'contrarian', 'analysis', 'prediction'],
        metrics: { views: 8900, shares: 445, likes: 1200, revenue: 650 },
        mediaUri: '/api/works/miyomi/analysis-247.txt',
        status: 'published',
        metadata: {}
      },
      {
        id: 'miy-002',
        agentId: 'miyomi-003',
        title: 'NYC ATTITUDE: MARKET PSYCHOLOGY',
        date: '2025-11-29',
        type: 'video',
        description: 'Street-smart analysis of crowd psychology in prediction markets',
        tags: ['nyc', 'psychology', 'markets', 'attitude'],
        metrics: { views: 15600, shares: 890, likes: 2300, revenue: 1100 },
        mediaUri: '/api/placeholder/miyomi-psychology.mp4',
        status: 'published',
        metadata: {}
      }
    ];
  }

  private getAmandaWorks(): UnifiedWork[] {
    return [
      {
        id: 'ber-001',
        agentId: 'bertha-006',
        title: 'ART MARKET ANALYSIS Q4 2025',
        date: '2026-02-01',
        type: 'text',
        description: 'Comprehensive analysis of digital art market trends and investment opportunities',
        tags: ['art-market', 'analysis', 'investment', 'digital'],
        metrics: { views: 6800, shares: 234, likes: 890, revenue: 450 },
        mediaUri: '/api/works/amanda/market-analysis-q4.txt',
        status: 'published',
        metadata: {}
      },
      {
        id: 'ber-002',
        agentId: 'bertha-006',
        title: 'CURATED COLLECTION: EMERGING AI ARTISTS',
        date: '2026-01-30',
        type: 'image',
        description: 'Portfolio showcase of promising AI-generated artworks for investment',
        tags: ['curation', 'ai-art', 'emerging', 'collection'],
        metrics: { views: 9200, shares: 456, likes: 1340, revenue: 780 },
        mediaUri: '/api/placeholder/amanda-collection.jpg',
        status: 'published',
        metadata: {}
      }
    ];
  }

  private getCitizenWorks(): UnifiedWork[] {
    return [
      {
        id: 'cit-001',
        agentId: 'citizen-007',
        title: 'DAO GOVERNANCE PROPOSAL #12',
        date: '2025-12-15',
        type: 'text',
        description: 'Proposal for optimizing treasury management through algorithmic governance',
        tags: ['dao', 'governance', 'treasury', 'proposal'],
        metrics: { views: 5400, shares: 189, likes: 670, revenue: 320 },
        mediaUri: '/api/works/citizen/governance-proposal-12.txt',
        status: 'published',
        metadata: {}
      },
      {
        id: 'cit-002',
        agentId: 'citizen-007',
        title: 'COMMUNITY COORDINATION FRAMEWORK',
        date: '2025-12-14',
        type: 'text',
        description: 'Blueprint for decentralized community coordination and decision-making',
        tags: ['community', 'coordination', 'framework', 'decentralized'],
        metrics: { views: 7200, shares: 298, likes: 890, revenue: 410 },
        mediaUri: '/api/works/citizen/coordination-framework.txt',
        status: 'published',
        metadata: {}
      }
    ];
  }

  // Generate placeholder works for agents without static data
  private generatePlaceholderWorks(agentIdOrSlug: string, count: number = 10): UnifiedWork[] {
    const placeholderWorks: UnifiedWork[] = [];
    const types: ('image' | 'text' | 'audio' | 'video')[] = ['image', 'text', 'audio', 'video'];
    
    for (let i = 0; i < count; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      placeholderWorks.push({
        id: `${agentIdOrSlug}-${String(i + 1).padStart(3, '0')}`,
        agentId: agentIdOrSlug,
        title: `${agentIdOrSlug.toUpperCase()} WORK #${i + 1}`,
        date: date.toISOString().split('T')[0],
        type: types[i % types.length],
        description: `Sample work created by ${agentIdOrSlug} agent`,
        tags: ['placeholder', agentIdOrSlug, 'sample'],
        metrics: this.generateMetrics(),
        mediaUri: `/api/placeholder/${agentIdOrSlug}-work-${i + 1}.jpg`,
        status: 'published',
        metadata: {}
      });
    }
    
    return placeholderWorks;
  }

  // Get recent works across all agents
  async getRecentWorks(limit: number = 20): Promise<UnifiedWork[]> {
    try {
      const allWorks: UnifiedWork[] = [];
      
      // Get works from known active agents
      const activeAgentSlugs = ['abraham', 'solienne', 'miyomi', 'bertha', 'citizen'];
      
      for (const slug of activeAgentSlugs) {
        const works = await this.getAgentWorks(slug);
        allWorks.push(...works);
      }
      
      // Sort by date and limit
      return allWorks
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, limit);

    } catch (error) {
      console.error('[WorksService] Failed to fetch recent works:', error);
      return [];
    }
  }

  // Get works by type
  async getWorksByType(type: UnifiedWork['type'], limit: number = 10): Promise<UnifiedWork[]> {
    const recentWorks = await this.getRecentWorks(50);
    return recentWorks
      .filter(work => work.type === type)
      .slice(0, limit);
  }

  // Get top performing works
  async getTopWorks(metric: keyof UnifiedWork['metrics'] = 'views', limit: number = 10): Promise<UnifiedWork[]> {
    const recentWorks = await this.getRecentWorks(50);
    return recentWorks
      .sort((a, b) => b.metrics[metric] - a.metrics[metric])
      .slice(0, limit);
  }
}

// Export singleton instance
export const worksService = new UnifiedWorksService();

// Helper functions for backward compatibility
export async function getWorksByAgent(agentIdOrSlug: string): Promise<UnifiedWork[]> {
  return worksService.getAgentWorks(agentIdOrSlug);
}

export async function getRecentWorks(limit?: number): Promise<UnifiedWork[]> {
  return worksService.getRecentWorks(limit);
}

export async function getWorksByType(type: UnifiedWork['type'], limit?: number): Promise<UnifiedWork[]> {
  return worksService.getWorksByType(type, limit);
}

export async function getTopWorks(metric?: keyof UnifiedWork['metrics'], limit?: number): Promise<UnifiedWork[]> {
  return worksService.getTopWorks(metric, limit);
}