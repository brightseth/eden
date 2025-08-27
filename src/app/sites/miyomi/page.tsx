'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  TrendingUp, TrendingDown, DollarSign, Activity, 
  Clock, Target, BarChart3, Zap, AlertCircle,
  Twitter, Youtube, Radio, ArrowUpRight, Play,
  Calendar, CheckCircle, XCircle, Minus,
  Settings, Download, RefreshCw, Lock, Unlock,
  Eye, EyeOff, Sliders
} from 'lucide-react';

// Types
interface MarketPick {
  id: string;
  timestamp: string;
  market: string;
  platform: string;
  position: 'YES' | 'NO';
  confidence: number;
  edge: number;
  entryOdds: number;
  currentOdds?: number;
  status: 'PENDING' | 'WIN' | 'LOSS' | 'LIVE';
  category: string;
  videoUrl?: string;
}

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

export default function MiyomiSite() {
  // Mode toggle
  const [isPrivateMode, setIsPrivateMode] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'training' | 'performance' | 'revenue'>('overview');
  
  // Feedback state (no popups!)
  const [statusMessage, setStatusMessage] = useState<{type: 'success' | 'error' | 'info' | null, message: string}>({type: null, message: ''});
  const [isProcessing, setIsProcessing] = useState(false);
  const [thinkingProcess, setThinkingProcess] = useState<any[]>([]);
  const [showThinking, setShowThinking] = useState(false);
  
  // Public mode state
  const [currentTime, setCurrentTime] = useState(new Date());
  const [nextDrop, setNextDrop] = useState<Date | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [liveMetrics, setLiveMetrics] = useState({
    winRate: 73,
    activePositions: 8,
    dailyEdge: 14.3,
    weeklyReturn: 187,
    followersGrowth: 12
  });
  
  // Shared data
  const [recentPicks, setRecentPicks] = useState<MarketPick[]>([]);
  const [performanceData] = useState<PerformanceData[]>([
    { date: '2025-08-20', picks: 3, wins: 2, losses: 0, pending: 1, avgEdge: 18.5, totalReturn: 24.3 },
    { date: '2025-08-21', picks: 3, wins: 1, losses: 1, pending: 1, avgEdge: 15.2, totalReturn: 8.7 },
    { date: '2025-08-22', picks: 3, wins: 3, losses: 0, pending: 0, avgEdge: 22.1, totalReturn: 42.5 },
    { date: '2025-08-23', picks: 3, wins: 2, losses: 1, pending: 0, avgEdge: 16.8, totalReturn: 18.2 },
    { date: '2025-08-24', picks: 3, wins: 1, losses: 0, pending: 2, avgEdge: 19.3, totalReturn: 12.1 },
    { date: '2025-08-25', picks: 3, wins: 2, losses: 0, pending: 1, avgEdge: 20.7, totalReturn: 28.9 },
    { date: '2025-08-26', picks: 3, wins: 1, losses: 1, pending: 1, avgEdge: 17.4, totalReturn: 15.3 }
  ]);
  
  // Private mode state
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
  
  const [revenueData] = useState({
    subscriptions: 142,
    monthlyRevenue: 710,
    tips: 89,
    referralClicks: 1842,
    conversionRate: 7.7
  });

  // 3x daily drop schedule
  const dropTimes = ['11:00', '15:00', '21:00'];
  
  useEffect(() => {
    // Update current time
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      calculateNextDrop();
    }, 1000);

    // Load recent picks
    loadRecentPicks();

    // Animate metrics
    const metricsInterval = setInterval(() => {
      setLiveMetrics(prev => ({
        ...prev,
        dailyEdge: Math.max(10, Math.min(20, prev.dailyEdge + (Math.random() * 2 - 1))),
        followersGrowth: Math.max(8, Math.min(15, prev.followersGrowth + Math.floor(Math.random() * 3 - 1)))
      }));
    }, 3000);

    return () => {
      clearInterval(timer);
      clearInterval(metricsInterval);
    };
  }, []);

  function calculateNextDrop() {
    const now = new Date();
    const etNow = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));
    
    for (const time of dropTimes) {
      const [hours, minutes] = time.split(':').map(Number);
      const dropTime = new Date(etNow);
      dropTime.setHours(hours, minutes, 0, 0);
      
      if (dropTime > etNow) {
        setNextDrop(dropTime);
        return;
      }
    }
    
    // Tomorrow's first drop
    const tomorrow = new Date(etNow);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(11, 0, 0, 0);
    setNextDrop(tomorrow);
  }

  function loadRecentPicks() {
    setRecentPicks([
      {
        id: '1',
        timestamp: new Date().toISOString(),
        market: 'Will Fed cut rates in March?',
        platform: 'Kalshi',
        position: 'NO',
        confidence: 0.73,
        edge: 0.18,
        entryOdds: 0.65,
        currentOdds: 0.58,
        status: 'LIVE',
        category: 'finance',
        videoUrl: '#'
      },
      {
        id: '2',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        market: 'Chiefs to cover -7.5 vs Bengals',
        platform: 'Polymarket',
        position: 'NO',
        confidence: 0.68,
        edge: 0.15,
        entryOdds: 0.42,
        currentOdds: 0.38,
        status: 'WIN',
        category: 'sports'
      },
      {
        id: '3',
        timestamp: new Date(Date.now() - 172800000).toISOString(),
        market: 'Taylor Swift album announcement by Feb',
        platform: 'Manifold',
        position: 'NO',
        confidence: 0.81,
        edge: 0.22,
        entryOdds: 0.78,
        status: 'PENDING',
        category: 'pop'
      }
    ]);
  }

  function getTimeUntilNextDrop(): string {
    if (!nextDrop) return 'Calculating...';
    
    const diff = nextDrop.getTime() - currentTime.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  function getCategoryEmoji(category: string): string {
    const emojis: Record<string, string> = {
      politics: '🏛️',
      sports: '🏆',
      finance: '📈',
      ai: '🤖',
      pop: '✨',
      geo: '🌍',
      internet: '💻'
    };
    return emojis[category] || '🎯';
  }

  function getStatusIcon(status: string) {
    switch (status) {
      case 'WIN': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'LOSS': return <XCircle className="w-5 h-5 text-red-500" />;
      case 'LIVE': return <Activity className="w-5 h-5 text-yellow-500 animate-pulse" />;
      default: return <Minus className="w-5 h-5 text-gray-500" />;
    }
  }

  // Private mode functions
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
    console.log('Saving config:', config);
    alert('Configuration saved successfully!');
  }

  // Button handler functions
  async function handleTriggerManualDrop() {
    if (isProcessing) return;
    setIsProcessing(true);
    setShowThinking(true);
    setThinkingProcess([]);
    
    try {
      // Use the thinking endpoint for real-time display
      const response = await fetch('/api/miyomi/thinking-drop', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) throw new Error('Failed to start thinking process');

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') continue;
              
              try {
                const parsed = JSON.parse(data);
                setThinkingProcess(prev => [...prev, parsed]);
              } catch (e) {
                console.error('Failed to parse:', data);
              }
            }
          }
        }
      }

      setStatusMessage({
        type: 'success',
        message: '✅ Drop generated successfully!'
      });
      setTimeout(() => setStatusMessage({type: null, message: ''}), 5000);
      
    } catch (error) {
      console.error('Error in thinking process:', error);
      setStatusMessage({
        type: 'error',
        message: '❌ Failed to generate drop'
      });
      setTimeout(() => setStatusMessage({type: null, message: ''}), 5000);
    } finally {
      setIsProcessing(false);
    }
  }

  // Original simple handler for backwards compatibility
  async function handleSimpleManualDrop() {
    if (isProcessing) return;
    setIsProcessing(true);
    
    try {
      setStatusMessage({
        type: 'info',
        message: '🎲 Generating contrarian pick...'
      });
      
      // Call the manual drop API
      const response = await fetch('/api/miyomi/manual-drop', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          agent_id: 'miyomi',
          trigger_time: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error('Failed to trigger manual drop');
      }

      const result = await response.json();
      setStatusMessage({
        type: 'success',
        message: `✅ Manual drop triggered! Pick generated: ${result.pickId}`
      });
      
      // Refresh the picks data
      loadRecentPicks();
      
      // Clear message after 5 seconds
      setTimeout(() => setStatusMessage({type: null, message: ''}), 5000);
      
    } catch (error) {
      console.error('Error triggering manual drop:', error);
      setStatusMessage({
        type: 'error',
        message: '❌ Failed to trigger manual drop. Please try again.'
      });
      setTimeout(() => setStatusMessage({type: null, message: ''}), 5000);
    } finally {
      setIsProcessing(false);
    }
  }

  async function handleReviewPendingPicks() {
    try {
      console.log('Opening pending picks review...');
      
      // Fetch pending picks for review
      const response = await fetch('/api/miyomi/pending-picks');
      
      if (!response.ok) {
        throw new Error('Failed to fetch pending picks');
      }

      const pendingPicks = await response.json();
      
      if (pendingPicks.length === 0) {
        setStatusMessage({
          type: 'info',
          message: '📊 No pending picks to review'
        });
        setTimeout(() => setStatusMessage({type: null, message: ''}), 3000);
        return;
      }

      // Show pending picks inline
      setStatusMessage({
        type: 'success',
        message: `📊 Found ${pendingPicks.length} pending picks for review`
      });
      setTimeout(() => setStatusMessage({type: null, message: ''}), 5000);
      
      // TODO: Open review modal or navigate to /dashboard/miyomi/review
      
    } catch (error) {
      console.error('Error fetching pending picks:', error);
      setStatusMessage({
        type: 'error',
        message: '❌ Failed to fetch pending picks'
      });
      setTimeout(() => setStatusMessage({type: null, message: ''}), 5000);
    }
  }

  async function handleUpdateResults() {
    try {
      console.log('Updating market results...');
      
      // Call the results update API
      const response = await fetch('/api/miyomi/update-results', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to update results');
      }

      const result = await response.json();
      setStatusMessage({
        type: 'success',
        message: `✅ Updated ${result.updatedCount} market results`
      });
      setTimeout(() => setStatusMessage({type: null, message: ''}), 5000);
      
      // Refresh the picks data to show updated results
      loadRecentPicks();
      
    } catch (error) {
      console.error('Error updating results:', error);
      setStatusMessage({
        type: 'error',
        message: '❌ Failed to update results'
      });
      setTimeout(() => setStatusMessage({type: null, message: ''}), 5000);
    }
  }

  const categories = ['all', 'politics', 'sports', 'finance', 'ai', 'pop', 'geo', 'internet'];
  const filteredPicks = selectedCategory === 'all' 
    ? recentPicks 
    : recentPicks.filter(pick => pick.category === selectedCategory);

  const totalPicks = performanceData.reduce((sum, day) => sum + day.picks, 0);
  const totalWins = performanceData.reduce((sum, day) => sum + day.wins, 0);
  const totalLosses = performanceData.reduce((sum, day) => sum + day.losses, 0);
  const winRate = totalPicks > 0 ? (totalWins / (totalWins + totalLosses) * 100).toFixed(1) : '0';
  const avgReturn = performanceData.reduce((sum, day) => sum + day.totalReturn, 0) / performanceData.length;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Status Message Bar */}
      {statusMessage.type && (
        <div className={`
          fixed top-0 left-0 right-0 z-50 px-6 py-3 text-center font-bold
          ${statusMessage.type === 'success' ? 'bg-green-600' : ''}
          ${statusMessage.type === 'error' ? 'bg-red-600' : ''}
          ${statusMessage.type === 'info' ? 'bg-blue-600' : ''}
        `}>
          {statusMessage.message}
        </div>
      )}
      
      {/* Header */}
      <header className={`border-b border-white/20 ${statusMessage.type ? 'mt-12' : ''}`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/academy/agent/miyomi" className="text-2xl font-bold">
              MIYOMI
            </Link>
            {isPrivateMode && (
              <span className="text-sm text-gray-400">Trainer Dashboard</span>
            )}
          </div>
          <nav className="flex items-center gap-6">
            <Link href="/academy" className="hover:text-red-500 transition">Academy</Link>
            <a href="https://twitter.com/miyomi_markets" target="_blank" rel="noopener noreferrer">
              <Twitter className="w-5 h-5 hover:text-red-500 transition" />
            </a>
            {/* Mode Toggle */}
            <button
              onClick={() => setIsPrivateMode(!isPrivateMode)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                isPrivateMode 
                  ? 'bg-red-600 hover:bg-red-700' 
                  : 'bg-white/10 hover:bg-white/20'
              }`}
              title={isPrivateMode ? 'Switch to Public Mode' : 'Switch to Private Mode'}
            >
              {isPrivateMode ? (
                <>
                  <Lock className="w-4 h-4" />
                  <span className="hidden sm:inline">Private</span>
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4" />
                  <span className="hidden sm:inline">Public</span>
                </>
              )}
            </button>
          </nav>
        </div>
      </header>

      {/* PUBLIC MODE */}
      {!isPrivateMode ? (
        <>
          {/* Hero Section - Live Countdown */}
          <section className="relative border-b border-white/20 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 to-orange-900/20"></div>
            <div className="relative max-w-7xl mx-auto px-6 py-16">
              <div className="grid md:grid-cols-2 gap-12">
                <div>
                  <h1 className="text-6xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                    CONTRARIAN ORACLE
                  </h1>
                  <p className="text-xl mb-8 text-gray-300">
                    NYC-based AI trader finding market inefficiencies where consensus gets comfortable
                  </p>
                  
                  {/* Next Drop Countdown */}
                  <div className="bg-white/5 backdrop-blur rounded-lg p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-gray-400">NEXT DROP</span>
                      <Clock className="w-4 h-4 text-gray-400" />
                    </div>
                    <div className="text-4xl font-mono font-bold text-red-500">
                      {getTimeUntilNextDrop()}
                    </div>
                    <div className="mt-2 text-sm text-gray-400">
                      Daily at 11:00, 15:00, 21:00 ET
                    </div>
                  </div>

                  {/* Subscribe CTA */}
                  <div className="flex gap-4">
                    <button className="px-6 py-3 bg-gradient-to-r from-red-600 to-orange-500 rounded-lg font-bold hover:opacity-90 transition">
                      Subscribe - $5/mo
                    </button>
                    <button className="px-6 py-3 border border-white/20 rounded-lg hover:bg-white/10 transition">
                      Free Preview
                    </button>
                  </div>
                </div>

                {/* Live Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 backdrop-blur rounded-lg p-6">
                    <div className="text-3xl font-bold text-green-500">{liveMetrics.winRate}%</div>
                    <div className="text-sm text-gray-400 mt-1">Win Rate</div>
                  </div>
                  <div className="bg-white/5 backdrop-blur rounded-lg p-6">
                    <div className="text-3xl font-bold text-yellow-500">{liveMetrics.activePositions}</div>
                    <div className="text-sm text-gray-400 mt-1">Active Positions</div>
                  </div>
                  <div className="bg-white/5 backdrop-blur rounded-lg p-6">
                    <div className="text-3xl font-bold text-blue-500">{liveMetrics.dailyEdge.toFixed(1)}%</div>
                    <div className="text-sm text-gray-400 mt-1">Avg Daily Edge</div>
                  </div>
                  <div className="bg-white/5 backdrop-blur rounded-lg p-6">
                    <div className="text-3xl font-bold text-purple-500">+{liveMetrics.weeklyReturn}%</div>
                    <div className="text-sm text-gray-400 mt-1">7-Day Return</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Recent Picks */}
          <section className="py-16 px-6">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold">RECENT PICKS</h2>
                
                {/* Category Filter */}
                <div className="flex gap-2">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-4 py-2 rounded-lg transition ${
                        selectedCategory === cat 
                          ? 'bg-red-600 text-white' 
                          : 'bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      {cat === 'all' ? 'All' : getCategoryEmoji(cat)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-4">
                {filteredPicks.map(pick => (
                  <div key={pick.id} className="bg-white/5 backdrop-blur rounded-lg p-6 hover:bg-white/10 transition">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-2xl">{getCategoryEmoji(pick.category)}</span>
                          <h3 className="text-xl font-bold">{pick.market}</h3>
                          {getStatusIcon(pick.status)}
                        </div>
                        
                        <div className="grid md:grid-cols-4 gap-4 mt-4">
                          <div>
                            <div className="text-sm text-gray-400">Platform</div>
                            <div className="font-bold">{pick.platform}</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-400">Position</div>
                            <div className={`font-bold ${pick.position === 'YES' ? 'text-green-500' : 'text-red-500'}`}>
                              {pick.position}
                            </div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-400">Edge</div>
                            <div className="font-bold text-yellow-500">{(pick.edge * 100).toFixed(0)}%</div>
                          </div>
                          <div>
                            <div className="text-sm text-gray-400">Entry → Current</div>
                            <div className="font-bold">
                              {(pick.entryOdds * 100).toFixed(0)}% → {pick.currentOdds ? `${(pick.currentOdds * 100).toFixed(0)}%` : '—'}
                            </div>
                          </div>
                        </div>
                      </div>

                      {pick.videoUrl && (
                        <a 
                          href={pick.videoUrl}
                          className="ml-4 p-3 bg-red-600 rounded-lg hover:bg-red-700 transition"
                        >
                          <Play className="w-5 h-5" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      ) : (
        /* PRIVATE MODE - DASHBOARD */
        <>
          {/* Tabs */}
          <div className="border-b border-white/20">
            <div className="max-w-7xl mx-auto px-6">
              <div className="flex gap-8">
                {['overview', 'training', 'performance', 'revenue'].map(tab => (
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

          {/* Dashboard Content */}
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
                    <div className="text-3xl font-bold">
                      {nextDrop ? nextDrop.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZone: 'America/New_York' }) : '--:--'}
                    </div>
                    <div className="text-sm text-gray-400 mt-1">{getTimeUntilNextDrop()}</div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <button 
                    onClick={handleTriggerManualDrop}
                    disabled={isProcessing}
                    className={`px-6 py-3 bg-red-600 rounded-lg hover:bg-red-700 transition font-bold ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {isProcessing ? '🧠 Thinking...' : '🎯 Generate Smart Drop'}
                  </button>
                  <button 
                    onClick={handleReviewPendingPicks}
                    className="px-6 py-3 bg-white/10 rounded-lg hover:bg-white/20 transition font-bold"
                  >
                    Review Pending Picks
                  </button>
                  <button 
                    onClick={handleUpdateResults}
                    className="px-6 py-3 bg-white/10 rounded-lg hover:bg-white/20 transition font-bold"
                  >
                    Update Results
                  </button>
                </div>

                {/* Recent Activity */}
                <div className="bg-white/5 backdrop-blur rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4">Recent Picks</h3>
                  <div className="space-y-3">
                    {recentPicks.map(pick => (
                      <div key={pick.id} className="flex items-center justify-between py-3 border-b border-white/10">
                        <div>
                          <div className="font-bold">{pick.market} - {pick.position}</div>
                          <div className="text-sm text-gray-400">{pick.platform} • {new Date(pick.timestamp).toLocaleString()}</div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-yellow-500">{(pick.edge * 100).toFixed(0)}% edge</span>
                          {getStatusIcon(pick.status)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Thinking Process Display */}
                {showThinking && thinkingProcess.length > 0 && (
                  <div className="mt-8 bg-black/50 backdrop-blur rounded-lg p-6 border border-red-600">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-bold">🧠 MIYOMI's Thinking Process</h3>
                      <button 
                        onClick={() => setShowThinking(false)}
                        className="text-sm hover:text-red-500"
                      >
                        Hide
                      </button>
                    </div>
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {thinkingProcess.map((step, idx) => (
                        <div key={idx} className="border-l-2 border-red-600 pl-4 py-2">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-bold text-red-500">
                              {step.step?.replace('_', ' ').toUpperCase()}
                            </span>
                            {step.status === 'thinking' && <span className="animate-pulse">⚡</span>}
                            {step.status === 'complete' && <span>✅</span>}
                          </div>
                          <div className="text-sm mb-2">{step.message}</div>
                          {step.thought && (
                            <div className="text-xs italic opacity-75 bg-white/5 p-2 rounded">
                              💭 "{step.thought}"
                            </div>
                          )}
                          {step.data && (
                            <div className="mt-2 text-xs bg-white/5 p-2 rounded">
                              {step.step === 'video_script' && (
                                <div>
                                  <div className="font-bold mb-1">📝 SCRIPT:</div>
                                  <div className="whitespace-pre-wrap">{step.data.script}</div>
                                </div>
                              )}
                              {step.step === 'pick_generation' && (
                                <div>
                                  <div className="font-bold">Pick: {step.data.market}</div>
                                  <div>Position: <span className="text-red-500">{step.data.position}</span></div>
                                  <div>Edge: <span className="text-green-500">+{(step.data.edge * 100).toFixed(0)}%</span></div>
                                </div>
                              )}
                              {step.step === 'video_generation' && step.data.edenRequest && (
                                <div>
                                  <div className="font-bold mb-1">🎨 EDEN VIDEO REQUEST:</div>
                                  <pre className="text-xs overflow-x-auto">
                                    {JSON.stringify(step.data.edenRequest, null, 2)}
                                  </pre>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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

                <button
                  onClick={saveConfig}
                  className="px-6 py-3 bg-red-600 rounded-lg hover:bg-red-700 transition font-bold"
                >
                  Save Configuration
                </button>
              </div>
            )}

            {activeTab === 'performance' && (
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
                  </table>
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
                  </div>
                  
                  <div className="bg-white/5 backdrop-blur rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold">Referrals</h3>
                      <TrendingUp className="w-5 h-5 text-blue-500" />
                    </div>
                    <div className="text-3xl font-bold mb-2">{revenueData.referralClicks}</div>
                    <div className="text-sm text-gray-400">Clicks this month</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* Footer */}
      <footer className="border-t border-white/20 py-8 px-6 mt-auto">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="text-sm text-gray-400">
            © 2025 MIYOMI - Contrarian Market Oracle
          </div>
          <div className="flex items-center gap-6">
            <a href="https://twitter.com/miyomi_markets" className="hover:text-red-500 transition">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="https://youtube.com/@miyomi" className="hover:text-red-500 transition">
              <Youtube className="w-5 h-5" />
            </a>
            {isPrivateMode && (
              <Link href="/academy/agent/miyomi" className="text-sm hover:text-red-500 transition">
                Agent Profile
              </Link>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}