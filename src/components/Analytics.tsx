'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { TrendingUp, DollarSign, Users, Target, Clock, Award } from 'lucide-react'

export default function Analytics() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
          <p className="text-gray-600">Performance metrics and success tracking</p>
        </div>
        <Select defaultValue="30d">
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">7 days</SelectItem>
            <SelectItem value="30d">30 days</SelectItem>
            <SelectItem value="90d">90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$248,500</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                +11% from last month
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cards Sold</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,847</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                +18 this week
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Sellout Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.8 days</div>
            <p className="text-xs text-muted-foreground">
              Fastest: 2.1 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Sell Rate</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">76%</div>
            <p className="text-xs text-muted-foreground">
              Across all drops
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="revenue" className="space-y-6">
        <TabsList>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="creators">Creator Performance</TabsTrigger>
          <TabsTrigger value="pipeline">Pipeline Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Gaming</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$89,500</div>
                <p className="text-sm text-gray-600">36% of total</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Music</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$67,200</div>
                <p className="text-sm text-gray-600">27% of total</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Streaming</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$58,300</div>
                <p className="text-sm text-gray-600">23% of total</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Lifestyle</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$33,500</div>
                <p className="text-sm text-gray-600">14% of total</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="creators">
          <Card>
            <CardHeader>
              <CardTitle>Creator Performance</CardTitle>
              <CardDescription>Detailed metrics for all creators</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Creator</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Cards Sold</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Rating</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Kurama</TableCell>
                    <TableCell>Gaming</TableCell>
                    <TableCell>67/100</TableCell>
                    <TableCell>$6,700</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Award className="w-4 h-4 text-yellow-500 mr-1" />
                        4.8
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Nina Lin</TableCell>
                    <TableCell>Streaming</TableCell>
                    <TableCell>100/100</TableCell>
                    <TableCell>$7,500</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Award className="w-4 h-4 text-yellow-500 mr-1" />
                        4.9
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Edward So</TableCell>
                    <TableCell>Music</TableCell>
                    <TableCell>85/100</TableCell>
                    <TableCell>$5,950</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Award className="w-4 h-4 text-yellow-500 mr-1" />
                        4.3
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pipeline">
          <Card>
            <CardHeader>
              <CardTitle>Conversion Funnel</CardTitle>
              <CardDescription>Creator progression through phases</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Strategy Calls Booked</span>
                  <div className="flex items-center space-x-2">
                    <Progress value={100} className="w-24 h-2" />
                    <span className="font-medium">24</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span>Moved to Drop Prep</span>
                  <div className="flex items-center space-x-2">
                    <Progress value={85} className="w-24 h-2" />
                    <span className="font-medium">20</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span>Launched Drops</span>
                  <div className="flex items-center space-x-2">
                    <Progress value={75} className="w-24 h-2" />
                    <span className="font-medium">18</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span>Successful Sellouts</span>
                  <div className="flex items-center space-x-2">
                    <Progress value={67} className="w-24 h-2" />
                    <span className="font-medium">16</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
