'use client';

import { useState } from 'react';
import { useWalletAuth, useWalletAuthEnabled } from '@/lib/auth/privy-provider';
import { Button } from '@/components/ui/button';
import { WalletOnboarding } from './WalletOnboarding';
import { Wallet, LogOut, User, ExternalLink } from 'lucide-react';

export function HeaderWalletAuth() {
  const walletAuthEnabled = useWalletAuthEnabled();
  const { isAuthenticated, user, walletAddress, login, logout, isLoading } = useWalletAuth();
  const [showOnboarding, setShowOnboarding] = useState(false);

  // If wallet auth is not enabled, show traditional Eden login
  if (!walletAuthEnabled) {
    return (
      <a 
        href="https://app.eden.art" 
        target="_blank"
        rel="noopener noreferrer"
        className="px-4 py-1.5 border border-gray-600 hover:border-white transition-colors text-sm"
      >
        LOG IN →
      </a>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="px-4 py-1.5 border border-gray-600 text-sm text-gray-400">
        CONNECTING...
      </div>
    );
  }

  // Authenticated state
  if (isAuthenticated && user) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 border border-white text-sm">
          <User className="w-4 h-4" />
          <span className="font-bold">{user.displayName}</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-900/20 border border-green-400 text-sm">
          <Wallet className="w-4 h-4 text-green-400" />
          <span className="text-green-400 font-mono text-xs">
            {walletAddress?.slice(0, 6)}...{walletAddress?.slice(-4)}
          </span>
        </div>
        <Button
          onClick={logout}
          variant="outline"
          size="sm"
          className="border-gray-600 hover:border-red-400 hover:text-red-400"
        >
          <LogOut className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  // Not authenticated - show login options
  return (
    <div className="flex items-center gap-3">
      <Button
        onClick={login}
        className="px-4 py-1.5 border border-gray-600 hover:border-white transition-colors text-sm bg-transparent"
        disabled={isLoading}
      >
        <Wallet className="w-4 h-4 mr-2" />
        CONNECT WALLET
      </Button>
      
      <a 
        href="https://app.eden.art" 
        target="_blank"
        rel="noopener noreferrer"
        className="px-4 py-1.5 border border-gray-600 hover:border-white transition-colors text-sm flex items-center gap-2"
      >
        EDEN APP
        <ExternalLink className="w-3 h-3" />
      </a>

      {/* Onboarding Modal */}
      {showOnboarding && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-black border border-white p-8 max-w-md w-full mx-4">
            <WalletOnboarding
              onComplete={(user) => {
                console.log('Onboarding complete:', user);
                setShowOnboarding(false);
              }}
              onError={(error) => {
                console.error('Onboarding error:', error);
                setShowOnboarding(false);
              }}
            />
            <Button
              onClick={() => setShowOnboarding(false)}
              variant="outline"
              className="mt-4 w-full"
            >
              CANCEL
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}