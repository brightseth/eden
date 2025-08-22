'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Users, Archive, Sparkles, ExternalLink, Twitter, Instagram, Globe } from 'lucide-react';

type Common = {
  id: string;
  displayName: string;
  avatarUrl?: string;
  bio?: string;
  socials?: { x?: string; ig?: string; site?: string; farcaster?: string };
  links: { profile: string; archive?: string; practiceHub?: string; exhibitions?: string; collect?: string };
};

type AgentCard = Common & {
  kind: 'agent';
  status: 'LAUNCHING' | 'DEVELOPING' | 'LIVE';
  practice?: { name?: string; startAt?: string; day?: number; streak?: number; includeRate?: number };
  stats?: { archiveCount?: number; dropsCount?: number };
  trainers?: Array<{ id: string; displayName: string; link: string }>;
};

type TrainerCard = Common & {
  kind: 'trainer';
  tags?: string[];
  agents?: Array<{ id: string; displayName: string; link: string; status?: string }>;
};

export type ProfileCardData = AgentCard | TrainerCard;
export type CardVariant = 'grid' | 'panel' | 'site';
export type CardContext = 'public' | 'internal';

interface ProfileCardProps {
  data: ProfileCardData;
  variant?: CardVariant;
  context?: CardContext;
  expandable?: boolean;
}

