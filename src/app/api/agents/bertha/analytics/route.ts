import { NextRequest, NextResponse } from 'next/server';
import { performanceAnalytics } from '@/lib/agents/bertha/performance-analytics';
import { socialIntelligence } from '@/lib/agents/bertha/social-intelligence';

// GET /api/agents/bertha/analytics - Get comprehensive analytics dashboard data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'overview';
    const period = searchParams.get('period') || '30d';
    
    switch (type) {
      case 'overview':
        const [
          portfolioMetrics,
          decisionAnalytics,
          marketComparison,
          realtimeMetrics
        ] = await Promise.all([
          performanceAnalytics.getPortfolioMetrics(),
          performanceAnalytics.getDecisionAnalytics(),
          performanceAnalytics.getMarketComparison(),
          performanceAnalytics.getRealtimeMetrics()
        ]);

        return NextResponse.json({
          agent: 'BERTHA',
          analytics: {
            performance: portfolioMetrics,
            decisions: decisionAnalytics,
            market: marketComparison,
            realtime: realtimeMetrics
          },
          generatedAt: new Date().toISOString()
        });

      case 'performance':
        const performance = await performanceAnalytics.getPortfolioMetrics();
        return NextResponse.json({
          agent: 'BERTHA',
          performance,
          period,
          timestamp: new Date().toISOString()
        });

      case 'decisions':
        const decisions = await performanceAnalytics.getDecisionAnalytics();
        return NextResponse.json({
          agent: 'BERTHA',
          decisions,
          period,
          timestamp: new Date().toISOString()
        });

      case 'platforms':
        const platforms = await performanceAnalytics.getPlatformAnalytics();
        return NextResponse.json({
          agent: 'BERTHA',
          platforms,
          timestamp: new Date().toISOString()
        });

      case 'categories':
        const categories = await performanceAnalytics.getCategoryAnalytics();
        return NextResponse.json({
          agent: 'BERTHA',
          categories,
          timestamp: new Date().toISOString()
        });

      case 'trends':
        const trends = await performanceAnalytics.getTrendAnalysis();
        return NextResponse.json({
          agent: 'BERTHA',
          trends,
          timestamp: new Date().toISOString()
        });

      case 'realtime':
        const realtime = await performanceAnalytics.getRealtimeMetrics();
        return NextResponse.json({
          agent: 'BERTHA',
          realtime,
          timestamp: new Date().toISOString()
        });

      case 'social':
        const artist = searchParams.get('artist') || 'sample_artist';
        const artwork = searchParams.get('artwork') || 'sample_artwork';
        
        const [socialSentiment, creatorMomentum] = await Promise.all([
          socialIntelligence.analyzeSocialSentiment(artist, artwork),
          socialIntelligence.analyzeCreatorMomentum(artist)
        ]);

        return NextResponse.json({
          agent: 'BERTHA',
          social: {
            sentiment: socialSentiment,
            momentum: creatorMomentum
          },
          timestamp: new Date().toISOString()
        });

      case 'predictions':
        const symbol = searchParams.get('symbol') || 'NFT-INDEX';
        const [marketTiming, microstructure] = await Promise.all([
          socialIntelligence.generateMarketTimingSignals(symbol),
          socialIntelligence.analyzeMarketMicrostructure(symbol)
        ]);

        return NextResponse.json({
          agent: 'BERTHA',
          predictions: {
            timing: marketTiming,
            microstructure
          },
          timestamp: new Date().toISOString()
        });

      default:
        return NextResponse.json(
          { error: `Unknown analytics type: ${type}` },
          { status: 400 }
        );
    }
    
  } catch (error) {
    console.error('BERTHA analytics error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch analytics data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// POST /api/agents/bertha/analytics - Advanced analytics operations
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, params } = body;
    
    if (!action) {
      return NextResponse.json(
        { error: 'Action required' },
        { status: 400 }
      );
    }
    
    switch (action) {
      case 'predict_outcome':
        const { artwork, confidence } = params;
        if (!artwork || confidence === undefined) {
          return NextResponse.json(
            { error: 'Artwork and confidence required' },
            { status: 400 }
          );
        }
        
        const prediction = await performanceAnalytics.predictDecisionOutcome(artwork, confidence);
        
        return NextResponse.json({
          action: 'predict_outcome',
          artwork,
          confidence,
          prediction,
          timestamp: new Date().toISOString()
        });

      case 'analyze_creator':
        const { artist } = params;
        if (!artist) {
          return NextResponse.json(
            { error: 'Artist required' },
            { status: 400 }
          );
        }
        
        const [creatorAnalysis, momentum] = await Promise.all([
          socialIntelligence.analyzeCreatorCareer(artist),
          socialIntelligence.analyzeCreatorMomentum(artist)
        ]);
        
        return NextResponse.json({
          action: 'analyze_creator',
          artist,
          analysis: creatorAnalysis,
          momentum,
          timestamp: new Date().toISOString()
        });

      case 'generate_predictions':
        const { targetArtwork, socialData, creatorMomentum } = params;
        
        const predictions = await socialIntelligence.generatePredictionEnsemble(
          targetArtwork,
          socialData || [],
          creatorMomentum || {}
        );
        
        return NextResponse.json({
          action: 'generate_predictions',
          predictions,
          consensus: this.calculateConsensus(predictions),
          timestamp: new Date().toISOString()
        });

      case 'market_timing':
        const { symbol } = params;
        const timing = await socialIntelligence.generateMarketTimingSignals(symbol || 'NFT-INDEX');
        
        return NextResponse.json({
          action: 'market_timing',
          symbol: symbol || 'NFT-INDEX',
          timing,
          timestamp: new Date().toISOString()
        });

      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 }
        );
    }
    
  } catch (error) {
    console.error('BERTHA analytics action error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to execute analytics action',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Helper function to calculate prediction consensus
function calculateConsensus(predictions: any[]) {
  if (predictions.length === 0) return null;

  const avgConfidence = predictions.reduce((sum, p) => sum + p.confidence, 0) / predictions.length;
  const directions = predictions.map(p => p.prediction.direction);
  const mostCommonDirection = directions.sort((a, b) =>
    directions.filter(v => v === a).length - directions.filter(v => v === b).length
  ).pop();
  
  const avgMagnitude = predictions
    .filter(p => p.prediction.direction === mostCommonDirection)
    .reduce((sum, p) => sum + p.prediction.magnitude, 0) / 
    predictions.filter(p => p.prediction.direction === mostCommonDirection).length;

  return {
    direction: mostCommonDirection,
    avgConfidence: Math.round(avgConfidence * 100) / 100,
    avgMagnitude: Math.round(avgMagnitude * 100) / 100,
    modelConsensus: predictions.filter(p => p.prediction.direction === mostCommonDirection).length / predictions.length,
    recommendation: avgConfidence > 0.7 && avgMagnitude > 10 ? 'strong_signal' : 
                   avgConfidence > 0.6 ? 'moderate_signal' : 'weak_signal'
  };
}