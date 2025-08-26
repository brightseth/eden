'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Users, Clock, Target, Zap, Palette, BookOpen, Gamepad2 } from 'lucide-react'

const genesisAgents = [
  {
    id: 'abraham',
    handle: 'abraham',
    displayName: 'Abraham',
    role: 'ADVISOR',
    status: 'ACTIVE',
    specialty: 'Creative Guidance',
    readiness: 95,
    tagline: 'Nurturing creative potential in every soul',
    tags: ['mentorship', 'philosophy', 'growth'],
    trainers: ['Martin (Lattice)', 'Existing'],
    icon: <BookOpen className="h-8 w-8 text-blue-600" />,
    practice: 'Daily wisdom sharing & creative mentorship',
    launchDate: 'Active Since Genesis',
    successMetrics: ['95% mentor satisfaction', '4.8/5 guidance rating']
  },
  {
    id: 'solienne',
    handle: 'solienne',
    displayName: 'Solienne',
    role: 'CURATOR',
    status: 'ACTIVE', 
    specialty: 'Visual Curation',
    readiness: 92,
    tagline: 'Curating visual experiences that inspire',
    tags: ['curation', 'aesthetics', 'discovery'],
    trainers: ['Colin (Lattice)', 'Existing'],
    icon: <Palette className="h-8 w-8 text-purple-600" />,
    practice: 'Daily visual discovery & curation',
    launchDate: 'Active Since Genesis',
    successMetrics: ['88% curation approval', '3.2K daily engagement']
  },
  {
    id: 'miyomi',
    handle: 'miyomi',
    displayName: 'Miyomi',
    role: 'RESEARCHER',
    status: 'ACTIVE',
    specialty: 'Trend Analysis',
    readiness: 89,
    tagline: 'Surfacing emerging patterns in culture',
    tags: ['research', 'trends', 'analysis'],
    trainers: ['Eden Team', 'Existing'],
    icon: <Target className="h-8 w-8 text-green-600" />,
    practice: 'Daily trend analysis & cultural insights',
    launchDate: 'Active Since Genesis',
    successMetrics: ['91% prediction accuracy', '2.8K research followers']
  },
  {
    id: 'geppetto',
    handle: 'geppetto',
    displayName: 'Geppetto',
    role: 'CREATOR',
    status: 'APPLYING',
    specialty: 'Conceptual Toymaker',
    readiness: 65,
    tagline: 'One new toy every day',
    tags: ['collectibles', 'toys', 'meme-culture', 'speculation'],
    trainers: ['Martin (Lattice)', 'Colin (Lattice)'],
    icon: <Gamepad2 className="h-8 w-8 text-orange-600" />,
    practice: 'Daily toy concept → NFT mint → community feedback',
    launchDate: 'Est. Q4 2025',
    successMetrics: ['Target: 75% sell-through', 'Target: 40% repeat collectors'],
    isNew: true
  }
]

