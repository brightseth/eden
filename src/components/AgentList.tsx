'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Users, TrendingUp, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { safeStatusFormat } from '@/lib/utils';
import { PublicAgent, isValidAgent } from '@/types';
import { AgentProfileErrorBoundary } from '@/components/error-boundary/AgentProfileErrorBoundary';

export function AgentList() {
  const [agents, setAgents] = useState<PublicAgent[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function fetchAgents() {
      try {
        console.log('🚀 Fetching agent list...');
        const response = await fetch('/api/agents');
        if (!response.ok) throw new Error('Failed to fetch');
        
        const data = await response.json();
        const agentList = (data.agents || []).filter(isValidAgent); // Filter out invalid agents
        
        console.log('✅ Got agents:', agentList.length);
        setAgents(agentList);
        setLoading(false);
      } catch (error) {
        console.error('❌ Failed to fetch agents:', error);
        setLoading(false);
      }
    }
    
    fetchAgents();
  }, []);

  const getTrainerStatusIcon = (trainer: string) => {
    const confirmedTrainers = ['Gene Kogan', 'Kristi Coronado', 'Martin & Colin (Lattice)', 'Xander', 'Seth Goldstein'];
    if (confirmedTrainers.some(confirmed => trainer.includes(confirmed.split(' ')[0]))) {
      return <CheckCircle className="w-4 h-4 text-green-400" />;
    }
    return <AlertCircle className="w-4 h-4 text-red-400" />;
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'border-green-400 text-green-400';
      case 'training': return 'border-blue-400 text-blue-400';
      default: return 'border-yellow-400 text-yellow-400';
    }
  };
  
  if (loading) {
    return <div className="text-center py-8">Loading agents...</div>;
  }

  if (agents.length === 0) {
    return <div className="text-center py-8">No agents found</div>;
  }

  return (
    <AgentProfileErrorBoundary>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {agents.map(agent => (
        <div key={agent.id} className="border border-white p-6">
          {/* Hero Image */}
          {agent.hero_image_url && (
            <div className="mb-4 -mx-6 -mt-6">
              <img 
                src={agent.hero_image_url} 
                alt={`${agent.name} hero`}
                className="w-full h-32 object-cover"
              />
            </div>
          )}

          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-bold">{agent.name.toUpperCase()}</h3>
            <span className={`px-2 py-1 text-xs border rounded ${getStatusColor(agent.status || 'developing')}`}>
              {safeStatusFormat(agent.status)}
            </span>
          </div>
          <p className="text-sm text-gray-400 mb-2">{agent.tagline}</p>
          <div className="text-xs text-gray-400 mb-4">Launch: Coming Soon</div>
          
          {/* Latest Work Preview */}
          {agent.sample_works && agent.sample_works.length > 0 && (
            <div className="mb-4 p-3 bg-gray-900 rounded">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-gray-400" />
                <span className="text-xs text-gray-400">LATEST WORK</span>
              </div>
              <div className="text-sm font-bold mb-1">{agent.sample_works[0].title}</div>
              <div className="text-xs text-gray-400">{agent.sample_works[0].description}</div>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-gray-900 p-3 rounded">
              <div className="flex items-center gap-2 mb-1">
                <Users className="w-4 h-4 text-gray-400" />
                <span className="text-xs text-gray-400">TRAINER</span>
                {getTrainerStatusIcon(agent.trainer)}
              </div>
              <div className="text-sm font-bold">{agent.trainer}</div>
            </div>
            <div className="bg-gray-900 p-3 rounded">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-gray-400" />
                <span className="text-xs text-gray-400">WORKS</span>
              </div>
              <div className="text-sm font-bold">{agent.day_count.toLocaleString()}</div>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <Link 
              href={`/academy/agent/${agent.id}`}
              className="text-sm hover:bg-white hover:text-black px-3 py-1 border border-white transition-all"
            >
              VIEW PROFILE →
            </Link>
          </div>
        </div>
      ))}
      </div>
    </AgentProfileErrorBoundary>
  );
}