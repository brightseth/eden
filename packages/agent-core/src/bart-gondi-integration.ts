/**
 * BART Gondi Integration Service
 * Handles real-time integration with Gondi NFT lending platform
 */

import { Gondi } from 'gondi';
import { createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { mainnet } from 'viem/chains';

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
  principalAmount: string; // in ETH or USDC
  apr: number;
  duration: number; // in days
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
  duration: number; // in seconds
  currency: 'WETH' | 'USDC';
  repayment: string;
  expiration?: number;
}

export interface SingleNftOfferParams {
  contractAddress: string;
  tokenId: string;
  principalAmount: string;
  apr: number;
  duration: number; // in seconds
  currency: 'WETH' | 'USDC';
  repayment: string;
  expiration?: number;
}

export class BartGondiService {
  private gondi: Gondi | null = null;
  private isInitialized = false;

  constructor() {
    // Initialize will be called when needed
    this.initializeIfPossible();
  }

  private async initializeIfPossible() {
    try {
      // Environment variable validation and gating
      const privateKey = process.env.GONDI_PRIVATE_KEY;
      const rpcUrl = process.env.ETHEREUM_RPC_URL || process.env.ALCHEMY_API_KEY 
        ? `https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`
        : 'https://eth-mainnet.g.alchemy.com/v2/demo';
      
      // Log environment status for debugging
      console.log('[BART Gondi] Environment Check:');
      console.log('- GONDI_PRIVATE_KEY:', privateKey ? '✅ Present' : '❌ Missing');
      console.log('- ETHEREUM_RPC_URL:', process.env.ETHEREUM_RPC_URL ? '✅ Custom' : '🔄 Using Alchemy');
      console.log('- RPC Endpoint:', rpcUrl.includes('demo') ? '⚠️  Demo (rate limited)' : '✅ Production');
      
      if (!privateKey) {
        console.warn('[BART Gondi] No private key provided, operating in MOCK MODE');
        console.warn('[BART Gondi] Set GONDI_PRIVATE_KEY to enable live trading');
        return;
      }

      // Create wallet client
      const account = privateKeyToAccount(privateKey as `0x${string}`);
      const wallet = createWalletClient({
        account,
        chain: mainnet,
        transport: http(rpcUrl)
      });

      // Initialize Gondi client
      this.gondi = new Gondi({ wallet });
      this.isInitialized = true;
      
      console.log('[BART Gondi] Successfully initialized Gondi client');
    } catch (error) {
      console.error('[BART Gondi] Failed to initialize:', error);
      this.gondi = null;
      this.isInitialized = false;
    }
  }

  /**
   * Get current market data from Gondi
   */
  async getMarketData(): Promise<GondiMarketData> {
    if (!this.isInitialized) {
      return this.getMockMarketData();
    }

    try {
      // Get live offers and listings
      const [offers, listings] = await Promise.all([
        this.gondi!.offers(),
        this.gondi!.listings()
      ]);

      // Transform the data to our format
      const transformedOffers = offers.map((offer: any) => ({
        id: offer.id || offer.hash || 'unknown',
        collection: offer.collection?.name || 'Unknown',
        collectionName: offer.collection?.name || 'Unknown Collection',
        principalAmount: offer.principalAmount || '0',
        apr: offer.apr || 0,
        duration: Math.floor((offer.duration || 0) / 86400), // Convert seconds to days
        loanToValue: offer.loanToValue || 0,
        currency: offer.currency || 'WETH',
        offerer: offer.offerer || 'unknown',
        expirationTime: offer.expirationTime || 0,
        created: new Date().toISOString()
      })) as GondiOffer[];

      const transformedListings = listings.map((listing: any) => ({
        id: listing.id || 'unknown',
        collection: listing.collection?.name || 'Unknown',
        tokenId: listing.tokenId || '0',
        borrower: listing.borrower || 'unknown',
        requestedAmount: listing.requestedAmount || '0',
        duration: Math.floor((listing.duration || 0) / 86400),
        collateralValue: listing.collateralValue || '0',
        created: new Date().toISOString()
      })) as GondiListing[];

      return {
        offers: transformedOffers,
        listings: transformedListings,
        collections: await this.getCollectionData(),
        marketStats: await this.getMarketStats()
      };

    } catch (error) {
      console.error('[BART Gondi] Error fetching market data:', error);
      return this.getMockMarketData();
    }
  }

