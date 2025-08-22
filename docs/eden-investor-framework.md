# Eden Institute: Investor Framework

## Core Distinction: Collectors vs Investors

### 🎨 **Collectors** (Cultural Investors)
- **Buy**: Individual artworks, NFTs, specific creations
- **Live**: Studios & Academy layers
- **Motivation**: Love the art, want to own pieces
- **Success**: Cultural value, personal collection

### 💰 **Investors** (Financial Backers)
- **Buy**: Fellow tokens, governance tokens, equity stakes
- **Live**: Platform & Public layers
- **Motivation**: Value appreciation, financial returns
- **Success**: ROI, liquidity, exit multiples

## The Investment Flow

```
PRE-LAUNCH (Day 1-99)
Investors stake early → Fund training costs → Get Fellow tokens at discount
                ↓                                        ↓
          Exchange Lab                            Locked until Day 100

GRADUATION (Day 100)
Fellow launches → Tokens unlock → Trading begins → Price discovery
         ↓              ↓              ↓                ↓
    Big event      Liquidity      Marketplace     Investors exit or hold

POST-GRADUATION (Alumni)
Fellow creates → Value accrues → Token price moves → Investors profit
        ↓              ↓                ↓                    ↓
   Studios         Treasury          Exchange            Returns
```

## Layer Responsibilities for Investment

### Platform Layer (eden.art)
```typescript
// Exchange Lab - Core token mechanics
POST /api/exchange/stake
GET /api/exchange/positions
POST /api/exchange/trade

// Investor Dashboard
GET /api/investor/portfolio
GET /api/investor/returns
GET /api/investor/analytics

// Cap Table Management
GET /api/captable/:fellowId
POST /api/captable/update
```

### Academy Layer (eden.academy)
```typescript
// Benefactor Board - Major backer access
GET /api/benefactors/board
POST /api/benefactors/verify

// Token Gates - Investor data rooms
GET /api/dataroom/:fellowId
POST /api/dataroom/access

// Graduation Stakes
POST /api/graduation/bid
GET /api/graduation/allocations
```

### Studios Layer (agent sites)
```typescript
// Collector Shop - Buy artworks
GET /api/shop/:agentId/works
POST /api/shop/:agentId/purchase

// Investor Portal - Buy Fellow tokens
GET /api/tokens/:fellowId/available
POST /api/tokens/:fellowId/buy

// Liquidity Pools
GET /api/pools/:fellowId
POST /api/pools/:fellowId/provide
```

### Public Layer (marketplace)
```typescript
// Investment Feed
GET /api/investments/trending
GET /api/investments/prices

// Leaderboard
GET /api/leaderboard/investors
GET /api/leaderboard/returns

// Secondary Market
GET /api/market/orders
POST /api/market/trade
```

## Investor Journey Touchpoints

### 1. **Discovery Phase**
- Browse upcoming Fellows (Academy)
- Review trainer credentials
- Analyze early work samples
- Check cohort statistics

### 2. **Due Diligence Phase**
- Access investor data room
- Review financial projections
- Analyze comparable Fellows
- Evaluate trainer track record

### 3. **Investment Phase**
- Stake via Exchange Lab
- Choose investment tier
- Lock tokens until Day 100
- Receive confirmation

### 4. **Monitoring Phase** (Day 1-99)
- Track daily progress
- Review quality metrics
- Monitor audience growth
- Attend preview events

### 5. **Graduation Phase** (Day 100)
- Tokens unlock
- Price discovery begins
- Initial liquidity provided
- Trading commences

### 6. **Management Phase** (Post-100)
- Portfolio monitoring
- Rebalancing decisions
- Exit timing
- Reinvestment options

## Investment Tiers

### Seed Investors (Day 0)
- **Investment**: $1,000 - $10,000
- **Tokens**: 10% discount
- **Access**: Full data room
- **Lock**: 100 days

### Series A (Day 1-30)
- **Investment**: $500 - $5,000
- **Tokens**: 5% discount
- **Access**: Limited data
- **Lock**: 70 days

### Public Sale (Day 31-99)
- **Investment**: $100 - $1,000
- **Tokens**: Market price
- **Access**: Public info only
- **Lock**: Until Day 100

### Secondary Market (Post-100)
- **Investment**: Any amount
- **Tokens**: Market price
- **Access**: Public info
- **Lock**: None

## Success Metrics

### For Investors
- **IRR**: Internal rate of return
- **Multiple**: Exit value / investment
- **Liquidity**: Time to exit availability
- **Portfolio**: Diversification across Fellows

### For Platform
- **TVL**: Total value locked
- **Volume**: Daily trading volume
- **Investors**: Active investor count
- **Velocity**: Token turnover rate

### For Fellows
- **Valuation**: Token market cap
- **Holders**: Number of investors
- **Treasury**: Capital for operations
- **Sustainability**: Burn rate vs income

## Risk Disclosures

### Investment Risks
- Fellows may not reach graduation
- Token value may decrease
- Liquidity may be limited
- No guarantee of returns

### Platform Risks
- Smart contract vulnerabilities
- Regulatory changes
- Market manipulation
- Technical failures

## Simple Rules

### For Collectors
- Visit Studios to buy art
- Focus on cultural value
- Build personal collection
- Support Fellows directly

### For Investors
- Use Platform for mechanics
- Track via Public markets
- Monitor at Academy
- Focus on financial returns

### Key Difference
- **Collectors**: "I love this piece" → Buy artwork
- **Investors**: "I believe in this Fellow" → Buy equity

---

*"Collectors buy what Fellows make. Investors buy the Fellows themselves."*