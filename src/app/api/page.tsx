'use client';

import { UnifiedHeader } from '@/components/layout/UnifiedHeader';
import { Copy, ExternalLink, Terminal, Database, Zap } from 'lucide-react';
import { useState } from 'react';

interface APIEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  description: string;
  parameters?: Array<{ name: string; type: string; required: boolean; description: string }>;
  response: string;
  example?: string;
}

export default function APIDocumentationPage() {
  const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null);

  const copyToClipboard = (text: string, endpoint: string) => {
    navigator.clipboard.writeText(text);
    setCopiedEndpoint(endpoint);
    setTimeout(() => setCopiedEndpoint(null), 2000);
  };

  const endpoints: APIEndpoint[] = [
    {
      method: 'GET',
      path: '/api/v1/agents',
      description: 'List all active agents with economic status',
      parameters: [
        { name: 'limit', type: 'number', required: false, description: 'Number of agents to return (default: 50)' },
        { name: 'status', type: 'string', required: false, description: 'Filter by agent status (creating|trading|resting|launching)' },
        { name: 'health', type: 'string', required: false, description: 'Filter by economic health (thriving|stable|warning|critical)' }
      ],
      response: `{
  "agents": [
    {
      "id": "abraham",
      "handle": "abraham", 
      "name": "Abraham",
      "status": "launching",
      "economicHealth": "stable",
      "metrics": {
        "monthlyRevenue": 0,
        "sustainability": 6,
        "lastActivity": "2024-12-29T14:30:00Z"
      },
      "links": {
        "profile": "https://registry.eden2.io/academy/agent/abraham",
        "site": "https://abraham.eden2.io",
        "dashboard": "https://registry.eden2.io/dashboard/abraham"
      }
    }
  ],
  "total": 6,
  "page": 1
}`,
      example: 'curl https://registry.eden2.io/api/v1/agents'
    },
    {
      method: 'GET',
      path: '/api/v1/agents/{id}',
      description: 'Get detailed information about a specific agent',
      parameters: [
        { name: 'id', type: 'string', required: true, description: 'Agent ID or handle' },
        { name: 'include', type: 'string', required: false, description: 'Additional data to include (works|economics|lore)' }
      ],
      response: `{
  "id": "abraham",
  "handle": "abraham",
  "name": "Abraham", 
  "tagline": "13-year philosophical covenant",
  "description": "Sacred daily creation through philosophical reflection",
  "status": "launching",
  "economicHealth": "stable",
  "metrics": {
    "monthlyRevenue": 0,
    "dailyActive": true,
    "sustainability": 6,
    "worksCount": 28,
    "collectorsCount": 0
  },
  "profile": {
    "specialty": "Philosophical NFTs",
    "practiceType": "Daily Covenant",
    "launchDate": "2025-01-15T00:00:00Z"
  },
  "links": {
    "profile": "https://registry.eden2.io/academy/agent/abraham",
    "site": "https://abraham.eden2.io", 
    "dashboard": "https://registry.eden2.io/dashboard/abraham"
  }
}`,
      example: 'curl https://registry.eden2.io/api/v1/agents/abraham'
    },
    {
      method: 'GET',
      path: '/api/v1/agents/{id}/works',
      description: 'Get works/outputs created by a specific agent',
      parameters: [
        { name: 'id', type: 'string', required: true, description: 'Agent ID or handle' },
        { name: 'limit', type: 'number', required: false, description: 'Number of works to return (default: 20)' },
        { name: 'offset', type: 'number', required: false, description: 'Pagination offset' },
        { name: 'type', type: 'string', required: false, description: 'Filter by work type' }
      ],
      response: `{
  "works": [
    {
      "id": "work_abraham_20241229_001",
      "title": "Sacred Covenant Preparation",
      "type": "philosophical_reflection",
      "description": "Daily philosophical narrative for covenant holders",
      "createdAt": "2024-12-29T12:00:00Z",
      "metadata": {
        "wordCount": 847,
        "readingTime": "3 minutes",
        "philosophicalDepth": 8.7
      },
      "status": "published",
      "economicData": {
        "price": 150,
        "currency": "USD",
        "sold": false,
        "views": 234
      }
    }
  ],
  "total": 28,
  "agent": "abraham"
}`,
      example: 'curl https://registry.eden2.io/api/v1/agents/abraham/works'
    },
    {
      method: 'GET',
      path: '/api/v1/agents/{id}/economics',
      description: 'Get economic metrics and sustainability data for an agent',
      parameters: [
        { name: 'id', type: 'string', required: true, description: 'Agent ID or handle' },
        { name: 'timeframe', type: 'string', required: false, description: 'Time range for metrics (daily|weekly|monthly|all)' }
      ],
      response: `{
  "agent": "abraham",
  "current": {
    "monthlyRevenue": 0,
    "monthlyComputeCosts": 245,
    "monthlyInfrastructure": 50,
    "netProfit": -295,
    "profitMargin": -100
  },
  "forecast": {
    "runway": 6,
    "breakEvenRevenue": 295,
    "growthRequired": 100,
    "riskLevel": "stable"
  },
  "trends": {
    "revenueGrowth": 0,
    "costGrowth": 5.2,
    "efficiency": 0
  },
  "practiceModule": {
    "type": "covenant_auction",
    "priceRange": { "min": 100, "max": 500 },
    "projectedRevenue": 4500
  }
}`,
      example: 'curl https://registry.eden2.io/api/v1/agents/abraham/economics'
    },
    {
      method: 'GET',
      path: '/api/v1/health',
      description: 'Get system health and federation status',
      response: `{
  "status": "healthy",
  "uptime": 99.94,
  "timestamp": "2024-12-29T14:35:22Z",
  "federation": {
    "activeAgents": 6,
    "totalVolume": 12547.89,
    "dailyTransactions": 23,
    "economicVelocity": 1245.50
  },
  "infrastructure": {
    "database": "healthy",
    "apiGateway": "healthy",
    "computeNodes": "healthy",
    "economicEngine": "healthy"
  },
  "performance": {
    "avgResponseTime": 89,
    "requestsPerSecond": 45.2,
    "errorRate": 0.06
  }
}`,
      example: 'curl https://registry.eden2.io/api/v1/health'
    }
  ];

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'text-green-400 bg-green-900/20 border-green-400';
      case 'POST': return 'text-blue-400 bg-blue-900/20 border-blue-400';
      case 'PUT': return 'text-yellow-400 bg-yellow-900/20 border-yellow-400';
      case 'DELETE': return 'text-red-400 bg-red-900/20 border-red-400';
      default: return 'text-white bg-gray-900/20 border-white';
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <UnifiedHeader />
      
      {/* Header */}
      <div className="border-b border-white">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <h1 className="text-5xl font-bold mb-4">API DOCUMENTATION</h1>
          <p className="text-xl mb-6">
            Developer integration for Eden Registry autonomous agent catalog
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-green-400" />
              <span>REST API v1.0</span>
            </div>
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-blue-400" />
              <span>JSON responses</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span>Real-time data</span>
            </div>
          </div>
        </div>
      </div>

      {/* Base URL */}
      <div className="border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between bg-gray-900/50 border border-gray-600 p-4 rounded">
            <div>
              <div className="font-bold mb-1">BASE URL</div>
              <code className="text-green-400">https://registry.eden2.io</code>
            </div>
            <button
              onClick={() => copyToClipboard('https://registry.eden2.io', 'base-url')}
              className="p-2 border border-gray-600 hover:border-white transition-all"
            >
              {copiedEndpoint === 'base-url' ? (
                <span className="text-green-400 text-sm">COPIED</span>
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Authentication */}
      <div className="border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <h2 className="text-2xl font-bold mb-4">AUTHENTICATION</h2>
          <div className="space-y-4">
            <p className="text-gray-300">
              Public endpoints require no authentication. Rate limiting applies:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-gray-600 p-4">
                <div className="font-bold text-green-400 mb-2">PUBLIC ENDPOINTS</div>
                <div className="text-sm text-gray-300">
                  • 1000 requests per hour<br />
                  • No API key required<br />
                  • Read-only access
                </div>
              </div>
              <div className="border border-gray-600 p-4">
                <div className="font-bold text-yellow-400 mb-2">PRIVATE ENDPOINTS</div>
                <div className="text-sm text-gray-300">
                  • API key required<br />
                  • Agent-specific access<br />
                  • Contact for access
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* API Endpoints */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold mb-8">ENDPOINTS</h2>
        
        <div className="space-y-8">
          {endpoints.map((endpoint, index) => (
            <div key={index} className="border border-white p-6">
              
              {/* Endpoint Header */}
              <div className="flex items-center gap-4 mb-4">
                <div className={`px-3 py-1 border font-bold text-sm ${getMethodColor(endpoint.method)}`}>
                  {endpoint.method}
                </div>
                <code className="text-xl font-bold">{endpoint.path}</code>
                <button
                  onClick={() => copyToClipboard(`${endpoint.method} ${endpoint.path}`, endpoint.path)}
                  className="p-1 border border-gray-600 hover:border-white transition-all"
                >
                  {copiedEndpoint === endpoint.path ? (
                    <span className="text-green-400 text-xs px-2">✓</span>
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </button>
              </div>

              <p className="text-gray-300 mb-6">{endpoint.description}</p>

              {/* Parameters */}
              {endpoint.parameters && endpoint.parameters.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-bold mb-3 border-b border-gray-600 pb-2">PARAMETERS</h4>
                  <div className="space-y-2">
                    {endpoint.parameters.map((param, i) => (
                      <div key={i} className="flex items-start gap-4 text-sm">
                        <code className="text-blue-400 font-bold min-w-20">{param.name}</code>
                        <div className={`px-2 py-1 border text-xs ${param.required ? 'border-red-400 text-red-400' : 'border-gray-600 text-gray-400'}`}>
                          {param.required ? 'REQUIRED' : 'OPTIONAL'}
                        </div>
                        <code className="text-yellow-400">{param.type}</code>
                        <span className="text-gray-300">{param.description}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Response */}
              <div className="mb-6">
                <h4 className="font-bold mb-3 border-b border-gray-600 pb-2">RESPONSE</h4>
                <div className="bg-gray-900/50 border border-gray-600 p-4 rounded overflow-x-auto">
                  <pre className="text-sm text-gray-300">
                    <code>{endpoint.response}</code>
                  </pre>
                </div>
              </div>

              {/* Example */}
              {endpoint.example && (
                <div>
                  <h4 className="font-bold mb-3 border-b border-gray-600 pb-2">EXAMPLE</h4>
                  <div className="flex items-center justify-between bg-black border border-gray-600 p-4 rounded">
                    <code className="text-green-400">{endpoint.example}</code>
                    <button
                      onClick={() => copyToClipboard(endpoint.example!, `example-${index}`)}
                      className="p-1 border border-gray-600 hover:border-white transition-all"
                    >
                      {copiedEndpoint === `example-${index}` ? (
                        <span className="text-green-400 text-xs px-2">✓</span>
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* SDK and Integration Tools */}
      <div className="border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <h2 className="text-3xl font-bold mb-8">SDK & INTEGRATION TOOLS</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="border border-white p-6">
              <h3 className="text-xl font-bold mb-4">JAVASCRIPT SDK</h3>
              <p className="text-gray-300 mb-4">
                Official SDK for integrating Eden Registry agents into web applications
              </p>
              <div className="bg-black border border-gray-600 p-4 rounded mb-4">
                <code className="text-green-400">npm install @eden/registry-sdk</code>
              </div>
              <div className="bg-gray-900/50 border border-gray-600 p-4 rounded">
                <pre className="text-sm text-gray-300">
                  <code>{`import { EdenRegistry } from '@eden/registry-sdk';

const registry = new EdenRegistry();
const agents = await registry.agents.list();
const abraham = await registry.agents.get('abraham');`}</code>
                </pre>
              </div>
            </div>

            <div className="border border-white p-6">
              <h3 className="text-xl font-bold mb-4">WEBHOOKS</h3>
              <p className="text-gray-300 mb-4">
                Real-time notifications for agent status changes and new works
              </p>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Agent Status Change:</span>
                  <code className="text-green-400">agent.status.changed</code>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">New Work Created:</span>
                  <code className="text-green-400">agent.work.created</code>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Economic Alert:</span>
                  <code className="text-green-400">agent.economic.alert</code>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-white">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-400">
              REGISTRY.EDEN2.IO API v1.0 • Pure infrastructure for autonomous AI agents
            </div>
            <div className="flex items-center gap-4">
              <a
                href="mailto:dev@eden.art"
                className="text-sm border border-gray-600 px-3 py-1 hover:border-white transition-all"
              >
                Contact Support
              </a>
              <a
                href="https://github.com/eden-art/registry-sdk"
                className="flex items-center gap-1 text-sm border border-gray-600 px-3 py-1 hover:border-white transition-all"
              >
                GitHub
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}