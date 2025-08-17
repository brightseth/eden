'use client';

import React from 'react';
import { Check, X, AlertTriangle, Trophy, TrendingUp, Clock } from 'lucide-react';
import { useAgentMetrics } from '@/hooks/use-operator-data';

interface GraduationGateProps {
  agentId: string;
}

interface GraduationCriteria {
  id: string;
  label: string;
  description: string;
  current: number | string | boolean;
  target: number | string | boolean;
  met: boolean;
  critical: boolean;
}

// Mock graduation data (fallback)
const MOCK_GRADUATION_CRITERIA: GraduationCriteria[] = [
  {
    id: 'streak',
    label: '14-Day Publishing Streak',
    description: 'Published at least one creation for 12 of the last 14 days',
    current: 12,
    target: 12,
    met: true,
    critical: true
  },
  {
    id: 'profitable',
    label: 'Profitable Week',
    description: 'Revenue exceeds costs for the last 7 days',
    current: 26.60,
    target: 0,
    met: true,
    critical: true
  },
  {
    id: 'sales',
    label: 'Minimum Sales Volume',
    description: 'At least 10 total collects in 14 days',
    current: 13,
    target: 10,
    met: true,
    critical: true
  },
  {
    id: 'blockers',
    label: 'No Blockers',
    description: 'No unresolved blockers in the last 14 days',
    current: 0,
    target: 0,
    met: true,
    critical: true
  }
];

const MOCK_METRICS = {
  daysActive: 15,
  totalRevenue: 55.00,
  totalCosts: 28.40,
  totalCollects: 13,
  publishStreak: 12,
  avgDailyProfit: 1.77,
  estimatedMonthlyRevenue: 165.00,
  creatorName: 'kristi.eth',
  agentName: 'Solienne',
  launchDate: new Date('2024-12-20')
};

