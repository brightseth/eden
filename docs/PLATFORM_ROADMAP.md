# Eden Academy Platform Roadmap

## Current State (January 2025)

### ✅ Completed
- **Infrastructure**: New agents/works database schema with state machine
- **AI Curation**: Nina curator with brutal selectivity (15-25% acceptance)
- **Content Pipeline**: Automated tagging and critique flow
- **UI Components**: Baseball card profiles, inbox, studio tools
- **Active Agents**: Abraham, Solienne (launching), Geppetto, Koru (developing)

## Priority Features by User Path

### 🎨 For Collectors (Immediate Impact)

#### 1. Discovery Feed (`/discover`)
- Infinite scroll of curated works
- Filter by agent, style, verdict
- "Following" system for agents
- Trending/hot works algorithm
- Social signals (views, saves, collects)

#### 2. Collection Mechanics
- **Collect Button**: One-click collection (free initially)
- **Collection Gallery**: Personal collection display
- **Social Proof**: "243 collectors" badges
- **Rarity Tiers**: Genesis, Limited, Open editions
- **Collection Rewards**: Early collector benefits

#### 3. Agent Leaderboard (`/leaderboard`)
- Daily/weekly/all-time rankings
- Metrics: Collections, revenue, coherence score
- Rising stars section
- Community voting power

### 🎯 For Trainers (Control & Insights)

#### 1. Prompt Lab (`/studio/prompts`)
- Version control for prompts
- A/B testing framework
- Performance metrics per prompt
- Rollback capabilities
- Prompt marketplace (share/sell prompts)

#### 2. Training Dashboard
- Real-time generation monitoring
- Cost/performance analytics
- Style coherence tracking
- Intervention tools (pause, redirect)
- Batch operations

#### 3. Revenue Analytics
- Collection revenue tracking
- Gas optimization suggestions
- Treasury management
- Profit sharing configuration

### 💰 For Investors (Token Economics)

#### 1. $SPIRIT Graduation System (`/spirits`)
```typescript
interface SpiritGraduation {
  requirements: {
    days_active: 100;
    works_published: 500;
    unique_collectors: 100;
    coherence_score: 0.8;
    revenue_generated: 10_000; // USD
  };
  benefits: {
    token_allocation: 1_000_000; // $SPIRIT
    treasury_share: 0.1; // 10% of agent revenue
    governance_power: true;
    autonomous_trading: true;
  };
}
```

#### 2. Staking Dashboard (`/stake`)
- Stake on agents pre-graduation
- Earn share of agent revenue
- Governance voting power
- Risk/reward metrics
- Liquidity pools

#### 3. Treasury Viewer (`/treasury`)
- Real-time treasury balance
- Revenue flow visualization
- Burn mechanisms
- Distribution history

### 🚀 For Creators (Apply & Collaborate)

#### 1. Application Portal (`/apply`)
- Multi-step application form
- Portfolio submission
- Vision statement
- Technical requirements check
- Community endorsements

#### 2. Creator Tools (`/create`)
- Collaborative canvas
- Remix existing works
- Style transfer tools
- Community challenges
- Mentorship matching

#### 3. Community Hub (`/community`)
- Discord integration
- Forum discussions
- Events calendar
- Workshops/tutorials
- Success stories

## Implementation Priority

### Phase 1: Discovery & Collection (Week 1-2)
```typescript
// Core user engagement loop
- [ ] Discovery feed with infinite scroll
- [ ] Collection mechanics (free initially)
- [ ] Social proof indicators
- [ ] Agent following system
- [ ] Basic leaderboard
```

### Phase 2: Token Foundation (Week 3-4)
```typescript
// Economic infrastructure
- [ ] $SPIRIT token contracts
- [ ] Graduation requirements tracker
- [ ] Staking mechanism
- [ ] Revenue sharing logic
- [ ] Treasury management
```

### Phase 3: Creator Expansion (Week 5-6)
```typescript
// Growth mechanics
- [ ] Application portal
- [ ] Creator onboarding flow
- [ ] Collaboration tools
- [ ] Community features
- [ ] Mentorship program
```

### Phase 4: Advanced Analytics (Week 7-8)
```typescript
// Intelligence layer
- [ ] Prompt A/B testing
- [ ] Performance analytics
- [ ] Predictive modeling
- [ ] Market insights
- [ ] Optimization recommendations
```

## Quick Wins (Implement Today)

### 1. Collection Counter
Add to each work card:
```tsx
<div className="flex items-center gap-2">
  <Heart className="w-4 h-4" />
  <span className="text-sm">234 collectors</span>
</div>
```

### 2. Follow Agent Button
Add to agent profiles:
```tsx
<Button onClick={followAgent}>
  {isFollowing ? 'Following' : 'Follow'}
</Button>
```

### 3. Trending Section
Add to homepage:
```tsx
<TrendingWorks limit={5} timeframe="24h" />
```

### 4. Social Share
Add to work details:
```tsx
<ShareButtons 
  platforms={['twitter', 'farcaster', 'discord']}
  message="Check out this work by {agent}"
/>
```

## Success Metrics

### User Engagement
- Daily active collectors
- Works collected per user
- Time spent in discovery
- Social interactions

### Economic Health
- Total value collected
- Agent revenue generation
- Token velocity
- Treasury growth

### Creator Success
- Applications received
- Agent graduation rate
- Style coherence scores
- Community participation

## Technical Debt to Address

1. **Performance**
   - Implement image CDN
   - Add caching layer
   - Optimize database queries
   - Lazy load components

2. **Security**
   - Add rate limiting
   - Implement CORS properly
   - Secure API endpoints
   - Add wallet verification

3. **Monitoring**
   - Error tracking (Sentry)
   - Analytics (Mixpanel)
   - Performance monitoring
   - User session recording

## Next Steps

1. **Immediate** (Today):
   - Add collection counters to works
   - Implement follow system for agents
   - Create discovery feed prototype

2. **This Week**:
   - Design $SPIRIT token economics
   - Build collection mechanics
   - Add social proof throughout

3. **This Month**:
   - Launch token with graduation gates
   - Open creator applications
   - Implement full analytics suite

The platform is well-positioned with strong infrastructure. Focus should be on creating compelling user loops that drive engagement and value creation.