'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  TrendingUp, TrendingDown, RefreshCw, Play, Pause, 
  Target, AlertCircle, CheckCircle, XCircle, DollarSign,
  BarChart3, Activity, Zap, Eye, EyeOff, Lock
} from 'lucide-react';
import { useMarketStream } from '@/hooks/useMarketStream';

interface LivePick {
  id: string;
  timestamp: string;
  market_question: string;
  market_id: string;
  position: 'YES' | 'NO';
  miyomi_price: number;
  consensus_price: number;
  current_price?: number;
  status: 'LIVE' | 'WIN' | 'LOSS' | 'PENDING';
  platform: string;
  category: string;
  reasoning: string;
  pnl?: number;
  roi?: number;
  confidence: number;
  edge: number;
}

interface MarketUpdate {
  market_id: string;
  current_price: number;
  volume: number;
  last_updated: string;
}

interface LiveTradingProps {
  isSubscribed?: boolean;
  onSubscriptionRequired?: () => void;
}

export default function LiveTradingInterface({ 
  isSubscribed = false, 
  onSubscriptionRequired 
}: LiveTradingProps) {
  const [picks, setPicks] = useState<LivePick[]>([]);
  const [stats, setStats] = useState({
    totalReturn: 0,
    winRate: 0,
    activePositions: 0,
    dailyPnL: 0
  });
  const [selectedPick, setSelectedPick] = useState<LivePick | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  // Use the market stream hook
  const { 
    isConnected: isStreaming, 
    updates, 
    error: streamError, 
    lastUpdate,
    connect,
    disconnect,
    triggerManualUpdate
  } = useMarketStream(isSubscribed);

  // Initialize and load picks
  useEffect(() => {
    loadPicks();
  }, []);

  // Apply market updates to picks
  useEffect(() => {
    if (updates.length > 0) {
      setPicks(currentPicks => 
        currentPicks.map(pick => {
          const update = updates.find(u => u.pick_id === pick.id || u.market_id === pick.market_id);
          if (update) {
            return {
              ...pick,
              current_price: update.current_price,
              pnl: update.pnl || pick.pnl || 0,
              roi: update.pnl || pick.roi || 0,
              status: (update.status as any) || pick.status
            };
          }
          return pick;
        })
      );
      
      // Recalculate stats when updates come in
      const updatedPicks = picks.map(pick => {
        const update = updates.find(u => u.pick_id === pick.id || u.market_id === pick.market_id);
        return update ? { ...pick, pnl: update.pnl || pick.pnl || 0 } : pick;
      });
      calculateStats(updatedPicks);
    }
  }, [updates]);

  async function loadPicks() {
    try {
      const response = await fetch('/api/miyomi/real-picks?limit=20&status=LIVE');
      const data = await response.json();
      
      if (data.success) {
        setPicks(data.picks);
        calculateStats(data.picks);
      }
    } catch (error) {
      console.error('Failed to load picks:', error);
    }
  }

  function calculateStats(picksData: LivePick[]) {
    const totalPnL = picksData.reduce((sum, pick) => sum + (pick.pnl || 0), 0);
    const completedPicks = picksData.filter(p => p.status === 'WIN' || p.status === 'LOSS');
    const wins = completedPicks.filter(p => p.status === 'WIN').length;
    const winRate = completedPicks.length > 0 ? (wins / completedPicks.length) * 100 : 0;
    
    setStats({
      totalReturn: totalPnL,
      winRate: winRate,
      activePositions: picksData.filter(p => p.status === 'LIVE').length,
      dailyPnL: totalPnL // Simplified for demo
    });
  }

  function handlePickClick(pick: LivePick) {
    setSelectedPick(pick);
    setShowDetails(true);
  }

  function formatCurrency(amount: number) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  }

  function formatPercentage(value: number) {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  }

  function getPnLColor(pnl: number) {
    if (pnl > 0) return 'text-green-500';
    if (pnl < 0) return 'text-red-500';
    return 'text-gray-400';
  }

  if (!isSubscribed) {
    return (
      <div className="bg-white/5 backdrop-blur rounded-lg p-8 text-center">
        <Lock className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <h3 className="text-xl font-bold mb-2">Live Trading Access Required</h3>
        <p className="text-gray-400 mb-6">
          Subscribe to MIYOMI's premium tier to access real-time market data and live position tracking.
        </p>
        <button
          onClick={onSubscriptionRequired}
          className="px-6 py-3 bg-red-600 rounded-lg hover:bg-red-700 transition font-bold"
        >
          Upgrade to Premium
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Trading Controls */}
      <div className="bg-white/5 backdrop-blur rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <Zap className="w-6 h-6 text-red-500" />
            Live Trading Interface
          </h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <div className={`w-2 h-2 rounded-full ${isStreaming ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`} />
              {isStreaming ? 'Live' : 'Paused'}
            </div>
            <button
              onClick={isStreaming ? disconnect : connect}
              className={`px-4 py-2 rounded-lg transition flex items-center gap-2 ${
                isStreaming 
                  ? 'bg-red-600 hover:bg-red-700' 
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {isStreaming ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {isStreaming ? 'Pause' : 'Start'} Stream
            </button>
            <button
              onClick={loadPicks}
              className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>

        {lastUpdate && (
          <div className="text-sm text-gray-400">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </div>
        )}
        {streamError && (
          <div className="text-sm text-red-400 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            Stream error: {streamError}
          </div>
        )}
      </div>

      {/* Stats Dashboard */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white/5 backdrop-blur rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Daily P&L</span>
            <TrendingUp className={`w-4 h-4 ${stats.dailyPnL >= 0 ? 'text-green-500' : 'text-red-500'}`} />
          </div>
          <div className={`text-3xl font-bold ${getPnLColor(stats.dailyPnL)}`}>
            {formatPercentage(stats.dailyPnL)}
          </div>
        </div>
        
        <div className="bg-white/5 backdrop-blur rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Win Rate</span>
            <Target className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-3xl font-bold">{stats.winRate.toFixed(1)}%</div>
        </div>
        
        <div className="bg-white/5 backdrop-blur rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Active Positions</span>
            <Activity className="w-4 h-4 text-yellow-500" />
          </div>
          <div className="text-3xl font-bold">{stats.activePositions}</div>
        </div>
        
        <div className="bg-white/5 backdrop-blur rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Total Return</span>
            <BarChart3 className="w-4 h-4 text-purple-500" />
          </div>
          <div className={`text-3xl font-bold ${getPnLColor(stats.totalReturn)}`}>
            {formatPercentage(stats.totalReturn)}
          </div>
        </div>
      </div>

      {/* Live Positions */}
      <div className="bg-white/5 backdrop-blur rounded-lg p-6">
        <h3 className="text-xl font-bold mb-6">Live Positions</h3>
        <div className="space-y-3">
          {picks.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No active positions</p>
            </div>
          ) : (
            picks.map(pick => (
              <div
                key={pick.id}
                onClick={() => handlePickClick(pick)}
                className="bg-white/5 rounded-lg p-4 hover:bg-white/10 cursor-pointer transition"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-bold text-lg">{pick.market_question}</h4>
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        pick.position === 'YES' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                      }`}>
                        {pick.position}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <span>{pick.platform}</span>
                      <span>{pick.category}</span>
                      <span>Entry: {(pick.miyomi_price * 100).toFixed(1)}¢</span>
                      <span>Current: {((pick.current_price || pick.consensus_price) * 100).toFixed(1)}¢</span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${getPnLColor(pick.pnl || 0)}`}>
                      {formatPercentage(pick.pnl || 0)}
                    </div>
                    <div className="text-sm text-gray-400">
                      {pick.roi && formatPercentage(pick.roi)}
                    </div>
                  </div>
                  
                  <div className="ml-4">
                    {pick.status === 'WIN' && <CheckCircle className="w-6 h-6 text-green-500" />}
                    {pick.status === 'LOSS' && <XCircle className="w-6 h-6 text-red-500" />}
                    {pick.status === 'LIVE' && <Activity className="w-6 h-6 text-yellow-500 animate-pulse" />}
                    {pick.status === 'PENDING' && <AlertCircle className="w-6 h-6 text-gray-400" />}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Position Details Modal */}
      {showDetails && selectedPick && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Position Details</h3>
              <button
                onClick={() => setShowDetails(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-lg mb-2">{selectedPick.market_question}</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Platform:</span>
                    <span className="ml-2">{selectedPick.platform}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Category:</span>
                    <span className="ml-2">{selectedPick.category}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Position:</span>
                    <span className={`ml-2 font-bold ${
                      selectedPick.position === 'YES' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {selectedPick.position}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400">Entry Time:</span>
                    <span className="ml-2">{new Date(selectedPick.timestamp).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="text-sm text-gray-400 mb-1">Entry Price</div>
                  <div className="text-xl font-bold">{(selectedPick.miyomi_price * 100).toFixed(1)}¢</div>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="text-sm text-gray-400 mb-1">Current Price</div>
                  <div className="text-xl font-bold">
                    {((selectedPick.current_price || selectedPick.consensus_price) * 100).toFixed(1)}¢
                  </div>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="text-sm text-gray-400 mb-1">P&L</div>
                  <div className={`text-xl font-bold ${getPnLColor(selectedPick.pnl || 0)}`}>
                    {formatPercentage(selectedPick.pnl || 0)}
                  </div>
                </div>
              </div>

              <div>
                <h5 className="font-bold mb-2">MIYOMI's Reasoning</h5>
                <div className="bg-white/5 rounded-lg p-4 text-sm">
                  {selectedPick.reasoning}
                </div>
              </div>

              <div className="flex gap-3">
                <button className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition">
                  Close Position
                </button>
                <button className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition">
                  Add to Watchlist
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}