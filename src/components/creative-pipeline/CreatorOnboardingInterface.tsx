/**
 * Creator Onboarding Interface
 * 
 * Complete UI for the creator-to-agent pipeline onboarding process.
 * Maintains Eden Academy's cultural design principles and user experience.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Types
type OnboardingStage = 
  | 'portfolio-submission'
  | 'cultural-alignment-check'
  | 'skill-assessment'
  | 'agent-potential-mapping'
  | 'academy-integration'
  | 'training-path-selection'
  | 'completed';

interface CreatorProfile {
  id: string;
  onboardingStage: OnboardingStage;
  culturalAlignment: number;
  readinessScore: number;
  createdAt: string;
  progress: number;
}

interface OnboardingInterfaceProps {
  userId: string;
  initialProfile?: CreatorProfile;
  onProfileUpdate?: (profile: CreatorProfile) => void;
}

const STAGE_LABELS = {
  'portfolio-submission': 'Portfolio Submission',
  'cultural-alignment-check': 'Cultural Alignment',
  'skill-assessment': 'Skill Assessment',
  'agent-potential-mapping': 'Agent Matching',
  'academy-integration': 'Academy Integration',
  'training-path-selection': 'Training Path',
  'completed': 'Completed'
};

const STAGE_DESCRIPTIONS = {
  'portfolio-submission': 'Share your creative work to help us understand your artistic voice',
  'cultural-alignment-check': 'Explore how your values align with Eden Academy\'s mission',
  'skill-assessment': 'Assess your current skills and learning potential',
  'agent-potential-mapping': 'Discover your ideal AI agent collaboration opportunities',
  'academy-integration': 'Integrate with the Academy community and training programs',
  'training-path-selection': 'Choose your specialized AI collaboration training path',
  'completed': 'Ready to begin your AI creative collaboration journey!'
};

export function CreatorOnboardingInterface({ 
  userId, 
  initialProfile, 
  onProfileUpdate 
}: OnboardingInterfaceProps) {
  const [profile, setProfile] = useState<CreatorProfile | null>(initialProfile || null);
  const [loading, setLoading] = useState(!initialProfile);
  const [error, setError] = useState<string | null>(null);
  const [currentStageData, setCurrentStageData] = useState<any>({});
  const [submitting, setSubmitting] = useState(false);

  // Initialize profile if not provided
  useEffect(() => {
    if (!profile && userId) {
      initializeProfile();
    }
  }, [userId, profile]);

  const initializeProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/v1beta/creative-pipeline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          referralSource: 'direct',
          culturalMotivation: 'AI creative collaboration exploration'
        })
      });

      const data = await response.json();
      
      if (data.success) {
        const newProfile = {
          id: data.data.creatorProfile.id,
          onboardingStage: data.data.creatorProfile.onboardingStage,
          culturalAlignment: data.data.creatorProfile.culturalAlignment,
          readinessScore: data.data.creatorProfile.readinessScore,
          createdAt: data.data.creatorProfile.createdAt,
          progress: calculateProgress(data.data.creatorProfile.onboardingStage)
        };
        
        setProfile(newProfile);
        onProfileUpdate?.(newProfile);
      } else {
        setError(data.message || 'Failed to initialize creator profile');
      }
    } catch (err) {
      console.error('Profile initialization error:', err);
      setError('Unable to connect to Academy systems. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const calculateProgress = (stage: OnboardingStage): number => {
    const stageOrder = [
      'portfolio-submission',
      'cultural-alignment-check',
      'skill-assessment', 
      'agent-potential-mapping',
      'academy-integration',
      'training-path-selection',
      'completed'
    ];
    const index = stageOrder.indexOf(stage);
    return Math.round(((index + 1) / stageOrder.length) * 100);
  };

  const submitStageData = async () => {
    if (!profile) return;

    try {
      setSubmitting(true);
      setError(null);

      const response = await fetch('/api/v1beta/creative-pipeline/assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          creatorId: profile.id,
          assessmentType: profile.onboardingStage,
          data: currentStageData
        })
      });

      const data = await response.json();
      
      if (data.success && data.data.result.success) {
        // Update profile with new stage
        const updatedProfile = {
          ...profile,
          onboardingStage: data.data.result.nextStage,
          progress: calculateProgress(data.data.result.nextStage)
        };
        
        setProfile(updatedProfile);
        setCurrentStageData({});
        onProfileUpdate?.(updatedProfile);
      } else {
        setError(data.data?.result?.culturalGuidance || data.message || 'Assessment submission failed');
      }
    } catch (err) {
      console.error('Stage submission error:', err);
      setError('Unable to submit assessment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStageContent = () => {
    if (!profile) return null;

    switch (profile.onboardingStage) {
      case 'portfolio-submission':
        return <PortfolioSubmissionStage 
          data={currentStageData}
          onChange={setCurrentStageData}
        />;
      case 'cultural-alignment-check':
        return <CulturalAlignmentStage 
          data={currentStageData}
          onChange={setCurrentStageData}
        />;
      case 'skill-assessment':
        return <SkillAssessmentStage 
          data={currentStageData}
          onChange={setCurrentStageData}
        />;
      case 'agent-potential-mapping':
        return <AgentMappingStage 
          data={currentStageData}
          onChange={setCurrentStageData}
        />;
      case 'academy-integration':
        return <AcademyIntegrationStage 
          data={currentStageData}
          onChange={setCurrentStageData}
        />;
      case 'training-path-selection':
        return <TrainingPathSelectionStage 
          data={currentStageData}
          onChange={setCurrentStageData}
        />;
      case 'completed':
        return <CompletedStage profile={profile} />;
      default:
        return <div>Unknown stage</div>;
    }
  };

  if (loading) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-8">
          <div className="flex items-center justify-center space-x-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p>Initializing your Academy journey...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-8">
          <Alert>
            <p>{error}</p>
          </Alert>
          <Button 
            onClick={initializeProfile} 
            className="mt-4"
          >
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!profile) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-8">
          <p>No profile found. Please refresh the page.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Progress Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Eden Academy Creative Journey</CardTitle>
              <CardDescription>
                Discover your perfect AI creative collaboration
              </CardDescription>
            </div>
            <Badge variant="outline">
              {profile.progress}% Complete
            </Badge>
          </div>
          <div className="mt-4">
            <Progress value={profile.progress} className="w-full" />
            <p className="text-sm text-muted-foreground mt-2">
              Current Stage: {STAGE_LABELS[profile.onboardingStage]}
            </p>
          </div>
        </CardHeader>
      </Card>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle>{STAGE_LABELS[profile.onboardingStage]}</CardTitle>
          <CardDescription>
            {STAGE_DESCRIPTIONS[profile.onboardingStage]}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          {renderStageContent()}
          
          {profile.onboardingStage !== 'completed' && (
            <div className="mt-8 flex justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-sm text-muted-foreground">
                  Cultural Alignment: {profile.culturalAlignment}%
                </div>
                <div className="text-sm text-muted-foreground">
                  Readiness Score: {profile.readinessScore}%
                </div>
              </div>
              <Button 
                onClick={submitStageData}
                disabled={submitting || Object.keys(currentStageData).length === 0}
              >
                {submitting ? 'Processing...' : 'Continue Journey'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Support Card */}
      <Card>
        <CardContent className="p-4">
          <div className="text-center text-sm text-muted-foreground">
            <p>Questions about your Academy journey?</p>
            <p>Our community is here to support your creative growth.</p>
            <Button variant="ghost" size="sm" className="mt-2">
              Get Support
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Stage Components
function PortfolioSubmissionStage({ data, onChange }: { data: any; onChange: (data: any) => void }) {
  const [portfolioItems, setPortfolioItems] = useState(data.items || []);

  const addPortfolioItem = (item: any) => {
    const newItems = [...portfolioItems, { id: Date.now(), ...item }];
    setPortfolioItems(newItems);
    onChange({ ...data, items: newItems });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Share Your Creative Work</h3>
        <p className="text-muted-foreground mb-6">
          Upload examples of your creative work to help us understand your artistic voice and potential.
        </p>
      </div>

      <Tabs defaultValue="upload">
        <TabsList>
          <TabsTrigger value="upload">Upload Work</TabsTrigger>
          <TabsTrigger value="describe">Describe Your Practice</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upload" className="space-y-4">
          <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center">
            <p className="text-muted-foreground">
              Drag and drop your creative work here, or click to browse
            </p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => addPortfolioItem({ type: 'placeholder', name: 'Sample Work' })}
            >
              Add Portfolio Item
            </Button>
          </div>
          
          {portfolioItems.map((item: any) => (
            <div key={item.id} className="p-4 border rounded-lg">
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-muted-foreground">{item.type}</p>
            </div>
          ))}
        </TabsContent>
        
        <TabsContent value="describe" className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Describe Your Creative Practice
            </label>
            <textarea 
              className="w-full p-3 border rounded-lg min-h-24"
              placeholder="Tell us about your creative work, your process, and what excites you about AI collaboration..."
              value={data.description || ''}
              onChange={(e) => onChange({ ...data, description: e.target.value })}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function CulturalAlignmentStage({ data, onChange }: { data: any; onChange: (data: any) => void }) {
  const questions = [
    {
      id: 'collaboration',
      question: 'How excited are you about AI as a creative partner?',
      scale: true
    },
    {
      id: 'mission',
      question: 'How well do Eden Academy\'s values align with yours?',
      scale: true  
    },
    {
      id: 'community',
      question: 'How important is peer learning in your creative growth?',
      scale: true
    }
  ];

  const handleScaleChange = (questionId: string, value: number) => {
    onChange({
      ...data,
      [questionId]: value,
      collaborationInterest: data.collaboration || 5,
      missionAlignment: data.mission || 5
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Cultural Alignment Assessment</h3>
        <p className="text-muted-foreground mb-6">
          Help us understand how your creative values align with Eden Academy's mission of supportive AI collaboration.
        </p>
      </div>

      {questions.map((q) => (
        <div key={q.id} className="space-y-3">
          <label className="block text-sm font-medium">{q.question}</label>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">Not at all</span>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                <button
                  key={value}
                  onClick={() => handleScaleChange(q.id, value)}
                  className={`w-8 h-8 rounded-full border-2 text-xs ${
                    data[q.id] === value 
                      ? 'bg-blue-600 text-white border-blue-600' 
                      : 'border-muted hover:border-blue-400'
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>
            <span className="text-sm text-muted-foreground">Extremely</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function SkillAssessmentStage({ data, onChange }: { data: any; onChange: (data: any) => void }) {
  const skillAreas = [
    'Technical Skills',
    'Creative Vision',
    'Collaboration Experience',
    'Learning Motivation'
  ];

  const handleSkillLevel = (skill: string, level: number) => {
    onChange({
      ...data,
      skillLevels: {
        ...data.skillLevels,
        [skill]: level
      }
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Creative Skills Assessment</h3>
        <p className="text-muted-foreground mb-6">
          Rate your current skill levels. This helps us create the best learning path for you.
        </p>
      </div>

      {skillAreas.map((skill) => (
        <div key={skill} className="space-y-3">
          <label className="block text-sm font-medium">{skill}</label>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">Beginner</span>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((level) => (
                <button
                  key={level}
                  onClick={() => handleSkillLevel(skill, level)}
                  className={`w-10 h-10 rounded-lg border-2 text-sm ${
                    data.skillLevels?.[skill] === level
                      ? 'bg-blue-600 text-white border-blue-600' 
                      : 'border-muted hover:border-blue-400'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
            <span className="text-sm text-muted-foreground">Expert</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function AgentMappingStage({ data, onChange }: { data: any; onChange: (data: any) => void }) {
  const agentTypes = [
    { id: 'image-generation', name: 'Visual Creation', description: 'AI agents specialized in visual art and design' },
    { id: 'audio-creation', name: 'Music & Sound', description: 'AI agents for music composition and sound design' },
    { id: 'text-story-generation', name: 'Writing & Story', description: 'AI agents for narrative and creative writing' },
    { id: 'multi-modal-creative', name: 'Multi-Modal', description: 'AI agents working across multiple creative mediums' }
  ];

  const handleInterest = (agentId: string, interested: boolean) => {
    onChange({
      ...data,
      interests: {
        ...data.interests,
        [agentId]: interested
      }
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Agent Collaboration Interests</h3>
        <p className="text-muted-foreground mb-6">
          Which AI collaboration opportunities interest you most?
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {agentTypes.map((agent) => (
          <Card 
            key={agent.id}
            className={`cursor-pointer transition-colors ${
              data.interests?.[agent.id] ? 'border-blue-500 bg-blue-50' : ''
            }`}
            onClick={() => handleInterest(agent.id, !data.interests?.[agent.id])}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold">{agent.name}</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {agent.description}
                  </p>
                </div>
                <div className={`w-4 h-4 rounded border-2 ${
                  data.interests?.[agent.id] ? 'bg-blue-600 border-blue-600' : 'border-muted'
                }`}>
                  {data.interests?.[agent.id] && (
                    <div className="text-white text-xs text-center">✓</div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function AcademyIntegrationStage({ data, onChange }: { data: any; onChange: (data: any) => void }) {
  const integrationAreas = [
    { id: 'community', name: 'Community Participation', description: 'Engage with fellow creators' },
    { id: 'training', name: 'Training Completion', description: 'Complete foundational courses' },
    { id: 'peer', name: 'Peer Collaboration', description: 'Work with other Academy members' }
  ];

  const handleCommitment = (areaId: string, level: number) => {
    onChange({
      ...data,
      commitments: {
        ...data.commitments,
        [areaId]: level
      }
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Academy Integration</h3>
        <p className="text-muted-foreground mb-6">
          How do you want to engage with the Academy community?
        </p>
      </div>

      {integrationAreas.map((area) => (
        <div key={area.id} className="space-y-3">
          <div>
            <h4 className="font-medium">{area.name}</h4>
            <p className="text-sm text-muted-foreground">{area.description}</p>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">Light</span>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((level) => (
                <button
                  key={level}
                  onClick={() => handleCommitment(area.id, level)}
                  className={`w-8 h-8 rounded-full border-2 text-xs ${
                    data.commitments?.[area.id] === level
                      ? 'bg-green-600 text-white border-green-600' 
                      : 'border-muted hover:border-green-400'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
            <span className="text-sm text-muted-foreground">Deep</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function TrainingPathSelectionStage({ data, onChange }: { data: any; onChange: (data: any) => void }) {
  const trainingPaths = [
    { id: 'focused', name: 'Focused Specialization', description: 'Deep dive into one agent collaboration type' },
    { id: 'broad', name: 'Broad Exploration', description: 'Explore multiple agent collaboration opportunities' },
    { id: 'community', name: 'Community-Led', description: 'Learn primarily through peer collaboration' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Select Your Training Path</h3>
        <p className="text-muted-foreground mb-6">
          Choose the learning approach that best fits your creative goals.
        </p>
      </div>

      <div className="space-y-4">
        {trainingPaths.map((path) => (
          <Card 
            key={path.id}
            className={`cursor-pointer transition-colors ${
              data.selectedPath === path.id ? 'border-blue-500 bg-blue-50' : ''
            }`}
            onClick={() => onChange({ ...data, selectedPath: path.id })}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold">{path.name}</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {path.description}
                  </p>
                </div>
                <div className={`w-4 h-4 rounded-full border-2 ${
                  data.selectedPath === path.id ? 'bg-blue-600 border-blue-600' : 'border-muted'
                }`}>
                  {data.selectedPath === path.id && (
                    <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function CompletedStage({ profile }: { profile: CreatorProfile }) {
  return (
    <div className="text-center space-y-6">
      <div className="text-6xl">🎉</div>
      <div>
        <h3 className="text-2xl font-bold mb-4">Welcome to Eden Academy!</h3>
        <p className="text-muted-foreground mb-6">
          Congratulations! You've completed the onboarding process and are now ready to begin 
          your AI creative collaboration journey.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <Card>
          <CardContent className="p-6">
            <h4 className="font-semibold mb-2">Your Progress</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Cultural Alignment</span>
                <span>{profile.culturalAlignment}%</span>
              </div>
              <div className="flex justify-between">
                <span>Readiness Score</span>
                <span>{profile.readinessScore}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <h4 className="font-semibold mb-2">Next Steps</h4>
            <ul className="text-sm space-y-1 text-left">
              <li>• Explore AI agent collaboration opportunities</li>
              <li>• Join Academy community discussions</li>
              <li>• Begin your specialized training program</li>
              <li>• Start creating with AI partnership</li>
            </ul>
          </CardContent>
        </Card>
      </div>
      
      <Button size="lg" className="mt-8">
        Enter Academy Dashboard
      </Button>
    </div>
  );
}