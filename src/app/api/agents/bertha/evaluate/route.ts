import { NextRequest, NextResponse } from 'next/server';
import { berthaEngine, type ArtworkEvaluation } from '@/lib/agents/bertha/collection-engine';

// POST /api/agents/bertha/evaluate - Evaluate artwork for collection decision
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const { artwork, signals, metadata } = body;
    if (!artwork || !signals) {
      return NextResponse.json(
        { error: 'Missing required fields: artwork and signals' },
        { status: 400 }
      );
    }
    
    // Construct evaluation object
    const evaluation: ArtworkEvaluation = {
      artwork: {
        id: artwork.id || `eval-${Date.now()}`,
        title: artwork.title || 'Untitled',
        artist: artwork.artist || 'Unknown Artist',
        collection: artwork.collection,
        currentPrice: artwork.currentPrice || 0,
        currency: artwork.currency || 'ETH',
        platform: artwork.platform || 'Unknown'
      },
      signals: {
        technical: signals.technical || 0,
        cultural: signals.cultural || 0,
        market: signals.market || 0,
        aesthetic: signals.aesthetic || 0
      },
      metadata: {
        created: metadata?.created || new Date().toISOString(),
        medium: metadata?.medium || 'Digital',
        edition: metadata?.edition,
        provenance: metadata?.provenance || []
      }
    };
    
    console.log(`BERTHA evaluating: ${evaluation.artwork.title} by ${evaluation.artwork.artist}`);
    
    // Get collection decision
    const decision = await berthaEngine.getConsensusDecision(evaluation);
    
    // Also get individual archetype decisions for transparency
    const archetypeDecisions = await berthaEngine.evaluateArtwork(evaluation);
    
    console.log(`BERTHA decision: ${decision.decision} (${Math.round(decision.confidence * 100)}% confidence)`);
    
    return NextResponse.json({
      evaluation: evaluation.artwork,
      decision: {
        action: decision.decision,
        confidence: decision.confidence,
        reasoning: decision.reasoning,
        riskFactors: decision.riskFactors,
        urgency: decision.urgency,
        priceTarget: decision.priceTarget
      },
      archetypes: archetypeDecisions.map(d => ({
        name: d.archetype,
        decision: d.decision,
        confidence: d.confidence,
        topReason: d.reasoning[0] || 'No specific reason provided'
      })),
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    });
    
  } catch (error) {
    console.error('BERTHA evaluation error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to evaluate artwork',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// GET /api/agents/bertha/evaluate - Get evaluation capabilities and status
export async function GET() {
  try {
    return NextResponse.json({
      agent: 'BERTHA',
      version: '1.0.0',
      status: 'active',
      capabilities: [
        'artwork_evaluation',
        'collection_decisions',
        'risk_assessment',
        'price_targeting',
        'archetype_analysis'
      ],
      supportedPlatforms: [
        'OpenSea',
        'SuperRare',
        'Foundation',
        'ArtBlocks',
        'Nifty Gateway'
      ],
      decisionTypes: ['buy', 'pass', 'watch', 'sell'],
      urgencyLevels: ['immediate', 'within_week', 'monitor', 'no_rush'],
      minimumSignals: {
        technical: 0,
        cultural: 0,
        market: 0,
        aesthetic: 0
      },
      archetypes: [
        'Gagosian - Market-driven with impeccable taste',
        'DigitalArtTrader - Crypto whale with predatory precision',
        'SteveCohen - Hedge fund collector with unlimited budget'
      ],
      usage: {
        example_request: {
          artwork: {
            title: 'Genesis Block #1',
            artist: 'Digital Pioneer',
            currentPrice: 2.5,
            currency: 'ETH',
            platform: 'SuperRare'
          },
          signals: {
            technical: 0.8,
            cultural: 0.6,
            market: 0.7,
            aesthetic: 0.75
          },
          metadata: {
            medium: 'Generative Art',
            created: '2024-08-27',
            provenance: ['Artist wallet', 'Gallery verification']
          }
        }
      }
    });
  } catch (error) {
    console.error('Failed to get BERTHA capabilities:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve capabilities' },
      { status: 500 }
    );
  }
}