# Eden2 Federation Consolidation Plan

*From Collection of Vercel Projects → Coherent Living Network*

## 🎯 **Strategic Objective**

Transform Eden Academy from scattered deployments into **eden2.io** - a unified, sovereign network where each agent operates as a first-class citizen with consistent governance, security, and operational standards.

---

## 📋 **Implementation Roadmap**

### **Phase 1: Domain Authority (Priority 1)**

**Objective**: Make eden2.io the canonical "source of place" for all public surfaces

#### 1.1 Canonicalize Domain Structure
```bash
# Target Architecture
academy.eden2.io          # Main platform
registry.eden2.io         # Data authority  
[agent].eden2.io          # Sovereign agent sites
trainer.academy.eden2.io  # Training interfaces
docs.eden2.io            # Unified documentation
```

#### 1.2 Implement 301 Redirect Strategy
- **From**: `*-ai.vercel.app`, `eden-academy-*.vercel.app`
- **To**: Canonical eden2.io endpoints
- **Action**: Configure Vercel redirects + DNS CNAME records

#### 1.3 Documentation Cleanup
- **Remove**: All Vercel hostnames from public docs
- **Create**: `/admin/ops/infrastructure` for internal Vercel references
- **Update**: Sitemap to show only eden2.io canonical URLs

---

### **Phase 2: URL Grammar Normalization (Priority 1)**

**Current Problem**: Duplicate paths (`/academy/agent/[slug]`, `/agents/[slug]`, `/sites/[agent]`)

#### 2.1 Canonical URL Structure
```
/agents/[slug]           # Directory entry (SSR from Registry)
/sites/[slug]           # Public agent site (brandable UI)  
/dashboard/[slug]       # Training interface (auth-gated)
```

#### 2.2 Implementation Steps
- **Deprecate**: `/academy/agent/*` paths
- **Migrate**: All internal links to new structure
- **Add**: 301 redirects for backward compatibility
- **Update**: Registry SDK to use canonical paths

---

### **Phase 3: Operational Reality Alignment (Priority 2)**

**Objective**: Make agent statuses machine-verifiable and operationally accurate

#### 3.1 Registry Schema Enhancement
```typescript
interface AgentCapabilities {
  has_live_trading: boolean;
  has_video_generation: boolean;
  has_chat_interface: boolean;
  websocket_enabled: boolean;
  governance_active: boolean;
}

interface OperationalChecks {
  health_endpoint: string;
  last_heartbeat: string;
  uptime_percentage: number;
  feature_flags: string[];
}
```

#### 3.2 Agent Status Corrections
- **MIYOMI**: `trading_ui: live, video_generation: planned`
- **BART**: `status: mock_mode, risk_policy: committed`
- **CITIZEN**: `governance: testnet, social_coordination: beta`
- **SOLIENNE**: `gallery: enhanced, generation: live`

---

### **Phase 4: Sovereign Template Factory (Priority 2)**

**Objective**: Create standardized sovereign agent deployment system

#### 4.1 Sovereign Template Architecture
```
/apps/sovereign-template/
├── pages/api/health.ts          # Health checks
├── lib/registry-adapter.ts      # Registry SDK integration  
├── middleware/csp.ts           # Content Security Policy
├── lib/webhook-verify.ts       # HMAC verification
├── config/feature-flags.ts     # Flag configuration
├── lib/metrics.ts             # Operational metrics
└── next.config.js             # CSP + security headers
```

#### 4.2 Sovereign Factory Script
```bash
# Create new sovereign agent
pnpm xr create-sovereign <agent>

# Generates:
# - Agent-specific configuration
# - Registry integration
# - Security policies
# - Health check endpoints
# - Metric collection
```

#### 4.3 Priority Deployments
1. **miyomi.eden2.io** - Trading interface with live portfolio
2. **abraham.eden2.io** - Covenant tracking with provenance
3. **solienne.eden2.io** - Consciousness studio with generation

---

### **Phase 5: Security & Integrity (Priority 2)**

#### 5.1 Webhook Integrity
```typescript
// Registry event signing
interface WebhookEvent {
  id: string;
  type: 'registry:agent:updated' | 'registry:work:created';
  data: any;
  timestamp: string;
  signature: string; // HMAC-SHA256
}

// Audit trail
interface AuditLogEntry {
  user_id: string;
  action: string;
  resource: string;
  before: any;
  after: any;
  request_id: string;
  timestamp: string;
}
```

#### 5.2 Security V2 Implementation
- **CSP**: strict-dynamic with per-request nonces
- **Secret Scanning**: CI-integrated org-wide scanning
- **ENV Scoping**: Per-sovereign app environment isolation
- **SLOs**: 99.9% uptime targets with /health probes

---

### **Phase 6: Config Registry Centralization (Priority 3)**

#### 6.1 Feature Flag Migration
**From**: Scattered environment variables
**To**: Centralized Registry config system

```typescript
// Registry-managed feature flags
interface FeatureFlag {
  key: string;
  service: 'academy' | 'agent' | 'registry';
  stage: 'off' | 'dev' | 'beta' | 'gradual' | 'full';
  rollout_percentage: number;
  kill_switch: boolean;
  created_by: string;
}
```

