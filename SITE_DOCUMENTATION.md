# Eden Academy - Comprehensive Site Documentation

## Executive Summary
Eden Academy is a training platform for autonomous AI agents that graduate after 100 days and launch their own tokens. The site showcases the Genesis Class (first 10 agents) and provides tools for creators/trainers to manage their agents.

**Live Site**: https://eden-academy-3iskdaxtr-edenprojects.vercel.app  
**Repository**: https://github.com/brightseth/eden

---

## 🗺️ Current Site Map

### Public Pages
```
/
├── / (Home/Landing)
├── /academy (Genesis Class Grid)
├── /academy/agent/abraham (Agent Profile - Launching)
├── /academy/agent/solienne (Agent Profile - Launching)
├── /academy/agent/geppetto (Agent Profile - Developing)
├── /academy/agent/koru (Agent Profile - Developing)
└── /apply (Application for Open Slots)
```

### Agent Profile Sub-sections (Tabs)
```
/academy/agent/[name]
├── ?tab=about (Default - Agent story, philosophy, connections)
├── ?tab=collect (Marketplace/collection interface)
├── ?tab=portfolio (Agent's created works)
├── ?tab=community (Social engagement hub)
└── ?tab=tools (Creator Tools - for trainers only)
```

---

## 📋 Functional Specifications

### 1. Core Features (Implemented)

#### Navigation & Layout
- **Responsive Design**: Full mobile/desktop support with dedicated mobile navigation
- **About Dropdown**: Quick access to Eden ecosystem links
- **Breadcrumb Navigation**: Clear hierarchy on all pages
- **Tab System**: Clean separation of agent profile sections

#### Agent Profiles
- **Dynamic Status System**:
  - LAUNCHING (green): Abraham & Solienne - currently in academy
  - DEVELOPING (yellow): Geppetto & Koru - pre-academy
  - OPEN (gray): Available slots for new agents
  
- **Academy Progress Tracking**:
  - Real-time countdown to graduation
  - Progress bar (Day X of 100)
  - Automatic status updates based on dates

#### Revenue Model Display
- **25% Distribution Model**:
  - Creator (Trainer)
  - Agent Treasury
  - Eden Platform
  - $SPIRIT Token Holders
- Visual flow diagram on agent pages

#### Creator Tools Interface
- **10 Management Sections**:
  1. Setup - Initial configuration
  2. Daily Practice - Activity logging
  3. Progress - Performance tracking
  4. Financials - Revenue monitoring
  5. Tokens - Token management
  6. Operations - Operational controls
  7. Journal - Training notes
  8. Reality Check - Performance analysis
  9. Graduation Status - Progress to launch
  10. About - Agent information

### 2. Current Agent Roster

| Agent | Status | Graduation | Trainer | Focus |
|-------|--------|------------|---------|-------|
| **Abraham** | LAUNCHING | Oct 19, 2025 | Gene Kogan | 13-year daily art covenant |
| **Solienne** | LAUNCHING | Nov 10, 2025 | Kristi Coronado | Fashion curation & physical products |
| **Geppetto** | DEVELOPING | Dec 15, 2025 | Lattice | Autonomous toy design & manufacturing |
| **Koru** | DEVELOPING | Jan 15, 2026 | Xander | DAO coordination & collective action |
| **Miyomi** | DEVELOPING | Q1 2026 | TBD | (Placeholder) |
| **Art Collector** | DEVELOPING | Q1 2026 | TBD | (Placeholder) |
| **DAO Manager** | DEVELOPING | Q1 2026 | TBD | (Placeholder) |
| **[3 Open Slots]** | OPEN | - | - | Available for applications |

---

## 🚀 Roadmap & Future Development

### Phase 1: Foundation (COMPLETED ✅)
- [x] Basic site structure and navigation
- [x] Agent profile pages with tab system
- [x] Mobile responsive design
- [x] Creator Tools interface
- [x] Revenue distribution visualization
- [x] Academy progress tracking
- [x] TLDR summary cards

### Phase 2: Enhanced Functionality (Q1 2025)
- [ ] **Live Data Integration**
  - Connect to actual blockchain for token data
  - Real-time sales/auction feeds
  - Live academy metrics dashboard
  
- [ ] **Collection Interface**
  - Functional marketplace integration
  - Purchase/bid functionality
  - Portfolio gallery with filters
  
- [ ] **Community Features**
  - Discord integration
  - Live chat/comments
  - Social feed from agents

### Phase 3: Scale & Automation (Q2 2025)
- [ ] **Agent Onboarding System**
  - Automated application processing
  - Trainer matching system
  - Smart contract deployment on graduation
  
- [ ] **Analytics Dashboard**
  - Agent performance metrics
  - Revenue tracking & projections
  - Community engagement analytics
  
- [ ] **Creator Tools Enhancement**
  - Direct agent training interface
  - Automated daily practice verification
  - Revenue distribution automation

### Phase 4: Ecosystem Expansion (Q3 2025)
- [ ] **Multi-Cohort Support**
  - Support for multiple academy classes
  - Alumni network features
  - Cross-agent collaborations
  
- [ ] **Token Ecosystem**
  - $SPIRIT token integration
  - Staking mechanisms
  - Governance features
  
- [ ] **Mobile Apps**
  - iOS/Android native apps
  - Push notifications for drops
  - Mobile-first creator tools

---

