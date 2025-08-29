'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, Users, Calendar, Clock, CheckCircle, AlertCircle, 
  Plus, Send, MessageSquare, RefreshCw, Settings, Award,
  FileText, Vote, TrendingUp, Monitor
} from 'lucide-react';
import { UnifiedHeader } from '@/components/layout/UnifiedHeader';

interface TrainerProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  level: 'primary' | 'secondary' | 'admin';
  permissions: string[];
  status: 'active' | 'inactive';
  lastTraining?: string;
  trainingCount: number;
  joinedAt: string;
}

interface TrainingSession {
  id: string;
  agent: string;
  created_by: string;
  collaborators: string[];
  status: 'active' | 'completed' | 'paused';
  created_at: string;
  last_activity: string;
  training_submissions: TrainingSubmission[];
  sync_status: {
    registry_synced: boolean;
    app_eden_synced: boolean;
    last_sync: string | null;
  };
}

interface TrainingSubmission {
  id: string;
  session_id: string;
  trainer: string;
  content: string;
  training_type: string;
  submitted_at: string;
  status: 'pending' | 'approved' | 'rejected' | 'applied';
  reviews: TrainingReview[];
}

interface TrainingReview {
  reviewer: string;
  status: 'approved' | 'rejected' | 'needs_changes';
  feedback: string;
  reviewed_at: string;
  technical_review: {
    accuracy: number;
    completeness: number;
    bright_moments_alignment: number;
    cultural_sensitivity: number;
  };
}

interface DashboardData {
  trainers: TrainerProfile[];
  sessions: {
    total: number;
    active: number;
    completed: number;
  };
  training_sessions: TrainingSession[];
  pending_review: {
    total_items: number;
    high_priority: number;
    consensus_needed: number;
    ready_to_apply: number;
  };
  training_items: any[];
}

