"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

interface CompanySearchProps {
  onCompanySelect?: (company: string) => void
}

const allCompanies = [
  // TSP
  "Samsara Inc", "Geotab Inc", "Verizon Connect", "Trimble Inc", "Zonar Systems", 
  "Motive (KeepTruckin)", "Teletrac Navman", "Fleet Complete", "Omnitracs", "GPS Insight",
  // Resellers
  "AT&T Business", "Verizon Business", "Element Fleet Management", "Enterprise Fleet Management", 
  "Holman", "Mike Albert Fleet Solutions", "Wheels Inc", "ARI Fleet",
  // Insurtech
  "Lemonade Inc", "Root Insurance", "Cambridge Mobile Telematics", "Metromile", 
  "Arity", "Zendrive", "Octo Telematics", "TrueMotion",
]

export function CompanySearch({ onCompanySelect }: CompanySearchProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [isFocused, setIsFocused] = useState(false)

  const filteredCompanies = searchTerm
    ? allCompanies.filter(company => 
        company.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : []

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
      <div className="w-full max-w-2xl">
        {/* Search Container */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-semibold text-gray-900 mb-3">Company Directory</h1>
          <p className="text-gray-600">Search for companies in the telematics ecosystem</p>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <div className={`relative flex items-center transition-all ${
            isFocused ? 'shadow-lg' : 'shadow-md'
          }`}>
            <Search className="absolute left-5 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search companies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 200)}
              className="pl-14 pr-6 h-16 text-lg border-2 border-gray-200 rounded-full focus:border-blue-500 transition-all"
            />
          </div>

          {/* Search Results Dropdown */}
          {searchTerm && filteredCompanies.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border-2 border-gray-200 shadow-xl max-h-96 overflow-y-auto z-50">
              {filteredCompanies.map((company, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSearchTerm(company)
                    onCompanySelect?.(company)
                  }}
                  className="w-full px-6 py-4 text-left hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-700 font-bold text-sm">{company[0]}</span>
                    </div>
                    <span className="text-base text-gray-900 font-medium">{company}</span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* No Results */}
          {searchTerm && filteredCompanies.length === 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border-2 border-gray-200 shadow-xl p-8 text-center">
              <p className="text-gray-600">No companies found matching "{searchTerm}"</p>
            </div>
          )}
        </div>

        {/* Info Text */}
        <div className="mt-8 text-center text-sm text-gray-500">
          {allCompanies.length} companies available across TSP, Reseller, and Insurtech categories
        </div>
      </div>
    </div>
  )
}
