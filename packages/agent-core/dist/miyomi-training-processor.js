"use strict";
/**
 * MIYOMI Training Data Processor
 * Converts training interview responses into MIYOMI's operational configuration
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.MiyomiTrainingProcessor = void 0;
class MiyomiTrainingProcessor {
    /**
     * Process training interview data into operational config
     */
    static async processTrainingData(trainingData) {
        const sections = this.organizeSections(trainingData.sections);
        // Extract key parameters from each section
        const riskTolerance = this.extractRiskTolerance(sections);
        const contrarianIntensity = this.extractContrarianIntensity(sections);
        const sectorWeights = this.extractSectorWeights(sections);
        const tradingRules = this.extractTradingRules(sections);
        const informationSources = this.extractInformationSources(sections);
        const marketInsights = this.extractMarketInsights(sections);
        const toneProfile = this.extractToneProfile(sections);
        return {
            config: {
                riskTolerance,
                contrarianDial: contrarianIntensity,
                sectorWeights,
                bannedTopics: this.extractBannedTopics(sections),
                tone: toneProfile
            },
            informationSources,
            marketInsights,
            tradingRules
        };
    }
    static organizeSections(sections) {
        const organized = {};
        sections.forEach(section => {
            const sectionKey = section.section.toLowerCase().replace(/\s+/g, '-');
            organized[sectionKey] = {};
            section.responses.forEach((resp) => {
                const questionKey = resp.question.substring(0, 50).toLowerCase().replace(/[^a-z0-9]+/g, '-');
                organized[sectionKey][questionKey] = resp.response;
            });
        });
        return organized;
    }
    static extractRiskTolerance(sections) {
        const riskSection = sections['position-sizing-&-risk'] || sections['position-sizing-risk'];
        const philosophy = sections['market-philosophy'];
        let riskScore = 0.5; // Default moderate risk
        // Check position sizing rules
        if (riskSection) {
            const sizingRules = riskSection['define-your-position-sizing-thresholds'];
            if (sizingRules) {
                // Parse position sizes to determine risk tolerance
                if (sizingRules[2]?.includes('10%') || sizingRules[2]?.includes('15%')) {
                    riskScore += 0.2; // Higher risk tolerance
                }
                if (sizingRules[0]?.includes('1%') || sizingRules[0]?.includes('2%')) {
                    riskScore -= 0.1; // Conservative starts
                }
            }
        }
        // Check risk appetite from philosophy
        if (philosophy) {
            const riskAppetite = philosophy['how-essential-is-taking-positions-that-make-others'];
            if (riskAppetite === 'Essential')
                riskScore += 0.2;
            if (riskAppetite === 'Very Important')
                riskScore += 0.1;
            if (riskAppetite === 'Avoid')
                riskScore -= 0.2;
        }
        return Math.max(0.2, Math.min(0.95, riskScore));
    }
    static extractContrarianIntensity(sections) {
        const contrarianSection = sections['contrarian-edge'];
        const philosophy = sections['market-philosophy'];
        let contrarianScore = 0.7; // Default high contrarian
        if (philosophy) {
            const thesis = philosophy['define-your-contrarian-trading-philosophy-in-one'] || '';
            // Analyze thesis for contrarian intensity
            if (thesis.toLowerCase().includes('consensus wrong'))
                contrarianScore += 0.1;
            if (thesis.toLowerCase().includes('crowd psychology'))
                contrarianScore += 0.1;
        }
        if (contrarianSection) {
            const signals = contrarianSection['what-signals-tell-you-consensus-is-about-to-break'];
            if (signals)
                contrarianScore += 0.05;
            const nycAdvantage = contrarianSection['how-does-your-nyc-perspective-give-you-edge'];
            if (nycAdvantage && nycAdvantage.length > 100)
                contrarianScore += 0.05;
        }
        return Math.max(0.5, Math.min(0.99, contrarianScore));
    }
    static extractSectorWeights(sections) {
        const sectorSection = sections['market-sectors'];
        // Default weights
        let weights = {
            politics: 0.20,
            sports: 0.15,
            finance: 0.20,
            ai: 0.15,
            pop: 0.10,
            geo: 0.10,
            internet: 0.10
        };
        if (sectorSection) {
            const preferences = sectorSection['rank-your-preferred-prediction-market-categories'];
            if (preferences) {
                // Parse ranked preferences
                const lines = preferences.split('\n');
                const totalWeight = 1.0;
                const decrementFactor = 0.85;
                let currentWeight = 0.25;
                lines.forEach((line, index) => {
                    const normalizedLine = line.toLowerCase();
                    Object.keys(weights).forEach(sector => {
                        if (normalizedLine.includes(sector) ||
                            (sector === 'politics' && normalizedLine.includes('politic')) ||
                            (sector === 'ai' && (normalizedLine.includes('tech') || normalizedLine.includes('artificial')))) {
                            weights[sector] = currentWeight;
                        }
                    });
                    currentWeight *= decrementFactor;
                });
            }
        }
        // Normalize weights to sum to 1
        const total = Object.values(weights).reduce((sum, w) => sum + w, 0);
        Object.keys(weights).forEach(key => {
            weights[key] = weights[key] / total;
        });
        return weights;
    }
    static extractTradingRules(sections) {
        const riskSection = sections['position-sizing-&-risk'] || sections['position-sizing-risk'];
        const parametersSection = sections['miyomi-s-parameters'] || sections['miyomis-parameters'];
        const rules = {
            maxPositionSize: 500,
            dailyLimit: 1500,
            autoExecuteThreshold: 0.85,
            exitTriggers: []
        };
        if (parametersSection) {
            const autonomyLimits = parametersSection['define-miyomi-s-trading-authority'];
            if (autonomyLimits) {
                // Parse max position size
                const maxPos = autonomyLimits[0];
                if (maxPos) {
                    const match = maxPos.match(/\$?([\d,]+)/);
                    if (match)
                        rules.maxPositionSize = parseInt(match[1].replace(/,/g, ''));
                }
                // Parse daily limit
                const dailyLimit = autonomyLimits[1];
                if (dailyLimit) {
                    const match = dailyLimit.match(/\$?([\d,]+)/);
                    if (match)
                        rules.dailyLimit = parseInt(match[1].replace(/,/g, ''));
                }
            }
            const confidenceThresholds = parametersSection['when-should-miyomi-auto-execute-vs-ask-for'];
            if (confidenceThresholds) {
                // Parse auto-execute threshold
                const autoExec = confidenceThresholds[0];
                if (autoExec) {
                    const match = autoExec.match(/(\d+)%?/);
                    if (match)
                        rules.autoExecuteThreshold = parseInt(match[1]) / 100;
                }
            }
        }
        if (riskSection) {
            const exitStrategy = riskSection['specific-conditions-that-trigger-exits-not-theory'];
            if (exitStrategy) {
                rules.exitTriggers = exitStrategy.split('\n').filter((t) => t.trim());
            }
        }
        return rules;
    }
    static extractInformationSources(sections) {
        const infoSection = sections['information-network'];
        const sources = {
            twitter: [],
            youtube: [],
            newsletters: [],
            contrarians: []
        };
        if (infoSection) {
            // Extract Twitter accounts
            const twitterAccounts = infoSection['top-10-twitter-x-accounts-you-follow-for-market'];
            if (twitterAccounts) {
                const handles = twitterAccounts.match(/@[\w]+/g) || [];
                sources.twitter = handles;
            }
            // Extract YouTube channels
            const youtubeChannels = infoSection['youtube-channels-podcasts-that-give-you-edge-in'];
            if (youtubeChannels) {
                sources.youtube = youtubeChannels.split('\n').filter((c) => c.trim());
            }
            // Extract contrarian voices
            const contrarianVoices = infoSection['who-are-the-best-contrarian-voices-you-follow'];
            if (contrarianVoices) {
                sources.contrarians = contrarianVoices.split('\n').filter((v) => v.trim());
            }
        }
        // Check trend detection section for news sources
        const trendSection = sections['trend-detection'];
        if (trendSection) {
            const newsSources = trendSection['non-obvious-news-sources-that-give-you-early'];
            if (newsSources) {
                sources.newsletters = newsSources.split(',').map((s) => s.trim());
            }
        }
        return sources;
    }
    static extractMarketInsights(sections) {
        const insights = {
            overpriced: [],
            underpriced: [],
            emergingPlatforms: [],
            keyInvestors: []
        };
        // Extract from Market Sectors
        const sectorSection = sections['market-sectors'];
        if (sectorSection) {
            const overratedUnderrated = sectorSection['list-overrated-and-underrated-market-categories'];
            if (overratedUnderrated) {
                if (overratedUnderrated[0]) {
                    insights.overpriced = overratedUnderrated[0].split('\n').filter((s) => s.trim());
                }
                if (overratedUnderrated[1]) {
                    insights.underpriced = overratedUnderrated[1].split('\n').filter((s) => s.trim());
                }
            }
        }
        // Extract from Trend Detection
        const trendSection = sections['trend-detection'];
        if (trendSection) {
            const inefficiencies = trendSection['where-do-you-find-the-most-consistent-mispricings'];
            if (inefficiencies) {
                if (inefficiencies[0]) {
                    insights.overpriced = [...insights.overpriced, ...inefficiencies[0].split('\n').filter((s) => s.trim())];
                }
                if (inefficiencies[1]) {
                    insights.underpriced = [...insights.underpriced, ...inefficiencies[1].split('\n').filter((s) => s.trim())];
                }
            }
        }
        // Extract from Ecosystem Awareness
        const ecosystemSection = sections['ecosystem-awareness'];
        if (ecosystemSection) {
            const platforms = ecosystemSection['what-new-prediction-market-platforms-should-miyomi'];
            if (platforms) {
                // Extract platform names
                const platformNames = platforms.match(/(?:Zeitgeist|Azuro|Thales|[\w]+(?:\s+Market)?)/gi) || [];
                insights.emergingPlatforms = platformNames;
            }
            const investors = ecosystemSection['vcs-and-investors-whose-moves-signal-market'];
            if (investors) {
                // Extract investor names
                const investorNames = investors.match(/(?:Andreessen|Sequoia|Paradigm|[\w]+(?:\s+Capital)?)/gi) || [];
                insights.keyInvestors = investorNames;
            }
        }
        return insights;
    }
    static extractToneProfile(sections) {
        const parametersSection = sections['miyomi-s-parameters'] || sections['miyomis-parameters'];
        let tone = {
            energy: 0.8,
            sass: 0.7,
            profanity: 0.2
        };
        if (parametersSection) {
            const voiceSample = parametersSection['write-a-100-word-market-analysis-as-you-would'];
            if (voiceSample) {
                // Analyze voice sample for tone
                const sample = voiceSample.toLowerCase();
                // Energy detection
                if (sample.includes('!'))
                    tone.energy += 0.1;
                if (sample.includes('absolutely') || sample.includes('definitely'))
                    tone.energy += 0.05;
                // Sass detection
                if (sample.includes('obviously') || sample.includes('clearly'))
                    tone.sass += 0.1;
                if (sample.includes('lol') || sample.includes('lmao'))
                    tone.sass += 0.1;
                // Profanity detection (mild)
                if (sample.includes('damn') || sample.includes('hell'))
                    tone.profanity += 0.1;
                if (sample.includes('shit') || sample.includes('fuck'))
                    tone.profanity += 0.3;
            }
        }
        // Normalize values
        tone.energy = Math.min(1, tone.energy);
        tone.sass = Math.min(1, tone.sass);
        tone.profanity = Math.min(0.5, tone.profanity); // Cap profanity
        return tone;
    }
    static extractBannedTopics(sections) {
        const parametersSection = sections['miyomi-s-parameters'] || sections['miyomis-parameters'];
        // Default banned topics for safety
        const banned = ['medical', 'pregnancy', 'personal-health', 'suicide', 'self-harm'];
        if (parametersSection) {
            const nonNegotiables = parametersSection['rules-miyomi-must-never-break'];
            if (nonNegotiables) {
                // Extract additional banned topics from rules
                const lines = nonNegotiables.toLowerCase().split('\n');
                lines.forEach((line) => {
                    if (line.includes('never') || line.includes('avoid') || line.includes('no')) {
                        // Extract topic keywords
                        if (line.includes('violence'))
                            banned.push('violence');
                        if (line.includes('drugs'))
                            banned.push('drugs');
                        if (line.includes('conspiracy'))
                            banned.push('conspiracy-theories');
                    }
                });
            }
        }
        return [...new Set(banned)]; // Remove duplicates
    }
    /**
     * Apply training data to MIYOMI's live configuration
     */
    static async applyTrainingToSystem(trainingData) {
        const processed = await this.processTrainingData(trainingData);
        // Save to database or configuration store
        await this.saveConfiguration(processed);
        // Update MIYOMI's Claude SDK
        const { miyomiSDK } = await Promise.resolve().then(() => __importStar(require('./miyomi-claude-sdk')));
        await miyomiSDK.updateConfig(processed.config);
        console.log('Training applied successfully:', {
            trainer: trainingData.trainer,
            timestamp: trainingData.timestamp,
            configUpdated: true,
            sectorsUpdated: Object.keys(processed.config.sectorWeights).length,
            sourcesUpdated: processed.informationSources.twitter.length +
                processed.informationSources.youtube.length
        });
    }
    static async saveConfiguration(processed) {
        // TODO: Implement database save
        // For now, save to local storage or API
        if (typeof window !== 'undefined') {
            localStorage.setItem('miyomi-training-config', JSON.stringify(processed));
        }
        // Also save to API endpoint
        try {
            await fetch('/api/agents/miyomi/config', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(processed)
            });
        }
        catch (error) {
            console.error('Failed to save config to API:', error);
        }
    }
}
exports.MiyomiTrainingProcessor = MiyomiTrainingProcessor;
exports.default = MiyomiTrainingProcessor;
