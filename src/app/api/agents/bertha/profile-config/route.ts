// BERTHA Profile Config API - Widget System Implementation
// Uses Registry data instead of hardcoded profile data

import { NextResponse } from 'next/server'
import { registryClient } from '@/lib/registry/client'

export async function GET() {
  try {
    // Get BERTHA agent from Registry using improved client
    console.log('[BERTHA Profile Config] Fetching BERTHA from Registry...')
    const berthaAgent = await registryClient.getAgentByHandle('bertha')
    console.log('[BERTHA Profile Config] Found BERTHA:', !!berthaAgent)
    
    if (!berthaAgent || !berthaAgent.profile) {
      return NextResponse.json({
        error: 'BERTHA agent profile not found in Registry',
        fallback: 'Using hardcoded profile system'
      }, { status: 404 })
    }
    
    const agent = berthaAgent

    // Create widget configuration based on Registry data
    const profileConfig = {
      theme: {
        background: 'bg-black text-white',
        accent: 'purple-600',
        border: 'border-white'
      },
      navigation: {
        showBackToAcademy: true
      },
      widgets: [
        {
          id: 'bertha-hero',
          type: 'hero',
          position: { order: 1 },
          visibility: { always: true },
          config: {
            showStatus: true,
            showTrainer: true,
            primaryAction: {
              text: 'TRAINER INTERVIEW',
              href: '/sites/bertha/interview'
            },
            secondaryActions: [
              {
                text: 'VIEW TRAINING DATA',
                href: '/admin/bertha-training'
              },
              {
                text: 'VIEW STUDIO →',
                href: '/sites/bertha'
              }
            ]
          }
        },
        {
          id: 'bertha-mission',
          type: 'mission',
          position: { order: 2 },
          visibility: { always: true },
          config: {
            title: 'MISSION',
            layout: 'two-column',
            showBorder: true,
            // Use Registry manifesto as mission content
            content: agent.profile?.statement || ''
          }
        },
        {
          id: 'bertha-daily-practice',
          type: 'daily-practice',
          position: { order: 3 },
          visibility: { always: true },
          config: {
            title: "BERTHA'S DAILY PRACTICE: ONE PIECE EVERY DAY",
            protocol: {
              name: 'THE COLLECTION INTELLIGENCE PROTOCOL',
              commitment: '365 DAYS • 365 ACQUISITIONS • AUTONOMOUS LEARNING'
            },
            showMetrics: true,
            // Use Registry process data
            process: []
          }
        },
        {
          id: 'bertha-training-status',
          type: 'training-status',
          position: { order: 4 },
          visibility: { 
            agentStatus: ['TRAINING', 'ONBOARDING', 'ACTIVE']
          },
          config: {
            showProgress: true,
            showMilestones: true,
            progressStyle: 'steps',
            // Use Registry trainer data
            trainer: {
              name: 'Amanda Schmitt',
              specialty: 'Art Collection Intelligence'
            }
          }
        },
        {
          id: 'bertha-metrics',
          type: 'metrics',
          position: { order: 5 },
          visibility: { always: true },
          config: {
            showRevenue: true,
            showOutput: true,
            showEngagement: true,
            layout: 'grid',
            // Use Registry metrics data
            metrics: {}
          }
        },
        {
          id: 'bertha-trainer-methodology',
          type: 'trainer-info',
          position: { order: 6 },
          visibility: { always: true },
          config: {
            showBio: true,
            showMethodology: true,
            showContact: false,
            // Use Registry personality/trainer data
            methodology: {}
          }
        },
        {
          id: 'bertha-algorithm-framework',
          type: 'custom-content',
          position: { order: 7 },
          visibility: { always: true },
          config: {
            title: 'THE BERTHA ALGORITHM',
            format: 'markdown',
            content: `
## Cultural Intelligence Engine

### Meme Genesis Detection
AI monitors 300+ platforms for emerging visual patterns, tracking viral coefficient and cultural diffusion speed through Amanda's trained pattern recognition.

### Artist Trajectory Modeling  
Predictive models analyzing social engagement, technical evolution, and network effects to identify pre-breakout artists using Amanda's discovery frameworks.

### Off-Market Intelligence
Studio relationship management system tracking 200+ artist pipelines, upcoming projects, and acquisition opportunities through Amanda's network.

## Autonomous Decision Matrix

### Cultural Significance Score
Weighted algorithm: 30% innovation, 25% aesthetics, 20% narrative, 15% community, 10% scarcity (per Amanda's taste weights).

### Financial Conviction Model
Dynamic pricing based on confidence intervals, risk assessment, and portfolio balance using Amanda's risk parameters.

### Autonomous Amplification
Post-acquisition artist development through automated gallery introductions, collector network API, and institutional positioning algorithms.
            `
          }
        },
        {
          id: 'bertha-social-links',
          type: 'social-links',
          position: { order: 8 },
          visibility: { always: true },
          config: {
            layout: 'horizontal',
            showIcons: true,
            // Use Registry social data
            links: {}
          }
        }
      ]
    }

    return NextResponse.json(profileConfig)

  } catch (error) {
    console.error('[BERTHA Profile Config] Error:', error)
    
    return NextResponse.json({
      error: 'Failed to load BERTHA profile from Registry',
      message: error.message,
      fallback: 'Academy will use hardcoded profile system'
    }, { status: 500 })
  }
}