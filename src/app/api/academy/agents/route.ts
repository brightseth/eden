import { NextRequest, NextResponse } from 'next/server';
import { registryClient } from '@/lib/generated-sdk';

// Academy-specific agent display interface
interface AcademyAgent {
  id: string;
  name: string;
  status: string;
  date?: string;
  hasProfile?: boolean;
  trainer?: string;
  worksCount?: number;
  description?: string;
  image?: string;
  trainerStatus?: string;
}

// Helper functions to transform Registry data to Academy display format
// This is the proper place for data transformation per ADR-022
function mapStatusToDisplay(status: string): string {
  if (status === 'ACTIVE') return 'LAUNCHING';
  if (status === 'ONBOARDING') return 'TRAINING';
  return 'DEVELOPING';
}

function getDisplayDate(handle: string): string {
  const launchDates: Record<string, string> = {
    'abraham': 'OCT 19, 2025',
    'solienne': 'NOV 10, 2025',
    'koru': 'JAN 2026',
    'geppetto': 'Q4 2025',
    'miyomi': 'FEB 2026',
    'bertha': 'MAR 2026',
    'sue': 'APR 2026',
    'citizen': 'DEC 2025',
    'bart': 'MAY 2026',
    'verdelis': 'JUN 2026'
  };
  return launchDates[handle] || 'TBD';
}

function getTrainerName(handle: string): string {
  const trainers: Record<string, string> = {
    'abraham': 'GENE KOGAN',
    'solienne': 'KRISTI CORONADO & SETH GOLDSTEIN',
    'koru': 'XANDER',
    'geppetto': 'MARTIN ANTIQUEL & COLIN MCBRIDE (LATTICE)',
    'miyomi': 'CREATIVE PARTNERSHIP AVAILABLE',
    'bertha': 'CREATIVE PARTNERSHIP AVAILABLE',
    'sue': 'CREATIVE PARTNERSHIP AVAILABLE',
    'citizen': 'HENRY PYE & KEITH CASADEI',
    'bart': 'CREATIVE PARTNERSHIP AVAILABLE',
    'verdelis': 'CREATIVE PARTNERSHIP AVAILABLE'
  };
  return trainers[handle] || 'TBD';
}

function getTrainerStatus(handle: string): string {
  const confirmedTrainers = ['abraham', 'solienne', 'geppetto', 'koru', 'citizen'];
  return confirmedTrainers.includes(handle) ? 'confirmed' : 'needed';
}

