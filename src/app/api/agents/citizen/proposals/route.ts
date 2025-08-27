import { NextRequest, NextResponse } from 'next/server';
import { citizenSDK } from '@/lib/agents/citizen-claude-sdk';

// POST /api/agents/citizen/proposals - Generate new governance proposal
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { topic, context, type } = body;

    console.log('[CITIZEN Proposals] Generating proposal:', { topic, type });

    if (!topic || !type) {
      return NextResponse.json(
        { error: 'Topic and type are required for proposal generation' },
        { status: 400 }
      );
    }

    // Validate proposal type
    const validTypes = ['constitutional', 'economic', 'operational', 'fellowship', 'community'];
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: `Invalid proposal type. Must be one of: ${validTypes.join(', ')}` },
        { status: 400 }
      );
    }

    // Generate governance proposal using CITIZEN's Claude integration
    const proposal = await citizenSDK.generateProposal(
      topic,
      context || 'Community-initiated proposal for Eden Academy governance',
      type
    );

    console.log('[CITIZEN Proposals] Generated proposal:', proposal.title);

    // Transform to API response format
    const proposalResponse = {
      success: true,
      proposal: {
        id: proposal.id,
        number: proposal.proposalNumber,
        title: proposal.title,
        description: proposal.description,
        type: proposal.type,
        status: proposal.status,
        
        // Voting mechanics
        voting_configuration: {
          required_majority: proposal.requiredMajority,
          voting_period: {
            start: proposal.votingPeriod.start,
            end: proposal.votingPeriod.end,
            duration_days: Math.ceil(
              (new Date(proposal.votingPeriod.end).getTime() - 
               new Date(proposal.votingPeriod.start).getTime()) / (1000 * 60 * 60 * 24)
            )
          },
          current_votes: proposal.voting,
          participation_rate: proposal.voting.participationRate
        },
        
        // Governance analysis
        impact_assessment: {
          scope: proposal.metadata.impactScope,
          urgency: proposal.metadata.urgency,
          complexity: Math.round(proposal.metadata.complexityScore * 100),
          consensus_likelihood: Math.round(proposal.metadata.consensusScore * 100),
          stakeholder_alignment: Math.round(proposal.metadata.stakeholderAlignment * 100)
        },
        
        // Process tracking
        governance_process: {
          stage: 'proposal_review',
          next_step: 'community_discussion',
          estimated_timeline: '14-21 days to resolution',
          decision_framework: 'rough-consensus'
        },
        
        // Generated metadata
        created_at: proposal.date,
        created_by: 'CITIZEN',
        proposal_category: type,
        fellowship_eligible: true
      },
      
      // Governance context
      governance_insights: {
        strategic_alignment: 'Aligns with Eden Academy democratic principles',
        stakeholder_impact: generateStakeholderSummary(proposal),
        implementation_complexity: getImplementationComplexity(proposal.metadata.complexityScore),
        success_indicators: generateSuccessMetrics(proposal.type)
      },
      
      // Next steps
      recommendations: {
        discussion_period: 'Allow 7 days for community feedback before voting',
        stakeholder_outreach: 'Engage relevant stakeholder groups for input',
        refinement_process: 'Incorporate feedback to build consensus',
        voting_preparation: 'Prepare clear voting materials and timeline'
      }
    };

    // Sync with Registry (if enabled)
    try {
      await citizenSDK.syncWithRegistry(proposal);
    } catch (syncError) {
      console.warn('[CITIZEN Proposals] Registry sync failed:', syncError);
    }

    return NextResponse.json(proposalResponse);

  } catch (error) {
    console.error('[CITIZEN Proposals] Error generating proposal:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate governance proposal',
        details: error instanceof Error ? error.message : 'Unknown governance error'
      },
      { status: 500 }
    );
  }
}

