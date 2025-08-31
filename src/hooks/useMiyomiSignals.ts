// Hook to access MIYOMI signals from localStorage or state
import { useState, useEffect } from 'react'

export interface MiyomiSignal {
  id: string
  type: 'PRICE_UPDATE' | 'NEW_PICK' | 'POSITION_CLOSED' | 'ALERT'
  message: string
  timestamp: number
  significance: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  data?: {
    market?: string
    prediction?: string
    confidence?: number
    price?: number
    change?: number
  }
}

export function useMiyomiSignals() {
  const [signals, setSignals] = useState<MiyomiSignal[]>([])
  
  useEffect(() => {
    // Load signals from localStorage
    const loadSignals = () => {
      try {
        const stored = localStorage.getItem('miyomi_signals')
        if (stored) {
          const parsed = JSON.parse(stored)
          setSignals(Array.isArray(parsed) ? parsed : [])
        }
      } catch (err) {
        console.error('Failed to load signals:', err)
      }
    }
    
    loadSignals()
    
    // Listen for storage events (cross-tab sync)
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'miyomi_signals') {
        loadSignals()
      }
    }
    
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])
  
  // Add demo signals if empty
  useEffect(() => {
    if (signals.length === 0) {
      const demoSignals: MiyomiSignal[] = [
        {
          id: '1',
          type: 'NEW_PICK',
          message: 'Contrarian call: Fed pivot unlikely before Q2',
          timestamp: Date.now() - 3600000,
          significance: 'HIGH',
          data: {
            market: 'Fed Rate Decision',
            prediction: 'NO PIVOT',
            confidence: 78
          }
        },
        {
          id: '2',
          type: 'POSITION_CLOSED',
          message: 'Closed: Bitcoin >$100k by EOY',
          timestamp: Date.now() - 7200000,
          significance: 'MEDIUM',
          data: {
            market: 'BTC Price',
            prediction: 'WIN',
            confidence: 82
          }
        }
      ]
      setSignals(demoSignals)
    }
  }, [signals.length])
  
  return { signals }
}