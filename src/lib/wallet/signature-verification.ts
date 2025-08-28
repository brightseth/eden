import { ethers } from 'ethers';

/**
 * Wallet Signature Verification Utilities
 * 
 * Provides secure verification of wallet signatures using ethers.js
 * Supports EIP-191 (personal sign) and EIP-712 (typed data) standards
 */

export interface SignatureVerificationResult {
  isValid: boolean;
  recoveredAddress?: string;
  error?: string;
}

/**
 * Generate a secure message for wallet signing
 * Includes nonce and timestamp to prevent replay attacks
 */
export function generateSignMessage(walletAddress: string, nonce?: string): string {
  const timestamp = Date.now();
  const messageNonce = nonce || generateNonce();
  
  return `Sign in to Eden Academy with your wallet.

Wallet: ${walletAddress}
Timestamp: ${timestamp}
Nonce: ${messageNonce}

This request will not trigger a blockchain transaction or cost any gas fees.`;
}

/**
 * Generate a cryptographically secure nonce
 */
export function generateNonce(): string {
  return ethers.randomBytes(16).reduce((acc, byte) => acc + byte.toString(16).padStart(2, '0'), '');
}

/**
 * Verify a wallet signature using EIP-191 (personal sign)
 * This is the standard method used by most wallet connect flows
 */
export async function verifyPersonalSignature(
  message: string,
  signature: string,
  expectedAddress: string
): Promise<SignatureVerificationResult> {
  try {
    // Validate inputs
    if (!message || !signature || !expectedAddress) {
      return {
        isValid: false,
        error: 'Missing required parameters'
      };
    }

    // Validate signature format (should be 65 bytes hex)
    if (!signature.match(/^0x[a-fA-F0-9]{130}$/)) {
      return {
        isValid: false,
        error: 'Invalid signature format'
      };
    }

    // Validate address format
    if (!ethers.isAddress(expectedAddress)) {
      return {
        isValid: false,
        error: 'Invalid wallet address format'
      };
    }

    // Recover the address from the signature
    const recoveredAddress = ethers.verifyMessage(message, signature);

    // Compare with expected address (case-insensitive)
    const isValid = recoveredAddress.toLowerCase() === expectedAddress.toLowerCase();

    return {
      isValid,
      recoveredAddress,
      error: isValid ? undefined : 'Signature does not match expected wallet address'
    };

  } catch (error) {
    console.error('Signature verification error:', error);
    return {
      isValid: false,
      error: error instanceof Error ? error.message : 'Signature verification failed'
    };
  }
}

/**
 * Verify an EIP-712 typed data signature
 * Used for more structured signing with domain separation
 */
export async function verifyTypedDataSignature(
  domain: ethers.TypedDataDomain,
  types: Record<string, ethers.TypedDataField[]>,
  value: Record<string, any>,
  signature: string,
  expectedAddress: string
): Promise<SignatureVerificationResult> {
  try {
    // Validate inputs
    if (!domain || !types || !value || !signature || !expectedAddress) {
      return {
        isValid: false,
        error: 'Missing required parameters for typed data verification'
      };
    }

    // Validate signature format
    if (!signature.match(/^0x[a-fA-F0-9]{130}$/)) {
      return {
        isValid: false,
        error: 'Invalid signature format'
      };
    }

    // Validate address format
    if (!ethers.isAddress(expectedAddress)) {
      return {
        isValid: false,
        error: 'Invalid wallet address format'
      };
    }

    // Recover the address from the typed data signature
    const recoveredAddress = ethers.verifyTypedData(domain, types, value, signature);

    // Compare with expected address (case-insensitive)
    const isValid = recoveredAddress.toLowerCase() === expectedAddress.toLowerCase();

    return {
      isValid,
      recoveredAddress,
      error: isValid ? undefined : 'Typed data signature does not match expected wallet address'
    };

  } catch (error) {
    console.error('Typed data signature verification error:', error);
    return {
      isValid: false,
      error: error instanceof Error ? error.message : 'Typed data signature verification failed'
    };
  }
}

/**
 * Create EIP-712 domain for Eden Academy
 */
