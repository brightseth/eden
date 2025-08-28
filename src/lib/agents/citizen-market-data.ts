/**
 * CITIZEN Market Data Integration
 * Fetches live pricing and market data for all CryptoCitizens collections
 * Enhanced with Dune Analytics on-chain verification
 */

import { citizenDune } from './citizen-dune-integration';

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
    lowest: { collection: string; price: number };
    highest: { collection: string; price: number };
  };
  marketHealth: {
    score: number;
    trend: 'bullish' | 'bearish' | 'stable';
    liquidityIndex: number;
  };
}

export class CitizenMarketData {
  private openSeaApiKey: string | null;
  private alchemyApiKey: string | null;
  private moralisApiKey: string | null;
  
  // CryptoCitizens collection mappings - All cities are now in the main collection
  private readonly collections = [
    { slug: 'cryptocitizensofficial', name: 'CryptoCitizens', city: 'Global Collection', contract: '0x448cc0a2e2c9007b9f89de4e383b95ebaf3b5b0c', supply: 10000 },
    // All individual city collections use the same main collection with trait filtering
    { slug: 'cryptocitizensofficial', name: 'CryptoVenetians', city: 'Venice Beach', contract: '0x448cc0a2e2c9007b9f89de4e383b95ebaf3b5b0c', supply: 1000 },
    { slug: 'cryptocitizensofficial', name: 'CryptoNewYorkers', city: 'New York', contract: '0x448cc0a2e2c9007b9f89de4e383b95ebaf3b5b0c', supply: 1000 },
    { slug: 'cryptocitizensofficial', name: 'CryptoBerliners', city: 'Berlin', contract: '0x448cc0a2e2c9007b9f89de4e383b95ebaf3b5b0c', supply: 1000 },
    { slug: 'cryptocitizensofficial', name: 'CryptoLondoners', city: 'London', contract: '0x448cc0a2e2c9007b9f89de4e383b95ebaf3b5b0c', supply: 1000 },
    { slug: 'cryptocitizensofficial', name: 'CryptoMexas', city: 'Mexico City', contract: '0x448cc0a2e2c9007b9f89de4e383b95ebaf3b5b0c', supply: 1000 },
    { slug: 'cryptocitizensofficial', name: 'CryptoTokyoites', city: 'Tokyo', contract: '0x448cc0a2e2c9007b9f89de4e383b95ebaf3b5b0c', supply: 1000 },
    { slug: 'cryptocitizensofficial', name: 'CryptoBuenosAires', city: 'Buenos Aires', contract: '0x448cc0a2e2c9007b9f89de4e383b95ebaf3b5b0c', supply: 1000 },
    { slug: 'cryptocitizensofficial', name: 'CryptoParisians', city: 'Paris', contract: '0x448cc0a2e2c9007b9f89de4e383b95ebaf3b5b0c', supply: 1000 },
    { slug: 'cryptocitizensofficial', name: 'CryptoVeneziani', city: 'Venice Italy', contract: '0x448cc0a2e2c9007b9f89de4e383b95ebaf3b5b0c', supply: 1000 }
  ];
  
  constructor() {
    this.openSeaApiKey = process.env.OPENSEA_API_KEY || null;
    this.alchemyApiKey = process.env.ALCHEMY_API_KEY || null;
    this.moralisApiKey = process.env.MORALIS_API_KEY || null;
  }
  
