import { NextRequest, NextResponse } from 'next/server';
import { bartGondiService } from '@/lib/agents/bart-gondi-integration';
import { bartRiskManager } from '@/lib/agents/bart-risk-manager';

export async function GET(request: NextRequest) {
  try {
    const gondiStatus = bartGondiService.getStatus();
    const riskStatus = bartRiskManager.getStatus();

    // Determine overall system mode
    const systemMode = gondiStatus.mockMode ? 'MOCK' : riskStatus.dryRunEnabled ? 'DRY-RUN' : 'LIVE';
    
    const statusResponse = {
      bartSystem: {
        status: 'operational',
        mode: systemMode,
        version: '1.0.0',
        description: 'Renaissance Banking AI for NFT Lending'
      },

      gondiIntegration: {
        connected: gondiStatus.initialized,
        mode: gondiStatus.mockMode ? 'mock' : 'live',
        environment: gondiStatus.environment,
        canMakeOffers: gondiStatus.hasPrivateKey && gondiStatus.initialized
      },

      riskManagement: {
        policyVersion: riskStatus.policyVersion,
        dryRunEnabled: riskStatus.dryRunEnabled,
        globalDryRun: riskStatus.globalDryRun,
        supportedCollections: riskStatus.supportedCollections,
        reserveRatio: riskStatus.reserveRatio,
        maxDailyVolume: riskStatus.maxDailyVolume
      },

      capabilities: {
        nftEvaluation: true,
        collectionOffers: true,
        singleNftOffers: gondiStatus.initialized,
        riskAssessment: true,
        dryRunSimulation: true,
        renaissanceBankingWisdom: true
      },

      environmentCheck: {
        gondiPrivateKey: gondiStatus.hasPrivateKey,
        ethereumRpc: gondiStatus.environment.ethereumRpc,
        alchemyKey: gondiStatus.environment.alchemyKey,
        rpcEndpoint: gondiStatus.environment.rpcEndpoint
      },

      operationalReadiness: {
        mockMode: systemMode === 'MOCK',
        dryRunMode: systemMode === 'DRY-RUN',
        liveMode: systemMode === 'LIVE',
        canEvaluate: true,
        canSimulate: true,
        canTransact: systemMode === 'LIVE'
      }
    };

    return NextResponse.json(statusResponse);

  } catch (error) {
    console.error('[BART Status API] Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to get BART system status',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, value } = body;

    switch (action) {
      case 'toggle_dry_run':
        bartRiskManager.setDryRun(value === true);
        return NextResponse.json({ 
          success: true, 
          message: `Dry run mode ${value ? 'enabled' : 'disabled'}` 
        });

      case 'reload_policy':
        bartRiskManager.reloadPolicy();
        return NextResponse.json({ 
          success: true, 
          message: 'Risk policy reloaded successfully' 
        });

      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('[BART Status API] Action error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to execute action',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}