'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface TrainingSubmission {
  id: string;
  trainer: string;
  timestamp: string;
  responseCount: number;
  responses: Record<string, any>;
  status: string;
}

export default function BerthaTrainingAdmin() {
  const [submissions, setSubmissions] = useState<TrainingSubmission[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<TrainingSubmission | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const response = await fetch('/api/admin/bertha-training');
      if (response.ok) {
        const data = await response.json();
        setSubmissions(data.submissions || []);
      } else {
        console.error('Failed to fetch submissions:', response.statusText);
        // Show placeholder if API fails
        setSubmissions([
          {
            id: 'training-placeholder',
            trainer: 'Amanda Schmitt',
            timestamp: new Date().toISOString(),
            responseCount: 0,
            responses: {},
            status: 'awaiting_data'
          }
        ]);
      }
    } catch (error) {
      console.error('Failed to fetch submissions:', error);
      setSubmissions([]);
    } finally {
      setLoading(false);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">BERTHA Training Data</h1>
            <p className="text-gray-400">Monitor and review training submissions</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => { setLoading(true); fetchSubmissions(); }}
              className="px-4 py-2 border border-green-500 hover:bg-green-500 transition-colors"
            >
              🔄 Refresh Data
            </button>
            <Link 
              href="/sites/bertha/interview"
              className="px-4 py-2 border border-purple-500 hover:bg-purple-500 transition-colors"
            >
              View Interview Form
            </Link>
            <Link 
              href="/academy/agent/bertha"
              className="px-4 py-2 border border-blue-500 hover:bg-blue-500 transition-colors"
            >
              View BERTHA Profile
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">Loading submissions...</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Submissions List */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">Training Submissions</h2>
              
              {submissions.length === 0 ? (
                <div className="border border-gray-800 p-6 rounded bg-gray-950">
                  <p className="text-gray-400 text-center">No submissions yet</p>
                  <p className="text-sm text-gray-500 text-center mt-2">
                    Complete the trainer interview to see data here
                  </p>
                </div>
              ) : (
                submissions.map((submission) => (
                  <div
                    key={submission.id}
                    className={`border border-gray-800 p-4 rounded cursor-pointer transition-colors ${
                      selectedSubmission?.id === submission.id ? 'bg-purple-900/20 border-purple-500' : 'bg-gray-950 hover:border-gray-600'
                    }`}
                    onClick={() => setSelectedSubmission(submission)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{submission.trainer}</h3>
                        <p className="text-sm text-gray-400">{formatTimestamp(submission.timestamp)}</p>
                        <p className="text-sm text-gray-500">{submission.responseCount} responses</p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded ${
                        submission.status === 'processed' ? 'bg-green-900 text-green-200' :
                        submission.status === 'awaiting_data' ? 'bg-yellow-900 text-yellow-200' :
                        'bg-gray-800 text-gray-300'
                      }`}>
                        {submission.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Response Details */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Response Details</h2>
              
              {selectedSubmission ? (
                <div className="border border-gray-800 p-6 rounded bg-gray-950">
                  <div className="mb-6">
                    <h3 className="font-semibold mb-2">Submission Info</h3>
                    <div className="space-y-1 text-sm text-gray-400">
                      <p><span className="text-white">ID:</span> {selectedSubmission.id}</p>
                      <p><span className="text-white">Trainer:</span> {selectedSubmission.trainer}</p>
                      <p><span className="text-white">Time:</span> {formatTimestamp(selectedSubmission.timestamp)}</p>
                      <p><span className="text-white">Status:</span> {selectedSubmission.status}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-4">Responses</h3>
                    {Object.keys(selectedSubmission.responses).length === 0 ? (
                      <p className="text-gray-500 text-center py-8">
                        No response data available yet.<br/>
                        Complete the interview form to populate this section.
                      </p>
                    ) : (
                      <div className="space-y-4 max-h-96 overflow-y-auto">
                        {Object.entries(selectedSubmission.responses).map(([key, value]) => (
                          <div key={key} className="border border-gray-700 p-3 rounded">
                            <p className="font-medium text-sm mb-2 text-purple-300">{key}</p>
                            <p className="text-sm text-gray-300">
                              {Array.isArray(value) ? value.join(', ') : String(value)}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="border border-gray-800 p-6 rounded bg-gray-950 text-center text-gray-500">
                  Select a submission to view details
                </div>
              )}
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-12 border border-blue-800 bg-blue-950/20 p-6 rounded">
          <h3 className="font-semibold text-blue-200 mb-3">📊 Checking Training Data</h3>
          <div className="space-y-2 text-sm text-blue-100">
            <p><strong>Method 1 - Server Logs:</strong> All submissions are logged to Vercel's function logs with detailed response data</p>
            <p><strong>Method 2 - This Dashboard:</strong> Currently shows placeholder data - in production would connect to database</p>
            <p><strong>Method 3 - CSV Export:</strong> Interview form automatically downloads CSV with all responses</p>
            <p><strong>Method 4 - Console Output:</strong> Each API call logs training record details to server console</p>
          </div>
        </div>
      </div>
    </div>
  );
}