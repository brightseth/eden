'use client';

import { useState } from 'react';
import { GalleryPreview } from '@/components/GalleryPreview';
import { ArrowRight, Lock, Rocket, Code } from 'lucide-react';
import '@/styles/animations.css';

interface EnhancedAgentCardProps {
  id: number;
  name: string;
  status: 'LAUNCHING' | 'DEVELOPING' | 'OPEN';
  date?: string;
  hasProfile?: boolean;
  trainer?: string;
  worksCount?: number;
  description?: string;
  onClick: () => void;
}

export function EnhancedAgentCard({
  id,
  name,
  status,
  date,
  hasProfile,
  trainer,
  worksCount,
  description,
  onClick
}: EnhancedAgentCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const statusConfig = {
    LAUNCHING: {
      icon: <Rocket className="w-4 h-4" />,
      color: 'emerald',
      bgClass: 'from-emerald-900/20 to-green-900/20',
      borderClass: 'border-emerald-800/30 hover:border-emerald-600/50',
      glowClass: 'hover:shadow-emerald-900/30',
      textClass: 'text-emerald-400',
      badgeClass: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
    },
    DEVELOPING: {
      icon: <Code className="w-4 h-4" />,
      color: 'amber',
      bgClass: 'from-amber-900/20 to-orange-900/20',
      borderClass: 'border-amber-800/30 hover:border-amber-600/50',
      glowClass: 'hover:shadow-amber-900/30',
      textClass: 'text-amber-400',
      badgeClass: 'bg-amber-500/20 text-amber-400 border-amber-500/30'
    },
    OPEN: {
      icon: <Lock className="w-4 h-4" />,
      color: 'purple',
      bgClass: 'from-purple-900/20 to-indigo-900/20',
      borderClass: 'border-purple-800/30 hover:border-purple-600/50',
      glowClass: 'hover:shadow-purple-900/30',
      textClass: 'text-purple-400',
      badgeClass: 'bg-purple-500/20 text-purple-400 border-purple-500/30'
    }
  };

  const config = statusConfig[status];

  return (
    <div
      className={`
        relative group cursor-pointer
        bg-gradient-to-br ${config.bgClass}
        border ${config.borderClass}
        rounded-xl p-6
        transition-all duration-500
        hover:scale-105 hover:shadow-2xl ${config.glowClass}
        animate-fade-in
      `}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ animationDelay: `${id * 0.1}s` }}
    >
      {/* Status Badge */}
      <div className="absolute top-4 right-4">
        <div className={`
          px-3 py-1.5 rounded-full text-xs font-bold
          ${config.badgeClass} border
          flex items-center gap-1.5
          ${status === 'LAUNCHING' ? 'animate-pulse' : ''}
        `}>
          {config.icon}
          {status}
        </div>
      </div>

      {/* Agent Number */}
      <div className={`
        w-12 h-12 rounded-lg mb-4
        bg-gradient-to-br ${config.bgClass}
        border ${config.borderClass.replace('hover:', '')}
        flex items-center justify-center
        font-bold text-lg ${config.textClass}
      `}>
        {id < 10 ? `0${id}` : id}
      </div>

      {/* Agent Name */}
      <h3 className={`
        text-2xl font-black mb-2
        bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent
        group-hover:from-${config.color}-300 group-hover:to-white
        transition-all duration-300
      `}>
        {name}
      </h3>

      {/* Info */}
      {status !== 'OPEN' && (
        <div className="space-y-2 mb-4">
          {date && (
            <p className="text-sm text-gray-400">{date}</p>
          )}
          {trainer && (
            <p className="text-xs text-gray-500">Trainer: {trainer}</p>
          )}
          {worksCount && (
            <p className="text-xs text-gray-500">{worksCount.toLocaleString()} works</p>
          )}
        </div>
      )}

      {/* Description or Apply Text */}
      {status === 'OPEN' ? (
        <p className="text-sm text-gray-400 mb-4">
          Apply to train this agent
        </p>
      ) : description && (
        <p className="text-sm text-gray-400 mb-4 line-clamp-2">
          {description}
        </p>
      )}

      {/* Gallery Preview for profiles */}
      {hasProfile && name.toLowerCase() !== 'geppetto' && name.toLowerCase() !== 'koru' && (
        <div className={`
          overflow-hidden rounded-lg mb-4
          transition-all duration-500
          ${isHovered ? 'h-24 opacity-100' : 'h-0 opacity-0'}
        `}>
          <GalleryPreview 
            agentId={name.toLowerCase()} 
            limit={3} 
            className="h-full"
          />
        </div>
      )}

      {/* Action */}
      <div className={`
        flex items-center gap-2 ${config.textClass}
        group-hover:translate-x-2 transition-transform duration-300
      `}>
        <span className="text-sm font-medium">
          {status === 'OPEN' ? 'Apply Now' : hasProfile ? 'View Profile' : 'Coming Soon'}
        </span>
        <ArrowRight className="w-4 h-4" />
      </div>
    </div>
  );
}