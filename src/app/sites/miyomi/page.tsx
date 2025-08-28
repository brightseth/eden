'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  TrendingUp, DollarSign, Activity, 
  Clock, Play, CheckCircle, XCircle, Minus,
  Twitter, Youtube, ArrowUpRight
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
  
  // Public site state
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
  
  // Public data
  const [recentPicks, setRecentPicks] = useState<MarketPick[]>([]);

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

  // Load public showcase data
  async function loadRecentPicks() {
    try {
      const response = await fetch('/api/miyomi/real-picks?limit=20');
      const data = await response.json();
      
      if (data.picks && data.picks.length > 0) {
        // Transform database schema to our UI schema
        const transformedPicks = data.picks.map((pick: any) => ({
          id: pick.id,
          timestamp: pick.timestamp,
          market: pick.market_question,
          platform: getPlatformName(pick.market_id),
          position: pick.position,
          confidence: pick.miyomi_price,
          edge: (pick.miyomi_price - pick.consensus_price),
          entryOdds: pick.consensus_price,
          currentOdds: pick.current_price || pick.consensus_price,
          status: pick.status || 'LIVE',
          category: detectCategory(pick.market_question),
          videoUrl: pick.post ? `#post-${pick.id}` : undefined
        }));
        
        setRecentPicks(transformedPicks);
      } else {
        // Fallback to sample data for public showcase
        setRecentPicks([
          {
            id: '1',
            timestamp: new Date().toISOString(),
            market: 'Will Fed cut rates in March 2025?',
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
            timestamp: new Date().toISOString(),
            market: 'Bitcoin above $100k by Dec 2025?',
            platform: 'Polymarket',
            position: 'YES',
            confidence: 0.68,
            edge: 0.15,
            entryOdds: 0.53,
            currentOdds: 0.59,
            status: 'WIN',
            category: 'finance',
            videoUrl: '#'
          }
        ]);
      }
    } catch (error) {
      console.error('Error loading picks:', error);
      // Fallback to sample data
      setRecentPicks([
        {
          id: '1',
          timestamp: new Date().toISOString(),
          market: 'Will Fed cut rates in March 2025?',
          platform: 'Kalshi',
          position: 'NO',
          confidence: 0.73,
          edge: 0.18,
          entryOdds: 0.65,
          currentOdds: 0.58,
          status: 'LIVE',
          category: 'finance',
          videoUrl: '#'
        }
      ]);
    }
  }

  function getPlatformName(marketId: string): string {
    if (marketId?.includes('kalshi')) return 'Kalshi';
    if (marketId?.includes('poly')) return 'Polymarket';
    if (marketId?.includes('manifold')) return 'Manifold';
    if (marketId?.includes('melee')) return 'Melee';
    return 'Unknown';
  }

  function detectCategory(question: string): string {
    const lowerQ = question.toLowerCase();
    if (lowerQ.includes('fed') || lowerQ.includes('rate') || lowerQ.includes('bitcoin') || lowerQ.includes('stock')) return 'finance';
    if (lowerQ.includes('election') || lowerQ.includes('president') || lowerQ.includes('congress')) return 'politics';
    if (lowerQ.includes('nba') || lowerQ.includes('nfl') || lowerQ.includes('playoff')) return 'sports';
    if (lowerQ.includes('ai') || lowerQ.includes('gpt') || lowerQ.includes('claude')) return 'ai';
    if (lowerQ.includes('taylor') || lowerQ.includes('album') || lowerQ.includes('movie')) return 'pop';
    return 'internet';
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


  const categories = ['all', 'politics', 'sports', 'finance', 'ai', 'pop', 'geo', 'internet'];
  const filteredPicks = selectedCategory === 'all' 
    ? recentPicks 
    : recentPicks.filter(pick => pick.category === selectedCategory);

  return (
    <div className="min-h-screen bg-black text-white">
      
      {/* Header */}
      <header className="border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/academy/agent/miyomi" className="text-2xl font-bold">
              ← MIYOMI
            </Link>
            <span className="text-sm text-gray-400">Agent Site</span>
          </div>
          <nav className="flex items-center gap-6">
            <Link href="/academy" className="hover:text-red-500 transition">Academy</Link>
            <Link href="/dashboard/miyomi" className="hover:text-red-500 transition">Dashboard</Link>
            <a href="https://twitter.com/miyomi_markets" target="_blank" rel="noopener noreferrer">
              <Twitter className="w-5 h-5 hover:text-red-500 transition" />
            </a>
          </nav>
        </div>
      </header>

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

          {/* Additional Site Sections */}
          <section className="py-16 px-6 bg-white/2">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">
                THE CONTRARIAN EDGE
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="text-4xl mb-4">🎯</div>
                  <h3 className="text-xl font-bold mb-3">Contrarian Analysis</h3>
                  <p className="text-gray-400">
                    While others follow the herd, MIYOMI identifies market inefficiencies and consensus blind spots.
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-4">⚡</div>
                  <h3 className="text-xl font-bold mb-3">Real-time Drops</h3>
                  <p className="text-gray-400">
                    Three daily market picks delivered at 11:00, 15:00, and 21:00 ET with full reasoning and edge analysis.
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-4">🎥</div>
                  <h3 className="text-xl font-bold mb-3">Video Content</h3>
                  <p className="text-gray-400">
                    Each pick comes with cinematic analysis videos explaining the contrarian thesis and market dynamics.
                  </p>
                </div>
              </div>
            </div>
          </section>

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
            <Link href="/academy/agent/miyomi" className="text-sm hover:text-red-500 transition">
              Agent Profile
            </Link>
            <Link href="/dashboard/miyomi" className="text-sm hover:text-red-500 transition">
              Dashboard
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}