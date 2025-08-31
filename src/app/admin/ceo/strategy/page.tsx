'use client';

import Link from 'next/link';
import { Crown, ArrowLeft, Target, TrendingUp, Users, Calendar, Brain, Eye } from 'lucide-react';

export default function CEOStrategyPage() {
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
                <span className="text-white font-medium">Strategic Planning</span>
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
        
        {/* Strategic Intelligence Tools */}
        <div className="mb-8 grid gap-4 md:grid-cols-2">
          <Link
            href="/admin/ceo/gigabrain"
            className="p-6 bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-500/30 rounded-lg hover:border-purple-400 transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <Brain className="w-8 h-8 text-purple-400" />
              <span className="text-xs px-2 py-1 bg-purple-500/20 text-purple-400 rounded">NEW</span>
            </div>
            <h3 className="text-xl font-bold mb-2 group-hover:text-purple-400 transition-colors">GIGABRAIN INTELLIGENCE</h3>
            <p className="text-gray-400 text-sm">Intelligent training system with Abraham & Solienne patterns. Reduce training from 2 weeks to 4 days.</p>
          </Link>
          
          <Link
            href="/admin/ceo/vision"
            className="p-6 bg-gradient-to-r from-blue-900/20 to-green-900/20 border border-blue-500/30 rounded-lg hover:border-blue-400 transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <Eye className="w-8 h-8 text-blue-400" />
              <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded">UPDATED</span>
            </div>
            <h3 className="text-xl font-bold mb-2 group-hover:text-blue-400 transition-colors">STRATEGIC VISION</h3>
            <p className="text-gray-400 text-sm">Eden narrative: The Future of Creative Autonomy. Nested token economics and phases.</p>
          </Link>
        </div>

        {/* Current Strategic Objectives */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Target className="w-6 h-6 text-blue-400" />
            Current Strategic Objectives
          </h2>
          
          <div className="grid gap-6 md:grid-cols-2">
            {/* Q1 2025 Goals */}
            <div className="p-6 bg-gray-900/50 border border-gray-800 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Q1 2025 - Agent Deployment</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Deploy remaining 6 agents</span>
                  <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-sm">In Progress</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Achieve $76k monthly revenue</span>
                  <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-sm">Target</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">100% dual instantiation</span>
                  <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-sm">On Track</span>
                </div>
              </div>
            </div>

            {/* H1 2025 Goals */}
            <div className="p-6 bg-gray-900/50 border border-gray-800 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">H1 2025 - Market Expansion</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Launch Paris Photo presence</span>
                  <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-sm">Planned</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Enterprise partnerships</span>
                  <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-sm">Research</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">Scale to 10k users</span>
                  <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-sm">Goal</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics & KPIs */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-green-400" />
            Key Performance Indicators
          </h2>
          
          <div className="grid gap-4 md:grid-cols-4">
            <div className="p-4 bg-gray-900/50 border border-gray-800 rounded-lg text-center">
              <p className="text-3xl font-bold text-green-400">2/8</p>
              <p className="text-gray-400 text-sm">Agents Deployed</p>
              <p className="text-xs text-green-400">Target: 8/8 by Q1</p>
            </div>
            <div className="p-4 bg-gray-900/50 border border-gray-800 rounded-lg text-center">
              <p className="text-3xl font-bold text-yellow-400">$27k</p>
              <p className="text-gray-400 text-sm">Monthly Revenue</p>
              <p className="text-xs text-yellow-400">Target: $76k</p>
            </div>
            <div className="p-4 bg-gray-900/50 border border-gray-800 rounded-lg text-center">
              <p className="text-3xl font-bold text-blue-400">4,259</p>
              <p className="text-gray-400 text-sm">Works Created</p>
              <p className="text-xs text-blue-400">+147 this week</p>
            </div>
            <div className="p-4 bg-gray-900/50 border border-gray-800 rounded-lg text-center">
              <p className="text-3xl font-bold text-purple-400">99.9%</p>
              <p className="text-gray-400 text-sm">System Uptime</p>
              <p className="text-xs text-purple-400">Enterprise grade</p>
            </div>
          </div>
        </div>

        {/* Strategic Roadmap */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-purple-400" />
            Strategic Roadmap 2025
          </h2>
          
          <div className="space-y-6">
            <div className="p-6 bg-gray-900/50 border border-gray-800 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Phase 1: Core Agent Deployment</h3>
                <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-lg text-sm">CURRENT</span>
              </div>
              <ul className="text-gray-400 space-y-2">
                <li>• Deploy Sue, Solienne, Abraham, Citizen (4 agents)</li>
                <li>• Achieve dual instantiation for all production agents</li>
                <li>• Implement production monitoring and alerting</li>
                <li>• Establish revenue tracking and optimization</li>
              </ul>
            </div>

            <div className="p-6 bg-gray-900/50 border border-gray-800 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Phase 2: Platform Completion</h3>
                <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-sm">NEXT</span>
              </div>
              <ul className="text-gray-400 space-y-2">
                <li>• Build Geppetto and Koru SDKs + sites</li>
                <li>• Complete 8-agent ecosystem</li>
                <li>• Launch comprehensive monitoring dashboard</li>
                <li>• Optimize performance and cost efficiency</li>
              </ul>
            </div>

            <div className="p-6 bg-gray-900/50 border border-gray-800 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Phase 3: Market Expansion</h3>
                <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-lg text-sm">PLANNED</span>
              </div>
              <ul className="text-gray-400 space-y-2">
                <li>• Paris Photo 2025 launch with Solienne</li>
                <li>• Enterprise partnerships and B2B offerings</li>
                <li>• International market expansion</li>
                <li>• Next generation agent capabilities</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Quick Strategic Actions */}
        <div className="p-6 bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-xl border border-blue-500/30">
          <h3 className="text-xl font-semibold mb-4">Immediate Strategic Actions</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="font-semibold text-blue-400 mb-2">This Week</h4>
              <ul className="text-gray-400 text-sm space-y-1">
                <li>• Deploy Sue (Gallery Curator)</li>
                <li>• Deploy Abraham (Covenant Artist)</li>
                <li>• Validate revenue tracking systems</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-purple-400 mb-2">This Month</h4>
              <ul className="text-gray-400 text-sm space-y-1">
                <li>• Complete all 4 ready agent deployments</li>
                <li>• Begin Geppetto and Koru development</li>
                <li>• Implement comprehensive monitoring</li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}