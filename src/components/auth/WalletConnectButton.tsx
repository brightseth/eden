'use client';

import { useState } from 'react';
import { useWalletAuth, useWalletAuthEnabled } from '@/lib/auth/privy-provider';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

interface WalletConnectButtonProps {
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
  onSuccess?: (user: any) => void;
  onError?: (error: string) => void;
}

export function WalletConnectButton({
  variant = 'default',
  size = 'default',
  className,
  onSuccess,
  onError
}: WalletConnectButtonProps) {
  const walletEnabled = useWalletAuthEnabled();
  const { 
    isAuthenticated, 
    user, 
    walletAddress, 
    login, 
    logout, 
    isLoading 
  } = useWalletAuth();

  const [error, setError] = useState<string | null>(null);

  if (!walletEnabled) {
    return null; // Don't render if wallet auth is disabled
  }

  const handleConnect = async () => {
    try {
      setError(null);
      await login();
      if (onSuccess && user) {
        onSuccess(user);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to connect wallet';
      setError(errorMessage);
      if (onError) {
        onError(errorMessage);
      }
    }
  };

  const handleDisconnect = async () => {
    try {
      setError(null);
      await logout();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to disconnect wallet';
      setError(errorMessage);
      if (onError) {
        onError(errorMessage);
      }
    }
  };

  if (isAuthenticated && user) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : 'Wallet'}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDisconnect}
              disabled={isLoading}
            >
              Disconnect
            </Button>
          </div>
          {user.email && (
            <span className="text-xs text-gray-500 mt-1">{user.email}</span>
          )}
        </div>
        {error && (
          <Alert className="mt-2">
            <AlertDescription className="text-sm">{error}</AlertDescription>
          </Alert>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <Button
        variant={variant}
        size={size}
        className={className}
        onClick={handleConnect}
        disabled={isLoading}
      >
        {isLoading ? 'Connecting...' : 'Connect Wallet'}
      </Button>
      {error && (
        <Alert className="max-w-sm">
          <AlertDescription className="text-sm">{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}

// Alternative component for inline wallet status display
export function WalletStatus() {
  const walletEnabled = useWalletAuthEnabled();
  const { isAuthenticated, user, walletAddress, isLoading } = useWalletAuth();

  if (!walletEnabled || !isAuthenticated) {
    return null;
  }

  if (isLoading) {
    return (
      <Badge variant="outline" className="animate-pulse">
        Loading...
      </Badge>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Badge variant="default" className="bg-green-600">
        {walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : 'Wallet Connected'}
      </Badge>
      {user?.role && (
        <Badge variant="secondary" className="text-xs">
          {user.role}
        </Badge>
      )}
    </div>
  );
}