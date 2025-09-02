// Security Headers and CORS Configuration
// Implements comprehensive security headers to protect against common attacks

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export interface SecurityConfig {
  contentSecurityPolicy?: {
    enabled: boolean;
    directives?: Record<string, string[]>;
  };
  cors?: {
    enabled: boolean;
    origins?: string[];
    methods?: string[];
    allowedHeaders?: string[];
    credentials?: boolean;
    maxAge?: number;
  };
  headers?: {
    strictTransportSecurity?: boolean;
    xFrameOptions?: string;
    xContentTypeOptions?: boolean;
    referrerPolicy?: string;
    permissionsPolicy?: Record<string, string[]>;
  };
}

const defaultSecurityConfig: SecurityConfig = {
  contentSecurityPolicy: {
    enabled: true,
    directives: {
      'default-src': ["'self'"],
      'script-src': [
        "'self'",
        "'unsafe-inline'", // Required for Next.js in development
        "'unsafe-eval'", // Required for Next.js in development
        'https://vercel.live',
        'https://va.vercel-scripts.com'
      ],
      'style-src': [
        "'self'",
        "'unsafe-inline'", // Required for styled-components and Tailwind
        'https://fonts.googleapis.com'
      ],
      'img-src': [
        "'self'",
        'data:',
        'blob:',
        'https://*.supabase.co',
        'https://*.vercel.app',
        'https://*.eden.art',
        'https://images.unsplash.com',
        'https://cdn.openai.com'
      ],
      'font-src': [
        "'self'",
        'https://fonts.gstatic.com'
      ],
      'connect-src': [
        "'self'",
        'https://*.supabase.co',
        'https://*.vercel.app',
        'https://*.eden.art',
        'https://api.openai.com',
        'https://vercel.live',
        'wss://*.supabase.co'
      ],
      'media-src': [
        "'self'",
        'https://*.supabase.co',
        'https://*.vercel.app',
        'data:',
        'blob:'
      ],
      'worker-src': [
        "'self'",
        'blob:'
      ],
      'frame-src': [
        "'self'"
      ],
      'object-src': ["'none'"],
      'base-uri': ["'self'"],
      'form-action': ["'self'"],
      'frame-ancestors': ["'none'"], // Prevents embedding in iframes
      'upgrade-insecure-requests': []
    }
  },
  cors: {
    enabled: true,
    origins: [
      'https://eden-academy.vercel.app',
      'https://eden.art',
      'https://app.eden.art',
      'https://registry.eden.art',
      'https://localhost:3000',
      'http://localhost:3000'
    ],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-API-Key',
      'X-Requested-With',
      'Accept',
      'Origin',
      'Cache-Control'
    ],
    credentials: true,
    maxAge: 86400 // 24 hours
  },
  headers: {
    strictTransportSecurity: true,
    xFrameOptions: 'DENY',
    xContentTypeOptions: true,
    referrerPolicy: 'strict-origin-when-cross-origin',
    permissionsPolicy: {
      'accelerometer': ["'none'"],
      'ambient-light-sensor': ["'none'"],
      'autoplay': ["'self'"],
      'battery': ["'none'"],
      'camera': ["'none'"],
      'cross-origin-isolated': ["'none'"],
      'display-capture': ["'none'"],
      'document-domain': ["'none'"],
      'encrypted-media': ["'none'"],
      'execution-while-not-rendered': ["'none'"],
      'execution-while-out-of-viewport': ["'none'"],
      'fullscreen': ["'self'"],
      'geolocation': ["'none'"],
      'gyroscope': ["'none'"],
      'keyboard-map': ["'none'"],
      'magnetometer': ["'none'"],
      'microphone': ["'none'"],
      'midi': ["'none'"],
      'navigation-override': ["'none'"],
      'payment': ["'none'"],
      'picture-in-picture': ["'self'"],
      'publickey-credentials-get': ["'none'"],
      'screen-wake-lock': ["'none'"],
      'sync-xhr': ["'none'"],
      'usb': ["'none'"],
      'web-share': ["'self'"],
      'xr-spatial-tracking': ["'none'"]
    }
  }
};

export class SecurityHeaders {
  private config: SecurityConfig;

  constructor(config: Partial<SecurityConfig> = {}) {
    this.config = this.mergeConfigs(defaultSecurityConfig, config);
  }

  // Apply security headers to a response
  applyHeaders(response: NextResponse, request?: NextRequest): NextResponse {
    // Content Security Policy
    if (this.config.contentSecurityPolicy?.enabled) {
      const cspHeader = this.buildCSPHeader(this.config.contentSecurityPolicy.directives!);
      response.headers.set('Content-Security-Policy', cspHeader);
    }

    // CORS headers
    if (this.config.cors?.enabled && request) {
      this.applyCORSHeaders(response, request);
    }

    // Security headers
    if (this.config.headers?.strictTransportSecurity) {
      response.headers.set(
        'Strict-Transport-Security', 
        'max-age=31536000; includeSubDomains; preload'
      );
    }

    if (this.config.headers?.xFrameOptions) {
      response.headers.set('X-Frame-Options', this.config.headers.xFrameOptions);
    }

    if (this.config.headers?.xContentTypeOptions) {
      response.headers.set('X-Content-Type-Options', 'nosniff');
    }

    if (this.config.headers?.referrerPolicy) {
      response.headers.set('Referrer-Policy', this.config.headers.referrerPolicy);
    }

    // Permissions Policy
    if (this.config.headers?.permissionsPolicy) {
      const permissionsHeader = this.buildPermissionsHeader(
        this.config.headers.permissionsPolicy
      );
      response.headers.set('Permissions-Policy', permissionsHeader);
    }

    // Additional security headers
    response.headers.set('X-DNS-Prefetch-Control', 'off');
    response.headers.set('X-Download-Options', 'noopen');
    response.headers.set('X-Permitted-Cross-Domain-Policies', 'none');
    
    // Remove server identification
    response.headers.delete('Server');
    response.headers.delete('X-Powered-By');

    return response;
  }

