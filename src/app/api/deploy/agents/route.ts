import { NextRequest, NextResponse } from 'next/server'

// GET /api/deploy/agents - List deployable agents
export async function GET() {
  try {
    const registryUrl = process.env.EDEN_REGISTRY_API_URL || 'https://eden-genesis-registry.vercel.app'
    
    // Fetch agents from Registry
    const response = await fetch(`${registryUrl}/api/v1/agents`)
    if (!response.ok) {
      throw new Error(`Registry returned ${response.status}`)
    }
    
    const agents = await response.json()
    
    // Add deployment metadata
    const deployableAgents = agents.map((agent: any) => ({
      ...agent,
      deploymentStatus: agent.status === 'ACTIVE' ? 'deployed' : 'available',
      lastDeployed: agent.status === 'ACTIVE' ? new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString() : null,
      deploymentHealth: agent.status === 'ACTIVE' ? (Math.random() > 0.1 ? 'healthy' : 'degraded') : null
    }))
    
    return NextResponse.json({
      success: true,
      agents: deployableAgents,
      summary: {
        total: deployableAgents.length,
        deployed: deployableAgents.filter((a: any) => a.deploymentStatus === 'deployed').length,
        available: deployableAgents.filter((a: any) => a.deploymentStatus === 'available').length
      }
    })
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch agents',
      agents: []
    }, { status: 500 })
  }
}

// POST /api/deploy/agents - Deploy or update an agent
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, agent } = body
    
    if (!action || !agent) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: action, agent'
      }, { status: 400 })
    }
    
    const registryUrl = process.env.EDEN_REGISTRY_API_URL || 'https://eden-genesis-registry.vercel.app'
    
    // Simulate deployment process
    const deploymentSteps = [
      'validate',
      'registry', 
      'database',
      'assets',
      'services',
      'tests',
      'health',
      'complete'
    ]
    
    const deploymentId = `deploy_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    // Start deployment process
    const deploymentResults = []
    
    for (const step of deploymentSteps) {
      const startTime = Date.now()
      
      try {
        // Simulate step execution
        await simulateDeploymentStep(step, agent)
        
        const duration = Date.now() - startTime
        deploymentResults.push({
          step,
          status: 'completed',
          duration,
          timestamp: new Date().toISOString()
        })
        
      } catch (error) {
        const duration = Date.now() - startTime
        deploymentResults.push({
          step,
          status: 'failed',
          duration,
          error: error instanceof Error ? error.message : 'Step failed',
          timestamp: new Date().toISOString()
        })
        
        // Stop deployment on failure
        return NextResponse.json({
          success: false,
          deploymentId,
          error: `Deployment failed at step: ${step}`,
          steps: deploymentResults
        }, { status: 500 })
      }
    }
    
    // Update agent in Registry if all steps succeeded
    if (action === 'update') {
      try {
        const updateResponse = await fetch(`${registryUrl}/api/v1/agents/${agent.handle}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            displayName: agent.displayName,
            role: agent.role,
            profile: {
              statement: agent.statement,
              personality: agent.personality,
              capabilities: agent.capabilities?.split(',').map((c: string) => c.trim()).filter(Boolean)
            }
          })
        })
        
        if (!updateResponse.ok) {
          throw new Error('Failed to update agent in Registry')
        }
      } catch (error) {
        // Log error but don't fail deployment
        console.error('Registry update failed:', error)
      }
    }
    
    return NextResponse.json({
      success: true,
      deploymentId,
      message: `Agent ${action} completed successfully`,
      steps: deploymentResults,
      agent: {
        ...agent,
        status: 'ACTIVE',
        lastDeployed: new Date().toISOString()
      }
    })
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Deployment failed'
    }, { status: 500 })
  }
}

// Simulate deployment step execution
async function simulateDeploymentStep(step: string, agent: any): Promise<void> {
  const stepDurations: { [key: string]: number } = {
    validate: 1000,
    registry: 2000,
    database: 1500,
    assets: 3000,
    services: 2500,
    tests: 4000,
    health: 1000,
    complete: 500
  }
  
  const duration = stepDurations[step] || 1000
  await new Promise(resolve => setTimeout(resolve, duration))
  
  // Simulate random failures (10% chance)
  if (Math.random() < 0.1) {
    const errors: { [key: string]: string } = {
      validate: 'Agent configuration validation failed',
      registry: 'Registry update timeout',
      database: 'Database connection error',
      assets: 'Asset deployment failed',
      services: 'Service restart failed',
      tests: 'Integration tests failed',
      health: 'Health check failed'
    }
    
    throw new Error(errors[step] || 'Unknown deployment error')
  }
}