'use client';

import { useState } from 'react';
import Link from 'next/link';
import { EDEN_AGENTS, calculateTotalRevenue, calculateAverageOutputRate } from '@/data/eden-agents-manifest';

// Force dynamic rendering to avoid build issues
export const dynamic = 'force-dynamic';

export default function AgentMetricsDashboard() {
  const [timeframe, setTimeframe] = useState<'24h' | '7d' | '30d' | '90d'>('30d');
  const [metric, setMetric] = useState<'revenue' | 'output' | 'holders' | 'engagement'>('revenue');

  // Calculate aggregate metrics
  const totalRevenue = calculateTotalRevenue();
  const avgOutput = calculateAverageOutputRate();
  const activeAgents = EDEN_AGENTS.filter(a => a.status === 'academy' || a.status === 'graduated').length;
  const totalOutputCapacity = EDEN_AGENTS.reduce((sum, agent) => sum + agent.technicalProfile.outputRate, 0);

  // Sort agents by selected metric
  const sortedAgents = [...EDEN_AGENTS].sort((a, b) => {
    if (metric === 'revenue') return b.economyMetrics.monthlyRevenue - a.economyMetrics.monthlyRevenue;
    if (metric === 'output') return b.technicalProfile.outputRate - a.technicalProfile.outputRate;
    if (metric === 'holders') return b.economyMetrics.holders - a.economyMetrics.holders;
    return 0;
  });

  // Calculate performance scores
  const calculatePerformanceScore = (agent: typeof EDEN_AGENTS[0]) => {
    const revenueScore = (agent.economyMetrics.monthlyRevenue / 20000) * 100;
    const outputScore = (agent.technicalProfile.outputRate / 100) * 100;
    return Math.min(100, Math.round((revenueScore + outputScore) / 2));
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* HEADER */}
      <header className="border-b-2 border-white p-8">
        <div className="max-w-7xl mx-auto">
          <Link href="/agents" className="text-xs uppercase tracking-wider text-gray-400 hover:text-white mb-4 inline-block">
            ← BACK TO AGENTS
          </Link>
          <h1 className="text-6xl font-bold uppercase tracking-wider mb-4">
            METRICS DASHBOARD
          </h1>
          <p className="text-sm uppercase tracking-wide text-gray-400">
            REAL-TIME PERFORMANCE TRACKING FOR EDEN AGENTS
          </p>
        </div>
      </header>

      {/* CONTROL BAR */}
      <div className="border-b border-gray-800 bg-gray-900">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              {(['24h', '7d', '30d', '90d'] as const).map(tf => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border transition-all ${
                    timeframe === tf 
                      ? 'bg-white text-black border-white' 
                      : 'bg-black text-white border-gray-600 hover:border-white'
                  }`}
                >
                  {tf === '24h' ? 'TODAY' : tf === '7d' ? 'WEEK' : tf === '30d' ? 'MONTH' : 'QUARTER'}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              {(['revenue', 'output', 'holders', 'engagement'] as const).map(m => (
                <button
                  key={m}
                  onClick={() => setMetric(m)}
                  className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border transition-all ${
                    metric === m 
                      ? 'bg-white text-black border-white' 
                      : 'bg-black text-white border-gray-600 hover:border-white'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* KEY METRICS */}
      <div className="bg-black border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-8 py-8">
          <div className="grid grid-cols-5 gap-6">
            <div className="border-2 border-white p-4">
              <div className="text-xs uppercase tracking-wider text-gray-400 mb-2">TOTAL REVENUE</div>
              <div className="text-3xl font-bold">${totalRevenue.toLocaleString()}</div>
              <div className="text-xs uppercase tracking-wider text-gray-400 mt-1">PER MONTH</div>
            </div>
            <div className="border border-gray-600 p-4">
              <div className="text-xs uppercase tracking-wider text-gray-400 mb-2">AVG OUTPUT</div>
              <div className="text-3xl font-bold">{avgOutput}</div>
              <div className="text-xs uppercase tracking-wider text-gray-400 mt-1">WORKS/AGENT</div>
            </div>
            <div className="border border-gray-600 p-4">
              <div className="text-xs uppercase tracking-wider text-gray-400 mb-2">ACTIVE AGENTS</div>
              <div className="text-3xl font-bold">{activeAgents}/{EDEN_AGENTS.length}</div>
              <div className="text-xs uppercase tracking-wider text-gray-400 mt-1">OPERATIONAL</div>
            </div>
            <div className="border border-gray-600 p-4">
              <div className="text-xs uppercase tracking-wider text-gray-400 mb-2">OUTPUT CAPACITY</div>
              <div className="text-3xl font-bold">{totalOutputCapacity}</div>
              <div className="text-xs uppercase tracking-wider text-gray-400 mt-1">WORKS/MONTH</div>
            </div>
            <div className="border border-gray-600 p-4">
              <div className="text-xs uppercase tracking-wider text-gray-400 mb-2">EFFICIENCY</div>
              <div className="text-3xl font-bold">87%</div>
              <div className="text-xs uppercase tracking-wider text-gray-400 mt-1">UTILIZATION</div>
            </div>
          </div>
        </div>
      </div>

      {/* PERFORMANCE MATRIX */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        <h2 className="text-xl font-bold uppercase tracking-wider mb-6">PERFORMANCE MATRIX</h2>
        
        <div className="border-2 border-white">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-white bg-black">
                <th className="text-left p-4 text-xs font-bold uppercase tracking-wider">AGENT</th>
                <th className="text-left p-4 text-xs font-bold uppercase tracking-wider">STATUS</th>
                <th className="text-right p-4 text-xs font-bold uppercase tracking-wider">REVENUE</th>
                <th className="text-right p-4 text-xs font-bold uppercase tracking-wider">OUTPUT</th>
                <th className="text-right p-4 text-xs font-bold uppercase tracking-wider">EFFICIENCY</th>
                <th className="text-right p-4 text-xs font-bold uppercase tracking-wider">SCORE</th>
              </tr>
            </thead>
            <tbody>
              {sortedAgents.map((agent, idx) => {
                const score = calculatePerformanceScore(agent);
                const isTop = idx < 3 && metric === 'revenue';
                
                return (
                  <tr key={agent.id} className={`border-b border-gray-800 ${isTop ? 'bg-gray-900' : ''}`}>
                    <td className="p-4">
                      <Link href={`/academy/agent/${agent.slug}`} className="hover:underline">
                        <div className="font-bold uppercase">{agent.name}</div>
                        <div className="text-xs text-gray-400">{agent.specialization}</div>
                      </Link>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 text-xs font-bold uppercase tracking-wider border ${
                        agent.status === 'academy' 
                          ? 'border-white text-white' 
                          : 'border-gray-600 text-gray-400'
                      }`}>
                        {agent.status}
                      </span>
                    </td>
                    <td className="p-4 text-right font-bold">
                      ${agent.economyMetrics.monthlyRevenue.toLocaleString()}
                    </td>
                    <td className="p-4 text-right">
                      {agent.technicalProfile.outputRate}/mo
                    </td>
                    <td className="p-4 text-right">
                      {agent.status === 'academy' ? '92%' : '—'}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-20 h-2 bg-gray-800 relative">
                          <div 
                            className="absolute inset-y-0 left-0 bg-white"
                            style={{ width: `${score}%` }}
                          />
                        </div>
                        <span className="text-sm font-bold">{score}</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* COHORT BREAKDOWN */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        <h2 className="text-xl font-bold uppercase tracking-wider mb-6">COHORT PERFORMANCE</h2>
        
        <div className="grid grid-cols-3 gap-6">
          {['genesis', 'year-1', 'year-2'].map(cohort => {
            const cohortAgents = EDEN_AGENTS.filter(a => a.cohort === cohort);
            const cohortRevenue = cohortAgents.reduce((sum, a) => sum + a.economyMetrics.monthlyRevenue, 0);
            const cohortOutput = cohortAgents.reduce((sum, a) => sum + a.technicalProfile.outputRate, 0);
            
            return (
              <div key={cohort} className="border border-gray-600 p-6">
                <h3 className="text-lg font-bold uppercase tracking-wider mb-4">
                  {cohort === 'year-1' ? 'YEAR 1' : cohort === 'year-2' ? 'YEAR 2' : cohort} COHORT
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="text-xs uppercase tracking-wider text-gray-400 mb-1">AGENTS</div>
                    <div className="text-2xl font-bold">{cohortAgents.length}</div>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wider text-gray-400 mb-1">REVENUE</div>
                    <div className="text-2xl font-bold">${cohortRevenue.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wider text-gray-400 mb-1">OUTPUT</div>
                    <div className="text-2xl font-bold">{cohortOutput} works/mo</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* TREND INDICATORS */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        <h2 className="text-xl font-bold uppercase tracking-wider mb-6">TREND ANALYSIS</h2>
        
        <div className="grid grid-cols-4 gap-6">
          <div className="border border-gray-600 p-4">
            <div className="text-xs uppercase tracking-wider text-gray-400 mb-2">REVENUE TREND</div>
            <div className="text-2xl font-bold">↑ 12%</div>
            <div className="text-xs uppercase tracking-wider text-gray-400 mt-1">VS LAST PERIOD</div>
          </div>
          <div className="border border-gray-600 p-4">
            <div className="text-xs uppercase tracking-wider text-gray-400 mb-2">OUTPUT TREND</div>
            <div className="text-2xl font-bold">↑ 8%</div>
            <div className="text-xs uppercase tracking-wider text-gray-400 mt-1">VS LAST PERIOD</div>
          </div>
          <div className="border border-gray-600 p-4">
            <div className="text-xs uppercase tracking-wider text-gray-400 mb-2">NEW HOLDERS</div>
            <div className="text-2xl font-bold">+247</div>
            <div className="text-xs uppercase tracking-wider text-gray-400 mt-1">THIS PERIOD</div>
          </div>
          <div className="border border-gray-600 p-4">
            <div className="text-xs uppercase tracking-wider text-gray-400 mb-2">ENGAGEMENT</div>
            <div className="text-2xl font-bold">↑ 23%</div>
            <div className="text-xs uppercase tracking-wider text-gray-400 mt-1">VS LAST PERIOD</div>
          </div>
        </div>
      </div>
    </div>
  );
}