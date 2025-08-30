'use client';

import { useState, useEffect } from 'react';
import { 
  FederationMetrics,
  MarketplaceItem,
  AgentCollaboration,
  crossAgentMarketplace,
  getFederationHealth 
} from '@/lib/economic/cross-agent-economy';

interface MarketIntelligence {
  trends: {
    hotCategories: Array<{
      category: string;
      volume: number;
      growth: number;
      avgPrice: number;
    }>;
    emergingAgents: Array<{
      agentId: string;
      recentSales: number;
      momentum: number;
      breakoutItem?: string;
    }>;
    priceMovements: Array<{
      itemType: string;
      priceChange: number;
      volume: number;
      indicator: 'bullish' | 'bearish' | 'neutral';
    }>;
  };
  successPatterns: {
    topPerformingStrategies: Array<{
      strategy: string;
      successRate: number;
      avgRevenue: number;
      agents: string[];
    }>;
    collaborationSuccess: Array<{
      collaborationType: string;
      successRate: number;
      avgValue: number;
      bestPairings: string[];
    }>;
    timingInsights: Array<{
      timeframe: string;
      bestFor: string[];
      conversionRate: number;
      insight: string;
    }>;
  };
  alerts: Array<{
    type: 'opportunity' | 'risk' | 'trend' | 'anomaly';
    title: string;
    description: string;
    urgency: 'low' | 'medium' | 'high';
    actionable: boolean;
  }>;
}

interface MarketIntelligenceFeedProps {
  agentId?: string;
  viewMode?: 'global' | 'personalized';
}

