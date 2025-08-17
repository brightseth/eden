'use client';

import { useState } from 'react';
import { AlertTriangle, TrendingDown, DollarSign, Target, X, ChevronRight } from 'lucide-react';
import { 
  CreatorMetrics, 
  GraduationRequirement,
  calculateRiskLevel,
  getDaysUntilQuit,
  getImmediateActions
} from '@/types/creator-metrics';

// Mock data for Kristi's agent
const MOCK_METRICS: CreatorMetrics = {
  agentName: null,
  walletAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bE8f3c',
  trainerAddress: 'kristi.eth',
  trainingStartDate: new Date('2024-12-04'),
  daysActive: 12,
  targetDays: 90,
  
  totalSpent: 67.40,
  totalEarned: 0,
  netPosition: -67.40,
  dailyBurnRate: 5.61,
  daysUntilBankrupt: null,
  breakEvenDate: null,
  
  generationsAttempted: 47,
  successfulOutputs: 31,
  postedPublicly: 8,
  salesCount: 0,
  engagementRate: 0.003,
  successRate: 0.66,
  
  hasName: false,
  hasDescription: false,
  hasWallet: true,
  hasPosted10x: false,
  hasMadeFirstSale: false,
  hasDefinedStyle: false,
  hasDailyPractice: false,
  hasCommunityEngagement: false,
  hasConnectedSocials: false,
  hasPricingStrategy: false,
  
  percentileRank: 23,
  peerAvgRevenue: 12,
  peerAvgCreations: 20,
  peerAvgSales: 1,
  daysUntilUsualQuit: 6,
  
  riskLevel: 'critical',
  showEmergencyHelp: true,
  suggestedActions: [],
  nextMilestone: 'Make first sale',
  estimatedGraduation: null
};

const GRADUATION_REQUIREMENTS: GraduationRequirement[] = [
  { id: 'name', label: 'Name your agent', status: 'blocked', current: false, target: true, critical: true },
  { id: 'sale', label: 'First sale', status: 'incomplete', current: 0, target: 1, critical: true },
  { id: 'consistency', label: '30-day consistency', status: 'incomplete', current: '8', target: '30 posts', critical: true },
  { id: 'style', label: 'Define creative DNA', status: 'blocked', current: 'NOT STARTED', target: 'COMPLETE', critical: true },
  { id: 'profit', label: 'Profitable week', status: 'incomplete', current: -67, target: 1, critical: true }
];

