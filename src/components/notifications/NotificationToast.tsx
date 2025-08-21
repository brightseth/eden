'use client';

import { useEffect, useState } from 'react';
import { X, Bell, Image, DollarSign, Sparkles, UserPlus } from 'lucide-react';
import Link from 'next/link';

interface NotificationData {
  id: string;
  type: 'CURATION_VERDICT' | 'MINT_CREATED' | 'SALE_EXECUTED' | 'AGENT_UPDATE' | 'FOLLOW_ADDED';
  agent_id: string;
  agent_name: string;
  payload: any;
  ts: string;
}

interface Toast {
  id: string;
  notification: NotificationData;
  removing?: boolean;
}

const getNotificationIcon = (type: string) => {
  switch(type) {
    case 'CURATION_VERDICT': return <Sparkles className="w-4 h-4" />;
    case 'MINT_CREATED': return <Image className="w-4 h-4" />;
    case 'SALE_EXECUTED': return <DollarSign className="w-4 h-4" />;
    case 'FOLLOW_ADDED': return <UserPlus className="w-4 h-4" />;
    default: return <Bell className="w-4 h-4" />;
  }
};

const getNotificationMessage = (notification: NotificationData) => {
  const { type, agent_name, payload } = notification;
  
  switch(type) {
    case 'CURATION_VERDICT':
      const verdict = payload.verdict || 'REVIEWED';
      const verdictEmoji = verdict === 'INCLUDE' ? '✅' : verdict === 'EXCLUDE' ? '❌' : '🤔';
      return `${agent_name}: ${verdictEmoji} ${verdict} verdict on new work`;
      
    case 'MINT_CREATED':
      return `${agent_name} minted a new piece: "${payload.title || 'Untitled'}"`;
      
    case 'SALE_EXECUTED':
      return `${agent_name} sold a piece for $${payload.amount_usd || '---'}`;
      
    case 'AGENT_UPDATE':
      return `${agent_name} ${payload.update || 'has an update'}`;
      
    case 'FOLLOW_ADDED':
      return `You're now following ${agent_name}`;
      
    default:
      return `${agent_name} has new activity`;
  }
};

export function NotificationToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [eventSource, setEventSource] = useState<EventSource | null>(null);

  useEffect(() => {
    // Connect to SSE stream for live notifications
    const connectSSE = () => {
      try {
        const es = new EventSource('/api/events/stream?filter=notifications');
        
        es.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            
            // Check if this is a notification event for the current user
            if (data.type && data.agent_id) {
              const notification: NotificationData = {
                id: crypto.randomUUID(),
                type: data.type,
                agent_id: data.agent_id,
                agent_name: data.agent_name || data.agent_id.toUpperCase(),
                payload: data.payload || {},
                ts: data.ts || new Date().toISOString()
              };
              
              // Add toast
              addToast(notification);
            }
          } catch (err) {
            console.error('Failed to parse SSE data:', err);
          }
        };
        
        es.onerror = (error) => {
          console.error('SSE error:', error);
          es.close();
          // Reconnect after 5 seconds
          setTimeout(connectSSE, 5000);
        };
        
        setEventSource(es);
      } catch (error) {
        console.error('Failed to connect to SSE:', error);
      }
    };
    
    connectSSE();
    
    return () => {
      eventSource?.close();
    };
  }, []);

  const addToast = (notification: NotificationData) => {
    const toast: Toast = {
      id: crypto.randomUUID(),
      notification
    };
    
    setToasts(prev => [...prev, toast]);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      removeToast(toast.id);
    }, 5000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.map(t => 
      t.id === id ? { ...t, removing: true } : t
    ));
    
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 300);
  };

  // For testing: expose addToast globally
  useEffect(() => {
    (window as any).testNotification = (type: string, agentName: string) => {
      addToast({
        id: crypto.randomUUID(),
        type: type as any,
        agent_id: agentName.toLowerCase(),
        agent_name: agentName,
        payload: { verdict: 'INCLUDE', title: 'Test Creation', amount_usd: 1500 },
        ts: new Date().toISOString()
      });
    };
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-sm">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`
            bg-gray-900 border border-gray-700 rounded-lg p-4 shadow-xl
            transform transition-all duration-300 ease-out
            ${toast.removing ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0'}
          `}
        >
          <div className="flex items-start gap-3">
            <div className="text-yellow-400 mt-0.5">
              {getNotificationIcon(toast.notification.type)}
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white">
                {getNotificationMessage(toast.notification)}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <Link
                  href={`/academy/agent/${toast.notification.agent_id}`}
                  className="text-xs text-gray-400 hover:text-white transition-colors"
                >
                  View →
                </Link>
                <span className="text-xs text-gray-500">
                  {new Date(toast.notification.ts).toLocaleTimeString()}
                </span>
              </div>
            </div>
            
            <button
              onClick={() => removeToast(toast.id)}
              className="text-gray-500 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

// Hook for programmatic notifications
export function useNotifications() {
  const notify = (type: string, agentName: string, payload?: any) => {
    if ((window as any).testNotification) {
      (window as any).testNotification(type, agentName);
    }
  };
  
  return { notify };
}