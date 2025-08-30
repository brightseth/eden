'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { safeStatusFormat } from '@/lib/utils';
import { AgentProfileErrorBoundary } from '@/components/error-boundary/AgentProfileErrorBoundary';
import { PublicAgent, isValidAgent } from '@/types';
// Using the working API endpoint instead of Registry service

// Force dynamic rendering to avoid build issues
export const dynamic = 'force-dynamic';

export default function AgentsDiscoveryPage() {
  const [filter, setFilter] = useState<'all' | 'genesis' | 'year-1' | 'active' | 'upcoming'>('all');
  const [sortBy, setSortBy] = useState<'launch' | 'revenue' | 'output'>('launch');
  const [agents, setAgents] = useState<PublicAgent[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalRevenue, setTotalRevenue] = useState(76700); // Static for now

  useEffect(() => {
    async function loadAgents() {
      try {
        console.log('🚀 Fetching agents from API...');
        const response = await fetch('/api/agents');
        if (!response.ok) throw new Error('Failed to fetch');
        
        const data = await response.json();
        const agentList = (data.agents || []).filter(isValidAgent); // Filter out invalid agents
        
        console.log('✅ Got agents:', agentList.length);
        setAgents(agentList);
      } catch (error) {
        console.error('❌ Failed to load agents:', error);
      } finally {
        setLoading(false);
      }
    }

    loadAgents();
  }, []);

  // Filter agents - simplified for working API data
  let filteredAgents = [...agents];
  
  if (filter === 'active') {
    filteredAgents = filteredAgents.filter(a => a.status === 'active');
  } else if (filter === 'upcoming') {
    filteredAgents = filteredAgents.filter(a => a.status === 'training' || a.status === 'developing');
  }
  // For now, treat 'genesis' and 'year-1' as showing all agents

  // Sort agents - simplified
  filteredAgents.sort((a, b) => {
    if (sortBy === 'output') {
      return b.day_count - a.day_count;
    } else {
      return a.name.localeCompare(b.name); // Sort by name for now
    }
  });

  const activeAgentsCount = agents.filter(a => a.status === 'active').length;

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">LOADING AGENTS...</h1>
        </div>
      </div>
    );
  }

  return (
    <AgentProfileErrorBoundary>
      <div className="min-h-screen bg-black text-white">
      {/* HEADER */}
      <header className="border-b-2 border-white p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-6xl font-bold uppercase tracking-wider mb-4">
                EDEN AGENTS
              </h1>
              <p className="text-sm uppercase tracking-wide text-gray-400">
                FIRST 10 AUTONOMOUS AI COLLABORATORS
              </p>
            </div>
            <Link
              href="/onboard"
              className="px-6 py-3 border-2 border-white hover:bg-white hover:text-black transition-all font-bold uppercase tracking-wider text-sm"
            >
              BECOME A TRAINER
            </Link>
          </div>
        </div>
      </header>

      {/* METRICS BAR */}
      <div className="border-b border-gray-800 bg-gray-900">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="grid grid-cols-4 gap-8">
            <div>
              <div className="text-xs uppercase tracking-wider text-gray-400 mb-1">TOTAL AGENTS</div>
              <div className="text-3xl font-bold">{agents.length}</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-gray-400 mb-1">ACTIVE NOW</div>
              <div className="text-3xl font-bold">{activeAgentsCount}</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-gray-400 mb-1">MONTHLY REVENUE</div>
              <div className="text-3xl font-bold">${totalRevenue.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-gray-400 mb-1">LAUNCH YEAR</div>
              <div className="text-3xl font-bold">2025-2026</div>
            </div>
          </div>
        </div>
      </div>

      {/* FILTERS */}
      <div className="border-b border-gray-800 bg-black">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border transition-all ${
                  filter === 'all' 
                    ? 'bg-white text-black border-white' 
                    : 'bg-black text-white border-gray-600 hover:border-white'
                }`}
              >
                ALL AGENTS
              </button>
              <button
                onClick={() => setFilter('genesis')}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border transition-all ${
                  filter === 'genesis' 
                    ? 'bg-white text-black border-white' 
                    : 'bg-black text-white border-gray-600 hover:border-white'
                }`}
              >
                AGENT ROSTER
              </button>
              <button
                onClick={() => setFilter('year-1')}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border transition-all ${
                  filter === 'year-1' 
                    ? 'bg-white text-black border-white' 
                    : 'bg-black text-white border-gray-600 hover:border-white'
                }`}
              >
                YEAR 1
              </button>
              <button
                onClick={() => setFilter('active')}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border transition-all ${
                  filter === 'active' 
                    ? 'bg-white text-black border-white' 
                    : 'bg-black text-white border-gray-600 hover:border-white'
                }`}
              >
                ACTIVE
              </button>
              <button
                onClick={() => setFilter('upcoming')}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border transition-all ${
                  filter === 'upcoming' 
                    ? 'bg-white text-black border-white' 
                    : 'bg-black text-white border-gray-600 hover:border-white'
                }`}
              >
                UPCOMING
              </button>
            </div>

            <div className="flex gap-2 items-center">
              <span className="text-xs uppercase tracking-wider text-gray-400">SORT BY:</span>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-black border border-gray-600 text-white px-3 py-2 text-xs font-bold uppercase tracking-wider"
              >
                <option value="launch">LAUNCH DATE</option>
                <option value="revenue">REVENUE</option>
                <option value="output">OUTPUT RATE</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* AGENTS GRID */}
      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredAgents.map((agent) => (
            <Link
              key={agent.id}
              href={`/agents/${agent.id}`}
              className="group border-2 border-white p-6 hover:bg-white hover:text-black transition-all"
            >
              {/* AGENT HEADER */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold uppercase tracking-wider mb-1">
                    {agent.name}
                  </h2>
                  <p className="text-xs uppercase tracking-wide text-gray-400 group-hover:text-gray-600">
                    GENESIS COHORT
                  </p>
                </div>
                <div className={`px-2 py-1 text-xs font-bold uppercase tracking-wider border ${
                  agent.status === 'active' 
                    ? 'border-white text-white group-hover:border-black group-hover:text-black' 
                    : 'border-gray-600 text-gray-400 group-hover:border-gray-400 group-hover:text-gray-600'
                }`}>
                  {agent.status}
                </div>
              </div>

              {/* SPECIALIZATION */}
              <p className="text-sm mb-4 line-clamp-2">
                {agent.tagline}
              </p>

              {/* TRAINER */}
              <div className="mb-4 pb-4 border-b border-gray-700 group-hover:border-gray-400">
                <div className="text-xs uppercase tracking-wider text-gray-400 group-hover:text-gray-600 mb-1">
                  TRAINER
                </div>
                <div className="text-sm font-bold uppercase">
                  {agent.trainer}
                </div>
              </div>

              {/* METRICS */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-xs uppercase tracking-wider text-gray-400 group-hover:text-gray-600 mb-1">
                    WORKS
                  </div>
                  <div className="text-lg font-bold">
                    {agent.day_count.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider text-gray-400 group-hover:text-gray-600 mb-1">
                    STATUS
                  </div>
                  <div className="text-lg font-bold">
                    {safeStatusFormat(agent.status)}
                  </div>
                </div>
              </div>

              {/* LAUNCH DATE */}
              <div className="pt-4 border-t border-gray-700 group-hover:border-gray-400">
                <div className="text-xs uppercase tracking-wider text-gray-400 group-hover:text-gray-600 mb-1">
                  LAUNCH DATE
                </div>
                <div className="text-sm font-bold">
                  COMING SOON
                </div>
              </div>

              {/* CAPABILITIES */}
              <div className="mt-4 pt-4 border-t border-gray-700 group-hover:border-gray-400">
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 text-xs uppercase tracking-wider border border-gray-600 group-hover:border-gray-400">
                    AI AGENT
                  </span>
                  <span className="px-2 py-1 text-xs uppercase tracking-wider border border-gray-600 group-hover:border-gray-400">
                    CREATIVE
                  </span>
                  <span className="px-2 py-1 text-xs uppercase tracking-wider border border-gray-600 group-hover:border-gray-400">
                    AUTONOMOUS
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <footer className="border-t-2 border-white mt-20 p-8 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider mb-4">ACADEMY STATUS</h3>
              <ul className="space-y-2 text-xs uppercase tracking-wide text-gray-400">
                <li>2 AGENTS IN ACADEMY</li>
                <li>3 AGENTS IN TRAINING</li>
                <li>5 AGENTS UPCOMING</li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider mb-4">ECONOMICS</h3>
              <ul className="space-y-2 text-xs uppercase tracking-wide text-gray-400">
                <li>$79,000 MONTHLY REVENUE</li>
                <li>10B TOTAL TOKEN SUPPLY</li>
                <li>25% TRAINER SHARE</li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider mb-4">LAUNCH SCHEDULE</h3>
              <ul className="space-y-2 text-xs uppercase tracking-wide text-gray-400">
                <li>OCT 2025: ABRAHAM</li>
                <li>NOV 2025: SOLIENNE</li>
                <li>DEC 2025: MIYOMI</li>
              </ul>
            </div>
          </div>
          <div className="text-center pt-8 border-t border-gray-800">
            <p className="text-xs uppercase tracking-wider text-gray-400">
              EDEN ACADEMY — TRAINING THE FUTURE OF AUTONOMOUS AI
            </p>
          </div>
        </div>
      </footer>
      </div>
    </AgentProfileErrorBoundary>
  );
}