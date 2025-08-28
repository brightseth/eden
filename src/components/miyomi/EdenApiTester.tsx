'use client';

import { useState, useEffect } from 'react';
import { 
  TestTube2, Play, CheckCircle, XCircle, 
  Clock, Zap, AlertTriangle, RefreshCw,
  Video, Download, Eye, Settings
} from 'lucide-react';

interface EdenTestResult {
  success: boolean;
  connectivity?: {
    success: boolean;
    status?: number;
    toolsCount?: number;
    error?: string;
  };
  toolTest?: {
    success: boolean;
    toolInfo?: any;
    costEstimate?: any;
    error?: string;
  };
  mockResponse?: any;
  error?: string;
}

interface EdenTool {
  name: string;
  description: string;
  cost?: number;
  output_type?: string;
}

export default function EdenApiTester() {
  const [isTesting, setIsTesting] = useState(false);
  const [testResults, setTestResults] = useState<EdenTestResult | null>(null);
  const [availableTools, setAvailableTools] = useState<EdenTool[]>([]);
  const [selectedTool, setSelectedTool] = useState('txt2vid');
  const [testPrompt, setTestPrompt] = useState('A professional market analysis visualization showing rising charts and financial data streams in a modern trading floor environment');
  const [apiStatus, setApiStatus] = useState<'unknown' | 'connected' | 'error'>('unknown');

  useEffect(() => {
    checkApiStatus();
  }, []);

  async function checkApiStatus() {
    try {
      const response = await fetch('/api/miyomi/test-eden');
      const data = await response.json();
      
      setApiStatus(data.connectivity?.success ? 'connected' : 'error');
      
      if (data.availableTools?.videoTools) {
        setAvailableTools(data.availableTools.videoTools);
      }
    } catch (error) {
      setApiStatus('error');
      console.error('API status check failed:', error);
    }
  }

  async function runEdenTest() {
    setIsTesting(true);
    setTestResults(null);
    
    try {
      const response = await fetch('/api/miyomi/test-eden', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tool: selectedTool,
          prompt: testPrompt,
          testMode: true
        })
      });

      const result = await response.json();
      setTestResults(result);
      
    } catch (error) {
      setTestResults({
        success: false,
        error: error instanceof Error ? error.message : 'Test failed'
      });
    } finally {
      setIsTesting(false);
    }
  }

  async function generateDemoVideo() {
    if (!testPrompt.trim()) {
      alert('Please enter a prompt first');
      return;
    }

    setIsTesting(true);
    
    try {
      const response = await fetch('/api/miyomi/demo-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: testPrompt,
          style: selectedTool,
          format: 'short'
        })
      });

      const result = await response.json();
      
      if (result.success) {
        setTestResults({
          success: true,
          demoVideo: result.video,
          analytics: result.analytics
        });
      } else {
        alert(`Demo failed: ${result.error}`);
      }

    } catch (error) {
      alert('Demo generation failed');
      console.error('Demo error:', error);
    } finally {
      setIsTesting(false);
    }
  }

  async function generateRealVideo() {
    if (!testPrompt.trim()) {
      alert('Please enter a prompt first');
      return;
    }

    setIsTesting(true);
    
    try {
      // Use our existing video generation API
      const response = await fetch('/api/miyomi/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: testPrompt,
          style: 'creative',
          format: 'short',
          useArtisticFramework: false
        })
      });

      const result = await response.json();
      
      if (result.success) {
        alert(`Video generation started! Video ID: ${result.video.id}`);
        // Could redirect to videos tab or show status
      } else {
        alert(`Generation failed: ${result.error}`);
      }

    } catch (error) {
      alert('Video generation failed');
      console.error('Video generation error:', error);
    } finally {
      setIsTesting(false);
    }
  }

  function getStatusIcon() {
    switch (apiStatus) {
      case 'connected':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-500" />;
    }
  }

  function getStatusText() {
    switch (apiStatus) {
      case 'connected':
        return 'Eden API Connected';
      case 'error':
        return 'Eden API Not Available';
      default:
        return 'Checking Connection...';
    }
  }

  return (
    <div className="space-y-6">
      {/* API Status */}
      <div className="bg-white/5 backdrop-blur rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <TestTube2 className="w-6 h-6 text-blue-500" />
            <h3 className="text-xl font-bold">Eden API Testing</h3>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              {getStatusIcon()}
              <span className="text-sm">{getStatusText()}</span>
            </div>
            
            <button
              onClick={checkApiStatus}
              className="px-3 py-1 bg-white/10 rounded-lg hover:bg-white/20 transition flex items-center gap-2 text-sm"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>

        {availableTools.length > 0 && (
          <div className="bg-black/30 rounded p-3 mb-4">
            <div className="text-sm font-medium text-green-400 mb-2">Available Video Tools</div>
            <div className="grid md:grid-cols-2 gap-2 text-sm">
              {availableTools.map((tool, i) => (
                <div key={i} className="flex items-center justify-between py-1">
                  <span className="font-mono text-blue-300">{tool.name}</span>
                  <span className="text-gray-400">{tool.output_type}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Test Configuration */}
      <div className="bg-white/5 backdrop-blur rounded-lg p-6">
        <h4 className="text-lg font-bold mb-4">Test Video Generation</h4>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Video Generation Tool</label>
            <select
              value={selectedTool}
              onChange={(e) => setSelectedTool(e.target.value)}
              className="w-full p-3 bg-black/50 border border-white/20 rounded-lg text-white"
            >
              <option value="txt2vid">txt2vid - Text to Video</option>
              <option value="txt2vid_fast">txt2vid (fast) - Quick Generation</option>
              <option value="runway">Runway - Advanced Animation</option>
              <option value="veo">Veo - High Quality Video</option>
              <option value="veo2">Veo-2 - Latest Model</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Generation Prompt</label>
            <textarea
              value={testPrompt}
              onChange={(e) => setTestPrompt(e.target.value)}
              placeholder="Describe the video you want to generate..."
              className="w-full p-3 bg-black/50 border border-white/20 rounded-lg text-white placeholder-gray-400 resize-none"
              rows={4}
            />
          </div>

          <div className="grid md:grid-cols-3 gap-3">
            <button
              onClick={runEdenTest}
              disabled={isTesting || !selectedTool.trim()}
              className="bg-blue-600 text-white py-3 px-4 rounded-lg font-bold hover:bg-blue-700 disabled:bg-gray-600 transition-colors flex items-center justify-center gap-2"
            >
              {isTesting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Testing...
                </>
              ) : (
                <>
                  <TestTube2 className="w-4 h-4" />
                  Test API
                </>
              )}
            </button>

            <button
              onClick={generateDemoVideo}
              disabled={isTesting || !testPrompt.trim()}
              className="bg-purple-600 text-white py-3 px-4 rounded-lg font-bold hover:bg-purple-700 disabled:bg-gray-600 transition-colors flex items-center justify-center gap-2"
            >
              {isTesting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Demo...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Demo Mode
                </>
              )}
            </button>

            <button
              onClick={generateRealVideo}
              disabled={isTesting || !testPrompt.trim() || apiStatus !== 'connected'}
              className="bg-red-600 text-white py-3 px-4 rounded-lg font-bold hover:bg-red-700 disabled:bg-gray-600 transition-colors flex items-center justify-center gap-2"
            >
              {isTesting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Real...
                </>
              ) : (
                <>
                  <Video className="w-4 h-4" />
                  Real Video
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Test Results */}
      {testResults && (
        <div className="bg-white/5 backdrop-blur rounded-lg p-6">
          <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
            {testResults.success ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : (
              <XCircle className="w-5 h-5 text-red-500" />
            )}
            Test Results
          </h4>

          {/* Connectivity Results */}
          {testResults.connectivity && (
            <div className="bg-black/30 rounded p-4 mb-4">
              <div className="text-sm font-medium text-blue-400 mb-2">API Connectivity</div>
              {testResults.connectivity.success ? (
                <div className="text-green-400 text-sm">
                  ✅ Connected successfully (HTTP {testResults.connectivity.status})
                  {testResults.connectivity.toolsCount && (
                    <div>Found {testResults.connectivity.toolsCount} available tools</div>
                  )}
                </div>
              ) : (
                <div className="text-red-400 text-sm">
                  ❌ Connection failed: {testResults.connectivity.error}
                </div>
              )}
            </div>
          )}

          {/* Tool Test Results */}
          {testResults.toolTest && (
            <div className="bg-black/30 rounded p-4 mb-4">
              <div className="text-sm font-medium text-purple-400 mb-2">Tool Test: {selectedTool}</div>
              {testResults.toolTest.success ? (
                <div className="text-sm space-y-2">
                  {testResults.toolTest.toolInfo && (
                    <div>
                      <div className="text-green-400">✅ Tool accessible</div>
                      <div className="text-gray-300 ml-4">
                        <div>Description: {testResults.toolTest.toolInfo.description}</div>
                        <div>Output: {testResults.toolTest.toolInfo.output_type}</div>
                        <div>Parameters: {testResults.toolTest.toolInfo.parameters?.join(', ')}</div>
                      </div>
                    </div>
                  )}
                  {testResults.toolTest.costEstimate && (
                    <div className="text-yellow-300">
                      💰 Estimated cost: ${testResults.toolTest.costEstimate.cost || 'Unknown'}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-red-400 text-sm">
                  ❌ Tool test failed: {testResults.toolTest.error}
                </div>
              )}
            </div>
          )}

          {/* Demo Video Results */}
          {testResults.demoVideo && (
            <div className="bg-black/30 rounded p-4 mb-4">
              <div className="text-sm font-medium text-purple-400 mb-2">Demo Video Generated 🎬</div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="text-sm">
                    <div className="text-green-400 mb-2">✅ Video Created Successfully</div>
                    <div><strong>Title:</strong> {testResults.demoVideo.metadata.title}</div>
                    <div><strong>Duration:</strong> {testResults.demoVideo.metadata.duration}s</div>
                    <div><strong>Resolution:</strong> {testResults.demoVideo.metadata.resolution}</div>
                    <div><strong>Processing Time:</strong> {testResults.demoVideo.metadata.processingTime}</div>
                    <div><strong>Estimated Cost:</strong> {testResults.demoVideo.metadata.cost}</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm">
                    <div className="text-blue-400 mb-2">📊 Analytics Prediction</div>
                    <div><strong>Est. Views:</strong> {testResults.analytics.estimatedViews.toLocaleString()}</div>
                    <div><strong>Engagement:</strong> {testResults.analytics.engagementScore}/100</div>
                    <div><strong>Viral Potential:</strong> {testResults.analytics.viralPotential}</div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => window.open(testResults.demoVideo.url, '_blank')}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  View Demo Video
                </button>
                <button
                  onClick={() => window.open(testResults.demoVideo.thumbnail, '_blank')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  View Thumbnail
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(JSON.stringify(testResults.demoVideo, null, 2));
                    alert('Video metadata copied to clipboard!');
                  }}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Copy Data
                </button>
              </div>
            </div>
          )}

          {/* Mock Response */}
          {testResults.mockResponse && (
            <div className="bg-black/30 rounded p-4">
              <div className="text-sm font-medium text-orange-400 mb-2">Mock Response (API Not Available)</div>
              <div className="text-sm space-y-1">
                <div>Task ID: {testResults.mockResponse.mockTask.id}</div>
                <div>Status: {testResults.mockResponse.mockTask.status}</div>
                <div>Video URL: {testResults.mockResponse.mockTask.output.output_video}</div>
                <div>Estimated Cost: ${testResults.mockResponse.mockTask.cost.toFixed(2)}</div>
              </div>
              
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => window.open(testResults.mockResponse.mockTask.output.output_video, '_blank')}
                  className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition flex items-center gap-1"
                >
                  <Play className="w-3 h-3" />
                  Preview
                </button>
                <button
                  onClick={() => {
                    const a = document.createElement('a');
                    a.href = testResults.mockResponse.mockTask.output.output_video;
                    a.download = `miyomi-test-${Date.now()}.mp4`;
                    a.click();
                  }}
                  className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition flex items-center gap-1"
                >
                  <Download className="w-3 h-3" />
                  Download
                </button>
              </div>
            </div>
          )}

          {/* Error Display */}
          {testResults.error && (
            <div className="bg-red-900/20 border border-red-500/20 rounded p-4">
              <div className="text-red-400 text-sm">
                <AlertTriangle className="w-4 h-4 inline mr-2" />
                {testResults.error}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Usage Instructions */}
      <div className="bg-white/5 backdrop-blur rounded-lg p-6">
        <h4 className="text-lg font-bold mb-3 flex items-center gap-2">
          <Settings className="w-5 h-5 text-gray-400" />
          How to Use
        </h4>
        
        <div className="text-sm text-gray-300 space-y-2">
          <div>1. <strong>Test Connection:</strong> Click "Test Connection & Pricing" to verify Eden API access</div>
          <div>2. <strong>Check Tools:</strong> See which video generation tools are available</div>
          <div>3. <strong>Generate Video:</strong> Click "Generate Real Video" to create actual content</div>
          <div>4. <strong>Environment Variable:</strong> Set <code className="bg-black/50 px-1">EDEN_API_KEY</code> for real API access</div>
        </div>
      </div>
    </div>
  );
}