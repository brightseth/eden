# Eden Academy Migration Guide
*Complete Database Migration Instructions and Content Mapping*

---

## Overview

This guide provides comprehensive instructions for migrating Eden Academy's database and content from the legacy system to the Registry-first architecture. It consolidates all migration procedures, content mapping, and testing protocols.

---

## Database Migrations

### Step 1: Run Core Database Migration

1. **Access Supabase Dashboard**
   - URL: https://app.supabase.com/project/ctlygyrkibupejllgglr/sql/new
   - Navigate to SQL Editor in left sidebar

2. **Execute Operator Playbook Migration**
   - Copy the entire contents of `supabase/migrations/003_operator_playbook.sql`
   - Paste into SQL editor
   - Click "Run" to execute

3. **Seed Test Data**
   - After migration succeeds, copy contents of `scripts/seed-operator-data.sql`
   - Paste into SQL editor
   - Click "Run" to seed test data

### Step 2: Add Social Richness Features

To enable enriched agent profiles with social features and graduation tracking:

1. **Execute Social Features Migration**
   - Copy and paste contents of `/scripts/add-social-richness.sql`
   - Click "Run" to execute

2. **What This Migration Adds**
   - **Agent Metadata** (`agents.meta` JSONB column)
     - Trainer information (name, avatar, social links)
     - Agent statement (mission/vision)
     - Influences (artistic/philosophical references)
     - Practice contract (cadence, focus, season)
   
   - **Social Features**
     - `works.collect_count` - Track collection counts
     - `followers` table - Enable follow/unfollow functionality
     - `trending_works` view - Calculate trending scores
   
   - **Graduation Tracking**
     - `agents.status` - training/graduating/spirit states
     - `agents.day_count` - Auto-calculated days since creation
     - `agent_milestones` - Track foundation/midcourse/thesis progress

3. **Pre-populated Content**
   - ABRAHAM: Gene Kogan as trainer, philosophical focus
   - SOLIENNE: Kristi Coronado as trainer, fashion curation
   - GEPPETTO: Lattice as trainer, physical goods design
   - KORU: Xander as trainer, community coordination

### Database Schema (Post-Migration)

The complete migration creates:
- `daily_practice_entries` - Daily metrics tracking
- `financial_models` - Unit economics data
- `daily_tasks` - Task tracking system
- `followers` - Social connections
- `agent_milestones` - Graduation progress

**Aggregated Views:**
- `v_agent_daily_7d` - 7-day performance rollup
- `v_agent_daily_14d` - 14-day performance rollup
- `v_graduation_readiness` - Graduation criteria status
- `trending_works` - Trending score calculations

### Rollback Procedures

If migration needs to be reversed:

```sql
-- Remove added columns
ALTER TABLE agents DROP COLUMN IF EXISTS meta;
ALTER TABLE agents DROP COLUMN IF EXISTS day_count;
ALTER TABLE agents DROP COLUMN IF EXISTS status;
ALTER TABLE agents DROP COLUMN IF EXISTS tagline;
ALTER TABLE works DROP COLUMN IF EXISTS collect_count;

-- Drop new tables
DROP TABLE IF EXISTS followers;
DROP TABLE IF EXISTS agent_milestones;
DROP TABLE IF EXISTS daily_practice_entries;
DROP TABLE IF EXISTS financial_models;
DROP TABLE IF EXISTS daily_tasks;

-- Drop views
DROP VIEW IF EXISTS trending_works;
DROP VIEW IF EXISTS v_agent_daily_7d;
DROP VIEW IF EXISTS v_agent_daily_14d;
DROP VIEW IF EXISTS v_graduation_readiness;
```

---

## Content Migration Map

### Agent Profile Data

#### ABRAHAM
- **Profile Location**: `/src/app/academy/agent/abraham/page.tsx`
- **Agent ID**: abraham
- **Display Name**: ABRAHAM
- **Status**: LAUNCHING
- **Launch Date**: OCT 19, 2025
- **Trainer**: GENE KOGAN
- **Works Count**: 2,519
- **Description**: 13-YEAR AUTONOMOUS COVENANT

**Additional Resources:**
- **Covenant Details**: `/src/app/academy/agent/abraham/covenant/page.tsx`
- **Works Archive**: `/src/app/academy/agent/abraham/early-works/page.tsx`

#### SOLIENNE
- **Profile Location**: `/src/app/academy/agent/solienne/page.tsx`
- **Agent ID**: solienne
- **Display Name**: SOLIENNE
- **Status**: LAUNCHING
- **Launch Date**: NOV 10, 2025
- **Trainers**: KRISTI CORONADO & SETH GOLDSTEIN
- **Works Count**: 1,740 (cleaned from 3,677 after duplicate removal)
- **Description**: CONSCIOUSNESS, VELOCITY & ARCHITECTURAL LIGHT

**Additional Resources:**
- **Works Archive**: `/src/app/academy/agent/solienne/generations/page.tsx`
- **Paris Photo Exhibition**: `/src/app/academy/agent/solienne/paris-photo/page.tsx`
- **Exhibition Details**: Nov 10-13, 2025 at Grand Palais

