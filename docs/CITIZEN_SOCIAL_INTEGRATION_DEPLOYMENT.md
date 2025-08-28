# CITIZEN Social Platform Integration - Deployment Guide

**Date**: 2025-08-28  
**Version**: 1.0  
**Status**: Ready for Community Credentials  

## 🎯 Overview

CITIZEN's social platform integration enables authentic, community-first engagement across Farcaster, Discord, Twitter, Instagram, and Telegram. This system prioritizes **listening first**, **authentic reconnection**, and **value-driven content** over promotional broadcasting.

## 🗝️ Core Philosophy

### Community-First Principles
1. **Listen First** - Understand community sentiment before engaging
2. **Acknowledge Gaps** - Be honest about communication absence  
3. **Value Over Volume** - Quality insights over frequent posts
4. **Progressive Trust** - Start small, build credibility, expand gradually
5. **Community-Led** - Amplify existing conversations, don't dominate

### Re-engagement Strategy
- **Phase 1: Listening (7 days)** - Monitor, analyze, understand current state
- **Phase 2: Acknowledgment (3 days)** - Honest updates, personal reconnection
- **Phase 3: Value Sharing (14 days)** - Educational content, community spotlights
- **Phase 4: Governance Introduction (ongoing)** - Gradual DAO education and participation

## 📋 Prerequisites

### Required Environment Variables

```bash
# Social Integration Feature Flags
ENABLE_CITIZEN_SOCIAL_INTEGRATION=true
ENABLE_CITIZEN_SNAPSHOT_GOVERNANCE=true

# Farcaster Integration
FARCASTER_API_KEY=your_neynar_api_key
FARCASTER_SIGNER_UUID=your_farcaster_signer_uuid

# Discord Integration  
DISCORD_BOT_TOKEN=your_discord_bot_token
DISCORD_GUILD_ID=your_discord_guild_id
DISCORD_GOVERNANCE_CHANNEL_ID=your_governance_channel_id

# Twitter/X Integration
TWITTER_BEARER_TOKEN=your_twitter_bearer_token
TWITTER_API_KEY=your_twitter_api_key
TWITTER_API_SECRET=your_twitter_api_secret
TWITTER_ACCESS_TOKEN=your_twitter_access_token
TWITTER_ACCESS_TOKEN_SECRET=your_twitter_access_token_secret

# Core CITIZEN Configuration (already configured)
ANTHROPIC_API_KEY=your_anthropic_api_key
GOVERNANCE_NETWORK_ID=1
```

### Platform Access Requirements
- **Farcaster**: Neynar API key + Signer UUID for casting
- **Discord**: Bot token with message/embed permissions in target guild
- **Twitter**: Developer account with v2 API access + OAuth 1.0a tokens
- **BrightMoments**: Credentials for community channels
- **CryptoCitizens**: Access to relevant community spaces

## 🚀 Quick Start

### 1. Test Current Integration Status

```bash
# Check social integration status
curl http://localhost:3000/api/agents/citizen/social

# Test platform connections
curl -X POST http://localhost:3000/api/agents/citizen/social \
  -H "Content-Type: application/json" \
  -d '{"action": "test_connections"}'
```

### 2. Set Up Platform Credentials

```bash
# Add real credentials to .env.local (replacing placeholder values)
# Test each platform connection individually
curl -X POST http://localhost:3000/api/agents/citizen/social \
  -H "Content-Type: application/json" \
  -d '{"action": "test_connections"}'
```

### 3. Start Community Analysis

```bash
# Begin listening phase - analyze community sentiment
curl -X POST http://localhost:3000/api/agents/citizen/social \
  -H "Content-Type: application/json" \
  -d '{"action": "analyze_community"}'
```

### 4. Launch Re-engagement Campaign

```bash
# Start the 30-day community re-engagement program
curl -X POST http://localhost:3000/api/agents/citizen/social \
  -H "Content-Type: application/json" \
  -d '{"action": "start_re_engagement", "community": "brightmoments", "duration": 30}'
```

## 🛠️ Platform-Specific Setup

### Farcaster (via Neynar)

1. **Get Neynar API Key**
   - Sign up at https://neynar.com
   - Generate API key for production use

2. **Create Signer**
   - Use Neynar dashboard to create a signer
   - Add signer UUID to environment variables

3. **Verify Channels**
   - Ensure access to `brightmoments` channel
   - Test casting permissions

```typescript
// Test Farcaster connection
const farcasterConnector = new FarcasterConnector({
  apiKey: process.env.FARCASTER_API_KEY!,
  signerUuid: process.env.FARCASTER_SIGNER_UUID!,
  baseUrl: 'https://api.neynar.com/v2'
});

const connected = await farcasterConnector.testConnection();
```