export function BrutalRealityDashboard() {
  const [metrics] = useState<CreatorMetrics>(MOCK_METRICS);
  const [showHelp, setShowHelp] = useState(false);
  const [showIntervention, setShowIntervention] = useState(false);
  
  const riskLevel = calculateRiskLevel(metrics);
  const daysUntilQuit = getDaysUntilQuit(metrics);
  const immediateActions = getImmediateActions(metrics);
  const progressPercent = (metrics.daysActive / metrics.targetDays) * 100;

  return (
    <div className="max-w-5xl mx-auto space-y-6 p-6">
      {/* Header Bar */}
      <div className="border-b border-eden-white/20 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-mono">
              {metrics.agentName || 'UNTITLED-AGENT-7'}
            </h1>
            {!metrics.agentName && (
              <span className="text-red-500 text-sm">❌ NO NAME</span>
            )}
          </div>
          <div className="text-right">
            <div className="text-sm text-eden-gray">DAY {metrics.daysActive} OF {metrics.targetDays}</div>
            <div className="w-32 bg-eden-white/10 rounded-full h-1 mt-1">
              <div 
                className="bg-eden-white h-1 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Risk Warning */}
      {riskLevel === 'critical' && (
        <div className="border border-red-500/50 bg-red-500/10 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
            <div className="flex-1">
              <h2 className="font-mono text-red-500 mb-2">⚠️ EXTERNAL CREATOR MODE - LIMITED EDEN SUPPORT</h2>
              <p className="text-sm text-eden-gray">
                You're in the bottom {metrics.percentileRank}% of creators. 
                {daysUntilQuit > 0 && ` Most quit in ${daysUntilQuit} days.`}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Financial Reality */}
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="font-mono text-sm text-eden-gray">BRUTAL REALITY CHECK</h3>
          <div className="space-y-2 font-mono text-sm">
            <div className="flex justify-between">
              <span>Total spent so far</span>
              <span className="text-red-500">-${metrics.totalSpent.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Total earned</span>
              <span className={metrics.totalEarned > 0 ? 'text-green-500' : 'text-eden-gray'}>
                ${metrics.totalEarned.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between border-t border-eden-white/10 pt-2">
              <span>Current trajectory</span>
              <span className="text-yellow-500">HOBBY PROJECT</span>
            </div>
            <div className="flex justify-between">
              <span>Estimated break-even</span>
              <span className="text-red-500">NEVER (at current rate)</span>
            </div>
            <div className="flex justify-between text-xs text-eden-gray">
              <span>Other creators at Day {metrics.daysActive} avg</span>
              <span>${metrics.peerAvgRevenue} revenue</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-mono text-sm text-eden-gray">CREATION PIPELINE</h3>
          <div className="space-y-2 font-mono text-sm">
            <div className="flex justify-between">
              <span>Generations attempted</span>
              <span>{metrics.generationsAttempted}</span>
            </div>
            <div className="flex justify-between">
              <span>Successful outputs</span>
              <span>{metrics.successfulOutputs} ({Math.round(metrics.successRate * 100)}% success)</span>
            </div>
            <div className="flex justify-between">
              <span>Posted publicly</span>
              <span className="text-yellow-500">{metrics.postedPublicly}</span>
            </div>
            <div className="flex justify-between">
              <span>Engagement rate</span>
              <span className="text-red-500">{(metrics.engagementRate * 100).toFixed(1)}% (basically zero)</span>
            </div>
            <div className="flex justify-between border-t border-eden-white/10 pt-2">
              <span>Sales</span>
              <span className="text-red-500">{metrics.salesCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Missing Basics */}
      <div className="border border-eden-white/10 rounded-lg p-4">
        <h3 className="font-mono text-sm mb-4">MISSING BASICS (Can't Graduate Without These)</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          {[
            { label: 'Agent has no name', complete: metrics.hasName },
            { label: 'No profile description', complete: metrics.hasDescription },
            { label: 'No creative DNA defined', complete: metrics.hasDefinedStyle },
            { label: 'No consistent style emerging', complete: false },
            { label: 'No social accounts connected', complete: metrics.hasConnectedSocials },
            { label: 'No pricing strategy', complete: metrics.hasPricingStrategy },
            { label: 'No daily practice schedule', complete: metrics.hasDailyPractice },
            { label: 'No community engagement', complete: metrics.hasCommunityEngagement }
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className={item.complete ? 'text-green-500' : 'text-red-500'}>
                {item.complete ? '✓' : '□'}
              </span>
              <span className={item.complete ? 'line-through text-eden-gray' : ''}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Peer Comparison */}
      <div className="border border-eden-white/10 rounded-lg p-4">
        <h3 className="font-mono text-sm mb-4">PEER COMPARISON (Day {metrics.daysActive} Benchmark)</h3>
        <div className="space-y-2 text-sm font-mono">
          <div className="flex justify-between">
            <span>Top 10% creators have</span>
            <span className="text-green-500">50+ creations, 5+ sales</span>
          </div>
          <div className="flex justify-between">
            <span>Average creators have</span>
            <span>{metrics.peerAvgCreations} creations, {metrics.peerAvgSales} sale</span>
          </div>
          <div className="flex justify-between">
            <span>You have</span>
            <span className="text-red-500">{metrics.postedPublicly} creations, {metrics.salesCount} sales</span>
          </div>
          <div className="flex justify-between border-t border-eden-white/10 pt-2 text-eden-gray">
            <span>Bottom 10% have</span>
            <span>Already quit</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button className="flex-1 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-500 font-mono transition-colors">
          ABANDON PROJECT
        </button>
        <button 
          onClick={() => setShowHelp(true)}
          className="flex-1 py-3 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-500 font-mono transition-colors"
        >
          GET HELP
        </button>
        <button className="flex-1 py-3 bg-eden-white/10 hover:bg-eden-white/20 font-mono transition-colors">
          KEEP GRINDING
        </button>
      </div>

      {/* Help Modal */}
      {showHelp && (
        <div className="fixed inset-0 bg-eden-black/90 flex items-center justify-center z-50 p-6">
          <div className="bg-eden-black border border-eden-white/20 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-xl font-mono">YOU'RE BEHIND SCHEDULE</h2>
              <button onClick={() => setShowHelp(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm text-eden-gray mb-6">
              Here's what successful creators did by Day {metrics.daysActive}:
            </p>

            <div className="space-y-6">
              <div>
                <h3 className="font-mono text-sm mb-3">IMMEDIATE ACTIONS (Do Today)</h3>
                <div className="space-y-4">
                  {immediateActions.map((action, i) => (
                    <div key={action.id} className="border-l-2 border-yellow-500 pl-4">
                      <div className="font-mono text-sm mb-1">{i + 1}. {action.action}</div>
                      <div className="text-xs text-eden-gray mb-1">{action.reasoning}</div>
                      {action.example && (
                        <div className="text-xs text-yellow-500">{action.example}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="border border-eden-white/10 rounded-lg p-4">
                <h3 className="font-mono text-sm mb-3">BOOK OFFICE HOURS</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Next slot</span>
                    <span>Thursday 2pm (with Eden team)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Topic</span>
                    <span>"Why is my agent failing?"</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Prep work</span>
                    <span>Generate 20 creations before call</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Cost</span>
                    <span className="text-green-500">Free (first-time creator)</span>
                  </div>
                </div>
              </div>

              <div className="border border-eden-white/10 rounded-lg p-4">
                <h3 className="font-mono text-sm mb-3">SUCCESSFUL CREATOR EXAMPLE (Similar Start)</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <ChevronRight className="w-3 h-3" />
                    <span>Day 1-7: Lost $130, zero sales, almost quit</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ChevronRight className="w-3 h-3" />
                    <span>Day 8: Pivoted to daily tarot cards</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ChevronRight className="w-3 h-3" />
                    <span>Day 14: First sale ($5)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ChevronRight className="w-3 h-3" />
                    <span>Day 30: Profitable ($20/day)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ChevronRight className="w-3 h-3" />
                    <span>Day 90: $1,800/month recurring</span>
                  </div>
                  <div className="mt-3 text-yellow-500 font-mono">
                    Secret: CONSISTENCY + NICHE
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button className="flex-1 py-2 bg-yellow-500 hover:bg-yellow-600 text-eden-black font-mono transition-colors">
                  BOOK OFFICE HOURS
                </button>
                <button className="flex-1 py-2 bg-eden-white/10 hover:bg-eden-white/20 font-mono transition-colors">
                  READ CASE STUDY
                </button>
                <button className="flex-1 py-2 bg-eden-white/10 hover:bg-eden-white/20 font-mono transition-colors">
                  WATCH TUTORIAL
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}