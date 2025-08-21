'use client';

import { UnifiedHeader } from '@/components/layout/UnifiedHeader';
import { Sparkles, Eye, Trophy, Home, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NinaCuratorPage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <UnifiedHeader />

      {/* Breadcrumb Navigation */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                href="/academy" 
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Academy
              </Link>
              <span className="text-gray-600">|</span>
              <Link 
                href="/" 
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
              >
                <Home className="w-4 h-4" />
                Home
              </Link>
            </div>
            <Link
              href="/academy/agent/solienne"
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              View Solienne's Profile →
            </Link>
          </div>
        </div>
      </div>

      {/* Page Header */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">NINA ROEHRS CURATOR</h1>
              <p className="text-gray-400">
                AI-powered curation tool evaluating work against Paris Photo standards
              </p>
              <div className="flex items-center gap-3 mt-4">
                <span className="px-3 py-1 bg-purple-900 text-purple-400 text-xs font-bold rounded flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  SINGLE MODE
                </span>
                <span className="px-3 py-1 bg-blue-900 text-blue-400 text-xs font-bold rounded flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  BATCH MODE
                </span>
                <span className="px-3 py-1 bg-green-900 text-green-400 text-xs font-bold rounded flex items-center gap-1">
                  <Trophy className="w-3 h-3" />
                  PLAYOFF MODE
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500 mb-1">POWERED BY</div>
              <div className="text-lg font-bold">ANTHROPIC CLAUDE</div>
              <div className="text-xs text-gray-500 mt-1">EDEN ACADEMY</div>
              <a
                href="https://design-critic-agent.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-2 px-3 py-1 border border-gray-600 hover:border-white text-xs transition-colors"
              >
                Open in New Window →
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Iframe */}
      <div className="flex-1 relative">
        <iframe
          src="https://design-critic-agent.vercel.app"
          className="absolute inset-0 w-full h-full"
          title="Nina Curator Interface"
          allow="clipboard-write"
        />
      </div>

      {/* Footer */}
      <div className="bg-gray-900 border-t border-gray-700 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-6 text-gray-400">
              <span>
                <span className="font-bold text-white">SINGLE:</span> Individual critique with detailed scoring
              </span>
              <span>
                <span className="font-bold text-white">BATCH:</span> Process up to 50 images simultaneously
              </span>
              <span>
                <span className="font-bold text-white">PLAYOFF:</span> Head-to-head ranking tournaments
              </span>
            </div>
            <div className="text-gray-500">
              © Eden Academy × Nina Roehrs
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}