export interface SyncStatus {
  lastSync: Date | null;
  status: 'idle' | 'syncing' | 'success' | 'error';
  error?: string;
}

export abstract class SyncService {
  protected lastSync: Date | null = null;
  protected status: SyncStatus['status'] = 'idle';
  protected error?: string;

  abstract sync(): Promise<void>;
  
  getStatus(): SyncStatus {
    return {
      lastSync: this.lastSync,
      status: this.status,
      error: this.error,
    };
  }

  protected async withStatusTracking<T>(
    operation: () => Promise<T>
  ): Promise<T> {
    this.status = 'syncing';
    this.error = undefined;
    
    try {
      const result = await operation();
      this.status = 'success';
      this.lastSync = new Date();
      return result;
    } catch (error) {
      this.status = 'error';
      this.error = error instanceof Error ? error.message : 'Unknown error';
      throw error;
    }
  }
}