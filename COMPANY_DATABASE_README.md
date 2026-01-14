# Fleet Management Company Database

A comprehensive, searchable database of 520+ fleet management and telematics companies extracted from the Waylens filtered data.

## 📊 Dataset Overview

- **Total Companies**: 522
- **Total Fleet Size**: 20M+ vehicles tracked
- **Total Revenue**: $30B+ combined annual revenue
- **Geographic Coverage**: 12+ regions across Americas

### Categories & Keywords

The database automatically categorizes companies by:

- **Revenue Ranges**: 
  - Micro: <$10M
  - Small: $10M-$50M
  - Medium: $50M-$250M
  - Large: $250M-$1B
  - Enterprise: >$1B

- **Fleet Size Ranges**:
  - Micro: <1K vehicles
  - Small: 1K-10K vehicles
  - Medium: 10K-100K vehicles
  - Large: 100K-500K vehicles
  - Very Large: 500K-1M vehicles
  - Enterprise: >1M vehicles

- **Valuation Ranges**:
  - Small: <$50M
  - Medium: $50M-$500M
  - Large: $500M-$1B
  - Unicorn: $1B-$5B
  - Mega-unicorn: >$5B

## 🚀 Usage

### 1. Generate the Dataset

First, process the CSV files to generate the searchable JSON database:

```bash
npm run generate-dataset
# or
npx tsx scripts/generate-dataset.ts
```

This creates `public/data/companies-dataset.json` with all company data.

### 2. Basic Search

Use the `useCompanySearch` hook for searching:

```tsx
import { useCompanySearch } from '@/lib/use-company-data';

function SearchComponent() {
  const { results, loading } = useCompanySearch({
    query: 'video telematics',
    revenueRange: ['large', 'enterprise'],
    geography: ['us', 'canada'],
  });

  return (
    <div>
      {results.map(result => (
        <div key={result.company.id}>
          <h3>{result.company.name}</h3>
          <p>Score: {result.score}</p>
        </div>
      ))}
    </div>
  );
}
```

### 3. Search by Company Name

```tsx
import { useCompanyByName } from '@/lib/use-company-data';

function CompanyProfile() {
  const { company, loading } = useCompanyByName('Geotab');

  if (loading) return <div>Loading...</div>;
  if (!company) return <div>Company not found</div>;

  return (
    <div>
      <h1>{company.name}</h1>
      <p>Revenue: ${company.metrics.revenue?.toLocaleString()}</p>
      <p>Fleet Size: {company.metrics.fleetSize?.toLocaleString()}</p>
      <p>Markets: {company.geography.markets.join(', ')}</p>
    </div>
  );
}
```

### 4. Get Top Companies

```tsx
import { useTopCompanies } from '@/lib/use-company-data';

function TopCompanies() {
  const { companies, loading } = useTopCompanies('revenue', 10);

  return (
    <div>
      {companies.map((company, index) => (
        <div key={company.id}>
          <span>#{index + 1}</span>
          <span>{company.name}</span>
          <span>${(company.metrics.revenue / 1_000_000).toFixed(0)}M</span>
        </div>
      ))}
    </div>
  );
}
```

### 5. Dataset Statistics

```tsx
import { useDatasetStatistics } from '@/lib/use-company-data';

function Statistics() {
  const { statistics, loading } = useDatasetStatistics();

  return (
    <div>
      <p>Total Companies: {statistics?.totalCompanies}</p>
      <p>Total Fleet Size: {statistics?.totalFleetSize}</p>
      <p>Average Revenue: ${statistics?.averageRevenue?.toLocaleString()}</p>
    </div>
  );
}
```

## 🔍 Search Filters

The search API supports the following filters:

