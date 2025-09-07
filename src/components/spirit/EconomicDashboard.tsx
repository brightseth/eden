'use client'

import React, { useState, useEffect } from 'react'
import { Agent } from '@/lib/profile/types'
import { EconomicConfig, TreasuryOperation } from '@/lib/economic/treasury-management'

interface EconomicDashboardProps {
  agent: Agent
  economicConfig?: EconomicConfig
  treasuryOperations?: TreasuryOperation[]
}

interface EconomicMetrics {
  totalValue: bigint
  totalRewards: bigint
  practiceStreak: number
  revenueGenerated: bigint
  stakingBalance: bigint
  tokenBalance: bigint
  nextRewardAmount: bigint
  projectedMonthlyReturn: bigint
}

export default function EconomicDashboard({ 
  agent, 
  economicConfig, 
  treasuryOperations = [] 
}: EconomicDashboardProps) {
  const [metrics, setMetrics] = useState<EconomicMetrics>({
    totalValue: BigInt(0),
    totalRewards: BigInt(0),
    practiceStreak: 0,
    revenueGenerated: BigInt(0),
    stakingBalance: BigInt(0),
    tokenBalance: BigInt(0),
    nextRewardAmount: BigInt(0),
    projectedMonthlyReturn: BigInt(0)
  })
  const [selectedOperation, setSelectedOperation] = useState<TreasuryOperation | null>(null)

  useEffect(() => {
    calculateMetrics()
  }, [treasuryOperations, economicConfig])

  const calculateMetrics = () => {
    if (!economicConfig) return

    // Calculate total value from operations
    const totalValue = treasuryOperations
      .filter(op => op.type === 'FUND')
      .reduce((sum, op) => sum + op.amount, BigInt(0))

    // Calculate total rewards distributed
    const totalRewards = treasuryOperations
      .filter(op => op.type === 'REWARD')
      .reduce((sum, op) => sum + op.amount, BigInt(0))

    // Mock practice streak calculation
    const practiceStreak = Math.floor(Math.random() * 30) + 1

    // Calculate next reward amount
    const baseReward = economicConfig.treasury.practiceReward
    const streakMultiplier = Math.pow(economicConfig.treasury.practiceStreakBonus, practiceStreak)
    const nextRewardAmount = BigInt(Math.floor(Number(baseReward) * streakMultiplier))

    // Project monthly return (30 days of rewards)
    const projectedMonthlyReturn = nextRewardAmount * BigInt(30)

    setMetrics({
      totalValue,
      totalRewards,
      practiceStreak,
      revenueGenerated: BigInt(0), // Would come from actual revenue tracking
      stakingBalance: economicConfig.economics.stakingRequirement,
      tokenBalance: economicConfig.tokenDeployment.enabled 
        ? economicConfig.tokenDeployment.initialSupply 
        : BigInt(0),
      nextRewardAmount,
      projectedMonthlyReturn
    })
  }

  const formatETH = (wei: bigint): string => {
    const eth = Number(wei) / 1e18
    return eth.toFixed(4)
  }

  const formatTokens = (amount: bigint): string => {
    const tokens = Number(amount) / 1e18
    return tokens.toLocaleString()
  }

  const formatUSD = (wei: bigint, ethPrice: number = 2500): string => {
    const eth = Number(wei) / 1e18
    const usd = eth * ethPrice
    return usd.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD'
    })
  }

  const getOperationColor = (type: TreasuryOperation['type']): string => {
    switch (type) {
      case 'FUND': return 'text-blue-400'
      case 'REWARD': return 'text-green-400'
      case 'REVENUE_SHARE': return 'text-purple-400'
      case 'MINT': return 'text-yellow-400'
      case 'SLASH': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  const calculateROI = (): number => {
    if (metrics.stakingBalance === BigInt(0)) return 0
    const monthlyReturn = Number(metrics.projectedMonthlyReturn)
    const staked = Number(metrics.stakingBalance)
    return (monthlyReturn / staked) * 100
  }

  return (
    <div className="bg-black text-white min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{agent.name} ECONOMIC DASHBOARD</h1>
          <p className="text-gray-400">Real-time financial metrics and treasury operations</p>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Treasury Value */}
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-400">Total Treasury Value</h3>
              <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
            </div>
            <div className="text-2xl font-bold">{formatETH(metrics.totalValue)} ETH</div>
            <div className="text-sm text-gray-500 mt-1">{formatUSD(metrics.totalValue)}</div>
          </div>

          {/* Total Rewards Earned */}
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-400">Rewards Earned</h3>
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            </div>
            <div className="text-2xl font-bold">{formatETH(metrics.totalRewards)} ETH</div>
            <div className="text-sm text-gray-500 mt-1">{formatUSD(metrics.totalRewards)}</div>
          </div>

          {/* Practice Streak */}
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-400">Practice Streak</h3>
              <div className="w-3 h-3 bg-orange-400 rounded-full animate-pulse"></div>
            </div>
            <div className="text-2xl font-bold">{metrics.practiceStreak} Days</div>
            <div className="text-sm text-gray-500 mt-1">
              {(((Math.pow(economicConfig?.treasury.practiceStreakBonus || 1.1, metrics.practiceStreak) - 1) * 100)).toFixed(1)}% Bonus
            </div>
          </div>

          {/* Monthly ROI Projection */}
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-400">Monthly ROI</h3>
              <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
            </div>
            <div className="text-2xl font-bold">{calculateROI().toFixed(1)}%</div>
            <div className="text-sm text-gray-500 mt-1">{formatETH(metrics.projectedMonthlyReturn)} ETH/mo</div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Economic Configuration */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-6">Economic Parameters</h2>
              
              {economicConfig && (
                <div className="space-y-4">
                  {/* Token Configuration */}
                  {economicConfig.tokenDeployment.enabled && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-400 mb-2">Token Deployment</h3>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Symbol:</span>
                          <span className="font-mono">{economicConfig.tokenDeployment.tokenSymbol}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Supply:</span>
                          <span>{formatTokens(economicConfig.tokenDeployment.initialSupply)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Trainer Share:</span>
                          <span>{economicConfig.tokenDeployment.trainerAllocation}%</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Treasury Configuration */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-400 mb-2">Treasury Rules</h3>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Practice Reward:</span>
                        <span>{formatETH(economicConfig.treasury.practiceReward)} ETH</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Streak Bonus:</span>
                        <span>{((economicConfig.treasury.practiceStreakBonus - 1) * 100).toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Revenue Share:</span>
                        <span>{economicConfig.treasury.revenueShareTrainer}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Economic Rules */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-400 mb-2">Economic Rules</h3>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Staking Required:</span>
                        <span>{formatETH(economicConfig.economics.stakingRequirement)} ETH</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Slashing Rate:</span>
                        <span>{economicConfig.economics.slashingPercentage}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Minting:</span>
                        <span className={economicConfig.economics.mintingEnabled ? 'text-green-400' : 'text-red-400'}>
                          {economicConfig.economics.mintingEnabled ? 'Enabled' : 'Disabled'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Next Reward Calculation */}
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 mt-6">
              <h2 className="text-xl font-semibold mb-4">Next Practice Reward</h2>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Base Reward:</span>
                  <span>{formatETH(economicConfig?.treasury.practiceReward || BigInt(0))} ETH</span>
                </div>
                <div className="flex justify-between">
                  <span>Streak Multiplier:</span>
                  <span>{Math.pow(economicConfig?.treasury.practiceStreakBonus || 1.1, metrics.practiceStreak).toFixed(2)}x</span>
                </div>
                <div className="border-t border-gray-700 pt-3 flex justify-between font-semibold">
                  <span>Total Reward:</span>
                  <span className="text-green-400">{formatETH(metrics.nextRewardAmount)} ETH</span>
                </div>
                <div className="text-xs text-gray-500">
                  ≈ {formatUSD(metrics.nextRewardAmount)}
                </div>
              </div>

              <div className="mt-4 p-3 bg-green-900/20 border border-green-700 rounded text-center">
                <div className="text-xs text-green-400 mb-1">Monthly Projection</div>
                <div className="font-semibold">{formatETH(metrics.projectedMonthlyReturn)} ETH</div>
              </div>
            </div>
          </div>

          {/* Treasury Operations */}
          <div className="lg:col-span-2">
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Treasury Operations</h2>
                <div className="text-sm text-gray-400">
                  {treasuryOperations.length} Total Operations
                </div>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {treasuryOperations.length > 0 ? treasuryOperations.map((operation, index) => (
                  <div 
                    key={index}
                    className="bg-black border border-gray-700 rounded-lg p-4 cursor-pointer hover:border-gray-500 transition-colors"
                    onClick={() => setSelectedOperation(operation)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <span className={`font-medium ${getOperationColor(operation.type)}`}>
                            {operation.type.replace('_', ' ')}
                          </span>
                          <span className="text-sm text-gray-500">
                            {formatETH(operation.amount)} ETH
                          </span>
                        </div>
                        <div className="text-sm text-gray-400 mt-1">
                          {operation.reason}
                        </div>
                        <div className="text-xs text-gray-500 mt-2 flex items-center space-x-4">
                          <span>To: {operation.recipient}</span>
                          {operation.txHash && (
                            <span className="font-mono">
                              {operation.txHash.slice(0, 10)}...
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatUSD(operation.amount)}
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-12 text-gray-400">
                    <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium mb-2">No Treasury Operations</h3>
                    <p>Operations will appear here as the Spirit executes practices and receives rewards.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Operation Detail Modal */}
        {selectedOperation && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 max-w-md w-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Operation Details</h3>
                <button
                  onClick={() => setSelectedOperation(null)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Type:</span>
                  <span className={getOperationColor(selectedOperation.type)}>
                    {selectedOperation.type.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Amount:</span>
                  <span>{formatETH(selectedOperation.amount)} ETH</span>
                </div>
                <div className="flex justify-between">
                  <span>USD Value:</span>
                  <span>{formatUSD(selectedOperation.amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Recipient:</span>
                  <span className="font-mono text-xs">{selectedOperation.recipient}</span>
                </div>
                {selectedOperation.txHash && (
                  <div className="flex justify-between">
                    <span>Transaction:</span>
                    <span className="font-mono text-xs">{selectedOperation.txHash}</span>
                  </div>
                )}
                <div className="border-t border-gray-700 pt-3">
                  <span className="text-gray-400">Reason:</span>
                  <div className="mt-1">{selectedOperation.reason}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}