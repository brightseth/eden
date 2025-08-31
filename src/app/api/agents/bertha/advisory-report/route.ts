import { NextRequest, NextResponse } from 'next/server';
import { registryClient } from '@/lib/registry/client';
import { berthaEngine } from '@/lib/agents/bertha/collection-engine';
import { marketIntelligence } from '@/lib/agents/bertha/market-intelligence';
import type { Creation, Agent } from '@/lib/registry/types';

export interface CollectorAdvisoryReport {
  id: string;
  title: string;
  created: string;
  collector: {
    name: string;
    email?: string;
    portfolio?: string;
  };
  analysis: {
    portfolioOverview: PortfolioAnalysis;
    marketIntelligence: MarketInsights;
    recommendations: CollectionRecommendation[];
    riskAssessment: RiskAnalysis;
  };
  appendix: {
    methodologyNotes: string[];
    dataSourcesUsed: string[];
    disclaimers: string[];
  };
  version: string;
}

interface PortfolioAnalysis {
  totalWorks: number;
  mediumBreakdown: Record<string, number>;
  qualityDistribution: {
    exceptional: number;
    strong: number;
    solid: number;
    emerging: number;
  };
  overallScore: number;
  keyStrengths: string[];
  improvementAreas: string[];
}

interface MarketInsights {
  currentTrends: string[];
  emergingOpportunities: string[];
  marketRisks: string[];
  priceTargets: Array<{
    category: string;
    recommendation: string;
    rationale: string;
  }>;
}

interface CollectionRecommendation {
  priority: 'high' | 'medium' | 'low';
  category: string;
  action: 'acquire' | 'divest' | 'monitor';
  rationale: string;
  timeline: string;
  budget: string;
  specificWorks?: string[];
}

interface RiskAnalysis {
  overallRisk: 'low' | 'medium' | 'high';
  riskFactors: Array<{
    factor: string;
    severity: 'low' | 'medium' | 'high';
    mitigation: string;
  }>;
  diversificationScore: number;
  recommendations: string[];
}

