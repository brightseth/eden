import { NextRequest, NextResponse } from 'next/server';

// Registry webhook handler for real-time updates
export async function POST(request: NextRequest) {
  try {
    const event = await request.json();
    
    console.log('[Registry Webhook] Received event:', {
      type: event.type,
      timestamp: event.timestamp,
      data: event.data?.id || 'no-id'
    });

    // Handle different event types
    switch (event.type) {
      case 'agent.created':
        await handleAgentCreated(event.data);
        break;
        
      case 'agent.updated':
        await handleAgentUpdated(event.data);
        break;
        
      case 'creation.published':
        await handleCreationPublished(event.data);
        break;
        
      case 'application.submitted':
        await handleApplicationSubmitted(event.data);
        break;
        
      default:
        console.log(`[Registry Webhook] Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ 
      success: true, 
      message: `Event ${event.type} processed successfully` 
    });

  } catch (error) {
    console.error('[Registry Webhook] Error processing event:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process webhook event' },
      { status: 500 }
    );
  }
}

async function handleAgentCreated(agent: any) {
  console.log(`[Registry Webhook] New agent created: ${agent.handle}`);
  // TODO: Invalidate agent cache, trigger UI updates
}

async function handleAgentUpdated(agent: any) {
  console.log(`[Registry Webhook] Agent updated: ${agent.handle}`);
  // TODO: Invalidate specific agent cache, update UI
}

async function handleCreationPublished(creation: any) {
  console.log(`[Registry Webhook] New creation published: ${creation.id}`);
  // TODO: Refresh agent works, update feeds
}

async function handleApplicationSubmitted(application: any) {
  console.log(`[Registry Webhook] New application submitted: ${application.id}`);
  // TODO: Notify admins, update application queues
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    webhook: 'registry',
    timestamp: new Date().toISOString()
  });
}