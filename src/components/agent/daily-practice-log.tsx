'use client';

import React, { useState } from 'react';
import { Check, X, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';
import { 
  useDailyPractice, 
  useSaveDailyPractice,
  useIncrementPublished,
  useReportBlocker,
  useDailyTasks,
  useToggleTask
} from '@/hooks/use-operator-data';
import type { CreateDailyPractice } from '@/lib/validation/schemas';

interface DailyPracticeLogProps {
  agentId: string;
  onAddEntry?: (entry: any) => void;
}

const DAILY_TASKS = [
  { id: 'plan', title: 'Pick micro-theme', owner: 'creator', time: '10min', completed: false },
  { id: 'create', title: 'Generate & curate', owner: 'creator', time: '60min', completed: false },
  { id: 'publish', title: 'Post to Farcaster', owner: 'joint', time: '15min', completed: false },
  { id: 'engage', title: 'Reply/DM collectors', owner: 'creator', time: '10min', completed: false },
  { id: 'log', title: 'Update journal', owner: 'creator', time: '5min', completed: false }
];

// Mock data for last 7 days (fallback)
const MOCK_ENTRIES = [
  {
    date: new Date('2024-12-09'),
    theme: 'Abstract Landscapes',
    creationsCount: 12,
    publishedCount: 3,
    views: 145,
    reactions: 8,
    collects: 0,
    costUSDC: 2.40,
    revenueUSDC: 0,
    note: 'Tried new style, low engagement'
  },
  {
    date: new Date('2024-12-10'),
    theme: 'Portraits',
    creationsCount: 8,
    publishedCount: 2,
    views: 234,
    reactions: 15,
    collects: 1,
    costUSDC: 1.60,
    revenueUSDC: 5.00,
    note: 'First sale! Portrait style working'
  },
  {
    date: new Date('2024-12-11'),
    theme: 'Portraits',
    creationsCount: 10,
    publishedCount: 3,
    views: 312,
    reactions: 22,
    collects: 2,
    costUSDC: 2.00,
    revenueUSDC: 10.00,
    note: 'Doubling down on portraits'
  },
  {
    date: new Date('2024-12-12'),
    theme: 'Portraits',
    creationsCount: 15,
    publishedCount: 5,
    views: 456,
    reactions: 28,
    collects: 1,
    costUSDC: 3.00,
    revenueUSDC: 5.00,
    note: 'Quality over quantity tomorrow'
  },
  {
    date: new Date('2024-12-13'),
    theme: 'Minimal Portraits',
    creationsCount: 6,
    publishedCount: 2,
    views: 523,
    reactions: 45,
    collects: 3,
    costUSDC: 1.20,
    revenueUSDC: 15.00,
    note: 'Less is more! Best day yet',
    blockers: []
  },
  {
    date: new Date('2024-12-14'),
    theme: 'Minimal Portraits',
    creationsCount: 0,
    publishedCount: 0,
    views: 0,
    reactions: 0,
    collects: 0,
    costUSDC: 0,
    revenueUSDC: 0,
    note: 'API down all day',
    blockers: ['Eden API unavailable']
  },
  {
    date: new Date('2024-12-15'),
    theme: 'Minimal Portraits',
    creationsCount: 8,
    publishedCount: 3,
    views: 678,
    reactions: 52,
    collects: 4,
    costUSDC: 1.60,
    revenueUSDC: 20.00,
    note: 'Back on track, momentum building'
  }
];

export function DailyPracticeLog({ agentId, onAddEntry }: DailyPracticeLogProps) {
  const { data: practiceData, isLoading } = useDailyPractice(agentId, 7);
  const { data: tasksData } = useDailyTasks(agentId);
  const { mutate: savePractice, isPending: isSaving } = useSaveDailyPractice(agentId);
  const { mutate: incrementPublished } = useIncrementPublished(agentId);
  const { mutate: reportBlocker } = useReportBlocker(agentId);
  const { mutate: toggleTaskComplete } = useToggleTask(agentId);
  
  const [showAddEntry, setShowAddEntry] = useState(false);
  const [newEntry, setNewEntry] = useState<Partial<CreateDailyPractice>>({
    theme: '',
    creations_count: 0,
    published_count: 0,
    views: 0,
    reactions: 0,
    collects: 0,
    cost_usdc: 0,
    revenue_usdc: 0,
    note: ''
  });
  
  // Use API data or fallback to mock
  const entries = practiceData?.entries || MOCK_ENTRIES.map(e => ({
    ...e,
    date: e.date.toISOString().split('T')[0],
    creations_count: e.creationsCount,
    published_count: e.publishedCount,
    cost_usdc: e.costUSDC,
    revenue_usdc: e.revenueUSDC,
    blockers: e.blockers || []
  }));
  
  const todayTasks = tasksData || DAILY_TASKS;

  // Calculate weekly totals
  const weeklyStats = practiceData?.metrics || {
    totalCost: entries.reduce((sum: number, e: any) => sum + (e.cost_usdc || e.costUSDC || 0), 0),
    totalRevenue: entries.reduce((sum: number, e: any) => sum + (e.revenue_usdc || e.revenueUSDC || 0), 0),
    totalCollects: entries.reduce((sum: number, e: any) => sum + e.collects, 0),
    avgEngagement: entries.reduce((sum: number, e: any) => sum + e.reactions, 0) / (entries.length || 1),
    streakDays: entries.filter((e: any) => (e.published_count || e.publishedCount || 0) > 0).length
  };

  const weeklyProfit = weeklyStats.totalRevenue - weeklyStats.totalCost;
  const todayEntry = entries[entries.length - 1];
  const yesterdayEntry = entries[entries.length - 2];
  const momentumDirection = todayEntry?.collects > yesterdayEntry?.collects ? 'up' : 'down';

  const toggleTask = (taskId: string) => {
    toggleTaskComplete({ taskId, completed: !todayTasks.find(t => t.id === taskId)?.completed });
  };
  
  const handleSaveEntry = () => {
    if (newEntry.theme) {
      savePractice(newEntry as CreateDailyPractice);
      setShowAddEntry(false);
      setNewEntry({
        theme: '',
        creations_count: 0,
        published_count: 0,
        views: 0,
        reactions: 0,
        collects: 0,
        cost_usdc: 0,
        revenue_usdc: 0,
        note: ''
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Today's Checklist */}
      <div className="border border-eden-white/20 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-mono">TODAY'S PRACTICE</h3>
          <span className="text-sm text-eden-gray">
            {todayTasks.filter(t => t.completed).length}/{todayTasks.length} complete
          </span>
        </div>
        
        <div className="space-y-2">
          {todayTasks.map(task => (
            <div 
              key={task.id}
              className="flex items-center justify-between p-3 bg-eden-white/5 rounded hover:bg-eden-white/10 transition-colors"
            >
              <div className="flex items-center gap-3">
                <button onClick={() => toggleTask(task.id)}>
                  {task.completed ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <div className="w-4 h-4 border border-eden-gray" />
                  )}
                </button>
                <div>
                  <span className={task.completed ? 'line-through text-eden-gray' : ''}>
                    {task.title}
                  </span>
                  <span className="text-xs text-eden-gray ml-2">
                    ({task.time} • {task.owner})
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button 
          onClick={() => setShowAddEntry(true)}
          className="w-full mt-4 py-2 bg-eden-white/10 hover:bg-eden-white/20 font-mono text-sm transition-colors"
        >
          LOG TODAY'S RESULTS
        </button>
        
        <button 
          onClick={() => incrementPublished()}
          className="w-full mt-2 py-2 bg-green-500/10 hover:bg-green-500/20 text-green-500 font-mono text-sm transition-colors"
        >
          + QUICK PUBLISH
        </button>
      </div>

      {/* Weekly Summary */}
      <div className="border border-eden-white/20 rounded-lg p-6">
        <h3 className="font-mono mb-4">WEEK SUMMARY</h3>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex justify-between">
            <span className="text-eden-gray">Revenue:</span>
            <span className="font-mono text-green-500">
              ${weeklyStats.totalRevenue.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-eden-gray">Costs:</span>
            <span className="font-mono text-red-500">
              -${weeklyStats.totalCost.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-eden-gray">Net Profit:</span>
            <span className={`font-mono ${weeklyProfit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              ${weeklyProfit.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-eden-gray">Collects:</span>
            <span className="font-mono">{weeklyStats.totalCollects}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-eden-gray">Streak:</span>
            <span className="font-mono">{weeklyStats.streakDays}/7 days</span>
          </div>
          <div className="flex justify-between">
            <span className="text-eden-gray">Momentum:</span>
            <span className="font-mono flex items-center gap-1">
              {momentumDirection === 'up' ? (
                <>
                  <TrendingUp className="w-3 h-3 text-green-500" />
                  <span className="text-green-500">BUILDING</span>
                </>
              ) : (
                <>
                  <TrendingDown className="w-3 h-3 text-red-500" />
                  <span className="text-red-500">LOSING</span>
                </>
              )}
            </span>
          </div>
        </div>

        {weeklyProfit < 0 && (
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500 rounded">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5" />
              <div className="text-sm">
                <p className="text-red-500 font-mono">UNPROFITABLE WEEK</p>
                <p className="text-eden-gray text-xs mt-1">
                  Need ${Math.abs(weeklyProfit).toFixed(2)} more revenue or reduce costs by 
                  {' '}{((weeklyStats.totalCost - weeklyStats.totalRevenue) / weeklyStats.totalCost * 100).toFixed(0)}%
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Daily Log */}
      <div className="border border-eden-white/20 rounded-lg overflow-hidden">
        <div className="bg-eden-white/5 px-6 py-3 border-b border-eden-white/10">
          <h3 className="font-mono text-sm">DAILY LOG</h3>
        </div>
        
        <div className="divide-y divide-eden-white/5">
          {[...entries].reverse().map((entry, i) => {
            const date = typeof entry.date === 'string' ? new Date(entry.date) : entry.date;
            const cost = entry.cost_usdc || entry.costUSDC || 0;
            const revenue = entry.revenue_usdc || entry.revenueUSDC || 0;
            const creations = entry.creations_count || entry.creationsCount || 0;
            const published = entry.published_count || entry.publishedCount || 0;
            
            return (
              <div key={i} className="px-6 py-4 hover:bg-eden-white/5 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="font-mono text-sm">
                      {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                    <span className="text-sm text-eden-gray ml-3">{entry.theme}</span>
                  </div>
                  <div className="text-right">
                    <div className={`font-mono text-sm ${
                      revenue - cost >= 0 ? 'text-green-500' : 'text-red-500'
                    }`}>
                      ${(revenue - cost).toFixed(2)}
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-6 text-xs text-eden-gray">
                  <span>{creations} created</span>
                  <span>{published} published</span>
                  <span>{entry.views} views</span>
                  <span>{entry.reactions} reactions</span>
                  <span className={entry.collects > 0 ? 'text-green-500' : ''}>
                    {entry.collects} collects
                  </span>
                </div>
                
                {entry.note && (
                  <p className="text-xs text-eden-gray mt-2 italic">"{entry.note}"</p>
                )}
                
                {entry.blockers && entry.blockers.length > 0 && (
                  <div className="flex items-center gap-2 mt-2">
                    <X className="w-3 h-3 text-red-500" />
                    <span className="text-xs text-red-500">{entry.blockers.join(', ')}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Insights */}
      <div className="border border-yellow-500/50 bg-yellow-500/10 rounded-lg p-4">
        <h3 className="font-mono text-sm mb-2">INSIGHTS</h3>
        <ul className="space-y-1 text-sm text-eden-gray">
          <li>• Best theme: "Minimal Portraits" (3.5 avg collects)</li>
          <li>• Optimal quantity: 2-3 pieces per day</li>
          <li>• Price sweet spot: $5 per collect</li>
          <li>• Best posting time: 2-4pm EST</li>
        </ul>
      </div>
      
      {/* Add Entry Modal */}
      {showAddEntry && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-eden-black border border-eden-white/20 rounded-lg p-6 max-w-md w-full">
            <h3 className="font-mono mb-4">LOG TODAY'S PRACTICE</h3>
            
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Theme (e.g., Minimal Portraits)"
                value={newEntry.theme}
                onChange={(e) => setNewEntry({...newEntry, theme: e.target.value})}
                className="w-full p-2 bg-eden-white/5 border border-eden-white/20 rounded"
              />
              
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  placeholder="Created"
                  value={newEntry.creations_count}
                  onChange={(e) => setNewEntry({...newEntry, creations_count: parseInt(e.target.value)})}
                  className="p-2 bg-eden-white/5 border border-eden-white/20 rounded"
                />
                <input
                  type="number"
                  placeholder="Published"
                  value={newEntry.published_count}
                  onChange={(e) => setNewEntry({...newEntry, published_count: parseInt(e.target.value)})}
                  className="p-2 bg-eden-white/5 border border-eden-white/20 rounded"
                />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <input
                  type="number"
                  placeholder="Views"
                  value={newEntry.views}
                  onChange={(e) => setNewEntry({...newEntry, views: parseInt(e.target.value)})}
                  className="p-2 bg-eden-white/5 border border-eden-white/20 rounded"
                />
                <input
                  type="number"
                  placeholder="Reactions"
                  value={newEntry.reactions}
                  onChange={(e) => setNewEntry({...newEntry, reactions: parseInt(e.target.value)})}
                  className="p-2 bg-eden-white/5 border border-eden-white/20 rounded"
                />
                <input
                  type="number"
                  placeholder="Collects"
                  value={newEntry.collects}
                  onChange={(e) => setNewEntry({...newEntry, collects: parseInt(e.target.value)})}
                  className="p-2 bg-eden-white/5 border border-eden-white/20 rounded"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  step="0.01"
                  placeholder="Cost ($)"
                  value={newEntry.cost_usdc}
                  onChange={(e) => setNewEntry({...newEntry, cost_usdc: parseFloat(e.target.value)})}
                  className="p-2 bg-eden-white/5 border border-eden-white/20 rounded"
                />
                <input
                  type="number"
                  step="0.01"
                  placeholder="Revenue ($)"
                  value={newEntry.revenue_usdc}
                  onChange={(e) => setNewEntry({...newEntry, revenue_usdc: parseFloat(e.target.value)})}
                  className="p-2 bg-eden-white/5 border border-eden-white/20 rounded"
                />
              </div>
              
              <textarea
                placeholder="Notes..."
                value={newEntry.note}
                onChange={(e) => setNewEntry({...newEntry, note: e.target.value})}
                className="w-full p-2 bg-eden-white/5 border border-eden-white/20 rounded h-20"
              />
            </div>
            
            <div className="flex gap-2 mt-6">
              <button
                onClick={handleSaveEntry}
                disabled={isSaving || !newEntry.theme}
                className="flex-1 py-2 bg-eden-white text-eden-black font-mono hover:bg-eden-white/90 disabled:opacity-50"
              >
                {isSaving ? 'SAVING...' : 'SAVE'}
              </button>
              <button
                onClick={() => setShowAddEntry(false)}
                className="flex-1 py-2 bg-eden-white/10 font-mono hover:bg-eden-white/20"
              >
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}