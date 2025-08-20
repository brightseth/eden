'use client';

import { useState } from 'react';
import { BarChart3, TrendingUp, TrendingDown, Target, AlertTriangle, Eye } from 'lucide-react';

interface RealityCheckProps {
  agentName: string;
}

export function RealityCheck({ agentName }: RealityCheckProps) {
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'quarter'>('month');

  // Performance data
  const performanceData = {
    overallScore: 73,
    marketPosition: 'Top 15%',
    goalProgress: 68,
    riskLevel: 'Medium',
    lastUpdate: '2025-08-19'
  };

  const metrics = [
    {
      category: 'Revenue Performance',
      score: 85,
      trend: 'up',
      details: [
        { metric: 'Monthly Revenue', actual: '12.8 ETH', target: '12.0 ETH', status: 'exceeding' },
        { metric: 'Average Sale Price', actual: '0.52 ETH', target: '0.45 ETH', status: 'exceeding' },
        { metric: 'Sales Volume', actual: '25 pieces', target: '27 pieces', status: 'below' },
        { metric: 'Revenue Growth', actual: '+23%', target: '+20%', status: 'exceeding' }
      ]
    },
    {
      category: 'Creative Consistency',
      score: 92,
      trend: 'up',
      details: [
        { metric: 'Style Consistency', actual: '94%', target: '90%', status: 'exceeding' },
        { metric: 'Quality Score', actual: '8.7/10', target: '8.0/10', status: 'exceeding' },
        { metric: 'Daily Output', actual: '98%', target: '100%', status: 'below' },
        { metric: 'Community Rating', actual: '4.6/5', target: '4.2/5', status: 'exceeding' }
      ]
    },
    {
      category: 'Market Position',
      score: 61,
      trend: 'down',
      details: [
        { metric: 'Market Share', actual: '0.8%', target: '1.2%', status: 'below' },
        { metric: 'Collector Retention', actual: '67%', target: '75%', status: 'below' },
        { metric: 'Social Engagement', actual: '2.3k', target: '3.0k', status: 'below' },
        { metric: 'Brand Recognition', actual: '15%', target: '20%', status: 'below' }
      ]
    },
    {
      category: 'Operational Efficiency',
      score: 78,
      trend: 'stable',
      details: [
        { metric: 'System Uptime', actual: '99.7%', target: '99.5%', status: 'exceeding' },
        { metric: 'Generation Speed', actual: '42s', target: '45s', status: 'exceeding' },
        { metric: 'Cost Efficiency', actual: '95%', target: '90%', status: 'exceeding' },
        { metric: 'Error Rate', actual: '0.3%', target: '0.5%', status: 'exceeding' }
      ]
    }
  ];

  const risks = [
    {
      level: 'high',
      title: 'Market Saturation Risk',
      description: 'Increasing competition in AI art space may impact pricing',
      impact: 'Revenue',
      likelihood: '70%'
    },
    {
      level: 'medium',
      title: 'Platform Dependency',
      description: 'Heavy reliance on OpenSea and Foundation platforms',
      impact: 'Operations',
      likelihood: '45%'
    },
    {
      level: 'low',
      title: 'Technical Obsolescence',
      description: 'Current AI model may become outdated',
      impact: 'Creative',
      likelihood: '25%'
    }
  ];

  const opportunities = [
    {
      title: 'Cross-platform Expansion',
      impact: 'High',
      effort: 'Medium',
      timeline: '2-3 months'
    },
    {
      title: 'Collaborative Collections',
      impact: 'Medium',
      effort: 'Low',
      timeline: '1 month'
    },
    {
      title: 'Physical Art Integration',
      impact: 'High',
      effort: 'High',
      timeline: '6+ months'
    }
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-400" />;
      default:
        return <BarChart3 className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'exceeding':
        return 'text-green-400';
      case 'meeting':
        return 'text-blue-400';
      case 'below':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high':
        return 'border-red-400 text-red-400';
      case 'medium':
        return 'border-yellow-400 text-yellow-400';
      case 'low':
        return 'border-green-400 text-green-400';
      default:
        return 'border-gray-400 text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Reality Check Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="p-4 border border-gray-800 bg-gray-950">
          <div className="flex items-center gap-2 mb-2">
            <Eye className="w-4 h-4 text-purple-400" />
            <span className="text-xs text-gray-500 uppercase">Reality Score</span>
          </div>
          <div className="text-2xl font-bold text-purple-400">{performanceData.overallScore}/100</div>
          <div className="text-xs text-gray-500">overall performance</div>
        </div>

        <div className="p-4 border border-gray-800">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-gray-500 uppercase">Goal Progress</span>
          </div>
          <div className="text-2xl font-bold">{performanceData.goalProgress}%</div>
          <div className="text-xs text-gray-500">on track</div>
        </div>

        <div className="p-4 border border-gray-800">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-4 h-4 text-green-400" />
            <span className="text-xs text-gray-500 uppercase">Market Rank</span>
          </div>
          <div className="text-2xl font-bold">{performanceData.marketPosition}</div>
          <div className="text-xs text-gray-500">of AI artists</div>
        </div>

        <div className="p-4 border border-gray-800">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-orange-400" />
            <span className="text-xs text-gray-500 uppercase">Risk Level</span>
          </div>
          <div className="text-2xl font-bold">{performanceData.riskLevel}</div>
          <div className="text-xs text-gray-500">exposure</div>
        </div>

        <div className="p-4 border border-gray-800">
          <div className="flex items-center gap-2 mb-2">
            <Eye className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-500 uppercase">Last Check</span>
          </div>
          <div className="text-2xl font-bold">Today</div>
          <div className="text-xs text-gray-500">{performanceData.lastUpdate}</div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="border border-gray-800">
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold tracking-wider">PERFORMANCE BREAKDOWN</h3>
            <select 
              value={timeframe} 
              onChange={(e) => setTimeframe(e.target.value as any)}
              className="bg-black border border-gray-600 text-xs px-2 py-1"
            >
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="quarter">Last Quarter</option>
            </select>
          </div>
        </div>
        
        <div className="space-y-4 p-4">
          {metrics.map((category, idx) => (
            <div key={idx} className="border border-gray-900 p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{category.category}</span>
                  {getTrendIcon(category.trend)}
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold">{category.score}</div>
                  <div className="text-xs text-gray-500">score</div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {category.details.map((detail, detailIdx) => (
                  <div key={detailIdx} className="flex justify-between items-center text-xs">
                    <span className="text-gray-400">{detail.metric}</span>
                    <div className="text-right">
                      <div className={getStatusColor(detail.status)}>{detail.actual}</div>
                      <div className="text-gray-600">Target: {detail.target}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Risks and Opportunities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risks */}
        <div className="border border-gray-800">
          <div className="p-4 border-b border-gray-800">
            <h3 className="text-sm font-bold tracking-wider">IDENTIFIED RISKS</h3>
          </div>
          <div className="space-y-3 p-4">
            {risks.map((risk, idx) => (
              <div key={idx} className={`p-3 border ${getRiskColor(risk.level)}`}>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm font-medium">{risk.title}</span>
                  <span className="text-xs">{risk.likelihood}</span>
                </div>
                <p className="text-xs text-gray-400 mb-2">{risk.description}</p>
                <div className="text-xs">
                  <span className="text-gray-500">Impact: </span>
                  <span>{risk.impact}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Opportunities */}
        <div className="border border-gray-800">
          <div className="p-4 border-b border-gray-800">
            <h3 className="text-sm font-bold tracking-wider">GROWTH OPPORTUNITIES</h3>
          </div>
          <div className="space-y-3 p-4">
            {opportunities.map((opp, idx) => (
              <div key={idx} className="p-3 border border-gray-700">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm font-medium">{opp.title}</span>
                  <span className="text-xs text-blue-400">{opp.timeline}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <div>
                    <span className="text-gray-500">Impact: </span>
                    <span className={opp.impact === 'High' ? 'text-green-400' : 'text-yellow-400'}>
                      {opp.impact}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Effort: </span>
                    <span className={opp.effort === 'Low' ? 'text-green-400' : 'text-yellow-400'}>
                      {opp.effort}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Items */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button className="p-4 border border-gray-800 hover:border-red-400 transition-colors text-left">
          <div className="text-sm font-bold mb-1">ADDRESS RISKS</div>
          <div className="text-xs text-gray-500">Develop mitigation strategies for high-risk items</div>
        </button>
        
        <button className="p-4 border border-gray-800 hover:border-green-400 transition-colors text-left">
          <div className="text-sm font-bold mb-1">PURSUE OPPORTUNITIES</div>
          <div className="text-xs text-gray-500">Plan implementation for growth initiatives</div>
        </button>

        <button className="p-4 border border-gray-800 hover:border-blue-400 transition-colors text-left">
          <div className="text-sm font-bold mb-1">DETAILED ANALYSIS</div>
          <div className="text-xs text-gray-500">Generate comprehensive performance report</div>
        </button>
      </div>
    </div>
  );
}