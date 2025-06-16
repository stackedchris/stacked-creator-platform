// Airtable integration for Stacked Workflow Platform
import type { Creator } from '@/components/CreatorManagement'

export interface AirtableConfig {
  apiKey: string
  baseId: string
  tableName: string
}

export interface AirtableCreator {
  id?: string
  fields: {
    Name: string
    Email?: string
    Phone?: string
    Category: string
    Phase: string
    'Phase Number': number
    'Cards Sold': number
    'Total Cards': number
    'Card Price': number
    'Days in Phase': number
    'Next Task': string
    'Sales Velocity': string
    Avatar?: string
    Bio?: string
    Instagram?: string
    Twitter?: string
    YouTube?: string
    TikTok?: string
    'Launch Date'?: string
    'Target Audience'?: string
    'Content Plan'?: string
    'Created Date': string
    'Last Updated': string
    Revenue?: number
    'Progress Percentage'?: number
  }
}

export class AirtableService {
  private config: AirtableConfig
  private baseUrl: string

  constructor(config: AirtableConfig) {
    this.config = config
    this.baseUrl = `https://api.airtable.com/v0/${config.baseId}/${encodeURIComponent(config.tableName)}`
  }

  // Test connection to Airtable
  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}?maxRecords=1`, {
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json'
        }
      })
      return response.ok
    } catch (error) {
      console.error('Airtable connection failed:', error)
      return false
    }
  }

  // Get all creators from Airtable
  async getCreators(): Promise<Creator[]> {
    try {
      const response = await fetch(this.baseUrl, {
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`Airtable API error: ${response.statusText}`)
      }

      const data = await response.json()
      return data.records.map((record: AirtableCreator) => this.mapAirtableToCreator(record))
    } catch (error) {
      console.error('Failed to get creators from Airtable:', error)
      throw error
    }
  }

  // Sync creators to Airtable
  async syncCreatorsToAirtable(creators: Creator[]): Promise<void> {
    try {
      // Get existing records to update vs create
      const existingRecords = await this.getAirtableRecords()
      const existingCreatorNames = new Set(existingRecords.map(record => record.fields.Name))

      for (const creator of creators) {
        if (existingCreatorNames.has(creator.name)) {
          // Update existing creator
          await this.updateCreatorInAirtable(creator, existingRecords)
        } else {
          // Create new creator
          await this.createCreatorInAirtable(creator)
        }
      }
    } catch (error) {
      console.error('Failed to sync creators to Airtable:', error)
      throw error
    }
  }

  // Get raw Airtable records
  private async getAirtableRecords(): Promise<AirtableCreator[]> {
    const response = await fetch(this.baseUrl, {
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`Airtable API error: ${response.statusText}`)
    }

    const data = await response.json()
    return data.records
  }

  // Create new creator in Airtable
  private async createCreatorInAirtable(creator: Creator): Promise<void> {
    const airtableCreator: Omit<AirtableCreator, 'id'> = {
      fields: this.mapCreatorToAirtable(creator)
    }

    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(airtableCreator)
    })

    if (!response.ok) {
      throw new Error(`Failed to create creator in Airtable: ${response.statusText}`)
    }
  }

  // Update existing creator in Airtable
  private async updateCreatorInAirtable(creator: Creator, existingRecords: AirtableCreator[]): Promise<void> {
    const existingRecord = existingRecords.find(record => record.fields.Name === creator.name)
    if (!existingRecord?.id) return

    const updateData = {
      fields: this.mapCreatorToAirtable(creator)
    }

    const response = await fetch(`${this.baseUrl}/${existingRecord.id}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updateData)
    })

    if (!response.ok) {
      throw new Error(`Failed to update creator in Airtable: ${response.statusText}`)
    }
  }

  // Map Creator to Airtable format
  private mapCreatorToAirtable(creator: Creator): AirtableCreator['fields'] {
    return {
      Name: creator.name,
      Email: creator.email || undefined,
      Phone: creator.phone || undefined,
      Category: creator.category,
      Phase: creator.phase,
      'Phase Number': creator.phaseNumber,
      'Cards Sold': creator.cardsSold,
      'Total Cards': creator.totalCards,
      'Card Price': creator.cardPrice,
      'Days in Phase': creator.daysInPhase,
      'Next Task': creator.nextTask,
      'Sales Velocity': creator.salesVelocity,
      Avatar: creator.avatar || undefined,
      Bio: creator.bio || undefined,
      Instagram: creator.socialMedia.instagram || undefined,
      Twitter: creator.socialMedia.twitter || undefined,
      YouTube: creator.socialMedia.youtube || undefined,
      TikTok: creator.socialMedia.tiktok || undefined,
      'Launch Date': creator.strategy.launchDate || undefined,
      'Target Audience': creator.strategy.targetAudience || undefined,
      'Content Plan': creator.strategy.contentPlan || undefined,
      'Created Date': creator.createdAt,
      'Last Updated': creator.lastUpdated,
      Revenue: creator.cardsSold * creator.cardPrice,
      'Progress Percentage': Math.round((creator.cardsSold / creator.totalCards) * 100)
    }
  }

  // Map Airtable record to Creator
  private mapAirtableToCreator(record: AirtableCreator): Creator {
    const fields = record.fields

    return {
      id: this.generateIdFromAirtableId(record.id || ''),
      name: fields.Name || '',
      email: fields.Email || '',
      phone: fields.Phone || '',
      category: fields.Category || '',
      phase: fields.Phase || '',
      phaseNumber: fields['Phase Number'] || 0,
      cardsSold: fields['Cards Sold'] || 0,
      totalCards: fields['Total Cards'] || 100,
      cardPrice: fields['Card Price'] || 0,
      daysInPhase: fields['Days in Phase'] || 0,
      nextTask: fields['Next Task'] || '',
      salesVelocity: fields['Sales Velocity'] || 'Pending',
      avatar: fields.Avatar || '👤',
      bio: fields.Bio || '',
      socialMedia: {
        instagram: fields.Instagram || '',
        twitter: fields.Twitter || '',
        youtube: fields.YouTube || '',
        tiktok: fields.TikTok || ''
      },
      assets: {
        profileImages: [],
        videos: [],
        pressKit: []
      },
      strategy: {
        launchDate: fields['Launch Date'] || '',
        targetAudience: fields['Target Audience'] || '',
        contentPlan: fields['Content Plan'] || ''
      },
      createdAt: fields['Created Date'] || new Date().toISOString().split('T')[0],
      lastUpdated: fields['Last Updated'] || new Date().toISOString().split('T')[0]
    }
  }

  // Generate numeric ID from Airtable record ID
  private generateIdFromAirtableId(airtableId: string): number {
    // Convert Airtable ID to a numeric ID for consistency
    let hash = 0
    for (let i = 0; i < airtableId.length; i++) {
      const char = airtableId.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return Math.abs(hash)
  }

  // Export creators as CSV for Airtable import
  static exportToCSV(creators: Creator[]): string {
    const headers = [
      'Name',
      'Email',
      'Phone',
      'Category',
      'Phase',
      'Phase Number',
      'Cards Sold',
      'Total Cards',
      'Card Price',
      'Days in Phase',
      'Next Task',
      'Sales Velocity',
      'Avatar',
      'Bio',
      'Instagram',
      'Twitter',
      'YouTube',
      'TikTok',
      'Launch Date',
      'Target Audience',
      'Content Plan',
      'Created Date',
      'Last Updated',
      'Revenue',
      'Progress Percentage'
    ]

    const rows = creators.map(creator => [
      creator.name,
      creator.email,
      creator.phone,
      creator.category,
      creator.phase,
      creator.phaseNumber.toString(),
      creator.cardsSold.toString(),
      creator.totalCards.toString(),
      creator.cardPrice.toString(),
      creator.daysInPhase.toString(),
      creator.nextTask,
      creator.salesVelocity,
      creator.avatar,
      creator.bio,
      creator.socialMedia.instagram || '',
      creator.socialMedia.twitter || '',
      creator.socialMedia.youtube || '',
      creator.socialMedia.tiktok || '',
      creator.strategy.launchDate || '',
      creator.strategy.targetAudience || '',
      creator.strategy.contentPlan || '',
      creator.createdAt,
      creator.lastUpdated,
      (creator.cardsSold * creator.cardPrice).toString(),
      Math.round((creator.cardsSold / creator.totalCards) * 100).toString()
    ])

    return [headers, ...rows]
      .map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(','))
      .join('\n')
  }

  // Create Airtable base structure
  static getAirtableBaseTemplate(): string {
    return `
# Stacked Creators - Airtable Base Template

## Table: Creators

### Fields Setup:

**Basic Info:**
- Name (Single line text) - Primary field
- Email (Email)
- Phone (Phone number)
- Category (Single select): Gaming, Music, Streaming, Lifestyle, Comedy, Fashion
- Avatar (Single line text)
- Bio (Long text)

**Pipeline:**
- Phase (Single select): Phase 0: Strategy Call, Phase 1: Drop Prep, Phase 2: Launch Week, Phase 3: Sell-Out Push, Phase 4: Post-Sellout
- Phase Number (Number)
- Days in Phase (Number)
- Next Task (Single line text)

**Performance:**
- Cards Sold (Number)
- Total Cards (Number) - Default: 100
- Card Price (Currency)
- Sales Velocity (Single select): High, Medium, Low, Pending
- Revenue (Formula): {Cards Sold} * {Card Price}
- Progress Percentage (Formula): ROUND(({Cards Sold} / {Total Cards}) * 100, 0)

**Social Media:**
- Instagram (URL)
- Twitter (URL)
- YouTube (URL)
- TikTok (URL)

**Strategy:**
- Launch Date (Date)
- Target Audience (Long text)
- Content Plan (Long text)

**Metadata:**
- Created Date (Date)
- Last Updated (Date)

### Views Setup:

**1. Pipeline Dashboard**
- Group by: Phase
- Sort: Days in Phase (descending)
- Show: Name, Category, Cards Sold, Sales Velocity, Next Task

**2. High Priority**
- Filter: Sales Velocity = "Low" OR Days in Phase > 7
- Sort: Days in Phase (descending)

**3. Revenue Tracking**
- Group by: Category
- Sort: Revenue (descending)
- Show: Name, Cards Sold, Card Price, Revenue, Progress Percentage

**4. Launch Calendar**
- Calendar view by Launch Date
- Show: Name, Phase, Target Audience

**5. Social Media**
- Show: Name, Instagram, Twitter, YouTube, Category
- Filter: Social media fields are not empty
    `
  }
}
