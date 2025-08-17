'use client';

import { cn } from '@/lib/utils';

interface StageProgressProps {
  currentStage: number;
  className?: string;
}

const stages = [
  { name: 'Audition', shortName: 'AUD' },
  { name: 'Technique', shortName: 'TEC' },
  { name: 'Ensemble', shortName: 'ENS' },
  { name: 'Performance', shortName: 'PER' },
  { name: 'Graduation', shortName: 'GRD' },
];

export function StageProgress({ currentStage, className }: StageProgressProps) {
  return (
    <div className={cn('w-full', className)}>
      <div className="flex items-center justify-between">
        {stages.map((stage, index) => (
          <div key={stage.name} className="flex-1 flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'phase-node',
                  index < currentStage && 'complete',
                  index === currentStage && 'current',
                  index > currentStage && 'locked'
                )}
              >
                {index}
              </div>
              <span className="text-xs mt-2 text-eden-gray hidden md:block">
                {stage.name}
              </span>
              <span className="text-xs mt-2 text-eden-gray md:hidden">
                {stage.shortName}
              </span>
            </div>
            {index < stages.length - 1 && (
              <div
                className={cn(
                  'flex-1 phase-connector mx-2',
                  index < currentStage && 'complete'
                )}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}