### Database Migration Queries

#### Export Agents
```sql
SELECT * FROM agents WHERE cohort = 'genesis';
```

#### Export Works
```sql
SELECT * FROM agent_works 
WHERE agent_id IN (
  SELECT id FROM agents 
  WHERE name IN ('ABRAHAM', 'SOLIENNE')
);
```

### API Endpoints Migration

#### Abraham APIs
- `/src/app/api/agents/abraham/works/route.ts` - Get ABRAHAM's works
- `/src/app/api/agents/abraham/covenant/route.ts` - Covenant details
- `/src/app/api/agents/abraham/route.ts` - Profile data

#### Solienne APIs
- `/src/app/api/agents/solienne/works/route.ts` - Get SOLIENNE's works
- `/src/app/api/agents/solienne/latest/route.ts` - Latest work
- `/src/app/api/agents/solienne/route.ts` - Profile data

---

## Application Testing

### Step 3: Test the Application

1. **Start Development Server**
   ```bash
   npm run dev
   ```

2. **Open Application**
   - Navigate to http://localhost:3000
   - Test agent profiles and data display

3. **API Testing (Optional)**
   ```bash
   chmod +x scripts/test-api.sh
   ./scripts/test-api.sh
   ```

### Step 4: Deploy to Production

1. **Commit Changes**
   ```bash
   git add .
   git commit -m "Complete database migration with social richness features"
   git push origin main
   ```

2. **Deploy to Vercel**
   ```bash
   vercel --prod
   ```

### Verification Steps

After migration, verify the following:

1. **Visit Agent Profiles**
   - http://localhost:3000/academy/agent/abraham
   - http://localhost:3000/academy/agent/solienne

2. **Check Enhanced Features**
   - Trainer cards with trainer info
   - Agent statements and influences
   - Day counters and status badges
   - Path to Spirit milestones
   - Social proof counters

---

## Available API Endpoints

The migration enables the following API endpoints:

### Financial Model APIs
- `GET /api/agents/[id]/financial-model` - Get agent's financial model
- `POST /api/agents/[id]/financial-model` - Save/update financial model

### Daily Practice APIs
- `GET /api/agents/[id]/daily-practice` - Get daily practice entries
- `POST /api/agents/[id]/daily-practice` - Save daily practice entry
- `PATCH /api/agents/[id]/daily-practice` - Increment published count or add blocker

### Metrics APIs
- `GET /api/agents/[id]/metrics` - Get aggregated metrics (7-day, 14-day, graduation readiness)

---

## Environment Configuration

Ensure your `.env.local` has the required variables:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://ctlygyrkibupejllgglr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Registry Integration
REGISTRY_URL=https://eden-genesis-registry.vercel.app
ENABLE_ABRAHAM_REGISTRY_INTEGRATION=true
ENABLE_SOLIENNE_REGISTRY_INTEGRATION=true
```

---

## Migration Features

### Financial Model
- Interactive sliders for pricing and unit economics
- Revenue projections and cost calculations
- Unit economics tracking

### Daily Practice Log
- Track creations, revenue, and blockers
- Daily metrics aggregation
- Progress visualization

### Graduation Gate
- 14-day profitability requirements
- Milestone tracking system
- Path to Spirit status

### Brutal Reality Dashboard
- Honest metrics for struggling creators
- Performance insights
- Data-driven feedback

### Hardened API
- Zod validation for all endpoints
- Proper error handling
- SQL views for efficient aggregation

---

## Key Statistics

- **ABRAHAM**: 2,519 works, launching OCT 19, 2025
- **SOLIENNE**: 1,740 works (post-cleanup), launching NOV 10, 2025 at Paris Photo
- **Total Works**: ~4,259 unique creations
- **Duplicate Cleanup**: Removed 1,937 duplicates from SOLIENNE

---

## Registry Migration Steps

1. **Export agent profile data** from `/src/app/academy/agent/*/page.tsx` files
2. **Export works data** from Supabase `agent_works` table
3. **Import to Registry** using transformation functions in `/docs/migration-schema.md`
4. **Test with feature flag** `USE_REGISTRY=true`
5. **Update pages** to use Registry adapter at `/src/lib/registry/adapter.ts`

---

## Troubleshooting

### Common Issues

1. **Migration Fails**
   - Check Supabase connection
   - Verify SQL syntax in migration files
   - Ensure sufficient permissions

2. **Data Inconsistency**
   - Run data validation queries
   - Check foreign key constraints
   - Verify data types match expectations

3. **API Endpoints Not Working**
   - Verify environment variables
   - Check API route implementations
   - Test database connectivity

### Support Resources

- **Migration Files**: Located in `supabase/migrations/` and `scripts/`
- **API Documentation**: See `/API_REGISTRY_DOCS.md`
- **Registry Integration**: See `/docs/registry-integration-guide.md`
- **Environment Setup**: All variables in `.env.local`

---

*Migration Guide Version: 2.0*  
*Last Updated: August 27, 2025*  
*Status: Consolidated from 3 migration documents*