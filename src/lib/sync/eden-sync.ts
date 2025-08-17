import { SyncService } from './sync-service';
import { supabase } from '@/lib/supabase';

interface EdenCreation {
  id: string;
  creatorAddress: string;
  timestamp: string;
  metadata: {
    title?: string;
    description?: string;
    model?: string;
  };
}

export class EdenSync extends SyncService {
  private apiKey?: string;
  private apiUrl = process.env.NEXT_PUBLIC_EDEN_API_URL || 'https://api.eden.art';

  constructor() {
    super();
    this.apiKey = process.env.EDEN_API_KEY;
  }

  async sync(): Promise<void> {
    return this.withStatusTracking(async () => {
      console.log('[EdenSync] Starting sync...');
      
      // Get all agents
      const { data: agents, error: agentsError } = await supabase
        .from('agents')
        .select('id, name, walletAddress');
      
      if (agentsError) {
        throw new Error(`Failed to fetch agents: ${agentsError.message}`);
      }

      // Sync each agent's creations
      for (const agent of agents || []) {
        if (agent.walletAddress) {
          await this.syncAgentCreations(agent.id, agent.walletAddress);
        }
      }
      
      console.log('[EdenSync] Sync completed');
    });
  }

  private async syncAgentCreations(agentId: string, walletAddress: string): Promise<void> {
    try {
      // Fetch creations from Eden API
      const creations = await this.fetchCreations(walletAddress);
      
      // Get today's date
      const today = new Date().toISOString().split('T')[0];
      
      // Count today's creations
      const todayCreations = creations.filter(c => 
        c.timestamp.startsWith(today)
      ).length;
      
      // Update or insert daily metrics
      const { error } = await supabase
        .from('daily_metrics')
        .upsert({
          agent_id: agentId,
          date: today,
          creations_count: todayCreations,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'agent_id,date'
        });
      
      if (error) {
        console.error(`[EdenSync] Failed to update metrics for agent ${agentId}:`, error);
      }
      
      // Log economy event for new creations
      if (todayCreations > 0) {
        await this.logCreationEvent(agentId, todayCreations);
      }
      
    } catch (error) {
      console.error(`[EdenSync] Failed to sync agent ${agentId}:`, error);
    }
  }

  private async fetchCreations(walletAddress: string): Promise<EdenCreation[]> {
    if (!this.apiKey) {
      console.warn('[EdenSync] No API key configured, using mock data');
      return this.getMockCreations();
    }

    const response = await fetch(`${this.apiUrl}/v1/creations?creator=${walletAddress}`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Eden API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.creations || [];
  }

  private getMockCreations(): EdenCreation[] {
    // Return mock data for development
    const today = new Date().toISOString();
    return [
      {
        id: `mock-${Date.now()}-1`,
        creatorAddress: '0x...',
        timestamp: today,
        metadata: {
          title: 'Mock Creation 1',
          model: 'stable-diffusion',
        },
      },
      {
        id: `mock-${Date.now()}-2`,
        creatorAddress: '0x...',
        timestamp: today,
        metadata: {
          title: 'Mock Creation 2',
          model: 'midjourney',
        },
      },
    ];
  }

  private async logCreationEvent(agentId: string, count: number): Promise<void> {
    const { error } = await supabase
      .from('economy_events')
      .insert({
        agent_id: agentId,
        event_type: 'creation',
        amount: count * 0.1, // Mock revenue per creation
        description: `Created ${count} artworks`,
        metadata: {
          source: 'eden_sync',
          count,
        },
      });
    
    if (error) {
      console.error('[EdenSync] Failed to log creation event:', error);
    }
  }
}