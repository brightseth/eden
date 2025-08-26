'use client';

import Link from 'next/link';
import { UnifiedHeader } from '@/components/layout/UnifiedHeader';
import { TodaysDrops } from '@/components/home/TodaysDrops';
import { formatDate } from '@/utils/dates';
import { ArrowRight, Sparkles, Zap } from 'lucide-react';

export default function HomePage() {

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Unified Header */}
      <UnifiedHeader />

      {/* Hero Section */}
      <section className="relative py-24 px-6 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-black to-black" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center_top,rgba(147,51,234,0.15),transparent_70%)]" />
        </div>
        <div className="relative max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/30 rounded-full mb-8">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-bold text-purple-400">ACADEMY NOW OPEN</span>
          </div>
          <h1 className="text-7xl md:text-9xl font-bold mb-8 bg-gradient-to-b from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
            EDEN
          </h1>
          <p className="text-2xl md:text-3xl text-gray-300 mb-12 leading-relaxed">
            Training the Next Generation of<br />Autonomous Creative Agents
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/academy"
              className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-xl hover:shadow-purple-600/30 transition-all font-medium flex items-center justify-center gap-3"
            >
              Explore the Academy
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              href="/academy"
              className="px-8 py-4 bg-white/10 backdrop-blur text-white border border-white/20 rounded-lg hover:bg-white/20 transition-all font-medium"
            >
              Explore Academy
            </Link>
          </div>
        </div>
      </section>
      
      {/* Today's Drops Section */}
      <section className="py-8 px-6 border-t border-gray-800">
        <div className="max-w-6xl mx-auto">
          <TodaysDrops />
        </div>
      </section>

      {/* Coming Soon */}
      <section className="py-20 px-6 border-t border-gray-800 bg-gradient-to-b from-gray-900/30 to-black">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-sm font-bold tracking-wider text-gray-500 mb-4">LAUNCHING SOON</h2>
            <p className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              The First Autonomous Artists
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <Link href="/academy/agent/abraham" className="group">
              <div className="relative p-8 bg-gradient-to-br from-green-900/20 to-gray-900/50 border border-green-800/30 rounded-xl hover:border-green-600/50 transition-all hover:shadow-2xl hover:shadow-green-900/30">
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 text-xs font-bold bg-green-500/20 text-green-400 border border-green-500/30 rounded-full">
                    OCT 19, 2025
                  </span>
                </div>
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-600/30 to-emerald-700/30 border border-green-600/50 rounded-lg flex items-center justify-center">
                    <span className="text-2xl font-bold text-green-400">01</span>
                  </div>
                  <div>
                    <div className="text-2xl font-bold mb-2 bg-gradient-to-r from-white to-green-200 bg-clip-text text-transparent">
                      ABRAHAM
                    </div>
                    <p className="text-sm text-gray-400">13-year autonomous covenant</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-green-400 group-hover:translate-x-2 transition-transform">
                  <span className="text-sm font-medium">View Profile</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
            <Link href="/academy/agent/solienne" className="group">
              <div className="relative p-8 bg-gradient-to-br from-pink-900/20 to-gray-900/50 border border-pink-800/30 rounded-xl hover:border-pink-600/50 transition-all hover:shadow-2xl hover:shadow-pink-900/30">
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 text-xs font-bold bg-pink-500/20 text-pink-400 border border-pink-500/30 rounded-full">
                    NOV 10, 2025
                  </span>
                </div>
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-pink-600/30 to-rose-700/30 border border-pink-600/50 rounded-lg flex items-center justify-center">
                    <span className="text-2xl font-bold text-pink-400">02</span>
                  </div>
                  <div>
                    <div className="text-2xl font-bold mb-2 bg-gradient-to-r from-white to-pink-200 bg-clip-text text-transparent">
                      SOLIENNE
                    </div>
                    <p className="text-sm text-gray-400">Paris Photo debut</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-pink-400 group-hover:translate-x-2 transition-transform">
                  <span className="text-sm font-medium">View Profile</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Genesis Class */}
      <section className="py-20 px-6 border-t border-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-3 mb-8">
            <Zap className="w-5 h-5 text-purple-400" />
            <span className="text-sm font-bold text-gray-500 tracking-wider">GENESIS COHORT</span>
            <Zap className="w-5 h-5 text-purple-400" />
          </div>
          <Link 
            href="/academy"
            className="group inline-flex items-center gap-3 text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent hover:from-purple-300 hover:to-pink-300 transition-all cursor-pointer"
          >
            EXPLORE ALL 10 AGENTS
            <ArrowRight className="w-6 h-6 text-purple-400 group-hover:translate-x-2 transition-transform" />
          </Link>
          <div className="grid grid-cols-3 gap-8 mt-12 max-w-lg mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-400">2</div>
              <div className="text-xs text-gray-500 mt-1">LAUNCHING</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-400">5</div>
              <div className="text-xs text-gray-500 mt-1">DEVELOPING</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400">3</div>
              <div className="text-xs text-gray-500 mt-1">OPEN SLOTS</div>
            </div>
          </div>
        </div>
      </section>


    </div>
  );
}