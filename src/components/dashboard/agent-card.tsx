'use client';

import Link from 'next/link';
import { Agent } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDate, cn } from '@/lib/utils';
import { useAgentOverview } from '@/hooks/use-agent-overview';
import { safeToFixed } from '@/lib/utils/number';

interface AgentCardProps {
  agent: Agent;
}

const stageNames = {
  0: 'Audition',
  1: 'Technique', 
  2: 'Ensemble',
  3: 'Performance',
  4: 'Graduation',
  5: 'Spirit',
};

export function AgentCard({ agent }: AgentCardProps) {
  const { data: overview } = useAgentOverview(agent.id);
  
  const progress = (agent.currentDay / agent.totalDays) * 100;
  const progressBar = '█'.repeat(Math.floor(progress / 5)) + 
                     '░'.repeat(20 - Math.floor(progress / 5));
  
  const statusColor = agent.daysUntilLaunch > 30 
    ? 'status-on-track' 
    : agent.daysUntilLaunch > 7 
    ? 'status-at-risk' 
    : 'status-behind';
    
  const economyBadgeClass = agent.economyMode === 'training' 
    ? 'economy-training' 
    : 'economy-live';
  return (
    <Link href={`/agent/${agent.id}`}>
      <Card className="terminal-box interactive-element h-full">
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-4">
            <h3 className="display-caps text-lg tracking-wider">{agent.name}</h3>
            <Badge className={`text-xs ${economyBadgeClass}`}>
              {agent.economyMode.toUpperCase()}
            </Badge>
          </div>
          
          {/* Avatar placeholder */}
          <div className="mb-4">
            <div className="w-20 h-20 border border-eden-white/40 flex items-center justify-center">
              {agent.avatarUrl ? (
                <img 
                  src={agent.avatarUrl} 
                  alt={agent.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-xs text-eden-gray font-mono">[IMG]</div>
              )}
            </div>
          </div>
          
          {/* Progress */}
          <div className="mb-4">
            <div className="text-xs text-eden-gray mb-1 font-mono">
              DAY {agent.currentDay} OF {agent.totalDays}
            </div>
            <div className="progress-bar text-xs mb-1">
              [{progressBar}] {Math.floor(progress)}%
            </div>
            <div className="text-xs text-eden-gray">
              Progress: {overview?.metrics.readinessScore || 0}% ready
            </div>
          </div>
          
          {/* Current Stage */}
          <div className="mb-4">
            <div className="text-xs text-eden-gray mb-1">CURRENT PHASE:</div>
            <div className="text-sm display-caps category-creative">
              {stageNames[agent.currentStage as keyof typeof stageNames] || 'Unknown'}
            </div>
          </div>
          
          {/* Key Metrics */}
          <div className="space-y-2 mb-4 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-eden-gray">CREATIONS:</span>
              <span>{overview?.metrics.totalCreations || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-eden-gray">VIP COMMITS:</span>
              <span>{overview?.metrics.vipCommits || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-eden-gray">REVENUE:</span>
              <span className={agent.economyMode === 'training' ? 'text-gray-400' : 'text-white'}>
                ${safeToFixed(overview?.metrics.revenue)}
                {agent.economyMode === 'training' && ' [SIM]'}
              </span>
            </div>
          </div>
          
          {/* Countdown */}
          <div className="text-xs text-center pt-3 border-t border-eden-white/20">
            <div className="text-eden-gray mb-1">LAUNCH DATE:</div>
            <div className="font-mono">{formatDate(agent.launchDate)}</div>
            <div className={`text-sm mt-1 ${statusColor}`}>
              {agent.daysUntilLaunch} DAYS REMAINING
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}