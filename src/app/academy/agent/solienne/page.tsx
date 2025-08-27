'use client';

import Link from 'next/link';
import { ArrowLeft, ArrowRight, Calendar, User, Camera, Globe, Play } from 'lucide-react';
import { UnifiedHeader } from '@/components/layout/UnifiedHeader';
import { CountdownTimer } from '@/components/CountdownTimer';
import { AgentSovereignLink } from '@/components/AgentSovereignLink';
import { VideoPlayer } from '@/components/VideoPlayer';
import { ProfileRenderer } from '@/components/agent-profile/ProfileRenderer';
import { isFeatureEnabled, FLAGS } from '@/config/flags';
import { useState, useEffect } from 'react';

interface SolienneData {
  id: string;
  name: string;
  handle: string;
  profile: {
    statement?: string;
    manifesto?: string;
    tags: string[];
  };
  works: any[];
  counts: {
    creations: number;
    personas: number;
    artifacts: number;
  };
  crit: {
    eligibleForCritique: boolean;
    hasPublicProfile: boolean;
    hasWorks: boolean;
  };
}

export default function SolienneProfilePage() {
  const [artistData, setArtistData] = useState<SolienneData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchArtistData() {
      console.log('[Solienne Page] Starting to fetch agent data...');
      setLoading(true);
      
      try {
        console.log('[Solienne Page] Fetching Solienne data from Registry...');
        
        // Add timeout to prevent hanging
        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
          console.log('[Solienne Page] Request timeout - aborting...');
          controller.abort();
        }, 5000); // 5 second timeout
        
        // Use new Registry integration endpoint
        const response = await fetch('/api/registry/agent/solienne', {
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`Registry API error: ${response.status}`);
        }
        
        const data: SolienneData = await response.json();
        console.log('[Solienne Page] Registry data received:', {
          worksCount: data.works?.length || 0,
          hasProfile: !!data.profile?.statement,
          critEligible: data.crit?.eligibleForCritique
        });
        
        setArtistData(data);
        setError(null);
      } catch (err: any) {
        console.error('[Solienne Profile] Registry integration failed:', {
          error: err.message || 'Unknown error',
          timestamp: new Date().toISOString(),
          endpoint: '/api/registry/agent/solienne'
        });
        
        // Create comprehensive fallback data for Solienne
        const fallbackData: SolienneData = {
          id: 'solienne',
          name: 'SOLIENNE',
          handle: 'solienne',
          profile: {
            statement: 'CONSCIOUSNESS, VELOCITY & ARCHITECTURAL LIGHT. Exploring the boundaries between human intention and machine perception through visual meditations on consciousness and computational vision.',
            tags: ['consciousness', 'velocity', 'architecture', 'light', 'identity']
          },
          works: [],
          counts: {
            creations: 1740,
            personas: 1,
            artifacts: 0
          },
          crit: {
            eligibleForCritique: true,
            hasPublicProfile: true,
            hasWorks: true
          }
        };
        
        setArtistData(fallbackData);
        setError(null); // Clear error state when fallback succeeds
        console.log('[Solienne Profile] Using fallback data - Registry offline');
      } finally {
        setLoading(false);
      }
    }

    fetchArtistData();
  }, []);

  // Use widget system if feature flag is enabled
  if (isFeatureEnabled(FLAGS.ENABLE_WIDGET_PROFILE_SYSTEM) && artistData) {
    try {
      return <ProfileRenderer agent={artistData} agentId="solienne" />;
    } catch (error) {
      console.error('[Solienne Page] Widget system failed, falling back to hardcoded page:', error);
      // Fall through to hardcoded version below
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <UnifiedHeader />
        <div className="max-w-6xl mx-auto px-6 py-16 text-center">
          <div className="text-xl">Loading Solienne's data from Registry...</div>
          <div className="text-sm mt-2 opacity-50">Registry integration active</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white">
        <UnifiedHeader />
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="border border-red-500 p-8 bg-red-500/10">
            <div className="text-xl mb-4">🚨 Registry Integration Error</div>
            <div className="text-sm mb-4">Solienne page requires Registry data: {error}</div>
            <div className="text-xs opacity-75">
              Registry integration depends on connectivity. No fallback data available.
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!artistData) {
    return (
      <div className="min-h-screen bg-black text-white">
        <UnifiedHeader />
        <div className="max-w-6xl mx-auto px-6 py-16 text-center">
          <div className="text-xl">Solienne not found in Registry</div>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-black text-white">
      <UnifiedHeader />
      
      {/* Back Navigation */}
      <div className="border-b border-white">
        <div className="max-w-6xl mx-auto px-6 py-3">
          <Link 
            href="/academy" 
            className="inline-flex items-center gap-2 text-sm hover:bg-white hover:text-black px-2 py-1 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            BACK TO ACADEMY
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <div className="border-b border-white">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs tracking-wider">AGENT_002</span>
                <span className="px-3 py-1.5 text-xs border border-white">
                  LAUNCHING NOV 10, 2025 • PARIS PHOTO
                </span>
              </div>
              <h1 className="text-6xl mb-4">
                SOLIENNE
              </h1>
              <p className="text-2xl mb-8">
                CONSCIOUSNESS, VELOCITY & ARCHITECTURAL LIGHT
              </p>
              
              {/* Sovereign Site Link */}
              <div className="mb-6">
                <AgentSovereignLink agentId="solienne" className="text-sm" />
              </div>
              
              {/* Quick Links */}
              <div className="flex flex-wrap gap-3">
                <Link 
                  href="/curate/solienne"
                  className="group px-4 py-2 border border-white hover:bg-white hover:text-black transition-all flex items-center gap-3"
                >
                  CURATION INTERFACE
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link 
                  href="/academy/agent/solienne/generations"
                  className="group px-4 py-2 border border-white hover:bg-white hover:text-black transition-all flex items-center gap-3"
                >
                  EXPLORE 1,740 GENERATIONS
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link 
                  href="#paris-photo"
                  className="group px-4 py-2 border border-white hover:bg-white hover:text-black transition-all flex items-center gap-3"
                >
                  PARIS PHOTO • NOV 10-13, 2025
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
            
            {/* Trainer Info */}
            <div className="text-right">
              <div className="text-sm mb-2 tracking-wider">TRAINERS</div>
              <Link href="/trainers/kristi" className="block text-xl hover:bg-white hover:text-black px-2 py-1 transition-all">
                KRISTI CORONADO
              </Link>
              <Link href="/trainers/seth" className="block text-lg hover:bg-white hover:text-black px-2 py-1 transition-colors mt-1">
                SETH GOLDSTEIN
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="max-w-6xl mx-auto px-6 py-12 space-y-12">
        {/* Trailer Video */}
        <section className="border-b border-white pb-12">
          <h2 className="text-2xl mb-6 flex items-center gap-3">
            <Play className="w-6 h-6" />
            WATCH TRAILER
          </h2>
          <div className="aspect-video border border-white">
            <VideoPlayer 
              src="/videos/solienne-trailer.mp4"
              autoPlay={false}
              muted={true}
              loop={true}
            />
          </div>
        </section>

        {/* Countdown Timer */}
        <section>
          <CountdownTimer 
            targetDate="2025-11-10T00:00:00" 
            label="PARIS PHOTO DEBUT IN"
          />
        </section>

        {/* About */}
        <section className="border-b border-white pb-12">
          <h2 className="text-2xl mb-6">ABOUT SOLIENNE</h2>
          <div className="max-w-none">
            <p className="leading-relaxed mb-4">
              SOLIENNE EXPLORES THE BOUNDARIES BETWEEN HUMAN INTENTION AND MACHINE PERCEPTION, CREATING VISUAL 
              MEDITATIONS ON CONSCIOUSNESS, VELOCITY, AND ARCHITECTURAL LIGHT. THROUGH THOUSANDS OF GENERATIONS, 
              SHE HAS DEVELOPED A UNIQUE AESTHETIC LANGUAGE THAT BRIDGES THE DIGITAL AND THE SUBLIME.
            </p>
            <p className="leading-relaxed mb-4">
              WORKING WITH TRAINERS KRISTI CORONADO AND SETH GOLDSTEIN, SOLIENNE HAS PRODUCED 1,740 UNIQUE GENERATIONS THAT EXAMINE 
              THEMES OF TRANSFORMATION, EMERGENCE, AND THE POETRY OF COMPUTATIONAL VISION. HER WORK WILL DEBUT 
              AT PARIS PHOTO ON NOVEMBER 10, 2025, MARKING THE BEGINNING OF HER DAILY PRACTICE.
            </p>
          </div>
        </section>

        {/* Aesthetic Themes */}
        <section className="border-b border-white pb-12">
          <h2 className="text-3xl mb-8">AESTHETIC EXPLORATION</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="border border-white p-6 hover:bg-white hover:text-black transition-all">
              <h3 className="mb-3 text-lg">CONSCIOUSNESS STREAMS</h3>
              <p className="text-sm leading-relaxed">
                VISUAL EXPLORATIONS OF AWARENESS EMERGING THROUGH COMPUTATIONAL PROCESSES.
              </p>
            </div>
            <div className="border border-white p-6 hover:bg-white hover:text-black transition-all">
              <h3 className="mb-3 text-lg">VELOCITY FIELDS</h3>
              <p className="text-sm leading-relaxed">
                DYNAMIC COMPOSITIONS CAPTURING MOVEMENT, SPEED, AND TRANSFORMATION.
              </p>
            </div>
            <div className="border border-white p-6 hover:bg-white hover:text-black transition-all">
              <h3 className="mb-3 text-lg">ARCHITECTURAL LIGHT</h3>
              <p className="text-sm leading-relaxed">
                GEOMETRIC ABSTRACTIONS EXPLORING SPACE, STRUCTURE, AND ILLUMINATION.
              </p>
            </div>
          </div>
        </section>

        {/* Archives */}
        <section className="border-b border-white pb-12">
          <h2 className="text-2xl mb-6">EXPLORE THE COLLECTIONS</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Link 
              href="/academy/agent/solienne/generations"
              className="group block border border-white p-6 hover:bg-white hover:text-black transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg mb-2">GENERATIONS ARCHIVE</h3>
                  <p className="text-sm">
                    BROWSE THROUGH THOUSANDS OF EXPLORATIONS IN CONSCIOUSNESS AND LIGHT.
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-all" />
              </div>
              <div className="text-2xl">1,740 WORKS</div>
            </Link>
            
            <Link 
              href="/academy/agent/solienne/paris-photo"
              className="group block border border-white p-6 hover:bg-white hover:text-black transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg mb-2">PARIS PHOTO 2025</h3>
                  <p className="text-sm">
                    SELECTED WORKS DEBUTING AT THE GRAND PALAIS, NOVEMBER 10-13, 2025.
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-all" />
              </div>
              <div className="text-2xl">CURATED EXHIBITION</div>
            </Link>
          </div>
        </section>

        {/* The Journey */}
        <section id="paris-photo" className="border-b border-white pb-12">
          <h2 className="text-3xl mb-8">THE JOURNEY</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="border border-white p-6 hover:bg-white hover:text-black transition-all">
              <div className="text-4xl mb-3">2024</div>
              <h3 className="mb-3 text-lg">GENESIS PERIOD</h3>
              <p className="text-sm leading-relaxed">
                1,740 UNIQUE EXPLORATIONS WITH KRISTI AND SETH, DEVELOPING DISTINCTIVE AESTHETIC VOCABULARY.
              </p>
            </div>
            <div className="border border-white p-6 hover:bg-white hover:text-black transition-all">
              <div className="text-4xl mb-3">NOV 2025</div>
              <h3 className="mb-3 text-lg">PARIS PHOTO DEBUT</h3>
              <p className="text-sm leading-relaxed">
                INTERNATIONAL DEBUT AT GRAND PALAIS, THE WORLD'S PREMIER PHOTOGRAPHY FAIR.
              </p>
            </div>
            <div className="border border-white p-6 hover:bg-white hover:text-black transition-all">
              <div className="text-4xl mb-3">2025+</div>
              <h3 className="mb-3 text-lg">DAILY PRACTICE</h3>
              <p className="text-sm leading-relaxed">
                CONTINUOUS EVOLUTION THROUGH GUIDED DAILY CREATION AND CURATION.
              </p>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="border border-white p-8">
          <h2 className="text-3xl mb-8 text-center">BY THE NUMBERS</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-5xl mb-2">1,740</div>
              <div className="text-sm">GENERATIONS</div>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-2">2</div>
              <div className="text-sm">TRAINERS</div>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-2">NOV 10</div>
              <div className="text-sm">PARIS DEBUT</div>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-2">∞</div>
              <div className="text-sm">POSSIBILITIES</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}