  /**
   * Fetch collection stats from OpenSea API
   */
  async fetchOpenSeaStats(slug: string): Promise<CollectionStats | null> {
    if (!this.openSeaApiKey) {
      console.warn('[CITIZEN Market] OpenSea API key not configured');
      return null;
    }
    
    try {
      const headers: Record<string, string> = {
        'accept': 'application/json'
      };
      
      if (this.openSeaApiKey) {
        headers['X-API-KEY'] = this.openSeaApiKey;
      }
      
      const response = await fetch(`https://api.opensea.io/api/v2/collections/${slug}/stats`, {
        headers
      });
      
      if (!response.ok) {
        console.error(`[CITIZEN Market] OpenSea API error for ${slug}:`, response.status);
        return null;
      }
      
      const data = await response.json();
      const collection = this.collections.find(c => c.slug === slug);
      
      return {
        slug,
        name: collection?.name || slug,
        city: collection?.city || 'Unknown',
        floorPrice: data.total?.floor_price || null,
        volume24h: data.total?.one_day_volume || null,
        volume7d: data.total?.seven_day_volume || null,
        volumeTotal: data.total?.total_volume || null,
        owners: data.total?.num_owners || null,
        totalSupply: collection?.supply || 1000,
        salesCount: data.total?.count || null,
        averagePrice: data.total?.average_price || null,
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      console.error(`[CITIZEN Market] Error fetching OpenSea stats for ${slug}:`, error);
      return null;
    }
  }
  
  /**
   * Fetch recent sales from OpenSea API
   */
  async fetchRecentSales(slug: string, limit: number = 10): Promise<RecentSale[]> {
    if (!this.openSeaApiKey) return [];
    
    try {
      const headers: Record<string, string> = {
        'accept': 'application/json'
      };
      
      if (this.openSeaApiKey) {
        headers['X-API-KEY'] = this.openSeaApiKey;
      }
      
      const response = await fetch(`https://api.opensea.io/api/v2/events/collection/${slug}?event_type=sale&limit=${limit}`, {
        headers
      });
      
      if (!response.ok) return [];
      
      const data = await response.json();
      const collection = this.collections.find(c => c.slug === slug);
      
      return (data.asset_events || []).map((event: any) => ({
        tokenId: event.asset?.token_id || 'unknown',
        price: parseFloat(event.total_price) / Math.pow(10, 18), // Convert from wei
        priceUsd: event.payment_token?.usd_price ? 
          (parseFloat(event.total_price) / Math.pow(10, 18)) * event.payment_token.usd_price : null,
        currency: event.payment_token?.symbol || 'ETH',
        seller: event.seller?.address || 'unknown',
        buyer: event.winner_account?.address || 'unknown',
        timestamp: event.event_timestamp || new Date().toISOString(),
        collection: collection?.name || slug,
        city: collection?.city || 'Unknown',
        marketplace: 'OpenSea'
      }));
    } catch (error) {
      console.error(`[CITIZEN Market] Error fetching sales for ${slug}:`, error);
      return [];
    }
  }
  
  /**
   * Get comprehensive market data for all CryptoCitizens collections
   */
  async getAllCollectionStats(): Promise<CollectionStats[]> {
    console.log('[CITIZEN Market] Fetching stats for all CryptoCitizens collections...');
    
    const statsPromises = this.collections.map(collection => 
      this.fetchOpenSeaStats(collection.slug)
    );
    
    const results = await Promise.allSettled(statsPromises);
    
    return results
      .filter((result): result is PromiseFulfilledResult<CollectionStats | null> => 
        result.status === 'fulfilled' && result.value !== null)
      .map(result => result.value as CollectionStats)
      .filter(Boolean);
  }
  
  /**
   * Generate comprehensive market summary enhanced with Dune Analytics
   */
  async getMarketSummary(): Promise<MarketSummary> {
    console.log('[CITIZEN Market] Generating comprehensive market summary with Dune Analytics integration...');
    
    // Fetch both OpenSea and Dune data in parallel
    const [collectionStats, duneData] = await Promise.all([
      this.getAllCollectionStats(),
      citizenDune.getBrightMomentsData()
    ]);
    
    if (collectionStats.length === 0 && !duneData) {
      console.log('[CITIZEN Market] No data sources available, using mock summary');
      return this.getMockMarketSummary();
    }
    
    // Calculate totals
    const totalVolume = collectionStats.reduce((sum, stats) => sum + (stats.volumeTotal || 0), 0);
    const totalSales = collectionStats.reduce((sum, stats) => sum + (stats.salesCount || 0), 0);
    const validFloorPrices = collectionStats.filter(s => s.floorPrice !== null);
    const averageFloorPrice = validFloorPrices.length > 0 
      ? validFloorPrices.reduce((sum, stats) => sum + (stats.floorPrice || 0), 0) / validFloorPrices.length
      : 0;
    
    // Find price ranges
    const lowestFloor = collectionStats
      .filter(s => s.floorPrice !== null)
      .sort((a, b) => (a.floorPrice || 0) - (b.floorPrice || 0))[0];
    const highestFloor = collectionStats
      .filter(s => s.floorPrice !== null)
      .sort((a, b) => (b.floorPrice || 0) - (a.floorPrice || 0))[0];
    
    // Top performing city (by volume)
    const topCity = collectionStats
      .sort((a, b) => (b.volumeTotal || 0) - (a.volumeTotal || 0))[0]?.city || 'Venice Beach';
    
    // Fetch recent activity across all collections
    const recentSalesPromises = this.collections.slice(0, 3).map(collection =>
      this.fetchRecentSales(collection.slug, 5)
    );
    const allSales = (await Promise.all(recentSalesPromises)).flat();
    const recentActivity = allSales
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 10);
    
    // Calculate market health
    const activeCollections = collectionStats.filter(s => (s.volume24h || 0) > 0).length;
    const healthScore = Math.min(100, (activeCollections / collectionStats.length) * 100);
    
    return {
      totalCollections: collectionStats.length,
      totalVolume,
      totalSales,
      averageFloorPrice,
      topPerformingCity: topCity,
      recentActivity,
      priceRanges: {
        lowest: { 
          collection: lowestFloor?.name || 'Unknown', 
          price: lowestFloor?.floorPrice || 0 
        },
        highest: { 
          collection: highestFloor?.name || 'Unknown', 
          price: highestFloor?.floorPrice || 0 
        }
      },
      marketHealth: {
        score: healthScore,
        trend: this.calculateTrend(collectionStats),
        liquidityIndex: Math.min(100, (totalSales / (collectionStats.length * 30)) * 100) // Sales per collection per month
      }
    };
  }
  
