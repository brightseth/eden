'use client';

import { Wallet, Grid, Info, Users, Settings } from 'lucide-react';

interface MobileNavProps {
  activeTab: string;
  onTabChange: (tab: 'collect' | 'portfolio' | 'about' | 'community' | 'tools') => void;
}

export function MobileNav({ activeTab, onTabChange }: MobileNavProps) {
  const tabs = [
    { id: 'collect' as const, label: 'Collect', icon: Wallet },
    { id: 'portfolio' as const, label: 'Portfolio', icon: Grid },
    { id: 'about' as const, label: 'About', icon: Info },
    { id: 'community' as const, label: 'Community', icon: Users },
    { id: 'tools' as const, label: 'Creator', icon: Settings },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-black border-t border-gray-800">
      <div className="flex items-center justify-around h-16">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={`flex flex-col items-center justify-center flex-1 h-full px-2 transition-colors ${
              activeTab === id
                ? 'bg-white text-black'
                : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            <Icon className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}