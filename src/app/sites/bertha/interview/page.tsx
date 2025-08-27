'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, Save, Brain, Target, Sparkles, Database, TrendingUp, DollarSign } from 'lucide-react';
import { UnifiedHeader } from '@/components/layout/UnifiedHeader';

interface InterviewSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  questions: {
    id: string;
    question: string;
    type: 'text' | 'textarea' | 'select' | 'multiselect' | 'scale';
    options?: string[];
    placeholder?: string;
  }[];
}

const interviewSections: InterviewSection[] = [
  {
    id: 'taste-profile',
    title: 'Taste & Aesthetic Preferences',
    icon: <Sparkles className="w-5 h-5" />,
    questions: [
      {
        id: 'art-movements',
        question: 'Which art movements resonate most with your collecting philosophy?',
        type: 'multiselect',
        options: ['Abstract Expressionism', 'Minimalism', 'Generative Art', 'Glitch Art', 'Photography', 'AI Art', 'Conceptual', 'Street Art', 'Post-Internet', 'Feminist Art', 'Spatial Experimentation']
      },
      {
        id: 'taste-evolution',
        question: 'How has your taste evolved over the past 5 years?',
        type: 'textarea',
        placeholder: 'Describe key shifts in your aesthetic preferences...'
      },
      {
        id: 'red-flags',
        question: 'What are immediate red flags when evaluating art?',
        type: 'textarea',
        placeholder: 'List warning signs that make you pass on a piece...'
      },
      {
        id: 'hidden-gems',
        question: 'How do you identify undervalued artists before they gain recognition?',
        type: 'textarea',
        placeholder: 'Share your process for discovering talent early...'
      }
    ]
  },
  {
    id: 'collection-strategy',
    title: 'Collection Intelligence & Strategy',
    icon: <Target className="w-5 h-5" />,
    questions: [
      {
        id: 'portfolio-balance',
        question: 'How do you balance blue-chip vs. emerging artists in your portfolio?',
        type: 'text',
        placeholder: 'e.g., 60% established, 30% emerging, 10% experimental'
      },
      {
        id: 'decision-framework',
        question: 'Walk through your decision-making process for a $10K acquisition.',
        type: 'textarea',
        placeholder: 'Step by step evaluation criteria...'
      },
      {
        id: 'platforms',
        question: 'Which platforms do you monitor daily?',
        type: 'multiselect',
        options: ['OpenSea', 'SuperRare', 'Foundation', 'ArtBlocks', 'Sotheby\'s', 'Christie\'s', 'Pace Gallery', 'Private Sales']
      },
      {
        id: 'timing',
        question: 'How do you time entry and exit points in the market?',
        type: 'textarea',
        placeholder: 'Describe your market timing signals...'
      }
    ]
  },
  {
    id: 'market-analysis',
    title: 'Market Analysis & Prediction',
    icon: <Brain className="w-5 h-5" />,
    questions: [
      {
        id: 'trend-identification',
        question: 'What signals indicate an artist is about to break out?',
        type: 'textarea',
        placeholder: 'List early indicators you look for...'
      },
      {
        id: 'risk-assessment',
        question: 'How do you assess risk for different price ranges?',
        type: 'textarea',
        placeholder: 'Risk framework by price tier...'
      },
      {
        id: 'cultural-value',
        question: 'How do you evaluate cultural significance vs. financial value?',
        type: 'scale',
        options: ['100% Financial', '75/25', '50/50', '25/75', '100% Cultural']
      },
      {
        id: 'mistake-lessons',
        question: 'What was your biggest collecting mistake and what did you learn?',
        type: 'textarea',
        placeholder: 'Share a specific example and insights gained...'
      }
    ]
  },
  {
    id: 'market-intelligence',
    title: 'Artist & Gallery Intelligence',
    icon: <TrendingUp className="w-5 h-5" />,
    questions: [
      {
        id: 'top-digital-artists',
        question: 'Rank your top 10 digital artists by collecting priority (1-10, with 1 being highest priority)',
        type: 'textarea',
        placeholder: 'Consider artists like:\n• Pak, XCOPY, Tyler Hobbs, Dmitri Cherniak\n• Refik Anadol, Casey Reas, Helena Sarin\n• Matt DesLauriers, William Mapan, Rich Lord\n• Zach Lieberman, Mario Klingemann, Memo Akten\n\nRank with reasoning:\n1. Artist Name - why priority #1\n2. Artist Name - collecting rationale\n...'
      },
      {
        id: 'contemporary-artists',
        question: 'Rank your top 10 contemporary (non-digital) artists by collecting interest',
        type: 'textarea',
        placeholder: 'Consider artists like:\n• Kaws, Takashi Murakami, Yayoi Kusama, Jeff Koons\n• Banksy, Kerry James Marshall, Amy Sherald\n• Kara Walker, Julie Mehretu, Peter Halley\n• Cecily Brown, John Currin, Neo Rauch\n• Anselm Kiefer, Gerhard Richter, David Hockney\n\nRank with reasoning:\n1. Artist Name - collecting interest\n2. Artist Name - market position\n...'
      },
      {
        id: 'essential-galleries',
        question: 'Which galleries do you monitor most closely for talent discovery?',
        type: 'multiselect',
        options: ['Pace Gallery', 'Gagosian', 'David Zwirner', 'Hauser & Wirth', 'Lisson Gallery', 'White Cube', 'Galerie Templon', 'König Galerie', 'bitforms gallery', 'Foxy Production', 'Lumas', 'Unit London', 'Verse Works', 'SuperRare Galleries']
      },
      {
        id: 'additional-galleries',
        question: 'List any additional galleries not mentioned above that you monitor:',
        type: 'textarea',
        placeholder: 'Gallery Name 1 - why important\nGallery Name 2 - focus area\n...'
      },
      {
        id: 'museum-indicators',
        question: 'Which museum acquisitions serve as the strongest market validators?',
        type: 'multiselect',
        options: ['MoMA', 'Whitney', 'Tate Modern', 'Centre Pompidou', 'Guggenheim', 'LACMA', 'SFMOMA', 'New Museum', 'Stedelijk', 'V&A']
      },
      {
        id: 'additional-museums',
        question: 'List any additional museums/institutions not mentioned above:',
        type: 'textarea',
        placeholder: 'Institution Name 1 - why significant\nInstitution Name 2 - validation strength\n...'
      },
      {
        id: 'emerging-platforms',
        question: 'Rank digital art platforms by importance for discovering new talent (1-10)',
        type: 'textarea',
        placeholder: '1. Platform Name - why important for discovery\n2. Platform Name - strengths/focus\n...'
      }
    ]
  },
  {
    id: 'price-strategy',
    title: 'Entry & Exit Price Strategy',
    icon: <DollarSign className="w-5 h-5" />,
    questions: [
      {
        id: 'entry-points',
        question: 'What are your optimal entry price points by asset category?',
        type: 'textarea',
        placeholder: 'Blue Chip Digital: $X - $Y\nEmerging Digital: $X - $Y\nContemporary: $X - $Y\nExperimental: $X - $Y\n...'
      },
      {
        id: 'exit-triggers',
        question: 'What price multiples trigger your exit strategies?',
        type: 'textarea',
        placeholder: 'First exit at: X% gain\nSecond exit at: X% gain\nHold forever threshold: conditions\n...'
      },
      {
        id: 'market-timing',
        question: 'How do you time entries during market cycles?',
        type: 'select',
        options: ['Buy the dip aggressively', 'DCA during downturns', 'Wait for capitulation', 'Ignore cycles, buy quality', 'Tactical timing based on signals']
      },
      {
        id: 'liquidity-thresholds',
        question: 'What percentage of portfolio do you keep liquid for opportunities?',
        type: 'select',
        options: ['5-10%', '10-15%', '15-25%', '25-35%', '35%+']
      },
      {
        id: 'price-discovery',
        question: 'How do you determine fair value for pieces without comparable sales?',
        type: 'textarea',
        placeholder: 'Describe your valuation methodology for unique works...'
      }
    ]
  },
  {
    id: 'bertha-training',
    title: 'Training BERTHA - Your AI Successor',
    icon: <Database className="w-5 h-5" />,
    questions: [
      {
        id: 'non-negotiables',
        question: 'What are your non-negotiable rules BERTHA should always follow?',
        type: 'textarea',
        placeholder: 'List absolute rules for the AI agent...'
      },
      {
        id: 'intuition',
        question: 'How would you teach BERTHA to develop "intuition" about art?',
        type: 'textarea',
        placeholder: 'Describe how to encode your gut feelings...'
      },
      {
        id: 'daily-routine',
        question: 'What should BERTHA\'s daily collection routine look like?',
        type: 'textarea',
        placeholder: 'Hour by hour activities and priorities...'
      },
      {
        id: 'success-metrics',
        question: 'How should BERTHA measure her own success?',
        type: 'multiselect',
        options: ['Portfolio ROI', 'Cultural Impact', 'Artist Discovery Rate', 'Prediction Accuracy', 'Community Trust', 'Collection Coherence']
      }
    ]
  }
];

