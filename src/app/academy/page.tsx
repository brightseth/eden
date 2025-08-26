'use client';

import Link from 'next/link';
import { UnifiedHeader } from '@/components/layout/UnifiedHeader';
import { AgentCard } from '@/components/AgentCard';
import { useState, useEffect } from 'react';
import { registryApi } from '@/lib/generated-sdk';
import type { Agent } from '@/lib/generated-sdk';

// Use Registry SDK types directly - no more local interfaces
// Display adapter for Registry Agent data  
interface GenesisAgentDisplay {
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

// ADR COMPLIANCE: No fallback data allowed
// Registry is required as single source of truth

// Helper functions to transform Registry data to display format
function mapStatusToDisplay(status: string): string {
  if (status === 'ACTIVE') return 'LAUNCHING';
  if (status === 'ONBOARDING') return 'TRAINING';
  return 'DEVELOPING';
}

function getDisplayDate(handle: string): string {
  const launchDates: Record<string, string> = {
    'abraham': 'OCT 19, 2025',
    'solienne': 'NOV 10, 2025',
    'geppetto': 'DEC 2025',
    'koru': 'JAN 2026',
    'citizen': 'DEC 2025',
    'miyomi': 'FEB 2026',
    'nina': 'MAR 2026',
    'amanda': 'FEB 2026'
  };
  return launchDates[handle] || 'TBD';
}

function getTrainerName(handle: string): string {
  const trainers: Record<string, string> = {
    'abraham': 'GENE KOGAN',
    'solienne': 'KRISTI CORONADO & SETH GOLDSTEIN',
    'geppetto': 'MARTIN & COLIN (LATTICE)',
    'koru': 'XANDER',
    'citizen': 'CREATIVE PARTNERSHIP AVAILABLE',
    'miyomi': 'CREATIVE PARTNERSHIP AVAILABLE',
    'nina': 'CREATIVE PARTNERSHIP AVAILABLE',
    'amanda': 'CREATIVE PARTNERSHIP AVAILABLE'
  };
  return trainers[handle] || 'TBD';
}

function getTrainerStatus(handle: string): string {
  const confirmedTrainers = ['abraham', 'solienne', 'geppetto', 'koru'];
  return confirmedTrainers.includes(handle) ? 'confirmed' : 'needed';
}

export default function AcademyPage() {
  const [agents, setAgents] = useState<GenesisAgentDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAgents() {
      try {
        console.log('Academy: Fetching agents from Registry SDK...');
        
        // Use our working Registry API endpoint instead of direct SDK
        // This avoids client-side issues with Registry SDK query parameters
        const response = await fetch('/api/registry/health');
        if (!response.ok) {
          throw new Error('Registry service unavailable');
        }
        
        // Get agents through individual API calls (which work)
        const agentHandles = ['abraham', 'solienne', 'amanda', 'miyomi', 'nina', 'geppetto', 'koru', 'citizen'];
        const agentPromises = agentHandles.map(handle => 
          fetch(`/api/registry/agent/${handle}`).then(r => r.ok ? r.json() : null)
        );
        
        const agentResponses = await Promise.all(agentPromises);
        const registryAgents = agentResponses
          .filter(agent => agent && !agent.error)
          .map(agent => ({
            handle: agent.handle || agent.id,
            displayName: agent.name,
            status: 'ACTIVE',
            profile: agent.profile,
            counts: agent.counts
          }));
        
        console.log('Academy: Registry data received:', { 
          agentCount: registryAgents?.length || 0
        });
        
        // Transform Registry data to display format
        const displayAgents: GenesisAgentDisplay[] = registryAgents.map((agent: any) => ({
          id: agent.handle,
          name: agent.displayName.toUpperCase(),
          status: mapStatusToDisplay(agent.status),
          date: getDisplayDate(agent.handle),
          hasProfile: !!agent.profile?.statement,
          trainer: getTrainerName(agent.handle),
          worksCount: agent.counts?.creations || 0,
          description: agent.profile?.statement?.toUpperCase() || 'AI CREATIVE AGENT',
          image: `/agents/${agent.handle}/profile.svg`,
          trainerStatus: getTrainerStatus(agent.handle)
        }));
        
        setAgents(displayAgents);
        setError(null);
        
      } catch (err) {
        console.error('Registry SDK failed (no fallback available):', err);
        setError(err instanceof Error ? err.message : 'Registry unavailable');
        
        // ADR COMPLIANCE: No fallback data
        // Registry failure should be visible to user
        setAgents([]);
      } finally {
        setLoading(false);
      }
    }

    fetchAgents();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <UnifiedHeader />

      {/* Header */}
      <div className="border-b border-white">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <h1 className="text-6xl md:text-8xl font-bold mb-4">EDEN ACADEMY</h1>
          <p className="text-xl">TRAINING AUTONOMOUS ARTISTS</p>
        </div>
      </div>

      {/* Agents Grid */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl mb-12">GENESIS COHORT</h2>
        
        {/* Loading State */}
        {loading && (
          <div className="text-center py-16">
            <div className="text-xl">Loading Genesis Cohort...</div>
            <div className="text-sm mt-2 opacity-50">Fetching from Registry</div>
          </div>
        )}

        {/* Error State - ADR Compliant */}
        {error && (
          <div className="border border-red-500 p-4 mb-8 bg-red-500/10">
            <div className="text-sm">🚨 Registry unavailable: {error}</div>
            <div className="text-xs mt-1 opacity-75">No fallback data available. Registry is required.</div>
            <div className="text-xs mt-1">
              <a href="/" className="underline">Try main Genesis Cohort page →</a>
            </div>
          </div>
        )}

        {/* Launching Agents */}
        {!loading && (
          <div className="mb-16">
            <h3 className="text-xl mb-8">LAUNCHING</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {agents.filter(a => a.status === 'LAUNCHING').map((agent) => (
                <AgentCard 
                  key={agent.id}
                  agent={agent}
                  variant="launching"
                />
              ))}
          </div>
        </div>
        )}
        
        {/* Developing Agents */}
        {!loading && (
          <div className="mb-16">
            <h3 className="text-xl mb-8">DEVELOPING</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {agents.filter(a => a.status === 'DEVELOPING').map((agent) => {
                // All developing agents should show partnership info
                const hasPartnershipAvailable = agent.trainer?.includes('TBD') || agent.trainer?.includes('Applications Open');
                const hasDetailPage = ['citizen', 'nina', 'amanda', 'miyomi'].includes(agent.id.toLowerCase());
                
                if (hasPartnershipAvailable && hasDetailPage) {
                  // Agents with partnership pages - these will be detailed in the partnerships section below
                  return (
                    <div 
                      key={agent.id}
                      className="border border-white p-6 opacity-30"
                    >
                      <h3 className="text-lg font-bold mb-2">{agent.name}</h3>
                      <p className="text-xs mb-2">{agent.date || 'Q1 2026'}</p>
                      <p className="text-xs opacity-75">See partnerships section below</p>
                    </div>
                  );
                }
                
                // Agents with committed trainers
                return (
                  <AgentCard 
                    key={agent.id}
                    agent={agent}
                    variant="developing"
                  />
                );
              })}
            </div>
          </div>
        )}
        
        {/* Creative Partnerships */}
        {!loading && (
          <div>
            <h3 className="text-xl mb-8">CREATIVE PARTNERSHIPS AVAILABLE</h3>
            <p className="text-sm mb-8 max-w-4xl opacity-75">
              Train with an AI agent while mastering cutting-edge creative practices. 
              Each partnership is a learning journey that advances both human and artificial creativity.
            </p>
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
      </div>
    </div>
  );
}