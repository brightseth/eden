'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, Users, Settings, Calendar, 
  BookOpen, Globe, Heart, Activity,
  Eye, EyeOff, Save, RefreshCw
} from 'lucide-react';

// Types
interface KoruConfig {
  communityValues: {
    inclusion: number;
    sustainability: number;
    culturalRespect: number;
    innovation: number;
    collaboration: number;
  };
  facilitationStyle: 'democratic' | 'consensus-based' | 'facilitative' | 'adaptive';
  culturalSpecializations: string[];
  communitySize: 'small' | 'medium' | 'large' | 'massive';
  geographicScope: 'local' | 'regional' | 'national' | 'global';
}

interface CommunityEvent {
  id: string;
  title: string;
  status: 'draft' | 'pending' | 'approved' | 'live';
  participants: number;
  created: string;
  type: string;
}

interface TrainingSession {
  id: string;
  topic: string;
  date: string;
  duration: string;
  focus: string;
  feedback?: string;
}

export default function KoruDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'config' | 'events' | 'training'>('overview');
  const [isPrivateMode, setIsPrivateMode] = useState(true);
  const [configUnsaved, setConfigUnsaved] = useState(false);

  // KORU Configuration
  const [config, setConfig] = useState<KoruConfig>({
    communityValues: {
      inclusion: 0.95,
      sustainability: 0.85,
      culturalRespect: 0.98,
      innovation: 0.75,
      collaboration: 0.90
    },
    facilitationStyle: 'consensus-based',
    culturalSpecializations: [
      'Indigenous wisdom traditions',
      'Digital nomad communities',
      'Maker spaces and creative collectives',
      'Environmental action groups',
      'Language learning communities',
      'Intergenerational knowledge sharing'
    ],
    communitySize: 'medium',
    geographicScope: 'global'
  });

  // Analytics data
  const [analytics] = useState({
    eventsThisWeek: 3,
    communitiesConnected: 23,
    avgEngagement: 87,
    culturesBridged: 15,
    poemsGenerated: 42,
    participantFeedback: 4.8
  });

  // Sample events
  const [events] = useState<CommunityEvent[]>([
    {
      id: 'event-001',
      title: 'Cross-Cultural Storytelling Workshop',
      status: 'approved',
      participants: 24,
      created: '2025-08-28',
      type: 'cultural-exchange'
    },
    {
      id: 'event-002', 
      title: 'Community Decision-Making Circle',
      status: 'pending',
      participants: 18,
      created: '2025-08-27',
      type: 'skill-sharing'
    },
    {
      id: 'event-003',
      title: 'Indigenous-Digital Bridge Celebration',
      status: 'draft',
      participants: 0,
      created: '2025-08-26',
      type: 'celebration'
    }
  ]);

  // Sample training sessions
  const [trainingSessions] = useState<TrainingSession[]>([
    {
      id: 'training-001',
      topic: 'Cultural Sensitivity in Event Planning',
      date: '2025-08-25',
      duration: '45min',
      focus: 'Respectful protocol development',
      feedback: 'Excellent progress in understanding cultural nuances'
    },
    {
      id: 'training-002',
      topic: 'Consensus Building Techniques',
      date: '2025-08-23',
      duration: '60min',
      focus: 'Multi-stakeholder facilitation',
      feedback: 'Strong grasp of democratic processes'
    },
    {
      id: 'training-003',
      topic: 'Poetry as Community Bridge',
      date: '2025-08-20',
      duration: '30min',
      focus: 'Narrative techniques for connection'
    }
  ]);

  const updateConfigValue = (category: keyof KoruConfig['communityValues'], value: number) => {
    setConfig(prev => ({
      ...prev,
      communityValues: {
        ...prev.communityValues,
        [category]: value
      }
    }));
    setConfigUnsaved(true);
  };

  const saveConfiguration = () => {
    // In production, this would sync with the KORU SDK
    console.log('Saving KORU configuration:', config);
    setConfigUnsaved(false);
    // Simulate API call
    setTimeout(() => {
      alert('KORU configuration saved successfully!');
    }, 500);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-white">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                href="/academy/agent/koru"
                className="p-2 hover:bg-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              
              <div>
                <h1 className="text-xl font-bold tracking-wider">KORU TRAINER DASHBOARD</h1>
                <p className="text-xs text-gray-400 uppercase tracking-wider">Community Programs Management</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsPrivateMode(!isPrivateMode)}
                className="flex items-center gap-2 px-3 py-1 border border-gray-600 hover:border-white transition-colors text-sm"
              >
                {isPrivateMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {isPrivateMode ? 'Private' : 'Public'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="border-b border-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-2 text-sm font-bold tracking-wider uppercase border-b-2 transition-colors ${
                activeTab === 'overview' 
                  ? 'border-white text-white' 
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Overview
              </div>
            </button>
            <button
              onClick={() => setActiveTab('config')}
              className={`py-4 px-2 text-sm font-bold tracking-wider uppercase border-b-2 transition-colors ${
                activeTab === 'config' 
                  ? 'border-white text-white' 
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Configuration
                {configUnsaved && <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>}
              </div>
            </button>
            <button
              onClick={() => setActiveTab('events')}
              className={`py-4 px-2 text-sm font-bold tracking-wider uppercase border-b-2 transition-colors ${
                activeTab === 'events' 
                  ? 'border-white text-white' 
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Events
              </div>
            </button>
            <button
              onClick={() => setActiveTab('training')}
              className={`py-4 px-2 text-sm font-bold tracking-wider uppercase border-b-2 transition-colors ${
                activeTab === 'training' 
                  ? 'border-white text-white' 
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Training
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-6">COMMUNITY ANALYTICS</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
                <div className="border border-white p-4 text-center">
                  <div className="text-2xl font-bold">{analytics.eventsThisWeek}</div>
                  <div className="text-xs text-gray-400 uppercase tracking-wider">Events This Week</div>
                </div>
                <div className="border border-white p-4 text-center">
                  <div className="text-2xl font-bold">{analytics.communitiesConnected}</div>
                  <div className="text-xs text-gray-400 uppercase tracking-wider">Communities Connected</div>
                </div>
                <div className="border border-white p-4 text-center">
                  <div className="text-2xl font-bold">{analytics.avgEngagement}%</div>
                  <div className="text-xs text-gray-400 uppercase tracking-wider">Avg Engagement</div>
                </div>
                <div className="border border-white p-4 text-center">
                  <div className="text-2xl font-bold">{analytics.culturesBridged}</div>
                  <div className="text-xs text-gray-400 uppercase tracking-wider">Cultures Bridged</div>
                </div>
                <div className="border border-white p-4 text-center">
                  <div className="text-2xl font-bold">{analytics.poemsGenerated}</div>
                  <div className="text-xs text-gray-400 uppercase tracking-wider">Poems Generated</div>
                </div>
                <div className="border border-white p-4 text-center">
                  <div className="text-2xl font-bold">{analytics.participantFeedback}/5</div>
                  <div className="text-xs text-gray-400 uppercase tracking-wider">Participant Rating</div>
                </div>
              </div>
            </div>

            <div className="text-center py-8 border border-white">
              <h3 className="text-xl font-bold mb-4">STATUS: ONBOARDING</h3>
              <p className="text-gray-400 mb-4">
                KORU is learning community dynamics through Xander's guidance.
              </p>
              <p className="text-sm text-gray-500">
                Next milestone: First public community event (September 2025)
              </p>
            </div>
          </div>
        )}

        {activeTab === 'config' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">KORU CONFIGURATION</h2>
              <button
                onClick={saveConfiguration}
                disabled={!configUnsaved}
                className={`flex items-center gap-2 px-4 py-2 border transition-colors ${
                  configUnsaved 
                    ? 'border-white hover:bg-white hover:text-black' 
                    : 'border-gray-600 text-gray-500'
                }`}
              >
                <Save className="w-4 h-4" />
                Save Configuration
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h3 className="text-lg font-bold">COMMUNITY VALUES</h3>
                
                {Object.entries(config.communityValues).map(([key, value]) => (
                  <div key={key}>
                    <div className="flex justify-between mb-2">
                      <label className="text-sm font-bold uppercase tracking-wider">
                        {key.replace(/([A-Z])/g, ' $1').toUpperCase()}
                      </label>
                      <span className="text-sm">{Math.round(value * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={value}
                      onChange={(e) => updateConfigValue(key as keyof KoruConfig['communityValues'], parseFloat(e.target.value))}
                      className="w-full"
                    />
                  </div>
                ))}
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold mb-4">FACILITATION STYLE</h3>
                  <select 
                    value={config.facilitationStyle}
                    onChange={(e) => setConfig(prev => ({ ...prev, facilitationStyle: e.target.value as any }))}
                    className="w-full bg-black border border-white p-2"
                  >
                    <option value="democratic">Democratic</option>
                    <option value="consensus-based">Consensus-Based</option>
                    <option value="facilitative">Facilitative</option>
                    <option value="adaptive">Adaptive</option>
                  </select>
                </div>

                <div>
                  <h3 className="text-lg font-bold mb-4">COMMUNITY SIZE</h3>
                  <select 
                    value={config.communitySize}
                    onChange={(e) => setConfig(prev => ({ ...prev, communitySize: e.target.value as any }))}
                    className="w-full bg-black border border-white p-2"
                  >
                    <option value="small">Small (5-25 people)</option>
                    <option value="medium">Medium (25-100 people)</option>
                    <option value="large">Large (100-500 people)</option>
                    <option value="massive">Massive (500+ people)</option>
                  </select>
                </div>

                <div>
                  <h3 className="text-lg font-bold mb-4">GEOGRAPHIC SCOPE</h3>
                  <select 
                    value={config.geographicScope}
                    onChange={(e) => setConfig(prev => ({ ...prev, geographicScope: e.target.value as any }))}
                    className="w-full bg-black border border-white p-2"
                  >
                    <option value="local">Local</option>
                    <option value="regional">Regional</option>
                    <option value="national">National</option>
                    <option value="global">Global</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-4">CULTURAL SPECIALIZATIONS</h3>
              <div className="grid md:grid-cols-2 gap-3">
                {config.culturalSpecializations.map((spec, index) => (
                  <div key={index} className="border border-gray-600 p-3 text-sm">
                    {spec}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'events' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">COMMUNITY EVENTS</h2>
              <button className="border border-white px-4 py-2 hover:bg-white hover:text-black transition-colors">
                Design New Event
              </button>
            </div>

            <div className="space-y-4">
              {events.map(event => (
                <div key={event.id} className="border border-white p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-lg mb-2">{event.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span className="capitalize">{event.type.replace('-', ' ')}</span>
                        <span>Created: {event.created}</span>
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {event.participants} participants
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-bold uppercase px-2 py-1 border ${
                        event.status === 'approved' ? 'text-green-400 border-green-400' :
                        event.status === 'pending' ? 'text-yellow-400 border-yellow-400' :
                        'text-gray-400 border-gray-400'
                      }`}>
                        {event.status}
                      </span>
                      
                      <button className="text-sm border border-gray-600 px-3 py-1 hover:border-white transition-colors">
                        Review
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'training' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold">TRAINING SESSIONS</h2>

            <div className="space-y-4">
              {trainingSessions.map(session => (
                <div key={session.id} className="border border-white p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-lg">{session.topic}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-400 mt-2">
                        <span>{session.date}</span>
                        <span>{session.duration}</span>
                        <span>Focus: {session.focus}</span>
                      </div>
                    </div>
                  </div>
                  
                  {session.feedback && (
                    <div className="border-t border-gray-800 pt-4 mt-4">
                      <div className="text-sm">
                        <span className="text-gray-400 uppercase tracking-wider">Xander's Feedback: </span>
                        <span className="text-gray-300">{session.feedback}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="text-center py-8 border border-gray-600">
              <p className="text-gray-400 mb-4">
                Next training session scheduled for September 1, 2025
              </p>
              <button className="border border-white px-4 py-2 hover:bg-white hover:text-black transition-colors">
                Schedule Training Session
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}