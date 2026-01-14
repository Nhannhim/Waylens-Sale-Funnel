"use client"

import { useState } from "react"
import { Sidebar } from "./terminal/sidebar"
import { TopBar } from "./terminal/top-bar"
import { CompanyOverview } from "./terminal/company-overview"
import { CompanySummary } from "./terminal/company-summary"
import { CompanySearch } from "./terminal/company-search"
import { InsurtechPage } from "./terminal/insurtech-page"
import { ClientsPage } from "./terminal/clients-page"
import { NewsPage } from "./terminal/news-page"
import { OutreachPage } from "./terminal/outreach-page"
import { NewsletterPage } from "./terminal/newsletter-page"
import { SearchPage } from "./terminal/search-page"

export function EquityTerminal() {
  const [selectedTicker, setSelectedTicker] = useState("IOT")
  const [activeSection, setActiveSection] = useState("summary-tsp")

  const renderContent = () => {
    switch (activeSection) {
      case "search":
        return <SearchPage ticker={selectedTicker} />
      case "overview":
        return <CompanyOverview ticker={selectedTicker} />
      case "summary":
        return <CompanySearch />
      case "summary-tsp":
      case "summary-reseller":
        return <CompanySummary ticker={selectedTicker} companyType={activeSection} />
      case "summary-insurtech":
        return <InsurtechPage ticker={selectedTicker} />
      case "clients":
        return <ClientsPage ticker={selectedTicker} />
      case "news":
        return <NewsPage ticker={selectedTicker} />
      case "outreach":
        return <OutreachPage ticker={selectedTicker} />
      case "outreach-newsletter":
        return <NewsletterPage ticker={selectedTicker} />
      default:
        return <CompanyOverview ticker={selectedTicker} />
    }
  }

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar selectedTicker={selectedTicker} onTickerChange={setSelectedTicker} />
        <main className="flex-1 overflow-auto p-4 bg-gray-100">
          {renderContent()}
        </main>
      </div>
    </div>
  )
}
