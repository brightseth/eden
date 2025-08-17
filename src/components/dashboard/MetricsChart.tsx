'use client';

import { useState } from 'react';
import { DailyMetrics } from '@/types';
import { Line, LineChart, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { cn } from '@/lib/utils';

interface MetricsChartProps {
  metrics: DailyMetrics[];
  className?: string;
}

export function MetricsChart({ metrics, className }: MetricsChartProps) {
  const [timeRange, setTimeRange] = useState<7 | 30 | 90>(30);

  // Reverse to show oldest to newest
  const chartData = metrics
    .slice(0, timeRange)
    .reverse()
    .map(m => ({
      date: new Date(m.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      costs: m.costs,
      revenue: m.revenuePrimary + m.revenueSecondary,
      netPosition: (m.revenuePrimary + m.revenueSecondary - m.costs) || 0,
      followers: m.farcasterFollowers || 0,
    }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-eden-black border border-eden-white p-3">
          <p className="text-xs font-mono mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-xs" style={{ color: entry.color }}>
              {entry.name}: ${entry.value.toFixed(2)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className={cn('terminal-box p-6', className)}>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold display-caps">Economic Metrics</h3>
        <div className="flex gap-2">
          {[7, 30, 90].map((days) => (
            <button
              key={days}
              onClick={() => setTimeRange(days as 7 | 30 | 90)}
              className={cn(
                'px-3 py-1 text-xs font-mono border transition-all',
                timeRange === days
                  ? 'bg-eden-white text-eden-black border-eden-white'
                  : 'bg-transparent text-eden-gray border-eden-gray hover:border-eden-white'
              )}
            >
              {days}D
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <XAxis 
            dataKey="date" 
            stroke="#666666"
            style={{ fontSize: '10px', fontFamily: 'monospace' }}
          />
          <YAxis 
            stroke="#666666"
            style={{ fontSize: '10px', fontFamily: 'monospace' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{ fontSize: '12px', fontFamily: 'monospace' }}
          />
          <Line 
            type="monotone" 
            dataKey="costs" 
            stroke="#EF4444" 
            strokeWidth={2}
            dot={false}
            name="Costs"
          />
          <Line 
            type="monotone" 
            dataKey="revenue" 
            stroke="#10B981" 
            strokeWidth={2}
            dot={false}
            name="Revenue"
          />
          <Line 
            type="monotone" 
            dataKey="netPosition" 
            stroke="#00FFFF" 
            strokeWidth={1}
            strokeDasharray="5 5"
            dot={false}
            name="Net"
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t border-eden-white/10">
        <div>
          <div className="text-xs text-eden-gray">TOTAL COSTS</div>
          <div className="text-sm font-mono font-bold text-eden-economic">
            ${chartData.reduce((sum, d) => sum + d.costs, 0).toFixed(2)}
          </div>
        </div>
        <div>
          <div className="text-xs text-eden-gray">TOTAL REVENUE</div>
          <div className="text-sm font-mono font-bold text-eden-social">
            ${chartData.reduce((sum, d) => sum + d.revenue, 0).toFixed(2)}
          </div>
        </div>
        <div>
          <div className="text-xs text-eden-gray">NET POSITION</div>
          <div className={cn(
            'text-sm font-mono font-bold',
            chartData[chartData.length - 1]?.netPosition >= 0 ? 'text-eden-social' : 'text-eden-economic'
          )}>
            ${chartData[chartData.length - 1]?.netPosition.toFixed(2) || '0.00'}
          </div>
        </div>
        <div>
          <div className="text-xs text-eden-gray">FOLLOWERS</div>
          <div className="text-sm font-mono font-bold">
            {chartData[chartData.length - 1]?.followers || 0}
          </div>
        </div>
      </div>
    </div>
  );
}