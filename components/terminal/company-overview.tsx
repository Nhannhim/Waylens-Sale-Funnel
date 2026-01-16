"use client"

import { Target, TrendingUp, Building2, Truck, Radio, Info } from "lucide-react"
import { 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer
} from "recharts"

interface CompanyOverviewProps {
  ticker: string
}

// Global telematic market data
const globalTelematicsMarket = {
  totalVehicles: "450M",
  connectedVehicles: "126M",
  penetrationRate: "28%",
  cagr: "15.8%",
}

// US telematic market data
const usTelematicsMarket = {
  totalVehicles: "338M",
  connectedVehicles: "94.6M",
  penetrationRate: "28%",
  marketSize: "125M",
  activeFleets: "94M",
}

// US Market verticals
const usVerticals = [
  { vertical: 'Transportation & Logistics', fleets: 30080000, vehicles: 108000000, percentage: 32 },
  { vertical: 'Construction', fleets: 20680000, vehicles: 74000000, percentage: 22 },
  { vertical: 'Field Services', fleets: 16920000, vehicles: 61000000, percentage: 18 },
  { vertical: 'Food & Beverage', fleets: 11280000, vehicles: 41000000, percentage: 12 },
  { vertical: 'Energy & Utilities', fleets: 7520000, vehicles: 27000000, percentage: 8 },
  { vertical: 'Manufacturing', fleets: 4700000, vehicles: 17000000, percentage: 5 },
  { vertical: 'Other', fleets: 2820000, vehicles: 10000000, percentage: 3 },
]

// Vehicle types in US market
const usVehicleTypes = [
  { type: 'Class 8 Heavy Trucks', count: 11400000, percentage: 34 },
  { type: 'Light Commercial Vans', count: 9600000, percentage: 28 },
  { type: 'Medium-Duty Trucks', count: 6400000, percentage: 19 },
  { type: 'Box Trucks', count: 5100000, percentage: 15 },
  { type: 'Construction Equipment', count: 4000000, percentage: 12 },
  { type: 'Refrigerated Trucks', count: 2600000, percentage: 8 },
  { type: 'Pickup Trucks', count: 3200000, percentage: 9 },
  { type: 'Specialized Vehicles', count: 1700000, percentage: 5 },
]

// Fleet size distribution in US
const usFleetSizes = [
  { size: '1-9 vehicles', fleets: 69560000, percentage: 74 },
  { size: '10-49 vehicles', fleets: 17860000, percentage: 19 },
  { size: '50-199 vehicles', fleets: 4700000, percentage: 5 },
  { size: '200-999 vehicles', fleets: 1880000, percentage: 2 },
  { size: '1000+ vehicles', fleets: 376000, percentage: 0.4 },
]

// Regional breakdown within US
const usRegionalBreakdown = [
  { region: 'West', fleets: 28200000, percentage: 30 },
  { region: 'South', fleets: 26320000, percentage: 28 },
  { region: 'Midwest', fleets: 23500000, percentage: 25 },
  { region: 'Northeast', fleets: 15980000, percentage: 17 },
]

const BLUE_SHADES = ['#1e3a8a', '#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#dbeafe', '#eff6ff']

