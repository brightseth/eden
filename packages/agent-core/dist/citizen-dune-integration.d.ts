/**
 * CITIZEN Dune Analytics Integration
 * Fetches data from Dune dashboard: https://dune.com/cat/bright-moments
 */
interface BrightMomentsDuneData {
    collections: {
        name: string;
        contract_address: string;
        total_volume: number;
        floor_price: number;
        sales_count: number;
        unique_holders: number;
        avg_price: number;
    }[];
    overall_stats: {
        total_volume: number;
        total_sales: number;
        total_holders: number;
        active_collections: number;
        avg_daily_volume_7d?: number;
        avg_daily_sales_7d?: number;
        market_velocity?: number;
        ecosystem_health_score?: number;
    };
    price_history: {
        date: string;
        collection: string;
        avg_price: number;
        volume: number;
    }[];
    holder_analysis: {
        full_set_holders: number;
        multi_collection_holders: number;
        single_collection_holders: number;
    };
    volume_trends?: {
        date: string;
        total_volume: number;
        total_sales: number;
        average_price: number;
        unique_buyers: number;
        unique_sellers: number;
    }[];
    floor_trends?: {
        date: string;
        collection_name: string;
        floor_price: number;
        floor_change_24h: number;
        volume_24h: number;
        sales_24h: number;
    }[];
    city_performance?: {
        city: string;
        collection_name: string;
        total_volume: number;
        floor_price: number;
        market_cap: number;
        holder_count: number;
        cultural_significance_rank: number;
        minting_year: number;
        performance_score: number;
    }[];
    data_freshness?: string;
    source?: string;
}
export declare class CitizenDuneIntegration {
    private duneApiKey;
    private baseUrl;
    private readonly queries;
    constructor();
    /**
     * Execute a Dune query and return results with enhanced error handling
     */
    private executeDuneQuery;
    /**
     * Get comprehensive Bright Moments data from Dune
     */
    getBrightMomentsData(): Promise<BrightMomentsDuneData | null>;
    /**
     * Process collections data from Dune query
     */
    private processCollectionsData;
    /**
     * Process sales history data from Dune query
     */
    private processSalesData;
    /**
     * Process holder analysis data from Dune query
     */
    private processHolderData;
    /**
     * Process volume trends data from Dune query
     */
    private processVolumeData;
    /**
     * Process floor price tracking data from Dune query
     */
    private processFloorPriceData;
    /**
     * Process city performance data from Dune query
     */
    private processCityData;
    /**
     * Calculate enhanced overall statistics from collections and volume data
     */
    private calculateOverallStats;
    /**
     * Get collection-specific analytics from Dune
     */
    getCollectionAnalytics(contractAddress: string): Promise<any>;
    /**
     * Enhanced mock data for development when Dune API is not configured
     * Includes comprehensive market intelligence data
     */
    private getMockDuneData;
    /**
     * Get real-time holder analysis including Full Set and Ultra Set data
     */
    getHolderAnalysis(): Promise<any>;
    /**
     * Generate market insights from Dune data
     */
    getMarketInsights(): Promise<string[]>;
}
export declare const citizenDune: CitizenDuneIntegration;
export {};
