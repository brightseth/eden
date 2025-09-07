/**
 * Spirit Observability Dashboard API
 * 
 * Provides metrics, logs, and analytics for Spirit operations
 * Used for monitoring multiple trainer usage and system health
 */

import { NextRequest, NextResponse } from 'next/server'
import { spiritMetrics } from '@/lib/observability/spirit-metrics'

// Admin authentication (simple API key for now)
function isAuthorized(request: NextRequest): boolean {
  const apiKey = request.headers.get('X-Admin-API-Key')
  const expectedKey = process.env.ADMIN_API_KEY || 'admin-dev-key'
  return apiKey === expectedKey
}

export async function GET(request: NextRequest) {
  // Check authorization
  if (!isAuthorized(request)) {
    return NextResponse.json(
      { error: 'Unauthorized - Invalid admin API key' },
      { status: 401 }
    )
  }

  const { searchParams } = new URL(request.url)
  const format = searchParams.get('format') || 'json'
  const timeWindow = parseInt(searchParams.get('timeWindow') || '3600000') // Default 1 hour
  const operation = searchParams.get('operation')
  const trainerId = searchParams.get('trainerId')
  const agentId = searchParams.get('agentId')

  try {
    switch (format) {
      case 'prometheus':
        const prometheusData = spiritMetrics.export().prometheus
        return new Response(prometheusData, {
          headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'Cache-Control': 'no-cache'
          }
        })

      case 'csv':
        const csvData = spiritMetrics.export().csv
        return new Response(csvData, {
          headers: {
            'Content-Type': 'text/csv',
            'Content-Disposition': 'attachment; filename="spirit-metrics.csv"',
            'Cache-Control': 'no-cache'
          }
        })

      case 'analytics':
        const analytics = spiritMetrics.getAnalytics(timeWindow)
        return NextResponse.json({
          timeWindow,
          analytics,
          alerts: spiritMetrics.checkAlerts()
        })

      case 'logs':
        const logs = spiritMetrics.getLogs({
          operation,
          trainerId,
          agentId,
          timeWindow,
          limit: parseInt(searchParams.get('limit') || '100')
        })
        return NextResponse.json({ logs })

      default: // json
        const data = {
          timestamp: new Date().toISOString(),
          timeWindow,
          analytics: spiritMetrics.getAnalytics(timeWindow),
          alerts: spiritMetrics.checkAlerts(),
          recentLogs: spiritMetrics.getLogs({ limit: 50 })
        }
        
        return NextResponse.json(data, {
          headers: {
            'Cache-Control': 'no-cache'
          }
        })
    }
  } catch (error) {
    console.error('Error generating observability data:', error)
    return NextResponse.json(
      { error: 'Failed to generate observability data' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  // Check authorization
  if (!isAuthorized(request)) {
    return NextResponse.json(
      { error: 'Unauthorized - Invalid admin API key' },
      { status: 401 }
    )
  }

  try {
    const body = await request.json()
    const { action } = body

    switch (action) {
      case 'clear_cache':
        // Clear metrics and logs cache
        spiritMetrics.export() // This triggers internal cleanup
        return NextResponse.json({ 
          success: true, 
          message: 'Observability cache cleared' 
        })

      case 'generate_report':
        const { timeWindow = 86400000, format = 'json' } = body // Default 24 hours
        
        const report = {
          generatedAt: new Date().toISOString(),
          timeWindow,
          analytics: spiritMetrics.getAnalytics(timeWindow),
          alerts: spiritMetrics.checkAlerts(),
          summary: {
            totalOperations: spiritMetrics.getAnalytics(timeWindow).totalOperations,
            uniqueTrainers: Object.keys(spiritMetrics.getAnalytics(timeWindow).trainerActivity).length,
            errorRate: 1 - spiritMetrics.getAnalytics(timeWindow).successRate,
            avgResponseTime: spiritMetrics.getAnalytics(timeWindow).avgDuration
          }
        }

        if (format === 'prometheus') {
          return new Response(spiritMetrics.export().prometheus, {
            headers: { 'Content-Type': 'text/plain; charset=utf-8' }
          })
        }

        return NextResponse.json(report)

      case 'test_alert':
        // Generate test alert for monitoring system validation
        spiritMetrics.error('test_operation', 'test-agent-id', 'test-trainer', 'Test alert generated for monitoring validation')
        return NextResponse.json({ 
          success: true, 
          message: 'Test alert generated' 
        })

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Error processing observability request:', error)
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    )
  }
}

// Health check endpoint
export async function HEAD() {
  return new Response(null, { status: 200 })
}