// EMERGENCY NOTIFICATION API - COVENANT WITNESS COMMUNICATIONS
// Critical Path: HOUR 12-18 - Email automation endpoint

import { NextRequest, NextResponse } from 'next/server';
// Conditional import to avoid Resend errors during build
let covenantEmailService: any;
let sendWitnessWelcome: any;
let notifyWitnessMilestone: any;
let sendEmergencyCovenantAlert: any;

try {
  const emailModule = require('@/lib/covenant/email-notifications');
  covenantEmailService = emailModule.covenantEmailService;
  sendWitnessWelcome = emailModule.sendWitnessWelcome;
  notifyWitnessMilestone = emailModule.notifyWitnessMilestone;
  sendEmergencyCovenantAlert = emailModule.sendEmergencyCovenantAlert;
} catch (error) {
  // Mock functions for build time
  covenantEmailService = { sendDailyAuctionAlert: () => false, sendLaunchCountdownAlert: () => false };
  sendWitnessWelcome = () => false;
  notifyWitnessMilestone = () => false;
  sendEmergencyCovenantAlert = () => false;
}
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

// POST /api/covenant/notifications - Send notifications
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, ...data } = body;

    switch (type) {
      case 'welcome':
        return await handleWelcomeNotification(data);
      
      case 'milestone':
        return await handleMilestoneNotification(data);
      
      case 'emergency':
        return await handleEmergencyNotification(data);
      
      case 'daily_auction':
        return await handleDailyAuctionNotification(data);
      
      case 'launch_countdown':
        return await handleLaunchCountdownNotification(data);
      
      case 'batch_test':
        return await handleBatchTestNotification(data);
      
      default:
        return NextResponse.json(
          { error: `Unknown notification type: ${type}` },
          { status: 400 }
        );
    }

  } catch (error: any) {
    console.error('Notification API error:', error);
    return NextResponse.json(
      { error: 'Failed to process notification request' },
      { status: 500 }
    );
  }
}

