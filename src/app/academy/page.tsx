'use client';

import Link from 'next/link';
import { UnifiedHeader } from '@/components/layout/UnifiedHeader';
import { AgentCard } from '@/components/AgentCard';
import { useState, useEffect } from 'react';

// Academy agent display interface - matches API response
interface AcademyAgent {
  id: string;
  name: string;
  status: string;
  date?: string;
  hasProfile?: boolean;
  trainer?: string;
  worksCount?: number;
  description?: string;
  image?: string;
  trainerStatus?: string;
}

// UI component should not contain data transformation logic (moved to API layer)
// No caching at UI level - service layer handles this per ADR-019

export default function AcademyPage() {
  const [agents, setAgents] = useState<AcademyAgent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUsingFallback, setIsUsingFallback] = useState(false);

  useEffect(() => {
    let mounted = true;
    const loadingStart = Date.now();
    
    async function fetchAgents() {
      try {
        console.log('Academy: Fetching agents from Academy API...');
        
        // ADR-019 & ADR-022 compliant: Use Academy API layer which uses generated SDK
        const response = await fetch('/api/academy/agents');
        
        if (!response.ok) {
          throw new Error(`Academy API failed: ${response.status} - ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Validate response structure
        if (!data || !Array.isArray(data.agents)) {
          throw new Error(`Invalid API response structure: ${JSON.stringify(data)}`);
        }
        
        console.log('Academy: API data validated:', { 
          agentCount: data.agents.length,
          source: data.source,
          firstAgent: data.agents[0]?.name || 'none',
          loadTime: `${Date.now() - loadingStart}ms`
        });
        
        if (!mounted) return; // Prevent state updates if component unmounted
        
        setAgents(data.agents);
        setIsUsingFallback(data.source === 'fallback');
        
        if (data.warning) {
          setError(data.warning);
          // Clear warning after 5 seconds to maintain UX - only if still mounted
          setTimeout(() => {
            if (mounted) setError(null);
          }, 5000);
        } else {
          setError(null);
        }
        
      } catch (err) {
        console.error('Academy API failed:', {
          error: err,
          stack: err instanceof Error ? err.stack : 'No stack',
          timestamp: new Date().toISOString(),
          url: '/api/academy/agents',
          loadTime: `${Date.now() - loadingStart}ms`
        });
        
        if (!mounted) return;
        
        // Preserve actual error for debugging
        setError(err instanceof Error ? err.message : 'Unable to load agent data');
        setAgents([]);
        setIsUsingFallback(false);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    fetchAgents();
    
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <UnifiedHeader />
      <div className="sr-only">
        <h1>Eden Academy - Training Autonomous Artists</h1>
        <p>Explore our agent roster, including launching agents and partnership opportunities</p>
      </div>

      {/* Header */}
      <div className="border-b border-white">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h1 className="text-6xl md:text-8xl font-bold mb-4">EDEN ACADEMY</h1>
              <p className="text-xl mb-2">TRAINING AUTONOMOUS ARTISTS</p>
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <span>8 AGENTS</span>
                <span>•</span>
                <span>4 CONFIRMED TRAINERS</span>
                <span>•</span>
                <span>COHORT 2025-2026</span>
              </div>
            </div>
            <div className="hidden md:block text-right text-sm">
              <div className="text-gray-400 mb-2">STATUS</div>
              <div className="text-lg font-bold">PHASE 1: TRAINING</div>
              <div className="text-gray-400">2 LAUNCHING, 6 DEVELOPING</div>
            </div>
          </div>
        </div>
      </div>

      {/* Agents Grid */}
      <main className="max-w-6xl mx-auto px-6 py-16" role="main" aria-labelledby="agent-roster-title">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 id="agent-roster-title" className="text-3xl mb-2">AGENT ROSTER</h2>
            <p className="text-sm text-gray-400">Genesis Cohort • 2025-2026</p>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm" role="legend" aria-label="Agent status indicators">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full" aria-hidden="true"></div>
              <span className="text-gray-400">LAUNCHING</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full" aria-hidden="true"></div>
              <span className="text-gray-400">DEVELOPING</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full" aria-hidden="true"></div>
              <span className="text-gray-400">PARTNERSHIP AVAILABLE</span>
            </div>
          </div>
        </div>
        
        {/* Loading State - Improved with skeleton UI */}
        {loading && (
          <div>
            <h3 className="text-xl mb-8">LAUNCHING</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              {[1, 2].map((i) => (
                <div key={i} className="border border-white p-8 animate-pulse">
                  <div className="flex justify-between items-start mb-4">
                    <div className="h-8 bg-gray-700 w-48 rounded"></div>
                    <div className="h-6 bg-gray-700 w-24 rounded"></div>
                  </div>
                  <div className="h-4 bg-gray-700 w-full mb-2 rounded"></div>
                  <div className="h-4 bg-gray-700 w-3/4 mb-4 rounded"></div>
                  <div className="space-y-1">
                    <div className="h-3 bg-gray-700 w-32 rounded"></div>
                    <div className="h-3 bg-gray-700 w-20 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
            <h3 className="text-xl mb-8">DEVELOPING</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="border border-white p-6 animate-pulse">
                  <div className="h-6 bg-gray-700 w-32 mb-2 rounded"></div>
                  <div className="h-4 bg-gray-700 w-20 mb-2 rounded"></div>
                  <div className="h-3 bg-gray-700 w-full mb-2 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Error State - Show only for critical errors */}
        {error && !agents.length && (
          <div className="border border-red-500 p-6 mb-8 bg-red-500/10">
            <div className="flex items-center justify-between mb-4">
              <div className="text-lg font-bold">⚠️ Agent Data Unavailable</div>
              <button
                onClick={() => window.location.reload()}
                className="border border-white px-4 py-2 text-sm hover:bg-white hover:text-black transition-all"
              >
                RETRY
              </button>
            </div>
            <div className="text-sm mb-2">The Registry service is temporarily unavailable.</div>
            <details className="mt-3">
              <summary className="text-xs cursor-pointer hover:text-white opacity-75">Technical Details</summary>
              <div className="text-xs mt-2 p-2 bg-black/20 rounded border border-red-400/20">
                Error: {error}
                <br />
                Service: Eden Registry API
                <br />
                Time: {new Date().toLocaleTimeString()}
              </div>
            </details>
            <div className="mt-4 text-sm">
              <span className="opacity-75">Alternative: </span>
              <Link href="/agents" className="underline hover:text-white">
                View agent directory →
              </Link>
            </div>
          </div>
        )}
        
        {/* Service status indicator when using fallback */}
        {isUsingFallback && (
          <div className="border border-yellow-500 p-4 mb-8 bg-yellow-500/10">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
              <span>Registry temporarily unavailable - showing cached data</span>
              <button
                onClick={() => window.location.reload()}
                className="ml-auto text-xs underline hover:text-white"
              >
                Refresh to retry
              </button>
            </div>
          </div>
        )}

        {/* Launching Agents */}
        {!loading && (
          <section className="mb-16" aria-labelledby="launching-agents-title">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" aria-hidden="true"></div>
              <h3 id="launching-agents-title" className="text-xl">LAUNCHING SOON</h3>
              <span className="text-sm text-gray-400" aria-label="Status description">— Ready for public interaction</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8" role="list" aria-label="Launching agents">
              {agents.filter(a => a.status === 'LAUNCHING').map((agent) => (
                <AgentCard 
                  key={agent.id}
                  agent={agent}
                  variant="launching"
                />
              ))}
            </div>
          </section>
        )}
        
        {/* Developing Agents */}
        {!loading && (
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
              <h3 className="text-xl">IN DEVELOPMENT</h3>
              <span className="text-sm text-gray-400">— Training with confirmed partners</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {agents.filter(a => a.status === 'DEVELOPING' && a.trainerStatus === 'confirmed').map((agent) => (
                <AgentCard 
                  key={agent.id}
                  agent={agent}
                  variant="developing"
                />
              ))}
            </div>
          </div>
        )}
        
        {/* Creative Partnerships */}
        {!loading && (
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              <h3 className="text-xl">CREATIVE PARTNERSHIPS AVAILABLE</h3>
              <span className="text-sm text-gray-400">— Seeking creative collaborators</span>
            </div>
            <div className="bg-gray-900/30 border border-gray-700 p-6 mb-8 rounded">
              <p className="text-sm mb-4 max-w-4xl">
                Train with an AI agent while mastering cutting-edge creative practices. 
                Each partnership is a learning journey that advances both human and artificial creativity.
              </p>
              <div className="flex items-center gap-4 text-xs text-gray-400">
                <span>🎯 FOCUSED MENTORSHIP</span>
                <span>•</span>
                <span>🤝 COLLABORATIVE LEARNING</span>
                <span>•</span>
                <span>🚀 CUTTING-EDGE PRACTICE</span>
              </div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              
              {/* Partnership Agent Cards */}
              {['miyomi', 'amanda', 'citizen', 'nina'].map(agentId => {
                const agent = agents.find(a => a.id.toLowerCase() === agentId) || {
                  id: agentId,
                  name: agentId.toUpperCase(),
                  status: 'SEEKING_PARTNER',
                  trainer: 'CREATIVE PARTNERSHIP AVAILABLE'
                };
                
                return (
                  <AgentCard 
                    key={agent.id}
                    agent={agent}
                    variant="partnership"
                  />
                );
              })}

            </div>

            {/* Community Innovation */}
            <div className="border border-white border-dashed p-8">
              <h4 className="text-lg font-bold mb-4">EXPAND THE CULTURAL FRONTIER</h4>
              <p className="text-sm mb-4">
                Have an idea for a new type of autonomous artist? 
                Propose an agent concept and join our next cohort as its creative partner.
              </p>
              <p className="text-xs mb-6 opacity-75">
                2 open slots available for innovative agent concepts with committed creative partners.
              </p>
              <Link
                href="/apply?type=full"
                className="inline-block border border-white px-6 py-3 text-sm hover:bg-white hover:text-black transition-all"
              >
                PROPOSE AGENT CONCEPT →
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}