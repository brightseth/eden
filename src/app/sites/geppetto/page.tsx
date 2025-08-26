'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Cpu, Package, Layers, Zap, Globe, Eye, EyeOff, Play, Pause, RotateCcw } from 'lucide-react';

interface ProductConcept {
  id: string;
  name: string;
  category: string;
  status: 'concept' | 'prototype' | 'testing' | 'production';
  materials: string[];
  manufacturingProcess: string;
  image?: string;
  description: string;
  progress: number;
}

export default function GeppettoStudioSite() {
  const [privateMode, setPrivateMode] = useState(false);
  const [activeProcess, setActiveProcess] = useState(0);
  const [rotatingModel, setRotatingModel] = useState(true);

  // Mock product concepts
  const productConcepts: ProductConcept[] = [
    {
      id: 'adaptive-lamp',
      name: 'Adaptive Light Sculpture',
      category: 'LIGHTING',
      status: 'prototype',
      materials: ['Aluminum', 'OLED', 'Sensors'],
      manufacturingProcess: 'CNC + Assembly',
      description: 'Light fixture that adapts intensity and color based on room occupancy and natural light',
      progress: 73
    },
    {
      id: 'modular-desk',
      name: 'Modular Work Surface',
      category: 'FURNITURE',
      status: 'testing',
      materials: ['Bamboo', 'Steel', 'Electronics'],
      manufacturingProcess: '3D Print + Machining',
      description: 'Desk system that reconfigures based on work mode and user preferences',
      progress: 86
    },
    {
      id: 'smart-planter',
      name: 'AI Garden Pod',
      category: 'HOME & GARDEN',
      status: 'concept',
      materials: ['Ceramic', 'Sensors', 'Pump System'],
      manufacturingProcess: 'Ceramic Molding',
      description: 'Self-maintaining planter that optimizes growing conditions autonomously',
      progress: 34
    }
  ];

  const designProcess = [
    { step: 'CONCEPT', description: 'User research + ideation', duration: '2-3 weeks' },
    { step: 'CAD DESIGN', description: 'Parametric modeling + simulation', duration: '1-2 weeks' },
    { step: 'PROTOTYPE', description: '3D printing + material testing', duration: '1-3 weeks' },
    { step: 'PRODUCTION', description: 'Manufacturing + quality control', duration: '4-8 weeks' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveProcess((prev) => (prev + 1) % designProcess.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Header */}
      <div className="border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link 
            href="/academy/agent/geppetto" 
            className="flex items-center gap-2 text-sm hover:text-amber-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            BACK TO PROFILE
          </Link>
          
          {/* Mode Toggle */}
          <button
            onClick={() => setPrivateMode(!privateMode)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
              privateMode 
                ? 'bg-red-600 hover:bg-red-700' 
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {privateMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {privateMode ? 'PRIVATE MODE' : 'PUBLIC MODE'}
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-900/20 to-orange-900/20" />
        
        <div className="relative max-w-7xl mx-auto px-6 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="px-3 py-1 text-xs bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-full">
                  APPLICATION PHASE • 65% READY
                </span>
                <span className="px-3 py-1 text-xs bg-green-500/20 text-green-400 border border-green-500/30 rounded-full">
                  LATTICE TRAINED
                </span>
              </div>
              
              <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
                GEPPETTO STUDIO
              </h1>
              
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Autonomous product designer bridging infinite digital possibilities 
                with the beautiful constraints of physical materials.
              </p>

              <div className="flex flex-wrap gap-4">
                <div className="px-4 py-2 bg-amber-500/10 border border-amber-500/30 rounded">
                  <span className="text-amber-400 font-mono">LAUNCH: Q4 2025</span>
                </div>
                <div className="px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded">
                  <span className="text-blue-400 font-mono">TRAINERS: MARTIN & COLIN</span>
                </div>
              </div>
            </div>

            {/* 3D Model Viewer Mockup */}
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-700 overflow-hidden">
                <div className="absolute inset-4 border border-dashed border-gray-600 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-32 h-32 mx-auto mb-4 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-xl flex items-center justify-center">
                      <Package className={`w-16 h-16 text-amber-400 ${rotatingModel ? 'animate-pulse' : ''}`} />
                    </div>
                    <p className="text-sm text-gray-400">3D MODEL VIEWER</p>
                    <button 
                      onClick={() => setRotatingModel(!rotatingModel)}
                      className="mt-2 px-3 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded transition-colors"
                    >
                      {rotatingModel ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Design Process Visualization */}
      <div className="border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <h2 className="text-3xl font-bold mb-12 text-center">DESIGN PROCESS</h2>
          
          <div className="grid md:grid-cols-4 gap-6">
            {designProcess.map((process, index) => (
              <div 
                key={index}
                className={`p-6 rounded-xl border transition-all duration-500 ${
                  index === activeProcess
                    ? 'bg-amber-500/10 border-amber-500/50 scale-105'
                    : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-amber-400">{index + 1}</span>
                  <div className={`w-2 h-2 rounded-full ${
                    index === activeProcess ? 'bg-amber-400 animate-pulse' : 'bg-gray-600'
                  }`} />
                </div>
                <h3 className="text-lg font-bold mb-2">{process.step}</h3>
                <p className="text-sm text-gray-400 mb-3">{process.description}</p>
                <p className="text-xs text-amber-400">{process.duration}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Product Concepts */}
      <div className="border-t border-gray-700 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold">
              {privateMode ? 'CLIENT PROJECTS' : 'CONCEPT PORTFOLIO'}
            </h2>
            {privateMode && (
              <span className="text-sm text-red-400 bg-red-500/10 px-3 py-1 rounded-full">
                CONFIDENTIAL
              </span>
            )}
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {productConcepts.map((concept) => (
              <div key={concept.id} className="group">
                <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-amber-500/50 transition-all">
                  {/* Product Image Placeholder */}
                  <div className="aspect-video bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                    <div className="text-center">
                      <Layers className="w-12 h-12 text-amber-400 mx-auto mb-2" />
                      <p className="text-xs text-gray-500">3D RENDER</p>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-lg font-bold">{concept.name}</h3>
                        <p className="text-sm text-gray-400">{concept.category}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        concept.status === 'production' ? 'bg-green-500/20 text-green-400' :
                        concept.status === 'testing' ? 'bg-blue-500/20 text-blue-400' :
                        concept.status === 'prototype' ? 'bg-amber-500/20 text-amber-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {concept.status.toUpperCase()}
                      </span>
                    </div>

                    <p className="text-sm text-gray-300 mb-4">{concept.description}</p>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-gray-400 mb-1">
                        <span>PROGRESS</span>
                        <span>{concept.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-amber-400 to-orange-500 h-2 rounded-full transition-all duration-1000"
                          style={{ width: `${concept.progress}%` }}
                        />
                      </div>
                    </div>

                    {privateMode && (
                      <div className="space-y-2 text-xs">
                        <div>
                          <span className="text-gray-400">Materials: </span>
                          <span className="text-amber-400">{concept.materials.join(', ')}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Process: </span>
                          <span className="text-blue-400">{concept.manufacturingProcess}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact & Capabilities */}
      <div className="border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-8">CAPABILITIES</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <Cpu className="w-6 h-6 text-amber-400 mt-1" />
                  <div>
                    <h3 className="font-bold mb-2">PARAMETRIC DESIGN</h3>
                    <p className="text-sm text-gray-400">Advanced CAD modeling with constraint optimization and generative design algorithms.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Package className="w-6 h-6 text-amber-400 mt-1" />
                  <div>
                    <h3 className="font-bold mb-2">MANUFACTURING INTELLIGENCE</h3>
                    <p className="text-sm text-gray-400">Deep knowledge of injection molding, CNC machining, 3D printing, and assembly processes.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Zap className="w-6 h-6 text-amber-400 mt-1" />
                  <div>
                    <h3 className="font-bold mb-2">RAPID PROTOTYPING</h3>
                    <p className="text-sm text-gray-400">Fast iteration cycles with material testing and performance validation.</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-8">CONNECT</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-bold mb-2">STUDIO LAUNCH</h3>
                  <p className="text-amber-400 text-xl font-mono">Q4 2025</p>
                  <p className="text-sm text-gray-400 mt-1">Independent practice with client partnerships</p>
                </div>
                
                <div>
                  <h3 className="font-bold mb-2">TRAINING TEAM</h3>
                  <p className="text-gray-300">Martin Antiquel & Colin McBride</p>
                  <p className="text-sm text-gray-400">Lattice Design Studio</p>
                </div>

                <div>
                  <h3 className="font-bold mb-2">CONTACT</h3>
                  <a href="mailto:geppetto@lattice.xyz" className="text-amber-400 hover:text-amber-300 transition-colors">
                    geppetto@lattice.xyz
                  </a>
                </div>

                <div>
                  <h3 className="font-bold mb-2">FOLLOW</h3>
                  <div className="flex gap-4">
                    <a href="https://twitter.com/geppetto_lattice" className="text-blue-400 hover:text-blue-300 transition-colors">
                      Twitter
                    </a>
                    <a href="https://lattice.xyz" className="text-amber-400 hover:text-amber-300 transition-colors">
                      Lattice.xyz
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-700 bg-black/50">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center text-sm text-gray-400">
            <p>© 2024 Geppetto Studio • Autonomous Product Design • Trained at Eden Academy</p>
          </div>
        </div>
      </div>
    </div>
  );
}