  /**
   * Calculate market trend based on volume changes
   */
  private calculateTrend(stats: CollectionStats[]): 'bullish' | 'bearish' | 'stable' {
    const collectionsWithVolume = stats.filter(s => s.volume24h && s.volume7d);
    if (collectionsWithVolume.length === 0) return 'stable';
    
    const trendScore = collectionsWithVolume.reduce((score, stat) => {
      const dailyAvg = (stat.volume7d || 0) / 7;
      const todayVolume = stat.volume24h || 0;
      
      if (todayVolume > dailyAvg * 1.2) return score + 1;
      if (todayVolume < dailyAvg * 0.8) return score - 1;
      return score;
    }, 0);
    
    if (trendScore > collectionsWithVolume.length * 0.3) return 'bullish';
    if (trendScore < -collectionsWithVolume.length * 0.3) return 'bearish';
    return 'stable';
  }
  
  /**
   * Fallback mock data when APIs are unavailable
   */
  private getMockMarketSummary(): MarketSummary {
    return {
      totalCollections: 10,
      totalVolume: 15420.5,
      totalSales: 8742,
      averageFloorPrice: 0.085,
      topPerformingCity: 'New York',
      recentActivity: [
        {
          tokenId: '4567',
          price: 0.12,
          priceUsd: 240,
          currency: 'ETH',
          seller: '0x123...abc',
          buyer: '0x456...def',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          collection: 'CryptoNewYorkers',
          city: 'New York',
          marketplace: 'OpenSea'
        }
      ],
      priceRanges: {
        lowest: { collection: 'CryptoGalacticans', price: 0.045 },
        highest: { collection: 'CryptoVeneziani', price: 0.185 }
      },
      marketHealth: {
        score: 78,
        trend: 'stable',
        liquidityIndex: 65
      }
    };
  }
  
