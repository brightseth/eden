import { NextResponse } from 'next/server';

// Mock notification store - will connect to database later
const notificationStore = new Map<string, Array<any>>();

interface Notification {
  id: string;
  user_id: string;
  ts: string;
  type: 'CURATION_VERDICT' | 'MINT_CREATED' | 'SALE_EXECUTED' | 'AGENT_UPDATE' | 'FOLLOW_ADDED';
  agent_id: string;
  agent_name?: string;
  payload: any;
  read: boolean;
  read_at?: string;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');
    const limit = parseInt(searchParams.get('limit') || '50');
    const unreadOnly = searchParams.get('unread') === 'true';
    
    if (!userId) {
      return NextResponse.json(
        { error: 'user_id is required' },
        { status: 400 }
      );
    }
    
    let notifications = notificationStore.get(userId) || [];
    
    // Filter for unread if requested
    if (unreadOnly) {
      notifications = notifications.filter(n => !n.read);
    }
    
    // Sort by timestamp descending and limit
    notifications = notifications
      .sort((a, b) => new Date(b.ts).getTime() - new Date(a.ts).getTime())
      .slice(0, limit);
    
    // Get unread count
    const unreadCount = (notificationStore.get(userId) || [])
      .filter(n => !n.read).length;
    
    return NextResponse.json({
      user_id: userId,
      notifications,
      unread_count: unreadCount,
      total_count: notifications.length
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const notification = await request.json();
    
    if (!notification.user_id || !notification.type || !notification.agent_id) {
      return NextResponse.json(
        { error: 'user_id, type, and agent_id are required' },
        { status: 400 }
      );
    }
    
    // Create notification record
    const newNotification: Notification = {
      id: crypto.randomUUID(),
      user_id: notification.user_id,
      ts: new Date().toISOString(),
      type: notification.type,
      agent_id: notification.agent_id,
      agent_name: notification.agent_name,
      payload: notification.payload || {},
      read: false
    };
    
    // Store notification
    if (!notificationStore.has(notification.user_id)) {
      notificationStore.set(notification.user_id, []);
    }
    notificationStore.get(notification.user_id)!.push(newNotification);
    
    return NextResponse.json({
      success: true,
      notification: newNotification
    });
  } catch (error) {
    console.error('Create notification error:', error);
    return NextResponse.json(
      { error: 'Failed to create notification' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const { user_id, notification_ids, mark_as } = await request.json();
    
    if (!user_id || !notification_ids || !Array.isArray(notification_ids)) {
      return NextResponse.json(
        { error: 'user_id and notification_ids array are required' },
        { status: 400 }
      );
    }
    
    const notifications = notificationStore.get(user_id) || [];
    let updatedCount = 0;
    
    notifications.forEach(notif => {
      if (notification_ids.includes(notif.id)) {
        notif.read = mark_as === 'read';
        if (mark_as === 'read') {
          notif.read_at = new Date().toISOString();
        }
        updatedCount++;
      }
    });
    
    return NextResponse.json({
      success: true,
      updated_count: updatedCount
    });
  } catch (error) {
    console.error('Update notifications error:', error);
    return NextResponse.json(
      { error: 'Failed to update notifications' },
      { status: 500 }
    );
  }
}

// Utility function to create notifications when events happen
async function createNotificationForFollowers(
  agentId: string,
  agentName: string,
  eventType: string,
  eventPayload: any
) {
  // This would query the follow table and create notifications
  // For now, we'll create for demo user
  const demoUserId = 'demo-user';
  
  const notification: Notification = {
    id: crypto.randomUUID(),
    user_id: demoUserId,
    ts: new Date().toISOString(),
    type: eventType as any,
    agent_id: agentId,
    agent_name: agentName,
    payload: eventPayload,
    read: false
  };
  
  if (!notificationStore.has(demoUserId)) {
    notificationStore.set(demoUserId, []);
  }
  notificationStore.get(demoUserId)!.push(notification);
  
  return notification;
}