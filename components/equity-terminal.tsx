"use client"

import { useState } from "react"
import { Sidebar } from "./terminal/sidebar"
import { TopBar } from "./terminal/top-bar"
import { CompanyPage } from "./terminal/company-page"
import { CompanySummary } from "./terminal/company-summary"

export function EquityTerminal() {
  const [selectedTicker, setSelectedTicker] = useState("NVDA")
  const [activeSection, setActiveSection] = useState("summary")

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar selectedTicker={selectedTicker} onTickerChange={setSelectedTicker} />
        <main className="flex-1 overflow-hidden">
          {activeSection === "summary" ? (
            <CompanyPage ticker={selectedTicker} />
          ) : (
            <div className="p-4">
              <CompanySummary ticker={selectedTicker} />
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
