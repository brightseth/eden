'use client';

import Link from 'next/link';
import { Crown, ArrowLeft, Users, Shield, Target } from 'lucide-react';

export default function CEOTeamPage() {
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
                <span className="text-white font-medium">Team Dashboard</span>
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
        
        {/* Team Overview */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-400" />
            Eden Academy Team
          </h2>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Leadership */}
            <div className="p-6 bg-gray-900/50 border border-gray-800 rounded-lg">
              <div className="flex items-center gap-3 mb-4">
                <Crown className="w-5 h-5 text-yellow-500" />
                <h3 className="text-lg font-semibold">Leadership</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>Seth Goldstein</span>
                  <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-xs">CEO</span>
                </div>
              </div>
            </div>

            {/* Agent Trainers */}
            <div className="p-6 bg-gray-900/50 border border-gray-800 rounded-lg">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-5 h-5 text-green-500" />
                <h3 className="text-lg font-semibold">Agent Trainers</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>Gene Kogan</span>
                  <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">Abraham</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Kristi Coronado</span>
                  <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs">Solienne</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Amanda Schmitt</span>
                  <span className="px-2 py-1 bg-pink-500/20 text-pink-400 rounded text-xs">Bertha</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Seth Goldstein</span>
                  <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">Miyomi</span>
                </div>
              </div>
            </div>

            {/* Technical Team */}
            <div className="p-6 bg-gray-900/50 border border-gray-800 rounded-lg">
              <div className="flex items-center gap-3 mb-4">
                <Target className="w-5 h-5 text-red-500" />
                <h3 className="text-lg font-semibold">Technical</h3>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>Claude Code Agents</span>
                  <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs">Dev Team</span>
                </div>
                <div className="text-xs text-gray-500">
                  Architecture, Registry, Feature development
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Current Projects */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Current Projects</h2>
          
          <div className="space-y-4">
            <div className="p-6 bg-gray-900/50 border border-yellow-500/30 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Agent Deployment Sprint</h3>
                <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-lg text-sm">IN PROGRESS</span>
              </div>
              <p className="text-gray-400 mb-3">Deploy remaining 6 agents to achieve full 8-agent ecosystem</p>
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <p className="text-sm font-semibold text-green-400 mb-1">Completed:</p>
                  <ul className="text-xs text-gray-400">
                    <li>• Miyomi & Bertha deployed</li>
                    <li>• Sue, Abraham, Solienne, Citizen SDKs ready</li>
                    <li>• Registry infrastructure validated</li>
                  </ul>
                </div>
                <div>
                  <p className="text-sm font-semibold text-yellow-400 mb-1">Next:</p>
                  <ul className="text-xs text-gray-400">
                    <li>• Deploy 4 ready agents this week</li>
                    <li>• Build Geppetto & Koru SDKs</li>
                    <li>• Production monitoring dashboard</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="p-6 bg-gray-900/50 border border-blue-500/30 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Paris Photo 2025 Preparation</h3>
                <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-sm">PLANNED</span>
              </div>
              <p className="text-gray-400 mb-3">Solienne's first major public art exhibition</p>
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <p className="text-sm font-semibold text-blue-400 mb-1">Responsibilities:</p>
                  <ul className="text-xs text-gray-400">
                    <li>• Kristi: Solienne training & curation</li>
                    <li>• Seth: Platform integration</li>
                    <li>• Team: Production & logistics</li>
                  </ul>
                </div>
                <div>
                  <p className="text-sm font-semibold text-purple-400 mb-1">Timeline:</p>
                  <ul className="text-xs text-gray-400">
                    <li>• Q1: Solienne deployment & testing</li>
                    <li>• Q2: Exhibition preparation</li>
                    <li>• Q3: Paris Photo 2025 launch</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Team Performance */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Team Performance</h2>
          
          <div className="grid gap-6 md:grid-cols-3">
            <div className="p-4 bg-gray-900/50 border border-gray-800 rounded-lg text-center">
              <p className="text-3xl font-bold text-green-400">8/8</p>
              <p className="text-gray-400 text-sm">Agents Designed</p>
              <p className="text-xs text-green-400">100% complete</p>
            </div>
            <div className="p-4 bg-gray-900/50 border border-gray-800 rounded-lg text-center">
              <p className="text-3xl font-bold text-yellow-400">6/8</p>
              <p className="text-gray-400 text-sm">SDKs Built</p>
              <p className="text-xs text-yellow-400">75% complete</p>
            </div>
            <div className="p-4 bg-gray-900/50 border border-gray-800 rounded-lg text-center">
              <p className="text-3xl font-bold text-blue-400">2/8</p>
              <p className="text-gray-400 text-sm">Agents Deployed</p>
              <p className="text-xs text-blue-400">25% complete</p>
            </div>
          </div>
        </div>

        {/* Team Communication */}
        <div className="p-6 bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-xl border border-purple-500/30">
          <h3 className="text-xl font-semibold mb-4">Team Communication</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="font-semibold text-purple-400 mb-2">Regular Updates</h4>
              <ul className="text-gray-400 text-sm space-y-1">
                <li>• Daily: Agent deployment progress</li>
                <li>• Weekly: Performance metrics review</li>
                <li>• Monthly: Strategic planning sessions</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-blue-400 mb-2">Key Channels</h4>
              <ul className="text-gray-400 text-sm space-y-1">
                <li>• CEO Dashboard (this platform)</li>
                <li>• Direct trainer communications</li>
                <li>• Technical documentation</li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}