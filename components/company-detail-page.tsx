'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ArrowLeft,
  FileText,
  Search,
  ChevronDown,
  ChevronRight,
  Truck,
  Globe,
} from 'lucide-react';
import { Sidebar } from '@/components/terminal/sidebar';

interface CompanyDetailPageProps {
  companyId: string;
}

interface CSVData {
  filename: string;
  topic: string;
  columns: string[];
  rows: Record<string, string>[];
  totalRows: number;
}

interface VendorInfo {
  rank: number;
  installedBase: string;
  geographicFocus: string;
  estimatedUnits: string;
  keyStrengths: string;
  ownership: string;
  notes: string;
}

interface CompanyDataResponse {
  success: boolean;
  company: string;
  csvFiles: CSVData[];
  vendorInfo?: VendorInfo;
  error?: string;
}

export function CompanyDetailPage({ companyId }: CompanyDetailPageProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [companyData, setCompanyData] = useState<CompanyDataResponse | null>(null);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [filterText, setFilterText] = useState('');
  const [activeSection, setActiveSection] = useState("search");

  useEffect(() => {
    async function fetchCompanyData() {
      try {
        const response = await fetch(`/api/company-data?company=${encodeURIComponent(companyId)}`);
        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || 'Failed to fetch company data');
        }

        setCompanyData(data);
        if (data.csvFiles.length > 0) {
          setExpandedSections(data.csvFiles.slice(0, 3).map((f: CSVData) => f.filename));
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchCompanyData();
  }, [companyId]);

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    sessionStorage.setItem('navigateToSection', section);
    router.push('/');
  };

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

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error || !companyData) {
    return (
      <div className="flex h-screen bg-gray-100 overflow-hidden">
        <Sidebar activeSection={activeSection} onSectionChange={handleSectionChange} />
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardContent className="py-8 px-6 text-center">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Company Not Found</h2>
              <p className="text-gray-600 mb-4 text-sm">
                {error || 'No data available for this company.'}
              </p>
              <Button
                onClick={() => handleSectionChange('search')}
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Market
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const { company, csvFiles, vendorInfo } = companyData;

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <Sidebar activeSection={activeSection} onSectionChange={handleSectionChange} />

      <main className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {/* Compact Header */}
        <div className="flex items-center justify-between mb-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleSectionChange('search')}
            className="bg-white text-gray-700 hover:bg-gray-100 border-gray-300 h-8 text-xs"
          >
            <ArrowLeft className="mr-1 h-3 w-3" />
            Back
          </Button>
          <div className="relative w-48">
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

        {/* Company Summary Bar */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
              {company.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold text-gray-900">{company}</h1>
                {vendorInfo && (
                  <Badge className="text-xs bg-gray-100 text-gray-700 border-gray-300">
                    {vendorInfo.ownership}
                  </Badge>
                )}
              </div>
              {vendorInfo && (
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Truck className="h-4 w-4 text-blue-500" />
                    {formatNumber(vendorInfo.estimatedUnits)} units
                  </span>
                  <span className="flex items-center gap-1">
                    <Globe className="h-4 w-4 text-green-500" />
                    {vendorInfo.geographicFocus}
                  </span>
                  {vendorInfo.keyStrengths && (
                    <span className="text-gray-500">
                      {vendorInfo.keyStrengths}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Data Sections */}
        {csvFiles.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
            <FileText className="h-10 w-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600 text-sm">No CSV data files found for this company.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {csvFiles.map((csvFile) => {
              const isExpanded = expandedSections.includes(csvFile.filename);
              const filteredRows = filterRows(csvFile.rows);

              return (
                <div key={csvFile.filename} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                  <button
                    className="w-full flex items-center px-3 py-2 hover:bg-gray-50 transition-colors"
                    onClick={() => toggleSection(csvFile.filename)}
                  >
                    <div className="flex items-center gap-2">
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      )}
                      <span className="font-medium text-sm text-gray-900">
                        {csvFile.topic}
                      </span>
                      <span className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                        {csvFile.totalRows} rows
                      </span>
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="border-t border-gray-100">
                      {filteredRows.length === 0 ? (
                        <p className="text-sm text-gray-500 italic p-3">
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
                                      className="py-1.5 px-3 text-gray-700"
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
      </main>
    </div>
  );
}

function formatNumber(value: string): string {
  // Extract just the number and format with commas
  const numStr = value.replace(/[^0-9]/g, '');
  const num = parseInt(numStr, 10);
  if (isNaN(num)) return value;
  return num.toLocaleString();
}

function formatCellValue(value: string): React.ReactNode {
  if (!value) return <span className="text-gray-300">-</span>;

  // Check if it's a pure number (no special chars except commas)
  const cleanValue = value.replace(/,/g, '');
  const num = parseFloat(cleanValue);

  if (!isNaN(num) && /^-?[\d.]+$/.test(cleanValue)) {
    // Format large numbers with commas
    const formatted = num.toLocaleString();
    if (num >= 1000000) {
      return <span className="font-medium text-green-700">{formatted}</span>;
    }
    if (num >= 1000) {
      return <span className="font-medium text-gray-900">{formatted}</span>;
    }
    return <span className="text-gray-700">{formatted}</span>;
  }

  // Check for percentage
  if (value.includes('%')) {
    return <span className="font-medium text-blue-700">{value}</span>;
  }

  // Check for currency
  if (value.includes('$')) {
    return <span className="font-medium text-green-700">{value}</span>;
  }

  // Check if it looks like a year
  if (/^\d{4}$/.test(value)) {
    return <span className="text-gray-600">{value}</span>;
  }

  // Long text gets truncated
  if (value.length > 80) {
    return (
      <span title={value} className="cursor-help text-gray-700">
        {value.slice(0, 80)}...
      </span>
    );
  }

  return <span className="text-gray-700">{value}</span>;
}

function LoadingSkeleton() {
  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <div className="w-16 bg-[#2d2d2d]" />
      <div className="flex-1 p-4 bg-gray-50">
        <Skeleton className="h-8 w-24 mb-3" />
        <Skeleton className="h-16 w-full mb-3" />
        <div className="space-y-2">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-10" />
          ))}
        </div>
      </div>
    </div>
  );
}
