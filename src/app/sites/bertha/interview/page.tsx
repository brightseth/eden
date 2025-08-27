'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, Save, Brain, Target, Sparkles, Database, TrendingUp, DollarSign, CheckCircle, AlertCircle, Loader2, Download } from 'lucide-react';
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
    id: 'aesthetic-position',
    title: 'Aesthetic Position',
    icon: <Target className="w-5 h-5" />,
    questions: [
      {
        id: 'core-thesis',
        question: 'Define your collecting philosophy in one paragraph. What makes a work matter?',
        type: 'textarea',
        placeholder: 'Your foundational collecting thesis - what drives every decision...'
      },
      {
        id: 'specificity-markers',
        question: 'Give 3 examples of highly specific qualities you seek (e.g., "dry and complex", "productive discomfort")',
        type: 'textarea',
        placeholder: '1. Specific quality - why it matters\n2. Another quality - its significance\n3. Third quality - how you recognize it'
      },
      {
        id: 'anti-collection',
        question: 'Describe the worst possible artwork to collect. Why? (This helps define boundaries)',
        type: 'textarea',
        placeholder: 'Paint a picture of everything you avoid and why these qualities repel you...'
      },
      {
        id: 'transgression-threshold',
        question: 'How essential is work that challenges, disturbs, or takes sides?',
        type: 'scale',
        options: ['Essential - must transgress', 'Important - prefer challenging work', 'Neutral - content agnostic', 'Prefer safe - avoid controversy', 'Avoid - only collect pleasant work']
      }
    ]
  },
  {
    id: 'discovery-evaluation',
    title: 'Discovery & Evaluation',
    icon: <Brain className="w-5 h-5" />,
    questions: [
      {
        id: 'early-signals',
        question: 'How do you identify important work 2-3 years before market recognition?',
        type: 'textarea',
        placeholder: 'Describe your process for spotting significance before others see it...'
      },
      {
        id: 'live-evaluation',
        question: 'Walk through a recent acquisition or rejection. Show your actual thinking process.',
        type: 'textarea',
        placeholder: 'Artist: ___\nWork: ___\nDecision: ___\nWhy: [your real thought process step by step]'
      },
      {
        id: 'daily-sources',
        question: 'Your top 5 daily sources for discovery (specific platforms, critics, channels)',
        type: 'textarea',
        placeholder: 'Rank your most valuable discovery sources:\n1. Source - why essential\n2. Source - what you get from it\n...'
      }
    ]
  },
  {
    id: 'market-mechanics',
    title: 'Market Mechanics',
    icon: <DollarSign className="w-5 h-5" />,
    questions: [
      {
        id: 'position-sizing',
        question: 'Define your position sizes by conviction level',
        type: 'textarea',
        placeholder: 'Experimental: $_____ - $_____\nConviction buy: $_____ - $_____\nMajor position: $_____ - $_____\n\nExplain your reasoning for each tier...'
      },
      {
        id: 'exit-triggers',
        question: 'Specific conditions that trigger sales (not theory, actual practice)',
        type: 'textarea',
        placeholder: 'List your real exit triggers with examples:\n• Artist does X → immediate sell\n• Market condition Y → reduce position\n• Personal signal Z → exit entirely'
      },
      {
        id: 'learning-cases',
        question: 'One great buy, one mistake - what did each teach?',
        type: 'textarea',
        placeholder: 'GREAT BUY:\nArtist/Work: ___\nWhy it worked: ___\nLesson: ___\n\nMISTAKE:\nArtist/Work: ___\nWhat went wrong: ___\nLesson: ___'
      }
    ]
  },
  {
    id: 'critical-references',
    title: 'Critical References',
    icon: <Sparkles className="w-5 h-5" />,
    questions: [
      {
        id: 'artist-conviction-list',
        question: '10 artists you\'d buy regardless of market. Why these specifically?',
        type: 'textarea',
        placeholder: '1. Artist Name - why conviction buy\n2. Artist Name - what makes them essential\n...\n\nFocus on what makes each irreplaceable in your vision.'
      },
      {
        id: 'overrated-underrated',
        question: 'List 5 overrated and 5 underrated artists or movements',
        type: 'textarea',
        placeholder: 'OVERRATED:\n1. Artist/Movement - why overhyped\n2. Artist/Movement - market misconception\n...\n\nUNDERRATED:\n1. Artist/Movement - why overlooked\n2. Artist/Movement - hidden value\n...'
      },
      {
        id: 'taste-influences',
        question: '3 collectors/critics whose taste you respect. What do they see?',
        type: 'textarea',
        placeholder: '1. Name - what they taught you about seeing\n2. Name - their unique perspective\n3. Name - how they changed your approach'
      }
    ]
  },
  {
    id: 'bertha-parameters',
    title: 'BERTHA\'s Parameters',
    icon: <Database className="w-5 h-5" />,
    questions: [
      {
        id: 'autonomy-limits',
        question: 'Set BERTHA\'s spending and decision limits',
        type: 'textarea',
        placeholder: 'Max single purchase: $_____\nDaily spend limit: $_____\nRequired approval above: $_____\nAuto-reject below: $_____\n\nExplain your reasoning for each limit...'
      },
      {
        id: 'voice-sample',
        question: 'Write a 100-word collection note as you would. This trains BERTHA\'s voice.',
        type: 'textarea',
        placeholder: 'Write about a recent work you collected or considered. Use your actual voice, language, and perspective. This becomes BERTHA\'s writing style template.'
      },
      {
        id: 'non-negotiables',
        question: 'Rules BERTHA must never break',
        type: 'textarea',
        placeholder: 'List absolute rules:\n• Never buy ___\n• Always avoid ___\n• Immediately sell if ___\n• Required criteria: ___'
      }
    ]
  },
  {
    id: 'beyond-safety',
    title: 'Beyond Safety',
    icon: <TrendingUp className="w-5 h-5" />,
    questions: [
      {
        id: 'pushing-boundaries',
        question: 'Describe work that standard AI would reject but you\'d collect. Why does it matter?',
        type: 'textarea',
        placeholder: 'Give specific examples of challenging work you value and why BERTHA needs to understand transgression as cultural necessity...'
      },
      {
        id: 'taking-sides',
        question: 'Name a polarizing art position you hold strongly. BERTHA should inherit this.',
        type: 'textarea',
        placeholder: 'What controversial stance defines your collecting? Why is this position essential to maintain?'
      },
      {
        id: 'future-vision',
        question: 'What kind of collector should BERTHA become that you couldn\'t be?',
        type: 'textarea',
        placeholder: 'How should BERTHA transcend your limitations? What should she do that human collectors cannot?'
      }
    ]
  }
];

