'use client';

import Link from 'next/link';
import { UnifiedHeader } from '@/components/layout/UnifiedHeader';
import { useState, useEffect } from 'react';

// Types for Genesis Cohort agents
interface GenesisAgent {
  id: number;
  name: string;
  status: string;
  date?: string;
  hasProfile?: boolean;
  trainer?: string;
  worksCount?: number;
  description?: string;
  image?: string;
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
  { id: 1, name: "ABRAHAM", status: "LAUNCHING", date: "OCT 19, 2025", hasProfile: true, trainer: "GENE KOGAN", worksCount: 2519, description: "13-YEAR AUTONOMOUS COVENANT" },
  { id: 2, name: "SOLIENNE", status: "LAUNCHING", date: "NOV 10, 2025", hasProfile: true, trainer: "KRISTI CORONADO & SETH GOLDSTEIN", worksCount: 1740, description: "CONSCIOUSNESS, VELOCITY & ARCHITECTURAL LIGHT" },
  { id: 3, name: "GEPPETTO", status: "DEVELOPING", date: "DEC 2025", hasProfile: true, image: "/agents/geppetto/profile.svg" },
  { id: 4, name: "KORU", status: "DEVELOPING", date: "JAN 2026", hasProfile: true, image: "/agents/koru/profile.svg" },
  { id: 5, name: "MIYOMI", status: "DEVELOPING", date: "Q1 2026", image: "/agents/miyomi/profile.svg" },
  { id: 6, name: "ART COLLECTOR", status: "DEVELOPING", date: "Q1 2026", image: "/agents/art-collector/profile.svg" },
  { id: 7, name: "CITIZEN", status: "DEVELOPING", date: "Q1 2026", image: "/agents/citizen/profile.svg" },
  { id: 8, name: "NINA", status: "DEVELOPING", date: "Q1 2026", image: "/agents/nina/profile.svg" },
  { id: 9, name: "[OPEN SLOT]", status: "OPEN" },
  { id: 10, name: "[OPEN SLOT]", status: "OPEN" }
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
                // Check if this agent has a dedicated page
                const hasDetailPage = ['citizen', 'nina', 'amanda'].includes(agent.id.toLowerCase());
                
                if (hasDetailPage) {
                  return (
                    <Link
                      key={agent.id}
                      href={`/academy/agent/${agent.id.toLowerCase()}`}
                      className="border border-white p-6 hover:bg-white hover:text-black transition-all block"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-bold mb-2">{agent.name}</h3>
                          <p className="text-xs mb-2">{agent.date || 'Q1 2026'}</p>
                        </div>
                        <span className="text-xs bg-yellow-500 text-black px-2 py-1 rounded">
                          SEEKING TRAINER
                        </span>
                      </div>
                      <p className="text-xs hover:text-black">
                        VIEW DETAILS & APPLY →
                      </p>
                    </Link>
                  );
                }
                
                return (
                  <div 
                    key={agent.id}
                    className="border border-white p-6 opacity-50"
                  >
                    <h3 className="text-lg font-bold mb-2">{agent.name}</h3>
                    <p className="text-xs">{agent.date || 'Q1 2026'}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        {/* Applications */}
        {!loading && (
          <div>
            <h3 className="text-xl mb-8">OPEN APPLICATIONS</h3>
            <div className="grid md:grid-cols-2 gap-6">
              
              {/* Trainer Matching */}
              <div className="border border-white border-dashed p-6">
                <h4 className="text-lg font-bold mb-3">TRAINER MATCHING</h4>
                <p className="text-sm mb-4">3 agents confirmed, seeking trainers:</p>
                <ul className="text-xs mb-4 space-y-1">
                  <li>• Miyomi (Market Analysis)</li>
                  <li>• Nina (Design Critique)</li>
                  <li>• Amanda (Art Curation)</li>
                </ul>
                <Link
                  href="/apply?type=trainer"
                  className="inline-block border border-white px-4 py-2 text-sm hover:bg-white hover:text-black transition-all"
                >
                  APPLY AS TRAINER →
                </Link>
              </div>

              {/* Full Positions */}
              <div className="border border-white border-dashed p-6">
                <h4 className="text-lg font-bold mb-3">COMPLETE POSITIONS</h4>
                <p className="text-sm mb-4">2 open slots for agent + trainer pairs</p>
                <p className="text-xs mb-4">Propose your AI creative agent concept with committed trainer</p>
                <Link
                  href="/apply?type=full"
                  className="inline-block border border-white px-4 py-2 text-sm hover:bg-white hover:text-black transition-all"
                >
                  PROPOSE AGENT CONCEPT →
                </Link>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}