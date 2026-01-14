"use client"

import { Shield, TrendingUp, Users, DollarSign, Radio, BarChart3, FileText, Newspaper, ExternalLink } from "lucide-react"
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
  ResponsiveContainer,
  LineChart,
  Line
} from "recharts"

interface InsurtechPageProps {
  ticker?: string
}

// Insurtech market data
const insurtechMarket = {
  totalMarket: "$15.2B",
  telematicsSegment: "$4.8B",
  ubi_penetration: "32%",
  growthRate: "28.5%",
}

// Usage-based insurance adoption
const ubiAdoption = [
  { year: '2020', adoption: 12 },
  { year: '2021', adoption: 18 },
  { year: '2022', adoption: 24 },
  { year: '2023', adoption: 29 },
  { year: '2024', adoption: 32 },
  { year: '2025', adoption: 38 },
]

// Telematics data usage by insurers
const telematicsDataUsage = [
  { application: 'Risk Scoring', percentage: 45 },
  { application: 'Premium Pricing', percentage: 38 },
  { application: 'Claims Processing', percentage: 28 },
  { application: 'Fraud Detection', percentage: 22 },
  { application: 'Driver Coaching', percentage: 18 },
]

// Insurance savings with telematics
const insuranceSavings = [
  { category: 'Safe Drivers', savings: 30 },
  { category: 'Low Mileage', savings: 25 },
  { category: 'Good Behavior', savings: 20 },
  { category: 'Fleet Discount', savings: 35 },
]

// Market players
const insurtechPlayers = [
  { name: "Cambridge Mobile Telematics", marketShare: 28, vehicles: "45M" },
  { name: "Arity (Allstate)", marketShare: 22, vehicles: "35M" },
  { name: "Octo Telematics", marketShare: 18, vehicles: "28M" },
  { name: "Zendrive", marketShare: 12, vehicles: "19M" },
  { name: "TrueMotion", marketShare: 8, vehicles: "13M" },
  { name: "Others", marketShare: 12, vehicles: "19M" },
]

const BLUE_SHADES = ['#1e3a8a', '#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe']

const insurtechCompanies = [
  "Cambridge Mobile Telematics",
  "Arity (Allstate)",
  "Octo Telematics",
  "Zendrive",
  "TrueMotion",
  "Lemonade Inc",
  "Root Insurance",
  "Metromile",
  "The Zebra",
  "CoverHound",
]

const brokerageResearch = [
  { firm: "Morgan Stanley", title: "Insurtech Telematics Market: Initiating Coverage - Strong Growth Ahead", date: "Jan 12, 2026" },
  { firm: "Goldman Sachs", title: "Usage-Based Insurance Adoption Accelerating - Buy Rating", date: "Jan 10, 2026" },
  { firm: "JP Morgan", title: "Cambridge Mobile Telematics: Market Leader in Insurance Analytics", date: "Jan 8, 2026" },
  { firm: "Bank of America", title: "Telematics Data Driving Insurance Innovation - Sector Outperform", date: "Jan 5, 2026" },
]

const insurtechNews = [
  { title: "Telematics-Based Insurance Policies Reach 32% Market Penetration", source: "Insurance Journal", date: "Jan 12, 2026", time: "3h ago" },
  { title: "Cambridge Mobile Telematics Expands to 45M Connected Vehicles", source: "InsurTech Insights", date: "Jan 11, 2026", time: "1d ago" },
  { title: "Arity Partners with Major Auto Insurers for UBI Programs", source: "Reuters", date: "Jan 9, 2026", time: "3d ago" },
  { title: "Pay-Per-Mile Insurance Saves Drivers Up to 40% on Premiums", source: "Forbes", date: "Jan 7, 2026", time: "5d ago" },
]

