"use client"

import { useState } from "react"
import { Sidebar } from "./terminal/sidebar"
import { CompanyOverview } from "./terminal/company-overview"
import { ClientsPage } from "./terminal/clients-page"
import { NewsPage } from "./terminal/news-page"
import { OutreachPage } from "./terminal/outreach-page"
import { NewsletterPage } from "./terminal/newsletter-page"
import { SearchPage } from "./terminal/search-page"

export function EquityTerminal() {
  const [selectedTicker, setSelectedTicker] = useState("IOT")

  // Initialize with sessionStorage check - runs before first render
  const [activeSection, setActiveSection] = useState(() => {
    if (typeof window !== 'undefined') {
      const navSection = sessionStorage.getItem('navigateToSection');
      if (navSection) {
        sessionStorage.removeItem('navigateToSection');
        return navSection;
      }
    }
    return "search";
  })

  const renderContent = () => {
    switch (activeSection) {
      case "search":
        return <SearchPage ticker={selectedTicker} />
      case "overview":
        return <CompanyOverview ticker={selectedTicker} />
      case "clients":
        return <ClientsPage ticker={selectedTicker} />
      case "news":
        return <NewsPage ticker={selectedTicker} />
      case "outreach":
        return <OutreachPage ticker={selectedTicker} />
      case "outreach-newsletter":
        return <NewsletterPage ticker={selectedTicker} />
      default:
        return <SearchPage ticker={selectedTicker} />
    }
  }

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-auto p-4 bg-gray-100">
          {renderContent()}
        </main>
      </div>
    </div>
  )
}
