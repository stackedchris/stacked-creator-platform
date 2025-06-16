'use client'

import { useState, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Upload,
  Image,
  Video,
  FileText,
  X,
  Eye,
  Edit,
  Trash2,
  Download,
  Calendar,
  Tag,
  Search,
  Filter,
  Play,
  Pause,
  Plus
} from 'lucide-react'

interface ContentItem {
  id: string
  name: string
  type: 'image' | 'video' | 'document'
  category: 'profile' | 'promotional' | 'behind-scenes' | 'announcement' | 'template'
  url: string
  thumbnail?: string
  size: number
  uploadDate: string
  assignedTo?: string[]
  scheduled?: string
  status: 'draft' | 'scheduled' | 'published'
  tags: string[]
  description: string
  phase?: string
  platform?: string[]
}

const mockContent: ContentItem[] = [
  {
    id: '1',
    name: 'Kurama Gaming Setup Reveal',
    type: 'image',
    category: 'promotional',
    url: 'https://source.unsplash.com/800x600/?gaming,setup',
    thumbnail: 'https://source.unsplash.com/400x300/?gaming,setup',
    size: 2500000,
    uploadDate: '2025-06-15',
    assignedTo: ['Kurama'],
    scheduled: '2025-06-18T14:00',
    status: 'scheduled',
    tags: ['gaming', 'setup', 'RGB', 'announcement'],
    description: 'High-quality photo of new gaming setup with RGB lighting for launch announcement',
    phase: 'Phase 2: Launch Week',
    platform: ['Instagram', 'Twitter']
  },
  {
    id: '2',
    name: 'Behind the Scenes Training',
    type: 'video',
    category: 'behind-scenes',
    url: 'https://source.unsplash.com/800x600/?training,gaming',
    thumbnail: 'https://source.unsplash.com/400x300/?training,gaming',
    size: 45000000,
    uploadDate: '2025-06-14',
    assignedTo: ['Kurama'],
    status: 'draft',
    tags: ['training', 'exclusive', 'behind-scenes'],
    description: 'Exclusive training session footage for Top 100 members',
    phase: 'Phase 2: Launch Week',
    platform: ['Instagram Story', 'YouTube']
  },
  {
    id: '3',
    name: 'Nina Stream Highlights',
    type: 'video',
    category: 'promotional',
    url: 'https://source.unsplash.com/800x600/?streaming,computer',
    thumbnail: 'https://source.unsplash.com/400x300/?streaming,computer',
    size: 38000000,
    uploadDate: '2025-06-13',
    assignedTo: ['Nina Lin'],
    status: 'published',
    tags: ['streaming', 'highlights', 'community'],
    description: 'Best moments compilation for teaser video',
    phase: 'Phase 1: Drop Prep',
    platform: ['TikTok', 'Instagram Reels']
  },
  {
    id: '4',
    name: 'Edward DJ Set Photos',
    type: 'image',
    category: 'profile',
    url: 'https://source.unsplash.com/800x600/?dj,music',
    thumbnail: 'https://source.unsplash.com/400x300/?dj,music',
    size: 1800000,
    uploadDate: '2025-06-12',
    assignedTo: ['Edward So'],
    scheduled: '2025-06-17T20:00',
    status: 'scheduled',
    tags: ['music', 'dj', 'live', 'performance'],
    description: 'Professional DJ set photos for social media',
    phase: 'Phase 3: Sell-Out Push',
    platform: ['Instagram', 'Twitter']
  }
]

