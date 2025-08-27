'use client';

import { useState } from 'react';
import { ChevronRight, Save, Brain, Target, Sparkles, Database } from 'lucide-react';

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
        options: ['Abstract Expressionism', 'Minimalism', 'Generative Art', 'Glitch Art', 'Photography', 'AI Art', 'Conceptual', 'Street Art']
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

    console.log('Training data for BERTHA:', trainingData);
    
    // TODO: Send to API endpoint for processing
    // await fetch('/api/agents/bertha/training', {
    //   method: 'POST',
    //   body: JSON.stringify(trainingData)
    // });

    setIsSubmitting(false);
    alert('Interview responses saved! BERTHA will begin learning from your expertise.');
  };

  const section = interviewSections[currentSection];
  const progress = ((currentSection + 1) / interviewSections.length) * 100;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-950">
        <div className="max-w-4xl mx-auto px-6 py-4">
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
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              {interviewSections.map((s, i) => (
                <span key={s.id} className={i <= currentSection ? 'text-white' : ''}>
                  {i + 1}. {s.title.split(' ')[0]}
                </span>
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