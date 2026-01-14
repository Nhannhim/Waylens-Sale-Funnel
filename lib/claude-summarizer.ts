import { NewsArticle } from './google-news'
import { NewsCategory, NEWS_CATEGORIES, COMPETITOR_QUERIES } from './news-config'

export interface CategorizedArticle extends NewsArticle {
  category: NewsCategory
  isTopStory?: boolean
}

export interface CategorizedNews {
  competitors: CategorizedArticle[]
  industry: CategorizedArticle[]
  regulatory: CategorizedArticle[]
  technology: CategorizedArticle[]
}

export interface NewsSummarySection {
  title: string
  bullets: string[]
}

export interface NewsSummary {
  competitors: NewsSummarySection[]
  industry: string[]
  regulatory: string[]
  technology: string[]
}

const SYSTEM_PROMPT = `You are a news categorization assistant for Waylens, a company that makes cameras and software for fleet vehicle companies. Your job is to filter and categorize news for the sales team.

IMPORTANT: Only include articles about FUNDAMENTAL BUSINESS changes. EXCLUDE any articles that are primarily about:
- Stock price movements, trading patterns, technical analysis
- Buy/sell ratings, price targets, analyst opinions
- Market cap changes, share performance
- Investment advice or stock recommendations
- Articles with titles like "time to buy?", "stock drops", "shares rise", etc.

For articles that pass the filter, categorize into ONE of these categories:
- competitors: News about competitor companies (Samsara, Motive, Lytx, Verizon Connect, Geotab, Omnitracs) - product launches, partnerships, acquisitions, leadership changes, customer wins
- industry: Fleet management market trends, industry reports, business developments
- regulatory: Government regulations, compliance requirements, ELD mandates, safety regulations
- technology: New technology developments, product innovations, technical capabilities

Respond with a JSON array where each object has "index" (0-based) and "category" (one of: competitors, industry, regulatory, technology).
SKIP articles that are primarily about stock/trading - do not include them in the output.
Only output valid JSON, no other text.`

export async function categorizeArticles(articles: NewsArticle[]): Promise<CategorizedNews> {
  const apiKey = process.env.ANTHROPIC_API_KEY

  if (!apiKey) {
    console.error('ANTHROPIC_API_KEY not set, using fallback categorization')
    return fallbackCategorization(articles)
  }

  const articleSummaries = articles.map((article, index) => ({
    index,
    title: article.title,
    source: article.source,
    query: article.query,
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
        max_tokens: 4096,
        system: SYSTEM_PROMPT,
        messages: [
          {
            role: 'user',
            content: `Categorize these ${articles.length} news articles:\n\n${JSON.stringify(articleSummaries, null, 2)}`,
          },
        ],
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('Claude API error:', error)
      return fallbackCategorization(articles)
    }

    const data = await response.json()
    const content = data.content?.[0]?.text

    if (!content) {
      console.error('No content in Claude response')
      return fallbackCategorization(articles)
    }

    // Strip markdown code fences if present
    let jsonContent = content.trim()
    if (jsonContent.startsWith('```')) {
      jsonContent = jsonContent.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '')
    }

    const categorizations: Array<{ index: number; category: NewsCategory }> = JSON.parse(jsonContent)

    const result: CategorizedNews = {
      competitors: [],
      industry: [],
      regulatory: [],
      technology: [],
    }

    for (const { index, category } of categorizations) {
      if (articles[index] && category in NEWS_CATEGORIES) {
        result[category].push({
          ...articles[index],
          category,
        })
      }
    }

    return result
  } catch (error) {
    console.error('Error categorizing articles:', error)
    return fallbackCategorization(articles)
  }
}

