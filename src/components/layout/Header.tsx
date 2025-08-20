'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSync, useSyncStatus } from '@/hooks/use-sync';
import { RefreshCw, Terminal } from 'lucide-react';

export function Header() {
  const { syncAll } = useSync();
  const { data: syncStatus } = useSyncStatus();
  const pathname = usePathname();
  
  const isSyncing = syncStatus?.services && 
    Object.values(syncStatus.services).some(s => s.status === 'syncing');

  return (
    <header className="border-b border-eden-white/20 bg-eden-black/90 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <Terminal className="w-5 h-5" />
              <span className="display-caps text-lg">Eden</span>
            </Link>
            
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => syncAll.mutate()}
              disabled={syncAll.isPending || isSyncing}
              className="p-2 hover:bg-eden-white/10 rounded transition-all disabled:opacity-50"
              title="Sync all data"
            >
              <RefreshCw 
                className={`w-4 h-4 ${(syncAll.isPending || isSyncing) ? 'animate-spin' : ''}`} 
              />
            </button>
            
            <Link 
              href="https://app.eden.art/" 
              target="_blank"
              className="px-4 py-2 border border-eden-white/20 hover:border-eden-white hover:bg-eden-white/5 transition-all text-sm"
            >
              Eden App
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}