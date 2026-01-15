'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense, useMemo, useState } from 'react';
import { useCompanySearch } from '@/lib/use-company-data';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Building2, MapPin, ArrowLeft } from 'lucide-react';
import { Sidebar } from '@/components/terminal/sidebar';
import { CompanySearchBar } from '@/components/company-search-bar';

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get('q') || '';
  
  const filters = useMemo(() => ({ query }), [query]);
  const { results, loading } = useCompanySearch(filters);
  const [activeSection, setActiveSection] = useState("search");

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
                  {loading ? 'Searching...' : `${results.length.toLocaleString()} Companies`}
                </h2>
              </div>
              <p className="text-xs text-gray-700 mt-0.5 font-medium">"{query}"</p>
            </div>

            {/* Companies List */}
            <div className="flex-1 overflow-y-auto">
              {loading && (
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

              {!loading && results.length > 0 && (
                <div className="divide-y divide-gray-200">
                  {results.map((result) => (
                    <button
                      key={result.company.id}
                      onClick={() => router.push(`/companies/${result.company.id}`)}
                      className="w-full text-left p-4 hover:bg-blue-50 transition-colors"
                    >
                      <div className="flex items-start gap-2 mb-2">
                        <Building2 className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-sm text-gray-900 truncate">
                              {result.company.name}
                            </p>
                            {result.company.business.stockSymbol && (
                              <Badge variant="outline" className="text-xs">
                                {result.company.business.stockSymbol}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      {result.company.geography.headquarters && (
                        <p className="text-xs text-gray-700 mb-2 flex items-center gap-1 font-medium">
                          <MapPin className="h-3 w-3" />
                          {result.company.geography.headquarters}
                        </p>
                      )}

                      <div className="flex items-center gap-3 text-xs">
                        {result.company.metrics.revenue && (
                          <span className="text-green-600 font-medium">
                            ${(result.company.metrics.revenue / 1_000_000).toFixed(0)}M
                          </span>
                        )}
                        {result.score > 0 && (
                          <Badge variant="secondary" className="text-xs">
                            {Math.round(result.score)}% match
                          </Badge>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {!loading && results.length === 0 && (
                <div className="p-6 text-center">
                  <Building2 className="h-8 w-8 mx-auto mb-2 text-gray-600" />
                  <p className="text-sm text-gray-800 font-medium">No companies found</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Info */}
          <div className="flex-1 overflow-y-auto bg-white p-6">
            <div className="flex flex-col items-center justify-center h-full text-center">
              <Building2 className="h-16 w-16 mb-4 text-gray-400" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Click a Company to View Details</h3>
              <p className="text-gray-700 font-medium max-w-md">
                Select any company from the list to see their full profile including news, documents, and detailed data.
              </p>
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
