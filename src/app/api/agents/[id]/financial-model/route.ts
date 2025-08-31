import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { 
  CreateFinancialModelSchema, 
  UpdateFinancialModelSchema,
  type FinancialModel 
} from '@/lib/validation/schemas';
import { z } from 'zod';

// GET /api/agents/[id]/financial-model
export async function GET(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }) {
  try {
    const supabase = await createClient();
    const params = await props.params;
  const { id: agentId } = params;

    // Validate UUID
    const uuidSchema = z.string().uuid();
    const validatedId = uuidSchema.parse(agentId);

    // Fetch active financial model
    const { data, error } = await supabase
      .from('financial_models')
      .select('*')
      .eq('agent_id', validatedId)
      .eq('active', true)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows
      console.error('Error fetching financial model:', error);
      return NextResponse.json(
        { error: 'Failed to fetch financial model' },
        { status: 500 }
      );
    }

    // Also fetch the calculated metrics from the view
    const { data: metrics } = await supabase
      .from('v_financial_model_metrics')
      .select('*')
      .eq('agent_id', validatedId)
      .single();

    return NextResponse.json({
      model: data,
      metrics: metrics || null
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid agent ID', details: error.issues },
        { status: 400 }
      );
    }
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/agents/[id]/financial-model
export async function POST(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }) {
  try {
    const supabase = await createClient();
    const params = await props.params;
  const { id: agentId } = params;
    const body = await request.json();

    // Validate input
    const uuidSchema = z.string().uuid();
    const validatedId = uuidSchema.parse(agentId);
    const validatedData = CreateFinancialModelSchema.parse(body);

    // Deactivate any existing active models
    await supabase
      .from('financial_models')
      .update({ active: false })
      .eq('agent_id', validatedId)
      .eq('active', true);

    // Create new active model
    const { data, error } = await supabase
      .from('financial_models')
      .insert({
        agent_id: validatedId,
        ...validatedData,
        active: true
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating financial model:', error);
      return NextResponse.json(
        { error: 'Failed to create financial model' },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      );
    }
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH /api/agents/[id]/financial-model
export async function PATCH(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }) {
  try {
    const supabase = await createClient();
    const params = await props.params;
  const { id: agentId } = params;
    const body = await request.json();

    // Validate input
    const uuidSchema = z.string().uuid();
    const validatedId = uuidSchema.parse(agentId);
    const validatedData = UpdateFinancialModelSchema.parse(body);

    // Update active model
    const { data, error } = await supabase
      .from('financial_models')
      .update(validatedData)
      .eq('agent_id', validatedId)
      .eq('active', true)
      .select()
      .single();

    if (error) {
      console.error('Error updating financial model:', error);
      return NextResponse.json(
        { error: 'Failed to update financial model' },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: 'No active financial model found' },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      );
    }
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}