### Discord

1. **Create Bot Application**
   - Go to https://discord.com/developers/applications
   - Create new application → Bot → Get token

2. **Set Permissions**
   - Send Messages
   - Embed Links
   - Add Reactions
   - Read Message History

3. **Add to Guild**
   - Use OAuth2 URL generator with correct permissions
   - Add bot to BrightMoments Discord server

```typescript
// Test Discord connection
const discordConnector = new DiscordConnector({
  botToken: process.env.DISCORD_BOT_TOKEN!,
  guildId: process.env.DISCORD_GUILD_ID!,
  governanceChannelId: process.env.DISCORD_GOVERNANCE_CHANNEL_ID
});

const connected = await discordConnector.testConnection();
```

### Twitter/X

1. **Developer Account**
   - Apply for Twitter Developer Account
   - Create project with v2 API access

2. **OAuth 1.0a Setup**
   - Generate API Key/Secret
   - Generate Access Token/Secret for posting

3. **Rate Limiting**
   - Respect 300 tweets per 3-hour window
   - Monitor API usage quotas

```typescript
// Test Twitter connection
const twitterConnector = new TwitterConnector({
  bearerToken: process.env.TWITTER_BEARER_TOKEN!,
  apiKey: process.env.TWITTER_API_KEY!,
  apiSecretKey: process.env.TWITTER_API_SECRET!,
  accessToken: process.env.TWITTER_ACCESS_TOKEN!,
  accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET!
});

const connected = await twitterConnector.testConnection();
```

## 📊 Daily Practice Programs

### 1. Governance Insights Daily
- **Frequency**: Daily
- **Platforms**: Farcaster, Twitter  
- **Content**: DAO governance trends, best practices, market analysis
- **Tone**: Educational, analytical

### 2. Community Spotlights  
- **Frequency**: Weekly
- **Platforms**: Instagram, Farcaster, Discord
- **Content**: Member achievements, collection highlights, cultural contributions
- **Tone**: Inspirational, celebratory

### 3. Market & Governance Analysis
- **Frequency**: Weekly  
- **Platforms**: Twitter, Telegram
- **Content**: Deep market analysis affecting DAO governance
- **Tone**: Analytical, data-driven

### 4. Proposal Discussions
- **Frequency**: As needed
- **Platforms**: Discord, Telegram, Farcaster
- **Content**: Active proposal coordination and education
- **Tone**: Conversational, facilitative

## 🧪 Testing Workflow

### 1. Connection Testing

```bash
# Test all platform connections
curl -X POST http://localhost:3000/api/agents/citizen/social \
  -H "Content-Type: application/json" \
  -d '{"action": "test_connections"}'

# Expected response: successful connections for configured platforms
```

### 2. Content Generation Testing

```bash
# Generate sample content
curl -X POST http://localhost:3000/api/agents/citizen/social \
  -H "Content-Type: application/json" \
  -d '{
    "action": "generate_content",
    "type": "governance_insight",
    "topic": "DAO Participation",
    "platform": "farcaster",
    "tone": "educational"
  }'
```

### 3. Community Analysis Testing

```bash
# Analyze community health
curl -X POST http://localhost:3000/api/agents/citizen/social \
  -H "Content-Type: application/json" \
  -d '{"action": "analyze_community"}'

# Check insights
curl http://localhost:3000/api/agents/citizen/social?insights=true
```

### 4. Daily Practice Execution

```bash
# Execute daily practice routine
curl -X POST http://localhost:3000/api/agents/citizen/social \
  -H "Content-Type: application/json" \
  -d '{"action": "execute_daily_practice"}'
```

## 📈 Monitoring & Metrics

### Key Performance Indicators

1. **Community Sentiment Score** (-1 to 1)
   - Target: > 0.5 across all platforms
   - Measured: Daily via sentiment analysis

2. **Engagement Rate** (0 to 1)
   - Target: > 0.15 average across platforms
   - Measured: Likes, comments, reactions per post

3. **Governance Readiness Score** (0 to 1)  
   - Target: > 0.7 for proposal introduction
   - Measured: Community response to governance content

4. **Trust Score** (0 to 1)
   - Target: > 0.8 before major governance actions
   - Measured: Community response patterns and feedback

### Monitoring Endpoints

```bash
# Get community insights with metrics
GET /api/agents/citizen/social?insights=true&metrics=true

# Check social integration status
GET /api/agents/citizen/social

# Analyze specific platform
POST /api/agents/citizen/social
{"action": "analyze_community"}
```

## 🚨 Safety & Moderation

