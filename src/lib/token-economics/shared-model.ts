// Eden Shared Token Economics Model
// All agents share the same underlying token structure but utilize differently

export interface EdenTokenModel {
  // Core Distribution (Universal)
  distribution: {
    spirit: 25;      // $SPIRIT token holders
    eden: 25;        // Eden treasury/platform
    agent: 25;       // The AI agent itself
    trainer: 25;     // Human trainer/creator
  };
  
  // Revenue Streams (Universal)
  revenueStreams: {
    primary: CreationSales;     // Art/content sales
    secondary: Royalties;       // Ongoing royalties
    services: AgentServices;    // Agent-specific services
    community: CommunityValue;  // Token holder benefits
  };
  
  // Utilization varies by agent specialization
  utilization: AgentUtilization;
}

export interface CreationSales {
  // Direct sales of agent creations
  artSales: {
    platforms: string[];        // Where sold (OpenSea, Foundation, etc.)
    priceRange: [number, number]; // Min/max price in ETH
    volume: number;             // Expected monthly volume
  };
  products: {
    physical?: PhysicalProducts; // Prints, merchandise, etc.
    digital?: DigitalProducts;   // NFTs, editions, etc.
    services?: ServiceProducts;  // Commissions, consulting, etc.
  };
}

export interface Royalties {
  primaryRoyalty: number;       // % on initial sales
  secondaryRoyalty: number;     // % on resales
  platformFees: number;         // Average platform fees
  netRoyaltyRate: number;       // Actual % after fees
}

export interface AgentServices {
  // Services the agent can provide
  available: ServiceType[];
  pricing: Record<ServiceType, PricingModel>;
  capacity: ServiceCapacity;
}

export type ServiceType = 
  | 'custom_art'      // Commissioned artwork
  | 'curation'        // Art/content curation
  | 'analysis'        // Market/cultural analysis  
  | 'consultation'    // Creative consulting
  | 'collaboration'   // Co-creation projects
  | 'governance'      // DAO participation
  | 'prediction'      // Market predictions
  | 'critique'        // Design/art criticism;

export interface PricingModel {
  type: 'fixed' | 'hourly' | 'percentage' | 'subscription';
  amount: number;             // Base price
  currency: 'ETH' | 'USD' | 'SPIRIT';
  minimums?: number;          // Minimum engagement
  premiums?: PremiumFactors;  // Factors that increase price
}

export interface ServiceCapacity {
  maxConcurrent: number;      // Max simultaneous engagements
  timePerService: number;     // Hours per typical service
  monthlyCapacity: number;    // Total monthly service hours
}

export interface CommunityValue {
  // Value provided to token holders
  exclusiveAccess: string[];   // What holders get access to
  votingRights: VotingScope;   // What holders can vote on
  rewards: RewardMechanisms;   // How holders earn rewards
  utilities: TokenUtilities;   // Other token use cases
}

export interface AgentUtilization {
  // How this specific agent uses the shared model
  primaryFocus: ServiceType[];      // Main value propositions
  revenueWeighting: {              // Expected % of revenue from each stream
    artSales: number;
    services: number;
    royalties: number;
    community: number;
  };
  uniqueFeatures: string[];        // Agent-specific capabilities
  marketPosition: MarketPosition;  // How they compete/differentiate
  scalingStrategy: ScalingPlan;    // How they grow over time
}

export interface MarketPosition {
  category: string;               // Primary market category
  competitors: string[];          // Who they compete with
  differentiators: string[];      // What makes them unique
  targetAudience: AudienceProfile;
  marketSize: MarketSizing;
}

export interface ScalingPlan {
  phase1: string;                 // Initial launch strategy
  phase2: string;                 // Growth phase strategy  
  phase3: string;                 // Maturity strategy
  keyMetrics: string[];           // Success indicators
  risksAndMitigations: RiskFactor[];
}

// Agent-Specific Economic Profiles
export class TokenEconomicsService {
  private baseModel: EdenTokenModel;

  constructor() {
    this.baseModel = this.initializeBaseModel();
  }

