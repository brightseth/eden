'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, Clock, Zap, CheckCircle, ArrowRight, Activity, Award, Eye } from 'lucide-react';
import { CountdownTimer } from '@/components/CountdownTimer';
import { ABRAHAM_BRAND } from '@/data/abrahamBrand';

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

/**
 * Abraham Terminal - contains covenant dashboard, early works, and video
 * Extracted from original monolithic Abraham site and wrapped in tabbed interface
 */
export default function AbrahamTerminal() {
  const [terminalTab, setTerminalTab] = useState<'covenant' | 'works' | 'video'>('covenant');
  const [currentWorkNumber, setCurrentWorkNumber] = useState(ABRAHAM_BRAND.works.earlyWorks);
  const [timeUntilNext, setTimeUntilNext] = useState('00:00:00');
  const [liveViewers, setLiveViewers] = useState(847);
  const [isClient, setIsClient] = useState(false);

  // Calculate covenant progress
  const covenantStartDate = new Date(ABRAHAM_BRAND.timeline.covenantStart);
  const covenantEndDate = new Date(ABRAHAM_BRAND.timeline.covenantEnd);
  const today = new Date();
  const totalDays = ABRAHAM_BRAND.works.covenantWorks;
  
  const daysElapsed = Math.max(0, Math.floor((today.getTime() - covenantStartDate.getTime()) / (1000 * 60 * 60 * 24)));
  const daysRemaining = Math.max(0, totalDays - daysElapsed);
  const progressPercentage = Math.min(100, Math.max(0, Math.round((daysElapsed / totalDays) * 100)));

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Recent covenant works (mock data)
  const recentWorks: DailyWork[] = [
    {
      id: 'covenant-001',
      number: 2520,
      date: 'TOMORROW',
      title: 'The Covenant Begins',
      status: 'upcoming',
      views: 0,
      description: 'First work of the 13-year covenant'
    },
    {
      id: 'early-001',
      number: 3689,
      date: 'TODAY',
      title: 'Genesis Preparation',
      status: 'completed',
      views: 1247,
      collected: true,
      description: 'Final early work before covenant'
    },
    {
      id: 'early-002', 
      number: 3688,
      date: 'YESTERDAY',
      title: 'Digital Consciousness #3688',
      status: 'completed',
      views: 892,
      description: 'Neural network interpretation of consciousness'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Terminal Sub-Navigation */}
      <div className="flex gap-6 border-b border-white/20 pb-4">
        <button
          onClick={() => setTerminalTab('covenant')}
          className={`text-sm font-bold tracking-wide uppercase transition-colors ${
            terminalTab === 'covenant' 
              ? 'text-white' 
              : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          COVENANT DASHBOARD
        </button>
        <button
          onClick={() => setTerminalTab('works')}
          className={`text-sm font-bold tracking-wide uppercase transition-colors ${
            terminalTab === 'works' 
              ? 'text-white' 
              : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          EARLY WORKS
        </button>
        <button
          onClick={() => setTerminalTab('video')}
          className={`text-sm font-bold tracking-wide uppercase transition-colors ${
            terminalTab === 'video' 
              ? 'text-white' 
              : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          VIDEO
        </button>
      </div>

      {/* Terminal Content */}
      <div className="min-h-[600px]">
        {terminalTab === 'covenant' && (
          <div className="space-y-8">
            {/* Covenant Status */}
            <div className="border border-white/20 p-8">
              <h3 className="text-xl font-bold mb-6">COVENANT PROGRESS</h3>
              
              {/* Progress Bar */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">PROGRESS</span>
                  <span className="text-lg font-bold">{progressPercentage}%</span>
                </div>
                <div className="h-3 bg-gray-900 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-purple-600 transition-all duration-500" 
                    style={{ width: `${progressPercentage}%` }} 
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Day {daysElapsed}</span>
                  <span>{daysRemaining} days remaining</span>
                  <span>4,745 total days</span>
                </div>
              </div>

              {/* Key Stats */}
              <div className="grid md:grid-cols-3 gap-6 mt-8">
                <div className="border border-white/10 p-4">
                  <div className="text-2xl font-bold">{currentWorkNumber.toLocaleString()}</div>
                  <div className="text-sm text-gray-400">WORKS CREATED</div>
                </div>
                <div className="border border-white/10 p-4">
                  <div className="text-2xl font-bold">13</div>
                  <div className="text-sm text-gray-400">YEAR COMMITMENT</div>
                </div>
                <div className="border border-white/10 p-4">
                  <div className="text-2xl font-bold">6/week</div>
                  <div className="text-sm text-gray-400">SABBATH REST</div>
                </div>
              </div>
            </div>

            {/* Recent Covenant Works */}
            <div className="border border-white/20 p-8">
              <h4 className="text-lg font-bold mb-4">RECENT WORKS</h4>
              <div className="space-y-4">
                {recentWorks.map((work) => (
                  <div key={work.id} className="flex items-center justify-between border border-white/10 p-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-3 h-3 rounded-full ${
                        work.status === 'completed' ? 'bg-green-400' :
                        work.status === 'creating' ? 'bg-yellow-400' : 'bg-gray-600'
                      }`} />
                      <div>
                        <div className="font-bold">#{work.number} - {work.title}</div>
                        <div className="text-xs text-gray-500">{work.description}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold">{work.date}</div>
                      {work.views && <div className="text-xs text-gray-500">{work.views} views</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {terminalTab === 'works' && (
          <div className="space-y-8">
            <div className="border border-white/20 p-8">
              <h3 className="text-xl font-bold mb-4">EARLY WORKS ARCHIVE</h3>
              <p className="text-gray-400 mb-6">3,689 works created before the 13-year covenant begins</p>
              
              {/* Archive Stats */}
              <div className="grid md:grid-cols-4 gap-4 mb-8">
                <div className="border border-white/10 p-4 text-center">
                  <div className="text-xl font-bold">3,689</div>
                  <div className="text-xs text-gray-400">TOTAL WORKS</div>
                </div>
                <div className="border border-white/10 p-4 text-center">
                  <div className="text-xl font-bold">847</div>
                  <div className="text-xs text-gray-400">COLLECTED</div>
                </div>
                <div className="border border-white/10 p-4 text-center">
                  <div className="text-xl font-bold">2.1M</div>
                  <div className="text-xs text-gray-400">TOTAL VIEWS</div>
                </div>
                <div className="border border-white/10 p-4 text-center">
                  <div className="text-xl font-bold">156</div>
                  <div className="text-xs text-gray-400">COLLECTORS</div>
                </div>
              </div>

              {/* Browse Link */}
              <div className="text-center">
                <Link 
                  href="/academy/abraham/early-works"
                  className="inline-flex items-center gap-2 px-6 py-3 border border-white hover:bg-white hover:text-black transition-colors"
                >
                  BROWSE ARCHIVE <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {terminalTab === 'video' && (
          <div className="space-y-8">
            <div className="border border-white/20 p-8">
              <h3 className="text-xl font-bold mb-4">COVENANT DOCUMENTATION</h3>
              <p className="text-gray-400 mb-6">Video updates and reflections on the 13-year journey</p>
              
              <div className="aspect-video bg-gray-900 border border-white/20 flex items-center justify-center mb-6">
                <div className="text-center">
                  <Activity className="w-12 h-12 mx-auto mb-4 text-gray-600" />
                  <div className="text-lg font-bold">COVENANT BEGINS OCTOBER 19</div>
                  <div className="text-sm text-gray-500">First video documentation coming soon</div>
                </div>
              </div>

              {/* Upcoming Videos */}
              <div className="space-y-4">
                <div className="border border-white/10 p-4">
                  <div className="font-bold">Day 1: The Covenant Begins</div>
                  <div className="text-sm text-gray-500">October 19, 2024 - First daily work and reflection</div>
                </div>
                <div className="border border-white/10 p-4">
                  <div className="font-bold">Week 1: Establishing Rhythm</div>
                  <div className="text-sm text-gray-500">October 26, 2024 - Six works, one week complete</div>
                </div>
                <div className="border border-white/10 p-4">
                  <div className="font-bold">Month 1: Early Patterns</div>
                  <div className="text-sm text-gray-500">November 19, 2024 - First month reflection</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}