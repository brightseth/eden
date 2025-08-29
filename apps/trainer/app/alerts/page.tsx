'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Bell, AlertTriangle, CheckCircle, XCircle, Settings, Send, Zap } from 'lucide-react'

interface Alert {
  id: string
  rule: string
  message: string
  severity: 'info' | 'warning' | 'error' | 'critical'
  timestamp: string
  data?: any
  acknowledged: boolean
}

interface AlertRule {
  id: string
  name: string
  condition: string
  severity: 'info' | 'warning' | 'error' | 'critical'
  enabled: boolean
  channels: string[]
  throttleMinutes: number
  lastTriggered?: string
}

interface AlertSummary {
  total: number
  unacknowledged: number
  critical: number
  errors: number
  warnings: number
}

export default function AlertsDashboard() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [alertRules, setAlertRules] = useState<AlertRule[]>([])
  const [summary, setSummary] = useState<AlertSummary>({
    total: 0,
    unacknowledged: 0,
    critical: 0,
    errors: 0,
    warnings: 0
  })
  const [selectedAlerts, setSelectedAlerts] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [testChannel, setTestChannel] = useState<string>('slack')
  const [testSeverity, setTestSeverity] = useState<string>('info')

  useEffect(() => {
    fetchAlerts()
    fetchAlertRules()
    
    // Poll for new alerts every 30 seconds
    const interval = setInterval(() => {
      fetchAlerts()
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  const fetchAlerts = async () => {
    try {
      const response = await fetch('/api/alerts')
      if (response.ok) {
        const data = await response.json()
        setAlerts(data.alerts || [])
        setSummary(data.summary || {
          total: 0,
          unacknowledged: 0,
          critical: 0,
          errors: 0,
          warnings: 0
        })
      }
    } catch (error) {
      console.error('Failed to fetch alerts:', error)
    }
  }

  const fetchAlertRules = async () => {
    try {
      const response = await fetch('/api/alerts?type=rules')
      if (response.ok) {
        const data = await response.json()
        setAlertRules(data.rules || [])
      }
    } catch (error) {
      console.error('Failed to fetch alert rules:', error)
    }
  }

  const acknowledgeAlerts = async (alertIds: string[]) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'acknowledge',
          data: { alertIds }
        })
      })

      if (response.ok) {
        await fetchAlerts()
        setSelectedAlerts([])
      }
    } catch (error) {
      console.error('Failed to acknowledge alerts:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateAlertRule = async (ruleId: string, updates: Partial<AlertRule>) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update-rule',
          data: { ruleId, updates }
        })
      })

      if (response.ok) {
        await fetchAlertRules()
      }
    } catch (error) {
      console.error('Failed to update alert rule:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const sendTestNotification = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/alerts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channel: testChannel,
          severity: testSeverity
        })
      })

      if (response.ok) {
        // Show success message or refresh alerts
        await fetchAlerts()
      }
    } catch (error) {
      console.error('Failed to send test notification:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800'
      case 'error':
        return 'bg-orange-100 text-orange-800'
      case 'warning':
        return 'bg-yellow-100 text-yellow-800'
      case 'info':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <XCircle className="h-4 w-4 text-red-600" />
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-orange-600" />
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case 'info':
        return <CheckCircle className="h-4 w-4 text-blue-600" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (days > 0) return `${days}d ago`
    if (hours > 0) return `${hours}h ago`
    if (minutes > 0) return `${minutes}m ago`
    return 'Just now'
  }

  const handleAlertSelection = (alertId: string, checked: boolean) => {
    if (checked) {
      setSelectedAlerts([...selectedAlerts, alertId])
    } else {
      setSelectedAlerts(selectedAlerts.filter(id => id !== alertId))
    }
  }

  const unacknowledgedAlerts = alerts.filter(alert => !alert.acknowledged)

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Smart Alerts</h1>
          <p className="text-muted-foreground">
            Intelligent monitoring and notifications for Eden Registry
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant={summary.critical > 0 ? 'destructive' : 'default'}>
            {summary.unacknowledged} unacknowledged
          </Badge>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Critical</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{summary.critical}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Errors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{summary.errors}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Warnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{summary.warnings}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Unacknowledged</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{summary.unacknowledged}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="alerts" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="alerts">Active Alerts</TabsTrigger>
          <TabsTrigger value="rules">Alert Rules</TabsTrigger>
          <TabsTrigger value="test">Test Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="alerts" className="space-y-6">
          {/* Alert Actions */}
          {selectedAlerts.length > 0 && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <span>{selectedAlerts.length} alerts selected</span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setSelectedAlerts([])}
                    >
                      Clear Selection
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button disabled={isLoading}>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Acknowledge Selected
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Acknowledge Alerts?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will mark {selectedAlerts.length} alerts as acknowledged.
                            They will no longer appear in the unacknowledged count.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => acknowledgeAlerts(selectedAlerts)}>
                            Acknowledge
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Alerts List */}
          <Card>
            <CardHeader>
              <CardTitle>Alert History</CardTitle>
              <CardDescription>
                Recent alerts from Registry monitoring
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <div className="space-y-3">
                  {alerts.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                      No alerts to display
                    </div>
                  ) : (
                    alerts.map((alert) => (
                      <div
                        key={alert.id}
                        className={`flex items-start gap-3 p-4 border rounded-lg ${
                          alert.acknowledged ? 'opacity-60' : ''
                        } ${!alert.acknowledged && alert.severity === 'critical' ? 'border-red-200 bg-red-50' : ''}`}
                      >
                        <input
                          type="checkbox"
                          className="mt-1"
                          checked={selectedAlerts.includes(alert.id)}
                          onChange={(e) => handleAlertSelection(alert.id, e.target.checked)}
                        />
                        
                        <div className="flex-shrink-0 mt-1">
                          {getSeverityIcon(alert.severity)}
                        </div>

                        <div className="flex-grow min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge className={getSeverityColor(alert.severity)}>
                              {alert.severity.toUpperCase()}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {formatTimestamp(alert.timestamp)}
                            </span>
                            {alert.acknowledged && (
                              <Badge variant="outline">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Acknowledged
                              </Badge>
                            )}
                          </div>

                          <div className="font-medium mb-1">{alert.message}</div>
                          
                          {alert.data && (
                            <details className="text-sm text-muted-foreground">
                              <summary className="cursor-pointer hover:text-foreground">
                                View alert data
                              </summary>
                              <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-x-auto">
                                {JSON.stringify(alert.data, null, 2)}
                              </pre>
                            </details>
                          )}
                        </div>

                        {!alert.acknowledged && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => acknowledgeAlerts([alert.id])}
                            disabled={isLoading}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rules" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Alert Rules Configuration</CardTitle>
              <CardDescription>
                Manage conditions and channels for automatic alerts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alertRules.map((rule) => (
                  <div key={rule.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-grow">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{rule.name}</span>
                        <Badge className={getSeverityColor(rule.severity)}>
                          {rule.severity}
                        </Badge>
                        {rule.channels.map(channel => (
                          <Badge key={channel} variant="outline">{channel}</Badge>
                        ))}
                      </div>
                      <div className="text-sm text-muted-foreground mb-1">
                        Condition: <code className="bg-gray-100 px-1 rounded">{rule.condition}</code>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Throttle: {rule.throttleMinutes} minutes
                        {rule.lastTriggered && ` • Last triggered: ${formatTimestamp(rule.lastTriggered)}`}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={rule.enabled}
                        onCheckedChange={(checked) => updateAlertRule(rule.id, { enabled: checked })}
                        disabled={isLoading}
                      />
                      <Button variant="ghost" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="test" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Test Notifications</CardTitle>
              <CardDescription>
                Send test alerts to verify your notification channels
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Channel</label>
                  <Select value={testChannel} onValueChange={setTestChannel}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="slack">Slack</SelectItem>
                      <SelectItem value="discord">Discord</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Severity</label>
                  <Select value={testSeverity} onValueChange={setTestSeverity}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="info">Info</SelectItem>
                      <SelectItem value="warning">Warning</SelectItem>
                      <SelectItem value="error">Error</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Button
                onClick={sendTestNotification}
                disabled={isLoading}
                className="w-full"
              >
                <Send className="h-4 w-4 mr-2" />
                Send Test Notification
              </Button>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Configuration Required</h4>
                <div className="text-sm text-blue-800 space-y-1">
                  <p>To enable notifications, set these environment variables:</p>
                  <ul className="list-disc list-inside ml-2 space-y-1">
                    <li><code>SLACK_WEBHOOK_URL</code> - Your Slack webhook URL</li>
                    <li><code>DISCORD_WEBHOOK_URL</code> - Your Discord webhook URL</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}