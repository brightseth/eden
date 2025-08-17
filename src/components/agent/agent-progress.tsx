'use client';

import { Agent, AgentOverview } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Circle, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { safeToInt } from '@/lib/utils/number';

interface AgentProgressProps {
  agent: Agent;
  overview: AgentOverview;
}

const stages = [
  { id: 0, name: 'Audition', description: 'Profile setup and initial tests', color: 'bg-blue-500' },
  { id: 1, name: 'Technique', description: 'Master core creative skills', color: 'bg-purple-500' },
  { id: 2, name: 'Ensemble', description: 'Build community connections', color: 'bg-pink-500' },
  { id: 3, name: 'Performance', description: 'Generate revenue and impact', color: 'bg-orange-500' },
  { id: 4, name: 'Graduation', description: 'Launch and achieve autonomy', color: 'bg-green-500' },
];

export function AgentProgress({ agent, overview }: AgentProgressProps) {
  const currentStageIndex = stages.findIndex(s => s.id === agent.currentStage);
  const stageProgress = ((agent.currentDay % 20) / 20) * 100; // Assuming 20 days per stage

  return (
    <Card className="terminal-box">
      <CardHeader>
        <CardTitle className="display-caps text-xl">Training Journey</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-eden-gray">Overall Progress</span>
            <span className="font-mono">{agent.currentDay} / {agent.totalDays} days</span>
          </div>
          <Progress 
            value={(agent.currentDay / agent.totalDays) * 100} 
            className="h-3"
          />
        </div>

        {/* Stage Timeline */}
        <div className="space-y-4">
          {stages.map((stage, index) => {
            const isCompleted = index < currentStageIndex;
            const isCurrent = index === currentStageIndex;
            const isLocked = index > currentStageIndex;

            return (
              <div key={stage.id} className="relative">
                {/* Connector Line */}
                {index < stages.length - 1 && (
                  <div 
                    className={cn(
                      "absolute left-4 top-10 w-0.5 h-16",
                      isCompleted ? "bg-green-400" : "bg-eden-white/20"
                    )}
                  />
                )}

                <div className="flex items-start gap-4">
                  {/* Stage Icon */}
                  <div className="relative z-10">
                    {isCompleted ? (
                      <CheckCircle2 className="w-8 h-8 text-green-400" />
                    ) : isCurrent ? (
                      <div className="relative">
                        <Circle className="w-8 h-8 text-eden-white" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-3 h-3 bg-eden-white rounded-full animate-pulse" />
                        </div>
                      </div>
                    ) : (
                      <Lock className="w-8 h-8 text-eden-white/30" />
                    )}
                  </div>

                  {/* Stage Content */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className={cn(
                        "font-mono text-sm uppercase tracking-wider",
                        isCurrent ? "text-eden-white" : 
                        isCompleted ? "text-green-400" : 
                        "text-eden-gray"
                      )}>
                        Stage {stage.id}: {stage.name}
                      </h3>
                      {isCurrent && (
                        <span className="text-xs font-mono text-eden-gray">
                          {safeToInt(stageProgress)}%
                        </span>
                      )}
                    </div>
                    
                    <p className={cn(
                      "text-sm",
                      isLocked ? "text-eden-white/30" : "text-eden-gray"
                    )}>
                      {stage.description}
                    </p>

                    {isCurrent && (
                      <Progress 
                        value={stageProgress} 
                        className="h-1.5 mt-2"
                      />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Launch Countdown */}
        <div className="terminal-box bg-eden-black/50 p-4 space-y-2">
          <div className="text-xs text-eden-gray uppercase tracking-wider">Launch Countdown</div>
          <div className="flex items-baseline gap-2">
            <span className="display-caps text-3xl">{agent.daysUntilLaunch}</span>
            <span className="text-eden-gray">days remaining</span>
          </div>
          <div className="text-xs text-eden-gray">
            Target: {new Date(agent.launchDate).toLocaleDateString('en-US', { 
              month: 'long', 
              day: 'numeric', 
              year: 'numeric' 
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}