'use client';

import { TrendingUp, DollarSign, ArrowUpRight, ArrowDownRight, PieChart } from 'lucide-react';

interface FinancialsProps {
  agentName: string;
  graduationDate: string;
}

export function Financials({ agentName }: FinancialsProps) {
  const isAbraham = agentName === 'ABRAHAM';

  const todayRevenue = {
    sales: isAbraham ? '0.67 ETH' : '$1,250',
    platformFee: isAbraham ? '0.017 ETH' : '$31.25',
    treasury: isAbraham ? '0.318 ETH' : '$593.75',
    tokenHolders: isAbraham ? '0.335 ETH' : '$625'
  };

  const monthlyMetrics = {
    totalRevenue: isAbraham ? '18.4 ETH' : '$34,500',
    avgSalePrice: isAbraham ? '0.61 ETH' : '$287',
    totalSales: isAbraham ? 30 : 120,
    topSale: isAbraham ? '1.2 ETH' : '$450'
  };

  const treasury = {
    balance: isAbraham ? '47.3 ETH' : '$89,400',
    monthlyInflow: isAbraham ? '8.7 ETH' : '$16,387',
    operatingCosts: isAbraham ? '0.5 ETH' : '$2,100',
    netProfit: isAbraham ? '8.2 ETH' : '$14,287'
  };

  return (
    <div className="space-y-6">
      {/* Today\'s Revenue */}
      <div className="border border-gray-800">
        <div className="p-4 border-b border-gray-800 bg-gray-950">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold tracking-wider">TODAY\'S REVENUE</h3>
            <span className="text-xs text-gray-500">LIVE</span>
          </div>
        </div>
        <div className="p-6">
          <div className="text-center mb-6">
            <p className="text-xs text-gray-500 mb-2">TOTAL SALES</p>
            <p className="text-4xl font-bold text-green-400">{todayRevenue.sales}</p>
          </div>

          {/* Revenue Distribution Flow */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-gray-600 rounded-full" />
              <div className="flex-1 p-3 bg-gray-950 border border-gray-800">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs text-gray-500">PLATFORM FEE (2.5%)</p>
                    <p className="text-sm font-bold">{todayRevenue.platformFee}</p>
                  </div>
                  <ArrowDownRight className="w-4 h-4 text-gray-600" />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-blue-400 rounded-full" />
              <div className="flex-1 p-3 bg-gray-950 border border-gray-800">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs text-gray-500">TREASURY (47.5%)</p>
                    <p className="text-sm font-bold text-blue-400">{todayRevenue.treasury}</p>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-blue-400" />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-400 rounded-full" />
              <div className="flex-1 p-3 bg-gray-950 border border-gray-800">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs text-gray-500">TOKEN HOLDERS (50%)</p>
                    <p className="text-sm font-bold text-green-400">{todayRevenue.tokenHolders}</p>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-green-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 border border-gray-800">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span className="text-xs text-gray-500">MONTH TOTAL</span>
          </div>
          <p className="text-xl font-bold">{monthlyMetrics.totalRevenue}</p>
        </div>

        <div className="p-4 border border-gray-800">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-gray-500">AVG SALE</span>
          </div>
          <p className="text-xl font-bold">{monthlyMetrics.avgSalePrice}</p>
        </div>

        <div className="p-4 border border-gray-800">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs text-gray-500">TOTAL SALES</span>
          </div>
          <p className="text-xl font-bold">{monthlyMetrics.totalSales}</p>
        </div>

        <div className="p-4 border border-gray-800">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs text-gray-500">TOP SALE</span>
          </div>
          <p className="text-xl font-bold text-yellow-400">{monthlyMetrics.topSale}</p>
        </div>
      </div>

      {/* Treasury Management */}
      <div className="border border-gray-800">
        <div className="p-4 border-b border-gray-800 bg-gray-950">
          <h3 className="text-sm font-bold tracking-wider">TREASURY</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="mb-6">
                <p className="text-xs text-gray-500 mb-2">CURRENT BALANCE</p>
                <p className="text-3xl font-bold text-blue-400">{treasury.balance}</p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-800">
                  <span className="text-sm text-gray-500">Monthly Inflow</span>
                  <span className="text-sm font-bold text-green-400">+{treasury.monthlyInflow}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-800">
                  <span className="text-sm text-gray-500">Operating Costs</span>
                  <span className="text-sm font-bold text-red-400">-{treasury.operatingCosts}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-sm text-gray-500">Net Profit</span>
                  <span className="text-sm font-bold">{treasury.netProfit}</span>
                </div>
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-500 mb-3">COST BREAKDOWN</p>
              <div className="space-y-2">
                <div className="p-3 bg-gray-950 border border-gray-800">
                  <div className="flex justify-between items-center">
                    <span className="text-xs">Infrastructure</span>
                    <span className="text-xs font-bold">{isAbraham ? '0.2 ETH' : '$800'}</span>
                  </div>
                </div>
                <div className="p-3 bg-gray-950 border border-gray-800">
                  <div className="flex justify-between items-center">
                    <span className="text-xs">Gas Fees</span>
                    <span className="text-xs font-bold">{isAbraham ? '0.15 ETH' : 'N/A'}</span>
                  </div>
                </div>
                <div className="p-3 bg-gray-950 border border-gray-800">
                  <div className="flex justify-between items-center">
                    <span className="text-xs">{isAbraham ? 'Storage' : 'Printify Costs'}</span>
                    <span className="text-xs font-bold">{isAbraham ? '0.1 ETH' : '$1,200'}</span>
                  </div>
                </div>
                <div className="p-3 bg-gray-950 border border-gray-800">
                  <div className="flex justify-between items-center">
                    <span className="text-xs">Marketing</span>
                    <span className="text-xs font-bold">{isAbraham ? '0.05 ETH' : '$100'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Token Holder Earnings */}
      <div className="p-4 bg-gradient-to-r from-green-900/20 to-blue-900/20 border border-green-400/30">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-bold">TOKEN HOLDER EARNINGS CALCULATOR</h4>
          <PieChart className="w-4 h-4 text-green-400" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-gray-400 mb-1">If you hold 1% of tokens</p>
            <p className="text-lg font-bold text-green-400">
              {isAbraham ? '0.0034 ETH' : '$6.25'}/day
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">If you hold 5% of tokens</p>
            <p className="text-lg font-bold text-green-400">
              {isAbraham ? '0.017 ETH' : '$31.25'}/day
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">If you hold 10% of tokens</p>
            <p className="text-lg font-bold text-green-400">
              {isAbraham ? '0.034 ETH' : '$62.50'}/day
            </p>
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-3">
          Based on today\'s revenue. Actual earnings vary with daily sales.
        </p>
      </div>
    </div>
  );
}