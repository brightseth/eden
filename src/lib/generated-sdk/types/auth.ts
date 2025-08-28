// Authentication-related types for Registry API
// Following ADR-019 Registry Integration Pattern
// Includes wallet authentication types

export interface User {
  id: string;
  email?: string;
  walletAddress?: string;
  role: string;
  authMethod: 'EMAIL' | 'WALLET' | 'HYBRID';
  displayName: string;
  createdAt: string;
  updatedAt: string;
}

// Magic Link Authentication
export interface MagicLinkRequest {
  email: string;
  redirectUrl?: string;
}

export interface MagicLinkResponse {
  success: boolean;
  message: string;
}

export interface CompleteMagicAuthRequest {
  token: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: User;
  error?: string;
}

// Wallet Authentication (from your implementation)
export interface WalletAuthRequest {
  walletAddress: string;
  signature: string;
  message: string;
}

export interface WalletAuthResponse {
  success: boolean;
  token?: string;
  user?: User;
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

export interface WalletMessageRequest {
  walletAddress: string;
}

export interface WalletMessageResponse {
  message: string;
  nonce: string;
  expiresAt: number;
}

// Applications
export interface Application {
  applicantEmail: string;
  applicantName: string;
  track: 'AGENT' | 'TRAINER' | 'CURATOR' | 'COLLECTOR' | 'INVESTOR';
  payload: Record<string, unknown>;
}

export interface CreateApplicationRequest {
  applicantEmail: string;
  applicantName: string;
  track: Application['track'];
  payload: Record<string, unknown>;
}

export interface ApplicationResponse {
  success: boolean;
  applicationId?: string;
  message?: string;
  error?: string;
}