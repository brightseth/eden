'use client';

import Link from 'next/link';
import { UnifiedHeader } from '@/components/layout/UnifiedHeader';
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
    'geppetto': 'DEC 2025',
    'koru': 'JAN 2026',
    'citizen': 'DEC 2025',
    'miyomi': 'FEB 2026',
    'nina': 'MAR 2026',
    'amanda': 'FEB 2026'
  };
  return launchDates[handle] || 'TBD';
}

function getTrainerName(handle: string): string {
  const trainers: Record<string, string> = {
    'abraham': 'GENE KOGAN',
    'solienne': 'KRISTI CORONADO & SETH GOLDSTEIN',
    'geppetto': 'MARTIN & COLIN (LATTICE)',
    'koru': 'XANDER',
    'citizen': 'CREATIVE PARTNERSHIP AVAILABLE',
    'miyomi': 'CREATIVE PARTNERSHIP AVAILABLE',
    'nina': 'CREATIVE PARTNERSHIP AVAILABLE',
    'amanda': 'CREATIVE PARTNERSHIP AVAILABLE'
  };
  return trainers[handle] || 'TBD';
}

function getTrainerStatus(handle: string): string {
  const confirmedTrainers = ['abraham', 'solienne', 'geppetto', 'koru'];
  return confirmedTrainers.includes(handle) ? 'confirmed' : 'needed';
}

