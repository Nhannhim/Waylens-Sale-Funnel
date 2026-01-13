"use client"

import { Button } from "@/components/ui/button"
import { 
  Building2, 
  HelpCircle, 
  Lightbulb, 
  TrendingUp,
  Linkedin,
  Twitter,
  Facebook,
  ExternalLink,
  ChevronRight
} from "lucide-react"

interface CompanyPageProps {
  ticker: string
}

const companyData: Record<
  string,
  {
    name: string
    logo: string
    lastPrice: number
    change: number
    changePercent: number
    lastClose: number
    range52w: { low: number; high: number }
    marketCap: string
    avgVolume30d: string
    description: string
  }
> = {
  NVDA: {
    name: "NVIDIA Corp",
    logo: "NVDA",
    lastPrice: 178.56,
    change: 3.05,
    changePercent: 1.73,
    lastClose: 175.51,
    range52w: { low: 86.62, high: 179.38 },
    marketCap: "$4.36T",
    avgVolume30d: "173.15M",
    description: "Nvidia is a leading developer of graphics processing units. Traditionally, GPUs were used to enhance the experience on computing platforms, most notably in gaming applications on PCs. GPU use cases have since emerged as important semiconductors used in artificial intelligence. Nvidia not only offers AI GPUs, but also a software platform, Cuda, used for AI model development and training. Nvidia is also expanding its data center n... Read More About",
  },
  AAPL: {
    name: "Apple Inc",
    logo: "AAPL",
    lastPrice: 178.56,
    change: 3.05,
    changePercent: 1.73,
    lastClose: 175.51,
    range52w: { low: 86.62, high: 179.38 },
    marketCap: "$4.36T",
    avgVolume30d: "173.15M",
    description: "Apple is among the largest companies in the world, with a broad portfolio of hardware and software products targeted at consumers and businesses.",
  },
}

const workflowAgents = [
  {
    id: "company-primer",
    icon: Building2,
    title: "Company Primer",
    description: "Conduct a deep dive on NVIDIA Corp.",
    time: "5-15 min",
  },
  {
    id: "top-questions",
    icon: HelpCircle,
    title: "Top Questions for Experts",
    description: "Summarize common Q&A about NVIDIA Corp.",
    time: "3-12 min",
  },
  {
    id: "customer-insights",
    icon: Lightbulb,
    title: "Customer Insights",
    description: "Summarize key customer opinions and feedback.",
    time: "3-12 min",
  },
  {
    id: "competitive-positioning",
    icon: TrendingUp,
    title: "Competitive Positioning Analysis",
    description: "Evaluate NVIDIA Corp's standing relative to its key competitors.",
    time: "5-15 min",
  },
]

const latestDocuments = {
  expertInsights: [
    { role: "Former", title: "NVIDIA's AI chip dominance faces challenges from...", date: "30 Jul 25" },
    { role: "Consultant", title: "Data center GPU market growth projections...", date: "28 Jul 25" },
    { role: "Former", title: "CUDA platform competitive advantages...", date: "27 Jul 25" },
    { role: "Current", title: "Automotive AI partnerships and opportunities...", date: "25 Jul 25" },
  ],
  brokerResearch: [
    { company: "JPMorgan K...", title: "Maintain Overweight - Strong Q2 results...", date: "29 Jul 23" },
    { company: "Edgewater R...", title: "Upgrade to Buy - Data center momentum...", date: "28 Jul 25" },
    { company: "Goldman S...", title: "Price target raised to $200...", date: "27 Jul 25" },
    { company: "Morgan S...", title: "AI infrastructure spending outlook...", date: "26 Jul 25" },
    { company: "Bank of A...", title: "Maintain Buy rating - Market leadership...", date: "25 Jul 25" },
  ],
  companyDocs: [
    { type: "Press", title: "NVIDIA Announces Q2 2025 Financial Results", date: "30 Jul 25" },
    { type: "Press", title: "New Data Center GPU Architecture Unveiled", date: "23 Jul 25" },
  ],
  news: [
    { type: "OpenPR", title: "NVIDIA partners with major cloud providers...", date: "30 Jul 25" },
    { type: "Windows Ce", title: "NVIDIA AI chips power new enterprise solutions...", date: "29 Jul 25" },
  ],
}

