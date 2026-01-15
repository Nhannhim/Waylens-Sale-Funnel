import { NextResponse } from 'next/server'
import * as fs from 'fs'
import * as path from 'path'

export const dynamic = 'force-dynamic'

interface CSVData {
  filename: string
  topic: string
  columns: string[]
  rows: Record<string, string>[]
  totalRows: number
}

interface CompanyDataResponse {
  success: boolean
  company: string
  csvFiles: CSVData[]
  vendorInfo?: {
    rank: number
    installedBase: string
    geographicFocus: string
    estimatedUnits: string
    keyStrengths: string
    ownership: string
    notes: string
  }
  error?: string
}

function parseCSVLine(line: string): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim())
      current = ''
    } else {
      current += char
    }
  }
  result.push(current.trim())
  return result
}

function parseCSVFile(filepath: string): { columns: string[]; rows: Record<string, string>[]; totalRows: number } {
  try {
    const content = fs.readFileSync(filepath, 'utf-8')
    const lines = content.split('\n').filter(line => line.trim())

    if (lines.length === 0) {
      return { columns: [], rows: [], totalRows: 0 }
    }

    const columns = parseCSVLine(lines[0])
    const rows = lines.slice(1).map(line => {
      const values = parseCSVLine(line)
      const row: Record<string, string> = {}
      columns.forEach((col, idx) => {
        row[col] = values[idx] || ''
      })
      return row
    })

    return { columns, rows, totalRows: rows.length }
  } catch {
    return { columns: [], rows: [], totalRows: 0 }
  }
}

function extractTopicFromFilename(filename: string): string {
  // Remove number prefix and company name
  const parts = filename.replace('.csv', '').split('_')

  // Skip number prefix
  let startIdx = 0
  if (/^\d+$/.test(parts[0])) {
    startIdx = 1
  }

  // Skip company name (usually 1-2 parts) and mrm prefix
  if (parts[startIdx] === 'mrm') {
    startIdx++
  }

  // Find where the topic starts (after company name)
  const commonPrefixes = ['company', 'product', 'customer', 'partnership', 'technology', 'market', 'acquisition', 'funding', 'operations', 'geographic', 'target', 'oem']
  for (let i = startIdx; i < parts.length; i++) {
    if (commonPrefixes.some(p => parts[i].toLowerCase().includes(p))) {
      return parts.slice(i).join(' ').replace(/_/g, ' ')
    }
  }

  // Fallback: use everything after the first underscore
  return parts.slice(startIdx + 1).join(' ').replace(/_/g, ' ')
}

