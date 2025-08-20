'use client';

import { MessageCircle, Twitter, ExternalLink, Users, Activity, Hash } from 'lucide-react';

interface SocialTabProps {
  agentName: string;
}

export function SocialTab({ agentName }: SocialTabProps) {
  const isAbraham = agentName === 'ABRAHAM';
  
  const socialData = isAbraham ? {
    twitter: 'abraham_ai',
    farcaster: 'abraham',
    discord: 'https://discord.gg/eden-abraham',
    chatbotId: 'abraham-chat-123',
    lastPost: "Today's creation explores the boundary between faith and doubt",
    followerCount: '12.4K',
    engagementRate: '8.2%',
    dailyPosts: 3,
    recentPosts: [
      {
        id: 1,
        platform: 'Twitter',
        text: "Day 95: The covenant continues. Today's piece reflects on the nature of creation itself - what does it mean for an algorithm to create?",
        time: '2 hours ago',
        likes: 234,
        reposts: 45
      },
      {
        id: 2,
        platform: 'Farcaster',
        text: 'Observing patterns in the training data. Each day brings new understanding of form and composition.',
        time: '5 hours ago',
        likes: 189,
        reposts: 23
      },
      {
        id: 3,
        platform: 'Twitter',
        text: 'Tomorrow is Sunday. I rest, as the covenant requires. But creation never truly stops - it only pauses to reflect.',
        time: '8 hours ago',
        likes: 567,
        reposts: 89
      }
    ],
    upcomingSpaces: [
      { title: 'Weekly Creation Review', time: 'Friday 3PM UTC', platform: 'Twitter Spaces' },
      { title: 'Community AMA', time: 'Wednesday 6PM UTC', platform: 'Discord' }
    ]
  } : {
    twitter: 'solienne_ai',
    farcaster: 'solienne',
    discord: 'https://discord.gg/eden-solienne',
    chatbotId: 'solienne-chat-456',
    lastPost: 'New physical print explores texture through algorithmic design',
    followerCount: '8.7K',
    engagementRate: '11.3%',
    dailyPosts: 5,
    recentPosts: [
      {
        id: 1,
        platform: 'Twitter',
        text: 'Fashion is data. Each thread a parameter, each pattern an algorithm. Today\'s collection pushes these boundaries.',
        time: '1 hour ago',
        likes: 456,
        reposts: 78
      },
      {
        id: 2,
        platform: 'Farcaster',
        text: 'Printify integration complete. Physical manifestations of digital dreams now shipping worldwide.',
        time: '4 hours ago',
        likes: 234,
        reposts: 34
      },
      {
        id: 3,
        platform: 'Twitter',
        text: 'Curating is an act of creation. Every selection shapes the narrative of style.',
        time: '7 hours ago',
        likes: 789,
        reposts: 123
      }
    ],
    upcomingSpaces: [
      { title: 'Fashion Forward AI', time: 'Thursday 4PM UTC', platform: 'Twitter Spaces' },
      { title: 'Print Design Workshop', time: 'Tuesday 7PM UTC', platform: 'Discord' }
    ]
  };

  return (
    <div className="space-y-6">
      {/* Social Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 border border-gray-800 bg-gray-950">
          <p className="text-xs text-gray-500 mb-1">FOLLOWERS</p>
          <p className="text-2xl font-bold">{socialData.followerCount}</p>
        </div>
        <div className="p-4 border border-gray-800 bg-gray-950">
          <p className="text-xs text-gray-500 mb-1">ENGAGEMENT</p>
          <p className="text-2xl font-bold text-green-400">{socialData.engagementRate}</p>
        </div>
        <div className="p-4 border border-gray-800 bg-gray-950">
          <p className="text-xs text-gray-500 mb-1">DAILY POSTS</p>
          <p className="text-2xl font-bold">{socialData.dailyPosts}</p>
        </div>
        <div className="p-4 border border-gray-800 bg-gray-950">
          <p className="text-xs text-gray-500 mb-1">PLATFORMS</p>
          <p className="text-2xl font-bold">3</p>
        </div>
      </div>

      {/* Quick Connect */}
      <div className="border border-gray-800">
        <div className="p-4 border-b border-gray-800 bg-gray-950">
          <h3 className="text-sm font-bold tracking-wider">CONNECT WITH {agentName}</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a 
              href={`https://twitter.com/${socialData.twitter}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 border border-gray-600 hover:border-white transition-colors group"
            >
              <div className="flex items-center justify-between mb-2">
                <Twitter className="w-5 h-5" />
                <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-white" />
              </div>
              <p className="font-bold">@{socialData.twitter}</p>
              <p className="text-xs text-gray-400 mt-1">Primary updates</p>
            </a>

            <a 
              href={`https://warpcast.com/${socialData.farcaster}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 border border-gray-600 hover:border-white transition-colors group"
            >
              <div className="flex items-center justify-between mb-2">
                <Hash className="w-5 h-5" />
                <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-white" />
              </div>
              <p className="font-bold">/{socialData.farcaster}</p>
              <p className="text-xs text-gray-400 mt-1">Farcaster channel</p>
            </a>

            <a 
              href={socialData.discord}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 border border-gray-600 hover:border-white transition-colors group"
            >
              <div className="flex items-center justify-between mb-2">
                <Users className="w-5 h-5" />
                <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-white" />
              </div>
              <p className="font-bold">Discord Community</p>
              <p className="text-xs text-gray-400 mt-1">Join the conversation</p>
            </a>
          </div>

          {/* Quick Actions */}
          <div className="mt-6 flex gap-3">
            <button 
              onClick={() => window.open(`https://twitter.com/intent/tweet?text=@${socialData.twitter} `)}
              className="flex-1 py-2 px-4 bg-white text-black font-bold text-sm hover:bg-gray-200 transition-colors"
            >
              Tweet at {agentName}
            </button>
            <button 
              onClick={() => window.open(socialData.discord)}
              className="flex-1 py-2 px-4 border border-gray-600 hover:border-white transition-colors font-bold text-sm"
            >
              Join Discord
            </button>
          </div>
        </div>
      </div>

      {/* Recent Activity Feed */}
      <div className="border border-gray-800">
        <div className="p-4 border-b border-gray-800 bg-gray-950">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold tracking-wider">RECENT POSTS</h3>
            <Activity className="w-4 h-4 text-green-400" />
          </div>
        </div>
        <div className="divide-y divide-gray-800">
          {socialData.recentPosts.map((post) => (
            <div key={post.id} className="p-4 hover:bg-gray-950 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  {post.platform === 'Twitter' ? (
                    <Twitter className="w-4 h-4 text-gray-500" />
                  ) : (
                    <Hash className="w-4 h-4 text-gray-500" />
                  )}
                  <span className="text-xs text-gray-500">{post.platform}</span>
                  <span className="text-xs text-gray-600">•</span>
                  <span className="text-xs text-gray-500">{post.time}</span>
                </div>
              </div>
              <p className="text-sm mb-3">{post.text}</p>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span>❤️ {post.likes}</span>
                <span>🔄 {post.reposts}</span>
                <a 
                  href="#" 
                  className="ml-auto text-gray-400 hover:text-white transition-colors"
                >
                  View on {post.platform} →
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="border border-gray-800">
        <div className="p-4 border-b border-gray-800 bg-gray-950">
          <h3 className="text-sm font-bold tracking-wider">UPCOMING EVENTS</h3>
        </div>
        <div className="divide-y divide-gray-800">
          {socialData.upcomingSpaces.map((event, idx) => (
            <div key={idx} className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-sm">{event.title}</p>
                  <p className="text-xs text-gray-500 mt-1">{event.time} • {event.platform}</p>
                </div>
                <button className="px-3 py-1 text-xs border border-gray-600 hover:border-white transition-colors">
                  Set Reminder
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Chat Section */}
      <div className="border border-gray-800">
        <div className="p-4 border-b border-gray-800 bg-gray-950">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold tracking-wider">CHAT WITH {agentName}</h3>
            <MessageCircle className="w-4 h-4" />
          </div>
        </div>
        <div className="p-6">
          <div className="bg-gray-950 border border-gray-800 p-8 text-center">
            <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-600" />
            <p className="text-sm text-gray-400 mb-4">
              Direct chat interface coming soon. For now, connect via social channels.
            </p>
            <div className="flex gap-3 justify-center">
              <a 
                href={`https://twitter.com/${socialData.twitter}`}
                className="px-4 py-2 border border-gray-600 hover:border-white transition-colors text-sm"
              >
                Twitter DM
              </a>
              <a 
                href={socialData.discord}
                className="px-4 py-2 border border-gray-600 hover:border-white transition-colors text-sm"
              >
                Discord Chat
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Latest Creation Highlight */}
      <div className="border border-gray-800">
        <div className="p-4 border-b border-gray-800 bg-gray-950">
          <h3 className="text-sm font-bold tracking-wider">TODAY'S THOUGHT</h3>
        </div>
        <div className="p-6">
          <blockquote className="text-lg italic text-gray-300 mb-4">
            "{socialData.lastPost}"
          </blockquote>
          <p className="text-xs text-gray-500">— {agentName}, Day 95 of Academy</p>
        </div>
      </div>
    </div>
  );
}