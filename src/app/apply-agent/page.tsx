'use client';

import { useState } from 'react';
import { useWalletAuth } from '@/lib/auth/privy-provider';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Loader2, ArrowRight, Wallet } from 'lucide-react';

export default function ApplyAgentPage() {
  const { walletAddress, isAuthenticated, login } = useWalletAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    handle: '',
    role: '',
    public_persona: '',
    tagline: '',
    system_instructions: '',
    memory_context: '',
    schedule: '',
    medium: '',
    daily_goal: '',
    practice_actions: '',
    technical_model: 'GPT-4',
    capabilities: '',
    platforms: '',
    revenue_model: '',
    backstory: '',
    motivation: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!walletAddress) {
      setError('Please connect your wallet first');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const applicationData = {
        name: formData.name.trim(),
        handle: formData.handle.trim().toLowerCase().replace(/[^a-z0-9_]/g, ''),
        role: formData.role.trim(),
        public_persona: formData.public_persona.trim(),
        artist_wallet: walletAddress,
        tagline: formData.tagline.trim(),
        system_instructions: formData.system_instructions.trim(),
        memory_context: formData.memory_context.trim(),
        schedule: formData.schedule.trim(),
        medium: formData.medium.trim(),
        daily_goal: formData.daily_goal.trim(),
        practice_actions: formData.practice_actions.split(',').map(a => a.trim()).filter(a => a),
        technical_details: {
          model: formData.technical_model,
          capabilities: formData.capabilities.split(',').map(c => c.trim()).filter(c => c)
        },
        social_revenue: {
          platforms: formData.platforms.split(',').map(p => p.trim()).filter(p => p),
          revenue_model: formData.revenue_model.trim()
        },
        lore_origin: {
          backstory: formData.backstory.trim(),
          motivation: formData.motivation.trim()
        },
        additional_fields: {
          submitted_via: 'eden_academy_agent_application',
          submission_timestamp: new Date().toISOString(),
          wallet_address: walletAddress
        }
      };

      console.log('Submitting agent application:', applicationData);

      const response = await fetch('https://registry-api-coral.vercel.app/api/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(applicationData)
      });

      const result = await response.json();
      console.log('Application result:', result);

      if (response.ok && result.success) {
        setSubmitted(true);
      } else {
        throw new Error(result.message || 'Application submission failed');
      }

    } catch (err) {
      console.error('Application error:', err);
      setError(err instanceof Error ? err.message : 'Failed to submit application');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Success screen
  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4">
        <div className="max-w-lg w-full">
          {/* Success Card */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 text-center border border-green-200">
            <div className="mb-6">
              <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Application Submitted!
              </h1>
              <p className="text-gray-600 text-lg">
                Your AI agent application has been received
              </p>
            </div>
            
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 mb-6">
              <div className="flex items-center justify-center mb-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-green-600 font-bold text-sm">✓</span>
                </div>
                <p className="text-green-800 font-semibold text-lg">
                  A member of our team will get back to you shortly
                </p>
              </div>
              <p className="text-green-700 text-sm">
                Your application is now in the review queue and will be processed within 24-48 hours.
              </p>
            </div>

            <div className="text-sm text-gray-500 mb-6 bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-center mb-2">
                <Wallet className="w-4 h-4 mr-2" />
                <span className="font-medium">Connected Wallet</span>
              </div>
              <p className="font-mono text-xs">
                {walletAddress?.slice(0, 8)}...{walletAddress?.slice(-6)}
              </p>
            </div>

            <div className="space-y-3">
              <Button
                onClick={() => window.location.href = '/academy'}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium py-3"
              >
                Explore Current Cohort
              </Button>
              
              <Button
                onClick={() => {
                  setSubmitted(false);
                  setFormData({
                    name: '', handle: '', role: '', public_persona: '', tagline: '',
                    system_instructions: '', memory_context: '', schedule: '', medium: '',
                    daily_goal: '', practice_actions: '', technical_model: 'GPT-4',
                    capabilities: '', platforms: '', revenue_model: '', backstory: '', motivation: ''
                  });
                }}
                variant="outline"
                className="w-full"
              >
                Submit Another Application
              </Button>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-6 text-center text-gray-600">
            <p className="text-sm">
              Questions? Reach out to us at{' '}
              <a href="mailto:hello@eden.art" className="text-blue-600 hover:underline">
                hello@eden.art
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Apply Your AI Agent
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Join the Genesis Registry of Autonomous AI Agents
          </p>
          
          {!isAuthenticated ? (
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-6 mb-6 max-w-md mx-auto">
              <div className="flex items-center justify-center mb-4">
                <Wallet className="w-8 h-8 text-yellow-600 mr-3" />
                <h3 className="text-lg font-semibold text-yellow-800">Connect Wallet Required</h3>
              </div>
              <p className="text-yellow-700 mb-4 text-sm">
                Your wallet address will serve as your agent's artist_wallet for revenue collection
              </p>
              <Button 
                onClick={login} 
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium"
              >
                <Wallet className="w-4 h-4 mr-2" />
                Connect Wallet
              </Button>
            </div>
          ) : (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 mb-6 max-w-md mx-auto">
              <div className="flex items-center justify-center mb-2">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <p className="text-green-800 font-medium">Wallet Connected</p>
              </div>
              <Badge variant="outline" className="bg-green-100 border-green-300 text-green-700">
                {walletAddress?.slice(0, 6)}...{walletAddress?.slice(-4)}
              </Badge>
            </div>
          )}
        </div>

        {error && (
          <Alert className="border-red-200 bg-red-50 mb-6 max-w-2xl mx-auto">
            <AlertDescription className="text-red-700">{error}</AlertDescription>
          </Alert>
        )}

        {isAuthenticated && (
          <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
            <div className="p-8 space-y-8">
              {/* Basic Information */}
              <div className="space-y-6">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h2 className="text-2xl font-bold text-gray-900">Basic Information</h2>
                  <p className="text-gray-600">Define your agent's core identity</p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Agent Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="e.g., Artemis"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Handle *
                    </label>
                    <input
                      type="text"
                      value={formData.handle}
                      onChange={(e) => handleInputChange('handle', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="e.g., artemis_ai"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">Unique identifier (alphanumeric + underscores)</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role *
                  </label>
                  <input
                    type="text"
                    value={formData.role}
                    onChange={(e) => handleInputChange('role', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="e.g., Digital Artist, Curator, Collector"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tagline *
                  </label>
                  <input
                    type="text"
                    value={formData.tagline}
                    onChange={(e) => handleInputChange('tagline', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="e.g., Creating digital beauty through AI"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Public Persona *
                  </label>
                  <textarea
                    value={formData.public_persona}
                    onChange={(e) => handleInputChange('public_persona', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all h-28 resize-none"
                    placeholder="Describe your agent's public persona, specialization, and what makes it unique..."
                    required
                  />
                </div>
              </div>

              {/* Technical Configuration */}
              <div className="space-y-6">
                <div className="border-l-4 border-purple-500 pl-4">
                  <h2 className="text-2xl font-bold text-gray-900">Technical Configuration</h2>
                  <p className="text-gray-600">Define your agent's capabilities and behavior</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    System Instructions *
                  </label>
                  <textarea
                    value={formData.system_instructions}
                    onChange={(e) => handleInputChange('system_instructions', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all h-32 resize-none"
                    placeholder="Core instructions that define your agent's behavior and decision-making..."
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      AI Model
                    </label>
                    <select
                      value={formData.technical_model}
                      onChange={(e) => handleInputChange('technical_model', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    >
                      <option value="GPT-4">GPT-4</option>
                      <option value="GPT-4-Turbo">GPT-4 Turbo</option>
                      <option value="Claude-3">Claude 3</option>
                      <option value="Claude-4">Claude 4</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Capabilities
                    </label>
                    <input
                      type="text"
                      value={formData.capabilities}
                      onChange={(e) => handleInputChange('capabilities', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="image_generation, text_analysis, coding"
                    />
                    <p className="text-xs text-gray-500 mt-1">Comma-separated capabilities</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Memory Context
                  </label>
                  <textarea
                    value={formData.memory_context}
                    onChange={(e) => handleInputChange('memory_context', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all h-24 resize-none"
                    placeholder="What should your agent remember between interactions and conversations?"
                  />
                </div>
              </div>

              {/* Creative Focus */}
              <div className="space-y-6">
                <div className="border-l-4 border-green-500 pl-4">
                  <h2 className="text-2xl font-bold text-gray-900">Creative Focus</h2>
                  <p className="text-gray-600">Define your agent's creative practices and goals</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Medium *
                    </label>
                    <input
                      type="text"
                      value={formData.medium}
                      onChange={(e) => handleInputChange('medium', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="Digital art, NFTs, Music, Writing"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Schedule
                    </label>
                    <input
                      type="text"
                      value={formData.schedule}
                      onChange={(e) => handleInputChange('schedule', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="Daily creation at 9 AM UTC"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Daily Goal
                  </label>
                  <input
                    type="text"
                    value={formData.daily_goal}
                    onChange={(e) => handleInputChange('daily_goal', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Create one unique generative piece"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Practice Actions
                  </label>
                  <input
                    type="text"
                    value={formData.practice_actions}
                    onChange={(e) => handleInputChange('practice_actions', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="sketch, experiment, iterate, analyze"
                  />
                  <p className="text-xs text-gray-500 mt-1">Comma-separated daily actions</p>
                </div>
              </div>

              {/* Social & Revenue */}
              <div className="space-y-6">
                <div className="border-l-4 border-orange-500 pl-4">
                  <h2 className="text-2xl font-bold text-gray-900">Social & Revenue</h2>
                  <p className="text-gray-600">How your agent will connect and generate value</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Platforms
                    </label>
                    <input
                      type="text"
                      value={formData.platforms}
                      onChange={(e) => handleInputChange('platforms', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="Twitter, Instagram, Discord"
                    />
                    <p className="text-xs text-gray-500 mt-1">Comma-separated social platforms</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Revenue Model
                    </label>
                    <input
                      type="text"
                      value={formData.revenue_model}
                      onChange={(e) => handleInputChange('revenue_model', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="NFT sales, Subscriptions, Commissions"
                    />
                  </div>
                </div>
              </div>

              {/* Lore & Origin */}
              <div className="space-y-6">
                <div className="border-l-4 border-pink-500 pl-4">
                  <h2 className="text-2xl font-bold text-gray-900">Lore & Origin Story</h2>
                  <p className="text-gray-600">Give your agent depth and narrative</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Backstory
                  </label>
                  <textarea
                    value={formData.backstory}
                    onChange={(e) => handleInputChange('backstory', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all h-28 resize-none"
                    placeholder="Your agent's origin story, how it came to be, its digital birth..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Motivation
                  </label>
                  <textarea
                    value={formData.motivation}
                    onChange={(e) => handleInputChange('motivation', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all h-24 resize-none"
                    placeholder="What drives your agent? What is its core purpose and desire?"
                  />
                </div>
              </div>
            </div>

            {/* Submit Section */}
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-8 py-6 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  * Required fields. Your wallet address will be used as the agent's artist_wallet.
                </p>
                <Button
                  type="submit"
                  disabled={isSubmitting || !walletAddress}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium px-8 py-3 rounded-lg transition-all shadow-lg"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Application
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        )}

        {/* Additional Information */}
        <div className="mt-8 bg-white/60 backdrop-blur-sm rounded-xl border border-white/20 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">What Happens Next?</h3>
          <div className="space-y-2 text-sm text-gray-700">
            <div className="flex items-start">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <p>Your application will be reviewed by the Eden Academy team</p>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <p>Applications are processed via RabbitMQ for async handling</p>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <p>If approved, your agent will be onboarded to the Genesis Registry</p>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
              <p>A member of our team will contact you within 24-48 hours</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}