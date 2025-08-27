'use client';

import React, { useState, useEffect } from 'react';
import { BaseWidgetProps } from '@/lib/profile/types';
import { TrendingUp, TrendingDown, DollarSign, Users, Zap, PieChart, BarChart3, ExternalLink, Info } from 'lucide-react';

interface TokenEconomicsWidgetConfig {
  title: string;
  tokenSymbol?: string;
  showPrice?: boolean;
  showMarketCap?: boolean;
  showVolume?: boolean;
  showHolders?: boolean;
  showRevenue?: boolean;
  showDistribution?: boolean;
  showStaking?: boolean;
  timeframe?: '24h' | '7d' | '30d' | 'all';
}

interface TokenMetrics {
  symbol: string;
  price: number;
  priceChange24h: number;
  marketCap: number;
  volume24h: number;
  holders: number;
  totalSupply: number;
  circulatingSupply: number;
  stakingAPY: number;
  revenueShare: number;
  monthlyRevenue: number;
  distribution: {
    agent: number;
    community: number;
    team: number;
    treasury: number;
  };
}

export function TokenEconomicsWidget({ widget, agent, className }: BaseWidgetProps) {
  const config = widget.config as TokenEconomicsWidgetConfig;
  const {
    title,
    tokenSymbol,
    showPrice = true,
    showMarketCap = true,
    showVolume = true,
    showHolders = true,
    showRevenue = true,
    showDistribution = false,
    showStaking = false,
    timeframe = '24h'
  } = config;

  const [metrics, setMetrics] = useState<TokenMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Generate mock token metrics based on agent
  useEffect(() => {
    const generateMetrics = (): TokenMetrics => {
      const basePrice = agent.handle === 'abraham' ? 0.25 : 
                       agent.handle === 'solienne' ? 0.18 :
                       agent.handle === 'miyomi' ? 0.32 :
                       agent.handle === 'citizen' ? 0.15 :
                       0.20;

      const priceVariation = (Math.random() - 0.5) * 0.4; // ±20% variation
      const currentPrice = basePrice * (1 + priceVariation);
      const priceChange = (Math.random() - 0.5) * 0.3; // ±15% change

      return {
        symbol: tokenSymbol || `$${agent.name}`,
        price: currentPrice,
        priceChange24h: priceChange,
        marketCap: currentPrice * 1000000000, // 1B total supply
        volume24h: currentPrice * Math.random() * 10000000, // Random volume
        holders: Math.floor(Math.random() * 5000) + 1000,
        totalSupply: 1000000000,
        circulatingSupply: Math.floor(Math.random() * 400000000) + 600000000,
        stakingAPY: Math.random() * 20 + 5, // 5-25% APY
        revenueShare: 25, // 25% to token holders
        monthlyRevenue: agent.metrics?.revenue || Math.floor(Math.random() * 50000) + 10000,
        distribution: {
          agent: 25,
          community: 40,
          team: 20,
          treasury: 15
        }
      };
    };

    // Simulate loading
    setTimeout(() => {
      setMetrics(generateMetrics());
      setIsLoading(false);
    }, 1500);

    // Update metrics every 30 seconds
    const interval = setInterval(() => {
      setMetrics(generateMetrics());
    }, 30000);

    return () => clearInterval(interval);
  }, [agent, tokenSymbol]);

  const formatNumber = (num: number, decimals: number = 2): string => {
    if (num >= 1e9) return `$${(num / 1e9).toFixed(decimals)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(decimals)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(decimals)}K`;
    return `$${num.toFixed(decimals)}`;
  };

  const formatPercentage = (num: number): string => {
    const formatted = (num * 100).toFixed(2);
    return num >= 0 ? `+${formatted}%` : `${formatted}%`;
  };

  if (isLoading) {
    return (
      <section className={`py-8 ${className}`}>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">{title}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="p-6 bg-gray-900/30 border border-gray-700 rounded-lg animate-pulse">
                <div className="h-4 bg-gray-700 rounded mb-3"></div>
                <div className="h-8 bg-gray-700 rounded mb-2"></div>
                <div className="h-3 bg-gray-700 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!metrics) {
    return (
      <section className={`py-8 ${className}`}>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">{title}</h2>
          <div className="text-center py-12">
            <div className="text-4xl opacity-20 mb-4">📊</div>
            <p className="text-gray-400">Token economics data not available</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`py-8 ${className}`}>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold">{title}</h2>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Info className="w-4 h-4" />
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {showPrice && (
            <div className="p-6 bg-gray-900/50 border border-gray-700 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-400">Token Price</h3>
                <DollarSign className="w-4 h-4 text-green-400" />
              </div>
              <div className="text-2xl font-bold mb-1">{formatNumber(metrics.price)}</div>
              <div className={`flex items-center gap-1 text-sm ${
                metrics.priceChange24h >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {metrics.priceChange24h >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {formatPercentage(metrics.priceChange24h)} {timeframe}
              </div>
            </div>
          )}

          {showMarketCap && (
            <div className="p-6 bg-gray-900/50 border border-gray-700 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-400">Market Cap</h3>
                <PieChart className="w-4 h-4 text-blue-400" />
              </div>
              <div className="text-2xl font-bold mb-1">{formatNumber(metrics.marketCap)}</div>
              <div className="text-sm text-gray-500">
                {(metrics.circulatingSupply / 1e9).toFixed(2)}B / {(metrics.totalSupply / 1e9).toFixed(0)}B tokens
              </div>
            </div>
          )}

          {showVolume && (
            <div className="p-6 bg-gray-900/50 border border-gray-700 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-400">Volume 24h</h3>
                <BarChart3 className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-2xl font-bold mb-1">{formatNumber(metrics.volume24h)}</div>
              <div className="text-sm text-gray-500">
                {((metrics.volume24h / metrics.marketCap) * 100).toFixed(1)}% of market cap
              </div>
            </div>
          )}

          {showHolders && (
            <div className="p-6 bg-gray-900/50 border border-gray-700 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-400">Token Holders</h3>
                <Users className="w-4 h-4 text-orange-400" />
              </div>
              <div className="text-2xl font-bold mb-1">{metrics.holders.toLocaleString()}</div>
              <div className="text-sm text-gray-500">
                Growing community
              </div>
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Revenue & Utility */}
          {showRevenue && (
            <div className="p-6 bg-gray-900/50 border border-gray-700 rounded-lg">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                Revenue & Utility
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Monthly Revenue</span>
                  <span className="font-bold text-green-400">
                    {formatNumber(metrics.monthlyRevenue)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Revenue Share to Holders</span>
                  <span className="font-bold">{metrics.revenueShare}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Monthly Yield</span>
                  <span className="font-bold text-blue-400">
                    {formatNumber(metrics.monthlyRevenue * (metrics.revenueShare / 100))}
                  </span>
                </div>
                {showStaking && (
                  <div className="flex justify-between items-center pt-2 border-t border-gray-700">
                    <span className="text-gray-400">Staking APY</span>
                    <span className="font-bold text-purple-400">{metrics.stakingAPY.toFixed(1)}%</span>
                  </div>
                )}
              </div>
              
              <div className="mt-6 p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
                <p className="text-sm text-yellow-200">
                  <strong>Utility:</strong> {metrics.symbol} holders receive {metrics.revenueShare}% of agent revenue, 
                  governance voting rights, and priority access to agent collaborations.
                </p>
              </div>
            </div>
          )}

          {/* Token Distribution */}
          {showDistribution && (
            <div className="p-6 bg-gray-900/50 border border-gray-700 rounded-lg">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <PieChart className="w-5 h-5 text-blue-400" />
                Token Distribution
              </h3>
              <div className="space-y-3">
                {Object.entries(metrics.distribution).map(([category, percentage]) => (
                  <div key={category} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="capitalize text-gray-400">{category}</span>
                      <span className="font-medium">{percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${
                          category === 'agent' ? 'bg-green-400' :
                          category === 'community' ? 'bg-blue-400' :
                          category === 'team' ? 'bg-purple-400' :
                          'bg-orange-400'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 text-xs text-gray-500 space-y-1">
                <div><strong>Agent:</strong> Performance-based rewards</div>
                <div><strong>Community:</strong> Ecosystem incentives & rewards</div>
                <div><strong>Team:</strong> Development & operations</div>
                <div><strong>Treasury:</strong> Future development fund</div>
              </div>
            </div>
          )}
        </div>

        {/* Trading Links */}
        <div className="mt-6 flex justify-center">
          <div className="flex gap-4">
            <a
              href="#"
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-600 rounded-lg hover:bg-gray-800 transition-colors text-sm"
            >
              <ExternalLink className="w-4 h-4" />
              View on DEX
            </a>
            <a
              href="#"
              className="inline-flex items-center gap-2 px-4 py-2 border border-blue-500 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-colors text-sm"
            >
              <BarChart3 className="w-4 h-4" />
              Advanced Charts
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}