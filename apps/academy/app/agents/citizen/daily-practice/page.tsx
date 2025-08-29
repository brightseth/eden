'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Calendar, CheckCircle, Clock, Target, Users, Zap } from 'lucide-react';
import { UnifiedHeader } from '@/components/layout/UnifiedHeader';

interface DailyActivity {
  category: string;
  activity: string;
  time_commitment: string;
  impact: string;
  focus?: string;
}

interface WeeklyGoal {
  goal: string;
  target: string;
  progress: string;
  deadline: string;
}

interface DailyPracticeData {
  success: boolean;
  agent: string;
  date: string;
  protocol: {
    name: string;
    motto: string;
    philosophy: string;
    commitment: string;
    core_pillars: Array<{
      pillar: string;
      description: string;
      practices: string[];
    }>;
  };
  daily_activities: DailyActivity[];
  weekly_goals: WeeklyGoal[];
  governance_metrics: {
    active_proposals: number;
    total_voters_this_week: number;
    governance_participation_rate: string;
    community_sentiment: string;
    full_set_holder_participation: string;
    ultra_set_holder_participation: string;
    cross_city_discussion_threads: number;
  };
  ritual_status: {
    lore_preservation: {
      cities_documented: number;
      cultural_artifacts_archived: number;
      ceremony_stories_recorded: number;
      completion_rate: string;
    };
    governance_participation: {
      proposals_reviewed_this_week: number;
      community_discussions_facilitated: number;
      consensus_building_sessions: number;
      voting_participation_rate: string;
    };
    community_celebration: {
      milestones_celebrated_this_month: number;
      new_holders_welcomed: number;
      cross_city_connections_made: number;
      fellowship_engagement_score: number;
    };
  };
  bright_moments_calendar: {
    next_governance_call: string;
    upcoming_irl_events: Array<{
      type: string;
      location: string;
      date: string;
      significance: string;
    }>;
    cultural_observances: string[];
  };
  community_insights: string[];
  inspiration: {
    daily_reflection: string;
    bright_moments_wisdom: string;
    community_spotlight: string;
  };
}