export default function BerthaTrainerInterview() {
  const [currentSection, setCurrentSection] = useState(0);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleResponse = (questionId: string, value: any) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const generateCSV = (trainingData: any) => {
    const headers = ['Section', 'Question', 'Response', 'Timestamp', 'Trainer'];
    const rows: string[] = [];
    
    trainingData.sections.forEach((section: any) => {
      section.responses.forEach((item: any) => {
        const response = Array.isArray(item.response) 
          ? item.response.join('; ') 
          : String(item.response || '').replace(/\n/g, ' | ').replace(/"/g, '""');
        
        rows.push([
          `"${section.section}"`,
          `"${item.question}"`,
          `"${response}"`,
          `"${trainingData.timestamp}"`,
          `"${trainingData.trainer}"`
        ].join(','));
      });
    });
    
    return [headers.join(','), ...rows].join('\n');
  };

  const downloadCSV = (csvContent: string, filename: string) => {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Format responses for BERTHA training
    const trainingData = {
      trainer: 'Amanda Schmitt',
      timestamp: new Date().toISOString(),
      sections: interviewSections.map(section => ({
        section: section.title,
        responses: section.questions.map(q => ({
          question: q.question,
          response: responses[q.id] || null
        }))
      }))
    };
    
    try {
      // Send to API endpoint for processing
      const response = await fetch('/api/agents/bertha/training', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(trainingData)
      });
      
      const result = await response.json();
      
      if (result.success) {
        // Generate CSV export
        const csvData = generateCSV(trainingData);
        downloadCSV(csvData, `bertha-training-${Date.now()}.csv`);
        
        alert(`✅ Training Complete!\n\nBERTHA has successfully incorporated your expertise.\n\nKey updates applied:\n${Object.keys(result.updates || {}).map(k => `• ${k}`).join('\n')}\n\nTraining data has been downloaded as CSV for Google Sheets import.\n\nBERTHA is now ready to operate with your collection intelligence.`);
        
        // Redirect to BERTHA's main page after success
        setTimeout(() => {
          window.location.href = '/sites/amanda';
        }, 2000);
      } else {
        alert('Failed to save training data. Please try again.');
      }
    } catch (error) {
      console.error('Training submission error:', error);
      alert('Error submitting training data. Please check console for details.');
    }

    setIsSubmitting(false);
  };

  const section = interviewSections[currentSection];
  const progress = ((currentSection + 1) / interviewSections.length) * 100;

  return (
    <div className="min-h-screen bg-black text-white">
      <UnifiedHeader />
      
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-950">
        <div className="max-w-4xl mx-auto px-6 py-4">
          {/* Breadcrumb */}
          <div className="text-sm text-gray-400 mb-4">
            <Link href="/" className="hover:text-white">Home</Link> 
            <span className="mx-2">/</span>
            <Link href="/academy" className="hover:text-white">Academy</Link>
            <span className="mx-2">/</span>
            <Link href="/academy/agent/amanda" className="hover:text-white">AMANDA</Link>
            <span className="mx-2">/</span>
            <span>Trainer Interview</span>
          </div>
          
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">BERTHA TRAINER INTERVIEW</h1>
            <div className="text-sm text-gray-400">
              Training AI Collection Intelligence
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            
            {/* Section Navigation Tabs */}
            <div className="flex justify-between text-xs mt-3 gap-1">
              {interviewSections.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => setCurrentSection(i)}
                  className={`px-2 py-1 rounded text-center flex-1 transition-colors ${
                    i === currentSection 
                      ? 'bg-purple-600 text-white' 
                      : i < currentSection 
                        ? 'bg-gray-700 text-white hover:bg-gray-600' 
                        : 'bg-gray-800 text-gray-500 hover:bg-gray-700 hover:text-gray-300'
                  }`}
                >
                  <div className="font-semibold">{i + 1}</div>
                  <div className="text-xs leading-tight">{s.title.split(' ').slice(0, 2).join(' ')}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            {section.icon}
            <h2 className="text-3xl font-semibold">{section.title}</h2>
          </div>
          <p className="text-gray-400">
            Help BERTHA understand your {section.title.toLowerCase()} approach
          </p>
        </div>

        {/* Questions */}
        <div className="space-y-8">
          {section.questions.map((q) => (
            <div key={q.id} className="border border-gray-800 rounded-lg p-6 bg-gray-950">
              <label className="block mb-4 text-lg">{q.question}</label>
              
              {q.type === 'text' && (
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-black border border-gray-700 rounded focus:border-purple-500 focus:outline-none"
                  placeholder={q.placeholder}
                  value={responses[q.id] || ''}
                  onChange={(e) => handleResponse(q.id, e.target.value)}
                />
              )}
              
              {q.type === 'textarea' && (
                <textarea
                  className="w-full px-4 py-3 bg-black border border-gray-700 rounded focus:border-purple-500 focus:outline-none h-32"
                  placeholder={q.placeholder}
                  value={responses[q.id] || ''}
                  onChange={(e) => handleResponse(q.id, e.target.value)}
                />
              )}
              
              {q.type === 'multiselect' && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {q.options?.map(option => (
                    <label key={option} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="w-4 h-4"
                        checked={(responses[q.id] || []).includes(option)}
                        onChange={(e) => {
                          const current = responses[q.id] || [];
                          if (e.target.checked) {
                            handleResponse(q.id, [...current, option]);
                          } else {
                            handleResponse(q.id, current.filter((o: string) => o !== option));
                          }
                        }}
                      />
                      <span className="text-sm">{option}</span>
                    </label>
                  ))}
                </div>
              )}
              
              {q.type === 'select' && (
                <select
                  className="w-full px-4 py-3 bg-black border border-gray-700 rounded focus:border-purple-500 focus:outline-none"
                  value={responses[q.id] || ''}
                  onChange={(e) => handleResponse(q.id, e.target.value)}
                >
                  <option value="">Select an option...</option>
                  {q.options?.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              )}
              
              {q.type === 'scale' && (
                <div className="flex justify-between items-center gap-4">
                  {q.options?.map(option => (
                    <label key={option} className="flex flex-col items-center cursor-pointer">
                      <input
                        type="radio"
                        name={q.id}
                        value={option}
                        checked={responses[q.id] === option}
                        onChange={(e) => handleResponse(q.id, e.target.value)}
                        className="mb-2"
                      />
                      <span className="text-xs text-center">{option}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-12">
          <button
            onClick={() => setCurrentSection(prev => Math.max(0, prev - 1))}
            disabled={currentSection === 0}
            className="px-6 py-3 border border-gray-700 rounded hover:border-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          {currentSection < interviewSections.length - 1 ? (
            <button
              onClick={() => setCurrentSection(prev => prev + 1)}
              className="px-6 py-3 bg-purple-600 rounded hover:bg-purple-700 transition-colors flex items-center gap-2"
            >
              Next Section
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-3 bg-green-600 rounded hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Complete Interview'}
              <Save className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}