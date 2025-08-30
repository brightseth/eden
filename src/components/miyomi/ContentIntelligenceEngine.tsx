'use client';

import { useState, useEffect } from 'react';
import { 
  Sparkles, TrendingUp, Target, AlertTriangle, 
  Play, Eye, Clock, BarChart3, Zap, Brain,
  ChevronRight, Star, Video, Lightbulb
} from 'lucide-react';

interface MarketSignal {
  id: string;
  market: string;
  platform: 'Kalshi' | 'Polymarket' | 'Manifold';
  signal_type: 'anomaly' | 'trend' | 'contrarian' | 'opportunity';
  urgency: number;
  confidence: number;
  price_change: number;
  volume_spike: number;
  social_sentiment: number;
  video_potential: number;
  estimated_views: string;
  reasoning: string;
  recommended_angle: string;
  narrative_hooks: string[];
}

interface ContentConcept {
  id: string;
  title: string;
  signal: MarketSignal;
  video_style: 'analysis' | 'prediction' | 'contrarian' | 'educational';
  hook: string;
  narrative_arc: string[];
  visual_elements: string[];
  call_to_action: string;
  estimated_engagement: number;
}

const MOCK_SIGNALS: MarketSignal[] = [
  {
    id: 'signal_001',
    market: 'Fed Rate Cut March 2025',
    platform: 'Kalshi',
    signal_type: 'contrarian',
    urgency: 92,
    confidence: 87,
    price_change: -15.3,
    volume_spike: 340,
    social_sentiment: 65,
    video_potential: 94,
    estimated_views: '280K',
    reasoning: 'Massive insider positioning suggests rate cut unlikely despite public sentiment',
    recommended_angle: 'Why everyone is wrong about March rate cuts',
    narrative_hooks: ['Fed officials private signals', 'Volume anomaly analysis', 'Historical precedent breakdown']
  },
  {
    id: 'signal_002', 
    market: 'Tesla Q1 Delivery Numbers',
    platform: 'Polymarket',
    signal_type: 'anomaly',
    urgency: 88,
    confidence: 91,
    price_change: 23.7,
    volume_spike: 520,
    social_sentiment: 78,
    video_potential: 89,
    estimated_views: '195K',
    reasoning: 'Options flow suggests major delivery surprise incoming',
    recommended_angle: 'Tesla delivery shock: What the options are telling us',
    narrative_hooks: ['Unusual options activity', 'Supply chain signals', 'Elon\'s social media patterns']
  },
  {
    id: 'signal_003',
    market: 'Champions League Final Outcome',
    platform: 'Manifold',
    signal_type: 'trend',
    urgency: 75,
    confidence: 82,
    price_change: 12.4,
    volume_spike: 180,
    social_sentiment: 89,
    video_potential: 76,
    estimated_views: '145K',
    reasoning: 'Injury reports and weather patterns creating systematic edge',
    recommended_angle: 'Hidden factors that will decide the Champions League final',
    narrative_hooks: ['Weather impact analysis', 'Key player fitness updates', 'Historical upset patterns']
  }
];

