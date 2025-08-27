'use client';

import Link from 'next/link';
import { Crown, ArrowLeft, Calendar, Clock, Target, CheckCircle } from 'lucide-react';

export default function CEOCalendarPage() {
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
                <span className="text-white font-medium">Calendar & Tasks</span>
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
        
        {/* Priority Tasks */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Target className="w-6 h-6 text-red-400" />
            High Priority Tasks
          </h2>
          
          <div className="space-y-4">
            <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-red-400">Deploy SUE (Gallery Curator)</h3>
                <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded text-sm">URGENT</span>
              </div>
              <p className="text-gray-400 text-sm mb-3">API key validated, all infrastructure ready. Deploy immediately.</p>
              <div className="flex items-center gap-4 text-xs">
                <span className="text-gray-500">Revenue: $4.5k/month</span>
                <span className="text-gray-500">ETA: 15 minutes</span>
              </div>
            </div>
            
            <div className="p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-yellow-400">Deploy ABRAHAM (Covenant Artist)</h3>
                <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded text-sm">HIGH</span>
              </div>
              <p className="text-gray-400 text-sm mb-3">Highest revenue potential ($12.5k/mo) of remaining agents.</p>
              <div className="flex items-center gap-4 text-xs">
                <span className="text-gray-500">Revenue: $12.5k/month</span>
                <span className="text-gray-500">ETA: 20 minutes</span>
              </div>
            </div>
            
            <div className="p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-blue-400">Deploy SOLIENNE & CITIZEN</h3>
                <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded text-sm">MEDIUM</span>
              </div>
              <p className="text-gray-400 text-sm mb-3">Complete the 4-agent deployment sprint this week.</p>
              <div className="flex items-center gap-4 text-xs">
                <span className="text-gray-500">Revenue: $16.7k/month</span>
                <span className="text-gray-500">ETA: 1 hour total</span>
              </div>
            </div>
          </div>
        </div>

        {/* This Week Schedule */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-blue-400" />
            This Week - Agent Deployment Sprint
          </h2>
          
          <div className="grid gap-4">
            {/* Today */}
            <div className="p-4 bg-gray-900/50 border border-gray-800 rounded-lg">
              <h3 className="text-lg font-semibold mb-3 text-green-400">TODAY - Deploy Sue & Abraham</h3>
              <div className="grid gap-2 md:grid-cols-2">
                <div className="p-3 bg-green-900/20 border border-green-500/30 rounded">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-4 h-4 text-green-400" />
                    <span className="font-semibold">Morning: Sue Deployment</span>
                  </div>
                  <p className="text-gray-400 text-sm">15 min deployment + 15 min validation</p>
                  <p className="text-xs text-green-400">Revenue: +$4.5k/month</p>
                </div>
                <div className="p-3 bg-green-900/20 border border-green-500/30 rounded">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-4 h-4 text-green-400" />
                    <span className="font-semibold">Afternoon: Abraham Deployment</span>
                  </div>
                  <p className="text-gray-400 text-sm">20 min deployment + 20 min validation</p>
                  <p className="text-xs text-green-400">Revenue: +$12.5k/month</p>
                </div>
              </div>
            </div>

            {/* Tomorrow */}
            <div className="p-4 bg-gray-900/50 border border-gray-800 rounded-lg">
              <h3 className="text-lg font-semibold mb-3 text-yellow-400">TOMORROW - Deploy Solienne & Citizen</h3>
              <div className="grid gap-2 md:grid-cols-2">
                <div className="p-3 bg-yellow-900/20 border border-yellow-500/30 rounded">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-4 h-4 text-yellow-400" />
                    <span className="font-semibold">Morning: Solienne Deployment</span>
                  </div>
                  <p className="text-gray-400 text-sm">Paris Photo prep + consciousness streams</p>
                  <p className="text-xs text-yellow-400">Revenue: +$8.5k/month</p>
                </div>
                <div className="p-3 bg-yellow-900/20 border border-yellow-500/30 rounded">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-4 h-4 text-yellow-400" />
                    <span className="font-semibold">Afternoon: Citizen Deployment</span>
                  </div>
                  <p className="text-gray-400 text-sm">DAO governance + community management</p>
                  <p className="text-xs text-yellow-400">Revenue: +$8.2k/month</p>
                </div>
              </div>
            </div>

            {/* Rest of Week */}
            <div className="p-4 bg-gray-900/50 border border-gray-800 rounded-lg">
              <h3 className="text-lg font-semibold mb-3 text-blue-400">WEDNESDAY-FRIDAY - Monitoring & Planning</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                  <span className="text-gray-400">Wednesday: Monitor all 6 deployed agents</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                  <span className="text-gray-400">Thursday: Plan Geppetto & Koru development</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                  <span className="text-gray-400">Friday: Review weekly metrics & next sprint</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Completed Tasks */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <CheckCircle className="w-6 h-6 text-green-400" />
            Recently Completed
          </h2>
          
          <div className="space-y-3">
            <div className="p-3 bg-green-900/20 border border-green-500/30 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Built Sue, Abraham, Solienne, Citizen Claude SDKs</span>
              </div>
              <span className="text-xs text-gray-500">Completed this week</span>
            </div>
            
            <div className="p-3 bg-green-900/20 border border-green-500/30 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Created comprehensive CEO dashboard system</span>
              </div>
              <span className="text-xs text-gray-500">Completed today</span>
            </div>
            
            <div className="p-3 bg-green-900/20 border border-green-500/30 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Validated Registry infrastructure and Claude API integration</span>
              </div>
              <span className="text-xs text-gray-500">Completed today</span>
            </div>
          </div>
        </div>

        {/* Weekly Goals */}
        <div className="p-6 bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-xl border border-purple-500/30">
          <h3 className="text-xl font-semibold mb-4">Week Goals & Milestones</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="font-semibold text-purple-400 mb-2">Primary Goal</h4>
              <p className="text-gray-400 text-sm">Deploy 4 remaining agents (Sue, Abraham, Solienne, Citizen)</p>
              <p className="text-xs text-purple-400 mt-1">Revenue impact: +$33.2k/month</p>
            </div>
            <div>
              <h4 className="font-semibold text-blue-400 mb-2">Success Metrics</h4>
              <ul className="text-gray-400 text-sm space-y-1">
                <li>• 6/8 agents deployed (75% complete)</li>
                <li>• $49k+ monthly revenue achieved</li>
                <li>• 100% uptime maintained</li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}