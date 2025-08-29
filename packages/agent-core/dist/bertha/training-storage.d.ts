interface TrainingRecord {
    id: string;
    trainer: string;
    timestamp: string;
    responses: Record<string, any>;
    configUpdates?: any;
    status: 'pending' | 'processed' | 'integrated';
}
export declare function saveTrainingData(data: TrainingRecord): Promise<void>;
export declare function loadTrainingData(): Promise<TrainingRecord[]>;
export declare function getLatestTrainingConfig(): Promise<Record<string, any>>;
export declare function initializeBootstrapData(): Promise<void>;
export declare function sendTrainingNotification(trainerEmail: string, trainingData: TrainingRecord): Promise<void>;
export declare function exportToGoogleSheets(trainingData: TrainingRecord): Promise<string>;
export declare function formatAsCSV(trainingData: TrainingRecord): string;
export {};
