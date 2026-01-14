"use client"

import { useState } from "react"
import { Search, Building2, DollarSign, Users, TrendingUp, Target, Globe, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { CSVResultCard } from "./csv-result-card"
import { SearchSummaryCard } from "./search-summary-card"

interface SearchPageProps {
  ticker?: string
}

interface SearchSummary {
  directAnswer: string
  keyInsights: string[]
  relevantMetrics: Array<{
    metric: string
    value: string
    source: string
  }>
  competitiveImplications: string
}

interface CSVSearchResult {
  filename: string
  filepath: string
  score: number
  matchedKeywords: string[]
  company: string | null
  topic: string | null
  columns: string[]
  preview: string[][]
  totalRows: number
}

interface SearchResponse {
  success: boolean
  results: CSVSearchResult[]
  summary: SearchSummary | null
  totalMatches: number
  error?: string
}

const examplePrompts = [
  { icon: Building2, text: "What are Samsara's key customers and revenue?" },
  { icon: DollarSign, text: "Compare pricing across fleet management vendors" },
  { icon: Users, text: "Who are Lytx's strategic partners?" },
  { icon: TrendingUp, text: "What is the competitive landscape in video telematics?" },
  { icon: Target, text: "What verticals does Motive target?" },
  { icon: Globe, text: "Which companies have strong presence in Latin America?" },
]

export function SearchPage({ ticker }: SearchPageProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [results, setResults] = useState<CSVSearchResult[] | null>(null)
  const [summary, setSummary] = useState<SearchSummary | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [totalMatches, setTotalMatches] = useState(0)
  const [hasSearched, setHasSearched] = useState(false)

  const handleSearch = async (query: string) => {
    if (!query.trim()) return

    setLoading(true)
    setError(null)
    setHasSearched(true)

    try {
      const response = await fetch('/api/csv-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, filters: { limit: 10 } }),
      })

      const data: SearchResponse = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Search failed')
      }

      setResults(data.results)
      setSummary(data.summary)
      setTotalMatches(data.totalMatches)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setResults(null)
      setSummary(null)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(searchTerm)
    }
  }

  const handlePromptClick = (prompt: string) => {
    setSearchTerm(prompt)
    handleSearch(prompt)
  }

  const handleClear = () => {
    setSearchTerm("")
    setResults(null)
    setSummary(null)
    setHasSearched(false)
    setError(null)
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-120px)] px-4 py-6">
      <div className="w-full max-w-4xl mx-auto">
        {/* Search Bar */}
        <div className="relative mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search competitive intelligence data..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full pl-12 pr-24 h-14 text-base text-gray-900 bg-white border border-gray-300 rounded-full shadow-sm focus:shadow-md focus:border-gray-400 transition-all"
            />

            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
              {searchTerm && (
                <button
                  onClick={handleClear}
                  className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700"
                >
                  Clear
                </button>
              )}
              <button
                onClick={() => handleSearch(searchTerm)}
                disabled={!searchTerm.trim() || loading}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  'Search'
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-4" />
            <p className="text-gray-600">Searching through competitive intelligence data...</p>
            <p className="text-sm text-gray-400">Analyzing CSV files with AI</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
            <p className="text-sm text-red-600 mt-1">Make sure the CSV index has been generated.</p>
          </div>
        )}

        {/* Example Prompts - Show when no search has been performed */}
        {!hasSearched && !loading && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 text-center">
              Try searching for...
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {examplePrompts.map((prompt, idx) => {
                const Icon = prompt.icon
                return (
                  <button
                    key={idx}
                    onClick={() => handlePromptClick(prompt.text)}
                    className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-left"
                  >
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <span className="text-gray-700">{prompt.text}</span>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Results */}
        {!loading && hasSearched && results !== null && (
          <div>
            {/* Summary Card */}
            {summary && (
              <SearchSummaryCard summary={summary} query={searchTerm} />
            )}

            {/* Results Count */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-600">
                Found <span className="font-semibold">{totalMatches}</span> relevant data files
                {totalMatches > 10 && <span className="text-gray-400"> (showing top 10)</span>}
              </p>
              {results.length > 0 && (
                <button
                  onClick={handleClear}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  New search
                </button>
              )}
            </div>

            {/* Result Cards */}
            {results.length > 0 ? (
              <div className="space-y-3">
                {results.map((result, idx) => (
                  <CSVResultCard key={result.filename} result={result} rank={idx + 1} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600">No matching files found for "{searchTerm}"</p>
                <p className="text-sm text-gray-400 mt-2">Try different keywords or check the spelling</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
