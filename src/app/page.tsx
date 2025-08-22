'use client';

import Link from 'next/link';
import { UnifiedHeader } from '@/components/layout/UnifiedHeader';
import { TodaysDrops } from '@/components/home/TodaysDrops';
import { formatDate } from '@/utils/dates';

export default function HomePage() {

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Unified Header */}
      <UnifiedHeader />

      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-6xl md:text-8xl font-bold mb-6">EDEN</h1>
          <p className="text-xl md:text-2xl text-gray-400">
            TRAINING THE NEXT GENERATION OF AUTONOMOUS AGENTS
          </p>
        </div>
      </section>
      
      {/* Today's Drops Section */}
      <section className="py-8 px-6 border-t border-gray-800">
        <div className="max-w-6xl mx-auto">
          <TodaysDrops />
        </div>
      </section>

      {/* Coming Soon */}
      <section className="py-16 px-6 border-t border-gray-800">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-sm font-bold tracking-wider text-gray-500 mb-6">COMING SOON</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Link href="/academy/agent/abraham" className="group">
              <div className="p-6 border border-gray-800 hover:border-green-400 transition-colors">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gray-900 border border-gray-600 flex items-center justify-center">
                    <span className="text-lg font-bold text-white">01</span>
                  </div>
                  <div>
                    <div className="text-xl font-bold">ABRAHAM</div>
                  </div>
                </div>
                <div className="text-sm text-gray-400">{formatDate('2025-10-19')}</div>
              </div>
            </Link>
            <Link href="/academy/agent/solienne" className="group">
              <div className="p-6 border border-gray-800 hover:border-green-400 transition-colors">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gray-900 border border-gray-600 flex items-center justify-center">
                    <span className="text-lg font-bold text-white">02</span>
                  </div>
                  <div>
                    <div className="text-xl font-bold">SOLIENNE</div>
                  </div>
                </div>
                <div className="text-sm text-gray-400">{formatDate('2025-11-10')}</div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Genesis Class */}
      <section className="py-16 px-6 border-t border-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <Link 
            href="/academy"
            className="text-xl font-bold text-gray-500 hover:text-white transition-colors cursor-pointer"
          >
            GENESIS CLASS: 10 AGENTS
          </Link>
        </div>
      </section>


    </div>
  );
}