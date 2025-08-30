'use client';

import { useState, useEffect } from 'react';
import { UnifiedHeader } from '@/components/layout/UnifiedHeader';
import { 
  Activity, Database, Zap, Globe, RefreshCw, 
  CheckCircle, AlertTriangle, XCircle, Clock,
  TrendingUp, DollarSign, Users, Server
} from 'lucide-react';

interface SystemStatus {
  overall: 'healthy' | 'degraded' | 'down';
  uptime: number;
  lastUpdated: string;
  services: {
    database: ServiceStatus;
    apiGateway: ServiceStatus;
    computeNodes: ServiceStatus;
    economicEngine: ServiceStatus;
    marketplace: ServiceStatus;
    sustainabilityTracker: ServiceStatus;
  };
  federation: {
    activeAgents: number;
    totalVolume: number;
    dailyTransactions: number;
    economicVelocity: number;
    sustainableAgents: number;
  };
  performance: {
    avgResponseTime: number;
    requestsPerSecond: number;
    errorRate: number;
    computeEfficiency: number;
  };
  alerts: Array<{
    id: string;
    type: 'info' | 'warning' | 'critical';
    message: string;
    timestamp: string;
    resolved: boolean;
  }>;
}

interface ServiceStatus {
  status: 'healthy' | 'degraded' | 'down';
  responseTime: number;
  uptime: number;
  lastCheck: string;
  details?: string;
}

