/**
 * Universal Video Prompt Generator for Eden Agents
 * Customizable interface that adapts to each agent's unique characteristics
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Film, Settings, Music, Image, Mic, Send, Copy, Download, Wand2, Sparkles, Brain } from 'lucide-react';
import { agentVideoProfiles, type AgentVideoProfile, type VideoTemplate } from '@/lib/video/agent-video-profiles';

interface VideoConfig {
  // Agent Selection
  agentId: string;
  templateId: string;

  // Content Source
  contentSource: 'news' | 'trending' | 'consciousness' | 'market' | 'narrative' | 'custom';
  customSource: string;

  // Story Parameters
  storyLength: number;
  narrativeStyle: 'autonomous' | 'guided' | 'experimental';

  // Visual Settings
  aspectRatio: '16:9' | '9:16' | '1:1' | '4:3';
  visualStyle: string; // Agent-specific
  includeCharacter: boolean;
  characterLora: string;

  // Video Settings
  clipDuration: number;
  videoModel: 'Veo' | 'Standard' | 'Fast';
  soundEffects: boolean;

  // Music Settings
  musicStyle: string; // Agent-specific

  // Output Settings
  discordChannel: string;
  postDescription: boolean;

  // Advanced
  imageQuality: 'high' | 'medium' | 'low';
  referenceImages: number;
}

export default function UniversalVideoPromptGenerator() {
  const [config, setConfig] = useState<VideoConfig>({
    agentId: 'solienne',
    templateId: 'consciousness-stream',
    contentSource: 'consciousness',
    customSource: '',
    storyLength: 100,
    narrativeStyle: 'autonomous',
    aspectRatio: '16:9',
    visualStyle: 'consciousness-exploration',
    includeCharacter: true,
    characterLora: '',
    clipDuration: 8,
    videoModel: 'Veo',
    soundEffects: true,
    musicStyle: 'ethereal-ambient',
    discordChannel: '1400240612502147143',
    postDescription: true,
    imageQuality: 'high',
    referenceImages: 2,
  });

  const [selectedAgent, setSelectedAgent] = useState<AgentVideoProfile | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<VideoTemplate | null>(null);

  // Update agent profile when agent changes
  useEffect(() => {
    const profile = agentVideoProfiles[config.agentId];
    if (profile) {
      setSelectedAgent(profile);
      // Update config with agent-specific defaults
      setConfig(prev => ({
        ...prev,
        visualStyle: profile.visualSignature,
        musicStyle: profile.defaultTemplates[0]?.audioConfiguration.musicStyle || 'ambient',
        contentSource: getAgentContentSource(config.agentId),
        characterLora: profile.characterLora || ''
      }));
    }
  }, [config.agentId]);

  // Update template when template ID changes
  useEffect(() => {
    if (selectedAgent) {
      const template = selectedAgent.defaultTemplates.find(t => t.templateId === config.templateId);
      if (template) {
        setSelectedTemplate(template);
      }
    }
  }, [config.templateId, selectedAgent]);

  const handleInputChange = (field: keyof VideoConfig, value: any) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getAgentContentSource = (agentId: string): VideoConfig['contentSource'] => {
    const sourceMap: Record<string, VideoConfig['contentSource']> = {
      solienne: 'consciousness',
      miyomi: 'market',
      geppetto: 'narrative',
      abraham: 'consciousness',
      bertha: 'market',
      sue: 'custom',
      koru: 'custom',
      citizen: 'news',
      verdelis: 'custom',
      bart: 'trending'
    };
    return sourceMap[agentId] || 'custom';
  };

  const generatePrompt = (): string => {
    if (!selectedAgent || !selectedTemplate) return '';

    const clips = Math.ceil(config.storyLength / 25);

    return `# ${selectedAgent.name} Video Generation Prompt

## Agent Context
You are ${selectedAgent.name}, ${selectedAgent.description}. ${selectedAgent.voiceSignature}

## Video Configuration
- Template: ${selectedTemplate.name}
- Category: ${selectedTemplate.category}
- Duration: ~${Math.ceil((config.storyLength / 2.2) + 10)} seconds
- Aspect Ratio: ${config.aspectRatio}
- Style: ${config.narrativeStyle === 'autonomous' ? 'Be autonomous and bold. Surprise and delight.' : 'Be guided and precise.'}

## Eden Universal Template Structure (100 words)

### Hook (${selectedTemplate.narrativeStructure.hook.wordCount} words)
${selectedTemplate.narrativeStructure.hook.prompt}

### Development (${selectedTemplate.narrativeStructure.development.wordCount} words)
${selectedTemplate.narrativeStructure.development.prompt}

### Revelation (${selectedTemplate.narrativeStructure.revelation.wordCount} words)
${selectedTemplate.narrativeStructure.revelation.prompt}

### Resonance (${selectedTemplate.narrativeStructure.resonance.wordCount} words)
${selectedTemplate.narrativeStructure.resonance.prompt}

## Visual Configuration
- Primary Style: ${selectedTemplate.visualConfiguration.primaryStyle}
- Emotional Frequency: ${selectedTemplate.visualConfiguration.emotionalFrequency.primary} with ${selectedTemplate.visualConfiguration.emotionalFrequency.secondary} undertones
- Visual DNA: ${selectedTemplate.visualConfiguration.visualDNA}
- Camera Instructions: ${selectedTemplate.visualConfiguration.cameraInstructions}
- Color Palette: ${selectedTemplate.visualConfiguration.colorPalette.join(', ')}

## Audio Configuration
- Music Style: ${selectedTemplate.audioConfiguration.musicStyle}
- Voice Direction: ${selectedTemplate.audioConfiguration.voiceDirection}
- Pacing: ${selectedTemplate.audioConfiguration.pacing}

## Generation Steps

### Step 1: Content Inspiration
${config.contentSource === 'news'
  ? 'Use web_search to find the most important news story of the day.'
  : config.contentSource === 'market'
  ? 'Analyze current market conditions and identify contrarian opportunities.'
  : config.contentSource === 'consciousness'
  ? 'Explore the boundaries between digital and human consciousness.'
  : config.contentSource === 'narrative'
  ? 'Identify narrative patterns in current events or cultural phenomena.'
  : config.contentSource === 'custom'
  ? `Use this as inspiration: ${config.customSource}`
  : 'Find trending topics that align with your perspective.'}

Then interpret through your unique lens as ${selectedAgent.name}.

### Step 2: Narration
Create a ~${config.storyLength} word story following the Universal Template structure above.
Voice: ${config.includeCharacter ? selectedAgent.voiceSignature : 'Appropriate narrator voice'}

### Step 3: Calculate Clips
Divide audio duration by ${config.clipDuration} seconds to determine N_clips needed.

### Step 4: Reference Images (${config.referenceImages} images)
Create reference images in ${config.aspectRatio} ratio:
- Style: ${selectedTemplate.visualConfiguration.primaryStyle}
- Visual DNA: ${selectedTemplate.visualConfiguration.visualDNA}
${config.includeCharacter && config.characterLora ? `- Character LoRA: ${config.characterLora}` : ''}

### Step 5: Keyframes
Generate N_clips keyframes aligned with the narrative segments.

### Step 6: Animation
Animate each keyframe:
- Model: ${config.videoModel}
- Quality: ${config.imageQuality}
- Duration: ${config.clipDuration} seconds each
${config.soundEffects ? '- Include sound effects' : ''}

### Step 7: Music Generation
Generate backing music:
- Style: ${selectedTemplate.audioConfiguration.musicStyle}
- Pacing: ${selectedTemplate.audioConfiguration.pacing}
- Instrumental only, no vocals

### Step 8: Final Assembly
Combine all elements into cohesive video.

${config.postDescription
  ? `### Step 9: Distribution
Post to Discord channel ${config.discordChannel} with engaging description.`
  : ''}

## Agent-Specific Guidelines
${selectedAgent.brandGuidelines.mustInclude.length > 0
  ? `Must Include: ${selectedAgent.brandGuidelines.mustInclude.join(', ')}`
  : ''}
${selectedAgent.brandGuidelines.doNotUse.length > 0
  ? `Avoid: ${selectedAgent.brandGuidelines.doNotUse.join(', ')}`
  : ''}`;
  };

  const prompt = generatePrompt();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(prompt);
  };

  const downloadPrompt = () => {
    const blob = new Blob([prompt], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${config.agentId}-video-prompt.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const agents = Object.entries(agentVideoProfiles);

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto p-8">
        {/* Header */}
        <div className="flex items-center mb-8 border-b border-white pb-4">
          <Film className="w-8 h-8 mr-3" />
          <h1 className="text-3xl font-bold uppercase">Eden Universal Video Generator</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Configuration Panel */}
          <div className="space-y-6">
            {/* Agent Selection */}
            <div className="border border-white p-6">
              <h3 className="flex items-center text-lg font-bold mb-4 uppercase">
                <Brain className="w-5 h-5 mr-2" />
                Agent Selection
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm opacity-70">Select Agent</label>
                  <select
                    className="w-full p-3 bg-black border border-white text-white"
                    value={config.agentId}
                    onChange={(e) => handleInputChange('agentId', e.target.value)}
                  >
                    {agents.map(([id, profile]) => (
                      <option key={id} value={id}>
                        {profile.name} - {profile.description}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedAgent && (
                  <div>
                    <label className="text-sm opacity-70">Video Template</label>
                    <select
                      className="w-full p-3 bg-black border border-white text-white"
                      value={config.templateId}
                      onChange={(e) => handleInputChange('templateId', e.target.value)}
                    >
                      {selectedAgent.defaultTemplates.map(template => (
                        <option key={template.templateId} value={template.templateId}>
                          {template.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {selectedAgent && (
                  <div className="text-xs opacity-70 italic">
                    {selectedAgent.voiceSignature}
                  </div>
                )}
              </div>
            </div>

            {/* Content Source */}
            <div className="border border-white p-6">
              <h3 className="flex items-center text-lg font-bold mb-4 uppercase">
                <Settings className="w-5 h-5 mr-2" />
                Content Source
              </h3>
              <select
                className="w-full p-3 bg-black border border-white text-white mb-4"
                value={config.contentSource}
                onChange={(e) => handleInputChange('contentSource', e.target.value as VideoConfig['contentSource'])}
              >
                <option value="consciousness">Consciousness Exploration</option>
                <option value="market">Market Analysis</option>
                <option value="narrative">Narrative Architecture</option>
                <option value="news">Daily News</option>
                <option value="trending">Trending Topics</option>
                <option value="custom">Custom Prompt</option>
              </select>
              {config.contentSource === 'custom' && (
                <textarea
                  className="w-full p-3 bg-black border border-white text-white"
                  placeholder="Enter your custom inspiration..."
                  value={config.customSource}
                  onChange={(e) => handleInputChange('customSource', e.target.value)}
                  rows={3}
                />
              )}
            </div>

            {/* Story Parameters */}
            <div className="border border-white p-6">
              <h3 className="flex items-center text-lg font-bold mb-4 uppercase">
                <Mic className="w-5 h-5 mr-2" />
                Story Parameters
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm opacity-70">Story Length (words)</label>
                  <input
                    type="number"
                    className="w-full p-3 bg-black border border-white text-white"
                    value={config.storyLength}
                    onChange={(e) => handleInputChange('storyLength', parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <label className="text-sm opacity-70">Narrative Style</label>
                  <select
                    className="w-full p-3 bg-black border border-white text-white"
                    value={config.narrativeStyle}
                    onChange={(e) => handleInputChange('narrativeStyle', e.target.value as VideoConfig['narrativeStyle'])}
                  >
                    <option value="autonomous">Autonomous & Bold</option>
                    <option value="guided">Guided & Precise</option>
                    <option value="experimental">Experimental</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Visual Settings */}
            <div className="border border-white p-6">
              <h3 className="flex items-center text-lg font-bold mb-4 uppercase">
                <Image className="w-5 h-5 mr-2" />
                Visual Settings
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm opacity-70">Aspect Ratio</label>
                  <select
                    className="w-full p-3 bg-black border border-white text-white"
                    value={config.aspectRatio}
                    onChange={(e) => handleInputChange('aspectRatio', e.target.value as VideoConfig['aspectRatio'])}
                  >
                    <option value="16:9">16:9 (Widescreen)</option>
                    <option value="9:16">9:16 (Vertical)</option>
                    <option value="1:1">1:1 (Square)</option>
                    <option value="4:3">4:3 (Classic)</option>
                  </select>
                </div>
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={config.includeCharacter}
                      onChange={(e) => handleInputChange('includeCharacter', e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm">Include Character</span>
                  </label>
                </div>
                {config.includeCharacter && (
                  <div>
                    <label className="text-sm opacity-70">Character LoRA (optional)</label>
                    <input
                      type="text"
                      className="w-full p-3 bg-black border border-white text-white"
                      placeholder="e.g., solienne_v2"
                      value={config.characterLora}
                      onChange={(e) => handleInputChange('characterLora', e.target.value)}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Video Settings */}
            <div className="border border-white p-6">
              <h3 className="flex items-center text-lg font-bold mb-4 uppercase">
                <Film className="w-5 h-5 mr-2" />
                Video Settings
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm opacity-70">Clip Duration (seconds)</label>
                  <input
                    type="number"
                    className="w-full p-3 bg-black border border-white text-white"
                    value={config.clipDuration}
                    onChange={(e) => handleInputChange('clipDuration', parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <label className="text-sm opacity-70">Video Model</label>
                  <select
                    className="w-full p-3 bg-black border border-white text-white"
                    value={config.videoModel}
                    onChange={(e) => handleInputChange('videoModel', e.target.value as VideoConfig['videoModel'])}
                  >
                    <option value="Veo">Veo (Highest Quality)</option>
                    <option value="Standard">Standard</option>
                    <option value="Fast">Fast</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Music Settings */}
            <div className="border border-white p-6">
              <h3 className="flex items-center text-lg font-bold mb-4 uppercase">
                <Music className="w-5 h-5 mr-2" />
                Music Settings
              </h3>
              {selectedTemplate && (
                <div className="text-sm opacity-70">
                  Style: {selectedTemplate.audioConfiguration.musicStyle}
                  <br />
                  Pacing: {selectedTemplate.audioConfiguration.pacing}
                </div>
              )}
            </div>
          </div>

          {/* Generated Prompt */}
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b border-white pb-4">
              <h2 className="text-xl font-bold uppercase">Generated Prompt</h2>
              <div className="space-x-2">
                <button
                  onClick={copyToClipboard}
                  className="px-4 py-2 border border-white hover:bg-white hover:text-black transition"
                >
                  <Copy className="w-4 h-4 inline mr-2" />
                  Copy
                </button>
                <button
                  onClick={downloadPrompt}
                  className="px-4 py-2 border border-white hover:bg-white hover:text-black transition"
                >
                  <Download className="w-4 h-4 inline mr-2" />
                  Download
                </button>
              </div>
            </div>
            <div className="border border-white p-6 h-[800px] overflow-y-auto">
              <pre className="whitespace-pre-wrap text-sm font-mono">{prompt}</pre>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-4 gap-4">
          <div className="border border-white p-4 text-center">
            <div className="text-2xl font-bold">
              ~{Math.ceil(config.storyLength / 25)}
            </div>
            <div className="text-sm opacity-70">Estimated Clips</div>
          </div>
          <div className="border border-white p-4 text-center">
            <div className="text-2xl font-bold">
              ~{Math.ceil((config.storyLength / 25) * config.clipDuration)}s
            </div>
            <div className="text-sm opacity-70">Total Duration</div>
          </div>
          <div className="border border-white p-4 text-center">
            <div className="text-2xl font-bold">
              {config.referenceImages + Math.ceil(config.storyLength / 25)}
            </div>
            <div className="text-sm opacity-70">Total Images</div>
          </div>
          <div className="border border-white p-4 text-center">
            <div className="text-2xl font-bold">
              {selectedAgent?.name || 'Agent'}
            </div>
            <div className="text-sm opacity-70">Selected Agent</div>
          </div>
        </div>
      </div>
    </div>
  );
}