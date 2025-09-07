/**
 * Spirit Observability - Metrics and Logging
 * 
 * Comprehensive observability for Spirit operations:
 * - Structured logging for all mutations
 * - Performance metrics and timing
 * - Error tracking and alerting
 * - Multi-trainer usage analytics
 */

interface SpiritMetric {
  operation: string
  agentId: string
  trainerId: string
  timestamp: number
  duration: number
  success: boolean
  error?: string
  metadata?: Record<string, any>
}

interface SpiritLog {
  level: 'INFO' | 'WARN' | 'ERROR'
  operation: string
  agentId: string
  trainerId: string
  timestamp: number
  message: string
  context?: Record<string, any>
}

class SpiritObservability {
  private metrics: SpiritMetric[] = []
  private logs: SpiritLog[] = []
  private maxMetrics = 10000 // Keep last 10k metrics
  private maxLogs = 5000 // Keep last 5k logs

  /**
   * Log Spirit operation with structured data
   */
  log(
    level: 'INFO' | 'WARN' | 'ERROR',
    operation: string,
    agentId: string,
    trainerId: string,
    message: string,
    context?: Record<string, any>
  ): void {
    const logEntry: SpiritLog = {
      level,
      operation,
      agentId,
      trainerId,
      timestamp: Date.now(),
      message,
      context
    }

    this.logs.push(logEntry)
    
    // Maintain log size limit
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs)
    }

    // Console output with structured format
    const contextStr = context ? ` ${JSON.stringify(context)}` : ''
    const trainerStr = trainerId ? ` trainer=${trainerId}` : ''
    
    console.log(
      `[SPIRIT:${level}] ${operation} agent=${agentId}${trainerStr} - ${message}${contextStr}`
    )

    // Send to external logging service if configured
    this.sendToExternalLogger(logEntry)
  }

  /**
   * Record performance metric for Spirit operation
   */
  recordMetric(
    operation: string,
    agentId: string,
    trainerId: string,
    startTime: number,
    success: boolean,
    error?: string,
    metadata?: Record<string, any>
  ): void {
    const metric: SpiritMetric = {
      operation,
      agentId,
      trainerId,
      timestamp: startTime,
      duration: Date.now() - startTime,
      success,
      error,
      metadata
    }

    this.metrics.push(metric)
    
    // Maintain metrics size limit
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics)
    }

    // Send to metrics service
    this.sendToMetricsService(metric)
  }

  /**
   * Get performance analytics for Spirit operations
   */
  getAnalytics(timeWindow: number = 3600000): {
    totalOperations: number
    successRate: number
    avgDuration: number
    operationBreakdown: Record<string, number>
    trainerActivity: Record<string, number>
    errorSummary: Record<string, number>
    throughput: number
  } {
    const cutoff = Date.now() - timeWindow
    const recentMetrics = this.metrics.filter(m => m.timestamp >= cutoff)

    if (recentMetrics.length === 0) {
      return {
        totalOperations: 0,
        successRate: 0,
        avgDuration: 0,
        operationBreakdown: {},
        trainerActivity: {},
        errorSummary: {},
        throughput: 0
      }
    }

    const totalOperations = recentMetrics.length
    const successfulOps = recentMetrics.filter(m => m.success).length
    const successRate = successfulOps / totalOperations
    const avgDuration = recentMetrics.reduce((sum, m) => sum + m.duration, 0) / totalOperations
    const throughput = totalOperations / (timeWindow / 1000) // ops per second

    // Operation breakdown
    const operationBreakdown: Record<string, number> = {}
    recentMetrics.forEach(m => {
      operationBreakdown[m.operation] = (operationBreakdown[m.operation] || 0) + 1
    })

    // Trainer activity
    const trainerActivity: Record<string, number> = {}
    recentMetrics.forEach(m => {
      if (m.trainerId) {
        trainerActivity[m.trainerId] = (trainerActivity[m.trainerId] || 0) + 1
      }
    })

    // Error summary
    const errorSummary: Record<string, number> = {}
    recentMetrics.filter(m => !m.success && m.error).forEach(m => {
      const errorType = this.categorizeError(m.error!)
      errorSummary[errorType] = (errorSummary[errorType] || 0) + 1
    })

    return {
      totalOperations,
      successRate,
      avgDuration,
      operationBreakdown,
      trainerActivity,
      errorSummary,
      throughput
    }
  }

  /**
   * Get logs filtered by criteria
   */
  getLogs(filters: {
    level?: 'INFO' | 'WARN' | 'ERROR'
    operation?: string
    agentId?: string
    trainerId?: string
    timeWindow?: number
    limit?: number
  } = {}): SpiritLog[] {
    let filteredLogs = [...this.logs]

    // Apply filters
    if (filters.level) {
      filteredLogs = filteredLogs.filter(log => log.level === filters.level)
    }

    if (filters.operation) {
      filteredLogs = filteredLogs.filter(log => log.operation === filters.operation)
    }

    if (filters.agentId) {
      filteredLogs = filteredLogs.filter(log => log.agentId === filters.agentId)
    }

    if (filters.trainerId) {
      filteredLogs = filteredLogs.filter(log => log.trainerId === filters.trainerId)
    }

    if (filters.timeWindow) {
      const cutoff = Date.now() - filters.timeWindow
      filteredLogs = filteredLogs.filter(log => log.timestamp >= cutoff)
    }

    // Sort by timestamp (newest first) and apply limit
    filteredLogs.sort((a, b) => b.timestamp - a.timestamp)
    
    if (filters.limit) {
      filteredLogs = filteredLogs.slice(0, filters.limit)
    }

    return filteredLogs
  }

  /**
   * Generate alerting rules based on metrics
   */
  checkAlerts(): {
    criticalAlerts: string[]
    warningAlerts: string[]
  } {
    const analytics = this.getAnalytics(300000) // Last 5 minutes
    const criticalAlerts: string[] = []
    const warningAlerts: string[] = []

    // Critical: Success rate below 80%
    if (analytics.totalOperations > 10 && analytics.successRate < 0.8) {
      criticalAlerts.push(
        `CRITICAL: Spirit operation success rate is ${(analytics.successRate * 100).toFixed(1)}% (last 5 minutes)`
      )
    }

    // Critical: Average duration over 30 seconds
    if (analytics.avgDuration > 30000) {
      criticalAlerts.push(
        `CRITICAL: Spirit operations averaging ${(analytics.avgDuration / 1000).toFixed(1)}s duration`
      )
    }

    // Warning: High error rate for specific operations
    Object.entries(analytics.errorSummary).forEach(([errorType, count]) => {
      if (count > 5) {
        warningAlerts.push(
          `WARNING: ${count} ${errorType} errors in last 5 minutes`
        )
      }
    })

    // Warning: Single trainer dominating (>80% of operations)
    const totalTrainerOps = Object.values(analytics.trainerActivity).reduce((sum, count) => sum + count, 0)
    Object.entries(analytics.trainerActivity).forEach(([trainerId, count]) => {
      if (count / totalTrainerOps > 0.8 && totalTrainerOps > 20) {
        warningAlerts.push(
          `WARNING: Trainer ${trainerId} is responsible for ${((count / totalTrainerOps) * 100).toFixed(1)}% of operations`
        )
      }
    })

    return { criticalAlerts, warningAlerts }
  }

  /**
   * Export metrics for external monitoring systems
   */
  exportMetrics(): {
    prometheus: string
    json: any
    csv: string
  } {
    const analytics = this.getAnalytics()

    // Prometheus format
    const prometheus = [
      `# HELP spirit_operations_total Total number of Spirit operations`,
      `# TYPE spirit_operations_total counter`,
      `spirit_operations_total ${analytics.totalOperations}`,
      ``,
      `# HELP spirit_success_rate Success rate of Spirit operations`,
      `# TYPE spirit_success_rate gauge`,
      `spirit_success_rate ${analytics.successRate}`,
      ``,
      `# HELP spirit_avg_duration_ms Average duration of Spirit operations in milliseconds`,
      `# TYPE spirit_avg_duration_ms gauge`,
      `spirit_avg_duration_ms ${analytics.avgDuration}`,
      ``,
      `# HELP spirit_throughput_ops_per_sec Spirit operations throughput per second`,
      `# TYPE spirit_throughput_ops_per_sec gauge`,
      `spirit_throughput_ops_per_sec ${analytics.throughput}`,
    ].join('\n')

    // JSON format
    const json = {
      timestamp: new Date().toISOString(),
      analytics,
      recentLogs: this.getLogs({ limit: 100 }),
      alerts: this.checkAlerts()
    }

    // CSV format
    const csvHeaders = ['timestamp', 'operation', 'agentId', 'trainerId', 'duration', 'success', 'error']
    const csvRows = this.metrics.slice(-1000).map(m => [
      new Date(m.timestamp).toISOString(),
      m.operation,
      m.agentId,
      m.trainerId,
      m.duration.toString(),
      m.success.toString(),
      m.error || ''
    ])
    const csv = [csvHeaders.join(','), ...csvRows.map(row => row.join(','))].join('\n')

    return { prometheus, json, csv }
  }

  /**
   * Send log to external logging service
   */
  private sendToExternalLogger(log: SpiritLog): void {
    // Integration with external logging services
    const loggerUrl = process.env.SPIRIT_LOGGER_URL
    if (loggerUrl) {
      fetch(loggerUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(log)
      }).catch(error => {
        console.error('Failed to send log to external service:', error)
      })
    }
  }

  /**
   * Send metric to metrics service
   */
  private sendToMetricsService(metric: SpiritMetric): void {
    // Integration with metrics services (Prometheus, DataDog, etc.)
    const metricsUrl = process.env.SPIRIT_METRICS_URL
    if (metricsUrl) {
      fetch(metricsUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(metric)
      }).catch(error => {
        console.error('Failed to send metric to external service:', error)
      })
    }
  }

  /**
   * Categorize errors for better tracking
   */
  private categorizeError(error: string): string {
    const errorLower = error.toLowerCase()
    
    if (errorLower.includes('network') || errorLower.includes('timeout')) {
      return 'Network/Timeout'
    }
    
    if (errorLower.includes('auth') || errorLower.includes('permission')) {
      return 'Authentication/Authorization'
    }
    
    if (errorLower.includes('validation') || errorLower.includes('invalid')) {
      return 'Validation'
    }
    
    if (errorLower.includes('ipfs') || errorLower.includes('pinata')) {
      return 'IPFS/Storage'
    }
    
    if (errorLower.includes('contract') || errorLower.includes('blockchain')) {
      return 'Blockchain/Contract'
    }
    
    if (errorLower.includes('database') || errorLower.includes('sql')) {
      return 'Database'
    }
    
    return 'Other'
  }
}

