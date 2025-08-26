// Test endpoint for onchain badge functionality
// Validates spirit-registry integration and badge display

import { NextRequest, NextResponse } from 'next/server';
import { spiritClient } from '@/lib/registry/spirit-client';
import { featureFlags } from '@/config/flags';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const agentId = searchParams.get('agent');
    const testBadges = searchParams.get('test') === 'true';
    
    console.log('[BadgeTest] Testing onchain badge functionality...');
    
    // Check feature flags
    const flagStatus = {
      spiritRegistry: featureFlags.isEnabled('ENABLE_SPIRIT_REGISTRY'),
      onchainBadges: featureFlags.isEnabled('ENABLE_ONCHAIN_BADGES'),
      dataReconciliation: featureFlags.isEnabled('ENABLE_DATA_RECONCILIATION')
    };
    
    console.log('[BadgeTest] Feature flags:', flagStatus);
    
    if (testBadges) {
      // Enable badges temporarily for testing
      featureFlags.enable('ENABLE_ONCHAIN_BADGES');
      featureFlags.enable('ENABLE_SPIRIT_REGISTRY');
    }
    
    if (agentId) {
      // Test specific agent badge
      console.log(`[BadgeTest] Testing badge for agent: ${agentId}`);
      
      try {
        const cohortData = await spiritClient.getGenesisCohort();
        const agentOnchain = cohortData.agents.find(a => 
          a.handle?.toLowerCase() === agentId.toLowerCase()
        );
        
        const badgeData = {
          agentId,
          found: !!agentOnchain,
          onchain: {
            isDeployed: !!agentOnchain?.tokenAddress,
            tokenAddress: agentOnchain?.tokenAddress,
            deploymentDate: agentOnchain?.deploymentDate,
            verificationStatus: agentOnchain?.tokenAddress ? 'verified' : 'unverified'
          },
          badgeDisplay: {
            shouldShow: flagStatus.onchainBadges && !!agentOnchain,
            status: agentOnchain?.tokenAddress ? 'ONCHAIN' : 'OFFCHAIN',
            color: agentOnchain?.tokenAddress ? 'green' : 'yellow'
          }
        };
        
        return NextResponse.json({
          timestamp: new Date().toISOString(),
          agentId,
          flagStatus,
          badgeData,
          success: true
        });
        
      } catch (error) {
        console.error(`[BadgeTest] Spirit registry error for ${agentId}:`, error);
        return NextResponse.json({
          timestamp: new Date().toISOString(),
          agentId,
          flagStatus,
          error: error instanceof Error ? error.message : 'Spirit registry unavailable',
          fallbackBehavior: 'No badge shown, graceful degradation',
          success: false
        }, { status: 500 });
      }
      
    } else {
      // Test all Genesis Cohort badges
      console.log('[BadgeTest] Testing badges for all Genesis agents...');
      
      try {
        const cohortData = await spiritClient.getGenesisCohort();
        
        const allBadges = cohortData.agents.map(agent => ({
          handle: agent.handle,
          name: agent.displayName || agent.handle?.toUpperCase(),
          isDeployed: !!agent.tokenAddress,
          tokenAddress: agent.tokenAddress,
          badgeStatus: agent.tokenAddress ? 'ONCHAIN' : 'OFFCHAIN',
          badgeColor: agent.tokenAddress ? 'green' : 'yellow',
          shouldShowBadge: flagStatus.onchainBadges
        }));
        
        const summary = {
          totalAgents: allBadges.length,
          onchainAgents: allBadges.filter(a => a.isDeployed).length,
          offchainAgents: allBadges.filter(a => !a.isDeployed).length,
          badgesEnabled: flagStatus.onchainBadges
        };
        
        return NextResponse.json({
          timestamp: new Date().toISOString(),
          flagStatus,
          summary,
          allBadges,
          recommendations: [
            flagStatus.onchainBadges ? 'Badges enabled and working' : 'Enable ENABLE_ONCHAIN_BADGES flag to show badges',
            `${summary.onchainAgents} agents ready for onchain verification`,
            `${summary.offchainAgents} agents will show OFFCHAIN status`,
            'Badge display degrades gracefully if spirit-registry unavailable'
          ],
          success: true
        });
        
      } catch (error) {
        console.error('[BadgeTest] Spirit registry error:', error);
        return NextResponse.json({
          timestamp: new Date().toISOString(),
          flagStatus,
          error: error instanceof Error ? error.message : 'Spirit registry unavailable',
          fallbackBehavior: 'All agents show without badges (graceful degradation)',
          recommendations: [
            'Check spirit-registry service health',
            'Verify network connectivity',
            'Consider using cached onchain data',
            'Badge failures should not break agent display'
          ],
          success: false
        }, { status: 500 });
      }
    }
    
  } catch (error) {
    console.error('[BadgeTest] Test endpoint failed:', error);
    
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
      success: false
    }, { status: 500 });
  }
}