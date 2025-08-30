// EMERGENCY API ENDPOINT - COVENANT WITNESSES
// Critical Path: DAY 2 - Database & Backend Implementation

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

interface WitnessRegistration {
  address: string;
  ens_name?: string;
  email?: string;
  transaction_hash: string;
  block_number: number;
  signed_at: string;
  notification_preferences: {
    dailyAuctions: boolean;
    milestones: boolean;
    emergency: boolean;
  };
}

interface WitnessRecord extends WitnessRegistration {
  witness_number: number;
  created_at: string;
  updated_at: string;
  status: 'active' | 'inactive';
}

// GET /api/covenant/witnesses - Fetch all witnesses
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '100');
    const offset = parseInt(url.searchParams.get('offset') || '0');
    const includeStats = url.searchParams.get('includeStats') === 'true';

    // Fetch witnesses from database
    const { data: witnesses, error: witnessError, count } = await supabase
      .from('covenant_witnesses')
      .select('*', { count: 'exact' })
      .eq('status', 'active')
      .order('witness_number', { ascending: true })
      .range(offset, offset + limit - 1);

    if (witnessError) {
      console.error('Database error:', witnessError);
      return NextResponse.json(
        { error: 'Failed to fetch witnesses' },
        { status: 500 }
      );
    }

    const response: any = {
      witnesses: witnesses || [],
      total: count || 0,
      offset,
      limit
    };

    // Include registry statistics if requested
    if (includeStats) {
      const totalWitnesses = count || 0;
      const targetWitnesses = 100;
      const percentComplete = Math.round((totalWitnesses / targetWitnesses) * 100);
      
      // Get recent witnesses (last 10)
      const { data: recentWitnesses } = await supabase
        .from('covenant_witnesses')
        .select('address, ens_name, witness_number, signed_at')
        .eq('status', 'active')
        .order('witness_number', { ascending: false })
        .limit(10);

      response.stats = {
        totalWitnesses,
        targetWitnesses,
        percentComplete,
        recentWitnesses: recentWitnesses?.map(w => ({
          address: w.address,
          ensName: w.ens_name,
          witnessNumber: w.witness_number,
          timestamp: w.signed_at
        })) || [],
        criticalStatus: percentComplete < 50 ? 'CRITICAL' : 
                       percentComplete < 75 ? 'WARNING' : 
                       percentComplete < 90 ? 'PROGRESS' : 'READY'
      };
    }

    return NextResponse.json(response);

  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/covenant/witnesses - Register new witness
export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as WitnessRegistration;

    // Validate required fields
    if (!body.address || !body.transaction_hash || !body.signed_at) {
      return NextResponse.json(
        { error: 'Missing required fields: address, transaction_hash, signed_at' },
        { status: 400 }
      );
    }

    // Validate Ethereum address format
    if (!/^0x[a-fA-F0-9]{40}$/.test(body.address)) {
      return NextResponse.json(
        { error: 'Invalid Ethereum address format' },
        { status: 400 }
      );
    }

    // Check if witness already exists
    const { data: existingWitness } = await supabase
      .from('covenant_witnesses')
      .select('address')
      .eq('address', body.address.toLowerCase())
      .single();

    if (existingWitness) {
      return NextResponse.json(
        { error: 'Address already registered as witness' },
        { status: 409 }
      );
    }

    // Get next witness number
    const { data: lastWitness } = await supabase
      .from('covenant_witnesses')
      .select('witness_number')
      .order('witness_number', { ascending: false })
      .limit(1)
      .single();

    const witnessNumber = (lastWitness?.witness_number || 0) + 1;

    // Insert new witness record
    const witnessRecord: Partial<WitnessRecord> = {
      address: body.address.toLowerCase(),
      ens_name: body.ens_name,
      email: body.email,
      transaction_hash: body.transaction_hash,
      block_number: body.block_number || 0,
      signed_at: body.signed_at,
      witness_number: witnessNumber,
      notification_preferences: body.notification_preferences || {
        dailyAuctions: true,
        milestones: true,
        emergency: true
      },
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data: newWitness, error: insertError } = await supabase
      .from('covenant_witnesses')
      .insert([witnessRecord])
      .select()
      .single();

    if (insertError) {
      console.error('Insert error:', insertError);
      return NextResponse.json(
        { error: 'Failed to register witness' },
        { status: 500 }
      );
    }

    // Send welcome notification (if email provided)
    if (body.email) {
      await sendWelcomeNotification({
        email: body.email,
        address: body.address,
        witnessNumber,
        ensName: body.ens_name
      });
    }

    // Log milestone if significant witness number
    if (witnessNumber % 10 === 0 || witnessNumber === 100) {
      await logWitnessMilestone(witnessNumber, body.address);
    }

    return NextResponse.json({
      success: true,
      witness: {
        address: newWitness.address,
        witnessNumber: newWitness.witness_number,
        signedAt: newWitness.signed_at,
        transactionHash: newWitness.transaction_hash
      },
      message: `Welcome, Witness #${witnessNumber}! You are now part of Abraham's covenant.`
    });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Failed to register witness' },
      { status: 500 }
    );
  }
}

