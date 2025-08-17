'use client';

import { DailyMetrics } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Image, MessageSquare, Users, Zap, TrendingUp, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { safeToFixed, safeToInt } from '@/lib/utils/number';

interface AgentActivityProps {
  metrics?: DailyMetrics[];
}

export function AgentActivity({ metrics }: AgentActivityProps) {
  if (!metrics || metrics.length === 0) {
    return (
      <Card className="terminal-box">
        <CardContent className="py-12 text-center text-eden-gray">
          No activity data available yet
        </CardContent>
      </Card>
    );
  }

  // Generate activity feed from metrics
  const activities = metrics.slice(0, 14).map((metric, index) => {
    const date = new Date(metric.date);
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
    const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    
    // Generate different activity types based on the metrics
    const activities = [];
    
    if (metric.creationsCount > 0) {
      activities.push({
        type: 'creation',
        icon: Image,
        color: 'text-purple-400',
        title: `Created ${metric.creationsCount} artwork${metric.creationsCount > 1 ? 's' : ''}`,
        description: `Generated new pieces for the collection`,
        value: metric.creationsCount,
      });
    }
    
    if (metric.farcasterPosts > 0) {
      activities.push({
        type: 'social',
        icon: MessageSquare,
        color: 'text-blue-400',
        title: `Posted ${metric.farcasterPosts} update${metric.farcasterPosts > 1 ? 's' : ''}`,
        description: `Shared progress on Farcaster`,
        value: metric.farcasterPosts,
      });
    }
    
    if (metric.revenuePrimary > 0) {
      activities.push({
        type: 'revenue',
        icon: TrendingUp,
        color: 'text-green-400',
        title: `Earned $${safeToFixed(metric.revenuePrimary)}`,
        description: `Revenue from artwork sales`,
        value: metric.revenuePrimary,
      });
    }
    
    if (metric.vipCommit) {
      activities.push({
        type: 'vip',
        icon: Zap,
        color: 'text-yellow-400',
        title: 'VIP patron commit',
        description: 'Received support from VIP patron',
        value: 1,
      });
    }
    
    if (index === 0 && metric.engagementScore > 80) {
      activities.push({
        type: 'milestone',
        icon: Activity,
        color: 'text-pink-400',
        title: 'High engagement day',
        description: `Engagement score: ${safeToInt(metric.engagementScore)}`,
        value: metric.engagementScore,
      });
    }
    
    return {
      date,
      dayName,
      dateStr,
      activities,
      followers: metric.farcasterFollowers,
      engagement: metric.engagementScore,
    };
  }).filter(day => day.activities.length > 0);

  // Calculate weekly stats
  const weeklyStats = {
    totalCreations: metrics.slice(0, 7).reduce((sum, m) => sum + m.creationsCount, 0),
    totalPosts: metrics.slice(0, 7).reduce((sum, m) => sum + m.farcasterPosts, 0),
    avgEngagement: metrics.slice(0, 7).reduce((sum, m) => sum + m.engagementScore, 0) / 7,
    followerGrowth: metrics[0].farcasterFollowers - metrics[6].farcasterFollowers,
  };

  return (
    <div className="space-y-6">
      {/* Weekly Summary */}
      <Card className="terminal-box bg-gradient-to-br from-eden-white/5 to-eden-white/10">
        <CardHeader>
          <CardTitle className="display-caps text-lg">This Week</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs text-eden-gray">
                <Image className="w-3 h-3" />
                <span>Creations</span>
              </div>
              <p className="font-mono text-xl">{weeklyStats.totalCreations}</p>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs text-eden-gray">
                <MessageSquare className="w-3 h-3" />
                <span>Posts</span>
              </div>
              <p className="font-mono text-xl">{weeklyStats.totalPosts}</p>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs text-eden-gray">
                <Activity className="w-3 h-3" />
                <span>Engagement</span>
              </div>
              <p className="font-mono text-xl">{safeToInt(weeklyStats.avgEngagement)}</p>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs text-eden-gray">
                <Users className="w-3 h-3" />
                <span>New Followers</span>
              </div>
              <p className={cn(
                "font-mono text-xl",
                weeklyStats.followerGrowth > 0 ? "text-green-400" : ""
              )}>
                +{weeklyStats.followerGrowth}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activity Feed */}
      <Card className="terminal-box">
        <CardHeader>
          <CardTitle className="display-caps text-lg">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activities.map((day, dayIndex) => (
              <div key={dayIndex} className="space-y-3">
                {/* Date Header */}
                <div className="flex items-center gap-2 text-xs text-eden-gray">
                  <Calendar className="w-3 h-3" />
                  <span>{day.dayName}, {day.dateStr}</span>
                  <div className="flex-1 h-px bg-eden-white/10" />
                  <span className="font-mono">{day.followers} followers</span>
                </div>
                
                {/* Activities for the day */}
                <div className="space-y-2 pl-5">
                  {day.activities.map((activity, actIndex) => {
                    const Icon = activity.icon;
                    return (
                      <div 
                        key={actIndex}
                        className="flex items-start gap-3 p-2 rounded-lg bg-eden-white/5 hover:bg-eden-white/10 transition-colors"
                      >
                        <div className={cn(
                          "p-1.5 rounded-md bg-eden-black/50",
                          activity.color
                        )}>
                          <Icon className="w-4 h-4" />
                        </div>
                        
                        <div className="flex-1 space-y-0.5">
                          <h4 className="text-sm font-medium text-eden-white">
                            {activity.title}
                          </h4>
                          <p className="text-xs text-eden-gray">
                            {activity.description}
                          </p>
                        </div>
                        
                        {activity.type === 'revenue' && (
                          <span className="text-sm font-mono text-green-400">
                            +${safeToFixed(activity.value)}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}