// Request Deduplication with Idempotency Keys
// Prevents duplicate Registry operations and ensures data consistency

import { registryCache } from './cache'

interface IdempotencyResult<T> {
  data: T
  fromCache: boolean
  key: string
  ttl: number
}

interface IdempotencyConfig {
  defaultTTL: number // seconds
  keyPrefix: string
  enableAutoGeneration: boolean
  hashAlgorithm: string
}

export class IdempotencyManager {
  private config: IdempotencyConfig

  constructor(config?: Partial<IdempotencyConfig>) {
    this.config = {
      defaultTTL: 3600, // 1 hour
      keyPrefix: 'idem:',
      enableAutoGeneration: true,
      hashAlgorithm: 'sha256',
      ...config
    }
  }

  // Generate idempotency key from request data
  generateKey(data: {
    operation: string
    userId?: string
    agentId?: string
    requestBody?: any
    timestamp?: number // For time-based deduplication
  }): string {
    // Simple hash implementation for browser compatibility
    const parts = [
      data.operation,
      data.userId || '',
      data.agentId || '',
      data.requestBody ? JSON.stringify(data.requestBody, Object.keys(data.requestBody).sort()) : '',
      data.timestamp ? Math.floor(data.timestamp / 60000) * 60000 : ''
    ]
    
    const combined = parts.join('|')
    
    // Simple hash function (not cryptographically secure but sufficient for deduplication)
    let hash = 0
    for (let i = 0; i < combined.length; i++) {
      const char = combined.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32-bit integer
    }
    
    return `${this.config.keyPrefix}${Math.abs(hash).toString(36)}`
  }

  // Execute operation with idempotency protection
  async executeWithIdempotency<T>(
    idempotencyKey: string,
    operation: () => Promise<T>,
    ttl?: number
  ): Promise<IdempotencyResult<T>> {
    const finalTTL = ttl || this.config.defaultTTL
    
    // Check if we already have a result for this key
    const existing = await registryCache.get<T>(idempotencyKey)
    
    if (existing) {
      console.log(`[Idempotency] Key ${idempotencyKey} found in cache - returning cached result`)
      return {
        data: existing,
        fromCache: true,
        key: idempotencyKey,
        ttl: finalTTL
      }
    }

    // Execute the operation
    console.log(`[Idempotency] Key ${idempotencyKey} not found - executing operation`)
    
    try {
      const result = await operation()
      
      // Store result for future deduplication
      await registryCache.set(idempotencyKey, result, finalTTL)
      
      console.log(`[Idempotency] Operation completed - cached result for ${finalTTL}s`)
      
      return {
        data: result,
        fromCache: false,
        key: idempotencyKey,
        ttl: finalTTL
      }
    } catch (error) {
      console.error(`[Idempotency] Operation failed for key ${idempotencyKey}:`, error)
      throw error
    }
  }

  // Create agent creation with idempotency
  async createCreationIdempotent(params: {
    agentId: string
    userId?: string
    creation: any
    idempotencyKey?: string
    ttl?: number
  }): Promise<IdempotencyResult<any>> {
    let key = params.idempotencyKey
    
    // Auto-generate key if not provided
    if (!key && this.config.enableAutoGeneration) {
      key = this.generateKey({
        operation: 'create_creation',
        userId: params.userId,
        agentId: params.agentId,
        requestBody: params.creation,
        timestamp: Date.now()
      })
    }
    
    if (!key) {
      throw new Error('Idempotency key is required')
    }

    return this.executeWithIdempotency(
      key,
      async () => {
        // This would be your actual creation logic
        // For now, return mock data
        return {
          id: `creation-${Date.now()}`,
          agentId: params.agentId,
          ...params.creation,
          createdAt: new Date().toISOString()
        }
      },
      params.ttl
    )
  }

