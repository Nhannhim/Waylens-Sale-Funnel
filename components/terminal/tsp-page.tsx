"use client"

import { Building2, TrendingUp, Truck, MapPin, Search } from "lucide-react"
import { useRouter } from "next/navigation"
import { useCompanyData } from "@/lib/use-company-data"
import { useState, useEffect } from "react"
import { CompanyData } from "@/lib/data-processor"

interface TSPPageProps {
  ticker?: string
}

const colorClasses: Record<string, { bg: string; text: string; border: string }> = {
  blue: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  green: { bg: "bg-green-50", text: "text-green-700", border: "border-green-200" },
  purple: { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
  orange: { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200" },
  red: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200" },
  teal: { bg: "bg-teal-50", text: "text-teal-700", border: "border-teal-200" },
  indigo: { bg: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-200" },
  pink: { bg: "bg-pink-50", text: "text-pink-700", border: "border-pink-200" },
  cyan: { bg: "bg-cyan-50", text: "text-cyan-700", border: "border-cyan-200" },
  slate: { bg: "bg-slate-50", text: "text-slate-700", border: "border-slate-200" },
}

export function TSPPage({ ticker }: TSPPageProps) {
  const router = useRouter()
  const { dataset, loading } = useCompanyData()
  const [tspCompanies, setTspCompanies] = useState<CompanyData[]>([])

  useEffect(() => {
    if (dataset) {
      // Filter for TSP companies (direct telematics vendors with fleet size > 10K)
      const filtered = dataset.companies.filter(c => {
        const hasTelematicsData = c.metrics.fleetSize && c.metrics.fleetSize > 10000
        const isTSP = !c.name.toLowerCase().includes('insurance') && 
                      !c.name.toLowerCase().includes('insurtech')
        return hasTelematicsData && isTSP
      })
      setTspCompanies(filtered)
    }
  }, [dataset])

  const handleCompanyClick = (companyId: string) => {
    router.push(`/companies/${companyId}`)
  }

  const getCompanyColor = (index: number): string => {
    const colors = ['blue', 'green', 'purple', 'orange', 'red', 'teal', 'indigo', 'pink', 'cyan', 'slate']
    return colors[index % colors.length]
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-700 font-medium">Loading TSP companies...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Building2 className="w-7 h-7 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Telematics Service Providers (TSP)</h2>
        </div>
        
        <p className="text-sm text-gray-800 leading-relaxed mb-4">
          Direct telematics vendors providing fleet management, GPS tracking, and connected vehicle solutions. 
          These companies offer hardware, software platforms, and cloud services directly to fleet operators, 
          enterprise customers, and commercial vehicle owners.
        </p>

        {/* Key Stats */}
        <div className="grid grid-cols-4 gap-4 mt-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <div className="text-xs font-bold text-gray-900 mb-1">Total Companies</div>
            <div className="text-3xl font-bold text-blue-900">{tspCompanies.length}</div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <div className="text-xs font-bold text-gray-900 mb-1">Combined Fleet</div>
            <div className="text-3xl font-bold text-green-900">
              {(tspCompanies.reduce((sum, c) => sum + (c.metrics.fleetSize || 0), 0) / 1_000_000).toFixed(1)}M+
            </div>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
            <div className="text-xs font-bold text-gray-900 mb-1">Combined Revenue</div>
            <div className="text-3xl font-bold text-purple-900">
              ${(tspCompanies.reduce((sum, c) => sum + (c.metrics.revenue || 0), 0) / 1_000_000_000).toFixed(1)}B+
            </div>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
            <div className="text-xs font-bold text-gray-900 mb-1">Markets</div>
            <div className="text-3xl font-bold text-orange-900">Global</div>
          </div>
        </div>
      </div>

      {/* TSP Companies Grid */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          Telematics Service Providers ({tspCompanies.length} Companies)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {tspCompanies.map((company, index) => {
            const colorKey = getCompanyColor(index)
            const colors = colorClasses[colorKey] || colorClasses.blue
            return (
              <button
                key={company.id}
                onClick={() => handleCompanyClick(company.id)}
                className={`p-4 bg-white border ${colors.border} rounded-lg hover:shadow-lg transition-all text-left group`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-12 h-12 ${colors.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <span className={`font-bold text-lg ${colors.text}`}>
                      {company.name.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                      {company.name}
                    </h4>
                    <div className="space-y-1">
                      {company.metrics.fleetSize && (
                        <div className="flex items-center gap-2 text-xs">
                          <Truck className="w-3 h-3 text-gray-600" />
                          <span className="font-semibold text-gray-900">
                            {(company.metrics.fleetSize / 1000).toFixed(0)}K
                          </span>
                          <span className="text-gray-700">units</span>
                        </div>
                      )}
                      {company.geography.headquarters && (
                        <div className="flex items-center gap-2 text-xs">
                          <MapPin className="w-3 h-3 text-gray-600" />
                          <span className="text-gray-700 truncate">{company.geography.headquarters.split(',')[0]}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
