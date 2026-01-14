"use client"

import { useState, useEffect, useCallback } from "react"
import { Newspaper, ExternalLink, TrendingUp, RefreshCw, Loader2, Sparkles } from "lucide-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

interface NewsPageProps {
  ticker: string
}

interface Article {
  title: string
  link: string
  source: string
  publishedAt: string
  description: string
  query: string
  category: string
}

interface CategorizedNews {
  competitors: Article[]
  industry: Article[]
  regulatory: Article[]
  technology: Article[]
}

interface SummarySection {
  title: string
  bullets: string[]
}

interface NewsSummary {
  competitors: SummarySection[]
  industry: string[]
  regulatory: string[]
  technology: string[]
}

interface NewsResponse {
  success: boolean
  data: CategorizedNews
  summary: NewsSummary | null
  fetchedAt: string
  articleCount: number
  error?: string
}

const CATEGORY_LABELS = {
  competitors: "Competitors",
  industry: "Industry Trends",
  regulatory: "Regulatory",
  technology: "Technology",
}

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`
  return `${Math.floor(diffDays / 30)}mo ago`
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

function SummaryCard({ summary }: { summary: NewsSummary }) {
  const hasCompetitors = summary.competitors && summary.competitors.length > 0
  const hasIndustry = summary.industry && summary.industry.length > 0
  const hasRegulatory = summary.regulatory && summary.regulatory.length > 0
  const hasTechnology = summary.technology && summary.technology.length > 0

  if (!hasCompetitors && !hasIndustry && !hasRegulatory && !hasTechnology) {
    return null
  }

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-5">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">AI Summary</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Competitors Section */}
        {hasCompetitors && (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-blue-800 uppercase tracking-wide">Competitors</h4>
            {summary.competitors.map((section, idx) => (
              <div key={idx} className="pl-3 border-l-2 border-blue-300">
                <p className="text-sm font-medium text-gray-800">{section.title}</p>
                <ul className="mt-1 space-y-0.5">
                  {section.bullets.map((bullet, bidx) => (
                    <li key={bidx} className="text-sm text-gray-600">• {bullet}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {/* Other Sections */}
        <div className="space-y-3">
          {hasIndustry && (
            <div>
              <h4 className="text-sm font-semibold text-green-800 uppercase tracking-wide">Industry</h4>
              <ul className="mt-1 space-y-0.5">
                {summary.industry.map((item, idx) => (
                  <li key={idx} className="text-sm text-gray-600">• {item}</li>
                ))}
              </ul>
            </div>
          )}

          {hasRegulatory && (
            <div>
              <h4 className="text-sm font-semibold text-orange-800 uppercase tracking-wide">Regulatory</h4>
              <ul className="mt-1 space-y-0.5">
                {summary.regulatory.map((item, idx) => (
                  <li key={idx} className="text-sm text-gray-600">• {item}</li>
                ))}
              </ul>
            </div>
          )}

          {hasTechnology && (
            <div>
              <h4 className="text-sm font-semibold text-purple-800 uppercase tracking-wide">Technology</h4>
              <ul className="mt-1 space-y-0.5">
                {summary.technology.map((item, idx) => (
                  <li key={idx} className="text-sm text-gray-600">• {item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function ArticleList({ articles }: { articles: Article[] }) {
  if (articles.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No articles found in this category.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {articles.map((article, idx) => (
        <div key={idx} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs text-gray-500">{formatTimeAgo(article.publishedAt)}</span>
              </div>
              <a
                href={article.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-base font-semibold text-gray-900 mb-2 hover:text-blue-600 cursor-pointer block"
              >
                {article.title}
              </a>
              <div className="flex items-center gap-3 text-xs text-gray-600">
                <span className="font-medium text-gray-900">{article.source}</span>
                <span>•</span>
                <span>{formatDate(article.publishedAt)}</span>
              </div>
            </div>
            <a
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="w-4 h-4 text-gray-400 hover:text-blue-600 cursor-pointer flex-shrink-0 mt-1" />
            </a>
          </div>
        </div>
      ))}
    </div>
  )
}

export function NewsPage({ ticker }: NewsPageProps) {
  const [news, setNews] = useState<CategorizedNews | null>(null)
  const [summary, setSummary] = useState<NewsSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  const fetchNews = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true)
    } else {
      setLoading(true)
    }
    setError(null)

    try {
      const response = await fetch("/api/news")
      const data: NewsResponse = await response.json()

      if (!data.success) {
        throw new Error(data.error || "Failed to fetch news")
      }

      setNews(data.data)
      setSummary(data.summary)
      setLastUpdated(data.fetchedAt)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    fetchNews()
  }, [fetchNews])

  const totalArticles = news
    ? news.competitors.length + news.industry.length + news.regulatory.length + news.technology.length
    : 0

  return (
    <div className="space-y-4">
      {/* News Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Newspaper className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-semibold text-black">Telematics Industry News</h2>
          </div>
          <div className="flex items-center gap-4">
            {lastUpdated && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <TrendingUp className="w-4 h-4" />
                <span>Updated {formatTimeAgo(lastUpdated)}</span>
              </div>
            )}
            <button
              onClick={() => fetchNews(true)}
              disabled={refreshing}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-md transition-colors disabled:opacity-50"
            >
              {refreshing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
              Refresh
            </button>
          </div>
        </div>

        <p className="text-sm text-gray-600">
          Live news covering competitors (Samsara, Motive, Lytx, Geotab),
          industry trends, regulatory updates, and technology innovations.
          {totalArticles > 0 && ` ${totalArticles} articles from the past 14 days.`}
        </p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-center h-[400px]">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              <p className="text-gray-600">Loading news and generating summary...</p>
            </div>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-center h-[400px]">
            <div className="flex flex-col items-center gap-4 text-center">
              <p className="text-red-600 font-medium">Error loading news</p>
              <p className="text-gray-600 text-sm">{error}</p>
              <button
                onClick={() => fetchNews()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Summary */}
      {!loading && !error && summary && <SummaryCard summary={summary} />}

      {/* News Headlines */}
      {!loading && !error && news && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">All Headlines</h3>
          <Tabs defaultValue="competitors" className="h-[450px]">
            <TabsList className="mb-4">
              <TabsTrigger value="competitors">
                {CATEGORY_LABELS.competitors} ({news.competitors.length})
              </TabsTrigger>
              <TabsTrigger value="industry">
                {CATEGORY_LABELS.industry} ({news.industry.length})
              </TabsTrigger>
              <TabsTrigger value="regulatory">
                {CATEGORY_LABELS.regulatory} ({news.regulatory.length})
              </TabsTrigger>
              <TabsTrigger value="technology">
                {CATEGORY_LABELS.technology} ({news.technology.length})
              </TabsTrigger>
            </TabsList>

            {(Object.keys(CATEGORY_LABELS) as Array<keyof typeof CATEGORY_LABELS>).map((category) => (
              <TabsContent key={category} value={category} className="h-[380px]">
                <div className="h-full overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-blue-500 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:bg-blue-600">
                  <ArticleList articles={news[category]} />
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      )}
    </div>
  )
}
