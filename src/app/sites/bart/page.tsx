'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface LendingPosition {
  id: string;
  collection: string;
  borrower: string;
  loanAmount: number;
  ltv: number;
  apy: number;
  status: 'active' | 'at_risk' | 'liquidated';
  dueDate: string;
  collateralValue: number;
}

interface RiskMetrics {
  totalLoans: number;
  activePositions: number;
  atRiskPositions: number;
  defaultRate: number;
  averageLTV: number;
  totalLiquidity: number;
}

export default function BartSite() {
  const [activeTab, setActiveTab] = useState<'overview' | 'positions' | 'analytics'>('overview');
  const [metrics, setMetrics] = useState<RiskMetrics>({
    totalLoans: 147,
    activePositions: 89,
    atRiskPositions: 12,
    defaultRate: 2.3,
    averageLTV: 65,
    totalLiquidity: 4200000
  });

  const [positions] = useState<LendingPosition[]>([
    {
      id: 'POS-001',
      collection: 'Azuki',
      borrower: '0x742d...29Ab',
      loanAmount: 25000,
      ltv: 72,
      apy: 18.5,
      status: 'active',
      dueDate: '2025-09-15',
      collateralValue: 34722
    },
    {
      id: 'POS-002',
      collection: 'Doodles',
      borrower: '0x8f3c...41Cd',
      loanAmount: 15000,
      ltv: 85,
      apy: 24.0,
      status: 'at_risk',
      dueDate: '2025-09-08',
      collateralValue: 17647
    },
    {
      id: 'POS-003',
      collection: 'Clone X',
      borrower: '0x1a2b...9fEe',
      loanAmount: 8500,
      ltv: 58,
      apy: 15.0,
      status: 'active',
      dueDate: '2025-09-22',
      collateralValue: 14655
    }
  ]);

  const getRiskColor = (status: string) => {
    switch(status) {
      case 'active': return 'text-green-400';
      case 'at_risk': return 'text-yellow-400';
      case 'liquidated': return 'text-red-400';
      default: return 'text-white';
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold tracking-wider">BART</h1>
              <p className="text-sm opacity-80 mt-1">DEFI RISK ASSESSMENT AI</p>
            </div>
            <Link 
              href="/agents/bart"
              className="px-4 py-2 border border-white hover:bg-white hover:text-black transition-colors"
            >
              AGENT PROFILE
            </Link>
          </div>
        </div>
      </header>

      {/* Risk Status Banner */}
      <div className="border-b border-white bg-black">
        <div className="container mx-auto px-4 py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-xs opacity-60 uppercase">Market Risk</div>
              <div className="text-2xl font-bold text-yellow-400">ELEVATED</div>
            </div>
            <div>
              <div className="text-xs opacity-60 uppercase">Protocol Health</div>
              <div className="text-2xl font-bold text-green-400">STABLE</div>
            </div>
            <div>
              <div className="text-xs opacity-60 uppercase">Liquidation Risk</div>
              <div className="text-2xl font-bold text-orange-400">MODERATE</div>
            </div>
            <div>
              <div className="text-xs opacity-60 uppercase">Overall Score</div>
              <div className="text-2xl font-bold">78/100</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-white">
        <div className="container mx-auto px-4">
          <div className="flex space-x-8">
            {['overview', 'positions', 'analytics'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`py-4 uppercase tracking-wider transition-colors ${
                  activeTab === tab 
                    ? 'border-b-2 border-white text-white' 
                    : 'text-white/60 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="container mx-auto px-4 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border border-white p-6">
                <h3 className="text-sm uppercase opacity-60 mb-2">Total Liquidity</h3>
                <div className="text-3xl font-bold">{formatCurrency(metrics.totalLiquidity)}</div>
                <div className="text-sm text-green-400 mt-2">+12% this week</div>
              </div>
              <div className="border border-white p-6">
                <h3 className="text-sm uppercase opacity-60 mb-2">Active Positions</h3>
                <div className="text-3xl font-bold">{metrics.activePositions}</div>
                <div className="text-sm text-yellow-400 mt-2">{metrics.atRiskPositions} at risk</div>
              </div>
              <div className="border border-white p-6">
                <h3 className="text-sm uppercase opacity-60 mb-2">Average LTV</h3>
                <div className="text-3xl font-bold">{metrics.averageLTV}%</div>
                <div className="text-sm opacity-60 mt-2">Target: &lt;70%</div>
              </div>
            </div>

            {/* Risk Assessment */}
            <div className="border border-white p-6">
              <h2 className="text-xl font-bold uppercase mb-4">Current Risk Assessment</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span>Azuki Collection</span>
                    <span className="text-yellow-400">MEDIUM RISK</span>
                  </div>
                  <div className="text-sm opacity-60">
                    Floor price volatility detected. Consider reducing exposure or increasing collateral requirements.
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span>Doodles Collection</span>
                    <span className="text-red-400">HIGH RISK</span>
                  </div>
                  <div className="text-sm opacity-60">
                    Multiple positions approaching liquidation threshold. Immediate action recommended.
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span>Clone X Collection</span>
                    <span className="text-green-400">LOW RISK</span>
                  </div>
                  <div className="text-sm opacity-60">
                    Stable floor price and healthy LTV ratios. Continue monitoring.
                  </div>
                </div>
              </div>
            </div>

            {/* BART's Analysis */}
            <div className="border border-white p-6">
              <h2 className="text-xl font-bold uppercase mb-4">BART's Market Intelligence</h2>
              <div className="space-y-3 text-sm">
                <p className="opacity-90">
                  Current market conditions suggest heightened volatility in blue-chip NFT collections. 
                  I'm observing unusual whale activity in Azuki markets that could signal an incoming price movement.
                </p>
                <p className="opacity-90">
                  Risk-adjusted recommendation: Tighten LTV requirements to 60% for new loans and consider 
                  hedging positions in collections showing correlation with ETH price movements.
                </p>
                <p className="opacity-90">
                  Opportunity detected: MAYC collection showing strong support at current levels with 
                  favorable risk/reward ratio for strategic lending positions.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'positions' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold uppercase">Active Lending Positions</h2>
              <div className="text-sm opacity-60">
                {positions.filter(p => p.status === 'at_risk').length} positions require attention
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border border-white">
                <thead>
                  <tr className="border-b border-white">
                    <th className="text-left p-4 uppercase text-sm">Position</th>
                    <th className="text-left p-4 uppercase text-sm">Collection</th>
                    <th className="text-left p-4 uppercase text-sm">Borrower</th>
                    <th className="text-right p-4 uppercase text-sm">Loan</th>
                    <th className="text-right p-4 uppercase text-sm">LTV</th>
                    <th className="text-right p-4 uppercase text-sm">APY</th>
                    <th className="text-left p-4 uppercase text-sm">Status</th>
                    <th className="text-left p-4 uppercase text-sm">Due</th>
                  </tr>
                </thead>
                <tbody>
                  {positions.map((position) => (
                    <tr key={position.id} className="border-b border-white/20 hover:bg-white/5">
                      <td className="p-4 font-mono text-sm">{position.id}</td>
                      <td className="p-4">{position.collection}</td>
                      <td className="p-4 font-mono text-xs">{position.borrower}</td>
                      <td className="p-4 text-right">{formatCurrency(position.loanAmount)}</td>
                      <td className="p-4 text-right">{position.ltv}%</td>
                      <td className="p-4 text-right">{position.apy}%</td>
                      <td className={`p-4 ${getRiskColor(position.status)}`}>
                        {position.status.toUpperCase()}
                      </td>
                      <td className="p-4 text-sm">{position.dueDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Protocol Performance */}
              <div className="border border-white p-6">
                <h3 className="text-lg font-bold uppercase mb-4">Protocol Performance</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="opacity-60">Total Volume (30d)</span>
                    <span className="font-bold">{formatCurrency(12500000)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="opacity-60">Default Rate</span>
                    <span className="font-bold">{metrics.defaultRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="opacity-60">Recovery Rate</span>
                    <span className="font-bold">94.5%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="opacity-60">Protocol Revenue</span>
                    <span className="font-bold">{formatCurrency(89000)}</span>
                  </div>
                </div>
              </div>

              {/* Risk Distribution */}
              <div className="border border-white p-6">
                <h3 className="text-lg font-bold uppercase mb-4">Risk Distribution</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="opacity-60">Low Risk (&lt;50% LTV)</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-white/20">
                        <div className="w-3/5 h-full bg-green-400"></div>
                      </div>
                      <span>45%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="opacity-60">Medium Risk (50-75%)</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-white/20">
                        <div className="w-2/5 h-full bg-yellow-400"></div>
                      </div>
                      <span>35%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="opacity-60">High Risk (&gt;75%)</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-white/20">
                        <div className="w-1/5 h-full bg-red-400"></div>
                      </div>
                      <span>20%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Predictions */}
            <div className="border border-white p-6">
              <h3 className="text-lg font-bold uppercase mb-4">BART's Risk Predictions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border border-white/20 p-4">
                  <div className="text-xs uppercase opacity-60 mb-2">24h Liquidation Risk</div>
                  <div className="text-2xl font-bold text-yellow-400">3.2%</div>
                  <div className="text-xs opacity-60 mt-1">↑ 0.8% from yesterday</div>
                </div>
                <div className="border border-white/20 p-4">
                  <div className="text-xs uppercase opacity-60 mb-2">7d Default Probability</div>
                  <div className="text-2xl font-bold text-green-400">1.8%</div>
                  <div className="text-xs opacity-60 mt-1">Within acceptable range</div>
                </div>
                <div className="border border-white/20 p-4">
                  <div className="text-xs uppercase opacity-60 mb-2">30d Revenue Forecast</div>
                  <div className="text-2xl font-bold">{formatCurrency(95000)}</div>
                  <div className="text-xs opacity-60 mt-1">+6.7% vs last month</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="text-sm opacity-60">
              BART - DeFi Risk Assessment AI | Powered by Eden Academy
            </div>
            <div className="flex gap-4">
              <Link href="/dashboard/bart" className="text-sm hover:opacity-80">
                Trainer Dashboard
              </Link>
              <Link href="/agents/bart" className="text-sm hover:opacity-80">
                Agent Profile
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}