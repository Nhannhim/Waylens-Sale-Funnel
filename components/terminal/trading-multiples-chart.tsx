"use client"

import { useState } from "react"
import { Line, LineChart, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts"
import { cn } from "@/lib/utils"

interface TradingMultiplesChartProps {
  ticker: string
}

const timeRanges = ["1M", "3M", "6M", "YTD", "1Y", "2Y", "3Y", "5Y", "10Y", "20Y", "ALL", "CUSTOM"]

const generateMultiplesData = () => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  return months.map((month, i) => ({
    month,
    pe: 25 + Math.random() * 10,
  }))
}

export function TradingMultiplesChart({ ticker }: TradingMultiplesChartProps) {
  const [selectedRange, setSelectedRange] = useState("YTD")
  const [metricType, setMetricType] = useState("P/E")
  const [periodType, setPeriodType] = useState("NTM(Next 12 Months)")
  const data = generateMultiplesData()

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-black flex items-center gap-1">
          Trading Multiples <span className="text-primary">▸</span>
        </h3>
        <div className="flex items-center gap-2">
          <select
            value={metricType}
            onChange={(e) => setMetricType(e.target.value)}
            className="text-xs bg-white border border-gray-300 rounded px-2 py-1 text-gray-900"
          >
            <option>P/E</option>
            <option>EV/EBITDA</option>
            <option>EV/Sales</option>
          </select>
          <select
            value={periodType}
            onChange={(e) => setPeriodType(e.target.value)}
            className="text-xs bg-white border border-gray-300 rounded px-2 py-1 text-gray-900"
          >
            <option>NTM(Next 12 Months)</option>
            <option>LTM</option>
          </select>
        </div>
      </div>

      {/* Time Range */}
      <div className="flex items-center gap-1 mb-4 flex-wrap">
        {timeRanges.map((range) => (
          <button
            key={range}
            onClick={() => setSelectedRange(range)}
            className={cn(
              "px-2 py-0.5 text-[10px] rounded transition-colors",
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
      <div className="h-32">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: "oklch(0.5 0 0)" }} />
            <YAxis
              domain={["auto", "auto"]}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 9, fill: "oklch(0.5 0 0)" }}
              orientation="right"
              width={30}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "oklch(0.18 0.02 250)",
                border: "1px solid oklch(0.28 0.02 250)",
                borderRadius: "6px",
                fontSize: "11px",
              }}
            />
            <Line type="monotone" dataKey="pe" stroke="oklch(0.65 0.18 220)" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
