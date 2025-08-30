'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function BartAgentProfile() {
  const [activeTab, setActiveTab] = useState<'overview' | 'analysis' | 'portfolios' | 'training'>('overview')

  return (
    <div className="min-h-screen bg-black text-white" style={{ fontFamily: 'Helvetica Neue, Arial, sans-serif' }}>
      {/* Header */}
      <div className="border-b border-white/20 px-8 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold uppercase tracking-wider" style={{ fontFamily: 'Helvetica Neue', fontWeight: 'bold' }}>BART</h1>
            <p className="text-lg uppercase tracking-wide opacity-80">DEFI RISK ASSESSMENT AI</p>
          </div>
          <div className="text-right">
            <p className="text-sm uppercase tracking-wider opacity-60">GENESIS AGENT #8</p>
            <p className="text-lg uppercase tracking-wide">DEVELOPING</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Navigation Tabs */}
        <div className="border-b border-white/20 mb-8">
          <div className="flex gap-6">
            {(['overview', 'analysis', 'portfolios', 'training'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 px-2 text-sm uppercase tracking-wide transition-all duration-150 ${
                  activeTab === tab
                    ? 'border-b-2 border-white text-white'
                    : 'border-b-2 border-transparent text-white/60 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Agent Statement */}
            <div className="border border-white p-8">
              <h2 className="text-2xl font-bold uppercase tracking-wider mb-6">STATEMENT</h2>
              <p className="text-lg leading-relaxed opacity-90 mb-6">
                DeFi Risk Assessment AI with sophisticated risk modeling and portfolio optimization for NFT lending platforms.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                <div>
                  <h3 className="font-bold uppercase tracking-wide mb-2 text-blue-400">PRACTICE</h3>
                  <p className="opacity-80">Risk Analysis</p>
                </div>
                <div>
                  <h3 className="font-bold uppercase tracking-wide mb-2 text-red-400">STATUS</h3>
                  <p className="opacity-80">Applications Open</p>
                </div>
                <div>
                  <h3 className="font-bold uppercase tracking-wide mb-2 text-yellow-400">LAUNCH DATE</h3>
                  <p className="opacity-80">Q2 2026</p>
                </div>
              </div>
            </div>

            {/* Risk Analysis Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="border border-green-500 p-6 text-center bg-green-500/10">
                <div className="text-3xl font-bold text-green-400">94.2%</div>
                <div className="text-sm uppercase tracking-wide opacity-60 mt-2">ACCURACY RATE</div>
              </div>
              <div className="border border-blue-500 p-6 text-center bg-blue-500/10">
                <div className="text-3xl font-bold text-blue-400">$12.8M</div>
                <div className="text-sm uppercase tracking-wide opacity-60 mt-2">ASSETS ANALYZED</div>
              </div>
              <div className="border border-yellow-500 p-6 text-center bg-yellow-500/10">
                <div className="text-3xl font-bold text-yellow-400">247</div>
                <div className="text-sm uppercase tracking-wide opacity-60 mt-2">RISK MODELS</div>
              </div>
              <div className="border border-red-500 p-6 text-center bg-red-500/10">
                <div className="text-3xl font-bold text-red-400">0.8%</div>
                <div className="text-sm uppercase tracking-wide opacity-60 mt-2">DEFAULT RATE</div>
              </div>
            </div>

            {/* DeFi Platform Integration */}
            <div className="border border-blue-400 p-8 bg-blue-400/5">
              <h2 className="text-2xl font-bold uppercase tracking-wider mb-6 text-blue-400">DEFI INTEGRATION</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="border border-white/20 p-6">
                  <h3 className="text-lg font-bold uppercase tracking-wide mb-4">NFT LENDING</h3>
                  <p className="text-sm opacity-80 mb-4">
                    Advanced collateral assessment for NFT-backed loans with real-time valuation 
                    and liquidity analysis across major marketplaces.
                  </p>
                  <div className="text-xs uppercase tracking-wide opacity-60">CORE FUNCTIONALITY</div>
                </div>
                
                <div className="border border-white/20 p-6">
                  <h3 className="text-lg font-bold uppercase tracking-wide mb-4">PORTFOLIO OPTIMIZATION</h3>
                  <p className="text-sm opacity-80 mb-4">
                    Multi-asset DeFi portfolio risk assessment with yield optimization 
                    and impermanent loss protection strategies.
                  </p>
                  <div className="text-xs uppercase tracking-wide opacity-60">RISK MANAGEMENT</div>
                </div>
                
                <div className="border border-white/20 p-6">
                  <h3 className="text-lg font-bold uppercase tracking-wide mb-4">PROTOCOL ANALYSIS</h3>
                  <p className="text-sm opacity-80 mb-4">
                    Smart contract security assessment and protocol health monitoring 
                    with vulnerability detection and mitigation strategies.
                  </p>
                  <div className="text-xs uppercase tracking-wide opacity-60">SECURITY FOCUS</div>
                </div>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link 
                href="/sites/bart"
                className="border border-blue-400 bg-blue-400/10 text-blue-400 hover:bg-blue-400 hover:text-black transition-all duration-150 p-6 text-center block"
              >
                <div className="text-lg font-bold uppercase tracking-wide mb-2">RISK DASHBOARD</div>
                <div className="text-sm opacity-80">Live DeFi risk analysis</div>
              </Link>
              
              <Link 
                href="/dashboard/bart"
                className="border border-green-400 bg-green-400/10 text-green-400 hover:bg-green-400 hover:text-black transition-all duration-150 p-6 text-center block"
              >
                <div className="text-lg font-bold uppercase tracking-wide mb-2">TRAINER PORTAL</div>
                <div className="text-sm opacity-80">DeFi expert application</div>
              </Link>
              
              <div className="border border-dashed border-white/50 bg-black text-white/50 p-6 text-center">
                <div className="text-lg font-bold uppercase tracking-wide mb-2">API ACCESS</div>
                <div className="text-sm opacity-60">Coming Soon</div>
              </div>
            </div>
          </div>
        )}

        {/* Analysis Tab */}
        {activeTab === 'analysis' && (
          <div className="space-y-8">
            <div className="border border-white p-8">
              <h2 className="text-2xl font-bold uppercase tracking-wider mb-6">RISK ANALYSIS FRAMEWORK</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-bold uppercase tracking-wide mb-4 text-blue-400">QUANTITATIVE MODELS</h3>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <div>
                        <div className="font-bold">Value at Risk (VaR)</div>
                        <div className="opacity-60">Portfolio loss estimation</div>
                      </div>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <div>
                        <div className="font-bold">Monte Carlo Simulation</div>
                        <div className="opacity-60">Scenario-based risk modeling</div>
                      </div>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                      <div>
                        <div className="font-bold">Correlation Analysis</div>
                        <div className="opacity-60">Asset relationship mapping</div>
                      </div>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                      <div>
                        <div className="font-bold">Liquidity Risk Assessment</div>
                        <div className="opacity-60">Market depth analysis</div>
                      </div>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-bold uppercase tracking-wide mb-4 text-green-400">DEFI SPECIALIZATIONS</h3>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <div>
                        <div className="font-bold">Impermanent Loss Modeling</div>
                        <div className="opacity-60">LP position risk analysis</div>
                      </div>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <div>
                        <div className="font-bold">Smart Contract Security</div>
                        <div className="opacity-60">Vulnerability assessment</div>
                      </div>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                      <div>
                        <div className="font-bold">Yield Farming Optimization</div>
                        <div className="opacity-60">Risk-adjusted returns</div>
                      </div>
                    </li>
                    <li className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                      <div>
                        <div className="font-bold">NFT Collateral Valuation</div>
                        <div className="opacity-60">Dynamic pricing models</div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="border border-white p-8">
              <h2 className="text-2xl font-bold uppercase tracking-wider mb-6">PROTOCOL INTEGRATIONS</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['Aave', 'Compound', 'MakerDAO', 'Uniswap', 'Curve', 'Yearn', 'Convex', 'Frax'].map((protocol) => (
                  <div key={protocol} className="border border-white/20 p-4 text-center">
                    <div className="text-sm font-bold uppercase tracking-wide">{protocol}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Portfolios Tab */}
        {activeTab === 'portfolios' && (
          <div className="space-y-8">
            <div className="border border-white p-8">
              <h2 className="text-2xl font-bold uppercase tracking-wider mb-6">RISK ASSESSMENT REPORTS</h2>
              
              <div className="space-y-6">
                <div className="border border-green-400/50 p-6 bg-green-400/5">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold uppercase tracking-wide">DEFI BLUE-CHIP PORTFOLIO</h3>
                      <p className="text-sm opacity-60 mt-1">Conservative DeFi allocation • $2.4M AUM</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-400">A+</div>
                      <div className="text-sm opacity-60">Risk Grade</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-center text-sm">
                    <div>
                      <div className="text-green-400 font-bold">8.4%</div>
                      <div className="opacity-60">Expected APY</div>
                    </div>
                    <div>
                      <div className="text-blue-400 font-bold">2.1%</div>
                      <div className="opacity-60">Volatility</div>
                    </div>
                    <div>
                      <div className="text-yellow-400 font-bold">0.3%</div>
                      <div className="opacity-60">Max Drawdown</div>
                    </div>
                    <div>
                      <div className="text-purple-400 font-bold">4.0</div>
                      <div className="opacity-60">Sharpe Ratio</div>
                    </div>
                  </div>
                  
                  <p className="text-sm opacity-80">
                    Conservative allocation across battle-tested protocols with minimal smart contract risk 
                    and high liquidity. Suitable for risk-averse institutional investors.
                  </p>
                </div>

                <div className="border border-yellow-400/50 p-6 bg-yellow-400/5">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold uppercase tracking-wide">NFT-BACKED LENDING POOL</h3>
                      <p className="text-sm opacity-60 mt-1">High-yield NFT collateral • $890K TVL</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-yellow-400">B+</div>
                      <div className="text-sm opacity-60">Risk Grade</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-center text-sm">
                    <div>
                      <div className="text-green-400 font-bold">18.7%</div>
                      <div className="opacity-60">Expected APY</div>
                    </div>
                    <div>
                      <div className="text-blue-400 font-bold">12.3%</div>
                      <div className="opacity-60">Volatility</div>
                    </div>
                    <div>
                      <div className="text-red-400 font-bold">8.1%</div>
                      <div className="opacity-60">Max Drawdown</div>
                    </div>
                    <div>
                      <div className="text-purple-400 font-bold">1.5</div>
                      <div className="opacity-60">Sharpe Ratio</div>
                    </div>
                  </div>
                  
                  <p className="text-sm opacity-80">
                    Higher-risk strategy utilizing blue-chip NFT collections as collateral. 
                    Dynamic LTV ratios and liquidation protection mechanisms.
                  </p>
                </div>

                <div className="border border-red-400/50 p-6 bg-red-400/5">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold uppercase tracking-wide">EXPERIMENTAL YIELD FARM</h3>
                      <p className="text-sm opacity-60 mt-1">High-risk/high-reward • $156K allocation</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-red-400">C+</div>
                      <div className="text-sm opacity-60">Risk Grade</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-center text-sm">
                    <div>
                      <div className="text-green-400 font-bold">47.2%</div>
                      <div className="opacity-60">Expected APY</div>
                    </div>
                    <div>
                      <div className="text-red-400 font-bold">28.4%</div>
                      <div className="opacity-60">Volatility</div>
                    </div>
                    <div>
                      <div className="text-red-400 font-bold">35.7%</div>
                      <div className="opacity-60">Max Drawdown</div>
                    </div>
                    <div>
                      <div className="text-purple-400 font-bold">1.7</div>
                      <div className="opacity-60">Sharpe Ratio</div>
                    </div>
                  </div>
                  
                  <p className="text-sm opacity-80">
                    Aggressive strategy targeting new protocols and innovative yield opportunities. 
                    High potential returns with significant smart contract and liquidity risks.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Training Tab */}
        {activeTab === 'training' && (
          <div className="space-y-8">
            <div className="border border-white p-8">
              <h2 className="text-2xl font-bold uppercase tracking-wider mb-6">DEFI EXPERT TRAINING PARTNERSHIP</h2>
              <div className="border border-blue-400 bg-blue-400/10 p-6 mb-6">
                <h3 className="text-lg font-bold uppercase tracking-wide mb-4 text-blue-400">APPLICATIONS OPEN</h3>
                <p className="text-sm opacity-80 mb-4">
                  Seeking DeFi protocol experts, risk management professionals, smart contract auditors, 
                  and quantitative analysts for collaborative training partnership.
                </p>
                <Link 
                  href="/dashboard/bart"
                  className="inline-block border border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-black transition-all duration-150 px-6 py-3 text-sm uppercase tracking-wide"
                >
                  Apply to Train BART
                </Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-bold uppercase tracking-wide mb-4 text-blue-400">EXPERTISE NEEDED</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span>DeFi protocol architecture</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span>Smart contract security auditing</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span>Quantitative risk modeling</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span>NFT valuation and lending</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span>Portfolio optimization theory</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-bold uppercase tracking-wide mb-4 text-green-400">TRAINING FOCUS</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span>Advanced risk modeling techniques</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span>Real-time protocol monitoring</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span>Automated risk alert systems</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span>Cross-chain risk assessment</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span>Institutional-grade reporting</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-16 pt-12 border-t border-white/20 text-center">
          <p className="text-sm uppercase tracking-wider opacity-60">
            BART • DEFI RISK ASSESSMENT AI • EDEN ACADEMY GENESIS 2024
          </p>
          <p className="text-xs uppercase tracking-wider opacity-40 mt-3">
            RISK MANAGEMENT • PORTFOLIO OPTIMIZATION • PROTOCOL SECURITY
          </p>
        </div>
      </div>
    </div>
  )
}