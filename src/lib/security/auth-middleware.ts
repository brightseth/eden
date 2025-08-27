// Enhanced Authentication Middleware
// Provides comprehensive authentication and authorization for API endpoints

import { NextRequest, NextResponse } from 'next/server';
import { registryAuth } from '@/lib/registry/auth';
import { logger } from '@/lib/logger';

export interface AuthConfig {
  requireAuth: boolean;
  requiredRole?: 'guest' | 'trainer' | 'curator' | 'admin';
  allowAnonymous?: boolean;
  rateLimit?: {
    requests: number;
    windowMs: number;
  };
  apiKeyRequired?: boolean;
}

export interface AuthContext {
  authenticated: boolean;
  user?: {
    userId: string;
    email: string;
    role: string;
  };
  clientIp?: string;
  userAgent?: string;
  apiKeyValid?: boolean;
}

// Rate limiting store (in production, use Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export class AuthenticationMiddleware {
  private config: AuthConfig;

  constructor(config: AuthConfig) {
    this.config = config;
  }

  async authenticate(request: NextRequest): Promise<{
    success: boolean;
    context?: AuthContext;
    response?: NextResponse;
  }> {
    const clientIp = this.getClientIp(request);
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Check rate limiting first
    if (this.config.rateLimit) {
      const rateLimitCheck = await this.checkRateLimit(clientIp, this.config.rateLimit);
      if (!rateLimitCheck.allowed) {
        logger.warn('Rate limit exceeded', { clientIp, userAgent });
        return {
          success: false,
          response: NextResponse.json(
            { error: 'Rate limit exceeded', retryAfter: rateLimitCheck.retryAfter },
            { 
              status: 429,
              headers: {
                'Retry-After': rateLimitCheck.retryAfter.toString(),
                'X-RateLimit-Limit': this.config.rateLimit.requests.toString(),
                'X-RateLimit-Remaining': '0',
                'X-RateLimit-Reset': Math.ceil(rateLimitCheck.resetTime / 1000).toString()
              }
            }
          )
        };
      }
    }

    // Check API key if required
    let apiKeyValid = false;
    if (this.config.apiKeyRequired) {
      const apiKeyCheck = await this.validateApiKey(request);
      if (!apiKeyCheck.valid) {
        logger.warn('Invalid API key', { clientIp, userAgent });
        return {
          success: false,
          response: NextResponse.json(
            { error: 'Invalid or missing API key' },
            { status: 401 }
          )
        };
      }
      apiKeyValid = true;
    }

    // Handle authentication requirements
    if (!this.config.requireAuth && this.config.allowAnonymous) {
      return {
        success: true,
        context: {
          authenticated: false,
          clientIp,
          userAgent,
          apiKeyValid
        }
      };
    }

    // Extract and validate authentication token
    const headers = Object.fromEntries(request.headers.entries());
    const authResult = await registryAuth.authenticateRequest(headers);

    if (!authResult.authenticated) {
      logger.warn('Authentication failed', { 
        clientIp, 
        userAgent, 
        error: authResult.error 
      });

      return {
        success: false,
        response: NextResponse.json(
          { error: authResult.error || 'Authentication required' },
          { status: 401 }
        )
      };
    }

    // Check role-based authorization
    if (this.config.requiredRole && authResult.user) {
      const hasPermission = registryAuth.hasPermission(authResult.user, this.config.requiredRole);
      if (!hasPermission) {
        logger.warn('Insufficient permissions', { 
          clientIp, 
          userAgent,
          userRole: authResult.user.role,
          requiredRole: this.config.requiredRole
        });

        return {
          success: false,
          response: NextResponse.json(
            { error: 'Insufficient permissions' },
            { status: 403 }
          )
        };
      }
    }

    logger.info('Authentication successful', {
      clientIp,
      userAgent,
      userId: authResult.user?.userId,
      role: authResult.user?.role
    });

    return {
      success: true,
      context: {
        authenticated: true,
        user: authResult.user ? {
          userId: authResult.user.userId,
          email: authResult.user.email,
          role: authResult.user.role
        } : undefined,
        clientIp,
        userAgent,
        apiKeyValid
      }
    };
  }

  private getClientIp(request: NextRequest): string {
    // Get client IP from various headers
    return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
           request.headers.get('x-real-ip') ||
           request.headers.get('cf-connecting-ip') ||
           request.ip ||
           'unknown';
  }

  private async validateApiKey(request: NextRequest): Promise<{ valid: boolean; keyId?: string }> {
    const apiKey = request.headers.get('x-api-key') || 
                   request.headers.get('authorization')?.replace('Bearer ', '');

    if (!apiKey) {
      return { valid: false };
    }

    // In production, validate against database
    // For now, check against environment variables
    const validKeys = [
      process.env.INTERNAL_API_TOKEN,
      process.env.REGISTRY_API_KEY,
      process.env.AGENT_API_KEY
    ].filter(Boolean);

    const isValid = validKeys.includes(apiKey);
    return { 
      valid: isValid,
      keyId: isValid ? this.hashApiKey(apiKey) : undefined
    };
  }

  private hashApiKey(apiKey: string): string {
    // Simple hash for logging (don't log actual keys)
    return Buffer.from(apiKey).toString('base64').substring(0, 8);
  }

  private async checkRateLimit(identifier: string, config: { requests: number; windowMs: number }): Promise<{
    allowed: boolean;
    retryAfter: number;
    resetTime: number;
  }> {
    const now = Date.now();
    const key = `rateLimit:${identifier}`;
    const window = rateLimitStore.get(key);

    if (!window || now > window.resetTime) {
      // New window
      rateLimitStore.set(key, {
        count: 1,
        resetTime: now + config.windowMs
      });
      return {
        allowed: true,
        retryAfter: 0,
        resetTime: now + config.windowMs
      };
    }

    if (window.count >= config.requests) {
      // Rate limit exceeded
      return {
        allowed: false,
        retryAfter: Math.ceil((window.resetTime - now) / 1000),
        resetTime: window.resetTime
      };
    }

    // Increment counter
    window.count++;
    rateLimitStore.set(key, window);

    return {
      allowed: true,
      retryAfter: 0,
      resetTime: window.resetTime
    };
  }
}

