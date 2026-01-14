'use client';

import { useCompanyData } from '@/lib/use-company-data';
import { CompanySearchBar } from '@/components/company-search-bar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TestSearchPage() {
  const { dataset, search, loading, error } = useCompanyData();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Search Test Page</h1>
      
      {/* Debug Info */}
      <Card>
        <CardHeader>
          <CardTitle>Debug Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div>
            <strong>Loading:</strong> {loading ? 'Yes' : 'No'}
          </div>
          <div>
            <strong>Error:</strong> {error || 'None'}
          </div>
          <div>
            <strong>Dataset Loaded:</strong> {dataset ? 'Yes' : 'No'}
          </div>
          <div>
            <strong>Search Available:</strong> {search ? 'Yes' : 'No'}
          </div>
          {dataset && (
            <div>
              <strong>Total Companies:</strong> {dataset.companies.length}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Search Bar */}
      <Card>
        <CardHeader>
          <CardTitle>Search Bar</CardTitle>
        </CardHeader>
        <CardContent>
          <CompanySearchBar />
        </CardContent>
      </Card>

      {/* Sample Companies */}
      {dataset && (
        <Card>
          <CardHeader>
            <CardTitle>Sample Companies (First 10)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {dataset.companies.slice(0, 10).map((company) => (
                <div key={company.id} className="p-2 border rounded">
                  <strong>{company.name}</strong>
                  {' - '}
                  {company.id}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Test Search Directly */}
      {search && (
        <Card>
          <CardHeader>
            <CardTitle>Direct Search Test</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p>Testing search for "Samsara":</p>
              <pre className="bg-muted p-4 rounded overflow-x-auto">
                {JSON.stringify(
                  search.search({ query: 'Samsara' }).slice(0, 3),
                  null,
                  2
                )}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
