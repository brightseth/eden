#!/bin/bash

# Eden Academy Worktree Setup Script
# This script creates git worktrees for parallel development with multiple Claude agents

echo "🚀 Setting up Eden Academy Git Worktrees for Parallel Development"
echo "=================================================="

# Create worktree directory
echo "📁 Creating worktree container directory..."
mkdir -p /Users/seth/eden-worktrees

# Function to create worktree
create_worktree() {
    local branch=$1
    local directory=$2
    local description=$3
    
    echo ""
    echo "🔄 Creating worktree: $directory"
    echo "   Branch: $branch"
    echo "   Purpose: $description"
    
    if [ -d "/Users/seth/eden-worktrees/$directory" ]; then
        echo "   ⚠️  Worktree already exists, skipping..."
    else
        git worktree add -b "$branch" "/Users/seth/eden-worktrees/$directory"
        echo "   ✅ Worktree created successfully"
    fi
}

# Create all worktrees
create_worktree "feature/architecture-improvements" "architecture" "System Architecture & ADRs"
create_worktree "feature/token-economics" "token-economics" "Economic Models & Revenue"
create_worktree "feature/agent-onboarding" "agent-launcher" "Onboarding & Launch Criteria"
create_worktree "feature/academy-content" "academy-domain" "Content & Cultural Alignment"
create_worktree "feature/production-integration" "feature-integrator" "Production Implementation"
create_worktree "feature/registry-integration" "registry" "Data Models & Integrity"
create_worktree "feature/ui-design-system" "ui-design" "UI/UX Improvements"
create_worktree "staging/code-review" "code-review" "Review & Merge Staging"

echo ""
echo "📋 Copying environment files to worktrees..."

# Copy env files to each worktree
for dir in /Users/seth/eden-worktrees/*/; do
    if [ -f "/Users/seth/eden-academy/.env.local" ]; then
        cp /Users/seth/eden-academy/.env.local "$dir" 2>/dev/null
        echo "   ✅ Copied .env.local to $(basename $dir)"
    fi
    if [ -f "/Users/seth/eden-academy/.env" ]; then
        cp /Users/seth/eden-academy/.env "$dir" 2>/dev/null
    fi
done

echo ""
echo "📊 Current worktree structure:"
echo "================================"
git worktree list

echo ""
echo "🎯 Quick Reference - Port Allocation:"
echo "====================================="
echo "  main (eden-academy):     3000"
echo "  architecture:            3001"
echo "  token-economics:         3002"
echo "  agent-launcher:          3003"
echo "  academy-domain:          3004"
echo "  feature-integrator:      3005"
echo "  registry:                3006"
echo "  ui-design:               3007"
echo "  code-review:             3008"

echo ""
echo "📝 Next Steps:"
echo "============="
echo "1. Navigate to a worktree: cd /Users/seth/eden-worktrees/<agent-directory>"
echo "2. Install dependencies: npm install"
echo "3. Start dev server: npm run dev -- --port <port-number>"
echo "4. Begin development in your dedicated branch!"

echo ""
echo "💡 Tip: Add these aliases to your shell profile for quick navigation:"
echo "alias wa='cd /Users/seth/eden-worktrees/architecture'"
echo "alias wt='cd /Users/seth/eden-worktrees/token-economics'"
echo "alias wl='cd /Users/seth/eden-worktrees/agent-launcher'"
echo "alias wd='cd /Users/seth/eden-worktrees/academy-domain'"
echo "alias wf='cd /Users/seth/eden-worktrees/feature-integrator'"
echo "alias wr='cd /Users/seth/eden-worktrees/registry'"
echo "alias wu='cd /Users/seth/eden-worktrees/ui-design'"
echo "alias wc='cd /Users/seth/eden-worktrees/code-review'"
echo "alias wm='cd /Users/seth/eden-academy'"

echo ""
echo "🎉 Worktree setup complete!"