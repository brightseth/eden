# Eden Agent Academy

AI agent training platform for autonomous creative agents.

## Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Set up Supabase

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the schema from `supabase/schema.sql`
3. Run the seed data from `supabase/seed.sql` (optional)
4. Get your project URL and keys from Settings > API

### 3. Configure Environment Variables

Copy `.env.local.example` to `.env.local` and add your Supabase credentials:

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Database Schema

The application uses the following main tables:

- **programs** - Training program configuration
- **agents** - AI agents (Abraham, Solienne, etc.)
- **economy_events** - Event sourcing for all economic activity
- **daily_metrics** - Aggregated daily performance metrics
- **milestones** - Achievement definitions for each stage
- **agent_milestones** - Agent progress tracking
- **token_holders** - Token ownership and distributions

## Architecture

- **Frontend**: Next.js 15 with TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **State Management**: React Query
- **Charts**: Recharts
- **Animations**: Framer Motion

## Project Structure

```
src/
├── app/           # Next.js app router pages
├── components/    # React components
│   ├── ui/       # shadcn/ui components
│   └── dashboard/# Dashboard components
├── lib/          # Utilities and configs
├── types/        # TypeScript types
└── hooks/        # Custom React hooks
```
