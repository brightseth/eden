// Registry Gateway Authentication Layer
// Centralizes all auth handling at the Gateway level

import { createRegistryApiClient, RegistryApiError, registryClient } from '../generated-sdk';
import { WalletAuthResponse } from './wallet-extension';

interface AuthToken {
  token: string;
  userId: string;
  email?: string; // Optional for wallet-only users
  walletAddress?: string; // New field for wallet auth
  role: string;
  authType: 'magic-link' | 'wallet'; // Track auth method
  expiresAt: number;
}

interface AuthConfig {
  jwtSecret?: string;
  tokenExpiry?: number; // in seconds
  allowAnonymous?: boolean;
}

export class RegistryAuth {
  private config: AuthConfig;
  private apiClient = createRegistryApiClient();
  private modernApiClient = registryClient; // Use modern SDK for wallet operations
  // Legacy wallet client removed - now using modern SDK exclusively
  private tokenCache = new Map<string, AuthToken>();
  
  constructor(config: AuthConfig = {}) {
    this.config = {
      jwtSecret: process.env.JWT_SECRET || 'dev-secret',
      tokenExpiry: 24 * 60 * 60, // 24 hours
      allowAnonymous: false,
      ...config
    };
  }

  // Start magic link authentication
  async startMagicAuth(email: string): Promise<{ message: string; success: boolean }> {
    try {
      const result = await this.apiClient.startMagicAuth(email);
      return {
        message: result.message,
        success: true
      };
    } catch (error) {
      console.error('[Auth] Magic link start failed:', error);
      return {
        message: error instanceof RegistryApiError ? error.message : 'Authentication failed',
        success: false
      };
    }
  }

  // Complete magic link authentication
  async completeMagicAuth(token: string): Promise<{
    success: boolean;
    token?: string;
    user?: any;
    error?: string;
  }> {
    try {
      const result = await this.apiClient.completeMagicAuth(token);
      
      // Cache the token for future use
      const authToken: AuthToken = {
        token: result.token,
        userId: result.user.id,
        email: result.user.email,
        walletAddress: result.user.walletAddress,
        role: result.user.role,
        authType: 'magic-link',
        expiresAt: Date.now() + (this.config.tokenExpiry! * 1000)
      };
      
      this.tokenCache.set(result.token, authToken);
      
      return {
        success: true,
        token: result.token,
        user: result.user
      };
    } catch (error) {
      console.error('[Auth] Magic link completion failed:', error);
      return {
        success: false,
        error: error instanceof RegistryApiError ? error.message : 'Authentication failed'
      };
    }
  }

  // Start wallet authentication with Privy
  async startWalletAuth(walletAddress: string, signature: string, message: string): Promise<{
    success: boolean;
    token?: string;
    user?: any;
    requiresOnboarding?: boolean;
    error?: string;
  }> {
    try {
      // First, verify the wallet signature is valid
      const signatureValid = await this.verifyWalletSignature(walletAddress, signature, message);
      if (!signatureValid) {
        return {
          success: false,
          error: 'Invalid wallet signature'
        };
      }

      // Check if wallet is already linked to a user using modern SDK
      const result = await this.modernApiClient.auth.authenticateWallet(walletAddress, signature, message);
      
      if (result.requiresOnboarding) {
        return {
          success: false,
          requiresOnboarding: true,
          error: 'Wallet not linked to any account. Please link wallet or create account.'
        };
      }
      
      // Cache the token for future use
      const authToken: AuthToken = {
        token: result.token,
        userId: result.user.id,
        email: result.user.email,
        walletAddress: result.user.walletAddress,
        role: result.user.role,
        authType: 'wallet',
        expiresAt: Date.now() + (this.config.tokenExpiry! * 1000)
      };
      
      this.tokenCache.set(result.token, authToken);
      
      return {
        success: true,
        token: result.token,
        user: result.user
      };
    } catch (error) {
      console.error('[Auth] Wallet authentication failed:', error);
      return {
        success: false,
        error: error instanceof RegistryApiError ? error.message : 'Wallet authentication failed'
      };
    }
  }

