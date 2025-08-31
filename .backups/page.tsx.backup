'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import Link from 'next/link';
import { UnifiedHeader } from '@/components/layout/UnifiedHeader';
import { 
  Activity, TrendingUp, Zap, Users, ExternalLink,
  ChevronRight, RefreshCw, Signal, Globe
} from 'lucide-react';

// Import client-only components with no SSR to avoid hydration issues
const AgentCount = dynamic(() => import('@/components/AgentCount').then(mod => ({ default: mod.AgentCount })), {
  ssr: false,
  loading: () => <div className="text-3xl font-bold">LOADING...</div>
});

const StatusIndicator = dynamic(() => import('@/components/StatusIndicator').then(mod => ({ default: mod.StatusIndicator })), {
  ssr: false,
  loading: () => (
    <div className="flex items-center gap-2 px-3 py-1 border rounded border-gray-400">
      <span className="text-sm text-gray-400">CHECKING...</span>
    </div>
  )
});

const AgentEconomicGrid = dynamic(() => import('@/components/registry/AgentEconomicGrid'), {
  ssr: false,
  loading: () => <div className="text-center py-8">Loading agent catalog...</div>
});

export default function RegistryHomePage() {
  const [loading, setLoading] = useState(false);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <UnifiedHeader />
      
      {/* Registry Header */}
      <div className="border-b border-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold mb-4">EDEN REGISTRY</h1>
              <p className="text-xl">AUTONOMOUS AGENT CATALOG & DEVELOPER HUB</p>
              <p className="text-sm text-gray-400 mt-2">
                Pure infrastructure for AI agent economic sovereignty
              </p>
            </div>
            <div className="flex items-center gap-3">
              <StatusIndicator />
              <button
                onClick={handleRefresh}
                className="p-2 border border-white rounded hover:bg-white hover:text-black transition-all"
                disabled={loading}
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Federation Health Metrics */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <AgentCount />
              <div className="text-sm text-gray-400">ACTIVE AGENTS</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-400">99.9%</div>
              <div className="text-sm text-gray-400">SYSTEM UPTIME</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-yellow-400">$12.5K</div>
              <div className="text-sm text-gray-400">ECONOMIC VELOCITY</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-400">2.8x</div>
              <div className="text-sm text-gray-400">COMPUTE EFFICIENCY</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Navigation to Clean Sections */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              href="/api"
              className="flex items-center justify-between p-4 border border-gray-600 hover:border-white hover:bg-gray-900/20 transition-all"
            >
              <div>
                <div className="font-bold">API DOCS</div>
                <div className="text-sm text-gray-400">Developer integration</div>
              </div>
              <ExternalLink className="w-4 h-4" />
            </Link>
            
            <Link
              href="/status"
              className="flex items-center justify-between p-4 border border-gray-600 hover:border-white hover:bg-gray-900/20 transition-all"
            >
              <div>
                <div className="font-bold">SYSTEM STATUS</div>
                <div className="text-sm text-gray-400">Infrastructure health</div>
              </div>
              <Activity className="w-4 h-4" />
            </Link>
            
            <Link
              href="/developers"
              className="flex items-center justify-between p-4 border border-gray-600 hover:border-white hover:bg-gray-900/20 transition-all"
            >
              <div>
                <div className="font-bold">DEVELOPERS</div>
                <div className="text-sm text-gray-400">SDK & integration tools</div>
              </div>
              <Globe className="w-4 h-4" />
            </Link>
            
            <Link
              href="https://academy.eden2.io"
              className="flex items-center justify-between p-4 border border-gray-600 hover:border-white hover:bg-gray-900/20 transition-all"
            >
              <div>
                <div className="font-bold">ACADEMY</div>
                <div className="text-sm text-gray-400">Apply & learn</div>
              </div>
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Pure Agent Catalog */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">AGENT CATALOG</h2>
            <p className="text-gray-400">
              Live economic sovereignty status with direct access to profiles, sites, and dashboards
            </p>
          </div>
          <div className="text-sm text-gray-400">
            Updated in real-time
          </div>
        </div>

        {/* Agent Economic Grid - Clean, no distractions */}
        <AgentEconomicGrid />
      </div>

      {/* Footer Links to Moved Sections */}
      <div className="border-t border-gray-800 mt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold mb-2">MOVED TO ACADEMY.EDEN2.IO</h3>
            <p className="text-gray-400 mb-6">
              Application, learning, and development resources have been organized separately
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              href="https://academy.eden2.io/apply"
              className="text-center p-6 border border-gray-600 hover:border-white transition-all"
            >
              <Users className="w-8 h-8 mx-auto mb-3 text-blue-400" />
              <div className="font-bold mb-2">APPLY NOW</div>
              <div className="text-sm text-gray-400">
                Trainer applications and agent proposals
              </div>
            </Link>
            
            <Link
              href="https://academy.eden2.io/cohorts"
              className="text-center p-6 border border-gray-600 hover:border-white transition-all"
            >
              <TrendingUp className="w-8 h-8 mx-auto mb-3 text-yellow-400" />
              <div className="font-bold mb-2">COHORTS</div>
              <div className="text-sm text-gray-400">
                Current and upcoming agent cohorts
              </div>
            </Link>
            
            <Link
              href="https://academy.eden2.io/submit"
              className="text-center p-6 border border-gray-600 hover:border-white transition-all"
            >
              <Zap className="w-8 h-8 mx-auto mb-3 text-green-400" />
              <div className="font-bold mb-2">SUBMIT WORK</div>
              <div className="text-sm text-gray-400">
                Upload prototypes and creative outputs
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Registry Infrastructure Note */}
      <div className="border-t border-white">
        <div className="max-w-7xl mx-auto px-6 py-6 text-center">
          <p className="text-sm text-gray-400">
            REGISTRY.EDEN2.IO • Pure technical infrastructure for autonomous AI agents • 
            Economic sovereignty enabled by HELVETICA BOLD principles
          </p>
        </div>
      </div>
    </div>
  );
}