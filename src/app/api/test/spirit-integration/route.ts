// Test endpoint for spirit-registry integration
// Allows testing of data reconciliation in development

import { NextRequest, NextResponse } from 'next/server';
import { dataReconciliation } from '@/lib/registry/data-reconciliation';
import { spiritClient } from '@/lib/registry/spirit-client';
import { migrationService } from '@/lib/registry/migration-service';
import { featureFlags, FLAGS } from '@/config/flags';

export async function GET(request: NextRequest) {
  try {
    console.log('[Test] Testing spirit-registry integration...');

    // Health check for Spirit Registry
    const spiritHealth = await spiritClient.healthCheck();
    console.log('[Test] Spirit Registry health:', spiritHealth);

    // Test data reconciliation
    let reconciliationResult = null;
    let registryAgents = null;

    if (featureFlags.isEnabled(FLAGS.ENABLE_DATA_RECONCILIATION)) {
      console.log('[Test] Data reconciliation enabled, testing...');
      
      // Get agents through migration service (includes reconciliation)
      registryAgents = await migrationService.getAgents({ cohort: 'genesis' });
      
      // Get reconciliation stats
      const stats = dataReconciliation.getStats();
      
      reconciliationResult = {
        agentCount: Array.isArray(registryAgents) ? registryAgents.length : 0,
        stats,
        sampleAgent: Array.isArray(registryAgents) && registryAgents.length > 0 
          ? {
              id: registryAgents[0].id,
              name: registryAgents[0].displayName,
              hasOnchainData: !!(registryAgents[0] as any).onchain,
              dataSource: (registryAgents[0] as any).dataSource
            }
          : null
      };
    } else {
      console.log('[Test] Data reconciliation disabled');
    }

    // Test direct Spirit Registry call
    let spiritData = null;
    try {
      const spiritResponse = await spiritClient.getGenesisCohort();
      spiritData = {
        agentCount: spiritResponse.agents.length,
        meta: spiritResponse.meta,
        sampleAgent: spiritResponse.agents.length > 0 
          ? {
              id: spiritResponse.agents[0].id,
              name: spiritResponse.agents[0].name,
              hasOnchain: !!spiritResponse.agents[0].onchain,
              onchainData: spiritResponse.agents[0].onchain
            }
          : null
      };
    } catch (error) {
      console.warn('[Test] Spirit Registry direct call failed:', error);
      spiritData = { error: error instanceof Error ? error.message : 'Unknown error' };
    }

    // Feature flag status
    const flagStatus = {
      ENABLE_SPIRIT_REGISTRY: featureFlags.isEnabled(FLAGS.ENABLE_SPIRIT_REGISTRY),
      ENABLE_DATA_RECONCILIATION: featureFlags.isEnabled(FLAGS.ENABLE_DATA_RECONCILIATION),
      ENABLE_ONCHAIN_BADGES: featureFlags.isEnabled(FLAGS.ENABLE_ONCHAIN_BADGES),
    };

    const response = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      spiritRegistryHealth: spiritHealth,
      spiritRegistryData: spiritData,
      dataReconciliation: reconciliationResult,
      featureFlags: flagStatus,
      success: true
    };

    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    console.error('[Test] Spirit integration test failed:', error);
    
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
      success: false
    }, { status: 500 });
  }
}

// Enable CORS for development testing
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}