'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { UnifiedHeader } from '@/components/layout/UnifiedHeader';
import { registryApi } from '@/lib/generated-sdk';
import { registryClient } from '@/lib/registry/client';
import { 
  CheckCircle, AlertCircle, Clock, Users, Calendar, 
  TrendingUp, Award, ChevronRight, RefreshCw, Signal
} from 'lucide-react';

// Use Registry SDK types directly
import type { Agent } from '@/lib/generated-sdk';

// Local interface for display-specific data
interface GenesisAgentDisplay {
  id: string;
  name: string;
  status: 'LAUNCHING' | 'DEVELOPING' | 'TRAINING';
  date: string;
  trainer: string;
  trainerStatus: 'confirmed' | 'needed' | 'interviewing';
  worksCount: number;
  description?: string;
  profile?: {
    statement?: string;
    tagline?: string;
    practice?: string;
    specialty?: string;
  };
}

interface RegistryResponse {
  agents: Agent[];
  applicationOpportunities?: {
    trainerMatching: {
      count: number;
      agents: Array<{ name: string; specialty: string }>;
    };
    completePositions: {
      count: number;
      description: string;
    };
  };
  summary?: {
    total: number;
    confirmed: number;
    needingTrainers: number;
    openSlots: number;
  };
}

// Helper functions to map Registry data to display format
function mapRegistryStatusToDisplay(status: string): 'LAUNCHING' | 'DEVELOPING' | 'TRAINING' {
  // All active agents are launching - they're all part of the first cohort
  if (status === 'ACTIVE') return 'LAUNCHING';
  if (status === 'ONBOARDING') return 'TRAINING';
  return 'DEVELOPING';
}

function getAgentLaunchDate(handle: string): string {
  const launchDates: Record<string, string> = {
    'abraham': 'October 19, 2025',
    'solienne': 'November 10, 2025', 
    'geppetto': 'December 2025',
    'koru': 'January 2026',
    'citizen': 'Q1 2026',
    'miyomi': 'December 1, 2025',
    'nina': 'Q1 2026',
    'amanda': 'March 2026'
  };
  return launchDates[handle] || 'TBD';
}

function getAgentTrainer(handle: string): string {
  const trainers: Record<string, string> = {
    'abraham': 'Gene Kogan',
    'solienne': 'Kristi Coronado',
    'geppetto': 'Martin & Colin (Lattice)', 
    'koru': 'Xander',
    'citizen': 'TBD - Applications Open',
    'miyomi': 'Seth Goldstein',
    'nina': 'TBD - Applications Open',
    'amanda': 'TBD - Applications Open'
  };
  return trainers[handle] || 'TBD';
}

function getTrainerStatus(handle: string): 'confirmed' | 'needed' | 'interviewing' {
  const confirmedTrainers = ['abraham', 'solienne', 'geppetto', 'koru', 'miyomi'];
  return confirmedTrainers.includes(handle) ? 'confirmed' : 'needed';
}

