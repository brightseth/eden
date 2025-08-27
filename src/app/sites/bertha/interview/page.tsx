'use client';

import { useState } from 'react';
import { ChevronRight, Save, Brain, Target, Sparkles, Flame, Eye, DollarSign } from 'lucide-react';

interface InterviewSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  questions: {
    id: string;
    question: string;
    type: 'text' | 'textarea' | 'scale' | 'structured' | 'two-column';
    placeholder?: string;
    options?: string[];
    fields?: { label: string; placeholder: string }[];
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
        placeholder: 'Describe your core collecting thesis that BERTHA should inherit...'
      },
      {
        id: 'specificity-markers',
        question: 'Give 3 examples of highly specific qualities you seek (e.g., "dry and complex", "productive discomfort")',
        type: 'textarea',
        placeholder: 'Be extremely specific - these become BERTHA\'s recognition patterns...'
      },
      {
        id: 'anti-collection',
        question: 'Describe the worst possible artwork to collect. Why? (This helps define boundaries)',
        type: 'textarea',
        placeholder: 'What would you never collect? This teaches BERTHA what to avoid...'
      },
      {
        id: 'transgression-threshold',
        question: 'How essential is work that offends, disturbs, challenges, or takes sides?',
        type: 'scale',
        options: ['Essential', 'Important', 'Welcome', 'Neutral', 'Avoid']
      }
    ]
  },
  {
    id: 'discovery-evaluation',
    title: 'Discovery & Evaluation',
    icon: <Eye className="w-5 h-5" />,
    questions: [
      {
        id: 'early-signals',
        question: 'How do you identify important work 2-3 years before market recognition?',
        type: 'textarea',
        placeholder: 'Describe your early detection methods and signals...'
      },
      {
        id: 'live-evaluation',
        question: 'Walk through a recent acquisition or rejection. Show your actual thinking process.',
        type: 'textarea',
        placeholder: 'Take BERTHA through your real decision-making on a specific work...'
      },
      {
        id: 'daily-sources',
        question: 'Your top 5 daily sources for discovery (specific platforms, critics, channels)',
        type: 'textarea',
        placeholder: '1. [Most important source]\n2. [Second source]\n3. [Third source]\n4. [Fourth source]\n5. [Fifth source]'
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
        question: 'Define your position sizing thresholds',
        type: 'structured',
        fields: [
          { label: 'Experimental discovery', placeholder: '$500 - $2,000' },
          { label: 'Conviction buy', placeholder: '$2,000 - $10,000' },
          { label: 'Major position', placeholder: '$10,000 - $50,000' }
        ]
      },
      {
        id: 'exit-triggers',
        question: 'Specific conditions that trigger sales (not theory, actual practice)',
        type: 'textarea',
        placeholder: 'When exactly do you sell? Give concrete triggers...'
      },
      {
        id: 'learning-cases',
        question: 'One great buy, one mistake - what did each teach?',
        type: 'textarea',
        placeholder: 'Best: [specific work and lesson]\nWorst: [specific work and lesson]'
      }
    ]
  },
  {
    id: 'critical-references',
    title: 'Critical References',
    icon: <Sparkles className="w-5 h-5" />,
    questions: [
      {
        id: 'artist-conviction',
        question: '10 artists you\'d buy regardless of market. Why these specifically?',
        type: 'textarea',
        placeholder: 'List artists with brief rationale for each...'
      },
      {
        id: 'overrated-underrated',
        question: 'List overrated and underrated artists/movements',
        type: 'two-column',
        fields: [
          { label: '5 Overrated', placeholder: '1.\n2.\n3.\n4.\n5.' },
          { label: '5 Underrated', placeholder: '1.\n2.\n3.\n4.\n5.' }
        ]
      },
      {
        id: 'influences',
        question: '3 collectors/critics whose taste you respect. What do they see?',
        type: 'textarea',
        placeholder: 'Name them and explain what they understand that others miss...'
      }
    ]
  },
  {
    id: 'bertha-parameters',
    title: 'BERTHA\'s Parameters',
    icon: <Brain className="w-5 h-5" />,
    questions: [
      {
        id: 'autonomy-limits',
        question: 'Define BERTHA\'s spending authority',
        type: 'structured',
        fields: [
          { label: 'Max single purchase', placeholder: '$5,000' },
          { label: 'Daily spend limit', placeholder: '$10,000' },
          { label: 'Required approval above', placeholder: '$25,000' }
        ]
      },
      {
        id: 'voice-sample',
        question: 'Write a 100-word collection note as you would. This trains BERTHA\'s voice.',
        type: 'textarea',
        placeholder: 'Write exactly as you would about a recent acquisition...'
      },
      {
        id: 'non-negotiables',
        question: 'Rules BERTHA must never break',
        type: 'textarea',
        placeholder: 'List absolute constraints and red lines...'
      }
    ]
  },
  {
    id: 'beyond-safety',
    title: 'Beyond Safety',
    icon: <Flame className="w-5 h-5" />,
    questions: [
      {
        id: 'pushing-boundaries',
        question: 'Describe work that standard AI would reject but you\'d collect. Why does it matter?',
        type: 'textarea',
        placeholder: 'Give specific examples of transgressive work that has value...'
      },
      {
        id: 'taking-sides',
        question: 'Name a polarizing art position you hold strongly. BERTHA should inherit this.',
        type: 'textarea',
        placeholder: 'What partisan aesthetic position should BERTHA defend?'
      },
      {
        id: 'future-vision',
        question: 'What kind of collector should BERTHA become that you couldn\'t be?',
        type: 'textarea',
        placeholder: 'How should BERTHA transcend your limitations?'
      }
    ]
  }
];

