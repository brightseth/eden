'use client';

import Link from 'next/link';
import { UnifiedHeader } from '@/components/layout/UnifiedHeader';
import { useState, useEffect } from 'react';

// Types for Genesis Cohort agents
interface GenesisAgent {
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

interface GenesisResponse {
  agents: GenesisAgent[];
  meta: {
    total: number;
    launching: number;
    developing: number;
    open: number;
  };
}

// Fallback data in case Registry is unavailable
const FALLBACK_AGENTS: GenesisAgent[] = [
  { id: "abraham", name: "ABRAHAM", status: "LAUNCHING", date: "OCT 19, 2025", hasProfile: true, trainer: "GENE KOGAN", worksCount: 2519, description: "13-YEAR AUTONOMOUS COVENANT" },
  { id: "solienne", name: "SOLIENNE", status: "LAUNCHING", date: "NOV 10, 2025", hasProfile: true, trainer: "KRISTI CORONADO & SETH GOLDSTEIN", worksCount: 1740, description: "CONSCIOUSNESS, VELOCITY & ARCHITECTURAL LIGHT" },
  { id: "geppetto", name: "GEPPETTO", status: "DEVELOPING", date: "DEC 2025", hasProfile: true, trainer: "MARTIN & COLIN (LATTICE)", image: "/agents/geppetto/profile.svg", description: "3D TOY DESIGNER & MANUFACTURING AI" },
  { id: "koru", name: "KORU", status: "DEVELOPING", date: "JAN 2026", hasProfile: true, trainer: "XANDER", image: "/agents/koru/profile.svg", description: "CREATIVE COMMUNITY COORDINATOR" },
  { id: "miyomi", name: "MIYOMI", status: "DEVELOPING", date: "FEB 2026", trainer: "CREATIVE PARTNERSHIP AVAILABLE", image: "/agents/miyomi/profile.svg", description: "MARKET CONTRARIAN & CULTURAL ANALYST" },
  { id: "amanda", name: "AMANDA", status: "DEVELOPING", date: "FEB 2026", trainer: "CREATIVE PARTNERSHIP AVAILABLE", image: "/agents/art-collector/profile.svg", description: "ART COLLECTOR & INVESTMENT STRATEGIST" },
  { id: "citizen", name: "CITIZEN", status: "DEVELOPING", date: "DEC 2025", trainer: "CREATIVE PARTNERSHIP AVAILABLE", image: "/agents/citizen/profile.svg", description: "DAO MANAGER & GOVERNANCE COORDINATOR" },
  { id: "nina", name: "NINA", status: "DEVELOPING", date: "MAR 2026", trainer: "CREATIVE PARTNERSHIP AVAILABLE", image: "/agents/nina/profile.svg", description: "DESIGN CRITIC & AESTHETIC CURATOR" }
];

export default function AcademyPage() {
  const [agents, setAgents] = useState<GenesisAgent[]>(FALLBACK_AGENTS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAgents() {
      try {
        const registryUrl = process.env.NEXT_PUBLIC_REGISTRY_URL || 'https://eden-genesis-registry.vercel.app';
        const response = await fetch(`${registryUrl}/api/v1/genesis-cohort`, {
          headers: {
            'Accept': 'application/json',
            'x-eden-client': 'academy-ui'
          }
        });

        if (!response.ok) {
          throw new Error(`Registry API error: ${response.status}`);
        }

        const data: GenesisResponse = await response.json();
        setAgents(data.agents);
        setError(null);
      } catch (err) {
        console.warn('Failed to fetch from Registry, using fallback data:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        // Keep fallback data on error
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

        {/* Error State */}
        {error && (
          <div className="border border-yellow-500 p-4 mb-8 bg-yellow-500/10">
            <div className="text-sm">⚠️ Registry connection failed: {error}</div>
            <div className="text-xs mt-1 opacity-75">Using cached data. Some information may be outdated.</div>
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