export function InsurtechPage({ ticker }: InsurtechPageProps) {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-semibold text-black">Insurtech & Telematics Integration</h2>
        </div>
        
        <p className="text-sm text-gray-700 leading-relaxed mb-6">
          The insurtech sector is rapidly adopting telematics technology to revolutionize auto insurance through 
          usage-based insurance (UBI), behavioral risk scoring, and real-time claims processing. With over 159 million 
          connected vehicles globally providing insurance data, telematics enables personalized premiums, fraud detection, 
          and improved driver safety. The market is experiencing 28.5% annual growth as insurers shift from traditional 
          demographic-based pricing to behavior and usage-based models.
        </p>

        {/* Key Metrics */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <div className="text-xs font-semibold text-gray-700 mb-1">Insurtech Market</div>
            <div className="text-3xl font-bold text-blue-900">{insurtechMarket.totalMarket}</div>
            <div className="text-xs text-gray-600 mt-1">Total Market Size</div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <div className="text-xs font-semibold text-gray-700 mb-1">Telematics Segment</div>
            <div className="text-3xl font-bold text-blue-900">{insurtechMarket.telematicsSegment}</div>
            <div className="text-xs text-gray-600 mt-1">With Telematics</div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <div className="text-xs font-semibold text-gray-700 mb-1">UBI Penetration</div>
            <div className="text-3xl font-bold text-blue-900">{insurtechMarket.ubi_penetration}</div>
            <div className="text-xs text-gray-600 mt-1">Usage-Based Insurance</div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <div className="text-xs font-semibold text-gray-700 mb-1">Growth (CAGR)</div>
            <div className="text-3xl font-bold text-blue-900">{insurtechMarket.growthRate}</div>
            <div className="text-xs text-gray-600 mt-1">Annual Growth</div>
          </div>
        </div>
      </div>

      {/* Latest Documents - Brokerage Research & News */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-black mb-6">Latest Documents & News</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Brokerage Research */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-yellow-600" />
                <h4 className="text-sm font-semibold text-black">Brokerage Research</h4>
              </div>
              <button className="text-xs text-blue-600 hover:underline">View All →</button>
            </div>
            <div className="space-y-3">
              {brokerageResearch.map((doc, idx) => (
                <div key={idx} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                  <div className="flex items-start gap-3">
                    <div className="min-w-[90px]">
                      <span className="text-xs font-semibold text-gray-900 bg-yellow-50 px-2 py-1 rounded border border-yellow-200">
                        {doc.firm}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-900 mb-1 hover:text-blue-600 cursor-pointer line-clamp-2 font-medium">
                        {doc.title}
                      </p>
                      <span className="text-xs text-gray-500">{doc.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Latest News */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Newspaper className="w-4 h-4 text-blue-600" />
                <h4 className="text-sm font-semibold text-black">Latest News</h4>
              </div>
              <button className="text-xs text-blue-600 hover:underline">View All →</button>
            </div>
            <div className="space-y-3">
              {insurtechNews.map((news, idx) => (
                <div key={idx} className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h5 className="text-xs font-medium text-gray-900 mb-1 hover:text-blue-600 cursor-pointer line-clamp-2">
                        {news.title}
                      </h5>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <span className="font-medium">{news.source}</span>
                        <span>•</span>
                        <span>{news.time}</span>
                      </div>
                    </div>
                    <ExternalLink className="w-3 h-3 text-gray-400 hover:text-blue-600 cursor-pointer flex-shrink-0 mt-1" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* UBI Adoption Trend */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-black mb-6">Usage-Based Insurance (UBI) Adoption Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={ubiAdoption}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="year" />
            <YAxis label={{ value: 'Adoption Rate (%)', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Line type="monotone" dataKey="adoption" stroke="#3B82F6" strokeWidth={3} dot={{ r: 5, fill: '#3B82F6' }} name="UBI Adoption (%)" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Telematics Data Applications */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-black mb-6">How Insurers Use Telematics Data</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Bar Chart */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h4 className="text-sm font-semibold text-gray-900 mb-4 text-center">Application Usage (%)</h4>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={telematicsDataUsage} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis type="number" />
                <YAxis dataKey="application" type="category" width={120} style={{ fontSize: '11px' }} />
                <Tooltip />
                <Bar dataKey="percentage" radius={[0, 4, 4, 0]}>
                  {telematicsDataUsage.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={BLUE_SHADES[index]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* List View */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Key Applications</h4>
            {telematicsDataUsage.map((item, idx) => (
              <div key={idx} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-900">{item.application}</span>
                  <span className="text-lg font-bold text-blue-900">{item.percentage}%</span>
                </div>
                <div className="text-xs text-gray-600">
                  {item.application === 'Risk Scoring' && 'Analyzing driving patterns to assess accident probability'}
                  {item.application === 'Premium Pricing' && 'Setting personalized rates based on actual driving behavior'}
                  {item.application === 'Claims Processing' && 'Automated crash detection and claims verification'}
                  {item.application === 'Fraud Detection' && 'Identifying suspicious claims through data analysis'}
                  {item.application === 'Driver Coaching' && 'Providing feedback to improve driving habits'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Insurance Savings with Telematics */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-black mb-6">Average Insurance Savings with Telematics</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pie Chart */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h4 className="text-sm font-semibold text-gray-900 mb-4 text-center">Savings by Category</h4>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={insuranceSavings}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ category, savings }) => `${category}: ${savings}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="savings"
                >
                  {insuranceSavings.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={BLUE_SHADES[index]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Savings Cards */}
          <div className="space-y-3">
            {insuranceSavings.map((item, idx) => (
              <div key={idx} className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-gray-900 mb-1">{item.category}</div>
                    <div className="text-xs text-gray-600">
                      {item.category === 'Safe Drivers' && 'No accidents or violations in 12 months'}
                      {item.category === 'Low Mileage' && 'Under 10,000 miles annually'}
                      {item.category === 'Good Behavior' && 'Minimal hard braking and speeding'}
                      {item.category === 'Fleet Discount' && 'Commercial fleet policies with telematics'}
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-blue-900">{item.savings}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Market Leaders */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-black mb-6">Insurtech Telematics Market Leaders</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Market Share Pie */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h4 className="text-sm font-semibold text-gray-900 mb-4 text-center">Market Share Distribution</h4>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={insurtechPlayers}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, marketShare }) => `${marketShare}%`}
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="marketShare"
                >
                  {insurtechPlayers.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={BLUE_SHADES[index]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Company List */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Top Players</h4>
            {insurtechPlayers.map((player, idx) => (
              <div key={idx} className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: BLUE_SHADES[idx] }}></div>
                    <span className="text-sm font-semibold text-gray-900">{player.name}</span>
                  </div>
                  <span className="text-sm font-bold text-blue-900">{player.marketShare}%</span>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-600">
                  <div className="flex items-center gap-1">
                    <Radio className="w-3 h-3" />
                    <span>{player.vehicles} vehicles</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Key Benefits */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-black mb-6">Benefits of Telematics for Insurance</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <h4 className="font-semibold text-gray-900">For Insurers</h4>
            </div>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Accurate risk assessment using real driving data</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Reduced claims fraud through crash verification</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Lower loss ratios with better driver selection</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Faster claims processing with automated data</span>
              </li>
            </ul>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <h4 className="font-semibold text-gray-900">For Policyholders</h4>
            </div>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Lower premiums for safe driving (up to 35% savings)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Pay-per-mile options for low-usage vehicles</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Real-time feedback to improve driving habits</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Instant crash detection and emergency response</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Data Points Collected */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-black mb-6">Telematics Data Points for Insurance</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-blue-900 mb-1">Miles Driven</div>
            <div className="text-xs text-gray-600">Annual mileage tracking</div>
          </div>

          <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-blue-900 mb-1">Time of Day</div>
            <div className="text-xs text-gray-600">Night/rush hour analysis</div>
          </div>

          <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-blue-900 mb-1">Speed</div>
            <div className="text-xs text-gray-600">Speeding incidents</div>
          </div>

          <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-blue-900 mb-1">Braking</div>
            <div className="text-xs text-gray-600">Hard braking events</div>
          </div>

          <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-blue-900 mb-1">Acceleration</div>
            <div className="text-xs text-gray-600">Aggressive driving</div>
          </div>

          <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-blue-900 mb-1">Cornering</div>
            <div className="text-xs text-gray-600">Sharp turns</div>
          </div>

          <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-blue-900 mb-1">Phone Use</div>
            <div className="text-xs text-gray-600">Distracted driving</div>
          </div>

          <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-blue-900 mb-1">Location</div>
            <div className="text-xs text-gray-600">Route patterns</div>
          </div>
        </div>
      </div>

      {/* Market Trends */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-black mb-6">Key Market Trends</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5 text-blue-700" />
              <h4 className="font-semibold text-gray-900">Pay-Per-Mile Growth</h4>
            </div>
            <p className="text-sm text-gray-700 mb-2">
              Pay-per-mile insurance models growing 45% annually, appealing to low-mileage drivers and urban populations.
            </p>
            <div className="text-2xl font-bold text-blue-900">+45%</div>
          </div>

          <div className="p-5 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <BarChart3 className="w-5 h-5 text-blue-700" />
              <h4 className="font-semibold text-gray-900">Commercial Fleet Focus</h4>
            </div>
            <p className="text-sm text-gray-700 mb-2">
              Fleet insurance leveraging telematics for risk management, with 78% of commercial insurers now requiring it.
            </p>
            <div className="text-2xl font-bold text-blue-900">78%</div>
          </div>

          <div className="p-5 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <DollarSign className="w-5 h-5 text-blue-700" />
              <h4 className="font-semibold text-gray-900">Claims Cost Reduction</h4>
            </div>
            <p className="text-sm text-gray-700 mb-2">
              Insurers reducing claims costs by $3.2B annually through telematics-enabled fraud prevention and safety programs.
            </p>
            <div className="text-2xl font-bold text-blue-900">$3.2B</div>
          </div>
        </div>
      </div>
    </div>
  )
}
