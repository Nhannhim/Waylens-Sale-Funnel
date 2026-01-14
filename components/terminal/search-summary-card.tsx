"use client"

import { Sparkles, TrendingUp, FileText } from "lucide-react"

interface SearchSummary {
  directAnswer: string
  keyInsights: string[]
  relevantMetrics: Array<{
    metric: string
    value: string
    source: string
  }>
  competitiveImplications: string
}

interface SearchSummaryCardProps {
  summary: SearchSummary
  query: string
}

export function SearchSummaryCard({ summary, query }: SearchSummaryCardProps) {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-white rounded-lg border border-blue-200 p-5 mb-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-blue-600" />
        </div>
        <div>
          <h3 className="font-semibold text-blue-900">AI Summary</h3>
          <p className="text-xs text-gray-500">Based on {query}</p>
        </div>
      </div>

      {/* Direct Answer */}
      <div className="bg-white rounded-lg p-4 mb-4 border border-blue-100">
        <p className="text-gray-900 font-medium">{summary.directAnswer}</p>
      </div>

      {/* Key Insights */}
      {summary.keyInsights && summary.keyInsights.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
            <TrendingUp className="w-4 h-4" />
            Key Insights
          </h4>
          <ul className="space-y-1.5">
            {summary.keyInsights.map((insight, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-blue-500 mt-1">•</span>
                {insight}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Relevant Metrics */}
      {summary.relevantMetrics && summary.relevantMetrics.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
            <FileText className="w-4 h-4" />
            Key Metrics
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {summary.relevantMetrics.map((metric, idx) => (
              <div key={idx} className="bg-white rounded p-2 border border-gray-100">
                <div className="text-xs text-gray-500">{metric.metric}</div>
                <div className="font-semibold text-gray-900">{metric.value}</div>
                <div className="text-[10px] text-gray-400 truncate">{metric.source}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Competitive Implications */}
      {summary.competitiveImplications && (
        <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
          <h4 className="text-xs font-semibold text-blue-800 mb-1">For Waylens Sales</h4>
          <p className="text-sm text-blue-900">{summary.competitiveImplications}</p>
        </div>
      )}
    </div>
  )
}
