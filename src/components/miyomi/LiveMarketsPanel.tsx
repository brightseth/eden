'use client';

import { useState, useEffect } from 'react';
import { 
  TrendingUp, TrendingDown, RefreshCw, Zap, AlertTriangle, 
  Target, BarChart3, Activity, Eye, Globe, Clock
} from 'lucide-react';

interface MarketData {
  id: string;
  question: string;
  platform: string;
  yes_price: number;
  no_price: number;
  volume: number;
  liquidity: number;
  end_date: string;
  category: string;
  status: string;
  url?: string;
  tradersCount?: number;
  lastUpdate?: string;
}

interface MarketResponse {
  success: boolean;
  markets: MarketData[];
  totalMarkets: number;
  isLiveData: boolean;
  platforms: string[];
  timestamp: string;
  categories: string[];
}

export default function LiveMarketsPanel() {
  const [markets, setMarkets] = useState<MarketData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLiveData, setIsLiveData] = useState(false);
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [lastUpdate, setLastUpdate] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    loadMarkets();
    const interval = setInterval(loadMarkets, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [selectedCategory]);

  const loadMarkets = async () => {
    try {
      const params = new URLSearchParams();
      params.append('limit', '8');
      if (selectedCategory !== 'ALL') {
        params.append('category', selectedCategory);
      }

      const response = await fetch(`/api/miyomi/markets?${params.toString()}`);
      const data: MarketResponse = await response.json();
      
      if (data.success) {
        setMarkets(data.markets);
        setIsLiveData(data.isLiveData);
        setPlatforms(data.platforms);
        setLastUpdate(data.timestamp);
        setCategories(['ALL', ...data.categories]);
      }
    } catch (error) {
      console.error('Failed to load markets:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'kalshi': return 'text-blue-400 border-blue-500/20';
      case 'polymarket': return 'text-purple-400 border-purple-500/20';
      case 'manifold': return 'text-green-400 border-green-500/20';
      case 'melee': return 'text-yellow-400 border-yellow-500/20';
      case 'myriad': return 'text-red-400 border-red-500/20';
      default: return 'text-gray-400 border-gray-500/20';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'politics': return 'bg-red-900/20 text-red-400 border-red-500/30';
      case 'sports': return 'bg-green-900/20 text-green-400 border-green-500/30';
      case 'finance': return 'bg-blue-900/20 text-blue-400 border-blue-500/30';
      case 'ai': return 'bg-purple-900/20 text-purple-400 border-purple-500/30';
      case 'pop': return 'bg-pink-900/20 text-pink-400 border-pink-500/30';
      case 'geo': return 'bg-yellow-900/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-gray-900/20 text-gray-400 border-gray-500/30';
    }
  };

  const getContrarian = (yesPrice: number) => {
    // Calculate contrarian opportunity - higher when price is extreme
    if (yesPrice > 0.8) return { score: 85, signal: 'STRONG NO', color: 'text-red-400' };
    if (yesPrice < 0.2) return { score: 85, signal: 'STRONG YES', color: 'text-green-400' };
    if (yesPrice > 0.7) return { score: 65, signal: 'NO EDGE', color: 'text-orange-400' };
    if (yesPrice < 0.3) return { score: 65, signal: 'YES EDGE', color: 'text-blue-400' };
    return { score: 25, signal: 'NEUTRAL', color: 'text-gray-400' };
  };

  return (
    <div className="bg-white/5 backdrop-blur rounded-lg p-6 border border-white/10">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h3 className="text-xl font-bold">LIVE MARKET SIGNALS</h3>
          <div className="flex items-center gap-2">
            {isLiveData ? (
              <>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-400 font-bold">LIVE DATA</span>
              </>
            ) : (
              <>
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <span className="text-xs text-yellow-400">SIMULATED</span>
              </>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-black border border-white/20 rounded px-3 py-1 text-sm text-white"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          
          <button
            onClick={loadMarkets}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-1 border border-white/20 rounded hover:bg-white/5 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span className="text-xs">REFRESH</span>
          </button>
        </div>
      </div>

      {/* Platform Status */}
      <div className="flex flex-wrap gap-2 mb-6">
        {platforms.map(platform => (
          <span 
            key={platform}
            className={`px-2 py-1 text-xs border rounded ${getPlatformColor(platform)}`}
          >
            {platform}
          </span>
        ))}
        {lastUpdate && (
          <div className="flex items-center gap-1 text-xs text-gray-500 ml-auto">
            <Clock className="w-3 h-3" />
            {new Date(lastUpdate).toLocaleTimeString()}
          </div>
        )}
      </div>

      {loading ? (
        <div className="text-center py-12">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
          <div className="text-sm text-gray-400">Loading live market data...</div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {markets.map((market, index) => {
            const contrarian = getContrarian(market.yes_price);
            const edge = Math.abs(0.5 - market.yes_price) * 100;
            
            return (
              <div key={market.id} className="border border-white/10 rounded-lg p-4 hover:bg-white/5 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 text-xs border rounded ${getPlatformColor(market.platform)}`}>
                      {market.platform}
                    </span>
                    <span className={`px-2 py-1 text-xs border rounded ${getCategoryColor(market.category)}`}>
                      {market.category}
                    </span>
                  </div>
                  <div className={`text-xs font-bold ${contrarian.color}`}>
                    {contrarian.score}% CONTRARIAN
                  </div>
                </div>
                
                <h4 className="font-bold text-sm mb-3 line-clamp-2">
                  {market.question}
                </h4>
                
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="text-center">
                    <div className="text-xs text-gray-400">YES PRICE</div>
                    <div className="text-lg font-bold text-green-400">
                      {(market.yes_price * 100).toFixed(0)}¢
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-gray-400">NO PRICE</div>
                    <div className="text-lg font-bold text-red-400">
                      {(market.no_price * 100).toFixed(0)}¢
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-3 h-3" />
                    <span className="text-gray-400">
                      ${(market.volume || 0).toLocaleString()} vol
                    </span>
                  </div>
                  <div className={`font-bold ${contrarian.color}`}>
                    {contrarian.signal}
                  </div>
                </div>
                
                <div className="mt-2 pt-2 border-t border-white/10">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">
                      Edge: {edge.toFixed(1)}%
                    </span>
                    {market.tradersCount && (
                      <span className="text-gray-500">
                        {market.tradersCount} traders
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {markets.length === 0 && !loading && (
        <div className="text-center py-12">
          <AlertTriangle className="w-6 h-6 mx-auto mb-2 text-yellow-400" />
          <div className="text-sm text-gray-400">No markets available</div>
          <div className="text-xs text-gray-500 mt-1">Check your API connections</div>
        </div>
      )}
    </div>
  );
}