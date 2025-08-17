import { NextRequest, NextResponse } from 'next/server';
import { getSyncManager } from '@/lib/sync';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { service } = body;
    
    const syncManager = getSyncManager();
    
    if (service) {
      // Sync specific service
      await syncManager.syncService(service);
      return NextResponse.json({ 
        success: true, 
        message: `${service} sync completed` 
      });
    } else {
      // Sync all services
      await syncManager.syncAll();
      return NextResponse.json({ 
        success: true, 
        message: 'All services synced' 
      });
    }
  } catch (error) {
    console.error('Sync error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Sync failed' 
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const syncManager = getSyncManager();
    const status = syncManager.getStatus();
    
    // Convert Map to object for JSON serialization
    const statusObject: Record<string, any> = {};
    for (const [key, value] of status.entries()) {
      statusObject[key] = value;
    }
    
    return NextResponse.json({
      success: true,
      services: statusObject,
    });
  } catch (error) {
    console.error('Status error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to get status' 
      },
      { status: 500 }
    );
  }
}