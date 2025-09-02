# ADR-028: Registry Type Boundary

## Status
Accepted

## Context
The Eden Academy codebase was experiencing type leakage between the generated SDK types (`@/lib/generated-sdk/registry-api`) and local application types (`@/lib/registry/types`). This created tight coupling, making it difficult to evolve either layer independently and causing TypeScript strict mode failures.

## Decision
Introduce explicit adapter functions at the gateway boundary to convert between SDK and local types:
- `toLocalAgent()`, `toLocalCreation()`, `toLocalPersona()` - SDK → Local
- `toSdkCreationInput()` - Local → SDK
- `normalizeStatus()` - Consistent enum normalization
- Cache wrapper methods for consistent shape

## Consequences
### Positive
- Clean type boundary prevents SDK implementation details from leaking into application
- Local types can evolve independently of Registry API
- Consistent status/enum handling across codebase
- Type-safe at compile time with guards preventing regression

### Negative
- Small runtime overhead for adaptation (negligible)
- Must maintain adapter functions when types change

### Implementation
- All gateway methods return local types
- All SDK calls go through adapters
- Cache always stores/retrieves consistent shape
- Status values normalized at boundaries

## Feature Flags
- `FLAG_REGISTRY_V2=1` - Enable new adapter-based gateway
- Default enabled in staging, can rollback via flag

## References
- PR: registry-boundary-v1
- Related: ADR-022 (Registry-First Architecture)