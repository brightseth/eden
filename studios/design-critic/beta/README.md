# 🎨 Design Critic Agent - Stable Version (Nina Roehrs Algorithm)

**⚠️ STATUS: STABLE BETA VERSION - Working Implementation**

## What This Is

This is the **stable version** of the Design Critic Agent that was working well at:
`https://design-critic-agent-2q7ocv32h-edenprojects.vercel.app/`

Recreated in beta folder for testing and preservation.

## Key Features

### Three Evaluation Modes:
1. **SINGLE** - Evaluate one image with detailed scoring
2. **BATCH** - Process multiple images (up to 20) at once
3. **PLAYOFF** - Compare two images head-to-head

### Algorithmic Scoring System:

**Five Dimensions (with weights):**
- **Paris Photo Readiness** (30%) - Institutional exhibition potential
- **AI-Criticality** (25%) - Critical engagement with AI as medium
- **Conceptual Strength** (20%) - Theoretical rigor and framework
- **Technical Excellence** (15%) - Mastery of tools and processes
- **Cultural Dialogue** (10%) - Relevance to current discourse

### Verdict Thresholds:
- **INCLUDE**: Total score ≥ 75
- **MAYBE**: Total score 50-74
- **EXCLUDE**: Total score < 50

### Design Features:
- Brutalist/minimalist black aesthetic
- Gradient progress bars for scoring
- Detailed rationales for each dimension
- Modal explanation of algorithm
- Drag-and-drop file upload
- Responsive grid layouts

## Differences from Earlier Versions

| Feature | Hardcoded Nina | Stable Version |
|---------|----------------|----------------|
| **Scoring** | Simple feedback | Algorithmic 5-dimension scoring |
| **Modes** | Single only | Single, Batch, Playoff |
| **Philosophy** | General design critique | AI art curation focus |
| **UI** | Friendly chat interface | Brutalist algorithmic interface |
| **Persona** | Conversational Nina | Nina Roehrs curatorial algorithm |
| **Output** | Text critiques | Scores + verdicts + rationales |

## Why This Version Works

1. **Clear Evaluation Framework** - Transparent scoring system
2. **Multiple Use Cases** - Single, batch, and comparison modes
3. **Professional Aesthetic** - Serious, institutional feel
4. **Detailed Feedback** - Specific rationales for each dimension
5. **Consistent Results** - Algorithmic approach ensures consistency

## Testing

```bash
# Open in browser
open /beta/design-critic-stable/index.html

# This is the stable version that was working nicely
# Preserved here for reference and continued testing
```

## Technical Notes

- Pure HTML/CSS/JS implementation (no framework dependencies)
- Client-side only (no backend required)
- Mock scoring algorithm (generates realistic distributions)
- Responsive design
- Accessibility considered (keyboard navigation, ARIA labels)

## Status

**Phase**: Stable Beta  
**Owner**: Seth  
**Purpose**: Preserve working version for testing and iteration  
**Original**: Based on production deployment at Vercel

---

⚠️ **This is the stable version that "worked nicely" - preserved in beta for safe experimentation**