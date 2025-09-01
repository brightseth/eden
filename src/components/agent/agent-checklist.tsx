'use client';

import { AgentMilestone } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Circle, Clock, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AgentChecklistProps {
  checklist?: AgentMilestone[];
}

export function AgentChecklist({ checklist }: AgentChecklistProps) {
  if (!checklist || checklist.length === 0) {
    return (
      <Card className="terminal-box">
        <CardContent className="py-12 text-center text-eden-gray">
          No tasks available yet
        </CardContent>
      </Card>
    );
  }

  // Group by stage
  const groupedTasks = checklist.reduce((acc, task) => {
    const stage = (task as any).stage || 'development';
    if (!acc[stage]) {
      acc[stage] = [];
    }
    acc[stage].push(task);
    return acc;
  }, {} as Record<number, AgentMilestone[]>);

  const stageNames = {
    0: 'Audition',
    1: 'Technique',
    2: 'Ensemble',
    3: 'Performance',
    4: 'Graduation',
  };

  // Sort stages and limit to current and next stage for display
  const sortedStages = Object.keys(groupedTasks)
    .map(Number)
    .sort((a, b) => a - b)
    .slice(0, 3); // Show current and next 2 stages

  return (
    <div className="space-y-6">
      {sortedStages.map(stage => {
        const tasks = groupedTasks[stage];
        const completedCount = tasks.filter(t => t.completed).length;
        const totalCount = tasks.length;
        const progress = (completedCount / totalCount) * 100;

        return (
          <Card key={stage} className="terminal-box">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="display-caps text-lg">
                  Stage {stage}: {stageNames[stage as keyof typeof stageNames]}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono text-eden-gray">
                    {completedCount}/{totalCount}
                  </span>
                  <div className="w-16 h-1.5 bg-eden-white/20 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-400 transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {tasks.map((task) => (
                  <div 
                    key={task.id}
                    className={cn(
                      "flex items-start gap-3 p-3 rounded-lg transition-all",
                      task.completed 
                        ? "bg-green-500/10 border border-green-500/20" 
                        : "bg-eden-white/5 border border-eden-white/10 hover:border-eden-white/20"
                    )}
                  >
                    <div className="mt-0.5">
                      {task.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-green-400" />
                      ) : (
                        <Circle className="w-5 h-5 text-eden-white/50" />
                      )}
                    </div>
                    
                    <div className="flex-1 space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className={cn(
                          "text-sm font-medium",
                          task.completed ? "text-green-400 line-through" : "text-eden-white"
                        )}>
                          {task.name}
                        </h4>
                        {task.isRequired && !task.completed && (
                          <Star className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                        )}
                      </div>
                      
                      <p className="text-xs text-eden-gray">
                        {task.description}
                      </p>
                      
                      {task.completed && task.completedAt && (
                        <div className="flex items-center gap-1 text-xs text-green-400/70">
                          <Clock className="w-3 h-3" />
                          <span>
                            Completed {new Date(task.completedAt).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}