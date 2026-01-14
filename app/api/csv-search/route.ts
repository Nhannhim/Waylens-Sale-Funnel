import { NextResponse } from 'next/server'
import * as fs from 'fs'
import * as path from 'path'
import { generateCSVSummary, CSVDataForSummary } from '@/lib/csv-summarizer'

export const dynamic = 'force-dynamic'

interface CSVFileMetadata {
  filename: string
  filepath: string
  number: number
  company: string | null
  topic: string | null
  keywords: string[]
  columns: string[]
  rowCount: number
}

interface CSVFileIndex {
  files: CSVFileMetadata[]
  companies: string[]
  topics: string[]
  generatedAt: string
}

interface SearchFilters {
  companies?: string[]
  topics?: string[]
  limit?: number
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

function loadCSVIndex(): CSVFileIndex {
  const indexPath = path.join(process.cwd(), 'public', 'csv-index.json')
  const content = fs.readFileSync(indexPath, 'utf-8')
  return JSON.parse(content)
}

function parseSearchTerms(query: string): string[] {
  return query
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(term => term.length > 2)
}

function calculateMatchScore(
  file: CSVFileMetadata,
  searchTerms: string[],
  filters?: SearchFilters
): { score: number; matchedKeywords: string[] } {
  let score = 0
  const matchedKeywords: string[] = []

  for (const term of searchTerms) {
    if (file.company && file.company.toLowerCase().includes(term)) {
      score += 15
      if (!matchedKeywords.includes(file.company)) {
        matchedKeywords.push(file.company)
      }
    }

    if (file.topic && file.topic.toLowerCase().includes(term)) {
      score += 10
      if (!matchedKeywords.includes(file.topic)) {
        matchedKeywords.push(file.topic)
      }
    }

    for (const kw of file.keywords) {
      if (kw.includes(term) || term.includes(kw)) {
        score += 5
        if (!matchedKeywords.includes(kw)) {
          matchedKeywords.push(kw)
        }
      }
    }

    for (const col of file.columns) {
      if (col.toLowerCase().includes(term)) {
        score += 3
      }
    }
  }

  if (filters?.companies?.length && file.company) {
    if (filters.companies.some(c => file.company!.toLowerCase().includes(c.toLowerCase()))) {
      score += 5
    }
  }

  if (filters?.topics?.length && file.topic) {
    if (filters.topics.some(t => file.topic!.toLowerCase().includes(t.toLowerCase()))) {
      score += 5
    }
  }

  return { score, matchedKeywords }
}

function readCSVPreview(filepath: string, maxRows: number = 20): { columns: string[]; data: string[][]; totalRows: number } {
  const fullPath = path.join(process.cwd(), filepath)
  const content = fs.readFileSync(fullPath, 'utf-8')
  const lines = content.split('\n').filter(line => line.trim())

  if (lines.length === 0) {
    return { columns: [], data: [], totalRows: 0 }
  }

  const columns = parseCSVLine(lines[0])
  const data = lines.slice(1, maxRows + 1).map(line => parseCSVLine(line))
  const totalRows = Math.max(0, lines.length - 1)

  return { columns, data, totalRows }
}

export async function POST(request: Request) {
  try {
    const { query, filters } = await request.json()

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Query is required' },
        { status: 400 }
      )
    }

    const index = loadCSVIndex()
    const searchTerms = parseSearchTerms(query)

    if (searchTerms.length === 0) {
      return NextResponse.json({
        success: true,
        results: [],
        summary: null,
        searchedAt: new Date().toISOString(),
        totalMatches: 0,
      })
    }

    // Score and rank files
    const scoredFiles = index.files.map(file => {
      const { score, matchedKeywords } = calculateMatchScore(file, searchTerms, filters)
      return { ...file, score, matchedKeywords }
    })

    const matchedFiles = scoredFiles
      .filter(f => f.score > 0)
      .sort((a, b) => b.score - a.score)

    const limit = filters?.limit || 10
    const topFiles = matchedFiles.slice(0, limit)

    // Read previews for matched files
    const resultsWithPreviews = topFiles.map(file => {
      const { columns, data, totalRows } = readCSVPreview(file.filepath)
      return {
        ...file,
        columns,
        preview: data.slice(0, 5),
        totalRows,
      }
    })

    // Prepare data for Claude summarization
    const csvDataForSummary: CSVDataForSummary[] = resultsWithPreviews.slice(0, 5).map(r => ({
      filename: r.filename,
      columns: r.columns,
      data: readCSVPreview(r.filepath, 20).data,
      totalRows: r.totalRows,
    }))

    // Generate Claude summary
    const summary = await generateCSVSummary(query, csvDataForSummary)

    return NextResponse.json({
      success: true,
      results: resultsWithPreviews,
      summary,
      searchedAt: new Date().toISOString(),
      totalMatches: matchedFiles.length,
    })
  } catch (error) {
    console.error('Error in /api/csv-search:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to search CSV files' },
      { status: 500 }
    )
  }
}
