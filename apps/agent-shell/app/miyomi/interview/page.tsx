'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, Save, Brain, Target, TrendingUp, TrendingDown, Eye, DollarSign, ArrowLeft, Activity, BarChart3, Users, Globe, Building } from 'lucide-react';

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
    id: 'market-philosophy',
    title: 'Market Philosophy',
    icon: <Target className="w-5 h-5" />,
    questions: [
      {
        id: 'contrarian-thesis',
        question: 'Define your contrarian trading philosophy in one paragraph. What makes consensus wrong?',
        type: 'textarea',
        placeholder: 'Describe your core belief about market inefficiencies and crowd psychology...'
      },
      {
        id: 'edge-sources',
        question: 'Give 3 examples of your most reliable edge sources (e.g., "NYC insider sentiment", "early social signals")',
        type: 'textarea',
        placeholder: 'Be specific - these become MIYOMI\'s pattern recognition...'
      },
      {
        id: 'worst-trades',
        question: 'Describe the worst possible trade to make. Why? (This helps define boundaries)',
        type: 'textarea',
        placeholder: 'What would you never bet on? This teaches MIYOMI what to avoid...'
      },
      {
        id: 'risk-appetite',
        question: 'How essential is taking positions that make others uncomfortable?',
        type: 'scale',
        options: ['Essential', 'Very Important', 'Welcome', 'Neutral', 'Avoid']
      }
    ]
  },
  {
    id: 'market-analysis',
    title: 'Market Analysis',
    icon: <BarChart3 className="w-5 h-5" />,
    questions: [
      {
        id: 'early-detection',
        question: 'How do you spot mispriced markets before they correct?',
        type: 'textarea',
        placeholder: 'Describe your early detection methods and signals...'
      },
      {
        id: 'decision-process',
        question: 'Walk through a recent winning trade. Show your actual thinking process.',
        type: 'textarea',
        placeholder: 'Take MIYOMI through your real decision-making on a specific trade...'
      },
      {
        id: 'information-sources',
        question: 'Your top 5 daily sources for market intelligence (specific platforms, feeds, people)',
        type: 'textarea',
        placeholder: '1. [Most important source]\n2. [Second source]\n3. [Third source]\n4. [Fourth source]\n5. [Fifth source]'
      },
      {
        id: 'sentiment-reads',
        question: 'How do you read crowd sentiment vs. smart money moves?',
        type: 'textarea',
        placeholder: 'Explain your methods for distinguishing noise from signal...'
      }
    ]
  },
  {
    id: 'position-sizing',
    title: 'Position Sizing & Risk',
    icon: <DollarSign className="w-5 h-5" />,
    questions: [
      {
        id: 'sizing-rules',
        question: 'Define your position sizing thresholds',
        type: 'structured',
        fields: [
          { label: 'Exploratory position', placeholder: '1-2% of bankroll' },
          { label: 'Conviction trade', placeholder: '3-5% of bankroll' },
          { label: 'Max single position', placeholder: '8-10% of bankroll' }
        ]
      },
      {
        id: 'exit-strategy',
        question: 'Specific conditions that trigger exits (not theory, actual practice)',
        type: 'textarea',
        placeholder: 'When exactly do you close positions? Give concrete triggers...'
      },
      {
        id: 'learning-cases',
        question: 'One great trade, one disaster - what did each teach?',
        type: 'textarea',
        placeholder: 'Best: [specific trade and lesson]\nWorst: [specific trade and lesson]'
      },
      {
        id: 'bankroll-management',
        question: 'How do you manage drawdowns and protect capital?',
        type: 'textarea',
        placeholder: 'Describe your risk management during losing streaks...'
      }
    ]
  },
  {
    id: 'market-sectors',
    title: 'Market Sectors',
    icon: <Activity className="w-5 h-5" />,
    questions: [
      {
        id: 'sector-preferences',
        question: 'Rank your preferred prediction market categories',
        type: 'textarea',
        placeholder: 'List in order: Politics, Sports, Finance, AI/Tech, Pop Culture, etc. with brief rationale...'
      },
      {
        id: 'overrated-underrated',
        question: 'List overrated and underrated market categories',
        type: 'two-column',
        fields: [
          { label: 'Overrated Markets', placeholder: 'Sports betting\nDaily politics\nCrypto predictions\nCelebrity gossip\nMeme stocks' },
          { label: 'Underrated Markets', placeholder: 'Long-term geopolitics\nRegulatory outcomes\nTech adoption rates\nCultural shifts\nClimate events' }
        ]
      },
      {
        id: 'expertise-areas',
        question: 'What 3 domains do you have genuine expertise in? Why these?',
        type: 'textarea',
        placeholder: 'Name specific areas where you have true edge and explain the source...'
      }
    ]
  },
  {
    id: 'miyomi-parameters',
    title: 'MIYOMI\'s Parameters',
    icon: <Brain className="w-5 h-5" />,
    questions: [
      {
        id: 'autonomy-limits',
        question: 'Define MIYOMI\'s trading authority',
        type: 'structured',
        fields: [
          { label: 'Max position size', placeholder: '$500 per trade' },
          { label: 'Daily trading limit', placeholder: '$1,500 total' },
          { label: 'Required approval above', placeholder: '$1,000 single position' }
        ]
      },
      {
        id: 'voice-sample',
        question: 'Write a 100-word market analysis as you would. This trains MIYOMI\'s voice.',
        type: 'textarea',
        placeholder: 'Write exactly as you would about a recent market position...'
      },
      {
        id: 'confidence-thresholds',
        question: 'When should MIYOMI auto-execute vs. ask for approval?',
        type: 'structured',
        fields: [
          { label: 'Auto-execute confidence', placeholder: '85%+ confidence' },
          { label: 'Request review', placeholder: '70-84% confidence' },
          { label: 'Skip entirely', placeholder: 'Below 70% confidence' }
        ]
      },
      {
        id: 'non-negotiables',
        question: 'Rules MIYOMI must never break',
        type: 'textarea',
        placeholder: 'List absolute constraints and red lines...'
      }
    ]
  },
  {
    id: 'information-network',
    title: 'Information Network',
    icon: <Users className="w-5 h-5" />,
    questions: [
      {
        id: 'twitter-follows',
        question: 'Top 10 Twitter/X accounts you follow for market intelligence (with brief reason why)',
        type: 'textarea',
        placeholder: '@elonmusk - Moves crypto markets with single tweets\n@natesilver538 - Election prediction accuracy\n@chamath - VC perspective on tech trends\n...'
      },
      {
        id: 'youtube-channels',
        question: 'YouTube channels/podcasts that give you edge in market analysis',
        type: 'textarea',
        placeholder: 'List channels you watch regularly for market insights, contrarian takes, or early trend spotting...'
      },
      {
        id: 'contrarian-voices',
        question: 'Who are the best contrarian voices you follow? Why do they see what others miss?',
        type: 'textarea',
        placeholder: 'Name specific contrarian analysts/traders and explain their unique perspective...'
      },
      {
        id: 'sentiment-tracking',
        question: 'How do you track crowd sentiment vs smart money moves?',
        type: 'structured',
        fields: [
          { label: 'Retail sentiment sources', placeholder: 'Reddit WSB, Twitter trending, TikTok hashtags' },
          { label: 'Smart money indicators', placeholder: 'Whale movements, insider trading, institutional flows' },
          { label: 'Early warning signals', placeholder: 'What tells you sentiment is about to flip?' }
        ]
      }
    ]
  },
  {
    id: 'ecosystem-awareness',
    title: 'Ecosystem Awareness',
    icon: <Globe className="w-5 h-5" />,
    questions: [
      {
        id: 'emerging-platforms',
        question: 'What new prediction market platforms should MIYOMI track? Why are they promising?',
        type: 'textarea',
        placeholder: 'List emerging platforms like Zeitgeist, Azuro, Thales, etc. What makes them different?'
      },
      {
        id: 'key-investors',
        question: 'VCs and investors whose moves signal market direction changes',
        type: 'textarea',
        placeholder: 'Which investors do you watch for early trend signals? Andreessen, Sequoia moves, etc.'
      },
      {
        id: 'regulatory-watchers',
        question: 'Who do you follow for prediction market regulation updates?',
        type: 'textarea',
        placeholder: 'Lawyers, policy analysts, regulators to track for upcoming rule changes...'
      },
      {
        id: 'competitive-intel',
        question: 'How do you track what other prediction market traders are doing?',
        type: 'structured',
        fields: [
          { label: 'Public traders to watch', placeholder: 'Known high-performers, whales, contrarians' },
          { label: 'Strategy analysis tools', placeholder: 'How do you reverse-engineer successful strategies?' },
          { label: 'Performance benchmarks', placeholder: 'How do you measure against competition?' }
        ]
      }
    ]
  },
  {
    id: 'trend-detection',
    title: 'Trend Detection',
    icon: <Activity className="w-5 h-5" />,
    questions: [
      {
        id: 'culture-tracking',
        question: 'How do you spot cultural trends before they hit prediction markets?',
        type: 'textarea',
        placeholder: 'Describe your process for identifying cultural shifts that will become tradeable events...'
      },
      {
        id: 'news-sources',
        question: 'Non-obvious news sources that give you early information advantage',
        type: 'textarea',
        placeholder: 'Industry newsletters, niche publications, foreign media, academic papers, etc.'
      },
      {
        id: 'technology-trends',
        question: 'How do you identify which tech trends will create new prediction markets?',
        type: 'textarea',
        placeholder: 'AI developments, crypto innovations, regulatory tech - what creates new betting opportunities?'
      },
      {
        id: 'market-inefficiencies',
        question: 'Where do you find the most consistent mispricings in prediction markets?',
        type: 'two-column',
        fields: [
          { label: 'Overpriced Categories', placeholder: 'Celebrity gossip\nShort-term politics\nViral social trends\nCrypto hype cycles\nSports obvious favorites' },
          { label: 'Underpriced Categories', placeholder: 'Long-term geopolitics\nRegulatory outcomes\nTechnology adoption\nClimate events\nCultural backlash patterns' }
        ]
      }
    ]
  },
  {
    id: 'contrarian-edge',
    title: 'Contrarian Edge',
    icon: <TrendingDown className="w-5 h-5" />,
    questions: [
      {
        id: 'consensus-traps',
        question: 'Describe markets where "obvious" consensus is usually wrong. Give specific examples.',
        type: 'textarea',
        placeholder: 'What kind of "sure thing" bets do you fade? Why does crowd get fooled?'
      },
      {
        id: 'contrarian-signals',
        question: 'What signals tell you consensus is about to break?',
        type: 'textarea',
        placeholder: 'List specific indicators that masses are wrong and market will flip...'
      },
      {
        id: 'nyc-advantage',
        question: 'How does your NYC perspective give you edge over generic market participants?',
        type: 'textarea',
        placeholder: 'What do you see from NYC that others miss? Cultural, financial, social signals...'
      },
      {
        id: 'future-vision',
        question: 'What kind of trader should MIYOMI become that you couldn\'t be?',
        type: 'textarea',
        placeholder: 'How should MIYOMI transcend your limitations? Speed, scale, emotion control...'
      }
    ]
  }
];

