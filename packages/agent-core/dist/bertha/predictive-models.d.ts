export interface PriceData {
    timestamp: string;
    price: number;
    volume: number;
    platform: string;
}
export interface SocialSignal {
    platform: string;
    mentions: number;
    sentiment: number;
    engagement: number;
    timestamp: string;
}
export interface TechnicalIndicators {
    sma_7: number;
    sma_30: number;
    rsi: number;
    volatility: number;
    momentum: number;
    support: number;
    resistance: number;
}
export interface MarketPrediction {
    prediction: {
        direction: 'bullish' | 'bearish' | 'neutral';
        priceTarget: number;
        confidence: number;
        timeframe: '1_day' | '7_days' | '30_days' | '90_days';
        probability: {
            up_10_percent: number;
            down_10_percent: number;
            sideways: number;
        };
    };
    technicalAnalysis: {
        trend: 'uptrend' | 'downtrend' | 'sideways';
        strength: 'weak' | 'moderate' | 'strong';
        signals: string[];
        indicators: TechnicalIndicators;
    };
    socialSentiment: {
        overall: number;
        momentum: 'increasing' | 'decreasing' | 'stable';
        keyTopics: string[];
        influencerActivity: number;
    };
    marketTiming: {
        buySignal: 'strong' | 'weak' | 'none';
        sellSignal: 'strong' | 'weak' | 'none';
        optimalEntry: string;
        riskReward: number;
    };
    reasoning: {
        summary: string;
        keyDrivers: string[];
        risks: string[];
        catalysts: string[];
    };
}
export interface CollectionPrediction {
    collection: string;
    floorPrediction: {
        next_7_days: {
            price: number;
            confidence: number;
        };
        next_30_days: {
            price: number;
            confidence: number;
        };
        next_90_days: {
            price: number;
            confidence: number;
        };
    };
    volumePrediction: {
        trend: 'increasing' | 'decreasing' | 'stable';
        expectedVolume: number;
        confidence: number;
    };
    narrativeAnalysis: {
        currentNarrative: string;
        strengthening: boolean;
        catalysts: string[];
        threats: string[];
    };
}
export declare class PredictiveModels {
    private historicalData;
    private socialSignals;
    constructor();
    private initializeModels;
    predictPrice(symbol: string, historicalPrices: PriceData[], socialSignals?: SocialSignal[], timeframe?: '1_day' | '7_days' | '30_days' | '90_days'): Promise<MarketPrediction>;
    private calculateTechnicalIndicators;
    private calculateSMA;
    private calculateRSI;
    private calculateVolatility;
    private analyzeSocialSentiment;
    private generatePricePrediction;
    private analyzeMarketTiming;
    private generateMockIndicators;
    private identifyTrend;
    private assessTrendStrength;
    private generateTechnicalSignals;
    private generatePredictionSummary;
    private identifyKeyDrivers;
    private identifyRisks;
    private identifyPotentialCatalysts;
    private extractKeyTopics;
    private calculateInfluencerActivity;
    private determineOptimalEntry;
    predictCollectionTrends(collection: string, historicalData: any[]): Promise<CollectionPrediction>;
}
export declare const predictiveModels: PredictiveModels;
