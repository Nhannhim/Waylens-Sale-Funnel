import { NextResponse } from 'next/server'
import { fetchAllNews } from '@/lib/google-news'
import { categorizeArticles, generateSummary, CategorizedNews } from '@/lib/claude-summarizer'
import { ALL_SEARCH_QUERIES } from '@/lib/news-config'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    const articles = await fetchAllNews(ALL_SEARCH_QUERIES)

    if (articles.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          competitors: [],
          industry: [],
          regulatory: [],
          technology: [],
        } as CategorizedNews,
        summary: null,
        fetchedAt: new Date().toISOString(),
        articleCount: 0,
      })
    }

    const categorizedNews = await categorizeArticles(articles)
    const summary = await generateSummary(categorizedNews)

    const totalCount =
      categorizedNews.competitors.length +
      categorizedNews.industry.length +
      categorizedNews.regulatory.length +
      categorizedNews.technology.length

    return NextResponse.json({
      success: true,
      data: categorizedNews,
      summary,
      fetchedAt: new Date().toISOString(),
      articleCount: totalCount,
    })
  } catch (error) {
    console.error('Error in /api/news:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch news',
      },
      { status: 500 }
    )
  }
}
