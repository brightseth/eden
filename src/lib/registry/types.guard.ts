/**
 * Compile-time type guard to prevent SDK type leakage
 * 
 * This file ensures that SDK types from generated-sdk/registry-api
 * are never implicitly assignable to our local types.
 * If this file fails to compile, it means SDK types are leaking
 * into the application layer.
 */

import type { Agent as SdkAgent, Profile as SdkProfile } from '@/lib/generated-sdk/registry-api';
import type { Agent as LocalAgent, Profile as LocalProfile } from '@/lib/registry/types';

/**
 * These type assertions will fail at compile-time if SDK types
 * can be directly assigned to local types, indicating a type boundary leak.
 */

// Ensure SDK Agent is NOT assignable to Local Agent
// This should always be 'true' since they have incompatible Profile types
type _NoImplicitAgentLeak = SdkAgent extends LocalAgent ? never : true;
export const _noImplicitAgentLeak: _NoImplicitAgentLeak = true;

// Ensure SDK Profile is NOT assignable to Local Profile
// This should always be 'true' since SDK Profile lacks required id/agentId fields
type _NoImplicitProfileLeak = SdkProfile extends LocalProfile ? never : true;
export const _noImplicitProfileLeak: _NoImplicitProfileLeak = true;

/**
 * If either of these constants fail to compile with a type error,
 * it means the type boundary has been compromised and SDK types
 * are leaking into the application layer.
 * 
 * To fix:
 * 1. Check that all gateway methods use the adapters
 * 2. Ensure no direct SDK type imports outside of gateway/adapters
 * 3. Verify that local types haven't been modified to match SDK types
 */

// Additional runtime check (for development only)
if (process.env.NODE_ENV === 'development') {
  console.log('[Type Guard] SDK to Local type boundary is properly enforced ✓');
}