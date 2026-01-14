'use client';

import { useState } from 'react';
import { useCompanyData, useCompanySearch, useTopCompanies, useDatasetStatistics } from '@/lib/use-company-data';
import { SearchFilters } from '@/lib/company-search';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';
import { Search, ChevronRight } from 'lucide-react';

export function CompanySearchDemo() {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({});
  const { statistics, loading: statsLoading } = useDatasetStatistics();
  
  const handleSearch = () => {
    setFilters({ ...filters, query });
  };

  return (
    <div className="w-full space-y-6 p-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Fleet Management Company Database</h1>
        <p className="text-muted-foreground">
          Search and explore {statistics?.totalCompanies || '500+'} fleet management and telematics companies
        </p>
      </div>

      {/* Statistics Overview */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Companies</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statistics.totalCompanies}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Fleet Size</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(statistics.totalFleetSize / 1_000_000).toFixed(1)}M
              </div>
              <p className="text-xs text-muted-foreground">vehicles tracked</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${(statistics.totalRevenue / 1_000_000_000).toFixed(1)}B
              </div>
              <p className="text-xs text-muted-foreground">combined annual</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Markets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statistics.geographies}</div>
              <p className="text-xs text-muted-foreground">geographic regions</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Search Bar */}
      <Card>
        <CardHeader>
          <CardTitle>Search Companies</CardTitle>
          <CardDescription>
            Search by company name, keywords, revenue, fleet size, or geography
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Search companies (e.g., Geotab, Samsara, video telematics...)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1"
            />
            <Button onClick={handleSearch}>
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Revenue Range</label>
              <Select
                onValueChange={(value) =>
                  setFilters({ ...filters, revenueRange: value ? [value] : undefined })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Any revenue" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="micro">Micro (&lt;$10M)</SelectItem>
                  <SelectItem value="small">Small ($10M-$50M)</SelectItem>
                  <SelectItem value="medium">Medium ($50M-$250M)</SelectItem>
                  <SelectItem value="large">Large ($250M-$1B)</SelectItem>
                  <SelectItem value="enterprise">Enterprise (&gt;$1B)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Fleet Size</label>
              <Select
                onValueChange={(value) =>
                  setFilters({ ...filters, fleetSizeRange: value ? [value] : undefined })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Any size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="micro">Micro (&lt;1K)</SelectItem>
                  <SelectItem value="small">Small (1K-10K)</SelectItem>
                  <SelectItem value="medium">Medium (10K-100K)</SelectItem>
                  <SelectItem value="large">Large (100K-500K)</SelectItem>
                  <SelectItem value="very-large">Very Large (500K-1M)</SelectItem>
                  <SelectItem value="enterprise">Enterprise (&gt;1M)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Geography</label>
              <Select
                onValueChange={(value) =>
                  setFilters({ ...filters, geography: value ? [value] : undefined })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Any location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="us">United States</SelectItem>
                  <SelectItem value="canada">Canada</SelectItem>
                  <SelectItem value="mexico">Mexico</SelectItem>
                  <SelectItem value="brazil">Brazil</SelectItem>
                  <SelectItem value="chile">Chile</SelectItem>
                  <SelectItem value="colombia">Colombia</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="search" className="w-full">
        <TabsList>
          <TabsTrigger value="search">Search Results</TabsTrigger>
          <TabsTrigger value="top-revenue">Top by Revenue</TabsTrigger>
          <TabsTrigger value="top-fleet">Top by Fleet Size</TabsTrigger>
        </TabsList>

        <TabsContent value="search" className="space-y-4">
          <SearchResults filters={filters} />
        </TabsContent>

        <TabsContent value="top-revenue" className="space-y-4">
          <TopCompaniesList metric="revenue" />
        </TabsContent>

        <TabsContent value="top-fleet" className="space-y-4">
          <TopCompaniesList metric="fleetSize" />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function SearchResults({ filters }: { filters: SearchFilters }) {
  const { results, loading } = useCompanySearch(filters);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          No companies found. Try adjusting your search criteria.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Found {results.length} {results.length === 1 ? 'company' : 'companies'}
      </p>
      {results.map((result) => (
        <CompanyCard key={result.company.id} company={result.company} />
      ))}
    </div>
  );
}

function TopCompaniesList({ metric }: { metric: 'revenue' | 'fleetSize' }) {
  const { companies, loading } = useTopCompanies(metric, 20);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {companies.map((company, index) => (
        <CompanyCard key={company.id} company={company} rank={index + 1} />
      ))}
    </div>
  );
}

function CompanyCard({ company, rank }: { company: any; rank?: number }) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/companies/${company.id}`);
  };

  return (
    <Card 
      className="cursor-pointer transition-all hover:shadow-lg hover:border-primary/50"
      onClick={handleClick}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-2">
              {rank && (
                <Badge variant="secondary" className="text-lg font-bold">
                  #{rank}
                </Badge>
              )}
              <CardTitle className="flex items-center gap-2 group">
                {company.name}
                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </CardTitle>
            </div>
            {company.geography.headquarters && (
              <CardDescription>
                📍 {company.geography.headquarters}
              </CardDescription>
            )}
          </div>
          {company.business.stockSymbol && (
            <Badge variant="outline">{company.business.stockSymbol}</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {company.metrics.revenue && (
            <div>
              <p className="text-xs text-muted-foreground">Revenue</p>
              <p className="font-semibold">
                ${(company.metrics.revenue / 1_000_000).toFixed(0)}M
              </p>
              <Badge variant="secondary" className="text-xs mt-1">
                {company.metrics.revenueRange}
              </Badge>
            </div>
          )}
          {company.metrics.fleetSize && (
            <div>
              <p className="text-xs text-muted-foreground">Fleet Size</p>
              <p className="font-semibold">
                {(company.metrics.fleetSize / 1000).toFixed(0)}K
              </p>
              <Badge variant="secondary" className="text-xs mt-1">
                {company.metrics.fleetSizeRange}
              </Badge>
            </div>
          )}
          {company.metrics.valuation && (
            <div>
              <p className="text-xs text-muted-foreground">Valuation</p>
              <p className="font-semibold">
                ${(company.metrics.valuation / 1_000_000_000).toFixed(1)}B
              </p>
              <Badge variant="secondary" className="text-xs mt-1">
                {company.metrics.valuationRange}
              </Badge>
            </div>
          )}
          {company.metrics.employees && (
            <div>
              <p className="text-xs text-muted-foreground">Employees</p>
              <p className="font-semibold">{company.metrics.employees.toLocaleString()}</p>
            </div>
          )}
        </div>

        {/* Geography */}
        {company.geography.markets.length > 0 && (
          <div>
            <p className="text-xs text-muted-foreground mb-2">Markets</p>
            <div className="flex flex-wrap gap-1">
              {company.geography.markets.slice(0, 10).map((market: string) => (
                <Badge key={market} variant="outline" className="text-xs">
                  {market}
                </Badge>
              ))}
              {company.geography.markets.length > 10 && (
                <Badge variant="outline" className="text-xs">
                  +{company.geography.markets.length - 10} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Products */}
        {company.business.products && company.business.products.length > 0 && (
          <div>
            <p className="text-xs text-muted-foreground mb-2">Products & Services</p>
            <div className="flex flex-wrap gap-1">
              {company.business.products.slice(0, 5).map((product: string) => (
                <Badge key={product} variant="secondary" className="text-xs">
                  {product}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Keywords */}
        {company.keywords.length > 0 && (
          <div>
            <p className="text-xs text-muted-foreground mb-2">Tags</p>
            <div className="flex flex-wrap gap-1">
              {company.keywords.slice(0, 8).map((keyword: string) => (
                <Badge key={keyword} variant="outline" className="text-xs">
                  {keyword}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Relationships */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {company.relationships.customers && company.relationships.customers.length > 0 && (
            <div>
              <p className="text-muted-foreground mb-1">Customers</p>
              <p className="font-medium">{company.relationships.customers.length} references</p>
            </div>
          )}
          {company.relationships.partners && company.relationships.partners.length > 0 && (
            <div>
              <p className="text-muted-foreground mb-1">Partners</p>
              <p className="font-medium">{company.relationships.partners.length} partnerships</p>
            </div>
          )}
          {company.relationships.acquisitions && company.relationships.acquisitions.length > 0 && (
            <div>
              <p className="text-muted-foreground mb-1">Acquisitions</p>
              <p className="font-medium">{company.relationships.acquisitions.length} companies</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
