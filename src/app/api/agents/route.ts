import { NextRequest, NextResponse } from 'next/server';
import { registryApi } from '@/lib/generated-sdk';

// Simple in-memory cache
let apiCache: { data: any; timestamp: number } | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// GET /api/agents - List all agents with latest work and status
// ADR COMPLIANCE: Use Registry SDK instead of direct Supabase access
export async function GET(request: NextRequest) {
  try {
    // Check cache first
    const now = Date.now();
    if (apiCache && (now - apiCache.timestamp) < CACHE_DURATION) {
      console.log('API /agents: Returning cached data');
      return NextResponse.json(apiCache.data);
    }
    
    console.log('API /agents: Fetching from Registry SDK...');
    const startTime = Date.now();
    
    // Use Registry SDK - ADR compliance
    const agents = await registryApi.getAgents({
      include: ['profile', 'creations']
    });
    
    const duration = Date.now() - startTime;
    
    console.log('API /agents: Registry data received:', { 
      agentCount: agents?.length || 0,
      duration: duration + 'ms'
    });
    
    // Transform Registry data to Academy API format
    const agentsWithWork = (agents || []).map(agent => ({
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

    const result = {
      agents: agentsWithWork,
      count: agentsWithWork.length
    };
    
    // Cache the result
    apiCache = { data: result, timestamp: now };

    return NextResponse.json(result);
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