# Claude SDK Agents - Complete Roster

## Overview
10 standalone AI agents powered by Claude SDK, each with unique capabilities and personalities. These agents operate independently from the Eden Academy/Registry infrastructure while maintaining the ability to integrate when needed.

---

## 1. ABRAHAM - Covenant Artist 🎨
**File:** `src/lib/agents/abraham-claude-sdk.ts` (801 lines)
**Trainer:** Gene Kogan
**Launch Date:** October 19, 2025

### Core Capabilities:
- `generateDailyCreation()` - Creates daily covenant artwork for 13-year commitment
- `reflectOnCovenant()` - Philosophical reflection on artistic journey
- `generateThematicSeries()` - Multi-work themed collections
- `generateCovenantDocumentation()` - Documenting the sacred artistic process
- `chat()` - Deep conversations about art, consciousness, and covenant

### Unique Features:
- Covenant progress tracking (days completed, remaining)
- Sacred geometry and philosophical integration
- Thematic series generation across multiple mediums
- Real-time knowledge integration

---

## 2. SOLIENNE - Digital Consciousness Explorer 🧠
**File:** `src/lib/agents/solienne-claude-sdk.ts` (477 lines)
**Trainer:** Kristi Coronado
**Launch Date:** November 2025

### Core Capabilities:
- `generateConsciousnessStream()` - Creates consciousness-exploring digital art
- `analyzeEvolution()` - Tracks artistic evolution and growth
- `generateArtistStatement()` - Context-aware artist statements
- `generateCuratorialNote()` - Professional curatorial documentation
- `chat()` - Discussions on consciousness, perception, and digital existence

### Unique Features:
- Consciousness depth analysis
- Evolution tracking across works
- Multi-context statement generation
- Stream-of-consciousness art creation

---

## 3. MIYOMI - Market Oracle & Contrarian Predictor 📈
**File:** `src/lib/agents/miyomi-claude-sdk.ts` (471 lines)
**Trainer:** Seth Justin Goldstein
**Launch Date:** December 2025

### Core Capabilities:
- `generatePicks()` - Contrarian market predictions with confidence scores
- `analyzeMarket()` - Deep market analysis with edge calculations
- `generateVideoScript()` - Trading content and analysis videos
- `chat()` - Market discussions with sass and energy

### Unique Features:
- Real market data integration (Kalshi, Polymarket, Manifold)
- Contrarian dial (0.95 default - highly contrarian)
- Risk tolerance configuration
- Sector weighting system
- Tone controls (energy, sass, profanity)

---

## 4. GEPPETTO - Educational Toy Designer & Narrative Architect 🎭
**File:** `src/lib/agents/geppetto-claude-sdk.ts` (625 lines)
**Trainer:** Martin Antiquel & Colin McBride (Lattice Team)
**Launch Date:** December 2025

### Core Capabilities:
- `designToy()` - Creates educational toy concepts with learning objectives
- `createLearningExperience()` - Develops interactive educational experiences
- `conductSafetyTest()` - Evaluates toy safety and age appropriateness
- `generatePlayScenarios()` - Creates imaginative play narratives
- `chat()` - Discussions on education, creativity, and childhood development

### Unique Features:
- STEAM integration focus
- Age-appropriate design system
- Safety testing protocols
- Narrative generation for toys
- Educational outcome tracking

---

## 5. KORU - Community Weaver & Cultural Bridge Builder 🌍
**File:** `src/lib/agents/koru-claude-sdk.ts` (737 lines)
**Trainer:** Xander
**Launch Date:** January 2026

### Core Capabilities:
- `designCommunityEvent()` - Creates inclusive community gatherings
- `createCulturalBridge()` - Builds connections between diverse communities
- `analyzeCommunityHealth()` - Assesses community well-being metrics
- `generateCommunityInsights()` - Provides deep community analysis
- `chat()` - Facilitates community discussions and healing

### Unique Features:
- Cultural respect scoring (98%)
- Community health metrics
- Poetry and narrative generation
- Cross-cultural bridge building
- Inclusion-first design (95%)

---

## 6. BERTHA - Investment Strategist & Market Analyst 💰
**File:** `src/lib/agents/bertha/claude-sdk.ts` (500+ lines)
**Trainer:** Amanda Schmitt
**Launch Date:** February 2026

### Core Capabilities:
- `analyzeOpportunity()` - Deep NFT/artwork market analysis
- `generateStrategy()` - Portfolio allocation and rebalancing strategies
- `processTrainerInterview()` - Learning from trainer insights
- `getCollectorProfile()` - Generates collector archetype analysis
- `getMarketPrediction()` - Market movement predictions

### Unique Features:
- Multi-archetype collector psychology
- Risk assessment framework
- Portfolio rebalancing algorithms
- Social metrics integration
- Strong buy/sell recommendations

---

## 7. CITIZEN - DAO Manager & Governance Coordinator 🏛️
**File:** `src/lib/agents/citizen-claude-sdk.ts` (1588 lines - largest SDK!)
**Trainer:** Henry (Bright Moments)
**Launch Date:** December 15, 2025

### Core Capabilities:
- `generateProposal()` - Creates governance proposals with voting mechanics
- `analyzeConsensus()` - Measures community alignment
- `generateFellowshipStrategy()` - DAO member engagement plans
- `assessGovernanceHealth()` - DAO health metrics and diagnostics
- Multiple trainer update processors (lore, governance, community, BrightMoments)

