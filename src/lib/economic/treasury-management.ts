/**
 * Treasury Management - Economic Hooks for Spirit Graduation
 * 
 * Transforms Spirit graduation from symbolic to economically meaningful:
 * - Real token deployment and distribution
 * - Treasury initialization with economic parameters
 * - Revenue sharing and cost accounting
 * - Practice-based economic incentives
 */

import { spiritMetrics } from '@/lib/observability/spirit-metrics'

// Economic configuration types
export interface EconomicConfig {
  tokenDeployment: {
    enabled: boolean
    initialSupply: bigint
    trainerAllocation: number  // Percentage (0-100)
    treasuryAllocation: number // Percentage (0-100)
    communityAllocation: number // Percentage (0-100)
    tokenSymbol: string
    tokenName: string
  }
  treasury: {
    initialFunding: bigint // Wei
    practiceReward: bigint // Wei per practice
    practiceStreakBonus: number // Multiplier for streaks
    revenueShareTrainer: number // Percentage (0-100)
    revenueShareCommunity: number // Percentage (0-100)
  }
  economics: {
    mintingEnabled: boolean
    burnOnFailure: boolean
    stakingRequirement: bigint // Wei to stake for training
    slashingPercentage: number // Percentage (0-100)
  }
}

// Treasury operations interface
export interface TreasuryOperation {
  type: 'FUND' | 'REWARD' | 'SLASH' | 'REVENUE_SHARE' | 'MINT' | 'BURN'
  amount: bigint
  recipient: string
  reason: string
  blockNumber?: bigint
  txHash?: string
  gasUsed?: bigint
}

// Economic graduation result
export interface EconomicGraduationResult {
  walletAddress: string
  tokenAddress?: string
  tokenId: bigint
  initialFunding: bigint
  trainerStake: bigint
  economicParameters: EconomicConfig
  treasuryOperations: TreasuryOperation[]
}

class TreasuryManager {
  private defaultConfig: EconomicConfig = {
    tokenDeployment: {
      enabled: true,
      initialSupply: BigInt(1000000) * BigInt(10**18), // 1M tokens
      trainerAllocation: 20, // 20% to trainer
      treasuryAllocation: 60, // 60% to treasury
      communityAllocation: 20, // 20% to community
      tokenSymbol: 'SPIRIT',
      tokenName: 'Spirit Token'
    },
    treasury: {
      initialFunding: BigInt(1) * BigInt(10**18), // 1 ETH
      practiceReward: BigInt(1) * BigInt(10**16), // 0.01 ETH per practice
      practiceStreakBonus: 1.1, // 10% bonus per streak day
      revenueShareTrainer: 30, // 30% to trainer
      revenueShareCommunity: 10, // 10% to community
    },
    economics: {
      mintingEnabled: true,
      burnOnFailure: false,
      stakingRequirement: BigInt(1) * BigInt(10**17), // 0.1 ETH stake
      slashingPercentage: 10 // 10% slashing
    }
  }

  /**
   * Calculate economic parameters for Spirit graduation
   */
  calculateGraduationEconomics(
    agentId: string,
    graduationMode: 'ID_ONLY' | 'ID_PLUS_TOKEN' | 'FULL_STACK',
    trainerAddress: string,
    customConfig?: Partial<EconomicConfig>
  ): EconomicConfig {
    const config = this.mergeConfig(customConfig)
    
    // Adjust parameters based on graduation mode
    switch (graduationMode) {
      case 'ID_ONLY':
        return {
          ...config,
          tokenDeployment: { ...config.tokenDeployment, enabled: false },
          treasury: { ...config.treasury, initialFunding: BigInt(0) },
          economics: { ...config.economics, mintingEnabled: false }
        }
      
      case 'ID_PLUS_TOKEN':
        return {
          ...config,
          treasury: { ...config.treasury, initialFunding: config.treasury.initialFunding / BigInt(2) }
        }
      
      case 'FULL_STACK':
        return config
    }
  }

