'use client';

import { Agent } from '@/types';
import { Card, CardContent } from '@/components/ui/card';

interface SystemMetricsProps {
  agents: Agent[];
}

export function SystemMetrics({ agents }: SystemMetricsProps) {
  const activeAgents = agents.length;
  const avgProgress = agents.length > 0 
    ? Math.round(agents.reduce((sum, agent) => sum + (agent.currentDay / agent.totalDays * 100), 0) / agents.length)
    : 0;
  
  const nextLaunch = agents.length > 0 
    ? Math.min(...agents.map(agent => agent.daysUntilLaunch))
    : 0;
    
  const nextLaunchAgent = agents.find(agent => agent.daysUntilLaunch === nextLaunch);
  
  const metrics = [
    {
      label: 'Active Agents',
      value: activeAgents.toString(),
      subtitle: activeAgents === 0 ? 'None' : '+0 this month',
      color: 'text-eden-white',
    },
    {
      label: 'Avg Progress',
      value: `${avgProgress}%`,
      subtitle: avgProgress > 50 ? '+5% this week' : 'Early stage',
      color: avgProgress > 50 ? 'category-social' : 'text-yellow-400',
    },
    {
      label: 'Next Launch',
      value: nextLaunch > 0 ? `${nextLaunch} days` : 'TBD',
      subtitle: nextLaunchAgent?.name || 'No launches scheduled',
      color: nextLaunch < 30 ? 'category-economic' : nextLaunch < 60 ? 'text-yellow-400' : 'category-social',
    },
    {
      label: 'Success Rate',
      value: 'TBD',
      subtitle: '0 graduated',
      color: 'text-eden-gray',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, index) => (
        <Card key={index} className="metric-card">
          <CardContent className="p-4 text-center">
            <div className={`metric-value ${metric.color}`}>
              {metric.value}
            </div>
            <div className="metric-label mt-1">
              {metric.label}
            </div>
            <div className="text-xs text-eden-gray mt-1">
              {metric.subtitle}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}