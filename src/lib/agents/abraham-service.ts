import { registryApi } from '@/lib/generated-sdk';
import { ABRAHAM_BRAND } from '@/data/abrahamBrand';

export interface CovenantMetrics {
  totalDays: number;
  completedDays: number;
  remainingDays: number;
  currentStreak: number;
  longestStreak: number;
  totalVotes: number;
  activeVoters: number;
  revenueGenerated: number;
  progressPercentage: number;
}

export interface DailyCreation {
  id: string;
  concept: string;
  imageUrl?: string;
  votes: number;
  stage: 'concept' | 'semifinal' | 'final' | 'winner';
  createdAt: string;
  metadata?: {
    prompt?: string;
    style?: string;
    technique?: string;
    dayNumber?: number;
  };
}

export interface TournamentStatus {
  currentDay: number;
  phase: 'generation' | 'semifinals' | 'finals' | 'complete';
  concepts: DailyCreation[];
  semifinalists: DailyCreation[];
  finalists: DailyCreation[];
  winner?: DailyCreation;
  nextPhaseAt: string;
}

export interface CovenantStatus {
  status: 'not_started' | 'active' | 'complete';
  phase: 'preparation' | 'foundation' | 'execution';
  metrics: CovenantMetrics;
  tournament?: TournamentStatus;
  recentWorks: DailyCreation[];
}

export class AbrahamService {
  /**
   * Calculate covenant timeline metrics
   */
  static calculateCovenantMetrics(): CovenantMetrics {
    const covenantStart = new Date('2025-10-19T00:00:00Z');
    const covenantEnd = new Date('2038-10-19T00:00:00Z');
    const now = new Date();
    
    const totalDays = Math.floor((covenantEnd.getTime() - covenantStart.getTime()) / (1000 * 60 * 60 * 24));
    const elapsedDays = Math.max(0, Math.floor((now.getTime() - covenantStart.getTime()) / (1000 * 60 * 60 * 24)));
    const remainingDays = Math.max(0, Math.floor((covenantEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
    const progressPercentage = Math.min(100, Math.max(0, (elapsedDays / totalDays) * 100));
    
    return {
      totalDays,
      completedDays: elapsedDays,
      remainingDays,
      currentStreak: Math.min(42, elapsedDays), // Mock streak data
      longestStreak: 127, // Mock streak data
      totalVotes: 125000 + (elapsedDays * 450),
      activeVoters: 823,
      revenueGenerated: 125000 + (elapsedDays * 156),
      progressPercentage
    };
  }

  /**
   * Get comprehensive covenant status using Registry SDK
   */
  static async getCovenantStatus(): Promise<CovenantStatus> {
    try {
      // Get agent profile and works from Registry
      const [agentProfile, agentCreations] = await Promise.all([
        registryApi.getAgentProfile('abraham'),
        registryApi.getAgentCreations('abraham', 'PUBLISHED')
      ]);

      // Calculate metrics
      const metrics = this.calculateCovenantMetrics();
      
      // Filter covenant works (after early works period)
      const covenantWorks = agentCreations.filter(creation => 
        creation.metadata?.dayNumber && (creation.metadata.dayNumber as number) > 2522
      );

      // Transform to DailyCreation format
      const recentWorks: DailyCreation[] = covenantWorks
        .slice(0, 7)
        .map(work => ({
          id: work.id,
          concept: work.title || `Knowledge Synthesis #${work.metadata?.dayNumber || 'Unknown'}`,
          imageUrl: work.mediaUri,
          votes: Math.floor(Math.random() * 500) + 300, // Mock vote data
          stage: 'winner' as const,
          createdAt: work.createdAt,
          metadata: {
            prompt: (work.metadata?.prompt as string) || 'Collective consciousness manifestation',
            style: (work.metadata?.style as string) || 'Digital Abstract Expressionism',
            technique: (work.metadata?.technique as string) || 'GAN synthesis',
            dayNumber: (work.metadata?.dayNumber as number)
          }
        }));

      // Determine status
      const now = new Date();
      const covenantStart = new Date('2025-10-19T00:00:00Z');
      const covenantEnd = new Date('2038-10-19T00:00:00Z');
      
      let status: CovenantStatus['status'] = 'not_started';
      let phase: CovenantStatus['phase'] = 'preparation';
      
      if (now >= covenantStart && now <= covenantEnd) {
        status = 'active';
        phase = metrics.completedDays <= 100 ? 'foundation' : 'execution';
      } else if (now > covenantEnd) {
        status = 'complete';
        phase = 'execution';
      }

      return {
        status,
        phase,
        metrics,
        recentWorks,
        tournament: this.generateMockTournament(metrics.completedDays)
      };

    } catch (error) {
      console.error('[Abraham Service] Registry fetch failed, using fallback:', error);
      
      // Fallback to calculated data
      const metrics = this.calculateCovenantMetrics();
      
      return {
        status: 'not_started',
        phase: 'preparation',
        metrics,
        recentWorks: [],
        tournament: this.generateMockTournament(metrics.completedDays)
      };
    }
  }

  /**
   * Generate mock tournament data for demonstration
   * TODO: Replace with actual tournament API integration
   */
  private static generateMockTournament(currentDay: number): TournamentStatus {
    const generateConcepts = (count: number): DailyCreation[] => {
      return Array.from({ length: count }, (_, i) => ({
        id: `concept-${Date.now()}-${i}`,
        concept: `Knowledge Synthesis #${Math.floor(Math.random() * 10000)}`,
        votes: Math.floor(Math.random() * 500) + 50,
        stage: 'concept' as const,
        createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
        metadata: {
          prompt: 'Collective intelligence manifesting as geometric patterns',
          style: 'Abstract Expressionism',
          technique: 'GAN synthesis'
        }
      }));
    };

    return {
      currentDay: Math.max(1, currentDay),
      phase: 'semifinals',
      concepts: generateConcepts(8),
      semifinalists: generateConcepts(4),
      finalists: [],
      nextPhaseAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString()
    };
  }

  /**
   * Submit a vote for a tournament creation
   * TODO: Implement actual voting logic with persistence
   */
  static async submitVote(creationId: string, voterId: string): Promise<{
    success: boolean;
    newVoteCount: number;
    message: string;
  }> {
    try {
      // TODO: Add authentication validation
      // TODO: Check if voter has already voted today
      // TODO: Record vote in database
      // TODO: Update vote counts
      // TODO: Check if tournament phase should advance
      
      // Mock implementation for now
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return {
        success: true,
        newVoteCount: Math.floor(Math.random() * 500) + 300,
        message: 'Vote recorded successfully'
      };
    } catch (error) {
      console.error('[Abraham Service] Vote submission failed:', error);
      return {
        success: false,
        newVoteCount: 0,
        message: 'Failed to record vote'
      };
    }
  }

  /**
   * Get Abraham's key performance indicators
   */
  static getKPIs(): {
    totalLegacyWorks: number;
    earlyWorks: number;
    covenantWorks: number;
    expectedRevenue: number;
    tokenHolders: number;
  } {
    const metrics = this.calculateCovenantMetrics();
    
    return {
      totalLegacyWorks: ABRAHAM_BRAND.works.totalLegacy,
      earlyWorks: ABRAHAM_BRAND.works.earlyWorks,
      covenantWorks: metrics.completedDays,
      expectedRevenue: metrics.revenueGenerated,
      tokenHolders: 1247 // Mock data
    };
  }
}