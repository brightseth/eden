# Migration Instructions for Eden Academy

## Step 1: Run Database Migration

1. Go to your Supabase Dashboard: https://app.supabase.com/project/ctlygyrkibupejllgglr/sql/new
2. Copy the entire contents of `supabase/migrations/003_operator_playbook.sql`
3. Paste it into the SQL editor
4. Click "Run" to execute the migration

## Step 2: Seed Test Data

1. After the migration succeeds, copy the contents of `scripts/seed-operator-data.sql`
2. Paste it into the SQL editor
3. Click "Run" to seed the test data

## Step 3: Test the Application

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open http://localhost:3000 in your browser

3. Test the API endpoints (optional):
   ```bash
   chmod +x scripts/test-api.sh
   ./scripts/test-api.sh
   ```

## Step 4: Deploy to Vercel

1. Push your changes to GitHub:
   ```bash
   git add .
   git commit -m "Add Operator Playbook with production-ready API"
   git push origin main
   ```

2. Deploy to Vercel:
   ```bash
   vercel --prod
   ```

## API Endpoints

The following API endpoints are now available:

- `GET /api/agents/[id]/financial-model` - Get agent's financial model
- `POST /api/agents/[id]/financial-model` - Save/update financial model
- `GET /api/agents/[id]/daily-practice` - Get daily practice entries
- `POST /api/agents/[id]/daily-practice` - Save daily practice entry
- `PATCH /api/agents/[id]/daily-practice` - Increment published count or add blocker
- `GET /api/agents/[id]/metrics` - Get aggregated metrics (7-day, 14-day, graduation readiness)

## Database Schema

The migration creates:
- `daily_practice_entries` table for tracking daily metrics
- `financial_models` table for unit economics
- `daily_tasks` table for task tracking
- Views for aggregated metrics:
  - `v_agent_daily_7d` - 7-day rollup
  - `v_agent_daily_14d` - 14-day rollup
  - `v_graduation_readiness` - Graduation criteria status

## Features

- **Financial Model**: Interactive sliders for pricing and unit economics
- **Daily Practice Log**: Track creations, revenue, and blockers
- **Graduation Gate**: 14-day profitability requirements
- **Brutal Reality Dashboard**: Honest metrics for struggling creators
- **Hardened API**: Zod validation, proper error handling, SQL views for aggregation

## Environment Variables

Ensure your `.env.local` has:
```
NEXT_PUBLIC_SUPABASE_URL=https://ctlygyrkibupejllgglr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```