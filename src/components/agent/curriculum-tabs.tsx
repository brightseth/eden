'use client';

import { useState } from 'react';
import { DailyMetrics, AgentMilestone } from '@/types';
import { useAgentMetrics } from '@/hooks/use-agent-metrics';
import { useAgentMilestones } from '@/hooks/use-agent-milestones';
import { AgentActivity } from './agent-activity';
import { AgentEconomy } from './agent-economy';
import { AgentChecklist } from './agent-checklist';
import { IntegrationDashboard } from './integration-dashboard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Activity, DollarSign, CheckSquare, BarChart3, Calendar, Trophy, Settings } from 'lucide-react';

interface CurriculumTabsProps {
  agentId: string;
  currentStage?: number;
}

export function CurriculumTabs({ agentId, currentStage = 3 }: CurriculumTabsProps) {
  const [activeTab, setActiveTab] = useState('activity');
  const { data: metrics } = useAgentMetrics(agentId, 30);
  const { data: checklist } = useAgentMilestones(agentId);

  // Calculate tab badges
  const activityCount = metrics?.filter((m: DailyMetrics) => m.creationsCount > 0).length || 0;
  const checklistCount = checklist?.filter((c: AgentMilestone) => !c.completed).length || 0;
  const economyTotal = metrics?.slice(0, 7).reduce((sum: number, m: DailyMetrics) => sum + m.revenuePrimary + m.revenueSecondary, 0) || 0;

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-7 w-full bg-eden-black/50 p-1 rounded-lg">
          <TabsTrigger 
            value="activity" 
            className="flex items-center gap-2 data-[state=active]:bg-eden-white/10"
          >
            <Activity className="w-4 h-4" />
            <span className="hidden md:inline">Activity</span>
            {activityCount > 0 && (
              <span className="text-[10px] font-mono bg-eden-white/10 text-eden-white px-1.5 py-0.5 rounded">
                {activityCount}
              </span>
            )}
          </TabsTrigger>
          
          <TabsTrigger 
            value="economy"
            className="flex items-center gap-2 data-[state=active]:bg-eden-white/10"
          >
            <DollarSign className="w-4 h-4" />
            <span className="hidden md:inline">Economy</span>
            {economyTotal > 0 && (
              <span className="text-[10px] font-mono bg-eden-white/10 text-eden-white px-1.5 py-0.5 rounded">
                ${economyTotal.toFixed(0)}
              </span>
            )}
          </TabsTrigger>
          
          <TabsTrigger 
            value="checklist"
            className="flex items-center gap-2 data-[state=active]:bg-eden-white/10"
          >
            <CheckSquare className="w-4 h-4" />
            <span className="hidden md:inline">Tasks</span>
            {checklistCount > 0 && (
              <span className="text-[10px] font-mono bg-eden-white/10 text-eden-white px-1.5 py-0.5 rounded">
                {checklistCount}
              </span>
            )}
          </TabsTrigger>
          
          <TabsTrigger 
            value="metrics"
            className="flex items-center gap-2 data-[state=active]:bg-eden-white/10"
          >
            <BarChart3 className="w-4 h-4" />
            <span className="hidden md:inline">Metrics</span>
          </TabsTrigger>
          
          <TabsTrigger 
            value="schedule"
            className="flex items-center gap-2 data-[state=active]:bg-eden-white/10"
          >
            <Calendar className="w-4 h-4" />
            <span className="hidden md:inline">Schedule</span>
          </TabsTrigger>
          
          <TabsTrigger 
            value="achievements"
            className="flex items-center gap-2 data-[state=active]:bg-eden-white/10"
          >
            <Trophy className="w-4 h-4" />
            <span className="hidden md:inline">Awards</span>
          </TabsTrigger>
          
          <TabsTrigger 
            value="integrations"
            className="flex items-center gap-2 data-[state=active]:bg-eden-white/10"
          >
            <Settings className="w-4 h-4" />
            <span className="hidden md:inline">Tools</span>
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="activity" className="space-y-6 animate-fade-in">
            <AgentActivity metrics={metrics || undefined} />
          </TabsContent>

          <TabsContent value="economy" className="space-y-6 animate-fade-in">
            <AgentEconomy metrics={metrics || undefined} />
          </TabsContent>

          <TabsContent value="checklist" className="space-y-6 animate-fade-in">
            <AgentChecklist checklist={checklist} />
          </TabsContent>

          <TabsContent value="metrics" className="space-y-6 animate-fade-in">
            <MetricsView />
          </TabsContent>

          <TabsContent value="schedule" className="space-y-6 animate-fade-in">
            <ScheduleView />
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6 animate-fade-in">
            <AchievementsView />
          </TabsContent>

          <TabsContent value="integrations" className="space-y-6 animate-fade-in">
            <IntegrationDashboard currentStage={currentStage} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

// Placeholder components for additional tabs
function MetricsView() {
  return (
    <Card className="terminal-box p-6">
      <h3 className="display-caps text-xl mb-4">PERFORMANCE METRICS</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'AVG CREATIONS/DAY', value: '7.3' },
          { label: 'ENGAGEMENT RATE', value: '84%' },
          { label: 'FOLLOWER GROWTH', value: '+127' },
          { label: 'CONVERSION RATE', value: '12%' },
        ].map((stat, i) => (
          <div key={i} className="terminal-box bg-eden-black/50 p-4">
            <div className="text-[10px] font-mono text-eden-gray mb-1">{stat.label}</div>
            <div className="text-2xl font-mono">{stat.value}</div>
          </div>
        ))}
      </div>
      <div className="mt-6 p-4 bg-eden-white/5 rounded-lg">
        <p className="text-sm text-eden-gray">
          Detailed performance analytics and trend analysis coming soon...
        </p>
      </div>
    </Card>
  );
}

