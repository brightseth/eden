import { NextRequest, NextResponse } from 'next/server';
import { citizenMarketData } from '@/lib/agents/citizen-market-data';

// GET /api/agents/citizen/market - Get real-time CryptoCitizens market data
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const city = searchParams.get('city');
    const includeStats = searchParams.get('stats') !== 'false';
    const includeSales = searchParams.get('sales') === 'true';
    const includeAnalysis = searchParams.get('analysis') !== 'false';
    
    console.log('[CITIZEN Market] Market data request:', { 
      city, includeStats, includeSales, includeAnalysis 
    });
    
    // If city specified, get data for that specific collection
    if (city) {
      const cityData = await citizenMarketData.getCityMarketData(city);
      
      if (!cityData) {
        return NextResponse.json(
          { error: `City "${city}" not found in CryptoCitizens collections` },
          { status: 404 }
        );
      }
      
      let recentSales = [];
      if (includeSales) {
        // This would fetch recent sales for the specific city
        // For now, returning structure for development
        recentSales = [{
          tokenId: '1234',
          price: cityData.floorPrice || 0.08,
          priceUsd: (cityData.floorPrice || 0.08) * 2000,
          currency: 'ETH',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          marketplace: 'OpenSea'
        }];
      }
      
      return NextResponse.json({
        success: true,
        city_market_data: {
          collection: cityData,
          recent_sales: recentSales,
          market_context: {
            city_performance: calculateCityPerformance(cityData),
            recommended_actions: generateCityRecommendations(cityData),
            collector_insights: generateCollectorInsights(cityData)
          }
        },
        bright_moments_context: {
          significance: getCitySignificance(city),
          historical_context: getCityHistory(city),
          cultural_importance: getCulturalImportance(city)
        },
        timestamp: new Date().toISOString()
      });
    }
    
    // Get comprehensive market summary
    const marketSummary = await citizenMarketData.getMarketSummary();
    const allCollectionStats = includeStats ? await citizenMarketData.getAllCollectionStats() : [];
    
    // Build comprehensive market response
    const marketResponse: any = {
      success: true,
      market_overview: {
        total_collections: marketSummary.totalCollections,
        total_volume_eth: marketSummary.totalVolume,
        total_sales: marketSummary.totalSales,
        average_floor_price: marketSummary.averageFloorPrice,
        top_performing_city: marketSummary.topPerformingCity,
        market_health: marketSummary.marketHealth,
        price_ranges: marketSummary.priceRanges
      },
      
      bright_moments_insights: {
        journey_performance: analyzeJourneyPerformance(allCollectionStats),
        city_rankings: rankCitiesByPerformance(allCollectionStats),
        volume_analysis: analyzeVolumePatterns(allCollectionStats),
        collector_behavior: analyzeCollectorBehavior(marketSummary),
        market_trends: generateMarketTrends(marketSummary)
      }
    };
    
    // Add detailed collection stats if requested
    if (includeStats) {
      marketResponse.collection_details = allCollectionStats.map(stats => ({
        ...stats,
        bright_moments_context: {
          significance: getCitySignificance(stats.city),
          minting_year: getCityMintingYear(stats.city),
          cultural_importance: getCulturalImportance(stats.city)
        }
      }));
    }
    
    // Add recent sales across all collections if requested
    if (includeSales) {
      marketResponse.recent_activity = {
        sales: marketSummary.recentActivity,
        activity_summary: {
          total_recent_sales: marketSummary.recentActivity.length,
          active_collections: [...new Set(marketSummary.recentActivity.map(s => s.collection))].length,
          average_sale_price: marketSummary.recentActivity.length > 0 
            ? marketSummary.recentActivity.reduce((sum, sale) => sum + sale.price, 0) / marketSummary.recentActivity.length
            : 0,
          most_active_city: getMostActiveCityFromSales(marketSummary.recentActivity)
        }
      };
    }
    
    // Add market analysis if requested
    if (includeAnalysis) {
      marketResponse.market_analysis = {
        investment_insights: generateInvestmentInsights(allCollectionStats),
        full_set_economics: analyzeFullSetEconomics(allCollectionStats),
        ultra_set_valuation: analyzeUltraSetValue(allCollectionStats),
        liquidity_assessment: assessMarketLiquidity(allCollectionStats),
        risk_factors: identifyMarketRisks(marketSummary),
        opportunities: identifyMarketOpportunities(allCollectionStats)
      };
    }
    
    marketResponse.timestamp = new Date().toISOString();
    marketResponse.data_sources = ['OpenSea API', 'On-chain data', 'Bright Moments Registry'];
    marketResponse.next_update = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15 minutes
    
    return NextResponse.json(marketResponse);
    
  } catch (error) {
    console.error('[CITIZEN Market] Error fetching market data:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch CryptoCitizens market data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Helper functions for market analysis

function calculateCityPerformance(cityData: any): string {
  if (!cityData.floorPrice) return 'Insufficient data for performance analysis';
  
  const avgFloor = 0.085; // Rough average across collections
  const performance = cityData.floorPrice / avgFloor;
  
  if (performance > 1.5) return 'Exceptional - significantly above average';
  if (performance > 1.2) return 'Strong - above market average';
  if (performance > 0.8) return 'Stable - near market average';
  return 'Undervalued - below market average';
}

function generateCityRecommendations(cityData: any): string[] {
  const recommendations = [];
  
  if (!cityData.floorPrice) {
    recommendations.push('Monitor for pricing data updates');
    return recommendations;
  }
  
  if (cityData.floorPrice < 0.06) {
    recommendations.push('Potential entry opportunity for collectors');
    recommendations.push('Monitor for accumulation by Full Set seekers');
  }
  
  if ((cityData.volume24h || 0) > (cityData.volume7d || 0) / 7 * 1.5) {
    recommendations.push('Increased activity - monitor for trend continuation');
  }
  
  if (cityData.owners && cityData.totalSupply && cityData.owners / cityData.totalSupply > 0.8) {
    recommendations.push('High distribution - healthy collector base');
  }
  
  recommendations.push('Consider cultural significance in valuation');
  
  return recommendations;
}

function generateCollectorInsights(cityData: any): string[] {
  const insights = [];
  
  insights.push(`Floor price represents entry point for ${cityData.city} citizenship`);
  
  if (cityData.owners && cityData.totalSupply) {
    const distributionRatio = cityData.owners / cityData.totalSupply;
    if (distributionRatio > 0.8) {
      insights.push('Well-distributed collection - lower whale concentration');
    } else if (distributionRatio < 0.5) {
      insights.push('Concentrated ownership - potential liquidity concerns');
    }
  }
  
  insights.push('Part of prestigious Full Set (10 cities) and Ultra Set (40 curated) achievement paths');
  
  return insights;
}

function getCitySignificance(city: string): string {
  const significance: Record<string, string> = {
    'Venice Beach': 'Genesis collection - birthplace of Bright Moments movement',
    'New York': 'Tyler Hobbs Incomplete Control success - major art world validation', 
    'Berlin': 'Kraftwerk techno symphony - unique audio-visual minting experience',
    'Tokyo': 'AI Art Collection debut - first integration of AI artists',
    'Venice Italy': 'Finale collection - completion of 10-city global journey',
    'London': 'European expansion - bridging traditional and digital art scenes',
    'Mexico City': 'Cultural inclusivity - bringing global communities into Web3',
    'Buenos Aires': 'Theatrical performance - minting as 8-hour stage ritual',
    'Paris': 'Artist residency program - expanded creative collaboration',
    'Metaverse': 'Bridge collection - experimental digital-native approach'
  };
  
  return significance[city] || 'Part of global Bright Moments cultural movement';
}

function getCityHistory(city: string): string {
  const history: Record<string, string> = {
    'Venice Beach': '2021 - First IRL minting ceremonies, LCD screens + brick walls, community genesis',
    'New York': '2021-22 - SoHo gallery, Golden Token introduction, Tyler Hobbs collaboration',
    'Berlin': '2022 - Kraftwerk venue, generative techno, Philip Glass Einstein on the Beach',
    'Tokyo': '2023 - Shibuya Sky arcade, Suntory whisky ritual, AI art collection debut',
    'Venice Italy': '2024 - Biennale finale, retrospective across 100+ projects, journey completion'
  };
  
  return history[city] || '2021-2024 - Part of Bright Moments global expansion';
}

function getCulturalImportance(city: string): string {
  const importance: Record<string, string> = {
    'Venice Beach': 'Highest - Genesis energy, cultural birthplace, foundational significance',
    'New York': 'Highest - Art world validation, major market success, cultural legitimacy',  
    'Berlin': 'High - Technical innovation, music integration, European cultural bridge',
    'Venice Italy': 'Highest - Journey completion, retrospective culmination, full-circle symbolism',
    'Tokyo': 'High - AI art pioneering, Eastern cultural integration, technological advancement'
  };
  
  return importance[city] || 'Significant - Essential part of global cultural narrative';
}

function getCityMintingYear(city: string): number {
  const years: Record<string, number> = {
    'Venice Beach': 2021, 'New York': 2021, 'Berlin': 2022, 'London': 2022,
    'Mexico City': 2022, 'Tokyo': 2023, 'Buenos Aires': 2023, 'Paris': 2024, 
    'Venice Italy': 2024, 'Metaverse': 2021
  };
  
  return years[city] || 2022;
}

function analyzeJourneyPerformance(stats: any[]): any {
  if (stats.length === 0) return { status: 'No data available' };
  
  const totalVolume = stats.reduce((sum, s) => sum + (s.volumeTotal || 0), 0);
  const avgFloor = stats.reduce((sum, s) => sum + (s.floorPrice || 0), 0) / stats.length;
  
  return {
    journey_status: 'Complete - Venice to Venice',
    total_ecosystem_volume: totalVolume,
    average_floor_across_cities: avgFloor,
    most_valuable_city: stats.sort((a, b) => (b.floorPrice || 0) - (a.floorPrice || 0))[0]?.city || 'Unknown',
    performance_summary: totalVolume > 10000 ? 'Strong ecosystem performance' : 'Building market presence'
  };
}

function rankCitiesByPerformance(stats: any[]): any[] {
  return stats
    .filter(s => s.floorPrice !== null)
    .sort((a, b) => (b.floorPrice || 0) - (a.floorPrice || 0))
    .slice(0, 5)
    .map((stat, index) => ({
      rank: index + 1,
      city: stat.city,
      collection: stat.name,
      floor_price: stat.floorPrice,
      volume_total: stat.volumeTotal || 0,
      performance_rating: index < 2 ? 'Excellent' : index < 4 ? 'Good' : 'Fair'
    }));
}

function analyzeVolumePatterns(stats: any[]): any {
  const volumeStats = stats.filter(s => s.volumeTotal && s.volumeTotal > 0);
  
  if (volumeStats.length === 0) {
    return { pattern: 'Insufficient volume data' };
  }
  
  const totalVolume = volumeStats.reduce((sum, s) => sum + (s.volumeTotal || 0), 0);
  const avgVolume = totalVolume / volumeStats.length;
  
  return {
    total_ecosystem_volume: totalVolume,
    average_collection_volume: avgVolume,
    high_volume_cities: volumeStats.filter(s => (s.volumeTotal || 0) > avgVolume * 1.2).map(s => s.city),
    volume_concentration: volumeStats.length > 0 ? Math.max(...volumeStats.map(s => s.volumeTotal || 0)) / totalVolume * 100 : 0
  };
}

function analyzeCollectorBehavior(summary: any): any {
  return {
    market_sentiment: summary.marketHealth?.trend || 'stable',
    activity_level: summary.recentActivity?.length > 5 ? 'High' : summary.recentActivity?.length > 2 ? 'Moderate' : 'Low',
    price_sensitivity: summary.priceRanges?.highest?.price / summary.priceRanges?.lowest?.price || 1,
    liquidity_health: summary.marketHealth?.liquidityIndex || 0
  };
}

function generateMarketTrends(summary: any): string[] {
  const trends = [];
  
  if (summary.marketHealth?.trend === 'bullish') {
    trends.push('Increasing volume and price momentum across collections');
  } else if (summary.marketHealth?.trend === 'bearish') {
    trends.push('Market consolidation - potential accumulation opportunity');
  } else {
    trends.push('Stable market conditions - consistent collector interest');
  }
  
  if (summary.marketHealth?.score > 75) {
    trends.push('Strong ecosystem health - active trading across multiple cities');
  }
  
  trends.push('Full Set and Ultra Set completion remains key collector objective');
  trends.push('Cultural significance increasingly recognized in traditional art circles');
  
  return trends;
}

function generateInvestmentInsights(stats: any[]): string[] {
  const insights = [];
  
  if (stats.length === 0) {
    insights.push('Awaiting market data for detailed analysis');
    return insights;
  }
  
  const sortedByFloor = stats.filter(s => s.floorPrice).sort((a, b) => (a.floorPrice || 0) - (b.floorPrice || 0));
  
  if (sortedByFloor.length > 0) {
    insights.push(`Entry opportunities: ${sortedByFloor[0]?.city} at ${sortedByFloor[0]?.floorPrice} ETH`);
    insights.push(`Premium cities: ${sortedByFloor[sortedByFloor.length - 1]?.city} leading at ${sortedByFloor[sortedByFloor.length - 1]?.floorPrice} ETH`);
  }
  
  insights.push('Full Set completion (10 cities) provides maximum cultural and economic value');
  insights.push('Ultra Set (40 curated) represents apex collector achievement');
  
  return insights;
}

function analyzeFullSetEconomics(stats: any[]): any {
  const validStats = stats.filter(s => s.floorPrice);
  
  if (validStats.length === 0) {
    return { 
      estimated_cost: 'Data pending',
      completion_difficulty: 'High - requires dedication across multiple markets' 
    };
  }
  
  const totalCost = validStats.reduce((sum, s) => sum + (s.floorPrice || 0), 0);
  const avgCost = totalCost / validStats.length;
  
  return {
    estimated_floor_cost: totalCost,
    average_per_city: avgCost,
    completion_difficulty: totalCost > 1 ? 'High investment required' : 'Accessible for dedicated collectors',
    cultural_premium: 'Immeasurable - represents complete Bright Moments journey',
    governance_weight: '10 votes in DAO (1 per city)'
  };
}

function analyzeUltraSetValue(stats: any[]): any {
  return {
    definition: '40 carefully curated CryptoCitizens across entire collection ecosystem',
    rarity: 'Extremely limited - estimated single digit holders globally',
    christies_recognition: 'Recognized in Christie\'s Complete Works 2021-2024 catalog',
    cultural_significance: 'Highest collector achievement in Bright Moments ecosystem',
    estimated_holders: 'Under 10 globally',
    governance_weight: '40 votes - maximum DAO influence',
    concierge_status: 'Immediate human ops escalation and leadership access'
  };
}

function assessMarketLiquidity(stats: any[]): any {
  const activeCollections = stats.filter(s => (s.volume24h || 0) > 0);
  
  return {
    active_collections: activeCollections.length,
    total_collections: stats.length,
    liquidity_ratio: stats.length > 0 ? (activeCollections.length / stats.length) * 100 : 0,
    assessment: activeCollections.length > stats.length * 0.6 ? 'Good liquidity' : 'Moderate liquidity',
    recommendation: 'Monitor individual city markets for optimal entry/exit timing'
  };
}

function identifyMarketRisks(summary: any): string[] {
  const risks = [];
  
  if (summary.marketHealth?.score < 50) {
    risks.push('Low market activity - liquidity concerns for some collections');
  }
  
  risks.push('NFT market volatility affects all collections');
  risks.push('Ethereum price fluctuations impact floor prices');
  risks.push('Individual city performance may vary significantly');
  
  return risks;
}

function identifyMarketOpportunities(stats: any[]): string[] {
  const opportunities = [];
  
  opportunities.push('Full Set completion strategy for prestigious collector status');
  opportunities.push('Ultra Set curation for museum-quality cultural achievement');
  opportunities.push('Cultural significance increasing in traditional art world');
  opportunities.push('DAO governance participation through CryptoCitizen ownership');
  
  if (stats.some(s => (s.floorPrice || 0) < 0.05)) {
    opportunities.push('Entry-level pricing available in select cities');
  }
  
  return opportunities;
}

function getMostActiveCityFromSales(sales: any[]): string {
  if (sales.length === 0) return 'No recent activity';
  
  const cityCount: Record<string, number> = {};
  sales.forEach(sale => {
    cityCount[sale.city] = (cityCount[sale.city] || 0) + 1;
  });
  
  return Object.entries(cityCount)
    .sort(([,a], [,b]) => b - a)[0]?.[0] || 'Unknown';
}