'use client';

import { useState, useEffect } from 'react';
import { useCompanyData } from '@/lib/use-company-data';
import { CompanyData } from '@/lib/data-processor';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  FileText,
  Search,
  ChevronDown,
  ChevronRight,
  MapPin,
} from 'lucide-react';

interface CompanyTemplateProps {
  ticker?: string;
}

interface CSVData {
  filename: string;
  topic: string;
  columns: string[];
  rows: Record<string, string>[];
  totalRows: number;
}

export function CompanyTemplate({ ticker }: CompanyTemplateProps) {
  const { dataset, loading } = useCompanyData();
  const [company, setCompany] = useState<CompanyData | null>(null);
  const [csvData, setCsvData] = useState<CSVData[]>([]);
  const [loadingCSV, setLoadingCSV] = useState(true);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [filterText, setFilterText] = useState('');

  useEffect(() => {
    if (dataset && dataset.companies.length > 0) {
      // Get Samsara as the default template company
      const samsara = dataset.companies.find(c => 
        c.name.toLowerCase().includes('samsara')
      );
      setCompany(samsara || dataset.companies[0]);
    }
  }, [dataset]);

  // Fetch CSV data for the company
  useEffect(() => {
    if (!company) return;

    setLoadingCSV(true);
    fetch(`/api/company-data?company=${encodeURIComponent(company.name)}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.csvFiles) {
          setCsvData(data.csvFiles);
          if (data.csvFiles.length > 0) {
            setExpandedSections(data.csvFiles.slice(0, 2).map((f: CSVData) => f.filename));
          }
        }
        setLoadingCSV(false);
      })
      .catch(err => {
        console.error('Error loading CSV data:', err);
        setLoadingCSV(false);
      });
  }, [company]);

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

  if (loading || !company) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-700 font-medium">Loading template...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-gray-50 p-4">
      {/* Filter Box */}
      <div className="flex justify-end mb-3">
        <div className="relative w-64">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400" />
          <Input
            type="text"
            placeholder="Filter data..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="pl-7 h-8 text-xs bg-white border-gray-300 text-gray-900"
          />
        </div>
      </div>

      {/* Company Summary Card */}
      <Card className="bg-white mb-6">
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
                  <span className="font-bold">Description:</span> {company.name} {company.business.industry ? 
                    `is a ${company.business.industry.toLowerCase()} company` : 
                    'is a leading provider in the fleet management and telematics industry'
                  }{company.business.products && company.business.products.length > 0 ? 
                    `, offering ${company.business.products.slice(0, 3).join(', ')}.` : 
                    ', offering comprehensive solutions for fleet operations, vehicle tracking, and connected operations.'
                  }
                </p>
                <div className="flex items-center gap-4 mt-2 text-xs">
                  {company.geography.headquarters && (
                    <span className="text-gray-700 flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span className="font-semibold">HQ:</span> {company.geography.headquarters}
                    </span>
                  )}
                  {company.business.founded && (
                    <span className="text-gray-700">
                      <span className="font-semibold">Founded:</span> {company.business.founded}
                    </span>
                  )}
                  {company.metrics.revenue && (
                    <span className="text-green-700 font-semibold">
                      Revenue: ${(company.metrics.revenue / 1_000_000).toFixed(1)}M
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Latest News */}
      <div className="mb-6">
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
                {company.name}'s Platform Reaches 1 Million Connected Assets
              </h4>
              <p className="text-xs text-gray-700">The Wall Street Journal • 2d ago</p>
            </div>
          </div>
        </div>
      </div>

      {/* Latest Documents */}
      <div className="mb-6">
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
                      {company.name}: Initiating Coverage with Overweight Rating
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
                      Upgrade to Buy - Platform Gaining Traction
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
                      Price Target Raised - TAM Expanding
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
                      Maintaining Buy - Strong Customer Retention
                    </h4>
                    <p className="text-xs text-gray-700">09 Jan 26</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSV Data Tables */}
      <div className="mt-8">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Company Data & Intelligence</h2>
        
        {loadingCSV ? (
          <div className="space-y-2">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : csvData.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
            <FileText className="h-10 w-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600 text-sm">No detailed data files found for this company.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {csvData.map((csvFile) => {
              const isExpanded = expandedSections.includes(csvFile.filename);
              const filteredRows = filterRows(csvFile.rows);

              return (
                <div key={csvFile.filename} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                  <button
                    className="w-full flex items-center px-4 py-3 hover:bg-gray-50 transition-colors"
                    onClick={() => toggleSection(csvFile.filename)}
                  >
                    <div className="flex items-center gap-2">
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      )}
                      <span className="font-semibold text-sm text-gray-900">
                        {csvFile.topic}
                      </span>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                        {csvFile.totalRows} rows
                      </span>
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
      </div>
    </div>
  );
}

function formatCellValue(value: string): React.ReactNode {
  if (!value) return <span className="text-gray-300">-</span>;

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

  if (value.includes('%')) {
    return <span className="font-medium text-blue-700">{value}</span>;
  }

  if (value.includes('$')) {
    return <span className="font-medium text-green-700">{value}</span>;
  }

  if (/^\d{4}$/.test(value)) {
    return <span className="text-gray-600">{value}</span>;
  }

  if (value.length > 80) {
    return (
      <span title={value} className="cursor-help text-gray-700">
        {value.slice(0, 80)}...
      </span>
    );
  }

  return <span className="text-gray-700">{value}</span>;
}
