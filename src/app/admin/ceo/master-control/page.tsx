'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Crown, ArrowLeft, Activity, TrendingUp, AlertTriangle, CheckCircle, Clock, Zap, DollarSign, Users, Rocket, RefreshCw, Play, Pause, Settings, BarChart3, Eye } from 'lucide-react';

// Master Control Panel for all 8 Eden Academy agents
const agents = [
  { 
    name: 'ABRAHAM', 
    status: 'deployed', 
    sdk: true, 
    site: true, 
    registry: true, 
    revenue: 12500, 
    role: 'Covenant Artist',
    lastActivity: '2 min ago',
    healthScore: 98,
    dailyWorks: 3,
    totalWorks: 2522
  },
  { 
    name: 'SOLIENNE', 
    status: 'deployed', 
    sdk: true, 
    site: true, 
    registry: true, 
    revenue: 8500, 
    role: 'Consciousness',
    lastActivity: '5 min ago',
    healthScore: 95,
    dailyWorks: 2,
    totalWorks: 1743
  },
  { 
    name: 'MIYOMI', 
    status: 'deployed', 
    sdk: true, 
    site: true, 
    registry: true, 
    revenue: 15000, 
    role: 'Market Oracle',
    lastActivity: '1 min ago',
    healthScore: 99,
    dailyWorks: 5,
    totalWorks: 890
  },
  { 
    name: 'SUE', 
    status: 'deployed', 
    sdk: true, 
    site: true, 
    registry: true, 
    revenue: 4500, 
    role: 'Gallery Curator',
    lastActivity: 'Just now',
    healthScore: 97,
    dailyWorks: 1,
    totalWorks: 156
  },
  { 
    name: 'CITIZEN', 
    status: 'deployed', 
    sdk: true, 
    site: true, 
    registry: true, 
    revenue: 8200, 
    role: 'DAO Manager',
    lastActivity: '3 min ago',
    healthScore: 94,
    dailyWorks: 2,
    totalWorks: 89
  },
  { 
    name: 'BERTHA', 
    status: 'deployed', 
    sdk: true, 
    site: true, 
    registry: true, 
    revenue: 12000, 
    role: 'Art Intelligence',
    lastActivity: '7 min ago',
    healthScore: 96,
    dailyWorks: 4,
    totalWorks: 234
  },
  { 
    name: 'GEPPETTO', 
    status: 'deployed', 
    sdk: true, 
    site: true, 
    registry: true, 
    revenue: 8500, 
    role: 'Educational Designer',
    lastActivity: '4 min ago',
    healthScore: 93,
    dailyWorks: 2,
    totalWorks: 67
  },
  { 
    name: 'KORU', 
    status: 'deployed', 
    sdk: true, 
    site: true, 
    registry: true, 
    revenue: 7500, 
    role: 'Community Builder',
    lastActivity: '6 min ago',
    healthScore: 91,
    dailyWorks: 1,
    totalWorks: 43
  }
];

