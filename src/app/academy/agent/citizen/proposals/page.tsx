'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Vote, Clock, CheckCircle, XCircle, Users, TrendingUp, AlertCircle } from 'lucide-react';
import { UnifiedHeader } from '@/components/layout/UnifiedHeader';

interface Proposal {
  id: string;
  number: number;
  title: string;
  description: string;
  type: 'constitutional' | 'economic' | 'operational' | 'fellowship' | 'community';
  status: 'draft' | 'active' | 'passed' | 'rejected' | 'expired';
  created_at: string;
  voting: {
    for: number;
    against: number;
    abstain: number;
    participationRate: number;
  };
  metadata: {
    impactScope: 'low' | 'medium' | 'high';
    urgency: 'low' | 'medium' | 'high';
    complexityScore: number;
    consensusScore: number;
    stakeholderAlignment: number;
  };
}

interface ProposalsData {
  proposals: Proposal[];
  governance_context: {
    total_proposals: number;
    active_proposals: number;
    participation_rate: number;
    consensus_threshold: number;
  };
}

export default function CitizenProposalsPage() {
  const [proposalsData, setProposalsData] = useState<ProposalsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');

  useEffect(() => {
    async function fetchProposals() {
      try {
        const params = new URLSearchParams();
        if (filterStatus !== 'all') params.append('status', filterStatus);
        if (filterType !== 'all') params.append('type', filterType);
        
        const response = await fetch(`/api/agents/citizen/proposals?${params}`);
        if (!response.ok) throw new Error('Failed to fetch');
        
        const data = await response.json();
        setProposalsData(data);
      } catch (error) {
        console.error('Failed to load proposals:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProposals();
  }, [filterStatus, filterType]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-blue-400 border-blue-400';
      case 'passed': return 'text-green-400 border-green-400';
      case 'rejected': return 'text-red-400 border-red-400';
      case 'draft': return 'text-yellow-400 border-yellow-400';
      case 'expired': return 'text-gray-400 border-gray-400';
      default: return 'text-gray-400 border-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Vote className="w-4 h-4" />;
      case 'passed': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      case 'draft': return <Clock className="w-4 h-4" />;
      case 'expired': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'constitutional': return 'bg-purple-900/30 text-purple-300';
      case 'economic': return 'bg-green-900/30 text-green-300';
      case 'operational': return 'bg-blue-900/30 text-blue-300';
      case 'fellowship': return 'bg-orange-900/30 text-orange-300';
      case 'community': return 'bg-pink-900/30 text-pink-300';
      default: return 'bg-gray-900/30 text-gray-300';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <UnifiedHeader />
        <div className="max-w-6xl mx-auto px-6 py-16 text-center">
          <div className="text-xl">Loading CITIZEN Governance Proposals...</div>
        </div>
      </div>
    );
  }

  if (!proposalsData) {
    return (
      <div className="min-h-screen bg-black text-white">
        <UnifiedHeader />
        <div className="max-w-6xl mx-auto px-6 py-16 text-center">
          <div className="text-xl text-red-400">Failed to load proposals data</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <UnifiedHeader />
      
      {/* Back Navigation */}
      <div className="border-b border-white">
        <div className="max-w-6xl mx-auto px-6 py-3">
          <Link 
            href="/academy/agent/citizen" 
            className="inline-flex items-center gap-2 text-sm hover:bg-white hover:text-black px-2 py-1 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            BACK TO CITIZEN
          </Link>
        </div>
      </div>

      {/* Header */}
      <div className="border-b border-white">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <h1 className="text-6xl mb-4">GOVERNANCE PROPOSALS</h1>
            <p className="text-xl mb-8">
              Community-driven governance for Eden Academy & Bright Moments DAO
            </p>
          </div>

          {/* Governance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="text-center border border-white p-4">
              <div className="text-2xl mb-1">{proposalsData.governance_context.total_proposals}</div>
              <div className="text-sm text-gray-400">TOTAL PROPOSALS</div>
            </div>
            <div className="text-center border border-white p-4">
              <div className="text-2xl mb-1">{proposalsData.governance_context.active_proposals}</div>
              <div className="text-sm text-gray-400">ACTIVE VOTING</div>
            </div>
            <div className="text-center border border-white p-4">
              <div className="text-2xl mb-1">{proposalsData.governance_context.participation_rate}%</div>
              <div className="text-sm text-gray-400">PARTICIPATION RATE</div>
            </div>
            <div className="text-center border border-white p-4">
              <div className="text-2xl mb-1">{proposalsData.governance_context.consensus_threshold}%</div>
              <div className="text-sm text-gray-400">CONSENSUS REQUIRED</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">STATUS:</span>
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-black border border-white text-white px-3 py-1 text-sm"
            >
              <option value="all">ALL</option>
              <option value="active">ACTIVE</option>
              <option value="passed">PASSED</option>
              <option value="draft">DRAFT</option>
              <option value="rejected">REJECTED</option>
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">TYPE:</span>
            <select 
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-black border border-white text-white px-3 py-1 text-sm"
            >
              <option value="all">ALL</option>
              <option value="constitutional">CONSTITUTIONAL</option>
              <option value="economic">ECONOMIC</option>
              <option value="operational">OPERATIONAL</option>
              <option value="fellowship">FELLOWSHIP</option>
              <option value="community">COMMUNITY</option>
            </select>
          </div>
        </div>

        {/* Proposals List */}
        <div className="space-y-6">
          {proposalsData.proposals.map((proposal) => (
            <div key={proposal.id} className="border border-white p-6 hover:bg-white hover:text-black transition-all group">
              <div className="flex flex-col md:flex-row md:items-start gap-6">
                {/* Left Column - Main Info */}
                <div className="md:w-2/3">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm text-gray-400 group-hover:text-gray-600">#{proposal.number}</span>
                        <div className={`inline-flex items-center gap-2 px-2 py-1 text-xs border rounded ${getStatusColor(proposal.status)}`}>
                          {getStatusIcon(proposal.status)}
                          {proposal.status.toUpperCase()}
                        </div>
                        <div className={`px-2 py-1 text-xs rounded ${getTypeColor(proposal.type)}`}>
                          {proposal.type.toUpperCase()}
                        </div>
                      </div>
                      <h3 className="text-xl font-bold mb-3">{proposal.title}</h3>
                      <p className="text-sm mb-4">{proposal.description}</p>
                    </div>
                  </div>

                  {/* Voting Results */}
                  {proposal.status !== 'draft' && (
                    <div className="mb-4">
                      <div className="flex items-center gap-6 text-sm">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-400" />
                          <span>{proposal.voting.for} FOR</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <XCircle className="w-4 h-4 text-red-400" />
                          <span>{proposal.voting.against} AGAINST</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span>{proposal.voting.abstain} ABSTAIN</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-blue-400" />
                          <span>{proposal.voting.participationRate}% PARTICIPATION</span>
                        </div>
                      </div>

                      {/* Voting Bar */}
                      <div className="mt-3">
                        <div className="flex h-2 rounded overflow-hidden">
                          <div 
                            className="bg-green-400" 
                            style={{ 
                              width: `${(proposal.voting.for / (proposal.voting.for + proposal.voting.against + proposal.voting.abstain)) * 100}%` 
                            }}
                          ></div>
                          <div 
                            className="bg-red-400" 
                            style={{ 
                              width: `${(proposal.voting.against / (proposal.voting.for + proposal.voting.against + proposal.voting.abstain)) * 100}%` 
                            }}
                          ></div>
                          <div 
                            className="bg-gray-400" 
                            style={{ 
                              width: `${(proposal.voting.abstain / (proposal.voting.for + proposal.voting.against + proposal.voting.abstain)) * 100}%` 
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column - Metadata */}
                <div className="md:w-1/3 space-y-4">
                  <div className="text-xs text-gray-400 group-hover:text-gray-600">
                    {new Date(proposal.created_at).toLocaleDateString()}
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-400 group-hover:text-gray-600">IMPACT</span>
                      <span className={`text-xs font-bold ${
                        proposal.metadata.impactScope === 'high' ? 'text-red-400' :
                        proposal.metadata.impactScope === 'medium' ? 'text-yellow-400' : 'text-green-400'
                      }`}>
                        {proposal.metadata.impactScope.toUpperCase()}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-400 group-hover:text-gray-600">URGENCY</span>
                      <span className={`text-xs font-bold ${getUrgencyColor(proposal.metadata.urgency)}`}>
                        {proposal.metadata.urgency.toUpperCase()}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-400 group-hover:text-gray-600">COMPLEXITY</span>
                      <span className="text-xs font-bold">
                        {Math.round(proposal.metadata.complexityScore * 100)}%
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-400 group-hover:text-gray-600">CONSENSUS</span>
                      <span className="text-xs font-bold">
                        {Math.round(proposal.metadata.consensusScore * 100)}%
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-400 group-hover:text-gray-600">ALIGNMENT</span>
                      <span className="text-xs font-bold">
                        {Math.round(proposal.metadata.stakeholderAlignment * 100)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {proposalsData.proposals.length === 0 && (
          <div className="text-center py-12">
            <div className="text-xl text-gray-400">No proposals match your current filters</div>
            <button 
              onClick={() => { setFilterStatus('all'); setFilterType('all'); }}
              className="mt-4 px-4 py-2 border border-white hover:bg-white hover:text-black transition-all"
            >
              SHOW ALL PROPOSALS
            </button>
          </div>
        )}
      </div>
    </div>
  );
}