function formatTopicName(topic: string): string {
  return topic
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

// Priority order for sorting CSV files by importance (lower = more important)
function getTopicPriority(topic: string): number {
  const lowerTopic = topic.toLowerCase()

  // Most important: Company overview/profile
  if (lowerTopic.includes('company profile') || lowerTopic.includes('company overview') || lowerTopic.includes('company data')) {
    return 1
  }

  // Products and services
  if (lowerTopic.includes('product') && (lowerTopic.includes('portfolio') || lowerTopic.includes('device'))) {
    return 2
  }
  if (lowerTopic.includes('product') && !lowerTopic.includes('launch')) {
    return 3
  }

  // Customers
  if (lowerTopic.includes('customer')) {
    return 4
  }

  // Company metrics and financials
  if (lowerTopic.includes('company metric') || lowerTopic.includes('metrics')) {
    return 5
  }

  // Partnerships
  if (lowerTopic.includes('partnership') && !lowerTopic.includes('oem')) {
    return 6
  }

  // Technology
  if (lowerTopic.includes('technology')) {
    return 7
  }

  // Geographic/Market presence
  if (lowerTopic.includes('geographic') || lowerTopic.includes('market data')) {
    return 8
  }

  // Target industries/segments
  if (lowerTopic.includes('target') || lowerTopic.includes('vertical') || lowerTopic.includes('segment')) {
    return 9
  }

  // OEM partnerships
  if (lowerTopic.includes('oem')) {
    return 10
  }

  // Operations
  if (lowerTopic.includes('operation')) {
    return 11
  }

  // Integration/Platform
  if (lowerTopic.includes('integration') || lowerTopic.includes('platform')) {
    return 12
  }

  // Funding
  if (lowerTopic.includes('funding')) {
    return 13
  }

  // Acquisitions
  if (lowerTopic.includes('acquisition')) {
    return 14
  }

  // Product launches (historical)
  if (lowerTopic.includes('launch')) {
    return 15
  }

  // Everything else
  return 20
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const companySlug = searchParams.get('company')

    if (!companySlug) {
      return NextResponse.json(
        { success: false, error: 'Company parameter is required' },
        { status: 400 }
      )
    }

    // Convert slug to search term (e.g., "verizon-connect" -> "verizon_connect" or "verizon connect")
    const searchTerm = companySlug.toLowerCase().replace(/-/g, '_')
    const searchTermAlt = companySlug.toLowerCase().replace(/-/g, ' ')

    const highPriorityDir = path.join(process.cwd(), 'waylens_filtered_data', 'high_priority')

    if (!fs.existsSync(highPriorityDir)) {
      return NextResponse.json(
        { success: false, error: 'Data directory not found' },
        { status: 500 }
      )
    }

    const allFiles = fs.readdirSync(highPriorityDir).filter(f => f.endsWith('.csv'))

    // Find company-specific files
    const companyFiles = allFiles.filter(filename => {
      const lowerFilename = filename.toLowerCase()
      return lowerFilename.includes(searchTerm) || lowerFilename.includes(searchTermAlt.replace(/ /g, '_'))
    })

    // Also check fleet_management_vendors.csv for company info
    let vendorInfo: CompanyDataResponse['vendorInfo'] = undefined
    const vendorFile = path.join(highPriorityDir, '02_fleet_management_vendors.csv')
    if (fs.existsSync(vendorFile)) {
      const { rows } = parseCSVFile(vendorFile)
      const vendorRow = rows.find(row => {
        const companyName = (row['Company'] || '').toLowerCase().replace(/[^a-z0-9]/g, '')
        const slugClean = companySlug.toLowerCase().replace(/[^a-z0-9]/g, '')
        return companyName.includes(slugClean) || slugClean.includes(companyName)
      })

      if (vendorRow) {
        vendorInfo = {
          rank: parseInt(vendorRow['Rank']) || 0,
          installedBase: vendorRow['Installed_Base_Category'] || '',
          geographicFocus: vendorRow['Geographic_Focus'] || '',
          estimatedUnits: vendorRow['Estimated_Units'] || '',
          keyStrengths: vendorRow['Key_Strengths'] || '',
          ownership: vendorRow['Ownership'] || '',
          notes: vendorRow['Notes'] || '',
        }
      }
    }

    // Parse all company files
    const csvFiles: CSVData[] = companyFiles.map(filename => {
      const filepath = path.join(highPriorityDir, filename)
      const { columns, rows, totalRows } = parseCSVFile(filepath)
      const topic = extractTopicFromFilename(filename)

      return {
        filename,
        topic: formatTopicName(topic),
        columns,
        rows,
        totalRows,
      }
    })

    // Sort by topic importance (most important first)
    csvFiles.sort((a, b) => {
      const priorityA = getTopicPriority(a.topic)
      const priorityB = getTopicPriority(b.topic)
      if (priorityA !== priorityB) {
        return priorityA - priorityB
      }
      // If same priority, sort alphabetically by topic
      return a.topic.localeCompare(b.topic)
    })

    // Format company name from slug
    const companyName = companySlug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')

    return NextResponse.json({
      success: true,
      company: companyName,
      csvFiles,
      vendorInfo,
    })
  } catch (error) {
    console.error('Error fetching company data:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch company data' },
      { status: 500 }
    )
  }
}
