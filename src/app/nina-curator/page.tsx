'use client';

import { useEffect } from 'react';
import { UnifiedHeader } from '@/components/layout/UnifiedHeader';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NinaCuratorPage() {
  useEffect(() => {
    // Auto-redirect after a brief moment to show the page
    const timer = setTimeout(() => {
      window.location.href = 'https://design-critic-agent.vercel.app';
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <UnifiedHeader />

      {/* Back Navigation */}
      <div className="border-b border-white">
        <div className="max-w-4xl mx-auto px-6 py-3">
          <Link 
            href="/academy" 
            className="inline-flex items-center gap-2 text-sm hover:bg-white hover:text-black px-2 py-1 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            BACK TO ACADEMY
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-2xl w-full text-center">
          <h1 className="text-6xl font-bold mb-4">NINA ROEHRS CURATOR</h1>
          <p className="text-xl mb-12">
            AI-POWERED CURATION TOOL EVALUATING WORK AGAINST PARIS PHOTO STANDARDS
          </p>

          {/* Mode badges */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <span className="px-4 py-2 border border-white text-sm">
              SINGLE MODE
            </span>
            <span className="px-4 py-2 border border-white text-sm">
              BATCH MODE
            </span>
            <span className="px-4 py-2 border border-white text-sm">
              PLAYOFF MODE
            </span>
          </div>

          {/* Redirecting message */}
          <div className="mb-12 p-8 border border-white">
            <p className="text-lg mb-4">OPENING NINA CURATOR IN NEW WINDOW...</p>
            <div className="w-full border border-white h-2 mb-4">
              <div className="bg-white h-2 animate-pulse" style={{ width: '75%' }}></div>
            </div>
            <p className="text-sm">THE CURATOR WORKS BEST WHEN OPENED DIRECTLY</p>
          </div>

          {/* Manual redirect button */}
          <a
            href="https://design-critic-agent.vercel.app"
            className="inline-block px-8 py-4 border border-white hover:bg-white hover:text-black transition-all font-bold"
          >
            OPEN NINA CURATOR →
          </a>

          {/* Navigation links */}
          <div className="mt-12 flex items-center justify-center gap-6 text-sm">
            <Link
              href="/academy/agent/solienne"
              className="hover:bg-white hover:text-black px-2 py-1 transition-colors"
            >
              VIEW SOLIENNE'S PROFILE
            </Link>
          </div>

          {/* Info */}
          <div className="mt-12 text-xs">
            <p>POWERED BY ANTHROPIC CLAUDE</p>
            <p className="mt-1">EDEN ACADEMY × NINA ROEHRS</p>
          </div>
        </div>
      </div>
    </div>
  );
}