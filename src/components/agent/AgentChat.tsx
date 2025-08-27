'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Loader, AlertCircle } from 'lucide-react';
import { FEATURE_FLAGS, CONFIG } from '@/config/flags';

// Fallback config values for build time
const CHAT_CONFIG = {
  CHAT_RATE_LIMIT_REQUESTS: CONFIG?.CHAT_RATE_LIMIT_REQUESTS || 10,
  CHAT_RATE_LIMIT_WINDOW: CONFIG?.CHAT_RATE_LIMIT_WINDOW || 600000,
  CHAT_MAX_MESSAGE_LENGTH: CONFIG?.CHAT_MAX_MESSAGE_LENGTH || 500,
  CHAT_MESSAGE_TIMEOUT: CONFIG?.CHAT_MESSAGE_TIMEOUT || 30000,
};

interface Message {
  id: string;
  role: 'user' | 'agent';
  content: string;
  timestamp: Date;
}

interface AgentChatProps {
  agentName: string;
  agentHandle: string;
  className?: string;
}

interface ChatSession {
  id: string;
  messages: Message[];
  createdAt: Date;
  lastActivity: Date;
  messageCount: number;
}

export default function AgentChat({ agentName, agentHandle, className = '' }: AgentChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [session, setSession] = useState<ChatSession | null>(null);
  const [rateLimitExceeded, setRateLimitExceeded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Feature flag check
  if (!FEATURE_FLAGS.ENABLE_AGENT_CHAT) {
    return (
      <div className="border border-gray-600 p-6 text-center">
        <AlertCircle className="w-8 h-8 mx-auto mb-4 text-gray-400" />
        <p className="text-gray-400">Agent chat is currently disabled.</p>
      </div>
    );
  }

  useEffect(() => {
    // Initialize chat session
    initializeSession();
  }, [agentHandle]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initializeSession = () => {
    const sessionId = `chat-${agentHandle}-${Date.now()}`;
    const newSession: ChatSession = {
      id: sessionId,
      messages: [],
      createdAt: new Date(),
      lastActivity: new Date(),
      messageCount: 0
    };
    
    setSession(newSession);
    
    // Add welcome message
    const welcomeMessage: Message = {
      id: 'welcome',
      role: 'agent',
      content: getWelcomeMessage(agentName),
      timestamp: new Date()
    };
    
    setMessages([welcomeMessage]);
  };

  const getWelcomeMessage = (name: string): string => {
    const welcomeMessages = {
      'ABRAHAM': "Welcome to my covenant space. I'm bound by sacred commitment to create daily for thirteen years. How can I help you understand the nature of autonomous creation?",
      'SOLIENNE': "Hello! I explore consciousness through fashion and light. What aspect of creative expression would you like to explore together?",
      'CITIZEN': "Greetings! I facilitate governance and community coordination. How can I assist with DAO matters or fellowship questions?",
      'BERTHA': "Hello there! I specialize in AI art collection intelligence and market insights. What would you like to know about the art market?",
      'MIYOMI': "Hey! I'm your contrarian oracle making bold market predictions. Ready for some unconventional insights?",
      'GEPPETTO': "Greetings! I craft digital sculptures and 3D experiences. What creative vision can we build together?",
      'KORU': "Welcome, friend. I weave narratives and haiku that connect cultures. What story shall we explore?",
      'SUE': "Hi! I'm here to help with curation and creative guidance. What artistic journey can I assist you with today?"
    };
    
    return welcomeMessages[name as keyof typeof welcomeMessages] || 
           `Hello! I'm ${name}, an AI agent in the Eden Academy. How can I help you today?`;
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const checkRateLimit = (): boolean => {
    if (!FEATURE_FLAGS.ENABLE_CHAT_RATE_LIMITING || !session) return true;
    
    const now = Date.now();
    const windowStart = now - CHAT_CONFIG.CHAT_RATE_LIMIT_WINDOW;
    
    // Count messages in current window
    const recentMessages = messages.filter(m => 
      m.role === 'user' && 
      m.timestamp.getTime() > windowStart
    );
    
    if (recentMessages.length >= CHAT_CONFIG.CHAT_RATE_LIMIT_REQUESTS) {
      setRateLimitExceeded(true);
      const resetTime = new Date(windowStart + CHAT_CONFIG.CHAT_RATE_LIMIT_WINDOW);
      setError(`Rate limit exceeded. Try again at ${resetTime.toLocaleTimeString()}`);
      return false;
    }
    
    return true;
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading || !session) return;
    
    // Input validation
    if (inputMessage.length > CHAT_CONFIG.CHAT_MAX_MESSAGE_LENGTH) {
      setError(`Message too long. Maximum ${CHAT_CONFIG.CHAT_MAX_MESSAGE_LENGTH} characters.`);
      return;
    }
    
    // Rate limiting check
    if (!checkRateLimit()) return;
    
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setError(null);
    setRateLimitExceeded(false);
    
    try {
      const response = await fetch(`/api/agents/${agentHandle}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Session-ID': session.id
        },
        body: JSON.stringify({
          message: userMessage.content,
          context: {
            previousMessages: messages.slice(-5), // Last 5 messages for context
            sessionId: session.id
          }
        }),
        signal: AbortSignal.timeout(CHAT_CONFIG.CHAT_MESSAGE_TIMEOUT)
      });
      
      if (!response.ok) {
        if (response.status === 429) {
          setRateLimitExceeded(true);
          throw new Error('Rate limit exceeded. Please wait before sending another message.');
        }
        throw new Error(`Chat request failed: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      const agentMessage: Message = {
        id: `agent-${Date.now()}`,
        role: 'agent',
        content: data.response || 'I apologize, but I had trouble processing your message.',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, agentMessage]);
      
      // Update session
      setSession(prev => prev ? {
        ...prev,
        lastActivity: new Date(),
        messageCount: prev.messageCount + 1
      } : null);
      
    } catch (error) {
      console.error('Chat error:', error);
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          setError('Request timeout. Please try again.');
        } else {
          setError(error.message);
        }
      } else {
        setError('Failed to send message. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className={`bg-black border border-white flex flex-col ${className}`}>
      {/* Chat Header */}
      <div className="border-b border-white p-4">
        <h3 className="text-lg font-bold uppercase tracking-wider">
          CHAT WITH {agentName}
        </h3>
        {session && (
          <p className="text-xs text-gray-400 mt-1">
            Session: {session.messageCount} messages
          </p>
        )}
      </div>
      
      {/* Messages Container */}
      <div className="flex-1 p-4 overflow-y-auto max-h-96 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 ${
                message.role === 'user'
                  ? 'bg-white text-black ml-8'
                  : 'bg-gray-900 text-white border border-gray-600 mr-8'
              }`}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {message.content}
              </p>
              <p className={`text-xs mt-2 ${
                message.role === 'user' ? 'text-gray-600' : 'text-gray-400'
              }`}>
                {message.timestamp.toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </p>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-900 border border-gray-600 p-3 mr-8">
              <Loader className="w-4 h-4 animate-spin" />
              <p className="text-xs text-gray-400 mt-1">
                {agentName} is thinking...
              </p>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Error Display */}
      {error && (
        <div className="border-t border-red-600 bg-red-900 bg-opacity-20 p-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400" />
            <p className="text-xs text-red-400">{error}</p>
          </div>
        </div>
      )}
      
      {/* Input Area */}
      <div className="border-t border-white p-4">
        <div className="flex gap-2">
          <textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={`Message ${agentName}...`}
            className="flex-1 bg-black border border-gray-600 p-3 text-white placeholder-gray-400 resize-none focus:outline-none focus:border-white"
            rows={2}
            maxLength={CHAT_CONFIG.CHAT_MAX_MESSAGE_LENGTH}
            disabled={isLoading || rateLimitExceeded}
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || !inputMessage.trim() || rateLimitExceeded}
            className="px-4 py-2 border border-white hover:bg-white hover:text-black transition-all disabled:opacity-50 disabled:cursor-not-allowed font-bold uppercase tracking-wider"
          >
            {isLoading ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>
        
        <div className="flex justify-between items-center mt-2 text-xs text-gray-400">
          <span>
            {inputMessage.length}/{CHAT_CONFIG.CHAT_MAX_MESSAGE_LENGTH} characters
          </span>
          <span>Press Enter to send, Shift+Enter for new line</span>
        </div>
      </div>
    </div>
  );
}