'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Database,
  Download,
  Upload,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Settings,
  RotateCcw,
  FileText,
  Users,
  Calendar,
  Table,
  Copy
} from 'lucide-react'
import { AirtableService } from '@/lib/airtable'

interface AirtableConfig {
  apiKey: string
  baseId: string
  tableName: string
  isConnected: boolean
}

interface SyncStatus {
  creators: 'idle' | 'syncing' | 'success' | 'error'
}

interface AirtableIntegrationProps {
  creators?: any[]
}

export default function AirtableIntegration({ creators = [] }: AirtableIntegrationProps) {
  const [config, setConfig] = useState<AirtableConfig>({
    apiKey: '',
    baseId: '',
    tableName: 'Creators',
    isConnected: false
  })

  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    creators: 'idle'
  })

  const [lastSync, setLastSync] = useState<string>('')

  const handleConnect = async () => {
    if (!config.apiKey || !config.baseId || !config.tableName) return

    try {
      const response = await fetch('/api/airtable/test-connection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          apiKey: config.apiKey,
          baseId: config.baseId,
          tableName: config.tableName,
        }),
      })

      const result = await response.json()

      if (result.success) {
        setConfig(prev => ({ ...prev, isConnected: true }))
        alert('Successfully connected to Airtable!')
      } else {
        alert(`Connection failed: ${result.error}`)
      }
    } catch (error) {
      alert('Connection failed: Network error')
      console.error('Connection failed:', error)
    }
  }

  const handleDisconnect = () => {
    setConfig(prev => ({ ...prev, isConnected: false }))
  }

  const syncCreators = async () => {
    if (!config.isConnected) return

    setSyncStatus(prev => ({ ...prev, creators: 'syncing' }))

    try {
      const response = await fetch('/api/airtable/sync-creators', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey: config.apiKey,
          baseId: config.baseId,
          tableName: config.tableName,
          creators: creators,
        }),
      })

      const result = await response.json()

      if (result.success) {
        setSyncStatus(prev => ({ ...prev, creators: 'success' }))
        setLastSync(new Date().toLocaleString())
        alert(`Successfully synced ${result.syncedCount} creators to Airtable!`)
      } else {
        setSyncStatus(prev => ({ ...prev, creators: 'error' }))
        alert(`Sync failed: ${result.error}`)
      }
    } catch (error) {
      setSyncStatus(prev => ({ ...prev, creators: 'error' }))
      console.error('Sync failed:', error)
      alert('Sync failed: Network error')
    }
  }

  const exportToCSV = () => {
    const csvContent = AirtableService.exportToCSV(creators)
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'stacked-creators-airtable.csv'
    a.click()
    window.URL.revokeObjectURL(url)
    alert('✅ CSV exported! This file is ready to import directly into Airtable.')
  }

  const copyTemplate = () => {
    const template = AirtableService.getAirtableBaseTemplate()
    navigator.clipboard.writeText(template)
    alert('✅ Airtable template copied to clipboard!')
  }

  const getStatusIcon = (status: 'idle' | 'syncing' | 'success' | 'error') => {
    switch (status) {
      case 'syncing': return <RefreshCw className="w-4 h-4 animate-spin text-blue-500" />
      case 'success': return <CheckCircle2 className="w-4 h-4 text-green-500" />
      case 'error': return <AlertCircle className="w-4 h-4 text-red-500" />
      default: return <Database className="w-4 h-4 text-gray-400" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Airtable Integration</h2>
          <p className="text-gray-600">Sync your creator data with Airtable bases</p>
        </div>
        {config.isConnected && (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Connected
          </Badge>
        )}
      </div>

      <Tabs defaultValue="setup" className="space-y-6">
        <TabsList>
          <TabsTrigger value="setup">Setup</TabsTrigger>
          <TabsTrigger value="sync">Sync Data</TabsTrigger>
          <TabsTrigger value="export">Export/Import</TabsTrigger>
          <TabsTrigger value="template">Template</TabsTrigger>
        </TabsList>

        <TabsContent value="setup">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                Airtable Configuration
              </CardTitle>
              <CardDescription>
                Connect your Stacked workflow to Airtable bases
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {!config.isConnected ? (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-2">Airtable API Key</label>
                    <Input
                      type="password"
                      value={config.apiKey}
                      onChange={(e) => setConfig(prev => ({ ...prev, apiKey: e.target.value }))}
                      placeholder="pat..."
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Get your API key from: <a href="https://airtable.com/create/tokens" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Airtable Developer Hub</a>
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Base ID</label>
                    <Input
                      value={config.baseId}
                      onChange={(e) => setConfig(prev => ({ ...prev, baseId: e.target.value }))}
                      placeholder="app..."
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Find in your base URL: airtable.com/app[BASE_ID]/...
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Table Name</label>
                    <Input
                      value={config.tableName}
                      onChange={(e) => setConfig(prev => ({ ...prev, tableName: e.target.value }))}
                      placeholder="Creators"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Name of the table in your Airtable base
                    </p>
                  </div>

                  <Button onClick={handleConnect} disabled={!config.apiKey || !config.baseId || !config.tableName}>
                    <Database className="w-4 h-4 mr-2" />
                    Connect to Airtable
                  </Button>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h3 className="font-medium text-green-900 mb-2">Successfully Connected!</h3>
                    <p className="text-sm text-green-700">Your Stacked workflow is now connected to Airtable.</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Base ID</span>
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded">{config.baseId}</code>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Table Name</span>
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded">{config.tableName}</code>
                    </div>
                  </div>

                  <Button variant="outline" onClick={handleDisconnect}>
                    Disconnect
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sync">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Sync Creators
                </div>
                {getStatusIcon(syncStatus.creators)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Sync creator profiles, contact info, pipeline status, and performance data to Airtable
              </p>
              <Button
                onClick={syncCreators}
                disabled={!config.isConnected || syncStatus.creators === 'syncing'}
                className="w-full"
              >
                {syncStatus.creators === 'syncing' ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Syncing...
                  </>
                ) : (
                  <>
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Sync {creators.length} Creators to Airtable
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {lastSync && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Last sync: {lastSync}</span>
                  <Button variant="outline" size="sm">
                    <ExternalLink className="w-3 h-3 mr-1" />
                    View in Airtable
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="export">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Download className="w-5 h-5 mr-2" />
                  Export Data
                </CardTitle>
                <CardDescription>Download your data for manual import</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button onClick={exportToCSV} variant="outline" className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Export Creators to CSV
                </Button>
                <p className="text-xs text-gray-500">
                  CSV format ready for direct import into Airtable with all fields mapped correctly.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Upload className="w-5 h-5 mr-2" />
                  Import Guide
                </CardTitle>
                <CardDescription>How to import data into Airtable</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm space-y-2">
                  <p><strong>1.</strong> Create a new base in Airtable</p>
                  <p><strong>2.</strong> Use the template from the Template tab</p>
                  <p><strong>3.</strong> Import CSV: Base menu → "Import data" → "CSV file"</p>
                  <p><strong>4.</strong> Map fields automatically</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="template">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Table className="w-5 h-5 mr-2" />
                Airtable Base Template
              </CardTitle>
              <CardDescription>
                Complete base structure for your Stacked workflow
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Quick Setup</h4>
                <ol className="text-sm text-blue-800 space-y-1">
                  <li>1. Create a new base in Airtable</li>
                  <li>2. Copy the template structure below</li>
                  <li>3. Set up fields as specified in the template</li>
                  <li>4. Import your CSV data or use API sync</li>
                  <li>5. Create views for dashboard, pipeline, revenue tracking</li>
                </ol>
              </div>

              <div className="space-y-4">
                <Button onClick={copyTemplate} variant="outline" className="w-full">
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Base Template
                </Button>

                <div className="p-4 border rounded-lg bg-gray-50">
                  <h4 className="font-medium mb-2">Fields to Create:</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <strong>Basic Info:</strong>
                      <ul className="mt-1 space-y-1 text-gray-600">
                        <li>• Name (Single line text)</li>
                        <li>• Email (Email)</li>
                        <li>• Phone (Phone number)</li>
                        <li>• Category (Single select)</li>
                        <li>• Bio (Long text)</li>
                      </ul>
                    </div>
                    <div>
                      <strong>Pipeline:</strong>
                      <ul className="mt-1 space-y-1 text-gray-600">
                        <li>• Phase (Single select)</li>
                        <li>• Cards Sold (Number)</li>
                        <li>• Card Price (Currency)</li>
                        <li>• Sales Velocity (Single select)</li>
                        <li>• Revenue (Formula)</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-lg bg-gray-50">
                  <h4 className="font-medium mb-2">Recommended Views:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• <strong>Pipeline Dashboard:</strong> Group by Phase, sort by Days in Phase</li>
                    <li>• <strong>Revenue Tracking:</strong> Group by Category, sort by Revenue</li>
                    <li>• <strong>High Priority:</strong> Filter for Low velocity or &gt;7 days in phase</li>
                    <li>• <strong>Launch Calendar:</strong> Calendar view by Launch Date</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