export default function ContentIntelligenceEngine() {
  const [signals, setSignals] = useState<MarketSignal[]>(MOCK_SIGNALS);
  const [selectedSignal, setSelectedSignal] = useState<MarketSignal | null>(null);
  const [generatedConcept, setGeneratedConcept] = useState<ContentConcept | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [sortBy, setSortBy] = useState<'urgency' | 'video_potential' | 'confidence'>('video_potential');

  const generateConcept = async (signal: MarketSignal) => {
    setSelectedSignal(signal);
    setIsAnalyzing(true);

    // Simulate AI analysis
    setTimeout(() => {
      const concept: ContentConcept = {
        id: `concept_${Date.now()}`,
        title: `${signal.recommended_angle}`,
        signal: signal,
        video_style: signal.signal_type === 'contrarian' ? 'contrarian' : 
                   signal.urgency > 85 ? 'prediction' : 'analysis',
        hook: `🚨 ${signal.market}: ${signal.reasoning.slice(0, 60)}...`,
        narrative_arc: [
          `Hook: ${signal.narrative_hooks[0]}`,
          `Context: Market background and current sentiment`,
          `Analysis: ${signal.reasoning}`,
          `Prediction: Why this creates opportunity`,
          `Action: Specific trading recommendation`
        ],
        visual_elements: [
          'Live market data overlay',
          'Historical chart comparisons', 
          'Social sentiment heatmap',
          'Volume spike visualization',
          'Probability distribution curves'
        ],
        call_to_action: `Subscribe for real-time ${signal.platform} signals`,
        estimated_engagement: signal.video_potential * 0.8
      };

      setGeneratedConcept(concept);
      setIsAnalyzing(false);
    }, 2000);
  };

  const generateVideo = async (concept: ContentConcept) => {
    setIsGenerating(true);

    // Simulate video generation
    setTimeout(() => {
      setIsGenerating(false);
      alert(`Video "${concept.title}" generated successfully! Estimated ${concept.signal.estimated_views} views.`);
    }, 3000);
  };

  const getSignalColor = (type: string) => {
    switch (type) {
      case 'anomaly': return 'text-red-400 bg-red-400/20 border-red-400/30';
      case 'trend': return 'text-blue-400 bg-blue-400/20 border-blue-400/30';
      case 'contrarian': return 'text-purple-400 bg-purple-400/20 border-purple-400/30';
      case 'opportunity': return 'text-green-400 bg-green-400/20 border-green-400/30';
      default: return 'text-gray-400 bg-gray-400/20 border-gray-400/30';
    }
  };

  const getSignalIcon = (type: string) => {
    switch (type) {
      case 'anomaly': return <Zap className="w-4 h-4" />;
      case 'trend': return <TrendingUp className="w-4 h-4" />;
      case 'contrarian': return <Target className="w-4 h-4" />;
      case 'opportunity': return <Star className="w-4 h-4" />;
      default: return <Brain className="w-4 h-4" />;
    }
  };

  const sortedSignals = [...signals].sort((a, b) => {
    switch (sortBy) {
      case 'urgency': return b.urgency - a.urgency;
      case 'video_potential': return b.video_potential - a.video_potential;
      case 'confidence': return b.confidence - a.confidence;
      default: return b.video_potential - a.video_potential;
    }
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2">🧠 Content Intelligence Engine</h2>
          <p className="text-white/70">
            AI-powered system that analyzes market signals and recommends the best trades to turn into viral content.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm"
          >
            <option value="video_potential">Video Potential</option>
            <option value="urgency">Urgency</option>
            <option value="confidence">Confidence</option>
          </select>
        </div>
      </div>

      {/* Stats Dashboard */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white/5 backdrop-blur rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <Brain className="w-5 h-5 text-purple-400" />
            <span className="text-sm text-gray-400">Active Signals</span>
          </div>
          <div className="text-3xl font-bold">{signals.length}</div>
          <div className="text-sm text-purple-400 mt-1">Processing markets</div>
        </div>
        <div className="bg-white/5 backdrop-blur rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <Video className="w-5 h-5 text-blue-400" />
            <span className="text-sm text-gray-400">Video Potential</span>
          </div>
          <div className="text-3xl font-bold">
            {Math.round(signals.reduce((sum, s) => sum + s.video_potential, 0) / signals.length)}%
          </div>
          <div className="text-sm text-blue-400 mt-1">Avg engagement</div>
        </div>
        <div className="bg-white/5 backdrop-blur rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <Eye className="w-5 h-5 text-green-400" />
            <span className="text-sm text-gray-400">Est. Views</span>
          </div>
          <div className="text-3xl font-bold">620K</div>
          <div className="text-sm text-green-400 mt-1">Combined reach</div>
        </div>
        <div className="bg-white/5 backdrop-blur rounded-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <AlertTriangle className="w-5 h-5 text-orange-400" />
            <span className="text-sm text-gray-400">High Priority</span>
          </div>
          <div className="text-3xl font-bold">
            {signals.filter(s => s.urgency > 85).length}
          </div>
          <div className="text-sm text-orange-400 mt-1">Time sensitive</div>
        </div>
      </div>

      {/* Market Signals Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {sortedSignals.map((signal) => (
          <div 
            key={signal.id}
            className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all group cursor-pointer"
            onClick={() => generateConcept(signal)}
          >
            {/* Signal Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-bold ${getSignalColor(signal.signal_type)}`}>
                  {getSignalIcon(signal.signal_type)}
                  {signal.signal_type.toUpperCase()}
                </div>
                <span className="text-xs text-white/60">{signal.platform}</span>
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition">
                <ChevronRight className="w-5 h-5 text-purple-400" />
              </div>
            </div>

            {/* Market Info */}
            <h3 className="font-bold text-lg mb-2 group-hover:text-purple-400 transition">
              {signal.market}
            </h3>
            <p className="text-sm text-white/70 mb-4">{signal.reasoning}</p>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/60">Video Potential</span>
                  <span className="text-xs font-bold text-purple-400">{signal.video_potential}%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full" 
                    style={{ width: `${signal.video_potential}%` }}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/60">Urgency</span>
                  <span className="text-xs font-bold text-red-400">{signal.urgency}%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-red-500 to-orange-500 h-2 rounded-full" 
                    style={{ width: `${signal.urgency}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Stats Row */}
            <div className="flex items-center justify-between text-xs text-white/60">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <BarChart3 className="w-3 h-3" />
                  {signal.price_change > 0 ? '+' : ''}{signal.price_change.toFixed(1)}%
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  {signal.estimated_views}
                </div>
              </div>
              <div className="text-xs font-bold text-purple-400">
                {signal.confidence}% confidence
              </div>
            </div>

            {/* Generate Button */}
            <button className="w-full mt-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white text-sm font-bold py-3 rounded-lg transition flex items-center justify-center gap-2">
              <Lightbulb className="w-4 h-4" />
              Generate Content Concept
            </button>
          </div>
        ))}
      </div>

      {/* Analysis Modal */}
      {isAnalyzing && selectedSignal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-white/20 rounded-2xl p-8 max-w-2xl w-full mx-4">
            <div className="text-center">
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-purple-600/20 rounded-full mb-4">
                  <Brain className="w-10 h-10 text-purple-400 animate-pulse" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-purple-300 mb-3">Analyzing Market Signal...</h3>
              <p className="text-lg text-white mb-2">
                <strong>Market:</strong> {selectedSignal.market}
              </p>
              <p className="text-sm text-white/70 mb-6">{selectedSignal.reasoning}</p>
              
              <div className="bg-white/5 rounded-lg p-4 mb-6">
                <h4 className="font-bold mb-3 text-purple-300">Content Analysis Process:</h4>
                <div className="space-y-2 text-sm text-left">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
                    <span>Analyzing narrative hooks and engagement potential</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
                    <span>Calculating optimal video style and timing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
                    <span>Generating visual storytelling framework</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Generated Concept Display */}
      {generatedConcept && !isAnalyzing && (
        <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-500/30 rounded-2xl p-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-purple-300 mb-2">Content Concept Generated!</h3>
              <p className="text-lg text-white">{generatedConcept.title}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-400">{generatedConcept.signal.estimated_views}</div>
              <div className="text-sm text-white/60">Est. Views</div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-bold text-purple-300 mb-3">📖 Narrative Arc:</h4>
              <div className="space-y-2 mb-6">
                {generatedConcept.narrative_arc.map((step, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center text-xs">
                      {i + 1}
                    </div>
                    <span className="text-sm text-white/80">{step}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-bold text-purple-300 mb-3">🎬 Visual Elements:</h4>
              <div className="space-y-2 mb-6">
                {generatedConcept.visual_elements.map((element, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full" />
                    <span className="text-sm text-white/80">{element}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white/5 rounded-lg p-4 mb-6">
            <h4 className="font-bold text-purple-300 mb-2">🎯 Hook & CTA:</h4>
            <p className="text-sm text-white/80 mb-2"><strong>Hook:</strong> {generatedConcept.hook}</p>
            <p className="text-sm text-white/80"><strong>Call to Action:</strong> {generatedConcept.call_to_action}</p>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => generateVideo(generatedConcept)}
              disabled={isGenerating}
              className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 disabled:opacity-50 text-white font-bold py-4 rounded-lg transition flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <Sparkles className="w-5 h-5 animate-spin" />
                  Generating Video...
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  Generate Video
                </>
              )}
            </button>
            <button 
              onClick={() => setGeneratedConcept(null)}
              className="px-6 py-4 bg-white/10 hover:bg-white/20 text-white rounded-lg transition"
            >
              Generate Another
            </button>
          </div>
        </div>
      )}
    </div>
  );
}