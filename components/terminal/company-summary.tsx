"use client"

import { Calendar, ExternalLink, Newspaper, FileText, TrendingUp } from "lucide-react"

interface CompanySummaryProps {
  ticker: string
  companyType?: string
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
  IOT: {
    name: "Samsara Inc",
    sector: "Software",
    subSector: "Application Software",
    description: "Samsara is a leading provider of IoT solutions for operations, offering a connected operations cloud that enables organizations to harness IoT data to develop actionable insights and improve their operations.",
    nextEarnings: "05 Jun 2024",
    website: "www.samsara.com",
  },
}

const documentsData: Record<string, {
  companyDocs: Array<{ type: string; title: string; date: string }>;
  brokerageResearch: Array<{ firm: string; title: string; date: string }>;
}> = {
  IOT: {
    companyDocs: [
      { type: "10-Q", title: "Samsara Inc - Quarterly Report (Q3 2025)", date: "12 Jan 26" },
      { type: "8-K", title: "Current Report - Strategic Partnership Announcement", date: "10 Jan 26" },
      { type: "Press Release", title: "Samsara Announces Expansion of AI-Powered Features", date: "08 Jan 26" },
      { type: "Investor Presentation", title: "Q3 2025 Investor Presentation", date: "05 Jan 26" },
      { type: "10-K", title: "Samsara Inc - Annual Report (FY 2025)", date: "03 Jan 26" },
      { type: "Proxy Statement", title: "2026 Annual Meeting Proxy Statement", date: "28 Dec 25" },
    ],
    brokerageResearch: [
      { firm: "Morgan Stanley", title: "Samsara: Initiating Coverage with Overweight Rating - IoT Leader", date: "12 Jan 26" },
      { firm: "Goldman Sachs", title: "Upgrade to Buy - Connected Operations Platform Gaining Traction", date: "11 Jan 26" },
      { firm: "JP Morgan", title: "Price Target Raised to $50 - Fleet Management TAM Expanding", date: "10 Jan 26" },
      { firm: "Bank of America", title: "Maintaining Buy - Strong Customer Retention and ARR Growth", date: "09 Jan 26" },
      { firm: "Needham & Co", title: "Buy Rating - Software Platform Model Driving Efficiency", date: "08 Jan 26" },
      { firm: "RBC Capital", title: "Outperform - IoT Market Share Gains Accelerating", date: "07 Jan 26" },
    ],
  },
  AAPL: {
    companyDocs: [
      { type: "10-K", title: "Apple Inc - Annual Report (FY 2025)", date: "11 Jan 26" },
      { type: "8-K", title: "Current Report - Product Launch Announcement", date: "09 Jan 26" },
      { type: "Press Release", title: "Apple Announces Record Services Revenue", date: "08 Jan 26" },
      { type: "Proxy Statement", title: "2026 Annual Meeting Proxy Statement", date: "05 Jan 26" },
    ],
    brokerageResearch: [
      { firm: "Morgan Stanley", title: "Apple: Maintain Overweight - iPhone 16 Cycle Exceeding Expectations", date: "12 Jan 26" },
      { firm: "Wedbush Securities", title: "Services Revenue Growth Accelerating - Raising PT to $230", date: "11 Jan 26" },
      { firm: "JP Morgan", title: "Vision Pro Demand Strong - AI Features Driving Premium Mix", date: "10 Jan 26" },
      { firm: "Goldman Sachs", title: "Buy Rating Maintained - Wearables and Services Key Drivers", date: "09 Jan 26" },
      { firm: "Evercore ISI", title: "Outperform - India Manufacturing Expansion Strategic", date: "08 Jan 26" },
      { firm: "Piper Sandler", title: "Overweight - App Store Revenue Acceleration Noted", date: "07 Jan 26" },
    ],
  },
  MSFT: {
    companyDocs: [
      { type: "10-Q", title: "Microsoft Corporation - Quarterly Report (Q2 2026)", date: "12 Jan 26" },
      { type: "8-K", title: "Current Report - OpenAI Partnership Expansion", date: "10 Jan 26" },
      { type: "Press Release", title: "Microsoft Azure AI Services See Record Growth", date: "08 Jan 26" },
      { type: "Investor Presentation", title: "Q2 2026 Earnings Presentation", date: "06 Jan 26" },
    ],
    newsRegulatory: [
      { source: "Reuters", title: "Microsoft and OpenAI Announce New Partnership Terms", date: "12 Jan 26" },
      { source: "Bloomberg", title: "Azure Cloud Services Gain Market Share in Q4", date: "11 Jan 26" },
      { source: "TechCrunch", title: "Microsoft 365 Copilot Reaches 10 Million Users", date: "10 Jan 26" },
      { source: "SEC Filing", title: "Form 4 - Executive Stock Transaction", date: "09 Jan 26" },
    ],
  },
  GOOGL: {
    companyDocs: [
      { type: "10-Q", title: "Alphabet Inc - Quarterly Report (Q4 2025)", date: "11 Jan 26" },
      { type: "8-K", title: "Current Report - Gemini 2.0 Launch Announcement", date: "09 Jan 26" },
      { type: "Press Release", title: "Google Cloud Platform Expands Data Center Network", date: "08 Jan 26" },
      { type: "Investor Presentation", title: "Q4 2025 Earnings Call Presentation", date: "06 Jan 26" },
    ],
    brokerageResearch: [
      { firm: "Morgan Stanley", title: "Alphabet: Overweight - Gemini 2.0 Driving AI Leadership", date: "12 Jan 26" },
      { firm: "JP Morgan", title: "YouTube and Cloud Revenue Diversification Strong - PT $165", date: "11 Jan 26" },
      { firm: "Wedbush Securities", title: "Search Monetization Improving with AI Integration", date: "10 Jan 26" },
      { firm: "Goldman Sachs", title: "Cloud Momentum and Bard Adoption Positive - Buy", date: "09 Jan 26" },
      { firm: "Deutsche Bank", title: "Buy Rating - GCP Market Share Gains Continue", date: "08 Jan 26" },
      { firm: "Barclays", title: "Overweight - Advertising Recovery Accelerating", date: "07 Jan 26" },
    ],
  },
}

