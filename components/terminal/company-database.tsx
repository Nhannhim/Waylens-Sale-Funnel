'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CompanySearchBar } from '@/components/company-search-bar';
import { useCompanyData } from '@/lib/use-company-data';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, MapPin, TrendingUp, Search } from 'lucide-react';

export function CompanyDatabase() {
  const router = useRouter();
  const { dataset, loading } = useCompanyData();
  const [searchQuery, setSearchQuery] = useState('');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-700 font-medium">Loading database...</p>
        </div>
      </div>
    );
  }

  const companies = dataset?.companies || [];

  const handleCompanyClick = (companyId: string) => {
    router.push(`/companies/${companyId}`);
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-blue-600 rounded flex items-center justify-center">
            <Building2 className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Fleet Management Company Database</h1>
            <p className="text-sm text-gray-700 font-medium mt-1">
              {companies.length.toLocaleString()} companies in telematics and fleet management
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <CompanySearchBar 
          placeholder="Search companies by name, keyword, or industry..."
          onSelect={(companyId) => handleCompanyClick(companyId)}
        />
      </div>

      {/* Company Grid */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {companies.slice(0, 50).map((company) => (
            <Card 
              key={company.id} 
              className="bg-white hover:shadow-lg transition-shadow cursor-pointer" 
              onClick={() => handleCompanyClick(company.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 font-bold text-sm">
                      {company.name.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm text-gray-900 mb-1 truncate">
                      {company.name}
                    </h3>
                    {company.business.stockSymbol && (
                      <Badge variant="outline" className="text-xs mb-2">
                        {company.business.stockSymbol}
                      </Badge>
                    )}
                    {company.geography.headquarters && (
                      <p className="text-xs text-gray-700 mb-2 flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {company.geography.headquarters}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      {company.metrics.revenue && (
                        <span className="text-xs text-green-600 font-medium">
                          ${(company.metrics.revenue / 1_000_000).toFixed(0)}M
                        </span>
                      )}
                      {company.metrics.fleetSize && (
                        <span className="text-xs text-blue-600 font-medium">
                          {(company.metrics.fleetSize / 1_000).toFixed(0)}K fleet
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {companies.length > 50 && (
          <div className="text-center mt-6">
            <p className="text-sm text-gray-700 font-medium">
              Showing 50 of {companies.length.toLocaleString()} companies
            </p>
            <p className="text-xs text-gray-600 mt-1">
              Use the search bar to find specific companies
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