function ScheduleView() {
  return (
    <Card className="terminal-box p-6">
      <h3 className="display-caps text-xl mb-4">TRAINING SCHEDULE</h3>
      <div className="space-y-3">
        {[
          { time: '09:00', task: 'Morning Creation Session', status: 'completed' },
          { time: '12:00', task: 'Community Engagement', status: 'completed' },
          { time: '15:00', task: 'Technical Practice', status: 'active' },
          { time: '18:00', task: 'Evening Showcase', status: 'upcoming' },
          { time: '21:00', task: 'Reflection & Planning', status: 'upcoming' },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-eden-white/5">
            <div className="font-mono text-xs text-eden-gray">{item.time}</div>
            <div className="flex-1">{item.task}</div>
            <div className={`text-xs font-mono ${
              item.status === 'completed' ? 'text-eden-white' :
              item.status === 'active' ? 'text-eden-white' :
              'text-eden-gray'
            }`}>
              {item.status.toUpperCase()}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function AchievementsView() {
  return (
    <Card className="terminal-box p-6">
      <h3 className="display-caps text-xl mb-4">ACHIEVEMENTS & AWARDS</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { icon: '🎨', name: 'First Creation', desc: 'Created first artwork', unlocked: true },
          { icon: '🔥', name: '7-Day Streak', desc: 'Daily creations for a week', unlocked: true },
          { icon: '💰', name: 'First Sale', desc: 'Sold first artwork', unlocked: true },
          { icon: '🌟', name: 'Rising Star', desc: '100+ followers', unlocked: false },
          { icon: '🏆', name: 'Top Creator', desc: 'Weekly leaderboard #1', unlocked: false },
          { icon: '🎯', name: 'Perfectionist', desc: '100% weekly goals', unlocked: false },
        ].map((achievement, i) => (
          <div 
            key={i} 
            className={`p-4 rounded-lg border ${
              achievement.unlocked 
                ? 'bg-eden-white/10 border-eden-white/30' 
                : 'bg-eden-white/5 border-eden-white/10 opacity-50'
            }`}
          >
            <div className="text-3xl mb-2">{achievement.icon}</div>
            <div className="text-sm font-medium">{achievement.name}</div>
            <div className="text-xs text-eden-gray mt-1">{achievement.desc}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}