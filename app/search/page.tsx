'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CompanySearchBar } from '@/components/company-search-bar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, ArrowRight } from 'lucide-react';

export default function SearchPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/search-results?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-primary/10 mb-4">
            <Search className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold">Search Companies</h1>
          <p className="text-xl text-muted-foreground">
            Search across 520+ fleet management and telematics companies
          </p>
        </div>

        {/* Search Bar with Autocomplete */}
        <div className="w-full space-y-4">
          <div className="max-w-2xl mx-auto">
            <p className="text-sm text-muted-foreground mb-2 text-center">
              Type and select from suggestions, or press Enter to see all results
            </p>
            <CompanySearchBar className="max-w-2xl mx-auto" />
          </div>

          {/* OR Divider */}
          <div className="flex items-center gap-4 max-w-2xl mx-auto">
            <div className="flex-1 border-t" />
            <span className="text-sm text-muted-foreground">OR</span>
            <div className="flex-1 border-t" />
          </div>

          {/* Manual Search */}
          <div className="max-w-2xl mx-auto">
            <p className="text-sm text-muted-foreground mb-2 text-center">
              Search without autocomplete
            </p>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Type company name and press Enter..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pl-10"
                />
              </div>
              <Button onClick={handleSearch} disabled={!searchQuery.trim()}>
                Search
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Search Examples */}
        <Card>
          <CardHeader>
            <CardTitle>Try These Searches</CardTitle>
            <CardDescription>
              Click to search or use the examples above
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Button 
                variant="outline" 
                className="justify-start"
                onClick={() => router.push('/search-results?q=Geotab')}
              >
                Geotab
              </Button>
              <Button 
                variant="outline" 
                className="justify-start"
                onClick={() => router.push('/search-results?q=Samsara')}
              >
                Samsara
              </Button>
              <Button 
                variant="outline" 
                className="justify-start"
                onClick={() => router.push('/search-results?q=Motive')}
              >
                Motive
              </Button>
              <Button 
                variant="outline" 
                className="justify-start"
                onClick={() => router.push('/search-results?q=video+telematics')}
              >
                video telematics
              </Button>
              <Button 
                variant="outline" 
                className="justify-start"
                onClick={() => router.push('/search-results?q=ELD')}
              >
                ELD
              </Button>
              <Button 
                variant="outline" 
                className="justify-start"
                onClick={() => router.push('/search-results?q=fleet+management')}
              >
                fleet management
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Smart Search</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Find companies by name, keywords, or industry terms
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Real-time Results</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Instant autocomplete suggestions as you type
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Rich Data</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                View revenue, fleet size, markets, and more
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