  // Handle CORS preflight requests
  handleCORSPreflight(request: NextRequest): NextResponse | null {
    if (request.method !== 'OPTIONS' || !this.config.cors?.enabled) {
      return null;
    }

    const origin = request.headers.get('origin');
    if (!this.isOriginAllowed(origin)) {
      return new NextResponse(null, { status: 403 });
    }

    const response = new NextResponse(null, { status: 200 });
    this.applyCORSHeaders(response, request);
    
    return response;
  }

  // Check if origin is allowed
  private isOriginAllowed(origin: string | null): boolean {
    if (!origin || !this.config.cors?.origins) return false;
    
    return this.config.cors.origins.some(allowedOrigin => {
      if (allowedOrigin === '*') return true;
      if (allowedOrigin === origin) return true;
      
      // Support wildcard subdomains
      if (allowedOrigin.startsWith('*.')) {
        const domain = allowedOrigin.substring(2);
        return origin.endsWith(`.${domain}`) || origin === domain;
      }
      
      return false;
    });
  }

  // Apply CORS headers
  private applyCORSHeaders(response: NextResponse, request: NextRequest): void {
    const cors = this.config.cors!;
    const origin = request.headers.get('origin');

    if (this.isOriginAllowed(origin)) {
      response.headers.set('Access-Control-Allow-Origin', origin!);
    }

    if (cors.credentials) {
      response.headers.set('Access-Control-Allow-Credentials', 'true');
    }

    if (cors.methods) {
      response.headers.set('Access-Control-Allow-Methods', cors.methods.join(', '));
    }

    if (cors.allowedHeaders) {
      response.headers.set('Access-Control-Allow-Headers', cors.allowedHeaders.join(', '));
    }

    if (cors.maxAge) {
      response.headers.set('Access-Control-Max-Age', cors.maxAge.toString());
    }

    // Expose common headers that might be useful for clients
    response.headers.set(
      'Access-Control-Expose-Headers',
      'X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset'
    );
  }

  // Build Content Security Policy header
  private buildCSPHeader(directives: Record<string, string[]>): string {
    return Object.entries(directives)
      .map(([directive, sources]) => {
        if (sources.length === 0) {
          return directive;
        }
        return `${directive} ${sources.join(' ')}`;
      })
      .join('; ');
  }

  // Build Permissions Policy header
  private buildPermissionsHeader(policies: Record<string, string[]>): string {
    return Object.entries(policies)
      .map(([feature, allowlist]) => {
        if (allowlist.length === 0) {
          return `${feature}=()`;
        }
        return `${feature}=(${allowlist.join(' ')})`;
      })
      .join(', ');
  }

  // Merge configurations
  private mergeConfigs(defaultConfig: SecurityConfig, userConfig: Partial<SecurityConfig>): SecurityConfig {
    return {
      contentSecurityPolicy: {
        ...defaultConfig.contentSecurityPolicy,
        ...userConfig.contentSecurityPolicy,
        directives: {
          ...defaultConfig.contentSecurityPolicy?.directives,
          ...userConfig.contentSecurityPolicy?.directives
        }
      },
      cors: {
        ...defaultConfig.cors,
        ...userConfig.cors
      },
      headers: {
        ...defaultConfig.headers,
        ...userConfig.headers,
        permissionsPolicy: {
          ...defaultConfig.headers?.permissionsPolicy,
          ...userConfig.headers?.permissionsPolicy
        }
      }
    };
  }

  // Environment-specific configurations
  static getDevelopmentConfig(): Partial<SecurityConfig> {
    return {
      contentSecurityPolicy: {
        enabled: false // Disable in development for easier debugging
      },
      cors: {
        enabled: true,
        origins: [
          'http://localhost:3000',
          'https://localhost:3000',
          'http://localhost:3001',
          'http://127.0.0.1:3000'
        ]
      },
      headers: {
        strictTransportSecurity: false // No HTTPS in local development
      }
    };
  }

  static getProductionConfig(): Partial<SecurityConfig> {
    return {
      contentSecurityPolicy: {
        enabled: true,
        directives: {
          'upgrade-insecure-requests': [] // Force HTTPS in production
        }
      },
      headers: {
        strictTransportSecurity: true,
        xFrameOptions: 'DENY'
      }
    };
  }
}

// Singleton instance
let securityHeaders: SecurityHeaders;

export function getSecurityHeaders(): SecurityHeaders {
  if (!securityHeaders) {
    const isDevelopment = process.env.NODE_ENV === 'development';
    const config = isDevelopment 
      ? SecurityHeaders.getDevelopmentConfig()
      : SecurityHeaders.getProductionConfig();
    
    securityHeaders = new SecurityHeaders(config);
  }
  
  return securityHeaders;
}

// Middleware helper
export function applySecurityHeaders(response: NextResponse, request?: NextRequest): NextResponse {
  return getSecurityHeaders().applyHeaders(response, request);
}

// CORS preflight handler
export function handleCORSPreflight(request: NextRequest): NextResponse | null {
  return getSecurityHeaders().handleCORSPreflight(request);
}