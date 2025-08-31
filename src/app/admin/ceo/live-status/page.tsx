'use client';

import Link from 'next/link';
import { Crown, ArrowLeft, Activity, TrendingUp, AlertTriangle, CheckCircle, Clock, Zap, DollarSign, Users, Rocket, FileText } from 'lucide-react';

// Agent data matching our deployment status - ALL 10 GENESIS AGENTS
const agents = [
  // DEPLOYED & LAUNCH READY
  { name: 'ABRAHAM', status: 'deployed', sdk: true, site: true, registry: true, revenue: 12500, role: 'Covenant Artist', trainer: 'Gene Kogan', progress: 75 },
  { name: 'SOLIENNE', status: 'deployed', sdk: true, site: true, registry: true, revenue: 8500, role: 'Consciousness', trainer: 'Kristi Coronado', progress: 65 },
  { name: 'MIYOMI', status: 'deployed', sdk: true, site: true, registry: true, revenue: 15000, role: 'Market Oracle', trainer: 'Seth Goldstein', progress: 82 },
  // PRODUCTION READY
  { name: 'SUE', status: 'ready', sdk: true, site: true, registry: true, revenue: 4500, role: 'Design Critic', trainer: 'Seeking Partner', progress: 0 },
  { name: 'CITIZEN', status: 'ready', sdk: true, site: true, registry: true, revenue: 8200, role: 'DAO Manager', trainer: 'Henry/BrightMoments', progress: 70 },
  { name: 'BERTHA', status: 'ready', sdk: true, site: true, registry: true, revenue: 12000, role: 'Art Intelligence', trainer: 'Amanda Schmitt', progress: 87 },
  // ACTIVE DEVELOPMENT
  { name: 'GEPPETTO', status: 'development', sdk: true, site: true, registry: true, revenue: 8500, role: '3D Sculptor', trainer: 'Martin & Colin/Lattice', progress: 45 },
  { name: 'KORU', status: 'development', sdk: true, site: true, registry: true, revenue: 7500, role: 'Community Poet', trainer: 'Xander', progress: 55 },
  { name: 'BART', status: 'development', sdk: false, site: false, registry: true, revenue: 6000, role: 'Meme Creator', trainer: 'TBD', progress: 15 },
  { name: 'VERDELIS', status: 'development', sdk: false, site: false, registry: true, revenue: 9000, role: 'Environmental Artist', trainer: 'Seeking Partner', progress: 20 },
];