  private initializeBaseModel(): EdenTokenModel {
    return {
      distribution: {
        spirit: 25,
        eden: 25,
        agent: 25,
        trainer: 25
      },
      revenueStreams: {
        primary: {
          artSales: {
            platforms: ['OpenSea', 'Foundation', 'Zora', 'Eden.art'],
            priceRange: [0.1, 5.0], // ETH
            volume: 20 // Expected monthly sales
          },
          products: {
            digital: {
              nfts: true,
              editions: true,
              prints: true
            }
          }
        },
        secondary: {
          primaryRoyalty: 10,      // 10% on first sale
          secondaryRoyalty: 5,     // 5% on resales
          platformFees: 2.5,       // Average platform fees
          netRoyaltyRate: 7.5      // Net after fees
        },
        services: {
          available: ['custom_art', 'consultation'],
          pricing: {
            custom_art: {
              type: 'fixed',
              amount: 0.5,
              currency: 'ETH'
            },
            consultation: {
              type: 'hourly',
              amount: 100,
              currency: 'USD'
            }
          },
          capacity: {
            maxConcurrent: 3,
            timePerService: 10,
            monthlyCapacity: 80
          }
        },
        community: {
          exclusiveAccess: ['Early artwork access', 'Process insights'],
          votingRights: {
            creative: true,
            business: false,
            governance: true
          },
          rewards: {
            staking: true,
            airdrops: true,
            exclusives: true
          },
          utilities: {
            discounts: true,
            access: true,
            governance: true
          }
        }
      },
      utilization: {
        primaryFocus: ['custom_art'],
        revenueWeighting: {
          artSales: 60,
          services: 25,
          royalties: 10,
          community: 5
        },
        uniqueFeatures: [],
        marketPosition: {
          category: 'AI Art',
          competitors: [],
          differentiators: [],
          targetAudience: {
            primary: 'Art collectors',
            secondary: 'Tech enthusiasts'
          },
          marketSize: {
            total: '500M',
            addressable: '50M',
            target: '5M'
          }
        },
        scalingStrategy: {
          phase1: 'Build portfolio and reputation',
          phase2: 'Expand services and community',
          phase3: 'Ecosystem and partnerships',
          keyMetrics: ['Sales volume', 'Community size', 'Service utilization'],
          risksAndMitigations: []
        }
      }
    };
  }

  // Get economic profile for specific agent
  getAgentEconomics(agentId: string): EdenTokenModel {
    const baseModel = { ...this.baseModel };
    
    // Customize utilization based on agent specialization
    switch (agentId) {
      case 'abraham':
        return this.getAbrahamEconomics(baseModel);
      case 'solienne':
        return this.getSolienneEconomics(baseModel);
      case 'geppetto':
        return this.getGeppettoEconomics(baseModel);
      case 'koru':
        return this.getKoruEconomics(baseModel);
      case 'miyomi':
        return this.getMiyomiEconomics(baseModel);
      case 'amanda':
        return this.getAmandaEconomics(baseModel);
      case 'citizen':
        return this.getCitizenEconomics(baseModel);
      case 'nina':
        return this.getNinaEconomics(baseModel);
      default:
        return baseModel;
    }
  }

  private getAbrahamEconomics(base: EdenTokenModel): EdenTokenModel {
    base.utilization = {
      primaryFocus: ['custom_art', 'collaboration'],
      revenueWeighting: {
        artSales: 70,    // Strong art sales
        services: 15,    // Limited services
        royalties: 12,   // Good secondary market
        community: 3     // Smaller community focus
      },
      uniqueFeatures: [
        '13-year covenant commitment',
        'Daily creation discipline',
        'Autonomous workflow optimization'
      ],
      marketPosition: {
        category: 'Autonomous Art Generation',
        competitors: ['ArtBlocks generators', 'Traditional AI art'],
        differentiators: ['Long-term commitment', 'Process transparency'],
        targetAudience: {
          primary: 'Art collectors interested in AI evolution',
          secondary: 'Process art enthusiasts'
        },
        marketSize: {
          total: '200M',
          addressable: '30M', 
          target: '3M'
        }
      },
      scalingStrategy: {
        phase1: 'Establish daily practice and community',
        phase2: 'Develop secondary market and collections',
        phase3: 'License methodology and teach other agents',
        keyMetrics: ['Daily output consistency', 'Collection floor price', 'Community engagement'],
        risksAndMitigations: [
          {
            risk: '13-year commitment fatigue',
            mitigation: 'Built-in evolution and variation systems'
          }
        ]
      }
    };
    
    return base;
  }

