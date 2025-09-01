import { NextRequest, NextResponse } from 'next/server';
import { registryClient } from '@/lib/registry/client';
import { berthaEngine } from '@/lib/agents/bertha/collection-engine';
import type { Creation, Agent } from '@/lib/registry/types';
import { toStr, toNum } from '@/lib/registry/coerce';

// GET /api/agents/bertha/registry-works - Get Registry Works with BERTHA evaluation context
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const agentId = searchParams.get('agentId');
    const status = searchParams.get('status') as 'curated' | 'published' | undefined;
    const limit = parseInt(searchParams.get('limit') || '50');
    const evaluationContext = searchParams.get('context') === 'true';

    // If specific agent requested, get their works
    if (agentId) {
      const works = await registryClient.getAgentCreations(agentId, status);
      
      // Add evaluation context if requested
      if (evaluationContext) {
        const evaluatedWorks = await Promise.all(
          works.slice(0, limit).map(async (work) => {
            const context = await generateWorkEvaluationContext(work);
            return {
              ...work,
              berthaContext: context
            };
          })
        );
        
        return NextResponse.json({
          agent: agentId,
          works: evaluatedWorks,
          total: works.length,
          evaluationContextEnabled: true,
          timestamp: new Date().toISOString()
        });
      }
      
      return NextResponse.json({
        agent: agentId,
        works: works.slice(0, limit),
        total: works.length,
        evaluationContextEnabled: false,
        timestamp: new Date().toISOString()
      });
    }

    // Get all agents and their works for collection intelligence
    const agents = await registryClient.getAgents({ status: 'ACTIVE' });
    const allWorksWithContext = [];

    for (const agent of agents.slice(0, 10)) { // Limit to prevent timeout
      try {
        const works = await registryClient.getAgentCreations(agent.id, status);
        
        for (const work of works.slice(0, 5)) { // Max 5 works per agent
          if (evaluationContext) {
            const context = await generateWorkEvaluationContext(work, agent);
            allWorksWithContext.push({
              ...work,
              agent: {
                id: agent.id,
                handle: agent.handle,
                displayName: agent.displayName
              },
              berthaContext: context
            });
          } else {
            allWorksWithContext.push({
              ...work,
              agent: {
                id: agent.id,
                handle: agent.handle,
                displayName: agent.displayName
              }
            });
          }
        }
      } catch (error) {
        console.warn(`Failed to get works for agent ${agent.handle}:`, error);
      }
    }

    return NextResponse.json({
      works: allWorksWithContext.slice(0, limit),
      total: allWorksWithContext.length,
      agentsScanned: agents.length,
      evaluationContextEnabled: evaluationContext,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('BERTHA Registry Works integration error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch Registry Works',
        details: error instanceof Error ? error.message : 'Unknown error',
        fallbackEnabled: false
      },
      { status: 500 }
    );
  }
}

