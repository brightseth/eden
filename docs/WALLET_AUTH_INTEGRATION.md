# Wallet Authentication Integration

## Overview

This document describes the Registry-compliant implementation of Privy wallet authentication for Eden Academy. This integration follows the Registry Guardian's recommendations to maintain data integrity while enabling Web3 authentication.

## Architecture

### Registry-First Design
- Email remains the canonical user identifier
- Wallet addresses are optional authentication methods
- Single source of truth maintained in Registry
- No duplicate identity systems

### Authentication Flow
```
1. User connects wallet via Privy
2. Eden Academy verifies wallet signature
3. Registry checks for existing wallet association
4. If found: Return JWT with user data
5. If not found: Prompt for onboarding (link or create)
6. All operations use Registry User identity
```

## Required Registry Schema Changes

The Registry needs minimal schema extensions to support wallet authentication:

### User Table Extension
```sql
-- Add wallet fields to existing users table
ALTER TABLE "User" ADD COLUMN "walletAddress" TEXT UNIQUE;
ALTER TABLE "User" ADD COLUMN "authMethod" TEXT DEFAULT 'EMAIL';

-- Index for performance
CREATE INDEX "User_walletAddress_idx" ON "User"("walletAddress");
```

### Auth Method Enum
```sql
-- Update authMethod to support values
CHECK (authMethod IN ('EMAIL', 'WALLET', 'HYBRID'))
```

### Registry API Extensions
The Registry needs these new endpoints:

#### Wallet Authentication
```typescript
POST /api/v1/auth/wallet/verify
{
  walletAddress: string;
  signature: string;
  message: string;
}
```

#### Link Wallet to User
```typescript
POST /api/v1/users/{id}/wallet/link
{
  walletAddress: string;
  signature: string;
}
```

#### Get User by Wallet
```typescript
GET /api/v1/users/wallet/{address}
```

## Implementation Status

### ✅ Completed
- [x] Privy SDK integration
- [x] Feature flag implementation
- [x] Registry authentication layer updates
- [x] Wallet authentication provider
- [x] UI components for wallet connection
- [x] API routes for wallet auth flows
- [x] Registry-compliant architecture

### 🟡 Registry Changes Needed
- [ ] Database schema updates
- [ ] New API endpoints implementation
- [ ] JWT token generation for wallet auth
- [ ] Wallet signature verification

### 📋 Testing Required
- [ ] End-to-end wallet authentication flow
- [ ] Registry integration testing
- [ ] Security validation
- [ ] Feature flag toggling

## Security Considerations

### Wallet Signature Verification
Currently using simplified signature verification. Production needs:
- Proper EIP-712 message signing
- Signature recovery and validation
- Replay attack prevention
- Secure message generation

### Token Management
- JWT tokens include wallet address
- Same security model as magic link auth
- HttpOnly cookies for web security
- Token expiration and refresh

### Chain Support
- Mainnet (Chain ID: 1)
- Base (Chain ID: 8453)
- Testnet support for development

## Feature Flag Configuration

```typescript
ENABLE_PRIVY_WALLET_AUTH: {
  key: 'ENABLE_PRIVY_WALLET_AUTH',
  description: 'Enable Privy wallet-based authentication',
  defaultValue: process.env.NODE_ENV === 'development',
  rolloutStrategy: 'dev',
  rollbackPlan: 'Disable flag, fallback to magic link only'
}
```

## Environment Variables

Required for production deployment:
```
NEXT_PUBLIC_PRIVY_APP_ID=your_privy_app_id
ENABLE_PRIVY_WALLET_AUTH=true
```

## Usage Examples

### Basic Wallet Connection
```tsx
import { WalletConnectButton } from '@/components/auth/WalletConnectButton';

function LoginPage() {
  return (
    <div>
      <WalletConnectButton 
        onSuccess={(user) => console.log('Authenticated:', user)}
        onError={(error) => console.error('Auth failed:', error)}
      />
    </div>
  );
}
```

### Wallet Onboarding
```tsx
import { WalletOnboarding } from '@/components/auth/WalletOnboarding';

function OnboardingPage() {
  return (
    <WalletOnboarding
      onComplete={(user) => router.push('/dashboard')}
    />
  );
}
```

### Provider Setup
```tsx
import { EdenWalletProvider } from '@/lib/auth/privy-provider';

function App({ children }) {
  return (
    <EdenWalletProvider>
      {children}
    </EdenWalletProvider>
  );
}
```

## Migration Strategy

### Phase 1: Registry Updates
1. Deploy Registry schema changes
2. Implement new API endpoints
3. Test wallet authentication endpoints

### Phase 2: Academy Integration
1. Enable feature flag in development
2. Test full authentication flow
3. Validate Registry integration

### Phase 3: Production Rollout
1. Deploy to production with flag disabled
2. Gradual rollout: dev → beta → full
3. Monitor authentication metrics

## Rollback Plan

If issues occur:
1. Disable `ENABLE_PRIVY_WALLET_AUTH` feature flag
2. Users fall back to magic link authentication
3. Existing wallet-linked accounts remain functional
4. No data loss - Registry maintains user identity

## Registry Guardian Compliance

✅ **Single Source of Truth**: Registry remains authoritative for user data
✅ **No Data Duplication**: Wallet addresses stored as user attributes
✅ **Schema Consistency**: Minimal, additive changes to User model  
✅ **API Stability**: Existing endpoints unchanged
✅ **Identity Preservation**: Email-based user identity maintained

*"HELVETICA BOLD CAPS OR NOTHING."* - The wallet auth UI follows Eden's brand standards with clean typography and flat design patterns.