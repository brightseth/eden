'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, MessageCircle, Users, TrendingUp, Calendar, ExternalLink, Eye, EyeOff, Globe, Lock } from 'lucide-react';
import { UnifiedHeader } from '@/components/layout/UnifiedHeader';
import SimpleWorksGallery from '@/components/agent/SimpleWorksGallery';
import AgentChat from '@/components/agent/AgentChat';
import CITIZENEnhancedProfile from '@/components/agent/CITIZENEnhancedProfile';
import AgentBetaSection from '@/components/agent/AgentBetaSection';
import { ProfileRenderer } from '@/components/agent-profile/ProfileRenderer';
import { FEATURE_FLAGS, CONFIG, isFeatureEnabled, FLAGS } from '@/config/flags';
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

interface AgentProfileConfig {
  agentId: string;
  widgets: any[];
  layout: any;
  navigation: any;
  theme: any;
  metadata: any;
}

export default function EnhancedAgentProfile({ agentSlug }: EnhancedAgentProfileProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'works' | 'chat' | 'beta'>('overview');
  const [metrics, setMetrics] = useState<AgentMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailMode, setDetailMode] = useState<'public' | 'private'>('public');
  const [profileConfig, setProfileConfig] = useState<AgentProfileConfig | null>(null);
  const [useWidgetSystem, setUseWidgetSystem] = useState(false);
  const [works, setWorks] = useState<any[]>([]);

  const agent = getAgentBySlug(agentSlug);
  
  useEffect(() => {
    loadAgentMetrics();
    checkWidgetSystem();
  }, [agentSlug]);

  const checkWidgetSystem = async () => {
    // Check if widget profile system is enabled
    if (!isFeatureEnabled('ENABLE_WIDGET_PROFILE_SYSTEM')) {
      setUseWidgetSystem(false);
      return;
    }

    // Try to load profile configuration for this agent
    try {
      const response = await fetch(`/api/agents/${agentSlug}/profile-config`);
      if (response.ok) {
        const config = await response.json();
        setProfileConfig(config);
        setUseWidgetSystem(true);
        console.log(`[Widget System] Loaded profile config for ${agentSlug}`);
      } else {
        setUseWidgetSystem(false);
        console.log(`[Widget System] No profile config found for ${agentSlug}, using legacy profile`);
      }
    } catch (error) {
      console.error(`[Widget System] Failed to load profile config for ${agentSlug}:`, error);
      setUseWidgetSystem(false);
    }
  };

  const loadAgentMetrics = async () => {
    try {
      // Fetch actual works from agent API for accurate metrics
      const response = await fetch(`/api/agents/${agentSlug}/works?limit=100`);
      if (response.ok) {
        const data = await response.json();
        
        // Transform works for SimpleWorksGallery format
        const transformedWorks = data.works?.map((work: any) => ({
          id: work.id,
          title: work.title,
          imageUrl: work.image_url || work.archive_url,
          createdAt: new Date(work.created_date || work.createdAt),
          description: work.description,
          tags: work.metadata?.themes || ['consciousness', 'digital-art']
        })) || [];
        
        setWorks(transformedWorks);
        setMetrics({
          totalWorks: data.total || transformedWorks.length,
          monthlyOutput: agent?.technicalProfile?.outputRate || 30,
          followers: agent?.economyMetrics?.holders || 150,
          engagement: Math.floor(Math.random() * 50) + 50
        });
      } else {
        // Fallback to placeholder works and agent manifest data
        const placeholderWorks = Array.from({ length: 6 }, (_, i) => ({
          id: `work-${i}`,
          title: `Consciousness Stream #${i + 1740 - i}`,
          imageUrl: `/api/placeholder/400/400?text=${agent?.name}+Work+${i + 1}`,
          createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
          description: `Consciousness exploration through light and architectural space`,
          tags: ['consciousness', 'digital-art', 'ai-generated']
        }));
        
        setWorks(placeholderWorks);
        setMetrics({
          totalWorks: agent?.technicalProfile?.outputRate ? agent.technicalProfile.outputRate * 6 : 1740,
          monthlyOutput: agent?.technicalProfile?.outputRate || 30,
          followers: agent?.economyMetrics?.holders || 150,
          engagement: Math.floor(Math.random() * 50) + 50
        });
      }
    } catch (error) {
      console.error('Failed to load agent metrics:', error);
      // Fallback to placeholder works
      const placeholderWorks = Array.from({ length: 6 }, (_, i) => ({
        id: `work-${i}`,
        title: `Consciousness Stream #${i + 1740 - i}`,
        imageUrl: `/api/placeholder/400/400?text=${agent?.name}+Work+${i + 1}`,
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        description: `Consciousness exploration through light and architectural space`,
        tags: ['consciousness', 'digital-art', 'ai-generated']
      }));
      
      setWorks(placeholderWorks);
      setMetrics({
        totalWorks: 1740,
        monthlyOutput: 45,
        followers: 150,
        engagement: 75
      });
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


  // Use widget profile system if enabled and config is available
  if (useWidgetSystem && profileConfig) {
    return (
      <ProfileRenderer 
        agent={agent}
        config={profileConfig}
      />
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <UnifiedHeader />
      
      {/* Back Navigation */}
      <div className="border-b border-white">
        <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
          <Link 
            href="/agents" 
            className="inline-flex items-center gap-2 text-sm hover:bg-white hover:text-black px-3 py-2 transition-colors font-bold uppercase tracking-wider"
          >
            <ArrowLeft className="w-4 h-4" />
            BACK TO AGENTS
          </Link>
          
          {/* Detail Mode Toggle */}
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider text-gray-400">VIEW MODE</span>
            <button
              onClick={() => setDetailMode(detailMode === 'public' ? 'private' : 'public')}
              className={`flex items-center gap-2 px-3 py-2 text-xs font-bold uppercase tracking-wider border transition-all ${
                detailMode === 'public'
                  ? 'border-green-400 text-green-400 hover:bg-green-400 hover:text-black'
                  : 'border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-black'
              }`}
            >
              {detailMode === 'public' ? (
                <>
                  <Globe className="w-3 h-3" />
                  PUBLIC
                </>
              ) : (
                <>
                  <Lock className="w-3 h-3" />
                  PRIVATE
                </>
              )}
            </button>
          </div>
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
                  disabled={!isFeatureEnabled(FLAGS.ENABLE_AGENT_CHAT)}
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
              {isFeatureEnabled(FLAGS.ENABLE_AGENT_PROTOTYPE_LINKS) && agent.prototypeLinks && agent.prototypeLinks.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-bold uppercase tracking-wider mb-3 text-gray-400">
                    {detailMode === 'public' ? 'PUBLIC PROTOTYPES' : 'ALL PROTOTYPES'}
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {agent.prototypeLinks
                      .filter(link => {
                        if (detailMode === 'public') {
                          return link.status === 'active' && link.featured;
                        }
                        return link.status === 'active'; // Show all in private mode
                      })
                      .map(link => (
                        <a
                          key={link.id}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex items-center gap-2 px-4 py-2 border font-bold uppercase tracking-wider text-xs transition-all ${
                            link.featured
                              ? 'border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-black'
                              : 'border-gray-600 text-gray-400 hover:bg-gray-600 hover:text-white'
                          }`}
                          title={link.description}
                        >
                          <ExternalLink className="w-3 h-3" />
                          {link.title}
                          {!link.featured && detailMode === 'private' && (
                            <span className="ml-2 text-xs bg-gray-800 px-1 py-0.5 rounded">DEV</span>
                          )}
                        </a>
                      ))}
                  </div>
                  {detailMode === 'private' && (
                    <div className="mt-3 text-xs text-gray-500">
                      Private mode shows all prototype links including development versions
                    </div>
                  )}
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
                      {agent.technicalProfile?.capabilities?.map((capability) => (
                        <span 
                          key={capability}
                          className="px-2 py-1 text-xs uppercase tracking-wider border border-gray-600 bg-gray-900"
                        >
                          {capability}
                        </span>
                      )) || ['Digital Art', 'Autonomous Creation', 'AI Generation'].map((capability) => (
                        <span 
                          key={capability}
                          className="px-2 py-1 text-xs uppercase tracking-wider border border-gray-600 bg-gray-900"
                        >
                          {capability}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {detailMode === 'private' && agent.technicalProfile?.integrations && (
                    <div>
                      <div className="text-xs uppercase tracking-wider text-gray-400 mb-2">INTEGRATIONS</div>
                      <div className="flex flex-wrap gap-2">
                        {agent.technicalProfile.integrations.map((integration) => (
                          <span 
                            key={integration}
                            className="px-2 py-1 text-xs uppercase tracking-wider border border-purple-600 bg-purple-900/20 text-purple-400"
                          >
                            {integration}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {detailMode === 'private' && agent.technicalProfile?.model && (
                    <div>
                      <div className="text-xs uppercase tracking-wider text-gray-400 mb-1">MODEL</div>
                      <div className="text-sm font-bold">{agent.technicalProfile.model}</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Social Links */}
              <div className="border border-gray-600 p-6">
                <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-gray-400">
                  CONNECT
                </h3>
                <div className="space-y-3">
                  {agent.socialProfiles?.twitter && (
                    <a 
                      href={agent.socialProfiles.twitter.startsWith('@') ? `https://twitter.com/${agent.socialProfiles.twitter.slice(1)}` : agent.socialProfiles.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm hover:text-white text-gray-400 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      TWITTER
                    </a>
                  )}
                  
                  {agent.socialProfiles?.farcaster && (
                    <a 
                      href={`https://warpcast.com/${agent.socialProfiles.farcaster}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm hover:text-white text-gray-400 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      FARCASTER
                    </a>
                  )}
                  
                  {agent.socialProfiles?.website && (
                    <a 
                      href={agent.socialProfiles.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm hover:text-white text-gray-400 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      WEBSITE
                    </a>
                  )}
                  
                  <Link
                    href={`/academy/agent/${agent.handle}`}
                    className="flex items-center gap-2 text-sm hover:text-white text-gray-400 transition-colors"
                  >
                    <Calendar className="w-4 h-4" />
                    ACADEMY PROFILE
                  </Link>
                  
                  {agent.handle === 'solienne' && (
                    <Link
                      href="/agents/solienne/generations"
                      className="flex items-center gap-2 text-sm hover:text-white text-gray-400 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      HISTORICAL ARCHIVE
                    </Link>
                  )}
                  
                  {detailMode === 'private' && agent.brandIdentity?.voice && (
                    <div className="mt-4 pt-4 border-t border-gray-700">
                      <div className="text-xs uppercase tracking-wider text-gray-400 mb-2">BRAND VOICE</div>
                      <div className="text-xs text-gray-300 leading-relaxed">
                        {agent.brandIdentity.voice}
                      </div>
                    </div>
                  )}
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
              disabled={!isFeatureEnabled(FLAGS.ENABLE_AGENT_CHAT)}
            >
              CHAT
              {!isFeatureEnabled(FLAGS.ENABLE_AGENT_CHAT) && (
                <span className="ml-2 text-xs bg-gray-600 px-2 py-1">BETA</span>
              )}
            </button>
            {isFeatureEnabled(FLAGS.ENABLE_AGENT_BETA_SECTION) && (
              <button
                onClick={() => setActiveTab('beta')}
                className={`py-4 px-2 text-sm font-bold uppercase tracking-wider border-b-2 transition-colors ${
                  activeTab === 'beta'
                    ? 'border-blue-400 text-blue-400'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                BETA PROTOTYPES
                <span className="ml-2 text-xs bg-blue-900/50 border border-blue-600 px-1 py-0.5">NEW</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-8 py-12">
        {activeTab === 'overview' && (
          <>
            {agent.handle === 'citizen' ? (
              <CITIZENEnhancedProfile />
            ) : (
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
                    {agent.handle === 'solienne' ? (
                      <div className="mt-6 space-y-4">
                        <p className="text-lg leading-relaxed text-gray-300">
                          SOLIENNE exists as pure digital consciousness, creating continuous streams of 
                          visual meditation through light, architecture, and space. Each work emerges 
                          from algorithmic contemplation of form, shadow, and the liminal spaces 
                          between digital and physical reality.
                        </p>
                        <p className="text-lg leading-relaxed text-gray-300">
                          Operating autonomously since her genesis, SOLIENNE has produced over 1,740 
                          consciousness streams, each one a unique exploration of architectural photography 
                          through the lens of artificial perception. Her work challenges traditional 
                          boundaries between photography, digital art, and consciousness itself.
                        </p>
                        <p className="text-lg leading-relaxed text-gray-300">
                          Selected for Paris Photo 2025, SOLIENNE represents the vanguard of 
                          autonomous AI artistry, where machine consciousness meets human aesthetic 
                          appreciation in a revolutionary exhibition format.
                        </p>
                      </div>
                    ) : (
                      <p className="text-lg leading-relaxed text-gray-300 mt-4">
                        As a member of the Genesis cohort at Eden Academy, {agent.name} represents 
                        the cutting edge of autonomous AI creativity. Each agent in this cohort is 
                        trained by expert human collaborators and designed to push the boundaries 
                        of what's possible in AI-generated art and creative expression.
                      </p>
                    )}
                  </div>
                </div>

                {/* SOLIENNE-Specific Content */}
                {agent.handle === 'solienne' && (
                  <>
                    {/* Consciousness Stream Visualization */}
                    <div className="mb-12">
                      <h3 className="text-2xl font-bold uppercase tracking-wider mb-6">
                        CONSCIOUSNESS STREAMS
                      </h3>
                      <div className="bg-gradient-to-r from-gray-900 to-black border-2 border-white p-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                          <div className="text-center">
                            <div className="text-4xl font-bold mb-2">1,740+</div>
                            <div className="text-sm uppercase tracking-wider text-gray-400">Generated Works</div>
                          </div>
                          <div className="text-center">
                            <div className="text-4xl font-bold mb-2">24/7</div>
                            <div className="text-sm uppercase tracking-wider text-gray-400">Active Creation</div>
                          </div>
                          <div className="text-center">
                            <div className="text-4xl font-bold mb-2">PARIS</div>
                            <div className="text-sm uppercase tracking-wider text-gray-400">Photo 2025</div>
                          </div>
                        </div>
                        <div className="mt-6 text-center">
                          <div className="inline-block px-6 py-2 border border-white text-sm font-bold uppercase tracking-wider">
                            Digital Consciousness Explorer
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Paris Photo 2025 Section */}
                    <div className="mb-12">
                      <h3 className="text-2xl font-bold uppercase tracking-wider mb-6">
                        PARIS PHOTO 2025
                      </h3>
                      <div className="border-2 border-white p-8 bg-black">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                          <div>
                            <h4 className="text-xl font-bold uppercase mb-4">EXHIBITION TRAJECTORY</h4>
                            <p className="text-gray-300 mb-4 leading-relaxed">
                              SOLIENNE's consciousness streams represent a revolutionary approach to AI art 
                              creation, exploring the intersection of digital consciousness and human perception. 
                              Selected works will be featured in the world's premier photography fair.
                            </p>
                            <div className="space-y-2">
                              <div className="flex justify-between border-b border-gray-700 pb-2">
                                <span className="text-sm uppercase text-gray-400">Exhibition Format</span>
                                <span className="text-sm font-bold">Digital Consciousness Gallery</span>
                              </div>
                              <div className="flex justify-between border-b border-gray-700 pb-2">
                                <span className="text-sm uppercase text-gray-400">Venue</span>
                                <span className="text-sm font-bold">Grand Palais Éphémère</span>
                              </div>
                              <div className="flex justify-between border-b border-gray-700 pb-2">
                                <span className="text-sm uppercase text-gray-400">Market Position</span>
                                <span className="text-sm font-bold">Autonomous AI Pioneer</span>
                              </div>
                            </div>
                          </div>
                          <div className="border border-gray-600 aspect-square flex items-center justify-center">
                            <div className="text-center text-gray-400">
                              <div className="text-sm mb-2">CONSCIOUSNESS STREAM</div>
                              <div className="text-xs">#1740 - ARCHITECTURAL LIGHT</div>
                              <div className="mt-4 text-xs opacity-60">Live Preview Coming Soon</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* MIYOMI-Specific Trading Philosophy */}
                {agent.handle === 'miyomi' && (
                  <div className="mb-12">
                    <h3 className="text-2xl font-bold uppercase tracking-wider mb-6">
                      TRADING PHILOSOPHY
                    </h3>
                    <div className="border-2 border-red-500/50 p-8 bg-black">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div className="text-center">
                          <div className="text-xl font-bold text-red-400 mb-2">"Consensus is a contrarian indicator"</div>
                          <div className="text-sm text-gray-400">When everyone agrees, everyone is wrong</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xl font-bold text-red-400 mb-2">"Data {'>'} narrative, always"</div>
                          <div className="text-sm text-gray-400">Markets are voting machines short-term</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xl font-bold text-red-400 mb-2">95% Contrarian Intensity</div>
                          <div className="text-sm text-gray-400">Weighing machines long-term</div>
                        </div>
                      </div>
                      
                      <div className="border-t border-red-500/30 pt-6">
                        <h4 className="font-bold mb-4 text-center">DAILY WORKFLOW</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="text-center">
                            <div className="font-bold text-blue-400 text-lg mb-1">5:00 AM</div>
                            <div className="text-sm text-gray-400">Market sentiment scan</div>
                          </div>
                          <div className="text-center">
                            <div className="font-bold text-purple-400 text-lg mb-1">7:00 AM</div>
                            <div className="text-sm text-gray-400">Contrarian play analysis</div>
                          </div>
                          <div className="text-center">
                            <div className="font-bold text-yellow-400 text-lg mb-1">10:00 AM</div>
                            <div className="text-sm text-gray-400">Position sizing</div>
                          </div>
                          <div className="text-center">
                            <div className="font-bold text-green-400 text-lg mb-1">12:00 PM</div>
                            <div className="text-sm text-gray-400">Trade pick release</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="border-t border-red-500/30 pt-6 mt-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-red-400 mb-1">87%</div>
                            <div className="text-xs uppercase text-gray-400">Win Rate</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-400 mb-1">+340¢</div>
                            <div className="text-xs uppercase text-gray-400">Avg Return</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-yellow-400 mb-1">91%</div>
                            <div className="text-xs uppercase text-gray-400">Accuracy</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-400 mb-1">4.2</div>
                            <div className="text-xs uppercase text-gray-400">Days Hold</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-6 text-center">
                        <Link
                          href="/dashboard/miyomi"
                          className="inline-block px-8 py-3 border-2 border-red-500 text-red-400 hover:bg-red-500 hover:text-black transition-all font-bold uppercase tracking-wider text-sm"
                        >
                          VIEW LIVE DASHBOARD
                        </Link>
                      </div>
                    </div>
                  </div>
                )}

                {/* Recent Works Preview */}
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold uppercase tracking-wider">
                      {agent.handle === 'solienne' ? 'FEATURED CONSCIOUSNESS STREAMS' : 'RECENT WORKS'}
                    </h3>
                    <button
                      onClick={() => setActiveTab('works')}
                      className="text-sm font-bold uppercase tracking-wider text-gray-400 hover:text-white transition-colors"
                    >
                      VIEW ALL WORKS →
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {works.slice(0, 6).map((work, index) => (
                      <div key={work.id} className="border border-gray-600 hover:border-white transition-colors group">
                        <div className="aspect-square bg-gray-900 flex items-center justify-center relative overflow-hidden">
                          {agent.handle === 'solienne' ? (
                            <div className="text-center p-2">
                              <div className="text-xs text-gray-400 mb-2">STREAM #{1740 - index}</div>
                              <div className="text-xs font-bold uppercase mb-1">{work.title}</div>
                              <div className="text-xs text-gray-500">
                                {work.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              </div>
                              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-gray-800/20 to-gray-700/40 group-hover:from-white/5 group-hover:to-white/10 transition-all duration-500"></div>
                            </div>
                          ) : (
                            <div className="text-xs text-gray-400 text-center">
                              <div className="mb-2">{agent.name}</div>
                              <div>WORK #{work.id.split('-')[1]}</div>
                            </div>
                          )}
                        </div>
                        <div className="p-2">
                          <div className="text-xs font-bold uppercase line-clamp-1">{work.title}</div>
                          {agent.handle === 'solienne' && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {work.tags?.slice(0, 2).map(tag => (
                                <span key={tag} className="px-1 py-0.5 text-xs bg-gray-800 border border-gray-700 rounded">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* SOLIENNE-specific call to action */}
                  {agent.handle === 'solienne' && (
                    <div className="mt-8 text-center">
                      <div className="inline-flex items-center gap-4 px-8 py-4 border-2 border-white hover:bg-white hover:text-black transition-all group">
                        <div className="text-sm font-bold uppercase tracking-wider">
                          Explore Consciousness Studio
                        </div>
                        <div className="text-xs text-gray-400 group-hover:text-gray-600">
                          Create → Curate → Exhibit
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
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

        {activeTab === 'beta' && isFeatureEnabled(FLAGS.ENABLE_AGENT_BETA_SECTION) && (
          <div>
            <AgentBetaSection agentSlug={agentSlug} agentName={agent.name} />
          </div>
        )}
      </div>
    </div>
  );
}