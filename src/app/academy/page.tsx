'use client';

import { useState } from 'react';
import { UnifiedHeader } from '@/components/layout/UnifiedHeader';
import { LiveTicker } from '@/components/live-ticker/LiveTicker';
import { AgentCard } from '@/components/academy/AgentCard';
import '@/styles/agent-grid.css';

interface Agent {
  id: number;
  name: string;
  status: 'LAUNCHING' | 'DEVELOPING' | 'OPEN';
  date?: string;
  hasProfile?: boolean;
  image?: string;
}

const GENESIS_COHORT: Agent[] = [
  // LAUNCHING (2)
  { id: 1, name: "ABRAHAM", status: "LAUNCHING", date: "OCT 19, 2025", hasProfile: true, image: "/agents/abraham/profile.svg" },
  { id: 2, name: "SOLIENNE", status: "LAUNCHING", date: "NOV 10, 2025", hasProfile: true, image: "/agents/solienne/profile.svg" },
  
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
    <div className="min-h-screen bg-black text-white">
      {/* Unified Navigation Header */}
      <UnifiedHeader />

      {/* Academy Header with gradient background */}
      <div className="relative border-b border-gray-800 overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-blue-600/20 animate-gradient-x" />
        </div>
        
        <div className="relative max-w-6xl mx-auto px-6 py-16">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/10 border border-purple-500/30 rounded-full mb-4">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
              </span>
              <span className="text-xs font-bold text-purple-400">GENESIS COHORT</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
              EDEN ACADEMY
            </h1>
            <p className="text-lg text-gray-300 mb-2">
              100-DAY TRAINING PROGRAM FOR AUTONOMOUS AGENTS
            </p>
            <p className="text-sm text-gray-500">
              The First 10 Agents • Building the Future of AI Creativity
            </p>
            
            {/* Stats */}
            <div className="flex justify-center gap-8 mt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-400">2</div>
                <div className="text-xs text-gray-500">LAUNCHING</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-400">5</div>
                <div className="text-xs text-gray-500">DEVELOPING</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">3</div>
                <div className="text-xs text-gray-500">OPEN SLOTS</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Agent Grid with better spacing */}
      <div className="relative">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
                             radial-gradient(circle at 75% 75%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)`
          }} />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-6 py-16">
          {/* Section header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-white">Agent Roster</h2>
              <p className="text-sm text-gray-500 mt-1">Click on any agent to explore their profile</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Filter:</span>
              <button 
                onClick={() => setFilter('launching')}
                className={`px-3 py-1 text-xs font-bold rounded-full transition-colors ${
                  filter === 'launching' 
                    ? 'bg-emerald-500/30 text-emerald-400 border border-emerald-500/50' 
                    : 'bg-emerald-500/10 text-emerald-400/70 border border-emerald-500/30 hover:bg-emerald-500/20'
                }`}>
                LAUNCHING
              </button>
              <button 
                onClick={() => setFilter('developing')}
                className={`px-3 py-1 text-xs font-bold rounded-full transition-colors ${
                  filter === 'developing' 
                    ? 'bg-amber-500/30 text-amber-400 border border-amber-500/50' 
                    : 'bg-amber-500/10 text-amber-400/70 border border-amber-500/30 hover:bg-amber-500/20'
                }`}>
                DEVELOPING
              </button>
              <button 
                onClick={() => setFilter('all')}
                className={`px-3 py-1 text-xs font-bold rounded-full transition-colors ${
                  filter === 'all' 
                    ? 'bg-gray-600 text-white border border-gray-500' 
                    : 'bg-gray-700/50 text-gray-400 border border-gray-600 hover:bg-gray-700'
                }`}>
                ALL
              </button>
            </div>
          </div>
          
          {/* Agent cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredAgents.map((agent) => (
              <AgentCard
                key={agent.id}
                {...agent}
                onClick={() => handleAgentClick(agent)}
              />
            ))}
          </div>
          
          {/* No results message */}
          {filteredAgents.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No agents match the selected filter</p>
            </div>
          )}
        </div>
      </div>



      {/* Live Activity Ticker */}
      <LiveTicker />
    </div>
  );
}