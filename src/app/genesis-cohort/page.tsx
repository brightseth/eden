'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { UnifiedHeader } from '@/components/layout/UnifiedHeader';
import { 
  CheckCircle, AlertCircle, Clock, Users, Calendar, 
  TrendingUp, Award, ChevronRight, RefreshCw, Signal
} from 'lucide-react';

interface GenesisAgent {
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
  agents: GenesisAgent[];
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

export default function GenesisCohortDashboard() {
  const [data, setData] = useState<RegistryResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [isLive, setIsLive] = useState(false);

  const fetchData = async () => {
    try {
      const registryUrl = process.env.NEXT_PUBLIC_REGISTRY_URL || 'https://eden-genesis-registry.vercel.app';
      const response = await fetch(`${registryUrl}/api/v1/genesis-cohort`, {
        headers: {
          'Accept': 'application/json',
          'x-eden-client': 'academy-dashboard'
        },
        cache: 'no-store'
      });

      if (response.ok) {
        const result: RegistryResponse = await response.json();
        setData(result);
        setLastUpdate(new Date());
        setIsLive(true);
      } else {
        setIsLive(false);
      }
    } catch (error) {
      console.error('Failed to fetch Registry data:', error);
      setIsLive(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Refresh every 30 seconds
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

  const launchingAgents = data?.agents.filter(a => a.status === 'LAUNCHING') || [];
  const developingAgents = data?.agents.filter(a => a.status === 'DEVELOPING') || [];
  const needingTrainers = data?.agents.filter(a => a.trainerStatus === 'needed') || [];

  return (
    <div className="min-h-screen bg-black text-white">
      <UnifiedHeader />
      
      {/* Header */}
      <div className="border-b border-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold mb-4">GENESIS COHORT</h1>
              <p className="text-xl">LAUNCH COMMAND CENTER</p>
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
            <div>
              <div className="text-3xl font-bold text-blue-400">{data?.summary?.openSlots || 0}</div>
              <div className="text-sm text-gray-400">OPEN SLOTS</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      {loading ? (
        <div className="max-w-7xl mx-auto px-6 py-16 text-center">
          <div className="text-xl">Loading Genesis Cohort data...</div>
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
              <Link 
                href="/apply?type=trainer"
                className="inline-flex items-center gap-2 px-4 py-2 border border-red-400 text-red-400 hover:bg-red-400 hover:text-black transition-all"
              >
                VIEW TRAINER APPLICATIONS
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          )}

          {/* Launching Soon */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">LAUNCHING AGENTS</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {launchingAgents.map(agent => (
                <div key={agent.id} className="border border-white p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold">{agent.name}</h3>
                        <span className={`px-2 py-1 text-xs border rounded ${getStatusColor(agent.status)}`}>
                          {agent.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400">{agent.description || agent.profile?.tagline}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold">{agent.date}</div>
                      <div className="text-xs text-gray-400">LAUNCH DATE</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-gray-900 p-3 rounded">
                      <div className="flex items-center gap-2 mb-1">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span className="text-xs text-gray-400">TRAINER</span>
                        {getTrainerStatusIcon(agent.trainerStatus)}
                      </div>
                      <div className="text-sm font-bold">{agent.trainer}</div>
                    </div>
                    <div className="bg-gray-900 p-3 rounded">
                      <div className="flex items-center gap-2 mb-1">
                        <TrendingUp className="w-4 h-4 text-gray-400" />
                        <span className="text-xs text-gray-400">WORKS</span>
                      </div>
                      <div className="text-sm font-bold">{agent.worksCount.toLocaleString()}</div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="text-xs">
                      <span className="text-gray-400">Pilot Revenue Target:</span>
                      <span className="ml-2 font-bold text-green-400">$1,000-2,500</span>
                    </div>
                    <Link 
                      href={`/academy/agent/${agent.id.toLowerCase()}`}
                      className="text-sm hover:bg-white hover:text-black px-3 py-1 border border-white transition-all"
                    >
                      VIEW PROFILE →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* In Development */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">IN DEVELOPMENT</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {developingAgents.map(agent => (
                <div key={agent.id} className="border border-gray-600 p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold">{agent.name}</h3>
                    {getTrainerStatusIcon(agent.trainerStatus)}
                  </div>
                  <div className="text-sm text-gray-400 mb-2">{agent.profile?.specialty || 'Developing'}</div>
                  <div className="flex justify-between items-center text-xs">
                    <span>{agent.date}</span>
                    {agent.trainerStatus === 'needed' ? (
                      <Link 
                        href={`/academy/agent/${agent.id.toLowerCase()}`}
                        className="text-yellow-400 hover:underline"
                      >
                        APPLY →
                      </Link>
                    ) : (
                      <span className="text-gray-600">{agent.trainer}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Application Opportunities */}
          {data?.applicationOpportunities && (
            <section>
              <h2 className="text-2xl font-bold mb-6">OPEN OPPORTUNITIES</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="border border-white border-dashed p-6">
                  <h3 className="text-lg font-bold mb-3">TRAINER POSITIONS</h3>
                  <p className="text-sm mb-4">{data.applicationOpportunities.trainerMatching.count} agents confirmed, seeking trainers:</p>
                  <ul className="text-sm space-y-1 mb-4">
                    {data.applicationOpportunities.trainerMatching.agents.map((agent, i) => (
                      <li key={i}>• {agent.name} ({agent.specialty})</li>
                    ))}
                  </ul>
                  <Link
                    href="/apply?type=trainer"
                    className="inline-block border border-white px-4 py-2 text-sm hover:bg-white hover:text-black transition-all"
                  >
                    APPLY AS TRAINER →
                  </Link>
                </div>

                {data.applicationOpportunities.completePositions.count > 0 && (
                  <div className="border border-white border-dashed p-6">
                    <h3 className="text-lg font-bold mb-3">COMPLETE POSITIONS</h3>
                    <p className="text-sm mb-4">{data.applicationOpportunities.completePositions.count} {data.applicationOpportunities.completePositions.description}</p>
                    <p className="text-xs mb-4 text-gray-400">Propose your AI creative agent concept with committed trainer</p>
                    <Link
                      href="/apply?type=full"
                      className="inline-block border border-white px-4 py-2 text-sm hover:bg-white hover:text-black transition-all"
                    >
                      PROPOSE CONCEPT →
                    </Link>
                  </div>
                )}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}