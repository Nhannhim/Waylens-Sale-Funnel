"use client"

interface MetricsPanelProps {
  ticker: string
}

const ltmMetrics = [
  { label: "P/E", value: "28.6x" },
  { label: "EV/EBITDA", value: "22.1x" },
  { label: "EV/Sales", value: "7.5x" },
  { label: "Dividend Yield", value: "0.5%" },
  { label: "FCF Yield", value: "3.7%" },
]

const changeMetrics = [
  { label: "S&P 500 Index", value: "+0.09%", positive: true },
  { label: "AAPL.US", value: "+0.36%", positive: true },
]

export function MetricsPanel({ ticker }: MetricsPanelProps) {
  return (
    <div className="space-y-4">
      {/* LTM Metrics */}
      <div className="bg-card rounded-lg border border-border p-4">
        <div className="flex gap-8">
          <div className="flex-1">
            <h3 className="text-xs font-semibold text-muted-foreground mb-3">LTM</h3>
            <div className="space-y-2">
              {ltmMetrics.map((metric) => (
                <div key={metric.label} className="flex justify-between text-xs">
                  <span className="text-muted-foreground">{metric.label}</span>
                  <span className="font-medium">{metric.value}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-xs font-semibold text-muted-foreground mb-3">Change</h3>
            <div className="space-y-2">
              {changeMetrics.map((metric) => (
                <div key={metric.label} className="flex justify-between text-xs">
                  <span className="text-muted-foreground">{metric.label}</span>
                  <span className={metric.positive ? "text-chart-2" : "text-destructive"}>{metric.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
