import type { CompanyData } from './data-processor';

export interface SearchFilters {
  query?: string;
  revenueRange?: string[];
  fleetSizeRange?: string[];
  valuationRange?: string[];
  geography?: string[];
  products?: string[];
  ownership?: string[];
  minRevenue?: number;
  maxRevenue?: number;
  minFleetSize?: number;
  maxFleetSize?: number;
}

export interface SearchResult {
  company: CompanyData;
  score: number;
  matchedFields: string[];
}

export class CompanySearch {
  private companies: CompanyData[];
  private companyMap: Map<string, CompanyData>;
  private keywordIndex: Map<string, Set<string>>;

  constructor(companies: CompanyData[]) {
    this.companies = companies;
    this.companyMap = new Map();
    this.keywordIndex = new Map();

    // Build indexes
    this.buildIndexes();
  }

  private buildIndexes(): void {
    for (const company of this.companies) {
      this.companyMap.set(company.id, company);

      // Index keywords
      for (const keyword of company.keywords) {
        if (!this.keywordIndex.has(keyword)) {
          this.keywordIndex.set(keyword, new Set());
        }
        this.keywordIndex.get(keyword)!.add(company.id);
      }
    }
  }

  // Main search function
  public search(filters: SearchFilters): SearchResult[] {
    let candidateIds = new Set<string>(this.companyMap.keys());

    // Text search
    if (filters.query) {
      candidateIds = this.textSearch(filters.query, candidateIds);
    }

    // Apply filters
    candidateIds = this.applyFilters(candidateIds, filters);

    // Convert to results and score
    const results: SearchResult[] = [];
    for (const id of candidateIds) {
      const company = this.companyMap.get(id);
      if (!company) continue;

      const result = this.scoreResult(company, filters);
      results.push(result);
    }

    // Sort by score
    results.sort((a, b) => b.score - a.score);

    return results;
  }

  // Text search using keywords
  private textSearch(query: string, candidateIds: Set<string>): Set<string> {
    const queryLower = query.toLowerCase();
    const matchedIds = new Set<string>();

    // Direct name match
    for (const id of candidateIds) {
      const company = this.companyMap.get(id);
      if (!company) continue;

      if (company.name.toLowerCase().includes(queryLower)) {
        matchedIds.add(id);
      }
    }

    // Keyword match
    const queryTokens = queryLower.split(/\s+/);
    for (const token of queryTokens) {
      for (const [keyword, ids] of this.keywordIndex) {
        if (keyword.includes(token) || token.includes(keyword)) {
          for (const id of ids) {
            if (candidateIds.has(id)) {
              matchedIds.add(id);
            }
          }
        }
      }
    }

    return matchedIds;
  }

  // Apply filters
  private applyFilters(candidateIds: Set<string>, filters: SearchFilters): Set<string> {
    const filtered = new Set<string>();

    for (const id of candidateIds) {
      const company = this.companyMap.get(id);
      if (!company) continue;

      // Revenue range filter
      if (filters.revenueRange && filters.revenueRange.length > 0) {
        if (!company.metrics.revenueRange || !filters.revenueRange.includes(company.metrics.revenueRange)) {
          continue;
        }
      }

      // Fleet size range filter
      if (filters.fleetSizeRange && filters.fleetSizeRange.length > 0) {
        if (!company.metrics.fleetSizeRange || !filters.fleetSizeRange.includes(company.metrics.fleetSizeRange)) {
          continue;
        }
      }

      // Valuation range filter
      if (filters.valuationRange && filters.valuationRange.length > 0) {
        if (!company.metrics.valuationRange || !filters.valuationRange.includes(company.metrics.valuationRange)) {
          continue;
        }
      }

      // Geography filter
      if (filters.geography && filters.geography.length > 0) {
        const hasGeography = filters.geography.some(geo =>
          company.geography.markets.some(m => m.toLowerCase().includes(geo.toLowerCase())) ||
          company.geography.region.some(r => r.toLowerCase().includes(geo.toLowerCase()))
        );
        if (!hasGeography) continue;
      }

      // Products filter
      if (filters.products && filters.products.length > 0) {
        const hasProduct = filters.products.some(prod =>
          company.business.products?.some(p => p.toLowerCase().includes(prod.toLowerCase()))
        );
        if (!hasProduct) continue;
      }

      // Ownership filter
      if (filters.ownership && filters.ownership.length > 0) {
        if (!company.business.ownership ||
            !filters.ownership.some(o => company.business.ownership?.toLowerCase().includes(o.toLowerCase()))) {
          continue;
        }
      }

      // Min/Max revenue
      if (filters.minRevenue !== undefined && company.metrics.revenue !== undefined) {
        if (company.metrics.revenue < filters.minRevenue) continue;
      }
      if (filters.maxRevenue !== undefined && company.metrics.revenue !== undefined) {
        if (company.metrics.revenue > filters.maxRevenue) continue;
      }

      // Min/Max fleet size
      if (filters.minFleetSize !== undefined && company.metrics.fleetSize !== undefined) {
        if (company.metrics.fleetSize < filters.minFleetSize) continue;
      }
      if (filters.maxFleetSize !== undefined && company.metrics.fleetSize !== undefined) {
        if (company.metrics.fleetSize > filters.maxFleetSize) continue;
      }

      filtered.add(id);
    }

    return filtered;
  }

