# 🚀 Eden Academy Worktree Quick Reference

## Current Status
✅ **8 worktrees created** for parallel development
✅ **Documentation viewer working** at http://localhost:3000/admin/docs
✅ **Agent cheatsheet accessible** at http://localhost:3000/admin/docs/agents

## 🎯 Immediate Actions for Each Agent

### 1. Architecture Guardian (`/architecture`)
```bash
cd /Users/seth/eden-worktrees/architecture
npm install
npm run dev -- --port 3001
```
**Current Task:** Create ADRs for worktree strategy and parallel development

### 2. Token Economist (`/token-economics`)
```bash
cd /Users/seth/eden-worktrees/token-economics
npm install
npm run dev -- --port 3002
```
**Current Task:** Implement revenue calculator for agent economics

### 3. Agent Launcher (`/agent-launcher`)
```bash
cd /Users/seth/eden-worktrees/agent-launcher
npm install
npm run dev -- --port 3003
```
**Current Task:** Build agent onboarding flow UI

### 4. Academy Domain Expert (`/academy-domain`)
```bash
cd /Users/seth/eden-worktrees/academy-domain
npm install
npm run dev -- --port 3004
```
**Current Task:** Refine agent cheatsheet content and documentation

### 5. Feature Integrator (`/feature-integrator`)
```bash
cd /Users/seth/eden-worktrees/feature-integrator
npm install
npm run dev -- --port 3005
```
**Current Task:** Set up CI/CD for worktree integration

### 6. Registry Guardian (`/registry`)
```bash
cd /Users/seth/eden-worktrees/registry
npm install
npm run dev -- --port 3006
```
**Current Task:** Standardize data models across all features

### 7. Design Critic (`/ui-design`)
```bash
cd /Users/seth/eden-worktrees/ui-design
npm install
npm run dev -- --port 3007
```
**Current Task:** Improve documentation viewer UI/UX

### 8. Code Reviewer (`/code-review`)
```bash
cd /Users/seth/eden-worktrees/code-review
npm install
npm run dev -- --port 3008
```
**Current Task:** Review and prepare merges from other worktrees

## 🔄 Daily Workflow

### Morning Sync (Each Agent)
```bash
# In your worktree
git fetch origin main
git rebase origin/main
```

### During Development
```bash
# Make changes
git add .
git commit -m "feat(your-area): Description"
git push origin feature/your-branch
```

### End of Day
```bash
# Push your changes
git push origin feature/your-branch
# Create PR if ready
gh pr create --title "Your feature" --body "Description"
```

## 🔀 Integration Schedule

### Daily Merges (5 PM)
1. Registry changes (data models)
2. Architecture changes (system design)
3. UI improvements (design system)

### Weekly Integration (Fridays)
- Token economics updates
- Agent onboarding features
- Content updates
- Production deployments

## 🚨 Conflict Prevention

1. **Each agent owns their domain** - Don't edit files outside your area
2. **Coordinate through PRs** - Review each other's changes
3. **Use the cheatsheet** - Reference at `/admin/docs/agents`
4. **Communicate in comments** - Document your decisions

## 📊 Live Worktree Status

| Agent | Worktree | Port | Status | Current Focus |
|-------|----------|------|--------|---------------|
| Architecture Guardian | `/architecture` | 3001 | 🟢 Ready | ADRs |
| Token Economist | `/token-economics` | 3002 | 🟢 Ready | Revenue calc |
| Agent Launcher | `/agent-launcher` | 3003 | 🟢 Ready | Onboarding UI |
| Academy Domain | `/academy-domain` | 3004 | 🟢 Ready | Content |
| Feature Integrator | `/feature-integrator` | 3005 | 🟢 Ready | CI/CD |
| Registry Guardian | `/registry` | 3006 | 🟢 Ready | Data models |
| Design Critic | `/ui-design` | 3007 | 🟢 Ready | UI polish |
| Code Reviewer | `/code-review` | 3008 | 🟢 Ready | Reviews |

## 💡 Pro Tips

1. **Open multiple terminals** - One per agent/worktree
2. **Use VSCode workspaces** - Open each worktree in separate window
3. **Monitor all dev servers** - Keep logs visible
4. **Check the cheatsheet** - http://localhost:3000/admin/docs/agents
5. **Commit frequently** - Small, atomic commits

## 🎯 Today's Priorities

1. ✅ Worktrees created
2. ✅ Documentation viewer deployed
3. ⏳ Each agent: Install dependencies in your worktree
4. ⏳ Each agent: Start your dev server on assigned port
5. ⏳ Begin feature development in parallel

## 🔗 Quick Links

- **Agent Cheatsheet:** http://localhost:3000/admin/docs/agents
- **Documentation Hub:** http://localhost:3000/admin/docs
- **Site Map:** http://localhost:3000/admin/docs/sitemap
- **All Docs:** http://localhost:3000/admin/docs/all

## ⚡ Emergency Commands

### Remove a worktree
```bash
git worktree remove /Users/seth/eden-worktrees/<directory>
```

### Reset a worktree
```bash
cd /Users/seth/eden-worktrees/<directory>
git reset --hard origin/main
```

### List all worktrees
```bash
git worktree list
```

### Clean up
```bash
git worktree prune
```