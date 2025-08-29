import { NextRequest, NextResponse } from 'next/server';
import { registryClient } from '@/lib/registry/client';
import { berthaEngine } from '@/lib/agents/bertha/collection-engine';
import type { Creation, Agent } from '@/lib/registry/types';

export interface CollectionDashboard {
  id: string;
  title: string;
  created: string;
  summary: {
    totalCollections: number;
    totalWorks: number;
    averageQuality: number;
    recommendedActions: number;
  };
  collections: CollectionAnalysis[];
  insights: {
    topOpportunities: CollectionOpportunity[];
    riskAlerts: CollectionRisk[];
    marketTrends: string[];
  };
  actions: {
    highPriority: CollectionAction[];
    mediumPriority: CollectionAction[];
    monitoring: CollectionAction[];
  };
}

export interface CollectionAnalysis {
  id: string;
  name: string;
  type: 'agent-portfolio' | 'thematic-collection' | 'custom-selection';
  agent?: {
    handle: string;
    displayName: string;
    status: string;
  };
  metrics: {
    totalWorks: number;
    qualityScore: number;
    marketPotential: number;
    diversityIndex: number;
    riskLevel: 'low' | 'medium' | 'high';
  };
  topWorks: WorkAnalysis[];
  recommendation: {
    action: 'strong-buy' | 'buy' | 'hold' | 'watch' | 'pass';
    confidence: number;
    reasoning: string[];
    timeline: string;
  };
  lastAnalyzed: string;
}

export interface WorkAnalysis {
  workId: string;
  title: string;
  artist: string;
  qualityScore: number;
  marketSignals: {
    technical: number;
    cultural: number;
    market: number;
    aesthetic: number;
  };
  berthaDecision: {
    action: 'buy' | 'pass' | 'watch' | 'sell';
    confidence: number;
    keyReason: string;
  };
  registryData: {
    status: string;
    verified: boolean;
    publicationChannels: number;
  };
}

export interface CollectionOpportunity {
  id: string;
  type: 'emerging-agent' | 'undervalued-collection' | 'market-trend';
  title: string;
  description: string;
  urgency: 'immediate' | 'this-week' | 'this-month';
  expectedValue: string;
  actionRequired: string;
}

export interface CollectionRisk {
  id: string;
  type: 'concentration' | 'market-volatility' | 'verification' | 'liquidity';
  severity: 'low' | 'medium' | 'high';
  description: string;
  affectedCollections: string[];
  mitigation: string;
}

export interface CollectionAction {
  id: string;
  collection: string;
  action: 'acquire' | 'divest' | 'monitor' | 'research';
  target: string;
  reasoning: string;
  timeline: string;
  estimatedBudget?: string;
}

