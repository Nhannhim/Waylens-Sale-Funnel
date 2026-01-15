"use client"

import type React from "react"

import {
  TrendingUp,
  Building2,
  Newspaper,
  Phone,
  FileText,
  Search,
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
      { id: "search", label: "Search", icon: <Search className="w-4 h-4" /> },
      { id: "overview", label: "Industry Overview", icon: <TrendingUp className="w-4 h-4" /> },
      { id: "clients", label: "Clients", icon: <Building2 className="w-4 h-4" /> },
      { id: "news", label: "News", icon: <Newspaper className="w-4 h-4" /> },
      { id: "outreach", label: "Outreach", icon: <Phone className="w-4 h-4" /> },
    ],
    subItems: {
      "outreach": [
        { id: "outreach-newsletter", label: "Newsletter", icon: <Newspaper className="w-3 h-3" /> },
        { id: "outreach-company", label: "Company Template", icon: <Building2 className="w-3 h-3" /> },
      ],
    },
  },
]

export function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "MAIN",
  ])
  const [expandedItems, setExpandedItems] = useState<string[]>(["summary", "outreach"])
  const [isHovered, setIsHovered] = useState(false)

  const toggleSection = (title: string) => {
    setExpandedSections((prev) => (prev.includes(title) ? prev.filter((s) => s !== title) : [...prev, title]))
  }

  const toggleItem = (itemId: string) => {
    setExpandedItems((prev) => (prev.includes(itemId) ? prev.filter((s) => s !== itemId) : [...prev, itemId]))
  }

  return (
    <aside 
      className={`bg-[#2d2d2d] border-r border-[#3d3d3d] flex flex-col h-full transition-all duration-300 ease-in-out ${
        isHovered ? 'w-64' : 'w-16'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Logo */}
      <div className="p-4 border-b border-[#3d3d3d] flex items-center justify-start">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-8 h-8 bg-white rounded flex items-center justify-center flex-shrink-0">
            <img
              src="/waylens-logo.png"
              alt="Waylens Logo"
              className="w-full h-full object-cover"
            />
          </div>
          {isHovered && (
            <div className="text-white font-semibold text-base whitespace-nowrap">Waylens</div>
          )}
        </div>
      </div>

      {/* Main navigation */}
      <div className="flex-1 overflow-y-auto py-2">
        {navSections.map((section) => (
          <div key={section.title} className={isHovered ? "px-3 mb-2" : "px-2 mb-2"}>
            {isHovered && (
              <button
                onClick={() => toggleSection(section.title)}
                className="flex items-center gap-1 text-xs font-bold text-gray-500 mb-1 hover:text-gray-400 transition-colors w-full"
              >
                {expandedSections.includes(section.title) ? (
                  <ChevronDown className="w-3 h-3" />
                ) : (
                  <ChevronRight className="w-3 h-3" />
                )}
                {section.title}
              </button>
            )}
            {(isHovered ? expandedSections.includes(section.title) : true) && (
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const hasSubItems = section.subItems && section.subItems[item.id]
                  return (
                    <div key={item.id}>
                      <button
                        onClick={() => {
                          if (hasSubItems && isHovered) {
                            toggleItem(item.id)
                          } else {
                            onSectionChange(item.id)
                          }
                        }}
                        title={!isHovered ? item.label : undefined}
                        className={cn(
                          "w-full transition-colors flex items-center",
                          isHovered ? "text-left px-3 py-2.5 rounded text-sm gap-2" : "justify-center py-3",
                          activeSection === item.id || activeSection.startsWith(item.id + "-")
                            ? "bg-[#3d3d3d] text-white"
                            : "text-gray-400 hover:bg-[#3d3d3d] hover:text-white",
                        )}
                      >
                        {item.icon}
                        {isHovered && (
                          <>
                            <span className="flex-1">{item.label}</span>
                            {hasSubItems && (
                              expandedItems.includes(item.id) ? (
                                <ChevronDown className="w-3 h-3" />
                              ) : (
                                <ChevronRight className="w-3 h-3" />
                              )
                            )}
                          </>
                        )}
                      </button>
                      
                      {/* Sub-items */}
                      {hasSubItems && isHovered && expandedItems.includes(item.id) && (
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

      {/* Bottom section */}
      <div className={`border-t border-[#3d3d3d] transition-all ${isHovered ? 'p-3' : 'p-2'}`}>
        <div className={isHovered ? "" : "flex justify-center"}>
          <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-xs font-semibold text-blue-400">
            CB
          </div>
        </div>
      </div>
    </aside>
  )
}
