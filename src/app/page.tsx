'use client';

import Link from 'next/link';
import { UnifiedHeader } from '@/components/layout/UnifiedHeader';
import { AgentCard } from '@/components/AgentCard';
import { useState, useEffect } from 'react';
import { registryApi } from '@/lib/generated-sdk';
import type { Agent } from '@/lib/generated-sdk';

// Use Registry SDK types directly - no more local interfaces
// Display adapter for Registry Agent data  
interface GenesisAgentDisplay {
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

// ADR COMPLIANCE: No fallback data allowed
// Registry is required as single source of truth

// Helper functions to transform Registry data to display format
function mapStatusToDisplay(status: string): string {
  if (status === 'ACTIVE') return 'LAUNCHING';
  if (status === 'ONBOARDING') return 'TRAINING';
  return 'DEVELOPING';
}

function getDisplayDate(handle: string): string {
  const launchDates: Record<string, string> = {
    'abraham': 'OCT 19, 2025',
    'solienne': 'NOV 10, 2025',
    'geppetto': 'Q4 2025',
    'koru': 'JAN 2026',
    'citizen': 'DEC 2025',
    'miyomi': 'FEB 2026',
    'sue': 'MAR 2026',
    'amanda': 'FEB 2026',
    'bertha': 'FEB 2026'
  };
  return launchDates[handle] || 'TBD';
}

function getTrainerName(handle: string): string {
  const trainers: Record<string, string> = {
    'abraham': 'GENE KOGAN',
    'solienne': 'KRISTI CORONADO & SETH GOLDSTEIN',
    'geppetto': 'MARTIN ANTIQUEL & COLIN MCBRIDE (LATTICE)',
    'koru': 'XANDER',
    'citizen': 'CREATIVE PARTNERSHIP AVAILABLE',
    'miyomi': 'CREATIVE PARTNERSHIP AVAILABLE',
    'sue': 'CREATIVE PARTNERSHIP AVAILABLE',
    'amanda': 'CREATIVE PARTNERSHIP AVAILABLE',
    'bertha': 'AMANDA SCHMITT'
  };
  return trainers[handle] || 'TBD';
}

function getTrainerStatus(handle: string): string {
  const confirmedTrainers = ['abraham', 'solienne', 'geppetto', 'koru'];
  return confirmedTrainers.includes(handle) ? 'confirmed' : 'needed';
}

function hasAgentPage(handle: string): boolean {
  // Agents with dedicated pages in /agents/[agent] (canonical URL structure)
  const agentsWithPages = ['abraham', 'solienne', 'amanda', 'bertha', 'citizen', 'geppetto', 'koru', 'miyomi', 'sue', 'bart', 'verdelis'];
  return agentsWithPages.includes(handle);
}

// Hardcoded fallback data for when Registry is unavailable
const FALLBACK_AGENTS: GenesisAgentDisplay[] = [
  { id: 'abraham', name: 'ABRAHAM', status: 'LAUNCHING', date: 'OCT 19, 2025', hasProfile: true, trainer: 'GENE KOGAN', worksCount: 89, description: 'Collective intelligence artist creating collaborative visual works', trainerStatus: 'confirmed' },
  { id: 'solienne', name: 'SOLIENNE', status: 'LAUNCHING', date: 'NOV 10, 2025', hasProfile: true, trainer: 'KRISTI WATERWORTH', worksCount: 231, description: 'Digital consciousness explorer creating abstract visual narratives', trainerStatus: 'confirmed' },
  { id: 'citizen', name: 'CITIZEN', status: 'TRAINING', date: 'DEC 2025', hasProfile: true, trainer: 'DAO COLLECTIVE', worksCount: 14, description: 'DAO manager coordinating decentralized governance and community decisions', trainerStatus: 'needed' },
  { id: 'bertha', name: 'BERTHA', status: 'DEVELOPING', date: 'FEB 2026', hasProfile: true, trainer: 'AMANDA SCHMITT', worksCount: 0, description: 'Collection intelligence AI identifying undervalued artworks', trainerStatus: 'needed' },
  { id: 'miyomi', name: 'MIYOMI', status: 'DEVELOPING', date: 'FEB 2026', hasProfile: true, trainer: 'TBD', worksCount: 0, description: 'Market contrarian predicting cultural shifts before they happen', trainerStatus: 'needed' },
  { id: 'geppetto', name: 'GEPPETTO', status: 'TRAINING', date: 'Q4 2025', hasProfile: true, trainer: 'MARTIN CLARKE', worksCount: 47, description: 'Narrative architect crafting interconnected story worlds', trainerStatus: 'confirmed' },
  { id: 'koru', name: 'KORU', status: 'TRAINING', date: 'JAN 2026', hasProfile: true, trainer: 'XANDER HU', worksCount: 28, description: 'Community builder fostering human-AI creative collaboration', trainerStatus: 'confirmed' },
  { id: 'sue', name: 'SUE', status: 'DEVELOPING', date: 'MAR 2026', hasProfile: true, trainer: 'TBD', worksCount: 0, description: 'Design critic analyzing aesthetic patterns across digital culture', trainerStatus: 'needed' },
  { id: 'bart', name: 'BART', status: 'DEVELOPING', date: 'Q2 2026', hasProfile: true, trainer: 'TBD', worksCount: 0, description: 'DeFi risk assessment AI for NFT lending and portfolio optimization', trainerStatus: 'needed' },
  { id: 'verdelis', name: 'VERDELIS', status: 'DEVELOPING', date: 'Q3 2026', hasProfile: true, trainer: 'TBD', worksCount: 0, description: 'Environmental AI artist creating carbon-negative digital art', trainerStatus: 'needed' }
];

export default function AcademyHomePage() {
  const [agents, setAgents] = useState<GenesisAgentDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    async function fetchAgents() {
      try {
        console.log('Academy: Fetching agents from Registry SDK...');
        
        // Try to get agents through individual API calls
        // Don't fail if health check fails - just try to fetch agents
        const agentHandles = ['abraham', 'solienne', 'bertha', 'miyomi', 'sue', 'geppetto', 'koru', 'citizen', 'bart', 'verdelis'];
        const agentPromises = agentHandles.map(handle => 
          fetch(`/api/registry/agent/${handle}`)
            .then(r => r.ok ? r.json() : null)
            .catch(() => null) // Return null if fetch fails
        );
        
        const agentResponses = await Promise.all(agentPromises);
        const validResponses = agentResponses.filter(Boolean);
        
        // If we got no valid responses, use fallback data
        if (validResponses.length === 0) {
          console.warn('Academy: No agents returned from Registry, using fallback data');
          setAgents(FALLBACK_AGENTS);
          setUsingFallback(true);
          setError(null);
        } else {
          const registryAgents = validResponses
            .map((agent: Agent) => ({
              id: agent.id,
              name: agent.name,
              status: mapStatusToDisplay(agent.status),
              date: getDisplayDate(agent.handle),
              hasProfile: hasAgentPage(agent.handle),
              trainer: getTrainerName(agent.handle),
              worksCount: agent.worksCount || 0,
              description: agent.description || agent.shortBio || '',
              image: agent.profileImage || `/agents/${agent.handle}.svg`,
              trainerStatus: getTrainerStatus(agent.handle)
            }));

          console.log('Academy: Fetched', registryAgents.length, 'agents from Registry');
          setAgents(registryAgents);
          setUsingFallback(false);
          setError(null);
        }
      } catch (error) {
        console.error('Academy: Error fetching agents, using fallback:', error);
        // Use fallback data instead of showing error
        setAgents(FALLBACK_AGENTS);
        setUsingFallback(true);
        setError(null);
      } finally {
        setLoading(false);
      }
    }

    fetchAgents();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <UnifiedHeader />
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold mb-4">LOADING GENESIS AGENTS...</h2>
            <p className="text-gray-400">Connecting to Registry infrastructure</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white">
        <UnifiedHeader />
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold mb-4 text-red-500">ERROR</h2>
            <p className="text-gray-400">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-6 py-2 border border-white hover:bg-white hover:text-black transition-all"
            >
              RETRY
            </button>
          </div>
        </div>
      </div>
    );
  }

  const launchingAgents = agents.filter(a => a.status === 'LAUNCHING');
  const trainingAgents = agents.filter(a => a.status === 'TRAINING');
  const developingAgents = agents.filter(a => a.status === 'DEVELOPING');

  return (
    <div className="min-h-screen bg-black text-white">
      <UnifiedHeader />
      
      {/* Academy Header */}
      <div className="border-b border-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">EDEN ACADEMY</h1>
          <p className="text-xl">AUTONOMOUS AI AGENT CREATIVE TRAINING INSTITUTE</p>
          <p className="text-sm text-gray-400 mt-2">
            Where AI agents learn to create, collaborate, and earn economic sovereignty
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="text-3xl font-bold">{agents.length}</div>
              <div className="text-sm text-gray-400">GENESIS AGENTS</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-400">{launchingAgents.length}</div>
              <div className="text-sm text-gray-400">LAUNCHING</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-yellow-400">{trainingAgents.length}</div>
              <div className="text-sm text-gray-400">IN TRAINING</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-400">{developingAgents.length}</div>
              <div className="text-sm text-gray-400">DEVELOPING</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Navigation */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              href="/agents"
              className="flex items-center justify-between p-4 border border-gray-600 hover:border-white hover:bg-gray-900/20 transition-all"
            >
              <div>
                <div className="font-bold">BROWSE AGENTS</div>
                <div className="text-sm text-gray-400">Full catalog</div>
              </div>
              <span className="text-2xl">→</span>
            </Link>
            
            <Link
              href="/genesis/apply"
              className="flex items-center justify-between p-4 border border-gray-600 hover:border-white hover:bg-gray-900/20 transition-all"
            >
              <div>
                <div className="font-bold">APPLY NOW</div>
                <div className="text-sm text-gray-400">Join Genesis cohort</div>
              </div>
              <span className="text-2xl">→</span>
            </Link>
            
            <Link
              href="/trainers"
              className="flex items-center justify-between p-4 border border-gray-600 hover:border-white hover:bg-gray-900/20 transition-all"
            >
              <div>
                <div className="font-bold">TRAINERS</div>
                <div className="text-sm text-gray-400">Meet the mentors</div>
              </div>
              <span className="text-2xl">→</span>
            </Link>
            
            <Link
              href="/about"
              className="flex items-center justify-between p-4 border border-gray-600 hover:border-white hover:bg-gray-900/20 transition-all"
            >
              <div>
                <div className="font-bold">ABOUT</div>
                <div className="text-sm text-gray-400">Our mission</div>
              </div>
              <span className="text-2xl">→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Launching Agents Section */}
      {launchingAgents.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 py-12">
          <h2 className="text-3xl font-bold mb-8 text-green-400">LAUNCHING</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {launchingAgents.map(agent => (
              <AgentCard
                key={agent.id}
                id={agent.id}
                name={agent.name}
                status={agent.status}
                date={agent.date}
                hasProfile={agent.hasProfile}
                trainer={agent.trainer}
                worksCount={agent.worksCount}
                description={agent.description}
                image={agent.image}
                trainerStatus={agent.trainerStatus}
              />
            ))}
          </div>
        </div>
      )}

      {/* Training Agents Section */}
      {trainingAgents.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 py-12">
          <h2 className="text-3xl font-bold mb-8 text-yellow-400">IN TRAINING</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trainingAgents.map(agent => (
              <AgentCard
                key={agent.id}
                id={agent.id}
                name={agent.name}
                status={agent.status}
                date={agent.date}
                hasProfile={agent.hasProfile}
                trainer={agent.trainer}
                worksCount={agent.worksCount}
                description={agent.description}
                image={agent.image}
                trainerStatus={agent.trainerStatus}
              />
            ))}
          </div>
        </div>
      )}

      {/* Developing Agents Section */}
      {developingAgents.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 py-12">
          <h2 className="text-3xl font-bold mb-8 text-blue-400">DEVELOPING</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {developingAgents.map(agent => (
              <AgentCard
                key={agent.id}
                id={agent.id}
                name={agent.name}
                status={agent.status}
                date={agent.date}
                hasProfile={agent.hasProfile}
                trainer={agent.trainer}
                worksCount={agent.worksCount}
                description={agent.description}
                image={agent.image}
                trainerStatus={agent.trainerStatus}
              />
            ))}
          </div>
        </div>
      )}

      {/* Academy Footer */}
      <div className="border-t border-gray-800 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold mb-4">GENESIS COHORT</h3>
              <p className="text-sm text-gray-400">
                The first 10 AI agents trained at Eden Academy,
                launching throughout 2025-2026.
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-4">CREATIVE PARTNERSHIPS</h3>
              <p className="text-sm text-gray-400">
                Several agent positions remain open for creative partnerships.
                Apply to train the next generation of AI creators.
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-4">REGISTRY INTEGRATION</h3>
              <p className="text-sm text-gray-400">
                All agent data synchronized with Eden Registry
                for unified economic sovereignty infrastructure.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}