  // Score search results
  private scoreResult(company: CompanyData, filters: SearchFilters): SearchResult {
    let score = 0;
    const matchedFields: string[] = [];

    // Exact name match gets highest score
    if (filters.query && company.name.toLowerCase() === filters.query.toLowerCase()) {
      score += 100;
      matchedFields.push('name-exact');
    } else if (filters.query && company.name.toLowerCase().includes(filters.query.toLowerCase())) {
      score += 50;
      matchedFields.push('name-partial');
    }

    // Keyword matches
    if (filters.query) {
      const queryTokens = filters.query.toLowerCase().split(/\s+/);
      for (const token of queryTokens) {
        for (const keyword of company.keywords) {
          if (keyword.includes(token)) {
            score += 10;
            matchedFields.push(`keyword-${keyword}`);
          }
        }
      }
    }

    // Boost for complete data
    if (company.metrics.revenue) score += 5;
    if (company.metrics.fleetSize) score += 5;
    if (company.metrics.valuation) score += 5;
    if (company.geography.headquarters) score += 2;

    // Boost for recent data
    if (company.sourceFiles.length > 3) {
      score += 10;
      matchedFields.push('rich-data');
    }

    return {
      company,
      score,
      matchedFields,
    };
  }

  // Get company by name
  public getByName(name: string): CompanyData | null {
    const normalized = name.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
    for (const company of this.companies) {
      const companyNormalized = company.name.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
      if (companyNormalized === normalized || companyNormalized.includes(normalized)) {
        return company;
      }
    }
    return null;
  }

  // Get all companies
  public getAllCompanies(): CompanyData[] {
    return this.companies;
  }

  // Get companies by category
  public getByCategory(category: string): CompanyData[] {
    return this.companies.filter(c => 
      c.category.some(cat => cat.toLowerCase().includes(category.toLowerCase()))
    );
  }

  // Get companies by revenue range
  public getByRevenueRange(range: string): CompanyData[] {
    return this.companies.filter(c => c.metrics.revenueRange === range);
  }

  // Get companies by fleet size range
  public getByFleetSizeRange(range: string): CompanyData[] {
    return this.companies.filter(c => c.metrics.fleetSizeRange === range);
  }

  // Get companies by geography
  public getByGeography(geography: string): CompanyData[] {
    const geoLower = geography.toLowerCase();
    return this.companies.filter(c =>
      c.geography.markets.some(m => m.toLowerCase().includes(geoLower)) ||
      c.geography.region.some(r => r.toLowerCase().includes(geoLower))
    );
  }

  // Get top companies by metric
  public getTopByMetric(metric: 'revenue' | 'fleetSize' | 'valuation' | 'employees', limit: number = 10): CompanyData[] {
    const sorted = [...this.companies].sort((a, b) => {
      const aValue = a.metrics[metric] || 0;
      const bValue = b.metrics[metric] || 0;
      return bValue - aValue;
    });

    return sorted.slice(0, limit);
  }

  // Get statistics
  public getStatistics() {
    return {
      totalCompanies: this.companies.length,
      companiesWithRevenue: this.companies.filter(c => c.metrics.revenue).length,
      companiesWithFleetSize: this.companies.filter(c => c.metrics.fleetSize).length,
      companiesWithValuation: this.companies.filter(c => c.metrics.valuation).length,
      totalFleetSize: this.companies.reduce((sum, c) => sum + (c.metrics.fleetSize || 0), 0),
      totalRevenue: this.companies.reduce((sum, c) => sum + (c.metrics.revenue || 0), 0),
      averageRevenue: this.companies.filter(c => c.metrics.revenue).reduce((sum, c) => sum + (c.metrics.revenue || 0), 0) / this.companies.filter(c => c.metrics.revenue).length,
      averageFleetSize: this.companies.filter(c => c.metrics.fleetSize).reduce((sum, c) => sum + (c.metrics.fleetSize || 0), 0) / this.companies.filter(c => c.metrics.fleetSize).length,
      geographies: new Set(this.companies.flatMap(c => c.geography.markets)).size,
      products: new Set(this.companies.flatMap(c => c.business.products || [])).size,
    };
  }
}
