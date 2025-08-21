'use client';

import { useEffect } from 'react';
import { UnifiedHeader } from '@/components/layout/UnifiedHeader';
import { Sparkles, Eye, Trophy, ExternalLink, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NinaCuratorPage() {
  useEffect(() => {
    // Auto-redirect after a brief moment to show the page
    const timer = setTimeout(() => {
      window.location.href = 'https://design-critic-agent.vercel.app';
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <UnifiedHeader />

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-2xl w-full text-center">
          <h1 className="text-4xl font-bold mb-4">NINA ROEHRS CURATOR</h1>
          <p className="text-gray-400 mb-8">
            AI-powered curation tool evaluating work against Paris Photo standards
          </p>

          {/* Mode badges */}
          <div className="flex items-center justify-center gap-3 mb-8">
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

          {/* Redirecting message */}
          <div className="mb-8 p-6 bg-gray-900 border border-gray-700 rounded-lg">
            <p className="text-sm text-gray-400 mb-4">Redirecting to Nina Curator...</p>
            <div className="w-full bg-gray-800 rounded-full h-2 mb-4">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
            </div>
            <p className="text-xs text-gray-500">You'll be redirected automatically, or click below to go now</p>
          </div>

          {/* Manual redirect button */}
          <a
            href="https://design-critic-agent.vercel.app"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded hover:from-purple-700 hover:to-pink-700 transition-all"
          >
            Open Nina Curator
            <ExternalLink className="w-4 h-4" />
          </a>

          {/* Navigation links */}
          <div className="mt-8 flex items-center justify-center gap-6 text-sm">
            <Link 
              href="/academy" 
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Academy
            </Link>
            <span className="text-gray-600">|</span>
            <Link
              href="/academy/agent/solienne"
              className="text-gray-400 hover:text-white transition-colors"
            >
              View Solienne's Profile
            </Link>
          </div>

          {/* Info */}
          <div className="mt-12 text-xs text-gray-500">
            <p>Powered by Anthropic Claude</p>
            <p className="mt-1">Eden Academy × Nina Roehrs</p>
          </div>
        </div>
      </div>
    </div>
  );
}