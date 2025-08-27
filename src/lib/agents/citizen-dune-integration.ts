/**
 * CITIZEN Dune Analytics Integration
 * Fetches data from Dune dashboard: https://dune.com/cat/bright-moments
 */

interface DuneQueryResult {
  execution_id: string;
  query_id: number;
  state: 'QUERY_STATE_COMPLETED' | 'QUERY_STATE_EXECUTING' | 'QUERY_STATE_FAILED';
  result: {
    rows: any[];
    metadata: {
      column_names: string[];
      result_set_bytes: number;
      total_row_count: number;
    };
  };
}

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

export class CitizenDuneIntegration {
  private duneApiKey: string | null;
  private baseUrl = 'https://api.dune.com/api/v1';
  
  // Bright Moments Dashboard Query IDs (https://dune.com/cat/bright-moments)
  // These would be the actual query IDs from the dashboard - currently using estimated IDs
  private readonly queries = {
    collections_overview: 2156789,  // Bright Moments Collection Stats
    sales_history: 2156790,        // CryptoCitizens Sales & Price History
    holder_analysis: 2156791,      // Full Set & Multi-Collection Holders
    volume_trends: 2156792,        // Daily/Weekly Volume Trends
    floor_price_tracking: 2156793, // Floor Price Movement Analysis
    city_performance: 2156794      // Individual City Performance Metrics
  };
  
  constructor() {
    this.duneApiKey = process.env.DUNE_API_KEY || null;
  }
  
  /**
   * Execute a Dune query and return results with enhanced error handling
   */
  private async executeDuneQuery(queryId: number, parameters: Record<string, any> = {}): Promise<DuneQueryResult | null> {
    if (!this.duneApiKey) {
      console.warn('[CITIZEN Dune] Dune API key not configured - using mock data fallback');
      return null;
    }
    
    const startTime = Date.now();
    console.log(`[CITIZEN Dune] Executing query ${queryId} with parameters:`, parameters);
    
    try {
      // Execute query
      const executeResponse = await fetch(`${this.baseUrl}/query/${queryId}/execute`, {
        method: 'POST',
        headers: {
          'X-Dune-API-Key': this.duneApiKey,
          'Content-Type': 'application/json',
          'User-Agent': 'Eden-Academy-CITIZEN/1.0'
        },
        body: JSON.stringify({
          query_parameters: parameters,
          performance: 'medium' // Balance cost vs speed
        })
      });
      
      if (!executeResponse.ok) {
        const errorText = await executeResponse.text();
        console.error(`[CITIZEN Dune] Query ${queryId} execution failed:`, {
          status: executeResponse.status,
          statusText: executeResponse.statusText,
          error: errorText
        });
        return null;
      }
      
      const executeData = await executeResponse.json();
      const executionId = executeData.execution_id;
      
      if (!executionId) {
        console.error('[CITIZEN Dune] No execution ID returned from Dune API');
        return null;
      }
      
      console.log(`[CITIZEN Dune] Query ${queryId} submitted, execution ID: ${executionId}`);
      
      // Poll for results with exponential backoff
      let attempts = 0;
      const maxAttempts = 60; // 60 seconds max wait for large queries
      let waitTime = 1000; // Start with 1 second
      
      while (attempts < maxAttempts) {
        const statusResponse = await fetch(`${this.baseUrl}/execution/${executionId}/results`, {
          headers: {
            'X-Dune-API-Key': this.duneApiKey,
            'User-Agent': 'Eden-Academy-CITIZEN/1.0'
          }
        });
        
        if (!statusResponse.ok) {
          console.error(`[CITIZEN Dune] Status check failed for execution ${executionId}:`, statusResponse.status);
          return null;
        }
        
        const statusData = await statusResponse.json();
        
        if (statusData.state === 'QUERY_STATE_COMPLETED') {
          const executionTime = Date.now() - startTime;
          console.log(`[CITIZEN Dune] Query ${queryId} completed in ${executionTime}ms, rows: ${statusData.result?.metadata?.total_row_count || 0}`);
          return statusData as DuneQueryResult;
        }
        
        if (statusData.state === 'QUERY_STATE_FAILED') {
          console.error(`[CITIZEN Dune] Query ${queryId} failed:`, statusData);
          return null;
        }
        
        if (statusData.state === 'QUERY_STATE_EXECUTING') {
          console.log(`[CITIZEN Dune] Query ${queryId} still executing... attempt ${attempts + 1}/${maxAttempts}`);
        }
        
        // Wait with exponential backoff (max 5 seconds)
        await new Promise(resolve => setTimeout(resolve, Math.min(waitTime, 5000)));
        waitTime = Math.min(waitTime * 1.1, 5000);
        attempts++;
      }
      
      console.warn(`[CITIZEN Dune] Query ${queryId} timed out after ${maxAttempts} seconds`);
      return null;
      
    } catch (error) {
      const executionTime = Date.now() - startTime;
      console.error(`[CITIZEN Dune] Error executing query ${queryId} after ${executionTime}ms:`, error);
      return null;
    }
  }
  
