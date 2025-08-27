'use client';

import Link from 'next/link';
import { Crown, ArrowLeft, TrendingUp, Activity, Users, Zap } from 'lucide-react';

export default function CEOMetricsPage() {
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
                <span className="text-white font-medium">Company Metrics</span>
              </div>
            </div>
            <div className="text-xs px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-lg border border-yellow-500/30">
              CEO ONLY
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Agent Performance */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Activity className="w-6 h-6 text-blue-400" />
            Agent Performance
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            
            {/* ABRAHAM */}
            <div className="p-6 bg-gray-900/50 border border-gray-800 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">ABRAHAM</h3>
                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-lg text-sm">ACTIVE</span>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Works:</span>
                  <span className="font-semibold">2,522</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Daily Output:</span>
                  <span className="font-semibold">1 work/day</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Covenant Progress:</span>
                  <span className="font-semibold">365/4,745 days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Revenue Generated:</span>
                  <span className="font-semibold text-green-400">$12,595</span>
                </div>
              </div>
            </div>

            {/* SOLIENNE */}
            <div className="p-6 bg-gray-900/50 border border-gray-800 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">SOLIENNE</h3>
                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-lg text-sm">ACTIVE</span>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Works:</span>
                  <span className="font-semibold">1,740</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Daily Output:</span>
                  <span className="font-semibold">20 streams/day</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Paris Photo Prep:</span>
                  <span className="font-semibold">On Track</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Revenue Generated:</span>
                  <span className="font-semibold text-green-400">$8,700</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* System Health */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Zap className="w-6 h-6 text-green-400" />
            System Health
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            
            <div className="p-6 bg-gray-900/50 border border-gray-800 rounded-lg">
              <h3 className="text-lg font-semibold mb-3">Registry Status</h3>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <span className="text-green-400">Operational</span>
              </div>
              <div className="mt-3 text-sm text-gray-400">
                Last sync: 2 minutes ago
              </div>
            </div>

            <div className="p-6 bg-gray-900/50 border border-gray-800 rounded-lg">
              <h3 className="text-lg font-semibold mb-3">API Health</h3>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <span className="text-green-400">99.9% Uptime</span>
              </div>
              <div className="mt-3 text-sm text-gray-400">
                Response time: 120ms avg
              </div>
            </div>

            <div className="p-6 bg-gray-900/50 border border-gray-800 rounded-lg">
              <h3 className="text-lg font-semibold mb-3">Database</h3>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <span className="text-green-400">Healthy</span>
              </div>
              <div className="mt-3 text-sm text-gray-400">
                Storage: 78% utilized
              </div>
            </div>

          </div>
        </div>

        {/* Financial Overview */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-emerald-400" />
            Financial Overview
          </h2>
          <div className="grid gap-6 md:grid-cols-4">
            
            <div className="p-6 bg-gray-900/50 border border-gray-800 rounded-lg">
              <div className="text-sm text-gray-400 mb-2">Monthly Revenue</div>
              <div className="text-2xl font-bold text-green-400">$21,295</div>
              <div className="text-sm text-green-400">+12% from last month</div>
            </div>

            <div className="p-6 bg-gray-900/50 border border-gray-800 rounded-lg">
              <div className="text-sm text-gray-400 mb-2">Operating Costs</div>
              <div className="text-2xl font-bold text-orange-400">$8,450</div>
              <div className="text-sm text-gray-400">Infrastructure + Team</div>
            </div>

            <div className="p-6 bg-gray-900/50 border border-gray-800 rounded-lg">
              <div className="text-sm text-gray-400 mb-2">Net Profit</div>
              <div className="text-2xl font-bold text-emerald-400">$12,845</div>
              <div className="text-sm text-emerald-400">+18% margin</div>
            </div>

            <div className="p-6 bg-gray-900/50 border border-gray-800 rounded-lg">
              <div className="text-sm text-gray-400 mb-2">Token Balance</div>
              <div className="text-2xl font-bold text-purple-400">847K EDEN</div>
              <div className="text-sm text-gray-400">$42,350 value</div>
            </div>

          </div>
        </div>

        {/* Coming Soon */}
        <div className="p-8 bg-gray-900/30 border border-gray-800 rounded-lg text-center">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Advanced Analytics Coming Soon</h3>
          <p className="text-gray-400">
            Real-time dashboards, predictive analytics, and comprehensive reporting tools are in development.
          </p>
        </div>

      </div>
    </div>
  );
}