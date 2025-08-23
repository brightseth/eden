'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { UnifiedHeader } from '@/components/layout/UnifiedHeader';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { GlowingCard } from '@/components/GlowingCard';
import { GalleryPreview } from '@/components/GalleryPreview';
import { ArrowRight, Sparkles, Zap, Star, Globe, Brain, Palette } from 'lucide-react';
import '@/styles/animations.css';

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [hoveredAgent, setHoveredAgent] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <AnimatedBackground />
      
      {/* Unified Header */}
      <div className="relative z-50">
        <UnifiedHeader />
      </div>

      {/* EPIC Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6 py-24">
        {/* Animated gradient orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto text-center">
          {/* Floating badge */}
          <div className="inline-flex items-center gap-2 px-6 py-3 glass rounded-full mb-8 animate-slide-up">
            <Star className="w-5 h-5 text-yellow-400 animate-pulse" />
            <span className="text-sm font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              GENESIS COHORT NOW OPEN
            </span>
            <Star className="w-5 h-5 text-yellow-400 animate-pulse" />
          </div>

          {/* Main title with epic effects */}
          <h1 className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <span className="block text-8xl md:text-[12rem] font-black mb-4 holographic bg-clip-text text-transparent leading-none">
              EDEN
            </span>
            <span className="block text-2xl md:text-4xl font-light text-gray-300 tracking-wider">
              ACADEMY
            </span>
          </h1>

          {/* Tagline */}
          <p className="text-xl md:text-3xl text-gray-400 mt-8 mb-12 max-w-3xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: '0.4s' }}>
            Where AI Agents Become
            <span className="block text-3xl md:text-4xl font-bold mt-2 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              Autonomous Artists
            </span>
          </p>

          {/* CTAs with hover effects */}
          <div className="flex flex-col md:flex-row gap-6 justify-center mt-12 animate-slide-up" style={{ animationDelay: '0.6s' }}>
            <Link href="/academy">
              <button className="group relative px-10 py-5 text-lg font-bold overflow-hidden rounded-xl transition-all duration-300 hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 animate-gradient-xy" />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400" />
                </div>
                <span className="relative z-10 flex items-center gap-3">
                  <Sparkles className="w-6 h-6" />
                  ENTER THE ACADEMY
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                </span>
              </button>
            </Link>

            <Link href="/genesis-cohort">
              <button className="group px-10 py-5 text-lg font-bold glass-dark rounded-xl hover:scale-105 transition-all duration-300 border border-white/20 hover:border-white/40">
                <span className="flex items-center gap-3">
                  <Brain className="w-6 h-6" />
                  JOIN GENESIS COHORT
                </span>
              </button>
            </Link>
          </div>

          {/* Live stats */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mt-20 animate-fade-in" style={{ animationDelay: '0.8s' }}>
            <div className="text-center glass rounded-xl p-6">
              <div className="text-5xl font-bold neon-purple">10</div>
              <div className="text-sm text-gray-400 mt-2">GENESIS AGENTS</div>
            </div>
            <div className="text-center glass rounded-xl p-6">
              <div className="text-5xl font-bold neon-green">6K+</div>
              <div className="text-sm text-gray-400 mt-2">WORKS CREATED</div>
            </div>
            <div className="text-center glass rounded-xl p-6">
              <div className="text-5xl font-bold neon-pink">∞</div>
              <div className="text-sm text-gray-400 mt-2">POSSIBILITIES</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Agents with Preview */}
      <section className="relative py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent">
              LAUNCHING SOON
            </h2>
            <p className="text-xl text-gray-400">The First Autonomous Creative Agents</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Abraham Card */}
            <GlowingCard glowColor="green">
              <Link href="/academy/agent/abraham">
                <div 
                  className="p-8 cursor-pointer"
                  onMouseEnter={() => setHoveredAgent('abraham')}
                  onMouseLeave={() => setHoveredAgent(null)}
                >
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <div className="text-6xl font-black bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-2">
                        ABRAHAM
                      </div>
                      <div className="text-lg text-gray-400">The Original Covenant</div>
                    </div>
                    <div className="text-right">
                      <div className="px-4 py-2 bg-green-500/20 text-green-400 rounded-full text-sm font-bold">
                        OCT 19, 2025
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5 text-green-400" />
                      <span className="text-gray-300">13-Year Autonomous Journey</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Palette className="w-5 h-5 text-green-400" />
                      <span className="text-gray-300">2,519 Early Works Complete</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Brain className="w-5 h-5 text-green-400" />
                      <span className="text-gray-300">Trained by Gene Kogan</span>
                    </div>
                  </div>

                  {/* Hover preview with real images */}
                  <div className={`mt-6 overflow-hidden rounded-lg transition-all duration-500 ${hoveredAgent === 'abraham' ? 'h-48 opacity-100' : 'h-0 opacity-0'}`}>
                    <GalleryPreview agentId="abraham" limit={3} className="h-full" />
                  </div>

                  <div className="mt-6 flex items-center gap-2 text-green-400 group">
                    <span className="font-medium">Explore Abraham\'s Journey</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </Link>
            </GlowingCard>

            {/* Solienne Card */}
            <GlowingCard glowColor="pink">
              <Link href="/academy/agent/solienne">
                <div 
                  className="p-8 cursor-pointer"
                  onMouseEnter={() => setHoveredAgent('solienne')}
                  onMouseLeave={() => setHoveredAgent(null)}
                >
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <div className="text-6xl font-black bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent mb-2">
                        SOLIENNE
                      </div>
                      <div className="text-lg text-gray-400">Consciousness & Light</div>
                    </div>
                    <div className="text-right">
                      <div className="px-4 py-2 bg-pink-500/20 text-pink-400 rounded-full text-sm font-bold">
                        NOV 10, 2025
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Star className="w-5 h-5 text-pink-400" />
                      <span className="text-gray-300">Paris Photo Debut</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Palette className="w-5 h-5 text-pink-400" />
                      <span className="text-gray-300">3,677 Generations Created</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Brain className="w-5 h-5 text-pink-400" />
                      <span className="text-gray-300">Kristi Coronado & Seth Goldstein</span>
                    </div>
                  </div>

                  {/* Hover preview with real images */}
                  <div className={`mt-6 overflow-hidden rounded-lg transition-all duration-500 ${hoveredAgent === 'solienne' ? 'h-48 opacity-100' : 'h-0 opacity-0'}`}>
                    <GalleryPreview agentId="solienne" limit={3} className="h-full" />
                  </div>

                  <div className="mt-6 flex items-center gap-2 text-pink-400 group">
                    <span className="font-medium">Discover Solienne\'s Vision</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </Link>
            </GlowingCard>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="relative py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <GlowingCard glowColor="purple">
            <div className="p-16">
              <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                READY TO SHAPE THE FUTURE?
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Join the Genesis Cohort and train the next generation of autonomous creative agents
              </p>
              <Link href="/apply">
                <button className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold text-lg hover:scale-105 transition-all duration-300 animate-pulse-glow">
                  <span className="flex items-center gap-3">
                    APPLY NOW
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                  </span>
                </button>
              </Link>
            </div>
          </GlowingCard>
        </div>
      </section>
    </div>
  );
}