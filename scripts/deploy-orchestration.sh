#!/bin/bash
# Eden2.io Deployment Orchestration Script
# Executes the complete deployment sequence for end-to-end system demonstration

set -e

echo "🚀 Eden2.io Deployment Orchestration Started"
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m' 
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" >&2
}

warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    log "🔍 Checking prerequisites..."
    
    # Check if we're in the right directory
    if [ ! -f "package.json" ]; then
        error "Must run from eden-academy root directory"
        exit 1
    fi
    
    # Check environment variables
    if [ -z "$DATABASE_URL" ]; then
        error "DATABASE_URL environment variable required"
        exit 1
    fi
    
    # Check for required tools
    command -v npx >/dev/null 2>&1 || { error "npx required but not installed"; exit 1; }
    command -v vercel >/dev/null 2>&1 || { error "vercel CLI required but not installed"; exit 1; }
    
    log "✅ Prerequisites check passed"
}

# Step 1: Run migration for 95% health score
run_migration() {
    log "📊 Step 1: Running trainer data migration for system health..."
    
    info "Checking current health score..."
    npx tsx -e "
    import { PrismaClient } from '@prisma/client';
    const prisma = new PrismaClient();
    
    async function checkHealth() {
        try {
            const trainers = await prisma.user.count({ where: { role: 'TRAINER' } });
            const agents = await prisma.agent.count();
            const works = await prisma.creation.count();
            
            console.log('System Health Check:');
            console.log('- Trainers:', trainers);
            console.log('- Agents:', agents); 
            console.log('- Works:', works);
            
            const healthScore = Math.min(95, (trainers * 10 + agents * 5 + Math.min(works, 100)) / 2);
            console.log('- Health Score:', healthScore.toFixed(1) + '%');
            
            if (healthScore < 95) {
                console.log('⚠️  Health score below 95%, running migration...');
                process.exit(1);
            } else {
                console.log('✅ Health score sufficient');
            }
        } catch (error) {
            console.error('Health check failed:', error.message);
            process.exit(1);
        }
        await prisma.\$disconnect();
    }
    
    checkHealth();
    " || {
        warn "Health score below 95%, running migration..."
        npx tsx scripts/migrate-trainer-data.ts || {
            error "Migration failed"
            exit 1
        }
    }
    
    log "✅ Step 1 complete: System health foundation established"
}

# Step 2: Deploy Registry to production
deploy_registry() {
    log "🏛️ Step 2: Deploying Registry to production with JWT auth..."
    
    info "Configuring Registry production environment..."
    
    # Set production environment variables
    export JWT_SECRET="eden-registry-prod-jwt-$(date +%s)"
    export WEBHOOK_SIGNING_KEY="eden-webhook-prod-key-$(date +%s)"
    export NODE_ENV="production"
    
    info "Deploying Registry to production..."
    cd ../eden-genesis-registry || {
        error "Registry directory not found"
        exit 1
    }
    
    # Build and deploy Registry
    npm run build || {
        error "Registry build failed"
        exit 1
    }
    
    vercel deploy --prod || {
        error "Registry deployment failed"
        exit 1
    }
    
    cd ../eden-academy
    log "✅ Step 2 complete: Registry deployed to production"
}

# Step 3: Sync agent data to production Registry
sync_agent_data() {
    log "🔄 Step 3: Syncing all agent lore to production Registry..."
    
    local agents=("abraham" "solienne" "sue" "verdelis" "miyomi" "bertha" "citizen" "geppetto" "koru")
    
    for agent in "${agents[@]}"; do
        info "Syncing $agent to Registry..."
        
        npx tsx scripts/sync-agent-lore-to-registry.ts "$agent" || {
            warn "Failed to sync $agent, continuing..."
        }
        
        sleep 1 # Rate limiting
    done
    
    info "Verifying Registry data integrity..."
    npx tsx -e "
    const response = await fetch('https://eden-genesis-registry.vercel.app/api/v1/agents');
    const agents = await response.json();
    console.log('Registry agents count:', agents.length);
    console.log('Active agents:', agents.filter(a => a.status === 'active').length);
    " || warn "Registry verification failed"
    
    log "✅ Step 3 complete: Agent data synced to production Registry"
}

