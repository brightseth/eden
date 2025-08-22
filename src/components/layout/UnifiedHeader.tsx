'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AboutDropdown } from './AboutDropdown';
import { AgentSwitcher } from '@/components/agent-switcher/AgentSwitcher';

export function UnifiedHeader() {
  const pathname = usePathname();
  const isInboxActive = pathname === '/inbox';
  const isUploadActive = pathname === '/upload';
  const isCritiquesActive = pathname === '/critiques';
  
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
            <Link 
              href="/upload" 
              className={`hover:text-gray-300 transition-colors text-sm ${
                isUploadActive ? 'text-white font-semibold' : 'text-gray-400'
              }`}
            >
              UPLOAD
            </Link>
            <Link 
              href="/inbox" 
              className={`hover:text-gray-300 transition-colors text-sm ${
                isInboxActive ? 'text-white font-semibold' : 'text-gray-400'
              }`}
            >
              INBOX
            </Link>
            <Link 
              href="/critiques" 
              className={`hover:text-gray-300 transition-colors text-sm ${
                isCritiquesActive ? 'text-white font-semibold' : 'text-gray-400'
              }`}
            >
              CRITIQUES
            </Link>
            <AboutDropdown />
            <a 
              href="https://app.eden.art" 
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-1.5 border border-gray-600 hover:border-white transition-colors text-sm"
            >
              LOG IN →
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}