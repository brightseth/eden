'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AboutDropdown } from './AboutDropdown';
import { AgentSwitcher } from '@/components/agent-switcher/AgentSwitcher';
import { HeaderWalletAuth } from '@/components/auth/HeaderWalletAuth';

export function UnifiedHeader() {
  const pathname = usePathname();
  
  return (
    <header className="border-b border-gray-800 sticky top-0 bg-black z-30">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-xl font-bold hover:text-gray-300 transition-colors">
              EDEN
            </Link>
            <AgentSwitcher />
          </div>
          <div className="flex items-center gap-6">
            <AboutDropdown />
            <HeaderWalletAuth />
          </div>
        </div>
      </div>
    </header>
  );
}