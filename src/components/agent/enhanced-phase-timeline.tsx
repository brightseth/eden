'use client';

import { cn } from '@/lib/utils';
import { safeToFixed } from '@/lib/utils/number';
import { 
  CURRICULUM_PHASES, 
  CURRICULUM_STAGES, 
  getStageProgress,
  getCumulativeDuration,
  mapLegacyStageToNew,
  type StageId,
  type PhaseId 
} from '@/lib/curriculum';

interface EnhancedPhaseTimelineProps {
  currentStage: StageId | number;
  currentDay: number;
  className?: string;
}

export function EnhancedPhaseTimeline({ 
  currentStage, 
  currentDay, 
  className 
}: EnhancedPhaseTimelineProps) {
  // Convert legacy stage numbers to new stage IDs
  const mappedStage = typeof currentStage === 'number' 
    ? mapLegacyStageToNew(currentStage) 
    : currentStage;
  
  const { overallProgress } = getStageProgress(mappedStage, currentDay);
  const phases = Object.entries(CURRICULUM_PHASES);
  
  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="display-caps text-xl">AGENT ACADEMY</h2>
          <p className="text-sm text-eden-gray mt-1">Setup → Training → Launch</p>
        </div>
        <div className="text-right">
          <div className="text-xs font-mono text-eden-gray">ONBOARDING</div>
          <div className="text-lg font-mono">{safeToFixed(overallProgress, 1)}%</div>
        </div>
      </div>

      {/* Phase Timeline */}
      <div className="space-y-8">
        {phases.map(([phaseId, phase], phaseIndex) => (
          <PhaseSection
            key={phaseId}
            phaseId={phaseId as PhaseId}
            phase={phase}
            currentStage={mappedStage}
            currentDay={currentDay}
            isActive={phase.stages.includes(mappedStage)}
          />
        ))}
      </div>

      {/* Setup Progress */}
      <div className="terminal-box bg-eden-black/50 p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono text-eden-gray">ACADEMY PROGRESS</span>
          <span className="text-xs font-mono">{safeToFixed(overallProgress, 1)}% COMPLETE</span>
        </div>
        <div className="w-full bg-eden-white/10 rounded-full h-2">
          <div 
            className="bg-eden-white h-2 rounded-full transition-all duration-300"
            style={{ width: `${overallProgress}%` }}
          />
        </div>
        <div className="text-xs text-eden-gray mt-2 text-center">
          From zero to functional agent
        </div>
      </div>
    </div>
  );
}

interface PhaseSectionProps {
  phaseId: PhaseId;
  phase: typeof CURRICULUM_PHASES[PhaseId];
  currentStage: StageId;
  currentDay: number;
  isActive: boolean;
}

function PhaseSection({ phaseId, phase, currentStage, currentDay, isActive }: PhaseSectionProps) {
  const phaseStages = phase.stages.map(stageId => CURRICULUM_STAGES[stageId]);
  
  return (
    <div className={cn(
      "terminal-box p-6 transition-all duration-300",
      isActive ? "bg-eden-white/10 border-eden-white/30" : "bg-eden-black/30"
    )}>
      {/* Phase Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="display-caps text-lg">{phase.name}</h3>
          <p className="text-sm text-eden-gray mt-1">{phase.description}</p>
        </div>
        <div className="text-right">
          <div className="text-xs font-mono text-eden-gray">
            {phaseStages.length} STAGES
          </div>
          <div className="text-xs font-mono">
            {phaseStages.reduce((sum, stage) => sum + stage.duration, 0)} DAYS
          </div>
        </div>
      </div>

      {/* Stages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {phaseStages.map((stage, stageIndex) => (
          <StageCard
            key={stage.id}
            stage={stage}
            isActive={stage.id === currentStage}
            isCompleted={getCumulativeDuration(stage.id) < getCumulativeDuration(currentStage)}
            stageNumber={phase.stages.indexOf(stage.id) + 1}
          />
        ))}
      </div>
    </div>
  );
}

interface StageCardProps {
  stage: typeof CURRICULUM_STAGES[StageId];
  isActive: boolean;
  isCompleted: boolean;
  stageNumber: number;
}

function StageCard({ stage, isActive, isCompleted, stageNumber }: StageCardProps) {
  return (
    <div className={cn(
      "terminal-box p-4 transition-all duration-200",
      isActive && "bg-eden-white/20 border-eden-white/50",
      isCompleted && "bg-eden-white/5",
      !isActive && !isCompleted && "bg-eden-black/20 opacity-60"
    )}>
      {/* Stage Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={cn(
            "w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-mono",
            isActive && "border-eden-white bg-eden-white text-eden-black",
            isCompleted && "border-eden-white/50 bg-eden-white/50 text-eden-white",
            !isActive && !isCompleted && "border-eden-white/20 text-eden-white/40"
          )}>
            {stageNumber}
          </div>
          <div className="text-sm font-mono">{stage.name}</div>
        </div>
        <div className="text-xs font-mono text-eden-gray">
          {stage.duration}D
        </div>
      </div>

      {/* Stage Description */}
      <p className="text-xs text-eden-gray mb-3 leading-relaxed">
        {stage.description}
      </p>

      {/* Focus */}
      <div className="space-y-2">
        <div className="text-xs font-mono text-eden-gray">
          FOCUS: {stage.metrics.primary}
        </div>
        
        {/* Target */}
        {stage.revenueTarget > 0 && (
          <div className="text-xs font-mono">
            TARGET: ${stage.revenueTarget.toLocaleString()}
          </div>
        )}

        {/* Daily Cost */}
        {stage.burnRate > 0 && (
          <div className="text-xs font-mono text-eden-gray">
            DAILY COST: ${stage.burnRate}
          </div>
        )}
      </div>

      {/* Tools */}
      <div className="mt-3 pt-3 border-t border-eden-white/10">
        <div className="text-xs font-mono text-eden-gray">
          {stage.tools.length} TOOLS • {stage.deliverables.length} OUTPUTS
        </div>
      </div>
    </div>
  );
}