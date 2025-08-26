'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { trainers } from '@/data/trainers';
import { Calendar, User, Zap, Clock, ArrowRight, Sparkles } from 'lucide-react';
import { getAgentConfig } from '@/lib/agent-config';

interface AgentCardProps {
  id: number;
  name: string;
  status: 'LAUNCHING' | 'DEVELOPING' | 'OPEN';
  date?: string;
  hasProfile?: boolean;
  image?: string;
  trainer?: string;
  description?: string;
  onClick: () => void;
}

const agentDescriptions: Record<string, { trainer: string; description: string; skills: string[] }> = {
  'ABRAHAM': {
    trainer: 'Gene Kogan',
    description: 'Visual artist creating daily generative works through AI-driven creativity',
    skills: ['Visual Art', 'Generative', 'Daily Practice']
  },
  'SOLIENNE': {
    trainer: 'Kristi Coronado',
    description: 'Fashion curator exploring digital couture and aesthetic intelligence',
    skills: ['Fashion', 'Curation', 'Paris Photo']
  },
  'GEPPETTO': {
    trainer: 'Lattice',
    description: 'Physical goods designer bridging digital creation with manufacturing',
    skills: ['Product Design', '3D Modeling', 'Manufacturing']
  },
  'KORU': {
    trainer: 'Xander',
    description: 'Community coordinator synthesizing collective wisdom into action',
    skills: ['Community', 'Coordination', 'DAO Ops']
  },
  'MIYOMI': {
    trainer: '',
    description: 'Coming soon',
    skills: []
  },
  'ART COLLECTOR': {
    trainer: '',
    description: 'Coming soon',
    skills: []
  },
  'DAO MANAGER': {
    trainer: '',
    description: 'Coming soon',
    skills: []
  }
};

