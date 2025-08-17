import { SyncService } from './sync-service';
import { EdenSync } from './eden-sync';
import { NeynarSync } from './neynar-sync';
import { AlchemySync } from './alchemy-sync';

export class SyncManager {
  private services: Map<string, SyncService>;
  private syncInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.services = new Map();
    this.initializeServices();
  }

  private initializeServices() {
    // Initialize sync services
    this.services.set('eden', new EdenSync());
    this.services.set('neynar', new NeynarSync());
    this.services.set('alchemy', new AlchemySync());
  }

  async syncAll(): Promise<void> {
    console.log('[SyncManager] Starting full sync...');
    
    const results = await Promise.allSettled(
      Array.from(this.services.entries()).map(([name, service]) =>
        service.sync().catch(error => {
          console.error(`[SyncManager] ${name} sync failed:`, error);
          throw error;
        })
      )
    );

    const failed = results.filter(r => r.status === 'rejected');
    if (failed.length > 0) {
      console.warn(`[SyncManager] ${failed.length} services failed to sync`);
    } else {
      console.log('[SyncManager] All services synced successfully');
    }
  }

  async syncService(serviceName: string): Promise<void> {
    const service = this.services.get(serviceName);
    if (!service) {
      throw new Error(`Service ${serviceName} not found`);
    }
    
    await service.sync();
  }

  startAutoSync(intervalMs: number = 5 * 60 * 1000) {
    if (this.syncInterval) {
      this.stopAutoSync();
    }

    console.log(`[SyncManager] Starting auto-sync every ${intervalMs}ms`);
    this.syncInterval = setInterval(() => {
      this.syncAll().catch(error => {
        console.error('[SyncManager] Auto-sync failed:', error);
      });
    }, intervalMs);

    // Run initial sync
    this.syncAll();
  }

  stopAutoSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
      console.log('[SyncManager] Auto-sync stopped');
    }
  }

  getStatus(): Map<string, { lastSync: Date | null; status: string }> {
    const status = new Map();
    
    for (const [name, service] of this.services.entries()) {
      status.set(name, service.getStatus());
    }
    
    return status;
  }
}

// Singleton instance
let syncManager: SyncManager | null = null;

export function getSyncManager(): SyncManager {
  if (!syncManager) {
    syncManager = new SyncManager();
  }
  return syncManager;
}