const SUMMARY_PROMPT = `You are a news analyst for Waylens, a fleet camera/software company. Create a VERY BRIEF executive summary of the most important news.

Rules:
- Be extremely concise - each bullet should be ONE short sentence (under 15 words)
- Only include the 2-3 MOST IMPORTANT stories per section
- For competitors, group by company name (Samsara, Motive, Geotab, etc.)
- Skip sections with no significant news
- Focus on: product launches, partnerships, acquisitions, major announcements
- Ignore minor updates or repetitive stories

Output JSON with this exact structure:
{
  "competitors": [
    { "title": "Samsara", "bullets": ["Launched new AI dashcam feature", "Partnered with XYZ"] },
    { "title": "Motive", "bullets": ["Expanded to European market"] }
  ],
  "industry": ["Fleet telematics market growing 15% YoY"],
  "regulatory": ["New ELD compliance deadline set for Q2"],
  "technology": ["AI driver coaching adoption increasing"]
}

Only output valid JSON, no other text.`

export async function generateSummary(categorizedNews: CategorizedNews): Promise<NewsSummary | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY

  if (!apiKey) {
    return null
  }

  const allArticles = [
    ...categorizedNews.competitors.slice(0, 15).map(a => ({ ...a, section: 'competitors' })),
    ...categorizedNews.industry.slice(0, 10).map(a => ({ ...a, section: 'industry' })),
    ...categorizedNews.regulatory.slice(0, 5).map(a => ({ ...a, section: 'regulatory' })),
    ...categorizedNews.technology.slice(0, 10).map(a => ({ ...a, section: 'technology' })),
  ]

  if (allArticles.length === 0) {
    return null
  }

  const articleData = allArticles.map(a => ({
    title: a.title,
    source: a.source,
    section: a.section,
    query: a.query,
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
        system: SUMMARY_PROMPT,
        messages: [
          {
            role: 'user',
            content: `Summarize the most important news from these articles:\n\n${JSON.stringify(articleData, null, 2)}`,
          },
        ],
      }),
    })

    if (!response.ok) {
      console.error('Claude API error generating summary')
      return null
    }

    const data = await response.json()
    const content = data.content?.[0]?.text

    if (!content) {
      return null
    }

    let jsonContent = content.trim()
    if (jsonContent.startsWith('```')) {
      jsonContent = jsonContent.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '')
    }

    return JSON.parse(jsonContent) as NewsSummary
  } catch (error) {
    console.error('Error generating summary:', error)
    return null
  }
}

function isStockRelated(title: string): boolean {
  const stockKeywords = [
    'stock', 'shares', 'buy', 'sell', 'analyst', 'rating', 'price target',
    'market cap', 'trading', 'investors', 'wall street', 'earnings call',
    'eps', 'revenue miss', 'revenue beat', 'triple bottom', 'double top',
    'bullish', 'bearish', 'oversold', 'overbought', 'dividend', 'ipo',
    'nasdaq', 'nyse', 'time to buy', 'should you buy', 'stock price'
  ]
  const titleLower = title.toLowerCase()
  return stockKeywords.some(kw => titleLower.includes(kw))
}

function fallbackCategorization(articles: NewsArticle[]): CategorizedNews {
  const result: CategorizedNews = {
    competitors: [],
    industry: [],
    regulatory: [],
    technology: [],
  }

  const competitorNames = COMPETITOR_QUERIES.map(q => q.toLowerCase())
  const regulatoryKeywords = ['regulation', 'compliance', 'eld', 'mandate', 'fmcsa', 'dot', 'law', 'rule']
  const techKeywords = ['technology', 'ai', 'camera', 'sensor', 'software', 'platform', 'launch', 'release']

  for (const article of articles) {
    const titleLower = article.title.toLowerCase()
    const queryLower = article.query.toLowerCase()

    // Skip stock-related articles
    if (isStockRelated(article.title)) {
      continue
    }

    let category: NewsCategory = 'industry'

    if (competitorNames.some(name => titleLower.includes(name) || queryLower.includes(name))) {
      category = 'competitors'
    } else if (regulatoryKeywords.some(kw => titleLower.includes(kw))) {
      category = 'regulatory'
    } else if (techKeywords.some(kw => titleLower.includes(kw))) {
      category = 'technology'
    }

    result[category].push({ ...article, category })
  }

  return result
}
