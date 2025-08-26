// Registry Gateway Authentication Layer
// Centralizes all auth handling at the Gateway level

import { createRegistryApiClient, RegistryApiError } from '../generated-sdk';

interface AuthToken {
  token: string;
  userId: string;
  email: string;
  role: string;
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
        role: result.user.role,
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