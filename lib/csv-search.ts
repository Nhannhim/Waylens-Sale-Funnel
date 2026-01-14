export interface CSVFileMetadata {
  filename: string
  filepath: string
  number: number
  company: string | null
  topic: string | null
  keywords: string[]
  columns: string[]
  rowCount: number
}

export interface CSVFileIndex {
  files: CSVFileMetadata[]
  companies: string[]
  topics: string[]
  generatedAt: string
}

export interface CSVSearchResult extends CSVFileMetadata {
  score: number
  matchedKeywords: string[]
  preview: string[][]
}

export interface SearchFilters {
  companies?: string[]
  topics?: string[]
  limit?: number
}

let cachedIndex: CSVFileIndex | null = null

export async function loadCSVIndex(): Promise<CSVFileIndex> {
  if (cachedIndex) {
    return cachedIndex
  }

  const response = await fetch('/csv-index.json')
  if (!response.ok) {
    throw new Error('Failed to load CSV index')
  }

  cachedIndex = await response.json()
  return cachedIndex!
}

export function parseSearchTerms(query: string): string[] {
  return query
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(term => term.length > 2)
}

export function calculateMatchScore(
  file: CSVFileMetadata,
  searchTerms: string[],
  filters?: SearchFilters
): { score: number; matchedKeywords: string[] } {
  let score = 0
  const matchedKeywords: string[] = []

  for (const term of searchTerms) {
    // Exact company match: +15 points
    if (file.company && file.company.toLowerCase().includes(term)) {
      score += 15
      if (!matchedKeywords.includes(file.company)) {
        matchedKeywords.push(file.company)
      }
    }

    // Topic match: +10 points
    if (file.topic && file.topic.toLowerCase().includes(term)) {
      score += 10
      if (!matchedKeywords.includes(file.topic)) {
        matchedKeywords.push(file.topic)
      }
    }

    // Keyword in filename: +5 points per match
    for (const kw of file.keywords) {
      if (kw.includes(term) || term.includes(kw)) {
        score += 5
        if (!matchedKeywords.includes(kw)) {
          matchedKeywords.push(kw)
        }
      }
    }

    // Column header match: +3 points
    for (const col of file.columns) {
      if (col.toLowerCase().includes(term)) {
        score += 3
      }
    }
  }

  // Filter bonus
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

export async function searchCSVFiles(
  query: string,
  filters?: SearchFilters
): Promise<Array<CSVFileMetadata & { score: number; matchedKeywords: string[] }>> {
  const index = await loadCSVIndex()
  const searchTerms = parseSearchTerms(query)

  if (searchTerms.length === 0) {
    return []
  }

  const scoredFiles = index.files.map(file => {
    const { score, matchedKeywords } = calculateMatchScore(file, searchTerms, filters)
    return { ...file, score, matchedKeywords }
  })

  const limit = filters?.limit || 20

  return scoredFiles
    .filter(f => f.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
}

export function formatFilename(filename: string): string {
  return filename
    .replace('.csv', '')
    .replace(/^\d+_/, '')
    .replace(/_/g, ' ')
    .replace(/mrm /gi, '')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
