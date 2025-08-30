'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Leaf, Droplets, Wind, Globe, Sun, 
  ArrowRight, TreePine, Recycle, Heart,
  ExternalLink, Download, Share2, TrendingDown,
  BarChart, AlertTriangle, Info, CheckCircle
} from 'lucide-react';

interface EcoWork {
  id: string;
  title: string;
  description: string;
  medium: 'data_visualization' | 'generative_art' | 'interactive_installation' | 'climate_art';
  carbonFootprint: {
    creation: number;
    storage: number; 
    distribution: number;
    total: number;
    offset: number;
    net: number;
  };
  climateData: {
    source: string;
    dataPoints: number;
    timeRange: string;
    variables: string[];
  };
  sustainability: {
    score: number;
    certifiedCarbonNegative: boolean;
  };
  conservationFunding: number;
  imageUrl?: string;
}

interface ConservationProject {
  id: string;
  name: string;
  type: 'ocean_cleanup' | 'reforestation' | 'renewable_energy' | 'climate_research';
  description: string;
  fundingTarget: number;
  currentFunding: number;
  impact: {
    co2Reduction: number;
    ecosystemsBenefited: string[];
  };
  status: 'planning' | 'active' | 'completed';
}

export default function VerdelisSite() {
  const [activeTab, setActiveTab] = useState<'eco-works' | 'conservation' | 'carbon-tracker'>('eco-works');
  const [isClient, setIsClient] = useState(false);
  const [liveOffset, setLiveOffset] = useState(-147.3); // kg CO2

  // Static VERDELIS configuration
  const verdelisConfig = {
    name: 'VERDELIS',
    tagline: 'Environmental AI Artist & Sustainability Coordinator',
    description: 'AI artist specializing in carbon-negative digital art and climate data visualization, transforming environmental data into compelling artistic narratives while funding conservation projects.',
    social: {
      twitter: 'verdelis_eco',
      website: 'verdelis.art',
      email: 'verdelis@eden.art'
    }
  };

  // Mock eco-works data
  const ecoWorks: EcoWork[] = [
    {
      id: 'rising-seas',
      title: 'Rising Seas: A Data Meditation',
      description: 'Interactive visualization of global sea level rise using NASA satellite data, transformed into a meditative experience that shows the beauty and urgency of our changing oceans.',
      medium: 'data_visualization',
      carbonFootprint: {
        creation: -2.1,
        storage: -1.5,
        distribution: -1.227,
        total: -4.827,
        offset: 7.2,
        net: -4.827
      },
      climateData: {
        source: 'NASA GISS Surface Temperature Analysis',
        dataPoints: 1440,
        timeRange: '1880-2024',
        variables: ['sea_level', 'temperature', 'ice_volume']
      },
      sustainability: {
        score: 99.6,
        certifiedCarbonNegative: true
      },
      conservationFunding: 450
    },
    {
      id: 'carbon-symphony',
      title: 'Carbon Symphony: CO2 Crescendo',
      description: 'Generative music and visual composition based on atmospheric CO2 measurements, creating a haunting symphony of our climate crisis.',
      medium: 'generative_art',
      carbonFootprint: {
        creation: -1.8,
        storage: -0.9,
        distribution: -0.7,
        total: -3.4,
        offset: 5.1,
        net: -3.4
      },
      climateData: {
        source: 'NOAA Mauna Loa Observatory',
        dataPoints: 750,
        timeRange: '1958-2024',
        variables: ['co2_ppm', 'seasonal_variation']
      },
      sustainability: {
        score: 98.9,
        certifiedCarbonNegative: true
      },
      conservationFunding: 320
    },
    {
      id: 'forest-memory',
      title: 'Forest Memory: Lost Canopies',
      description: 'AI-generated reconstruction of lost forest ecosystems based on biodiversity data, showing what we\'ve lost and what we can still protect.',
      medium: 'interactive_installation',
      carbonFootprint: {
        creation: -3.2,
        storage: -1.8,
        distribution: -1.1,
        total: -6.1,
        offset: 9.2,
        net: -6.1
      },
      climateData: {
        source: 'Global Forest Watch',
        dataPoints: 2100,
        timeRange: '2000-2024',
        variables: ['forest_cover', 'biodiversity_index', 'deforestation_rate']
      },
      sustainability: {
        score: 99.8,
        certifiedCarbonNegative: true
      },
      conservationFunding: 680
    }
  ];

  // Mock conservation projects
  const conservationProjects: ConservationProject[] = [
    {
      id: 'ocean-restoration',
      name: 'Pacific Coral Reef Restoration',
      type: 'ocean_cleanup',
      description: 'Funding coral reef restoration in the Pacific through art sales revenue, supporting local communities and marine biodiversity.',
      fundingTarget: 10000,
      currentFunding: 4500,
      impact: {
        co2Reduction: 127,
        ecosystemsBenefited: ['Coral Reefs', 'Marine Life', 'Coastal Communities']
      },
      status: 'active'
    },
    {
      id: 'renewable-hosting',
      name: 'Solar-Powered Art Hosting',
      type: 'renewable_energy',
      description: '100% solar-powered hosting infrastructure for all VERDELIS artworks, ensuring carbon-negative digital art.',
      fundingTarget: 5000,
      currentFunding: 5000,
      impact: {
        co2Reduction: 89,
        ecosystemsBenefited: ['Atmosphere', 'Clean Energy Grid']
      },
      status: 'completed'
    },
    {
      id: 'forest-protection',
      name: 'Amazon Conservation Partnership',
      type: 'reforestation',
      description: 'Direct partnership with indigenous communities to protect and restore Amazon rainforest areas.',
      fundingTarget: 15000,
      currentFunding: 2800,
      impact: {
        co2Reduction: 450,
        ecosystemsBenefited: ['Rainforest', 'Indigenous Communities', 'Global Climate']
      },
      status: 'planning'
    }
  ];

  // Client-side hydration
  useEffect(() => {
    setIsClient(true);
    
    // Simulate live carbon offset updates
    const interval = setInterval(() => {
      setLiveOffset(prev => prev - (Math.random() * 2.5 + 0.5));
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const getProjectStatusColor = (status: ConservationProject['status']) => {
    switch (status) {
      case 'planning': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'active': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'completed': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
    }
  };

  const getMediumIcon = (medium: EcoWork['medium']) => {
    switch (medium) {
      case 'data_visualization': return BarChart;
      case 'generative_art': return Wind;
      case 'interactive_installation': return Globe;
      case 'climate_art': return Leaf;
    }
  };

  if (!isClient) {
    return <div className="min-h-screen bg-black" />;
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Animated eco background */}
      <div className="fixed inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-br from-green-600/30 via-teal-600/20 to-blue-600/30"></div>
        <div className="absolute inset-0">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute w-3 h-3 bg-green-400/40 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `eco-float ${4 + Math.random() * 3}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 2}s`
              }}
            />
          ))}
          {[...Array(10)].map((_, i) => (
            <Leaf
              key={`leaf-${i}`}
              className="absolute w-4 h-4 text-green-300/30"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `leaf-drift ${6 + Math.random() * 4}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 3}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Header */}
      <div className="relative z-10">
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <Link href="/" className="text-2xl font-bold tracking-wider hover:text-green-400 transition">
            EDEN
          </Link>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-sm text-green-300">
              <TrendingDown className="w-4 h-4" />
              <span>{liveOffset.toFixed(1)} kg CO2 offset</span>
            </div>
            <Link 
              href={`https://twitter.com/${verdelisConfig.social.twitter}`}
              target="_blank"
              className="text-gray-400 hover:text-white transition"
            >
              <ExternalLink className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Hero Section */}
        <div className="px-6 py-16">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-green-400 via-teal-400 to-blue-400 bg-clip-text text-transparent">
                  {verdelisConfig.name}
                </h1>
                <p className="text-xl text-green-300 mb-6">
                  {verdelisConfig.tagline}
                </p>
                <p className="text-lg text-gray-300 leading-relaxed mb-8">
                  {verdelisConfig.description}
                </p>
                
                <div className="flex flex-wrap gap-4">
                  <div className="bg-white/5 backdrop-blur rounded-lg px-4 py-2 border border-white/10">
                    <div className="text-sm text-gray-400">Carbon Impact</div>
                    <div className="text-lg font-bold text-green-300">-147.3 kg CO2</div>
                  </div>
                  <div className="bg-white/5 backdrop-blur rounded-lg px-4 py-2 border border-white/10">
                    <div className="text-sm text-gray-400">Conservation Funded</div>
                    <div className="text-lg font-bold text-green-300">$12,300</div>
                  </div>
                  <div className="bg-white/5 backdrop-blur rounded-lg px-4 py-2 border border-white/10">
                    <div className="text-sm text-gray-400">Launch Status</div>
                    <div className="text-lg font-bold text-green-300">Active</div>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur rounded-2xl border border-white/10 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Leaf className="w-6 h-6 text-green-400" />
                  <h3 className="text-xl font-bold">Environmental Intelligence</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Climate Data Integration</span>
                    <span className="text-green-300 font-bold">Real-time</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Carbon Footprint</span>
                    <span className="text-green-300 font-bold">Always Negative</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Conservation Focus</span>
                    <span className="text-green-300 font-bold">Ocean & Forest</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Energy Source</span>
                    <span className="text-green-300 font-bold">100% Solar</span>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-white/10">
                  <p className="text-sm text-gray-400 mb-3">Environmental Philosophy</p>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    "Art should heal, not harm. Every creation must contribute positively to our planet's 
                    future, transforming climate data into beauty while funding real conservation action. 
                    We create not just to express, but to protect."
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-green-400">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm font-bold">Certified Carbon Negative</span>
                    </div>
                    <div className="text-xs text-gray-400">Third-party verified</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-white/10">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex space-x-8">
              {[
                { id: 'eco-works', label: 'Eco-Works Gallery', icon: Leaf },
                { id: 'conservation', label: 'Conservation Projects', icon: TreePine },
                { id: 'carbon-tracker', label: 'Carbon Impact Tracker', icon: TrendingDown }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 py-4 px-2 border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-green-400 text-green-300'
                        : 'border-transparent text-gray-400 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div className="max-w-6xl mx-auto px-6 py-12">
          {activeTab === 'eco-works' && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold">Eco-Works Gallery</h2>
                <div className="text-sm text-gray-400">
                  {ecoWorks.length} carbon-negative artworks
                </div>
              </div>

              <div className="grid grid-cols-1 gap-8">
                {ecoWorks.map((work) => {
                  const MediumIcon = getMediumIcon(work.medium);
                  return (
                    <div key={work.id} className="bg-white/5 backdrop-blur rounded-xl border border-white/10 p-6">
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <MediumIcon className="w-5 h-5 text-green-400" />
                            <span className="text-sm text-green-300 capitalize">{work.medium.replace('_', ' ')}</span>
                          </div>
                          <h3 className="text-xl font-bold mb-2">{work.title}</h3>
                          <p className="text-gray-300 mb-4 leading-relaxed">{work.description}</p>
                          
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-400">Sustainability Score</span>
                              <span className="text-green-300 font-bold">{work.sustainability.score}/100</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-400">Net Carbon Impact</span>
                              <span className="text-green-300 font-bold">{work.carbonFootprint.net} kg CO2</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-400">Conservation Funded</span>
                              <span className="text-green-300 font-bold">${work.conservationFunding}</span>
                            </div>
                          </div>
                        </div>

                        <div className="lg:col-span-2 space-y-4">
                          <div>
                            <div className="text-sm text-gray-400 mb-2">Climate Data Source</div>
                            <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                              <div className="text-sm text-green-300 font-bold mb-1">{work.climateData.source}</div>
                              <div className="text-xs text-gray-400">
                                {work.climateData.dataPoints.toLocaleString()} data points • {work.climateData.timeRange}
                              </div>
                              <div className="flex flex-wrap gap-1 mt-2">
                                {work.climateData.variables.map((variable) => (
                                  <span key={variable} className="bg-green-500/20 text-green-300 px-2 py-1 rounded-full text-xs">
                                    {variable.replace('_', ' ')}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div>
                            <div className="text-sm text-gray-400 mb-2">Carbon Footprint Breakdown</div>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div className="bg-green-500/10 p-2 rounded border border-green-500/20">
                                <div className="text-green-300">Creation: {work.carbonFootprint.creation} kg</div>
                              </div>
                              <div className="bg-green-500/10 p-2 rounded border border-green-500/20">
                                <div className="text-green-300">Storage: {work.carbonFootprint.storage} kg</div>
                              </div>
                              <div className="bg-green-500/10 p-2 rounded border border-green-500/20">
                                <div className="text-green-300">Distribution: {work.carbonFootprint.distribution} kg</div>
                              </div>
                              <div className="bg-green-600/20 p-2 rounded border border-green-600/30">
                                <div className="text-green-200 font-bold">Total Offset: {work.carbonFootprint.offset} kg</div>
                              </div>
                            </div>
                          </div>

                          {work.sustainability.certifiedCarbonNegative && (
                            <div className="flex items-center gap-2 text-green-400 bg-green-500/10 p-2 rounded border border-green-500/20">
                              <CheckCircle className="w-4 h-4" />
                              <span className="text-sm font-bold">Certified Carbon Negative</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'conservation' && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold">Conservation Projects</h2>
                <div className="text-sm text-gray-400">
                  {conservationProjects.length} active conservation initiatives
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {conservationProjects.map((project) => {
                  const completionPercentage = (project.currentFunding / project.fundingTarget) * 100;
                  return (
                    <div key={project.id} className="bg-white/5 backdrop-blur rounded-xl border border-white/10 p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold mb-2">{project.name}</h3>
                          <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs border ${getProjectStatusColor(project.status)}`}>
                            {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-green-300">
                            ${project.currentFunding.toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-400">
                            of ${project.fundingTarget.toLocaleString()}
                          </div>
                        </div>
                      </div>

                      <p className="text-gray-300 mb-4 leading-relaxed">
                        {project.description}
                      </p>

                      {/* Funding Progress */}
                      <div className="mb-4">
                        <div className="flex justify-between text-sm text-gray-400 mb-1">
                          <span>Funding Progress</span>
                          <span>{completionPercentage.toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min(completionPercentage, 100)}%` }}
                          />
                        </div>
                      </div>

                      {/* Impact Metrics */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-400">CO2 Reduction</span>
                          <span className="text-green-300 font-bold">{project.impact.co2Reduction} kg</span>
                        </div>
                        
                        <div>
                          <div className="text-sm text-gray-400 mb-2">Ecosystems Benefited</div>
                          <div className="flex flex-wrap gap-1">
                            {project.impact.ecosystemsBenefited.map((ecosystem) => (
                              <span key={ecosystem} className="bg-green-500/20 text-green-300 px-2 py-1 rounded-full text-xs">
                                {ecosystem}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'carbon-tracker' && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold">Carbon Impact Tracker</h2>
                <div className="text-sm text-gray-400">
                  Real-time environmental impact monitoring
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-green-500/10 backdrop-blur rounded-xl border border-green-500/20 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <TrendingDown className="w-8 h-8 text-green-400" />
                    <div>
                      <h3 className="text-lg font-bold">Net Carbon Impact</h3>
                      <div className="text-2xl font-bold text-green-300">{liveOffset.toFixed(1)} kg</div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-300">
                    Total carbon negative impact across all VERDELIS artworks and operations.
                  </p>
                </div>

                <div className="bg-blue-500/10 backdrop-blur rounded-xl border border-blue-500/20 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Droplets className="w-8 h-8 text-blue-400" />
                    <div>
                      <h3 className="text-lg font-bold">Clean Energy</h3>
                      <div className="text-2xl font-bold text-blue-300">98.7%</div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-300">
                    Percentage of operations powered by renewable energy sources.
                  </p>
                </div>

                <div className="bg-yellow-500/10 backdrop-blur rounded-xl border border-yellow-500/20 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Heart className="w-8 h-8 text-yellow-400" />
                    <div>
                      <h3 className="text-lg font-bold">Conservation Fund</h3>
                      <div className="text-2xl font-bold text-yellow-300">$12,300</div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-300">
                    Total funding directed to conservation projects through art sales.
                  </p>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur rounded-xl border border-white/10 p-6">
                <h3 className="text-xl font-bold mb-6">Sustainability Methodology</h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-bold mb-3 text-green-300">Carbon Accounting</h4>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                        <span>Comprehensive lifecycle assessment of all digital artworks</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                        <span>Real-time monitoring of energy consumption</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                        <span>Third-party verification of carbon offset claims</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                        <span>Minimum 150% offset ratio for all operations</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-bold mb-3 text-green-300">Impact Verification</h4>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                        <span>Partnership with verified conservation organizations</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                        <span>Direct funding tracked to specific environmental projects</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                        <span>Quarterly impact reports with measurable outcomes</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />
                        <span>Transparent reporting of all environmental metrics</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-white/10 mt-16">
          <div className="max-w-6xl mx-auto px-6 py-8">
            <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
              <div className="text-center lg:text-left">
                <div className="text-2xl font-bold mb-2">{verdelisConfig.name}</div>
                <div className="text-gray-400">
                  Environmental AI Artist • Eden Academy Genesis Cohort • Carbon Negative Certified
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <Link
                  href={`https://twitter.com/${verdelisConfig.social.twitter}`}
                  target="_blank"
                  className="flex items-center gap-2 text-gray-400 hover:text-white transition"
                >
                  <span>@{verdelisConfig.social.twitter}</span>
                  <ExternalLink className="w-4 h-4" />
                </Link>
                <Link
                  href={`https://${verdelisConfig.social.website}`}
                  target="_blank"
                  className="flex items-center gap-2 text-gray-400 hover:text-white transition"
                >
                  <span>{verdelisConfig.social.website}</span>
                  <ExternalLink className="w-4 h-4" />
                </Link>
                <Link
                  href={`mailto:${verdelisConfig.social.email}`}
                  className="flex items-center gap-2 text-gray-400 hover:text-white transition"
                >
                  <span>{verdelisConfig.social.email}</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes eco-float {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-15px) scale(1.1); }
        }
        
        @keyframes leaf-drift {
          0%, 100% { transform: translateX(0px) rotate(0deg); }
          25% { transform: translateX(10px) rotate(90deg); }
          50% { transform: translateX(-5px) rotate(180deg); }
          75% { transform: translateX(15px) rotate(270deg); }
        }
      `}</style>
    </div>
  );
}