export function CompanyPage({ ticker }: CompanyPageProps) {
  const company = companyData[ticker] || companyData.NVDA
  const isPositive = company.change >= 0

  return (
    <div className="flex-1 overflow-auto bg-white">
      <div className="max-w-[1400px] mx-auto p-6 space-y-6">
        {/* Company Header & Market Data */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-500 rounded flex items-center justify-center">
                <span className="text-white font-bold text-lg">{company.logo[0]}</span>
              </div>
              <div>
                <h1 className="text-xl font-semibold text-black">{company.name} {ticker} US Composite</h1>
                <div className="flex items-center gap-4 mt-2 text-sm">
                  <div>
                    <span className="text-gray-600">Last Price (Delayed, USD) </span>
                    <span className="font-semibold text-lg text-gray-900">${company.lastPrice.toFixed(2)}</span>
                    <span className={`ml-2 ${isPositive ? "text-green-600" : "text-red-600"}`}>
                      ({isPositive ? "+" : ""}${company.change.toFixed(2)}, ↑ {company.changePercent.toFixed(2)}%)
                    </span>
                    <span className="text-gray-600 ml-2">07/30/2025 11:45 AM</span>
                  </div>
                </div>
                <div className="flex items-center gap-6 mt-2 text-sm text-gray-600">
                  <div>Last Close ${company.lastClose.toFixed(2)}</div>
                  <div>52w Range ${company.range52w.low.toFixed(2)} - {company.range52w.high.toFixed(2)}</div>
                  <div>Market Cap <span className="font-semibold text-gray-900">{company.marketCap}</span></div>
                  <div>30D Avg Volume {company.avgVolume30d}</div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="w-8 h-8 rounded flex items-center justify-center hover:bg-gray-100 transition-colors">
                <Linkedin className="w-4 h-4 text-gray-600" />
              </button>
              <button className="w-8 h-8 rounded flex items-center justify-center hover:bg-gray-100 transition-colors">
                <Twitter className="w-4 h-4 text-gray-600" />
              </button>
              <button className="w-8 h-8 rounded flex items-center justify-center hover:bg-gray-100 transition-colors">
                <Facebook className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Document & Industry Filters */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Button className="bg-[#1e3a5f] text-white hover:bg-[#2a4d7a]">
              Open Document Search
            </Button>
          </div>
          <div>
            <div className="text-xs font-semibold text-gray-500 mb-2">LATEST</div>
            <div className="flex flex-wrap gap-2">
              {["10Q 05/28/2025", "10K 02/26/2025", "Earnings Transcript 05/28/2025", "Investor Presentation 06/25/2025", "Model Q1-2026"].map((tag) => (
                <button
                  key={tag}
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-xs text-gray-900 transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs font-semibold text-gray-500 mb-2">INDUSTRY COMPS</div>
            <div className="flex flex-wrap gap-2">
              {["ADAS Technology", "Big Tech", "AI", "Semiconductors"].map((tag) => (
                <button
                  key={tag}
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-xs text-gray-900 transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Summary Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-4 text-black">Summary</h2>
          <p className="text-sm text-gray-900 leading-relaxed">
            {company.description}
          </p>
        </div>

        {/* Workflow Agents Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-semibold text-black">Workflow Agents</h2>
            <button className="text-sm text-blue-600 hover:underline flex items-center gap-1">
              View All <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Work smarter using curated workflows built with our most powerful AI features.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {workflowAgents.map((agent) => {
              const Icon = agent.icon
              return (
                <div
                  key={agent.id}
                  className="bg-gray-50 rounded-lg border border-gray-200 p-4 hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 bg-blue-100 rounded flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm mb-1">{agent.title}</h3>
                      <p className="text-xs text-gray-600">{agent.description}</p>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">{agent.time}</div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Latest Documents Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-black">Latest Documents</h2>
            <Button className="bg-[#1e3a5f] text-white hover:bg-[#2a4d7a]" size="sm">
              Open Document Search
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Expert Insights */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-sm">Expert Insights (442)</h3>
                <button className="text-xs text-primary hover:underline flex items-center gap-1">
                  View <ChevronRight className="w-3 h-3" />
                </button>
              </div>
              <div className="space-y-3">
                {latestDocuments.expertInsights.map((doc, idx) => (
                  <div key={idx} className="border-b border-gray-200 pb-3 last:border-0">
                    <div className="flex items-start gap-2 mb-1">
                      <span className="text-xs font-semibold text-gray-500">{doc.role}</span>
                      <span className="text-xs text-gray-900 flex-1">{doc.title}</span>
                    </div>
                    <div className="text-xs text-gray-500">{doc.date}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Broker Research */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-sm">Broker Research (11,494)</h3>
                <button className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                  View <ChevronRight className="w-3 h-3" />
                </button>
              </div>
              <div className="space-y-3">
                {latestDocuments.brokerResearch.map((doc, idx) => (
                  <div key={idx} className="border-b border-gray-200 pb-3 last:border-0">
                    <div className="flex items-start gap-2 mb-1">
                      <span className="text-xs font-semibold text-gray-500">{doc.company}</span>
                      <span className="text-xs text-gray-900 flex-1">{doc.title}</span>
                    </div>
                    <div className="text-xs text-gray-500">{doc.date}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Company Docs */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-sm">Company Docs (1,847)</h3>
                <button className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                  View <ChevronRight className="w-3 h-3" />
                </button>
              </div>
              <div className="space-y-3">
                {latestDocuments.companyDocs.map((doc, idx) => (
                  <div key={idx} className="border-b border-gray-200 pb-3 last:border-0">
                    <div className="flex items-start gap-2 mb-1">
                      <span className="text-xs font-semibold text-gray-500">{doc.type}</span>
                      <span className="text-xs text-gray-900 flex-1">{doc.title}</span>
                    </div>
                    <div className="text-xs text-gray-500">{doc.date}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* News & Regulatory */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-sm">News & Regulatory (46,710)</h3>
                <button className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                  View <ChevronRight className="w-3 h-3" />
                </button>
              </div>
              <div className="space-y-3">
                {latestDocuments.news.map((doc, idx) => (
                  <div key={idx} className="border-b border-gray-200 pb-3 last:border-0">
                    <div className="flex items-start gap-2 mb-1">
                      <span className="text-xs font-semibold text-gray-500">{doc.type}</span>
                      <span className="text-xs text-gray-900 flex-1">{doc.title}</span>
                    </div>
                    <div className="text-xs text-gray-500">{doc.date}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
