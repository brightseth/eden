'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AlertCircle, CheckCircle, Clock, RefreshCw, Zap, Database, Globe, Users } from 'lucide-react'

interface ServiceStatus {
  name: string
  status: 'healthy' | 'degraded' | 'unhealthy'
  lastCheck: string
  responseTime: number
  uptime: number
  endpoint: string
  dependencies: string[]
}

interface TestResult {
  category: string
  name: string
  status: 'passed' | 'failed' | 'running'
  duration: number
  error?: string
  details?: any
}

interface RegistryHealth {
  status: 'healthy' | 'degraded' | 'unhealthy'
  version: string
  database: 'connected' | 'disconnected'
  agents: number
  responseTime: number
  uptime: number
}

export default function RegistryDashboard() {
  const [registryHealth, setRegistryHealth] = useState<RegistryHealth | null>(null)
  const [services, setServices] = useState<ServiceStatus[]>([])
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const [autoRefresh, setAutoRefresh] = useState(true)

  const fetchRegistryHealth = async () => {
    try {
      const response = await fetch('/api/v1/registry/health')
      if (response.ok) {
        const data = await response.json()
        setRegistryHealth(data)
      }
    } catch (error) {
      setRegistryHealth({
        status: 'unhealthy',
        version: 'unknown',
        database: 'disconnected',
        agents: 0,
        responseTime: 0,
        uptime: 0
      })
    }
  }

  const fetchServiceStatuses = async () => {
    try {
      const response = await fetch('/api/v1/registry/services')
      if (response.ok) {
        const data = await response.json()
        setServices(data)
      }
    } catch (error) {
      setServices([
        {
          name: 'Academy UI',
          status: 'unhealthy',
          lastCheck: new Date().toISOString(),
          responseTime: 0,
          uptime: 0,
          endpoint: 'https://eden-academy-flame.vercel.app',
          dependencies: ['Registry API', 'Generated SDK']
        },
        {
          name: 'Amanda Prototype',
          status: 'unhealthy',
          lastCheck: new Date().toISOString(),
          responseTime: 0,
          uptime: 0,
          endpoint: 'http://localhost:3001',
          dependencies: ['Registry API', 'Claude SDK', '11Labs']
        }
      ])
    }
  }

  const runTests = async () => {
    setTestResults([])
    const testCategories = ['integration', 'contract', 'fallback', 'e2e']
    
    for (const category of testCategories) {
      setTestResults(prev => [...prev, {
        category,
        name: `${category.charAt(0).toUpperCase() + category.slice(1)} Tests`,
        status: 'running',
        duration: 0
      }])

      try {
        const startTime = Date.now()
        const response = await fetch(`/api/v1/registry/test/${category}`, {
          method: 'POST'
        })
        const duration = Date.now() - startTime
        const result = await response.json()

        setTestResults(prev => prev.map(test => 
          test.category === category 
            ? {
                ...test,
                status: result.success ? 'passed' : 'failed',
                duration,
                error: result.error,
                details: result.details
              }
            : test
        ))
      } catch (error) {
        setTestResults(prev => prev.map(test => 
          test.category === category 
            ? {
                ...test,
                status: 'failed',
                duration: 0,
                error: 'Network error'
              }
            : test
        ))
      }
    }
  }

  const refreshData = async () => {
    setIsLoading(true)
    await Promise.all([
      fetchRegistryHealth(),
      fetchServiceStatuses()
    ])
    setLastUpdate(new Date())
    setIsLoading(false)
  }

  useEffect(() => {
    refreshData()
  }, [])

  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(refreshData, 30000) // Refresh every 30 seconds
    return () => clearInterval(interval)
  }, [autoRefresh])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': case 'passed': return 'text-green-600 bg-green-50'
      case 'degraded': return 'text-yellow-600 bg-yellow-50'
      case 'unhealthy': case 'failed': return 'text-red-600 bg-red-50'
      case 'running': return 'text-blue-600 bg-blue-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': case 'passed': return <CheckCircle className="h-4 w-4" />
      case 'degraded': return <AlertCircle className="h-4 w-4" />
      case 'unhealthy': case 'failed': return <AlertCircle className="h-4 w-4" />
      case 'running': return <Clock className="h-4 w-4" />
      default: return <AlertCircle className="h-4 w-4" />
    }
  }

  const overallHealth = registryHealth?.status === 'healthy' && 
    services.every(s => s.status === 'healthy') ? 'healthy' : 'degraded'

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Registry Health Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor Eden Registry and dependent services
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={autoRefresh ? 'bg-green-50' : ''}
          >
            {autoRefresh ? 'Auto Refresh ON' : 'Auto Refresh OFF'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={refreshData}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Overall Status */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              {getStatusIcon(overallHealth)}
              System Status
            </CardTitle>
            <Badge className={getStatusColor(overallHealth)}>
              {overallHealth.toUpperCase()}
            </Badge>
          </div>
          <CardDescription>
            Last updated: {lastUpdate.toLocaleString()}
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="tests">Tests</TabsTrigger>
          <TabsTrigger value="agents">Agents</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Registry Health */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Registry Core
              </CardTitle>
            </CardHeader>
            <CardContent>
              {registryHealth ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-sm font-medium">Status</div>
                    <Badge className={getStatusColor(registryHealth.status)}>
                      {registryHealth.status}
                    </Badge>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Database</div>
                    <Badge className={getStatusColor(registryHealth.database === 'connected' ? 'healthy' : 'unhealthy')}>
                      {registryHealth.database}
                    </Badge>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Response Time</div>
                    <div className="text-lg font-semibold">{registryHealth.responseTime}ms</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Agents</div>
                    <div className="text-lg font-semibold">{registryHealth.agents}</div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  Loading Registry health...
                </div>
              )}
            </CardContent>
          </Card>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {services.map((service) => (
              <Card key={service.name}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      {service.name}
                    </span>
                    <Badge className={getStatusColor(service.status)}>
                      {service.status}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Response Time</span>
                      <span className="font-medium">{service.responseTime}ms</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Uptime</span>
                      <span className="font-medium">{service.uptime.toFixed(1)}%</span>
                    </div>
                    <Progress value={service.uptime} className="h-2" />
                    <div className="text-xs text-muted-foreground">
                      Dependencies: {service.dependencies.join(', ')}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="services" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Service Dependencies</CardTitle>
              <CardDescription>
                All services depending on Eden Registry
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {services.map((service) => (
                  <div key={service.name} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{service.name}</h3>
                      <Badge className={getStatusColor(service.status)}>
                        {getStatusIcon(service.status)}
                        {service.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Endpoint:</span>
                        <div className="font-mono">{service.endpoint}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Last Check:</span>
                        <div>{new Date(service.lastCheck).toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tests" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Registry Test Suite</CardTitle>
              <CardDescription>
                Comprehensive tests for Registry integration
              </CardDescription>
              <Button onClick={runTests} className="w-fit">
                <Zap className="h-4 w-4 mr-2" />
                Run All Tests
              </Button>
            </CardHeader>
            <CardContent>
              {testResults.length > 0 ? (
                <div className="space-y-3">
                  {testResults.map((test) => (
                    <div key={test.category} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(test.status)}
                          <span className="font-medium">{test.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {test.duration > 0 && (
                            <span className="text-sm text-muted-foreground">
                              {test.duration}ms
                            </span>
                          )}
                          <Badge className={getStatusColor(test.status)}>
                            {test.status}
                          </Badge>
                        </div>
                      </div>
                      {test.error && (
                        <div className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded">
                          {test.error}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  Click "Run All Tests" to execute the Registry test suite
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="agents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Agent Registry Status
              </CardTitle>
              <CardDescription>
                All agents registered in Eden Registry
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center text-muted-foreground py-8">
                Loading agent data from Registry...
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}