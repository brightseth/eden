import { useState, useEffect, useRef } from 'react';

interface MarketUpdate {
  market_id: string;
  pick_id?: string;
  current_price: number;
  price_change?: number;
  price_change_percent?: number;
  pnl?: number;
  volume?: number;
  last_updated: string;
  status?: string;
  market_question?: string;
  position?: string;
}

interface StreamData {
  type: 'connected' | 'market_update' | 'error' | 'heartbeat';
  timestamp: string;
  updates?: MarketUpdate[];
  message?: string;
}

export function useMarketStream(enabled: boolean = true) {
  const [isConnected, setIsConnected] = useState(false);
  const [updates, setUpdates] = useState<MarketUpdate[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  const connect = () => {
    if (!enabled || eventSourceRef.current) return;

    try {
      console.log('[MarketStream] Connecting to stream...');
      
      const eventSource = new EventSource('/api/miyomi/market-stream', {
        withCredentials: false
      });
      
      eventSourceRef.current = eventSource;

      eventSource.onopen = () => {
        console.log('[MarketStream] Connected');
        setIsConnected(true);
        setError(null);
        reconnectAttempts.current = 0;
      };

      eventSource.onmessage = (event) => {
        try {
          const data: StreamData = JSON.parse(event.data);
          
          switch (data.type) {
            case 'connected':
              console.log('[MarketStream] Stream established');
              setIsConnected(true);
              break;
              
            case 'market_update':
              if (data.updates && data.updates.length > 0) {
                console.log(`[MarketStream] Received ${data.updates.length} updates`);
                setUpdates(prevUpdates => {
                  // Merge new updates with existing ones
                  const updatedMap = new Map();
                  
                  // Add existing updates
                  prevUpdates.forEach(update => {
                    updatedMap.set(update.market_id, update);
                  });
                  
                  // Override with new updates
                  data.updates!.forEach(update => {
                    updatedMap.set(update.market_id, {
                      ...update,
                      last_updated: data.timestamp
                    });
                  });
                  
                  return Array.from(updatedMap.values());
                });
                setLastUpdate(new Date(data.timestamp));
              }
              break;
              
            case 'error':
              console.error('[MarketStream] Stream error:', data.message);
              setError(data.message || 'Unknown stream error');
              break;
              
            case 'heartbeat':
              // Silent heartbeat processing
              break;
              
            default:
              console.warn('[MarketStream] Unknown message type:', data.type);
          }
        } catch (err) {
          console.error('[MarketStream] Parse error:', err);
          setError('Failed to parse stream data');
        }
      };

      eventSource.onerror = (event) => {
        console.error('[MarketStream] EventSource error:', event);
        setIsConnected(false);
        
        if (eventSource.readyState === EventSource.CLOSED) {
          setError('Stream connection closed');
          scheduleReconnect();
        } else {
          setError('Stream connection error');
        }
      };

    } catch (err) {
      console.error('[MarketStream] Connection error:', err);
      setError(err instanceof Error ? err.message : 'Connection failed');
      scheduleReconnect();
    }
  };

  const disconnect = () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    if (eventSourceRef.current) {
      console.log('[MarketStream] Disconnecting...');
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    
    setIsConnected(false);
  };

  const scheduleReconnect = () => {
    if (reconnectAttempts.current >= maxReconnectAttempts) {
      console.error('[MarketStream] Max reconnection attempts reached');
      setError('Unable to reconnect to market stream');
      return;
    }
    
    const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000);
    console.log(`[MarketStream] Reconnecting in ${delay}ms (attempt ${reconnectAttempts.current + 1})`);
    
    reconnectTimeoutRef.current = setTimeout(() => {
      reconnectAttempts.current++;
      disconnect();
      connect();
    }, delay);
  };

  const triggerManualUpdate = async (marketIds?: string[]) => {
    try {
      const response = await fetch('/api/miyomi/market-stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ market_ids: marketIds })
      });

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Manual update failed');
      }
      
      console.log(`[MarketStream] Manual update triggered: ${result.updates_count} updates`);
      return result;
      
    } catch (err) {
      console.error('[MarketStream] Manual update error:', err);
      throw err;
    }
  };

  // Connect/disconnect based on enabled flag
  useEffect(() => {
    if (enabled) {
      connect();
    } else {
      disconnect();
    }
    
    return () => {
      disconnect();
    };
  }, [enabled]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, []);

  return {
    isConnected,
    updates,
    error,
    lastUpdate,
    connect,
    disconnect,
    triggerManualUpdate,
    reconnectAttempts: reconnectAttempts.current
  };
}