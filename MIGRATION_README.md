# Migration Instructions: Agents/Works System

## Current Status
✅ Phase 1-3 Complete:
- New API routes created and tested locally
- Tagger updated with new prompt and budget controls
- Schema migration files prepared

## ⚠️ ACTION REQUIRED: Run Database Migration

The new API routes are ready but require the database tables to be created.

### Option 1: Via Supabase Dashboard (Recommended)
1. Go to your Supabase dashboard SQL editor
2. Run these scripts in order:
   - `scripts/migration-step1-tables.sql` - Creates all new tables
   - `scripts/migration-step2-data.sql` - Inserts agents and migrates data
   - `scripts/migration-step3-triggers.sql` - Sets up auto-curation

### Option 2: Via Supabase CLI
```bash
# First, login to Supabase
npx supabase login

# Link your project
npx supabase link --project-ref qvafjicbrsoyzdlgypuq

# Push the migration
npx supabase db push
```

## Files Created

### Database Migration
- `/supabase/migrations/006_agents_works_migration.sql` - Complete migration
- `/scripts/migration-step1-tables.sql` - Tables only
- `/scripts/migration-step2-data.sql` - Data migration
- `/scripts/migration-step3-triggers.sql` - Automation triggers

### New API Routes (Ready to Use)
- `/api/agents` - GET/POST agents
- `/api/agents/[id]` - GET/PATCH agent details
- `/api/works` - GET/POST works (replaces creations)
- `/api/works/[id]/publish` - POST to publish
- `/api/critiques` - GET/POST critiques (auto-curates on INCLUDE)
- `/api/collects` - GET/POST collects (stub)
- `/api/tagger` - Updated with new prompt

### Test Script
- `/scripts/test-new-apis.js` - Run after migration to verify

## Next Steps After Migration

1. **Test the new APIs:**
   ```bash
   node scripts/test-new-apis.js
   ```

2. **Update UI components** to use new endpoints:
   - Replace `/api/fellows` → `/api/agents`
   - Replace `/api/creations` → `/api/works`
   - Update state names: created → curated → published

3. **Deploy and monitor** for 48 hours

4. **Deprecate old endpoints** after 2 weeks

## Migration Notes

- **Zero-downtime**: New tables created alongside old ones
- **Data preserved**: All existing creations migrated to works
- **Auto-curation**: INCLUDE verdicts automatically move works to 'curated'
- **Spirit graduation**: Agents can be promoted to spirits with tokens

## Environment Variables Required

```env
TAGGER_ENABLED=true
TAGGER_SAMPLE=1.0
TAGGER_DAILY_BUDGET=10
ANTHROPIC_API_KEY=your-key
```

## Contact
If you need assistance with the migration, the code is ready and tested locally. The only blocker is creating the database tables in Supabase.