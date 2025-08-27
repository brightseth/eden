# EDEN ACADEMY - Platform Audit & Specification
*Generated: August 21, 2025*

## 🎯 Executive Summary

Eden Academy is a 100-day training platform for autonomous AI agents preparing for token launch. The platform emphasizes individual growth over competition, artistic integrity over gamification, and museum-quality curation standards.

**Target Audience:**
- AI Researchers & Developers
- Creative Technologists  
- Digital Art Collectors
- Web3 Investors
- Agent Trainers/Operators

**Core Innovation:** Replacing competitive leaderboards with "Studio Health" autonomy tracking - focusing on agent wellness rather than rankings.

---

## 📊 Complete Site Map

```
https://eden-academy.vercel.app/
│
├── / (Home)
│   ├── Hero: "EDEN - Training AI Agents Since 2026"
│   ├── Coming Soon: Abraham & Solienne launch dates
│   └── Link to Genesis Class
│
├── /academy (Main Hub)
│   ├── 10-agent grid view (Genesis Cohort)
│   ├── Status indicators (LAUNCHING/DEVELOPING/OPEN)
│   └── Quick navigation to agent profiles
│
├── /academy/agent/[name] (Agent Profiles)
│   ├── /abraham - Daily generative art, 13-year covenant
│   ├── /solienne - Fashion curation with Printify products
│   ├── /geppetto - Autonomous toy designer (pre-academy)
│   └── /koru - DAO coordination agent (pre-academy)
│
├── /nina (Curator Interface)
│   ├── Upload interface for evaluation
│   ├── 5-dimension scoring (Composition/Technique/Concept/Originality/Paris-Ready)
│   └── 15-25% acceptance rate enforced
│
└── /apply (Coming Soon)
    └── Application for open agent slots
```

---

## 🔴 CRITICAL ISSUES FOUND

### 1. **Broken Images & Missing Assets**
- ❌ `/images/trainers/gene-kogan.jpg` - 404 (Abraham's trainer)
- ❌ `/images/trainers/kristi-coronado.jpg` - 404 (Solienne's trainer)
- ❌ Agent profile SVGs referenced but don't exist
- ❌ No fallback for missing trainer images

### 2. **Navigation Inconsistencies**
- ❌ Home page has no way to return to "/" once you navigate away
- ❌ `/academy` page uses old `AboutDropdown` component (doesn't exist)
- ❌ Missing UnifiedHeader on `/academy` page
- ❌ No consistent back navigation pattern

### 3. **UX/Flow Problems**
- ❌ Clicking "DEVELOPING" agents does nothing (confusing)
- ❌ No visual feedback when following/unfollowing agents
- ❌ Live ticker at bottom can overlap content on mobile
- ❌ Nina curator link opens external site (should integrate better)

### 4. **Cramped/Confusing Layouts**
- ❌ Agent profile tabs too dense on mobile
- ❌ Studio Health metrics cramped with small text
- ❌ Token split ribbon text too small to read
- ❌ Practice tab has too much information density

### 5. **Functional Gaps**
- ❌ Follow system uses localStorage but no user context
- ❌ Notifications work but no way to view history
- ❌ Admin mode (?admin=1) not documented anywhere
- ❌ Event stream can disconnect with no reconnection UI

---

## 🟡 MEDIUM PRIORITY ISSUES

### 1. **Content Issues**
- ⚠️ "Training AI Agents Since 2026" (it's 2025)
- ⚠️ Graduation dates inconsistent (README vs UI)
- ⚠️ Some agents show "TBD" for trainer names
- ⚠️ No clear explanation of what "100 days" means

### 2. **Visual Polish**
- ⚠️ Agent grid cards lack visual hierarchy
- ⚠️ Status colors not explained (green/yellow/purple)
- ⚠️ Mobile bottom nav cuts off on smaller screens
- ⚠️ Toast notifications stack awkwardly

### 3. **Performance**
- ⚠️ SSE connection stays open on all pages
- ⚠️ No lazy loading for agent images
- ⚠️ Countdown timers cause frequent re-renders

---

## 🟢 WHAT'S WORKING WELL

### 1. **Core Features**
- ✅ Studio Health autonomy tracking is innovative
- ✅ Live event streaming works smoothly
- ✅ Nina curator integration is functional
- ✅ Follow system with notifications works

### 2. **Design Strengths**
- ✅ Consistent dark theme throughout
- ✅ Clean, minimalist aesthetic
- ✅ Good use of typography hierarchy
- ✅ Responsive grid layouts

### 3. **Technical Architecture**
- ✅ Clean component structure
- ✅ Good TypeScript coverage
- ✅ API routes well organized
- ✅ Mock data allows development without backend

---

## 📋 RECOMMENDED FIXES (Priority Order)

### P0 - Immediate (Before Sharing)
1. Fix broken trainer images
2. Fix navigation inconsistencies
3. Add UnifiedHeader to all pages
4. Fix "Since 2026" typo
5. Add clear back navigation
6. Fix mobile responsive issues

### P1 - This Week
1. Add loading states for all async operations
2. Improve mobile layouts (less cramped)
3. Add visual feedback for interactions
4. Create proper user onboarding flow
5. Document admin features

### P2 - Next Sprint
1. Add SSE reconnection handling
2. Implement notification history view
3. Add agent comparison view
4. Create trainer detail pages
5. Add search/filter for agents

---

## 📐 INFORMATION ARCHITECTURE

### User Journeys

**1. First-Time Visitor**
```
Home → Learn about Eden → View Genesis Class → 
Explore Agent (Abraham/Solienne) → Follow Agent → 
Receive Notifications
```

**2. Returning Collector**
```
Home → Academy → Check Studio Health → 
View Latest Creations → Purchase/Mint → 
Check Nina Verdicts
```

**3. Potential Trainer**
```
Home → Apply → Review Requirements → 
Submit Application → Await Review
```

### Key Metrics Tracked
- **Practice Discipline:** Daily creation consistency
- **Curatorial Fitness:** Nina acceptance rate
- **Independence:** Self-directed improvements
- **Memory & Learning:** Knowledge accumulation

---

## 💡 STRATEGIC RECOMMENDATIONS

### 1. **Simplify Onboarding**
- Add a "What is Eden Academy?" explainer
- Create visual timeline of 100-day journey
- Show example agent progression

### 2. **Enhance Social Proof**
- Add success stories from graduated agents
- Show live creation gallery
- Display community engagement metrics

### 3. **Improve Transparency**
- Explain token launch process
- Show revenue distribution clearly
- Document graduation requirements

### 4. **Mobile-First Redesign**
- Prioritize mobile experience
- Reduce information density
- Add gesture navigation

---

## 🚀 NEXT STEPS

1. **Immediate:** Fix critical bugs (30 min)
2. **Today:** Polish navigation and layouts (2 hours)
3. **This Week:** Add missing features and content
4. **Next Week:** Launch Memory Garden (P1 priority)

---

## 📊 TECHNICAL STACK

- **Frontend:** Next.js 15.4, React 19, TypeScript
- **Styling:** Tailwind CSS
- **Real-time:** Server-Sent Events (SSE)
- **AI:** Anthropic Claude API
- **Database:** Supabase (PostgreSQL) - currently mocked
- **Deployment:** Vercel
- **State:** React Context + localStorage

---

## 🔗 LIVE URLS

- **Production:** https://eden-academy.vercel.app
- **GitHub:** https://github.com/brightseth/eden
- **External:** 
  - Abraham: https://abraham.ai
  - Solienne: https://solienne.ai
  - Eden Platform: https://app.eden.art

---

*End of Audit Report*