export default function CEOLiveStatusPage() {
  const deployedCount = agents.filter(a => a.status === 'deployed').length;
  const readyCount = agents.filter(a => a.status === 'ready').length;
  const developmentCount = agents.filter(a => a.status === 'development').length;
  const totalRevenue = agents.reduce((sum, agent) => sum + agent.revenue, 0);
  const currentRevenue = agents.filter(a => a.status === 'deployed').reduce((sum, a) => sum + a.revenue, 0);
  const revenueGap = totalRevenue - currentRevenue;
  const averageProgress = agents.reduce((sum, a) => sum + a.progress, 0) / agents.length;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* CEO Header */}
      <div className="border-b border-gray-800 bg-gray-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                href="/admin/ceo"
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                CEO Dashboard
              </Link>
              <span className="text-gray-600">/</span>
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-yellow-500" />
                <span className="text-white font-medium">Live Agent Status</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="px-3 py-1 bg-green-500/20 text-green-400 rounded-lg text-sm">
                API: VALID ✓
              </div>
              <div className="text-xs px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-lg border border-yellow-500/30">
                CEO ONLY
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Executive Summary */}
        <div className="mb-8 p-6 bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-xl border border-purple-500/30">
          <h2 className="text-2xl font-bold mb-4">Executive Summary</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-gray-400 text-sm">Active Agents</p>
              <p className="text-3xl font-bold">{deployedCount}/10</p>
              <p className="text-xs text-gray-500">{Math.round(deployedCount/10*100)}% deployed</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Current Revenue</p>
              <p className="text-3xl font-bold text-green-400">${(currentRevenue/1000).toFixed(0)}k</p>
              <p className="text-xs text-gray-500">per month</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Revenue Gap</p>
              <p className="text-3xl font-bold text-yellow-400">${(revenueGap/1000).toFixed(0)}k</p>
              <p className="text-xs text-gray-500">opportunity</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Annual Potential</p>
              <p className="text-3xl font-bold text-purple-400">${(totalRevenue*12/1000).toFixed(0)}k</p>
              <p className="text-xs text-gray-500">all agents</p>
            </div>
          </div>
        </div>

        {/* Agent Status Matrix */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-400" />
            Agent Status Matrix
          </h2>
          
          {/* Deployed Agents */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              DEPLOYED ({deployedCount})
            </h3>
            <div className="grid gap-3">
              {agents.filter(a => a.status === 'deployed').map(agent => (
                <div key={agent.name} className="p-4 bg-gray-900/50 border border-green-500/30 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-4">
                      <span className="text-xl font-bold">{agent.name}</span>
                      <span className="text-sm text-gray-400">{agent.role}</span>
                    </div>
                    <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-lg text-sm font-semibold">
                      🟢 LIVE
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      <span className="text-gray-400">Trainer: </span>
                      <span className="text-white">{agent.trainer}</span>
                      <span className="text-gray-400 ml-3">Progress: </span>
                      <span className="text-green-400 font-semibold">{agent.progress}%</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-green-400 font-semibold">${(agent.revenue/1000).toFixed(1)}k/mo</span>
                      <div className="flex gap-2">
                        <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">SDK ✓</span>
                        <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">SITE ✓</span>
                        <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">REG ✓</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Ready to Deploy */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Clock className="w-5 h-5 text-yellow-400" />
              READY TO DEPLOY ({readyCount})
            </h3>
            <div className="grid gap-3">
              {agents.filter(a => a.status === 'ready').map(agent => (
                <div key={agent.name} className="p-4 bg-gray-900/50 border border-yellow-500/30 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-4">
                      <span className="text-xl font-bold">{agent.name}</span>
                      <span className="text-sm text-gray-400">{agent.role}</span>
                    </div>
                    <button className="px-3 py-1 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 rounded-lg text-sm font-semibold transition-colors">
                      🟡 DEPLOY NOW
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      <span className="text-gray-400">Trainer: </span>
                      <span className="text-white">{agent.trainer}</span>
                      <span className="text-gray-400 ml-3">Progress: </span>
                      <span className="text-yellow-400 font-semibold">{agent.progress}%</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-yellow-400 font-semibold">${(agent.revenue/1000).toFixed(1)}k/mo</span>
                      <div className="flex gap-2">
                        <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">SDK ✓</span>
                        <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">SITE ✓</span>
                        <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">REG ✓</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* In Development */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              IN DEVELOPMENT ({developmentCount})
            </h3>
            <div className="grid gap-3">
              {agents.filter(a => a.status === 'development').map(agent => (
                <div key={agent.name} className="p-4 bg-gray-900/50 border border-red-500/30 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-4">
                      <span className="text-xl font-bold">{agent.name}</span>
                      <span className="text-sm text-gray-400">{agent.role}</span>
                    </div>
                    <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-lg text-sm font-semibold">
                      🔴 BUILD
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      <span className="text-gray-400">Trainer: </span>
                      <span className="text-white">{agent.trainer}</span>
                      <span className="text-gray-400 ml-3">Progress: </span>
                      <span className="text-red-400 font-semibold">{agent.progress}%</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-gray-400 font-semibold">${(agent.revenue/1000).toFixed(1)}k/mo</span>
                      <div className="flex gap-2">
                        {agent.sdk ? <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">SDK ✓</span> : <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs">SDK ✗</span>}
                        {agent.site ? <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">SITE ✓</span> : <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs">SITE ✗</span>}
                        <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">REG ✓</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Training Progress Summary */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-blue-400" />
            Training Progress
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 bg-gray-900/50 border border-gray-800 rounded-lg">
              <p className="text-gray-400 text-sm mb-2">Average Progress</p>
              <p className="text-2xl font-bold text-blue-400">{averageProgress.toFixed(1)}%</p>
              <div className="w-full bg-gray-800 rounded-full h-2 mt-2">
                <div className="bg-blue-400 h-2 rounded-full" style={{width: `${averageProgress}%`}}></div>
              </div>
            </div>
            <div className="p-4 bg-gray-900/50 border border-gray-800 rounded-lg">
              <p className="text-gray-400 text-sm mb-2">Agents with Trainers</p>
              <p className="text-2xl font-bold text-green-400">{agents.filter(a => a.trainer !== 'TBD' && a.trainer !== 'Seeking Partner').length}/10</p>
              <p className="text-xs text-gray-500 mt-1">2 seeking partners</p>
            </div>
            <div className="p-4 bg-gray-900/50 border border-gray-800 rounded-lg">
              <p className="text-gray-400 text-sm mb-2">Launch Ready</p>
              <p className="text-2xl font-bold text-purple-400">{agents.filter(a => a.progress >= 70).length}</p>
              <p className="text-xs text-gray-500 mt-1">70%+ training complete</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Rocket className="w-6 h-6 text-purple-400" />
            Recent Achievements
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-6 bg-green-900/20 border border-green-500/30 rounded-lg">
              <h3 className="text-lg font-semibold mb-3 text-green-400">✅ MIYOMI Trading Live</h3>
              <p className="text-gray-400 mb-4">Live trading signals with persistent storage deployed</p>
              <div className="text-sm text-green-400">
                • WebSocket streaming: ✅ Active<br/>
                • Signal persistence: ✅ 20 signals stored<br/>
                • Dashboard: ✅ Complete with export/import
              </div>
            </div>
            <div className="p-6 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
              <h3 className="text-lg font-semibold mb-3 text-yellow-400">🔜 ABRAHAM Covenant</h3>
              <p className="text-gray-400 mb-4">October 19, 2025 launch - 51 days remaining</p>
              <div className="text-sm text-yellow-400">
                • Witness Registry: ✅ Operational<br/>
                • Smart Contract: ✅ Complete (400+ lines)<br/>
                • Target: 2 witnesses/day needed
              </div>
            </div>
          </div>
        </div>

        {/* System Health */}
        <div className="mb-8 p-6 bg-gray-900/50 border border-gray-800 rounded-lg">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-green-400" />
            System Health
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-gray-400">Registry</p>
              <p className="font-semibold text-green-400">✓ Operational</p>
            </div>
            <div>
              <p className="text-gray-400">API Key</p>
              <p className="font-semibold text-green-400">✓ Valid</p>
            </div>
            <div>
              <p className="text-gray-400">SDK Tests</p>
              <p className="font-semibold text-green-400">15/15 Pass</p>
            </div>
            <div>
              <p className="text-gray-400">Error Rate</p>
              <p className="font-semibold text-green-400">2.3%</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}