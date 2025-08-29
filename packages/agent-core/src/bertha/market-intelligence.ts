// BERTHA Market Intelligence System
// Real-time market data integration for informed collection decisions

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
  momentum: number; // 0-1 scale
  category: string;
}

export interface PriceMovement {
  category: string;
  change24h: number;
  change7d: number;
  volume: number;
  direction: 'up' | 'down' | 'stable';
}

export class MarketIntelligence {
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private cacheTimeout = 15 * 60 * 1000; // 15 minutes

  async getMarketOverview(): Promise<MarketData> {
    // Check cache first
    const cached = this.getFromCache('market_overview');
    if (cached) return cached;

    // In production, this would call real APIs
    // For now, we'll simulate realistic market data
    const marketData: MarketData = {
      platform: 'Multi-Platform Aggregate',
      totalVolume24h: 1247.8,
      totalSales24h: 892,
      averagePrice: 1.4,
      topCollections: [
        {
          name: 'Art Blocks Curated',
          floorPrice: 0.8,
          volume24h: 124.5,
          change24h: 5.2,
          totalSupply: 423,
          category: 'Generative'
        },
        {
          name: 'SuperRare 1/1s',
          floorPrice: 2.1,
          volume24h: 89.3,
          change24h: -2.1,
          totalSupply: 1000,
          category: 'Digital Art'
        },
        {
          name: 'Foundation Photography',
          floorPrice: 0.3,
          volume24h: 45.2,
          change24h: 12.8,
          totalSupply: 567,
          category: 'Photography'
        }
      ],
      trendingArtists: [
        {
          name: 'Casey REAS',
          averagePrice: 8.5,
          salesCount24h: 3,
          totalVolume: 25.5,
          momentum: 0.82,
          category: 'Generative'
        },
        {
          name: 'Helena Sarin',
          averagePrice: 2.3,
          salesCount24h: 7,
          totalVolume: 16.1,
          momentum: 0.75,
          category: 'AI Art'
        },
        {
          name: 'Cath Simard',
          averagePrice: 1.8,
          salesCount24h: 12,
          totalVolume: 21.6,
          momentum: 0.69,
          category: 'Photography'
        }
      ],
      priceMovements: [
        { category: 'Generative Art', change24h: 3.2, change7d: 8.7, volume: 234.5, direction: 'up' },
        { category: 'AI Art', change24h: 7.8, change7d: 15.3, volume: 156.2, direction: 'up' },
        { category: 'Photography', change24h: -1.2, change7d: 4.1, volume: 89.7, direction: 'stable' },
        { category: 'PFP Projects', change24h: -8.5, change7d: -12.3, volume: 445.1, direction: 'down' }
      ],
      sentiment: this.calculateMarketSentiment(),
      lastUpdated: new Date().toISOString()
    };

    this.setCache('market_overview', marketData);
    return marketData;
  }

  async getArtistIntelligence(artistName: string): Promise<ArtistData | null> {
    const cacheKey = `artist_${artistName.toLowerCase().replace(/\s+/g, '_')}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    // Simulate artist data lookup
    const artistData: ArtistData = {
      name: artistName,
      averagePrice: Math.random() * 10 + 1,
      salesCount24h: Math.floor(Math.random() * 20),
      totalVolume: Math.random() * 100 + 10,
      momentum: Math.random(),
      category: this.inferArtistCategory(artistName)
    };

    this.setCache(cacheKey, artistData);
    return artistData;
  }

  async getCollectionTrends(category: string): Promise<PriceMovement[]> {
    const cacheKey = `trends_${category}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    // Simulate category trends
    const trends = this.generateTrendsForCategory(category);
    this.setCache(cacheKey, trends);
    return trends;
  }

  async getPlatformComparison(): Promise<{ [platform: string]: MarketData }> {
    // Compare market conditions across platforms
    return {
      'OpenSea': await this.getPlatformData('OpenSea'),
      'SuperRare': await this.getPlatformData('SuperRare'),
      'Foundation': await this.getPlatformData('Foundation'),
      'ArtBlocks': await this.getPlatformData('ArtBlocks')
    };
  }

