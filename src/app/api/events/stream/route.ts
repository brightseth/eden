import { NextRequest } from 'next/server';
import { eventEmitter } from '@/lib/events/event-emitter';
import { AgentEvent } from '@/lib/events/types';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const agentFilter = searchParams.get('agent');
  
  const encoder = new TextEncoder();
  
  const stream = new ReadableStream({
    start(controller) {
      // Send initial connection message
      controller.enqueue(
        encoder.encode(`event: connected\ndata: {"message": "Connected to Eden Academy event stream"}\n\n`)
      );

      // Send recent events on connection
      const recentEvents = agentFilter 
        ? eventEmitter.getEventsByAgent(agentFilter)
        : eventEmitter.getRecentEvents(10);
        
      recentEvents.forEach(event => {
        const eventData = `event: ${event.type}\ndata: ${JSON.stringify(event)}\n\n`;
        controller.enqueue(encoder.encode(eventData));
      });

      // Subscribe to new events
      const unsubscribe = eventEmitter.on('*', (event: AgentEvent) => {
        // Apply agent filter if specified
        if (agentFilter && event.agent_id !== agentFilter) {
          return;
        }

        const eventData = `event: ${event.type}\ndata: ${JSON.stringify(event)}\n\n`;
        try {
          controller.enqueue(encoder.encode(eventData));
        } catch (error) {
          // Client disconnected
          console.log('SSE client disconnected');
          unsubscribe();
        }
      });

      // Send heartbeat every 30 seconds
      const heartbeat = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(': heartbeat\n\n'));
        } catch (error) {
          clearInterval(heartbeat);
          unsubscribe();
        }
      }, 30000);

      // Cleanup on close
      request.signal.addEventListener('abort', () => {
        clearInterval(heartbeat);
        unsubscribe();
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
    },
  });
}