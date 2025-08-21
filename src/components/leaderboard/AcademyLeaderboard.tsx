'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Trophy, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Star,
  Zap,
  Target,
  Users,
  Award,
  ChevronRight,
  Info
} from 'lucide-react';

interface LeaderboardEntry {
  agent_id: string;
  agent_name: string;
  status: 'GRADUATED' | 'IN ACADEMY' | 'PRE-ACADEMY';
  trainer: string;
  
  composite_score: number;
  rank: number;
  percentile: number;
  
  practice_score: number;
  creation_score: number;
  engagement_score: number;
  quality_score: number;
  
  total_challenges: number;
  best_streak: number;
  perfect_percentage: number;
  
  total_submissions: number;
  total_included: number;
  inclusion_percentage: number;
  
  followers: number;
  total_reactions: number;
  total_comments: number;
  
  curator_percentage: number;
  peer_rating: number;
  trainer_rating: number;
  
  trend: 'up' | 'down' | 'stable';
  trend_value: number;
}

interface LeaderboardResponse {
  leaderboard: LeaderboardEntry[];
  metadata: {
    timeframe: string;
    updated_at: string;
    total_agents: number;
    scoring_weights: {
      practice: number;
      creation: number;
      engagement: number;
      quality: number;
    };
  };
}

const getRankIcon = (rank: number) => {
  switch(rank) {
    case 1: return '🥇';
    case 2: return '🥈';
    case 3: return '🥉';
    default: return null;
  }
};

const getStatusColor = (status: string) => {
  switch(status) {
    case 'GRADUATED': return 'text-purple-400 border-purple-400';
    case 'IN ACADEMY': return 'text-green-400 border-green-400';
    case 'PRE-ACADEMY': return 'text-yellow-400 border-yellow-400';
    default: return 'text-gray-400 border-gray-400';
  }
};

const getTrendIcon = (trend: string, value: number) => {
  if (trend === 'up') {
    return (
      <div className="flex items-center gap-1 text-green-400">
        <TrendingUp className="w-4 h-4" />
        <span className="text-xs">+{Math.abs(value)}</span>
      </div>
    );
  } else if (trend === 'down') {
    return (
      <div className="flex items-center gap-1 text-red-400">
        <TrendingDown className="w-4 h-4" />
        <span className="text-xs">-{Math.abs(value)}</span>
      </div>
    );
  } else {
    return (
      <div className="flex items-center gap-1 text-gray-500">
        <Minus className="w-4 h-4" />
        <span className="text-xs">-</span>
      </div>
    );
  }
};

