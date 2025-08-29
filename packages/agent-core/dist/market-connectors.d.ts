/**
 * Market Data Connectors for MIYOMI
 * Integrates with multiple prediction market platforms
 * Enhanced with real Kalshi and Polymarket APIs
 */
export interface MarketData {
    id: string;
    question: string;
    platform: 'Kalshi' | 'Polymarket' | 'Manifold' | 'Metaculus';
    yes_price: number;
    no_price: number;
    volume: number;
    liquidity: number;
    end_date: string;
    category: string;
    status: 'open' | 'closed' | 'resolved';
    resolution?: 'YES' | 'NO';
    url?: string;
    tradersCount?: number;
    lastUpdate?: string;
}
export declare class ManifoldConnector {
    private baseUrl;
    getMarkets(limit?: number): Promise<MarketData[]>;
    getMarket(id: string): Promise<MarketData | null>;
    private transformManifoldMarket;
    private categorizeManifoldMarket;
}
export declare class MeleeConnector {
    private baseUrl;
    private apiKey;
    constructor(apiKey?: string);
    getMarkets(limit?: number): Promise<MarketData[]>;
    private transformMeleeMarket;
}
export declare class MyriadConnector {
    private baseUrl;
    getMarkets(limit?: number): Promise<MarketData[]>;
    private transformMyriadMarket;
    private categorizeMyriadPrediction;
}
export declare class PolymarketConnector {
    private baseUrl;
    getMarkets(limit?: number): Promise<MarketData[]>;
    private transformPolymarketMarket;
    private categorizePolymarketMarket;
}
export declare class KalshiConnector {
    private baseUrl;
    private apiKey;
    constructor(apiKey?: string);
    getMarkets(limit?: number): Promise<MarketData[]>;
    private transformKalshiMarket;
    private categorizeKalshiMarket;
}
export declare class MarketAggregator {
    private manifold;
    private melee;
    private myriad;
    private polymarket;
    private kalshi;
    getAllMarkets(limit?: number): Promise<MarketData[]>;
    private getMockMarkets;
    getMarketsByCategory(category: string, limit?: number): Promise<MarketData[]>;
}
export declare const marketAggregator: MarketAggregator;