export default function BerthaTrainerInterview() {
  const [currentSection, setCurrentSection] = useState(0);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [trainerInfo, setTrainerInfo] = useState({ name: '', email: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  const handleResponse = (questionId: string, value: any) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleStructuredResponse = (questionId: string, fieldIndex: number, value: string) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: {
        ...(prev[questionId] || {}),
        [fieldIndex]: value
      }
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Format responses for BERTHA training
    const trainingData = {
      trainer: trainerInfo.name || 'Amanda Schmitt',
      email: trainerInfo.email,
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
        // Create CSV download
        const csvContent = generateCSV(trainingData);
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `bertha-training-${Date.now()}.csv`;
        link.click();
        
        // Show success state
        setShowSummary(true);
      } else {
        alert('Failed to save training data. Please try again.');
      }
    } catch (error) {
      console.error('Training submission error:', error);
      alert('Error submitting training data. Please check console for details.');
    }

    setIsSubmitting(false);
  };

  const generateCSV = (data: any) => {
    let csv = 'Section,Question,Response\n';
    data.sections.forEach((section: any) => {
      section.responses.forEach((item: any) => {
        const response = typeof item.response === 'object' 
          ? JSON.stringify(item.response) 
          : item.response || '';
        csv += `"${section.section}","${item.question}","${response.replace(/"/g, '""')}"\n`;
      });
    });
    return csv;
  };

  if (showSummary) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="max-w-2xl text-center p-8">
          <div className="text-6xl mb-6">✅</div>
          <h1 className="text-3xl font-bold mb-4">Training Complete!</h1>
          <p className="text-lg mb-8">
            BERTHA has successfully incorporated your collection intelligence.
            Your training data has been processed and a CSV backup has been downloaded.
          </p>
          <div className="space-y-4">
            <button
              onClick={() => window.location.href = '/academy/agent/amanda'}
              className="px-8 py-4 bg-purple-600 hover:bg-purple-700 transition-colors"
            >
              View BERTHA\'s Profile
            </button>
            <button
              onClick={() => window.location.href = '/admin/bertha-training'}
              className="block mx-auto px-8 py-4 border border-gray-600 hover:border-white transition-colors"
            >
              Review Training Data
            </button>
          </div>
        </div>
      </div>
    );
  }

  const section = interviewSections[currentSection];
  const progress = ((currentSection + 1) / interviewSections.length) * 100;
  const isFirstSection = currentSection === 0;
  const isLastSection = currentSection === interviewSections.length - 1;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-950">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">BERTHA COLLECTOR TRAINING</h1>
            <div className="text-sm text-gray-400">
              Psychology-Based Collection Intelligence
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
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              {interviewSections.map((s, i) => (
                <span key={s.id} className={i <= currentSection ? 'text-white' : ''}>
                  {s.title.split(' ')[0]}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Trainer Info (only on first section) */}
      {isFirstSection && (
        <div className="max-w-4xl mx-auto px-6 py-6 border-b border-gray-800">
          <h2 className="text-lg font-semibold mb-4">Trainer Identification</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Your Name"
              className="px-4 py-3 bg-gray-950 border border-gray-700 rounded focus:border-purple-500 focus:outline-none"
              value={trainerInfo.name}
              onChange={(e) => setTrainerInfo(prev => ({ ...prev, name: e.target.value }))}
            />
            <input
              type="email"
              placeholder="Your Email"
              className="px-4 py-3 bg-gray-950 border border-gray-700 rounded focus:border-purple-500 focus:outline-none"
              value={trainerInfo.email}
              onChange={(e) => setTrainerInfo(prev => ({ ...prev, email: e.target.value }))}
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            {section.icon}
            <h2 className="text-3xl font-semibold">{section.title}</h2>
          </div>
          <p className="text-gray-400">
            Teaching BERTHA your {section.title.toLowerCase()} framework
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
                  className="w-full px-4 py-3 bg-black border border-gray-700 rounded focus:border-purple-500 focus:outline-none h-32 resize-none font-mono text-sm"
                  placeholder={q.placeholder}
                  value={responses[q.id] || ''}
                  onChange={(e) => handleResponse(q.id, e.target.value)}
                />
              )}
              
              {q.type === 'scale' && (
                <div className="flex justify-between items-center gap-2">
                  {q.options?.map(option => (
                    <label key={option} className="flex flex-col items-center cursor-pointer flex-1">
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

              {q.type === 'structured' && (
                <div className="space-y-4">
                  {q.fields?.map((field, idx) => (
                    <div key={idx}>
                      <label className="block text-sm text-gray-400 mb-2">{field.label}</label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 bg-black border border-gray-700 rounded focus:border-purple-500 focus:outline-none"
                        placeholder={field.placeholder}
                        value={responses[q.id]?.[idx] || ''}
                        onChange={(e) => handleStructuredResponse(q.id, idx, e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              )}

              {q.type === 'two-column' && (
                <div className="grid md:grid-cols-2 gap-6">
                  {q.fields?.map((field, idx) => (
                    <div key={idx}>
                      <label className="block text-sm text-gray-400 mb-2">{field.label}</label>
                      <textarea
                        className="w-full px-4 py-3 bg-black border border-gray-700 rounded focus:border-purple-500 focus:outline-none h-32 resize-none"
                        placeholder={field.placeholder}
                        value={responses[q.id]?.[idx] || ''}
                        onChange={(e) => handleStructuredResponse(q.id, idx, e.target.value)}
                      />
                    </div>
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
            disabled={isFirstSection}
            className="px-6 py-3 border border-gray-700 rounded hover:border-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous Section
          </button>
          
          {!isLastSection ? (
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
              {isSubmitting ? 'Processing...' : 'Complete Training'}
              <Save className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Section Info */}
        <div className="mt-8 text-center text-sm text-gray-500">
          Section {currentSection + 1} of {interviewSections.length}
        </div>
      </div>
    </div>
  );
}