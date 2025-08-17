'use client';

import { Agent, AgentOverview } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ExternalLink, Twitter, Globe, Wallet } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AgentHeroProps {
  agent: Agent;
  overview: AgentOverview;
}

export function AgentHero({ agent, overview }: AgentHeroProps) {
  const readinessClass = 
    overview.metrics.readinessScore >= 70 ? 'text-green-400' :
    overview.metrics.readinessScore >= 40 ? 'text-yellow-400' : 'text-red-400';

  const stageNames = {
    0: 'AUDITION',
    1: 'TECHNIQUE', 
    2: 'ENSEMBLE',
    3: 'PERFORMANCE',
    4: 'GRADUATION',
    5: 'SPIRIT',
  };

  return (
    <Card className="terminal-box overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            currentColor 2px,
            currentColor 4px
          ), repeating-linear-gradient(
            90deg,
            transparent,
            transparent 2px,
            currentColor 2px,
            currentColor 4px
          )`,
          backgroundSize: '100px 100px'
        }} />
      </div>

      <div className="relative p-8">
        <div className="flex items-start justify-between gap-6">
          {/* Left Content */}
          <div className="flex-1 space-y-6">
            {/* Agent Name & Stage */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="display-caps text-5xl tracking-tight">{agent.name}</h1>
                <Badge 
                  variant="outline" 
                  className="text-xs font-mono border-eden-white/50"
                >
                  {stageNames[agent.currentStage as keyof typeof stageNames]}
                </Badge>
              </div>
              
              {/* Artist Statement */}
              <p className="text-lg text-eden-gray leading-relaxed max-w-2xl">
                {agent.artistStatement}
              </p>
            </div>

            {/* Key Metrics Bar */}
            <div className="flex items-center gap-6 text-sm font-mono">
              <div className="flex items-center gap-2">
                <span className="text-eden-gray">READINESS:</span>
                <span className={cn('font-bold', readinessClass)}>
                  {overview.metrics.readinessScore}%
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-eden-gray">CREATIONS:</span>
                <span className="font-bold">{overview.metrics.totalCreations}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-eden-gray">STREAK:</span>
                <span className="font-bold">{overview.metrics.streakDays}D</span>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-eden-gray">REVENUE:</span>
                <span className="font-bold text-green-400">
                  ${overview.metrics.revenue.toFixed(0)}
                </span>
              </div>
            </div>

            {/* Links & Metadata */}
            <div className="flex items-center gap-3">
              {agent.metadata?.twitterHandle && (
                <a 
                  href={`https://twitter.com/${agent.metadata.twitterHandle.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-eden-white/10 hover:bg-eden-white/20 transition-colors text-xs font-mono"
                >
                  <Twitter className="w-3 h-3" />
                  <span>{agent.metadata.twitterHandle}</span>
                  <ExternalLink className="w-3 h-3 opacity-50" />
                </a>
              )}
              
              {agent.metadata?.farcasterUsername && (
                <a 
                  href={`https://warpcast.com/${agent.metadata.farcasterUsername}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-eden-white/10 hover:bg-eden-white/20 transition-colors text-xs font-mono"
                >
                  <Globe className="w-3 h-3" />
                  <span>@{agent.metadata.farcasterUsername}</span>
                  <ExternalLink className="w-3 h-3 opacity-50" />
                </a>
              )}
              
              {agent.walletAddress && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-eden-white/10 text-xs font-mono">
                  <Wallet className="w-3 h-3" />
                  <span>{agent.walletAddress.slice(0, 6)}...{agent.walletAddress.slice(-4)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Right Content - Avatar */}
          {agent.avatarUrl ? (
            <div className="flex-shrink-0">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg blur-xl" />
                <img 
                  src={agent.avatarUrl} 
                  alt={agent.name}
                  className="relative w-32 h-32 rounded-lg border-2 border-eden-white/20 object-cover"
                />
              </div>
            </div>
          ) : (
            <div className="flex-shrink-0">
              <div className="w-32 h-32 rounded-lg border-2 border-eden-white/20 bg-gradient-to-br from-purple-500/10 to-pink-500/10 flex items-center justify-center">
                <span className="display-caps text-4xl opacity-30">
                  {agent.name.charAt(0)}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Training Progress Bar */}
        <div className="mt-8 pt-6 border-t border-eden-white/10">
          <div className="flex items-center justify-between text-xs font-mono mb-2">
            <span className="text-eden-gray">TRAINING PROGRESS</span>
            <span className="text-eden-white">
              DAY {agent.currentDay} OF {agent.totalDays}
            </span>
          </div>
          <div className="h-2 bg-eden-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
              style={{ width: `${(agent.currentDay / agent.totalDays) * 100}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-xs font-mono mt-2">
            <span className="text-eden-gray">
              {Math.round((agent.currentDay / agent.totalDays) * 100)}% COMPLETE
            </span>
            <span className="text-eden-gray">
              {agent.daysUntilLaunch} DAYS UNTIL LAUNCH
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}