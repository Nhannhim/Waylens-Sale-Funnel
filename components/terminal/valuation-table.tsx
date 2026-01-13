"use client"

interface ValuationTableProps {
  ticker: string
}

const valuationData = [
  { metric: "P/E", y2022: "21.3", y2023: "33.6", y2024: "28.9", y2025e: "-", y2026e: "-" },
  { metric: "EV/EBITDA", y2022: "16.1", y2023: "28.8", y2024: "22.6", y2025e: "-", y2026e: "-" },
  { metric: "EV/Sales", y2022: "5.4", y2023: "8.5", y2024: "7.6", y2025e: "-", y2026e: "-" },
  { metric: "P/BV", y2022: "40.6", y2023: "13.1", y2024: "46.4", y2025e: "-", y2026e: "-" },
  { metric: "FCF Yield (%)", y2022: "0.1%", y2023: "2.6%", y2024: "3.7%", y2025e: "-", y2026e: "-" },
  { metric: "Dividend Yield", y2022: "0%", y2023: "0.5%", y2024: "0.5%", y2025e: "-", y2026e: "-" },
  { metric: "Stock Price", y2022: "129.9", y2023: "192.5", y2024: "182.2", y2025e: "-", y2026e: "-" },
  { metric: "Market Cap", y2022: "-", y2023: "-", y2024: "-", y2025e: "-", y2026e: "-" },
  {
    metric: "Enterprise Value",
    y2022: "21387067...",
    y2023: "30439043...",
    y2024: "26740842...",
    y2025e: "-",
    y2026e: "-",
  },
  { metric: "Total Revenue", y2022: "117154OO...", y2023: "11957500...", y2024: "-", y2025e: "-", y2026e: "-" },
  { metric: "EBITDA", y2022: "38932000...", y2023: "43221000...", y2024: "-", y2025e: "-", y2026e: "-" },
  { metric: "EPS-Diluted", y2022: "1.9", y2023: "2.2", y2024: "-", y2025e: "-", y2026e: "-" },
]

export function ValuationTable({ ticker }: ValuationTableProps) {
  return (
    <div className="bg-card rounded-lg border border-border p-4 h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold">Valuation & Model</h3>
        <button className="text-xs text-primary hover:underline">▸</button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2 pr-4 text-muted-foreground font-medium">Metric</th>
              <th className="text-right py-2 px-2 text-muted-foreground font-medium">2022</th>
              <th className="text-right py-2 px-2 text-muted-foreground font-medium">2023</th>
              <th className="text-right py-2 px-2 text-muted-foreground font-medium">2024</th>
              <th className="text-right py-2 px-2 text-primary font-medium">2025 (E)</th>
              <th className="text-right py-2 pl-2 text-primary font-medium">2026 (E)</th>
            </tr>
          </thead>
          <tbody>
            {valuationData.map((row, i) => (
              <tr key={i} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                <td className="py-1.5 pr-4 text-muted-foreground truncate max-w-[100px]">{row.metric}</td>
                <td className="py-1.5 px-2 text-right">{row.y2022}</td>
                <td className="py-1.5 px-2 text-right">{row.y2023}</td>
                <td className="py-1.5 px-2 text-right">{row.y2024}</td>
                <td className="py-1.5 px-2 text-right text-muted-foreground">{row.y2025e}</td>
                <td className="py-1.5 pl-2 text-right text-muted-foreground">{row.y2026e}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
