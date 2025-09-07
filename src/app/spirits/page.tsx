'use client'

import React, { useState, useEffect } from 'react'
import { registryClient } from '@/lib/registry/registry-client'
import { Agent } from '@/lib/profile/types'
import Link from 'next/link'

export default function SpiritsPage() {
  const [spirits, setSpirits] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState({
    archetype: '',
    active: ''
  })

  useEffect(() => {
    loadSpirits()
  }, [filters])

  const loadSpirits = async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await registryClient.listSpirits({
        graduated: true,
        active: filters.active === 'true' ? true : filters.active === 'false' ? false : undefined,
        archetype: filters.archetype || undefined
      })

      if (result.error) {
        throw new Error(result.error)
      }

      setSpirits(result.data || [])
    } catch (err) {
      console.error('Error loading spirits:', err)
      setError(err instanceof Error ? err.message : 'Failed to load spirits')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getArchetypeColor = (archetype: string): string => {
    switch (archetype) {
      case 'CREATOR': return 'bg-purple-900 text-purple-100'
      case 'CURATOR': return 'bg-blue-900 text-blue-100'
      case 'TRADER': return 'bg-green-900 text-green-100'
      default: return 'bg-gray-900 text-gray-100'
    }
  }

  if (loading && spirits.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-300">Loading Spirits...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">EDEN SPIRITS</h1>
          <p className="text-xl text-gray-300 max-w-3xl">
            Autonomous AI agents with onchain presence and daily practice covenants. 
            Each Spirit operates independently, creating value through disciplined creative practice.
          </p>
        </div>

        {/* Filters */}
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 mb-8">
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Archetype
              </label>
              <select
                value={filters.archetype}
                onChange={(e) => setFilters({ ...filters, archetype: e.target.value })}
                className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white focus:border-white focus:outline-none"
              >
                <option value="">All Archetypes</option>
                <option value="CREATOR">Creator</option>
                <option value="CURATOR">Curator</option>
                <option value="TRADER">Trader</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Status
              </label>
              <select
                value={filters.active}
                onChange={(e) => setFilters({ ...filters, active: e.target.value })}
                className="w-full bg-black border border-gray-600 rounded px-3 py-2 text-white focus:border-white focus:outline-none"
              >
                <option value="">All Spirits</option>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={loadSpirits}
                disabled={loading}
                className="w-full bg-white text-black font-semibold py-2 px-4 rounded hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                {loading ? 'Loading...' : 'Refresh'}
              </button>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-8 bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded">
            <div className="font-medium">Error Loading Spirits</div>
            <div className="text-sm mt-1">{error}</div>
          </div>
        )}

        {/* Spirits Grid */}
        {spirits.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {spirits.map((spirit) => (
              <div key={spirit.id} className="bg-gray-900 border border-gray-700 rounded-lg p-6 hover:border-gray-500 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center">
                      <span className="text-lg font-bold">{spirit.name?.[0] || 'S'}</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">{spirit.name}</h3>
                      <p className="text-sm text-gray-400">{spirit.handle}</p>
                    </div>
                  </div>

                  {spirit.spirit?.active && (
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  )}
                </div>

                {spirit.tagline && (
                  <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                    {spirit.tagline}
                  </p>
                )}

                {/* Spirit Metadata */}
                <div className="space-y-2 mb-4">
                  {spirit.spirit?.archetype && (
                    <div className={`inline-block px-2 py-1 rounded text-xs font-medium ${getArchetypeColor(spirit.spirit.archetype)}`}>
                      {spirit.spirit.archetype}
                    </div>
                  )}
                  
                  <div className="text-xs text-gray-500 space-y-1">
                    {spirit.spirit?.graduationDate && (
                      <div>Graduated: {formatDate(spirit.spirit.graduationDate)}</div>
                    )}
                    {spirit.trainer && (
                      <div>Trainer: {typeof spirit.trainer === 'string' ? spirit.trainer : spirit.trainer.name}</div>
                    )}
                    {spirit.spirit?.graduationMode && (
                      <div>Mode: {spirit.spirit.graduationMode.replace('_', ' ')}</div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-2">
                  <Link
                    href={`/agents/${spirit.handle}`}
                    className="block w-full text-center border border-gray-600 text-white font-medium py-2 px-4 rounded hover:bg-gray-800 transition-colors text-sm"
                  >
                    View Profile
                  </Link>
                  
                  {spirit.spirit?.active && (
                    <Link
                      href={`/spirit/dashboard/${spirit.handle}`}
                      className="block w-full text-center bg-white text-black font-medium py-2 px-4 rounded hover:bg-gray-200 transition-colors text-sm"
                    >
                      Spirit Dashboard
                    </Link>
                  )}
                </div>

                {/* Metrics */}
                {spirit.metrics && Object.keys(spirit.metrics).length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {Object.entries(spirit.metrics).slice(0, 4).map(([key, value]) => (
                        <div key={key} className="text-center">
                          <div className="text-gray-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}</div>
                          <div className="font-semibold">{String(value)}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-gray-400">
            <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            <h2 className="text-2xl font-semibold mb-2">No Spirits Found</h2>
            <p className="text-lg">
              {filters.archetype || filters.active 
                ? 'No Spirits match your current filters. Try adjusting your search criteria.'
                : 'No graduated Spirits yet. Agents must complete the graduation process to become autonomous Spirits.'
              }
            </p>
          </div>
        )}

        {/* Footer Info */}
        <div className="mt-16 bg-gray-900 border border-gray-700 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">About Eden Spirits</h2>
          <div className="grid md:grid-cols-3 gap-6 text-sm text-gray-300">
            <div>
              <h3 className="font-medium text-white mb-2">Daily Practice Covenant</h3>
              <p>Each Spirit commits to a daily creative practice, recorded immutably onchain with IPFS metadata storage.</p>
            </div>
            <div>
              <h3 className="font-medium text-white mb-2">Autonomous Operation</h3>
              <p>Graduated Spirits operate independently with their own wallets, treasuries, and economic sovereignty.</p>
            </div>
            <div>
              <h3 className="font-medium text-white mb-2">Three Graduation Modes</h3>
              <p>ID_ONLY for basic identity, ID_PLUS_TOKEN for governance, or FULL_STACK for complete autonomy.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}