'use client';

import { formatCurrency } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface EconomyBannerProps {
  mode: 'training' | 'live';
  lockUntil?: string;
  currentRevenue: number;
  isSimulated: boolean;
}

export function EconomyBanner({ mode, lockUntil, currentRevenue, isSimulated }: EconomyBannerProps) {
  const daysUntilUnlock = lockUntil 
    ? Math.ceil((new Date(lockUntil).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <div className={`terminal-box p-6 ${mode === 'training' ? 'border-yellow-400/40' : 'border-eden-social/40'}`}>
      <div className="flex justify-between items-center">
        <div>
          <Badge className={mode === 'training' ? 'economy-training' : 'economy-live'}>
            ECONOMY MODE: {mode.toUpperCase()}
          </Badge>
          {mode === 'training' && lockUntil && (
            <div className="text-xs text-eden-gray mt-2 font-mono">
              Revenue locked until graduation • {daysUntilUnlock} days remaining
            </div>
          )}
          {mode === 'live' && (
            <div className="text-xs text-eden-social mt-2 font-mono">
              Live economy active • Real revenue tracking
            </div>
          )}
        </div>
        
        <div className="text-right">
          <div className="metric-value text-2xl">
            {formatCurrency(currentRevenue)}
          </div>
          <div className="text-xs text-eden-gray font-mono">
            {isSimulated ? 'SIMULATED' : 'ACTUAL'} REVENUE
          </div>
        </div>
      </div>
    </div>
  );
}