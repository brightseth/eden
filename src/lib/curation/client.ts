/**
 * Curation System Client Library
 * Provides typed client functions for the Eden Art Curation System
 */

import { 
  Work, Collection, CurationResult, CuratorAgent, SessionType,
  WorksApiResponse, CollectionsApiResponse, CurationSystemResponse,
  CreateCollectionSchema, CreateWorkSchema, CurationRequestSchema
} from '@/lib/types/curation';

export class CurationClient {
  private baseUrl: string;

  constructor(baseUrl: string = '/api/curation') {
    this.baseUrl = baseUrl;
  }

  // Works operations
  async getWorks(params?: {
    agentSource?: string;
    curatorAgent?: string;
    verdict?: string;
    minScore?: number;
    page?: number;
    limit?: number;
  }): Promise<WorksApiResponse> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.set(key, value.toString());
        }
      });
    }

    const response = await fetch(`${this.baseUrl}/works?${searchParams}`);
    return response.json();
  }

  async createWork(work: {
    externalId?: string;
    title: string;
    description?: string;
    imageUrl: string;
    agentSource: string;
  }): Promise<CurationSystemResponse<Work>> {
    const validatedWork = CreateWorkSchema.parse(work);
    
    const response = await fetch(`${this.baseUrl}/works`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validatedWork),
    });
    
    return response.json();
  }

  // Collections operations
  async getCollections(params?: {
    curator?: string;
    public?: boolean;
    tags?: string;
    page?: number;
    limit?: number;
  }): Promise<CollectionsApiResponse> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.set(key, value.toString());
        }
      });
    }

    const response = await fetch(`${this.baseUrl}/collections?${searchParams}`);
    return response.json();
  }

  async createCollection(collection: {
    name: string;
    description?: string;
    curatorAgent: string;
    isPublic?: boolean;
    tags?: string[];
  }): Promise<CurationSystemResponse<Collection>> {
    const validatedCollection = CreateCollectionSchema.parse(collection);
    
    const response = await fetch(`${this.baseUrl}/collections`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validatedCollection),
    });
    
    return response.json();
  }

  // Analysis operations
  async analyzeWorks(request: {
    workIds: string[];
    curatorAgent?: CuratorAgent;
    sessionType?: SessionType;
    sessionName?: string;
  }): Promise<CurationSystemResponse<{
    results: CurationResult[];
    session?: any;
    sessionType: SessionType;
    curatorAgent: CuratorAgent;
  }>> {
    const validatedRequest = CurationRequestSchema.parse(request);
    
    const response = await fetch(`${this.baseUrl}/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validatedRequest),
    });
    
    return response.json();
  }

  // Tournament operations
  async createTournament(request: {
    workIds: string[];
    curatorAgent: CuratorAgent;
    sessionName?: string;
  }): Promise<CurationSystemResponse<{
    session: any;
    message: string;
  }>> {
    const response = await fetch(`${this.baseUrl}/tournament`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    });
    
    return response.json();
  }

  async getTournaments(params?: {
    sessionId?: string;
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<CurationSystemResponse<any>> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.set(key, value.toString());
        }
      });
    }

    const response = await fetch(`${this.baseUrl}/tournament?${searchParams}`);
    return response.json();
  }

  async advanceTournament(sessionId: string, action: 'advance' | 'reset' | 'complete'): Promise<CurationSystemResponse<any>> {
    const response = await fetch(`${this.baseUrl}/tournament`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, action }),
    });
    
    return response.json();
  }
}

// Utility functions for curation operations
export const curationUtils = {
  /**
   * Calculate overall curation score from individual metrics
   */
  calculateScore(metrics: {
    cultural?: number;
    technical?: number;
    conceptual?: number;
    emotional?: number;
    innovation?: number;
  }, weights?: {
    cultural?: number;
    technical?: number;
    conceptual?: number;
    emotional?: number;
    innovation?: number;
  }): number {
    const defaultWeights = {
      cultural: 0.2,
      technical: 0.2,
      conceptual: 0.2,
      emotional: 0.2,
      innovation: 0.2,
    };
    
    const w = { ...defaultWeights, ...weights };
    
    return Math.round(
      (metrics.cultural || 0) * w.cultural +
      (metrics.technical || 0) * w.technical +
      (metrics.conceptual || 0) * w.conceptual +
      (metrics.emotional || 0) * w.emotional +
      (metrics.innovation || 0) * w.innovation
    );
  },

  /**
   * Determine verdict based on score
   */
  getVerdict(score: number): 'MASTERWORK' | 'INCLUDE' | 'MAYBE' | 'EXCLUDE' {
    if (score >= 95) return 'MASTERWORK';
    if (score >= 85) return 'INCLUDE';
    if (score >= 70) return 'MAYBE';
    return 'EXCLUDE';
  },

  /**
   * Get verdict styling classes
   */
  getVerdictStyling(verdict?: string): string {
    switch (verdict) {
      case 'MASTERWORK':
        return 'text-purple-400 border-purple-400 bg-purple-950/20';
      case 'INCLUDE':
        return 'text-green-400 border-green-400 bg-green-950/20';
      case 'MAYBE':
        return 'text-yellow-400 border-yellow-400 bg-yellow-950/20';
      case 'EXCLUDE':
        return 'text-red-400 border-red-400 bg-red-950/20';
      default:
        return 'text-gray-400 border-gray-400 bg-gray-950/20';
    }
  },

  /**
   * Format curation metrics for display
   */
  formatMetrics(result: CurationResult): Array<{ label: string; value: number; key: string }> {
    return [
      { label: 'Cultural Relevance', value: result.culturalRelevance, key: 'cultural' },
      { label: 'Technical Execution', value: result.technicalExecution, key: 'technical' },
      { label: 'Conceptual Depth', value: result.conceptualDepth, key: 'conceptual' },
      { label: 'Emotional Resonance', value: result.emotionalResonance, key: 'emotional' },
      { label: 'Innovation Index', value: result.innovationIndex, key: 'innovation' },
    ];
  },

  /**
   * Generate collection tags from works
   */
  generateCollectionTags(works: Work[]): string[] {
    const tagSet = new Set<string>();
    
    // Add agent-based tags
    works.forEach(work => {
      tagSet.add(work.agentSource);
      if (work.curationVerdict) {
        tagSet.add(work.curationVerdict.toLowerCase());
      }
    });

    // Add score-based tags
    const avgScore = works.reduce((sum, work) => sum + (work.curationScore || 0), 0) / works.length;
    if (avgScore >= 90) tagSet.add('high-quality');
    else if (avgScore >= 75) tagSet.add('quality');
    else tagSet.add('emerging');

    return Array.from(tagSet);
  },

  /**
   * Validate tournament work count
   */
  isValidTournamentSize(workCount: number): boolean {
    return workCount >= 4 && (workCount & (workCount - 1)) === 0;
  },

  /**
   * Calculate tournament rounds needed
   */
  getTournamentRounds(workCount: number): number {
    if (!this.isValidTournamentSize(workCount)) {
      throw new Error('Invalid tournament size');
    }
    return Math.log2(workCount);
  },

  /**
   * Export curation results to various formats
   */
  exportResults: {
    toCsv(results: CurationResult[], workTitles: string[]): string {
      const headers = ['Title', 'Score', 'Verdict', 'Cultural', 'Technical', 'Conceptual', 'Emotional', 'Innovation'];
      const rows = results.map((result, i) => [
        workTitles[i] || `Work ${i + 1}`,
        result.score,
        result.verdict,
        result.culturalRelevance,
        result.technicalExecution,
        result.conceptualDepth,
        result.emotionalResonance,
        result.innovationIndex,
      ]);
      
      return [headers, ...rows].map(row => row.join(',')).join('\n');
    },

    toJson(results: CurationResult[], workTitles: string[]): string {
      const data = results.map((result, i) => ({
        title: workTitles[i] || `Work ${i + 1}`,
        ...result,
      }));
      
      return JSON.stringify(data, null, 2);
    },
  },
};

// Create default client instance
export const curationClient = new CurationClient();