export interface MarketData {
    platform: string;
    totalVolume24h: number;
    totalSales24h: number;
    averagePrice: number;
    topCollections: CollectionData[];
    trendingArtists: ArtistData[];
    priceMovements: PriceMovement[];
    sentiment: 'bullish' | 'bearish' | 'neutral';
    lastUpdated: string;
}
export interface CollectionData {
    name: string;
    floorPrice: number;
    volume24h: number;
    change24h: number;
    totalSupply: number;
    category: string;
}
export interface ArtistData {
    name: string;
    averagePrice: number;
    salesCount24h: number;
    totalVolume: number;
    momentum: number;
    category: string;
}
export interface PriceMovement {
    category: string;
    change24h: number;
    change7d: number;
    volume: number;
    direction: 'up' | 'down' | 'stable';
}
export declare class MarketIntelligence {
    private cache;
    private cacheTimeout;
    getMarketOverview(): Promise<MarketData>;
    getArtistIntelligence(artistName: string): Promise<ArtistData | null>;
    getCollectionTrends(category: string): Promise<PriceMovement[]>;
    getPlatformComparison(): Promise<{
        [platform: string]: MarketData;
    }>;
    private getPlatformData;
    private calculateMarketSentiment;
    private inferArtistCategory;
    private generateTrendsForCategory;
    private getFromCache;
    private setCache;
    getMarketSignalsForArtwork(artwork: {
        artist: string;
        category?: string;
        platform: string;
        currentPrice: number;
    }): Promise<{
        marketScore: number;
        priceAnalysis: string;
        trends: string[];
        risks: string[];
        opportunities: string[];
    }>;
}
export declare const marketIntelligence: MarketIntelligence;
