'use client';

import { useState, useEffect } from 'react';

interface RevenueMetrics {
  totalMRR: number;
  projectedMRR: number;
  totalSubscribers: number;
  tierDistribution: Record<string, number>;
  churnRate: number;
  averageRevenue: number;
  lifetimeValue: number;
  growthRate: number;
  conversionFunnel: {
    visitors: number;
    signups: number;
    freeUsers: number;
    paidUsers: number;
    conversionRate: number;
  };
  subscriberActivity: {
    dailyActiveUsers: number;
    weeklyActiveUsers: number;
    monthlyActiveUsers: number;
    averagePicksViewed: number;
    averageSessionDuration: number;
  };
}

export function RevenueDashboard() {
  const [metrics, setMetrics] = useState<RevenueMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month' | 'year'>('month');

  useEffect(() => {
    fetchMetrics();
  }, [timeRange]);

  const fetchMetrics = async () => {
    try {
      const response = await fetch('/api/miyomi/revenue', {
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_ADMIN_TOKEN}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setMetrics(data);
      }
    } catch (error) {
      console.error('Failed to fetch revenue metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="bg-black text-white p-8">Loading revenue metrics...</div>;
  }

  if (!metrics) {
    return <div className="bg-black text-white p-8">Failed to load metrics</div>;
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatPercent = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  return (
    <div className="bg-black text-white p-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">MIYOMI Revenue Dashboard</h2>
        <div className="flex space-x-2">
          {(['day', 'week', 'month', 'year'] as const).map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded ${
                timeRange === range 
                  ? 'bg-red-500 text-white' 
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-900 rounded-lg p-6">
          <div className="text-gray-400 text-sm mb-2">Monthly Recurring Revenue</div>
          <div className="text-3xl font-bold text-green-400">{formatCurrency(metrics.totalMRR)}</div>
          <div className="text-sm text-gray-400 mt-2">
            <span className="text-green-400">↑ {formatPercent(metrics.growthRate)}</span> vs last month
          </div>
        </div>

        <div className="bg-gray-900 rounded-lg p-6">
          <div className="text-gray-400 text-sm mb-2">Active Subscribers</div>
          <div className="text-3xl font-bold text-white">{metrics.totalSubscribers}</div>
          <div className="text-sm text-gray-400 mt-2">
            {metrics.conversionFunnel.paidUsers} paid users
          </div>
        </div>

        <div className="bg-gray-900 rounded-lg p-6">
          <div className="text-gray-400 text-sm mb-2">Avg Revenue Per User</div>
          <div className="text-3xl font-bold text-white">{formatCurrency(metrics.averageRevenue)}</div>
          <div className="text-sm text-gray-400 mt-2">
            LTV: {formatCurrency(metrics.lifetimeValue)}
          </div>
        </div>

        <div className="bg-gray-900 rounded-lg p-6">
          <div className="text-gray-400 text-sm mb-2">Churn Rate</div>
          <div className="text-3xl font-bold text-red-400">{formatPercent(metrics.churnRate)}</div>
          <div className="text-sm text-gray-400 mt-2">
            Monthly churn
          </div>
        </div>
      </div>

      {/* Tier Distribution */}
      <div className="bg-gray-900 rounded-lg p-6 mb-8">
        <h3 className="text-xl font-bold mb-4">Subscription Tier Distribution</h3>
        <div className="space-y-4">
          {Object.entries(metrics.tierDistribution).map(([tier, count]) => {
            const percentage = (count / metrics.totalSubscribers) * 100;
            return (
              <div key={tier}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{tier.replace('tier_', '').toUpperCase()}</span>
                  <span>{count} users ({percentage.toFixed(1)}%)</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div
                    className="bg-red-500 h-2 rounded-full"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Conversion Funnel */}
      <div className="bg-gray-900 rounded-lg p-6 mb-8">
        <h3 className="text-xl font-bold mb-4">Conversion Funnel</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span>Visitors</span>
            <span className="font-mono">{metrics.conversionFunnel.visitors.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Sign-ups</span>
            <span className="font-mono">{metrics.conversionFunnel.signups}</span>
          </div>
          <div className="flex justify-between">
            <span>Free Users</span>
            <span className="font-mono">{metrics.conversionFunnel.freeUsers}</span>
          </div>
          <div className="flex justify-between text-green-400 font-bold">
            <span>Paid Users</span>
            <span className="font-mono">{metrics.conversionFunnel.paidUsers}</span>
          </div>
          <div className="pt-2 border-t border-gray-700">
            <div className="flex justify-between">
              <span>Conversion Rate</span>
              <span className="text-green-400 font-bold">
                {formatPercent(metrics.conversionFunnel.conversionRate)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-900 rounded-lg p-6">
          <h3 className="text-lg font-bold mb-3">User Activity</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Daily Active</span>
              <span>{metrics.subscriberActivity.dailyActiveUsers}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Weekly Active</span>
              <span>{metrics.subscriberActivity.weeklyActiveUsers}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Monthly Active</span>
              <span>{metrics.subscriberActivity.monthlyActiveUsers}</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 rounded-lg p-6">
          <h3 className="text-lg font-bold mb-3">Engagement</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Avg Picks Viewed</span>
              <span>{metrics.subscriberActivity.averagePicksViewed}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Avg Session</span>
              <span>{Math.round(metrics.subscriberActivity.averageSessionDuration / 60)} min</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 rounded-lg p-6">
          <h3 className="text-lg font-bold mb-3">Projections</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Next Month MRR</span>
              <span className="text-green-400 font-bold">
                {formatCurrency(metrics.projectedMRR)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Growth Rate</span>
              <span>{formatPercent(metrics.growthRate)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}