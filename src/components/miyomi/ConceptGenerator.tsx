'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Brain, Zap, TrendingUp, Clock, Users, 
  Play, Sparkles, AlertCircle, RefreshCw,
  Eye, Target, Flame, Video, BarChart3
} from 'lucide-react';

interface DynamicVideoConcept {
  id: string;
  title: string;
  hook: string;
  coreConcept: string;
  urgencyScore: number;
  contrarian_angle: string;
  dataPoints: {
    primary: string;
    supporting: string[];
    timestamp: string;
  };
  emotionalFrequency: {
    primary: string;
    secondary: string;
  };
  targetAudience: string;
  estimatedViews: number;
  trendingPotential: string;
  scriptOutline: {
    hook: string;
    development: string;
    revelation: string;
    resonance: string;
  };
  readyToGenerate?: boolean;
  estimatedProductionTime?: string;
  platformOptimization?: {
    tiktok: string;
    youtube: string;
    twitter: string;
  };
  videoGenerated?: boolean;
  videoUrl?: string;
  videoMetadata?: any;
  generationStarted?: boolean;
}

interface ConceptGeneratorProps {
  onConceptSelected?: (concept: DynamicVideoConcept) => void;
}

export default function ConceptGenerator({ onConceptSelected }: ConceptGeneratorProps) {
  const router = useRouter();
  const [concepts, setConcepts] = useState<DynamicVideoConcept[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAutoGenerating, setIsAutoGenerating] = useState(false);
  const [filters, setFilters] = useState({
    count: 5,
    urgencyThreshold: 0,
    targetAudience: '',
    trendingOnly: false
  });
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  useEffect(() => {
    generateConcepts();
  }, []);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        generateConcepts();
      }, 300000); // Refresh every 5 minutes

      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  async function generateConcepts() {
    setIsGenerating(true);
    
    try {
      const params = new URLSearchParams();
      params.set('count', filters.count.toString());
      if (filters.urgencyThreshold > 0) params.set('urgencyThreshold', filters.urgencyThreshold.toString());
      if (filters.targetAudience) params.set('targetAudience', filters.targetAudience);
      if (filters.trendingOnly) params.set('trendingOnly', 'true');

      const response = await fetch(`/api/miyomi/generate-concepts?${params}`);
      const data = await response.json();
      
      if (data.success) {
        console.log('Concepts loaded:', data.concepts.length, 'concepts');
        setConcepts(data.concepts);
        setLastUpdate(new Date());
      } else {
        console.error('API returned error:', data.error);
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Error generating concepts:', error);
      // Don't show alert for now, just log the error
    } finally {
      setIsGenerating(false);
    }
  }

  async function generateVideoFromConcept(concept: DynamicVideoConcept) {
    console.log('[ConceptGenerator] Starting cinematic video generation for concept:', concept.id);
    
    // Navigate to the dedicated video generation page
    router.push(`/video-generation/${concept.id}`);
    
    // Update the concept state to show it's being processed
    if (onConceptSelected) {
      onConceptSelected({
        ...concept,
        videoGenerated: false,
        generationStarted: true
      });
    }
  }

  function getUrgencyColor(score: number): string {
    if (score >= 80) return 'text-red-500';
    if (score >= 60) return 'text-orange-500';
    if (score >= 40) return 'text-yellow-500';
    return 'text-gray-400';
  }

  function getTrendingIcon(potential: string) {
    switch (potential) {
      case 'viral':
        return <Flame className="w-4 h-4 text-red-500" />;
      case 'high':
        return <TrendingUp className="w-4 h-4 text-orange-500" />;
      case 'medium':
        return <BarChart3 className="w-4 h-4 text-yellow-500" />;
      default:
        return <Eye className="w-4 h-4 text-gray-500" />;
    }
  }

  function formatAudience(audience: string): string {
    return audience.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  function formatNumber(num: number): string {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K`;
    return num.toString();
  }

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="bg-white/5 backdrop-blur rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <Sparkles className="w-6 h-6 text-purple-500" />
              <h3 className="text-xl font-bold">🎬 Cinematic Video Concept Generator</h3>
              {lastUpdate && (
                <span className="text-sm text-gray-400">
                  Updated {lastUpdate.toLocaleTimeString()}
                </span>
              )}
            </div>
            <p className="text-sm text-purple-300/80">
              Dynamic Narrative Video Framework • 9-phase cinematic approach • Visual DNA & emotional frequency generation
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="rounded border-white/20"
              />
              Auto-refresh
            </label>
            
            <button
              onClick={generateConcepts}
              disabled={isGenerating}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-600 transition flex items-center gap-2"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  Generate Concepts
                </>
              )}
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="grid md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Count</label>
            <select
              value={filters.count}
              onChange={(e) => setFilters(prev => ({ ...prev, count: parseInt(e.target.value) }))}
              className="w-full p-2 bg-black/50 border border-white/20 rounded text-white"
            >
              <option value={3}>3 concepts</option>
              <option value={5}>5 concepts</option>
              <option value={8}>8 concepts</option>
              <option value={10}>10 concepts</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Min Urgency</label>
            <select
              value={filters.urgencyThreshold}
              onChange={(e) => setFilters(prev => ({ ...prev, urgencyThreshold: parseInt(e.target.value) }))}
              className="w-full p-2 bg-black/50 border border-white/20 rounded text-white"
            >
              <option value={0}>Any urgency</option>
              <option value={40}>Medium+ (40+)</option>
              <option value={60}>High+ (60+)</option>
              <option value={80}>Critical (80+)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Target Audience</label>
            <select
              value={filters.targetAudience}
              onChange={(e) => setFilters(prev => ({ ...prev, targetAudience: e.target.value }))}
              className="w-full p-2 bg-black/50 border border-white/20 rounded text-white"
            >
              <option value="">All audiences</option>
              <option value="retail_traders">Retail Traders</option>
              <option value="crypto_natives">Crypto Natives</option>
              <option value="macro_tourists">Macro Tourists</option>
              <option value="contrarians">Contrarians</option>
              <option value="gen_z_investors">Gen Z Investors</option>
            </select>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm mt-6">
              <input
                type="checkbox"
                checked={filters.trendingOnly}
                onChange={(e) => setFilters(prev => ({ ...prev, trendingOnly: e.target.checked }))}
                className="rounded border-white/20"
              />
              Trending potential only
            </label>
          </div>
        </div>
      </div>

      {/* Generated Concepts */}
      {concepts.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-lg font-bold">Generated Concepts ({concepts.length})</h4>
          
          {concepts.map((concept, index) => (
            <div key={concept.id} className="bg-white/5 backdrop-blur rounded-lg p-6 border border-white/10">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-sm text-purple-400 font-mono">#{index + 1}</span>
                    <div className="flex items-center gap-2">
                      {getTrendingIcon(concept.trendingPotential)}
                      <span className="text-sm capitalize">{concept.trendingPotential}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className={`w-4 h-4 ${getUrgencyColor(concept.urgencyScore)}`} />
                      <span className={`text-sm ${getUrgencyColor(concept.urgencyScore)}`}>
                        {concept.urgencyScore}/100 urgency
                      </span>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-2">{concept.title}</h3>
                  <p className="text-gray-300 mb-3">{concept.hook}</p>
                  
                  <div className="text-sm text-purple-300 mb-3">
                    <strong>Contrarian Angle:</strong> {concept.contrarian_angle}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div className="text-right text-sm text-gray-400">
                    <div>{formatNumber(concept.estimatedViews)} est. views</div>
                    <div>{formatAudience(concept.targetAudience)}</div>
                  </div>
                  
                  {concept.readyToGenerate && (
                    <button
                      onClick={() => generateVideoFromConcept(concept)}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center gap-2 text-sm"
                    >
                      <Sparkles className="w-4 h-4" />
                      🎬 Generate Video
                    </button>
                  )}
                  
                  {concept.generationStarted && (
                    <div className="text-xs text-blue-400 mt-2">
                      🎬 Generation started
                    </div>
                  )}
                  
                  {concept.videoGenerated && concept.videoUrl && (
                    <div className="text-xs text-green-400 mt-2">
                      ✨ Cinematic video ready
                    </div>
                  )}
                </div>
              </div>

              {/* Data Points */}
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="bg-black/30 rounded p-3">
                  <div className="text-sm font-medium text-blue-400 mb-1">Primary Data Point</div>
                  <div className="text-sm">{concept.dataPoints.primary}</div>
                </div>
                
                <div className="bg-black/30 rounded p-3">
                  <div className="text-sm font-medium text-green-400 mb-1">Supporting Data</div>
                  <div className="text-sm space-y-1">
                    {concept.dataPoints.supporting.map((point, i) => (
                      <div key={i}>• {point}</div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Script Outline */}
              <div className="bg-black/20 rounded p-3 mb-4">
                <div className="text-sm font-medium text-yellow-400 mb-2">Script Outline</div>
                <div className="text-sm space-y-2">
                  <div><strong>Hook:</strong> {concept.scriptOutline.hook}</div>
                  <div><strong>Development:</strong> {concept.scriptOutline.development}</div>
                  <div><strong>Revelation:</strong> {concept.scriptOutline.revelation}</div>
                  <div><strong>Resonance:</strong> {concept.scriptOutline.resonance}</div>
                </div>
              </div>

              {/* Platform Optimization */}
              {concept.platformOptimization && (
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-gray-400">Platform optimization:</span>
                  <div className="flex gap-3">
                    <span className={`px-2 py-1 rounded ${
                      concept.platformOptimization.tiktok === 'high' ? 'bg-pink-600/20 text-pink-300' :
                      concept.platformOptimization.tiktok === 'medium' ? 'bg-yellow-600/20 text-yellow-300' : 
                      'bg-gray-600/20 text-gray-400'
                    }`}>
                      TikTok: {concept.platformOptimization.tiktok}
                    </span>
                    <span className={`px-2 py-1 rounded ${
                      concept.platformOptimization.youtube === 'high' ? 'bg-red-600/20 text-red-300' :
                      concept.platformOptimization.youtube === 'medium' ? 'bg-yellow-600/20 text-yellow-300' : 
                      'bg-gray-600/20 text-gray-400'
                    }`}>
                      YouTube: {concept.platformOptimization.youtube}
                    </span>
                    <span className={`px-2 py-1 rounded ${
                      concept.platformOptimization.twitter === 'high' ? 'bg-blue-600/20 text-blue-300' :
                      concept.platformOptimization.twitter === 'medium' ? 'bg-yellow-600/20 text-yellow-300' : 
                      'bg-gray-600/20 text-gray-400'
                    }`}>
                      Twitter: {concept.platformOptimization.twitter}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Loading State */}
      {isGenerating && (
        <div className="text-center py-12 text-gray-400">
          <RefreshCw className="w-16 h-16 mx-auto mb-4 opacity-50 animate-spin" />
          <p>Generating real-time concepts from market data...</p>
        </div>
      )}

      {/* Empty State */}
      {concepts.length === 0 && !isGenerating && (
        <div className="text-center py-12 text-gray-400">
          <Brain className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p>Click "Generate Concepts" to see real-time video ideas based on market data</p>
          <button
            onClick={generateConcepts}
            className="mt-4 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            Generate Concepts Now
          </button>
        </div>
      )}
    </div>
  );
}