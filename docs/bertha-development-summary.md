# BERTHA Development Summary

## Overview
BERTHA is an AI collection intelligence agent trained by Amanda Schmitt. This document summarizes the development of BERTHA's framework, Claude SDK integration, and trainer interview system.

## Architecture Components

### 1. Claude SDK Integration
**Location**: `/src/lib/agents/bertha/claude-sdk.ts`
- Bridges Claude AI capabilities with Eden infrastructure
- Key methods:
  - `analyzeOpportunity()`: Market analysis for assets
  - `generateStrategy()`: Portfolio optimization
  - `processTrainerInterview()`: Training data processing

### 2. Trainer Interview System
**Location**: `/src/app/sites/bertha/interview/page.tsx`
- Streamlined from 30+ generic questions to ~20 psychology-focused questions
- 6 sections capturing collection decision-making:
  1. First Instincts (3 questions)
  2. Emotion vs Logic (3 questions)
  3. Risk & Timing (4 questions)
  4. Social Dynamics (3 questions)
  5. Vision & Value (4 questions)
  6. Beyond Safety (3 questions)
- Includes trainer identification (name/email)
- No popup alerts - elegant inline feedback

### 3. Amanda Bootstrap Knowledge
**Location**: `/src/lib/agents/bertha/amanda-bootstrap.ts`
- Pre-loaded expertise from Amanda Schmitt
- Includes:
  - Collecting principles and taste profile
  - Market intelligence and pricing strategies
  - Platform preferences and timing patterns
  - Red flags and evaluation framework

### 4. Training Data Storage
**Location**: `/src/lib/agents/bertha/training-storage.ts`
- JSON file-based storage (serverless-compatible)
- Non-blocking operations with fallbacks
- CSV export functionality
- Email notification system (placeholder)

### 5. API Endpoint
**Location**: `/src/app/api/agents/bertha/training/route.ts`
- POST: Process training submissions
- GET: Retrieve training status
- Enhanced error handling and logging
- Serverless-optimized with graceful fallbacks

### 6. Admin Dashboard
**Location**: `/src/app/admin/bertha-training/page.tsx`
- View all training submissions
- Display trainer info and responses
- Export capabilities
- Real-time status monitoring

## Key Design Decisions

### 1. Psychology-First Approach
Instead of generic preference checkboxes, the interview captures the psychological framework behind collection decisions. This provides richer training data for BERTHA to understand Amanda's intuitive decision-making process.

### 2. Serverless Compatibility
All file operations are non-blocking with fallbacks, ensuring the system works in Vercel's serverless environment even if file storage fails.

### 3. No Popups Policy
Following user preference, all user feedback is inline with elegant state management rather than jarring alert() popups.

### 4. Branding Clarity
- **BERTHA**: The AI agent (what users interact with)
- **Amanda Schmitt**: The human trainer (who teaches BERTHA)
- Academy page shows BERTHA as the agent with Amanda as trainer

## Data Flow

1. **Trainer fills interview** → Name/email + 6 sections of questions
2. **Form submission** → Client-side validation → API endpoint
3. **API processing** → Claude SDK analysis → Storage attempts
4. **Storage layers** → Primary JSON file → Fallback logging → Optional Google Sheets
5. **Admin monitoring** → Dashboard at `/admin/bertha-training`

## Outstanding Items

### To Fix
- URL structure: `/sites/amanda` should become `/sites/bertha` (noted for future)

### Completed
- ✅ Claude SDK integration
- ✅ Comprehensive interview form
- ✅ Amanda bootstrap knowledge
- ✅ Training data persistence
- ✅ Admin dashboard
- ✅ Trainer identification fields
- ✅ Removed works section from Amanda's site
- ✅ Fixed BERTHA branding in Academy

## Testing the System

### Interview Form
Visit: `/sites/bertha/interview`
- Fill in trainer name and email
- Answer questions across 6 sections
- Submit to process training data

### Admin Dashboard
Visit: `/admin/bertha-training`
- View all submissions
- Check trainer details
- Review responses
- Export data

### API Status
GET: `/api/agents/bertha/training`
- Returns current training status
- Shows capabilities and readiness

## Technical Stack
- **Frontend**: Next.js, React, TypeScript
- **Styling**: Tailwind CSS
- **API**: Next.js API Routes
- **Storage**: JSON files (development), Database-ready
- **AI Integration**: Claude SDK
- **Deployment**: Vercel

## Security Considerations
- Input validation on all form fields
- Sanitized data before storage
- API token authentication (prepared)
- No sensitive data in client-side code
- Trainer emails stored but not exposed

## Next Steps for Production
1. Replace file storage with database (Supabase/PostgreSQL)
2. Implement real email notifications
3. Add authentication to admin dashboard
4. Set up Google Sheets integration
5. Complete URL restructuring (amanda → bertha)
6. Add rate limiting to API endpoints
7. Implement training data versioning