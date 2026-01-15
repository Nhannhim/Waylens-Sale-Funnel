"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, Loader2, Building2, TrendingUp, Users, Truck, Video, Globe, Cpu, MapPin } from "lucide-react"
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

// Market players data from CSV: 02_fleet_management_vendors.csv (all 42 vendors)
const marketPlayers = [
  { name: "Geotab", category: "3M+", units: "3,000,000+", region: "Global (strong NA)", ownership: "Independent (Private)", description: "Market leader; open platform; extensive integrations", color: "orange" },
  { name: "Verizon Connect", category: "1M-3M", units: "2,000,000", region: "Global", ownership: "Verizon (Public)", description: "Carrier-backed; enterprise focus; brand recognition", color: "red" },
  { name: "Samsara", category: "1M-3M", units: "1,500,000", region: "North America", ownership: "Independent (Public: IOT)", description: "Modern platform; video telematics; rapid growth; public company", color: "blue" },
  { name: "CalAmp", category: "1M-3M", units: "1,200,000", region: "Americas", ownership: "Independent (Public: CAMP)", description: "Telematics hardware; software platform", color: "cyan" },
  { name: "Solera Fleet Solutions", category: "1M-3M", units: "1,100,000", region: "Global", ownership: "Solera Holdings", description: "Omnitracs legacy; long industry presence", color: "slate" },
  { name: "Lytx", category: "500K-1M", units: "800,000", region: "North America", ownership: "Private", description: "Video telematics leader; AI dash cams; driver safety", color: "green" },
  { name: "Motive", category: "500K-1M", units: "700,000", region: "North America", ownership: "Private", description: "Integrated operations platform; modern UI; ELD", color: "purple" },
  { name: "Trimble Transportation", category: "500K-1M", units: "650,000", region: "Global", ownership: "Being acquired by Platform Science", description: "Navigation; routing; long-haul focus", color: "indigo" },
  { name: "Gurtam", category: "500K-1M", units: "600,000", region: "Global (strong LatAm)", ownership: "Independent", description: "Wialon platform; white-label solutions", color: "teal" },
  { name: "Bridgestone Mobility Solutions", category: "500K-1M", units: "550,000", region: "Global", ownership: "Bridgestone (Tire OEM)", description: "Webfleet + Azuga; tire manufacturer diversification", color: "orange" },
  { name: "MICHELIN Connected Fleet", category: "500K-1M", units: "520,000", region: "Americas", ownership: "Michelin (Tire OEM)", description: "Sascar in LatAm; security + optimization", color: "blue" },
  { name: "Fleet Complete", category: "500K-1M", units: "500,000", region: "North America", ownership: "Recently acquired by Powerfleet", description: "SMB focus; video solutions", color: "green" },
  { name: "Zonar Systems", category: "500K-1M", units: "480,000", region: "North America", ownership: "Continental (Tire/Auto OEM)", description: "Inspection systems; municipal/transit focus", color: "purple" },
  { name: "GPS Insight", category: "500K-1M", units: "450,000", region: "North America", ownership: "Private", description: "Mid-market focus; strong customer service", color: "teal" },
  { name: "Powerfleet", category: "500K-1M", units: "450,000", region: "Global", ownership: "Independent (Public: AIOT)", description: "Recently acquired MiX + Fleet Complete", color: "red" },
  { name: "WideTech", category: "100K-500K", units: "400,000", region: "Latin America", ownership: "Private", description: "Brazil focus", color: "slate" },
  { name: "Navixy / SquareGPS", category: "100K-500K", units: "380,000", region: "Americas", ownership: "Private", description: "Platform provider; white-label", color: "cyan" },
  { name: "Encontrack", category: "100K-500K", units: "350,000", region: "Latin America", ownership: "Private", description: "Security focus", color: "indigo" },
  { name: "Ituran", category: "100K-500K", units: "320,000", region: "Americas", ownership: "Public", description: "Stolen vehicle recovery; security", color: "orange" },
  { name: "Teletrac Navman", category: "100K-500K", units: "300,000", region: "Global", ownership: "Verizon", description: "Verizon Connect competitor; enterprise", color: "blue" },
  { name: "Pósitron (Stoneridge)", category: "100K-500K", units: "280,000", region: "Latin America", ownership: "Stoneridge (Auto supplier)", description: "Brazil market; OEM relationships", color: "green" },
  { name: "Linxup", category: "100K-500K", units: "270,000", region: "North America", ownership: "Private", description: "SMB focus; affordable pricing", color: "purple" },
  { name: "GPS Trackit", category: "100K-500K", units: "250,000", region: "North America", ownership: "Private", description: "Government/public sector focus", color: "teal" },
  { name: "RedGPS", category: "100K-500K", units: "240,000", region: "Latin America", ownership: "Private", description: "White-label platform; OnTracking", color: "red" },
  { name: "Autotrac", category: "100K-500K", units: "230,000", region: "Latin America", ownership: "Private", description: "Brazil market", color: "slate" },
  { name: "3Dtracking", category: "100K-500K", units: "220,000", region: "Latin America", ownership: "Private", description: "Mexico focus", color: "cyan" },
  { name: "Omnilink (Show Tecnologia)", category: "100K-500K", units: "210,000", region: "Latin America", ownership: "Private", description: "Gestor platform; Brazil", color: "indigo" },
  { name: "DCT", category: "100K-500K", units: "200,000", region: "North America", ownership: "Private", description: "Long-haul trucking", color: "orange" },
  { name: "OnixSat", category: "100K-500K", units: "190,000", region: "Latin America", ownership: "Private", description: "Brazil; OnixSmart devices", color: "blue" },
  { name: "Scania", category: "100K-500K", units: "180,000", region: "Global", ownership: "Traton Group (VW)", description: "OEM telematics; Scania Fleet Management", color: "green" },
  { name: "Rastrac", category: "50K-100K", units: "95,000", region: "North America", ownership: "Private", description: "Fuel card integration; construction", color: "purple" },
  { name: "KORE Position Logic", category: "50K-100K", units: "90,000", region: "North America", ownership: "KORE Wireless", description: "White-label solutions; IoT connectivity", color: "teal" },
  { name: "IntelliShift", category: "50K-100K", units: "85,000", region: "North America", ownership: "Private", description: "Unified platform; video + telematics", color: "red" },
  { name: "J.J. Keller", category: "50K-100K", units: "80,000", region: "North America", ownership: "Private", description: "Compliance focus; ELD; safety", color: "slate" },
  { name: "Sitrack", category: "50K-100K", units: "75,000", region: "Latin America", ownership: "Private", description: "Argentina focus", color: "cyan" },
  { name: "Satrack", category: "50K-100K", units: "70,000", region: "Latin America", ownership: "Private", description: "Security; stolen vehicle recovery", color: "indigo" },
  { name: "MiX by Powerfleet", category: "50K-100K", units: "65,000", region: "Global", ownership: "Powerfleet (recently acquired)", description: "MiX Telematics brand; video AI", color: "orange" },
  { name: "Positioning Universal", category: "50K-100K", units: "60,000", region: "North America", ownership: "Private", description: "FT7500 gateway; video cameras", color: "blue" },
  { name: "Cobli", category: "50K-100K", units: "55,000", region: "Latin America", ownership: "Private", description: "Brazil; modern platform", color: "green" },
  { name: "Location World", category: "50K-100K", units: "50,000", region: "Latin America", ownership: "Private", description: "Misuriam platform; white-label", color: "purple" },
  { name: "Forward Thinking Systems", category: "50K-100K", units: "48,000", region: "North America", ownership: "Private", description: "FleetCam; video focus", color: "teal" },
  { name: "Platform Science", category: "50K-100K", units: "45,000", region: "North America", ownership: "Private", description: "Open platform; app marketplace; acquiring Trimble", color: "red" },
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
  const router = useRouter()
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
    // Navigate to company page with company name as slug
    const slug = companyName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
    router.push(`/companies/${slug}`)
  }

  const handleClear = () => {
    setSearchTerm("")
    setResults(null)
    setSummary(null)
    setHasSearched(false)
    setError(null)
  }

  // Filter market players based on search
  const filteredPlayers = searchTerm && !hasSearched
    ? marketPlayers.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : marketPlayers

  return (
    <div className="flex flex-col min-h-[calc(100vh-120px)] px-4 py-6">
      <div className="w-full max-w-6xl mx-auto">
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

        {/* Market Grid - Show when no search has been performed */}
        {!hasSearched && !loading && (
          <div className="mt-4">
            <h2 className="text-lg font-semibold text-gray-700 mb-4 text-center">
              Market
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredPlayers.map((company) => {
                const colors = colorClasses[company.color] || colorClasses.blue
                return (
                  <button
                    key={company.name}
                    onClick={() => handleCompanyClick(company.name)}
                    className={`p-4 bg-white border ${colors.border} rounded-lg hover:shadow-md transition-all text-left group`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 ${colors.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <span className={`font-bold text-sm ${colors.text}`}>
                          {company.name.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                            {company.name}
                          </h3>
                        </div>
                        <span className={`text-xs font-medium ${colors.text} ${colors.bg} px-2 py-0.5 rounded inline-block mt-1`}>
                          {company.category}
                        </span>
                        <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Truck className="w-3 h-3" />
                            {company.units}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {company.region}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{company.description}</p>
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
