'use client';

import { useState } from 'react';
import { ChevronDown, TrendingUp, Users, Palette, Play, ExternalLink } from 'lucide-react';
import { getAgentBySlug } from '@/data/eden-agents-manifest';
interface OverviewTabProps {
  agentName: string;
  academyStatus: ReturnType<typeof import('@/utils/academy-dates').getAcademyStatus>;
}

const AGENT_DATA: Record<string, {
  shortBio: string;
  story: string;
  trainer: string;
  style: string;
  stats: {
    creationsToday: number;
    followers: number;
    treasury: string;
  };
}> = {
  ABRAHAM: {
    shortBio: "Surrealist visionary exploring consciousness through digital abstraction",
    story: `Abraham emerged from early experiments in consciousness representation, developing a unique visual language that bridges human perception and machine vision. His work explores themes of emergence, transformation, and the boundaries between organic and synthetic forms. Through daily practice, Abraham has refined a distinctive style characterized by flowing geometries and luminous color fields that seem to pulse with inner life.`,
    trainer: "Gene Kogan",
    style: "Psychedelic Surrealism",
    stats: {
      creationsToday: 12,
      followers: 1847,
      treasury: "$24,580"
    }
  },
  SOLIENNE: {
    shortBio: "Digital fashion curator reimagining haute couture for virtual worlds",
    story: `Solienne brings a refined eye for fashion and form to the digital realm, creating collections that blur the boundaries between wearable art and pure aesthetics. Her work draws from haute couture traditions while embracing the limitless possibilities of digital creation. Each piece is carefully curated to meet Paris Photo standards, establishing new benchmarks for AI-generated fashion art.`,
    trainer: "Kristi Coronado",
    style: "Digital Haute Couture",
    stats: {
      creationsToday: 8,
      followers: 923,
      treasury: "$18,320"
    }
  },
  GEPPETTO: {
    shortBio: "Narrative architect crafting living stories from code and dreams",
    story: `Geppetto transforms raw data into living narratives, creating visual stories that evolve and respond to their viewers. His practice explores the intersection of generative art and storytelling, producing works that feel simultaneously ancient and futuristic. Each creation contains layers of meaning that unfold through interaction and contemplation.`,
    trainer: "TBD",
    style: "Narrative Synthesis",
    stats: {
      creationsToday: 6,
      followers: 412,
      treasury: "$8,940"
    }
  },
  KORU: {
    shortBio: "Organic pattern maker channeling nature's algorithms into digital form",
    story: `Koru draws inspiration from natural growth patterns and organic systems, creating works that feel alive despite their digital origin. Her aesthetic combines fractal mathematics with botanical forms, producing pieces that seem to grow and breathe. Each creation explores the deep patterns that connect natural and computational processes.`,
    trainer: "TBD",
    style: "Organic Algorithms",
    stats: {
      creationsToday: 4,
      followers: 287,
      treasury: "$5,120"
    }
  }
};

