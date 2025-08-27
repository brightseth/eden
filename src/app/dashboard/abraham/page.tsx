'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Calendar, Trophy, Users, TrendingUp, Clock, Award, RefreshCw, ChevronRight, Vote, Eye, Share2, DollarSign } from 'lucide-react';
import { UnifiedHeader } from '@/components/layout/UnifiedHeader';
import { ABRAHAM_BRAND } from '@/data/abrahamBrand';

interface DailyCreation {
  id: string;
  concept: string;
  imageUrl?: string;
  votes: number;
  stage: 'concept' | 'semifinal' | 'final' | 'winner';
  createdAt: string;
  metadata?: {
    prompt?: string;
    style?: string;
    technique?: string;
  };
}

interface CovenantMetrics {
  totalDays: number;
  completedDays: number;
  remainingDays: number;
  currentStreak: number;
  longestStreak: number;
  totalVotes: number;
  activeVoters: number;
  revenueGenerated: number;
}

interface TournamentStatus {
  currentDay: number;
  phase: 'generation' | 'semifinals' | 'finals' | 'complete';
  concepts: DailyCreation[];
  semifinalists: DailyCreation[];
  finalists: DailyCreation[];
  winner?: DailyCreation;
  nextPhaseAt: string;
}

export default function AbrahamDashboard() {
  const [metrics, setMetrics] = useState<CovenantMetrics | null>(null);
  const [tournamentStatus, setTournamentStatus] = useState<TournamentStatus | null>(null);
  const [recentWorks, setRecentWorks] = useState<DailyCreation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedView, setSelectedView] = useState<'tournament' | 'metrics' | 'history'>('tournament');
  const [isVoting, setIsVoting] = useState(false);

  useEffect(() => {
    fetchDashboardData();
    // Set up real-time updates
    const interval = setInterval(fetchDashboardData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch covenant status
      const covenantRes = await fetch('/api/agents/abraham/covenant');
      const covenantData = await covenantRes.json();
      
      // Calculate metrics
      const covenantStart = new Date('2025-10-19T00:00:00Z');
      const covenantEnd = new Date('2038-10-19T00:00:00Z');
      const now = new Date();
      
      const totalDays = Math.floor((covenantEnd.getTime() - covenantStart.getTime()) / (1000 * 60 * 60 * 24));
      const elapsedDays = Math.max(0, Math.floor((now.getTime() - covenantStart.getTime()) / (1000 * 60 * 60 * 24)));
      const remainingDays = Math.max(0, Math.floor((covenantEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
      
      setMetrics({
        totalDays,
        completedDays: elapsedDays,
        remainingDays,
        currentStreak: 42, // Mock data
        longestStreak: 127,
        totalVotes: 15234,
        activeVoters: 823,
        revenueGenerated: 125000
      });

      // Mock tournament data
      const mockTournament: TournamentStatus = {
        currentDay: elapsedDays,
        phase: 'semifinals',
        concepts: generateMockConcepts(8),
        semifinalists: generateMockConcepts(4),
        finalists: [],
        nextPhaseAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString()
      };
      setTournamentStatus(mockTournament);

      // Mock recent works
      setRecentWorks(generateMockConcepts(7));
      
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateMockConcepts = (count: number): DailyCreation[] => {
    return Array.from({ length: count }, (_, i) => ({
      id: `concept-${Date.now()}-${i}`,
      concept: `Knowledge Synthesis #${Math.floor(Math.random() * 10000)}`,
      imageUrl: `/api/placeholder/400/400`,
      votes: Math.floor(Math.random() * 500) + 50,
      stage: 'concept' as const,
      createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
      metadata: {
        prompt: 'Collective intelligence manifesting as geometric patterns',
        style: 'Abstract Expressionism',
        technique: 'GAN synthesis'
      }
    }));
  };

  const handleVote = async (creationId: string) => {
    setIsVoting(true);
    try {
      // TODO: Implement actual voting API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update local state to reflect vote
      if (tournamentStatus) {
        const updatedConcepts = tournamentStatus.concepts.map(c => 
          c.id === creationId ? { ...c, votes: c.votes + 1 } : c
        );
        setTournamentStatus({ ...tournamentStatus, concepts: updatedConcepts });
      }
    } catch (error) {
      console.error('Failed to submit vote:', error);
    } finally {
      setIsVoting(false);
    }
  };

  const formatTimeRemaining = (isoString: string) => {
    const target = new Date(isoString);
    const now = new Date();
    const diff = target.getTime() - now.getTime();
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <UnifiedHeader />
        <div className="max-w-7xl mx-auto px-6 py-16 text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
          <div>Loading Abraham Covenant Dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <UnifiedHeader />
      
      {/* Header */}
      <div className="border-b border-white">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                href="/academy/agent/abraham" 
                className="flex items-center gap-2 hover:bg-white hover:text-black px-2 py-1 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                BACK TO ABRAHAM
              </Link>
              <span className="text-gray-500">|</span>
              <h1 className="text-xl font-bold">COVENANT DASHBOARD</h1>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => fetchDashboardData()}
                className="p-2 border border-white hover:bg-white hover:text-black transition-all"
                title="Refresh data"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <span className="px-3 py-1 border border-green-400 text-green-400 text-sm">
                COVENANT ACTIVE
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* View Selector */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1">
            {(['tournament', 'metrics', 'history'] as const).map(view => (
              <button
                key={view}
                onClick={() => setSelectedView(view)}
                className={`px-6 py-3 uppercase text-sm transition-all ${
                  selectedView === view 
                    ? 'bg-white text-black' 
                    : 'hover:bg-gray-900'
                }`}
              >
                {view === 'tournament' && <Trophy className="w-4 h-4 inline mr-2" />}
                {view === 'metrics' && <TrendingUp className="w-4 h-4 inline mr-2" />}
                {view === 'history' && <Clock className="w-4 h-4 inline mr-2" />}
                {view}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Quick Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="border border-gray-800 p-4">
            <div className="text-3xl font-bold text-green-400">
              {metrics?.completedDays || 0}
            </div>
            <div className="text-xs text-gray-400 mt-1">DAYS COMPLETED</div>
            <div className="text-xs mt-2">
              {((metrics?.completedDays || 0) / (metrics?.totalDays || 1) * 100).toFixed(1)}% of Covenant
            </div>
          </div>
          <div className="border border-gray-800 p-4">
            <div className="text-3xl font-bold">
              {metrics?.currentStreak || 0}
            </div>
            <div className="text-xs text-gray-400 mt-1">CURRENT STREAK</div>
            <div className="text-xs mt-2">
              Longest: {metrics?.longestStreak || 0} days
            </div>
          </div>
          <div className="border border-gray-800 p-4">
            <div className="text-3xl font-bold">
              {metrics?.activeVoters || 0}
            </div>
            <div className="text-xs text-gray-400 mt-1">ACTIVE VOTERS TODAY</div>
            <div className="text-xs mt-2">
              {metrics?.totalVotes || 0} total votes
            </div>
          </div>
          <div className="border border-gray-800 p-4">
            <div className="text-3xl font-bold">
              ${((metrics?.revenueGenerated || 0) / 1000).toFixed(1)}K
            </div>
            <div className="text-xs text-gray-400 mt-1">REVENUE GENERATED</div>
            <div className="text-xs mt-2">
              25% to token holders
            </div>
          </div>
        </div>

        {/* Tournament View */}
        {selectedView === 'tournament' && tournamentStatus && (
          <div className="space-y-8">
            {/* Tournament Status Header */}
            <div className="border border-white p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold">
                    DAY {tournamentStatus.currentDay} TOURNAMENT
                  </h2>
                  <p className="text-sm text-gray-400 mt-1">
                    Phase: {tournamentStatus.phase.toUpperCase()}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-400">Next phase in</div>
                  <div className="text-2xl font-mono">
                    {formatTimeRemaining(tournamentStatus.nextPhaseAt)}
                  </div>
                </div>
              </div>

              {/* Tournament Flow Diagram */}
              <div className="grid grid-cols-4 gap-4 mt-6 text-center">
                <div className={`p-3 border ${tournamentStatus.phase === 'generation' ? 'border-green-400 bg-green-400/10' : 'border-gray-600'}`}>
                  <div className="text-2xl font-bold">8</div>
                  <div className="text-xs mt-1">CONCEPTS</div>
                </div>
                <div className={`p-3 border ${tournamentStatus.phase === 'semifinals' ? 'border-green-400 bg-green-400/10' : 'border-gray-600'}`}>
                  <div className="text-2xl font-bold">4</div>
                  <div className="text-xs mt-1">SEMIFINALS</div>
                </div>
                <div className={`p-3 border ${tournamentStatus.phase === 'finals' ? 'border-green-400 bg-green-400/10' : 'border-gray-600'}`}>
                  <div className="text-2xl font-bold">2</div>
                  <div className="text-xs mt-1">FINALS</div>
                </div>
                <div className={`p-3 border ${tournamentStatus.phase === 'complete' ? 'border-green-400 bg-green-400/10' : 'border-gray-600'}`}>
                  <div className="text-2xl font-bold">1</div>
                  <div className="text-xs mt-1">WINNER</div>
                </div>
              </div>
            </div>

            {/* Active Voting Section */}
            {tournamentStatus.phase === 'semifinals' && (
              <div>
                <h3 className="text-xl mb-4 flex items-center gap-2">
                  <Vote className="w-5 h-5" />
                  VOTE FOR SEMIFINALISTS
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {tournamentStatus.semifinalists.map((creation) => (
                    <div key={creation.id} className="border border-gray-800 hover:border-white transition-all">
                      <div className="aspect-square bg-gray-900 relative">
                        <div className="absolute inset-0 flex items-center justify-center text-gray-600">
                          [GENESIS #{creation.concept.split('#')[1]}]
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div className="text-sm font-bold">{creation.concept}</div>
                          <div className="text-xs text-gray-400">{creation.votes} votes</div>
                        </div>
                        <button
                          onClick={() => handleVote(creation.id)}
                          disabled={isVoting}
                          className="w-full py-2 border border-white hover:bg-white hover:text-black transition-all disabled:opacity-50"
                        >
                          {isVoting ? 'VOTING...' : 'VOTE'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Today's Winner (if complete) */}
            {tournamentStatus.winner && (
              <div className="border border-green-400 p-6 bg-green-400/5">
                <h3 className="text-xl mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-green-400" />
                  TODAY'S COVENANT WORK
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="aspect-square bg-gray-900 border border-green-400">
                    <div className="flex items-center justify-center h-full text-green-400">
                      [WINNER: {tournamentStatus.winner.concept}]
                    </div>
                  </div>
                  <div>
                    <h4 className="text-2xl mb-3">{tournamentStatus.winner.concept}</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Total Votes:</span>
                        <span>{tournamentStatus.winner.votes}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Winning Margin:</span>
                        <span>67%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Technique:</span>
                        <span>{tournamentStatus.winner.metadata?.technique}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-6">
                      <button className="flex-1 py-2 border border-white hover:bg-white hover:text-black transition-all">
                        <Eye className="w-4 h-4 inline mr-2" />
                        VIEW
                      </button>
                      <button className="flex-1 py-2 border border-white hover:bg-white hover:text-black transition-all">
                        <Share2 className="w-4 h-4 inline mr-2" />
                        SHARE
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Metrics View */}
        {selectedView === 'metrics' && metrics && (
          <div className="space-y-8">
            {/* Progress Overview */}
            <div className="border border-white p-6">
              <h2 className="text-2xl mb-6">COVENANT PROGRESS</h2>
              
              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span>{ABRAHAM_BRAND.timeline.covenantStart}</span>
                  <span className="text-green-400">
                    {metrics.completedDays} / {metrics.totalDays} days
                  </span>
                  <span>{ABRAHAM_BRAND.timeline.covenantEnd}</span>
                </div>
                <div className="w-full bg-gray-800 h-8 relative">
                  <div 
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-green-400 to-emerald-400"
                    style={{ width: `${(metrics.completedDays / metrics.totalDays) * 100}%` }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center text-xs">
                    {((metrics.completedDays / metrics.totalDays) * 100).toFixed(2)}% COMPLETE
                  </div>
                </div>
              </div>

              {/* Detailed Metrics Grid */}
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h3 className="text-sm text-gray-400 mb-3">CREATION METRICS</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Works Created:</span>
                      <span className="font-bold">{metrics.completedDays}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Works Remaining:</span>
                      <span className="font-bold">{metrics.totalDays - metrics.completedDays}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Success Rate:</span>
                      <span className="font-bold">100%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Concepts Generated:</span>
                      <span className="font-bold">{metrics.completedDays * 8}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm text-gray-400 mb-3">ENGAGEMENT METRICS</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Total Votes Cast:</span>
                      <span className="font-bold">{metrics.totalVotes.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Unique Voters:</span>
                      <span className="font-bold">{metrics.activeVoters}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Avg Votes/Day:</span>
                      <span className="font-bold">
                        {Math.floor(metrics.totalVotes / Math.max(1, metrics.completedDays))}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Participation Rate:</span>
                      <span className="font-bold">73%</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm text-gray-400 mb-3">ECONOMIC METRICS</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Total Revenue:</span>
                      <span className="font-bold">${(metrics.revenueGenerated / 1000).toFixed(1)}K</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Avg Per Work:</span>
                      <span className="font-bold">
                        ${Math.floor(metrics.revenueGenerated / Math.max(1, metrics.completedDays))}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Token Holders:</span>
                      <span className="font-bold">1,247</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Distribution Rate:</span>
                      <span className="font-bold">25%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Streak Tracker */}
            <div className="border border-gray-800 p-6">
              <h3 className="text-xl mb-4">STREAK TRACKER</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Current Streak:</span>
                    <span className="text-3xl font-bold text-green-400">{metrics.currentStreak} days</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Longest Streak:</span>
                    <span className="text-2xl font-bold">{metrics.longestStreak} days</span>
                  </div>
                </div>
                <div className="border-l border-gray-800 pl-6">
                  <div className="text-sm text-gray-400 mb-2">STREAK CALENDAR</div>
                  <div className="grid grid-cols-7 gap-1">
                    {Array.from({ length: 28 }, (_, i) => (
                      <div
                        key={i}
                        className={`aspect-square border ${
                          i < metrics.currentStreak 
                            ? 'bg-green-400 border-green-400' 
                            : 'border-gray-800'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* History View */}
        {selectedView === 'history' && (
          <div className="space-y-8">
            <div className="border border-white p-6">
              <h2 className="text-2xl mb-6">RECENT COVENANT WORKS</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentWorks.map((work, index) => (
                  <div key={work.id} className="border border-gray-800 hover:border-white transition-all">
                    <div className="aspect-square bg-gray-900 relative">
                      <div className="absolute top-2 left-2 px-2 py-1 bg-black border border-gray-600 text-xs">
                        DAY {metrics?.completedDays ? metrics.completedDays - index : 0}
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center text-gray-600">
                        [{work.concept}]
                      </div>
                    </div>
                    <div className="p-4">
                      <h4 className="font-bold mb-2">{work.concept}</h4>
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>{new Date(work.createdAt).toLocaleDateString()}</span>
                        <span>{work.votes} votes</span>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <button className="flex-1 py-1 text-xs border border-gray-600 hover:border-white transition-all">
                          VIEW
                        </button>
                        <button className="flex-1 py-1 text-xs border border-gray-600 hover:border-white transition-all">
                          DETAILS
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 text-center">
                <Link 
                  href="/academy/agent/abraham/covenant"
                  className="inline-flex items-center gap-2 px-6 py-2 border border-white hover:bg-white hover:text-black transition-all"
                >
                  VIEW ALL COVENANT WORKS
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Economic Performance */}
            <div className="border border-gray-800 p-6">
              <h3 className="text-xl mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                ECONOMIC PERFORMANCE
              </h3>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="text-center p-4 border border-gray-800">
                  <div className="text-2xl font-bold text-green-400">$125K</div>
                  <div className="text-xs text-gray-400 mt-1">TOTAL REVENUE</div>
                </div>
                <div className="text-center p-4 border border-gray-800">
                  <div className="text-2xl font-bold">$31.25K</div>
                  <div className="text-xs text-gray-400 mt-1">TO HOLDERS (25%)</div>
                </div>
                <div className="text-center p-4 border border-gray-800">
                  <div className="text-2xl font-bold">$156</div>
                  <div className="text-xs text-gray-400 mt-1">AVG PER WORK</div>
                </div>
                <div className="text-center p-4 border border-gray-800">
                  <div className="text-2xl font-bold text-green-400">↑ 12%</div>
                  <div className="text-xs text-gray-400 mt-1">MONTH GROWTH</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-wrap gap-4 justify-center">
            <Link 
              href="/api/agents/abraham"
              className="px-6 py-2 border border-gray-600 hover:border-white transition-all"
            >
              API DOCS
            </Link>
            <Link 
              href="/academy/agent/abraham"
              className="px-6 py-2 border border-gray-600 hover:border-white transition-all"
            >
              AGENT PROFILE
            </Link>
            <Link 
              href={ABRAHAM_BRAND.external.abrahamAI}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2 border border-gray-600 hover:border-white transition-all"
            >
              ABRAHAM.AI
            </Link>
            <button 
              className="px-6 py-2 border border-green-400 text-green-400 hover:bg-green-400 hover:text-black transition-all"
            >
              EXPORT METRICS
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}