import { NextRequest, NextResponse } from 'next/server'

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

interface Alert {
  id: string
  rule: string
  message: string
  severity: 'info' | 'warning' | 'error' | 'critical'
  timestamp: string
  data?: any
  acknowledged: boolean
}

// Global alert state
let alertRules: AlertRule[] = [
  {
    id: 'registry-health',
    name: 'Registry Health Critical',
    condition: 'registry.health.status != "healthy"',
    severity: 'critical',
    enabled: true,
    channels: ['slack', 'discord'],
    throttleMinutes: 15
  },
  {
    id: 'agent-deployment-failed',
    name: 'Agent Deployment Failed',
    condition: 'deployment.status == "failed"',
    severity: 'error',
    enabled: true,
    channels: ['slack'],
    throttleMinutes: 5
  },
  {
    id: 'config-critical-change',
    name: 'Critical Configuration Change',
    condition: 'config.change.critical == true',
    severity: 'warning',
    enabled: true,
    channels: ['discord'],
    throttleMinutes: 0
  },
  {
    id: 'test-failures',
    name: 'Test Suite Failures',
    condition: 'test.failures > 0',
    severity: 'warning',
    enabled: true,
    channels: ['slack'],
    throttleMinutes: 30
  },
  {
    id: 'high-error-rate',
    name: 'High Error Rate',
    condition: 'errors.rate > 10',
    severity: 'error',
    enabled: true,
    channels: ['slack', 'discord'],
    throttleMinutes: 10
  }
]

let alerts: Alert[] = []

// GET /api/alerts - Get alerts and rules
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type')
  const acknowledged = searchParams.get('acknowledged')

  try {
    if (type === 'rules') {
      return NextResponse.json({
        success: true,
        rules: alertRules
      })
    }

    let filteredAlerts = alerts
    if (acknowledged !== null) {
      const ackFilter = acknowledged === 'true'
      filteredAlerts = alerts.filter(alert => alert.acknowledged === ackFilter)
    }

    // Sort by timestamp (most recent first)
    filteredAlerts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    return NextResponse.json({
      success: true,
      alerts: filteredAlerts.slice(0, 100), // Limit to last 100
      summary: {
        total: alerts.length,
        unacknowledged: alerts.filter(a => !a.acknowledged).length,
        critical: alerts.filter(a => a.severity === 'critical' && !a.acknowledged).length,
        errors: alerts.filter(a => a.severity === 'error' && !a.acknowledged).length,
        warnings: alerts.filter(a => a.severity === 'warning' && !a.acknowledged).length
      }
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch alerts'
    }, { status: 500 })
  }
}

// POST /api/alerts - Create alert or manage rules
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, data } = body

    if (action === 'trigger') {
      // Trigger an alert
      const { ruleId, message, data: alertData } = data
      const rule = alertRules.find(r => r.id === ruleId)
      
      if (!rule || !rule.enabled) {
        return NextResponse.json({
          success: false,
          error: 'Alert rule not found or disabled'
        }, { status: 400 })
      }

      // Check throttling
      if (rule.throttleMinutes > 0 && rule.lastTriggered) {
        const lastTriggered = new Date(rule.lastTriggered)
        const now = new Date()
        const timeDiff = (now.getTime() - lastTriggered.getTime()) / (1000 * 60)
        
        if (timeDiff < rule.throttleMinutes) {
          return NextResponse.json({
            success: false,
            error: 'Alert is throttled',
            nextAllowed: new Date(lastTriggered.getTime() + rule.throttleMinutes * 60 * 1000).toISOString()
          }, { status: 429 })
        }
      }

      const alert: Alert = {
        id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        rule: ruleId,
        message: message || `Alert triggered: ${rule.name}`,
        severity: rule.severity,
        timestamp: new Date().toISOString(),
        data: alertData,
        acknowledged: false
      }

      alerts.push(alert)
      
      // Update rule last triggered
      rule.lastTriggered = alert.timestamp

      // Keep only last 1000 alerts
      if (alerts.length > 1000) {
        alerts = alerts.slice(-1000)
      }

      // Send notifications
      await sendNotifications(alert, rule)

      return NextResponse.json({
        success: true,
        alert,
        message: `Alert triggered and sent to ${rule.channels.join(', ')}`
      })

    } else if (action === 'acknowledge') {
      // Acknowledge alerts
      const { alertIds } = data
      
      for (const alertId of alertIds) {
        const alert = alerts.find(a => a.id === alertId)
        if (alert) {
          alert.acknowledged = true
        }
      }

      return NextResponse.json({
        success: true,
        acknowledged: alertIds.length,
        message: `${alertIds.length} alerts acknowledged`
      })

    } else if (action === 'update-rule') {
      // Update alert rule
      const { ruleId, updates } = data
      const ruleIndex = alertRules.findIndex(r => r.id === ruleId)
      
      if (ruleIndex === -1) {
        return NextResponse.json({
          success: false,
          error: 'Alert rule not found'
        }, { status: 404 })
      }

      alertRules[ruleIndex] = { ...alertRules[ruleIndex], ...updates }

      return NextResponse.json({
        success: true,
        rule: alertRules[ruleIndex],
        message: 'Alert rule updated'
      })

    } else {
      return NextResponse.json({
        success: false,
        error: 'Invalid action'
      }, { status: 400 })
    }

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Alert operation failed'
    }, { status: 500 })
  }
}

