interface AuthToken {
    token: string;
    userId: string;
    email?: string;
    walletAddress?: string;
    role: string;
    authType: 'magic-link' | 'wallet';
    expiresAt: number;
}
interface AuthConfig {
    jwtSecret?: string;
    tokenExpiry?: number;
    allowAnonymous?: boolean;
}
export declare class RegistryAuth {
    private config;
    private apiClient;
    private modernApiClient;
    private tokenCache;
    constructor(config?: AuthConfig);
    startMagicAuth(email: string): Promise<{
        message: string;
        success: boolean;
    }>;
    completeMagicAuth(token: string): Promise<{
        success: boolean;
        token?: string;
        user?: any;
        error?: string;
    }>;
    startWalletAuth(walletAddress: string, signature: string, message: string): Promise<{
        success: boolean;
        token?: string;
        user?: any;
        requiresOnboarding?: boolean;
        error?: string;
    }>;
    linkWalletToUser(userId: string, walletAddress: string, signature: string): Promise<{
        success: boolean;
        message: string;
    }>;
    createWalletAccount(walletAddress: string, signature: string, userData: {
        displayName: string;
        email?: string;
    }): Promise<{
        success: boolean;
        token?: string;
        user?: any;
        error?: string;
    }>;
    private verifyWalletSignature;
    private usedNonces;
    private lastNonceCleanup;
    private cleanupOldNonces;
    validateToken(token: string): Promise<{
        valid: boolean;
        user?: AuthToken;
        error?: string;
    }>;
    extractToken(headers: Record<string, string | undefined>): string | null;
    authenticateRequest(headers: Record<string, string | undefined>): Promise<{
        authenticated: boolean;
        user?: AuthToken;
        error?: string;
    }>;
    hasPermission(user: AuthToken | undefined, requiredRole: string): boolean;
    getCurrentUser(token: string): Promise<AuthToken | null>;
    logout(token: string): void;
    clearExpiredTokens(): void;
    getAuthStats(): {
        cachedTokens: number;
        validTokens: number;
        expiredTokens: number;
    };
}
export declare const registryAuth: RegistryAuth;
export declare function authenticateRequest(headers: Record<string, string | undefined>): Promise<{
    authenticated: boolean;
    user?: AuthToken;
    error?: string;
}>;
export declare function startMagicAuth(email: string): Promise<{
    message: string;
    success: boolean;
}>;
export declare function completeMagicAuth(token: string): Promise<{
    success: boolean;
    token?: string;
    user?: any;
    error?: string;
}>;
export declare function startWalletAuth(walletAddress: string, signature: string, message: string): Promise<{
    success: boolean;
    token?: string;
    user?: any;
    requiresOnboarding?: boolean;
    error?: string;
}>;
export declare function linkWalletToUser(userId: string, walletAddress: string, signature: string): Promise<{
    success: boolean;
    message: string;
}>;
export declare function createWalletAccount(walletAddress: string, signature: string, userData: {
    displayName: string;
    email?: string;
}): Promise<{
    success: boolean;
    token?: string;
    user?: any;
    error?: string;
}>;
export {};