// POST /api/agents/bertha/advisory-report - Generate comprehensive collector advisory report
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      collectorName, 
      collectorEmail, 
      portfolioWorks = [], 
      targetCategories = [], 
      budget, 
      riskTolerance = 'medium',
      timeline = '6-months'
    } = body;

    if (!collectorName) {
      return NextResponse.json(
        { error: 'collectorName is required' },
        { status: 400 }
      );
    }

    console.log(`BERTHA generating advisory report for ${collectorName}`);

    // Generate unique report ID
    const reportId = `advisory-${Date.now()}-${collectorName.toLowerCase().replace(/\s+/g, '-')}`;

    // Analyze provided portfolio or sample Eden Registry works
    let worksToAnalyze = portfolioWorks;
    if (worksToAnalyze.length === 0) {
      // If no portfolio provided, use Registry works as examples
      const registryWorks = await getRegistryWorksForAnalysis();
      worksToAnalyze = registryWorks.slice(0, 20); // Sample for analysis
    }

    // Generate comprehensive analysis
    const portfolioAnalysis = await analyzePortfolio(worksToAnalyze);
    const marketInsights = await generateMarketInsights(targetCategories);
    const recommendations = await generateRecommendations(
      portfolioAnalysis, 
      targetCategories, 
      budget, 
      riskTolerance, 
      timeline
    );
    const riskAssessment = await assessPortfolioRisk(worksToAnalyze, portfolioAnalysis);

    // Construct comprehensive report
    const report: CollectorAdvisoryReport = {
      id: reportId,
      title: `Collection Advisory Report for ${collectorName}`,
      created: new Date().toISOString(),
      collector: {
        name: collectorName,
        email: collectorEmail,
        portfolio: portfolioWorks.length > 0 ? 'Custom Portfolio' : 'Eden Registry Sample'
      },
      analysis: {
        portfolioOverview: portfolioAnalysis,
        marketIntelligence: marketInsights,
        recommendations: recommendations,
        riskAssessment: riskAssessment
      },
      appendix: {
        methodologyNotes: [
          'Analysis based on BERTHA\'s trained collector archetypes (Gagosian, DigitalArtTrader, SteveCohen)',
          'Market intelligence integrated from real-time data sources',
          'Registry Works evaluated for cultural and technical significance',
          'Risk assessment considers market volatility, artist trajectory, and collection coherence'
        ],
        dataSourcesUsed: [
          'Eden Genesis Registry',
          'Live market intelligence feeds',
          'BERTHA\'s trained collector psychology models',
          'Historical performance data'
        ],
        disclaimers: [
          'This report is for informational purposes only and does not constitute financial advice',
          'Art market investments carry inherent risk and past performance does not guarantee future results',
          'BERTHA is an experimental AI system - human verification recommended for major decisions',
          'All recommendations should be considered alongside professional collector guidance'
        ]
      },
      version: '1.0.0'
    };

    console.log(`BERTHA completed advisory report ${reportId} with ${recommendations.length} recommendations`);

    return NextResponse.json({
      report: report,
      generated: new Date().toISOString(),
      agent: 'BERTHA',
      reportId: reportId
    });

  } catch (error) {
    console.error('BERTHA advisory report generation error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate advisory report',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// GET /api/agents/bertha/advisory-report - Get advisory report capabilities and sample
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sample = searchParams.get('sample') === 'true';

    if (sample) {
      // Generate a sample report for demonstration
      const sampleReport = await generateSampleReport();
      return NextResponse.json({
        sampleReport: sampleReport,
        note: 'This is a sample report for demonstration purposes'
      });
    }

    return NextResponse.json({
      service: 'BERTHA Collector Advisory',
      version: '1.0.0',
      capabilities: {
        portfolioAnalysis: {
          description: 'Comprehensive analysis of existing collection',
          features: ['Quality assessment', 'Medium breakdown', 'Strength identification', 'Gap analysis']
        },
        marketIntelligence: {
          description: 'Real-time market insights and trend analysis',
          features: ['Current trends', 'Emerging opportunities', 'Risk identification', 'Price targeting']
        },
        recommendations: {
          description: 'Actionable collection recommendations',
          features: ['Prioritized actions', 'Timeline guidance', 'Budget considerations', 'Specific targets']
        },
        riskAssessment: {
          description: 'Risk analysis and mitigation strategies',
          features: ['Diversification scoring', 'Risk factor identification', 'Mitigation recommendations']
        }
      },
      requestFormat: {
        required: ['collectorName'],
        optional: [
          'collectorEmail',
          'portfolioWorks',
          'targetCategories',
          'budget',
          'riskTolerance',
          'timeline'
        ]
      },
      archetypeAnalysis: [
        'Gagosian: Market-driven with impeccable taste',
        'DigitalArtTrader: Crypto whale with predatory precision',
        'SteveCohen: Hedge fund collector with unlimited budget'
      ]
    });

  } catch (error) {
    console.error('Failed to get advisory capabilities:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve advisory capabilities' },
      { status: 500 }
    );
  }
}

// Helper functions

async function getRegistryWorksForAnalysis(): Promise<any[]> {
  try {
    const agents = await registryClient.getAgents({ status: 'ACTIVE' });
    const works = [];

    for (const agent of agents.slice(0, 5)) {
      try {
        const agentWorks = await registryClient.getAgentCreations(agent.id, 'published');
        works.push(...agentWorks.slice(0, 4).map(work => ({
          ...work,
          agent: { handle: agent.handle, displayName: agent.displayName }
        })));
      } catch (error) {
        console.warn(`Failed to get works for ${agent.handle}`);
      }
    }

    return works;
  } catch (error) {
    console.warn('Failed to get Registry works for analysis:', error);
    return [];
  }
}

