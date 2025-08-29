/**
 * MIYOMI Real-Time Data Integration
 * Fetches live market data, news sentiment, and trending topics for dynamic video generation
 */
export interface RealTimeMarketData {
    symbol: string;
    price: number;
    change: number;
    changePercent: number;
    volume: number;
    marketCap?: number;
    sentiment: 'bullish' | 'bearish' | 'neutral';
    volatility: number;
    timestamp: string;
}
export interface NewsItem {
    title: string;
    summary: string;
    sentiment: 'positive' | 'negative' | 'neutral';
    source: string;
    publishedAt: string;
    relevance: number;
    categories: string[];
    impact: 'high' | 'medium' | 'low';
}
export interface TrendingTopic {
    topic: string;
    sector: 'politics' | 'sports' | 'finance' | 'ai' | 'pop' | 'geo' | 'internet';
    momentum: number;
    sentiment: 'positive' | 'negative' | 'neutral';
    keywords: string[];
    sources: string[];
    timeframe: '1h' | '4h' | '24h' | '7d';
}
export interface MarketEvent {
    id: string;
    type: 'earnings' | 'fed_meeting' | 'election' | 'product_launch' | 'economic_data';
    title: string;
    description: string;
    scheduledTime: string;
    impact: 'high' | 'medium' | 'low';
    affectedAssets: string[];
    probability: number;
    consensusView: string;
    contrarian_angle?: string;
}
export interface RealTimeContext {
    timestamp: string;
    marketData: RealTimeMarketData[];
    news: NewsItem[];
    trending: TrendingTopic[];
    events: MarketEvent[];
    marketSentiment: {
        overall: 'fear' | 'greed' | 'neutral';
        vixLevel: number;
        putCallRatio: number;
        cryptoFearGreedIndex: number;
    };
    socialSentiment: {
        twitter: {
            bullish: number;
            bearish: number;
            neutral: number;
        };
        reddit: {
            bullish: number;
            bearish: number;
            neutral: number;
        };
        news: {
            positive: number;
            negative: number;
            neutral: number;
        };
    };
}
export declare class MiyomiRealTimeDataSource {
    private apiKeys;
    constructor();
    /**
     * Fetch comprehensive real-time context for video generation
     */
    getRealTimeContext(): Promise<RealTimeContext>;
    /**
     * Fetch real-time market data from multiple sources
     */
    private fetchMarketData;
    /**
     * Fetch latest financial news with sentiment analysis
     */
    private fetchLatestNews;
    /**
     * Fetch trending topics from social media and search
     */
    private fetchTrendingTopics;
    /**
     * Fetch upcoming market events
     */
    private fetchUpcomingEvents;
    /**
     * Fetch market sentiment indicators
     */
    private fetchMarketSentiment;
    private analyzePriceSentiment;
    private calculateVolatility;
    private analyzeSentiment;
    private calculateRelevance;
    private categorizeNews;
    private assessNewsImpact;
    private categorizeKeyword;
    private getRelatedKeywords;
    private getAffectedAssets;
    private generateMockMarketData;
    private generateMockNews;
}
export declare const miyomiRealTimeData: MiyomiRealTimeDataSource;
