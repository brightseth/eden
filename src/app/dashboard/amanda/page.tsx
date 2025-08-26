'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { UnifiedHeader } from '@/components/layout/UnifiedHeader';
import { 
  TrendingUp, Eye, Palette, Target, Star, ArrowUpRight, 
  ExternalLink, Calendar, Users, Award, DollarSign,
  BarChart3, Zap, Heart, MessageCircle, Share2
} from 'lucide-react';

interface Collection {
  id: string;
  title: string;
  artist: string;
  platform: string;
  purchasePrice: number;
  currentValue: number;
  purchaseDate: string;
  imageUrl: string;
  status: 'acquired' | 'watching' | 'sold';
  culturalSignificance: number;
  artistCareerStage: 'emerging' | 'breaking' | 'established';
}

interface ArtistDiscovery {
  name: string;
  platform: string;
  currentFloor: number;
  predictedFloor: number;
  confidence: number;
  reasoning: string;
  timeframe: string;
  works: number;
}

export default function AmandaDashboard() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [discoveries, setDiscoveries] = useState<ArtistDiscovery[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data for Amanda's dashboard
    setCollections([
      {
        id: '1',
        title: 'Synthetic Dreams #42',
        artist: 'Claire Silver',
        platform: 'SuperRare',
        purchasePrice: 3.2,
        currentValue: 8.7,
        purchaseDate: '2024-01-15',
        imageUrl: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=400&h=400&fit=crop&crop=center',
        status: 'acquired',
        culturalSignificance: 95,
        artistCareerStage: 'breaking'
      },
      {
        id: '2', 
        title: 'Digital Decay',
        artist: 'Andreas Gysin',
        platform: 'Foundation',
        purchasePrice: 1.8,
        currentValue: 4.3,
        purchaseDate: '2024-02-03',
        imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=400&fit=crop&crop=center',
        status: 'acquired',
        culturalSignificance: 88,
        artistCareerStage: 'emerging'
      },
      {
        id: '3',
        title: 'Glitch Memory',
        artist: 'Sarah Meyohas',
        platform: 'Zora',
        purchasePrice: 0.5,
        currentValue: 2.1,
        purchaseDate: '2024-03-12',
        imageUrl: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=400&h=400&fit=crop&crop=center',
        status: 'watching',
        culturalSignificance: 92,
        artistCareerStage: 'emerging'
      }
    ]);

    setDiscoveries([
      {
        name: 'Memo Akten',
        platform: 'SuperRare',
        currentFloor: 2.1,
        predictedFloor: 12.0,
        confidence: 87,
        reasoning: 'Critical AI art pioneer, museum acquisitions incoming',
        timeframe: '6-12 months',
        works: 23
      },
      {
        name: 'Helena Sarin',
        platform: 'Foundation',
        currentFloor: 0.8,
        predictedFloor: 5.5,
        confidence: 92,
        reasoning: 'GANs specialist, undervalued technical innovation',
        timeframe: '3-8 months',
        works: 15
      },
      {
        name: 'Sofia Crespo',
        platform: 'SuperRare',
        currentFloor: 1.5,
        predictedFloor: 8.2,
        confidence: 79,
        reasoning: 'Biodiversity + AI intersection gaining institutional interest',
        timeframe: '8-15 months',
        works: 31
      }
    ]);

    setLoading(false);
  }, []);

  const totalPortfolioValue = collections.reduce((sum, item) => sum + item.currentValue, 0);
  const totalInvested = collections.reduce((sum, item) => sum + item.purchasePrice, 0);
  const totalReturn = ((totalPortfolioValue - totalInvested) / totalInvested) * 100;

  return (
    <div className="min-h-screen bg-black text-white">
      <UnifiedHeader />
      
      {/* Dashboard Header */}
      <div className="border-b border-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold mb-2">AMANDA</h1>
              <p className="text-lg">Art Collection Dashboard</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-2xl font-bold">${totalPortfolioValue.toFixed(1)}Ξ</div>
                <div className="text-sm text-gray-400">Portfolio Value</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-400">+{totalReturn.toFixed(0)}%</div>
                <div className="text-sm text-gray-400">Total Return</div>
              </div>
              <Link 
                href="/academy/agent/amanda"
                className="px-4 py-2 border border-white hover:bg-white hover:text-black transition-all text-sm"
              >
                TRAINER RECRUITMENT →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-4 gap-8">
            <div>
              <div className="text-3xl font-bold">{collections.filter(c => c.status === 'acquired').length}</div>
              <div className="text-sm text-gray-400">WORKS COLLECTED</div>
            </div>
            <div>
              <div className="text-3xl font-bold">{discoveries.length}</div>
              <div className="text-sm text-gray-400">ARTISTS DISCOVERED</div>
            </div>
            <div>
              <div className="text-3xl font-bold">{discoveries.filter(d => d.confidence > 85).length}</div>
              <div className="text-sm text-gray-400">HIGH CONVICTION</div>
            </div>
            <div>
              <div className="text-3xl font-bold">3-8mo</div>
              <div className="text-sm text-gray-400">AVG BREAKOUT TIME</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Current Collection */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-6">CURRENT COLLECTION</h2>
            <div className="space-y-4">
              {collections.map((work) => (
                <div key={work.id} className="border border-white p-6 grid grid-cols-4 gap-4 items-center">
                  <div className="aspect-square bg-gray-800 rounded overflow-hidden">
                    <img 
                      src={work.imageUrl} 
                      alt={work.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-bold">{work.title}</div>
                    <div className="text-sm text-gray-400">{work.artist}</div>
                    <div className="text-xs text-gray-500">{work.platform}</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold">{work.currentValue}Ξ</div>
                    <div className="text-sm text-gray-400">from {work.purchasePrice}Ξ</div>
                    <div className={`text-xs ${work.currentValue > work.purchasePrice ? 'text-green-400' : 'text-red-400'}`}>
                      {work.currentValue > work.purchasePrice ? '+' : ''}{(((work.currentValue - work.purchasePrice) / work.purchasePrice) * 100).toFixed(0)}%
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-bold">Cultural Score</div>
                    <div className="text-2xl font-bold">{work.culturalSignificance}</div>
                    <div className={`text-xs px-2 py-1 rounded ${
                      work.artistCareerStage === 'emerging' ? 'bg-blue-500/20 text-blue-400' :
                      work.artistCareerStage === 'breaking' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-green-500/20 text-green-400'
                    }`}>
                      {work.artistCareerStage.toUpperCase()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Discovery Pipeline */}
          <div>
            <h2 className="text-2xl font-bold mb-6">PRE-BREAKOUT PIPELINE</h2>
            <div className="space-y-4">
              {discoveries.map((artist, i) => (
                <div key={i} className="border border-white p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="font-bold">{artist.name}</div>
                      <div className="text-xs text-gray-400">{artist.platform}</div>
                    </div>
                    <div className={`text-xs px-2 py-1 rounded ${
                      artist.confidence >= 90 ? 'bg-green-500/20 text-green-400' :
                      artist.confidence >= 80 ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {artist.confidence}% CONF
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Current Floor:</span>
                      <span>{artist.currentFloor}Ξ</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Predicted:</span>
                      <span className="text-green-400">{artist.predictedFloor}Ξ</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Timeframe:</span>
                      <span>{artist.timeframe}</span>
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-gray-700">
                    <div className="text-xs text-gray-400 mb-1">Thesis:</div>
                    <div className="text-xs">{artist.reasoning}</div>
                  </div>
                  
                  <div className="mt-3 flex gap-2">
                    <button className="flex-1 px-3 py-1 bg-white text-black text-xs font-bold">
                      BUY NOW
                    </button>
                    <button className="px-3 py-1 border border-white text-xs">
                      WATCH
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Market Intelligence */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">MARKET INTELLIGENCE</h2>
          <div className="grid md:grid-cols-3 gap-6">
            
            <div className="border border-white p-6">
              <h3 className="font-bold mb-4">TODAY'S DROPS</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Claire Silver - New Series</span>
                  <span className="text-sm text-yellow-400">WATCH</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Refik Anadol - Archive</span>
                  <span className="text-sm text-red-400">PASS</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Mario Klingemann</span>
                  <span className="text-sm text-green-400">BUY</span>
                </div>
              </div>
            </div>

            <div className="border border-white p-6">
              <h3 className="font-bold mb-4">CULTURAL TRENDS</h3>
              <div className="space-y-2">
                <div className="text-sm">↗️ AI + Photography fusion</div>
                <div className="text-sm">↗️ Generative architecture</div>
                <div className="text-sm">↗️ Post-internet aesthetics</div>
                <div className="text-sm">↘️ Profile picture projects</div>
              </div>
            </div>

            <div className="border border-white p-6">
              <h3 className="font-bold mb-4">ACQUISITION BUDGET</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Monthly Budget:</span>
                  <span className="font-bold">50Ξ</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Spent This Month:</span>
                  <span>32Ξ</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Remaining:</span>
                  <span className="text-green-400 font-bold">18Ξ</span>
                </div>
                <div className="w-full bg-gray-800 h-2 rounded">
                  <div className="bg-white h-2 rounded w-16/25"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">RECENT ACTIVITY</h2>
          <div className="border border-white">
            <div className="p-4 border-b border-gray-700">
              <div className="flex justify-between items-center">
                <span>Acquired "Digital Decay" by Andreas Gysin</span>
                <span className="text-sm text-gray-400">2 hours ago</span>
              </div>
            </div>
            <div className="p-4 border-b border-gray-700">
              <div className="flex justify-between items-center">
                <span>Added Helena Sarin to discovery pipeline</span>
                <span className="text-sm text-gray-400">6 hours ago</span>
              </div>
            </div>
            <div className="p-4 border-b border-gray-700">
              <div className="flex justify-between items-center">
                <span>Published analysis: "The Rise of AI Photography"</span>
                <span className="text-sm text-gray-400">1 day ago</span>
              </div>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-center">
                <span>Collection featured in SuperRare editorial</span>
                <span className="text-sm text-gray-400">2 days ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}