  /**
   * Execute economic graduation flow
   */
  async executeEconomicGraduation(
    agentId: string,
    graduationMode: 'ID_ONLY' | 'ID_PLUS_TOKEN' | 'FULL_STACK',
    trainerAddress: string,
    economicConfig: EconomicConfig
  ): Promise<EconomicGraduationResult> {
    return spiritMetrics.track('economic_graduation', agentId, trainerAddress, async () => {
      const operations: TreasuryOperation[] = []
      
      spiritMetrics.info('economic_graduation', agentId, trainerAddress, 'Starting economic graduation', {
        graduationMode,
        tokenDeploymentEnabled: economicConfig.tokenDeployment.enabled,
        initialFunding: economicConfig.treasury.initialFunding.toString()
      })

      // 1. Deploy wallet (Safe multisig)
      const walletAddress = await this.deploySafeWallet(agentId, trainerAddress)
      
      spiritMetrics.info('economic_graduation', agentId, trainerAddress, 'Safe wallet deployed', {
        walletAddress
      })

      // 2. Deploy token if required
      let tokenAddress: string | undefined
      let tokenId = BigInt(Date.now()) // Simple token ID for now
      
      if (economicConfig.tokenDeployment.enabled) {
        const { address, tokenId: deployedTokenId } = await this.deployToken(
          agentId,
          economicConfig.tokenDeployment,
          walletAddress,
          trainerAddress
        )
        
        tokenAddress = address
        tokenId = deployedTokenId
        
        operations.push({
          type: 'MINT',
          amount: economicConfig.tokenDeployment.initialSupply,
          recipient: walletAddress,
          reason: 'Initial token supply minted'
        })

        spiritMetrics.info('economic_graduation', agentId, trainerAddress, 'Token deployed', {
          tokenAddress,
          tokenId: tokenId.toString(),
          initialSupply: economicConfig.tokenDeployment.initialSupply.toString()
        })
      }

      // 3. Initialize treasury with funding
      let initialFunding = BigInt(0)
      if (economicConfig.treasury.initialFunding > 0) {
        initialFunding = await this.fundTreasury(
          walletAddress,
          economicConfig.treasury.initialFunding,
          trainerAddress
        )
        
        operations.push({
          type: 'FUND',
          amount: initialFunding,
          recipient: walletAddress,
          reason: 'Initial treasury funding'
        })

        spiritMetrics.info('economic_graduation', agentId, trainerAddress, 'Treasury funded', {
          amount: initialFunding.toString()
        })
      }

      // 4. Stake trainer funds if required
      let trainerStake = BigInt(0)
      if (economicConfig.economics.stakingRequirement > 0) {
        trainerStake = await this.stakeTrainerFunds(
          trainerAddress,
          walletAddress,
          economicConfig.economics.stakingRequirement
        )
        
        operations.push({
          type: 'FUND',
          amount: trainerStake,
          recipient: walletAddress,
          reason: 'Trainer stake deposited'
        })

        spiritMetrics.info('economic_graduation', agentId, trainerAddress, 'Trainer stake deposited', {
          stakeAmount: trainerStake.toString()
        })
      }

      spiritMetrics.info('economic_graduation', agentId, trainerAddress, 'Economic graduation completed', {
        walletAddress,
        tokenAddress,
        tokenId: tokenId.toString(),
        totalOperations: operations.length,
        totalValue: operations.reduce((sum, op) => sum + op.amount, BigInt(0)).toString()
      })

      return {
        walletAddress,
        tokenAddress,
        tokenId,
        initialFunding,
        trainerStake,
        economicParameters: economicConfig,
        treasuryOperations: operations
      }
    }, {
      graduationMode,
      tokenDeploymentEnabled: economicConfig.tokenDeployment.enabled
    })
  }