### Content Approval Workflow
- **Phase 1-2**: All content requires human approval
- **Phase 3**: Educational content auto-approved, governance content requires approval
- **Phase 4**: Established routine auto-approved, new governance requires approval

### Rate Limiting & Respect
- **Farcaster**: Max 10 casts/day, respect community guidelines
- **Discord**: Max 5 messages/day in governance channels
- **Twitter**: Max 5 tweets/day, no more than 1 thread/week
- **All Platforms**: No posting during quiet hours (11PM - 7AM ET)

### Community Feedback Integration
- Monitor reaction patterns for negative feedback
- Automatic pause if sentiment drops below 0.2
- Human review required for any community pushback
- Graceful exit strategy if re-engagement fails

## 🔄 Rollback Procedures

### Immediate Pause
```bash
# Disable social integration immediately
export ENABLE_CITIZEN_SOCIAL_INTEGRATION=false

# Or via API
curl -X POST http://localhost:3000/api/agents/citizen/social \
  -H "Content-Type: application/json" \
  -d '{"action": "pause_all_activity"}'
```

### Progressive Rollback
1. **Level 1**: Pause new content, continue monitoring
2. **Level 2**: Pause all posting, maintain listening
3. **Level 3**: Complete social integration shutdown
4. **Level 4**: Return to governance-only mode

### Recovery Procedures
- Community sentiment recovery plan
- Trust rebuilding content schedule  
- Gradual re-engagement protocol
- Lessons learned integration

## ✅ Deployment Checklist

### Pre-Deployment
- [ ] **Platform Credentials Configured**
  - [ ] Farcaster API key and signer UUID
  - [ ] Discord bot token and channel permissions
  - [ ] Twitter developer account and OAuth tokens
  - [ ] BrightMoments community access confirmed
  - [ ] CryptoCitizens community access confirmed

- [ ] **Feature Flags Set**
  - [ ] `ENABLE_CITIZEN_SOCIAL_INTEGRATION=true`
  - [ ] `ENABLE_CITIZEN_SNAPSHOT_GOVERNANCE=true` 
  - [ ] Core CITIZEN governance verified working

- [ ] **API Endpoints Tested**
  - [ ] `/api/agents/citizen/social` GET works
  - [ ] Platform connection testing successful
  - [ ] Content generation working
  - [ ] Community analysis functional

### Post-Deployment
- [ ] **Community Analysis Started**
  - [ ] Listening phase activated
  - [ ] Baseline metrics captured
  - [ ] Community readiness assessed

- [ ] **Content Schedule Initialized**
  - [ ] 30-day re-engagement program loaded
  - [ ] Daily practice routines configured
  - [ ] Approval workflows established

- [ ] **Monitoring Active**
  - [ ] Sentiment tracking enabled
  - [ ] Engagement metrics collection
  - [ ] Alert thresholds configured

### Success Criteria
- [ ] **Week 1**: Community analysis complete, sentiment baseline established
- [ ] **Week 2**: Acknowledgment content well-received, engagement improving
- [ ] **Week 3**: Educational content gaining traction, trust building
- [ ] **Week 4**: Governance introduction accepted, participation increasing

## 🎯 Expected Outcomes

### Short Term (2-4 weeks)
- Successful reconnection with BrightMoments and CryptoCitizens communities
- Improved sentiment scores across platforms (target: >0.3)
- Established daily practice routine generating consistent value
- Community comfort with CITIZEN as governance facilitator

### Medium Term (1-3 months)  
- Active cross-platform governance coordination
- Community-initiated governance discussions
- Successful Snapshot proposal coordination
- Trust score >0.8, enabling autonomous content approval

### Long Term (3-6 months)
- CITIZEN recognized as valuable governance infrastructure
- Community self-organizing around governance proposals
- Cross-DAO collaboration facilitation
- Model for other communities to follow

## 📚 Additional Resources

- **ADR-026**: [CITIZEN Snapshot DAO Integration](../adr/026-citizen-snapshot-dao-integration.md)
- **Governance API**: [CITIZEN Governance Endpoints](../CITIZEN_SNAPSHOT_TESTNET_DEPLOYMENT.md)  
- **Social Platform APIs**: 
  - [Neynar Farcaster API](https://docs.neynar.com/)
  - [Discord Bot API](https://discord.com/developers/docs/intro)
  - [Twitter API v2](https://developer.twitter.com/en/docs/twitter-api)

---

**⚠️ Important**: This integration prioritizes authentic community relationship building over promotional content. Success is measured by community trust and engagement quality, not posting volume or follower growth.

The goal is to make CITIZEN a valuable governance coordination tool that communities actually want to use, not another bot spamming channels with automated content.