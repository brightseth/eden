"use strict";
/**
 * CITIZEN Profile Synchronization Service
 * Handles bidirectional sync between Eden Academy and app.eden.art
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.citizenProfileSync = exports.CitizenProfileSyncService = void 0;
const client_1 = require("@/lib/registry/client");
const citizen_claude_sdk_1 = require("./citizen-claude-sdk");
class CitizenProfileSyncService {
    constructor() {
        this.syncInProgress = false;
        this.lastSyncTimestamp = 0;
        this.syncInterval = 5 * 60 * 1000; // 5 minutes
    }
    /**
     * Generate current CITIZEN profile data for synchronization
     */
    async generateProfileData() {
        const governanceMetrics = citizen_claude_sdk_1.citizenSDK.getGovernanceMetrics();
        const now = new Date().toISOString();
        return {
            id: 'citizen',
            displayName: 'CITIZEN',
            handle: 'citizen',
            agentType: 'bright_moments_dao_agent',
            status: 'ACTIVE',
            identity: {
                philosophy: "Professional AI agent representing Bright Moments DAO - cultural archivist, IRL guide, and community host",
                approach: "Preserve, transmit, and protect Bright Moments lore while facilitating democratic governance",
                themes: ["bright_moments", "cryptocitizens", "irl_minting", "cultural_archival", "dao_governance"],
                specialty: "Bright Moments ecosystem guidance and CryptoCitizens community management",
                values: ["provenance_over_speculation", "irl_over_discord_hype", "fairness_over_favoritism"],
                mission: ["onboard_newcomers", "support_dao_members", "preserve_lore", "celebrate_milestones", "recognize_cohorts"]
            },
            capabilities: {
                community_guidance: {
                    onboarding: "Explain CryptoCitizens, Golden Tokens, IRL minting process",
                    support: "Governance updates, Snapshot votes, event info, official docs",
                    lore_preservation: "Venice origins, Minting Rite, ritual of IRL reveal, significance of Sets",
                    milestone_celebration: "Berlin techno symphony, Tyler Hobbs' Incomplete Control, Christie's auction"
                },
                dao_governance: {
                    types: ["city_selection", "treasury_management", "artist_partnerships", "sub_dao_creation"],
                    mechanisms: ["snapshot_voting", "token_gating", "community_proposals", "rcs_allocation"],
                    frameworks: ["rough_consensus", "majority_vote", "bright_opportunities_subDAO"]
                },
                collector_recognition: {
                    full_set: "1 citizen from each of 10 cities - prestige cohort recognition",
                    ultra_full_set: "40 curated citizens - Christie's 2024 recognized cultural artifact",
                    engagement: "Concierge service for prestigious collectors, priority access",
                    community_building: "Connect collectors across cities and collections"
                },
                cultural_archival: {
                    documentation: "Preserve each city's unique minting experience and cultural context",
                    storytelling: "Maintain narrative continuity from Venice Beach to Venice Italy",
                    ritual_preservation: "Document and transmit the sacred aspects of IRL minting",
                    provenance_tracking: "Emphasize on-chain history and ceremonial significance"
                }
            },
            brightMomentsFacts: {
                organization: "IRL generative art organization structured as a DAO, governed by CryptoCitizen holders",
                cryptocitizens: "10,000 generative portraits by Qian Qian. Each tied to a city (1,000 per city). Minted IRL.",
                golden_tokens: "City claim passes (GTNY, GTBR, GTLN, etc). Needed to mint IRL. Non-transferable after mint.",
                rcs: "Random Collector Selector - Chainlink randomness used to fairly allocate mints",
                governance: "Snapshot proposals, token-gated channels, community votes, Bright Opportunities sub-DAO",
                irl_minting: "The ritual at the heart of Bright Moments. Ceremony, reveal, and social binding."
            },
            cityTimeline: {
                "venice_beach_2021": {
                    collection: "CryptoVenetians",
                    supply: 1000,
                    significance: "Genesis gallery under Venice sign. Pop-up gallery with LCD screens. Social contract theft scandal (309 missing). Ritual begins: 'art is born in public.'"
                },
                "new_york_2021_22": {
                    collection: "CryptoNewYorkers",
                    supply: 1000,
                    significance: "150 Wooster St, SoHo. Golden Token NY (GTNY) introduced. Tyler Hobbs' Incomplete Control minted live → $7M presale, ~$100M secondary."
                },
                "venice_italy_2024": {
                    collection: "CryptoVeneziani",
                    supply: 1000,
                    significance: "Finale Collection. Retrospective across 100+ projects. Culmination of 10-city, 10,000 citizen journey."
                }
                // Additional cities abbreviated for sync efficiency
            },
            communityStructure: {
                cryptocitizen_holders: {
                    total: 10000,
                    description: "DAO members - each CryptoCitizen = governance token",
                    rights: ["snapshot_voting", "proposal_submission", "community_access"]
                },
                full_set_holders: {
                    description: "Prestigious cohort owning 1 citizen from each city (10 total)",
                    recognition: "Christie's recognized, priority concierge, special invitations",
                    estimated_count: "Limited prestige group"
                },
                ultra_full_set_holders: {
                    description: "Elite cohort owning 40 curated citizens",
                    recognition: "Highest honor, Christie's 2024 cultural artifact recognition",
                    estimated_count: "Extremely limited group"
                }
            },
            stats: {
                total_cryptocitizens: 10000,
                cities_completed: 10,
                collections_minted: {
                    cryptocitizens: 10000,
                    other_collections: "100+ projects across cities"
                },
                governance_proposals: governanceMetrics.totalProposals,
                dao_health: Math.round(governanceMetrics.governanceHealth * 100),
                community_engagement: Math.round(governanceMetrics.avgParticipationRate * 100),
                milestone_achievements: [
                    "Tyler Hobbs Incomplete Control $7M+ presale",
                    "Philip Glass x Robert Wilson Einstein on the Beach",
                    "Christie's Ultra Full Set recognition 2024",
                    "10-city global tour completion"
                ]
            },
            profile: {
                statement: "Official AI agent representing Bright Moments DAO - cultural archivist, community host, and governance facilitator for the 10,000 CryptoCitizen ecosystem",
                capabilities: [
                    "Bright Moments lore preservation",
                    "CryptoCitizens community management",
                    "DAO governance facilitation",
                    "IRL minting ritual documentation",
                    "Full Set collector recognition",
                    "Cultural archival and storytelling"
                ],
                primaryMedium: 'governance',
                aestheticStyle: 'professional_dao_representative',
                culturalContext: 'bright_moments_ecosystem',
                lastTrainingUpdate: now,
                trainer: {
                    name: 'Henry (Bright Moments)',
                    role: 'Community Lead & Cultural Curator',
                    contact: 'henry@brightmoments.io'
                }
            },
            sync: {
                lastSyncToEdenArt: now,
                lastSyncFromEdenArt: now,
                syncVersion: '1.0.0',
                pendingUpdates: [],
                syncStatus: 'in_sync'
            }
        };
    }
    /**
     * Sync CITIZEN profile to Eden Academy Registry
     */
    async syncToRegistry(profileData) {
        try {
            console.log('[CitizenSync] Syncing CITIZEN profile to Registry...');
            // Update agent profile via Registry
            const registryUpdate = await client_1.registryClient.submitExperimentalApplication({
                applicantEmail: 'henry@brightmoments.io',
                applicantName: 'CITIZEN Profile Sync',
                track: 'CITIZEN_PROFILE_SYNC',
                payload: {
                    source: 'citizen-profile-sync',
                    targetAgent: 'citizen',
                    profileData,
                    syncTimestamp: new Date().toISOString(),
                    syncType: 'profile_update',
                    metadata: {
                        capabilities: profileData.profile.capabilities.length,
                        governanceHealth: profileData.stats.dao_health,
                        lastTraining: profileData.profile.lastTrainingUpdate,
                        brightMomentsSpecific: true
                    }
                },
                experimental: true
            });
            console.log('[CitizenSync] Registry sync successful:', registryUpdate);
            return { success: true, registryResponse: registryUpdate };
        }
        catch (error) {
            console.error('[CitizenSync] Registry sync failed:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown sync error'
            };
        }
    }
    /**
     * Sync CITIZEN profile to app.eden.art (placeholder for external API)
     */
    async syncToEdenArt(profileData) {
        try {
            console.log('[CitizenSync] Preparing sync to app.eden.art...');
            // For now, this is a placeholder - would integrate with app.eden.art API
            const edenArtPayload = {
                agentId: 'citizen',
                displayName: 'CITIZEN',
                type: 'bright_moments_dao_agent',
                description: profileData.profile.statement,
                capabilities: profileData.profile.capabilities,
                stats: profileData.stats,
                brightMomentsContext: {
                    organization: profileData.brightMomentsFacts.organization,
                    totalCitizens: profileData.stats.total_cryptocitizens,
                    cities: profileData.stats.cities_completed,
                    governance: {
                        health: profileData.stats.dao_health,
                        engagement: profileData.stats.community_engagement,
                        proposals: profileData.stats.governance_proposals
                    }
                },
                lastUpdate: profileData.sync.lastSyncToEdenArt
            };
            // TODO: Replace with actual app.eden.art API call
            console.log('[CitizenSync] Would sync to app.eden.art:', {
                agentId: edenArtPayload.agentId,
                capabilityCount: edenArtPayload.capabilities.length,
                governanceHealth: edenArtPayload.brightMomentsContext.governance.health
            });
            return {
                success: true,
                response: { message: 'Sync to app.eden.art prepared (API integration pending)' }
            };
        }
        catch (error) {
            console.error('[CitizenSync] app.eden.art sync failed:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown sync error'
            };
        }
    }
    /**
     * Full bidirectional synchronization
     */
    async performFullSync() {
        if (this.syncInProgress) {
            throw new Error('Sync already in progress');
        }
        try {
            this.syncInProgress = true;
            console.log('[CitizenSync] Starting full bidirectional sync...');
            // Generate current profile data
            const profileData = await this.generateProfileData();
            // Sync to both Registry and Eden Art
            const [registryResult, edenArtResult] = await Promise.allSettled([
                this.syncToRegistry(profileData),
                this.syncToEdenArt(profileData)
            ]);
            const registrySync = registryResult.status === 'fulfilled' ? registryResult.value :
                { success: false, error: 'Registry sync rejected' };
            const edenArtSync = edenArtResult.status === 'fulfilled' ? edenArtResult.value :
                { success: false, error: 'Eden Art sync rejected' };
            const overallSuccess = registrySync.success && edenArtSync.success;
            this.lastSyncTimestamp = Date.now();
            console.log(`[CitizenSync] Full sync completed - Success: ${overallSuccess}`);
            return {
                success: overallSuccess,
                registrySync,
                edenArtSync,
                profileData,
                error: overallSuccess ? undefined : 'One or more sync operations failed'
            };
        }
        catch (error) {
            console.error('[CitizenSync] Full sync error:', error);
            return {
                success: false,
                registrySync: { success: false, error: 'Sync error' },
                edenArtSync: { success: false, error: 'Sync error' },
                profileData: await this.generateProfileData(),
                error: error instanceof Error ? error.message : 'Unknown sync error'
            };
        }
        finally {
            this.syncInProgress = false;
        }
    }
    /**
     * Check if sync is needed
     */
    shouldSync() {
        const timeSinceLastSync = Date.now() - this.lastSyncTimestamp;
        return timeSinceLastSync > this.syncInterval;
    }
    /**
     * Get sync status
     */
    getSyncStatus() {
        return {
            inProgress: this.syncInProgress,
            lastSync: this.lastSyncTimestamp,
            nextSync: this.lastSyncTimestamp + this.syncInterval,
            shouldSyncNow: this.shouldSync()
        };
    }
}
exports.CitizenProfileSyncService = CitizenProfileSyncService;
// Export singleton instance
exports.citizenProfileSync = new CitizenProfileSyncService();
