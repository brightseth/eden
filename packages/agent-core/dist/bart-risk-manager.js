"use strict";
/**
 * BART Risk Management System
 * Implements Renaissance banking principles with modern risk controls
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.bartRiskManager = exports.BartRiskManager = void 0;
const yaml = __importStar(require("js-yaml"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class BartRiskManager {
    constructor(policyPath) {
        this.policyPath = policyPath || path.join(__dirname, 'bart-risk-policy.yaml');
        this.loadPolicy();
    }
    loadPolicy() {
        try {
            const policyContent = fs.readFileSync(this.policyPath, 'utf8');
            this.policy = yaml.load(policyContent);
            console.log(`[BART Risk] Loaded policy: ${this.policy.metadata.name} v${this.policy.metadata.version}`);
        }
        catch (error) {
            console.error('[BART Risk] Failed to load risk policy:', error);
            throw new Error('Risk policy configuration required');
        }
    }
    /**
     * Assess loan request against risk policy
     */
    async assessLoan(request) {
        const collectionPolicy = this.getCollectionPolicy(request.contractAddress);
        const tier = collectionPolicy?.tier || 'unknown';
        const tierPolicy = this.policy.tiers[tier];
        let approved = true;
        const reasoning = [];
        let riskScore = 0;
        // Collection tier validation
        if (!collectionPolicy) {
            approved = false;
            riskScore += 50;
            reasoning.push(`Collection ${request.contractAddress} not in approved whitelist`);
        }
        else {
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
    getCollectionPolicy(contractAddress) {
        for (const [key, policy] of Object.entries(this.policy.collections)) {
            if (policy.address.toLowerCase() === contractAddress.toLowerCase()) {
                return policy;
            }
        }
        return null;
    }
    getDurationCategory(days) {
        if (days <= 7)
            return 'short_term';
        if (days <= 30)
            return 'medium_term';
        return 'long_term';
    }
    simulateLoanOutcome(request, apr, riskScore) {
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
    setDryRun(enabled) {
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
exports.BartRiskManager = BartRiskManager;
// Export singleton instance
exports.bartRiskManager = new BartRiskManager();