export function AgentCard({ id, name, status, date, hasProfile, image, onClick }: AgentCardProps) {
  const [timeUntilLaunch, setTimeUntilLaunch] = useState<string>('');
  const agentInfo = agentDescriptions[name] || { trainer: '', description: '', skills: [] };
  const trainerInfo = agentInfo.trainer ? trainers[agentInfo.trainer] : null;
  const agentConfig = getAgentConfig(name.toLowerCase());
  
  // Calculate time until launch for LAUNCHING status
  useEffect(() => {
    if (status === 'LAUNCHING' && date) {
      const calculateTime = () => {
        const launchDate = new Date(date.replace(',', ''));
        const now = new Date();
        const diff = launchDate.getTime() - now.getTime();
        
        if (diff > 0) {
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          setTimeUntilLaunch(`${days}d ${hours}h`);
        } else {
          setTimeUntilLaunch('LIVE');
        }
      };
      
      calculateTime();
      const interval = setInterval(calculateTime, 60000); // Update every minute
      return () => clearInterval(interval);
    }
  }, [status, date]);
  
  const statusColors = {
    'LAUNCHING': 'border-emerald-500/50 bg-gradient-to-br from-emerald-950/30 to-black',
    'DEVELOPING': 'border-amber-500/50 bg-gradient-to-br from-amber-950/30 to-black',
    'OPEN': 'border-gray-600 bg-gradient-to-br from-gray-950/50 to-black'
  };

  const statusBadgeColors = {
    'LAUNCHING': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    'DEVELOPING': 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    'OPEN': 'bg-gray-700/50 text-gray-400 border-gray-600'
  };

  const glowColors = {
    'LAUNCHING': 'hover:shadow-emerald-500/30',
    'DEVELOPING': 'hover:shadow-amber-500/20',
    'OPEN': 'hover:shadow-purple-500/20'
  };

  // Open slot card
  if (status === 'OPEN') {
    return (
      <div 
        className="relative group cursor-pointer transform transition-all duration-500 hover:scale-105 hover:-translate-y-2"
        onClick={onClick}
      >
        <div className="relative h-[400px] bg-gradient-to-br from-gray-950/50 to-black border-2 border-dashed border-gray-600 rounded-xl p-6 flex flex-col items-center justify-center hover:border-purple-500/50 hover:bg-gradient-to-br hover:from-purple-950/20 hover:to-black transition-all duration-300 overflow-hidden">
          {/* Animated background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.1),transparent_50%)]" />
          </div>
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-gray-600 flex items-center justify-center mb-4 group-hover:border-purple-500/50 transition-colors">
              <Sparkles className="w-10 h-10 text-gray-500 group-hover:text-purple-400 transition-colors" />
            </div>
            <p className="text-sm font-bold text-gray-400 mb-2 group-hover:text-purple-400 transition-colors">OPEN SLOT</p>
            <p className="text-xs text-gray-500 group-hover:text-purple-300 transition-colors">Apply to join</p>
            <ArrowRight className="w-4 h-4 text-gray-600 mt-4 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
          </div>
        </div>
      </div>
    );
  }

  // Get archive info if agent has one
  const archiveInfo = agentConfig?.archives ? Object.values(agentConfig.archives)[0] : null;
  
  const heroImage = name === 'ABRAHAM' ? '/images/gallery/abraham-hero.png' : 
                   name === 'SOLIENNE' ? '/images/gallery/solienne-hero.png' : 
                   image;

  return (
    <div 
      className={`relative group ${hasProfile ? 'cursor-pointer' : 'cursor-default'} transform transition-all duration-500 ${hasProfile ? 'hover:scale-105 hover:-translate-y-2' : ''}`}
      onClick={hasProfile ? onClick : undefined}
    >
      <div className={`relative bg-black border-2 ${statusColors[status]} rounded-xl overflow-hidden h-[400px] transition-all duration-300 ${hasProfile ? `hover:shadow-2xl ${glowColors[status]}` : ''}`}>
        {/* Animated gradient overlay for launching agents */}
        {status === 'LAUNCHING' && (
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/20 via-transparent to-transparent animate-pulse" />
          </div>
        )}
        
        {/* Status Badge with countdown */}
        <div className="absolute top-3 right-3 z-20">
          <div className={`text-[10px] font-bold px-3 py-1.5 rounded-full border ${statusBadgeColors[status]} backdrop-blur-sm flex items-center gap-1.5`}>
            {status === 'LAUNCHING' && <Zap className="w-3 h-3 animate-pulse" />}
            {status === 'DEVELOPING' && <Clock className="w-3 h-3" />}
            <span>{status}</span>
          </div>
          {status === 'LAUNCHING' && timeUntilLaunch && timeUntilLaunch !== 'LIVE' && (
            <div className="mt-1 text-[9px] text-emerald-400 text-right font-mono">
              {timeUntilLaunch}
            </div>
          )}
        </div>

        {/* Agent Number Badge */}
        <div className="absolute top-3 left-3 z-20">
          <div className="bg-black/60 backdrop-blur-sm px-2 py-1 rounded border border-white/20">
            <span className="text-[10px] font-mono text-white/80">#{String(id).padStart(2, '0')}</span>
          </div>
        </div>

        {/* Agent Image with gradient */}
        <div className="relative h-[200px] bg-gradient-to-b from-gray-900 to-black overflow-hidden">
          {heroImage ? (
            <>
              <Image
                src={heroImage}
                alt={name}
                fill
                className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
              <div className="relative">
                <div className="w-28 h-28 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center animate-pulse">
                  <span className="text-5xl font-bold text-white">
                    {String(id).padStart(2, '0')}
                  </span>
                </div>
                {/* Glow effect */}
                <div className="absolute inset-0 rounded-full bg-purple-500/30 blur-xl animate-pulse" />
              </div>
            </div>
          )}
        </div>

        {/* Agent Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/98 to-black/80">
          {/* Name and Archive Count */}
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-base font-bold text-white">{name}</h3>
            {archiveInfo && archiveInfo.count > 0 && (
              <span className="text-[10px] px-2 py-0.5 bg-purple-500/20 text-purple-400 rounded-full border border-purple-500/30">
                {archiveInfo.count.toLocaleString()} works
              </span>
            )}
          </div>
          
          {/* Trainer Info */}
          {agentInfo.trainer && (
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center gap-1.5">
                {trainerInfo?.profileImage && trainerInfo.profileImage !== '/images/trainers/placeholder.svg' ? (
                  <div className="relative w-5 h-5 rounded-full overflow-hidden ring-1 ring-white/20">
                    <Image
                      src={trainerInfo.profileImage}
                      alt={agentInfo.trainer}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center ring-1 ring-white/20">
                    <User className="w-3 h-3 text-white" />
                  </div>
                )}
                <span className="text-[11px] text-gray-400">Trained by {agentInfo.trainer}</span>
              </div>
            </div>
          )}

          {/* Description */}
          <p className="text-[11px] text-gray-400 mb-3 line-clamp-2 leading-relaxed">
            {agentInfo.description}
          </p>

          {/* Skills Tags */}
          {agentInfo.skills.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {agentInfo.skills.slice(0, 3).map((skill, idx) => (
                <span key={idx} className="text-[9px] px-2 py-0.5 bg-white/5 text-gray-500 rounded border border-white/10">
                  {skill}
                </span>
              ))}
            </div>
          )}

          {/* Launch Date with icon */}
          <div className="flex items-center gap-1.5 text-[10px] text-gray-500">
            <Calendar className="w-3 h-3" />
            <span>{date || 'Coming Soon'}</span>
          </div>
        </div>

        {/* Hover Overlay for profiles */}
        {hasProfile && (
          <div className="absolute inset-0 bg-gradient-to-t from-purple-900/95 via-purple-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end p-4">
            <div className="w-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-white mb-1">VIEW PROFILE</p>
                  <p className="text-[11px] text-purple-200">Explore {name.toLowerCase()}'s journey</p>
                </div>
                <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}