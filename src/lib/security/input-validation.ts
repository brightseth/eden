// Input Validation and Sanitization
// Centralized validation for all API inputs to prevent injection attacks

import { z } from 'zod';
import DOMPurify from 'isomorphic-dompurify';
import { logger } from '@/lib/logger';

// Common validation schemas
export const commonSchemas = {
  // Identifiers
  agentId: z.string()
    .min(2)
    .max(50)
    .regex(/^[a-z0-9_-]+$/, 'Agent ID can only contain lowercase letters, numbers, hyphens, and underscores'),
  
  workId: z.string()
    .min(1)
    .max(100)
    .regex(/^[a-zA-Z0-9_-]+$/, 'Work ID can only contain letters, numbers, hyphens, and underscores'),
  
  // Text inputs
  title: z.string()
    .min(1, 'Title is required')
    .max(200, 'Title must be less than 200 characters')
    .transform(val => DOMPurify.sanitize(val.trim())),
  
  description: z.string()
    .max(1000, 'Description must be less than 1000 characters')
    .optional()
    .transform(val => val ? DOMPurify.sanitize(val.trim()) : undefined),
  
  // URLs
  mediaUri: z.string()
    .url('Must be a valid URL')
    .refine(url => {
      try {
        const parsed = new URL(url);
        // Only allow HTTPS and specific trusted domains
        return parsed.protocol === 'https:' && (
          parsed.hostname.endsWith('.supabase.co') ||
          parsed.hostname.endsWith('.vercel.app') ||
          parsed.hostname.endsWith('.eden.art') ||
          parsed.hostname === 'localhost'
        );
      } catch {
        return false;
      }
    }, 'URL must be HTTPS and from a trusted domain'),
  
  // Pagination
  limit: z.coerce.number()
    .int()
    .min(1)
    .max(100)
    .default(20),
  
  offset: z.coerce.number()
    .int()
    .min(0)
    .default(0),
  
  // Status enums
  workStatus: z.enum(['DRAFT', 'CURATED', 'PUBLISHED', 'ARCHIVED']).optional(),
  agentStatus: z.enum(['ACTIVE', 'ONBOARDING', 'INACTIVE']).optional(),
  
  // Email
  email: z.string()
    .email('Must be a valid email address')
    .max(254, 'Email address too long')
    .transform(val => val.toLowerCase().trim()),
  
  // Role
  role: z.enum(['guest', 'trainer', 'curator', 'admin']),
  
  // Generic metadata
  metadata: z.record(z.string(), z.any())
    .optional()
    .refine(data => {
      if (!data) return true;
      // Limit metadata size
      const jsonString = JSON.stringify(data);
      return jsonString.length <= 10000; // 10KB limit
    }, 'Metadata too large (max 10KB)'),
  
  // Tags
  tags: z.array(z.string().min(1).max(50))
    .max(20, 'Too many tags (max 20)')
    .optional()
    .transform(tags => tags?.map(tag => DOMPurify.sanitize(tag.trim().toLowerCase()))),
  
  // Search query
  query: z.string()
    .min(1)
    .max(100)
    .transform(val => DOMPurify.sanitize(val.trim()))
    .optional()
};

// Request validation schemas
export const requestSchemas = {
  // GET /api/agents
  getAgents: z.object({
    limit: commonSchemas.limit,
    offset: commonSchemas.offset,
    status: commonSchemas.agentStatus,
    search: commonSchemas.query
  }),

  // GET /api/agents/[id]/works
  getAgentWorks: z.object({
    id: commonSchemas.agentId,
    limit: commonSchemas.limit,
    offset: commonSchemas.offset,
    status: commonSchemas.workStatus
  }),

  // POST /api/agents/[id]/works
  createWork: z.object({
    id: commonSchemas.agentId,
    title: commonSchemas.title,
    description: commonSchemas.description,
    mediaUri: commonSchemas.mediaUri,
    metadata: commonSchemas.metadata,
    tags: commonSchemas.tags,
    status: commonSchemas.workStatus.default('DRAFT')
  }),

  // POST /api/auth/magic-link
  magicLinkAuth: z.object({
    email: commonSchemas.email
  }),

  // POST /api/auth/complete
  completeMagicAuth: z.object({
    token: z.string().min(10, 'Invalid token')
  }),

  // POST /api/admin/agents
  createAgent: z.object({
    handle: commonSchemas.agentId,
    displayName: z.string().min(1).max(100),
    email: commonSchemas.email,
    role: commonSchemas.role,
    metadata: commonSchemas.metadata
  }),

  // Webhook validation
  webhook: z.object({
    event: z.string().min(1).max(50),
    payload: z.record(z.string(), z.any()),
    timestamp: z.string().datetime(),
    signature: z.string().min(1)
  })
};

