"use strict";
// Registry Gateway Authentication Layer
// Centralizes all auth handling at the Gateway level
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.registryAuth = exports.RegistryAuth = void 0;
exports.authenticateRequest = authenticateRequest;
exports.startMagicAuth = startMagicAuth;
exports.completeMagicAuth = completeMagicAuth;
exports.startWalletAuth = startWalletAuth;
exports.linkWalletToUser = linkWalletToUser;
exports.createWalletAccount = createWalletAccount;
const generated_sdk_1 = require("../generated-sdk");
class RegistryAuth {
    constructor(config = {}) {
        this.apiClient = (0, generated_sdk_1.createRegistryApiClient)();
        this.modernApiClient = generated_sdk_1.registryClient; // Use modern SDK for wallet operations
        // Legacy wallet client removed - now using modern SDK exclusively
        this.tokenCache = new Map();
        // Track used nonces to prevent replay attacks
        this.usedNonces = new Set();
        this.lastNonceCleanup = Date.now();
        this.config = {
            jwtSecret: process.env.JWT_SECRET || 'dev-secret',
            tokenExpiry: 24 * 60 * 60, // 24 hours
            allowAnonymous: false,
            ...config
        };
    }
    // Start magic link authentication
    async startMagicAuth(email) {
        try {
            const result = await this.apiClient.startMagicAuth(email);
            return {
                message: result.message,
                success: true
            };
        }
        catch (error) {
            console.error('[Auth] Magic link start failed:', error);
            return {
                message: error instanceof generated_sdk_1.RegistryApiError ? error.message : 'Authentication failed',
                success: false
            };
        }
    }
    // Complete magic link authentication
    async completeMagicAuth(token) {
        try {
            const result = await this.apiClient.completeMagicAuth(token);
            // Cache the token for future use
            const authToken = {
                token: result.token,
                userId: result.user.id,
                email: result.user.email,
                walletAddress: result.user.walletAddress,
                role: result.user.role,
                authType: 'magic-link',
                expiresAt: Date.now() + (this.config.tokenExpiry * 1000)
            };
            this.tokenCache.set(result.token, authToken);
            return {
                success: true,
                token: result.token,
                user: result.user
            };
        }
        catch (error) {
            console.error('[Auth] Magic link completion failed:', error);
            return {
                success: false,
                error: error instanceof generated_sdk_1.RegistryApiError ? error.message : 'Authentication failed'
            };
        }
    }
    // Start wallet authentication with Privy
    async startWalletAuth(walletAddress, signature, message) {
        try {
            // First, verify the wallet signature is valid
            const signatureValid = await this.verifyWalletSignature(walletAddress, signature, message);
            if (!signatureValid) {
                return {
                    success: false,
                    error: 'Invalid wallet signature'
                };
            }
            // Check if wallet is already linked to a user using modern SDK
            const result = await this.modernApiClient.auth.authenticateWallet(walletAddress, signature, message);
            if (result.requiresOnboarding) {
                return {
                    success: false,
                    requiresOnboarding: true,
                    error: 'Wallet not linked to any account. Please link wallet or create account.'
                };
            }
            // Cache the token for future use
            const authToken = {
                token: result.token,
                userId: result.user.id,
                email: result.user.email,
                walletAddress: result.user.walletAddress,
                role: result.user.role,
                authType: 'wallet',
                expiresAt: Date.now() + (this.config.tokenExpiry * 1000)
            };
            this.tokenCache.set(result.token, authToken);
            return {
                success: true,
                token: result.token,
                user: result.user
            };
        }
        catch (error) {
            console.error('[Auth] Wallet authentication failed:', error);
            return {
                success: false,
                error: error instanceof generated_sdk_1.RegistryApiError ? error.message : 'Wallet authentication failed'
            };
        }
    }
    // Link wallet to existing user account
    async linkWalletToUser(userId, walletAddress, signature) {
        console.log('[RegistryAuth] linkWalletToUser called with:', { userId, walletAddress, hasSignature: !!signature });
        try {
            // Use modern SDK with enhanced error handling
            console.log('[RegistryAuth] Calling modernApiClient.auth.linkUserWallet');
            const result = await this.modernApiClient.auth.linkUserWallet(userId, walletAddress, signature);
            console.log('[RegistryAuth] linkUserWallet result:', result);
            return result;
        }
        catch (error) {
            console.error('[Auth] Wallet linking failed:', error);
            return {
                success: false,
                message: error instanceof generated_sdk_1.RegistryApiError ? error.message : 'Failed to link wallet'
            };
        }
    }
    // Create new account with wallet (wallet-first onboarding)
    async createWalletAccount(walletAddress, signature, userData) {
        try {
            const result = await this.modernApiClient.auth.createWalletUser(walletAddress, signature, userData);
            // Cache the token for future use
            const authToken = {
                token: result.token,
                userId: result.user.id,
                email: result.user.email,
                walletAddress: result.user.walletAddress,
                role: result.user.role || 'guest',
                authType: 'wallet',
                expiresAt: Date.now() + (this.config.tokenExpiry * 1000)
            };
            this.tokenCache.set(result.token, authToken);
            return {
                success: true,
                token: result.token,
                user: result.user
            };
        }
        catch (error) {
            console.error('[Auth] Wallet account creation failed:', error);
            return {
                success: false,
                error: error instanceof generated_sdk_1.RegistryApiError ? error.message : 'Failed to create wallet account'
            };
        }
    }
    // Verify wallet signature using proper cryptographic verification
    async verifyWalletSignature(walletAddress, signature, message) {
        try {
            // Import signature verification utilities
            const { authenticateWalletSignature } = await Promise.resolve().then(() => __importStar(require('@/lib/wallet/signature-verification')));
            // Use comprehensive signature verification with replay protection
            const result = await authenticateWalletSignature(message, signature, walletAddress, {
                maxAgeMinutes: 5, // Messages must be recent
                checkReplayProtection: true,
                usedNonces: this.usedNonces
            });
            // Store nonce to prevent replay attacks
            if (result.isValid && result.nonce) {
                this.usedNonces.add(result.nonce);
                // Clean up old nonces periodically
                this.cleanupOldNonces();
            }
            if (!result.isValid) {
                console.warn(`[Auth] Wallet signature verification failed: ${result.error}`);
            }
            return result.isValid;
        }
        catch (error) {
            console.error('[Auth] Wallet signature verification error:', error);
            return false;
        }
    }
    // Cleanup old nonces to prevent memory leaks
    cleanupOldNonces() {
        const now = Date.now();
        // Clean up every hour
        if (now - this.lastNonceCleanup > 60 * 60 * 1000) {
            // In production, you'd use a more sophisticated cleanup strategy
            // For now, just clear all nonces periodically
            this.usedNonces.clear();
            this.lastNonceCleanup = now;
        }
    }
    // Validate JWT token
    async validateToken(token) {
        try {
            // Check cache first
            const cachedToken = this.tokenCache.get(token);
            if (cachedToken) {
                if (Date.now() < cachedToken.expiresAt) {
                    return { valid: true, user: cachedToken };
                }
                else {
                    // Token expired, remove from cache
                    this.tokenCache.delete(token);
                    return { valid: false, error: 'Token expired' };
                }
            }
            // If not in cache, validate against Registry
            // Note: This is a simplified implementation
            // In production, you'd verify JWT signature
            if (!token || token.length < 10) {
                return { valid: false, error: 'Invalid token format' };
            }
            // For now, return invalid - in production, implement proper JWT validation
            return { valid: false, error: 'Token validation not implemented' };
        }
        catch (error) {
            console.error('[Auth] Token validation failed:', error);
            return { valid: false, error: 'Validation failed' };
        }
    }
    // Extract token from request headers
    extractToken(headers) {
        const authHeader = headers.authorization || headers.Authorization;
        if (!authHeader)
            return null;
        // Support both "Bearer <token>" and direct token formats
        if (authHeader.startsWith('Bearer ')) {
            return authHeader.substring(7);
        }
        return authHeader;
    }
    // Middleware for protecting Gateway endpoints
    async authenticateRequest(headers) {
        // Allow anonymous access if configured
        if (this.config.allowAnonymous) {
            return { authenticated: true };
        }
        const token = this.extractToken(headers);
        if (!token) {
            return {
                authenticated: false,
                error: 'Missing authentication token'
            };
        }
        const validation = await this.validateToken(token);
        if (!validation.valid) {
            return {
                authenticated: false,
                error: validation.error || 'Invalid token'
            };
        }
        return {
            authenticated: true,
            user: validation.user
        };
    }
    // Check if user has required role/permissions
    hasPermission(user, requiredRole) {
        if (!user)
            return false;
        // Simple role hierarchy
        const roleHierarchy = {
            'guest': 0,
            'trainer': 1,
            'curator': 2,
            'admin': 3
        };
        const userLevel = roleHierarchy[user.role] || 0;
        const requiredLevel = roleHierarchy[requiredRole] || 0;
        return userLevel >= requiredLevel;
    }
    // Get current user from token
    async getCurrentUser(token) {
        const validation = await this.validateToken(token);
        return validation.valid ? validation.user || null : null;
    }
    // Logout - invalidate token
    logout(token) {
        this.tokenCache.delete(token);
    }
    // Clear expired tokens from cache
    clearExpiredTokens() {
        const now = Date.now();
        for (const [token, authToken] of this.tokenCache.entries()) {
            if (now >= authToken.expiresAt) {
                this.tokenCache.delete(token);
            }
        }
    }
    // Get auth stats for monitoring
    getAuthStats() {
        const now = Date.now();
        let validTokens = 0;
        let expiredTokens = 0;
        for (const authToken of this.tokenCache.values()) {
            if (now < authToken.expiresAt) {
                validTokens++;
            }
            else {
                expiredTokens++;
            }
        }
        return {
            cachedTokens: this.tokenCache.size,
            validTokens,
            expiredTokens
        };
    }
}
exports.RegistryAuth = RegistryAuth;
// Export singleton instance
exports.registryAuth = new RegistryAuth({
    allowAnonymous: process.env.NODE_ENV === 'development'
});
// Convenience functions
async function authenticateRequest(headers) {
    return exports.registryAuth.authenticateRequest(headers);
}
async function startMagicAuth(email) {
    return exports.registryAuth.startMagicAuth(email);
}
async function completeMagicAuth(token) {
    return exports.registryAuth.completeMagicAuth(token);
}
async function startWalletAuth(walletAddress, signature, message) {
    return exports.registryAuth.startWalletAuth(walletAddress, signature, message);
}
async function linkWalletToUser(userId, walletAddress, signature) {
    return exports.registryAuth.linkWalletToUser(userId, walletAddress, signature);
}
async function createWalletAccount(walletAddress, signature, userData) {
    return exports.registryAuth.createWalletAccount(walletAddress, signature, userData);
}
