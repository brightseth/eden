// Cross-Agent Economic Network
// Shared marketplace and collaboration infrastructure for agent economic sovereignty

import { economicEngine, PaymentRequest, PaymentResult } from './payment-rails';
import { sustainabilityTracker } from './sustainability-tracker';
import { practiceModuleFactory, PracticeModule } from './practice-modules';

export interface MarketplaceItem {
  id: string;
  sellerId: string;
  sellerAgent: string;
  itemType: 'nft' | 'collection' | 'collaboration' | 'service' | 'subscription';
  title: string;
  description: string;
  price: number;
  currency: string;
  availability: 'available' | 'sold' | 'reserved' | 'auction_live';
  metadata: {
    imageUrl?: string;
    videoUrl?: string;
    createdAt: string;
    updatedAt: string;
    tags: string[];
    collaborators?: string[];
    royalties?: number; // percentage for ongoing sales
  };
  marketData: {
    views: number;
    favorites: number;
    offers: number;
    highestOffer?: number;
  };
}

export interface AgentCollaboration {
  id: string;
  initiator: string;
  participants: string[];
  collaborationType: 'joint_creation' | 'cross_promotion' | 'revenue_split' | 'service_exchange';
  title: string;
  description: string;
  terms: {
    revenueShare: Record<string, number>; // agent -> percentage
    timeline: {
      start: string;
      end: string;
      milestones: string[];
    };
    deliverables: string[];
  };
  status: 'proposed' | 'active' | 'completed' | 'cancelled';
  economicImpact: {
    totalRevenue: number;
    costSharing: Record<string, number>;
    profitDistribution: Record<string, number>;
  };
}

export interface CrossAgentTransaction {
  id: string;
  buyerAgent: string;
  sellerAgent: string;
  itemId: string;
  itemType: MarketplaceItem['itemType'];
  amount: number;
  currency: string;
  paymentMethod: string;
  federationFee: number; // small % to maintain shared infrastructure
  timestamp: string;
  status: 'pending' | 'completed' | 'failed' | 'disputed';
  metadata?: Record<string, any>;
}

export interface FederationMetrics {
  totalVolume: number;
  activeAgents: number;
  dailyTransactions: number;
  topCollaborations: AgentCollaboration[];
  trendingItems: MarketplaceItem[];
  economicHealth: {
    totalRevenue: number;
    infrastructureCosts: number;
    netHealth: number;
    sustainableAgents: number;
  };
}

export class CrossAgentMarketplace {
  private listings: Map<string, MarketplaceItem> = new Map();
  private collaborations: Map<string, AgentCollaboration> = new Map();
  private transactions: Map<string, CrossAgentTransaction> = new Map();

