import { SyncService } from './sync-service';
import { supabase } from '@/lib/supabase';

interface AlchemyTransaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  blockNumber: number;
  timestamp: number;
}

interface TokenBalance {
  contractAddress: string;
  symbol: string;
  balance: string;
  decimals: number;
}

export class AlchemySync extends SyncService {
  private apiKey?: string;
  private apiUrl: string;

  constructor() {
    super();
    this.apiKey = process.env.ALCHEMY_API_KEY;
    const network = process.env.ALCHEMY_NETWORK || 'eth-mainnet';
    this.apiUrl = `https://${network}.g.alchemy.com/v2/${this.apiKey}`;
  }

  async sync(): Promise<void> {
    return this.withStatusTracking(async () => {
      console.log('[AlchemySync] Starting sync...');
      
      // Get all agents with wallet addresses
      const { data: agents, error: agentsError } = await supabase
        .from('agents')
        .select('id, name, walletAddress')
        .not('walletAddress', 'is', null);
      
      if (agentsError) {
        throw new Error(`Failed to fetch agents: ${agentsError.message}`);
      }

      // Sync each agent's blockchain data
      for (const agent of agents || []) {
        if (agent.walletAddress) {
          await this.syncAgentBlockchain(agent.id, agent.walletAddress);
        }
      }
      
      console.log('[AlchemySync] Sync completed');
    });
  }

  private async syncAgentBlockchain(agentId: string, walletAddress: string): Promise<void> {
    try {
      // Fetch recent transactions
      const transactions = await this.fetchTransactions(walletAddress);
      
      // Fetch token balances
      const balances = await this.fetchTokenBalances(walletAddress);
      
      // Calculate total value (mock calculation)
      const totalValue = this.calculateTotalValue(balances);
      
      // Get today's date
      const today = new Date().toISOString().split('T')[0];
      
      // Count today's transactions
      const todayTxCount = transactions.filter(tx => {
        const txDate = new Date(tx.timestamp * 1000).toISOString().split('T')[0];
        return txDate === today;
      }).length;
      
      // Calculate revenue from transactions (mock)
      const revenue = transactions.reduce((sum, tx) => {
        const value = parseFloat(tx.value) / 1e18; // Convert from wei
        return sum + (value * 0.1); // Mock revenue calculation
      }, 0);
      
      // Update daily metrics
      const { error } = await supabase
        .from('daily_metrics')
        .upsert({
          agent_id: agentId,
          date: today,
          revenue_primary: revenue,
          wallet_balance: totalValue,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'agent_id,date'
        });
      
      if (error) {
        console.error(`[AlchemySync] Failed to update metrics for agent ${agentId}:`, error);
      }
      
      // Log economic events for significant transactions
      for (const tx of transactions) {
        const value = parseFloat(tx.value) / 1e18;
        if (value > 0.01) { // Only log significant transactions
          await this.logTransactionEvent(agentId, tx, value);
        }
      }
      
    } catch (error) {
      console.error(`[AlchemySync] Failed to sync agent ${agentId}:`, error);
    }
  }

  private async fetchTransactions(address: string): Promise<AlchemyTransaction[]> {
    if (!this.apiKey) {
      console.warn('[AlchemySync] No API key configured, using mock data');
      return this.getMockTransactions();
    }

    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'alchemy_getAssetTransfers',
        params: [
          {
            fromAddress: address,
            category: ['external', 'token'],
            maxCount: '0x64', // 100 transactions
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`Alchemy API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.result?.transfers || [];
  }

  private async fetchTokenBalances(address: string): Promise<TokenBalance[]> {
    if (!this.apiKey) {
      console.warn('[AlchemySync] No API key configured, using mock data');
      return this.getMockBalances();
    }

    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'alchemy_getTokenBalances',
        params: [address],
      }),
    });

    if (!response.ok) {
      throw new Error(`Alchemy API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.result?.tokenBalances || [];
  }

  private getMockTransactions(): AlchemyTransaction[] {
    return [
      {
        hash: `0x${Math.random().toString(16).slice(2)}`,
        from: '0x1234...',
        to: '0x5678...',
        value: '1000000000000000', // 0.001 ETH in wei
        blockNumber: 18000000,
        timestamp: Math.floor(Date.now() / 1000),
      },
      {
        hash: `0x${Math.random().toString(16).slice(2)}`,
        from: '0x5678...',
        to: '0x1234...',
        value: '5000000000000000', // 0.005 ETH in wei
        blockNumber: 18000001,
        timestamp: Math.floor(Date.now() / 1000) - 3600,
      },
    ];
  }

  private getMockBalances(): TokenBalance[] {
    return [
      {
        contractAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
        symbol: 'USDC',
        balance: '1000000000', // 1000 USDC (6 decimals)
        decimals: 6,
      },
      {
        contractAddress: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
        symbol: 'DAI',
        balance: '500000000000000000000', // 500 DAI (18 decimals)
        decimals: 18,
      },
    ];
  }

  private calculateTotalValue(balances: TokenBalance[]): number {
    // Mock calculation - in production would use price feeds
    return balances.reduce((sum, balance) => {
      const amount = parseFloat(balance.balance) / Math.pow(10, balance.decimals);
      // Mock USD values
      const prices: Record<string, number> = {
        'USDC': 1,
        'DAI': 1,
        'ETH': 2000,
      };
      return sum + (amount * (prices[balance.symbol] || 0));
    }, 0);
  }

  private async logTransactionEvent(
    agentId: string, 
    tx: AlchemyTransaction, 
    value: number
  ): Promise<void> {
    const { error } = await supabase
      .from('economy_events')
      .insert({
        agent_id: agentId,
        event_type: 'transaction',
        amount: value,
        description: `Transaction ${tx.hash.slice(0, 10)}...`,
        metadata: {
          source: 'alchemy_sync',
          hash: tx.hash,
          from: tx.from,
          to: tx.to,
          blockNumber: tx.blockNumber,
        },
      });
    
    if (error) {
      console.error('[AlchemySync] Failed to log transaction event:', error);
    }
  }
}