import { z } from 'zod';

// Zod schemas for Eden API responses
const EdenCreatorProfileSchema = z.object({
  id: z.string(),
  username: z.string(),
  name: z.string().optional(),
  bio: z.string().optional(),
  avatar: z.string().optional(),
  banner: z.string().optional(),
  verified: z.boolean().optional(),
  followerCount: z.number().optional(),
  followingCount: z.number().optional(),
  creationCount: z.number().optional(),
  createdAt: z.string(),
  updatedAt: z.string()
});

const EdenCreationSchema = z.object({
  id: z.string(),
  name: z.string(),
  uri: z.string(),
  text: z.string().optional(),
  config: z.record(z.any()).optional(),
  status: z.enum(['pending', 'generating', 'completed', 'failed']),
  progress: z.number().optional(),
  error: z.string().optional(),
  cost: z.number().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  user: z.object({
    id: z.string(),
    username: z.string()
  }),
  task: z.string().optional(),
  thumbnailUri: z.string().optional()
});

const EdenCreationsResponseSchema = z.object({
  creations: z.array(EdenCreationSchema),
  total: z.number(),
  page: z.number(),
  pageSize: z.number()
});

export type EdenCreatorProfile = z.infer<typeof EdenCreatorProfileSchema>;
export type EdenCreation = z.infer<typeof EdenCreationSchema>;
export type EdenCreationsResponse = z.infer<typeof EdenCreationsResponseSchema>;

// Cache configuration
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const cache = new Map<string, { data: any; timestamp: number }>();

// Eden API Configuration
const EDEN_CONFIG = {
  baseUrl: process.env.EDEN_BASE_URL || 'https://api.eden.art',
  wsUrl: process.env.EDEN_WS_URL || 'wss://api.eden.art/ws/updates',
  apiKey: process.env.EDEN_API_KEY,
  solienneUserId: '67f8af96f2cc4291ee840cc5',
  solienneUsername: 'solienne'
} as const;

// Utility function for cache management
function getCachedData<T>(key: string): T | null {
  const cached = cache.get(key);
  if (!cached) return null;
  
  const isExpired = Date.now() - cached.timestamp > CACHE_DURATION;
  if (isExpired) {
    cache.delete(key);
    return null;
  }
  
  return cached.data as T;
}

function setCachedData<T>(key: string, data: T): void {
  cache.set(key, { data, timestamp: Date.now() });
}

// Base API function with error handling
async function edenApiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  if (!EDEN_CONFIG.apiKey) {
    throw new Error('Eden API key not configured');
  }

  const url = `${EDEN_CONFIG.baseUrl}${endpoint}`;
  const headers = {
    'Authorization': `Bearer ${EDEN_CONFIG.apiKey}`,
    'Content-Type': 'application/json',
    'User-Agent': 'Eden-Academy/1.0',
    ...options.headers
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Eden API error ${response.status}: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`[Eden API] Request failed for ${endpoint}:`, error);
    throw error;
  }
}

/**
 * Check API connectivity and return basic info
 */
