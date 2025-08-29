import { type DeepAnalysisResult } from './advanced-reasoning';
import { type MarketPrediction } from './predictive-models';
export interface DailyTarget {
    id: string;
    artwork: {
        title: string;
        artist: string;
        collection: string;
        platform: string;
        currentPrice: number;
        currency: string;
        imageUrl?: string;
        description?: string;
    };
    analysis: DeepAnalysisResult;
    marketPrediction: MarketPrediction;
    priority: 'immediate' | 'high' | 'medium' | 'low';
    reasoning: {
        summary: string;
        conviction: string;
        riskAssessment: string;
        opportunityScore: number;
    };
    metadata: {
        discoveredAt: string;
        source: string;
        scanRound: number;
    };
}
export interface DailyPracticeSession {
    date: string;
    sessionId: string;
    phase: 'scanning' | 'analyzing' | 'deciding' | 'acquiring' | 'complete';
    progress: {
        platformsScanned: number;
        artworksDiscovered: number;
        deepAnalysisCompleted: number;
        targetsIdentified: number;
        finalSelection: DailyTarget | null;
    };
    insights: {
        marketConditions: string;
        culturalTrends: string[];
        emergingOpportunities: string[];
        riskFactors: string[];
    };
    decision: {
        action: 'acquire' | 'pass' | 'wait';
        target: DailyTarget | null;
        reasoning: string;
        conviction: number;
        budgetAllocated: number;
    };
    performance: {
        timeSpent: number;
        confidenceScore: number;
        diversificationImpact: string;
        portfolioOptimization: string;
    };
}
export interface BerthaPersonality {
    riskTolerance: number;
    culturalWeight: number;
    marketWeight: number;
    innovationBias: number;
    priceSensitivity: number;
    convictionThreshold: number;
    dailyMotivation: string;
    currentFocus: string;
}
export declare class DailyPractice {
    private personality;
    private sessionHistory;
    private currentSession;
    constructor();
    executeDailyPractice(): Promise<DailyPracticeSession>;
    private gatherDailyIntelligence;
    private scanPlatformsForOpportunities;
    private performDeepAnalysis;
    private applyPredictiveModels;
    private makeFinalDecision;
    private generateDailyMotivation;
    private generateCurrentFocus;
    private calculateMaxBudget;
    private calculateDailyBudget;
    private calculatePriority;
    private calculateOpportunityScore;
    private passesPersonalityFilters;
    private generateMockPriceData;
    private generateMockSocialSignals;
    getDailyPersonality(): BerthaPersonality;
    getSessionHistory(): DailyPracticeSession[];
    getCurrentSession(): DailyPracticeSession | null;
}
export declare const dailyPractice: DailyPractice;