  // Update agent with idempotency
  async updateAgentIdempotent(params: {
    agentId: string
    userId?: string
    updates: any
    idempotencyKey?: string
    ttl?: number
  }): Promise<IdempotencyResult<any>> {
    let key = params.idempotencyKey
    
    if (!key && this.config.enableAutoGeneration) {
      key = this.generateKey({
        operation: 'update_agent',
        userId: params.userId,
        agentId: params.agentId,
        requestBody: params.updates,
        timestamp: Date.now()
      })
    }
    
    if (!key) {
      throw new Error('Idempotency key is required')
    }

    return this.executeWithIdempotency(
      key,
      async () => {
        return {
          id: params.agentId,
          ...params.updates,
          updatedAt: new Date().toISOString()
        }
      },
      params.ttl
    )
  }

  // Check if operation is duplicate
  async isDuplicate(idempotencyKey: string): Promise<boolean> {
    const existing = await registryCache.get(idempotencyKey)
    return existing !== null
  }

  // Invalidate idempotency key (force re-execution)
  async invalidateKey(idempotencyKey: string): Promise<boolean> {
    return registryCache.del(idempotencyKey)
  }

  // Clean up expired idempotency keys
  async cleanup(): Promise<number> {
    return registryCache.invalidatePattern(`${this.config.keyPrefix}*`)
  }

  // Get idempotency statistics
  async getStats(): Promise<{
    totalKeys: number
    config: IdempotencyConfig
  }> {
    // This is a simplified implementation
    // In production, you'd query the cache for actual statistics
    return {
      totalKeys: 0, // Would need to implement cache scanning
      config: this.config
    }
  }

  // Middleware for Express/Next.js API routes
  async middleware(
    operation: string,
    headers: Record<string, string | undefined>,
    body: any,
    userId?: string,
    agentId?: string
  ): Promise<{
    idempotencyKey: string
    isDuplicate: boolean
    cached?: any
  }> {
    // Extract idempotency key from headers
    let idempotencyKey = headers['idempotency-key'] || headers['x-idempotency-key']
    
    // Auto-generate if not provided
    if (!idempotencyKey && this.config.enableAutoGeneration) {
      idempotencyKey = this.generateKey({
        operation,
        userId,
        agentId,
        requestBody: body,
        timestamp: Date.now()
      })
    }
    
    if (!idempotencyKey) {
      return {
        idempotencyKey: '',
        isDuplicate: false
      }
    }

    // Check for duplicate
    const cached = await registryCache.get(idempotencyKey)
    
    return {
      idempotencyKey,
      isDuplicate: cached !== null,
      cached
    }
  }

  // Time-based deduplication window
  generateTimeWindowKey(data: {
    operation: string
    userId?: string
    agentId?: string
    requestBody?: any
    windowMinutes?: number
  }): string {
    const windowMinutes = data.windowMinutes || 5 // 5 minute window
    const now = Date.now()
    const windowStart = Math.floor(now / (windowMinutes * 60 * 1000)) * (windowMinutes * 60 * 1000)
    
    return this.generateKey({
      ...data,
      timestamp: windowStart
    })
  }

  // Content-based deduplication (ignores timing)
  generateContentKey(data: {
    operation: string
    userId?: string
    agentId?: string
    requestBody?: any
  }): string {
    return this.generateKey(data) // No timestamp = content-only hash
  }
}

// Export singleton instance
export const idempotencyManager = new IdempotencyManager()

// Convenience functions
export async function executeWithIdempotency<T>(
  idempotencyKey: string,
  operation: () => Promise<T>,
  ttl?: number
): Promise<IdempotencyResult<T>> {
  return idempotencyManager.executeWithIdempotency(idempotencyKey, operation, ttl)
}

export function generateIdempotencyKey(data: Parameters<IdempotencyManager['generateKey']>[0]): string {
  return idempotencyManager.generateKey(data)
}

export async function checkDuplicate(idempotencyKey: string): Promise<boolean> {
  return idempotencyManager.isDuplicate(idempotencyKey)
}