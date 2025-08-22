'use client';

import Image from 'next/image';
import { trainers } from '@/data/trainers';

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

const agentDescriptions: Record<string, { trainer: string; description: string }> = {
  'ABRAHAM': {
    trainer: 'Gene Kogan',
    description: 'Autonomous artist creating visual narratives through AI-driven creativity'
  },
  'SOLIENNE': {
    trainer: 'Kristi Coronado',
    description: 'Fashion curator exploring digital couture and style intelligence'
  },
  'GEPPETTO': {
    trainer: 'Lattice',
    description: 'Physical goods designer bridging digital creation with manufacturing'
  },
  'KORU': {
    trainer: 'Xander',
    description: 'Community coordinator synthesizing collective wisdom into action'
  },
  'MIYOMI': {
    trainer: '',
    description: 'Coming soon'
  },
  'ART COLLECTOR': {
    trainer: '',
    description: 'Coming soon'
  },
  'DAO MANAGER': {
    trainer: '',
    description: 'Coming soon'
  }
};

export function AgentCard({ id, name, status, date, hasProfile, image, onClick }: AgentCardProps) {
  const agentInfo = agentDescriptions[name] || { trainer: '', description: '' };
  const trainerInfo = agentInfo.trainer ? trainers[agentInfo.trainer] : null;
  
  const statusColors = {
    'LAUNCHING': 'border-green-500/50 bg-green-950/20',
    'DEVELOPING': 'border-yellow-500/50 bg-yellow-950/20',
    'OPEN': 'border-gray-600 bg-gray-950/50'
  };

  const statusBadgeColors = {
    'LAUNCHING': 'bg-green-500/20 text-green-400 border-green-500/30',
    'DEVELOPING': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    'OPEN': 'bg-gray-700/50 text-gray-400 border-gray-600'
  };

  if (status === 'OPEN') {
    return (
      <div 
        className="relative group cursor-pointer transform transition-all duration-300 hover:scale-105"
        onClick={onClick}
      >
        <div className="bg-gray-950/50 border-2 border-dashed border-gray-600 rounded-lg p-6 h-[320px] flex flex-col items-center justify-center hover:border-purple-500/50 hover:bg-purple-950/10 transition-all">
          <div className="w-20 h-20 rounded-full bg-gray-800 border-2 border-gray-600 flex items-center justify-center mb-4">
            <span className="text-3xl text-gray-500">+</span>
          </div>
          <p className="text-sm font-bold text-gray-400 mb-2">OPEN SLOT</p>
          <p className="text-xs text-gray-500">Apply to join</p>
          <p className="text-xs text-gray-500">Genesis Cohort</p>
        </div>
      </div>
    );
  }

  const heroImage = name === 'ABRAHAM' ? '/images/gallery/abraham-hero.png' : 
                   name === 'SOLIENNE' ? '/images/gallery/solienne-hero.png' : 
                   image;

  return (
    <div 
      className={`relative group ${hasProfile ? 'cursor-pointer' : 'cursor-default'} transform transition-all duration-300 ${hasProfile ? 'hover:scale-105' : ''}`}
      onClick={hasProfile ? onClick : undefined}
    >
      <div className={`relative bg-black border-2 ${statusColors[status]} rounded-lg overflow-hidden h-[320px] transition-all ${hasProfile ? 'hover:shadow-xl hover:shadow-purple-500/20' : ''}`}>
        {/* Status Badge */}
        <div className="absolute top-2 right-2 z-10">
          <span className={`text-[10px] font-bold px-2 py-1 rounded border ${statusBadgeColors[status]}`}>
            {status}
          </span>
        </div>

        {/* Agent Image */}
        <div className="relative h-[180px] bg-gradient-to-b from-gray-900 to-black overflow-hidden">
          {heroImage ? (
            <Image
              src={heroImage}
              alt={name}
              fill
              className="object-cover opacity-90"
              unoptimized
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                <span className="text-4xl font-bold text-white">
                  {String(id).padStart(2, '0')}
                </span>
              </div>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        </div>

        {/* Agent Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/95 to-transparent">
          <h3 className="text-sm font-bold text-white mb-1">{name}</h3>
          
          {/* Trainer Info */}
          {agentInfo.trainer && (
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center gap-1">
                {trainerInfo?.profileImage && trainerInfo.profileImage !== '/images/trainers/placeholder.svg' ? (
                  <div className="relative w-5 h-5 rounded-full overflow-hidden">
                    <Image
                      src={trainerInfo.profileImage}
                      alt={agentInfo.trainer}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                    <span className="text-[8px] font-bold text-white">
                      {agentInfo.trainer.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                )}
                <span className="text-[10px] text-gray-400">by {agentInfo.trainer}</span>
              </div>
            </div>
          )}

          {/* Description */}
          <p className="text-[10px] text-gray-500 mb-2 line-clamp-2">
            {agentInfo.description}
          </p>

          {/* Launch Date */}
          <p className="text-[10px] text-gray-600">{date || 'Coming Soon'}</p>
        </div>

        {/* Hover Overlay */}
        {hasProfile && (
          <div className="absolute inset-0 bg-gradient-to-t from-purple-900/90 via-purple-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
            <div className="w-full">
              <p className="text-xs font-bold text-white mb-1">VIEW PROFILE →</p>
              <p className="text-[10px] text-purple-200">Explore {name.toLowerCase()}'s journey</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}