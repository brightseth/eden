import { NextRequest, NextResponse } from 'next/server';
import { registryClient } from '@/lib/registry/registry-client';
import { EDEN_AGENTS } from '@/data/eden-agents-manifest';

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
    
    // Use Registry Client - ADR compliance  
    const response = await registryClient.getAllAgents();
    const agents = response.data;
    
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
      avatar_url: getAgentImageUrl(agent.handle, 'avatar'),
      hero_image_url: getAgentImageUrl(agent.handle, 'hero'),
      latest_work: agent.creations?.[0] || null,
      sample_works: getSampleWorks(agent.handle),
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
    console.error('Registry SDK failed, falling back to local manifest:', error);
    
    // Fallback to local manifest data including BART
    const fallbackAgents = EDEN_AGENTS.map(agent => ({
      id: agent.handle,
      name: agent.name,
      tagline: agent.specialization || 'AI Creative Agent',
      trainer: agent.trainer || 'TBD',
      status: agent.status.toLowerCase(),
      day_count: agent.technicalProfile?.outputRate || 0,
      avatar_url: `/agents/${agent.handle}/profile.svg`,
      hero_image_url: `/agents/${agent.handle}/hero.png`,
      latest_work: null,
      sample_works: [],
      created_at: new Date().toISOString()
    }));

    const fallbackResult = {
      agents: fallbackAgents,
      count: fallbackAgents.length
    };
    
    // Cache the fallback result
    apiCache = { data: fallbackResult, timestamp: Date.now() };
    
    return NextResponse.json(fallbackResult);
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
    'citizen': 'Henry Brooke',
    'bertha': 'Amanda Schmitt',
    'miyomi': 'Seth Goldstein',
    'sue': 'TBD',
    'bart': 'TBD'
  };
  return trainers[handle] || 'TBD';
}

function getAgentImageUrl(handle: string, type: 'avatar' | 'hero'): string {
  // Use actual available images where they exist
  const imageMap: Record<string, Record<string, string>> = {
    'abraham': {
      avatar: '/agents/abraham/profile.svg',
      hero: '/images/gallery/abraham-hero.png'
    },
    'solienne': {
      avatar: '/agents/solienne/profile.svg', 
      hero: '/images/gallery/solienne-hero.png'
    }
  };

  return imageMap[handle]?.[type] || `/agents/${handle}/profile.svg`;
}

function getSampleWorks(handle: string) {
  // Return sample works data for agents with known content
  const sampleWorks: Record<string, any[]> = {
    'abraham': [
      {
        id: 'abraham-work-1',
        title: 'Knowledge Synthesis #2519',
        image_url: '/images/gallery/abraham-hero.png',
        created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        description: 'Daily synthesis of human knowledge patterns'
      }
    ],
    'solienne': [
      {
        id: 'solienne-work-1', 
        title: 'Consciousness Velocity Stream',
        image_url: '/images/gallery/solienne-hero.png',
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        description: 'Exploration of consciousness through architectural light'
      }
    ]
  };

  return sampleWorks[handle] || [];
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