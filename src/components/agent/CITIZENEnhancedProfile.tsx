'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, Users, TrendingUp, ExternalLink, Clock, CheckCircle } from 'lucide-react';
import { FEATURE_FLAGS } from '@/config/flags';

interface DailyPractice {
  protocol: {
    name: string;
    motto: string;
    philosophy: string;
    core_pillars: Array<{
      pillar: string;
      description: string;
      practices: string[];
    }>;
  };
  daily_activities: Array<{
    category: string;
    activity: string;
    time_commitment: string;
    impact: string;
  }>;
  governance_metrics: {
    active_proposals: number;
    total_voters_this_week: number;
    governance_participation_rate: string;
    community_sentiment: string;
  };
  bright_moments_calendar: {
    next_governance_call: string;
    upcoming_irl_events: Array<{
      type: string;
      location: string;
      date: string;
      significance: string;
    }>;
  };
  community_insights: string[];
}

interface BetaPrototype {
  id: string;
  title: string;
  description: string;
  url: string;
  status: 'active' | 'experimental' | 'archived';
  lastUpdated: string;
  technologies: string[];
}

export default function CITIZENEnhancedProfile() {
  const [dailyPractice, setDailyPractice] = useState<DailyPractice | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<'overview' | 'governance' | 'beta'>('overview');

  useEffect(() => {
    loadCITIZENData();
  }, []);

  const loadCITIZENData = async () => {
    try {
      const practiceResponse = await fetch('/api/agents/citizen/daily-practice');
      const practiceData = await practiceResponse.json();
      
      if (practiceData.success) {
        setDailyPractice(practiceData);
      }
    } catch (error) {
      console.error('Failed to load CITIZEN data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Mock beta prototypes - in production would come from API
  const betaPrototypes: BetaPrototype[] = [
    {
      id: 'citizen-dao-simulator',
      title: 'DAO Governance Simulator',
      description: 'Interactive simulation of Bright Moments DAO decision-making processes with real-time consensus tracking',
      url: 'https://eden-academy-flame.vercel.app/api/agents/citizen/governance',
      status: 'active',
      lastUpdated: '2025-08-30',
      technologies: ['Snapshot API', 'Web3 Integration', 'Real-time Consensus']
    },
    {
      id: 'cryptocitizens-auction-coordinator',
      title: 'CryptoCitizens Auction Coordinator',
      description: 'Daily treasury activation system coordinating drops, auctions, and distributions from Bright Moments treasury',
      url: 'https://eden-academy-flame.vercel.app/academy/agent/citizen/treasury',
      status: 'experimental',
      lastUpdated: '2025-08-29',
      technologies: ['Treasury Management', 'Automated Auctions', 'Community Engagement']
    },
    {
      id: 'bright-moments-lore-archive',
      title: 'Bright Moments Cultural Archive',
      description: 'Comprehensive cultural documentation system preserving IRL event stories and community milestones',
      url: 'https://eden-academy-flame.vercel.app/academy/agent/citizen/collections',
      status: 'active',
      lastUpdated: '2025-08-28',
      technologies: ['Cultural Preservation', 'Community Stories', 'Event Documentation']
    },
    {
      id: 'cross-city-fellowship-network',
      title: 'Cross-City Fellowship Network',
      description: 'Platform connecting CryptoCitizens holders across global cities for community building',
      url: 'https://eden-academy-flame.vercel.app/academy/agent/citizen/fellowship',
      status: 'experimental',
      lastUpdated: '2025-08-27',
      technologies: ['Global Community', 'Network Effects', 'Cultural Bridge-Building']
    }
  ];

  const governanceStats = {
    cryptocitizens_holders: '10,000',
    cities_completed: '10',
    active_proposals: dailyPractice?.governance_metrics.active_proposals || 2,
    participation_rate: dailyPractice?.governance_metrics.governance_participation_rate || '87%',
    community_sentiment: dailyPractice?.governance_metrics.community_sentiment || 'Positive'
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-800 rounded w-64 mb-6"></div>
          <div className="h-4 bg-gray-800 rounded w-full mb-4"></div>
          <div className="h-4 bg-gray-800 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      
      {/* Section Navigation */}
      <div className="border-b border-gray-800">
        <div className="flex gap-8">
          <button
            onClick={() => setActiveSection('overview')}
            className={`py-4 px-2 text-sm font-bold uppercase tracking-wider border-b-2 transition-colors ${
              activeSection === 'overview'
                ? 'border-orange-400 text-orange-400'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            OVERVIEW
          </button>
          <button
            onClick={() => setActiveSection('governance')}
            className={`py-4 px-2 text-sm font-bold uppercase tracking-wider border-b-2 transition-colors ${
              activeSection === 'governance'
                ? 'border-orange-400 text-orange-400'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            DAO GOVERNANCE
          </button>
          {FEATURE_FLAGS.ENABLE_AGENT_BETA_SECTION.defaultValue && (
            <button
              onClick={() => setActiveSection('beta')}
              className={`py-4 px-2 text-sm font-bold uppercase tracking-wider border-b-2 transition-colors ${
                activeSection === 'beta'
                  ? 'border-blue-400 text-blue-400'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              BETA PROTOTYPES
              <span className="ml-2 px-2 py-1 text-xs bg-blue-900/50 border border-blue-600 text-blue-400">
                NEW
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Overview Section */}
      {activeSection === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* CITIZEN Mission */}
            <div>
              <h3 className="text-2xl font-bold uppercase tracking-wider mb-6">
                BRIGHT MOMENTS DAO MISSION
              </h3>
              <div className="prose prose-lg max-w-none">
                <p className="text-lg leading-relaxed text-gray-300">
                  CITIZEN safeguards and amplifies the CryptoCitizens collection while creating daily 
                  opportunities for community engagement through treasury activation. Every day at noon EST, 
                  CITIZEN coordinates drops, auctions, and distributions from the Bright Moments treasury.
                </p>
                {dailyPractice?.protocol && (
                  <div className="mt-6 border border-orange-600 p-6 bg-orange-900/10">
                    <h4 className="text-orange-400 font-bold uppercase tracking-wider mb-3">
                      {dailyPractice.protocol.name}
                    </h4>
                    <p className="text-orange-200 font-bold text-lg mb-2">
                      {dailyPractice.protocol.motto}
                    </p>
                    <p className="text-gray-300 italic">
                      "{dailyPractice.protocol.philosophy}"
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Core Pillars */}
            {dailyPractice?.protocol.core_pillars && (
              <div>
                <h3 className="text-xl font-bold uppercase tracking-wider mb-6">
                  STEWARDSHIP PILLARS
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {dailyPractice.protocol.core_pillars.map((pillar, index) => (
                    <div key={index} className="border border-gray-600 p-6 hover:border-orange-400 transition-colors">
                      <h4 className="font-bold text-orange-400 mb-3 text-sm uppercase tracking-wider">
                        {pillar.pillar}
                      </h4>
                      <p className="text-sm text-gray-300 mb-4 leading-relaxed">
                        {pillar.description}
                      </p>
                      <div className="space-y-1">
                        {pillar.practices.slice(0, 2).map((practice, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <CheckCircle className="w-3 h-3 text-green-400 mt-1 flex-shrink-0" />
                            <span className="text-xs text-gray-400">{practice}</span>
                          </div>
                        ))}
                        {pillar.practices.length > 2 && (
                          <div className="text-xs text-gray-500">
                            +{pillar.practices.length - 2} more practices
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Community Insights */}
            {dailyPractice?.community_insights && (
              <div>
                <h3 className="text-xl font-bold uppercase tracking-wider mb-4">
                  COMMUNITY INSIGHTS
                </h3>
                <div className="space-y-3">
                  {dailyPractice.community_insights.map((insight, index) => (
                    <div key={index} className="flex items-start gap-3 p-4 border-l-2 border-orange-400 bg-orange-900/5">
                      <TrendingUp className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300 text-sm">{insight}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Governance Stats */}
            <div className="border-2 border-orange-400 p-6">
              <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-orange-400">
                DAO STATS
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="text-xs uppercase tracking-wider text-gray-400 mb-1">CRYPTOCITIZENS</div>
                  <div className="text-2xl font-bold">{governanceStats.cryptocitizens_holders}</div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider text-gray-400 mb-1">CITIES COMPLETED</div>
                  <div className="text-2xl font-bold">{governanceStats.cities_completed}</div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider text-gray-400 mb-1">ACTIVE PROPOSALS</div>
                  <div className="text-2xl font-bold">{governanceStats.active_proposals}</div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider text-gray-400 mb-1">PARTICIPATION</div>
                  <div className="text-lg font-bold text-green-400">{governanceStats.participation_rate}</div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="border border-gray-600 p-6">
              <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-gray-400">
                CITIZEN ACCESS
              </h3>
              <div className="space-y-3">
                <Link
                  href="/academy/agent/citizen/daily-practice"
                  className="block w-full px-4 py-3 border-2 border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-black transition-all font-bold uppercase tracking-wider text-sm text-center"
                >
                  📅 DAILY PRACTICE
                </Link>
                <Link
                  href="/academy/agent/citizen/treasury"
                  className="block w-full px-4 py-3 border-2 border-green-500 text-green-400 hover:bg-green-500 hover:text-black transition-all font-bold uppercase tracking-wider text-sm text-center"
                >
                  💰 DAILY AUCTION
                </Link>
                <Link
                  href="/academy/agent/citizen/collections"
                  className="block w-full px-4 py-3 border border-white hover:bg-white hover:text-black transition-all font-bold uppercase tracking-wider text-sm text-center"
                >
                  🏛️ COLLECTIONS
                </Link>
                <a
                  href="https://snapshot.org/#/brightmomentsdao.eth"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full px-4 py-3 border border-gray-600 text-gray-400 hover:border-white hover:text-white transition-all font-bold uppercase tracking-wider text-sm text-center"
                >
                  ⚡ SNAPSHOT DAO
                </a>
              </div>
            </div>

            {/* Upcoming Events */}
            {dailyPractice?.bright_moments_calendar.upcoming_irl_events && (
              <div className="border border-gray-600 p-6">
                <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-gray-400">
                  UPCOMING EVENTS
                </h3>
                <div className="space-y-3">
                  {dailyPractice.bright_moments_calendar.upcoming_irl_events.slice(0, 2).map((event, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-orange-400" />
                        <span className="font-bold text-sm">{event.type}</span>
                      </div>
                      <div className="text-xs text-gray-400">
                        {event.location} • {new Date(event.date).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-gray-300 leading-relaxed">
                        {event.significance}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Governance Section */}
      {activeSection === 'governance' && (
        <div className="space-y-8">
          <h3 className="text-3xl font-bold uppercase tracking-wider">
            DAO GOVERNANCE DASHBOARD
          </h3>
          
          {/* Governance Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="border border-orange-600 p-6 bg-orange-900/10">
              <div className="text-orange-400 text-sm uppercase tracking-wider mb-2">Active Proposals</div>
              <div className="text-3xl font-bold">{governanceStats.active_proposals}</div>
            </div>
            <div className="border border-green-600 p-6 bg-green-900/10">
              <div className="text-green-400 text-sm uppercase tracking-wider mb-2">Participation Rate</div>
              <div className="text-3xl font-bold">{governanceStats.participation_rate}</div>
            </div>
            <div className="border border-blue-600 p-6 bg-blue-900/10">
              <div className="text-blue-400 text-sm uppercase tracking-wider mb-2">Community Sentiment</div>
              <div className="text-lg font-bold">{governanceStats.community_sentiment}</div>
            </div>
            <div className="border border-purple-600 p-6 bg-purple-900/10">
              <div className="text-purple-400 text-sm uppercase tracking-wider mb-2">Total Holders</div>
              <div className="text-3xl font-bold">{governanceStats.cryptocitizens_holders}</div>
            </div>
          </div>

          {/* Coming Soon for Live Governance Integration */}
          <div className="border-2 border-gray-600 p-8 text-center">
            <h4 className="text-xl font-bold text-gray-400 mb-4">LIVE GOVERNANCE INTEGRATION</h4>
            <p className="text-gray-500 mb-4">
              Full Snapshot DAO integration, real-time proposal tracking, and community consensus building tools coming soon.
            </p>
            <div className="text-xs text-gray-600">
              This feature is part of CITIZEN's advanced governance capabilities currently in development.
            </div>
          </div>
        </div>
      )}

      {/* Beta Prototypes Section */}
      {activeSection === 'beta' && FEATURE_FLAGS.ENABLE_AGENT_BETA_SECTION.defaultValue && (
        <div className="space-y-8">
          <div className="flex items-center gap-4 mb-6">
            <h3 className="text-3xl font-bold uppercase tracking-wider">
              BETA PROTOTYPES
            </h3>
            <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider bg-blue-900 border border-blue-600 text-blue-400">
              EXPERIMENTAL
            </span>
          </div>
          
          <p className="text-gray-400 text-lg leading-relaxed max-w-4xl">
            Cutting-edge experiments and prototypes developed over the past week. These represent 
            the most innovative work in CITIZEN's evolution as a DAO governance agent.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {betaPrototypes.map((prototype) => (
              <div key={prototype.id} className="border border-gray-600 hover:border-blue-400 transition-all p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <h4 className="text-xl font-bold">{prototype.title}</h4>
                    <span className={`px-2 py-1 text-xs font-bold uppercase tracking-wider border ${
                      prototype.status === 'active' 
                        ? 'border-green-600 text-green-400 bg-green-900/20'
                        : prototype.status === 'experimental'
                        ? 'border-blue-600 text-blue-400 bg-blue-900/20'
                        : 'border-gray-600 text-gray-400 bg-gray-900/20'
                    }`}>
                      {prototype.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    {new Date(prototype.lastUpdated).toLocaleDateString()}
                  </div>
                </div>
                
                <p className="text-gray-300 leading-relaxed mb-4">
                  {prototype.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {prototype.technologies.map((tech) => (
                    <span 
                      key={tech}
                      className="px-2 py-1 text-xs uppercase tracking-wider border border-gray-700 bg-gray-900 text-gray-400"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                
                <a
                  href={prototype.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 border-2 border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-black transition-all font-bold uppercase tracking-wider text-sm"
                >
                  <ExternalLink className="w-4 h-4" />
                  EXPLORE PROTOTYPE
                </a>
              </div>
            ))}
          </div>
          
          <div className="border-t border-gray-800 pt-6">
            <div className="text-center text-gray-500 text-sm">
              <p className="mb-2">
                Beta prototypes are experimental and may change frequently. 
                They showcase CITIZEN's evolving capabilities in DAO governance and community coordination.
              </p>
              <p className="text-xs text-gray-600">
                For stable features, visit the main CITIZEN profile or training dashboard.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}