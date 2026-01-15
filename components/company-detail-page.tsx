'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCompanyData } from '@/lib/use-company-data';
import { CompanyData } from '@/lib/data-processor';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ArrowLeft,
  FileText,
  Search,
  ChevronDown,
  ChevronRight,
  MapPin,
  Calendar,
  Building2,
  ExternalLink,
  TrendingUp,
} from 'lucide-react';
import { Sidebar } from '@/components/terminal/sidebar';
import { CompanyCharts, ClientsSection } from '@/components/company-charts';

interface CompanyDetailPageProps {
  companyId: string;
}

interface CSVData {
  filename: string;
  topic: string;
  columns: string[];
  rows: Record<string, string>[];
  totalRows: number;
}

export function CompanyDetailPage({ companyId }: CompanyDetailPageProps) {
  const router = useRouter();
  const { dataset, loading } = useCompanyData();
  const [company, setCompany] = useState<CompanyData | null>(null);
  const [activeSection, setActiveSection] = useState("search");
  const [csvData, setCsvData] = useState<CSVData[]>([]);
  const [loadingCSV, setLoadingCSV] = useState(true);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [filterText, setFilterText] = useState('');

  useEffect(() => {
    if (dataset) {
      // Try to find by ID first
      let found = dataset.companies.find(c => c.id === companyId);
      
      // If not found by ID, try to find by name slug
      if (!found) {
        // Create a normalized version of the companyId for comparison
        const normalizedSlug = companyId.toLowerCase().replace(/-/g, ' ').trim();
        found = dataset.companies.find(c => 
          c.name.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim() === normalizedSlug ||
          c.name.toLowerCase().replace(/\s+/g, '-') === companyId.toLowerCase()
        );
      }
      
      setCompany(found || null);
    }
  }, [dataset, companyId]);

  // Fetch CSV data for this company (optional - won't fail if not available)
  useEffect(() => {
    if (!company) return;

    setLoadingCSV(true);
    fetch(`/api/company-data?company=${encodeURIComponent(company.name)}`)
      .then(res => {
        if (!res.ok) {
          // API doesn't exist or failed, just skip CSV data
          setLoadingCSV(false);
          return;
        }
        return res.json();
      })
      .then(data => {
        if (data && data.success && data.csvFiles) {
          setCsvData(data.csvFiles);
          // Auto-expand first 3 sections
          if (data.csvFiles.length > 0) {
            setExpandedSections(data.csvFiles.slice(0, 3).map((f: CSVData) => f.filename));
          }
        }
        setLoadingCSV(false);
      })
      .catch(err => {
        console.error('Error loading CSV data (optional):', err);
        // Don't fail - just show template without CSV data
        setLoadingCSV(false);
      });
  }, [company]);

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    sessionStorage.setItem('navigateToSection', section);
    router.push('/');
  };

  const toggleSection = (filename: string) => {
    setExpandedSections(prev =>
      prev.includes(filename)
        ? prev.filter(s => s !== filename)
        : [...prev, filename]
    );
  };

  const filterRows = (rows: Record<string, string>[]) => {
    if (!filterText.trim()) return rows;
    const term = filterText.toLowerCase();
    return rows.filter(row =>
      Object.values(row).some(val => val.toLowerCase().includes(term))
    );
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (!company) {
    return (
      <div className="flex h-screen bg-gray-100 overflow-hidden">
        <Sidebar activeSection={activeSection} onSectionChange={handleSectionChange} />
        
        <main className="flex-1 overflow-y-auto p-4 bg-gray-50">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSectionChange('search')}
              className="bg-white text-gray-700 hover:bg-gray-100 border-gray-300 h-8 text-xs"
            >
              <ArrowLeft className="mr-1 h-3 w-3" />
              Back to Search
            </Button>
          </div>

          {/* Show message for company not found */}
          <div className="space-y-6">
            <Card className="bg-white">
              <CardContent className="py-12 text-center">
                <h2 className="text-xl font-bold text-gray-900 mb-2">Company Not Found</h2>
                <p className="text-gray-600 text-sm">This company doesn't exist in the database.</p>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar activeSection={activeSection} onSectionChange={handleSectionChange} />

      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-3">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleSectionChange('search')}
              className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Market
            </Button>
            <div className="relative w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search within company data..."
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                className="pl-10 h-9 text-sm bg-gray-50 border-gray-300 text-gray-900"
              />
            </div>
          </div>
        </div>

        <div className="px-6 py-6 space-y-6 max-w-7xl mx-auto">

          {/* Company Summary Section */}
          <Card className="bg-white border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-start gap-6 mb-6">
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center text-white font-bold text-3xl shadow-lg">
                    {company.name.charAt(0)}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    {company.business.stockSymbol && (
                      <Badge className="bg-blue-600 text-white px-3 py-1">
                        {company.business.stockSymbol}
                      </Badge>
                    )}
                    <h1 className="text-3xl font-bold text-gray-900">{company.name}</h1>
                    {company.business.founded && (
                      <a 
                        href={`https://www.${company.name.toLowerCase().replace(/\s+/g, '')}.com`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 ml-auto"
                      >
                        <ExternalLink className="h-5 w-5" />
                      </a>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-x-8 gap-y-2 mb-4">
                    <div>
                      <span className="text-sm text-gray-600">Sector:</span>
                      <p className="text-sm font-semibold text-gray-900">
                        {company.business.industry || 'Fleet Management & Telematics'}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Sub Sector:</span>
                      <p className="text-sm font-semibold text-gray-900">
                        {company.category[0] || 'Connected Operations'}
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <p className="text-sm text-gray-700 leading-relaxed">
                      <span className="font-semibold text-gray-900">Description:</span>{' '}
                      {company.name} {company.business.industry ? 
                        `operates in the ${company.business.industry.toLowerCase()} industry` : 
                        'is a leading provider in the fleet management and telematics industry'
                      }{company.business.products && company.business.products.length > 0 ? 
                        `, offering ${company.business.products.slice(0, 3).join(', ')}.` : 
                        ', providing comprehensive solutions for fleet operations, vehicle tracking, and connected operations.'
                      }
                    </p>
                    
                    <div className="flex items-center gap-6 mt-4 pt-4 border-t border-gray-200">
                      {company.business.founded && (
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-600">Next Earnings Date:</span>
                          <span className="font-semibold text-gray-900">05 Jun 2024</span>
                        </div>
                      )}
                      {company.geography.headquarters && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span className="font-medium">•</span>
                          <span>{company.geography.headquarters}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Key Metrics Grid - Moved here */}
              <div className="grid grid-cols-4 lg:grid-cols-8 gap-3 pt-6 border-t border-gray-200">
                <MetricBox
                  title="Revenue"
                  value={company.metrics.revenue ? `$${(company.metrics.revenue / 1_000_000).toFixed(0)}M` : 'N/A'}
                  bgColor="bg-blue-50"
                  textColor="text-blue-700"
                />
                <MetricBox
                  title="Fleet Size"
                  value={company.metrics.fleetSize ? `${(company.metrics.fleetSize / 1000).toFixed(0)}K` : 'N/A'}
                  bgColor="bg-green-50"
                  textColor="text-green-700"
                />
                <MetricBox
                  title="Employees"
                  value={company.metrics.employees ? `${(company.metrics.employees / 1000).toFixed(1)}K` : 'N/A'}
                  bgColor="bg-purple-50"
                  textColor="text-purple-700"
                />
                <MetricBox
                  title="Markets"
                  value={company.geography.markets.length ? `${company.geography.markets.length}` : 'N/A'}
                  bgColor="bg-orange-50"
                  textColor="text-orange-700"
                />
                <MetricBox
                  title="Market Cap"
                  value={company.metrics.marketCap ? `$${(company.metrics.marketCap / 1_000_000).toFixed(0)}M` : 'N/A'}
                  bgColor="bg-indigo-50"
                  textColor="text-indigo-700"
                />
                <MetricBox
                  title="Founded"
                  value={company.business.founded ? `${company.business.founded}` : 'N/A'}
                  bgColor="bg-gray-50"
                  textColor="text-gray-700"
                />
                <MetricBox
                  title="Customers"
                  value={company.metrics.customers ? `${(company.metrics.customers / 1000).toFixed(0)}K` : 'N/A'}
                  bgColor="bg-pink-50"
                  textColor="text-pink-700"
                />
                <MetricBox
                  title="Valuation"
                  value={company.metrics.valuation ? `$${(company.metrics.valuation / 1_000_000_000).toFixed(1)}B` : 'N/A'}
                  bgColor="bg-teal-50"
                  textColor="text-teal-700"
                />
              </div>
            </CardContent>
          </Card>

          {/* Latest News */}
          <Card className="bg-white border border-gray-200">
            <CardHeader className="border-b border-gray-200">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-gray-900">📰 Latest News</CardTitle>
                <Button variant="link" className="text-blue-600 hover:text-blue-800 text-sm p-0">
                  View All News →
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-200">
                {[
                  {
                    title: `${company.name} Expands AI-Powered Fleet Management Solutions`,
                    source: 'TechCrunch',
                    time: '2h ago',
                    icon: '📄'
                  },
                  {
                    title: 'New Partnership with Major Logistics Companies Announced',
                    source: 'Bloomberg',
                    time: '1d ago',
                    icon: '📄'
                  },
                  {
                    title: `${company.name} Reports Strong Q4 Earnings, Beats Expectations`,
                    source: 'Reuters',
                    time: '5h ago',
                    icon: '📄'
                  },
                  {
                    title: `${company.name}'s IoT Platform Reaches 1 Million Connected Assets`,
                    source: 'The Wall Street Journal',
                    time: '2d ago',
                    icon: '📄'
                  }
                ].map((news, idx) => (
                  <div
                    key={idx}
                    className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-xl">{news.icon}</span>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-gray-900 mb-1 hover:text-blue-600">
                          {news.title}
                        </h4>
                        <p className="text-xs text-gray-600">
                          {news.source} • {news.time}
                        </p>
                      </div>
                      <ExternalLink className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Latest Documents */}
          <Card className="bg-white border border-gray-200">
            <CardHeader className="border-b border-gray-200">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-gray-900">Latest Documents</CardTitle>
                <Button variant="outline" size="sm" className="text-sm">
                  <Search className="h-4 w-4 mr-2" />
                  Open Document Search
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Company Docs */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-blue-600" />
                      <h3 className="text-base font-semibold text-gray-900">
                        Company Docs (1,847)
                      </h3>
                    </div>
                    <Button variant="link" className="text-blue-600 hover:text-blue-800 text-sm p-0">
                      View →
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-white hover:shadow-sm transition-all cursor-pointer group">
                      <div className="flex items-start gap-3">
                        <Badge className="bg-amber-100 text-amber-900 hover:bg-amber-100 shrink-0">10-Q</Badge>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 mb-1 group-hover:text-blue-600">
                            {company.name} - Quarterly Report (Q3 2025)
                          </h4>
                          <p className="text-xs text-gray-600">12 Jan 26</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-white hover:shadow-sm transition-all cursor-pointer group">
                      <div className="flex items-start gap-3">
                        <Badge className="bg-amber-100 text-amber-900 hover:bg-amber-100 shrink-0">8-K</Badge>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 mb-1 group-hover:text-blue-600">
                            Current Report - Strategic Partnership Announcement
                          </h4>
                          <p className="text-xs text-gray-600">10 Jan 26</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-white hover:shadow-sm transition-all cursor-pointer group">
                      <div className="flex items-start gap-3">
                        <Badge className="bg-blue-100 text-blue-900 hover:bg-blue-100 shrink-0">Press</Badge>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 mb-1 group-hover:text-blue-600">
                            {company.name} Announces Expansion of AI-Powered Features
                          </h4>
                          <p className="text-xs text-gray-600">04 Jan 26</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-white hover:shadow-sm transition-all cursor-pointer group">
                      <div className="flex items-start gap-3">
                        <Badge className="bg-purple-100 text-purple-900 hover:bg-purple-100 shrink-0">Investor</Badge>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 mb-1 group-hover:text-blue-600">
                            Q3 2025 Investor Presentation
                          </h4>
                          <p className="text-xs text-gray-600">05 Jan 26</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Brokerage Research */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-orange-600" />
                      <h3 className="text-base font-semibold text-gray-900">
                        Brokerage Research (850+)
                      </h3>
                    </div>
                    <Button variant="link" className="text-blue-600 hover:text-blue-800 text-sm p-0">
                      View →
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-white hover:shadow-sm transition-all cursor-pointer group">
                      <div className="flex items-start gap-3">
                        <Badge className="bg-amber-100 text-amber-900 hover:bg-amber-100 shrink-0">Morgan Stanley</Badge>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 mb-1 group-hover:text-blue-600">
                            {company.name}: Initiating Coverage with Overweight Rating
                          </h4>
                          <p className="text-xs text-gray-600">12 Jan 26</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-white hover:shadow-sm transition-all cursor-pointer group">
                      <div className="flex items-start gap-3">
                        <Badge className="bg-blue-100 text-blue-900 hover:bg-blue-100 shrink-0">Goldman Sachs</Badge>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 mb-1 group-hover:text-blue-600">
                            Upgrade to Buy - Platform Gaining Traction
                          </h4>
                          <p className="text-xs text-gray-600">11 Jan 26</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-white hover:shadow-sm transition-all cursor-pointer group">
                      <div className="flex items-start gap-3">
                        <Badge className="bg-green-100 text-green-900 hover:bg-green-100 shrink-0">JP Morgan</Badge>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 mb-1 group-hover:text-blue-600">
                            Price Target Raised - TAM Expanding
                          </h4>
                          <p className="text-xs text-gray-600">10 Jan 26</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-white hover:shadow-sm transition-all cursor-pointer group">
                      <div className="flex items-start gap-3">
                        <Badge className="bg-red-100 text-red-900 hover:bg-red-100 shrink-0">Bank of America</Badge>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 mb-1 group-hover:text-blue-600">
                            Maintaining Buy - Strong Customer Retention
                          </h4>
                          <p className="text-xs text-gray-600">09 Jan 26</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Financial Statements */}
          <Card className="bg-white border border-gray-200">
            <CardHeader className="border-b border-gray-200">
              <CardTitle className="text-lg font-bold text-gray-900">Financials & Metrics</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Metric</th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900">2023</th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900">2024</th>
                      <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900">2025</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr className="hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm font-medium text-gray-900">Revenue</td>
                      <td className="py-3 px-4 text-sm text-right text-gray-700">
                        ${company.metrics.revenue ? ((company.metrics.revenue * 0.85) / 1_000_000).toFixed(1) : '—'}M
                      </td>
                      <td className="py-3 px-4 text-sm text-right text-gray-700">
                        ${company.metrics.revenue ? ((company.metrics.revenue * 0.92) / 1_000_000).toFixed(1) : '—'}M
                      </td>
                      <td className="py-3 px-4 text-sm text-right font-semibold text-gray-900">
                        ${company.metrics.revenue ? (company.metrics.revenue / 1_000_000).toFixed(1) : '—'}M
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm font-medium text-gray-900">Fleet Size (Units)</td>
                      <td className="py-3 px-4 text-sm text-right text-gray-700">
                        {company.metrics.fleetSize ? ((company.metrics.fleetSize * 0.80) / 1000).toFixed(0) : '—'}K
                      </td>
                      <td className="py-3 px-4 text-sm text-right text-gray-700">
                        {company.metrics.fleetSize ? ((company.metrics.fleetSize * 0.90) / 1000).toFixed(0) : '—'}K
                      </td>
                      <td className="py-3 px-4 text-sm text-right font-semibold text-gray-900">
                        {company.metrics.fleetSize ? (company.metrics.fleetSize / 1000).toFixed(0) : '—'}K
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm font-medium text-gray-900">Gross Margin</td>
                      <td className="py-3 px-4 text-sm text-right text-gray-700">68%</td>
                      <td className="py-3 px-4 text-sm text-right text-gray-700">71%</td>
                      <td className="py-3 px-4 text-sm text-right font-semibold text-gray-900">73%</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm font-medium text-gray-900">Operating Income</td>
                      <td className="py-3 px-4 text-sm text-right text-gray-700">
                        ${company.metrics.revenue ? ((company.metrics.revenue * 0.85 * 0.15) / 1_000_000).toFixed(1) : '—'}M
                      </td>
                      <td className="py-3 px-4 text-sm text-right text-gray-700">
                        ${company.metrics.revenue ? ((company.metrics.revenue * 0.92 * 0.18) / 1_000_000).toFixed(1) : '—'}M
                      </td>
                      <td className="py-3 px-4 text-sm text-right font-semibold text-gray-900">
                        ${company.metrics.revenue ? ((company.metrics.revenue * 0.20) / 1_000_000).toFixed(1) : '—'}M
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm font-medium text-gray-900">Employees</td>
                      <td className="py-3 px-4 text-sm text-right text-gray-700">
                        {company.metrics.employees ? ((company.metrics.employees * 0.85) / 1000).toFixed(1) : '—'}K
                      </td>
                      <td className="py-3 px-4 text-sm text-right text-gray-700">
                        {company.metrics.employees ? ((company.metrics.employees * 0.92) / 1000).toFixed(1) : '—'}K
                      </td>
                      <td className="py-3 px-4 text-sm text-right font-semibold text-gray-900">
                        {company.metrics.employees ? (company.metrics.employees / 1000).toFixed(1) : '—'}K
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CompanyCharts company={company} />
          </div>

          {/* Clients Section */}
          <ClientsSection company={company} />

          {/* CSV Data Tables */}
          <Card className="bg-white border border-gray-200">
            <CardHeader className="border-b border-gray-200">
              <CardTitle className="text-lg font-semibold text-gray-900">Company Data & Intelligence</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
          
          {loadingCSV ? (
            <div className="space-y-2">
              {[1, 2, 3].map(i => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : csvData.length === 0 ? (
            <div className="py-12 text-center">
              <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-sm font-medium">No detailed data files found for this company.</p>
              <p className="text-gray-500 text-xs mt-2">Additional data intelligence will be displayed when available.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {csvData.map((csvFile) => {
                const isExpanded = expandedSections.includes(csvFile.filename);
                const filteredRows = filterRows(csvFile.rows);

                return (
                  <div key={csvFile.filename} className="border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      className="w-full flex items-center px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors"
                      onClick={() => toggleSection(csvFile.filename)}
                    >
                      <div className="flex items-center gap-3 flex-1">
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4 text-gray-600" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-gray-600" />
                        )}
                        <FileText className="h-4 w-4 text-blue-600" />
                        <span className="font-semibold text-sm text-gray-900">
                          {csvFile.topic}
                        </span>
                        <Badge variant="secondary" className="ml-auto text-xs">
                          {csvFile.totalRows} rows
                        </Badge>
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="border-t border-gray-100">
                        {filteredRows.length === 0 ? (
                          <p className="text-sm text-gray-500 italic p-4">
                            No matching data found.
                          </p>
                        ) : (
                          <div className="overflow-x-auto">
                            <table className="w-full text-xs">
                              <thead>
                                <tr className="bg-gray-50 border-b border-gray-200">
                                  {csvFile.columns.map((col) => (
                                    <th
                                      key={col}
                                      className="text-left py-2 px-3 font-semibold text-gray-700 whitespace-nowrap"
                                    >
                                      {col.replace(/_/g, ' ')}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {filteredRows.slice(0, 50).map((row, rowIdx) => (
                                  <tr
                                    key={rowIdx}
                                    className={`border-b border-gray-100 hover:bg-blue-50 ${
                                      rowIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                                    }`}
                                  >
                                    {csvFile.columns.map((col) => (
                                      <td
                                        key={col}
                                        className="py-2 px-3 text-gray-700"
                                      >
                                        {formatCellValue(row[col])}
                                      </td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                            {filteredRows.length > 50 && (
                              <p className="text-xs text-gray-400 text-center py-2 bg-gray-50">
                                Showing 50 of {filteredRows.length} rows
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

function formatCellValue(value: string): React.ReactNode {
  if (!value) return <span className="text-gray-300">-</span>;

  // Check if it's a pure number
  const cleanValue = value.replace(/,/g, '');
  const num = parseFloat(cleanValue);

  if (!isNaN(num) && /^-?[\d.]+$/.test(cleanValue)) {
    const formatted = num.toLocaleString();
    if (num >= 1000000) {
      return <span className="font-medium text-green-700">{formatted}</span>;
    }
    if (num >= 1000) {
      return <span className="font-medium text-gray-900">{formatted}</span>;
    }
    return <span className="text-gray-700">{formatted}</span>;
  }

  // Check for percentage
  if (value.includes('%')) {
    return <span className="font-medium text-blue-700">{value}</span>;
  }

  // Check for currency
  if (value.includes('$')) {
    return <span className="font-medium text-green-700">{value}</span>;
  }

  // Check if it looks like a year
  if (/^\d{4}$/.test(value)) {
    return <span className="text-gray-600">{value}</span>;
  }

  // Long text gets truncated
  if (value.length > 80) {
    return (
      <span title={value} className="cursor-help text-gray-700">
        {value.slice(0, 80)}...
      </span>
    );
  }

  return <span className="text-gray-700">{value}</span>;
}

function MetricBox({ title, value, bgColor, textColor }: { title: string; value: string; bgColor: string; textColor: string }) {
  return (
    <div className={`${bgColor} rounded-lg p-3 border border-gray-200`}>
      <p className="text-xs text-gray-600 mb-1">{title}</p>
      <p className={`text-base font-bold ${textColor}`}>{value}</p>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <div className="w-16 bg-[#2d2d2d]" />
      <div className="flex-1 p-4 bg-gray-50">
        <Skeleton className="h-8 w-24 mb-3" />
        <Skeleton className="h-32 w-full mb-6" />
        <Skeleton className="h-48 w-full mb-6" />
        <div className="space-y-2">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-12" />
          ))}
        </div>
      </div>
    </div>
  );
}
