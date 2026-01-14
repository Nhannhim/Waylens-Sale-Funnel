'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useCompanyData } from '@/lib/use-company-data';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Building2, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CompanySearchBarProps {
  className?: string;
  placeholder?: string;
  onSelect?: (companyId: string) => void;
}

export function CompanySearchBar({ 
  className, 
  placeholder = "Search companies (e.g., Geotab, Samsara, video telematics...)",
  onSelect 
}: CompanySearchBarProps) {
  const router = useRouter();
  const { search, loading, error } = useCompanyData();
  const [query, setQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);

  // Debug: Log loading state
  useEffect(() => {
    console.log('Search bar state:', { loading, hasSearch: !!search, error });
  }, [loading, search, error]);

  useEffect(() => {
    if (!search || !query.trim()) {
      setResults([]);
      return;
    }

    // Debounce search
    const timeoutId = setTimeout(() => {
      const searchResults = search.search({ query });
      setResults(searchResults.slice(0, 10)); // Show top 10 results
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, search]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (companyId: string) => {
    setShowResults(false);
    setQuery('');
    setSelectedIndex(-1);
    
    if (onSelect) {
      onSelect(companyId);
    } else {
      router.push(`/companies/${companyId}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        if (showResults && results.length > 0) {
          e.preventDefault();
          setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : prev));
        }
        break;
      case 'ArrowUp':
        if (showResults && results.length > 0) {
          e.preventDefault();
          setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
        }
        break;
      case 'Enter':
        e.preventDefault();
        if (showResults && selectedIndex >= 0 && selectedIndex < results.length) {
          // Selected a result from dropdown
          handleSelect(results[selectedIndex].company.id);
        } else if (query.trim()) {
          // No selection, navigate to search results page
          setShowResults(false);
          router.push(`/search-results?q=${encodeURIComponent(query.trim())}`);
        }
        break;
      case 'Escape':
        setShowResults(false);
        setSelectedIndex(-1);
        break;
    }
  };

  return (
    <div ref={searchRef} className={cn("relative w-full", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder={loading ? "Loading database..." : error ? "Error loading data" : placeholder}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowResults(true);
            setSelectedIndex(-1);
          }}
          onFocus={() => query && setShowResults(true)}
          onKeyDown={handleKeyDown}
          className="pl-10"
          disabled={loading}
        />
        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
          </div>
        )}
      </div>

      {showResults && results.length > 0 && (
        <Card className="absolute z-50 w-full mt-2 max-h-[400px] overflow-y-auto shadow-lg">
          <div className="p-2">
            {results.map((result, index) => (
              <button
                key={result.company.id}
                onClick={() => handleSelect(result.company.id)}
                className={cn(
                  "w-full text-left p-3 rounded-lg transition-colors",
                  "hover:bg-accent focus:bg-accent focus:outline-none",
                  selectedIndex === index && "bg-accent"
                )}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <div className="flex items-start gap-3">
                  <Building2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold truncate">{result.company.name}</p>
                      {result.company.business.stockSymbol && (
                        <Badge variant="outline" className="text-xs">
                          {result.company.business.stockSymbol}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      {result.company.metrics.revenue && (
                        <span className="flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" />
                          ${(result.company.metrics.revenue / 1_000_000).toFixed(0)}M
                        </span>
                      )}
                      {result.company.metrics.fleetSize && (
                        <span>
                          {(result.company.metrics.fleetSize / 1000).toFixed(0)}K fleet
                        </span>
                      )}
                      {result.company.geography.headquarters && (
                        <span className="truncate">
                          📍 {result.company.geography.headquarters}
                        </span>
                      )}
                    </div>

                    {result.matchedFields.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {result.matchedFields.slice(0, 3).map((field: string, idx: number) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {field.replace('keyword-', '')}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </Card>
      )}

      {showResults && query && results.length === 0 && !loading && (
        <Card className="absolute z-50 w-full mt-2 shadow-lg">
          <div className="p-4 text-center text-sm text-muted-foreground">
            No companies found for "{query}"
          </div>
        </Card>
      )}

      {error && !loading && (
        <Card className="absolute z-50 w-full mt-2 shadow-lg border-destructive">
          <div className="p-4 text-center text-sm text-destructive">
            Error: {error}. Please check that the dataset file exists at /data/companies-dataset.json
          </div>
        </Card>
      )}
    </div>
  );
}
