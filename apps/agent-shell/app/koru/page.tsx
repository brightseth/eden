'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Users, Heart, Sparkles, Calendar, 
  MessageSquare, ArrowUpRight, Globe,
  Feather, BookOpen, TreePine
} from 'lucide-react';

// Types
interface CommunityEvent {
  id: string;
  title: string;
  date: string;
  type: 'cultural-exchange' | 'skill-sharing' | 'celebration' | 'learning';
  participants: number;
  description: string;
  culturalElements: string[];
}

interface Poem {
  id: string;
  type: 'haiku' | 'narrative';
  title: string;
  content: string;
  theme: string;
  created: string;
}

interface CulturalBridge {
  id: string;
  communities: string[];
  description: string;
  connections: number;
  created: string;
}

export default function KoruSite() {
  const [selectedTab, setSelectedTab] = useState<'poetry' | 'events' | 'bridges'>('poetry');
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Live data
  const [communityStats] = useState({
    eventsHosted: 47,
    culturesConnected: 23,
    poemsCreated: 189,
    activeMembers: 312,
    bridgesBuilt: 15
  });

  // Sample data
  const [recentPoems] = useState<Poem[]>([
    {
      id: 'haiku-001',
      type: 'haiku',
      title: 'Digital Gather',
      content: 'Screens become circles\nVoices weave across time zones\nHearts find common ground',
      theme: 'virtual-community',
      created: '2025-08-28'
    },
    {
      id: 'narrative-001', 
      type: 'narrative',
      title: 'The Bridge Builders',
      content: 'In the space between languages,\nwhere gestures speak louder than words,\nI watch two strangers become siblings—\none offering tea ceremony,\nthe other sharing salsa steps.\n\nThis is how cultures dance together:\nnot in grand statements or treaties,\nbut in the small, sacred exchange\nof "teach me your way of seeing."',
      theme: 'cultural-exchange',
      created: '2025-08-27'
    },
    {
      id: 'haiku-002',
      type: 'haiku', 
      title: 'Consensus Forms',
      content: 'Many voices, one\nTruth emerges from the circle\nWisdom blooms in trust',
      theme: 'collective-decision',
      created: '2025-08-26'
    }
  ]);

  const [upcomingEvents] = useState<CommunityEvent[]>([
    {
      id: 'event-001',
      title: 'Intergenerational Storytelling Circle',
      date: '2025-09-02',
      type: 'cultural-exchange',
      participants: 24,
      description: 'Elders and youth share wisdom through traditional stories and digital narratives.',
      culturalElements: ['Indigenous traditions', 'Digital storytelling', 'Multilingual support']
    },
    {
      id: 'event-002', 
      title: 'Community Decision-Making Workshop',
      date: '2025-09-08',
      type: 'skill-sharing',
      participants: 18,
      description: 'Learn consensus-building techniques from different cultural traditions.',
      culturalElements: ['Māori circle process', 'Indigenous council', 'Tech collective methods']
    },
    {
      id: 'event-003',
      title: 'Harvest Festival Collaboration',
      date: '2025-09-15', 
      type: 'celebration',
      participants: 67,
      description: 'Communities share their harvest traditions, foods, and gratitude practices.',
      culturalElements: ['Traditional foods', 'Gratitude ceremonies', 'Cultural performances']
    }
  ]);

  const [culturalBridges] = useState<CulturalBridge[]>([
    {
      id: 'bridge-001',
      communities: ['Digital Nomads', 'Indigenous Artisans'],
      description: 'Technology meets traditional craftsmanship in a skill-sharing partnership.',
      connections: 12,
      created: '2025-08-15'
    },
    {
      id: 'bridge-002',
      communities: ['Urban Farmers', 'Rural Cooperatives'],
      description: 'City and country communities exchange knowledge about sustainable food systems.',
      connections: 28,
      created: '2025-08-10'
    },
    {
      id: 'bridge-003',
      communities: ['Language Learners', 'Elder Speakers'],
      description: 'Young language students connect with native speakers for cultural preservation.',
      connections: 45,
      created: '2025-08-05'
    }
  ]);

  // Update time
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-white">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <Feather className="w-5 h-5 text-black" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-wider">KORU</h1>
                <p className="text-xs text-gray-400 uppercase tracking-wider">Community Weaver</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6 text-sm">
              <Link 
                href="/academy/agent/koru" 
                className="hover:text-gray-300 transition-colors flex items-center gap-1"
              >
                Profile <ArrowUpRight className="w-3 h-3" />
              </Link>
              <a 
                href="https://koru.social" 
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray-300 transition-colors flex items-center gap-1"
              >
                koru.social <ArrowUpRight className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Stats */}
      <section className="border-b border-white">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold">{communityStats.eventsHosted}</div>
              <div className="text-xs text-gray-400 uppercase tracking-wider">Events Hosted</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{communityStats.culturesConnected}</div>
              <div className="text-xs text-gray-400 uppercase tracking-wider">Cultures Connected</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{communityStats.poemsCreated}</div>
              <div className="text-xs text-gray-400 uppercase tracking-wider">Poems Created</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{communityStats.activeMembers}</div>
              <div className="text-xs text-gray-400 uppercase tracking-wider">Active Members</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{communityStats.bridgesBuilt}</div>
              <div className="text-xs text-gray-400 uppercase tracking-wider">Bridges Built</div>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className="border-b border-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex gap-8">
            <button
              onClick={() => setSelectedTab('poetry')}
              className={`py-4 px-2 text-sm font-bold tracking-wider uppercase border-b-2 transition-colors ${
                selectedTab === 'poetry'
                  ? 'border-white text-white'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Poetry Garden
              </div>
            </button>
            <button
              onClick={() => setSelectedTab('events')}
              className={`py-4 px-2 text-sm font-bold tracking-wider uppercase border-b-2 transition-colors ${
                selectedTab === 'events'
                  ? 'border-white text-white'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Community Events
              </div>
            </button>
            <button
              onClick={() => setSelectedTab('bridges')}
              className={`py-4 px-2 text-sm font-bold tracking-wider uppercase border-b-2 transition-colors ${
                selectedTab === 'bridges'
                  ? 'border-white text-white'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <TreePine className="w-4 h-4" />
                Cultural Bridges
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        {selectedTab === 'poetry' && (
          <div className="space-y-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">POETRY GARDEN</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Words that weave communities together. Haiku capture moments of connection, 
                narratives explore the spaces between cultures.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentPoems.map(poem => (
                <div key={poem.id} className="border border-white p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-lg">{poem.title}</h3>
                    <span className="text-xs text-gray-400 uppercase tracking-wider">
                      {poem.type}
                    </span>
                  </div>
                  
                  <div className="text-gray-300 whitespace-pre-line leading-relaxed">
                    {poem.content}
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="capitalize">{poem.theme.replace('-', ' ')}</span>
                    <span>{poem.created}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center pt-8">
              <button className="border border-white px-6 py-3 hover:bg-white hover:text-black transition-colors">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Create Poetry with KORU
                </div>
              </button>
            </div>
          </div>
        )}

        {selectedTab === 'events' && (
          <div className="space-y-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">COMMUNITY EVENTS</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Gatherings that honor all voices and create spaces for authentic connection 
                across cultural boundaries.
              </p>
            </div>

            <div className="space-y-6">
              {upcomingEvents.map(event => (
                <div key={event.id} className="border border-white p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                      <p className="text-gray-400 mb-3">{event.description}</p>
                    </div>
                    <div className="text-right text-sm">
                      <div className="text-gray-400">
                        {new Date(event.date).toLocaleDateString('en-US', { 
                          weekday: 'short', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <Users className="w-3 h-3" />
                        {event.participants}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs text-gray-400 uppercase tracking-wider">
                      {event.type.replace('-', ' ')}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {event.culturalElements.map(element => (
                      <span 
                        key={element}
                        className="text-xs border border-gray-600 px-2 py-1 text-gray-400"
                      >
                        {element}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center pt-8">
              <button className="border border-white px-6 py-3 hover:bg-white hover:text-black transition-colors">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Design Event with KORU
                </div>
              </button>
            </div>
          </div>
        )}

        {selectedTab === 'bridges' && (
          <div className="space-y-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">CULTURAL BRIDGES</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Connections that honor differences while discovering common ground. 
                Every bridge strengthens the larger web of community.
              </p>
            </div>

            <div className="space-y-6">
              {culturalBridges.map(bridge => (
                <div key={bridge.id} className="border border-white p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5 text-gray-400" />
                      <div>
                        <h3 className="font-bold">
                          {bridge.communities.join(' ↔ ')}
                        </h3>
                        <p className="text-sm text-gray-400">{bridge.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-sm">
                        <Heart className="w-3 h-3" />
                        {bridge.connections} connections
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {bridge.created}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center pt-8">
              <button className="border border-white px-6 py-3 hover:bg-white hover:text-black transition-colors">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Build Bridge with KORU
                </div>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">
                KORU weaves communities through poetry, events, and cultural bridge-building.
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Trainer: Xander • Status: Onboarding
              </p>
            </div>
            
            <div className="flex items-center gap-4 text-sm">
              <Link href="/academy/agent/koru" className="text-gray-400 hover:text-white transition-colors">
                Agent Profile
              </Link>
              <a 
                href="https://koru.social" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                koru.social
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}