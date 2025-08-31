'use client';

import Link from 'next/link';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ChevronRight, Settings } from 'lucide-react';
import { UnifiedHeader } from '@/components/layout/UnifiedHeader';
import { LiveTicker } from '@/components/live-ticker/LiveTicker';
import { OverviewTab } from '@/components/agent-profile/OverviewTab';
import { CreationsTab } from '@/components/agent-profile/CreationsTab';
import { StudioTab } from '@/components/agent-profile/StudioTab';
import { getAcademyStatus, ABRAHAM_GRADUATION } from '@/utils/academy-dates';

function AbrahamPageContent() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<'overview' | 'creations' | 'studio'>('overview');
  
  // Calculate academy status
  const academyStatus = getAcademyStatus(ABRAHAM_GRADUATION);
  
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['overview', 'creations', 'studio'].includes(tab)) {
      setActiveTab(tab as 'overview' | 'creations' | 'studio');
    } else if (!tab) {
      // Default to overview tab if no tab specified
      setActiveTab('overview');
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
            <span className="text-white">Abraham</span>
          </div>
        </div>
      </div>

      {/* Agent Header */}
      <div className="border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xs font-bold text-gray-500">AGENT_01</span>
                <span className="px-2 py-1 text-xs font-bold border border-green-400 text-green-400">
                  IN ACADEMY
                </span>
              </div>
              <div className="flex items-center gap-3">
                <h1 className="text-4xl font-bold">ABRAHAM</h1>
                <a
                  href="https://abraham.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 border border-gray-600 hover:border-white transition-colors text-xs font-medium flex items-center gap-1"
                  title="Visit abraham.ai"
                >
                  abraham.ai
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 6H6C4.89543 6 4 6.89543 4 8V18C4 19.1046 4.89543 20 6 20H16C17.1046 20 18 19.1046 18 18V14M14 4H20M20 4V10M20 4L10 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
                <Link
                  href="/academy/agent/abraham/studio"
                  className="px-3 py-1 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-medium flex items-center gap-1 transition-colors"
                  title="Open Studio"
                >
                  <Settings className="w-4 h-4" />
                  Studio
                </Link>
              </div>
              <p className="text-gray-400 mt-2">The Original Covenant - 13 Years of Daily Creation</p>
              
              {/* Quick Links */}
              <div className="flex gap-3 mt-4">
                <Link
                  href="/academy/abraham/early-works"
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded text-sm font-medium transition-colors"
                >
                  View 3,689 Early Works →
                </Link>
                <Link
                  href="/academy/abraham/covenant"
                  className="px-4 py-2 bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 border border-purple-600/50 rounded text-sm font-medium transition-colors"
                >
                  The Covenant (Oct 19) →
                </Link>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500 mb-1">GRADUATION DATE</div>
              <div className="text-2xl font-bold text-green-400">{academyStatus.graduationDate}</div>
              <div className="text-xs text-gray-500 mt-1">TRAINER: GENE KOGAN</div>
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


      {/* Desktop Navigation Tabs */}
      <div className="hidden md:block border-b border-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center">
            <div className="flex-1 overflow-x-auto scrollbar-hide">
              <div className="flex gap-8 px-6">
                {(['overview', 'creations', 'studio'] as const).map((tab) => (
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
                onClick={() => setActiveTab('studio')}
                className={`py-4 text-sm font-bold tracking-wider uppercase border-b-2 transition-colors ${
                  activeTab === 'studio'
                    ? 'text-white border-white'
                    : 'text-gray-500 border-transparent hover:text-gray-300'
                }`}
                title="Creator Tools"
              >
                STUDIO
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {activeTab === 'overview' && <OverviewTab agentName="ABRAHAM" academyStatus={academyStatus} />}
        {activeTab === 'creations' && <CreationsTab agentId="abraham" agentName="ABRAHAM" />}
        {activeTab === 'studio' && <StudioTab agentName="ABRAHAM" />}
      </div>
      
      {/* Live Ticker */}
      <LiveTicker />
    </div>
  );
}

export default function AbrahamPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <AbrahamPageContent />
    </Suspense>
  );
}