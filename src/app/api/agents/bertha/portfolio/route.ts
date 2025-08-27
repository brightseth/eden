import { NextRequest, NextResponse } from 'next/server';
import { berthaEngine } from '@/lib/agents/bertha/collection-engine';

// POST /api/agents/bertha/portfolio - Analyze portfolio and get recommendations
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { holdings, totalValue, cashAvailable } = body;
    
    if (!Array.isArray(holdings)) {
      return NextResponse.json(
        { error: 'Holdings must be an array' },
        { status: 400 }
      );
    }
    
    console.log(`BERTHA analyzing portfolio: ${holdings.length} holdings, ${totalValue} ETH total value`);
    
    // Analyze portfolio health and get recommendations
    const analysis = await berthaEngine.evaluatePortfolio(holdings);
    
    // Calculate portfolio metrics
    const metrics = calculatePortfolioMetrics(holdings, totalValue || 0);
    
    // Get rebalancing recommendations
    const rebalanceRecs = getRebalancingRecommendations(holdings, analysis);
    
    return NextResponse.json({
      portfolio: {
        totalValue: totalValue || 0,
        holdingsCount: holdings.length,
        cashAvailable: cashAvailable || 0,
        diversificationScore: metrics.diversification,
        riskScore: metrics.risk
      },
      analysis: {
        overallHealth: analysis.overallHealth,
        healthGrade: getHealthGrade(analysis.overallHealth),
        keyMetrics: {
          diversification: metrics.diversification,
          riskExposure: metrics.risk,
          liquidityScore: metrics.liquidity,
          culturalBalance: metrics.cultural
        }
      },
      recommendations: {
        immediate: analysis.recommendations.slice(0, 3),
        strategic: rebalanceRecs.strategic,
        opportunities: rebalanceRecs.opportunities
      },
      rebalancing: {
        needed: analysis.rebalanceNeeded,
        priority: analysis.rebalanceNeeded ? 'medium' : 'low',
        actions: rebalanceRecs.actions
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('BERTHA portfolio analysis error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to analyze portfolio',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

function calculatePortfolioMetrics(holdings: any[], totalValue: number) {
  // Simple portfolio metrics calculation
  const categoryCount = new Set(holdings.map(h => h.category || 'unknown')).size;
  const maxCategoryExposure = Math.max(...Object.values(
    holdings.reduce((acc: any, h) => {
      const cat = h.category || 'unknown';
      acc[cat] = (acc[cat] || 0) + (h.value || 0);
      return acc;
    }, {})
  )) / Math.max(totalValue, 1);
  
  return {
    diversification: Math.min(categoryCount / 5, 1), // Max 5 categories for full diversification
    risk: maxCategoryExposure, // Higher concentration = higher risk
    liquidity: holdings.filter(h => h.platform === 'OpenSea').length / Math.max(holdings.length, 1),
    cultural: holdings.filter(h => h.category === 'Cultural' || h.category === 'Generative').length / Math.max(holdings.length, 1)
  };
}

function getHealthGrade(health: number): string {
  if (health >= 0.9) return 'A+';
  if (health >= 0.8) return 'A';
  if (health >= 0.7) return 'B+';
  if (health >= 0.6) return 'B';
  if (health >= 0.5) return 'C+';
  if (health >= 0.4) return 'C';
  return 'D';
}

function getRebalancingRecommendations(holdings: any[], analysis: any) {
  return {
    strategic: [
      'Increase exposure to generative art (currently underweight)',
      'Consider reducing PFP concentration if >30% of portfolio',
      'Add blue-chip NFTs for stability'
    ],
    opportunities: [
      'AI art sector showing strong momentum',
      'Photography NFTs undervalued relative to traditional art',
      'Emerging artists from Asia-Pacific region'
    ],
    actions: analysis.rebalanceNeeded ? [
      'Sell 1-2 overperforming pieces to realize gains',
      'Reinvest proceeds in underweight categories',
      'Set aside 10% cash for opportunity fund'
    ] : [
      'Continue current allocation strategy',
      'Monitor for new opportunities',
      'Quarterly review recommended'
    ]
  };
}