'use client';

import { DollarSign, TrendingDown, Target, AlertTriangle } from 'lucide-react';
import { safeToFixed } from '@/lib/utils/number';

interface JournalEntry {
  day: number;
  date: string;
  spent: number;
  earned: number;
  creations: number;
  sales: number;
  note?: string;
}

const MOCK_JOURNAL: JournalEntry[] = [
  { day: 1, date: 'Dec 4', spent: 8.50, earned: 0, creations: 3, sales: 0, note: 'Started training' },
  { day: 2, date: 'Dec 5', spent: 6.20, earned: 0, creations: 2, sales: 0 },
  { day: 3, date: 'Dec 6', spent: 5.10, earned: 0, creations: 0, sales: 0, note: 'Stuck on setup' },
  { day: 4, date: 'Dec 7', spent: 7.80, earned: 0, creations: 4, sales: 0 },
  { day: 5, date: 'Dec 8', spent: 4.90, earned: 0, creations: 1, sales: 0 },
  { day: 6, date: 'Dec 9', spent: 0, earned: 0, creations: 0, sales: 0, note: 'Took a break' },
  { day: 7, date: 'Dec 10', spent: 5.30, earned: 0, creations: 2, sales: 0 },
  { day: 8, date: 'Dec 11', spent: 6.10, earned: 0, creations: 3, sales: 0 },
  { day: 9, date: 'Dec 12', spent: 4.70, earned: 0, creations: 1, sales: 0 },
  { day: 10, date: 'Dec 13', spent: 5.90, earned: 0, creations: 2, sales: 0 },
  { day: 11, date: 'Dec 14', spent: 6.40, earned: 0, creations: 0, sales: 0, note: 'API issues' },
  { day: 12, date: 'Dec 15', spent: 6.50, earned: 0, creations: 1, sales: 0, note: 'Today' }
];

export function TrainingJournal() {
  const totalSpent = MOCK_JOURNAL.reduce((sum, entry) => sum + entry.spent, 0);
  const totalEarned = MOCK_JOURNAL.reduce((sum, entry) => sum + entry.earned, 0);
  const totalCreations = MOCK_JOURNAL.reduce((sum, entry) => sum + entry.creations, 0);
  const avgSpendPerDay = totalSpent / MOCK_JOURNAL.length;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="border-b border-eden-white/20 pb-6 mb-6">
        <h1 className="text-2xl font-mono mb-2">KRISTI'S TRAINING JOURNAL</h1>
        <div className="flex items-center justify-between text-sm text-eden-gray">
          <span>DAY 12/90</span>
          <span className="text-red-500">78 DAYS REMAINING</span>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-eden-gray">REVENUE</span>
            <span className="font-mono">$0.00</span>
          </div>
          <div className="w-full bg-eden-white/10 rounded-full h-2">
            <div className="bg-eden-white h-2 rounded-full" style={{ width: '0%' }} />
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-eden-gray">COSTS</span>
            <span className="font-mono text-red-500">-${safeToFixed(totalSpent)}</span>
          </div>
          <div className="w-full bg-eden-white/10 rounded-full h-2">
            <div className="bg-red-500 h-2 rounded-full" style={{ width: '100%' }} />
          </div>
        </div>
      </div>

      <div className="border border-yellow-500/50 bg-yellow-500/10 rounded-lg p-4 mb-8">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-yellow-500" />
          <span className="text-sm">You're spending ${safeToFixed(avgSpendPerDay)}/day with zero return</span>
        </div>
      </div>

      {/* Graduation Requirements */}
      <div className="border border-eden-white/10 rounded-lg p-6 mb-8">
        <h2 className="font-mono mb-4">GRADUATION REQUIREMENTS</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-3">
              <span className="text-red-500">□</span>
              <span>Name your agent</span>
            </span>
            <span className="text-red-500 text-sm font-mono">BLOCKED</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-3">
              <span className="text-red-500">□</span>
              <span>First sale</span>
            </span>
            <span className="text-eden-gray text-sm font-mono">0 / 1</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-3">
              <span className="text-red-500">□</span>
              <span>30-day consistency</span>
            </span>
            <span className="text-eden-gray text-sm font-mono">{totalCreations} / 30 posts</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-3">
              <span className="text-red-500">□</span>
              <span>Define creative DNA</span>
            </span>
            <span className="text-red-500 text-sm font-mono">NOT STARTED</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-3">
              <span className="text-red-500">□</span>
              <span>Profitable week</span>
            </span>
            <span className="text-red-500 text-sm font-mono">-${safeToFixed(totalSpent)} this week</span>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-eden-white/10">
          <div className="flex items-center justify-between">
            <span className="text-sm text-eden-gray">Estimated graduation:</span>
            <span className="text-red-500 font-mono">NEVER (at current pace)</span>
          </div>
        </div>
      </div>

      {/* Daily Log */}
      <div className="border border-eden-white/10 rounded-lg overflow-hidden">
        <div className="bg-eden-white/5 px-6 py-3 border-b border-eden-white/10">
          <h2 className="font-mono text-sm">DAILY LOG</h2>
        </div>
        <div className="divide-y divide-eden-white/5">
          {MOCK_JOURNAL.reverse().map(entry => (
            <div key={entry.day} className="px-6 py-3 flex items-center justify-between hover:bg-eden-white/5 transition-colors">
              <div className="flex items-center gap-6">
                <span className="font-mono text-sm w-12">D{entry.day}</span>
                <span className="text-sm text-eden-gray w-16">{entry.date}</span>
                <div className="flex items-center gap-4 text-sm">
                  <span className={entry.spent > 0 ? 'text-red-500' : 'text-eden-gray'}>
                    -${safeToFixed(entry.spent)}
                  </span>
                  <span className="text-eden-gray">•</span>
                  <span className={entry.creations > 0 ? '' : 'text-eden-gray'}>
                    {entry.creations} creations
                  </span>
                  {entry.note && (
                    <>
                      <span className="text-eden-gray">•</span>
                      <span className="text-eden-gray italic">{entry.note}</span>
                    </>
                  )}
                </div>
              </div>
              <div className="text-sm">
                {entry.sales > 0 ? (
                  <span className="text-green-500">{entry.sales} sales</span>
                ) : (
                  <span className="text-eden-gray">no sales</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Warning */}
      <div className="mt-8 text-center py-8 border-t border-eden-white/10">
        <p className="text-eden-gray mb-4">
          78% of creators quit before Day 20
        </p>
        <p className="text-yellow-500 font-mono">
          You're currently on the same trajectory
        </p>
        <div className="flex gap-4 justify-center mt-6">
          <button className="px-6 py-2 bg-eden-white/10 hover:bg-eden-white/20 font-mono text-sm transition-colors">
            SEE WHAT SUCCESSFUL CREATORS DID
          </button>
          <button className="px-6 py-2 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-500 font-mono text-sm transition-colors">
            EMERGENCY HELP
          </button>
        </div>
      </div>
    </div>
  );
}