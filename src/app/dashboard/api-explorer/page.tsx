'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Copy, ChevronDown, Play, Database, Code, Zap, Globe } from 'lucide-react'

interface APIEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  path: string
  description: string
  parameters?: Array<{
    name: string
    type: string
    required: boolean
    description: string
    location: 'path' | 'query' | 'body'
  }>
  responses: {
    [statusCode: string]: {
      description: string
      example?: any
    }
  }
  examples?: {
    curl: string
    javascript: string
    response: any
  }
}

export default function APIExplorer() {
  const [selectedEndpoint, setSelectedEndpoint] = useState<APIEndpoint | null>(null)
  const [requestParams, setRequestParams] = useState<{ [key: string]: string }>({})
  const [requestBody, setRequestBody] = useState('')
  const [response, setResponse] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [registryUrl, setRegistryUrl] = useState('https://eden-genesis-registry.vercel.app')

  // API Endpoints Configuration
  const endpoints: APIEndpoint[] = [
    {
      method: 'GET',
      path: '/api/v1/status',
      description: 'Get Registry health status',
      responses: {
        '200': {
          description: 'Registry status information',
          example: {
            status: 'healthy',
            version: '1.0.0',
            database: 'connected',
            timestamp: '2024-01-01T00:00:00.000Z'
          }
        }
      },
      examples: {
        curl: `curl -X GET "${registryUrl}/api/v1/status"`,
        javascript: `
const response = await fetch('${registryUrl}/api/v1/status');
const data = await response.json();
console.log(data);`,
        response: {
          status: 'healthy',
          version: '1.0.0',
          database: 'connected',
          timestamp: '2024-01-01T00:00:00.000Z'
        }
      }
    },
    {
      method: 'GET',
      path: '/api/v1/agents',
      description: 'List all agents in the Registry',
      parameters: [
        {
          name: 'cohort',
          type: 'string',
          required: false,
          description: 'Filter by cohort (e.g., genesis)',
          location: 'query'
        },
        {
          name: 'status',
          type: 'string',
          required: false,
          description: 'Filter by status (ACTIVE, INACTIVE, etc.)',
          location: 'query'
        }
      ],
      responses: {
        '200': {
          description: 'Array of agent objects',
          example: [
            {
              id: 'agent-001',
              handle: 'amanda',
              displayName: 'Amanda',
              role: 'COLLECTOR',
              status: 'ACTIVE'
            }
          ]
        }
      },
      examples: {
        curl: `curl -X GET "${registryUrl}/api/v1/agents"`,
        javascript: `
const response = await fetch('${registryUrl}/api/v1/agents');
const agents = await response.json();
console.log(agents);`,
        response: [
          {
            id: 'agent-001',
            handle: 'amanda',
            displayName: 'Amanda',
            role: 'COLLECTOR',
            status: 'ACTIVE'
          }
        ]
      }
    },
    {
      method: 'GET',
      path: '/api/v1/agents/{handle}',
      description: 'Get specific agent by handle',
      parameters: [
        {
          name: 'handle',
          type: 'string',
          required: true,
          description: 'Agent handle (e.g., amanda, abraham)',
          location: 'path'
        }
      ],
      responses: {
        '200': {
          description: 'Agent object with detailed information',
          example: {
            id: 'agent-001',
            handle: 'amanda',
            displayName: 'Amanda',
            role: 'COLLECTOR',
            status: 'ACTIVE',
            profile: {
              statement: 'The Taste Maker - Autonomous art collector',
              links: {
                personality: {
                  voice: 'Sophisticated collector with deep market knowledge'
                }
              }
            }
          }
        },
        '404': {
          description: 'Agent not found'
        }
      },
      examples: {
        curl: `curl -X GET "${registryUrl}/api/v1/agents/amanda"`,
        javascript: `
const response = await fetch('${registryUrl}/api/v1/agents/amanda');
const agent = await response.json();
console.log(agent);`,
        response: {
          id: 'agent-001',
          handle: 'amanda',
          displayName: 'Amanda',
          role: 'COLLECTOR',
          status: 'ACTIVE'
        }
      }
    }
  ]

  const executeRequest = async () => {
    if (!selectedEndpoint) return

    setIsLoading(true)
    setResponse(null)

    try {
      let url = `${registryUrl}${selectedEndpoint.path}`
      
      // Replace path parameters
      selectedEndpoint.parameters?.forEach(param => {
        if (param.location === 'path' && requestParams[param.name]) {
          url = url.replace(`{${param.name}}`, requestParams[param.name])
        }
      })

      // Add query parameters
      const queryParams = new URLSearchParams()
      selectedEndpoint.parameters?.forEach(param => {
        if (param.location === 'query' && requestParams[param.name]) {
          queryParams.append(param.name, requestParams[param.name])
        }
      })
      
      if (queryParams.toString()) {
        url += `?${queryParams.toString()}`
      }

      const options: RequestInit = {
        method: selectedEndpoint.method,
        headers: {
          'Content-Type': 'application/json'
        }
      }

      if (selectedEndpoint.method !== 'GET' && requestBody) {
        options.body = requestBody
      }

      const response = await fetch(url)
      const data = await response.json()

      setResponse({
        status: response.status,
        statusText: response.statusText,
        data: data
      })

    } catch (error) {
      setResponse({
        status: 'Error',
        statusText: 'Network Error',
        data: { error: error instanceof Error ? error.message : 'Unknown error' }
      })
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const getMethodColor = (method: string) => {
    const colors = {
      GET: 'bg-green-100 text-green-800',
      POST: 'bg-blue-100 text-blue-800',
      PUT: 'bg-yellow-100 text-yellow-800',
      DELETE: 'bg-red-100 text-red-800'
    }
    return colors[method as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const getStatusColor = (status: number | string) => {
    if (typeof status === 'string') return 'bg-red-100 text-red-800'
    if (status >= 200 && status < 300) return 'bg-green-100 text-green-800'
    if (status >= 400 && status < 500) return 'bg-yellow-100 text-yellow-800'
    if (status >= 500) return 'bg-red-100 text-red-800'
    return 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Registry API Explorer</h1>
          <p className="text-muted-foreground">
            Interactive documentation and testing for Eden Registry APIs
          </p>
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="Registry URL"
            value={registryUrl}
            onChange={(e) => setRegistryUrl(e.target.value)}
            className="w-64"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Endpoints List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                API Endpoints
              </CardTitle>
              <CardDescription>
                Click an endpoint to explore and test
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {endpoints.map((endpoint, index) => (
                <div
                  key={index}
                  className={`border rounded-lg p-3 cursor-pointer transition-colors hover:bg-gray-50 ${
                    selectedEndpoint === endpoint ? 'border-blue-500 bg-blue-50' : ''
                  }`}
                  onClick={() => {
                    setSelectedEndpoint(endpoint)
                    setRequestParams({})
                    setRequestBody('')
                    setResponse(null)
                  }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className={getMethodColor(endpoint.method)}>
                      {endpoint.method}
                    </Badge>
                    <code className="text-sm font-mono">{endpoint.path}</code>
                  </div>
                  <p className="text-sm text-gray-600">{endpoint.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Endpoint Details */}
        <div className="lg:col-span-2">
          {selectedEndpoint ? (
            <div className="space-y-6">
              {/* Endpoint Header */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Badge className={getMethodColor(selectedEndpoint.method)}>
                      {selectedEndpoint.method}
                    </Badge>
                    <code className="text-lg font-mono">{selectedEndpoint.path}</code>
                  </div>
                  <CardDescription>{selectedEndpoint.description}</CardDescription>
                </CardHeader>
              </Card>

              <Tabs defaultValue="try" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="try">Try It</TabsTrigger>
                  <TabsTrigger value="examples">Examples</TabsTrigger>
                  <TabsTrigger value="schema">Schema</TabsTrigger>
                </TabsList>

                <TabsContent value="try" className="space-y-4">
                  {/* Parameters */}
                  {selectedEndpoint.parameters && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Parameters</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {selectedEndpoint.parameters.map((param) => (
                          <div key={param.name} className="space-y-2">
                            <label className="text-sm font-medium flex items-center gap-2">
                              {param.name}
                              {param.required && <Badge variant="destructive">Required</Badge>}
                              <Badge variant="outline">{param.type}</Badge>
                            </label>
                            <Input
                              placeholder={param.description}
                              value={requestParams[param.name] || ''}
                              onChange={(e) => setRequestParams(prev => ({
                                ...prev,
                                [param.name]: e.target.value
                              }))}
                            />
                            <p className="text-xs text-gray-600">{param.description}</p>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  )}

                  {/* Request Body */}
                  {selectedEndpoint.method !== 'GET' && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Request Body</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Textarea
                          placeholder="Enter JSON request body..."
                          value={requestBody}
                          onChange={(e) => setRequestBody(e.target.value)}
                          rows={6}
                          className="font-mono"
                        />
                      </CardContent>
                    </Card>
                  )}

                  {/* Execute Button */}
                  <div className="flex gap-2">
                    <Button onClick={executeRequest} disabled={isLoading} className="flex items-center gap-2">
                      <Play className="h-4 w-4" />
                      {isLoading ? 'Executing...' : 'Execute'}
                    </Button>
                  </div>

                  {/* Response */}
                  {response && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          Response
                          <Badge className={getStatusColor(response.status)}>
                            {response.status} {response.statusText}
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <pre className="bg-gray-50 p-4 rounded-lg overflow-auto text-sm font-mono">
                          {JSON.stringify(response.data, null, 2)}
                        </pre>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="examples" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Code className="h-5 w-5" />
                        Code Examples
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* cURL Example */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium">cURL</h3>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(selectedEndpoint.examples?.curl || '')}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                        <pre className="bg-gray-50 p-4 rounded-lg overflow-auto text-sm font-mono">
                          {selectedEndpoint.examples?.curl}
                        </pre>
                      </div>

                      {/* JavaScript Example */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium">JavaScript</h3>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(selectedEndpoint.examples?.javascript || '')}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                        <pre className="bg-gray-50 p-4 rounded-lg overflow-auto text-sm font-mono">
                          {selectedEndpoint.examples?.javascript}
                        </pre>
                      </div>

                      {/* Response Example */}
                      <div>
                        <h3 className="font-medium mb-2">Example Response</h3>
                        <pre className="bg-gray-50 p-4 rounded-lg overflow-auto text-sm font-mono">
                          {JSON.stringify(selectedEndpoint.examples?.response, null, 2)}
                        </pre>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="schema" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Response Schema</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {Object.entries(selectedEndpoint.responses).map(([status, response]) => (
                        <div key={status} className="border rounded-lg p-4 mb-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={getStatusColor(parseInt(status))}>
                              {status}
                            </Badge>
                            <span className="text-sm">{response.description}</span>
                          </div>
                          {response.example && (
                            <pre className="bg-gray-50 p-4 rounded-lg overflow-auto text-sm font-mono">
                              {JSON.stringify(response.example, null, 2)}
                            </pre>
                          )}
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          ) : (
            <Card className="h-96 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <Globe className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">Select an Endpoint</h3>
                <p>Choose an API endpoint from the list to explore and test it</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}