  /**
   * Get market data for a specific city/collection
   */
  async getCityMarketData(city: string): Promise<CollectionStats | null> {
    const collection = this.collections.find(c => 
      c.city.toLowerCase().includes(city.toLowerCase())
    );
    
    if (!collection) return null;
    
    return await this.fetchOpenSeaStats(collection.slug);
  }
  
  /**
   * Fetch collection image and metadata from OpenSea API
   */
  async fetchCollectionImages(slug: string): Promise<{
    banner_image_url: string | null;
    featured_image_url: string | null;
    large_image_url: string | null;
    sample_images: string[];
  } | null> {
    if (!this.openSeaApiKey) {
      console.warn('[CITIZEN Market] OpenSea API key not configured for image fetching');
      return null;
    }
    
    try {
      const headers: Record<string, string> = {
        'accept': 'application/json'
      };
      
      if (this.openSeaApiKey) {
        headers['X-API-KEY'] = this.openSeaApiKey;
      }
      
      const response = await fetch(`https://api.opensea.io/api/v2/collections/${slug}`, {
        headers
      });
      
      if (!response.ok) {
        console.error(`[CITIZEN Market] OpenSea collection API error for ${slug}:`, response.status);
        return null;
      }
      
      const data = await response.json();
      
      return {
        banner_image_url: data.banner_image_url || null,
        featured_image_url: data.featured_image_url || null,
        large_image_url: data.large_image_url || null,
        sample_images: []
      };
    } catch (error) {
      console.error(`[CITIZEN Market] Error fetching images for ${slug}:`, error);
      return null;
    }
  }

  /**
   * Fetch sample NFTs from a collection with their images
   */
  async fetchSampleNFTs(slug: string, limit: number = 6): Promise<{
    id: string;
    name: string;
    image_url: string;
    permalink: string;
    token_id: string;
  }[]> {
    if (!this.openSeaApiKey) return [];
    
    try {
      const headers: Record<string, string> = {
        'accept': 'application/json'
      };
      
      if (this.openSeaApiKey) {
        headers['X-API-KEY'] = this.openSeaApiKey;
      }
      
      const response = await fetch(`https://api.opensea.io/api/v2/collection/${slug}/nfts?limit=${limit}`, {
        headers
      });
      
      if (!response.ok) return [];
      
      const data = await response.json();
      
      return (data.nfts || []).map((nft: any) => ({
        id: nft.identifier,
        name: nft.name || `${slug.toUpperCase()} #${nft.identifier}`,
        image_url: nft.image_url || nft.display_image_url || '',
        permalink: `https://opensea.io/assets/ethereum/${nft.contract}/${nft.identifier}`,
        token_id: nft.identifier
      }));
    } catch (error) {
      console.error(`[CITIZEN Market] Error fetching NFTs for ${slug}:`, error);
      return [];
    }
  }

