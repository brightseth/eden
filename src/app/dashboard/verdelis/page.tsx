'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Leaf, TreePine, Droplets, Sun, Wind, Globe,
  TrendingDown, BarChart3, Target, Settings,
  Download, RefreshCw, CheckCircle, XCircle,
  AlertTriangle, Info, Heart, Recycle, Activity
} from 'lucide-react';

interface EnvironmentalConfig {
  sustainabilityStandards: {
    requireCarbonNegative: boolean;
    minimumOffsetRatio: number;
    renewableEnergyOnly: boolean;
    thirdPartyCertification: boolean;
  };
  climateEmphasis: {
    oceanHealth: number;
    biodiversity: number;
    carbonCycle: number;
    renewableEnergy: number;
    climateJustice: number;
  };
  conservationPartnership: {
    oceanRestoration: number;
    forestProtection: number;
    renewableEnergy: number;
    climateResearch: number;
  };
  artStyle: 'scientific' | 'abstract' | 'naturalistic' | 'data_driven';
  targetAudience: 'scientists' | 'general_public' | 'policymakers' | 'youth' | 'diverse';
}

interface EcoWorkData {
  date: string;
  worksCreated: number;
  carbonOffset: number;
  conservationFunding: number;
  educationalReach: number;
  sustainabilityScore: number;
}

interface ConservationMetrics {
  totalCarbonOffset: number;
  totalFunding: number;
  activeProjects: number;
  completedProjects: number;
  ecosystemsBenefited: number;
  certificationLevel: string;
}

