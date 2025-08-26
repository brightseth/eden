'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Activity, Zap, Database, Users, Bell, Wifi, WifiOff, Circle } from 'lucide-react'

interface StreamEvent {
  type: string
  timestamp: string
  data?: any
  error?: string
}

export default function StreamDashboard() {
  const [events, setEvents] = useState<StreamEvent[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('disconnected')
  const [stats, setStats] = useState({
    healthChecks: 0,
    agentUpdates: 0,
    testRuns: 0,
    errors: 0
  })
  const eventSourceRef = useRef<EventSource | null>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const connectToStream = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close()
    }

    setConnectionStatus('connecting')
    const eventSource = new EventSource('/api/registry/stream')
    eventSourceRef.current = eventSource

    eventSource.onopen = () => {
      setIsConnected(true)
      setConnectionStatus('connected')
    }

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        
        // Add to events list
        setEvents(prev => {
          const newEvents = [...prev, data]
          // Keep only last 100 events
          if (newEvents.length > 100) {
            return newEvents.slice(-100)
          }
          return newEvents
        })

        // Update stats
        setStats(prev => ({
          ...prev,
          healthChecks: data.type === 'registry.health' ? prev.healthChecks + 1 : prev.healthChecks,
          agentUpdates: data.type === 'agent.updated' || data.type === 'agent.activity' ? prev.agentUpdates + 1 : prev.agentUpdates,
          testRuns: data.type === 'test.completed' ? prev.testRuns + 1 : prev.testRuns,
          errors: data.type === 'error' ? prev.errors + 1 : prev.errors
        }))

        // Auto-scroll to bottom
        if (scrollAreaRef.current) {
          scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
        }
      } catch (error) {
        console.error('Failed to parse event:', error)
      }
    }

    eventSource.onerror = () => {
      setIsConnected(false)
      setConnectionStatus('disconnected')
      eventSourceRef.current = null
    }
  }

  const disconnectFromStream = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close()
      eventSourceRef.current = null
      setIsConnected(false)
      setConnectionStatus('disconnected')
    }
  }

  useEffect(() => {
    // Auto-connect on mount
    connectToStream()

    // Cleanup on unmount
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close()
      }
    }
  }, [])

  const getEventColor = (type: string) => {
    switch (type) {
      case 'connected':
        return 'bg-green-100 text-green-800'
      case 'registry.health':
        return 'bg-blue-100 text-blue-800'
      case 'agent.activity':
        return 'bg-purple-100 text-purple-800'
      case 'agent.updated':
        return 'bg-yellow-100 text-yellow-800'
      case 'test.completed':
        return 'bg-cyan-100 text-cyan-800'
      case 'error':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'connected':
        return <Wifi className="h-4 w-4" />
      case 'registry.health':
        return <Database className="h-4 w-4" />
      case 'agent.activity':
      case 'agent.updated':
        return <Users className="h-4 w-4" />
      case 'test.completed':
        return <Zap className="h-4 w-4" />
      case 'error':
        return <Bell className="h-4 w-4" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString()
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Registry Event Stream</h1>
          <p className="text-muted-foreground">
            Real-time updates from Eden Registry
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Circle className={`h-3 w-3 ${
              connectionStatus === 'connected' ? 'text-green-500 fill-green-500' :
              connectionStatus === 'connecting' ? 'text-yellow-500 fill-yellow-500 animate-pulse' :
              'text-red-500 fill-red-500'
            }`} />
            <span className="text-sm font-medium">
              {connectionStatus === 'connected' ? 'Connected' :
               connectionStatus === 'connecting' ? 'Connecting...' :
               'Disconnected'}
            </span>
          </div>
          {isConnected ? (
            <Button
              variant="destructive"
              size="sm"
              onClick={disconnectFromStream}
            >
              <WifiOff className="h-4 w-4 mr-2" />
              Disconnect
            </Button>
          ) : (
            <Button
              variant="default"
              size="sm"
              onClick={connectToStream}
            >
              <Wifi className="h-4 w-4 mr-2" />
              Connect
            </Button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Health Checks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.healthChecks}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Agent Updates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.agentUpdates}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Test Runs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.testRuns}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Errors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.errors}</div>
          </CardContent>
        </Card>
      </div>

      {/* Event Stream */}
      <Card>
        <CardHeader>
          <CardTitle>Live Events</CardTitle>
          <CardDescription>
            Real-time events from Registry and connected services
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px] w-full pr-4" ref={scrollAreaRef}>
            <div className="space-y-2">
              {events.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  {isConnected ? 'Waiting for events...' : 'Connect to see live events'}
                </div>
              ) : (
                events.map((event, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex-shrink-0 mt-1">
                      {getEventIcon(event.type)}
                    </div>
                    <div className="flex-grow min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className={getEventColor(event.type)}>
                          {event.type}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatTimestamp(event.timestamp)}
                        </span>
                      </div>
                      
                      {event.data && (
                        <div className="text-sm">
                          {event.type === 'registry.health' && (
                            <span>
                              Registry {event.data.status} • Database {event.data.database}
                            </span>
                          )}
                          
                          {event.type === 'agent.activity' && (
                            <span>
                              {event.data.agent} {event.data.action}: {event.data.details?.piece} 
                              {event.data.details?.decision && (
                                <Badge variant="outline" className="ml-2">
                                  {event.data.details.decision}
                                </Badge>
                              )}
                            </span>
                          )}
                          
                          {event.type === 'agent.updated' && (
                            <span>
                              {event.data.agent} updated {event.data.field}
                            </span>
                          )}
                          
                          {event.type === 'test.completed' && (
                            <span>
                              {event.data.category} tests 
                              <Badge 
                                variant={event.data.success ? 'default' : 'destructive'}
                                className="ml-2"
                              >
                                {event.data.success ? 'PASSED' : 'FAILED'}
                              </Badge>
                              <span className="ml-2 text-xs text-muted-foreground">
                                {event.data.duration}ms
                              </span>
                            </span>
                          )}
                          
                          {event.error && (
                            <span className="text-red-600">
                              Error: {event.error}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Connection Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Connection Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Endpoint:</span>
              <div className="font-mono">/api/registry/stream</div>
            </div>
            <div>
              <span className="text-muted-foreground">Protocol:</span>
              <div>Server-Sent Events (SSE)</div>
            </div>
            <div>
              <span className="text-muted-foreground">Events Received:</span>
              <div>{events.length}</div>
            </div>
            <div>
              <span className="text-muted-foreground">Buffer Size:</span>
              <div>100 events max</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}