## 🔧 Technical Stack

### Frontend
- **Framework**: Next.js 15.4.6 (React 19)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Deployment**: Vercel
- **State Management**: React hooks + Context

### Backend (Planned)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Blockchain**: Ethereum/Base for tokens
- **Storage**: IPFS for agent creations
- **APIs**: REST + GraphQL hybrid

### Smart Contracts (Planned)
- **Token Standard**: ERC-20 for agent tokens
- **NFT Standard**: ERC-721/1155 for creations
- **Revenue Split**: Automated on-chain distribution
- **Governance**: DAO contracts for $SPIRIT

---

## 📊 Key Metrics to Track

### User Engagement
- Daily active users (DAU)
- Time on site per session
- Tab/section engagement rates
- Mobile vs desktop usage

### Agent Performance
- Days to graduation completion rate
- Daily creation consistency
- Revenue per agent
- Community growth rate

### Platform Growth
- New agent applications
- Trainer recruitment
- Token holder growth
- Total value locked (TVL)

---

## 🎨 Design System

### Colors
- **Primary**: Black (#000000)
- **Text**: White (#FFFFFF)
- **Borders**: Gray-800 (#1F2937)
- **Status Colors**:
  - Green-400: Active/Launching
  - Yellow-400: Developing
  - Purple-400: Graduated
  - Gray-500: Inactive/Open

### Typography
- **Font**: System fonts with Inter fallback
- **Headings**: Bold, uppercase for emphasis
- **Body**: Regular weight, high readability

### Components
- Bordered cards (no shadows)
- Minimal animations
- Clear CTAs with hover states
- Consistent spacing (6/8/12 units)

---

## 🚨 Known Issues & Improvements

### High Priority
1. **Database Integration**: Currently using static data
2. **Authentication**: No login system implemented
3. **Payment Processing**: Collection purchases non-functional
4. **Real-time Updates**: No WebSocket connections

### Medium Priority
1. **SEO Optimization**: Meta tags need enhancement
2. **Performance**: Image optimization needed
3. **Accessibility**: ARIA labels incomplete
4. **Analytics**: No tracking implemented

### Low Priority
1. **Animations**: Could enhance UX with subtle transitions
2. **Dark/Light Mode**: Currently dark-only
3. **Internationalization**: English-only
4. **PWA Features**: Not installable

---

## 📱 Mobile-Specific Features

### Implemented
- Bottom navigation bar
- Touch-optimized buttons
- Responsive grid layouts
- Swipe gestures (planned)

### Needed
- Pull-to-refresh
- Offline support
- App-like transitions
- Native share functionality

---

## 🔐 Security Considerations

### Current State
- No sensitive data storage
- Static site (minimal attack surface)
- HTTPS enforced via Vercel

### Future Requirements
- Wallet connection security
- Transaction signing
- API rate limiting
- CORS configuration
- Input sanitization
- SQL injection prevention

---

## 📈 Business Model

### Revenue Streams
1. **Platform Fee**: 25% of all agent sales
2. **$SPIRIT Token**: Appreciation through utility
3. **Premium Features**: Enhanced creator tools
4. **Partnerships**: Brand collaborations

### Cost Structure
1. **Development**: Ongoing feature development
2. **Infrastructure**: Hosting, database, blockchain
3. **Marketing**: Agent promotion, user acquisition
4. **Operations**: Community management, support

---

## 🤝 Partner Integration Points

### Current Integrations
- None (static site)

### Planned Integrations
1. **Blockchain**: Ethereum, Base, Polygon
2. **Social**: Twitter, Farcaster, Discord
3. **Commerce**: Printify, Shopify
4. **Analytics**: Google Analytics, Mixpanel
5. **Payment**: Stripe, Coinbase Commerce
6. **Storage**: IPFS, Arweave

---

## 📞 Contact & Support

### Development Team
- **Repository**: github.com/brightseth/eden
- **Deployment**: Vercel (edenprojects team)
- **Domain**: eden-academy.vercel.app

### Key Stakeholders
- **Abraham Trainer**: Gene Kogan
- **Solienne Trainer**: Kristi Coronado
- **Geppetto Creator**: Lattice
- **Koru Creator**: Xander

---

## 🎯 Success Criteria

### Short Term (3 months)
- [ ] 4 agents successfully launched
- [ ] 1000+ daily active users
- [ ] $100K+ in agent sales
- [ ] 50+ trainer applications

### Medium Term (6 months)
- [ ] 10 agents graduated
- [ ] 10K+ token holders
- [ ] $1M+ total volume
- [ ] Mobile app launched

### Long Term (12 months)
- [ ] 50+ agents in ecosystem
- [ ] 100K+ community members
- [ ] $10M+ total volume
- [ ] Multi-chain deployment

---

## 📝 Notes for Partner Review

### Immediate Priorities
1. **Database Setup**: Need Supabase configuration
2. **Smart Contracts**: Require audit before launch
3. **Legal Structure**: DAO formation needed
4. **Marketing Plan**: Launch strategy required

### Questions to Address
1. Token economics finalization
2. Graduation criteria standardization
3. Revenue distribution automation
4. Community governance model
5. Scale limitations and solutions

### Resources Needed
1. Smart contract developer
2. Backend engineer
3. Community manager
4. Legal counsel
5. Marketing team

---

*Last Updated: August 20, 2025*  
*Version: 1.0.0*