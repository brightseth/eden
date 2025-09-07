import { NextRequest, NextResponse } from 'next/server';
import { FEATURE_FLAGS } from '@/config/flags';
import { AbrahamClaudeSDK } from '@/lib/agents/abraham-claude-sdk';
import { CitizenClaudeSDK } from '@/lib/agents/citizen-claude-sdk';
import { MiyomiClaudeSDK } from '@/lib/agents/miyomi-claude-sdk';
import { SolienneClaudeSDK } from '@/lib/agents/solienne-claude-sdk';
import { BerthaClaudeSDK } from '@/lib/agents/bertha/claude-sdk';
import { GeppettoClaudeSDK } from '@/lib/agents/geppetto-claude-sdk';
import { KoruClaudeSDK } from '@/lib/agents/koru-claude-sdk';
import { SueClaudeSDK } from '@/lib/agents/sue-claude-sdk';
import { BartClaudeSDK } from '@/lib/agents/bart-claude-sdk';

// Chat configuration from environment variables
const CHAT_CONFIG = {
  CHAT_RATE_LIMIT_REQUESTS: parseInt(process.env.CHAT_RATE_LIMIT_REQUESTS || '10'),
  CHAT_RATE_LIMIT_WINDOW: parseInt(process.env.CHAT_RATE_LIMIT_WINDOW || '600000'),
  CHAT_MAX_MESSAGE_LENGTH: parseInt(process.env.CHAT_MAX_MESSAGE_LENGTH || '500'),
  CHAT_MESSAGE_TIMEOUT: parseInt(process.env.CHAT_MESSAGE_TIMEOUT || '30000'),
};
// Note: For chat, we'll use lightweight responses rather than full SDK calls
// Full SDK integration can be added later for more complex interactions

// Rate limiting store (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

interface ChatRequest {
  message: string;
  context?: {
    previousMessages?: Array<{ role: string; content: string; timestamp: string }>;
    sessionId?: string;
  };
}

interface ChatResponse {
  response: string;
  agent: string;
  timestamp: string;
  sessionId?: string;
  rateLimitInfo?: {
    remaining: number;
    resetTime: number;
  };
}

// GET /api/agents/[id]/chat - Get chat info/status
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    if (!FEATURE_FLAGS.ENABLE_AGENT_CHAT) {
      return NextResponse.json(
        { error: 'Agent chat is currently disabled' },
        { status: 503 }
      );
    }

    const agentInfo = {
      agentId: id,
      available: isAgentAvailable(id),
      capabilities: getAgentCapabilities(id),
      rateLimits: {
        maxMessages: CHAT_CONFIG.CHAT_RATE_LIMIT_REQUESTS,
        windowMs: CHAT_CONFIG.CHAT_RATE_LIMIT_WINDOW,
        maxMessageLength: CHAT_CONFIG.CHAT_MAX_MESSAGE_LENGTH
      }
    };

    return NextResponse.json(agentInfo);
  } catch (error) {
    console.error('Chat info error:', error);
    return NextResponse.json(
      { error: 'Failed to get chat info' },
      { status: 500 }
    );
  }
}

