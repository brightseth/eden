export interface NFTAsset {
    id: string;
    token_id: string;
    name: string;
    description: string;
    image_url: string;
    collection: {
        name: string;
        slug: string;
        floor_price: number;
        total_volume: number;
    };
    creator: {
        username: string;
        address: string;
    };
    current_price: number;
    last_sale: {
        price: number;
        timestamp: string;
        currency: string;
    };
    traits: Array<{
        trait_type: string;
        value: string;
        rarity: number;
    }>;
    platform: string;
}
export interface MarketStats {
    collection: string;
    floor_price: number;
    volume_24h: number;
    sales_24h: number;
    average_price_24h: number;
    market_cap: number;
    num_owners: number;
    total_supply: number;
}
export interface TrendingCollection {
    name: string;
    slug: string;
    floor_price: number;
    volume_change_24h: number;
    sales_count_24h: number;
    image: string;
    verified: boolean;
}
export declare class NFTAPIConnector {
    private baseUrl;
    private apiKey;
    private cache;
    private cacheTime;
    constructor();
    getTrendingCollections(limit?: number): Promise<TrendingCollection[]>;
    getNFTAsset(contractAddress: string, tokenId: string): Promise<NFTAsset | null>;
    getCollectionStats(slug: string): Promise<MarketStats | null>;
    searchNFTs(params: {
        collection?: string;
        minPrice?: number;
        maxPrice?: number;
        traits?: Record<string, string>;
        sortBy?: 'price' | 'recent' | 'rarity';
        limit?: number;
    }): Promise<NFTAsset[]>;
    getRecentSales(collection?: string, limit?: number): Promise<Array<{
        asset: NFTAsset;
        price: number;
        timestamp: string;
        buyer: string;
        seller: string;
    }>>;
    getFloorPriceHistory(collection: string, days?: number): Promise<Array<{
        timestamp: string;
        floor_price: number;
        volume: number;
        sales_count: number;
    }>>;
    private getCached;
    private setCache;
}
export declare const nftAPIConnector: NFTAPIConnector;