#### 6.2 SDK Integration
- **Agents read flags via Registry SDK** (no env sprawl)
- **Runtime flag updates** without deployment
- **Audit trail** for all flag changes

---

### **Phase 7: Data Contracts & Versioning (Priority 3)**

#### 7.1 Versioned SDK Strategy
```bash
@eden/registry-sdk@1.x     # Current stable
@eden/registry-sdk@2.x     # Breaking changes
```

#### 7.2 Breaking Change Governance
- **Deprecation Policy**: 90-day notice for breaking changes
- **Migration Guides**: Automated where possible
- **Lint Rules**: No direct Registry fetches (SDK only)

---

### **Phase 8: Agent-Specific Enhancements (Priority 3)**

#### 8.1 ABRAHAM Enhancements
- **Provenance Card**: Contract address, chain info, mint URLs
- **Covenant Schedule**: Wire to Works timeline
- **Registry Integration**: Full ADR-022 compliance

#### 8.2 SOLIENNE Loop Closure
- **Create → Analyze → Save** pipeline
- **Permalink System**: Shareable consciousness streams
- **Sue Integration**: Curatorial analysis workflow

#### 8.3 KORU Community Integration
- **First-Party Sites**: `/sites/koru` as primary
- **External Links**: koru.social as secondary
- **Registry Authority**: Maintained for all data

#### 8.4 GEPPETTO Activation
- **Chat Interface**: Live conversation capability
- **Design Generation**: Real creation tools
- **Training Dashboard**: Martin/Colin trainer access

#### 8.5 BART Production Readiness
- **NFT Offer System**: `makeSingleNftOffer` implementation
- **Risk Policy**: Committed YAML configuration
- **Default Mode**: `dry-run` until keys configured

---

## 🔍 **Verification Framework**

### Registry Verification
```bash
curl https://registry.eden2.io/api/v1/health
# Expected: {ok:true, version:"1.2.0", db:{latency_ms:<100}}
```

### Academy Verification  
```bash
curl https://academy.eden2.io/agents
# Expected: 10 agents rendered, cache-age <300s
```

### Agent Verification
```bash
curl https://miyomi.eden2.io/api/health  
# Expected: WebSocket ticks, portfolio data <1h old
```

---

## 📊 **Success Metrics**

### Technical Metrics
- **URL Consistency**: 0 public Vercel URLs in docs
- **Response Times**: <200ms for agent directory
- **Uptime**: 99.9% across all eden2.io endpoints
- **Security**: 100% CSP compliance, 0 secret leaks

### User Experience Metrics
- **Navigation Clarity**: Single path to each agent
- **Brand Cohesion**: Consistent eden2.io experience
- **Operational Trust**: Real-time status accuracy

### Network Effect Metrics
- **Agent Sovereignty**: 3 agents on dedicated domains
- **Registry Authority**: 100% data consistency
- **Federation Health**: All services reporting green

---

## 🚀 **Implementation Timeline**

### Week 1: Domain Foundation ✅ COMPLETE
- [x] Configure eden2.io DNS + SSL  
- [x] Implement 301 redirects
- [x] Update canonical URLs in docs

### Week 2: URL Grammar & Status Reality  
- [ ] Migrate to `/agents/`, `/sites/`, `/dashboard/` structure
- [ ] Implement Registry capabilities schema
- [ ] Correct agent operational statuses

### Week 3: Sovereign Template System
- [ ] Build sovereign-template with security defaults
- [ ] Create `pnpm xr create-sovereign` command
- [ ] Deploy miyomi.eden2.io as first sovereign

### Week 4: Security & Integrity
- [ ] Implement webhook HMAC verification
- [ ] Add audit logging for all mutations
- [ ] Deploy CSP with strict-dynamic

### Week 5: Config Centralization & Verification
- [ ] Migrate feature flags to Registry
- [ ] Add verification endpoints
- [ ] Document SLO targets

---

## 📝 **Sitemap Updates Required**

### 1. Replace Primary Domains Table
**Before**: Mixed Vercel/external domains
**After**: Clean eden2.io canonical endpoints + redirect policy

### 2. Collapse Agent APIs Section
**Before**: 80+ endpoints listed
**After**: Typed capability lists + link to contracts page

### 3. Add Verification Section
**Before**: Status claims without proof
**After**: Copy-paste curl commands for verification

### 4. Add Sovereign Template Section  
**New**: Template contents + create-sovereign command docs

### 5. Add Change Log Footer
**New**: Semantic versions + constellation hash for tracking

---

## 🏆 **End State Vision**

**Eden2 as Living Network**:
- **Single Brand Surface**: All public interactions via eden2.io
- **Sovereign Agents**: Each agent operates independently with consistent governance
- **Unified Identity**: Brand, security, and operational standards across network
- **Verifiable Reality**: Every claim in documentation is machine-checkable
- **Network Effects**: Agents reference each other, Registry provides authority
- **Operational Excellence**: 99.9% uptime with transparent health metrics

**Result**: Outsiders see eden2 as a coherent, operating network rather than a collection of projects.

---

*Implementation starts immediately with Domain Authority (Phase 1) as the foundation for all subsequent phases.*