  private async getPlatformData(platform: string): Promise<MarketData> {
    // Simulate platform-specific data
    const baseVolume = {
      'OpenSea': 800,
      'SuperRare': 150,
      'Foundation': 120,
      'ArtBlocks': 200
    }[platform] || 100;

    return {
      platform,
      totalVolume24h: baseVolume + Math.random() * 100,
      totalSales24h: Math.floor((baseVolume + Math.random() * 100) * 0.8),
      averagePrice: Math.random() * 3 + 0.5,
      topCollections: [],
      trendingArtists: [],
      priceMovements: [],
      sentiment: this.calculateMarketSentiment(),
      lastUpdated: new Date().toISOString()
    };
  }

  private calculateMarketSentiment(): 'bullish' | 'bearish' | 'neutral' {
    const random = Math.random();
    if (random > 0.6) return 'bullish';
    if (random < 0.3) return 'bearish';
    return 'neutral';
  }

  private inferArtistCategory(artistName: string): string {
    const categories = ['Generative', 'AI Art', 'Photography', 'Digital Art', 'Conceptual'];
    return categories[Math.floor(Math.random() * categories.length)];
  }

  private generateTrendsForCategory(category: string): PriceMovement[] {
    return [{
      category,
      change24h: (Math.random() - 0.5) * 20,
      change7d: (Math.random() - 0.5) * 50,
      volume: Math.random() * 500,
      direction: Math.random() > 0.5 ? 'up' : 'down'
    }];
  }

  private getFromCache(key: string): any {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }
    return null;
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  // Enhanced market analysis for BERTHA's decision making
  async getMarketSignalsForArtwork(artwork: {
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
  }> {
    const marketData = await this.getMarketOverview();
    const artistData = await this.getArtistIntelligence(artwork.artist);
    
    let marketScore = 0.5; // Base score
    const trends: string[] = [];
    const risks: string[] = [];
    const opportunities: string[] = [];

    // Platform analysis
    const platformPerformance = marketData.topCollections
      .find(c => c.name.toLowerCase().includes(artwork.platform.toLowerCase()));
    
    if (platformPerformance) {
      if (platformPerformance.change24h > 5) {
        marketScore += 0.15;
        trends.push(`${artwork.platform} volume up ${platformPerformance.change24h.toFixed(1)}%`);
      } else if (platformPerformance.change24h < -5) {
        marketScore -= 0.1;
        risks.push(`${artwork.platform} volume down ${Math.abs(platformPerformance.change24h).toFixed(1)}%`);
      }
    }

    // Artist momentum
    if (artistData && artistData.momentum > 0.7) {
      marketScore += 0.2;
      trends.push(`${artwork.artist} showing strong momentum (${Math.round(artistData.momentum * 100)}%)`);
    }

    // Category trends
    const categoryTrend = marketData.priceMovements
      .find(p => p.category.toLowerCase().includes(artwork.category?.toLowerCase() || ''));
    
    if (categoryTrend) {
      if (categoryTrend.direction === 'up') {
        marketScore += 0.15;
        opportunities.push(`${categoryTrend.category} trending up ${categoryTrend.change24h.toFixed(1)}%`);
      } else if (categoryTrend.direction === 'down') {
        marketScore -= 0.1;
        risks.push(`${categoryTrend.category} declining ${Math.abs(categoryTrend.change24h).toFixed(1)}%`);
      }
    }

    // Price analysis
    const avgPrice = marketData.averagePrice;
    let priceAnalysis = '';
    
    if (artwork.currentPrice < avgPrice * 0.5) {
      priceAnalysis = 'Below market average - potential value opportunity';
      opportunities.push('Priced below market average');
    } else if (artwork.currentPrice > avgPrice * 2) {
      priceAnalysis = 'Premium pricing - requires exceptional quality';
      risks.push('Premium pricing requires high conviction');
    } else {
      priceAnalysis = 'Fair market pricing';
    }

    return {
      marketScore: Math.max(0, Math.min(1, marketScore)),
      priceAnalysis,
      trends,
      risks,
      opportunities
    };
  }
}

// Export singleton instance
export const marketIntelligence = new MarketIntelligence();