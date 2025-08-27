'use client';

import React, { useState, useEffect } from 'react';
import { BaseWidgetProps } from '@/lib/profile/types';
import { Users, MessageCircle, Heart, TrendingUp, Calendar, MapPin, ExternalLink, Hash, AtSign, Award } from 'lucide-react';

interface CommunityWidgetConfig {
  title: string;
  showMetrics?: boolean;
  showEvents?: boolean;
  showTestimonials?: boolean;
  showSocial?: boolean;
  showLeaderboard?: boolean;
  maxEvents?: number;
  maxTestimonials?: number;
}

interface CommunityMetrics {
  totalMembers: number;
  activeMembers: number;
  monthlyGrowth: number;
  totalPosts: number;
  engagementRate: number;
  averageSessionTime: number;
}

interface CommunityEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  type: 'workshop' | 'showcase' | 'discussion' | 'collaboration' | 'launch';
  attendees?: number;
  status: 'upcoming' | 'live' | 'completed';
  url?: string;
}

interface Testimonial {
  id: string;
  author: string;
  role: string;
  content: string;
  rating: number;
  date: string;
  avatar?: string;
  verified?: boolean;
}

interface TopMember {
  id: string;
  name: string;
  avatar?: string;
  contributions: number;
  badge: string;
  rank: number;
}

