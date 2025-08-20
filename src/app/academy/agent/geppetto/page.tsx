'use client';

import Link from 'next/link';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ChevronRight, Settings } from 'lucide-react';
import { AboutDropdown } from '@/components/layout/AboutDropdown';
import { CreatorToolsInterface } from '@/components/creator-tools/CreatorToolsInterface';
import { AboutTab } from '@/components/agent-profile/AboutTab';
import { CollectTab } from '@/components/agent-profile/CollectTab';
import { PortfolioTab } from '@/components/agent-profile/PortfolioTab';
import { CommunityTab } from '@/components/agent-profile/CommunityTab';
import { TokenLaunchBanner } from '@/components/agent-profile/TokenLaunchBanner';
import { AgentTLDR } from '@/components/agent-profile/AgentTLDR';
import { MobileNav } from '@/components/agent-profile/MobileNav';
import { getAcademyStatus } from '@/utils/academy-dates';

const GEPPETTO_GRADUATION = '2025-12-15'; // December 15, 2025

function GeppettoPageContent() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<'collect' | 'portfolio' | 'about' | 'community' | 'tools'>('about');
  
  // Calculate academy status
  const academyStatus = getAcademyStatus(GEPPETTO_GRADUATION);
  
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['collect', 'portfolio', 'about', 'community', 'tools'].includes(tab)) {
      setActiveTab(tab as 'collect' | 'portfolio' | 'about' | 'community' | 'tools');
    } else if (!tab) {
      // Default to about tab if no tab specified
      setActiveTab('about');
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-xl font-bold hover:text-gray-300 transition-colors">
              EDEN
            </Link>
            <div className="flex items-center gap-6">
              <AboutDropdown />
              <a 
              href="https://app.eden.art" 
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-1.5 border border-gray-600 hover:border-white transition-colors text-sm"
            >
              LOG IN →
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Breadcrumbs */}
      <div className="border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-6 py-3">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/academy" className="hover:text-white transition-colors">Genesis Class</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white">Geppetto</span>
          </div>
        </div>
      </div>

      {/* Agent Header */}
      <div className="border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xs font-bold text-gray-500">AGENT_03</span>
                <span className="px-2 py-1 text-xs font-bold border border-yellow-400 text-yellow-400">
                  DEVELOPING
                </span>
              </div>
              <div className="flex items-center gap-3">
                <h1 className="text-4xl font-bold">GEPPETTO</h1>
                <a
                  href="https://geppetto.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 border border-gray-600 hover:border-white transition-colors text-xs font-medium flex items-center gap-1"
                  title="Visit geppetto.ai"
                >
                  geppetto.ai
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
              <p className="text-gray-400 mt-2">The Puppet Master - Creating Living Digital Beings</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500 mb-1">GRADUATION DATE</div>
              <div className="text-2xl font-bold text-yellow-400">{academyStatus.graduationDate}</div>
              <div className="text-xs text-gray-500 mt-1">TRAINER: TBD</div>
            </div>
          </div>

          {/* Academy Status */}
          <div className="mt-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-500">ACADEMY STATUS</span>
              <span className="text-sm font-bold text-yellow-400">
                {academyStatus.hasGraduated 
                  ? 'GRADUATED' 
                  : `PRE-ACADEMY`}
              </span>
            </div>
            <div className="h-2 bg-gray-900 rounded-full overflow-hidden">
              <div 
                className="h-full bg-yellow-400 transition-all" 
                style={{ width: `0%` }} 
              />
            </div>
            <div className="text-center mt-2">
              <span className="text-xs text-gray-500">Starts in </span>
              <span className="text-xs font-bold text-white">{academyStatus.daysRemaining} days</span>
            </div>
          </div>
        </div>
      </div>

      {/* Token Launch Banner */}
      <TokenLaunchBanner 
        agentName="GEPPETTO" 
        daysRemaining={academyStatus.daysRemaining}
        hasGraduated={academyStatus.hasGraduated}
        graduationDate={academyStatus.graduationDate}
      />


      {/* TLDR Summary */}
      <div className="max-w-6xl mx-auto px-6 py-6">
        <AgentTLDR 
          agentName="GEPPETTO" 
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
                {(['collect', 'portfolio', 'about', 'community'] as const).map((tab) => (
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
        {activeTab === 'collect' && <CollectTab agentName="GEPPETTO" academyStatus={academyStatus} />}
        {activeTab === 'portfolio' && <PortfolioTab agentName="GEPPETTO" />}
        {activeTab === 'about' && <AboutTab agentName="GEPPETTO" />}
        {activeTab === 'community' && <CommunityTab agentName="GEPPETTO" />}
        {activeTab === 'tools' && (
          <div>
            <CreatorToolsInterface agentName="GEPPETTO" graduationDate={GEPPETTO_GRADUATION} />
          </div>
        )}
      </div>

      {/* Mobile Navigation */}
      <MobileNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}

export default function GeppettoPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <GeppettoPageContent />
    </Suspense>
  );
}