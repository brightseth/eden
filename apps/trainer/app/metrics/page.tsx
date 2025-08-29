'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Activity, Database, Users, Server, Zap, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react'

interface MetricsSummary {
  registry: {
    uptime: number
    totalRequests: number
    errorRate: number
    avgResponseTime: number
    activeConnections: number
  }
  agents: {
    total: number
    active: number
    inactive: number
    avgResponseTime: number
    deploymentSuccess: number
  }
  system: {
    memoryUsage: number
    cpuUsage: number
    diskUsage: number
    networkIn: number
    networkOut: number
  }
}

interface Metric {
  timestamp: string
  value: number
}

export default function MetricsDashboard() {
  const [summary, setSummary] = useState<MetricsSummary | null>(null)
  const [selectedRange, setSelectedRange] = useState('1h')
  const [metricData, setMetricData] = useState<{ [key: string]: Metric[] }>({})
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  useEffect(() => {
    fetchMetrics()
    
    // Poll for updates every 30 seconds
    const interval = setInterval(() => {
      fetchMetrics()
    }, 30000)

    return () => clearInterval(interval)
  }, [selectedRange])

  const fetchMetrics = async () => {
    try {
      // Fetch summary
      const summaryResponse = await fetch('/api/metrics?summary=true')
      if (summaryResponse.ok) {
        const summaryData = await summaryResponse.json()
        setSummary(summaryData.summary)
      }

      // Fetch time series data for charts
      const metrics = [
        'registry.requests',
        'registry.response_time',
        'registry.error_rate',
        'registry.connections',
        'agents.active',
        'agents.response_time',
        'system.memory',
        'system.cpu',
        'system.network_in',
        'system.network_out'
      ]

      const metricPromises = metrics.map(async (metric) => {
        const response = await fetch(`/api/metrics?metric=${metric}&range=${selectedRange}`)
        if (response.ok) {
          const data = await response.json()
          return { [metric]: data.data }
        }
        return { [metric]: [] }
      })

      const results = await Promise.all(metricPromises)
      const combinedData = results.reduce((acc, result) => ({ ...acc, ...result }), {})
      setMetricData(combinedData)
      
      setLastUpdated(new Date())
    } catch (error) {
      console.error('Failed to fetch metrics:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / (24 * 60 * 60))
    const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60))
    const minutes = Math.floor((seconds % (60 * 60)) / 60)
    
    if (days > 0) return `${days}d ${hours}h ${minutes}m`
    if (hours > 0) return `${hours}h ${minutes}m`
    return `${minutes}m`
  }

  const formatBytes = (bytes: number) => {
    const sizes = ['B', 'KB', 'MB', 'GB']
    if (bytes === 0) return '0 B'
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toFixed(0)
  }

  const getHealthStatus = (errorRate: number, responseTime: number) => {
    if (errorRate > 5 || responseTime > 1000) return 'degraded'
    if (errorRate > 2 || responseTime > 500) return 'warning'
    return 'healthy'
  }

  const healthStatus = summary ? getHealthStatus(summary.registry.errorRate, summary.registry.avgResponseTime) : 'loading'
  const healthColor = {
    healthy: 'text-green-600',
    warning: 'text-yellow-600',
    degraded: 'text-red-600',
    loading: 'text-gray-600'
  }[healthStatus]

  const healthIcon = {
    healthy: <CheckCircle className="h-5 w-5 text-green-600" />,
    warning: <AlertTriangle className="h-5 w-5 text-yellow-600" />,
    degraded: <AlertTriangle className="h-5 w-5 text-red-600" />,
    loading: <Activity className="h-5 w-5 text-gray-600" />
  }[healthStatus]

  // Prepare chart data
  const prepareChartData = (metrics: { [key: string]: Metric[] }, keys: string[]) => {
    if (!metrics || keys.some(key => !metrics[key])) return []
    
    const timestamps = Array.from(new Set(
      keys.flatMap(key => metrics[key]?.map(m => m.timestamp) || [])
    )).sort()

    return timestamps.map(timestamp => {
      const point: any = { timestamp: new Date(timestamp).toLocaleTimeString() }
      keys.forEach(key => {
        const metric = metrics[key]?.find(m => m.timestamp === timestamp)
        point[key] = metric?.value || 0
      })
      return point
    })
  }

  const registryChartData = prepareChartData(metricData, ['registry.requests', 'registry.response_time'])
  const systemChartData = prepareChartData(metricData, ['system.memory', 'system.cpu'])
  const networkChartData = prepareChartData(metricData, ['system.network_in', 'system.network_out'])

  // Agent status pie chart data
  const agentStatusData = summary ? [
    { name: 'Active', value: summary.agents.active, color: '#10b981' },
    { name: 'Inactive', value: summary.agents.inactive, color: '#6b7280' }
  ] : []

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Registry Metrics</h1>
          <p className="text-muted-foreground">
            Performance and health monitoring dashboard
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {healthIcon}
            <span className={`font-medium ${healthColor}`}>
              {healthStatus.charAt(0).toUpperCase() + healthStatus.slice(1)}
            </span>
          </div>
          <Select value={selectedRange} onValueChange={setSelectedRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="15m">15 minutes</SelectItem>
              <SelectItem value="1h">1 hour</SelectItem>
              <SelectItem value="4h">4 hours</SelectItem>
              <SelectItem value="24h">24 hours</SelectItem>
              <SelectItem value="7d">7 days</SelectItem>
            </SelectContent>
          </Select>
          <div className="text-sm text-muted-foreground">
            Updated: {lastUpdated.toLocaleTimeString()}
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Uptime</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatUptime(summary.registry.uptime)}</div>
              <p className="text-xs text-muted-foreground">
                {summary.registry.activeConnections} active connections
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(summary.registry.totalRequests)}</div>
              <p className="text-xs text-muted-foreground">
                {summary.registry.avgResponseTime.toFixed(0)}ms avg response
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Agents</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.agents.active}</div>
              <p className="text-xs text-muted-foreground">
                of {summary.agents.total} total agents
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.registry.errorRate.toFixed(2)}%</div>
              <p className="text-xs text-muted-foreground">
                {summary.agents.deploymentSuccess.toFixed(1)}% deployment success
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="registry" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="registry">Registry</TabsTrigger>
          <TabsTrigger value="agents">Agents</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
          <TabsTrigger value="network">Network</TabsTrigger>
        </TabsList>

        <TabsContent value="registry" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Registry Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Request Volume & Response Time</CardTitle>
                <CardDescription>Registry API performance metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={registryChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="timestamp" />
                    <YAxis yAxisId="requests" orientation="left" />
                    <YAxis yAxisId="time" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Line
                      yAxisId="requests"
                      type="monotone"
                      dataKey="registry.requests"
                      stroke="#3b82f6"
                      name="Requests/min"
                      strokeWidth={2}
                    />
                    <Line
                      yAxisId="time"
                      type="monotone"
                      dataKey="registry.response_time"
                      stroke="#ef4444"
                      name="Response Time (ms)"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Error Rate */}
            <Card>
              <CardHeader>
                <CardTitle>Error Rate</CardTitle>
                <CardDescription>Registry error rate over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={prepareChartData(metricData, ['registry.error_rate'])}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="timestamp" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="registry.error_rate"
                      stroke="#ef4444"
                      fill="#fef2f2"
                      name="Error Rate (%)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="agents" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Agent Status Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Agent Status</CardTitle>
                <CardDescription>Distribution of active vs inactive agents</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={agentStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {agentStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Agent Response Times */}
            <Card>
              <CardHeader>
                <CardTitle>Agent Response Times</CardTitle>
                <CardDescription>Average agent response latency</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={prepareChartData(metricData, ['agents.response_time'])}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="timestamp" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="agents.response_time"
                      stroke="#8b5cf6"
                      name="Response Time (ms)"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* System Resources */}
            <Card>
              <CardHeader>
                <CardTitle>System Resources</CardTitle>
                <CardDescription>Memory and CPU utilization</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={systemChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="timestamp" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="system.memory"
                      stroke="#10b981"
                      name="Memory (%)"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="system.cpu"
                      stroke="#f59e0b"
                      name="CPU (%)"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* System Health Summary */}
            <Card>
              <CardHeader>
                <CardTitle>System Health</CardTitle>
                <CardDescription>Current system status overview</CardDescription>
              </CardHeader>
              <CardContent>
                {summary && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Memory Usage</span>
                      <span className="text-2xl font-bold">{summary.system.memoryUsage.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">CPU Usage</span>
                      <span className="text-2xl font-bold">{summary.system.cpuUsage.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Disk Usage</span>
                      <span className="text-2xl font-bold">{summary.system.diskUsage.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Network In</span>
                      <span className="text-2xl font-bold">{formatBytes(summary.system.networkIn)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Network Out</span>
                      <span className="text-2xl font-bold">{formatBytes(summary.system.networkOut)}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="network" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Network Traffic</CardTitle>
              <CardDescription>Inbound and outbound network activity</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={networkChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="timestamp" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatBytes(Number(value))} />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="system.network_in"
                    stackId="1"
                    stroke="#3b82f6"
                    fill="#dbeafe"
                    name="Network In"
                  />
                  <Area
                    type="monotone"
                    dataKey="system.network_out"
                    stackId="1"
                    stroke="#ef4444"
                    fill="#fef2f2"
                    name="Network Out"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}