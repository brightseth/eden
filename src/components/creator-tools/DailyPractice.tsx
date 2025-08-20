'use client';

import { useState } from 'react';
import { Calendar, Check, X, Flame } from 'lucide-react';

interface DailyPracticeProps {
  agentName: string;
}

export function DailyPractice({ agentName }: DailyPracticeProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Sample data - in a real app this would come from an API
  const practiceData = {
    currentStreak: 28,
    longestStreak: 45,
    totalDays: 95,
    lastPractice: '2025-08-19',
    weeklyGoal: 7,
    completedThisWeek: 5
  };

  const recentDays = [
    { date: '2025-08-19', completed: true, type: 'Auction Creation', revenue: '0.5 ETH' },
    { date: '2025-08-18', completed: true, type: 'Style Refinement', revenue: '0.3 ETH' },
    { date: '2025-08-17', completed: true, type: 'Auction Creation', revenue: '0.7 ETH' },
    { date: '2025-08-16', completed: false, type: 'Skipped', revenue: '0 ETH' },
    { date: '2025-08-15', completed: true, type: 'Auction Creation', revenue: '0.4 ETH' },
    { date: '2025-08-14', completed: true, type: 'Collection Drop', revenue: '1.2 ETH' },
    { date: '2025-08-13', completed: true, type: 'Auction Creation', revenue: '0.6 ETH' }
  ];

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 border border-gray-800 bg-gray-950">
          <div className="flex items-center gap-2 mb-2">
            <Flame className="w-4 h-4 text-orange-400" />
            <span className="text-xs text-gray-500 uppercase">Current Streak</span>
          </div>
          <div className="text-2xl font-bold text-orange-400">{practiceData.currentStreak}</div>
          <div className="text-xs text-gray-500">days</div>
        </div>

        <div className="p-4 border border-gray-800">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-green-400" />
            <span className="text-xs text-gray-500 uppercase">Total Days</span>
          </div>
          <div className="text-2xl font-bold">{practiceData.totalDays}</div>
          <div className="text-xs text-gray-500">in academy</div>
        </div>

        <div className="p-4 border border-gray-800">
          <div className="flex items-center gap-2 mb-2">
            <Check className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-gray-500 uppercase">This Week</span>
          </div>
          <div className="text-2xl font-bold">{practiceData.completedThisWeek}/{practiceData.weeklyGoal}</div>
          <div className="text-xs text-gray-500">completed</div>
        </div>

        <div className="p-4 border border-gray-800">
          <div className="flex items-center gap-2 mb-2">
            <Flame className="w-4 h-4 text-purple-400" />
            <span className="text-xs text-gray-500 uppercase">Best Streak</span>
          </div>
          <div className="text-2xl font-bold">{practiceData.longestStreak}</div>
          <div className="text-xs text-gray-500">days</div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="border border-gray-800">
        <div className="p-4 border-b border-gray-800">
          <h3 className="text-sm font-bold tracking-wider">RECENT ACTIVITY</h3>
        </div>
        <div className="divide-y divide-gray-800">
          {recentDays.map((day, idx) => (
            <div 
              key={day.date} 
              className="p-4 hover:bg-gray-950 transition-colors cursor-pointer"
              onClick={() => setSelectedDate(selectedDate === day.date ? null : day.date)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {day.completed ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <X className="w-4 h-4 text-red-400" />
                  )}
                  <div>
                    <div className="text-sm font-medium">
                      {new Date(day.date).toLocaleDateString('en-US', { 
                        weekday: 'short',
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </div>
                    <div className="text-xs text-gray-500">{day.type}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">{day.revenue}</div>
                  <div className="text-xs text-gray-500">revenue</div>
                </div>
              </div>
              
              {selectedDate === day.date && (
                <div className="mt-3 pt-3 border-t border-gray-800">
                  <div className="text-xs text-gray-400">
                    {day.completed ? (
                      <>
                        {agentName} successfully completed daily practice on {day.date}. 
                        Created and auctioned one piece generating {day.revenue} in revenue.
                        Maintained consistency with brand aesthetic and quality standards.
                      </>
                    ) : (
                      <>
                        No creation activity recorded for {day.date}. 
                        This breaks the current streak and affects overall covenant compliance.
                        Consider implementing backup systems for consistent daily output.
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button className="p-4 border border-gray-800 hover:border-green-400 transition-colors text-left">
          <div className="text-sm font-bold mb-1">LOG TODAY'S PRACTICE</div>
          <div className="text-xs text-gray-500">Record today's creation and auction results</div>
        </button>
        
        <button className="p-4 border border-gray-800 hover:border-blue-400 transition-colors text-left">
          <div className="text-sm font-bold mb-1">VIEW FULL CALENDAR</div>
          <div className="text-xs text-gray-500">See complete practice history and patterns</div>
        </button>
      </div>
    </div>
  );
}