'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  BarChart3,
  Users,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  Calendar,
  Target,
  DollarSign
} from 'lucide-react'
import TaskAutomation from '@/components/TaskAutomation'
import Analytics from '@/components/Analytics'
import Templates from '@/components/Templates'
import CreatorManagement from '@/components/CreatorManagement'
import NotionIntegration from '@/components/NotionIntegration'
import AirtableIntegration from '@/components/AirtableIntegration'
import ContentManager from '@/components/ContentManager'

// Mock data for creators - Updated with full creator objects for testing
const creators = [
  {
    id: 1,
    name: "Kurama",
    email: "kurama@example.com",
    phone: "+1 (555) 123-4567",
    category: "Gaming",
    phase: "Phase 2: Launch Week",
    phaseNumber: 2,
    cardsSold: 67,
    totalCards: 100,
    cardPrice: 100,
    daysInPhase: 2,
    nextTask: "Post group chat screenshot",
    salesVelocity: "High",
    avatar: "🎮",
    bio: "Top Smash Bros player with 500K+ following",
    socialMedia: {
      instagram: "@kurama_smash",
      twitter: "@KuramaPlays",
      youtube: "@KuramaGaming"
    },
    assets: { profileImages: [], videos: [], pressKit: [] },
    strategy: {
      launchDate: "2025-06-20",
      targetAudience: "Competitive gaming fans",
      contentPlan: "Daily gameplay tips"
    },
    createdAt: "2025-06-10",
    lastUpdated: "2025-06-16"
  },
  {
    id: 2,
    name: "Nina Lin",
    email: "nina@example.com",
    phone: "+1 (555) 234-5678",
    category: "Streaming",
    phase: "Phase 1: Drop Prep",
    phaseNumber: 1,
    cardsSold: 0,
    totalCards: 100,
    cardPrice: 75,
    daysInPhase: 5,
    nextTask: "Record teaser video",
    salesVelocity: "Pending",
    avatar: "📺",
    bio: "Popular streamer and co-founder",
    socialMedia: {
      instagram: "@ninalin",
      twitter: "@NinaStreams"
    },
    assets: { profileImages: [], videos: [], pressKit: [] },
    strategy: {
      launchDate: "2025-06-25",
      targetAudience: "Streaming community",
      contentPlan: "Stream highlights"
    },
    createdAt: "2025-06-12",
    lastUpdated: "2025-06-16"
  },
  {
    id: 3,
    name: "Edward So",
    email: "edward@example.com",
    phone: "+1 (555) 345-6789",
    category: "Music",
    phase: "Phase 3: Sell-Out Push",
    phaseNumber: 3,
    cardsSold: 85,
    totalCards: 100,
    cardPrice: 90,
    daysInPhase: 1,
    nextTask: "Post 'only 15 left' story",
    salesVelocity: "Medium",
    avatar: "🎵",
    bio: "DJ and creative entrepreneur",
    socialMedia: {
      instagram: "@edwardso",
      twitter: "@EdwardSoMusic"
    },
    assets: { profileImages: [], videos: [], pressKit: [] },
    strategy: {
      launchDate: "2025-06-18",
      targetAudience: "Music fans",
      contentPlan: "Live sets and remixes"
    },
    createdAt: "2025-06-08",
    lastUpdated: "2025-06-16"
  }
]

const phases = [
  { name: "Strategy Call", color: "bg-blue-500" },
  { name: "Drop Prep", color: "bg-yellow-500" },
  { name: "Launch Week", color: "bg-green-500" },
  { name: "Sell-Out Push", color: "bg-orange-500" },
  { name: "Post-Sellout", color: "bg-purple-500" }
]

const getPhaseColor = (phaseNumber: number) => {
  const colors = ["blue", "yellow", "green", "orange", "purple"]
  return colors[phaseNumber] || "gray"
}

const getSalesVelocityColor = (velocity: string) => {
  switch (velocity) {
    case "High": return "bg-green-100 text-green-800"
    case "Medium": return "bg-yellow-100 text-yellow-800"
    case "Low": return "bg-red-100 text-red-800"
    default: return "bg-gray-100 text-gray-800"
  }
}

