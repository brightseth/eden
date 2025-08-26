import { NextRequest, NextResponse } from 'next/server'

interface Metric {
  timestamp: string
  value: number
  labels?: { [key: string]: string }
}

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

// Simulated metrics store
let metricsStore = new Map<string, Metric[]>()
let startTime = Date.now()

// Initialize with some baseline metrics
initializeMetrics()

function initializeMetrics() {
  const now = Date.now()
  const baseTime = now - 24 * 60 * 60 * 1000 // 24 hours ago
  
  // Generate historical data points every 5 minutes
  for (let i = 0; i < 288; i++) { // 24 hours / 5 minutes = 288 points
    const timestamp = new Date(baseTime + i * 5 * 60 * 1000).toISOString()
    
    // Registry metrics
    addMetricPoint('registry.uptime', timestamp, 1)
    addMetricPoint('registry.requests', timestamp, Math.floor(Math.random() * 100) + 50)
    addMetricPoint('registry.error_rate', timestamp, Math.random() * 5)
    addMetricPoint('registry.response_time', timestamp, Math.random() * 200 + 50)
    addMetricPoint('registry.connections', timestamp, Math.floor(Math.random() * 20) + 5)
    
    // Agent metrics
    addMetricPoint('agents.total', timestamp, 12)
    addMetricPoint('agents.active', timestamp, Math.floor(Math.random() * 8) + 4)
    addMetricPoint('agents.response_time', timestamp, Math.random() * 1000 + 200)
    addMetricPoint('agents.deployments', timestamp, Math.random() > 0.8 ? 1 : 0)
    
    // System metrics
    addMetricPoint('system.memory', timestamp, Math.random() * 40 + 30)
    addMetricPoint('system.cpu', timestamp, Math.random() * 60 + 10)
    addMetricPoint('system.disk', timestamp, Math.random() * 20 + 40)
    addMetricPoint('system.network_in', timestamp, Math.random() * 1000000)
    addMetricPoint('system.network_out', timestamp, Math.random() * 800000)
  }
}

function addMetricPoint(metric: string, timestamp: string, value: number, labels?: { [key: string]: string }) {
  if (!metricsStore.has(metric)) {
    metricsStore.set(metric, [])
  }
  
  const points = metricsStore.get(metric)!
  points.push({ timestamp, value, labels })
  
  // Keep only last 1000 points per metric
  if (points.length > 1000) {
    points.splice(0, points.length - 1000)
  }
}

// GET /api/metrics - Get metrics data
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const metric = searchParams.get('metric')
  const range = searchParams.get('range') || '1h'
  const summary = searchParams.get('summary')

  try {
    if (summary === 'true') {
      // Return summary metrics
      const registryMetrics = getMetricSummary('registry')
      const agentMetrics = getMetricSummary('agents')
      const systemMetrics = getMetricSummary('system')
      
      const metricsSummary: MetricsSummary = {
        registry: {
          uptime: Math.floor((Date.now() - startTime) / 1000),
          totalRequests: getLatestMetricValue('registry.requests') * 24 * 12, // Approximate daily total
          errorRate: getLatestMetricValue('registry.error_rate'),
          avgResponseTime: getLatestMetricValue('registry.response_time'),
          activeConnections: getLatestMetricValue('registry.connections')
        },
        agents: {
          total: getLatestMetricValue('agents.total'),
          active: getLatestMetricValue('agents.active'),
          inactive: getLatestMetricValue('agents.total') - getLatestMetricValue('agents.active'),
          avgResponseTime: getLatestMetricValue('agents.response_time'),
          deploymentSuccess: Math.random() * 100 // Simulate success rate
        },
        system: {
          memoryUsage: getLatestMetricValue('system.memory'),
          cpuUsage: getLatestMetricValue('system.cpu'),
          diskUsage: getLatestMetricValue('system.disk'),
          networkIn: getLatestMetricValue('system.network_in'),
          networkOut: getLatestMetricValue('system.network_out')
        }
      }
      
      return NextResponse.json({
        success: true,
        summary: metricsSummary
      })
    }

    if (metric) {
      // Return specific metric data
      const data = metricsStore.get(metric) || []
      const filteredData = filterMetricsByRange(data, range)
      
      return NextResponse.json({
        success: true,
        metric,
        range,
        data: filteredData
      })
    }

    // Return all available metrics
    const availableMetrics = Array.from(metricsStore.keys()).map(key => {
      const data = metricsStore.get(key) || []
      return {
        name: key,
        points: data.length,
        latestValue: data[data.length - 1]?.value || 0,
        latestTimestamp: data[data.length - 1]?.timestamp
      }
    })

    return NextResponse.json({
      success: true,
      metrics: availableMetrics,
      totalMetrics: availableMetrics.length
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch metrics'
    }, { status: 500 })
  }
}

