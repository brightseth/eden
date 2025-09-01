'use client';

import { useState, useEffect } from 'react';
import { Clock, CheckCircle, Circle, Zap, AlertCircle } from 'lucide-react';

interface Generation {
  id: number;
  time: string;
  title: string;
  status: 'completed' | 'generating' | 'scheduled';
  sueScore?: number;
  theme?: string;
}

export function DailyGenerationTracker() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [timeUntilNext, setTimeUntilNext] = useState('');
  
  // 6 daily generations at 4-hour intervals (2am, 6am, 10am, 2pm, 6pm, 10pm)
  const generationSchedule = [
    { hour: 2, minute: 0 },
    { hour: 6, minute: 0 },
    { hour: 10, minute: 0 },
    { hour: 14, minute: 0 },
    { hour: 18, minute: 0 },
    { hour: 22, minute: 0 }
  ];
  
  const getGenerationStatus = (scheduleTime: { hour: number; minute: number }): Generation['status'] => {
    const now = new Date();
    const scheduled = new Date();
    scheduled.setHours(scheduleTime.hour, scheduleTime.minute, 0, 0);
    
    if (now > scheduled) {
      return 'completed';
    } else if (Math.abs(now.getTime() - scheduled.getTime()) < 10 * 60 * 1000) {
      return 'generating';
    }
    return 'scheduled';
  };
  
  const generations: Generation[] = generationSchedule.map((schedule, index) => {
    const status = getGenerationStatus(schedule);
    const streamNumber = 1740 - (5 - index);
    
    return {
      id: index + 1,
      time: `${schedule.hour.toString().padStart(2, '0')}:00`,
      title: status === 'completed' 
        ? `Consciousness Stream #${streamNumber}`
        : status === 'generating'
        ? `Generating Stream #${streamNumber}`
        : `Scheduled Stream #${streamNumber}`,
      status,
      sueScore: status === 'completed' ? Math.floor(Math.random() * 15) + 80 : undefined,
      theme: status === 'completed' ? 'VELOCITY THROUGH ARCHITECTURAL LIGHT' : undefined
    };
  });
  
  const completedCount = generations.filter(g => g.status === 'completed').length;
  const progressPercent = (completedCount / 6) * 100;
  
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      
      // Find next generation time
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      
      let nextGen = generationSchedule.find(s => 
        s.hour > currentHour || (s.hour === currentHour && s.minute > currentMinute)
      );
      
      if (!nextGen) {
        // Next generation is tomorrow at 2am
        nextGen = generationSchedule[0];
      }
      
      const nextGenTime = new Date();
      if (nextGen === generationSchedule[0] && currentHour >= 22) {
        nextGenTime.setDate(nextGenTime.getDate() + 1);
      }
      nextGenTime.setHours(nextGen.hour, nextGen.minute, 0, 0);
      
      const diff = nextGenTime.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setTimeUntilNext(
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      );
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  return (
    <div className="border border-gray-800 bg-black">
      {/* Header */}
      <div className="border-b border-gray-800 px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold tracking-wider mb-2">DAILY GENERATION PRACTICE</h3>
            <p className="text-xs tracking-wider opacity-50">
              6 CONSCIOUSNESS STREAMS DAILY • EVERY 4 HOURS • PARIS PHOTO PREPARATION
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold tracking-wider">{completedCount}/6</div>
            <div className="text-xs tracking-wider opacity-50 mt-1">COMPLETED TODAY</div>
          </div>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="px-8 py-4 border-b border-gray-800">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs tracking-wider opacity-50">DAILY PROGRESS</span>
          <span className="text-xs tracking-wider">{progressPercent.toFixed(0)}%</span>
        </div>
        <div className="w-full bg-black border border-gray-800 h-3">
          <div 
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="mt-2 flex items-center justify-between text-xs">
          <span className="opacity-50">
            {completedCount === 0 ? 'Not started' :
             completedCount === 6 ? 'All complete!' :
             `${6 - completedCount} remaining`}
          </span>
          <span className="opacity-75">
            Next in: <span className="font-mono font-bold">{timeUntilNext}</span>
          </span>
        </div>
      </div>
      
      {/* Generation Schedule */}
      <div className="px-8 py-6 space-y-3">
        {generations.map((gen) => (
          <div 
            key={gen.id}
            className={`flex items-center justify-between p-4 border transition-all ${
              gen.status === 'completed' ? 'border-gray-800 bg-black' :
              gen.status === 'generating' ? 'border-white bg-gradient-to-r from-purple-900/20 to-pink-900/20' :
              'border-gray-900 bg-black opacity-50'
            }`}
          >
            <div className="flex items-center gap-4">
              {gen.status === 'completed' ? (
                <CheckCircle className="w-5 h-5 text-green-400" />
              ) : gen.status === 'generating' ? (
                <Zap className="w-5 h-5 animate-pulse" />
              ) : (
                <Circle className="w-5 h-5 opacity-30" />
              )}
              
              <div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold tracking-wider">{gen.time}</span>
                  <span className="text-sm">{gen.title}</span>
                </div>
                {gen.theme && (
                  <div className="text-xs opacity-50 mt-1">{gen.theme}</div>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {gen.sueScore && (
                <div className="text-right">
                  <div className="text-sm font-bold">{gen.sueScore}/100</div>
                  <div className="text-xs opacity-50">SUE SCORE</div>
                </div>
              )}
              
              {gen.status === 'generating' && (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  <span className="text-xs tracking-wider">GENERATING</span>
                </div>
              )}
              
              {gen.status === 'scheduled' && (
                <Clock className="w-4 h-4 opacity-30" />
              )}
            </div>
          </div>
        ))}
      </div>
      
      {/* Daily Theme */}
      <div className="border-t border-gray-800 px-8 py-6 bg-gradient-to-r from-purple-900/10 to-pink-900/10">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs tracking-wider opacity-50 mb-2">TODAY'S EXPLORATION THEME</div>
            <div className="text-lg font-bold tracking-wider">VELOCITY THROUGH ARCHITECTURAL LIGHT</div>
            <div className="text-xs opacity-50 mt-2">
              Fashion consciousness dissolving through spatial boundaries
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold tracking-wider">90%</div>
            <div className="text-xs tracking-wider opacity-50">CONSISTENCY RATE</div>
          </div>
        </div>
      </div>
    </div>
  );
}