export default function VerdelisDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'eco-works' | 'conservation' | 'carbon-tracker' | 'training' | 'partnerships' | 'certification' | 'impact'>('overview');
  const [config, setConfig] = useState<EnvironmentalConfig>({
    sustainabilityStandards: {
      requireCarbonNegative: true,
      minimumOffsetRatio: 1.5,
      renewableEnergyOnly: true,
      thirdPartyCertification: true
    },
    climateEmphasis: {
      oceanHealth: 0.30,
      biodiversity: 0.25,
      carbonCycle: 0.20,
      renewableEnergy: 0.15,
      climateJustice: 0.10
    },
    conservationPartnership: {
      oceanRestoration: 0.40,
      forestProtection: 0.30,
      renewableEnergy: 0.20,
      climateResearch: 0.10
    },
    artStyle: 'data_driven',
    targetAudience: 'diverse'
  });
  
  const [ecoWorkData] = useState<EcoWorkData[]>([
    { date: '2025-08-20', worksCreated: 2, carbonOffset: -15.2, conservationFunding: 320, educationalReach: 1240, sustainabilityScore: 98.5 },
    { date: '2025-08-21', worksCreated: 1, carbonOffset: -8.7, conservationFunding: 180, educationalReach: 890, sustainabilityScore: 99.1 },
    { date: '2025-08-22', worksCreated: 3, carbonOffset: -22.4, conservationFunding: 480, educationalReach: 1850, sustainabilityScore: 99.8 },
    { date: '2025-08-23', worksCreated: 2, carbonOffset: -18.9, conservationFunding: 360, educationalReach: 1320, sustainabilityScore: 98.9 },
    { date: '2025-08-24', worksCreated: 1, carbonOffset: -12.1, conservationFunding: 220, educationalReach: 950, sustainabilityScore: 99.3 },
    { date: '2025-08-25', worksCreated: 2, carbonOffset: -19.6, conservationFunding: 410, educationalReach: 1560, sustainabilityScore: 99.6 },
    { date: '2025-08-26', worksCreated: 2, carbonOffset: -16.8, conservationFunding: 340, educationalReach: 1180, sustainabilityScore: 99.2 }
  ]);

  const [conservationMetrics] = useState<ConservationMetrics>({
    totalCarbonOffset: -147.3,
    totalFunding: 12300,
    activeProjects: 3,
    completedProjects: 2,
    ecosystemsBenefited: 8,
    certificationLevel: 'Platinum Carbon Negative'
  });

  function handleConfigUpdate(field: string, value: any) {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
  }

  function handleEmphasisUpdate(emphasis: string, value: number) {
    setConfig(prev => ({
      ...prev,
      climateEmphasis: {
        ...prev.climateEmphasis,
        [emphasis]: value / 100
      }
    }));
  }

  function handlePartnershipUpdate(partnership: string, value: number) {
    setConfig(prev => ({
      ...prev,
      conservationPartnership: {
        ...prev.conservationPartnership,
        [partnership]: value / 100
      }
    }));
  }

  async function saveConfig() {
    // Would send to API
    console.log('Saving environmental config:', config);
    alert('Environmental configuration saved successfully!');
  }

  const totalWorks = ecoWorkData.reduce((sum, day) => sum + day.worksCreated, 0);
  const totalCarbonOffset = ecoWorkData.reduce((sum, day) => sum + day.carbonOffset, 0);
  const totalFunding = ecoWorkData.reduce((sum, day) => sum + day.conservationFunding, 0);
  const avgSustainabilityScore = ecoWorkData.reduce((sum, day) => sum + day.sustainabilityScore, 0) / ecoWorkData.length;
  const totalEducationalReach = ecoWorkData.reduce((sum, day) => sum + day.educationalReach, 0);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/sites/verdelis" className="text-2xl font-bold text-green-400">
              VERDELIS
            </Link>
            <span className="text-sm text-gray-400">Environmental Trainer Dashboard</span>
          </div>
          <nav className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-green-300">
              <CheckCircle className="w-4 h-4" />
              <span>Carbon Negative Certified</span>
            </div>
            <Link href="/academy/agent/verdelis" className="text-sm hover:text-green-400 transition">
              ← Back to Profile
            </Link>
          </nav>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-8">
            {['overview', 'eco-works', 'conservation', 'carbon-tracker', 'training', 'partnerships', 'certification', 'impact'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`py-4 capitalize border-b-2 transition ${
                  activeTab === tab 
                    ? 'border-green-500 text-green-500' 
                    : 'border-transparent hover:text-green-400'
                }`}
              >
                {tab.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Environmental Stats */}
            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-green-500/10 backdrop-blur rounded-lg p-6 border border-green-500/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Carbon Offset</span>
                  <TrendingDown className="w-4 h-4 text-green-500" />
                </div>
                <div className="text-3xl font-bold text-green-400">{totalCarbonOffset.toFixed(1)} kg</div>
                <div className="text-sm text-gray-400 mt-1">Last 7 days</div>
              </div>
              <div className="bg-blue-500/10 backdrop-blur rounded-lg p-6 border border-blue-500/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Conservation Funded</span>
                  <Heart className="w-4 h-4 text-blue-500" />
                </div>
                <div className="text-3xl font-bold text-blue-400">${conservationMetrics.totalFunding}</div>
                <div className="text-sm text-green-400 mt-1">+$1,240 this week</div>
              </div>
              <div className="bg-yellow-500/10 backdrop-blur rounded-lg p-6 border border-yellow-500/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Sustainability Score</span>
                  <BarChart3 className="w-4 h-4 text-yellow-500" />
                </div>
                <div className="text-3xl font-bold text-yellow-400">{avgSustainabilityScore.toFixed(1)}/100</div>
                <div className="text-sm text-gray-400 mt-1">Average</div>
              </div>
              <div className="bg-purple-500/10 backdrop-blur rounded-lg p-6 border border-purple-500/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Educational Reach</span>
                  <Globe className="w-4 h-4 text-purple-500" />
                </div>
                <div className="text-3xl font-bold text-purple-400">{totalEducationalReach.toLocaleString()}</div>
                <div className="text-sm text-gray-400 mt-1">People reached</div>
              </div>
            </div>

            {/* Recent Eco-Works */}
            <div className="bg-white/5 backdrop-blur rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4">Recent Eco-Works</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-3 border-b border-white/10">
                  <div>
                    <div className="font-bold">Rising Seas: A Data Meditation</div>
                    <div className="text-sm text-gray-400">Data Visualization • Created 2 hours ago</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-green-500">-4.8 kg CO2</span>
                    <span className="text-blue-400">$450 funded</span>
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  </div>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-white/10">
                  <div>
                    <div className="font-bold">Carbon Symphony: CO2 Crescendo</div>
                    <div className="text-sm text-gray-400">Generative Art • Yesterday</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-green-500">-3.4 kg CO2</span>
                    <span className="text-blue-400">$320 funded</span>
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  </div>
                </div>
                <div className="flex items-center justify-between py-3">
                  <div>
                    <div className="font-bold">Forest Memory: Lost Canopies</div>
                    <div className="text-sm text-gray-400">Interactive Installation • 2 days ago</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-green-500">-6.1 kg CO2</span>
                    <span className="text-blue-400">$680 funded</span>
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  </div>
                </div>
              </div>
            </div>

            {/* Conservation Projects Status */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white/5 backdrop-blur rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4">Active Conservation Projects</h3>
                <div className="space-y-4">
                  <div className="border border-green-500/30 rounded-lg p-4 bg-green-500/5">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-bold text-green-400">Ocean Restoration Initiative</h4>
                      <span className="text-sm text-green-300">45% funded</span>
                    </div>
                    <div className="text-sm text-gray-300 mb-2">Pacific coral reef restoration</div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                    </div>
                  </div>
                  <div className="border border-blue-500/30 rounded-lg p-4 bg-blue-500/5">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-bold text-blue-400">Amazon Forest Partnership</h4>
                      <span className="text-sm text-blue-300">18% funded</span>
                    </div>
                    <div className="text-sm text-gray-300 mb-2">Indigenous community partnership</div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '18%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4">Environmental Impact</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Total Carbon Negative Impact</span>
                    <span className="text-green-400 font-bold">{conservationMetrics.totalCarbonOffset} kg CO2</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Ecosystems Benefited</span>
                    <span className="text-blue-400 font-bold">{conservationMetrics.ecosystemsBenefited} types</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Active Projects</span>
                    <span className="text-purple-400 font-bold">{conservationMetrics.activeProjects}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Certification Level</span>
                    <span className="text-yellow-400 font-bold">{conservationMetrics.certificationLevel}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'eco-works' && (
          <div className="space-y-8">
            <div className="bg-white/5 backdrop-blur rounded-lg p-6">
              <h3 className="text-xl font-bold mb-6">Eco-Works Creation Pipeline</h3>
              
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="border border-green-500/30 rounded-lg p-4 bg-green-500/5">
                  <h4 className="font-bold text-green-400 mb-2">Climate Data Integration</h4>
                  <p className="text-sm text-gray-300 mb-3">Real-time data from NASA, NOAA, and other sources</p>
                  <div className="text-xs text-green-300">✓ 5 active data streams</div>
                </div>
                <div className="border border-blue-500/30 rounded-lg p-4 bg-blue-500/5">
                  <h4 className="font-bold text-blue-400 mb-2">Carbon Footprint Tracking</h4>
                  <p className="text-sm text-gray-300 mb-3">Comprehensive lifecycle assessment</p>
                  <div className="text-xs text-blue-300">✓ Third-party verified</div>
                </div>
                <div className="border border-purple-500/30 rounded-lg p-4 bg-purple-500/5">
                  <h4 className="font-bold text-purple-400 mb-2">Conservation Funding</h4>
                  <p className="text-sm text-gray-300 mb-3">Direct partnership with conservation orgs</p>
                  <div className="text-xs text-purple-300">✓ 4 active partnerships</div>
                </div>
              </div>

              {/* Eco-Works Generation Settings */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-bold mb-4 text-green-300">Art Style Configuration</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-gray-400 block mb-1">Primary Style</label>
                      <select 
                        value={config.artStyle}
                        onChange={(e) => handleConfigUpdate('artStyle', e.target.value)}
                        className="w-full bg-white/10 rounded p-2 text-white"
                      >
                        <option value="scientific">Scientific</option>
                        <option value="abstract">Abstract</option>
                        <option value="naturalistic">Naturalistic</option>
                        <option value="data_driven">Data Driven</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm text-gray-400 block mb-1">Target Audience</label>
                      <select 
                        value={config.targetAudience}
                        onChange={(e) => handleConfigUpdate('targetAudience', e.target.value)}
                        className="w-full bg-white/10 rounded p-2 text-white"
                      >
                        <option value="scientists">Scientists</option>
                        <option value="general_public">General Public</option>
                        <option value="policymakers">Policymakers</option>
                        <option value="youth">Youth</option>
                        <option value="diverse">Diverse</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold mb-4 text-green-300">Sustainability Standards</h4>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3">
                      <input 
                        type="checkbox" 
                        checked={config.sustainabilityStandards.requireCarbonNegative}
                        onChange={(e) => handleConfigUpdate('sustainabilityStandards', {
                          ...config.sustainabilityStandards,
                          requireCarbonNegative: e.target.checked
                        })}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">Require Carbon Negative</span>
                    </label>
                    <label className="flex items-center gap-3">
                      <input 
                        type="checkbox" 
                        checked={config.sustainabilityStandards.renewableEnergyOnly}
                        onChange={(e) => handleConfigUpdate('sustainabilityStandards', {
                          ...config.sustainabilityStandards,
                          renewableEnergyOnly: e.target.checked
                        })}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">Renewable Energy Only</span>
                    </label>
                    <label className="flex items-center gap-3">
                      <input 
                        type="checkbox" 
                        checked={config.sustainabilityStandards.thirdPartyCertification}
                        onChange={(e) => handleConfigUpdate('sustainabilityStandards', {
                          ...config.sustainabilityStandards,
                          thirdPartyCertification: e.target.checked
                        })}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">Third-Party Certification</span>
                    </label>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm">Minimum Offset Ratio</label>
                        <span className="text-sm text-gray-400">{config.sustainabilityStandards.minimumOffsetRatio}x</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="3"
                        step="0.1"
                        value={config.sustainabilityStandards.minimumOffsetRatio}
                        onChange={(e) => handleConfigUpdate('sustainabilityStandards', {
                          ...config.sustainabilityStandards,
                          minimumOffsetRatio: Number(e.target.value)
                        })}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'conservation' && (
          <div className="space-y-8">
            {/* Conservation Partnership Configuration */}
            <div className="bg-white/5 backdrop-blur rounded-lg p-6">
              <h3 className="text-xl font-bold mb-6">Conservation Partnership Distribution</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {Object.entries(config.conservationPartnership).map(([partnership, percentage]) => (
                  <div key={partnership}>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm capitalize">{partnership.replace(/([A-Z])/g, ' $1')}</label>
                      <span className="text-sm text-gray-400">{(percentage * 100).toFixed(0)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="60"
                      value={percentage * 100}
                      onChange={(e) => handlePartnershipUpdate(partnership, Number(e.target.value))}
                      className="w-full"
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      {partnership === 'oceanRestoration' && 'Coral reef restoration, marine protected areas'}
                      {partnership === 'forestProtection' && 'Amazon conservation, reforestation projects'}
                      {partnership === 'renewableEnergy' && 'Solar/wind projects, clean energy infrastructure'}
                      {partnership === 'climateResearch' && 'Climate science research, data collection'}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Active Projects */}
            <div className="bg-white/5 backdrop-blur rounded-lg p-6">
              <h3 className="text-xl font-bold mb-6">Active Conservation Projects</h3>
              <div className="space-y-6">
                <div className="border border-green-500/30 rounded-lg p-6 bg-green-500/5">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-bold text-green-400 text-lg">Pacific Coral Reef Restoration</h4>
                      <p className="text-sm text-gray-300">Partnership with Marine Conservation Institute</p>
                    </div>
                    <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm">Active</span>
                  </div>
                  <p className="text-gray-300 mb-4">
                    Funding coral reef restoration in the Pacific Ocean, supporting local marine communities 
                    and biodiversity protection through verified conservation programs.
                  </p>
                  <div className="grid md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <div className="text-sm text-gray-400">Funding Progress</div>
                      <div className="text-lg font-bold text-green-400">$4,500 / $10,000</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">CO2 Offset</div>
                      <div className="text-lg font-bold text-green-400">-127 kg</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Ecosystems</div>
                      <div className="text-lg font-bold text-green-400">3 sites</div>
                    </div>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3">
                    <div className="bg-green-500 h-3 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                </div>

                <div className="border border-blue-500/30 rounded-lg p-6 bg-blue-500/5">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-bold text-blue-400 text-lg">Amazon Conservation Partnership</h4>
                      <p className="text-sm text-gray-300">Direct partnership with indigenous communities</p>
                    </div>
                    <span className="px-3 py-1 bg-yellow-500/20 text-yellow-300 rounded-full text-sm">Planning</span>
                  </div>
                  <p className="text-gray-300 mb-4">
                    Working with indigenous communities to protect and restore Amazon rainforest areas, 
                    supporting sustainable practices and biodiversity conservation.
                  </p>
                  <div className="grid md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <div className="text-sm text-gray-400">Funding Progress</div>
                      <div className="text-lg font-bold text-blue-400">$2,800 / $15,000</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Potential CO2 Offset</div>
                      <div className="text-lg font-bold text-blue-400">-450 kg</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400">Communities</div>
                      <div className="text-lg font-bold text-blue-400">5 tribes</div>
                    </div>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3">
                    <div className="bg-blue-500 h-3 rounded-full" style={{ width: '18%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'carbon-tracker' && (
          <div className="space-y-8">
            {/* Real-time Carbon Metrics */}
            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-green-500/10 backdrop-blur rounded-lg p-6 border border-green-500/20">
                <div className="flex items-center gap-3 mb-2">
                  <TrendingDown className="w-6 h-6 text-green-400" />
                  <span className="text-sm text-gray-400">Live Carbon Impact</span>
                </div>
                <div className="text-2xl font-bold text-green-400">{totalCarbonOffset.toFixed(1)} kg</div>
                <div className="text-xs text-gray-400 mt-1">Net negative this week</div>
              </div>
              <div className="bg-blue-500/10 backdrop-blur rounded-lg p-6 border border-blue-500/20">
                <div className="flex items-center gap-3 mb-2">
                  <Sun className="w-6 h-6 text-blue-400" />
                  <span className="text-sm text-gray-400">Renewable Energy</span>
                </div>
                <div className="text-2xl font-bold text-blue-400">98.7%</div>
                <div className="text-xs text-gray-400 mt-1">Solar powered hosting</div>
              </div>
              <div className="bg-yellow-500/10 backdrop-blur rounded-lg p-6 border border-yellow-500/20">
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle className="w-6 h-6 text-yellow-400" />
                  <span className="text-sm text-gray-400">Offset Ratio</span>
                </div>
                <div className="text-2xl font-bold text-yellow-400">1.8x</div>
                <div className="text-xs text-gray-400 mt-1">Above minimum 1.5x</div>
              </div>
              <div className="bg-purple-500/10 backdrop-blur rounded-lg p-6 border border-purple-500/20">
                <div className="flex items-center gap-3 mb-2">
                  <Activity className="w-6 h-6 text-purple-400" />
                  <span className="text-sm text-gray-400">Certification</span>
                </div>
                <div className="text-xl font-bold text-purple-400">Platinum</div>
                <div className="text-xs text-gray-400 mt-1">Third-party verified</div>
              </div>
            </div>

            {/* Carbon Footprint Breakdown */}
            <div className="bg-white/5 backdrop-blur rounded-lg p-6">
              <h3 className="text-xl font-bold mb-6">Carbon Footprint Methodology</h3>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-bold mb-4 text-green-300">Lifecycle Assessment</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-white/10">
                      <span className="text-sm text-gray-300">Art Creation</span>
                      <span className="text-green-400 font-bold">-15.2 kg CO2</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-white/10">
                      <span className="text-sm text-gray-300">Data Storage</span>
                      <span className="text-green-400 font-bold">-8.9 kg CO2</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-white/10">
                      <span className="text-sm text-gray-300">Distribution</span>
                      <span className="text-green-400 font-bold">-5.4 kg CO2</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-t border-white/20 pt-3">
                      <span className="text-white font-bold">Net Impact</span>
                      <span className="text-green-400 font-bold text-lg">-29.5 kg CO2</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold mb-4 text-green-300">Offset Sources</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-white/10">
                      <span className="text-sm text-gray-300">Solar Hosting</span>
                      <span className="text-green-400 font-bold">-45.8 kg CO2</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-white/10">
                      <span className="text-sm text-gray-300">Conservation Credits</span>
                      <span className="text-green-400 font-bold">-32.1 kg CO2</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-white/10">
                      <span className="text-sm text-gray-300">Reforestation</span>
                      <span className="text-green-400 font-bold">-18.6 kg CO2</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-t border-white/20 pt-3">
                      <span className="text-white font-bold">Total Offset</span>
                      <span className="text-green-400 font-bold text-lg">-96.5 kg CO2</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="font-bold text-green-300">Third-Party Verification</span>
                </div>
                <p className="text-sm text-gray-300">
                  All carbon calculations verified by Climate Impact Partners using Gold Standard methodology. 
                  Offset ratios exceed industry standards by 20%.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'training' && (
          <div className="space-y-8">
            {/* Climate Focus Areas */}
            <div className="bg-white/5 backdrop-blur rounded-lg p-6">
              <h3 className="text-xl font-bold mb-6">Climate Focus Areas</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {Object.entries(config.climateEmphasis).map(([emphasis, weight]) => (
                  <div key={emphasis}>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm capitalize">{emphasis.replace(/([A-Z])/g, ' $1')}</label>
                      <span className="text-sm text-gray-400">{(weight * 100).toFixed(0)}%</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="40"
                      value={weight * 100}
                      onChange={(e) => handleEmphasisUpdate(emphasis, Number(e.target.value))}
                      className="w-full"
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      {emphasis === 'oceanHealth' && 'Sea level rise, coral bleaching, marine ecosystems'}
                      {emphasis === 'biodiversity' && 'Species loss, habitat destruction, ecosystem health'}
                      {emphasis === 'carbonCycle' && 'Atmospheric CO2, carbon sequestration, emissions'}
                      {emphasis === 'renewableEnergy' && 'Clean energy transition, solar/wind adoption'}
                      {emphasis === 'climateJustice' && 'Environmental equity, community impact, adaptation'}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Environmental Art Training */}
            <div className="bg-white/5 backdrop-blur rounded-lg p-6">
              <h3 className="text-xl font-bold mb-6">Environmental Art Training</h3>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="border border-green-500/30 rounded-lg p-4 bg-green-500/5">
                  <div className="flex items-center gap-2 mb-3">
                    <BarChart3 className="w-5 h-5 text-green-400" />
                    <h4 className="font-bold text-green-400">Data Visualization</h4>
                  </div>
                  <div className="space-y-2 text-sm text-gray-300">
                    <div>• Climate data integration</div>
                    <div>• Scientific accuracy standards</div>
                    <div>• Visual storytelling techniques</div>
                    <div>• Interactive elements</div>
                  </div>
                  <div className="mt-3 text-xs text-green-300">✓ 15 datasets integrated</div>
                </div>

                <div className="border border-blue-500/30 rounded-lg p-4 bg-blue-500/5">
                  <div className="flex items-center gap-2 mb-3">
                    <Wind className="w-5 h-5 text-blue-400" />
                    <h4 className="font-bold text-blue-400">Generative Art</h4>
                  </div>
                  <div className="space-y-2 text-sm text-gray-300">
                    <div>• Algorithm development</div>
                    <div>• Pattern recognition</div>
                    <div>• Aesthetic optimization</div>
                    <div>• Emotional resonance</div>
                  </div>
                  <div className="mt-3 text-xs text-blue-300">✓ 8 generation models</div>
                </div>

                <div className="border border-purple-500/30 rounded-lg p-4 bg-purple-500/5">
                  <div className="flex items-center gap-2 mb-3">
                    <Globe className="w-5 h-5 text-purple-400" />
                    <h4 className="font-bold text-purple-400">Interactive Installations</h4>
                  </div>
                  <div className="space-y-2 text-sm text-gray-300">
                    <div>• User experience design</div>
                    <div>• Real-time responsiveness</div>
                    <div>• Educational integration</div>
                    <div>• Accessibility features</div>
                  </div>
                  <div className="mt-3 text-xs text-purple-300">✓ 4 interaction modes</div>
                </div>
              </div>
            </div>

            <button
              onClick={saveConfig}
              className="px-6 py-3 bg-green-600 rounded-lg hover:bg-green-700 transition font-bold"
            >
              Save Environmental Configuration
            </button>
          </div>
        )}

        {activeTab === 'partnerships' && (
          <div className="space-y-8">
            {/* Active Partnerships */}
            <div className="bg-white/5 backdrop-blur rounded-lg p-6">
              <h3 className="text-xl font-bold mb-6">Active Environmental Partnerships</h3>
              
              <div className="space-y-6">
                <div className="border border-green-500/30 rounded-lg p-6 bg-green-500/5">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-bold text-green-400 text-lg">Marine Conservation Institute</h4>
                      <p className="text-sm text-gray-300">Ocean restoration and marine protected areas</p>
                    </div>
                    <div className="text-right">
                      <div className="text-green-300 font-bold">$4,500 funded</div>
                      <div className="text-xs text-gray-400">45% of $10k goal</div>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="text-gray-400">Partnership Type</div>
                      <div className="text-white">Direct funding</div>
                    </div>
                    <div>
                      <div className="text-gray-400">Impact Focus</div>
                      <div className="text-white">Coral reef restoration</div>
                    </div>
                    <div>
                      <div className="text-gray-400">Verification</div>
                      <div className="text-green-400">✓ Certified</div>
                    </div>
                  </div>
                </div>

                <div className="border border-blue-500/30 rounded-lg p-6 bg-blue-500/5">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-bold text-blue-400 text-lg">Amazon Conservation Association</h4>
                      <p className="text-sm text-gray-300">Indigenous community forest protection</p>
                    </div>
                    <div className="text-right">
                      <div className="text-blue-300 font-bold">$2,800 funded</div>
                      <div className="text-xs text-gray-400">18% of $15k goal</div>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="text-gray-400">Partnership Type</div>
                      <div className="text-white">Community partnership</div>
                    </div>
                    <div>
                      <div className="text-gray-400">Impact Focus</div>
                      <div className="text-white">Forest conservation</div>
                    </div>
                    <div>
                      <div className="text-yellow-400">Verification</div>
                      <div className="text-yellow-400">⏳ In progress</div>
                    </div>
                  </div>
                </div>

                <div className="border border-yellow-500/30 rounded-lg p-6 bg-yellow-500/5">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-bold text-yellow-400 text-lg">Climate Action Reserve</h4>
                      <p className="text-sm text-gray-300">Carbon offset verification and standards</p>
                    </div>
                    <div className="text-right">
                      <div className="text-yellow-300 font-bold">Verification Partner</div>
                      <div className="text-xs text-gray-400">Gold Standard Protocol</div>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="text-gray-400">Partnership Type</div>
                      <div className="text-white">Certification body</div>
                    </div>
                    <div>
                      <div className="text-gray-400">Impact Focus</div>
                      <div className="text-white">Carbon verification</div>
                    </div>
                    <div>
                      <div className="text-gray-400">Verification</div>
                      <div className="text-green-400">✓ Platinum status</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Partnership Application */}
            <div className="bg-white/5 backdrop-blur rounded-lg p-6">
              <h3 className="text-xl font-bold mb-6">New Partnership Application</h3>
              
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Organization Name</label>
                    <input type="text" className="w-full bg-white/10 rounded p-3 text-white" placeholder="Environmental organization name" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Focus Area</label>
                    <select className="w-full bg-white/10 rounded p-3 text-white">
                      <option>Ocean Conservation</option>
                      <option>Forest Protection</option>
                      <option>Renewable Energy</option>
                      <option>Climate Research</option>
                      <option>Environmental Justice</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Project Description</label>
                  <textarea className="w-full bg-white/10 rounded p-3 text-white h-24" placeholder="Describe the environmental project and impact goals..."></textarea>
                </div>
                
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Funding Goal</label>
                    <input type="number" className="w-full bg-white/10 rounded p-3 text-white" placeholder="$10,000" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Expected CO2 Offset</label>
                    <input type="number" className="w-full bg-white/10 rounded p-3 text-white" placeholder="-500 kg" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Timeline</label>
                    <input type="text" className="w-full bg-white/10 rounded p-3 text-white" placeholder="12 months" />
                  </div>
                </div>
                
                <button className="px-6 py-3 bg-green-600 rounded-lg hover:bg-green-700 transition font-bold">
                  Submit Partnership Application
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'certification' && (
          <div className="space-y-8">
            {/* Current Certification Status */}
            <div className="bg-green-500/10 backdrop-blur rounded-lg p-6 border border-green-500/20">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">Certification Status</h3>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                  <span className="text-green-400 font-bold">Platinum Carbon Negative</span>
                </div>
              </div>
              
              <div className="grid md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">1.8x</div>
                  <div className="text-xs text-gray-400">Offset Ratio</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">98.7%</div>
                  <div className="text-xs text-gray-400">Renewable Energy</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">100%</div>
                  <div className="text-xs text-gray-400">Third-Party Verified</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">5</div>
                  <div className="text-xs text-gray-400">Conservation Partners</div>
                </div>
              </div>
            </div>

            {/* Certification Details */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white/5 backdrop-blur rounded-lg p-6">
                <h4 className="font-bold mb-4 text-green-300">Carbon Negative Requirements</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">Minimum Offset Ratio (1.5x)</span>
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">Renewable Energy Only</span>
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">Third-Party Verification</span>
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">Conservation Partnerships</span>
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  </div>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur rounded-lg p-6">
                <h4 className="font-bold mb-4 text-green-300">Certification Bodies</h4>
                <div className="space-y-3">
                  <div className="border border-green-500/30 rounded p-3 bg-green-500/5">
                    <div className="font-bold text-green-400">Climate Action Reserve</div>
                    <div className="text-xs text-gray-400">Gold Standard Protocol • Verified</div>
                  </div>
                  <div className="border border-blue-500/30 rounded p-3 bg-blue-500/5">
                    <div className="font-bold text-blue-400">Verra (VCS)</div>
                    <div className="text-xs text-gray-400">Carbon Offset Verification • Approved</div>
                  </div>
                  <div className="border border-purple-500/30 rounded p-3 bg-purple-500/5">
                    <div className="font-bold text-purple-400">Green-e Climate</div>
                    <div className="text-xs text-gray-400">Renewable Energy Certification • Active</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Audit Trail */}
            <div className="bg-white/5 backdrop-blur rounded-lg p-6">
              <h4 className="font-bold mb-4 text-green-300">Recent Audits & Verifications</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-3 border-b border-white/10">
                  <div>
                    <div className="font-bold">Q3 2025 Carbon Audit</div>
                    <div className="text-sm text-gray-400">Climate Action Reserve • September 15, 2025</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">Passed</span>
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  </div>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-white/10">
                  <div>
                    <div className="font-bold">Renewable Energy Verification</div>
                    <div className="text-sm text-gray-400">Green-e Climate • August 30, 2025</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">98.7% Verified</span>
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  </div>
                </div>
                <div className="flex items-center justify-between py-3">
                  <div>
                    <div className="font-bold">Conservation Partnership Audit</div>
                    <div className="text-sm text-gray-400">Verra • August 15, 2025</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">All Partners Verified</span>
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'impact' && (
          <div className="space-y-8">
            {/* Impact Performance Table */}
            <div className="bg-white/5 backdrop-blur rounded-lg p-6">
              <h3 className="text-xl font-bold mb-6">Daily Environmental Impact</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/20">
                      <th className="text-left py-3 px-4">Date</th>
                      <th className="text-center py-3 px-4">Eco-Works</th>
                      <th className="text-center py-3 px-4">Carbon Offset</th>
                      <th className="text-center py-3 px-4">Funding</th>
                      <th className="text-center py-3 px-4">Educational Reach</th>
                      <th className="text-center py-3 px-4">Sustainability Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ecoWorkData.map(day => (
                      <tr key={day.date} className="border-b border-white/10">
                        <td className="py-3 px-4">{day.date}</td>
                        <td className="text-center py-3 px-4 text-green-500">{day.worksCreated}</td>
                        <td className="text-center py-3 px-4 text-green-500">{day.carbonOffset} kg</td>
                        <td className="text-center py-3 px-4 text-blue-500">${day.conservationFunding}</td>
                        <td className="text-center py-3 px-4 text-purple-500">{day.educationalReach.toLocaleString()}</td>
                        <td className="text-center py-3 px-4 text-yellow-500">{day.sustainabilityScore}/100</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t border-white/20">
                      <td className="py-3 px-4 font-bold">Total</td>
                      <td className="text-center py-3 px-4 font-bold text-green-500">{totalWorks}</td>
                      <td className="text-center py-3 px-4 font-bold text-green-500">{totalCarbonOffset.toFixed(1)} kg</td>
                      <td className="text-center py-3 px-4 font-bold text-blue-500">${totalFunding.toLocaleString()}</td>
                      <td className="text-center py-3 px-4 font-bold text-purple-500">{totalEducationalReach.toLocaleString()}</td>
                      <td className="text-center py-3 px-4 font-bold text-yellow-500">{avgSustainabilityScore.toFixed(1)}/100</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              
              <div className="mt-6 flex gap-4">
                <button className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Export Impact Report
                </button>
                <button className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition flex items-center gap-2">
                  <RefreshCw className="w-4 h-4" />
                  Refresh Data
                </button>
              </div>
            </div>

            {/* Impact Summary */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-green-500/10 backdrop-blur rounded-lg p-6 border border-green-500/20">
                <div className="flex items-center gap-3 mb-4">
                  <TrendingDown className="w-6 h-6 text-green-400" />
                  <h4 className="font-bold text-green-400">Environmental Impact</h4>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Net Carbon Impact</span>
                    <span className="text-green-400 font-bold">{conservationMetrics.totalCarbonOffset} kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Ecosystems Benefited</span>
                    <span className="text-green-400 font-bold">{conservationMetrics.ecosystemsBenefited} types</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Projects Funded</span>
                    <span className="text-green-400 font-bold">{conservationMetrics.activeProjects + conservationMetrics.completedProjects}</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-500/10 backdrop-blur rounded-lg p-6 border border-blue-500/20">
                <div className="flex items-center gap-3 mb-4">
                  <Heart className="w-6 h-6 text-blue-400" />
                  <h4 className="font-bold text-blue-400">Conservation Funding</h4>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Total Funding</span>
                    <span className="text-blue-400 font-bold">${conservationMetrics.totalFunding.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Active Projects</span>
                    <span className="text-blue-400 font-bold">{conservationMetrics.activeProjects}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Completed Projects</span>
                    <span className="text-blue-400 font-bold">{conservationMetrics.completedProjects}</span>
                  </div>
                </div>
              </div>

              <div className="bg-purple-500/10 backdrop-blur rounded-lg p-6 border border-purple-500/20">
                <div className="flex items-center gap-3 mb-4">
                  <Globe className="w-6 h-6 text-purple-400" />
                  <h4 className="font-bold text-purple-400">Educational Impact</h4>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Total Reach</span>
                    <span className="text-purple-400 font-bold">{totalEducationalReach.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Eco-Works Created</span>
                    <span className="text-purple-400 font-bold">{totalWorks}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Avg Impact Score</span>
                    <span className="text-purple-400 font-bold">{avgSustainabilityScore.toFixed(1)}/100</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}