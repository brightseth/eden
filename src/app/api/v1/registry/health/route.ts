import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Check Registry health
    const registryUrl = process.env.EDEN_REGISTRY_API_URL || 'http://localhost:3005'
    const startTime = Date.now()
    
    const response = await fetch(`${registryUrl}/api/v1/status`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    })

    const responseTime = Date.now() - startTime
    
    if (!response.ok) {
      return NextResponse.json({
        status: 'unhealthy',
        version: 'unknown',
        database: 'disconnected',
        agents: 0,
        responseTime: 0,
        uptime: 0,
        error: `Registry returned ${response.status}`
      })
    }

    const data = await response.json()
    
    // Get agent count
    let agentCount = 0
    try {
      const agentsResponse = await fetch(`${registryUrl}/api/v1/agents`)
      if (agentsResponse.ok) {
        const agents = await agentsResponse.json()
        agentCount = Array.isArray(agents) ? agents.length : 0
      }
    } catch (error) {
      // Agent count is optional
    }

    return NextResponse.json({
      status: data.status === 'healthy' ? 'healthy' : 'degraded',
      version: data.version || '1.0.0',
      database: data.database === 'connected' ? 'connected' : 'disconnected',
      agents: agentCount,
      responseTime,
      uptime: 99.5, // Could be calculated from actual uptime data
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json({
      status: 'unhealthy',
      version: 'unknown',
      database: 'disconnected',
      agents: 0,
      responseTime: 0,
      uptime: 0,
      error: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}