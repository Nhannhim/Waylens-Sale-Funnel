'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCompanyData } from '@/lib/use-company-data';
import { CompanyData } from '@/lib/data-processor';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ArrowLeft,
  FileText,
  Search,
  ExternalLink,
  TrendingUp,
  TrendingDown,
  Globe,
  Twitter,
  Linkedin,
  Building2,
  Users,
  MessageSquare,
  BarChart3,
  FileBarChart,
  Newspaper,
  ChevronRight,
} from 'lucide-react';
import { Sidebar } from '@/components/terminal/sidebar';

interface CompanyDetailPageProps {
  companyId: string;
}

export function CompanyDetailRedesign({ companyId }: CompanyDetailPageProps) {
  const router = useRouter();
  const { dataset, loading } = useCompanyData();
  const [company, setCompany] = useState<CompanyData | null>(null);
  const [activeSection, setActiveSection] = useState("search");
  const [sidebarSection, setSidebarSection] = useState("overview");
  const [isNavExpanded, setIsNavExpanded] = useState(true);

  useEffect(() => {
    if (dataset) {
      let found = dataset.companies.find(c => c.id === companyId);
      if (!found) {
        const normalizedSlug = companyId.toLowerCase().replace(/-/g, ' ').trim();
        found = dataset.companies.find(c => 
          c.name.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim() === normalizedSlug ||
          c.name.toLowerCase().replace(/\s+/g, '-') === companyId.toLowerCase()
        );
      }
      setCompany(found || null);
    }
  }, [dataset, companyId]);

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    sessionStorage.setItem('navigateToSection', section);
    router.push('/');
  };

  if (loading || !company) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  const priceChange = company.metrics.revenue ? 3.05 : 0;
  const priceChangePercent = company.metrics.revenue ? 1.73 : 0;

  return (
    <div className="flex h-screen bg-white overflow-hidden">
      <Sidebar activeSection={activeSection} onSectionChange={handleSectionChange} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Compact Header with Stock Info */}
        <div className="border-b border-gray-200 bg-white">
          <div className="px-6 py-4">
            <div className="flex items-center gap-4">
              {/* Back Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSectionChange('search')}
                className="h-10 w-10 p-0 hover:bg-gray-100"
              >
                <ArrowLeft className="h-5 w-5 text-gray-700" />
              </Button>

              {/* Logo */}
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                {company.name.charAt(0)}
              </div>

              {/* Company Name & Ticker */}
              <div className="flex items-baseline gap-2">
                <h1 className="text-xl font-bold text-gray-900">{company.name}</h1>
                <span className="text-base font-semibold text-blue-600">
                  {company.business.stockSymbol || 'PRIVATE'}
                </span>
                <span className="text-sm text-gray-700">US Composite</span>
              </div>

              {/* Social Icons */}
              <div className="ml-auto flex items-center gap-2">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Globe className="h-4 w-4 text-gray-600" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Linkedin className="h-4 w-4 text-gray-600" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Twitter className="h-4 w-4 text-gray-600" />
                </Button>
              </div>
            </div>

            {/* Stock Info Line */}
            <div className="flex items-center gap-6 mt-3 text-sm">
              <div>
                <span className="text-gray-700">Last Price (Delayed, USD)</span>
                <span className="ml-2 font-bold text-gray-900">
                  ${company.metrics.revenue ? (178.56).toFixed(2) : '—'}
                </span>
                <span className={`ml-2 ${priceChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ({priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}, 
                  {priceChange >= 0 ? <TrendingUp className="inline h-3 w-3 ml-1" /> : <TrendingDown className="inline h-3 w-3 ml-1" />}
                  {priceChangePercent.toFixed(2)}%)
                </span>
              </div>
              <div className="h-4 w-px bg-gray-300" />
              <div>
                <span className="text-gray-700">Last Close</span>
                <span className="ml-2 font-semibold text-gray-900">${(175.51).toFixed(2)}</span>
              </div>
              <div className="h-4 w-px bg-gray-300" />
              <div>
                <span className="text-gray-700">52w Range</span>
                <span className="ml-2 font-semibold text-gray-900">$86.62 - 179.38</span>
              </div>
              <div className="h-4 w-px bg-gray-300" />
              <div>
                <span className="text-gray-700">Market Cap</span>
                <span className="ml-2 font-semibold text-gray-900">
                  ${company.metrics.marketCap ? (company.metrics.marketCap / 1_000_000_000).toFixed(2) : '4.36'}T
                </span>
              </div>
              <div className="h-4 w-px bg-gray-300" />
              <div>
                <span className="text-gray-700">30D Avg Volume</span>
                <span className="ml-2 font-semibold text-gray-900">173.15M</span>
              </div>
            </div>
          </div>

          {/* Document Tags & Industry Comps */}
          <div className="px-6 py-3 border-t border-gray-200 bg-white">
            <div className="flex items-center gap-3 mb-3">
              <Button variant="outline" size="sm" className="h-8 bg-white">
                <Search className="h-3 w-3 mr-2" />
                Open Document Search
              </Button>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-gray-800">LATEST</span>
                <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                  10Q 05/28/2025
                </Badge>
                <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                  10K 02/26/2025
                </Badge>
                <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                  Earnings Transcript 05/28/2025
                </Badge>
                <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                  Investor Presentation 06/25/2025
                </Badge>
                <Badge variant="secondary" className="bg-gray-100 text-gray-700 hover:bg-gray-100">
                  Model Q1-2026
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-800">INDUSTRY COMPS</span>
              <Badge variant="outline" className="bg-white">Fleet Management</Badge>
              <Badge variant="outline" className="bg-white">Telematics</Badge>
              <Badge variant="outline" className="bg-white">IoT</Badge>
              <Badge variant="outline" className="bg-white">Connected Vehicles</Badge>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Sidebar Navigation - Collapsible */}
          <div 
            className={`border-r border-gray-200 bg-white overflow-y-auto transition-all duration-300 ${
              isNavExpanded ? 'w-56' : 'w-12'
            }`}
            onMouseEnter={() => setIsNavExpanded(true)}
            onMouseLeave={() => setIsNavExpanded(false)}
          >
            <div className="p-4 space-y-1">
              {isNavExpanded ? (
                <>
                  <div className="mb-4">
                    <h3 className="text-xs font-semibold text-gray-700 uppercase mb-2">Overview</h3>
                    <Button
                      variant={sidebarSection === 'overview' ? 'secondary' : 'ghost'}
                      className="w-full justify-start text-sm"
                      onClick={() => setSidebarSection('overview')}
                    >
                      Summary
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-sm"
                    >
                      Industry Earnings Summary
                    </Button>
                  </div>

                  <div className="mb-4">
                    <h3 className="text-xs font-semibold text-gray-700 uppercase mb-2">Documents</h3>
                    <Button variant="ghost" className="w-full justify-start text-sm">
                      Expert Transcripts
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-sm">
                      Broker Research
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-sm">
                      Company Docs
                    </Button>
                  </div>

                  <div className="mb-4">
                    <h3 className="text-xs font-semibold text-gray-700 uppercase mb-2">Financials & Metrics</h3>
                    <Button
                      variant={sidebarSection === 'financials' ? 'secondary' : 'ghost'}
                      className="w-full justify-start text-sm"
                      onClick={() => setSidebarSection('financials')}
                    >
                      Financial Overview
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-sm">
                      Valuation & Ratios
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-sm">
                      Statements
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-sm">
                      Comparables
                    </Button>
                    <Button variant="ghost" className="w-full justify-start text-sm">
                      Charting
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center gap-4 py-2">
                  <FileText className="h-5 w-5 text-gray-600" />
                  <BarChart3 className="h-5 w-5 text-gray-600" />
                  <FileBarChart className="h-5 w-5 text-gray-600" />
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {sidebarSection === 'overview' && (
              <>
                {/* Summary Section */}
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Summary</h2>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {company.name} is a leading developer in the fleet management and telematics industry. 
                    {company.business.products && company.business.products.length > 0 && 
                      ` The company offers ${company.business.products.slice(0, 3).join(', ')}.`
                    }
                    {' '}With a fleet size of {company.metrics.fleetSize ? `${(company.metrics.fleetSize / 1000).toFixed(0)}K units` : 'N/A'}, 
                    {company.name} serves customers across {company.geography.markets.length || 'multiple'} regions globally.
                  </p>
                  <Button variant="link" className="text-blue-600 p-0 h-auto mt-2">
                    Read More About
                  </Button>
                </div>

                {/* Workflow Agents */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Workflow Agents</h3>
                    <Button variant="link" className="text-blue-600 text-sm p-0 h-auto">
                      View All →
                    </Button>
                  </div>
                  <p className="text-sm text-gray-700 mb-4">
                    Work smarter using curated workflows built with our most powerful AI features.
                  </p>
                  <div className="grid grid-cols-4 gap-4">
                    <WorkflowCard
                      icon={<FileText className="h-5 w-5 text-blue-600" />}
                      title="Company Primer"
                      description={`Conduct a deep dive on ${company.name}.`}
                      duration="5-15 min"
                    />
                    <WorkflowCard
                      icon={<MessageSquare className="h-5 w-5 text-green-600" />}
                      title="Top Questions for Experts"
                      description={`Summarize common Q&A about ${company.name}.`}
                      duration="3-12 min"
                    />
                    <WorkflowCard
                      icon={<Users className="h-5 w-5 text-orange-600" />}
                      title="Customer Insights"
                      description="Summarize key customer opinions and feedback."
                      duration="3-12 min"
                    />
                    <WorkflowCard
                      icon={<BarChart3 className="h-5 w-5 text-purple-600" />}
                      title="Competitive Positioning Analysis"
                      description={`Evaluate ${company.name}'s standing relative to its key competitors.`}
                      duration="5-15 min"
                    />
                  </div>
                </div>

                {/* Latest Documents */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Latest Documents</h3>
                    <Button variant="outline" size="sm">
                      <Search className="h-3 w-3 mr-2" />
                      Open Document Search
                    </Button>
                  </div>

                  <Tabs defaultValue="expert" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="expert" className="text-sm">
                        <span className="mr-2">💬</span> Expert Insights (442)
                      </TabsTrigger>
                      <TabsTrigger value="broker" className="text-sm">
                        <span className="mr-2">📊</span> Broker Research (11,494)
                      </TabsTrigger>
                      <TabsTrigger value="company" className="text-sm">
                        <span className="mr-2">📄</span> Company Docs (1,847)
                      </TabsTrigger>
                      <TabsTrigger value="news" className="text-sm">
                        <span className="mr-2">📰</span> News & Regulatory (46,710)
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="expert" className="mt-4">
                      <div className="space-y-3">
                        {[
                          { role: 'Former Director', title: `Former Director at ${company.name} Sees Continued Dominance in Data Center and AI Market`, date: '30 Jul 25' },
                          { role: 'Consultant', title: 'CTO at Dell Technologies Sees Need for Adaptation in Data Centers', date: '28 Jul 25' },
                          { role: 'Consultant', title: 'Director of AI at NetApp Inc. Sees Growing Importance of Generative AI', date: '28 Jul 25' },
                          { role: 'Consultant', title: 'Former Executive at Global Social Media Company Sees Advancements in EMLs', date: '28 Jul 25' },
                        ].map((doc, idx) => (
                          <DocumentRow key={idx} badge={doc.role} title={doc.title} date={doc.date} />
                        ))}
                      </div>
                      <Button variant="link" className="text-blue-600 mt-4 p-0">
                        View →
                      </Button>
                    </TabsContent>

                    <TabsContent value="broker" className="mt-4">
                      <div className="space-y-3">
                        {[
                          { source: 'JPMorgan Research', title: `Tech Snippets: ${company.name}'s expansion of AI power chip suppliers`, date: '29 Jul 25' },
                          { source: 'Company Research', title: 'Component Highlights: Smartphone Tracking Closer to Flattish', date: '28 Jul 25' },
                          { source: 'Company Research', title: `Tech Snippets ${company.name}'s expansion of AI power chip suppliers`, date: '28 Jul 25' },
                          { source: 'Company Research', title: 'ON: ON Collaborating with NVIDIA on 800 VDC; Focus on Competition', date: '28 Jul 25' },
                        ].map((doc, idx) => (
                          <DocumentRow key={idx} badge={doc.source} title={doc.title} date={doc.date} />
                        ))}
                      </div>
                      <Button variant="link" className="text-blue-600 mt-4 p-0">
                        View →
                      </Button>
                    </TabsContent>

                    <TabsContent value="company" className="mt-4">
                      <div className="space-y-3">
                        {[
                          { type: '10-Q', title: `${company.name} - Quarterly Report (Q3 2025)`, date: '12 Jan 26' },
                          { type: '8-K', title: 'Current Report - Strategic Partnership Announcement', date: '10 Jan 26' },
                          { type: 'Press', title: `${company.name} Announces Expansion of AI-Powered Features`, date: '04 Jan 26' },
                          { type: 'Investor', title: 'Q3 2025 Investor Presentation', date: '05 Jan 26' },
                        ].map((doc, idx) => (
                          <DocumentRow key={idx} badge={doc.type} title={doc.title} date={doc.date} />
                        ))}
                      </div>
                      <Button variant="link" className="text-blue-600 mt-4 p-0">
                        View →
                      </Button>
                    </TabsContent>

                    <TabsContent value="news" className="mt-4">
                      <div className="space-y-3">
                        {[
                          { source: 'OpenPR', title: 'Autonomous Vehicles Market Set to Witness Significant Growth by 2033', date: '30 Jul 25' },
                          { source: 'Windows Central', title: `Ex-Microsoft Bill Gates vs. ${company.name} CEO Jensen Huang: Does AI pose a real threat?`, date: '30 Jul 25' },
                          { source: 'TechCrunch', title: `${company.name} Expands AI-Powered Fleet Management Solutions`, date: '2h ago' },
                          { source: 'Bloomberg', title: 'New Partnership with Major Logistics Companies Announced', date: '1d ago' },
                        ].map((doc, idx) => (
                          <DocumentRow key={idx} badge={doc.source} title={doc.title} date={doc.date} />
                        ))}
                      </div>
                      <Button variant="link" className="text-blue-600 mt-4 p-0">
                        View →
                      </Button>
                    </TabsContent>
                  </Tabs>
                </div>
              </>
            )}

            {sidebarSection === 'financials' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Financial Overview</h2>
                {/* Add financial charts and data here */}
                <p className="text-gray-600">Financial data and charts will be displayed here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function WorkflowCard({ icon, title, description, duration }: { 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
  duration: string;
}) {
  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer border border-gray-200 bg-white">
      <CardContent className="p-4">
        <div className="mb-3">{icon}</div>
        <h4 className="font-semibold text-sm text-gray-900 mb-2">{title}</h4>
        <p className="text-xs text-gray-700 mb-3 line-clamp-2">{description}</p>
        <div className="flex items-center text-xs text-gray-600">
          <span>⏱️ {duration}</span>
        </div>
      </CardContent>
    </Card>
  );
}

function DocumentRow({ badge, title, date }: { badge: string; title: string; date: string }) {
  return (
    <div className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer group bg-white border border-gray-200">
      <Badge variant="secondary" className="shrink-0 text-xs bg-gray-100">{badge}</Badge>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-900 group-hover:text-blue-600 line-clamp-1">{title}</p>
        <p className="text-xs text-gray-600 mt-1">{date}</p>
      </div>
      <ChevronRight className="h-4 w-4 text-gray-400 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
}
