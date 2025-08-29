'use client';

import { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Eye, 
  Brain, 
  Target,
  BarChart3,
  PieChart,
  Activity,
  Zap,
  AlertTriangle,
  CheckCircle,
  Coins,
  Shield,
  Clock,
  Banknote
} from 'lucide-react';
import Link from 'next/link';

interface LendingMetrics {
  totalLent: number;
  activeLoans: number;
  averageAPR: number;
  totalReturns: number;
}

interface RiskAnalytics {
  portfolioRisk: number;
  defaultRate: number;
  avgLTV: number;
  riskScore: number;
}

interface MarketData {
  nftMarketCap: number;
  lendingVolume: number;
  topCollections: string[];
  marketSentiment: string;
}

interface RealtimeData {
  availableLiquidity: number;
  pendingOffers: number;
  todaysPnL: number;
  activeBorrowers: number;
  systemStatus: string;
  lastUpdate: string;
}

interface CollectionData {
  collection: string;
  lentAmount: number;
  activeLoans: number;
  avgAPR: number;
  performance: number;
}

interface TrendInsights {
  momentum: string;
  confidence: number;
  keyInsights: string[];
  riskFactors: string[];
  opportunities: string[];
}

export default function BartDashboard() {
  const [lendingData, setLendingData] = useState<LendingMetrics | null>(null);
  const [riskData, setRiskData] = useState<RiskAnalytics | null>(null);
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [realtimeData, setRealtimeData] = useState<RealtimeData | null>(null);
  const [collectionData, setCollectionData] = useState<CollectionData[]>([]);
  const [trendData, setTrendData] = useState<TrendInsights | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchLendingData();
    const interval = setInterval(fetchRealtimeData, 30000); // Update every 30s
    return () => clearInterval(interval);
  }, []);

  const fetchLendingData = async () => {
    try {
      // Mock data for now - replace with actual API calls
      setLendingData({
        totalLent: 4567.23,
        activeLoans: 1247,
        averageAPR: 22.3,
        totalReturns: 1023.45
      });
      
      setRiskData({
        portfolioRisk: 23,
        defaultRate: 1.8,
        avgLTV: 58.2,
        riskScore: 34
      });
      
      setMarketData({
        nftMarketCap: 8750000000,
        lendingVolume: 234567,
        topCollections: ['CryptoPunks', 'BAYC', 'Art Blocks', 'Azuki', 'CloneX'],
        marketSentiment: 'Neutral'
      });
      
      setRealtimeData({
        availableLiquidity: 2345.67,
        pendingOffers: 23,
        todaysPnL: 156.78,
        activeBorrowers: 892,
        systemStatus: 'Operational',
        lastUpdate: new Date().toLocaleTimeString()
      });
      
      setCollectionData([
        { collection: 'CryptoPunks', lentAmount: 1234.56, activeLoans: 234, avgAPR: 18.8, performance: 15.2 },
        { collection: 'BAYC', lentAmount: 987.45, activeLoans: 187, avgAPR: 21.3, performance: 12.8 },
        { collection: 'Art Blocks', lentAmount: 654.32, activeLoans: 156, avgAPR: 24.7, performance: 18.6 },
        { collection: 'Azuki', lentAmount: 543.21, activeLoans: 123, avgAPR: 26.1, performance: 22.3 },
        { collection: 'CloneX', lentAmount: 432.10, activeLoans: 98, avgAPR: 28.5, performance: 19.7 }
      ]);
      
      setTrendData({
        momentum: 'bullish',
        confidence: 0.87,
        keyInsights: [
          'NFT lending volume increased 34% this month',
          'Blue-chip collections showing strong collateral value',
          'Renaissance risk management outperforming market average',
          'Autonomous decision-making improving loan quality'
        ],
        riskFactors: [
          'Market volatility affecting floor prices',
          'Increased competition in lending space',
          'Regulatory uncertainty in DeFi lending'
        ],
        opportunities: [
          'Emerging collections with growth potential',
          'Institutional borrowers seeking larger loans',
          'Cross-chain lending expansion opportunities'
        ]
      });
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const fetchRealtimeData = async () => {
    try {
      // Update real-time metrics
      setRealtimeData(prev => prev ? {
        ...prev,
        todaysPnL: prev.todaysPnL + (Math.random() - 0.5) * 20,
        pendingOffers: Math.floor(Math.random() * 50) + 10,
        lastUpdate: new Date().toLocaleTimeString()
      } : null);
    } catch (err) {
      console.error('Failed to update realtime data:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <Activity className="w-8 h-8 animate-spin mx-auto mb-4 text-yellow-400" />
          <div className="text-lg">Loading BART Lending Analytics...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-8 h-8 mx-auto mb-4 text-red-400" />
          <div className="text-lg text-red-400">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-yellow-400">BART LENDING DASHBOARD</h1>
              <p className="text-gray-400">Renaissance Banking for the Digital Age</p>
            </div>
            <div className="flex items-center gap-4">
              <Link 
                href="/academy/agent/bart" 
                className="text-gray-400 hover:text-white transition-colors"
              >
                Agent Profile
              </Link>
              <Link 
                href="/api/agents/bart/demo" 
                className="px-4 py-2 border border-yellow-600 text-yellow-400 hover:bg-yellow-600 hover:text-white transition-all"
              >
                Test API
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Status Bar */}
      {realtimeData && (
        <div className="bg-gray-900 border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">
                  {realtimeData.availableLiquidity.toFixed(2)} ETH
                </div>
                <div className="text-xs text-gray-400">Available Liquidity</div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${realtimeData.todaysPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {realtimeData.todaysPnL >= 0 ? '+' : ''}{realtimeData.todaysPnL.toFixed(2)} ETH
                </div>
                <div className="text-xs text-gray-400">Today's P&L</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">{realtimeData.pendingOffers}</div>
                <div className="text-xs text-gray-400">Pending Offers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">{realtimeData.activeBorrowers}</div>
                <div className="text-xs text-gray-400">Active Borrowers</div>
              </div>
              <div className="text-center">
                <div className="text-sm font-medium text-green-400">{realtimeData.systemStatus}</div>
                <div className="text-xs text-gray-400">System Status</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-300">{realtimeData.lastUpdate}</div>
                <div className="text-xs text-gray-400">Last Update</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'lending', label: 'Lending', icon: Coins },
              { id: 'risk', label: 'Risk', icon: Shield },
              { id: 'market', label: 'Market', icon: Activity },
              { id: 'insights', label: 'Insights', icon: Eye }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 border-b-2 transition-colors ${
                  activeTab === tab.id 
                    ? 'border-yellow-400 text-yellow-400' 
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Key Metrics Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {lendingData && (
                <>
                  <div className="bg-gray-900 border border-gray-700 p-6 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-medium text-gray-400">Total Lent</h3>
                      <Coins className="w-5 h-5 text-yellow-400" />
                    </div>
                    <div className="text-2xl font-bold text-white">
                      {lendingData.totalLent.toFixed(2)} ETH
                    </div>
                  </div>
                  <div className="bg-gray-900 border border-gray-700 p-6 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-medium text-gray-400">Active Loans</h3>
                      <Target className="w-5 h-5 text-blue-400" />
                    </div>
                    <div className="text-2xl font-bold text-blue-400">
                      {lendingData.activeLoans.toLocaleString()}
                    </div>
                  </div>
                  <div className="bg-gray-900 border border-gray-700 p-6 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-medium text-gray-400">Average APR</h3>
                      <TrendingUp className="w-5 h-5 text-green-400" />
                    </div>
                    <div className="text-2xl font-bold text-green-400">
                      {lendingData.averageAPR.toFixed(1)}%
                    </div>
                  </div>
                  <div className="bg-gray-900 border border-gray-700 p-6 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-medium text-gray-400">Total Returns</h3>
                      <Banknote className="w-5 h-5 text-purple-400" />
                    </div>
                    <div className="text-2xl font-bold text-purple-400">
                      {lendingData.totalReturns.toFixed(2)} ETH
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Risk Metrics */}
            {riskData && (
              <div className="bg-gray-900 border border-gray-700 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-6 text-white flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Risk Management
                </h3>
                <div className="grid md:grid-cols-4 gap-6">
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Portfolio Risk</div>
                    <div className={`text-2xl font-bold ${riskData.portfolioRisk < 30 ? 'text-green-400' : riskData.portfolioRisk < 60 ? 'text-yellow-400' : 'text-red-400'}`}>
                      {riskData.portfolioRisk}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Default Rate</div>
                    <div className="text-2xl font-bold text-green-400">{riskData.defaultRate.toFixed(1)}%</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Average LTV</div>
                    <div className="text-2xl font-bold text-yellow-400">{riskData.avgLTV.toFixed(1)}%</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Risk Score</div>
                    <div className={`text-2xl font-bold ${riskData.riskScore < 40 ? 'text-green-400' : riskData.riskScore < 70 ? 'text-yellow-400' : 'text-red-400'}`}>
                      {riskData.riskScore}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Collection Performance */}
            {collectionData.length > 0 && (
              <div className="bg-gray-900 border border-gray-700 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-6 text-white">Top Collections</h3>
                <div className="space-y-4">
                  {collectionData.slice(0, 5).map((collection, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-sm font-medium text-white">{collection.collection}</div>
                        <div className="text-xs text-gray-400">{collection.activeLoans} loans</div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-sm text-gray-300">
                          {collection.lentAmount.toFixed(2)} ETH
                        </div>
                        <div className="text-sm text-yellow-400">
                          {collection.avgAPR.toFixed(1)}% APR
                        </div>
                        <div className={`text-sm font-medium ${collection.performance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {collection.performance >= 0 ? '+' : ''}{collection.performance.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'lending' && (
          <div className="space-y-8">
            {/* Active Loans Overview */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gray-900 border border-gray-700 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
                  <Coins className="w-5 h-5 text-yellow-400" />
                  Lending Volume
                </h3>
                <div className="text-3xl font-bold text-yellow-400 mb-2">
                  {lendingData?.totalLent.toFixed(2)} ETH
                </div>
                <div className="text-sm text-gray-400">
                  Across {lendingData?.activeLoans.toLocaleString()} active loans
                </div>
              </div>
              <div className="bg-gray-900 border border-gray-700 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                  Performance
                </h3>
                <div className="text-3xl font-bold text-green-400 mb-2">
                  {lendingData?.averageAPR.toFixed(1)}%
                </div>
                <div className="text-sm text-gray-400">
                  Average APR across all loans
                </div>
              </div>
              <div className="bg-gray-900 border border-gray-700 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-400" />
                  Success Rate
                </h3>
                <div className="text-3xl font-bold text-blue-400 mb-2">
                  98.2%
                </div>
                <div className="text-sm text-gray-400">
                  Loan repayment success rate
                </div>
              </div>
            </div>

            {/* Recent Lending Activity */}
            <div className="bg-gray-900 border border-gray-700 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-6 text-white flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Recent Lending Activity
              </h3>
              <div className="space-y-4">
                {[
                  { collection: 'CryptoPunks', amount: '45.2', duration: '30 days', apr: '18.8%', status: 'Active' },
                  { collection: 'BAYC', amount: '28.9', duration: '45 days', apr: '21.3%', status: 'Active' },
                  { collection: 'Art Blocks', amount: '12.1', duration: '30 days', apr: '24.7%', status: 'Repaid' },
                  { collection: 'Azuki', amount: '15.7', duration: '60 days', apr: '26.1%', status: 'Active' },
                  { collection: 'CloneX', amount: '8.3', duration: '30 days', apr: '28.5%', status: 'Active' }
                ].map((loan, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-gray-700 rounded">
                    <div className="flex items-center gap-4">
                      <div className="text-white font-medium">{loan.collection}</div>
                      <div className="text-sm text-gray-400">{loan.amount} ETH • {loan.duration}</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-yellow-400 font-medium">{loan.apr}</div>
                      <div className={`px-2 py-1 rounded text-xs font-medium ${
                        loan.status === 'Active' ? 'bg-green-900 text-green-300' :
                        loan.status === 'Repaid' ? 'bg-blue-900 text-blue-300' :
                        'bg-gray-800 text-gray-300'
                      }`}>
                        {loan.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Collection Analysis */}
            <div className="bg-gray-900 border border-gray-700 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-6 text-white">Collection Analysis</h3>
              <div className="space-y-4">
                {collectionData.map((collection, index) => (
                  <div key={index} className="p-4 border border-gray-700 rounded">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-white font-medium">{collection.collection}</h4>
                      <div className="text-yellow-400 font-medium">{collection.avgAPR.toFixed(1)}% APR</div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="text-gray-400">Lent Amount</div>
                        <div className="text-white">{collection.lentAmount.toFixed(2)} ETH</div>
                      </div>
                      <div>
                        <div className="text-gray-400">Active Loans</div>
                        <div className="text-white">{collection.activeLoans}</div>
                      </div>
                      <div>
                        <div className="text-gray-400">Performance</div>
                        <div className={`font-medium ${collection.performance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {collection.performance >= 0 ? '+' : ''}{collection.performance.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'risk' && (
          <div className="space-y-8">
            {/* Risk Overview */}
            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-gray-900 border border-gray-700 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
                  <Shield className="w-5 h-5 text-yellow-400" />
                  Portfolio Risk
                </h3>
                <div className={`text-3xl font-bold mb-2 ${riskData && riskData.portfolioRisk < 30 ? 'text-green-400' : riskData && riskData.portfolioRisk < 60 ? 'text-yellow-400' : 'text-red-400'}`}>
                  {riskData?.portfolioRisk}
                </div>
                <div className="text-sm text-gray-400">Risk Score (0-100)</div>
              </div>
              <div className="bg-gray-900 border border-gray-700 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-green-400" />
                  Default Rate
                </h3>
                <div className="text-3xl font-bold text-green-400 mb-2">
                  {riskData?.defaultRate.toFixed(1)}%
                </div>
                <div className="text-sm text-gray-400">Industry leading</div>
              </div>
              <div className="bg-gray-900 border border-gray-700 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
                  <Target className="w-5 h-5 text-yellow-400" />
                  Average LTV
                </h3>
                <div className="text-3xl font-bold text-yellow-400 mb-2">
                  {riskData?.avgLTV.toFixed(1)}%
                </div>
                <div className="text-sm text-gray-400">Conservative approach</div>
              </div>
              <div className="bg-gray-900 border border-gray-700 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-400" />
                  Risk Score
                </h3>
                <div className={`text-3xl font-bold mb-2 ${riskData && riskData.riskScore < 40 ? 'text-green-400' : riskData && riskData.riskScore < 70 ? 'text-yellow-400' : 'text-red-400'}`}>
                  {riskData?.riskScore}
                </div>
                <div className="text-sm text-gray-400">AI-calculated</div>
              </div>
            </div>

            {/* Risk Policy Framework */}
            <div className="bg-gray-900 border border-gray-700 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-6 text-white flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Renaissance Banking Risk Policy
              </h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-white font-medium mb-4">Collection Tiers</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border border-blue-600 rounded bg-blue-950 bg-opacity-20">
                      <span className="text-blue-300 font-medium">Blue-Chip</span>
                      <span className="text-blue-300">Max 65% LTV</span>
                    </div>
                    <div className="flex items-center justify-between p-3 border border-purple-600 rounded bg-purple-950 bg-opacity-20">
                      <span className="text-purple-300 font-medium">Premium</span>
                      <span className="text-purple-300">Max 55% LTV</span>
                    </div>
                    <div className="flex items-center justify-between p-3 border border-gray-600 rounded bg-gray-950 bg-opacity-20">
                      <span className="text-gray-300 font-medium">Standard</span>
                      <span className="text-gray-300">Max 45% LTV</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-white font-medium mb-4">Banking Principles</h4>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                      <span className="text-gray-300 text-sm">Never exceed 85% LTV regardless of collection</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                      <span className="text-gray-300 text-sm">Minimum 10% APR to ensure profitable operations</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                      <span className="text-gray-300 text-sm">Diversification across collections and risk tiers</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                      <span className="text-gray-300 text-sm">25% reserve ratio for capital protection</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                      <span className="text-gray-300 text-sm">Reject loans exceeding risk score threshold (75)</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Risk Monitoring */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-900 border border-gray-700 p-6 rounded-lg">
                <h4 className="text-lg font-semibold mb-4 text-white">Risk Alerts</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 border border-green-600 rounded bg-green-950 bg-opacity-20">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <div>
                      <div className="text-green-300 font-medium">All Systems Normal</div>
                      <div className="text-sm text-gray-400">Portfolio within risk parameters</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 border border-blue-600 rounded bg-blue-950 bg-opacity-20">
                    <Eye className="w-5 h-5 text-blue-400" />
                    <div>
                      <div className="text-blue-300 font-medium">Monitoring Floor Prices</div>
                      <div className="text-sm text-gray-400">3 collections showing volatility</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-900 border border-gray-700 p-6 rounded-lg">
                <h4 className="text-lg font-semibold mb-4 text-white">Florentine Wisdom</h4>
                <div className="p-4 border border-yellow-600 rounded bg-yellow-950 bg-opacity-20">
                  <div className="italic text-yellow-300 mb-2">
                    "La prudenza è la madre della prosperità"
                  </div>
                  <div className="text-sm text-gray-400">
                    Prudence is the mother of prosperity - BART's risk management follows this 15th-century banking wisdom, prioritizing capital preservation over aggressive returns.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'market' && (
          <div className="space-y-8">
            {/* Market Overview */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gray-900 border border-gray-700 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-400" />
                  NFT Market Cap
                </h3>
                <div className="text-3xl font-bold text-blue-400 mb-2">
                  $8.75B
                </div>
                <div className="text-sm text-gray-400">Total NFT market valuation</div>
              </div>
              <div className="bg-gray-900 border border-gray-700 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
                  <Coins className="w-5 h-5 text-yellow-400" />
                  Lending Volume
                </h3>
                <div className="text-3xl font-bold text-yellow-400 mb-2">
                  234.6K ETH
                </div>
                <div className="text-sm text-gray-400">24h lending volume</div>
              </div>
              <div className="bg-gray-900 border border-gray-700 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-400" />
                  Market Sentiment
                </h3>
                <div className="text-3xl font-bold text-purple-400 mb-2">
                  {marketData?.marketSentiment}
                </div>
                <div className="text-sm text-gray-400">AI-analyzed sentiment</div>
              </div>
            </div>

            {/* Top Collections Market Data */}
            <div className="bg-gray-900 border border-gray-700 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-6 text-white">Top Collections Market Analysis</h3>
              <div className="space-y-4">
                {[
                  { collection: 'CryptoPunks', floor: '45.2', volume: '1,234', change: '+5.2%', liquidity: 'High' },
                  { collection: 'BAYC', floor: '28.9', volume: '987', change: '+2.1%', liquidity: 'High' },
                  { collection: 'Art Blocks', floor: '12.1', volume: '654', change: '+8.7%', liquidity: 'Medium' },
                  { collection: 'Azuki', floor: '15.7', volume: '543', change: '-1.3%', liquidity: 'Medium' },
                  { collection: 'CloneX', floor: '8.3', volume: '432', change: '+3.4%', liquidity: 'Medium' }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-gray-700 rounded">
                    <div className="text-white font-medium">{item.collection}</div>
                    <div className="flex items-center gap-6 text-sm">
                      <div>
                        <div className="text-gray-400">Floor</div>
                        <div className="text-white">{item.floor} ETH</div>
                      </div>
                      <div>
                        <div className="text-gray-400">24h Volume</div>
                        <div className="text-white">{item.volume} ETH</div>
                      </div>
                      <div>
                        <div className="text-gray-400">Change</div>
                        <div className={`font-medium ${item.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                          {item.change}
                        </div>
                      </div>
                      <div>
                        <div className="text-gray-400">Liquidity</div>
                        <div className={`font-medium ${item.liquidity === 'High' ? 'text-green-400' : 'text-yellow-400'}`}>
                          {item.liquidity}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Market Trends */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-900 border border-gray-700 p-6 rounded-lg">
                <h4 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                  Lending Trends
                </h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">•</span>
                    <span className="text-gray-300 text-sm">NFT lending volume up 34% this month</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">•</span>
                    <span className="text-gray-300 text-sm">Blue-chip collections maintaining stable floors</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">•</span>
                    <span className="text-gray-300 text-sm">Average loan duration increasing to 45 days</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-1">•</span>
                    <span className="text-gray-300 text-sm">Institutional adoption of NFT lending growing</span>
                  </li>
                </ul>
              </div>
              <div className="bg-gray-900 border border-gray-700 p-6 rounded-lg">
                <h4 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-400" />
                  Market Risks
                </h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-400 mt-1">•</span>
                    <span className="text-gray-300 text-sm">ETH volatility affecting floor price stability</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-400 mt-1">•</span>
                    <span className="text-gray-300 text-sm">Increased competition in lending protocols</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-400 mt-1">•</span>
                    <span className="text-gray-300 text-sm">Regulatory uncertainty in DeFi space</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-400 mt-1">•</span>
                    <span className="text-gray-300 text-sm">Seasonal trading patterns affecting volume</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'insights' && trendData && (
          <div className="space-y-8">
            <div className="bg-gray-900 border border-gray-700 p-6 rounded-lg">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">Renaissance Banking Intelligence</h3>
                <div className={`px-3 py-1 rounded text-sm font-medium ${
                  trendData.momentum === 'bullish' ? 'bg-green-900 text-green-300' :
                  trendData.momentum === 'bearish' ? 'bg-red-900 text-red-300' :
                  'bg-gray-800 text-gray-300'
                }`}>
                  {trendData.momentum.toUpperCase()}
                </div>
              </div>
              <div className="text-sm text-gray-400 mb-4">
                Confidence: {(trendData.confidence * 100).toFixed(1)}%
              </div>
              <div className="italic text-gray-300 mb-4">
                "Come diceva Lorenzo de' Medici: 'La prudenza nel prestito è la chiave della prosperità.'"
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gray-900 border border-gray-700 p-6 rounded-lg">
                <h4 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  Key Insights
                </h4>
                <ul className="space-y-2">
                  {trendData.keyInsights.map((insight, index) => (
                    <li key={index} className="text-sm text-gray-300 flex items-start gap-2">
                      <span className="text-green-400 mt-1">•</span>
                      {insight}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-gray-900 border border-gray-700 p-6 rounded-lg">
                <h4 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-400" />
                  Risk Factors
                </h4>
                <ul className="space-y-2">
                  {trendData.riskFactors.map((risk, index) => (
                    <li key={index} className="text-sm text-gray-300 flex items-start gap-2">
                      <span className="text-yellow-400 mt-1">•</span>
                      {risk}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-gray-900 border border-gray-700 p-6 rounded-lg">
                <h4 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
                  <Zap className="w-5 h-5 text-purple-400" />
                  Opportunities
                </h4>
                <ul className="space-y-2">
                  {trendData.opportunities.map((opportunity, index) => (
                    <li key={index} className="text-sm text-gray-300 flex items-start gap-2">
                      <span className="text-purple-400 mt-1">•</span>
                      {opportunity}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}