import { NextRequest, NextResponse } from 'next/server';
import { citizenSDK } from '@/lib/agents/citizen-claude-sdk';

// POST /api/agents/citizen/consensus - Analyze consensus potential for proposal
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { proposal, communityFeedback } = body;

    console.log('[CITIZEN Consensus] Analyzing consensus:', { proposalId: proposal?.id });

    if (!proposal) {
      return NextResponse.json(
        { error: 'Proposal data is required for consensus analysis' },
        { status: 400 }
      );
    }

    // Create proposal object if not in proper format
    const proposalObject = {
      id: proposal.id || 'unknown-proposal',
      title: proposal.title || 'Untitled Proposal',
      description: proposal.description || 'No description provided',
      type: proposal.type || 'community',
      requiredMajority: proposal.requiredMajority || 60,
      metadata: proposal.metadata || {
        impactScope: 'medium',
        urgency: 'medium',
        complexityScore: 0.5,
        consensusScore: 0.6,
        stakeholderAlignment: 0.7
      }
    };

    // Use provided feedback or generate mock feedback for testing
    const feedback = communityFeedback || [
      "This proposal addresses a real need in our community",
      "Concerned about implementation timeline and resource requirements",
      "Support the direction but want clearer success metrics",
      "Economic implications need more detailed analysis",
      "Strong support from creator community, mixed from collectors"
    ];

    // Generate consensus analysis using CITIZEN's Claude integration
    const consensusAnalysis = await citizenSDK.analyzeConsensus(proposalObject, feedback);

    console.log('[CITIZEN Consensus] Generated analysis for:', consensusAnalysis.proposal);

    // Transform to detailed API response
    const analysisResponse = {
      success: true,
      consensus_analysis: {
        proposal_title: consensusAnalysis.proposal,
        overall_consensus_score: Math.round(
          consensusAnalysis.consensusPath.successProbability * 100
        ),
        
        // Stakeholder breakdown
        stakeholder_analysis: consensusAnalysis.stakeholderGroups.map(group => ({
          group_name: group.name,
          estimated_size: group.size,
          influence_level: Math.round(group.influence * 100),
          support_level: Math.round(group.supportLevel * 100),
          primary_concerns: group.concerns,
          engagement_strategy: generateEngagementStrategy(group.name, group.supportLevel)
        })),
        
        // Path to consensus
        consensus_strategy: {
          primary_approach: consensusAnalysis.consensusPath.strategy,
          implementation_steps: consensusAnalysis.consensusPath.steps,
          estimated_timeline: consensusAnalysis.consensusPath.timeline,
          success_probability: Math.round(consensusAnalysis.consensusPath.successProbability * 100),
          key_milestones: generateKeyMilestones(consensusAnalysis.consensusPath.steps)
        },
        
        // Risk assessment
        risk_analysis: consensusAnalysis.potentialBlocks.map(block => ({
          risk_factor: block.issue,
          severity_level: block.severity,
          mitigation_approach: block.mitigation,
          monitoring_required: generateMonitoringStrategy(block.severity)
        })),
        
        // Recommendations
        action_recommendations: {
          immediate_actions: generateImmediateActions(consensusAnalysis),
          stakeholder_outreach: generateOutreachPlan(consensusAnalysis.stakeholderGroups),
          communication_strategy: generateCommunicationPlan(proposalObject.type),
          timeline_adjustments: generateTimelineRecommendations(consensusAnalysis.potentialBlocks)
        }
      },
      
      // Governance insights
      governance_insights: {
        consensus_feasibility: assessConsensusFeasibility(consensusAnalysis.consensusPath.successProbability),
        stakeholder_dynamics: analyzeStakeholderDynamics(consensusAnalysis.stakeholderGroups),
        process_recommendations: generateProcessRecommendations(consensusAnalysis),
        success_factors: identifySuccessFactors(consensusAnalysis)
      },
      
      // Next steps
      implementation_plan: {
        phase_1: "Stakeholder engagement and concern addressing",
        phase_2: "Consensus building through dialogue facilitation", 
        phase_3: "Proposal refinement based on feedback",
        phase_4: "Formal voting with optimized participation",
        estimated_duration: consensusAnalysis.consensusPath.timeline,
        success_metrics: generateSuccessMetrics(proposalObject.type)
      }
    };

    return NextResponse.json(analysisResponse);

  } catch (error) {
    console.error('[CITIZEN Consensus] Error analyzing consensus:', error);
    return NextResponse.json(
      { 
        error: 'Failed to analyze consensus potential',
        details: error instanceof Error ? error.message : 'Unknown consensus analysis error'
      },
      { status: 500 }
    );
  }
}

// Helper functions for consensus analysis enhancement

