'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowLeft, Sparkles, Play, TrendingUp, Eye } from 'lucide-react';

interface ConceptOption {
  id: string;
  title: string;
  description: string;
  urgency: number;
  views: string;
  type: 'anomaly' | 'trend' | 'contrarian';
}

const CONCEPT_OPTIONS: ConceptOption[] = [
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
  const [selectedConcept, setSelectedConcept] = useState<ConceptOption | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateVideo = (concept: ConceptOption) => {
    setSelectedConcept(concept);
    setIsGenerating(true);
    
    // Navigate to video generation with the concept
    window.location.href = `/video-generation/${concept.id}`;
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

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-white/20">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex items-center gap-4 mb-6">
            <Link 
              href="/academy" 
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold">MIYOMI Video Dashboard</h1>
              <p className="text-sm text-white/60 mt-1">Generate cinematic market analysis videos</p>
            </div>
          </div>
          
          {/* Miyomi Stats */}
          <div className="grid md:grid-cols-4 gap-4">
            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-400">92%</div>
              <div className="text-xs text-white/60">Success Rate</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-400">1.2M</div>
              <div className="text-xs text-white/60">Total Views</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
              <div className="text-2xl font-bold text-purple-400">147</div>
              <div className="text-xs text-white/60">Videos Created</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
              <div className="text-2xl font-bold text-orange-400">Live</div>
              <div className="text-xs text-white/60">Market Status</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
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
    </div>
  );
}