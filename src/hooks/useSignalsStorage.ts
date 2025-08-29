/**
 * React Hook for MIYOMI Signals Storage
 * Provides real-time signal management with persistence
 */

import { useState, useEffect, useCallback } from 'react';
import { MarketSignal, signalsStorage, SignalHelpers } from '@/lib/storage/signals-storage';

export function useSignalsStorage() {
  const [signals, setSignals] = useState<MarketSignal[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    byType: {} as Record<MarketSignal['type'], number>,
    bySignificance: {} as Record<MarketSignal['significance'], number>,
    oldestSignal: null as string | null,
    newestSignal: null as string | null
  });

  // Load signals on mount
  useEffect(() => {
    refreshSignals();
  }, []);

  const refreshSignals = useCallback(() => {
    const loadedSignals = signalsStorage.getSignals();
    const loadedStats = signalsStorage.getStats();
    
    setSignals(loadedSignals);
    setStats(loadedStats);
  }, []);

  const addSignal = useCallback((signal: Omit<MarketSignal, 'id' | 'timestamp'>) => {
    const newSignal = signalsStorage.addSignal(signal);
    refreshSignals();
    return newSignal;
  }, [refreshSignals]);

  const getLastSignals = useCallback((count: number = 20) => {
    return signalsStorage.getLastSignals(count);
  }, []);

  const getSignalsByType = useCallback((type: MarketSignal['type']) => {
    return signalsStorage.getSignalsByType(type);
  }, []);

  const getSignalsBySignificance = useCallback((significance: MarketSignal['significance']) => {
    return signalsStorage.getSignalsBySignificance(significance);
  }, []);

  const clearSignals = useCallback(() => {
    signalsStorage.clearSignals();
    refreshSignals();
  }, [refreshSignals]);

  const exportSignals = useCallback(() => {
    return signalsStorage.exportSignals();
  }, []);

  const importSignals = useCallback((jsonData: string) => {
    try {
      signalsStorage.importSignals(jsonData);
      refreshSignals();
      return { success: true, error: null };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to import signals' 
      };
    }
  }, [refreshSignals]);

  // Helper methods for common signal types
  const addPriceUpdateSignal = useCallback((
    market_id: string,
    market_question: string,
    current_price: number,
    price_change: number,
    platform: string,
    category: string
  ) => {
    const signal = SignalHelpers.priceUpdate(
      market_id,
      market_question,
      current_price,
      price_change,
      platform,
      category
    );
    return addSignal(signal);
  }, [addSignal]);

  const addNewPickSignal = useCallback((
    market_id: string,
    market_question: string,
    position: 'YES' | 'NO',
    current_price: number,
    platform: string,
    category: string
  ) => {
    const signal = SignalHelpers.newPick(
      market_id,
      market_question,
      position,
      current_price,
      platform,
      category
    );
    return addSignal(signal);
  }, [addSignal]);

  const addPositionClosedSignal = useCallback((
    market_id: string,
    market_question: string,
    position: 'YES' | 'NO',
    pnl: number,
    current_price: number,
    platform: string,
    category: string
  ) => {
    const signal = SignalHelpers.positionClosed(
      market_id,
      market_question,
      position,
      pnl,
      current_price,
      platform,
      category
    );
    return addSignal(signal);
  }, [addSignal]);

  const addAlertSignal = useCallback((
    market_id: string,
    market_question: string,
    current_price: number,
    platform: string,
    category: string,
    alertData: Record<string, any>
  ) => {
    const signal = SignalHelpers.alert(
      market_id,
      market_question,
      current_price,
      platform,
      category,
      alertData
    );
    return addSignal(signal);
  }, [addSignal]);

  return {
    // State
    signals,
    stats,
    
    // Methods
    addSignal,
    refreshSignals,
    getLastSignals,
    getSignalsByType,
    getSignalsBySignificance,
    clearSignals,
    exportSignals,
    importSignals,
    
    // Helper methods
    addPriceUpdateSignal,
    addNewPickSignal,
    addPositionClosedSignal,
    addAlertSignal
  };
}