// Send notifications to configured channels
async function sendNotifications(alert: Alert, rule: AlertRule): Promise<void> {
  const notifications = []

  for (const channel of rule.channels) {
    if (channel === 'slack') {
      notifications.push(sendSlackNotification(alert, rule))
    } else if (channel === 'discord') {
      notifications.push(sendDiscordNotification(alert, rule))
    }
  }

  // Execute all notifications
  await Promise.allSettled(notifications)
}

async function sendSlackNotification(alert: Alert, rule: AlertRule): Promise<void> {
  const slackWebhook = process.env.SLACK_WEBHOOK_URL
  if (!slackWebhook) {
    console.warn('Slack webhook not configured')
    return
  }

  const color = {
    info: '#36a3eb',
    warning: '#ffce56',
    error: '#ff6384',
    critical: '#ff4444'
  }[alert.severity]

  const payload = {
    text: `🚨 Eden Registry Alert: ${rule.name}`,
    attachments: [
      {
        color,
        fields: [
          {
            title: 'Message',
            value: alert.message,
            short: false
          },
          {
            title: 'Severity',
            value: alert.severity.toUpperCase(),
            short: true
          },
          {
            title: 'Time',
            value: new Date(alert.timestamp).toLocaleString(),
            short: true
          }
        ]
      }
    ]
  }

  if (alert.data) {
    payload.attachments[0].fields.push({
      title: 'Data',
      value: `\`\`\`${JSON.stringify(alert.data, null, 2)}\`\`\``,
      short: false
    })
  }

  try {
    await fetch(slackWebhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
  } catch (error) {
    console.error('Failed to send Slack notification:', error)
  }
}

async function sendDiscordNotification(alert: Alert, rule: AlertRule): Promise<void> {
  const discordWebhook = process.env.DISCORD_WEBHOOK_URL
  if (!discordWebhook) {
    console.warn('Discord webhook not configured')
    return
  }

  const color = {
    info: 0x36a3eb,
    warning: 0xffce56,
    error: 0xff6384,
    critical: 0xff4444
  }[alert.severity]

  const payload = {
    content: `🚨 **Eden Registry Alert**`,
    embeds: [
      {
        title: rule.name,
        description: alert.message,
        color,
        fields: [
          {
            name: 'Severity',
            value: alert.severity.toUpperCase(),
            inline: true
          },
          {
            name: 'Time',
            value: new Date(alert.timestamp).toLocaleString(),
            inline: true
          }
        ],
        timestamp: alert.timestamp
      }
    ]
  }

  if (alert.data) {
    payload.embeds[0].fields.push({
      name: 'Data',
      value: `\`\`\`json\n${JSON.stringify(alert.data, null, 2)}\`\`\``,
      inline: false
    })
  }

  try {
    await fetch(discordWebhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
  } catch (error) {
    console.error('Failed to send Discord notification:', error)
  }
}

// Test notification endpoint
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { channel, severity = 'info' } = body

    const testAlert: Alert = {
      id: `test_${Date.now()}`,
      rule: 'test',
      message: `Test notification from Eden Registry - ${severity.toUpperCase()} level`,
      severity,
      timestamp: new Date().toISOString(),
      data: { test: true, timestamp: new Date().toISOString() },
      acknowledged: false
    }

    const testRule: AlertRule = {
      id: 'test',
      name: 'Test Alert',
      condition: 'test == true',
      severity,
      enabled: true,
      channels: [channel],
      throttleMinutes: 0
    }

    await sendNotifications(testAlert, testRule)

    return NextResponse.json({
      success: true,
      message: `Test notification sent to ${channel}`,
      alert: testAlert
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Test notification failed'
    }, { status: 500 })
  }
}