export function CompanyOverview({ ticker }: CompanyOverviewProps) {
  return (
    <div className="space-y-4">
      {/* Global Telematic Market Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Radio className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-semibold text-black">Global Telematics Market</h2>
        </div>
        
        <p className="text-sm text-gray-700 leading-relaxed mb-6">
          The global telematics market encompasses vehicle tracking, fleet management, and connected operations solutions. 
          With over <strong>450 million</strong> commercial vehicles worldwide, the market is experiencing rapid digitization driven by regulatory 
          requirements, operational efficiency demands, and IoT technology advancement. The market has achieved <strong>28%</strong> penetration 
          with <strong>126 million</strong> connected vehicles globally, growing at a <strong>15.8%</strong> CAGR as businesses increasingly adopt real-time 
          monitoring, predictive maintenance, and data-driven decision making capabilities.
        </p>

        {/* Global Market Stats */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4 text-center">
            <div className="text-xs font-semibold text-blue-900 mb-1">GLOBAL VEHICLES</div>
            <div className="text-3xl font-bold text-blue-900">{globalTelematicsMarket.totalVehicles}</div>
            <div className="text-xs text-blue-700 mt-1">Commercial Fleet</div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4 text-center">
            <div className="text-xs font-semibold text-blue-900 mb-1">CONNECTED</div>
            <div className="text-3xl font-bold text-blue-900">{globalTelematicsMarket.connectedVehicles}</div>
            <div className="text-xs text-blue-700 mt-1">With Telematics</div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4 text-center">
            <div className="text-xs font-semibold text-blue-900 mb-1">PENETRATION</div>
            <div className="text-3xl font-bold text-blue-900">{globalTelematicsMarket.penetrationRate}</div>
            <div className="text-xs text-blue-700 mt-1">Market Coverage</div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4 text-center">
            <div className="text-xs font-semibold text-blue-900 mb-1">GROWTH (CAGR)</div>
            <div className="text-3xl font-bold text-blue-900">{globalTelematicsMarket.cagr}</div>
            <div className="text-xs text-blue-700 mt-1">Annual Growth</div>
          </div>
        </div>
      </div>

      {/* US Telematic Market Focus */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-semibold text-black">US Telematics Market</h2>
        </div>

        <p className="text-sm text-gray-700 leading-relaxed mb-6">
          The United States represents the largest and most mature telematics market globally, accounting for 75% of the 
          addressable market. With <strong>338 million</strong> commercial vehicles and <strong>94 million</strong> fleet operators, the US market demonstrates 
          strong adoption of fleet management technologies driven by ELD mandates, insurance requirements, and operational 
          efficiency initiatives. The market is characterized by diverse verticals from transportation and logistics to 
          construction and field services, each with unique telematics requirements and adoption patterns.
        </p>

        {/* US Market Overview Stats */}
        <div className="grid grid-cols-5 gap-4 mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <div className="text-xs font-semibold text-gray-700 mb-1">Total Vehicles</div>
            <div className="text-2xl font-bold text-blue-900">{usTelematicsMarket.totalVehicles}</div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <div className="text-xs font-semibold text-gray-700 mb-1">Connected</div>
            <div className="text-2xl font-bold text-blue-900">{usTelematicsMarket.connectedVehicles}</div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <div className="text-xs font-semibold text-gray-700 mb-1">Fleet Operators</div>
            <div className="text-2xl font-bold text-blue-900">{usTelematicsMarket.activeFleets}M</div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <div className="text-xs font-semibold text-gray-700 mb-1">Penetration</div>
            <div className="text-2xl font-bold text-blue-900">{usTelematicsMarket.penetrationRate}</div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <div className="text-xs font-semibold text-gray-700 mb-1">TAM (Fleets)</div>
            <div className="text-2xl font-bold text-blue-900">{usTelematicsMarket.marketSize}M</div>
          </div>
        </div>

        {/* US Market Verticals in Small Boxes */}
        <div>
          <h3 className="text-lg font-semibold text-black mb-4">US Market Verticals</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {usVerticals.map((vertical, idx) => (
              <div key={idx} className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                <div className="text-xs font-semibold text-gray-600 mb-2">{vertical.vertical}</div>
                <div className="text-2xl font-bold text-blue-900 mb-1">{(vertical.fleets / 1000000).toFixed(1)}M</div>
                <div className="text-xs text-gray-600">Fleets</div>
                <div className="mt-2 pt-2 border-t border-gray-200">
                  <div className="text-sm font-semibold text-gray-900">{(vertical.vehicles / 1000000).toFixed(1)}M</div>
                  <div className="text-xs text-gray-600">Vehicles</div>
                </div>
                <div className="mt-2">
                  <div className="text-xs font-bold text-blue-700">{vertical.percentage}% of market</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* US Vehicle Types Distribution */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-black mb-6">US Vehicle Type Distribution</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pie Chart */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h4 className="text-sm font-semibold text-gray-900 mb-4 text-center">Vehicle Mix by Type</h4>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={usVehicleTypes.slice(0, 8)}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ percentage }) => `${percentage}%`}
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="percentage"
                >
                  {usVehicleTypes.slice(0, 8).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={BLUE_SHADES[index]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name, props) => [`${(props.payload.count / 1000000).toFixed(1)}M vehicles`, props.payload.type]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h4 className="text-sm font-semibold text-gray-900 mb-4 text-center">Vehicles by Type (Millions)</h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={usVehicleTypes.slice(0, 8)} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis type="number" />
                <YAxis dataKey="type" type="category" width={140} style={{ fontSize: '10px' }} />
                <Tooltip formatter={(value) => [`${(value / 1000000).toFixed(1)}M vehicles`]} />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {usVehicleTypes.slice(0, 8).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={BLUE_SHADES[index]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* US Vertical Breakdown Charts */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-black mb-6">US Market by Vertical</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pie Chart */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h4 className="text-sm font-semibold text-gray-900 mb-4 text-center">Fleet Distribution by Vertical</h4>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={usVerticals}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ percentage }) => `${percentage}%`}
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="percentage"
                >
                  {usVerticals.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={BLUE_SHADES[index]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name, props) => [`${(props.payload.fleets / 1000000).toFixed(1)}M fleets`, props.payload.vertical]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h4 className="text-sm font-semibold text-gray-900 mb-4 text-center">Fleets by Vertical (Millions)</h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={usVerticals}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="vertical" style={{ fontSize: '10px' }} angle={-20} textAnchor="end" height={90} />
                <YAxis />
                <Tooltip formatter={(value) => [`${(value / 1000000).toFixed(1)}M fleets`]} />
                <Bar dataKey="fleets" radius={[4, 4, 0, 0]}>
                  {usVerticals.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={BLUE_SHADES[index]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* US Fleet Size Distribution */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-black mb-6">US Fleet Size Distribution</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pie Chart */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h4 className="text-sm font-semibold text-gray-900 mb-4 text-center">Fleets by Size Category</h4>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={usFleetSizes}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ size, percentage }) => `${size}: ${percentage}%`}
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="percentage"
                >
                  {usFleetSizes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={BLUE_SHADES[index]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name, props) => [`${(props.payload.fleets / 1000000).toFixed(1)}M fleets`, props.payload.size]} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h4 className="text-sm font-semibold text-gray-900 mb-4 text-center">Fleet Count by Size (Millions)</h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={usFleetSizes}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="size" style={{ fontSize: '10px' }} angle={-15} textAnchor="end" height={70} />
                <YAxis />
                <Tooltip formatter={(value) => [`${(value / 1000000).toFixed(1)}M fleets`]} />
                <Bar dataKey="fleets" radius={[4, 4, 0, 0]}>
                  {usFleetSizes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={BLUE_SHADES[index]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* US Regional Distribution */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-black mb-6">US Regional Distribution</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pie Chart */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h4 className="text-sm font-semibold text-gray-900 mb-4 text-center">Fleet Distribution by US Region</h4>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={usRegionalBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ region, percentage }) => `${region}: ${percentage}%`}
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="percentage"
                >
                  {usRegionalBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={BLUE_SHADES[index]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name, props) => [`${(props.payload.fleets / 1000000).toFixed(1)}M fleets`, props.payload.region]} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h4 className="text-sm font-semibold text-gray-900 mb-4 text-center">Fleets by US Region (Millions)</h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={usRegionalBreakdown}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="region" style={{ fontSize: '11px' }} />
                <YAxis />
                <Tooltip formatter={(value) => [`${(value / 1000000).toFixed(1)}M fleets`]} />
                <Bar dataKey="fleets" radius={[4, 4, 0, 0]}>
                  {usRegionalBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={BLUE_SHADES[index]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Detailed US Market Table */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-black mb-6">US Market Vertical Breakdown</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-gray-300 bg-blue-50">
                <th className="text-left py-3 px-4 text-gray-900 font-semibold">Vertical</th>
                <th className="text-right py-3 px-4 text-gray-900 font-semibold">Total Fleets</th>
                <th className="text-right py-3 px-4 text-gray-900 font-semibold">Total Vehicles</th>
                <th className="text-right py-3 px-4 text-gray-900 font-semibold">Avg Fleet Size</th>
                <th className="text-right py-3 px-4 text-gray-900 font-semibold">% of Market</th>
              </tr>
            </thead>
            <tbody>
              {usVerticals.map((vertical, idx) => (
                <tr key={idx} className="border-b border-gray-100 hover:bg-blue-50">
                  <td className="py-3 px-4 font-medium text-gray-900">{vertical.vertical}</td>
                  <td className="text-right py-3 px-4 text-gray-900">{(vertical.fleets / 1000000).toFixed(1)}M</td>
                  <td className="text-right py-3 px-4 text-gray-900">{(vertical.vehicles / 1000000).toFixed(1)}M</td>
                  <td className="text-right py-3 px-4 text-gray-900">{(vertical.vehicles / vertical.fleets).toFixed(1)} vehicles</td>
                  <td className="text-right py-3 px-4 font-semibold text-blue-900">{vertical.percentage}%</td>
                </tr>
              ))}
              <tr className="border-t-2 border-gray-300 bg-blue-50 font-semibold">
                <td className="py-3 px-4 text-gray-900">Total</td>
                <td className="text-right py-3 px-4 text-gray-900">94.0M</td>
                <td className="text-right py-3 px-4 text-gray-900">338M</td>
                <td className="text-right py-3 px-4 text-gray-900">3.6 vehicles</td>
                <td className="text-right py-3 px-4 text-blue-900">100%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Current Market Position */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-black mb-6">Samsara's Current Position in US Market</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-3">
              <Building2 className="w-5 h-5 text-blue-700" />
              <h4 className="text-sm font-semibold text-gray-900">Active Customers</h4>
            </div>
            <div className="text-3xl font-bold text-blue-900 mb-2">18,500</div>
            <div className="text-xs text-gray-600">Fleet Operators</div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-3">
              <Truck className="w-5 h-5 text-blue-700" />
              <h4 className="text-sm font-semibold text-gray-900">Connected Vehicles</h4>
            </div>
            <div className="text-3xl font-bold text-blue-900 mb-2">850K</div>
            <div className="text-xs text-gray-600">Actively Monitored</div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-3">
              <Target className="w-5 h-5 text-blue-700" />
              <h4 className="text-sm font-semibold text-gray-900">Market Share</h4>
            </div>
            <div className="text-3xl font-bold text-blue-900 mb-2">0.90%</div>
            <div className="text-xs text-gray-600">Of US Market</div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-3">
              <TrendingUp className="w-5 h-5 text-blue-700" />
              <h4 className="text-sm font-semibold text-gray-900">Growth Rate</h4>
            </div>
            <div className="text-3xl font-bold text-blue-900 mb-2">+35%</div>
            <div className="text-xs text-gray-600">Year-over-Year</div>
          </div>
        </div>
      </div>

      {/* Data Sources & References */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-300 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Info className="w-5 h-5 text-gray-700" />
          <h3 className="text-lg font-semibold text-gray-900">Data Sources & Methodology</h3>
        </div>
        
        <div className="space-y-3">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="text-sm font-bold text-gray-900 mb-2">Primary Research Source</div>
            <div className="text-sm text-gray-700 leading-relaxed">
              <strong>Waylens Market Research Database</strong> — Comprehensive fleet telematics market analysis compiled from 690 proprietary CSV data files 
              covering fleet operators, competitive intelligence, customer references, and market statistics. 
              Data collected and validated Q4 2023 through Q2 2024.
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-white border border-gray-200 rounded-lg p-3">
              <div className="text-xs font-bold text-gray-900 mb-2">External Data Sources:</div>
              <ul className="text-xs text-gray-700 space-y-1">
                <li>• OICA Global Vehicle Database (2024)</li>
                <li>• US DOT Federal Highway Administration</li>
                <li>• IoT Analytics Market Research Reports</li>
                <li>• US Census Bureau Business Statistics</li>
                <li>• Markets and Markets Industry Reports</li>
              </ul>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-3">
              <div className="text-xs font-bold text-gray-900 mb-2">Internal Analysis:</div>
              <ul className="text-xs text-gray-700 space-y-1">
                <li>• 419 High Priority Dataset Files</li>
                <li>• Fleet Management Vendor Analysis</li>
                <li>• Growth Metrics & Financial Comparisons</li>
                <li>• Vertical Market Segmentation Studies</li>
                <li>• Customer Reference & Deployment Data</li>
              </ul>
            </div>
          </div>
          
          <div className="p-3 bg-blue-50 border border-blue-200 rounded text-xs text-gray-700">
            <strong>Data Location:</strong> All supporting datasets are located in <code className="bg-gray-200 px-1.5 py-0.5 rounded font-mono">waylens_filtered_data/high_priority/</code> and 
            <code className="bg-gray-200 px-1.5 py-0.5 rounded font-mono ml-1">medium_priority/</code> directories. 
            Key files include: <code className="bg-gray-200 px-1.5 py-0.5 rounded font-mono">07_us_fleet_by_gwv.csv</code>, 
            <code className="bg-gray-200 px-1.5 py-0.5 rounded font-mono">02_fleet_management_vendors.csv</code>, and 
            <code className="bg-gray-200 px-1.5 py-0.5 rounded font-mono">62_growth_metrics_comparison.csv</code>.
          </div>
        </div>
      </div>
    </div>
  )
}
