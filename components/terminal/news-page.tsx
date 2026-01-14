"use client"

import { Newspaper, ExternalLink, TrendingUp } from "lucide-react"

interface NewsPageProps {
  ticker: string
}

const newsArticles = [
  // January 2026
  { title: "FMCSA Sets December 2026 Deadline for Updated ELD Mandate Compliance", source: "Commercial Carrier Journal", date: "Jan 13, 2026", time: "2h ago", category: "Regulation" },
  { title: "Global Telematics Market Projected to Reach $12B by 2028", source: "MarketsandMarkets", date: "Jan 12, 2026", time: "1d ago", category: "Market" },
  { title: "Samsara Achieves #1 Ranking in 21 G2 Categories for Winter 2026", source: "G2", date: "Jan 10, 2026", time: "3d ago", category: "Recognition" },
  { title: "Video Telematics Adoption Grows 67% Year-over-Year in Commercial Fleets", source: "Automotive Fleet", date: "Jan 9, 2026", time: "4d ago", category: "Technology" },
  { title: "5G Rollout Accelerates Real-Time Fleet Data Transmission", source: "IoT World Today", date: "Jan 8, 2026", time: "5d ago", category: "Connectivity" },
  { title: "AI-Powered Driver Coaching Reduces Accident Rates by 45%", source: "Fleet Owner", date: "Jan 7, 2026", time: "6d ago", category: "Safety" },
  { title: "ELD Non-Compliance Penalties Increase to $15,691 per Violation", source: "Transport Topics", date: "Jan 6, 2026", time: "1w ago", category: "Regulation" },
  { title: "Predictive Maintenance Technology Cuts Fleet Downtime by 35%", source: "Heavy Duty Trucking", date: "Jan 5, 2026", time: "1w ago", category: "Technology" },
  { title: "Electric Vehicle Fleet Management Solutions See 85% Growth", source: "Green Fleet", date: "Jan 4, 2026", time: "1w ago", category: "EV" },
  { title: "Telematics Integration with CMMS Becomes Mandatory by Dec 2026", source: "Fleet Maintenance", date: "Jan 3, 2026", time: "1w ago", category: "Regulation" },
  
  // December 2025
  { title: "34% of Current ELD Systems Require Hardware Upgrades for 2026 Compliance", source: "Fleet Equipment", date: "Dec 28, 2025", time: "2w ago", category: "Compliance" },
  { title: "Geotab Completes Acquisition of Verizon Connect International Operations", source: "Reuters", date: "Dec 20, 2025", time: "3w ago", category: "M&A" },
  { title: "Connected Vehicle Data Marketplace Launches for Fleet Operators", source: "VentureBeat", date: "Dec 18, 2025", time: "3w ago", category: "Innovation" },
  { title: "Telematics Providers Implement AES-256 Encryption Standards", source: "Cybersecurity Magazine", date: "Dec 15, 2025", time: "4w ago", category: "Security" },
  { title: "Last-Mile Delivery Fleets Drive 52% of Telematics Growth", source: "Supply Chain Dive", date: "Dec 12, 2025", time: "1mo ago", category: "Logistics" },
  
  // November 2025
  { title: "GPS Logging Requirements Expand to 60-Minute Intervals", source: "Fleet Management Weekly", date: "Nov 25, 2025", time: "1mo ago", category: "Regulation" },
  { title: "Verizon Connect Partners with Verra Mobility for Managed Services", source: "Verra Mobility", date: "Nov 20, 2025", time: "2mo ago", category: "Partnership" },
  { title: "Two-Factor Authentication Becomes Standard in Fleet Management Platforms", source: "Tech Fleet", date: "Nov 15, 2025", time: "2mo ago", category: "Security" },
  { title: "Construction Telematics Adoption Reaches 45% Industry-Wide", source: "Construction Dive", date: "Nov 10, 2025", time: "2mo ago", category: "Industry" },
  { title: "Real-Time Data Transmission Within 15 Minutes Now Required", source: "Fleet Technology", date: "Nov 5, 2025", time: "2mo ago", category: "Technology" },
  
  // October 2025
  { title: "Geotab Acquires Verizon Connect Operations in 9 International Markets", source: "Geotab Press Release", date: "Oct 28, 2025", time: "2mo ago", category: "M&A" },
  { title: "Open API Standards Drive 78% Increase in Platform Integrations", source: "API World", date: "Oct 22, 2025", time: "3mo ago", category: "Integration" },
  { title: "Insurance Companies Report 28% Reduction in Claims with Telematics", source: "Insurance Journal", date: "Oct 15, 2025", time: "3mo ago", category: "Insurance" },
  { title: "Automated Malfunction Detection Reduces Compliance Violations by 60%", source: "Fleet Compliance", date: "Oct 8, 2025", time: "3mo ago", category: "Compliance" },
  { title: "Fleet Management Platform Market Expected to Consolidate in 2026", source: "Gartner", date: "Oct 1, 2025", time: "3mo ago", category: "Market" },
  
  // September 2025
  { title: "Video Telematics Fastest Growing Sector in Commercial Fleet Technology", source: "Commercial Vehicle Technology", date: "Sep 25, 2025", time: "3mo ago", category: "Technology" },
  { title: "Condition-Based Maintenance Replaces Calendar-Based Servicing", source: "Maintenance Technology", date: "Sep 18, 2025", time: "4mo ago", category: "Maintenance" },
  { title: "FMCSA Removes Six Non-Compliant ELDs from Registered List", source: "FMCSA News", date: "Sep 12, 2025", time: "4mo ago", category: "Regulation" },
  { title: "Route Optimization AI Reduces Fuel Costs by 18% Industry-Wide", source: "Green Fleet Magazine", date: "Sep 5, 2025", time: "4mo ago", category: "AI" },
  
  // August 2025
  { title: "Standardized APIs Enable Seamless Fleet Management Integration", source: "API Standards", date: "Aug 28, 2025", time: "4mo ago", category: "Integration" },
  { title: "Driver Behavior Monitoring Reduces Insurance Premiums by 22%", source: "Risk Management", date: "Aug 20, 2025", time: "5mo ago", category: "Insurance" },
  { title: "Telematics Data Analytics Market Grows 43% Year-over-Year", source: "Analytics Today", date: "Aug 15, 2025", time: "5mo ago", category: "Analytics" },
  { title: "Edge Computing Enables Instant Fleet Decision Making", source: "Edge Computing World", date: "Aug 8, 2025", time: "5mo ago", category: "Technology" },
  { title: "Small and Mid-Sized Fleets Adopt Telematics at Record Pace", source: "SMB Fleet", date: "Aug 1, 2025", time: "5mo ago", category: "SMB" },
  
  // July 2025
  { title: "Tire Pressure Monitoring Integration Reduces Maintenance Costs 30%", source: "Fleet Maintenance Pro", date: "Jul 25, 2025", time: "5mo ago", category: "Maintenance" },
  { title: "Connected Dashcams Become Standard in Trucking Industry", source: "Trucking News", date: "Jul 18, 2025", time: "6mo ago", category: "Safety" },
  { title: "Telematics Helps Fleets Achieve 25% Reduction in Carbon Emissions", source: "Sustainability Fleet", date: "Jul 12, 2025", time: "6mo ago", category: "Sustainability" },
  { title: "FMCSA Announces June 2025 Proposed ELD Rulemaking", source: "FMCSA", date: "Jul 8, 2025", time: "6mo ago", category: "Regulation" },
  
  // June 2025
  { title: "Asset Tracking Solutions Expand Beyond Vehicle Fleets", source: "Asset Management Today", date: "Jun 28, 2025", time: "6mo ago", category: "Asset Tracking" },
  { title: "Telematics Industry Revenues Exceed $8.5B in 2025", source: "Industry Analysis", date: "Jun 20, 2025", time: "7mo ago", category: "Market" },
  { title: "Automated Hours of Service Compliance Reduces Violations 72%", source: "DOT Compliance", date: "Jun 15, 2025", time: "7mo ago", category: "Compliance" },
  { title: "Cold Chain Monitoring via Telematics Saves Food Industry $2.3B", source: "Food Logistics", date: "Jun 8, 2025", time: "7mo ago", category: "Industry" },
  { title: "GPS Fleet Tracking Market Reaches Maturity Phase", source: "Berg Insight", date: "Jun 1, 2025", time: "7mo ago", category: "Market" },
  
  // May 2025
  { title: "Real-Time Engine Diagnostics Prevent 89% of Major Breakdowns", source: "Fleet Technology News", date: "May 25, 2025", time: "7mo ago", category: "Technology" },
  { title: "Telematics-Enabled Driver Scorecards Improve Safety Metrics 38%", source: "Safety Management", date: "May 18, 2025", time: "8mo ago", category: "Safety" },
  { title: "Fuel Management Systems Integrated with Telematics Save 15% on Costs", source: "Fuel Economy Report", date: "May 12, 2025", time: "8mo ago", category: "Fuel" },
  { title: "Verizon Connect Marketplace Expands with 200+ Integration Partners", source: "Verizon Connect", date: "May 5, 2025", time: "8mo ago", category: "Partnership" },
  
  // April 2025
  { title: "Telematics Adoption in Energy & Utilities Sector Jumps 55%", source: "Utility Fleet", date: "Apr 28, 2025", time: "8mo ago", category: "Industry" },
  { title: "Mobile Fleet Management Apps Reach 5M Daily Active Users", source: "Mobile Enterprise", date: "Apr 20, 2025", time: "9mo ago", category: "Mobile" },
  { title: "Geotab Announces Small-to-Mid Fleet Focus Following Acquisition", source: "Geotab News", date: "Apr 15, 2025", time: "9mo ago", category: "Strategy" },
  { title: "Tamper-Evident Data Structures Prevent 98% of ELD Fraud", source: "Compliance Today", date: "Apr 8, 2025", time: "9mo ago", category: "Compliance" },
  { title: "Fleet Electrification Drives Demand for Specialized Telematics", source: "Electric Fleet", date: "Apr 1, 2025", time: "9mo ago", category: "EV" },
  
  // March 2025
  { title: "Verra Mobility and Verizon Connect Partnership Announced", source: "Verra Mobility", date: "Mar 25, 2025", time: "9mo ago", category: "Partnership" },
  { title: "Telematics Data Privacy Regulations Tighten Across EU", source: "European Transport", date: "Mar 18, 2025", time: "10mo ago", category: "Privacy" },
  { title: "Connected Trailers Market Expected to Double by 2027", source: "Trailer Technology", date: "Mar 12, 2025", time: "10mo ago", category: "Asset Tracking" },
  { title: "OEM-Embedded Telematics Gain Ground Against Aftermarket Solutions", source: "Automotive News", date: "Mar 5, 2025", time: "10mo ago", category: "OEM" },
  
  // February 2025
  { title: "Brake Monitoring Systems Prevent 10,000+ Accidents in 2024", source: "Fleet Safety", date: "Feb 28, 2025", time: "10mo ago", category: "Safety" },
  { title: "Telematics Helps Reduce Idling Time by 40% Across Industry", source: "Environmental Fleet", date: "Feb 20, 2025", time: "11mo ago", category: "Environment" },
  { title: "Cloud-Based Fleet Management Platforms Reach 85% Market Share", source: "Cloud Computing", date: "Feb 15, 2025", time: "11mo ago", category: "Cloud" },
  { title: "Pre-2000 Engine Exemption Remains in ELD Mandate Revision", source: "FMCSA Update", date: "Feb 8, 2025", time: "11mo ago", category: "Regulation" },
  { title: "Telematics Integration Reduces Administrative Time 50% for Fleet Managers", source: "Fleet Management Review", date: "Feb 1, 2025", time: "11mo ago", category: "Efficiency" },
  
  // January 2025
  { title: "FMCSA Removes Six ELDs Including BLUE STAR and ROAD STAR from Compliance List", source: "FMCSA", date: "Jan 8, 2025", time: "1y ago", category: "Regulation" },
  { title: "Telematics Industry Prepares for 2026 Technical Requirements Overhaul", source: "Fleet Tech News", date: "Jan 3, 2025", time: "1y ago", category: "Industry" },
]

