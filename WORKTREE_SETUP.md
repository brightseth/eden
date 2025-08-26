# Eden Academy Git Worktree Setup for Parallel Agent Development

## 🎯 Overview
This setup enables 6 specialized Claude Coding Agents to work simultaneously on different Eden Academy features without conflicts.

## 📁 Recommended Directory Structure
```
/Users/seth/
├── eden-academy/              # Main repository (main branch)
├── eden-worktrees/            # Worktree container directory
│   ├── arch/                  # ARCH - Architecture Guardian worktree
│   ├── truth/                 # TRUTH - Registry Data Guardian worktree
│   ├── lore/                  # LORE - Narrative & Culture worktree
│   ├── helvetica/             # HELVETICA - Visual Design worktree
│   ├── token/                 # TOKEN - Economics worktree
│   └── launcher/              # LAUNCHER - Agent Quality worktree
```

## 🚀 Initial Setup Commands

### 1. Create Worktree Container Directory
```bash
mkdir -p /Users/seth/eden-worktrees
```

### 2. Create Feature Branches and Worktrees

#### ARCH - System Architecture & ADRs
```bash
git worktree add -b feature/architecture /Users/seth/eden-worktrees/arch
```

#### TRUTH - Data Integrity & Registry
```bash
git worktree add -b feature/data-integrity /Users/seth/eden-worktrees/truth
```

#### LORE - Narrative & Cultural Mission
```bash
git worktree add -b feature/narrative /Users/seth/eden-worktrees/lore
```

#### HELVETICA - Visual Design & Brand
```bash
git worktree add -b feature/visual-design /Users/seth/eden-worktrees/helvetica
```

#### TOKEN - Economics & Metrics
```bash
git worktree add -b feature/economics /Users/seth/eden-worktrees/token
```

#### LAUNCHER - Agent Quality & Onboarding
```bash
git worktree add -b feature/agent-quality /Users/seth/eden-worktrees/launcher
```

## 🔄 Agent-to-Worktree Mapping

| Claude Agent | Worktree | Branch | Primary Focus |
|-------|----------|--------|---------------|
| ARCH | `/arch` | `feature/architecture` | System coherence, ADRs, API contracts |
| TRUTH | `/truth` | `feature/data-integrity` | Single source of truth, data models |
| LORE | `/lore` | `feature/narrative` | Cultural mission, language consistency |
| HELVETICA | `/helvetica` | `feature/visual-design` | Brand excellence, UI/UX standards |
| TOKEN | `/token` | `feature/economics` | Economic models, pricing, metrics |
| LAUNCHER | `/launcher` | `feature/agent-quality` | Launch criteria, quality gates |

## 📋 Development Workflow

### 1. Starting Work in a Worktree
```bash
# Navigate to agent's worktree
cd /Users/seth/eden-worktrees/<agent-directory>

# Pull latest from main
git pull origin main

# Start development server (if needed)
npm run dev
```

### 2. Making Changes
Each agent works independently in their worktree:
```bash
# Make changes
# Test locally
# Commit frequently with descriptive messages
git add .
git commit -m "feat(agent-name): Description of change"
```

### 3. Syncing with Main
```bash
# Fetch latest changes
git fetch origin main

# Rebase on main to keep history clean
git rebase origin/main

# Push to remote
git push origin feature/<branch-name>
```

### 4. Integration Pattern
```bash
# In main repository
cd /Users/seth/eden-academy

# Update main
git pull origin main

# Merge feature branch
git merge --no-ff feature/<branch-name>

# Or create PR for review
gh pr create --base main --head feature/<branch-name>
```

## 🔀 Merge Strategy

### Priority Order for Merging
1. **TRUTH** - Data model changes (foundation)
2. **ARCH** - System design changes
3. **TOKEN** - Economic model updates
4. **LORE** - Content and cultural updates
5. **HELVETICA** - UI/UX improvements
6. **LAUNCHER** - Agent quality features

### Conflict Resolution
- Each worktree maintains independence
- Rebase frequently on main
- Coordinate through PR reviews
- Use Code Reviewer worktree for conflict resolution

## 🛠️ Utility Commands

### List All Worktrees
```bash
git worktree list
```

### Remove a Worktree
```bash
git worktree remove /Users/seth/eden-worktrees/<directory>
```

### Clean Up Stale Worktrees
```bash
git worktree prune
```

### Switch Between Worktrees
```bash
# Use aliases for quick switching
alias arch='cd /Users/seth/eden-worktrees/arch'
alias truth='cd /Users/seth/eden-worktrees/truth'
alias lore='cd /Users/seth/eden-worktrees/lore'
alias helvetica='cd /Users/seth/eden-worktrees/helvetica'
alias token='cd /Users/seth/eden-worktrees/token'
alias launcher='cd /Users/seth/eden-worktrees/launcher'
alias main='cd /Users/seth/eden-academy'  # main repository
```

## 🎯 Current MVP Priorities by Worktree

### Immediate Setup (Do Now)
1. **HELVETICA** - Admin documentation viewer improvements
2. **LAUNCHER** - Agent onboarding flow
3. **TOKEN** - Revenue calculator implementation

### Next Phase
4. **TRUTH** - Data model standardization with spirit-registry
5. **ARCH** - ADR documentation for integrations
6. **LORE** - Content refinement and cultural alignment

## 📝 Best Practices

1. **Commit Often**: Small, focused commits in each worktree
2. **Pull Frequently**: Stay updated with main branch
3. **Clear Boundaries**: Each agent owns their worktree
4. **Document Changes**: Update relevant .md files
5. **Test Locally**: Each worktree has its own dev server
6. **Communicate**: Use PR descriptions for context

## 🚨 Important Notes

- Each worktree is a full copy of the repository
- Node modules need to be installed in each worktree
- Environment variables (.env) need to be copied to each worktree
- Dev servers can run simultaneously on different ports

## 🔧 Setup Script

Save this as `setup-worktrees.sh`:
```bash
#!/bin/bash

# Create worktree directory
mkdir -p /Users/seth/eden-worktrees

# Create all worktrees for the 6 Claude Coding Agents
git worktree add -b feature/architecture /Users/seth/eden-worktrees/arch
git worktree add -b feature/data-integrity /Users/seth/eden-worktrees/truth
git worktree add -b feature/narrative /Users/seth/eden-worktrees/lore
git worktree add -b feature/visual-design /Users/seth/eden-worktrees/helvetica
git worktree add -b feature/economics /Users/seth/eden-worktrees/token
git worktree add -b feature/agent-quality /Users/seth/eden-worktrees/launcher

# Copy env files to each worktree
for dir in /Users/seth/eden-worktrees/*/; do
  cp /Users/seth/eden-academy/.env.local "$dir" 2>/dev/null || true
  echo "✅ Set up worktree: $dir"
done

echo "🎉 All worktrees created successfully!"
git worktree list
```

## 🚀 Quick Start

1. Run the setup script to create all worktrees
2. Each agent navigates to their worktree
3. Install dependencies: `npm install`
4. Start development: `npm run dev -- --port <unique-port>`
5. Begin feature development

## 📊 Port Allocation

| Worktree | Dev Server Port | Claude Agent |
|----------|----------------|-------------|
| main | 3000 | (Main branch) |
| arch | 3001 | ARCH |
| truth | 3002 | TRUTH |
| lore | 3003 | LORE |
| helvetica | 3004 | HELVETICA |
| token | 3005 | TOKEN |
| launcher | 3006 | LAUNCHER |