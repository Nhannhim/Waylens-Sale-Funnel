'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { CompanySearch, SearchFilters, SearchResult } from './company-search';
import type { CompanyData } from './data-processor';

interface CompanyDataset {
  companies: CompanyData[];
  metadata: {
    totalCompanies: number;
    generatedAt: string;
    version: string;
  };
  indexes: {
    revenueRanges: string[];
    fleetSizeRanges: string[];
    valuationRanges: string[];
    geographies: string[];
    keywords: string[];
  };
}

export function useCompanyData() {
  const [dataset, setDataset] = useState<CompanyDataset | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDataset() {
      try {
        const response = await fetch('/data/companies-dataset.json');
        if (!response.ok) {
          throw new Error('Failed to load dataset');
        }
        const data = await response.json();
        setDataset(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    }

    loadDataset();
  }, []);

  const search = useMemo(() => {
    if (!dataset) return null;
    return new CompanySearch(dataset.companies);
  }, [dataset]);

  return {
    dataset,
    search,
    loading,
    error,
  };
}

export function useCompanySearch(filters: SearchFilters) {
  const { search, loading } = useCompanyData();
  const [results, setResults] = useState<SearchResult[]>([]);
  
  // Use JSON.stringify for stable comparison of filter object
  const filtersJson = JSON.stringify(filters);

  useEffect(() => {
    if (!search) {
      setResults([]);
      return;
    }

    const searchResults = search.search(filters);
    setResults(searchResults);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, filtersJson]);

  return {
    results,
    loading,
  };
}

export function useCompanyByName(name: string) {
  const { search, loading } = useCompanyData();
  const [company, setCompany] = useState<CompanyData | null>(null);

  useEffect(() => {
    if (!search || !name) {
      setCompany(null);
      return;
    }

    const found = search.getByName(name);
    setCompany(found);
  }, [search, name]);

  return {
    company,
    loading,
  };
}

export function useTopCompanies(metric: 'revenue' | 'fleetSize' | 'valuation' | 'employees' = 'revenue', limit: number = 10) {
  const { search, loading } = useCompanyData();
  const [companies, setCompanies] = useState<CompanyData[]>([]);

  useEffect(() => {
    if (!search) {
      setCompanies([]);
      return;
    }

    const top = search.getTopByMetric(metric, limit);
    setCompanies(top);
  }, [search, metric, limit]);

  return {
    companies,
    loading,
  };
}

export function useDatasetStatistics() {
  const { search, loading } = useCompanyData();
  const [statistics, setStatistics] = useState<ReturnType<CompanySearch['getStatistics']> | null>(null);

  useEffect(() => {
    if (!search) {
      setStatistics(null);
      return;
    }

    const stats = search.getStatistics();
    setStatistics(stats);
  }, [search]);

  return {
    statistics,
    loading,
  };
}
