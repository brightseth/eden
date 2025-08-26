'use client';

import { useState, useEffect } from 'react';

interface ConnectionTest {
  endpoint: string;
  description: string;
  status: 'testing' | 'success' | 'error' | 'timeout';
  response?: any;
  error?: string;
  latency?: number;
}

interface ServiceTest {
  name: string;
  url: string;
  endpoints: ConnectionTest[];
  overall: 'healthy' | 'degraded' | 'broken';
}

export default function RegistryAuditPage() {
  const [services, setServices] = useState<ServiceTest[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [lastRun, setLastRun] = useState<Date | null>(null);

  const testEndpoints = [
    // Eden Academy endpoints
    {
      endpoint: '/api/registry/health',
      description: 'Academy Registry Health Check'
    },
    {
      endpoint: '/api/registry/sync',
      description: 'Academy Registry Sync'
    },
    {
      endpoint: '/api/agents',
      description: 'Academy Agents API (should use Registry)'
    },
    
    // Direct Registry endpoints
    {
      endpoint: 'https://eden-genesis-registry.vercel.app/api/v1/agents',
      description: 'Direct Registry Agents'
    },
    {
      endpoint: 'https://eden-genesis-registry.vercel.app/api/v1/health',
      description: 'Registry Health'
    }
  ];

  const externalServices = [
    {
      name: 'Design Critic Agent',
      url: 'https://design-critic-agent.vercel.app',
      expectedIntegration: false
    },
    {
      name: 'Amanda Art Agent',
      url: 'https://amanda-art-agent.vercel.app',
      expectedIntegration: false
    },
    {
      name: 'Abraham.ai',
      url: 'https://abraham.ai',
      expectedIntegration: false
    },
    {
      name: 'Solienne.ai',
      url: 'https://solienne.ai',
      expectedIntegration: false
    }
  ];

  const testConnection = async (endpoint: string): Promise<ConnectionTest> => {
    const startTime = Date.now();
    const test: ConnectionTest = {
      endpoint,
      description: endpoint,
      status: 'testing'
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(endpoint, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json'
        }
      });

      clearTimeout(timeoutId);
      const latency = Date.now() - startTime;

      if (response.ok) {
        const data = await response.json();
        test.status = 'success';
        test.response = data;
        test.latency = latency;
      } else {
        test.status = 'error';
        test.error = `HTTP ${response.status}: ${response.statusText}`;
        test.latency = latency;
      }
    } catch (error) {
      test.latency = Date.now() - startTime;
      
      if (error instanceof Error && error.name === 'AbortError') {
        test.status = 'timeout';
        test.error = 'Request timeout (10s)';
      } else {
        test.status = 'error';
        test.error = error instanceof Error ? error.message : 'Unknown error';
      }
    }

    return test;
  };

  const runAudit = async () => {
    setIsRunning(true);
    setLastRun(new Date());

    // Test Academy endpoints
    const academyTests: ConnectionTest[] = [];
    for (const { endpoint, description } of testEndpoints) {
      const fullUrl = endpoint.startsWith('http') ? endpoint : `${window.location.origin}${endpoint}`;
      const test = await testConnection(fullUrl);
      test.description = description;
      academyTests.push(test);
    }

    const academyService: ServiceTest = {
      name: 'Eden Academy',
      url: window.location.origin,
      endpoints: academyTests,
      overall: academyTests.every(t => t.status === 'success') ? 'healthy' :
               academyTests.some(t => t.status === 'success') ? 'degraded' : 'broken'
    };

    // Test external services
    const externalTests: ServiceTest[] = [];
    for (const service of externalServices) {
      const tests = await Promise.all([
        testConnection(service.url),
        testConnection(`${service.url}/api/health`),
        testConnection(`${service.url}/api/registry`),
      ]);

      tests[0].description = 'Service Available';
      tests[1].description = 'Health Endpoint';
      tests[2].description = 'Registry Integration';

      externalTests.push({
        name: service.name,
        url: service.url,
        endpoints: tests,
        overall: tests[0].status === 'success' ? 
                (tests[2].status === 'success' ? 'healthy' : 'degraded') : 'broken'
      });
    }

    setServices([academyService, ...externalTests]);
    setIsRunning(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': case 'healthy': return 'text-green-600';
      case 'degraded': return 'text-yellow-600';
      case 'error': case 'broken': return 'text-red-600';
      case 'timeout': return 'text-orange-600';
      case 'testing': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': case 'healthy': return '✅';
      case 'degraded': return '⚠️';
      case 'error': case 'broken': return '❌';
      case 'timeout': return '⏱️';
      case 'testing': return '⏳';
      default: return '❔';
    }
  };

  return (
    <div className="min-h-screen bg-white text-black p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-4">Registry Connection Audit</h1>
          <p className="text-gray-600 mb-6">
            Identify broken Registry connections across Eden services
          </p>
          
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={runAudit}
              disabled={isRunning}
              className="px-4 py-2 bg-black text-white disabled:bg-gray-400"
            >
              {isRunning ? 'Running Audit...' : 'Run Registry Audit'}
            </button>
            
            {lastRun && (
              <span className="text-sm text-gray-500">
                Last run: {lastRun.toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>

        {services.length > 0 && (
          <div className="space-y-8">
            {services.map((service, idx) => (
              <div key={idx} className="border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold">{service.name}</h2>
                    <p className="text-sm text-gray-500">{service.url}</p>
                  </div>
                  <div className={`text-lg ${getStatusColor(service.overall)}`}>
                    {getStatusIcon(service.overall)} {service.overall.toUpperCase()}
                  </div>
                </div>

                <div className="space-y-3">
                  {service.endpoints.map((test, testIdx) => (
                    <div key={testIdx} className="flex items-center justify-between p-3 border border-gray-100">
                      <div className="flex-1">
                        <div className="font-medium">{test.description}</div>
                        <div className="text-sm text-gray-500">
                          {test.endpoint}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        {test.latency && (
                          <span className="text-sm text-gray-500">
                            {test.latency}ms
                          </span>
                        )}
                        
                        <div className={`flex items-center gap-1 ${getStatusColor(test.status)}`}>
                          {getStatusIcon(test.status)}
                          <span className="text-sm font-medium">
                            {test.status.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Error details */}
                {service.endpoints.some(t => t.error) && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200">
                    <h4 className="font-medium text-red-800 mb-2">Errors:</h4>
                    {service.endpoints.filter(t => t.error).map((test, errorIdx) => (
                      <div key={errorIdx} className="text-sm text-red-700">
                        <strong>{test.description}:</strong> {test.error}
                      </div>
                    ))}
                  </div>
                )}

                {/* Registry integration analysis */}
                {service.name !== 'Eden Academy' && (
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200">
                    <h4 className="font-medium text-blue-800 mb-2">Registry Integration Analysis:</h4>
                    <div className="text-sm text-blue-700">
                      {service.endpoints.find(t => t.description.includes('Registry'))?.status === 'success' ? (
                        <span className="text-green-700">✅ Registry integration detected</span>
                      ) : (
                        <span className="text-orange-700">⚠️ No Registry integration found - using static data</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Summary */}
            <div className="border-t-2 border-black pt-6">
              <h3 className="text-xl font-bold mb-4">Audit Summary</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {services.filter(s => s.overall === 'healthy').length}
                  </div>
                  <div className="text-sm">Healthy</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {services.filter(s => s.overall === 'degraded').length}
                  </div>
                  <div className="text-sm">Degraded</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {services.filter(s => s.overall === 'broken').length}
                  </div>
                  <div className="text-sm">Broken</div>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-gray-50 p-6 border border-gray-200">
              <h4 className="font-bold mb-4">🔧 Recommended Actions</h4>
              <ul className="space-y-2 text-sm">
                {services.filter(s => s.overall === 'broken').length > 0 && (
                  <li className="text-red-700">
                    ❌ <strong>Critical:</strong> {services.filter(s => s.overall === 'broken').length} service(s) completely unreachable
                  </li>
                )}
                {services.filter(s => s.overall === 'degraded').length > 0 && (
                  <li className="text-yellow-700">
                    ⚠️ <strong>Warning:</strong> {services.filter(s => s.overall === 'degraded').length} service(s) lack Registry integration
                  </li>
                )}
                {services.filter(s => s.overall === 'healthy').length === services.length && (
                  <li className="text-green-700">
                    ✅ <strong>All systems operational:</strong> Registry connections healthy
                  </li>
                )}
              </ul>
            </div>
          </div>
        )}

        {services.length === 0 && !isRunning && (
          <div className="text-center py-12 text-gray-500">
            Click "Run Registry Audit" to check all Registry connections
          </div>
        )}
      </div>
    </div>
  );
}