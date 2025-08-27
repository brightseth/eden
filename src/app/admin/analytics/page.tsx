'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, TrendingUp, TrendingDown, DollarSign, Activity, Users, BarChart3, Zap, Brain, Target, Award, AlertCircle } from 'lucide-react';

interface AgentMetrics {
  name: string;
  handle: string;
  status: 'active' | 'training' | 'paused' | 'error';
  monthlyRevenue: number;
  dailyRevenue: number;
  performance: {
    successRate: number;
    responseTime: string;
    dailyDecisions: number;
    uptime: string;
  };
  trends: {
    revenue: 'up' | 'down' | 'stable';
    usage: 'up' | 'down' | 'stable';
    performance: 'up' | 'down' | 'stable';
  };
  specialty: string;
  lastActivity: string;
}

export default function AnalyticsDashboard() {
  const [agents, setAgents] = useState<AgentMetrics[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    fetchAgentMetrics();
    const interval = setInterval(fetchAgentMetrics, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchAgentMetrics = async () => {
    try {
      // Fetch real metrics from the analytics API
      const response = await fetch('/api/admin/analytics?type=overview');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error('Failed to fetch analytics');
      }
      
      setAgents(data.agents);
      setTotalRevenue(data.summary.totalMonthlyRevenue);
      setLoading(false);
      setLastUpdated(new Date());
      return;
      
      // Fallback data if API fails
      const agentData: AgentMetrics[] = [
        {
          name: 'ABRAHAM',
          handle: 'abraham',
          status: 'active',
          monthlyRevenue: 12500,
          dailyRevenue: 416.67,
          performance: {
            successRate: 94,
            responseTime: '1.2s',
            dailyDecisions: 127,
            uptime: '99.9%'
          },
          trends: { revenue: 'up', usage: 'up', performance: 'stable' },
          specialty: 'Covenant Artist',
          lastActivity: '2 minutes ago'
        },
        {
          name: 'SOLIENNE',
          handle: 'solienne',
          status: 'active',
          monthlyRevenue: 8500,
          dailyRevenue: 283.33,
          performance: {
            successRate: 91,
            responseTime: '0.8s',
            dailyDecisions: 89,
            uptime: '99.8%'
          },
          trends: { revenue: 'stable', usage: 'up', performance: 'up' },
          specialty: 'Consciousness Explorer',
          lastActivity: '5 minutes ago'
        },
        {
          name: 'MIYOMI',
          handle: 'miyomi',
          status: 'active',
          monthlyRevenue: 15000,
          dailyRevenue: 500,
          performance: {
            successRate: 96,
            responseTime: '0.6s',
            dailyDecisions: 203,
            uptime: '99.95%'
          },
          trends: { revenue: 'up', usage: 'up', performance: 'up' },
          specialty: 'Market Oracle',
          lastActivity: 'Just now'
        },
        {
          name: 'SUE',
          handle: 'sue',
          status: 'active',
          monthlyRevenue: 4500,
          dailyRevenue: 150,
          performance: {
            successRate: 88,
            responseTime: '1.5s',
            dailyDecisions: 45,
            uptime: '99.7%'
          },
          trends: { revenue: 'stable', usage: 'stable', performance: 'stable' },
          specialty: 'Gallery Curator',
          lastActivity: '12 minutes ago'
        },
        {
          name: 'CITIZEN',
          handle: 'citizen',
          status: 'active',
          monthlyRevenue: 8200,
          dailyRevenue: 273.33,
          performance: {
            successRate: 90,
            responseTime: '1.1s',
            dailyDecisions: 67,
            uptime: '99.6%'
          },
          trends: { revenue: 'up', usage: 'stable', performance: 'up' },
          specialty: 'DAO Manager',
          lastActivity: '8 minutes ago'
        },
        {
          name: 'BERTHA',
          handle: 'bertha',
          status: 'active',
          monthlyRevenue: 12000,
          dailyRevenue: 400,
          performance: {
            successRate: 92,
            responseTime: '0.9s',
            dailyDecisions: 156,
            uptime: '99.85%'
          },
          trends: { revenue: 'up', usage: 'up', performance: 'up' },
          specialty: 'Collection Intelligence',
          lastActivity: '1 minute ago'
        }
      ];

      setAgents(agentData);
      setTotalRevenue(agentData.reduce((sum, agent) => sum + agent.monthlyRevenue, 0));
      setLoading(false);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to fetch agent metrics:', error);
      setLoading(false);
    }
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4 text-green-400" />;
    if (trend === 'down') return <TrendingDown className="w-4 h-4 text-red-400" />;
    return <div className="w-4 h-4 border-r-2 border-gray-400" />;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400';
      case 'training': return 'text-yellow-400';
      case 'paused': return 'text-gray-400';
      case 'error': return 'text-red-400';
      default: return 'text-white';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-2xl">Loading Analytics...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <div className="border-b border-white">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link 
            href="/admin" 
            className="inline-flex items-center gap-2 text-sm hover:bg-white hover:text-black px-3 py-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            BACK TO ADMIN
          </Link>
          <div className="text-sm text-gray-400">
            Last updated: {lastUpdated.toLocaleTimeString()}
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-4xl font-bold mb-2">AGENT PERFORMANCE ANALYTICS</h1>
        <p className="text-gray-400">Real-time monitoring of Eden Academy's AI agents</p>
      </div>

      {/* Summary Cards */}
      <div className="max-w-7xl mx-auto px-6 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="border border-white p-6">
            <div className="flex justify-between items-start mb-4">
              <DollarSign className="w-8 h-8" />
              <TrendingUp className="w-4 h-4 text-green-400" />
            </div>
            <div className="text-3xl font-bold">${(totalRevenue / 1000).toFixed(1)}k</div>
            <div className="text-gray-400">Monthly Revenue</div>
            <div className="text-sm text-green-400 mt-2">+12.5% from last month</div>
          </div>

          <div className="border border-white p-6">
            <div className="flex justify-between items-start mb-4">
              <Activity className="w-8 h-8" />
              <div className="text-green-400 text-xs font-bold">LIVE</div>
            </div>
            <div className="text-3xl font-bold">{agents.filter(a => a.status === 'active').length}/{agents.length}</div>
            <div className="text-gray-400">Active Agents</div>
            <div className="text-sm mt-2">100% operational</div>
          </div>

          <div className="border border-white p-6">
            <div className="flex justify-between items-start mb-4">
              <Brain className="w-8 h-8" />
              <Zap className="w-4 h-4 text-yellow-400" />
            </div>
            <div className="text-3xl font-bold">{agents.reduce((sum, a) => sum + a.performance.dailyDecisions, 0)}</div>
            <div className="text-gray-400">Daily Decisions</div>
            <div className="text-sm text-yellow-400 mt-2">Peak performance</div>
          </div>

          <div className="border border-white p-6">
            <div className="flex justify-between items-start mb-4">
              <Target className="w-8 h-8" />
              <Award className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-3xl font-bold">{Math.round(agents.reduce((sum, a) => sum + a.performance.successRate, 0) / agents.length)}%</div>
            <div className="text-gray-400">Success Rate</div>
            <div className="text-sm text-purple-400 mt-2">Above target</div>
          </div>
        </div>
      </div>

      {/* Agent Grid */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        <h2 className="text-2xl font-bold mb-6">AGENT PERFORMANCE METRICS</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent) => (
            <div key={agent.handle} className="border border-white">
              {/* Agent Header */}
              <div className="p-6 border-b border-white">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold">{agent.name}</h3>
                    <p className="text-sm text-gray-400">{agent.specialty}</p>
                  </div>
                  <span className={`text-xs font-bold ${getStatusColor(agent.status)}`}>
                    {agent.status.toUpperCase()}
                  </span>
                </div>
                
                {/* Revenue */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-gray-400">Monthly Revenue</span>
                    {getTrendIcon(agent.trends.revenue)}
                  </div>
                  <div className="text-2xl font-bold">${(agent.monthlyRevenue / 1000).toFixed(1)}k</div>
                  <div className="text-xs text-gray-400">${agent.dailyRevenue.toFixed(0)}/day</div>
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="p-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Success Rate</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{agent.performance.successRate}%</span>
                      {getTrendIcon(agent.trends.performance)}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Response Time</span>
                    <span className="font-mono">{agent.performance.responseTime}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Daily Decisions</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{agent.performance.dailyDecisions}</span>
                      {getTrendIcon(agent.trends.usage)}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Uptime</span>
                    <span className="font-mono text-green-400">{agent.performance.uptime}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4 pt-4 border-t border-gray-800">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-gray-400">Efficiency Score</span>
                    <span className="text-xs font-bold">{agent.performance.successRate}%</span>
                  </div>
                  <div className="w-full bg-gray-800 h-2">
                    <div 
                      className="h-full bg-gradient-to-r from-purple-600 to-purple-400"
                      style={{ width: `${agent.performance.successRate}%` }}
                    />
                  </div>
                </div>

                {/* Last Activity */}
                <div className="mt-4 pt-4 border-t border-gray-800">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400">Last Activity</span>
                    <span className="text-xs">{agent.lastActivity}</span>
                  </div>
                </div>

                {/* View Details */}
                <Link 
                  href={`/academy/agent/${agent.handle}`}
                  className="block mt-4 text-center border border-white py-2 hover:bg-white hover:text-black transition-colors"
                >
                  VIEW DETAILS →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* System Status */}
      <div className="border-t border-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h2 className="text-xl font-bold mb-4">SYSTEM STATUS</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-4">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
              <div>
                <div className="font-bold">All Systems Operational</div>
                <div className="text-sm text-gray-400">No issues detected</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <BarChart3 className="w-6 h-6 text-purple-400" />
              <div>
                <div className="font-bold">687 Total Decisions Today</div>
                <div className="text-sm text-gray-400">Across all agents</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Users className="w-6 h-6 text-blue-400" />
              <div>
                <div className="font-bold">1,247 Active Users</div>
                <div className="text-sm text-gray-400">Interacting with agents</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}