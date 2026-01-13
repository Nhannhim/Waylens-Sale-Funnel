"use client"

import { Calendar, ExternalLink } from "lucide-react"
import { StockPriceChart } from "./stock-price-chart"
import { ValuationTable } from "./valuation-table"
import { MetricsPanel } from "./metrics-panel"
import { TradingMultiplesChart } from "./trading-multiples-chart"
import { IntradayChart } from "./intraday-chart"

interface CompanySummaryProps {
  ticker: string
}

const companyData: Record<
  string,
  {
    name: string
    sector: string
    subSector: string
    description: string
    nextEarnings: string
    website: string
  }
> = {
  AAPL: {
    name: "Apple Inc",
    sector: "Technology Hardware, Storage & Peripherals",
    subSector: "Technology Hardware, Storage & Peripherals",
    description:
      "Apple is among the largest companies in the world, with a broad portfolio of hardware and software products targeted at consumers and businesses.",
    nextEarnings: "24 Apr 2024",
    website: "www.apple.com",
  },
  MSFT: {
    name: "Microsoft Corporation",
    sector: "Software",
    subSector: "Systems Software",
    description:
      "Microsoft develops and licenses consumer and enterprise software, services, devices, and solutions worldwide.",
    nextEarnings: "25 Apr 2024",
    website: "www.microsoft.com",
  },
  GOOGL: {
    name: "Alphabet Inc",
    sector: "Interactive Media & Services",
    subSector: "Interactive Media & Services",
    description: "Alphabet is a holding company that engages in the acquisition and operation of different companies.",
    nextEarnings: "23 Apr 2024",
    website: "www.abc.xyz",
  },
}

export function CompanySummary({ ticker }: CompanySummaryProps) {
  const company = companyData[ticker] || companyData.AAPL

  return (
    <div className="space-y-4">
      {/* Summary Header */}
      <div className="bg-card rounded-lg border border-border p-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-4 h-4 bg-muted rounded flex items-center justify-center">
            <span className="text-[10px]">☐</span>
          </div>
          <h2 className="text-sm font-medium">Summary</h2>
        </div>

        <div className="flex gap-6">
          {/* Company Logo Placeholder */}
          <div className="w-16 h-16 bg-muted rounded flex items-center justify-center flex-shrink-0">
            <span className="text-2xl font-bold text-muted-foreground">{ticker[0]}</span>
          </div>

          {/* Company Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 bg-primary text-primary-foreground text-xs font-semibold rounded">
                {ticker}
              </span>
              <h1 className="text-lg font-semibold">{company.name}</h1>
            </div>

            <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-xs mb-3">
              <div>
                <span className="text-muted-foreground">Sector: </span>
                <span>{company.sector}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Sub Sector: </span>
                <span>{company.subSector}</span>
              </div>
            </div>

            <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
              <span className="text-foreground">Description: </span>
              {company.description}
            </p>

            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Calendar className="w-3 h-3" />
                <span>Next Earnings Date: </span>
                <span className="text-foreground">{company.nextEarnings}</span>
              </div>
              <a
                href={`https://${company.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-primary hover:underline"
              >
                {company.website}
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* See More */}
          <div className="flex-shrink-0">
            <button className="text-xs text-primary hover:underline">See More</button>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-12 gap-4">
        {/* Stock Price Chart - Left */}
        <div className="col-span-7">
          <StockPriceChart ticker={ticker} />
        </div>

        {/* Metrics Panel - Right */}
        <div className="col-span-5">
          <MetricsPanel ticker={ticker} />
        </div>

        {/* Trading Multiples - Bottom Left */}
        <div className="col-span-6">
          <TradingMultiplesChart ticker={ticker} />
        </div>

        {/* Valuation Table - Bottom Middle */}
        <div className="col-span-6 row-span-2">
          <ValuationTable ticker={ticker} />
        </div>

        {/* Intraday Chart - Bottom Right */}
        <div className="col-span-6">
          <IntradayChart ticker={ticker} />
        </div>
      </div>
    </div>
  )
}
