'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Settings, TrendingUp, DollarSign, Activity, 
  BarChart3, Target, Sliders, Calendar,
  Download, RefreshCw, Lock, Unlock,
  AlertCircle, CheckCircle, XCircle, Sparkles, Play, Eye
} from 'lucide-react';

interface TrainerConfig {
  riskTolerance: number;
  contrarianDial: number;
  sectorWeights: {
    politics: number;
    sports: number;
    finance: number;
    ai: number;
    pop: number;
    geo: number;
    internet: number;
  };
  bannedTopics: string[];
  tone: {
    energy: number;
    sass: number;
    profanity: number;
  };
}

interface PerformanceData {
  date: string;
  picks: number;
  wins: number;
  losses: number;
  pending: number;
  avgEdge: number;
  totalReturn: number;
}

import LiveTradingInterface from '@/components/miyomi/LiveTradingInterface';
import VideoGenerator from '@/components/miyomi/VideoGenerator';
import ConceptGenerator from '@/components/miyomi/ConceptGenerator';
import EdenApiTester from '@/components/miyomi/EdenApiTester';

// Import concept options from the video generation dashboard
const CONCEPT_OPTIONS = [
  {
    id: 'anomaly_market_divergence',
    title: 'Market Anomaly: Hidden Price Divergence',
    description: 'Unusual trading patterns suggest institutional positioning before major announcement',
    urgency: 88,
    views: '180K',
    type: 'anomaly'
  },
  {
    id: 'trend_sector_rotation',
    title: 'Emerging Trend: Cross-Asset Momentum Shift',
    description: 'Multi-asset correlation breakdown signals major sector rotation',
    urgency: 75,
    views: '145K',
    type: 'trend'
  },
  {
    id: 'contrarian_sentiment_divergence',
    title: 'Contrarian Signal: Sentiment vs Data Disconnect',
    description: 'Fear index diverging from fundamental indicators creates opportunity',
    urgency: 92,
    views: '220K',
    type: 'contrarian'
  },
  {
    id: 'anomaly_options_flow',
    title: 'Options Flow Anomaly: Unusual Strike Activity',
    description: 'Massive options volume at specific strikes suggests insider knowledge',
    urgency: 85,
    views: '165K',
    type: 'anomaly'
  }
];

