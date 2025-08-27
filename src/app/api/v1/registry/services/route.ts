import { NextResponse } from 'next/server'

interface ServiceCheck {
  name: string
  endpoint: string
  dependencies: string[]
  timeout?: number
}

const services: ServiceCheck[] = [
  {
    name: 'Academy UI',
    endpoint: 'https://eden-academy.vercel.app/api/health',
    dependencies: ['Registry API', 'Generated SDK'],
    timeout: 5000
  },
  {
    name: 'Amanda Prototype',
    endpoint: 'http://localhost:3001/api/health',
    dependencies: ['Registry API', 'Claude SDK', '11Labs'],
    timeout: 3000
  },
  {
    name: 'Registry Production',
    endpoint: 'https://eden-genesis-registry.vercel.app/api/v1/status',
    dependencies: ['Supabase Database', 'Vercel Functions'],
    timeout: 5000
  },
  {
    name: 'Registry Local',
    endpoint: 'http://localhost:3005/api/v1/status',
    dependencies: ['Local Database', 'Node.js'],
    timeout: 2000
  }
]

async function checkService(service: ServiceCheck) {
  const startTime = Date.now()
  
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), service.timeout || 5000)
    
    const response = await fetch(service.endpoint, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Eden-Registry-Dashboard/1.0'
      },
      signal: controller.signal,
      cache: 'no-store'
    })
    
    clearTimeout(timeout)
    const responseTime = Date.now() - startTime
    
    let status: 'healthy' | 'degraded' | 'unhealthy'
    let uptime = 0
    
    if (response.ok) {
      if (responseTime < 1000) {
        status = 'healthy'
        uptime = 99.5
      } else {
        status = 'degraded'
        uptime = 85.0
      }
    } else {
      status = 'unhealthy'
      uptime = 0
    }
    
    return {
      name: service.name,
      status,
      lastCheck: new Date().toISOString(),
      responseTime,
      uptime,
      endpoint: service.endpoint,
      dependencies: service.dependencies
    }
  } catch (error) {
    const responseTime = Date.now() - startTime
    
    return {
      name: service.name,
      status: 'unhealthy' as const,
      lastCheck: new Date().toISOString(),
      responseTime,
      uptime: 0,
      endpoint: service.endpoint,
      dependencies: service.dependencies,
      error: error instanceof Error ? error.message : 'Network error'
    }
  }
}

export async function GET() {
  try {
    const servicePromises = services.map(service => checkService(service))
    const results = await Promise.all(servicePromises)
    
    return NextResponse.json(results)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to check services' },
      { status: 500 }
    )
  }
}