"use client"

import type React from "react"

import {
  Search,
  Zap,
  FileText,
  Calendar,
  Globe,
  Settings,
  User,
  Phone,
  HelpCircle,
  ChevronDown,
  ChevronRight,
} from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface SidebarProps {
  activeSection: string
  onSectionChange: (section: string) => void
}

interface NavItem {
  id: string
  label: string
  icon?: React.ReactNode
}

interface NavSection {
  title: string
  items: NavItem[]
}

const navSections: NavSection[] = [
  {
    title: "OVERVIEW",
    items: [
      { id: "summary", label: "Summary" },
      { id: "industry-earnings", label: "Industry Earnings Summary" },
    ],
  },
  {
    title: "DOCUMENTS",
    items: [
      { id: "expert-transcripts", label: "Expert Transcripts" },
      { id: "broker-research", label: "Broker Research" },
      { id: "company-docs", label: "Company Docs" },
    ],
  },
  {
    title: "FINANCIALS & METRICS",
    items: [
      { id: "financial-overview", label: "Financial Overview" },
      { id: "valuation-ratios", label: "Valuation & Ratios" },
      { id: "statements", label: "Statements" },
      { id: "comparables", label: "Comparables" },
      { id: "charting", label: "Charting" },
      { id: "pre-ipo-funding", label: "Pre-IPO Funding Rounds" },
    ],
  },
]

export function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "OVERVIEW",
    "DOCUMENTS",
    "FINANCIALS & METRICS",
  ])

  const toggleSection = (title: string) => {
    setExpandedSections((prev) => (prev.includes(title) ? prev.filter((s) => s !== title) : [...prev, title]))
  }

  return (
    <aside className="w-64 bg-[#2d2d2d] border-r border-[#3d3d3d] flex flex-col h-full">
      {/* Logo and top icons */}
      <div className="p-3 border-b border-[#3d3d3d]">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-[#1e3a5f] rounded flex items-center justify-center">
            <span className="text-white font-bold text-sm">AI</span>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <SidebarIconButton icon={<Search className="w-4 h-4" />} />
          <SidebarIconButton icon={<Zap className="w-4 h-4" />} />
          <SidebarIconButton icon={<FileText className="w-4 h-4" />} />
          <SidebarIconButton icon={<Calendar className="w-4 h-4" />} />
          <SidebarIconButton icon={<Globe className="w-4 h-4" />} />
          <SidebarIconButton icon={<Settings className="w-4 h-4" />} />
          <SidebarIconButton icon={<User className="w-4 h-4" />} />
          <SidebarIconButton icon={<Phone className="w-4 h-4" />} />
          <SidebarIconButton icon={<HelpCircle className="w-4 h-4" />} />
        </div>
      </div>

      {/* Main navigation */}
      <div className="flex-1 overflow-y-auto py-2">
        {navSections.map((section) => (
          <div key={section.title} className="px-3 mb-2">
            <button
              onClick={() => toggleSection(section.title)}
              className="flex items-center gap-1 text-xs font-bold text-white mb-1 hover:text-white transition-colors w-full"
            >
              {expandedSections.includes(section.title) ? (
                <ChevronDown className="w-3 h-3" />
              ) : (
                <ChevronRight className="w-3 h-3" />
              )}
              {section.title}
            </button>
            {expandedSections.includes(section.title) && (
              <div className="space-y-0.5">
                {section.items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => onSectionChange(item.id)}
                    className={cn(
                      "w-full text-left px-2 py-1.5 rounded text-sm transition-colors",
                      activeSection === item.id
                        ? "bg-[#3d3d3d] text-white"
                        : "text-gray-400 hover:bg-[#3d3d3d] hover:text-white",
                    )}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Bottom feedback section */}
      <div className="p-3 border-t border-[#3d3d3d]">
        <div className="bg-[#3d3d3d]/50 rounded p-3 mb-2">
          <p className="text-xs text-white mb-2">Company Profile BETA</p>
          <p className="text-[10px] text-gray-400 mb-2">How helpful is this experience?</p>
          <button className="text-xs text-blue-400 hover:underline">Leave Feedback</button>
        </div>
        <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-xs font-semibold text-blue-400">
          CB
        </div>
      </div>
    </aside>
  )
}

function SidebarIconButton({ icon, active }: { icon: React.ReactNode; active?: boolean }) {
  return (
    <button
      className={cn(
        "w-8 h-8 rounded flex items-center justify-center transition-colors",
        active
          ? "bg-[#1e3a5f] text-white"
          : "text-gray-400 hover:bg-[#3d3d3d] hover:text-white",
      )}
    >
      {icon}
    </button>
  )
}
