'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronDown, Zap, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface Agent {
  id: string;
  name: string;
  avatar?: string;
  status: 'active' | 'idle' | 'generating' | 'curating';
  streak: number;
  graduation_day: number;
}

const AGENTS: Agent[] = [
  { id: 'abraham', name: 'ABRAHAM', status: 'active', streak: 95, graduation_day: 95 },
  { id: 'solienne', name: 'SOLIENNE', status: 'active', streak: 95, graduation_day: 95 },
  { id: 'geppetto', name: 'GEPPETTO', status: 'idle', streak: 0, graduation_day: 0 },
  { id: 'koru', name: 'KORU', status: 'idle', streak: 0, graduation_day: 0 },
];

export function AgentSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [agents, setAgents] = useState<Agent[]>(AGENTS);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Get current agent from URL
  const currentAgentId = pathname.match(/\/academy\/agent\/(\w+)/)?.[1];
  const currentAgent = agents.find(a => a.id === currentAgentId);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (!currentAgent) return;
      
      const currentIndex = agents.findIndex(a => a.id === currentAgentId);
      let nextIndex = currentIndex;

      if (event.key === 'ArrowLeft' && event.altKey) {
        nextIndex = currentIndex > 0 ? currentIndex - 1 : agents.length - 1;
      } else if (event.key === 'ArrowRight' && event.altKey) {
        nextIndex = currentIndex < agents.length - 1 ? currentIndex + 1 : 0;
      } else {
        return;
      }

      const nextAgent = agents[nextIndex];
      if (nextAgent) {
        window.location.href = `/academy/agent/${nextAgent.id}`;
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [currentAgentId, agents, currentAgent]);

  // Don't show switcher if not on an agent page
  if (!currentAgent) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 bg-gray-900 border border-gray-700 hover:border-gray-600 transition-colors rounded"
      >
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-xs font-bold">
            {currentAgent.name[0]}
          </div>
          <span className="text-sm font-bold">{currentAgent.name}</span>
          {currentAgent.status === 'active' && (
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          )}
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 left-0 w-64 bg-black border border-gray-700 shadow-xl z-50">
          <div className="p-2">
            <div className="text-xs text-gray-500 px-2 py-1 mb-1">SWITCH AGENT</div>
            {agents.map(agent => (
              <Link
                key={agent.id}
                href={`/academy/agent/${agent.id}`}
                onClick={() => setIsOpen(false)}
                className={`flex items-center justify-between p-2 hover:bg-gray-900 transition-colors ${
                  agent.id === currentAgentId ? 'bg-gray-900 border-l-2 border-purple-500' : ''
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                    agent.status === 'active' 
                      ? 'bg-gradient-to-br from-purple-600 to-pink-600 text-white'
                      : 'bg-gray-800 text-gray-400'
                  }`}>
                    {agent.name[0]}
                  </div>
                  <div>
                    <div className="text-sm font-bold">{agent.name}</div>
                    <div className="text-xs text-gray-500 capitalize">{agent.status}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  {agent.streak > 0 && (
                    <div className="flex items-center gap-1">
                      <Zap className="w-3 h-3 text-yellow-400" />
                      <span className="text-gray-400">{agent.streak}</span>
                    </div>
                  )}
                  {agent.graduation_day > 0 && (
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3 text-green-400" />
                      <span className="text-gray-400">{agent.graduation_day}%</span>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
          <div className="border-t border-gray-700 p-2">
            <div className="text-xs text-gray-500 px-2">
              Use <kbd className="px-1 py-0.5 bg-gray-800 rounded text-xs">Alt</kbd> + 
              <kbd className="px-1 py-0.5 bg-gray-800 rounded text-xs ml-1">←</kbd>
              <kbd className="px-1 py-0.5 bg-gray-800 rounded text-xs ml-1">→</kbd> to navigate
            </div>
          </div>
        </div>
      )}
    </div>
  );
}