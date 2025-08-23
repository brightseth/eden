'use client';

import { ReactNode } from 'react';

interface GlowingCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: string;
}

export function GlowingCard({ children, className = '', glowColor = 'purple' }: GlowingCardProps) {
  const glowColors = {
    purple: 'from-purple-600/20 via-pink-600/20 to-purple-600/20',
    green: 'from-green-600/20 via-emerald-600/20 to-green-600/20',
    blue: 'from-blue-600/20 via-cyan-600/20 to-blue-600/20',
    pink: 'from-pink-600/20 via-rose-600/20 to-pink-600/20'
  };

  return (
    <div className={`relative group ${className}`}>
      {/* Animated glow effect */}
      <div className={`absolute -inset-0.5 bg-gradient-to-r ${glowColors[glowColor as keyof typeof glowColors]} rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-gradient-xy`} />
      
      {/* Glass effect container */}
      <div className="relative bg-black/50 backdrop-blur-xl rounded-xl border border-white/10 overflow-hidden">
        {/* Inner gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
        
        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>
      </div>
    </div>
  );
}