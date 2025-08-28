'use client';

import { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Eye, 
  Brain, 
  Target,
  BarChart3,
  PieChart,
  Activity,
  Zap,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import Link from 'next/link';

interface PerformanceMetrics {
  totalValue: number;
  totalInvested: number;
  roi: number;
  unrealizedGains: number;
}

interface DecisionAnalytics {
  totalDecisions: number;
  acquisitions: number;
  successRate: number;
  averageConfidence: number;
}

interface MarketComparison {
  berthaPerformance: number;
  nftMarketIndex: number;
  outperformance: number;
  sharpeRatio: number;
}

interface RealtimeMetrics {
  currentPortfolioValue: number;
  todaysPnL: number;
  activePositions: number;
  pendingDecisions: number;
  marketSentiment: string;
  riskScore: number;
}

interface CategoryAnalytics {
  category: string;
  allocation: number;
  performance: number;
  pieces: number;
}

interface TrendAnalysis {
  momentum: string;
  confidence: number;
  keyInsights: string[];
  performanceDrivers: string[];
  riskFactors: string[];
}

export default function BerthaDashboard() {
  const [performanceData, setPerformanceData] = useState<PerformanceMetrics | null>(null);
  const [decisionData, setDecisionData] = useState<DecisionAnalytics | null>(null);
  const [marketData, setMarketData] = useState<MarketComparison | null>(null);
  const [realtimeData, setRealtimeData] = useState<RealtimeMetrics | null>(null);
  const [categoryData, setCategoryData] = useState<CategoryAnalytics[]>([]);
  const [trendData, setTrendData] = useState<TrendAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchAnalyticsData();
    const interval = setInterval(fetchRealtimeData, 30000); // Update every 30s
    return () => clearInterval(interval);
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      const [overviewRes, categoryRes, trendsRes] = await Promise.all([
        fetch('/api/agents/bertha/analytics?type=overview'),
        fetch('/api/agents/bertha/analytics?type=categories'),
        fetch('/api/agents/bertha/analytics?type=trends')
      ]);

      if (!overviewRes.ok) throw new Error('Failed to fetch overview data');

      const overviewData = await overviewRes.json();
      const categoryData = await categoryRes.json();
      const trendsData = await trendsRes.json();

      // Extract nested analytics data
      const analytics = overviewData.analytics;
      setPerformanceData(analytics.performance.monthly);
      setDecisionData(analytics.decisions);
      setMarketData(analytics.market);
      setRealtimeData(analytics.realtime);
      setCategoryData(categoryData.categories || []);
      setTrendData(trendsData.trends);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const fetchRealtimeData = async () => {
    try {
      const response = await fetch('/api/agents/bertha/analytics?type=realtime');
      const data = await response.json();
      setRealtimeData(data.realtime);
    } catch (err) {
      console.error('Failed to update realtime data:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <Activity className="w-8 h-8 animate-spin mx-auto mb-4 text-purple-400" />
          <div className="text-lg">Loading BERTHA Analytics...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-8 h-8 mx-auto mb-4 text-red-400" />
          <div className="text-lg text-red-400">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-purple-400">BERTHA ANALYTICS</h1>
              <p className="text-gray-400">Collection Intelligence Dashboard</p>
            </div>
            <div className="flex items-center gap-4">
              <Link 
                href="/academy/agent/bertha" 
                className="text-gray-400 hover:text-white transition-colors"
              >
                Agent Profile
              </Link>
              <Link 
                href="/sites/bertha" 
                className="px-4 py-2 border border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white transition-all"
              >
                Live Studio
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Status Bar */}
      {realtimeData && (
        <div className="bg-gray-900 border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">
                  ${realtimeData.currentPortfolioValue.toFixed(0)}
                </div>
                <div className="text-xs text-gray-400">Portfolio Value</div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${realtimeData.todaysPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {realtimeData.todaysPnL >= 0 ? '+' : ''}${realtimeData.todaysPnL.toFixed(0)}
                </div>
                <div className="text-xs text-gray-400">Today's P&L</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">{realtimeData.activePositions}</div>
                <div className="text-xs text-gray-400">Active Positions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">{realtimeData.pendingDecisions}</div>
                <div className="text-xs text-gray-400">Pending Decisions</div>
              </div>
              <div className="text-center">
                <div className="text-sm font-medium text-purple-400">{realtimeData.marketSentiment}</div>
                <div className="text-xs text-gray-400">Market Sentiment</div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${realtimeData.riskScore < 50 ? 'text-green-400' : realtimeData.riskScore < 75 ? 'text-yellow-400' : 'text-red-400'}`}>
                  {realtimeData.riskScore.toFixed(0)}
                </div>
                <div className="text-xs text-gray-400">Risk Score</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'performance', label: 'Performance', icon: TrendingUp },
              { id: 'decisions', label: 'Decisions', icon: Brain },
              { id: 'market', label: 'Market', icon: Activity },
              { id: 'insights', label: 'Insights', icon: Eye }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 border-b-2 transition-colors ${
                  activeTab === tab.id 
                    ? 'border-purple-400 text-purple-400' 
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Performance Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {performanceData && (
                <>
                  <div className="bg-gray-900 border border-gray-700 p-6 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-medium text-gray-400">Total Value</h3>
                      <DollarSign className="w-5 h-5 text-green-400" />
                    </div>
                    <div className="text-2xl font-bold text-white">
                      ${performanceData.totalValue.toFixed(2)}
                    </div>
                  </div>
                  <div className="bg-gray-900 border border-gray-700 p-6 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-medium text-gray-400">ROI</h3>
                      {performanceData.roi >= 0 ? 
                        <TrendingUp className="w-5 h-5 text-green-400" /> :
                        <TrendingDown className="w-5 h-5 text-red-400" />
                      }
                    </div>
                    <div className={`text-2xl font-bold ${performanceData.roi >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {performanceData.roi >= 0 ? '+' : ''}{performanceData.roi.toFixed(1)}%
                    </div>
                  </div>
                </>
              )}
              {decisionData && (
                <>
                  <div className="bg-gray-900 border border-gray-700 p-6 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-medium text-gray-400">Success Rate</h3>
                      <Target className="w-5 h-5 text-blue-400" />
                    </div>
                    <div className="text-2xl font-bold text-blue-400">
                      {decisionData.successRate.toFixed(1)}%
                    </div>
                  </div>
                  <div className="bg-gray-900 border border-gray-700 p-6 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-medium text-gray-400">Decisions</h3>
                      <Brain className="w-5 h-5 text-purple-400" />
                    </div>
                    <div className="text-2xl font-bold text-purple-400">
                      {decisionData.totalDecisions}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Market Comparison */}
            {marketData && (
              <div className="bg-gray-900 border border-gray-700 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-6 text-white">Market Performance</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <div className="text-sm text-gray-400 mb-1">BERTHA Performance</div>
                    <div className="text-2xl font-bold text-green-400">+{marketData.berthaPerformance.toFixed(1)}%</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400 mb-1">NFT Market Index</div>
                    <div className="text-2xl font-bold text-gray-300">+{marketData.nftMarketIndex.toFixed(1)}%</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Outperformance</div>
                    <div className="text-2xl font-bold text-purple-400">+{marketData.outperformance.toFixed(1)}%</div>
                  </div>
                </div>
              </div>
            )}

            {/* Category Allocation */}
            {categoryData.length > 0 && (
              <div className="bg-gray-900 border border-gray-700 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-6 text-white">Portfolio Allocation</h3>
                <div className="space-y-4">
                  {categoryData.slice(0, 6).map((category, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-sm font-medium text-white">{category.category}</div>
                        <div className="text-xs text-gray-400">{category.pieces} pieces</div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-24 bg-gray-800 rounded-full h-2">
                          <div 
                            className="bg-purple-400 h-2 rounded-full" 
                            style={{ width: `${category.allocation}%` }}
                          ></div>
                        </div>
                        <div className="text-sm font-medium text-gray-300 w-12">
                          {category.allocation.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'insights' && trendData && (
          <div className="space-y-8">
            <div className="bg-gray-900 border border-gray-700 p-6 rounded-lg">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">Market Momentum</h3>
                <div className={`px-3 py-1 rounded text-sm font-medium ${
                  trendData.momentum === 'bullish' ? 'bg-green-900 text-green-300' :
                  trendData.momentum === 'bearish' ? 'bg-red-900 text-red-300' :
                  'bg-gray-800 text-gray-300'
                }`}>
                  {trendData.momentum.toUpperCase()}
                </div>
              </div>
              <div className="text-sm text-gray-400 mb-4">
                Confidence: {(trendData.confidence * 100).toFixed(1)}%
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-900 border border-gray-700 p-6 rounded-lg">
                <h4 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  Key Insights
                </h4>
                <ul className="space-y-2">
                  {trendData.keyInsights.map((insight, index) => (
                    <li key={index} className="text-sm text-gray-300 flex items-start gap-2">
                      <span className="text-green-400 mt-1">•</span>
                      {insight}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-gray-900 border border-gray-700 p-6 rounded-lg">
                <h4 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-400" />
                  Risk Factors
                </h4>
                <ul className="space-y-2">
                  {trendData.riskFactors.map((risk, index) => (
                    <li key={index} className="text-sm text-gray-300 flex items-start gap-2">
                      <span className="text-yellow-400 mt-1">•</span>
                      {risk}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}