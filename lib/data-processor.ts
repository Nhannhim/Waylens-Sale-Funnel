import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

export interface CompanyData {
  id: string;
  name: string;
  category: string[];
  keywords: string[];
  metrics: {
    revenue?: number;
    revenueRange?: string;
    fleetSize?: number;
    fleetSizeRange?: string;
    valuation?: number;
    valuationRange?: string;
    employees?: number;
    customers?: number;
    marketCap?: number;
  };
  geography: {
    headquarters?: string;
    markets: string[];
    region: string[];
  };
  business: {
    industry?: string;
    vertical?: string[];
    products?: string[];
    ownership?: string;
    stockSymbol?: string;
    founded?: number;
  };
  financials: {
    revenue?: number;
    revenue_year?: number;
    growth_rate?: number;
    ebitda?: number;
    arr?: number;
  };
  relationships: {
    customers?: string[];
    partners?: string[];
    acquisitions?: string[];
    investors?: string[];
  };
  sourceFiles: string[];
  lastUpdated: string;
}

export interface SearchableDataset {
  companies: Map<string, CompanyData>;
  index: {
    byName: Map<string, string>; // company name -> company id
    byKeyword: Map<string, Set<string>>; // keyword -> company ids
    byCategory: Map<string, Set<string>>; // category -> company ids
    byRevenueRange: Map<string, Set<string>>;
    byFleetSize: Map<string, Set<string>>;
    byValuation: Map<string, Set<string>>;
    byGeography: Map<string, Set<string>>;
  };
}

export class DataProcessor {
  private dataset: SearchableDataset;
  private dataDir: string;

  constructor(dataDir: string) {
    this.dataDir = dataDir;
    this.dataset = {
      companies: new Map(),
      index: {
        byName: new Map(),
        byKeyword: new Map(),
        byCategory: new Map(),
        byRevenueRange: new Map(),
        byFleetSize: new Map(),
        byValuation: new Map(),
        byGeography: new Map(),
      },
    };
  }

  // Categorize revenue into ranges
  private getRevenueRange(revenue: number): string {
    if (revenue < 10_000_000) return 'micro'; // < $10M
    if (revenue < 50_000_000) return 'small'; // $10M - $50M
    if (revenue < 250_000_000) return 'medium'; // $50M - $250M
    if (revenue < 1_000_000_000) return 'large'; // $250M - $1B
    return 'enterprise'; // > $1B
  }

  // Categorize fleet size into ranges
  private getFleetSizeRange(fleetSize: number): string {
    if (fleetSize < 1_000) return 'micro'; // < 1k
    if (fleetSize < 10_000) return 'small'; // 1k - 10k
    if (fleetSize < 100_000) return 'medium'; // 10k - 100k
    if (fleetSize < 500_000) return 'large'; // 100k - 500k
    if (fleetSize < 1_000_000) return 'very-large'; // 500k - 1M
    return 'enterprise'; // > 1M
  }

  // Categorize valuation into ranges
  private getValuationRange(valuation: number): string {
    if (valuation < 50_000_000) return 'small'; // < $50M
    if (valuation < 500_000_000) return 'medium'; // $50M - $500M
    if (valuation < 1_000_000_000) return 'large'; // $500M - $1B
    if (valuation < 5_000_000_000) return 'unicorn'; // $1B - $5B
    return 'mega-unicorn'; // > $5B
  }

  // Normalize company name for matching
  private normalizeCompanyName(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .trim();
  }