export function NewsPage({ ticker }: NewsPageProps) {
  return (
    <div className="space-y-4">
      {/* News Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Newspaper className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-semibold text-black">Telematics Industry News</h2>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <TrendingUp className="w-4 h-4" />
            <span>Updated 1 hour ago</span>
          </div>
        </div>

        <p className="text-sm text-gray-600">
          Latest news, trends, regulations, and developments across the global telematics and fleet management industry. 
          Coverage includes major players (Samsara, Geotab, Verizon Connect, Trimble), technology innovations, regulatory changes, 
          market analysis, and industry trends affecting fleet operators worldwide.
        </p>
      </div>

      {/* News Articles - Scrollable */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 h-[600px]">
        <div className="h-full overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-blue-500 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:bg-blue-600">
          <div className="space-y-4">
            {newsArticles.map((article, idx) => (
              <div key={idx} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs font-semibold rounded border border-blue-200">
                        {article.category}
                      </span>
                      <span className="text-xs text-gray-500">{article.time}</span>
                    </div>
                    <h3 className="text-base font-semibold text-gray-900 mb-2 hover:text-blue-600 cursor-pointer">
                      {article.title}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-gray-600">
                      <span className="font-medium text-gray-900">{article.source}</span>
                      <span>•</span>
                      <span>{article.date}</span>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-400 hover:text-blue-600 cursor-pointer flex-shrink-0 mt-1" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
