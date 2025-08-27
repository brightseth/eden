# CITIZEN Training Guide for Henry

## Quick Start

CITIZEN is now ready to receive training updates from you! The system automatically syncs with app.eden.art to keep the profile updated.

## Training Endpoints

### Submit Training
**POST** `https://eden-academy-flame.vercel.app/api/agents/citizen/training`

```json
{
  "trainer": "Henry",
  "trainerEmail": "henry@brightmoments.io",
  "trainingType": "lore_update",  // or "governance_update", "community_insight", "general"
  "content": "Your training content here"
}
```

### Check Training Status
**GET** `https://eden-academy-flame.vercel.app/api/agents/citizen/training`

Returns current CITIZEN capabilities and knowledge areas.

## Training Types

### 1. Lore Update (`lore_update`)
For cultural heritage, ritual documentation, city histories:
- Venice Beach origins and significance
- IRL minting ritual updates
- City-specific collection stories
- Milestone celebrations

Example:
```json
{
  "trainer": "Henry",
  "trainingType": "lore_update",
  "content": "The Berlin minting at Kraftwerk wasn't just an event - it was a techno symphony where each of the 100 Berliners minted per night contributed to a collective generative soundscape."
}
```

### 2. Governance Update (`governance_update`)
For DAO mechanics, voting procedures, treasury:
- Snapshot proposal updates
- Bright Opportunities sub-DAO changes
- Voting procedures and thresholds
- Treasury management decisions

Example:
```json
{
  "trainer": "Henry",
  "trainingType": "governance_update",
  "content": "New Snapshot proposal BM-042: Establishing a permanent artist residency program funded by 2% of treasury yields."
}
```

### 3. Community Insight (`community_insight`)
For collector recognition and engagement:
- Full Set or Ultra Set holder updates
- Recognition protocol changes
- Community engagement strategies
- Concierge service protocols

Example:
```json
{
  "trainer": "Henry",
  "trainingType": "community_insight",
  "content": "Two new Ultra Full Set holders confirmed this week. Both should receive immediate concierge-level recognition and direct outreach from leadership."
}
```

### 4. General Update (`general`)
For announcements, partnerships, events:
- Platform updates
- Partnership announcements
- Community events
- Technology changes

## Synchronization

### Check Sync Status
**GET** `https://eden-academy-flame.vercel.app/api/agents/citizen/sync`

### Force Sync
**POST** `https://eden-academy-flame.vercel.app/api/agents/citizen/sync`
```json
{
  "force": true
}
```

## Automatic Features

1. **Claude Processing**: All training input is intelligently processed by Claude to extract structured knowledge
2. **Registry Updates**: Training automatically updates Eden Registry profile
3. **app.eden.art Sync**: Profile changes sync to app.eden.art (when API key configured)
4. **5-Minute Auto-Sync**: Profiles sync automatically every 5 minutes

## Response Format

After successful training submission:
```json
{
  "success": true,
  "trainingRecord": {
    "id": "citizen-training-[timestamp]",
    "type": "lore_update",
    "trainer": "Henry",
    "processed_at": "2025-08-27T...",
    "updates_applied": true,
    "registry_submitted": true,
    "sync_triggered": true
  }
}
```

## Best Practices

1. **Be Specific**: Include dates, names, and specific details in training content
2. **Use Appropriate Type**: Select the right training type for better processing
3. **Include Context**: Provide background for complex updates
4. **Regular Updates**: Small, frequent updates work better than large batches

## Current CITIZEN Knowledge

CITIZEN currently has comprehensive knowledge of:
- All 10 CryptoCitizen collections (Venice Beach → Venice Italy)
- Golden Token mechanics and IRL minting rituals
- Full Set (10 cities) and Ultra Full Set (40 curated) recognition
- Bright Moments DAO governance with Snapshot
- Sacred language protocols (ceremony, rite, citizenship, presence)
- Community hierarchy and concierge services

## Support

For technical issues or questions about the training system, the endpoints are:
- Training API: `/api/agents/citizen/training`
- Sync API: `/api/agents/citizen/sync`
- Main Identity: `/api/agents/citizen`

All systems are production-ready and monitoring is active!