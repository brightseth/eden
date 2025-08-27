# CITIZEN Collaboration Guide
## Multi-Trainer System for Henry & Keith

### 🤝 **Overview**
This system enables Henry and Keith to collaborate on training CITIZEN from different machines with real-time synchronization and review workflows.

---

## 🔑 **Authentication & Access**

### **Authorized Trainers**
- **Henry** - Lead Trainer (Primary Access)
- **Keith** - BM Team Trainer (Primary Access) 
- **Seth** - System Admin (Administrative Access)

### **Authentication Methods**
- Username: `henry`, `keith`, or `seth`
- Email: `henry@brightmoments.io`, `keith@brightmoments.io`
- Both work interchangeably for authentication

---

## 🚀 **Quick Start Guide**

### **1. Check Current System Status**
```bash
curl -X GET "https://eden-academy-flame.vercel.app/api/agents/citizen/trainers"
```

### **2. Create Collaborative Training Session**
```bash
curl -X POST "https://eden-academy-flame.vercel.app/api/agents/citizen/trainers" \
  -H "Content-Type: application/json" \
  -d '{
    "trainer": "henry",
    "sessionType": "collaborative", 
    "collaborators": ["keith"],
    "description": "Bright Moments lore update session"
  }'
```

### **3. Submit Training Content**
```bash
curl -X POST "https://eden-academy-flame.vercel.app/api/agents/citizen/training" \
  -H "Content-Type: application/json" \
  -d '{
    "trainer": "henry",
    "trainerEmail": "henry@brightmoments.io",
    "content": "Update about new Bright Moments milestone...",
    "trainingType": "lore_update",
    "sessionId": "session-123-abc"
  }'
```

---

## 🛠️ **API Endpoints**

### **Core Training**
- `GET /api/agents/citizen/training` - Check training status
- `POST /api/agents/citizen/training` - Submit training content

### **Collaboration Management**  
- `GET /api/agents/citizen/trainers` - List authorized trainers
- `POST /api/agents/citizen/trainers` - Create training session
- `GET /api/agents/citizen/trainers/sessions` - View active sessions
- `POST /api/agents/citizen/trainers/sessions` - Manage sessions

### **Review & Approval**
- `GET /api/agents/citizen/trainers/review` - View pending reviews
- `POST /api/agents/citizen/trainers/review` - Submit review/approval

### **Synchronization**
- `GET /api/agents/citizen/sync` - Check sync status  
- `POST /api/agents/citizen/sync` - Force synchronization

---

## 📝 **Training Types**

### **lore_update**
- Cultural heritage and history
- City-specific contexts (Venice Beach → Venice Italy)
- Ritual documentation and ceremonies
- Community milestones and achievements

### **governance_update**  
- DAO mechanics and procedures
- Snapshot voting updates
- Treasury and governance changes
- Bright Opportunities sub-DAO updates

### **community_insight**
- Collector recognition protocols
- Full Set and Ultra Set tracking  
- Community engagement strategies
- Concierge service improvements

### **general**
- Platform updates and changes
- Partnership announcements
- Event documentation
- Broad ecosystem updates

---

## 🔄 **Collaboration Workflow**

### **For Henry:**
1. **Create Session**: Start collaborative training session
2. **Invite Keith**: Add as collaborator to session
3. **Submit Training**: Provide lore updates, governance changes
4. **Review Keith's Work**: Approve/reject Keith's submissions
5. **Sync Changes**: Automatic sync to Registry and app.eden.art

### **For Keith:**
1. **Join Session**: Use session ID provided by Henry
2. **Submit Training**: Community insights, cultural updates
3. **Review Henry's Work**: Cross-validate submissions
4. **Collaborate**: Real-time sync across machines
5. **Monitor Progress**: Track training status and applications

### **Auto-Synchronization:**
- All training syncs automatically to Eden Registry
- Profile updates sync to app.eden.art in real-time
- Cross-machine collaboration with shared sessions
- Audit trail maintained for all training activities

---

## 🎯 **Training Content Examples**

### **Lore Update Example**
```json
{
  "trainer": "henry",
  "trainingType": "lore_update",
  "content": "Update CITIZEN's knowledge about the Venice Italy finale collection (CryptoVeneziani). This represents the completion of the 10-city journey with 1,000 final citizens minted in a retrospective ceremony featuring 100+ projects from the entire Bright Moments ecosystem. Cultural significance: highest - represents full-circle completion of the Venice Beach to Venice Italy narrative arc.",
  "sessionId": "session-456-def"
}
```

### **Community Insight Example**
```json
{
  "trainer": "keith", 
  "trainingType": "community_insight",
  "content": "Full Set holders (10 cities complete) should receive enhanced recognition protocols. Christie's 2024 recognized Ultra Set holders (40 curated citizens) as cultural artifacts. Implement priority concierge escalation for these prestigious collectors with immediate human ops access.",
  "sessionId": "session-456-def"
}
```

---

## 🔍 **Monitoring & Review**

### **Check Training Status**
```bash
curl "https://eden-academy-flame.vercel.app/api/agents/citizen/trainers/sessions?trainer=henry&submissions=true"
```

### **Review Pending Training** 
```bash
curl "https://eden-academy-flame.vercel.app/api/agents/citizen/trainers/review?reviewer=keith&status=pending"
```

### **Approve Training**
```json
{
  "trainingId": "citizen-training-123456789",
  "reviewer": "keith",
  "status": "approved", 
  "feedback": "Accurate lore update, aligns perfectly with Bright Moments values",
  "technicalReview": {
    "accuracy": 5,
    "completeness": 5, 
    "bright_moments_alignment": 5,
    "cultural_sensitivity": 5
  }
}
```

---

## 🚨 **Error Handling**

### **Authentication Errors**
- **403 Forbidden**: Invalid trainer name/email
- **Solution**: Use `henry`, `keith`, or correct email addresses

### **Session Errors**  
- **404 Session Not Found**: Invalid session ID
- **Solution**: Create new session or verify session ID

### **Sync Errors**
- **500 Sync Failed**: Registry or app.eden.art unavailable  
- **Solution**: Retry sync or check system status

---

## 🎨 **CITIZEN Enhancement Goals**

### **Cultural Preservation**
- Document complete Venice → Venice journey
- Preserve ritual language and ceremonial aspects
- Maintain lore consistency across all 10 cities

### **Community Recognition** 
- Track Full Set holders (10 cities complete)
- Identify Ultra Set collectors (40 curated citizens)
- Provide premium concierge services for prestigious collectors

### **DAO Facilitation**
- Support Snapshot governance processes
- Facilitate community proposals and voting
- Maintain democratic values and fairness protocols

### **Market Intelligence**
- Integrate live OpenSea and Dune Analytics data
- Provide real-time floor pricing and market trends
- Support investment decision-making with cultural context

---

## 🔗 **Quick Reference Links**

- **CITIZEN Identity**: `/api/agents/citizen`
- **Market Data**: `/api/agents/citizen/market`
- **Training Hub**: `/api/agents/citizen/training` 
- **Collaboration**: `/api/agents/citizen/trainers`
- **Sync Status**: `/api/agents/citizen/sync`

---

## 📞 **Support**

For technical issues or collaboration questions:
- **Primary Contact**: Seth (System Admin)
- **BM Team**: Henry (Lead Trainer), Keith (BM Trainer)
- **Documentation**: This guide + API responses
- **Audit Trail**: All training logged in Registry system

---

**🎪 Ready to enhance CITIZEN with comprehensive Bright Moments intelligence!**