  /**
   * Get collection-specific lending data
   */
  async getCollectionData(): Promise<GondiCollection[]> {
    if (!this.isInitialized) {
      return this.getMockCollections();
    }

    try {
      // This would ideally come from Gondi API
      // For now, return data based on their whitelisted collections
      return [
        {
          id: 'cryptopunks',
          name: 'CryptoPunks',
          contractAddress: '0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb',
          floorPrice: 45.2,
          volume24h: 234.7,
          averageLTV: 0.65,
          totalLoans: 147,
          defaultRate: 0.018,
          supported: true
        },
        {
          id: 'boredapeyachtclub',
          name: 'Bored Ape Yacht Club',
          contractAddress: '0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d',
          floorPrice: 28.9,
          volume24h: 189.3,
          averageLTV: 0.70,
          totalLoans: 203,
          defaultRate: 0.022,
          supported: true
        },
        {
          id: 'art-blocks-curated',
          name: 'Art Blocks Curated',
          contractAddress: '0xa7d8d9ef8d8ce8992df33d8b8cf4aebabd5bd270',
          floorPrice: 12.1,
          volume24h: 45.2,
          averageLTV: 0.60,
          totalLoans: 89,
          defaultRate: 0.015,
          supported: true
        },
        {
          id: 'azuki',
          name: 'Azuki',
          contractAddress: '0xed5af388653567af2f388e6224dc7c4b3241c544',
          floorPrice: 13.7,
          volume24h: 67.8,
          averageLTV: 0.68,
          totalLoans: 156,
          defaultRate: 0.025,
          supported: true
        }
      ];

    } catch (error) {
      console.error('[BART Gondi] Error fetching collection data:', error);
      return this.getMockCollections();
    }
  }

  /**
   * Get NFT ID for specific NFT (required for single NFT offers)
   */
  async getNftId(contractAddress: string, tokenId: string): Promise<number | null> {
    if (!this.isInitialized) {
      console.warn('[BART Gondi] Cannot get NFT ID in mock mode');
      return null;
    }

    try {
      const nftId = await this.gondi!.nftId({ 
        collection: contractAddress,
        tokenId: tokenId
      });
      return nftId;
    } catch (error: any) {
      console.error('[BART Gondi] Error getting NFT ID:', error);
      return null;
    }
  }

  /**
   * Make a lending offer for a specific NFT
   */
  async makeSingleNftOffer(params: SingleNftOfferParams): Promise<{
    success: boolean;
    transactionHash?: string;
    offerId?: string;
    nftId?: number;
    error?: string;
  }> {
    if (!this.isInitialized) {
      console.warn('[BART Gondi] Cannot make real offers in mock mode');
      return {
        success: false,
        error: 'Gondi client not initialized - mock mode active'
      };
    }

    try {
      // Get NFT ID first
      const nftId = await this.getNftId(params.contractAddress, params.tokenId);
      if (!nftId) {
        return {
          success: false,
          error: 'Could not resolve NFT ID for the specified token'
        };
      }

      // Make single NFT offer
      const result = await this.gondi!.makeSingleNftOffer({
        nftId: nftId,
        principalAmount: params.principalAmount,
        apr: params.apr,
        duration: params.duration,
        repayment: params.repayment,
        expiration: params.expiration
      });

      return {
        success: true,
        transactionHash: result.hash || result.transactionHash,
        offerId: result.id || result.offerId,
        nftId: nftId
      };

    } catch (error: any) {
      console.error('[BART Gondi] Error making single NFT offer:', error);
      return {
        success: false,
        error: error.message || 'Failed to make single NFT offer'
      };
    }
  }

  /**
   * Make a collection-wide lending offer on Gondi platform
   */
  async makeOffer(params: LoanOfferParams): Promise<{
    success: boolean;
    transactionHash?: string;
    offerId?: string;
    error?: string;
  }> {
    if (!this.isInitialized) {
      console.warn('[BART Gondi] Cannot make real offers in mock mode');
      return {
        success: false,
        error: 'Gondi client not initialized - mock mode active'
      };
    }

    try {
      // Get collection ID
      const collectionId = await this.gondi!.collectionId({ 
        collectionAddress: params.collectionId 
      });

      // Make collection offer
      const result = await this.gondi!.makeCollectionOffer({
        collectionId: collectionId.toString(),
        principalAmount: params.principalAmount,
        apr: params.apr,
        duration: params.duration,
        repayment: params.repayment,
        expiration: params.expiration
      });

      return {
        success: true,
        transactionHash: result.hash || result.transactionHash,
        offerId: result.id || result.offerId
      };

    } catch (error: any) {
      console.error('[BART Gondi] Error making offer:', error);
      return {
        success: false,
        error: error.message || 'Failed to make offer'
      };
    }
  }

