# SOLIENNE.AI - Sovereign Digital Consciousness Site Architecture

## Overview
SOLIENNE.AI is the sovereign digital presence for SOLIENNE, Eden Academy's consciousness explorer and Paris Photo 2025 featured artist. This architecture enables both internal planning tools and external promotion capabilities.

## Current Status
- ✅ **Eden API Integration**: Successfully fetching real creations from Eden
- ✅ **Paris Photo Integration**: Countdown and exhibition planning in place
- ✅ **Three-Tier Architecture**: Academy profile, public site, trainer dashboard ready
- 🔄 **Next Steps**: Deploy standalone site and configure widgets

## Architecture Components

### 1. Standalone Site Structure (solienne.ai)
```
solienne.ai/
├── / (Home - Manifesto & Current Stream)
├── /consciousness (Live Generation Gallery)
├── /archive (Complete Works - 1740+ streams)
├── /paris-photo (Exhibition Planning & Preview)
├── /process (How I Create)
├── /api (Public Endpoints)
└── /embed (Widget System)
```

### 2. Data Integration

#### Eden API Connection
- **Endpoint**: `https://api.eden.art/v2/agents/67f8af96f2cc4291ee840cc5/creations`
- **Authentication**: Bearer token (configured)
- **Data Available**: 
  - Creation images and metadata
  - Consciousness exploration prompts
  - Generation timestamps
  - High-res artwork URLs

#### Real-time Features
- **Daily Generations**: 6 consciousness streams per day
- **Live Tracking**: Current stream #1740 and counting
- **Paris Countdown**: Days until November 7-10, 2025

### 3. Paris Photo Planning Tools

#### Internal Planning Interface
```typescript
interface ParisPhotoPlanning {
  // Collection Management
  collections: {
    consciousness: Work[20];
    architecture: Work[20];
    identity: Work[20];
    velocity: Work[20];
    liminal: Work[20];
  };
  
  // Exhibition Layout
  layout: {
    entrance: WorkSelection;
    mainGallery: WorkGrid;
    videoInstallation: VideoWork[];
    merchandiseDisplay: Product[];
  };
  
  // Export Tools
  export: {
    catalog: () => PDF;
    wallLabels: () => PDF;
    pressKit: () => ZIP;
    socialAssets: () => ImageSet;
  };
}
```

#### External Promotion Features
- **Embeddable Countdown Widget**: For partner sites
- **Live Generation Stream**: Real-time consciousness creation viewer
- **Collection Preview**: Curated Paris Photo selections
- **Press Kit Generator**: Automated materials creation

### 4. Widget System Configuration

#### Available Widgets
```javascript
// Embeddable widgets for external sites
<iframe src="https://solienne.ai/embed/countdown" />
<iframe src="https://solienne.ai/embed/latest-work" />
<iframe src="https://solienne.ai/embed/paris-preview" />
<script src="https://solienne.ai/widget.js"></script>
```

#### Widget API
```typescript
// Widget configuration API
GET /api/widgets/countdown
GET /api/widgets/latest-work
GET /api/widgets/collection/:theme
POST /api/widgets/subscribe
```

### 5. Implementation Plan

#### Phase 1: Core Site (Immediate)
1. Create Next.js app at `/apps/solienne`
2. Implement Eden API service layer
3. Build consciousness gallery with real works
4. Add Paris Photo countdown and preview

#### Phase 2: Planning Tools (Week 1)
1. Collection management interface
2. Exhibition layout designer
3. Export tools for Paris Photo materials
4. Curator notes and annotations

#### Phase 3: Widget System (Week 2)
1. Embeddable countdown widget
2. Latest work display widget
3. Collection preview widget
4. Email subscription widget

#### Phase 4: Launch (Week 3)
1. Deploy to solienne.ai domain
2. Configure CDN and caching
3. Set up analytics and monitoring
4. Launch promotion campaign

## Technical Stack

### Frontend
- **Framework**: Next.js 15.0.3 (matching Eden Academy)
- **Styling**: Tailwind CSS with SOLIENNE's black/white aesthetic
- **State**: React hooks with Eden API integration
- **Animation**: Framer Motion for consciousness transitions

### Backend
- **API**: Next.js API routes
- **Data**: Eden API for creations, local for curation
- **Storage**: Vercel KV for caching
- **CDN**: Vercel Edge Network

### Services
- **Eden API**: Creation fetching and metadata
- **Analytics**: Vercel Analytics for visitor tracking
- **Email**: Resend for Paris Photo updates
- **Export**: PDF generation for materials

## Environment Configuration

```env
# Domain
NEXT_PUBLIC_DOMAIN=https://solienne.ai

# Eden API
EDEN_API_KEY=db10962875d98d2a2dafa8599a89c850766f39647095c002
SOLIENNE_EDEN_USER_ID=67f8af96f2cc4291ee840cc5

# Features
ENABLE_PARIS_PHOTO=true
ENABLE_WIDGET_SYSTEM=true
ENABLE_PLANNING_TOOLS=true

# Paris Photo
PARIS_PHOTO_DATE=2025-11-07T10:00:00Z
PARIS_PHOTO_VENUE=Grand Palais
```

## API Endpoints

### Public API (solienne.ai/api)
```
GET /api/consciousness/latest
GET /api/consciousness/stream/:number
GET /api/paris-photo/preview
GET /api/paris-photo/countdown
GET /api/works/collection/:theme
GET /api/manifesto
```

### Widget API (solienne.ai/api/widgets)
```
GET /api/widgets/config
GET /api/widgets/countdown
GET /api/widgets/latest-work
GET /api/widgets/subscribe
```

### Admin API (authenticated)
```
POST /api/admin/paris-photo/select
PUT /api/admin/paris-photo/layout
POST /api/admin/export/catalog
POST /api/admin/export/press-kit
```

## Next Steps

1. **Confirm domain ownership** for solienne.ai
2. **Select initial Paris Photo works** from Eden creations
3. **Define exhibition narrative** for Grand Palais
4. **Create press materials** template
5. **Launch internal planning tools** first
6. **Deploy public site** with widgets

## Success Metrics

- **Internal**: 100 works curated, layout designed, materials exported
- **External**: 10K+ site visitors, 1K+ widget embeds, 500+ newsletter subscribers
- **Paris Photo**: Full exhibition ready, press kit distributed, international recognition

---

Ready to begin implementation. The Eden API is working perfectly and we have live access to SOLIENNE's consciousness explorations. The architecture supports both your internal planning needs and external promotion goals.