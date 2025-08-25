# Eden Academy Git Worktree Setup for Parallel Agent Development

## 🎯 Overview
This setup enables 8 specialized Claude agents to work simultaneously on different Eden Academy features without conflicts.

## 📁 Recommended Directory Structure
```
/Users/seth/
├── eden-academy/              # Main repository (main branch)
├── eden-worktrees/            # Worktree container directory
│   ├── architecture/          # Architecture Guardian worktree
│   ├── token-economics/       # Token Economist worktree
│   ├── agent-launcher/        # Agent Launcher worktree
│   ├── academy-domain/        # Academy Domain Expert worktree
│   ├── feature-integrator/    # Feature Integrator worktree
│   ├── registry/              # Registry Guardian worktree
│   ├── ui-design/             # Design Critic worktree
│   └── code-review/           # Code Reviewer staging area
```

## 🚀 Initial Setup Commands

### 1. Create Worktree Container Directory
```bash
mkdir -p /Users/seth/eden-worktrees
```

### 2. Create Feature Branches and Worktrees

#### Architecture Guardian - System Architecture & ADRs
```bash
git worktree add -b feature/architecture-improvements /Users/seth/eden-worktrees/architecture
```

#### Token Economist - Economic Models & Revenue
```bash
git worktree add -b feature/token-economics /Users/seth/eden-worktrees/token-economics
```

#### Agent Launcher - Onboarding & Launch Criteria
```bash
git worktree add -b feature/agent-onboarding /Users/seth/eden-worktrees/agent-launcher
```

#### Academy Domain Expert - Content & Cultural Alignment
```bash
git worktree add -b feature/academy-content /Users/seth/eden-worktrees/academy-domain
```

#### Feature Integrator - Production Implementation
```bash
git worktree add -b feature/production-integration /Users/seth/eden-worktrees/feature-integrator
```

#### Registry Guardian - Data Models & Integrity
```bash
git worktree add -b feature/registry-integration /Users/seth/eden-worktrees/registry
```

#### Design Critic - UI/UX Improvements
```bash
git worktree add -b feature/ui-design-system /Users/seth/eden-worktrees/ui-design
```

#### Code Reviewer - Review Staging
```bash
git worktree add -b staging/code-review /Users/seth/eden-worktrees/code-review
```

## 🔄 Agent-to-Worktree Mapping

| Agent | Worktree | Branch | Primary Focus |
|-------|----------|--------|---------------|
| Architecture Guardian | `/architecture` | `feature/architecture-improvements` | ADRs, system design, API contracts |
| Token Economist | `/token-economics` | `feature/token-economics` | Revenue models, token distribution |
| Agent Launcher | `/agent-launcher` | `feature/agent-onboarding` | Launch criteria, onboarding flow |
| Academy Domain Expert | `/academy-domain` | `feature/academy-content` | Content, copy, cultural alignment |
| Feature Integrator | `/feature-integrator` | `feature/production-integration` | Production code, CI/CD |
| Registry Guardian | `/registry` | `feature/registry-integration` | Database schemas, data models |
| Design Critic | `/ui-design` | `feature/ui-design-system` | Components, styling, UX |
| Code Reviewer | `/code-review` | `staging/code-review` | Review & merge preparation |

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
1. **Registry Guardian** - Data model changes (foundation)
2. **Architecture Guardian** - System design changes
3. **Token Economist** - Economic model updates
4. **Academy Domain Expert** - Content updates
5. **Design Critic** - UI/UX improvements
6. **Agent Launcher** - Onboarding features
7. **Feature Integrator** - Production implementations
8. **Code Reviewer** - Final review and cleanup

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
alias wa='cd /Users/seth/eden-worktrees/architecture'
alias wt='cd /Users/seth/eden-worktrees/token-economics'
alias wl='cd /Users/seth/eden-worktrees/agent-launcher'
alias wd='cd /Users/seth/eden-worktrees/academy-domain'
alias wf='cd /Users/seth/eden-worktrees/feature-integrator'
alias wr='cd /Users/seth/eden-worktrees/registry'
alias wu='cd /Users/seth/eden-worktrees/ui-design'
alias wc='cd /Users/seth/eden-worktrees/code-review'
alias wm='cd /Users/seth/eden-academy'  # main
```

## 🎯 Current MVP Priorities by Worktree

### Immediate Setup (Do Now)
1. **ui-design** - Admin documentation viewer improvements
2. **agent-launcher** - Agent onboarding flow
3. **token-economics** - Revenue calculator implementation

### Next Phase
4. **registry** - Data model standardization
5. **architecture** - ADR documentation
6. **academy-domain** - Content refinement

### Future
7. **feature-integrator** - Production deployment
8. **code-review** - Quality assurance

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

# Create all worktrees
git worktree add -b feature/architecture-improvements /Users/seth/eden-worktrees/architecture
git worktree add -b feature/token-economics /Users/seth/eden-worktrees/token-economics
git worktree add -b feature/agent-onboarding /Users/seth/eden-worktrees/agent-launcher
git worktree add -b feature/academy-content /Users/seth/eden-worktrees/academy-domain
git worktree add -b feature/production-integration /Users/seth/eden-worktrees/feature-integrator
git worktree add -b feature/registry-integration /Users/seth/eden-worktrees/registry
git worktree add -b feature/ui-design-system /Users/seth/eden-worktrees/ui-design
git worktree add -b staging/code-review /Users/seth/eden-worktrees/code-review

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

| Worktree | Dev Server Port |
|----------|----------------|
| main | 3000 |
| architecture | 3001 |
| token-economics | 3002 |
| agent-launcher | 3003 |
| academy-domain | 3004 |
| feature-integrator | 3005 |
| registry | 3006 |
| ui-design | 3007 |
| code-review | 3008 |