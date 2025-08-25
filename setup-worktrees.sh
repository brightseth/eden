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

# Create all worktrees aligned with 6 Claude Coding Agents
create_worktree "feature/architecture" "arch" "ARCH - System Architecture & ADRs"
create_worktree "feature/data-integrity" "truth" "TRUTH - Data Integrity & Registry"
create_worktree "feature/narrative-culture" "lore" "LORE - Narrative & Cultural Mission"
create_worktree "feature/visual-design" "helvetica" "HELVETICA - Visual Design & Brand"
create_worktree "feature/token-economics" "token" "TOKEN - Economic Models & Pricing"
create_worktree "feature/agent-quality" "launcher" "LAUNCHER - Agent Quality & Launch"

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
echo "🎯 Quick Reference - Port Allocation (6 Claude Coding Agents):"
echo "================================================================"
echo "  main (eden-academy):     3000"
echo "  arch (ARCH):             3001"
echo "  truth (TRUTH):           3002"
echo "  lore (LORE):             3003"
echo "  helvetica (HELVETICA):   3004"
echo "  token (TOKEN):           3005"
echo "  launcher (LAUNCHER):     3006"

echo ""
echo "📝 Next Steps:"
echo "============="
echo "1. Navigate to a worktree: cd /Users/seth/eden-worktrees/<agent-directory>"
echo "2. Install dependencies: npm install"
echo "3. Start dev server: npm run dev -- --port <port-number>"
echo "4. Begin development in your dedicated branch!"

echo ""
echo "💡 Tip: Add these aliases to your shell profile for quick navigation:"
echo "# Claude Coding Agent Worktree Navigation"
echo "alias arch='cd /Users/seth/eden-worktrees/arch'"
echo "alias truth='cd /Users/seth/eden-worktrees/truth'" 
echo "alias lore='cd /Users/seth/eden-worktrees/lore'"
echo "alias helvetica='cd /Users/seth/eden-worktrees/helvetica'"
echo "alias token='cd /Users/seth/eden-worktrees/token'"
echo "alias launcher='cd /Users/seth/eden-worktrees/launcher'"
echo "alias main='cd /Users/seth/eden-academy'"

echo ""
echo "🎉 Worktree setup complete!"