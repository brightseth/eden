"use strict";
/**
 * Wallet Authentication Extension for Registry SDK
 *
 * Extends the generated Registry API client with wallet authentication methods
 * Following Registry Guardian principles to maintain single source of truth
 *
 * DEPRECATED: Use the new RegistryClient with AuthService instead
 * This file maintains backward compatibility only
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.modernWalletRegistryClient = exports.walletRegistryApi = exports.WalletRegistryApiClient = void 0;
exports.createWalletRegistryApiClient = createWalletRegistryApiClient;
exports.authenticateWallet = authenticateWallet;
exports.createWalletAccount = createWalletAccount;
exports.linkWalletToUser = linkWalletToUser;
exports.getUserByWallet = getUserByWallet;
exports.generateWalletMessage = generateWalletMessage;
exports.createWalletEnabledRegistryClient = createWalletEnabledRegistryClient;
const generated_sdk_1 = require("@/lib/generated-sdk");
/**
 * Extended Registry API Client with Wallet Authentication
 *
 * This class extends the generated SDK while maintaining compatibility
 * All wallet methods follow the same patterns as existing magic link auth
 */
class WalletRegistryApiClient extends generated_sdk_1.RegistryApiClient {
    /**
     * Authenticate user with wallet signature
     * Similar to completeMagicAuth but for wallet-based authentication
     */
    async authenticateWallet(walletAddress, signature, message) {
        try {
            // Use mock endpoint for testing until Registry is deployed
            const endpoint = process.env.NODE_ENV === 'development'
                ? '/api/registry-mock/auth/wallet/verify'
                : '/auth/wallet/verify';
            return await this.request(endpoint, {
                method: 'POST',
                body: JSON.stringify({
                    walletAddress,
                    signature,
                    message
                }),
            });
        }
        catch (error) {
            if (error instanceof generated_sdk_1.RegistryApiError) {
                // Handle specific wallet auth errors
                if (error.status === 404) {
                    return {
                        success: false,
                        requiresOnboarding: true,
                        error: 'Wallet not linked to any account'
                    };
                }
            }
            throw error;
        }
    }
    /**
     * Create new user account with wallet
     * Registry-compliant: creates User record with wallet as auth method
     */
    async createWalletUser(walletAddress, signature, userData) {
        // Use mock endpoint for testing until Registry is deployed
        const endpoint = process.env.NODE_ENV === 'development'
            ? '/api/registry-mock/auth/wallet/create-account'
            : '/auth/wallet/create-account';
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify({
                walletAddress,
                signature,
                displayName: userData.displayName,
                email: userData.email
            }),
        });
    }
    /**
     * Link wallet to existing user account
     * Registry-compliant: updates existing User record with wallet address
     */
    async linkUserWallet(userId, walletAddress, signature) {
        // Use mock endpoint for testing until Registry is deployed
        const endpoint = process.env.NODE_ENV === 'development'
            ? `/api/registry-mock/users/${userId}/wallet/link`
            : `/users/${userId}/wallet/link`;
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify({
                walletAddress,
                signature
            }),
        });
    }
    /**
     * Get user by wallet address
     * Registry lookup for existing wallet associations
     */
    async getUserByWallet(walletAddress) {
        try {
            return await this.request(`/users/wallet/${walletAddress}`);
        }
        catch (error) {
            if (error instanceof generated_sdk_1.RegistryApiError && error.status === 404) {
                return null;
            }
            throw error;
        }
    }
    /**
     * Verify wallet ownership
     * Used for security checks and wallet linking verification
     */
    async verifyWalletOwnership(userId, walletAddress) {
        return this.request(`/users/${userId}/wallet/${walletAddress}/verify`);
    }
    /**
     * Get user's linked wallets
     * Returns all wallet addresses associated with a user account
     */
    async getUserWallets(userId) {
        return this.request(`/users/${userId}/wallets`);
    }
    /**
     * Unlink wallet from user account
     * Removes wallet association while preserving user identity
     */
    async unlinkUserWallet(userId, walletAddress) {
        return this.request(`/users/${userId}/wallet/${walletAddress}`, {
            method: 'DELETE'
        });
    }
    /**
     * Generate secure message for wallet signing
     * Provides nonce and timestamp for replay attack prevention
     */
    async generateWalletMessage(walletAddress) {
        return this.request('/auth/wallet/generate-message', {
            method: 'POST',
            body: JSON.stringify({ walletAddress }),
        });
    }
    /**
     * Health check for wallet authentication endpoints
     */
    async walletAuthHealth() {
        return this.request('/auth/wallet/health');
    }
}
exports.WalletRegistryApiClient = WalletRegistryApiClient;
/**
 * Factory function for creating wallet-enabled Registry API client
 */
function createWalletRegistryApiClient(config) {
    return new WalletRegistryApiClient(config);
}
/**
 * Default wallet-enabled Registry client instance
 */
exports.walletRegistryApi = new WalletRegistryApiClient();
/**
 * Type-safe wrapper functions for common wallet auth operations
 * These maintain the same interface patterns as the base SDK
 */
// Authenticate with wallet (similar to completeMagicAuth)
async function authenticateWallet(walletAddress, signature, message) {
    return exports.walletRegistryApi.authenticateWallet(walletAddress, signature, message);
}
// Create wallet-based account
async function createWalletAccount(walletAddress, signature, userData) {
    return exports.walletRegistryApi.createWalletUser(walletAddress, signature, userData);
}
// Link wallet to existing user
async function linkWalletToUser(userId, walletAddress, signature) {
    return exports.walletRegistryApi.linkUserWallet(userId, walletAddress, signature);
}
// Get user by wallet
async function getUserByWallet(walletAddress) {
    return exports.walletRegistryApi.getUserByWallet(walletAddress);
}
// Generate signing message
async function generateWalletMessage(walletAddress) {
    return exports.walletRegistryApi.generateWalletMessage(walletAddress);
}
/**
 * NEW APPROACH - ADR-019 Compliant
 *
 * Use the new RegistryClient for wallet authentication instead of the legacy functions above.
 * This provides better error handling, caching, retries, and telemetry.
 */
// Create wallet-enabled Registry client with enhanced features
function createWalletEnabledRegistryClient(config) {
    return (0, generated_sdk_1.createRegistryClient)({
        cache: true,
        telemetry: true,
        timeout: 15000, // Longer timeout for wallet operations
        retries: {
            maxRetries: 3,
            exponentialBackoff: true
        },
        ...config
    });
}
// Default wallet-enabled client instance
exports.modernWalletRegistryClient = createWalletEnabledRegistryClient();
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