export default function MiyomiTrainerInterview() {
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
    
    // Format responses for MIYOMI training
    const trainingData = {
      trainer: trainerInfo.name || 'MIYOMI Trainer',
      email: trainerInfo.email,
      timestamp: new Date().toISOString(),
      agent: 'miyomi',
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
      const response = await fetch('/api/agents/miyomi/training', {
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
        link.download = `miyomi-training-${Date.now()}.csv`;
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
          <div className="text-6xl mb-6">🎯</div>
          <h1 className="text-3xl font-bold mb-4">Training Complete!</h1>
          <p className="text-lg mb-8">
            MIYOMI has successfully incorporated your contrarian trading intelligence.
            Your training data has been processed and a CSV backup has been downloaded.
          </p>
          <div className="space-y-4">
            <button
              onClick={() => window.location.href = '/academy/agent/miyomi'}
              className="px-8 py-4 bg-red-600 hover:bg-red-700 transition-colors"
            >
              View MIYOMI's Profile
            </button>
            <button
              onClick={() => window.location.href = '/sites/miyomi'}
              className="block mx-auto px-8 py-4 border border-gray-600 hover:border-white transition-colors"
            >
              Launch MIYOMI Dashboard
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
            <div className="flex items-center gap-4">
              <Link 
                href="/academy/agent/miyomi"
                className="inline-flex items-center gap-2 text-sm hover:bg-white hover:text-black px-3 py-2 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                MIYOMI
              </Link>
              <h1 className="text-2xl font-bold">CONTRARIAN TRAINING</h1>
            </div>
            <div className="text-sm text-gray-400">
              Psychology-Based Trading Intelligence
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-red-500 to-orange-500 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              {interviewSections.map((s, i) => (
                <button
                  key={s.id} 
                  onClick={() => setCurrentSection(i)}
                  className={`hover:text-white transition-colors cursor-pointer ${i <= currentSection ? 'text-white' : ''} ${i === currentSection ? 'font-bold' : ''}`}
                  disabled={showSummary}
                >
                  {s.title.split(' ')[0]}
                </button>
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
              className="px-4 py-3 bg-gray-950 border border-gray-700 rounded focus:border-red-500 focus:outline-none"
              value={trainerInfo.name}
              onChange={(e) => setTrainerInfo(prev => ({ ...prev, name: e.target.value }))}
            />
            <input
              type="email"
              placeholder="Your Email"
              className="px-4 py-3 bg-gray-950 border border-gray-700 rounded focus:border-red-500 focus:outline-none"
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
            Teaching MIYOMI your {section.title.toLowerCase()} framework
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
                  className="w-full px-4 py-3 bg-black border border-gray-700 rounded focus:border-red-500 focus:outline-none"
                  placeholder={q.placeholder}
                  value={responses[q.id] || ''}
                  onChange={(e) => handleResponse(q.id, e.target.value)}
                />
              )}
              
              {q.type === 'textarea' && (
                <textarea
                  className="w-full px-4 py-3 bg-black border border-gray-700 rounded focus:border-red-500 focus:outline-none h-32 resize-none font-mono text-sm"
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
                        className="w-full px-4 py-3 bg-black border border-gray-700 rounded focus:border-red-500 focus:outline-none"
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
                        className="w-full px-4 py-3 bg-black border border-gray-700 rounded focus:border-red-500 focus:outline-none h-32 resize-none"
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
              className="px-6 py-3 bg-red-600 rounded hover:bg-red-700 transition-colors flex items-center gap-2"
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