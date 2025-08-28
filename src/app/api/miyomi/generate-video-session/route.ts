/**
 * MIYOMI Video Generation with Eden API Sessions
 * Creates Eden session and generates cinematic videos using the Dynamic Narrative Video Framework
 */
import { NextRequest, NextResponse } from 'next/server';
import { miyomiEdenPromptGenerator } from '@/lib/agents/miyomi-eden-prompt-generator';

export const runtime = 'nodejs';

interface SessionRequest {
  conceptId: string;
  style?: string;
  useDynamicFramework?: boolean;
  agentId?: string;
}

export async function POST(request: NextRequest) {
  try {
    const { conceptId, style = 'cinematic', useDynamicFramework = true, agentId }: SessionRequest = await request.json();
    
    console.log('[MIYOMI Sessions] Starting video generation:', { conceptId, style, useDynamicFramework });

    // Step 1: Fetch the concept
    const concept = await fetchConceptFromDatabase(conceptId);
    if (!concept) {
      return NextResponse.json({ 
        success: false, 
        error: 'Concept not found' 
      }, { status: 404 });
    }

    // Step 2: Generate the Eden project using Dynamic Narrative Framework
    const edenProject = await miyomiEdenPromptGenerator.generateEdenProject({
      market: concept.title,
      prediction: concept.coreConcept,
      confidence: concept.urgencyScore / 100,
      timeframe: '24h',
      contrarian_angle: concept.contrarian_angle,
      data_points: [concept.dataPoints.primary, ...concept.dataPoints.supporting]
    });

    // Step 3: Generate Eden prompt (always works)
    const edenPrompt = miyomiEdenPromptGenerator.generateEdenPrompt(edenProject);

    // Step 4: Try to create Eden session (may fail if no API key/agent ID)
    const sessionResult = await createEdenSession(agentId);
    
    if (!sessionResult.success) {
      console.warn('[MIYOMI Sessions] Eden session creation failed, using demo mode:', sessionResult.error);
      
      // Return demo response with generated project data
      const demoSessionId = `demo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      await storeSessionRecord({
        sessionId: demoSessionId,
        conceptId,
        edenProject,
        edenPrompt,
        concept,
        status: 'demo-mode'
      });

      return NextResponse.json({
        success: true,
        sessionId: demoSessionId,
        concept,
        edenProject,
        edenPrompt,
        demoMode: true,
        message: 'Demo mode: Eden API not configured. Video generation framework created successfully.',
        warning: sessionResult.error
      });
    }

    const sessionId = sessionResult.sessionId!;
    console.log('[MIYOMI Sessions] Eden session created:', sessionId);

    // Step 5: Send the video generation message to the session
    const messageResult = await sendSessionMessage(sessionId, edenPrompt.text_input, agentId);
    
    if (!messageResult.success) {
      console.warn('[MIYOMI Sessions] Message send failed:', messageResult.error);
      
      // Store session anyway for demo purposes
      await storeSessionRecord({
        sessionId,
        conceptId,
        edenProject,
        edenPrompt,
        concept,
        status: 'message-failed'
      });

      return NextResponse.json({
        success: true,
        sessionId,
        concept,
        edenProject,
        edenPrompt,
        demoMode: true,
        message: 'Partial success: Session created but message send failed. Framework generated successfully.',
        warning: messageResult.error
      });
    }

    // Step 5: Store the session info for polling
    await storeSessionRecord({
      sessionId,
      conceptId,
      edenProject,
      edenPrompt,
      concept,
      status: 'generating'
    });

    return NextResponse.json({
      success: true,
      sessionId,
      concept,
      edenProject,
      edenPrompt,
      message: 'Video generation session started successfully'
    });

  } catch (error) {
    console.error('[MIYOMI Sessions] Error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Helper functions

async function createEdenSession(agentId?: string): Promise<{ success: boolean; sessionId?: string; error?: string }> {
  const edenApiKey = process.env.EDEN_API_KEY;
  const edenBaseUrl = process.env.EDEN_BASE_URL || 'https://api.eden.art';
  
  if (!edenApiKey) {
    return { success: false, error: 'Eden API key not configured' };
  }

  // Use provided agentId or default MIYOMI agent
  const defaultAgentId = process.env.MIYOMI_EDEN_AGENT_ID || 'miyomi';
  const useAgentId = agentId || defaultAgentId;

  try {
    const response = await fetch(`${edenBaseUrl}/v2/sessions/create`, {
      method: 'POST',
      headers: {
        'X-Api-Key': edenApiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        agent_ids: [useAgentId],
        title: 'MIYOMI Cinematic Video Generation',
        scenario: 'Dynamic Narrative Video Framework - 9-phase cinematic approach for market analysis',
        budget: {
          manna_budget: 1000,
          token_budget: 10000,
          turn_budget: 10
        },
        autonomy_settings: {
          auto_reply: true,
          reply_interval: 2,
          actor_selection_method: 'random'
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Eden API error ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    return { 
      success: true, 
      sessionId: data.session_id || data.id 
    };
    
  } catch (error) {
    console.error('[Eden API] Create session failed:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Session creation failed' 
    };
  }
}

async function sendSessionMessage(sessionId: string, content: string, agentId?: string): Promise<{ success: boolean; error?: string }> {
  const edenApiKey = process.env.EDEN_API_KEY;
  const edenBaseUrl = process.env.EDEN_BASE_URL || 'https://api.eden.art';
  
  if (!edenApiKey) {
    return { success: false, error: 'Eden API key not configured' };
  }

  try {
    const messagePayload: any = {
      session_id: sessionId,
      content: `Create a cinematic video using the Dynamic Narrative Video Framework. Here's the concept:\n\n${content}\n\nPlease generate a compelling video that follows the 9-phase cinematic approach with visual DNA and emotional frequency targeting. Make it engaging for market analysis content.`,
      stream: false,
      thinking: true
    };

    // Add agent_ids if specified
    if (agentId) {
      messagePayload.agent_ids = [agentId];
    }

    const response = await fetch(`${edenBaseUrl}/v2/sessions`, {
      method: 'POST',
      headers: {
        'X-Api-Key': edenApiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(messagePayload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Eden API error ${response.status}: ${errorText}`);
    }

    return { success: true };
    
  } catch (error) {
    console.error('[Eden API] Send message failed:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Message send failed' 
    };
  }
}

async function fetchConceptFromDatabase(conceptId: string): Promise<any | null> {
  // Since concepts are generated dynamically, we need to regenerate or fetch from frontend
  // For now, let's generate a fresh concept based on the conceptId pattern
  console.log(`Fetching concept ${conceptId} from database`);
  
  // Parse concept ID to determine type and regenerate
  if (conceptId.includes('anomaly_')) {
    return {
      id: conceptId,
      title: "Market Anomaly Detected: Hidden Price Divergence",
      coreConcept: "Unusual trading patterns suggest institutional positioning before major announcement",
      urgencyScore: 88,
      contrarian_angle: "While retail focuses on price action, smart money is accumulating based on upcoming fundamentals",
      dataPoints: {
        primary: "Volume-weighted price deviation exceeded 3 standard deviations",
        supporting: [
          "Options flow shows unusual call activity in key strike prices",
          "Dark pool transaction volume increased 45% in past 24h",
          "Sentiment indicators remain bearish while accumulation accelerates"
        ]
      },
      targetAudience: "contrarians",
      estimatedViews: 180000,
      trendingPotential: "high"
    };
  }
  
  if (conceptId.includes('trend_')) {
    return {
      id: conceptId,
      title: "Emerging Trend: Cross-Asset Momentum Shift",
      coreConcept: "Multi-asset correlation breakdown signals major sector rotation",
      urgencyScore: 75,
      contrarian_angle: "Traditional correlation models are failing as new market dynamics emerge",
      dataPoints: {
        primary: "Asset correlations dropped to 3-month lows across major sectors",
        supporting: [
          "Tech vs financial sector correlation at historic divergence",
          "Commodity futures showing independent momentum patterns",
          "Risk-on/risk-off paradigms breaking down"
        ]
      },
      targetAudience: "macro_tourists",
      estimatedViews: 145000,
      trendingPotential: "medium"
    };
  }
  
  // Default concept for any other ID
  return {
    id: conceptId,
    title: "Real-Time Market Intelligence",
    coreConcept: "Dynamic market analysis reveals hidden opportunities",
    urgencyScore: 80,
    contrarian_angle: "While others follow headlines, data reveals the real story",
    dataPoints: {
      primary: "Live market data indicates significant opportunity",
      supporting: [
        "Technical indicators align with fundamental analysis",
        "Market sentiment vs actual data shows clear divergence",
        "Professional traders positioning for major move"
      ]
    },
    targetAudience: "retail_traders",
    estimatedViews: 200000,
    trendingPotential: "high"
  };
}

async function storeSessionRecord(data: any) {
  // Mock implementation - store session data for polling
  console.log('[MIYOMI Sessions] Storing session record:', {
    sessionId: data.sessionId,
    conceptId: data.conceptId,
    status: data.status
  });
  
  return {
    id: `session_${Date.now()}`,
    createdAt: new Date().toISOString(),
    ...data
  };
}