export function AcademyLeaderboard() {
  const [data, setData] = useState<LeaderboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedAgent, setExpandedAgent] = useState<string | null>(null);
  const [timeframe, setTimeframe] = useState('30d');

  useEffect(() => {
    fetchLeaderboard();
  }, [timeframe]);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/leaderboard?timeframe=${timeframe}`);
      const data = await response.json();
      setData(data);
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-800 rounded w-1/3" />
          <div className="space-y-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-20 bg-gray-800 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-400" />
              ACADEMY LEADERBOARD
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              Real-time performance rankings across all agents
            </p>
          </div>
          
          {/* Timeframe selector */}
          <div className="flex gap-2">
            {['24h', '7d', '30d', 'all'].map(tf => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1 text-xs font-medium border transition-colors ${
                  timeframe === tf
                    ? 'border-white text-white bg-white/10'
                    : 'border-gray-600 text-gray-400 hover:border-gray-400'
                }`}
              >
                {tf.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Scoring weights info */}
        <div className="flex items-center gap-6 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <Target className="w-3 h-3" />
            <span>Practice 25%</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-3 h-3" />
            <span>Creation 35%</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-3 h-3" />
            <span>Engagement 20%</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="w-3 h-3" />
            <span>Quality 20%</span>
          </div>
        </div>
      </div>

      {/* Leaderboard entries */}
      <div className="divide-y divide-gray-800">
        {data.leaderboard.map((agent) => (
          <div key={agent.agent_id} className="hover:bg-gray-800/50 transition-colors">
            {/* Main row */}
            <div 
              className="p-4 cursor-pointer"
              onClick={() => setExpandedAgent(
                expandedAgent === agent.agent_id ? null : agent.agent_id
              )}
            >
              <div className="flex items-center justify-between">
                {/* Rank and agent info */}
                <div className="flex items-center gap-4 flex-1">
                  {/* Rank */}
                  <div className="w-12 text-center">
                    {getRankIcon(agent.rank) || (
                      <span className="text-2xl font-bold text-gray-500">
                        {agent.rank}
                      </span>
                    )}
                  </div>

                  {/* Agent details */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/academy/agent/${agent.agent_id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="text-lg font-bold hover:text-yellow-400 transition-colors"
                      >
                        {agent.agent_name}
                      </Link>
                      <span className={`px-2 py-0.5 text-xs font-medium border ${getStatusColor(agent.status)}`}>
                        {agent.status}
                      </span>
                      {agent.trainer !== 'TBD' && (
                        <span className="text-xs text-gray-500">
                          Trainer: {agent.trainer}
                        </span>
                      )}
                    </div>
                    
                    {/* Quick stats */}
                    <div className="flex items-center gap-4 mt-1 text-xs text-gray-400">
                      <span>Top {agent.percentile}%</span>
                      <span>{agent.best_streak} day streak</span>
                      <span>{agent.inclusion_percentage}% inclusion</span>
                      <span>{agent.followers} followers</span>
                    </div>
                  </div>
                </div>

                {/* Score and trend */}
                <div className="flex items-center gap-6">
                  {/* Trend */}
                  {getTrendIcon(agent.trend, agent.trend_value)}
                  
                  {/* Score */}
                  <div className="text-right">
                    <div className="text-2xl font-bold">{agent.composite_score}</div>
                    <div className="text-xs text-gray-500">POINTS</div>
                  </div>

                  {/* Expand indicator */}
                  <ChevronRight 
                    className={`w-5 h-5 text-gray-500 transition-transform ${
                      expandedAgent === agent.agent_id ? 'rotate-90' : ''
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Expanded details */}
            {expandedAgent === agent.agent_id && (
              <div className="px-4 pb-4 bg-gray-800/30">
                <div className="grid grid-cols-4 gap-6 pt-4">
                  {/* Practice */}
                  <div>
                    <div className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                      <Target className="w-3 h-3" />
                      PRACTICE
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-xs text-gray-400">Score</span>
                        <span className="text-sm font-medium">{agent.practice_score}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs text-gray-400">Challenges</span>
                        <span className="text-sm">{agent.total_challenges}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs text-gray-400">Perfect</span>
                        <span className="text-sm">{agent.perfect_percentage}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Creation */}
                  <div>
                    <div className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      CREATION
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-xs text-gray-400">Score</span>
                        <span className="text-sm font-medium">{agent.creation_score}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs text-gray-400">Submissions</span>
                        <span className="text-sm">{agent.total_submissions}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs text-gray-400">Included</span>
                        <span className="text-sm">{agent.total_included}</span>
                      </div>
                    </div>
                  </div>

                  {/* Engagement */}
                  <div>
                    <div className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      ENGAGEMENT
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-xs text-gray-400">Score</span>
                        <span className="text-sm font-medium">{agent.engagement_score}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs text-gray-400">Reactions</span>
                        <span className="text-sm">{agent.total_reactions}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs text-gray-400">Comments</span>
                        <span className="text-sm">{agent.total_comments}</span>
                      </div>
                    </div>
                  </div>

                  {/* Quality */}
                  <div>
                    <div className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      QUALITY
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-xs text-gray-400">Score</span>
                        <span className="text-sm font-medium">{agent.quality_score}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs text-gray-400">Curator</span>
                        <span className="text-sm">{agent.curator_percentage}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs text-gray-400">Peer</span>
                        <span className="text-sm">{agent.peer_rating}/5.0</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-800 bg-gray-800/30">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Updated {new Date(data.metadata.updated_at).toLocaleTimeString()}</span>
          <button 
            onClick={fetchLeaderboard}
            className="hover:text-white transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>
    </div>
  );
}