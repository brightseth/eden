// Authentication service client for Registry SDK
// Following ADR-019 Registry Integration Pattern
// Includes both magic link and wallet authentication

import {
  User,
  MagicLinkRequest,
  MagicLinkResponse,
  CompleteMagicAuthRequest,
  AuthResponse,
  WalletAuthRequest,
  WalletAuthResponse,
  CreateWalletAccountRequest,
  LinkWalletRequest,
  WalletMessageRequest,
  WalletMessageResponse,
  CreateApplicationRequest,
  ApplicationResponse
} from '../types/auth';
import { BaseRegistryError, createRegistryError, WalletAuthError } from '../utils/errors';
import { withRetry, RetryConfig } from '../utils/retry';
import { MemoryCache } from '../utils/cache';

export class AuthService {
  constructor(
    private request: <T>(path: string, options?: RequestInit, retries?: number) => Promise<T>,
    private cache?: MemoryCache,
    private retryConfig?: RetryConfig
  ) {}

  // Magic Link Authentication Methods

  /**
   * Request magic link for email authentication
   */
  async requestMagicLink(email: string, redirectUrl?: string): Promise<MagicLinkResponse> {
    const requestLink = async () => {
      const payload: MagicLinkRequest = { email, redirectUrl };
      
      return await this.request<MagicLinkResponse>('/auth/magic/request', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
    };

    if (this.retryConfig) {
      const result = await withRetry(requestLink, this.retryConfig);
      return result.data;
    }

    return requestLink();
  }

  /**
   * Complete magic link authentication
   */
  async completeMagicAuth(token: string): Promise<AuthResponse> {
    const completeAuth = async () => {
      const payload: CompleteMagicAuthRequest = { token };
      
      try {
        return await this.request<AuthResponse>('/auth/magic/complete', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
      } catch (error: any) {
        if (error.statusCode === 401) {
          throw createRegistryError(401, 'Invalid or expired magic link token', error.response);
        }
        throw error;
      }
    };

    if (this.retryConfig) {
      const result = await withRetry(completeAuth, this.retryConfig);
      return result.data;
    }

    return completeAuth();
  }

  // Wallet Authentication Methods (from your implementation)

  /**
   * Generate secure message for wallet signing
   */
  async generateWalletMessage(walletAddress: string): Promise<WalletMessageResponse> {
    const generateMessage = async () => {
      const payload: WalletMessageRequest = { walletAddress };
      
      // Use mock endpoint for testing until Registry is deployed
      const endpoint = process.env.NODE_ENV === 'development' 
        ? '/api/registry-mock/auth/wallet/generate-message'
        : '/auth/wallet/generate-message';
      
      return await this.request<WalletMessageResponse>(endpoint, {
        method: 'POST',
        body: JSON.stringify(payload)
      });
    };

    if (this.retryConfig) {
      const result = await withRetry(generateMessage, this.retryConfig);
      return result.data;
    }

    return generateMessage();
  }

  /**
   * Authenticate user with wallet signature
   */
  async authenticateWallet(
    walletAddress: string,
    signature: string,
    message: string
  ): Promise<WalletAuthResponse> {
    const authenticateWallet = async () => {
      const payload: WalletAuthRequest = { walletAddress, signature, message };
      
      // Use mock endpoint for testing until Registry is deployed
      const endpoint = process.env.NODE_ENV === 'development' 
        ? '/api/registry-mock/auth/wallet/verify'
        : '/auth/wallet/verify';
      
      try {
        return await this.request<WalletAuthResponse>(endpoint, {
          method: 'POST',
          body: JSON.stringify(payload)
        });
      } catch (error: any) {
        if (error.statusCode === 404) {
          return {
            success: false,
            requiresOnboarding: true,
            error: 'Wallet not linked to any account'
          };
        }
        throw new WalletAuthError(`Wallet authentication failed: ${error.message}`);
      }
    };

    if (this.retryConfig) {
      const result = await withRetry(authenticateWallet, this.retryConfig);
      return result.data;
    }

    return authenticateWallet();
  }

  /**
   * Create new user account with wallet
   */
  async createWalletUser(
    walletAddress: string,
    signature: string,
    userData: {
      displayName: string;
      email?: string;
    }
  ): Promise<WalletAuthResponse> {
    const createUser = async () => {
      const payload: CreateWalletAccountRequest = {
        walletAddress,
        signature,
        displayName: userData.displayName,
        email: userData.email
      };
      
      // Use mock endpoint for testing until Registry is deployed
      const endpoint = process.env.NODE_ENV === 'development' 
        ? '/api/registry-mock/auth/wallet/create-account'
        : '/auth/wallet/create-account';
      
      try {
        return await this.request<WalletAuthResponse>(endpoint, {
          method: 'POST',
          body: JSON.stringify(payload)
        });
      } catch (error: any) {
        throw new WalletAuthError(`Account creation failed: ${error.message}`);
      }
    };

    if (this.retryConfig) {
      const result = await withRetry(createUser, this.retryConfig);
      return result.data;
    }

    return createUser();
  }

  /**
   * Link wallet to existing user account
   */
  async linkUserWallet(
    userId: string,
    walletAddress: string,
    signature: string
  ): Promise<{ success: boolean; message: string }> {
    const linkWallet = async () => {
      const payload: LinkWalletRequest = { userId, walletAddress, signature };
      
      // Use mock endpoint for testing until Registry is deployed
      const endpoint = process.env.NODE_ENV === 'development' 
        ? `/api/registry-mock/users/${userId}/wallet/link`
        : `/users/${userId}/wallet/link`;
      
      try {
        return await this.request<{ success: boolean; message: string }>(endpoint, {
          method: 'POST',
          body: JSON.stringify(payload)
        });
      } catch (error: any) {
        if (error.statusCode === 404) {
          throw createRegistryError(404, `User '${userId}' not found`, error.response);
        }
        throw new WalletAuthError(`Wallet linking failed: ${error.message}`);
      }
    };

    if (this.retryConfig) {
      const result = await withRetry(linkWallet, this.retryConfig);
      return result.data;
    }

    return linkWallet();
  }

  /**
   * Get user by wallet address
   */
  async getUserByWallet(walletAddress: string): Promise<User | null> {
    const getUser = async () => {
      try {
        return await this.request<User>(`/users/wallet/${walletAddress}`);
      } catch (error: any) {
        if (error.statusCode === 404) {
          return null;
        }
        throw error;
      }
    };

    if (this.retryConfig) {
      const result = await withRetry(getUser, this.retryConfig);
      return result.data;
    }

    return getUser();
  }

  /**
   * Verify wallet ownership
   */
  async verifyWalletOwnership(
    userId: string,
    walletAddress: string
  ): Promise<{ verified: boolean }> {
    const verifyOwnership = async () => {
      return await this.request<{ verified: boolean }>(`/users/${userId}/wallet/${walletAddress}/verify`);
    };

    if (this.retryConfig) {
      const result = await withRetry(verifyOwnership, this.retryConfig);
      return result.data;
    }

    return verifyOwnership();
  }

  // Application Methods

  /**
   * Submit application for agent training or other tracks
   */
  async submitApplication(application: CreateApplicationRequest): Promise<ApplicationResponse> {
    const submitApp = async () => {
      try {
        return await this.request<ApplicationResponse>('/applications', {
          method: 'POST',
          body: JSON.stringify(application)
        });
      } catch (error: any) {
        if (error.statusCode === 400) {
          throw createRegistryError(400, 'Invalid application data', error.response);
        }
        throw error;
      }
    };

    if (this.retryConfig) {
      const result = await withRetry(submitApp, this.retryConfig);
      return result.data;
    }

    return submitApp();
  }

  // Health Check

  /**
   * Health check for wallet authentication endpoints
   */
  async walletAuthHealth(): Promise<{
    status: string;
    walletAuthEnabled: boolean;
    supportedMethods: string[];
  }> {
    const healthCheck = async () => {
      // Use mock endpoint for testing until Registry is deployed
      const endpoint = process.env.NODE_ENV === 'development' 
        ? '/api/registry-mock/auth/wallet/verify'
        : '/auth/wallet/health';
      
      return await this.request<{
        status: string;
        walletAuthEnabled: boolean;
        supportedMethods: string[];
      }>(endpoint);
    };

    return healthCheck(); // Don't retry health checks
  }
}