'use client';

import { useState } from 'react';
import { DollarSign, TrendingUp, TrendingDown, Target, PieChart } from 'lucide-react';

interface FinancialModelProps {
  agentName: string;
}

export function FinancialModel({ agentName }: FinancialModelProps) {
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'year'>('month');

  // Sample financial data
  const financialData = {
    totalRevenue: '47.3 ETH',
    monthlyRevenue: '12.8 ETH',
    averageAuction: '0.52 ETH',
    totalAuctions: 91,
    projectedYearOne: '156.4 ETH',
    treasuryBalance: '35.1 ETH',
    expenses: '2.2 ETH',
    netProfit: '45.1 ETH'
  };

  const revenueBreakdown = [
    { source: 'Daily Auctions', amount: '38.7 ETH', percentage: 82, color: 'bg-green-400' },
    { source: 'Special Collections', amount: '6.1 ETH', percentage: 13, color: 'bg-blue-400' },
    { source: 'Royalties', amount: '2.5 ETH', percentage: 5, color: 'bg-purple-400' }
  ];

  const monthlyData = [
    { month: 'Jul', revenue: 8.2, target: 10.0 },
    { month: 'Aug', revenue: 12.8, target: 12.0 },
    { month: 'Sep', revenue: 15.1, target: 14.0 },
    { month: 'Oct', revenue: 11.2, target: 16.0 }
  ];

  const expenses = [
    { category: 'Gas Fees', amount: '1.8 ETH', percentage: 82 },
    { category: 'Platform Fees', amount: '0.3 ETH', percentage: 14 },
    { category: 'Development', amount: '0.1 ETH', percentage: 4 }
  ];

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 border border-gray-800 bg-gray-950">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-green-400" />
            <span className="text-xs text-gray-500 uppercase">Total Revenue</span>
          </div>
          <div className="text-2xl font-bold text-green-400">{financialData.totalRevenue}</div>
          <div className="text-xs text-gray-500">lifetime</div>
        </div>

        <div className="p-4 border border-gray-800">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-gray-500 uppercase">This Month</span>
          </div>
          <div className="text-2xl font-bold">{financialData.monthlyRevenue}</div>
          <div className="text-xs text-gray-500">+23% vs last month</div>
        </div>

        <div className="p-4 border border-gray-800">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-purple-400" />
            <span className="text-xs text-gray-500 uppercase">Avg Auction</span>
          </div>
          <div className="text-2xl font-bold">{financialData.averageAuction}</div>
          <div className="text-xs text-gray-500">per piece</div>
        </div>

        <div className="p-4 border border-gray-800">
          <div className="flex items-center gap-2 mb-2">
            <PieChart className="w-4 h-4 text-orange-400" />
            <span className="text-xs text-gray-500 uppercase">Net Profit</span>
          </div>
          <div className="text-2xl font-bold">{financialData.netProfit}</div>
          <div className="text-xs text-gray-500">after expenses</div>
        </div>
      </div>

      {/* Revenue Breakdown */}
      <div className="border border-gray-800">
        <div className="p-4 border-b border-gray-800">
          <h3 className="text-sm font-bold tracking-wider">REVENUE BREAKDOWN</h3>
        </div>
        <div className="p-4 space-y-4">
          {revenueBreakdown.map((item, idx) => (
            <div key={idx} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">{item.source}</span>
                <div className="text-right">
                  <div className="text-sm font-bold">{item.amount}</div>
                  <div className="text-xs text-gray-500">{item.percentage}%</div>
                </div>
              </div>
              <div className="w-full bg-gray-900 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${item.color}`}
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Monthly Performance */}
      <div className="border border-gray-800">
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold tracking-wider">MONTHLY PERFORMANCE</h3>
            <select 
              value={timeframe} 
              onChange={(e) => setTimeframe(e.target.value as any)}
              className="bg-black border border-gray-600 text-xs px-2 py-1"
            >
              <option value="week">Last 7 Days</option>
              <option value="month">Last 4 Months</option>
              <option value="year">Year View</option>
            </select>
          </div>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-4 gap-4">
            {monthlyData.map((data, idx) => (
              <div key={idx} className="text-center">
                <div className="text-xs text-gray-500 mb-2">{data.month.toUpperCase()}</div>
                <div className="relative h-20 bg-gray-900 rounded mb-2">
                  <div 
                    className="absolute bottom-0 w-full bg-green-400 rounded"
                    style={{ height: `${(data.revenue / 20) * 100}%` }}
                  />
                  <div 
                    className="absolute w-full border-t border-gray-600"
                    style={{ bottom: `${(data.target / 20) * 100}%` }}
                  />
                </div>
                <div className="text-xs">
                  <div className="font-bold">{data.revenue} ETH</div>
                  <div className="text-gray-500">Target: {data.target}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Treasury & Expenses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border border-gray-800">
          <div className="p-4 border-b border-gray-800">
            <h3 className="text-sm font-bold tracking-wider">TREASURY STATUS</h3>
          </div>
          <div className="p-4 space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Current Balance</span>
              <span className="text-sm font-bold">{financialData.treasuryBalance}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Monthly Burn Rate</span>
              <span className="text-sm">0.7 ETH</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Runway</span>
              <span className="text-sm text-green-400">50+ months</span>
            </div>
            <div className="pt-2 border-t border-gray-800">
              <div className="text-xs text-gray-500">Treasury is well-funded for long-term operations</div>
            </div>
          </div>
        </div>

        <div className="border border-gray-800">
          <div className="p-4 border-b border-gray-800">
            <h3 className="text-sm font-bold tracking-wider">EXPENSE BREAKDOWN</h3>
          </div>
          <div className="p-4 space-y-3">
            {expenses.map((expense, idx) => (
              <div key={idx} className="flex justify-between items-center">
                <span className="text-sm">{expense.category}</span>
                <div className="text-right">
                  <div className="text-sm font-bold">{expense.amount}</div>
                  <div className="text-xs text-gray-500">{expense.percentage}%</div>
                </div>
              </div>
            ))}
            <div className="pt-2 border-t border-gray-800 flex justify-between">
              <span className="text-sm font-bold">Total Expenses</span>
              <span className="text-sm font-bold">{financialData.expenses}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Projections */}
      <div className="border border-gray-800">
        <div className="p-4 border-b border-gray-800">
          <h3 className="text-sm font-bold tracking-wider">YEAR ONE PROJECTIONS</h3>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border border-gray-900">
              <div className="text-2xl font-bold text-green-400">{financialData.projectedYearOne}</div>
              <div className="text-xs text-gray-500 mt-1">Projected Revenue</div>
            </div>
            <div className="text-center p-4 border border-gray-900">
              <div className="text-2xl font-bold">365</div>
              <div className="text-xs text-gray-500 mt-1">Daily Auctions</div>
            </div>
            <div className="text-center p-4 border border-gray-900">
              <div className="text-2xl font-bold text-blue-400">0.43 ETH</div>
              <div className="text-xs text-gray-500 mt-1">Target Avg/Day</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}