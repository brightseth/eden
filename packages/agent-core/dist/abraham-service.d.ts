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
export declare class AbrahamService {
    /**
     * Calculate covenant timeline metrics
     */
    static calculateCovenantMetrics(): CovenantMetrics;
    /**
     * Get comprehensive covenant status using Registry SDK
     */
    static getCovenantStatus(): Promise<CovenantStatus>;
    /**
     * Generate mock tournament data for demonstration
     * TODO: Replace with actual tournament API integration
     */
    private static generateMockTournament;
    /**
     * Submit a vote for a tournament creation
     * TODO: Implement actual voting logic with persistence
     */
    static submitVote(creationId: string, voterId: string): Promise<{
        success: boolean;
        newVoteCount: number;
        message: string;
    }>;
    /**
     * Get Abraham's key performance indicators
     */
    static getKPIs(): {
        totalLegacyWorks: number;
        earlyWorks: number;
        covenantWorks: number;
        expectedRevenue: number;
        tokenHolders: number;
    };
}
