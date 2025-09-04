# Getting Started with Eden Academy Development

## Quick Start (5 minutes)

### 1. Clone the Repository
```bash
git clone https://github.com/edenartlab/eden-academy.git
cd eden-academy
```

### 2. Set Up Environment
```bash
# Copy environment template
cp .env.example .env.local

# Install dependencies
npm install
```

### 3. Configure Required Services
You'll need these environment variables:
```env
# Supabase (Database & Auth)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Registry API
REGISTRY_API_URL=https://eden-genesis-registry.vercel.app/api/v1
REGISTRY_API_KEY=your_registry_api_key
```

### 4. Run Development Server
```bash
npm run dev
# Open http://localhost:3000
```

## Essential Documentation Path

**Start here and read in order:**

1. **[CLAUDE.md](/CLAUDE.md)** - Core development rules
2. **[KNOWLEDGE.md](/KNOWLEDGE.md)** - System architecture context
3. **[Agent Cheatsheet](/admin/docs/agents)** - Understand the 8 agent system
4. **[Site Map](/admin/docs/sitemap)** - Navigate the codebase

## Key Concepts to Understand

### 1. Registry-First Architecture
All agent data flows through the Registry:
```
UI → Gateway → Registry → Database
```
Never bypass the Registry for agent data!

### 2. Feature Flags
Every new feature must ship behind a flag:
```typescript
if (isFeatureEnabled('YOUR_FEATURE_FLAG')) {
  // New feature code
}
```

### 3. Domain Language
Use these canonical terms consistently:
- **Agent** (not "AI", "bot", or "model")
- **Work** (not "creation", "output", or "generation")
- **Cohort** (not "batch", "group", or "class")

## Common Development Tasks

### Adding a New Agent
1. Create agent profile in Registry
2. Add agent configuration in `/src/data/agents/`
3. Create agent site in `/src/app/sites/[agent-name]/`
4. Update KNOWLEDGE.md with agent details

### Implementing a Feature
1. Create feature flag in `/src/config/flags.ts`
2. Write ADR if architectural change
3. Implement behind flag (default: off)
4. Add contract tests
5. Document in relevant .md files

### Working with Documentation
- Main docs: `/admin/docs`
- Add new docs to `/docs/` directory
- Update `/src/app/admin/docs/page.tsx` for navigation
- Keep KNOWLEDGE.md current

## Project Structure
```
eden-academy/
├── src/
│   ├── app/           # Next.js app router pages
│   ├── components/    # Reusable React components
│   ├── lib/          # Business logic and utilities
│   ├── data/         # Agent data and configurations
│   └── config/       # Feature flags and settings
├── docs/             # Technical documentation
│   └── adr/         # Architecture Decision Records
├── public/          # Static assets
└── KNOWLEDGE.md     # System context (START HERE!)
```

## Development Workflow

### 1. Feature Branch
```bash
git checkout -b feature/your-feature
```

### 2. Make Changes
- Follow CLAUDE.md rules
- Use canonical domain terms
- Add feature flags

### 3. Test Locally
```bash
npm run dev     # Development server
npm run build   # Production build
npm run test    # Run tests
```

### 4. Submit PR
- Reference relevant ADRs
- Include feature flag details
- Document rollback plan

## Troubleshooting

### Common Issues

**Build fails with "module not found"**
```bash
rm -rf node_modules .next
npm install
npm run dev
```

**Registry connection errors**
- Check REGISTRY_API_KEY is set
- Verify Registry is accessible
- Feature flags provide fallback

**Supabase auth issues**  
- Ensure Supabase project is active
- Check ANON_KEY matches project
- Clear browser localStorage

## Getting Help

### Documentation Resources
- **Main Docs Hub**: https://eden-academy-flame.vercel.app/admin/docs
- **Registry API**: https://eden-genesis-registry.vercel.app/api-docs
- **ADRs**: `/docs/adr/` directory

### Team Communication
- **GitHub Issues**: Bug reports and features
- **Discord**: Community support
- **PRs**: Code review and discussion

## Next Steps

1. ✅ Read [CLAUDE.md](/CLAUDE.md) completely
2. ✅ Explore the [Site Map](/admin/docs/sitemap)
3. ✅ Check recent [ADRs](/admin/docs/architecture)
4. ✅ Try modifying an existing agent page
5. ✅ Create your first feature flag

## Quick Reference

### Important Files
- `CLAUDE.md` - Development rules
- `KNOWLEDGE.md` - System context
- `/src/config/flags.ts` - Feature flags
- `/docs/adr/` - Architecture decisions

### Key Commands
```bash
npm run dev          # Start development
npm run build        # Build for production
npm run lint         # Check code quality
npm run test         # Run tests
git worktree add     # Parallel development
```

### Agent Naming Convention
- **Standard**: ALL CAPS for all agents (ABRAHAM, SOLIENNE, BERTHA, SUE, etc.)
- **Handles**: Lowercase for URLs (abraham, solienne, bertha, sue)
- **Display**: Always ALL CAPS in documentation and UI

Welcome to Eden Academy development! 🚀