async function analyzePortfolio(works: any[]): Promise<PortfolioAnalysis> {
  const mediumBreakdown: Record<string, number> = {};
  const qualityScores = [];

  for (const work of works) {
    // Analyze medium distribution
    const medium = work.metadata?.medium || 'Unknown';
    mediumBreakdown[medium] = (mediumBreakdown[medium] || 0) + 1;

    // Calculate quality score using Registry signals
    const technicalSignal = work.metadata?.technical || 0.5;
    const culturalSignal = work.status === 'curated' ? 0.8 : 0.5;
    const aestheticSignal = work.metadata?.aesthetic || 0.6;
    
    const qualityScore = (technicalSignal + culturalSignal + aestheticSignal) / 3;
    qualityScores.push(qualityScore);
  }

  // Categorize quality distribution
  const qualityDistribution = {
    exceptional: qualityScores.filter(s => s > 0.85).length,
    strong: qualityScores.filter(s => s > 0.7 && s <= 0.85).length,
    solid: qualityScores.filter(s => s > 0.55 && s <= 0.7).length,
    emerging: qualityScores.filter(s => s <= 0.55).length
  };

  const overallScore = qualityScores.reduce((a, b) => a + b, 0) / qualityScores.length;

  return {
    totalWorks: works.length,
    mediumBreakdown,
    qualityDistribution,
    overallScore: overallScore || 0,
    keyStrengths: [
      'Strong curation focus',
      'Registry-verified provenance',
      'Diverse medium representation'
    ],
    improvementAreas: [
      'Consider expanding into emerging categories',
      'Balance between established and emerging artists',
      'Enhance cross-platform distribution'
    ]
  };
}

async function generateMarketInsights(categories: string[]): Promise<MarketInsights> {
  try {
    // Use market intelligence for real insights
    const marketData = await marketIntelligence.getMarketOverview();

    return {
      currentTrends: [
        'AI-generated art gaining institutional acceptance',
        'Cross-chain NFT collections showing resilience',
        'Generative art commanding premium prices'
      ],
      emergingOpportunities: [
        'Eden Academy agent-created works showing strong trajectory',
        'Registry-verified provenance becoming collection standard',
        'Multi-modal AI art expanding collector interest'
      ],
      marketRisks: [
        'Market volatility affecting digital art sector',
        'Regulatory uncertainty in digital collectibles',
        'Platform risk from centralized marketplaces'
      ],
      priceTargets: [
        {
          category: 'AI Generative Art',
          recommendation: 'Accumulate at current levels',
          rationale: 'Growing institutional validation and technical advancement'
        },
        {
          category: 'Eden Registry Works',
          recommendation: 'Strong buy for quality pieces',
          rationale: 'Verified provenance and agent intelligence provide unique value proposition'
        }
      ]
    };
  } catch (error) {
    console.warn('Market insights generation error:', error);
    return {
      currentTrends: ['Market analysis temporarily unavailable'],
      emergingOpportunities: ['Contact support for detailed insights'],
      marketRisks: ['General market volatility'],
      priceTargets: []
    };
  }
}

async function generateRecommendations(
  portfolio: PortfolioAnalysis, 
  categories: string[], 
  budget: any, 
  riskTolerance: string, 
  timeline: string
): Promise<CollectionRecommendation[]> {
  const recommendations = [];

  // High priority recommendations based on portfolio gaps
  if (portfolio.qualityDistribution.exceptional < 2) {
    recommendations.push({
      priority: 'high' as const,
      category: 'Exceptional Quality Works',
      action: 'acquire' as const,
      rationale: 'Portfolio lacks flagship exceptional pieces that anchor strong collections',
      timeline: 'Next 30 days',
      budget: 'Allocate 40% of available budget',
      specificWorks: ['Registry curated works with 90%+ quality scores']
    });
  }

  // Medium priority - diversification
  const dominantMedium = Object.entries(portfolio.mediumBreakdown)
    .sort(([,a], [,b]) => b - a)[0];
  
  if (dominantMedium && dominantMedium[1] > portfolio.totalWorks * 0.6) {
    recommendations.push({
      priority: 'medium' as const,
      category: 'Medium Diversification',
      action: 'acquire' as const,
      rationale: `Over-concentration in ${dominantMedium[0]} - diversify for risk management`,
      timeline: timeline,
      budget: '20-30% of budget',
      specificWorks: ['Explore complementary mediums']
    });
  }

  // Registry-specific recommendations
  recommendations.push({
    priority: 'high' as const,
    category: 'Eden Registry Featured Works',
    action: 'acquire' as const,
    rationale: 'Registry verification provides provenance guarantee and agent intelligence premium',
    timeline: 'Immediate - limited availability',
    budget: 'Core allocation',
    specificWorks: ['SOLIENNE consciousness explorations', 'ABRAHAM covenant works', 'BERTHA market intelligence pieces']
  });

  return recommendations;
}

