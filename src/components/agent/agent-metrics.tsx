'use client';

import { Agent, AgentOverview, DailyMetrics } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Activity, DollarSign, Users, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { safeToFixed, safeToInt } from '@/lib/utils/number';

interface AgentMetricsProps {
  agent: Agent;
  overview: AgentOverview;
  metrics?: DailyMetrics[];
}

export function AgentMetrics({ agent, overview, metrics }: AgentMetricsProps) {
  const latestMetric = metrics?.[0];
  const previousMetric = metrics?.[1];
  
  const creationsTrend = latestMetric && previousMetric 
    ? ((latestMetric.creationsCount - previousMetric.creationsCount) / Math.max(previousMetric.creationsCount, 1)) * 100
    : 0;
    
  const engagementTrend = latestMetric && previousMetric
    ? ((latestMetric.engagementScore - previousMetric.engagementScore) / Math.max(previousMetric.engagementScore, 1)) * 100
    : 0;

  return (
    <div className="space-y-4">
      <Card className="terminal-box">
        <CardHeader>
          <CardTitle className="display-caps text-lg">Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Readiness Score */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-eden-gray">Readiness</span>
              <span className={cn(
                'font-mono',
                overview.metrics.readinessScore >= 70 ? 'text-green-400' :
                overview.metrics.readinessScore >= 40 ? 'text-yellow-400' : 'text-red-400'
              )}>
                {overview.metrics.readinessScore}%
              </span>
            </div>
            <Progress 
              value={overview.metrics.readinessScore} 
              className="h-2"
            />
          </div>

          {/* Key Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-eden-gray text-xs">
                <Activity className="w-3 h-3" />
                <span>Creations</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-lg">{overview.metrics.totalCreations}</span>
                {creationsTrend !== 0 && (
                  <span className={cn(
                    'text-xs font-mono flex items-center gap-0.5',
                    creationsTrend > 0 ? 'text-green-400' : 'text-red-400'
                  )}>
                    {creationsTrend > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {Math.abs(creationsTrend).toFixed(0)}%
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-eden-gray text-xs">
                <DollarSign className="w-3 h-3" />
                <span>Revenue</span>
              </div>
              <div className="font-mono text-lg">
                ${safeToFixed(overview.metrics.revenue)}
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-eden-gray text-xs">
                <Zap className="w-3 h-3" />
                <span>Streak</span>
              </div>
              <div className="font-mono text-lg">
                {overview.metrics.streakDays} days
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-eden-gray text-xs">
                <Users className="w-3 h-3" />
                <span>VIP Commits</span>
              </div>
              <div className="font-mono text-lg">
                {overview.metrics.vipCommits}
              </div>
            </div>
          </div>

          {/* Latest Stats */}
          {latestMetric && (
            <div className="pt-4 border-t border-eden-white/20 space-y-3">
              <div className="text-xs text-eden-gray uppercase tracking-wider">Today&apos;s Activity</div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-eden-gray">Creations</span>
                  <span className="font-mono">{latestMetric.creationsCount}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-eden-gray">Followers</span>
                  <span className="font-mono">{latestMetric.farcasterFollowers}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-eden-gray">Engagement</span>
                  <span className={cn(
                    'font-mono',
                    engagementTrend > 0 ? 'text-green-400' : 
                    engagementTrend < 0 ? 'text-red-400' : ''
                  )}>
                    {latestMetric.engagementScore.toFixed(1)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-eden-gray">Balance</span>
                  <span className="font-mono">
                    ${latestMetric.walletBalance.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stage Progress */}
      <Card className="terminal-box">
        <CardHeader>
          <CardTitle className="display-caps text-lg">Stage Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-eden-gray">Current Day</span>
              <span className="font-mono">{agent.currentDay} / {agent.totalDays}</span>
            </div>
            <Progress 
              value={(agent.currentDay / agent.totalDays) * 100} 
              className="h-2"
            />
            <div className="text-xs text-eden-gray text-right">
              {agent.daysUntilLaunch} days until launch
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}