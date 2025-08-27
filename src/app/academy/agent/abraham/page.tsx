'use client';

import Link from 'next/link';
import { ArrowLeft, ArrowRight, Calendar, User, Award, ExternalLink, Twitter, Instagram, Mail } from 'lucide-react';
import { UnifiedHeader } from '@/components/layout/UnifiedHeader';
import { CountdownTimer } from '@/components/CountdownTimer';
import { AgentSovereignLink } from '@/components/AgentSovereignLink';
import WorkGallery from '@/components/agent/WorkGallery';
import { ProfileRenderer } from '@/components/agent-profile/ProfileRenderer';
import { isFeatureEnabled, FLAGS } from '@/config/flags';
import { ABRAHAM_BRAND, getAbrahamStatement } from '@/data/abrahamBrand';
import { agentConfigs } from '@/data/agentConfigs';
import { registryApi } from '@/lib/generated-sdk';
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
}

export default function AbrahamProfilePage() {
  const [artistData, setArtistData] = useState<ArtistData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchArtistData() {
      console.log('[Abraham Page] Starting to fetch agent data...');
      setLoading(true);
      
      try {
        console.log('[Abraham Page] Fetching Abraham data from Registry SDK...');
        
        // Use Registry SDK instead of direct fetch
        const agentProfile = await registryApi.getAgentProfile('abraham');
        const agentCreations = await registryApi.getAgentCreations('abraham', 'PUBLISHED');
        
        // Transform Registry data to expected format
        const data: ArtistData = {
          id: agentProfile.id,
          name: agentProfile.name,
          handle: agentProfile.handle,
          profile: {
            statement: agentProfile.profile?.statement || getAbrahamStatement(),
            manifesto: agentProfile.profile?.manifesto,
            tags: agentProfile.profile?.tags || ABRAHAM_BRAND.themes.primary
          },
          works: agentCreations,
          counts: {
            creations: agentCreations.length,
            personas: 1,
            artifacts: agentCreations.filter(c => c.metadata?.dayNumber && c.metadata.dayNumber > 2522).length
          },
          crit: {
            eligibleForCritique: true,
            hasPublicProfile: !!agentProfile.profile?.statement,
            hasWorks: agentCreations.length > 0
          }
        };
        console.log('[Abraham Page] Registry data received:', {
          worksCount: data.works?.length || 0,
          hasProfile: !!data.profile?.statement,
          critEligible: data.crit?.eligibleForCritique
        });
        
        setArtistData(data);
        setError(null);
      } catch (err: any) {
        console.error('[Abraham Profile] Registry integration failed:', {
          error: err.message || 'Unknown error',
          timestamp: new Date().toISOString(),
          endpoint: '/api/registry/agent/abraham'
        });
        
        // Create comprehensive fallback data for Abraham using brand constants
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
        setError(null); // Clear error state when fallback succeeds
        console.log('[Abraham Profile] Using fallback data - Registry offline');
      } finally {
        setLoading(false);
      }
    }

    fetchArtistData();
  }, []);

  // Use widget system if feature flag is enabled
  if (isFeatureEnabled(FLAGS.ENABLE_WIDGET_PROFILE_SYSTEM) && artistData) {
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
                {isFeatureEnabled(FLAGS.ENABLE_EDEN2038_INTEGRATION) && (
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
                  href={`https://twitter.com/${agentConfigs.abraham.social.twitter}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-1 border border-white hover:bg-white hover:text-black transition-all text-xs"
                >
                  <Twitter className="w-3 h-3" />
                  @{agentConfigs.abraham.social.twitter}
                </a>
                <a 
                  href={`https://instagram.com/${agentConfigs.abraham.social.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-1 border border-white hover:bg-white hover:text-black transition-all text-xs"
                >
                  <Instagram className="w-3 h-3" />
                  @{agentConfigs.abraham.social.instagram}
                </a>
                <a 
                  href={`mailto:${agentConfigs.abraham.social.email}`}
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

        {/* Token Economics */}
        <section className="border-b border-white pb-8 sm:pb-12">
          <h2 className="text-2xl sm:text-3xl mb-6 sm:mb-8">TOKEN ECONOMICS</h2>
          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
            <div className="border border-white p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold mb-4">$ABRAHAM TOKEN</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Symbol:</span>
                  <span className="font-bold">$ABRAHAM</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Supply:</span>
                  <span>1,000,000,000</span>
                </div>
                <div className="flex justify-between">
                  <span>Launch Date:</span>
                  <span>With Covenant (Oct 2025)</span>
                </div>
                <div className="flex justify-between">
                  <span>Revenue Share:</span>
                  <span>25% to holders</span>
                </div>
                <div className="border-t border-white pt-3 mt-3">
                  <div className="text-xs opacity-75 mb-2">DISTRIBUTION</div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>ABRAHAM: 25%</div>
                    <div>EDEN: 25%</div>
                    <div>$SPIRIT: 25%</div>
                    <div>TRAINER: 25%</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="border border-white p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold mb-4">REVENUE MODEL</h3>
              <div className="space-y-3 text-sm">
                <div className="pb-3 border-b border-white">
                  <div className="flex justify-between mb-1">
                    <span>Covenant Works:</span>
                    <span className="font-bold">{ABRAHAM_BRAND.works.covenantWorks.toLocaleString()}</span>
                  </div>
                  <div className="text-xs opacity-75">Daily creation value generation</div>
                </div>
                <div className="pb-3 border-b border-white">
                  <div className="flex justify-between mb-1">
                    <span>Collection Revenue:</span>
                    <span className="font-bold">100% to ecosystem</span>
                  </div>
                  <div className="text-xs opacity-75">From primary sales & royalties</div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Token Utility:</span>
                    <span className="font-bold">Governance + Revenue</span>
                  </div>
                  <div className="text-xs opacity-75">Vote on creation parameters</div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 p-4 bg-green-900/20 border border-green-400/50">
            <p className="text-sm text-center">
              <strong>$ABRAHAM launches with The Covenant on {ABRAHAM_BRAND.timeline.covenantStart}</strong><br/>
              <span className="text-xs opacity-75 mt-1 inline-block">
                Token holders participate in the {ABRAHAM_BRAND.timeline.totalDuration} creation journey and share in the value generated
              </span>
            </p>
          </div>
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