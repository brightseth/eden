// Comprehensive Audit Logging for Registry Guardian
// Tracks all Registry operations for compliance and debugging

// Note: File operations disabled in browser environment
// This module only works server-side in Next.js

interface AuditEvent {
  timestamp: string
  traceId: string
  operation: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  endpoint: string
  userId?: string
  userEmail?: string
  userRole?: string
  agentId?: string
  requestHeaders: Record<string, string>
  requestBody?: any
  responseStatus: number
  responseTime: number
  error?: string
  metadata?: Record<string, unknown>
}

interface AuditConfig {
  enableConsoleLog: boolean
  enableFileLog: boolean
  enableRemoteLog: boolean
  logDirectory: string
  maxFileSize: number // bytes
  rotateDaily: boolean
  includeHeaders: string[]
  excludeHeaders: string[]
  remoteLogUrl?: string
}

export class AuditLogger {
  private config: AuditConfig
  private logBuffer: AuditEvent[] = []
  private flushInterval: NodeJS.Timeout | null = null

  constructor(config?: Partial<AuditConfig>) {
    this.config = {
      enableConsoleLog: process.env.AUDIT_CONSOLE === 'true',
      enableFileLog: process.env.AUDIT_FILE !== 'false', // default to true
      enableRemoteLog: process.env.AUDIT_REMOTE === 'true',
      logDirectory: process.env.AUDIT_LOG_DIR || './logs/audit',
      maxFileSize: 50 * 1024 * 1024, // 50MB
      rotateDaily: true,
      includeHeaders: ['authorization', 'user-agent', 'x-trace-id', 'x-forwarded-for'],
      excludeHeaders: ['cookie', 'set-cookie'],
      remoteLogUrl: process.env.AUDIT_REMOTE_URL,
      ...config
    }

    // Start flush interval for batched logging
    this.flushInterval = setInterval(() => {
      this.flushBuffer()
    }, 5000) // Flush every 5 seconds

    this.ensureLogDirectory()
  }

  private async ensureLogDirectory(): Promise<void> {
    // File operations only work server-side
    if (typeof window !== 'undefined') return
    
    try {
      const { mkdir } = await import('fs/promises')
      await mkdir(this.config.logDirectory, { recursive: true })
    } catch (error) {
      console.error('[Audit] Failed to create log directory:', error)
    }
  }

  private filterHeaders(headers: Record<string, string | undefined>): Record<string, string> {
    const filtered: Record<string, string> = {}
    
    if (!headers || typeof headers !== 'object') {
      return filtered
    }
    
    for (const [key, value] of Object.entries(headers)) {
      if (!value) continue
      
      const lowerKey = key.toLowerCase()
      
      // Include if in includeHeaders or exclude if in excludeHeaders
      if (this.config.includeHeaders.length > 0) {
        if (this.config.includeHeaders.includes(lowerKey)) {
          filtered[key] = value
        }
      } else if (!this.config.excludeHeaders.includes(lowerKey)) {
        filtered[key] = value
      }
    }
    
    return filtered
  }

