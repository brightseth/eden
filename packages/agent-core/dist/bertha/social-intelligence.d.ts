export interface SocialSentimentData {
    platform: 'twitter' | 'discord' | 'telegram' | 'reddit';
    mentions: number;
    sentiment: number;
    engagement: number;
    influencerMentions: number;
    trendingScore: number;
    timeframe: string;
}
export interface CreatorMomentumMetrics {
    artistHandle: string;
    followersGrowth: number;
    engagementRate: number;
    recentSales: number;
    priceVelocity: number;
    collaborationScore: number;
    innovationIndex: number;
    culturalRelevance: number;
    careerTrajectory: 'emerging' | 'established' | 'legendary' | 'declining';
    momentumScore: number;
}
export interface MarketTimingSignals {
    technicalIndicators: {
        rsi: number;
        macd: number;
        bollingerBands: {
            upper: number;
            middle: number;
            lower: number;
        };
        volume: number;
        momentum: number;
    };
    socialSignals: {
        overallSentiment: number;
        buzzIndex: number;
        fearGreedIndex: number;
        whaleActivity: number;
    };
    culturalSignals: {
        trendAlignment: number;
        narrativeStrength: number;
        communityHealth: number;
        institutionalInterest: number;
    };
    timingScore: number;
    recommendation: 'strong_buy' | 'buy' | 'wait' | 'caution' | 'avoid';
}
export interface PredictionModel {
    modelName: string;
    confidence: number;
    timeHorizon: '1d' | '7d' | '30d' | '90d';
    prediction: {
        direction: 'up' | 'down' | 'sideways';
        magnitude: number;
        probability: number;
    };
    keyFactors: string[];
    riskFactors: string[];
}
export interface CreatorCareerAnalysis {
    artist: string;
    careerStage: string;
    trajectory: string;
    keyMilestones: string[];
    upcomingCatalysts: string[];
    riskFactors: string[];
    investmentThesis: string;
    timeHorizon: string;
    confidenceScore: number;
}
export declare class SocialIntelligence {
    private apiKeys;
    private sentimentCache;
    constructor();
    analyzeSocialSentiment(artist: string, artwork: string): Promise<SocialSentimentData[]>;
    analyzeCreatorMomentum(artist: string): Promise<CreatorMomentumMetrics>;
    generateMarketTimingSignals(symbol: string): Promise<MarketTimingSignals>;
    generatePredictionEnsemble(artwork: any, socialData: SocialSentimentData[], creatorMomentum: CreatorMomentumMetrics): Promise<PredictionModel[]>;
    analyzeCreatorCareer(artist: string): Promise<CreatorCareerAnalysis>;
    analyzeMarketMicrostructure(collection: string): Promise<{
        bidAskSpread: number;
        orderBookDepth: number;
        whaleActivity: number;
        institutionalFlow: number;
        retailSentiment: number;
        liquidityScore: number;
        manipulationRisk: number;
    }>;
    private fetchPlatformSentiment;
    private fetchCreatorSocialMetrics;
    private fetchCreatorSalesMetrics;
    private analyzeCreatorCollaborations;
    private fetchCreatorCareerData;
    private calculateMomentumScore;
    private calculateInnovationIndex;
    private calculateCulturalRelevance;
    private determineCareerTrajectory;
    private calculateAdvancedTechnicals;
    private aggregateSocialSignals;
    private analyzeCulturalSignals;
    private calculateTimingScore;
    private generateTimingRecommendation;
    private runPredictionModel;
    private generateKeyFactors;
    private generateRiskFactors;
    private determineCareerStage;
    private identifyKeyMilestones;
    private identifyUpcomingCatalysts;
    private identifyCreatorRiskFactors;
    private generateInvestmentThesis;
    private recommendTimeHorizon;
    private calculateCareerAnalysisConfidence;
}
export declare const socialIntelligence: SocialIntelligence;