export default function CitizenDailyPracticePage() {
  const [practiceData, setPracticeData] = useState<DailyPracticeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    async function fetchDailyPractice() {
      try {
        const response = await fetch(`/api/agents/citizen/daily-practice?date=${selectedDate}`);
        if (!response.ok) throw new Error('Failed to fetch');
        
        const data = await response.json();
        setPracticeData(data);
      } catch (error) {
        console.error('Failed to load daily practice:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchDailyPractice();
  }, [selectedDate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <UnifiedHeader />
        <div className="max-w-6xl mx-auto px-6 py-16 text-center">
          <div className="text-xl">Loading CITIZEN's Daily Practice...</div>
        </div>
      </div>
    );
  }

  if (!practiceData) {
    return (
      <div className="min-h-screen bg-black text-white">
        <UnifiedHeader />
        <div className="max-w-6xl mx-auto px-6 py-16 text-center">
          <div className="text-xl text-red-400">Failed to load daily practice data</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <UnifiedHeader />
      
      {/* Back Navigation */}
      <div className="border-b border-white">
        <div className="max-w-6xl mx-auto px-6 py-3">
          <Link 
            href="/academy/agent/citizen" 
            className="inline-flex items-center gap-2 text-sm hover:bg-white hover:text-black px-2 py-1 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            BACK TO CITIZEN
          </Link>
        </div>
      </div>

      {/* Header */}
      <div className="border-b border-white">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="text-center">
            <h1 className="text-6xl mb-4">CITIZEN'S DAILY PRACTICE</h1>
            <p className="text-2xl mb-4">{practiceData.protocol.name}</p>
            <p className="text-lg text-blue-400 mb-8">{practiceData.protocol.motto}</p>
            <div className="flex justify-center items-center gap-4">
              <Calendar className="w-5 h-5" />
              <span className="text-xl">{new Date(practiceData.date).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        
        {/* Philosophy & Commitment */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl mb-4">STEWARDSHIP PHILOSOPHY</h2>
            <p className="text-lg text-gray-300 max-w-4xl mx-auto">{practiceData.protocol.philosophy}</p>
            <p className="text-lg mt-4">{practiceData.protocol.commitment}</p>
          </div>
        </section>

        {/* Daily Activities */}
        <section className="mb-16">
          <h2 className="text-3xl mb-8">TODAY'S ACTIVITIES</h2>
          <div className="grid gap-6">
            {practiceData.daily_activities.map((activity, index) => (
              <div key={index} className="border border-white p-6 hover:bg-white hover:text-black transition-all group">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="text-sm text-gray-400 group-hover:text-gray-600 mb-1">{activity.category}</div>
                    <h3 className="text-xl font-bold mb-2">{activity.activity}</h3>
                    {activity.focus && (
                      <div className="text-sm text-blue-400 group-hover:text-blue-600 mb-2">Focus: {activity.focus}</div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400 group-hover:text-gray-600">
                    <Clock className="w-4 h-4" />
                    {activity.time_commitment}
                  </div>
                </div>
                <p className="text-gray-300 group-hover:text-gray-700">{activity.impact}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Weekly Goals */}
        <section className="mb-16">
          <h2 className="text-3xl mb-8">WEEKLY GOALS</h2>
          <div className="grid gap-6">
            {practiceData.weekly_goals.map((goal, index) => (
              <div key={index} className="border border-white p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">{goal.goal}</h3>
                    <p className="text-lg mb-2">{goal.target}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <Target className="w-4 h-4" />
                      Deadline: {goal.deadline}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-400 mb-1">{goal.progress}</div>
                    <div className="text-xs text-gray-400">PROGRESS</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Governance Metrics */}
        <section className="mb-16">
          <h2 className="text-3xl mb-8">GOVERNANCE METRICS</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="border border-white p-6 text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">{practiceData.governance_metrics.active_proposals}</div>
              <div className="text-sm text-gray-400">ACTIVE PROPOSALS</div>
            </div>
            <div className="border border-white p-6 text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">{practiceData.governance_metrics.total_voters_this_week}</div>
              <div className="text-sm text-gray-400">VOTERS THIS WEEK</div>
            </div>
            <div className="border border-white p-6 text-center">
              <div className="text-3xl font-bold text-yellow-400 mb-2">{practiceData.governance_metrics.governance_participation_rate}</div>
              <div className="text-sm text-gray-400">PARTICIPATION RATE</div>
            </div>
            <div className="border border-white p-6 text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">{practiceData.governance_metrics.full_set_holder_participation}</div>
              <div className="text-sm text-gray-400">FULL SET HOLDERS</div>
            </div>
            <div className="border border-white p-6 text-center">
              <div className="text-3xl font-bold text-pink-400 mb-2">{practiceData.governance_metrics.ultra_set_holder_participation}</div>
              <div className="text-sm text-gray-400">ULTRA SET HOLDERS</div>
            </div>
            <div className="border border-white p-6 text-center">
              <div className="text-3xl font-bold text-cyan-400 mb-2">{practiceData.governance_metrics.cross_city_discussion_threads}</div>
              <div className="text-sm text-gray-400">DISCUSSION THREADS</div>
            </div>
          </div>
        </section>

        {/* Community Insights & Inspiration */}
        <section className="mb-16">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-3xl mb-6">COMMUNITY INSIGHTS</h2>
              <ul className="space-y-3">
                {practiceData.community_insights.map((insight, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Zap className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">{insight}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h2 className="text-3xl mb-6">DAILY INSPIRATION</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold mb-2 text-blue-400">DAILY REFLECTION</h3>
                  <p className="text-gray-300">{practiceData.inspiration.daily_reflection}</p>
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2 text-green-400">BRIGHT MOMENTS WISDOM</h3>
                  <p className="text-gray-300">{practiceData.inspiration.bright_moments_wisdom}</p>
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2 text-yellow-400">COMMUNITY SPOTLIGHT</h3>
                  <p className="text-gray-300">{practiceData.inspiration.community_spotlight}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Core Pillars */}
        <section className="mb-16">
          <h2 className="text-3xl mb-8">CORE PILLARS OF STEWARDSHIP</h2>
          <div className="grid gap-8">
            {practiceData.protocol.core_pillars.map((pillar, index) => (
              <div key={index} className="border border-white p-6">
                <h3 className="text-2xl font-bold mb-4 text-blue-400">{pillar.pillar}</h3>
                <p className="text-lg mb-6">{pillar.description}</p>
                <div className="grid md:grid-cols-2 gap-4">
                  {pillar.practices.map((practice, practiceIndex) => (
                    <div key={practiceIndex} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">{practice}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}