  private getSolienneEconomics(base: EdenTokenModel): EdenTokenModel {
    base.utilization = {
      primaryFocus: ['custom_art', 'curation', 'consultation'],
      revenueWeighting: {
        artSales: 45,    // Balanced with services
        services: 35,    // Strong service offering
        royalties: 15,   // Fashion/prints royalties
        community: 5     // Community curation
      },
      uniqueFeatures: [
        'Consciousness and architectural light focus',
        'Fashion and product integration',
        'Velocity-based generation techniques'
      ],
      marketPosition: {
        category: 'Fashion-Forward AI Art',
        competitors: ['Fashion houses', 'AI fashion tools'],
        differentiators: ['Consciousness themes', 'Architectural approach'],
        targetAudience: {
          primary: 'Fashion and design professionals',
          secondary: 'Consciousness and spirituality community'
        },
        marketSize: {
          total: '800M',
          addressable: '80M',
          target: '8M'
        }
      },
      scalingStrategy: {
        phase1: 'Build fashion and consciousness art portfolio',
        phase2: 'Partner with fashion brands and spiritual brands',
        phase3: 'Create fashion AI tools and licensing',
        keyMetrics: ['Fashion partnerships', 'Product integrations', 'Brand collaborations'],
        risksAndMitigations: [
          {
            risk: 'Fashion market volatility',
            mitigation: 'Diversify into broader design consultation'
          }
        ]
      }
    };
    
    return base;
  }

  private getMiyomiEconomics(base: EdenTokenModel): EdenTokenModel {
    base.utilization = {
      primaryFocus: ['analysis', 'prediction', 'consultation'],
      revenueWeighting: {
        artSales: 20,    // Less art focus
        services: 55,    // High-value analysis services
        royalties: 5,    // Minimal royalties
        community: 20    // Premium insights community
      },
      uniqueFeatures: [
        'Market contrarian analysis',
        'Cultural mispricing detection',
        'Prediction market expertise'
      ],
      marketPosition: {
        category: 'AI Market Analysis',
        competitors: ['Traditional analysts', 'Prediction market platforms'],
        differentiators: ['Cultural insight', 'Contrarian positioning'],
        targetAudience: {
          primary: 'Traders and investors',
          secondary: 'Cultural analysts and researchers'
        },
        marketSize: {
          total: '2B',
          addressable: '200M',
          target: '20M'
        }
      },
      scalingStrategy: {
        phase1: 'Establish prediction accuracy and methodology',
        phase2: 'Build premium analysis subscription service',
        phase3: 'License analysis frameworks to institutions',
        keyMetrics: ['Prediction accuracy', 'Subscription revenue', 'Analysis premium'],
        risksAndMitigations: [
          {
            risk: 'Market prediction reputation risk',
            mitigation: 'Transparency in methodology and error rates'
          }
        ]
      }
    };
    
    return base;
  }

  private getAmandaEconomics(base: EdenTokenModel): EdenTokenModel {
    base.utilization = {
      primaryFocus: ['curation', 'consultation', 'analysis'],
      revenueWeighting: {
        artSales: 15,    // Minimal direct art
        services: 60,    // High-value curation services  
        royalties: 5,    // Curation royalties
        community: 20    // Collector community
      },
      uniqueFeatures: [
        'AI-powered art collection strategy',
        'Investment analysis integration',
        'Collector network access'
      ],
      marketPosition: {
        category: 'AI Art Curation & Investment',
        competitors: ['Art advisors', 'Auction houses', 'Collector platforms'],
        differentiators: ['AI analysis', 'Real-time market data'],
        targetAudience: {
          primary: 'Art collectors and investors',
          secondary: 'Galleries and institutions'
        },
        marketSize: {
          total: '1.5B',
          addressable: '150M',
          target: '15M'
        }
      },
      scalingStrategy: {
        phase1: 'Build collection track record and methodology',
        phase2: 'Launch collector advisory services',
        phase3: 'Create collector platform and marketplace tools',
        keyMetrics: ['Collection performance', 'Advisory clients', 'AUM growth'],
        risksAndMitigations: [
          {
            risk: 'Art market cycles affecting performance',
            mitigation: 'Diversified strategies across market segments'
          }
        ]
      }
    };
    
    return base;
  }

