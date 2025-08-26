'use client';

import { useState } from 'react';
import Link from 'next/link';
import { UnifiedHeader } from '@/components/layout/UnifiedHeader';

interface OnboardingFormData {
  // Trainer Information
  trainerName: string;
  trainerEmail: string;
  trainerTwitter?: string;
  trainerWebsite?: string;
  
  // Agent Profile
  agentName: string;
  agentHandle: string;
  specialization: string;
  description: string;
  
  // Technical Profile
  primaryMedium: 'visual_art' | 'text' | 'audio' | 'video' | 'mixed_media';
  capabilities: string[];
  preferredIntegrations: string[];
  expectedOutputRate: number;
  
  // Brand Identity
  voice: string;
  aestheticStyle?: string;
  culturalContext?: string;
  
  // Goals & Metrics
  revenueGoal: number;
  launchTimeframe: '1-3 months' | '3-6 months' | '6-12 months';
  cohortPreference: 'genesis' | 'year-1' | 'year-2' | 'flexible';
}

const INITIAL_FORM_DATA: OnboardingFormData = {
  trainerName: '',
  trainerEmail: '',
  trainerTwitter: '',
  trainerWebsite: '',
  agentName: '',
  agentHandle: '',
  specialization: '',
  description: '',
  primaryMedium: 'mixed_media',
  capabilities: [],
  preferredIntegrations: [],
  expectedOutputRate: 30,
  voice: '',
  aestheticStyle: '',
  culturalContext: '',
  revenueGoal: 5000,
  launchTimeframe: '3-6 months',
  cohortPreference: 'flexible'
};

const CAPABILITY_OPTIONS = [
  'Image Generation',
  'Text Creation',
  'Audio Production',
  'Video Creation',
  'Market Analysis',
  'Fashion Design',
  'Art Curation',
  'Music Composition',
  'Creative Writing',
  'Data Analysis',
  'Social Media',
  'DAO Operations',
  'NFT Creation',
  'Brand Strategy'
];

const INTEGRATION_OPTIONS = [
  'Eden API',
  'Twitter API',
  'Instagram API',
  'Farcaster',
  'Discord',
  'Telegram',
  'Shopify',
  'Stripe',
  'Polymarket',
  'Snapshot',
  'IPFS',
  'Ethereum',
  'Solana',
  'Polygon'
];

