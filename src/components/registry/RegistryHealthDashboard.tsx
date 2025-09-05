'use client'

// Registry Health Dashboard Component
// Real-time monitoring of Gateway, Registry, Cache, and Data Flow

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy' | 'loading'
  circuitBreaker: {
    failures: number
    isOpen: boolean
    lastFailure: number
  }
  cache: {
    redis: boolean
    fallback: boolean
    memorySize: number
    totalEntries: number
    hitRate?: number
  }
}

interface ConsistencyReport {
  timestamp: string
  summary: {
    totalChecks: number
    passed: number
    failed: number
    warnings: number
  }
  checks: Array<{
    name: string
    status: 'pass' | 'fail' | 'warning'
    message: string
  }>
}

export default function RegistryHealthDashboard() {
  const [health, setHealth] = useState<HealthStatus>({
    status: 'loading',
    circuitBreaker: { failures: 0, isOpen: false, lastFailure: 0 },
    cache: { redis: false, fallback: false, memorySize: 0, totalEntries: 0 }
  })
  
  const [consistency, setConsistency] = useState<ConsistencyReport | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [autoRefresh, setAutoRefresh] = useState(true)

  const fetchHealth = async () => {
    try {
      const { registryGateway } = await import('@/lib/registry/gateway')
      const healthData = await registryGateway.healthCheck()
      setHealth({
        status: healthData.status,
        circuitBreaker: {
          failures: (healthData.circuitBreaker as any)?.failures || 0,
          isOpen: (healthData.circuitBreaker as any)?.isOpen || false,
          lastFailure: (healthData.circuitBreaker as any)?.lastFailure || 0
        },
        cache: healthData.cache
      })
    } catch (error) {
      console.error('Failed to fetch health:', error)
      setHealth(prev => ({ ...prev, status: 'unhealthy' }))
    }
  }

  const fetchConsistency = async () => {
    try {
      const { checkConsistency } = await import('@/lib/registry/monitor')
      const report = await checkConsistency()
      setConsistency(report)
    } catch (error) {
      console.error('Failed to fetch consistency:', error)
    }
  }

  const refresh = async () => {
    setIsRefreshing(true)
    await Promise.all([fetchHealth(), fetchConsistency()])
    setIsRefreshing(false)
  }

  useEffect(() => {
    refresh()
    
    if (autoRefresh) {
      const interval = setInterval(refresh, 10000) // Every 10 seconds
      return () => clearInterval(interval)
    }
  }, [autoRefresh])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': case 'pass': return 'bg-green-500'
      case 'degraded': case 'warning': return 'bg-yellow-500'
      case 'unhealthy': case 'fail': return 'bg-red-500'
      case 'loading': return 'bg-gray-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': case 'pass': return '✓'
      case 'degraded': case 'warning': return '⚠'
      case 'unhealthy': case 'fail': return '✗'
      case 'loading': return '⟳'
      default: return '?'
    }
  }

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Registry Health Dashboard</h1>
        <div className="flex gap-2">
          <Button
            onClick={refresh}
            disabled={isRefreshing}
            variant="outline"
          >
            {isRefreshing ? '⟳' : '🔄'} Refresh
          </Button>
          <Button
            onClick={() => setAutoRefresh(!autoRefresh)}
            variant={autoRefresh ? 'default' : 'outline'}
          >
            Auto-refresh: {autoRefresh ? 'ON' : 'OFF'}
          </Button>
        </div>
      </div>

      {/* Overall Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className={`w-4 h-4 rounded-full ${getStatusColor(health.status)}`} />
            Registry Gateway Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h4 className="font-semibold text-sm text-gray-600 mb-2">Overall Status</h4>
              <Badge className={`${getStatusColor(health.status)} text-white`}>
                {getStatusIcon(health.status)} {health.status.toUpperCase()}
              </Badge>
            </div>
            <div>
              <h4 className="font-semibold text-sm text-gray-600 mb-2">Circuit Breaker</h4>
              <div className="text-sm">
                <div>Failures: {health.circuitBreaker.failures}</div>
                <div>Status: {health.circuitBreaker.isOpen ? '🔴 OPEN' : '🟢 CLOSED'}</div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-sm text-gray-600 mb-2">Last Updated</h4>
              <div className="text-sm text-gray-500">
                {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cache Status */}
      <Card>
        <CardHeader>
          <CardTitle>Cache Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <h4 className="font-semibold text-sm text-gray-600 mb-2">Redis Status</h4>
              <Badge className={health.cache.redis ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}>
                {health.cache.redis ? '✓ Connected' : '✗ Disconnected'}
              </Badge>
            </div>
            <div>
              <h4 className="font-semibold text-sm text-gray-600 mb-2">Fallback Cache</h4>
              <Badge className={health.cache.fallback ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}>
                {health.cache.fallback ? '✓ Active' : '✗ Inactive'}
              </Badge>
            </div>
            <div>
              <h4 className="font-semibold text-sm text-gray-600 mb-2">Memory Entries</h4>
              <div className="text-lg font-mono">{health.cache.memorySize}</div>
            </div>
            <div>
              <h4 className="font-semibold text-sm text-gray-600 mb-2">Total Entries</h4>
              <div className="text-lg font-mono">{health.cache.totalEntries}</div>
            </div>
          </div>
          
          {health.cache.hitRate && (
            <div className="mt-4">
              <h4 className="font-semibold text-sm text-gray-600 mb-2">Cache Hit Rate</h4>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${health.cache.hitRate}%` }}
                  />
                </div>
                <span className="font-mono text-sm">{health.cache.hitRate.toFixed(1)}%</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Data Consistency */}
      {consistency && (
        <Card>
          <CardHeader>
            <CardTitle>Data Consistency Report</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <h4 className="font-semibold text-sm text-gray-600 mb-2">Total Checks</h4>
                <div className="text-lg font-mono">{consistency.summary.totalChecks}</div>
              </div>
              <div>
                <h4 className="font-semibold text-sm text-gray-600 mb-2">Passed</h4>
                <div className="text-lg font-mono text-green-600">{consistency.summary.passed}</div>
              </div>
              <div>
                <h4 className="font-semibold text-sm text-gray-600 mb-2">Warnings</h4>
                <div className="text-lg font-mono text-yellow-600">{consistency.summary.warnings}</div>
              </div>
              <div>
                <h4 className="font-semibold text-sm text-gray-600 mb-2">Failed</h4>
                <div className="text-lg font-mono text-red-600">{consistency.summary.failed}</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold text-sm text-gray-600">Check Details</h4>
              {consistency.checks.map((check, index) => (
                <div key={index} className="flex items-center gap-3 p-2 border rounded">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(check.status)}`} />
                  <div className="font-medium">{check.name}</div>
                  <div className="text-sm text-gray-600 flex-1">{check.message}</div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 text-xs text-gray-500">
              Last checked: {new Date(consistency.timestamp).toLocaleString()}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              onClick={async () => {
                try {
                  const { registryGateway } = await import('@/lib/registry/gateway')
                  await registryGateway.clearCache()
                  await refresh()
                } catch (error) {
                  console.error('Failed to clear cache:', error)
                }
              }}
              variant="outline"
              className="w-full"
            >
              🗑️ Clear Cache
            </Button>
            <Button
              onClick={async () => {
                try {
                  const { registryGateway } = await import('@/lib/registry/gateway')
                  await registryGateway.resetCircuitBreaker()
                  await refresh()
                } catch (error) {
                  console.error('Failed to reset circuit breaker:', error)
                }
              }}
              variant="outline"
              className="w-full"
            >
              🔄 Reset Circuit Breaker
            </Button>
            <Button
              onClick={() => window.open('/api/registry/health', '_blank')}
              variant="outline"
              className="w-full"
            >
              📊 Raw Health API
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}