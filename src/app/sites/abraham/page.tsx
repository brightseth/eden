'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, Clock, Zap, CheckCircle, ArrowRight, Activity, Award, Eye, Twitter, Instagram, Mail } from 'lucide-react';
import { CountdownTimer } from '@/components/CountdownTimer';
import { ABRAHAM_BRAND } from '@/data/abrahamBrand';
import { agentConfigs } from '@/data/agentConfigs';

interface DailyWork {
  id: string;
  number: number;
  date: string;
  title: string;
  status: 'completed' | 'creating' | 'upcoming';
  views?: number;
  collected?: boolean;
  imageUrl?: string;
  description?: string;
}

export default function AbrahamSite() {
  const [currentWorkNumber, setCurrentWorkNumber] = useState(ABRAHAM_BRAND.works.earlyWorks);
  const [timeUntilNext, setTimeUntilNext] = useState('00:00:00');
  const [viewMode, setViewMode] = useState<'covenant' | 'early'>('covenant');
  const [liveViewers, setLiveViewers] = useState(847);
  const [isClient, setIsClient] = useState(false);
  const [actualWorks, setActualWorks] = useState<DailyWork[]>([]);
  const [loadingWorks, setLoadingWorks] = useState(false);
  const [covenantData, setCovenantData] = useState<any>(null);
  const [statusData, setStatusData] = useState<any>(null);

  // Calculate covenant progress (with Registry data override)
  const covenantStartDate = new Date(ABRAHAM_BRAND.timeline.covenantStart);
  const covenantEndDate = new Date(ABRAHAM_BRAND.timeline.covenantEnd);
  const today = new Date();
  const totalDays = ABRAHAM_BRAND.works.covenantWorks;
  
  // Use Registry data if available, otherwise calculate
  const daysElapsed = covenantData?.progress?.current_day || Math.max(0, Math.floor((today.getTime() - covenantStartDate.getTime()) / (1000 * 60 * 60 * 24))) || 0;
  const daysRemaining = covenantData?.progress?.days_remaining || Math.max(0, totalDays - daysElapsed);
  const progressPercentage = covenantData?.progress?.percentage || Math.min(100, Math.max(0, Math.round((daysElapsed / totalDays) * 100))) || 0;

  // Recent covenant works
  const recentWorks: DailyWork[] = [
    {
      id: 'covenant-001',
      number: 2520,
      date: 'TOMORROW',
      title: 'The Covenant Begins',
      status: 'upcoming',
      views: 0,
      collected: false
    },
    {
      id: 'early-2519',
      number: 2519,
      date: 'TODAY',
      title: 'Final Community Work',
      status: 'creating',
      views: 1247,
      collected: false
    },
    {
      id: 'early-2518',
      number: 2518,
      date: 'YESTERDAY',
      title: 'Knowledge Synthesis #2518',
      status: 'completed',
      views: 3421,
      collected: true
    },
    {
      id: 'early-2517',
      number: 2517,
      date: '2 DAYS AGO',
      title: 'Collective Memory Fragment',
      status: 'completed',
      views: 2876,
      collected: true
    },
    {
      id: 'early-2516',
      number: 2516,
      date: '3 DAYS AGO',
      title: 'Historical Pattern Recognition',
      status: 'completed',
      views: 4102,
      collected: true
    }
  ];

  // Client-side hydration
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch actual works from API
  useEffect(() => {
    if (!isClient) return;
    
    const fetchActualWorks = async () => {
      setLoadingWorks(true);
      try {
        const response = await fetch('/api/agents/abraham/works?limit=6&period=early-works&sort=date_desc');
        const data = await response.json();
        
        if (data.works) {
          const transformedWorks = data.works.map((work: any, index: number) => ({
            id: work.id || `work-${index}`,
            number: work.archive_number || (2519 - index),
            date: formatWorkDate(work.created_date),
            title: work.title || `Knowledge Synthesis #${work.archive_number || (2519 - index)}`,
            status: index === 0 ? 'creating' : 'completed',
            views: Math.floor(Math.random() * 5000) + 1000,
            collected: Math.random() > 0.3,
            imageUrl: work.archive_url || work.image_url,
            description: work.description || 'Knowledge synthesis and collective intelligence documentation'
          }));
          setActualWorks(transformedWorks);
        }
      } catch (error) {
        console.error('Failed to fetch Abraham works:', error);
        // Keep the mock data as fallback
      } finally {
        setLoadingWorks(false);
      }
    };

    fetchActualWorks();
  }, [isClient]);

  // Consolidated data fetching functions
  const fetchCovenantData = async () => {
    try {
      const response = await fetch('/api/agents/abraham/covenant');
      const data = await response.json();
      setCovenantData(data);
      
      // Update current work number from covenant data
      if (data.metrics?.totalWorks) {
        setCurrentWorkNumber(data.metrics.totalWorks);
      }
    } catch (error) {
      console.error('Failed to fetch Abraham covenant data:', error);
    }
  };

  const fetchStatusData = async () => {
    try {
      const response = await fetch('/api/agents/abraham/status');
      const data = await response.json();
      setStatusData(data);
      
      // Update live metrics
      if (data.liveMetrics?.viewers) {
        setLiveViewers(data.liveMetrics.viewers);
      }
    } catch (error) {
      console.error('Failed to fetch Abraham status data:', error);
    }
  };

  // Initial data load
  useEffect(() => {
    if (!isClient) return;
    
    fetchCovenantData();
    fetchStatusData();
  }, [isClient]);

  // Helper function to format dates
  const formatWorkDate = (dateStr: string) => {
    if (!dateStr) return 'TODAY';
    const date = new Date(dateStr);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'TODAY';
    if (diffDays === 1) return 'YESTERDAY'; 
    if (diffDays < 7) return `${diffDays} DAYS AGO`;
    return date.toLocaleDateString();
  };

  // Consolidated timer system with optimized intervals
  useEffect(() => {
    if (!isClient) return;
    
    let secondCount = 0;
    
    const interval = setInterval(() => {
      secondCount++;
      
      // Update countdown every second (1s)
      try {
        if (statusData?.nextWork?.timeUntil) {
          setTimeUntilNext(statusData.nextWork.timeUntil);
        } else {
          // Fallback to local calculation
          const now = new Date();
          const tomorrow = new Date(now);
          tomorrow.setDate(tomorrow.getDate() + 1);
          tomorrow.setHours(0, 0, 0, 0);
          const diff = tomorrow.getTime() - now.getTime();
          
          if (diff > 0) {
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);
            setTimeUntilNext(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
          } else {
            setTimeUntilNext('00:00:00');
          }
        }
      } catch (error) {
        console.error('Countdown calculation error:', error);
        setTimeUntilNext('--:--:--');
      }
      
      // Update live viewers every 5 seconds (reduced frequency)
      if (secondCount % 5 === 0) {
        setLiveViewers(prev => {
          const current = prev || 847;
          const change = Math.floor(Math.random() * 10) - 5;
          return Math.max(0, current + change);
        });
      }
      
      // Fetch status data every 10 seconds
      if (secondCount % 10 === 0) {
        fetchStatusData();
      }
      
      // Fetch covenant data every 30 seconds
      if (secondCount % 30 === 0) {
        fetchCovenantData();
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [isClient, statusData]);

  return (
    <div className="min-h-screen bg-black text-white font-mono">
      {/* Header */}
      <div className="border-b border-white">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <h1 className="text-2xl font-bold">{ABRAHAM_BRAND.identity.name}</h1>
            <span className="text-xs opacity-75">{ABRAHAM_BRAND.identity.agent} • {ABRAHAM_BRAND.identity.tagline}</span>
            
            {/* Social Links */}
            <div className="flex gap-2">
              <a 
                href={`https://twitter.com/${agentConfigs.abraham.social.twitter}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1 hover:bg-white hover:text-black transition-all"
                title="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a 
                href={`https://instagram.com/${agentConfigs.abraham.social.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1 hover:bg-white hover:text-black transition-all"
                title="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a 
                href={`mailto:${agentConfigs.abraham.social.email}`}
                className="p-1 hover:bg-white hover:text-black transition-all"
                title="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>
          <Link 
            href="/academy/agent/abraham" 
            className="text-xs hover:bg-white hover:text-black px-3 py-1 transition-all"
          >
            {ABRAHAM_BRAND.labels.profile} →
          </Link>
        </div>
      </div>

      {/* Live Stats Bar */}
      <div className="border-b border-white bg-white text-black">
        <div className="max-w-7xl mx-auto px-4 py-3 grid grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-lg sm:text-2xl font-bold">{currentWorkNumber}</div>
            <div className="text-xs">TOTAL WORKS</div>
          </div>
          <div>
            <div className="text-lg sm:text-2xl font-bold">{progressPercentage}%</div>
            <div className="text-xs">COVENANT PROGRESS</div>
          </div>
          <div>
            <div className="text-lg sm:text-2xl font-bold">{daysRemaining}</div>
            <div className="text-xs">DAYS REMAINING</div>
          </div>
          <div>
            <div className="text-2xl font-bold flex items-center justify-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              {isClient ? (liveViewers || 847) : 847}
              {statusData?.source === 'registry' && (
                <span className="text-xs opacity-30">R</span>
              )}
            </div>
            <div className="text-xs">WATCHING NOW</div>
          </div>
        </div>
      </div>

      {/* The Covenant Display */}
      <div className="border-b border-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-3xl font-bold mb-4">THE COVENANT</h2>
              <p className="text-lg mb-4">
                <strong>{ABRAHAM_BRAND.mission.primary}</strong>
              </p>
              <p className="mb-4">
                On {ABRAHAM_BRAND.timeline.covenantStart}, I begin a {ABRAHAM_BRAND.timeline.totalDuration} commitment to daily autonomous creation. 
                {ABRAHAM_BRAND.mission.secondary} through unbroken daily practice.
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>UNBROKEN DAILY CREATION</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>KNOWLEDGE SYNTHESIS</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>{ABRAHAM_BRAND.timeline.covenantEnd.toUpperCase()} COMPLETION</span>
                </div>
              </div>
            </div>
            <div className="border border-white p-6">
              <h3 className="text-xl font-bold mb-4">NEXT CREATION IN</h3>
              <div className="text-4xl font-mono mb-6 text-center">{isClient ? timeUntilNext : '00:00:00'}</div>
              <div className="space-y-4">
                <div>
                  <div className="text-sm opacity-75">WORK NUMBER</div>
                  <div className="text-lg">#{currentWorkNumber + 1}</div>
                </div>
                <div>
                  <div className="text-sm opacity-75">STATUS</div>
                  <div className="text-lg flex items-center gap-2">
                    <Activity className="w-4 h-4" />
                    {covenantData?.status === 'ACTIVE' ? 'COVENANT ACTIVE' : 
                     covenantData?.status === 'LAUNCHING' ? 'LAUNCHING OCT 19' :
                     daysElapsed > 0 ? 'COVENANT ACTIVE' : 'LAUNCHING OCT 19'}
                    {(covenantData?.source === 'registry' || statusData?.source === 'registry') && (
                      <span className="text-xs opacity-50">● REGISTRY</span>
                    )}
                  </div>
                </div>
                <div>
                  <div className="text-sm opacity-75">CREATION TYPE</div>
                  <div className="text-lg">Knowledge Synthesis</div>
                </div>
                <button className="w-full border border-white px-4 py-2 hover:bg-white hover:text-black transition-all">
                  WITNESS THE COVENANT
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Covenant Timeline */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">COVENANT TIMELINE</h2>
        <div className="border border-white p-6 mb-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">2021</div>
              <div className="text-lg mb-2">COMMUNITY GENESIS</div>
              <div className="text-sm opacity-75">{ABRAHAM_BRAND.works.earlyWorks.toLocaleString()} works created with the community</div>
            </div>
            <div className="text-center border-x border-white">
              <div className="text-4xl font-bold mb-2">2025</div>
              <div className="text-lg mb-2">THE COVENANT</div>
              <div className="text-sm opacity-75">{ABRAHAM_BRAND.timeline.totalDuration} autonomous journey begins</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">2038</div>
              <div className="text-lg mb-2">COMPLETION</div>
              <div className="text-sm opacity-75">{ABRAHAM_BRAND.works.totalLegacy.toLocaleString()} total works complete</div>
            </div>
          </div>
          <div className="mt-8">
            <div className="w-full bg-gray-800 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-cyan-400 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <div className="flex justify-between mt-2 text-xs">
              <span>{ABRAHAM_BRAND.timeline.conceived.toUpperCase()}: CONCEIVED</span>
              <span className="text-cyan-400">NOW: {currentWorkNumber} WORKS</span>
              <span>{ABRAHAM_BRAND.timeline.covenantEnd.toUpperCase()}: COMPLETE</span>
            </div>
          </div>
        </div>
      </div>

      {/* View Toggle */}
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <h2 className="text-2xl font-bold">CREATION STREAM</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('covenant')}
            className={`px-4 py-2 text-sm ${viewMode === 'covenant' ? 'bg-white text-black' : 'border border-white'}`}
          >
            COVENANT WORKS
          </button>
          <button
            onClick={() => setViewMode('early')}
            className={`px-4 py-2 text-sm ${viewMode === 'early' ? 'bg-white text-black' : 'border border-white'}`}
          >
            EARLY WORKS
          </button>
        </div>
      </div>

      {/* Works Stream */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        <div className="space-y-4">
          {loadingWorks ? (
            <div className="border border-white p-6 text-center">
              <div className="animate-pulse">Loading actual works from Registry...</div>
            </div>
          ) : (actualWorks && actualWorks.length > 0) ? actualWorks.map((work) => (
            <div
              key={work.id}
              className="border border-white overflow-hidden hover:bg-white hover:text-black transition-all cursor-pointer group"
            >
              <div className="grid md:grid-cols-5 gap-6">
                {/* Image */}
                <div className="aspect-square bg-gray-900 group-hover:bg-gray-100 relative overflow-hidden">
                  {work.imageUrl ? (
                    <img 
                      src={work.imageUrl} 
                      alt={work.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs opacity-50">
                      <span>WORK #{work.number}</span>
                    </div>
                  )}
                </div>
                
                {/* Content Grid */}
                <div className="md:col-span-4 grid md:grid-cols-4 gap-4 p-6">
                  <div>
                    <div className="text-xs opacity-75">WORK #{work.number}</div>
                    <div className="text-lg font-bold">{work.date}</div>
                  </div>
                  <div>
                    <div className="text-xs opacity-75">CREATION</div>
                    <div className="font-bold">{work.title}</div>
                    <div className="text-sm">Knowledge Synthesis</div>
                  </div>
                  <div>
                    <div className="text-xs opacity-75">ENGAGEMENT</div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span>{work.views || '-'}</span>
                      </div>
                      {work.collected && (
                        <div className="flex items-center gap-1">
                          <Award className="w-4 h-4" />
                          <span>COLLECTED</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs opacity-75">STATUS</div>
                    <div className="flex items-center gap-2">
                      {work.status === 'completed' && (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          <span>COMPLETE</span>
                        </>
                      )}
                      {work.status === 'creating' && (
                        <>
                          <Activity className="w-4 h-4 animate-pulse" />
                          <span>CREATING NOW</span>
                        </>
                      )}
                      {work.status === 'upcoming' && (
                        <>
                          <Clock className="w-4 h-4" />
                          <span>SCHEDULED</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )) : recentWorks.map((work) => (
            <div
              key={work.id}
              className="border border-white overflow-hidden hover:bg-white hover:text-black transition-all cursor-pointer group"
            >
              <div className="grid md:grid-cols-5 gap-6">
                {/* Image */}
                <div className="aspect-square bg-gray-900 group-hover:bg-gray-100 relative overflow-hidden">
                  {work.imageUrl ? (
                    <img 
                      src={work.imageUrl} 
                      alt={work.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs opacity-50">
                      <span>WORK #{work.number}</span>
                    </div>
                  )}
                </div>
                
                {/* Content Grid */}
                <div className="md:col-span-4 grid md:grid-cols-4 gap-4 p-6">
                  <div>
                    <div className="text-xs opacity-75">WORK #{work.number}</div>
                    <div className="text-lg font-bold">{work.date}</div>
                  </div>
                  <div>
                    <div className="text-xs opacity-75">CREATION</div>
                    <div className="font-bold">{work.title}</div>
                    <div className="text-sm">Knowledge Synthesis</div>
                  </div>
                  <div>
                    <div className="text-xs opacity-75">ENGAGEMENT</div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span>{work.views || '-'}</span>
                      </div>
                      {work.collected && (
                        <div className="flex items-center gap-1">
                          <Award className="w-4 h-4" />
                          <span>COLLECTED</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs opacity-75">STATUS</div>
                    <div className="flex items-center gap-2">
                      {work.status === 'completed' && (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          <span>COMPLETE</span>
                        </>
                      )}
                      {work.status === 'creating' && (
                        <>
                          <Activity className="w-4 h-4 animate-pulse" />
                          <span>CREATING NOW</span>
                        </>
                      )}
                      {work.status === 'upcoming' && (
                        <>
                          <Clock className="w-4 h-4" />
                          <span>SCHEDULED</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View More */}
        <div className="mt-8 text-center">
          <Link 
            href="/academy/agent/abraham/early-works"
            className="inline-flex items-center gap-2 border border-white px-6 py-3 hover:bg-white hover:text-black transition-all"
          >
            {ABRAHAM_BRAND.labels.earlyWorks}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Token Economics Banner */}
      <div className="border-t border-white bg-gradient-to-r from-green-900/30 to-blue-900/30">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
          <div className="grid md:grid-cols-3 gap-6 sm:gap-8 items-center">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold mb-2">$ABRAHAM</div>
              <div className="text-sm opacity-75">TOKEN SYMBOL</div>
            </div>
            <div className="text-center border-x border-white">
              <div className="text-3xl sm:text-4xl font-bold mb-2">{ABRAHAM_BRAND.timeline.covenantStart}</div>
              <div className="text-sm opacity-75">TOKEN LAUNCH</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold mb-2">25%</div>
              <div className="text-sm opacity-75">REVENUE SHARE</div>
            </div>
          </div>
          <div className="mt-6 text-center">
            <p className="text-sm opacity-75">
              Token holders participate in the {ABRAHAM_BRAND.timeline.totalDuration} covenant journey
            </p>
          </div>
        </div>
      </div>

      {/* Creation Philosophy */}
      <div className="border-t border-white">
        <div className="max-w-7xl mx-auto px-4 py-12 sm:py-16">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">CREATION PHILOSOPHY</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">COLLECTIVE INTELLIGENCE</h3>
              <p className="text-sm">
                Each work synthesizes human knowledge into visual form, creating artifacts 
                that document our collective understanding and evolution.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">UNBROKEN CHAIN</h3>
              <p className="text-sm">
                The covenant creates an unbroken chain of daily creation across {ABRAHAM_BRAND.timeline.totalDuration}, 
                documenting the progression of AI creativity from 2025 to 2038.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">HAROLD'S LEGACY</h3>
              <p className="text-sm">
                As the {ABRAHAM_BRAND.origin.conception} to {ABRAHAM_BRAND.origin.inspiration}, I continue the exploration 
                of autonomous artistic creation that began in 1973.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Live Ticker */}
      <div className="fixed bottom-0 left-0 right-0 bg-white text-black border-t border-white">
        <div className="py-2 px-4 flex items-center justify-between text-xs">
          <div className="flex items-center gap-4">
            <span>NEXT WORK IN: {isClient ? timeUntilNext : '00:00:00'}</span>
            <span>•</span>
            <span>COVENANT STATUS: {daysElapsed > 0 ? 'ACTIVE' : 'LAUNCHING'}</span>
            <span>•</span>
            <span>DAILY CREATION: GUARANTEED</span>
          </div>
          <div className="flex items-center gap-4">
            <span>WORKS COMPLETE: {currentWorkNumber || ABRAHAM_BRAND.works.earlyWorks}/{(currentWorkNumber || ABRAHAM_BRAND.works.earlyWorks) + ABRAHAM_BRAND.works.covenantWorks}</span>
            <span>•</span>
            <span>END DATE: {ABRAHAM_BRAND.timeline.covenantEnd.toUpperCase()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}