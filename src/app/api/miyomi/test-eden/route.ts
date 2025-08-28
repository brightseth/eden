/**
 * MIYOMI Eden API Test Endpoint
 * Tests direct integration with Eden API for video generation
 */
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

interface EdenTestRequest {
  tool: string;
  prompt: string;
  testMode?: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const { tool, prompt, testMode = true }: EdenTestRequest = await request.json();
    
    const edenApiKey = process.env.EDEN_API_KEY;
    const edenBaseUrl = process.env.EDEN_BASE_URL || 'https://api.eden.art';
    
    console.log('[Eden Test] Testing Eden API integration:', { tool, edenBaseUrl, hasApiKey: !!edenApiKey });
    
    if (!edenApiKey) {
      return NextResponse.json({
        success: false,
        error: 'Eden API key not configured',
        suggestion: 'Please set EDEN_API_KEY environment variable',
        mockResponse: generateMockResponse(tool, prompt)
      });
    }

    // Test API connectivity first
    const connectivityTest = await testEdenConnectivity(edenBaseUrl, edenApiKey);
    
    if (!connectivityTest.success) {
      return NextResponse.json({
        success: false,
        error: 'Cannot connect to Eden API',
        details: connectivityTest.error,
        mockResponse: generateMockResponse(tool, prompt)
      });
    }

    // Test specific tool
    const toolTest = await testEdenTool(edenBaseUrl, edenApiKey, tool, prompt);
    
    return NextResponse.json({
      success: true,
      connectivity: connectivityTest,
      toolTest,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('[Eden Test] Error:', error);
    return NextResponse.json({
      success: false,
      error: 'Test failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      mockResponse: generateMockResponse('txt2vid_fast', 'test prompt')
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const edenApiKey = process.env.EDEN_API_KEY;
    const edenBaseUrl = process.env.EDEN_BASE_URL || 'https://api.eden.art';
    
    // Test basic connectivity and list available tools
    const results = {
      hasApiKey: !!edenApiKey,
      baseUrl: edenBaseUrl,
      connectivity: null as any,
      availableTools: null as any
    };

    if (edenApiKey) {
      results.connectivity = await testEdenConnectivity(edenBaseUrl, edenApiKey);
      
      if (results.connectivity.success) {
        results.availableTools = await getAvailableTools(edenBaseUrl, edenApiKey);
      }
    }

    return NextResponse.json(results);

  } catch (error) {
    console.error('[Eden Test] GET Error:', error);
    return NextResponse.json({
      error: 'Failed to test Eden API',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Helper functions

async function testEdenConnectivity(baseUrl: string, apiKey: string) {
  try {
    console.log('Testing Eden API connectivity...');
    
    // Try to hit the tools endpoint first
    const response = await fetch(`${baseUrl}/v2/tools`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'User-Agent': 'MIYOMI-Dashboard/1.0'
      },
      timeout: 10000
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    return {
      success: true,
      status: response.status,
      toolsCount: Array.isArray(data) ? data.length : 0,
      responseTime: Date.now() - Date.now() // Simplified
    };

  } catch (error) {
    console.error('Eden connectivity test failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown connectivity error'
    };
  }
}

async function getAvailableTools(baseUrl: string, apiKey: string) {
  try {
    const response = await fetch(`${baseUrl}/v2/tools`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const tools = await response.json();
    
    // Filter for video-related tools
    const videoTools = Array.isArray(tools) ? 
      tools.filter((tool: any) => 
        tool.name?.toLowerCase().includes('vid') ||
        tool.description?.toLowerCase().includes('video') ||
        tool.name?.includes('runway') ||
        tool.name?.includes('veo')
      ) : [];

    return {
      total: Array.isArray(tools) ? tools.length : 0,
      videoTools: videoTools.map((tool: any) => ({
        name: tool.name,
        description: tool.description,
        cost: tool.cost_estimate,
        output_type: tool.output_type
      }))
    };

  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Failed to fetch tools'
    };
  }
}

async function testEdenTool(baseUrl: string, apiKey: string, toolName: string, prompt: string) {
  try {
    console.log(`Testing Eden tool: ${toolName}`);
    
    // Get tool details first
    const toolResponse = await fetch(`${baseUrl}/v2/tools/${toolName}`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!toolResponse.ok) {
      throw new Error(`Tool ${toolName} not found or inaccessible`);
    }

    const toolInfo = await toolResponse.json();
    
    // Estimate cost for the task
    const costResponse = await fetch(`${baseUrl}/v2/tasks/cost`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        tool: toolName,
        args: generateToolArgs(toolName, prompt)
      })
    });

    let costEstimate = null;
    if (costResponse.ok) {
      costEstimate = await costResponse.json();
    }

    // For testing, don't actually create the task to avoid charges
    // Just return the tool info and cost estimate
    return {
      success: true,
      toolInfo: {
        name: toolInfo.name,
        description: toolInfo.description,
        parameters: Object.keys(toolInfo.parameters || {}),
        output_type: toolInfo.output_type
      },
      costEstimate,
      note: 'Test mode - task not created to avoid charges'
    };

  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Tool test failed'
    };
  }
}

function generateToolArgs(toolName: string, prompt: string): any {
  const baseArgs = {
    text_input: prompt
  };

  switch (toolName.toLowerCase()) {
    case 'txt2vid':
    case 'txt2vid_fast':
      return {
        ...baseArgs,
        width: 576,
        height: 1024,
        n_frames: 16,
        guidance_scale: 7.5,
        steps: 25,
        fps: 8
      };
      
    case 'runway':
      return {
        ...baseArgs,
        duration: 4,
        resolution: '1280x768',
        motion: 'medium'
      };
      
    case 'veo':
    case 'veo2':
      return {
        ...baseArgs,
        width: 1920,
        height: 1080,
        n_frames: 32,
        guidance_scale: 8.5,
        steps: 50
      };
      
    default:
      return baseArgs;
  }
}

function generateMockResponse(tool: string, prompt: string): any {
  return {
    mockTask: {
      id: `mock_${tool}_${Date.now()}`,
      tool,
      status: 'completed',
      output: {
        output_video: `https://mock-eden-videos.s3.amazonaws.com/${tool}/sample-${Date.now()}.mp4`,
        thumbnail: `https://mock-eden-videos.s3.amazonaws.com/${tool}/thumb-${Date.now()}.jpg`
      },
      cost: Math.random() * 5 + 1, // $1-6 mock cost
      created_at: new Date().toISOString(),
      completed_at: new Date().toISOString()
    },
    note: 'This is mock data - Eden API not accessible'
  };
}