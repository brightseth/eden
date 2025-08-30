'use client';

import { useState, useEffect } from 'react';
import { 
  SustainabilityMetrics, 
  AgentBurnRate, 
  sustainabilityTracker,
  getAgentSustainability,
  getAgentAlerts 
} from '@/lib/economic/sustainability-tracker';
import { 
  EconomicMetrics,
  getAgentEconomics 
} from '@/lib/economic/payment-rails';
import { 
  FederationMetrics,
  getFederationHealth 
} from '@/lib/economic/cross-agent-economy';

interface SustainabilityDashboardProps {
  agentId: string;
  agentType: string;
}

export default function SustainabilityDashboard({ agentId, agentType }: SustainabilityDashboardProps) {
  const [sustainability, setSustainability] = useState<SustainabilityMetrics | null>(null);
  const [economics, setEconomics] = useState<EconomicMetrics | null>(null);
  const [burnRate, setBurnRate] = useState<AgentBurnRate | null>(null);
  const [alerts, setAlerts] = useState<Array<{ type: string; message: string; action?: string }>>([]);
  const [federationHealth, setFederationHealth] = useState<FederationMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    loadDashboardData();
    
    // Set up auto-refresh every 30 seconds for real-time monitoring
    const interval = setInterval(loadDashboardData, 30000);
    setRefreshInterval(interval);
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [agentId]);

  const loadDashboardData = async () => {
    try {
      const [sustData, econData, alertsData, fedData] = await Promise.all([
        getAgentSustainability(agentId),
        getAgentEconomics(agentId),
        getAgentAlerts(agentId),
        getFederationHealth()
      ]);

      const burnData = await sustainabilityTracker.calculateBurnRate(agentId);

      setSustainability(sustData);
      setEconomics(econData);
      setBurnRate(burnData);
      setAlerts(alertsData.alerts);
      setFederationHealth(fedData);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load sustainability data:', error);
      setLoading(false);
    }
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'critical': return 'text-red-400 bg-red-900/20 border-red-400';
      case 'warning': return 'text-yellow-400 bg-yellow-900/20 border-yellow-400';
      case 'stable': return 'text-blue-400 bg-blue-900/20 border-blue-400';
      case 'thriving': return 'text-green-400 bg-green-900/20 border-green-400';
      default: return 'text-white bg-gray-900/20 border-white';
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
      <div className="min-h-screen bg-black text-white p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-800 rounded mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-800 rounded border border-white/10"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8 font-mono">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {agentId.toUpperCase()} ECONOMIC HEALTH
          </h1>
          <p className="text-gray-400">
            Real-time sustainability monitoring • Last updated: {new Date().toLocaleTimeString()}
          </p>
        </div>

        {/* Alert System */}
        {alerts.length > 0 && (
          <div className="mb-8 space-y-4">
            <h2 className="text-xl font-bold text-white border-b border-white pb-2">
              SYSTEM ALERTS
            </h2>
            {alerts.map((alert, index) => (
              <div
                key={index}
                className={`p-4 border-l-4 ${getAlertColor(alert.type)} rounded-r`}
              >
                <div className="font-bold mb-1">
                  {alert.type.toUpperCase()}: {alert.message}
                </div>
                {alert.action && (
                  <div className="text-sm opacity-90">
                    Action Required: {alert.action}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Main Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          
          {/* Current Economic Status */}
          <div className="border border-white p-6">
            <h3 className="text-lg font-bold mb-4 border-b border-white pb-2">
              CURRENT STATUS
            </h3>
            {sustainability && (
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Monthly Revenue:</span>
                  <span className="text-green-400">
                    ${sustainability.current.monthlyRevenue.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Compute Costs:</span>
                  <span className="text-red-400">
                    ${sustainability.current.monthlyComputeCosts.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Infrastructure:</span>
                  <span className="text-yellow-400">
                    ${sustainability.current.monthlyInfrastructure.toLocaleString()}
                  </span>
                </div>
                <div className="border-t border-gray-600 pt-2">
                  <div className="flex justify-between font-bold">
                    <span>Net Profit:</span>
                    <span className={sustainability.current.netProfit >= 0 ? 'text-green-400' : 'text-red-400'}>
                      ${sustainability.current.netProfit.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span>Profit Margin:</span>
                    <span className={sustainability.current.profitMargin >= 0 ? 'text-green-400' : 'text-red-400'}>
                      {sustainability.current.profitMargin.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Risk Assessment */}
          <div className="border border-white p-6">
            <h3 className="text-lg font-bold mb-4 border-b border-white pb-2">
              RISK ASSESSMENT
            </h3>
            {sustainability && (
              <div className="space-y-3">
                <div className={`p-3 border rounded text-center font-bold ${getRiskColor(sustainability.forecast.riskLevel)}`}>
                  {sustainability.forecast.riskLevel.toUpperCase()}
                </div>
                <div className="flex justify-between">
                  <span>Runway:</span>
                  <span className="font-bold">
                    {sustainability.forecast.runway === 999 ? '∞' : `${sustainability.forecast.runway} months`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Break-even:</span>
                  <span className="text-yellow-400">
                    ${sustainability.forecast.breakEvenRevenue.toLocaleString()}/mo
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Growth Required:</span>
                  <span className={sustainability.forecast.growthRequired > 20 ? 'text-red-400' : 'text-green-400'}>
                    {sustainability.forecast.growthRequired.toFixed(0)}%
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Daily Burn Rate */}
          <div className="border border-white p-6">
            <h3 className="text-lg font-bold mb-4 border-b border-white pb-2">
              DAILY BURN RATE
            </h3>
            {burnRate && (
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Compute:</span>
                  <span className="text-red-400">
                    ${burnRate.dailyCompute.toFixed(2)}/day
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Infrastructure:</span>
                  <span className="text-yellow-400">
                    ${burnRate.dailyInfrastructure.toFixed(2)}/day
                  </span>
                </div>
                <div className="border-t border-gray-600 pt-2">
                  <div className="flex justify-between font-bold">
                    <span>Total Daily:</span>
                    <span className="text-red-400">
                      ${burnRate.dailyTotal.toFixed(2)}/day
                    </span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span>Sustainable Days:</span>
                    <span className={burnRate.sustainableDays < 30 ? 'text-red-400' : 'text-green-400'}>
                      {burnRate.sustainableDays} days
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Min Revenue:</span>
                    <span className="text-yellow-400">
                      ${burnRate.minimumDailyRevenue.toFixed(2)}/day
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Performance Trends */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          
          {/* Economic Trends */}
          <div className="border border-white p-6">
            <h3 className="text-lg font-bold mb-4 border-b border-white pb-2">
              PERFORMANCE TRENDS
            </h3>
            {sustainability && (
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Revenue Growth:</span>
                  <span className={sustainability.trends.revenueGrowth >= 0 ? 'text-green-400' : 'text-red-400'}>
                    {sustainability.trends.revenueGrowth > 0 ? '+' : ''}{sustainability.trends.revenueGrowth.toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Cost Growth:</span>
                  <span className={sustainability.trends.costGrowth <= 0 ? 'text-green-400' : 'text-red-400'}>
                    {sustainability.trends.costGrowth > 0 ? '+' : ''}{sustainability.trends.costGrowth.toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Efficiency:</span>
                  <span className={sustainability.trends.efficiency > 3 ? 'text-green-400' : sustainability.trends.efficiency > 1.5 ? 'text-yellow-400' : 'text-red-400'}>
                    ${sustainability.trends.efficiency.toFixed(2)} per compute $
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Federation Context */}
          <div className="border border-white p-6">
            <h3 className="text-lg font-bold mb-4 border-b border-white pb-2">
              FEDERATION HEALTH
            </h3>
            {federationHealth && (
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Total Volume:</span>
                  <span className="text-green-400">
                    ${federationHealth.totalVolume.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Active Agents:</span>
                  <span className="text-blue-400">
                    {federationHealth.activeAgents} agents
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Daily Transactions:</span>
                  <span className="text-yellow-400">
                    {federationHealth.dailyTransactions} today
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Sustainable Agents:</span>
                  <span className="text-green-400">
                    {federationHealth.economicHealth.sustainableAgents} agents
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Recommendations */}
        <div className="border border-white p-6">
          <h3 className="text-lg font-bold mb-4 border-b border-white pb-2">
            AI OPTIMIZATION RECOMMENDATIONS
          </h3>
          {sustainability && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Cost Optimization */}
              <div>
                <h4 className="font-bold text-yellow-400 mb-2">COST OPTIMIZATION</h4>
                <ul className="space-y-1 text-sm">
                  {sustainability.recommendations.costOptimization.map((rec, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-yellow-400 mr-2">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Revenue Growth */}
              <div>
                <h4 className="font-bold text-green-400 mb-2">REVENUE GROWTH</h4>
                <ul className="space-y-1 text-sm">
                  {sustainability.recommendations.revenueGrowth.map((rec, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-green-400 mr-2">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Emergency Actions */}
              {sustainability.recommendations.emergencyActions.length > 0 && (
                <div>
                  <h4 className="font-bold text-red-400 mb-2">EMERGENCY ACTIONS</h4>
                  <ul className="space-y-1 text-sm">
                    {sustainability.recommendations.emergencyActions.map((action, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-red-400 mr-2">⚠</span>
                        <span>{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Control Panel */}
        <div className="border border-white p-6 mt-8">
          <h3 className="text-lg font-bold mb-4 border-b border-white pb-2">
            CONTROL PANEL
          </h3>
          <div className="flex space-x-4">
            <button 
              onClick={loadDashboardData}
              className="border border-white px-4 py-2 hover:bg-white hover:text-black transition-colors"
            >
              REFRESH DATA
            </button>
            <button 
              onClick={() => {
                if (refreshInterval) {
                  clearInterval(refreshInterval);
                  setRefreshInterval(null);
                } else {
                  const interval = setInterval(loadDashboardData, 30000);
                  setRefreshInterval(interval);
                }
              }}
              className={`border px-4 py-2 transition-colors ${
                refreshInterval 
                  ? 'border-green-400 text-green-400 hover:bg-green-400 hover:text-black' 
                  : 'border-gray-400 text-gray-400 hover:bg-gray-400 hover:text-black'
              }`}
            >
              {refreshInterval ? 'AUTO-REFRESH ON' : 'AUTO-REFRESH OFF'}
            </button>
            <div className="border border-gray-600 px-4 py-2 text-gray-400">
              Agent Type: {agentType.toUpperCase()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}