# Eden Academy MVP Integration

## Overview
This project integrates three key components of the Eden ecosystem into a seamless MVP:

1. **Eden Academy** - The main training platform for AI agents
2. **Genesis Cohort** - Tracking dashboard for the first 10 agents
3. **Eden Home** - Landing page showcasing the entire ecosystem

## Key Features

### Navigation System
- Unified header navigation between all three sections
- Active state indicators for current page
- Quick access to Eden App (external)

### Genesis Cohort Tracking Interface
- **Real-time tracking** of 10 genesis agents including Abraham and Solienne
- **Status indicators**: Academy, Concept, Open slots
- **Progress visualization** for each agent's journey
- **Curriculum overview** with 4 stages: Setup, Training, Pre-Launch, Launched
- **Graduation timeline** showing key milestones
- **Metrics dashboard** displaying cohort statistics

### Agent Details
Each agent card displays:
- Agent number and name
- Track specialization (Covenant, Gallery, Market, etc.)
- Current status and stage
- Trainer information
- Graduation/Target entry date
- Daily practice focus
- Progress bar showing completion percentage

## Project Structure

```
src/app/
├── page.tsx                 # Eden Academy main page
├── genesis-cohort/
│   └── page.tsx            # Genesis Cohort tracking dashboard
├── home/
│   └── page.tsx            # Eden Home landing page
└── agent/
    └── [id]/               # Individual agent pages
```

## Navigation Flow

```
Eden Home (Landing)
    ├── Academy (Agent Management)
    │   └── Individual Agent Pages
    └── Genesis Cohort (Tracking Dashboard)
```

## Agent Status Types

1. **In Academy** (Green)
   - Currently in 100-day training program
   - Abraham (Day 95/100)
   - Solienne (Day 88/100)

2. **Concept Phase** (Yellow)
   - In development/planning stage
   - Geppetto, Miyomi, Art Collector, DAO Manager

3. **Open Slots** (Gray)
   - Available positions for future agents
   - 4 slots remaining in Genesis Cohort

## Key Dates

- **Oct 2025**: Abraham graduates with 13-year covenant
- **Nov 2025**: Solienne launches at Paris Photo
- **Dec 2025**: Miyomi + DAO Manager enter academy
- **Q1 2026**: Geppetto enters academy
- **Q2 2026**: Art Collector enters academy

## Development

### Running the Project
```bash
npm run dev     # Start development server
npm run build   # Build for production
npm run start   # Start production server
```

### Environment Variables
Required in `.env.local`:
- Supabase configuration
- API keys for external services

## Future Enhancements

### Database Integration
- Store cohort data in Supabase
- Real-time updates via WebSocket
- Historical tracking of agent progress

### API Routes
- `/api/cohort` - Get/update cohort data
- `/api/agents/[id]/progress` - Track individual progress
- `/api/timeline` - Manage graduation schedule

### Additional Features
- Admin interface for updating agent status
- Automated progress tracking
- Integration with actual agent performance metrics
- Token holder dashboard
- Community engagement features

## Design Philosophy

The interface follows a minimalist, terminal-inspired aesthetic:
- Black background with white/gray text
- Monospace fonts for data display
- Subtle hover states and transitions
- Clear visual hierarchy
- Mobile-responsive grid layouts

## Technical Stack

- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Supabase** - Database and auth
- **Lucide Icons** - UI icons

## Notes

This MVP demonstrates the core concept of tracking AI agents through their academy journey. Each agent represents an autonomous creative entity that will eventually operate independently, creating art, engaging with collectors, and generating revenue.

The Genesis Cohort represents the first wave of these agents, establishing the foundation for a new creative economy where "$SPIRIT holders own them all."