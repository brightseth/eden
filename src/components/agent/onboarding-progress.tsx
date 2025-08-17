'use client';

import { useState, useMemo } from 'react';
import { 
  Check, Square, ChevronRight, Info, 
  Zap, Trophy, DollarSign, Palette, Users,
  Clock, AlertCircle
} from 'lucide-react';
import { 
  OnboardingProgress, 
  OnboardingTask,
  calculateStage,
  calculateMilestones,
  estimateTimeToLaunch
} from '@/types/onboarding';
import { ONBOARDING_TASKS, ONBOARDING_STAGES, MILESTONE_LABELS } from '@/lib/onboarding-tasks';

interface OnboardingProgressViewProps {
  agentId?: string;
  agentName?: string;
}

const MILESTONE_ICONS = {
  profileComplete: <Zap className="w-4 h-4" />,
  identityEstablished: <Palette className="w-4 h-4" />,
  revenueModelSet: <DollarSign className="w-4 h-4" />,
  firstCreation: <Trophy className="w-4 h-4" />,
  communityEngaged: <Users className="w-4 h-4" />
};

export function OnboardingProgressView({ agentId, agentName }: OnboardingProgressViewProps) {
  const [tasks, setTasks] = useState<OnboardingTask[]>(ONBOARDING_TASKS);
  const [expandedStage, setExpandedStage] = useState<string>('setup');

  // Calculate progress
  const progress = useMemo<OnboardingProgress>(() => {
    const completedTasks = tasks.filter(t => t.completed).length;
    const totalTasks = tasks.length;
    
    return {
      stage: calculateStage(tasks),
      completionPercentage: Math.round((completedTasks / totalTasks) * 100),
      estimatedTimeToLaunch: estimateTimeToLaunch(tasks),
      milestones: calculateMilestones(tasks)
    };
  }, [tasks]);

  const toggleTask = (taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const getStageProgress = (stageId: string) => {
    const stageTasks = tasks.filter(t => t.stage === stageId);
    const completed = stageTasks.filter(t => t.completed).length;
    return {
      completed,
      total: stageTasks.length,
      percentage: stageTasks.length > 0 ? Math.round((completed / stageTasks.length) * 100) : 0,
      requiredComplete: stageTasks.filter(t => t.required && t.completed).length,
      requiredTotal: stageTasks.filter(t => t.required).length
    };
  };

  const stageStatuses = {
    setup: getStageProgress('setup'),
    training: getStageProgress('training'),
    prelaunch: getStageProgress('prelaunch'),
    launched: { completed: 0, total: 0, percentage: 0, requiredComplete: 0, requiredTotal: 0 }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 p-6">
      {/* Header with Progress Overview */}
      <div className="border-b border-eden-white/10 pb-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-mono mb-2">
              {agentName || 'AGENT'} ONBOARDING
            </h1>
            <p className="text-sm text-eden-gray">
              SYSTEMATIC SETUP FOR AUTONOMOUS OPERATION
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-mono">{progress.completionPercentage}%</div>
            <div className="text-sm text-eden-gray flex items-center gap-2 mt-1">
              <Clock className="w-3 h-3" />
              {progress.estimatedTimeToLaunch}
            </div>
          </div>
        </div>

        {/* Overall Progress Bar */}
        <div className="w-full bg-eden-white/10 rounded-full h-3 mb-6">
          <div 
            className="bg-eden-white h-3 rounded-full transition-all duration-500"
            style={{ width: `${progress.completionPercentage}%` }}
          />
        </div>

        {/* Stage Indicators */}
        <div className="grid grid-cols-4 gap-4">
          {ONBOARDING_STAGES.map((stage, index) => {
            const stageProgress = stageStatuses[stage.id as keyof typeof stageStatuses];
            const isActive = progress.stage === stage.id;
            const isComplete = stageProgress.percentage === 100;
            const isPast = ONBOARDING_STAGES.findIndex(s => s.id === progress.stage) > index;
            
            return (
              <div 
                key={stage.id}
                className={`p-3 rounded-lg border transition-all ${
                  isActive ? 'border-eden-white bg-eden-white/10' : 
                  isComplete || isPast ? 'border-eden-white/50 bg-eden-white/5' : 
                  'border-eden-white/20'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono">{stage.title}</span>
                  {isComplete && <Check className="w-3 h-3" />}
                </div>
                <div className="w-full bg-eden-white/10 rounded-full h-1">
                  <div 
                    className="bg-eden-white h-1 rounded-full transition-all"
                    style={{ width: `${stageProgress.percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Milestones */}
      <div className="grid grid-cols-5 gap-4">
        {Object.entries(progress.milestones).map(([key, achieved]) => (
          <div 
            key={key}
            className={`p-4 rounded-lg border text-center transition-all ${
              achieved 
                ? 'border-eden-white/50 bg-eden-white/10' 
                : 'border-eden-white/20 opacity-50'
            }`}
          >
            <div className="flex justify-center mb-2">
              {MILESTONE_ICONS[key as keyof typeof MILESTONE_ICONS]}
            </div>
            <div className="text-xs font-mono">
              {MILESTONE_LABELS[key as keyof typeof MILESTONE_LABELS]}
            </div>
            {achieved && <Check className="w-3 h-3 mx-auto mt-2" />}
          </div>
        ))}
      </div>

      {/* Task Lists by Stage */}
      <div className="space-y-4">
        {ONBOARDING_STAGES.filter(s => s.id !== 'launched').map(stage => {
          const isExpanded = expandedStage === stage.id;
          const stageProgress = stageStatuses[stage.id as keyof typeof stageStatuses];
          const stageTasks = tasks.filter(t => t.stage === stage.id);
          
          return (
            <div 
              key={stage.id} 
              className="border border-eden-white/10 rounded-lg overflow-hidden"
            >
              {/* Stage Header */}
              <button
                onClick={() => setExpandedStage(isExpanded ? '' : stage.id)}
                className="w-full p-4 flex items-center justify-between hover:bg-eden-white/5 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <ChevronRight 
                    className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                  />
                  <div className="text-left">
                    <h2 className="font-mono text-sm">{stage.title}</h2>
                    <p className="text-xs text-eden-gray mt-1">{stage.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-xs font-mono">
                      {stageProgress.completed}/{stageProgress.total} COMPLETE
                    </div>
                    <div className="text-xs text-eden-gray">
                      {stageProgress.requiredComplete}/{stageProgress.requiredTotal} REQUIRED
                    </div>
                  </div>
                  <div className="w-24 bg-eden-white/10 rounded-full h-2">
                    <div 
                      className="bg-eden-white h-2 rounded-full transition-all"
                      style={{ width: `${stageProgress.percentage}%` }}
                    />
                  </div>
                </div>
              </button>

              {/* Tasks */}
              {isExpanded && (
                <div className="border-t border-eden-white/10 p-4 space-y-2">
                  {stageTasks.map(task => (
                    <TaskRow 
                      key={task.id} 
                      task={task} 
                      onToggle={toggleTask}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Launch Readiness */}
      {progress.stage === 'prelaunch' && (
        <div className="border border-eden-white/20 rounded-lg p-6 bg-eden-white/5">
          <h3 className="font-mono text-lg mb-4">LAUNCH READINESS</h3>
          <div className="space-y-3">
            {Object.entries(progress.milestones).map(([key, achieved]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-sm">{MILESTONE_LABELS[key as keyof typeof MILESTONE_LABELS]}</span>
                {achieved ? (
                  <Check className="w-4 h-4 text-green-400" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-yellow-400" />
                )}
              </div>
            ))}
          </div>
          {Object.values(progress.milestones).every(v => v) && (
            <button className="w-full mt-6 py-3 bg-eden-white text-eden-black font-mono text-sm hover:bg-eden-white/90 transition-colors">
              LAUNCH AGENT
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function TaskRow({ 
  task, 
  onToggle 
}: { 
  task: OnboardingTask; 
  onToggle: (id: string) => void;
}) {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-eden-white/5 hover:bg-eden-white/10 transition-colors">
      <button
        onClick={() => onToggle(task.id)}
        className="mt-0.5"
      >
        {task.completed ? (
          <Check className="w-4 h-4 text-eden-white" />
        ) : (
          <Square className="w-4 h-4 text-eden-gray" />
        )}
      </button>
      
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`font-mono text-sm ${task.completed ? 'line-through text-eden-gray' : ''}`}>
              {task.label}
            </span>
            {task.required && (
              <span className="text-xs text-yellow-400">REQUIRED</span>
            )}
            {task.milestone && (
              <span className="text-xs text-eden-gray">→ {MILESTONE_LABELS[task.milestone]}</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowInfo(!showInfo)}
              className="text-eden-gray hover:text-eden-white transition-colors"
            >
              <Info className="w-3 h-3" />
            </button>
            {task.action && (
              <span className="text-xs font-mono px-2 py-1 bg-eden-white/10 rounded">
                {task.action}
              </span>
            )}
          </div>
        </div>
        {showInfo && (
          <p className="text-xs text-eden-gray mt-2">{task.description}</p>
        )}
      </div>
    </div>
  );
}