// GET /api/agents/bertha/collection-dashboard - Generate comprehensive collection dashboard
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeCustom = searchParams.get('includeCustom') === 'true';
    const maxCollections = parseInt(searchParams.get('limit') || '10');

    console.log('BERTHA generating collection dashboard...');

    // Get all active agents and their works for analysis
    const agents = await registryClient.getAgents({ status: 'ACTIVE' });
    const collections: CollectionAnalysis[] = [];

    // Analyze each agent's portfolio as a collection
    for (const agent of agents.slice(0, maxCollections)) {
      try {
        const analysis = await analyzeAgentCollection(agent);
        collections.push(analysis);
      } catch (error) {
        console.warn(`Failed to analyze collection for agent ${agent.handle}:`, error);
      }
    }

    // Generate dashboard insights
    const insights = await generateDashboardInsights(collections);
    const actions = categorizeActions(collections);

    // Create comprehensive dashboard
    const dashboard: CollectionDashboard = {
      id: `dashboard-${Date.now()}`,
      title: 'BERTHA Collection Intelligence Dashboard',
      created: new Date().toISOString(),
      summary: {
        totalCollections: collections.length,
        totalWorks: collections.reduce((sum, c) => sum + c.metrics.totalWorks, 0),
        averageQuality: collections.reduce((sum, c) => sum + c.metrics.qualityScore, 0) / collections.length,
        recommendedActions: actions.highPriority.length + actions.mediumPriority.length
      },
      collections: collections,
      insights: insights,
      actions: actions
    };

    console.log(`BERTHA dashboard complete: ${collections.length} collections analyzed`);

    return NextResponse.json({
      dashboard: dashboard,
      generated: new Date().toISOString(),
      agent: 'BERTHA'
    });

  } catch (error) {
    console.error('BERTHA collection dashboard error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate collection dashboard',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// POST /api/agents/bertha/collection-dashboard/analyze - Analyze specific collection
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { collectionId, workIds, customName } = body;

    if (!collectionId && !workIds) {
      return NextResponse.json(
        { error: 'Either collectionId or workIds must be provided' },
        { status: 400 }
      );
    }

    let analysis: CollectionAnalysis;

    if (collectionId) {
      // Analyze agent collection
      const agent = await registryClient.getAgent(collectionId);
      analysis = await analyzeAgentCollection(agent);
    } else {
      // Analyze custom work selection
      analysis = await analyzeCustomCollection(workIds, customName || 'Custom Selection');
    }

    return NextResponse.json({
      analysis: analysis,
      analyzed: new Date().toISOString(),
      agent: 'BERTHA'
    });

  } catch (error) {
    console.error('BERTHA collection analysis error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to analyze collection',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Helper functions

async function analyzeAgentCollection(agent: Agent): Promise<CollectionAnalysis> {
  try {
    // Get agent's published works
    const works = await registryClient.getAgentCreations(agent.id, 'published');
    const workAnalyses: WorkAnalysis[] = [];

    // Analyze top works (up to 10)
    for (const work of works.slice(0, 10)) {
      const workAnalysis = await analyzeIndividualWork(work);
      workAnalyses.push(workAnalysis);
    }

    // Calculate collection metrics
    const metrics = calculateCollectionMetrics(workAnalyses, works.length);
    
    // Generate collection recommendation
    const recommendation = await generateCollectionRecommendation(workAnalyses, agent);

    return {
      id: agent.id,
      name: `${agent.displayName} Portfolio`,
      type: 'agent-portfolio',
      agent: {
        handle: agent.handle,
        displayName: agent.displayName,
        status: agent.status
      },
      metrics: metrics,
      topWorks: workAnalyses,
      recommendation: recommendation,
      lastAnalyzed: new Date().toISOString()
    };

  } catch (error) {
    console.warn(`Error analyzing agent collection for ${agent.handle}:`, error);
    // Return basic analysis on error
    return {
      id: agent.id,
      name: `${agent.displayName} Portfolio`,
      type: 'agent-portfolio',
      agent: {
        handle: agent.handle,
        displayName: agent.displayName,
        status: agent.status
      },
      metrics: {
        totalWorks: 0,
        qualityScore: 0,
        marketPotential: 0,
        diversityIndex: 0,
        riskLevel: 'medium'
      },
      topWorks: [],
      recommendation: {
        action: 'watch',
        confidence: 0.5,
        reasoning: ['Analysis incomplete - requires manual review'],
        timeline: 'TBD'
      },
      lastAnalyzed: new Date().toISOString()
    };
  }
}

async function analyzeIndividualWork(work: Creation): Promise<WorkAnalysis> {
  try {
    // Calculate quality signals
    const marketSignals = {
      technical: calculateTechnicalSignal(work),
      cultural: calculateCulturalSignal(work),
      market: calculateMarketSignal(work),
      aesthetic: calculateAestheticSignal(work)
    };

    const qualityScore = (marketSignals.technical + marketSignals.cultural + 
                         marketSignals.market + marketSignals.aesthetic) / 4;

    // Get BERTHA's decision using the collection engine
    const evaluation = {
      artwork: {
        id: work.id,
        title: work.metadata.title || 'Untitled',
        artist: work.metadata.artist || 'Eden Agent',
        currentPrice: work.metadata.price || 0,
        currency: 'ETH',
        platform: 'Eden Registry'
      },
      signals: marketSignals,
      metadata: {
        created: work.createdAt || new Date().toISOString(),
        medium: work.metadata.medium || 'Digital',
        provenance: ['Eden Genesis Registry']
      }
    };

    const decision = await berthaEngine.getConsensusDecision(evaluation);

    return {
      workId: work.id,
      title: work.metadata.title || 'Untitled',
      artist: work.metadata.artist || 'Eden Agent',
      qualityScore: qualityScore,
      marketSignals: marketSignals,
      berthaDecision: {
        action: decision.decision,
        confidence: decision.confidence,
        keyReason: decision.reasoning[0] || 'No specific reason'
      },
      registryData: {
        status: work.status,
        verified: true, // Registry works are verified
        publicationChannels: work.publishedTo ? Object.keys(work.publishedTo).length : 0
      }
    };

  } catch (error) {
    console.warn('Work analysis error:', error);
    return {
      workId: work.id,
      title: work.metadata.title || 'Untitled',
      artist: work.metadata.artist || 'Eden Agent',
      qualityScore: 0.5,
      marketSignals: { technical: 0.5, cultural: 0.5, market: 0.3, aesthetic: 0.6 },
      berthaDecision: {
        action: 'watch',
        confidence: 0.5,
        keyReason: 'Analysis incomplete'
      },
      registryData: {
        status: work.status,
        verified: true,
        publicationChannels: 0
      }
    };
  }
}

function calculateCollectionMetrics(works: WorkAnalysis[], totalWorks: number) {
  if (works.length === 0) {
    return {
      totalWorks: totalWorks,
      qualityScore: 0,
      marketPotential: 0,
      diversityIndex: 0,
      riskLevel: 'medium' as const
    };
  }

  const avgQuality = works.reduce((sum, w) => sum + w.qualityScore, 0) / works.length;
  const avgMarketPotential = works.reduce((sum, w) => sum + w.marketSignals.market, 0) / works.length;
  
  // Calculate diversity index based on decision spread
  const decisions = works.map(w => w.berthaDecision.action);
  const uniqueDecisions = [...new Set(decisions)].length;
  const diversityIndex = uniqueDecisions / 4; // 4 possible decisions

  // Risk assessment
  const highRiskCount = works.filter(w => w.berthaDecision.action === 'sell').length;
  const riskLevel = highRiskCount > works.length * 0.3 ? 'high' : 
                   highRiskCount > works.length * 0.1 ? 'medium' : 'low';

  return {
    totalWorks: totalWorks,
    qualityScore: avgQuality,
    marketPotential: avgMarketPotential,
    diversityIndex: diversityIndex,
    riskLevel: riskLevel
  };
}

async function generateCollectionRecommendation(works: WorkAnalysis[], agent: Agent) {
  const buyCount = works.filter(w => w.berthaDecision.action === 'buy').length;
  const watchCount = works.filter(w => w.berthaDecision.action === 'watch').length;
  const avgConfidence = works.reduce((sum, w) => sum + w.berthaDecision.confidence, 0) / works.length;

  let action: 'strong-buy' | 'buy' | 'hold' | 'watch' | 'pass';
  let reasoning: string[];

  if (buyCount > works.length * 0.6) {
    action = 'strong-buy';
    reasoning = [
      `${Math.round(buyCount / works.length * 100)}% of works recommend acquisition`,
      `Agent ${agent.displayName} showing strong collection potential`,
      'High confidence across multiple archetype evaluations'
    ];
  } else if (buyCount > works.length * 0.3) {
    action = 'buy';
    reasoning = [
      'Selective acquisition recommended for top pieces',
      'Strong works mixed with emerging potential',
      'Registry verification provides security'
    ];
  } else if (watchCount > works.length * 0.4) {
    action = 'watch';
    reasoning = [
      'Monitor for collection development',
      'Emerging potential requires time to mature',
      'Consider re-evaluation in 3-6 months'
    ];
  } else {
    action = 'hold';
    reasoning = [
      'Current collection lacks compelling opportunities',
      'Wait for higher quality pieces to emerge',
      'Focus resources on stronger collections'
    ];
  }

  return {
    action,
    confidence: avgConfidence,
    reasoning,
    timeline: action === 'strong-buy' ? 'Immediate' : action === 'buy' ? 'Within 30 days' : 'Monitor'
  };
}

async function generateDashboardInsights(collections: CollectionAnalysis[]) {
  const topOpportunities: CollectionOpportunity[] = collections
    .filter(c => c.recommendation.action === 'strong-buy')
    .slice(0, 3)
    .map((c, index) => ({
      id: `opp-${index}`,
      type: 'emerging-agent' as const,
      title: `${c.agent?.displayName} Portfolio Opportunity`,
      description: c.recommendation.reasoning[0],
      urgency: 'immediate' as const,
      expectedValue: 'High',
      actionRequired: 'Immediate collection review and acquisition planning'
    }));

  const riskAlerts: CollectionRisk[] = collections
    .filter(c => c.metrics.riskLevel === 'high')
    .slice(0, 2)
    .map((c, index) => ({
      id: `risk-${index}`,
      type: 'concentration' as const,
      severity: 'high' as const,
      description: `${c.name} showing elevated risk factors`,
      affectedCollections: [c.name],
      mitigation: 'Diversify collection focus and reduce concentration risk'
    }));

  return {
    topOpportunities,
    riskAlerts,
    marketTrends: [
      'Eden Registry works gaining collector attention',
      'AI agent portfolios showing consistent quality improvement',
      'Cross-platform publication increasing market validation'
    ]
  };
}

function categorizeActions(collections: CollectionAnalysis[]) {
  const highPriority: CollectionAction[] = [];
  const mediumPriority: CollectionAction[] = [];
  const monitoring: CollectionAction[] = [];

  collections.forEach((collection, index) => {
    const action = {
      id: `action-${index}`,
      collection: collection.name,
      action: collection.recommendation.action === 'strong-buy' ? 'acquire' as const :
              collection.recommendation.action === 'buy' ? 'acquire' as const :
              collection.recommendation.action === 'watch' ? 'monitor' as const : 'research' as const,
      target: collection.agent?.displayName || collection.name,
      reasoning: collection.recommendation.reasoning[0],
      timeline: collection.recommendation.timeline
    };

    if (collection.recommendation.action === 'strong-buy') {
      highPriority.push(action);
    } else if (collection.recommendation.action === 'buy') {
      mediumPriority.push(action);
    } else {
      monitoring.push(action);
    }
  });

  return { highPriority, mediumPriority, monitoring };
}

async function analyzeCustomCollection(workIds: string[], name: string): Promise<CollectionAnalysis> {
  // Implementation for custom collection analysis
  // This would need to fetch works by IDs and analyze them
  throw new Error('Custom collection analysis not yet implemented');
}

// Signal calculation helpers (similar to registry-works route)
function calculateTechnicalSignal(work: Creation): number {
  let signal = 0.5;
  if (work.metadata.technique) signal += 0.1;
  if (work.publishedTo?.chainTx) signal += 0.2;
  if (work.status === 'curated') signal += 0.1;
  return Math.min(signal, 1.0);
}

function calculateCulturalSignal(work: Creation): number {
  let signal = 0.5;
  if (work.metadata.culturalContext) signal += 0.1;
  if (work.publishedTo?.farcasterCastId) signal += 0.1;
  if (work.status === 'curated') signal += 0.2;
  return Math.min(signal, 1.0);
}

function calculateMarketSignal(work: Creation): number {
  let signal = 0.3;
  if (work.publishedTo?.shopifySku) signal += 0.3;
  if (work.publishedTo?.chainTx) signal += 0.2;
  if (work.status === 'published') signal += 0.2;
  return Math.min(signal, 1.0);
}

function calculateAestheticSignal(work: Creation): number {
  let signal = 0.6;
  if (work.metadata.colors) signal += 0.1;
  if (work.metadata.style) signal += 0.1;
  if (work.status === 'curated') signal += 0.1;
  return Math.min(signal, 1.0);
}