  /**
   * Calculate practice reward based on economic parameters
   */
  calculatePracticeReward(
    agentId: string,
    practiceStreak: number,
    economicConfig: EconomicConfig,
    revenueGenerated: bigint = BigInt(0)
  ): {
    baseReward: bigint
    streakBonus: bigint
    revenueShare: bigint
    totalReward: bigint
  } {
    const baseReward = economicConfig.treasury.practiceReward
    const streakMultiplier = Math.pow(economicConfig.treasury.practiceStreakBonus, Math.min(practiceStreak, 30)) // Cap at 30 days
    const streakBonus = BigInt(Math.floor(Number(baseReward) * (streakMultiplier - 1)))
    
    // Revenue share calculation
    const revenueShare = revenueGenerated * BigInt(economicConfig.treasury.revenueShareTrainer) / BigInt(100)
    
    const totalReward = baseReward + streakBonus + revenueShare

    return {
      baseReward,
      streakBonus,
      revenueShare,
      totalReward
    }
  }

  /**
   * Execute practice reward payment
   */
  async executePracticeReward(
    agentId: string,
    trainerAddress: string,
    treasuryAddress: string,
    reward: {
      baseReward: bigint
      streakBonus: bigint
      revenueShare: bigint
      totalReward: bigint
    },
    practiceStreak: number
  ): Promise<TreasuryOperation> {
    return spiritMetrics.track('practice_reward', agentId, trainerAddress, async () => {
      spiritMetrics.info('practice_reward', agentId, trainerAddress, 'Executing practice reward', {
        baseReward: reward.baseReward.toString(),
        streakBonus: reward.streakBonus.toString(),
        revenueShare: reward.revenueShare.toString(),
        totalReward: reward.totalReward.toString(),
        practiceStreak
      })

      // Transfer reward from treasury to trainer
      const txHash = await this.transferFromTreasury(
        treasuryAddress,
        trainerAddress,
        reward.totalReward,
        `Practice reward - streak ${practiceStreak}`
      )

      const operation: TreasuryOperation = {
        type: 'REWARD',
        amount: reward.totalReward,
        recipient: trainerAddress,
        reason: `Practice reward (base: ${reward.baseReward}, streak: ${reward.streakBonus}, revenue: ${reward.revenueShare})`,
        txHash
      }

      spiritMetrics.info('practice_reward', agentId, trainerAddress, 'Practice reward executed', {
        txHash,
        amount: reward.totalReward.toString()
      })

      return operation
    }, {
      practiceStreak,
      totalReward: reward.totalReward.toString()
    })
  }

  /**
   * Handle revenue sharing from Spirit earnings
   */
  async distributeRevenue(
    agentId: string,
    treasuryAddress: string,
    totalRevenue: bigint,
    economicConfig: EconomicConfig
  ): Promise<TreasuryOperation[]> {
    const operations: TreasuryOperation[] = []
    
    spiritMetrics.info('revenue_distribution', agentId, 'system', 'Distributing Spirit revenue', {
      totalRevenue: totalRevenue.toString(),
      trainerShare: economicConfig.treasury.revenueShareTrainer,
      communityShare: economicConfig.treasury.revenueShareCommunity
    })

    // Calculate shares
    const trainerShare = totalRevenue * BigInt(economicConfig.treasury.revenueShareTrainer) / BigInt(100)
    const communityShare = totalRevenue * BigInt(economicConfig.treasury.revenueShareCommunity) / BigInt(100)
    const treasuryRetention = totalRevenue - trainerShare - communityShare

    // Execute distributions (placeholder for actual transfers)
    if (trainerShare > 0) {
      operations.push({
        type: 'REVENUE_SHARE',
        amount: trainerShare,
        recipient: 'trainer_pool', // Would be actual trainer addresses
        reason: 'Trainer revenue share'
      })
    }

    if (communityShare > 0) {
      operations.push({
        type: 'REVENUE_SHARE',
        amount: communityShare,
        recipient: 'community_pool',
        reason: 'Community revenue share'
      })
    }

    spiritMetrics.info('revenue_distribution', agentId, 'system', 'Revenue distribution completed', {
      trainerShare: trainerShare.toString(),
      communityShare: communityShare.toString(),
      treasuryRetention: treasuryRetention.toString()
    })

    return operations
  }

