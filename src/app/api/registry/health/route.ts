// Registry Health API Endpoint
// Provides JSON health data for monitoring

import { NextRequest, NextResponse } from 'next/server'
import { registryGateway } from '@/lib/registry'
import { checkConsistency } from '@/lib/registry/monitor'

export async function GET(request: NextRequest) {
  try {
    const includeConsistency = request.nextUrl.searchParams.get('consistency') === 'true'
    
    const health = await registryGateway.healthCheck()
    
    let consistency = null
    if (includeConsistency) {
      consistency = await checkConsistency()
    }

    const response = {
      timestamp: new Date().toISOString(),
      gateway: health,
      consistency,
      uptime: process.uptime(),
      version: process.env.npm_package_version || '1.0.0'
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Health check failed:', error)
    
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      error: 'Health check failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action } = body

    switch (action) {
      case 'clearCache':
        registryGateway.clearCache()
        return NextResponse.json({ success: true, message: 'Cache cleared' })
      
      case 'resetCircuitBreaker':
        registryGateway.resetCircuitBreaker()
        return NextResponse.json({ success: true, message: 'Circuit breaker reset' })
      
      default:
        return NextResponse.json(
          { error: 'Invalid action' }, 
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Health action failed:', error)
    
    return NextResponse.json({
      error: 'Action failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}