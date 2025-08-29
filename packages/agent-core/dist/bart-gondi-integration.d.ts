/**
 * BART Gondi Integration Service
 * Handles real-time integration with Gondi NFT lending platform
 */
export interface GondiMarketData {
    offers: GondiOffer[];
    listings: GondiListing[];
    collections: GondiCollection[];
    marketStats: MarketStats;
}
export interface GondiOffer {
    id: string;
    collection: string;
    collectionName: string;
    principalAmount: string;
    apr: number;
    duration: number;
    loanToValue: number;
    currency: 'WETH' | 'USDC';
    offerer: string;
    expirationTime: number;
    created: string;
}
export interface GondiListing {
    id: string;
    collection: string;
    tokenId: string;
    borrower: string;
    requestedAmount: string;
    duration: number;
    collateralValue: string;
    created: string;
}
export interface GondiCollection {
    id: string;
    name: string;
    contractAddress: string;
    floorPrice: number;
    volume24h: number;
    averageLTV: number;
    totalLoans: number;
    defaultRate: number;
    supported: boolean;
}
export interface MarketStats {
    totalVolumeUSD: number;
    activeLoans: number;
    averageAPR: number;
    totalValueLocked: string;
    topCollections: string[];
    marketTrend: 'bull' | 'bear' | 'neutral';
}
export interface LoanOfferParams {
    collectionId: string;
    principalAmount: string;
    apr: number;
    duration: number;
    currency: 'WETH' | 'USDC';
    repayment: string;
    expiration?: number;
}
export interface SingleNftOfferParams {
    contractAddress: string;
    tokenId: string;
    principalAmount: string;
    apr: number;
    duration: number;
    currency: 'WETH' | 'USDC';
    repayment: string;
    expiration?: number;
}
export declare class BartGondiService {
    private gondi;
    private isInitialized;
    constructor();
    private initializeIfPossible;
    /**
     * Get current market data from Gondi
     */
    getMarketData(): Promise<GondiMarketData>;
    /**
     * Get collection-specific lending data
     */
    getCollectionData(): Promise<GondiCollection[]>;
    /**
     * Get NFT ID for specific NFT (required for single NFT offers)
     */
    getNftId(contractAddress: string, tokenId: string): Promise<number | null>;
    /**
     * Make a lending offer for a specific NFT
     */
    makeSingleNftOffer(params: SingleNftOfferParams): Promise<{
        success: boolean;
        transactionHash?: string;
        offerId?: string;
        nftId?: number;
        error?: string;
    }>;
    /**
     * Make a collection-wide lending offer on Gondi platform
     */
    makeOffer(params: LoanOfferParams): Promise<{
        success: boolean;
        transactionHash?: string;
        offerId?: string;
        error?: string;
    }>;
    /**
     * Evaluate a specific NFT for lending potential
     */
    evaluateNFT(contractAddress: string, tokenId: string): Promise<{
        collection: string;
        tokenId: string;
        estimatedValue: number;
        recommendedLTV: number;
        suggestedAPR: number;
        riskScore: number;
        liquidityScore: number;
        supported: boolean;
        reasoning: string;
    }>;
    /**
     * Get market statistics
     */
    private getMarketStats;
    /**
     * Mock data for testing when Gondi client is not available
     */
    private getMockMarketData;
    private getMockCollections;
    /**
     * Check if the service is connected to real Gondi API
     */
    isConnectedToGondi(): boolean;
    /**
     * Get service status for debugging
     */
    getStatus(): {
        initialized: boolean;
        mockMode: boolean;
        hasPrivateKey: boolean;
        environment: {
            gondiKey: boolean;
            ethereumRpc: boolean;
            alchemyKey: boolean;
            rpcEndpoint: string;
        };
    };
}
export declare const bartGondiService: BartGondiService;