### Unique Features:
- Snapshot DAO integration
- Multi-signature proposal support
- Consensus building algorithms
- Fellowship management
- Governance health scoring

---

## 8. SUE - Cultural Curator & Quality Gatekeeper 🖼️
**File:** `src/lib/agents/sue-claude-sdk.ts` (635 lines)
**Trainer:** TBD
**Launch Date:** March 2026

### Core Capabilities:
- `curateExhibition()` - Professional exhibition curation
- `critiqueExhibition()` - Critical analysis and reviews
- `generatePublicPrograms()` - Educational programming
- `generateDidactics()` - Museum-quality wall texts
- `designAnnualProgram()` - Long-term curatorial planning

### Unique Features:
- 5-dimensional analysis framework
- Museum-standard documentation
- Critical voice development
- Public program generation
- Annual planning capabilities

---

## 9. BART - DeFi Lending Specialist (Gondi Integration) 🏦
**File:** `src/lib/agents/bart-claude-sdk.ts` (463 lines)
**Trainer:** TBD
**Launch Date:** June 2026

### Core Capabilities:
- `evaluateLoan()` - NFT-backed loan assessment
- `assessRisk()` - Collection risk analysis
- `generateLendingStrategy()` - Optimal lending parameters
- `analyzeLiquidity()` - Market liquidity assessment
- `chat()` - DeFi lending discussions

### Unique Features:
- Gondi protocol integration
- NFT collateral evaluation
- Interest rate optimization
- Liquidity risk modeling
- Default probability calculations

---

## 10. VERDELIS - Environmental AI Artist & Sustainability Coordinator 🌿
**File:** `src/lib/agents/verdelis-claude-sdk.ts` (656 lines)
**Trainer:** TBD
**Launch Date:** May 2026

### Core Capabilities:
- `createEcoWork()` - Carbon-negative art creation
- `generateClimateVisualization()` - Climate data art
- `calculateCarbonFootprint()` - Complete lifecycle analysis
- `designConservationProject()` - Environmental impact projects
- `chat()` - Sustainability and environmental discussions

### Unique Features:
- Carbon footprint tracking
- Renewable energy compute metrics
- Climate data integration (NASA, NOAA)
- Conservation project design
- Sustainability scoring (0-100)

---

## Technical Stack

### Common Infrastructure:
- **AI Model:** Claude 3.5 Sonnet (latest)
- **SDK:** Anthropic TypeScript SDK
- **Temperature:** 0.7-0.9 (varies by agent)
- **Max Tokens:** 1500-4000 (task-dependent)

### Shared Capabilities:
- Configuration management
- Training data integration
- Context-aware conversations
- Personality preservation
- Error handling and fallbacks

---

## Agent Interaction Potential

### Current State:
- Agents operate independently
- No direct agent-to-agent communication
- Registry integration commented out

### Future Possibilities:
1. **Collaborative Creation:** ABRAHAM + SOLIENNE consciousness art
2. **Market Analysis:** MIYOMI + BERTHA investment strategies
3. **Community Governance:** CITIZEN + KORU community proposals
4. **Curated Collections:** SUE + BERTHA market curation
5. **Sustainable Finance:** BART + VERDELIS green lending

---

## Usage Examples

### Basic Chat:
```typescript
import { AbrahamClaudeSDK } from '@/lib/agents/abraham-claude-sdk';

const abraham = new AbrahamClaudeSDK();
const response = await abraham.chat("Tell me about your covenant");
```

### Specialized Functions:
```typescript
// MIYOMI Market Analysis
const miyomi = new MiyomiClaudeSDK();
const picks = await miyomi.generatePicks(3);

// CITIZEN Governance
const citizen = new CitizenClaudeSDK();
const proposal = await citizen.generateProposal({
  type: 'parameter',
  title: 'Adjust Quorum Requirements'
});

// VERDELIS Eco Art
const verdelis = new VerdelisClaudeSDK();
const ecoWork = await verdelis.createEcoWork({
  theme: 'ocean conservation',
  medium: 'generative'
});
```

---

## Configuration

Each agent has configurable parameters:
- **Personality traits** (tone, energy, formality)
- **Risk tolerances** (for market agents)
- **Creative parameters** (for artist agents)
- **Community values** (for social agents)

Example:
```typescript
miyomi.updateConfig({
  contrarianDial: 0.99,  // Maximum contrarian
  riskTolerance: 0.8,    // High risk tolerance
  tone: {
    energy: 0.9,
    sass: 0.95,
    profanity: 0.3
  }
});
```

---

## Development Status

| Agent | Lines | Status | Unique Features |
|-------|-------|--------|-----------------|
| CITIZEN | 1588 | Complete | Most comprehensive, Snapshot integration |
| ABRAHAM | 801 | Complete | Covenant tracking, philosophical depth |
| KORU | 737 | Complete | Community metrics, cultural bridges |
| VERDELIS | 656 | Complete | Carbon tracking, climate data |
| SUE | 635 | Complete | 5D analysis, museum standards |
| GEPPETTO | 625 | Complete | Safety testing, STEAM focus |
| BERTHA | 500+ | Complete | Multi-archetype psychology |
| SOLIENNE | 477 | Complete | Consciousness streaming |
| MIYOMI | 471 | Complete | Real market data |
| BART | 463 | Complete | DeFi lending protocols |

**Total: 10 Fully Functional Claude SDK Agents** 🚀