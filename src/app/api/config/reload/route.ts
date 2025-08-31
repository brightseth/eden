import { NextRequest, NextResponse } from 'next/server'

interface ConfigChange {
  path: string
  oldValue: any
  newValue: any
  timestamp: string
  agent?: string
}

// Global config change tracker
let configChanges: ConfigChange[] = []
let reloadListeners: ((changes: ConfigChange[]) => void)[] = []

// POST /api/config/reload - Hot reload configuration
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { agent, config, dryRun = false } = body
    
    if (!agent || !config) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: agent, config'
      }, { status: 400 })
    }
    
    const registryUrl = process.env.EDEN_REGISTRY_API_URL || 'https://eden-genesis-registry.vercel.app'
    
    // Fetch current config
    let currentConfig
    try {
      const response = await fetch(`${registryUrl}/api/v1/agents/${agent}`)
      if (!response.ok) {
        throw new Error(`Agent ${agent} not found`)
      }
      currentConfig = await response.json()
    } catch (error) {
      return NextResponse.json({
        success: false,
        error: `Failed to fetch current config: ${error instanceof Error ? error.message : 'Unknown error'}`
      }, { status: 404 })
    }
    
    // Calculate changes
    const changes = calculateConfigChanges(currentConfig, config, agent)
    
    if (dryRun) {
      return NextResponse.json({
        success: true,
        dryRun: true,
        changes,
        summary: {
          totalChanges: changes.length,
          criticalChanges: changes.filter(c => isCriticalChange(c.path)).length,
          safeToApply: changes.every(c => !isCriticalChange(c.path))
        }
      })
    }
    
    // Apply changes
    try {
      // Update Registry
      const updateResponse = await fetch(`${registryUrl}/api/v1/agents/${agent}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      })
      
      if (!updateResponse.ok) {
        throw new Error('Failed to update Registry')
      }
      
      // Track changes
      configChanges.push(...changes)
      
      // Keep only last 100 changes
      if (configChanges.length > 100) {
        configChanges = configChanges.slice(-100)
      }
      
      // Notify listeners
      reloadListeners.forEach(listener => {
        try {
          listener(changes)
        } catch (error) {
          console.error('Reload listener error:', error)
        }
      })
      
      // Simulate service restart if needed
      const needsRestart = changes.some(c => isCriticalChange(c.path))
      let restartResult = null
      
      if (needsRestart) {
        await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate restart
        restartResult = {
          restarted: true,
          services: ['agent-service', 'persona-service'],
          duration: 2000
        }
      }
      
      return NextResponse.json({
        success: true,
        applied: true,
        changes,
        restart: restartResult,
        summary: {
          totalChanges: changes.length,
          criticalChanges: changes.filter(c => isCriticalChange(c.path)).length,
          appliedAt: new Date().toISOString()
        }
      })
      
    } catch (error) {
      return NextResponse.json({
        success: false,
        error: `Failed to apply changes: ${error instanceof Error ? error.message : 'Unknown error'}`
      }, { status: 500 })
    }
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Configuration reload failed'
    }, { status: 500 })
  }
}

// GET /api/config/reload - Get reload history
export async function GET() {
  return NextResponse.json({
    success: true,
    changes: configChanges,
    summary: {
      totalChanges: configChanges.length,
      recentChanges: configChanges.filter(c => 
        new Date(c.timestamp) > new Date(Date.now() - 24 * 60 * 60 * 1000)
      ).length,
      agents: [...new Set(configChanges.map(c => c.agent).filter(Boolean))]
    }
  })
}

// Calculate differences between old and new config
function calculateConfigChanges(oldConfig: any, newConfig: any, agent: string, path = ''): ConfigChange[] {
  const changes: ConfigChange[] = []
  const timestamp = new Date().toISOString()
  
  // Helper to add change
  const addChange = (changePath: string, oldValue: any, newValue: any) => {
    changes.push({
      path: changePath,
      oldValue,
      newValue,
      timestamp,
      agent
    })
  }
  
  // Compare objects recursively
  const compareObjects = (obj1: any, obj2: any, currentPath: string) => {
    // Check for new or changed properties
    for (const key in obj2) {
      const fullPath = currentPath ? `${currentPath}.${key}` : key
      
      if (!(key in obj1)) {
        // New property
        addChange(fullPath, undefined, obj2[key])
      } else if (typeof obj2[key] === 'object' && typeof obj1[key] === 'object' && 
                 obj2[key] !== null && obj1[key] !== null && 
                 !Array.isArray(obj2[key]) && !Array.isArray(obj1[key])) {
        // Recursive comparison for nested objects
        compareObjects(obj1[key], obj2[key], fullPath)
      } else if (JSON.stringify(obj1[key]) !== JSON.stringify(obj2[key])) {
        // Changed property
        addChange(fullPath, obj1[key], obj2[key])
      }
    }
    
    // Check for removed properties
    for (const key in obj1) {
      const fullPath = currentPath ? `${currentPath}.${key}` : key
      if (!(key in obj2)) {
        addChange(fullPath, obj1[key], undefined)
      }
    }
  }
  
  compareObjects(oldConfig, newConfig, path)
  return changes
}

// Determine if a config change requires service restart
function isCriticalChange(path: string): boolean {
  const criticalPaths = [
    'role',
    'status',
    'profile.personality',
    'profile.capabilities',
    'cohortId'
  ]
  
  return criticalPaths.some(criticalPath => path.includes(criticalPath))
}

// Add reload listener (for real-time notifications)
// Note: This function is not exported from route file to comply with Next.js route requirements
// It can be moved to a separate utility file if needed externally
function addReloadListener(listener: (changes: ConfigChange[]) => void) {
  reloadListeners.push(listener)
  
  return () => {
    const index = reloadListeners.indexOf(listener)
    if (index > -1) {
      reloadListeners.splice(index, 1)
    }
  }
}