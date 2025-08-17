'use client';

import { cn } from '@/lib/utils';
import { CheckCircle2, Circle, Lock, Sparkles } from 'lucide-react';

interface PhaseTimelineProps {
  currentStage: number;
  currentDay: number;
  totalDays: number;
}

const phases = [
  {
    id: 0,
    name: 'AUDITION',
    days: 20,
    description: 'Profile setup, initial tests',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 1,
    name: 'TECHNIQUE',
    days: 20,
    description: 'Master core creative skills',
    color: 'from-purple-500 to-pink-500',
  },
  {
    id: 2,
    name: 'ENSEMBLE',
    days: 20,
    description: 'Build community connections',
    color: 'from-pink-500 to-red-500',
  },
  {
    id: 3,
    name: 'PERFORMANCE',
    days: 20,
    description: 'Generate revenue & impact',
    color: 'from-orange-500 to-yellow-500',
  },
  {
    id: 4,
    name: 'GRADUATION',
    days: 20,
    description: 'Launch & achieve autonomy',
    color: 'from-green-500 to-emerald-500',
  },
];

export function PhaseTimeline({ currentStage, currentDay, totalDays }: PhaseTimelineProps) {
  const daysPerPhase = totalDays / phases.length;
  const currentPhaseProgress = ((currentDay % daysPerPhase) / daysPerPhase) * 100;

  return (
    <div className="terminal-box p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="display-caps text-xl">TRAINING PHASES</h2>
        <div className="text-xs font-mono text-eden-gray">
          PHASE {currentStage + 1} OF {phases.length}
        </div>
      </div>

      <div className="relative">
        {/* Connection Line */}
        <div className="absolute left-0 right-0 top-6 h-0.5 bg-eden-white/10" />
        
        {/* Active Line */}
        <div 
          className="absolute left-0 top-6 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
          style={{ 
            width: `${(currentStage / (phases.length - 1)) * 100}%`,
          }}
        />

        {/* Phase Nodes */}
        <div className="relative flex justify-between">
          {phases.map((phase, index) => {
            const isCompleted = index < currentStage;
            const isCurrent = index === currentStage;
            const isLocked = index > currentStage;
            
            return (
              <div 
                key={phase.id}
                className="relative flex flex-col items-center"
              >
                {/* Node */}
                <div className="relative z-10">
                  {isCompleted ? (
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                        <CheckCircle2 className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  ) : isCurrent ? (
                    <div className="relative">
                      <div className={cn(
                        "w-12 h-12 rounded-full flex items-center justify-center",
                        `bg-gradient-to-br ${phase.color}`
                      )}>
                        <Sparkles className="w-6 h-6 text-white animate-pulse" />
                      </div>
                      {/* Progress Ring */}
                      <svg className="absolute inset-0 w-12 h-12 -rotate-90">
                        <circle
                          cx="24"
                          cy="24"
                          r="22"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          className="text-eden-white/20"
                        />
                        <circle
                          cx="24"
                          cy="24"
                          r="22"
                          fill="none"
                          stroke="url(#gradient)"
                          strokeWidth="2"
                          strokeDasharray={`${currentPhaseProgress * 1.38} 138`}
                          className="transition-all duration-500"
                        />
                        <defs>
                          <linearGradient id="gradient">
                            <stop offset="0%" stopColor="#a855f7" />
                            <stop offset="100%" stopColor="#ec4899" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-eden-white/10 border border-eden-white/20 flex items-center justify-center">
                      <Lock className="w-5 h-5 text-eden-white/30" />
                    </div>
                  )}
                </div>

                {/* Label */}
                <div className="mt-3 text-center">
                  <div className={cn(
                    "text-xs font-mono uppercase tracking-wider",
                    isCurrent ? "text-eden-white" :
                    isCompleted ? "text-green-400" :
                    "text-eden-gray"
                  )}>
                    {phase.name}
                  </div>
                  <div className="text-[10px] text-eden-gray mt-0.5 max-w-[100px]">
                    {phase.description}
                  </div>
                  {isCurrent && (
                    <div className="text-[10px] font-mono text-purple-400 mt-1">
                      {Math.round(currentPhaseProgress)}%
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Current Phase Details */}
      {currentStage < phases.length && (
        <div className="mt-8 p-4 rounded-lg bg-gradient-to-br from-eden-white/5 to-eden-white/10 border border-eden-white/20">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-mono text-eden-gray mb-1">CURRENT PHASE</div>
              <div className="display-caps text-lg">{phases[currentStage].name}</div>
            </div>
            <div className="text-right">
              <div className="text-xs font-mono text-eden-gray mb-1">PROGRESS</div>
              <div className="text-lg font-mono">
                {Math.round(currentPhaseProgress)}%
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs font-mono text-eden-gray mb-1">DAYS IN PHASE</div>
              <div className="text-lg font-mono">
                {Math.round(currentDay % daysPerPhase)} / {daysPerPhase}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}