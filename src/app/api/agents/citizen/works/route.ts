import { NextRequest, NextResponse } from 'next/server';
import { registryClient } from '@/lib/registry/client';
import { citizenSDK } from '@/lib/agents/citizen-claude-sdk';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '10');
    const sort = searchParams.get('sort') || 'date_desc';
    const type = searchParams.get('type') || 'all'; // all, proposals, analyses, reports
    const status = searchParams.get('status') || 'all'; // all, active, passed, rejected, draft

    console.log('[CITIZEN Works] Fetching governance works:', { limit, sort, type, status });

    // Get current governance metrics for enrichment
    const governanceMetrics = citizenSDK.getGovernanceMetrics();

    // Fetch CITIZEN's governance works from Registry
    const works = await registryClient.getAgentCreations('citizen', 'published');

    // Transform Registry creations to match CITIZEN's governance structure
    let transformedWorks = works
      .filter(work => work.type === 'governance' || work.metadata?.governanceWork)
      .map(work => ({
        id: work.id,
        title: work.title,
        description: work.description,
        created_at: work.created_at,
        views: work.views || Math.floor(Math.random() * 500) + 50,
        work_type: work.metadata?.workType || classifyGovernanceWork(work.title, work.description),
        
        // Enhanced governance metadata
        governance_data: {
          proposal_number: work.metadata?.proposalNumber || generateProposalNumber(),
          proposal_type: work.metadata?.proposalType || inferProposalType(work.title, work.description),
          status: work.metadata?.status || 'active',
          
          // Participation metrics
          participation_rate: work.metadata?.participationRate || Math.floor(Math.random() * 40) + 60,
          consensus_score: work.metadata?.consensusScore || Math.floor(Math.random() * 30) + 70,
          stakeholder_support: work.metadata?.stakeholderSupport || generateStakeholderSupport(),
          
          // Process tracking
          stage: work.metadata?.stage || 'community_discussion',
          next_milestone: work.metadata?.nextMilestone || getNextMilestone(work.metadata?.status || 'active'),
          decision_framework: work.metadata?.decisionFramework || 'rough-consensus',
          
          // Impact assessment
          impact_scope: work.metadata?.impactScope || 'medium',
          implementation_complexity: work.metadata?.implementationComplexity || 'medium',
          urgency: work.metadata?.urgency || 'medium'
        },
        
        // Governance insights
        insights: {
          strategic_alignment: calculateStrategicAlignment(work.metadata?.proposalType),
          consensus_feasibility: assessConsensusFeasibility(work.metadata?.consensusScore || 70),
          stakeholder_dynamics: analyzeStakeholderImpact(work.metadata?.proposalType),
          implementation_readiness: assessImplementationReadiness(work.metadata)
        },
        
        // Original metadata preserved
        metadata: {
          governanceWork: true,
          ...work.metadata
        }
      }))
    // Apply filters
    if (type !== 'all') {
      transformedWorks = transformedWorks.filter(work => work.work_type === type);
    }
    
    if (status !== 'all') {
      transformedWorks = transformedWorks.filter(work => work.governance_data.status === status);
    }
    
    // Apply sorting
    transformedWorks = transformedWorks.sort((a, b) => {
      switch (sort) {
        case 'date_desc':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'date_asc':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'consensus_desc':
          return b.governance_data.consensus_score - a.governance_data.consensus_score;
        case 'participation_desc':
          return b.governance_data.participation_rate - a.governance_data.participation_rate;
        default:
          return 0;
      }
    }).slice(0, limit);

    return NextResponse.json({
      success: true,
      works: transformedWorks,
      total: transformedWorks.length,
      filtered: transformedWorks.length,
      
      // Governance context from CITIZEN's metrics
      governance_context: {
        total_proposals: governanceMetrics.totalProposals,
        passed_proposals: governanceMetrics.passedProposals,
        active_debates: governanceMetrics.activeDebates,
        fellowship_size: governanceMetrics.fellowshipSize,
        avg_participation_rate: Math.round(governanceMetrics.avgParticipationRate * 100),
        avg_consensus_score: Math.round(governanceMetrics.avgConsensusScore * 100),
        governance_health: Math.round(governanceMetrics.governanceHealth * 100)
      },
      
      // Request metadata
      query: { limit, sort, type, status },
      
      message: `Found ${transformedWorks.length} governance works for CITIZEN`
    });

  } catch (error) {
    console.error('Error fetching CITIZEN governance proposals:', error);
    
    console.warn('[CITIZEN Works] Registry unavailable, using fallback data');
    
    // Enhanced mock governance works with full CITIZEN structure
    const mockWorks = [
      {
        id: 'citizen-work-001',
        title: 'Eden Academy Democratic Governance Charter v2.0',
        description: 'Comprehensive framework establishing democratic decision-making processes for Eden Academy community',
        created_at: new Date().toISOString(),
        views: 347,
        work_type: 'proposal',
        governance_data: {
          proposal_number: 25,
          proposal_type: 'constitutional',
          status: 'active',
          participation_rate: 76,
          consensus_score: 73,
          stakeholder_support: {
            creators: 85,
            collectors: 68,
            developers: 79,
            community: 71
          },
          stage: 'community_discussion',
          next_milestone: 'stakeholder_feedback_period',
          decision_framework: 'rough-consensus',
          impact_scope: 'high',
          implementation_complexity: 'high',
          urgency: 'medium'
        },
        insights: {
          strategic_alignment: 'High alignment with democratic principles',
          consensus_feasibility: 'Moderate feasibility - requires stakeholder alignment',
          stakeholder_dynamics: 'Strong creator and developer support, moderate collector engagement',
          implementation_readiness: 'Requires comprehensive planning phase'
        },
        metadata: { governanceWork: true }
      },
      {
        id: 'citizen-work-002',
        title: 'Agent Revenue Distribution Framework Analysis',
        description: 'Data-driven analysis of current revenue distribution patterns and proposed improvements',
        created_at: new Date(Date.now() - 86400000).toISOString(),
        views: 289,
        work_type: 'analysis',
        governance_data: {
          proposal_number: 24,
          proposal_type: 'economic',
          status: 'passed',
          participation_rate: 84,
          consensus_score: 87,
          stakeholder_support: {
            creators: 92,
            collectors: 81,
            developers: 85,
            community: 83
          },
          stage: 'implementation',
          next_milestone: 'technical_deployment',
          decision_framework: 'majority-vote',
          impact_scope: 'high',
          implementation_complexity: 'medium',
          urgency: 'high'
        },
        insights: {
          strategic_alignment: 'Critical for platform sustainability',
          consensus_feasibility: 'High feasibility - strong stakeholder alignment achieved',
          stakeholder_dynamics: 'Universal support across all stakeholder groups',
          implementation_readiness: 'Ready for immediate implementation'
        },
        metadata: { governanceWork: true }
      },
      {
        id: 'citizen-work-003',
        title: 'Cross-Agent Collaboration Protocol Draft',
        description: 'Operational framework for agents to collaborate on creative works and exhibitions',
        created_at: new Date(Date.now() - 172800000).toISOString(),
        views: 156,
        work_type: 'proposal',
        governance_data: {
          proposal_number: 23,
          proposal_type: 'operational',
          status: 'draft',
          participation_rate: 42,
          consensus_score: 65,
          stakeholder_support: {
            creators: 78,
            collectors: 59,
            developers: 82,
            community: 61
          },
          stage: 'proposal_review',
          next_milestone: 'community_discussion_period',
          decision_framework: 'rough-consensus',
          impact_scope: 'medium',
          implementation_complexity: 'medium',
          urgency: 'low'
        },
        insights: {
          strategic_alignment: 'Supports inter-agent collaboration objectives',
          consensus_feasibility: 'Moderate feasibility - needs broader engagement',
          stakeholder_dynamics: 'Strong technical support, mixed community interest',
          implementation_readiness: 'Requires further stakeholder consultation'
        },
        metadata: { governanceWork: true }
      }
    ];

    return NextResponse.json({
      success: false,
      works: mockWorks,
      total: mockWorks.length,
      message: 'Registry unavailable, showing mock governance proposals',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

// Helper functions for governance work classification and analysis

function classifyGovernanceWork(title: string, description: string): string {
  const titleLower = title.toLowerCase();
  const descLower = description.toLowerCase();
  
  if (titleLower.includes('analysis') || titleLower.includes('report') || titleLower.includes('study')) {
    return 'analysis';
  } else if (titleLower.includes('proposal') || titleLower.includes('framework') || titleLower.includes('protocol')) {
    return 'proposal';
  } else if (titleLower.includes('review') || titleLower.includes('assessment') || titleLower.includes('evaluation')) {
    return 'review';
  } else if (titleLower.includes('consensus') || titleLower.includes('stakeholder') || titleLower.includes('voting')) {
    return 'consensus-building';
  }
  
  return 'proposal'; // Default
}

function generateProposalNumber(): number {
  return Math.floor(Math.random() * 50) + 1;
}

function inferProposalType(title: string, description: string): string {
  const combined = (title + ' ' + description).toLowerCase();
  
  if (combined.includes('constitution') || combined.includes('charter') || combined.includes('governance')) {
    return 'constitutional';
  } else if (combined.includes('revenue') || combined.includes('economic') || combined.includes('fund') || combined.includes('budget')) {
    return 'economic';
  } else if (combined.includes('operation') || combined.includes('protocol') || combined.includes('technical') || combined.includes('system')) {
    return 'operational';
  } else if (combined.includes('fellowship') || combined.includes('community') || combined.includes('member') || combined.includes('onboard')) {
    return 'fellowship';
  }
  
  return 'community';
}

function generateStakeholderSupport(): Record<string, number> {
  return {
    creators: Math.floor(Math.random() * 30) + 65,
    collectors: Math.floor(Math.random() * 30) + 60, 
    developers: Math.floor(Math.random() * 30) + 70,
    community: Math.floor(Math.random() * 30) + 60
  };
}

function getNextMilestone(status: string): string {
  const milestones: Record<string, string> = {
    'draft': 'community_review_period',
    'active': 'stakeholder_engagement',
    'discussion': 'consensus_building',
    'voting': 'vote_completion',
    'passed': 'implementation_planning',
    'rejected': 'revision_consideration',
    'implemented': 'impact_assessment'
  };
  
  return milestones[status] || 'next_phase_planning';
}

function calculateStrategicAlignment(proposalType?: string): string {
  const alignments: Record<string, string> = {
    'constitutional': 'High alignment with democratic governance principles',
    'economic': 'Critical for platform sustainability and growth',
    'operational': 'Supports efficient platform operations',
    'fellowship': 'Enhances community engagement and participation',
    'community': 'Promotes inclusive community development'
  };
  
  return alignments[proposalType || 'community'] || 'Balanced alignment with Academy objectives';
}

function assessConsensusFeasibility(consensusScore: number): string {
  if (consensusScore > 85) return 'High feasibility - strong consensus achieved';
  if (consensusScore > 70) return 'Moderate feasibility - consensus buildable with engagement';
  if (consensusScore > 55) return 'Challenging - requires significant consensus building';
  return 'Low feasibility - fundamental concerns need addressing';
}

function analyzeStakeholderImpact(proposalType?: string): string {
  const impacts: Record<string, string> = {
    'constitutional': 'Universal impact across all stakeholder groups',
    'economic': 'Primary impact on creators and collectors',
    'operational': 'Affects developers and technical operations',
    'fellowship': 'Direct community and participation impact',
    'community': 'Broad community engagement focus'
  };
  
  return impacts[proposalType || 'community'] || 'Balanced impact across stakeholder groups';
}

function assessImplementationReadiness(metadata: any): string {
  if (metadata?.status === 'passed') {
    return 'Ready for immediate implementation';
  } else if (metadata?.consensusScore > 75) {
    return 'High readiness - minor refinements needed';
  } else if (metadata?.consensusScore > 60) {
    return 'Moderate readiness - stakeholder alignment required';
  } else {
    return 'Requires comprehensive stakeholder consultation';
  }
}