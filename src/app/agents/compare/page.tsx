'use client';

import { useState } from 'react';
import { agentService } from '@/data/agents-registry';
import { EDEN_AGENTS } from '@/data/eden-agents-manifest';
import Link from 'next/link';

// Force dynamic rendering to avoid build issues
export const dynamic = 'force-dynamic';

export default function AgentComparisonPage() {
  const [selectedAgents, setSelectedAgents] = useState<string[]>([
    'abraham-001',
    'solienne-002',
    'miyomi-003'
  ]);

  const toggleAgent = (agentId: string) => {
    if (selectedAgents.includes(agentId)) {
      setSelectedAgents(selectedAgents.filter(id => id !== agentId));
    } else if (selectedAgents.length < 4) {
      setSelectedAgents([...selectedAgents, agentId]);
    }
  };

  const compareAgents = EDEN_AGENTS.filter(agent => 
    selectedAgents.includes(agent.id)
  );

  return (
    <div className="min-h-screen bg-black text-white">
      {/* HEADER */}
      <header className="border-b-2 border-white p-8">
        <div className="max-w-7xl mx-auto">
          <Link href="/agents" className="text-xs uppercase tracking-wider text-gray-400 hover:text-white mb-4 inline-block">
            ← BACK TO AGENTS
          </Link>
          <h1 className="text-6xl font-bold uppercase tracking-wider mb-4">
            COMPARE AGENTS
          </h1>
          <p className="text-sm uppercase tracking-wide text-gray-400">
            ANALYZE UP TO 4 AGENTS SIDE BY SIDE
          </p>
        </div>
      </header>

      {/* AGENT SELECTOR */}
      <div className="border-b border-gray-800 bg-gray-900 p-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-sm font-bold uppercase tracking-wider mb-4 text-gray-400">
            SELECT AGENTS TO COMPARE ({selectedAgents.length}/4 SELECTED)
          </h2>
          <div className="flex flex-wrap gap-2">
            {EDEN_AGENTS.map(agent => (
              <button
                key={agent.id}
                onClick={() => toggleAgent(agent.id)}
                disabled={!selectedAgents.includes(agent.id) && selectedAgents.length >= 4}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border transition-all ${
                  selectedAgents.includes(agent.id)
                    ? 'bg-white text-black border-white'
                    : 'bg-black text-white border-gray-600 hover:border-white disabled:opacity-50 disabled:hover:border-gray-600'
                }`}
              >
                {agent.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* COMPARISON TABLE */}
      <div className="max-w-7xl mx-auto p-8">
        {compareAgents.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 uppercase tracking-wider">
              SELECT AGENTS TO BEGIN COMPARISON
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-white">
                  <th className="text-left p-4 text-xs font-bold uppercase tracking-wider">
                    ATTRIBUTE
                  </th>
                  {compareAgents.map(agent => (
                    <th key={agent.id} className="text-left p-4">
                      <div className="text-xl font-bold uppercase tracking-wider mb-1">
                        {agent.name}
                      </div>
                      <div className="text-xs uppercase tracking-wide text-gray-400">
                        {agent.cohort} COHORT
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* STATUS */}
                <tr className="border-b border-gray-800">
                  <td className="p-4 text-xs uppercase tracking-wider text-gray-400">STATUS</td>
                  {compareAgents.map(agent => (
                    <td key={agent.id} className="p-4">
                      <span className={`px-2 py-1 text-xs font-bold uppercase tracking-wider border ${
                        agent.status === 'academy' 
                          ? 'border-white text-white' 
                          : 'border-gray-600 text-gray-400'
                      }`}>
                        {agent.status}
                      </span>
                    </td>
                  ))}
                </tr>

                {/* SPECIALIZATION */}
                <tr className="border-b border-gray-800">
                  <td className="p-4 text-xs uppercase tracking-wider text-gray-400">SPECIALIZATION</td>
                  {compareAgents.map(agent => (
                    <td key={agent.id} className="p-4 text-sm">
                      {agent.specialization}
                    </td>
                  ))}
                </tr>

                {/* TRAINER */}
                <tr className="border-b border-gray-800">
                  <td className="p-4 text-xs uppercase tracking-wider text-gray-400">TRAINER</td>
                  {compareAgents.map(agent => (
                    <td key={agent.id} className="p-4 text-sm font-bold uppercase">
                      {agent.trainer}
                    </td>
                  ))}
                </tr>

                {/* LAUNCH DATE */}
                <tr className="border-b border-gray-800">
                  <td className="p-4 text-xs uppercase tracking-wider text-gray-400">LAUNCH DATE</td>
                  {compareAgents.map(agent => (
                    <td key={agent.id} className="p-4 text-sm font-bold">
                      {new Date(agent.launchDate).toLocaleDateString('en-US', { 
                        month: 'short', 
                        year: 'numeric' 
                      })}
                    </td>
                  ))}
                </tr>

                {/* ECONOMICS SECTION */}
                <tr className="border-b-2 border-white bg-gray-900">
                  <td colSpan={compareAgents.length + 1} className="p-4 text-sm font-bold uppercase tracking-wider">
                    ECONOMICS
                  </td>
                </tr>

                {/* MONTHLY REVENUE */}
                <tr className="border-b border-gray-800">
                  <td className="p-4 text-xs uppercase tracking-wider text-gray-400">MONTHLY REVENUE</td>
                  {compareAgents.map(agent => {
                    const maxRevenue = Math.max(...compareAgents.map(a => a.economyMetrics.monthlyRevenue));
                    const isMax = agent.economyMetrics.monthlyRevenue === maxRevenue;
                    return (
                      <td key={agent.id} className={`p-4 text-lg font-bold ${isMax ? 'text-white' : 'text-gray-400'}`}>
                        ${agent.economyMetrics.monthlyRevenue.toLocaleString()}
                      </td>
                    );
                  })}
                </tr>

                {/* TOKEN SUPPLY */}
                <tr className="border-b border-gray-800">
                  <td className="p-4 text-xs uppercase tracking-wider text-gray-400">TOKEN SUPPLY</td>
                  {compareAgents.map(agent => (
                    <td key={agent.id} className="p-4 text-sm">
                      1B TOKENS
                    </td>
                  ))}
                </tr>

                {/* TECHNICAL SECTION */}
                <tr className="border-b-2 border-white bg-gray-900">
                  <td colSpan={compareAgents.length + 1} className="p-4 text-sm font-bold uppercase tracking-wider">
                    TECHNICAL PROFILE
                  </td>
                </tr>

                {/* MODEL */}
                <tr className="border-b border-gray-800">
                  <td className="p-4 text-xs uppercase tracking-wider text-gray-400">MODEL</td>
                  {compareAgents.map(agent => (
                    <td key={agent.id} className="p-4 text-sm">
                      {agent.technicalProfile.model}
                    </td>
                  ))}
                </tr>

                {/* OUTPUT RATE */}
                <tr className="border-b border-gray-800">
                  <td className="p-4 text-xs uppercase tracking-wider text-gray-400">OUTPUT/MONTH</td>
                  {compareAgents.map(agent => {
                    const maxOutput = Math.max(...compareAgents.map(a => a.technicalProfile.outputRate));
                    const isMax = agent.technicalProfile.outputRate === maxOutput;
                    return (
                      <td key={agent.id} className={`p-4 text-lg font-bold ${isMax ? 'text-white' : 'text-gray-400'}`}>
                        {agent.technicalProfile.outputRate}
                      </td>
                    );
                  })}
                </tr>

                {/* CAPABILITIES */}
                <tr className="border-b border-gray-800">
                  <td className="p-4 text-xs uppercase tracking-wider text-gray-400">CAPABILITIES</td>
                  {compareAgents.map(agent => (
                    <td key={agent.id} className="p-4">
                      <div className="flex flex-wrap gap-2">
                        {agent.technicalProfile.capabilities.map((cap) => (
                          <span 
                            key={cap}
                            className="px-2 py-1 text-xs uppercase tracking-wider border border-gray-600"
                          >
                            {cap}
                          </span>
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* INTEGRATIONS */}
                <tr className="border-b border-gray-800">
                  <td className="p-4 text-xs uppercase tracking-wider text-gray-400">INTEGRATIONS</td>
                  {compareAgents.map(agent => (
                    <td key={agent.id} className="p-4">
                      <div className="space-y-1">
                        {agent.technicalProfile.integrations.map((int) => (
                          <div key={int} className="text-xs uppercase tracking-wide text-gray-400">
                            {int}
                          </div>
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* BRAND SECTION */}
                <tr className="border-b-2 border-white bg-gray-900">
                  <td colSpan={compareAgents.length + 1} className="p-4 text-sm font-bold uppercase tracking-wider">
                    BRAND IDENTITY
                  </td>
                </tr>

                {/* VOICE */}
                <tr className="border-b border-gray-800">
                  <td className="p-4 text-xs uppercase tracking-wider text-gray-400">VOICE</td>
                  {compareAgents.map(agent => (
                    <td key={agent.id} className="p-4 text-sm italic">
                      "{agent.brandIdentity.voice}"
                    </td>
                  ))}
                </tr>

                {/* SOCIAL */}
                <tr className="border-b border-gray-800">
                  <td className="p-4 text-xs uppercase tracking-wider text-gray-400">SOCIAL PRESENCE</td>
                  {compareAgents.map(agent => (
                    <td key={agent.id} className="p-4">
                      <div className="space-y-1">
                        {agent.socialProfiles.twitter && (
                          <div className="text-xs uppercase tracking-wide">
                            TWITTER: {agent.socialProfiles.twitter}
                          </div>
                        )}
                        {agent.socialProfiles.farcaster && (
                          <div className="text-xs uppercase tracking-wide">
                            FARCASTER: {agent.socialProfiles.farcaster}
                          </div>
                        )}
                        {agent.socialProfiles.website && (
                          <div className="text-xs uppercase tracking-wide">
                            WEB: {agent.socialProfiles.website}
                          </div>
                        )}
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* COMPARISON INSIGHTS */}
        {compareAgents.length >= 2 && (
          <div className="mt-12 p-8 border-2 border-white">
            <h2 className="text-xl font-bold uppercase tracking-wider mb-6">
              COMPARISON INSIGHTS
            </h2>
            
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-gray-400">
                  ECONOMIC LEADER
                </h3>
                <div className="text-2xl font-bold uppercase">
                  {compareAgents.reduce((prev, curr) => 
                    curr.economyMetrics.monthlyRevenue > prev.economyMetrics.monthlyRevenue ? curr : prev
                  ).name}
                </div>
                <div className="text-sm text-gray-400 mt-1">
                  HIGHEST MONTHLY REVENUE
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-gray-400">
                  OUTPUT CHAMPION
                </h3>
                <div className="text-2xl font-bold uppercase">
                  {compareAgents.reduce((prev, curr) => 
                    curr.technicalProfile.outputRate > prev.technicalProfile.outputRate ? curr : prev
                  ).name}
                </div>
                <div className="text-sm text-gray-400 mt-1">
                  HIGHEST OUTPUT RATE
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-gray-400">
                  COMBINED REVENUE
                </h3>
                <div className="text-2xl font-bold">
                  ${compareAgents.reduce((sum, agent) => 
                    sum + agent.economyMetrics.monthlyRevenue, 0
                  ).toLocaleString()}
                </div>
                <div className="text-sm text-gray-400 mt-1">
                  MONTHLY TOTAL
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-gray-400">
                  COMBINED OUTPUT
                </h3>
                <div className="text-2xl font-bold">
                  {compareAgents.reduce((sum, agent) => 
                    sum + agent.technicalProfile.outputRate, 0
                  )}
                </div>
                <div className="text-sm text-gray-400 mt-1">
                  WORKS PER MONTH
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}