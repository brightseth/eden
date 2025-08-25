# ABRAHAM & SOLIENNE WORKS STORAGE LOCATIONS

## 🗂️ **Database Tables (Supabase)**

### Primary Table: `agent_archives`
**Location**: Supabase Database `https://ctlygyrkibupejllgglr.supabase.co`

**Abraham's Works**:
```sql
SELECT * FROM agent_archives 
WHERE agent_id = 'abraham' 
AND archive_type = 'early-work';
```
- **Count**: 2,519 works
- **Type**: `early-work`
- **Status**: Pre-covenant historical works

**Solienne's Works**:
```sql
SELECT * FROM agent_archives 
WHERE agent_id = 'solienne' 
AND archive_type = 'generation';
```
- **Count**: 1,740 works (cleaned from 3,677)
- **Type**: `generation`
- **Status**: Current portfolio for Paris Photo

### Table Schema:
```sql
agent_archives:
- id (uuid)
- agent_id (text) -> 'abraham' | 'solienne'
- archive_type (text) -> 'early-work' | 'generation' | 'covenant'
- archive_number (integer)
- title (text)
- image_url (text) -> Points to Supabase Storage
- metadata (jsonb) -> Tags, prompts, generation params
- created_date (timestamp)
- updated_at (timestamp)
```

## 🖼️ **Image Storage (Supabase Storage)**

### Storage Bucket: `agent-works`
**Location**: Supabase Storage in your project

**Abraham's Images**:
- **Bucket Path**: `agent-works/abraham/early-works/`
- **URL Pattern**: `https://ctlygyrkibupejllgglr.supabase.co/storage/v1/object/public/agent-works/abraham/early-works/[filename]`
- **Format**: Likely PNG/JPG files

**Solienne's Images**:
- **Bucket Path**: `agent-works/solienne/generations/`  
- **URL Pattern**: `https://ctlygyrkibupejllgglr.supabase.co/storage/v1/object/public/agent-works/solienne/generations/[filename]`
- **Format**: Likely PNG/JPG files

### Sample URL Structure:
```
https://ctlygyrkibupejllgglr.supabase.co/storage/v1/object/public/agent-works/
├── abraham/
│   └── early-works/
│       ├── abraham_001.png
│       ├── abraham_002.png
│       └── ... (2,519 total)
└── solienne/
    └── generations/
        ├── solienne_001.png
        ├── solienne_002.png
        └── ... (1,740 total)
```

## 🔗 **Data Relationship**
Each record in `agent_archives` has:
- `image_url` field pointing to Supabase Storage
- `metadata` field with generation parameters, tags, etc.
- Agent ID linking to agent profile

## 📱 **Local Static Assets (Limited)**
**Location**: `/Users/seth/eden-academy/public/`

Only contains:
- `/public/agents/abraham/profile.svg` - Profile avatar
- `/public/agents/solienne/profile.svg` - Profile avatar  
- `/public/images/gallery/abraham-hero.png` - Hero image
- `/public/images/gallery/solienne-hero.png` - Hero image
- `/public/videos/solienne-trailer.mp4` - Exhibition trailer

## 🔄 **For Registry Migration**

You'll need to:

1. **Export Metadata**:
   ```sql
   SELECT * FROM agent_archives WHERE agent_id IN ('abraham', 'solienne');
   ```

2. **Copy Images**: 
   - Either migrate the entire Supabase Storage bucket
   - Or copy images to new storage and update URLs

3. **Transform Data**:
   - `agent_archives` → `creations` table in Registry
   - Keep `image_url` references or update to new storage URLs
   - Transform `metadata` field to Registry format

## 🔍 **Access Methods**

**APIs Available**:
- `/api/agents/abraham/works` - Abraham's works with pagination
- `/api/agents/solienne/works` - Solienne's works with filtering
- `/api/agents/solienne/latest` - Latest Solienne work

**Components Using Storage**:
- `EnhancedArchiveBrowser.tsx` - Main gallery view
- `CurationInterface.tsx` - Trainer curation tool
- `ParisPhotoCuration.tsx` - Exhibition selection

**Environment Variables**:
All in `/Users/seth/eden-academy/.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` 
- `SUPABASE_SERVICE_KEY`

The actual image files are in **Supabase Storage**, not in your local filesystem. The `agent_archives` table contains all the metadata and URLs pointing to those stored images.