'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Play,
  Pause,
  Settings,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Edit,
  Trash2,
  Calendar,
  MessageSquare,
  Instagram,
  Twitter,
  TrendingUp
} from 'lucide-react'

// Task automation rules and templates
const automationRules = [
  {
    id: 1,
    name: "Launch Week Daily Reminder",
    phase: "Phase 2: Launch Week",
    trigger: "Daily at 10:00 AM",
    action: "Send content prompt to creator",
    status: "Active",
    lastRun: "2025-06-16 10:00",
    nextRun: "2025-06-17 10:00",
    template: "Post group chat screenshot",
    priority: "High"
  },
  {
    id: 2,
    name: "Sell-Out Push Trigger",
    phase: "Phase 3: Sell-Out Push",
    trigger: "When sales stall >24hrs",
    action: "Auto-assign urgency tasks",
    status: "Active",
    lastRun: "2025-06-15 14:30",
    nextRun: "Conditional",
    template: "Only X cards left story",
    priority: "High"
  },
  {
    id: 3,
    name: "Drop Prep Checklist",
    phase: "Phase 1: Drop Prep",
    trigger: "T-7 days to launch",
    action: "Create task checklist",
    status: "Active",
    lastRun: "2025-06-14 09:00",
    nextRun: "2025-06-20 09:00",
    template: "Teaser video + announcement",
    priority: "Medium"
  },
  {
    id: 4,
    name: "Strategy Call Follow-up",
    phase: "Phase 0: Strategy Call",
    trigger: "3 days after call",
    action: "Send pricing reminder",
    status: "Paused",
    lastRun: "2025-06-12 16:00",
    nextRun: "Paused",
    template: "Pricing structure email",
    priority: "Low"
  }
]

const contentTemplates = [
  {
    id: 1,
    name: "Launch Day Announcement",
    platform: "Instagram",
    phase: "Phase 2: Launch Week",
    category: "Announcement",
    content: "🚀 My exclusive Top 100 is LIVE! Only 100 cards available for my biggest supporters. Get yours before they're gone! Link in bio 👆",
    engagement: "High",
    successRate: "87%"
  },
  {
    id: 2,
    name: "Group Chat Screenshot",
    platform: "Instagram Story",
    phase: "Phase 2: Launch Week",
    category: "Social Proof",
    content: "Behind the scenes access is unreal 🔥 [Screenshot of group chat with members discussing exclusive content]",
    engagement: "Very High",
    successRate: "92%"
  },
  {
    id: 3,
    name: "Urgency Push - Limited Left",
    platform: "Twitter",
    phase: "Phase 3: Sell-Out Push",
    category: "Urgency",
    content: "⚠️ Only 15 cards left in my Top 100! Once they're gone, the window closes forever. Don't miss your spot 👇",
    engagement: "High",
    successRate: "78%"
  },
  {
    id: 4,
    name: "Voting Power Showcase",
    platform: "TikTok",
    phase: "Phase 2: Launch Week",
    category: "Utility",
    content: "My Top 100 holders literally get to vote on my next drop 🗳️ This is your chance to have real influence! [Video showing voting interface]",
    engagement: "Medium",
    successRate: "65%"
  }
]

const activeTasks = [
  {
    id: 1,
    creator: "Kurama",
    task: "Post group chat screenshot",
    phase: "Phase 2: Launch Week",
    priority: "High",
    assignedTo: "Creator",
    dueDate: "2025-06-16 18:00",
    status: "Pending",
    automationRule: "Launch Week Daily Reminder"
  },
  {
    id: 2,
    creator: "Edward So",
    task: "Post 'only 15 left' story",
    phase: "Phase 3: Sell-Out Push",
    priority: "High",
    assignedTo: "Creator",
    dueDate: "2025-06-16 20:00",
    status: "In Progress",
    automationRule: "Sell-Out Push Trigger"
  },
  {
    id: 3,
    creator: "Nina Lin",
    task: "Record teaser video",
    phase: "Phase 1: Drop Prep",
    priority: "Medium",
    assignedTo: "Creator",
    dueDate: "2025-06-18 12:00",
    status: "Pending",
    automationRule: "Drop Prep Checklist"
  },
  {
    id: 4,
    creator: "Kurama",
    task: "Run spark ads campaign",
    phase: "Phase 2: Launch Week",
    priority: "High",
    assignedTo: "Team",
    dueDate: "2025-06-16 15:00",
    status: "Completed",
    automationRule: "Launch Week Daily Reminder"
  }
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "Active": return "bg-green-100 text-green-800"
    case "Paused": return "bg-gray-100 text-gray-800"
    case "Pending": return "bg-yellow-100 text-yellow-800"
    case "In Progress": return "bg-blue-100 text-blue-800"
    case "Completed": return "bg-green-100 text-green-800"
    default: return "bg-gray-100 text-gray-800"
  }
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "High": return "bg-red-100 text-red-800"
    case "Medium": return "bg-yellow-100 text-yellow-800"
    case "Low": return "bg-blue-100 text-blue-800"
    default: return "bg-gray-100 text-gray-800"
  }
}

