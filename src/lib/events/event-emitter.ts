// Event Emitter for Agent Events
import { AgentEvent } from './types';

class EventEmitter {
  private listeners: Map<string, Set<(event: AgentEvent) => void>> = new Map();
  private eventQueue: AgentEvent[] = [];
  private maxQueueSize = 1000;

  emit(event: AgentEvent) {
    // Add to queue
    this.eventQueue.push(event);
    if (this.eventQueue.length > this.maxQueueSize) {
      this.eventQueue.shift(); // Remove oldest
    }

    // Notify listeners
    const listeners = this.listeners.get(event.type) || new Set();
    const allListeners = this.listeners.get('*') || new Set();
    
    [...listeners, ...allListeners].forEach(listener => {
      try {
        listener(event);
      } catch (error) {
        console.error('Event listener error:', error);
      }
    });
  }

  on(eventType: string, listener: (event: AgentEvent) => void) {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }
    this.listeners.get(eventType)!.add(listener);
    
    return () => {
      this.listeners.get(eventType)?.delete(listener);
    };
  }

  getRecentEvents(limit = 50): AgentEvent[] {
    return this.eventQueue.slice(-limit);
  }

  getEventsByAgent(agentId: string, limit = 20): AgentEvent[] {
    return this.eventQueue
      .filter(e => e.agent_id === agentId)
      .slice(-limit);
  }
}

// Singleton instance
export const eventEmitter = new EventEmitter();