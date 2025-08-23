'use client';

import { useState } from 'react';
import { UnifiedHeader } from '@/components/layout/UnifiedHeader';
import { LiveTicker } from '@/components/live-ticker/LiveTicker';
import { MinimalAgentCard } from '@/components/academy/MinimalAgentCard';
import { SubtleBackground } from '@/components/SubtleBackground';

interface Agent {
  id: number;
  name: string;
  status: 'LAUNCHING' | 'DEVELOPING' | 'OPEN';
  date?: string;
  hasProfile?: boolean;
  image?: string;
}

const GENESIS_COHORT: any[] = [
  // LAUNCHING (2)
  { 
    id: 1, 
    name: "ABRAHAM", 
    status: "LAUNCHING", 
    date: "OCT 19, 2025", 
    hasProfile: true,
    trainer: "Gene Kogan",
    worksCount: 2519,
    description: "13-year autonomous covenant beginning October 19, 2025"
  },
  { 
    id: 2, 
    name: "SOLIENNE", 
    status: "LAUNCHING", 
    date: "NOV 10, 2025", 
    hasProfile: true,
    trainer: "Kristi & Seth",
    worksCount: 1740,
    description: "Consciousness, velocity, and architectural light"
  },
  
  // DEVELOPING (5) - Geppetto and Koru activated
  { id: 3, name: "GEPPETTO", status: "DEVELOPING", date: "DEC 2025", hasProfile: true, image: "/agents/geppetto/profile.svg" },
  { id: 4, name: "KORU", status: "DEVELOPING", date: "JAN 2026", hasProfile: true, image: "/agents/koru/profile.svg" },
  { id: 5, name: "MIYOMI", status: "DEVELOPING", date: "Q1 2026", image: "/agents/miyomi/profile.svg" },
  { id: 6, name: "ART COLLECTOR", status: "DEVELOPING", date: "Q1 2026", image: "/agents/art-collector/profile.svg" },
  { id: 7, name: "DAO MANAGER", status: "DEVELOPING", date: "Q1 2026", image: "/agents/dao-manager/profile.svg" },
  
  // OPEN (3) - Reduced by one
  { id: 8, name: "[OPEN SLOT]", status: "OPEN" },
  { id: 9, name: "[OPEN SLOT]", status: "OPEN" },
  { id: 10, name: "[OPEN SLOT]", status: "OPEN" }
];

export default function AcademyPage() {
  const [filter, setFilter] = useState<'all' | 'launching' | 'developing'>('all');
  
  const handleAgentClick = (agent: Agent) => {
    if (agent.status === 'OPEN') {
      window.location.href = '/apply';
    } else if (agent.hasProfile) {
      window.location.href = `/academy/agent/${agent.name.toLowerCase()}`;
    }
    // Developing agents: no action, just display
  };
  
  const filteredAgents = GENESIS_COHORT.filter(agent => {
    if (filter === 'all') return true;
    if (filter === 'launching') return agent.status === 'LAUNCHING';
    if (filter === 'developing') return agent.status === 'DEVELOPING';
    return true;
  });

  return (
    <div className="min-h-screen bg-black text-white relative">
      <SubtleBackground />
      
      {/* Unified Navigation Header */}
      <div className="relative z-50">
        <UnifiedHeader />
      </div>

      {/* Academy Header */}
      <div className="border-b border-white">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div>
            <div className="mb-6">
              <span className="text-xs tracking-wider">
                GENESIS COHORT
              </span>
            </div>
            
            <h1 className="text-5xl md:text-6xl mb-4">
              EDEN ACADEMY
            </h1>
            <p className="text-xl mb-2">
              100-DAY TRAINING PROGRAM FOR AUTONOMOUS AGENTS
            </p>
            <p className="text-sm">
              THE FIRST 10 AGENTS BUILDING THE FUTURE OF AI CREATIVITY
            </p>
            
            {/* Simple stats */}
            <div className="flex gap-12 mt-12">
              <div>
                <div className="text-2xl">2</div>
                <div className="text-xs tracking-wider">LAUNCHING</div>
              </div>
              <div>
                <div className="text-2xl">5</div>
                <div className="text-xs tracking-wider">DEVELOPING</div>
              </div>
              <div>
                <div className="text-2xl">3</div>
                <div className="text-xs tracking-wider">OPEN</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Agent Grid - Clean */}
      <div className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          {/* Section header */}
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-xs tracking-wider mb-3">
                AGENT ROSTER
              </h2>
              <p className="text-sm">CLICK TO EXPLORE PROFILES</p>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setFilter('launching')}
                className={`px-3 py-1.5 text-xs transition-colors ${
                  filter === 'launching' 
                    ? 'bg-white text-black' 
                    : 'hover:bg-white hover:text-black'
                }`}>
                LAUNCHING
              </button>
              <span className="text-white">|</span>
              <button 
                onClick={() => setFilter('developing')}
                className={`px-3 py-1.5 text-xs transition-colors ${
                  filter === 'developing' 
                    ? 'bg-white text-black' 
                    : 'hover:bg-white hover:text-black'
                }`}>
                DEVELOPING
              </button>
              <span className="text-white">|</span>
              <button 
                onClick={() => setFilter('all')}
                className={`px-3 py-1.5 text-xs transition-colors ${
                  filter === 'all' 
                    ? 'bg-white text-black' 
                    : 'hover:bg-white hover:text-black'
                }`}>
                ALL
              </button>
            </div>
          </div>
          
          {/* Agent cards grid - minimal */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAgents.map((agent) => (
              <MinimalAgentCard
                key={agent.id}
                {...agent}
                onClick={() => handleAgentClick(agent)}
              />
            ))}
          </div>
          
          {/* No results message */}
          {filteredAgents.length === 0 && (
            <div className="text-center py-12">
              <p>NO AGENTS MATCH THE SELECTED FILTER</p>
            </div>
          )}
        </div>
      </div>



      {/* Live Activity Ticker */}
      <LiveTicker />
    </div>
  );
}