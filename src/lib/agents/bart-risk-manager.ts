/**
 * BART Risk Management System
 * Implements Renaissance banking principles with modern risk controls
 */

import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';

export interface RiskPolicy {
  metadata: {
    name: string;
    version: string;
    lastUpdated: string;
    description: string;
  };
  global: {
    maxExposurePercentage: number;
    maxDailyVolume: string;
    reserveRatio: number;
    defaultDryRun: boolean;
  };
  collections: Record<string, CollectionPolicy>;
  tiers: Record<string, TierPolicy>;
  durations: Record<string, DurationPolicy>;
  market_conditions: Record<string, MarketConditionPolicy>;
  dry_run: DryRunConfig;
  banking_wisdom: BankingRule[];
}

export interface CollectionPolicy {
  address: string;
  tier: string;
  maxLTV: number;
  baseAPR: number;
  maxLoanAmount: string;
  requiredLiquidity: string;
}

export interface TierPolicy {
  description: string;
  minFloorPrice: string;
  maxDefaultRate: number;
  minVolume24h: string;
}

export interface DurationPolicy {
  riskMultiplier: number;
  aprBonus: number;
}

export interface MarketConditionPolicy {
  ltvBonus?: number;
  ltvPenalty?: number;
  ltvAdjustment?: number;
  aprDiscount?: number;
  aprPremium?: number;
  aprAdjustment?: number;
}

export interface DryRunConfig {
  enabled: boolean;
  mode: 'simulation' | 'validation' | 'disabled';
  log_level: 'minimal' | 'detailed' | 'verbose';
  simulation_outcomes: {
    success_rate: number;
    default_rate: number;
    avg_repayment_days: number;
  };
}

export interface BankingRule {
  rule: string;
  threshold?: number;
  max_concentration?: number;
  min_cash_ratio?: number;
  risk_premium_per_tier?: Record<string, number>;
}

export interface LoanRequest {
  contractAddress: string;
  tokenId: string;
  requestedAmount: number;
  duration: number; // days
  collectionName?: string;
  floorPrice?: number;
}

export interface RiskAssessment {
  approved: boolean;
  recommendedLTV: number;
  adjustedAPR: number;
  maxLoanAmount: number;
  riskScore: number;
  tier: string;
  reasoning: string[];
  dryRun: boolean;
  simulatedOutcome?: {
    wouldSucceed: boolean;
    projectedRepayment: number;
    riskFactors: string[];
  };
}

export class BartRiskManager {
  private policy: RiskPolicy;
  private policyPath: string;

  constructor(policyPath?: string) {
    // Use absolute path from project root for build reliability
    this.policyPath = policyPath || path.join(process.cwd(), 'src/lib/agents/bart-risk-policy.yaml');
    this.loadPolicy();
  }

  private loadPolicy(): void {
    try {
      const policyContent = fs.readFileSync(this.policyPath, 'utf8');
      // Parse YAML manually or use fallback if js-yaml not available
      this.policy = this.parseYamlPolicy(policyContent);
      console.log(`[BART Risk] Loaded policy: ${this.policy.metadata.name} v${this.policy.metadata.version}`);
    } catch (error) {
      console.error('[BART Risk] Failed to load risk policy:', error);
      // Fallback to safe defaults for build-time
      this.policy = this.getDefaultPolicy();
      console.warn('[BART Risk] Using fallback policy configuration');
    }
  }

  private parseYamlPolicy(content: string): RiskPolicy {
    try {
      return yaml.load(content) as RiskPolicy;
    } catch (yamlError) {
      console.warn('[BART Risk] YAML parsing failed, using fallback');
      throw new Error('YAML parsing failed');
    }
  }

  private getDefaultPolicy(): RiskPolicy {
    return {
      metadata: {
        name: "BART Fallback Risk Policy",
        version: "1.0.0-fallback",
        lastUpdated: new Date().toISOString().split('T')[0],
        description: "Emergency fallback for build stability"
      },
      global: {
        maxExposurePercentage: 10,
        maxDailyVolume: "100 ETH",
        reserveRatio: 0.25,
        defaultDryRun: true
      },
      collections: {
        fallback: {
          address: "0x0000000000000000000000000000000000000000",
          tier: "unknown",
          maxLTV: 0.50,
          baseAPR: 0.30,
          maxLoanAmount: "10 ETH",
          requiredLiquidity: "5 ETH"
        }
      },
      tiers: {
        unknown: {
          description: "Unverified collections - high risk",
          minFloorPrice: "0.1 ETH",
          maxDefaultRate: 0.10,
          minVolume24h: "1 ETH"
        }
      },
      durations: {
        short_term: { riskMultiplier: 1.0, aprBonus: 0.00 },
        medium_term: { riskMultiplier: 1.2, aprBonus: 0.05 },
        long_term: { riskMultiplier: 1.5, aprBonus: 0.10 }
      },
      market_conditions: {
        neutral: { ltvAdjustment: 0, aprAdjustment: 0 }
      },
      dry_run: {
        enabled: true,
        mode: 'simulation',
        log_level: 'minimal',
        simulation_outcomes: {
          success_rate: 0.85,
          default_rate: 0.05,
          avg_repayment_days: 30
        }
      },
      banking_wisdom: [
        { rule: "always_dry_run_in_fallback_mode" }
      ]
    };
  }

