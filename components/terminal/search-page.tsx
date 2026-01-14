"use client"

import { useState } from "react"
import { Search, Filter, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface SearchPageProps {
  ticker?: string
}

export function SearchPage({ ticker }: SearchPageProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])

  const categories = [
    { id: "tsp", label: "TSP" },
    { id: "reseller", label: "Reseller" },
    { id: "insurtech", label: "Insurtech" },
  ]

  const toggleFilter = (filterId: string) => {
    setSelectedFilters(prev => 
      prev.includes(filterId) 
        ? prev.filter(f => f !== filterId)
        : [...prev, filterId]
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-120px)] px-4">
      <div className="w-full max-w-3xl">
        {/* Search Bar */}
        <div className="relative mb-6">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-5 pr-14 h-14 text-base border border-gray-300 rounded-full shadow-sm focus:shadow-md focus:border-gray-400 transition-all"
            />
            
            {/* Filter Icon Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`absolute right-2 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                selectedFilters.length > 0
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'hover:bg-gray-100 text-gray-500'
              }`}
            >
              <Filter className="w-5 h-5" />
              {selectedFilters.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-blue-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center border-2 border-white">
                  {selectedFilters.length}
                </span>
              )}
            </button>
          </div>

          {/* Filter Popup */}
          {showFilters && (
            <div className="absolute top-full right-0 mt-2 w-72 bg-white rounded-lg border border-gray-200 shadow-lg z-50">
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-700">Filters</span>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="w-6 h-6 rounded-full hover:bg-gray-100 flex items-center justify-center"
                  >
                    <X className="w-4 h-4 text-gray-500" />
                  </button>
                </div>

                <div className="space-y-1">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => toggleFilter(category.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md transition-all ${
                        selectedFilters.includes(category.id)
                          ? 'bg-blue-50'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                        selectedFilters.includes(category.id)
                          ? 'border-blue-600 bg-blue-600'
                          : 'border-gray-300'
                      }`}>
                        {selectedFilters.includes(category.id) && (
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <span className={`text-sm ${
                        selectedFilters.includes(category.id) ? 'text-gray-900 font-medium' : 'text-gray-700'
                      }`}>
                        {category.label}
                      </span>
                    </button>
                  ))}
                </div>

                {selectedFilters.length > 0 && (
                  <button
                    onClick={() => setSelectedFilters([])}
                    className="w-full mt-3 pt-3 border-t border-gray-200 text-sm text-gray-600 hover:text-gray-900"
                  >
                    Clear all
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Active Filters */}
        {selectedFilters.length > 0 && (
          <div className="mb-4 flex items-center gap-2 flex-wrap">
            {selectedFilters.map((filterId) => {
              const category = categories.find(c => c.id === filterId)
              return (
                <span
                  key={filterId}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm flex items-center gap-2"
                >
                  {category?.label}
                  <button onClick={() => toggleFilter(filterId)} className="hover:text-gray-900">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
