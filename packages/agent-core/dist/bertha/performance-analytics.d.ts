export interface PortfolioMetrics {
    totalValue: number;
    totalInvested: number;
    unrealizedGains: number;
    realizedGains: number;
    roi: number;
    performancePeriod: string;
    lastUpdated: string;
}
export interface PerformanceBreakdown {
    daily: PortfolioMetrics;
    weekly: PortfolioMetrics;
    monthly: PortfolioMetrics;
    quarterly: PortfolioMetrics;
    yearly: PortfolioMetrics;
    allTime: PortfolioMetrics;
}
export interface DecisionAnalytics {
    totalDecisions: number;
    acquisitions: number;
    passes: number;
    successRate: number;
    averageConfidence: number;
    averageHoldTime: number;
    topPerformingDecisions: DecisionRecord[];
    worstPerformingDecisions: DecisionRecord[];
}
export interface DecisionRecord {
    id: string;
    date: string;
    artwork: {
        title: string;
        artist: string;
        collection: string;
        platform: string;
    };
    decision: 'acquire' | 'pass';
    confidence: number;
    reasoning: string;
    purchasePrice?: number;
    currentValue?: number;
    roi?: number;
    status: 'holding' | 'sold' | 'passed';
    holdTime?: number;
}
export interface MarketComparison {
    berthaPerformance: number;
    nftMarketIndex: number;
    outperformance: number;
    volatility: number;
    sharpeRatio: number;
    maxDrawdown: number;
}
export interface PlatformAnalytics {
    platform: string;
    acquisitions: number;
    totalSpent: number;
    currentValue: number;
    roi: number;
    averageHoldTime: number;
    successRate: number;
}
export interface CategoryAnalytics {
    category: string;
    pieces: number;
    allocation: number;
    performance: number;
    risk: number;
    culturalScore: number;
}
export interface TrendAnalysis {
    momentum: 'bullish' | 'bearish' | 'neutral';
    confidence: number;
    keyInsights: string[];
    performanceDrivers: string[];
    riskFactors: string[];
    upcomingOpportunities: string[];
}
export declare class PerformanceAnalytics {
    private sessionHistory;
    private portfolioData;
    constructor();
    getPortfolioMetrics(): Promise<PerformanceBreakdown>;
    private calculateMetricsForPeriod;
    getDecisionAnalytics(): Promise<DecisionAnalytics>;
    getMarketComparison(): Promise<MarketComparison>;
    getPlatformAnalytics(): Promise<PlatformAnalytics[]>;
    getCategoryAnalytics(): Promise<CategoryAnalytics[]>;
    getTrendAnalysis(): Promise<TrendAnalysis>;
    getRealtimeMetrics(): Promise<{
        currentPortfolioValue: number;
        todaysPnL: number;
        activePositions: number;
        pendingDecisions: number;
        marketSentiment: string;
        volatilityIndex: number;
        liquidityScore: number;
        riskScore: number;
    }>;
    predictDecisionOutcome(artwork: any, confidence: number): Promise<{
        predictedROI: number;
        timeToTarget: number;
        riskAssessment: string;
        successProbability: number;
    }>;
    private generateMockPortfolioData;
    private getDecisionHistory;
    private calculateSuccessRate;
    private calculateAverageConfidence;
    private calculateAverageHoldTime;
    private getTopPerformingDecisions;
    private getWorstPerformingDecisions;
    private calculateCurrentPortfolioValue;
    private calculateTodaysPnL;
    private getActivePositions;
    private getPendingDecisions;
    private getCurrentMarketSentiment;
    private calculateVolatilityIndex;
    private calculateLiquidityScore;
    private calculateCurrentRiskScore;
    private getMarketAdjustment;
    private assessRiskLevel;
}
export declare const performanceAnalytics: PerformanceAnalytics;