// GET /api/agents/citizen/proposals - List existing proposals
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status') || 'all';
    const type = searchParams.get('type') || 'all';
    const limit = parseInt(searchParams.get('limit') || '10');

    console.log('[CITIZEN Proposals] GET request:', { status, type, limit });

    // Get governance metrics for context
    const metrics = citizenSDK.getGovernanceMetrics();

    // Mock existing proposals (in production, these would come from database/Registry)
    const mockProposals = [
      {
        id: 'citizen-proposal-25',
        number: 25,
        title: 'Agent Revenue Sharing Framework v3.0',
        description: 'Implement new revenue sharing model balancing creator compensation with platform sustainability',
        type: 'economic',
        status: 'active',
        created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
        voting: { for: 45, against: 12, abstain: 8, participationRate: 43 },
        metadata: {
          impactScope: 'high',
          urgency: 'medium', 
          complexityScore: 0.8,
          consensusScore: 0.65,
          stakeholderAlignment: 0.72
        }
      },
      {
        id: 'citizen-proposal-24',
        number: 24,
        title: 'Community Onboarding Enhancement Program',
        description: 'Streamline new member onboarding with improved education and mentorship',
        type: 'fellowship',
        status: 'passed',
        created_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(), // 12 days ago
        voting: { for: 67, against: 8, abstain: 5, participationRate: 53 },
        metadata: {
          impactScope: 'medium',
          urgency: 'low',
          complexityScore: 0.4,
          consensusScore: 0.84,
          stakeholderAlignment: 0.91
        }
      },
      {
        id: 'citizen-proposal-23', 
        number: 23,
        title: 'Cross-Agent Collaboration Protocol',
        description: 'Establish formal protocols for agents to collaborate on works and exhibitions',
        type: 'operational',
        status: 'draft',
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
        voting: { for: 0, against: 0, abstain: 0, participationRate: 0 },
        metadata: {
          impactScope: 'medium',
          urgency: 'medium',
          complexityScore: 0.6,
          consensusScore: 0.75,
          stakeholderAlignment: 0.68
        }
      }
    ];

    // Filter proposals based on query parameters
    let filteredProposals = mockProposals;
    
    if (status !== 'all') {
      filteredProposals = filteredProposals.filter(p => p.status === status);
    }
    
    if (type !== 'all') {
      filteredProposals = filteredProposals.filter(p => p.type === type);
    }
    
    // Apply limit
    filteredProposals = filteredProposals.slice(0, limit);

    return NextResponse.json({
      proposals: filteredProposals,
      total: mockProposals.length,
      filtered: filteredProposals.length,
      governance_context: {
        total_proposals: metrics.totalProposals,
        active_debates: metrics.activeDebates,
        fellowship_size: metrics.fellowshipSize,
        avg_participation: Math.round(metrics.avgParticipationRate * 100),
        governance_health: Math.round(metrics.governanceHealth * 100)
      },
      filters: {
        status,
        type,
        limit
      }
    });

  } catch (error) {
    console.error('[CITIZEN Proposals] Error fetching proposals:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch governance proposals',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Helper functions

function generateStakeholderSummary(proposal: any): string {
  const impactMap: Record<string, string> = {
    'constitutional': 'Affects all stakeholders through fundamental governance changes',
    'economic': 'Primary impact on creators and collectors through revenue mechanisms',
    'operational': 'Affects developers and community through platform operations',
    'fellowship': 'Direct impact on community engagement and participation',
    'community': 'Broad community impact with emphasis on accessibility'
  };
  
  return impactMap[proposal.type] || 'Balanced impact across all stakeholder groups';
}

function getImplementationComplexity(complexityScore: number): string {
  if (complexityScore > 0.8) return 'High complexity - requires careful coordination';
  if (complexityScore > 0.5) return 'Medium complexity - standard implementation process';
  return 'Low complexity - straightforward to implement';
}

function generateSuccessMetrics(proposalType: string): string[] {
  const metricsMap: Record<string, string[]> = {
    'constitutional': [
      'Governance health score improvement',
      'Process efficiency metrics',
      'Stakeholder satisfaction surveys'
    ],
    'economic': [
      'Revenue distribution fairness',
      'Creator satisfaction metrics', 
      'Platform sustainability indicators'
    ],
    'operational': [
      'System performance metrics',
      'User experience improvements',
      'Development velocity impact'
    ],
    'fellowship': [
      'Member engagement rates',
      'Onboarding success metrics',
      'Community growth indicators'
    ],
    'community': [
      'Participation rate improvements', 
      'Accessibility metrics',
      'Community sentiment analysis'
    ]
  };
  
  return metricsMap[proposalType] || [
    'Stakeholder satisfaction',
    'Implementation success rate',
    'Community engagement metrics'
  ];
}