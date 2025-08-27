import { NextRequest, NextResponse } from 'next/server';
import { citizenSDK } from '@/lib/agents/citizen-claude-sdk';

// GET /api/agents/citizen/governance - Bright Moments DAO governance info
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const includeProposals = searchParams.get('proposals') === 'true';
    const includeStats = searchParams.get('stats') === 'true';
    
    console.log('[CITIZEN Governance] Request:', { includeProposals, includeStats });
    
    // Get current governance metrics
    const governanceMetrics = citizenSDK.getGovernanceMetrics();
    
    const governanceData = {
      dao_overview: {
        name: "Bright Moments DAO",
        governance_token: "CryptoCitizens (10,000 total supply)",
        voting_mechanism: "Snapshot off-chain voting tied to on-chain NFT ownership",
        membership_model: "Each CryptoCitizen = 1 vote + DAO membership",
        decision_framework: "Rough consensus with democratic participation",
        snapshot_space: "brightmomentsdao.eth"
      },
      
      governance_structure: {
        primary_dao: {
          name: "Bright Moments DAO", 
          members: "All CryptoCitizen holders (10,000 max)",
          voting_power: "1 CryptoCitizen = 1 vote",
          governance_scope: ["City selection", "Treasury management", "Artist partnerships", "Community grants"],
          decision_types: ["Snapshot proposals", "Community consensus", "Treasury allocations"]
        },
        sub_dao: {
          name: "Bright Opportunities DAO",
          structure: "Investment-focused sub-DAO (99 accredited investors max)",
          governance: "Separate voting mechanism for investment decisions", 
          function: "Collect NFTs, support Bright Moments-related projects",
          relationship: "Supporting arm of main DAO with aligned interests"
        }
      },
      
      voting_mechanics: {
        platform: "Snapshot (off-chain voting)",
        verification: "On-chain CryptoCitizen ownership verification",
        proposal_types: [
          "City selection and activation",
          "Treasury fund allocation", 
          "Artist collaboration approvals",
          "Community grant distributions",
          "Governance protocol updates"
        ],
        voting_periods: "Typically 7 days per proposal",
        quorum_requirements: "Community participation-based (no hard quorum)",
        consensus_model: "Rough consensus - majority with consideration for minority concerns"
      },
      
      current_governance_health: {
        total_possible_voters: 10000,
        typical_participation_rate: Math.round(governanceMetrics.avgParticipationRate * 100) + "%",
        active_proposals: governanceMetrics.activeDebates,
        completed_proposals: governanceMetrics.totalProposals,
        governance_health_score: Math.round(governanceMetrics.governanceHealth * 100) + "%",
        community_engagement: "Active post-completion phase with ongoing cultural activities"
      },
      
      treasury_governance: {
        assets_managed: [
          "ETH from Golden Token sales",
          "Secondary market royalties", 
          "Blue-chip NFT holdings (including Incomplete Control, Chromie Squiggle, CryptoPunk)",
          "Cultural artifacts and commissioned works"
        ],
        allocation_decisions: "Community-voted treasury management",
        transparency: "On-chain treasury visibility and community oversight",
        sustainability_focus: "Long-term cultural preservation over short-term profits"
      },
      
      collector_governance_tiers: {
        ultra_full_set_holders: {
          governance_weight: "40 votes (40 CryptoCitizens)",
          special_privileges: "Direct leadership access, enhanced proposal rights",
          recognition: "Highest governance tier with concierge-level access"
        },
        full_set_holders: {
          governance_weight: "10 votes (10 CryptoCitizens - 1 per city)",
          special_privileges: "Priority proposal visibility, enhanced community access",
          recognition: "Prestige governance tier with privileged status"
        },
        multi_city_collectors: {
          governance_weight: "Variable based on holdings",
          engagement: "Standard DAO participation with voting rights per NFT",
          growth_path: "Encouraged toward Full Set completion"
        },
        single_city_citizens: {
          governance_weight: "1 vote per CryptoCitizen",
          participation: "Full DAO member with equal voice in community decisions",
          value: "Every voice matters in Bright Moments democratic process"
        }
      },
      
      governance_evolution: {
        phase_1: "City-by-city expansion with mint-focused governance (2021-2024)",
        phase_2: "Completion phase with Venice-to-Venice culmination (2024)",
        phase_3: "Post-completion cultural preservation and community maintenance (2024+)",
        current_focus: [
          "Cultural heritage preservation",
          "Community engagement in post-completion phase",
          "Treasury sustainability and growth",
          "Artist relationship maintenance and new collaborations"
        ]
      }
    };
    
    // Add active proposals if requested
    if (includeProposals) {
      governanceData.active_proposals = [
        {
          id: "bm-proposal-001",
          title: "Cultural Heritage Documentation Initiative", 
          type: "community_grant",
          status: "active",
          description: "Fund comprehensive documentation of Bright Moments journey and cultural impact",
          voting_period: "7 days remaining",
          current_votes: { for: 1247, against: 89, abstain: 234 },
          snapshot_link: "https://snapshot.org/#/brightmomentsdao.eth/proposal/example"
        },
        {
          id: "bm-proposal-002",
          title: "Bright Opportunities Investment Strategy 2025",
          type: "treasury_management", 
          status: "discussion",
          description: "Strategic direction for sub-DAO investment activities in new market conditions",
          discussion_period: "Community feedback phase",
          proposal_author: "Bright Opportunities leadership",
          snapshot_link: "https://snapshot.org/#/brightmomentsdao.eth/proposal/example2"
        }
      ];
    }
    
    // Add detailed statistics if requested
    if (includeStats) {
      governanceData.governance_statistics = {
        historical_participation: [
          { period: "2021", avg_participation: "68%" },
          { period: "2022", avg_participation: "72%" },
          { period: "2023", avg_participation: "75%" },
          { period: "2024", avg_participation: Math.round(governanceMetrics.avgParticipationRate * 100) + "%" }
        ],
        proposal_success_rates: {
          city_selection: "95% approval rate",
          artist_partnerships: "87% approval rate",
          treasury_decisions: "78% approval rate",
          community_grants: "92% approval rate"
        },
        engagement_metrics: {
          regular_voters: "~2,500 consistent participants",
          proposal_discussion_activity: "High engagement in community channels",
          governance_forum_usage: "Active discussion and debate culture"
        }
      };
    }
    
    return NextResponse.json({
      success: true,
      governance: governanceData,
      query: { includeProposals, includeStats },
      official_governance_links: {
        snapshot_voting: "https://snapshot.org/#/brightmomentsdao.eth",
        governance_docs: "https://docs.brightmoments.io/governance",
        community_discussion: "Official Bright Moments Discord governance channels",
        treasury_transparency: "On-chain treasury tracking and reporting"
      },
      participation_note: "Every CryptoCitizen holder is a DAO member with voting rights and community voice",
      message: "Bright Moments DAO governance - democratic participation in cultural preservation"
    });
    
  } catch (error) {
    console.error('[CITIZEN Governance] Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch governance data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}