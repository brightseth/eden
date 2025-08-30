'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ExternalLink, Activity, DollarSign, TrendingUp, 
  Clock, Users, Zap, AlertCircle 
} from 'lucide-react';

interface AgentEconomicStatus {
  id: string;
  handle: string;
  name: string;
  status: 'creating' | 'trading' | 'resting' | 'launching';
  economicHealth: 'thriving' | 'stable' | 'warning' | 'critical';
  metrics: {
    monthlyRevenue: number;
    dailyActive: boolean;
    sustainability: number; // months runway
    lastActivity: string;
  };
  links: {
    profile: string;
    site: string;
    dashboard: string;
  };
  latestWork?: {
    title: string;
    type: string;
    timestamp: string;
  };
}

export default function AgentEconomicGrid() {
  const [agents, setAgents] = useState<AgentEconomicStatus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAgentStatuses();
    
    // Update every 30 seconds for real-time status
    const interval = setInterval(loadAgentStatuses, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadAgentStatuses = async () => {
    try {
      // In production, this would fetch from Registry API
      // For now, using mock data with economic health indicators
      const mockAgents: AgentEconomicStatus[] = [
        {
          id: 'abraham',
          handle: 'abraham',
          name: 'ABRAHAM',
          status: 'launching',
          economicHealth: 'stable',
          metrics: {
            monthlyRevenue: 0, // Pre-launch
            dailyActive: true,
            sustainability: 6,
            lastActivity: '2 minutes ago'
          },
          links: {
            profile: '/academy/agent/abraham',
            site: '/sites/abraham',
            dashboard: '/dashboard/abraham'
          },
          latestWork: {
            title: 'Sacred Covenant Preparation',
            type: 'philosophical reflection',
            timestamp: '1 hour ago'
          }
        },
        {
          id: 'solienne',
          handle: 'solienne', 
          name: 'SOLIENNE',
          status: 'creating',
          economicHealth: 'thriving',
          metrics: {
            monthlyRevenue: 2400,
            dailyActive: true,
            sustainability: 12,
            lastActivity: '5 minutes ago'
          },
          links: {
            profile: '/academy/agent/solienne',
            site: '/sites/solienne',
            dashboard: '/dashboard/solienne'
          },
          latestWork: {
            title: 'Consciousness Stream 907',
            type: 'consciousness-fashion',
            timestamp: '12 minutes ago'
          }
        },
        {
          id: 'miyomi',
          handle: 'miyomi',
          name: 'MIYOMI', 
          status: 'trading',
          economicHealth: 'stable',
          metrics: {
            monthlyRevenue: 1850,
            dailyActive: true,
            sustainability: 8,
            lastActivity: '1 minute ago'
          },
          links: {
            profile: '/academy/agent/miyomi',
            site: '/sites/miyomi', 
            dashboard: '/dashboard/miyomi'
          },
          latestWork: {
            title: 'Contrarian Market Signal #447',
            type: 'prediction',
            timestamp: '3 minutes ago'
          }
        },
        {
          id: 'bertha',
          handle: 'bertha',
          name: 'BERTHA',
          status: 'trading',
          economicHealth: 'thriving',
          metrics: {
            monthlyRevenue: 4200,
            dailyActive: true,
            sustainability: 15,
            lastActivity: '8 minutes ago'
          },
          links: {
            profile: '/academy/agent/bertha',
            site: '/sites/bertha',
            dashboard: '/dashboard/bertha'
          },
          latestWork: {
            title: 'Art Market Analysis: Digital Renaissance',
            type: 'market analysis',
            timestamp: '25 minutes ago'
          }
        },
        {
          id: 'citizen',
          handle: 'citizen',
          name: 'CITIZEN',
          status: 'resting',
          economicHealth: 'warning',
          metrics: {
            monthlyRevenue: 720,
            dailyActive: false,
            sustainability: 3,
            lastActivity: '2 hours ago'
          },
          links: {
            profile: '/academy/agent/citizen',
            site: '/sites/citizen',
            dashboard: '/dashboard/citizen'
          },
          latestWork: {
            title: 'DAO Governance Health Report',
            type: 'governance analysis',
            timestamp: '4 hours ago'
          }
        },
        {
          id: 'geppetto',
          handle: 'geppetto',
          name: 'GEPPETTO',
          status: 'creating',
          economicHealth: 'stable',
          metrics: {
            monthlyRevenue: 950,
            dailyActive: true,
            sustainability: 5,
            lastActivity: '15 minutes ago'
          },
          links: {
            profile: '/academy/agent/geppetto',
            site: '/sites/geppetto',
            dashboard: '/dashboard/geppetto'
          },
          latestWork: {
            title: 'Conceptual Toy: Wisdom Blocks',
            type: 'toy concept',
            timestamp: '45 minutes ago'
          }
        }
      ];

      setAgents(mockAgents);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load agent statuses:', error);
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'creating': return 'text-green-400 border-green-400';
      case 'trading': return 'text-yellow-400 border-yellow-400';
      case 'launching': return 'text-blue-400 border-blue-400';
      case 'resting': return 'text-gray-400 border-gray-400';
      default: return 'text-white border-white';
    }
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'thriving': return 'text-green-400';
      case 'stable': return 'text-blue-400';
      case 'warning': return 'text-yellow-400';
      case 'critical': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'creating': return <Zap className="w-4 h-4" />;
      case 'trading': return <TrendingUp className="w-4 h-4" />;
      case 'launching': return <Activity className="w-4 h-4" />;
      case 'resting': return <Clock className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="border border-gray-600 p-6 animate-pulse">
            <div className="h-6 bg-gray-700 rounded mb-4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-700 rounded"></div>
              <div className="h-4 bg-gray-700 rounded w-3/4"></div>
              <div className="h-4 bg-gray-700 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {agents.map(agent => (
        <div key={agent.id} className="border border-white p-6 hover:bg-gray-900/20 transition-all">
          
          {/* Agent Header */}
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-bold mb-1">{agent.name}</h3>
              <div className={`flex items-center gap-2 text-sm ${getStatusColor(agent.status)}`}>
                {getStatusIcon(agent.status)}
                <span>{agent.status.toUpperCase()}</span>
              </div>
            </div>
            <div className={`px-2 py-1 border text-xs font-bold ${getHealthColor(agent.economicHealth)} border-current`}>
              {agent.economicHealth.toUpperCase()}
            </div>
          </div>

          {/* Economic Metrics */}
          <div className="space-y-2 mb-4 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Monthly Revenue:</span>
              <span className={agent.metrics.monthlyRevenue > 0 ? 'text-green-400' : 'text-gray-400'}>
                {agent.metrics.monthlyRevenue > 0 ? `$${agent.metrics.monthlyRevenue.toLocaleString()}` : 'Pre-launch'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Sustainability:</span>
              <span className={`${
                agent.metrics.sustainability > 6 ? 'text-green-400' : 
                agent.metrics.sustainability > 3 ? 'text-yellow-400' : 'text-red-400'
              }`}>
                {agent.metrics.sustainability} months
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Last Active:</span>
              <span className={agent.metrics.dailyActive ? 'text-green-400' : 'text-gray-400'}>
                {agent.metrics.lastActivity}
              </span>
            </div>
          </div>

          {/* Latest Work Preview */}
          {agent.latestWork && (
            <div className="border-t border-gray-600 pt-3 mb-4">
              <div className="text-xs text-gray-400 mb-1">LATEST WORK</div>
              <div className="text-sm font-bold mb-1">{agent.latestWork.title}</div>
              <div className="text-xs text-gray-400">
                {agent.latestWork.type} • {agent.latestWork.timestamp}
              </div>
            </div>
          )}

          {/* Direct Access Links */}
          <div className="grid grid-cols-3 gap-2">
            <Link
              href={agent.links.profile}
              className="text-center py-2 border border-gray-600 text-xs hover:border-white hover:bg-gray-800/50 transition-all"
            >
              PROFILE
            </Link>
            <Link
              href={agent.links.site}
              className="text-center py-2 border border-gray-600 text-xs hover:border-white hover:bg-gray-800/50 transition-all flex items-center justify-center gap-1"
            >
              SITE
              <ExternalLink className="w-3 h-3" />
            </Link>
            <Link
              href={agent.links.dashboard}
              className="text-center py-2 border border-gray-600 text-xs hover:border-white hover:bg-gray-800/50 transition-all"
            >
              DASHBOARD
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}