// Singleton instance
export const spiritObservability = new SpiritObservability()

// Convenience functions for common operations
export const spiritMetrics = {
  /**
   * Time and track a Spirit operation
   */
  async track<T>(
    operation: string,
    agentId: string,
    trainerId: string,
    fn: () => Promise<T>,
    metadata?: Record<string, any>
  ): Promise<T> {
    const startTime = Date.now()
    
    spiritObservability.log('INFO', operation, agentId, trainerId, `Starting ${operation}`, metadata)
    
    try {
      const result = await fn()
      
      spiritObservability.recordMetric(operation, agentId, trainerId, startTime, true, undefined, metadata)
      spiritObservability.log('INFO', operation, agentId, trainerId, `Completed ${operation}`, {
        ...metadata,
        duration: Date.now() - startTime
      })
      
      return result
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      
      spiritObservability.recordMetric(operation, agentId, trainerId, startTime, false, errorMessage, metadata)
      spiritObservability.log('ERROR', operation, agentId, trainerId, `Failed ${operation}: ${errorMessage}`, {
        ...metadata,
        duration: Date.now() - startTime,
        error: errorMessage
      })
      
      throw error
    }
  },

  /**
   * Log information
   */
  info(operation: string, agentId: string, trainerId: string, message: string, context?: Record<string, any>): void {
    spiritObservability.log('INFO', operation, agentId, trainerId, message, context)
  },

  /**
   * Log warning
   */
  warn(operation: string, agentId: string, trainerId: string, message: string, context?: Record<string, any>): void {
    spiritObservability.log('WARN', operation, agentId, trainerId, message, context)
  },

  /**
   * Log error
   */
  error(operation: string, agentId: string, trainerId: string, message: string, context?: Record<string, any>): void {
    spiritObservability.log('ERROR', operation, agentId, trainerId, message, context)
  },

  /**
   * Get current analytics
   */
  getAnalytics: (timeWindow?: number) => spiritObservability.getAnalytics(timeWindow),

  /**
   * Get filtered logs
   */
  getLogs: (filters?: any) => spiritObservability.getLogs(filters),

  /**
   * Check for alerts
   */
  checkAlerts: () => spiritObservability.checkAlerts(),

  /**
   * Export metrics in various formats
   */
  export: () => spiritObservability.exportMetrics()
}

export type { SpiritMetric, SpiritLog }