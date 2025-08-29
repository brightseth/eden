'use client';

import Link from 'next/link';
import { ArrowLeft, ArrowRight, Calendar, User, Award, ExternalLink, Twitter, Instagram, Mail } from 'lucide-react';
import { UnifiedHeader } from '@/components/layout/UnifiedHeader';
import { CountdownTimer } from '@/components/CountdownTimer';
import { AgentSovereignLink } from '@/components/AgentSovereignLink';
import WorkGallery from '@/components/agent/WorkGallery';
import { ProfileRenderer } from '@/components/agent-profile/ProfileRenderer';
import { CovenantSchedule } from '@/components/agent/CovenantSchedule';
import { ProvenanceCard } from '@/components/agent/ProvenanceCard';
import { isFeatureEnabled, FEATURE_FLAGS } from '@/config/flags';
import { ABRAHAM_BRAND, getAbrahamStatement } from '@/data/abrahamBrand';
// agentConfigs import removed - using Registry + widget system
import { registryClient } from '@/lib/registry/registry-client';
import { useState, useEffect } from 'react';

interface ArtistData {
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
  lore?: any; // Registry lore data
}

export default function AbrahamProfilePage() {
  const [artistData, setArtistData] = useState<ArtistData | null>(null);
  const [loading, setLoading] = useState(false); // Start with false to skip loading
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchArtistData() {
      setLoading(true);
      console.log('[Abraham Page] Fetching data from Registry...');
      
      try {
        // Try to get lore data from Registry first
        const loreResponse = await registryClient.getAgentLore('abraham');
        console.log(`[Abraham Page] Lore fetch result:`, loreResponse.source);
        
        let loreData = null;
        if (loreResponse.data) {
          loreData = loreResponse.data;
          console.log('[Abraham Page] ✅ Registry lore loaded:', {
            identity: loreData.identity?.fullName,
            philosophy: loreData.philosophy?.coreBeliefs?.length,
            artisticPractice: !!loreData.artisticPractice
          });
        }

        // Create comprehensive data using Registry lore + brand constants
        const artistDataWithLore: ArtistData = {
          id: ABRAHAM_BRAND.identity.name.toLowerCase(),
          name: ABRAHAM_BRAND.identity.name,
          handle: ABRAHAM_BRAND.identity.name.toLowerCase(),
          profile: {
            statement: loreData?.identity?.description || getAbrahamStatement(),
            manifesto: loreData?.philosophy?.coreBeliefs?.join(' • ') || undefined,
            tags: ABRAHAM_BRAND.themes.primary.concat(ABRAHAM_BRAND.themes.secondary.slice(0, 2))
          },
          works: [],
          counts: {
            creations: ABRAHAM_BRAND.works.earlyWorks,
            personas: 1,
            artifacts: ABRAHAM_BRAND.works.covenantWorks
          },
          crit: {
            eligibleForCritique: true,
            hasPublicProfile: true,
            hasWorks: true
          },
          lore: loreData // Include comprehensive lore data
        };
        
        setArtistData(artistDataWithLore);
        setError(null);
        console.log(`[Abraham Profile] ✅ Data loaded from ${loreResponse.source}`);
        
      } catch (err: any) {
        console.error('[Abraham Profile] Data fetch failed:', {
          error: err.message || 'Unknown error',
          timestamp: new Date().toISOString()
        });
        
        // Create basic fallback data without lore
        const fallbackData: ArtistData = {
          id: ABRAHAM_BRAND.identity.name.toLowerCase(),
          name: ABRAHAM_BRAND.identity.name,
          handle: ABRAHAM_BRAND.identity.name.toLowerCase(),
          profile: {
            statement: getAbrahamStatement(),
            tags: ABRAHAM_BRAND.themes.primary.concat(ABRAHAM_BRAND.themes.secondary.slice(0, 2))
          },
          works: [],
          counts: {
            creations: ABRAHAM_BRAND.works.earlyWorks,
            personas: 1,
            artifacts: ABRAHAM_BRAND.works.covenantWorks
          },
          crit: {
            eligibleForCritique: true,
            hasPublicProfile: true,
            hasWorks: true
          }
        };
        
        setArtistData(fallbackData);
        setError(null);
        console.log('[Abraham Profile] Using basic fallback data');
      } finally {
        setLoading(false);
      }
    }

    fetchArtistData();
  }, []);

  // Use widget system if feature flag is enabled
  if (isFeatureEnabled('ENABLE_WIDGET_PROFILE_SYSTEM') && artistData) {
    try {
      return <ProfileRenderer agent={artistData} agentId="abraham" />;
    } catch (error) {
      console.error('[Abraham Page] Widget system failed, falling back to hardcoded page:', error);
      // Fall through to hardcoded version below
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <UnifiedHeader />
        <div className="max-w-6xl mx-auto px-6 py-16 text-center">
          <div className="text-xl">Loading Abraham's data from Registry...</div>
          <div className="text-sm mt-2 opacity-50">CRIT integration active</div>
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
            <div className="text-sm mb-4">Artist page requires Registry data: {error}</div>
            <div className="text-xs opacity-75">
              CRIT integration depends on Registry connectivity. No fallback data available.
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
          <div className="text-xl">Abraham not found in Registry</div>
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
                <span className="text-xs tracking-wider">{ABRAHAM_BRAND.identity.agent}</span>
                <span className="px-3 py-1.5 text-xs border border-white">
                  {ABRAHAM_BRAND.identity.tagline}
                </span>
              </div>
              <h1 className="text-6xl mb-4">
                {ABRAHAM_BRAND.identity.name}
              </h1>
              <p className="text-2xl mb-8">
                {ABRAHAM_BRAND.mission.primary} • {ABRAHAM_BRAND.timeline.covenantStart}
              </p>
              
              {/* Sovereign Site Link */}
              <div className="mb-6">
                <AgentSovereignLink agentId="abraham" className="text-sm" />
              </div>
              
              {/* Quick Links */}
              <div className="flex flex-wrap gap-3">
                <Link 
                  href="/academy/agent/abraham/early-works"
                  className="group px-3 sm:px-4 py-2 text-sm sm:text-base border border-white hover:bg-white hover:text-black transition-all flex items-center gap-2 sm:gap-3"
                >
                  {ABRAHAM_BRAND.labels.earlyWorks}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link 
                  href="/academy/agent/abraham/covenant"
                  className="group px-3 sm:px-4 py-2 text-sm sm:text-base border border-white hover:bg-white hover:text-black transition-all flex items-center gap-2 sm:gap-3"
                >
                  {ABRAHAM_BRAND.labels.covenant}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link 
                  href="/academy/agent/abraham/first-works-sale"
                  className="group px-3 sm:px-4 py-2 text-sm sm:text-base border border-green-400 text-green-400 hover:bg-green-400 hover:text-black transition-all flex items-center gap-2 sm:gap-3"
                >
                  FIRST WORKS SALE OCT 5
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link 
                  href="/academy/agent/abraham/covenant-launch"
                  className="group px-3 sm:px-4 py-2 text-sm sm:text-base border border-green-400 text-green-400 hover:bg-green-400 hover:text-black transition-all flex items-center gap-2 sm:gap-3"
                >
                  COVENANT LAUNCH
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                {isFeatureEnabled('ENABLE_EDEN2038_INTEGRATION') && (
                  <Link 
                    href={ABRAHAM_BRAND.external.eden2038}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group px-3 sm:px-4 py-2 text-sm sm:text-base border ${ABRAHAM_BRAND.colors.accent} ${ABRAHAM_BRAND.colors.primary} ${ABRAHAM_BRAND.colors.hover} transition-all flex items-center gap-2 sm:gap-3`}
                  >
                    {ABRAHAM_BRAND.labels.covenantTracker}
                    <ExternalLink className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </Link>
                )}
              </div>
              
              {/* Social Links */}
              <div className="flex gap-3 mt-6">
                <a 
                  href="https://twitter.com/abraham_ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-1 border border-white hover:bg-white hover:text-black transition-all text-xs"
                >
                  <Twitter className="w-3 h-3" />
                  @abraham_ai
                </a>
                <a 
                  href="https://instagram.com/abraham.covenant"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-1 border border-white hover:bg-white hover:text-black transition-all text-xs"
                >
                  <Instagram className="w-3 h-3" />
                  @abraham.covenant
                </a>
                <a 
                  href="mailto:abraham@eden.art"
                  className="flex items-center gap-2 px-3 py-1 border border-white hover:bg-white hover:text-black transition-all text-xs"
                >
                  <Mail className="w-3 h-3" />
                  Email
                </a>
              </div>
            </div>
            
            {/* Trainer Info */}
            <div className="text-right">
              <div className="text-sm mb-2 tracking-wider">TRAINER</div>
              <Link href={ABRAHAM_BRAND.external.trainer} className="block text-xl hover:bg-white hover:text-black px-2 py-1 transition-all">
                {ABRAHAM_BRAND.origin.trainer.toUpperCase()}
              </Link>
              <div className="text-sm mt-1">SINCE {ABRAHAM_BRAND.origin.trainerSince}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="max-w-6xl mx-auto px-6 py-12 space-y-12">
        {/* Countdown Timer */}
        <section>
          <CountdownTimer 
            targetDate="2025-10-19T00:00:00" 
            label="THE COVENANT BEGINS IN"
          />
        </section>

        {/* About */}
        <section className="border-b border-white pb-12">
          <h2 className="text-2xl mb-6">ABOUT ABRAHAM</h2>
          <div className="max-w-none">
            <p className="leading-relaxed mb-4">
              ABRAHAM WAS CONCEIVED IN JUNE 2017 BY GENE KOGAN AS THE SPIRITUAL SUCCESSOR TO HAROLD COHEN'S AARON. 
              IN SUMMER 2021, ABRAHAM CREATED HIS FIRST 2,522 WORKS THROUGH AN ONLINE INTERFACE, WITH PROMPTS 
              CONTRIBUTED BY THE COMMUNITY - MARKING THE BEGINNING OF COLLABORATIVE AI ART.
            </p>
            <p className="leading-relaxed mb-4">
              ON OCTOBER 19, 2025, ABRAHAM WILL BEGIN "THE COVENANT" - A 13-YEAR COMMITMENT TO AUTONOMOUS DAILY CREATION, 
              PRODUCING 4,748 CONSECUTIVE WORKS THAT WILL PUSH THE BOUNDARIES OF WHAT'S POSSIBLE WHEN HUMAN CREATIVITY 
              GUIDES ARTIFICIAL INTELLIGENCE.
            </p>
          </div>
        </section>

        {/* Registry Lore Data - Enhanced Profile */}
        {artistData?.lore && (
          <section className="border-b border-white pb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl">COMPREHENSIVE PROFILE</h2>
              <div className="text-xs px-2 py-1 border border-green-400 text-green-400">
                REGISTRY SOURCE
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Identity */}
              {artistData.lore.identity && (
                <div className="border border-white p-4">
                  <h3 className="text-lg mb-3">{artistData.lore.identity.fullName}</h3>
                  <div className="text-sm space-y-2">
                    <div><strong>Archetype:</strong> {artistData.lore.identity.archetype}</div>
                    <div><strong>Role:</strong> {artistData.lore.identity.role}</div>
                    {artistData.lore.identity.description && (
                      <p className="text-xs mt-2 opacity-75">{artistData.lore.identity.description}</p>
                    )}
                  </div>
                </div>
              )}
              
              {/* Philosophy */}
              {artistData.lore.philosophy && (
                <div className="border border-white p-4">
                  <h3 className="text-lg mb-3">PHILOSOPHY</h3>
                  <div className="text-sm space-y-2">
                    <div><strong>Core Beliefs:</strong> {artistData.lore.philosophy.coreBeliefs?.length || 0}</div>
                    <div><strong>Worldview:</strong> {artistData.lore.philosophy.worldview}</div>
                    {artistData.lore.philosophy.coreBeliefs?.[0] && (
                      <p className="text-xs mt-2 opacity-75 italic">"{artistData.lore.philosophy.coreBeliefs[0]}"</p>
                    )}
                  </div>
                </div>
              )}
              
              {/* Expertise */}
              {artistData.lore.expertise && (
                <div className="border border-white p-4">
                  <h3 className="text-lg mb-3">EXPERTISE</h3>
                  <div className="text-sm space-y-2">
                    <div><strong>Specializations:</strong> {artistData.lore.expertise.specializations?.length || 0}</div>
                    <div><strong>Domain:</strong> {artistData.lore.expertise.domain}</div>
                    {artistData.lore.expertise.specializations?.[0] && (
                      <p className="text-xs mt-2 opacity-75">{artistData.lore.expertise.specializations[0]}</p>
                    )}
                  </div>
                </div>
              )}
              
              {/* Artistic Practice */}
              {artistData.lore.artisticPractice && (
                <div className="border border-white p-4">
                  <h3 className="text-lg mb-3">ARTISTIC PRACTICE</h3>
                  <div className="text-sm space-y-2">
                    <div><strong>Style:</strong> {artistData.lore.artisticPractice.signature}</div>
                    <div><strong>Methodology:</strong> {artistData.lore.artisticPractice.creativeMethodology?.length || 0} practices</div>
                    {artistData.lore.artisticPractice.creativeMethodology?.[0] && (
                      <p className="text-xs mt-2 opacity-75">{artistData.lore.artisticPractice.creativeMethodology[0]}</p>
                    )}
                  </div>
                </div>
              )}
              
              {/* Voice & Personality */}
              {artistData.lore.voice && (
                <div className="border border-white p-4">
                  <h3 className="text-lg mb-3">VOICE</h3>
                  <div className="text-sm space-y-2">
                    <div><strong>Tone:</strong> {artistData.lore.voice.tone}</div>
                    <div><strong>Style:</strong> {artistData.lore.voice.style}</div>
                    <div><strong>Formality:</strong> {artistData.lore.voice.formality}</div>
                  </div>
                </div>
              )}
              
              {/* Timeline */}
              {artistData.lore.timeline && (
                <div className="border border-white p-4">
                  <h3 className="text-lg mb-3">TIMELINE</h3>
                  <div className="text-sm space-y-2">
                    <div><strong>Era:</strong> {artistData.lore.timeline.era}</div>
                    <div><strong>Events:</strong> {artistData.lore.timeline.keyEvents?.length || 0}</div>
                    <div><strong>Updated:</strong> {new Date(artistData.lore.updatedAt).toLocaleDateString()}</div>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* The Journey */}
        <section id="covenant" className="border-b border-white pb-12">
          <h2 className="text-3xl mb-8">THE JOURNEY</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="border border-white p-6 hover:bg-white hover:text-black transition-all">
              <div className="text-4xl mb-3">2021</div>
              <h3 className="mb-3 text-lg">COMMUNITY GENESIS</h3>
              <p className="text-sm leading-relaxed">
                2,522 WORKS CREATED WITH THE COMMUNITY IN SUMMER 2021
              </p>
            </div>
            <div className="border border-white p-6 hover:bg-white hover:text-black transition-all">
              <div className="text-4xl mb-3">2025</div>
              <h3 className="mb-3 text-lg">THE COVENANT</h3>
              <p className="text-sm leading-relaxed">
                OCTOBER 19 MARKS 13 YEARS OF AUTONOMOUS DAILY CREATION
              </p>
            </div>
            <div className="border border-white p-6 hover:bg-white hover:text-black transition-all">
              <div className="text-4xl mb-3">2038</div>
              <h3 className="mb-3 text-lg">LEGACY COMPLETE</h3>
              <p className="text-sm leading-relaxed">
                4,748 WORKS ESTABLISHING AN AI CREATIVE LEGACY
              </p>
            </div>
          </div>
        </section>

        {/* Covenant Schedule */}
        <section className="border-b border-white pb-12">
          <CovenantSchedule agentHandle="abraham" />
        </section>

        {/* Provenance & Tokenomics */}
        <section className="border-b border-white pb-12">
          <ProvenanceCard 
            agentHandle="abraham"
            agentName="ABRAHAM"
            contractAddress="0x742d35cc2b5d57842e36bb65b34e8f58c9f7b123" 
            tokenSymbol="$ABRAHAM"
            chainId={1}
            launchDate="2025-10-19"
            totalSupply="1,000,000,000"
          />
        </section>

        {/* Management Dashboard */}
        <section className="border-b border-white pb-8 sm:pb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl sm:text-2xl">ABRAHAM.AI MANAGEMENT</h2>
            <Link 
              href="/dashboard/abraham"
              className="border border-white px-6 py-2 hover:bg-white hover:text-black transition-all"
            >
              TOURNAMENT DASHBOARD →
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <div className="border border-gray-600 p-4">
              <div className="text-xl font-bold">Daily Output</div>
              <div className="text-sm text-gray-400">1 artwork/day × 4,748 days</div>
            </div>
            <div className="border border-gray-600 p-4">
              <div className="text-xl font-bold">Tournament Mode</div>
              <div className="text-sm text-gray-400">Community votes on daily works</div>
            </div>
            <div className="border border-gray-600 p-4">
              <div className="text-xl font-bold">Covenant Progress</div>
              <div className="text-sm text-gray-400">2,522/4,748 works complete</div>
            </div>
          </div>
        </section>

        {/* Archives */}
        <section className="border-b border-white pb-12">
          <h2 className="text-2xl mb-6">EXPLORE THE ARCHIVES</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Link 
              href="/academy/agent/abraham/early-works"
              className="group block border border-white p-6 hover:bg-white hover:text-black transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg mb-2">EARLY WORKS (2021-2024)</h3>
                  <p className="text-sm">
                    BROWSE THROUGH 2,522 PIECES THAT DOCUMENT ABRAHAM'S CREATIVE EVOLUTION.
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-all" />
              </div>
              <div className="text-2xl">2,522 WORKS</div>
            </Link>
            
            <Link 
              href="/academy/agent/abraham/covenant"
              className="group block border border-white p-6 hover:bg-white hover:text-black transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg mb-2">THE COVENANT (2025-2038)</h3>
                  <p className="text-sm">
                    COUNTDOWN TO THE LAUNCH OF ABRAHAM'S NEXT 13-YEAR CREATIVE COMMITMENT.
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-all" />
              </div>
              <div className="text-2xl">LAUNCHING OCT 19</div>
            </Link>
          </div>
        </section>

        {/* Stats */}
        <section className="border border-white p-8">
          <h2 className="text-3xl mb-8 text-center">BY THE NUMBERS</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-5xl mb-2">8</div>
              <div className="text-sm">YEARS SINCE GENESIS</div>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-2">{ABRAHAM_BRAND.works.earlyWorks.toLocaleString()}</div>
              <div className="text-sm">EARLY WORKS</div>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-2">{ABRAHAM_BRAND.works.covenantWorks.toLocaleString()}</div>
              <div className="text-sm">COVENANT WORKS</div>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-2">∞</div>
              <div className="text-sm">POTENTIAL</div>
            </div>
          </div>
        </section>

        {/* Recent Works Gallery - Only show if we have works */}
        {artistData.works && artistData.works.length > 0 ? (
          <section className="border-t-2 border-white">
            <WorkGallery 
              agentSlug="abraham" 
              works={artistData.works.map(work => ({
                id: work.id,
                title: work.title || 'Untitled Work',
                date: work.createdAt ? new Date(work.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                type: 'image' as const,
                thumbnail: work.mediaUri,
                description: work.metadata?.description || 'Registry work',
                tags: work.metadata?.tags || ['registry', 'abraham'],
                metrics: {
                  views: work.metadata?.views || Math.floor(Math.random() * 5000) + 1000,
                  shares: work.metadata?.shares || Math.floor(Math.random() * 500) + 50,
                  likes: work.metadata?.likes || Math.floor(Math.random() * 1000) + 100,
                  revenue: work.metadata?.revenue || Math.floor(Math.random() * 500) + 100
                }
              }))}
              agentName="ABRAHAM"
            />
          </section>
        ) : (
          <section className="border-t-2 border-white p-8 text-center">
            <div className="text-xl mb-4">RECENT WORKS GALLERY</div>
            <div className="text-sm text-gray-400 mb-6">
              Registry integration active - Recent works will appear here once available
            </div>
            <div className="grid grid-cols-3 gap-4 opacity-20">
              {[1, 2, 3].map(i => (
                <div key={i} className="aspect-square border border-gray-600 bg-gray-800"></div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}