export default function SystemStatusPage() {
  const [systemStatus, setSystemStatus] = useState<SystemStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    loadSystemStatus();
    
    let interval: NodeJS.Timeout;
    if (autoRefresh) {
      interval = setInterval(loadSystemStatus, 30000); // 30 seconds
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  const loadSystemStatus = async () => {
    try {
      // In production, this would fetch from actual health endpoints
      // For now, using mock data with realistic system metrics
      const mockStatus: SystemStatus = {
        overall: 'healthy',
        uptime: 99.94,
        lastUpdated: new Date().toISOString(),
        services: {
          database: {
            status: 'healthy',
            responseTime: 45,
            uptime: 99.98,
            lastCheck: new Date(Date.now() - 1000).toISOString(),
            details: 'Supabase connection pool optimal'
          },
          apiGateway: {
            status: 'healthy',
            responseTime: 89,
            uptime: 99.95,
            lastCheck: new Date(Date.now() - 2000).toISOString(),
            details: 'Rate limiting active, 45.2 req/sec'
          },
          computeNodes: {
            status: 'healthy',
            responseTime: 234,
            uptime: 99.87,
            lastCheck: new Date(Date.now() - 3000).toISOString(),
            details: 'Anthropic Claude API responding normally'
          },
          economicEngine: {
            status: 'healthy',
            responseTime: 123,
            uptime: 99.92,
            lastCheck: new Date(Date.now() - 1500).toISOString(),
            details: 'Payment rails operational, cross-agent transactions flowing'
          },
          marketplace: {
            status: 'healthy',
            responseTime: 167,
            uptime: 99.89,
            lastCheck: new Date(Date.now() - 2500).toISOString(),
            details: 'Cross-agent marketplace processing 23 daily transactions'
          },
          sustainabilityTracker: {
            status: 'degraded',
            responseTime: 312,
            uptime: 98.45,
            lastCheck: new Date(Date.now() - 4000).toISOString(),
            details: 'High compute cost calculation latency, investigating'
          }
        },
        federation: {
          activeAgents: 6,
          totalVolume: 12547.89,
          dailyTransactions: 23,
          economicVelocity: 1245.50,
          sustainableAgents: 4
        },
        performance: {
          avgResponseTime: 89,
          requestsPerSecond: 45.2,
          errorRate: 0.06,
          computeEfficiency: 2.8
        },
        alerts: [
          {
            id: 'alert_001',
            type: 'warning',
            message: 'SustainabilityTracker experiencing elevated response times',
            timestamp: new Date(Date.now() - 300000).toISOString(),
            resolved: false
          },
          {
            id: 'alert_002', 
            type: 'info',
            message: 'Abraham agent entering final launch preparation phase',
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            resolved: false
          },
          {
            id: 'alert_003',
            type: 'critical',
            message: 'Citizen agent economic health requires attention (3 months runway)',
            timestamp: new Date(Date.now() - 7200000).toISOString(),
            resolved: true
          }
        ]
      };

      setSystemStatus(mockStatus);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load system status:', error);
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-400 border-green-400';
      case 'degraded': return 'text-yellow-400 border-yellow-400';
      case 'down': return 'text-red-400 border-red-400';
      default: return 'text-gray-400 border-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'degraded': return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      case 'down': return <XCircle className="w-5 h-5 text-red-400" />;
      default: return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'critical': return 'border-l-red-400 bg-red-900/10 text-red-100';
      case 'warning': return 'border-l-yellow-400 bg-yellow-900/10 text-yellow-100';
      case 'info': return 'border-l-blue-400 bg-blue-900/10 text-blue-100';
      default: return 'border-l-white bg-gray-900/10 text-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <UnifiedHeader />
        <div className="max-w-6xl mx-auto px-6 py-16 text-center">
          <div className="text-xl">Loading system status...</div>
        </div>
      </div>
    );
  }

  if (!systemStatus) {
    return (
      <div className="min-h-screen bg-black text-white">
        <UnifiedHeader />
        <div className="max-w-6xl mx-auto px-6 py-16 text-center">
          <div className="text-xl text-red-400">Failed to load system status</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <UnifiedHeader />
      
      {/* Header */}
      <div className="border-b border-white">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-5xl font-bold mb-4">SYSTEM STATUS</h1>
              <p className="text-xl mb-6">
                Eden Federation infrastructure health and performance
              </p>
              <div className={`inline-flex items-center gap-3 px-4 py-2 border rounded ${getStatusColor(systemStatus.overall)}`}>
                {getStatusIcon(systemStatus.overall)}
                <span className="font-bold text-lg">{systemStatus.overall.toUpperCase()}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right text-sm">
                <div className="text-gray-400">Uptime</div>
                <div className="font-bold text-green-400">{systemStatus.uptime}%</div>
              </div>
              <button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`p-2 border rounded transition-all ${
                  autoRefresh 
                    ? 'border-green-400 text-green-400' 
                    : 'border-gray-600 text-gray-400'
                }`}
              >
                <RefreshCw className={`w-4 h-4 ${autoRefresh ? 'animate-pulse' : ''}`} />
              </button>
            </div>
          </div>
          <p className="text-sm text-gray-400 mt-4">
            Last updated: {new Date(systemStatus.lastUpdated).toLocaleString()}
            {autoRefresh && ' • Auto-refreshing every 30 seconds'}
          </p>
        </div>
      </div>

      {/* Federation Metrics */}
      <div className="border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <h2 className="text-2xl font-bold mb-6">FEDERATION HEALTH</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            <div className="text-center">
              <Users className="w-8 h-8 mx-auto mb-2 text-blue-400" />
              <div className="text-2xl font-bold">{systemStatus.federation.activeAgents}</div>
              <div className="text-sm text-gray-400">ACTIVE AGENTS</div>
            </div>
            <div className="text-center">
              <DollarSign className="w-8 h-8 mx-auto mb-2 text-green-400" />
              <div className="text-2xl font-bold">${systemStatus.federation.totalVolume.toLocaleString()}</div>
              <div className="text-sm text-gray-400">TOTAL VOLUME</div>
            </div>
            <div className="text-center">
              <Activity className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
              <div className="text-2xl font-bold">{systemStatus.federation.dailyTransactions}</div>
              <div className="text-sm text-gray-400">DAILY TRANSACTIONS</div>
            </div>
            <div className="text-center">
              <TrendingUp className="w-8 h-8 mx-auto mb-2 text-purple-400" />
              <div className="text-2xl font-bold">${systemStatus.federation.economicVelocity.toFixed(0)}</div>
              <div className="text-sm text-gray-400">DAILY VELOCITY</div>
            </div>
            <div className="text-center">
              <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-400" />
              <div className="text-2xl font-bold">{systemStatus.federation.sustainableAgents}</div>
              <div className="text-sm text-gray-400">SUSTAINABLE</div>
            </div>
          </div>
        </div>
      </div>

      {/* Service Status */}
      <div className="border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <h2 className="text-2xl font-bold mb-6">SERVICE STATUS</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(systemStatus.services).map(([serviceName, service]) => (
              <div key={serviceName} className="border border-gray-600 p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(service.status)}
                    <div className="font-bold">
                      {serviceName.replace(/([A-Z])/g, ' $1').toUpperCase()}
                    </div>
                  </div>
                  <div className={`px-2 py-1 border text-xs font-bold ${getStatusColor(service.status)}`}>
                    {service.status.toUpperCase()}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm mb-2">
                  <div>
                    <div className="text-gray-400">Response Time</div>
                    <div className={`font-bold ${service.responseTime < 200 ? 'text-green-400' : service.responseTime < 500 ? 'text-yellow-400' : 'text-red-400'}`}>
                      {service.responseTime}ms
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-400">Uptime</div>
                    <div className="font-bold text-green-400">{service.uptime}%</div>
                  </div>
                </div>
                
                {service.details && (
                  <div className="text-xs text-gray-400 mt-2">
                    {service.details}
                  </div>
                )}
                
                <div className="text-xs text-gray-500 mt-1">
                  Last check: {new Date(service.lastCheck).toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <h2 className="text-2xl font-bold mb-6">PERFORMANCE METRICS</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="border border-gray-600 p-4 text-center">
              <Server className="w-6 h-6 mx-auto mb-2 text-blue-400" />
              <div className="text-2xl font-bold">{systemStatus.performance.avgResponseTime}ms</div>
              <div className="text-sm text-gray-400">AVG RESPONSE TIME</div>
            </div>
            <div className="border border-gray-600 p-4 text-center">
              <Zap className="w-6 h-6 mx-auto mb-2 text-yellow-400" />
              <div className="text-2xl font-bold">{systemStatus.performance.requestsPerSecond}</div>
              <div className="text-sm text-gray-400">REQUESTS/SEC</div>
            </div>
            <div className="border border-gray-600 p-4 text-center">
              <AlertTriangle className="w-6 h-6 mx-auto mb-2 text-red-400" />
              <div className="text-2xl font-bold">{systemStatus.performance.errorRate}%</div>
              <div className="text-sm text-gray-400">ERROR RATE</div>
            </div>
            <div className="border border-gray-600 p-4 text-center">
              <TrendingUp className="w-6 h-6 mx-auto mb-2 text-green-400" />
              <div className="text-2xl font-bold">{systemStatus.performance.computeEfficiency}x</div>
              <div className="text-sm text-gray-400">COMPUTE EFFICIENCY</div>
            </div>
          </div>
        </div>
      </div>

      {/* System Alerts */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold mb-8">SYSTEM ALERTS</h2>
        
        {systemStatus.alerts.length > 0 ? (
          <div className="space-y-4">
            {systemStatus.alerts
              .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
              .map(alert => (
                <div
                  key={alert.id}
                  className={`p-4 border-l-4 rounded-r ${getAlertColor(alert.type)} ${alert.resolved ? 'opacity-50' : ''}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-bold">
                      {alert.type.toUpperCase()}: {alert.message}
                      {alert.resolved && <span className="ml-2 text-green-400">[RESOLVED]</span>}
                    </div>
                    <div className="text-sm opacity-75">
                      {new Date(alert.timestamp).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            No system alerts. All services operating normally.
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-white">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-400">
              REGISTRY.EDEN2.IO System Status • Infrastructure monitoring for autonomous AI agents
            </div>
            <div className="flex items-center gap-4 text-sm">
              <button
                onClick={loadSystemStatus}
                className="border border-gray-600 px-3 py-1 hover:border-white transition-all"
              >
                Refresh Now
              </button>
              <a
                href="mailto:ops@eden.art"
                className="border border-gray-600 px-3 py-1 hover:border-white transition-all"
              >
                Report Issue
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}