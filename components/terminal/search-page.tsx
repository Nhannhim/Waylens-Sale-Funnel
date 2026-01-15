"use client"

import { useState } from "react"
import { Search, Loader2, Building2, TrendingUp, Users, DollarSign, Truck, Video, Globe, Cpu } from "lucide-react"
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

// Key competitors/companies for Waylens sales team
const featuredCompanies = [
  {
    name: "Samsara",
    category: "Video Telematics",
    metric: "700K+",
    metricLabel: "Vehicles",
    highlight: "$5.4B valuation",
    description: "AI-powered fleet management, video safety, ELD compliance",
    icon: Video,
    color: "blue"
  },
  {
    name: "Lytx",
    category: "Video Telematics",
    metric: "1M+",
    metricLabel: "Vehicles",
    highlight: "Market leader in dashcams",
    description: "DriveCam video safety, risk detection, driver coaching",
    icon: Video,
    color: "green"
  },
  {
    name: "Motive",
    category: "ELD & Telematics",
    metric: "500K+",
    metricLabel: "Vehicles",
    highlight: "$2.85B valuation",
    description: "AI dashcams, ELD, fleet management for trucking",
    icon: Truck,
    color: "purple"
  },
  {
    name: "Geotab",
    category: "Fleet Management",
    metric: "4.5M+",
    metricLabel: "Vehicles",
    highlight: "Largest open platform",
    description: "Open platform telematics, EV solutions, data analytics",
    icon: Globe,
    color: "orange"
  },
  {
    name: "Verizon Connect",
    category: "Enterprise Fleet",
    metric: "500K+",
    metricLabel: "Vehicles",
    highlight: "Fleetmatics + Telogis",
    description: "Enterprise fleet management, field service, compliance",
    icon: Building2,
    color: "red"
  },
  {
    name: "Mix Powerfleet",
    category: "Fleet Telematics",
    metric: "1.1M+",
    metricLabel: "Vehicles",
    highlight: "Global presence",
    description: "Fleet management, industrial IoT, supply chain visibility",
    icon: TrendingUp,
    color: "teal"
  },
  {
    name: "Fleet Complete",
    category: "Fleet Management",
    metric: "800K+",
    metricLabel: "Vehicles",
    highlight: "SMB focus",
    description: "GPS tracking, dispatching, mobile workforce management",
    icon: Users,
    color: "indigo"
  },
  {
    name: "Omnitracs",
    category: "Enterprise Trucking",
    metric: "1M+",
    metricLabel: "Vehicles",
    highlight: "Enterprise focus",
    description: "Trucking solutions, routing, compliance, SmartDrive video",
    icon: Truck,
    color: "slate"
  },
  {
    name: "CalAmp",
    category: "Telematics Hardware",
    metric: "10M+",
    metricLabel: "Devices",
    highlight: "OEM partnerships",
    description: "Telematics hardware, IoT devices, connected car solutions",
    icon: Cpu,
    color: "cyan"
  },
]

const colorClasses: Record<string, { bg: string; text: string; border: string }> = {
  blue: { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-200" },
  green: { bg: "bg-green-50", text: "text-green-600", border: "border-green-200" },
  purple: { bg: "bg-purple-50", text: "text-purple-600", border: "border-purple-200" },
  orange: { bg: "bg-orange-50", text: "text-orange-600", border: "border-orange-200" },
  red: { bg: "bg-red-50", text: "text-red-600", border: "border-red-200" },
  teal: { bg: "bg-teal-50", text: "text-teal-600", border: "border-teal-200" },
  indigo: { bg: "bg-indigo-50", text: "text-indigo-600", border: "border-indigo-200" },
  slate: { bg: "bg-slate-50", text: "text-slate-600", border: "border-slate-200" },
  cyan: { bg: "bg-cyan-50", text: "text-cyan-600", border: "border-cyan-200" },
}

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

  const handleCompanyClick = (companyName: string) => {
    setSearchTerm(companyName)
    handleSearch(companyName)
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
      <div className="w-full max-w-5xl mx-auto">
        {/* Tagline */}
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-6">
          Find your Way...
        </h1>

        {/* Search Bar */}
        <div className="relative mb-8">
          <div className="relative max-w-3xl mx-auto">
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
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 max-w-3xl mx-auto">
            <p className="text-red-800">{error}</p>
            <p className="text-sm text-red-600 mt-1">Make sure the CSV index has been generated.</p>
          </div>
        )}

        {/* Company Grid - Show when no search has been performed */}
        {!hasSearched && !loading && (
          <div className="mt-4">
            <h2 className="text-lg font-semibold text-gray-700 mb-4 text-center">
              Key Competitors & Market Players
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {featuredCompanies.map((company) => {
                const Icon = company.icon
                const colors = colorClasses[company.color]
                return (
                  <button
                    key={company.name}
                    onClick={() => handleCompanyClick(company.name)}
                    className={`p-4 bg-white border ${colors.border} rounded-lg hover:shadow-md transition-all text-left group`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 ${colors.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <Icon className={`w-5 h-5 ${colors.text}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {company.name}
                          </h3>
                          <span className={`text-xs font-medium ${colors.text} ${colors.bg} px-2 py-0.5 rounded`}>
                            {company.category}
                          </span>
                        </div>
                        <div className="mt-1 flex items-baseline gap-2">
                          <span className="text-xl font-bold text-gray-900">{company.metric}</span>
                          <span className="text-xs text-gray-500">{company.metricLabel}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{company.description}</p>
                        <p className={`text-xs font-medium ${colors.text} mt-1`}>{company.highlight}</p>
                      </div>
                    </div>
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
