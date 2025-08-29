/**
 * MIYOMI Automated Workflow Scheduler
 * Manages the full lifecycle from pick generation to deployment
 */
interface ScheduledDrop {
    id: string;
    scheduledFor: string;
    status: 'scheduled' | 'generating' | 'curating' | 'producing' | 'ready' | 'deployed' | 'failed';
    picks: any[];
    videoUrl?: string;
    error?: string;
}
export declare class MiyomiScheduler {
    private scheduledDrops;
    private isRunning;
    /**
     * Start the automated scheduler
     * MIYOMI drops at 11:00, 15:00, 21:00 ET daily
     */
    start(): void;
    stop(): void;
    /**
     * Execute the full workflow for a daily drop
     */
    executeDailyWorkflow(): Promise<string>;
    /**
     * Auto-select the best pick based on confidence, edge, and risk
     */
    private autoSelectBestPick;
    /**
     * Request video production from Eden
     */
    private requestVideoProduction;
    /**
     * Deploy the completed drop to the site
     */
    private deployToSite;
    /**
     * Execute fallback workflow when main workflow fails
     */
    private executeFallbackWorkflow;
    /**
     * Check status of pending drops and retry if needed
     */
    private checkPendingDrops;
    private getSectorMood;
    private getTrainerConfig;
    getStatus(): {
        running: boolean;
        scheduledDrops: number;
        recentDrops: ScheduledDrop[];
    };
}
export declare const miyomiScheduler: MiyomiScheduler;
export {};
