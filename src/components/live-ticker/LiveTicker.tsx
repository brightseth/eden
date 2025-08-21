'use client';

import { useState, useEffect, useRef } from 'react';
import { Activity, X, Filter, Eye } from 'lucide-react';
import { AgentEvent } from '@/lib/events/types';

export function LiveTicker() {
  const [events, setEvents] = useState<AgentEvent[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [agentFilter, setAgentFilter] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    // Connect to SSE stream
    const url = agentFilter 
      ? `/api/events/stream?agent=${agentFilter}`
      : '/api/events/stream';
      
    const eventSource = new EventSource(url);
    eventSourceRef.current = eventSource;

    eventSource.onopen = () => {
      setIsConnected(true);
      console.log('Connected to event stream');
    };

    eventSource.onerror = (error) => {
      console.error('SSE error:', error);
      setIsConnected(false);
    };

    // Listen for different event types
    const eventTypes = [
      'mint.created',
      'curation.verdict',
      'sale.executed',
      'training.iteration',
      'prompt.patch.applied'
    ];

    eventTypes.forEach(eventType => {
      eventSource.addEventListener(eventType, (e) => {
        const event: AgentEvent = JSON.parse(e.data);
        setEvents(prev => [event, ...prev].slice(0, 100)); // Keep last 100 events
      });
    });

    eventSource.addEventListener('connected', (e) => {
      console.log('Stream connected:', e.data);
    });

    return () => {
      eventSource.close();
    };
  }, [agentFilter]);

  const formatEvent = (event: AgentEvent): string => {
    switch (event.type) {
      case 'mint.created':
        return `${event.agent_id.toUpperCase()} minted piece #${event.payload.mint?.token_id}`;
      case 'curation.verdict':
        const verdict = event.payload.curation?.verdict;
        const score = Math.round((event.payload.curation?.weighted || 0) * 100);
        return `NINA ${verdict} work (${score}/100)`;
      case 'sale.executed':
        return `${event.agent_id.toUpperCase()} sold for $${event.payload.sale?.amount_usd}`;
      case 'training.iteration':
        return `${event.agent_id.toUpperCase()} training iteration ${event.payload.training?.iteration}`;
      case 'prompt.patch.applied':
        return `${event.agent_id.toUpperCase()} applied improvement patch`;
      default:
        return `${event.agent_id.toUpperCase()} ${event.type}`;
    }
  };

  const getEventColor = (event: AgentEvent): string => {
    switch (event.type) {
      case 'mint.created': return 'text-blue-400';
      case 'curation.verdict': 
        return event.payload.curation?.verdict === 'INCLUDE' ? 'text-green-400' : 'text-red-400';
      case 'sale.executed': return 'text-yellow-400';
      case 'training.iteration': return 'text-purple-400';
      default: return 'text-gray-400';
    }
  };

  const recentEvent = events[0];

  return (
    <>
      {/* Ticker Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 z-40">
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Activity className={`w-4 h-4 ${isConnected ? 'text-green-400 animate-pulse' : 'text-gray-600'}`} />
              <span className="text-xs font-bold text-gray-500">LIVE</span>
            </div>
            
            {recentEvent && (
              <div className={`text-sm ${getEventColor(recentEvent)} font-mono`}>
                {formatEvent(recentEvent)}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="px-3 py-1 text-xs bg-gray-900 hover:bg-gray-800 border border-gray-700 rounded flex items-center gap-2"
            >
              <Eye className="w-3 h-3" />
              WATCH ALL
            </button>
          </div>
        </div>
      </div>

      {/* Expanded View */}
      {isExpanded && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-4xl bg-black border border-gray-700 max-h-[80vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <h2 className="text-lg font-bold">LIVE ACTIVITY STREAM</h2>
              <div className="flex items-center gap-2">
                {/* Agent Filter */}
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gray-500" />
                  <select
                    value={agentFilter || 'all'}
                    onChange={(e) => setAgentFilter(e.target.value === 'all' ? null : e.target.value)}
                    className="bg-gray-900 border border-gray-700 px-2 py-1 text-sm rounded"
                  >
                    <option value="all">All Agents</option>
                    <option value="abraham">Abraham</option>
                    <option value="solienne">Solienne</option>
                    <option value="geppetto">Geppetto</option>
                    <option value="koru">Koru</option>
                  </select>
                </div>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="p-1 hover:bg-gray-900 rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Event List */}
            <div className="flex-1 overflow-y-auto p-4">
              {events.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  Waiting for events...
                </div>
              ) : (
                <div className="space-y-2">
                  {events.map((event) => (
                    <div
                      key={event.event_id}
                      className="flex items-start gap-3 p-3 bg-gray-950 border border-gray-800 rounded"
                    >
                      <div className="text-xs text-gray-500 font-mono w-20">
                        {new Date(event.ts).toLocaleTimeString()}
                      </div>
                      <div className={`flex-1 text-sm ${getEventColor(event)}`}>
                        {formatEvent(event)}
                      </div>
                      <div className="text-xs text-gray-600">
                        {event.agent_id}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}