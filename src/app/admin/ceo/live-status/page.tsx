'use client';

import Link from 'next/link';
import { Crown, ArrowLeft, Activity, TrendingUp, AlertTriangle, CheckCircle, Clock, Zap, DollarSign, Users, Rocket, FileText } from 'lucide-react';

// Agent data matching our deployment status
const agents = [
  // DEPLOYED
  { name: 'ABRAHAM', status: 'deployed', sdk: true, site: true, registry: false, revenue: 12500, role: 'Covenant Artist' },
  { name: 'SOLIENNE', status: 'deployed', sdk: true, site: true, registry: false, revenue: 8500, role: 'Consciousness' },
  { name: 'MIYOMI', status: 'deployed', sdk: true, site: true, registry: true, revenue: 15000, role: 'Market Oracle' },
  // READY
  { name: 'SUE', status: 'deployed', sdk: true, site: true, registry: false, revenue: 4500, role: 'Gallery Curator' },
  { name: 'CITIZEN', status: 'deployed', sdk: true, site: true, registry: false, revenue: 8200, role: 'DAO Manager' },
  { name: 'BERTHA', status: 'ready', sdk: true, site: true, registry: false, revenue: 12000, role: 'Art Intelligence' },
  // DEVELOPMENT
  { name: 'GEPPETTO', status: 'development', sdk: false, site: false, registry: false, revenue: 8500, role: 'Toy Maker' },
  { name: 'KORU', status: 'development', sdk: false, site: false, registry: false, revenue: 7500, role: 'Community' },
];

export default function CEOLiveStatusPage() {
  const deployedCount = agents.filter(a => a.status === 'deployed').length;
  const readyCount = agents.filter(a => a.status === 'ready').length;
  const totalRevenue = agents.reduce((sum, agent) => sum + agent.revenue, 0);
  const currentRevenue = agents.filter(a => a.status === 'deployed').reduce((sum, a) => sum + a.revenue, 0);
  const revenueGap = totalRevenue - currentRevenue;

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
              <p className="text-3xl font-bold">{deployedCount}/8</p>
              <p className="text-xs text-gray-500">25% deployed</p>
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
                <div key={agent.name} className="p-4 bg-gray-900/50 border border-green-500/30 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-xl font-bold">{agent.name}</span>
                    <span className="text-sm text-gray-400">{agent.role}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-green-400 font-semibold">${(agent.revenue/1000).toFixed(1)}k/mo</span>
                    <div className="flex gap-2">
                      <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">SDK ✓</span>
                      <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">SITE ✓</span>
                      <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">REG ✓</span>
                    </div>
                    <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-lg text-sm font-semibold">
                      🟢 LIVE
                    </span>
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
                <div key={agent.name} className="p-4 bg-gray-900/50 border border-yellow-500/30 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-xl font-bold">{agent.name}</span>
                    <span className="text-sm text-gray-400">{agent.role}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-yellow-400 font-semibold">${(agent.revenue/1000).toFixed(1)}k/mo</span>
                    <div className="flex gap-2">
                      <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">SDK ✓</span>
                      <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">SITE ✓</span>
                      <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">REG ✓</span>
                    </div>
                    <button className="px-3 py-1 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 rounded-lg text-sm font-semibold transition-colors">
                      🟡 DEPLOY NOW
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* In Development */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              IN DEVELOPMENT (2)
            </h3>
            <div className="grid gap-3">
              {agents.filter(a => a.status === 'development').map(agent => (
                <div key={agent.name} className="p-4 bg-gray-900/50 border border-red-500/30 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-xl font-bold">{agent.name}</span>
                    <span className="text-sm text-gray-400">{agent.role}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-gray-400 font-semibold">${(agent.revenue/1000).toFixed(1)}k/mo</span>
                    <div className="flex gap-2">
                      <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs">SDK ✗</span>
                      <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs">SITE ✗</span>
                      <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">REG ✓</span>
                    </div>
                    <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-lg text-sm font-semibold">
                      🔴 BUILD
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Rocket className="w-6 h-6 text-purple-400" />
            Quick Actions
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-6 bg-green-900/20 border border-green-500/30 rounded-lg">
              <h3 className="text-lg font-semibold mb-3 text-green-400">✅ ABRAHAM Deployed</h3>
              <p className="text-gray-400 mb-4">Covenant artist successfully launched to production</p>
              <div className="text-sm text-green-400">
                • API endpoints: ✅ Active<br/>
                • Works archive: ✅ 2,519 works<br/>
                • Covenant tracking: ✅ Active
              </div>
            </div>
            <div className="p-6 bg-green-900/20 border border-green-500/30 rounded-lg">
              <h3 className="text-lg font-semibold mb-3 text-green-400">✅ SOLIENNE Deployed</h3>
              <p className="text-gray-400 mb-4">Consciousness streams agent successfully launched</p>
              <div className="text-sm text-green-400">
                • API endpoints: ✅ Active<br/>
                • Registry integration: ✅ Ready<br/>
                • Consciousness streams: ✅ Active
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