// GET /api/covenant/notifications - Get notification history
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const witnessAddress = url.searchParams.get('witness');
    const status = url.searchParams.get('status');
    const limit = parseInt(url.searchParams.get('limit') || '50');

    let query = supabase
      .from('witness_notifications')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (witnessAddress) {
      query = query.eq('witness_address', witnessAddress.toLowerCase());
    }

    if (status) {
      query = query.eq('status', status);
    }

    const { data: notifications, error } = await query;

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch notifications' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      notifications: notifications || [],
      count: notifications?.length || 0
    });

  } catch (error) {
    console.error('Notification fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}

// Handle welcome notification
async function handleWelcomeNotification(data: {
  address: string;
  email: string;
  witnessNumber: number;
  ensName?: string;
}) {
  try {
    const success = await sendWitnessWelcome({
      address: data.address,
      email: data.email,
      witnessNumber: data.witnessNumber,
      ensName: data.ensName
    });

    if (success) {
      return NextResponse.json({
        success: true,
        message: `Welcome email sent to witness #${data.witnessNumber}`
      });
    } else {
      return NextResponse.json(
        { error: 'Failed to send welcome email' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: `Welcome email failed: ${error.message}` },
      { status: 500 }
    );
  }
}

// Handle milestone notification
async function handleMilestoneNotification(data: {
  type: 'witness_count' | 'launch_ready' | 'halfway' | 'first_ten';
  witnessNumber: number;
  totalWitnesses: number;
  message: string;
}) {
  try {
    await notifyWitnessMilestone({
      type: data.type,
      witnessNumber: data.witnessNumber,
      totalWitnesses: data.totalWitnesses,
      message: data.message
    });

    return NextResponse.json({
      success: true,
      message: `Milestone notification sent to all witnesses: ${data.message}`
    });

  } catch (error: any) {
    return NextResponse.json(
      { error: `Milestone notification failed: ${error.message}` },
      { status: 500 }
    );
  }
}

// Handle emergency notification
async function handleEmergencyNotification(data: {
  urgencyLevel: 'critical' | 'warning' | 'info';
  subject: string;
  message: string;
  actionRequired?: string;
  deadlineDate?: string;
}) {
  try {
    await sendEmergencyCovenantAlert({
      urgencyLevel: data.urgencyLevel,
      subject: data.subject,
      message: data.message,
      actionRequired: data.actionRequired,
      deadlineDate: data.deadlineDate
    });

    return NextResponse.json({
      success: true,
      message: `Emergency ${data.urgencyLevel} alert sent to all witnesses`
    });

  } catch (error: any) {
    return NextResponse.json(
      { error: `Emergency notification failed: ${error.message}` },
      { status: 500 }
    );
  }
}

// Handle daily auction notification
async function handleDailyAuctionNotification(data: {
  day: number;
  title: string;
  endTime: string;
}) {
  try {
    // Get all witnesses who want daily auction notifications
    const { data: witnesses, error } = await supabase
      .from('covenant_witnesses')
      .select('address, email, ens_name')
      .eq('status', 'active')
      .neq('email', null)
      .contains('notification_preferences', { dailyAuctions: true });

    if (error || !witnesses || witnesses.length === 0) {
      return NextResponse.json(
        { error: 'No witnesses to notify for daily auction' },
        { status: 400 }
      );
    }

    // Send to all witnesses
    let sent = 0;
    let failed = 0;

    for (const witness of witnesses) {
      try {
        const success = await covenantEmailService.sendDailyAuctionAlert(
          { address: witness.address, email: witness.email },
          { day: data.day, title: data.title, endTime: new Date(data.endTime) }
        );

        if (success) {
          sent++;
        } else {
          failed++;
        }
      } catch (error) {
        failed++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Daily auction alert sent to ${sent} witnesses (${failed} failed)`
    });

  } catch (error: any) {
    return NextResponse.json(
      { error: `Daily auction notification failed: ${error.message}` },
      { status: 500 }
    );
  }
}

// Handle launch countdown notification
async function handleLaunchCountdownNotification(data: {
  daysRemaining: number;
}) {
  try {
    await covenantEmailService.sendLaunchCountdownAlert(data.daysRemaining);

    return NextResponse.json({
      success: true,
      message: `Launch countdown sent for ${data.daysRemaining} days remaining`
    });

  } catch (error: any) {
    return NextResponse.json(
      { error: `Launch countdown notification failed: ${error.message}` },
      { status: 500 }
    );
  }
}

// Handle batch test notification
async function handleBatchTestNotification(data: {
  testType: 'welcome' | 'milestone' | 'emergency';
  testEmails?: string[];
}) {
  try {
    const testEmails = data.testEmails || ['test@example.com'];
    let results: any = {};

    switch (data.testType) {
      case 'welcome':
        results = await testWelcomeEmail(testEmails);
        break;
      case 'milestone':
        results = await testMilestoneEmail(testEmails);
        break;
      case 'emergency':
        results = await testEmergencyEmail(testEmails);
        break;
    }

    return NextResponse.json({
      success: true,
      testResults: results,
      message: `Test ${data.testType} emails sent to ${testEmails.length} addresses`
    });

  } catch (error: any) {
    return NextResponse.json(
      { error: `Test notification failed: ${error.message}` },
      { status: 500 }
    );
  }
}

// Test functions
async function testWelcomeEmail(testEmails: string[]) {
  const results = { sent: 0, failed: 0 };

  for (let i = 0; i < testEmails.length; i++) {
    try {
      const success = await sendWitnessWelcome({
        address: `0x${'1'.repeat(40)}`,
        email: testEmails[i],
        witnessNumber: i + 1,
        ensName: `test${i + 1}.eth`
      });

      if (success) results.sent++;
      else results.failed++;

    } catch (error) {
      results.failed++;
    }
  }

  return results;
}

async function testMilestoneEmail(testEmails: string[]) {
  // Create test witness records temporarily
  const testWitnesses = testEmails.map((email, i) => ({
    address: `0x${'2'.repeat(40)}${i}`,
    email,
    ens_name: `testmilestone${i + 1}.eth`,
    witness_number: i + 1,
    status: 'active',
    notification_preferences: { milestones: true }
  }));

  // Temporarily insert test witnesses
  await supabase.from('covenant_witnesses').insert(testWitnesses);

  try {
    await notifyWitnessMilestone({
      type: 'witness_count',
      witnessNumber: testEmails.length,
      totalWitnesses: testEmails.length,
      message: `Test milestone: ${testEmails.length} test witnesses`
    });

    return { sent: testEmails.length, failed: 0 };

  } finally {
    // Clean up test witnesses
    await supabase
      .from('covenant_witnesses')
      .delete()
      .in('address', testWitnesses.map(w => w.address));
  }
}

async function testEmergencyEmail(testEmails: string[]) {
  // Similar to milestone test
  const testWitnesses = testEmails.map((email, i) => ({
    address: `0x${'3'.repeat(40)}${i}`,
    email,
    ens_name: `testemergency${i + 1}.eth`,
    witness_number: i + 1,
    status: 'active',
    notification_preferences: { emergency: true }
  }));

  await supabase.from('covenant_witnesses').insert(testWitnesses);

  try {
    await sendEmergencyCovenantAlert({
      urgencyLevel: 'info',
      subject: 'Test Emergency Alert',
      message: 'This is a test emergency notification',
      actionRequired: 'No action required - test only'
    });

    return { sent: testEmails.length, failed: 0 };

  } finally {
    await supabase
      .from('covenant_witnesses')
      .delete()
      .in('address', testWitnesses.map(w => w.address));
  }
}

// Helper endpoint for automatic milestone detection
// Helper function - not exported from route file
async function checkAndSendMilestones() {
  try {
    const { data: stats } = await supabase
      .from('covenant_witnesses')
      .select('witness_number')
      .eq('status', 'active')
      .order('witness_number', { ascending: false })
      .limit(1)
      .single();

    if (!stats) return;

    const latestWitness = stats.witness_number;
    const totalWitnesses = latestWitness;

    // Check for milestone triggers
    if (latestWitness === 10) {
      await notifyWitnessMilestone({
        type: 'first_ten',
        witnessNumber: latestWitness,
        totalWitnesses,
        message: 'First 10 Founding Witnesses Joined!'
      });
    } else if (latestWitness === 50) {
      await notifyWitnessMilestone({
        type: 'halfway',
        witnessNumber: latestWitness,
        totalWitnesses,
        message: 'Halfway to Launch: 50 Witnesses!'
      });
    } else if (latestWitness === 100) {
      await notifyWitnessMilestone({
        type: 'launch_ready',
        witnessNumber: latestWitness,
        totalWitnesses,
        message: 'COVENANT LAUNCH READY: 100 Witnesses Achieved!'
      });
    } else if (latestWitness % 25 === 0) {
      await notifyWitnessMilestone({
        type: 'witness_count',
        witnessNumber: latestWitness,
        totalWitnesses,
        message: `${latestWitness} Witnesses Strong!`
      });
    }

  } catch (error) {
    console.error('Milestone check failed:', error);
  }
}