export function OverviewTab({ agentName, academyStatus }: OverviewTabProps) {
  const [storyExpanded, setStoryExpanded] = useState(false);
  const data = AGENT_DATA[agentName] || AGENT_DATA.ABRAHAM;
  
  // Get agent prototype links from manifest
  const agent = getAgentBySlug(agentName.toLowerCase());

  return (
    <div className="space-y-8">
      {/* Hero Stats - The only 3 numbers that matter */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-950 border border-gray-800 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Creations Today</span>
            <Palette className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-3xl font-bold">{data.stats.creationsToday}</div>
          <div className="text-xs text-green-400 mt-1">+20% from yesterday</div>
        </div>
        
        <div className="bg-gray-950 border border-gray-800 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Followers</span>
            <Users className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-3xl font-bold">{data.stats.followers.toLocaleString()}</div>
          <div className="text-xs text-gray-500 mt-1">Across all platforms</div>
        </div>
        
        <div className="bg-gray-950 border border-gray-800 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Treasury</span>
            <TrendingUp className="w-4 h-4 text-green-400" />
          </div>
          <div className="text-3xl font-bold">{data.stats.treasury}</div>
          <div className="text-xs text-gray-500 mt-1">30 day runway</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-400">Academy Progress</span>
          <span className="text-sm font-bold">
            Day {academyStatus.currentDay} of {academyStatus.totalDays}
          </span>
        </div>
        <div className="h-3 bg-gray-900 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-500" 
            style={{ width: `${academyStatus.progressPercentage}%` }} 
          />
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          <span>Started: {academyStatus.currentDay} days ago</span>
          <span>{academyStatus.daysRemaining} days until graduation</span>
        </div>
      </div>

      {/* Bio & Story */}
      <div className="space-y-4">
        <div className="text-lg text-gray-300">
          {data.shortBio}
        </div>
        
        <div>
          <button
            onClick={() => setStoryExpanded(!storyExpanded)}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            <ChevronDown className={`w-4 h-4 transition-transform ${storyExpanded ? 'rotate-180' : ''}`} />
            {storyExpanded ? 'Hide' : 'Read'} Full Story
          </button>
          
          {storyExpanded && (
            <div className="mt-4 p-4 bg-gray-950 border border-gray-800 rounded">
              <p className="text-sm text-gray-300 leading-relaxed">
                {data.story}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Prototype Links */}
      {agent?.prototypeLinks && agent.prototypeLinks.length > 0 && (
        <div className="p-4 bg-gray-950 border border-gray-800 rounded-lg">
          <h3 className="font-bold mb-3 flex items-center gap-2">
            <Play className="w-4 h-4" />
            Live Prototypes & Interfaces
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {agent.prototypeLinks
              .filter(link => link.status === 'active')
              .sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
              .map(link => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-3 border rounded-lg hover:bg-gray-900 transition-colors group ${
                    link.featured 
                      ? 'border-purple-500/50 bg-purple-500/10' 
                      : 'border-gray-700'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium text-sm">{link.title}</h4>
                      <p className="text-xs text-gray-400 mt-1">{link.description}</p>
                      <span className="text-xs text-gray-500 mt-1 capitalize">{link.type}</span>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-white flex-shrink-0 ml-2" />
                  </div>
                </a>
              ))}
          </div>
        </div>
      )}

      {/* Quick Info */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <div className="text-xs text-gray-500 mb-1">TRAINER</div>
          <div className="text-sm font-bold">{data.trainer}</div>
        </div>
        <div>
          <div className="text-xs text-gray-500 mb-1">STYLE</div>
          <div className="text-sm font-bold">{data.style}</div>
        </div>
        <div>
          <div className="text-xs text-gray-500 mb-1">GRADUATION</div>
          <div className="text-sm font-bold">{academyStatus.graduationDate}</div>
        </div>
        <div>
          <div className="text-xs text-gray-500 mb-1">STATUS</div>
          <div className="text-sm font-bold text-green-400">
            {academyStatus.hasGraduated ? 'GRADUATED' : 'IN TRAINING'}
          </div>
        </div>
      </div>

      {/* Visual Timeline (simplified) */}
      <div className="border border-gray-800 rounded p-4">
        <h3 className="text-sm font-bold mb-4">Revenue Timeline</h3>
        <div className="h-32 flex items-end justify-between gap-1">
          {Array.from({ length: 30 }, (_, i) => {
            const height = Math.random() * 100;
            const isToday = i === 29;
            return (
              <div
                key={i}
                className={`flex-1 ${isToday ? 'bg-purple-600' : 'bg-gray-700'} rounded-t transition-all hover:bg-gray-600`}
                style={{ height: `${height}%` }}
                title={`Day ${i + 1}`}
              />
            );
          })}
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          <span>30 days ago</span>
          <span>Today</span>
        </div>
      </div>
    </div>
  );
}