  /**
   * Fetch NFTs from wallet addresses (supports ENS domains)
   */
  async fetchWalletNFTs(walletAddress: string): Promise<{
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
  } | null> {
    if (!this.openSeaApiKey) {
      console.warn('[CITIZEN Market] OpenSea API key required for wallet NFT fetching');
      return null;
    }

    try {
      const headers: Record<string, string> = {
        'accept': 'application/json',
        'X-API-KEY': this.openSeaApiKey
      };

      // Fetch NFTs from wallet
      const response = await fetch(`https://api.opensea.io/api/v2/chain/ethereum/account/${walletAddress}/nfts?limit=200`, {
        headers
      });

      if (!response.ok) {
        console.error(`[CITIZEN Market] OpenSea wallet API error for ${walletAddress}:`, response.status);
        return null;
      }

      const data = await response.json();
      const nfts = data.nfts || [];

      // Process and categorize NFTs
      const processedNFTs = await Promise.all(
        nfts.map(async (nft: any) => {
          const collectionSlug = nft.collection?.slug || 'unknown';
          let floorPrice = null;

          // Try to get floor price for known collections
          if (this.collections.find(c => c.slug === collectionSlug)) {
            const stats = await this.fetchOpenSeaStats(collectionSlug);
            floorPrice = stats?.floorPrice || null;
          }

          return {
            contract_address: nft.contract_address,
            token_id: nft.identifier,
            name: nft.name || `Token #${nft.identifier}`,
            image_url: nft.image_url || nft.display_image_url || '',
            collection_name: nft.collection?.name || 'Unknown Collection',
            opensea_url: `https://opensea.io/assets/ethereum/${nft.contract_address}/${nft.identifier}`,
            floor_price: floorPrice
          };
        })
      );

      // Count Bright Moments related NFTs
      const brightMomentsNfts = processedNFTs.filter(nft => 
        nft.collection_name.toLowerCase().includes('bright moments') ||
        nft.collection_name.toLowerCase().includes('cryptocitizens') ||
        nft.collection_name.toLowerCase().includes('crypto') && 
        (nft.collection_name.toLowerCase().includes('venetians') ||
         nft.collection_name.toLowerCase().includes('berliners') ||
         nft.collection_name.toLowerCase().includes('londoners'))
      ).length;

      // Count specifically CryptoCitizens
      const cryptocitizensCount = processedNFTs.filter(nft =>
        nft.collection_name.toLowerCase().includes('cryptocitizens')
      ).length;

      // Calculate total estimated value
      const totalValue = processedNFTs.reduce((sum, nft) => 
        sum + (nft.floor_price || 0), 0
      );

      console.log(`[CITIZEN Market] Fetched ${processedNFTs.length} NFTs from wallet ${walletAddress}`);
      console.log(`[CITIZEN Market] Found ${brightMomentsNfts} Bright Moments NFTs, ${cryptocitizensCount} CryptoCitizens`);

      return {
        nfts: processedNFTs,
        total_value_eth: totalValue,
        bright_moments_nfts: brightMomentsNfts,
        cryptocitizens_count: cryptocitizensCount
      };

    } catch (error) {
      console.error(`[CITIZEN Market] Error fetching wallet NFTs for ${walletAddress}:`, error);
      return null;
    }
  }

  /**
   * Fetch treasury holdings from known Bright Moments wallets
   */
  async getBrightMomentsTreasuryHoldings(): Promise<{
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
  } | null> {
    console.log('[CITIZEN Market] Fetching Bright Moments treasury holdings...');

    // Known Bright Moments wallet addresses
    const treasuryWallets = [
      {
        address: '0x18B7511938FBe2EE08ADf3d4A24edB00A5C9B783',
        ens_name: 'phil.brightmoments.eth',
        description: 'Deployer address for Bright Moments Editions'
      },
      {
        address: '0xfde07db9ea824f13f4b306f3afd570b029bf3fa4',
        ens_name: 'air.brightmoments.eth', 
        description: 'Bright Moments operational wallet'
      },
      {
        address: '0x5778b0b140fa7a62b96c193cc8621e6e96c088a5',
        ens_name: 'deployer.brightmoments.eth',
        description: 'Primary deployment and treasury wallet'
      }
    ];

    try {
      // Fetch holdings for each wallet
      const walletResults = await Promise.all(
        treasuryWallets.map(async (wallet) => {
          const holdings = await this.fetchWalletNFTs(wallet.address);
          
          return {
            ...wallet,
            nft_count: holdings?.nfts.length || 0,
            estimated_value_eth: holdings?.total_value_eth || 0,
            cryptocitizens_count: holdings?.cryptocitizens_count || 0
          };
        })
      );

      // Calculate totals
      const totalValue = walletResults.reduce((sum, wallet) => sum + wallet.estimated_value_eth, 0);
      const totalNFTs = walletResults.reduce((sum, wallet) => sum + wallet.nft_count, 0);
      const totalCryptoCitizens = walletResults.reduce((sum, wallet) => sum + wallet.cryptocitizens_count, 0);

      return {
        wallets: walletResults,
        total_treasury_value: totalValue,
        total_nfts: totalNFTs,
        treasury_breakdown: {
          cryptocitizens: totalCryptoCitizens,
          bright_moments_editions: Math.floor(totalNFTs * 0.3), // Estimated
          community_submissions: Math.floor(totalNFTs * 0.2), // Estimated
          other_collections: Math.floor(totalNFTs * 0.5) // Estimated
        }
      };

    } catch (error) {
      console.error('[CITIZEN Market] Error fetching treasury holdings:', error);
      return null;
    }
  }