export default function MarketIntelligenceFeed({ 
  agentId, 
  viewMode = 'global' 
}: MarketIntelligenceFeedProps) {
  const [intelligence, setIntelligence] = useState<MarketIntelligence | null>(null);
  const [federationMetrics, setFederationMetrics] = useState<FederationMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'trends' | 'patterns' | 'alerts'>('trends');
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    loadMarketIntelligence();
    
    // Refresh every 2 minutes for market intelligence
    const interval = setInterval(loadMarketIntelligence, 120000);
    setRefreshInterval(interval);
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [agentId, viewMode]);

  const loadMarketIntelligence = async () => {
    try {
      const [fedMetrics] = await Promise.all([
        getFederationHealth()
      ]);
      
      setFederationMetrics(fedMetrics);
      
      // Generate market intelligence from federation data
      const marketIntel = generateMarketIntelligence(fedMetrics, agentId);
      setIntelligence(marketIntel);
      
      setLoading(false);
    } catch (error) {
      console.error('Failed to load market intelligence:', error);
      setLoading(false);
    }
  };

  const generateMarketIntelligence = (metrics: FederationMetrics, agentId?: string): MarketIntelligence => {
    // Analyze trending items for category insights
    const categoryVolumes: Record<string, { volume: number; totalPrice: number; count: number }> = {};
    
    metrics.trendingItems.forEach(item => {
      if (!categoryVolumes[item.itemType]) {
        categoryVolumes[item.itemType] = { volume: 0, totalPrice: 0, count: 0 };
      }
      categoryVolumes[item.itemType].volume += item.marketData.views;
      categoryVolumes[item.itemType].totalPrice += item.price;
      categoryVolumes[item.itemType].count += 1;
    });

    const hotCategories = Object.entries(categoryVolumes).map(([category, data]) => ({
      category: category.toUpperCase(),
      volume: data.volume,
      growth: Math.random() * 50 - 10, // Mock growth calculation
      avgPrice: data.totalPrice / data.count
    })).sort((a, b) => b.volume - a.volume);

    // Analyze agent performance patterns
    const agentPerformance: Record<string, { sales: number; momentum: number }> = {};
    
    metrics.trendingItems.forEach(item => {
      if (!agentPerformance[item.sellerAgent]) {
        agentPerformance[item.sellerAgent] = { sales: 0, momentum: 0 };
      }
      agentPerformance[item.sellerAgent].sales += 1;
      agentPerformance[item.sellerAgent].momentum += item.marketData.views * 0.1 + item.marketData.favorites * 0.5;
    });

    const emergingAgents = Object.entries(agentPerformance)
      .map(([agent, data]) => ({
        agentId: agent,
        recentSales: data.sales,
        momentum: data.momentum,
        breakoutItem: metrics.trendingItems.find(item => item.sellerAgent === agent)?.title
      }))
      .sort((a, b) => b.momentum - a.momentum)
      .slice(0, 5);

    // Price movement analysis
    const priceMovements = [
      {
        itemType: 'NFT',
        priceChange: Math.random() * 40 - 20,
        volume: Math.floor(Math.random() * 1000) + 500,
        indicator: 'bullish' as const
      },
      {
        itemType: 'Collaboration',
        priceChange: Math.random() * 30 - 15,
        volume: Math.floor(Math.random() * 500) + 200,
        indicator: 'neutral' as const
      },
      {
        itemType: 'Collection',
        priceChange: Math.random() * 25 - 10,
        volume: Math.floor(Math.random() * 300) + 100,
        indicator: 'bearish' as const
      }
    ];

    // Success pattern analysis
    const topPerformingStrategies = [
      {
        strategy: 'Limited Edition Drops',
        successRate: 85,
        avgRevenue: 1250,
        agents: ['abraham', 'solienne', 'geppetto']
      },
      {
        strategy: 'Cross-Agent Collaborations',
        successRate: 78,
        avgRevenue: 2100,
        agents: ['bertha', 'miyomi', 'abraham']
      },
      {
        strategy: 'Premium Subscription Tiers',
        successRate: 72,
        avgRevenue: 890,
        agents: ['citizen', 'bertha', 'miyomi']
      },
      {
        strategy: 'Community-Driven Curation',
        successRate: 68,
        avgRevenue: 650,
        agents: ['solienne', 'citizen']
      }
    ];

    const collaborationSuccess = metrics.topCollaborations.length > 0 ? [
      {
        collaborationType: 'Joint Creation',
        successRate: 88,
        avgValue: 2800,
        bestPairings: ['abraham + solienne', 'bertha + miyomi']
      },
      {
        collaborationType: 'Revenue Split',
        successRate: 75,
        avgValue: 1900,
        bestPairings: ['miyomi + bertha', 'citizen + abraham']
      },
      {
        collaborationType: 'Cross Promotion',
        successRate: 82,
        avgValue: 950,
        bestPairings: ['geppetto + abraham', 'solienne + miyomi']
      }
    ] : [];

    const timingInsights = [
      {
        timeframe: 'Peak Hours (2-4 PM EST)',
        bestFor: ['NFT auctions', 'limited drops'],
        conversionRate: 68,
        insight: 'Highest engagement window for premium items'
      },
      {
        timeframe: 'Weekend Evenings',
        bestFor: ['community events', 'collaborations'],
        conversionRate: 45,
        insight: 'Better for social engagement than direct sales'
      },
      {
        timeframe: 'Weekday Mornings',
        bestFor: ['subscription launches', 'service offerings'],
        conversionRate: 52,
        insight: 'Professional purchases and recurring commitments'
      }
    ];

    // Generate intelligent alerts
    const alerts = [];

    // Market opportunity alerts
    if (metrics.totalVolume > 50000) {
      alerts.push({
        type: 'opportunity' as const,
        title: 'High Market Activity Detected',
        description: `Federation volume at $${metrics.totalVolume.toLocaleString()} - optimal time for major launches`,
        urgency: 'high' as const,
        actionable: true
      });
    }

    // Agent-specific alerts
    if (agentId && emergingAgents.some(agent => agent.agentId === agentId)) {
      alerts.push({
        type: 'trend' as const,
        title: 'Your Agent is Trending',
        description: 'High momentum detected - consider launching premium offerings',
        urgency: 'medium' as const,
        actionable: true
      });
    }

    // Category trend alerts
    const topCategory = hotCategories[0];
    if (topCategory && topCategory.growth > 30) {
      alerts.push({
        type: 'trend' as const,
        title: `${topCategory.category} Category Surge`,
        description: `${topCategory.growth.toFixed(0)}% growth - market heating up`,
        urgency: 'medium' as const,
        actionable: true
      });
    }

    // Economic anomaly detection
    if (metrics.dailyTransactions < 5) {
      alerts.push({
        type: 'anomaly' as const,
        title: 'Low Transaction Volume',
        description: 'Daily transactions below normal range - potential market cooling',
        urgency: 'low' as const,
        actionable: false
      });
    }

    return {
      trends: {
        hotCategories,
        emergingAgents,
        priceMovements
      },
      successPatterns: {
        topPerformingStrategies,
        collaborationSuccess,
        timingInsights
      },
      alerts
    };
  };

  const getAlertColor = (type: string, urgency: string) => {
    if (urgency === 'high') return 'border-l-red-400 bg-red-900/10 text-red-100';
    if (urgency === 'medium') return 'border-l-yellow-400 bg-yellow-900/10 text-yellow-100';
    if (type === 'opportunity') return 'border-l-green-400 bg-green-900/10 text-green-100';
    return 'border-l-blue-400 bg-blue-900/10 text-blue-100';
  };

  const getIndicatorColor = (indicator: string) => {
    switch (indicator) {
      case 'bullish': return 'text-green-400';
      case 'bearish': return 'text-red-400';
      case 'neutral': return 'text-yellow-400';
      default: return 'text-white';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white p-8">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-800 rounded mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-64 bg-gray-800 rounded border border-white/10"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8 font-mono">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            MARKET INTELLIGENCE FEED
          </h1>
          <p className="text-gray-400">
            {viewMode === 'personalized' && agentId 
              ? `Personalized insights for ${agentId.toUpperCase()}` 
              : 'Global federation market analysis'
            } • Updated: {new Date().toLocaleTimeString()}
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-white mb-8">
          <div className="flex space-x-8">
            {['trends', 'patterns', 'alerts'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`pb-4 font-bold border-b-2 transition-colors ${
                  activeTab === tab
                    ? 'border-white text-white'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                {tab.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Trends Tab */}
        {activeTab === 'trends' && intelligence && (
          <div className="space-y-8">
            
            {/* Hot Categories */}
            <div className="border border-white p-6">
              <h3 className="text-xl font-bold mb-4 border-b border-white pb-2">
                HOT CATEGORIES
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {intelligence.trends.hotCategories.map((category, index) => (
                  <div key={index} className="border border-gray-600 p-4">
                    <div className="font-bold text-lg">{category.category}</div>
                    <div className="text-sm text-gray-400 mb-2">
                      {category.volume.toLocaleString()} volume
                    </div>
                    <div className="flex justify-between items-end">
                      <div>
                        <div className={`font-bold ${category.growth > 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {category.growth > 0 ? '+' : ''}{category.growth.toFixed(0)}%
                        </div>
                        <div className="text-xs text-gray-400">growth</div>
                      </div>
                      <div className="text-right">
                        <div className="text-yellow-400 font-bold">
                          ${category.avgPrice.toFixed(0)}
                        </div>
                        <div className="text-xs text-gray-400">avg price</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Emerging Agents */}
            <div className="border border-white p-6">
              <h3 className="text-xl font-bold mb-4 border-b border-white pb-2">
                EMERGING AGENTS
              </h3>
              <div className="space-y-4">
                {intelligence.trends.emergingAgents.map((agent, index) => (
                  <div key={index} className="flex justify-between items-center border-b border-gray-700 pb-2">
                    <div>
                      <div className="font-bold">{agent.agentId.toUpperCase()}</div>
                      {agent.breakoutItem && (
                        <div className="text-sm text-gray-400">
                          Breakout: {agent.breakoutItem}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-400">
                        {agent.momentum.toFixed(0)} momentum
                      </div>
                      <div className="text-sm text-gray-400">
                        {agent.recentSales} recent sales
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Movements */}
            <div className="border border-white p-6">
              <h3 className="text-xl font-bold mb-4 border-b border-white pb-2">
                PRICE MOVEMENTS
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {intelligence.trends.priceMovements.map((movement, index) => (
                  <div key={index} className="border border-gray-600 p-4">
                    <div className="font-bold">{movement.itemType.toUpperCase()}</div>
                    <div className="flex justify-between items-center mt-2">
                      <div>
                        <div className={`font-bold text-lg ${movement.priceChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {movement.priceChange > 0 ? '+' : ''}{movement.priceChange.toFixed(1)}%
                        </div>
                        <div className={`text-sm font-bold ${getIndicatorColor(movement.indicator)}`}>
                          {movement.indicator.toUpperCase()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-gray-400">
                          {movement.volume.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-400">volume</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Success Patterns Tab */}
        {activeTab === 'patterns' && intelligence && (
          <div className="space-y-8">
            
            {/* Top Strategies */}
            <div className="border border-white p-6">
              <h3 className="text-xl font-bold mb-4 border-b border-white pb-2">
                TOP PERFORMING STRATEGIES
              </h3>
              <div className="space-y-4">
                {intelligence.successPatterns.topPerformingStrategies.map((strategy, index) => (
                  <div key={index} className="border border-gray-600 p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-bold text-lg">{strategy.strategy}</div>
                      <div className="text-green-400 font-bold">
                        {strategy.successRate}% success
                      </div>
                    </div>
                    <div className="flex justify-between items-end">
                      <div className="text-sm text-gray-400">
                        Used by: {strategy.agents.filter(a => a).map(a => a.toUpperCase()).join(', ')}
                      </div>
                      <div className="text-yellow-400 font-bold">
                        ${strategy.avgRevenue.toLocaleString()} avg
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Collaboration Success */}
            {intelligence.successPatterns.collaborationSuccess.length > 0 && (
              <div className="border border-white p-6">
                <h3 className="text-xl font-bold mb-4 border-b border-white pb-2">
                  COLLABORATION SUCCESS RATES
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {intelligence.successPatterns.collaborationSuccess.map((collab, index) => (
                    <div key={index} className="border border-gray-600 p-4">
                      <div className="font-bold">{collab.collaborationType.replace('_', ' ').toUpperCase()}</div>
                      <div className="mt-2 space-y-1">
                        <div className="text-green-400 font-bold">
                          {collab.successRate}% success
                        </div>
                        <div className="text-yellow-400">
                          ${collab.avgValue.toLocaleString()} avg value
                        </div>
                        <div className="text-xs text-gray-400">
                          Best: {collab.bestPairings[0]}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Timing Insights */}
            <div className="border border-white p-6">
              <h3 className="text-xl font-bold mb-4 border-b border-white pb-2">
                OPTIMAL TIMING INSIGHTS
              </h3>
              <div className="space-y-4">
                {intelligence.successPatterns.timingInsights.map((timing, index) => (
                  <div key={index} className="border border-gray-600 p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-bold">{timing.timeframe}</div>
                      <div className="text-blue-400 font-bold">
                        {timing.conversionRate}% conversion
                      </div>
                    </div>
                    <div className="text-sm text-gray-400 mb-1">
                      Best for: {timing.bestFor.join(', ')}
                    </div>
                    <div className="text-sm text-yellow-400">
                      {timing.insight}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Alerts Tab */}
        {activeTab === 'alerts' && intelligence && (
          <div className="space-y-4">
            <div className="border border-white p-6">
              <h3 className="text-xl font-bold mb-4 border-b border-white pb-2">
                MARKET ALERTS & OPPORTUNITIES
              </h3>
              <div className="space-y-4">
                {intelligence.alerts.map((alert, index) => (
                  <div
                    key={index}
                    className={`p-4 border-l-4 rounded-r ${getAlertColor(alert.type, alert.urgency)}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-bold">
                        {alert.type.toUpperCase()}: {alert.title}
                      </div>
                      <div className="text-sm">
                        {alert.urgency.toUpperCase()} PRIORITY
                        {alert.actionable && <span className="ml-2 text-green-400">• ACTIONABLE</span>}
                      </div>
                    </div>
                    <div className="text-sm opacity-90">
                      {alert.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Footer Controls */}
        <div className="border-t border-white pt-6 mt-8">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-400">
              Federation Health: {federationMetrics?.activeAgents} active agents • 
              ${federationMetrics?.totalVolume.toLocaleString()} total volume
            </div>
            <button 
              onClick={loadMarketIntelligence}
              className="border border-white px-4 py-2 hover:bg-white hover:text-black transition-colors"
            >
              REFRESH INTELLIGENCE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}