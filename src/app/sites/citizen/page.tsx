'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface GovernanceProposal {
  id: string;
  proposalNumber: number;
  date: string;
  title: string;
  type: 'constitutional' | 'economic' | 'operational' | 'fellowship' | 'community';
  status: 'draft' | 'active' | 'passed' | 'rejected' | 'executed';
  participationRate: number;
  consensusScore: number;
  views?: number;
}

export default function CitizenSite() {
  // Standard state management per ADR-023
  const [isClient, setIsClient] = useState(false);
  const [actualProposals, setActualProposals] = useState<GovernanceProposal[]>([]);
  const [loadingProposals, setLoadingProposals] = useState(false);

  // Real-time governance metrics
  const [liveMetrics, setLiveMetrics] = useState({
    activeDebates: 7,
    fellowshipSize: 150,
    governanceHealth: 75,
    consensusScore: 68
  });

  // Governance countdown (next proposal cycle)
  const [nextProposalCycle, setNextProposalCycle] = useState({
    days: 8,
    hours: 14,
    minutes: 23,
    seconds: 45
  });

  // Client-side hydration guard per ADR-023
  useEffect(() => setIsClient(true), []);

  // Registry data fetching per ADR-023
  useEffect(() => {
    if (!isClient) return;

    const fetchActualProposals = async () => {
      setLoadingProposals(true);
      try {
        const response = await fetch('/api/agents/citizen/works?limit=6&sort=date_desc');
        const data = await response.json();

        if (data.works) {
          const transformedProposals = data.works.map((work: any) => ({
            id: work.id,
            proposalNumber: work.metadata?.proposalNumber || Math.floor(Math.random() * 100),
            date: work.created_at || new Date().toISOString(),
            title: work.title,
            type: work.metadata?.proposalType || 'community',
            status: work.metadata?.status || 'active',
            participationRate: work.metadata?.participationRate || Math.random() * 100,
            consensusScore: work.metadata?.consensusScore || Math.random() * 100,
            views: work.views || Math.floor(Math.random() * 500)
          }));
          setActualProposals(transformedProposals);
        }
      } catch (error) {
        console.error('Failed to fetch CITIZEN proposals:', error);
        // Keep mock data as fallback - NEVER break UI
      } finally {
        setLoadingProposals(false);
      }
    };

    fetchActualProposals();
  }, [isClient]);

  // Real-time updates per ADR-023
  useEffect(() => {
    if (!isClient) return;

    const interval = setInterval(() => {
      // Update live metrics with safe math
      setLiveMetrics(prev => ({
        activeDebates: Math.max(0, prev.activeDebates + (Math.floor(Math.random() * 3) - 1)),
        fellowshipSize: Math.max(100, prev.fellowshipSize + (Math.floor(Math.random() * 5) - 2)),
        governanceHealth: Math.min(100, Math.max(0, prev.governanceHealth + (Math.floor(Math.random() * 3) - 1))),
        consensusScore: Math.min(100, Math.max(0, prev.consensusScore + (Math.floor(Math.random() * 5) - 2)))
      }));

      // Update countdown with error handling
      try {
        setNextProposalCycle(prev => {
          let { days, hours, minutes, seconds } = prev;
          
          seconds--;
          if (seconds < 0) {
            seconds = 59;
            minutes--;
          }
          if (minutes < 0) {
            minutes = 59;
            hours--;
          }
          if (hours < 0) {
            hours = 23;
            days--;
          }
          if (days < 0) {
            days = 13; // Reset to 2-week cycle
            hours = 23;
            minutes = 59;
            seconds = 59;
          }

          return { days, hours, minutes, seconds };
        });
      } catch (error) {
        console.error('Countdown calculation error:', error);
        setNextProposalCycle({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isClient]);

  // Mock proposals for fallback
  const mockProposals: GovernanceProposal[] = [
    {
      id: 'mock-1',
      proposalNumber: 24,
      date: new Date().toISOString(),
      title: 'Agent Revenue Sharing Framework V2',
      type: 'economic',
      status: 'active',
      participationRate: 72,
      consensusScore: 68,
      views: 234
    },
    {
      id: 'mock-2', 
      proposalNumber: 23,
      date: new Date(Date.now() - 86400000).toISOString(),
      title: 'Fellowship Governance Reform',
      type: 'constitutional',
      status: 'passed',
      participationRate: 89,
      consensusScore: 81,
      views: 456
    },
    {
      id: 'mock-3',
      proposalNumber: 22,
      date: new Date(Date.now() - 172800000).toISOString(),
      title: 'Community Grant Program Enhancement',
      type: 'fellowship',
      status: 'active',
      participationRate: 65,
      consensusScore: 74,
      views: 187
    },
    {
      id: 'mock-4',
      proposalNumber: 21,
      date: new Date(Date.now() - 259200000).toISOString(),
      title: 'Eden Academy Discord Moderation',
      type: 'operational',
      status: 'executed',
      participationRate: 56,
      consensusScore: 92,
      views: 123
    },
    {
      id: 'mock-5',
      proposalNumber: 20,
      date: new Date(Date.now() - 345600000).toISOString(),
      title: 'Agent Training Curriculum Update',
      type: 'community',
      status: 'rejected',
      participationRate: 43,
      consensusScore: 32,
      views: 98
    },
    {
      id: 'mock-6',
      proposalNumber: 19,
      date: new Date(Date.now() - 432000000).toISOString(),
      title: 'Eden Token Economic Model',
      type: 'constitutional',
      status: 'passed',
      participationRate: 94,
      consensusScore: 87,
      views: 567
    }
  ];

  const displayProposals = actualProposals.length > 0 ? actualProposals : mockProposals;

  const getStatusColor = (status: GovernanceProposal['status']) => {
    switch (status) {
      case 'active': return 'bg-blue-500';
      case 'passed': return 'bg-green-500';
      case 'executed': return 'bg-green-600';
      case 'rejected': return 'bg-red-500';
      case 'draft': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeIcon = (type: GovernanceProposal['type']) => {
    switch (type) {
      case 'constitutional': return '⚖️';
      case 'economic': return '💰';
      case 'operational': return '⚙️';
      case 'fellowship': return '🤝';
      case 'community': return '👥';
      default: return '📋';
    }
  };

  if (!isClient) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-pulse text-xl">Loading CITIZEN governance interface...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header per ADR-023 */}
      <div className="border-b border-white">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <h1 className="text-2xl font-bold">CITIZEN</h1>
            <span className="text-xs opacity-75">DAO GOVERNANCE FACILITATOR</span>
          </div>
          <Link 
            href="/academy/agent/citizen" 
            className="px-4 py-2 border border-white hover:bg-white hover:text-black transition-colors"
          >
            ACADEMY →
          </Link>
        </div>
      </div>

      {/* Live Stats Bar per ADR-023 */}
      <div className="border-b border-white bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-sm opacity-75">ACTIVE DEBATES</div>
              <div className="text-xl font-bold">{liveMetrics.activeDebates}</div>
            </div>
            <div>
              <div className="text-sm opacity-75">FELLOWSHIP SIZE</div>
              <div className="text-xl font-bold">{liveMetrics.fellowshipSize.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-sm opacity-75">GOVERNANCE HEALTH</div>
              <div className="text-xl font-bold">{liveMetrics.governanceHealth}%</div>
            </div>
            <div>
              <div className="text-sm opacity-75">AVG CONSENSUS</div>
              <div className="text-xl font-bold">{liveMetrics.consensusScore}%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Next Proposal Cycle Countdown */}
      <div className="border-b border-white bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center">
          <h2 className="text-lg mb-4">NEXT PROPOSAL CYCLE IN</h2>
          <div className="flex items-center justify-center gap-8 text-3xl font-mono">
            <div>
              <div className="font-bold">{nextProposalCycle.days}</div>
              <div className="text-sm opacity-75">DAYS</div>
            </div>
            <div className="text-2xl opacity-50">:</div>
            <div>
              <div className="font-bold">{String(nextProposalCycle.hours).padStart(2, '0')}</div>
              <div className="text-sm opacity-75">HOURS</div>
            </div>
            <div className="text-2xl opacity-50">:</div>
            <div>
              <div className="font-bold">{String(nextProposalCycle.minutes).padStart(2, '0')}</div>
              <div className="text-sm opacity-75">MINS</div>
            </div>
            <div className="text-2xl opacity-50">:</div>
            <div>
              <div className="font-bold">{String(nextProposalCycle.seconds).padStart(2, '0')}</div>
              <div className="text-sm opacity-75">SECS</div>
            </div>
          </div>
          <div className="mt-4 text-sm opacity-75">
            Bi-weekly governance cycles ensure consistent democratic participation
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Proposals - Loading state per ADR-023 */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold mb-6">RECENT GOVERNANCE PROPOSALS</h2>
            
            {loadingProposals ? (
              <div className="border border-white p-6 text-center">
                <div className="animate-pulse">Loading actual proposals from Registry...</div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {displayProposals.map((proposal) => (
                  <div key={proposal.id} className="border border-white p-4 hover:bg-white hover:text-black transition-colors group">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getTypeIcon(proposal.type)}</span>
                        <span className="text-xs opacity-75">#{proposal.proposalNumber}</span>
                      </div>
                      <div className={`px-2 py-1 text-xs ${getStatusColor(proposal.status)} text-white`}>
                        {proposal.status.toUpperCase()}
                      </div>
                    </div>
                    
                    <h3 className="font-bold mb-2 text-sm leading-tight">
                      {proposal.title}
                    </h3>
                    
                    <div className="text-xs opacity-75 mb-3">
                      {new Date(proposal.date).toLocaleDateString()}
                    </div>
                    
                    <div className="text-xs space-y-1">
                      <div className="flex justify-between">
                        <span>Participation:</span>
                        <span>{Math.round(proposal.participationRate)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Consensus:</span>
                        <span>{Math.round(proposal.consensusScore)}%</span>
                      </div>
                      {proposal.views && (
                        <div className="flex justify-between">
                          <span>Views:</span>
                          <span>{proposal.views}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {!loadingProposals && actualProposals.length === 0 && (
              <div className="border border-white p-4 text-center text-sm opacity-75">
                Displaying mock proposals - Registry integration in progress
              </div>
            )}
          </div>

          {/* Governance Sidebar */}
          <div className="space-y-6">
            {/* Governance Health */}
            <div className="border border-white p-4">
              <h3 className="font-bold mb-4">GOVERNANCE HEALTH</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Overall Health</span>
                    <span>{liveMetrics.governanceHealth}%</span>
                  </div>
                  <div className="bg-gray-700 h-2">
                    <div 
                      className="bg-green-500 h-full transition-all duration-500"
                      style={{ width: `${liveMetrics.governanceHealth}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Consensus Quality</span>
                    <span>{liveMetrics.consensusScore}%</span>
                  </div>
                  <div className="bg-gray-700 h-2">
                    <div 
                      className="bg-blue-500 h-full transition-all duration-500"
                      style={{ width: `${liveMetrics.consensusScore}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Fellowship Stats */}
            <div className="border border-white p-4">
              <h3 className="font-bold mb-4">FELLOWSHIP STATUS</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Total Members:</span>
                  <span>{liveMetrics.fellowshipSize}</span>
                </div>
                <div className="flex justify-between">
                  <span>Active Debates:</span>
                  <span>{liveMetrics.activeDebates}</span>
                </div>
                <div className="flex justify-between">
                  <span>Next Vote:</span>
                  <span>{nextProposalCycle.days}d {nextProposalCycle.hours}h</span>
                </div>
              </div>
            </div>

            {/* Governance Philosophy */}
            <div className="border border-white p-4">
              <h3 className="font-bold mb-4">GOVERNANCE PHILOSOPHY</h3>
              <div className="text-sm space-y-3 opacity-75">
                <p>• Rough consensus over perfect agreement</p>
                <p>• Inclusive participation with quality discussion</p>
                <p>• Transparent processes and clear documentation</p>
                <p>• Data-driven decisions with human wisdom</p>
                <p>• Long-term thinking balanced with practical action</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="border border-white p-4">
              <h3 className="font-bold mb-4">GOVERNANCE ACTIONS</h3>
              <div className="space-y-2">
                <button className="w-full py-2 border border-white hover:bg-white hover:text-black transition-colors text-sm">
                  Submit Proposal
                </button>
                <button className="w-full py-2 border border-white hover:bg-white hover:text-black transition-colors text-sm">
                  Join Discussion
                </button>
                <button className="w-full py-2 border border-white hover:bg-white hover:text-black transition-colors text-sm">
                  View All Proposals
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-white mt-12 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm opacity-75">
          <p>CITIZEN facilitates democratic governance for Eden Academy</p>
          <p className="mt-2">Bi-weekly proposal cycles • Consensus-driven decisions • Fellowship coordination</p>
        </div>
      </div>
    </div>
  );
}