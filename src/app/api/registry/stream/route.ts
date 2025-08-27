import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      const registryUrl = process.env.EDEN_REGISTRY_API_URL || 'https://eden-genesis-registry.vercel.app'
      
      // Send initial connection message
      controller.enqueue(
        encoder.encode(`data: ${JSON.stringify({ 
          type: 'connected', 
          timestamp: new Date().toISOString(),
          message: 'Connected to Registry event stream'
        })}\n\n`)
      )

      // Simulate Registry events
      const sendEvent = (event: any) => {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(event)}\n\n`)
        )
      }

      // Poll Registry for changes
      const pollInterval = setInterval(async () => {
        try {
          // Check Registry status
          const statusResponse = await fetch(`${registryUrl}/api/v1/status`)
          if (statusResponse.ok) {
            const status = await statusResponse.json()
            sendEvent({
              type: 'registry.health',
              timestamp: new Date().toISOString(),
              data: {
                status: status.status,
                database: status.database,
                version: status.version
              }
            })
          }

          // Check for agent updates
          const agentsResponse = await fetch(`${registryUrl}/api/v1/agents`)
          if (agentsResponse.ok) {
            const agents = await agentsResponse.json()
            
            // Detect Amanda's activity
            const amanda = agents.find((a: any) => a.handle === 'amanda')
            if (amanda) {
              // Simulate collection events
              if (Math.random() > 0.8) {
                sendEvent({
                  type: 'agent.activity',
                  timestamp: new Date().toISOString(),
                  data: {
                    agent: 'amanda',
                    action: 'collection.evaluated',
                    details: {
                      piece: `Artwork #${Math.floor(Math.random() * 1000)}`,
                      score: Math.random(),
                      decision: Math.random() > 0.5 ? 'acquire' : 'pass'
                    }
                  }
                })
              }

              // Simulate profile updates
              if (Math.random() > 0.95) {
                sendEvent({
                  type: 'agent.updated',
                  timestamp: new Date().toISOString(),
                  data: {
                    agent: 'amanda',
                    field: 'metrics',
                    changes: {
                      totalAcquisitions: Math.floor(Math.random() * 1000),
                      monthlyRevenue: 12000 + Math.floor(Math.random() * 5000)
                    }
                  }
                })
              }
            }
          }

          // Simulate test events
          if (Math.random() > 0.9) {
            const testCategories = ['integration', 'contract', 'fallback', 'e2e']
            const category = testCategories[Math.floor(Math.random() * testCategories.length)]
            
            sendEvent({
              type: 'test.completed',
              timestamp: new Date().toISOString(),
              data: {
                category,
                success: Math.random() > 0.2,
                duration: Math.floor(Math.random() * 2000) + 500
              }
            })
          }

        } catch (error) {
          sendEvent({
            type: 'error',
            timestamp: new Date().toISOString(),
            error: error instanceof Error ? error.message : 'Unknown error'
          })
        }
      }, 5000) // Poll every 5 seconds

      // Cleanup on disconnect
      request.signal.addEventListener('abort', () => {
        clearInterval(pollInterval)
        controller.close()
      })
    }
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    }
  })
}

// WebSocket endpoint for bidirectional communication
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Handle commands from clients
    switch (body.command) {
      case 'subscribe':
        return Response.json({
          success: true,
          message: `Subscribed to ${body.topic || 'all'} events`
        })
        
      case 'unsubscribe':
        return Response.json({
          success: true,
          message: `Unsubscribed from ${body.topic || 'all'} events`
        })
        
      case 'ping':
        return Response.json({
          success: true,
          message: 'pong',
          timestamp: new Date().toISOString()
        })
        
      default:
        return Response.json({
          success: false,
          error: 'Unknown command'
        }, { status: 400 })
    }
  } catch (error) {
    return Response.json({
      success: false,
      error: error instanceof Error ? error.message : 'Invalid request'
    }, { status: 400 })
  }
}