const getEngagementColor = (engagement: string) => {
  switch (engagement) {
    case "Very High": return "bg-green-100 text-green-800"
    case "High": return "bg-blue-100 text-blue-800"
    case "Medium": return "bg-yellow-100 text-yellow-800"
    case "Low": return "bg-red-100 text-red-800"
    default: return "bg-gray-100 text-gray-800"
  }
}

export default function TaskAutomation() {
  const [selectedTab, setSelectedTab] = useState("active-tasks")
  const [isCreatingRule, setIsCreatingRule] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Task Automation</h2>
          <p className="text-gray-600">Automated workflows and content prompts for each phase</p>
        </div>
        <Button onClick={() => setIsCreatingRule(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Automation Rule
        </Button>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="active-tasks">Active Tasks</TabsTrigger>
          <TabsTrigger value="automation-rules">Automation Rules</TabsTrigger>
          <TabsTrigger value="templates">Content Templates</TabsTrigger>
          <TabsTrigger value="analytics">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="active-tasks">
          <Card>
            <CardHeader>
              <CardTitle>Active Tasks</CardTitle>
              <CardDescription>
                Tasks automatically generated by automation rules
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Creator</TableHead>
                    <TableHead>Task</TableHead>
                    <TableHead>Phase</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeTasks.map((task) => (
                    <TableRow key={task.id}>
                      <TableCell className="font-medium">{task.creator}</TableCell>
                      <TableCell>{task.task}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {task.phase}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getPriorityColor(task.priority)}>
                          {task.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>{task.assignedTo}</TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {new Date(task.dueDate).toLocaleDateString()} {new Date(task.dueDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(task.status)}>
                          {task.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          {task.status === "Pending" && (
                            <Button size="sm" variant="outline">
                              <Play className="w-3 h-3" />
                            </Button>
                          )}
                          {task.status !== "Completed" && (
                            <Button size="sm" variant="outline">
                              <CheckCircle2 className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="automation-rules">
          <Card>
            <CardHeader>
              <CardTitle>Automation Rules</CardTitle>
              <CardDescription>
                Configure triggers and actions for each phase of the creator pipeline
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rule Name</TableHead>
                    <TableHead>Phase</TableHead>
                    <TableHead>Trigger</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Next Run</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {automationRules.map((rule) => (
                    <TableRow key={rule.id}>
                      <TableCell className="font-medium">{rule.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {rule.phase}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{rule.trigger}</TableCell>
                      <TableCell className="text-sm">{rule.action}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(rule.status)}>
                          {rule.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">{rule.nextRun}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            {rule.status === "Active" ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                          </Button>
                          <Button size="sm" variant="outline">
                            <Settings className="w-3 h-3" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="w-3 h-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates">
          <Card>
            <CardHeader>
              <CardTitle>Content Templates</CardTitle>
              <CardDescription>
                Reusable templates for social media posts and marketing content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {contentTemplates.map((template) => (
                  <Card key={template.id} className="border">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                        <div className="flex items-center space-x-2">
                          {template.platform === "Instagram" && <Instagram className="w-4 h-4 text-pink-600" />}
                          {template.platform === "Twitter" && <Twitter className="w-4 h-4 text-blue-600" />}
                          {template.platform === "TikTok" && <MessageSquare className="w-4 h-4 text-black" />}
                          {template.platform === "Instagram Story" && <Instagram className="w-4 h-4 text-pink-600" />}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Badge variant="outline" className="text-xs">{template.phase}</Badge>
                        <Badge variant="outline" className="text-xs">{template.category}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-700 mb-3">{template.content}</p>
                      <div className="flex justify-between items-center">
                        <div className="flex space-x-2">
                          <Badge className={getEngagementColor(template.engagement)}>
                            {template.engagement}
                          </Badge>
                          <Badge className="bg-blue-100 text-blue-800">
                            {template.successRate} success
                          </Badge>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">Use</Button>
                          <Button size="sm" variant="outline">
                            <Edit className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Task Completion Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">87%</div>
                <Progress value={87} className="h-2" />
                <p className="text-sm text-gray-600 mt-2">+5% from last week</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Automation Efficiency</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">92%</div>
                <Progress value={92} className="h-2" />
                <p className="text-sm text-gray-600 mt-2">Tasks completed on time</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Template Success Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">78%</div>
                <Progress value={78} className="h-2" />
                <p className="text-sm text-gray-600 mt-2">Avg across all templates</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Top Performing Templates</CardTitle>
              <CardDescription>
                Templates with highest engagement and success rates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Template</TableHead>
                    <TableHead>Platform</TableHead>
                    <TableHead>Success Rate</TableHead>
                    <TableHead>Engagement</TableHead>
                    <TableHead>Uses This Week</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contentTemplates
                    .sort((a, b) => Number.parseInt(b.successRate) - Number.parseInt(a.successRate))
                    .slice(0, 3)
                    .map((template) => (
                    <TableRow key={template.id}>
                      <TableCell className="font-medium">{template.name}</TableCell>
                      <TableCell>{template.platform}</TableCell>
                      <TableCell>{template.successRate}</TableCell>
                      <TableCell>
                        <Badge className={getEngagementColor(template.engagement)}>
                          {template.engagement}
                        </Badge>
                      </TableCell>
                      <TableCell>12</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
