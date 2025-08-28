/**
 * Wallet Authentication Extension for Registry SDK
 * 
 * Extends the generated Registry API client with wallet authentication methods
 * Following Registry Guardian principles to maintain single source of truth
 * 
 * DEPRECATED: Use the new RegistryClient with AuthService instead
 * This file maintains backward compatibility only
 */

import { 
  RegistryApiClient, 
  RegistryApiError,
  RegistryClient,
  createRegistryClient
} from '@/lib/generated-sdk';

// Enhanced user interface with wallet support
export interface WalletUser {
  id: string;
  email?: string;
  walletAddress?: string;
  role: string;
  authMethod: 'EMAIL' | 'WALLET' | 'HYBRID';
  displayName: string;
  createdAt: string;
  updatedAt: string;
}

// Wallet authentication request interfaces
export interface WalletAuthRequest {
  walletAddress: string;
  signature: string;
  message: string;
}

export interface WalletAuthResponse {
  success: boolean;
  token?: string;
  user?: WalletUser;
  requiresOnboarding?: boolean;
  error?: string;
}

export interface CreateWalletAccountRequest {
  walletAddress: string;
  signature: string;
  displayName: string;
  email?: string;
}

export interface LinkWalletRequest {
  userId: string;
  walletAddress: string;
  signature: string;
}

/**
 * Extended Registry API Client with Wallet Authentication
 * 
 * This class extends the generated SDK while maintaining compatibility
 * All wallet methods follow the same patterns as existing magic link auth
 */
export class WalletRegistryApiClient extends RegistryApiClient {
  /**
   * Authenticate user with wallet signature
   * Similar to completeMagicAuth but for wallet-based authentication
   */
  async authenticateWallet(
    walletAddress: string,
    signature: string,
    message: string
  ): Promise<WalletAuthResponse> {
    try {
      // Use mock endpoint for testing until Registry is deployed
      const endpoint = process.env.NODE_ENV === 'development' 
        ? '/api/registry-mock/auth/wallet/verify'
        : '/auth/wallet/verify';
      
      return await this.request<WalletAuthResponse>(endpoint, {
        method: 'POST',
        body: JSON.stringify({
          walletAddress,
          signature,
          message
        }),
      });
    } catch (error) {
      if (error instanceof RegistryApiError) {
        // Handle specific wallet auth errors
        if (error.status === 404) {
          return {
            success: false,
            requiresOnboarding: true,
            error: 'Wallet not linked to any account'
          };
        }
      }
      throw error;
    }
  }

  /**
   * Create new user account with wallet
   * Registry-compliant: creates User record with wallet as auth method
   */
  async createWalletUser(
    walletAddress: string,
    signature: string,
    userData: {
      displayName: string;
      email?: string;
    }
  ): Promise<WalletAuthResponse> {
    // Use mock endpoint for testing until Registry is deployed
    const endpoint = process.env.NODE_ENV === 'development' 
      ? '/api/registry-mock/auth/wallet/create-account'
      : '/auth/wallet/create-account';
    
    return this.request<WalletAuthResponse>(endpoint, {
      method: 'POST',
      body: JSON.stringify({
        walletAddress,
        signature,
        displayName: userData.displayName,
        email: userData.email
      }),
    });
  }

  /**
   * Link wallet to existing user account
   * Registry-compliant: updates existing User record with wallet address
   */
  async linkUserWallet(
    userId: string,
    walletAddress: string,
    signature: string
  ): Promise<{ success: boolean; message: string }> {
    // Use mock endpoint for testing until Registry is deployed
    const endpoint = process.env.NODE_ENV === 'development' 
      ? `/api/registry-mock/users/${userId}/wallet/link`
      : `/users/${userId}/wallet/link`;
    
    return this.request<{ success: boolean; message: string }>(endpoint, {
      method: 'POST',
      body: JSON.stringify({
        walletAddress,
        signature
      }),
    });
  }

  /**
   * Get user by wallet address
   * Registry lookup for existing wallet associations
   */
  async getUserByWallet(walletAddress: string): Promise<WalletUser | null> {
    try {
      return await this.request<WalletUser>(`/users/wallet/${walletAddress}`);
    } catch (error) {
      if (error instanceof RegistryApiError && error.status === 404) {
        return null;
      }
      throw error;
    }
  }

  /**
   * Verify wallet ownership
   * Used for security checks and wallet linking verification
   */
  async verifyWalletOwnership(
    userId: string,
    walletAddress: string
  ): Promise<{ verified: boolean }> {
    return this.request<{ verified: boolean }>(`/users/${userId}/wallet/${walletAddress}/verify`);
  }