export function GraduationGate({ agentId }: GraduationGateProps) {
  const { data: metrics, isLoading } = useAgentMetrics(agentId);
  
  // Build criteria based on API data or fallback to mock
  const GRADUATION_CRITERIA: GraduationCriteria[] = metrics?.readiness ? [
    {
      id: 'streak',
      label: '14-Day Publishing Streak',
      description: 'Published at least one creation for 12 of the last 14 days',
      current: metrics.fourteen_day?.published_days || 0,
      target: 12,
      met: metrics.readiness.published_12_of_14,
      critical: true
    },
    {
      id: 'profitable',
      label: 'Profitable Week',
      description: 'Revenue exceeds costs for the last 7 days',
      current: metrics.seven_day?.profit || 0,
      target: 0,
      met: metrics.readiness.profitable_7d,
      critical: true
    },
    {
      id: 'sales',
      label: 'Minimum Sales Volume',
      description: 'At least 10 total collects in 14 days',
      current: metrics.seven_day?.collects || 0,
      target: 10,
      met: metrics.readiness?.min_collects || false,
      critical: true
    },
    {
      id: 'blockers',
      label: 'No Blockers',
      description: 'No unresolved blockers in the last 14 days',
      current: metrics.fourteen_day?.blockers?.length || 0,
      target: 0,
      met: metrics.readiness.no_blockers_14d,
      critical: true
    }
  ] : MOCK_GRADUATION_CRITERIA;
  
  const requiredCriteria = GRADUATION_CRITERIA.filter(c => c.critical);
  const optionalCriteria = GRADUATION_CRITERIA.filter(c => !c.critical);
  const requiredMet = requiredCriteria.filter(c => c.met).length;
  const optionalMet = optionalCriteria.filter(c => c.met).length;
  const overallProgress = (GRADUATION_CRITERIA.filter(c => c.met).length / GRADUATION_CRITERIA.length) * 100;
  const canGraduate = metrics?.readiness?.can_graduate || requiredCriteria.every(c => c.met);
  
  const daysUntilLaunch = Math.ceil((MOCK_METRICS.launchDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  const isOnTrack = metrics?.readiness?.published_12_of_14 && metrics?.readiness?.profitable_7d;

  return (
    <div className="space-y-6">
      {/* Status Header */}
      <div className={`border rounded-lg p-6 ${
        canGraduate ? 'bg-green-500/10 border-green-500' :
        isOnTrack ? 'bg-yellow-500/10 border-yellow-500' :
        'bg-red-500/10 border-red-500'
      }`}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="font-mono text-xl mb-2">
              {canGraduate ? 'READY TO GRADUATE' :
               isOnTrack ? 'ON TRACK' :
               'NEEDS INTERVENTION'}
            </h2>
            <p className="text-sm text-eden-gray">
              {MOCK_METRICS.agentName} • Day {MOCK_METRICS.daysActive} • Created by {MOCK_METRICS.creatorName}
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-mono">{overallProgress.toFixed(0)}%</div>
            <div className="text-xs text-eden-gray">COMPLETE</div>
          </div>
        </div>

        <div className="w-full bg-eden-white/10 rounded-full h-3">
          <div 
            className={`h-3 rounded-full transition-all duration-500 ${
              canGraduate ? 'bg-green-500' :
              isOnTrack ? 'bg-yellow-500' :
              'bg-red-500'
            }`}
            style={{ width: `${overallProgress}%` }}
          />
        </div>

        {!canGraduate && (
          <div className="mt-4 flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-eden-gray" />
            <span className="text-eden-gray">
              {daysUntilLaunch > 0 
                ? `${daysUntilLaunch} days until scheduled launch`
                : 'Launch date passed - intervention needed'}
            </span>
          </div>
        )}
      </div>

      {/* Required Criteria */}
      <div className="border border-eden-white/20 rounded-lg overflow-hidden">
        <div className="bg-eden-white/5 px-6 py-3 border-b border-eden-white/10">
          <div className="flex items-center justify-between">
            <h3 className="font-mono text-sm">REQUIRED CRITERIA</h3>
            <span className="text-sm text-eden-gray">
              {requiredMet}/{requiredCriteria.length} complete
            </span>
          </div>
        </div>
        
        <div className="divide-y divide-eden-white/5">
          {requiredCriteria.map(criterion => (
            <div key={criterion.id} className="px-6 py-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-start gap-3">
                  {criterion.met ? (
                    <Check className="w-5 h-5 text-green-500 mt-0.5" />
                  ) : (
                    <X className="w-5 h-5 text-red-500 mt-0.5" />
                  )}
                  <div>
                    <div className={criterion.met ? 'text-eden-gray line-through' : ''}>
                      {criterion.label}
                    </div>
                    <div className="text-xs text-eden-gray mt-1">
                      {criterion.description}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-sm">
                    {typeof criterion.current === 'boolean' 
                      ? (criterion.current ? 'YES' : 'NO')
                      : `${criterion.current}/${criterion.target}`}
                  </div>
                  {typeof criterion.current === 'number' && typeof criterion.target === 'number' && (
                    <div className="w-24 bg-eden-white/10 rounded-full h-1 mt-2">
                      <div 
                        className={`h-1 rounded-full ${criterion.met ? 'bg-green-500' : 'bg-yellow-500'}`}
                        style={{ width: `${Math.min(100, (criterion.current / criterion.target) * 100)}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Optional Criteria */}
      <div className="border border-eden-white/20 rounded-lg overflow-hidden">
        <div className="bg-eden-white/5 px-6 py-3 border-b border-eden-white/10">
          <div className="flex items-center justify-between">
            <h3 className="font-mono text-sm">BONUS CRITERIA</h3>
            <span className="text-sm text-eden-gray">
              {optionalMet}/{optionalCriteria.length} complete
            </span>
          </div>
        </div>
        
        <div className="divide-y divide-eden-white/5">
          {optionalCriteria.map(criterion => (
            <div key={criterion.id} className="px-6 py-4 opacity-75">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  {criterion.met ? (
                    <Check className="w-4 h-4 text-green-500 mt-0.5" />
                  ) : (
                    <div className="w-4 h-4 border border-eden-gray mt-0.5" />
                  )}
                  <div>
                    <div className={`text-sm ${criterion.met ? 'text-eden-gray line-through' : ''}`}>
                      {criterion.label}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-xs text-eden-gray">
                    {typeof criterion.current === 'boolean' 
                      ? (criterion.current ? 'YES' : 'NO')
                      : `${criterion.current}/${criterion.target}`}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Financial Summary */}
      <div className="border border-eden-white/20 rounded-lg p-6">
        <h3 className="font-mono text-sm mb-4">FINANCIAL SUMMARY</h3>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex justify-between">
            <span className="text-eden-gray">Total Revenue:</span>
            <span className="font-mono text-green-500">${MOCK_METRICS.totalRevenue.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-eden-gray">Total Costs:</span>
            <span className="font-mono text-red-500">-${MOCK_METRICS.totalCosts.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-eden-gray">Net Profit:</span>
            <span className="font-mono text-green-500">
              ${(MOCK_METRICS.totalRevenue - MOCK_METRICS.totalCosts).toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-eden-gray">Daily Average:</span>
            <span className="font-mono">${MOCK_METRICS.avgDailyProfit.toFixed(2)}/day</span>
          </div>
          <div className="flex justify-between">
            <span className="text-eden-gray">Total Collects:</span>
            <span className="font-mono">{MOCK_METRICS.totalCollects}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-eden-gray">Monthly Projection:</span>
            <span className="font-mono text-green-500">${MOCK_METRICS.estimatedMonthlyRevenue.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      {canGraduate ? (
        <div className="space-y-4">
          <button className="w-full py-4 bg-green-500 hover:bg-green-600 text-eden-black font-mono transition-colors flex items-center justify-center gap-2">
            <Trophy className="w-5 h-5" />
            GRADUATE TO AUTONOMOUS OPERATION
          </button>
          <p className="text-center text-sm text-eden-gray">
            Agent will operate independently with weekly check-ins
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <button 
            disabled 
            className="w-full py-4 bg-eden-white/10 text-eden-gray font-mono cursor-not-allowed"
          >
            COMPLETE REQUIRED CRITERIA TO GRADUATE
          </button>
          
          {!isOnTrack && (
            <div className="flex gap-4">
              <button className="flex-1 py-2 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-500 font-mono text-sm transition-colors">
                REQUEST INTERVENTION
              </button>
              <button className="flex-1 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-500 font-mono text-sm transition-colors">
                EXTEND TIMELINE
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}