  // Link wallet to existing user account
  async linkWalletToUser(userId: string, walletAddress: string, signature: string): Promise<{
    success: boolean;
    message: string;
  }> {
    console.log('[RegistryAuth] linkWalletToUser called with:', { userId, walletAddress, hasSignature: !!signature });
    try {
      // Use modern SDK with enhanced error handling
      console.log('[RegistryAuth] Calling modernApiClient.auth.linkUserWallet');
      const result = await this.modernApiClient.auth.linkUserWallet(userId, walletAddress, signature);
      console.log('[RegistryAuth] linkUserWallet result:', result);
      return result;
    } catch (error) {
      console.error('[Auth] Wallet linking failed:', error);
      return {
        success: false,
        message: error instanceof RegistryApiError ? error.message : 'Failed to link wallet'
      };
    }
  }

  // Create new account with wallet (wallet-first onboarding)
  async createWalletAccount(walletAddress: string, signature: string, userData: {
    displayName: string;
    email?: string;
  }): Promise<{
    success: boolean;
    token?: string;
    user?: any;
    error?: string;
  }> {
    try {
      const result = await this.modernApiClient.auth.createWalletUser(walletAddress, signature, userData);
      
      // Cache the token for future use
      const authToken: AuthToken = {
        token: result.token,
        userId: result.user.id,
        email: result.user.email,
        walletAddress: result.user.walletAddress,
        role: result.user.role || 'guest',
        authType: 'wallet',
        expiresAt: Date.now() + (this.config.tokenExpiry! * 1000)
      };
      
      this.tokenCache.set(result.token, authToken);
      
      return {
        success: true,
        token: result.token,
        user: result.user
      };
    } catch (error) {
      console.error('[Auth] Wallet account creation failed:', error);
      return {
        success: false,
        error: error instanceof RegistryApiError ? error.message : 'Failed to create wallet account'
      };
    }
  }

  // Verify wallet signature using proper cryptographic verification
  private async verifyWalletSignature(walletAddress: string, signature: string, message: string): Promise<boolean> {
    try {
      // Import signature verification utilities
      const { authenticateWalletSignature } = await import('@/lib/wallet/signature-verification');
      
      // Use comprehensive signature verification with replay protection
      const result = await authenticateWalletSignature(
        message,
        signature,
        walletAddress,
        {
          maxAgeMinutes: 5, // Messages must be recent
          checkReplayProtection: true,
          usedNonces: this.usedNonces
        }
      );

      // Store nonce to prevent replay attacks
      if (result.isValid && result.nonce) {
        this.usedNonces.add(result.nonce);
        // Clean up old nonces periodically
        this.cleanupOldNonces();
      }

      if (!result.isValid) {
        console.warn(`[Auth] Wallet signature verification failed: ${result.error}`);
      }

      return result.isValid;
    } catch (error) {
      console.error('[Auth] Wallet signature verification error:', error);
      return false;
    }
  }

  // Track used nonces to prevent replay attacks
  private usedNonces = new Set<string>();
  private lastNonceCleanup = Date.now();

  // Cleanup old nonces to prevent memory leaks
  private cleanupOldNonces(): void {
    const now = Date.now();
    // Clean up every hour
    if (now - this.lastNonceCleanup > 60 * 60 * 1000) {
      // In production, you'd use a more sophisticated cleanup strategy
      // For now, just clear all nonces periodically
      this.usedNonces.clear();
      this.lastNonceCleanup = now;
    }
  }

  // Validate JWT token
  async validateToken(token: string): Promise<{
    valid: boolean;
    user?: AuthToken;
    error?: string;
  }> {
    try {
      // Check cache first
      const cachedToken = this.tokenCache.get(token);
      if (cachedToken) {
        if (Date.now() < cachedToken.expiresAt) {
          return { valid: true, user: cachedToken };
        } else {
          // Token expired, remove from cache
          this.tokenCache.delete(token);
          return { valid: false, error: 'Token expired' };
        }
      }

      // If not in cache, validate against Registry
      // Note: This is a simplified implementation
      // In production, you'd verify JWT signature
      if (!token || token.length < 10) {
        return { valid: false, error: 'Invalid token format' };
      }

      // For now, return invalid - in production, implement proper JWT validation
      return { valid: false, error: 'Token validation not implemented' };
      
    } catch (error) {
      console.error('[Auth] Token validation failed:', error);
      return { valid: false, error: 'Validation failed' };
    }
  }