// POST /api/metrics - Add new metric data
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { metric, value, labels, timestamp } = body
    
    if (!metric || value === undefined) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: metric, value'
      }, { status: 400 })
    }
    
    const ts = timestamp || new Date().toISOString()
    addMetricPoint(metric, ts, value, labels)
    
    return NextResponse.json({
      success: true,
      message: `Metric ${metric} recorded`,
      timestamp: ts,
      value
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to record metric'
    }, { status: 500 })
  }
}

// Helper functions
function getLatestMetricValue(metric: string): number {
  const data = metricsStore.get(metric)
  if (!data || data.length === 0) return 0
  return data[data.length - 1].value
}

function getMetricSummary(prefix: string) {
  const metrics = Array.from(metricsStore.keys())
    .filter(key => key.startsWith(prefix))
  
  return metrics.reduce((acc, key) => {
    acc[key] = getLatestMetricValue(key)
    return acc
  }, {} as { [key: string]: number })
}

function filterMetricsByRange(data: Metric[], range: string): Metric[] {
  const now = Date.now()
  let cutoffTime: number
  
  switch (range) {
    case '15m':
      cutoffTime = now - 15 * 60 * 1000
      break
    case '1h':
      cutoffTime = now - 60 * 60 * 1000
      break
    case '4h':
      cutoffTime = now - 4 * 60 * 60 * 1000
      break
    case '24h':
      cutoffTime = now - 24 * 60 * 60 * 1000
      break
    case '7d':
      cutoffTime = now - 7 * 24 * 60 * 60 * 1000
      break
    default:
      cutoffTime = now - 60 * 60 * 1000 // Default to 1 hour
  }
  
  return data.filter(point => new Date(point.timestamp).getTime() >= cutoffTime)
}

// Background task to generate real-time metrics
setInterval(() => {
  const now = new Date().toISOString()
  
  // Update current metrics
  addMetricPoint('registry.requests', now, Math.floor(Math.random() * 20) + 10)
  addMetricPoint('registry.error_rate', now, Math.random() * 3)
  addMetricPoint('registry.response_time', now, Math.random() * 100 + 30)
  addMetricPoint('registry.connections', now, Math.floor(Math.random() * 5) + getLatestMetricValue('registry.connections') * 0.9)
  
  addMetricPoint('agents.active', now, Math.floor(Math.random() * 3) + Math.max(1, getLatestMetricValue('agents.active') - 1))
  addMetricPoint('agents.response_time', now, Math.random() * 500 + 100)
  
  addMetricPoint('system.memory', now, getLatestMetricValue('system.memory') + (Math.random() - 0.5) * 5)
  addMetricPoint('system.cpu', now, Math.max(0, Math.min(100, getLatestMetricValue('system.cpu') + (Math.random() - 0.5) * 10)))
  addMetricPoint('system.network_in', now, Math.random() * 500000)
  addMetricPoint('system.network_out', now, Math.random() * 400000)
}, 30000) // Update every 30 seconds