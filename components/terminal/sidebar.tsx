"use client"

import type React from "react"

import {
  TrendingUp,
  Building2,
  Newspaper,
  Phone,
  FileText,
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
  subItems?: Record<string, NavItem[]>
}

const navSections: NavSection[] = [
  {
    title: "MAIN",
    items: [
      { id: "overview", label: "Industry Overview", icon: <TrendingUp className="w-4 h-4" /> },
      { id: "summary", label: "Companies", icon: <FileText className="w-4 h-4" /> },
      { id: "clients", label: "Clients", icon: <Building2 className="w-4 h-4" /> },
      { id: "news", label: "News", icon: <Newspaper className="w-4 h-4" /> },
      { id: "outreach", label: "Wayland's Outreach", icon: <Phone className="w-4 h-4" /> },
    ],
    subItems: {
      "summary": [
        { id: "summary-tsp", label: "TSP", icon: <Building2 className="w-3 h-3" /> },
        { id: "summary-reseller", label: "Reseller", icon: <Building2 className="w-3 h-3" /> },
        { id: "summary-insurtech", label: "Insurtech", icon: <Building2 className="w-3 h-3" /> },
      ],
    },
  },
]

export function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "MAIN",
  ])
  const [expandedItems, setExpandedItems] = useState<string[]>(["summary"])

  const toggleSection = (title: string) => {
    setExpandedSections((prev) => (prev.includes(title) ? prev.filter((s) => s !== title) : [...prev, title]))
  }

  const toggleItem = (itemId: string) => {
    setExpandedItems((prev) => (prev.includes(itemId) ? prev.filter((s) => s !== itemId) : [...prev, itemId]))
  }

  return (
    <aside className="w-64 bg-[#2d2d2d] border-r border-[#3d3d3d] flex flex-col h-full">
      {/* Logo */}
      <div className="p-4 border-b border-[#3d3d3d]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#1e3a5f] rounded flex items-center justify-center overflow-hidden">
            <img 
              src="/logo.svg" 
              alt="Logo" 
              className="w-full h-full object-contain"
              onError={(e) => {
                // Fallback to icon if logo doesn't exist
                const target = e.target as HTMLImageElement
                if (!target.src.includes("icon.svg")) {
                  target.src = "/icon.svg"
                } else {
                  target.style.display = "none"
                }
              }}
            />
          </div>
          <div className="text-white font-semibold text-base">AlphaSense</div>
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
                {section.items.map((item) => {
                  const hasSubItems = section.subItems && section.subItems[item.id]
                  return (
                    <div key={item.id}>
                      <button
                        onClick={() => {
                          if (hasSubItems) {
                            toggleItem(item.id)
                          } else {
                            onSectionChange(item.id)
                          }
                        }}
                        className={cn(
                          "w-full text-left px-3 py-2.5 rounded text-sm transition-colors flex items-center gap-2",
                          activeSection === item.id || activeSection.startsWith(item.id + "-")
                            ? "bg-[#3d3d3d] text-white"
                            : "text-gray-400 hover:bg-[#3d3d3d] hover:text-white",
                        )}
                      >
                        {item.icon}
                        <span className="flex-1">{item.label}</span>
                        {hasSubItems && (
                          expandedItems.includes(item.id) ? (
                            <ChevronDown className="w-3 h-3" />
                          ) : (
                            <ChevronRight className="w-3 h-3" />
                          )
                        )}
                      </button>
                      
                      {/* Sub-items */}
                      {hasSubItems && expandedItems.includes(item.id) && (
                        <div className="ml-6 mt-1 space-y-0.5">
                          {section.subItems![item.id].map((subItem) => (
                            <button
                              key={subItem.id}
                              onClick={() => onSectionChange(subItem.id)}
                              className={cn(
                                "w-full text-left px-3 py-2 rounded text-sm transition-colors flex items-center gap-2",
                                activeSection === subItem.id
                                  ? "bg-[#3d3d3d] text-white"
                                  : "text-gray-400 hover:bg-[#3d3d3d] hover:text-white",
                              )}
                            >
                              {subItem.icon}
                              <span>{subItem.label}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
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
