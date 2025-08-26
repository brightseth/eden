import { NextRequest, NextResponse } from 'next/server';

interface ConnectionTest {
  service: string;
  endpoint: string;
  status: 'success' | 'error' | 'timeout';
  latency: number;
  error?: string;
  response?: any;
}

interface AuditResult {
  timestamp: string;
  tests: ConnectionTest[];
  summary: {
    total: number;
    healthy: number;
    broken: number;
    avgLatency: number;
  };
}

async function testConnection(service: string, endpoint: string, timeout = 10000): Promise<ConnectionTest> {
  const startTime = Date.now();
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(endpoint, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Eden-Registry-Audit/1.0'
      }
    });

    clearTimeout(timeoutId);
    const latency = Date.now() - startTime;

    if (response.ok) {
      try {
        const data = await response.json();
        return {
          service,
          endpoint,
          status: 'success',
          latency,
          response: data
        };
      } catch {
        return {
          service,
          endpoint,
          status: 'success',
          latency,
          response: { message: 'Non-JSON response' }
        };
      }
    } else {
      return {
        service,
        endpoint,
        status: 'error',
        latency,
        error: `HTTP ${response.status}: ${response.statusText}`
      };
    }
  } catch (error) {
    const latency = Date.now() - startTime;
    
    if (error instanceof Error && error.name === 'AbortError') {
      return {
        service,
        endpoint,
        status: 'timeout',
        latency,
        error: `Timeout after ${timeout}ms`
      };
    }
    
    return {
      service,
      endpoint,
      status: 'error',
      latency,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log('[Registry Audit] Starting connectivity audit');

    // Define all endpoints to test
    const testCases = [
      // Core Registry
      {
        service: 'Genesis Registry',
        endpoint: 'https://eden-genesis-registry.vercel.app/api/v1/agents'
      },
      {
        service: 'Genesis Registry Health',
        endpoint: 'https://eden-genesis-registry.vercel.app/api/v1/health'
      },
      
      // Eden Academy (self-test)
      {
        service: 'Academy Registry Health',
        endpoint: `${process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'}/api/registry/health`
      },
      {
        service: 'Academy Registry Sync',
        endpoint: `${process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000'}/api/registry/sync`
      },

      // External Eden Services
      {
        service: 'Design Critic Agent',
        endpoint: 'https://design-critic-agent.vercel.app'
      },
      {
        service: 'Design Critic Registry',
        endpoint: 'https://design-critic-agent.vercel.app/api/registry'
      },
      {
        service: 'Amanda Art Agent',
        endpoint: 'https://amanda-art-agent.vercel.app'
      },
      {
        service: 'Amanda Registry',
        endpoint: 'https://amanda-art-agent.vercel.app/api/registry'
      },
      
      // Agent Sites
      {
        service: 'Abraham.ai',
        endpoint: 'https://abraham.ai'
      },
      {
        service: 'Abraham Registry',
        endpoint: 'https://abraham.ai/api/registry'
      },
      {
        service: 'Solienne.ai',
        endpoint: 'https://solienne.ai'
      },
      {
        service: 'Solienne Registry',
        endpoint: 'https://solienne.ai/api/registry'
      }
    ];

    // Run all tests in parallel
    const tests = await Promise.all(
      testCases.map(({ service, endpoint }) => testConnection(service, endpoint))
    );

    // Calculate summary
    const healthy = tests.filter(t => t.status === 'success').length;
    const broken = tests.filter(t => t.status !== 'success').length;
    const avgLatency = Math.round(
      tests.reduce((sum, t) => sum + t.latency, 0) / tests.length
    );

    const result: AuditResult = {
      timestamp: new Date().toISOString(),
      tests,
      summary: {
        total: tests.length,
        healthy,
        broken,
        avgLatency
      }
    };

    // Log critical findings
    const criticalFailures = tests.filter(t => 
      t.service.includes('Registry') && t.status !== 'success'
    );
    
    if (criticalFailures.length > 0) {
      console.error('[Registry Audit] CRITICAL: Registry endpoints failing:', 
        criticalFailures.map(t => `${t.service}: ${t.error}`));
    }

    const missingIntegrations = tests.filter(t => 
      !t.service.includes('Registry') && 
      t.status === 'success' &&
      tests.find(registry => 
        registry.service === `${t.service.split(' ')[0]} Registry` && 
        registry.status !== 'success'
      )
    );

    if (missingIntegrations.length > 0) {
      console.warn('[Registry Audit] Services without Registry integration:', 
        missingIntegrations.map(t => t.service));
    }

    return NextResponse.json(result);

  } catch (error) {
    console.error('[Registry Audit] Audit failed:', error);
    
    return NextResponse.json({
      error: 'Registry audit failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

// POST endpoint to test specific service
export async function POST(request: NextRequest) {
  try {
    const { service, endpoint } = await request.json();
    
    if (!service || !endpoint) {
      return NextResponse.json({
        error: 'Missing required fields',
        message: 'Both service name and endpoint URL are required'
      }, { status: 400 });
    }

    const result = await testConnection(service, endpoint);
    
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      test: result
    });

  } catch (error) {
    return NextResponse.json({
      error: 'Test failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}