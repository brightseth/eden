'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, TrendingUp, AlertCircle, CheckCircle, Clock } from 'lucide-react';

interface DayStats {
  day: number;
  date: string;
  hasWork: boolean;
  includeRate?: number;
  qualityScore?: number;
  verdict?: 'INCLUDE' | 'EXCLUDE' | 'PENDING';
  state?: string;
}

interface PracticeCalendarProps {
  agentName: string;
}

export function PracticeCalendar({ agentName }: PracticeCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [dayStats, setDayStats] = useState<Map<string, DayStats>>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState<DayStats | null>(null);
  
  useEffect(() => {
    loadMonthData();
  }, [currentMonth, agentName]);
  
  async function loadMonthData() {
    setIsLoading(true);
    try {
      // Get first and last day of month
      const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
      const lastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
      
      // Fetch calendar data
      const response = await fetch(`/api/practice-calendar?agent_id=${agentName.toLowerCase()}&from=${firstDay.toISOString()}&to=${lastDay.toISOString()}`);
      const data = await response.json();
      
      // Map data to calendar
      const statsMap = new Map<string, DayStats>();
      data.days?.forEach((day: DayStats) => {
        const dateKey = new Date(day.date).toDateString();
        statsMap.set(dateKey, day);
      });
      
      setDayStats(statsMap);
    } catch (error) {
      console.error('Failed to load calendar data:', error);
    } finally {
      setIsLoading(false);
    }
  }
  
  // Calculate calendar grid
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
  const lastDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
  const startPadding = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();
  
  // Generate calendar days
  const calendarDays = [];
  for (let i = 0; i < startPadding; i++) {
    calendarDays.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const dateKey = date.toDateString();
    const stats = dayStats.get(dateKey);
    calendarDays.push({
      day,
      date,
      stats
    });
  }
  
  // Calculate metrics
  const totalDays = Array.from(dayStats.values()).filter(d => d.hasWork).length;
  const includeDays = Array.from(dayStats.values()).filter(d => d.verdict === 'INCLUDE').length;
  const avgQuality = Array.from(dayStats.values())
    .filter(d => d.qualityScore)
    .reduce((sum, d) => sum + (d.qualityScore || 0), 0) / (totalDays || 1);
  const includeRate = totalDays > 0 ? (includeDays / totalDays) * 100 : 0;
  
  // Find streaks and gaps
  const sortedDays = Array.from(dayStats.values())
    .filter(d => d.hasWork)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  let currentStreak = 0;
  let maxStreak = 0;
  let lastDate: Date | null = null;
  let maxGap = 0;
  
  sortedDays.forEach(day => {
    const date = new Date(day.date);
    if (lastDate) {
      const diff = Math.floor((date.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
      if (diff === 1) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        currentStreak = 1;
        maxGap = Math.max(maxGap, diff - 1);
      }
    } else {
      currentStreak = 1;
    }
    lastDate = date;
  });
  
  function getDayColor(stats?: DayStats) {
    if (!stats?.hasWork) return '';
    
    if (stats.verdict === 'INCLUDE') {
      return 'bg-green-900 border-green-700 hover:border-green-500';
    } else if (stats.verdict === 'EXCLUDE') {
      return 'bg-red-900/50 border-red-800 hover:border-red-600';
    } else if (stats.state === 'published') {
      return 'bg-purple-900 border-purple-700 hover:border-purple-500';
    } else {
      return 'bg-yellow-900/50 border-yellow-800 hover:border-yellow-600';
    }
  }
  
  return (
    <div className="space-y-6">
      {/* Header with navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
            className="p-2 hover:bg-gray-800 rounded"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <h2 className="text-xl font-bold">
            {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h2>
          
          <button
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
            className="p-2 hover:bg-gray-800 rounded"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
        
        <button
          onClick={() => setCurrentMonth(new Date())}
          className="px-3 py-1.5 bg-gray-900 border border-gray-700 rounded text-sm hover:border-gray-500"
        >
          Today
        </button>
      </div>
      
      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Include Rate</span>
            <TrendingUp className="w-4 h-4 text-green-400" />
          </div>
          <div className="text-2xl font-bold">{includeRate.toFixed(1)}%</div>
          <div className="text-xs text-gray-500">{includeDays} of {totalDays} days</div>
        </div>
        
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Avg Quality</span>
            <CheckCircle className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold">{(avgQuality * 100).toFixed(0)}%</div>
          <div className="text-xs text-gray-500">Print readiness</div>
        </div>
        
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Best Streak</span>
            <Clock className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold">{maxStreak} days</div>
          <div className="text-xs text-gray-500">Consecutive practice</div>
        </div>
        
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">Max Gap</span>
            <AlertCircle className="w-4 h-4 text-yellow-400" />
          </div>
          <div className="text-2xl font-bold">{maxGap} days</div>
          <div className="text-xs text-gray-500">Between uploads</div>
        </div>
      </div>
      
      {/* Calendar Grid */}
      <div className="bg-gray-950 border border-gray-800 rounded-lg p-4">
        {/* Day headers */}
        <div className="grid grid-cols-7 gap-2 mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-xs text-gray-500 font-semibold">
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-2">
          {calendarDays.map((day, index) => (
            <div
              key={index}
              className={`aspect-square relative ${day ? 'cursor-pointer' : ''}`}
              onClick={() => day?.stats && setSelectedDay(day.stats)}
            >
              {day ? (
                <div className={`
                  w-full h-full rounded-lg border p-2 transition-all
                  ${getDayColor(day.stats)}
                  ${!day.stats?.hasWork ? 'bg-gray-900/50 border-gray-800 hover:border-gray-700' : ''}
                `}>
                  <div className="text-sm font-semibold">{day.day}</div>
                  
                  {day.stats?.hasWork && (
                    <div className="mt-1">
                      {day.stats.verdict === 'INCLUDE' && (
                        <CheckCircle className="w-3 h-3 text-green-400" />
                      )}
                      {day.stats.qualityScore && (
                        <div className="text-xs text-gray-400">
                          {(day.stats.qualityScore * 100).toFixed(0)}%
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Highlight today */}
                  {day.date.toDateString() === new Date().toDateString() && (
                    <div className="absolute inset-0 border-2 border-purple-500 rounded-lg pointer-events-none" />
                  )}
                </div>
              ) : (
                <div className="w-full h-full" />
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Legend */}
      <div className="flex items-center gap-6 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-900 border border-green-700 rounded" />
          <span>Include</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-900/50 border border-red-800 rounded" />
          <span>Exclude</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-900/50 border border-yellow-800 rounded" />
          <span>Pending</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-purple-900 border border-purple-700 rounded" />
          <span>Published</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-900/50 border border-gray-800 rounded" />
          <span>No upload</span>
        </div>
      </div>
      
      {/* Selected Day Details */}
      {selectedDay && (
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold">Day {selectedDay.day}</h3>
            <button
              onClick={() => setSelectedDay(null)}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Date:</span>
              <span>{new Date(selectedDay.date).toLocaleDateString()}</span>
            </div>
            {selectedDay.verdict && (
              <div className="flex justify-between">
                <span className="text-gray-400">Verdict:</span>
                <span className={selectedDay.verdict === 'INCLUDE' ? 'text-green-400' : 'text-red-400'}>
                  {selectedDay.verdict}
                </span>
              </div>
            )}
            {selectedDay.qualityScore && (
              <div className="flex justify-between">
                <span className="text-gray-400">Quality:</span>
                <span>{(selectedDay.qualityScore * 100).toFixed(0)}%</span>
              </div>
            )}
            {selectedDay.state && (
              <div className="flex justify-between">
                <span className="text-gray-400">Status:</span>
                <span className="capitalize">{selectedDay.state}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}