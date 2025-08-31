'use client';

import Link from 'next/link';
import { Crown, ArrowLeft, Users, Shield, Target } from 'lucide-react';
import { AgentLink } from '@/components/common/AgentLink';

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
        
        {/* Team Summary */}
        <div className="mb-8 p-6 bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-xl border border-purple-500/30">
          <h2 className="text-2xl font-bold mb-4">Eden Academy Core Team</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-gray-400 text-sm">Core Team</p>
              <p className="text-3xl font-bold">7</p>
              <p className="text-xs text-gray-500">team members</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">External Trainers</p>
              <p className="text-3xl font-bold text-green-400">6</p>
              <p className="text-xs text-gray-500">agent partners</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Agents Deployed</p>
              <p className="text-3xl font-bold text-yellow-400">10</p>
              <p className="text-xs text-gray-500">Genesis cohort</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Training Progress</p>
              <p className="text-3xl font-bold text-blue-400">52%</p>
              <p className="text-xs text-gray-500">average completion</p>
            </div>
          </div>
        </div>
        
        {/* Team Overview */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-400" />
            Team Structure
          </h2>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Core Team */}
            <div className="p-6 bg-gray-900/50 border border-gray-800 rounded-lg md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <Crown className="w-5 h-5 text-yellow-500" />
                <h3 className="text-lg font-semibold">Core Eden Team</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-x-6 gap-y-3">
                <div className="flex items-center justify-between">
                  <span>Seth Goldstein</span>
                  <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-xs">CEO</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Gene Kogan</span>
                  <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">Co-Founder</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Xander</span>
                  <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs">Co-Founder</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Henry</span>
                  <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs">On-Chain Dev</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>JMill</span>
                  <span className="px-2 py-1 bg-orange-500/20 text-orange-400 rounded text-xs">Full Stack Dev</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Bashy</span>
                  <span className="px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded text-xs">Dev</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Claude Code</span>
                  <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs">AI Development</span>
                </div>
              </div>
            </div>

            {/* Agent Trainer Partnerships */}
            <div className="p-6 bg-gray-900/50 border border-gray-800 rounded-lg">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-5 h-5 text-green-500" />
                <h3 className="text-lg font-semibold">Agent Training Partners</h3>
              </div>
              <div className="space-y-3">
                <div className="text-xs font-semibold text-gray-400 mb-2">TEAM MEMBERS AS TRAINERS:</div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Gene Kogan</span>
                  <AgentLink agentName="ABRAHAM" className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs hover:bg-blue-500/30">
                    ABRAHAM
                  </AgentLink>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Seth Goldstein</span>
                  <AgentLink agentName="MIYOMI" className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs hover:bg-green-500/30">
                    MIYOMI
                  </AgentLink>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Henry</span>
                  <AgentLink agentName="CITIZEN" className="px-2 py-1 bg-orange-500/20 text-orange-400 rounded text-xs hover:bg-orange-500/30">
                    CITIZEN
                  </AgentLink>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Xander</span>
                  <AgentLink agentName="KORU" className="px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded text-xs hover:bg-cyan-500/30">
                    KORU
                  </AgentLink>
                </div>
                
                <div className="text-xs font-semibold text-gray-400 mt-4 mb-2">EXTERNAL TRAINERS:</div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Kristi Coronado</span>
                  <AgentLink agentName="SOLIENNE" className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs hover:bg-purple-500/30">
                    SOLIENNE
                  </AgentLink>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Amanda Schmitt</span>
                  <AgentLink agentName="BERTHA" className="px-2 py-1 bg-pink-500/20 text-pink-400 rounded text-xs hover:bg-pink-500/30">
                    BERTHA
                  </AgentLink>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Martin & Colin</span>
                  <AgentLink agentName="GEPPETTO" className="px-2 py-1 bg-indigo-500/20 text-indigo-400 rounded text-xs hover:bg-indigo-500/30">
                    GEPPETTO
                  </AgentLink>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Vanessa</span>
                  <AgentLink agentName="VERDELIS" className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded text-xs hover:bg-emerald-500/30">
                    VERDELIS
                  </AgentLink>
                </div>
                
                <div className="text-xs font-semibold text-gray-400 mt-4 mb-2">SEEKING TRAINERS:</div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Open</span>
                  <AgentLink agentName="SUE" className="px-2 py-1 bg-gray-500/20 text-gray-400 rounded text-xs hover:bg-gray-500/30">
                    SUE
                  </AgentLink>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Open</span>
                  <AgentLink agentName="BART" className="px-2 py-1 bg-gray-500/20 text-gray-400 rounded text-xs hover:bg-gray-500/30">
                    BART
                  </AgentLink>
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
                <h3 className="text-lg font-semibold">Genesis Cohort Launch</h3>
                <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-lg text-sm">IN PROGRESS</span>
              </div>
              <p className="text-gray-400 mb-3">Complete deployment of all 10 Genesis agents with trainers</p>
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <p className="text-sm font-semibold text-green-400 mb-1">Completed:</p>
                  <ul className="text-xs text-gray-400">
                    <li>• 10 agents designed and configured</li>
                    <li>• 8 trainers onboarded</li>
                    <li>• Registry infrastructure operational</li>
                    <li>• CEO Dashboard with live status</li>
                  </ul>
                </div>
                <div>
                  <p className="text-sm font-semibold text-yellow-400 mb-1">Next:</p>
                  <ul className="text-xs text-gray-400">
                    <li>• Find partners for SUE & VERDELIS</li>
                    <li>• Complete BART & VERDELIS SDKs</li>
                    <li>• Launch remaining 4 agents</li>
                    <li>• ABRAHAM covenant (Oct 19, 2025)</li>
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
          
          <div className="grid gap-6 md:grid-cols-4">
            <div className="p-4 bg-gray-900/50 border border-gray-800 rounded-lg text-center">
              <p className="text-3xl font-bold text-green-400">10/10</p>
              <p className="text-gray-400 text-sm">Agents Designed</p>
              <p className="text-xs text-green-400">100% complete</p>
            </div>
            <div className="p-4 bg-gray-900/50 border border-gray-800 rounded-lg text-center">
              <p className="text-3xl font-bold text-yellow-400">8/10</p>
              <p className="text-gray-400 text-sm">Trainers Assigned</p>
              <p className="text-xs text-yellow-400">SUE & BART seeking</p>
            </div>
            <div className="p-4 bg-gray-900/50 border border-gray-800 rounded-lg text-center">
              <p className="text-3xl font-bold text-blue-400">6/10</p>
              <p className="text-gray-400 text-sm">Launch Ready</p>
              <p className="text-xs text-blue-400">60% complete</p>
            </div>
            <div className="p-4 bg-gray-900/50 border border-gray-800 rounded-lg text-center">
              <p className="text-3xl font-bold text-purple-400">$89.7k</p>
              <p className="text-gray-400 text-sm">Monthly Revenue</p>
              <p className="text-xs text-purple-400">+38% growth</p>
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