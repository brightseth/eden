/**
 * MIYOMI Signals Panel Component
 * Displays last 20 market signals with real-time updates
 */

'use client';

import { useState } from 'react';
import { 
  Activity, TrendingUp, TrendingDown, Zap, AlertTriangle, 
  CheckCircle, XCircle, Eye, Download, Upload, Trash2,
  Filter, RefreshCw
} from 'lucide-react';
import { useSignalsStorage } from '@/hooks/useSignalsStorage';
import { MarketSignal } from '@/lib/storage/signals-storage';

export default function SignalsPanel() {
  const {
    signals,
    stats,
    addSignal,
    refreshSignals,
    clearSignals,
    exportSignals,
    importSignals,
    addPriceUpdateSignal,
    addNewPickSignal,
    addAlertSignal
  } = useSignalsStorage();

  const [filterType, setFilterType] = useState<MarketSignal['type'] | 'ALL'>('ALL');
  const [filterSignificance, setFilterSignificance] = useState<MarketSignal['significance'] | 'ALL'>('ALL');
  const [showExportModal, setShowExportModal] = useState(false);

  const filteredSignals = signals.filter(signal => {
    if (filterType !== 'ALL' && signal.type !== filterType) return false;
    if (filterSignificance !== 'ALL' && signal.significance !== filterSignificance) return false;
    return true;
  });

  const getSignalIcon = (type: MarketSignal['type']) => {
    switch (type) {
      case 'PRICE_UPDATE': return <TrendingUp className="w-4 h-4" />;
      case 'NEW_PICK': return <Zap className="w-4 h-4" />;
      case 'POSITION_CLOSED': return <CheckCircle className="w-4 h-4" />;
      case 'ALERT': return <AlertTriangle className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getSignalColor = (significance: MarketSignal['significance'], type: MarketSignal['type']) => {
    if (significance === 'CRITICAL') return 'text-red-400 bg-red-400/10';
    if (significance === 'HIGH') return 'text-orange-400 bg-orange-400/10';
    if (significance === 'MEDIUM') return 'text-yellow-400 bg-yellow-400/10';
    return 'text-green-400 bg-green-400/10';
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatPrice = (price: number) => {
    return `${(price * 100).toFixed(1)}¢`;
  };

  const formatPnL = (pnl: number | undefined) => {
    if (pnl === undefined) return null;
    const formatted = pnl >= 0 ? `+${pnl.toFixed(1)}%` : `${pnl.toFixed(1)}%`;
    const color = pnl >= 0 ? 'text-green-400' : 'text-red-400';
    return <span className={color}>{formatted}</span>;
  };

  const handleExport = () => {
    const data = exportSignals();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `miyomi-signals-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setShowExportModal(false);
  };

  // Demo function to add sample signals
  const addDemoSignals = () => {
    addPriceUpdateSignal(
      'DEMO_001',
      'Trump Re-election 2024',
      0.47,
      -3.2,
      'POLYMARKET',
      'POLITICS'
    );

    addNewPickSignal(
      'DEMO_002',
      'Fed Rate Cut March 2025',
      'NO',
      0.23,
      'KALSHI',
      'FINANCE'
    );

    addAlertSignal(
      'DEMO_003',
      'Chiefs Win Super Bowl',
      0.65,
      'MANIFOLD',
      'SPORTS',
      { level: 'HIGH', message: 'Major odds shift detected' }
    );
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="bg-white/5 backdrop-blur rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <Activity className="w-6 h-6 text-blue-500" />
            Market Signals
            <span className="text-sm bg-blue-500/20 text-blue-400 px-2 py-1 rounded">
              Last {signals.length}
            </span>
          </h2>
          <div className="flex items-center gap-3">
            <button
              onClick={refreshSignals}
              className="px-3 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
            <button
              onClick={() => setShowExportModal(true)}
              className="px-3 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
            <button
              onClick={addDemoSignals}
              className="px-3 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition text-sm"
            >
              Add Demo
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white/5 rounded-lg p-3">
            <div className="text-sm text-gray-400">Total Signals</div>
            <div className="text-2xl font-bold">{stats.total}</div>
          </div>
          <div className="bg-white/5 rounded-lg p-3">
            <div className="text-sm text-gray-400">Price Updates</div>
            <div className="text-2xl font-bold text-blue-400">{stats.byType.PRICE_UPDATE || 0}</div>
          </div>
          <div className="bg-white/5 rounded-lg p-3">
            <div className="text-sm text-gray-400">New Picks</div>
            <div className="text-2xl font-bold text-green-400">{stats.byType.NEW_PICK || 0}</div>
          </div>
          <div className="bg-white/5 rounded-lg p-3">
            <div className="text-sm text-gray-400">Critical</div>
            <div className="text-2xl font-bold text-red-400">{stats.bySignificance.CRITICAL || 0}</div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="bg-white/10 rounded px-3 py-1 text-sm"
            >
              <option value="ALL">All Types</option>
              <option value="PRICE_UPDATE">Price Updates</option>
              <option value="NEW_PICK">New Picks</option>
              <option value="POSITION_CLOSED">Closed Positions</option>
              <option value="ALERT">Alerts</option>
            </select>
          </div>
          <div>
            <select
              value={filterSignificance}
              onChange={(e) => setFilterSignificance(e.target.value as any)}
              className="bg-white/10 rounded px-3 py-1 text-sm"
            >
              <option value="ALL">All Significance</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Signals List */}
      <div className="bg-white/5 backdrop-blur rounded-lg p-6">
        <div className="space-y-3">
          {filteredSignals.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No signals match your filters</p>
            </div>
          ) : (
            filteredSignals.slice(0, 20).map(signal => (
              <div
                key={signal.id}
                className={`rounded-lg p-4 border ${getSignalColor(signal.significance, signal.type)} border-current/20`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        {getSignalIcon(signal.type)}
                        <span className="text-xs uppercase font-bold opacity-75">
                          {signal.type.replace('_', ' ')}
                        </span>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded ${
                        signal.significance === 'CRITICAL' ? 'bg-red-500/20' :
                        signal.significance === 'HIGH' ? 'bg-orange-500/20' :
                        signal.significance === 'MEDIUM' ? 'bg-yellow-500/20' :
                        'bg-green-500/20'
                      }`}>
                        {signal.significance}
                      </span>
                    </div>
                    
                    <h4 className="font-bold mb-1">{signal.market_question}</h4>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-400 mb-2">
                      <span>{signal.platform}</span>
                      <span>{signal.category}</span>
                      <span>Price: {formatPrice(signal.current_price)}</span>
                      {signal.position && (
                        <span className={`font-bold ${
                          signal.position === 'YES' ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {signal.position}
                        </span>
                      )}
                    </div>

                    {signal.price_change !== undefined && (
                      <div className="text-sm">
                        Price change: {formatPnL(signal.price_change)}
                      </div>
                    )}
                    
                    {signal.pnl !== undefined && (
                      <div className="text-sm">
                        P&L: {formatPnL(signal.pnl)}
                      </div>
                    )}
                  </div>
                  
                  <div className="text-right text-sm text-gray-400">
                    {formatTime(signal.timestamp)}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Export Signals</h3>
            <p className="text-gray-400 mb-6">
              Export your last 20 market signals as JSON for backup or analysis.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleExport}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition"
              >
                Download JSON
              </button>
              <button
                onClick={() => setShowExportModal(false)}
                className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}