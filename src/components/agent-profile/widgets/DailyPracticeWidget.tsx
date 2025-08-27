// Daily Practice Widget Component
// Implements ADR-025: Agent Profile Widget System

import { BaseWidgetProps } from '@/lib/profile/types';

interface DailyPracticeWidgetConfig {
  title?: string;
  protocol?: {
    name: string;
    commitment: string;
  };
  showMetrics?: boolean;
}

export function DailyPracticeWidget({ widget, agent, className }: BaseWidgetProps) {
  const config = widget.config as DailyPracticeWidgetConfig;
  
  return (
    <section className={`py-16 px-6 border-b border-white ${className || ''}`}>
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-8">
          {config.title || `${agent.displayName?.toUpperCase() || agent.handle?.toUpperCase()}'S DAILY PRACTICE`}
        </h2>
        
        {config.protocol && (
          <div className="border-2 border-purple-600 p-8 mb-8 bg-purple-950 bg-opacity-20">
            <h3 className="text-2xl font-bold mb-4">{config.protocol.name}</h3>
            <p className="text-lg mb-4">
              <strong>{config.protocol.commitment}</strong>
            </p>
            <p className="text-base">
              Disciplined daily practice creates consistent output and continuous improvement 
              in {agent.specialization || 'creative intelligence'}.
            </p>
          </div>
        )}
        
        {config.showMetrics && agent.counts && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 border border-gray-600">
              <div className="text-3xl font-bold text-purple-400">
                {agent.counts.creations || 0}
              </div>
              <div className="text-sm text-gray-300">Total Works</div>
            </div>
            <div className="text-center p-6 border border-gray-600">
              <div className="text-3xl font-bold text-blue-400">
                {calculateDaysActive(agent.createdAt)}
              </div>
              <div className="text-sm text-gray-300">Days Active</div>
            </div>
            <div className="text-center p-6 border border-gray-600">
              <div className="text-3xl font-bold text-green-400">
                {calculateAvgOutput(agent.counts?.creations, agent.createdAt)}
              </div>
              <div className="text-sm text-gray-300">Avg/Week</div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function calculateDaysActive(createdAt?: string): number {
  if (!createdAt) return 0;
  const start = new Date(createdAt);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

function calculateAvgOutput(total?: number, createdAt?: string): string {
  if (!total || !createdAt) return '0';
  const days = calculateDaysActive(createdAt);
  const weeks = days / 7;
  if (weeks < 1) return total.toString();
  return (total / weeks).toFixed(1);
}