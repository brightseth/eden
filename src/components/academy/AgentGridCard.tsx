'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface Agent {
  id: number;
  name: string;
  handle?: string; // Add handle for consistent routing
  status: 'LAUNCHING' | 'DEVELOPING' | 'OPEN';
  date?: string;
  track?: string;
  image?: string;
  twitter?: string;
  farcaster?: string;
  trainer?: string;
  dailyPractice?: string;
}

interface AgentGridCardProps {
  agent: Agent;
}

export function AgentGridCard({ agent }: AgentGridCardProps) {
  const statusColors = {
    LAUNCHING: '#00FF00',
    DEVELOPING: '#FFFF00', 
    OPEN: '#666666'
  };

  const getHref = () => {
    if (agent.status === 'OPEN') {
      return '/apply';
    }
    // Use handle if available, otherwise fallback to clean name transformation
    const agentId = agent.handle || agent.name.toLowerCase().replace(/[\[\]]/g, '').replace(/\s+/g, '');
    return `/academy/agent/${agentId}`;
  };

  return (
    <Link href={getHref()} className="block">
      <div 
        className="agent-grid-card bg-black border-2 p-5 cursor-pointer text-center transition-all hover:bg-gray-950 group"
        style={{ borderColor: statusColors[agent.status] }}
        data-status={agent.status}
      >
        <div className="text-[10px] text-gray-500 font-bold tracking-[1px] mb-2">
          AGENT_{String(agent.id).padStart(2, '0')}
        </div>
        
        {agent.image ? (
          <img 
            src={agent.image} 
            alt={agent.name} 
            className="w-20 h-20 object-cover mx-auto mb-3 border border-gray-600"
          />
        ) : (
          <div className="w-20 h-20 bg-gray-900 border border-gray-600 mx-auto mb-3 flex items-center justify-center">
            <span className="text-xs text-gray-600">IMG</span>
          </div>
        )}
        
        <h3 className="text-base font-bold mb-2 tracking-[0.5px]">{agent.name}</h3>
        
        {agent.status === 'OPEN' ? (
          <>
            <p className="text-xs text-gray-500 mb-2 uppercase tracking-[0.5px]">{agent.track}</p>
            <p className="text-[10px] text-gray-400 underline group-hover:text-white transition-colors">
              CLICK TO APPLY
            </p>
          </>
        ) : (
          <>
            <p className="text-[10px] text-gray-400 uppercase tracking-[1px] mb-1">
              {agent.status}
            </p>
            <p className="text-xs text-gray-300">{agent.date}</p>
          </>
        )}

        <div className="mt-3 flex justify-end">
          <ChevronRight className="w-3 h-3 text-gray-600 group-hover:text-gray-400 transition-colors" />
        </div>
      </div>
    </Link>
  );
}