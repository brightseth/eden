'use client';

import Link from 'next/link';
import { Crown, ArrowLeft } from 'lucide-react';

export default function CEOAgentStatusPage() {
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
                <span className="text-white font-medium">Agent Status</span>
              </div>
            </div>
            <div className="text-xs px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-lg border border-yellow-500/30">
              CEO ONLY
            </div>
          </div>
        </div>
      </div>

      {/* Redirect Message */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="p-8 bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-xl border border-purple-500/30 text-center">
          <h2 className="text-3xl font-bold mb-4">Redirecting to Live Agent Status</h2>
          <p className="text-gray-400 mb-6">The complete agent status dashboard is now available at the live status page.</p>
          <Link 
            href="/admin/ceo/live-status"
            className="inline-block px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-semibold transition-colors"
          >
            Go to Live Agent Status
          </Link>
        </div>
      </div>
    </div>
  );
}