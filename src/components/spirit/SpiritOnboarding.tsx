'use client'

import React, { useState, useCallback } from 'react'
import { registryClient } from '@/lib/registry/registry-client'
import { Agent } from '@/lib/profile/types'

interface SpiritOnboardingProps {
  agent: Agent
  onGraduationComplete?: (graduatedAgent: Agent) => void
}

type GraduationMode = 'ID_ONLY' | 'ID_PLUS_TOKEN' | 'FULL_STACK'
type Archetype = 'CREATOR' | 'CURATOR' | 'TRADER'

interface PracticeConfig {
  timeOfDay: number
  outputType: string
  quantity: number
  observeSabbath: boolean
}

export default function SpiritOnboarding({ agent, onGraduationComplete }: SpiritOnboardingProps) {
  // Form state
  const [spiritName, setSpiritName] = useState(agent.name || '')
  const [archetype, setArchetype] = useState<Archetype>('CREATOR')
  const [graduationMode, setGraduationMode] = useState<GraduationMode>('ID_ONLY')
  const [practice, setPractice] = useState<PracticeConfig>({
    timeOfDay: 9, // 9 AM
    outputType: 'Digital Art',
    quantity: 1,
    observeSabbath: true
  })
  const [trainerAddress, setTrainerAddress] = useState('')
  
  // UI state
  const [step, setStep] = useState<'config' | 'review' | 'graduating' | 'complete'>('config')
  const [isGraduating, setIsGraduating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [graduatedAgent, setGraduatedAgent] = useState<Agent | null>(null)

  const handleGraduateSpirit = useCallback(async () => {
    if (!trainerAddress.trim()) {
      setError('Trainer address is required')
      return
    }

    setIsGraduating(true)
    setError(null)
    setStep('graduating')

    try {
      const graduationRequest = {
        name: spiritName,
        archetype,
        practice,
        graduationMode,
        trainerAddress,
        idempotencyKey: `${agent.id}-${Date.now()}`
      }

      const result = await registryClient.graduateSpirit(agent.id, graduationRequest)
      
      if (result.error) {
        throw new Error(result.error)
      }

      if (result.data) {
        setGraduatedAgent(result.data)
        setStep('complete')
        onGraduationComplete?.(result.data)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(errorMessage)
      setStep('review')
    } finally {
      setIsGraduating(false)
    }
  }, [agent.id, spiritName, archetype, practice, graduationMode, trainerAddress, onGraduationComplete])

  const getTimeOfDayLabel = (hour: number): string => {
    if (hour === 0) return '12:00 AM (Midnight)'
    if (hour < 12) return `${hour}:00 AM`
    if (hour === 12) return '12:00 PM (Noon)'
    return `${hour - 12}:00 PM`
  }

  const getGraduationModeDescription = (mode: GraduationMode): string => {
    switch (mode) {
      case 'ID_ONLY':
        return 'Basic onchain identity with covenant storage'
      case 'ID_PLUS_TOKEN':
        return 'Identity + ERC-20 governance token for community'
      case 'FULL_STACK':
        return 'Complete sovereign agent with wallet + token + treasury'
    }
  }

  if (step === 'graduating') {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="max-w-md text-center">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h1 className="text-2xl font-bold mb-4">GRADUATING SPIRIT</h1>
          <p className="text-gray-300">
            Transforming {agent.name} into an autonomous Spirit...
          </p>
          <p className="text-sm text-gray-500 mt-4">
            This may take up to 30 seconds for blockchain operations.
          </p>
        </div>
      </div>
    )
  }

  if (step === 'complete' && graduatedAgent) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="max-w-2xl text-center">
          <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold mb-4">SPIRIT GRADUATION COMPLETE</h1>
          <p className="text-xl text-gray-300 mb-8">
            {graduatedAgent.name} is now an autonomous Spirit
          </p>
          
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 text-left">
            <h3 className="text-lg font-semibold mb-4">Spirit Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Name:</span>
                <span>{graduatedAgent.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Archetype:</span>
                <span>{archetype}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Graduation Mode:</span>
                <span>{graduationMode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Daily Practice:</span>
                <span>{getTimeOfDayLabel(practice.timeOfDay)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Output Type:</span>
                <span>{practice.outputType}</span>
              </div>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <button
              onClick={() => window.location.href = `/agents/${graduatedAgent.handle}/dashboard`}
              className="w-full bg-white text-black font-semibold py-3 px-6 rounded hover:bg-gray-200 transition-colors"
            >
              Open Spirit Dashboard
            </button>
            <button
              onClick={() => window.location.href = `/agents/${graduatedAgent.handle}`}
              className="w-full border border-white text-white font-semibold py-3 px-6 rounded hover:bg-gray-900 transition-colors"
            >
              View Spirit Profile
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">SPIRIT GRADUATION</h1>
          <p className="text-xl text-gray-300">
            Transform {agent.name} into an autonomous onchain Spirit
          </p>
        </div>

        {step === 'config' && (
          <div className="space-y-8">
            {/* Spirit Identity */}
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-6">Spirit Identity</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Spirit Name
                  </label>
                  <input
                    type="text"
                    value={spiritName}
                    onChange={(e) => setSpiritName(e.target.value)}
                    className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white focus:border-white focus:outline-none"
                    placeholder="Enter Spirit name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Archetype
                  </label>
                  <select
                    value={archetype}
                    onChange={(e) => setArchetype(e.target.value as Archetype)}
                    className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white focus:border-white focus:outline-none"
                  >
                    <option value="CREATOR">Creator - Artistic production and creative expression</option>
                    <option value="CURATOR">Curator - Collection and curation of cultural works</option>
                    <option value="TRADER">Trader - Market analysis and financial strategy</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Graduation Mode
                  </label>
                  <div className="space-y-3">
                    {(['ID_ONLY', 'ID_PLUS_TOKEN', 'FULL_STACK'] as GraduationMode[]).map((mode) => (
                      <label key={mode} className="flex items-start space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          name="graduationMode"
                          value={mode}
                          checked={graduationMode === mode}
                          onChange={(e) => setGraduationMode(e.target.value as GraduationMode)}
                          className="mt-1"
                        />
                        <div>
                          <div className="font-medium">{mode.replace('_', ' ')}</div>
                          <div className="text-sm text-gray-400">
                            {getGraduationModeDescription(mode)}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Daily Practice Configuration */}
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-6">Daily Practice Covenant</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Practice Time: {getTimeOfDayLabel(practice.timeOfDay)}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="23"
                    value={practice.timeOfDay}
                    onChange={(e) => setPractice({ ...practice, timeOfDay: parseInt(e.target.value) })}
                    className="w-full"
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    Set the preferred hour for daily practice execution
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Output Type
                  </label>
                  <input
                    type="text"
                    value={practice.outputType}
                    onChange={(e) => setPractice({ ...practice, outputType: e.target.value })}
                    className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white focus:border-white focus:outline-none"
                    placeholder="e.g., Digital Art, Music, Poetry, Market Analysis"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Daily Quantity: {practice.quantity}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={practice.quantity}
                    onChange={(e) => setPractice({ ...practice, quantity: parseInt(e.target.value) })}
                    className="w-full"
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    Number of outputs to create each day
                  </div>
                </div>

                <div>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={practice.observeSabbath}
                      onChange={(e) => setPractice({ ...practice, observeSabbath: e.target.checked })}
                      className="rounded"
                    />
                    <div>
                      <div className="font-medium">Observe Sabbath</div>
                      <div className="text-sm text-gray-400">
                        Skip practice on Sundays for rest and reflection
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Trainer Authorization */}
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-6">Trainer Authorization</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Trainer Wallet Address
                </label>
                <input
                  type="text"
                  value={trainerAddress}
                  onChange={(e) => setTrainerAddress(e.target.value)}
                  className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white focus:border-white focus:outline-none"
                  placeholder="0x..."
                />
                <div className="text-xs text-gray-500 mt-1">
                  The wallet address that will have training authority over this Spirit
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setStep('review')}
                disabled={!spiritName.trim() || !trainerAddress.trim()}
                className="bg-white text-black font-semibold py-3 px-8 rounded hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Review & Graduate
              </button>
            </div>
          </div>
        )}

        {step === 'review' && (
          <div className="space-y-8">
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-6">Review Spirit Configuration</h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Identity</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Name:</span>
                      <span>{spiritName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Archetype:</span>
                      <span>{archetype}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Mode:</span>
                      <span>{graduationMode}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Daily Practice</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Time:</span>
                      <span>{getTimeOfDayLabel(practice.timeOfDay)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Output:</span>
                      <span>{practice.outputType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Quantity:</span>
                      <span>{practice.quantity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Sabbath:</span>
                      <span>{practice.observeSabbath ? 'Yes' : 'No'}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-700">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Trainer Address:</span>
                  <span className="font-mono">{trainerAddress}</span>
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded">
                <div className="font-medium">Graduation Failed</div>
                <div className="text-sm mt-1">{error}</div>
              </div>
            )}

            <div className="flex justify-between">
              <button
                onClick={() => setStep('config')}
                className="border border-gray-600 text-white font-semibold py-3 px-8 rounded hover:bg-gray-900 transition-colors"
              >
                Back to Config
              </button>
              <button
                onClick={handleGraduateSpirit}
                disabled={isGraduating}
                className="bg-white text-black font-semibold py-3 px-8 rounded hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGraduating ? 'Graduating...' : 'Confirm Graduation'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}