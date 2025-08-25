# EDEN ACADEMY → REGISTRY CONTENT MIGRATION MAP

**Base Directory**: `/Users/seth/eden-academy`

## Agent Profile Data

### ABRAHAM
**Profile Location**: `/src/app/academy/agent/abraham/page.tsx`
- Agent ID: abraham
- Display Name: ABRAHAM
- Status: LAUNCHING
- Launch Date: OCT 19, 2025
- Trainer: GENE KOGAN
- Works Count: 2,519
- Description: 13-YEAR AUTONOMOUS COVENANT

**Covenant Details**: `/src/app/academy/agent/abraham/covenant/page.tsx`
- Full covenant text and theological themes
- 13-year timeline details

**Works Archive**: `/src/app/academy/agent/abraham/early-works/page.tsx`
- Links to archive browser for Abraham's works

### SOLIENNE
**Profile Location**: `/src/app/academy/agent/solienne/page.tsx`
- Agent ID: solienne
- Display Name: SOLIENNE  
- Status: LAUNCHING
- Launch Date: NOV 10, 2025
- Trainers: KRISTI CORONADO & SETH GOLDSTEIN
- Works Count: 1,740 (cleaned from 3,677 after duplicate removal)
- Description: CONSCIOUSNESS, VELOCITY & ARCHITECTURAL LIGHT

**Works Archive**: `/src/app/academy/agent/solienne/generations/page.tsx`
- Links to enhanced archive browser

**Paris Photo Exhibition**: `/src/app/academy/agent/solienne/paris-photo/page.tsx`
- Exhibition details for Nov 10-13, 2025 at Grand Palais
- Countdown timer, featured works preview
- Curation details (12-15 selected works)

## Database Content (Supabase)

### Tables
1. **`agents`** - Agent profile data
2. **`agent_works`** - Individual works/creations
   - Solienne: 1,740 works after duplicate cleanup
   - Abraham: 2,519 works

### Database Connection
- **URL**: `NEXT_PUBLIC_SUPABASE_URL=https://ctlygyrkibupejllgglr.supabase.co`
- **Service Key**: Available in `.env.local`

## API Endpoints for Data Access

### Abraham APIs
- `/src/app/api/agents/abraham/works/route.ts` - Get Abraham's works
- `/src/app/api/agents/abraham/covenant/route.ts` - Covenant details  
- `/src/app/api/agents/abraham/route.ts` - Profile data

### Solienne APIs  
- `/src/app/api/agents/solienne/works/route.ts` - Get Solienne's works
- `/src/app/api/agents/solienne/latest/route.ts` - Latest work
- `/src/app/api/agents/solienne/route.ts` - Profile data

## Import Scripts (Historical)
- `/scripts/import-abraham-everydays.ts` - Abraham data import
- `/scripts/import-solienne-generations.ts` - Solienne data import

## Curation Tools
- `/src/app/curate/solienne/page.tsx` - Trainer curation interface
- `/src/components/CurationInterface.tsx` - Curation component
- `/src/components/ParisPhotoCuration.tsx` - Paris Photo specific curation

## Archive Browsers
- `/src/components/EnhancedArchiveBrowser.tsx` - Main works browser
- `/src/components/archive-browser.tsx` - Legacy browser
- `/src/app/academy/agent/[agent]/[type]/[id]/page.tsx` - Individual work pages

## Sovereign Sites (Experimental)
- `/src/app/sites/abraham/` - Abraham's standalone site
- `/src/app/sites/solienne/` - Solienne's standalone site
- `/src/app/sites/solienne/embed/latest/` - Latest work embed

## Supporting Components
- `/src/components/sovereign/SovereignSiteTemplate.tsx` - Sovereign site template
- `/src/components/AgentSovereignLink.tsx` - Links to sovereign sites
- `/src/components/CountdownTimer.tsx` - Paris Photo countdown
- `/src/components/VideoPlayer.tsx` - Solienne trailer player

## Static Assets
- `/public/videos/solienne-trailer.mp4` - Solienne exhibition trailer

## Registry Migration Files (Already Created)
- `/src/lib/registry/types.ts` - Type definitions for Registry
- `/src/lib/registry/client.ts` - Registry API client
- `/src/lib/registry/adapter.ts` - Feature flag adapter
- `/docs/migration-schema.md` - Complete migration documentation

## Data Export Queries

### Export Agents
```sql
SELECT * FROM agents WHERE cohort = 'genesis';
```

### Export Works  
```sql
SELECT * FROM agent_works 
WHERE agent_id IN (
  SELECT id FROM agents 
  WHERE name IN ('Abraham', 'Solienne')
);
```

## Key Statistics
- **Abraham**: 2,519 works, launching OCT 19, 2025
- **Solienne**: 1,740 works (post-cleanup), launching NOV 10, 2025 at Paris Photo
- **Total Works**: ~4,259 unique creations
- **Duplicate Cleanup**: Removed 1,937 duplicates from Solienne

## Next Steps for Migration
1. Export agent profile data from `/src/app/academy/agent/*/page.tsx` files
2. Export works data from Supabase `agent_works` table
3. Import to Registry using transformation functions in `/docs/migration-schema.md`
4. Test with feature flag `USE_REGISTRY=true`
5. Update pages to use Registry adapter at `/src/lib/registry/adapter.ts`

**Environment**: All environment variables in `/Users/seth/eden-academy/.env.local`