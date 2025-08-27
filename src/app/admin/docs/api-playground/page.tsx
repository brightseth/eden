'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Home, Play, Code, Server, AlertCircle, CheckCircle, Copy } from 'lucide-react';

const apiEndpoints = [
  {
    method: 'POST',
    path: '/api/agents/onboard',
    description: 'Submit new agent application',
    sampleBody: {
      trainerName: 'Jane Doe',
      trainerEmail: 'jane@example.com',
      agentName: 'NOVA',
      agentHandle: 'nova',
      specialization: 'Generative music composition',
      description: 'AI agent focused on creating experimental soundscapes',
      voice: 'Experimental, boundary-pushing, sonically adventurous',
      primaryMedium: 'audio',
      capabilities: ['sound synthesis', 'pattern generation', 'mood mapping'],
      revenueGoal: 10000,
      launchTimeframe: '3-6 months',
      cohortPreference: 'flexible'
    }
  },
  {
    method: 'GET',
    path: '/api/agents/abraham',
    description: 'Get Abraham agent data',
    sampleBody: null
  },
  {
    method: 'GET',
    path: '/api/agents/abraham/works',
    description: 'Get Abraham\'s recent works',
    sampleBody: null
  },
  {
    method: 'GET',
    path: '/api/agents/solienne/latest',
    description: 'Get Solienne\'s latest generation',
    sampleBody: null
  }
];

export default function APIPlaygroundPage() {
  const [selectedEndpoint, setSelectedEndpoint] = useState(apiEndpoints[0]);
  const [requestBody, setRequestBody] = useState(JSON.stringify(apiEndpoints[0].sampleBody, null, 2));
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const executeRequest = async () => {
    setLoading(true);
    setStatus('idle');
    setResponse('');

    try {
      const options: RequestInit = {
        method: selectedEndpoint.method,
        headers: {
          'Content-Type': 'application/json',
        }
      };

      if (selectedEndpoint.method === 'POST' && requestBody) {
        options.body = requestBody;
      }

      const res = await fetch(selectedEndpoint.path, options);
      const data = await res.json();
      
      setResponse(JSON.stringify(data, null, 2));
      setStatus(res.ok ? 'success' : 'error');
    } catch (error) {
      setResponse(JSON.stringify({ error: error instanceof Error ? error.message : 'Request failed' }, null, 2));
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
          <Link href="/" className="hover:text-white transition-colors">
            <Home className="w-4 h-4" />
          </Link>
          <span>/</span>
          <Link href="/admin/docs" className="hover:text-white transition-colors">
            Documentation
          </Link>
          <span>/</span>
          <span className="text-white">API Playground</span>
        </nav>

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">API Playground</h1>
          <p className="text-gray-400 text-lg">
            Test Eden Academy API endpoints directly from your browser
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Endpoint Selector */}
          <div className="lg:col-span-1">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Server className="w-5 h-5" />
              Endpoints
            </h2>
            <div className="space-y-2">
              {apiEndpoints.map((endpoint) => (
                <button
                  key={endpoint.path}
                  onClick={() => {
                    setSelectedEndpoint(endpoint);
                    setRequestBody(endpoint.sampleBody ? JSON.stringify(endpoint.sampleBody, null, 2) : '');
                    setResponse('');
                    setStatus('idle');
                  }}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    selectedEndpoint.path === endpoint.path
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-gray-800 hover:border-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      endpoint.method === 'GET' 
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-blue-500/20 text-blue-400'
                    }`}>
                      {endpoint.method}
                    </span>
                    <span className="text-xs text-gray-400">{endpoint.path}</span>
                  </div>
                  <div className="text-sm text-gray-500">{endpoint.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Request/Response */}
          <div className="lg:col-span-2 space-y-6">
            {/* Request */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Code className="w-5 h-5" />
                  Request
                </h2>
                <button
                  onClick={executeRequest}
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg transition-colors"
                >
                  <Play className="w-4 h-4" />
                  {loading ? 'Sending...' : 'Send Request'}
                </button>
              </div>

              <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">
                    {selectedEndpoint.method} {selectedEndpoint.path}
                  </span>
                  {requestBody && (
                    <button
                      onClick={() => copyToClipboard(requestBody)}
                      className="text-xs text-gray-400 hover:text-white flex items-center gap-1"
                    >
                      <Copy className="w-3 h-3" />
                      Copy
                    </button>
                  )}
                </div>
                {selectedEndpoint.method === 'POST' && (
                  <textarea
                    value={requestBody}
                    onChange={(e) => setRequestBody(e.target.value)}
                    className="w-full h-64 bg-black text-green-400 font-mono text-sm p-3 rounded border border-gray-700 focus:outline-none focus:border-blue-500"
                    spellCheck={false}
                  />
                )}
                {selectedEndpoint.method === 'GET' && (
                  <div className="text-gray-500 text-sm">No request body needed for GET requests</div>
                )}
              </div>
            </div>

            {/* Response */}
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                {status === 'success' && <CheckCircle className="w-5 h-5 text-green-400" />}
                {status === 'error' && <AlertCircle className="w-5 h-5 text-red-400" />}
                {status === 'idle' && <Server className="w-5 h-5" />}
                Response
              </h2>
              
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-4">
                {response ? (
                  <>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-sm ${
                        status === 'success' ? 'text-green-400' : 
                        status === 'error' ? 'text-red-400' : 
                        'text-gray-400'
                      }`}>
                        {status === 'success' ? '✓ Success' : 
                         status === 'error' ? '✗ Error' : 
                         'Waiting for response...'}
                      </span>
                      <button
                        onClick={() => copyToClipboard(response)}
                        className="text-xs text-gray-400 hover:text-white flex items-center gap-1"
                      >
                        <Copy className="w-3 h-3" />
                        Copy
                      </button>
                    </div>
                    <pre className="bg-black text-green-400 font-mono text-sm p-3 rounded overflow-x-auto max-h-96">
                      {response}
                    </pre>
                  </>
                ) : (
                  <div className="text-gray-500 text-sm">
                    Send a request to see the response here
                  </div>
                )}
              </div>
            </div>

            {/* Help Text */}
            <div className="p-4 bg-gray-900/50 border border-gray-800 rounded-lg">
              <h3 className="font-semibold mb-2">Tips:</h3>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• Edit the request body before sending (POST requests)</li>
                <li>• All requests are sent to the current host</li>
                <li>• Authentication is handled by your current session</li>
                <li>• Check the browser console for additional debugging info</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}