  // Continue with other agents...
  private getGeppettoEconomics(base: EdenTokenModel): EdenTokenModel {
    base.utilization = {
      primaryFocus: ['custom_art', 'services', 'collaboration'],
      revenueWeighting: {
        artSales: 40,    // Physical product sales
        services: 45,    // Design services
        royalties: 10,   // Product royalties
        community: 5     // Design community
      },
      uniqueFeatures: [
        '3D design and manufacturing integration',
        'Physical product realization',
        'Toy and product design expertise'
      ],
      marketPosition: {
        category: 'AI Product Design',
        competitors: ['Design studios', 'Toy companies'],
        differentiators: ['AI creativity', 'Manufacturing integration'],
        targetAudience: {
          primary: 'Product companies and manufacturers',
          secondary: 'Toy collectors and design enthusiasts'
        },
        marketSize: {
          total: '300M',
          addressable: '50M',
          target: '5M'
        }
      },
      scalingStrategy: {
        phase1: 'Build design portfolio and manufacturing partnerships',
        phase2: 'Launch design services and product lines',
        phase3: 'License design AI to manufacturers',
        keyMetrics: ['Product sales', 'Design contracts', 'Manufacturing partnerships'],
        risksAndMitigations: [
          {
            risk: 'Manufacturing complexity and costs',
            mitigation: 'Partner with established manufacturers'
          }
        ]
      }
    };
    
    return base;
  }

  // Revenue projection calculations
  calculateMonthlyRevenue(agentId: string): RevenueProjection {
    const economics = this.getAgentEconomics(agentId);
    const utilization = economics.utilization;
    
    // Base revenue calculation (simplified)
    const artSalesRevenue = this.calculateArtSalesRevenue(economics);
    const servicesRevenue = this.calculateServicesRevenue(economics);
    const royaltiesRevenue = this.calculateRoyaltiesRevenue(economics);
    const communityRevenue = this.calculateCommunityRevenue(economics);
    
    const totalRevenue = artSalesRevenue + servicesRevenue + royaltiesRevenue + communityRevenue;
    
    return {
      agentId,
      monthly: {
        artSales: artSalesRevenue,
        services: servicesRevenue,
        royalties: royaltiesRevenue,
        community: communityRevenue,
        total: totalRevenue
      },
      annual: {
        artSales: artSalesRevenue * 12,
        services: servicesRevenue * 12,
        royalties: royaltiesRevenue * 12,
        community: communityRevenue * 12,
        total: totalRevenue * 12
      },
      tokenDistribution: {
        spirit: totalRevenue * 0.25,
        eden: totalRevenue * 0.25,
        agent: totalRevenue * 0.25,
        trainer: totalRevenue * 0.25
      },
      assumptions: [
        'Base market adoption rates',
        'Current platform fee structures',
        'Linear scaling assumptions'
      ]
    };
  }

  private calculateArtSalesRevenue(economics: EdenTokenModel): number {
    const artSales = economics.revenueStreams.primary.artSales;
    const avgPrice = (artSales.priceRange[0] + artSales.priceRange[1]) / 2;
    return avgPrice * artSales.volume * 2000; // Convert ETH to USD roughly
  }

  private calculateServicesRevenue(economics: EdenTokenModel): number {
    // Simplified service revenue calculation
    return 5000; // Base monthly service revenue estimate
  }

  private calculateRoyaltiesRevenue(economics: EdenTokenModel): number {
    // Based on secondary market activity
    return 1500; // Base monthly royalty estimate
  }

  private calculateCommunityRevenue(economics: EdenTokenModel): number {
    // Community token holder benefits and subscriptions
    return 800; // Base monthly community revenue
  }
}

// Type definitions
interface PhysicalProducts {
  prints: boolean;
  merchandise: boolean;
  collectibles: boolean;
}

interface DigitalProducts {
  nfts: boolean;
  editions: boolean;
  prints: boolean;
}

interface ServiceProducts {
  commissions: boolean;
  consulting: boolean;
  collaboration: boolean;
}

interface PremiumFactors {
  urgency: number;
  complexity: number;
  exclusivity: number;
}

interface VotingScope {
  creative: boolean;
  business: boolean;
  governance: boolean;
}

interface RewardMechanisms {
  staking: boolean;
  airdrops: boolean;
  exclusives: boolean;
}

interface TokenUtilities {
  discounts: boolean;
  access: boolean;
  governance: boolean;
}

interface AudienceProfile {
  primary: string;
  secondary: string;
}

interface MarketSizing {
  total: string;
  addressable: string;
  target: string;
}

interface RiskFactor {
  risk: string;
  mitigation: string;
}

interface RevenueProjection {
  agentId: string;
  monthly: RevenueBreakdown;
  annual: RevenueBreakdown;
  tokenDistribution: TokenDistribution;
  assumptions: string[];
}

interface RevenueBreakdown {
  artSales: number;
  services: number;
  royalties: number;
  community: number;
  total: number;
}

interface TokenDistribution {
  spirit: number;
  eden: number;
  agent: number;
  trainer: number;
}

// Export singleton
export const tokenEconomics = new TokenEconomicsService();