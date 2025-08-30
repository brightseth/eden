import { NextRequest, NextResponse } from 'next/server';
import { marketAggregator } from '@/lib/agents/market-connectors';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '20');
    const category = searchParams.get('category');

    console.log('[MIYOMI Markets API] Fetching live market data...', { limit, category });

    let markets;
    if (category) {
      markets = await marketAggregator.getMarketsByCategory(category, limit);
    } else {
      markets = await marketAggregator.getAllMarkets(limit);
    }

    console.log(`[MIYOMI Markets API] Retrieved ${markets.length} markets`);

    // Add live data indicator
    const response = {
      success: true,
      markets: markets,
      totalMarkets: markets.length,
      isLiveData: markets.length > 0 && markets.some(m => m.platform !== 'Mock'),
      platforms: [...new Set(markets.map(m => m.platform))],
      timestamp: new Date().toISOString(),
      categories: [...new Set(markets.map(m => m.category))]
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('[MIYOMI Markets API] Error fetching markets:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch market data',
      details: error instanceof Error ? error.message : 'Unknown error',
      isLiveData: false,
      markets: [],
      totalMarkets: 0
    }, { status: 500 });
  }
}