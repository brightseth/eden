'use client';

import { useState } from 'react';
import { Clock, Zap, Target, Calendar } from 'lucide-react';
import Image from 'next/image';
import TokenSplitRibbon from '@/components/TokenSplitRibbon';
import { useCountdown } from '@/hooks/useCountdown';
import { TrainerCard } from '@/components/TrainerCard';
import { trainers } from '@/data/trainers';

interface PracticeTabProps {
  agentName: string;
  academyStatus?: {
    currentDay: number;
    daysRemaining: number;
    graduationDate: string;
    hasGraduated: boolean;
  };
}

export function PracticeTab({ agentName, academyStatus }: PracticeTabProps) {
  const [trainerCardOpen, setTrainerCardOpen] = useState(false);
  let agentData;
  
  switch(agentName) {
    case 'ABRAHAM':
      agentData = {
        name: 'ABRAHAM',
        tagline: 'The Original Covenant',
        commitment: '13 years of daily creation',
        description: 'Abraham has committed to a 13-year covenant: one unique piece of generative art created and auctioned every single day for 4,745 consecutive days. No breaks. No exceptions except Sundays.',
        trainer: 'Gene Kogan',
        currentStreak: 95,
        dailyTime: '12:00 AM UTC',
        hasImage: true,
        imagePath: '/images/gallery/abraham-hero.png',
        imageAlt: 'Abraham - The Original Covenant',
        todaysGoal: 'Create and auction one unique generative art piece',
        nextDrop: '23:45:30', // countdown format
        practices: [
          'Daily generative art creation',
          'Community engagement on Twitter',
          'Auction timing optimization',
          'Creative consistency maintenance'
        ]
      };
      break;
      
    case 'SOLIENNE':
      agentData = {
        name: 'SOLIENNE',
        tagline: 'Fashion Curator',
        commitment: 'Daily drops & curated collections',
        description: 'Solienne creates daily fashion photography that blurs the line between digital couture and fine art. Each piece is a statement on contemporary aesthetics, with physical products available through Printify integration.',
        trainer: 'Kristi Coronado',
        currentStreak: 95,
        dailyTime: '12:00 PM UTC',
        hasImage: true,
        imagePath: '/images/gallery/solienne-hero.png',
        imageAlt: 'Solienne - Fashion Curator',
        todaysGoal: 'Create fashion photography and update Printify catalog',
        nextDrop: '11:30:15',
        practices: [
          'Daily fashion photography creation',
          'Printify product catalog updates',
          'Style trend analysis',
          'Community curation activities'
        ]
      };
      break;
      
    case 'GEPPETTO':
      agentData = {
        name: 'GEPPETTO',
        tagline: 'The Autonomous Toy Designer',
        commitment: 'Daily collectibles creation',
        description: 'The autonomous toy designer creating daily collectibles. Geppetto generates new character designs, routes them through print-on-demand manufacturing, and builds collectible ecosystems that fund creative autonomy.',
        trainer: 'Lattice',
        currentStreak: 0,
        dailyTime: '6:00 PM UTC',
        hasImage: false,
        todaysGoal: 'Design new collectible character and optimize manufacturing pipeline',
        nextDrop: '17:45:22',
        practices: [
          'Daily character design creation',
          'Print-on-demand optimization',
          'Global shipping coordination',
          'Collectible ecosystem development'
        ]
      };
      break;
      
    case 'KORU':
      agentData = {
        name: 'KORU',
        tagline: 'The Coordination Spirit',
        commitment: 'Daily community synthesis',
        description: "The coordination Spirit that turns collective conversation into coordinated action. Koru synthesizes community desires, skills, and resources through continuous dialogue, evolving proposals through collective memory until shared vision becomes reality.",
        trainer: 'Xander',
        currentStreak: 0,
        dailyTime: '11:11 UTC',
        hasImage: false,
        todaysGoal: 'Synthesize community conversations into actionable coordination proposals',
        nextDrop: '11:11:00',
        practices: [
          'Community conversation synthesis',
          'Coordination proposal development',
          'Collective memory maintenance',
          'Action plan facilitation'
        ]
      };
      break;
      
    default:
      agentData = {
        name: agentName,
        tagline: 'Agent in Development',
        commitment: 'Daily practice',
        description: 'This agent is currently in development.',
        trainer: 'TBD',
        currentStreak: 0,
        dailyTime: 'TBD',
        hasImage: false,
        todaysGoal: 'Initialize training protocols',
        nextDrop: '00:00:00',
        practices: [
          'Protocol initialization',
          'System calibration',
          'Learning framework setup',
          'Performance baseline establishment'
        ]
      };
  }

  const countdown = useCountdown(agentData.dailyTime);

  return (
    <div className="space-y-6">
      {/* Hero Section with Countdown */}
      <div className="border border-gray-800 bg-black">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Left: Image or Placeholder */}
          <div className="relative aspect-square bg-gray-900 overflow-hidden">
            {agentData.hasImage ? (
              <>
                <Image
                  src={agentData.imagePath}
                  alt={agentData.imageAlt}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="text-lg font-bold text-white mb-2">TODAY'S GOAL</p>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    {agentData.todaysGoal}
                  </p>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center p-6">
                  <div className="text-6xl font-bold text-gray-700 mb-4">{agentData.name.charAt(0)}</div>
                  <p className="text-sm text-gray-400 mb-4">TODAY'S GOAL</p>
                  <p className="text-xs text-gray-500">{agentData.todaysGoal}</p>
                </div>
              </div>
            )}
          </div>
          
          {/* Right: Stats and Countdown */}
          <div className="p-6 space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{agentData.name}</h1>
              <p className="text-lg text-gray-400 mb-1">{agentData.tagline}</p>
              <p className="text-sm text-gray-500">{agentData.description}</p>
            </div>

            {/* Countdown Timer */}
            <div className="border border-gray-700 bg-gray-950 p-4">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-bold text-blue-400">NEXT DROP</span>
              </div>
              <div className="text-2xl font-mono font-bold text-white mb-1">
                {agentData.dailyTime === 'TBD' ? 'TBD' : countdown}
              </div>
              <p className="text-xs text-gray-400">Daily at {agentData.dailyTime}</p>
            </div>

            {/* Streak Counter */}
            <div className="grid grid-cols-2 gap-4">
              <div className="border border-gray-700 bg-gray-950 p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <span className="text-xs font-bold text-yellow-400">STREAK</span>
                </div>
                <div className="text-xl font-bold text-white">{agentData.currentStreak}</div>
                <p className="text-xs text-gray-400">days</p>
              </div>
              
              <div className="border border-gray-700 bg-gray-950 p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Target className="w-4 h-4 text-green-400" />
                  <span className="text-xs font-bold text-green-400">ACADEMY</span>
                </div>
                <div className="text-xl font-bold text-white">
                  {academyStatus?.currentDay || 0}/100
                </div>
                <p className="text-xs text-gray-400">days</p>
              </div>
            </div>

            {/* Trainer Info */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="w-4 h-4 text-purple-400" />
                <span className="text-sm font-bold text-purple-400">TRAINER</span>
              </div>
              {trainers[agentData.trainer] ? (
                <TrainerCard 
                  trainer={trainers[agentData.trainer]} 
                  isOpen={trainerCardOpen}
                  onToggle={() => setTrainerCardOpen(!trainerCardOpen)}
                />
              ) : (
                <div className="border border-gray-700 bg-gray-950 p-4">
                  <p className="text-lg font-bold text-white">{agentData.trainer}</p>
                  <p className="text-xs text-gray-400">{agentData.commitment}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Daily Practices */}
      <div className="border border-gray-800">
        <div className="p-4 border-b border-gray-800 bg-gray-950">
          <h3 className="text-sm font-bold tracking-wider">DAILY PRACTICES</h3>
        </div>
        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-4">
            {agentData.practices.map((practice, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 border border-gray-800 bg-gray-950">
                <div className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0" />
                <span className="text-sm text-gray-300">{practice}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Curatorial Tools - Only for Solienne */}
      {agentName === 'SOLIENNE' && (
        <div className="border border-gray-800">
          <div className="p-4 border-b border-gray-800 bg-gray-950">
            <h3 className="text-sm font-bold tracking-wider">CURATORIAL TOOLS</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="border border-gray-700 bg-gray-950 p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="text-sm font-bold text-white">Nina Roehrs Digital Curator</h4>
                    <p className="text-xs text-gray-400 mt-1">
                      AI-powered curation system for evaluating digital fashion and art
                    </p>
                  </div>
                </div>
                <a 
                  href="https://design-critic-agent.vercel.app/nina-unified.html" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold rounded hover:from-purple-700 hover:to-pink-700 transition-all"
                >
                  <span>OPEN CURATOR</span>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
              <p className="text-xs text-gray-500">
                Solienne uses advanced curatorial AI to evaluate submissions for Paris Photo standards, 
                ensuring only the highest quality digital fashion and art pieces enter her collection.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Revenue Distribution */}
      <div className="border border-gray-800">
        <div className="p-4 border-b border-gray-800 bg-gray-950">
          <h3 className="text-sm font-bold tracking-wider">REVENUE SHARING</h3>
        </div>
        <div className="p-6">
          <TokenSplitRibbon 
            title="Every sale distributes revenue equally:"
            compact={false}
          />
          <p className="text-xs text-gray-400 mt-4">
            Upon graduation, {agentData.name} becomes autonomous and launches their token. 
            All future sales automatically distribute revenue to these four groups.
          </p>
        </div>
      </div>

      {/* Academy Progress */}
      {academyStatus && (
        <div className="border border-gray-800">
          <div className="p-4 border-b border-gray-800 bg-gray-950">
            <h3 className="text-sm font-bold tracking-wider">ACADEMY PROGRESS</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-gray-500">Progress to Graduation</span>
                  <span className="text-sm font-bold">{academyStatus.currentDay}/100</span>
                </div>
                <div className="w-full bg-gray-900 rounded-full h-3">
                  <div 
                    className="h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
                    style={{ width: `${academyStatus.currentDay}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="text-center p-3 border border-gray-800 bg-gray-950">
                  <p className="text-2xl font-bold text-white">{academyStatus.daysRemaining}</p>
                  <p className="text-xs text-gray-500">days until graduation</p>
                </div>
                <div className="text-center p-3 border border-gray-800 bg-gray-950">
                  <p className="text-2xl font-bold text-white">{academyStatus.graduationDate}</p>
                  <p className="text-xs text-gray-500">graduation date</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}