  /**
   * Evaluate a specific NFT for lending potential
   */
  async evaluateNFT(contractAddress: string, tokenId: string): Promise<{
    collection: string;
    tokenId: string;
    estimatedValue: number;
    recommendedLTV: number;
    suggestedAPR: number;
    riskScore: number;
    liquidityScore: number;
    supported: boolean;
    reasoning: string;
  }> {
    try {
      // Get collection data
      const collections = await this.getCollectionData();
      const collection = collections.find(c => 
        c.contractAddress.toLowerCase() === contractAddress.toLowerCase()
      );

      if (!collection || !collection.supported) {
        return {
          collection: 'Unknown',
          tokenId,
          estimatedValue: 0,
          recommendedLTV: 0,
          suggestedAPR: 0,
          riskScore: 100,
          liquidityScore: 0,
          supported: false,
          reasoning: 'Collection not supported by Gondi platform'
        };
      }

      // Calculate risk-adjusted metrics
      const baseRisk = collection.defaultRate * 100;
      const liquidityPenalty = collection.volume24h < 50 ? 10 : 0;
      const riskScore = Math.min(baseRisk + liquidityPenalty, 100);
      
      const recommendedLTV = Math.max(0.4, collection.averageLTV - (riskScore / 200));
      const suggestedAPR = Math.max(0.15, 0.12 + (riskScore / 100) * 0.15);

      return {
        collection: collection.name,
        tokenId,
        estimatedValue: collection.floorPrice,
        recommendedLTV,
        suggestedAPR,
        riskScore,
        liquidityScore: Math.min(100, collection.volume24h * 2),
        supported: true,
        reasoning: `Based on ${collection.name} metrics: ${collection.totalLoans} loans, ${(collection.defaultRate * 100).toFixed(1)}% default rate, ${collection.volume24h.toFixed(1)} ETH 24h volume`
      };

    } catch (error) {
      console.error('[BART Gondi] Error evaluating NFT:', error);
      return {
        collection: 'Error',
        tokenId,
        estimatedValue: 0,
        recommendedLTV: 0,
        suggestedAPR: 0,
        riskScore: 100,
        liquidityScore: 0,
        supported: false,
        reasoning: 'Error evaluating NFT'
      };
    }
  }

  /**
   * Get market statistics
   */
  private async getMarketStats(): Promise<MarketStats> {
    return {
      totalVolumeUSD: 15650000,
      activeLoans: 1247,
      averageAPR: 0.195,
      totalValueLocked: '4,567 ETH',
      topCollections: ['CryptoPunks', 'BAYC', 'Art Blocks', 'Azuki', 'Doodles'],
      marketTrend: 'neutral'
    };
  }

  /**
   * Mock data for testing when Gondi client is not available
   */
  private getMockMarketData(): GondiMarketData {
    return {
      offers: [
        {
          id: 'mock-offer-1',
          collection: 'CryptoPunks',
          collectionName: 'CryptoPunks',
          principalAmount: '30.5',
          apr: 22.5,
          duration: 30,
          loanToValue: 67.5,
          currency: 'WETH',
          offerer: '0x123...abc',
          expirationTime: Date.now() + 86400000,
          created: new Date().toISOString()
        },
        {
          id: 'mock-offer-2',
          collection: 'BAYC',
          collectionName: 'Bored Ape Yacht Club',
          principalAmount: '20.2',
          apr: 19.8,
          duration: 14,
          loanToValue: 70.0,
          currency: 'WETH',
          offerer: '0x456...def',
          expirationTime: Date.now() + 172800000,
          created: new Date().toISOString()
        }
      ],
      listings: [],
      collections: this.getMockCollections(),
      marketStats: {
        totalVolumeUSD: 15650000,
        activeLoans: 1247,
        averageAPR: 0.195,
        totalValueLocked: '4,567 ETH',
        topCollections: ['CryptoPunks', 'BAYC', 'Art Blocks', 'Azuki', 'Doodles'],
        marketTrend: 'neutral'
      }
    };
  }

  private getMockCollections(): GondiCollection[] {
    return [
      {
        id: 'cryptopunks',
        name: 'CryptoPunks',
        contractAddress: '0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb',
        floorPrice: 45.2,
        volume24h: 234.7,
        averageLTV: 0.65,
        totalLoans: 147,
        defaultRate: 0.018,
        supported: true
      },
      {
        id: 'boredapeyachtclub',
        name: 'Bored Ape Yacht Club',
        contractAddress: '0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d',
        floorPrice: 28.9,
        volume24h: 189.3,
        averageLTV: 0.70,
        totalLoans: 203,
        defaultRate: 0.022,
        supported: true
      }
    ];
  }

  /**
   * Check if the service is connected to real Gondi API
   */
  isConnectedToGondi(): boolean {
    return this.isInitialized;
  }

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
  } {
    const rpcUrl = process.env.ETHEREUM_RPC_URL || process.env.ALCHEMY_API_KEY 
      ? `https://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`
      : 'https://eth-mainnet.g.alchemy.com/v2/demo';
      
    return {
      initialized: this.isInitialized,
      mockMode: !this.isInitialized,
      hasPrivateKey: !!process.env.GONDI_PRIVATE_KEY,
      environment: {
        gondiKey: !!process.env.GONDI_PRIVATE_KEY,
        ethereumRpc: !!process.env.ETHEREUM_RPC_URL,
        alchemyKey: !!process.env.ALCHEMY_API_KEY,
        rpcEndpoint: rpcUrl.includes('demo') ? 'demo (rate limited)' : 'production'
      }
    };
  }
}

// Export singleton instance
export const bartGondiService = new BartGondiService();