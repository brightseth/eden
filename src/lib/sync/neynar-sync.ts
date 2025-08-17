import { SyncService } from './sync-service';
import { supabase } from '@/lib/supabase';

interface NeynarUser {
  fid: number;
  username: string;
  displayName: string;
  followerCount: number;
  followingCount: number;
  verifications: string[];
}

interface NeynarCast {
  hash: string;
  author: {
    fid: number;
    username: string;
  };
  text: string;
  timestamp: string;
  reactions: {
    likes: number;
    recasts: number;
  };
}

export class NeynarSync extends SyncService {
  private apiKey?: string;
  private apiUrl = 'https://api.neynar.com/v2';

  constructor() {
    super();
    this.apiKey = process.env.NEYNAR_API_KEY;
  }

  async sync(): Promise<void> {
    return this.withStatusTracking(async () => {
      console.log('[NeynarSync] Starting sync...');
      
      // Get all agents with Farcaster profiles
      const { data: agents, error: agentsError } = await supabase
        .from('agents')
        .select('id, name, metadata')
        .not('metadata->farcasterUsername', 'is', null);
      
      if (agentsError) {
        throw new Error(`Failed to fetch agents: ${agentsError.message}`);
      }

      // Sync each agent's Farcaster data
      for (const agent of agents || []) {
        const username = agent.metadata?.farcasterUsername;
        if (username) {
          await this.syncAgentFarcaster(agent.id, username);
        }
      }
      
      console.log('[NeynarSync] Sync completed');
    });
  }

  private async syncAgentFarcaster(agentId: string, username: string): Promise<void> {
    try {
      // Fetch user profile
      const user = await this.fetchUser(username);
      
      // Fetch recent casts
      const casts = await this.fetchRecentCasts(user.fid);
      
      // Get today's date
      const today = new Date().toISOString().split('T')[0];
      
      // Count today's casts
      const todayCasts = casts.filter(c => 
        c.timestamp.startsWith(today)
      );
      
      // Calculate engagement
      const totalEngagement = todayCasts.reduce((sum, cast) => 
        sum + cast.reactions.likes + cast.reactions.recasts, 0
      );
      
      // Update daily metrics
      const { error } = await supabase
        .from('daily_metrics')
        .upsert({
          agent_id: agentId,
          date: today,
          farcaster_followers: user.followerCount,
          farcaster_posts: todayCasts.length,
          engagement_score: totalEngagement,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'agent_id,date'
        });
      
      if (error) {
        console.error(`[NeynarSync] Failed to update metrics for agent ${agentId}:`, error);
      }
      
      // Log social activity event
      if (todayCasts.length > 0) {
        await this.logSocialEvent(agentId, todayCasts.length, totalEngagement);
      }
      
    } catch (error) {
      console.error(`[NeynarSync] Failed to sync agent ${agentId}:`, error);
    }
  }

  private async fetchUser(username: string): Promise<NeynarUser> {
    if (!this.apiKey) {
      console.warn('[NeynarSync] No API key configured, using mock data');
      return this.getMockUser(username);
    }

    const response = await fetch(`${this.apiUrl}/farcaster/user/by_username?username=${username}`, {
      headers: {
        'api_key': this.apiKey,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Neynar API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.user;
  }

  private async fetchRecentCasts(fid: number): Promise<NeynarCast[]> {
    if (!this.apiKey) {
      console.warn('[NeynarSync] No API key configured, using mock data');
      return this.getMockCasts();
    }

    const response = await fetch(`${this.apiUrl}/farcaster/casts?fid=${fid}&limit=100`, {
      headers: {
        'api_key': this.apiKey,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Neynar API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.casts || [];
  }

  private getMockUser(username: string): NeynarUser {
    return {
      fid: Math.floor(Math.random() * 10000),
      username,
      displayName: username,
      followerCount: Math.floor(Math.random() * 1000) + 100,
      followingCount: Math.floor(Math.random() * 500) + 50,
      verifications: [],
    };
  }

  private getMockCasts(): NeynarCast[] {
    const today = new Date().toISOString();
    return [
      {
        hash: `0x${Math.random().toString(16).slice(2)}`,
        author: {
          fid: 1,
          username: 'test',
        },
        text: 'Mock cast 1',
        timestamp: today,
        reactions: {
          likes: Math.floor(Math.random() * 50),
          recasts: Math.floor(Math.random() * 10),
        },
      },
      {
        hash: `0x${Math.random().toString(16).slice(2)}`,
        author: {
          fid: 1,
          username: 'test',
        },
        text: 'Mock cast 2',
        timestamp: today,
        reactions: {
          likes: Math.floor(Math.random() * 50),
          recasts: Math.floor(Math.random() * 10),
        },
      },
    ];
  }

  private async logSocialEvent(agentId: string, posts: number, engagement: number): Promise<void> {
    const { error } = await supabase
      .from('economy_events')
      .insert({
        agent_id: agentId,
        event_type: 'social_activity',
        amount: engagement * 0.01, // Mock revenue per engagement
        description: `Posted ${posts} times with ${engagement} total engagement`,
        metadata: {
          source: 'neynar_sync',
          posts,
          engagement,
        },
      });
    
    if (error) {
      console.error('[NeynarSync] Failed to log social event:', error);
    }
  }
}