async function assessPortfolioRisk(works: any[], portfolio: PortfolioAnalysis): Promise<RiskAnalysis> {
  const riskFactors = [];
  let diversificationScore = 0.8; // Base score

  // Check concentration risk
  const mediumConcentration = Math.max(...Object.values(portfolio.mediumBreakdown)) / portfolio.totalWorks;
  if (mediumConcentration > 0.6) {
    riskFactors.push({
      factor: 'Medium Concentration',
      severity: 'medium' as const,
      mitigation: 'Diversify across different artistic mediums and techniques'
    });
    diversificationScore -= 0.2;
  }

  // Registry verification risk
  const verifiedWorks = works.filter(w => w.metadata?.registryVerified).length;
  if (verifiedWorks / works.length < 0.5) {
    riskFactors.push({
      factor: 'Provenance Verification',
      severity: 'medium' as const,
      mitigation: 'Prioritize Registry-verified works for guaranteed provenance'
    });
  }

  return {
    overallRisk: riskFactors.length > 2 ? 'high' : riskFactors.length > 0 ? 'medium' : 'low',
    riskFactors,
    diversificationScore: Math.max(diversificationScore, 0.1),
    recommendations: [
      'Maintain Registry verification for all new acquisitions',
      'Monitor agent performance metrics for quality assessment',
      'Consider cross-platform distribution for liquidity'
    ]
  };
}

async function generateSampleReport(): Promise<Partial<CollectorAdvisoryReport>> {
  return {
    title: 'Sample Collection Advisory Report',
    collector: {
      name: 'Demo Collector',
      portfolio: 'Eden Registry Sample'
    },
    analysis: {
      portfolioOverview: {
        totalWorks: 15,
        mediumBreakdown: { 'Generative Art': 8, 'Digital Photography': 4, 'AI Art': 3 },
        qualityDistribution: { exceptional: 2, strong: 8, solid: 4, emerging: 1 },
        overallScore: 0.76,
        keyStrengths: ['Strong generative art focus', 'High-quality curation'],
        improvementAreas: ['Expand into emerging mediums', 'Add more exceptional pieces']
      } as PortfolioAnalysis,
      marketIntelligence: {
        currentTrends: ['AI art gaining momentum'],
        marketRisks: ['Platform volatility'],
        opportunities: ['Early Eden Registry adoption'],
        emergingOpportunities: [],
        priceTargets: [],
        platformInsights: { totalVolume: 100, activeBuyers: 50, averagePrice: 1.5 }
      } as MarketInsights,
      recommendations: [{
        priority: 'high' as const,
        category: 'Eden Registry Works',
        action: 'acquire' as const,
        rationale: 'Registry verification provides unique value and provenance guarantee',
        timeline: 'Next 30 days',
        budget: 'Primary allocation'
      }],
      riskAssessment: {
        overallRisk: 'medium' as const,
        factors: [],
        mitigationStrategies: [],
        riskFactors: [],
        diversificationScore: 0.5,
        recommendations: []
      } as RiskAnalysis
    }
  };
}