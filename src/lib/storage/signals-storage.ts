/**
 * Persistent Storage for MIYOMI Market Signals
 * Manages "last 20 signals" with browser localStorage fallback
 */

export interface MarketSignal {
  id: string;
  timestamp: string;
  type: 'PRICE_UPDATE' | 'NEW_PICK' | 'POSITION_CLOSED' | 'ALERT';
  market_id: string;
  market_question: string;
  position?: 'YES' | 'NO';
  price_change?: number;
  current_price: number;
  pnl?: number;
  platform: string;
  category: string;
  significance: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  data: Record<string, any>;
}

export class SignalsStorage {
  private storageKey = 'miyomi_market_signals';
  private maxSignals = 20;

  /**
   * Get all stored signals, most recent first
   */
  getSignals(): MarketSignal[] {
    try {
      if (typeof window === 'undefined') return [];
      
      const stored = localStorage.getItem(this.storageKey);
      if (!stored) return [];
      
      const signals = JSON.parse(stored) as MarketSignal[];
      return signals.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
    } catch (error) {
      console.error('Failed to load signals:', error);
      return [];
    }
  }

  /**
   * Add new signal, maintaining max limit
   */
  addSignal(signal: Omit<MarketSignal, 'id' | 'timestamp'>): MarketSignal {
    const newSignal: MarketSignal = {
      ...signal,
      id: `signal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString()
    };

    try {
      const existing = this.getSignals();
      const updated = [newSignal, ...existing].slice(0, this.maxSignals);
      
      if (typeof window !== 'undefined') {
        localStorage.setItem(this.storageKey, JSON.stringify(updated));
      }
      
      return newSignal;
    } catch (error) {
      console.error('Failed to save signal:', error);
      return newSignal;
    }
  }

  /**
   * Get last N signals (default 20)
   */
  getLastSignals(count: number = 20): MarketSignal[] {
    return this.getSignals().slice(0, count);
  }

  /**
   * Get signals by type
   */
  getSignalsByType(type: MarketSignal['type']): MarketSignal[] {
    return this.getSignals().filter(signal => signal.type === type);
  }

  /**
   * Get signals by significance level
   */
  getSignalsBySignificance(significance: MarketSignal['significance']): MarketSignal[] {
    return this.getSignals().filter(signal => signal.significance === significance);
  }

  /**
   * Clear all signals
   */
  clearSignals(): void {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(this.storageKey);
      }
    } catch (error) {
      console.error('Failed to clear signals:', error);
    }
  }

  /**
   * Get storage stats
   */
  getStats(): {
    total: number;
    byType: Record<MarketSignal['type'], number>;
    bySignificance: Record<MarketSignal['significance'], number>;
    oldestSignal: string | null;
    newestSignal: string | null;
  } {
    const signals = this.getSignals();
    
    const byType = signals.reduce((acc, signal) => {
      acc[signal.type] = (acc[signal.type] || 0) + 1;
      return acc;
    }, {} as Record<MarketSignal['type'], number>);

    const bySignificance = signals.reduce((acc, signal) => {
      acc[signal.significance] = (acc[signal.significance] || 0) + 1;
      return acc;
    }, {} as Record<MarketSignal['significance'], number>);

    return {
      total: signals.length,
      byType,
      bySignificance,
      oldestSignal: signals.length > 0 ? signals[signals.length - 1].timestamp : null,
      newestSignal: signals.length > 0 ? signals[0].timestamp : null
    };
  }

  /**
   * Export signals as JSON
   */
  exportSignals(): string {
    return JSON.stringify(this.getSignals(), null, 2);
  }

  /**
   * Import signals from JSON
   */
  importSignals(jsonData: string): void {
    try {
      const signals = JSON.parse(jsonData) as MarketSignal[];
      const limited = signals.slice(0, this.maxSignals);
      
      if (typeof window !== 'undefined') {
        localStorage.setItem(this.storageKey, JSON.stringify(limited));
      }
    } catch (error) {
      console.error('Failed to import signals:', error);
      throw new Error('Invalid signal data format');
    }
  }
}

// Singleton instance
export const signalsStorage = new SignalsStorage();

/**
 * Helper functions for creating specific signal types
 */
export const SignalHelpers = {
  priceUpdate: (market_id: string, market_question: string, current_price: number, price_change: number, platform: string, category: string): Omit<MarketSignal, 'id' | 'timestamp'> => ({
    type: 'PRICE_UPDATE',
    market_id,
    market_question,
    price_change,
    current_price,
    platform,
    category,
    significance: Math.abs(price_change) > 10 ? 'HIGH' : Math.abs(price_change) > 5 ? 'MEDIUM' : 'LOW',
    data: { price_change }
  }),

  newPick: (market_id: string, market_question: string, position: 'YES' | 'NO', current_price: number, platform: string, category: string): Omit<MarketSignal, 'id' | 'timestamp'> => ({
    type: 'NEW_PICK',
    market_id,
    market_question,
    position,
    current_price,
    platform,
    category,
    significance: 'CRITICAL',
    data: { position }
  }),

  positionClosed: (market_id: string, market_question: string, position: 'YES' | 'NO', pnl: number, current_price: number, platform: string, category: string): Omit<MarketSignal, 'id' | 'timestamp'> => ({
    type: 'POSITION_CLOSED',
    market_id,
    market_question,
    position,
    pnl,
    current_price,
    platform,
    category,
    significance: pnl > 20 ? 'CRITICAL' : pnl > 10 ? 'HIGH' : pnl < -10 ? 'HIGH' : 'MEDIUM',
    data: { pnl, position }
  }),

  alert: (market_id: string, market_question: string, current_price: number, platform: string, category: string, alertData: Record<string, any>): Omit<MarketSignal, 'id' | 'timestamp'> => ({
    type: 'ALERT',
    market_id,
    market_question,
    current_price,
    platform,
    category,
    significance: alertData.level || 'MEDIUM',
    data: alertData
  })
};