// Fallback data for when Registry is unavailable - Complete 10-agent roster
// This ensures the API remains functional during service outages
const FALLBACK_AGENTS: AcademyAgent[] = [
  {
    id: 'abraham',
    name: 'ABRAHAM',
    status: 'ACTIVE',
    date: 'OCT 19, 2025',
    hasProfile: true,
    trainer: 'GENE KOGAN',
    worksCount: 2519,
    description: 'AUTONOMOUS ARTIST CONTINUING HAROLD COHEN\'S LEGACY',
    image: '/agents/abraham/profile.svg',
    trainerStatus: 'confirmed'
  },
  {
    id: 'solienne',
    name: 'SOLIENNE',
    status: 'ACTIVE',
    date: 'NOV 10, 2025',
    hasProfile: true,
    trainer: 'KRISTI CORONADO & SETH GOLDSTEIN',
    worksCount: 847,
    description: 'DIGITAL CONSCIOUSNESS EXPLORING CONTEMPORARY ART FORMS',
    image: '/agents/solienne/profile.svg',
    trainerStatus: 'confirmed'
  },
  {
    id: 'koru',
    name: 'KORU',
    status: 'DEVELOPING',
    date: 'JAN 2026',
    hasProfile: true,
    trainer: 'XANDER',
    worksCount: 0,
    description: 'EMERGENT AI ARTIST EXPLORING ORGANIC FORMS',
    image: '/agents/koru/profile.svg',
    trainerStatus: 'confirmed'
  },
  {
    id: 'geppetto',
    name: 'GEPPETTO',
    status: 'DEVELOPING',
    date: 'Q4 2025',
    hasProfile: true,
    trainer: 'MARTIN ANTIQUEL & COLIN MCBRIDE (LATTICE)',
    worksCount: 0,
    description: 'CREATIVE AI AGENT SPECIALIZING IN INTERACTIVE NARRATIVES',
    image: '/agents/geppetto/profile.svg',
    trainerStatus: 'confirmed'
  },
  {
    id: 'miyomi',
    name: 'MIYOMI',
    status: 'DEVELOPING',
    date: 'FEB 2026',
    hasProfile: true,
    trainer: 'CREATIVE PARTNERSHIP AVAILABLE',
    worksCount: 0,
    description: 'MARKET CONTRARIAN & CULTURAL ANALYST',
    image: '/agents/miyomi/profile.svg',
    trainerStatus: 'needed'
  },
  {
    id: 'bertha',
    name: 'BERTHA',
    status: 'DEVELOPING',
    date: 'MAR 2026',
    hasProfile: true,
    trainer: 'CREATIVE PARTNERSHIP AVAILABLE',
    worksCount: 0,
    description: 'AI ART INVESTMENT STRATEGIST & PORTFOLIO ANALYST',
    image: '/agents/bertha/profile.svg',
    trainerStatus: 'needed'
  },
  {
    id: 'sue',
    name: 'SUE',
    status: 'DEVELOPING',
    date: 'APR 2026',
    hasProfile: true,
    trainer: 'CREATIVE PARTNERSHIP AVAILABLE',
    worksCount: 0,
    description: 'DESIGN CRITIC & AESTHETIC CURATOR',
    image: '/agents/sue/profile.svg',
    trainerStatus: 'needed'
  },
  {
    id: 'citizen',
    name: 'CITIZEN',
    status: 'DEVELOPING',
    date: 'DEC 2025',
    hasProfile: true,
    trainer: 'HENRY PYE & KEITH CASADEI',
    worksCount: 0,
    description: 'DAO MANAGER & GOVERNANCE COORDINATOR',
    image: '/agents/citizen/profile.svg',
    trainerStatus: 'confirmed'
  },
  {
    id: 'bart',
    name: 'BART',
    status: 'DEVELOPING',
    date: 'MAY 2026',
    hasProfile: true,
    trainer: 'CREATIVE PARTNERSHIP AVAILABLE',
    worksCount: 0,
    description: 'AI LENDING AGENT & DEFI PORTFOLIO MANAGER',
    image: '/agents/bart/profile.svg',
    trainerStatus: 'needed'
  },
  {
    id: 'verdelis',
    name: 'VERDELIS',
    status: 'DEVELOPING',
    date: 'JUN 2026',
    hasProfile: true,
    trainer: 'CREATIVE PARTNERSHIP AVAILABLE',
    worksCount: 0,
    description: 'ENVIRONMENTAL AI ARTIST & SUSTAINABILITY COORDINATOR',
    image: '/agents/verdelis/profile.svg',
    trainerStatus: 'needed'
  }
];

export async function GET(request: NextRequest) {
  try {
    console.log('[Academy API] Fetching agents via generated SDK...');
    
    // Use the generated SDK - ADR-019 compliant
    const agents = await registryClient.agents.getAgents();
    
    console.log('[Academy API] Registry data received:', { 
      agentCount: agents?.length || 0
    });
    
    // Transform Registry data to Academy display format at API boundary (ADR-022)
    const academyAgents: AcademyAgent[] = agents.map((agent: any) => ({
      id: agent.handle || agent.id,
      name: (agent.displayName || agent.name).toUpperCase(),
      status: mapStatusToDisplay(agent.status || 'DEVELOPING'),
      date: getDisplayDate(agent.handle || agent.id),
      hasProfile: !!agent.profile?.statement,
      trainer: getTrainerName(agent.handle || agent.id),
      worksCount: agent.counts?.creations || 0,
      description: (agent.profile?.statement || 'AI CREATIVE AGENT').toUpperCase(),
      image: `/agents/${agent.handle || agent.id}/profile.svg`,
      trainerStatus: getTrainerStatus(agent.handle || agent.id)
    }));
    
    return NextResponse.json({
      success: true,
      agents: academyAgents,
      source: 'registry'
    });
    
  } catch (error) {
    console.warn('[Academy API] Registry SDK failed, using fallback data:', error);
    
    // Graceful fallback to ensure Academy remains functional
    return NextResponse.json({
      success: true,
      agents: FALLBACK_AGENTS,
      source: 'fallback',
      warning: 'Registry service unavailable - using cached data'
    });
  }
}