  /**
   * Assess loan request against risk policy
   */
  async assessLoan(request: LoanRequest): Promise<RiskAssessment> {
    const collectionPolicy = this.getCollectionPolicy(request.contractAddress);
    const tier = collectionPolicy?.tier || 'unknown';
    const tierPolicy = this.policy.tiers[tier];
    
    let approved = true;
    const reasoning: string[] = [];
    let riskScore = 0;

    // Collection tier validation
    if (!collectionPolicy) {
      approved = false;
      riskScore += 50;
      reasoning.push(`Collection ${request.contractAddress} not in approved whitelist`);
    } else {
      reasoning.push(`Collection approved as ${tier} tier`);
    }

    // Calculate risk-adjusted parameters
    const baseMaxLTV = collectionPolicy?.maxLTV || 0.5;
    const baseAPR = collectionPolicy?.baseAPR || 0.25;
    const maxLoanAmountEth = parseFloat(collectionPolicy?.maxLoanAmount.replace(' ETH', '') || '10');

    // Duration risk adjustment
    const durationCategory = this.getDurationCategory(request.duration);
    const durationPolicy = this.policy.durations[durationCategory];
    const durationRiskMultiplier = durationPolicy?.riskMultiplier || 1.0;
    const durationAPRBonus = durationPolicy?.aprBonus || 0.0;

    // Market condition adjustment (assume neutral for now)
    const marketConditions = this.policy.market_conditions.neutral;
    const ltvAdjustment = marketConditions.ltvAdjustment || 0;
    const aprAdjustment = marketConditions.aprAdjustment || 0;

    // Final calculations
    const recommendedLTV = Math.min(baseMaxLTV + ltvAdjustment, 0.85); // Never exceed 85% LTV
    const adjustedAPR = Math.max(baseAPR + durationAPRBonus + aprAdjustment, 0.10); // Minimum 10% APR
    const maxLoanAmount = Math.min(maxLoanAmountEth, request.requestedAmount * 1.1); // 10% buffer

    // Loan amount validation
    if (request.requestedAmount > maxLoanAmount) {
      riskScore += 25;
      reasoning.push(`Requested amount (${request.requestedAmount} ETH) exceeds policy maximum (${maxLoanAmount} ETH)`);
    }

    // LTV validation (if we have floor price)
    if (request.floorPrice) {
      const requestedLTV = request.requestedAmount / request.floorPrice;
      if (requestedLTV > recommendedLTV) {
        riskScore += 30;
        reasoning.push(`Requested LTV (${(requestedLTV * 100).toFixed(1)}%) exceeds recommended (${(recommendedLTV * 100).toFixed(1)}%)`);
      }
    }

    // Banking wisdom rules validation
    if (riskScore > 75) {
      approved = false;
      reasoning.push('Risk score exceeds acceptable threshold per Medici banking principles');
    }

    // Dry run simulation
    const isDryRun = this.policy.global.defaultDryRun || this.policy.dry_run.enabled;
    let simulatedOutcome;
    
    if (isDryRun) {
      simulatedOutcome = this.simulateLoanOutcome(request, adjustedAPR, riskScore);
      reasoning.push('🔄 DRY RUN MODE: No real transaction will be executed');
    }

    return {
      approved: approved && riskScore < 75,
      recommendedLTV,
      adjustedAPR,
      maxLoanAmount,
      riskScore,
      tier,
      reasoning,
      dryRun: isDryRun,
      simulatedOutcome
    };
  }

  private getCollectionPolicy(contractAddress: string): CollectionPolicy | null {
    for (const [key, policy] of Object.entries(this.policy.collections)) {
      if (policy.address.toLowerCase() === contractAddress.toLowerCase()) {
        return policy;
      }
    }
    return null;
  }

  private getDurationCategory(days: number): string {
    if (days <= 7) return 'short_term';
    if (days <= 30) return 'medium_term';
    return 'long_term';
  }

  private simulateLoanOutcome(request: LoanRequest, apr: number, riskScore: number) {
    const config = this.policy.dry_run.simulation_outcomes;
    const riskAdjustedSuccessRate = config.success_rate - (riskScore / 100) * 0.3;
    
    return {
      wouldSucceed: Math.random() < riskAdjustedSuccessRate,
      projectedRepayment: request.requestedAmount * (1 + apr * (request.duration / 365)),
      riskFactors: [
        `${riskScore}/100 risk score`,
        `${(riskAdjustedSuccessRate * 100).toFixed(1)}% projected success rate`,
        `${config.avg_repayment_days} day average repayment period`
      ]
    };
  }

  /**
   * Get current risk policy status
   */
  getStatus() {
    return {
      policyVersion: this.policy.metadata.version,
      dryRunEnabled: this.policy.dry_run.enabled,
      globalDryRun: this.policy.global.defaultDryRun,
      supportedCollections: Object.keys(this.policy.collections).length,
      reserveRatio: this.policy.global.reserveRatio,
      maxDailyVolume: this.policy.global.maxDailyVolume
    };
  }

  /**
   * Enable/disable dry run mode
   */
  setDryRun(enabled: boolean) {
    this.policy.dry_run.enabled = enabled;
    console.log(`[BART Risk] Dry run mode ${enabled ? 'enabled' : 'disabled'}`);
  }

  /**
   * Reload policy from file
   */
  reloadPolicy() {
    this.loadPolicy();
    console.log('[BART Risk] Policy reloaded successfully');
  }
}

// Export singleton instance
export const bartRiskManager = new BartRiskManager();