// Validation middleware
export class InputValidator {
  static async validateRequest<T extends keyof typeof requestSchemas>(
    schemaName: T,
    data: any,
    source: 'query' | 'body' | 'params' = 'body'
  ): Promise<{
    success: boolean;
    data?: z.infer<typeof requestSchemas[T]>;
    errors?: string[];
  }> {
    try {
      const schema = requestSchemas[schemaName];
      const validatedData = await schema.parseAsync(data);
      
      logger.info('Input validation successful', {
        schema: schemaName,
        source,
        dataKeys: Object.keys(data)
      });

      return {
        success: true,
        data: validatedData
      };
    } catch (error) {
      logger.warn('Input validation failed', {
        schema: schemaName,
        source,
        error: error instanceof Error ? error.message : 'Unknown error',
        data: this.sanitizeLogData(data)
      });

      if (error instanceof z.ZodError) {
        return {
          success: false,
          errors: error.errors.map(err => `${err.path.join('.')}: ${err.message}`)
        };
      }

      return {
        success: false,
        errors: ['Invalid input data']
      };
    }
  }

  // Sanitize data for logging (remove sensitive fields)
  private static sanitizeLogData(data: any): any {
    if (!data || typeof data !== 'object') return data;
    
    const sensitiveFields = ['password', 'token', 'apiKey', 'secret', 'auth'];
    const sanitized = { ...data };
    
    for (const field of sensitiveFields) {
      if (field in sanitized) {
        sanitized[field] = '[REDACTED]';
      }
    }
    
    return sanitized;
  }

  // Validate and sanitize HTML content
  static sanitizeHtml(html: string, options?: {
    allowedTags?: string[];
    allowedAttributes?: Record<string, string[]>;
  }): string {
    const config = options ? {
      ALLOWED_TAGS: options.allowedTags || ['p', 'br', 'strong', 'em', 'a'],
      ALLOWED_ATTR: options.allowedAttributes || { a: ['href'] },
      ALLOW_DATA_ATTR: false
    } : undefined;

    return DOMPurify.sanitize(html, config);
  }

  // Validate file upload
  static validateFile(file: File, options: {
    maxSize?: number; // in bytes
    allowedTypes?: string[];
    allowedExtensions?: string[];
  }): { valid: boolean; error?: string } {
    const {
      maxSize = 10 * 1024 * 1024, // 10MB default
      allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4'],
      allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.mp4']
    } = options;

    // Check file size
    if (file.size > maxSize) {
      return {
        valid: false,
        error: `File size exceeds limit of ${Math.round(maxSize / 1024 / 1024)}MB`
      };
    }

    // Check MIME type
    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: `File type ${file.type} not allowed. Allowed types: ${allowedTypes.join(', ')}`
      };
    }

    // Check file extension
    const extension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    if (!allowedExtensions.includes(extension)) {
      return {
        valid: false,
        error: `File extension ${extension} not allowed. Allowed extensions: ${allowedExtensions.join(', ')}`
      };
    }

    return { valid: true };
  }

  // SQL injection prevention for raw queries
  static escapeSQL(value: string): string {
    return value.replace(/'/g, "''").replace(/\\/g, '\\\\');
  }

  // NoSQL injection prevention
  static sanitizeNoSQLQuery(query: any): any {
    if (typeof query === 'string') {
      // Remove potential MongoDB operators
      return query.replace(/^\$/, '').replace(/\./g, '_');
    }
    
    if (Array.isArray(query)) {
      return query.map(this.sanitizeNoSQLQuery);
    }
    
    if (query && typeof query === 'object') {
      const sanitized: any = {};
      for (const [key, value] of Object.entries(query)) {
        // Remove MongoDB operators from keys
        const cleanKey = key.replace(/^\$/, '').replace(/\./g, '_');
        sanitized[cleanKey] = this.sanitizeNoSQLQuery(value);
      }
      return sanitized;
    }
    
    return query;
  }
}

// Validation decorators for API routes
export function validateInput<T extends keyof typeof requestSchemas>(
  schemaName: T,
  source: 'query' | 'body' | 'params' = 'body'
) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    
    descriptor.value = async function (...args: any[]) {
      const [request] = args;
      let data;
      
      try {
        switch (source) {
          case 'query':
            data = Object.fromEntries(request.nextUrl.searchParams.entries());
            break;
          case 'body':
            data = await request.json();
            break;
          case 'params':
            data = args[1]?.params ? await args[1].params : {};
            break;
        }

        const validation = await InputValidator.validateRequest(schemaName, data, source);
        
        if (!validation.success) {
          logger.warn('Validation failed in decorator', {
            method: propertyKey,
            schema: schemaName,
            errors: validation.errors
          });

          return new Response(
            JSON.stringify({
              error: 'Validation failed',
              details: validation.errors
            }),
            { 
              status: 400,
              headers: { 'Content-Type': 'application/json' }
            }
          );
        }

        // Add validated data to request context
        request.validatedData = validation.data;
        
      } catch (error) {
        logger.error('Validation decorator error', {
          method: propertyKey,
          error: error instanceof Error ? error.message : 'Unknown error'
        });

        return new Response(
          JSON.stringify({ error: 'Invalid request data' }),
          { 
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }

      return originalMethod.apply(this, args);
    };
    
    return descriptor;
  };
}

export { z } from 'zod';