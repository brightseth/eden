'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { UnifiedHeader } from '@/components/layout/UnifiedHeader';
import { 
  TrendingUp, TrendingDown, Eye, Users, Coins, Clock, ExternalLink, 
  Calendar, Award, DollarSign, BarChart3, Zap, Target, Brain, 
  AlertTriangle, CheckCircle, Globe, Lock
} from 'lucide-react';

interface PredictionMarket {
  id: string;
  title: string;
  platform: string;
  prediction: string;
  confidence: number;
  position: 'Long' | 'Short' | 'Neutral';
  entry: number;
  current: number;
  pnl: number;
  volume: number;
  timeframe: string;
  reasoning: string;
  status: 'open' | 'closed' | 'pending';
  contrarian: boolean;
}

interface VideoContent {
  id: string;
  title: string;
  views: number;
  published: string;
  topic: string;
  accuracy: number;
  thumbnail: string;
}

export default function MiyomiDashboard() {
  const [markets, setMarkets] = useState<PredictionMarket[]>([]);
  const [videos, setVideos] = useState<VideoContent[]>([]);
  const [privateMode, setPrivateMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data for Miyomi's dashboard
    setMarkets([
      {
        id: '1',
        title: 'AI Art Market Peak 2025',
        platform: 'Kalshi',
        prediction: 'AI art market will correct 40% by Q3 2025',
        confidence: 89,
        position: 'Short',
        entry: 0.73,
        current: 0.45,
        pnl: +2800,
        volume: 125000,
        timeframe: '6 months',
        reasoning: 'Overvaluation signals: celebrity NFT launches, institutional FOMO, retail euphoria',
        status: 'open',
        contrarian: true
      },
      {
        id: '2',
        title: 'NYC Gallery District Expansion',
        platform: 'Polymarket',
        prediction: 'Major gallery will open in Queens by 2025',
        confidence: 76,
        position: 'Long',
        entry: 0.28,
        current: 0.62,
        pnl: +4200,
        volume: 89000,
        timeframe: '12 months',
        reasoning: 'Rent pressure in Chelsea, emerging artist concentration in LIC, institutional signals',
        status: 'open',
        contrarian: true
      },
      {
        id: '3',
        title: 'Crypto Art Platform Consolidation',
        platform: 'Manifold',
        prediction: '2 of top 5 platforms will merge/acquire by 2025',
        confidence: 82,
        position: 'Long',
        entry: 0.35,
        current: 0.71,
        pnl: +1600,
        volume: 67000,
        timeframe: '9 months',
        reasoning: 'Market saturation, user acquisition costs rising, platform differentiation declining',
        status: 'closed',
        contrarian: false
      }
    ]);

    setVideos([
      {
        id: '1',
        title: 'Why Everyone\'s Wrong About AI Art Bubble',
        views: 45000,
        published: '2 days ago',
        topic: 'Market Analysis',
        accuracy: 91,
        thumbnail: 'https://picsum.photos/400/225?random=10'
      },
      {
        id: '2',
        title: 'NYC Gallery Migration: The Queens Theory',
        views: 28000,
        published: '1 week ago',
        topic: 'Cultural Prediction',
        accuracy: 87,
        thumbnail: 'https://picsum.photos/400/225?random=11'
      },
      {
        id: '3',
        title: 'Platform Wars: Who Survives the Consolidation',
        views: 67000,
        published: '2 weeks ago',
        topic: 'Market Structure',
        accuracy: 94,
        thumbnail: 'https://picsum.photos/400/225?random=12'
      }
    ]);

    setLoading(false);
  }, []);

  const totalPnL = markets.reduce((sum, market) => sum + market.pnl, 0);
  const winRate = markets.filter(m => m.pnl > 0).length / markets.length * 100;
  const avgConfidence = markets.reduce((sum, m) => sum + m.confidence, 0) / markets.length;
  const contrarian = markets.filter(m => m.contrarian).length;

  return (
    <div className="min-h-screen bg-black text-white">
      <UnifiedHeader />
      
      {/* Dashboard Header */}
      <div className="border-b border-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold mb-2">MIYOMI</h1>
              <p className="text-lg">Contrarian Market Intelligence Dashboard</p>
              <p className="text-sm text-gray-400 mt-1">NYC • Prediction Markets • Cultural Analysis</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className={`text-2xl font-bold ${totalPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {totalPnL >= 0 ? '+' : ''}${totalPnL.toLocaleString()}
                </div>
                <div className="text-sm text-gray-400">Total P&L</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-400">{winRate.toFixed(0)}%</div>
                <div className="text-sm text-gray-400">Win Rate</div>
              </div>
              <button
                onClick={() => setPrivateMode(!privateMode)}
                className={`flex items-center gap-2 px-4 py-2 border transition-all ${
                  privateMode 
                    ? 'border-red-400 bg-red-400/10 text-red-400' 
                    : 'border-white hover:bg-white hover:text-black'
                }`}
              >
                {privateMode ? <Lock className="w-4 h-4" /> : <Globe className="w-4 h-4" />}
                {privateMode ? 'PRIVATE' : 'PUBLIC'}
              </button>
              <Link 
                href="/academy/agent/miyomi"
                className="px-4 py-2 border border-white hover:bg-white hover:text-black transition-all text-sm"
              >
                TRAINER RECRUITMENT →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h3 className="text-lg font-bold mb-6">CONTRARIAN PERFORMANCE</h3>
          <div className="grid grid-cols-6 gap-6">
            <div>
              <div className="text-3xl font-bold">{markets.length}</div>
              <div className="text-sm text-gray-400">ACTIVE POSITIONS</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-yellow-400">{contrarian}</div>
              <div className="text-sm text-gray-400">CONTRARIAN BETS</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-400">{avgConfidence.toFixed(0)}%</div>
              <div className="text-sm text-gray-400">AVG CONFIDENCE</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-400">
                {videos.reduce((sum, v) => sum + v.views, 0) / 1000}K
              </div>
              <div className="text-sm text-gray-400">MONTHLY VIEWS</div>
            </div>
            <div>
              <div className="text-3xl font-bold">
                {(videos.reduce((sum, v) => sum + v.accuracy, 0) / videos.length).toFixed(0)}%
              </div>
              <div className="text-sm text-gray-400">PREDICTION ACCURACY</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-400">$8.8K</div>
              <div className="text-sm text-gray-400">MONTHLY REVENUE</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Active Predictions */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-6">ACTIVE PREDICTION MARKETS</h2>
            <div className="space-y-4">
              {markets.map((market) => (
                <div key={market.id} className="border border-white p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="font-bold">{market.title}</div>
                        {market.contrarian && (
                          <span className="bg-yellow-500/20 text-yellow-400 px-2 py-1 text-xs rounded">
                            CONTRARIAN
                          </span>
                        )}
                        <span className={`px-2 py-1 text-xs rounded ${
                          market.status === 'open' ? 'bg-green-500/20 text-green-400' :
                          market.status === 'closed' ? 'bg-gray-500/20 text-gray-400' :
                          'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {market.status.toUpperCase()}
                        </span>
                      </div>
                      <div className="text-sm text-gray-400 mb-2">{market.platform} • {market.timeframe}</div>
                      <div className="text-sm mb-3">{market.prediction}</div>
                      {privateMode && (
                        <div className="text-xs text-gray-300 p-3 bg-gray-900/50 border border-gray-700 rounded">
                          <strong>Private Analysis:</strong> {market.reasoning}
                        </div>
                      )}
                    </div>
                    <div className="text-right ml-6">
                      <div className="text-lg font-bold">{market.confidence}%</div>
                      <div className="text-xs text-gray-400">CONFIDENCE</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-4 pt-4 border-t border-gray-700">
                    <div>
                      <div className="text-sm text-gray-400">Position</div>
                      <div className={`font-bold ${
                        market.position === 'Long' ? 'text-green-400' :
                        market.position === 'Short' ? 'text-red-400' :
                        'text-gray-400'
                      }`}>
                        {market.position}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Entry → Current</div>
                      <div className="font-bold">{market.entry} → {market.current}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">P&L</div>
                      <div className={`font-bold ${market.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {market.pnl >= 0 ? '+' : ''}${market.pnl.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Volume</div>
                      <div className="font-bold">${(market.volume / 1000).toFixed(0)}K</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Video Content */}
          <div>
            <h2 className="text-2xl font-bold mb-6">RECENT CONTENT</h2>
            <div className="space-y-4">
              {videos.map((video) => (
                <div key={video.id} className="border border-white p-4">
                  <div className="aspect-video bg-gray-800 rounded mb-3 overflow-hidden">
                    <img 
                      src={video.thumbnail} 
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="font-bold text-sm mb-2 line-clamp-2">{video.title}</div>
                  <div className="flex justify-between text-xs text-gray-400 mb-2">
                    <span>{video.topic}</span>
                    <span>{video.published}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs">{(video.views / 1000).toFixed(0)}K views</span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      video.accuracy >= 90 ? 'bg-green-500/20 text-green-400' :
                      video.accuracy >= 80 ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {video.accuracy}% accurate
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Market Intelligence */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">CONTRARIAN SIGNALS</h2>
          <div className="grid md:grid-cols-3 gap-6">
            
            <div className="border border-white p-6">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <TrendingDown className="w-5 h-5 text-red-400" />
                OVERHEATED SECTORS
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Celebrity NFT Drops</span>
                  <span className="text-red-400">FADE</span>
                </div>
                <div className="flex justify-between">
                  <span>AI Art Platforms</span>
                  <span className="text-red-400">BUBBLE</span>
                </div>
                <div className="flex justify-between">
                  <span>Metaverse Gallery Hype</span>
                  <span className="text-red-400">PEAK</span>
                </div>
              </div>
            </div>

            <div className="border border-white p-6">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-400" />
                EMERGING OPPORTUNITIES
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Brooklyn Art Scene</span>
                  <span className="text-green-400">BUY</span>
                </div>
                <div className="flex justify-between">
                  <span>Physical AI Art</span>
                  <span className="text-green-400">EARLY</span>
                </div>
                <div className="flex justify-between">
                  <span>Prediction Art Markets</span>
                  <span className="text-green-400">ALPHA</span>
                </div>
              </div>
            </div>

            <div className="border border-white p-6">
              <h3 className="font-bold mb-4">UPCOMING CATALYSTS</h3>
              <div className="space-y-2 text-sm">
                <div>• Venice Biennale 2025 AI pavilion</div>
                <div>• Major gallery lease renewals Q2</div>
                <div>• Regulatory clarity on prediction markets</div>
                <div>• NYC studio rent correction expected</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}