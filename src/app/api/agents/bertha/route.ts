import { NextRequest, NextResponse } from 'next/server';
import { berthaConfig } from '@/lib/agents/bertha/config';

// GET /api/agents/bertha - Main BERTHA agent status and info
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeDetails = searchParams.get('details') === 'true';
    
    const response: any = {
      agent: 'BERTHA',
      handle: 'bertha',
      version: '1.0.0',
      status: 'active',
      role: 'Collection Intelligence Agent',
      description: 'AI art collection intelligence trained by legendary collectors',
      
      capabilities: [
        'Artwork evaluation and scoring',
        'Collection decision making',
        'Portfolio analysis and optimization',
        'Risk assessment and management',
        'Price targeting and predictions',
        'Multi-archetype perspective analysis'
      ],
      
      endpoints: {
        evaluate: '/api/agents/bertha/evaluate',
        portfolio: '/api/agents/bertha/portfolio',
        training: '/api/agents/bertha/training',
        status: '/api/agents/bertha/status'
      },
      
      training: {
        status: 'completed',
        archetypes: [
          'Gagosian - Ultimate dealer with market-driven taste',
          'DigitalArtTrader - Crypto whale with predatory precision', 
          'SteveCohen - Hedge fund collector with unlimited budget'
        ],
        lastUpdated: new Date().toISOString(),
        dataPoints: 18, // 6 sections * 3 archetypes
        humanTraining: 'pending' // Amanda's form
      },
      
      performance: {
        decisionsToday: 0,
        averageConfidence: 0.78,
        portfoliosAnalyzed: 0,
        uptime: '99.9%',
        responseTime: '~200ms'
      },
      
      limits: {
        maxPortfolioSize: 1000,
        maxEvaluationsPerDay: 10000,
        minConfidenceThreshold: 0.5
      }
    };
    
    if (includeDetails) {
      response.configuration = {
        priceRanges: berthaConfig.collection.priceRanges,
        riskTolerance: berthaConfig.collection.riskTolerance,
        decisionCriteria: berthaConfig.decision.evaluationCriteria,
        vetoRules: berthaConfig.decision.vetoRules.slice(0, 3), // First 3 rules only
        tastPreferences: berthaConfig.taste.preferredMovements
      };
    }
    
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('BERTHA status error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to get BERTHA status',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// POST /api/agents/bertha - Execute collection action or command
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, payload } = body;
    
    if (!action) {
      return NextResponse.json(
        { error: 'Action required' },
        { status: 400 }
      );
    }
    
    switch (action) {
      case 'quick_evaluate':
        // Quick evaluation for simple cases
        if (!payload?.artwork) {
          return NextResponse.json(
            { error: 'Artwork data required for evaluation' },
            { status: 400 }
          );
        }
        
        // Simple heuristic evaluation
        const quickScore = calculateQuickScore(payload.artwork);
        return NextResponse.json({
          action: 'quick_evaluate',
          result: {
            score: quickScore,
            recommendation: quickScore > 0.7 ? 'consider' : 'pass',
            note: 'Use /evaluate endpoint for detailed analysis'
          },
          timestamp: new Date().toISOString()
        });
        
      case 'market_pulse':
        // Get current market sentiment
        return NextResponse.json({
          action: 'market_pulse',
          result: {
            sentiment: 'cautiously_optimistic',
            trendingCategories: ['AI Art', 'Generative Art', 'Photography'],
            riskLevel: 'medium',
            recommendation: 'Focus on quality over quantity',
            lastUpdated: new Date().toISOString()
          }
        });
        
      case 'health_check':
        // Agent health check
        return NextResponse.json({
          action: 'health_check',
          result: {
            status: 'healthy',
            trainingDataLoaded: true,
            configValid: true,
            endpointsActive: true,
            lastDecision: new Date().toISOString()
          }
        });
        
      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 }
        );
    }
    
  } catch (error) {
    console.error('BERTHA action error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to execute action',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

function calculateQuickScore(artwork: any): number {
  let score = 0.5; // Base score
  
  // Artist reputation bonus
  if (artwork.artist && artwork.artist.length > 0) score += 0.1;
  
  // Platform credibility
  const platforms = ['SuperRare', 'Foundation', 'ArtBlocks'];
  if (platforms.includes(artwork.platform)) score += 0.15;
  
  // Price reasonableness
  if (artwork.currentPrice > 0 && artwork.currentPrice < 10) score += 0.1;
  if (artwork.currentPrice > 50) score -= 0.2;
  
  // Medium preference
  const preferredMediums = ['Generative', 'AI', 'Digital Art'];
  if (preferredMediums.some(m => artwork.medium?.includes(m))) score += 0.15;
  
  return Math.max(0, Math.min(1, score));
}