export interface ArtworkAnalysisRequest {
    artwork: {
        id: string;
        title: string;
        artist: string;
        description?: string;
        imageUrl?: string;
        collection?: string;
        currentPrice: number;
        currency: string;
        platform: string;
    };
    marketContext: {
        floorPrice?: number;
        recentSales?: Array<{
            price: number;
            timestamp: string;
        }>;
        volumeTrend: 'up' | 'down' | 'stable';
        sentiment: 'bullish' | 'bearish' | 'neutral';
    };
    historicalData?: {
        priceHistory: Array<{
            date: string;
            price: number;
        }>;
        ownershipHistory?: string[];
    };
}
export interface DeepAnalysisResult {
    overallAssessment: {
        recommendation: 'strong_buy' | 'buy' | 'watch' | 'pass' | 'avoid';
        confidence: number;
        conviction: 'low' | 'medium' | 'high' | 'very_high';
        priceTarget: number | null;
        timeHorizon: '1_week' | '1_month' | '3_months' | '6_months' | '1_year';
    };
    reasoning: {
        summary: string;
        keyFactors: string[];
        riskAssessment: string;
        opportunityAnalysis: string;
        culturalSignificance: string;
        technicalAnalysis: string;
    };
    scores: {
        aesthetic: number;
        cultural: number;
        technical: number;
        market: number;
        rarity: number;
        liquidity: number;
        momentum: number;
        risk: number;
    };
    comparisons: {
        vsCollectionFloor: number;
        vsRecentSales: string;
        vsHistoricalAvg: string;
        peerComparisons: string[];
    };
    predictions: {
        priceDirection: 'up' | 'down' | 'stable';
        volatility: 'low' | 'medium' | 'high';
        liquidityExpectation: string;
        timeToSell: string;
        marketRisk: string;
    };
    metadata: {
        analysisDate: string;
        modelUsed: string;
        confidenceFactors: string[];
        uncertaintyFactors: string[];
    };
}
export declare class AdvancedReasoningEngine {
    private model;
    constructor();
    analyzeArtwork(request: ArtworkAnalysisRequest): Promise<DeepAnalysisResult>;
    private getSystemPrompt;
    private buildAnalysisPrompt;
    private parseResponse;
    private generateMockAnalysis;
    analyzeCulturalTrends(artworks: Array<{
        title: string;
        artist: string;
        description?: string;
    }>): Promise<{
        emergingTrends: string[];
        culturalShifts: string[];
        recommendations: string[];
        confidence: number;
    }>;
    assessPortfolioRisk(holdings: Array<{
        id: string;
        value: number;
        category: string;
        volatility: number;
    }>): Promise<{
        overallRisk: number;
        diversificationScore: number;
        concentrationRisks: string[];
        hedgeRecommendations: string[];
        volatilityPrediction: string;
    }>;
}
export declare const advancedReasoning: AdvancedReasoningEngine;
