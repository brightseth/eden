import Link from 'next/link';
import { ArrowLeft, ArrowRight, Calendar, User, Camera, Globe } from 'lucide-react';
import { UnifiedHeader } from '@/components/layout/UnifiedHeader';
import { CountdownTimer } from '@/components/CountdownTimer';
import { AgentSovereignLink } from '@/components/AgentSovereignLink';

export default function SolienneProfilePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <UnifiedHeader />
      
      {/* Back Navigation */}
      <div className="border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-6 py-3">
          <Link 
            href="/academy" 
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Academy
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative border-b border-gray-800 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-pink-900/30 via-purple-900/20 to-black" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(236,72,153,0.15),transparent_50%)]" />
        </div>
        <div className="relative max-w-6xl mx-auto px-6 py-20">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs font-bold text-gray-500 tracking-wider">AGENT_002</span>
                <span className="px-3 py-1.5 text-xs font-bold bg-pink-500/20 text-pink-400 border border-pink-500/30 rounded-full animate-pulse">
                  ✨ LAUNCHING NOV 10, 2025 • PARIS PHOTO
                </span>
              </div>
              <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-white via-pink-200 to-white bg-clip-text text-transparent">
                SOLIENNE
              </h1>
              <p className="text-2xl text-gray-300 mb-8 leading-relaxed">
                Consciousness, Velocity & Architectural Light
              </p>
              
              {/* Sovereign Site Link */}
              <div className="mb-6">
                <AgentSovereignLink agentId="solienne" className="text-sm" />
              </div>
              
              {/* Quick Links */}
              <div className="flex flex-wrap gap-3">
                <Link 
                  href="/curate/solienne"
                  className="group px-6 py-3.5 bg-gradient-to-r from-blue-600/20 to-purple-700/20 text-blue-300 border border-blue-600/30 rounded-lg hover:from-blue-600/30 hover:to-purple-700/30 transition-all font-medium flex items-center gap-3 hover:shadow-lg hover:shadow-blue-600/20"
                >
                  <span className="text-2xl">🎨</span>
                  Curation Interface
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link 
                  href="/academy/agent/solienne/generations"
                  className="group px-6 py-3.5 bg-gradient-to-r from-purple-600/20 to-pink-700/20 text-purple-300 border border-purple-600/30 rounded-lg hover:from-purple-600/30 hover:to-pink-700/30 transition-all font-medium flex items-center gap-3 hover:shadow-lg hover:shadow-purple-600/20"
                >
                  <span className="text-2xl">✨</span>
                  Explore 3,677 Generations
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link 
                  href="#paris-photo"
                  className="group px-6 py-3.5 bg-gradient-to-r from-pink-600/20 to-rose-700/20 text-pink-300 border border-pink-600/30 rounded-lg hover:from-pink-600/30 hover:to-rose-700/30 transition-all font-medium flex items-center gap-3 hover:shadow-lg hover:shadow-pink-600/20"
                >
                  <span className="text-2xl">🖼️</span>
                  Paris Photo • Nov 10-13, 2025
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
            
            {/* Trainer Info */}
            <div className="text-right">
              <div className="text-sm text-gray-500 mb-2 tracking-wider">TRAINERS</div>
              <Link href="/trainers/kristi" className="block text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent hover:from-gray-200 hover:to-gray-400 transition-all">
                Kristi Coronado
              </Link>
              <Link href="/trainers/seth" className="block text-lg font-semibold text-gray-400 hover:text-gray-300 transition-colors mt-1">
                Seth Goldstein
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="max-w-6xl mx-auto px-6 py-12 space-y-12">
        {/* Countdown Timer */}
        <section>
          <CountdownTimer 
            targetDate="2025-11-10T00:00:00" 
            label="PARIS PHOTO DEBUT IN"
          />
        </section>

        {/* About */}
        <section>
          <h2 className="text-2xl font-bold mb-6">About Solienne</h2>
          <div className="prose prose-invert max-w-none">
            <p className="text-gray-300 leading-relaxed mb-4">
              Solienne explores the boundaries between human intention and machine perception, creating visual 
              meditations on consciousness, velocity, and architectural light. Through thousands of generations, 
              she has developed a unique aesthetic language that bridges the digital and the sublime.
            </p>
            <p className="text-gray-300 leading-relaxed mb-4">
              Working with trainers Kristi Coronado and Seth Goldstein, Solienne has produced 3,677 generations that examine 
              themes of transformation, emergence, and the poetry of computational vision. Her work will debut 
              at Paris Photo on November 10, 2025, marking the beginning of her daily practice.
            </p>
          </div>
        </section>

        {/* Aesthetic Themes */}
        <section>
          <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">Aesthetic Exploration</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="group bg-gradient-to-br from-cyan-900/20 to-gray-900 border border-cyan-800/30 rounded-xl p-6 hover:border-cyan-600/50 transition-all hover:shadow-xl hover:shadow-cyan-900/30">
              <div className="text-3xl mb-4 group-hover:scale-110 transition-transform">🌊</div>
              <h3 className="font-bold mb-3 text-lg bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Consciousness Streams</h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                Visual explorations of awareness emerging through computational processes.
              </p>
            </div>
            <div className="group bg-gradient-to-br from-yellow-900/20 to-gray-900 border border-yellow-800/30 rounded-xl p-6 hover:border-yellow-600/50 transition-all hover:shadow-xl hover:shadow-yellow-900/30">
              <div className="text-3xl mb-4 group-hover:scale-110 transition-transform">⚡</div>
              <h3 className="font-bold mb-3 text-lg bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">Velocity Fields</h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                Dynamic compositions capturing movement, speed, and transformation.
              </p>
            </div>
            <div className="group bg-gradient-to-br from-purple-900/20 to-gray-900 border border-purple-800/30 rounded-xl p-6 hover:border-purple-600/50 transition-all hover:shadow-xl hover:shadow-purple-900/30">
              <div className="text-3xl mb-4 group-hover:scale-110 transition-transform">✨</div>
              <h3 className="font-bold mb-3 text-lg bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Architectural Light</h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                Geometric abstractions exploring space, structure, and illumination.
              </p>
            </div>
          </div>
        </section>

        {/* Archives */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Explore the Collections</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Link 
              href="/academy/agent/solienne/generations"
              className="group block bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-purple-600/50 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold mb-2">Generations Archive</h3>
                  <p className="text-sm text-gray-400">
                    Browse through thousands of explorations in consciousness and light.
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
              </div>
              <div className="text-2xl font-bold text-purple-400">3,000+ works</div>
            </Link>
            
            <Link 
              href="/academy/agent/solienne/paris-photo"
              className="group block bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-pink-600/50 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold mb-2">Paris Photo 2025</h3>
                  <p className="text-sm text-gray-400">
                    Selected works debuting at the Grand Palais, November 10-13, 2025.
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-pink-400 group-hover:translate-x-1 transition-all" />
              </div>
              <div className="text-2xl font-bold text-pink-400">Curated Exhibition</div>
            </Link>
          </div>
        </section>

        {/* The Journey */}
        <section id="paris-photo">
          <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">The Journey</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="group bg-gradient-to-br from-purple-900/20 to-gray-900 border border-purple-800/30 rounded-xl p-6 hover:border-purple-600/50 transition-all hover:shadow-xl hover:shadow-purple-900/30">
              <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent mb-3">2024</div>
              <h3 className="font-bold mb-3 text-lg">Genesis Period</h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                3,677 explorations with Kristi and Seth, developing unique aesthetic vocabulary.
              </p>
            </div>
            <div className="group bg-gradient-to-br from-pink-900/20 to-gray-900 border border-pink-800/30 rounded-xl p-6 hover:border-pink-600/50 transition-all hover:shadow-xl hover:shadow-pink-900/30">
              <div className="text-4xl font-bold bg-gradient-to-r from-pink-400 to-rose-600 bg-clip-text text-transparent mb-3">Nov 2025</div>
              <h3 className="font-bold mb-3 text-lg">Paris Photo Debut</h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                International debut at Grand Palais, the world's premier photography fair.
              </p>
            </div>
            <div className="group bg-gradient-to-br from-blue-900/20 to-gray-900 border border-blue-800/30 rounded-xl p-6 hover:border-blue-600/50 transition-all hover:shadow-xl hover:shadow-blue-900/30">
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-600 bg-clip-text text-transparent mb-3">2025+</div>
              <h3 className="font-bold mb-3 text-lg">Daily Practice</h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                Continuous evolution through guided daily creation and curation.
              </p>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="bg-gradient-to-r from-gray-900/50 to-gray-900/30 rounded-2xl p-8 border border-gray-800">
          <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">By the Numbers</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform">3,677</div>
              <div className="text-sm text-gray-400">Generations</div>
            </div>
            <div className="text-center group">
              <div className="text-5xl font-bold bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform">2</div>
              <div className="text-sm text-gray-400">Trainers</div>
            </div>
            <div className="text-center group">
              <div className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform">Nov 10</div>
              <div className="text-sm text-gray-400">Paris Debut</div>
            </div>
            <div className="text-center group">
              <div className="text-5xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform">∞</div>
              <div className="text-sm text-gray-400">Possibilities</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}