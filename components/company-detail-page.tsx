'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCompanyData } from '@/lib/use-company-data';
import { CompanyData } from '@/lib/data-processor';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Building2, DollarSign, TrendingUp, Users, MapPin, Package, FileText, Newspaper, Calendar } from 'lucide-react';
import { Sidebar } from '@/components/terminal/sidebar';
import { CompanyNews } from '@/components/company-news';

interface CompanyDetailPageProps {
  companyId: string;
}

interface Document {
  id: string;
  type: string;
  title: string;
  date: string;
  source: string;
  category: string;
}

export function CompanyDetailPage({ companyId }: CompanyDetailPageProps) {
  const router = useRouter();
  const { dataset, loading } = useCompanyData();
  const [company, setCompany] = useState<CompanyData | null>(null);
  const [activeSection, setActiveSection] = useState("summary-database");
  const [documents, setDocuments] = useState<Document[]>([]);

  useEffect(() => {
    if (dataset) {
      const found = dataset.companies.find(c => c.id === companyId);
      setCompany(found || null);
      
      // Generate mock documents for this company
      if (found) {
        setDocuments([
          {
            id: '1',
            type: '10-Q',
            title: `${found.name} - Quarterly Report (Q3 2025)`,
            date: '12 Jan 26',
            source: 'Company Docs',
            category: 'Company Docs'
          },
          {
            id: '2',
            type: '8-K',
            title: `Current Report - Strategic Partnership Announcement`,
            date: '10 Jan 26',
            source: 'Company Docs',
            category: 'Company Docs'
          },
          {
            id: '3',
            type: 'Press Release',
            title: `${found.name} Announces Expansion of AI-Powered Features`,
            date: '04 Jan 26',
            source: 'Press Release',
            category: 'Company Docs'
          },
          {
            id: '4',
            type: 'Investor Presentation',
            title: `Q3 2025 Investor Presentation`,
            date: '05 Jan 26',
            source: 'Company Docs',
            category: 'Investor Relations'
          },
          {
            id: '5',
            type: 'Research',
            title: `${found.name}: Initiating Coverage with Overweight Rating`,
            date: '12 Jan 26',
            source: 'Morgan Stanley',
            category: 'Brokerage Research'
          },
          {
            id: '6',
            type: 'Research',
            title: `Upgrade to Buy - Connected Operations Platform Gaining Traction`,
            date: '11 Jan 26',
            source: 'Goldman Sachs',
            category: 'Brokerage Research'
          },
        ]);
      }
    }
  }, [dataset, companyId]);

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    sessionStorage.setItem('navigateToSection', section);
    router.push('/');
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (!company) {
    return (
      <div className="flex h-screen bg-gray-100 overflow-hidden">
        <Sidebar activeSection={activeSection} onSectionChange={handleSectionChange} />
        <div className="flex-1 flex items-center justify-center">
          <Card>
            <CardContent className="py-12 text-center">
              <h2 className="text-2xl font-bold mb-2">Company Not Found</h2>
              <p className="text-gray-700 font-medium mb-4">
                The company you're looking for doesn't exist in our database.
              </p>
              <Button onClick={() => handleSectionChange('summary-database')}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Database
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Left Sidebar Navigation */}
      <Sidebar activeSection={activeSection} onSectionChange={handleSectionChange} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation Bar */}
        <header className="h-14 bg-[#2d2d2d] border-b border-[#3d3d3d] flex items-center px-6 gap-4 flex-shrink-0">
          {/* Company Name Display */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-sm">
              {company.name.charAt(0)}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-white font-semibold text-sm">{company.name}</span>
              {company.business.stockSymbol && (
                <Badge variant="outline" className="text-xs bg-blue-600 text-white border-blue-500">
                  {company.business.stockSymbol}
                </Badge>
              )}
            </div>
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-2 ml-auto">
            <button className="w-8 h-8 rounded flex items-center justify-center text-white hover:bg-white/10 transition-colors">
              <span className="text-xs font-semibold">WL</span>
            </button>
            <button className="h-8 px-4 bg-white text-[#2d2d2d] hover:bg-white/90 rounded text-sm font-medium">
              Live Help
            </button>
          </div>
        </header>

        {/* Two Panel Layout */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Panel - Documents List */}
          <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => handleSectionChange('summary-database')}
                className="mb-3"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Database
              </Button>
              
              <h2 className="text-sm font-semibold text-gray-900">Latest Documents</h2>
              <p className="text-xs text-gray-700 mt-0.5 font-medium">{documents.length} items</p>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-gray-200">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="p-4 hover:bg-blue-50 cursor-pointer transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      {doc.type.includes('Q') || doc.type.includes('K') ? (
                        <div className="w-10 h-10 bg-blue-100 rounded flex items-center justify-center">
                          <span className="text-blue-600 font-bold text-xs">{doc.type}</span>
                        </div>
                      ) : (
                        <FileText className="h-5 w-5 text-blue-600 mt-1" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-700 font-medium mb-1">{doc.type}</p>
                      <h4 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-2">
                        {doc.title}
                      </h4>
                      <p className="text-xs text-gray-600">{doc.date}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Document Categories */}
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <p className="text-xs font-semibold text-gray-700 mb-2">Filter by Type</p>
              <div className="space-y-1">
                <Button variant="ghost" size="sm" className="w-full justify-start text-xs">
                  📄 Company Docs (1,847)
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start text-xs">
                  📊 Brokerage Research (850+)
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start text-xs">
                  📰 Press Releases
                </Button>
              </div>
            </div>
          </div>

          {/* Right Panel - Company Information */}
          <div className="flex-1 overflow-y-auto bg-white">
            <div className="h-full flex flex-col">
              {/* Company Header */}
              <div className="border-b border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-lg">
                      {company.name.charAt(0)}
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">{company.name}</h1>
                      <div className="flex items-center gap-3 mt-1">
                        {company.business.stockSymbol && (
                          <span className="text-sm text-blue-600 font-bold">
                            {company.business.stockSymbol}
                          </span>
                        )}
                        {company.geography.headquarters && (
                          <span className="text-sm text-gray-700 font-medium">
                            {company.geography.headquarters}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-600 mb-1">Sector:</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {company.business.industry || 'Software'}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-600 mb-1 font-semibold">Description:</p>
                  <p className="text-sm text-gray-800">
                    {company.name} is a leading provider in the fleet management and telematics industry, 
                    offering comprehensive solutions for fleet operations and vehicle tracking.
                  </p>
                </div>
              </div>

              {/* Tabs */}
              <Tabs defaultValue="summary" className="flex-1 flex flex-col">
                <TabsList className="w-full justify-start rounded-none border-b bg-white px-6 h-auto py-0">
                  <TabsTrigger value="summary" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-4 py-3">
                    Summary
                  </TabsTrigger>
                  <TabsTrigger value="earnings" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-4 py-3">
                    Earnings & Events
                  </TabsTrigger>
                  <TabsTrigger value="financials" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-4 py-3">
                    Financials & Estimates
                  </TabsTrigger>
                  <TabsTrigger value="competition" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-4 py-3">
                    Competition & Peers
                  </TabsTrigger>
                  <TabsTrigger value="analytics" className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-4 py-3">
                    Search Analytics
                  </TabsTrigger>
                </TabsList>

                {/* Summary Tab */}
                <TabsContent value="summary" className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50">
                  {/* Key Metrics */}
                  <div className="grid grid-cols-4 gap-4">
                    {company.metrics.revenue && (
                      <Card className="bg-white">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <DollarSign className="h-4 w-4 text-green-600" />
                            <p className="text-xs text-gray-700 font-semibold uppercase">Revenue</p>
                          </div>
                          <p className="text-2xl font-bold text-gray-900">
                            ${(company.metrics.revenue / 1_000_000).toFixed(1)}M
                          </p>
                          <Badge variant="secondary" className="mt-2 text-xs">
                            {company.metrics.revenueRange}
                          </Badge>
                        </CardContent>
                      </Card>
                    )}

                    {company.metrics.fleetSize && (
                      <Card className="bg-white">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <TrendingUp className="h-4 w-4 text-blue-600" />
                            <p className="text-xs text-gray-700 font-semibold uppercase">Fleet Size</p>
                          </div>
                          <p className="text-2xl font-bold text-gray-900">
                            {(company.metrics.fleetSize / 1_000).toFixed(0)}K
                          </p>
                          <p className="text-xs text-gray-700 font-medium mt-1">vehicles</p>
                        </CardContent>
                      </Card>
                    )}

                    {company.metrics.valuation && (
                      <Card className="bg-white">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <TrendingUp className="h-4 w-4 text-purple-600" />
                            <p className="text-xs text-gray-700 font-semibold uppercase">Valuation</p>
                          </div>
                          <p className="text-2xl font-bold text-gray-900">
                            ${(company.metrics.valuation / 1_000_000_000).toFixed(2)}B
                          </p>
                        </CardContent>
                      </Card>
                    )}

                    {company.metrics.employees && (
                      <Card className="bg-white">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Users className="h-4 w-4 text-orange-600" />
                            <p className="text-xs text-gray-700 font-semibold uppercase">Employees</p>
                          </div>
                          <p className="text-2xl font-bold text-gray-900">
                            {company.metrics.employees.toLocaleString()}
                          </p>
                        </CardContent>
                      </Card>
                    )}
                  </div>

                  {/* Business Info Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <Card className="bg-white">
                      <CardHeader>
                        <CardTitle className="text-gray-900 font-bold">Business Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {company.business.ownership && (
                          <div>
                            <p className="text-xs text-gray-700 font-semibold uppercase mb-1">Ownership</p>
                            <p className="text-sm font-medium text-gray-900">{company.business.ownership}</p>
                          </div>
                        )}
                        {company.business.founded && (
                          <div>
                            <p className="text-xs text-gray-700 font-semibold uppercase mb-1">Founded</p>
                            <p className="text-sm font-medium text-gray-900">{company.business.founded}</p>
                          </div>
                        )}
                        {company.business.industry && (
                          <div>
                            <p className="text-xs text-gray-700 font-semibold uppercase mb-1">Industry</p>
                            <p className="text-sm font-medium text-gray-900">{company.business.industry}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    <Card className="bg-white">
                      <CardHeader>
                        <CardTitle className="text-gray-900 font-bold">Categories</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {company.category.map(cat => (
                            <Badge key={cat} variant="default" className="text-xs">
                              {cat}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Products */}
                  {company.business.products && company.business.products.length > 0 && (
                    <Card className="bg-white">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-gray-900 font-bold">
                          <Package className="h-5 w-5" />
                          Products & Services
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {company.business.products.map(product => (
                            <Badge key={product} variant="secondary" className="text-sm">
                              {product}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                {/* Earnings & Events Tab */}
                <TabsContent value="earnings" className="flex-1 overflow-y-auto p-6 bg-gray-50">
                  <Card className="bg-white">
                    <CardHeader>
                      <CardTitle className="text-gray-900 font-bold">Earnings History</CardTitle>
                      <CardDescription className="text-gray-700 font-medium">
                        Latest earnings reports and financial events
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="p-4 border border-gray-200 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-bold text-gray-900">Q4 2024 Earnings Call</span>
                            <Badge variant="outline" className="text-xs">Oct 24, 2023</Badge>
                          </div>
                          <p className="text-sm text-gray-700">
                            Revenue was ${company.metrics.revenue ? (company.metrics.revenue / 1_000_000).toFixed(1) : 'N/A'}M
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Financials Tab */}
                <TabsContent value="financials" className="flex-1 overflow-y-auto p-6 bg-gray-50">
                  <Card className="bg-white">
                    <CardHeader>
                      <CardTitle className="text-gray-900 font-bold">Financial Metrics</CardTitle>
                      <CardDescription className="text-gray-700 font-medium">
                        Key financial indicators and performance data
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        {company.financials.revenue && (
                          <div className="p-4 bg-white rounded-lg border border-gray-200">
                            <p className="text-xs text-gray-700 font-semibold uppercase mb-1">Annual Revenue</p>
                            <p className="text-2xl font-bold text-gray-900">
                              ${(company.financials.revenue / 1_000_000).toFixed(2)}M
                            </p>
                          </div>
                        )}
                        {company.financials.growth_rate && (
                          <div className="p-4 bg-white rounded-lg border border-gray-200">
                            <p className="text-xs text-gray-700 font-semibold uppercase mb-1">Growth Rate</p>
                            <p className="text-2xl font-bold text-gray-900">{company.financials.growth_rate}%</p>
                          </div>
                        )}
                        {company.financials.ebitda && (
                          <div className="p-4 bg-white rounded-lg border border-gray-200">
                            <p className="text-xs text-gray-700 font-semibold uppercase mb-1">EBITDA</p>
                            <p className="text-2xl font-bold text-gray-900">
                              ${(company.financials.ebitda / 1_000_000).toFixed(2)}M
                            </p>
                          </div>
                        )}
                        {company.metrics.marketCap && (
                          <div className="p-4 bg-white rounded-lg border border-gray-200">
                            <p className="text-xs text-gray-700 font-semibold uppercase mb-1">Market Cap</p>
                            <p className="text-2xl font-bold text-gray-900">
                              ${(company.metrics.marketCap / 1_000_000).toFixed(2)}M
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Competition Tab */}
                <TabsContent value="competition" className="flex-1 overflow-y-auto p-6 bg-gray-50 space-y-4">
                  {/* Customers */}
                  {company.relationships.customers && company.relationships.customers.length > 0 && (
                    <Card className="bg-white">
                      <CardHeader>
                        <CardTitle className="text-gray-900 font-bold">Customers ({company.relationships.customers.length})</CardTitle>
                        <CardDescription className="text-gray-700 font-medium">Notable customer references</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-3 gap-2">
                          {company.relationships.customers.slice(0, 30).map((customer, idx) => (
                            <div key={idx} className="p-3 rounded border bg-white text-sm">
                              {customer}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Partners */}
                  {company.relationships.partners && company.relationships.partners.length > 0 && (
                    <Card className="bg-white">
                      <CardHeader>
                        <CardTitle className="text-gray-900 font-bold">Partners ({company.relationships.partners.length})</CardTitle>
                        <CardDescription className="text-gray-700 font-medium">Technology and business partnerships</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-3 gap-2">
                          {company.relationships.partners.slice(0, 30).map((partner, idx) => (
                            <div key={idx} className="p-3 rounded border bg-white text-sm">
                              {partner}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                {/* Search Analytics Tab */}
                <TabsContent value="analytics" className="flex-1 overflow-y-auto p-6 bg-gray-50">
                  <CompanyNews companyName={company.name} />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <div className="w-16 bg-[#2d2d2d]" />
      <div className="flex-1 flex flex-col">
        <div className="h-14 bg-[#2d2d2d]" />
        <div className="flex flex-1">
          <div className="w-80 bg-white p-4">
            <Skeleton className="h-8 w-full mb-4" />
            <Skeleton className="h-20 w-full" />
          </div>
          <div className="flex-1 bg-white p-6">
            <Skeleton className="h-12 w-2/3 mb-6" />
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(i => (
                <Skeleton key={i} className="h-24" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
