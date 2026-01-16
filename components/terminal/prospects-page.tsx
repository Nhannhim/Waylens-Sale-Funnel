"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search, Building2, TrendingUp, Filter, Users, Truck, ChevronLeft, ChevronRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface ProspectsPageProps {
  ticker?: string
}

interface ProspectCompany {
  name: string;
  category: string;
  contacts?: string;
  region?: string;
  verticals?: string;
  competitors?: string;
  priority?: string;
  notes?: string;
}

export function ProspectsPage({ ticker }: ProspectsPageProps) {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [activeCategory, setActiveCategory] = useState("All")
  const [currentPage, setCurrentPage] = useState(1)
  const [prospectsData, setProspectsData] = useState<{ [key: string]: ProspectCompany[] }>({})
  const [loading, setLoading] = useState(true)
  
  const companiesPerPage = 28 // 4 columns x 7 rows

  useEffect(() => {
    fetch('/data/prospects-data.json')
      .then(res => res.json())
      .then(data => {
        setProspectsData(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Error loading prospects:', err)
        setLoading(false)
      })
  }, [])

  const categories = ["All", ...Object.keys(prospectsData)]
  
  // Flatten and filter companies
  const allCompanies = activeCategory === "All"
    ? Object.values(prospectsData).flat()
    : prospectsData[activeCategory] || []

  const filteredCompanies = allCompanies.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (company.verticals && company.verticals.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (company.region && company.region.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  // Pagination
  const totalPages = Math.ceil(filteredCompanies.length / companiesPerPage)
  const startIdx = (currentPage - 1) * companiesPerPage
  const endIdx = startIdx + companiesPerPage
  const currentCompanies = filteredCompanies.slice(startIdx, endIdx)

  // Reset to page 1 when filtering changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, activeCategory])

  const handleCompanyClick = (companyName: string) => {
    const slug = companyName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    router.push(`/companies/${slug}`)
  }

  const getCompanyInitials = (name: string) => {
    return name
      .split(' ')
      .filter(word => word.length > 0)
      .slice(0, 2)
      .map(word => word[0])
      .join('')
      .toUpperCase()
  }

  const getCategoryColor = (category: string) => {
    if (category.includes('Insurance')) return 'from-blue-600 to-blue-700'
    if (category.includes('Geotab')) return 'from-orange-600 to-orange-700'
    if (category.includes('TSP') || category.includes('Reseller')) return 'from-purple-600 to-purple-700'
    if (category.includes('Insurtech') || category.includes('Technology')) return 'from-green-600 to-green-700'
    return 'from-gray-600 to-gray-700'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading prospects...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-semibold text-black">Target Prospects & Partners</h2>
        </div>
        
        <p className="text-sm text-gray-700 leading-relaxed mb-4">
          Comprehensive database of 477+ prospect companies for Waylens' telematics platform. 
          Includes insurance partners, technology resellers, Geotab partners, and insurtech companies across multiple regions.
          Data sourced from internal CRM and partnership databases.
        </p>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search by company name, vertical, or region..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 flex-wrap">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                activeCategory === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat}
              <span className="ml-2 text-xs opacity-75">
                ({cat === "All" ? Object.values(prospectsData).flat().length : (prospectsData[cat]?.length || 0)})
              </span>
            </button>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3 mt-4">
          <div className="bg-blue-50 border border-blue-200 rounded p-3 text-center">
            <div className="text-2xl font-bold text-blue-900">{filteredCompanies.length}</div>
            <div className="text-xs text-gray-600">Total Prospects</div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded p-3 text-center">
            <div className="text-2xl font-bold text-green-900">{Object.keys(prospectsData).length}</div>
            <div className="text-xs text-gray-600">Categories</div>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded p-3 text-center">
            <div className="text-2xl font-bold text-purple-900">{currentPage}/{totalPages}</div>
            <div className="text-xs text-gray-600">Current Page</div>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded p-3 text-center">
            <div className="text-2xl font-bold text-orange-900">{companiesPerPage}</div>
            <div className="text-xs text-gray-600">Per Page</div>
          </div>
        </div>
      </div>

      {/* Company Grid */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Showing {startIdx + 1}-{Math.min(endIdx, filteredCompanies.length)} of {filteredCompanies.length} companies
          </h3>
          
          {/* Pagination Controls */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="h-8"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            <div className="flex gap-1">
              {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 7) {
                  pageNum = i + 1;
                } else if (currentPage <= 4) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 3) {
                  pageNum = totalPages - 6 + i;
                } else {
                  pageNum = currentPage - 3 + i;
                }
                
                return (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-8 h-8 rounded text-sm font-semibold transition-colors ${
                      currentPage === pageNum
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="h-8"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {currentCompanies.map((company, idx) => (
            <button
              key={`${company.name}-${idx}`}
              onClick={() => handleCompanyClick(company.name)}
              className="p-4 bg-white border-2 border-gray-200 rounded-lg hover:border-blue-400 hover:shadow-lg transition-all text-left group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`w-12 h-12 bg-gradient-to-br ${getCategoryColor(company.category)} rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-md`}>
                  {getCompanyInitials(company.name)}
                </div>
                <Badge className={`text-xs ${
                  company.priority === 'High' || company.priority?.includes('High')
                    ? 'bg-green-100 text-green-800 border-green-300' 
                    : 'bg-blue-100 text-blue-800 border-blue-300'
                }`}>
                  {company.category.split(' ')[0]}
                </Badge>
              </div>

              <h3 className="text-sm font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors leading-tight line-clamp-2">
                {company.name}
              </h3>

              <div className="space-y-1.5 text-xs">
                {company.verticals && (
                  <div className="flex items-center gap-1.5 text-gray-700">
                    <Building2 className="w-3 h-3 text-blue-600 flex-shrink-0" />
                    <span className="truncate">{company.verticals}</span>
                  </div>
                )}

                {company.region && (
                  <div className="flex items-center gap-1.5 text-gray-700">
                    <TrendingUp className="w-3 h-3 text-green-600 flex-shrink-0" />
                    <span>{company.region}</span>
                  </div>
                )}

                {company.competitors && (
                  <div className="flex items-center gap-1.5 text-gray-600">
                    <Truck className="w-3 h-3 text-orange-600 flex-shrink-0" />
                    <span className="truncate text-[10px]">vs {company.competitors.slice(0, 30)}...</span>
                  </div>
                )}
              </div>

              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="text-xs text-blue-600 font-semibold group-hover:text-blue-700">
                  View Profile →
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Bottom Pagination */}
        <div className="flex items-center justify-center gap-2 mt-6">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </Button>
          
          <span className="text-sm text-gray-700 px-4">
            Page {currentPage} of {totalPages}
          </span>
          
          <Button
            variant="outline"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>

      {filteredCompanies.length === 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No prospects found</h3>
          <p className="text-sm text-gray-600">Try adjusting your search or selecting a different category</p>
        </div>
      )}

      {/* Data Source Reference */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-300 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Filter className="w-4 h-4 text-gray-700" />
          <h4 className="text-sm font-bold text-gray-900">Data Sources</h4>
        </div>
        <p className="text-xs text-gray-700 leading-relaxed">
          Prospect database compiled from: <strong>Waylens CRM & Partnership Database</strong> (Prospects/Customers.csv, Geotab_Reseller_Prospects.csv, Ins_&_Tech_Prospects.csv, Other_Reseller_Prospects_.csv). 
          Total of <strong>477 companies</strong> across 4 categories: Insurance Companies & MGAs (7), Geotab Resellers (22), TSPs & Other Resellers (279), Insurtech & Technology Partners (169). 
          Last updated: January 2026.
        </p>
      </div>
    </div>
  )
}
