/**
 * CITIZEN Market Data Integration
 * Fetches live pricing and market data for all CryptoCitizens collections
 * Enhanced with Dune Analytics on-chain verification
 */
interface CollectionStats {
    slug: string;
    name: string;
    city: string;
    floorPrice: number | null;
    volume24h: number | null;
    volume7d: number | null;
    volumeTotal: number | null;
    owners: number | null;
    totalSupply: number;
    salesCount: number | null;
    averagePrice: number | null;
    lastUpdated: string;
}
interface RecentSale {
    tokenId: string;
    price: number;
    priceUsd: number | null;
    currency: string;
    seller: string;
    buyer: string;
    timestamp: string;
    collection: string;
    city: string;
    marketplace: string;
}
interface MarketSummary {
    totalCollections: number;
    totalVolume: number;
    totalSales: number;
    averageFloorPrice: number;
    topPerformingCity: string;
    recentActivity: RecentSale[];
    priceRanges: {
        lowest: {
            collection: string;
            price: number;
        };
        highest: {
            collection: string;
            price: number;
        };
    };
    marketHealth: {
        score: number;
        trend: 'bullish' | 'bearish' | 'stable';
        liquidityIndex: number;
    };
}
export declare class CitizenMarketData {
    private openSeaApiKey;
    private alchemyApiKey;
    private moralisApiKey;
    private readonly collections;
    constructor();
    /**
     * Fetch collection stats from OpenSea API
     */
    fetchOpenSeaStats(slug: string): Promise<CollectionStats | null>;
    /**
     * Fetch recent sales from OpenSea API
     */
    fetchRecentSales(slug: string, limit?: number): Promise<RecentSale[]>;
    /**
     * Get comprehensive market data for all CryptoCitizens collections
     */
    getAllCollectionStats(): Promise<CollectionStats[]>;
    /**
     * Generate comprehensive market summary enhanced with Dune Analytics
     */
    getMarketSummary(): Promise<MarketSummary>;
    /**
     * Calculate market trend based on volume changes
     */
    private calculateTrend;
    /**
     * Fallback mock data when APIs are unavailable
     */
    private getMockMarketSummary;
    /**
     * Get market data for a specific city/collection
     */
    getCityMarketData(city: string): Promise<CollectionStats | null>;
    /**
     * Fetch collection image and metadata from OpenSea API
     */
    fetchCollectionImages(slug: string): Promise<{
        banner_image_url: string | null;
        featured_image_url: string | null;
        large_image_url: string | null;
        sample_images: string[];
    } | null>;
    /**
     * Fetch sample NFTs from a collection with their images
     */
    fetchSampleNFTs(slug: string, limit?: number): Promise<{
        id: string;
        name: string;
        image_url: string;
        permalink: string;
        token_id: string;
    }[]>;
    /**
     * Fetch NFTs from wallet addresses (supports ENS domains)
     */
    fetchWalletNFTs(walletAddress: string): Promise<{
        nfts: Array<{
            contract_address: string;
            token_id: string;
            name: string;
            image_url: string;
            collection_name: string;
            opensea_url: string;
            floor_price?: number;
        }>;
        total_value_eth: number;
        bright_moments_nfts: number;
        cryptocitizens_count: number;
    } | null>;
    /**
     * Fetch treasury holdings from known Bright Moments wallets
     */
    getBrightMomentsTreasuryHoldings(): Promise<{
        wallets: Array<{
            address: string;
            ens_name?: string;
            description: string;
            nft_count: number;
            estimated_value_eth: number;
            cryptocitizens_count: number;
        }>;
        total_treasury_value: number;
        total_nfts: number;
        treasury_breakdown: {
            cryptocitizens: number;
            bright_moments_editions: number;
            community_submissions: number;
            other_collections: number;
        };
    } | null>;
    /**
     * Check if holder has Full Set or Ultra Set based on current market data
     */
    analyzeHolderValue(walletAddress: string): Promise<{
        estimatedValue: number;
        holdings: {
            collection: string;
            tokenCount: number;
            estimatedValue: number;
        }[];
        setStatus: 'ultra' | 'full' | 'partial' | 'single';
    }>;
    /**
     * Get enhanced market insights combining OpenSea and Dune Analytics
     */
    getEnhancedMarketInsights(): Promise<{
        dune_verified: boolean;
        on_chain_metrics: any;
        market_intelligence: string[];
        data_confidence: 'high' | 'medium' | 'low';
        verification_status: string;
    }>;
    /**
     * Validate market data consistency between OpenSea and Dune
     */
    validateDataConsistency(): Promise<{
        consistency_score: number;
        discrepancies: string[];
        recommendations: string[];
    }>;
}
export declare const citizenMarketData: CitizenMarketData;
export {};
