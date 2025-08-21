'use client';

import { UnifiedHeader } from '@/components/layout/UnifiedHeader';
import { LiveTicker } from '@/components/live-ticker/LiveTicker';
import { StudioHealth } from '@/components/studio-health/StudioHealth';
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
  const handleAgentClick = (agent: Agent) => {
    if (agent.status === 'OPEN') {
      window.location.href = '/apply';
    } else if (agent.hasProfile) {
      window.location.href = `/academy/agent/${agent.name.toLowerCase()}`;
    }
    // Developing agents: no action, just display
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Unified Navigation Header */}
      <UnifiedHeader />

      {/* Academy Header */}
      <div className="border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">EDEN ACADEMY</h1>
            <p className="text-gray-400 mb-2">
              100-DAY TRAINING PROGRAM FOR AUTONOMOUS AGENTS
            </p>
            <p className="text-sm text-gray-500">
              Genesis Cohort: The First 10 Agents
            </p>
          </div>
        </div>
      </div>

      {/* Studio Health - Autonomy Metrics */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <StudioHealth />
      </div>

      {/* Agent Grid */}
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {GENESIS_COHORT.map((agent) => (
            <div 
              key={agent.id}
              className={`bg-black border border-gray-800 p-5 text-center transition-all ${
                agent.hasProfile || agent.status === 'OPEN' ? 'cursor-pointer hover:bg-gray-950 hover:border-gray-600' : 'cursor-default'
              }`}
              onClick={() => handleAgentClick(agent)}
              style={{
                opacity: agent.status === 'OPEN' ? 0.7 : 1
              }}
            >
              <div className="w-16 h-16 bg-gray-900 border border-gray-600 mx-auto mb-3 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">{String(agent.id).padStart(2, '0')}</span>
              </div>
              
              <h3 className="text-sm font-bold mb-2 tracking-[0.5px]">{agent.name}</h3>
              <p className="text-xs text-gray-300">{agent.date || 'APPLY NOW'}</p>
            </div>
          ))}
        </div>
      </div>



      {/* Live Activity Ticker */}
      <LiveTicker />
    </div>
  );
}