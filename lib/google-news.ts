import { NEWS_MAX_AGE_DAYS } from './news-config'

export interface NewsArticle {
  title: string
  link: string
  source: string
  publishedAt: Date
  description: string
  query: string
}

function buildGoogleNewsUrl(query: string): string {
  const encodedQuery = encodeURIComponent(query)
  return `https://news.google.com/rss/search?q=${encodedQuery}&hl=en-US&gl=US&ceid=US:en`
}

function parseXmlText(xml: string, tag: string): string {
  const regex = new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([^\\]]*?)\\]\\]></${tag}>|<${tag}[^>]*>([^<]*)</${tag}>`)
  const match = xml.match(regex)
  return match ? (match[1] || match[2] || '').trim() : ''
}

function extractSource(title: string): { cleanTitle: string; source: string } {
  const parts = title.split(' - ')
  if (parts.length >= 2) {
    const source = parts.pop()?.trim() || 'Unknown'
    const cleanTitle = parts.join(' - ').trim()
    return { cleanTitle, source }
  }
  return { cleanTitle: title, source: 'Unknown' }
}

function isWithinMaxAge(date: Date): boolean {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = diffMs / (1000 * 60 * 60 * 24)
  return diffDays <= NEWS_MAX_AGE_DAYS
}

export async function fetchGoogleNews(query: string): Promise<NewsArticle[]> {
  const url = buildGoogleNewsUrl(query)

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; NewsAggregator/1.0)',
      },
    })

    if (!response.ok) {
      console.error(`Failed to fetch news for query "${query}": ${response.status}`)
      return []
    }

    const xml = await response.text()
    const articles: NewsArticle[] = []

    const itemRegex = /<item>([\s\S]*?)<\/item>/g
    let match

    while ((match = itemRegex.exec(xml)) !== null) {
      const itemXml = match[1]

      const rawTitle = parseXmlText(itemXml, 'title')
      const { cleanTitle, source } = extractSource(rawTitle)
      const link = parseXmlText(itemXml, 'link')
      const pubDate = parseXmlText(itemXml, 'pubDate')
      const description = parseXmlText(itemXml, 'description')

      const publishedAt = new Date(pubDate)

      if (isNaN(publishedAt.getTime())) {
        continue
      }

      if (!isWithinMaxAge(publishedAt)) {
        continue
      }

      articles.push({
        title: cleanTitle,
        link,
        source,
        publishedAt,
        description,
        query,
      })
    }

    return articles
  } catch (error) {
    console.error(`Error fetching news for query "${query}":`, error)
    return []
  }
}

export async function fetchAllNews(queries: string[]): Promise<NewsArticle[]> {
  const results = await Promise.all(queries.map(fetchGoogleNews))
  const allArticles = results.flat()

  // Deduplicate by link
  const seen = new Set<string>()
  const deduplicated = allArticles.filter(article => {
    if (seen.has(article.link)) {
      return false
    }
    seen.add(article.link)
    return true
  })

  // Sort by date, newest first
  deduplicated.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())

  return deduplicated
}
