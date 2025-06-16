'use client'

import { useState, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import {
  Upload,
  type File,
  Image,
  Video,
  FileText,
  X,
  Check,
  AlertCircle,
  Download,
  Eye,
  Trash2
} from 'lucide-react'

interface AssetFile {
  id: string
  name: string
  type: 'image' | 'video' | 'document'
  size: number
  url?: string
  status: 'uploading' | 'completed' | 'error'
  progress: number
  createdAt: string
}

interface AssetUploadProps {
  creatorId: number
  assetType: 'profileImages' | 'videos' | 'pressKit'
  existingAssets: string[]
  onAssetsUpdate: (assets: string[]) => void
}

export default function AssetUpload({
  creatorId,
  assetType,
  existingAssets,
  onAssetsUpdate
}: AssetUploadProps) {
  const [assets, setAssets] = useState<AssetFile[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const getAssetTypeConfig = () => {
    switch (assetType) {
      case 'profileImages':
        return {
          title: 'Profile Images',
          icon: <Image className="w-5 h-5" />,
          accept: 'image/*',
          maxSize: 10 * 1024 * 1024, // 10MB
          allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
          description: 'Upload profile photos, headshots, and promotional images'
        }
      case 'videos':
        return {
          title: 'Videos',
          icon: <Video className="w-5 h-5" />,
          accept: 'video/*',
          maxSize: 100 * 1024 * 1024, // 100MB
          allowedTypes: ['video/mp4', 'video/webm', 'video/mov'],
          description: 'Upload intro videos, highlights, and promotional content'
        }
      case 'pressKit':
        return {
          title: 'Press Kit',
          icon: <FileText className="w-5 h-5" />,
          accept: '.pdf,.doc,.docx,.txt',
          maxSize: 25 * 1024 * 1024, // 25MB
          allowedTypes: ['application/pdf', 'application/msword', 'text/plain'],
          description: 'Upload bio, media kit, statistics, and press materials'
        }
    }
  }

  const config = getAssetTypeConfig()

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${Number.parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`
  }

  const validateFile = (file: File) => {
    if (file.size > config.maxSize) {
      return `File size exceeds ${formatFileSize(config.maxSize)} limit`
    }
    if (!config.allowedTypes.includes(file.type)) {
      return `File type ${file.type} is not supported`
    }
    return null
  }

  const simulateUpload = (assetId: string) => {
    let progress = 0
    const interval = setInterval(() => {
      progress += Math.random() * 20
      if (progress >= 100) {
        progress = 100
        clearInterval(interval)
        setAssets(prev => prev.map(asset =>
          asset.id === assetId
            ? { ...asset, status: 'completed', progress: 100, url: `/assets/${asset.name}` }
            : asset
        ))
        // Update parent component
        const updatedAssets = [...existingAssets, assets.find(a => a.id === assetId)?.name || '']
        onAssetsUpdate(updatedAssets)
      } else {
        setAssets(prev => prev.map(asset =>
          asset.id === assetId ? { ...asset, progress: Math.round(progress) } : asset
        ))
      }
    }, 200)
  }

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return

    for (const file of Array.from(files)) {
      const validation = validateFile(file)
      if (validation) {
        alert(validation)
        return
      }

      const assetId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      const asset: AssetFile = {
        id: assetId,
        name: file.name,
        type: assetType === 'profileImages' ? 'image' : assetType === 'videos' ? 'video' : 'document',
        size: file.size,
        status: 'uploading',
        progress: 0,
        createdAt: new Date().toISOString()
      }

      setAssets(prev => [...prev, asset])
      simulateUpload(assetId)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    handleFileSelect(e.dataTransfer.files)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const removeAsset = (assetId: string) => {
    setAssets(prev => prev.filter(asset => asset.id !== assetId))
  }

  const getFileIcon = (type: 'image' | 'video' | 'document') => {
    switch (type) {
      case 'image': return <Image className="w-8 h-8 text-blue-500" />
      case 'video': return <Video className="w-8 h-8 text-purple-500" />
      case 'document': return <FileText className="w-8 h-8 text-green-500" />
    }
  }

  const getStatusIcon = (status: 'uploading' | 'completed' | 'error') => {
    switch (status) {
      case 'uploading': return <Upload className="w-4 h-4 text-blue-500 animate-pulse" />
      case 'completed': return <Check className="w-4 h-4 text-green-500" />
      case 'error': return <AlertCircle className="w-4 h-4 text-red-500" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          {config.icon}
          <span>{config.title}</span>
        </CardTitle>
        <CardDescription>{config.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Existing Assets */}
        {existingAssets.length > 0 && (
          <div>
            <h4 className="font-medium mb-3">Existing Assets</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {existingAssets.map((asset) => (
                <div key={asset} className="border rounded-lg p-3 text-center">
                  {getFileIcon(assetType === 'profileImages' ? 'image' : assetType === 'videos' ? 'video' : 'document')}
                  <p className="text-sm text-gray-600 mt-2 truncate">{asset}</p>
                  <div className="flex justify-center space-x-1 mt-2">
                    <Button size="sm" variant="outline">
                      <Eye className="w-3 h-3" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="w-3 h-3" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upload Zone */}
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragOver
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Drop files here or click to upload
          </h3>
          <p className="text-gray-600 mb-4">
            Max file size: {formatFileSize(config.maxSize)}
          </p>
          <Button
            onClick={() => fileInputRef.current?.click()}
            variant="outline"
          >
            Choose Files
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept={config.accept}
            multiple
            className="hidden"
            onChange={(e) => handleFileSelect(e.target.files)}
          />
        </div>

        {/* Upload Progress */}
        {assets.length > 0 && (
          <div>
            <h4 className="font-medium mb-3">Uploading Files</h4>
            <div className="space-y-3">
              {assets.map((asset) => (
                <div key={asset.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      {getFileIcon(asset.type)}
                      <div>
                        <h5 className="font-medium text-sm">{asset.name}</h5>
                        <p className="text-xs text-gray-500">{formatFileSize(asset.size)}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(asset.status)}
                      {asset.status === 'uploading' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => removeAsset(asset.id)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                  {asset.status === 'uploading' && (
                    <div className="space-y-1">
                      <Progress value={asset.progress} className="h-2" />
                      <p className="text-xs text-gray-500">{asset.progress}% uploaded</p>
                    </div>
                  )}
                  {asset.status === 'completed' && (
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-green-100 text-green-800">Uploaded</Badge>
                      <Button size="sm" variant="outline">
                        <Eye className="w-3 h-3 mr-1" />
                        Preview
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upload Summary */}
        <div className="text-sm text-gray-500">
          <p>Supported formats: {config.allowedTypes.join(', ')}</p>
          <p>Maximum file size: {formatFileSize(config.maxSize)}</p>
        </div>
      </CardContent>
    </Card>
  )
}