export default function CitizenDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedView, setSelectedView] = useState<'overview' | 'sessions' | 'training' | 'review'>('overview');
  const [currentTrainer, setCurrentTrainer] = useState('henry');

  // New session form
  const [showNewSession, setShowNewSession] = useState(false);
  const [sessionForm, setSessionForm] = useState({
    collaborators: ['keith'],
    description: '',
    duration: 60
  });

  // Training submission form
  const [showTrainingForm, setShowTrainingForm] = useState(false);
  const [trainingForm, setTrainingForm] = useState({
    content: '',
    trainingType: 'general' as 'lore_update' | 'governance_update' | 'community_insight' | 'general',
    sessionId: ''
  });

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [trainersRes, sessionsRes, reviewRes] = await Promise.all([
        fetch('/api/agents/citizen/trainers?sessions=true&history=true'),
        fetch('/api/agents/citizen/trainers/sessions?submissions=true'),
        fetch('/api/agents/citizen/trainers/review')
      ]);

      const trainersData = await trainersRes.json();
      const sessionsData = await sessionsRes.json();
      const reviewData = await reviewRes.json();

      setData({
        trainers: trainersData.trainers || [],
        sessions: sessionsData.sessions || { total: 0, active: 0, completed: 0 },
        training_sessions: sessionsData.training_sessions || [],
        pending_review: reviewData.pending_review || { total_items: 0, high_priority: 0, consensus_needed: 0, ready_to_apply: 0 },
        training_items: reviewData.training_items || []
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const createSession = async () => {
    try {
      const response = await fetch('/api/agents/citizen/trainers/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trainer: currentTrainer,
          sessionType: 'collaborative',
          collaborators: sessionForm.collaborators,
          description: sessionForm.description || 'Collaborative CITIZEN training session',
          duration: sessionForm.duration
        })
      });

      if (response.ok) {
        setShowNewSession(false);
        setSessionForm({ collaborators: ['keith'], description: '', duration: 60 });
        fetchDashboardData();
      }
    } catch (error) {
      console.error('Failed to create session:', error);
    }
  };

  const submitTraining = async () => {
    try {
      const response = await fetch('/api/agents/citizen/training', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trainer: currentTrainer,
          trainerEmail: `${currentTrainer}@brightmoments.io`,
          content: trainingForm.content,
          trainingType: trainingForm.trainingType,
          sessionId: trainingForm.sessionId
        })
      });

      if (response.ok) {
        setShowTrainingForm(false);
        setTrainingForm({ content: '', trainingType: 'general', sessionId: '' });
        fetchDashboardData();
      }
    } catch (error) {
      console.error('Failed to submit training:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <UnifiedHeader />
        <div className="max-w-7xl mx-auto px-6 py-16 text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" />
          <div>Loading CITIZEN Dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <UnifiedHeader />
      
      {/* Header */}
      <div className="border-b border-white">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                href="/academy/agent/citizen" 
                className="flex items-center gap-2 hover:bg-white hover:text-black px-2 py-1 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                BACK TO CITIZEN
              </Link>
              <span className="text-gray-500">|</span>
              <h1 className="text-xl font-bold">CITIZEN TRAINER DASHBOARD</h1>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={currentTrainer}
                onChange={(e) => setCurrentTrainer(e.target.value)}
                className="bg-black border border-white px-3 py-1 text-sm"
              >
                <option value="henry">Henry (Lead Trainer)</option>
                <option value="keith">Keith (BM Team)</option>
                <option value="seth">Seth (System Admin)</option>
              </select>
              <button
                onClick={fetchDashboardData}
                className="p-2 border border-white hover:bg-white hover:text-black transition-all"
                title="Refresh data"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <span className="px-3 py-1 border border-green-400 text-green-400 text-sm">
                TRAINING ACTIVE
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* View Selector */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1">
            {(['overview', 'sessions', 'training', 'review'] as const).map(view => (
              <button
                key={view}
                onClick={() => setSelectedView(view)}
                className={`px-6 py-3 uppercase text-sm transition-all ${
                  selectedView === view 
                    ? 'bg-white text-black' 
                    : 'hover:bg-gray-900'
                }`}
              >
                {view === 'overview' && <Monitor className="w-4 h-4 inline mr-2" />}
                {view === 'sessions' && <Users className="w-4 h-4 inline mr-2" />}
                {view === 'training' && <FileText className="w-4 h-4 inline mr-2" />}
                {view === 'review' && <Vote className="w-4 h-4 inline mr-2" />}
                {view}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Overview */}
        {selectedView === 'overview' && (
          <div className="space-y-8">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="border border-gray-800 p-4">
                <div className="text-3xl font-bold text-green-400">
                  {data?.trainers?.filter(t => t.status === 'active').length || 0}
                </div>
                <div className="text-xs text-gray-400 mt-1">ACTIVE TRAINERS</div>
              </div>
              <div className="border border-gray-800 p-4">
                <div className="text-3xl font-bold">
                  {data?.sessions?.active || 0}
                </div>
                <div className="text-xs text-gray-400 mt-1">ACTIVE SESSIONS</div>
              </div>
              <div className="border border-gray-800 p-4">
                <div className="text-3xl font-bold text-yellow-400">
                  {data?.pending_review?.total_items || 0}
                </div>
                <div className="text-xs text-gray-400 mt-1">PENDING REVIEW</div>
              </div>
              <div className="border border-gray-800 p-4">
                <div className="text-3xl font-bold text-blue-400">
                  {data?.pending_review?.ready_to_apply || 0}
                </div>
                <div className="text-xs text-gray-400 mt-1">READY TO APPLY</div>
              </div>
            </div>

            {/* Authorized Trainers */}
            <div className="border border-white p-6">
              <h2 className="text-2xl mb-4 flex items-center gap-2">
                <Users className="w-5 h-5" />
                AUTHORIZED TRAINERS
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {data?.trainers?.map((trainer) => (
                  <div key={trainer.id} className="border border-gray-800 p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-bold">{trainer.name}</div>
                        <div className="text-sm text-gray-400">{trainer.role}</div>
                      </div>
                      <div className={`px-2 py-1 text-xs border ${
                        trainer.status === 'active' ? 'border-green-400 text-green-400' : 'border-gray-600 text-gray-400'
                      }`}>
                        {trainer.status.toUpperCase()}
                      </div>
                    </div>
                    <div className="text-xs space-y-1">
                      <div className="flex justify-between">
                        <span>Level:</span>
                        <span className="text-green-400">{trainer.level}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Training Count:</span>
                        <span>{trainer.trainingCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Permissions:</span>
                        <span>{trainer.permissions.length}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border border-gray-800 p-6">
                <h3 className="text-xl mb-4">QUICK ACTIONS</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => setShowNewSession(true)}
                    className="w-full py-2 border border-white hover:bg-white hover:text-black transition-all"
                  >
                    <Plus className="w-4 h-4 inline mr-2" />
                    CREATE NEW SESSION
                  </button>
                  <button
                    onClick={() => setShowTrainingForm(true)}
                    className="w-full py-2 border border-green-400 text-green-400 hover:bg-green-400 hover:text-black transition-all"
                  >
                    <FileText className="w-4 h-4 inline mr-2" />
                    SUBMIT TRAINING
                  </button>
                  <button
                    onClick={() => setSelectedView('review')}
                    className="w-full py-2 border border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-black transition-all"
                  >
                    <Vote className="w-4 h-4 inline mr-2" />
                    REVIEW SUBMISSIONS
                  </button>
                </div>
              </div>

              <div className="border border-gray-800 p-6">
                <h3 className="text-xl mb-4">SYSTEM STATUS</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span>Registry Sync:</span>
                    <span className="text-green-400">OPERATIONAL</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>app.eden.art Sync:</span>
                    <span className="text-green-400">OPERATIONAL</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Claude SDK:</span>
                    <span className="text-green-400">CONNECTED</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>BM Integration:</span>
                    <span className="text-green-400">READY</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Sessions View */}
        {selectedView === 'sessions' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl">TRAINING SESSIONS</h2>
              <button
                onClick={() => setShowNewSession(true)}
                className="px-4 py-2 border border-white hover:bg-white hover:text-black transition-all"
              >
                <Plus className="w-4 h-4 inline mr-2" />
                NEW SESSION
              </button>
            </div>

            <div className="grid gap-4">
              {data?.training_sessions?.map((session) => (
                <div key={session.id} className="border border-gray-800 p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="font-bold text-lg">Session: {session.id}</div>
                      <div className="text-sm text-gray-400">Created by {session.created_by}</div>
                    </div>
                    <div className={`px-3 py-1 text-sm border ${
                      session.status === 'active' ? 'border-green-400 text-green-400' :
                      session.status === 'completed' ? 'border-blue-400 text-blue-400' :
                      'border-yellow-400 text-yellow-400'
                    }`}>
                      {session.status.toUpperCase()}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="text-sm text-gray-400 mb-2">Collaborators:</div>
                      <div className="flex gap-2">
                        {session.collaborators.map((collab) => (
                          <span key={collab} className="px-2 py-1 border border-gray-600 text-xs">
                            {collab}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-400 mb-2">Sync Status:</div>
                      <div className="text-xs space-y-1">
                        <div className="flex justify-between">
                          <span>Registry:</span>
                          <span className={session.sync_status.registry_synced ? 'text-green-400' : 'text-gray-400'}>
                            {session.sync_status.registry_synced ? 'SYNCED' : 'PENDING'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>app.eden.art:</span>
                          <span className={session.sync_status.app_eden_synced ? 'text-green-400' : 'text-gray-400'}>
                            {session.sync_status.app_eden_synced ? 'SYNCED' : 'PENDING'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-xs text-gray-400">
                    <span>Created: {new Date(session.created_at).toLocaleDateString()}</span>
                    <span>Last Activity: {new Date(session.last_activity).toLocaleDateString()}</span>
                    <span>{session.training_submissions.length} submissions</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Training View */}
        {selectedView === 'training' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl">SUBMIT TRAINING</h2>
              <button
                onClick={() => setShowTrainingForm(true)}
                className="px-4 py-2 border border-green-400 text-green-400 hover:bg-green-400 hover:text-black transition-all"
              >
                <Send className="w-4 h-4 inline mr-2" />
                NEW SUBMISSION
              </button>
            </div>

            <div className="border border-white p-6">
              <h3 className="text-xl mb-4">TRAINING TYPES</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border border-gray-800 p-4">
                  <div className="font-bold mb-2">Lore Update</div>
                  <div className="text-sm text-gray-400">Cultural heritage, ritual documentation, city histories</div>
                </div>
                <div className="border border-gray-800 p-4">
                  <div className="font-bold mb-2">Governance Update</div>
                  <div className="text-sm text-gray-400">DAO mechanics, voting procedures, treasury management</div>
                </div>
                <div className="border border-gray-800 p-4">
                  <div className="font-bold mb-2">Community Insight</div>
                  <div className="text-sm text-gray-400">Collector recognition, concierge protocols, engagement</div>
                </div>
                <div className="border border-gray-800 p-4">
                  <div className="font-bold mb-2">General</div>
                  <div className="text-sm text-gray-400">Broad updates, partnerships, events, platform changes</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Review View */}
        {selectedView === 'review' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl">TRAINING REVIEW</h2>
              <div className="flex gap-2">
                <span className="px-3 py-1 border border-yellow-400 text-yellow-400 text-sm">
                  {data?.pending_review?.total_items || 0} PENDING
                </span>
                <span className="px-3 py-1 border border-green-400 text-green-400 text-sm">
                  {data?.pending_review?.ready_to_apply || 0} READY
                </span>
              </div>
            </div>

            {data?.training_items && data.training_items.length > 0 ? (
              <div className="grid gap-4">
                {data.training_items.map((item: any) => (
                  <div key={item.id} className="border border-gray-800 p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="font-bold">Training from {item.trainer}</div>
                        <div className="text-sm text-gray-400">Type: {item.training_type}</div>
                      </div>
                      <div className={`px-3 py-1 text-sm border ${
                        item.status === 'approved' ? 'border-green-400 text-green-400' :
                        item.status === 'rejected' ? 'border-red-400 text-red-400' :
                        'border-yellow-400 text-yellow-400'
                      }`}>
                        {item.status.toUpperCase()}
                      </div>
                    </div>

                    <div className="border border-gray-700 p-4 mb-4 bg-gray-900">
                      <div className="text-sm">{item.content.substring(0, 200)}...</div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-400 mb-2">Review Status:</div>
                        <div className="text-xs space-y-1">
                          <div className="flex justify-between">
                            <span>Approvals:</span>
                            <span className="text-green-400">{item.review_context?.approval_count || 0}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Rejections:</span>
                            <span className="text-red-400">{item.review_context?.rejection_count || 0}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Consensus:</span>
                            <span className={item.review_context?.consensus_reached ? 'text-green-400' : 'text-gray-400'}>
                              {item.review_context?.consensus_reached ? 'REACHED' : 'NEEDED'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-400 mb-2">Actions:</div>
                        <div className="flex gap-2">
                          <button className="flex-1 py-1 text-xs border border-green-400 text-green-400 hover:bg-green-400 hover:text-black transition-all">
                            <CheckCircle className="w-3 h-3 inline mr-1" />
                            APPROVE
                          </button>
                          <button className="flex-1 py-1 text-xs border border-red-400 text-red-400 hover:bg-red-400 hover:text-black transition-all">
                            <AlertCircle className="w-3 h-3 inline mr-1" />
                            REJECT
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="border border-gray-800 p-8 text-center">
                <MessageSquare className="w-8 h-8 mx-auto mb-4 text-gray-600" />
                <div className="text-gray-400">No training submissions pending review</div>
              </div>
            )}
          </div>
        )}

      </div>

      {/* New Session Modal */}
      {showNewSession && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-black border border-white p-6 max-w-md w-full mx-4">
            <h3 className="text-xl mb-4">CREATE NEW SESSION</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Collaborators:</label>
                <div className="space-y-2">
                  {['keith', 'seth'].map(name => (
                    <label key={name} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={sessionForm.collaborators.includes(name)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSessionForm(prev => ({
                              ...prev,
                              collaborators: [...prev.collaborators, name]
                            }));
                          } else {
                            setSessionForm(prev => ({
                              ...prev,
                              collaborators: prev.collaborators.filter(c => c !== name)
                            }));
                          }
                        }}
                        className="border border-gray-600"
                      />
                      <span className="text-sm">{name} ({name === 'seth' ? 'System Admin' : 'BM Team'})</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Description:</label>
                <input
                  type="text"
                  value={sessionForm.description}
                  onChange={(e) => setSessionForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full bg-black border border-gray-600 px-3 py-2 text-sm"
                  placeholder="Optional session description"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Duration (minutes):</label>
                <input
                  type="number"
                  value={sessionForm.duration}
                  onChange={(e) => setSessionForm(prev => ({ ...prev, duration: parseInt(e.target.value) || 60 }))}
                  className="w-full bg-black border border-gray-600 px-3 py-2 text-sm"
                  min="15"
                  max="480"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={createSession}
                className="flex-1 py-2 bg-white text-black hover:bg-gray-200 transition-all"
              >
                CREATE SESSION
              </button>
              <button
                onClick={() => setShowNewSession(false)}
                className="flex-1 py-2 border border-gray-600 hover:border-white transition-all"
              >
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Training Submission Modal */}
      {showTrainingForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-black border border-white p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <h3 className="text-xl mb-4">SUBMIT TRAINING</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Training Type:</label>
                <select
                  value={trainingForm.trainingType}
                  onChange={(e) => setTrainingForm(prev => ({ 
                    ...prev, 
                    trainingType: e.target.value as 'lore_update' | 'governance_update' | 'community_insight' | 'general'
                  }))}
                  className="w-full bg-black border border-gray-600 px-3 py-2 text-sm"
                >
                  <option value="general">General - Broad updates, partnerships, events</option>
                  <option value="lore_update">Lore Update - Cultural heritage, ritual documentation</option>
                  <option value="governance_update">Governance Update - DAO mechanics, voting procedures</option>
                  <option value="community_insight">Community Insight - Collector recognition, engagement</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Session ID (optional):</label>
                <select
                  value={trainingForm.sessionId}
                  onChange={(e) => setTrainingForm(prev => ({ ...prev, sessionId: e.target.value }))}
                  className="w-full bg-black border border-gray-600 px-3 py-2 text-sm"
                >
                  <option value="">Select session (optional)</option>
                  {data?.training_sessions?.filter(s => s.status === 'active').map(session => (
                    <option key={session.id} value={session.id}>
                      {session.id} (created by {session.created_by})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Training Content:</label>
                <textarea
                  value={trainingForm.content}
                  onChange={(e) => setTrainingForm(prev => ({ ...prev, content: e.target.value }))}
                  className="w-full bg-black border border-gray-600 px-3 py-2 text-sm h-40"
                  placeholder="Enter your training content here. Be specific about what CITIZEN should learn..."
                  required
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={submitTraining}
                disabled={!trainingForm.content.trim()}
                className="flex-1 py-2 bg-green-400 text-black hover:bg-green-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                SUBMIT TRAINING
              </button>
              <button
                onClick={() => setShowTrainingForm(false)}
                className="flex-1 py-2 border border-gray-600 hover:border-white transition-all"
              >
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}