```typescript
interface SearchFilters {
  query?: string;              // Text search
  revenueRange?: string[];     // ['micro', 'small', 'medium', 'large', 'enterprise']
  fleetSizeRange?: string[];   // ['micro', 'small', 'medium', 'large', 'very-large', 'enterprise']
  valuationRange?: string[];   // ['small', 'medium', 'large', 'unicorn', 'mega-unicorn']
  geography?: string[];        // ['us', 'canada', 'mexico', 'brazil', etc.]
  products?: string[];         // ['Video Telematics', 'ELD', etc.]
  ownership?: string[];        // ['public', 'private', etc.]
  minRevenue?: number;         // Minimum revenue in USD
  maxRevenue?: number;         // Maximum revenue in USD
  minFleetSize?: number;       // Minimum fleet size
  maxFleetSize?: number;       // Maximum fleet size
}
```

## 📦 Data Structure

Each company entry includes:

```typescript
interface CompanyData {
  id: string;
  name: string;
  category: string[];
  keywords: string[];          // Auto-generated search keywords
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
  sourceFiles: string[];       // Original CSV files
  lastUpdated: string;
}
```

## 🎯 Example Searches

### Find large US-based video telematics companies
```tsx
const { results } = useCompanySearch({
  query: 'video telematics',
  revenueRange: ['large', 'enterprise'],
  geography: ['us'],
});
```

### Find unicorn companies with enterprise fleets
```tsx
const { results } = useCompanySearch({
  valuationRange: ['unicorn', 'mega-unicorn'],
  fleetSizeRange: ['enterprise'],
});
```

### Find companies in Mexico with fleet management
```tsx
const { results } = useCompanySearch({
  query: 'fleet management',
  geography: ['mexico'],
});
```

### Find companies with revenue between $100M-$500M
```tsx
const { results } = useCompanySearch({
  minRevenue: 100_000_000,
  maxRevenue: 500_000_000,
});
```

## 🔧 Programmatic API

You can also use the search API directly without React hooks:

```typescript
import { CompanySearch } from '@/lib/company-search';
import dataset from '@/public/data/companies-dataset.json';

const search = new CompanySearch(dataset.companies);

// Search
const results = search.search({ query: 'Geotab' });

// Get by name
const company = search.getByName('Samsara');

// Get by category
const videoCompanies = search.getByCategory('video telematics');

// Get by revenue range
const largeCompanies = search.getByRevenueRange('large');

// Get top companies
const topByRevenue = search.getTopByMetric('revenue', 10);
const topByFleet = search.getTopByMetric('fleetSize', 10);

// Get statistics
const stats = search.getStatistics();
```

## 📝 Notes

- The dataset is automatically generated from 419 CSV files
- Some CSV files have inconsistent columns and are skipped during processing
- Keywords are auto-generated based on company attributes
- Search results are scored and ranked by relevance
- The dataset file is located at `public/data/companies-dataset.json` (~2-5MB)

## 🔄 Regenerating the Dataset

To regenerate the dataset after updating CSV files:

```bash
npm run generate-dataset
```

This will:
1. Parse all CSV files in `waylens_filtered_data/high_priority/`
2. Extract and consolidate company information
3. Generate search keywords and categories
4. Build search indexes
5. Export to `public/data/companies-dataset.json`

## 🚀 Demo Component

A complete demo component is available at `components/company-search-demo.tsx` that shows:
- Full-text search
- Advanced filters (revenue, fleet size, geography)
- Top companies by metric
- Company details cards
- Dataset statistics

Import and use it:

```tsx
import { CompanySearchDemo } from '@/components/company-search-demo';

export default function Page() {
  return <CompanySearchDemo />;
}
```

## 📊 Key Companies in Database

Top companies by fleet size:
- Geotab: 4.5M+ vehicles
- Verizon Connect: 1.6M+ vehicles  
- Samsara: 1.4M+ vehicles
- CalAmp: 1M+ vehicles
- Lytx: 900K+ vehicles

Top companies by revenue:
- Verizon Connect: $1B+
- Samsara: $937M
- Geotab: $560M
- Solera Fleet Solutions: $562M
- CalAmp: $295M
