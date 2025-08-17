'use client';

import { DailyMetrics } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, DollarSign, Coins, Wallet, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { safeToFixed, safeToInt } from '@/lib/utils/number';

interface AgentEconomyProps {
  metrics?: DailyMetrics[];
}

export function AgentEconomy({ metrics }: AgentEconomyProps) {
  if (!metrics || metrics.length === 0) {
    return (
      <Card className="terminal-box">
        <CardContent className="py-12 text-center text-eden-gray">
          No economic data available yet
        </CardContent>
      </Card>
    );
  }

  // Calculate aggregated stats
  const last7Days = metrics.slice(0, 7);
  const last30Days = metrics.slice(0, 30);
  
  const totalRevenue7d = last7Days.reduce((sum, m) => sum + m.revenuePrimary + m.revenueSecondary, 0);
  const totalRevenue30d = last30Days.reduce((sum, m) => sum + m.revenuePrimary + m.revenueSecondary, 0);
  const totalCosts7d = last7Days.reduce((sum, m) => sum + m.costs, 0);
  const totalCosts30d = last30Days.reduce((sum, m) => sum + m.costs, 0);
  
  const netProfit7d = totalRevenue7d - totalCosts7d;
  const netProfit30d = totalRevenue30d - totalCosts30d;
  
  const currentBalance = metrics[0]?.walletBalance || 0;
  const previousBalance = metrics[6]?.walletBalance || 0;
  const balanceChange = currentBalance - previousBalance;
  const balanceChangePercent = previousBalance > 0 ? (balanceChange / previousBalance) * 100 : 0;

  // Daily breakdown for chart
  const dailyData = last7Days.map(m => ({
    date: new Date(m.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    revenue: m.revenuePrimary + m.revenueSecondary,
    costs: m.costs,
    net: (m.revenuePrimary + m.revenueSecondary) - m.costs,
  })).reverse();

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="terminal-box">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs text-eden-gray uppercase">Wallet Balance</p>
                <p className="text-2xl font-mono">${safeToFixed(currentBalance)}</p>
                <div className={cn(
                  "flex items-center gap-1 text-xs font-mono",
                  balanceChange >= 0 ? "text-green-400" : "text-red-400"
                )}>
                  {balanceChange >= 0 ? (
                    <ArrowUpRight className="w-3 h-3" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3" />
                  )}
                  <span>{safeToFixed(Math.abs(balanceChangePercent), 1)}%</span>
                  <span className="text-eden-gray">7d</span>
                </div>
              </div>
              <Wallet className="w-8 h-8 text-eden-white/30" />
            </div>
          </CardContent>
        </Card>

        <Card className="terminal-box">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs text-eden-gray uppercase">Net Profit (7d)</p>
                <p className={cn(
                  "text-2xl font-mono",
                  netProfit7d >= 0 ? "text-green-400" : "text-red-400"
                )}>
                  {netProfit7d >= 0 ? '+' : ''}{safeToFixed(netProfit7d)}
                </p>
                <p className="text-xs text-eden-gray">
                  ${safeToFixed(totalRevenue7d)} - ${safeToFixed(totalCosts7d)}
                </p>
              </div>
              {netProfit7d >= 0 ? (
                <TrendingUp className="w-8 h-8 text-green-400/30" />
              ) : (
                <TrendingDown className="w-8 h-8 text-red-400/30" />
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Breakdown */}
      <Card className="terminal-box">
        <CardHeader>
          <CardTitle className="display-caps text-lg">Revenue Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 7 Day Stats */}
          <div className="space-y-3">
            <div className="text-sm text-eden-gray uppercase tracking-wider">Last 7 Days</div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs text-eden-gray">
                  <DollarSign className="w-3 h-3" />
                  <span>Revenue</span>
                </div>
                <p className="font-mono text-lg text-green-400">
                  ${safeToFixed(totalRevenue7d)}
                </p>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs text-eden-gray">
                  <Coins className="w-3 h-3" />
                  <span>Costs</span>
                </div>
                <p className="font-mono text-lg text-red-400">
                  ${safeToFixed(totalCosts7d)}
                </p>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs text-eden-gray">
                  <TrendingUp className="w-3 h-3" />
                  <span>Net</span>
                </div>
                <p className={cn(
                  "font-mono text-lg",
                  netProfit7d >= 0 ? "text-green-400" : "text-red-400"
                )}>
                  {netProfit7d >= 0 ? '+' : ''}{safeToFixed(netProfit7d)}
                </p>
              </div>
            </div>
          </div>

          {/* 30 Day Stats */}
          <div className="space-y-3 pt-4 border-t border-eden-white/20">
            <div className="text-sm text-eden-gray uppercase tracking-wider">Last 30 Days</div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs text-eden-gray">
                  <DollarSign className="w-3 h-3" />
                  <span>Revenue</span>
                </div>
                <p className="font-mono text-lg text-green-400">
                  ${safeToFixed(totalRevenue30d)}
                </p>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs text-eden-gray">
                  <Coins className="w-3 h-3" />
                  <span>Costs</span>
                </div>
                <p className="font-mono text-lg text-red-400">
                  ${safeToFixed(totalCosts30d)}
                </p>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs text-eden-gray">
                  <TrendingUp className="w-3 h-3" />
                  <span>Net</span>
                </div>
                <p className={cn(
                  "font-mono text-lg",
                  netProfit30d >= 0 ? "text-green-400" : "text-red-400"
                )}>
                  {netProfit30d >= 0 ? '+' : ''}{safeToFixed(netProfit30d)}
                </p>
              </div>
            </div>
          </div>

          {/* Daily Chart */}
          <div className="space-y-3 pt-4 border-t border-eden-white/20">
            <div className="text-sm text-eden-gray uppercase tracking-wider">Daily Activity</div>
            
            <div className="space-y-2">
              {dailyData.map((day, index) => (
                <div key={index} className="flex items-center gap-3 text-xs">
                  <span className="w-16 text-eden-gray">{day.date}</span>
                  
                  <div className="flex-1 flex items-center gap-2">
                    <div className="flex-1 h-4 bg-eden-white/10 rounded overflow-hidden relative">
                      <div 
                        className="absolute left-0 top-0 h-full bg-green-400/50"
                        style={{ width: `${Math.min((day.revenue / 200) * 100, 100)}%` }}
                      />
                      <div 
                        className="absolute left-0 top-0 h-full bg-red-400/50"
                        style={{ 
                          left: `${Math.min((day.revenue / 200) * 100, 100)}%`,
                          width: `${Math.min((day.costs / 200) * 100, 100)}%` 
                        }}
                      />
                    </div>
                    
                    <span className={cn(
                      "font-mono w-20 text-right",
                      day.net >= 0 ? "text-green-400" : "text-red-400"
                    )}>
                      {day.net >= 0 ? '+' : ''}{safeToInt(day.net)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}