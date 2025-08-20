'use client';

import { Twitter, Hash, Users, ExternalLink } from 'lucide-react';

interface SocialBarProps {
  agentName: string;
}

export function SocialBar({ agentName }: SocialBarProps) {
  const isAbraham = agentName === 'ABRAHAM';
  
  const social = isAbraham ? {
    twitter: 'abraham_ai',
    farcaster: 'abraham',
    discord: 'https://discord.gg/eden-abraham',
    lastPost: "Today's creation explores the boundary between faith and doubt"
  } : {
    twitter: 'solienne_ai',
    farcaster: 'solienne',
    discord: 'https://discord.gg/eden-solienne',
    lastPost: 'New physical print explores texture through algorithmic design'
  };

  return (
    <div className="border-y border-gray-800 bg-gray-950/50">
      <div className="max-w-6xl mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <a 
              href={`https://twitter.com/${social.twitter}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs text-gray-400 hover:text-white transition-colors"
            >
              <Twitter className="w-3 h-3" />
              <span>@{social.twitter}</span>
            </a>
            <a 
              href={`https://warpcast.com/${social.farcaster}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs text-gray-400 hover:text-white transition-colors"
            >
              <Hash className="w-3 h-3" />
              <span>/{social.farcaster}</span>
            </a>
            <a 
              href={social.discord}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs text-gray-400 hover:text-white transition-colors"
            >
              <Users className="w-3 h-3" />
              <span>Discord</span>
            </a>
          </div>
          <div className="hidden md:flex items-center gap-2 text-xs text-gray-500">
            <span className="text-gray-600">Latest:</span>
            <span className="italic">"{social.lastPost.substring(0, 50)}..."</span>
          </div>
        </div>
      </div>
    </div>
  );
}