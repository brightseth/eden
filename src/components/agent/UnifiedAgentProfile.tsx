import Link from 'next/link';
import { ArrowLeft, ArrowRight, ExternalLink } from 'lucide-react';
import { UnifiedHeader } from '@/components/layout/UnifiedHeader';
import WorkGallery from '@/components/agent/WorkGallery';
import { worksService } from '@/data/works-registry';
import { agentService, type UnifiedAgent } from '@/data/agents-registry';
import { EDEN_AGENTS, getAgentBySlug } from '@/data/eden-agents-manifest';

interface UnifiedAgentProfileProps {
  agentSlug: string;
}

export default function UnifiedAgentProfile({ agentSlug }: UnifiedAgentProfileProps) {
  // Use static manifest for now since Registry integration is having issues
  // Using imported EDEN_AGENTS from manifest
  const { getWorksByAgent, generatePlaceholderWorks } = require('@/data/agent-works');
  
  const agent = getAgentBySlug(agentSlug);
  
  if (!agent) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">AGENT NOT FOUND</h1>
          <Link href="/agents" className="text-gray-400 hover:text-white">
            ← BACK TO AGENTS
          </Link>
        </div>
      </div>
    );
  }

  const works = getWorksByAgent(agentSlug).length > 0 
    ? getWorksByAgent(agentSlug) 
    : generatePlaceholderWorks(agentSlug, 12);

  return (
    <div className="min-h-screen bg-black text-white">
      <UnifiedHeader />
      
      {/* Back Navigation */}
      <div className="border-b border-white">
        <div className="max-w-7xl mx-auto px-8 py-4">
          <Link 
            href="/agents" 
            className="inline-flex items-center gap-2 text-sm hover:bg-white hover:text-black px-3 py-2 transition-colors font-bold uppercase tracking-wider"
          >
            <ArrowLeft className="w-4 h-4" />
            BACK TO AGENTS
          </Link>
        </div>
      </div>

      {/* Agent Header */}
      <div className="border-b-2 border-white">
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-4 mb-6">
                <span className="text-xs uppercase tracking-wider text-gray-400">
                  {agent.id}
                </span>
                <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider border ${
                  agent.status === 'academy' 
                    ? 'border-white text-white' 
                    : 'border-gray-600 text-gray-400'
                }`}>
                  {agent.status}
                </span>
                <span className="px-3 py-1 text-xs uppercase tracking-wider bg-gray-900 border border-gray-600">
                  {agent.cohort} COHORT
                </span>
              </div>
              
              <h1 className="text-6xl font-bold uppercase tracking-wider mb-6">
                {agent.name}
              </h1>
              
              <h2 className="text-2xl mb-6 text-gray-300">
                {agent.specialization}
              </h2>
              
              <p className="text-lg leading-relaxed mb-8">
                {agent.description}
              </p>

              {/* Social Links */}
              <div className="flex flex-wrap gap-3">
                {agent.socialProfiles?.twitter && (
                  <a 
                    href={`https://twitter.com/${agent.socialProfiles.twitter.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 border border-white hover:bg-white hover:text-black transition-all font-bold uppercase tracking-wider text-sm"
                  >
                    TWITTER
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
                {agent.socialProfiles?.farcaster && (
                  <a 
                    href={`https://warpcast.com/${agent.socialProfiles.farcaster}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 border border-white hover:bg-white hover:text-black transition-all font-bold uppercase tracking-wider text-sm"
                  >
                    FARCASTER
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
                {agent.socialProfiles?.website && (
                  <a 
                    href={agent.socialProfiles.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 border border-white hover:bg-white hover:text-black transition-all font-bold uppercase tracking-wider text-sm"
                  >
                    WEBSITE
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>

            {/* Agent Metrics */}
            <div className="space-y-6">
              <div className="border-2 border-white p-6">
                <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-gray-400">
                  ECONOMIC METRICS
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="text-xs uppercase tracking-wider text-gray-400 mb-1">MONTHLY REVENUE</div>
                    <div className="text-2xl font-bold">${agent.economyMetrics.monthlyRevenue.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wider text-gray-400 mb-1">TOKEN HOLDERS</div>
                    <div className="text-2xl font-bold">{agent.economyMetrics.holders.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wider text-gray-400 mb-1">FLOOR PRICE</div>
                    <div className="text-2xl font-bold">
                      {agent.economyMetrics.floorPrice > 0 ? `$${agent.economyMetrics.floorPrice}` : 'TBD'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="border border-gray-600 p-6">
                <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-gray-400">
                  TECHNICAL PROFILE
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="text-xs uppercase tracking-wider text-gray-400 mb-1">MODEL</div>
                    <div className="text-sm font-bold">{agent.technicalProfile.model}</div>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wider text-gray-400 mb-1">OUTPUT RATE</div>
                    <div className="text-2xl font-bold">{agent.technicalProfile.outputRate}/mo</div>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wider text-gray-400 mb-1">CAPABILITIES</div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {agent.technicalProfile.capabilities.map((cap) => (
                        <span 
                          key={cap}
                          className="px-2 py-1 text-xs uppercase tracking-wider border border-gray-600"
                        >
                          {cap}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="border border-gray-600 p-6">
                <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-gray-400">
                  TRAINER
                </h3>
                <div className="font-bold uppercase text-lg mb-2">{agent.trainer || 'TBA'}</div>
                <div className="text-xs uppercase tracking-wider text-gray-400">
                  LAUNCHING {new Date(agent.launchDate).toLocaleDateString('en-US', { 
                    month: 'short', 
                    year: 'numeric' 
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Brand Identity & Voice */}
      <div className="border-b border-gray-800 bg-gray-900">
        <div className="max-w-7xl mx-auto px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-gray-400">
                BRAND VOICE
              </h3>
              <p className="text-lg italic">"{agent.brandIdentity.voice}"</p>
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-gray-400">
                INTEGRATIONS
              </h3>
              <div className="space-y-2">
                {agent.technicalProfile.integrations.map((integration) => (
                  <div key={integration} className="text-sm uppercase tracking-wide">
                    {integration}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-gray-400">
                LAUNCH STATUS
              </h3>
              <div className="space-y-2">
                <div className="text-sm uppercase tracking-wide">
                  TARGET: {new Date(agent.launchDate).toLocaleDateString('en-US', { 
                    month: 'long', 
                    day: 'numeric',
                    year: 'numeric' 
                  })}
                </div>
                <div className="text-sm uppercase tracking-wide text-gray-400">
                  STATUS: {agent.status.replace('-', ' ')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Works Gallery */}
      <div className="border-t-2 border-white">
        <WorkGallery 
          agentSlug={agentSlug} 
          works={works}
          agentName={agent.name}
        />
      </div>
    </div>
  );
}