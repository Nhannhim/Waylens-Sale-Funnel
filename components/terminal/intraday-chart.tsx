"use client"

import { useState } from "react"
import { Line, LineChart, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts"
import { cn } from "@/lib/utils"

interface IntradayChartProps {
  ticker: string
}

const timeRanges = ["1D", "2D", "5D", "10D", "20D", "30D", "CUSTOM"]

const generateIntradayData = () => {
  const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`)
  return hours.map((hour) => ({
    hour,
    price: 180 + Math.random() * 5,
  }))
}

export function IntradayChart({ ticker }: IntradayChartProps) {
  const [selectedRange, setSelectedRange] = useState("1D")
  const data = generateIntradayData()

  return (
    <div className="bg-card rounded-lg border border-border p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold flex items-center gap-1">
          Intraday Chart <span className="text-primary">▸</span>
        </h3>
      </div>

      {/* Time Range */}
      <div className="flex items-center gap-1 mb-4">
        {timeRanges.map((range) => (
          <button
            key={range}
            onClick={() => setSelectedRange(range)}
            className={cn(
              "px-2 py-0.5 text-[10px] rounded transition-colors",
              selectedRange === range
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            {range}
          </button>
        ))}
      </div>

      {/* Price Label */}
      <div className="flex justify-end mb-2">
        <span className="text-xs text-muted-foreground">210</span>
      </div>

      {/* Chart */}
      <div className="h-24">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
            <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={false} />
            <YAxis hide domain={["auto", "auto"]} />
            <Tooltip
              contentStyle={{
                backgroundColor: "oklch(0.18 0.02 250)",
                border: "1px solid oklch(0.28 0.02 250)",
                borderRadius: "6px",
                fontSize: "11px",
              }}
            />
            <Line type="monotone" dataKey="price" stroke="oklch(0.65 0.18 220)" strokeWidth={1.5} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="text-right text-xs text-muted-foreground mt-1">182</div>
    </div>
  )
}
