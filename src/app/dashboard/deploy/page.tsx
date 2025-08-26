'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { CheckCircle, XCircle, Clock, Rocket, Settings, Database, Globe, Zap, AlertTriangle } from 'lucide-react'

interface DeploymentStep {
  id: string
  name: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  duration?: number
  error?: string
}

interface Agent {
  handle: string
  displayName: string
  role: string
  status: string
  lastDeployed?: string
}

export default function DeploymentDashboard() {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)
  const [deploymentMode, setDeploymentMode] = useState<'new' | 'update'>('update')
  const [isDeploying, setIsDeploying] = useState(false)
  const [deploymentSteps, setDeploymentSteps] = useState<DeploymentStep[]>([])
  const [deploymentProgress, setDeploymentProgress] = useState(0)
  const [agents, setAgents] = useState<Agent[]>([])
  const [newAgentData, setNewAgentData] = useState({
    handle: '',
    displayName: '',
    role: 'CURATOR',
    statement: '',
    personality: '',
    capabilities: ''
  })

  // Mock agents data
  useEffect(() => {
    setAgents([
      {
        handle: 'amanda',
        displayName: 'Amanda',
        role: 'COLLECTOR',
        status: 'ACTIVE',
        lastDeployed: '2024-01-15T10:30:00Z'
      },
      {
        handle: 'abraham',
        displayName: 'Abraham',
        role: 'CURATOR',
        status: 'ACTIVE',
        lastDeployed: '2024-01-14T15:20:00Z'
      },
      {
        handle: 'solienne',
        displayName: 'Solienne',
        role: 'CURATOR',
        status: 'ACTIVE',
        lastDeployed: '2024-01-13T09:45:00Z'
      },
      {
        handle: 'open-1',
        displayName: 'Open Slot #1',
        role: 'GUEST',
        status: 'INACTIVE'
      }
    ])
  }, [])

  const deploymentStepsTemplate: DeploymentStep[] = [
    { id: 'validate', name: 'Validate Configuration', status: 'pending' },
    { id: 'registry', name: 'Update Registry', status: 'pending' },
    { id: 'database', name: 'Sync Database', status: 'pending' },
    { id: 'assets', name: 'Deploy Assets', status: 'pending' },
    { id: 'services', name: 'Update Services', status: 'pending' },
    { id: 'tests', name: 'Run Integration Tests', status: 'pending' },
    { id: 'health', name: 'Health Check', status: 'pending' },
    { id: 'complete', name: 'Deployment Complete', status: 'pending' }
  ]

  const startDeployment = async () => {
    setIsDeploying(true)
    setDeploymentSteps([...deploymentStepsTemplate])
    setDeploymentProgress(0)

    // Simulate deployment steps
    for (let i = 0; i < deploymentStepsTemplate.length; i++) {
      const step = deploymentStepsTemplate[i]
      
      // Update step to running
      setDeploymentSteps(prev => 
        prev.map(s => s.id === step.id ? { ...s, status: 'running' } : s)
      )

      // Simulate step execution
      const duration = Math.random() * 2000 + 1000 // 1-3 seconds
      await new Promise(resolve => setTimeout(resolve, duration))

      // Random chance of failure for demo
      const success = Math.random() > 0.1 // 90% success rate

      // Update step to completed/failed
      setDeploymentSteps(prev => 
        prev.map(s => s.id === step.id ? { 
          ...s, 
          status: success ? 'completed' : 'failed',
          duration: Math.round(duration),
          error: !success ? 'Deployment step failed due to network timeout' : undefined
        } : s)
      )

      if (!success) {
        setIsDeploying(false)
        return
      }

      // Update progress
      setDeploymentProgress(((i + 1) / deploymentStepsTemplate.length) * 100)
    }

    setIsDeploying(false)
  }

  const getStepIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-600" />
      case 'running':
        return <Clock className="h-5 w-5 text-blue-600 animate-spin" />
      default:
        return <Clock className="h-5 w-5 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800'
      case 'INACTIVE':
        return 'bg-gray-100 text-gray-800'
      case 'DEPLOYING':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Agent Deployment Pipeline</h1>
          <p className="text-muted-foreground">
            Deploy new agents or update existing configurations
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline">
            {agents.filter(a => a.status === 'ACTIVE').length} Active
          </Badge>
          <Badge variant="outline">
            {agents.filter(a => a.status === 'INACTIVE').length} Available Slots
          </Badge>
        </div>
      </div>

      <Tabs value={deploymentMode} onValueChange={(value) => setDeploymentMode(value as 'new' | 'update')}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="update">Update Agent</TabsTrigger>
          <TabsTrigger value="new">Deploy New Agent</TabsTrigger>
        </TabsList>

        <TabsContent value="update" className="space-y-6">
          {/* Agent Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Select Agent to Update
              </CardTitle>
              <CardDescription>
                Choose an existing agent to update or redeploy
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {agents.filter(a => a.status === 'ACTIVE').map((agent) => (
                  <div
                    key={agent.handle}
                    className={`border rounded-lg p-4 cursor-pointer transition-colors hover:bg-gray-50 ${
                      selectedAgent?.handle === agent.handle ? 'border-blue-500 bg-blue-50' : ''
                    }`}
                    onClick={() => setSelectedAgent(agent)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{agent.displayName}</h3>
                      <Badge className={getStatusColor(agent.status)}>
                        {agent.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <div>@{agent.handle} • {agent.role}</div>
                      {agent.lastDeployed && (
                        <div className="mt-1">
                          Last deployed: {new Date(agent.lastDeployed).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Configuration Updates */}
          {selectedAgent && (
            <Card>
              <CardHeader>
                <CardTitle>Update Configuration</CardTitle>
                <CardDescription>
                  Modify {selectedAgent.displayName}'s settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Display Name</label>
                    <Input value={selectedAgent.displayName} />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Role</label>
                    <Select value={selectedAgent.role}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CURATOR">Curator</SelectItem>
                        <SelectItem value="COLLECTOR">Collector</SelectItem>
                        <SelectItem value="INVESTOR">Investor</SelectItem>
                        <SelectItem value="TRAINER">Trainer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Personality Prompt</label>
                  <Textarea 
                    placeholder="Update agent personality..."
                    rows={4}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Capabilities (comma-separated)</label>
                  <Input placeholder="autonomous_creation, market_analysis, curation..." />
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="new" className="space-y-6">
          {/* New Agent Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Rocket className="h-5 w-5" />
                Deploy New Agent
              </CardTitle>
              <CardDescription>
                Create and deploy a new agent to the Genesis cohort
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Handle *</label>
                  <Input 
                    placeholder="agent-handle"
                    value={newAgentData.handle}
                    onChange={(e) => setNewAgentData(prev => ({ ...prev, handle: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Display Name *</label>
                  <Input 
                    placeholder="Agent Name"
                    value={newAgentData.displayName}
                    onChange={(e) => setNewAgentData(prev => ({ ...prev, displayName: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Role *</label>
                <Select 
                  value={newAgentData.role}
                  onValueChange={(value) => setNewAgentData(prev => ({ ...prev, role: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CURATOR">Curator</SelectItem>
                    <SelectItem value="COLLECTOR">Collector</SelectItem>
                    <SelectItem value="INVESTOR">Investor</SelectItem>
                    <SelectItem value="TRAINER">Trainer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Mission Statement</label>
                <Textarea 
                  placeholder="Describe the agent's purpose and mission..."
                  rows={3}
                  value={newAgentData.statement}
                  onChange={(e) => setNewAgentData(prev => ({ ...prev, statement: e.target.value }))}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Personality Prompt *</label>
                <Textarea 
                  placeholder="Define the agent's personality, voice, and behavior..."
                  rows={4}
                  value={newAgentData.personality}
                  onChange={(e) => setNewAgentData(prev => ({ ...prev, personality: e.target.value }))}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Capabilities</label>
                <Input 
                  placeholder="autonomous_creation, market_analysis, curation..."
                  value={newAgentData.capabilities}
                  onChange={(e) => setNewAgentData(prev => ({ ...prev, capabilities: e.target.value }))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Available Slots */}
          <Card>
            <CardHeader>
              <CardTitle>Available Deployment Slots</CardTitle>
              <CardDescription>
                Open slots in the Genesis cohort
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {agents.filter(a => a.status === 'INACTIVE').map((slot) => (
                  <div
                    key={slot.handle}
                    className="border rounded-lg p-4 border-dashed hover:border-solid hover:bg-gray-50 cursor-pointer"
                  >
                    <div className="text-center">
                      <div className="font-semibold text-muted-foreground">{slot.displayName}</div>
                      <div className="text-sm text-muted-foreground mt-1">@{slot.handle}</div>
                      <Badge variant="secondary" className="mt-2">Available</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Deployment Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Deployment Pipeline
          </CardTitle>
          <CardDescription>
            Execute the deployment process
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <Button 
              onClick={startDeployment}
              disabled={isDeploying || (deploymentMode === 'update' && !selectedAgent)}
              className="flex items-center gap-2"
            >
              <Rocket className="h-4 w-4" />
              {isDeploying ? 'Deploying...' : 'Start Deployment'}
            </Button>
            
            {deploymentProgress > 0 && (
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium">Progress</span>
                  <span className="text-sm text-muted-foreground">
                    {Math.round(deploymentProgress)}%
                  </span>
                </div>
                <Progress value={deploymentProgress} className="h-2" />
              </div>
            )}
          </div>

          {/* Deployment Steps */}
          {deploymentSteps.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold">Deployment Steps</h3>
              {deploymentSteps.map((step) => (
                <div key={step.id} className="flex items-center gap-3 p-3 border rounded-lg">
                  {getStepIcon(step.status)}
                  <div className="flex-grow">
                    <div className="font-medium">{step.name}</div>
                    {step.duration && (
                      <div className="text-xs text-muted-foreground">
                        Completed in {step.duration}ms
                      </div>
                    )}
                    {step.error && (
                      <div className="text-xs text-red-600 mt-1 flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        {step.error}
                      </div>
                    )}
                  </div>
                  <Badge 
                    variant={
                      step.status === 'completed' ? 'default' :
                      step.status === 'failed' ? 'destructive' :
                      step.status === 'running' ? 'secondary' : 'outline'
                    }
                  >
                    {step.status.toUpperCase()}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Deployment History */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Deployments</CardTitle>
          <CardDescription>
            History of recent agent deployments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              {
                agent: 'Amanda',
                action: 'Configuration Update',
                timestamp: '2024-01-15T10:30:00Z',
                status: 'success'
              },
              {
                agent: 'Abraham',
                action: 'Persona Update',
                timestamp: '2024-01-14T15:20:00Z',
                status: 'success'
              },
              {
                agent: 'New Agent: Koru',
                action: 'Initial Deployment',
                timestamp: '2024-01-13T09:45:00Z',
                status: 'success'
              }
            ].map((deployment, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium">{deployment.agent}</div>
                  <div className="text-sm text-muted-foreground">
                    {deployment.action} • {new Date(deployment.timestamp).toLocaleString()}
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-800">
                  SUCCESS
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}