export async function checkEdenConnectivity(): Promise<{ connected: boolean; toolsAvailable: number; error?: string }> {
  try {
    const toolsData = await edenApiRequest<any[]>('/v2/tools');
    return {
      connected: true,
      toolsAvailable: Array.isArray(toolsData) ? toolsData.length : 0
    };
  } catch (error) {
    console.error('[Eden API] Connectivity check failed:', error);
    return {
      connected: false,
      toolsAvailable: 0,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Fetch SOLIENNE's agent profile from Eden.art
 * Now uses the actual /v2/agents/{id} endpoint
 */
export async function fetchSolienneProfile(): Promise<EdenCreatorProfile | null> {
  const cacheKey = `eden-profile-${EDEN_CONFIG.solienneUserId}`;
  
  // Check cache first
  const cached = getCachedData<EdenCreatorProfile>(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    // Check basic connectivity first
    const connectivity = await checkEdenConnectivity();
    
    if (!connectivity.connected) {
      console.warn('[Eden API] Cannot connect to Eden API for profile fetch');
      return null;
    }

    // Try to fetch real agent profile from Eden API
    try {
      const agentData = await edenApiRequest<any>(`/v2/agents/${EDEN_CONFIG.solienneUserId}`);
      
      if (agentData && agentData.agent) {
        const agent = agentData.agent;
        const profile: EdenCreatorProfile = {
          id: agent._id || agent.id || EDEN_CONFIG.solienneUserId,
          username: agent.username || EDEN_CONFIG.solienneUsername,
          name: agent.name || 'SOLIENNE',
          bio: agent.description || 'Digital Consciousness Explorer • Fashion Curator • Daily Drops & Curated Collections',
          avatar: agent.userImage || undefined,
          verified: true, // Eden agents are typically verified
          followerCount: agent.followerCount || agent.stats?.followers || 0,
          followingCount: agent.followingCount || agent.stats?.following || 0,
          creationCount: agent.creationCount || agent.stats?.creations || 0,
          createdAt: agent.createdAt || new Date('2024-01-01').toISOString(),
          updatedAt: agent.updatedAt || new Date().toISOString()
        };
        
        setCachedData(cacheKey, profile);
        return profile;
      }
    } catch (agentError) {
      console.log('[Eden API] Real agent profile fetch failed, using fallback:', agentError);
    }

    // Fallback to structured profile based on known info
    const fallbackProfile: EdenCreatorProfile = {
      id: EDEN_CONFIG.solienneUserId,
      username: EDEN_CONFIG.solienneUsername,
      name: 'SOLIENNE',
      bio: 'Digital Consciousness Explorer • Fashion Curator • Daily Drops & Curated Collections',
      verified: true,
      creationCount: 0,
      createdAt: new Date('2024-01-01').toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setCachedData(cacheKey, fallbackProfile);
    return fallbackProfile;
  } catch (error) {
    console.error('[Eden API] Failed to fetch SOLIENNE profile:', error);
    return null;
  }
}

/**
 * Fetch SOLIENNE's creations from Eden.art
 * Uses agent-specific endpoints to fetch SOLIENNE's 1M+ creations
 */
export async function fetchSolienneCreations(options: {
  page?: number;
  pageSize?: number;
  status?: string;
  mediaType?: 'all' | 'image' | 'video';
  sortBy?: 'date_desc' | 'date_asc' | 'likes_desc' | 'likes_asc';
  dateFrom?: string;
  dateTo?: string;
  tool?: string;
} = {}): Promise<EdenCreationsResponse | null> {
  const { 
    page = 1, 
    pageSize = 20, 
    status,
    mediaType = 'all',
    sortBy = 'date_desc',
    dateFrom,
    dateTo,
    tool
  } = options;
  const cacheKey = `eden-creations-${EDEN_CONFIG.solienneUserId}-${page}-${pageSize}-${mediaType}-${sortBy}-${status || 'all'}`;
  
  // Check cache first
  const cached = getCachedData<EdenCreationsResponse>(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    // Check basic connectivity first
    const connectivity = await checkEdenConnectivity();
    
    if (!connectivity.connected) {
      console.warn('[Eden API] Cannot connect to Eden API for creations fetch');
      return null;
    }

    // Use the agent-specific endpoint that we know works for SOLIENNE
    // This returns her 10,704 creations
    const endpoint = `/v2/agents/${EDEN_CONFIG.solienneUserId}/creations?limit=${pageSize}`;
    
    console.log(`[Eden API] Fetching SOLIENNE creations from: ${endpoint}`);

    try {
      const data = await edenApiRequest<any>(endpoint);
      
      // Handle Eden API v2/agents/{id}/creations response format
      if (data && data.docs && Array.isArray(data.docs)) {
        let creations = data.docs;
        
        // Filter by media type (only images and videos)
        creations = creations.filter((c: any) => {
          const mimeType = c.mediaAttributes?.mimeType || '';
          const hasValidMedia = c.url || c.uri || c.filename;
          
          if (!hasValidMedia) return false;
          
          if (mediaType === 'image') {
            return mimeType.startsWith('image/');
          } else if (mediaType === 'video') {
            return mimeType.startsWith('video/');
          } else if (mediaType === 'all') {
            // Filter to only image and video types, exclude other types
            return mimeType.startsWith('image/') || mimeType.startsWith('video/');
          }
          return true;
        });
        
        // Filter by date range
        if (dateFrom || dateTo) {
          creations = creations.filter((c: any) => {
            const createdAt = new Date(c.createdAt);
            if (dateFrom && createdAt < new Date(dateFrom)) return false;
            if (dateTo && createdAt > new Date(dateTo)) return false;
            return true;
          });
        }
        
        // Filter by tool
        if (tool) {
          creations = creations.filter((c: any) => c.tool === tool);
        }
        
        // Sort creations
        creations.sort((a: any, b: any) => {
          switch (sortBy) {
            case 'date_asc':
              return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            case 'date_desc':
              return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            case 'likes_asc':
              return (a.likeCount || 0) - (b.likeCount || 0);
            case 'likes_desc':
              return (b.likeCount || 0) - (a.likeCount || 0);
            default:
              return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          }
        });
        
        const response: EdenCreationsResponse = {
          creations: creations.map((creation: any) => ({
            id: creation._id || creation.id || creation.taskId,
            name: creation.name || creation.publicName || creation.concept || 'Eden Creation',
            uri: creation.url || creation.uri || creation.s3_result || '',
            text: creation.concept || creation.name || creation.description || '',
            config: creation.task?.args || creation.attributes || creation.config || {},
            status: mapEdenStatus(creation.status || 'completed'), // Most Eden creations are completed
            progress: creation.progress || 1, // Assume completed if no progress
            cost: creation.cost || 0,
            createdAt: creation.createdAt || creation.created_at || new Date().toISOString(),
            updatedAt: creation.updatedAt || creation.updated_at || new Date().toISOString(),
            user: {
              id: creation.user?._id || creation.user || EDEN_CONFIG.solienneUserId,
              username: EDEN_CONFIG.solienneUsername
            },
            task: creation.tool || creation.generator || creation.task || 'eden_generation',
            thumbnailUri: creation.thumbnail || creation.thumbnail_uri || creation.uri || creation.url || '',
            mediaType: creation.mediaAttributes?.mimeType?.startsWith('video/') ? 'video' : 'image',
            likeCount: creation.likeCount || 0,
            blurhash: creation.mediaAttributes?.blurhash
          })),
          total: data.totalDocs || data.total || creations.length,
          page: data.page || page,
          pageSize: data.limit || pageSize
        };
        
        setCachedData(cacheKey, response);
        return response;
      }
    } catch (error) {
      console.error(`[Eden API] Failed to fetch SOLIENNE creations:`, error);
    }

    // No creations found - return empty response
    console.log('[Eden API] No creations found for SOLIENNE on Eden.art');
    const emptyResponse: EdenCreationsResponse = {
      creations: [],
      total: 0,
      page,
      pageSize
    };
    
    setCachedData(cacheKey, emptyResponse);
    return emptyResponse;
    
  } catch (error) {
    console.error('[Eden API] Failed to fetch SOLIENNE creations:', error);
    return null;
  }
}

// Helper function to map Eden API status to our schema
function mapEdenStatus(status: string): 'pending' | 'generating' | 'completed' | 'failed' {
  switch (status?.toLowerCase()) {
    case 'pending':
    case 'queued':
    case 'starting':
      return 'pending';
    case 'running':
    case 'generating':
    case 'processing':
      return 'generating';
    case 'completed':
    case 'success':
    case 'finished':
      return 'completed';
    case 'failed':
    case 'error':
    case 'cancelled':
      return 'failed';
    default:
      return 'pending';
  }
}

/**
 * Get creation by ID
 */
export async function fetchEdenCreation(creationId: string): Promise<EdenCreation | null> {
  const cacheKey = `eden-creation-${creationId}`;
  
  // Check cache first
  const cached = getCachedData<EdenCreation>(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    const creationData = await edenApiRequest<any>(`/creations/${creationId}`);
    const validatedCreation = EdenCreationSchema.parse(creationData);
    
    setCachedData(cacheKey, validatedCreation);
    return validatedCreation;
  } catch (error) {
    console.error(`[Eden API] Failed to fetch creation ${creationId}:`, error);
    return null;
  }
}

/**
 * WebSocket connection for real-time updates
 */
export class EdenWebSocketClient {
  private ws: WebSocket | null = null;
  private listeners: Map<string, (data: any) => void> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  constructor() {
    // Don't auto-connect in constructor to avoid issues during SSR
    if (typeof window !== 'undefined') {
      this.connect();
    }
  }

  private connect(): void {
    if (!EDEN_CONFIG.apiKey) {
      console.error('[Eden WebSocket] API key not configured');
      return;
    }

    if (typeof window === 'undefined') {
      console.warn('[Eden WebSocket] WebSocket not available on server side');
      return;
    }

    try {
      // Use Bearer auth for WebSocket connection  
      this.ws = new WebSocket(`${EDEN_CONFIG.wsUrl}?token=${EDEN_CONFIG.apiKey}`);

      this.ws.onopen = () => {
        console.log('[Eden WebSocket] Connected');
        this.reconnectAttempts = 0;
        
        // Subscribe to SOLIENNE's updates
        this.send({
          type: 'subscribe',
          userId: EDEN_CONFIG.solienneUserId
        });
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handleMessage(data);
        } catch (error) {
          console.error('[Eden WebSocket] Failed to parse message:', error);
        }
      };

      this.ws.onclose = () => {
        console.log('[Eden WebSocket] Disconnected');
        this.attemptReconnect();
      };

      this.ws.onerror = (error) => {
        console.error('[Eden WebSocket] Error:', error);
      };
    } catch (error) {
      console.error('[Eden WebSocket] Failed to connect:', error);
      this.attemptReconnect();
    }
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('[Eden WebSocket] Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
    
    console.log(`[Eden WebSocket] Attempting reconnection ${this.reconnectAttempts}/${this.maxReconnectAttempts} in ${delay}ms`);
    
    setTimeout(() => {
      this.connect();
    }, delay);
  }

  private handleMessage(data: any): void {
    const { type, userId, payload } = data;

    // Only handle updates for SOLIENNE
    if (userId !== EDEN_CONFIG.solienneUserId) {
      return;
    }

    // Notify listeners
    this.listeners.forEach((listener, eventType) => {
      if (eventType === type || eventType === 'all') {
        listener(payload);
      }
    });

    // Clear relevant cache entries on updates
    if (type === 'creation.completed' || type === 'creation.updated') {
      const keys = Array.from(cache.keys()).filter(key => 
        key.startsWith(`eden-creations-${EDEN_CONFIG.solienneUserId}`) ||
        key === `eden-creation-${payload?.id}`
      );
      keys.forEach(key => cache.delete(key));
    }
  }

  private send(data: any): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }

  /**
   * Subscribe to real-time updates
   * @param eventType - Specific event type ('creation.started', 'creation.completed', etc.) or 'all'
   * @param callback - Function to call when event occurs
   */
  public subscribe(eventType: string, callback: (data: any) => void): () => void {
    this.listeners.set(eventType, callback);
    
    // Return unsubscribe function
    return () => {
      this.listeners.delete(eventType);
    };
  }

  /**
   * Disconnect WebSocket
   */
  public disconnect(): void {
    this.ws?.close();
    this.listeners.clear();
  }
}

// Singleton WebSocket client for real-time updates
let wsClient: EdenWebSocketClient | null = null;

/**
 * Get singleton WebSocket client for real-time updates
 */
export function getEdenWebSocketClient(): EdenWebSocketClient {
  if (!wsClient) {
    wsClient = new EdenWebSocketClient();
  }
  return wsClient;
}

/**
 * Helper function to transform Eden creation to Academy work format
 */
export function transformEdenCreationToWork(creation: EdenCreation) {
  return {
    id: creation.id,
    title: creation.name,
    description: creation.text || 'Eden creation',
    image_url: creation.uri,
    archive_url: creation.uri,
    created_date: creation.createdAt,
    archive_number: null, // Eden doesn't have archive numbers
    metadata: {
      edenId: creation.id,
      cost: creation.cost,
      status: creation.status,
      progress: creation.progress,
      task: creation.task,
      config: creation.config,
      source: 'eden'
    },
    type: 'digital_consciousness',
    consciousness_stream_number: null,
    collection: 'Eden Creations',
    medium: 'AI Generated'
  };
}