export function createEdenDomain(): ethers.TypedDataDomain {
  return {
    name: 'Eden Academy',
    version: '1',
    chainId: 1, // Mainnet, can be overridden
    verifyingContract: '0x0000000000000000000000000000000000000000' // Placeholder, not used for auth
  };
}

/**
 * EIP-712 types for Eden Academy authentication
 */
export const EDEN_AUTH_TYPES = {
  Authentication: [
    { name: 'message', type: 'string' },
    { name: 'walletAddress', type: 'address' },
    { name: 'timestamp', type: 'uint256' },
    { name: 'nonce', type: 'string' }
  ]
};

/**
 * Comprehensive signature verification that tries multiple methods
 * Prioritizes personal sign (most common) but falls back to other methods
 */
export async function verifyWalletSignature(
  message: string,
  signature: string,
  expectedAddress: string,
  options?: {
    allowPersonalSign?: boolean;
    allowTypedData?: boolean;
    domain?: ethers.TypedDataDomain;
  }
): Promise<SignatureVerificationResult> {
  const opts = {
    allowPersonalSign: true,
    allowTypedData: false,
    ...options
  };

  // Try personal sign first (most common)
  if (opts.allowPersonalSign) {
    const personalResult = await verifyPersonalSignature(message, signature, expectedAddress);
    if (personalResult.isValid) {
      return personalResult;
    }
  }

  // Try EIP-712 if enabled and domain provided
  if (opts.allowTypedData && opts.domain) {
    try {
      // Parse message as JSON for typed data
      const parsedMessage = JSON.parse(message);
      const typedResult = await verifyTypedDataSignature(
        opts.domain,
        EDEN_AUTH_TYPES,
        parsedMessage,
        signature,
        expectedAddress
      );
      if (typedResult.isValid) {
        return typedResult;
      }
    } catch {
      // Message is not valid JSON, skip typed data verification
    }
  }

  return {
    isValid: false,
    error: 'Could not verify signature with any supported method'
  };
}

/**
 * Validate message freshness to prevent replay attacks
 */
export function validateMessageFreshness(message: string, maxAgeMinutes: number = 5): boolean {
  try {
    // Extract timestamp from message
    const timestampMatch = message.match(/Timestamp: (\d+)/);
    if (!timestampMatch) {
      return false;
    }

    const messageTimestamp = parseInt(timestampMatch[1]);
    const now = Date.now();
    const maxAge = maxAgeMinutes * 60 * 1000;

    return (now - messageTimestamp) <= maxAge;
  } catch {
    return false;
  }
}

/**
 * Extract nonce from message for replay attack prevention
 */
export function extractNonce(message: string): string | null {
  try {
    const nonceMatch = message.match(/Nonce: ([a-fA-F0-9]+)/);
    return nonceMatch ? nonceMatch[1] : null;
  } catch {
    return null;
  }
}

/**
 * High-level wallet authentication verification
 * Includes freshness and replay attack protection
 */
export async function authenticateWalletSignature(
  message: string,
  signature: string,
  walletAddress: string,
  options?: {
    maxAgeMinutes?: number;
    checkReplayProtection?: boolean;
    usedNonces?: Set<string>;
  }
): Promise<SignatureVerificationResult & { nonce?: string }> {
  const opts = {
    maxAgeMinutes: 5,
    checkReplayProtection: true,
    ...options
  };

  // Check message freshness
  if (!validateMessageFreshness(message, opts.maxAgeMinutes)) {
    return {
      isValid: false,
      error: 'Message is too old or invalid timestamp'
    };
  }

  // Check for replay attacks if enabled
  if (opts.checkReplayProtection && opts.usedNonces) {
    const nonce = extractNonce(message);
    if (!nonce) {
      return {
        isValid: false,
        error: 'Message missing nonce for replay protection'
      };
    }

    if (opts.usedNonces.has(nonce)) {
      return {
        isValid: false,
        error: 'Nonce already used (replay attack detected)'
      };
    }
  }

  // Verify the signature
  const verificationResult = await verifyWalletSignature(message, signature, walletAddress);

  // Add nonce to result if verification succeeded
  if (verificationResult.isValid && opts.checkReplayProtection) {
    const nonce = extractNonce(message);
    return {
      ...verificationResult,
      nonce
    };
  }

  return verificationResult;
}