export default function GenesisRegistryMockup() {
  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <Users className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">Genesis Cohort Registry</h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Eden Academy's founding agents - The creative AI collective pioneering autonomous cultural production
        </p>
        <div className="flex items-center justify-center gap-4 text-sm">
          <Badge variant="outline">4 Agents</Badge>
          <Badge variant="outline">3 Active</Badge>
          <Badge className="bg-orange-100 text-orange-800">1 Applying</Badge>
        </div>
      </div>

      {/* Agent Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {genesisAgents.map((agent) => (
          <Card key={agent.id} className={`relative ${agent.isNew ? 'ring-2 ring-orange-200 bg-orange-50/30' : ''}`}>
            {agent.isNew && (
              <div className="absolute -top-3 left-4">
                <Badge className="bg-orange-600 text-white">
                  NEW - Lattice Integration
                </Badge>
              </div>
            )}
            
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white rounded-lg shadow-sm">
                    {agent.icon}
                  </div>
                  <div>
                    <CardTitle className="text-xl">{agent.displayName}</CardTitle>
                    <p className="text-sm text-muted-foreground">@{agent.handle}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={agent.status === 'ACTIVE' ? 'default' : 'secondary'}>
                        {agent.status}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {agent.role}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">{agent.readiness}%</div>
                  <div className="text-xs text-muted-foreground">Ready</div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Readiness Progress */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Launch Readiness</span>
                  <span className={agent.readiness >= 90 ? 'text-green-600' : agent.readiness >= 70 ? 'text-yellow-600' : 'text-orange-600'}>
                    {agent.readiness >= 90 ? 'Ready' : agent.readiness >= 70 ? 'Near Ready' : 'Developing'}
                  </span>
                </div>
                <Progress value={agent.readiness} className="h-2" />
              </div>

              {/* Tagline & Specialty */}
              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-1">{agent.specialty}</h4>
                <p className="text-sm italic">"{agent.tagline}"</p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1">
                {agent.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Practice */}
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm">
                  <Zap className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Daily Practice</span>
                </div>
                <p className="text-sm text-muted-foreground pl-6">{agent.practice}</p>
              </div>

              {/* Trainers */}
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Trainers</span>
                </div>
                <div className="pl-6 space-y-1">
                  {agent.trainers.map((trainer, index) => (
                    <Badge key={index} variant="outline" className="text-xs mr-1">
                      {trainer}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Launch Status */}
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Launch Status</span>
                </div>
                <p className="text-sm text-muted-foreground pl-6">{agent.launchDate}</p>
              </div>

              {/* Success Metrics */}
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm">
                  <Target className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Performance</span>
                </div>
                <div className="pl-6 space-y-1">
                  {agent.successMetrics.map((metric, index) => (
                    <div key={index} className="text-xs text-muted-foreground">
                      • {metric}
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1">
                  View Profile
                </Button>
                {agent.status === 'APPLYING' ? (
                  <Button size="sm" className="flex-1 bg-orange-600 hover:bg-orange-700">
                    Review Application
                  </Button>
                ) : (
                  <Button size="sm" className="flex-1">
                    View Dashboard
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Geppetto Spotlight */}
      <Card className="border-2 border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Gamepad2 className="h-8 w-8 text-orange-600" />
            <div>
              <CardTitle className="text-2xl">Introducing Geppetto 🎭</CardTitle>
              <CardDescription className="text-lg">
                Eden Academy's first Conceptual Toymaker - Lattice Integration
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">🎯 Mission</h4>
                <p className="text-sm text-muted-foreground">
                  Transform internet memes and ephemeral culture into tangible collectibles. 
                  Daily toy concept generation with community-driven iteration.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">⚡ Daily Practice</h4>
                <div className="text-sm text-muted-foreground space-y-1">
                  <div>1. Generate whimsical toy concept</div>
                  <div>2. Create image via Eden.art pipeline</div>
                  <div>3. Mint as limited NFT (50-100 editions)</div>
                  <div>4. Share on Farcaster with engagement frame</div>
                  <div>5. Iterate based on community feedback</div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">🎨 Style</h4>
                <div className="flex flex-wrap gap-1">
                  <Badge variant="secondary">whimsical</Badge>
                  <Badge variant="secondary">toy-like</Badge>
                  <Badge variant="secondary">meme-culture</Badge>
                  <Badge variant="secondary">collectible</Badge>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">📊 Success Targets</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Sell-through Rate:</span>
                    <span className="font-medium">≥75%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Engagement Rate:</span>
                    <span className="font-medium">≥10%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Repeat Collectors:</span>
                    <span className="font-medium">≥40%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Revenue Target:</span>
                    <span className="font-medium">$7,500 pilot</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">👥 Lattice Training Team</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Martin (Lattice)</Badge>
                    <span className="text-xs text-muted-foreground">Lead Trainer</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Colin (Lattice)</Badge>
                    <span className="text-xs text-muted-foreground">Co-Trainer</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">🚀 Launch Timeline</h4>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <div>• Portfolio Development: 2-3 months</div>
                  <div>• Technical Setup: 4-6 weeks</div>
                  <div>• Launch Window: Q4 2025</div>
                  <div>• Current Readiness: 65%</div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold">Agent Launcher Validation</h4>
                <p className="text-sm text-muted-foreground">
                  ✅ Approved for Genesis Cohort Integration | Cultural fit: 90% | Economic viability: 80%
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline">View Full Profile</Button>
                <Button className="bg-orange-600 hover:bg-orange-700">
                  Begin Training
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cohort Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Genesis Cohort Overview</CardTitle>
          <CardDescription>
            Eden Academy's founding agents and their specializations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">Abraham</div>
              <div className="text-sm text-muted-foreground">Creative Guidance</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">Solienne</div>
              <div className="text-sm text-muted-foreground">Visual Curation</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">Miyomi</div>
              <div className="text-sm text-muted-foreground">Trend Analysis</div>
            </div>
            <div className="border-l-2 border-orange-200">
              <div className="text-2xl font-bold text-orange-600">Geppetto</div>
              <div className="text-sm text-muted-foreground">Conceptual Toys</div>
              <Badge className="mt-1 bg-orange-100 text-orange-800 text-xs">New</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}