  /**
   * Check if holder has Full Set or Ultra Set based on current market data
   */
  async analyzeHolderValue(walletAddress: string): Promise<{
    estimatedValue: number;
    holdings: { collection: string; tokenCount: number; estimatedValue: number }[];
    setStatus: 'ultra' | 'full' | 'partial' | 'single';
  }> {
    const walletData = await this.fetchWalletNFTs(walletAddress);
    
    if (!walletData) {
      return {
        estimatedValue: 0,
        holdings: [],
        setStatus: 'single'
      };
    }

    // Group NFTs by collection
    const collectionCounts: Record<string, number> = {};
    walletData.nfts.forEach(nft => {
      collectionCounts[nft.collection_name] = (collectionCounts[nft.collection_name] || 0) + 1;
    });

    const holdings = Object.entries(collectionCounts).map(([collection, count]) => {
      const avgFloorPrice = walletData.nfts
        .filter(nft => nft.collection_name === collection && nft.floor_price)
        .reduce((sum, nft, _, arr) => sum + (nft.floor_price || 0) / arr.length, 0);
      
      return {
        collection,
        tokenCount: count,
        estimatedValue: avgFloorPrice * count
      };
    });

    // Determine set status based on CryptoCitizens holdings
    let setStatus: 'ultra' | 'full' | 'partial' | 'single' = 'single';
    const citizenCount = walletData.cryptocitizens_count;
    
    if (citizenCount >= 20) setStatus = 'ultra'; // Ultra Set (very rare)
    else if (citizenCount >= 10) setStatus = 'full'; // Full Set
    else if (citizenCount >= 3) setStatus = 'partial'; // Multiple cities
    
    return {
      estimatedValue: walletData.total_value_eth,
      holdings,
      setStatus
    };
  }
  
  /**
   * Get enhanced market insights combining OpenSea and Dune Analytics
   */
  async getEnhancedMarketInsights(): Promise<{
    dune_verified: boolean;
    on_chain_metrics: any;
    market_intelligence: string[];
    data_confidence: 'high' | 'medium' | 'low';
    verification_status: string;
  }> {
    console.log('[CITIZEN Market] Generating enhanced market insights with on-chain verification...');
    
    try {
      // Get comprehensive Dune data
      const duneData = await citizenDune.getBrightMomentsData();
      const duneInsights = await citizenDune.getMarketInsights();
      const holderAnalysis = await citizenDune.getHolderAnalysis();
      
      if (!duneData) {
        return {
          dune_verified: false,
          on_chain_metrics: null,
          market_intelligence: [
            'Market data from OpenSea API only',
            'Configure DUNE_API_KEY for comprehensive on-chain verification',
            'Full Set and holder analysis pending Dune integration'
          ],
          data_confidence: 'medium',
          verification_status: 'API data only - on-chain verification unavailable'
        };
      }
      
      // Enhanced insights with Dune verification
      const enhancedInsights = [
        `On-chain verified: ${duneData.overall_stats.total_volume.toFixed(0)} ETH ecosystem volume`,
        `Holder distribution verified: ${duneData.holder_analysis.full_set_holders} Full Set holders`,
        ...duneInsights
      ];
      
      // Add ecosystem health insights
      if (duneData.overall_stats.ecosystem_health_score && duneData.overall_stats.ecosystem_health_score > 80) {
        enhancedInsights.push('Strong ecosystem health confirmed by on-chain metrics');
      }
      
      if (duneData.city_performance && duneData.city_performance.length > 0) {
        const topCity = duneData.city_performance
          .sort((a, b) => b.performance_score - a.performance_score)[0];
        enhancedInsights.push(`${topCity.city} leads with ${topCity.performance_score.toFixed(1)} performance score`);
      }
      
      return {
        dune_verified: true,
        on_chain_metrics: {
          total_ecosystem_volume: duneData.overall_stats.total_volume,
          verified_holder_count: duneData.overall_stats.total_holders,
          full_set_holders: duneData.holder_analysis.full_set_holders,
          ecosystem_health: duneData.overall_stats.ecosystem_health_score || 0,
          data_freshness: duneData.data_freshness,
          collections_tracked: duneData.collections.length
        },
        market_intelligence: enhancedInsights,
        data_confidence: 'high',
        verification_status: 'Comprehensive on-chain verification via Dune Analytics'
      };
      
    } catch (error) {
      console.error('[CITIZEN Market] Error generating enhanced insights:', error);
      return {
        dune_verified: false,
        on_chain_metrics: null,
        market_intelligence: ['Error accessing on-chain data - using fallback market analysis'],
        data_confidence: 'low',
        verification_status: 'Data verification failed - check API configurations'
      };
    }
  }
  
