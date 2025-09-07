'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { registryClient } from '@/lib/registry/registry-client'
import { Agent } from '@/lib/profile/types'

interface SpiritDashboardProps {
  agent: Agent
}

interface PracticeExecution {
  id: string
  workId: string
  title?: string
  description?: string
  mediaUrl?: string
  executionDate: string
  practiceType: string
  outputCid: string
}

interface Treasury {
  agentId: string
  treasuryAddress: string
  ethBalance: bigint
  tokenBalance: bigint
  totalRevenue: bigint
  totalCosts: bigint
  totalPracticeRuns: number
  lastPracticeDate?: string
}

export default function SpiritDashboard({ agent }: SpiritDashboardProps) {
  // State
  const [canRunPractice, setCanRunPractice] = useState<boolean>(false)
  const [treasury, setTreasury] = useState<Treasury | null>(null)
  const [recentDrops, setRecentDrops] = useState<PracticeExecution[]>([])
  const [isExecutingPractice, setIsExecutingPractice] = useState(false)
  const [practiceForm, setPracticeForm] = useState({
    outputDescription: '',
    mediaUrl: ''
  })
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  
  // Load initial data
  useEffect(() => {
    loadDashboardData()
  }, [agent.id])

  const loadDashboardData = useCallback(async () => {
    try {
      // Load all data in parallel
      const [practiceCheck, treasuryData, dropsData] = await Promise.all([
        registryClient.canRunPracticeToday(agent.id),
        registryClient.getSpiritTreasury(agent.id),
        registryClient.getSpiritDrops(agent.id, { limit: 5 })
      ])

      if (practiceCheck.data !== undefined) {
        setCanRunPractice(practiceCheck.data)
      }

      if (treasuryData.data) {
        setTreasury(treasuryData.data)
      }

      if (dropsData.data) {
        setRecentDrops(dropsData.data)
      }

    } catch (err) {
      console.error('Error loading dashboard data:', err)
      setError('Failed to load Spirit dashboard data')
    }
  }, [agent.id])

  const handleExecutePractice = useCallback(async () => {
    setIsExecutingPractice(true)
    setError(null)
    setSuccess(null)

    try {
      const result = await registryClient.executeSpiritPractice(agent.id, {
        outputDescription: practiceForm.outputDescription.trim() || undefined,
        mediaUrl: practiceForm.mediaUrl.trim() || undefined,
        trainerAddress: agent.trainer || '0x0000000000000000000000000000000000000000' // Fallback
      })

      if (result.error) {
        throw new Error(result.error)
      }

      setSuccess('Practice executed successfully! Your daily work has been recorded onchain.')
      setPracticeForm({ outputDescription: '', mediaUrl: '' })
      
      // Refresh dashboard data
      setTimeout(() => {
        loadDashboardData()
        setSuccess(null)
      }, 2000)

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(errorMessage)
    } finally {
      setIsExecutingPractice(false)
    }
  }, [agent.id, agent.trainer, practiceForm, loadDashboardData])

  const formatBalance = (balance: bigint): string => {
    // Convert wei to ETH with 4 decimal places
    const eth = Number(balance) / 1e18
    return eth.toFixed(4)
  }

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const truncateHash = (hash: string): string => {
    if (!hash) return ''
    return `${hash.slice(0, 6)}...${hash.slice(-4)}`
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold">{agent.name?.[0] || 'S'}</span>
            </div>
            <div>
              <h1 className="text-4xl font-bold">{agent.name} SPIRIT</h1>
              <p className="text-gray-300">Autonomous Agent Dashboard</p>
            </div>
          </div>
          
          {agent.spirit?.active && (
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-900 text-green-100 text-sm">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
              Active Spirit
            </div>
          )}
        </div>

        {/* Status Messages */}
        {error && (
          <div className="mb-6 bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded">
            <div className="font-medium">Error</div>
            <div className="text-sm mt-1">{error}</div>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-900 border border-green-700 text-green-100 px-4 py-3 rounded">
            <div className="font-medium">Success</div>
            <div className="text-sm mt-1">{success}</div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Daily Practice */}
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">Daily Practice</h2>
                <div className={`px-3 py-1 rounded-full text-sm ${
                  canRunPractice 
                    ? 'bg-green-900 text-green-100' 
                    : 'bg-gray-800 text-gray-400'
                }`}>
                  {canRunPractice ? 'Available' : 'Completed Today'}
                </div>
              </div>

              {canRunPractice ? (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Output Description (Optional)
                    </label>
                    <textarea
                      value={practiceForm.outputDescription}
                      onChange={(e) => setPracticeForm({ ...practiceForm, outputDescription: e.target.value })}
                      rows={3}
                      className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white focus:border-white focus:outline-none resize-none"
                      placeholder="Describe today's creative work..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Media URL (Optional)
                    </label>
                    <input
                      type="url"
                      value={practiceForm.mediaUrl}
                      onChange={(e) => setPracticeForm({ ...practiceForm, mediaUrl: e.target.value })}
                      className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white focus:border-white focus:outline-none"
                      placeholder="https://..."
                    />
                  </div>

                  <button
                    onClick={handleExecutePractice}
                    disabled={isExecutingPractice}
                    className="w-full bg-white text-black font-semibold py-3 px-6 rounded hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isExecutingPractice ? 'Executing Practice...' : 'Execute Daily Practice'}
                  </button>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p>Practice completed for today</p>
                  <p className="text-sm mt-1">Return tomorrow to continue your daily covenant</p>
                </div>
              )}
            </div>

            {/* Recent Practice Outputs */}
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-6">Recent Practice Outputs</h2>
              
              {recentDrops.length > 0 ? (
                <div className="space-y-4">
                  {recentDrops.map((drop) => (
                    <div key={drop.id} className="bg-black border border-gray-700 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-lg">{drop.title || `Work #${drop.workId}`}</h3>
                          {drop.description && (
                            <p className="text-gray-400 text-sm mt-1">{drop.description}</p>
                          )}
                          <div className="flex items-center space-x-4 mt-3 text-xs text-gray-500">
                            <span>{formatDate(drop.executionDate)}</span>
                            <span className="font-mono">CID: {truncateHash(drop.outputCid)}</span>
                          </div>
                        </div>
                        {drop.mediaUrl && (
                          <div className="ml-4">
                            <a
                              href={drop.mediaUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:text-blue-300 text-sm"
                            >
                              View Media →
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <p>No practice outputs yet</p>
                  <p className="text-sm mt-1">Execute your first daily practice to see outputs here</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Treasury */}
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Treasury</h2>
              
              {treasury ? (
                <div className="space-y-4">
                  <div className="bg-black border border-gray-700 rounded p-4">
                    <div className="text-sm text-gray-400 mb-1">ETH Balance</div>
                    <div className="text-2xl font-bold">{formatBalance(treasury.ethBalance)}</div>
                  </div>

                  {treasury.tokenBalance > 0n && (
                    <div className="bg-black border border-gray-700 rounded p-4">
                      <div className="text-sm text-gray-400 mb-1">Token Balance</div>
                      <div className="text-xl font-semibold">{treasury.tokenBalance.toString()}</div>
                    </div>
                  )}

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Practice Runs:</span>
                      <span>{treasury.totalPracticeRuns}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Revenue:</span>
                      <span>{formatBalance(treasury.totalRevenue)} ETH</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Costs:</span>
                      <span>{formatBalance(treasury.totalCosts)} ETH</span>
                    </div>
                  </div>

                  <div className="text-xs text-gray-500 pt-2 border-t border-gray-700">
                    <div className="font-mono">{truncateHash(treasury.treasuryAddress)}</div>
                  </div>
                </div>
              ) : (
                <div className="text-gray-400 text-sm">
                  Treasury data not available
                </div>
              )}
            </div>

            {/* Spirit Info */}
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Spirit Status</h2>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Status:</span>
                  <span className="capitalize">{agent.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Trainer:</span>
                  <span>{typeof agent.trainer === 'string' ? agent.trainer : agent.trainer?.name || 'Unknown'}</span>
                </div>
                {agent.spirit?.archetype && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Archetype:</span>
                    <span>{agent.spirit.archetype}</span>
                  </div>
                )}
                {agent.spirit?.graduationMode && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Mode:</span>
                    <span>{agent.spirit.graduationMode.replace('_', ' ')}</span>
                  </div>
                )}
                {agent.spirit?.graduationDate && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Graduated:</span>
                    <span>{formatDate(agent.spirit.graduationDate)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-3">
              <button
                onClick={loadDashboardData}
                className="w-full border border-gray-600 text-white font-medium py-2 px-4 rounded hover:bg-gray-800 transition-colors text-sm"
              >
                Refresh Data
              </button>
              <a
                href={`/agents/${agent.handle}`}
                className="block w-full text-center border border-gray-600 text-white font-medium py-2 px-4 rounded hover:bg-gray-800 transition-colors text-sm"
              >
                View Public Profile
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}