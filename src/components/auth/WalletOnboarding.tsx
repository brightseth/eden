'use client';

import { useState } from 'react';
import { useWalletAuth } from '@/lib/auth/privy-provider';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

interface WalletOnboardingProps {
  onComplete?: (user: any) => void;
  onError?: (error: string) => void;
}

export function WalletOnboarding({
  onComplete,
  onError
}: WalletOnboardingProps) {
  const { walletAddress, createAccount, linkWallet, isLoading } = useWalletAuth();
  const [mode, setMode] = useState<'choice' | 'create' | 'link'>('choice');
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    userId: '' // For linking to existing account
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleCreateAccount = async () => {
    if (!formData.displayName.trim()) {
      setError('Display name is required');
      return;
    }

    try {
      setError(null);
      const result = await createAccount({
        displayName: formData.displayName.trim(),
        email: formData.email.trim() || undefined
      });

      if (result.success) {
        setSuccess('Account created successfully!');
        if (onComplete) {
          // The user should be available from context after successful creation
          setTimeout(() => onComplete(result), 1000);
        }
      } else {
        setError(result.error || 'Failed to create account');
        if (onError) {
          onError(result.error || 'Failed to create account');
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create account';
      setError(errorMessage);
      if (onError) {
        onError(errorMessage);
      }
    }
  };

  const handleLinkWallet = async () => {
    if (!formData.userId.trim()) {
      setError('User ID is required to link wallet');
      return;
    }

    try {
      setError(null);
      const result = await linkWallet(formData.userId.trim());

      if (result.success) {
        setSuccess('Wallet linked successfully!');
        if (onComplete) {
          // The user should be available from context after successful linking
          setTimeout(() => onComplete(result), 1000);
        }
      } else {
        setError(result.message);
        if (onError) {
          onError(result.message);
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to link wallet';
      setError(errorMessage);
      if (onError) {
        onError(errorMessage);
      }
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center gap-4 p-6 bg-green-50 rounded-lg border border-green-200">
        <div className="text-green-600 text-lg font-semibold">Success!</div>
        <div className="text-green-700 text-center">{success}</div>
        <Badge variant="outline" className="bg-green-100">
          {walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : 'Wallet Connected'}
        </Badge>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6 bg-gray-50 rounded-lg border">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Complete Wallet Setup</h3>
        <p className="text-gray-600 text-sm mb-4">
          Your wallet is connected but not yet linked to an Eden Academy account.
        </p>
        <Badge variant="outline" className="mb-4">
          {walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : 'Wallet Connected'}
        </Badge>
      </div>

      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertDescription className="text-red-700">{error}</AlertDescription>
        </Alert>
      )}

      {mode === 'choice' && (
        <div className="flex flex-col gap-4">
          <Button 
            onClick={() => setMode('create')}
            className="w-full"
            disabled={isLoading}
          >
            Create New Account
          </Button>
          <Button 
            variant="outline"
            onClick={() => setMode('link')}
            className="w-full"
            disabled={isLoading}
          >
            Link to Existing Account
          </Button>
        </div>
      )}

      {mode === 'create' && (
        <div className="flex flex-col gap-4">
          <div>
            <label htmlFor="displayName" className="block text-sm font-medium mb-1">
              Display Name *
            </label>
            <input
              id="displayName"
              type="text"
              value={formData.displayName}
              onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your display name"
              disabled={isLoading}
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email (Optional)
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              disabled={isLoading}
            />
            <p className="text-xs text-gray-500 mt-1">
              Email can be used for account recovery and notifications
            </p>
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={handleCreateAccount}
              disabled={isLoading || !formData.displayName.trim()}
              className="flex-1"
            >
              {isLoading ? 'Creating...' : 'Create Account'}
            </Button>
            <Button 
              variant="outline"
              onClick={() => setMode('choice')}
              disabled={isLoading}
            >
              Back
            </Button>
          </div>
        </div>
      )}

      {mode === 'link' && (
        <div className="flex flex-col gap-4">
          <div>
            <label htmlFor="userId" className="block text-sm font-medium mb-1">
              Existing Account User ID *
            </label>
            <input
              id="userId"
              type="text"
              value={formData.userId}
              onChange={(e) => setFormData(prev => ({ ...prev, userId: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your user ID or email"
              disabled={isLoading}
            />
            <p className="text-xs text-gray-500 mt-1">
              This will link your wallet to your existing Eden Academy account
            </p>
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={handleLinkWallet}
              disabled={isLoading || !formData.userId.trim()}
              className="flex-1"
            >
              {isLoading ? 'Linking...' : 'Link Wallet'}
            </Button>
            <Button 
              variant="outline"
              onClick={() => setMode('choice')}
              disabled={isLoading}
            >
              Back
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}