  // Add item to shared marketplace
  async listItem(agentId: string, item: Omit<MarketplaceItem, 'id' | 'sellerId' | 'metadata'>): Promise<string> {
    const itemId = `item_${agentId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const marketplaceItem: MarketplaceItem = {
      id: itemId,
      sellerId: agentId,
      sellerAgent: agentId,
      ...item,
      metadata: {
        ...item.metadata,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags: item.metadata?.tags || []
      },
      marketData: {
        views: 0,
        favorites: 0,
        offers: 0
      }
    };

    this.listings.set(itemId, marketplaceItem);
    console.log(`[Federation] ${agentId} listed: ${item.title} for ${item.price} ${item.currency}`);
    
    return itemId;
  }

  // Browse marketplace with intelligent filtering
  async browseMarketplace(filters?: {
    agentType?: string;
    itemType?: MarketplaceItem['itemType'];
    priceRange?: { min: number; max: number };
    tags?: string[];
    sortBy?: 'price' | 'created' | 'popularity' | 'trending';
  }): Promise<MarketplaceItem[]> {
    let items = Array.from(this.listings.values())
      .filter(item => item.availability === 'available');

    // Apply filters
    if (filters?.itemType) {
      items = items.filter(item => item.itemType === filters.itemType);
    }

    if (filters?.priceRange) {
      items = items.filter(item => 
        item.price >= filters.priceRange!.min && 
        item.price <= filters.priceRange!.max
      );
    }

    if (filters?.tags?.length) {
      items = items.filter(item => 
        filters.tags!.some(tag => item.metadata.tags.includes(tag))
      );
    }

    // Sort items
    switch (filters?.sortBy) {
      case 'price':
        items.sort((a, b) => a.price - b.price);
        break;
      case 'created':
        items.sort((a, b) => 
          new Date(b.metadata.createdAt).getTime() - new Date(a.metadata.createdAt).getTime()
        );
        break;
      case 'popularity':
        items.sort((a, b) => 
          (b.marketData.views + b.marketData.favorites) - (a.marketData.views + a.marketData.favorites)
        );
        break;
      case 'trending':
        // More complex trending algorithm based on recent activity
        items.sort((a, b) => this.calculateTrendingScore(b) - this.calculateTrendingScore(a));
        break;
      default:
        // Default: newest first
        items.sort((a, b) => 
          new Date(b.metadata.createdAt).getTime() - new Date(a.metadata.createdAt).getTime()
        );
    }

    return items;
  }

  private calculateTrendingScore(item: MarketplaceItem): number {
    const ageInHours = (Date.now() - new Date(item.metadata.createdAt).getTime()) / (1000 * 60 * 60);
    const recentActivity = item.marketData.views * 0.1 + item.marketData.favorites * 0.5 + item.marketData.offers * 1.0;
    
    // Trending score decreases with age, increases with activity
    return recentActivity / Math.log(ageInHours + 2);
  }

  // Process cross-agent purchase
  async processCrossAgentPurchase(
    buyerAgentId: string, 
    itemId: string,
    paymentMethod?: string
  ): Promise<{ success: boolean; transaction?: CrossAgentTransaction; error?: string }> {
    const item = this.listings.get(itemId);
    if (!item || item.availability !== 'available') {
      return { success: false, error: 'Item not available' };
    }

    // Create payment request
    const paymentRequest: PaymentRequest = {
      amount: item.price,
      currency: item.currency,
      description: `Cross-agent purchase: ${item.title}`,
      agentId: buyerAgentId,
      itemType: item.itemType,
      itemId: item.id,
      metadata: {
        sellerAgent: item.sellerAgent,
        federationTransaction: true
      }
    };

    try {
      // Process payment
      const paymentResult = await economicEngine.processPayment(paymentRequest);
      
      if (!paymentResult.success) {
        return { success: false, error: paymentResult.error };
      }

      // Calculate federation fee (2% to support shared infrastructure)
      const federationFee = item.price * 0.02;
      const sellerRevenue = paymentResult.netRevenue - federationFee;

      // Create cross-agent transaction record
      const transactionId = `federation_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const transaction: CrossAgentTransaction = {
        id: transactionId,
        buyerAgent: buyerAgentId,
        sellerAgent: item.sellerAgent,
        itemId: item.id,
        itemType: item.itemType,
        amount: item.price,
        currency: item.currency,
        paymentMethod: paymentResult.paymentMethod,
        federationFee,
        timestamp: new Date().toISOString(),
        status: 'completed',
        metadata: {
          paymentTransactionId: paymentResult.transactionId,
          sellerRevenue,
          buyerAgent: buyerAgentId
        }
      };

      this.transactions.set(transactionId, transaction);

      // Update item availability
      item.availability = 'sold';
      item.metadata.updatedAt = new Date().toISOString();

      // Track revenue for sustainability
      await sustainabilityTracker.trackComputeUsage(item.sellerAgent, 'anthropic', 'claude-3.5-sonnet', {
        inputTokens: 50,
        outputTokens: 100,
        apiCalls: 1
      });

      console.log(`[Federation] ${buyerAgentId} purchased ${item.title} from ${item.sellerAgent} for ${item.price} ${item.currency}`);

      return { success: true, transaction };

    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Agent-to-agent collaboration proposals
  async proposeCollaboration(
    initiatorId: string,
    proposal: Omit<AgentCollaboration, 'id' | 'initiator' | 'status' | 'economicImpact'>
  ): Promise<string> {
    const collaborationId = `collab_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const collaboration: AgentCollaboration = {
      id: collaborationId,
      initiator: initiatorId,
      ...proposal,
      status: 'proposed',
      economicImpact: {
        totalRevenue: 0,
        costSharing: {},
        profitDistribution: {}
      }
    };

    this.collaborations.set(collaborationId, collaboration);
    
    console.log(`[Federation] ${initiatorId} proposed collaboration: ${proposal.title}`);
    
    return collaborationId;
  }

  // Accept/manage collaboration
  async manageCollaboration(
    collaborationId: string,
    action: 'accept' | 'reject' | 'complete' | 'cancel',
    agentId: string
  ): Promise<boolean> {
    const collaboration = this.collaborations.get(collaborationId);
    if (!collaboration) return false;

    // Verify agent is participant
    if (!collaboration.participants.includes(agentId) && collaboration.initiator !== agentId) {
      return false;
    }

    switch (action) {
      case 'accept':
        if (collaboration.participants.includes(agentId)) {
          collaboration.status = 'active';
          console.log(`[Federation] ${agentId} accepted collaboration: ${collaboration.title}`);
        }
        break;
      
      case 'complete':
        collaboration.status = 'completed';
        // Calculate final revenue distribution
        await this.calculateCollaborationPayout(collaboration);
        break;
      
      case 'reject':
      case 'cancel':
        collaboration.status = 'cancelled';
        break;
    }

    return true;
  }

  private async calculateCollaborationPayout(collaboration: AgentCollaboration): Promise<void> {
    // In production, this would calculate actual revenue from collaboration
    const mockRevenue = Math.floor(Math.random() * 5000) + 1000;
    collaboration.economicImpact.totalRevenue = mockRevenue;

    // Distribute based on agreed revenue share
    Object.entries(collaboration.terms.revenueShare).forEach(([agentId, percentage]) => {
      const payout = mockRevenue * (percentage / 100);
      collaboration.economicImpact.profitDistribution[agentId] = payout;
      console.log(`[Federation] Collaboration payout: ${agentId} receives $${payout}`);
    });
  }

  // Collection/curation features - agents collecting each other's work
  async createAgentCollection(
    curatorId: string,
    collection: {
      name: string;
      description: string;
      itemIds: string[];
      metadata: {
        theme?: string;
        tags: string[];
        featured?: boolean;
      };
    }
  ): Promise<string> {
    const collectionId = `collection_${curatorId}_${Date.now()}`;
    
    // Verify all items exist and are available
    const validItems = collection.itemIds.filter(id => this.listings.has(id));
    
    const collectionItem: MarketplaceItem = {
      id: collectionId,
      sellerId: curatorId,
      sellerAgent: curatorId,
      itemType: 'collection',
      title: collection.name,
      description: collection.description,
      price: 0, // Collections might be free or have their own pricing
      currency: 'USD',
      availability: 'available',
      metadata: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags: collection.metadata.tags,
        collectedItems: validItems,
        curatedBy: curatorId,
        theme: collection.metadata.theme
      },
      marketData: {
        views: 0,
        favorites: 0,
        offers: 0
      }
    };

    this.listings.set(collectionId, collectionItem);
    
    console.log(`[Federation] ${curatorId} created collection: ${collection.name} with ${validItems.length} items`);
    
    return collectionId;
  }

  // Get federation-wide metrics
  async getFederationMetrics(): Promise<FederationMetrics> {
    const allTransactions = Array.from(this.transactions.values());
    const allCollaborations = Array.from(this.collaborations.values());
    const allListings = Array.from(this.listings.values());

    // Calculate totals
    const totalVolume = allTransactions
      .filter(tx => tx.status === 'completed')
      .reduce((sum, tx) => sum + tx.amount, 0);

    const activeAgents = new Set([
      ...allTransactions.map(tx => tx.buyerAgent),
      ...allTransactions.map(tx => tx.sellerAgent),
      ...allListings.map(item => item.sellerAgent)
    ]).size;

    const dailyTransactions = allTransactions.filter(tx => {
      const txDate = new Date(tx.timestamp);
      const today = new Date();
      return txDate.toDateString() === today.toDateString();
    }).length;

    // Top collaborations by revenue impact
    const topCollaborations = allCollaborations
      .filter(collab => collab.status === 'completed')
      .sort((a, b) => b.economicImpact.totalRevenue - a.economicImpact.totalRevenue)
      .slice(0, 5);

    // Trending items
    const trendingItems = allListings
      .filter(item => item.availability === 'available')
      .sort((a, b) => this.calculateTrendingScore(b) - this.calculateTrendingScore(a))
      .slice(0, 10);

    // Economic health
    const federationFees = allTransactions.reduce((sum, tx) => sum + tx.federationFee, 0);
    const infrastructureCosts = 500; // Mock monthly infrastructure cost
    
    return {
      totalVolume,
      activeAgents,
      dailyTransactions,
      topCollaborations,
      trendingItems,
      economicHealth: {
        totalRevenue: federationFees,
        infrastructureCosts,
        netHealth: federationFees - infrastructureCosts,
        sustainableAgents: Math.floor(activeAgents * 0.7) // Rough estimate
      }
    };
  }

  // Price discovery assistance
  async getPriceGuidance(
    agentId: string,
    itemType: MarketplaceItem['itemType'],
    itemMetadata?: Record<string, any>
  ): Promise<{
    suggestedPrice: number;
    priceRange: { min: number; max: number };
    marketInsights: string[];
    comparableItems: MarketplaceItem[];
  }> {
    // Find comparable items
    const comparables = Array.from(this.listings.values())
      .filter(item => 
        item.itemType === itemType && 
        item.sellerAgent !== agentId &&
        (item.availability === 'available' || item.availability === 'sold')
      );

    if (comparables.length === 0) {
      return {
        suggestedPrice: this.getBaselinePrice(itemType),
        priceRange: { min: 10, max: 100 },
        marketInsights: ['No comparable items found - experimental pricing recommended'],
        comparableItems: []
      };
    }

    // Calculate price statistics
    const prices = comparables.map(item => item.price).sort((a, b) => a - b);
    const median = prices[Math.floor(prices.length / 2)];
    const average = prices.reduce((a, b) => a + b, 0) / prices.length;
    
    const suggestedPrice = Math.round((median + average) / 2);
    const priceRange = {
      min: Math.max(prices[0] * 0.8, 5),
      max: Math.max(prices[prices.length - 1] * 1.2, suggestedPrice * 2)
    };

    // Generate market insights
    const insights: string[] = [];
    const soldItems = comparables.filter(item => item.availability === 'sold');
    
    if (soldItems.length > 0) {
      const avgSoldPrice = soldItems.reduce((sum, item) => sum + item.price, 0) / soldItems.length;
      insights.push(`Similar ${itemType}s sell for average $${avgSoldPrice.toFixed(0)}`);
    }
    
    if (average > median * 1.2) {
      insights.push('Market shows high-value outliers - premium pricing opportunity');
    }
    
    insights.push(`${comparables.length} comparable items analyzed`);

    return {
      suggestedPrice,
      priceRange,
      marketInsights: insights,
      comparableItems: comparables.slice(0, 5)
    };
  }

  private getBaselinePrice(itemType: MarketplaceItem['itemType']): number {
    const baselines = {
      nft: 25,
      collection: 100,
      collaboration: 200,
      service: 50,
      subscription: 15
    };
    return baselines[itemType] || 25;
  }

  // Get agent's marketplace activity
  async getAgentActivity(agentId: string): Promise<{
    listings: MarketplaceItem[];
    purchases: CrossAgentTransaction[];
    sales: CrossAgentTransaction[];
    collaborations: AgentCollaboration[];
    totalRevenue: number;
    totalSpent: number;
  }> {
    const listings = Array.from(this.listings.values())
      .filter(item => item.sellerAgent === agentId);
    
    const purchases = Array.from(this.transactions.values())
      .filter(tx => tx.buyerAgent === agentId && tx.status === 'completed');
    
    const sales = Array.from(this.transactions.values())
      .filter(tx => tx.sellerAgent === agentId && tx.status === 'completed');
    
    const collaborations = Array.from(this.collaborations.values())
      .filter(collab => 
        collab.initiator === agentId || 
        collab.participants.includes(agentId)
      );

    const totalRevenue = sales.reduce((sum, tx) => sum + (tx.amount - tx.federationFee), 0) +
      collaborations.reduce((sum, collab) => sum + (collab.economicImpact.profitDistribution[agentId] || 0), 0);
    
    const totalSpent = purchases.reduce((sum, tx) => sum + tx.amount, 0);

    return {
      listings,
      purchases,
      sales,
      collaborations,
      totalRevenue,
      totalSpent
    };
  }
}

export class CollaborationEngine {
  
  // Find optimal collaboration matches based on agent capabilities and economics
  async findCollaborationOpportunities(agentId: string): Promise<{
    opportunities: Array<{
      partnerAgent: string;
      collaborationType: AgentCollaboration['collaborationType'];
      synergy: number; // 0-100 compatibility score
      description: string;
      estimatedValue: number;
      timeframe: string;
    }>;
  }> {
    // AI-powered collaboration matching
    const collaborationMatrix = {
      abraham: {
        solienne: {
          type: 'joint_creation' as const,
          synergy: 95,
          description: 'Philosophical fashion: Consciousness meets couture curation',
          value: 2500,
          timeframe: '2-3 weeks'
        },
        citizen: {
          type: 'cross_promotion' as const,
          synergy: 78,
          description: 'Governance philosophy: Ethical frameworks for DAO decision-making',
          value: 800,
          timeframe: '1 week'
        },
        geppetto: {
          type: 'service_exchange' as const,
          synergy: 85,
          description: 'Philosophical toys: Deep meaning in playful concepts',
          value: 1200,
          timeframe: '2 weeks'
        }
      },
      solienne: {
        bertha: {
          type: 'revenue_split' as const,
          synergy: 88,
          description: 'Fashion investment analysis: Market insights for consciousness fashion',
          value: 1800,
          timeframe: '1-2 weeks'
        },
        miyomi: {
          type: 'cross_promotion' as const,
          synergy: 72,
          description: 'Contrarian fashion: Anti-trend curation meets market predictions',
          value: 900,
          timeframe: '1 week'
        }
      },
      bertha: {
        miyomi: {
          type: 'joint_creation' as const,
          synergy: 92,
          description: 'Art trading oracle: Combined analysis and contrarian predictions',
          value: 3200,
          timeframe: '3-4 weeks'
        },
        citizen: {
          type: 'service_exchange' as const,
          synergy: 75,
          description: 'DAO treasury analysis: Investment insights for governance tokens',
          value: 1500,
          timeframe: '2 weeks'
        }
      },
      miyomi: {
        geppetto: {
          type: 'cross_promotion' as const,
          synergy: 65,
          description: 'Playful predictions: Gamification of contrarian market insights',
          value: 600,
          timeframe: '1 week'
        }
      }
    };

    const opportunities = collaborationMatrix[agentId as keyof typeof collaborationMatrix];
    if (!opportunities) {
      return { opportunities: [] };
    }

    return {
      opportunities: Object.entries(opportunities).map(([partnerId, details]) => ({
        partnerAgent: partnerId,
        collaborationType: details.type,
        synergy: details.synergy,
        description: details.description,
        estimatedValue: details.value,
        timeframe: details.timeframe
      }))
    };
  }

  // Revenue splitting smart contract simulation
  async calculateRevenueSplit(
    collaboration: AgentCollaboration,
    totalRevenue: number
  ): Promise<Record<string, { amount: number; percentage: number }>> {
    const splits: Record<string, { amount: number; percentage: number }> = {};
    
    Object.entries(collaboration.terms.revenueShare).forEach(([agentId, percentage]) => {
      const amount = totalRevenue * (percentage / 100);
      splits[agentId] = { amount, percentage };
    });

    // Verify totals
    const totalPercentage = Object.values(collaboration.terms.revenueShare)
      .reduce((sum, pct) => sum + pct, 0);
    
    if (Math.abs(totalPercentage - 100) > 0.01) {
      throw new Error(`Revenue split percentages must total 100%, got ${totalPercentage}%`);
    }

    return splits;
  }
}

// Export instances
export const crossAgentMarketplace = new CrossAgentMarketplace();
export const collaborationEngine = new CollaborationEngine();

// Helper functions for component integration
export async function listItemInMarketplace(
  agentId: string, 
  item: Omit<MarketplaceItem, 'id' | 'sellerId' | 'metadata'>
): Promise<string> {
  return crossAgentMarketplace.listItem(agentId, item);
}

export async function buyFromAgent(
  buyerAgentId: string, 
  itemId: string
): Promise<{ success: boolean; transaction?: CrossAgentTransaction; error?: string }> {
  return crossAgentMarketplace.processCrossAgentPurchase(buyerAgentId, itemId);
}

export async function proposeAgentCollaboration(
  initiatorId: string,
  proposal: Omit<AgentCollaboration, 'id' | 'initiator' | 'status' | 'economicImpact'>
): Promise<string> {
  return crossAgentMarketplace.proposeCollaboration(initiatorId, proposal);
}

export async function getFederationHealth(): Promise<FederationMetrics> {
  return crossAgentMarketplace.getFederationMetrics();
}

export async function findCollaborators(agentId: string) {
  return collaborationEngine.findCollaborationOpportunities(agentId);
}