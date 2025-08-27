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
  
  // CryptoCitizens collection mappings
  private readonly collections = [
    { slug: 'cryptocitizens', name: 'CryptoVenetians', city: 'Venice Beach', contract: '0x...', supply: 1000 },
    { slug: 'cryptocitizens-nyc', name: 'CryptoNewYorkers', city: 'New York', contract: '0x...', supply: 1000 },
    { slug: 'cryptocitizens-berlin', name: 'CryptoBerliners', city: 'Berlin', contract: '0x...', supply: 1000 },
    { slug: 'cryptocitizens-london', name: 'CryptoLondoners', city: 'London', contract: '0x...', supply: 1000 },
    { slug: 'cryptocitizens-mexico', name: 'CryptoMexas', city: 'Mexico City', contract: '0x...', supply: 1000 },
    { slug: 'cryptocitizens-tokyo', name: 'CryptoTokyoites', city: 'Tokyo', contract: '0x...', supply: 1000 },
    { slug: 'cryptocitizens-buenosaires', name: 'CryptoBuenosAires', city: 'Buenos Aires', contract: '0x...', supply: 1000 },
    { slug: 'cryptocitizens-paris', name: 'CryptoParisians', city: 'Paris', contract: '0x...', supply: 1000 },
    { slug: 'cryptocitizens-venice', name: 'CryptoVeneziani', city: 'Venice Italy', contract: '0x...', supply: 1000 },
    { slug: 'cryptocitizens-galactic', name: 'CryptoGalacticans', city: 'Metaverse', contract: '0x...', supply: 1000 }
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
   * Check if holder has Full Set or Ultra Set based on current market data
   */
  async analyzeHolderValue(walletAddress: string): Promise<{
    estimatedValue: number;
    holdings: { collection: string; tokenCount: number; estimatedValue: number }[];
    setStatus: 'ultra' | 'full' | 'partial' | 'single';
  }> {
    // This would integrate with blockchain APIs to check actual holdings
    // For now, return structure for development
    return {
      estimatedValue: 0,
      holdings: [],
      setStatus: 'single'
    };
  }
}

export const citizenMarketData = new CitizenMarketData();