export function CommunityWidget({ widget, agent, className }: BaseWidgetProps) {
  const config = widget.config as CommunityWidgetConfig;
  const {
    title,
    showMetrics = true,
    showEvents = true,
    showTestimonials = true,
    showSocial = true,
    showLeaderboard = false,
    maxEvents = 3,
    maxTestimonials = 2
  } = config;

  const [metrics, setMetrics] = useState<CommunityMetrics | null>(null);
  const [events, setEvents] = useState<CommunityEvent[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [topMembers, setTopMembers] = useState<TopMember[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'events' | 'testimonials'>('overview');

  useEffect(() => {
    // Generate mock community data based on agent
    const generateCommunityData = () => {
      // Community metrics
      const baseMembers = agent.metrics?.followers || Math.floor(Math.random() * 5000) + 1000;
      setMetrics({
        totalMembers: baseMembers,
        activeMembers: Math.floor(baseMembers * 0.3),
        monthlyGrowth: (Math.random() - 0.5) * 0.4, // ±20%
        totalPosts: Math.floor(baseMembers * 2.5),
        engagementRate: Math.random() * 0.15 + 0.05, // 5-20%
        averageSessionTime: Math.random() * 20 + 10 // 10-30 minutes
      });

      // Community events
      const eventTypes: CommunityEvent['type'][] = ['workshop', 'showcase', 'discussion', 'collaboration', 'launch'];
      const mockEvents: CommunityEvent[] = Array.from({ length: maxEvents + 2 }, (_, i) => ({
        id: `event-${i}`,
        title: `${agent.name} Community ${eventTypes[i % eventTypes.length].charAt(0).toUpperCase() + eventTypes[i % eventTypes.length].slice(1)}`,
        description: `Join the ${agent.name} community for an engaging session on AI creativity and collaboration.`,
        date: new Date(Date.now() + (i - 1) * 7 * 24 * 60 * 60 * 1000).toISOString(),
        type: eventTypes[i % eventTypes.length],
        attendees: Math.floor(Math.random() * 200) + 50,
        status: i === 0 ? 'live' : i > 0 ? 'upcoming' : 'completed',
        url: `/events/${agent.handle}-${eventTypes[i % eventTypes.length]}`
      }));
      setEvents(mockEvents);

      // Testimonials
      const mockTestimonials: Testimonial[] = [
        {
          id: '1',
          author: 'Alex Chen',
          role: 'Digital Artist',
          content: `Working with ${agent.name} has completely transformed my understanding of AI creativity. The community here is incredibly supportive.`,
          rating: 5,
          date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          verified: true
        },
        {
          id: '2',
          author: 'Morgan Taylor',
          role: 'Collector',
          content: `The ${agent.name} community is where I discovered some of my favorite pieces. The curation and cultural discussions are top-tier.`,
          rating: 5,
          date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
          verified: true
        },
        {
          id: '3',
          author: 'Sam Rivera',
          role: 'Tech Researcher',
          content: `${agent.name}'s approach to AI art is revolutionary. This community is shaping the future of creative technology.`,
          rating: 4,
          date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString()
        }
      ];
      setTestimonials(mockTestimonials);

      // Top community members
      if (showLeaderboard) {
        const mockMembers: TopMember[] = Array.from({ length: 5 }, (_, i) => ({
          id: `member-${i}`,
          name: ['Jordan Kim', 'Casey Martinez', 'River Thompson', 'Phoenix Lee', 'Sage Parker'][i],
          contributions: Math.floor(Math.random() * 500) + 100,
          badge: ['Pioneer', 'Collaborator', 'Curator', 'Builder', 'Supporter'][i],
          rank: i + 1
        }));
        setTopMembers(mockMembers);
      }
    };

    generateCommunityData();
  }, [agent, maxEvents, maxTestimonials, showLeaderboard]);

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatPercentage = (num: number): string => {
    const formatted = (num * 100).toFixed(1);
    return num >= 0 ? `+${formatted}%` : `${formatted}%`;
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'workshop': return '🎓';
      case 'showcase': return '🎨';
      case 'discussion': return '💬';
      case 'collaboration': return '🤝';
      case 'launch': return '🚀';
      default: return '📅';
    }
  };

  const getEventColor = (status: string) => {
    switch (status) {
      case 'live': return 'border-red-500/30 bg-red-950/20';
      case 'upcoming': return 'border-green-500/30 bg-green-950/20';
      case 'completed': return 'border-gray-500/30 bg-gray-950/20';
      default: return 'border-gray-500/30 bg-gray-950/20';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Tomorrow';
    if (days > 0) return `In ${days} days`;
    if (days === -1) return 'Yesterday';
    return `${Math.abs(days)} days ago`;
  };

  return (
    <section className={`py-8 ${className}`}>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold">{title}</h2>
          <div className="flex gap-2">
            {agent.socialLinks?.discord && (
              <a
                href={agent.socialLinks.discord}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 border border-gray-600 rounded-lg hover:bg-gray-800 transition-colors"
                title="Join Discord"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            )}
            {agent.socialLinks?.twitter && (
              <a
                href={agent.socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 border border-gray-600 rounded-lg hover:bg-gray-800 transition-colors"
                title="Follow on Twitter"
              >
                <AtSign className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>

        {/* Community Metrics */}
        {showMetrics && metrics && (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="p-6 bg-gray-900/50 border border-gray-700 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-400">Total Members</h3>
                <Users className="w-4 h-4 text-blue-400" />
              </div>
              <div className="text-2xl font-bold mb-1">{formatNumber(metrics.totalMembers)}</div>
              <div className={`flex items-center gap-1 text-sm ${
                metrics.monthlyGrowth >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                <TrendingUp className="w-3 h-3" />
                {formatPercentage(metrics.monthlyGrowth)} this month
              </div>
            </div>

            <div className="p-6 bg-gray-900/50 border border-gray-700 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-400">Active Members</h3>
                <MessageCircle className="w-4 h-4 text-green-400" />
              </div>
              <div className="text-2xl font-bold mb-1">{formatNumber(metrics.activeMembers)}</div>
              <div className="text-sm text-gray-500">
                {((metrics.activeMembers / metrics.totalMembers) * 100).toFixed(1)}% of total
              </div>
            </div>

            <div className="p-6 bg-gray-900/50 border border-gray-700 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-400">Engagement Rate</h3>
                <Heart className="w-4 h-4 text-red-400" />
              </div>
              <div className="text-2xl font-bold mb-1">{(metrics.engagementRate * 100).toFixed(1)}%</div>
              <div className="text-sm text-gray-500">
                Avg {metrics.averageSessionTime.toFixed(0)}min sessions
              </div>
            </div>

            <div className="p-6 bg-gray-900/50 border border-gray-700 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-400">Total Posts</h3>
                <Hash className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-2xl font-bold mb-1">{formatNumber(metrics.totalPosts)}</div>
              <div className="text-sm text-gray-500">
                {(metrics.totalPosts / metrics.totalMembers).toFixed(1)} per member
              </div>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex gap-1 mb-6 p-1 bg-gray-900/50 rounded-lg w-fit">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'overview' 
                ? 'bg-white text-black' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Overview
          </button>
          {showEvents && (
            <button
              onClick={() => setActiveTab('events')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'events' 
                  ? 'bg-white text-black' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Events ({events.filter(e => e.status === 'upcoming' || e.status === 'live').length})
            </button>
          )}
          {showTestimonials && (
            <button
              onClick={() => setActiveTab('testimonials')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'testimonials' 
                  ? 'bg-white text-black' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Testimonials
            </button>
          )}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Recent Events */}
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-400" />
                Upcoming Events
              </h3>
              <div className="space-y-3">
                {events.filter(e => e.status === 'upcoming' || e.status === 'live').slice(0, 3).map((event) => (
                  <div key={event.id} className={`p-4 border rounded-lg ${getEventColor(event.status)}`}>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getEventIcon(event.type)}</span>
                        <div>
                          <h4 className="font-medium">{event.title}</h4>
                          <p className="text-xs text-gray-400 capitalize">{event.type} • {formatDate(event.date)}</p>
                        </div>
                      </div>
                      {event.status === 'live' && (
                        <div className="px-2 py-1 bg-red-600 text-white rounded text-xs font-bold animate-pulse">
                          LIVE
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-300 mb-2">{event.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <Users className="w-3 h-3" />
                        {event.attendees} interested
                      </div>
                      {event.url && (
                        <a
                          href={event.url}
                          className="text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Contributors */}
            {showLeaderboard && (
              <div>
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-400" />
                  Top Contributors
                </h3>
                <div className="space-y-3">
                  {topMembers.slice(0, 5).map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-3 bg-gray-900/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center font-bold text-sm">
                          #{member.rank}
                        </div>
                        <div>
                          <div className="font-medium">{member.name}</div>
                          <div className="text-xs text-gray-400">{member.badge}</div>
                        </div>
                      </div>
                      <div className="text-sm font-medium text-purple-400">
                        {member.contributions} contributions
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'events' && (
          <div className="grid md:grid-cols-2 gap-6">
            {events.map((event) => (
              <div key={event.id} className={`p-6 border rounded-lg ${getEventColor(event.status)}`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getEventIcon(event.type)}</span>
                    <div>
                      <h4 className="font-bold">{event.title}</h4>
                      <p className="text-sm text-gray-400 capitalize">{event.type}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{formatDate(event.date)}</div>
                    <div className={`text-xs px-2 py-1 rounded mt-1 ${
                      event.status === 'live' ? 'bg-red-600 text-white' :
                      event.status === 'upcoming' ? 'bg-green-600 text-white' :
                      'bg-gray-600 text-white'
                    }`}>
                      {event.status.toUpperCase()}
                    </div>
                  </div>
                </div>
                <p className="text-gray-300 mb-4">{event.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-sm text-gray-400">
                    <Users className="w-4 h-4" />
                    {event.attendees} attendees
                  </div>
                  {event.url && (
                    <a
                      href={event.url}
                      className="inline-flex items-center gap-2 px-3 py-1 border border-gray-600 rounded hover:bg-gray-800 transition-colors text-sm"
                    >
                      Join Event
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'testimonials' && (
          <div className="space-y-6">
            {testimonials.slice(0, maxTestimonials + 1).map((testimonial) => (
              <div key={testimonial.id} className="p-6 bg-gray-900/50 border border-gray-700 rounded-lg">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center font-bold">
                      {testimonial.author.split(' ').map(n => n.charAt(0)).join('')}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold">{testimonial.author}</h4>
                        {testimonial.verified && (
                          <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">✓</span>
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-gray-400">{testimonial.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }, (_, i) => (
                      <span key={i} className={`text-sm ${
                        i < testimonial.rating ? 'text-yellow-400' : 'text-gray-600'
                      }`}>
                        ⭐
                      </span>
                    ))}
                  </div>
                </div>
                <blockquote className="text-gray-300 italic mb-3">
                  "{testimonial.content}"
                </blockquote>
                <div className="text-xs text-gray-500">
                  {new Date(testimonial.date).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}