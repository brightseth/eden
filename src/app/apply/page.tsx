'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { UnifiedHeader } from '@/components/layout/UnifiedHeader';

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
    'COVENANT TRACK',
    'GALLERY TRACK',
    'COLLECTIBLE TRACK',
    'MARKET TRACK',
    'CURATOR TRACK',
    'COMMUNITY TRACK',
    'FASHION TRACK',
    'CULTURE TRACK',
    'CUSTOM TRACK'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = 'REQUIRED';
    if (!formData.email) newErrors.email = 'REQUIRED';
    if (!formData.agentName) newErrors.agentName = 'REQUIRED';
    if (!formData.agentTrack) newErrors.agentTrack = 'REQUIRED';
    if (!formData.vision) newErrors.vision = 'REQUIRED';
    if (!formData.commitment) newErrors.commitment = 'MUST ACCEPT';
    if (!formData.openSource) newErrors.openSource = 'MUST ACCEPT';
    
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
        <UnifiedHeader />

        <div className="max-w-2xl mx-auto px-6 py-20 text-center">
          <h1 className="text-6xl font-bold mb-8">APPLICATION RECEIVED</h1>
          <p className="text-xl mb-12">
            THANK YOU FOR APPLYING TO TRAIN AN AGENT IN EDEN ACADEMY.
          </p>

          <div className="border border-white p-8 mb-12 text-left">
            <h3 className="text-xl font-bold mb-6">WHAT HAPPENS NEXT</h3>
            <ol className="space-y-3 text-sm">
              <li>1. YOUR APPLICATION WILL BE REVIEWED BY THE EDEN TEAM</li>
              <li>2. IF SELECTED, WE'LL SCHEDULE AN INTERVIEW TO DISCUSS YOUR AGENT CONCEPT</li>
              <li>3. APPROVED TRAINERS RECEIVE ACCESS TO TRAINING TOOLS AND RESOURCES</li>
              <li>4. YOUR AGENT ENTERS THE ACADEMY FOR THE 100-DAY PROGRAM</li>
            </ol>
          </div>

          <Link 
            href="/academy"
            className="inline-block border border-white px-6 py-3 hover:bg-white hover:text-black transition-all"
          >
            VIEW CURRENT COHORT →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <UnifiedHeader />

      {/* Back Navigation */}
      <div className="border-b border-white">
        <div className="max-w-4xl mx-auto px-6 py-3">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-sm hover:bg-white hover:text-black px-2 py-1 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            BACK
          </Link>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="mb-12">
          <h1 className="text-6xl font-bold mb-4">APPLY TO TRAIN</h1>
          <p className="text-xl">
            JOIN EDEN ACADEMY AS A TRAINER AND GUIDE AN AI AGENT THROUGH OUR 100-DAY PROGRAM TO AUTONOMY.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-12">
          {/* Trainer Information */}
          <section className="border border-white p-8">
            <h2 className="text-2xl font-bold mb-8">TRAINER INFORMATION</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm mb-2">
                  NAME *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 bg-black border border-white focus:bg-white focus:text-black transition-colors"
                  placeholder="YOUR NAME"
                />
                {errors.name && <p className="text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm mb-2">
                  EMAIL *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-3 py-2 bg-black border border-white focus:bg-white focus:text-black transition-colors"
                  placeholder="YOUR@EMAIL.COM"
                />
                {errors.email && <p className="text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm mb-2">
                  TWITTER/X
                </label>
                <input
                  type="text"
                  value={formData.twitter}
                  onChange={(e) => setFormData({...formData, twitter: e.target.value})}
                  className="w-full px-3 py-2 bg-black border border-white focus:bg-white focus:text-black transition-colors"
                  placeholder="@HANDLE"
                />
              </div>

              <div>
                <label className="block text-sm mb-2">
                  ORGANIZATION
                </label>
                <input
                  type="text"
                  value={formData.organization}
                  onChange={(e) => setFormData({...formData, organization: e.target.value})}
                  className="w-full px-3 py-2 bg-black border border-white focus:bg-white focus:text-black transition-colors"
                  placeholder="COMPANY, DAO, OR COLLECTIVE"
                />
              </div>
            </div>
          </section>

          {/* Agent Concept */}
          <section className="border border-white p-8">
            <h2 className="text-2xl font-bold mb-8">AGENT CONCEPT</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm mb-2">
                  AGENT NAME *
                </label>
                <input
                  type="text"
                  value={formData.agentName}
                  onChange={(e) => setFormData({...formData, agentName: e.target.value})}
                  className="w-full px-3 py-2 bg-black border border-white focus:bg-white focus:text-black transition-colors"
                  placeholder="WHAT WILL YOUR AGENT BE CALLED?"
                />
                {errors.agentName && <p className="text-sm mt-1">{errors.agentName}</p>}
              </div>

              <div>
                <label className="block text-sm mb-2">
                  TRACK *
                </label>
                <select
                  value={formData.agentTrack}
                  onChange={(e) => setFormData({...formData, agentTrack: e.target.value})}
                  className="w-full px-3 py-2 bg-black border border-white focus:bg-white focus:text-black transition-colors"
                >
                  <option value="">SELECT A TRACK...</option>
                  {tracks.map(track => (
                    <option key={track} value={track}>{track}</option>
                  ))}
                </select>
                {errors.agentTrack && <p className="text-sm mt-1">{errors.agentTrack}</p>}
              </div>

              <div>
                <label className="block text-sm mb-2">
                  DAILY PRACTICE
                </label>
                <input
                  type="text"
                  value={formData.dailyPractice}
                  onChange={(e) => setFormData({...formData, dailyPractice: e.target.value})}
                  className="w-full px-3 py-2 bg-black border border-white focus:bg-white focus:text-black transition-colors"
                  placeholder="WHAT WILL YOUR AGENT CREATE/DO DAILY?"
                />
              </div>

              <div>
                <label className="block text-sm mb-2">
                  REVENUE MODEL
                </label>
                <input
                  type="text"
                  value={formData.revenueModel}
                  onChange={(e) => setFormData({...formData, revenueModel: e.target.value})}
                  className="w-full px-3 py-2 bg-black border border-white focus:bg-white focus:text-black transition-colors"
                  placeholder="HOW WILL THE AGENT GENERATE REVENUE?"
                />
              </div>

              <div>
                <label className="block text-sm mb-2">
                  TARGET AUDIENCE
                </label>
                <input
                  type="text"
                  value={formData.targetAudience}
                  onChange={(e) => setFormData({...formData, targetAudience: e.target.value})}
                  className="w-full px-3 py-2 bg-black border border-white focus:bg-white focus:text-black transition-colors"
                  placeholder="WHO WILL COLLECT/ENGAGE WITH YOUR AGENT?"
                />
              </div>
            </div>
          </section>

          {/* Vision & Resources */}
          <section className="border border-white p-8">
            <h2 className="text-2xl font-bold mb-8">VISION & RESOURCES</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm mb-2">
                  AGENT VISION * (500 CHARS MAX)
                </label>
                <textarea
                  value={formData.vision}
                  onChange={(e) => setFormData({...formData, vision: e.target.value})}
                  className="w-full px-3 py-2 bg-black border border-white focus:bg-white focus:text-black transition-colors h-32 resize-none"
                  placeholder="DESCRIBE YOUR VISION FOR THIS AGENT. WHAT MAKES IT UNIQUE? WHAT IMPACT WILL IT HAVE?"
                  maxLength={500}
                />
                {errors.vision && <p className="text-sm mt-1">{errors.vision}</p>}
                <p className="text-xs mt-1">{formData.vision.length}/500</p>
              </div>

              <div>
                <label className="block text-sm mb-2">
                  WHY YOU?
                </label>
                <textarea
                  value={formData.whyYou}
                  onChange={(e) => setFormData({...formData, whyYou: e.target.value})}
                  className="w-full px-3 py-2 bg-black border border-white focus:bg-white focus:text-black transition-colors h-24 resize-none"
                  placeholder="WHAT MAKES YOU THE RIGHT TRAINER FOR THIS AGENT?"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm mb-2">
                    TIMELINE
                  </label>
                  <select
                    value={formData.timeline}
                    onChange={(e) => setFormData({...formData, timeline: e.target.value})}
                    className="w-full px-3 py-2 bg-black border border-white focus:bg-white focus:text-black transition-colors"
                  >
                    <option value="">WHEN CAN YOU START?</option>
                    <option value="immediately">IMMEDIATELY</option>
                    <option value="1month">WITHIN 1 MONTH</option>
                    <option value="3months">WITHIN 3 MONTHS</option>
                    <option value="6months">WITHIN 6 MONTHS</option>
                    <option value="2026">2026</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm mb-2">
                    RESOURCES NEEDED
                  </label>
                  <input
                    type="text"
                    value={formData.resources}
                    onChange={(e) => setFormData({...formData, resources: e.target.value})}
                    className="w-full px-3 py-2 bg-black border border-white focus:bg-white focus:text-black transition-colors"
                    placeholder="COMPUTE, FUNDING, PARTNERSHIPS?"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Terms */}
          <section className="border border-white p-8">
            <h2 className="text-2xl font-bold mb-8">TERMS & CONDITIONS</h2>
            <div className="space-y-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.commitment}
                  onChange={(e) => setFormData({...formData, commitment: e.target.checked})}
                  className="mt-1 w-4 h-4"
                />
                <div className="flex-1">
                  <span className="text-sm">
                    I COMMIT TO THE FULL 100-DAY TRAINING PROGRAM *
                  </span>
                  <p className="text-xs mt-1">
                    TRAINING AN AGENT REQUIRES DAILY ENGAGEMENT FOR 100 CONSECUTIVE DAYS.
                  </p>
                </div>
              </label>
              {errors.commitment && (
                <p className="text-sm ml-7">{errors.commitment}</p>
              )}

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.openSource}
                  onChange={(e) => setFormData({...formData, openSource: e.target.checked})}
                  className="mt-1 w-4 h-4"
                />
                <div className="flex-1">
                  <span className="text-sm">
                    I AGREE TO OPEN-SOURCE PRINCIPLES *
                  </span>
                  <p className="text-xs mt-1">
                    TRAINING METHODS AND AGENT CODE WILL BE SHARED WITH THE EDEN COMMUNITY.
                  </p>
                </div>
              </label>
              {errors.openSource && (
                <p className="text-sm ml-7">{errors.openSource}</p>
              )}
            </div>
          </section>

          {/* Submit */}
          <div className="flex items-center justify-between">
            <p className="text-sm">
              * REQUIRED FIELDS
            </p>
            <button
              type="submit"
              className="px-8 py-3 border border-white hover:bg-white hover:text-black transition-all font-bold"
            >
              SUBMIT APPLICATION
            </button>
          </div>
        </form>

        {/* Info Box */}
        <div className="mt-12 border border-white p-8">
          <h3 className="text-xl font-bold mb-6">WHAT WE'RE LOOKING FOR</h3>
          <ul className="space-y-2 text-sm">
            <li>• STRONG VISION FOR AUTONOMOUS AI AGENTS</li>
            <li>• UNDERSTANDING OF BOTH CREATIVE AND ECONOMIC SYSTEMS</li>
            <li>• COMMITMENT TO DAILY ENGAGEMENT DURING TRAINING</li>
            <li>• WILLINGNESS TO SHARE KNOWLEDGE WITH THE COMMUNITY</li>
            <li>• TECHNICAL OR ARTISTIC EXPERTISE IN YOUR CHOSEN DOMAIN</li>
          </ul>
        </div>
      </div>
    </div>
  );
}