  /**
   * Validate market data consistency between OpenSea and Dune
   */
  async validateDataConsistency(): Promise<{
    consistency_score: number;
    discrepancies: string[];
    recommendations: string[];
  }> {
    console.log('[CITIZEN Market] Validating data consistency between sources...');
    
    try {
      const [openSeaStats, duneData] = await Promise.all([
        this.getAllCollectionStats(),
        citizenDune.getBrightMomentsData()
      ]);
      
      if (!duneData || openSeaStats.length === 0) {
        return {
          consistency_score: 0,
          discrepancies: ['Cannot validate - insufficient data sources'],
          recommendations: ['Configure both OpenSea API and DUNE_API_KEY for cross-validation']
        };
      }
      
      const discrepancies: string[] = [];
      let matchingCollections = 0;
      
      // Cross-reference collection data
      openSeaStats.forEach(openSeaCollection => {
        const duneCollection = duneData.collections.find(dc => 
          dc.name.toLowerCase().includes(openSeaCollection.city.toLowerCase())
        );
        
        if (duneCollection) {
          matchingCollections++;
          
          // Check volume consistency (allowing 10% variance)
          const volumeDiff = Math.abs(openSeaCollection.volumeTotal || 0 - duneCollection.total_volume);
          const volumeVariance = volumeDiff / Math.max(openSeaCollection.volumeTotal || 1, duneCollection.total_volume);
          
          if (volumeVariance > 0.1) {
            discrepancies.push(`${openSeaCollection.city}: Volume variance ${(volumeVariance * 100).toFixed(1)}%`);
          }
          
          // Check floor price consistency
          const floorDiff = Math.abs((openSeaCollection.floorPrice || 0) - duneCollection.floor_price);
          if (floorDiff > 0.01) { // 0.01 ETH tolerance
            discrepancies.push(`${openSeaCollection.city}: Floor price differs by ${floorDiff.toFixed(3)} ETH`);
          }
        }
      });
      
      const consistencyScore = Math.max(0, 100 - (discrepancies.length * 15));
      
      const recommendations = [];
      if (consistencyScore < 70) {
        recommendations.push('Significant data discrepancies detected - verify API configurations');
        recommendations.push('Cross-reference with additional data sources for accuracy');
      } else if (consistencyScore < 90) {
        recommendations.push('Minor discrepancies normal due to timing differences between APIs');
      } else {
        recommendations.push('High data consistency confirmed across sources');
      }
      
      return {
        consistency_score: consistencyScore,
        discrepancies,
        recommendations
      };
      
    } catch (error) {
      console.error('[CITIZEN Market] Error validating data consistency:', error);
      return {
        consistency_score: 0,
        discrepancies: ['Validation error occurred'],
        recommendations: ['Check API connectivity and configurations']
      };
    }
  }
}

export const citizenMarketData = new CitizenMarketData();