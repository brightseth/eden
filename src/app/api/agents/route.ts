import { NextRequest, NextResponse } from 'next/server';
import { registryApi } from '@/lib/generated-sdk';

// GET /api/agents - List all agents with latest work and status
// ADR COMPLIANCE: Use Registry SDK instead of direct Supabase access
export async function GET(request: NextRequest) {
  try {
    console.log('API /agents: Fetching from Registry SDK...');
    
    // Use Registry SDK - ADR compliance
    const agents = await registryApi.getAgents({
      include: ['profile', 'creations']
    });
    
    console.log('API /agents: Registry data received:', { 
      agentCount: agents?.length || 0
    });
    
    // Transform Registry data to Academy API format
    const agentsWithWork = agents.map(agent => ({
      id: agent.handle,
      name: agent.displayName,
      tagline: agent.profile?.statement || 'AI Creative Agent',
      trainer: getTrainerName(agent.handle), // Static mapping until Registry has trainer data
      status: mapRegistryStatus(agent.status),
      day_count: agent.counts?.creations || 0,
      avatar_url: `/agents/${agent.handle}/profile.svg`,
      latest_work: agent.creations?.[0] || null,
      created_at: agent.createdAt
    }));

    return NextResponse.json({
      agents: agentsWithWork,
      count: agentsWithWork.length
    });
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

// POST /api/agents - Create new agent
// ADR COMPLIANCE: Agent creation should go through Registry
export async function POST(request: NextRequest) {
  return NextResponse.json(
    { 
      error: 'Agent creation must go through Registry API',
      message: 'Use Registry endpoints for agent management operations',
      registryEndpoint: '/api/v1/agents' 
    },
    { status: 501 }
  );
}