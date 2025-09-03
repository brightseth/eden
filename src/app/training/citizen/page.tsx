'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

interface TrainingResult {
  success: boolean;
  message: string;
  updates: any;
  recordId: string;
  syncToRegistry: string;
}

interface SyncStatus {
  syncStatus: {
    inProgress: boolean;
    lastSync: string;
    nextSync: string;
    shouldSyncNow: boolean;
  };
  currentProfile: {
    capabilities: number;
    governanceHealth: number;
    communityEngagement: number;
    brightMomentsContext: {
      totalCitizens: number;
      citiesCompleted: number;
      governanceProposals: number;
    };
  };
}

export default function CitizenTrainingPage() {
  const [trainingContent, setTrainingContent] = useState('');
  const [trainerName, setTrainerName] = useState('Henry');
  const [trainerEmail, setTrainerEmail] = useState('henry@brightmoments.io');
  const [trainingType, setTrainingType] = useState('general');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<TrainingResult | null>(null);
  const [syncStatus, setSyncStatus] = useState<SyncStatus | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  const submitTraining = async () => {
    if (!trainingContent.trim()) {
      alert('Please provide training content');
      return;
    }

    setIsSubmitting(true);
    setResult(null);

    try {
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
      const response = await fetch(`${baseUrl}/api/agents/citizen/training`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trainer: trainerName,
          trainerEmail,
          timestamp: new Date().toISOString(),
          content: trainingContent,
          trainingType,
          brightMomentsUpdate: {
            source: 'henry_training_interface',
            priority: 'high',
            category: trainingType
          }
        })
      });

      const data = await response.json();
      setResult(data);
      
      if (data.success) {
        // Auto-refresh sync status after successful training
        fetchSyncStatus();
        setTrainingContent(''); // Clear form on success
      }
    } catch (error) {
      setResult({
        success: false,
        message: 'Failed to submit training',
        updates: {},
        recordId: '',
        syncToRegistry: 'failed'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchSyncStatus = async () => {
    if (typeof window === 'undefined') return; // Skip during SSR/build
    try {
      const response = await fetch(`/api/agents/citizen/sync`);
      const data = await response.json();
      setSyncStatus(data);
    } catch (error) {
      console.error('Failed to fetch sync status:', error);
    }
  };

  const performSync = async () => {
    if (typeof window === 'undefined') return; // Skip during SSR/build
    setIsSyncing(true);
    try {
      const response = await fetch(`/api/agents/citizen/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ force: true })
      });
      
      const data = await response.json();
      console.log('Sync result:', data);
      
      // Refresh sync status
      fetchSyncStatus();
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  // Load initial sync status
  useState(() => {
    fetchSyncStatus();
  });

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">CITIZEN Training Interface</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Train the official Bright Moments DAO agent with updates to lore, governance, 
            community insights, and general knowledge. All training automatically syncs 
            with the Registry and app.eden.art profile.
          </p>
        </div>

        {/* Current Status */}
        {syncStatus && (
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                CITIZEN Status
                <Badge variant={syncStatus.syncStatus.shouldSyncNow ? "destructive" : "secondary"}>
                  {syncStatus.syncStatus.shouldSyncNow ? "Sync Needed" : "In Sync"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="text-gray-400">Capabilities</div>
                  <div className="text-white font-semibold">{syncStatus.currentProfile.capabilities}</div>
                </div>
                <div>
                  <div className="text-gray-400">DAO Health</div>
                  <div className="text-white font-semibold">{syncStatus.currentProfile.governanceHealth}%</div>
                </div>
                <div>
                  <div className="text-gray-400">CryptoCitizens</div>
                  <div className="text-white font-semibold">{syncStatus.currentProfile.brightMomentsContext.totalCitizens.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-gray-400">Cities Complete</div>
                  <div className="text-white font-semibold">{syncStatus.currentProfile.brightMomentsContext.citiesCompleted}</div>
                </div>
              </div>
              
              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-gray-400">
                  Last Sync: {new Date(syncStatus.syncStatus.lastSync).toLocaleString()}
                </div>
                <Button 
                  onClick={performSync} 
                  disabled={isSyncing}
                  variant="outline"
                  size="sm"
                >
                  {isSyncing ? 'Syncing...' : 'Force Sync'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Training Form */}
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Train CITIZEN</CardTitle>
            <CardDescription className="text-gray-400">
              Provide updates to enhance CITIZEN's knowledge and capabilities
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="trainer-name" className="text-white">Trainer Name</Label>
                <Input
                  id="trainer-name"
                  value={trainerName}
                  onChange={(e) => setTrainerName(e.target.value)}
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
              <div>
                <Label htmlFor="trainer-email" className="text-white">Email</Label>
                <Input
                  id="trainer-email"
                  type="email"
                  value={trainerEmail}
                  onChange={(e) => setTrainerEmail(e.target.value)}
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
              <div>
                <Label htmlFor="training-type" className="text-white">Training Type</Label>
                <Select value={trainingType} onValueChange={setTrainingType}>
                  <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General Update</SelectItem>
                    <SelectItem value="lore_update">Lore & Cultural Heritage</SelectItem>
                    <SelectItem value="governance_update">DAO Governance</SelectItem>
                    <SelectItem value="community_insight">Community Insight</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="training-content" className="text-white">Training Content</Label>
              <Textarea
                id="training-content"
                value={trainingContent}
                onChange={(e) => setTrainingContent(e.target.value)}
                placeholder="Provide updates about Bright Moments lore, governance changes, community insights, or general knowledge..."
                className="bg-gray-800 border-gray-600 text-white min-h-32"
                rows={6}
              />
            </div>

            <Button 
              onClick={submitTraining} 
              disabled={isSubmitting || !trainingContent.trim()}
              className="w-full"
            >
              {isSubmitting ? 'Processing...' : 'Train CITIZEN'}
            </Button>
          </CardContent>
        </Card>

        {/* Training Result */}
        {result && (
          <Alert className={result.success ? "border-green-600" : "border-red-600"}>
            <AlertDescription>
              <div className="space-y-2">
                <div className={result.success ? "text-green-400" : "text-red-400"}>
                  {result.message}
                </div>
                {result.success && (
                  <div className="text-sm text-gray-400">
                    <div>Training ID: {result.recordId}</div>
                    <div>Registry Sync: {result.syncToRegistry}</div>
                    {result.updates && Object.keys(result.updates).length > 0 && (
                      <div className="mt-2">
                        <strong>Processed Updates:</strong>
                        <pre className="text-xs mt-1 bg-gray-800 p-2 rounded">
                          {JSON.stringify(result.updates, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Training Guidelines */}
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Training Guidelines</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div>
                <h4 className="text-white font-semibold mb-2">Lore & Cultural Heritage</h4>
                <ul className="text-gray-400 space-y-1">
                  <li>• Venice Beach origins and significance</li>
                  <li>• IRL minting ritual documentation</li>
                  <li>• City-specific collection stories</li>
                  <li>• Milestone celebrations and achievements</li>
                  <li>• Cultural continuity preservation</li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-2">DAO Governance</h4>
                <ul className="text-gray-400 space-y-1">
                  <li>• Snapshot proposal procedures</li>
                  <li>• Bright Opportunities sub-DAO updates</li>
                  <li>• Token-gated community protocols</li>
                  <li>• Consensus building strategies</li>
                  <li>• Voting mechanism changes</li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-2">Community Insights</h4>
                <ul className="text-gray-400 space-y-1">
                  <li>• Full Set holder recognition updates</li>
                  <li>• Ultra Set collector protocols</li>
                  <li>• Cross-city community connections</li>
                  <li>• Concierge service improvements</li>
                  <li>• Community engagement strategies</li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-2">General Updates</h4>
                <ul className="text-gray-400 space-y-1">
                  <li>• New partnerships or collaborations</li>
                  <li>• Technology or platform updates</li>
                  <li>• Community events and activities</li>
                  <li>• Educational content and resources</li>
                  <li>• Communication improvements</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}