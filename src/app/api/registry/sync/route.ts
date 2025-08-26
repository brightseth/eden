import { NextRequest, NextResponse } from 'next/server';
import { liveRegistrySync } from '@/lib/registry/live-sync';

// GET /api/registry/sync - Get live data from Registry
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const force = searchParams.get('force') === 'true';

    // Get live agents from Registry
    const registryAgents = force 
      ? await liveRegistrySync.forceSync()
      : await liveRegistrySync.fetchLiveAgents();

    // Transform to Academy format
    const academyAgents = registryAgents.map(agent => 
      liveRegistrySync.transformToAcademyFormat(agent)
    );

    // Get sync status
    const syncStatus = liveRegistrySync.getSyncStatus();

    return NextResponse.json({
      success: true,
      data: {
        agents: academyAgents,
        registry: {
          totalAgents: registryAgents.length,
          activeAgents: registryAgents.filter(a => a.status === 'ACTIVE').length,
          withCreations: registryAgents.filter(a => a.counts.creations > 0).length,
          lastUpdated: Math.max(...registryAgents.map(a => new Date(a.updatedAt).getTime()))
        },
        sync: {
          ...syncStatus,
          syncedAt: new Date().toISOString(),
          method: force ? 'force' : 'cached'
        }
      },
      meta: {
        source: 'eden-genesis-registry',
        version: '1.0',
        cached: !force && syncStatus.cacheValid
      }
    });

  } catch (error) {
    console.error('[Registry Sync API] Error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Registry sync failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      fallback: 'Using static manifest data'
    }, { status: 500 });
  }
}

// POST /api/registry/sync - Force sync and update
export async function POST(request: NextRequest) {
  try {
    console.log('[Registry Sync API] Force sync requested');
    
    // Force refresh from Registry
    const registryAgents = await liveRegistrySync.forceSync();
    
    // Get creation counts for each agent
    const agentsWithCreations = await Promise.all(
      registryAgents.map(async (agent) => {
        try {
          const creations = await liveRegistrySync.fetchAgentCreations(agent.id);
          return {
            ...agent,
            creations: creations.length,
            latestCreation: creations[0]?.createdAt || null
          };
        } catch (error) {
          console.warn(`[Registry Sync] Failed to fetch creations for ${agent.handle}`);
          return { ...agent, creations: 0, latestCreation: null };
        }
      })
    );

    return NextResponse.json({
      success: true,
      message: 'Registry sync completed successfully',
      data: {
        synced: agentsWithCreations.length,
        active: agentsWithCreations.filter(a => a.status === 'ACTIVE').length,
        withWorks: agentsWithCreations.filter(a => a.creations > 0).length,
        totalWorks: agentsWithCreations.reduce((sum, a) => sum + a.creations, 0),
        lastSync: new Date().toISOString()
      },
      agents: agentsWithCreations.map(agent => ({
        handle: agent.handle,
        displayName: agent.displayName,
        status: agent.status,
        works: agent.creations,
        specialization: agent.profile.links.specialty.description
      }))
    });

  } catch (error) {
    console.error('[Registry Sync API] Force sync failed:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Force sync failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}