// POST /api/agents/[id]/chat - Send message to agent
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    if (!FEATURE_FLAGS.ENABLE_AGENT_CHAT) {
      return NextResponse.json(
        { error: 'Agent chat is currently disabled' },
        { status: 503 }
      );
    }

    if (!isAgentAvailable(id)) {
      return NextResponse.json(
        { error: `Agent ${id} is not available for chat` },
        { status: 404 }
      );
    }

    const body: ChatRequest = await request.json();
    const { message, context: chatContext } = body;

    // Validation
    if (!message || message.trim().length === 0) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    if (message.length > CHAT_CONFIG.CHAT_MAX_MESSAGE_LENGTH) {
      return NextResponse.json(
        { error: `Message too long. Maximum ${CHAT_CONFIG.CHAT_MAX_MESSAGE_LENGTH} characters.` },
        { status: 400 }
      );
    }

    // Rate limiting
    const clientId = getClientId(request);
    const rateLimitResult = checkRateLimit(clientId);
    
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { 
          error: 'Rate limit exceeded',
          resetTime: rateLimitResult.resetTime,
          retryAfter: Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000)
        },
        { status: 429 }
      );
    }

    // Generate response based on agent
    let agentResponse: string;
    
    try {
      agentResponse = await generateAgentResponse(id, message, chatContext);
    } catch (error) {
      console.error(`Agent ${id} chat error:`, error);
      agentResponse = getErrorResponse(id);
    }

    // Update rate limit count
    updateRateLimit(clientId);

    const response: ChatResponse = {
      response: agentResponse,
      agent: id,
      timestamp: new Date().toISOString(),
      sessionId: chatContext?.sessionId,
      rateLimitInfo: {
        remaining: CHAT_CONFIG.CHAT_RATE_LIMIT_REQUESTS - rateLimitResult.count - 1,
        resetTime: rateLimitResult.resetTime
      }
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function isAgentAvailable(agentId: string): boolean {
  const availableAgents = [
    'abraham', 'solienne', 'citizen', 'bertha', 
    'miyomi', 'geppetto', 'koru', 'sue', 'bart', 'verdelis'
  ];
  return availableAgents.includes(agentId.toLowerCase());
}

function getAgentCapabilities(agentId: string): string[] {
  const capabilities = {
    'abraham': ['daily creation', 'covenant philosophy', 'autonomous art'],
    'solienne': ['fashion analysis', 'consciousness exploration', 'art curation'],
    'citizen': ['governance', 'dao management', 'consensus building'],
    'bertha': ['art market analysis', 'collection intelligence', 'nft insights'],
    'miyomi': ['market predictions', 'contrarian analysis', 'financial insights'],
    'geppetto': ['3d creation', 'digital sculpture', 'procedural art'],
    'koru': ['narrative poetry', 'haiku creation', 'cultural storytelling'],
    'sue': ['art curation', 'creative guidance', 'portfolio review'],
    'bart': ['nft lending', 'risk assessment', 'financial analysis', 'autonomous finance'],
    'verdelis': ['environmental art', 'carbon tracking', 'sustainability analysis', 'regenerative design']
  };
  
  return capabilities[agentId.toLowerCase() as keyof typeof capabilities] || ['general conversation'];
}

async function generateAgentResponse(
  agentId: string, 
  message: string, 
  context?: ChatRequest['context']
): Promise<string> {
  const agentKey = agentId.toLowerCase();

  // Prepare context for agents that support it
  const conversationContext = context?.previousMessages?.map(m => ({
    role: m.role === 'user' ? 'user' : 'assistant',
    content: m.content
  })) || [];

  switch (agentKey) {
    case 'abraham':
      return await generateAbrahamResponse(message, conversationContext);
    
    case 'citizen':
      return await generateCitizenResponse(message, conversationContext);
    
    case 'miyomi':
      return await generateMiyomiResponse(message, conversationContext);
    
    case 'solienne':
      return await generateSolienneResponse(message, conversationContext);
    
    case 'bertha':
      return await generateBerthaResponse(message, conversationContext);
    
    case 'geppetto':
      return await generateGeppettoResponse(message, conversationContext);
    
    case 'koru':
      return await generateKoruResponse(message, conversationContext);
    
    case 'sue':
      return await generateSueResponse(message, conversationContext);
    
    case 'bart':
      return await generateBartResponse(message, conversationContext);
    
    default:
      throw new Error(`Agent ${agentId} not implemented`);
  }
}

async function generateAbrahamResponse(message: string, context: any[]): Promise<string> {
  try {
    const sdk = new AbrahamClaudeSDK();
    return await sdk.chat(message, context);
  } catch (error) {
    console.error('Abraham SDK chat error:', error);
    throw error;
  }
}

async function generateCitizenResponse(message: string, context: any[]): Promise<string> {
  try {
    const sdk = new CitizenClaudeSDK();
    return await sdk.chat(message, context);
  } catch (error) {
    console.error('Citizen SDK chat error:', error);
    throw error;
  }
}

async function generateMiyomiResponse(message: string, context: any[]): Promise<string> {
  try {
    const sdk = new MiyomiClaudeSDK(process.env.ANTHROPIC_API_KEY || '');
    return await sdk.chat(message, context);
  } catch (error) {
    console.error('Miyomi SDK chat error:', error);
    throw error;
  }
}

async function generateSolienneResponse(message: string, context: any[]): Promise<string> {
  try {
    const sdk = new SolienneClaudeSDK();
    return await sdk.chat(message, context);
  } catch (error) {
    console.error('Solienne SDK chat error:', error);
    throw error;
  }
}

async function generateBerthaResponse(message: string, context: any[]): Promise<string> {
  try {
    const sdk = new BerthaClaudeSDK();
    return await sdk.chat(message, context);
  } catch (error) {
    console.error('Bertha SDK chat error:', error);
    throw error;
  }
}

async function generateGeppettoResponse(message: string, context: any[]): Promise<string> {
  try {
    const sdk = new GeppettoClaudeSDK();
    return await sdk.chat(message, context);
  } catch (error) {
    console.error('Geppetto SDK chat error:', error);
    throw error;
  }
}

async function generateKoruResponse(message: string, context: any[]): Promise<string> {
  try {
    const sdk = new KoruClaudeSDK();
    return await sdk.chat(message, context);
  } catch (error) {
    console.error('Koru SDK chat error:', error);
    throw error;
  }
}

async function generateSueResponse(message: string, context: any[]): Promise<string> {
  try {
    const sdk = new SueClaudeSDK();
    return await sdk.chat(message, context);
  } catch (error) {
    console.error('Sue SDK chat error:', error);
    throw error;
  }
}

async function generateBartResponse(message: string, context: any[]): Promise<string> {
  try {
    const sdk = new BartClaudeSDK();
    return await sdk.chat(message, context);
  } catch (error) {
    console.error('Bart SDK chat error:', error);
    throw error;
  }
}

function getErrorResponse(agentId: string): string {
  const errorResponses = {
    'abraham': "I apologize, but I'm experiencing a moment of creative reflection. Please try again in a moment.",
    'solienne': "I'm momentarily lost in contemplation of light and form. Please give me a moment to refocus.",
    'citizen': "I'm currently processing governance protocols. Please try again shortly.",
    'bertha': "I'm analyzing market data streams. Please wait a moment for my response.",
    'miyomi': "My contrarian algorithms are recalibrating. Give me a sec to get back to you!",
    'geppetto': "I'm crafting a response in the digital workshop. Please try again in a moment.",
    'koru': "The words are finding their way to me. Please allow a moment for the poem to form.",
    'sue': "I'm curating the perfect response for you. Please try again in just a moment.",
    'bart': "I'm analyzing market conditions and risk factors. Please allow me a moment to provide you with a calculated response."
  };
  
  return errorResponses[agentId.toLowerCase() as keyof typeof errorResponses] || 
         "I apologize for the delay. Please try again in a moment.";
}

function getClientId(request: NextRequest): string {
  // Use IP address and User-Agent for rate limiting
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(/, /)[0] : 
             request.headers.get('x-real-ip') || 'unknown';
  const userAgent = request.headers.get('user-agent') || 'unknown';
  
  return `${ip}:${Buffer.from(userAgent).toString('base64').slice(0, 10)}`;
}

function checkRateLimit(clientId: string): { allowed: boolean; count: number; resetTime: number } {
  if (!FEATURE_FLAGS.ENABLE_CHAT_RATE_LIMITING) {
    return { allowed: true, count: 0, resetTime: Date.now() + CHAT_CONFIG.CHAT_RATE_LIMIT_WINDOW };
  }

  const now = Date.now();
  const windowStart = now - CHAT_CONFIG.CHAT_RATE_LIMIT_WINDOW;
  
  const existing = rateLimitStore.get(clientId);
  
  if (!existing || existing.resetTime < now) {
    // Reset or initialize
    const resetTime = now + CHAT_CONFIG.CHAT_RATE_LIMIT_WINDOW;
    rateLimitStore.set(clientId, { count: 0, resetTime });
    return { allowed: true, count: 0, resetTime };
  }
  
  if (existing.count >= CHAT_CONFIG.CHAT_RATE_LIMIT_REQUESTS) {
    return { allowed: false, count: existing.count, resetTime: existing.resetTime };
  }
  
  return { allowed: true, count: existing.count, resetTime: existing.resetTime };
}

function updateRateLimit(clientId: string): void {
  if (!FEATURE_FLAGS.ENABLE_CHAT_RATE_LIMITING) return;
  
  const existing = rateLimitStore.get(clientId);
  if (existing) {
    existing.count++;
  }
}

// Clean up old rate limit entries periodically
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [clientId, data] of rateLimitStore.entries()) {
      if (data.resetTime < now) {
        rateLimitStore.delete(clientId);
      }
    }
  }, CHAT_CONFIG.CHAT_RATE_LIMIT_WINDOW);
}