export function ProfileCard({
  data,
  variant = 'grid',
  context = 'public',
  expandable = true,
}: ProfileCardProps) {
  const isAgent = data.kind === 'agent';
  
  // Status-based styling
  const statusStyles = {
    LAUNCHING: {
      bg: 'from-emerald-950/30',
      border: 'border-emerald-500/30',
      badge: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      glow: 'hover:shadow-emerald-500/20'
    },
    DEVELOPING: {
      bg: 'from-amber-950/30',
      border: 'border-amber-500/30', 
      badge: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      glow: 'hover:shadow-amber-500/20'
    },
    LIVE: {
      bg: 'from-violet-950/30',
      border: 'border-violet-500/30',
      badge: 'bg-violet-500/20 text-violet-400 border-violet-500/30',
      glow: 'hover:shadow-violet-500/20'
    },
    TRAINER: {
      bg: 'from-slate-950/30',
      border: 'border-slate-500/30',
      badge: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
      glow: 'hover:shadow-slate-500/20'
    }
  };

  const style = isAgent 
    ? statusStyles[(data as AgentCard).status] 
    : statusStyles.TRAINER;

  // Size variants
  const sizeClasses = {
    grid: 'p-4 h-[320px]',
    panel: 'p-5',
    site: 'p-6 md:p-8'
  };

  // Format practice info for agents
  const getPracticeInfo = () => {
    if (!isAgent) return null;
    const agent = data as AgentCard;
    
    if (agent.practice?.day) {
      return (
        <div className="flex items-center gap-2 text-sm">
          <Sparkles className="w-3 h-3" />
          <span>Day {agent.practice.day}</span>
          {agent.practice.includeRate && (
            <span className="text-xs opacity-70">• {Math.round(agent.practice.includeRate)}% INCLUDE</span>
          )}
        </div>
      );
    } else if (agent.practice?.startAt) {
      const startDate = new Date(agent.practice.startAt);
      const daysUntil = Math.ceil((startDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      return (
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="w-3 h-3" />
          <span>{daysUntil > 0 ? `Starts in ${daysUntil} days` : 'Starting soon'}</span>
        </div>
      );
    }
    return null;
  };

  // Grid variant (compact card)
  if (variant === 'grid') {
    return (
      <Link href={data.links.profile} className="block group">
        <div className={`
          relative rounded-xl bg-gradient-to-br ${style.bg} to-black 
          border ${style.border} ${sizeClasses[variant]}
          transition-all duration-300 hover:scale-105 hover:-translate-y-1
          hover:shadow-xl ${style.glow} overflow-hidden
        `}>
          {/* Status badge */}
          <div className="absolute top-3 right-3 z-10">
            <div className={`text-[10px] font-bold px-2 py-1 rounded-full border ${style.badge}`}>
              {isAgent ? (data as AgentCard).status : 'TRAINER'}
            </div>
          </div>

          {/* Avatar and name */}
          <div className="flex items-start gap-3 mb-3">
            <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900">
              {data.avatarUrl ? (
                <Image src={data.avatarUrl} alt={data.displayName} fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-lg font-bold">
                  {data.displayName[0]}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-white truncate">{data.displayName}</h3>
              <p className="text-xs text-gray-400 truncate">
                {isAgent ? `Agent #${data.id}` : 'Trainer'}
              </p>
            </div>
          </div>

          {/* Primary info */}
          <div className="space-y-2 mb-3">
            {isAgent ? getPracticeInfo() : (
              <div className="flex items-center gap-2 text-sm">
                <Users className="w-3 h-3" />
                <span className="text-xs">
                  {(data as TrainerCard).agents?.length 
                    ? `Trains: ${(data as TrainerCard).agents.map(a => a.displayName).join(' • ')}`
                    : 'No agents yet'}
                </span>
              </div>
            )}
            
            {/* Stats */}
            {isAgent && (data as AgentCard).stats?.archiveCount ? (
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Archive className="w-3 h-3" />
                <span>{(data as AgentCard).stats.archiveCount.toLocaleString()} works</span>
              </div>
            ) : null}
          </div>

          {/* Trainer/Agent chips */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex flex-wrap gap-1">
              {isAgent && (data as AgentCard).trainers?.map(trainer => (
                <span key={trainer.id} className="text-[10px] px-2 py-0.5 bg-white/5 rounded-full border border-white/10">
                  {trainer.displayName}
                </span>
              ))}
              {!isAgent && (data as TrainerCard).tags?.slice(0, 3).map(tag => (
                <span key={tag} className="text-[10px] px-2 py-0.5 bg-white/5 rounded-full border border-white/10">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-purple-900/90 via-purple-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4 pointer-events-none">
            <div className="w-full">
              <p className="text-xs font-bold text-white mb-1">VIEW PROFILE →</p>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Site variant (hero profile)
  if (variant === 'site') {
    return (
      <div className={`rounded-2xl bg-gradient-to-br ${style.bg} to-black border ${style.border} ${sizeClasses[variant]}`}>
        {/* Header with avatar */}
        <div className="flex flex-col md:flex-row gap-6 mb-6">
          <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900">
            {data.avatarUrl ? (
              <Image src={data.avatarUrl} alt={data.displayName} fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-3xl font-bold">
                {data.displayName[0]}
              </div>
            )}
          </div>
          
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">{data.displayName}</h1>
                <div className={`inline-flex text-xs font-bold px-3 py-1 rounded-full border ${style.badge}`}>
                  {isAgent ? (data as AgentCard).status : 'TRAINER'}
                </div>
              </div>
              
              {/* Social links */}
              {data.socials && (
                <div className="flex gap-2">
                  {data.socials.x && (
                    <a href={`https://x.com/${data.socials.x}`} target="_blank" rel="noopener noreferrer" 
                       className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
                      <Twitter className="w-4 h-4" />
                    </a>
                  )}
                  {data.socials.ig && (
                    <a href={`https://instagram.com/${data.socials.ig}`} target="_blank" rel="noopener noreferrer"
                       className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
                      <Instagram className="w-4 h-4" />
                    </a>
                  )}
                  {data.socials.site && (
                    <a href={data.socials.site} target="_blank" rel="noopener noreferrer"
                       className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
                      <Globe className="w-4 h-4" />
                    </a>
                  )}
                </div>
              )}
            </div>
            
            {/* Bio */}
            {data.bio && (
              <p className="text-gray-300 mb-4">{data.bio}</p>
            )}
            
            {/* Practice info or trainer info */}
            <div className="space-y-3">
              {isAgent ? (
                <>
                  {getPracticeInfo()}
                  {(data as AgentCard).stats && (
                    <div className="flex gap-4">
                      {(data as AgentCard).stats.archiveCount && (
                        <div className="flex items-center gap-2">
                          <Archive className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">{(data as AgentCard).stats.archiveCount.toLocaleString()} works</span>
                        </div>
                      )}
                      {(data as AgentCard).stats.dropsCount && (
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">{(data as AgentCard).stats.dropsCount} drops</span>
                        </div>
                      )}
                    </div>
                  )}
                  {(data as AgentCard).trainers && (
                    <div>
                      <p className="text-xs text-gray-400 mb-2">Trained by</p>
                      <div className="flex gap-2">
                        {(data as AgentCard).trainers.map(trainer => (
                          <Link key={trainer.id} href={trainer.link}
                                className="px-3 py-1 bg-white/5 rounded-full border border-white/10 hover:bg-white/10 transition-colors text-sm">
                            {trainer.displayName}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <>
                  {(data as TrainerCard).agents && (data as TrainerCard).agents.length > 0 && (
                    <div>
                      <p className="text-xs text-gray-400 mb-2">Training agents</p>
                      <div className="flex flex-wrap gap-2">
                        {(data as TrainerCard).agents.map(agent => (
                          <Link key={agent.id} href={agent.link}
                                className="px-3 py-1 bg-white/5 rounded-full border border-white/10 hover:bg-white/10 transition-colors text-sm">
                            {agent.displayName}
                            {agent.status && (
                              <span className="ml-2 text-xs opacity-60">{agent.status}</span>
                            )}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
            
            {/* Action buttons */}
            <div className="flex flex-wrap gap-3 mt-6">
              {data.links.archive && (
                <Link href={data.links.archive}
                      className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors text-sm font-medium">
                  View Archive
                </Link>
              )}
              {data.links.practiceHub && isAgent && (
                <Link href={data.links.practiceHub}
                      className="px-4 py-2 bg-purple-600/20 rounded-lg hover:bg-purple-600/30 transition-colors text-sm font-medium text-purple-400">
                  {(data as AgentCard).practice?.name || 'Practice Hub'}
                </Link>
              )}
              {context === 'internal' && isAgent && (
                <Link href={`/academy/${data.id}/studio`}
                      className="px-4 py-2 bg-blue-600/20 rounded-lg hover:bg-blue-600/30 transition-colors text-sm font-medium text-blue-400">
                  Open Studio
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Panel variant (sidebar)
  return (
    <div className={`rounded-xl bg-gradient-to-br ${style.bg} to-black border ${style.border} ${sizeClasses[variant]}`}>
      {/* Compact header */}
      <div className="flex items-center gap-3 mb-3">
        <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900">
          {data.avatarUrl ? (
            <Image src={data.avatarUrl} alt={data.displayName} fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-sm font-bold">
              {data.displayName[0]}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-sm text-white truncate">{data.displayName}</h3>
          <span className={`text-[10px] font-bold ${style.badge.split(' ')[1]}`}>
            {isAgent ? (data as AgentCard).status : 'TRAINER'}
          </span>
        </div>
      </div>
      
      {/* Bio snippet */}
      {data.bio && (
        <p className="text-xs text-gray-400 line-clamp-2 mb-3">{data.bio}</p>
      )}
      
      {/* Quick stats */}
      <div className="space-y-2 text-xs">
        {isAgent ? getPracticeInfo() : (
          <div className="text-gray-400">
            {(data as TrainerCard).agents?.length 
              ? `Training ${(data as TrainerCard).agents.length} agents`
              : 'No agents yet'}
          </div>
        )}
      </div>
      
      {/* Quick links */}
      <div className="flex gap-2 mt-4">
        <Link href={data.links.profile}
              className="flex-1 text-center py-1.5 bg-white/5 rounded-lg hover:bg-white/10 transition-colors text-xs">
          View Profile
        </Link>
        {context === 'internal' && isAgent && (
          <Link href={`/academy/${data.id}/studio`}
                className="flex-1 text-center py-1.5 bg-blue-600/20 rounded-lg hover:bg-blue-600/30 transition-colors text-xs text-blue-400">
            Studio
          </Link>
        )}
      </div>
    </div>
  );
}