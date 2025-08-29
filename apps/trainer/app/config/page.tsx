'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Progress } from '@/components/ui/progress'
import { Settings, Zap, AlertTriangle, Clock, CheckCircle, XCircle, Eye, Play } from 'lucide-react'

interface ConfigChange {
  path: string
  oldValue: any
  newValue: any
  timestamp: string
  agent?: string
}

interface Agent {
  handle: string
  displayName: string
  role: string
  status: string
  profile: {
    statement: string
    personality: string[]
    capabilities: string[]
  }
}

interface ReloadHistory {
  changes: ConfigChange[]
  summary: {
    totalChanges: number
    recentChanges: number
    agents: string[]
  }
}

export default function ConfigDashboard() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [selectedAgent, setSelectedAgent] = useState<string>('')
  const [currentConfig, setCurrentConfig] = useState<any>(null)
  const [editedConfig, setEditedConfig] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [changes, setChanges] = useState<ConfigChange[]>([])
  const [dryRunResult, setDryRunResult] = useState<any>(null)
  const [reloadHistory, setReloadHistory] = useState<ReloadHistory | null>(null)
  const [applyProgress, setApplyProgress] = useState(0)
  const [isApplying, setIsApplying] = useState(false)

  useEffect(() => {
    fetchAgents()
    fetchReloadHistory()
  }, [])

  useEffect(() => {
    if (selectedAgent) {
      fetchAgentConfig(selectedAgent)
    }
  }, [selectedAgent])

  const fetchAgents = async () => {
    try {
      const response = await fetch('/api/deploy/agents')
      if (response.ok) {
        const data = await response.json()
        setAgents(data.agents)
        if (data.agents.length > 0 && !selectedAgent) {
          setSelectedAgent(data.agents[0].handle)
        }
      }
    } catch (error) {
      console.error('Failed to fetch agents:', error)
    }
  }

  const fetchAgentConfig = async (agentHandle: string) => {
    setIsLoading(true)
    try {
      const registryUrl = process.env.NEXT_PUBLIC_EDEN_REGISTRY_API_URL || 'https://eden-genesis-registry.vercel.app'
      const response = await fetch(`${registryUrl}/api/v1/agents/${agentHandle}`)
      
      if (response.ok) {
        const config = await response.json()
        setCurrentConfig(config)
        setEditedConfig(JSON.parse(JSON.stringify(config)))
      }
    } catch (error) {
      console.error('Failed to fetch agent config:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchReloadHistory = async () => {
    try {
      const response = await fetch('/api/config/reload')
      if (response.ok) {
        const data = await response.json()
        setReloadHistory(data)
      }
    } catch (error) {
      console.error('Failed to fetch reload history:', error)
    }
  }

  const runDryRun = async () => {
    if (!selectedAgent || !editedConfig) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/config/reload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agent: selectedAgent,
          config: editedConfig,
          dryRun: true
        })
      })

      if (response.ok) {
        const result = await response.json()
        setDryRunResult(result)
        setChanges(result.changes || [])
      }
    } catch (error) {
      console.error('Dry run failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const applyChanges = async () => {
    if (!selectedAgent || !editedConfig) return

    setIsApplying(true)
    setApplyProgress(0)

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setApplyProgress(prev => Math.min(prev + 10, 90))
      }, 200)

      const response = await fetch('/api/config/reload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agent: selectedAgent,
          config: editedConfig,
          dryRun: false
        })
      })

      clearInterval(progressInterval)
      setApplyProgress(100)

      if (response.ok) {
        const result = await response.json()
        setCurrentConfig(editedConfig)
        setDryRunResult(null)
        setChanges([])
        await fetchReloadHistory()
        
        // Show success briefly
        setTimeout(() => {
          setApplyProgress(0)
          setIsApplying(false)
        }, 1000)
      }
    } catch (error) {
      console.error('Apply changes failed:', error)
      setApplyProgress(0)
      setIsApplying(false)
    }
  }

  const handleConfigChange = (path: string, value: any) => {
    if (!editedConfig) return

    const newConfig = JSON.parse(JSON.stringify(editedConfig))
    const keys = path.split('.')
    let current = newConfig

    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]]
    }
    current[keys[keys.length - 1]] = value

    setEditedConfig(newConfig)
    setDryRunResult(null)
    setChanges([])
  }

  const getChangeColor = (change: ConfigChange) => {
    if (change.oldValue === undefined) return 'bg-green-100 text-green-800'
    if (change.newValue === undefined) return 'bg-red-100 text-red-800'
    return 'bg-yellow-100 text-yellow-800'
  }

  const getChangeIcon = (change: ConfigChange) => {
    if (change.oldValue === undefined) return '+'
    if (change.newValue === undefined) return '-'
    return '~'
  }

  const isCriticalChange = (path: string) => {
    const criticalPaths = ['role', 'status', 'profile.personality', 'profile.capabilities', 'cohortId']
    return criticalPaths.some(criticalPath => path.includes(criticalPath))
  }

  const formatValue = (value: any) => {
    if (Array.isArray(value)) return value.join(', ')
    if (typeof value === 'object') return JSON.stringify(value, null, 2)
    return String(value)
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Configuration Management</h1>
          <p className="text-muted-foreground">
            Hot-reload agent configurations without service restarts
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={selectedAgent} onValueChange={setSelectedAgent}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select agent" />
            </SelectTrigger>
            <SelectContent>
              {agents.map((agent) => (
                <SelectItem key={agent.handle} value={agent.handle}>
                  {agent.displayName} ({agent.handle})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="editor" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="editor">Configuration Editor</TabsTrigger>
          <TabsTrigger value="changes">Change Preview</TabsTrigger>
          <TabsTrigger value="history">Reload History</TabsTrigger>
        </TabsList>

        <TabsContent value="editor" className="space-y-6">
          {/* Configuration Form */}
          {currentConfig && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Current Config */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Current Configuration
                  </CardTitle>
                  <CardDescription>
                    Live configuration from Registry
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px]">
                    <pre className="text-sm whitespace-pre-wrap">
                      {JSON.stringify(currentConfig, null, 2)}
                    </pre>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Editor */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    Configuration Editor
                  </CardTitle>
                  <CardDescription>
                    Make changes and preview before applying
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {editedConfig && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium">Display Name</label>
                          <input
                            type="text"
                            className="w-full mt-1 px-3 py-2 border rounded-md"
                            value={editedConfig.displayName || ''}
                            onChange={(e) => handleConfigChange('displayName', e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium">Role</label>
                          <Select
                            value={editedConfig.role || ''}
                            onValueChange={(value) => handleConfigChange('role', value)}
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="TRAINER">Trainer</SelectItem>
                              <SelectItem value="CURATOR">Curator</SelectItem>
                              <SelectItem value="RESEARCHER">Researcher</SelectItem>
                              <SelectItem value="ADVISOR">Advisor</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium">Statement</label>
                        <textarea
                          className="w-full mt-1 px-3 py-2 border rounded-md h-20"
                          value={editedConfig.profile?.statement || ''}
                          onChange={(e) => handleConfigChange('profile.statement', e.target.value)}
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium">Personality Traits</label>
                        <textarea
                          className="w-full mt-1 px-3 py-2 border rounded-md h-16"
                          value={editedConfig.profile?.personality?.join(', ') || ''}
                          onChange={(e) => handleConfigChange('profile.personality', e.target.value.split(',').map(s => s.trim()))}
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium">Capabilities</label>
                        <textarea
                          className="w-full mt-1 px-3 py-2 border rounded-md h-16"
                          value={editedConfig.profile?.capabilities?.join(', ') || ''}
                          onChange={(e) => handleConfigChange('profile.capabilities', e.target.value.split(',').map(s => s.trim()))}
                        />
                      </div>

                      <div className="flex gap-2 pt-4">
                        <Button
                          onClick={runDryRun}
                          disabled={isLoading}
                          variant="outline"
                          className="flex-1"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Preview Changes
                        </Button>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="changes" className="space-y-6">
          {/* Dry Run Results */}
          {dryRunResult && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Change Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{dryRunResult.summary.totalChanges}</div>
                      <div className="text-sm text-muted-foreground">Total Changes</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">{dryRunResult.summary.criticalChanges}</div>
                      <div className="text-sm text-muted-foreground">Critical Changes</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${dryRunResult.summary.safeToApply ? 'text-green-600' : 'text-red-600'}`}>
                        {dryRunResult.summary.safeToApply ? 'Safe' : 'Risky'}
                      </div>
                      <div className="text-sm text-muted-foreground">To Apply</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Change List */}
              {changes.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Configuration Changes</CardTitle>
                    <CardDescription>
                      Changes that will be applied to the Registry
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[400px]">
                      <div className="space-y-3">
                        {changes.map((change, index) => (
                          <div key={index} className="border rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge className={getChangeColor(change)}>
                                {getChangeIcon(change)} {change.path}
                              </Badge>
                              {isCriticalChange(change.path) && (
                                <Badge variant="destructive">
                                  <AlertTriangle className="h-3 w-3 mr-1" />
                                  Critical
                                </Badge>
                              )}
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="font-medium">Old:</span>
                                <div className="mt-1 p-2 bg-red-50 rounded text-red-800 font-mono">
                                  {change.oldValue === undefined ? '(none)' : formatValue(change.oldValue)}
                                </div>
                              </div>
                              <div>
                                <span className="font-medium">New:</span>
                                <div className="mt-1 p-2 bg-green-50 rounded text-green-800 font-mono">
                                  {change.newValue === undefined ? '(removed)' : formatValue(change.newValue)}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>

                    {/* Apply Changes */}
                    <div className="flex gap-2 pt-4 border-t">
                      {isApplying ? (
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Clock className="h-4 w-4 animate-spin" />
                            <span className="text-sm">Applying changes... {applyProgress}%</span>
                          </div>
                          <Progress value={applyProgress} className="w-full" />
                        </div>
                      ) : (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button className="flex-1">
                              <Play className="h-4 w-4 mr-2" />
                              Apply Changes
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Apply Configuration Changes?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will apply {changes.length} changes to the Registry. 
                                {dryRunResult.summary.criticalChanges > 0 && 
                                  ` ${dryRunResult.summary.criticalChanges} critical changes may require service restart.`
                                }
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={applyChanges}>Apply</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}

          {!dryRunResult && (
            <Card>
              <CardContent className="flex items-center justify-center h-64">
                <div className="text-center text-muted-foreground">
                  <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Make changes in the Configuration Editor, then preview them here</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          {/* Reload History */}
          {reloadHistory && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Reload Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{reloadHistory.summary.totalChanges}</div>
                      <div className="text-sm text-muted-foreground">Total Reloads</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{reloadHistory.summary.recentChanges}</div>
                      <div className="text-sm text-muted-foreground">Last 24 Hours</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{reloadHistory.summary.agents.length}</div>
                      <div className="text-sm text-muted-foreground">Agents Modified</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Reloads</CardTitle>
                  <CardDescription>
                    Configuration changes applied to Registry
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-3">
                      {reloadHistory.changes.slice(-20).reverse().map((change, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                          <div className="flex-shrink-0">
                            {change.oldValue === undefined ? (
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            ) : change.newValue === undefined ? (
                              <XCircle className="h-5 w-5 text-red-600" />
                            ) : (
                              <Settings className="h-5 w-5 text-blue-600" />
                            )}
                          </div>
                          <div className="flex-grow">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">{change.agent}</Badge>
                              <span className="font-medium">{change.path}</span>
                              {isCriticalChange(change.path) && (
                                <Badge variant="destructive" className="text-xs">Critical</Badge>
                              )}
                            </div>
                            <div className="text-sm text-muted-foreground mt-1">
                              {new Date(change.timestamp).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}