export default function HomePage() {
  const [data, setData] = useState<RegistryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [isLive, setIsLive] = useState(false);
  
  // Client-side cache to reduce Registry calls
  const [cache, setCache] = useState<{data: RegistryResponse; timestamp: number} | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Check cache first (5-minute cache)
      const now = Date.now();
      if (cache && (now - cache.timestamp) < 5 * 60 * 1000) {
        console.log('📦 Using cached data');
        setData(cache.data);
        setLastUpdate(new Date(cache.timestamp));
        setIsLive(true);
        return;
      }
      
      console.log('🚀 Starting API call to /api/agents');
      const startTime = Date.now();
      
      const response = await fetch('/api/agents');
      if (!response.ok) {
        throw new Error(`API failed with status: ${response.status}`);
      }
      
      const apiData = await response.json();
      const agents = apiData.agents || [];
      const duration = Date.now() - startTime;
      
      console.log('✅ API Success:', agents.length, 'agents received in', duration + 'ms');
      
      const result: RegistryResponse = {
        agents: agents,
        summary: {
          total: agents.length,
          confirmed: agents.filter(a => ['abraham', 'solienne', 'geppetto', 'koru', 'miyomi'].includes(a.id)).length,
          needingTrainers: agents.filter(a => !['abraham', 'solienne', 'geppetto', 'koru', 'miyomi'].includes(a.id) && !a.id.startsWith('open-')).length,
          openSlots: agents.filter(a => a.id.startsWith('open-')).length
        }
      };
      
      console.log('📊 Final summary:', result.summary);
      setData(result);
      setLastUpdate(new Date());
      setIsLive(true);
      
      // Cache the result
      setCache({ data: result, timestamp: Date.now() });
      
    } catch (error) {
      console.error('❌ API Error:', error);
      setIsLive(false);
      
      // Fallback data
      const result: RegistryResponse = {
        agents: [],
        summary: { total: 0, confirmed: 0, needingTrainers: 0, openSlots: 0 }
      };
      setData(result);
      setLastUpdate(new Date());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'LAUNCHING': return 'text-green-400 border-green-400';
      case 'DEVELOPING': return 'text-yellow-400 border-yellow-400';
      case 'TRAINING': return 'text-blue-400 border-blue-400';
      default: return 'text-gray-400 border-gray-400';
    }
  };

  const getTrainerStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'needed': return <AlertCircle className="w-4 h-4 text-red-400" />;
      case 'interviewing': return <Clock className="w-4 h-4 text-yellow-400" />;
      default: return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  // Simplified for testing - just show counts from summary
  const launchingAgents = [];
  const developingAgents = [];
  const needingTrainers = [];

  return (
    <div className="min-h-screen bg-black text-white">
      <UnifiedHeader />
      
      {/* Header */}
      <div className="border-b border-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold mb-4">EDEN ACADEMY</h1>
              <p className="text-xl">TRAINING AUTONOMOUS ARTISTS</p>
            </div>
            <div className="flex items-center gap-3">
              <div className={`flex items-center gap-2 px-3 py-1 border rounded ${isLive ? 'border-green-400' : 'border-red-400'}`}>
                <Signal className={`w-4 h-4 ${isLive ? 'text-green-400' : 'text-red-400'}`} />
                <span className={`text-sm ${isLive ? 'text-green-400' : 'text-red-400'}`}>
                  {isLive ? 'LIVE' : 'OFFLINE'}
                </span>
              </div>
              <button
                onClick={fetchData}
                className="p-2 border border-white rounded hover:bg-white hover:text-black transition-all"
                disabled={loading}
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
          <p className="text-sm text-gray-400 mt-2">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </p>
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="text-3xl font-bold">{data?.summary?.total || 0}</div>
              <div className="text-sm text-gray-400">TOTAL AGENTS</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-400">{data?.summary?.confirmed || 0}</div>
              <div className="text-sm text-gray-400">TRAINERS CONFIRMED</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-yellow-400">{data?.summary?.needingTrainers || 0}</div>
              <div className="text-sm text-gray-400">NEED TRAINERS</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      {loading ? (
        <div className="max-w-7xl mx-auto px-6 py-16 text-center">
          <div className="text-xl">Loading Academy data...</div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Critical Actions */}
          {needingTrainers.length > 0 && (
            <div className="bg-red-900/20 border border-red-400 p-6 mb-12 rounded">
              <h2 className="text-xl font-bold mb-4 text-red-400">⚠️ URGENT: TRAINERS NEEDED</h2>
              <div className="grid md:grid-cols-3 gap-4 mb-4">
                {needingTrainers.map(agent => (
                  <Link
                    key={agent.id}
                    href={`/academy/agent/${agent.id}`}
                    className="bg-black/50 border border-red-400/50 p-4 hover:bg-red-900/20 transition-all"
                  >
                    <div className="font-bold">{agent.name}</div>
                    <div className="text-sm text-gray-400">{agent.profile?.specialty || 'Specialist'}</div>
                    <div className="text-xs mt-2">Target: {agent.date}</div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* All Agents - Temporarily disabled for testing */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">AGENTS</h2>
            <div className="text-center py-8">
              <p>Agent details temporarily disabled. Check the main stats above!</p>
            </div>
          </section>

          {false && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data?.agents?.filter(agent => !agent.id.startsWith('open-')).map(agent => {

                return (
                  <div key={agent.id} className="border border-white p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold">{agent.name}</h3>
                          <span className="px-2 py-1 text-xs border rounded border-green-400 text-green-400">
                            ACTIVE
                          </span>
                        </div>
                        <p className="text-sm text-gray-400 mb-2">{displayAgent.description}</p>
                        <div className="text-xs text-gray-400">Target: {displayAgent.date}</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="bg-gray-900 p-3 rounded">
                        <div className="flex items-center gap-2 mb-1">
                          <Users className="w-4 h-4 text-gray-400" />
                          <span className="text-xs text-gray-400">TRAINER</span>
                          {getTrainerStatusIcon(displayAgent.trainerStatus)}
                        </div>
                        <div className="text-sm font-bold">{displayAgent.trainer}</div>
                      </div>
                      <div className="bg-gray-900 p-3 rounded">
                        <div className="flex items-center gap-2 mb-1">
                          <TrendingUp className="w-4 h-4 text-gray-400" />
                          <span className="text-xs text-gray-400">WORKS</span>
                        </div>
                        <div className="text-sm font-bold">{displayAgent.worksCount.toLocaleString()}</div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <Link 
                        href={`/academy/agent/${displayAgent.id.toLowerCase()}`}
                        className="text-sm hover:bg-white hover:text-black px-3 py-1 border border-white transition-all"
                      >
                        VIEW PROFILE →
                      </Link>
                      
                      {displayAgent.trainerStatus === 'needed' && (
                        <Link
                          href={`/apply?type=trainer&agent=${displayAgent.id}`}
                          className="text-xs px-2 py-1 border border-red-400 text-red-400 hover:bg-red-400 hover:text-black transition-all"
                        >
                          APPLY TO TRAIN →
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      )}
    </div>
  );
}