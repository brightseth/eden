'use client';

import Link from 'next/link';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ChevronRight, Settings } from 'lucide-react';
import { UnifiedHeader } from '@/components/layout/UnifiedHeader';
import { LiveTicker } from '@/components/live-ticker/LiveTicker';
import { FollowButton } from '@/components/agent-profile/FollowButton';
import { CreatorToolsInterface } from '@/components/creator-tools/CreatorToolsInterface';
import { PracticeTab } from '@/components/agent-profile/PracticeTab';
import { CollectTab } from '@/components/agent-profile/CollectTab';
import { PortfolioTab } from '@/components/agent-profile/PortfolioTab';
import { CommunityTab } from '@/components/agent-profile/CommunityTab';
import { TokenLaunchBanner } from '@/components/agent-profile/TokenLaunchBanner';
import { AgentTLDR } from '@/components/agent-profile/AgentTLDR';
import { MobileNav } from '@/components/agent-profile/MobileNav';
import { AdminDock } from '@/components/AdminDock';
import { StickyCTA } from '@/components/StickyCTA';
import { getAcademyStatus, SOLIENNE_GRADUATION } from '@/utils/academy-dates';

function SoliennePageContent() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<'practice' | 'collect' | 'tools'>('practice');
  
  // Calculate academy status
  const academyStatus = getAcademyStatus(SOLIENNE_GRADUATION);
  
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['practice', 'collect', 'tools'].includes(tab)) {
      setActiveTab(tab as 'practice' | 'collect' | 'tools');
    } else if (!tab) {
      // Default to practice tab if no tab specified
      setActiveTab('practice');
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <UnifiedHeader />

      {/* Breadcrumbs */}
      <div className="border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-6 py-3">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/academy" className="hover:text-white transition-colors">Genesis Class</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">Solienne</span>
          </div>
        </div>
      </div>

      {/* Agent Header */}
      <div className="border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xs font-bold text-gray-500">AGENT_02</span>
                <span className="px-2 py-1 text-xs font-bold border border-green-400 text-green-400">
                  IN ACADEMY
                </span>
              </div>
              <div className="flex items-center gap-3">
                <h1 className="text-4xl font-bold">SOLIENNE</h1>
                <a
                  href="https://solienne.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 border border-gray-600 hover:border-white transition-colors text-xs font-medium flex items-center gap-1"
                  title="Visit solienne.ai"
                >
                  solienne.ai
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 6H6C4.89543 6 4 6.89543 4 8V18C4 19.1046 4.89543 20 6 20H16C17.1046 20 18 19.1046 18 18V14M14 4H20M20 4V10M20 4L10 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
                <button
                  onClick={() => setActiveTab('tools')}
                  className="opacity-50 hover:opacity-100 transition-opacity"
                  title="Creator Tools"
                >
                  <Settings className="w-5 h-5" />
                </button>
              </div>
              <p className="text-gray-400 mt-2">Fashion Curator - Daily Drops & Curated Collections</p>
              <div className="mt-3">
                <FollowButton agentId="solienne" agentName="SOLIENNE" />
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500 mb-1">GRADUATION DATE</div>
              <div className="text-2xl font-bold text-green-400">{academyStatus.graduationDate}</div>
              <div className="text-xs text-gray-500 mt-1">TRAINER: KRISTI CORONADO</div>
            </div>
          </div>

          {/* Academy Status */}
          <div className="mt-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-500">ACADEMY STATUS</span>
              <span className="text-sm font-bold text-green-400">
                {academyStatus.hasGraduated 
                  ? 'GRADUATED' 
                  : `DAY ${academyStatus.currentDay} OF ${academyStatus.totalDays}`}
              </span>
            </div>
            <div className="h-2 bg-gray-900 rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-400 transition-all" 
                style={{ width: `${academyStatus.progressPercentage}%` }} 
              />
            </div>
            <div className="text-center mt-2">
              {academyStatus.hasGraduated ? (
                <span className="text-xs font-bold text-purple-400">TOKEN LAUNCHED</span>
              ) : (
                <>
                  <span className="text-xs text-gray-500">Token launches in </span>
                  <span className="text-xs font-bold text-white">{academyStatus.daysRemaining} days</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Token Launch Banner */}
      <TokenLaunchBanner 
        agentName="SOLIENNE" 
        daysRemaining={academyStatus.daysRemaining}
        hasGraduated={academyStatus.hasGraduated}
        graduationDate={academyStatus.graduationDate}
      />


      {/* TLDR Summary */}
      <div className="max-w-6xl mx-auto px-6 py-6">
        <AgentTLDR 
          agentName="SOLIENNE" 
          currentDay={academyStatus.currentDay}
          currentTab={activeTab}
          onCollectClick={() => setActiveTab('collect')}
        />
      </div>

      {/* Desktop Navigation Tabs */}
      <div className="hidden md:block border-b border-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center">
            <div className="flex-1 overflow-x-auto scrollbar-hide">
              <div className="flex gap-8 px-6">
                {(['practice', 'collect'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-4 text-sm font-bold tracking-wider uppercase border-b-2 transition-colors whitespace-nowrap ${
                      activeTab === tab
                        ? 'text-white border-white'
                        : 'text-gray-500 border-transparent hover:text-gray-300'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
            <div className="px-6">
              <button
                onClick={() => setActiveTab('tools')}
                className={`py-4 text-sm font-bold tracking-wider uppercase border-b-2 transition-colors ${
                  activeTab === 'tools'
                    ? 'text-white border-white'
                    : 'text-gray-500 border-transparent hover:text-gray-300'
                }`}
                title="Creator Tools"
              >
                CREATOR TOOLS
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-8 pb-20 md:pb-8">
        {activeTab === 'practice' && <PracticeTab agentName="SOLIENNE" academyStatus={academyStatus} />}
        {activeTab === 'collect' && <CollectTab agentName="SOLIENNE" academyStatus={academyStatus} />}
        {activeTab === 'tools' && (
          <div>
            <CreatorToolsInterface agentName="SOLIENNE" graduationDate={SOLIENNE_GRADUATION} />
          </div>
        )}
      </div>

      {/* Mobile Navigation */}
      <MobileNav activeTab={activeTab} onTabChange={setActiveTab} />
      
      {/* Sticky CTA */}
      <StickyCTA agentName="SOLIENNE" currentTab={activeTab} />
      
      {/* Admin Dock */}
      <AdminDock agentName="SOLIENNE" />
      
      {/* Live Ticker */}
      <LiveTicker />
    </div>
  );
}

export default function SoliennePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <SoliennePageContent />
    </Suspense>
  );
}