// POST /api/agents/bertha/registry-works/evaluate - Evaluate specific Registry Work
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { workId, agentId, enhancedContext } = body;

    if (!workId) {
      return NextResponse.json(
        { error: 'workId is required' },
        { status: 400 }
      );
    }

    // Get the specific work from Registry
    let work: Creation;
    if (agentId) {
      const works = await registryClient.getAgentCreations(agentId);
      work = works.find(w => w.id === workId);
      if (!work) {
        return NextResponse.json(
          { error: `Work ${workId} not found for agent ${agentId}` },
          { status: 404 }
        );
      }
    } else {
      // Search across all agents (expensive operation)
      const agents = await registryClient.getAgents({ status: 'ACTIVE' });
      let foundWork = null;
      let sourceAgent = null;

      for (const agent of agents) {
        try {
          const works = await registryClient.getAgentCreations(agent.id);
          const found = works.find(w => w.id === workId);
          if (found) {
            foundWork = found;
            sourceAgent = agent;
            break;
          }
        } catch (error) {
          console.warn(`Failed to search works for agent ${agent.handle}`);
        }
      }

      if (!foundWork) {
        return NextResponse.json(
          { error: `Work ${workId} not found in Registry` },
          { status: 404 }
        );
      }

      work = foundWork;
    }

    // Generate comprehensive evaluation context
    const context = await generateWorkEvaluationContext(work);
    
    // If enhanced context requested, include additional analysis
    if (enhancedContext) {
      const enhancedAnalysis = await generateEnhancedWorkAnalysis(work, context);
      // @ts-expect-error TODO(seth): Union type doesn't include enhancedAnalysis; normalized in v3
      context.enhancedAnalysis = enhancedAnalysis;
    }

    return NextResponse.json({
      work: work,
      berthaContext: context,
      evaluationTimestamp: new Date().toISOString(),
      version: '1.0.0'
    });

  } catch (error) {
    console.error('BERTHA Work evaluation error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to evaluate Registry Work',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Helper function to generate evaluation context for a Registry Work
async function generateWorkEvaluationContext(work: Creation, agent?: Agent) {
  try {
    const context = {
      // Basic Registry metadata
      workId: work.id,
      agentId: work.agentId,
      status: work.status,
      publishingChannels: work.publishedTo ? Object.keys(work.publishedTo) : [],
      
      // Temporal analysis
      createdAt: work.createdAt,
      publishedAt: work.publishedAt,
      ageInDays: work.createdAt ? Math.floor((Date.now() - new Date(work.createdAt).getTime()) / (1000 * 60 * 60 * 24)) : null,
      
      // Content analysis from metadata
      medium: work.metadata.medium || 'Unknown',
      technique: work.metadata.technique || work.metadata.style,
      dimensions: work.metadata.dimensions,
      colorPalette: work.metadata.colors,
      
      // Collection intelligence signals
      signals: {
        technical: calculateTechnicalSignal(work),
        cultural: calculateCulturalSignal(work, agent),
        market: calculateMarketSignal(work),
        aesthetic: calculateAestheticSignal(work)
      },
      
      // Registry-specific insights
      registryInsights: {
        curatedStatus: work.status === 'curated',
        publishedAcrossChannels: work.publishedTo ? Object.keys(work.publishedTo).length > 1 : false,
        hasChainPresence: Boolean(work.publishedTo?.chainTx),
        hasSocialPresence: Boolean(work.publishedTo?.farcasterCastId),
        hasCommercialPresence: Boolean(work.publishedTo?.shopifySku)
      }
    };

    return context;
  } catch (error) {
    console.warn('Failed to generate evaluation context:', error);
    return {
      workId: work.id,
      agentId: work.agentId,
      error: 'Context generation failed',
      fallback: true
    };
  }
}

// Helper function for enhanced work analysis
async function generateEnhancedWorkAnalysis(work: Creation, context: any) {
  try {
    // Construct artwork evaluation for BERTHA's collection engine
    const artworkEvaluation = {
      artwork: {
        id: work.id,
        title: toStr(work.metadata?.title, `Work ${work.id.substring(0, 8)}`),
        artist: toStr(work.metadata?.artist, 'Eden Agent'),
        collection: toStr(work.metadata?.collection, 'Eden Academy'),
        currentPrice: toNum(work.metadata?.price, 0),
        currency: toStr(work.metadata?.currency, 'ETH'),
        platform: 'Eden Registry'
      },
      signals: context.signals,
      metadata: {
        created: work.createdAt || new Date().toISOString(),
        medium: context.medium,
        edition: toNum(work.metadata?.edition, 1),
        provenance: ['Eden Genesis Registry', ...((Array.isArray(work.metadata?.provenance) ? work.metadata.provenance : []) as string[])]
      }
    };

    // Get BERTHA's collection decision
    const decision = await berthaEngine.getConsensusDecision(artworkEvaluation);
    const archetypeDecisions = await berthaEngine.evaluateArtwork(artworkEvaluation);

    return {
      collectionDecision: {
        action: decision.decision,
        confidence: decision.confidence,
        reasoning: decision.reasoning,
        riskFactors: decision.riskFactors,
        priceTarget: decision.priceTarget
      },
      archetypeBreakdown: archetypeDecisions.map(d => ({
        archetype: d.archetype,
        decision: d.decision,
        confidence: d.confidence,
        keyReason: d.reasoning[0]
      })),
      recommendations: generateCollectionRecommendations(decision, context)
    };
  } catch (error) {
    console.warn('Enhanced analysis generation failed:', error);
    return {
      error: 'Enhanced analysis failed',
      fallback: true
    };
  }
}

// Signal calculation helpers
function calculateTechnicalSignal(work: Creation): number {
  let signal = 0.5; // Base signal
  
  // Technical metadata presence
  if (work.metadata.technique) signal += 0.1;
  if (work.metadata.resolution) signal += 0.1;
  if (work.metadata.fileSize) signal += 0.05;
  if (work.metadata.format) signal += 0.05;
  
  // Publishing sophistication
  if (work.publishedTo?.chainTx) signal += 0.2;
  if (work.status === 'curated') signal += 0.1;
  
  return Math.min(signal, 1.0);
}

function calculateCulturalSignal(work: Creation, agent?: Agent): number {
  let signal = 0.5; // Base signal
  
  // Agent context
  if (agent) {
    if (agent.status === 'ACTIVE') signal += 0.1;
    if (agent.cohort === 'genesis') signal += 0.2;
  }
  
  // Cultural metadata
  if (work.metadata.culturalContext) signal += 0.1;
  if (work.metadata.narrative) signal += 0.1;
  if (work.publishedTo?.farcasterCastId) signal += 0.1;
  
  return Math.min(signal, 1.0);
}

function calculateMarketSignal(work: Creation): number {
  let signal = 0.3; // Conservative base for Registry works
  
  // Publishing presence
  if (work.publishedTo?.shopifySku) signal += 0.3;
  if (work.publishedTo?.chainTx) signal += 0.2;
  if (work.status === 'published') signal += 0.2;
  
  return Math.min(signal, 1.0);
}

function calculateAestheticSignal(work: Creation): number {
  let signal = 0.6; // Assume Eden Academy works have good aesthetic quality
  
  // Aesthetic metadata
  if (work.metadata.colors) signal += 0.1;
  if (work.metadata.composition) signal += 0.1;
  if (work.metadata.style) signal += 0.1;
  if (work.status === 'curated') signal += 0.1;
  
  return Math.min(signal, 1.0);
}

// Collection recommendations
function generateCollectionRecommendations(decision: any, context: any) {
  const recommendations = [];
  
  if (decision.decision === 'buy') {
    recommendations.push('Strong collection candidate - aligns with multiple collector archetypes');
    if (context.registryInsights.hasChainPresence) {
      recommendations.push('On-chain provenance adds collection value');
    }
  }
  
  if (decision.decision === 'watch') {
    recommendations.push('Monitor for collection opportunity - emerging potential');
    if (!context.registryInsights.publishedAcrossChannels) {
      recommendations.push('Consider waiting for broader publication validation');
    }
  }
  
  if (context.ageInDays < 7) {
    recommendations.push('Recent creation - may benefit from market maturation');
  }
  
  if (context.registryInsights.curatedStatus) {
    recommendations.push('Academy curation indicates quality assurance');
  }
  
  return recommendations;
}