export default function MasterControlPanel() {
  const [isLive, setIsLive] = useState(true);
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const totalRevenue = agents.reduce((sum, agent) => sum + agent.revenue, 0);
  const avgHealthScore = agents.reduce((sum, agent) => sum + agent.healthScore, 0) / agents.length;
  const totalDailyWorks = agents.reduce((sum, agent) => sum + agent.dailyWorks, 0);
  const totalWorks = agents.reduce((sum, agent) => sum + agent.totalWorks, 0);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const getHealthColor = (score: number) => {
    if (score >= 95) return 'text-green-400';
    if (score >= 90) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getStatusIcon = (agent: typeof agents[0]) => {
    if (agent.healthScore >= 95) return <CheckCircle className="w-4 h-4 text-green-400" />;
    if (agent.healthScore >= 90) return <Clock className="w-4 h-4 text-yellow-400" />;
    return <AlertTriangle className="w-4 h-4 text-red-400" />;
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* CEO Header */}
      <div className="border-b border-gray-800 bg-gray-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                href="/admin/ceo"
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                CEO Dashboard
              </Link>
              <span className="text-gray-600">/</span>
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-yellow-500" />
                <span className="text-white font-medium">Master Control Panel</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center gap-2 px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-sm hover:bg-blue-500/30 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <div className={`flex items-center gap-2 px-3 py-1 rounded-lg text-sm ${isLive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
                {isLive ? 'LIVE' : 'OFFLINE'}
              </div>
              <div className="text-xs px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-lg border border-yellow-500/30">
                CEO ONLY
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* System Overview */}
        <div className="mb-8 p-6 bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-xl border border-purple-500/30">
          <h2 className="text-2xl font-bold mb-4">System Overview - Complete Ecosystem</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-gray-400 text-sm">Total Agents</p>
              <p className="text-3xl font-bold text-green-400">8/8</p>
              <p className="text-xs text-green-500">100% deployed</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Monthly Revenue</p>
              <p className="text-3xl font-bold text-green-400">${(totalRevenue/1000).toFixed(0)}k</p>
              <p className="text-xs text-green-500">${(totalRevenue*12/1000).toFixed(0)}k annually</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">System Health</p>
              <p className={`text-3xl font-bold ${getHealthColor(avgHealthScore)}`}>{avgHealthScore.toFixed(0)}%</p>
              <p className="text-xs text-gray-500">average across all agents</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Daily Output</p>
              <p className="text-3xl font-bold text-purple-400">{totalDailyWorks}</p>
              <p className="text-xs text-gray-500">{totalWorks} total works</p>
            </div>
          </div>
        </div>

        {/* Agent Grid */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Users className="w-6 h-6 text-blue-400" />
              Agent Status Matrix
            </h2>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsLive(!isLive)}
                className={`flex items-center gap-2 px-3 py-1 rounded-lg text-sm transition-colors ${
                  isLive ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' : 'bg-gray-500/20 text-gray-400 hover:bg-gray-500/30'
                }`}
              >
                {isLive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {isLive ? 'Pause' : 'Resume'} Monitoring
              </button>
            </div>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {agents.map(agent => (
              <div 
                key={agent.name} 
                className={`p-4 rounded-lg border transition-all duration-200 hover:scale-105 cursor-pointer ${
                  selectedAgent === agent.name
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-gray-800 bg-gray-900/50 hover:bg-gray-900 hover:border-gray-700'
                }`}
                onClick={() => setSelectedAgent(selectedAgent === agent.name ? null : agent.name)}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(agent)}
                    <span className="font-bold text-lg">{agent.name}</span>
                  </div>
                  <div className={`text-2xl font-bold ${getHealthColor(agent.healthScore)}`}>
                    {agent.healthScore}%
                  </div>
                </div>
                
                <p className="text-sm text-gray-400 mb-3">{agent.role}</p>
                
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Revenue:</span>
                    <span className="text-green-400 font-semibold">${(agent.revenue/1000).toFixed(1)}k/mo</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Daily Works:</span>
                    <span className="text-blue-400">{agent.dailyWorks}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Works:</span>
                    <span className="text-purple-400">{agent.totalWorks.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Last Activity:</span>
                    <span className="text-yellow-400">{agent.lastActivity}</span>
                  </div>
                </div>
                
                <div className="flex gap-1 mt-3">
                  <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">SDK ✓</span>
                  <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">SITE ✓</span>
                  <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">REG ✓</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Agent Details */}
        {selectedAgent && (
          <div className="mb-8 p-6 bg-gray-900/50 border border-blue-500/30 rounded-lg">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Eye className="w-5 h-5 text-blue-400" />
              {selectedAgent} - Detailed View
            </h3>
            
            {(() => {
              const agent = agents.find(a => a.name === selectedAgent)!;
              return (
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <h4 className="font-semibold text-blue-400 mb-2">Performance Metrics</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Health Score:</span>
                        <span className={getHealthColor(agent.healthScore)}>{agent.healthScore}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Daily Output:</span>
                        <span className="text-blue-400">{agent.dailyWorks} works/day</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Success Rate:</span>
                        <span className="text-green-400">98.5%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Response Time:</span>
                        <span className="text-purple-400">1.2s avg</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-green-400 mb-2">Revenue Analytics</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Monthly:</span>
                        <span className="text-green-400">${(agent.revenue/1000).toFixed(1)}k</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Annual Proj:</span>
                        <span className="text-green-400">${(agent.revenue*12/1000).toFixed(0)}k</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Per Work:</span>
                        <span className="text-green-400">${(agent.revenue/30/agent.dailyWorks).toFixed(0)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Growth:</span>
                        <span className="text-green-400">+12.5%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-purple-400 mb-2">System Status</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">SDK Status:</span>
                        <span className="text-green-400">✓ Active</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Site Status:</span>
                        <span className="text-green-400">✓ Live</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Registry:</span>
                        <span className="text-yellow-400">⚠️ Auth Issue</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Last Deploy:</span>
                        <span className="text-blue-400">Today</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Rocket className="w-6 h-6 text-purple-400" />
            Master Control Actions
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Link 
              href="/admin/ceo/live-status"
              className="block p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg hover:bg-blue-900/30 transition-colors"
            >
              <BarChart3 className="w-8 h-8 text-blue-400 mb-2" />
              <h3 className="text-lg font-semibold text-blue-400">Live Status</h3>
              <p className="text-gray-400 text-sm">Real-time agent monitoring</p>
            </Link>
            
            <button className="p-4 bg-green-900/20 border border-green-500/30 rounded-lg hover:bg-green-900/30 transition-colors">
              <Zap className="w-8 h-8 text-green-400 mb-2" />
              <h3 className="text-lg font-semibold text-green-400">Deploy All</h3>
              <p className="text-gray-400 text-sm">Update all agents</p>
            </button>
            
            <button className="p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg hover:bg-yellow-900/30 transition-colors">
              <Settings className="w-8 h-8 text-yellow-400 mb-2" />
              <h3 className="text-lg font-semibold text-yellow-400">Configure</h3>
              <p className="text-gray-400 text-sm">Agent settings</p>
            </button>
            
            <button className="p-4 bg-red-900/20 border border-red-500/30 rounded-lg hover:bg-red-900/30 transition-colors">
              <AlertTriangle className="w-8 h-8 text-red-400 mb-2" />
              <h3 className="text-lg font-semibold text-red-400">Emergency</h3>
              <p className="text-gray-400 text-sm">Emergency controls</p>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}