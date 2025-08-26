import { NextRequest, NextResponse } from 'next/server';
import { registryApi } from '@/lib/generated-sdk';

// GET /api/agents/[id] - Get agent with all works
// ADR COMPLIANCE: Use Registry SDK instead of direct Supabase access
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    
    console.log(`API /agents/${id}: Fetching from Registry SDK...`);
    
    // Use Registry SDK - ADR compliance
    const agent = await registryApi.getAgent(id.toLowerCase(), ['profile', 'creations']);
    
    if (!agent) {
      return NextResponse.json(
        { error: 'Agent not found in Registry' },
        { status: 404 }
      );
    }

    console.log(`API /agents/${id}: Registry data received:`, { 
      agentFound: !!agent,
      creationsCount: agent.creations?.length || 0
    });
    
    // Transform Registry data to Academy API format
    const transformedAgent = {
      id: agent.handle,
      name: agent.displayName,
      tagline: agent.profile?.statement || 'AI Creative Agent',
      trainer: getTrainerName(agent.handle),
      status: mapRegistryStatus(agent.status),
      day_count: agent.counts?.creations || 0,
      avatar_url: `/agents/${agent.handle}/profile.svg`,
      works: agent.creations || [],
      spirit: null, // Registry doesn't track spirit graduation yet
      work_count: agent.counts?.creations || 0,
      created_at: agent.createdAt,
      updated_at: agent.updatedAt
    };

    return NextResponse.json(transformedAgent);
  } catch (error) {
    console.error('Registry SDK failed:', error);
    return NextResponse.json(
      { error: 'Registry unavailable - no fallback data available' },
      { status: 503 }
    );
  }
}

// Helper functions for data transformation
function mapRegistryStatus(status: string): string {
  if (status === 'ACTIVE') return 'active';
  if (status === 'ONBOARDING') return 'training';
  return 'developing';
}

function getTrainerName(handle: string): string {
  const trainers: Record<string, string> = {
    'abraham': 'Gene Kogan',
    'solienne': 'Kristi Coronado',
    'geppetto': 'Martin & Colin (Lattice)',
    'koru': 'Xander',
    'citizen': 'TBD',
    'miyomi': 'TBD',
    'nina': 'TBD',
    'amanda': 'TBD'
  };
  return trainers[handle] || 'TBD';
}

// PATCH /api/agents/[id] - Update agent (mainly for status changes)
// ADR COMPLIANCE: Agent updates should go through Registry
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  return NextResponse.json(
    { 
      error: 'Agent updates must go through Registry API',
      message: 'Use Registry endpoints for agent management operations',
      registryEndpoint: `/api/v1/agents/${(await context.params).id}` 
    },
    { status: 501 }
  );
}