// PUT /api/covenant/witnesses/[address] - Update witness preferences
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const url = new URL(request.url);
    const address = url.pathname.split('/').pop()?.toLowerCase();

    if (!address || !/^0x[a-fA-F0-9]{40}$/.test(address)) {
      return NextResponse.json(
        { error: 'Invalid address' },
        { status: 400 }
      );
    }

    // Update witness record
    const { data: updatedWitness, error: updateError } = await supabase
      .from('covenant_witnesses')
      .update({
        ...body,
        updated_at: new Date().toISOString()
      })
      .eq('address', address)
      .select()
      .single();

    if (updateError) {
      console.error('Update error:', updateError);
      return NextResponse.json(
        { error: 'Failed to update witness' },
        { status: 500 }
      );
    }

    if (!updatedWitness) {
      return NextResponse.json(
        { error: 'Witness not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      witness: updatedWitness
    });

  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json(
      { error: 'Failed to update witness' },
      { status: 500 }
    );
  }
}

// Helper function: Send welcome notification
async function sendWelcomeNotification(witness: {
  email: string;
  address: string;
  witnessNumber: number;
  ensName?: string;
}) {
  try {
    // In production, integrate with email service (SendGrid, Resend, etc.)
    console.log(`[WITNESS NOTIFICATION] Welcome Witness #${witness.witnessNumber}:`, witness.email);
    
    // Mock email content
    const emailContent = {
      to: witness.email,
      subject: `Welcome, Covenant Witness #${witness.witnessNumber}`,
      template: 'covenant_welcome',
      data: {
        witnessNumber: witness.witnessNumber,
        address: witness.address,
        ensName: witness.ensName,
        covenantStart: '2025-10-19',
        dashboardUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/covenant/dashboard`
      }
    };

    // TODO: Implement actual email sending
    // await emailService.send(emailContent);
    
  } catch (error) {
    console.error('Failed to send welcome notification:', error);
    // Non-critical error - don't fail registration
  }
}

// Helper function: Log witness milestones
async function logWitnessMilestone(witnessNumber: number, address: string) {
  try {
    console.log(`[COVENANT MILESTONE] Witness #${witnessNumber} registered: ${address}`);
    
    // Log to covenant events table
    await supabase
      .from('covenant_events')
      .insert([{
        event_type: 'witness_milestone',
        event_data: {
          witnessNumber,
          address,
          milestone: witnessNumber % 10 === 0 ? `${witnessNumber}_milestone` : 'launch_ready'
        },
        created_at: new Date().toISOString()
      }]);

    // Alert if we hit launch readiness
    if (witnessNumber === 100) {
      console.log('🎯 COVENANT LAUNCH READY: 100 witnesses achieved!');
      // TODO: Trigger launch readiness notifications
    }

  } catch (error) {
    console.error('Failed to log milestone:', error);
  }
}

// Helper function: Get witness statistics
export async function getWitnessStats() {
  try {
    const { count } = await supabase
      .from('covenant_witnesses')
      .select('*', { count: 'exact' })
      .eq('status', 'active');

    const totalWitnesses = count || 0;
    const targetWitnesses = 100;
    const percentComplete = Math.round((totalWitnesses / targetWitnesses) * 100);

    return {
      totalWitnesses,
      targetWitnesses,
      percentComplete,
      launchReady: percentComplete >= 100,
      criticalStatus: percentComplete < 50 ? 'CRITICAL' : 
                     percentComplete < 75 ? 'WARNING' : 
                     percentComplete < 90 ? 'PROGRESS' : 'READY'
    };
  } catch (error) {
    console.error('Failed to get witness stats:', error);
    return null;
  }
}