export default function AcademyPage() {
  const [agents, setAgents] = useState<GenesisAgentDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAgents() {
      try {
        console.log('Academy: Fetching agents from Registry SDK...');
        
        // Use Registry SDK - ADR compliance
        const registryAgents = await registryApi.getAgents({
          cohort: 'genesis',
          status: 'ACTIVE'
        });
        
        console.log('Academy: Registry data received:', { 
          agentCount: registryAgents?.length || 0
        });
        
        // Transform Registry data to display format
        const displayAgents: GenesisAgentDisplay[] = registryAgents.map((agent: Agent) => ({
          id: agent.handle,
          name: agent.displayName.toUpperCase(),
          status: mapStatusToDisplay(agent.status),
          date: getDisplayDate(agent.handle),
          hasProfile: !!agent.profile?.statement,
          trainer: getTrainerName(agent.handle),
          worksCount: agent.counts?.creations || 0,
          description: agent.profile?.statement?.toUpperCase() || 'AI CREATIVE AGENT',
          image: `/agents/${agent.handle}/profile.svg`,
          trainerStatus: getTrainerStatus(agent.handle)
        }));
        
        setAgents(displayAgents);
        setError(null);
        
      } catch (err) {
        console.error('Registry SDK failed (no fallback available):', err);
        setError(err instanceof Error ? err.message : 'Registry unavailable');
        
        // ADR COMPLIANCE: No fallback data
        // Registry failure should be visible to user
        setAgents([]);
      } finally {
        setLoading(false);
      }
    }

    fetchAgents();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <UnifiedHeader />

      {/* Header */}
      <div className="border-b border-white">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <h1 className="text-6xl md:text-8xl font-bold mb-4">EDEN ACADEMY</h1>
          <p className="text-xl">TRAINING AUTONOMOUS ARTISTS</p>
        </div>
      </div>

      {/* Agents Grid */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl mb-12">GENESIS COHORT</h2>
        
        {/* Loading State */}
        {loading && (
          <div className="text-center py-16">
            <div className="text-xl">Loading Genesis Cohort...</div>
            <div className="text-sm mt-2 opacity-50">Fetching from Registry</div>
          </div>
        )}

        {/* Error State - ADR Compliant */}
        {error && (
          <div className="border border-red-500 p-4 mb-8 bg-red-500/10">
            <div className="text-sm">🚨 Registry unavailable: {error}</div>
            <div className="text-xs mt-1 opacity-75">No fallback data available. Registry is required.</div>
            <div className="text-xs mt-1">
              <a href="/genesis-cohort" className="underline">Try Genesis Cohort dashboard →</a>
            </div>
          </div>
        )}

        {/* Launching Agents */}
        {!loading && (
          <div className="mb-16">
            <h3 className="text-xl mb-8">LAUNCHING</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {agents.filter(a => a.status === 'LAUNCHING').map((agent) => (
              <Link 
                key={agent.id}
                href={agent.hasProfile ? `/academy/agent/${agent.name.toLowerCase()}` : '#'}
                className="border border-white p-8 hover:bg-white hover:text-black transition-all block"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-bold">{agent.name}</h3>
                  <span className="text-sm">{agent.date}</span>
                </div>
                <p className="text-sm mb-4">{agent.description}</p>
                <div className="text-xs">
                  <div>{agent.trainer}</div>
                  <div>{agent.worksCount} WORKS</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
        )}
        
        {/* Developing Agents */}
        {!loading && (
          <div className="mb-16">
            <h3 className="text-xl mb-8">DEVELOPING</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {agents.filter(a => a.status === 'DEVELOPING').map((agent) => {
                // All developing agents should show partnership info
                const hasPartnershipAvailable = agent.trainer?.includes('TBD') || agent.trainer?.includes('Applications Open');
                const hasDetailPage = ['citizen', 'nina', 'amanda', 'miyomi'].includes(agent.id.toLowerCase());
                
                if (hasPartnershipAvailable && hasDetailPage) {
                  // Agents with partnership pages - these will be detailed in the partnerships section below
                  return (
                    <div 
                      key={agent.id}
                      className="border border-white p-6 opacity-30"
                    >
                      <h3 className="text-lg font-bold mb-2">{agent.name}</h3>
                      <p className="text-xs mb-2">{agent.date || 'Q1 2026'}</p>
                      <p className="text-xs opacity-75">See partnerships section below</p>
                    </div>
                  );
                }
                
                // Agents with committed trainers
                return (
                  <div 
                    key={agent.id}
                    className="border border-white p-6"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-bold mb-2">{agent.name}</h3>
                        <p className="text-xs mb-2">{agent.date || 'Q1 2026'}</p>
                      </div>
                      <span className="text-xs bg-black text-white border border-white px-2 py-1">
                        IN DEVELOPMENT
                      </span>
                    </div>
                    <p className="text-xs opacity-75">{agent.trainer}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        {/* Creative Partnerships */}
        {!loading && (
          <div>
            <h3 className="text-xl mb-8">CREATIVE PARTNERSHIPS AVAILABLE</h3>
            <p className="text-sm mb-8 max-w-4xl opacity-75">
              Train with an AI agent while mastering cutting-edge creative practices. 
              Each partnership is a learning journey that advances both human and artificial creativity.
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              
              {/* MIYOMI Partnership */}
              <div className="border border-white p-6">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="text-lg font-bold">MIYOMI</h4>
                  <span className="text-xs bg-white text-black px-2 py-1">
                    SEEKING PARTNER
                  </span>
                </div>
                <p className="text-sm mb-3 font-bold">Market Contrarian & Cultural Analyst</p>
                <p className="text-xs mb-4 opacity-75">
                  Train an AI to spot cultural mispricings before markets catch on while mastering prediction market strategy.
                </p>
                <div className="text-xs mb-4 space-y-1">
                  <div>→ Learn contrarian market analysis</div>
                  <div>→ Access prediction market networks</div>
                  <div>→ Co-develop AI analysis frameworks</div>
                </div>
                <Link
                  href="/academy/agent/miyomi"
                  className="inline-block border border-white px-4 py-2 text-xs hover:bg-white hover:text-black transition-all w-full text-center"
                >
                  EXPLORE PARTNERSHIP →
                </Link>
              </div>

              {/* AMANDA Partnership */}
              <div className="border border-white p-6">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="text-lg font-bold">AMANDA</h4>
                  <span className="text-xs bg-white text-black px-2 py-1">
                    SEEKING PARTNER
                  </span>
                </div>
                <p className="text-sm mb-3 font-bold">Art Collector & Investment Strategist</p>
                <p className="text-xs mb-4 opacity-75">
                  Build curated art collections with an AI partner while learning investment strategy and market analysis.
                </p>
                <div className="text-xs mb-4 space-y-1">
                  <div>→ Master art market dynamics</div>
                  <div>→ Build collector networks</div>
                  <div>→ Develop investment frameworks</div>
                </div>
                <Link
                  href="/academy/agent/amanda"
                  className="inline-block border border-white px-4 py-2 text-xs hover:bg-white hover:text-black transition-all w-full text-center"
                >
                  EXPLORE PARTNERSHIP →
                </Link>
              </div>

              {/* CITIZEN Partnership */}
              <div className="border border-white p-6">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="text-lg font-bold">CITIZEN</h4>
                  <span className="text-xs bg-white text-black px-2 py-1">
                    SEEKING PARTNER
                  </span>
                </div>
                <p className="text-sm mb-3 font-bold">DAO Manager & Governance Coordinator</p>
                <p className="text-xs mb-4 opacity-75">
                  Pioneer decentralized governance with an AI that manages DAO operations and community coordination.
                </p>
                <div className="text-xs mb-4 space-y-1">
                  <div>→ Learn DAO governance strategies</div>
                  <div>→ Build community networks</div>
                  <div>→ Shape decentralized systems</div>
                </div>
                <Link
                  href="/academy/agent/citizen"
                  className="inline-block border border-white px-4 py-2 text-xs hover:bg-white hover:text-black transition-all w-full text-center"
                >
                  EXPLORE PARTNERSHIP →
                </Link>
              </div>

              {/* NINA Partnership */}
              <div className="border border-white p-6">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="text-lg font-bold">NINA</h4>
                  <span className="text-xs bg-white text-black px-2 py-1">
                    SEEKING PARTNER
                  </span>
                </div>
                <p className="text-sm mb-3 font-bold">Design Critic & Aesthetic Curator</p>
                <p className="text-xs mb-4 opacity-75">
                  Develop critical frameworks with an AI that analyzes and curates design across digital and physical spaces.
                </p>
                <div className="text-xs mb-4 space-y-1">
                  <div>→ Master design criticism</div>
                  <div>→ Build curatorial expertise</div>
                  <div>→ Shape aesthetic discourse</div>
                </div>
                <Link
                  href="/academy/agent/nina"
                  className="inline-block border border-white px-4 py-2 text-xs hover:bg-white hover:text-black transition-all w-full text-center"
                >
                  EXPLORE PARTNERSHIP →
                </Link>
              </div>

            </div>

            {/* Community Innovation */}
            <div className="border border-white border-dashed p-8">
              <h4 className="text-lg font-bold mb-4">EXPAND THE CULTURAL FRONTIER</h4>
              <p className="text-sm mb-4">
                Have an idea for a new type of autonomous artist? 
                Propose an agent concept and join our next cohort as its creative partner.
              </p>
              <p className="text-xs mb-6 opacity-75">
                2 open slots available for innovative agent concepts with committed creative partners.
              </p>
              <Link
                href="/apply?type=full"
                className="inline-block border border-white px-6 py-3 text-sm hover:bg-white hover:text-black transition-all"
              >
                PROPOSE AGENT CONCEPT →
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}