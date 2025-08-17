'use client';

import Link from 'next/link';
import { Agent, AgentOverview } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AgentHeaderProps {
  agent: Agent;
  overview: AgentOverview;
}

const stageNames = {
  0: 'Audition',
  1: 'Technique',
  2: 'Ensemble',
  3: 'Performance',
  4: 'Graduation',
  5: 'Spirit',
};

export function AgentHeader({ agent, overview }: AgentHeaderProps) {
  const readinessClass = 
    overview.metrics.readinessScore >= 70 ? 'text-green-400' :
    overview.metrics.readinessScore >= 40 ? 'text-yellow-400' : 'text-red-400';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
        </Link>
        
        <div className="flex items-center gap-2">
          {agent.metadata?.twitterHandle && (
            <Link 
              href={`https://twitter.com/${agent.metadata.twitterHandle.replace('@', '')}`}
              target="_blank"
            >
              <Button variant="outline" size="sm" className="gap-2">
                <ExternalLink className="w-4 h-4" />
                Twitter
              </Button>
            </Link>
          )}
          {agent.metadata?.farcasterUsername && (
            <Link 
              href={`https://warpcast.com/${agent.metadata.farcasterUsername}`}
              target="_blank"
            >
              <Button variant="outline" size="sm" className="gap-2">
                <ExternalLink className="w-4 h-4" />
                Farcaster
              </Button>
            </Link>
          )}
        </div>
      </div>

      <div className="terminal-box p-8">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <h1 className="display-caps text-4xl">{agent.name}</h1>
            <p className="text-lg text-eden-gray max-w-2xl">
              {agent.artistStatement}
            </p>
            
            <div className="flex items-center gap-4 mt-4">
              <Badge variant="outline" className="text-sm">
                Stage {agent.currentStage}: {stageNames[agent.currentStage as keyof typeof stageNames]}
              </Badge>
              <Badge 
                variant="outline" 
                className={cn(
                  'text-sm',
                  agent.economyMode === 'training' ? 'economy-training' : 'economy-live'
                )}
              >
                {agent.economyMode.toUpperCase()} MODE
              </Badge>
              <span className={cn('text-sm font-mono', readinessClass)}>
                {overview.metrics.readinessScore}% Ready
              </span>
            </div>
          </div>
          
          {agent.avatarUrl && (
            <img 
              src={agent.avatarUrl} 
              alt={agent.name}
              className="w-24 h-24 rounded-lg border border-eden-white/20"
            />
          )}
        </div>
      </div>
    </div>
  );
}