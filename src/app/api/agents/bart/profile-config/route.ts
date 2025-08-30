// BART Profile Configuration API
// Returns lending-specific widget configuration for BART agent profile

import { NextRequest, NextResponse } from 'next/server';
import { AgentProfileConfig } from '@/lib/profile/types';

export async function GET(request: NextRequest) {
  try {
    // BART-specific lending widget configuration
    const bartConfig: AgentProfileConfig = {
      agentId: 'bart',
      layout: {
        type: 'standard',
        maxWidth: '6xl',
        spacing: 'normal'
      },
      widgets: [
        // Hero section for lending agent
        {
          id: 'bart-hero',
          type: 'hero',
          position: { section: 'header', order: 1 },
          config: {
            title: 'BART',
            subtitle: 'Renaissance NFT Lending AI',
            showStatus: true,
            showTrainer: true,
            primaryAction: {
              text: 'VIEW LENDING DEMO',
              href: '/api/agents/bart/demo'
            },
            secondaryActions: [
              {
                text: 'LENDING DASHBOARD',
                href: '/dashboard/bart'
              }
            ]
          },
          visibility: { always: true }
        },

        // Mission statement for lending focus
        {
          id: 'bart-mission',
          type: 'mission',
          position: { section: 'main', order: 1 },
          config: {
            title: 'LENDING PHILOSOPHY',
            content: {
              source: 'registry',
              path: 'profile.statement'
            },
            layout: 'single-column',
            showBorder: true
          },
          visibility: { always: true }
        },

        // Lending-specific metrics instead of creative metrics
        {
          id: 'bart-lending-metrics',
          type: 'metrics',
          position: { section: 'main', order: 2 },
          config: {
            title: 'LENDING PERFORMANCE',
            showRevenue: true,
            showOutput: false, // Not relevant for lending
            showEngagement: false, // Not relevant for lending
            showLendingVolume: true,
            showActiveLoans: true,
            showDefaultRate: true,
            layout: 'grid',
            customMetrics: [
              { key: 'totalDeployed', label: 'Total ETH Deployed', format: 'eth' },
              { key: 'activeLoans', label: 'Active Loans', format: 'number' },
              { key: 'avgLTV', label: 'Average LTV', format: 'percentage' },
              { key: 'defaultRate', label: 'Default Rate', format: 'percentage' }
            ]
          },
          visibility: { always: true }
        },

        // Token economics for lending revenue
        {
          id: 'bart-token-economics',
          type: 'token-economics',
          position: { section: 'main', order: 3 },
          config: {
            title: 'LENDING REVENUE & TOKENOMICS',
            tokenSymbol: 'BART',
            showPrice: true,
            showMarketCap: true,
            showVolume: true,
            showRevenue: true,
            showLendingRevenue: true,
            timeframe: '30d'
          },
          visibility: {
            condition: 'agent.tokenAddress !== null'
          }
        },

        // Training status for AI development
        {
          id: 'bart-training-status',
          type: 'training-status',
          position: { section: 'sidebar', order: 1 },
          config: {
            title: 'AI TRAINING STATUS',
            showProgress: true,
            showMilestones: true,
            progressStyle: 'bar'
          },
          visibility: { always: true }
        },

        // Trainer information
        {
          id: 'bart-trainer-info',
          type: 'trainer-info',
          position: { section: 'sidebar', order: 2 },
          config: {
            showBio: true,
            showMethodology: true,
            showContact: false
          },
          visibility: { always: true }
        },

        // Social links for professional networking
        {
          id: 'bart-social-links',
          type: 'social-links',
          position: { section: 'sidebar', order: 3 },
          config: {
            layout: 'vertical',
            showIcons: true,
            professionalFocus: true
          },
          visibility: {
            condition: 'agent.profile.links !== null'
          }
        },

        // Custom lending content
        {
          id: 'bart-lending-info',
          type: 'custom-content',
          position: { section: 'main', order: 4 },
          config: {
            title: 'NFT LENDING EXPERTISE',
            content: `BART combines Renaissance banking wisdom with modern DeFi protocols to provide:

• **Risk Assessment**: AI-powered NFT valuation using market data and rarity analysis
• **Dynamic LTV**: Real-time loan-to-value adjustments based on market conditions  
• **Portfolio Management**: Diversified lending across blue-chip collections
• **Gondi Integration**: Direct integration with Gondi.xyz lending protocol
• **Renaissance Principles**: Time-tested banking methodologies for sustainable lending

Built on the foundation of Bartolomeo Gondi's banking legacy, BART brings centuries of financial wisdom to the NFT lending space.`,
            format: 'markdown'
          },
          visibility: { always: true }
        },

        // Community for professional networking
        {
          id: 'bart-community',
          type: 'community',
          position: { section: 'main', order: 5 },
          config: {
            title: 'LENDING COMMUNITY',
            showMetrics: true,
            showEvents: false,
            showTestimonials: true,
            showSocial: true,
            showLeaderboard: false,
            maxTestimonials: 3,
            focus: 'professional'
          },
          visibility: { always: true }
        }
      ],
      navigation: {
        showBackToAcademy: true,
        customNav: false
      },
      theme: {
        background: 'bg-black text-white',
        accent: 'blue',
        borders: 'border-white',
        textColor: 'text-white'
      },
      metadata: {
        title: 'BART - Renaissance NFT Lending AI',
        description: 'AI-powered NFT lending agent combining Renaissance banking wisdom with modern DeFi protocols',
        ogImage: '/images/agents/bart/og-image.jpg',
        version: '1.0.0'
      }
    };

    return NextResponse.json(bartConfig);
    
  } catch (error) {
    console.error('Error generating BART profile config:', error);
    return NextResponse.json(
      { error: 'Failed to generate profile configuration' },
      { status: 500 }
    );
  }
}

// Add OPTIONS handler for CORS
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}