export default function ContentManager() {
  const [content, setContent] = useState<ContentItem[]>(mockContent)
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [isEditingContent, setIsEditingContent] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${Number.parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800'
      case 'scheduled': return 'bg-blue-100 text-blue-800'
      case 'draft': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'profile': return <Image className="w-4 h-4" />
      case 'promotional': return <Tag className="w-4 h-4" />
      case 'behind-scenes': return <Eye className="w-4 h-4" />
      case 'announcement': return <Calendar className="w-4 h-4" />
      case 'template': return <FileText className="w-4 h-4" />
      default: return <FileText className="w-4 h-4" />
    }
  }

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return

    setIsUploading(true)
    setUploadProgress(0)

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsUploading(false)

          // Add uploaded files to content
          Array.from(files).forEach((file, index) => {
            const newContent: ContentItem = {
              id: `${Date.now()}_${index}`,
              name: file.name,
              type: file.type.startsWith('image/') ? 'image' :
                    file.type.startsWith('video/') ? 'video' : 'document',
              category: 'promotional',
              url: URL.createObjectURL(file),
              thumbnail: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
              size: file.size,
              uploadDate: new Date().toISOString().split('T')[0],
              status: 'draft',
              tags: [],
              description: ''
            }
            setContent(prev => [...prev, newContent])
          })

          return 100
        }
        return prev + Math.random() * 10
      })
    }, 200)
  }

  const filteredContent = content.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus

    return matchesSearch && matchesCategory && matchesStatus
  })

  const deleteContent = (id: string) => {
    setContent(prev => prev.filter(item => item.id !== id))
    if (selectedContent?.id === id) {
      setSelectedContent(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Content Manager</h2>
          <p className="text-gray-600">Upload, manage and schedule visual content for creators</p>
        </div>
        <Button onClick={() => fileInputRef.current?.click()}>
          <Plus className="w-4 h-4 mr-2" />
          Upload Content
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*,.pdf,.doc,.docx"
          multiple
          className="hidden"
          onChange={(e) => handleFileUpload(e.target.files)}
        />
      </div>

      {/* Upload Progress */}
      {isUploading && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Uploading content...</span>
                <span className="text-sm text-gray-500">{Math.round(uploadProgress)}%</span>
              </div>
              <Progress value={uploadProgress} className="h-2" />
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="library" className="space-y-6">
        <TabsList>
          <TabsTrigger value="library">Content Library</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled Posts</TabsTrigger>
          <TabsTrigger value="templates">Content Templates</TabsTrigger>
          <TabsTrigger value="analytics">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="library">
          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search content, tags, or creators..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="profile">Profile</SelectItem>
                    <SelectItem value="promotional">Promotional</SelectItem>
                    <SelectItem value="behind-scenes">Behind Scenes</SelectItem>
                    <SelectItem value="announcement">Announcement</SelectItem>
                    <SelectItem value="template">Template</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Content Grid */}
            <div className="lg:col-span-3">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredContent.map((item) => (
                  <Card
                    key={item.id}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedContent?.id === item.id ? 'border-blue-500 shadow-md' : ''
                    }`}
                    onClick={() => setSelectedContent(item)}
                  >
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        {/* Thumbnail */}
                        <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                          {item.type === 'image' && item.thumbnail && (
                            <img
                              src={item.thumbnail}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          )}
                          {item.type === 'video' && (
                            <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                              <Play className="w-12 h-12 text-white opacity-80" />
                            </div>
                          )}
                          {item.type === 'document' && (
                            <div className="w-full h-full bg-blue-50 flex items-center justify-center">
                              <FileText className="w-12 h-12 text-blue-500" />
                            </div>
                          )}

                          {/* Status Badge */}
                          <Badge
                            className={`absolute top-2 right-2 ${getStatusColor(item.status)}`}
                          >
                            {item.status}
                          </Badge>
                        </div>

                        {/* Content Info */}
                        <div>
                          <h4 className="font-medium text-sm truncate">{item.name}</h4>
                          <div className="flex items-center space-x-2 mt-1">
                            {getCategoryIcon(item.category)}
                            <span className="text-xs text-gray-500 capitalize">{item.category}</span>
                          </div>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1">
                          {item.tags.slice(0, 2).map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              #{tag}
                            </Badge>
                          ))}
                          {item.tags.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{item.tags.length - 2}
                            </Badge>
                          )}
                        </div>

                        {/* Meta Info */}
                        <div className="flex justify-between items-center text-xs text-gray-500">
                          <span>{formatFileSize(item.size)}</span>
                          <span>{item.uploadDate}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredContent.length === 0 && (
                <Card>
                  <CardContent className="text-center py-12">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 mb-4">No content found matching your criteria</p>
                    <Button onClick={() => fileInputRef.current?.click()}>
                      <Plus className="w-4 h-4 mr-2" />
                      Upload First Content
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Content Details */}
            <div className="lg:col-span-1">
              {selectedContent ? (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Content Details</CardTitle>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setIsEditingContent(true)}
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Preview */}
                    <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                      {selectedContent.type === 'image' && selectedContent.url && (
                        <img
                          src={selectedContent.url}
                          alt={selectedContent.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                      {selectedContent.type === 'video' && (
                        <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                          <Button variant="ghost" size="sm" className="text-white">
                            <Play className="w-6 h-6" />
                          </Button>
                        </div>
                      )}
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">{selectedContent.name}</h4>
                      <p className="text-sm text-gray-600">{selectedContent.description}</p>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Type:</span>
                        <span className="capitalize">{selectedContent.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Category:</span>
                        <span className="capitalize">{selectedContent.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Size:</span>
                        <span>{formatFileSize(selectedContent.size)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Status:</span>
                        <Badge className={getStatusColor(selectedContent.status)}>
                          {selectedContent.status}
                        </Badge>
                      </div>
                      {selectedContent.assignedTo && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">Assigned:</span>
                          <span>{selectedContent.assignedTo.join(', ')}</span>
                        </div>
                      )}
                      {selectedContent.scheduled && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">Scheduled:</span>
                          <span>{new Date(selectedContent.scheduled).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <h5 className="font-medium mb-2">Tags</h5>
                      <div className="flex flex-wrap gap-1">
                        {selectedContent.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {selectedContent.platform && (
                      <div>
                        <h5 className="font-medium mb-2">Platforms</h5>
                        <div className="flex flex-wrap gap-1">
                          {selectedContent.platform.map((platform) => (
                            <Badge key={platform} variant="outline" className="text-xs">
                              {platform}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex space-x-2 pt-4">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Download className="w-3 h-3 mr-1" />
                        Download
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteContent(selectedContent.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <Eye className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Select content to view details</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="scheduled">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Content</CardTitle>
              <CardDescription>Content scheduled for future publishing</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {content.filter(item => item.status === 'scheduled').map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                      {item.type === 'image' && <Image className="w-6 h-6 text-gray-500" />}
                      {item.type === 'video' && <Video className="w-6 h-6 text-gray-500" />}
                      {item.type === 'document' && <FileText className="w-6 h-6 text-gray-500" />}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-gray-500">
                        Scheduled for {item.scheduled ? new Date(item.scheduled).toLocaleString() : 'Unknown'}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Calendar className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates">
          <Card>
            <CardHeader>
              <CardTitle>Content Templates</CardTitle>
              <CardDescription>Reusable content formats and layouts</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-gray-500 py-8">Content templates coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Content Performance</CardTitle>
              <CardDescription>Analytics and insights for your content</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-gray-500 py-8">Performance analytics coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