export default function MiyomiDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'trading' | 'concepts' | 'videos' | 'generation' | 'testing' | 'training' | 'performance' | 'revenue'>('overview');
  const [config, setConfig] = useState<TrainerConfig>({
    riskTolerance: 0.65,
    contrarianDial: 0.95,
    sectorWeights: {
      politics: 0.25,
      sports: 0.20,
      finance: 0.15,
      ai: 0.15,
      pop: 0.15,
      geo: 0.05,
      internet: 0.05
    },
    bannedTopics: [],
    tone: {
      energy: 0.8,
      sass: 0.7,
      profanity: 0.2
    }
  });
  
  const [performanceData] = useState<PerformanceData[]>([
    { date: '2025-08-20', picks: 3, wins: 2, losses: 0, pending: 1, avgEdge: 18.5, totalReturn: 24.3 },
    { date: '2025-08-21', picks: 3, wins: 1, losses: 1, pending: 1, avgEdge: 15.2, totalReturn: 8.7 },
    { date: '2025-08-22', picks: 3, wins: 3, losses: 0, pending: 0, avgEdge: 22.1, totalReturn: 42.5 },
    { date: '2025-08-23', picks: 3, wins: 2, losses: 1, pending: 0, avgEdge: 16.8, totalReturn: 18.2 },
    { date: '2025-08-24', picks: 3, wins: 1, losses: 0, pending: 2, avgEdge: 19.3, totalReturn: 12.1 },
    { date: '2025-08-25', picks: 3, wins: 2, losses: 0, pending: 1, avgEdge: 20.7, totalReturn: 28.9 },
    { date: '2025-08-26', picks: 3, wins: 1, losses: 1, pending: 1, avgEdge: 17.4, totalReturn: 15.3 }
  ]);

  const [revenueData] = useState({
    subscriptions: 142,
    monthlyRevenue: 710,
    tips: 89,
    referralClicks: 1842,
    conversionRate: 7.7
  });

  function handleConfigUpdate(field: string, value: any) {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
  }

  function handleSectorWeightUpdate(sector: string, value: number) {
    setConfig(prev => ({
      ...prev,
      sectorWeights: {
        ...prev.sectorWeights,
        [sector]: value / 100
      }
    }));
  }

  function handleToneUpdate(aspect: string, value: number) {
    setConfig(prev => ({
      ...prev,
      tone: {
        ...prev.tone,
        [aspect]: value / 100
      }
    }));
  }

  async function saveConfig() {
    // Would send to API
    console.log('Saving config:', config);
    alert('Configuration saved successfully!');
  }

  // Helper functions for video generation
  const [selectedConcept, setSelectedConcept] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateVideo = (concept: any) => {
    setSelectedConcept(concept);
    setIsGenerating(true);
    
    // Simulate video generation process
    setTimeout(() => {
      setIsGenerating(false);
      alert(`Video "${concept.title}" generated successfully!`);
    }, 3000);
  };

  const getUrgencyColor = (urgency: number) => {
    if (urgency >= 90) return 'text-red-400 bg-red-400/20';
    if (urgency >= 80) return 'text-orange-400 bg-orange-400/20';
    if (urgency >= 70) return 'text-yellow-400 bg-yellow-400/20';
    return 'text-green-400 bg-green-400/20';
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'anomaly': return '⚡';
      case 'trend': return '📈';
      case 'contrarian': return '🎯';
      default: return '💡';
    }
  };

  const totalPicks = performanceData.reduce((sum, day) => sum + day.picks, 0);
  const totalWins = performanceData.reduce((sum, day) => sum + day.wins, 0);
  const totalLosses = performanceData.reduce((sum, day) => sum + day.losses, 0);
  const winRate = totalPicks > 0 ? (totalWins / (totalWins + totalLosses) * 100).toFixed(1) : '0';
  const avgReturn = performanceData.reduce((sum, day) => sum + day.totalReturn, 0) / performanceData.length;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/sites/miyomi" className="text-2xl font-bold">
              MIYOMI
            </Link>
            <span className="text-sm text-gray-400">Trainer Dashboard</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/academy/agent/miyomi" className="text-sm hover:text-red-400 transition">
              ← Back to Profile
            </Link>
          </nav>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-8">
            {['overview', 'trading', 'concepts', 'videos', 'generation', 'testing', 'training', 'performance', 'revenue'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`py-4 capitalize border-b-2 transition ${
                  activeTab === tab 
                    ? 'border-red-500 text-red-500' 
                    : 'border-transparent hover:text-red-400'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Quick Stats */}
            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-white/5 backdrop-blur rounded-lg p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Win Rate</span>
                  <TrendingUp className="w-4 h-4 text-green-500" />
                </div>
                <div className="text-3xl font-bold">{winRate}%</div>
                <div className="text-sm text-gray-400 mt-1">Last 7 days</div>
              </div>
              <div className="bg-white/5 backdrop-blur rounded-lg p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Active Subs</span>
                  <DollarSign className="w-4 h-4 text-yellow-500" />
                </div>
                <div className="text-3xl font-bold">{revenueData.subscriptions}</div>
                <div className="text-sm text-green-400 mt-1">+12 this week</div>
              </div>
              <div className="bg-white/5 backdrop-blur rounded-lg p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Avg Return</span>
                  <BarChart3 className="w-4 h-4 text-blue-500" />
                </div>
                <div className="text-3xl font-bold">{avgReturn.toFixed(1)}%</div>
                <div className="text-sm text-gray-400 mt-1">Per day</div>
              </div>
              <div className="bg-white/5 backdrop-blur rounded-lg p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Next Drop</span>
                  <Activity className="w-4 h-4 text-purple-500" />
                </div>
                <div className="text-3xl font-bold">15:00</div>
                <div className="text-sm text-gray-400 mt-1">In 2h 34m</div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white/5 backdrop-blur rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4">Recent Picks</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-3 border-b border-white/10">
                  <div>
                    <div className="font-bold">Fed Rate Cut March - NO</div>
                    <div className="text-sm text-gray-400">Kalshi • 2 hours ago</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-yellow-500">18% edge</span>
                    <Activity className="w-5 h-5 text-yellow-500" />
                  </div>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-white/10">
                  <div>
                    <div className="font-bold">Chiefs -7.5 - NO</div>
                    <div className="text-sm text-gray-400">Polymarket • Yesterday</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-green-500">+15% return</span>
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  </div>
                </div>
                <div className="flex items-center justify-between py-3">
                  <div>
                    <div className="font-bold">Taylor Swift Tour - NO</div>
                    <div className="text-sm text-gray-400">Manifold • 2 days ago</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-gray-400">Pending</span>
                    <AlertCircle className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'trading' && (
          <div>
            <LiveTradingInterface 
              isSubscribed={true} // For demo purposes
              onSubscriptionRequired={() => alert('Subscription required for live trading!')}
            />
          </div>
        )}

        {activeTab === 'concepts' && (
          <div>
            <ConceptGenerator />
          </div>
        )}

        {activeTab === 'videos' && (
          <div>
            <VideoGenerator />
          </div>
        )}

        {activeTab === 'generation' && (
          <div className="space-y-8">
            {/* Generation Stats */}
            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-white/5 backdrop-blur rounded-lg p-6">
                <div className="text-2xl font-bold text-green-400">92%</div>
                <div className="text-xs text-white/60">Success Rate</div>
              </div>
              <div className="bg-white/5 backdrop-blur rounded-lg p-6">
                <div className="text-2xl font-bold text-blue-400">1.2M</div>
                <div className="text-xs text-white/60">Total Views</div>
              </div>
              <div className="bg-white/5 backdrop-blur rounded-lg p-6">
                <div className="text-2xl font-bold text-purple-400">147</div>
                <div className="text-xs text-white/60">Videos Created</div>
              </div>
              <div className="bg-white/5 backdrop-blur rounded-lg p-6">
                <div className="text-2xl font-bold text-orange-400">Live</div>
                <div className="text-xs text-white/60">Market Status</div>
              </div>
            </div>

            {/* Video Generation Header */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-2">🎬 Generate Market Videos</h2>
              <p className="text-white/70">
                Transform market insights into compelling cinematic content using the Dynamic Narrative Video Framework.
              </p>
            </div>

            {/* Concept Selection */}
            <div className="grid md:grid-cols-2 gap-6">
              {CONCEPT_OPTIONS.map((concept) => (
                <div 
                  key={concept.id}
                  className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all group cursor-pointer"
                  onClick={() => handleGenerateVideo(concept)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{getTypeIcon(concept.type)}</div>
                      <div>
                        <h3 className="font-bold text-lg group-hover:text-purple-400 transition">
                          {concept.title}
                        </h3>
                        <div className="flex items-center gap-3 mt-1">
                          <span className={`text-xs px-2 py-1 rounded-full ${getUrgencyColor(concept.urgency)}`}>
                            {concept.urgency}% Urgency
                          </span>
                          <div className="flex items-center gap-1 text-xs text-white/60">
                            <Eye className="w-3 h-3" />
                            {concept.views} views
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition">
                      <Play className="w-5 h-5 text-purple-400" />
                    </div>
                  </div>
                  
                  <p className="text-sm text-white/70 mb-4">
                    {concept.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-white/50">
                      {concept.type.toUpperCase()} ANALYSIS
                    </div>
                    <button className="bg-purple-600 hover:bg-purple-500 text-white text-xs px-4 py-2 rounded-lg transition flex items-center gap-2">
                      <Sparkles className="w-3 h-3" />
                      Generate Video
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Video Generation Status */}
            {isGenerating && selectedConcept && (
              <div className="bg-purple-900/20 border border-purple-500/30 rounded-xl p-8">
                <div className="text-center">
                  <div className="mb-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-600/20 rounded-full mb-4">
                      <Sparkles className="w-8 h-8 text-purple-400 animate-spin" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-purple-300 mb-2">Generating Cinematic Video...</h3>
                  <p className="text-lg text-white mb-2">
                    <strong>Concept:</strong> {selectedConcept.title}
                  </p>
                  <p className="text-sm text-white/70 mb-4">{selectedConcept.description}</p>
                  <div className="bg-white/5 rounded-lg p-4">
                    <p className="text-xs text-white/80 mb-2">
                      <strong>Artistic Statement:</strong> Transforming market anomalies into visual narratives that reveal the hidden patterns beneath surface volatility.
                    </p>
                    <p className="text-xs text-white/60">
                      Framework: Dynamic Narrative Video • Style: Cinematic Market Analysis • Duration: 60-90 seconds
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Recent Videos */}
            <div className="mt-12">
              <h3 className="text-xl font-bold mb-6">Recent Videos</h3>
              <div className="grid md:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white/5 border border-white/10 rounded-lg p-4">
                    <div className="aspect-video bg-gradient-to-br from-purple-900/50 to-blue-900/50 rounded-lg mb-3 flex items-center justify-center">
                      <Play className="w-8 h-8 text-white/50" />
                    </div>
                    <div className="text-sm font-medium mb-1">Market Analysis #{147 - i + 1}</div>
                    <div className="text-xs text-white/60">
                      Generated {i} day{i > 1 ? 's' : ''} ago • {Math.floor(Math.random() * 50 + 20)}K views
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'testing' && (
          <div>
            <EdenApiTester />
          </div>
        )}

        {activeTab === 'training' && (
          <div className="space-y-8">
            {/* Risk Controls */}
            <div className="bg-white/5 backdrop-blur rounded-lg p-6">
              <h3 className="text-xl font-bold mb-6">Risk & Strategy Controls</h3>
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm">Risk Tolerance</label>
                    <span className="text-sm text-gray-400">{(config.riskTolerance * 100).toFixed(0)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={config.riskTolerance * 100}
                    onChange={(e) => handleConfigUpdate('riskTolerance', Number(e.target.value) / 100)}
                    className="w-full"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm">Contrarian Intensity</label>
                    <span className="text-sm text-gray-400">{(config.contrarianDial * 100).toFixed(0)}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="100"
                    value={config.contrarianDial * 100}
                    onChange={(e) => handleConfigUpdate('contrarianDial', Number(e.target.value) / 100)}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Sector Weights */}
            <div className="bg-white/5 backdrop-blur rounded-lg p-6">
              <h3 className="text-xl font-bold mb-6">Sector Weights</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {Object.entries(config.sectorWeights).map(([sector, weight]) => (
                  <div key={sector}>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm capitalize">{sector}</label>
                      <span className="text-sm text-gray-400">{(weight * 100).toFixed(0)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="50"
                      value={weight * 100}
                      onChange={(e) => handleSectorWeightUpdate(sector, Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Tone Controls */}
            <div className="bg-white/5 backdrop-blur rounded-lg p-6">
              <h3 className="text-xl font-bold mb-6">Personality Tone</h3>
              <div className="grid md:grid-cols-3 gap-6">
                {Object.entries(config.tone).map(([aspect, value]) => (
                  <div key={aspect}>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm capitalize">{aspect}</label>
                      <span className="text-sm text-gray-400">{(value * 100).toFixed(0)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={value * 100}
                      onChange={(e) => handleToneUpdate(aspect, Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={saveConfig}
              className="px-6 py-3 bg-red-600 rounded-lg hover:bg-red-700 transition font-bold"
            >
              Save Configuration
            </button>
          </div>
        )}

        {activeTab === 'performance' && (
          <div className="space-y-8">
            {/* Performance Table */}
            <div className="bg-white/5 backdrop-blur rounded-lg p-6">
              <h3 className="text-xl font-bold mb-6">Daily Performance</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/20">
                      <th className="text-left py-3 px-4">Date</th>
                      <th className="text-center py-3 px-4">Picks</th>
                      <th className="text-center py-3 px-4">Wins</th>
                      <th className="text-center py-3 px-4">Losses</th>
                      <th className="text-center py-3 px-4">Pending</th>
                      <th className="text-center py-3 px-4">Avg Edge</th>
                      <th className="text-right py-3 px-4">Return</th>
                    </tr>
                  </thead>
                  <tbody>
                    {performanceData.map(day => (
                      <tr key={day.date} className="border-b border-white/10">
                        <td className="py-3 px-4">{day.date}</td>
                        <td className="text-center py-3 px-4">{day.picks}</td>
                        <td className="text-center py-3 px-4 text-green-500">{day.wins}</td>
                        <td className="text-center py-3 px-4 text-red-500">{day.losses}</td>
                        <td className="text-center py-3 px-4 text-yellow-500">{day.pending}</td>
                        <td className="text-center py-3 px-4">{day.avgEdge.toFixed(1)}%</td>
                        <td className="text-right py-3 px-4 font-bold">
                          <span className={day.totalReturn > 0 ? 'text-green-500' : 'text-red-500'}>
                            {day.totalReturn > 0 ? '+' : ''}{day.totalReturn.toFixed(1)}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t border-white/20">
                      <td className="py-3 px-4 font-bold">Total</td>
                      <td className="text-center py-3 px-4 font-bold">{totalPicks}</td>
                      <td className="text-center py-3 px-4 font-bold text-green-500">{totalWins}</td>
                      <td className="text-center py-3 px-4 font-bold text-red-500">{totalLosses}</td>
                      <td className="text-center py-3 px-4 font-bold text-yellow-500">
                        {performanceData.reduce((sum, day) => sum + day.pending, 0)}
                      </td>
                      <td className="text-center py-3 px-4 font-bold">
                        {(performanceData.reduce((sum, day) => sum + day.avgEdge, 0) / performanceData.length).toFixed(1)}%
                      </td>
                      <td className="text-right py-3 px-4 font-bold text-green-500">
                        +{performanceData.reduce((sum, day) => sum + day.totalReturn, 0).toFixed(1)}%
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              
              <div className="mt-6 flex gap-4">
                <button className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Export CSV
                </button>
                <button className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition flex items-center gap-2">
                  <RefreshCw className="w-4 h-4" />
                  Refresh
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'revenue' && (
          <div className="space-y-8">
            {/* Revenue Stats */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white/5 backdrop-blur rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold">Subscriptions</h3>
                  <DollarSign className="w-5 h-5 text-green-500" />
                </div>
                <div className="text-3xl font-bold mb-2">{revenueData.subscriptions}</div>
                <div className="text-sm text-gray-400">Active subscribers</div>
                <div className="text-2xl font-bold text-green-500 mt-4">
                  ${revenueData.monthlyRevenue}/mo
                </div>
              </div>
              
              <div className="bg-white/5 backdrop-blur rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold">Tips</h3>
                  <Target className="w-5 h-5 text-yellow-500" />
                </div>
                <div className="text-3xl font-bold mb-2">${revenueData.tips}</div>
                <div className="text-sm text-gray-400">This month</div>
                <div className="text-sm text-yellow-500 mt-4">
                  23 tippers
                </div>
              </div>
              
              <div className="bg-white/5 backdrop-blur rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold">Referrals</h3>
                  <TrendingUp className="w-5 h-5 text-blue-500" />
                </div>
                <div className="text-3xl font-bold mb-2">{revenueData.referralClicks}</div>
                <div className="text-sm text-gray-400">Clicks this month</div>
                <div className="text-sm text-blue-500 mt-4">
                  {revenueData.conversionRate}% conversion
                </div>
              </div>
            </div>

            {/* Subscriber List */}
            <div className="bg-white/5 backdrop-blur rounded-lg p-6">
              <h3 className="text-xl font-bold mb-6">Recent Subscribers</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-3 border-b border-white/10">
                  <div>
                    <div className="font-bold">@contrarian_trader</div>
                    <div className="text-sm text-gray-400">Subscribed 2 hours ago</div>
                  </div>
                  <span className="text-green-500">$5/mo</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-white/10">
                  <div>
                    <div className="font-bold">@market_maven</div>
                    <div className="text-sm text-gray-400">Subscribed yesterday</div>
                  </div>
                  <span className="text-green-500">$5/mo</span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <div>
                    <div className="font-bold">@alpha_hunter</div>
                    <div className="text-sm text-gray-400">Subscribed 3 days ago</div>
                  </div>
                  <span className="text-green-500">$5/mo</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}