"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, Download } from "lucide-react"

interface CSVResultCardProps {
  result: {
    filename: string
    filepath: string
    score: number
    matchedKeywords: string[]
    company: string | null
    topic: string | null
    columns: string[]
    preview: string[][]
    totalRows: number
  }
  rank: number
}

function formatFilename(filename: string): string {
  return filename
    .replace('.csv', '')
    .replace(/^\d+_/, '')
    .replace(/_/g, ' ')
    .replace(/mrm /gi, '')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export function CSVResultCard({ result, rank }: CSVResultCardProps) {
  const [expanded, setExpanded] = useState(false)

  const formattedName = formatFilename(result.filename)

  const handleDownload = async () => {
    try {
      const response = await fetch(`/${result.filepath}`)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = result.filename
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Download failed:', error)
    }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:border-blue-300 transition-colors">
      {/* Header Row */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-400">#{rank}</span>
          <div>
            <h4 className="font-semibold text-gray-900">{formattedName}</h4>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              {result.company && (
                <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs">
                  {result.company}
                </span>
              )}
              {result.topic && (
                <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs">
                  {result.topic}
                </span>
              )}
              <span className="text-xs text-gray-500">{result.totalRows} rows</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-700 bg-white border border-gray-200 rounded hover:bg-gray-50 transition-colors"
          >
            {expanded ? (
              <>
                <ChevronUp className="w-4 h-4" />
                Collapse
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />
                Preview
              </>
            )}
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-700 bg-white border border-gray-200 rounded hover:bg-gray-50 transition-colors"
            title="Download CSV"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Matched Keywords */}
      {result.matchedKeywords.length > 0 && (
        <div className="flex items-center gap-1 mb-3 flex-wrap">
          <span className="text-xs text-gray-500">Matched:</span>
          {result.matchedKeywords.map(kw => (
            <span key={kw} className="text-xs px-1.5 py-0.5 bg-yellow-100 text-yellow-800 rounded">
              {kw}
            </span>
          ))}
        </div>
      )}

      {/* Expandable Preview Table */}
      {expanded && result.preview.length > 0 && (
        <div className="mt-3 overflow-x-auto border border-gray-100 rounded">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50">
                {result.columns.map((col, idx) => (
                  <th key={idx} className="px-3 py-2 text-left text-gray-700 font-medium text-xs whitespace-nowrap">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {result.preview.map((row, rowIdx) => (
                <tr key={rowIdx} className="border-t border-gray-100">
                  {row.map((cell, cellIdx) => (
                    <td key={cellIdx} className="px-3 py-2 text-gray-900 text-xs max-w-[200px] truncate">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {result.totalRows > 5 && (
            <p className="text-xs text-gray-500 p-2 text-center bg-gray-50">
              Showing 5 of {result.totalRows} rows
            </p>
          )}
        </div>
      )}
    </div>
  )
}
