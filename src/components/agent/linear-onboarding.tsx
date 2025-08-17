'use client';

import { useState, useMemo } from 'react';
import { Check, Square, AlertTriangle, Info, ChevronRight, Lock } from 'lucide-react';
import { 
  canCompleteTask, 
  checkLaunchReadiness,
  criticalTasks,
  taskDependencies
} from '@/lib/task-dependencies';

interface Task {
  id: string;
  label: string;
  stage: 1 | 2 | 3;
  required: boolean;
  completed: boolean;
}

const ONBOARDING_TASKS: Task[] = [
  // STAGE 1: IDENTITY
  { id: 'username', label: 'Set username', stage: 1, required: true, completed: false },
  { id: 'display-name', label: 'Set display name', stage: 1, required: true, completed: false },
  { id: 'avatar', label: 'Upload profile image', stage: 1, required: true, completed: false },
  { id: 'bio', label: 'Write description', stage: 1, required: true, completed: false },
  { id: 'connect-wallet', label: 'Connect wallet', stage: 1, required: true, completed: false },
  { id: 'verify-wallet', label: 'Verify wallet ownership', stage: 1, required: true, completed: false },
  { id: 'set-ens', label: 'Add ENS domain', stage: 1, required: false, completed: false },
  { id: 'instructions', label: 'Set creative instructions', stage: 1, required: true, completed: false },
  
  // STAGE 2: CAPABILITIES
  { id: 'image-gen', label: 'Enable image creation', stage: 2, required: true, completed: false },
  { id: 'audio-gen', label: 'Enable audio creation', stage: 2, required: false, completed: false },
  { id: 'lora', label: 'Train LoRA model', stage: 2, required: true, completed: false },
  { id: 'test-creation', label: 'Create first content', stage: 2, required: true, completed: false },
  { id: 'voice', label: 'Select voice', stage: 2, required: false, completed: false },
  { id: 'collections', label: 'Enable collections', stage: 2, required: false, completed: false },
  
  // STAGE 3: ECONOMICS
  { id: 'discord', label: 'Connect Discord', stage: 3, required: true, completed: false },
  { id: 'twitter', label: 'Connect Twitter/X', stage: 3, required: false, completed: false },
  { id: 'instagram', label: 'Add Instagram', stage: 3, required: false, completed: false },
  { id: 'farcaster', label: 'Connect Farcaster', stage: 3, required: false, completed: false },
  { id: 'set-token-contract', label: 'Set token contract', stage: 3, required: false, completed: false },
  { id: 'set-pricing', label: 'Set daily practice price', stage: 3, required: true, completed: false },
  { id: 'usage-costs', label: 'Configure usage costs', stage: 3, required: true, completed: false },
  { id: 'shopify', label: 'Connect Shopify', stage: 3, required: false, completed: false },
  { id: 'printify', label: 'Enable merchandise', stage: 3, required: false, completed: false },
  { id: 'collaborators', label: 'Add collaborators', stage: 3, required: false, completed: false },
  { id: 'collective', label: 'Join collective', stage: 3, required: false, completed: false },
  { id: 'public-launch', label: 'Make agent public', stage: 3, required: true, completed: false }
];

const STAGE_NAMES = {
  1: 'IDENTITY',
  2: 'CAPABILITIES', 
  3: 'ECONOMICS'
} as const;