  // Extract token from request headers
  extractToken(headers: Record<string, string | undefined>): string | null {
    const authHeader = headers.authorization || headers.Authorization;
    
    if (!authHeader) return null;
    
    // Support both "Bearer <token>" and direct token formats
    if (authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }
    
    return authHeader;
  }

  // Middleware for protecting Gateway endpoints
  async authenticateRequest(headers: Record<string, string | undefined>): Promise<{
    authenticated: boolean;
    user?: AuthToken;
    error?: string;
  }> {
    // Allow anonymous access if configured
    if (this.config.allowAnonymous) {
      return { authenticated: true };
    }

    const token = this.extractToken(headers);
    
    if (!token) {
      return {
        authenticated: false,
        error: 'Missing authentication token'
      };
    }

    const validation = await this.validateToken(token);
    
    if (!validation.valid) {
      return {
        authenticated: false,
        error: validation.error || 'Invalid token'
      };
    }

    return {
      authenticated: true,
      user: validation.user
    };
  }

  // Check if user has required role/permissions
  hasPermission(user: AuthToken | undefined, requiredRole: string): boolean {
    if (!user) return false;
    
    // Simple role hierarchy
    const roleHierarchy = {
      'guest': 0,
      'trainer': 1,
      'curator': 2,
      'admin': 3
    };
    
    const userLevel = roleHierarchy[user.role as keyof typeof roleHierarchy] || 0;
    const requiredLevel = roleHierarchy[requiredRole as keyof typeof roleHierarchy] || 0;
    
    return userLevel >= requiredLevel;
  }

  // Get current user from token
  async getCurrentUser(token: string): Promise<AuthToken | null> {
    const validation = await this.validateToken(token);
    return validation.valid ? validation.user || null : null;
  }

  // Logout - invalidate token
  logout(token: string): void {
    this.tokenCache.delete(token);
  }

  // Clear expired tokens from cache
  clearExpiredTokens(): void {
    const now = Date.now();
    for (const [token, authToken] of this.tokenCache.entries()) {
      if (now >= authToken.expiresAt) {
        this.tokenCache.delete(token);
      }
    }
  }

  // Get auth stats for monitoring
  getAuthStats(): {
    cachedTokens: number;
    validTokens: number;
    expiredTokens: number;
  } {
    const now = Date.now();
    let validTokens = 0;
    let expiredTokens = 0;
    
    for (const authToken of this.tokenCache.values()) {
      if (now < authToken.expiresAt) {
        validTokens++;
      } else {
        expiredTokens++;
      }
    }
    
    return {
      cachedTokens: this.tokenCache.size,
      validTokens,
      expiredTokens
    };
  }
}

// Export singleton instance
export const registryAuth = new RegistryAuth({
  allowAnonymous: process.env.NODE_ENV === 'development'
});

// Convenience functions
export async function authenticateRequest(headers: Record<string, string | undefined>) {
  return registryAuth.authenticateRequest(headers);
}

export async function startMagicAuth(email: string) {
  return registryAuth.startMagicAuth(email);
}

export async function completeMagicAuth(token: string) {
  return registryAuth.completeMagicAuth(token);
}

export async function startWalletAuth(walletAddress: string, signature: string, message: string) {
  return registryAuth.startWalletAuth(walletAddress, signature, message);
}

export async function linkWalletToUser(userId: string, walletAddress: string, signature: string) {
  return registryAuth.linkWalletToUser(userId, walletAddress, signature);
}

export async function createWalletAccount(walletAddress: string, signature: string, userData: {
  displayName: string;
  email?: string;
}) {
  return registryAuth.createWalletAccount(walletAddress, signature, userData);
}