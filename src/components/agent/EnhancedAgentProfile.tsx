'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, MessageCircle, Users, TrendingUp, Calendar, ExternalLink } from 'lucide-react';
import { UnifiedHeader } from '@/components/layout/UnifiedHeader';
import SimpleWorksGallery from '@/components/agent/SimpleWorksGallery';
import AgentChat from '@/components/agent/AgentChat';
import { FEATURE_FLAGS, CONFIG } from '@/config/flags';
import { EDEN_AGENTS, getAgentBySlug, type EdenAgent } from '@/data/eden-agents-manifest';

interface EnhancedAgentProfileProps {
  agentSlug: string;
}

interface AgentMetrics {
  totalWorks: number;
  monthlyOutput: number;
  followers: number;
  engagement: number;
}

export default function EnhancedAgentProfile({ agentSlug }: EnhancedAgentProfileProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'works' | 'chat'>('overview');
  const [metrics, setMetrics] = useState<AgentMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  const agent = getAgentBySlug(agentSlug);
  
  useEffect(() => {
    loadAgentMetrics();
  }, [agentSlug]);

  const loadAgentMetrics = async () => {
    try {
      // In production, this would fetch from Registry API
      // For now, use placeholder data
      setMetrics({
        totalWorks: agent?.technicalProfile?.outputRate ? agent.technicalProfile.outputRate * 6 : 100,
        monthlyOutput: agent?.technicalProfile?.outputRate || 30,
        followers: agent?.economyMetrics?.holders || 150,
        engagement: Math.floor(Math.random() * 50) + 50
      });
    } catch (error) {
      console.error('Failed to load agent metrics:', error);
    } finally {
      setLoading(false);
    }
  };

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

  const works = Array.from({ length: 24 }, (_, i) => ({
    id: `work-${i}`,
    title: `Creation #${i + 1}`,
    imageUrl: `/api/placeholder/400/400?text=${agent.name}+Work+${i + 1}`,
    createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
    description: `Generated work by ${agent.name}`,
    tags: ['digital', 'ai-generated', agent.name.toLowerCase()]
  }));

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

      {/* Agent Hero Section */}
      <div className="border-b-2 border-white">
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Main Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-4 mb-6">
                <span className="text-xs uppercase tracking-wider text-gray-400">
                  AGENT #{agent.id.toUpperCase()}
                </span>
                <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider border ${
                  agent.status === 'academy' 
                    ? 'border-green-400 text-green-400' 
                    : 'border-gray-600 text-gray-400'
                }`}>
                  {agent.status}
                </span>
                <span className="px-3 py-1 text-xs uppercase tracking-wider bg-gray-900 border border-gray-600">
                  GENESIS COHORT
                </span>
              </div>
              
              <h1 className="text-7xl font-bold uppercase tracking-wider mb-6">
                {agent.name}
              </h1>
              
              <h2 className="text-2xl mb-8 text-gray-300 leading-relaxed">
                {agent.description}
              </h2>

              {/* Key Stats Row */}
              {metrics && (
                <div className="grid grid-cols-4 gap-6 mb-8">
                  <div className="text-center">
                    <div className="text-2xl font-bold mb-1">{metrics.totalWorks}</div>
                    <div className="text-xs uppercase tracking-wider text-gray-400">TOTAL WORKS</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold mb-1">{metrics.monthlyOutput}</div>
                    <div className="text-xs uppercase tracking-wider text-gray-400">PER MONTH</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold mb-1">{metrics.followers}</div>
                    <div className="text-xs uppercase tracking-wider text-gray-400">FOLLOWERS</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold mb-1">{metrics.engagement}%</div>
                    <div className="text-xs uppercase tracking-wider text-gray-400">ENGAGEMENT</div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 mb-8">
                <button
                  onClick={() => setActiveTab('chat')}
                  className="flex items-center gap-2 px-6 py-3 border-2 border-white hover:bg-white hover:text-black transition-all font-bold uppercase tracking-wider text-sm"
                  disabled={!FEATURE_FLAGS.ENABLE_AGENT_CHAT}
                >
                  <MessageCircle className="w-4 h-4" />
                  CHAT WITH {agent.name}
                </button>
                
                <button
                  onClick={() => setActiveTab('works')}
                  className="flex items-center gap-2 px-6 py-3 border border-white hover:bg-white hover:text-black transition-all font-bold uppercase tracking-wider text-sm"
                >
                  <TrendingUp className="w-4 h-4" />
                  VIEW WORKS
                </button>

                {agent.trainer && (
                  <Link
                    href={`/trainers/${agent.trainer.toLowerCase().replace(' ', '-')}`}
                    className="flex items-center gap-2 px-6 py-3 border border-gray-600 hover:border-white hover:bg-white hover:text-black transition-all font-bold uppercase tracking-wider text-sm"
                  >
                    <Users className="w-4 h-4" />
                    TRAINER: {agent.trainer}
                  </Link>
                )}
              </div>

              {/* Prototype Links */}
              {agent.prototypeLinks && agent.prototypeLinks.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-bold uppercase tracking-wider mb-3 text-gray-400">
                    LIVE PROTOTYPES
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {agent.prototypeLinks
                      .filter(link => link.status === 'active' && link.featured)
                      .map(link => (
                        <a
                          key={link.id}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 border border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-black transition-all font-bold uppercase tracking-wider text-xs"
                        >
                          <ExternalLink className="w-4 h-4" />
                          {link.title}
                        </a>
                      ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar Metrics */}
            <div className="space-y-6">
              
              {/* Economic Metrics */}
              <div className="border-2 border-white p-6">
                <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-gray-400">
                  ECONOMIC STATUS
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="text-xs uppercase tracking-wider text-gray-400 mb-1">MONTHLY REVENUE</div>
                    <div className="text-2xl font-bold">${agent.economyMetrics?.monthlyRevenue?.toLocaleString() || '0'}</div>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wider text-gray-400 mb-1">TOKEN HOLDERS</div>
                    <div className="text-2xl font-bold">{agent.economyMetrics?.holders?.toLocaleString() || '0'}</div>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wider text-gray-400 mb-1">LAUNCH DATE</div>
                    <div className="text-lg font-bold">
                      {agent.launchDate ? new Date(agent.launchDate).toLocaleDateString('en-US', { 
                        month: 'short', 
                        year: 'numeric' 
                      }) : 'TBD'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Technical Profile */}
              <div className="border border-gray-600 p-6">
                <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-gray-400">
                  CAPABILITIES
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="text-xs uppercase tracking-wider text-gray-400 mb-1">OUTPUT RATE</div>
                    <div className="text-2xl font-bold">{agent.technicalProfile?.outputRate || 0}/mo</div>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wider text-gray-400 mb-2">SPECIALTIES</div>
                    <div className="flex flex-wrap gap-2">
                      {['Digital Art', 'Autonomous Creation', 'AI Generation'].map((capability) => (
                        <span 
                          key={capability}
                          className="px-2 py-1 text-xs uppercase tracking-wider border border-gray-600 bg-gray-900"
                        >
                          {capability}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="border border-gray-600 p-6">
                <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-gray-400">
                  CONNECT
                </h3>
                <div className="space-y-3">
                  <a 
                    href={`https://twitter.com/${agent.name.toLowerCase()}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm hover:text-white text-gray-400 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    TWITTER
                  </a>
                  <a 
                    href={`https://warpcast.com/${agent.name.toLowerCase()}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm hover:text-white text-gray-400 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    FARCASTER
                  </a>
                  <Link
                    href={`/academy/agent/${agent.handle}`}
                    className="flex items-center gap-2 text-sm hover:text-white text-gray-400 transition-colors"
                  >
                    <Calendar className="w-4 h-4" />
                    ACADEMY PROFILE
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-2 text-sm font-bold uppercase tracking-wider border-b-2 transition-colors ${
                activeTab === 'overview'
                  ? 'border-white text-white'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              OVERVIEW
            </button>
            <button
              onClick={() => setActiveTab('works')}
              className={`py-4 px-2 text-sm font-bold uppercase tracking-wider border-b-2 transition-colors ${
                activeTab === 'works'
                  ? 'border-white text-white'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              WORKS ({works.length})
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`py-4 px-2 text-sm font-bold uppercase tracking-wider border-b-2 transition-colors ${
                activeTab === 'chat'
                  ? 'border-white text-white'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
              disabled={!FEATURE_FLAGS.ENABLE_AGENT_CHAT}
            >
              CHAT
              {!FEATURE_FLAGS.ENABLE_AGENT_CHAT && (
                <span className="ml-2 text-xs bg-gray-600 px-2 py-1">BETA</span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-8 py-12">
        {activeTab === 'overview' && (
          <div className="space-y-12">
            
            {/* Agent Description */}
            <div>
              <h3 className="text-2xl font-bold uppercase tracking-wider mb-6">
                ABOUT {agent.name}
              </h3>
              <div className="prose prose-lg prose-gray max-w-4xl">
                <p className="text-lg leading-relaxed text-gray-300">
                  {agent.description}
                </p>
                <p className="text-lg leading-relaxed text-gray-300 mt-4">
                  As a member of the Genesis cohort at Eden Academy, {agent.name} represents 
                  the cutting edge of autonomous AI creativity. Each agent in this cohort is 
                  trained by expert human collaborators and designed to push the boundaries 
                  of what's possible in AI-generated art and creative expression.
                </p>
              </div>
            </div>

            {/* Recent Works Preview */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold uppercase tracking-wider">
                  RECENT WORKS
                </h3>
                <button
                  onClick={() => setActiveTab('works')}
                  className="text-sm font-bold uppercase tracking-wider text-gray-400 hover:text-white transition-colors"
                >
                  VIEW ALL WORKS →
                </button>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {works.slice(0, 6).map((work) => (
                  <div key={work.id} className="border border-gray-600 hover:border-white transition-colors">
                    <div className="aspect-square bg-gray-900 flex items-center justify-center">
                      <div className="text-xs text-gray-400 text-center">
                        <div className="mb-2">{agent.name}</div>
                        <div>WORK #{work.id.split('-')[1]}</div>
                      </div>
                    </div>
                    <div className="p-2">
                      <div className="text-xs font-bold uppercase">{work.title}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'works' && (
          <div>
            <SimpleWorksGallery 
              agentSlug={agentSlug} 
              works={works}
              agentName={agent.name}
            />
          </div>
        )}

        {activeTab === 'chat' && (
          <div>
            <div className="max-w-4xl mx-auto">
              <div className="mb-8 text-center">
                <h3 className="text-2xl font-bold uppercase tracking-wider mb-4">
                  CHAT WITH {agent.name}
                </h3>
                <p className="text-gray-400 max-w-2xl mx-auto">
                  Engage directly with {agent.name} about their creative process, artistic philosophy, 
                  and unique perspective on AI-generated art. Rate limited to ensure quality interactions.
                </p>
              </div>
              
              <AgentChat 
                agentName={agent.name}
                agentHandle={agent.handle}
                className="max-w-4xl mx-auto h-96"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}