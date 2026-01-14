"use client"

import { Building2, Users, TrendingUp, MapPin } from "lucide-react"

interface ClientsPageProps {
  ticker: string
}

const clientsData = {
  totalClients: "18,500",
  enterpriseClients: "2,400",
  midMarket: "8,100",
  smb: "8,000",
  retention: "98%",
  nps: "72",
}

const topClients = [
  { name: "DHL Supply Chain", industry: "Logistics", fleetSize: "45,000", region: "Global", since: "2019" },
  { name: "Sysco Corporation", industry: "Food Distribution", fleetSize: "38,000", region: "North America", since: "2020" },
  { name: "Crown Castle", industry: "Infrastructure", fleetSize: "22,000", region: "North America", since: "2021" },
  { name: "PG&E", industry: "Utilities", fleetSize: "18,500", region: "North America", since: "2020" },
  { name: "Edward Jones", industry: "Financial Services", fleetSize: "15,200", region: "North America", since: "2022" },
  { name: "Anheuser-Busch", industry: "Beverage", fleetSize: "12,800", region: "Global", since: "2021" },
  { name: "Republic Services", industry: "Waste Management", fleetSize: "11,500", region: "North America", since: "2022" },
  { name: "United Rentals", industry: "Equipment Rental", fleetSize: "9,800", region: "North America", since: "2023" },
]

const channelPartners = [
  { name: "AT&T", type: "Telecom", coverage: "National", customers: "2,500+" },
  { name: "Verizon Connect", type: "Telecom", coverage: "National", customers: "1,800+" },
  { name: "Element Fleet", type: "Fleet Management", coverage: "North America", customers: "1,200+" },
  { name: "Enterprise Fleet", type: "Fleet Services", coverage: "National", customers: "950+" },
]

export function ClientsPage({ ticker }: ClientsPageProps) {
  return (
    <div className="space-y-4">
      {/* Client Overview */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-6">
          <Building2 className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-semibold text-black">Client Portfolio</h2>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-6 gap-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <div className="text-xs font-semibold text-gray-700 mb-1">Total Clients</div>
            <div className="text-2xl font-bold text-blue-900">{clientsData.totalClients}</div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <div className="text-xs font-semibold text-gray-700 mb-1">Enterprise</div>
            <div className="text-2xl font-bold text-blue-900">{clientsData.enterpriseClients}</div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <div className="text-xs font-semibold text-gray-700 mb-1">Mid-Market</div>
            <div className="text-2xl font-bold text-blue-900">{clientsData.midMarket}</div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <div className="text-xs font-semibold text-gray-700 mb-1">SMB</div>
            <div className="text-2xl font-bold text-blue-900">{clientsData.smb}</div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <div className="text-xs font-semibold text-gray-700 mb-1">Retention Rate</div>
            <div className="text-2xl font-bold text-blue-900">{clientsData.retention}</div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <div className="text-xs font-semibold text-gray-700 mb-1">NPS Score</div>
            <div className="text-2xl font-bold text-blue-900">{clientsData.nps}</div>
          </div>
        </div>
      </div>

      {/* Top Enterprise Clients */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-black mb-6">Top Enterprise Clients</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-gray-300 bg-blue-50">
                <th className="text-left py-3 px-4 text-gray-900 font-semibold">Company</th>
                <th className="text-left py-3 px-4 text-gray-900 font-semibold">Industry</th>
                <th className="text-right py-3 px-4 text-gray-900 font-semibold">Fleet Size</th>
                <th className="text-center py-3 px-4 text-gray-900 font-semibold">Region</th>
                <th className="text-center py-3 px-4 text-gray-900 font-semibold">Customer Since</th>
              </tr>
            </thead>
            <tbody>
              {topClients.map((client, idx) => (
                <tr key={idx} className="border-b border-gray-100 hover:bg-blue-50">
                  <td className="py-3 px-4 font-semibold text-gray-900">{client.name}</td>
                  <td className="py-3 px-4 text-gray-700">{client.industry}</td>
                  <td className="text-right py-3 px-4 text-gray-900">{client.fleetSize}</td>
                  <td className="text-center py-3 px-4 text-gray-700">{client.region}</td>
                  <td className="text-center py-3 px-4 text-gray-700">{client.since}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Channel Partners */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-black mb-6">Channel Partners</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {channelPartners.map((partner, idx) => (
            <div key={idx} className="bg-blue-50 border border-blue-200 rounded-lg p-5 hover:border-blue-400 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="font-semibold text-lg text-blue-900 mb-1">{partner.name}</div>
                  <div className="text-xs text-gray-600">{partner.type}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-blue-700">{partner.customers}</div>
                  <div className="text-xs text-gray-600">Customers</div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-700">
                <MapPin className="w-3 h-3" />
                <span>{partner.coverage}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