// Convenience function to create authentication middleware
export function createAuthMiddleware(config: AuthConfig) {
  const middleware = new AuthenticationMiddleware(config);
  return middleware.authenticate.bind(middleware);
}

// Pre-configured middleware patterns
export const authMiddleware = {
  // Public endpoints - no auth required
  public: createAuthMiddleware({
    requireAuth: false,
    allowAnonymous: true
  }),

  // Basic authentication - requires valid token
  authenticated: createAuthMiddleware({
    requireAuth: true
  }),

  // Trainer-level access
  trainer: createAuthMiddleware({
    requireAuth: true,
    requiredRole: 'trainer'
  }),

  // Curator-level access
  curator: createAuthMiddleware({
    requireAuth: true,
    requiredRole: 'curator'
  }),

  // Admin-only access
  admin: createAuthMiddleware({
    requireAuth: true,
    requiredRole: 'admin'
  }),

  // API key required
  apiKey: createAuthMiddleware({
    requireAuth: false,
    allowAnonymous: true,
    apiKeyRequired: true
  }),

  // Rate limited public endpoints
  rateLimited: createAuthMiddleware({
    requireAuth: false,
    allowAnonymous: true,
    rateLimit: {
      requests: 100,
      windowMs: 60000 // 1 minute
    }
  }),

  // Chat endpoints with heavy rate limiting
  chat: createAuthMiddleware({
    requireAuth: true,
    rateLimit: {
      requests: 10,
      windowMs: 60000 // 1 minute
    }
  }),

  // Admin API with API key and rate limiting
  adminApi: createAuthMiddleware({
    requireAuth: true,
    requiredRole: 'admin',
    apiKeyRequired: true,
    rateLimit: {
      requests: 50,
      windowMs: 60000 // 1 minute
    }
  })
};

// Cleanup expired rate limit entries
setInterval(() => {
  const now = Date.now();
  for (const [key, window] of rateLimitStore.entries()) {
    if (now > window.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 60000); // Clean up every minute