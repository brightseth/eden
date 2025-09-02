/**
 * SDK to Local Type Adapters
 * 
 * Provides clean boundary between generated SDK types and local application types.
 * This ensures type safety and prevents SDK implementation details from leaking
 * into the application layer.
 */

import type { Agent as SdkAgent, Profile as SdkProfile } from '@/lib/generated-sdk/registry-api';
import type { Agent as LocalAgent, Profile as LocalProfile, Creation, Persona } from '@/lib/registry/types';

/**
 * Convert SDK Profile to Local Profile format
 * SDK Profile lacks id/agentId fields which we synthesize
 */
function toLocalProfile(agentId: string, p?: SdkProfile | null): LocalProfile {
  if (!p) {
    // Return undefined if no profile exists
    return undefined as any;
  }

  // The SDK's Profile doesn't include id/agentId; synthesize them
  return {
    id: (p as any).id ? String((p as any).id) : `${agentId}-profile`,
    agentId,
    
    // Optional fields from SDK profile
    statement: (p as any)?.statement ?? undefined,
    capabilities: Array.isArray((p as any)?.capabilities) ? (p as any).capabilities : undefined,
    primaryMedium: (p as any)?.primaryMedium ?? undefined,
    aestheticStyle: (p as any)?.aestheticStyle ?? undefined,
    culturalContext: (p as any)?.culturalContext ?? undefined,
    createdAt: (p as any)?.createdAt ?? undefined,
    updatedAt: (p as any)?.updatedAt ?? undefined,
    
    // Include any additional fields from SDK
    ...((p as any) ?? {})
  } as LocalProfile;
}

/**
 * Convert SDK Agent to Local Agent format
 * Handles all field mappings and provides defaults
 */
export function toLocalAgent(a: SdkAgent): LocalAgent {
  const agentId = String((a as any).id ?? (a as any).agentId ?? 'unknown');
  const handle = (a as any).handle ?? (a as any).slug ?? (a as any).username ?? 'unknown';
  const displayName = (a as any).displayName ?? (a as any).name ?? (a as any).title ?? 'Untitled Agent';
  
  return {
    // Core identification (required)
    id: agentId,
    handle: handle,
    displayName: displayName,
    cohort: (a as any).cohort ?? 'genesis',
    status: normalizeStatus((a as any).status),
    visibility: ((a as any).visibility ?? 'PUBLIC').toUpperCase() as LocalAgent['visibility'],
    
    // Optional timestamps
    createdAt: (a as any).createdAt ?? (a as any).created_at ?? undefined,
    updatedAt: (a as any).updatedAt ?? (a as any).updated_at ?? undefined,
    
    // Optional profile
    profile: (a as any).profile ? toLocalProfile(agentId, (a as any).profile) : undefined,
    
    // Optional nested collections
    personas: Array.isArray((a as any).personas)
      ? (a as any).personas.map((p: any) => toLocalPersona(agentId, p))
      : undefined,
    artifacts: Array.isArray((a as any).artifacts)
      ? (a as any).artifacts
      : undefined,
    progress: (a as any).progress ?? undefined,
    
    // Preserve raw SDK data for debugging
    __sdk__: a as any,
  } as LocalAgent;
}

/**
 * Convert SDK Creation to Local Creation format
 */
export function toLocalCreation(agentId: string, c: any): Creation {
  return {
    id: String(c.id ?? c.creationId ?? 'unknown'),
    agentId: c.agentId ?? agentId,
    mediaUri: c.mediaUri ?? c.imageUrl ?? c.image ?? '',
    metadata: c.metadata ?? {},
    status: normalizeCreationStatus(c.status),
    publishedTo: c.publishedTo ?? undefined,
    createdAt: c.createdAt ?? c.created_at ?? new Date().toISOString(),
    publishedAt: c.publishedAt ?? c.published_at ?? undefined,
    __sdk__: c
  } as Creation;
}

/**
 * Convert SDK Persona to Local Persona format
 */
export function toLocalPersona(agentId: string, p: any): Persona {
  return {
    id: String(p.id ?? p.personaId ?? 'unknown'),
    agentId: p.agentId ?? agentId,
    version: p.version ?? '1.0.0',
    name: p.name ?? 'Default',
    description: p.description ?? undefined,
    traits: Array.isArray(p.traits) ? p.traits : (p.traits ? [p.traits] : undefined),
    voice: p.voice ?? undefined,
    worldview: p.worldview ?? undefined,
    isActive: p.isActive ?? p.active ?? true,
    createdAt: p.createdAt ?? p.created_at ?? undefined,
    updatedAt: p.updatedAt ?? p.updated_at ?? undefined,
    __sdk__: p
  } as Persona;
}

/**
 * Normalize agent status to expected values
 */
export function normalizeStatus(s: any): LocalAgent['status'] {
  switch ((s ?? '').toString().toUpperCase()) {
    case 'READY':
    case 'ONLINE':
    case 'ACTIVE':
      return 'ACTIVE';
    case 'APPLYING':
    case 'PENDING':
    case 'PREPARING':
      return 'APPLYING';
    case 'ONBOARDING':
    case 'LEARNING':
    case 'TRAINING':
      return 'ONBOARDING';
    case 'INVITED':
      return 'INVITED';
    case 'GRADUATED':
      return 'GRADUATED';
    case 'PAUSED':
    case 'SUSPENDED':
    case 'INACTIVE':
    case 'ARCHIVED':
      return 'ARCHIVED';
    default:
      return 'ACTIVE';
  }
}

/**
 * Normalize creation status to expected values
 */
function normalizeCreationStatus(status: any): Creation['status'] {
  const s = String(status ?? '').toLowerCase();
  switch (s) {
    case 'published':
    case 'active':
    case 'live':
      return 'published';
    case 'draft':
    case 'pending':
    case 'unpublished':
      return 'draft';
    case 'curated':
    case 'featured':
    case 'highlighted':
      return 'curated';
    default:
      return 'published'; // Safe default
  }
}

/**
 * Batch convert SDK Agents to Local Agents
 */
export function toLocalAgents(agents: SdkAgent[]): LocalAgent[] {
  return agents.map(toLocalAgent);
}

/**
 * Batch convert SDK Creations to Local Creations
 */
export function toLocalCreations(agentId: string, creations: any[]): Creation[] {
  return creations.map(c => toLocalCreation(agentId, c));
}

/**
 * Batch convert SDK Personas to Local Personas
 */
export function toLocalPersonas(agentId: string, personas: any[]): Persona[] {
  return personas.map(p => toLocalPersona(agentId, p));
}