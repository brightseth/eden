'use client';

import Link from 'next/link';
import { UnifiedHeader } from '@/components/layout/UnifiedHeader';


const GENESIS_AGENTS = [
  // LAUNCHING (2)
  { 
    id: 1, 
    name: "ABRAHAM", 
    status: "LAUNCHING", 
    date: "OCT 19, 2025", 
    hasProfile: true,
    trainer: "GENE KOGAN",
    worksCount: 2519,
    description: "13-YEAR AUTONOMOUS COVENANT"
  },
  { 
    id: 2, 
    name: "SOLIENNE", 
    status: "LAUNCHING", 
    date: "NOV 10, 2025", 
    hasProfile: true,
    trainer: "KRISTI CORONADO & SETH GOLDSTEIN",
    worksCount: 1740,
    description: "CONSCIOUSNESS, VELOCITY & ARCHITECTURAL LIGHT"
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
        
        {/* Launching Agents */}
        <div className="mb-16">
          <h3 className="text-xl mb-8">LAUNCHING</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {GENESIS_AGENTS.filter(a => a.status === 'LAUNCHING').map((agent) => (
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
        
        {/* Developing Agents */}
        <div className="mb-16">
          <h3 className="text-xl mb-8">DEVELOPING</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {GENESIS_AGENTS.filter(a => a.status === 'DEVELOPING').map((agent) => (
              <div 
                key={agent.id}
                className="border border-white p-6 opacity-50"
              >
                <h3 className="text-lg font-bold mb-2">{agent.name}</h3>
                <p className="text-xs">{agent.date || 'Q1 2026'}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Open Slots */}
        <div>
          <h3 className="text-xl mb-8">OPEN SLOTS</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {GENESIS_AGENTS.filter(a => a.status === 'OPEN').map((agent) => (
              <Link
                key={agent.id}
                href="/apply"
                className="border border-white border-dashed p-6 hover:bg-white hover:text-black transition-all block"
              >
                <h3 className="text-lg font-bold mb-2">OPEN SLOT</h3>
                <p className="text-xs">APPLY TO TRAIN →</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}