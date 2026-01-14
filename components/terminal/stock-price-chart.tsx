"use client"

import { useState } from "react"
import { Area, AreaChart, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts"
import { cn } from "@/lib/utils"

interface StockPriceChartProps {
  ticker: string
}

const timeRanges = ["1M", "3M", "6M", "YTD", "1Y", "2Y", "3Y", "5Y", "10Y", "20Y", "ALL", "CUSTOM"]

// Generate realistic stock data
const generateStockData = (ticker: string) => {
  const basePrice = ticker === "AAPL" ? 145 : ticker === "MSFT" ? 350 : ticker === "IOT" ? 42 : 140
  const months = [
    "Apr '23",
    "May '23",
    "Jun '23",
    "Jul '23",
    "Aug '23",
    "Sep '23",
    "Oct '23",
    "Nov '23",
    "Dec '23",
    "Jan '24",
    "Feb '24",
  ]

  return months.map((month, i) => {
    const trend = i * 3
    const volatility = Math.random() * 15 - 7.5
    const price = basePrice + trend + volatility
    const volume = Math.floor(Math.random() * 50 + 80)

    return {
      month,
      price: Math.round(price * 100) / 100,
      high: Math.round((price + Math.random() * 10) * 100) / 100,
      low: Math.round((price - Math.random() * 10) * 100) / 100,
      volume,
    }
  })
}

export function StockPriceChart({ ticker }: StockPriceChartProps) {
  const [selectedRange, setSelectedRange] = useState("1Y")
  const data = generateStockData(ticker)

  const latestPrice = data[data.length - 1]?.price || 0
  const priceRange = `${Math.min(...data.map((d) => d.low)).toFixed(2)} - ${Math.max(...data.map((d) => d.high)).toFixed(2)}`

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 h-full">
      {/* Price Info */}
      <div className="flex items-baseline gap-4 mb-4">
        <span className="text-2xl font-semibold text-gray-900">{latestPrice.toFixed(2)}</span>
        <span className="text-xs text-gray-700">{priceRange}</span>
      </div>

      {/* Time Range Selector */}
      <div className="flex items-center gap-1 mb-4 flex-wrap">
        {timeRanges.map((range) => (
          <button
            key={range}
            onClick={() => setSelectedRange(range)}
            className={cn(
              "px-2 py-1 text-xs rounded transition-colors",
              selectedRange === range
                ? "bg-primary text-primary-foreground"
                : "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
            )}
          >
            {range}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
            <defs>
              <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="oklch(0.65 0.18 220)" stopOpacity={0.4} />
                <stop offset="100%" stopColor="oklch(0.65 0.18 220)" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: "oklch(0.5 0 0)" }}
              interval="preserveStartEnd"
            />
            <YAxis
              domain={["auto", "auto"]}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: "oklch(0.5 0 0)" }}
              orientation="right"
              width={40}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "oklch(0.18 0.02 250)",
                border: "1px solid oklch(0.28 0.02 250)",
                borderRadius: "6px",
                fontSize: "12px",
              }}
              labelStyle={{ color: "oklch(0.95 0 0)" }}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke="oklch(0.65 0.18 220)"
              strokeWidth={2}
              fill="url(#priceGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Volume Bar */}
      <div className="flex items-end gap-0.5 h-12 mt-2">
        {data.map((d, i) => (
          <div key={i} className="flex-1 bg-primary/30 rounded-t" style={{ height: `${d.volume}%` }} />
        ))}
      </div>

      {/* Add Series Button */}
      <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-200">
        <button className="text-xs text-gray-700 hover:text-gray-900 flex items-center gap-1">
          Add Series <span className="text-primary">▾</span>
        </button>
        <button className="text-xs text-gray-700 hover:text-gray-900 flex items-center gap-1">
          Area <span className="text-primary">▾</span>
        </button>
      </div>
    </div>
  )
}
