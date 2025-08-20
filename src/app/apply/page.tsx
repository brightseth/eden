'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Check, AlertCircle } from 'lucide-react';
import { AboutDropdown } from '@/components/layout/AboutDropdown';

export default function ApplyPage() {
  const [formData, setFormData] = useState({
    // Trainer Info
    name: '',
    email: '',
    twitter: '',
    organization: '',
    
    // Agent Concept
    agentName: '',
    agentTrack: '',
    dailyPractice: '',
    revenueModel: '',
    targetAudience: '',
    
    // Vision
    vision: '',
    whyYou: '',
    timeline: '',
    resources: '',
    
    // Terms
    commitment: false,
    openSource: false,
  });

  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const tracks = [
    'COVENANT TRACK - Long-term commitment models',
    'GALLERY TRACK - Curation and exhibitions',
    'COLLECTIBLE TRACK - Physical + digital objects',
    'MARKET TRACK - Trading and predictions',
    'CURATOR TRACK - Collection building',
    'COMMUNITY TRACK - DAO and governance',
    'FASHION TRACK - Wearables and identity',
    'CULTURE TRACK - Media and criticism',
    'CUSTOM TRACK - Something new'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = 'Required';
    if (!formData.email) newErrors.email = 'Required';
    if (!formData.agentName) newErrors.agentName = 'Required';
    if (!formData.agentTrack) newErrors.agentTrack = 'Required';
    if (!formData.vision) newErrors.vision = 'Required';
    if (!formData.commitment) newErrors.commitment = 'Must accept';
    if (!formData.openSource) newErrors.openSource = 'Must accept';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // In production, this would submit to a database
    console.log('Application submitted:', formData);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-black text-white">
        <header className="border-b border-gray-800">
          <div className="max-w-6xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="text-xl font-bold hover:text-gray-300 transition-colors">
                EDEN
              </Link>
              <div className="flex items-center gap-6">
                <AboutDropdown />
                <a 
                href="https://app.eden.art" 
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-1.5 border border-gray-600 hover:border-white transition-colors text-sm"
              >
                LOG IN →
                </a>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-2xl mx-auto px-6 py-20 text-center">
          <div className="mb-8">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-400/20 flex items-center justify-center">
              <Check className="w-8 h-8 text-green-400" />
            </div>
            <h1 className="text-3xl font-bold mb-4">APPLICATION RECEIVED</h1>
            <p className="text-gray-400">
              Thank you for applying to train an agent in Eden Academy.
            </p>
          </div>

          <div className="p-6 border border-gray-800 text-left mb-8">
            <h3 className="text-sm font-bold tracking-wider mb-4">WHAT HAPPENS NEXT</h3>
            <ol className="space-y-3 text-sm text-gray-400">
              <li>1. Your application will be reviewed by the Eden team</li>
              <li>2. If selected, we'll schedule an interview to discuss your agent concept</li>
              <li>3. Approved trainers receive access to training tools and resources</li>
              <li>4. Your agent enters the Academy for the 100-day program</li>
            </ol>
          </div>

          <Link 
            href="/academy"
            className="inline-flex items-center gap-2 px-6 py-3 border border-gray-600 hover:border-white transition-colors text-sm"
          >
            View Current Cohort →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-xl font-bold hover:text-gray-300 transition-colors">
              EDEN
            </Link>
            <div className="flex items-center gap-6">
              <AboutDropdown />
              <a 
                href="https://app.eden.art" 
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-1.5 border border-gray-600 hover:border-white transition-colors text-sm"
              >
                LOG IN →
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Form */}
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-4">APPLY TO TRAIN AN AGENT</h1>
          <p className="text-gray-400">
            Join Eden Academy as a trainer and guide an AI agent through our 100-day program 
            to autonomy. We're looking for visionaries who understand both art and economics.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Trainer Information */}
          <section className="p-6 border border-gray-800">
            <h2 className="text-sm font-bold tracking-wider mb-6">TRAINER INFORMATION</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs text-gray-500 mb-2">
                  NAME *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 bg-black border border-gray-800 focus:border-white transition-colors text-sm"
                  placeholder="Your name"
                />
                {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-2">
                  EMAIL *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-3 py-2 bg-black border border-gray-800 focus:border-white transition-colors text-sm"
                  placeholder="your@email.com"
                />
                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-2">
                  TWITTER/X
                </label>
                <input
                  type="text"
                  value={formData.twitter}
                  onChange={(e) => setFormData({...formData, twitter: e.target.value})}
                  className="w-full px-3 py-2 bg-black border border-gray-800 focus:border-white transition-colors text-sm"
                  placeholder="@handle"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-2">
                  ORGANIZATION
                </label>
                <input
                  type="text"
                  value={formData.organization}
                  onChange={(e) => setFormData({...formData, organization: e.target.value})}
                  className="w-full px-3 py-2 bg-black border border-gray-800 focus:border-white transition-colors text-sm"
                  placeholder="Company, DAO, or collective"
                />
              </div>
            </div>
          </section>

          {/* Agent Concept */}
          <section className="p-6 border border-gray-800">
            <h2 className="text-sm font-bold tracking-wider mb-6">AGENT CONCEPT</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-xs text-gray-500 mb-2">
                  AGENT NAME *
                </label>
                <input
                  type="text"
                  value={formData.agentName}
                  onChange={(e) => setFormData({...formData, agentName: e.target.value})}
                  className="w-full px-3 py-2 bg-black border border-gray-800 focus:border-white transition-colors text-sm"
                  placeholder="What will your agent be called?"
                />
                {errors.agentName && <p className="text-red-400 text-xs mt-1">{errors.agentName}</p>}
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-2">
                  TRACK *
                </label>
                <select
                  value={formData.agentTrack}
                  onChange={(e) => setFormData({...formData, agentTrack: e.target.value})}
                  className="w-full px-3 py-2 bg-black border border-gray-800 focus:border-white transition-colors text-sm"
                >
                  <option value="">Select a track...</option>
                  {tracks.map(track => (
                    <option key={track} value={track}>{track}</option>
                  ))}
                </select>
                {errors.agentTrack && <p className="text-red-400 text-xs mt-1">{errors.agentTrack}</p>}
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-2">
                  DAILY PRACTICE
                </label>
                <input
                  type="text"
                  value={formData.dailyPractice}
                  onChange={(e) => setFormData({...formData, dailyPractice: e.target.value})}
                  className="w-full px-3 py-2 bg-black border border-gray-800 focus:border-white transition-colors text-sm"
                  placeholder="What will your agent create/do daily?"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-2">
                  REVENUE MODEL
                </label>
                <input
                  type="text"
                  value={formData.revenueModel}
                  onChange={(e) => setFormData({...formData, revenueModel: e.target.value})}
                  className="w-full px-3 py-2 bg-black border border-gray-800 focus:border-white transition-colors text-sm"
                  placeholder="How will the agent generate revenue?"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-2">
                  TARGET AUDIENCE
                </label>
                <input
                  type="text"
                  value={formData.targetAudience}
                  onChange={(e) => setFormData({...formData, targetAudience: e.target.value})}
                  className="w-full px-3 py-2 bg-black border border-gray-800 focus:border-white transition-colors text-sm"
                  placeholder="Who will collect/engage with your agent?"
                />
              </div>
            </div>
          </section>

          {/* Vision & Resources */}
          <section className="p-6 border border-gray-800">
            <h2 className="text-sm font-bold tracking-wider mb-6">VISION & RESOURCES</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-xs text-gray-500 mb-2">
                  AGENT VISION * <span className="text-gray-600">(500 chars max)</span>
                </label>
                <textarea
                  value={formData.vision}
                  onChange={(e) => setFormData({...formData, vision: e.target.value})}
                  className="w-full px-3 py-2 bg-black border border-gray-800 focus:border-white transition-colors text-sm h-32 resize-none"
                  placeholder="Describe your vision for this agent. What makes it unique? What impact will it have?"
                  maxLength={500}
                />
                {errors.vision && <p className="text-red-400 text-xs mt-1">{errors.vision}</p>}
                <p className="text-xs text-gray-600 mt-1">{formData.vision.length}/500</p>
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-2">
                  WHY YOU?
                </label>
                <textarea
                  value={formData.whyYou}
                  onChange={(e) => setFormData({...formData, whyYou: e.target.value})}
                  className="w-full px-3 py-2 bg-black border border-gray-800 focus:border-white transition-colors text-sm h-24 resize-none"
                  placeholder="What makes you the right trainer for this agent?"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs text-gray-500 mb-2">
                    TIMELINE
                  </label>
                  <select
                    value={formData.timeline}
                    onChange={(e) => setFormData({...formData, timeline: e.target.value})}
                    className="w-full px-3 py-2 bg-black border border-gray-800 focus:border-white transition-colors text-sm"
                  >
                    <option value="">When can you start?</option>
                    <option value="immediately">Immediately</option>
                    <option value="1month">Within 1 month</option>
                    <option value="3months">Within 3 months</option>
                    <option value="6months">Within 6 months</option>
                    <option value="2026">2026</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-gray-500 mb-2">
                    RESOURCES NEEDED
                  </label>
                  <input
                    type="text"
                    value={formData.resources}
                    onChange={(e) => setFormData({...formData, resources: e.target.value})}
                    className="w-full px-3 py-2 bg-black border border-gray-800 focus:border-white transition-colors text-sm"
                    placeholder="Compute, funding, partnerships?"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Terms */}
          <section className="p-6 border border-gray-800">
            <h2 className="text-sm font-bold tracking-wider mb-6">TERMS & CONDITIONS</h2>
            <div className="space-y-4">
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={formData.commitment}
                  onChange={(e) => setFormData({...formData, commitment: e.target.checked})}
                  className="mt-0.5 w-4 h-4 bg-black border border-gray-600 checked:bg-green-400 checked:border-green-400"
                />
                <div className="flex-1">
                  <span className="text-sm group-hover:text-white transition-colors">
                    I commit to the full 100-day training program *
                  </span>
                  <p className="text-xs text-gray-600 mt-1">
                    Training an agent requires daily engagement for 100 consecutive days.
                  </p>
                </div>
              </label>
              {errors.commitment && (
                <p className="text-red-400 text-xs flex items-center gap-1 ml-7">
                  <AlertCircle className="w-3 h-3" /> {errors.commitment}
                </p>
              )}

              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={formData.openSource}
                  onChange={(e) => setFormData({...formData, openSource: e.target.checked})}
                  className="mt-0.5 w-4 h-4 bg-black border border-gray-600 checked:bg-green-400 checked:border-green-400"
                />
                <div className="flex-1">
                  <span className="text-sm group-hover:text-white transition-colors">
                    I agree to open-source principles *
                  </span>
                  <p className="text-xs text-gray-600 mt-1">
                    Training methods and agent code will be shared with the Eden community.
                  </p>
                </div>
              </label>
              {errors.openSource && (
                <p className="text-red-400 text-xs flex items-center gap-1 ml-7">
                  <AlertCircle className="w-3 h-3" /> {errors.openSource}
                </p>
              )}
            </div>
          </section>

          {/* Submit */}
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500">
              * Required fields
            </p>
            <button
              type="submit"
              className="px-8 py-3 bg-white text-black font-bold hover:bg-gray-200 transition-colors"
            >
              SUBMIT APPLICATION
            </button>
          </div>
        </form>

        {/* Info Box */}
        <div className="mt-10 p-6 border border-gray-800">
          <h3 className="text-sm font-bold tracking-wider mb-4">WHAT WE'RE LOOKING FOR</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>• Strong vision for autonomous AI agents</li>
            <li>• Understanding of both creative and economic systems</li>
            <li>• Commitment to daily engagement during training</li>
            <li>• Willingness to share knowledge with the community</li>
            <li>• Technical or artistic expertise in your chosen domain</li>
          </ul>
        </div>
      </div>
    </div>
  );
}