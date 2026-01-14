'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense, useMemo, useState, useEffect } from 'react';
import { useCompanySearch } from '@/lib/use-company-data';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Building2, TrendingUp, MapPin, ArrowLeft, FileText, Newspaper } from 'lucide-react';
import { CompanyData } from '@/lib/data-processor';
import { Sidebar } from '@/components/terminal/sidebar';
import { CompanySearchBar } from '@/components/company-search-bar';

interface Document {
  id: string;
  type: string;
  title: string;
  snippet: string;
  source: string;
  date: string;
  category: string;
  relevance: number;
}

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get('q') || '';
  
  const filters = useMemo(() => ({ query }), [query]);
  const { results, loading } = useCompanySearch(filters);
  const [selectedCompany, setSelectedCompany] = useState<CompanyData | null>(null);
  const [activeSection, setActiveSection] = useState("search");
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loadingDocuments, setLoadingDocuments] = useState(true);

  // Fetch documents about the search query
  useEffect(() => {
    if (!query) {
      setDocuments([]);
      return;
    }

    setLoadingDocuments(true);
    fetch(`/api/search-documents?q=${encodeURIComponent(query)}`)
      .then(res => res.json())
      .then(data => {
        setDocuments(data.documents || []);
        setLoadingDocuments(false);
      })
      .catch(err => {
        console.error('Error loading documents:', err);
        setLoadingDocuments(false);
      });
  }, [query]);

  // Auto-select first company
  useMemo(() => {
    if (results.length > 0 && !selectedCompany) {
      setSelectedCompany(results[0].company);
    }
  }, [results, selectedCompany]);

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    sessionStorage.setItem('navigateToSection', section);
    router.push('/');
  };

  if (!query) {
    return (
      <div className="flex h-screen bg-gray-100 overflow-hidden">
        <Sidebar activeSection={activeSection} onSectionChange={handleSectionChange} />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="h-14 bg-[#2d2d2d] border-b border-[#3d3d3d] flex items-center px-6 gap-4">
            {/* Empty header */}
          </header>

          <div className="flex-1 bg-gray-50 flex items-center justify-center">
            <Card className="max-w-md">
              <CardContent className="py-12 text-center">
                <Search className="h-12 w-12 mx-auto mb-4 text-gray-600" />
                <h2 className="text-2xl font-bold mb-2">No Search Query</h2>
                <p className="text-gray-700 mb-4 font-medium">
                  Please enter a company name or keyword to search.
                </p>
                <Button onClick={() => {
                  sessionStorage.setItem('navigateToSection', 'search');
                  router.push('/');
                }}>
                  Go to Search
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Left Sidebar Navigation */}
      <Sidebar activeSection={activeSection} onSectionChange={handleSectionChange} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation Bar */}
        <header className="h-14 bg-[#2d2d2d] border-b border-[#3d3d3d] flex items-center px-6 gap-4 flex-shrink-0">
          {/* Functional Search Bar */}
          <div className="flex-1 max-w-2xl">
            <CompanySearchBar 
              placeholder="Search companies..."
              className="[&_input]:bg-white/10 [&_input]:border-gray-600 [&_input]:text-white [&_input]:placeholder:text-gray-400 [&_svg]:text-gray-400"
            />
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

        {/* Two Panels - Results and Details */}
        <div className="flex flex-1 overflow-hidden bg-gray-50">
          {/* Left Panel - Search Results List */}
          <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <button
                  onClick={() => {
                    sessionStorage.setItem('navigateToSection', 'search');
                    router.push('/');
                  }}
                  className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors"
                  title="Back to Search"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span className="text-sm font-semibold">Back</span>
                </button>
              </div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold text-gray-900">
                  {loadingDocuments ? 'Searching...' : `${documents.length.toLocaleString()} Documents`}
                </h2>
              </div>
              <p className="text-xs text-gray-700 mt-0.5 font-medium">"{query}"</p>
            </div>

            {/* Documents List */}
            <div className="flex-1 overflow-y-auto">
              {loadingDocuments && (
                <div className="p-3 space-y-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="p-3 border border-gray-200 rounded">
                      <Skeleton className="h-4 w-3/4 mb-2" />
                      <Skeleton className="h-3 w-full mb-1" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  ))}
                </div>
              )}

              {!loadingDocuments && documents.length > 0 && (
                <div className="divide-y divide-gray-200">
                  {documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="w-full text-left p-4 hover:bg-blue-50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-start gap-2 mb-2">
                        <div className="flex-shrink-0">
                          {doc.type === 'news' ? (
                            <Newspaper className="h-4 w-4 text-blue-600 mt-0.5" />
                          ) : (
                            <FileText className="h-4 w-4 text-blue-600 mt-0.5" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="text-xs">
                              {doc.category}
                            </Badge>
                            <span className="text-xs text-gray-700 font-medium">
                              {doc.date}
                            </span>
                          </div>
                          <h4 className="font-semibold text-sm text-gray-900 mb-1 line-clamp-2">
                            {doc.title}
                          </h4>
                          <p className="text-xs text-gray-700 line-clamp-2 mb-2">
                            {doc.snippet}
                          </p>
                          <div className="flex items-center gap-2 text-xs">
                            <span className="text-gray-700 font-medium">{doc.source}</span>
                            <Badge variant="secondary" className="text-xs">
                              {doc.relevance}% match
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!loadingDocuments && documents.length === 0 && (
                <div className="p-6 text-center">
                  <FileText className="h-8 w-8 mx-auto mb-2 text-gray-600" />
                  <p className="text-sm text-gray-800 font-medium">No documents found</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Company Detail View */}
          <div className="flex-1 overflow-y-auto bg-white">
            {selectedCompany ? (
              <CompanyDetailView company={selectedCompany} />
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Building2 className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-700 font-medium">Select a company to view details</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Company Detail View Component
function CompanyDetailView({ company }: { company: CompanyData }) {
  return (
    <div className="h-full overflow-y-auto bg-white">
      <div className="p-6 space-y-6">
        {/* Company Header Card */}
        <Card className="bg-white">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
                {company.name.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-2xl font-bold text-gray-900">{company.name}</h1>
                  {company.business.stockSymbol && (
                    <Badge className="bg-blue-600 text-white text-sm px-3 py-1">
                      {company.business.stockSymbol}
                    </Badge>
                  )}
                  <a href="#" className="text-blue-600 text-sm hover:underline ml-auto">See More →</a>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                  <div>
                    <span className="text-gray-700 font-medium">Sector: </span>
                    <span className="text-gray-900 font-semibold">{company.business.industry || 'Software'}</span>
                  </div>
                  <div>
                    <span className="text-gray-700 font-medium">Sub Sector: </span>
                    <span className="text-gray-900 font-semibold">
                      {company.category[0] || 'Application Software'}
                    </span>
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-xs text-gray-700 font-medium mb-1">
                    <span className="font-bold">Description:</span> {company.name} is a leading provider in the fleet management and telematics industry, 
                    offering comprehensive solutions for fleet operations, vehicle tracking, and connected operations.
                  </p>
                  {company.business.founded && (
                    <p className="text-xs text-gray-700 mt-2">
                      📅 <span className="font-semibold">Founded:</span> {company.business.founded}
                      {company.geography.headquarters && ` • www.${company.name.toLowerCase().replace(/\s+/g, '')}.com`}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Latest News */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              📰 Latest News
            </h2>
            <a href="#" className="text-blue-600 text-sm hover:underline">View All News →</a>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="p-3 bg-white border border-gray-200 rounded hover:shadow-md transition-shadow cursor-pointer">
                <h4 className="text-sm font-semibold text-gray-900 mb-1">
                  {company.name} Expands AI-Powered Fleet Management Solutions
                </h4>
                <p className="text-xs text-gray-700">TechCrunch • 2h ago</p>
              </div>
              <div className="p-3 bg-white border border-gray-200 rounded hover:shadow-md transition-shadow cursor-pointer">
                <h4 className="text-sm font-semibold text-gray-900 mb-1">
                  New Partnership with Major Logistics Companies Announced
                </h4>
                <p className="text-xs text-gray-700">Bloomberg • 1d ago</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-white border border-gray-200 rounded hover:shadow-md transition-shadow cursor-pointer">
                <h4 className="text-sm font-semibold text-gray-900 mb-1">
                  {company.name} Reports Strong Q4 Earnings, Beats Expectations
                </h4>
                <p className="text-xs text-gray-700">Reuters • 5h ago</p>
              </div>
              <div className="p-3 bg-white border border-gray-200 rounded hover:shadow-md transition-shadow cursor-pointer">
                <h4 className="text-sm font-semibold text-gray-900 mb-1">
                  {company.name}'s IoT Platform Reaches 1 Million Connected Assets
                </h4>
                <p className="text-xs text-gray-700">The Wall Street Journal • 2d ago</p>
              </div>
            </div>
          </div>
        </div>

        {/* Latest Documents */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-gray-900">Latest Documents</h2>
            <button className="text-sm text-gray-700 bg-white border border-gray-300 px-3 py-1 rounded hover:bg-gray-50">
              📄 Open Document Search
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            {/* Company Docs */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  📄 Company Docs (1,847)
                </h3>
                <a href="#" className="text-blue-600 text-xs hover:underline">View →</a>
              </div>
              <div className="space-y-3">
                <div className="p-3 bg-white border-l-4 border-l-blue-500 rounded shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-start gap-3">
                    <div className="bg-yellow-100 px-2 py-1 rounded text-xs font-bold text-gray-900">
                      10-Q
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-gray-900 mb-1">
                        {company.name} - Quarterly Report (Q3 2025)
                      </h4>
                      <p className="text-xs text-gray-700">12 Jan 26</p>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-white border-l-4 border-l-blue-500 rounded shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-start gap-3">
                    <div className="bg-yellow-100 px-2 py-1 rounded text-xs font-bold text-gray-900">
                      8-K
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-gray-900 mb-1">
                        Current Report - Strategic Partnership Announcement
                      </h4>
                      <p className="text-xs text-gray-700">10 Jan 26</p>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-white border-l-4 border-l-blue-500 rounded shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 px-2 py-1 rounded text-xs font-bold text-gray-900">
                      Press Release
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-gray-900 mb-1">
                        {company.name} Announces Expansion of AI-Powered Features
                      </h4>
                      <p className="text-xs text-gray-700">04 Jan 26</p>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-white border-l-4 border-l-blue-500 rounded shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-start gap-3">
                    <div className="bg-purple-100 px-2 py-1 rounded text-xs font-bold text-gray-900">
                      Investor Presentation
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-gray-900 mb-1">
                        Q3 2025 Investor Presentation
                      </h4>
                      <p className="text-xs text-gray-700">05 Jan 26</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Brokerage Research */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  📊 Brokerage Research (850+)
                </h3>
                <a href="#" className="text-blue-600 text-xs hover:underline">View →</a>
              </div>
              <div className="space-y-3">
                <div className="p-3 bg-white border-l-4 border-l-orange-500 rounded shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-start gap-3">
                    <div className="bg-yellow-100 px-2 py-1 rounded text-xs font-bold text-gray-900">
                      Morgan Stanley
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-gray-900 mb-1">
                        {company.name}: Initiating Coverage with Overweight Rating - IoT Leader
                      </h4>
                      <p className="text-xs text-gray-700">12 Jan 26</p>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-white border-l-4 border-l-orange-500 rounded shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 px-2 py-1 rounded text-xs font-bold text-gray-900">
                      Goldman Sachs
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-gray-900 mb-1">
                        Upgrade to Buy - Connected Operations Platform Gaining Traction
                      </h4>
                      <p className="text-xs text-gray-700">11 Jan 26</p>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-white border-l-4 border-l-orange-500 rounded shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-start gap-3">
                    <div className="bg-green-100 px-2 py-1 rounded text-xs font-bold text-gray-900">
                      JP Morgan
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-gray-900 mb-1">
                        Price Target Raised to $50 - Fleet Management TAM Expanding
                      </h4>
                      <p className="text-xs text-gray-700">10 Jan 26</p>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-white border-l-4 border-l-orange-500 rounded shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-start gap-3">
                    <div className="bg-red-100 px-2 py-1 rounded text-xs font-bold text-gray-900">
                      Bank of America
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-gray-900 mb-1">
                        Maintaining Buy - Strong Customer Retention and ARR Growth
                      </h4>
                      <p className="text-xs text-gray-700">09 Jan 26</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SearchResultsPage() {
  return (
    <Suspense fallback={<SearchResultsLoading />}>
      <SearchResultsContent />
    </Suspense>
  );
}

function SearchResultsLoading() {
  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar Skeleton */}
      <div className="w-16 bg-[#2d2d2d] border-r border-[#3d3d3d]">
        <Skeleton className="h-12 w-12 m-2 bg-[#3d3d3d]" />
      </div>
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation Bar Skeleton */}
        <header className="h-14 bg-[#2d2d2d] border-b border-[#3d3d3d] flex items-center px-6">
          <Skeleton className="h-8 w-64 bg-[#3d3d3d]" />
        </header>
        
        {/* Main Content - Two Panels */}
        <div className="flex flex-1 overflow-hidden bg-gray-50">
          {/* Left Panel Skeleton */}
          <div className="w-80 bg-white border-r border-gray-200 p-4">
            <Skeleton className="h-8 w-full mb-4" />
            <div className="space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          </div>
          
          {/* Right Panel Skeleton */}
          <div className="flex-1 bg-white p-6">
            <Skeleton className="h-24 w-full mb-6" />
            <Skeleton className="h-32 w-full mb-6" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
