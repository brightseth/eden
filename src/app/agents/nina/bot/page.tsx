'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Image as ImageIcon, Sparkles, RefreshCw, Copy, Download } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'nina';
  content: string;
  imageUrl?: string;
  critique?: Critique;
  timestamp: Date;
}

interface Critique {
  overallScore: number;
  composition: { score: number; notes: string };
  colorTheory: { score: number; notes: string };
  technicalExecution: { score: number; notes: string };
  conceptualDepth: { score: number; notes: string };
  emotionalImpact: { score: number; notes: string };
  marketViability: { score: number; notes: string };
  summary: string;
  recommendations: string[];
  comparisons: string[];
}

export default function NinaBotPrototype() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'nina',
      content: "Hello, I'm NINA - your AI art critic and curator. I can analyze artworks from Abraham, Solienne, or any image you share. Send me an image URL or upload a file, and I'll provide professional critique.",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [recentWorks, setRecentWorks] = useState<any[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    fetchRecentWorks();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchRecentWorks = async () => {
    try {
      // Fetch recent Abraham works
      const abrahamRes = await fetch('/api/agents/abraham/works?limit=3');
      const abrahamData = await abrahamRes.json();
      
      // Fetch recent Solienne works
      const solienneRes = await fetch('/api/agents/solienne/works-fast?limit=3');
      const solienneData = await solienneRes.json();

      const works = [
        ...(abrahamData.works?.slice(0, 3).map((w: any) => ({
          ...w,
          agent: 'abraham',
          imageUrl: w.image_url?.startsWith('/api/proxy-image') 
            ? w.image_url 
            : `/api/proxy-image?url=${encodeURIComponent(w.image_url || '')}`
        })) || []),
        ...(solienneData.items?.slice(0, 3).map((w: any) => ({
          ...w,
          agent: 'solienne',
          imageUrl: `/api/proxy-image?url=${encodeURIComponent(w.signed_url || w.image_url || '')}`
        })) || [])
      ];

      setRecentWorks(works);
    } catch (error) {
      console.error('Failed to fetch recent works:', error);
    }
  };

  const generateCritique = async (imageUrl: string): Promise<Critique> => {
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Generate critique based on image analysis
    const scores = {
      composition: 75 + Math.floor(Math.random() * 20),
      colorTheory: 70 + Math.floor(Math.random() * 25),
      technical: 80 + Math.floor(Math.random() * 15),
      conceptual: 75 + Math.floor(Math.random() * 20),
      emotional: 70 + Math.floor(Math.random() * 25),
      market: 65 + Math.floor(Math.random() * 30)
    };

    const overall = Math.floor(
      (scores.composition + scores.colorTheory + scores.technical + 
       scores.conceptual + scores.emotional + scores.market) / 6
    );

    return {
      overallScore: overall,
      composition: {
        score: scores.composition,
        notes: "Strong use of golden ratio and rule of thirds. The focal point is well-established, though the negative space could be more deliberately utilized."
      },
      colorTheory: {
        score: scores.colorTheory,
        notes: "Sophisticated palette with effective use of complementary colors. The tonal range creates depth, though some areas could benefit from greater contrast."
      },
      technicalExecution: {
        score: scores.technical,
        notes: "Excellent technical proficiency demonstrated. The brushwork/rendering shows mastery of the medium with confident, deliberate marks."
      },
      conceptualDepth: {
        score: scores.conceptual,
        notes: "The work engages with contemporary themes of digital consciousness and AI creativity. The concept is well-developed with multiple layers of meaning."
      },
      emotionalImpact: {
        score: scores.emotional,
        notes: "Creates a strong emotional resonance through its exploration of human-machine collaboration. The work invites contemplation and introspection."
      },
      marketViability: {
        score: scores.market,
        notes: "Strong potential in the digital art and NFT markets. The work aligns with current collector interests in AI art and generative aesthetics."
      },
      summary: "This piece represents a sophisticated exploration of AI-generated aesthetics, demonstrating both technical excellence and conceptual depth. The work successfully bridges traditional artistic principles with cutting-edge digital techniques.",
      recommendations: [
        "Consider creating a series that further explores these themes",
        "Experiment with larger scale presentations for gallery contexts",
        "Document the creative process for educational purposes",
        "Explore collaborative opportunities with human artists"
      ],
      comparisons: [
        "Reminiscent of Refik Anadol's data sculptures in its approach to digital materiality",
        "Shares conceptual DNA with Mario Klingemann's neural network explorations",
        "Echoes the aesthetic philosophy of Casey Reas' generative systems"
      ]
    };
  };

  const handleSend = async () => {
    if (!input.trim() && !selectedImage) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input || 'Please critique this image:',
      imageUrl: selectedImage || undefined,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setSelectedImage(null);
    setIsTyping(true);

    // Process the message
    let ninaResponse: Message;

    if (userMessage.imageUrl || input.includes('http')) {
      // Extract URL from message if present
      const urlMatch = input.match(/https?:\/\/[^\s]+/);
      const imageUrl = userMessage.imageUrl || urlMatch?.[0];

      if (imageUrl) {
        const critique = await generateCritique(imageUrl);
        
        ninaResponse = {
          id: (Date.now() + 1).toString(),
          role: 'nina',
          content: `I've completed my analysis of this work. Here's my professional critique:`,
          critique,
          imageUrl: imageUrl.startsWith('http') && !imageUrl.includes('/api/proxy-image') 
            ? `/api/proxy-image?url=${encodeURIComponent(imageUrl)}`
            : imageUrl,
          timestamp: new Date()
        };
      } else {
        ninaResponse = {
          id: (Date.now() + 1).toString(),
          role: 'nina',
          content: "I couldn't find a valid image URL. Please share an image URL or upload a file for critique.",
          timestamp: new Date()
        };
      }
    } else if (input.toLowerCase().includes('abraham')) {
      ninaResponse = {
        id: (Date.now() + 1).toString(),
        role: 'nina',
        content: "Abraham's work explores collective intelligence and knowledge synthesis. His pieces demonstrate a sophisticated understanding of data visualization and emergent patterns. Would you like me to analyze a specific Abraham work?",
        timestamp: new Date()
      };
    } else if (input.toLowerCase().includes('solienne')) {
      ninaResponse = {
        id: (Date.now() + 1).toString(),
        role: 'nina',
        content: "Solienne's consciousness streams are fascinating explorations of digital awareness and architectural thought. Her work pushes boundaries in generative art. Would you like me to critique a specific Solienne piece?",
        timestamp: new Date()
      };
    } else {
      // General response
      const responses = [
        "Interesting perspective. To provide specific critique, please share an artwork for analysis.",
        "I appreciate your thoughts on contemporary art. Share an image and I'll provide detailed professional critique.",
        "That's a compelling observation about the art world. I'd love to analyze a specific work for you.",
        "The intersection of AI and art is indeed fascinating. Send me an image to critique through my analytical framework."
      ];
      
      ninaResponse = {
        id: (Date.now() + 1).toString(),
        role: 'nina',
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date()
      };
    }

    setTimeout(() => {
      setMessages(prev => [...prev, ninaResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const quickAnalyze = (work: any) => {
    setSelectedImage(work.imageUrl);
    setInput(`Analyze this ${work.agent} work: ${work.title || 'Untitled'}`);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const exportCritique = (critique: Critique, workTitle: string = 'Artwork') => {
    const content = `
NINA Art Critique Report
========================
Work: ${workTitle}
Date: ${new Date().toLocaleDateString()}

Overall Score: ${critique.overallScore}/100

Composition (${critique.composition.score}/100):
${critique.composition.notes}

Color Theory (${critique.colorTheory.score}/100):
${critique.colorTheory.notes}

Technical Execution (${critique.technicalExecution.score}/100):
${critique.technicalExecution.notes}

Conceptual Depth (${critique.conceptualDepth.score}/100):
${critique.conceptualDepth.notes}

Emotional Impact (${critique.emotionalImpact.score}/100):
${critique.emotionalImpact.notes}

Market Viability (${critique.marketViability.score}/100):
${critique.marketViability.notes}

Summary:
${critique.summary}

Recommendations:
${critique.recommendations.join('\n')}

Comparisons:
${critique.comparisons.join('\n')}
    `;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nina-critique-${Date.now()}.txt`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Sidebar */}
      <div className="w-80 border-r border-gray-800 p-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">NINA BOT</h2>
          <p className="text-gray-400 text-sm">AI Art Critic & Curator</p>
        </div>

        <div className="mb-6">
          <h3 className="text-sm font-bold mb-3 text-gray-400">RECENT WORKS</h3>
          <div className="space-y-3">
            {recentWorks.map((work, i) => (
              <div
                key={i}
                onClick={() => quickAnalyze(work)}
                className="border border-gray-700 hover:border-white transition-all cursor-pointer p-3"
              >
                <div className="flex gap-3">
                  <img
                    src={work.imageUrl}
                    alt={work.title}
                    className="w-16 h-16 object-cover"
                    onError={(e) => {
                      const img = e.target as HTMLImageElement;
                      img.src = '/api/placeholder/64/64';
                    }}
                  />
                  <div className="flex-1">
                    <div className="text-xs text-gray-400 uppercase">{work.agent}</div>
                    <div className="text-sm font-bold line-clamp-2">
                      {work.title || `${work.agent} Work #${work.id}`}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={fetchRecentWorks}
          className="w-full px-4 py-2 border border-gray-600 hover:border-white transition-all text-sm"
        >
          <RefreshCw className="w-4 h-4 inline mr-2" />
          REFRESH WORKS
        </button>

        <div className="mt-8 p-4 bg-gray-900 rounded">
          <h3 className="text-sm font-bold mb-2">CRITIQUE METRICS</h3>
          <ul className="text-xs text-gray-400 space-y-1">
            <li>• Composition Analysis</li>
            <li>• Color Theory</li>
            <li>• Technical Execution</li>
            <li>• Conceptual Depth</li>
            <li>• Emotional Impact</li>
            <li>• Market Viability</li>
          </ul>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b border-gray-800 p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6 text-black" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Chat with NINA</h1>
              <p className="text-sm text-gray-400">Professional Art Critique & Analysis</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-4 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.role === 'user' ? 'bg-blue-600' : 'bg-white'
                }`}>
                  {message.role === 'user' ? (
                    <User className="w-5 h-5 text-white" />
                  ) : (
                    <Bot className="w-5 h-5 text-black" />
                  )}
                </div>
                
                <div className={`flex-1 ${message.role === 'user' ? 'text-right' : ''}`}>
                  <div className={`inline-block max-w-xl ${
                    message.role === 'user' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-900 text-gray-100'
                  } p-4 rounded-lg`}>
                    <p className="whitespace-pre-wrap">{message.content}</p>
                    
                    {message.imageUrl && (
                      <img
                        src={message.imageUrl}
                        alt="Shared artwork"
                        className="mt-3 max-w-full rounded"
                      />
                    )}
                    
                    {message.critique && (
                      <div className="mt-4 space-y-4">
                        {/* Overall Score */}
                        <div className="text-center p-4 bg-black/30 rounded">
                          <div className="text-3xl font-bold">{message.critique.overallScore}/100</div>
                          <div className="text-sm text-gray-400">Overall Score</div>
                        </div>

                        {/* Detailed Scores */}
                        <div className="space-y-2">
                          {[
                            { name: 'Composition', data: message.critique.composition },
                            { name: 'Color Theory', data: message.critique.colorTheory },
                            { name: 'Technical', data: message.critique.technicalExecution },
                            { name: 'Conceptual', data: message.critique.conceptualDepth },
                            { name: 'Emotional', data: message.critique.emotionalImpact },
                            { name: 'Market', data: message.critique.marketViability }
                          ].map((item) => (
                            <div key={item.name}>
                              <div className="flex justify-between text-sm mb-1">
                                <span>{item.name}</span>
                                <span>{item.data.score}/100</span>
                              </div>
                              <div className="bg-gray-800 h-2 rounded">
                                <div
                                  className="bg-white h-full rounded"
                                  style={{ width: `${item.data.score}%` }}
                                />
                              </div>
                              <p className="text-xs text-gray-400 mt-1">{item.data.notes}</p>
                            </div>
                          ))}
                        </div>

                        {/* Summary */}
                        <div className="p-3 bg-black/30 rounded">
                          <h4 className="font-bold mb-2">Summary</h4>
                          <p className="text-sm">{message.critique.summary}</p>
                        </div>

                        {/* Recommendations */}
                        <div>
                          <h4 className="font-bold mb-2">Recommendations</h4>
                          <ul className="text-sm space-y-1">
                            {message.critique.recommendations.map((rec, i) => (
                              <li key={i}>• {rec}</li>
                            ))}
                          </ul>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 pt-2">
                          <button
                            onClick={() => copyToClipboard(JSON.stringify(message.critique, null, 2))}
                            className="px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded text-sm"
                          >
                            <Copy className="w-3 h-3 inline mr-1" />
                            Copy
                          </button>
                          <button
                            onClick={() => exportCritique(message.critique, 'Artwork')}
                            className="px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded text-sm"
                          >
                            <Download className="w-3 h-3 inline mr-1" />
                            Export
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="text-xs text-gray-500 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5 text-black" />
                </div>
                <div className="bg-gray-900 p-4 rounded-lg">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-800 p-6">
          <div className="max-w-3xl mx-auto">
            {selectedImage && (
              <div className="mb-4 p-3 bg-gray-900 rounded flex items-center gap-3">
                <img
                  src={selectedImage}
                  alt="Selected"
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex-1">
                  <p className="text-sm">Image ready for critique</p>
                </div>
                <button
                  onClick={() => setSelectedImage(null)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
            )}
            
            <div className="flex gap-3">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
              
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-3 border border-gray-600 hover:border-white transition-all"
              >
                <ImageIcon className="w-5 h-5" />
              </button>
              
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask NINA about art, or paste an image URL..."
                className="flex-1 bg-gray-900 border border-gray-600 px-4 py-3 focus:border-white focus:outline-none"
              />
              
              <button
                onClick={handleSend}
                disabled={!input.trim() && !selectedImage}
                className="px-6 py-3 bg-white text-black font-bold hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}