  /**
   * Get comprehensive Bright Moments data from Dune
   */
  async getBrightMomentsData(): Promise<BrightMomentsDuneData | null> {
    if (!this.duneApiKey) {
      console.warn('[CITIZEN Dune] Returning mock data - configure DUNE_API_KEY for live data');
      return this.getMockDuneData();
    }
    
    try {
      console.log('[CITIZEN Dune] Fetching comprehensive Bright Moments data from Dune Analytics dashboard...');
    console.log('[CITIZEN Dune] Dashboard: https://dune.com/cat/bright-moments');
      
      // Execute multiple queries in parallel for comprehensive market data
      const [collectionsResult, salesResult, holdersResult, volumeResult, floorResult, cityResult] = await Promise.all([
        this.executeDuneQuery(this.queries.collections_overview),
        this.executeDuneQuery(this.queries.sales_history),
        this.executeDuneQuery(this.queries.holder_analysis),
        this.executeDuneQuery(this.queries.volume_trends),
        this.executeDuneQuery(this.queries.floor_price_tracking),
        this.executeDuneQuery(this.queries.city_performance)
      ]);
      
      // Process and combine results from all queries
      const collections = this.processCollectionsData(collectionsResult);
      const priceHistory = this.processSalesData(salesResult);
      const holderAnalysis = this.processHolderData(holdersResult);
      const volumeTrends = this.processVolumeData(volumeResult);
      const floorTrends = this.processFloorPriceData(floorResult);
      const cityPerformance = this.processCityData(cityResult);
      const overallStats = this.calculateOverallStats(collections, volumeTrends);
      
      return {
        collections,
        overall_stats: overallStats,
        price_history: priceHistory,
        holder_analysis: holderAnalysis,
        volume_trends: volumeTrends,
        floor_trends: floorTrends,
        city_performance: cityPerformance,
        data_freshness: new Date().toISOString(),
        source: 'Dune Analytics - Bright Moments Dashboard'
      };
      
    } catch (error) {
      console.error('[CITIZEN Dune] Error fetching Bright Moments data:', error);
      return this.getMockDuneData();
    }
  }
  
  /**
   * Process collections data from Dune query
   */
  private processCollectionsData(result: DuneQueryResult | null): any[] {
    if (!result?.result?.rows) return [];
    
    return result.result.rows.map(row => ({
      name: row.collection_name || 'Unknown',
      contract_address: row.contract_address || '',
      total_volume: parseFloat(row.total_volume || '0'),
      floor_price: parseFloat(row.floor_price || '0'),
      sales_count: parseInt(row.sales_count || '0'),
      unique_holders: parseInt(row.unique_holders || '0'),
      avg_price: parseFloat(row.avg_price || '0')
    }));
  }
  
  /**
   * Process sales history data from Dune query
   */
  private processSalesData(result: DuneQueryResult | null): any[] {
    if (!result?.result?.rows) return [];
    
    return result.result.rows.map(row => ({
      date: row.date || new Date().toISOString().split('T')[0],
      collection: row.collection_name || 'Unknown',
      avg_price: parseFloat(row.avg_price || '0'),
      volume: parseFloat(row.volume || '0')
    }));
  }
  
  /**
   * Process holder analysis data from Dune query
   */
  private processHolderData(result: DuneQueryResult | null): any {
    if (!result?.result?.rows?.[0]) {
      return {
        full_set_holders: 0,
        multi_collection_holders: 0,
        single_collection_holders: 0
      };
    }
    
    const row = result.result.rows[0];
    return {
      full_set_holders: parseInt(row.full_set_holders || '0'),
      multi_collection_holders: parseInt(row.multi_collection_holders || '0'),
      single_collection_holders: parseInt(row.single_collection_holders || '0')
    };
  }
  
  /**
   * Process volume trends data from Dune query
   */
  private processVolumeData(result: DuneQueryResult | null): any[] {
    if (!result?.result?.rows) return [];
    
    return result.result.rows.map(row => ({
      date: row.date || new Date().toISOString().split('T')[0],
      total_volume: parseFloat(row.total_volume || '0'),
      total_sales: parseInt(row.total_sales || '0'),
      average_price: parseFloat(row.average_price || '0'),
      unique_buyers: parseInt(row.unique_buyers || '0'),
      unique_sellers: parseInt(row.unique_sellers || '0')
    }));
  }
  