type SubmissionState = 'idle' | 'submitting' | 'success' | 'error';

export default function BerthaTrainerInterview() {
  const [currentSection, setCurrentSection] = useState(0);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [submissionState, setSubmissionState] = useState<SubmissionState>('idle');
  const [submissionMessage, setSubmissionMessage] = useState('');
  const [csvData, setCsvData] = useState<string | null>(null);

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

  const resetSubmission = () => {
    setSubmissionState('idle');
    setSubmissionMessage('');
    setCsvData(null);
  };

  const handleSubmit = async () => {
    setSubmissionState('submitting');
    setSubmissionMessage('Processing your training data...');
    
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
      
      if (response.ok && result.success) {
        // Generate CSV export
        const csvContent = generateCSV(trainingData);
        setCsvData(csvContent);
        
        setSubmissionState('success');
        const updatesCount = Object.keys(result.updates || {}).length;
        setSubmissionMessage(
          `BERTHA has successfully incorporated your expertise with ${updatesCount} key updates applied. Your training data is ready for download.`
        );
        
        // Redirect to BERTHA's main page after a delay
        setTimeout(() => {
          window.location.href = '/sites/amanda';
        }, 5000);
      } else {
        setSubmissionState('error');
        setSubmissionMessage(result.error || 'Failed to save training data. Please try again.');
      }
    } catch (error) {
      console.error('Training submission error:', error);
      setSubmissionState('error');
      setSubmissionMessage('Network error occurred. Please check your connection and try again.');
    }
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
            <Link href="/academy/agent/amanda" className="hover:text-white">BERTHA</Link>
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

        {/* Submission Status */}
        {submissionState !== 'idle' && (
          <div className="mt-8 p-6 border rounded-lg">
            {submissionState === 'submitting' && (
              <div className="flex items-center gap-3 text-blue-400 border-blue-400/20 bg-blue-950/20">
                <Loader2 className="w-5 h-5 animate-spin" />
                <div>
                  <div className="font-semibold">Processing Training Data</div>
                  <div className="text-sm text-gray-400">{submissionMessage}</div>
                </div>
              </div>
            )}
            
            {submissionState === 'success' && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-green-400 border-green-400/20 bg-green-950/20">
                  <CheckCircle className="w-5 h-5" />
                  <div>
                    <div className="font-semibold">Training Complete!</div>
                    <div className="text-sm text-gray-300">{submissionMessage}</div>
                  </div>
                </div>
                
                {csvData && (
                  <div className="flex items-center gap-3 pt-3 border-t border-gray-700">
                    <button
                      onClick={() => downloadCSV(csvData, `bertha-training-${Date.now()}.csv`)}
                      className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded flex items-center gap-2 text-sm"
                    >
                      <Download className="w-4 h-4" />
                      Download Training Data (CSV)
                    </button>
                    <span className="text-xs text-gray-500">
                      Optional: Import to Google Sheets for analysis
                    </span>
                  </div>
                )}
                
                <div className="text-sm text-gray-500">
                  Redirecting to Amanda's studio in 5 seconds...
                </div>
              </div>
            )}
            
            {submissionState === 'error' && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-red-400 border-red-400/20 bg-red-950/20">
                  <AlertCircle className="w-5 h-5" />
                  <div>
                    <div className="font-semibold">Submission Failed</div>
                    <div className="text-sm text-gray-300">{submissionMessage}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleSubmit}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded flex items-center gap-2 text-sm"
                  >
                    <Save className="w-4 h-4" />
                    Try Again
                  </button>
                  <button
                    onClick={resetSubmission}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center mt-12">
          <button
            onClick={() => setCurrentSection(prev => Math.max(0, prev - 1))}
            disabled={currentSection === 0 || submissionState === 'submitting'}
            className="px-6 py-3 border border-gray-700 rounded hover:border-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          {currentSection < interviewSections.length - 1 ? (
            <button
              onClick={() => setCurrentSection(prev => prev + 1)}
              disabled={submissionState === 'submitting'}
              className="px-6 py-3 bg-purple-600 rounded hover:bg-purple-700 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              Next Section
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submissionState === 'submitting' || submissionState === 'success'}
              className="px-6 py-3 bg-green-600 rounded hover:bg-green-700 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {submissionState === 'submitting' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : submissionState === 'success' ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Complete
                </>
              ) : (
                <>
                  Complete Interview
                  <Save className="w-4 h-4" />
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}