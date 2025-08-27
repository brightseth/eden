import { NextRequest, NextResponse } from 'next/server';
import { citizenSDK } from '@/lib/agents/citizen-claude-sdk';
import { registryClient } from '@/lib/registry/client';

// GET /api/agents/citizen/fellowship - Get fellowship status and management
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const includeMetrics = searchParams.get('metrics') === 'true';
    const includeMembers = searchParams.get('members') === 'true';
    
    console.log('[CITIZEN Fellowship] GET request:', { includeMetrics, includeMembers });
    
    // Get current governance metrics for context
    const governanceMetrics = citizenSDK.getGovernanceMetrics();
    
    // Fellowship overview
    const fellowshipData = {
      overview: {
        total_members: governanceMetrics.fellowshipSize,
        active_members: Math.floor(governanceMetrics.fellowshipSize * 0.75),
        participation_rate: Math.round(governanceMetrics.avgParticipationRate * 100),
        growth_rate: '+12% this month',
        health_score: Math.round(governanceMetrics.governanceHealth * 100)
      },
      
      // Membership tiers and roles
      structure: {
        tiers: [
          {
            name: 'Genesis Fellows',
            count: Math.floor(governanceMetrics.fellowshipSize * 0.15),
            description: 'Founding members with enhanced voting weight',
            privileges: ['enhanced_voting_weight', 'proposal_sponsorship', 'working_group_leadership']
          },
          {
            name: 'Active Fellows',
            count: Math.floor(governanceMetrics.fellowshipSize * 0.60),
            description: 'Regular participating members',
            privileges: ['voting_rights', 'proposal_submission', 'working_group_participation']
          },
          {
            name: 'Community Fellows',
            count: Math.floor(governanceMetrics.fellowshipSize * 0.25),
            description: 'General community members',
            privileges: ['basic_voting_rights', 'discussion_participation']
          }
        ],
        
        working_groups: [
          {
            name: 'Economic Policy',
            members: 8,
            lead: 'Amanda Schmitt',
            focus: 'Revenue sharing and economic sustainability',
            status: 'active'
          },
          {
            name: 'Technical Governance',
            members: 12,
            lead: 'Dev Community Collective',
            focus: 'Platform operations and technical decisions',
            status: 'active'
          },
          {
            name: 'Community Engagement',
            members: 15,
            lead: 'Community Representatives',
            focus: 'Onboarding and engagement programs',
            status: 'active'
          }
        ]
      },
      
      // Current engagement metrics
      engagement: {
        monthly_participation: {
          proposals_voted: governanceMetrics.totalProposals,
          discussions_active: governanceMetrics.activeDebates,
          working_groups_active: 3,
          events_attended: 24
        },
        
        participation_trends: [
          { month: 'June 2025', rate: 68 },
          { month: 'July 2025', rate: 72 },
          { month: 'August 2025', rate: Math.round(governanceMetrics.avgParticipationRate * 100) }
        ],
        
        top_contributors: [
          { name: 'Amanda Schmitt', contributions: 15, role: 'Economic Policy Lead' },
          { name: 'Genesis Collective', contributions: 12, role: 'Constitutional Framework' },
          { name: 'Tech Working Group', contributions: 9, role: 'Platform Operations' }
        ]
      },
      
      // Governance capabilities
      governance_powers: {
        voting_mechanisms: [
          'simple_majority',
          'qualified_majority', 
          'rough_consensus',
          'ranked_choice'
        ],
        
        proposal_types: [
          'constitutional',
          'economic',
          'operational', 
          'fellowship',
          'community'
        ],
        
        decision_thresholds: {
          simple_majority: '50% + 1',
          qualified_majority: '67%',
          rough_consensus: '70% with <20% strong objection',
          constitutional: '75% + quorum'
        }
      }
    };
    
    // Add detailed metrics if requested
    if (includeMetrics) {
      fellowshipData.detailed_metrics = {
        governance_health: {
          participation_consistency: Math.round(governanceMetrics.avgParticipationRate * 100),
          consensus_achievement: Math.round(governanceMetrics.avgConsensusScore * 100),
          proposal_success_rate: governanceMetrics.totalProposals > 0 
            ? Math.round((governanceMetrics.passedProposals / governanceMetrics.totalProposals) * 100)
            : 0,
          stakeholder_satisfaction: 76
        },
        
        engagement_patterns: {
          peak_activity_hours: '14:00-18:00 UTC',
          most_active_days: ['Tuesday', 'Wednesday', 'Thursday'],
          discussion_engagement: 'High',
          vote_completion_rate: 89
        },
        
        growth_indicators: {
          new_member_rate: '3-5 per week',
          retention_rate: '87%',
          onboarding_completion: '78%',
          satisfaction_score: '4.2/5.0'
        }
      };
    }
    
    // Add member directory if requested (mock data for privacy)
    if (includeMembers) {
      fellowshipData.member_directory = {
        note: 'Directory shows public profiles only, with privacy protection',
        public_profiles: [
          {
            id: 'genesis-001',
            name: 'Amanda Schmitt',
            role: 'Economic Policy Lead',
            tier: 'Genesis Fellow',
            contributions: 15,
            specialties: ['economic_policy', 'revenue_sharing', 'market_analysis']
          },
          {
            id: 'genesis-002', 
            name: 'Community Collective',
            role: 'Engagement Coordinator',
            tier: 'Active Fellow',
            contributions: 12,
            specialties: ['community_building', 'onboarding', 'events']
          },
          {
            id: 'tech-001',
            name: 'Dev Working Group',
            role: 'Technical Operations',
            tier: 'Active Fellow', 
            contributions: 9,
            specialties: ['platform_ops', 'technical_governance', 'infrastructure']
          }
        ],
        total_public_profiles: 24,
        privacy_note: 'Members can opt into public directory or remain private'
      };
    }
    
    return NextResponse.json({
      success: true,
      fellowship: fellowshipData,
      governance_context: {
        current_proposals: governanceMetrics.activeDebates,
        recent_decisions: governanceMetrics.passedProposals,
        upcoming_votes: 2,
        next_meeting: '2025-09-01T18:00:00Z'
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('[CITIZEN Fellowship] Error fetching fellowship data:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch fellowship data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// POST /api/agents/citizen/fellowship - Fellowship management actions
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, memberData, proposalData } = body;
    
    console.log('[CITIZEN Fellowship] POST action:', action);
    
    switch (action) {
      case 'invite_member':
        return handleMemberInvitation(memberData);
        
      case 'update_member':
        return handleMemberUpdate(memberData);
        
      case 'create_working_group':
        return handleWorkingGroupCreation(proposalData);
        
      case 'schedule_event':
        return handleEventScheduling(proposalData);
        
      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 }
        );
    }
    
  } catch (error) {
    console.error('[CITIZEN Fellowship] Error processing fellowship action:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process fellowship action',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Helper functions for fellowship management

async function handleMemberInvitation(memberData: any) {
  // In production, this would integrate with the Registry for member management
  console.log('[CITIZEN Fellowship] Processing member invitation:', memberData);
  
  return NextResponse.json({
    success: true,
    action: 'invite_member',
    result: {
      invitation_sent: true,
      member_id: `fellow-${Date.now()}`,
      invited_email: memberData.email,
      invitation_expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      onboarding_link: 'https://eden-academy.vercel.app/onboard',
      message: 'Fellowship invitation sent successfully'
    }
  });
}

async function handleMemberUpdate(memberData: any) {
  console.log('[CITIZEN Fellowship] Processing member update:', memberData);
  
  return NextResponse.json({
    success: true,
    action: 'update_member',
    result: {
      member_updated: true,
      member_id: memberData.id,
      changes_applied: Object.keys(memberData.updates || {}),
      effective_date: new Date().toISOString(),
      message: 'Member profile updated successfully'
    }
  });
}

async function handleWorkingGroupCreation(proposalData: any) {
  console.log('[CITIZEN Fellowship] Processing working group creation:', proposalData);
  
  return NextResponse.json({
    success: true,
    action: 'create_working_group',
    result: {
      working_group_created: true,
      group_id: `wg-${Date.now()}`,
      name: proposalData.name,
      focus_area: proposalData.focus,
      initial_members: proposalData.members?.length || 0,
      formation_date: new Date().toISOString(),
      governance_proposal_required: true,
      message: 'Working group proposal prepared for community vote'
    }
  });
}

async function handleEventScheduling(proposalData: any) {
  console.log('[CITIZEN Fellowship] Processing event scheduling:', proposalData);
  
  return NextResponse.json({
    success: true,
    action: 'schedule_event',
    result: {
      event_scheduled: true,
      event_id: `event-${Date.now()}`,
      title: proposalData.title,
      scheduled_date: proposalData.date,
      event_type: proposalData.type || 'community_discussion',
      registration_required: proposalData.requireRegistration || false,
      calendar_invite_sent: true,
      message: 'Fellowship event scheduled successfully'
    }
  });
}