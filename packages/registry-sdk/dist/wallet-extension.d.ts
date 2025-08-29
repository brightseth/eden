/**
 * Wallet Authentication Extension for Registry SDK
 *
 * Extends the generated Registry API client with wallet authentication methods
 * Following Registry Guardian principles to maintain single source of truth
 *
 * DEPRECATED: Use the new RegistryClient with AuthService instead
 * This file maintains backward compatibility only
 */
import { RegistryApiClient } from '@/lib/generated-sdk';
export interface WalletUser {
    id: string;
    email?: string;
    walletAddress?: string;
    role: string;
    authMethod: 'EMAIL' | 'WALLET' | 'HYBRID';
    displayName: string;
    createdAt: string;
    updatedAt: string;
}
export interface WalletAuthRequest {
    walletAddress: string;
    signature: string;
    message: string;
}
export interface WalletAuthResponse {
    success: boolean;
    token?: string;
    user?: WalletUser;
    requiresOnboarding?: boolean;
    error?: string;
}
export interface CreateWalletAccountRequest {
    walletAddress: string;
    signature: string;
    displayName: string;
    email?: string;
}
export interface LinkWalletRequest {
    userId: string;
    walletAddress: string;
    signature: string;
}
/**
 * Extended Registry API Client with Wallet Authentication
 *
 * This class extends the generated SDK while maintaining compatibility
 * All wallet methods follow the same patterns as existing magic link auth
 */
export declare class WalletRegistryApiClient extends RegistryApiClient {
    /**
     * Authenticate user with wallet signature
     * Similar to completeMagicAuth but for wallet-based authentication
     */
    authenticateWallet(walletAddress: string, signature: string, message: string): Promise<WalletAuthResponse>;
    /**
     * Create new user account with wallet
     * Registry-compliant: creates User record with wallet as auth method
     */
    createWalletUser(walletAddress: string, signature: string, userData: {
        displayName: string;
        email?: string;
    }): Promise<WalletAuthResponse>;
    /**
     * Link wallet to existing user account
     * Registry-compliant: updates existing User record with wallet address
     */
    linkUserWallet(userId: string, walletAddress: string, signature: string): Promise<{
        success: boolean;
        message: string;
    }>;
    /**
     * Get user by wallet address
     * Registry lookup for existing wallet associations
     */
    getUserByWallet(walletAddress: string): Promise<WalletUser | null>;
    /**
     * Verify wallet ownership
     * Used for security checks and wallet linking verification
     */
    verifyWalletOwnership(userId: string, walletAddress: string): Promise<{
        verified: boolean;
    }>;
    /**
     * Get user's linked wallets
     * Returns all wallet addresses associated with a user account
     */
    getUserWallets(userId: string): Promise<{
        wallets: Array<{
            address: string;
            isPrimary: boolean;
            linkedAt: string;
        }>;
    }>;
    /**
     * Unlink wallet from user account
     * Removes wallet association while preserving user identity
     */
    unlinkUserWallet(userId: string, walletAddress: string): Promise<{
        success: boolean;
        message: string;
    }>;
    /**
     * Generate secure message for wallet signing
     * Provides nonce and timestamp for replay attack prevention
     */
    generateWalletMessage(walletAddress: string): Promise<{
        message: string;
        nonce: string;
        expiresAt: number;
    }>;
    /**
     * Health check for wallet authentication endpoints
     */
    walletAuthHealth(): Promise<{
        status: string;
        walletAuthEnabled: boolean;
        supportedMethods: string[];
    }>;
}
/**
 * Factory function for creating wallet-enabled Registry API client
 */
export declare function createWalletRegistryApiClient(config?: any): WalletRegistryApiClient;
/**
 * Default wallet-enabled Registry client instance
 */
export declare const walletRegistryApi: WalletRegistryApiClient;
/**
 * Type-safe wrapper functions for common wallet auth operations
 * These maintain the same interface patterns as the base SDK
 */
export declare function authenticateWallet(walletAddress: string, signature: string, message: string): Promise<WalletAuthResponse>;
export declare function createWalletAccount(walletAddress: string, signature: string, userData: {
    displayName: string;
    email?: string;
}): Promise<WalletAuthResponse>;
export declare function linkWalletToUser(userId: string, walletAddress: string, signature: string): Promise<{
    success: boolean;
    message: string;
}>;
export declare function getUserByWallet(walletAddress: string): Promise<WalletUser | null>;
export declare function generateWalletMessage(walletAddress: string): Promise<{
    message: string;
    nonce: string;
    expiresAt: number;
}>;
/**
 * NEW APPROACH - ADR-019 Compliant
 *
 * Use the new RegistryClient for wallet authentication instead of the legacy functions above.
 * This provides better error handling, caching, retries, and telemetry.
 */
export declare function createWalletEnabledRegistryClient(config?: {
    apiKey?: string;
    timeout?: number;
    cache?: boolean;
    telemetry?: boolean;
}): any;
export declare const modernWalletRegistryClient: any;
/**
 * Modern wallet authentication using the new SDK
 *
 * Example usage:
 *
 * ```typescript
 * import { modernWalletRegistryClient } from '@/lib/registry/wallet-extension';
 *
 * // Authenticate with wallet
 * const result = await modernWalletRegistryClient.auth.authenticateWallet(
 *   walletAddress,
 *   signature,
 *   message
 * );
 *
 * // Create wallet account
 * const newUser = await modernWalletRegistryClient.auth.createWalletUser(
 *   walletAddress,
 *   signature,
 *   { displayName: 'User Name', email: 'user@example.com' }
 * );
 *
 * // Link wallet to existing user
 * const linkResult = await modernWalletRegistryClient.auth.linkUserWallet(
 *   userId,
 *   walletAddress,
 *   signature
 * );
 * ```
 */ 