  // Extract company name from various formats
  private extractCompanyName(value: string): string {
    // Remove parenthetical info like (Powerfleet), (NYSE: IOT), etc.
    return value.replace(/\([^)]*\)/g, '').trim();
  }

  // Generate search keywords from company data
  private generateKeywords(company: CompanyData): string[] {
    const keywords = new Set<string>();

    // Add company name variations
    keywords.add(company.name.toLowerCase());
    company.name.split(/\s+/).forEach(word => keywords.add(word.toLowerCase()));

    // Add revenue-based keywords
    if (company.metrics.revenue) {
      keywords.add('revenue-' + company.metrics.revenueRange);
      if (company.metrics.revenue > 100_000_000) keywords.add('high-revenue');
      if (company.metrics.revenue < 50_000_000) keywords.add('low-revenue');
    }

    // Add fleet size keywords
    if (company.metrics.fleetSize) {
      keywords.add('fleet-' + company.metrics.fleetSizeRange);
      if (company.metrics.fleetSize > 1_000_000) keywords.add('enterprise-fleet');
      if (company.metrics.fleetSize > 500_000) keywords.add('large-fleet');
      keywords.add('fleet-management');
    }

    // Add valuation keywords
    if (company.metrics.valuation) {
      keywords.add('valuation-' + company.metrics.valuationRange);
      if (company.metrics.valuation >= 1_000_000_000) keywords.add('unicorn');
    }

    // Add geography keywords
    company.geography.markets.forEach(market => keywords.add(market.toLowerCase()));
    company.geography.region.forEach(region => keywords.add(region.toLowerCase()));

    // Add industry/vertical keywords
    company.business.vertical?.forEach(v => keywords.add(v.toLowerCase()));
    company.business.products?.forEach(p => keywords.add(p.toLowerCase()));

    // Add ownership keywords
    if (company.business.ownership) {
      keywords.add(company.business.ownership.toLowerCase());
      if (company.business.ownership.toLowerCase().includes('public')) keywords.add('publicly-traded');
      if (company.business.ownership.toLowerCase().includes('private')) keywords.add('private-company');
    }

    return Array.from(keywords).filter(k => k.length > 0);
  }

  // Parse a single CSV file
  private parseCSVFile(filePath: string): any[] {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const records = parse(content, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
      });
      return records;
    } catch (error) {
      console.warn(`Failed to parse ${filePath}:`, error);
      return [];
    }
  }

  // Get or create company entry
  private getOrCreateCompany(name: string): CompanyData {
    const normalizedName = this.normalizeCompanyName(name);
    const existingId = this.dataset.index.byName.get(normalizedName);

    if (existingId && this.dataset.companies.has(existingId)) {
      return this.dataset.companies.get(existingId)!;
    }

    const id = `company-${this.dataset.companies.size + 1}`;
    const company: CompanyData = {
      id,
      name: this.extractCompanyName(name),
      category: [],
      keywords: [],
      metrics: {},
      geography: {
        markets: [],
        region: [],
      },
      business: {
        vertical: [],
        products: [],
      },
      financials: {},
      relationships: {
        customers: [],
        partners: [],
        acquisitions: [],
        investors: [],
      },
      sourceFiles: [],
      lastUpdated: new Date().toISOString(),
    };

    this.dataset.companies.set(id, company);
    this.dataset.index.byName.set(normalizedName, id);

    return company;
  }

  // Process all CSV files
  public async processAllFiles(): Promise<void> {
    const files = fs.readdirSync(this.dataDir).filter(f => f.endsWith('.csv'));
    console.log(`Processing ${files.length} CSV files...`);

    for (const file of files) {
      const filePath = path.join(this.dataDir, file);
      await this.processFile(filePath, file);
    }

    // Generate keywords and build indexes
    this.buildSearchIndexes();

    console.log(`Processed ${this.dataset.companies.size} companies`);
  }

  // Process individual file based on its type
  private async processFile(filePath: string, fileName: string): Promise<void> {
    const records = this.parseCSVFile(filePath);
    if (records.length === 0) return;

    // Determine file type and process accordingly
    if (fileName.includes('company_data') || fileName.includes('company_profile') || fileName.includes('company_overview')) {
      this.processCompanyDataFile(records, fileName);
    } else if (fileName.includes('financial') || fileName.includes('revenue')) {
      this.processFinancialDataFile(records, fileName);
    } else if (fileName.includes('customer') || fileName.includes('customers')) {
      this.processCustomerDataFile(records, fileName);
    } else if (fileName.includes('partnership') || fileName.includes('partners')) {
      this.processPartnershipDataFile(records, fileName);
    } else if (fileName.includes('acquisition')) {
      this.processAcquisitionDataFile(records, fileName);
    } else if (fileName.includes('vendor') || fileName.includes('operator')) {
      this.processVendorDataFile(records, fileName);
    } else if (fileName.includes('pricing')) {
      this.processPricingDataFile(records, fileName);
    } else {
      // Generic processing
      this.processGenericFile(records, fileName);
    }
  }

  // Process company data files
  private processCompanyDataFile(records: any[], fileName: string): void {
    for (const record of records) {
      const companyName = record.Company || record.company || record.Metric;
      if (!companyName || companyName === 'Company') continue;

      // Extract company name from first column if it contains company data
      let actualCompanyName = companyName;
      if (fileName.includes('samsara')) actualCompanyName = 'Samsara';
      else if (fileName.includes('geotab')) actualCompanyName = 'Geotab';
      else if (fileName.includes('motive')) actualCompanyName = 'Motive';
      else if (fileName.includes('lytx')) actualCompanyName = 'Lytx';
      else if (fileName.includes('trimble')) actualCompanyName = 'Trimble';
      else if (fileName.includes('verizon')) actualCompanyName = 'Verizon Connect';

      const company = this.getOrCreateCompany(actualCompanyName);
      company.sourceFiles.push(fileName);

      // Extract metrics
      if (record.Metric && record.Value) {
        const metric = record.Metric.toLowerCase();
        const value = record.Value;

        if (metric.includes('revenue')) {
          const revenue = parseFloat(value.replace(/[^0-9.]/g, ''));
          if (!isNaN(revenue)) {
            company.metrics.revenue = revenue;
            company.financials.revenue = revenue;
            company.metrics.revenueRange = this.getRevenueRange(revenue);
          }
        } else if (metric.includes('valuation')) {
          const valuation = parseFloat(value.replace(/[^0-9.]/g, ''));
          if (!isNaN(valuation)) {
            company.metrics.valuation = valuation;
            company.metrics.valuationRange = this.getValuationRange(valuation);
          }
        } else if (metric.includes('fleet') || metric.includes('vehicle') || metric.includes('subscription')) {
          const fleetSize = parseFloat(value.replace(/[^0-9.]/g, ''));
          if (!isNaN(fleetSize)) {
            company.metrics.fleetSize = Math.max(company.metrics.fleetSize || 0, fleetSize);
            company.metrics.fleetSizeRange = this.getFleetSizeRange(company.metrics.fleetSize);
          }
        } else if (metric.includes('employee')) {
          const employees = parseFloat(value.replace(/[^0-9.]/g, ''));
          if (!isNaN(employees)) company.metrics.employees = employees;
        } else if (metric.includes('customer')) {
          const customers = parseFloat(value.replace(/[^0-9.]/g, ''));
          if (!isNaN(customers)) company.metrics.customers = customers;
        } else if (metric.includes('headquarters') || metric.includes('hq')) {
          company.geography.headquarters = value;
        } else if (metric.includes('founded')) {
          const year = parseInt(value);
          if (!isNaN(year)) company.business.founded = year;
        }
      }
    }
  }

  // Process financial data files
  private processFinancialDataFile(records: any[], fileName: string): void {
    for (const record of records) {
      const companyName = record.Company || record.company;
      if (!companyName) continue;

      const company = this.getOrCreateCompany(companyName);
      company.sourceFiles.push(fileName);

      // Extract financial metrics
      if (record.Revenue_USD_Millions) {
        const revenue = parseFloat(record.Revenue_USD_Millions) * 1_000_000;
        if (!isNaN(revenue)) {
          company.metrics.revenue = revenue;
          company.financials.revenue = revenue;
          company.metrics.revenueRange = this.getRevenueRange(revenue);
        }
      }

      if (record.Market_Cap_USD_Millions) {
        const marketCap = parseFloat(record.Market_Cap_USD_Millions) * 1_000_000;
        if (!isNaN(marketCap)) {
          company.metrics.marketCap = marketCap;
        }
      }

      if (record.YoY_Growth_Pct) {
        const growth = parseFloat(record.YoY_Growth_Pct);
        if (!isNaN(growth)) company.financials.growth_rate = growth;
      }

      if (record.EBITDA_USD_Millions) {
        const ebitda = parseFloat(record.EBITDA_USD_Millions) * 1_000_000;
        if (!isNaN(ebitda)) company.financials.ebitda = ebitda;
      }

      if (record.Stock_Symbol) {
        company.business.stockSymbol = record.Stock_Symbol;
        company.business.ownership = 'Public';
      }

      if (record.Headquarters) {
        company.geography.headquarters = record.Headquarters;
      }
    }
  }

  // Process vendor/operator data files
  private processVendorDataFile(records: any[], fileName: string): void {
    for (const record of records) {
      const companyName = record.Company || record.company;
      if (!companyName) continue;

      const company = this.getOrCreateCompany(companyName);
      company.sourceFiles.push(fileName);

      if (record.Installed_Base_Units) {
        const fleetSize = parseFloat(record.Installed_Base_Units.replace(/[^0-9.]/g, ''));
        if (!isNaN(fleetSize)) {
          company.metrics.fleetSize = fleetSize;
          company.metrics.fleetSizeRange = this.getFleetSizeRange(fleetSize);
        }
      }

      if (record.Total_Fleet) {
        const fleetSize = parseFloat(record.Total_Fleet.replace(/[^0-9.]/g, ''));
        if (!isNaN(fleetSize)) {
          company.metrics.fleetSize = fleetSize;
          company.metrics.fleetSizeRange = this.getFleetSizeRange(fleetSize);
        }
      }

      if (record.Primary_Markets_Americas || record.Primary_Markets) {
        const markets = (record.Primary_Markets_Americas || record.Primary_Markets).split(',').map((m: string) => m.trim());
        company.geography.markets.push(...markets);
      }

      if (record.Ownership) {
        company.business.ownership = record.Ownership;
      }

      if (record.Industry_Vertical) {
        company.business.vertical?.push(record.Industry_Vertical);
      }

      if (record.Key_Notes) {
        // Add key notes as keywords/categories
        if (record.Key_Notes.toLowerCase().includes('video')) {
          company.business.products?.push('Video Telematics');
        }
        if (record.Key_Notes.toLowerCase().includes('eld')) {
          company.business.products?.push('ELD');
        }
      }
    }
  }

  // Process customer data files
  private processCustomerDataFile(records: any[], fileName: string): void {
    // Extract company name from filename
    const fileCompanyName = this.extractCompanyNameFromFilename(fileName);
    if (!fileCompanyName) return;

    const company = this.getOrCreateCompany(fileCompanyName);
    company.sourceFiles.push(fileName);

    for (const record of records) {
      const customerName = record.Customer || record.customer || record.Company;
      if (customerName && !company.relationships.customers?.includes(customerName)) {
        company.relationships.customers?.push(customerName);
      }
    }
  }

  // Process partnership data files
  private processPartnershipDataFile(records: any[], fileName: string): void {
    const fileCompanyName = this.extractCompanyNameFromFilename(fileName);
    if (!fileCompanyName) return;

    const company = this.getOrCreateCompany(fileCompanyName);
    company.sourceFiles.push(fileName);

    for (const record of records) {
      const partnerName = record.Partner || record.partner || record.Company;
      if (partnerName && !company.relationships.partners?.includes(partnerName)) {
        company.relationships.partners?.push(partnerName);
      }
    }
  }

  // Process acquisition data files
  private processAcquisitionDataFile(records: any[], fileName: string): void {
    const fileCompanyName = this.extractCompanyNameFromFilename(fileName);
    if (!fileCompanyName) return;

    const company = this.getOrCreateCompany(fileCompanyName);
    company.sourceFiles.push(fileName);

    for (const record of records) {
      const acquisitionName = record.Company || record.Acquisition || record.Target;
      if (acquisitionName && !company.relationships.acquisitions?.includes(acquisitionName)) {
        company.relationships.acquisitions?.push(acquisitionName);
      }
    }
  }

  // Process pricing data files
  private processPricingDataFile(records: any[], fileName: string): void {
    for (const record of records) {
      const companyName = record.Company || record.company;
      if (!companyName) continue;

      const company = this.getOrCreateCompany(companyName);
      company.sourceFiles.push(fileName);

      // Pricing data helps categorize companies
      if (record.Monthly_Subscription_Min_USD || record.Monthly_Subscription_Max_USD) {
        company.category.push('Subscription Model');
      }
    }
  }

  // Process generic files
  private processGenericFile(records: any[], fileName: string): void {
    for (const record of records) {
      const companyName = record.Company || record.company || record.Name;
      if (!companyName) continue;

      const company = this.getOrCreateCompany(companyName);
      company.sourceFiles.push(fileName);
    }
  }

  // Extract company name from filename
  private extractCompanyNameFromFilename(fileName: string): string | null {
    // Remove file extension and number prefix
    const cleaned = fileName.replace(/^\d+_/, '').replace('.csv', '');
    
    // Common company name patterns
    const patterns = [
      /^([a-z_]+)_company/,
      /^([a-z_]+)_customer/,
      /^([a-z_]+)_partner/,
      /^([a-z_]+)_acquisition/,
      /^([a-z_]+)_/,
    ];

    for (const pattern of patterns) {
      const match = cleaned.match(pattern);
      if (match) {
        return match[1].replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      }
    }

    return null;
  }

  // Build search indexes
  private buildSearchIndexes(): void {
    for (const [id, company] of this.dataset.companies) {
      // Generate and store keywords
      company.keywords = this.generateKeywords(company);

      // Index by keywords
      for (const keyword of company.keywords) {
        if (!this.dataset.index.byKeyword.has(keyword)) {
          this.dataset.index.byKeyword.set(keyword, new Set());
        }
        this.dataset.index.byKeyword.get(keyword)!.add(id);
      }

      // Index by categories
      for (const category of company.category) {
        if (!this.dataset.index.byCategory.has(category)) {
          this.dataset.index.byCategory.set(category, new Set());
        }
        this.dataset.index.byCategory.get(category)!.add(id);
      }

      // Index by revenue range
      if (company.metrics.revenueRange) {
        if (!this.dataset.index.byRevenueRange.has(company.metrics.revenueRange)) {
          this.dataset.index.byRevenueRange.set(company.metrics.revenueRange, new Set());
        }
        this.dataset.index.byRevenueRange.get(company.metrics.revenueRange)!.add(id);
      }

      // Index by fleet size
      if (company.metrics.fleetSizeRange) {
        if (!this.dataset.index.byFleetSize.has(company.metrics.fleetSizeRange)) {
          this.dataset.index.byFleetSize.set(company.metrics.fleetSizeRange, new Set());
        }
        this.dataset.index.byFleetSize.get(company.metrics.fleetSizeRange)!.add(id);
      }

      // Index by valuation
      if (company.metrics.valuationRange) {
        if (!this.dataset.index.byValuation.has(company.metrics.valuationRange)) {
          this.dataset.index.byValuation.set(company.metrics.valuationRange, new Set());
        }
        this.dataset.index.byValuation.get(company.metrics.valuationRange)!.add(id);
      }

      // Index by geography
      for (const market of company.geography.markets) {
        const normalized = market.toLowerCase().trim();
        if (!this.dataset.index.byGeography.has(normalized)) {
          this.dataset.index.byGeography.set(normalized, new Set());
        }
        this.dataset.index.byGeography.get(normalized)!.add(id);
      }
    }
  }

  // Export dataset to JSON
  public exportToJSON(outputPath: string): void {
    const exportData = {
      companies: Array.from(this.dataset.companies.values()),
      metadata: {
        totalCompanies: this.dataset.companies.size,
        generatedAt: new Date().toISOString(),
        version: '1.0.0',
      },
      indexes: {
        revenueRanges: Array.from(this.dataset.index.byRevenueRange.keys()),
        fleetSizeRanges: Array.from(this.dataset.index.byFleetSize.keys()),
        valuationRanges: Array.from(this.dataset.index.byValuation.keys()),
        geographies: Array.from(this.dataset.index.byGeography.keys()),
        keywords: Array.from(this.dataset.index.byKeyword.keys()).slice(0, 1000), // Top 1000 keywords
      },
    };

    fs.writeFileSync(outputPath, JSON.stringify(exportData, null, 2));
    console.log(`Dataset exported to ${outputPath}`);
  }

  // Get dataset
  public getDataset(): SearchableDataset {
    return this.dataset;
  }
}