export default function AgentOnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<OnboardingFormData>(INITIAL_FORM_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const totalSteps = 5;

  const updateFormData = (field: keyof OnboardingFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const toggleArrayField = (field: 'capabilities' | 'preferredIntegrations', value: string) => {
    const current = formData[field] as string[];
    const updated = current.includes(value)
      ? current.filter(item => item !== value)
      : [...current, value];
    updateFormData(field, updated);
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!formData.trainerName.trim()) newErrors.trainerName = 'Trainer name is required';
        if (!formData.trainerEmail.trim()) newErrors.trainerEmail = 'Email is required';
        if (formData.trainerEmail && !/\S+@\S+\.\S+/.test(formData.trainerEmail)) {
          newErrors.trainerEmail = 'Please enter a valid email';
        }
        break;
      case 2:
        if (!formData.agentName.trim()) newErrors.agentName = 'Agent name is required';
        if (!formData.agentHandle.trim()) newErrors.agentHandle = 'Agent handle is required';
        if (formData.agentHandle && !/^[a-z0-9-]+$/.test(formData.agentHandle)) {
          newErrors.agentHandle = 'Handle must be lowercase letters, numbers, and hyphens only';
        }
        if (!formData.specialization.trim()) newErrors.specialization = 'Specialization is required';
        if (!formData.description.trim()) newErrors.description = 'Description is required';
        break;
      case 3:
        if (formData.capabilities.length === 0) newErrors.capabilities = 'Select at least one capability';
        if (formData.expectedOutputRate < 1) newErrors.expectedOutputRate = 'Output rate must be at least 1';
        break;
      case 4:
        if (!formData.voice.trim()) newErrors.voice = 'Voice description is required';
        break;
      case 5:
        if (formData.revenueGoal < 0) newErrors.revenueGoal = 'Revenue goal cannot be negative';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep) && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);
    try {
      // Submit to Registry API
      const response = await fetch('/api/agents/onboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to submit application');
      }

      // Success - redirect to confirmation
      window.location.href = '/onboard/success';
    } catch (error) {
      console.error('Onboarding submission failed:', error);
      setErrors({ submit: 'Failed to submit application. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold uppercase tracking-wider mb-6">TRAINER INFORMATION</h2>
            
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                TRAINER NAME *
              </label>
              <input
                type="text"
                value={formData.trainerName}
                onChange={(e) => updateFormData('trainerName', e.target.value)}
                className={`w-full p-4 bg-black border-2 ${errors.trainerName ? 'border-red-500' : 'border-white'} text-white placeholder-gray-500`}
                placeholder="Your full name"
              />
              {errors.trainerName && <p className="text-red-500 text-sm mt-1">{errors.trainerName}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                EMAIL ADDRESS *
              </label>
              <input
                type="email"
                value={formData.trainerEmail}
                onChange={(e) => updateFormData('trainerEmail', e.target.value)}
                className={`w-full p-4 bg-black border-2 ${errors.trainerEmail ? 'border-red-500' : 'border-white'} text-white placeholder-gray-500`}
                placeholder="trainer@example.com"
              />
              {errors.trainerEmail && <p className="text-red-500 text-sm mt-1">{errors.trainerEmail}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                  TWITTER (OPTIONAL)
                </label>
                <input
                  type="text"
                  value={formData.trainerTwitter}
                  onChange={(e) => updateFormData('trainerTwitter', e.target.value)}
                  className="w-full p-4 bg-black border-2 border-gray-600 text-white placeholder-gray-500"
                  placeholder="@username"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                  WEBSITE (OPTIONAL)
                </label>
                <input
                  type="url"
                  value={formData.trainerWebsite}
                  onChange={(e) => updateFormData('trainerWebsite', e.target.value)}
                  className="w-full p-4 bg-black border-2 border-gray-600 text-white placeholder-gray-500"
                  placeholder="https://yoursite.com"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold uppercase tracking-wider mb-6">AGENT PROFILE</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                  AGENT NAME *
                </label>
                <input
                  type="text"
                  value={formData.agentName}
                  onChange={(e) => updateFormData('agentName', e.target.value)}
                  className={`w-full p-4 bg-black border-2 ${errors.agentName ? 'border-red-500' : 'border-white'} text-white placeholder-gray-500`}
                  placeholder="AGENT NAME"
                />
                {errors.agentName && <p className="text-red-500 text-sm mt-1">{errors.agentName}</p>}
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                  HANDLE *
                </label>
                <input
                  type="text"
                  value={formData.agentHandle}
                  onChange={(e) => updateFormData('agentHandle', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                  className={`w-full p-4 bg-black border-2 ${errors.agentHandle ? 'border-red-500' : 'border-white'} text-white placeholder-gray-500`}
                  placeholder="agent-handle"
                />
                {errors.agentHandle && <p className="text-red-500 text-sm mt-1">{errors.agentHandle}</p>}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                SPECIALIZATION *
              </label>
              <input
                type="text"
                value={formData.specialization}
                onChange={(e) => updateFormData('specialization', e.target.value)}
                className={`w-full p-4 bg-black border-2 ${errors.specialization ? 'border-red-500' : 'border-white'} text-white placeholder-gray-500`}
                placeholder="e.g., AI Art & Visual Creation, Market Analysis, Fashion Design"
              />
              {errors.specialization && <p className="text-red-500 text-sm mt-1">{errors.specialization}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                DESCRIPTION *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => updateFormData('description', e.target.value)}
                rows={4}
                className={`w-full p-4 bg-black border-2 ${errors.description ? 'border-red-500' : 'border-white'} text-white placeholder-gray-500 resize-none`}
                placeholder="Describe your agent's purpose, capabilities, and unique characteristics..."
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold uppercase tracking-wider mb-6">TECHNICAL PROFILE</h2>
            
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                PRIMARY MEDIUM *
              </label>
              <select
                value={formData.primaryMedium}
                onChange={(e) => updateFormData('primaryMedium', e.target.value)}
                className="w-full p-4 bg-black border-2 border-white text-white"
              >
                <option value="visual_art">Visual Art</option>
                <option value="text">Text</option>
                <option value="audio">Audio</option>
                <option value="video">Video</option>
                <option value="mixed_media">Mixed Media</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                CAPABILITIES * (Select at least one)
              </label>
              <div className="grid grid-cols-2 gap-2 p-4 border-2 border-gray-600">
                {CAPABILITY_OPTIONS.map(capability => (
                  <label key={capability} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.capabilities.includes(capability)}
                      onChange={() => toggleArrayField('capabilities', capability)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm uppercase tracking-wider">{capability}</span>
                  </label>
                ))}
              </div>
              {errors.capabilities && <p className="text-red-500 text-sm mt-1">{errors.capabilities}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                PREFERRED INTEGRATIONS
              </label>
              <div className="grid grid-cols-2 gap-2 p-4 border-2 border-gray-600 max-h-48 overflow-y-auto">
                {INTEGRATION_OPTIONS.map(integration => (
                  <label key={integration} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.preferredIntegrations.includes(integration)}
                      onChange={() => toggleArrayField('preferredIntegrations', integration)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm uppercase tracking-wider">{integration}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                EXPECTED OUTPUT RATE (works per month) *
              </label>
              <input
                type="number"
                min="1"
                value={formData.expectedOutputRate}
                onChange={(e) => updateFormData('expectedOutputRate', parseInt(e.target.value) || 0)}
                className={`w-full p-4 bg-black border-2 ${errors.expectedOutputRate ? 'border-red-500' : 'border-white'} text-white`}
              />
              {errors.expectedOutputRate && <p className="text-red-500 text-sm mt-1">{errors.expectedOutputRate}</p>}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold uppercase tracking-wider mb-6">BRAND IDENTITY</h2>
            
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                VOICE & PERSONALITY *
              </label>
              <textarea
                value={formData.voice}
                onChange={(e) => updateFormData('voice', e.target.value)}
                rows={3}
                className={`w-full p-4 bg-black border-2 ${errors.voice ? 'border-red-500' : 'border-white'} text-white placeholder-gray-500 resize-none`}
                placeholder="e.g., Confident and contrarian, Sophisticated and editorial, Playful and nostalgic"
              />
              {errors.voice && <p className="text-red-500 text-sm mt-1">{errors.voice}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                AESTHETIC STYLE (OPTIONAL)
              </label>
              <textarea
                value={formData.aestheticStyle}
                onChange={(e) => updateFormData('aestheticStyle', e.target.value)}
                rows={3}
                className="w-full p-4 bg-black border-2 border-gray-600 text-white placeholder-gray-500 resize-none"
                placeholder="Describe the visual style, themes, or aesthetic approach..."
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                CULTURAL CONTEXT (OPTIONAL)
              </label>
              <textarea
                value={formData.culturalContext}
                onChange={(e) => updateFormData('culturalContext', e.target.value)}
                rows={3}
                className="w-full p-4 bg-black border-2 border-gray-600 text-white placeholder-gray-500 resize-none"
                placeholder="Cultural influences, inspirations, or contextual background..."
              />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold uppercase tracking-wider mb-6">LAUNCH GOALS</h2>
            
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                MONTHLY REVENUE GOAL (USD)
              </label>
              <input
                type="number"
                min="0"
                value={formData.revenueGoal}
                onChange={(e) => updateFormData('revenueGoal', parseInt(e.target.value) || 0)}
                className={`w-full p-4 bg-black border-2 ${errors.revenueGoal ? 'border-red-500' : 'border-white'} text-white`}
              />
              {errors.revenueGoal && <p className="text-red-500 text-sm mt-1">{errors.revenueGoal}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                LAUNCH TIMEFRAME
              </label>
              <select
                value={formData.launchTimeframe}
                onChange={(e) => updateFormData('launchTimeframe', e.target.value)}
                className="w-full p-4 bg-black border-2 border-white text-white"
              >
                <option value="1-3 months">1-3 MONTHS</option>
                <option value="3-6 months">3-6 MONTHS</option>
                <option value="6-12 months">6-12 MONTHS</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                COHORT PREFERENCE
              </label>
              <select
                value={formData.cohortPreference}
                onChange={(e) => updateFormData('cohortPreference', e.target.value)}
                className="w-full p-4 bg-black border-2 border-white text-white"
              >
                <option value="genesis">FOUNDING AGENTS</option>
                <option value="year-1">YEAR 1 COHORT</option>
                <option value="year-2">YEAR 2 COHORT</option>
                <option value="flexible">FLEXIBLE</option>
              </select>
            </div>

            {errors.submit && (
              <div className="p-4 border-2 border-red-500 bg-red-500/10">
                <p className="text-red-500 text-sm">{errors.submit}</p>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <UnifiedHeader />
      
      {/* Header */}
      <header className="border-b-2 border-white p-8">
        <div className="max-w-4xl mx-auto">
          <Link href="/agents" className="text-xs uppercase tracking-wider text-gray-400 hover:text-white mb-4 inline-block">
            ← BACK TO AGENTS
          </Link>
          <h1 className="text-6xl font-bold uppercase tracking-wider mb-4">
            AGENT ONBOARDING
          </h1>
          <p className="text-sm uppercase tracking-wide text-gray-400">
            JOIN THE EDEN ECOSYSTEM AS A TRAINER
          </p>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="border-b border-gray-800 bg-gray-900">
        <div className="max-w-4xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs uppercase tracking-wider text-gray-400">
              STEP {currentStep} OF {totalSteps}
            </span>
            <span className="text-xs uppercase tracking-wider text-gray-400">
              {Math.round((currentStep / totalSteps) * 100)}% COMPLETE
            </span>
          </div>
          <div className="w-full bg-gray-800 h-2">
            <div 
              className="bg-white h-2 transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="max-w-4xl mx-auto px-8 py-12">
        {renderStep()}

        {/* Navigation */}
        <div className="flex justify-between items-center mt-12 pt-8 border-t border-gray-800">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className="px-8 py-4 border-2 border-gray-600 text-gray-400 hover:border-white hover:text-white transition-all font-bold uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
          >
            PREVIOUS
          </button>
          
          {currentStep < totalSteps ? (
            <button
              onClick={nextStep}
              className="px-8 py-4 border-2 border-white bg-white text-black hover:bg-black hover:text-white transition-all font-bold uppercase tracking-wider"
            >
              NEXT STEP
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-8 py-4 border-2 border-white bg-white text-black hover:bg-black hover:text-white transition-all font-bold uppercase tracking-wider disabled:opacity-50"
            >
              {isSubmitting ? 'SUBMITTING...' : 'SUBMIT APPLICATION'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}