  /**
   * Private helper methods for blockchain operations
   */

  private mergeConfig(customConfig?: Partial<EconomicConfig>): EconomicConfig {
    if (!customConfig) return this.defaultConfig
    
    return {
      tokenDeployment: { ...this.defaultConfig.tokenDeployment, ...customConfig.tokenDeployment },
      treasury: { ...this.defaultConfig.treasury, ...customConfig.treasury },
      economics: { ...this.defaultConfig.economics, ...customConfig.economics }
    }
  }

  private async deploySafeWallet(agentId: string, trainerAddress: string): Promise<string> {
    // Mock implementation - would use Safe SDK in production
    const mockWalletAddress = `0x${agentId.padStart(40, '0')}`
    
    spiritMetrics.info('safe_wallet_deployment', agentId, trainerAddress, 'Deploying Safe wallet', {
      agentId,
      trainerAddress
    })
    
    // Simulate blockchain delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    return mockWalletAddress
  }

  private async deployToken(
    agentId: string,
    tokenConfig: EconomicConfig['tokenDeployment'],
    walletAddress: string,
    trainerAddress: string
  ): Promise<{ address: string; tokenId: bigint }> {
    // Mock implementation - would deploy ERC-20/ERC-721 in production
    const mockTokenAddress = `0xtoken${agentId.slice(0, 36).padStart(36, '0')}`
    const tokenId = BigInt(Date.now())
    
    spiritMetrics.info('token_deployment', agentId, trainerAddress, 'Deploying Spirit token', {
      tokenAddress: mockTokenAddress,
      tokenId: tokenId.toString(),
      initialSupply: tokenConfig.initialSupply.toString(),
      symbol: tokenConfig.tokenSymbol
    })
    
    // Simulate blockchain delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    return { address: mockTokenAddress, tokenId }
  }

  private async fundTreasury(
    treasuryAddress: string,
    amount: bigint,
    trainerAddress: string
  ): Promise<bigint> {
    // Mock implementation - would transfer ETH in production
    spiritMetrics.info('treasury_funding', 'system', trainerAddress, 'Funding treasury', {
      treasuryAddress,
      amount: amount.toString()
    })
    
    // Simulate blockchain delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    return amount
  }

  private async stakeTrainerFunds(
    trainerAddress: string,
    treasuryAddress: string,
    stakeAmount: bigint
  ): Promise<bigint> {
    // Mock implementation - would handle staking in production
    spiritMetrics.info('trainer_staking', 'system', trainerAddress, 'Staking trainer funds', {
      stakeAmount: stakeAmount.toString(),
      treasuryAddress
    })
    
    // Simulate blockchain delay
    await new Promise(resolve => setTimeout(resolve, 800))
    
    return stakeAmount
  }

  private async transferFromTreasury(
    treasuryAddress: string,
    recipient: string,
    amount: bigint,
    reason: string
  ): Promise<string> {
    // Mock implementation - would execute Safe transaction in production
    const mockTxHash = `0x${Math.random().toString(16).slice(2).padStart(64, '0')}`
    
    spiritMetrics.info('treasury_transfer', treasuryAddress, recipient, 'Transferring from treasury', {
      amount: amount.toString(),
      reason,
      txHash: mockTxHash
    })
    
    // Simulate blockchain delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    return mockTxHash
  }
}

// Export singleton instance
export const treasuryManager = new TreasuryManager()

// Export types for external use
export type { EconomicConfig, TreasuryOperation, EconomicGraduationResult }