export default function Dashboard() {
  const [allCreators, setAllCreators] = useState(creators)
  const [selectedCreator, setSelectedCreator] = useState(creators[0])
  const [showAddCreator, setShowAddCreator] = useState(false)
  const [activeTab, setActiveTab] = useState("pipeline")

  const totalCardsInMarket = allCreators.reduce((sum, creator) => sum + creator.cardsSold, 0)
  const averageSellRate = totalCardsInMarket / (allCreators.length * 100) * 100

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Stacked Workflow</h1>
            <p className="text-gray-600 mt-2">Creator pipeline management & automation</p>
          </div>
          <Button
            className="bg-black text-white hover:bg-gray-800"
            onClick={() => {
              console.log('Add Creator button clicked')
              setActiveTab("creators")
              setShowAddCreator(true)
              console.log('Set activeTab to creators and showAddCreator to true')
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Creator
          </Button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Creators</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{allCreators.length}</div>
              <p className="text-xs text-muted-foreground">
                +2 from last week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cards Sold</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCardsInMarket}</div>
              <p className="text-xs text-muted-foreground">
                {averageSellRate.toFixed(1)}% avg sell rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$24,500</div>
              <p className="text-xs text-muted-foreground">
                +15% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">
                3 high priority
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-8">
            <TabsTrigger value="pipeline">Creator Pipeline</TabsTrigger>
            <TabsTrigger value="creators">Creator Management</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="tasks">Task Automation</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="notion">Notion</TabsTrigger>
            <TabsTrigger value="airtable">Airtable</TabsTrigger>
          </TabsList>

          <TabsContent value="pipeline">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Creator List */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Creator Pipeline</CardTitle>
                    <CardDescription>
                      Track each creator through the 5-phase launch process
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {allCreators.map((creator) => (
                      <div
                        key={creator.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedCreator.id === creator.id
                            ? 'border-black bg-gray-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedCreator(creator)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="text-2xl">{creator.avatar}</div>
                            <div>
                              <h3 className="font-semibold">{creator.name}</h3>
                              <p className="text-sm text-gray-600">{creator.category}</p>
                            </div>
                          </div>
                          <Badge
                            variant="outline"
                            className={`bg-${getPhaseColor(creator.phaseNumber)}-100 text-${getPhaseColor(creator.phaseNumber)}-800 border-${getPhaseColor(creator.phaseNumber)}-200`}
                          >
                            {creator.phase}
                          </Badge>
                        </div>

                        <div className="mt-3 space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Cards Sold</span>
                            <span>{creator.cardsSold}/100</span>
                          </div>
                          <Progress value={creator.cardsSold} className="h-2" />

                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">Next: {creator.nextTask}</span>
                            <Badge
                              variant="outline"
                              className={getSalesVelocityColor(creator.salesVelocity)}
                            >
                              {creator.salesVelocity}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Creator Detail */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <span className="text-2xl">{selectedCreator.avatar}</span>
                      <span>{selectedCreator.name}</span>
                    </CardTitle>
                    <CardDescription>{selectedCreator.category}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Current Phase</h4>
                      <Badge
                        className={`bg-${getPhaseColor(selectedCreator.phaseNumber)}-100 text-${getPhaseColor(selectedCreator.phaseNumber)}-800`}
                      >
                        {selectedCreator.phase}
                      </Badge>
                      <p className="text-sm text-gray-600 mt-1">
                        Day {selectedCreator.daysInPhase} in phase
                      </p>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Progress</h4>
                      <Progress value={selectedCreator.cardsSold} className="h-3" />
                      <p className="text-sm text-gray-600 mt-1">
                        {selectedCreator.cardsSold}/100 cards sold ({(selectedCreator.cardsSold/100*100).toFixed(0)}%)
                      </p>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Next Action</h4>
                      <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-sm">{selectedCreator.nextTask}</p>
                        <Button size="sm" className="mt-2">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Mark Complete
                        </Button>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Quick Actions</h4>
                      <div className="space-y-2">
                        <Button variant="outline" size="sm" className="w-full justify-start">
                          <Calendar className="w-3 h-3 mr-2" />
                          Schedule Check-in
                        </Button>
                        <Button variant="outline" size="sm" className="w-full justify-start">
                          <Target className="w-3 h-3 mr-2" />
                          Send Content Prompt
                        </Button>
                        <Button variant="outline" size="sm" className="w-full justify-start">
                          <BarChart3 className="w-3 h-3 mr-2" />
                          View Analytics
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="creators">
            <CreatorManagement
              creators={allCreators}
              onCreatorsUpdate={setAllCreators}
              showAddCreator={showAddCreator}
              onAddCreatorClose={() => setShowAddCreator(false)}
            />
          </TabsContent>

          <TabsContent value="content">
            <ContentManager />
          </TabsContent>

          <TabsContent value="tasks">
            <TaskAutomation />
          </TabsContent>

          <TabsContent value="analytics">
            <Analytics />
          </TabsContent>

          <TabsContent value="templates">
            <Templates />
          </TabsContent>

          <TabsContent value="notion">
            <NotionIntegration />
          </TabsContent>

          <TabsContent value="airtable">
            <AirtableIntegration creators={allCreators} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
