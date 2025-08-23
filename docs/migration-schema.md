# Eden Academy to Genesis Registry Migration Schema

## Current Academy Database Schema

### 1. Agents Table (`agents`)
**Current Location**: Supabase - `agents` table

| Field | Type | Description | Maps To |
|-------|------|-------------|---------|
| id | uuid | Primary key | agents.id |
| name | text | Display name | agents.displayName |
| handle | text | URL-safe identifier | agents.handle |
| cohort | text | Cohort identifier | agents.cohort |
| status | text | Agent status | agents.status |
| visibility | text | Access level | agents.visibility |
| created_at | timestamp | Creation date | agents.createdAt |
| updated_at | timestamp | Last update | agents.updatedAt |

### 2. Agent Works Table (`agent_works`)
**Current Location**: Supabase - `agent_works` table

| Field | Type | Description | Maps To |
|-------|------|-------------|---------|
| id | uuid | Primary key | creations.id |
| agent_id | uuid | Foreign key to agents | creations.agentId |
| image_url | text | Media URL | creations.mediaUri |
| metadata | jsonb | Generation params | creations.metadata |
| tags | text[] | Content tags | creations.metadata.tags |
| status | text | Publication status | creations.status |
| published_to | jsonb | Publishing channels | creations.publishedTo |
| created_at | timestamp | Creation date | creations.createdAt |
| published_at | timestamp | Publication date | creations.publishedAt |

### 3. Profiles (Currently inline in agents)
**Current Location**: Various fields in `agents` table

| Field | Type | Description | Maps To |
|-------|------|-------------|---------|
| statement | text | Artist statement | profiles.statement |
| capabilities | jsonb | Agent capabilities | profiles.capabilities |
| primary_medium | text | Primary medium | profiles.primaryMedium |
| aesthetic_style | text | Style description | profiles.aestheticStyle |
| cultural_context | text | Cultural background | profiles.culturalContext |

### 4. Personas (Not yet implemented)
**Future Structure**: Will need to be created in Registry

| Field | Type | Description | Maps To |
|-------|------|-------------|---------|
| id | uuid | Primary key | personas.id |
| agent_id | uuid | Foreign key | personas.agentId |
| version | text | Version identifier | personas.version |
| name | text | Persona name | personas.name |
| description | text | Description | personas.description |
| traits | text[] | Personality traits | personas.traits |
| voice | text | Voice description | personas.voice |
| worldview | text | Worldview | personas.worldview |
| is_active | boolean | Active status | personas.isActive |

### 5. Model Artifacts (Not yet implemented)
**Future Structure**: Will need to be created in Registry

| Field | Type | Description | Maps To |
|-------|------|-------------|---------|
| id | uuid | Primary key | artifacts.id |
| agent_id | uuid | Foreign key | artifacts.agentId |
| type | text | Artifact type | artifacts.type |
| name | text | Artifact name | artifacts.name |
| description | text | Description | artifacts.description |
| vault_path | text | Vault reference | artifacts.vaultPath |
| metadata | jsonb | Additional data | artifacts.metadata |

## Migration Steps

### Phase 1: Data Export from Academy
```sql
-- Export agents
SELECT * FROM agents WHERE cohort = 'genesis';

-- Export works
SELECT * FROM agent_works WHERE agent_id IN (
  SELECT id FROM agents WHERE cohort = 'genesis'
);
```

### Phase 2: Data Transformation
```javascript
// Transform agent data
function transformAgent(academyAgent) {
  return {
    id: academyAgent.id,
    handle: academyAgent.handle || slugify(academyAgent.name),
    displayName: academyAgent.name,
    cohort: academyAgent.cohort || 'genesis',
    status: mapStatus(academyAgent.status),
    visibility: academyAgent.visibility || 'public',
    createdAt: academyAgent.created_at,
    updatedAt: academyAgent.updated_at
  };
}

// Transform works to creations
function transformWork(academyWork) {
  return {
    id: academyWork.id,
    agentId: academyWork.agent_id,
    mediaUri: academyWork.image_url,
    metadata: {
      ...academyWork.metadata,
      tags: academyWork.tags
    },
    status: academyWork.status || 'published',
    publishedTo: academyWork.published_to,
    createdAt: academyWork.created_at,
    publishedAt: academyWork.published_at
  };
}
```

### Phase 3: Data Import to Registry
```javascript
// Import agents
for (const agent of transformedAgents) {
  await registry.agents.create(agent);
}

// Import creations
for (const creation of transformedCreations) {
  await registry.creations.create(creation);
}
```

## Secrets Migration

### Current Secrets in Academy
- API keys stored in environment variables
- No agent-specific secrets in database

### Registry Secrets Management
- Move all secrets to vault (e.g., HashiCorp Vault)
- Store only vault_path references in database
- Example: `vault://agents/solienne/api_keys/eden`

## Data Validation Checklist

- [ ] All genesis agents have valid handles
- [ ] All agents have cohort = 'genesis'
- [ ] All image URLs are accessible
- [ ] All metadata is valid JSON
- [ ] No raw API keys in database
- [ ] All timestamps are valid
- [ ] Foreign key relationships intact

## Rollback Plan

1. Keep `USE_REGISTRY=false` in Academy
2. All data remains in original Academy database
3. No destructive operations until validated
4. One week grace period before cleanup

## Current Data Statistics

### Agents
- **Abraham**: 2,519 works
- **Solienne**: 1,740 works
- **Total Genesis Agents**: 2 (more coming Q1 2025)

### Works
- **Total Works**: ~4,259
- **Status Distribution**: 
  - Published: 100%
  - Curated: Subset for exhibitions
  - Draft: 0

### Trainers
- Gene Kogan (Abraham)
- Kristi Coronado (Solienne)
- Seth Goldstein (Solienne)

## Post-Migration Verification

```javascript
// Verify agent count
const academyAgents = await getAcademyAgents();
const registryAgents = await getRegistryAgents();
assert(academyAgents.length === registryAgents.length);

// Verify work count per agent
for (const agent of agents) {
  const academyWorks = await getAcademyWorks(agent.id);
  const registryCreations = await getRegistryCreations(agent.id);
  assert(academyWorks.length === registryCreations.length);
}

// Verify metadata integrity
for (const work of works) {
  const registryCreation = await getRegistryCreation(work.id);
  assert(deepEqual(work.metadata, registryCreation.metadata));
}
```