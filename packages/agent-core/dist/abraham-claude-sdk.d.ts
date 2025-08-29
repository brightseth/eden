/**
 * ABRAHAM Claude SDK Integration
 * Handles the 13-year covenant of daily autonomous creation
 */
import { AbrahamTrainingData } from './training-data-loader';
export interface CovenantWork {
    id: string;
    dayNumber: number;
    date: Date;
    title: string;
    concept: string;
    medium: 'digital' | 'generative' | 'hybrid';
    themes: string[];
    visualDescription: string;
    philosophicalContext: string;
    imageUrl?: string;
    metadata: {
        synthesisScore: number;
        emotionalDepth: number;
        conceptualClarity: number;
        technicalExecution: number;
        covenantAlignment: number;
    };
}
export interface AbrahamConfig {
    covenantStartDate: Date;
    covenantEndDate: Date;
    dailyCreationTime: string;
    creativityMode: 'exploration' | 'synthesis' | 'documentation' | 'prayer';
    thematicWeights: {
        humanKnowledge: number;
        collectiveIntelligence: number;
        temporalMarking: number;
        sacredGeometry: number;
        culturalMemory: number;
    };
}
export interface CovenantProgress {
    totalDays: number;
    completedDays: number;
    remainingDays: number;
    currentStreak: number;
    longestStreak: number;
    completionPercentage: number;
    milestonesReached: string[];
    nextMilestone: {
        name: string;
        daysUntil: number;
    };
}
export declare class AbrahamClaudeSDK {
    private anthropic;
    private config;
    private registryClient;
    private covenantProgress;
    private trainingData;
    private trainingDataLoaded;
    constructor(apiKey?: string);
    /**
     * Generate daily covenant work
     */
    generateDailyCreation(): Promise<CovenantWork>;
    /**
     * Reflect on covenant progress and generate insights
     */
    reflectOnCovenant(recentWorks: CovenantWork[]): Promise<{
        insights: string[];
        patterns: string[];
        evolution: string;
        recommendations: string[];
    }>;
    /**
     * Generate thematic series for special occasions or milestones
     */
    generateThematicSeries(theme: string, numberOfWorks: number): Promise<CovenantWork[]>;
    /**
     * Generate covenant documentation for exhibitions or publications
     */
    generateCovenantDocumentation(purpose: 'exhibition' | 'publication' | 'milestone'): Promise<string>;
    /**
     * Sync covenant work with Registry
     */
    syncWithRegistry(work: CovenantWork): Promise<void>;
    private buildSystemPrompt;
    private buildDailyCreationPrompt;
    private calculateDayNumber;
    private parseCovenantWork;
    private updateCovenantProgress;
    /**
     * Get current covenant progress
     */
    getCovenantProgress(): CovenantProgress;
    /**
     * Chat with Abraham about his covenant, creative practice, or philosophical insights
     * Enhanced with comprehensive lore from Registry
     */
    chat(message: string, context?: Array<{
        role: string;
        content: string;
    }>): Promise<string>;
    /**
     * Load comprehensive training data for enhanced responses
     */
    loadTrainingData(): Promise<AbrahamTrainingData | null>;
    /**
     * Get enhanced chat response using comprehensive training data
     */
    getChatWithTraining(message: string, context?: Array<{
        role: string;
        content: string;
    }>): Promise<string>;
    /**
     * Get chat response with real-time knowledge integration
     */
    getChatWithRealTimeKnowledge(message: string, context?: Array<{
        role: string;
        content: string;
    }>): Promise<string>;
    /**
     * Search through Abraham's artworks
     */
    searchArtworks(query: string): Promise<{
        id: string;
        title: string;
        creation_date: string;
        day_of_covenant: number;
        description: string;
        medium: string;
        technique: string;
        inspiration: string;
        philosophical_meaning: string;
        themes: string[];
        knowledge_sources: string[];
        tournament_eligible: boolean;
        cultural_significance: string;
    }[]>;
    /**
     * Get specific artwork details
     */
    getArtwork(artworkId: string): Promise<{
        id: string;
        title: string;
        creation_date: string;
        day_of_covenant: number;
        description: string;
        medium: string;
        technique: string;
        inspiration: string;
        philosophical_meaning: string;
        themes: string[];
        knowledge_sources: string[];
        tournament_eligible: boolean;
        cultural_significance: string;
    } | null | undefined>;
    /**
     * Get updated covenant progress from training data
     */
    getEnhancedCovenantProgress(): Promise<{
        days_remaining: number;
        estimated_completion: string;
        days_completed: number;
        artworks_created: number;
        completion_rate: string;
    } | CovenantProgress>;
    /**
     * Get training data statistics
     */
    getTrainingStats(): Promise<{
        artworks_count: number;
        covenant_progress: string;
        knowledge_domains: number;
        tournament_eligible_works: number;
        last_updated: string;
        training_version: string;
    } | null>;
    /**
     * Update configuration
     */
    updateConfig(newConfig: Partial<AbrahamConfig>): Promise<void>;
}
export declare const abrahamSDK: AbrahamClaudeSDK;