export function LinearOnboarding() {
  const [tasks, setTasks] = useState<Task[]>(ONBOARDING_TASKS);
  const [expandedStage, setExpandedStage] = useState<number>(1);

  const completedTaskIds = useMemo(() => 
    tasks.filter(t => t.completed).map(t => t.id),
    [tasks]
  );

  const toggleTask = (taskId: string) => {
    const { canComplete, missingDependencies } = canCompleteTask(taskId, completedTaskIds);
    
    if (!canComplete && !tasks.find(t => t.id === taskId)?.completed) {
      alert(`Complete these first: ${missingDependencies.join(', ')}`);
      return;
    }
    
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const getStageProgress = (stage: number) => {
    const stageTasks = tasks.filter(t => t.stage === stage);
    const requiredTasks = stageTasks.filter(t => t.required);
    const completedRequired = requiredTasks.filter(t => t.completed).length;
    const completedTotal = stageTasks.filter(t => t.completed).length;
    
    return {
      percentage: requiredTasks.length > 0 
        ? Math.round((completedRequired / requiredTasks.length) * 100)
        : 0,
      completedRequired,
      totalRequired: requiredTasks.length,
      completedTotal,
      totalTasks: stageTasks.length
    };
  };

  const launchReadiness = checkLaunchReadiness(completedTaskIds);
  const overallProgress = Math.round(
    (completedTaskIds.length / tasks.length) * 100
  );

  const stage1Progress = getStageProgress(1);
  const stage2Progress = getStageProgress(2);
  const stage3Progress = getStageProgress(3);

  // Check if stages are unlocked
  const stage2Unlocked = stage1Progress.percentage >= 75;
  const stage3Unlocked = stage2Progress.percentage >= 75;
  const canLaunch = launchReadiness.isReady;

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-6">
      {/* Header */}
      <div className="border-b border-eden-white/10 pb-6">
        <h1 className="text-3xl font-mono mb-2">AGENT ONBOARDING</h1>
        <div className="flex items-center justify-between text-sm text-eden-gray">
          <span>SYSTEMATIC SETUP FOR AUTONOMOUS OPERATION</span>
          <span className="font-mono">{overallProgress}% COMPLETE</span>
        </div>
      </div>

      {/* Launch Readiness */}
      {launchReadiness.percentReady > 70 && (
        <div className={`border rounded-lg p-6 ${
          canLaunch 
            ? 'border-green-500/50 bg-green-500/5' 
            : 'border-yellow-500/50 bg-yellow-500/5'
        }`}>
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-mono text-lg">LAUNCH READINESS</h2>
              <span className="font-mono text-2xl">{launchReadiness.percentReady}%</span>
            </div>
            <div className="w-full bg-eden-white/10 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${
                  canLaunch ? 'bg-green-500' : 'bg-yellow-500'
                }`}
                style={{ width: `${launchReadiness.percentReady}%` }}
              />
            </div>
          </div>

          {!canLaunch && (
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5" />
                <div>
                  <p className="text-sm font-mono text-yellow-500">
                    {launchReadiness.missingCritical.length} REQUIRED TASKS REMAINING:
                  </p>
                  <ul className="text-xs text-eden-gray mt-1 space-y-1">
                    {launchReadiness.missingCritical.map(taskId => {
                      const task = tasks.find(t => t.id === taskId);
                      return task ? (
                        <li key={taskId}>- {task.label}</li>
                      ) : null;
                    })}
                  </ul>
                </div>
              </div>

              <div className="flex gap-3 mt-4">
                <button className="flex-1 py-2 px-4 bg-eden-white/10 hover:bg-eden-white/20 rounded font-mono text-sm transition-colors">
                  COMPLETE REQUIRED
                </button>
                <button className="flex-1 py-2 px-4 bg-yellow-500/20 hover:bg-yellow-500/30 rounded font-mono text-sm text-yellow-500 transition-colors">
                  LAUNCH ANYWAY
                </button>
              </div>
            </div>
          )}

          {canLaunch && (
            <div className="space-y-3">
              <p className="text-sm text-green-500 font-mono">✓ ALL REQUIRED TASKS COMPLETE</p>
              
              {tasks.filter(t => !t.required && !t.completed).length > 0 && (
                <div className="text-xs text-eden-gray">
                  <p className="mb-1">ℹ️ {tasks.filter(t => !t.required && !t.completed).length} optional tasks to consider:</p>
                  <ul className="space-y-0.5">
                    {tasks.filter(t => !t.required && !t.completed).slice(0, 5).map(task => (
                      <li key={task.id}>- {task.label}</li>
                    ))}
                  </ul>
                </div>
              )}

              <button className="w-full py-3 bg-green-500 hover:bg-green-600 text-eden-black font-mono transition-colors rounded">
                LAUNCH AGENT
              </button>
            </div>
          )}
        </div>
      )}

      {/* Stages */}
      {[1, 2, 3].map(stageNum => {
        const stage = stageNum as 1 | 2 | 3;
        const progress = getStageProgress(stage);
        const isExpanded = expandedStage === stage;
        const isLocked = (stage === 2 && !stage2Unlocked) || (stage === 3 && !stage3Unlocked);
        const stageTasks = tasks.filter(t => t.stage === stage);

        return (
          <div key={stage} className="border border-eden-white/10 rounded-lg overflow-hidden">
            {/* Stage Header */}
            <button
              onClick={() => !isLocked && setExpandedStage(isExpanded ? 0 : stage)}
              disabled={isLocked}
              className={`w-full p-4 flex items-center justify-between transition-colors ${
                isLocked 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:bg-eden-white/5 cursor-pointer'
              }`}
            >
              <div className="flex items-center gap-3">
                {isLocked && <Lock className="w-4 h-4" />}
                <ChevronRight className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                <div className="text-left">
                  <h2 className="font-mono">
                    STAGE {stage}: {STAGE_NAMES[stage]}
                  </h2>
                  <p className="text-xs text-eden-gray mt-1">
                    {stage === 1 && 'Required for Stage 2'}
                    {stage === 2 && 'Required for Stage 3'}
                    {stage === 3 && 'Required for Launch'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right text-xs">
                  <div className="font-mono">
                    {progress.completedRequired}/{progress.totalRequired} REQUIRED
                  </div>
                  <div className="text-eden-gray">
                    {progress.completedTotal}/{progress.totalTasks} TOTAL
                  </div>
                </div>
                <div className="w-32">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-eden-white/10 rounded-full h-1.5">
                      <div 
                        className="bg-eden-white h-1.5 rounded-full transition-all duration-500"
                        style={{ width: `${progress.percentage}%` }}
                      />
                    </div>
                    <span className="text-xs font-mono">{progress.percentage}%</span>
                  </div>
                </div>
              </div>
            </button>

            {/* Tasks */}
            {isExpanded && !isLocked && (
              <div className="border-t border-eden-white/10 p-4 space-y-2">
                {stageTasks.map(task => {
                  const { canComplete, missingDependencies } = canCompleteTask(task.id, completedTaskIds);
                  const isBlocked = !canComplete && !task.completed;

                  return (
                    <div 
                      key={task.id}
                      className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                        isBlocked 
                          ? 'bg-eden-white/5 opacity-50' 
                          : 'bg-eden-white/5 hover:bg-eden-white/10'
                      }`}
                    >
                      <button
                        onClick={() => toggleTask(task.id)}
                        disabled={isBlocked}
                        className={isBlocked ? 'cursor-not-allowed' : 'cursor-pointer'}
                      >
                        {task.completed ? (
                          <Check className="w-4 h-4 text-eden-white" />
                        ) : (
                          <Square className="w-4 h-4 text-eden-gray" />
                        )}
                      </button>
                      
                      <span className={`flex-1 ${task.completed ? 'line-through text-eden-gray' : ''}`}>
                        {task.label}
                        {!task.required && (
                          <span className="text-xs text-eden-gray ml-2">(optional)</span>
                        )}
                      </span>

                      {isBlocked && (
                        <div className="group relative">
                          <Lock className="w-3 h-3 text-yellow-500" />
                          <div className="absolute right-0 bottom-full mb-2 hidden group-hover:block bg-eden-black border border-eden-white/20 rounded p-2 text-xs whitespace-nowrap z-10">
                            Requires: {missingDependencies.join(', ')}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}