  /**
   * Get user's linked wallets
   * Returns all wallet addresses associated with a user account
   */
  async getUserWallets(userId: string): Promise<{
    wallets: Array<{
      address: string;
      isPrimary: boolean;
      linkedAt: string;
    }>;
  }> {
    return this.request<{
      wallets: Array<{
        address: string;
        isPrimary: boolean;
        linkedAt: string;
      }>;
    }>(`/users/${userId}/wallets`);
  }

  /**
   * Unlink wallet from user account
   * Removes wallet association while preserving user identity
   */
  async unlinkUserWallet(
    userId: string,
    walletAddress: string
  ): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>(`/users/${userId}/wallet/${walletAddress}`, {
      method: 'DELETE'
    });
  }

  /**
   * Generate secure message for wallet signing
   * Provides nonce and timestamp for replay attack prevention
   */
  async generateWalletMessage(walletAddress: string): Promise<{
    message: string;
    nonce: string;
    expiresAt: number;
  }> {
    return this.request<{
      message: string;
      nonce: string;
      expiresAt: number;
    }>('/auth/wallet/generate-message', {
      method: 'POST',
      body: JSON.stringify({ walletAddress }),
    });
  }

  /**
   * Health check for wallet authentication endpoints
   */
  async walletAuthHealth(): Promise<{
    status: string;
    walletAuthEnabled: boolean;
    supportedMethods: string[];
  }> {
    return this.request<{
      status: string;
      walletAuthEnabled: boolean;
      supportedMethods: string[];
    }>('/auth/wallet/health');
  }
}

/**
 * Factory function for creating wallet-enabled Registry API client
 */
export function createWalletRegistryApiClient(config?: any): WalletRegistryApiClient {
  return new WalletRegistryApiClient(config);
}

/**
 * Default wallet-enabled Registry client instance
 */
export const walletRegistryApi = new WalletRegistryApiClient();

/**
 * Type-safe wrapper functions for common wallet auth operations
 * These maintain the same interface patterns as the base SDK
 */

// Authenticate with wallet (similar to completeMagicAuth)
export async function authenticateWallet(
  walletAddress: string,
  signature: string,
  message: string
): Promise<WalletAuthResponse> {
  return walletRegistryApi.authenticateWallet(walletAddress, signature, message);
}

// Create wallet-based account
export async function createWalletAccount(
  walletAddress: string,
  signature: string,
  userData: { displayName: string; email?: string }
): Promise<WalletAuthResponse> {
  return walletRegistryApi.createWalletUser(walletAddress, signature, userData);
}

// Link wallet to existing user
export async function linkWalletToUser(
  userId: string,
  walletAddress: string,
  signature: string
): Promise<{ success: boolean; message: string }> {
  return walletRegistryApi.linkUserWallet(userId, walletAddress, signature);
}

// Get user by wallet
export async function getUserByWallet(walletAddress: string): Promise<WalletUser | null> {
  return walletRegistryApi.getUserByWallet(walletAddress);
}

// Generate signing message
export async function generateWalletMessage(walletAddress: string): Promise<{
  message: string;
  nonce: string;
  expiresAt: number;
}> {
  return walletRegistryApi.generateWalletMessage(walletAddress);
}

/**
 * NEW APPROACH - ADR-019 Compliant
 * 
 * Use the new RegistryClient for wallet authentication instead of the legacy functions above.
 * This provides better error handling, caching, retries, and telemetry.
 */

// Create wallet-enabled Registry client with enhanced features
export function createWalletEnabledRegistryClient(config?: {
  apiKey?: string;
  timeout?: number;
  cache?: boolean;
  telemetry?: boolean;
}) {
  return createRegistryClient({
    cache: true,
    telemetry: true,
    timeout: 15000, // Longer timeout for wallet operations
    retries: {
      maxRetries: 3,
      exponentialBackoff: true
    },
    ...config
  });
}

// Default wallet-enabled client instance
export const modernWalletRegistryClient = createWalletEnabledRegistryClient();

/**
 * Modern wallet authentication using the new SDK
 * 
 * Example usage:
 * 
 * ```typescript
 * import { modernWalletRegistryClient } from '@/lib/registry/wallet-extension';
 * 
 * // Authenticate with wallet
 * const result = await modernWalletRegistryClient.auth.authenticateWallet(
 *   walletAddress, 
 *   signature, 
 *   message
 * );
 * 
 * // Create wallet account
 * const newUser = await modernWalletRegistryClient.auth.createWalletUser(
 *   walletAddress,
 *   signature,
 *   { displayName: 'User Name', email: 'user@example.com' }
 * );
 * 
 * // Link wallet to existing user
 * const linkResult = await modernWalletRegistryClient.auth.linkUserWallet(
 *   userId,
 *   walletAddress,
 *   signature
 * );
 * ```
 */