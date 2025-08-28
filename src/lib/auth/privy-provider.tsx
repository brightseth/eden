'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { PrivyProvider, usePrivy } from '@privy-io/react-auth';
import { isFeatureEnabled, FLAGS } from '@/config/flags';
import { startWalletAuth, createWalletAccount, linkWalletToUser } from '@/lib/registry/auth';

interface WalletAuthContextType {
  isAuthenticated: boolean;
  user: any | null;
  walletAddress: string | null;
  login: () => void;
  logout: () => void;
  linkWallet: (userId: string) => Promise<{ success: boolean; message: string }>;
  createAccount: (userData: { displayName: string; email?: string }) => Promise<{ success: boolean; error?: string }>;
  isLoading: boolean;
}

const WalletAuthContext = createContext<WalletAuthContextType | null>(null);

// Privy configuration - simplified for initial setup
const PRIVY_CONFIG = {
  appearance: {
    theme: 'dark' as const,
    accentColor: '#FFFFFF',
  },
  loginMethods: ['wallet'] as const,
  embeddedWallets: {
    createOnLogin: 'users-without-wallets' as const,
  }
};

// Inner component that uses Privy hooks
function WalletAuthContextProvider({ children }: { children: React.ReactNode }) {
  const { ready, authenticated, user, login, logout } = usePrivy();
  const [isLoading, setIsLoading] = useState(true);
  const [registryUser, setRegistryUser] = useState<any>(null);

  useEffect(() => {
    if (ready) {
      setIsLoading(false);
    }
  }, [ready]);

  // Handle wallet authentication with Registry
  useEffect(() => {
    if (authenticated && user?.wallet?.address && !registryUser) {
      handleWalletAuth();
    }
  }, [authenticated, user, registryUser]);

  const handleWalletAuth = async () => {
    if (!user?.wallet?.address) return;

    setIsLoading(true);
    try {
      // Generate secure message for signing using Registry
      const { generateSignMessage } = await import('@/lib/wallet/signature-verification');
      const message = generateSignMessage(user.wallet.address);
      
      // Get actual signature from Privy wallet
      let signature: string;
      
      try {
        // Use Privy's signMessage method for real wallet signing
        if (user.wallet && 'signMessage' in user.wallet) {
          signature = await user.wallet.signMessage(message);
        } else {
          console.warn('Wallet does not support signing, using simulated signature');
          signature = 'simulated-signature-development';
        }
      } catch (signError) {
        console.error('Failed to sign message:', signError);
        // Fallback to simulated signature for development
        signature = 'simulated-signature-development';
      }
      
      const result = await startWalletAuth(user.wallet.address, signature, message);
      
      if (result.success && result.user) {
        setRegistryUser(result.user);
        // Store token in localStorage or secure storage
        localStorage.setItem('eden-auth-token', result.token!);
      } else if (result.requiresOnboarding) {
        // User needs to either link wallet or create account
        console.log('Wallet requires onboarding');
      }
    } catch (error) {
      console.error('Wallet authentication failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLinkWallet = async (userId: string) => {
    console.log('[Privy Provider] handleLinkWallet called with userId:', userId);
    if (!user?.wallet?.address) {
      console.log('[Privy Provider] No wallet connected');
      return { success: false, message: 'No wallet connected' };
    }

    console.log('[Privy Provider] Wallet address:', user.wallet.address);
    try {
      // Generate secure message for wallet linking
      const { generateSignMessage } = await import('@/lib/wallet/signature-verification');
      const message = generateSignMessage(user.wallet.address);
      
      // Get actual signature from Privy wallet
      let signature: string;
      try {
        if (user.wallet && 'signMessage' in user.wallet) {
          signature = await user.wallet.signMessage(message);
        } else {
          signature = 'simulated-signature-development';
        }
      } catch (signError) {
        console.error('Failed to sign message for wallet linking:', signError);
        signature = 'simulated-signature-development';
      }
      
      console.log('[Privy Provider] Calling linkWalletToUser with:', { userId, walletAddress: user.wallet.address, hasSignature: !!signature });
      const result = await linkWalletToUser(userId, user.wallet.address, signature);
      console.log('[Privy Provider] linkWalletToUser result:', result);
      
      if (result.success) {
        // Refresh user data
        await handleWalletAuth();
      }
      
      return result;
    } catch (error) {
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Failed to link wallet' 
      };
    }
  };

  const handleCreateAccount = async (userData: { displayName: string; email?: string }) => {
    if (!user?.wallet?.address) {
      return { success: false, error: 'No wallet connected' };
    }

    try {
      // Generate secure message for account creation
      const { generateSignMessage } = await import('@/lib/wallet/signature-verification');
      const message = generateSignMessage(user.wallet.address);
      
      // Get actual signature from Privy wallet
      let signature: string;
      try {
        if (user.wallet && 'signMessage' in user.wallet) {
          signature = await user.wallet.signMessage(message);
        } else {
          signature = 'simulated-signature-development';
        }
      } catch (signError) {
        console.error('Failed to sign message for account creation:', signError);
        signature = 'simulated-signature-development';
      }
      
      const result = await createWalletAccount(user.wallet.address, signature, userData);
      
      if (result.success && result.user) {
        setRegistryUser(result.user);
        localStorage.setItem('eden-auth-token', result.token!);
      }
      
      return { success: result.success, error: result.error };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to create account' 
      };
    }
  };

  const handleLogout = () => {
    logout();
    setRegistryUser(null);
    localStorage.removeItem('eden-auth-token');
  };

  const contextValue: WalletAuthContextType = {
    isAuthenticated: authenticated && !!registryUser,
    user: registryUser,
    walletAddress: user?.wallet?.address || null,
    login,
    logout: handleLogout,
    linkWallet: handleLinkWallet,
    createAccount: handleCreateAccount,
    isLoading
  };

  return (
    <WalletAuthContext.Provider value={contextValue}>
      {children}
    </WalletAuthContext.Provider>
  );
}

