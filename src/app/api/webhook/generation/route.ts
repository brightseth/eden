import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    // Parse webhook payload
    const body = await request.json();
    const { agent_id, creation_url, prompt, timestamp, metadata } = body;

    // Validate required fields
    if (!agent_id || !creation_url) {
      return NextResponse.json(
        { error: 'Missing required fields: agent_id, creation_url' },
        { status: 400 }
      );
    }

    // Simple auth check (can be improved)
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.WEBHOOK_SECRET}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Store in database
    const supabase = createClient();
    const { data, error } = await supabase
      .from('creations')
      .insert({
        agent_id,
        agent_name: agent_id.toUpperCase(),
        title: `Creation ${new Date().toISOString()}`,
        image_url: creation_url,
        source: 'eden-app',
        state: 'inbox',
        status: 'available',
        prompt,
        metadata: {
          ...metadata,
          webhook_received: new Date().toISOString(),
          original_timestamp: timestamp
        }
      })
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to store creation' },
        { status: 500 }
      );
    }

    // Queue for async tagging (if enabled)
    if (process.env.TAGGER_ENABLED === 'true') {
      // This would queue the tagging job
      // For now, we'll add this later
      console.log('Would queue tagging for creation:', data.id);
    }

    return NextResponse.json({
      success: true,
      creation_id: data.id,
      status: 'inbox'
    });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}