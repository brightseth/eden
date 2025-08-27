import { NextRequest, NextResponse } from 'next/server';
import { marketIntelligence } from '@/lib/agents/bertha/market-intelligence';

// GET /api/agents/bertha/market - Get market intelligence overview
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'overview';
    const artist = searchParams.get('artist');
    const category = searchParams.get('category');
    
    switch (type) {
      case 'overview':
        const overview = await marketIntelligence.getMarketOverview();
        return NextResponse.json({
          type: 'market_overview',
          data: overview,
          timestamp: new Date().toISOString()
        });
        
      case 'artist':
        if (!artist) {
          return NextResponse.json(
            { error: 'Artist name required for artist intelligence' },
            { status: 400 }
          );
        }
        
        const artistData = await marketIntelligence.getArtistIntelligence(artist);
        return NextResponse.json({
          type: 'artist_intelligence',
          artist,
          data: artistData,
          timestamp: new Date().toISOString()
        });
        
      case 'trends':
        if (!category) {
          return NextResponse.json(
            { error: 'Category required for trend analysis' },
            { status: 400 }
          );
        }
        
        const trends = await marketIntelligence.getCollectionTrends(category);
        return NextResponse.json({
          type: 'trend_analysis',
          category,
          data: trends,
          timestamp: new Date().toISOString()
        });
        
      case 'platforms':
        const platformData = await marketIntelligence.getPlatformComparison();
        return NextResponse.json({
          type: 'platform_comparison',
          data: platformData,
          timestamp: new Date().toISOString()
        });
        
      default:
        return NextResponse.json(
          { error: `Unknown market intelligence type: ${type}` },
          { status: 400 }
        );
    }
    
  } catch (error) {
    console.error('BERTHA market intelligence error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to get market intelligence',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// POST /api/agents/bertha/market - Get market signals for specific artwork
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { artwork } = body;
    
    if (!artwork || !artwork.artist) {
      return NextResponse.json(
        { error: 'Artwork data with artist required' },
        { status: 400 }
      );
    }
    
    const marketSignals = await marketIntelligence.getMarketSignalsForArtwork({
      artist: artwork.artist,
      category: artwork.category || artwork.medium,
      platform: artwork.platform || 'Unknown',
      currentPrice: artwork.currentPrice || 0
    });
    
    return NextResponse.json({
      artwork: {
        title: artwork.title || 'Unknown',
        artist: artwork.artist,
        platform: artwork.platform
      },
      marketSignals,
      analysis: {
        marketScore: marketSignals.marketScore,
        verdict: marketSignals.marketScore > 0.7 ? 'Strong Market Position' :
                marketSignals.marketScore > 0.5 ? 'Moderate Market Position' : 'Weak Market Position',
        confidence: marketSignals.marketScore > 0.8 ? 'high' : 
                   marketSignals.marketScore > 0.6 ? 'medium' : 'low'
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('BERTHA market signals error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to analyze market signals',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}