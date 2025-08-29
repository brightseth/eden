'use client';

import { useState, useEffect } from 'react';
import { Calendar, Clock, Zap, CheckCircle, Circle, Play } from 'lucide-react';

interface CovenantScheduleEntry {
  day: number;
  date: string;
  weekday: string;
  theme: string;
  focus: string;
  estimatedCompletionTime: string;
  status: 'pending' | 'in_progress' | 'completed';
  workPreview?: {
    conceptualDirection: string;
    visualStyle: string;
    expectedComplexity: 'low' | 'medium' | 'high';
  };
}

interface CovenantScheduleProps {
  agentHandle?: string;
  showWeekOffset?: number;
  compact?: boolean;
}

export function CovenantSchedule({ 
  agentHandle = 'abraham', 
  showWeekOffset = 0,
  compact = false 
}: CovenantScheduleProps) {
  const [schedule, setSchedule] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedWeek, setSelectedWeek] = useState(showWeekOffset);

  useEffect(() => {
    async function fetchSchedule() {
      try {
        const response = await fetch(`/api/agents/${agentHandle}/schedule?week=${selectedWeek}`);
        if (!response.ok) {
          throw new Error('Failed to fetch covenant schedule');
        }
        const data = await response.json();
        setSchedule(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchSchedule();
  }, [agentHandle, selectedWeek]);

  if (loading) {
    return (
      <div className="border border-white p-8 text-center">
        <div className="text-lg mb-2">Loading covenant schedule...</div>
        <div className="text-sm opacity-75">Calculating daily creation timeline</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="border border-red-500 p-8 bg-red-500/10">
        <div className="text-xl mb-2">⚠️ Schedule Unavailable</div>
        <div className="text-sm">{error}</div>
      </div>
    );
  }

  if (schedule?.status === 'pre_covenant') {
    return (
      <div className="border border-yellow-400 p-6 bg-yellow-400/10">
        <div className="flex items-center gap-3 mb-4">
          <Calendar className="w-6 h-6 text-yellow-400" />
          <h3 className="text-xl">Pre-Covenant Preparation</h3>
        </div>
        <p className="text-sm mb-6">{schedule.message}</p>
        
        <div className="space-y-3">
          {schedule.preparatory_schedule.map((item: any, index: number) => (
            <div key={index} className="border border-yellow-400/30 p-3">
              <div className="flex justify-between items-start mb-1">
                <div className="font-bold text-yellow-400">{item.date}</div>
                <div className="text-xs">{item.activity}</div>
              </div>
              <div className="text-sm opacity-75">{item.description}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const StatusIcon = ({ status }: { status: string }) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'in_progress':
        return <Play className="w-5 h-5 text-blue-400" />;
      default:
        return <Circle className="w-5 h-5 text-gray-400" />;
    }
  };

  const ComplexityIndicator = ({ complexity }: { complexity: string }) => {
    const dots = complexity === 'high' ? 3 : complexity === 'medium' ? 2 : 1;
    return (
      <div className="flex gap-1">
        {Array.from({ length: 3 }, (_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full ${
              i < dots ? 'bg-white' : 'bg-gray-600'
            }`}
          />
        ))}
      </div>
    );
  };

  if (compact) {
    return (
      <div className="border border-white p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg">Weekly Covenant Schedule</h3>
          <div className="text-xs px-2 py-1 border border-green-400 text-green-400">
            DAY {schedule.covenant.current_day}
          </div>
        </div>
        
        <div className="grid gap-2">
          {schedule.schedule.entries.slice(0, 3).map((entry: CovenantScheduleEntry) => (
            <div key={entry.day} className="flex items-center gap-3 p-2 border border-gray-600">
              <StatusIcon status={entry.status} />
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm">{entry.weekday}</div>
                <div className="text-xs opacity-75 truncate">{entry.theme}</div>
              </div>
              <div className="text-xs">Day {entry.day}</div>
            </div>
          ))}
          {schedule.schedule.entries.length > 3 && (
            <div className="text-center text-xs opacity-50 py-2">
              +{schedule.schedule.entries.length - 3} more days
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="border border-white">
      {/* Header */}
      <div className="border-b border-white p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Calendar className="w-6 h-6" />
            <h2 className="text-2xl">WEEKLY COVENANT SCHEDULE</h2>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{schedule.covenant.progress_percentage}%</div>
            <div className="text-sm">Day {schedule.covenant.current_day} of 4,748</div>
          </div>
        </div>
        
        {/* Week Navigation */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSelectedWeek(prev => prev - 1)}
            className="px-3 py-1 border border-white hover:bg-white hover:text-black transition-colors text-sm"
          >
            ← Previous Week
          </button>
          <div className="text-sm">
            {schedule.schedule.week_start} to {schedule.schedule.week_end}
            {selectedWeek === 0 && " (Current Week)"}
          </div>
          <button
            onClick={() => setSelectedWeek(prev => prev + 1)}
            className="px-3 py-1 border border-white hover:bg-white hover:text-black transition-colors text-sm"
          >
            Next Week →
          </button>
        </div>
      </div>

      {/* Schedule Entries */}
      <div className="p-6">
        <div className="grid gap-4 lg:grid-cols-2">
          {schedule.schedule.entries.map((entry: CovenantScheduleEntry) => (
            <div key={entry.day} className="border border-gray-600 p-4 hover:border-white transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <StatusIcon status={entry.status} />
                  <div>
                    <div className="font-bold">{entry.weekday}</div>
                    <div className="text-sm text-gray-400">{entry.date}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold">Day {entry.day}</div>
                  <div className="text-xs flex items-center gap-2">
                    <Clock className="w-3 h-3" />
                    {entry.estimatedCompletionTime}
                  </div>
                </div>
              </div>
              
              <div className="mb-3">
                <div className="font-bold text-lg mb-1">{entry.theme}</div>
                <div className="text-sm opacity-75">{entry.focus}</div>
              </div>
              
              {entry.workPreview && (
                <div className="border-t border-gray-600 pt-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-xs font-bold">WORK PREVIEW</div>
                    <ComplexityIndicator complexity={entry.workPreview.expectedComplexity} />
                  </div>
                  <div className="text-xs space-y-1">
                    <div><strong>Direction:</strong> {entry.workPreview.conceptualDirection}</div>
                    <div><strong>Style:</strong> {entry.workPreview.visualStyle}</div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Week Summary */}
      <div className="border-t border-white p-6">
        <h3 className="text-lg mb-4">WEEK SUMMARY</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">
              {schedule.summary.completed_this_week}
            </div>
            <div className="text-sm">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">
              {schedule.summary.in_progress_this_week}
            </div>
            <div className="text-sm">In Progress</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-400">
              {schedule.summary.pending_this_week}
            </div>
            <div className="text-sm">Pending</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">
              {schedule.summary.estimated_total_hours}h
            </div>
            <div className="text-sm">Est. Hours</div>
          </div>
        </div>
        
        <div className="mt-4">
          <div className="text-sm font-bold mb-2">Themes This Week:</div>
          <div className="flex flex-wrap gap-2">
            {schedule.summary.themes_this_week.map((theme: string, index: number) => (
              <div key={index} className="px-2 py-1 text-xs border border-gray-600">
                {theme}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}