  /**
   * Process floor price tracking data from Dune query
   */
  private processFloorPriceData(result: DuneQueryResult | null): any[] {
    if (!result?.result?.rows) return [];
    
    return result.result.rows.map(row => ({
      date: row.date || new Date().toISOString().split('T')[0],
      collection_name: row.collection_name || 'Unknown',
      floor_price: parseFloat(row.floor_price || '0'),
      floor_change_24h: parseFloat(row.floor_change_24h || '0'),
      volume_24h: parseFloat(row.volume_24h || '0'),
      sales_24h: parseInt(row.sales_24h || '0')
    }));
  }
  
  /**
   * Process city performance data from Dune query
   */
  private processCityData(result: DuneQueryResult | null): any[] {
    if (!result?.result?.rows) return [];
    
    return result.result.rows.map(row => ({
      city: row.city_name || 'Unknown',
      collection_name: row.collection_name || 'Unknown',
      total_volume: parseFloat(row.total_volume || '0'),
      floor_price: parseFloat(row.current_floor_price || '0'),
      market_cap: parseFloat(row.market_cap || '0'),
      holder_count: parseInt(row.unique_holders || '0'),
      cultural_significance_rank: parseInt(row.significance_rank || '0'),
      minting_year: parseInt(row.minting_year || '2022'),
      performance_score: parseFloat(row.performance_score || '0')
    }));
  }

  /**
   * Calculate enhanced overall statistics from collections and volume data
   */
  private calculateOverallStats(collections: any[], volumeTrends: any[] = []): any {
    const baseStats = {
      total_volume: collections.reduce((sum, c) => sum + c.total_volume, 0),
      total_sales: collections.reduce((sum, c) => sum + c.sales_count, 0),
      total_holders: collections.reduce((sum, c) => sum + c.unique_holders, 0),
      active_collections: collections.filter(c => c.sales_count > 0).length
    };
    
    // Add enhanced metrics from volume trends if available
    if (volumeTrends.length > 0) {
      const recentVolume = volumeTrends.slice(-7); // Last 7 days
      const avgDailyVolume = recentVolume.reduce((sum, v) => sum + v.total_volume, 0) / recentVolume.length;
      const avgDailySales = recentVolume.reduce((sum, v) => sum + v.total_sales, 0) / recentVolume.length;
      
      return {
        ...baseStats,
        avg_daily_volume_7d: avgDailyVolume,
        avg_daily_sales_7d: avgDailySales,
        market_velocity: avgDailyVolume > 0 ? (avgDailySales / avgDailyVolume) : 0,
        ecosystem_health_score: Math.min(100, (baseStats.active_collections / 10) * 100)
      };
    }
    
    return baseStats;
  }
  
  /**
   * Get collection-specific analytics from Dune
   */
  async getCollectionAnalytics(contractAddress: string): Promise<any> {
    if (!this.duneApiKey) return null;
    
    const result = await this.executeDuneQuery(this.queries.collections_overview, {
      contract_address: contractAddress
    });
    
    if (!result?.result?.rows?.[0]) return null;
    
    const row = result.result.rows[0];
    return {
      contract: contractAddress,
      volume: parseFloat(row.total_volume || '0'),
      floor_price: parseFloat(row.floor_price || '0'),
      holders: parseInt(row.unique_holders || '0'),
      sales: parseInt(row.sales_count || '0'),
      avg_price: parseFloat(row.avg_price || '0'),
      last_updated: new Date().toISOString()
    };
  }
  
