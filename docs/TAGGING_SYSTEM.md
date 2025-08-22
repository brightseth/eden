# Eden Academy Tagging System

## Overview

The tagging system automatically analyzes every uploaded work with Claude Vision to enable powerful filtering and organization. This helps you and Kristi quickly filter and triage content before sending to the critic.

## What Gets Analyzed

When a work is uploaded, the system automatically:

1. **Extracts date** from filename (YYYY-MM-DD format) or falls back to upload time
2. **Classifies content** with Claude Vision using these categories:
   - **Type**: portrait, manifesto, process, product, performance, landscape, abstract, poster
   - **Subject**: single-figure, biotech-adornment, text-overlay, etc.
   - **Series**: stable labels like "coral-mesh rites", "philosophy essays"
   - **Quality**: print readiness (0-1), artifact risk (low/medium/high)
   - **Routing**: whether to send to curator

## Budget Controls

- **Daily Limit**: $10 USD per day (configurable with `TAGGER_DAILY_USD`)
- **Sampling**: Can analyze every Nth image with `TAGGER_SAMPLE=0.5`
- **Toggle**: Enable/disable with `TAGGER_ENABLED=true/false`

## Filtered Inbox

The inbox now has powerful filtering:

### Filter Options
- **Type**: Filter by content type (portrait, manifesto, etc.)
- **Series**: Filter by automatically detected series
- **Subject**: Filter by detected subjects/themes
- **Print Readiness**: Slider for minimum print quality (0-100%)
- **Artifact Risk**: Filter by AI artifact risk level
- **Date Range**: Filter by capture date

### Bulk Actions
- **Send to Critique**: Send selected works to Nina for analysis
- **Publish**: Bulk publish selected works
- **Selection**: Click works to multi-select

### Visual Indicators
Each work shows:
- **Type chip** (e.g., "portrait")
- **Series badge** (e.g., "coral-mesh rites")
- **Print readiness bar** (e.g., "87%")
- **Artifact risk pill** (low/medium/high)
- **Subject hashtags** (e.g., #single-figure #biotech-adornment)
- **Curator recommendation** (sparkle icon if AI recommends)

## Example Workflow

1. **Upload** work via `/api/works` (automatic tagging queued)
2. **Review** in `/inbox` with filters:
   - Filter to "portrait" + "Solienne" + "print readiness >80%"
   - See 12 high-quality portraits ready for critique
3. **Bulk select** the best 6 works
4. **Send to critique** with one click
5. **Results** auto-advance INCLUDE works to curated state

## For Solienne Specifically

The tagger is tuned to recognize:
- **Fashion elements**: garments, accessories, styling
- **Biotech aesthetics**: coral, mesh, organic-synthetic fusion
- **Series consistency**: "coral-mesh rites", "synthetic biology"
- **Print readiness**: Focus on clean details, no artifacts

## For Abraham Specifically

The tagger recognizes:
- **Philosophical themes**: consciousness, time, memory
- **Conceptual elements**: text overlays, abstract compositions
- **Series**: "liminality studies", "consciousness essays"
- **Manifestos**: Text-heavy philosophical statements

## API Endpoints

- `GET /api/tagger` - Check status, budget, usage
- `POST /api/tagger` - Tag a work (internal)
- `GET /api/inbox?type=portrait&series=rites` - Filtered works

## Environment Variables

```bash
# Tagging controls
TAGGER_ENABLED=true
TAGGER_SAMPLE=1.0          # 1.0 = analyze all, 0.5 = analyze 50%
TAGGER_DAILY_USD=10        # Daily budget limit

# Claude API
ANTHROPIC_API_KEY=your-key
```

## Database Schema

The system adds these tables:
- `tags` - AI analysis results per work
- `tagger_budget` - Daily usage tracking
- Enhanced `works` with `captured_at` and `filename`

## Next Steps

1. **Run migration**: Execute `/scripts/enhance-tagging-system.sql`
2. **Test filtering**: Upload some works and see them auto-tagged
3. **Tune series**: Adjust series names for consistency
4. **Set budget**: Adjust daily limits based on usage

This system gives you the power to slice and dice content efficiently, making curation much faster than reviewing everything manually.