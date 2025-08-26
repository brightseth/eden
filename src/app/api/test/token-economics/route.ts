// Test endpoint for token economics analysis
// Shows how different agents utilize the shared token model

import { NextRequest, NextResponse } from 'next/server';
import { tokenEconomics } from '@/lib/token-economics/shared-model';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const agentId = searchParams.get('agent');
    
    if (agentId) {
      // Get specific agent economics
      console.log(`[TokenTest] Analyzing economics for agent: ${agentId}`);
      
      const agentEconomics = tokenEconomics.getAgentEconomics(agentId);
      const revenueProjection = tokenEconomics.calculateMonthlyRevenue(agentId);
      
      return NextResponse.json({
        timestamp: new Date().toISOString(),
        agentId,
        economics: agentEconomics,
        revenueProjection,
        success: true
      });
      
    } else {
      // Compare all agents' economic profiles
      console.log('[TokenTest] Comparing all agent economics...');
      
      const agents = [
        'abraham', 'solienne',           // LAUNCHING
        'geppetto', 'koru',              // DEVELOPING (committed trainers)
        'miyomi', 'amanda', 'citizen', 'nina'  // DEVELOPING (seeking trainers)
      ];
      
      const agentComparisons = agents.map(id => {
        const economics = tokenEconomics.getAgentEconomics(id);
        const revenue = tokenEconomics.calculateMonthlyRevenue(id);
        
        return {
          agentId: id,
          name: id.toUpperCase(),
          primaryFocus: economics.utilization.primaryFocus,
          revenueWeighting: economics.utilization.revenueWeighting,
          monthlyRevenue: revenue.monthly.total,
          annualRevenue: revenue.annual.total,
          category: economics.utilization.marketPosition.category,
          uniqueFeatures: economics.utilization.uniqueFeatures,
          targetMarket: economics.utilization.marketPosition.targetAudience.primary
        };
      });
      
      // Generate insights
      const insights = {
        sharedModel: {
          distribution: '25% each: $SPIRIT holders, Eden, Agent, Trainer',
          revenueStreams: ['Art Sales', 'Services', 'Royalties', 'Community'],
          differentiation: 'Utilization patterns vary by agent specialization'
        },
        revenueAnalysis: {
          highestPotential: agentComparisons.sort((a, b) => b.annualRevenue - a.annualRevenue).slice(0, 3),
          serviceHeavy: agentComparisons.filter(a => a.revenueWeighting.services > 40),
          artFocused: agentComparisons.filter(a => a.revenueWeighting.artSales > 50),
          diversified: agentComparisons.filter(a => Math.max(...Object.values(a.revenueWeighting)) < 60)
        },
        marketCategories: {
          categories: [...new Set(agentComparisons.map(a => a.category))],
          distribution: agentComparisons.reduce((acc, agent) => {
            acc[agent.category] = (acc[agent.category] || 0) + 1;
            return acc;
          }, {} as Record<string, number>)
        },
        economicDiversity: {
          totalAddressableMarket: '4.8B+ across all categories',
          complementaryServices: 'Agents support rather than compete with each other',
          ecosystemValue: 'Cross-referrals and collaboration opportunities'
        }
      };
      
      return NextResponse.json({
        timestamp: new Date().toISOString(),
        sharedTokenModel: {
          distribution: { spirit: 25, eden: 25, agent: 25, trainer: 25 },
          commonInfrastructure: ['Blockchain deployment', 'Token mechanics', 'Platform fees'],
          agentDifferentiation: 'Utilization patterns and service focus'
        },
        agentComparisons,
        insights,
        recommendations: [
          'Focus on complementary specializations to avoid direct competition',
          'Cross-agent collaboration opportunities for premium services',
          'Shared infrastructure reduces individual agent development costs',
          'Diversified revenue streams reduce ecosystem risk'
        ],
        success: true
      });
    }
    
  } catch (error) {
    console.error('[TokenTest] Economics analysis failed:', error);
    
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
      success: false
    }, { status: 500 });
  }
}