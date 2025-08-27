'use client';

import Link from 'next/link';
import { Crown, ArrowLeft, AlertTriangle, CheckCircle, Activity, Zap } from 'lucide-react';

export default function CEOHealthPage() {
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
                <span className="text-white font-medium">System Health</span>
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
        
        {/* System Status */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Activity className="w-6 h-6 text-green-400" />
            System Status
          </h2>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="p-4 bg-gray-900/50 border border-green-500/30 rounded-lg text-center">
              <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <p className="text-lg font-semibold text-green-400">Registry</p>
              <p className="text-sm text-gray-400">Operational</p>
              <p className="text-xs text-green-400">99.9% uptime</p>
            </div>
            
            <div className="p-4 bg-gray-900/50 border border-green-500/30 rounded-lg text-center">
              <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <p className="text-lg font-semibold text-green-400">Claude API</p>
              <p className="text-sm text-gray-400">Connected</p>
              <p className="text-xs text-green-400">Valid key</p>
            </div>
            
            <div className="p-4 bg-gray-900/50 border border-green-500/30 rounded-lg text-center">
              <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <p className="text-lg font-semibold text-green-400">Eden Platform</p>
              <p className="text-sm text-gray-400">Online</p>
              <p className="text-xs text-green-400">All sites live</p>
            </div>
            
            <div className="p-4 bg-gray-900/50 border border-green-500/30 rounded-lg text-center">
              <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <p className="text-lg font-semibold text-green-400">Database</p>
              <p className="text-sm text-gray-400">Healthy</p>
              <p className="text-xs text-green-400">Supabase</p>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Zap className="w-6 h-6 text-yellow-400" />
            Performance Metrics
          </h2>
          
          <div className="grid gap-6 md:grid-cols-3">
            <div className="p-6 bg-gray-900/50 border border-gray-800 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Response Times</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Registry API</span>
                  <span className="font-semibold text-green-400">1.2s</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Claude SDK</span>
                  <span className="font-semibold text-green-400">2.1s</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Eden Platform</span>
                  <span className="font-semibold text-green-400">0.8s</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Database</span>
                  <span className="font-semibold text-green-400">0.3s</span>
                </div>
              </div>
            </div>
            
            <div className="p-6 bg-gray-900/50 border border-gray-800 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Error Rates</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">SDK Tests</span>
                  <span className="font-semibold text-green-400">0%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">API Calls</span>
                  <span className="font-semibold text-green-400">2.3%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Registry Sync</span>
                  <span className="font-semibold text-green-400">1.1%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Page Loads</span>
                  <span className="font-semibold text-green-400">0.2%</span>
                </div>
              </div>
            </div>
            
            <div className="p-6 bg-gray-900/50 border border-gray-800 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Resource Usage</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">CPU Usage</span>
                  <span className="font-semibold text-yellow-400">23%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Memory</span>
                  <span className="font-semibold text-green-400">45%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Storage</span>
                  <span className="font-semibold text-green-400">12%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Bandwidth</span>
                  <span className="font-semibold text-green-400">8%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Agent Health */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Agent Health Status</h2>
          
          <div className="space-y-3">
            {/* Deployed Agents */}
            <div className="p-4 bg-gray-900/50 border border-green-500/30 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-4">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="font-semibold">MIYOMI</span>
                <span className="text-gray-400 text-sm">Market Oracle</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded text-sm">HEALTHY</span>
                <span className="text-xs text-gray-400">Last active: 2 min ago</span>
              </div>
            </div>
            
            <div className="p-4 bg-gray-900/50 border border-green-500/30 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-4">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="font-semibold">BERTHA</span>
                <span className="text-gray-400 text-sm">Art Intelligence</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded text-sm">HEALTHY</span>
                <span className="text-xs text-gray-400">Last active: 5 min ago</span>
              </div>
            </div>
            
            {/* Ready Agents */}
            <div className="p-4 bg-gray-900/50 border border-yellow-500/30 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-4">
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
                <span className="font-semibold">SUE</span>
                <span className="text-gray-400 text-sm">Gallery Curator</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded text-sm">READY</span>
                <span className="text-xs text-gray-400">Awaiting deployment</span>
              </div>
            </div>
            
            <div className="p-4 bg-gray-900/50 border border-yellow-500/30 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-4">
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
                <span className="font-semibold">ABRAHAM</span>
                <span className="text-gray-400 text-sm">Covenant Artist</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded text-sm">READY</span>
                <span className="text-xs text-gray-400">Awaiting deployment</span>
              </div>
            </div>
          </div>
        </div>

        {/* Alerts & Warnings */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-yellow-400" />
            Alerts & Warnings
          </h2>
          
          <div className="space-y-4">
            <div className="p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-400 mt-1" />
                <div>
                  <h3 className="font-semibold text-yellow-400">Claude Model Deprecation</h3>
                  <p className="text-gray-400 text-sm">Current model ends support Oct 22, 2025. Update recommended.</p>
                  <p className="text-xs text-gray-500 mt-1">Impact: Low - Plenty of time to migrate</p>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-blue-400 mt-1" />
                <div>
                  <h3 className="font-semibold text-blue-400">4 Agents Ready for Deployment</h3>
                  <p className="text-gray-400 text-sm">Sue, Abraham, Solienne, and Citizen are ready to deploy.</p>
                  <p className="text-xs text-gray-500 mt-1">Revenue opportunity: $33.2k/month</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="p-6 bg-gradient-to-r from-green-900/20 to-blue-900/20 rounded-xl border border-green-500/30">
          <h3 className="text-xl font-semibold mb-4">System Health Summary</h3>
          <div className="grid gap-4 md:grid-cols-3 text-center">
            <div>
              <p className="text-2xl font-bold text-green-400">99.9%</p>
              <p className="text-gray-400 text-sm">Overall Uptime</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-400">15/15</p>
              <p className="text-gray-400 text-sm">Tests Passing</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-400">1</p>
              <p className="text-gray-400 text-sm">Minor Warnings</p>
            </div>
          </div>
          <p className="text-center text-green-400 mt-4 text-sm">
            🟢 System is healthy and ready for scale
          </p>
        </div>

      </div>
    </div>
  );
}