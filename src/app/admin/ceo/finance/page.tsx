'use client';

import Link from 'next/link';
import { Crown, ArrowLeft, DollarSign, TrendingUp, PieChart, BarChart3 } from 'lucide-react';

export default function CEOFinancePage() {
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
                <span className="text-white font-medium">Financial Overview</span>
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
        
        {/* Revenue Summary */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-green-400" />
            Revenue Analysis
          </h2>
          
          <div className="grid gap-6 md:grid-cols-3">
            <div className="p-6 bg-gradient-to-br from-green-900/20 to-green-800/10 border border-green-500/30 rounded-lg">
              <h3 className="text-lg font-semibold mb-2 text-green-400">Current Revenue</h3>
              <p className="text-3xl font-bold text-green-400">$27,000</p>
              <p className="text-sm text-gray-400">per month</p>
              <p className="text-xs text-green-400 mt-2">2 agents deployed</p>
            </div>
            
            <div className="p-6 bg-gradient-to-br from-yellow-900/20 to-yellow-800/10 border border-yellow-500/30 rounded-lg">
              <h3 className="text-lg font-semibold mb-2 text-yellow-400">Revenue Gap</h3>
              <p className="text-3xl font-bold text-yellow-400">$49,700</p>
              <p className="text-sm text-gray-400">opportunity</p>
              <p className="text-xs text-yellow-400 mt-2">4 agents ready to deploy</p>
            </div>
            
            <div className="p-6 bg-gradient-to-br from-purple-900/20 to-purple-800/10 border border-purple-500/30 rounded-lg">
              <h3 className="text-lg font-semibold mb-2 text-purple-400">Full Potential</h3>
              <p className="text-3xl font-bold text-purple-400">$76,700</p>
              <p className="text-sm text-gray-400">per month</p>
              <p className="text-xs text-purple-400 mt-2">$920k annually</p>
            </div>
          </div>
        </div>

        {/* Agent Revenue Breakdown */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-blue-400" />
            Revenue by Agent
          </h2>
          
          <div className="space-y-3">
            {/* Deployed */}
            <div className="p-4 bg-gray-900/50 border border-green-500/30 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                <span className="font-semibold">MIYOMI</span>
                <span className="text-gray-400 text-sm">Market Oracle</span>
              </div>
              <div className="text-right">
                <span className="text-green-400 font-bold">$15,000</span>
                <span className="text-gray-400 text-sm ml-2">DEPLOYED</span>
              </div>
            </div>
            
            <div className="p-4 bg-gray-900/50 border border-green-500/30 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                <span className="font-semibold">BERTHA</span>
                <span className="text-gray-400 text-sm">Art Intelligence</span>
              </div>
              <div className="text-right">
                <span className="text-green-400 font-bold">$12,000</span>
                <span className="text-gray-400 text-sm ml-2">DEPLOYED</span>
              </div>
            </div>
            
            {/* Ready to Deploy */}
            <div className="p-4 bg-gray-900/50 border border-yellow-500/30 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
                <span className="font-semibold">ABRAHAM</span>
                <span className="text-gray-400 text-sm">Covenant Artist</span>
              </div>
              <div className="text-right">
                <span className="text-yellow-400 font-bold">$12,500</span>
                <span className="text-gray-400 text-sm ml-2">READY</span>
              </div>
            </div>
            
            <div className="p-4 bg-gray-900/50 border border-yellow-500/30 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
                <span className="font-semibold">SOLIENNE</span>
                <span className="text-gray-400 text-sm">Consciousness</span>
              </div>
              <div className="text-right">
                <span className="text-yellow-400 font-bold">$8,500</span>
                <span className="text-gray-400 text-sm ml-2">READY</span>
              </div>
            </div>
            
            <div className="p-4 bg-gray-900/50 border border-yellow-500/30 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
                <span className="font-semibold">CITIZEN</span>
                <span className="text-gray-400 text-sm">DAO Manager</span>
              </div>
              <div className="text-right">
                <span className="text-yellow-400 font-bold">$8,200</span>
                <span className="text-gray-400 text-sm ml-2">READY</span>
              </div>
            </div>
            
            <div className="p-4 bg-gray-900/50 border border-yellow-500/30 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
                <span className="font-semibold">SUE</span>
                <span className="text-gray-400 text-sm">Gallery Curator</span>
              </div>
              <div className="text-right">
                <span className="text-yellow-400 font-bold">$4,500</span>
                <span className="text-gray-400 text-sm ml-2">READY</span>
              </div>
            </div>
            
            {/* In Development */}
            <div className="p-4 bg-gray-900/50 border border-red-500/30 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                <span className="font-semibold">GEPPETTO</span>
                <span className="text-gray-400 text-sm">Toy Maker</span>
              </div>
              <div className="text-right">
                <span className="text-red-400 font-bold">$8,500</span>
                <span className="text-gray-400 text-sm ml-2">DEVELOPMENT</span>
              </div>
            </div>
            
            <div className="p-4 bg-gray-900/50 border border-red-500/30 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                <span className="font-semibold">KORU</span>
                <span className="text-gray-400 text-sm">Community</span>
              </div>
              <div className="text-right">
                <span className="text-red-400 font-bold">$7,500</span>
                <span className="text-gray-400 text-sm ml-2">DEVELOPMENT</span>
              </div>
            </div>
          </div>
        </div>

        {/* Cost Analysis */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <PieChart className="w-6 h-6 text-orange-400" />
            Cost Structure
          </h2>
          
          <div className="grid gap-6 md:grid-cols-2">
            <div className="p-6 bg-gray-900/50 border border-gray-800 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Monthly Operating Costs</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Claude API Usage</span>
                  <span className="font-semibold">$2,100</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Infrastructure (Vercel)</span>
                  <span className="font-semibold">$450</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Registry Hosting</span>
                  <span className="font-semibold">$120</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Database (Supabase)</span>
                  <span className="font-semibold">$95</span>
                </div>
                <div className="border-t border-gray-700 pt-2 flex justify-between font-bold">
                  <span>Total Monthly Costs</span>
                  <span className="text-red-400">$2,765</span>
                </div>
              </div>
            </div>
            
            <div className="p-6 bg-gray-900/50 border border-gray-800 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Profit Analysis</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Current Revenue</span>
                  <span className="font-semibold text-green-400">$27,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Operating Costs</span>
                  <span className="font-semibold text-red-400">-$2,765</span>
                </div>
                <div className="border-t border-gray-700 pt-2 flex justify-between font-bold text-lg">
                  <span>Net Profit</span>
                  <span className="text-green-400">$24,235</span>
                </div>
                <div className="text-xs text-gray-500">
                  Profit Margin: 89.8%
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Financial Projections */}
        <div className="p-6 bg-gradient-to-r from-green-900/20 to-blue-900/20 rounded-xl border border-green-500/30">
          <h3 className="text-xl font-semibold mb-4">Full Deployment Projections</h3>
          <div className="grid gap-4 md:grid-cols-3 text-center">
            <div>
              <p className="text-2xl font-bold text-green-400">$920k</p>
              <p className="text-gray-400 text-sm">Annual Revenue</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-red-400">$42k</p>
              <p className="text-gray-400 text-sm">Annual Costs</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-400">$878k</p>
              <p className="text-gray-400 text-sm">Annual Profit</p>
            </div>
          </div>
          <p className="text-center text-purple-400 mt-4 text-sm">
            95.4% profit margin with all 8 agents deployed
          </p>
        </div>

      </div>
    </div>
  );
}