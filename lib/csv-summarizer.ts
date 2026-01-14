export interface CSVDataForSummary {
  filename: string
  columns: string[]
  data: string[][]
  totalRows: number
}

export interface SearchSummary {
  directAnswer: string
  keyInsights: string[]
  relevantMetrics: Array<{
    metric: string
    value: string
    source: string
  }>
  competitiveImplications: string
}

const CSV_SEARCH_SYSTEM_PROMPT = `You are a competitive intelligence analyst for Waylens, a fleet video telematics company. Your job is to analyze CSV data from market research and provide actionable insights for the sales team.

When summarizing CSV data:
1. Focus on answering the user's specific question
2. Extract key metrics, names, and figures from the data
3. Highlight competitive insights relevant to Waylens
4. Keep summaries concise (3-5 bullet points)
5. Note any data gaps or limitations

Output JSON format:
{
  "directAnswer": "One sentence directly answering the query",
  "keyInsights": ["Bullet point 1", "Bullet point 2", ...],
  "relevantMetrics": [
    {"metric": "Revenue", "value": "$937M", "source": "262_samsara_company_data.csv"}
  ],
  "competitiveImplications": "Brief note on what this means for Waylens sales"
}

Only output valid JSON, no other text.`

export async function generateCSVSummary(
  query: string,
  csvData: CSVDataForSummary[]
): Promise<SearchSummary | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY

  if (!apiKey || csvData.length === 0) {
    return null
  }

  // Prepare CSV data for Claude (limit token usage)
  const dataForPrompt = csvData.slice(0, 5).map(csv => ({
    filename: csv.filename,
    columns: csv.columns,
    sampleData: csv.data.slice(0, 15), // First 15 rows
    totalRows: csv.totalRows,
  }))

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2048,
        system: CSV_SEARCH_SYSTEM_PROMPT,
        messages: [
          {
            role: 'user',
            content: `User query: "${query}"

Relevant CSV data found:
${JSON.stringify(dataForPrompt, null, 2)}

Analyze this data and answer the user's question.`,
          },
        ],
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('Claude API error:', error)
      return null
    }

    const data = await response.json()
    const content = data.content?.[0]?.text

    if (!content) {
      console.error('No content in Claude response')
      return null
    }

    // Strip markdown code fences if present
    let jsonContent = content.trim()
    if (jsonContent.startsWith('```')) {
      jsonContent = jsonContent.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '')
    }

    return JSON.parse(jsonContent) as SearchSummary
  } catch (error) {
    console.error('Error generating CSV summary:', error)
    return null
  }
}
