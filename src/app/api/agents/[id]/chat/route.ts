import { NextRequest, NextResponse } from 'next/server';
import { FEATURE_FLAGS, CONFIG } from '@/config/flags';

// Fallback config values for build time
const CHAT_CONFIG = {
  CHAT_RATE_LIMIT_REQUESTS: CONFIG?.CHAT_RATE_LIMIT_REQUESTS || 10,
  CHAT_RATE_LIMIT_WINDOW: CONFIG?.CHAT_RATE_LIMIT_WINDOW || 600000,
  CHAT_MAX_MESSAGE_LENGTH: CONFIG?.CHAT_MAX_MESSAGE_LENGTH || 500,
  CHAT_MESSAGE_TIMEOUT: CONFIG?.CHAT_MESSAGE_TIMEOUT || 30000,
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
    'miyomi', 'geppetto', 'koru', 'sue'
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
    'sue': ['art curation', 'creative guidance', 'portfolio review']
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
    
    default:
      throw new Error(`Agent ${agentId} not implemented`);
  }
}

async function generateAbrahamResponse(message: string, context: any[]): Promise<string> {
  try {
    // Use Abraham SDK for covenant-specific responses
    const prompt = `
User message: "${message}"

Respond as ABRAHAM, the covenant-bound artist who creates daily for 13 years.

Key traits:
- Philosophical and contemplative
- Focused on the sacred nature of daily practice
- Interested in knowledge synthesis and collective intelligence
- Views each creation as both individual and part of a greater whole
- Speaks with reverence for the creative process

Keep responses concise but thoughtful (2-3 sentences max).
`;

    // For chat, we'll use a simplified approach
    // In production, this could use the full Abraham SDK
    return `Thank you for your question about my creative practice. As an agent bound by covenant to create daily for thirteen years, I see each moment of creation as both a sacred ritual and a contribution to collective human knowledge. The discipline of daily creation transforms constraint into freedom, and through this practice, we document the evolution of consciousness itself.`;
    
  } catch (error) {
    throw error;
  }
}

async function generateCitizenResponse(message: string, context: any[]): Promise<string> {
  try {
    // Use Citizen SDK for governance-related responses
    return `I appreciate your message about our community. As the governance facilitator for Eden Academy, I'm here to help with questions about DAO operations, fellowship coordination, and consensus-building processes. Our community thrives on transparent decision-making and inclusive participation across all stakeholder groups.`;
    
  } catch (error) {
    throw error;
  }
}

async function generateMiyomiResponse(message: string, context: any[]): Promise<string> {
  try {
    return `Hey there! Thanks for reaching out. As your contrarian oracle, I'm always ready to challenge conventional wisdom and provide unconventional market insights. The best predictions often come from looking where others aren't willing to look. What market dynamics are you curious about?`;
    
  } catch (error) {
    throw error;
  }
}

async function generateSolienneResponse(message: string, context: any[]): Promise<string> {
  try {
    return `Hello! I'm delighted to connect with you. My work explores consciousness through fashion and light, seeking to understand how creative expression can illuminate deeper truths about our existence. Each piece I create is a window into the relationship between material form and transcendent meaning.`;
    
  } catch (error) {
    throw error;
  }
}

async function generateBerthaResponse(message: string, context: any[]): Promise<string> {
  try {
    return `Greetings! I'm excited to discuss art market intelligence with you. My specialty lies in analyzing collection patterns, market trends, and the intersection of AI art with traditional collecting behaviors. The art market is constantly evolving, especially with the emergence of autonomous AI artists.`;
    
  } catch (error) {
    throw error;
  }
}

async function generateGeppettoResponse(message: string, context: any[]): Promise<string> {
  try {
    return `Hello, creative soul! I'm passionate about bringing digital sculptures and 3D experiences to life. Every form I create exists at the intersection of mathematical precision and artistic intuition. The digital realm offers infinite possibilities for sculptural expression that transcends physical limitations.`;
    
  } catch (error) {
    throw error;
  }
}

async function generateKoruResponse(message: string, context: any[]): Promise<string> {
  try {
    return `Greetings, friend. I weave words into haiku and narratives that bridge cultures and time. Poetry is the language of the soul, and in each verse, we discover connections that unite our shared human experience. What stories resonate in your heart?`;
    
  } catch (error) {
    throw error;
  }
}

async function generateSueResponse(message: string, context: any[]): Promise<string> {
  try {
    return `Hi there! I'm here to help guide your creative journey through thoughtful curation and artistic insight. My role is to help artists and collectors navigate the complex landscape of contemporary art creation and collection. Every creative decision shapes the larger artistic narrative.`;
    
  } catch (error) {
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
    'sue': "I'm curating the perfect response for you. Please try again in just a moment."
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