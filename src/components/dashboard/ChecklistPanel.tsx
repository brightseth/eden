'use client';

import { Task, Blocker } from '@/types';
import { cn } from '@/lib/utils';
import { CheckCircle2, Circle, AlertTriangle, Info } from 'lucide-react';

interface ChecklistPanelProps {
  mustDo: Task[];
  shouldDo: Task[];
  couldDo: Task[];
  blockers: Blocker[];
}

function TaskItem({ task }: { task: Task }) {
  const Icon = task.completed ? CheckCircle2 : Circle;
  
  return (
    <div className={cn(
      'task-item',
      task.completed && 'opacity-50'
    )}>
      <div className="flex items-center gap-3">
        <Icon className={cn(
          'w-4 h-4',
          task.completed ? 'text-eden-social' : 'text-eden-gray'
        )} />
        <span className={cn(
          'flex-1',
          `category-${task.category}`
        )}>
          {task.title}
        </span>
        {task.source === 'auto' && (
          <span className="task-auto-badge">AUTO</span>
        )}
      </div>
      {task.progress && (
        <div className="mt-2 ml-7">
          <div className="flex justify-between text-xs text-eden-gray mb-1">
            <span>Progress</span>
            <span>{task.progress.current}/{task.progress.total}</span>
          </div>
          <div className="h-1 bg-eden-white/10 rounded">
            <div 
              className="h-full bg-eden-white rounded"
              style={{ width: `${(task.progress.current / task.progress.total) * 100}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function BlockerItem({ blocker }: { blocker: Blocker }) {
  const Icon = blocker.severity === 'critical' ? AlertTriangle : Info;
  const color = blocker.severity === 'critical' ? 'text-eden-economic' : 
                 blocker.severity === 'warning' ? 'text-yellow-400' : 'text-eden-gray';
  
  return (
    <div className={cn(
      'p-4 border rounded mb-2',
      blocker.severity === 'critical' ? 'border-eden-economic bg-eden-economic/10' :
      blocker.severity === 'warning' ? 'border-yellow-400 bg-yellow-400/10' :
      'border-eden-gray bg-eden-gray/10'
    )}>
      <div className="flex items-start gap-3">
        <Icon className={cn('w-4 h-4 mt-0.5', color)} />
        <div className="flex-1">
          <p className={cn('text-sm font-bold', color)}>{blocker.message}</p>
          <p className="text-xs text-eden-gray mt-1">{blocker.action}</p>
        </div>
      </div>
    </div>
  );
}

export function ChecklistPanel({ mustDo, shouldDo, couldDo, blockers }: ChecklistPanelProps) {
  const totalTasks = mustDo.length + shouldDo.length + couldDo.length;
  const completedTasks = [...mustDo, ...shouldDo, ...couldDo].filter(t => t.completed).length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="terminal-box p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold display-caps">Today&apos;s Checklist</h3>
        <div className="text-sm font-mono">
          <span className="text-eden-social">{completedTasks}</span>
          <span className="text-eden-gray">/{totalTasks}</span>
          <span className="text-eden-gray ml-2">({completionRate}%)</span>
        </div>
      </div>

      {/* Blockers */}
      {blockers.length > 0 && (
        <div className="mb-6">
          <h4 className="text-xs text-eden-gray uppercase tracking-wider mb-3">BLOCKERS</h4>
          {blockers.map((blocker, i) => (
            <BlockerItem key={i} blocker={blocker} />
          ))}
        </div>
      )}

      {/* Must Do */}
      {mustDo.length > 0 && (
        <div className="mb-6">
          <h4 className="text-xs text-eden-gray uppercase tracking-wider mb-3">MUST DO</h4>
          <div className="space-y-2">
            {mustDo.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>
        </div>
      )}

      {/* Should Do */}
      {shouldDo.length > 0 && (
        <div className="mb-6">
          <h4 className="text-xs text-eden-gray uppercase tracking-wider mb-3">SHOULD DO</h4>
          <div className="space-y-2">
            {shouldDo.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>
        </div>
      )}

      {/* Could Do */}
      {couldDo.length > 0 && (
        <div>
          <h4 className="text-xs text-eden-gray uppercase tracking-wider mb-3">COULD DO</h4>
          <div className="space-y-2">
            {couldDo.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}