const newsData: Record<string, Array<{ title: string; source: string; date: string; time: string }>> = {
  IOT: [
    { title: "Samsara Expands AI-Powered Fleet Management Solutions", source: "TechCrunch", date: "Jan 12, 2026", time: "2h ago" },
    { title: "Samsara Reports Strong Q4 Earnings, Beats Expectations", source: "Reuters", date: "Jan 11, 2026", time: "5h ago" },
    { title: "New Partnership with Major Logistics Companies Announced", source: "Bloomberg", date: "Jan 10, 2026", time: "1d ago" },
    { title: "Samsara's IoT Platform Reaches 1 Million Connected Assets", source: "The Wall Street Journal", date: "Jan 9, 2026", time: "2d ago" },
  ],
  AAPL: [
    { title: "Apple Unveils New iPhone 16 with Advanced AI Features", source: "The Verge", date: "Jan 12, 2026", time: "1h ago" },
    { title: "Apple Services Revenue Hits All-Time High", source: "CNBC", date: "Jan 11, 2026", time: "4h ago" },
    { title: "Apple Vision Pro 2 Expected to Launch in Spring", source: "MacRumors", date: "Jan 10, 2026", time: "1d ago" },
    { title: "Apple Expands Manufacturing Operations in India", source: "Reuters", date: "Jan 9, 2026", time: "2d ago" },
  ],
  MSFT: [
    { title: "Microsoft Azure AI Services See 50% Growth", source: "TechCrunch", date: "Jan 12, 2026", time: "3h ago" },
    { title: "Microsoft and OpenAI Announce New Partnership Expansion", source: "The Verge", date: "Jan 11, 2026", time: "6h ago" },
    { title: "Microsoft 365 Copilot Reaches 10 Million Users", source: "Bloomberg", date: "Jan 10, 2026", time: "1d ago" },
    { title: "Microsoft Gaming Division Reports Record Revenue", source: "IGN", date: "Jan 9, 2026", time: "2d ago" },
  ],
  GOOGL: [
    { title: "Google Bard AI Gets Major Upgrade with Gemini 2.0", source: "TechCrunch", date: "Jan 12, 2026", time: "2h ago" },
    { title: "Google Cloud Platform Expands Data Center Network", source: "ZDNet", date: "Jan 11, 2026", time: "5h ago" },
    { title: "YouTube Announces New Creator Revenue Sharing Model", source: "The Verge", date: "Jan 10, 2026", time: "1d ago" },
    { title: "Google Search Introduces Enhanced AI-Powered Results", source: "Search Engine Land", date: "Jan 9, 2026", time: "2d ago" },
  ],
}

