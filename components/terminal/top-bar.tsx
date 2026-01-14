"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, ChevronDown, Bell } from "lucide-react"

interface TopBarProps {
  selectedTicker: string
  onTickerChange: (ticker: string) => void
}

const popularTickers = ["IOT", "AAPL", "MSFT", "GOOGL", "AMZN", "NVDA", "META", "TSLA"]

export function TopBar({ selectedTicker, onTickerChange }: TopBarProps) {
  const [searchValue, setSearchValue] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)

  const handleSearch = () => {
    if (searchValue.trim()) {
      onTickerChange(searchValue.toUpperCase())
      setShowSuggestions(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  return (
    <header className="h-14 bg-[#2d2d2d] border-b border-[#3d3d3d] flex items-center px-6 gap-4">
      {/* Logo */}
      <div className="w-8 h-8 bg-[#2d2d2d] rounded flex items-center justify-center flex-shrink-0 overflow-hidden">
        <img 
          src="/logo.svg" 
          alt="Logo" 
          className="w-full h-full object-contain"
          onError={(e) => {
            // Fallback to icon if logo doesn't exist
            const target = e.target as HTMLImageElement
            if (!target.src.includes("icon.svg")) {
              target.src = "/icon.svg"
            } else {
              target.style.display = "none"
            }
          }}
        />
      </div>

      {/* Search Bar */}
      <div className="relative flex-1 max-w-2xl">
        <Input
          type="text"
          value={searchValue}
          onChange={(e) => {
            setSearchValue(e.target.value)
            setShowSuggestions(true)
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          placeholder="Search Keywords..."
          className="pl-4 pr-4 h-9 bg-white border-border text-sm text-foreground"
        />
        {showSuggestions && searchValue && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-md shadow-lg z-50">
            {popularTickers
              .filter((t) => t.includes(searchValue.toUpperCase()))
              .map((ticker) => (
                <button
                  key={ticker}
                  onClick={() => {
                    setSearchValue(ticker)
                    onTickerChange(ticker)
                    setShowSuggestions(false)
                  }}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 transition-colors"
                >
                  {ticker}
                </button>
              ))}
          </div>
        )}
      </div>

      {/* Ticker Dropdown */}
      <div className="flex items-center gap-2">
        <button className="flex items-center gap-1 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded text-sm text-white">
          {selectedTicker}
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      {/* Right side icons */}
      <div className="flex items-center gap-2 ml-auto">
        <button className="w-8 h-8 rounded flex items-center justify-center text-white hover:bg-white/10 transition-colors">
          <span className="text-xs font-semibold">WL</span>
        </button>
        <button className="w-8 h-8 rounded flex items-center justify-center text-white hover:bg-white/10 transition-colors">
          <Search className="w-4 h-4" />
        </button>
        <button className="w-8 h-8 rounded flex items-center justify-center text-white hover:bg-white/10 transition-colors">
          <Bell className="w-4 h-4" />
        </button>
        <Button className="h-8 px-4 bg-white text-[#2d2d2d] hover:bg-white/90">
          Live Help
        </Button>
      </div>
    </header>
  )
}
