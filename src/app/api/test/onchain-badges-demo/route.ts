// Demo endpoint showing onchain badges with mock data
// Demonstrates how badges appear when spirit-registry is available

import { NextRequest, NextResponse } from 'next/server';
import { featureFlags } from '@/config/flags';

// Mock Spirit Registry data for demo purposes
const MOCK_GENESIS_COHORT = {
  agents: [
    {
      id: 'abraham',
      handle: 'abraham',
      displayName: 'ABRAHAM',
      tokenAddress: '0x742d35Cc9eE5E32A8d8B86D04F8e8D6a9F3f4A9',
      deploymentDate: '2024-10-15T10:00:00Z',
      totalSupply: '1000000',
      holders: 247
    },
    {
      id: 'solienne',
      handle: 'solienne', 
      displayName: 'SOLIENNE',
      tokenAddress: '0x9A3f4a2d8B86D04F8e8D6a9F3f4A942d35Cc9eE5',
      deploymentDate: '2024-11-01T14:30:00Z',
      totalSupply: '1000000',
      holders: 156
    },
    {
      id: 'geppetto',
      handle: 'geppetto',
      displayName: 'GEPPETTO',
      // No token address - still developing
    },
    {
      id: 'koru',
      handle: 'koru',
      displayName: 'KORU', 
      // No token address - still developing
    },
    {
      id: 'miyomi',
      handle: 'miyomi',
      displayName: 'MIYOMI',
      // No token address - seeking trainer
    },
    {
      id: 'amanda',
      handle: 'amanda',
      displayName: 'AMANDA',
      // No token address - seeking trainer
    },
    {
      id: 'citizen', 
      handle: 'citizen',
      displayName: 'CITIZEN',
      // No token address - seeking trainer
    },
    {
      id: 'nina',
      handle: 'nina',
      displayName: 'NINA',
      // No token address - seeking trainer
    }
  ]
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const agentId = searchParams.get('agent');
    const enableBadges = searchParams.get('enable') === 'true';
    
    console.log('[BadgeDemo] Running onchain badge demonstration...');
    
    if (enableBadges) {
      // Temporarily enable badges for demo
      featureFlags.enable('ENABLE_ONCHAIN_BADGES');
      featureFlags.enable('ENABLE_SPIRIT_REGISTRY');
    }
    
    const flagStatus = {
      spiritRegistry: featureFlags.isEnabled('ENABLE_SPIRIT_REGISTRY'),
      onchainBadges: featureFlags.isEnabled('ENABLE_ONCHAIN_BADGES'),
      dataReconciliation: featureFlags.isEnabled('ENABLE_DATA_RECONCILIATION')
    };
    
    if (agentId) {
      // Demo specific agent badge
      const agent = MOCK_GENESIS_COHORT.agents.find(a => 
        a.handle?.toLowerCase() === agentId.toLowerCase()
      );
      
      if (!agent) {
        return NextResponse.json({
          error: `Agent ${agentId} not found in Genesis cohort`,
          availableAgents: MOCK_GENESIS_COHORT.agents.map(a => a.handle)
        }, { status: 404 });
      }
      
      const badgeData = {
        agentId: agent.handle,
        name: agent.displayName,
        onchain: {
          isDeployed: !!agent.tokenAddress,
          tokenAddress: agent.tokenAddress,
          deploymentDate: agent.deploymentDate,
          totalSupply: agent.totalSupply,
          holders: agent.holders,
          verificationStatus: agent.tokenAddress ? 'verified' : 'unverified'
        },
        badgeDisplay: {
          shouldShow: flagStatus.onchainBadges,
          status: agent.tokenAddress ? 'ONCHAIN' : 'OFFCHAIN',
          color: agent.tokenAddress ? 'green' : 'yellow',
          icon: agent.tokenAddress ? '●' : '○',
          tooltip: agent.tokenAddress 
            ? `Deployed ${agent.deploymentDate?.split('T')[0]} • ${agent.holders} holders`
            : 'Token not yet deployed'
        }
      };
      
      return NextResponse.json({
        timestamp: new Date().toISOString(),
        flagStatus,
        agentId,
        badgeData,
        demoNote: 'This uses mock data to show how badges work when spirit-registry is available',
        success: true
      });
      
    } else {
      // Demo all agent badges
      const allBadges = MOCK_GENESIS_COHORT.agents.map(agent => ({
        handle: agent.handle,
        name: agent.displayName,
        isDeployed: !!agent.tokenAddress,
        tokenAddress: agent.tokenAddress,
        deploymentDate: agent.deploymentDate,
        badgeStatus: agent.tokenAddress ? 'ONCHAIN' : 'OFFCHAIN',
        badgeColor: agent.tokenAddress ? 'green' : 'yellow',
        badgeIcon: agent.tokenAddress ? '●' : '○',
        shouldShowBadge: flagStatus.onchainBadges,
        metadata: agent.tokenAddress ? {
          totalSupply: agent.totalSupply,
          holders: agent.holders,
          deployedDaysAgo: Math.floor((Date.now() - new Date(agent.deploymentDate!).getTime()) / (1000 * 60 * 60 * 24))
        } : null
      }));
      
      const summary = {
        totalAgents: allBadges.length,
        onchainAgents: allBadges.filter(a => a.isDeployed).length,
        offchainAgents: allBadges.filter(a => !a.isDeployed).length,
        badgesEnabled: flagStatus.onchainBadges,
        totalHolders: allBadges.reduce((sum, agent) => sum + (agent.metadata?.holders || 0), 0)
      };
      
      return NextResponse.json({
        timestamp: new Date().toISOString(),
        flagStatus,
        summary,
        allBadges,
        demoInstructions: {
          viewWithBadges: '?enable=true',
          viewSpecificAgent: '?agent=abraham&enable=true',
          badgeStates: {
            onchain: 'Green dot (●) + ONCHAIN label + token info',
            offchain: 'Yellow dot (○) + OFFCHAIN label + "Token not deployed"'
          }
        },
        demoNote: 'This uses mock data to show how badges work when spirit-registry is available',
        recommendations: [
          enableBadges ? 'Badges enabled! Check the academy page to see them in action' : 'Add ?enable=true to see badges in action',
          `${summary.onchainAgents} agents show green ONCHAIN badges`,
          `${summary.offchainAgents} agents show yellow OFFCHAIN badges`,
          'Badges gracefully degrade if spirit-registry unavailable',
          'Token addresses and holder counts shown for deployed agents'
        ],
        success: true
      });
    }
    
  } catch (error) {
    console.error('[BadgeDemo] Demo failed:', error);
    
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
      success: false
    }, { status: 500 });
  }
}