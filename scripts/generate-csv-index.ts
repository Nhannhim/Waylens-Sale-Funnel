import * as fs from 'fs'
import * as path from 'path'

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

const KNOWN_COMPANIES = [
  'samsara', 'lytx', 'motive', 'geotab', 'trimble', 'calamp',
  'netradyne', 'webfleet', 'verizon', 'teletrac', 'navman',
  'azuga', 'platform_science', 'zonar', 'omnitracs', 'spireon',
  'powerfleet', 'fleet_complete', 'fleetmatics', 'telogis',
  'orbcomm', 'qualcomm', 'peoplenet', 'keeptruckin', 'nauto',
  'smartdrive', 'greenroad', 'mix_telematics', 'gurtam', 'wisetrack',
  'clearpathgps', 'linxup', 'rhino', 'solera', 'ituran', 'octo',
  'mobileye', 'fourkites', 'project44', 'descartes', 'transflo'
]

const KNOWN_TOPICS = [
  'customers', 'customer', 'partnerships', 'partners', 'pricing',
  'market', 'technology', 'acquisitions', 'acquisition', 'company',
  'overview', 'profile', 'products', 'competitors', 'competitive',
  'fleet', 'operators', 'video', 'telematics', 'eld', 'distribution',
  'vertical', 'industry', 'revenue', 'metrics', 'government'
]

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

function extractMetadata(filename: string): { number: number; company: string | null; topic: string | null; keywords: string[] } {
  const baseName = filename.replace('.csv', '')
  const parts = baseName.split('_')

  const number = parseInt(parts[0], 10) || 0
  const nameParts = parts.slice(1)
  const keywords = nameParts.map(p => p.toLowerCase())

  let company: string | null = null
  let topic: string | null = null

  for (const kw of keywords) {
    if (!company && KNOWN_COMPANIES.some(c => kw.includes(c) || c.includes(kw))) {
      company = KNOWN_COMPANIES.find(c => kw.includes(c) || c.includes(kw)) || kw
    }
    if (!topic && KNOWN_TOPICS.some(t => kw.includes(t))) {
      topic = kw
    }
  }

  return { number, company, topic, keywords }
}

function processCSVFile(filepath: string, filename: string): CSVFileMetadata | null {
  try {
    const content = fs.readFileSync(filepath, 'utf-8')
    const lines = content.split('\n').filter(line => line.trim())

    if (lines.length === 0) return null

    const columns = parseCSVLine(lines[0])
    const rowCount = Math.max(0, lines.length - 1)

    const { number, company, topic, keywords } = extractMetadata(filename)

    return {
      filename,
      filepath: `waylens_filtered_data/high_priority/${filename}`,
      number,
      company,
      topic,
      keywords,
      columns,
      rowCount
    }
  } catch (error) {
    console.error(`Error processing ${filename}:`, error)
    return null
  }
}

function generateIndex(): void {
  const highPriorityDir = path.join(process.cwd(), 'waylens_filtered_data', 'high_priority')
  const outputPath = path.join(process.cwd(), 'public', 'csv-index.json')

  console.log('Scanning directory:', highPriorityDir)

  const files = fs.readdirSync(highPriorityDir).filter(f => f.endsWith('.csv'))
  console.log(`Found ${files.length} CSV files`)

  const metadata: CSVFileMetadata[] = []
  const companiesSet = new Set<string>()
  const topicsSet = new Set<string>()

  for (const file of files) {
    const filepath = path.join(highPriorityDir, file)
    const meta = processCSVFile(filepath, file)

    if (meta) {
      metadata.push(meta)
      if (meta.company) companiesSet.add(meta.company)
      if (meta.topic) topicsSet.add(meta.topic)
    }
  }

  const index: CSVFileIndex = {
    files: metadata.sort((a, b) => a.number - b.number),
    companies: Array.from(companiesSet).sort(),
    topics: Array.from(topicsSet).sort(),
    generatedAt: new Date().toISOString()
  }

  fs.writeFileSync(outputPath, JSON.stringify(index, null, 2))
  console.log(`\nGenerated index with ${metadata.length} files`)
  console.log(`Companies detected: ${index.companies.length}`)
  console.log(`Topics detected: ${index.topics.length}`)
  console.log(`Output: ${outputPath}`)
}

generateIndex()
