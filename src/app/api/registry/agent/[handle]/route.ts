import { NextRequest, NextResponse } from 'next/server';
import { registryApi } from '@/lib/generated-sdk';

// GET /api/registry/agent/[handle] - Get agent data from Registry for artist pages
// This powers CRIT integration and artist page access
export async function GET(
  request: NextRequest,
  { params }: any) {
  try {
  const { handle } = params;
    
    console.log(`[CRIT] Fetching agent ${handle} from Registry...`);
    
    // Use Registry SDK - ADR compliance
    // Try individual agent endpoint first, fallback to agents list if needed
    let agent;
    try {
      agent = await registryApi.getAgent(handle.toLowerCase(), [
        'profile', 
        'creations', 
        'personas'
      ]);
    } catch (individualError) {
      console.log(`[CRIT] Individual agent endpoint failed, trying agents list...`);
      
      // Fallback: get from agents list (this endpoint works without filters)
      const allAgents = await registryApi.getAgents();
      
      // Filter client-side since query params cause 500 errors
      const agents = allAgents.filter(a => 
        a.cohort === 'genesis' && 
        a.status === 'ACTIVE'
      );
      
      agent = agents.find(a => a.handle.toLowerCase() === handle.toLowerCase());
      
      if (!agent) {
        throw new Error(`Agent '${handle}' not found in Registry agents list`);
      }
    }
    
    if (!agent) {
      return NextResponse.json(
        { error: `Agent '${handle}' not found in Registry` },
        { status: 404 }
      );
    }

    console.log(`[CRIT] Registry data for ${handle}:`, { 
      agentFound: !!agent,
      creationsCount: agent.creations?.length || 0,
      hasProfile: !!agent.profile
    });
    
    // Transform Registry data for artist pages
    const artistData = {
      // Basic agent info
      id: agent.handle,
      name: agent.displayName,
      handle: agent.handle,
      status: agent.status,
      cohort: agent.cohortId,
      
      // Profile data
      profile: {
        statement: agent.profile?.statement,
        manifesto: agent.profile?.manifesto,
        tags: agent.profile?.tags || [],
        links: agent.profile?.links || {}
      },
      
      // Works/Creations data
      works: (agent.creations || []).map(creation => ({
        id: creation.id,
        title: creation.title,
        mediaUri: creation.mediaUri,
        status: creation.status,
        createdAt: creation.createdAt,
        updatedAt: creation.updatedAt,
        metadata: creation.metadata || {}
      })),
      
      // Personas data
      personas: (agent.personas || []).map(persona => ({
        id: persona.id,
        name: persona.name,
        version: persona.version,
        prompt: persona.prompt,
        privacy: persona.privacy,
        alignmentNotes: persona.alignmentNotes
      })),
      
      // Counts
      counts: agent.counts || {
        creations: 0,
        personas: 0,
        artifacts: 0
      },
      
      // Metadata
      createdAt: agent.createdAt,
      updatedAt: agent.updatedAt,
      
      // CRIT integration data
      crit: {
        // Nina critique compatibility
        eligibleForCritique: agent.status === 'ACTIVE' && (agent.counts?.creations || 0) > 0,
        
        // Artist page compatibility  
        hasPublicProfile: agent.visibility === 'PUBLIC',
        hasWorks: (agent.counts?.creations || 0) > 0,
        
        // Registry metadata
        registrySource: 'eden-genesis-registry',
        lastSync: new Date().toISOString()
      }
    };

    return NextResponse.json(artistData, {
      headers: {
        // Enable CORS for CRIT integration
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        
        // Cache for 5 minutes to reduce Registry load
        'Cache-Control': 'public, max-age=300, s-maxage=300'
      }
    });
    
  } catch (error) {
    console.error(`[CRIT] Registry SDK failed for ${(params).handle}:`, error);
    
    return NextResponse.json(
      { 
        error: 'Registry unavailable',
        message: 'Artist data temporarily unavailable - Registry integration required',
        handle: (params).handle,
        registryRequired: true
      },
      { 
        status: 503,
        headers: {
          // Still enable CORS even for errors
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
      }
    );
  }
}

// OPTIONS for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }
  });
}