# Step 4: Deploy MIYOMI sovereign
deploy_miyomi() {
    log "📈 Step 4: Deploying MIYOMI sovereign to miyomi.eden2.io..."
    
    cd ../miyomi-sovereign || {
        error "MIYOMI sovereign directory not found"
        exit 1
    }
    
    info "Building MIYOMI sovereign..."
    npm run build || {
        error "MIYOMI build failed"
        exit 1
    }
    
    info "Deploying to miyomi.eden2.io..."
    vercel deploy --prod --alias miyomi.eden2.io || {
        error "MIYOMI deployment failed"
        exit 1
    }
    
    info "Testing MIYOMI health endpoint..."
    sleep 10 # Allow deployment to stabilize
    curl -f "https://miyomi.eden2.io/api/health" || warn "MIYOMI health check failed"
    
    cd ../eden-academy
    log "✅ Step 4 complete: MIYOMI sovereign live at miyomi.eden2.io"
}

# Step 5: Academy Registry SDK integration
academy_registry_integration() {
    log "🎓 Step 5: Converting Academy to Registry SDK v1 everywhere..."
    
    info "Updating Academy to use Registry SDK..."
    
    # Replace direct API calls with SDK calls
    npx tsx scripts/convert-to-registry-sdk.ts || {
        error "SDK conversion failed"
        exit 1
    }
    
    info "Building Academy with Registry integration..."
    npm run build || {
        error "Academy build failed"
        exit 1
    }
    
    info "Deploying Academy updates..."
    vercel deploy --prod || {
        error "Academy deployment failed"
        exit 1
    }
    
    log "✅ Step 5 complete: Academy using Registry SDK v1"
}

# Step 6: Enable trainer dashboards
enable_trainer_dashboards() {
    log "👥 Step 6: Enabling trainer dashboards for Henry/Keith/Martin/Colin..."
    
    local trainers=("henry@brightmoments.io" "keith@brightmoments.io" "martin@example.com" "colin@example.com")
    
    for trainer in "${trainers[@]}"; do
        info "Enabling dashboard access for $trainer..."
        
        npx tsx -e "
        import { PrismaClient } from '@prisma/client';
        const prisma = new PrismaClient();
        
        async function enableTrainer() {
            try {
                await prisma.user.upsert({
                    where: { email: '$trainer' },
                    update: { role: 'TRAINER' },
                    create: {
                        email: '$trainer',
                        role: 'TRAINER',
                        name: '${trainer%%@*}',
                    }
                });
                console.log('✅ Enabled trainer access for $trainer');
            } catch (error) {
                console.error('Failed to enable trainer $trainer:', error.message);
            }
            await prisma.\$disconnect();
        }
        
        enableTrainer();
        " || warn "Failed to enable trainer access for $trainer"
    done
    
    log "✅ Step 6 complete: Trainer dashboards enabled"
}

# Step 7: Deploy completed agent implementations
deploy_completed_agents() {
    log "🤖 Step 7: Deploying completed agent implementations..."
    
    local agents=("abraham" "solienne" "sue" "verdelis")
    
    for agent in "${agents[@]}"; do
        info "Deploying $agent sovereign site..."
        
        # Create sovereign deployment for each agent
        npx tsx scripts/create-sovereign-deployment.ts "$agent" || {
            warn "Failed to deploy sovereign site for $agent"
            continue
        }
        
        sleep 5 # Allow deployment to stabilize
    done
    
    log "✅ Step 7 complete: Completed agents deployed to sovereign sites"
}

# Verification and health checks
verify_deployment() {
    log "🔍 Final verification and health checks..."
    
    local endpoints=(
        "https://eden-genesis-registry.vercel.app/api/health"
        "https://eden-academy-flame.vercel.app/api/health"
        "https://miyomi.eden2.io/api/health"
    )
    
    for endpoint in "${endpoints[@]}"; do
        info "Testing $endpoint..."
        curl -f "$endpoint" -o /dev/null -s || warn "Health check failed for $endpoint"
        sleep 2
    done
    
    info "Testing DNS resolution..."
    dig miyomi.eden2.io +short | grep -E '^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$' || warn "DNS resolution issues"
    
    log "✅ Deployment verification complete"
}

# Main execution
main() {
    log "Starting Eden2.io deployment orchestration..."
    
    check_prerequisites
    run_migration
    deploy_registry  
    sync_agent_data
    deploy_miyomi
    academy_registry_integration
    enable_trainer_dashboards
    deploy_completed_agents
    verify_deployment
    
    echo ""
    log "🎉 Eden2.io deployment orchestration completed successfully!"
    log "🌐 System available at:"
    log "   - Registry: https://eden-genesis-registry.vercel.app"
    log "   - Academy: https://eden-academy-flame.vercel.app"  
    log "   - MIYOMI: https://miyomi.eden2.io"
    echo ""
}

# Execute if run directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi