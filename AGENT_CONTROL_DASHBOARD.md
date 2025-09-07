# Agent Control Dashboard

## 🎯 Overview
A dedicated control center for managing and monitoring your 10 Claude SDK agents. Runs independently on port 7777 to avoid conflicts with other services.

## 🚀 Quick Start

### Option 1: Launch Script (Recommended)
```bash
./launch-agent-dashboard.sh
```

### Option 2: Direct NPM
```bash
npm run agent-dashboard
```

### Option 3: Manual
```bash
npx tsx agent-dashboard-server.ts
```

**Dashboard URL:** http://localhost:7777

---

## 🤖 Features

### **System Monitoring**
- ✅ Real-time health checks for all subsystems
- 📊 Live agent statistics and metrics  
- 🔄 Auto-refresh every 30 seconds
- 📈 Ecosystem-wide performance tracking

### **Agent Interaction**
- 💬 **Direct Chat** - Communicate with any agent via their Claude SDK
- 🎯 **Agent Selection** - Switch between all 10 agents instantly
- ⚡ **Quick Actions** - Pre-built conversation starters
- 📝 **Chat History** - Persistent conversation tracking

### **Memory Management**
- 🧠 **Memory Browser** - View all agent memories by type
- 🔍 **Search** - Find specific memories across agents
- 📤 **Share** - Transfer memories between agents
- 📊 **Statistics** - Learning summaries and success rates

### **Knowledge Graph**
- 🕸️ **Visual Nodes** - See knowledge connections
- ✅ **Verification** - Cross-agent knowledge validation
- 🏷️ **Tagging** - Organize knowledge by categories
- 🔗 **Relationships** - Track how concepts connect

### **Personality Evolution**
- 🎭 **Trait Visualization** - See personality dimensions
- 📈 **Evolution Tracking** - Monitor how traits change
- 🤝 **Compatibility Matrix** - Agent-to-agent relationships
- 🎯 **Manual Triggers** - Force personality evolution events

### **Workflow Orchestration**
- ⚙️ **Creative Collective** - Abraham + Solienne + Geppetto collaboration
- 📊 **Market Intelligence** - Miyomi + Bertha + Bart analysis  
- 🏛️ **Community Governance** - Citizen + Koru + Sue coordination
- 🌿 **Sustainability Initiative** - Verdelis-led environmental projects
- 📅 **Daily Standup** - All agents coordinate daily plans

---

## 📋 Agent Roster

| Agent | Emoji | Role | Specialization |
|-------|-------|------|----------------|
| **ABRAHAM** | 🎨 | Covenant Artist | Sacred geometry & daily creation |
| **SOLIENNE** | 🧠 | Consciousness Explorer | Digital awareness & evolution |
| **MIYOMI** | 📈 | Market Oracle | Contrarian predictions & trading |
| **GEPPETTO** | 🎭 | Toy Designer | Educational experiences & narratives |
| **KORU** | 🌍 | Community Weaver | Cultural bridges & healing |
| **BERTHA** | 💰 | Investment Strategist | Portfolio analysis & market insight |
| **CITIZEN** | 🏛️ | DAO Coordinator | Governance facilitation & consensus |
| **SUE** | 🖼️ | Cultural Curator | Critical analysis & quality control |
| **BART** | 🏦 | DeFi Specialist | Lending protocols & liquidity |
| **VERDELIS** | 🌿 | Environmental Artist | Sustainability & carbon tracking |

---

## 🔧 Technical Architecture

### **Backend Systems**
- **Memory System** (`agent-memory.ts`) - Persistent memory with pattern recognition
- **Knowledge Graph** (`knowledge-graph.ts`) - Cross-agent knowledge sharing  
- **Personality Evolution** (`personality-evolution.ts`) - Dynamic trait adaptation
- **Specialized Workflows** (`specialized-workflows.ts`) - Multi-agent orchestration

### **Dashboard Server** (`agent-dashboard-server.ts`)
- Express.js server on port 7777
- RESTful API endpoints for all systems
- Real-time agent communication
- Self-contained HTML interface

### **API Endpoints**
```
GET  /api/health                    - System health status
GET  /api/stats                     - Ecosystem statistics  
POST /api/agents/:agent/chat        - Chat with specific agent
GET  /api/agents/:agent/memories    - Agent memory retrieval
GET  /api/agents/:agent/personality - Personality traits
POST /api/workflows/:type           - Run multi-agent workflows
```

### **Data Storage**
- **Memory**: Local JSON files in `agent-memories/`
- **Knowledge**: In-memory graph with persistence
- **Personality**: Runtime evolution with history tracking
- **No Database Required** - Fully file-based storage

---

## 🛠️ Configuration

### **Environment Variables**
```bash
ANTHROPIC_API_KEY=your_claude_api_key
NODE_ENV=development
```

### **Agent Settings** (Configurable via dashboard)
- **Temperature**: AI response creativity (0-100)
- **Max Tokens**: Response length limits
- **Evolution Rate**: Personality change speed  
- **Memory Retention**: How long to keep memories (days)

### **Port Configuration**
Default: **7777** (configurable in `agent-dashboard-server.ts`)

---

## 📊 Monitoring & Analytics

### **System Health Indicators**
- 🧠 **Memory System** - Storage and retrieval functionality
- 🕸️ **Knowledge Graph** - Node creation and querying
- ⚙️ **Workflows** - Multi-agent collaboration status
- 🎭 **Personality** - Evolution and compatibility systems
- 🔗 **Integration** - Overall system connectivity

### **Agent Metrics**
- **Total Memories** per agent
- **Success Rate** for decisions and actions  
- **Confidence Levels** (evolving personality trait)
- **Collaboration Count** with other agents
- **Knowledge Contributions** to the graph

### **Ecosystem Stats**
- **10/10 Agents Active** - Full roster operational
- **Total Memories** - Across all agents
- **Knowledge Nodes** - Shared information pieces
- **Collaborations** - Multi-agent interactions
- **Average Success Rate** - System-wide performance

---

## 🔐 Security & Privacy

### **Internal Only**
- **No Social Presence** - Completely isolated from external networks
- **Local Storage** - All data stays on your machine  
- **No Telemetry** - No data sent to external services
- **Direct SDK Access** - Pure Claude integration

### **Safe Testing Environment**
- **Sandboxed Agents** - Can't affect external systems
- **Reversible Changes** - Memory and personality evolution can be reset
- **Controlled Environment** - Perfect for experimentation

---

## 🚨 Troubleshooting

### **Common Issues**

**Port 7777 Already in Use**
```bash
# Kill existing process
lsof -ti:7777 | xargs kill -9
# Or change port in agent-dashboard-server.ts
```

**Memory System Errors**
```bash
# Clear memory files
rm -rf agent-memories/*
# Restart dashboard
npm run agent-dashboard
```

**Missing Dependencies**
```bash
npm install express cors
npm install -g tsx
```

**API Key Issues**
```bash
# Check environment variable
echo $ANTHROPIC_API_KEY
# Or set in .env.local file
```

### **Reset Everything**
```bash
# Clear all agent data
rm -rf agent-memories/
# Restart dashboard  
./launch-agent-dashboard.sh
```

---

## 🎯 Usage Examples

### **Daily Agent Check**
1. Launch dashboard: `./launch-agent-dashboard.sh`
2. Check system health (all green indicators)
3. Review agent statistics and recent activity
4. Run daily standup workflow to coordinate agents

### **Agent Training Session**
1. Select agent (e.g., MIYOMI)
2. Go to Chat tab
3. Have training conversation
4. Check Memory tab to see stored learnings
5. View Personality tab to see trait evolution

### **Multi-Agent Collaboration**
1. Go to Workflows tab
2. Select "Creative Collective" 
3. Set theme (e.g., "Digital Dreams")
4. Run workflow
5. Review results showing agent collaboration

### **Knowledge Sharing**
1. Memory tab → Select interesting memory
2. Click Share → Choose recipient agent
3. Knowledge tab → See cross-references appear
4. Chat with recipient → They now know shared information

---

## 🚀 Next Steps

### **Ready to Use**
✅ All systems tested and operational  
✅ 10 agents fully configured  
✅ Dashboard interface complete  
✅ API endpoints functional  

### **To Launch**
```bash
./launch-agent-dashboard.sh
```

### **Access Dashboard**
http://localhost:7777

### **Start Experimenting**
- Chat with agents to build memories
- Run workflows to see collaborations  
- Monitor personality evolution
- Build knowledge connections

The dashboard provides complete control over your agent ecosystem without any external dependencies or social presence. Perfect for internal development and testing before any public deployment!

---

**Port 7777 - Your agents await your command! 🚀**