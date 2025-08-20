'use client';

import { Coins, Users, Lock, TrendingUp, PieChart, Unlock } from 'lucide-react';
import { getAcademyStatus } from '@/utils/academy-dates';

interface TokensProps {
  agentName: string;
  graduationDate: string;
}

export function Tokens({ agentName, graduationDate }: TokensProps) {
  const academyStatus = getAcademyStatus(graduationDate);
  const tokenSymbol = agentName === 'ABRAHAM' ? '$ABRAHAM' : '$SOLIENNE';

  const tokenDistribution = [
    { holder: '$SPIRIT', percentage: 25, amount: '250,000,000', locked: true },
    { holder: 'EDEN', percentage: 25, amount: '250,000,000', locked: true },
    { holder: agentName, percentage: 25, amount: '250,000,000', locked: true },
    { holder: 'TRAINER', percentage: 25, amount: '250,000,000', locked: false }
  ];

  const holderAnalytics = {
    totalHolders: academyStatus.hasGraduated ? 312 : 0,
    whales: academyStatus.hasGraduated ? 8 : 0,
    avgHolding: academyStatus.hasGraduated ? '3,205,128' : '0',
    topHolder: academyStatus.hasGraduated ? '8.2%' : '0%'
  };

  const liquidityInfo = {
    status: academyStatus.hasGraduated ? 'active' : 'locked',
    pool: academyStatus.hasGraduated ? '100 ETH' : '0 ETH',
    volume24h: academyStatus.hasGraduated ? '42.3 ETH' : '0 ETH',
    price: academyStatus.hasGraduated ? '$0.00042' : 'TBD'
  };

  if (!academyStatus.hasGraduated) {
    return (
      <div className="space-y-6">
        {/* Pre-Launch Status */}
        <div className="border border-gray-800">
          <div className="p-6 text-center">
            <Lock className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">TOKEN LAUNCHES ON DAY 100</h3>
            <p className="text-gray-400 mb-6">
              {tokenSymbol} will automatically launch when {agentName} graduates from the academy
            </p>
            
            <div className="inline-block p-4 bg-gray-950 border border-gray-800">
              <p className="text-sm text-gray-500 mb-2">TIME UNTIL LAUNCH</p>
              <p className="text-3xl font-bold text-purple-400">
                {academyStatus.daysRemaining} DAYS
              </p>
              <p className="text-xs text-gray-500 mt-2">{academyStatus.graduationDate}</p>
            </div>

            <div className="mt-8 p-4 bg-purple-900/20 border border-purple-400/30">
              <p className="text-sm text-purple-400">
                Upon graduation, {agentName} becomes a Spirit and the token launches with
                initial liquidity, enabling revenue sharing for all token holders.
              </p>
            </div>
          </div>
        </div>

        {/* Token Distribution Preview */}
        <div className="border border-gray-800">
          <div className="p-4 border-b border-gray-800 bg-gray-950">
            <h3 className="text-sm font-bold tracking-wider">TOKEN DISTRIBUTION (AT LAUNCH)</h3>
          </div>
          <div className="p-6">
            <div className="mb-6">
              <p className="text-center text-2xl font-bold mb-2">1,000,000,000 {tokenSymbol}</p>
              <p className="text-center text-xs text-gray-500">TOTAL SUPPLY</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {tokenDistribution.map((item, idx) => (
                <div key={idx} className="p-4 bg-gray-950 border border-gray-800 text-center">
                  <div className="text-2xl font-bold mb-1">{item.percentage}%</div>
                  <div className="text-xs text-gray-500 mb-2">{item.holder}</div>
                  <div className="text-xs font-mono">{item.amount}</div>
                  {item.locked && (
                    <div className="mt-2">
                      <Lock className="w-3 h-3 text-gray-600 mx-auto" />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-4 text-center">
              <p className="text-xs text-gray-400">
                Locked allocations vest over 2 years after launch
              </p>
            </div>
          </div>
        </div>

        {/* Launch Checklist */}
        <div className="border border-gray-800">
          <div className="p-4 border-b border-gray-800 bg-gray-950">
            <h3 className="text-sm font-bold tracking-wider">LAUNCH READINESS</h3>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {[
                { task: 'Smart Contract Deployed', ready: academyStatus.currentDay >= 95 },
                { task: 'Initial Liquidity Reserved', ready: academyStatus.currentDay >= 90 },
                { task: 'Distribution Wallets Set', ready: academyStatus.currentDay >= 85 },
                { task: 'Revenue Share Configured', ready: academyStatus.currentDay >= 80 },
                { task: 'Exchange Listings Prepared', ready: false },
                { task: 'Launch Announcement Ready', ready: false }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-950 border border-gray-800">
                  <span className="text-sm">{item.task}</span>
                  {item.ready ? (
                    <span className="text-xs text-green-400 font-bold">READY</span>
                  ) : (
                    <span className="text-xs text-gray-600">PENDING</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Post-graduation token dashboard
  return (
    <div className="space-y-6">
      {/* Token Live Status */}
      <div className="p-6 bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-400/30">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold mb-2">{tokenSymbol} IS LIVE</h3>
            <p className="text-sm text-gray-400">
              Launched on {academyStatus.graduationDate} • Trading on Uniswap
            </p>
          </div>
          <Unlock className="w-8 h-8 text-purple-400" />
        </div>
      </div>

      {/* Token Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 border border-gray-800">
          <div className="flex items-center gap-2 mb-2">
            <Coins className="w-4 h-4 text-purple-400" />
            <span className="text-xs text-gray-500">PRICE</span>
          </div>
          <p className="text-xl font-bold">{liquidityInfo.price}</p>
          <p className="text-xs text-green-400">+12.4%</p>
        </div>

        <div className="p-4 border border-gray-800">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-gray-500">24H VOLUME</span>
          </div>
          <p className="text-xl font-bold">{liquidityInfo.volume24h}</p>
        </div>

        <div className="p-4 border border-gray-800">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-green-400" />
            <span className="text-xs text-gray-500">HOLDERS</span>
          </div>
          <p className="text-xl font-bold">{holderAnalytics.totalHolders}</p>
        </div>

        <div className="p-4 border border-gray-800">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs text-gray-500">LIQUIDITY</span>
          </div>
          <p className="text-xl font-bold">{liquidityInfo.pool}</p>
        </div>
      </div>

      {/* Holder Distribution */}
      <div className="border border-gray-800">
        <div className="p-4 border-b border-gray-800 bg-gray-950">
          <h3 className="text-sm font-bold tracking-wider">HOLDER ANALYTICS</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-bold">Distribution</h4>
                <PieChart className="w-4 h-4 text-gray-500" />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-950 border border-gray-800">
                  <span className="text-sm">Whales (&gt;1%)</span>
                  <span className="text-sm font-bold">{holderAnalytics.whales}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-950 border border-gray-800">
                  <span className="text-sm">Average Holding</span>
                  <span className="text-sm font-bold">{holderAnalytics.avgHolding}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-950 border border-gray-800">
                  <span className="text-sm">Top Holder</span>
                  <span className="text-sm font-bold">{holderAnalytics.topHolder}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-bold mb-4">Revenue Distribution</h4>
              <div className="p-4 bg-gray-950 border border-gray-800">
                <p className="text-xs text-gray-500 mb-2">TODAY\'S DISTRIBUTION</p>
                <p className="text-2xl font-bold text-green-400">0.335 ETH</p>
                <p className="text-xs text-gray-400 mt-2">
                  Distributed to {holderAnalytics.totalHolders} holders
                </p>
              </div>
              <div className="mt-3 p-3 bg-yellow-400/10 border border-yellow-400/30">
                <p className="text-xs text-yellow-400">
                  50% of all {agentName} sales revenue flows to token holders daily
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Vesting Schedule */}
      <div className="border border-gray-800">
        <div className="p-4 border-b border-gray-800 bg-gray-950">
          <h3 className="text-sm font-bold tracking-wider">VESTING SCHEDULE</h3>
        </div>
        <div className="p-6">
          <div className="space-y-3">
            {tokenDistribution.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-950 border border-gray-800">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium">{item.holder}</span>
                  <span className="text-xs text-gray-500">{item.amount} tokens</span>
                </div>
                <div className="flex items-center gap-2">
                  {item.locked ? (
                    <>
                      <Lock className="w-3 h-3 text-gray-600" />
                      <span className="text-xs text-gray-600">24 months</span>
                    </>
                  ) : (
                    <>
                      <Unlock className="w-3 h-3 text-green-400" />
                      <span className="text-xs text-green-400">UNLOCKED</span>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}