function generateEngagementStrategy(groupName: string, supportLevel: number): string {
  if (supportLevel > 0.7) {
    return `Maintain support through regular updates and recognition of ${groupName} contributions`;
  } else if (supportLevel > 0.4) {
    return `Address specific concerns through targeted dialogue with ${groupName} representatives`;
  } else {
    return `Deep engagement required with ${groupName} to understand objections and find common ground`;
  }
}

function generateKeyMilestones(steps: string[]): string[] {
  return steps.map((step, index) => `Week ${index + 1}: ${step}`);
}

function generateMonitoringStrategy(severity: string): string {
  const strategies: Record<string, string> = {
    'high': 'Daily monitoring with escalation protocols',
    'medium': 'Weekly check-ins with stakeholder feedback',
    'low': 'Bi-weekly progress reviews'
  };
  return strategies[severity] || 'Standard monitoring protocols';
}

function generateImmediateActions(analysis: any): string[] {
  const actions = ['Schedule stakeholder meetings within 48 hours'];
  
  if (analysis.potentialBlocks.some((b: any) => b.severity === 'high')) {
    actions.push('Address high-severity concerns immediately');
  }
  
  if (analysis.consensusPath.successProbability < 0.6) {
    actions.push('Consider proposal amendments to increase support');
  }
  
  actions.push('Establish clear communication channels for ongoing dialogue');
  
  return actions;
}

function generateOutreachPlan(stakeholderGroups: any[]): string[] {
  return stakeholderGroups.map(group => 
    `Engage ${group.name} through their preferred communication channels`
  );
}

function generateCommunicationPlan(proposalType: string): string {
  const plans: Record<string, string> = {
    'constitutional': 'Multi-channel approach emphasizing long-term governance benefits',
    'economic': 'Data-driven communication with clear financial impact analysis',
    'operational': 'Technical briefings with implementation details and timelines',
    'fellowship': 'Community-focused messaging highlighting engagement benefits',
    'community': 'Accessible communication emphasizing broad community value'
  };
  
  return plans[proposalType] || 'Balanced communication addressing all stakeholder concerns';
}

function generateTimelineRecommendations(blocks: any[]): string {
  const highSeverityBlocks = blocks.filter(b => b.severity === 'high');
  
  if (highSeverityBlocks.length > 0) {
    return 'Extend timeline by 1-2 weeks to address critical concerns';
  } else if (blocks.length > 3) {
    return 'Add buffer time for comprehensive concern resolution';
  } else {
    return 'Standard timeline can be maintained with active monitoring';
  }
}

function assessConsensusFeasibility(successProbability: number): string {
  if (successProbability > 0.8) return 'High feasibility - strong consensus likely';
  if (successProbability > 0.6) return 'Moderate feasibility - consensus achievable with effort';
  if (successProbability > 0.4) return 'Challenging - requires significant consensus building';
  return 'Low feasibility - consider major proposal revisions';
}

function analyzeStakeholderDynamics(groups: any[]): string {
  const avgSupport = groups.reduce((sum, g) => sum + g.supportLevel, 0) / groups.length;
  const supportVariance = Math.max(...groups.map(g => g.supportLevel)) - Math.min(...groups.map(g => g.supportLevel));
  
  if (supportVariance < 0.3) {
    return 'Aligned stakeholder positions - consensus building straightforward';
  } else if (supportVariance < 0.6) {
    return 'Moderate stakeholder divergence - targeted engagement needed';
  } else {
    return 'Significant stakeholder divide - requires careful bridge-building';
  }
}

function generateProcessRecommendations(analysis: any): string[] {
  const recommendations = [];
  
  if (analysis.consensusPath.successProbability < 0.5) {
    recommendations.push('Consider facilitated working group sessions');
  }
  
  if (analysis.potentialBlocks.length > 2) {
    recommendations.push('Implement staged proposal review process');
  }
  
  recommendations.push('Establish clear feedback incorporation mechanisms');
  recommendations.push('Set participation incentives for increased engagement');
  
  return recommendations;
}

function identifySuccessFactors(analysis: any): string[] {
  const factors = ['Clear stakeholder communication'];
  
  const strongSupportGroups = analysis.stakeholderGroups.filter((g: any) => g.supportLevel > 0.7);
  if (strongSupportGroups.length > 0) {
    factors.push('Leverage existing support base effectively');
  }
  
  if (analysis.consensusPath.successProbability > 0.6) {
    factors.push('Build on existing consensus foundation');
  }
  
  factors.push('Address concerns proactively and transparently');
  
  return factors;
}

function generateSuccessMetrics(proposalType: string): string[] {
  return [
    'Participation rate above historical average',
    'Consensus score above 70%',
    'All major concerns addressed or mitigated',
    'Stakeholder satisfaction above 75%'
  ];
}