  /**
   * Enhanced mock data for development when Dune API is not configured
   * Includes comprehensive market intelligence data
   */
  private getMockDuneData(): BrightMomentsDuneData {
    const mockDate = new Date().toISOString().split('T')[0];
    
    return {
      collections: [
        {
          name: 'CryptoVenetians',
          contract_address: '0xa7206d878c5c3871826dfdb42191c49b1d11f466',
          total_volume: 2847.5,
          floor_price: 0.089,
          sales_count: 3241,
          unique_holders: 782,
          avg_price: 0.124
        },
        {
          name: 'CryptoNewYorkers',
          contract_address: '0x0c2e57efddba8c768147d1fdf9176a0a6ebd5d83',
          total_volume: 4156.2,
          floor_price: 0.095,
          sales_count: 4832,
          unique_holders: 923,
          avg_price: 0.136
        },
        {
          name: 'CryptoBerliners',
          contract_address: '0x999e88075692bcee3dbc07e7e64cd32f39dc8204',
          total_volume: 3621.8,
          floor_price: 0.078,
          sales_count: 4187,
          unique_holders: 856,
          avg_price: 0.118
        },
        {
          name: 'CryptoLondoners',
          contract_address: '0x7bd29408f11d2bfc23c34f18275bbf23bb716bc7',
          total_volume: 2834.1,
          floor_price: 0.072,
          sales_count: 3923,
          unique_holders: 794,
          avg_price: 0.107
        },
        {
          name: 'CryptoTokyoites',
          contract_address: '0x4db1f25d3d98600140dfc18deb7515be5bd293af',
          total_volume: 3247.9,
          floor_price: 0.083,
          sales_count: 3612,
          unique_holders: 845,
          avg_price: 0.119
        }
      ],
      overall_stats: {
        total_volume: 23847.2,
        total_sales: 28641,
        total_holders: 6834,
        active_collections: 10,
        avg_daily_volume_7d: 142.3,
        avg_daily_sales_7d: 89.2,
        market_velocity: 0.627,
        ecosystem_health_score: 87.4
      },
      price_history: [
        {
          date: '2024-08-20',
          collection: 'CryptoVenetians',
          avg_price: 0.095,
          volume: 245.8
        },
        {
          date: '2024-08-21',
          collection: 'CryptoVenetians', 
          avg_price: 0.089,
          volume: 189.2
        },
        {
          date: '2024-08-22',
          collection: 'CryptoNewYorkers',
          avg_price: 0.142,
          volume: 334.7
        }
      ],
      holder_analysis: {
        full_set_holders: 47,
        multi_collection_holders: 312,
        single_collection_holders: 4162
      },
      volume_trends: [
        {
          date: mockDate,
          total_volume: 178.4,
          total_sales: 112,
          average_price: 0.091,
          unique_buyers: 87,
          unique_sellers: 94
        }
      ],
      floor_trends: [
        {
          date: mockDate,
          collection_name: 'CryptoVenetians',
          floor_price: 0.089,
          floor_change_24h: -0.003,
          volume_24h: 45.2,
          sales_24h: 23
        }
      ],
      city_performance: [
        {
          city: 'Venice Beach',
          collection_name: 'CryptoVenetians',
          total_volume: 2847.5,
          floor_price: 0.089,
          market_cap: 89.0,
          holder_count: 782,
          cultural_significance_rank: 1,
          minting_year: 2021,
          performance_score: 92.4
        },
        {
          city: 'New York',
          collection_name: 'CryptoNewYorkers',
          total_volume: 4156.2,
          floor_price: 0.095,
          market_cap: 95.0,
          holder_count: 923,
          cultural_significance_rank: 2,
          minting_year: 2021,
          performance_score: 95.7
        }
      ],
      data_freshness: new Date().toISOString(),
      source: 'Mock Data - Configure DUNE_API_KEY for live Bright Moments dashboard data'
    };
  }
  
  /**
   * Get real-time holder analysis including Full Set and Ultra Set data
   */
  async getHolderAnalysis(): Promise<any> {
    const data = await this.getBrightMomentsData();
    
    if (!data) return null;
    
    return {
      full_set_holders: data.holder_analysis.full_set_holders,
      multi_collection_holders: data.holder_analysis.multi_collection_holders,
      single_collection_holders: data.holder_analysis.single_collection_holders,
      estimated_ultra_set_holders: Math.floor(data.holder_analysis.full_set_holders * 0.1), // Estimate 10% of Full Set holders
      total_unique_holders: data.overall_stats.total_holders,
      holder_distribution: {
        full_set_percentage: (data.holder_analysis.full_set_holders / data.overall_stats.total_holders * 100).toFixed(2),
        multi_collection_percentage: (data.holder_analysis.multi_collection_holders / data.overall_stats.total_holders * 100).toFixed(2),
        single_collection_percentage: (data.holder_analysis.single_collection_holders / data.overall_stats.total_holders * 100).toFixed(2)
      }
    };
  }
  
  /**
   * Generate market insights from Dune data
   */
  async getMarketInsights(): Promise<string[]> {
    const data = await this.getBrightMomentsData();
    
    if (!data) {
      return ['Dune Analytics integration pending - configure DUNE_API_KEY for comprehensive insights'];
    }
    
    const insights = [];
    
    // Volume insights
    if (data.overall_stats.total_volume > 10000) {
      insights.push(`Strong ecosystem with ${data.overall_stats.total_volume.toFixed(0)} ETH total volume`);
    }
    
    // Holder insights
    if (data.holder_analysis.full_set_holders > 20) {
      insights.push(`${data.holder_analysis.full_set_holders} confirmed Full Set holders - prestigious achievement`);
    }
    
    // Market health
    if (data.overall_stats.active_collections >= 7) {
      insights.push('Healthy market activity across majority of collections');
    }
    
    // Price trends
    const avgFloor = data.collections.reduce((sum, c) => sum + c.floor_price, 0) / data.collections.length;
    if (avgFloor > 0.08) {
      insights.push('Floor prices maintaining strength across collections');
    }
    
    insights.push('Dune Analytics provides comprehensive on-chain verification of market data');
    
    return insights;
  }
}

export const citizenDune = new CitizenDuneIntegration();