  private generateTraceId(): string {
    return `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  async logOperation(params: {
    operation: string
    method: AuditEvent['method']
    endpoint: string
    userId?: string
    userEmail?: string
    userRole?: string
    agentId?: string
    requestHeaders: Record<string, string | undefined>
    requestBody?: any
    responseStatus: number
    responseTime: number
    error?: string
    metadata?: Record<string, unknown>
    traceId?: string
  }): Promise<void> {
    const event: AuditEvent = {
      timestamp: new Date().toISOString(),
      traceId: params.traceId || this.generateTraceId(),
      operation: params.operation,
      method: params.method,
      endpoint: params.endpoint,
      userId: params.userId,
      userEmail: params.userEmail,
      userRole: params.userRole,
      agentId: params.agentId,
      requestHeaders: this.filterHeaders(params.requestHeaders),
      requestBody: this.sanitizeRequestBody(params.requestBody),
      responseStatus: params.responseStatus,
      responseTime: params.responseTime,
      error: params.error,
      metadata: params.metadata
    }

    // Add to buffer for batched processing
    this.logBuffer.push(event)

    // Immediate console logging for critical events
    if (this.config.enableConsoleLog) {
      this.logToConsole(event)
    }

    // Immediate flush for errors
    if (params.error || params.responseStatus >= 400) {
      await this.flushBuffer()
    }
  }

  private sanitizeRequestBody(body: any): any {
    if (!body) return body

    // Clone to avoid modifying original
    const sanitized = JSON.parse(JSON.stringify(body))

    // Remove sensitive fields
    const sensitiveFields = ['password', 'token', 'key', 'secret', 'auth']
    
    const sanitizeObject = (obj: any) => {
      if (typeof obj !== 'object' || obj === null) return obj
      
      for (const [key, value] of Object.entries(obj)) {
        if (sensitiveFields.some(field => key.toLowerCase().includes(field))) {
          obj[key] = '[REDACTED]'
        } else if (typeof value === 'object') {
          sanitizeObject(value)
        }
      }
    }

    sanitizeObject(sanitized)
    return sanitized
  }

  private logToConsole(event: AuditEvent): void {
    const level = event.error || event.responseStatus >= 400 ? 'error' : 'info'
    const color = level === 'error' ? '\x1b[31m' : '\x1b[36m'
    const reset = '\x1b[0m'

    console.log(
      `${color}[Audit]${reset} ${event.timestamp} ${event.traceId} ` +
      `${event.method} ${event.endpoint} ${event.responseStatus} ${event.responseTime}ms` +
      (event.error ? ` ERROR: ${event.error}` : '') +
      (event.userEmail ? ` USER: ${event.userEmail}` : '')
    )
  }

  private async flushBuffer(): Promise<void> {
    if (this.logBuffer.length === 0) return

    const events = [...this.logBuffer]
    this.logBuffer = []

    try {
      // File logging
      if (this.config.enableFileLog) {
        await this.writeToFile(events)
      }

      // Remote logging
      if (this.config.enableRemoteLog && this.config.remoteLogUrl) {
        await this.sendToRemote(events)
      }
    } catch (error) {
      console.error('[Audit] Failed to flush log buffer:', error)
      
      // Put events back if they failed to write
      this.logBuffer.unshift(...events)
    }
  }

  private async writeToFile(events: AuditEvent[]): Promise<void> {
    // File operations only work server-side
    if (typeof window !== 'undefined') return
    
    try {
      const { appendFile } = await import('fs/promises')
      const { join } = await import('path')
      
      const date = new Date().toISOString().split('T')[0] // YYYY-MM-DD
      const filename = this.config.rotateDaily 
        ? `registry-audit-${date}.jsonl`
        : 'registry-audit.jsonl'
      
      const filepath = join(this.config.logDirectory, filename)
      
      const logLines = events.map(event => JSON.stringify(event)).join('\n') + '\n'
      
      await appendFile(filepath, logLines, 'utf8')
    } catch (error) {
      console.error('[Audit] Failed to write to file:', error)
      throw error
    }
  }

  private async sendToRemote(events: AuditEvent[]): Promise<void> {
    if (!this.config.remoteLogUrl) return

    try {
      const response = await fetch(this.config.remoteLogUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Registry-Audit/1.0'
        },
        body: JSON.stringify({ events })
      })

      if (!response.ok) {
        throw new Error(`Remote logging failed: ${response.status} ${response.statusText}`)
      }
    } catch (error) {
      console.error('[Audit] Failed to send to remote:', error)
      throw error
    }
  }

  // Audit specific operations
  async auditGatewayCall(params: {
    operation: string
    endpoint: string
    method: AuditEvent['method']
    headers: Record<string, string | undefined>
    body?: any
    responseStatus: number
    responseTime: number
    userId?: string
    userEmail?: string
    error?: string
    traceId?: string
  }): Promise<void> {
    await this.logOperation({
      ...params,
      requestHeaders: params.headers as Record<string, string>,
      requestBody: params.body,
      metadata: {
        source: 'gateway',
        userAgent: params.headers['user-agent'],
        clientIp: params.headers['x-forwarded-for'] || params.headers['x-real-ip']
      }
    })
  }

  async auditAuthEvent(params: {
    operation: 'login' | 'logout' | 'token_validation' | 'permission_check'
    userEmail?: string
    userId?: string
    success: boolean
    error?: string
    metadata?: Record<string, unknown>
  }): Promise<void> {
    await this.logOperation({
      operation: `auth.${params.operation}`,
      method: 'POST',
      endpoint: '/auth',
      userId: params.userId,
      userEmail: params.userEmail,
      requestHeaders: {},
      responseStatus: params.success ? 200 : 401,
      responseTime: 0,
      error: params.error,
      metadata: {
        source: 'auth',
        ...params.metadata
      }
    })
  }

  async auditCacheEvent(params: {
    operation: 'hit' | 'miss' | 'set' | 'invalidate'
    key: string
    ttl?: number
    source: 'redis' | 'memory'
    metadata?: Record<string, unknown>
  }): Promise<void> {
    await this.logOperation({
      operation: `cache.${params.operation}`,
      method: 'GET',
      endpoint: '/cache',
      requestHeaders: {},
      responseStatus: 200,
      responseTime: 0,
      metadata: {
        source: 'cache',
        cacheKey: params.key,
        cacheSource: params.source,
        ttl: params.ttl,
        ...params.metadata
      }
    })
  }

  async auditCircuitBreakerEvent(params: {
    operation: 'open' | 'close' | 'trip'
    failures: number
    metadata?: Record<string, unknown>
  }): Promise<void> {
    await this.logOperation({
      operation: `circuit_breaker.${params.operation}`,
      method: 'POST',
      endpoint: '/circuit-breaker',
      requestHeaders: {},
      responseStatus: 200,
      responseTime: 0,
      metadata: {
        source: 'circuit_breaker',
        failures: params.failures,
        ...params.metadata
      }
    })
  }

  // Get audit statistics
  getStats(): {
    bufferSize: number
    config: AuditConfig
  } {
    return {
      bufferSize: this.logBuffer.length,
      config: this.config
    }
  }

  // Cleanup
  async shutdown(): Promise<void> {
    if (this.flushInterval) {
      clearInterval(this.flushInterval)
      this.flushInterval = null
    }
    
    // Final flush
    await this.flushBuffer()
  }
}

// Export singleton instance
export const auditLogger = new AuditLogger()

// Cleanup on process exit (server-side only)
if (typeof window === 'undefined' && typeof process !== 'undefined') {
  process.on('beforeExit', () => {
    auditLogger.shutdown()
  })
}

// Convenience functions
export async function auditGatewayCall(params: Parameters<AuditLogger['auditGatewayCall']>[0]) {
  return auditLogger.auditGatewayCall(params)
}

export async function auditAuthEvent(params: Parameters<AuditLogger['auditAuthEvent']>[0]) {
  return auditLogger.auditAuthEvent(params)
}

export async function auditCacheEvent(params: Parameters<AuditLogger['auditCacheEvent']>[0]) {
  return auditLogger.auditCacheEvent(params)
}