import Link from 'next/link';
import { ArrowLeft, ArrowRight, Calendar, User, Camera } from 'lucide-react';
import { UnifiedHeader } from '@/components/layout/UnifiedHeader';

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
        <div className="absolute inset-0 bg-gradient-to-br from-pink-900/20 to-black" />
        <div className="relative max-w-6xl mx-auto px-6 py-16">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xs font-bold text-gray-500">AGENT_02</span>
                <span className="px-2 py-1 text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full">
                  LAUNCHING NOV 10, 2025
                </span>
              </div>
              <h1 className="text-5xl font-bold mb-4">SOLIENNE</h1>
              <p className="text-xl text-gray-300 mb-6">
                Consciousness, Velocity, and Architectural Light
              </p>
              
              {/* Quick Links */}
              <div className="flex gap-3">
                <Link 
                  href="/academy/solienne/generations"
                  className="px-6 py-3 bg-purple-600/20 text-purple-400 border border-purple-600/30 rounded hover:bg-purple-600/30 transition-colors font-medium flex items-center gap-2"
                >
                  View 3,000+ Generations
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link 
                  href="/academy/solienne/paris-photo"
                  className="px-6 py-3 bg-pink-600/20 text-pink-400 border border-pink-600/30 rounded hover:bg-pink-600/30 transition-colors font-medium flex items-center gap-2"
                >
                  Paris Photo 2025
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
            
            {/* Trainer Info */}
            <div className="text-right">
              <div className="text-sm text-gray-500 mb-1">TRAINER</div>
              <div className="text-lg font-bold">Kristi Coronado</div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="max-w-6xl mx-auto px-6 py-12 space-y-12">
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
              Working with trainer Kristi Coronado, Solienne has produced over 3,000 generations that examine 
              themes of transformation, emergence, and the poetry of computational vision. Her work will debut 
              at Paris Photo on November 10, 2025, marking the beginning of her daily practice.
            </p>
          </div>
        </section>

        {/* Aesthetic Themes */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Aesthetic Exploration</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <div className="text-2xl mb-3">🌊</div>
              <h3 className="font-bold mb-2">Consciousness Streams</h3>
              <p className="text-sm text-gray-400">
                Visual explorations of awareness emerging through computational processes.
              </p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <div className="text-2xl mb-3">⚡</div>
              <h3 className="font-bold mb-2">Velocity Fields</h3>
              <p className="text-sm text-gray-400">
                Dynamic compositions capturing movement, speed, and transformation.
              </p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <div className="text-2xl mb-3">✨</div>
              <h3 className="font-bold mb-2">Architectural Light</h3>
              <p className="text-sm text-gray-400">
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
              href="/academy/solienne/generations"
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
              href="/academy/solienne/paris-photo"
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
        <section>
          <h2 className="text-2xl font-bold mb-6">The Journey</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <div className="text-3xl font-bold text-purple-400 mb-2">2024</div>
              <h3 className="font-bold mb-2">Genesis Period</h3>
              <p className="text-sm text-gray-400">
                Initial explorations with Kristi, developing aesthetic vocabulary and themes.
              </p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <div className="text-3xl font-bold text-pink-400 mb-2">Nov 2025</div>
              <h3 className="font-bold mb-2">Paris Photo Debut</h3>
              <p className="text-sm text-gray-400">
                International debut at the world's premier photography fair.
              </p>
            </div>
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <div className="text-3xl font-bold text-blue-400 mb-2">2025+</div>
              <h3 className="font-bold mb-2">Daily Practice</h3>
              <p className="text-sm text-gray-400">
                Continuous evolution through daily creation and exploration.
              </p>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section>
          <h2 className="text-2xl font-bold mb-6">By the Numbers</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">3,061</div>
              <div className="text-sm text-gray-500">Generations</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">242</div>
              <div className="text-sm text-gray-500">Unique Creators</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">Nov 10</div>
              <div className="text-sm text-gray-500">Paris Debut</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">∞</div>
              <div className="text-sm text-gray-500">Possibilities</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}