// Main provider component
export function EdenWalletProvider({ children }: { children: React.ReactNode }) {
  // Check feature flag
  const walletAuthEnabled = isFeatureEnabled(FLAGS.ENABLE_PRIVY_WALLET_AUTH);

  if (!walletAuthEnabled) {
    // If wallet auth is disabled, just render children without Privy
    const contextValue: WalletAuthContextType = {
      isAuthenticated: false,
      user: null,
      walletAddress: null,
      login: () => console.log('Wallet auth disabled'),
      logout: () => console.log('Wallet auth disabled'),
      linkWallet: async () => ({ success: false, message: 'Wallet auth disabled' }),
      createAccount: async () => ({ success: false, error: 'Wallet auth disabled' }),
      isLoading: false
    };

    return (
      <WalletAuthContext.Provider value={contextValue}>
        {children}
      </WalletAuthContext.Provider>
    );
  }

  const privyAppId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
  
  if (!privyAppId) {
    console.error('NEXT_PUBLIC_PRIVY_APP_ID environment variable is required for wallet authentication');
    // Fallback to disabled state
    const contextValue: WalletAuthContextType = {
      isAuthenticated: false,
      user: null,
      walletAddress: null,
      login: () => console.log('Privy app ID not configured'),
      logout: () => console.log('Privy app ID not configured'),
      linkWallet: async () => ({ success: false, message: 'Privy not configured' }),
      createAccount: async () => ({ success: false, error: 'Privy not configured' }),
      isLoading: false
    };

    return (
      <WalletAuthContext.Provider value={contextValue}>
        {children}
      </WalletAuthContext.Provider>
    );
  }

  return (
    <PrivyProvider
      appId={privyAppId}
      config={PRIVY_CONFIG}
    >
      <WalletAuthContextProvider>
        {children}
      </WalletAuthContextProvider>
    </PrivyProvider>
  );
}

// Hook to use wallet auth context
export function useWalletAuth() {
  const context = useContext(WalletAuthContext);
  if (!context) {
    throw new Error('useWalletAuth must be used within EdenWalletProvider');
  }
  return context;
}

// Utility hook to check if wallet auth is enabled
export function useWalletAuthEnabled() {
  return isFeatureEnabled(FLAGS.ENABLE_PRIVY_WALLET_AUTH);
}