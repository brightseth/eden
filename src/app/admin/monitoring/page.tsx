'use client';

import { useState, useEffect } from 'react';
import { registryClient } from '@/lib/registry/client';
import { Activity, TrendingUp, Users, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface SystemHealth {
  status: string;
  timestamp: string;
  services: {
    agentMonitoring: {
      status: string;
      activeAgents: number;
      recentMetrics: number;
    };
    applicationGateway: {
      status: string;
      recentApplications: number;
    };
  };
  registry: {
    version: string;
    environment: string;
    features: Record<string, boolean>;
  };
}

export default function MonitoringDashboard() {
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchHealth = async () => {
    try {
      setLoading(true);
      const healthData = await registryClient.getSystemHealth();
      setHealth(healthData);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch health data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'healthy':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'degraded':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'unhealthy':
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Activity className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'healthy':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'degraded':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'unhealthy':
      case 'error':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  if (loading && !health) {
    return (
      <div className="min-h-screen bg-black text-white p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Registry System Monitoring</h1>
          <div className="text-center py-16">
            <Activity className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-500" />
            <p className="text-lg">Loading system health...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Registry System Monitoring</h1>
          <div className="flex items-center gap-4">
            {lastUpdated && (
              <span className="text-sm text-gray-400">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </span>
            )}
            <button
              onClick={fetchHealth}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-900/20 border border-red-500 rounded-lg">
            <div className="flex items-center gap-2">
              <XCircle className="w-5 h-5 text-red-500" />
              <p className="text-red-400">Error: {error}</p>
            </div>
          </div>
        )}

        {health && (
          <div className="space-y-8">
            {/* Overall Status */}
            <div className="bg-gray-900 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                {getStatusIcon(health.status)}
                <h2 className="text-xl font-semibold">System Status</h2>
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(health.status)}`}>
                  {health.status.toUpperCase()}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-800 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-5 h-5 text-blue-400" />
                    <span className="font-medium">Active Agents</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-400">
                    {health.services?.agentMonitoring?.activeAgents || 0}
                  </p>
                </div>
                
                <div className="bg-gray-800 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                    <span className="font-medium">Recent Applications</span>
                  </div>
                  <p className="text-2xl font-bold text-green-400">
                    {health.services?.applicationGateway?.recentApplications || 0}
                  </p>
                </div>
                
                <div className="bg-gray-800 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="w-5 h-5 text-purple-400" />
                    <span className="font-medium">Version</span>
                  </div>
                  <p className="text-2xl font-bold text-purple-400">
                    {health.registry?.version || 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* Service Status */}
            <div className="bg-gray-900 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Service Health</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(health.services?.agentMonitoring?.status || 'unknown')}
                    <div>
                      <h3 className="font-medium">Agent Monitoring</h3>
                      <p className="text-sm text-gray-400">Performance tracking and health metrics</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(health.services?.agentMonitoring?.status || 'unknown')}`}>
                      {(health.services?.agentMonitoring?.status || 'unknown').toUpperCase()}
                    </span>
                    <p className="text-xs text-gray-400 mt-1">
                      {health.services?.agentMonitoring?.recentMetrics || 0} recent metrics
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(health.services?.applicationGateway?.status || 'unknown')}
                    <div>
                      <h3 className="font-medium">Application Gateway</h3>
                      <p className="text-sm text-gray-400">Routing and validation for applications</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(health.services?.applicationGateway?.status || 'unknown')}`}>
                      {(health.services?.applicationGateway?.status || 'unknown').toUpperCase()}
                    </span>
                    <p className="text-xs text-gray-400 mt-1">
                      {health.services?.applicationGateway?.recentApplications || 0} recent apps
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature Status */}
            {health.registry?.features && (
              <div className="bg-gray-900 rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Features</h2>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {Object.entries(health.registry.features).map(([feature, enabled]) => (
                    <div key={feature} className="bg-gray-800 p-3 rounded-lg text-center">
                      <div className="flex items-center justify-center mb-2">
                        {enabled ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-500" />
                        )}
                      </div>
                      <p className="text-sm font-medium capitalize">
                        {feature.replace(/([A-Z])/g, ' $1').trim()}
                      </p>
                      <p className="text-xs text-gray-400">
                        {enabled ? 'Enabled' : 'Disabled'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Environment Info */}
            <div className="bg-gray-900 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Environment</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Environment:</span>
                  <span className="ml-2 font-mono font-medium">
                    {health.registry?.environment || 'unknown'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Last Check:</span>
                  <span className="ml-2 font-mono font-medium">
                    {new Date(health.timestamp).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}