export function CompanySummary({ ticker, companyType = "summary" }: CompanySummaryProps) {
  const company = companyData[ticker] || companyData.IOT
  const news = newsData[ticker] || newsData.IOT
  const documents = documentsData[ticker] || documentsData.IOT

  return (
    <div className="space-y-4">
      {/* Summary Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-4 h-4 bg-gray-100 rounded flex items-center justify-center">
            <span className="text-[10px] text-gray-800">☐</span>
          </div>
          <h2 className="text-sm font-medium text-black">Summary</h2>
        </div>

        <div className="flex gap-6">
          {/* Company Logo Placeholder */}
          <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
            <span className="text-2xl font-bold text-gray-800">{ticker[0]}</span>
          </div>

          {/* Company Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 bg-primary text-primary-foreground text-xs font-semibold rounded">
                {ticker}
              </span>
              <h1 className="text-lg font-semibold text-black">{company.name}</h1>
            </div>

            <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-xs mb-3">
              <div>
                <span className="text-gray-700">Sector: </span>
                <span className="text-gray-900 font-medium">{company.sector}</span>
              </div>
              <div>
                <span className="text-gray-700">Sub Sector: </span>
                <span className="text-gray-900 font-medium">{company.subSector}</span>
              </div>
            </div>

            <p className="text-xs text-gray-700 mb-3 line-clamp-2">
              <span className="text-gray-900 font-medium">Description: </span>
              {company.description}
            </p>

            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1 text-gray-700">
                <Calendar className="w-3 h-3" />
                <span>Next Earnings Date: </span>
                <span className="text-gray-900 font-medium">{company.nextEarnings}</span>
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

      {/* News Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Newspaper className="w-4 h-4 text-gray-700" />
            <h2 className="text-sm font-medium text-black">Latest News</h2>
          </div>
          <button className="text-xs text-primary hover:underline font-medium">
            View All News →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
          {news.map((item, idx) => (
            <div key={idx} className="border-b border-gray-100 pb-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-900 mb-1 hover:text-primary cursor-pointer line-clamp-2">
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <span className="font-medium">{item.source}</span>
                    <span>•</span>
                    <span>{item.time}</span>
                  </div>
                </div>
                <ExternalLink className="w-3 h-3 text-gray-400 hover:text-primary cursor-pointer flex-shrink-0 mt-1" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Latest Documents */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-black">Latest Documents</h2>
          <button className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded hover:bg-gray-50 transition-colors">
            <FileText className="w-4 h-4" />
            Open Document Search
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Company Docs */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-semibold text-black">Company Docs (1,847)</h3>
              </div>
              <button className="text-xs text-primary hover:underline">View →</button>
            </div>
            <div className="space-y-3">
              {documents.companyDocs.slice(0, 4).map((doc, idx) => (
                <div key={idx} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                  <div className="flex items-start gap-3">
                    <span className="text-xs font-semibold text-gray-600 min-w-[60px]">{doc.type}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-900 mb-1 hover:text-primary cursor-pointer line-clamp-2">
                        {doc.title}
                      </p>
                      <span className="text-xs text-gray-500">{doc.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Brokerage Research */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-yellow-600" />
                <h3 className="text-sm font-semibold text-black">Brokerage Research (850+)</h3>
              </div>
              <button className="text-xs text-primary hover:underline">View →</button>
            </div>
            <div className="space-y-3">
              {documents.brokerageResearch.slice(0, 4).map((doc, idx) => (
                <div key={idx} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                  <div className="flex items-start gap-3">
                    <div className="min-w-[90px]">
                      <span className="text-xs font-semibold text-gray-900 bg-yellow-50 px-2 py-1 rounded border border-yellow-200">
                        {doc.firm}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-900 mb-1 hover:text-primary cursor-pointer line-clamp-2 font-medium">
                        {doc.title}
                      </p>
                      <span className="text-xs text-gray-500">{doc.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Financials & Metrics Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-black mb-6">Financials & Metrics</h2>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div>
            <div className="text-xs text-gray-600 mb-1">Revenue (TTM)</div>
            <div className="text-xl font-semibold text-gray-900">$987.3M</div>
            <div className="text-xs text-green-600 mt-1">+42.3% YoY</div>
          </div>
          <div>
            <div className="text-xs text-gray-600 mb-1">Gross Margin</div>
            <div className="text-xl font-semibold text-gray-900">73.2%</div>
            <div className="text-xs text-green-600 mt-1">+2.1% YoY</div>
          </div>
          <div>
            <div className="text-xs text-gray-600 mb-1">Operating Margin</div>
            <div className="text-xl font-semibold text-gray-900">-8.5%</div>
            <div className="text-xs text-red-600 mt-1">-1.2% YoY</div>
          </div>
          <div>
            <div className="text-xs text-gray-600 mb-1">Free Cash Flow</div>
            <div className="text-xl font-semibold text-gray-900">$124.5M</div>
            <div className="text-xs text-green-600 mt-1">+65.8% YoY</div>
          </div>
        </div>

        {/* Financial Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Income Statement Highlights */}
          <div>
            <h3 className="text-sm font-semibold text-black mb-4">Income Statement Highlights</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 text-gray-600 font-semibold">Metric</th>
                    <th className="text-right py-2 text-gray-600 font-semibold">FY 2024</th>
                    <th className="text-right py-2 text-gray-600 font-semibold">FY 2023</th>
                    <th className="text-right py-2 text-gray-600 font-semibold">FY 2022</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 text-gray-700">Revenue</td>
                    <td className="py-2 text-right text-gray-900 font-medium">$987.3M</td>
                    <td className="py-2 text-right text-gray-900 font-medium">$693.5M</td>
                    <td className="py-2 text-right text-gray-900 font-medium">$487.2M</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 text-gray-700">Gross Profit</td>
                    <td className="py-2 text-right text-gray-900 font-medium">$722.8M</td>
                    <td className="py-2 text-right text-gray-900 font-medium">$493.5M</td>
                    <td className="py-2 text-right text-gray-900 font-medium">$341.8M</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 text-gray-700">Operating Income</td>
                    <td className="py-2 text-right text-gray-900 font-medium">-$83.9M</td>
                    <td className="py-2 text-right text-gray-900 font-medium">-$118.4M</td>
                    <td className="py-2 text-right text-gray-900 font-medium">-$147.3M</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 text-gray-700">Net Income</td>
                    <td className="py-2 text-right text-gray-900 font-medium">-$92.3M</td>
                    <td className="py-2 text-right text-gray-900 font-medium">-$128.7M</td>
                    <td className="py-2 text-right text-gray-900 font-medium">-$152.8M</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-gray-700">EPS (Diluted)</td>
                    <td className="py-2 text-right text-gray-900 font-medium">-$0.16</td>
                    <td className="py-2 text-right text-gray-900 font-medium">-$0.24</td>
                    <td className="py-2 text-right text-gray-900 font-medium">-$0.29</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Balance Sheet Highlights */}
          <div>
            <h3 className="text-sm font-semibold text-black mb-4">Balance Sheet Highlights</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 text-gray-600 font-semibold">Metric</th>
                    <th className="text-right py-2 text-gray-600 font-semibold">FY 2024</th>
                    <th className="text-right py-2 text-gray-600 font-semibold">FY 2023</th>
                    <th className="text-right py-2 text-gray-600 font-semibold">FY 2022</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 text-gray-700">Total Assets</td>
                    <td className="py-2 text-right text-gray-900 font-medium">$1.82B</td>
                    <td className="py-2 text-right text-gray-900 font-medium">$1.54B</td>
                    <td className="py-2 text-right text-gray-900 font-medium">$1.28B</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 text-gray-700">Cash & Equivalents</td>
                    <td className="py-2 text-right text-gray-900 font-medium">$587.3M</td>
                    <td className="py-2 text-right text-gray-900 font-medium">$512.8M</td>
                    <td className="py-2 text-right text-gray-900 font-medium">$445.2M</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 text-gray-700">Total Liabilities</td>
                    <td className="py-2 text-right text-gray-900 font-medium">$823.5M</td>
                    <td className="py-2 text-right text-gray-900 font-medium">$687.2M</td>
                    <td className="py-2 text-right text-gray-900 font-medium">$542.8M</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2 text-gray-700">Total Debt</td>
                    <td className="py-2 text-right text-gray-900 font-medium">$187.5M</td>
                    <td className="py-2 text-right text-gray-900 font-medium">$165.3M</td>
                    <td className="py-2 text-right text-gray-900 font-medium">$143.7M</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-gray-700">Shareholders' Equity</td>
                    <td className="py-2 text-right text-gray-900 font-medium">$997.2M</td>
                    <td className="py-2 text-right text-gray-900 font-medium">$852.4M</td>
                    <td className="py-2 text-right text-gray-900 font-medium">$735.8M</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Valuation Metrics */}
        <div className="mt-8">
          <h3 className="text-sm font-semibold text-black mb-4">Valuation Metrics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div className="p-3 bg-gray-50 rounded">
              <div className="text-xs text-gray-600 mb-1">P/E Ratio</div>
              <div className="text-lg font-semibold text-gray-900">N/A</div>
            </div>
            <div className="p-3 bg-gray-50 rounded">
              <div className="text-xs text-gray-600 mb-1">P/S Ratio</div>
              <div className="text-lg font-semibold text-gray-900">9.3x</div>
            </div>
            <div className="p-3 bg-gray-50 rounded">
              <div className="text-xs text-gray-600 mb-1">EV/Revenue</div>
              <div className="text-lg font-semibold text-gray-900">8.8x</div>
            </div>
            <div className="p-3 bg-gray-50 rounded">
              <div className="text-xs text-gray-600 mb-1">Price/Book</div>
              <div className="text-lg font-semibold text-gray-900">9.2x</div>
            </div>
            <div className="p-3 bg-gray-50 rounded">
              <div className="text-xs text-gray-600 mb-1">ROE</div>
              <div className="text-lg font-semibold text-gray-900">-9.3%</div>
            </div>
            <div className="p-3 bg-gray-50 rounded">
              <div className="text-xs text-gray-600 mb-1">ROA</div>
              <div className="text-lg font-semibold text-gray-900">-5.1%</div>
            </div>
          </div>
        </div>

        {/* Growth Metrics */}
        <div className="mt-8">
          <h3 className="text-sm font-semibold text-black mb-4">Growth Metrics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border border-gray-200 rounded">
              <div className="text-xs text-gray-600 mb-2">Revenue Growth (YoY)</div>
              <div className="text-2xl font-semibold text-green-600">+42.3%</div>
              <div className="text-xs text-gray-500 mt-1">3-Year CAGR: 38.5%</div>
            </div>
            <div className="p-4 border border-gray-200 rounded">
              <div className="text-xs text-gray-600 mb-2">Customer Growth</div>
              <div className="text-2xl font-semibold text-green-600">+35.8%</div>
              <div className="text-xs text-gray-500 mt-1">Total Customers: 18,500+</div>
            </div>
            <div className="p-4 border border-gray-200 rounded">
              <div className="text-xs text-gray-600 mb-2">ARR Growth</div>
              <div className="text-2xl font-semibold text-green-600">+44.2%</div>
              <div className="text-xs text-gray-500 mt-1">Current ARR: $1.1B</div>
            </div>
          </div>
        </div>
      </div>

      {/* Business Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Fleet Size & Vehicle Types */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 h-[500px] overflow-auto">
          <h3 className="text-lg font-semibold text-black mb-6">Fleet Size & Vehicle Types</h3>
          
          {/* Scale Metrics */}
          <div className="grid grid-cols-3 gap-4 mb-6 pb-6 border-b border-gray-200">
            <div>
              <div className="text-xs text-gray-600 mb-1">Connected Assets</div>
              <div className="text-xl font-semibold text-gray-900">1.2M+</div>
              <div className="text-xs text-green-600 mt-1">+35% YoY</div>
            </div>
            <div>
              <div className="text-xs text-gray-600 mb-1">Vehicles</div>
              <div className="text-xl font-semibold text-gray-900">850K+</div>
            </div>
            <div>
              <div className="text-xs text-gray-600 mb-1">Sites</div>
              <div className="text-xl font-semibold text-gray-900">350K+</div>
            </div>
          </div>

          {/* Vehicle Breakdown */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Commercial Trucks</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">340K</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Light-Duty Vehicles</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">285K</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Heavy Equipment</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">125K</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Trailers</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">95K</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                <span className="text-sm text-gray-700">Other Assets</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">5K</span>
            </div>
          </div>
        </div>

        {/* Key Clients & Resellers */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 h-[500px] overflow-auto">
          <h3 className="text-lg font-semibold text-black mb-6">Key Clients & Resellers</h3>
          
          {/* Enterprise Clients */}
          <div className="mb-6">
            <div className="text-xs font-semibold text-gray-600 mb-3">ENTERPRISE CLIENTS</div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                <div className="font-semibold text-sm text-gray-900">DHL Supply Chain</div>
                <div className="text-xs text-gray-600 mt-1">Logistics</div>
              </div>
              <div className="p-3 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                <div className="font-semibold text-sm text-gray-900">Sysco Corporation</div>
                <div className="text-xs text-gray-600 mt-1">Food Distribution</div>
              </div>
              <div className="p-3 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                <div className="font-semibold text-sm text-gray-900">Crown Castle</div>
                <div className="text-xs text-gray-600 mt-1">Infrastructure</div>
              </div>
              <div className="p-3 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                <div className="font-semibold text-sm text-gray-900">Edward Jones</div>
                <div className="text-xs text-gray-600 mt-1">Financial Services</div>
              </div>
              <div className="p-3 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                <div className="font-semibold text-sm text-gray-900">Anheuser-Busch</div>
                <div className="text-xs text-gray-600 mt-1">Beverage</div>
              </div>
              <div className="p-3 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                <div className="font-semibold text-sm text-gray-900">PG&E</div>
                <div className="text-xs text-gray-600 mt-1">Utilities</div>
              </div>
            </div>
          </div>

          {/* Channel Partners */}
          <div>
            <div className="text-xs font-semibold text-gray-600 mb-3">CHANNEL PARTNERS</div>
            <div className="flex flex-wrap gap-2">
              <div className="px-4 py-2 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg">
                <div className="font-semibold text-sm text-blue-900">AT&T</div>
              </div>
              <div className="px-4 py-2 bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-lg">
                <div className="font-semibold text-sm text-red-900">Verizon Connect</div>
              </div>
              <div className="px-4 py-2 bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-lg">
                <div className="font-semibold text-sm text-green-900">Element Fleet</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tech Stack & Integrations */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 h-[500px] overflow-auto">
          <h3 className="text-lg font-semibold text-black mb-6">Technology Stack & Integrations</h3>
          
          {/* Cloud & Infrastructure */}
          <div className="mb-6">
            <div className="text-xs font-semibold text-gray-600 mb-3">CLOUD INFRASTRUCTURE</div>
            <div className="flex gap-3">
              <div className="flex-1 p-4 bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-200 rounded-lg">
                <div className="font-bold text-lg text-orange-900">AWS</div>
                <div className="text-xs text-orange-700 mt-1">Primary Cloud</div>
              </div>
              <div className="flex-1 p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-lg">
                <div className="font-bold text-lg text-blue-900">Google Cloud</div>
                <div className="text-xs text-blue-700 mt-1">AI/ML Services</div>
              </div>
            </div>
          </div>

          {/* Enterprise Integrations */}
          <div className="mb-6">
            <div className="text-xs font-semibold text-gray-600 mb-3">ENTERPRISE INTEGRATIONS</div>
            <div className="grid grid-cols-3 gap-2">
              <div className="p-3 bg-blue-600 text-white rounded-lg text-center">
                <div className="font-semibold text-xs">Salesforce</div>
              </div>
              <div className="p-3 bg-blue-500 text-white rounded-lg text-center">
                <div className="font-semibold text-xs">Microsoft 365</div>
              </div>
              <div className="p-3 bg-red-600 text-white rounded-lg text-center">
                <div className="font-semibold text-xs">Oracle</div>
              </div>
              <div className="p-3 bg-blue-700 text-white rounded-lg text-center">
                <div className="font-semibold text-xs">SAP</div>
              </div>
              <div className="p-3 bg-indigo-600 text-white rounded-lg text-center">
                <div className="font-semibold text-xs">Workday</div>
              </div>
              <div className="p-3 bg-purple-600 text-white rounded-lg text-center">
                <div className="font-semibold text-xs">ServiceNow</div>
              </div>
            </div>
          </div>

          {/* API Stats */}
          <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-gray-600">API Partner Ecosystem</div>
                <div className="text-2xl font-bold text-purple-900 mt-1">500+</div>
              </div>
              <div className="text-4xl">🔌</div>
            </div>
          </div>
        </div>

        {/* Global Presence */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 h-[500px] flex flex-col">
          <h3 className="text-base font-semibold text-black mb-3">Global Presence</h3>
          
          {/* World Map Chart */}
          <div className="mb-3 p-3 bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg border border-slate-200">
            <svg viewBox="0 0 800 400" className="w-full h-[180px]" xmlns="http://www.w3.org/2000/svg">
              {/* Background */}
              <rect width="800" height="400" fill="#f8fafc" />
              
              {/* Simplified Continents */}
              {/* North America */}
              <path d="M 100 80 L 120 60 L 180 65 L 220 80 L 240 120 L 220 180 L 180 200 L 140 190 L 100 160 Z" 
                    fill="#3B82F6" opacity="0.8" stroke="#1E40AF" strokeWidth="2" />
              <text x="170" y="130" fill="white" fontSize="24" fontWeight="bold">75%</text>
              
              {/* Europe */}
              <path d="M 380 70 L 420 65 L 460 80 L 470 110 L 450 140 L 410 145 L 370 130 L 365 90 Z" 
                    fill="#10B981" opacity="0.7" stroke="#059669" strokeWidth="2" />
              <text x="415" y="110" fill="white" fontSize="18" fontWeight="bold">15%</text>
              
              {/* Asia Pacific */}
              <path d="M 550 100 L 620 95 L 680 120 L 700 160 L 680 200 L 640 210 L 580 190 L 540 150 Z" 
                    fill="#8B5CF6" opacity="0.7" stroke="#6D28D9" strokeWidth="2" />
              <text x="615" y="155" fill="white" fontSize="16" fontWeight="bold">8%</text>
              
              {/* South America / Other */}
              <path d="M 200 260 L 220 240 L 250 250 L 260 290 L 240 330 L 210 340 L 190 310 Z" 
                    fill="#F59E0B" opacity="0.6" stroke="#D97706" strokeWidth="2" />
              <text x="225" y="295" fill="white" fontSize="14" fontWeight="bold">2%</text>
              
              {/* Labels */}
              <text x="140" y="230" fill="#1E40AF" fontSize="11" fontWeight="600">North America</text>
              <text x="390" y="170" fill="#059669" fontSize="11" fontWeight="600">Europe</text>
              <text x="600" y="230" fill="#6D28D9" fontSize="11" fontWeight="600">Asia Pacific</text>
              <text x="205" y="360" fill="#D97706" fontSize="10" fontWeight="600">Other</text>
            </svg>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="text-center p-2 bg-blue-50 rounded border border-blue-200">
              <div className="text-xl font-bold text-blue-600">40+</div>
              <div className="text-[10px] text-gray-600">Countries</div>
            </div>
            <div className="text-center p-2 bg-green-50 rounded border border-green-200">
              <div className="text-xl font-bold text-green-600">18.5K</div>
              <div className="text-[10px] text-gray-600">Customers</div>
            </div>
          </div>

          {/* Key Markets */}
          <div className="flex-1">
            <div className="text-[10px] font-semibold text-gray-600 mb-2">KEY MARKETS</div>
            <div className="space-y-1">
              <div className="flex items-center justify-between p-1 hover:bg-gray-50 rounded text-xs">
                <span className="text-gray-700">🇺🇸 United States</span>
                <span className="text-[10px] font-semibold text-gray-900 bg-blue-100 px-2 py-0.5 rounded">Primary</span>
              </div>
              <div className="flex items-center justify-between p-1 hover:bg-gray-50 rounded text-xs">
                <span className="text-gray-700">🇬🇧 United Kingdom</span>
                <span className="text-[10px] font-semibold text-gray-900 bg-green-100 px-2 py-0.5 rounded">Growing</span>
              </div>
              <div className="flex items-center justify-between p-1 hover:bg-gray-50 rounded text-xs">
                <span className="text-gray-700">🇩🇪 Germany</span>
                <span className="text-[10px] font-semibold text-gray-900 bg-green-100 px-2 py-0.5 rounded">Growing</span>
              </div>
              <div className="flex items-center justify-between p-1 hover:bg-gray-50 rounded text-xs">
                <span className="text-gray-700">🇦🇺 Australia</span>
                <span className="text-[10px] font-semibold text-gray-900 bg-yellow-100 px-2 py-0.5 rounded">Emerging</span>
              </div>
            </div>
          </div>
        </div>

        {/* Industry Verticals */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 md:col-span-2">
          <h3 className="text-sm font-semibold text-black mb-4">Industry Verticals</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded">
              <div className="text-2xl font-semibold text-gray-900">32%</div>
              <div className="text-xs text-gray-600 mt-1">Transportation & Logistics</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded">
              <div className="text-2xl font-semibold text-gray-900">22%</div>
              <div className="text-xs text-gray-600 mt-1">Construction</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded">
              <div className="text-2xl font-semibold text-gray-900">18%</div>
              <div className="text-xs text-gray-600 mt-1">Field Services</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded">
              <div className="text-2xl font-semibold text-gray-900">12%</div>
              <div className="text-xs text-gray-600 mt-1">Food & Beverage</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded">
              <div className="text-2xl font-semibold text-gray-900">8%</div>
              <div className="text-xs text-gray-600 mt-1">Energy & Utilities</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded">
              <div className="text-2xl font-semibold text-gray-900">5%</div>
              <div className="text-xs text-gray-600 mt-1">Manufacturing</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded">
              <div className="text-2xl font-semibold text-gray-900">3%</div>
              <div className="text-xs text-gray-600 mt-1">Other</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
