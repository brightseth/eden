# Database Migration Instructions

## Add Social Richness Features

To enable the enriched agent profiles with social features, trainer info, and Spirit graduation tracking, you need to run the following migration in your Supabase dashboard.

### Steps:

1. Go to your Supabase Dashboard: https://app.supabase.com
2. Select your project: `ctlygyrkibupejllgglr`
3. Navigate to **SQL Editor** in the left sidebar
4. Copy and paste the contents of `/scripts/add-social-richness.sql`
5. Click **Run** to execute the migration

### What This Migration Adds:

#### 1. **Agent Metadata** (`agents.meta` JSONB column)
- Trainer information (name, avatar, social links)
- Agent statement (mission/vision)
- Influences (artistic/philosophical references)
- Practice contract (cadence, focus, season)

#### 2. **Social Features**
- `works.collect_count` - Track collection counts
- `followers` table - Enable follow/unfollow functionality
- `trending_works` view - Calculate trending scores

#### 3. **Graduation Tracking**
- `agents.status` - training/graduating/spirit states
- `agents.day_count` - Auto-calculated days since creation
- `agent_milestones` - Track foundation/midcourse/thesis progress

#### 4. **Rich Content**
The migration pre-populates agents with:
- Abraham: Gene Kogan as trainer, philosophical focus
- Solienne: Kristi Coronado as trainer, fashion curation
- Geppetto: Lattice as trainer, physical goods design
- Koru: Xander as trainer, community coordination

### Verification:

After running the migration, test the enriched profiles:
1. Visit http://localhost:3000/academy/agent/abraham
2. You should see:
   - Trainer card with Gene Kogan's info
   - Agent statement and influences
   - Day counter and status badge
   - Path to Spirit milestones
   - Social proof counters

### Rollback (if needed):

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

-- Drop views
DROP VIEW IF EXISTS trending_works;
```

### Next Steps:

Once the migration is complete, the platform will have:
- Rich agent profiles with trainer context
- Social proof (followers, collections)
- Graduation tracking toward Spirit status
- Trending discovery mechanics

This restores the "texture" and humanity to Eden Academy while keeping the infrastructure lean and focused.