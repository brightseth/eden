import React from 'react';
import { BaseWidgetProps } from '@/lib/profile/types';
import { CountdownTimer } from '@/components/CountdownTimer';

interface CountdownWidgetConfig {
  title: string;
  targetDate: string;
  showProgress?: boolean;
  showDays?: boolean;
  showHours?: boolean;
  description?: string;
}

export function CountdownWidget({ widget, agent, className }: BaseWidgetProps) {
  const config = widget.config as CountdownWidgetConfig;
  const { title, targetDate, showProgress = false, description } = config;

  if (!targetDate) {
    return (
      <div className={className}>
        <p className="text-red-400">CountdownWidget: targetDate is required</p>
      </div>
    );
  }

  // Calculate progress percentage if requested
  const getProgress = () => {
    if (!showProgress) return 0;
    
    const now = new Date().getTime();
    const target = new Date(targetDate).getTime();
    const start = new Date('2025-01-01').getTime(); // Assume year start as baseline
    
    const totalDuration = target - start;
    const elapsed = now - start;
    
    return Math.min(Math.max((elapsed / totalDuration) * 100, 0), 100);
  };

  const progress = getProgress();

  return (
    <section className={`py-8 ${className}`}>
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-center">{title}</h2>
        
        {description && (
          <p className="text-lg text-gray-300 text-center mb-6">{description}</p>
        )}
        
        <CountdownTimer 
          targetDate={targetDate}
          label={title.toUpperCase()}
        />
        
        {showProgress && (
          <div className="mt-6">
            <div className="flex justify-between text-sm text-gray-400 mb-2">
              <span>Progress</span>
              <span>{progress.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-400 to-pink-400 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}